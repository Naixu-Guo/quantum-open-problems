import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";
import { parseSubmission, SubmissionStore } from "../src/submissions.ts";
import { HttpError } from "../src/errors.ts";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { hashKey } from "../src/auth.ts";
import { configFromEnv, submissionsDefaults } from "../src/config.ts";

const proposal = (title = "Synthetic capacity test proposal") => ({ title, statement: "A synthetic statement long enough for testing only.", fields: ["Quantum Communication"], topics: ["Private capacity"], contributor: { name: "Test", email: "capacity@example.invalid" }, consent: true });
const payload = (title?: string) => parseSubmission(proposal(title), false).payload;
const meta = { address: "192.0.2.1", userAgent: "test", captchaProvider: "basic" };
const at = Date.now();
const refused = (status: number) => (error: unknown) => error instanceof HttpError && error.status === status;

test("capacity configuration is finite and fails closed on invalid limits", () => {
  const defaults = submissionsDefaults(configFromEnv({}));
  assert.equal(defaults.globalPerHour, 100); assert.equal(defaults.maxRows, 10_000); assert.equal(defaults.maxBytes, 268435456);
  const custom = submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_GLOBAL_PER_HOUR: "50", QOP_SUBMISSIONS_MAX_ROWS: "200", QOP_SUBMISSIONS_MAX_BYTES: "1048576" }));
  assert.equal(custom.globalPerHour, 50); assert.equal(custom.maxRows, 200); assert.equal(custom.maxBytes, 1048576);
  for (const setting of ["QOP_SUBMISSIONS_GLOBAL_PER_HOUR", "QOP_SUBMISSIONS_MAX_ROWS", "QOP_SUBMISSIONS_MAX_BYTES"]) {
    for (const value of ["0", "-1", "NaN", "Infinity", "1.5", "9007199254740992", ""]) assert.throws(() => submissionsDefaults(configFromEnv({ [setting]: value })), /inbox/);
  }
  assert.throws(() => submissionsDefaults(configFromEnv({ QOP_INBOX_MONITOR_KEY_HASH: "bad" })), /MONITOR_KEY_HASH/);
  assert.throws(() => submissionsDefaults(configFromEnv({ QOP_INBOX_MONITOR_KEY_HASH: hashKey("same"), QOP_INBOX_KEY_HASH: hashKey("same") })), /must differ/);
});

test("hourly attempts and threshold alerts survive restart and retain a recovered incident", t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-capacity-window-"));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const file = path.join(tmp, "inbox.sqlite");
  let store = new SubmissionStore(file, { globalPerHour: 10 });
  for (let i = 0; i < 8; i++) store.capacity.takeAttempt(at);
  assert.equal(store.capacity.usage(at).state, "warning");
  const warning = store.capacity.usage(at).lastAlert!;
  store.close(); store = new SubmissionStore(file, { globalPerHour: 10 });
  try {
    assert.equal(store.capacity.usage(at).hour.used, 8);
    assert.equal(store.capacity.usage(at).lastAlert!.id, warning.id);
    store.capacity.takeAttempt(at); assert.equal(store.capacity.usage(at).lastAlert!.id, warning.id, "no repeated warning");
    store.capacity.takeAttempt(at);
    const full = store.capacity.usage(at).lastAlert!;
    assert.equal(full.level, "full"); assert.notEqual(full.id, warning.id);
    for (let i = 0; i < 20; i++) assert.throws(() => store.capacity.takeAttempt(at), refused(429));
    assert.equal(store.capacity.usage(at).hour.used, 10, "rejections cannot grow the counter indefinitely");
    assert.equal(store.capacity.usage(at).lastAlert!.id, full.id);
    const later = at + 3600000;
    assert.equal(store.capacity.usage(later).state, "ok");
    assert.equal(store.capacity.usage(later).lastAlert!.id, full.id, "a scheduled notifier still sees the incident after recovery");
    store.capacity.takeAttempt(later); assert.equal(store.capacity.usage(later).hour.used, 1);
    assert.equal(store.db.prepare("SELECT COUNT(*) AS n FROM inbox_budget").get()!.n, 1);
  } finally { store.close(); }
});

test("row cap is transactional, retains duplicate receipts and leaves review access available", () => {
  const store = new SubmissionStore(":memory:", { maxRows: 5 });
  try {
    for (let i = 0; i < 4; i++) store.accept(payload(`Synthetic capacity proposal ${i}`), meta, at);
    assert.equal(store.capacity.usage(at).state, "warning");
    const last = store.accept(payload("Synthetic last available slot"), meta, at);
    assert.equal(store.capacity.usage(at).state, "full");
    assert.throws(() => store.accept(payload("Synthetic overflow proposal"), meta, at), refused(503));
    assert.equal(store.capacity.usage(at).rows.used, 5);
    assert.equal(store.accept(payload("Synthetic last available slot"), meta, at).id, last.id);
    assert.equal(store.setState(last.id, "spam", "Reviewed while the inbox is full.", null)!.state, "spam");
    assert.equal(store.capacity.usage(at).rows.used, 5, "marking spam does not silently delete evidence");
    assert.ok(store.get(last.id));
  } finally { store.close(); }
});

test("UTF-8 payloads cannot exceed the SQLite ceiling; reopening retains the storage refusal", t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-capacity-bytes-"));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const file = path.join(tmp, "inbox.sqlite"), maxBytes = 1024 * 1024;
  let store = new SubmissionStore(file, { maxBytes });
  let count = 0, last = "";
  for (let i = 0; i < 100; i++) {
    try { last = store.accept({ ...payload(`Synthetic Unicode proposal ${i}`), statement: "量".repeat(30_000), comment: "🧪".repeat(10_000) }, meta, at).id; count++; }
    catch (error) { assert.ok(refused(503)(error)); break; }
  }
  assert.ok(count > 0 && count < 100);
  assert.equal(store.capacity.usage(at).rows.used, count);
  assert.equal(store.capacity.usage(at).state, "full");
  assert.ok(store.capacity.usage(at).lastAlert!.resources.includes("storage"));
  assert.equal(store.setState(last, "in-review", "Capacity check done.", null)!.state, "in-review");
  store.close(); store = new SubmissionStore(file, { maxBytes });
  try {
    assert.ok(fs.statSync(file).size <= maxBytes);
    assert.equal(store.capacity.usage(at).state, "full");
    assert.throws(() => store.accept(payload("Even a small new proposal waits"), meta, at), refused(503));
    assert.equal(store.list().length, count);
  } finally { store.close(); }
  const increased = new SubmissionStore(file, { maxBytes: 2 * maxBytes });
  try { assert.equal(increased.capacity.usage(at).state, "ok"); assert.equal(increased.accept(payload("Capacity increased by maintainer"), meta, at).duplicate, false); }
  finally { increased.close(); }
});

test("concurrent writers share the same hourly and row budgets", async t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-capacity-concurrent-"));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  const file = path.join(tmp, "inbox.sqlite");
  const limits = { globalPerHour: 4, maxRows: 3 };
  const initial = new SubmissionStore(file, limits); initial.close();
  const source = `const {parentPort,workerData}=require('node:worker_threads');
    (async()=>{const {SubmissionStore}=await import(workerData.module);const s=new SubmissionStore(workerData.file,workerData.limits);const out=[];
    try{for(let i=0;i<6;i++){try{s.capacity.takeAttempt(workerData.at);s.accept({...workerData.payload,title:'Concurrent '+workerData.index+' '+i},workerData.meta,workerData.at);out.push(201)}catch(e){if(![429,503].includes(e.status))throw e;out.push(e.status)}}}finally{s.close()}parentPort.postMessage(out)})().catch(e=>{throw e});`;
  const results = await Promise.all([0, 1, 2].map(index => new Promise<number[]>((resolve, reject) => {
    const worker = new Worker(source, { eval: true, execArgv: ["--experimental-strip-types", "--no-warnings"], workerData: { module: new URL("../src/submissions.ts", import.meta.url).href, file, limits, at, index, payload: payload(), meta } });
    worker.once("message", resolve); worker.once("error", reject);
  })));
  const checked = new SubmissionStore(file, limits);
  try { assert.equal(results.flat().filter(x => x === 201).length, 3); assert.equal(checked.capacity.usage(at).rows.used, 3); assert.equal(checked.capacity.usage(at).hour.used, 4); }
  finally { checked.close(); }
});

test("HTTP global budget covers distinct addresses and failed attempts; monitor key reads only aggregates", async t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-capacity-http-"));
  const contractDir = path.resolve(import.meta.dirname, "../../contract");
  for (const dir of ["ledger", "activity"]) fs.cpSync(path.join(contractDir, "fixtures", dir), path.join(tmp, dir), { recursive: true });
  const service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false,
    submissions: { mode: "basic", trustProxy: true, perAddressPerHour: 1, globalPerHour: 3, monitorKeyHash: hashKey("test-monitor-key") } });
  const server = createServer(service);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => { await new Promise<void>(resolve => server.close(() => resolve())); service.index.close(); service.auth.close(); service.submissions.close(); fs.rmSync(tmp, { recursive: true, force: true }); });
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const post = (n: number, invalid = false) => fetch(base + "/api/v1/submissions", { method: "POST", headers: { "Content-Type": "application/json", "X-Forwarded-For": `192.0.2.${n}` }, body: JSON.stringify({ ...proposal(`Synthetic distinct address ${n}`), consent: !invalid }) });
  assert.equal((await post(1, true)).status, 422);
  assert.equal((await post(1)).status, 429);
  assert.equal(service.submissions.capacity.usage().hour.used, 1, "a blocked address cannot spend the remaining global budget");
  assert.equal((await post(2)).status, 201); assert.equal((await post(3)).status, 201);
  assert.equal((await post(4)).status, 429); assert.equal((await post(5)).status, 429);
  assert.equal((await fetch(base + "/inbox/capacity")).status, 401);
  const headers = { Authorization: "Bearer test-monitor-key" };
  const monitor = await fetch(base + "/inbox/capacity", { headers });
  assert.equal(monitor.status, 200); assert.equal(monitor.headers.get("cache-control"), "no-store");
  const capacity = await monitor.json() as any;
  assert.equal(capacity.hour.used, 3); assert.equal(capacity.rows.used, 2); assert.equal(capacity.state, "full");
  assert.ok(!JSON.stringify(capacity).includes("capacity@example.invalid"));
  for (const route of ["/api/v1/submissions", "/api/v1/actors/me"]) assert.equal((await fetch(base + route, { headers })).status, 401);
  assert.equal((await fetch(base + "/api/v1/batches", { method: "POST", headers, body: "{}" })).status, 401);
});
