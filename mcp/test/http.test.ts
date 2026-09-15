import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport, type CallToolResult } from "@modelcontextprotocol/client";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
import { createHttpMcpServer } from "../src/http.ts";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import { serializeRecord } from "../../contract/src/record.ts";
import { newId } from "../../service/src/ids.ts";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const contractDir = path.join(repo, "contract");
const git = (cwd: string, args: string[]) => execFileSync("git", args, { cwd, stdio: "pipe" });
const jsonHeaders = { "Content-Type": "application/json", Accept: "application/json, text/event-stream" };
const ping = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" });
const initializeLegacy = (url: URL) => fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({
  jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "session-lifecycle", version: "1" } },
}) });
async function initializedSession(response: Response): Promise<string> {
  assert.equal(response.status, 200);
  assert.equal((await response.json()).result.protocolVersion, "2025-11-25");
  const id = response.headers.get("mcp-session-id");
  assert.ok(id);
  return id;
}
const pingLegacy = (url: URL, id: string) => fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": id }, body: ping });

async function listen(server: http.Server): Promise<string> {
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

async function close(server: http.Server) {
  server.closeAllConnections();
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
}

async function fixture(t: TestContext, requestsPerMinute = 240) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-http-mcp-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(root, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(root, "activity"), { recursive: true });
  git(root, ["init", "-q", "-b", "main"]);
  const commit = () => {
    git(root, ["add", "-A"]);
    git(root, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Fixture update"]);
  };
  commit();
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false });
  const api = createServer(service);
  const remote = createHttpMcpServer({ serviceUrl: await listen(api), requestsPerMinute, maxBodyBytes: 4096 });
  const url = new URL(`${await listen(remote)}/mcp`);
  const clients: Client[] = [];
  t.after(async () => {
    for (const client of clients) await client.close();
    await close(remote); await close(api);
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  const connect = async (modern = false) => {
    const client = new Client({ name: "http-conformance", version: "1" }, modern ? { versionNegotiation: { mode: { pin: "2026-07-28" } } } : {});
    clients.push(client);
    await client.connect(new StreamableHTTPClientTransport(url));
    return client;
  };
  return { root, commit, service, url, connect };
}

function value(result: CallToolResult) {
  assert.equal(result.isError, false, JSON.stringify(result));
  const text = result.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  return JSON.parse(text.text);
}

for (const modern of [false, true]) test(`official ${modern ? "2026" : "legacy"} HTTP client reads tools and resources without a local adapter`, async t => {
  const { connect } = await fixture(t);
  const client = await connect(modern);
  const tools = await client.listTools();
  assert.ok(tools.tools.some(tool => tool.name === "search_problems"));
  assert.ok(tools.tools.some(tool => tool.name === "get_taxonomy"));
  assert.ok(tools.tools.some(tool => tool.name === "search_sources"));
  assert.ok(tools.tools.every(tool => tool.annotations?.readOnlyHint === true));
  assert.ok(!tools.tools.some(tool => tool.name === "submit_batch" || tool.name === "start_trajectory"));
  assert.deepEqual(Object.keys(tools.tools.find(tool => tool.name === "get_schemas")!.inputSchema.properties!), ["name"]);
  assert.equal(value(await client.callTool({ name: "get_schemas", arguments: { name: "payloads/batch" } })).type, "object");
  const search = value(await client.callTool({ name: "search_problems", arguments: { status: "Unsolved" } }));
  assert.ok(search.problems.length > 0);
  const taxonomy = value(await client.callTool({ name: "get_taxonomy" }));
  const area = taxonomy.areas.find((entry: { id: string }) => search.problems[0].areaIds.includes(entry.id));
  assert.ok(area);
  const byLabel = value(await client.callTool({ name: "search_problems", arguments: { area: area.label.toUpperCase(), limit: 1 } }));
  const bySlug = value(await client.callTool({ name: "search_problems", arguments: { area: area.id, limit: 1 } }));
  let labelPage = byLabel;
  let slugPage = bySlug;
  let traversed = 0;
  while (true) {
    const { nextCursor: labelCursor, ...labelContent } = labelPage;
    const { nextCursor: slugCursor, ...slugContent } = slugPage;
    assert.deepEqual(labelContent, slugContent, "Labels and slugs return identical scientific content and stable paging fields");
    traversed += labelPage.count;
    assert.ok(traversed <= byLabel.total, "Cursor traversal must not repeat pages");
    // Expiry instants can differ between requests; verify both signed cursors by use.
    if (labelCursor === null) {
      assert.equal(slugCursor, null);
      assert.equal(traversed, byLabel.total);
      break;
    }
    assert.equal(typeof labelCursor, "string");
    assert.equal(typeof slugCursor, "string");
    assert.ok(labelPage.count > 0);
    const nextOffset = labelPage.offset + labelPage.count;
    labelPage = value(await client.callTool({ name: "search_problems", arguments: { area: area.label.toUpperCase(), limit: 1, cursor: labelCursor } }));
    slugPage = value(await client.callTool({ name: "search_problems", arguments: { area: area.id, limit: 1, cursor: slugCursor } }));
    assert.equal(labelPage.offset, nextOffset);
    assert.equal(slugPage.offset, nextOffset);
    assert.equal(labelPage.catalogVersion, byLabel.catalogVersion);
  }
  assert.ok(byLabel.total >= byLabel.count);
  assert.equal(byLabel.count, 1);
  const pastEnd = value(await client.callTool({ name: "search_problems", arguments: { area: area.id, offset: byLabel.total } }));
  assert.equal(pastEnd.count, 0);
  assert.equal(pastEnd.nextOffset, null);
  assert.ok(value(await client.callTool({ name: "search_sources", arguments: { limit: 1 } })).sources.length);
  const id = "example-conformance-problem";
  const problem = value(await client.callTool({ name: "get_problem", arguments: { id } }));
  assert.ok(problem.id);
  assert.match(value(await client.callTool({ name: "get_frontier", arguments: { id } })).statement.digest, /^sha256:/u);
  assert.ok(value(await client.callTool({ name: "list_references", arguments: { id } })).references.length > 0);
  assert.match(value(await client.callTool({ name: "build_context", arguments: { id } })).bundleId, /^sha256:/u);
  assert.ok((await client.listResources()).resources.some(resource => resource.uri === "qop://status"));
  assert.ok((await client.listResourceTemplates()).resourceTemplates.some(resource => resource.uriTemplate === "qop://problems/{id}"));
  const resource = await client.readResource({ uri: `qop://problems/${id}` });
  const content = resource.contents[0];
  assert.ok(content && "text" in content);
  assert.equal(JSON.parse(content.text).id, problem.id);
});

test("remote clients see newly committed problems without reconnecting", async t => {
  const { root, connect, service, commit } = await fixture(t);
  const clients = [await connect(), await connect(true)];
  const original = service.repo.current().currentOf("Problem").find(record => (record.fields.aliases as string[]).includes("example-conformance-problem"))!;
  const statement = service.repo.current().currentOf("Statement").find(record => record.fields.problemId === original.id && record.fields.version === 1)!;
  const id = newId();
  for (const client of clients) assert.equal((await client.callTool({ name: "get_problem", arguments: { id } })).isError, true);
  const fields = { ...original.fields, id, revision: 1, aliases: ["new-remote-problem"], title: "New remote MCP problem", createdAt: new Date().toISOString() };
  const folder = path.join(root, "ledger/problems/new-remote-problem");
  fs.mkdirSync(path.join(folder, "statements"), { recursive: true });
  fs.writeFileSync(path.join(folder, "problem.r1.md"), serializeRecord(fields, original.body));
  fs.writeFileSync(path.join(folder, "statements/v1.md"), serializeRecord({ ...statement.fields, id: newId(), problemId: id }, statement.body));
  commit();
  for (const client of clients) {
    assert.equal(value(await client.callTool({ name: "get_problem", arguments: { id } })).title, fields.title);
    const search = value(await client.callTool({ name: "search_problems", arguments: { text: fields.title, includeCandidates: true } }));
    assert.ok(search.problems.some((problem: { id: string }) => problem.id === id));
  }
});

test("remote calls validate arguments and cannot invoke research writes", async t => {
  const { connect, service } = await fixture(t);
  const client = await connect();
  const before = service.repo.current().records.length;
  for (const args of [
    { name: "get_problem", arguments: {} },
    { name: "search_problems", arguments: { limit: -1 } },
    { name: "get_schemas", arguments: { name: "../../submissions" } },
  ]) {
    const result = await client.callTool(args);
    assert.equal(result.isError, true, args.name);
  }
  await assert.rejects(client.callTool({ name: "submit_batch", arguments: { records: [] } }), /not found/u);
  assert.equal(service.repo.current().records.length, before);
  assert.ok(value(await client.callTool({ name: "get_status" })).lastSequence > 0);
});

test("HTTP rejects untrusted hosts/origins, malformed JSON, and oversized fixed or chunked bodies", async t => {
  const { url } = await fixture(t);
  for (const [headers, body, status] of [
    [{ Origin: "https://evil.example" }, ping, 403],
    [{}, "{broken", 400],
    [{}, "x".repeat(4097), 413],
    [{ "Content-Type": "text/plain" }, ping, 415],
  ] as [Record<string, string>, string, number][]) {
    assert.equal((await fetch(url, { method: "POST", headers: { ...jsonHeaders, ...headers }, body })).status, status, JSON.stringify(headers));
  }
  const badHost = await new Promise<number>((resolve, reject) => {
    const request = http.request(url, { method: "POST", headers: { ...jsonHeaders, Host: "evil.example" } }, response => { response.resume(); resolve(response.statusCode!); });
    request.on("error", reject); request.end(ping);
  });
  assert.equal(badHost, 403);
  const chunked = await new Promise<number>((resolve, reject) => {
    const request = http.request(url, { method: "POST", headers: jsonHeaders }, response => { response.resume(); resolve(response.statusCode!); });
    request.on("error", reject);
    request.write("x".repeat(3000)); request.end("x".repeat(3000));
  });
  assert.equal(chunked, 413);
  const options = await fetch(url, { method: "OPTIONS", headers: { Origin: "http://localhost:6274" } });
  assert.equal(options.status, 204);
  assert.equal(options.headers.get("access-control-allow-origin"), "http://localhost:6274");
  assert.equal((await fetch(new URL("/other", url))).status, 404);
  assert.equal((await fetch(url)).status, 405);
  assert.equal((await fetch(url, { method: "PUT", body: "x".repeat(5000) })).status, 405);
});

test("HTTP rate limits requests with a retry time", async t => {
  const { url } = await fixture(t, 2);
  for (let i = 0; i < 2; i++) assert.equal((await fetch(url, { method: "POST", headers: jsonHeaders, body: ping })).status, 200);
  const limited = await fetch(url, { method: "POST", headers: jsonHeaders, body: ping });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.headers.get("retry-after")) > 0);
});

test("the hosted adapter never forwards client credentials or uses an operator key", async t => {
  let upstreamHeaders: http.IncomingHttpHeaders | undefined;
  const upstream = http.createServer((request, response) => {
    upstreamHeaders = request.headers;
    assert.equal(request.method, "GET");
    response.writeHead(200, { "Content-Type": "application/json" }); response.end('{"ok":true}');
  });
  const oldKey = process.env["QOP_API_KEY"];
  process.env["QOP_API_KEY"] = "fixture-operator-key";
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream) });
  if (oldKey === undefined) delete process.env["QOP_API_KEY"]; else process.env["QOP_API_KEY"] = oldKey;
  const url = new URL(`${await listen(remote)}/mcp`);
  const client = new Client({ name: "credential-test", version: "1" });
  t.after(async () => { await client.close(); await close(remote); await close(upstream); });
  await client.connect(new StreamableHTTPClientTransport(url, { requestInit: { headers: { Authorization: "Bearer fixture-client-key", Cookie: "fixture=secret" } } }));
  assert.equal(value(await client.callTool({ name: "get_policy" })).ok, true);
  assert.ok(upstreamHeaders);
  assert.equal(upstreamHeaders.authorization, undefined);
  assert.equal(upstreamHeaders.cookie, undefined);
});

function within<T>(promise: Promise<T>, timeoutMs = 3000): Promise<T> {
  let timeout: ReturnType<typeof setTimeout>;
  return Promise.race([promise, new Promise<never>((_resolve, reject) => { timeout = setTimeout(() => reject(new Error("Timed out waiting for HTTP lifecycle event")), timeoutMs); })])
    .finally(() => clearTimeout(timeout));
}

function observeCalls(server: http.Server) {
  const calls = new Map<string, { response: http.ServerResponse; ended: Promise<void> }>();
  server.on("request", (request, response) => {
    const chunks: Buffer[] = [];
    const ended = new Promise<void>(resolve => { response.once("finish", resolve); response.once("close", resolve); });
    request.on("data", chunk => chunks.push(chunk));
    request.on("end", () => {
      try {
        const message = JSON.parse(Buffer.concat(chunks).toString());
        if (message.method === "tools/call") calls.set(message.params.arguments.name, { response, ended });
      } catch { /* Non-JSON or bodyless requests are irrelevant to this observation. */ }
    });
  });
  return calls;
}

for (const modern of [false, true]) test(`official ${modern ? "2026" : "legacy"} HTTP cancellation aborts upstream and isolates identical request IDs`, async t => {
  const responses = new Map<string, http.ServerResponse>();
  let markStarted!: () => void;
  const started = new Promise<void>(resolve => { markStarted = resolve; });
  let markAborted!: () => void;
  const aborted = new Promise<void>(resolve => { markAborted = resolve; });
  const upstream = http.createServer((request, response) => {
    const name = request.url!.split("/").at(-1)!;
    responses.set(name, response);
    response.once("close", () => { if (name === "probe-first" && !response.writableEnded) markAborted(); });
    if (responses.size === 2) markStarted();
  });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream) });
  const calls = observeCalls(remote);
  const url = new URL(`${await listen(remote)}/mcp`);
  const clients: Client[] = [];
  const callIds: unknown[] = [];
  t.after(async () => {
    for (const response of responses.values()) response.destroy();
    for (const client of clients) await client.close();
    await close(remote); await close(upstream);
  });
  for (let index = 0; index < 2; index++) {
    const client = new Client({ name: `cancellation-${index}`, version: "1" }, modern ? { versionNegotiation: { mode: { pin: "2026-07-28" } } } : {});
    clients.push(client);
    await client.connect(new StreamableHTTPClientTransport(url, { fetch: async (input, init) => {
      if (typeof init?.body === "string") {
        const message = JSON.parse(init.body);
        if (message.method === "tools/call") callIds[index] = message.id;
      }
      return fetch(input, init);
    } }));
  }
  const controller = new AbortController();
  const first = clients[0]!.callTool({ name: "get_schemas", arguments: { name: "probe-first" } }, { signal: controller.signal });
  const rejected = assert.rejects(first);
  const second = clients[1]!.callTool({ name: "get_schemas", arguments: { name: "probe-second" } });
  await within(started);
  assert.equal(typeof callIds[0], "number");
  assert.equal(callIds[0], callIds[1], "the probe must exercise colliding numeric request IDs in different client sessions");
  controller.abort();
  await rejected;
  await within(aborted);
  await within(calls.get("probe-first")!.ended);
  assert.ok(calls.get("probe-first")!.response.writableEnded || calls.get("probe-first")!.response.destroyed, "the original canceled HTTP response must finish or close");
  assert.equal(responses.get("probe-second")!.destroyed, false, "another client's request must remain active");
  responses.get("probe-second")!.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":"second"}');
  assert.equal(value(await within(second)).ok, "second");
  assert.ok((await clients[1]!.listTools()).tools.length > 0);
});

test("repeated legacy cancellations release HTTP responses and SDK request ownership without disturbing other requests", async t => {
  const responses = new Map<string, http.ServerResponse>();
  const starts = new Map<string, () => void>();
  const upstream = http.createServer((request, response) => {
    const name = request.url!.split("/").at(-1)!;
    responses.set(name, response);
    starts.get(name)?.();
  });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream) });
  const calls = observeCalls(remote);
  const url = new URL(`${await listen(remote)}/mcp`);
  const client = new Client({ name: "repeated-cancellation", version: "1" });
  const transport = new StreamableHTTPClientTransport(url);
  t.after(async () => { await client.close(); await close(remote); await close(upstream); });
  let released = 0;
  const send = WebStandardStreamableHTTPServerTransport.prototype.send;
  t.mock.method(WebStandardStreamableHTTPServerTransport.prototype, "send", async function (this: WebStandardStreamableHTTPServerTransport, ...args: Parameters<typeof send>) {
    await send.apply(this, args);
    const message = args[0];
    if ("error" in message && message.error.code === -32800) {
      // A second terminal send must fail: the public API no longer owns this request ID.
      // This observes SDK cleanup without reading or mutating its private maps.
      await assert.rejects(send.call(this, message), /No connection established for request ID/u);
      released++;
    }
  });
  await client.connect(transport);
  const start = (name: string, signal?: AbortSignal) => {
    const started = new Promise<void>(resolve => starts.set(name, resolve));
    const result = client.callTool({ name: "get_schemas", arguments: { name } }, signal ? { signal } : {});
    return { started, result };
  };
  const survivor = start("survivor");
  await within(survivor.started);
  for (let index = 0; index < 5; index++) {
    const name = `cancel-${String.fromCharCode(97 + index)}`;
    const controller = new AbortController();
    const current = start(name, controller.signal);
    const rejected = assert.rejects(current.result);
    await within(current.started);
    controller.abort();
    await rejected;
    await within(calls.get(name)!.ended);
    assert.ok(calls.get(name)!.response.writableEnded || calls.get(name)!.response.destroyed);
    assert.equal(responses.get("survivor")!.destroyed, false);
    assert.ok((await client.listTools()).tools.length);
  }
  assert.equal(released, 5, "each cancellation must release SDK request ownership");
  responses.get("survivor")!.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  assert.equal(value(await within(survivor.result)).ok, true);
});

test("legacy cancellation validates notifications, rejects active ID collisions, and drains mixed batches", async t => {
  const responses = new Map<string, http.ServerResponse>();
  const starts = new Map<string, () => void>();
  const upstream = http.createServer((request, response) => {
    const name = request.url!.split("/").at(-1)!;
    responses.set(name, response); starts.get(name)?.();
  });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream) });
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { await close(remote); await close(upstream); });
  const initialize = await fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "batch-cancellation", version: "1" } } }) });
  const sessionId = initialize.headers.get("mcp-session-id")!;
  await initialize.json();
  const post = (body: unknown) => fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": sessionId }, body: JSON.stringify(body) });
  const tool = (id: number, name: string) => ({ jsonrpc: "2.0", id, method: "tools/call", params: { name: "get_schemas", arguments: { name } } });
  const cancel = (params: unknown) => ({ jsonrpc: "2.0", method: "notifications/cancelled", params });
  const started = new Promise<void>(resolve => starts.set("original", resolve));
  const original = post(tool(5, "original"));
  await within(started);
  assert.equal((await post(tool(5, "duplicate"))).status, 409);
  assert.equal((await post(cancel({ requestId: 5, reason: 7 }))).status, 202);
  assert.equal((await post(cancel({ requestId: "5" }))).status, 202);
  assert.equal(responses.get("original")!.destroyed, false, "invalid and differently typed IDs must not cancel the active numeric ID");
  assert.equal((await post(cancel({ requestId: 5 }))).status, 202);
  assert.equal((await (await within(original)).json()).error.code, -32800);
  const reusedStarted = new Promise<void>(resolve => starts.set("reused", resolve));
  const reused = post(tool(5, "reused"));
  await within(reusedStarted);
  responses.get("reused")!.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  assert.equal((await (await within(reused)).json()).result.structuredContent.ok, true);
  const batch = await within(post([tool(6, "batched"), cancel({ requestId: 6 })]));
  assert.equal(batch.status, 200);
  assert.equal((await batch.json()).error.code, -32800, "a cancellation in the same batch must settle its original response");
  assert.equal((await post([tool(8, "collision-a"), tool(8, "collision-b")])).status, 409);
  assert.equal((await post(Array.from({ length: 129 }, (_, id) => ({ jsonrpc: "2.0", id, method: "ping" })))).status, 429);
  assert.equal((await post({ jsonrpc: "2.0", id: 8, method: "ping" })).status, 200);
});

for (const id of [0, ""] as const) for (const action of ["cancel", "disconnect"] as const) test(`legacy request ID ${JSON.stringify(id)} ${action} aborts upstream and preserves wire identity`, async t => {
  const responses = new Map<string, http.ServerResponse>();
  const starts = new Map<string, () => void>();
  let aborted!: () => void;
  const upstreamAborted = new Promise<void>(resolve => { aborted = resolve; });
  const upstream = http.createServer((request, response) => {
    const name = request.url!.split("/").at(-1)!;
    responses.set(name, response);
    if (name === "falsy") response.once("close", () => { if (!response.writableEnded) aborted(); });
    starts.get(name)?.();
  });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream) });
  const calls = observeCalls(remote);
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { await close(remote); await close(upstream); });
  const send = WebStandardStreamableHTTPServerTransport.prototype.send;
  let released!: () => void;
  const ownershipReleased = new Promise<void>(resolve => { released = resolve; });
  t.mock.method(WebStandardStreamableHTTPServerTransport.prototype, "send", async function (this: WebStandardStreamableHTTPServerTransport, ...args: Parameters<typeof send>) {
    await send.apply(this, args);
    const message = args[0];
    if ("error" in message && message.error.code === -32800 && message.id === id) {
      await assert.rejects(send.call(this, message), /No connection established for request ID/u);
      released();
    }
  });
  const initialize = await fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ jsonrpc: "2.0", id: "init", method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "falsy-id", version: "1" } } }) });
  const sessionId = initialize.headers.get("mcp-session-id")!;
  assert.equal((await initialize.json()).id, "init");
  const post = (body: unknown, signal?: AbortSignal) => fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": sessionId }, body: JSON.stringify(body), ...(signal ? { signal } : {}) });
  const tool = (requestId: number | string, name: string) => ({ jsonrpc: "2.0", id: requestId, method: "tools/call", params: { name: "get_schemas", arguments: { name } } });
  const survivorStarted = new Promise<void>(resolve => starts.set("survivor", resolve));
  const survivor = post(tool("survivor", "survivor"));
  await within(survivorStarted);
  const falsyStarted = new Promise<void>(resolve => starts.set("falsy", resolve));
  const controller = new AbortController();
  // The target ID is used exactly once, after a distinct initialize ID.
  const original = post(tool(id, "falsy"), controller.signal).then(response => response.json(), error => ({ aborted: error.name === "AbortError" }));
  await within(falsyStarted);
  if (action === "cancel") assert.equal((await post({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: id } })).status, 202);
  else controller.abort();
  await within(upstreamAborted);
  await within(calls.get("falsy")!.ended);
  await within(ownershipReleased);
  const result = await within(original);
  if (action === "cancel") {
    assert.equal(result.id, id, "the terminal HTTP response must retain the original wire ID");
    assert.equal(result.error.code, -32800);
  } else assert.equal(result.aborted, true);
  assert.equal(responses.get("survivor")!.destroyed, false, "a neighboring request must remain active");
  responses.get("survivor")!.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  const survivorResult = await (await within(survivor)).json();
  assert.equal(survivorResult.id, "survivor");
  assert.equal(survivorResult.result.structuredContent.ok, true);
});

for (const action of ["DELETE", "expiry", "shutdown", "disconnect"] as const) test(`legacy ${action} drains active HTTP responses and aborts upstream`, async t => {
  const name = action.toLowerCase();
  let started!: () => void;
  const upstreamStarted = new Promise<void>(resolve => { started = resolve; });
  let aborted!: () => void;
  const upstreamAborted = new Promise<void>(resolve => { aborted = resolve; });
  const upstream = http.createServer((_request, response) => {
    response.once("close", () => { if (!response.writableEnded) aborted(); });
    started();
  });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream), legacySessionIdleTimeoutMs: action === "expiry" ? 150 : 60_000 });
  const calls = observeCalls(remote);
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { if (remote.listening) await close(remote); await close(upstream); });
  const initialized = await fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "drain", version: "1" } } }) });
  const sessionId = initialized.headers.get("mcp-session-id")!;
  await initialized.json();
  const controller = new AbortController();
  const original = fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": sessionId }, signal: controller.signal,
    body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_schemas", arguments: { name } } }) });
  const originalResult = original.then(response => response.json(), error => ({ aborted: error.name === "AbortError" }));
  await within(upstreamStarted);
  let closed: Promise<void> | undefined;
  if (action === "DELETE") assert.equal((await fetch(url, { method: "DELETE", headers: { "mcp-session-id": sessionId } })).status, 200);
  if (action === "shutdown") closed = new Promise<void>((resolve, reject) => remote.close(error => error ? reject(error) : resolve()));
  if (action === "disconnect") controller.abort();
  await within(calls.get(name)!.ended);
  await within(upstreamAborted);
  const result = await within(originalResult);
  if (action === "disconnect") assert.equal(result.aborted, true);
  else assert.equal(result.error?.code, -32800, "session termination must settle the original request");
  if (closed) await within(closed);
});

test("legacy HTTP sessions are released by DELETE and expire without affecting modern reads", async t => {
  const upstream = http.createServer((_request, response) => response.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}'));
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream), maxLegacySessions: 1, legacySessionIdleTimeoutMs: 150 });
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { await close(remote); await close(upstream); });
  const initialize = () => fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "session-bound", version: "1" } } }) });
  const malformed = await fetch(url, { method: "POST", headers: jsonHeaders, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-11-25", capabilities: "invalid" } }) });
  assert.ok((await malformed.json()).error, "an invalid initialize must fail without consuming a session slot");
  const first = await initialize();
  assert.equal(first.status, 200);
  const firstId = first.headers.get("mcp-session-id");
  assert.ok(firstId);
  await first.json();
  assert.equal((await fetch(url, { method: "DELETE", headers: { "mcp-session-id": firstId } })).status, 200);
  assert.equal((await fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": firstId }, body: ping })).status, 404);
  const replacement = await initialize();
  const replacementId = replacement.headers.get("mcp-session-id")!;
  await replacement.json();
  assert.notEqual(replacementId, firstId);
  const modern = new Client({ name: "modern-at-capacity", version: "1" }, { versionNegotiation: { mode: { pin: "2026-07-28" } } });
  t.after(() => modern.close());
  await modern.connect(new StreamableHTTPClientTransport(url));
  assert.equal(value(await modern.callTool({ name: "get_policy" })).ok, true);
  await new Promise(resolve => setTimeout(resolve, 180));
  assert.equal((await fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": replacementId }, body: ping })).status, 404);
  const afterExpiry = await initialize();
  assert.equal(afterExpiry.status, 200);
  await afterExpiry.json();
});

test("an official SDK close permits reconnect at capacity and the reclaimed session returns 404", { timeout: 10_000 }, async t => {
  const remote = createHttpMcpServer({ serviceUrl: "http://127.0.0.1:1", maxLegacySessions: 1 });
  const url = new URL(`${await listen(remote)}/mcp`);
  const first = new Client({ name: "closed-session", version: "1" });
  const second = new Client({ name: "replacement-session", version: "1" });
  const transport = new StreamableHTTPClientTransport(url);
  t.after(async () => { await first.close(); await second.close(); await close(remote); });
  await first.connect(transport);
  const firstId = transport.sessionId!;
  assert.ok(firstId);
  // SDK close does not send DELETE; its idle server session still occupies the slot.
  await first.close();
  await second.connect(new StreamableHTTPClientTransport(url));
  assert.ok((await second.listTools()).tools.length);
  const evicted = await pingLegacy(url, firstId);
  assert.equal(evicted.status, 404);
  await evicted.json();
});

test("capacity reclamation chooses the least recently used idle legacy session", { timeout: 10_000 }, async t => {
  let now = Date.now();
  t.mock.method(Date, "now", () => now);
  const remote = createHttpMcpServer({ serviceUrl: "http://127.0.0.1:1", maxLegacySessions: 2 });
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(() => close(remote));
  const first = await initializedSession(await initializeLegacy(url));
  now += 10;
  const second = await initializedSession(await initializeLegacy(url));
  now += 10;
  const touched = await pingLegacy(url, first);
  assert.equal(touched.status, 200);
  await touched.json();
  now += 10;
  const third = await initializedSession(await initializeLegacy(url));
  for (const id of [first, third]) {
    const live = await pingLegacy(url, id);
    assert.equal(live.status, 200);
    await live.json();
  }
  const evicted = await pingLegacy(url, second);
  assert.equal(evicted.status, 404);
  await evicted.json();
});

test("capacity pressure preserves active legacy requests and reclaims the session only after completion", { timeout: 10_000 }, async t => {
  let started!: () => void;
  const upstreamStarted = new Promise<void>(resolve => { started = resolve; });
  let upstreamResponse!: http.ServerResponse;
  const upstream = http.createServer((_request, response) => { upstreamResponse = response; started(); });
  const remote = createHttpMcpServer({ serviceUrl: await listen(upstream), maxLegacySessions: 1 });
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { await close(remote); await close(upstream); });
  const sessionId = await initializedSession(await initializeLegacy(url));
  const pending = fetch(url, { method: "POST", headers: { ...jsonHeaders, "mcp-session-id": sessionId }, body: JSON.stringify({
    jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "get_schemas", arguments: { name: "active" } },
  }) }).then(response => response.json());
  await within(upstreamStarted);
  const rejected = await initializeLegacy(url);
  assert.equal(rejected.status, 429);
  assert.ok(rejected.headers.get("retry-after"));
  await rejected.json();
  assert.equal(upstreamResponse.destroyed, false, "capacity reclamation must not cancel the in-flight tool");
  const live = await pingLegacy(url, sessionId);
  assert.equal(live.status, 200);
  await live.json();
  upstreamResponse.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  assert.equal((await within(pending)).result.structuredContent.ok, true);
  const replacement = await initializedSession(await initializeLegacy(url));
  assert.notEqual(replacement, sessionId);
  const evicted = await pingLegacy(url, sessionId);
  assert.equal(evicted.status, 404);
  await evicted.json();
});

test("a reserved legacy session is protected during asynchronous initialization and starts its idle clock afterward", { timeout: 10_000 }, async t => {
  let now = Date.now();
  t.mock.method(Date, "now", () => now);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let started!: () => void;
  const starting = new Promise<void>(resolve => { started = resolve; });
  let starts = 0;
  const start = WebStandardStreamableHTTPServerTransport.prototype.start;
  t.mock.method(WebStandardStreamableHTTPServerTransport.prototype, "start", async function (this: WebStandardStreamableHTTPServerTransport) {
    starts++;
    started();
    await gate;
    await start.call(this);
  });
  const remote = createHttpMcpServer({ serviceUrl: "http://127.0.0.1:1", maxLegacySessions: 1, legacySessionIdleTimeoutMs: 100 });
  const url = new URL(`${await listen(remote)}/mcp`);
  t.after(async () => { release(); await close(remote); });
  const initializing = initializeLegacy(url);
  await within(starting);
  now += 1000;
  const rejected = await within(initializeLegacy(url));
  assert.equal(rejected.status, 429, "an initializing session must not be reclaimed or expire before it can respond");
  await rejected.json();
  assert.equal(starts, 1);
  release();
  const sessionId = await initializedSession(await within(initializing));
  const live = await pingLegacy(url, sessionId);
  assert.equal(live.status, 200, "the successful handshake starts a fresh idle period");
  await live.json();
});

test("simultaneous legacy replacements reserve capacity before awaiting old-session teardown", { timeout: 10_000 }, async t => {
  const remote = createHttpMcpServer({ serviceUrl: "http://127.0.0.1:1", maxLegacySessions: 2 });
  const url = new URL(`${await listen(remote)}/mcp`);
  const oldIds = new Set([
    await initializedSession(await initializeLegacy(url)),
    await initializedSession(await initializeLegacy(url)),
  ]);
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  let retired!: () => void;
  const retiring = new Promise<void>(resolve => { retired = resolve; });
  const retiringIds = new Set<string>();
  const closeTransport = WebStandardStreamableHTTPServerTransport.prototype.close;
  t.mock.method(WebStandardStreamableHTTPServerTransport.prototype, "close", async function (this: WebStandardStreamableHTTPServerTransport) {
    if (this.sessionId && oldIds.has(this.sessionId)) {
      retiringIds.add(this.sessionId);
      if (retiringIds.size === 2) retired();
      await gate;
    }
    await closeTransport.call(this);
  });
  t.after(async () => { release(); await close(remote); });
  const replacements = [initializeLegacy(url), initializeLegacy(url)];
  await within(retiring);
  for (const response of await within(Promise.all([initializeLegacy(url), initializeLegacy(url), initializeLegacy(url)]))) {
    assert.equal(response.status, 429, "both slots must already belong to protected replacement handshakes");
    await response.json();
  }
  for (const id of oldIds) {
    const evicted = await pingLegacy(url, id);
    assert.equal(evicted.status, 404, "a retired ID must stop accepting work before teardown finishes");
    await evicted.json();
  }
  release();
  const newIds = await Promise.all((await within(Promise.all(replacements))).map(initializedSession));
  assert.equal(new Set(newIds).size, 2);
  assert.ok(newIds.every(id => !oldIds.has(id)));
  for (const id of newIds) {
    const live = await pingLegacy(url, id);
    assert.equal(live.status, 200, "both admitted replacements must remain live after concurrent pressure");
    await live.json();
  }
});
