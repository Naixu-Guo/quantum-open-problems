/**
 * Loads a ledger tree into records and answers lookups by id.
 * A ledger may span several roots: the main repository and activity repositories.
 */
import fs from "node:fs";
import path from "node:path";
import { parseRecordText } from "./record.ts";
import { RECORD_TYPES, REVISABLE_TYPES, parseClauseRef, type RecordType } from "./targets.ts";
import type { Statement, Clause } from "./types/statement.ts";

export interface LoadedRecord {
  root: string;
  relPath: string;
  path: string;
  type: RecordType;
  id: string;
  redacted: boolean;
  fields: Record<string, unknown>;
  body: string;
}

export interface LoadIssue {
  path: string;
  message: string;
}

const RECORD_TYPE_SET = new Set<string>(RECORD_TYPES);

function walk(directory: string, out: string[]): void {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "artifact-store") continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") out.push(full);
  }
}

export function loadRecords(roots: string[]): { records: LoadedRecord[]; issues: LoadIssue[] } {
  const records: LoadedRecord[] = [];
  const issues: LoadIssue[] = [];
  for (const root of roots) {
    const files: string[] = [];
    walk(root, files);
    for (const file of files.sort()) {
      const relPath = path.relative(root, file).split(path.sep).join("/");
      try {
        const parsed = parseRecordText(relPath, fs.readFileSync(file, "utf8"));
        const type = parsed.fields["type"];
        const id = parsed.fields["id"];
        if (typeof type !== "string" || !RECORD_TYPE_SET.has(type)) {
          issues.push({ path: relPath, message: `unknown record type ${String(type)}` });
          continue;
        }
        if (typeof id !== "string") {
          issues.push({ path: relPath, message: "record has no id" });
          continue;
        }
        records.push({
          root,
          relPath,
          path: file,
          type: type as RecordType,
          id,
          redacted: parsed.fields["redacted"] === true,
          fields: parsed.fields,
          body: parsed.body,
        });
      } catch (error) {
        issues.push({ path: relPath, message: error instanceof Error ? error.message : String(error) });
      }
    }
  }
  return { records, issues };
}

export class Ledger {
  readonly records: LoadedRecord[];
  readonly byType: Map<RecordType, LoadedRecord[]>;
  /** id → current revision for revisable types, the single record for immutable types. */
  readonly current: Map<string, LoadedRecord>;
  /** id → every revision, ascending. */
  readonly revisions: Map<string, LoadedRecord[]>;

  constructor(records: LoadedRecord[]) {
    this.records = records;
    this.byType = new Map();
    this.current = new Map();
    this.revisions = new Map();
    for (const type of RECORD_TYPES) this.byType.set(type, []);
    for (const record of records) {
      this.byType.get(record.type)?.push(record);
      const list = this.revisions.get(record.id) ?? [];
      list.push(record);
      this.revisions.set(record.id, list);
    }
    for (const [id, list] of this.revisions) {
      list.sort((a, b) => revisionOf(a) - revisionOf(b));
      const last = list[list.length - 1];
      if (last) this.current.set(id, last);
    }
  }

  find(type: RecordType, id: string): LoadedRecord | undefined {
    const record = this.current.get(id);
    return record && record.type === type && !record.redacted ? record : undefined;
  }

  /** Like find, but a redacted record still resolves: references to tombstones are valid. */
  findAny(type: RecordType, id: string): LoadedRecord | undefined {
    const record = this.current.get(id);
    return record && record.type === type ? record : undefined;
  }

  /** Whether a clause reference resolves, counting a redacted statement as resolving. */
  clauseResolves(clauseRef: string): boolean {
    const parts = parseClauseRef(clauseRef);
    if (!parts) return false;
    const statement = this.findAny("Statement", parts.statementId);
    if (!statement) return false;
    return statement.redacted || this.clause(clauseRef) !== undefined;
  }

  /** Current, non-redacted records of one type. */
  currentOf(type: RecordType): LoadedRecord[] {
    return [...this.current.values()].filter((record) => record.type === type && !record.redacted);
  }

  clause(clauseRef: string): { statement: Statement; clause: Clause } | undefined {
    const parts = parseClauseRef(clauseRef);
    if (!parts) return undefined;
    const record = this.find("Statement", parts.statementId);
    if (!record) return undefined;
    const statement = record.fields as unknown as Statement;
    const clause = statement.clauses.find((candidate) => candidate.id === parts.clauseId);
    return clause ? { statement, clause } : undefined;
  }

  /** The directory of a problem relative to the ledger root, following the auxiliary chain. */
  problemDir(problemId: string, seen: Set<string> = new Set()): string | undefined {
    if (seen.has(problemId)) return undefined;
    seen.add(problemId);
    const record = this.find("Problem", problemId);
    if (!record) return undefined;
    const aliases = record.fields["aliases"];
    const slug = Array.isArray(aliases) ? aliases[0] : undefined;
    if (typeof slug !== "string") return undefined;
    const parentId = record.fields["parentProblemId"];
    if (typeof parentId === "string") {
      const parentDir = this.problemDir(parentId, seen);
      return parentDir ? `${parentDir}/auxiliary/${slug}` : undefined;
    }
    return `problems/${slug}`;
  }
}

export function revisionOf(record: LoadedRecord): number {
  const revision = record.fields["revision"];
  return typeof revision === "number" ? revision : 1;
}

export function isRevisable(type: RecordType): boolean {
  return REVISABLE_TYPES.has(type);
}
