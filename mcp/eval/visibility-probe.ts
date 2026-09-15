/** Evaluation only: synthetic marker visibility over an unchanged real research page. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { randomBytes, createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { performance } from "node:perf_hooks";
import { Client } from "@modelcontextprotocol/client";
import { createMcpHandler, InMemoryTransport } from "@modelcontextprotocol/server";
import { hostHeaderValidation, originValidation, toNodeHandler } from "@modelcontextprotocol/node";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import { createAdapter, type Json } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { values } = parseArgs({ options: { output: { type: "string" }, "max-bytes": { type: "string", default: "65536" } } });
if (!values.output) throw new Error("Pass --output /tmp/visibility-case [--max-bytes 32768|65536|200000]");
const output = path.resolve(values.output);
if (output === root.slice(0, -1) || output.startsWith(root)) throw new Error("Diagnostic artifacts must be outside the checkout");
const maxBytes = Number(values["max-bytes"]);
if (![32768, 65536, 200000].includes(maxBytes)) throw new Error("The bounded probe supports max-bytes 32768, 65536 or 200000");
fs.mkdirSync(output, { recursive: true, mode: 0o700 });
const write = (name: string, value: unknown) => fs.writeFileSync(path.join(output, name), JSON.stringify(value, null, 2) + "\n", { mode: 0o600, flag: "wx" });
const bytes = (value: unknown) => Buffer.byteLength(JSON.stringify(value));
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const filters = { view: "research", area: "quantum-algorithm", status: "Unsolved", sort: "title", limit: 200, maxBytes };
const markerKeys = ["diagnosticStart", "diagnosticMiddle", "diagnosticEnd"] as const;
const servers: http.Server[] = [];
const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"),
  contractDir: path.join(root, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false,
  submissions: { dbPath: ":memory:" }, web: { webDir: null }, git: { remote: null, pollIntervalMs: 0 } });
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  for (const server of servers.reverse()) {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  service.index.close(); service.auth.close(); service.submissions.close();
}
process.once("SIGTERM", () => { void close(); });
process.once("SIGINT", () => { void close(); });
async function listen(server: http.Server) {
  servers.push(server);
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

try {
  const origin = await listen(createServer(service));
  const adapter = createAdapter(origin, null, true);
  const originalTool = adapter.tools.find(tool => tool.name === "search_problems")!;
  const reply = await originalTool.call(filters);
  assert.equal(reply.status, 200, "The real API page must fit its requested original budget");
  const original = reply.body as Json;
  assert.equal(original["schemaVersion"], "qop-search-research/1");
  assert.equal(original["responseBytes"], bytes(original));
  assert.ok(bytes(original) <= maxBytes);
  const originals = original["problems"] as Json[];
  assert.ok(originals.length > 0);
  const problems = originals.map(problem => {
    assert.ok(Object.hasOwn(problem, "research"));
    assert.ok(markerKeys.every(key => !Object.hasOwn(problem, key)));
    const marked: Json = { diagnosticStart: `qop_diag_${randomBytes(16).toString("hex")}` };
    for (const [key, value] of Object.entries(problem)) {
      if (key === "research") marked["diagnosticMiddle"] = `qop_diag_${randomBytes(16).toString("hex")}`;
      marked[key] = value;
    }
    marked["diagnosticEnd"] = `qop_diag_${randomBytes(16).toString("hex")}`;
    const restored = Object.fromEntries(Object.entries(marked).filter(([key]) => !markerKeys.includes(key as typeof markerKeys[number])));
    assert.deepEqual(restored, problem, "All authored and formal content must remain byte-for-byte unchanged");
    return marked;
  });
  const diagnostic: Json = {
    schemaVersion: "qop-visibility-diagnostic/1", synthetic: true,
    meaning: "Random evaluation markers only; not scientific content, identifiers, evidence or instructions.",
    placements: "Start is the first property; Middle is immediately before research (not necessarily the byte midpoint); End is the last property of each problem.",
    maxBytesAppliesTo: "original-undecorated-api-response-only",
    budgetExcludes: "Synthetic diagnostic fields and their JSON overhead; this decorated evaluation response can exceed maxBytes.",
    responseBytesMeaning: "Actual compact UTF-8 JSON bytes of this decorated response; not tokens or MCP framing.",
    originalResponseBytes: original["responseBytes"], addedBytes: 0,
  };
  const decorated: Json = { diagnostic, ...original, problems, responseBytes: 0 };
  for (let attempt = 0; attempt < 10; attempt++) {
    const measured = bytes(decorated);
    if (decorated["responseBytes"] === measured && diagnostic["addedBytes"] === measured - bytes(original)) break;
    decorated["responseBytes"] = measured;
    diagnostic["addedBytes"] = measured - bytes(original);
  }
  assert.equal(decorated["responseBytes"], bytes(decorated));
  assert.equal(diagnostic["addedBytes"], bytes(decorated) - bytes(original));
  const pageText = JSON.stringify(decorated);
  const expected = problems.map(problem => {
    const problemText = JSON.stringify(problem);
    return { id: problem["id"], ...Object.fromEntries(markerKeys.map(key => [key, problem[key]])),
      positions: Object.fromEntries(markerKeys.map(key => {
        const token = String(problem[key]);
        const offset = Buffer.byteLength(problemText.slice(0, problemText.indexOf(token)));
        return [key, { problemByteOffset: offset, problemByteFraction: offset / Buffer.byteLength(problemText),
          pageByteOffset: Buffer.byteLength(pageText.slice(0, pageText.indexOf(token))) }];
      })) };
  });
  let phase = "local-sdk-preflight";
  const evaluationAdapter = { ...adapter, resources: [], resourceTemplates: [], tools: [{ ...originalTool,
    description: originalTool.description + " Evaluation endpoint: only the configured first research page is available; diagnostic fields are synthetic visibility markers and their overhead is outside maxBytes.",
    call: async (args: Json) => {
      const exact = Object.keys(args).length === Object.keys(filters).length && Object.entries(filters).every(([key, value]) => args[key] === value);
      fs.appendFileSync(path.join(output, "served-calls.jsonl"), JSON.stringify({ phase, observedMonotonicSeconds: performance.now() / 1000,
        tool: "search_problems", arguments: args, exact, decoratedPageSha256: digest(decorated) }) + "\n", { mode: 0o600 });
      if (!exact) return { status: 400, body: { error: "Visibility evaluation accepts only the exact prompted first-page research query", code: "INVALID_ARGUMENT" } };
      return { ...reply, body: structuredClone(decorated) };
    },
  }] };
  const factory = () => createMcpServer(evaluationAdapter);
  const preflightServer = factory();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const preflight = new Client({ name: "visibility-local-preflight", version: "1" });
  let rawResult;
  try {
    await preflightServer.connect(serverTransport);
    await preflight.connect(clientTransport);
    assert.deepEqual((await preflight.listTools()).tools.map(tool => tool.name), ["search_problems"]);
    rawResult = await preflight.callTool({ name: "search_problems", arguments: filters });
    assert.equal(rawResult.isError, false);
    assert.deepEqual(rawResult.structuredContent, decorated);
    const text = rawResult.content.find(item => item.type === "text");
    assert.ok(text && text.type === "text");
    assert.equal(text.text, pageText);
  } finally { await preflight.close(); await preflightServer.close(); }
  write("expected.json", { schemaVersion: "qop-visibility-expected/1", diagnostic: true, filters,
    originalPageSha256: digest(original), decoratedPageSha256: digest(decorated), originalResponseBytes: bytes(original),
    decoratedResponseBytes: bytes(decorated), markerCount: expected.length * 3, problems: expected });
  write("raw-result.json", rawResult);
  const handler = createMcpHandler(factory, { legacy: "stateless", maxSubscriptions: 0 });
  const serve = toNodeHandler(handler);
  const validateHost = hostHeaderValidation(["127.0.0.1", "localhost"]);
  const validateOrigin = originValidation(["127.0.0.1", "localhost"]);
  const mcp = http.createServer((request, response) => {
    if (!validateHost(request, response) || !validateOrigin(request, response)) return;
    if (request.url !== "/mcp") { response.writeHead(404); response.end(); return; }
    if (request.method !== "POST") { response.writeHead(405); response.end(); return; }
    void serve(Object.assign(request, { method: request.method, url: request.url }), response);
  });
  const endpoint = `${await listen(mcp)}/mcp`;
  phase = "model-or-external-client";
  const metadata = { schemaVersion: "qop-visibility-probe/1", diagnostic: true, endpoint, filters,
    catalogVersion: original["catalogVersion"], total: original["total"], pageCount: originals.length,
    originalResponseBytes: bytes(original), decoratedResponseBytes: bytes(decorated), diagnosticAddedBytes: diagnostic["addedBytes"],
    rawSdkResultBytes: bytes(rawResult), baseCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    implementation: "working-tree", stores: "in-memory", transport: "Official SDK HTTP; frozen page fetched through real adapter and API HTTP",
    integrity: "Removing three diagnostic fields per problem exactly reproduces every original problem; original API response byte budget verified.",
    limitations: "Marker readback measures this synthetic task, not comprehension of scientific content. raw-result is an SDK result before host-specific truncation, not evidence of model visibility." };
  write("probe.json", metadata);
  process.stdout.write(JSON.stringify(metadata) + "\n");
} catch (error) {
  await close();
  throw error;
}
