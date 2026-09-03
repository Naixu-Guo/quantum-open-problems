/**
 * Service-local state that is not part of the ledger: API keys (hashed), browser sessions
 * (hashed), external identities, idempotency replies, rate-limit counters, and runs that are
 * open but not yet written. Lives in its own SQLite file so the disposable index can be
 * rebuilt without losing keys, sessions, or open runs.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS api_keys (
  key_hash TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE TABLE IF NOT EXISTS idempotency (
  actor_id TEXT NOT NULL,
  key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (actor_id, key)
);
CREATE TABLE IF NOT EXISTS counters (
  scope TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY (scope, window_start)
);
CREATE TABLE IF NOT EXISTS open_trajectories (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  fields TEXT NOT NULL,
  started_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS open_events (
  trajectory_id TEXT NOT NULL,
  seq INTEGER NOT NULL,
  event TEXT NOT NULL,
  PRIMARY KEY (trajectory_id, seq)
);
CREATE TABLE IF NOT EXISTS pending_artifacts (
  id TEXT PRIMARY KEY,
  trajectory_id TEXT NOT NULL,
  fields TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS identities (
  provider TEXT NOT NULL,
  subject TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  login TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (provider, subject)
);
CREATE TABLE IF NOT EXISTS sessions (
  session_hash TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS oauth_states (
  state TEXT PRIMARY KEY,
  return_to TEXT NOT NULL,
  nonce_hash TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);
`;

export const hashKey = (token: string): string => createHash("sha256").update(token).digest("hex");

export interface OpenTrajectory {
  id: string;
  actorId: string;
  fields: Record<string, unknown>;
  startedAt: string;
}

export class AuthStore {
  readonly db: DatabaseSync;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec(SCHEMA);
  }

  /** Issue a bearer token for an actor. The token is returned once and stored only as a hash. */
  issueKey(actorId: string, label: string): string {
    const token = `qop_${randomBytes(24).toString("hex")}`;
    this.db.prepare("INSERT INTO api_keys (key_hash, actor_id, label, created_at) VALUES (?, ?, ?, ?)").run(hashKey(token), actorId, label, new Date().toISOString());
    return token;
  }

  revokeKey(token: string): boolean {
    const result = this.db.prepare("UPDATE api_keys SET revoked_at = ? WHERE key_hash = ? AND revoked_at IS NULL").run(new Date().toISOString(), hashKey(token));
    return Number(result.changes) > 0;
  }

  actorForToken(token: string): string | null {
    const row = this.db.prepare("SELECT actor_id FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL").get(hashKey(token)) as { actor_id: string } | undefined;
    return row?.actor_id ?? null;
  }

  keysFor(actorId: string): { label: string; createdAt: string; revokedAt: string | null }[] {
    return (this.db.prepare("SELECT label, created_at, revoked_at FROM api_keys WHERE actor_id = ? ORDER BY created_at").all(actorId) as { label: string; created_at: string; revoked_at: string | null }[])
      .map((row) => ({ label: row.label, createdAt: row.created_at, revokedAt: row.revoked_at }));
  }

  /** Stored reply for an idempotency key, or null; `conflict` when the same key came with a different body. */
  replay(actorId: string, key: string, requestHash: string): { status: number; body: string } | "conflict" | null {
    const row = this.db.prepare("SELECT request_hash, status, body FROM idempotency WHERE actor_id = ? AND key = ?").get(actorId, key) as { request_hash: string; status: number; body: string } | undefined;
    if (!row) return null;
    return row.request_hash === requestHash ? { status: row.status, body: row.body } : "conflict";
  }

  remember(actorId: string, key: string, requestHash: string, status: number, body: string): void {
    this.db.prepare("INSERT OR REPLACE INTO idempotency (actor_id, key, request_hash, status, body, created_at) VALUES (?, ?, ?, ?, ?, ?)").run(actorId, key, requestHash, status, body, new Date().toISOString());
  }

  /** Count `by` events in a fixed window; returns the new count. */
  bump(scope: string, windowMs: number, now: number = Date.now(), by: number = 1): number {
    const windowStart = Math.floor(now / windowMs) * windowMs;
    this.db.prepare("INSERT INTO counters (scope, window_start, count) VALUES (?, ?, ?) ON CONFLICT(scope, window_start) DO UPDATE SET count = count + excluded.count").run(scope, windowStart, by);
    const row = this.db.prepare("SELECT count FROM counters WHERE scope = ? AND window_start = ?").get(scope, windowStart) as { count: number };
    return row.count;
  }

  openTrajectory(trajectory: OpenTrajectory): void {
    this.db.prepare("INSERT INTO open_trajectories (id, actor_id, fields, started_at) VALUES (?, ?, ?, ?)").run(trajectory.id, trajectory.actorId, JSON.stringify(trajectory.fields), trajectory.startedAt);
  }

  getOpenTrajectory(id: string): OpenTrajectory | null {
    const row = this.db.prepare("SELECT id, actor_id, fields, started_at FROM open_trajectories WHERE id = ?").get(id) as { id: string; actor_id: string; fields: string; started_at: string } | undefined;
    return row ? { id: row.id, actorId: row.actor_id, fields: JSON.parse(row.fields) as Record<string, unknown>, startedAt: row.started_at } : null;
  }

  appendEvent(trajectoryId: string, event: Record<string, unknown>): number {
    const row = this.db.prepare("SELECT COALESCE(MAX(seq), 0) AS seq FROM open_events WHERE trajectory_id = ?").get(trajectoryId) as { seq: number };
    const seq = row.seq + 1;
    this.db.prepare("INSERT INTO open_events (trajectory_id, seq, event) VALUES (?, ?, ?)").run(trajectoryId, seq, JSON.stringify({ seq, ...event }));
    return seq;
  }

  events(trajectoryId: string): Record<string, unknown>[] {
    return (this.db.prepare("SELECT event FROM open_events WHERE trajectory_id = ? ORDER BY seq").all(trajectoryId) as { event: string }[]).map((row) => JSON.parse(row.event) as Record<string, unknown>);
  }

  addPendingArtifact(id: string, trajectoryId: string, fields: Record<string, unknown>): void {
    this.db.prepare("INSERT INTO pending_artifacts (id, trajectory_id, fields) VALUES (?, ?, ?)").run(id, trajectoryId, JSON.stringify(fields));
  }

  pendingArtifacts(trajectoryId: string): Record<string, unknown>[] {
    return (this.db.prepare("SELECT fields FROM pending_artifacts WHERE trajectory_id = ? ORDER BY rowid").all(trajectoryId) as { fields: string }[]).map((row) => JSON.parse(row.fields) as Record<string, unknown>);
  }

  closeTrajectory(id: string): void {
    this.db.exec("BEGIN");
    try {
      this.db.prepare("DELETE FROM open_events WHERE trajectory_id = ?").run(id);
      this.db.prepare("DELETE FROM pending_artifacts WHERE trajectory_id = ?").run(id);
      this.db.prepare("DELETE FROM open_trajectories WHERE id = ?").run(id);
      this.db.exec("COMMIT");
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  // -- Human login: external identities, browser sessions, OAuth state ------------------------

  /** The actor an external identity (for example GitHub user id) is linked to, or null. */
  actorForIdentity(provider: string, subject: string): string | null {
    const row = this.db.prepare("SELECT actor_id FROM identities WHERE provider = ? AND subject = ?").get(provider, subject) as { actor_id: string } | undefined;
    return row?.actor_id ?? null;
  }

  /** Link an external identity to an actor; a repeated login refreshes the stored login name. */
  linkIdentity(provider: string, subject: string, actorId: string, login: string): void {
    this.db.prepare("INSERT INTO identities (provider, subject, actor_id, login, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(provider, subject) DO UPDATE SET actor_id = excluded.actor_id, login = excluded.login").run(provider, subject, actorId, login, new Date().toISOString());
  }

  /** Open a browser session for an actor. The token is returned once and stored only as a hash. */
  createSession(actorId: string, ttlMs: number, now: number = Date.now()): string {
    this.db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(new Date(now).toISOString());
    const token = `qops_${randomBytes(32).toString("hex")}`;
    this.db.prepare("INSERT INTO sessions (session_hash, actor_id, created_at, expires_at) VALUES (?, ?, ?, ?)").run(hashKey(token), actorId, new Date(now).toISOString(), new Date(now + ttlMs).toISOString());
    return token;
  }

  actorForSession(token: string, now: number = Date.now()): string | null {
    const row = this.db.prepare("SELECT actor_id, expires_at FROM sessions WHERE session_hash = ?").get(hashKey(token)) as { actor_id: string; expires_at: string } | undefined;
    if (!row || Date.parse(row.expires_at) <= now) return null;
    return row.actor_id;
  }

  deleteSession(token: string): void {
    this.db.prepare("DELETE FROM sessions WHERE session_hash = ?").run(hashKey(token));
  }

  /** Remember an OAuth state with the path to return to after login and the hash of the nonce cookie set on the browser that started it. */
  rememberState(state: string, returnTo: string, nonceHash: string, now: number = Date.now()): void {
    this.db.prepare("DELETE FROM oauth_states WHERE created_at < ?").run(new Date(now - 60 * 60 * 1000).toISOString());
    this.db.prepare("INSERT INTO oauth_states (state, return_to, nonce_hash, created_at) VALUES (?, ?, ?, ?)").run(state, returnTo, nonceHash, new Date(now).toISOString());
  }

  /** Use an OAuth state once; returns its return path and nonce hash, or null when unknown or older than `maxAgeMs`. */
  consumeState(state: string, maxAgeMs: number, now: number = Date.now()): { returnTo: string; nonceHash: string } | null {
    const row = this.db.prepare("SELECT return_to, nonce_hash, created_at FROM oauth_states WHERE state = ?").get(state) as { return_to: string; nonce_hash: string; created_at: string } | undefined;
    if (!row) return null;
    this.db.prepare("DELETE FROM oauth_states WHERE state = ?").run(state);
    if (now - Date.parse(row.created_at) > maxAgeMs) return null;
    return { returnTo: row.return_to, nonceHash: row.nonce_hash };
  }

  close(): void {
    this.db.close();
  }
}
