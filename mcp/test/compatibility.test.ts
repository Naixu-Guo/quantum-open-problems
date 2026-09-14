import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { AdapterError, createAdapter, REQUIRED_CONTEXT_SCHEMA_VERSION, REQUIRED_IDEMPOTENCY_VERSION, REQUIRED_RETRIEVAL_VERSION, REQUIRED_RESEARCH_SEARCH_VERSION } from "../src/adapter.ts";
import { checkService } from "../src/check-service.ts";
import { createMcpServer } from "../src/shared-server.ts";

test("service preflight requires explicit context, idempotency, retrieval and research-search capabilities without probing or writing records", async t => {
  let body: Record<string, unknown> = {};
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (input: unknown, init?: RequestInit) => {
    calls++;
    assert.equal(String(input), "http://localhost:8787/api/v1/status");
    assert.equal(init?.method, "GET");
    assert.equal(new Headers(init?.headers).get("Authorization"), null);
    return Response.json(body);
  });
  for (const value of [undefined, "qop-context/1", "qop-context/3"]) {
    body = value === undefined ? {} : { contextSchemaVersion: value };
    await assert.rejects(checkService("http://localhost:8787"), error => error instanceof AdapterError && error.code === "INCOMPATIBLE_SERVICE" && error.details.retryable === false && /Deploy and restart.*API/u.test(error.message));
  }
  for (const value of [undefined, "qop-idempotency/1", "qop-idempotency/3"]) {
    body = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, ...(value === undefined ? {} : { idempotencyVersion: value }) };
    await assert.rejects(checkService("http://localhost:8787"), error => error instanceof AdapterError && error.code === "INCOMPATIBLE_SERVICE" && error.details.retryable === false);
  }
  for (const value of [undefined, "qop-retrieval/0", "qop-retrieval/2"]) {
    body = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION,
      ...(value === undefined ? {} : { retrievalVersion: value }) };
    await assert.rejects(checkService("http://localhost:8787"), error => error instanceof AdapterError && error.code === "INCOMPATIBLE_SERVICE" && error.details.retryable === false && /qop-retrieval\/1/u.test(error.message));
  }
  for (const value of [undefined, "qop-search-research/0", "qop-search-research/2"]) {
    body = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION, retrievalVersion: REQUIRED_RETRIEVAL_VERSION,
      ...(value === undefined ? {} : { researchSearchVersion: value }) };
    await assert.rejects(checkService("http://localhost:8787"), error => error instanceof AdapterError && error.code === "INCOMPATIBLE_SERVICE" && error.details.retryable === false && /qop-search-research\/1/u.test(error.message));
  }
  body = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION, retrievalVersion: REQUIRED_RETRIEVAL_VERSION, researchSearchVersion: REQUIRED_RESEARCH_SEARCH_VERSION };
  assert.deepEqual(await checkService("http://localhost:8787"), { serviceUrl: "http://localhost:8787", ...body });
  assert.equal(calls, 13);
});

test("research search checks both the dedicated marker and view even for empty results, while summary stays compatible", async t => {
  let response: Record<string, unknown> = {};
  let status = 200;
  const requests: URL[] = [];
  t.mock.method(globalThis, "fetch", async (input: unknown) => {
    requests.push(new URL(String(input)));
    return Response.json(response, { status, headers: { "X-Request-Id": "research-api-request" } });
  });
  const adapter = createAdapter("http://localhost:8787", null, true);
  const server = createMcpServer(adapter);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "research-search-compatibility", version: "1" });
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  for (const old of [
    { problems: [], total: 0 },
    { schemaVersion: "qop-search/2", problems: [], total: 0 },
    { schemaVersion: REQUIRED_RESEARCH_SEARCH_VERSION, problems: [], total: 0 },
    { schemaVersion: REQUIRED_RESEARCH_SEARCH_VERSION, view: "summary", problems: [], total: 0 },
    { schemaVersion: "qop-search-research/2", view: "research", problems: [], total: 0 },
  ]) {
    response = old;
    const result = await client.callTool({ name: "search_problems", arguments: { view: "research", maxBytes: 65536 } });
    assert.equal(result.isError, true);
    const error = result.structuredContent as Record<string, unknown>;
    assert.equal(error["code"], "INCOMPATIBLE_SERVICE");
    assert.equal(error["retryable"], false);
    assert.equal(error["requestId"], "research-api-request");
    assert.match(String(error["error"]), /qop-search-research\/1.*check:service/u);
  }
  const search = adapter.tools.find(tool => tool.name === "search_problems")!;
  response = { schemaVersion: "qop-search/2", problems: [], total: 0 };
  assert.deepEqual((await search.call({})).body, response);
  assert.equal(requests.at(-1)!.search, "", "default summary forwards no research-only budget or view");
  response = { schemaVersion: REQUIRED_RESEARCH_SEARCH_VERSION, view: "research", problems: [], total: 0 };
  assert.deepEqual((await search.call({ view: "research", maxBytes: 16384, cursor: "opaque", limit: 2 })).body, response);
  assert.equal(requests.at(-1)!.searchParams.get("maxBytes"), "16384");
  assert.equal(requests.at(-1)!.searchParams.get("cursor"), "opaque");
  status = 413;
  response = { error: "The first complete problem does not fit", code: "response_budget_too_small", minimumRequiredBytes: 20000, problemId: "fixture", maxBytes: 16384 };
  const refused = await client.callTool({ name: "search_problems", arguments: { view: "research", maxBytes: 16384 } });
  assert.equal(refused.isError, true);
  const failure = refused.structuredContent as Record<string, unknown>;
  for (const [key, value] of Object.entries(response)) assert.deepEqual(failure[key], value);
  assert.equal(failure["httpStatus"], 413);
  assert.equal(failure["retryable"], false);
});

test("research search forwards explicit empty filters for API validation without changing summary serialization", async t => {
  const requests: URL[] = [];
  t.mock.method(globalThis, "fetch", async (input: unknown) => {
    const url = new URL(String(input));
    requests.push(url);
    return url.searchParams.get("view") === "research"
      ? Response.json({ error: "Supplied filters must be nonempty" }, { status: 400 })
      : Response.json({ schemaVersion: "qop-search/2", problems: [], total: 0 });
  });
  const search = createAdapter("http://localhost:8787", null, true).tools.find(tool => tool.name === "search_problems")!;
  for (const key of ["text", "area", "topic", "difficulty", "cursor", "sort"]) {
    for (const value of ["", " \t\n", "\u00a0"]) {
      assert.equal((await search.call({ view: "research", [key]: value })).status, 400);
      const query = requests.at(-1)!.searchParams;
      assert.equal(query.has(key), true, `${key} must not disappear`);
      assert.equal(query.get(key), value, `${key} must reach the API unchanged`);
    }
    for (const view of [undefined, "summary"]) {
      assert.equal((await search.call({ ...(view ? { view } : {}), [key]: "" })).status, 200);
      assert.equal(requests.at(-1)!.searchParams.has(key), false, "summary retains its existing omission of empty strings");
    }
  }
});

test("old problem, search and sampling replies produce explicit incompatibility errors before output validation", async t => {
  let response: Record<string, unknown> = {};
  t.mock.method(globalThis, "fetch", async () => Response.json(response));
  const server = createMcpServer(createAdapter("http://localhost:8787", null, true));
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "retrieval-compatibility-test", version: "1" });
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  const cases = [
    { name: "get_problem", args: { id: "fixture" }, missing: { id: "fixture", body: "Old body" }, wrong: { id: "fixture", research: { schemaVersion: "qop-research/0" } } },
    { name: "get_problem", args: { id: "fixture", view: "research" }, missing: { id: "fixture", body: "Old body" }, wrong: { id: "fixture", research: { schemaVersion: "qop-research/2" } } },
    { name: "search_problems", args: {}, missing: { problems: [], count: 0, total: 0 }, wrong: { schemaVersion: "qop-search/1", problems: [] } },
    { name: "sample_problem", args: {}, missing: { problem: null, total: 0 }, wrong: { schemaVersion: "qop-sample/2", problem: null } },
  ];
  for (const example of cases) for (const old of [example.missing, example.wrong]) {
    response = old;
    const result = await client.callTool({ name: example.name, arguments: example.args });
    assert.equal(result.isError, true, example.name);
    const error = result.structuredContent as Record<string, unknown>;
    assert.equal(error["code"], "INCOMPATIBLE_SERVICE", example.name);
    assert.equal(error["retryable"], false);
    assert.match(String(error["error"]), /qop-retrieval\/1.*check:service/u);
    const text = result.content.find(item => item.type === "text");
    assert.ok(text && text.type === "text");
    assert.deepEqual(JSON.parse(text.text), error);
  }
});

test("old context replies produce an actionable MCP error before SDK output validation", async t => {
  const legacy = { bundleId: "old-bundle", problemId: "fixture", statementId: "old-statement", sections: [{ name: "statement", text: "Old content" }] };
  t.mock.method(globalThis, "fetch", async () => Response.json(legacy, { headers: { "X-Request-Id": "old-api-request" } }));
  const server = createMcpServer(createAdapter("http://localhost:8787", null, true));
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "compatibility-test", version: "1" });
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  const result = await client.callTool({ name: "build_context", arguments: { id: "fixture" } });
  assert.equal(result.isError, true);
  const error = result.structuredContent as Record<string, unknown>;
  assert.equal(error["code"], "INCOMPATIBLE_SERVICE");
  assert.equal(error["retryable"], false);
  assert.equal(error["requestId"], "old-api-request");
  assert.match(String(error["error"]), /check:service/u);
  assert.equal(Object.hasOwn(error, "formalContextComplete"), false, "an old context must never acquire v2 completeness guarantees");
  const text = result.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  assert.deepEqual(JSON.parse(text.text), result.structuredContent);
});

test("context compatibility handling preserves API failures and leaves other reads available", async t => {
  t.mock.method(globalThis, "fetch", async (input: unknown) => String(input).includes("/context")
    ? Response.json({ error: "Unknown problem" }, { status: 404 })
    : Response.json({ policyVersion: "1" }));
  const adapter = createAdapter("http://localhost:8787", null, true);
  const result = await adapter.tools.find(tool => tool.name === "build_context")!.call({ id: "missing" });
  assert.equal(result.status, 404);
  assert.deepEqual(result.body, { error: "Unknown problem" });
  assert.deepEqual((await adapter.tools.find(tool => tool.name === "get_policy")!.call({})).body, { policyVersion: "1" });
});

test("preflight CLI exits nonzero for an old API and passes only for the required capability", async t => {
  let status: Record<string, unknown> = {};
  const server = http.createServer((request, response) => {
    assert.equal(request.url, "/api/v1/status");
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(status));
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  t.after(async () => { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const serviceUrl = `http://127.0.0.1:${address.port}`;
  const run = () => new Promise<{ code: number | null; stdout: string; stderr: string }>((resolve, reject) => {
    const child = spawn(process.execPath, ["--experimental-strip-types", "--no-warnings", fileURLToPath(new URL("../src/check-service.ts", import.meta.url))], { env: { ...process.env, QOP_SERVICE_URL: serviceUrl }, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", chunk => { stdout += String(chunk); });
    child.stderr.on("data", chunk => { stderr += String(chunk); });
    child.once("error", reject);
    child.once("close", code => resolve({ code, stdout, stderr }));
  });
  const incompatible = await run();
  assert.equal(incompatible.code, 1);
  assert.match(incompatible.stderr, /INCOMPATIBLE_SERVICE.*check:service/u);
  status = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION };
  const oldIdempotency = await run();
  assert.equal(oldIdempotency.code, 1);
  assert.match(oldIdempotency.stderr, /INCOMPATIBLE_SERVICE.*qop-idempotency\/2/u);
  status = { contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION };
  const oldRetrieval = await run();
  assert.equal(oldRetrieval.code, 1);
  assert.match(oldRetrieval.stderr, /INCOMPATIBLE_SERVICE.*qop-retrieval\/1/u);
  status = { ...status, retrievalVersion: REQUIRED_RETRIEVAL_VERSION };
  const oldResearchSearch = await run();
  assert.equal(oldResearchSearch.code, 1);
  assert.match(oldResearchSearch.stderr, /INCOMPATIBLE_SERVICE.*qop-search-research\/1/u);
  status = { ...status, researchSearchVersion: REQUIRED_RESEARCH_SEARCH_VERSION };
  const compatible = await run();
  assert.equal(compatible.code, 0, compatible.stderr);
  assert.match(compatible.stdout, /Compatible API:.*qop-context\/2/u);
});

test("keyed writes fail before POST on an old API and cache only a successful capability probe", async t => {
  let capability: Record<string, unknown> = {};
  let statusCode = 503;
  const requests: { method: string; key: string | null; body: unknown }[] = [];
  t.mock.method(globalThis, "fetch", async (_input: unknown, init?: RequestInit) => {
    requests.push({ method: init!.method!, key: new Headers(init?.headers).get("Idempotency-Key"), body: init?.body });
    return init?.method === "GET" ? Response.json(capability, { status: statusCode }) : Response.json({ trajectoryId: "created" }, { status: 201 });
  });
  const adapter = createAdapter("http://localhost:8787", "operator-key");
  const start = adapter.tools.find(tool => tool.name === "start_trajectory")!;
  const args = { kind: "maintenance", idempotencyKey: "first-write" };
  await assert.rejects(start.call(args), error => error instanceof AdapterError && error.code === "SERVICE_PREFLIGHT_FAILED" && error.details.outcomeUnknown === false);
  statusCode = 200;
  await assert.rejects(start.call(args), error => error instanceof AdapterError && error.code === "INCOMPATIBLE_SERVICE" && error.details.retryable === false && error.details.outcomeUnknown === false);
  assert.deepEqual(requests.map(item => item.method), ["GET", "GET"], "incompatible API must not receive a mutation");
  capability = { idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION, retrievalVersion: REQUIRED_RETRIEVAL_VERSION };
  assert.equal((await start.call(args)).status, 201);
  assert.equal((await start.call({ ...args, idempotencyKey: "second-write" })).status, 201);
  assert.deepEqual(requests.map(item => item.method), ["GET", "GET", "GET", "POST", "POST"]);
  assert.ok(requests.filter(item => item.method === "GET").every(item => item.key === null && item.body === undefined));
  assert.deepEqual(requests.filter(item => item.method === "POST").map(item => [item.key, JSON.parse(String(item.body))]), [["first-write", { kind: "maintenance" }], ["second-write", { kind: "maintenance" }]]);
});

test("unkeyed writes do not depend on the new idempotency capability", async t => {
  t.mock.method(globalThis, "fetch", async (_input: unknown, init?: RequestInit) => {
    assert.equal(init?.method, "POST");
    return Response.json({ trajectoryId: "created" }, { status: 201 });
  });
  assert.equal((await createAdapter("http://localhost:8787", "operator-key").tools.find(tool => tool.name === "start_trajectory")!.call({ kind: "maintenance" })).status, 201);
});

test("cancelling an initial compatibility probe leaves another keyed write independent", async t => {
  let started!: () => void;
  const firstStarted = new Promise<void>(resolve => { started = resolve; });
  let probes = 0;
  let writes = 0;
  t.mock.method(globalThis, "fetch", async (_input: unknown, init?: RequestInit) => {
    if (init?.method === "GET") {
      if (++probes === 1) {
        started();
        return new Promise<Response>((_resolve, reject) => init.signal!.addEventListener("abort", () => reject(init.signal!.reason), { once: true }));
      }
      return Response.json({ idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION, retrievalVersion: REQUIRED_RETRIEVAL_VERSION });
    }
    writes++;
    return Response.json({ trajectoryId: "created" }, { status: 201 });
  });
  const tool = createAdapter("http://localhost:8787", "operator-key").tools.find(tool => tool.name === "start_trajectory")!;
  const controller = new AbortController();
  const first = tool.call({ idempotencyKey: "cancelled" }, { signal: controller.signal });
  const rejected = assert.rejects(first, error => error instanceof AdapterError && error.code === "CANCELLED" && error.details.outcomeUnknown === false);
  await firstStarted;
  assert.equal((await tool.call({ idempotencyKey: "independent" })).status, 201);
  controller.abort();
  await rejected;
  assert.equal(probes, 2);
  assert.equal(writes, 1);
});
