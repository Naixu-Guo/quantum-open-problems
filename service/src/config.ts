/** Service configuration from the environment, with defaults that point at this repository. */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CAPTCHA_PROVIDERS, type CaptchaProvider, type SubmissionsConfig } from "./submissions.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");

export interface GitHubConfig {
  clientId: string;
  clientSecret: string;
  /** Where the OAuth pages live; https://github.com unless a test points it at a fake. */
  oauthBase: string;
  /** Where the user endpoint lives; https://api.github.com unless a test points it at a fake. */
  apiBase: string;
}

export interface WebConfig {
  /** Directory of static files the service serves at `/`; null serves nothing but the API and the auth routes. */
  webDir: string | null;
  /** The URL browsers reach the service at; the OAuth redirect and the session cookie's Secure flag derive from it. */
  publicUrl: string;
  sessionDays: number;
  /** GitHub OAuth application; null disables human login. */
  github: GitHubConfig | null;
}

export interface Config {
  ledgerDir: string;
  activityDir: string;
  contractDir: string;
  dbPath: string;
  /** Service-local store for API keys, sessions, idempotency, and open runs. Never rebuilt from the ledger. */
  authDbPath: string;
  port: number;
  /** Whether the service commits to git after each accepted write. Tests turn it on against a temporary repository. */
  commit: boolean;
  /** The human-facing web app and its login. Absent fields take the defaults in `webDefaults`. */
  web?: Partial<WebConfig>;
  /** The remote the ledger clone pushes to after each commit and catches up with before each write; null keeps commits local. */
  git?: { remote: string | null; branch?: string | null; pollIntervalMs?: number };
  /** The public proposal inbox behind the static site's contribution form. Absent fields take the defaults in `submissionsDefaults`. */
  submissions?: Partial<SubmissionsConfig>;
}

const stripSlash = (url: string): string => url.replace(/\/+$/u, "");

/** Zero disables background remote polling; local committed changes still refresh on reads. */
export function syncIntervalMs(value: number | string | undefined): number {
  if (value === undefined) return 5_000;
  const interval = Number(value);
  if (!Number.isSafeInteger(interval) || interval < 0 || interval > 2_147_483_647) throw new Error("QOP_SYNC_INTERVAL_MS must be an integer from 0 to 2147483647");
  return interval;
}

/** A positive integer, else the default. */
function positiveInteger(value: number | string | undefined, fallback: number): number {
  const number = typeof value === "string" ? Number(value) : value;
  return typeof number === "number" && Number.isInteger(number) && number > 0 ? number : fallback;
}

/**
 * Normalize the inbox configuration: no trailing slashes on origins, a sane budget, and a database
 * beside the auth store by default, since both are service-local state that outlives the index; an
 * in-memory auth store (a test's) means an in-memory inbox.
 */
export function submissionsDefaults(config: Config): SubmissionsConfig {
  const given = config.submissions ?? {};
  const captcha = given.captcha ?? null;
  if (captcha && !(captcha.provider in CAPTCHA_PROVIDERS)) throw new Error(`unknown CAPTCHA provider ${String(captcha.provider)}; use one of ${Object.keys(CAPTCHA_PROVIDERS).join(", ")}`);
  const besideAuth = config.authDbPath === ":memory:" ? ":memory:" : path.join(path.dirname(path.resolve(config.authDbPath)), "submissions.sqlite");
  return {
    dbPath: given.dbPath ?? besideAuth,
    captcha: captcha ? { provider: captcha.provider, secret: captcha.secret, verifyUrl: captcha.verifyUrl || CAPTCHA_PROVIDERS[captcha.provider].verifyUrl } : null,
    allowedOrigins: (given.allowedOrigins ?? []).map(stripSlash).filter(Boolean),
    perAddressPerHour: positiveInteger(given.perAddressPerHour, 10),
    trustProxy: given.trustProxy ?? false,
  };
}

/** A positive number of days, else the default; NaN, zero, and negatives never reach a session. */
function sessionDaysOf(value: number | string | undefined, fallback: number): number {
  const days = typeof value === "string" ? Number(value) : value;
  return typeof days === "number" && Number.isFinite(days) && days > 0 ? days : fallback;
}

/** Normalize the web configuration whether it came from the environment or from code: resolved directory, no trailing slashes, valid session length. */
export function webDefaults(config: Config): WebConfig {
  const webDir = config.web?.webDir;
  return {
    webDir: webDir === null || webDir === undefined || webDir === "" || webDir === "0" ? null : path.resolve(webDir),
    publicUrl: stripSlash(config.web?.publicUrl ?? `http://localhost:${config.port}`),
    sessionDays: sessionDaysOf(config.web?.sessionDays, 30),
    github: config.web?.github ? { ...config.web.github, oauthBase: stripSlash(config.web.github.oauthBase), apiBase: stripSlash(config.web.github.apiBase) } : null,
  };
}

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): Config {
  const port = Number(env["QOP_PORT"] ?? 8787);
  const clientId = env["QOP_GITHUB_CLIENT_ID"];
  const clientSecret = env["QOP_GITHUB_CLIENT_SECRET"];
  const captchaProvider = env["QOP_CAPTCHA_PROVIDER"] ?? "turnstile";
  if (!(captchaProvider in CAPTCHA_PROVIDERS)) throw new Error(`QOP_CAPTCHA_PROVIDER must be one of ${Object.keys(CAPTCHA_PROVIDERS).join(", ")}`);
  const captchaSecret = env["QOP_CAPTCHA_SECRET"];
  return {
    submissions: {
      ...(env["QOP_SUBMISSIONS_DB_PATH"] ? { dbPath: path.resolve(env["QOP_SUBMISSIONS_DB_PATH"]) } : {}),
      captcha: captchaSecret ? { provider: captchaProvider as CaptchaProvider, secret: captchaSecret, verifyUrl: env["QOP_CAPTCHA_VERIFY_URL"] ?? CAPTCHA_PROVIDERS[captchaProvider as CaptchaProvider].verifyUrl } : null,
      allowedOrigins: (env["QOP_SUBMISSION_ORIGINS"] ?? "").split(",").map((origin) => origin.trim()).filter(Boolean),
      perAddressPerHour: positiveInteger(env["QOP_SUBMISSIONS_PER_HOUR"], 10),
      trustProxy: env["QOP_TRUST_PROXY"] === "1",
    },
    ledgerDir: path.resolve(env["QOP_LEDGER_DIR"] ?? path.join(repoRoot, "ledger")),
    activityDir: path.resolve(env["QOP_ACTIVITY_DIR"] ?? path.join(repoRoot, "activity")),
    contractDir: path.resolve(env["QOP_CONTRACT_DIR"] ?? path.join(repoRoot, "contract")),
    dbPath: path.resolve(env["QOP_DB_PATH"] ?? path.join(repoRoot, "service", "data", "index.sqlite")),
    authDbPath: path.resolve(env["QOP_AUTH_DB_PATH"] ?? path.join(repoRoot, "service", "data", "auth.sqlite")),
    port,
    commit: env["QOP_COMMIT"] !== "0",
    git: { remote: env["QOP_GIT_REMOTE"] || null, branch: env["QOP_GIT_BRANCH"] || null, pollIntervalMs: syncIntervalMs(env["QOP_SYNC_INTERVAL_MS"]) },
    web: {
      // Unset serves the repository's web/ directory; "0" or an empty value serves nothing.
      webDir: env["QOP_WEB_DIR"] === undefined ? path.join(repoRoot, "web") : env["QOP_WEB_DIR"] === "" || env["QOP_WEB_DIR"] === "0" ? null : env["QOP_WEB_DIR"],
      publicUrl: env["QOP_PUBLIC_URL"] ?? `http://localhost:${port}`,
      sessionDays: sessionDaysOf(env["QOP_SESSION_DAYS"], 30),
      github: clientId && clientSecret ? {
        clientId,
        clientSecret,
        oauthBase: env["QOP_GITHUB_URL"] ?? "https://github.com",
        apiBase: env["QOP_GITHUB_API_URL"] ?? "https://api.github.com",
      } : null,
    },
  };
}
