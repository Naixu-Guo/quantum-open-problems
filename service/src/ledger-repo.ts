/**
 * The ledger on disk: two roots (main and activity), each a git working tree or a directory
 * inside one. The service is the only writer. A write lands as files, is validated with the
 * contract validator, and is committed or rolled back as a unit. No path derived from a batch
 * may leave its root, no exception may leave a file behind, and no commit may carry anything
 * but the batch.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { validateLedger, validateRecordShape, expectedRelPath, type Issue } from "../../contract/src/validate.ts";
import { Ledger, type LoadedRecord } from "../../contract/src/ledger.ts";
import { serializeRecord } from "../../contract/src/record.ts";
import type { RecordType } from "../../contract/src/targets.ts";

const ACTIVITY_TYPES: ReadonlySet<RecordType> = new Set(["Trajectory", "Artifact", "Comment"]);
const GIT_MAX_BUFFER = 1024 * 1024 * 1024;

export interface NewRecord {
  fields: Record<string, unknown>;
  body: string;
}

export interface WriteResult {
  ok: boolean;
  issues: Issue[];
  paths: string[];
  commit: string | null;
}

export interface CommitAuthor {
  name: string;
  email: string;
}

const failure = (category: Issue["category"], relPath: string, message: string): WriteResult => ({ ok: false, issues: [{ category, path: relPath, message }], paths: [], commit: null });

export class LedgerRepo {
  readonly mainRoot: string;
  readonly activityRoot: string;
  readonly schemaDir: string;
  readonly policyDir: string;
  readonly commitEnabled: boolean;
  private ledger: Ledger;

  constructor(options: { mainRoot: string; activityRoot: string; contractDir: string; commit: boolean }) {
    // Real paths: git reports resolved paths, and sequence numbers are keyed by path.
    this.mainRoot = fs.realpathSync(options.mainRoot);
    this.activityRoot = fs.realpathSync(options.activityRoot);
    this.schemaDir = path.join(options.contractDir, "schema");
    this.policyDir = path.join(options.contractDir, "policy");
    this.commitEnabled = options.commit;
    this.ledger = this.reload();
  }

  get roots(): string[] {
    return [this.mainRoot, this.activityRoot];
  }

  current(): Ledger {
    return this.ledger;
  }

  /** Re-read every file. Throws if the ledger on disk is invalid: the service refuses to serve a broken ledger. */
  reload(): Ledger {
    const report = validateLedger(this.roots, this.schemaDir, this.policyDir);
    if (report.issues.length > 0) {
      const first = report.issues.slice(0, 5).map((issue) => `[${issue.category}] ${issue.path}: ${issue.message}`).join("\n");
      throw new Error(`ledger is invalid (${report.issues.length} issue(s)):\n${first}`);
    }
    this.ledger = report.ledger;
    return this.ledger;
  }

  validate(): Issue[] {
    return validateLedger(this.roots, this.schemaDir, this.policyDir).issues;
  }

  rootFor(type: RecordType): string {
    return ACTIVITY_TYPES.has(type) ? this.activityRoot : this.mainRoot;
  }

  /**
   * Where a not-yet-written record belongs, computed against the current ledger plus the batch.
   * Every record is schema-checked first, so the path is derived only from well-formed fields,
   * and the resolved path must stay inside its root.
   */
  private place(batch: NewRecord[]): { placed: { record: LoadedRecord; file: string }[] } | WriteResult {
    for (const item of batch) {
      const shape = validateRecordShape({ ...item.fields, body: item.body }, this.schemaDir);
      if (shape.length > 0) return failure("schema", String(item.fields["id"] ?? "?"), shape.join("; "));
    }
    const staged: LoadedRecord[] = batch.map((item) => {
      const type = item.fields["type"] as RecordType;
      return { root: this.rootFor(type), relPath: "", path: "", type, id: String(item.fields["id"]), redacted: false, fields: item.fields, body: item.body };
    });
    const combined = new Ledger([...this.ledger.records, ...staged]);
    const placed: { record: LoadedRecord; file: string }[] = [];
    for (const record of staged) {
      const rel = expectedRelPath(record, combined);
      if (!rel) return failure("layout", record.id, `cannot place ${record.type} ${record.id}: an owner it names is missing`);
      const file = path.resolve(record.root, rel);
      if (!file.startsWith(`${record.root}${path.sep}`)) return failure("layout", rel, "the record's path leaves the ledger root");
      if (fs.existsSync(file)) return failure("identity", rel, "a record already exists at this path");
      placed.push({ record, file });
    }
    return { placed };
  }

  /**
   * Write a batch of new records, validate the whole ledger, and commit. On any failure the
   * files are removed again and the issues are returned; nothing is committed. Exceptions from
   * validation or git are turned into issues, never left as files on disk.
   */
  write(batch: NewRecord[], message: string, author: CommitAuthor): WriteResult {
    const placement = this.place(batch);
    if ("ok" in placement) return placement;
    const written: string[] = [];
    try {
      for (const { record, file } of placement.placed) {
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, serializeRecord(record.fields, record.body));
        written.push(file);
      }
      let issues: Issue[];
      try {
        issues = this.validate();
      } catch (error) {
        issues = [{ category: "schema", path: written[0] ?? "?", message: `validation failed: ${error instanceof Error ? error.message : String(error)}` }];
      }
      if (issues.length > 0) {
        this.remove(written);
        return { ok: false, issues, paths: [], commit: null };
      }
      let commit: string | null = null;
      if (this.commitEnabled) {
        try {
          commit = this.commit(written, message, author);
        } catch (error) {
          this.remove(written);
          return failure("commit", written[0] ?? "?", error instanceof Error ? error.message : String(error));
        }
      }
      this.ledger = this.reload();
      return { ok: true, issues: [], paths: written, commit };
    } catch (error) {
      this.remove(written);
      return failure("commit", written[0] ?? "?", error instanceof Error ? error.message : String(error));
    }
  }

  private remove(files: string[]): void {
    for (const file of files) {
      this.tryGit(path.dirname(file), ["restore", "--staged", "--", file]);
      fs.rmSync(file, { force: true });
      let dir = path.dirname(file);
      while (this.roots.every((root) => dir !== root) && this.roots.some((root) => dir.startsWith(`${root}${path.sep}`)) && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
        dir = path.dirname(dir);
      }
    }
  }

  private git(cwd: string, args: string[]): string {
    const result = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: GIT_MAX_BUFFER });
    if (result.error) throw new Error(`git ${args[0]} failed in ${cwd}: ${result.error.message}`);
    if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.stderr.trim() || `exit ${String(result.status)}`}`);
    return result.stdout.trim();
  }

  private tryGit(cwd: string, args: string[]): string | null {
    try {
      return this.git(cwd, args);
    } catch {
      return null;
    }
  }

  /**
   * Commit exactly the batch, repository by repository. `git commit --only` leaves whatever else
   * a developer has staged untouched. If a later repository fails, the earlier commits made by
   * this write are undone so the batch stays atomic across the two roots.
   */
  private commit(files: string[], message: string, author: CommitAuthor): string {
    const byRepo = new Map<string, string[]>();
    for (const file of files) {
      const top = this.git(path.dirname(file), ["rev-parse", "--show-toplevel"]);
      const list = byRepo.get(top) ?? [];
      list.push(file);
      byRepo.set(top, list);
    }
    const done: { top: string; previous: string | null; files: string[] }[] = [];
    let last = "";
    try {
      for (const [top, list] of byRepo) {
        const previous = this.tryGit(top, ["rev-parse", "--verify", "-q", "HEAD"]);
        this.git(top, ["add", "--", ...list]);
        this.git(top, ["-c", `user.name=${author.name}`, "-c", `user.email=${author.email}`, "commit", "-q", "--only", "-m", message, "--", ...list]);
        done.push({ top, previous, files: list });
        last = this.git(top, ["rev-parse", "HEAD"]);
      }
      return last;
    } catch (error) {
      for (const { top, previous, files: list } of done.reverse()) {
        if (previous) this.tryGit(top, ["reset", "-q", "--soft", previous]);
        this.tryGit(top, ["restore", "--staged", "--", ...list]);
      }
      throw error;
    }
  }

  /**
   * Sequence numbers: the first-parent commit order of the repository that holds each root,
   * ties within a commit broken by path; records not yet committed come last, by path. A root
   * that is not a git working tree, or a repository with no commits yet, contributes no order.
   */
  sequences(): Map<string, number> {
    const order = new Map<string, number>();
    let next = 1;
    const recordPaths = new Set(this.ledger.records.map((record) => record.path));
    const tops = new Set<string>();
    for (const root of this.roots) {
      const top = this.tryGit(root, ["rev-parse", "--show-toplevel"]);
      if (top && this.tryGit(top, ["rev-parse", "--verify", "-q", "HEAD"])) tops.add(top);
    }
    for (const top of tops) {
      const log = this.tryGit(top, ["log", "--first-parent", "--reverse", "--name-only", "--format=%x1e%H"]) ?? "";
      for (const chunk of log.split("\x1e").slice(1)) {
        const files = chunk.split("\n").slice(1).filter(Boolean).sort();
        for (const file of files) {
          const absolute = path.join(top, file);
          if (recordPaths.has(absolute) && !order.has(absolute)) order.set(absolute, next++);
        }
      }
    }
    const result = new Map<string, number>();
    const uncommitted = [...this.ledger.records].filter((record) => !order.has(record.path)).sort((a, b) => a.path.localeCompare(b.path));
    for (const record of this.ledger.records) {
      const sequence = order.get(record.path);
      if (sequence !== undefined) result.set(record.path, sequence);
    }
    for (const record of uncommitted) result.set(record.path, next++);
    return result;
  }
}
