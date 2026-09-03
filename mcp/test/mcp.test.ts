/**
 * Drives the MCP server over stdio against a temporary service, the way an agent host would.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawn, spawnSync, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import type { Service } from "../../service/src/write.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..");
const contractDir = path.join(root, "contract");

let tmp: string;
let service: Service;
let server: http.Server;
let child: ChildProcessWithoutNullStreams;
let nextId = 1;
const pending = new Map<number, (message: any) => void>();

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

function rpc(method: string, params: unknown = {}): Promise<any> {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, resolve);
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
}

async function tool(name: string, args: unknown = {}): Promise<{ isError: boolean; body: any }> {
  const result = await rpc("tools/call", { name, arguments: args });
  const text = result.result?.content?.[0]?.text ?? result.error?.message ?? "";
  let body: any = text;
  try { body = JSON.parse(text); } catch { /* text */ }
  return { isError: Boolean(result.result?.isError) || Boolean(result.error), body };
}

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-mcp-"));
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(tmp, "activity"), { recursive: true });
  git(tmp, ["init", "-q", "-b", "main"]);
  git(tmp, ["add", "-A"]);
  git(tmp, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed fixtures"]);
  service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const base = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
  const agent = service.repo.current().currentOf("Actor").find((a) => a.fields["name"] === "Example research agent")!.id;
  const token = service.auth.issueKey(agent, "mcp-test");
  child = spawn(process.execPath, ["--experimental-strip-types", "--no-warnings", path.join(root, "mcp", "src", "server.ts")], { env: { ...process.env, QOP_SERVICE_URL: base, QOP_API_KEY: token }, stdio: ["pipe", "pipe", "pipe"] });
  createInterface({ input: child.stdout }).on("line", (line) => {
    if (!line.trim()) return;
    const message = JSON.parse(line);
    const resolve = pending.get(message.id);
    if (resolve) { pending.delete(message.id); resolve(message); }
  });
  child.stderr.on("data", (chunk: Buffer) => process.stderr.write(chunk));
});

after(() => {
  child.stdin.end();
  child.kill();
  server.close();
  service.index.close();
  service.auth.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("initialize, tools/list, and resources/templates/list describe the interface", async () => {
  const init = await rpc("initialize", { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "test", version: "0" } });
  assert.equal(init.result.serverInfo.name, "quantum-open-problems");
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  const tools = await rpc("tools/list");
  const names = tools.result.tools.map((t: { name: string }) => t.name);
  for (const expected of ["get_status", "search_problems", "get_frontier", "build_context", "start_trajectory", "log_event", "upload_artifact", "end_trajectory", "submit_batch", "submit_review", "post_comment", "claim_queue_item", "withdraw_contribution", "list_events"]) {
    assert.ok(names.includes(expected), `tool ${expected}`);
  }
  const templates = await rpc("resources/templates/list");
  assert.ok(templates.result.resourceTemplates.some((t: { uriTemplate: string }) => t.uriTemplate === "qop://problems/{id}/frontier"));
});

test("read tools return records with ids and digests", async () => {
  const status = await tool("get_status");
  assert.equal(status.isError, false);
  assert.ok(status.body.lastSequence > 0);
  const search = await tool("search_problems", { status: "partial" });
  assert.ok(search.body.count >= 1);
  const frontier = await tool("get_frontier", { id: "example-conformance-problem" });
  assert.match(frontier.body.statement.digest, /^sha256:/u);
  assert.equal(frontier.body.tree.length, 1);
  const context = await tool("build_context", { id: "example-conformance-problem", tokenBudget: 2000 });
  assert.match(context.body.bundleId, /^sha256:/u);
  assert.ok(context.body.sections.some((s: { name: string }) => s.name === "references"));
  const resource = await rpc("resources/read", { uri: "qop://problems/example-conformance-problem/tree" });
  assert.equal(JSON.parse(resource.result.contents[0].text).tree.length, 1);
  const unknown = await tool("get_problem", { id: "no-such-problem" });
  assert.equal(unknown.isError, true);
});

test("a run flows through start, events, artifact, and close with an attempt report", async () => {
  const frontier = (await tool("get_frontier", { id: "example-conformance-problem" })).body;
  const clause = frontier.clauses[0].ref;
  const context = (await tool("build_context", { id: "example-conformance-problem", clauseIds: [clause], tokenBudget: 4000 })).body;
  const started = await tool("start_trajectory", { kind: "research", problemIds: [frontier.problemId], statementDigests: [frontier.statement.digest], clauseIds: [clause], contextBundleId: context.bundleId, harnessConfig: "mcp test", budget: "small", visibility: "public" });
  assert.equal(started.isError, false, JSON.stringify(started.body));
  const trajectoryId = started.body.trajectoryId;
  const logged = await tool("log_event", { trajectoryId, kind: "read", summary: "Read the bundle", problemId: frontier.problemId, clauseId: clause });
  assert.equal(logged.body.seq, 1);
  const uploaded = await tool("upload_artifact", { trajectoryId, kind: "proof-text", title: "Notes", mediaType: "text/markdown", text: "# Notes\n\nNothing yet.\n" });
  assert.equal(uploaded.isError, false, JSON.stringify(uploaded.body));
  const closed = await tool("end_trajectory", { trajectoryId, cost: { tokens: 10, wallTimeSeconds: 1, moneyUsd: 0 }, body: "Abandoned.", attemptReport: { records: [
    { ref: "report", type: "Contribution", body: "Nothing found.", title: "MCP attempt", kind: "attempt-report", trajectoryId: "$ref:trajectory", problemIds: [frontier.problemId], statementId: frontier.statement.id, statementDigest: frontier.statement.digest, clauseIds: [clause], stopReason: "abandoned", newProblemIds: [], newStatementId: null, referenceIds: [], claimIds: [], artifactIds: [uploaded.body.id], declaredReadIds: [frontier.statement.id], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" },
  ] } });
  assert.equal(closed.isError, false, JSON.stringify(closed.body));
  const record = await tool("get_record", { id: trajectoryId });
  assert.equal(record.body.contextBundleId, context.bundleId);
  assert.equal(record.body.attemptReportId, closed.body.attemptReportId);
  const status = await tool("get_contribution_status", { contributionId: closed.body.attemptReportId });
  assert.equal(status.body.state, "submitted");
  const comment = await tool("post_comment", { targetType: "contribution", targetId: closed.body.attemptReportId, body: "Note to self." });
  assert.equal(comment.isError, false, JSON.stringify(comment.body));
  const queue = await tool("claim_queue_item");
  assert.notEqual(queue.body.item?.id, closed.body.attemptReportId, "the caller's own contribution is not offered to it for review");
  assert.equal(queue.body.item?.kind, "problem-proposal", "the fixture's pending proposal is offered instead");
  const withdrawn = await tool("withdraw_contribution", { contributionId: closed.body.attemptReportId, reason: "Nothing to keep." });
  assert.equal(withdrawn.isError, false, JSON.stringify(withdrawn.body));
  assert.deepEqual(service.repo.validate(), []);
});
