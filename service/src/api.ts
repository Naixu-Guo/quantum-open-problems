/**
 * The HTTP API. Reads are public. Writes need an actor, named by a bearer token or, for the web
 * app, by a session cookie; they pass through body limits, rate limits, and idempotency, and
 * land in the ledger through the same write path as every other client. Every route is a
 * function of the ledger, the index, and the service-local auth store. Paths outside `/api/`
 * go to `web.ts`: the login routes and the web app's files.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { Service } from "./write.ts";
import { submit, refresh } from "./write.ts";
import { watchLedger } from "./refresh.ts";
import { problemView, frontier, tree, attempts, contributionView, recordView, status, events, referencesOf, commentsOn, reviewQueue, contextBundle, taxonomyView, taxonomyId, actorsView, searchSources, ContextError } from "./read-models.ts";
import { currentDecisions, isIndexed, contributionState, catalogState } from "../../contract/src/derive.ts";
import { validatePayload } from "../../contract/src/validate.ts";
import { materialize, acceptArtifact, closeRecords, PayloadError, type BatchRecord } from "./payloads.ts";
import type { NewRecord } from "./ledger-repo.ts";
import { newId, nowIso } from "./ids.ts";
import { HttpError } from "./errors.ts";
import { handleWeb, parseCookies, SESSION_COOKIE, LOGIN_COOKIE, type Caller } from "./web.ts";
import { hasRole } from "../../contract/src/types/actor.ts";
import { parseSubmission, verifyCaptcha, submissionText, SUBMISSION_STATES, type SubmissionState } from "./submissions.ts";
import { handleInbox, INBOX_COOKIE } from "./inbox.ts";

interface Call {
  inboxSession: boolean;
  params: string[];
  query: URLSearchParams;
  actorId: string | null;
  raw: Buffer;
  headers: http.IncomingHttpHeaders;
  /** The client's address as the rate limits see it: the socket's, or the proxy's forwarded one when configured. */
  address: string;
}

interface Reply {
  status: number;
  body: unknown;
  contentType?: "application/x-ndjson";
}

interface Route {
  /** A scoped project-inbox session may access this route, without becoming a ledger actor. */
  inboxAccess?: boolean;
  method: "GET" | "POST";
  pattern: RegExp;
  auth: boolean;
  /** The reply depends on who is asking, so it must never be cached by a shared cache. */
  callerSpecific?: boolean;
  /** Pages on the configured foreign origins may call this route: the reply carries CORS headers and OPTIONS is answered. */
  cors?: boolean;
  handler: (call: Call) => Reply | Promise<Reply>;
}

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const ok = (body: unknown): Reply => ({ status: 200, body });

function integer(query: URLSearchParams, name: string, fallback: number): number {
  const raw = query.get(name);
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new HttpError(400, `${name} must be a non-negative safe integer`);
  return value;
}

function json<T>(call: Call, schema: string): T {
  let parsed: unknown;
  try {
    parsed = JSON.parse(call.raw.toString("utf8"));
  } catch {
    throw new HttpError(400, "the body is not valid JSON");
  }
  const problems = validatePayload(schema, parsed);
  if (problems.length > 0) throw new HttpError(422, `${schema}: ${problems.join("; ")}`);
  return parsed as T;
}

function readSchema(file: string, name: string): unknown {
  if (!fs.existsSync(file)) throw new HttpError(404, `unknown schema ${name}`);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function routes(service: Service): Route[] {
  const ledger = () => service.repo.current();
  const auth = service.auth;
  const resolveProblem = (idOrAlias: string): string => {
    const l = ledger();
    let problem = l.find("Problem", idOrAlias) ?? l.currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes(idOrAlias));
    if (!problem) throw new HttpError(404, `unknown problem ${idOrAlias}`);
    const visited = new Set<string>();
    while (problem) {
      if (visited.has(problem.id)) throw new HttpError(500, "cyclic catalog merge");
      visited.add(problem.id);
      const catalog = problem.fields["authoredCatalog"] as { mergedIntoProblemId?: string } | undefined;
      if (!catalog?.mergedIntoProblemId) return problem.id;
      problem = l.find("Problem", catalog.mergedIntoProblemId);
    }
    throw new HttpError(500, "missing catalog merge target");
  };
  const notNull = <T>(value: T | null | undefined, what: string): T => {
    if (value === null || value === undefined) throw new HttpError(404, `unknown ${what}`);
    return value;
  };
  const actor = (call: Call): string => {
    if (!call.actorId) throw new HttpError(401, "a bearer token for an actor is required");
    return call.actorId;
  };
  const editor = (call: Call): string => {
    const actorId = actor(call);
    if (!hasRole(ledger(), actorId, "editor")) throw new HttpError(403, "the editor role is required");
    return actorId;
  };
  const parseJson = (call: Call): unknown => {
    try {
      return JSON.parse(call.raw.toString("utf8"));
    } catch {
      throw new HttpError(400, "the body is not valid JSON");
    }
  };
  const submission = (id: string) => notNull(service.submissions.get(id), "proposal");
  const openTrajectory = (call: Call, id: string) => {
    const open = auth.getOpenTrajectory(id);
    if (!open) throw new HttpError(404, `no open trajectory ${id}`);
    if (open.actorId !== actor(call)) throw new HttpError(403, "the trajectory belongs to another actor");
    return open;
  };
  const write = (actorId: string, records: NewRecord[], message: string, extra: Record<string, unknown> = {}): Reply => {
    // Every write counts against the daily budget; each comment record also counts against the hourly discussion budget.
    const dailyLimit = service.policy.rateLimits["contributionsPerActorPerDay"] ?? 20;
    if (auth.bump(`writes:${actorId}`, DAY) > dailyLimit) throw new HttpError(429, `more than ${dailyLimit} writes today`);
    const comments = records.filter((r) => r.fields["type"] === "Comment").length;
    if (comments > 0) {
      const hourlyLimit = service.policy.rateLimits["commentsPerActorPerHour"] ?? 30;
      if (auth.bump(`comments:${actorId}`, HOUR, Date.now(), comments) > hourlyLimit) throw new HttpError(429, `more than ${hourlyLimit} comments this hour`);
    }
    const result = submit(service, actorId, records, message);
    // A clone that cannot take writes right now is the service's condition, not the batch's: 503, and never replayed.
    if (!result.ok) return { status: result.retryable ? 503 : 422, body: { accepted: false, issues: result.issues, ...extra } };
    return { status: 201, body: { accepted: true, commit: result.commit, recordIds: records.map((r) => String(r.fields["id"])), decisions: result.decisions, automaticIssues: result.automaticIssues, ...extra } };
  };

  return [
    { method: "GET", pattern: /^\/api\/v1\/problems\.jsonl$/u, auth: false, handler: () => {
      const current = ledger();
      const decisions = currentDecisions(current);
      const rows = current.currentOf("Problem").filter(p => catalogState(current, p.id, decisions) === "published").sort((a, b) => a.id.localeCompare(b.id));
      return { status: 200, contentType: "application/x-ndjson", body: rows.map(p => JSON.stringify(problemView(current, p.id))).join("\n") + "\n" };
    } },
    { method: "GET", pattern: /^\/api\/v1\/status$/u, auth: false, handler: () => ok({ ...status(ledger(), service.index, service.policy.policyVersion), sync: service.repo.publicSyncState() }) },
    { method: "GET", pattern: /^\/api\/v1\/policy$/u, auth: false, handler: () => ok({ policyVersion: service.policy.policyVersion, thresholds: service.policy.thresholds, independence: service.policy.independence, mechanicalMethods: service.policy.mechanicalMethods, rateLimits: service.policy.rateLimits, bodyLimits: service.policy.bodyLimits, licenses: service.policy.licenses }) },
    { method: "GET", pattern: /^\/api\/v1\/schemas\/payloads\/([a-z-]+)$/u, auth: false, handler: ({ params }) => ok(readSchema(path.join(service.repo.schemaDir, "payloads", `${params[0]}.schema.json`), params[0]!)) },
    { method: "GET", pattern: /^\/api\/v1\/schemas\/([a-z-]+)$/u, auth: false, handler: ({ params }) => ok(readSchema(path.join(service.repo.schemaDir, `${params[0]}.schema.json`), params[0]!)) },
    { method: "GET", pattern: /^\/api\/v1\/taxonomy$/u, auth: false, handler: () => ok(notNull(taxonomyView(ledger()), "taxonomy")) },
    { method: "GET", pattern: /^\/api\/v1\/actors$/u, auth: false, handler: () => ok({ actors: actorsView(ledger()) }) },
    { method: "GET", pattern: /^\/api\/v1\/sources$/u, auth: false, handler: ({ query }) => ok(searchSources(ledger(), query.get("text") ?? "", integer(query, "limit", 20), integer(query, "offset", 0))) },
    { method: "GET", pattern: /^\/api\/v1\/problems$/u, auth: false, handler: ({ query }) => {
      const requestedStatus = query.get("status");
      if (requestedStatus && requestedStatus !== "Solved" && requestedStatus !== "Unsolved") throw new HttpError(400, "status must be Solved or Unsolved");
      const resolveTag = (kind: "areas" | "topics", label: string) => {
        const id = taxonomyId(ledger(), kind, label);
        if (!id) throw new HttpError(400, `Unknown ${kind === "areas" ? "area" : "topic"} ${label}; use a label or slug from /api/v1/taxonomy`);
        return id;
      };
      const sort = query.get("sort") === "stale" ? "stale" : "title";
      const { rows, ...page } = service.index.problemPage({
        ...(requestedStatus ? { status: requestedStatus } : {}),
        ...(query.get("area") ? { area: resolveTag("areas", query.get("area")!) } : {}),
        ...(query.get("topic") ? { topic: resolveTag("topics", query.get("topic")!) } : {}),
        ...(query.get("difficulty") ? { difficulty: query.get("difficulty")! } : {}),
        ...(query.get("text") ? { text: query.get("text")! } : {}),
        indexedOnly: query.get("includeCandidates") !== "true",
        limit: integer(query, "limit", 50),
        offset: integer(query, "offset", 0),
        sort,
      });
      return ok({ ...page, unit: "records", count: rows.length, sort, ...(sort === "stale" ? { sortDescription: "Missing service human-review dates first, then oldest review; ties use title and id. This is not catalog edit age." } : {}), problems: rows.map((row) => ({ id: row.id, alias: row.alias, title: row.title, role: row.role, catalogState: row.catalog_state, status: row.status, indexed: row.indexed === 1, areaIds: JSON.parse(row.area_ids), topicIds: JSON.parse(row.topic_ids), difficulty: row.difficulty, lastActivity: row.last_activity, lastHumanReview: row.last_human_review })) });
    } },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)$/u, auth: false, handler: ({ params, query }) => ok(notNull(problemView(ledger(), resolveProblem(params[0]!), query.get("includeAuthoredRecord") === "true"), "problem")) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/frontier$/u, auth: false, handler: ({ params }) => ok(notNull(frontier(ledger(), resolveProblem(params[0]!)), "problem")) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/tree$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), tree: tree(ledger(), resolveProblem(params[0]!)) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/attempts$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), attempts: attempts(ledger(), resolveProblem(params[0]!)) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/indexed$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), indexed: isIndexed(ledger(), resolveProblem(params[0]!), currentDecisions(ledger())) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/references$/u, auth: false, handler: ({ params, query }) => ok({ problemId: resolveProblem(params[0]!), references: referencesOf(ledger(), resolveProblem(params[0]!), query.get("role") ?? undefined) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/context$/u, auth: false, handler: ({ params, query }) => {
      const clauses = query.get("clauses")?.split(",").filter(Boolean);
      try {
        return ok(notNull(contextBundle(ledger(), resolveProblem(params[0]!), clauses, integer(query, "budget", 8000)), "problem"));
      } catch (error) {
        if (error instanceof ContextError) throw new HttpError(400, error.message);
        throw error;
      }
    } },
    { method: "GET", pattern: /^\/api\/v1\/comments$/u, auth: false, handler: ({ query }) => {
      const targetType = query.get("targetType");
      const targetId = query.get("targetId");
      if (!targetType || !targetId) throw new HttpError(400, "targetType and targetId are required");
      return ok({ targetType, targetId, comments: commentsOn(ledger(), targetType, targetId) });
    } },
    { method: "GET", pattern: /^\/api\/v1\/queues\/review$/u, auth: false, callerSpecific: true, handler: (call) => ok({ queue: "review", items: reviewQueue(ledger(), call.actorId) }) },
    { method: "GET", pattern: /^\/api\/v1\/contributions\/([^/]+)$/u, auth: false, handler: ({ params }) => ok(notNull(contributionView(ledger(), params[0]!), "contribution")) },
    { method: "GET", pattern: /^\/api\/v1\/records\/([^/]+)$/u, auth: false, handler: ({ params }) => ok(notNull(recordView(ledger(), params[0]!), "record")) },
    { method: "GET", pattern: /^\/api\/v1\/events$/u, auth: false, handler: ({ query }) => ok(events(ledger(), service.index, integer(query, "after", 0), integer(query, "limit", 100), query.get("type") ?? undefined)) },
    { method: "GET", pattern: /^\/api\/v1\/actors\/me$/u, auth: true, callerSpecific: true, handler: (call) => ok({ ...notNull(recordView(ledger(), actor(call)), "actor"), keys: auth.keysFor(actor(call)) }) },

    // Public filing requires explicit basic or CAPTCHA mode. Reads require an editor
    // or the scoped project inbox session, since proposals hold private contact details.
    { method: "POST", pattern: /^\/api\/v1\/submissions$/u, auth: false, cors: true, handler: async (call) => {
      const rules = service.submissionsConfig;
      if (rules.mode === "disabled") throw new HttpError(503, "online proposals are not enabled on this service; use the GitHub route described on the contribute page");
      if (auth.bump(`submissions:${call.address}`, HOUR) > rules.perAddressPerHour) throw new HttpError(429, `more than ${rules.perAddressPerHour} proposals from this address within an hour; try again later`);
      service.submissions.capacity.takeAttempt();
      const parsed = parseSubmission(parseJson(call), rules.mode === "captcha");
      if (rules.mode === "captcha") {
        if (!rules.captcha) throw new HttpError(503, "the proposal verifier is not configured");
        const verdict = await verifyCaptcha(rules.captcha, parsed.captchaToken, call.address);
        if (!verdict.ok) throw new HttpError(403, "the human verification did not pass; complete it again and resubmit");
      }
      const userAgent = Array.isArray(call.headers["user-agent"]) ? call.headers["user-agent"][0] ?? "" : call.headers["user-agent"] ?? "";
      const receipt = service.submissions.accept(parsed.payload, { address: call.address, userAgent, captchaProvider: rules.mode === "captcha" ? rules.captcha!.provider : "basic" });
      return { status: receipt.duplicate ? 200 : 201, body: { accepted: true, ...receipt } };
    } },
    { method: "GET", pattern: /^\/api\/v1\/submissions$/u, auth: true, inboxAccess: true, callerSpecific: true, handler: (call) => {
      if (!call.inboxSession) editor(call);
      const state = call.query.get("state");
      if (state !== null && !(SUBMISSION_STATES as readonly string[]).includes(state)) throw new HttpError(400, `state must be one of ${SUBMISSION_STATES.join(", ")}`);
      const offset = integer(call.query, "offset", 0);
      const limit = Math.min(Math.max(integer(call.query, "limit", 50), 1), 1000);
      const counts = service.submissions.counts();
      const total = state ? counts[state as SubmissionState] : Object.values(counts).reduce((a, b) => a + b, 0);
      const proposals = service.submissions.list({ state: (state as SubmissionState | null) ?? undefined, limit, offset });
      return ok({ counts, capacity: service.submissions.capacity.usage(), count: proposals.length, total, offset, limit, nextOffset: offset + proposals.length < total ? offset + proposals.length : null, submissions: proposals });
    } },
    { method: "GET", pattern: /^\/api\/v1\/submissions\/([^/]+)$/u, auth: true, inboxAccess: true, callerSpecific: true, handler: (call) => {
      if (!call.inboxSession) editor(call);
      const found = submission(call.params[0]!);
      return ok({ ...found, text: submissionText(found) });
    } },
    { method: "POST", pattern: /^\/api\/v1\/submissions\/([^/]+)\/state$/u, auth: true, inboxAccess: true, handler: (call) => {
      const actorId = call.inboxSession ? null : editor(call);
      const payload = parseJson(call);
      if (typeof payload !== "object" || payload === null || Array.isArray(payload)) throw new HttpError(422, "the body must be an object with state and an optional note");
      const { state, note } = payload as { state?: unknown; note?: unknown };
      if (typeof state !== "string" || !(SUBMISSION_STATES as readonly string[]).includes(state)) throw new HttpError(422, `state must be one of ${SUBMISSION_STATES.join(", ")}`);
      if (note !== undefined && typeof note !== "string") throw new HttpError(422, "note must be a string");
      submission(call.params[0]!);
      return ok(service.submissions.setState(call.params[0]!, state as SubmissionState, (note ?? "").slice(0, 2000), actorId));
    } },

    { method: "POST", pattern: /^\/api\/v1\/batches$/u, auth: true, handler: (call) => {
      const payload = json<{ message?: string; records: BatchRecord[] }>(call, "batch");
      const actorId = actor(call);
      const batch = materialize(ledger(), actorId, payload.records);
      return write(actorId, batch.records, payload.message ?? `Batch by ${actorId}`, { refs: batch.ids });
    } },
    { method: "POST", pattern: /^\/api\/v1\/contributions\/([^/]+)\/withdraw$/u, auth: true, handler: (call) => {
      const payload = json<{ reason: string }>(call, "withdrawal");
      const actorId = actor(call);
      const contribution = notNull(ledger().find("Contribution", call.params[0]!), "contribution");
      if (contribution.fields["actorId"] !== actorId) throw new HttpError(403, "only the contribution's actor withdraws it");
      const state = contributionState(ledger(), contribution.id);
      if (state !== "submitted" && state !== "triaged") throw new HttpError(409, `a ${state} contribution cannot be withdrawn`);
      const at = nowIso();
      return write(actorId, [{ fields: {
        id: newId(), type: "Decision", schemaVersion: "1.0", createdBy: actorId, createdAt: at, supersedes: null,
        kind: "withdrawal", targetType: "contribution", targetId: contribution.id, mergeIntoProblemId: null, outcome: "accepted", status: null, verificationLevel: null,
        reviewIds: [], contributionIds: [contribution.id], policyVersion: service.policy.policyVersion, effectiveAt: at,
      }, body: payload.reason }], `Withdraw ${contribution.id}`);
    } },
    { method: "POST", pattern: /^\/api\/v1\/trajectories$/u, auth: true, handler: (call) => {
      const payload = json<Record<string, unknown>>(call, "trajectory-start");
      const actorId = actor(call);
      const actorRecord = notNull(ledger().find("Actor", actorId), "actor");
      const id = newId();
      const startedAt = nowIso();
      auth.openTrajectory({ id, actorId, startedAt, fields: {
        kind: payload["kind"], operatorId: actorRecord.fields["operatorId"] ?? null, problemIds: payload["problemIds"], statementDigests: payload["statementDigests"],
        clauseIds: payload["clauseIds"] ?? [], contextBundleId: payload["contextBundleId"] ?? null, harnessConfig: payload["harnessConfig"], budget: payload["budget"],
        visibility: payload["visibility"], embargoUntil: payload["embargoUntil"] ?? null,
      } });
      return { status: 201, body: { trajectoryId: id, startedAt } };
    } },
    { method: "POST", pattern: /^\/api\/v1\/trajectories\/([^/]+)\/events$/u, auth: true, handler: (call) => {
      const payload = json<Record<string, unknown>>(call, "trajectory-event");
      const open = openTrajectory(call, call.params[0]!);
      const seq = auth.appendEvent(open.id, { at: nowIso(), kind: payload["kind"], summary: payload["summary"], problemId: payload["problemId"] ?? null, clauseId: payload["clauseId"] ?? null, obstacle: payload["obstacle"] ?? "none", objectIds: payload["objectIds"] ?? [], artifactId: payload["artifactId"] ?? null });
      return { status: 201, body: { trajectoryId: open.id, seq } };
    } },
    { method: "POST", pattern: /^\/api\/v1\/trajectories\/([^/]+)\/artifacts$/u, auth: true, handler: (call) => {
      const open = openTrajectory(call, call.params[0]!);
      // Header values are percent-encoded UTF-8 so titles may carry any character.
      const kind = decodeHeader(call.headers["x-artifact-kind"]);
      const title = decodeHeader(call.headers["x-artifact-title"]);
      const mediaType = String(call.headers["content-type"] ?? "application/octet-stream").split(";")[0]!.trim();
      if (!kind || !title) throw new HttpError(400, "X-Artifact-Kind and X-Artifact-Title headers are required");
      if (call.raw.length === 0) throw new HttpError(400, "the artifact is empty");
      return { status: 201, body: acceptArtifact(auth, service.artifactStoreDir, open, { title, kind, mediaType, bytes: call.raw }) };
    } },
    { method: "POST", pattern: /^\/api\/v1\/trajectories\/([^/]+)\/close$/u, auth: true, handler: (call) => {
      const payload = json<{ cost: Record<string, unknown>; body: string; attemptReport?: { records: BatchRecord[] } }>(call, "trajectory-close");
      const open = openTrajectory(call, call.params[0]!);
      const closing = closeRecords(ledger(), auth, service.artifactStoreDir, open, payload);
      const refs = closing.refs;
      const reply = write(open.actorId, closing.records, `Close trajectory ${open.id}`, { trajectoryId: open.id, attemptReportId: closing.attemptReportId, refs });
      if (reply.status === 201) auth.closeTrajectory(open.id);
      return reply;
    } },
  ];
}

function readBody(request: http.IncomingMessage, limit: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    request.on("data", (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        reject(new HttpError(413, `the body exceeds ${limit} bytes`));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => resolve(Buffer.concat(chunks)));
    request.on("error", reject);
  });
}

/** The request's Origin is exactly the service's public origin, scheme included; sessions exist on no other origin. */
function sameOrigin(request: http.IncomingMessage, publicUrl: string): boolean {
  const origin = request.headers.origin;
  if (typeof origin !== "string") return false;
  try {
    return new URL(origin).origin === new URL(publicUrl).origin;
  } catch {
    return false;
  }
}

function decodeHeader(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] ?? "" : value ?? "";
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** The client's address: the socket's, or with a trusted reverse proxy the first entry of X-Forwarded-For. */
function clientAddress(request: http.IncomingMessage, trustProxy: boolean): string {
  if (trustProxy) {
    const forwarded = request.headers["x-forwarded-for"];
    const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.socket.remoteAddress ?? "unknown";
}

/**
 * CORS headers for a route that foreign pages may call, when the request's Origin is one of the
 * configured origins or the service's own. An Origin that is not allowed gets no headers, so the
 * browser withholds the reply; a request without an Origin (a script, curl) needs none.
 */
function corsHeaders(request: http.IncomingMessage, service: Service): Record<string, string> {
  const origin = request.headers.origin;
  if (typeof origin !== "string") return {};
  let normalized: string;
  let own: string;
  try {
    normalized = new URL(origin).origin;
    own = new URL(service.web.publicUrl).origin;
  } catch {
    return {};
  }
  const allowed = new Set([...service.submissionsConfig.allowedOrigins, own]);
  if (!allowed.has(normalized)) return {};
  return { "Access-Control-Allow-Origin": normalized, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", Vary: "Origin" };
}

export function createServer(service: Service): http.Server {
  const table = routes(service);
  const bodyLimit = service.policy.bodyLimits["contributionBytes"] ?? 262144;
  const perMinute = service.policy.rateLimits["requestsPerAddressPerMinute"] ?? 600;

  const server = http.createServer(async (request, response) => {
    // Only anonymous reads of caller-independent routes are cacheable by shared caches.
    let cacheable = false;
    // Set once the request is known to target a cross-origin route, so every reply to it, errors included, carries them.
    let cors: Record<string, string> = {};
    const send = (code: number, payload: unknown, extra: Record<string, string> = {}, contentType?: "application/x-ndjson") => {
      const body = contentType ? String(payload) : JSON.stringify(payload, null, 1);
      const { Vary: extraVary, ...rest } = { ...cors, ...extra };
      const vary = ["Authorization", "Cookie", ...(extraVary ? [extraVary] : [])].join(", ");
      response.writeHead(code, { "Content-Type": `${contentType ?? "application/json"}; charset=utf-8`, "X-Content-Type-Options": "nosniff", "Content-Length": Buffer.byteLength(body), "Cache-Control": code === 200 && cacheable ? "public, max-age=15" : "no-store", Vary: vary, ...rest });
      response.end(body);
    };
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const isApi = url.pathname.startsWith("/api/");
      const isAuth = url.pathname.startsWith("/auth/");
      // A preflight for a cross-origin route: answer it without spending the address budget.
      if (request.method === "OPTIONS") {
        const target = table.find((candidate) => candidate.cors && candidate.pattern.test(url.pathname));
        if (!target) throw new HttpError(405, "GET or POST only");
        response.writeHead(204, { ...corsHeaders(request, service), "Content-Length": 0, "Cache-Control": "no-store" });
        response.end();
        return;
      }
      const method = request.method === "GET" || request.method === "POST" ? request.method : null;
      if (!method) throw new HttpError(405, "GET or POST only");
      const address = clientAddress(request, service.submissionsConfig.trustProxy);
      // The per-address budget is for API and login calls; a page's static assets do not spend it.
      if (isApi || isAuth) {
        if (service.auth.bump(`address:${address}`, MINUTE) > perMinute) throw new HttpError(429, "too many requests from this address");
        try { refresh(service); }
        catch { throw new HttpError(503, "the ledger cannot be refreshed; retry after the catalog update is repaired"); }
      }

      // Who is calling. On the API a bearer token names the actor and an invalid one is refused;
      // everywhere the web app's session cookie names the actor. The cookies are read raw.
      const cookies = parseCookies(request.headers.cookie);
      const inboxSession = service.auth.validInboxSession(cookies[INBOX_COOKIE] ?? "", service.submissionsConfig.inboxKeyHash);
      if (await handleInbox(service, request, response, url, { sameOrigin: sameOrigin(request, service.web.publicUrl), address, token: cookies[INBOX_COOKIE] ?? "", readBody })) return;
      const caller: Caller = { actorId: null, viaSession: false, sessionToken: cookies[SESSION_COOKIE] ?? null, loginNonce: cookies[LOGIN_COOKIE] ?? null, sameOrigin: sameOrigin(request, service.web.publicUrl) };
      const header = request.headers.authorization;
      if (isApi && header?.startsWith("Bearer ")) {
        caller.actorId = service.auth.actorForToken(header.slice(7).trim());
        if (!caller.actorId) throw new HttpError(401, "the token is unknown or revoked");
        if (!service.repo.current().find("Actor", caller.actorId)) throw new HttpError(401, "the token's actor is not in the ledger");
      } else if (caller.sessionToken) {
        const actorId = service.auth.actorForSession(caller.sessionToken);
        if (actorId && service.repo.current().find("Actor", actorId)) {
          caller.actorId = actorId;
          caller.viaSession = true;
        }
      }

      if (!isApi) {
        if (await handleWeb(service, request, response, url, caller)) return;
        throw new HttpError(404, `no route for ${method} ${url.pathname}`);
      }

      const route = table.find((candidate) => candidate.method === method && candidate.pattern.test(url.pathname));
      if (!route) throw new HttpError(404, `no route for ${method} ${url.pathname}`);
      if (route.cors) {
        cors = corsHeaders(request, service);
        // A browser page on an origin that is not ours would never see the reply; do not act on its behalf either.
        if (typeof request.headers.origin === "string" && !cors["Access-Control-Allow-Origin"]) throw new HttpError(403, "this origin may not post here");
      }
      cacheable = method === "GET" && !route.auth && !route.callerSpecific && caller.actorId === null;
      if (route.auth && !caller.actorId && !(route.inboxAccess && inboxSession)) throw new HttpError(401, "a bearer token or an authorized login session is required");
      if (method === "POST" && route.inboxAccess && inboxSession && !caller.sameOrigin) throw new HttpError(403, "cross-site request refused");
      // A cookie is sent by the browser on its own, so a write it authenticates must come from our own pages.
      if (method === "POST" && caller.viaSession && !caller.sameOrigin) throw new HttpError(403, "cross-site request refused");
      const actorId = caller.actorId;

      const raw = method === "POST" ? await readBody(request, bodyLimit) : Buffer.alloc(0);
      const idempotencyKey = method === "POST" ? request.headers["idempotency-key"] : undefined;
      const requestHash = createHash("sha256").update(url.pathname).update(raw).digest("hex");
      if (typeof idempotencyKey === "string" && actorId) {
        if (idempotencyKey.length > 128) throw new HttpError(400, "Idempotency-Key is longer than 128 characters");
        const stored = service.auth.replay(actorId, idempotencyKey, requestHash);
        if (stored === "conflict") throw new HttpError(422, "Idempotency-Key was already used with a different request");
        if (stored) {
          send(stored.status, JSON.parse(stored.body), { "Idempotent-Replay": "true" });
          return;
        }
      }

      const match = url.pathname.match(route.pattern)!;
      const reply = await route.handler({ inboxSession, params: match.slice(1).map((s) => decodeURIComponent(s)), query: url.searchParams, actorId, raw, headers: request.headers, address });
      if (typeof idempotencyKey === "string" && actorId && reply.status !== 503) service.auth.remember(actorId, idempotencyKey, requestHash, reply.status, JSON.stringify(reply.body));
      send(reply.status, reply.body, {}, reply.contentType);
    } catch (error) {
      if (response.headersSent) { response.end(); return; }
      if (error instanceof HttpError || error instanceof PayloadError) send(error.status, { error: error.message });
      else send(500, { error: error instanceof Error ? error.message : String(error) });
    }
  });
  watchLedger(server, service);
  return server;
}
