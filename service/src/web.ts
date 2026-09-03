/**
 * The human side of the service: GitHub login that creates the person's actor record on first
 * visit, browser sessions, and the static files of the web app. The web app itself is a client
 * of the API in `api.ts`; a session cookie stands in for a bearer token there.
 *
 * Identity is the numeric GitHub id linked in the auth store, never the mutable login name.
 * A login is bound to the browser that started it by a nonce cookie. A person's actor record
 * starts with the contributor role and only an editor can change its roles.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { Service } from "./write.ts";
import { submit } from "./write.ts";
import { authorizeUrl, exchangeCode, fetchUser, type GitHubUser } from "./github.ts";
import { HttpError } from "./errors.ts";
import { hashKey } from "./auth.ts";
import { newId, nowIso } from "./ids.ts";

export const SESSION_COOKIE = "qop_session";
export const LOGIN_COOKIE = "qop_login";
export const STATE_MAX_AGE = 10 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

const CONTENT_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

/** Who the request is from, as the API server resolved it before dispatching here. */
export interface Caller {
  actorId: string | null;
  /** True when the actor came from the session cookie rather than a bearer token. */
  viaSession: boolean;
  sessionToken: string | null;
  loginNonce: string | null;
  sameOrigin: boolean;
}

/** Raw cookie values by name. Nothing is percent-decoded: our cookies are plain tokens, and other apps' cookies are not ours to parse. */
export function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    if (name) out[name] = part.slice(index + 1).trim();
  }
  return out;
}

function cookie(service: Service, name: string, value: string, maxAgeSeconds: number): string {
  const secure = service.web.publicUrl.startsWith("https://") ? "; Secure" : "";
  return `${name}=${value}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; SameSite=Lax${secure}`;
}

/**
 * A local path to return to after login. Only absolute paths on this service made of URL-safe
 * ASCII qualify: no second slash or backslash, no whitespace or control characters (browsers
 * strip tabs before parsing), nothing that resolves to another origin.
 */
export function safeReturnTo(raw: string | null, publicUrl: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (!/^[A-Za-z0-9\-._~!$&'()*+,;=:@%/?#]+$/u.test(raw)) return "/";
  try {
    const base = new URL(publicUrl);
    const resolved = new URL(raw, base);
    if (resolved.origin !== base.origin) return "/";
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return "/";
  }
}

/**
 * The actor for a GitHub user: the one linked to the numeric GitHub id in the auth store, else
 * a new actor the system writes with the contributor role. The login name is never used to
 * find an actor, because GitHub logins can be renamed and re-registered; an editor links a
 * pre-existing actor to an id with the `identity link` command.
 */
export function ensureHumanActor(service: Service, user: GitHubUser): string {
  const ledger = service.repo.current();
  const subject = String(user.id);
  let actorId = service.auth.actorForIdentity("github", subject);
  if (actorId && !ledger.find("Actor", actorId)) actorId = null;
  if (!actorId) {
    const id = newId();
    const result = submit(service, service.systemActorId, [{
      fields: {
        id, type: "Actor", schemaVersion: "1.0", revision: 1, createdBy: service.systemActorId, createdAt: nowIso(),
        name: user.name ?? user.login, kind: "human", roles: ["contributor"], externalIdentity: `github:${user.login}`, operatorId: null, modelFamily: null, modelVersion: null, harness: null,
      },
      body: "Created by the service at this person's first GitHub login. Roles beyond contributor are granted by an editor's revision of this record.",
    }], `Create actor for GitHub user ${user.login}`);
    if (!result.ok) throw new HttpError(500, `the actor record could not be written: ${result.issues.map((issue) => issue.message).join("; ")}`);
    for (const issue of result.automaticIssues) console.error(`automatic decision skipped after login: ${issue.path}: ${issue.message}`);
    actorId = id;
  }
  service.auth.linkIdentity("github", subject, actorId, user.login);
  return actorId;
}

function sendJson(response: http.ServerResponse, status: number, payload: unknown, extra: Record<string, string> = {}): void {
  const body = JSON.stringify(payload, null, 1);
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body), "Cache-Control": "no-store", ...extra });
  response.end(body);
}

function redirect(response: http.ServerResponse, status: 302 | 303, location: string, extra: Record<string, string | string[]> = {}): void {
  response.writeHead(status, { Location: location, "Cache-Control": "no-store", "Content-Length": 0, ...extra });
  response.end();
}

/**
 * Serve one file from the web directory. Dotfiles and anything outside the directory are not
 * served. A weak ETag lets browsers revalidate instead of re-downloading; a read error after
 * the headers went out ends the response instead of the process.
 */
function serveStatic(webDir: string, pathname: string, request: http.IncomingMessage, response: http.ServerResponse): boolean {
  let relative: string;
  try {
    relative = pathname === "/" ? "index.html" : decodeURIComponent(pathname.slice(1));
  } catch {
    return false;
  }
  if (relative.split("/").some((segment) => segment.startsWith("."))) return false;
  const file = path.resolve(webDir, relative);
  if (!file.startsWith(`${webDir}${path.sep}`)) return false;
  let stat: fs.Stats;
  try {
    stat = fs.statSync(file);
  } catch {
    return false;
  }
  if (!stat.isFile()) return false;
  const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
  if (request.headers["if-none-match"] === etag) {
    response.writeHead(304, { ETag: etag, "Cache-Control": "no-cache" });
    response.end();
    return true;
  }
  const type = CONTENT_TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  const stream = fs.createReadStream(file);
  stream.on("open", () => {
    response.writeHead(200, { "Content-Type": type, "Content-Length": stat.size, "Cache-Control": "no-cache", ETag: etag });
    stream.pipe(response);
  });
  stream.on("error", () => {
    if (!response.headersSent) sendJson(response, 404, { error: "not found" });
    else response.destroy();
  });
  return true;
}

/**
 * Handle a request outside `/api/`: the auth routes and the web app's files. Returns false when
 * the path is none of these so the API server answers with its 404.
 */
export async function handleWeb(service: Service, request: http.IncomingMessage, response: http.ServerResponse, url: URL, caller: Caller): Promise<boolean> {
  const { github, publicUrl, webDir, sessionDays } = service.web;
  const redirectUri = `${publicUrl}/auth/callback`;
  const method = request.method;

  if (url.pathname === "/auth/session" && method === "GET") {
    const actor = caller.actorId ? service.repo.current().find("Actor", caller.actorId) : undefined;
    sendJson(response, 200, {
      authenticated: Boolean(actor),
      via: actor ? (caller.viaSession ? "session" : "token") : null,
      actor: actor ? { id: actor.id, name: actor.fields["name"], kind: actor.fields["kind"], roles: actor.fields["roles"], externalIdentity: actor.fields["externalIdentity"] } : null,
      login: github ? { provider: "github", url: "/auth/login" } : null,
    });
    return true;
  }

  if (url.pathname === "/auth/login" && method === "GET") {
    if (!github) throw new HttpError(503, "GitHub login is not configured on this service");
    const state = randomBytes(24).toString("hex");
    const nonce = randomBytes(24).toString("hex");
    service.auth.rememberState(state, safeReturnTo(url.searchParams.get("return_to"), publicUrl), hashKey(nonce));
    redirect(response, 302, authorizeUrl(github, redirectUri, state), { "Set-Cookie": cookie(service, LOGIN_COOKIE, nonce, STATE_MAX_AGE / 1000) });
    return true;
  }

  if (url.pathname === "/auth/callback" && method === "GET") {
    if (!github) throw new HttpError(503, "GitHub login is not configured on this service");
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    if (!code || !state) throw new HttpError(400, "code and state are required");
    if (!caller.loginNonce) throw new HttpError(400, "this browser did not start the login; start it again");
    const pending = service.auth.consumeState(state, STATE_MAX_AGE);
    if (pending === null) throw new HttpError(400, "the login state is unknown or expired; start the login again");
    if (pending.nonceHash !== hashKey(caller.loginNonce)) throw new HttpError(400, "the login was started by another browser; start it again");
    const accessToken = await exchangeCode(github, code, redirectUri);
    const user = await fetchUser(github, accessToken);
    const actorId = ensureHumanActor(service, user);
    const token = service.auth.createSession(actorId, sessionDays * DAY);
    redirect(response, 303, pending.returnTo, { "Set-Cookie": [cookie(service, SESSION_COOKIE, token, sessionDays * DAY / 1000), cookie(service, LOGIN_COOKIE, "", 0)] });
    return true;
  }

  if (url.pathname === "/auth/logout" && method === "POST") {
    if (caller.sessionToken && !caller.sameOrigin) throw new HttpError(403, "cross-site request refused");
    if (caller.sessionToken) service.auth.deleteSession(caller.sessionToken);
    response.writeHead(204, { "Set-Cookie": cookie(service, SESSION_COOKIE, "", 0), "Cache-Control": "no-store" });
    response.end();
    return true;
  }

  if (url.pathname.startsWith("/auth/")) throw new HttpError(404, `no route for ${method} ${url.pathname}`);
  if (method === "GET" && webDir) return serveStatic(webDir, url.pathname, request, response);
  return false;
}
