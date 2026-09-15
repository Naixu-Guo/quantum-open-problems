/** Adversarial HTTP overlap and durable receipt recovery, isolated from the real ledger. */
import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { Duplex } from "node:stream";
import { fileURLToPath } from "node:url";
import { createServer } from "../src/api.ts";
import { createService } from "../src/service.ts";
import type { Config } from "../src/config.ts";
import type { Service } from "../src/write.ts";

const contractDir = fileURLToPath(new URL("../../contract", import.meta.url));
const route = "/api/v1/trajectories";
type Body = Record<string, unknown>;
interface Reply { status: number; headers: Record<string, string>; body: Body }
interface Request { token: string; key: string; body: Body }
const requestHash = (body: Body) => createHash("sha256").update(route).update(JSON.stringify(body)).digest("hex");

async function fixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-idempotency-"));
  for (const dir of ["ledger", "activity"]) fs.cpSync(path.join(contractDir, "fixtures", dir), path.join(root, dir), { recursive: true });
  for (const args of [["init", "-q", "-b", "main"], ["add", "-A"], ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Seed idempotency fixture"]]) {
    execFileSync("git", args, { cwd: root, stdio: "pipe" });
  }
  const config: Config = { ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir, dbPath: ":memory:", authDbPath: path.join(root, "state", "auth.sqlite"), port: 0, commit: false, git: { remote: null, pollIntervalMs: 0 } };
  let service: Service;
  let server: http.Server;
  let base: string;
  let running = false;
  const stop = async () => {
    if (!running) return;
    running = false;
    server.closeAllConnections();
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    service.index.close(); service.auth.close(); service.submissions.close();
  };
  const start = async () => {
    service = createService(config);
    server = createServer(service);
    await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
    running = true;
    const address = server.address();
    assert.ok(address && typeof address === "object");
    base = `http://127.0.0.1:${address.port}`;
  };
  t.after(async () => { await stop(); fs.rmSync(root, { recursive: true, force: true }); });
  await start();
  const actor = (name: string) => service.repo.current().currentOf("Actor").find(record => record.fields["name"] === name)!.id;
  const actorA = actor("Example research agent");
  const actorB = actor("Example operator B");
  const tokenA = service!.auth.issueKey(actorA, "idempotency fixture A");
  const tokenB = service!.auth.issueKey(actorB, "idempotency fixture B");
  const body: Body = { kind: "maintenance", problemIds: [], statementDigests: [], harnessConfig: "idempotency fixture", budget: "small", visibility: "public" };
  return {
    get service() { return service; }, get server() { return server; }, get base() { return base; }, actorA, actorB, tokenA, tokenB, body,
    restart: async () => { await stop(); await start(); },
    rows: () => service.auth.db.prepare("SELECT id, actor_id, fields FROM open_trajectories ORDER BY id").all() as { id: string; actor_id: string; fields: string }[],
    post: async (request: Request): Promise<Reply> => {
      const response = await fetch(`${base}${route}`, { method: "POST", headers: { Authorization: `Bearer ${request.token}`, "Idempotency-Key": request.key, "Content-Type": "application/json" }, body: JSON.stringify(request.body) });
      return { status: response.status, headers: Object.fromEntries(response.headers), body: await response.json() as Body };
    },
  };
}

function requestBytes(base: string, requests: Request[]): Buffer {
  const endpoint = new URL(base);
  return Buffer.concat(requests.map((request, index) => {
    const body = Buffer.from(JSON.stringify(request.body));
    const head = `POST ${route} HTTP/1.1\r\nHost: ${endpoint.host}\r\nAuthorization: Bearer ${request.token}\r\nIdempotency-Key: ${request.key}\r\nContent-Type: application/json\r\nContent-Length: ${body.length}\r\nConnection: ${index === requests.length - 1 ? "close" : "keep-alive"}\r\n\r\n`;
    return Buffer.concat([Buffer.from(head), body]);
  }));
}

/** Send complete requests in one TCP write; no client library serializes their responses. */
async function pipeline(base: string, requests: Request[]): Promise<Reply[]> {
  const endpoint = new URL(base);
  const bytes = requestBytes(base, requests);
  const response = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const socket = net.createConnection({ host: endpoint.hostname, port: Number(endpoint.port) });
    socket.setTimeout(5000, () => socket.destroy(new Error("Pipelined response timed out")));
    socket.once("error", reject);
    socket.once("connect", () => socket.write(bytes));
    socket.on("data", chunk => chunks.push(Buffer.from(chunk)));
    socket.once("end", () => { socket.destroy(); resolve(Buffer.concat(chunks)); });
  });
  return parseReplies(response, requests.length);
}

function parseReplies(response: Buffer, expected: number): Reply[] {
  const replies: Reply[] = [];
  let offset = 0;
  while (offset < response.length) {
    const headerEnd = response.indexOf("\r\n\r\n", offset);
    assert.ok(headerEnd >= 0, "complete HTTP response headers");
    const lines = response.subarray(offset, headerEnd).toString("utf8").split("\r\n");
    const status = Number(lines.shift()!.split(" ")[1]);
    const headers = Object.fromEntries(lines.map(line => { const separator = line.indexOf(":"); return [line.slice(0, separator).toLowerCase(), line.slice(separator + 1).trim()]; }));
    const length = Number(headers["content-length"]);
    assert.ok(Number.isSafeInteger(length) && length >= 0, "service responses carry a Content-Length");
    offset = headerEnd + 4;
    assert.ok(offset + length <= response.length, "complete HTTP response body");
    replies.push({ status, headers, body: JSON.parse(response.subarray(offset, offset + length).toString("utf8")) as Body });
    offset += length;
  }
  assert.equal(replies.length, expected, "every pipelined request receives a response");
  return replies;
}

/** A real Node HTTP parser with deterministic delivery before its queued microtasks run. */
async function parserPipeline(server: http.Server, base: string, requests: Request[]): Promise<Reply[]> {
  class Socket extends Duplex {
    readonly output: Buffer[] = [];
    readonly remoteAddress = "127.0.0.1";
    _read() {}
    _write(chunk: Buffer, _encoding: BufferEncoding, callback: (error?: Error | null) => void) { this.output.push(Buffer.from(chunk)); callback(); }
    setTimeout() { return this; }
    setNoDelay() { return this; }
    setKeepAlive() { return this; }
  }
  const socket = new Socket();
  try {
    await new Promise<void>((resolve, reject) => {
      const deadline = setTimeout(() => reject(new Error("In-memory HTTP parser response timed out")), 5000);
      socket.once("finish", () => { clearTimeout(deadline); resolve(); });
      socket.once("error", error => { clearTimeout(deadline); reject(error); });
      server.emit("connection", socket);
      socket.push(requestBytes(base, requests));
    });
    return parseReplies(Buffer.concat(socket.output), requests.length);
  } finally { socket.destroy(); }
}

function unknown(reply: Reply) {
  assert.equal(reply.status, 409, JSON.stringify(reply.body));
  assert.equal(reply.body["code"], "IDEMPOTENCY_OUTCOME_UNKNOWN");
  assert.equal(reply.body["retryable"], false);
  assert.equal(reply.body["outcomeUnknown"], true);
  assert.notEqual(reply.headers["idempotent-replay"], "true");
}

test("raw HTTP pipelining replays identical actor/key/payload writes without a second trajectory", async t => {
  const app = await fixture(t);
  const request = { token: app.tokenA, key: "same-concurrent-write", body: app.body };
  const [first, second] = await pipeline(app.base, [request, request]);
  assert.equal(first!.status, 201, JSON.stringify(first!.body));
  assert.equal(second!.status, 201, JSON.stringify(second!.body));
  assert.deepEqual(second!.body, first!.body);
  assert.equal(second!.headers["idempotent-replay"], "true");
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0]!.id, first!.body["trajectoryId"]);
  assert.equal((await app.post(request)).body["trajectoryId"], first!.body["trajectoryId"]);
  assert.equal(app.rows().length, 1);
});

test("overlapping real HTTP parser requests wait for the same live reservation", async t => {
  const app = await fixture(t);
  const reserve = app.service.auth.reserve.bind(app.service.auth);
  let sawLivePending = false;
  t.mock.method(app.service.auth, "reserve", (...args: Parameters<typeof reserve>) => {
    const result = reserve(...args);
    sawLivePending ||= result === "pending";
    return result;
  });
  const request = { token: app.tokenA, key: "deterministic-overlap", body: app.body };
  const [first, second] = await parserPipeline(app.server, app.base, [request, request]);
  assert.equal(first!.status, 201, JSON.stringify(first!.body));
  assert.equal(second!.status, 201, JSON.stringify(second!.body));
  assert.deepEqual(second!.body, first!.body);
  assert.equal(sawLivePending, true, "the pipeline must overlap a live reservation rather than only replay a completed response");
  assert.equal(second!.headers["idempotent-replay"], "true");
  assert.equal(app.rows().length, 1);
  assert.equal(app.rows()[0]!.id, first!.body["trajectoryId"]);
});

test("concurrent reuse of one actor/key with a different payload conflicts before a second write", async t => {
  const app = await fixture(t);
  const first = { token: app.tokenA, key: "conflicting-concurrent-write", body: app.body };
  const second = { ...first, body: { ...app.body, budget: "different budget" } };
  const replies = await pipeline(app.base, [first, second]);
  assert.equal(replies[0]!.status, 201, JSON.stringify(replies));
  assert.equal(replies[1]!.status, 422, JSON.stringify(replies));
  assert.match(String(replies[1]!.body["error"]), /different request/u);
  assert.equal(app.rows().length, 1);
  assert.equal(JSON.parse(app.rows()[0]!.fields).budget, "small");
});

test("one key is isolated between authenticated actors even in the same HTTP pipeline", async t => {
  const app = await fixture(t);
  const replies = await pipeline(app.base, [
    { token: app.tokenA, key: "shared-actor-local-key", body: app.body },
    { token: app.tokenB, key: "shared-actor-local-key", body: app.body },
  ]);
  assert.deepEqual(replies.map(reply => reply.status), [201, 201]);
  assert.notEqual(replies[0]!.body["trajectoryId"], replies[1]!.body["trajectoryId"]);
  assert.deepEqual(app.rows().map(row => row.actor_id).sort(), [app.actorA, app.actorB].sort());
});

test("receipt persistence failure after a successful write stays pending across retry and full service restart", async t => {
  const app = await fixture(t);
  const request = { token: app.tokenA, key: "response-persistence-failure", body: app.body };
  let remembers = 0;
  t.mock.method(app.service.auth, "remember", () => {
    remembers++;
    assert.equal(app.rows().length, 1, "fault occurs after the business row is durable");
    throw new Error("Injected receipt persistence failure");
  });
  unknown(await app.post(request));
  const originalId = app.rows()[0]!.id;
  assert.equal(app.service.auth.replay(app.actorA, request.key, requestHash(request.body)), "pending");
  unknown(await app.post(request));
  assert.equal(remembers, 1, "a pending retry does not execute or complete the business operation again");
  assert.deepEqual(app.rows().map(row => row.id), [originalId]);
  await app.restart();
  unknown(await app.post(request));
  assert.deepEqual(app.rows().map(row => row.id), [originalId]);
  assert.equal(app.service.auth.replay(app.actorA, request.key, requestHash(request.body)), "pending");
});

test("a durable reservation with no business write also fails closed after restarting the service", async t => {
  const app = await fixture(t);
  const request = { token: app.tokenA, key: "crash-before-business-write", body: app.body };
  assert.equal(app.service.auth.reserve(app.actorA, request.key, requestHash(request.body)), "reserved");
  assert.equal(app.rows().length, 0);
  await app.restart();
  unknown(await app.post(request));
  assert.equal(app.rows().length, 0);
  const conflict = await app.post({ ...request, body: { ...app.body, budget: "different budget" } });
  assert.equal(conflict.status, 422);
  assert.equal(app.rows().length, 0);
});

test("completed receipts stored by the legacy schema still replay after restarting", async t => {
  const app = await fixture(t);
  const request = { token: app.tokenA, key: "legacy-completed-response", body: app.body };
  const old = { trajectoryId: "01MZZZZZZZZZZZZZZZZZZZZZZZ", startedAt: "2026-09-02T15:00:00.000Z" };
  app.service.auth.openTrajectory({ id: old.trajectoryId, actorId: app.actorA, fields: app.body, startedAt: old.startedAt });
  // Legacy services inserted a completed receipt directly, without a status-0 reservation.
  app.service.auth.db.prepare("INSERT INTO idempotency (actor_id, key, request_hash, status, body, created_at) VALUES (?, ?, ?, ?, ?, ?)")
    .run(app.actorA, request.key, requestHash(request.body), 201, JSON.stringify(old), old.startedAt);
  await app.restart();
  const replay = await app.post(request);
  assert.equal(replay.status, 201);
  assert.equal(replay.headers["idempotent-replay"], "true");
  assert.deepEqual(replay.body, old);
  assert.deepEqual(app.rows().map(row => row.id), [old.trajectoryId]);
});
