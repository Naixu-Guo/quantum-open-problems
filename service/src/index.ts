/**
 * The SQLite index: disposable, rebuilt from the ledger. Holds one row per record revision with
 * its sequence, plus derived tables the API queries. Nothing here is a source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import type { Ledger, LoadedRecord } from "../../contract/src/ledger.ts";
import { revisionOf } from "../../contract/src/ledger.ts";
import { summarizeProblems, contributionState, verificationLevel, statementIsCurrent, currentDecisions, lastActivity, lastHumanReview } from "../../contract/src/derive.ts";
import type { Statement } from "../../contract/src/types/statement.ts";
import type { Taxonomy } from "../../contract/src/types/taxonomy.ts";
import { normalizeSearch, searchMatch, SearchError, type SearchDocument, type SearchMatch } from "./search.ts";
export { SearchError } from "./search.ts";

type CatalogDates = Map<string, { createdAt: string; updatedAt: string; basis: "tex-git-history" }>;

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
  search_text TEXT NOT NULL,
  search_document TEXT NOT NULL DEFAULT '{}',
  edited_at TEXT,
  created_at TEXT
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
  edited_at: string | null;
  created_at: string | null;
  match?: SearchMatch;
}

export interface ProblemFilter {
  status?: string; area?: string; topic?: string; difficulty?: string; text?: string;
  indexedOnly?: boolean; limit?: number; offset?: number; cursor?: string;
  sort?: "title" | "stale" | "relevance" | "edited";
  /** Projection is cursor-scoped; summary keeps the original cursor contract. */
  view?: "summary" | "research";
}

export interface ProblemPage {
  rows: ProblemRow[]; total: number; limit: number; offset: number;
  nextOffset: number | null; catalogVersion: string; nextCursor: string | null;
}

interface SearchRow extends ProblemRow { search_document: string; search_text: string }
interface Cursor { version: string; scope: string; offset: number; expiresAt: number }
const CURSOR_TTL = 60 * 60 * 1000;

export class Index {
  readonly db: DatabaseSync;
  private readonly pageContexts = new WeakMap<ProblemPage, { scope: string; expiresAt: number }>();

  constructor(dbPath: string) {
    if (dbPath !== ":memory:") fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    this.db = new DatabaseSync(dbPath);
    this.db.exec("PRAGMA journal_mode = WAL");
    this.db.exec(SCHEMA);
    const columns = new Set((this.db.prepare("PRAGMA table_info(problems)").all() as { name: string }[]).map((row) => row.name));
    for (const [column, definition] of [["search_document", "TEXT NOT NULL DEFAULT '{}'"], ["edited_at", "TEXT"], ["created_at", "TEXT"]]) {
      if (!columns.has(column!)) this.db.exec(`ALTER TABLE problems ADD COLUMN ${column} ${definition}`);
    }
    this.db.prepare("INSERT OR IGNORE INTO meta (key, value) VALUES ('cursorSecret', ?)").run(randomBytes(32).toString("hex"));
  }

  /** Drop every derived row and rebuild from the ledger. */
  rebuild(ledger: Ledger, sequences: Map<string, number>, catalogDates?: CatalogDates): { records: number; lastSequence: number } {
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
      // Match the current statement used by the read models. Superseded text must
      // not make a problem appear to ask a question it no longer contains.
      const statements = new Map<string, LoadedRecord>();
      for (const record of ledger.currentOf("Statement")) {
        const statement = record.fields as unknown as Statement;
        const previous = statements.get(statement.problemId);
        if (!previous || statement.version > Number(previous.fields["version"])) statements.set(statement.problemId, record);
      }
      const taxonomy = ledger.currentOf("Taxonomy")[0]?.fields as unknown as Taxonomy | undefined;
      const areaLabels = new Map(taxonomy?.areas.map((area) => [area.id, area.label]));
      const topicLabels = new Map(taxonomy?.topics.map((topic) => [topic.id, topic.label]));
      const insertProblem = db.prepare(
        "INSERT INTO problems (id, alias, title, role, parent_id, catalog_state, status, indexed, area_ids, topic_ids, keywords, difficulty, last_activity, last_human_review, search_text, search_document, edited_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      );
      const insertClause = db.prepare("INSERT INTO clauses (statement_id, clause_id, problem_id, kind, label, status) VALUES (?, ?, ?, ?, ?, ?)");
      for (const summary of summarizeProblems(ledger)) {
        const problem = ledger.find("Problem", summary.id);
        if (!problem) continue;
        const keywords = problem.fields["keywords"] as string[];
        const statement = statements.get(summary.id);
        const statementFields = statement?.fields as unknown as Statement | undefined;
        const authored = (problem.fields["authoredCatalog"] as { record?: { id?: unknown; progress?: unknown } } | undefined)?.record;
        const progress = Array.isArray(authored?.progress) ? authored.progress.filter((value): value is string => typeof value === "string").join("\n\n") : undefined;
        const document: SearchDocument = {
          title: summary.title,
          stableId: typeof authored?.id === "string" && authored.id ? authored.id : problem.id,
          keywords: keywords.join(" "),
          aliases: [problem.id, ...(problem.fields["aliases"] as string[])],
          body: problem.body,
          progress: progress ?? problem.body.match(/(?:^|\n)## Progress\s*\n([\s\S]*?)(?=\n## |$)/u)?.[1] ?? "",
          taxonomy: [
            ...(problem.fields["areaIds"] as string[]).map((id) => areaLabels.get(id) ?? id),
            ...(problem.fields["topicIds"] as string[]).map((id) => topicLabels.get(id) ?? id),
          ].join(" "),
          statement: [statement?.body ?? "", ...(statementFields?.clauses ?? []).flatMap((clause) => [
            clause.label, clause.text, clause.resolutionCriteria,
            clause.quantity?.name ?? "", clause.quantity?.symbol ?? "",
          ])].join(" "),
        };
        const searchText = [document.title, document.keywords, document.body, document.taxonomy, document.statement, document.progress].join(" ").toLowerCase();
        // Only authoritative TeX git history supplies catalog edit/creation dates.
        // Migration createdAt and service review timestamps have different meanings.
        const dates = catalogDates?.get(problem.id);
        insertProblem.run(
          summary.id, summary.alias, summary.title, summary.role, (problem.fields["parentProblemId"] as string | null),
          summary.catalogState, summary.status, summary.indexed ? 1 : 0,
          JSON.stringify(problem.fields["areaIds"]), JSON.stringify(problem.fields["topicIds"]), JSON.stringify(keywords),
          String(problem.fields["difficulty"]), lastActivity(ledger, summary.id, decisions), lastHumanReview(ledger, summary.id, decisions), searchText,
          JSON.stringify(document), dates?.updatedAt ?? null, dates?.createdAt ?? null,
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
      const version = createHash("sha256").update("qop-search/2:authored-order\0").update(JSON.stringify(
        ledger.records.map((record) => [record.type, record.id, revisionOf(record), record.fields, record.body, record.redacted ?? false])
          .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))),
      )).update(JSON.stringify([...(catalogDates ?? new Map())].sort(([a], [b]) => a.localeCompare(b)))).digest("hex");
      db.prepare("INSERT OR REPLACE INTO meta (key, value) VALUES ('catalogVersion', ?)").run(version);
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

  problemRows(filter: ProblemFilter): ProblemRow[] {
    return this.problemPage(filter).rows;
  }

  catalogVersion(): string {
    return (this.db.prepare("SELECT value FROM meta WHERE key = 'catalogVersion'").get() as { value: string } | undefined)?.value ?? "unbuilt";
  }

  private queryScope(filter: ProblemFilter): string {
    // Lexical variants may share a cursor only when exact alias matches (which get
    // a separate rank boost) are also identical. Otherwise "qma2" as an authored
    // alias and "QMA(2)" as prose can legitimately select/order different records.
    const query = filter.text?.trim().toLowerCase() ?? "";
    const exactAliasIds = query ? (this.db.prepare("SELECT id, alias, search_document FROM problems").all() as { id: string; alias: string; search_document: string }[])
      .filter((row) => [row.id, row.alias, ...((JSON.parse(row.search_document) as Partial<SearchDocument>).aliases ?? [])].some((alias) => alias.toLowerCase() === query))
      .map((row) => row.id).sort() : [];
    return createHash("sha256").update(JSON.stringify({
      text: normalizeSearch(filter.text ?? ""), status: filter.status ?? null, area: filter.area ?? null,
      topic: filter.topic ?? null, difficulty: filter.difficulty ?? null, indexedOnly: filter.indexedOnly !== false,
      sort: filter.sort ?? (normalizeSearch(filter.text ?? "") ? "relevance" : "edited"),
      exactAliasIds,
      ...(filter.view === "research" ? { view: "research" } : {}),
    })).digest("hex");
  }

  private cursorSignature(body: string): Buffer {
    const secret = (this.db.prepare("SELECT value FROM meta WHERE key = 'cursorSecret'").get() as { value: string }).value;
    return createHmac("sha256", secret).update(body).digest();
  }

  private encodeCursor(cursor: Cursor): string {
    const body = Buffer.from(JSON.stringify(cursor)).toString("base64url");
    return `${body}.${this.cursorSignature(body).toString("base64url")}`;
  }

  private decodeCursor(value: string, filter: ProblemFilter): Cursor {
    const invalid = () => new SearchError(400, "invalid_cursor", "Invalid search cursor; restart the search without a cursor.");
    if (value.length > 2048 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(value)) throw invalid();
    const [body, signature] = value.split(".") as [string, string];
    const received = Buffer.from(signature, "base64url");
    const expected = this.cursorSignature(body);
    if (received.toString("base64url") !== signature || received.length !== expected.length || !timingSafeEqual(received, expected)) throw invalid();
    let cursor: Cursor;
    try { cursor = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Cursor; } catch { throw invalid(); }
    if (!cursor || typeof cursor.version !== "string" || typeof cursor.scope !== "string" || !Number.isSafeInteger(cursor.offset) || cursor.offset < 0 || !Number.isSafeInteger(cursor.expiresAt)) throw invalid();
    if (cursor.expiresAt <= Date.now()) throw new SearchError(410, "cursor_expired", "Search cursor expired; restart the search without a cursor.");
    if (cursor.version !== this.catalogVersion()) throw new SearchError(409, "catalog_changed", "Catalog changed between pages; restart the search without a cursor.");
    if (cursor.scope !== this.queryScope(filter)) throw new SearchError(400, "cursor_query_mismatch", "Search cursor belongs to different filters or sorting; restart the search without a cursor.");
    return cursor;
  }

  private matchingRows(filter: ProblemFilter): ProblemRow[] {
    if ((filter.text?.length ?? 0) > 2048 || normalizeSearch(filter.text ?? "").split(" ").length > 32) {
      throw new SearchError(400, "invalid_search", "Search supports at most 2048 characters and 32 words.");
    }
    const clauses: string[] = ["catalog_state IN ('published', 'candidate')"];
    const params: (string | number)[] = [];
    if (filter.indexedOnly !== false) clauses.push("indexed = 1");
    if (filter.status) { clauses.push("status = ?"); params.push(filter.status); }
    if (filter.area) { clauses.push("EXISTS (SELECT 1 FROM json_each(area_ids) WHERE value = ?)"); params.push(filter.area); }
    if (filter.topic) { clauses.push("EXISTS (SELECT 1 FROM json_each(topic_ids) WHERE value = ?)"); params.push(filter.topic); }
    if (filter.difficulty) { clauses.push("difficulty = ?"); params.push(filter.difficulty); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const query = filter.text?.trim() ?? "";
    const rows: ProblemRow[] = [];
    const stableIds = new Map<string, string>();
    for (const { search_document, search_text, ...row } of this.db.prepare(`SELECT * FROM problems ${where}`).all(...params) as unknown as SearchRow[]) {
      const parsed = JSON.parse(search_document) as Partial<SearchDocument>;
      stableIds.set(row.id, typeof parsed.stableId === "string" && parsed.stableId ? parsed.stableId : row.id);
      if (!query) { rows.push(row); continue; }
      const document: SearchDocument = { title: row.title, stableId: row.id, statement: "", progress: "", body: "", taxonomy: "", keywords: "", aliases: [row.id, row.alias], ...parsed };
      const match = searchMatch(document, query);
      if (match) rows.push({ ...row, match });
    }
    const sort = filter.sort ?? (query ? "relevance" : "edited");
    const descendingDate = (a: string | null, b: string | null) => a === b ? 0 : a === null ? 1 : b === null ? -1 : b.localeCompare(a);
    const tie = (a: ProblemRow, b: ProblemRow) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
    rows.sort((a, b) => {
      if (sort === "stale") return (a.last_human_review === null ? (b.last_human_review === null ? 0 : -1) : b.last_human_review === null ? 1 : a.last_human_review.localeCompare(b.last_human_review)) || tie(a, b);
      if (sort === "edited") return descendingDate(a.edited_at, b.edited_at) || descendingDate(a.created_at, b.created_at) || stableIds.get(a.id)!.localeCompare(stableIds.get(b.id)!, "en") || a.id.localeCompare(b.id);
      if (sort === "relevance") return ((b.match?.score ?? 0) - (a.match?.score ?? 0)) || tie(a, b);
      return tie(a, b);
    });
    return rows;
  }

  problemPage(filter: ProblemFilter): ProblemPage {
    if (filter.cursor && (filter.offset ?? 0) !== 0) throw new SearchError(400, "invalid_cursor", "Use either cursor or offset, not both.");
    const cursor = filter.cursor ? this.decodeCursor(filter.cursor, filter) : null;
    const matches = this.matchingRows(filter);
    const limit = Math.min(Math.max(filter.limit ?? 50, 1), 1000);
    const offset = cursor?.offset ?? Math.max(filter.offset ?? 0, 0);
    const rows = matches.slice(offset, offset + limit);
    const total = matches.length;
    const nextOffset = offset + rows.length < total ? offset + rows.length : null;
    const catalogVersion = this.catalogVersion();
    const context = { scope: this.queryScope(filter), expiresAt: cursor?.expiresAt ?? Date.now() + CURSOR_TTL };
    const nextCursor = nextOffset === null ? null : this.encodeCursor({ version: catalogVersion, ...context, offset: nextOffset });
    const page = { rows, total, limit, offset, nextOffset, catalogVersion, nextCursor };
    this.pageContexts.set(page, context);
    return page;
  }

  /** Re-sign a shorter, whole-record prefix without querying again or renewing the cursor TTL. */
  prefixProblemPage(page: ProblemPage, count: number): ProblemPage {
    const context = this.pageContexts.get(page);
    if (!context || !Number.isSafeInteger(count) || count < 0 || count > page.rows.length) {
      throw new SearchError(400, "invalid_search", "A page prefix must belong to this index and contain a valid number of rows.");
    }
    if (page.catalogVersion !== this.catalogVersion()) throw new SearchError(409, "catalog_changed", "Catalog changed while preparing the page; restart the search without a cursor.");
    if (context.expiresAt <= Date.now()) throw new SearchError(410, "cursor_expired", "Search cursor expired; restart the search without a cursor.");
    const nextOffset = page.offset + count < page.total ? page.offset + count : null;
    const nextCursor = nextOffset === null ? null : this.encodeCursor({ version: page.catalogVersion, ...context, offset: nextOffset });
    const prefix = { ...page, rows: page.rows.slice(0, count), nextOffset, nextCursor };
    this.pageContexts.set(prefix, context);
    return prefix;
  }

  /** A uniform draw from the entire filtered population, independent of page size. */
  sampleProblem(filter: ProblemFilter) {
    if (filter.cursor || (filter.offset ?? 0) !== 0) throw new SearchError(400, "invalid_search", "Sampling does not accept pagination; every matching problem is eligible.");
    const matches = this.matchingRows(filter);
    return { row: matches.length ? matches[randomInt(matches.length)]! : null, total: matches.length, catalogVersion: this.catalogVersion() };
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
