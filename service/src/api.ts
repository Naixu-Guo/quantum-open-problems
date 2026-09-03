/**
 * The HTTP API. Reads are public. Writes need a bearer token for an actor, pass through body
 * limits, rate limits, and idempotency, and land in the ledger through the same write path
 * as every other client. Every route is a function of the ledger, the index, and the
 * service-local auth store.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import type { Service } from "./write.ts";
import { submit } from "./write.ts";
import { problemView, frontier, tree, attempts, contributionView, recordView, status, events, referencesOf, commentsOn, reviewQueue, contextBundle } from "./read-models.ts";
import { currentDecisions, isIndexed, contributionState } from "../../contract/src/derive.ts";
import { validatePayload } from "../../contract/src/validate.ts";
import { materialize, acceptArtifact, closeRecords, PayloadError, type BatchRecord } from "./payloads.ts";
import type { NewRecord } from "./ledger-repo.ts";
import { newId, nowIso } from "./ids.ts";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface Call {
  params: string[];
  query: URLSearchParams;
  actorId: string | null;
  raw: Buffer;
  headers: http.IncomingHttpHeaders;
}

interface Reply {
  status: number;
  body: unknown;
}

interface Route {
  method: "GET" | "POST";
  pattern: RegExp;
  auth: boolean;
  handler: (call: Call) => Reply;
}

const DAY = 24 * 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const ok = (body: unknown): Reply => ({ status: 200, body });

function integer(query: URLSearchParams, name: string, fallback: number): number {
  const raw = query.get(name);
  if (raw === null) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 0) throw new HttpError(400, `${name} must be a non-negative integer`);
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
    if (l.find("Problem", idOrAlias)) return idOrAlias;
    const byAlias = l.currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes(idOrAlias));
    if (!byAlias) throw new HttpError(404, `unknown problem ${idOrAlias}`);
    return byAlias.id;
  };
  const notNull = <T>(value: T | null | undefined, what: string): T => {
    if (value === null || value === undefined) throw new HttpError(404, `unknown ${what}`);
    return value;
  };
  const actor = (call: Call): string => {
    if (!call.actorId) throw new HttpError(401, "a bearer token for an actor is required");
    return call.actorId;
  };
  const openTrajectory = (call: Call, id: string) => {
    const open = auth.getOpenTrajectory(id);
    if (!open) throw new HttpError(404, `no open trajectory ${id}`);
    if (open.actorId !== actor(call)) throw new HttpError(403, "the trajectory belongs to another actor");
    return open;
  };
  const write = (actorId: string, records: NewRecord[], message: string, extra: Record<string, unknown> = {}): Reply => {
    const limit = service.policy.rateLimits["contributionsPerActorPerDay"] ?? 20;
    if (auth.bump(`writes:${actorId}`, DAY) > limit) throw new HttpError(429, `more than ${limit} writes today`);
    const result = submit(service, actorId, records, message);
    if (!result.ok) return { status: 422, body: { accepted: false, issues: result.issues, ...extra } };
    return { status: 201, body: { accepted: true, commit: result.commit, recordIds: records.map((r) => String(r.fields["id"])), decisions: result.decisions, automaticIssues: result.automaticIssues, ...extra } };
  };

  return [
    { method: "GET", pattern: /^\/api\/v1\/status$/u, auth: false, handler: () => ok(status(ledger(), service.index, service.policy.policyVersion)) },
    { method: "GET", pattern: /^\/api\/v1\/policy$/u, auth: false, handler: () => ok({ policyVersion: service.policy.policyVersion, thresholds: service.policy.thresholds, independence: service.policy.independence, mechanicalMethods: service.policy.mechanicalMethods, rateLimits: service.policy.rateLimits, bodyLimits: service.policy.bodyLimits, licenses: service.policy.licenses }) },
    { method: "GET", pattern: /^\/api\/v1\/schemas\/payloads\/([a-z-]+)$/u, auth: false, handler: ({ params }) => ok(readSchema(path.join(service.repo.schemaDir, "payloads", `${params[0]}.schema.json`), params[0]!)) },
    { method: "GET", pattern: /^\/api\/v1\/schemas\/([a-z-]+)$/u, auth: false, handler: ({ params }) => ok(readSchema(path.join(service.repo.schemaDir, `${params[0]}.schema.json`), params[0]!)) },
    { method: "GET", pattern: /^\/api\/v1\/problems$/u, auth: false, handler: ({ query }) => {
      const rows = service.index.problemRows({
        ...(query.get("status") ? { status: query.get("status")! } : {}),
        ...(query.get("area") ? { area: query.get("area")! } : {}),
        ...(query.get("topic") ? { topic: query.get("topic")! } : {}),
        ...(query.get("difficulty") ? { difficulty: query.get("difficulty")! } : {}),
        ...(query.get("text") ? { text: query.get("text")! } : {}),
        indexedOnly: query.get("includeCandidates") !== "true",
        limit: integer(query, "limit", 50),
        sort: query.get("sort") === "stale" ? "stale" : "title",
      });
      return ok({ count: rows.length, problems: rows.map((row) => ({ id: row.id, alias: row.alias, title: row.title, role: row.role, catalogState: row.catalog_state, status: row.status, areaIds: JSON.parse(row.area_ids), topicIds: JSON.parse(row.topic_ids), difficulty: row.difficulty, lastActivity: row.last_activity, lastHumanReview: row.last_human_review })) });
    } },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)$/u, auth: false, handler: ({ params }) => ok(notNull(problemView(ledger(), resolveProblem(params[0]!)), "problem")) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/frontier$/u, auth: false, handler: ({ params }) => ok(notNull(frontier(ledger(), resolveProblem(params[0]!)), "problem")) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/tree$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), tree: tree(ledger(), resolveProblem(params[0]!)) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/attempts$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), attempts: attempts(ledger(), resolveProblem(params[0]!)) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/indexed$/u, auth: false, handler: ({ params }) => ok({ problemId: resolveProblem(params[0]!), indexed: isIndexed(ledger(), resolveProblem(params[0]!), currentDecisions(ledger())) }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/references$/u, auth: false, handler: ({ params, query }) => ({ status: 200, body: { problemId: resolveProblem(params[0]!), references: referencesOf(ledger(), resolveProblem(params[0]!), query.get("role") ?? undefined) } }) },
    { method: "GET", pattern: /^\/api\/v1\/problems\/([^/]+)\/context$/u, auth: false, handler: ({ params, query }) => {
      const clauses = query.get("clauses")?.split(",").filter(Boolean);
      return ok(notNull(contextBundle(ledger(), resolveProblem(params[0]!), clauses, integer(query, "budget", 8000)), "problem"));
    } },
    { method: "GET", pattern: /^\/api\/v1\/comments$/u, auth: false, handler: ({ query }) => {
      const targetType = query.get("targetType");
      const targetId = query.get("targetId");
      if (!targetType || !targetId) throw new HttpError(400, "targetType and targetId are required");
      return ok({ targetType, targetId, comments: commentsOn(ledger(), targetType, targetId) });
    } },
    { method: "GET", pattern: /^\/api\/v1\/queues\/review$/u, auth: false, handler: (call) => ok({ queue: "review", items: reviewQueue(ledger(), call.actorId) }) },
    { method: "GET", pattern: /^\/api\/v1\/contributions\/([^/]+)$/u, auth: false, handler: ({ params }) => ok(notNull(contributionView(ledger(), params[0]!), "contribution")) },
    { method: "GET", pattern: /^\/api\/v1\/records\/([^/]+)$/u, auth: false, handler: ({ params }) => ok(notNull(recordView(ledger(), params[0]!), "record")) },
    { method: "GET", pattern: /^\/api\/v1\/events$/u, auth: false, handler: ({ query }) => ok(events(ledger(), service.index, integer(query, "after", 0), integer(query, "limit", 100), query.get("type") ?? undefined)) },
    { method: "GET", pattern: /^\/api\/v1\/actors\/me$/u, auth: true, handler: (call) => ok({ ...notNull(recordView(ledger(), actor(call)), "actor"), keys: auth.keysFor(actor(call)) }) },

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
      const kind = String(call.headers["x-artifact-kind"] ?? "");
      const title = String(call.headers["x-artifact-title"] ?? "");
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

export function createServer(service: Service): http.Server {
  const table = routes(service);
  const bodyLimit = service.policy.bodyLimits["contributionBytes"] ?? 262144;
  const perMinute = service.policy.rateLimits["requestsPerAddressPerMinute"] ?? 600;

  return http.createServer(async (request, response) => {
    const send = (code: number, payload: unknown, extra: Record<string, string> = {}) => {
      const body = JSON.stringify(payload, null, 1);
      response.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body), "Cache-Control": code === 200 && request.method === "GET" ? "public, max-age=15" : "no-store", ...extra });
      response.end(body);
    };
    try {
      const address = request.socket.remoteAddress ?? "unknown";
      if (service.auth.bump(`address:${address}`, MINUTE) > perMinute) throw new HttpError(429, "too many requests from this address");
      const method = request.method === "GET" || request.method === "POST" ? request.method : null;
      if (!method) throw new HttpError(405, "GET or POST only");
      const url = new URL(request.url ?? "/", "http://localhost");
      const route = table.find((candidate) => candidate.method === method && candidate.pattern.test(url.pathname));
      if (!route) throw new HttpError(404, `no route for ${method} ${url.pathname}`);

      let actorId: string | null = null;
      const header = request.headers.authorization;
      if (header?.startsWith("Bearer ")) {
        actorId = service.auth.actorForToken(header.slice(7).trim());
        if (!actorId) throw new HttpError(401, "the token is unknown or revoked");
        if (!service.repo.current().find("Actor", actorId)) throw new HttpError(401, "the token's actor is not in the ledger");
      }
      if (route.auth && !actorId) throw new HttpError(401, "a bearer token for an actor is required");

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
      const reply = route.handler({ params: match.slice(1).map((s) => decodeURIComponent(s)), query: url.searchParams, actorId, raw, headers: request.headers });
      if (typeof idempotencyKey === "string" && actorId) service.auth.remember(actorId, idempotencyKey, requestHash, reply.status, JSON.stringify(reply.body));
      send(reply.status, reply.body);
    } catch (error) {
      if (error instanceof HttpError || error instanceof PayloadError) send(error.status, { error: error.message });
      else send(500, { error: error instanceof Error ? error.message : String(error) });
    }
  });
}
