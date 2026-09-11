/**
 * The proposal inbox over HTTP: the public form's POST against a fake CAPTCHA verifier, the
 * limits and refusals it meets, CORS for the static site's origin, and the editor-only reads.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { configFromEnv, submissionsDefaults } from "../src/config.ts";
import { parseSubmission, submissionText, SubmissionStore } from "../src/submissions.ts";
import type { Service } from "../src/write.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");
const SITE = "https://zoo.example.org";

let tmp: string;
let service: Service;
let server: http.Server;
let base: string;
let verifier: http.Server;
/** What the fake CAPTCHA provider answers next, and what it was asked. */
let verdict: { status: number; body: unknown } = { status: 200, body: { success: true } };
let asked: URLSearchParams[] = [];

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

interface Reply { status: number; headers: Headers; body: any; text: string }

async function call(method: "GET" | "POST" | "OPTIONS", route: string, options: { token?: string; body?: unknown; headers?: Record<string, string> } = {}): Promise<Reply> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  const init: RequestInit = { method, headers };
  if (options.body !== undefined) { init.body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
  const response = await fetch(`${base}${route}`, init);
  const text = await response.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch { /* not JSON */ }
  return { status: response.status, headers: response.headers, body, text };
}

const proposal = (extra: Record<string, unknown> = {}) => ({
  title: "Additivity of the minimum output entropy for a fixed channel",
  statement: "Is the minimum output Rényi-2 entropy additive for the channel $\\mathcal{N}$ defined by \\[ \\mathcal{N}(\\rho) = \\sum_k K_k \\rho K_k^\\dagger \\tag{1} \\] when both inputs are Gaussian?",
  fields: ["Quantum Communication"],
  newFields: [],
  topics: ["Additivity and regularization", "Bosonic channels"],
  newTopics: [],
  source: "Posed in [Doe2024], Section 5.",
  progress: "Known for $n = 2$ copies [Roe2023].",
  references: "[Doe2024] J. Doe, Some paper, arXiv:2401.00001.\n[Roe2023] R. Roe, Another paper, doi:10.1000/xyz.",
  comment: "Related to problem op_0000000000000001.",
  contributor: { name: "Ada Example", email: "ada@example.org", affiliation: "Example University" },
  consent: true,
  captchaToken: "token-ok",
  extra: "",
  ...extra,
});

const actorByName = (name: string) => service.repo.current().currentOf("Actor").find((a) => a.fields["name"] === name)!.id;
/** Forget the hourly proposal budget, so a test starts with a full one. */
const resetBudget = () => service.auth.db.prepare("DELETE FROM counters WHERE scope LIKE 'submissions:%'").run();

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-submissions-"));
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(tmp, "activity"), { recursive: true });
  git(tmp, ["init", "-q", "-b", "main"]);
  git(tmp, ["add", "-A"]);
  git(tmp, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed fixtures"]);

  verifier = http.createServer((request, response) => {
    let raw = "";
    request.on("data", (chunk) => { raw += chunk; });
    request.on("end", () => {
      asked.push(new URLSearchParams(raw));
      response.writeHead(verdict.status, { "Content-Type": "application/json" });
      response.end(JSON.stringify(verdict.body));
    });
  });
  await new Promise<void>((resolve) => verifier.listen(0, "127.0.0.1", resolve));
  const verifierPort = (verifier.address() as { port: number }).port;

  service = createService({
    ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true,
    web: { webDir: null },
    submissions: { dbPath: ":memory:", captcha: { provider: "turnstile", secret: "shh", verifyUrl: `http://127.0.0.1:${verifierPort}/siteverify` }, allowedOrigins: [`${SITE}/`], perAddressPerHour: 4 },
  });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});

after(() => {
  server.close();
  verifier.close();
  service.index.close();
  service.auth.close();
  service.submissions.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("the inbox configuration is normalized from code and from the environment", () => {
  assert.deepEqual(service.submissionsConfig.allowedOrigins, [SITE], "trailing slash stripped");
  assert.equal(service.submissionsConfig.perAddressPerHour, 4);
  const fromEnv = configFromEnv({ QOP_CAPTCHA_SECRET: "s", QOP_SUBMISSION_ORIGINS: " https://a.example , https://b.example/ ", QOP_SUBMISSIONS_PER_HOUR: "3", QOP_TRUST_PROXY: "1" } as NodeJS.ProcessEnv);
  const normalized = submissionsDefaults(fromEnv);
  assert.equal(normalized.captcha?.provider, "turnstile");
  assert.equal(normalized.captcha?.verifyUrl, "https://challenges.cloudflare.com/turnstile/v0/siteverify");
  assert.deepEqual(normalized.allowedOrigins, ["https://a.example", "https://b.example"]);
  assert.equal(normalized.perAddressPerHour, 3);
  assert.equal(normalized.trustProxy, true);
  const closed = submissionsDefaults(configFromEnv({} as NodeJS.ProcessEnv));
  assert.equal(closed.captcha, null, "without a secret the inbox stays closed");
  assert.equal(closed.perAddressPerHour, 10);
  assert.equal(closed.dbPath, path.join(path.dirname(configFromEnv({} as NodeJS.ProcessEnv).authDbPath), "submissions.sqlite"), "the inbox lives beside the auth store");
  assert.equal(submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_DB_PATH: "/var/qop/inbox.sqlite" } as NodeJS.ProcessEnv)).dbPath, path.resolve("/var/qop/inbox.sqlite"));
  assert.equal(submissionsDefaults({ ledgerDir: "", activityDir: "", contractDir: "", dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false }).dbPath, ":memory:", "an in-memory auth store means an in-memory inbox, so tests leave no file behind");
  assert.throws(() => configFromEnv({ QOP_CAPTCHA_PROVIDER: "recaptcha" } as NodeJS.ProcessEnv), /QOP_CAPTCHA_PROVIDER/u);
});

test("parseSubmission normalizes text and reports every problem at once", () => {
  const parsed = parseSubmission(proposal({ title: "  Two   words\r\n", statement: "Line one\r\nline two \u0001with a control character.", fields: ["Quantum Communication", " Quantum Communication "], topics: ["Rényi  entropies"], newTopics: [" Rényi entropies "] }));
  assert.equal(parsed.payload.title, "Two words");
  assert.equal(parsed.payload.statement, "Line one\nline two with a control character.");
  assert.deepEqual(parsed.payload.fields, ["Quantum Communication"], "duplicates and padding go");
  assert.deepEqual(parsed.payload.topics, ["Rényi entropies"]);
  assert.deepEqual(parsed.payload.newTopics, ["Rényi entropies"], "a contributor's own topic is kept and marked");
  assert.throws(() => parseSubmission(proposal({ newTopics: ["Not a chosen topic"] })), /newTopics: Not a chosen topic is not among the topics/u);
  assert.equal(parsed.captchaToken, "token-ok");
  assert.throws(() => parseSubmission(proposal({ title: "ab", fields: [], topics: [], contributor: { name: "", email: "not-an-email" }, consent: false, captchaToken: "" })), (error: Error) => {
    assert.match(error.message, /title is shorter/u);
    assert.match(error.message, /at least one field/u);
    assert.match(error.message, /at least one topic/u);
    assert.match(error.message, /name is required/u);
    assert.match(error.message, /email address is not valid/u);
    assert.match(error.message, /consent/u);
    assert.match(error.message, /human verification/u);
    return true;
  });
  assert.throws(() => parseSubmission(proposal({ fields: ["A", "B", "C"] })), /at most 2/u);
  assert.throws(() => parseSubmission(proposal({ extra: "http://spam.example" })), /anti-spam/u);
  assert.throws(() => parseSubmission("nope"), /JSON object/u);
});

test("anonymity is optional, strictly boolean, and still requires a name and email", () => {
  const contributor = proposal().contributor;
  assert.equal(parseSubmission(proposal()).payload.contributor.anonymous, false);
  for (const anonymous of [false, true]) {
    assert.deepEqual(parseSubmission(proposal({ contributor: { ...contributor, anonymous } })).payload.contributor, { ...contributor, anonymous });
  }
  for (const anonymous of ["true", "false", 0, 1, null]) {
    assert.throws(() => parseSubmission(proposal({ contributor: { ...contributor, anonymous } })), /anonymity preference must be a boolean/u);
  }
  for (const name of ["", "   "]) {
    assert.throws(() => parseSubmission(proposal({ contributor: { ...contributor, name, anonymous: true } })), /your name is required/u);
  }
  assert.throws(() => parseSubmission(proposal({ contributor: { ...contributor, email: "", anonymous: true } })), /your email address is required/u);
  assert.throws(() => parseSubmission(proposal({ contributor: { ...contributor, email: "invalid", anonymous: true } })), /email address is not valid/u);
});

test("contact normalization preserves Unicode and optional affiliations; malformed affiliations are refused", () => {
  for (const anonymous of [false, true]) {
    const contributor = { name: "  Zoë   李  ", email: "  zoe+research@example.org  ", affiliation: " Université de Montréal;\nInstitute for Quantum Studies ", anonymous };
    assert.deepEqual(parseSubmission(proposal({ contributor })).payload.contributor, {
      name: "Zoë 李", email: "zoe+research@example.org", affiliation: "Université de Montréal; Institute for Quantum Studies", anonymous,
    });
    for (const affiliation of [undefined, ""]) {
      assert.equal(parseSubmission(proposal({ contributor: { ...contributor, affiliation } })).payload.contributor.affiliation, "");
    }
    for (const affiliation of [null, 42, ["Example University"], { name: "Example University" }]) {
      assert.throws(() => parseSubmission(proposal({ contributor: { ...contributor, affiliation } })), /affiliation must be text/u);
    }
  }
});

test("content license consent is explicit, survives storage, and does not relicense older receipts", t => {
  const store = new SubmissionStore(":memory:");
  t.after(() => store.close());
  const meta = { address: "127.0.0.1", userAgent: "test", captchaProvider: "turnstile" };
  const legacy = parseSubmission(proposal()).payload;
  assert.equal(Object.hasOwn(legacy, "contentLicense"), false);
  const original = store.accept(legacy, meta);
  const licensed = parseSubmission(proposal({ contentLicense: "CC-BY-4.0" })).payload;
  const confirmed = store.accept(licensed, meta);
  assert.notEqual(confirmed.id, original.id, "new consent must not disappear as a duplicate of an older receipt");
  assert.equal(store.get(confirmed.id)!.payload.contentLicense, "CC-BY-4.0");
  assert.equal(Object.hasOwn(store.get(original.id)!.payload, "contentLicense"), false);
  assert.deepEqual(store.accept(licensed, meta), { ...confirmed, duplicate: true });
  assert.deepEqual(store.accept(legacy, meta), { ...original, duplicate: true });
  assert.match(submissionText(store.get(confirmed.id)!), /Content license: CC BY 4.0/u);
  assert.match(submissionText(store.get(original.id)!), /Content license: Not recorded/u);
  for (const contentLicense of [null, true, "MIT", "CC-BY-SA-4.0"]) {
    assert.throws(() => parseSubmission(proposal({ contentLicense })), /contentLicense must be CC-BY-4.0/u);
  }
  assert.throws(() => parseSubmission(proposal({ contentLicense: "CC-BY-4.0", consent: false })), /consent/u);
});

test("legacy proposals keep exact retries and retain corrected contacts and anonymity preferences", t => {
  const store = new SubmissionStore(":memory:");
  t.after(() => store.close());
  const payload = parseSubmission(proposal()).payload;
  const meta = { address: "127.0.0.1", userAgent: "test", captchaProvider: "turnstile" };
  const first = store.accept(payload, meta);
  const { anonymous: _anonymous, ...legacyContributor } = payload.contributor;
  const legacyHash = createHash("sha256").update(JSON.stringify([payload.title.toLowerCase(), payload.statement, payload.contributor.email.toLowerCase()])).digest("hex");
  store.db.prepare("UPDATE submissions SET payload = ?, content_hash = ? WHERE id = ?").run(JSON.stringify({ ...payload, contributor: legacyContributor }), legacyHash, first.id);
  assert.equal(store.get(first.id)!.contributor.anonymous, false);
  assert.equal(store.get(first.id)!.payload.contributor.anonymous, false);
  assert.equal(store.list()[0]!.contributor.anonymous, false);
  assert.deepEqual(store.accept(payload, meta), { ...first, duplicate: true }, "old receipts still deduplicate when the preference remains unchanged");

  for (const correction of [{ name: "Ada Example-Smith" }, { affiliation: "Updated Institute" }, { email: "Ada@example.org" }]) {
    const correctedPayload = { ...payload, contributor: { ...payload.contributor, ...correction } };
    const receipt = store.accept(correctedPayload, meta);
    assert.equal(receipt.duplicate, false, "corrected contact details must receive a new receipt");
    assert.notEqual(receipt.id, first.id);
    assert.deepEqual(store.get(receipt.id)!.contributor, correctedPayload.contributor);
    assert.deepEqual(store.accept(correctedPayload, meta), { ...receipt, duplicate: true });
  }
  assert.deepEqual(store.get(first.id)!.contributor, payload.contributor, "corrections do not overwrite the original proposal");
  assert.deepEqual(store.accept(payload, meta), { ...first, duplicate: true }, "an original retry still finds its receipt after corrections");

  const anonymousPayload = { ...payload, contributor: { ...payload.contributor, anonymous: true } };
  const changed = store.accept(anonymousPayload, meta);
  assert.equal(changed.duplicate, false, "a changed anonymity preference must not disappear in an existing receipt");
  assert.notEqual(changed.id, first.id);
  assert.deepEqual(store.accept(anonymousPayload, meta), { ...changed, duplicate: true });
  const stored = store.get(changed.id)!;
  assert.equal(stored.contributor.anonymous, true);
  assert.equal(stored.payload.contributor.anonymous, true);
  assert.equal(store.list().find(row => row.id === changed.id)!.contributor.anonymous, true);
  assert.match(submissionText(stored), /Public attribution: Anonymous requested; do not publish/u);
  assert.match(submissionText(stored), /Ada Example <ada@example.org>/u, "maintainers retain the private contact information for review");
});

test("a proposal with a genuine CAPTCHA token is filed once, and a retry within a day returns the same receipt", async () => {
  asked = [];
  const first = await call("POST", "/api/v1/submissions", { body: proposal(), headers: { Origin: SITE, "User-Agent": "test-browser" } });
  assert.equal(first.status, 201, first.text);
  assert.equal(first.body.accepted, true);
  assert.equal(first.body.duplicate, false);
  assert.match(first.body.id, /^[0-9A-HJKMNP-TV-Z]{26}$/u);
  assert.equal(first.headers.get("access-control-allow-origin"), SITE);
  assert.match(first.headers.get("vary") ?? "", /Origin/u);
  assert.equal(asked.length, 1);
  assert.equal(asked[0]!.get("secret"), "shh");
  assert.equal(asked[0]!.get("response"), "token-ok");
  assert.equal(asked[0]!.get("remoteip"), "127.0.0.1");
  const again = await call("POST", "/api/v1/submissions", { body: proposal(), headers: { Origin: SITE } });
  assert.equal(again.status, 200, again.text);
  assert.equal(again.body.duplicate, true);
  assert.equal(again.body.id, first.body.id);
  const stored = service.submissions.get(first.body.id)!;
  assert.equal(stored.state, "new");
  assert.equal(stored.payload.contributor.email, "ada@example.org");
  assert.equal(stored.userAgent, "test-browser");
  assert.equal(stored.captchaProvider, "turnstile");
  assert.notEqual(stored.addressHash, "127.0.0.1", "addresses are stored hashed");
  assert.match(submissionText(stored), /^# Additivity of the minimum output entropy/u);
  assert.match(submissionText(stored), /## References\n\n\[Doe2024\]/u);
  const own = parseSubmission(proposal({ fields: ["Quantum Communication", "Quantum thermodynamics"], newFields: ["Quantum thermodynamics"] })).payload;
  assert.match(submissionText({ ...stored, payload: own }), /^Fields: Quantum Communication; Quantum thermodynamics \(new\)$/mu, "the text marks the contributor's own names");
});

test("a token the provider rejects, a filled honeypot, and an invalid body are refused before anything is filed", async () => {
  resetBudget();
  const before = service.submissions.counts().new;
  verdict = { status: 200, body: { success: false, "error-codes": ["invalid-input-response"] } };
  const bad = await call("POST", "/api/v1/submissions", { body: proposal({ title: "A different proposal with a bad token" }), headers: { Origin: SITE } });
  assert.equal(bad.status, 403, bad.text);
  assert.match(bad.body.error, /verification did not pass/u);
  assert.equal(bad.headers.get("access-control-allow-origin"), SITE, "the page can read the refusal");
  verdict = { status: 200, body: { success: true } };
  const honeypot = await call("POST", "/api/v1/submissions", { body: proposal({ extra: "filled by a script" }), headers: { Origin: SITE } });
  assert.equal(honeypot.status, 400);
  const invalid = await call("POST", "/api/v1/submissions", { body: proposal({ consent: false, contributor: { name: "", email: "" } }), headers: { Origin: SITE } });
  assert.equal(invalid.status, 422);
  assert.match(invalid.body.error, /consent/u);
  const notJson = await fetch(`${base}/api/v1/submissions`, { method: "POST", headers: { "Content-Type": "application/json", Origin: SITE }, body: "{" });
  assert.equal(notJson.status, 400);
  assert.equal(service.submissions.counts().new, before, "nothing was filed");
});

test("a provider outage is a 502, not a rejection, and a page on a foreign origin is refused", async () => {
  resetBudget();
  verdict = { status: 500, body: "boom" };
  const outage = await call("POST", "/api/v1/submissions", { body: proposal({ title: "Proposal during an outage of the verifier" }), headers: { Origin: SITE } });
  assert.equal(outage.status, 403, "a verifier that answers without success is a failed verification");
  verifier.close();
  const down = await call("POST", "/api/v1/submissions", { body: proposal({ title: "Proposal while the verifier is down" }), headers: { Origin: SITE } });
  assert.equal(down.status, 502, down.text);
  await new Promise<void>((resolve) => verifier.listen(Number(new URL(service.submissionsConfig.captcha!.verifyUrl).port), "127.0.0.1", resolve));
  verdict = { status: 200, body: { success: true } };
  const foreign = await call("POST", "/api/v1/submissions", { body: proposal(), headers: { Origin: "https://evil.example" } });
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get("access-control-allow-origin"), null);
});

test("OPTIONS answers the preflight for the site's origin only and never spends the address budget", async () => {
  const preflight = await call("OPTIONS", "/api/v1/submissions", { headers: { Origin: SITE, "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "content-type" } });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), SITE);
  assert.match(preflight.headers.get("access-control-allow-methods") ?? "", /POST/u);
  assert.match(preflight.headers.get("access-control-allow-headers") ?? "", /Content-Type/u);
  const own = await call("OPTIONS", "/api/v1/submissions", { headers: { Origin: service.web.publicUrl } });
  assert.equal(own.headers.get("access-control-allow-origin"), service.web.publicUrl, "the service's own web app may post too");
  const foreign = await call("OPTIONS", "/api/v1/submissions", { headers: { Origin: "https://evil.example" } });
  assert.equal(foreign.status, 204);
  assert.equal(foreign.headers.get("access-control-allow-origin"), null);
  const elsewhere = await call("OPTIONS", "/api/v1/status", { headers: { Origin: SITE } });
  assert.equal(elsewhere.status, 405, "only cross-origin routes answer OPTIONS");
});

test("the per-address budget counts attempts, verified or not", async () => {
  resetBudget();
  verdict = { status: 200, body: { success: false } };
  const statuses: number[] = [];
  for (let i = 0; i < 5; i += 1) {
    const reply = await call("POST", "/api/v1/submissions", { body: proposal({ title: `Budget probe number ${i} of the hour` }), headers: { Origin: SITE } });
    statuses.push(reply.status);
    if (reply.status === 429) assert.match(reply.body.error, /within an hour/u);
  }
  assert.deepEqual(statuses, [403, 403, 403, 403, 429], "four attempts per hour, whether or not they verify");
  verdict = { status: 200, body: { success: true } };
  resetBudget();
});

test("the inbox is read by editors only, filtered by state, and a state change is recorded with its actor", async () => {
  resetBudget();
  const contributorToken = service.auth.issueKey(actorByName("Example research agent"), "test");
  const editorToken = service.auth.issueKey(actorByName("Legacy audit editor"), "test");
  assert.equal((await call("GET", "/api/v1/submissions")).status, 401);
  assert.equal((await call("GET", "/api/v1/submissions", { token: contributorToken })).status, 403);
  const list = await call("GET", "/api/v1/submissions", { token: editorToken });
  assert.equal(list.status, 200, list.text);
  assert.equal(list.headers.get("cache-control"), "no-store");
  assert.ok(list.body.count >= 1);
  assert.ok(list.body.submissions.every((row: { state: string }) => row.state === "new"));
  assert.ok(list.body.submissions.every((row: Record<string, unknown>) => !("payload" in row)), "the list is a summary");
  const id = list.body.submissions[list.body.submissions.length - 1].id;
  const one = await call("GET", `/api/v1/submissions/${id}`, { token: editorToken });
  assert.equal(one.status, 200);
  assert.equal(one.body.payload.statement.length > 20, true);
  assert.match(one.body.text, /^# /u);
  assert.equal((await call("GET", "/api/v1/submissions/NOPE", { token: editorToken })).status, 404);
  assert.equal((await call("GET", "/api/v1/submissions?state=bogus", { token: editorToken })).status, 400);
  const badState = await call("POST", `/api/v1/submissions/${id}/state`, { token: editorToken, body: { state: "done" } });
  assert.equal(badState.status, 422);
  const moved = await call("POST", `/api/v1/submissions/${id}/state`, { token: editorToken, body: { state: "in-review", note: "Checking the sources." } });
  assert.equal(moved.status, 200, moved.text);
  assert.equal(moved.body.state, "in-review");
  assert.equal(moved.body.stateNote, "Checking the sources.");
  assert.equal(moved.body.stateBy, actorByName("Legacy audit editor"));
  assert.equal((await call("POST", `/api/v1/submissions/${id}/state`, { token: contributorToken, body: { state: "spam" } })).status, 403);
  const inReview = await call("GET", "/api/v1/submissions?state=in-review", { token: editorToken });
  assert.deepEqual(inReview.body.submissions.map((row: { id: string }) => row.id), [id]);
  assert.equal(inReview.body.counts["in-review"], 1);
});

test("without a CAPTCHA secret the inbox is closed with a 503", async () => {
  const closed = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false, web: { webDir: null }, submissions: { dbPath: ":memory:" } });
  const closedServer = createServer(closed);
  await new Promise<void>((resolve) => closedServer.listen(0, "127.0.0.1", resolve));
  try {
    const reply = await fetch(`http://127.0.0.1:${(closedServer.address() as { port: number }).port}/api/v1/submissions`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(proposal()) });
    assert.equal(reply.status, 503);
  } finally {
    closedServer.close();
    closed.index.close();
    closed.auth.close();
    closed.submissions.close();
  }
});

test("the store survives on disk and lists newest first", () => {
  const file = path.join(tmp, "inbox", "submissions.sqlite");
  const store = new SubmissionStore(file);
  const older = store.accept(parseSubmission(proposal({ title: "Older proposal in the on-disk store", contributor: { ...proposal().contributor, anonymous: true } })).payload, { address: "10.0.0.1", userAgent: "ua", captchaProvider: "turnstile" }, Date.parse("2026-09-01T00:00:00Z"));
  const newer = store.accept(parseSubmission(proposal({ title: "Newer proposal in the on-disk store" })).payload, { address: "10.0.0.1", userAgent: "ua", captchaProvider: "turnstile" }, Date.parse("2026-09-02T00:00:00Z"));
  store.close();
  const reopened = new SubmissionStore(file);
  assert.deepEqual(reopened.list().map((row) => row.id), [newer.id, older.id]);
  assert.equal(reopened.get(older.id)!.payload.contributor.anonymous, true, "the anonymity preference survives reopening the inbox");
  assert.equal(reopened.setState("missing", "spam", "", null), null);
  reopened.close();
});
