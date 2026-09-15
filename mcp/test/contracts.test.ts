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

for (const modern of [false, true]) test(`official ${modern ? "2026" : "legacy"} SDK research search rejects empty filters through the real API and preserves summary compatibility`, async t => {
  const { endpoint, clients } = await fixture(t);
  const options = modern ? { versionNegotiation: { mode: { pin: "2026-07-28" as const } } } : {};
  const client = new Client({ name: "research-filter-contract", version: "1" }, options);
  clients.push(client);
  await client.connect(new StreamableHTTPClientTransport(endpoint));
  const call = (args: Json) => client.callTool({ name: "search_problems", arguments: args });
  const summary = body(await call({ limit: 200 }));
  assert.ok(Number(summary["total"]) > 0, "the fixture must expose the unfiltered-result regression");
  for (const view of [undefined, "summary"]) {
    const compatible = body(await call({ ...(view ? { view } : {}), limit: 200, text: "", area: "", topic: "", difficulty: "" }));
    assert.equal(compatible["schemaVersion"], "qop-search/2");
    assert.equal(compatible["total"], summary["total"]);
    assert.deepEqual(compatible["problems"], summary["problems"]);
  }
  for (const key of ["text", "area", "topic", "difficulty"]) {
    for (const value of ["", " \t\n", "\u00a0"]) {
      const result = await call({ view: "research", [key]: value });
      assert.equal(result.isError, true, `${key}=${JSON.stringify(value)} must not return unfiltered problems`);
      const error = result.structuredContent as Json;
      assert.equal(error["httpStatus"], 400, "the real API must receive and reject the supplied filter");
      assert.equal(error["code"], "INVALID_ARGUMENT");
      assert.equal(error["retryable"], false);
      assert.equal(error["error"], `${key} must be nonempty when supplied`);
      assert.equal(Object.hasOwn(error, "problems"), false);
    }
  }
  for (const key of ["cursor", "sort"]) {
    for (const value of ["", " \t\n", "\u00a0"]) {
      assert.equal((await call({ view: "research", [key]: value })).isError, true, `${key} must be rejected by SDK or API validation`);
    }
  }
  const first = (summary["problems"] as Json[])[0]!;
  const research = body(await call({ view: "research", text: first["id"] }));
  assert.equal(research["schemaVersion"], "qop-search-research/1");
  assert.equal(research["total"], 1);
  assert.equal((research["problems"] as Json[])[0]!["id"], first["id"], "valid supplied filters remain effective");
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

test("search discovery accepts optional atomic research pages and validates research-only budgets and complete problem shapes", async t => {
  const adapter = createAdapter("http://127.0.0.1:1", null, true);
  const page = { total: 0, count: 0, limit: 50, offset: 0, nextOffset: null, nextCursor: null,
    catalogVersion: "fixture", unit: "records", sort: "edited", problems: [] };
  const research = { ...page, schemaVersion: "qop-search-research/1", view: "research", sortDescription: "Catalog editing history.",
    maxBytes: 65536, responseBytes: 512,
    budgetSemantics: { unit: "utf8-json-bytes", representation: "compact-json", scope: "entire-api-response", atomicUnit: "problem", excludes: ["http-headers", "mcp-envelope", "tokens"] } };
  let response: Json = { ...page, schemaVersion: "qop-search/2" };
  let calls = 0;
  adapter.tools.find(tool => tool.name === "search_problems")!.call = async () => { calls++; return { status: 200, body: response }; };
  const client = await inMemory(t, adapter);
  const tools = (await client.listTools()).tools;
  assert.ok(!tools.some(tool => tool.name === "get_problems"));
  const search = tools.find(tool => tool.name === "search_problems")!;
  const input = search.inputSchema.properties as Record<string, Record<string, unknown>>;
  assert.deepEqual(input["view"]?.["enum"], ["summary", "research"]);
  assert.equal(input["view"]?.["default"], "summary");
  assert.equal(Object.hasOwn(input["maxBytes"]!, "default"), false, "a default byte budget must not be silently added to summary calls");
  assert.ok(Array.isArray(search.outputSchema?.oneOf));
  assert.deepEqual(body(await client.callTool({ name: "search_problems" })), response);
  response = research;
  assert.deepEqual(body(await client.callTool({ name: "search_problems", arguments: { view: "research" } })), research);
  for (const maxBytes of [16384, 1048576]) {
    body(await client.callTool({ name: "search_problems", arguments: { view: "research", maxBytes } }));
  }
  const beforeInvalid = calls;
  for (const args of [
    { view: "full" }, { maxBytes: 65536 }, { view: "summary", maxBytes: 65536 },
    { view: "research", maxBytes: 16383 }, { view: "research", maxBytes: 1048577 },
    { view: "research", maxBytes: 16384.5 }, { view: "research", maxBytes: "65536" },
  ]) assert.equal((await client.callTool({ name: "search_problems", arguments: args })).isError, true, JSON.stringify(args));
  assert.equal(calls, beforeInvalid, "invalid budget options must be rejected before service access");
  const { budgetSemantics: _budget, ...withoutBudget } = research;
  for (const malformed of [
    withoutBudget,
    { ...research, view: "summary" },
    { ...research, total: 1, count: 1, problems: [{ id: "fixture", title: "Only a summary", status: "Unsolved", areaIds: [], topicIds: [], difficulty: "unrated" }] },
  ]) {
    response = malformed;
    assert.equal((await client.callTool({ name: "search_problems", arguments: { view: "research" } })).isError, true);
  }
});

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
