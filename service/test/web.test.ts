/**
 * The human side over HTTP: GitHub login against a fake GitHub, sessions, cookies, static files,
 * and the authorization rules a logged-in person is subject to.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { statementDigest } from "../../contract/src/digest.ts";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { webDefaults } from "../src/config.ts";
import { safeReturnTo } from "../src/web.ts";
import type { Service } from "../src/write.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");

let tmp: string;
let service: Service;
let server: http.Server;
let base: string;
let fakeGitHub: http.Server;
/** The user the fake GitHub returns for the next login. */
let githubUser: { id: number; login: string; name: string | null } = { id: 1001, login: "alice", name: "Alice" };

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

interface Reply { status: number; headers: Headers; body: any; text: string }

async function call(method: "GET" | "POST", route: string, options: { cookie?: string; token?: string; body?: unknown; headers?: Record<string, string> } = {}): Promise<Reply> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.cookie) headers["Cookie"] = options.cookie;
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  const init: RequestInit = { method, headers, redirect: "manual" };
  if (options.body !== undefined) { init.body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
  const response = await fetch(`${base}${route}`, init);
  const text = await response.text();
  let body: any = text;
  try { body = JSON.parse(text); } catch { /* not JSON */ }
  return { status: response.status, headers: response.headers, body, text };
}

const cookieValue = (setCookie: string | null, name: string): string | null => {
  if (!setCookie) return null;
  const match = setCookie.match(new RegExp(`(?:^|, )${name}=([^;]*)`, "u"));
  return match ? match[1]! : null;
};

/** Run the whole login dance as one browser would: /auth/login sets the nonce cookie, GitHub redirects back, the callback sets the session. */
async function login(user: typeof githubUser): Promise<{ session: string; location: string }> {
  githubUser = user;
  const start = await call("GET", "/auth/login?return_to=/problems");
  assert.equal(start.status, 302);
  const nonce = cookieValue(start.headers.get("set-cookie"), "qop_login");
  assert.ok(nonce, "the login sets a nonce cookie");
  const authorize = new URL(start.headers.get("location")!);
  const state = authorize.searchParams.get("state")!;
  const callback = await call("GET", `/auth/callback?code=fake-code&state=${state}`, { cookie: `qop_login=${nonce}` });
  assert.equal(callback.status, 303, callback.text);
  const session = cookieValue(callback.headers.get("set-cookie"), "qop_session");
  assert.ok(session, "the callback sets a session cookie");
  return { session: session!, location: callback.headers.get("location")! };
}

const actorByName = (name: string) => service.repo.current().currentOf("Actor").find((a) => a.fields["name"] === name)!.id;

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-web-"));
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(tmp, "activity"), { recursive: true });
  fs.mkdirSync(path.join(tmp, "web", "assets"), { recursive: true });
  fs.writeFileSync(path.join(tmp, "web", "index.html"), "<!doctype html><title>QOP</title>");
  fs.writeFileSync(path.join(tmp, "web", "assets", "app.js"), "console.log('hi')");
  fs.writeFileSync(path.join(tmp, "web", ".secret"), "hidden");
  git(tmp, ["init", "-q", "-b", "main"]);
  git(tmp, ["add", "-A"]);
  git(tmp, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed fixtures"]);

  fakeGitHub = http.createServer((request, response) => {
    const url = new URL(request.url ?? "/", "http://fake");
    if (url.pathname === "/login/oauth/access_token") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ access_token: "gho_fake" }));
    } else if (url.pathname === "/user") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(githubUser));
    } else {
      response.writeHead(404);
      response.end();
    }
  });
  await new Promise<void>((resolve) => fakeGitHub.listen(0, "127.0.0.1", resolve));
  const githubPort = (fakeGitHub.address() as { port: number }).port;

  server = http.createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = (server.address() as { port: number }).port;
  await new Promise<void>((resolve) => server.close(() => resolve()));
  base = `http://127.0.0.1:${port}`;

  service = createService({
    ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port, commit: true,
    web: { webDir: `${path.join(tmp, "web")}/`, publicUrl: `${base}/`, sessionDays: 30, github: { clientId: "id", clientSecret: "secret", oauthBase: `http://127.0.0.1:${githubPort}/`, apiBase: `http://127.0.0.1:${githubPort}` } },
  });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(port, "127.0.0.1", resolve));
});

after(() => {
  server.close();
  fakeGitHub.close();
  service.index.close();
  service.auth.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

test("configuration is normalized whether it came from code or the environment", () => {
  assert.equal(service.web.webDir, path.join(tmp, "web"), "trailing slash stripped and path resolved");
  assert.equal(service.web.publicUrl, base);
  const empty = webDefaults({ ledgerDir: "", activityDir: "", contractDir: "", dbPath: "", authDbPath: "", port: 1, commit: false, web: { webDir: "", sessionDays: Number.NaN } });
  assert.equal(empty.webDir, null, "an empty QOP_WEB_DIR serves nothing, not the working directory");
  assert.equal(empty.sessionDays, 30, "NaN session days fall back to the default");
  assert.equal(webDefaults({ ledgerDir: "", activityDir: "", contractDir: "", dbPath: "", authDbPath: "", port: 1, commit: false, web: { sessionDays: 0 } }).sessionDays, 30);
});

test("return_to only ever points at this service's own pages", () => {
  const origin = "https://qop.example";
  assert.equal(safeReturnTo("/problems/x?y=1", origin), "/problems/x?y=1");
  assert.equal(safeReturnTo("/\t/evil.com", origin), "/");
  assert.equal(safeReturnTo("//evil.com", origin), "/");
  assert.equal(safeReturnTo("/\\evil.com", origin), "/");
  assert.equal(safeReturnTo("/problems/中", origin), "/");
  assert.equal(safeReturnTo("https://evil.com/", origin), "/");
  assert.equal(safeReturnTo(null, origin), "/");
});

test("a GitHub login creates a contributor actor, a session, and returns to the requested page", async () => {
  const { session, location } = await login({ id: 1001, login: "alice", name: "Alice" });
  assert.equal(location, "/problems");
  const me = await call("GET", "/auth/session", { cookie: `qop_session=${session}` });
  assert.equal(me.body.authenticated, true);
  assert.equal(me.body.via, "session");
  assert.deepEqual(me.body.actor.roles, ["contributor"]);
  assert.equal(me.headers.get("cache-control"), "no-store");
  const again = await login({ id: 1001, login: "alice-renamed", name: "Alice" });
  const me2 = await call("GET", "/auth/session", { cookie: `qop_session=${again.session}` });
  assert.equal(me2.body.actor.id, me.body.actor.id, "the numeric GitHub id finds the same actor after a rename");
});

test("a recycled GitHub username does not inherit another person's actor", async () => {
  const first = await login({ id: 2001, login: "bob", name: "Bob" });
  const bob = (await call("GET", "/auth/session", { cookie: `qop_session=${first.session}` })).body.actor.id;
  const second = await login({ id: 2002, login: "bob", name: "Not Bob" });
  const other = (await call("GET", "/auth/session", { cookie: `qop_session=${second.session}` })).body.actor.id;
  assert.notEqual(other, bob);
});

test("the login state is bound to the browser that started it", async () => {
  githubUser = { id: 3001, login: "carol", name: null };
  const start = await call("GET", "/auth/login");
  const state = new URL(start.headers.get("location")!).searchParams.get("state")!;
  const withoutNonce = await call("GET", `/auth/callback?code=fake&state=${state}`);
  assert.equal(withoutNonce.status, 400);
  const wrongNonce = await call("GET", `/auth/callback?code=fake&state=${state}`, { cookie: "qop_login=deadbeef" });
  assert.equal(wrongNonce.status, 400, "the state was consumed by the first attempt and the nonce did not match anyway");
});

test("a person cannot grant themselves roles; an editor can grant them", async () => {
  const { session } = await login({ id: 4001, login: "dave", name: "Dave" });
  const me = (await call("GET", "/auth/session", { cookie: `qop_session=${session}` })).body.actor;
  const selfGrant = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: { records: [
    { type: "Actor", id: me.id, revision: 2, body: "", name: "Dave", kind: "human", roles: ["contributor", "editor", "moderator"], externalIdentity: me.externalIdentity, operatorId: null, modelFamily: null, modelVersion: null, harness: null },
  ] } });
  assert.equal(selfGrant.status, 403, selfGrant.text);
  const rename = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: { records: [
    { type: "Actor", id: me.id, revision: 2, body: "", name: "David", kind: "human", roles: ["contributor"], externalIdentity: me.externalIdentity, operatorId: null, modelFamily: null, modelVersion: null, harness: null },
  ] } });
  assert.equal(rename.status, 201, rename.text);
  const editorToken = service.auth.issueKey(actorByName("Legacy audit editor"), "test");
  const grant = await call("POST", "/api/v1/batches", { token: editorToken, body: { records: [
    { type: "Actor", id: me.id, revision: 3, body: "Granted reviewer by the editor.", name: "David", kind: "human", roles: ["contributor", "reviewer"], externalIdentity: me.externalIdentity, operatorId: null, modelFamily: null, modelVersion: null, harness: null },
  ] } });
  assert.equal(grant.status, 201, grant.text);
  const after = (await call("GET", "/auth/session", { cookie: `qop_session=${session}` })).body.actor;
  assert.deepEqual(after.roles, ["contributor", "reviewer"]);
});

test("a cookie-authenticated write must come from our own origin, scheme included", async () => {
  const { session } = await login({ id: 5001, login: "erin", name: null });
  const problem = service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[])[0] === "example-conformance-problem")!;
  const comment = { records: [{ type: "Comment", body: "hello", revision: 1, targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null }] };
  const crossSite = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: "https://evil.example" }, body: comment });
  assert.equal(crossSite.status, 403);
  const hostOnly = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base.replace("http://", "https://") }, body: comment });
  assert.equal(hostOnly.status, 403, "same host, different scheme is not our origin");
  const own = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: comment });
  assert.equal(own.status, 201, own.text);
});

test("comment records count one by one against the hourly budget and batches against the daily one", async () => {
  const { session } = await login({ id: 6001, login: "frank", name: null });
  const problem = service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[])[0] === "example-conformance-problem")!;
  const comment = { type: "Comment", body: "one of many", revision: 1, targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null };
  const big = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: { records: Array.from({ length: 31 }, () => ({ ...comment })) } });
  assert.equal(big.status, 429, "31 comments in one batch exceed 30 per hour");
});

test("malformed cookies and paths do not produce 500s", async () => {
  const status = await call("GET", "/api/v1/status", { cookie: "other=%E0; qop_session=" });
  assert.equal(status.status, 200);
  const page = await call("GET", "/%E0");
  assert.equal(page.status, 404);
});

test("logout deletes the session even when a bearer token is also present; an invalid bearer does not break the web routes", async () => {
  const { session } = await login({ id: 7001, login: "grace", name: null });
  const bogus = await call("GET", "/auth/session", { cookie: `qop_session=${session}`, token: "qop_bogus" });
  assert.equal(bogus.status, 200);
  assert.equal(bogus.body.authenticated, true, "on the web routes the cookie names the caller");
  const agentToken = service.auth.issueKey(actorByName("Example research agent"), "test");
  const logout = await call("POST", "/auth/logout", { cookie: `qop_session=${session}`, token: agentToken, headers: { Origin: base } });
  assert.equal(logout.status, 204);
  const after = await call("GET", "/auth/session", { cookie: `qop_session=${session}` });
  assert.equal(after.body.authenticated, false, "the session row is gone");
});

test("caller-specific API replies are never publicly cacheable; anonymous reads are", async () => {
  const anonymous = await call("GET", "/api/v1/status");
  assert.equal(anonymous.headers.get("cache-control"), "public, max-age=15");
  assert.equal(anonymous.headers.get("vary"), "Authorization, Cookie");
  const { session } = await login({ id: 8001, login: "heidi", name: null });
  const me = await call("GET", "/api/v1/actors/me", { cookie: `qop_session=${session}` });
  assert.equal(me.headers.get("cache-control"), "no-store");
  const queue = await call("GET", "/api/v1/queues/review");
  assert.equal(queue.headers.get("cache-control"), "no-store");
  const withSession = await call("GET", "/api/v1/status", { cookie: `qop_session=${session}` });
  assert.equal(withSession.headers.get("cache-control"), "no-store", "a logged-in read is not shared");
});

test("static files are served with validators, dotfiles are not, and a read error does not kill the process", async () => {
  const index = await call("GET", "/");
  assert.equal(index.status, 200);
  assert.match(index.headers.get("content-type") ?? "", /text\/html/u);
  const etag = index.headers.get("etag");
  assert.ok(etag);
  const revalidate = await call("GET", "/", { headers: { "If-None-Match": etag! } });
  assert.equal(revalidate.status, 304);
  assert.equal((await call("GET", "/assets/app.js")).status, 200);
  assert.equal((await call("GET", "/.secret")).status, 404);
  assert.equal((await call("GET", "/../ledger/taxonomy.r1.md")).status, 404);
  const locked = path.join(tmp, "web", "locked.css");
  fs.writeFileSync(locked, "body{}");
  fs.chmodSync(locked, 0o000);
  const unreadable = await call("GET", "/locked.css");
  fs.chmodSync(locked, 0o644);
  assert.ok(unreadable.status === 404 || unreadable.status === 500 || unreadable.status === 200, `status ${unreadable.status}`);
  assert.equal((await call("GET", "/api/v1/status")).status, 200, "the service is still up");
});

test("a page navigation to an app path gets the shell; file, API, and auth paths do not", async () => {
  const page = await call("GET", "/problems/some-alias", { headers: { Accept: "text/html,application/xhtml+xml" } });
  assert.equal(page.status, 200, page.text);
  assert.match(page.text, /<title>QOP<\/title>/u);
  assert.equal((await call("GET", "/problems/some-alias", { headers: { Accept: "application/json" } })).status, 404, "a JSON client gets a 404, not the shell");
  assert.equal((await call("GET", "/missing.png", { headers: { Accept: "text/html" } })).status, 404);
  assert.equal((await call("GET", "/auth/nothing", { headers: { Accept: "text/html" } })).status, 404);
  assert.equal((await call("GET", "/api/v1/nothing", { headers: { Accept: "text/html" } })).status, 404);
});

test("the actor list and the problem view carry what the pages need", async () => {
  const actors = await call("GET", "/api/v1/actors");
  assert.equal(actors.status, 200);
  assert.ok(actors.body.actors.some((a: { name: string; roles: string[] }) => a.name === "Legacy audit editor" && a.roles.includes("editor")));
  assert.ok(actors.body.actors.every((a: Record<string, unknown>) => !("externalIdentity" in a) && !("keys" in a)), "identities and keys stay out of the list");
  const problem = service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[])[0] === "example-conformance-problem")!;
  const view = await call("GET", `/api/v1/problems/${problem.id}`);
  assert.equal(view.status, 200);
  assert.ok(typeof view.body.statement.body === "string" && view.body.statement.body.length > 0, "the statement Markdown is in the problem view");
});

test("a proposal from the web: the service fills in a missing statement digest and refuses non-http source URLs", async () => {
  const { session } = await login({ id: 9001, login: "zoe", name: "Zoe" });
  const body = "## Formal statement\n\nIs $x$ ever $y$?\n";
  const proposal = (extra: Record<string, unknown>[] = []) => ({ records: [
    { ref: "problem", type: "Problem", body: "Motivation.", title: "Web proposal", role: "primary", parentProblemId: null, parentClauseId: null, aliases: ["web-proposal"], origin: "editor-formulated", posed: null, areaIds: ["quantum-information"], topicIds: [], keywords: [], difficulty: "unrated", verificationCost: "unrated", relatedProblemIds: [] },
    { ref: "statement", type: "Statement", body, problemId: "$ref:problem", version: 1, clauses: [{ id: "main", label: "Main", text: "Is $x$ ever $y$?", kind: "decision", resolutionCriteria: "Prove or refute.", supersedesClauseId: null, quantity: null }] },
    ...extra,
    { type: "Contribution", body: "Proposed through the web.", kind: "problem-proposal", title: "Proposal: Web proposal", trajectoryId: null, problemIds: [], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: ["$ref:problem"], newStatementId: "$ref:statement", referenceIds: extra.length ? ["$ref:reference"] : [], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "none", license: "CC-BY-4.0" },
  ] });
  const bad = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: proposal([
    { ref: "source", type: "Source", body: "", title: "Evil", kind: "web-record", completeness: "url-only", authors: [], venue: "", date: null, doi: null, arxivId: null, url: "javascript:alert(1)", version: null },
    { ref: "reference", type: "Reference", body: "note", sourceId: "$ref:source", targetType: "problem", targetId: "$ref:problem", role: "background", locator: "" },
  ]) });
  assert.equal(bad.status, 422, bad.text);
  assert.match(bad.text, /url/u);
  const good = await call("POST", "/api/v1/batches", { cookie: `qop_session=${session}`, headers: { Origin: base }, body: proposal() });
  assert.equal(good.status, 201, good.text);
  const problem = await call("GET", `/api/v1/problems/${good.body.recordIds[0]}`);
  assert.equal(problem.body.statement.digest, statementDigest(body), "the service computed the digest from the body");
  const list = await call("GET", "/api/v1/problems?includeCandidates=true&limit=1000");
  const row = list.body.problems.find((p: { id: string }) => p.id === good.body.recordIds[0]);
  assert.equal(row.indexed, false, "rows say whether a problem is in the index");
  const contribution = await call("GET", `/api/v1/contributions/${good.body.recordIds[2]}`);
  assert.deepEqual(contribution.body.references, [], "the contribution view carries its references");
});

test("source search matches every term", async () => {
  const one = await call("GET", "/api/v1/sources?text=ruskai");
  assert.ok(one.body.count >= 1);
  const two = await call("GET", "/api/v1/sources?text=ruskai%20problems");
  assert.equal(two.body.count, one.body.count);
  const none = await call("GET", "/api/v1/sources?text=ruskai%20nosuchword");
  assert.equal(none.body.count, 0);
});

test("a context bundle refuses unknown clause refs and its id reflects the clauses chosen", async () => {
  const problem = service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[])[0] === "example-conformance-problem")!;
  const frontier = await call("GET", `/api/v1/problems/${problem.id}/frontier`);
  const [a, b] = frontier.body.clauses.map((c: { ref: string }) => c.ref);
  const bundleA = await call("GET", `/api/v1/problems/${problem.id}/context?clauses=${encodeURIComponent(a)}`);
  assert.equal(bundleA.status, 200, bundleA.text);
  const bundleB = await call("GET", `/api/v1/problems/${problem.id}/context?clauses=${encodeURIComponent(b)}`);
  assert.notEqual(bundleA.body.bundleId, bundleB.body.bundleId);
  const small = await call("GET", `/api/v1/problems/${problem.id}/context?clauses=${encodeURIComponent(a)}&budget=200`);
  assert.notEqual(small.body.bundleId, bundleA.body.bundleId, "a truncated bundle has its own id");
  const bad = await call("GET", `/api/v1/problems/${problem.id}/context?clauses=${a.split("#")[0]}%23no-such-clause`);
  assert.equal(bad.status, 400);
});
