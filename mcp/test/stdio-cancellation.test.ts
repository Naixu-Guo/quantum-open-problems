import test, { type TestContext } from "node:test";
import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import { serveStdio, StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { PROTOCOL_VERSION_META_KEY, CLIENT_CAPABILITIES_META_KEY, type JSONRPCMessage, type JSONRPCNotification, type Transport, type TransportSendOptions } from "@modelcontextprotocol/server";
import { createAdapter } from "../src/adapter.ts";
import { createMcpServer } from "../src/shared-server.ts";
import { StdioRequestIdTransport } from "../src/stdio-transport.ts";

const tick = () => new Promise<void>(resolve => setImmediate(resolve));
async function until(predicate: () => boolean) {
  const deadline = Date.now() + 1000;
  while (!predicate() && Date.now() < deadline) await tick();
  assert.ok(predicate(), "expected stdio event before timeout");
}
async function fixture(t: TestContext, modern: boolean, configure?: (server: ReturnType<typeof createMcpServer>) => void) {
  const input = new PassThrough();
  const output = new PassThrough();
  const messages: any[] = [];
  const errors: string[] = [];
  output.on("data", chunk => { for (const line of String(chunk).trim().split("\n")) if (line) messages.push(JSON.parse(line)); });
  const bridge = new StdioRequestIdTransport(new StdioServerTransport(input, output));
  const handle = serveStdio(() => {
    const server = createMcpServer(createAdapter("http://localhost:8787", null, true));
    configure?.(server);
    return server;
  }, { transport: bridge, maxSubscriptions: 0, onerror: error => errors.push(error.message) });
  t.after(async () => { await handle.close(); input.destroy(); output.destroy(); assert.deepEqual(errors, []); });
  const meta = modern ? { _meta: { [PROTOCOL_VERSION_META_KEY]: "2026-07-28", [CLIENT_CAPABILITIES_META_KEY]: {} } } : {};
  const send = (message: Record<string, unknown>) => { input.write(`${JSON.stringify({ jsonrpc: "2.0", ...message })}\n`); };
  const request = async (id: number | string, method: string, params = {}) => {
    send({ id, method, params: { ...params, ...meta } });
    await until(() => messages.some(message => message.id === id));
    return messages.find(message => message.id === id);
  };
  await tick();
  if (!modern) {
    assert.equal((await request("initialize", "initialize", { protocolVersion: "2025-11-25", capabilities: {}, clientInfo: { name: "stdio-test", version: "1" } })).id, "initialize");
    send({ method: "notifications/initialized" });
  }
  return { handle, bridge, send, request, meta, messages };
}

for (const modern of [false, true]) for (const id of [0, "", 7]) test(`${modern ? "2026" : "legacy"} stdio cancels ID ${JSON.stringify(id)} without affecting another request`, async t => {
  const signals: AbortSignal[] = [];
  t.mock.method(globalThis, "fetch", async (_input: unknown, init?: RequestInit) => {
    signals.push(init!.signal!);
    return new Promise<Response>((_resolve, reject) => init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason), { once: true }));
  });
  const f = await fixture(t, modern);
  const call = (requestId: number | string) => f.send({ id: requestId, method: "tools/call", params: { name: "get_policy", arguments: {}, ...f.meta } });
  call(id);
  call("survivor");
  await until(() => signals.length === 2);
  for (const params of [{}, { requestId: id, reason: 7 }, { requestId: "unknown" }, { requestId: null }]) {
    f.send({ method: "notifications/cancelled", params: { ...params, ...f.meta } });
  }
  assert.equal((await f.request("barrier", "ping")).id, "barrier");
  assert.ok(signals.every(signal => !signal.aborted), "invalid and unknown cancellations do nothing");
  f.send({ method: "notifications/cancelled", params: { requestId: id, ...f.meta } });
  await until(() => signals[0]!.aborted);
  assert.equal(signals[1]!.aborted, false);
  assert.equal((await f.request("after-cancel", "ping")).id, "after-cancel");
  await f.handle.close();
  await until(() => signals[1]!.aborted);
  await assert.rejects(f.bridge.send({ jsonrpc: "2.0", id: "late", result: {} }), /closed/u);
});

for (const modern of [false, true]) test(`${modern ? "2026" : "legacy"} stdio preserves successful response IDs 0 and empty string`, async t => {
  const f = await fixture(t, modern);
  assert.equal((await f.request(0, "ping")).id, 0);
  assert.equal((await f.request("", "ping")).id, "");
});

test("modern stdio subscription rejection preserves request ID 0", async t => {
  const f = await fixture(t, true);
  const result = await f.request(0, "subscriptions/listen", { notifications: {} });
  assert.equal(result.id, 0);
  assert.equal(result.error.code, -32603);
  assert.match(result.error.message, /Subscription limit/u);
});

for (const modern of [false, true]) test(modern ? "2026 stdio retains the SDK rejection of server-originated requests" : "legacy stdio forwards SDK child cancellation after its parent retires", async t => {
  let parentSignal: AbortSignal | undefined;
  const f = await fixture(t, modern, server => {
    server.registerTool("cascade_probe", {}, async context => {
      parentSignal = context.mcpReq.signal;
      await context.mcpReq.send({ method: "ping" });
      await context.mcpReq.send({ method: "ping" }, { signal: context.mcpReq.signal });
      return { content: [] };
    });
  });
  f.send({ id: 7, method: "tools/call", params: { name: "cascade_probe", arguments: {}, ...f.meta } });
  if (modern) {
    await until(() => f.messages.some(message => message.id === 7 && message.result));
    const reply = f.messages.find(message => message.id === 7);
    assert.equal(reply.result.isError, true);
    assert.match(reply.result.content[0].text, /not supported.*2026-07-28/u);
    assert.ok(!f.messages.some(message => message.method === "ping"));
    return;
  }
  await until(() => f.messages.some(message => message.method === "ping" && message.id === 0));
  f.send({ id: 0, result: {} });
  await until(() => f.messages.some(message => message.method === "ping" && message.id === 1));
  f.send({ method: "notifications/cancelled", params: { requestId: 7, reason: "Stop parent", ...f.meta } });
  await until(() => f.messages.some(message => message.method === "notifications/cancelled" && message.params?.requestId === 1));
  assert.equal(parentSignal?.aborted, true);
  assert.equal(f.messages.filter(message => message.method === "notifications/cancelled").length, 1);
  assert.doesNotMatch(JSON.stringify(f.messages), /qop-stdio-/u, "no internal request IDs may leak");
  assert.equal((await f.request("after-cascade", "ping")).id, "after-cascade");
  assert.ok(!f.messages.some(message => message.id === 7 && (message.result || message.error)), "cancelled parent does not produce a late result");
});

test("stdio bridge keeps directional IDs, related notifications and send options intact, and drops retired IDs", async () => {
  const sent: { message: JSONRPCMessage; options?: TransportSendOptions }[] = [];
  const received: JSONRPCMessage[] = [];
  let closeCount = 0;
  const wire: Transport = {
    async start() {},
    async close() { this.onclose?.(); },
    async send(message, options) { sent.push({ message, ...(options ? { options } : {}) }); },
  };
  const bridge = new StdioRequestIdTransport(wire);
  bridge.onmessage = message => { received.push(message); };
  bridge.onclose = () => { closeCount++; };
  await bridge.start();
  wire.onmessage!({ jsonrpc: "2.0", id: 0, method: "ping" });
  const internalId = (received[0] as { id: string }).id;
  assert.equal(typeof internalId, "string");
  assert.ok(internalId);
  await bridge.send({ jsonrpc: "2.0", id: 0, method: "roots/list" }, { relatedRequestId: internalId });
  assert.equal((sent[0]!.message as { id: number }).id, 0, "server-originated requests keep their own IDs");
  assert.equal(sent[0]!.options?.relatedRequestId, 0);
  wire.onmessage!({ jsonrpc: "2.0", id: 0, result: { roots: [] } });
  assert.equal((received[1] as { id: number }).id, 0, "client responses are not mapped as new requests");
  await bridge.send({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: 0 } });
  assert.equal((sent[1]!.message as JSONRPCNotification).params?.requestId, 0);
  await bridge.send({ jsonrpc: "2.0", method: "notifications/associated", params: { requestId: internalId } }, { relatedRequestId: internalId });
  assert.equal((sent[2]!.message as JSONRPCNotification).params?.requestId, 0);
  assert.equal(sent[2]!.options?.relatedRequestId, 0);
  wire.onmessage!({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: internalId } });
  assert.equal(received.length, 2, "a caller cannot cancel by naming an internal ID");
  await bridge.send({ jsonrpc: "2.0", id: internalId, result: {} }, { relatedRequestId: internalId });
  assert.equal((sent[3]!.message as { id: number }).id, 0);
  assert.equal(sent[3]!.options?.relatedRequestId, 0);
  await bridge.send({ jsonrpc: "2.0", id: internalId, result: { late: true } });
  assert.equal(sent.length, 4, "completed IDs are removed and late replies discarded");
  wire.onmessage!({ jsonrpc: "2.0", id: "", method: "ping" });
  const cancelledId = (received[2] as { id: string }).id;
  wire.onmessage!({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: "" } });
  assert.equal((received[3] as JSONRPCNotification).params?.requestId, cancelledId);
  await bridge.send({ jsonrpc: "2.0", id: cancelledId, result: { late: true } });
  await bridge.send({ jsonrpc: "2.0", method: "notifications/associated", params: { requestId: cancelledId } });
  assert.equal(sent.length, 4, "cancelled IDs retain no active mapping");
  await bridge.send({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: 1, reason: "Parent cancelled" } }, { relatedRequestId: cancelledId, resumptionToken: "preserved-option" });
  assert.deepEqual(sent[4], { message: { jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: 1, reason: "Parent cancelled" } }, options: { resumptionToken: "preserved-option" } });
  await bridge.send({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: cancelledId } }, { relatedRequestId: cancelledId });
  await bridge.send({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: 1, reason: 7 } }, { relatedRequestId: cancelledId });
  await bridge.send({ jsonrpc: "2.0", method: "notifications/cancelled", params: {} }, { relatedRequestId: cancelledId });
  await bridge.send({ jsonrpc: "2.0", method: "notifications/associated", params: { requestId: 1 } }, { relatedRequestId: cancelledId });
  await bridge.send({ jsonrpc: "2.0", id: cancelledId, result: { late: true } }, { relatedRequestId: cancelledId });
  assert.equal(sent.length, 5, "only valid server-direction cancellations survive a retired parent");
  await bridge.close();
  await bridge.close();
  assert.equal(closeCount, 1);
  wire.onmessage!({ jsonrpc: "2.0", id: "closed", method: "ping" });
  assert.equal(received.length, 4);
});
