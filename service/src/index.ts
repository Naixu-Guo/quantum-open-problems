/**
 * The SQLite index: disposable, rebuilt from the ledger. Holds one row per record revision with
 * its sequence, plus derived tables the API queries. Nothing here is a source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import type { Ledger } from "../../contract/src/ledger.ts";
import { revisionOf } from "../../contract/src/ledger.ts";
import { summarizeProblems, contributionState, verificationLevel, statementIsCurrent, currentDecisions, lastActivity, lastHumanReview } from "../../contract/src/derive.ts";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS records (
  id TEXT NOT NULL,
  revision INTEGER NOT NULL,
  type TEXT NOT NULL,
  path TEXT NOT NULL,
  sequence INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  created_by TEXT NOT NULL,
  redacted INTEGER NOT NULL DEFAULT 0,
  header TEXT NOT NULL,
  body TEXT NOT NULL,
  PRIMARY KEY (id, revision)
);
CREATE INDEX IF NOT EXISTS records_sequence ON records(sequence);
CREATE INDEX IF NOT EXISTS records_type ON records(type, sequence);
CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  alias TEXT NOT NULL,
  title TEXT NOT NULL,
  role TEXT NOT NULL,
  parent_id TEXT,
  catalog_state TEXT NOT NULL,
  status TEXT NOT NULL,
  indexed INTEGER NOT NULL,
  area_ids TEXT NOT NULL,
  topic_ids TEXT NOT NULL,
  keywords TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  last_activity TEXT,
  last_human_review TEXT,
  search_text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS clauses (
  statement_id TEXT NOT NULL,
  clause_id TEXT NOT NULL,
  problem_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  label TEXT NOT NULL,
  status TEXT NOT NULL,
  PRIMARY KEY (statement_id, clause_id)
);
CREATE TABLE IF NOT EXISTS contributions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  problem_id TEXT,
  state TEXT NOT NULL,
  verification_level TEXT NOT NULL,
  statement_is_current INTEGER,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
`;

export interface ProblemRow {
  id: string;
  alias: string;
  title: string;
  role: string;
  parent_id: string | null;
  catalog_state: string;
  status: string;
  indexed: number;
  area_ids: string;
  topic_ids: string;
  keywords: string;
  difficulty: string;
  last_activity: string | null;
  last_human_review: string | null;
}

export class Index {
  readonly db: DatabaseSync;

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec(SCHEMA);
  }

  /** Drop every derived row and rebuild from the ledger. */
  rebuild(ledger: Ledger, sequences: Map<string, number>): { records: number; lastSequence: number } {
    const db = this.db;
    db.exec("BEGIN");
    try {
      for (const table of ["records", "problems", "clauses", "contributions"]) db.exec(`DELETE FROM ${table}`);
      const insertRecord = db.prepare(
        "INSERT INTO records (id, revision, type, path, sequence, created_at, created_by, redacted, header, body) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      );
      let last = 0;
      for (const record of ledger.records) {
        const sequence = sequences.get(record.path) ?? 0;
        last = Math.max(last, sequence);
        insertRecord.run(
          record.id, revisionOf(record), record.type, record.relPath, sequence,
          String(record.fields["createdAt"] ?? ""), String(record.fields["createdBy"] ?? ""),
          record.redacted ? 1 : 0, JSON.stringify(record.fields), record.body,
        );
      }

      const decisions = currentDecisions(ledger);
      const insertProblem = db.prepare(
        "INSERT INTO problems (id, alias, title, role, parent_id, catalog_state, status, indexed, area_ids, topic_ids, keywords, difficulty, last_activity, last_human_review, search_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      );
      const insertClause = db.prepare("INSERT INTO clauses (statement_id, clause_id, problem_id, kind, label, status) VALUES (?, ?, ?, ?, ?, ?)");
      for (const summary of summarizeProblems(ledger)) {
        const problem = ledger.find("Problem", summary.id);
        if (!problem) continue;
        const keywords = problem.fields["keywords"] as string[];
        const searchText = [summary.title, ...keywords, ...(problem.fields["aliases"] as string[]), problem.body].join(" ").toLowerCase();
        insertProblem.run(
          summary.id, summary.alias, summary.title, summary.role, (problem.fields["parentProblemId"] as string | null),
          summary.catalogState, summary.status, summary.indexed ? 1 : 0,
          JSON.stringify(problem.fields["areaIds"]), JSON.stringify(problem.fields["topicIds"]), JSON.stringify(keywords),
          String(problem.fields["difficulty"]), lastActivity(ledger, summary.id, decisions), lastHumanReview(ledger, summary.id, decisions), searchText,
        );
        for (const clause of summary.clauses) {
          const [statementId, clauseId] = clause.ref.split("#") as [string, string];
          const found = ledger.clause(clause.ref);
          insertClause.run(statementId, clauseId, summary.id, found?.clause.kind ?? "decision", found?.clause.label ?? clauseId, clause.status);
        }
      }

      const insertContribution = db.prepare(
        "INSERT INTO contributions (id, kind, actor_id, problem_id, state, verification_level, statement_is_current, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      );
      for (const contribution of ledger.currentOf("Contribution")) {
        const problemIds = contribution.fields["problemIds"] as string[];
        const newProblemIds = contribution.fields["newProblemIds"] as string[];
        const current = statementIsCurrent(ledger, contribution.id);
        insertContribution.run(
          contribution.id, String(contribution.fields["kind"]), String(contribution.fields["actorId"]),
          problemIds[0] ?? newProblemIds[0] ?? null, contributionState(ledger, contribution.id, decisions),
          verificationLevel(ledger, contribution.id, decisions), current === null ? null : current ? 1 : 0,
          String(contribution.fields["createdAt"]),
        );
      }
      db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('lastSequence', ?)").run(String(last));
      db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('rebuiltAt', ?)").run(new Date().toISOString());
      db.exec("COMMIT");
      return { records: ledger.records.length, lastSequence: last };
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  }

  lastSequence(): number {
    const row = this.db.prepare("SELECT value FROM meta WHERE key = 'lastSequence'").get() as { value: string } | undefined;
    return row ? Number(row.value) : 0;
  }

  problemRows(filter: { status?: string; area?: string; topic?: string; difficulty?: string; text?: string; indexedOnly?: boolean; limit?: number; sort?: "title" | "stale" }): ProblemRow[] {
    const clauses: string[] = [];
    const params: (string | number)[] = [];
    if (filter.indexedOnly !== false) clauses.push("indexed = 1");
    if (filter.status) { clauses.push("status = ?"); params.push(filter.status); }
    if (filter.area) { clauses.push("area_ids LIKE ?"); params.push(`%"${filter.area}"%`); }
    if (filter.topic) { clauses.push("topic_ids LIKE ?"); params.push(`%"${filter.topic}"%`); }
    if (filter.difficulty) { clauses.push("difficulty = ?"); params.push(filter.difficulty); }
    if (filter.text) {
      const terms = filter.text.toLowerCase().split(/\s+/u).filter(Boolean).slice(0, 8);
      for (const term of terms) { clauses.push("search_text LIKE ? ESCAPE '\\'"); params.push(`%${term.replace(/[\\%_]/gu, (c) => `\\${c}`)}%`); }
    }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const limit = Math.min(Math.max(filter.limit ?? 50, 1), 1000);
    // "stale" is the maintenance backlog: never looked at by a human first, then oldest human review first.
    const order = filter.sort === "stale" ? "ORDER BY last_human_review IS NOT NULL, last_human_review, title" : "ORDER BY title";
    return this.db.prepare(`SELECT * FROM problems ${where} ${order} LIMIT ${limit}`).all(...params) as unknown as ProblemRow[];
  }

  recordsAfter(after: number, limit: number, type?: string): { id: string; revision: number; type: string; path: string; sequence: number; created_at: string; created_by: string }[] {
    const params: (string | number)[] = [after];
    let typeClause = "";
    if (type) { typeClause = "AND type = ?"; params.push(type); }
    params.push(Math.min(Math.max(limit, 1), 500));
    return this.db.prepare(`SELECT id, revision, type, path, sequence, created_at, created_by FROM records WHERE sequence > ? ${typeClause} ORDER BY sequence LIMIT ?`).all(...params) as never;
  }

  counts(): Record<string, number> {
    const rows = this.db.prepare("SELECT type, COUNT(*) AS n FROM records GROUP BY type").all() as { type: string; n: number }[];
    return Object.fromEntries(rows.map((row) => [row.type, row.n]));
  }

  close(): void {
    this.db.close();
  }
}
