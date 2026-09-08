import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { hashKey } from "../src/auth.ts";
import { configFromEnv, submissionsDefaults } from "../src/config.ts";

const contractDir = path.resolve(import.meta.dirname, "../../contract");
const key = "test-only-random-inbox-key-not-a-production-credential";
const proposal = {
  title: "A synthetic inbox test proposal", statement: "A sufficiently long test statement. <script>alert('untrusted')</script>",
  fields: ["Quantum Communication"], topics: ["Test topic"], contributor: { name: "Example", email: "contact@example.invalid" }, consent: true, extra: "",
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
  assert.equal((await call(`/api/v1/submissions/${id}`, undefined, privateHeaders)).body.contributor.email, proposal.contributor.email);
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
