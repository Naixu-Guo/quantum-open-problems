/**
 * The authenticated write API, end to end over HTTP against a temporary git repository seeded
 * with the fixtures. Also runs the contract's conformance script against the same service.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import type { Service } from "../src/write.ts";
import { runConformance } from "../../contract/conformance/run.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");

let tmp: string;
let service: Service;
let server: http.Server;
let base: string;
let agentToken: string;
let editorToken: string;
let verifier1Token: string;
let verifier2Token: string;

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

const actorByName = (name: string) => service.repo.current().currentOf("Actor").find((a) => a.fields["name"] === name)!.id;
const problemByAlias = (alias: string) => service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes(alias))!;

async function call(method: "GET" | "POST", route: string, options: { token?: string; body?: unknown; raw?: Buffer; headers?: Record<string, string> } = {}): Promise<{ status: number; body: any; headers: Headers }> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  let body: string | Uint8Array | undefined;
  if (options.raw) body = new Uint8Array(options.raw);
  else if (options.body !== undefined) { body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = body;
  const response = await fetch(`${base}${route}`, init);
  return { status: response.status, body: await response.json(), headers: response.headers };
}

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-write-api-"));
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(tmp, "activity"), { recursive: true });
  git(tmp, ["init", "-q", "-b", "main"]);
  git(tmp, ["add", "-A"]);
  git(tmp, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed fixtures"]);
  service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  base = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
  agentToken = service.auth.issueKey(actorByName("Example research agent"), "test");
  editorToken = service.auth.issueKey(actorByName("Legacy audit editor"), "test");
  verifier1Token = service.auth.issueKey(actorByName("Example verifier 1"), "test");
  verifier2Token = service.auth.issueKey(actorByName("Example verifier 2"), "test");
});

after(() => {
  server.close();
  service.index.close();
  service.auth.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("writes need a valid token; reads do not", async () => {
  assert.equal((await call("GET", "/api/v1/status")).status, 200);
  assert.equal((await call("POST", "/api/v1/batches", { body: { records: [] } })).status, 401);
  assert.equal((await call("POST", "/api/v1/batches", { token: "qop_notatoken", body: { records: [] } })).status, 401);
  const me = await call("GET", "/api/v1/actors/me", { token: agentToken });
  assert.equal(me.status, 200);
  assert.equal(me.body.name, "Example research agent");
  assert.equal(me.body.keys.length, 1);
});

test("a malformed batch is refused with 422 and nothing is committed", async () => {
  const head = git(tmp, ["rev-parse", "HEAD"]);
  const schema = await call("POST", "/api/v1/batches", { token: agentToken, body: { records: [{ type: "Comment", body: "no target" }] } });
  assert.equal(schema.status, 422);
  assert.equal(schema.body.accepted, false);
  const notJson = await call("POST", "/api/v1/batches", { token: agentToken, raw: Buffer.from("{oops"), headers: { "Content-Type": "application/json" } });
  assert.equal(notJson.status, 400);
  assert.equal(git(tmp, ["rev-parse", "HEAD"]), head);
});

test("authenticated clients cannot fabricate imported catalog publication or status", async () => {
  const problem = problemByAlias("example-conformance-problem");
  const head = git(tmp, ["rev-parse", "HEAD"]);
  const forged = { ...problem.fields, body: problem.body, revision: 2, authoredCatalog: { status: "Solved", sourcePath: "database/problems_json/forged.json" } };
  for (const token of [agentToken, editorToken]) {
    const result = await call("POST", "/api/v1/batches", { token, body: { records: [forged] } });
    assert.equal(result.status, 403, JSON.stringify(result.body));
  }
  assert.equal(git(tmp, ["rev-parse", "HEAD"]), head);
});

test("a batch with $ref names is materialized, committed, and attributed to the token's actor", async () => {
  const problem = problemByAlias("example-conformance-problem");
  const source = service.repo.current().currentOf("Source")[0]!;
  const result = await call("POST", "/api/v1/batches", { token: agentToken, headers: { "Idempotency-Key": "batch-1" }, body: {
    message: "Agent adds a reference",
    records: [
      { ref: "r", type: "Reference", body: "Agent's note on why this matters.", revision: 1, sourceId: source.id, targetType: "problem", targetId: problem.id, role: "related", locator: "" },
      { ref: "c", type: "Contribution", body: "", title: "Agent reference via the API", kind: "reference", trajectoryId: null, problemIds: [problem.id], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: ["$ref:r"], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" },
    ],
  } });
  assert.equal(result.status, 201, JSON.stringify(result.body));
  assert.equal(result.body.accepted, true);
  assert.ok(result.body.refs.c);
  assert.equal(git(tmp, ["log", "-1", "--format=%an"]), "Example research agent");
  const view = await call("GET", `/api/v1/contributions/${result.body.refs.c}`);
  assert.equal(view.body.actorId, actorByName("Example research agent"));
  assert.equal(view.body.state, "submitted");
  // Replay with the same key returns the stored reply; a different body with the same key is refused.
  const replay = await call("POST", "/api/v1/batches", { token: agentToken, headers: { "Idempotency-Key": "batch-1" }, body: {
    message: "Agent adds a reference",
    records: [
      { ref: "r", type: "Reference", body: "Agent's note on why this matters.", revision: 1, sourceId: source.id, targetType: "problem", targetId: problem.id, role: "related", locator: "" },
      { ref: "c", type: "Contribution", body: "", title: "Agent reference via the API", kind: "reference", trajectoryId: null, problemIds: [problem.id], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: ["$ref:r"], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" },
    ],
  } });
  assert.equal(replay.status, 201);
  assert.equal(replay.headers.get("idempotent-replay"), "true");
  assert.equal(replay.body.refs.c, result.body.refs.c);
  const conflict = await call("POST", "/api/v1/batches", { token: agentToken, headers: { "Idempotency-Key": "batch-1" }, body: { records: [{ type: "Comment", body: "different", revision: 1, targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null }] } });
  assert.equal(conflict.status, 422);
});

test("an actor cannot write decisions without the editor role, and cannot withdraw another actor's contribution", async () => {
  const problem = problemByAlias("example-conformance-problem");
  const decision = await call("POST", "/api/v1/batches", { token: agentToken, body: { records: [{ type: "Decision", body: "x", kind: "maintenance", targetType: "problem", targetId: problem.id, mergeIntoProblemId: null, outcome: "accepted", status: null, verificationLevel: null, reviewIds: [], contributionIds: [], policyVersion: "1", effectiveAt: "2026-09-03T00:00:00.000Z" }] } });
  assert.equal(decision.status, 403);
  const contribution = service.repo.current().currentOf("Contribution").find((c) => c.fields["title"] === "Agent reference via the API")!;
  const other = await call("POST", `/api/v1/contributions/${contribution.id}/withdraw`, { token: editorToken, body: { reason: "not mine" } });
  assert.equal(other.status, 403);
  const own = await call("POST", `/api/v1/contributions/${contribution.id}/withdraw`, { token: agentToken, body: { reason: "superseded by a better note" } });
  assert.equal(own.status, 201, JSON.stringify(own.body));
  const view = await call("GET", `/api/v1/contributions/${contribution.id}`);
  assert.equal(view.body.state, "withdrawn");
});

test("a research trajectory runs from start to close with events, an artifact, and an attempt report", async () => {
  const problem = problemByAlias("example-conformance-problem");
  const frontier = await call("GET", `/api/v1/problems/${problem.id}/frontier`);
  const statementId = frontier.body.statement.id;
  const digest = frontier.body.statement.digest;
  const clause = frontier.body.clauses[0].ref;

  const started = await call("POST", "/api/v1/trajectories", { token: agentToken, body: { kind: "research", problemIds: [problem.id], statementDigests: [digest], clauseIds: [clause], contextBundleId: null, harnessConfig: "test harness", budget: "small", visibility: "public" } });
  assert.equal(started.status, 201, JSON.stringify(started.body));
  const trajectoryId = started.body.trajectoryId;

  const event = await call("POST", `/api/v1/trajectories/${trajectoryId}/events`, { token: agentToken, body: { kind: "read", summary: "Read the frontier", problemId: problem.id, clauseId: clause } });
  assert.equal(event.status, 201);
  const stuck = await call("POST", `/api/v1/trajectories/${trajectoryId}/events`, { token: agentToken, body: { kind: "stuck", summary: "No route to the existence clause", problemId: problem.id, clauseId: clause, obstacle: "missing-lemma" } });
  assert.equal(stuck.body.seq, 2);

  const upload = await call("POST", `/api/v1/trajectories/${trajectoryId}/artifacts`, { token: agentToken, raw: Buffer.from("# Notes\n\nA short attempt.\n"), headers: { "Content-Type": "text/markdown", "X-Artifact-Kind": "proof-text", "X-Artifact-Title": "Attempt notes" } });
  assert.equal(upload.status, 201, JSON.stringify(upload.body));
  assert.match(upload.body.digest, /^sha256:/u);

  const other = await call("POST", `/api/v1/trajectories/${trajectoryId}/close`, { token: editorToken, body: { cost: { tokens: 1, wallTimeSeconds: 1, moneyUsd: 0 }, body: "not mine" } });
  assert.equal(other.status, 403);

  const closed = await call("POST", `/api/v1/trajectories/${trajectoryId}/close`, { token: agentToken, body: {
    cost: { tokens: 5000, wallTimeSeconds: 60, moneyUsd: 0.05 },
    body: "Plan: look for a lemma. Outcome: none found; abandoned.",
    attemptReport: { records: [
      { ref: "report", type: "Contribution", body: "Tried to find a lemma for the existence clause; nothing usable.", title: "Attempt: existence clause", kind: "attempt-report", trajectoryId: "$ref:trajectory", problemIds: [problem.id], statementId, statementDigest: digest, clauseIds: [clause], stopReason: "abandoned", newProblemIds: [], newStatementId: null, referenceIds: [], claimIds: [], artifactIds: [upload.body.id], declaredReadIds: [statementId], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" },
    ] },
  } });
  assert.equal(closed.status, 201, JSON.stringify(closed.body));
  assert.equal(closed.body.attemptReportId, closed.body.refs.report);
  const trajectory = await call("GET", `/api/v1/records/${trajectoryId}`);
  assert.equal(trajectory.body.eventCount, 2);
  assert.equal(trajectory.body.attemptReportId, closed.body.attemptReportId);
  assert.ok(fs.existsSync(path.join(tmp, "activity", "artifact-store", `${upload.body.digest.slice(7)}`)));
  assert.equal((await call("POST", `/api/v1/trajectories/${trajectoryId}/events`, { token: agentToken, body: { kind: "note", summary: "late" } })).status, 404);
  assert.deepEqual(service.repo.validate(), []);
});

test("the conformance script passes against this service", async () => {
  const report = await runConformance({ baseUrl: base, tokens: { agent: agentToken, verifiers: [verifier1Token, verifier2Token] } });
  assert.deepEqual(report.failures, [], JSON.stringify(report, null, 1));
  assert.ok(report.steps.length >= 8);
  assert.deepEqual(service.repo.validate(), []);
});
