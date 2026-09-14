import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport, type McpServer } from "@modelcontextprotocol/server";
import { ProblemReader } from "../../service/src/problem-read.ts";
import { createAdapter, type Json } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";
import { outputSchemaForTool } from "../src/schemas.ts";
import { createProblemReadDiagnosticServer, decorateProblemReadPage } from "./problem-read-diagnostics.ts";

async function connect(t: TestContext, server: McpServer) {
  const client = new Client({ name: "problem-read-diagnostic-regression", version: "1" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  t.after(async () => { await client.close(); await server.close(); });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return client;
}

test("maximum-budget real reader page accepts diagnostic overhead only in the eval SDK schema", async t => {
  const productionBefore = structuredClone(outputSchemaForTool("read_problem"));
  const original = { ...new ProblemReader().read("fixture", { id: "fixture", status: "Unsolved", statusSource: { kind: "default", recordId: "fixture", reason: "Synthetic diagnostic fixture" }, body: "x".repeat(100_000) },
    new URLSearchParams({ section: "statement", maxBytes: "65536" })).body };
  assert.equal(original.responseBytes, 65_536, "the real reader fills a legal maximum-budget page");
  const { decorated } = decorateProblemReadPage(original, 0);
  const decoratedBytes = Buffer.byteLength(JSON.stringify(decorated));
  assert.ok(decoratedBytes > 65_536);
  assert.equal(decorated["responseBytes"], decoratedBytes);
  assert.equal((decorated["diagnostic"] as Json)["originalResponseBytes"], 65_536);
  assert.equal((decorated["diagnostic"] as Json)["maxBytesAppliesTo"], "original-undecorated-api-json");
  const restored = structuredClone(decorated);
  delete restored["diagnostic"];
  for (const key of ["diagnosticStart", "diagnosticMiddle", "diagnosticEnd"]) delete restored[key];
  restored["responseBytes"] = original.responseBytes;
  assert.deepEqual(restored, original, "decoration leaves every original field and category payload unchanged");

  const adapter = createAdapter("http://localhost:8787", null, true);
  const tool = adapter.tools.find(item => item.name === "read_problem")!;
  let body: Json = original;
  let calls = 0;
  const frozenTool = { ...tool, call: async () => { calls++; return { status: 200, body }; } };
  const production = await connect(t, createMcpServer({ ...adapter, tools: [frozenTool], resources: [], resourceTemplates: [] }));
  const diagnostic = await connect(t, createProblemReadDiagnosticServer(adapter, frozenTool, decoratedBytes));
  const productionTools = (await production.listTools()).tools;
  const diagnosticTools = (await diagnostic.listTools()).tools;
  assert.deepEqual(diagnosticTools.map(item => item.name), ["read_problem"]);
  assert.equal(diagnostic.getInstructions(), production.getInstructions());
  assert.deepEqual(diagnosticTools[0]!.inputSchema, productionTools[0]!.inputSchema);
  assert.deepEqual(diagnosticTools[0]!.annotations, productionTools[0]!.annotations);
  const diagnosticSchema = structuredClone(diagnosticTools[0]!.outputSchema!);
  const responseBytes = (diagnosticSchema["properties"] as Json)["responseBytes"] as Json;
  assert.equal(responseBytes["maximum"], decoratedBytes, "eval allowance is bounded by actual frozen page size");
  responseBytes["maximum"] = 65_536;
  assert.deepEqual(diagnosticSchema, productionTools[0]!.outputSchema, "no other output constraint changes");
  const request = { name: "read_problem", arguments: { id: "fixture", section: "statement", maxBytes: 65_536 } };
  assert.equal((await production.callTool(request)).isError, false);
  body = decorated;
  const rejected = await production.callTool(request);
  assert.equal(rejected.isError, true);
  assert.match(JSON.stringify(rejected.content), /responseBytes must be <= 65536/u);
  const accepted = await diagnostic.callTool(request);
  assert.equal(accepted.isError, false);
  assert.deepEqual(accepted.structuredContent, decorated);
  const text = accepted.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  assert.deepEqual(JSON.parse(text.text), decorated);
  const beforeInvalidInput = calls;
  assert.equal((await diagnostic.callTool({ name: "read_problem", arguments: { id: "fixture", maxBytes: 65_537 } })).isError, true);
  assert.equal(calls, beforeInvalidInput, "input budget ceiling still rejects before the callback");
  body = { ...decorated, responseBytes: decoratedBytes + 1 };
  assert.equal((await diagnostic.callTool(request)).isError, true, "diagnostic allowance is finite");
  assert.deepEqual(outputSchemaForTool("read_problem"), productionBefore, "shared production schema was never mutated");
});
