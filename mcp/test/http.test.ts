import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport, type CallToolResult } from "@modelcontextprotocol/client";
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
  assert.ok(tools.tools.every(tool => tool.annotations?.readOnlyHint === true));
  assert.ok(!tools.tools.some(tool => tool.name === "submit_batch" || tool.name === "start_trajectory"));
  assert.deepEqual(Object.keys(tools.tools.find(tool => tool.name === "get_schemas")!.inputSchema.properties!), ["name"]);
  assert.equal(value(await client.callTool({ name: "get_schemas", arguments: { name: "payloads/batch" } })).type, "object");
  const search = value(await client.callTool({ name: "search_problems", arguments: { status: "Unsolved" } }));
  assert.ok(search.problems.length > 0);
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
  assert.equal(value(await client.callTool({ name: "get_status" })).ok, true);
  assert.ok(upstreamHeaders);
  assert.equal(upstreamHeaders.authorization, undefined);
  assert.equal(upstreamHeaders.cookie, undefined);
});
