/** Evaluation-only decoration and SDK registration; production schemas stay unchanged. */
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { fromJsonSchema, type ServerContext } from "@modelcontextprotocol/server";
import { type createAdapter, type Json, type Tool } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";
import { outputSchemaForTool } from "../src/schemas.ts";
import { toolFailure, toolResult } from "../src/result.ts";

const bytes = (value: unknown) => Buffer.byteLength(JSON.stringify(value));

export function decorateProblemReadPage(original: Json, pageIndex: number): { decorated: Json; markers: Json } {
  const markers = Object.fromEntries(["diagnosticStart", "diagnosticMiddle", "diagnosticEnd"].map(key => [key, `qop_read_${randomBytes(16).toString("hex")}`]));
  const { content, text, responseBytes: _size, ...envelope } = structuredClone(original);
  const decorated: Json = { diagnosticStart: markers["diagnosticStart"], diagnostic: { synthetic: true, pageIndex,
    meaning: "Opaque evaluation markers only; not scientific material. Markers surround envelope and category payload; Middle is not a byte midpoint.",
    originalResponseBytes: bytes(original), maxBytesAppliesTo: "original-undecorated-api-json" }, ...envelope,
    diagnosticMiddle: markers["diagnosticMiddle"], content, text, diagnosticEnd: markers["diagnosticEnd"], responseBytes: 0 };
  const restored = Object.fromEntries(Object.entries(decorated).filter(([key]) => !key.startsWith("diagnostic")));
  restored["responseBytes"] = original["responseBytes"];
  assert.deepEqual(restored, original, "No category content or continuation text may be modified");
  while (decorated["responseBytes"] !== bytes(decorated)) decorated["responseBytes"] = bytes(decorated);
  return { decorated, markers };
}

/** Bound only diagnostic responseBytes by the actual frozen pages' maximum. */
export function createProblemReadDiagnosticServer(adapter: ReturnType<typeof createAdapter>, tool: Tool, maximumResponseBytes: number) {
  assert.equal(tool.name, "read_problem");
  assert.equal(tool.readOnly, true);
  assert.ok(Number.isSafeInteger(maximumResponseBytes) && maximumResponseBytes > 0);
  const production = outputSchemaForTool(tool.name);
  assert.ok(production);
  const output = structuredClone(production);
  const responseBytes = (output["properties"] as Json)["responseBytes"] as Json;
  assert.equal(typeof responseBytes["maximum"], "number");
  responseBytes["maximum"] = Math.max(responseBytes["maximum"] as number, maximumResponseBytes);
  // Keep the shared instructions, but register only the diagnostic tool with its
  // own output schema. Do not mutate the shared production schema or registry.
  const server = createMcpServer({ ...adapter, tools: [], resources: [], resourceTemplates: [] });
  server.registerTool(tool.name, {
    description: tool.description,
    inputSchema: fromJsonSchema<Json>(tool.inputSchema),
    outputSchema: fromJsonSchema<Json>(output),
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (args: Json, context: ServerContext) => {
    try { return toolResult(tool.name, args, await tool.call(args, { signal: context.mcpReq.signal }), tool.readOnly); }
    catch (error) { return toolFailure(error); }
  });
  return server;
}
