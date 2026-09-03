/**
 * Service-local state that is not part of the ledger: API keys (hashed), idempotency
 * replies, rate-limit counters, and runs that are open but not yet written. Lives in its
 * own SQLite file so the disposable index can be rebuilt without losing keys or open runs.
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

  /** Count one event in a fixed window; returns the new count. */
  bump(scope: string, windowMs: number, now: number = Date.now()): number {
    const windowStart = Math.floor(now / windowMs) * windowMs;
    this.db.prepare("INSERT INTO counters (scope, window_start, count) VALUES (?, ?, 1) ON CONFLICT(scope, window_start) DO UPDATE SET count = count + 1").run(scope, windowStart);
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

  close(): void {
    this.db.close();
  }
}
