import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AdapterError, createAdapter, type Json } from "../src/adapter.ts";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";

function mockFetch(t: TestContext, mock: typeof fetch) {
  const original = globalThis.fetch;
  globalThis.fetch = mock;
  t.after(() => { globalThis.fetch = original; });
}

test("concurrent invocations keep keys out of payloads and preserve retry metadata", async t => {
  const captured: { key: string | null; body: Json }[] = [];
  mockFetch(t, async (_input, init) => {
    if (init?.method === "GET") return Response.json({ idempotencyVersion: "qop-idempotency/2" });
    await new Promise(resolve => setImmediate(resolve));
    const headers = new Headers(init?.headers);
    captured.push({ key: headers.get("Idempotency-Key"), body: JSON.parse(String(init?.body)) });
    return Response.json({ error: "Busy" }, { status: 429, headers: { "Retry-After": "7", "X-Request-Id": "upstream-id" } });
  });
  const tool = createAdapter("http://localhost:8787", "test-key").tools.find(t => t.name === "start_trajectory")!;
  const replies = await Promise.all(["run-a", "run-b"].map(key => tool.call({ kind: "research", idempotencyKey: key })));
  assert.deepEqual(captured.map(item => item.key).sort(), ["run-a", "run-b"]);
  assert.ok(captured.every(item => !Object.hasOwn(item.body, "idempotencyKey")));
  assert.ok(replies.every(reply => reply.status === 429 && reply.headers?.retryAfter === "7" && reply.headers.requestId === "upstream-id"));
});

test("cancelling one request does not cancel a concurrent request", async t => {
  let release: (() => void) | undefined;
  const received = new Promise<void>(resolve => { release = resolve; });
  mockFetch(t, async (input, init) => {
    if (String(input).endsWith("/status")) {
      release!();
      return await new Promise<Response>((_resolve, reject) => init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason), { once: true }));
    }
    return Response.json({ policyVersion: "v1" });
  });
  const adapter = createAdapter("http://localhost:8787");
  const abort = new AbortController();
  const pending = adapter.tools.find(t => t.name === "get_status")!.call({}, { signal: abort.signal });
  const failure = assert.rejects(pending, (error: unknown) => error instanceof AdapterError && error.code === "CANCELLED" && error.details.outcomeUnknown === false);
  await received;
  abort.abort();
  await failure;
  assert.equal((await adapter.tools.find(t => t.name === "get_policy")!.call({})).status, 200);
});

test("invalid and empty artifact encodings are rejected before the HTTP call", async t => {
  let calls = 0;
  mockFetch(t, async () => { calls++; return Response.json({}); });
  const tool = createAdapter("http://localhost:8787", "key").tools.find(t => t.name === "upload_artifact")!;
  const args = { trajectoryId: "01M1GZV1G0Y151A2VCJHPX93VG", kind: "code", title: "Script", mediaType: "text/plain" };
  for (const body of [{}, { text: "" }, { base64: "" }, { text: "one", base64: "b25l" }, { base64: "not base64!" }, { base64: "Zh==" }]) {
    await assert.rejects(async () => tool.call({ ...args, ...body }), AdapterError);
  }
  assert.equal(calls, 0);
});

test("unkeyed writes report uncertain outcomes without automatic replay", async t => {
  let calls = 0;
  mockFetch(t, async () => { calls++; throw new TypeError("connection reset"); });
  const tool = createAdapter("http://localhost:8787", "key").tools.find(t => t.name === "start_trajectory")!;
  await assert.rejects(tool.call({}), (error: unknown) => error instanceof AdapterError && error.details.outcomeUnknown === true && error.details.retryable === false);
  assert.equal(calls, 1);
});

async function listen(server: http.Server) {
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  return `http://127.0.0.1:${(server.address() as { port: number }).port}`;
}

test("a lost write response can be replayed once, including artifact metadata checks", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-adapter-replay-"));
  const repo = path.resolve(import.meta.dirname, "../..");
  for (const folder of ["ledger", "activity"]) fs.cpSync(path.join(repo, "contract/fixtures", folder), path.join(root, folder), { recursive: true });
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false });
  const api = createServer(service);
  const origin = await listen(api);
  let dropResponse = true;
  let requestCount = 0;
  const proxy = http.createServer(async (request, response) => {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of request) chunks.push(Buffer.from(chunk));
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) if (typeof value === "string" && !["host", "connection", "content-length", "transfer-encoding"].includes(key)) headers.set(key, value);
      const upstream = await fetch(origin + request.url, { method: request.method!, headers, ...(request.method === "POST" ? { body: new Blob([Uint8Array.from(Buffer.concat(chunks))]) } : {}) });
      const text = await upstream.text();
      if (request.method === "POST") {
        requestCount++;
        if (dropResponse) { dropResponse = false; response.destroy(); return; }
      }
      response.writeHead(upstream.status, { "Content-Type": "application/json", ...(upstream.headers.has("idempotent-replay") ? { "Idempotent-Replay": upstream.headers.get("idempotent-replay")! } : {}) });
      response.end(text);
    } catch { response.destroy(); }
  });
  t.after(async () => {
    for (const server of [proxy, api]) { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  const agentId = service.repo.current().currentOf("Actor").find(a => a.fields["name"] === "Example research agent")!.id;
  const adapter = createAdapter(await listen(proxy), service.auth.issueKey(agentId, "replay-test"));
  const start = adapter.tools.find(tool => tool.name === "start_trajectory")!;
  const args = { kind: "maintenance", problemIds: [], statementDigests: [], harnessConfig: "test", budget: "small", visibility: "public", idempotencyKey: "one-logical-run" };
  await assert.rejects(start.call(args), (error: unknown) => error instanceof AdapterError && error.details.outcomeUnknown === true && error.details.retryable === true);
  assert.equal(requestCount, 1, "adapter must not automatically repeat a POST");
  const replay = await start.call(args);
  assert.equal(replay.status, 201);
  assert.equal(replay.headers?.idempotentReplay, true);
  const trajectoryId = (replay.body as { trajectoryId: string }).trajectoryId;
  assert.ok(service.auth.getOpenTrajectory(trajectoryId));
  assert.equal((service.auth.db.prepare("SELECT COUNT(*) AS n FROM open_trajectories").get() as { n: number }).n, 1);
  assert.equal((await start.call({ ...args, budget: "changed" })).status, 422);

  const upload = adapter.tools.find(tool => tool.name === "upload_artifact")!;
  const artifact = { trajectoryId, kind: "code", title: "Proof notes", mediaType: "text/plain", text: "same bytes", idempotencyKey: "one-artifact" };
  const first = await upload.call(artifact);
  const again = await upload.call(artifact);
  assert.equal(first.status, 201);
  assert.deepEqual(again.body, first.body);
  assert.equal(again.headers?.idempotentReplay, true);
  assert.equal((await upload.call({ ...artifact, title: "Different meaning" })).status, 422);
  assert.equal((await upload.call({ ...artifact, kind: "proof-text" })).status, 422);
  assert.equal((await upload.call({ ...artifact, mediaType: "text/markdown" })).status, 422);
});
