/** Project-only inbox login and files. No mail provider, external account, or ledger identity. */
import fs from "node:fs";
import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { hashKey } from "./auth.ts";
import { HttpError } from "./errors.ts";
import type { Service } from "./write.ts";

export const INBOX_COOKIE = "qop_inbox";
const MAX_AGE = 12 * 60 * 60;
const files = new Map([
  ["/inbox/", ["index.html", "text/html; charset=utf-8"]],
  ["/inbox/app.js", ["app.js", "text/javascript; charset=utf-8"]],
  ["/inbox/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/inbox/base.css", ["../styles.css", "text/css; charset=utf-8"]],
]);
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
};

export async function handleInbox(service: Service, request: http.IncomingMessage, response: http.ServerResponse, url: URL,
  options: { sameOrigin: boolean; address: string; token: string; readBody: (request: http.IncomingMessage, limit: number) => Promise<Buffer> }): Promise<boolean> {
  if (url.pathname !== "/inbox" && !url.pathname.startsWith("/inbox/")) return false;
  const { token, sameOrigin, address } = options;
  const keyHash = service.submissionsConfig.inboxKeyHash;
  const cookie = (value: string, seconds: number) => `${INBOX_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${seconds}${new URL(service.web.publicUrl).protocol === "https:" ? "; Secure" : ""}`;
  const json = (body: unknown, setCookie?: string) => {
    response.writeHead(200, { ...headers, "Content-Type": "application/json; charset=utf-8", ...(setCookie ? { "Set-Cookie": setCookie } : {}) });
    response.end(JSON.stringify(body));
  };
  if (request.method === "GET") {
    if (url.pathname === "/inbox") {
      response.writeHead(308, { ...headers, Location: "/inbox/" }); response.end(); return true;
    }
    if (url.pathname === "/inbox/session") {
      json({ enabled: Boolean(keyHash), authenticated: service.auth.validInboxSession(token, keyHash) }); return true;
    }
    const asset = files.get(url.pathname);
    if (!asset) throw new HttpError(404, "inbox page not found");
    response.writeHead(200, { ...headers, "Content-Type": asset[1]! });
    response.end(fs.readFileSync(new URL(`../../web/inbox/${asset[0]}`, import.meta.url)));
    return true;
  }
  if (request.method !== "POST") throw new HttpError(405, "GET or POST only");
  if (!sameOrigin) throw new HttpError(403, "cross-site request refused");
  if (url.pathname === "/inbox/logout") {
    service.auth.deleteInboxSession(token);
    json({ authenticated: false }, cookie("", 0)); return true;
  }
  if (url.pathname !== "/inbox/login") throw new HttpError(404, "inbox route not found");
  if (!keyHash) throw new HttpError(503, "project inbox login is not configured");
  if (service.auth.bump(`inbox-login:${address}`, 15 * 60 * 1000) > 10) throw new HttpError(429, "too many login attempts; try again in 15 minutes");
  let body: unknown;
  try { body = JSON.parse((await options.readBody(request, 4096)).toString("utf8")); }
  catch (error) { if (error instanceof HttpError) throw error; throw new HttpError(400, "the login body must be JSON"); }
  const key = body && typeof body === "object" && "key" in body ? body.key : null;
  if (typeof key !== "string" || !timingSafeEqual(Buffer.from(hashKey(key.trim()), "hex"), Buffer.from(keyHash, "hex"))) throw new HttpError(401, "the inbox access key is incorrect");
  // Re-login replaces this browser's old session rather than leaving it valid.
  service.auth.deleteInboxSession(token);
  json({ authenticated: true }, cookie(service.auth.createInboxSession(keyHash), MAX_AGE));
  return true;
}
