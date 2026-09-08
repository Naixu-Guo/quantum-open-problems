import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import { execFileSync, spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { setTimeout as delay } from "node:timers/promises";
import { exportLedger } from "../scripts/export-ledger.mjs";
import { createService } from "../service/src/service.ts";
import { createServer } from "../service/src/api.ts";
import { syncIntervalMs } from "../service/src/config.ts";

const repo = path.resolve(import.meta.dirname, "..");
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const commit = (root, message) => {
  git(root, "add", "-A");
  git(root, "-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", message);
};
const readRecord = (id) => JSON.parse(fs.readFileSync(path.join(repo, "database/problems_json", `${id}.json`), "utf8"));
const added = readRecord("op_25e23d6e92ebce9d");
// This fixture imports one addition, independently of the surrounding related-problem graph.
added.metadata.relatedProblemIds = [];

async function fixture(t) {
  const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-mcp-")));
  const root = path.join(tmp, "service");
  fs.mkdirSync(path.join(root, "database/problems_json"), { recursive: true });
  for (const file of ["actors.json", "metadata.json", "tags.json"]) fs.copyFileSync(path.join(repo, "database", file), path.join(root, "database", file));
  const baseline = readRecord("op_02bb8f8228649ac3");
  fs.writeFileSync(path.join(root, "database/problems_json", `${baseline.id}.json`), JSON.stringify(baseline));
  await exportLedger({ root });
  git(root, "init", "-q", "-b", "main");
  commit(root, "Seed catalog");
  const services = [], servers = [], children = [];
  t.after(async () => {
    for (const child of children) { child.stdin.end(); child.kill(); }
    await Promise.all(servers.map((server) => new Promise((resolve) => server.close(resolve))));
    for (const service of services) { service.index.close(); service.auth.close(); service.submissions.close(); }
    fs.rmSync(tmp, { recursive: true, force: true });
  });
  async function start(options = {}) {
    const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true, ...options });
    const server = createServer(service);
    services.push(service); servers.push(server);
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    return { service, server, base };
  }
  async function remote() {
    const bare = path.join(tmp, "remote.git"), author = path.join(tmp, "author");
    git(tmp, "init", "--bare", "-q", "-b", "main", bare);
    git(root, "remote", "add", "origin", bare);
    git(root, "push", "-qu", "origin", "main");
    git(tmp, "clone", "-q", bare, author);
    return { bare, author };
  }
  function mcp(base) {
    const child = spawn(process.execPath, ["--experimental-strip-types", "--no-warnings", path.join(repo, "mcp/src/server.ts")], { env: { ...process.env, QOP_SERVICE_URL: base, QOP_API_KEY: "" }, stdio: ["pipe", "pipe", "pipe"] });
    children.push(child);
    let next = 1;
    const pending = new Map();
    createInterface({ input: child.stdout }).on("line", (line) => {
      const message = JSON.parse(line), resolve = pending.get(message.id);
      if (resolve) { pending.delete(message.id); resolve(message); }
    });
    function rpc(method, params = {}) {
      const id = next++;
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`MCP timed out: ${method}`)), 5_000);
        pending.set(id, (reply) => { clearTimeout(timer); resolve(reply); });
        child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
      });
    }
    async function tool(name, args = {}) {
      const reply = await rpc("tools/call", { name, arguments: args });
      assert.ok(reply.result, JSON.stringify(reply));
      return { error: Boolean(reply.result.isError), body: JSON.parse(reply.result.content[0].text) };
    }
    return { rpc, tool };
  }
  return { tmp, root, baseline, start, remote, mcp };
}

async function addProblem(root) {
  fs.writeFileSync(path.join(root, "database/problems_json", `${added.id}.json`), JSON.stringify(added));
  await exportLedger({ root });
  commit(root, "Publish another catalog problem");
}

async function until(check) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (await check()) return;
    await delay(25);
  }
  assert.fail("background catalog update did not arrive");
}

test("MCP sees a committed catalog addition on the next read, even with service commits disabled", async (t) => {
  const { root, start, mcp } = await fixture(t);
  const { service, base } = await start({ commit: false });
  const client = mcp(base);
  await client.rpc("initialize", { protocolVersion: "2024-11-05" });
  const before = (await client.tool("get_status")).body;
  assert.equal((await client.tool("get_problem", { id: added.id })).error, true);
  const oldSequences = service.repo.sequences();
  await addProblem(root);
  const search = await client.tool("search_problems", { text: added.title });
  assert.equal(search.body.count, 1);
  assert.equal(search.body.problems[0].id, added.ulid);
  for (const id of [added.id, added.ulid, added.id.replace("op_", "op-")]) {
    const found = await client.tool("get_problem", { id });
    assert.equal(found.error, false);
    assert.equal(found.body.title, added.title);
  }
  const frontier = await client.tool("get_frontier", { id: added.id });
  assert.match(frontier.body.statement.digest, /^sha256:/u);
  assert.equal((await client.tool("list_references", { id: added.id })).body.references.length, added.references.length);
  assert.match((await client.tool("build_context", { id: added.id })).body.bundleId, /^sha256:/u);
  const resource = await client.rpc("resources/read", { uri: `qop://problems/${added.id}` });
  assert.equal(JSON.parse(resource.result.contents[0].text).title, added.title);
  assert.ok(JSON.stringify((await client.tool("list_events", { after: before.lastSequence })).body).includes(added.ulid));
  for (const [file, sequence] of oldSequences) assert.equal(service.repo.sequences().get(file), sequence);
  assert.equal((await client.tool("get_status")).body.problems.total, before.problems.total + 1);
});

test("the running server imports remote additions in the background without publishing local commits", async (t) => {
  const { root, start, remote, mcp } = await fixture(t);
  const { bare, author } = await remote();
  fs.writeFileSync(path.join(root, "LOCAL.md"), "A local commit must not be published by a reader.\n");
  commit(root, "Keep a local note");
  const { base, service } = await start({ git: { remote: "origin", branch: "main", pollIntervalMs: 25 } });
  const client = mcp(base);
  assert.equal((await client.tool("get_problem", { id: added.id })).error, true);
  const oldSequences = service.repo.sequences();
  await addProblem(author);
  git(author, "push", "-q", "origin", "main");
  const remoteHead = git(bare, "rev-parse", "main");
  await until(async () => !(await client.tool("get_problem", { id: added.id })).error);
  assert.equal((await client.tool("search_problems", { text: added.title })).body.count, 1);
  assert.equal(git(bare, "rev-parse", "main"), remoteHead, "background reads do not push");
  assert.equal(fs.readFileSync(path.join(root, "LOCAL.md"), "utf8"), "A local commit must not be published by a reader.\n");
  for (const [file, sequence] of oldSequences) assert.equal(service.repo.sequences().get(file), sequence);
});

test("invalid external commits return 503 until a repaired commit restores consistent reads", async (t) => {
  const { root, start } = await fixture(t);
  const { service, base } = await start();
  const statement = service.repo.current().currentOf("Statement")[0];
  const original = fs.readFileSync(statement.path);
  fs.appendFileSync(statement.path, "\nUnreviewed historical edit.\n");
  commit(root, "Broken external commit");
  const invalid = await fetch(`${base}/api/v1/status`);
  assert.equal(invalid.status, 503);
  assert.equal(invalid.headers.get("cache-control"), "no-store");
  fs.writeFileSync(statement.path, original);
  commit(root, "Repair historical bytes");
  const repaired = await fetch(`${base}/api/v1/status`);
  assert.equal(repaired.status, 200);
  assert.equal((await repaired.json()).problems.total, 1);
});

test("background ingestion rolls back an invalid remote ledger and keeps the last valid reads", async (t) => {
  const { root, start, remote } = await fixture(t);
  const { author } = await remote();
  const { service, base } = await start({ git: { remote: "origin", branch: "main", pollIntervalMs: 25 } });
  const before = git(root, "rev-parse", "HEAD");
  const count = service.index.lastSequence();
  fs.writeFileSync(path.join(author, "ledger/broken.md"), "This is not a contract record.\n");
  commit(author, "Invalid fixture addition");
  git(author, "push", "-q", "origin", "main");
  await until(() => service.repo.syncState()[0].lastError?.includes("invalid ledger"));
  assert.equal(git(root, "rev-parse", "HEAD"), before);
  assert.equal(service.index.lastSequence(), count);
  const response = await fetch(`${base}/api/v1/status`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).sync[0].inStep, false);
});

test("a stalled background fetch does not block HTTP reads", async (t) => {
  const { root, start } = await fixture(t);
  const sockets = new Set();
  let connected;
  const connection = new Promise((resolve) => { connected = resolve; });
  const stalled = net.createServer((socket) => { sockets.add(socket); socket.on("error", () => {}); connected(); });
  await new Promise((resolve) => stalled.listen(0, "127.0.0.1", resolve));
  t.after(async () => { for (const socket of sockets) socket.destroy(); await new Promise((resolve) => stalled.close(resolve)); });
  git(root, "remote", "add", "origin", `git://127.0.0.1:${stalled.address().port}/unresponsive`);
  const { base } = await start({ git: { remote: "origin", branch: "main", pollIntervalMs: 5_000 } });
  await Promise.race([connection, delay(2_000).then(() => assert.fail("background fetch never started"))]);
  const response = await fetch(`${base}/api/v1/status`, { signal: AbortSignal.timeout(1_000) });
  assert.equal(response.status, 200);
});

test("background polling defaults to five seconds and can be disabled explicitly", () => {
  assert.equal(syncIntervalMs(undefined), 60_000);
  assert.equal(syncIntervalMs("0"), 0);
  assert.equal(syncIntervalMs("1000"), 1_000);
  for (const value of [-1, NaN, "invalid", 0.5, 2 ** 31]) assert.throws(() => syncIntervalMs(value), /QOP_SYNC_INTERVAL_MS/u);
});
