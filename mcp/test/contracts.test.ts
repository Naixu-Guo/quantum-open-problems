/** Exercise the same public contract through official SDK clients on both transports. */
import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport, type CallToolResult } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { AdapterError, createAdapter, type Json } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";
import { createHttpMcpServer } from "../src/http.ts";
import { toolFailure, toolResult } from "../src/result.ts";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
async function listen(server: http.Server): Promise<string> {
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}
async function fixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-mcp-contract-"));
  for (const dir of ["ledger", "activity"]) fs.cpSync(path.join(repo, "contract/fixtures", dir), path.join(root, dir), { recursive: true });
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git(["init", "-q", "-b", "main"]);
  git(["add", "-A"]);
  git(["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Fixture"]);
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false });
  const api = createServer(service);
  const origin = await listen(api);
  const remote = createHttpMcpServer({ serviceUrl: origin });
  const endpoint = new URL(`${await listen(remote)}/mcp`);
  const clients: Client[] = [];
  t.after(async () => {
    for (const client of clients) await client.close();
    for (const server of [remote, api]) { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  return { origin, endpoint, clients };
}
function body(result: CallToolResult): Json {
  assert.equal(result.isError, false, JSON.stringify(result));
  const text = result.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  assert.deepEqual(result.structuredContent, JSON.parse(text.text));
  return result.structuredContent as Json;
}

async function compareSearchPages(local: Client, remote: Client, args: Json, firstLocal: Json, firstRemote: Json) {
  let localPage = firstLocal;
  let remotePage = firstRemote;
  let read = 0;
  while (true) {
    const { nextCursor: localCursor, ...localContent } = localPage;
    const { nextCursor: remoteCursor, ...remoteContent } = remotePage;
    assert.deepEqual(localContent, remoteContent, "All scientific content and stable pagination fields must agree");
    read += Number(localPage["count"]);
    assert.ok(read <= Number(localPage["total"]), "Cursor traversal must terminate without repeated pages");
    // Independent first reads may have different expiry instants and signatures.
    // Validate the opaque cursors by consuming both rather than fixing the clock.
    if (localCursor === null) {
      assert.equal(remoteCursor, null);
      assert.equal(read, Number(firstLocal["total"]));
      break;
    }
    assert.equal(typeof localCursor, "string");
    assert.equal(typeof remoteCursor, "string");
    assert.ok(Number(localPage["count"]) > 0);
    const nextOffset = Number(localPage["offset"]) + Number(localPage["count"]);
    [localPage, remotePage] = await Promise.all([
      local.callTool({ name: "search_problems", arguments: { ...args, cursor: localCursor } }).then(body),
      remote.callTool({ name: "search_problems", arguments: { ...args, cursor: remoteCursor } }).then(body),
    ]);
    assert.equal(localPage["offset"], nextOffset);
    assert.equal(remotePage["offset"], nextOffset);
    assert.equal(localPage["catalogVersion"], firstLocal["catalogVersion"]);
  }
}

for (const modern of [false, true]) test(`official ${modern ? "2026" : "legacy"} stdio and HTTP clients share schemas, read results and resolvable resource links`, async t => {
  const { origin, endpoint, clients } = await fixture(t);
  const options = modern ? { versionNegotiation: { mode: { pin: "2026-07-28" as const } } } : {};
  const local = new Client({ name: "stdio-contract", version: "1" }, options);
  const remote = new Client({ name: "http-contract", version: "1" }, options);
  clients.push(local, remote);
  await local.connect(new StdioClientTransport({ command: process.execPath, args: ["--experimental-strip-types", "--no-warnings", path.join(repo, "mcp/src/server.ts")], env: { QOP_SERVICE_URL: origin }, stderr: "pipe" }));
  await remote.connect(new StreamableHTTPClientTransport(endpoint));
  const localTools = (await local.listTools()).tools;
  assert.deepEqual(localTools, (await remote.listTools()).tools);
  assert.ok(localTools.every(tool => tool.annotations?.readOnlyHint && tool.annotations?.destructiveHint === false));
  assert.ok(!localTools.some(tool => tool.name === "submit_batch"));
  const id = "example-conformance-problem";
  const calls = [
    ["get_status", {}], ["search_problems", { limit: 1 }], ["search_sources", { limit: 1 }],
    ["get_problem", { id }], ["get_frontier", { id }], ["get_tree", { id }],
    ["list_references", { id }], ["build_context", { id, tokenBudget: 200 }],
  ] as const;
  for (const [name, args] of calls) {
    const result = await local.callTool({ name, arguments: args });
    const payload = body(result);
    const remotePayload = body(await remote.callTool({ name, arguments: args }));
    if (name === "search_problems") await compareSearchPages(local, remote, args, payload, remotePayload);
    else assert.deepEqual(payload, remotePayload, name);
    const required = localTools.find(tool => tool.name === name)?.outputSchema?.required;
    assert.ok(Array.isArray(required) && required.length > 0, `${name} must advertise its required output fields`);
    const links = result.content.filter(item => item.type === "resource_link");
    assert.ok(links.length, `${name} must return a resource link`);
    for (const link of links) {
      assert.equal(link.type, "resource_link");
      const contents = (await remote.readResource({ uri: link.uri })).contents;
      assert.ok(contents.length, `the returned URI must resolve: ${link.uri}`);
    }
    if (name === "build_context") {
      assert.equal(payload["schemaVersion"], "qop-context/2");
      assert.equal(typeof payload["statementVersion"], "number");
      assert.equal(payload["formalContextComplete"], false);
      assert.equal(payload["incomplete"], true);
    }
  }
  for (const client of clients) {
    for (const args of [{ limit: -1 }, { inventedFilter: "value" }, { status: "unknown" }]) {
      assert.equal((await client.callTool({ name: "search_problems", arguments: args })).isError, true);
    }
  }
});

async function inMemory(t: TestContext, adapter: ReturnType<typeof createAdapter>) {
  const server = createMcpServer(adapter);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "validation-contract", version: "1" });
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

test("authenticated schemas reject malformed writes before side effects and retain scientific payload fields", async t => {
  const adapter = createAdapter("http://127.0.0.1:1", "fixture-key");
  const seen: Json[] = [];
  for (const tool of adapter.tools) tool.call = async args => { seen.push(args); return { status: 200, body: { accepted: true } }; };
  const client = await inMemory(t, adapter);
  const tools = (await client.listTools()).tools;
  assert.equal(tools.find(tool => tool.name === "withdraw_contribution")?.annotations?.destructiveHint, true);
  assert.equal(tools.find(tool => tool.name === "start_trajectory")?.annotations?.readOnlyHint, false);
  const trajectoryId = "01M1GZV1G0YW6HZP3QV230QWSR";
  const artifact = { trajectoryId, kind: "log", title: "Notes", mediaType: "text/plain" };
  for (const args of [artifact, { ...artifact, text: "x", base64: "eA==" }, { ...artifact, base64: "not base64!" }]) {
    assert.equal((await client.callTool({ name: "upload_artifact", arguments: args })).isError, true);
  }
  assert.equal((await client.callTool({ name: "end_trajectory", arguments: { trajectoryId, cost: {}, body: "done" } })).isError, true);
  assert.equal((await client.callTool({ name: "start_trajectory", arguments: { kind: "maintenance", problemIds: [trajectoryId, trajectoryId], statementDigests: [], harnessConfig: "test", budget: "small", visibility: "public" } })).isError, true);
  assert.equal(seen.length, 0);
  const records = [{ ref: "note", type: "Comment", body: "Discussion", targetType: "problem", targetId: trajectoryId, parentCommentId: null }];
  body(await client.callTool({ name: "submit_batch", arguments: { records, idempotencyKey: "test-write" } }));
  assert.deepEqual(seen[0]?.["records"], records, "per-record scientific fields must survive shared validation");
});

test("SDK cancellation reaches the tool invocation while other requests can finish", async t => {
  const adapter = createAdapter("http://127.0.0.1:1", null, true);
  let start!: () => void;
  const started = new Promise<void>(resolve => { start = resolve; });
  let observeAbort!: () => void;
  const aborted = new Promise<void>(resolve => { observeAbort = resolve; });
  adapter.tools.find(tool => tool.name === "get_policy")!.call = async (_args, options) => {
    start();
    assert.ok(options?.signal);
    return new Promise((_resolve, reject) => options.signal!.addEventListener("abort", () => { observeAbort(); reject(options.signal!.reason); }, { once: true }));
  };
  const client = await inMemory(t, adapter);
  const controller = new AbortController();
  const pending = client.callTool({ name: "get_policy" }, { signal: controller.signal });
  const rejected = assert.rejects(pending);
  await started;
  assert.deepEqual(await client.ping(), {});
  controller.abort();
  await rejected;
  await aborted;
});

test("results preserve service errors, retry timing and uncertain-write diagnostics", () => {
  const limited = toolResult("search_problems", {}, { status: 429, body: { error: "Please wait", context: "catalog" }, headers: { retryAfter: "2", requestId: "read-123" } });
  assert.deepEqual(limited.structuredContent, { error: "Please wait", context: "catalog", code: "RATE_LIMITED", httpStatus: 429, retryable: true, retryAfterMs: 2000, requestId: "read-123" });
  const uncertain = toolFailure(new AdapterError("SERVICE_TIMEOUT", "Response lost", { retryable: true, outcomeUnknown: true, requestId: "write-123" }));
  assert.deepEqual(uncertain.structuredContent, { error: "Response lost", code: "SERVICE_TIMEOUT", retryable: true, outcomeUnknown: true, requestId: "write-123" });
  assert.equal(uncertain.isError, true);
  const unkeyed = toolResult("submit_batch", {}, { status: 503, body: { error: "Response failed" } }, false);
  assert.equal((unkeyed.structuredContent as Json)["retryable"], false);
  assert.equal((unkeyed.structuredContent as Json)["outcomeUnknown"], true);
  const keyed = toolResult("submit_batch", { idempotencyKey: "stable" }, { status: 503, body: { error: "Response failed" } }, false);
  assert.equal((keyed.structuredContent as Json)["retryable"], true);
});
