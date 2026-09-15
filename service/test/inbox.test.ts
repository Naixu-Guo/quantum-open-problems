import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { hashKey } from "../src/auth.ts";
import { configFromEnv, submissionsDefaults } from "../src/config.ts";
import { SubmissionStore, type Contributor } from "../src/submissions.ts";

const contractDir = path.resolve(import.meta.dirname, "../../contract");
const key = "test-only-random-inbox-key-not-a-production-credential";
const proposal = {
  title: "A synthetic inbox test proposal", statement: "A sufficiently long test statement. <script>alert('untrusted')</script>",
  fields: ["Quantum Communication"], topics: ["Test topic"], contributor: { name: "Example", email: "contact@example.invalid", anonymous: true }, consent: true, extra: "",
};

test("submission modes require explicit opt-in; a missing verifier never opens the inbox", () => {
  assert.equal(submissionsDefaults(configFromEnv({})).mode, "disabled");
  assert.equal(submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_MODE: "basic" })).mode, "basic");
  assert.equal(submissionsDefaults(configFromEnv({ QOP_CAPTCHA_SECRET: "test" })).mode, "captcha");
  assert.throws(() => submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_MODE: "captcha" })), /requires QOP_CAPTCHA_SECRET/);
  assert.throws(() => submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_MODE: "typo" })), /QOP_SUBMISSIONS_MODE/);
  assert.throws(() => submissionsDefaults(configFromEnv({ QOP_INBOX_KEY_HASH: "weak-password" })), /QOP_INBOX_KEY_HASH/);
});

test("project inbox accepts basic-protected proposals, scopes login, enforces CSRF, paginates, and revokes sessions", async t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-project-inbox-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(tmp, "activity"), { recursive: true });
  const service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir,
    dbPath: ":memory:", authDbPath: path.join(tmp, "auth.sqlite"), port: 0, commit: false,
    web: { publicUrl: "https://api.example.test", webDir: null },
    submissions: { mode: "basic", inboxKeyHash: hashKey(key), allowedOrigins: ["https://site.example.test"], perAddressPerHour: 10 },
  });
  const server = createServer(service);
  t.after(async () => { await new Promise<void>(resolve => server.close(() => resolve())); service.index.close(); service.auth.close(); service.submissions.close(); fs.rmSync(tmp, { recursive: true, force: true }); });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  const origin = service.web.publicUrl;
  async function call(route: string, body?: unknown, headers: Record<string, string> = {}) {
    const response = await fetch(base + route, { headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers }, ...(body === undefined ? {} : { method: "POST", body: JSON.stringify(body) }) });
    const text = await response.text();
    let json: any; try { json = JSON.parse(text); } catch { json = text; }
    return { status: response.status, headers: response.headers, body: json };
  }
  const before = service.repo.current().records.length;
  const accepted = await call("/api/v1/submissions", proposal, { Origin: "https://site.example.test" });
  assert.equal(accepted.status, 201);
  assert.equal(accepted.headers.get("access-control-allow-origin"), "https://site.example.test");
  const id = accepted.body.id;
  assert.equal((await call("/api/v1/submissions", proposal)).body.id, id, "retry does not duplicate a proposal");
  assert.equal((await call("/api/v1/submissions", { ...proposal, extra: "spam" })).status, 400);
  assert.equal((await call("/api/v1/submissions", { ...proposal, consent: false })).status, 422);
  assert.equal((await call("/api/v1/submissions", proposal, { Origin: "https://foreign.test" })).status, 403);
  for (const route of ["/api/v1/submissions", `/api/v1/submissions/${id}`]) assert.equal((await call(route)).status, 401);
  assert.equal((await call("/inbox/login", { key })).status, 403, "login requires same-origin POST");
  assert.equal((await call("/inbox/login", { key: "incorrect" }, { Origin: origin })).status, 401);
  const login = await call("/inbox/login", { key }, { Origin: origin });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get("set-cookie")!;
  assert.match(setCookie, /HttpOnly/); assert.match(setCookie, /SameSite=Strict/); assert.match(setCookie, /Secure/);
  const cookie = setCookie.split(";")[0]!;
  const sessionToken = cookie.split("=")[1]!;
  const privateHeaders = { Cookie: cookie, Origin: origin };
  assert.equal((await call("/inbox/session", undefined, privateHeaders)).body.authenticated, true);
  assert.equal((await call("/api/v1/submissions", undefined, privateHeaders)).body.total, 1);
  assert.equal((await call("/api/v1/submissions", undefined, privateHeaders)).body.submissions[0].contributor.anonymous, true);
  assert.equal((await call(`/api/v1/submissions/${id}`, undefined, privateHeaders)).body.contributor.email, proposal.contributor.email);
  const detail = (await call(`/api/v1/submissions/${id}`, undefined, privateHeaders)).body;
  assert.equal(detail.contributor.anonymous, true);
  assert.equal(detail.payload.contributor.anonymous, true);
  assert.match(detail.text, /Public attribution: Anonymous requested; do not publish/);
  assert.match((await call("/api/v1/submissions", undefined, privateHeaders)).headers.get("cache-control")!, /no-store/);
  assert.equal((await call("/api/v1/actors/me", undefined, privateHeaders)).status, 401, "inbox login is not a ledger actor");
  assert.equal((await call("/api/v1/batches", {}, privateHeaders)).status, 401, "inbox login cannot write catalog records");
  assert.equal((await call(`/api/v1/submissions/${id}/state`, { state: "accepted" }, { Cookie: cookie, Origin: "https://foreign.test" })).status, 403);
  const saved = await call(`/api/v1/submissions/${id}/state`, { state: "in-review", note: "Needs sources." }, privateHeaders);
  assert.equal(saved.body.state, "in-review"); assert.equal(saved.body.stateBy, null);
  assert.equal(saved.body.stateNote, "Needs sources.");
  for (let i = 0; i < 3; i++) await call("/api/v1/submissions", { ...proposal, title: `Another synthetic proposal ${i}` });
  const page = await call("/api/v1/submissions?limit=2", undefined, privateHeaders);
  assert.equal(page.body.total, 4); assert.equal(page.body.count, 2); assert.equal(page.body.nextOffset, 2);
  const next = await call("/api/v1/submissions?limit=2&offset=2", undefined, privateHeaders);
  assert.equal(next.body.nextOffset, null); assert.equal(new Set([...page.body.submissions, ...next.body.submissions].map(p => p.id)).size, 4);
  assert.equal((await call("/api/v1/submissions?state=in-review", undefined, privateHeaders)).body.total, 1);
  assert.equal(service.repo.current().records.length, before, "submission and review never change the ledger");
  const html = await call("/inbox/");
  assert.equal(html.status, 200); assert.match(html.headers.get("content-security-policy")!, /frame-ancestors 'none'/);
  assert.ok(!html.body.includes(proposal.contributor.email), "static shell contains no submission data");
  assert.equal((await call("/inbox/unknown.txt")).status, 404);
  assert.equal(service.auth.actorForToken(sessionToken), null);
  assert.equal(service.auth.actorForSession(sessionToken), null);
  assert.equal(service.auth.validInboxSession(sessionToken, hashKey(key), Date.now() + 13 * 60 * 60 * 1000), false, "expires in twelve hours");
  assert.equal((await call("/inbox/logout", {}, { Cookie: cookie })).status, 403);
  assert.equal((await call("/inbox/logout", {}, privateHeaders)).status, 200);
  assert.equal((await call("/api/v1/submissions", undefined, privateHeaders)).status, 401);
  const second = await call("/inbox/login", { key }, { Origin: origin });
  service.submissionsConfig.inboxKeyHash = hashKey("rotated-key");
  assert.equal((await call("/api/v1/submissions", undefined, { Cookie: second.headers.get("set-cookie")!.split(";")[0]! })).status, 401, "key rotation invalidates all previous sessions");
  service.submissionsConfig.perAddressPerHour = 1;
  assert.equal((await call("/api/v1/submissions", proposal)).status, 429);
  for (let i = 0; i < 10; i++) await call("/inbox/login", { key: "wrong" }, { Origin: origin });
  assert.equal((await call("/inbox/login", { key: "wrong" }, { Origin: origin })).status, 429);
});

test("form contact details survive HTTP filing, private review, corrected resubmissions, and reopening the inbox", async t => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-inbox-contacts-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(tmp, "activity"), { recursive: true });
  const database = path.join(tmp, "submissions.sqlite");
  const origin = "https://api.example.test";
  const siteOrigin = "https://site.example.test";
  const service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir,
    dbPath: ":memory:", authDbPath: path.join(tmp, "auth.sqlite"), port: 0, commit: false,
    web: { publicUrl: origin, webDir: null },
    submissions: { dbPath: database, mode: "basic", inboxKeyHash: hashKey(key), allowedOrigins: [siteOrigin], perAddressPerHour: 40 },
  });
  const server = createServer(service);
  t.after(async () => {
    await new Promise<void>(resolve => server.close(() => resolve()));
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  async function call(route: string, body?: unknown, headers: Record<string, string> = {}) {
    const response = await fetch(base + route, {
      headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
      ...(body === undefined ? {} : { method: "POST", body: JSON.stringify(body) }),
    });
    return { status: response.status, headers: response.headers, body: await response.json() as any };
  }
  const login = await call("/inbox/login", { key }, { Origin: origin });
  assert.equal(login.status, 200);
  const privateHeaders = { Cookie: login.headers.get("set-cookie")!.split(";")[0]!, Origin: origin };
  const expected = new Map<string, Contributor>();

  async function file(contributor: Omit<Contributor, "affiliation"> & { affiliation?: string }, stored: Contributor) {
    const payload = { ...proposal, contributor };
    const first = await call("/api/v1/submissions", payload, { Origin: siteOrigin });
    assert.equal(first.status, 201, JSON.stringify(first.body));
    assert.equal(first.body.accepted, true);
    assert.equal(first.body.duplicate, false);
    assert.deepEqual(Object.keys(first.body).sort(), ["accepted", "duplicate", "id", "receivedAt"], "public receipts expose no contact details");
    assert.equal(expected.has(first.body.id), false, "corrected contacts receive a new receipt");
    expected.set(first.body.id, stored);
    const retry = await call("/api/v1/submissions", payload, { Origin: siteOrigin });
    assert.equal(retry.status, 200);
    assert.deepEqual(retry.body, { ...first.body, duplicate: true }, "an exact retry reuses its own receipt");
  }

  for (const anonymous of [false, true]) {
    const contributor = { name: "  Zoë   李  ", email: "  zoe+quantum@example.invalid  ", affiliation: "  Institut   Quantique; Université Exemple  ", anonymous };
    const normalized = { name: "Zoë 李", email: "zoe+quantum@example.invalid", affiliation: "Institut Quantique; Université Exemple", anonymous };
    await file(contributor, normalized);
    await file({ ...contributor, name: "Zoë-Marie 李" }, { ...normalized, name: "Zoë-Marie 李" });
    await file({ ...contributor, affiliation: "Université Exemple; Second Institute" }, { ...normalized, affiliation: "Université Exemple; Second Institute" });
  }
  const independent = { name: "Independent Contributor", email: "independent+research@example.invalid", anonymous: false };
  await file({ ...independent, affiliation: "" }, { ...independent, affiliation: "" });
  const omitted = { ...independent, email: "unaffiliated+research@example.invalid", anonymous: true };
  await file(omitted, { ...omitted, affiliation: "" });

  async function verifyPrivateContacts() {
    const list = await call("/api/v1/submissions", undefined, privateHeaders);
    assert.equal(list.status, 200);
    assert.equal(list.headers.get("cache-control"), "no-store");
    assert.equal(list.body.total, expected.size);
    for (const row of list.body.submissions) assert.deepEqual(row.contributor, expected.get(row.id));
    assert.equal((await call("/api/v1/submissions")).status, 401);
    for (const [id, contributor] of expected) {
      const denied = await call(`/api/v1/submissions/${id}`);
      assert.equal(denied.status, 401);
      assert.ok(!JSON.stringify(denied.body).includes(contributor.email));
      const detail = await call(`/api/v1/submissions/${id}`, undefined, privateHeaders);
      assert.equal(detail.status, 200);
      assert.equal(detail.headers.get("cache-control"), "no-store");
      assert.deepEqual(detail.body.contributor, contributor, "original and corrected contacts remain independently reviewable");
      assert.deepEqual(detail.body.payload.contributor, contributor);
      assert.equal(detail.body.payload.title, proposal.title);
      assert.equal(detail.body.payload.statement, proposal.statement);
      assert.ok(detail.body.text.includes(`Contributor: ${contributor.name} <${contributor.email}>${contributor.affiliation ? ` (${contributor.affiliation})` : ""}`));
    }
  }
  await verifyPrivateContacts();
  service.submissions.close();
  service.submissions = new SubmissionStore(database);
  await verifyPrivateContacts();
});
