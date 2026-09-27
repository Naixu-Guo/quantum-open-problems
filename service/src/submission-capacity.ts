/** Bounded, durable inbox budgets and aggregate-only operator alerts. */
import type { DatabaseSync } from "node:sqlite";
import { HttpError } from "./errors.ts";
import { newId } from "./ids.ts";

export interface InboxLimits { globalPerHour: number; maxRows: number; maxBytes: number }
export const INBOX_LIMITS: InboxLimits = { globalPerHour: 100, maxRows: 10_000, maxBytes: 256 * 1024 * 1024 };
const HOUR = 60 * 60 * 1000;
type Resource = "hour" | "rows" | "storage";
type Level = "ok" | "warning" | "full";
export interface CapacityAlert {
  id: string; at: string; level: "warning" | "full"; resources: Resource[];
  storedBytes: number; maxBytes: number;
}
export interface InboxCapacity {
  state: Level;
  hour: { used: number; limit: number; resetsAt: string | null };
  rows: { used: number; limit: number };
  storage: { usedBytes: number; limitBytes: number; reserveBytes: number };
  lastAlert: CapacityAlert | null;
}
interface Budget { window_start: number; attempts: number; last_alert: string | null; alert_state: string }

export function inboxLimits(given: Partial<InboxLimits> = {}): InboxLimits {
  const result = { globalPerHour: given.globalPerHour ?? INBOX_LIMITS.globalPerHour, maxRows: given.maxRows ?? INBOX_LIMITS.maxRows, maxBytes: given.maxBytes ?? INBOX_LIMITS.maxBytes };
  for (const [name, value] of Object.entries(result)) {
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error(`inbox ${name} must be a positive safe integer`);
  }
  if (result.maxBytes < 64 * 1024) throw new Error("inbox maxBytes must be at least 65536 bytes");
  return result;
}

export class SubmissionCapacity {
  readonly limits: InboxLimits;
  readonly pageSize: number;
  readonly reserveBytes: number;
  private db: DatabaseSync;
  constructor(db: DatabaseSync, given: Partial<InboxLimits> = {}) {
    this.db = db;
    this.limits = inboxLimits(given);
    db.exec(`CREATE TABLE IF NOT EXISTS inbox_budget (
      id INTEGER PRIMARY KEY CHECK(id = 1), window_start INTEGER NOT NULL DEFAULT 0,
      attempts INTEGER NOT NULL DEFAULT 0, last_alert TEXT, alert_state TEXT NOT NULL DEFAULT ''
    ); INSERT OR IGNORE INTO inbox_budget (id) VALUES (1);`);
    this.pageSize = Number((db.prepare("PRAGMA page_size").get() as { page_size: number }).page_size);
    this.reserveBytes = Math.min(1024 * 1024, Math.floor(this.limits.maxBytes / 4));
    // SQLite enforces the physical main-file ceiling; reserve room for review notes and alerts.
    db.exec(`PRAGMA max_page_count = ${Math.floor(this.limits.maxBytes / this.pageSize)};
      PRAGMA wal_autocheckpoint = 256; PRAGMA journal_size_limit = 1048576; PRAGMA busy_timeout = 5000;`);
  }

  private budget(): Budget { return this.db.prepare("SELECT * FROM inbox_budget WHERE id = 1").get() as unknown as Budget; }

  usage(now = Date.now()): InboxCapacity {
    const budget = this.budget();
    const current = budget.window_start > now - HOUR;
    const pages = Number((this.db.prepare("PRAGMA page_count").get() as { page_count: number }).page_count);
    const free = Number((this.db.prepare("PRAGMA freelist_count").get() as { freelist_count: number }).freelist_count);
    const usedBytes = (pages - free) * this.pageSize;
    const rows = Number((this.db.prepare("SELECT COUNT(*) AS n FROM submissions").get() as { n: number }).n);
    const lastAlert = budget.last_alert ? JSON.parse(budget.last_alert) as CapacityAlert : null;
    const value: InboxCapacity = {
      state: "ok", hour: { used: current ? budget.attempts : 0, limit: this.limits.globalPerHour, resetsAt: current ? new Date(budget.window_start + HOUR).toISOString() : null },
      rows: { used: rows, limit: this.limits.maxRows },
      storage: { usedBytes, limitBytes: this.limits.maxBytes, reserveBytes: this.reserveBytes }, lastAlert,
    };
    value.state = this.resources(value, "full").length ? "full" : this.resources(value, "warning").length ? "warning" : "ok";
    return value;
  }

  private resources(value: InboxCapacity, level: "warning" | "full"): Resource[] {
    const ratio = level === "full" ? 1 : 0.8;
    const resources: Resource[] = [];
    if (value.hour.used >= value.hour.limit * ratio) resources.push("hour");
    if (value.rows.used >= value.rows.limit * ratio) resources.push("rows");
    const storageLimit = value.storage.limitBytes - value.storage.reserveBytes;
    const priorFull = value.lastAlert?.level === "full" && value.lastAlert.resources.includes("storage") &&
      value.lastAlert.maxBytes === value.storage.limitBytes && value.storage.usedBytes >= value.lastAlert.storedBytes;
    if (value.storage.usedBytes >= storageLimit * ratio || priorFull) resources.push("storage");
    return resources;
  }

  /** A single persistent row, bounded even when many IPs fail verification or restart the API. */
  takeAttempt(now = Date.now()): void {
    this.db.exec("BEGIN IMMEDIATE");
    let changed: number;
    try {
      const result = this.db.prepare(`UPDATE inbox_budget SET
        attempts = CASE WHEN window_start <= ? THEN 1 ELSE attempts + 1 END,
        window_start = CASE WHEN window_start <= ? THEN ? ELSE window_start END
        WHERE id = 1 AND (window_start <= ? OR attempts < ?)`)
        .run(now - HOUR, now - HOUR, now, now - HOUR, this.limits.globalPerHour);
      this.observe(now);
      changed = Number(result.changes);
      this.db.exec("COMMIT");
    } catch (error) { try { this.db.exec("ROLLBACK"); } catch { /* already rolled back */ } throw error; }
    if (changed === 0) throw new HttpError(429, "the inbox has reached its global hourly submission limit; please try again later");
  }

  /** Called inside the same write transaction as the insert, preventing concurrent overshoot. */
  checkInsert(now = Date.now()): void {
    const value = this.usage(now);
    if (value.rows.used > value.rows.limit) throw new HttpError(503, "the proposal inbox is full; existing proposals are preserved. Please use the GitHub contribution route or try again after a maintainer frees capacity");
    if (value.storage.usedBytes > value.storage.limitBytes - value.storage.reserveBytes ||
      (value.lastAlert?.level === "full" && value.lastAlert.resources.includes("storage") && value.lastAlert.maxBytes === value.storage.limitBytes && value.storage.usedBytes >= value.lastAlert.storedBytes)) {
      throw new HttpError(503, "the proposal inbox storage is full; existing proposals are preserved. Please use the GitHub contribution route or try again after a maintainer frees capacity");
    }
  }

  /** Keep the last alert after recovery so scheduled GitHub checks cannot miss a short incident. */
  observe(now = Date.now(), fullResource?: Resource): InboxCapacity {
    const value = this.usage(now);
    const level = fullResource ? "full" : value.state;
    const resources = level === "ok" ? [] : [...new Set([...this.resources(value, level), ...(fullResource ? [fullResource] : [])])].sort();
    const state = [level, ...resources].join(":");
    if (this.budget().alert_state !== state) {
      if (level === "ok") this.db.prepare("UPDATE inbox_budget SET alert_state = ? WHERE id = 1").run(state);
      else {
        const alert: CapacityAlert = { id: newId(now), at: new Date(now).toISOString(), level, resources, storedBytes: value.storage.usedBytes, maxBytes: value.storage.limitBytes };
        this.db.prepare("UPDATE inbox_budget SET alert_state = ?, last_alert = ? WHERE id = 1").run(state, JSON.stringify(alert));
        console.warn(`[qop-inbox-capacity] ${JSON.stringify(alert)}`);
        value.lastAlert = alert;
      }
    }
    value.state = level;
    return value;
  }
}
