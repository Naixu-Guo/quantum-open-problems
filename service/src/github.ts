/**
 * The GitHub OAuth client the human login uses: the authorization URL, the code exchange, and
 * the user lookup. Nothing here touches the ledger; `web.ts` turns a GitHub user into an actor.
 */
import type { GitHubConfig } from "./config.ts";
import { HttpError } from "./errors.ts";

export interface GitHubUser {
  id: number;
  login: string;
  name: string | null;
}

const USER_AGENT = "quantum-open-problems-service";
const TIMEOUT_MS = 10_000;

export function authorizeUrl(github: GitHubConfig, redirectUri: string, state: string): string {
  const params = new URLSearchParams({ client_id: github.clientId, redirect_uri: redirectUri, scope: "read:user", state });
  return `${github.oauthBase}/login/oauth/authorize?${params.toString()}`;
}

export async function exchangeCode(github: GitHubConfig, code: string, redirectUri: string): Promise<string> {
  const response = await fetch(`${github.oauthBase}/login/oauth/access_token`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": USER_AGENT },
    body: JSON.stringify({ client_id: github.clientId, client_secret: github.clientSecret, code, redirect_uri: redirectUri }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const body = (await response.json().catch(() => ({}))) as { access_token?: string; error?: string; error_description?: string };
  if (!response.ok || typeof body.access_token !== "string") throw new HttpError(502, `GitHub refused the login code${body.error ? `: ${body.error_description ?? body.error}` : ""}`);
  return body.access_token;
}

export async function fetchUser(github: GitHubConfig, accessToken: string): Promise<GitHubUser> {
  const response = await fetch(`${github.apiBase}/user`, { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${accessToken}`, "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const body = (await response.json().catch(() => ({}))) as { id?: unknown; login?: unknown; name?: unknown };
  if (!response.ok || typeof body.id !== "number" || typeof body.login !== "string") throw new HttpError(502, "GitHub did not return a user");
  return { id: body.id, login: body.login, name: typeof body.name === "string" && body.name.trim() !== "" ? body.name.trim() : null };
}
