/**
 * The proposal inbox: problem proposals sent by the public form on the static site. A proposal
 * is not a ledger record. It waits here until a maintainer reads it, rewrites it as an authored
 * record in `database/problems_json/`, and publishes it through the ordinary catalog workflow,
 * or marks it rejected or spam. The inbox lives in its own SQLite file so the disposable index
 * and the auth store can be rebuilt or lost without losing a proposal.
 *
 * Public sending requires explicit basic or CAPTCHA mode. Both enforce the per-address
 * budget, honeypot, and field limits; CAPTCHA mode also verifies a provider token. Contact details are stored for the maintainers only and never served publicly.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { HttpError } from "./errors.ts";
import { newId, nowIso } from "./ids.ts";

export const SUBMISSION_STATES = ["new", "in-review", "accepted", "rejected", "spam"] as const;
export type SubmissionState = (typeof SUBMISSION_STATES)[number];

export const CAPTCHA_PROVIDERS = {
  turnstile: { verifyUrl: "https://challenges.cloudflare.com/turnstile/v0/siteverify" },
  hcaptcha: { verifyUrl: "https://api.hcaptcha.com/siteverify" },
} as const;
export type CaptchaProvider = keyof typeof CAPTCHA_PROVIDERS;

export interface CaptchaConfig {
  provider: CaptchaProvider;
  secret: string;
  /** The provider's `siteverify` endpoint, unless a test points it at a fake. */
  verifyUrl: string;
}

export interface SubmissionsConfig {
  /** The inbox database: beside the auth store unless configured, `:memory:` when the auth store is. */
  dbPath: string;
  /** Explicit opt-in; missing configuration keeps public submissions closed. */
  mode: "disabled" | "basic" | "captcha";
  /** Required in captcha mode, optional in basic mode. */
  captcha: CaptchaConfig | null;
  /** SHA-256 of a randomly generated inbox-only access key. Never a human-chosen password. */
  inboxKeyHash: string | null;
  /** Origins of the pages that post proposals, for CORS: the static site, plus the service's own origin. */
  allowedOrigins: string[];
  /** Proposals one address may send per hour, counting attempts that fail verification. */
  perAddressPerHour: number;
  /** Read the client address from `X-Forwarded-For` because a reverse proxy sits in front of the service. */
  trustProxy: boolean;
}

/** The limits the form and the API agree on; the form shows them, the API enforces them. */
export const LIMITS = {
  title: { min: 3, max: 300 },
  statement: { min: 20, max: 30_000 },
  fields: { min: 1, max: 2 },
  topics: { min: 1, max: 5 },
  tagName: { max: 100 },
  source: { max: 5_000 },
  progress: { max: 30_000 },
  references: { max: 30_000 },
  comment: { max: 30_000 },
  name: { min: 1, max: 200 },
  email: { max: 254 },
  affiliation: { max: 300 },
  captchaToken: { max: 4_096 },
} as const;

export interface Contributor {
  name: string;
  email: string;
  affiliation: string;
}

/**
 * A proposal as the form sends it and as the inbox stores it, after normalization. `fields` and
 * `topics` hold the classification the contributor intends; `newFields` and `newTopics` say
 * which of those names the contributor made up instead of picking from the taxonomy.
 */
export interface SubmissionPayload {
  title: string;
  statement: string;
  fields: string[];
  newFields: string[];
  topics: string[];
  newTopics: string[];
  source: string;
  progress: string;
  references: string;
  comment: string;
  contributor: Contributor;
}

export interface ParsedSubmission {
  payload: SubmissionPayload;
  captchaToken: string;
}

export interface SubmissionRow {
  id: string;
  receivedAt: string;
  state: SubmissionState;
  stateAt: string;
  stateBy: string | null;
  stateNote: string;
  title: string;
  contributor: Contributor;
  fields: string[];
  topics: string[];
}

export interface Submission extends SubmissionRow {
  payload: SubmissionPayload;
  contentHash: string;
  addressHash: string;
  userAgent: string;
  captchaProvider: string;
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL,
  state TEXT NOT NULL,
  state_at TEXT NOT NULL,
  state_by TEXT,
  state_note TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  contributor_name TEXT NOT NULL,
  contributor_email TEXT NOT NULL,
  payload TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  address_hash TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  captcha_provider TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS submissions_state ON submissions (state, received_at);
CREATE INDEX IF NOT EXISTS submissions_content ON submissions (content_hash, received_at);
`;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

/** Text as the inbox keeps it: Unix line endings, no control characters other than newline and tab, trimmed. */
function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n?/gu, "\n").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/gu, "").trim();
}

function names(value: unknown, what: string, max: number, issues: string[]): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) { issues.push(`${what} must be a list of names`); return []; }
  const out: string[] = [];
  for (const entry of value) {
    const name = clean(entry).replace(/\s+/gu, " ");
    if (!name) continue;
    if (name.length > LIMITS.tagName.max) { issues.push(`${what}: a name is longer than ${LIMITS.tagName.max} characters`); continue; }
    if (!out.includes(name)) out.push(name);
  }
  if (out.length > max) issues.push(`${what}: at most ${max} names`);
  return out;
}

/**
 * Check and normalize a proposal from the form. Every problem is reported at once, as a 422
 * whose message lists them, so the form can show the whole list.
 */
export function parseSubmission(raw: unknown, requireCaptcha = true): ParsedSubmission {
  if (!isRecord(raw)) throw new HttpError(422, "the proposal must be a JSON object");
  const issues: string[] = [];
  const text = (key: keyof typeof LIMITS & keyof SubmissionPayload, source: Record<string, unknown> = raw): string => {
    const value = clean(source[key]);
    const limit = LIMITS[key] as { min?: number; max: number };
    if (limit.min !== undefined && value.length < limit.min) issues.push(value ? `${key} is shorter than ${limit.min} characters` : `${key} is required`);
    if (value.length > limit.max) issues.push(`${key} is longer than ${limit.max} characters`);
    return value;
  };

  // The honeypot: a field no person sees. A script that fills every field fails here.
  if (clean(raw["extra"]) !== "") throw new HttpError(400, "a hidden anti-spam field was filled in; clear the form and try again");

  const title = text("title").replace(/\s+/gu, " ");
  const statement = text("statement");
  const fields = names(raw["fields"], "fields", LIMITS.fields.max, issues);
  if (fields.length < LIMITS.fields.min) issues.push("choose at least one field");
  const topics = names(raw["topics"], "topics", LIMITS.topics.max, issues);
  if (topics.length < LIMITS.topics.min) issues.push("choose at least one topic or add your own");
  // The contributor's own names are a subset of the classification, never a separate list.
  const newFields = names(raw["newFields"], "newFields", LIMITS.fields.max, issues).filter((name) => fields.includes(name) || (issues.push(`newFields: ${name} is not among the fields`), false));
  const newTopics = names(raw["newTopics"], "newTopics", LIMITS.topics.max, issues).filter((name) => topics.includes(name) || (issues.push(`newTopics: ${name} is not among the topics`), false));
  const source = text("source");
  const progress = text("progress");
  const references = text("references");
  const comment = text("comment");

  const person = isRecord(raw["contributor"]) ? raw["contributor"] : {};
  const name = clean(person["name"]).replace(/\s+/gu, " ");
  if (name.length < LIMITS.name.min) issues.push("your name is required");
  if (name.length > LIMITS.name.max) issues.push(`your name is longer than ${LIMITS.name.max} characters`);
  const email = clean(person["email"]);
  if (!email) issues.push("your email address is required");
  else if (email.length > LIMITS.email.max || !EMAIL.test(email)) issues.push("the email address is not valid");
  const affiliation = clean(person["affiliation"]).replace(/\s+/gu, " ");
  if (affiliation.length > LIMITS.affiliation.max) issues.push(`the affiliation is longer than ${LIMITS.affiliation.max} characters`);
  if (raw["consent"] !== true) issues.push("consent to storing your contact details for the review is required");

  const captchaToken = clean(raw["captchaToken"]);
  if (!captchaToken && requireCaptcha) issues.push("complete the human verification");
  else if (captchaToken.length > LIMITS.captchaToken.max) issues.push("the verification token is malformed");

  if (issues.length > 0) throw new HttpError(422, issues.join("; "));
  return {
    payload: { title, statement, fields, newFields, topics, newTopics, source, progress, references, comment, contributor: { name, email, affiliation } },
    captchaToken,
  };
}

/** Ask the CAPTCHA provider whether the token is genuine. A provider that cannot be reached is a 502, not a rejection. */
export async function verifyCaptcha(captcha: CaptchaConfig, token: string, remoteAddress: string | null): Promise<{ ok: boolean; codes: string[] }> {
  const body = new URLSearchParams({ secret: captcha.secret, response: token });
  if (remoteAddress) body.set("remoteip", remoteAddress);
  let response: Response;
  let result: { success?: unknown; "error-codes"?: unknown };
  try {
    response = await fetch(captcha.verifyUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body, signal: AbortSignal.timeout(10_000) });
    result = (await response.json().catch(() => ({}))) as { success?: unknown; "error-codes"?: unknown };
  } catch {
    throw new HttpError(502, "the human verification service could not be reached; try again in a moment");
  }
  const codes = Array.isArray(result["error-codes"]) ? result["error-codes"].map(String) : [];
  return { ok: response.ok && result.success === true, codes };
}

export function contentHash(payload: SubmissionPayload): string {
  return createHash("sha256").update(JSON.stringify([payload.title.toLowerCase(), payload.statement, payload.contributor.email.toLowerCase()])).digest("hex");
}

export const hashAddress = (address: string): string => createHash("sha256").update(`address:${address}`).digest("hex");

interface StoredRow {
  id: string; received_at: string; state: string; state_at: string; state_by: string | null; state_note: string;
  title: string; contributor_name: string; contributor_email: string; payload: string; content_hash: string; address_hash: string; user_agent: string; captcha_provider: string;
}

const ROW_COLUMNS = "id, received_at, state, state_at, state_by, state_note, title, contributor_name, contributor_email, payload, content_hash, address_hash, user_agent, captcha_provider";

export class SubmissionStore {
  readonly db: DatabaseSync;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec(SCHEMA);
  }

  /**
   * File a verified proposal. The same proposal sent twice within a day (same title, statement,
   * and email, as when a browser retries) is filed once; the reply says so.
   */
  accept(payload: SubmissionPayload, meta: { address: string; userAgent: string; captchaProvider: string }, now: number = Date.now()): { id: string; receivedAt: string; duplicate: boolean } {
    const hash = contentHash(payload);
    const since = new Date(now - DUPLICATE_WINDOW_MS).toISOString();
    const existing = this.db.prepare("SELECT id, received_at FROM submissions WHERE content_hash = ? AND received_at >= ? ORDER BY received_at DESC LIMIT 1").get(hash, since) as { id: string; received_at: string } | undefined;
    if (existing) return { id: existing.id, receivedAt: existing.received_at, duplicate: true };
    const id = newId(now);
    const receivedAt = new Date(now).toISOString();
    this.db.prepare(`INSERT INTO submissions (${ROW_COLUMNS}) VALUES (?, ?, 'new', ?, NULL, '', ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      id, receivedAt, receivedAt, payload.title, payload.contributor.name, payload.contributor.email, JSON.stringify(payload), hash, hashAddress(meta.address), meta.userAgent.slice(0, 512), meta.captchaProvider,
    );
    return { id, receivedAt, duplicate: false };
  }

  get(id: string): Submission | null {
    const row = this.db.prepare(`SELECT ${ROW_COLUMNS} FROM submissions WHERE id = ?`).get(id) as StoredRow | undefined;
    return row ? this.full(row) : null;
  }

  list(options: { state?: SubmissionState | undefined; limit?: number | undefined; offset?: number | undefined } = {}): SubmissionRow[] {
    const limit = Math.min(Math.max(options.limit ?? 50, 1), 1000);
    const offset = Math.max(options.offset ?? 0, 0);
    const rows = (options.state
      ? this.db.prepare(`SELECT ${ROW_COLUMNS} FROM submissions WHERE state = ? ORDER BY received_at DESC, id DESC LIMIT ? OFFSET ?`).all(options.state, limit, offset)
      : this.db.prepare(`SELECT ${ROW_COLUMNS} FROM submissions ORDER BY received_at DESC, id DESC LIMIT ? OFFSET ?`).all(limit, offset)) as unknown as StoredRow[];
    return rows.map((row) => this.summary(row));
  }

  counts(): Record<SubmissionState, number> {
    const counts = Object.fromEntries(SUBMISSION_STATES.map((state) => [state, 0])) as Record<SubmissionState, number>;
    for (const row of this.db.prepare("SELECT state, COUNT(*) AS n FROM submissions GROUP BY state").all() as { state: SubmissionState; n: number }[]) counts[row.state] = row.n;
    return counts;
  }

  /** Move a proposal to another state, recording who did it and why. */
  setState(id: string, state: SubmissionState, note: string, by: string | null, now: string = nowIso()): Submission | null {
    if (!SUBMISSION_STATES.includes(state)) throw new HttpError(400, `state must be one of ${SUBMISSION_STATES.join(", ")}`);
    const result = this.db.prepare("UPDATE submissions SET state = ?, state_at = ?, state_by = ?, state_note = ? WHERE id = ?").run(state, now, by, note, id);
    return Number(result.changes) > 0 ? this.get(id) : null;
  }

  close(): void {
    this.db.close();
  }

  private summary(row: StoredRow): SubmissionRow {
    const payload = JSON.parse(row.payload) as SubmissionPayload;
    return {
      id: row.id, receivedAt: row.received_at, state: row.state as SubmissionState, stateAt: row.state_at, stateBy: row.state_by, stateNote: row.state_note,
      title: row.title, contributor: payload.contributor, fields: payload.fields, topics: payload.topics,
    };
  }

  private full(row: StoredRow): Submission {
    return { ...this.summary(row), payload: JSON.parse(row.payload) as SubmissionPayload, contentHash: row.content_hash, addressHash: row.address_hash, userAgent: row.user_agent, captchaProvider: row.captcha_provider };
  }
}

/** A proposal as Markdown-flavoured text with TeX left as written, for reading, forwarding, or pasting into a record draft. */
export function submissionText(submission: Submission): string {
  const p = submission.payload;
  const section = (heading: string, body: string): string => (body ? `## ${heading}\n\n${body}\n\n` : "");
  const marked = (all: string[], own: string[]): string => all.map((name) => (own.includes(name) ? `${name} (new)` : name)).join("; ") || "none";
  return `# ${p.title}\n\n`
    + `Proposal ${submission.id}, received ${submission.receivedAt}, state ${submission.state}.\n`
    + `Contributor: ${p.contributor.name} <${p.contributor.email}>${p.contributor.affiliation ? ` (${p.contributor.affiliation})` : ""}\n`
    + `Fields: ${marked(p.fields, p.newFields)}\n`
    + `Topics: ${marked(p.topics, p.newTopics)}\n\n`
    + section("Statement", p.statement)
    + section("Source", p.source)
    + section("Progress", p.progress)
    + section("References", p.references)
    + section("Comment", p.comment);
}
