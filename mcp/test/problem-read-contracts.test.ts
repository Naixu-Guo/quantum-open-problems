/** MCP discovery, validation and compatibility for semantic problem categories. */
import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { createAdapter, REQUIRED_PROBLEM_READ_VERSION, type Json } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";

const version = "a".repeat(64);
const page = () => ({ schemaVersion: REQUIRED_PROBLEM_READ_VERSION, problemId: "fixture", documentVersion: version,
  section: "statement", format: "json", content: { statement: { id: "s1", clauses: [{ text: "α > 0" }] }, body: "Additional context" },
  text: null, continued: false, complete: true, nextCursor: null, maxBytes: 8192, responseBytes: 700,
  budgetSemantics: { unit: "utf8-json-bytes", representation: "compact-json", scope: "entire-api-response",
    excludes: ["http-headers", "mcp-envelope", "tokens"] } });

async function clientFor(t: TestContext, adapter: ReturnType<typeof createAdapter>) {
  const server = createMcpServer(adapter);
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "problem-read-contracts", version: "1" });
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

test("read_problem rejects old success envelopes and preserves native categories and API errors", async t => {
  let response: unknown = {};
  let status = 200;
  t.mock.method(globalThis, "fetch", async () => Response.json(response, { status, headers: { "X-Request-Id": "category-request" } }));
  const client = await clientFor(t, createAdapter("http://localhost:8787", null, true));
  for (const old of [null, {}, { schemaVersion: "qop-research/1" }, { schemaVersion: "qop-problem-read/0" }, { schemaVersion: "qop-problem-read/2" }]) {
    response = old;
    const result = await client.callTool({ name: "read_problem", arguments: { id: "fixture" } });
    assert.equal(result.isError, true);
    const error = result.structuredContent as Json;
    assert.equal(error["code"], "INCOMPATIBLE_SERVICE");
    assert.equal(error["retryable"], false);
    assert.equal(error["requestId"], "category-request");
    assert.match(String(error["error"]), /qop-problem-read\/1.*check:service/u);
    assert.equal(Object.hasOwn(error, "content"), false, "no category guarantees are invented for an old API");
  }
  response = page();
  const good = await client.callTool({ name: "read_problem", arguments: { id: "fixture" } });
  assert.equal(good.isError, false);
  assert.deepEqual(good.structuredContent, response);
  const text = good.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  assert.deepEqual(JSON.parse(text.text), response);
  for (const [httpStatus, code] of [[400, "cursor_scope_mismatch"], [400, "invalid_query"], [409, "document_changed"]] as const) {
    status = httpStatus;
    response = { error: "The requested read cannot continue", code, currentDocumentVersion: "b".repeat(64) };
    const result = await client.callTool({ name: "read_problem", arguments: { id: "fixture", cursor: "opaque", documentVersion: version } });
    assert.equal(result.isError, true);
    const error = result.structuredContent as Json;
    for (const [key, value] of Object.entries(response as Json)) assert.equal(error[key], value);
    assert.equal(error["httpStatus"], httpStatus);
    assert.equal(error["retryable"], false);
    assert.equal(error["requestId"], "category-request");
  }
});

test("read_problem exposes four categories and rejects block addressing without defaulting cursor scope", async t => {
  let calls = 0;
  const requests: URL[] = [];
  t.mock.method(globalThis, "fetch", async (input: unknown) => {
    calls++;
    requests.push(new URL(String(input)));
    return Response.json(page());
  });
  const client = await clientFor(t, createAdapter("http://localhost:8787", null, true));
  const tool = (await client.listTools()).tools.find(tool => tool.name === "read_problem")!;
  assert.ok(tool);
  assert.equal(tool.annotations?.readOnlyHint, true);
  assert.equal(tool.annotations?.idempotentHint, true);
  assert.deepEqual(tool.inputSchema.required, ["id"]);
  assert.equal(tool.inputSchema.additionalProperties, false);
  const properties = tool.inputSchema.properties as Record<string, Json>;
  assert.deepEqual(Object.keys(properties).sort(), ["cursor", "documentVersion", "id", "maxBytes", "section"]);
  assert.equal(Object.hasOwn(properties["section"]!, "default"), false, "scope inheritance must survive SDK argument handling");
  assert.equal(properties["maxBytes"]!["default"], 8192);
  assert.deepEqual(properties["section"]!["enum"], ["statement", "history", "references", "comment"]);
  for (const args of [{ id: "fixture" }, { id: "fixture", cursor: "opaque" }]) {
    assert.equal((await client.callTool({ name: "read_problem", arguments: args })).isError, false);
    assert.equal(requests.at(-1)!.searchParams.has("section"), false);
    assert.equal(requests.at(-1)!.searchParams.has("blockId"), false);
    assert.equal(requests.at(-1)!.searchParams.has("documentVersion"), false);
  }
  for (const maxBytes of [2048, 65536]) {
    assert.equal((await client.callTool({ name: "read_problem", arguments: { id: "fixture", section: "history", documentVersion: version, cursor: "opaque", maxBytes } })).isError, false);
    assert.equal(requests.at(-1)!.searchParams.get("maxBytes"), String(maxBytes));
  }
  for (const section of ["statement", "history", "references", "comment"]) {
    assert.equal((await client.callTool({ name: "read_problem", arguments: { id: "fixture", section } })).isError, false);
    assert.equal(requests.at(-1)!.searchParams.get("section"), section);
  }
  const before = calls;
  for (const args of [
    {}, { id: "" }, { id: null }, { id: 42 }, { id: "fixture", unknown: true },
    { id: "fixture", section: "unknown" }, { id: "fixture", section: "" },
    ...["all", "metadata", "source", "progress", "bibliography", "body", "discussion", "decisions"].map(section => ({ id: "fixture", section })),
    { id: "fixture", blockId: "b0" }, { id: "fixture", blockId: "b0", documentVersion: version },
    { id: "fixture", blockId: "b0", cursor: "opaque" }, { id: "fixture", path: "/body" }, { id: "fixture", offset: 0 },
    { id: "fixture", documentVersion: "" }, { id: "fixture", documentVersion: "a".repeat(63) }, { id: "fixture", documentVersion: "A".repeat(64) },
    { id: "fixture", cursor: "" }, { id: "fixture", cursor: null },
    { id: "fixture", maxBytes: 2047 }, { id: "fixture", maxBytes: 65537 }, { id: "fixture", maxBytes: 2048.5 }, { id: "fixture", maxBytes: "8192" },
  ]) assert.equal((await client.callTool({ name: "read_problem", arguments: args })).isError, true, JSON.stringify(args));
  assert.equal(calls, before, "invalid arguments must be rejected before service access");
});

test("read_problem preserves explicit empty query arguments and encodes the problem id as one path segment", async t => {
  const requests: URL[] = [];
  t.mock.method(globalThis, "fetch", async (input: unknown) => {
    requests.push(new URL(String(input)));
    return Response.json({ error: "A supplied argument is empty", code: "invalid_query" }, { status: 400 });
  });
  const read = createAdapter("http://localhost:8787", null, true).tools.find(tool => tool.name === "read_problem")!;
  for (const key of ["section", "documentVersion", "cursor"]) {
    for (const value of ["", " \t\n"]) {
      assert.equal((await read.call({ id: "alias/with?#", [key]: value })).status, 400);
      const url = requests.at(-1)!;
      assert.equal(url.pathname, "/api/v1/problems/alias%2Fwith%3F%23/read");
      assert.equal(url.searchParams.has("id"), false);
      assert.equal(url.searchParams.has(key), true);
      assert.equal(url.searchParams.get(key), value);
    }
  }
});

test("read_problem output distinguishes native categories from ordered JSON continuation", async t => {
  const adapter = createAdapter("http://localhost:8787", null, true);
  let response: unknown = page();
  adapter.tools.find(tool => tool.name === "read_problem")!.call = async () => ({ status: 200, body: response });
  const client = await clientFor(t, adapter);
  const original = page();
  const context = { available: true, semantics: "Maintainer-authored summary", provenance: { revision: 4 } };
  for (const [section, content] of [
    ["statement", { statement: null }],
    ["statement", original.content],
    ["history", { source: [{ text: "Source α" }], progress: [{ text: "Prior result" }], researchContext: context }],
    ["references", { bibliography: [{ text: "Author, work" }], references: [{ body: "Citation note" }], researchContext: context }],
    ["comment", { comment: [], discussion: [{ body: "Service discussion" }], decisions: [], researchContext: { available: false } }],
  ] as const) {
    response = { ...original, section, content };
    const result = await client.callTool({ name: "read_problem", arguments: { id: "fixture", section } });
    assert.equal(result.isError, false);
    assert.deepEqual(result.structuredContent, response);
  }
  const first = { ...original, section: "history", format: "json-continuation", content: null,
    text: '{"source":[],"progress":[', continued: false, complete: false, nextCursor: "opaque-next-page" };
  const middle = { ...first, continued: true, text: '{"text":"α"}' };
  const last = { ...first, text: '],"researchContext":{"available":false}}', continued: true, complete: true, nextCursor: null };
  for (const chunk of [first, middle, last]) {
    response = chunk;
    const result = await client.callTool({ name: "read_problem", arguments: { id: "fixture", cursor: "opaque" } });
    assert.equal(result.isError, false, "continuation text need not parse independently");
    assert.deepEqual(result.structuredContent, response);
  }
  assert.deepEqual(JSON.parse(first.text + middle.text + last.text), { source: [], progress: [{ text: "α" }], researchContext: { available: false } });
  const { continued: _continued, ...missingContinued } = original;
  for (const malformed of [
    missingContinued, { ...original, format: "text" }, { ...original, content: null }, { ...original, content: [] },
    { ...original, content: {} }, { ...original, section: "history" }, { ...original, section: "all" },
    { ...original, text: "unexpected string" }, { ...original, continued: true }, { ...original, complete: false },
    { ...original, nextCursor: "unexpected-cursor" }, { ...original, responseBytes: 65537 },
    { ...original, documentVersion: "old-revision" },
    { ...original, budgetSemantics: { ...original.budgetSemantics, scope: "category-text" } },
    { ...first, content: original.content }, { ...first, text: null }, { ...first, text: "" },
    { ...first, nextCursor: null }, { ...first, nextCursor: "" }, { ...last, nextCursor: "unexpected-cursor" },
  ]) {
    response = malformed;
    assert.equal((await client.callTool({ name: "read_problem", arguments: { id: "fixture" } })).isError, true, JSON.stringify(malformed));
  }
});
