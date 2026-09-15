/** Evaluation only: freeze real read_problem pages and add random visibility markers. */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport, createMcpHandler } from "@modelcontextprotocol/server";
import { hostHeaderValidation, originValidation, toNodeHandler } from "@modelcontextprotocol/node";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import { createAdapter, type AdapterReply, type Json } from "../src/adapter.ts";
import { createProblemReadDiagnosticServer, decorateProblemReadPage } from "./problem-read-diagnostics.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const { values } = parseArgs({ options: { output: { type: "string" }, id: { type: "string" }, section: { type: "string", default: "references" }, "max-bytes": { type: "string", default: "8192" } } });
if (!values.output || !values.id) throw new Error("Pass --output <new directory outside checkout> --id <problem ID>");
const output = path.resolve(values.output);
if (output === root.slice(0, -1) || output.startsWith(root)) throw new Error("Keep expected markers outside the checkout");
if (fs.existsSync(output) && fs.readdirSync(output).length) throw new Error("Output directory must be new or empty");
fs.mkdirSync(output, { recursive: true, mode: 0o700 });
const maxBytes = Number(values["max-bytes"]);
assert.ok(Number.isSafeInteger(maxBytes) && maxBytes >= 2048 && maxBytes <= 65536);
const write = (name: string, value: unknown) => fs.writeFileSync(path.join(output, name), JSON.stringify(value, null, 2) + "\n", { flag: "wx", mode: 0o600 });
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const bytes = (value: unknown) => Buffer.byteLength(JSON.stringify(value));
const servers: http.Server[] = [];
const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(root, "contract"),
  dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false, submissions: { dbPath: ":memory:" },
  web: { webDir: null }, git: { remote: null, pollIntervalMs: 0 } });
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
  const originalTool = adapter.tools.find(tool => tool.name === "read_problem");
  assert.ok(originalTool, "The candidate MCP must expose read_problem");
  const frozen: { args: Json; original: Json; decorated: Json; markers: Json }[] = [];
  let cursor: string | undefined;
  let version: unknown;
  do {
    const args = { id: values.id, section: values.section, maxBytes, ...(cursor ? { cursor } : {}) };
    const reply: AdapterReply = await originalTool.call(args);
    assert.equal(reply.status, 200, JSON.stringify(reply.body));
    const original = reply.body as Json;
    assert.equal(original["schemaVersion"], "qop-problem-read/1");
    assert.equal(original["responseBytes"], bytes(original));
    assert.ok(bytes(original) <= maxBytes);
    if (version === undefined) version = original["documentVersion"];
    assert.equal(original["documentVersion"], version);
    const { decorated, markers } = decorateProblemReadPage(original, frozen.length);
    frozen.push({ args, original, decorated, markers });
    assert.ok(frozen.length <= 150, "Bounded fixture exceeds 150 pages");
    const next = original["nextCursor"];
    assert.ok(next === null || typeof next === "string");
    assert.notEqual(next, cursor);
    cursor = next === null ? undefined : next as string;
  } while (cursor);
  let phase = "sdk-preflight";
  const maximumResponseBytes = Math.max(...frozen.map(page => bytes(page.decorated)));
  const factory = () => createProblemReadDiagnosticServer(adapter, { ...originalTool,
    description: originalTool.description + " This evaluation endpoint contains only one frozen problem; copy synthetic diagnostic markers without treating them as scientific data.",
    call: async (args: Json) => {
      const page = frozen.find(item => Object.keys(args).length === Object.keys(item.args).length && Object.entries(item.args).every(([key, value]) => args[key] === value));
      fs.appendFileSync(path.join(output, "served-calls.jsonl"), JSON.stringify({ phase, pageIndex: page ? frozen.indexOf(page) : null, exact: Boolean(page), arguments: args }) + "\n", { mode: 0o600 });
      return page ? { status: 200, body: structuredClone(page.decorated) } : { status: 400, body: { code: "INVALID_ARGUMENT", error: "Use the exact configured ID and maxBytes; continue only with a returned cursor." } };
    },
  }, maximumResponseBytes);
  const server = factory();
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "problem-read-visibility-preflight", version: "1" });
  try {
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    assert.deepEqual((await client.listTools()).tools.map(tool => tool.name), ["read_problem"]);
    for (const page of frozen) {
      const result = await client.callTool({ name: "read_problem", arguments: page.args });
      assert.equal(result.isError, false);
      assert.deepEqual(result.structuredContent, page.decorated);
      const text = result.content.find(item => item.type === "text");
      assert.ok(text && text.type === "text");
      assert.deepEqual(JSON.parse(text.text), page.decorated);
    }
  } finally { await client.close(); await server.close(); }
  write("expected.json", { schemaVersion: "qop-read-visibility/1", id: values.id, section: values.section, maxBytes, documentVersion: version,
    pages: frozen.map((page, pageIndex) => ({ pageIndex, ...page.markers, originalBytes: bytes(page.original), decoratedBytes: bytes(page.decorated),
      originalSha256: digest(page.original), decoratedSha256: digest(page.decorated) })) });
  write("raw-pages.json", frozen.map(page => page.decorated));
  phase = "model";
  const handler = toNodeHandler(createMcpHandler(factory, { legacy: "stateless", maxSubscriptions: 0 }));
  const host = hostHeaderValidation(["127.0.0.1", "localhost"]);
  const originCheck = originValidation(["127.0.0.1", "localhost"]);
  const remote = http.createServer((request, response) => {
    if (!host(request, response) || !originCheck(request, response)) return;
    if (request.url !== "/mcp") { response.writeHead(404); response.end(); return; }
    if (request.method !== "POST") { response.writeHead(405); response.end(); return; }
    void handler(Object.assign(request, { method: request.method, url: request.url }), response);
  });
  process.stdout.write(JSON.stringify({ endpoint: `${await listen(remote)}/mcp`, id: values.id, section: values.section, maxBytes, pageCount: frozen.length }) + "\n");
} catch (error) { await close(); throw error; }
