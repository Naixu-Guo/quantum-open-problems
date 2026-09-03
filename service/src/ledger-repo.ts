/**
 * The ledger on disk: two roots (main and activity), each a git working tree or a directory
 * inside one. The service is the only writer. A write lands as files, is validated with the
 * contract validator, and is committed or rolled back as a unit.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { validateLedger, expectedRelPath, type Issue } from "../../contract/src/validate.ts";
import { Ledger, loadRecords, type LoadedRecord } from "../../contract/src/ledger.ts";
import { serializeRecord } from "../../contract/src/record.ts";
import type { RecordType } from "../../contract/src/targets.ts";

const ACTIVITY_TYPES: ReadonlySet<RecordType> = new Set(["Trajectory", "Artifact", "Comment"]);

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

  /** Where a not-yet-written record belongs, computed against the current ledger plus the batch. */
  private placement(batch: NewRecord[]): { record: LoadedRecord; root: string; rel: string }[] {
    const staged: LoadedRecord[] = batch.map((item) => {
      const type = item.fields["type"] as RecordType;
      return {
        root: this.rootFor(type),
        relPath: "",
        path: "",
        type,
        id: String(item.fields["id"]),
        redacted: false,
        fields: item.fields,
        body: item.body,
      };
    });
    const combined = new Ledger([...this.ledger.records, ...staged]);
    return staged.map((record) => {
      const rel = expectedRelPath(record, combined);
      if (!rel) throw new Error(`cannot place ${record.type} ${record.id}: an owner it names is missing`);
      return { record, root: record.root, rel };
    });
  }

  /**
   * Write a batch of new records, validate the whole ledger, and commit. On any validation issue
   * the files are removed again and the issues are returned; nothing is committed.
   */
  write(batch: NewRecord[], message: string, author: CommitAuthor): WriteResult {
    const placed = this.placement(batch);
    const written: string[] = [];
    for (const { record, root, rel } of placed) {
      const file = path.join(root, rel);
      if (fs.existsSync(file)) {
        this.remove(written);
        return { ok: false, issues: [{ category: "identity", path: rel, message: "a record already exists at this path" }], paths: [], commit: null };
      }
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, serializeRecord(record.fields, record.body));
      written.push(file);
    }
    const issues = this.validate();
    if (issues.length > 0) {
      this.remove(written);
      return { ok: false, issues, paths: [], commit: null };
    }
    const commit = this.commitEnabled ? this.commit(written, message, author) : null;
    this.ledger = this.reload();
    return { ok: true, issues: [], paths: written, commit };
  }

  private remove(files: string[]): void {
    for (const file of files) {
      fs.rmSync(file, { force: true });
      let dir = path.dirname(file);
      while (dir !== this.mainRoot && dir !== this.activityRoot && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
        dir = path.dirname(dir);
      }
    }
  }

  private git(cwd: string, args: string[]): string {
    const result = spawnSync("git", args, { cwd, encoding: "utf8" });
    if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.stderr}`);
    return result.stdout.trim();
  }

  private commit(files: string[], message: string, author: CommitAuthor): string {
    const byRepo = new Map<string, string[]>();
    for (const file of files) {
      const top = this.git(path.dirname(file), ["rev-parse", "--show-toplevel"]);
      const list = byRepo.get(top) ?? [];
      list.push(file);
      byRepo.set(top, list);
    }
    let last = "";
    for (const [top, list] of byRepo) {
      this.git(top, ["add", "--", ...list]);
      this.git(top, ["-c", `user.name=${author.name}`, "-c", `user.email=${author.email}`, "commit", "-q", "-m", message]);
      last = this.git(top, ["rev-parse", "HEAD"]);
    }
    return last;
  }

  /**
   * Sequence numbers: the first-parent commit order of the repository that holds each root,
   * ties within a commit broken by path; records not yet committed come last, by path.
   */
  sequences(): Map<string, number> {
    const order = new Map<string, number>();
    let next = 1;
    const recordPaths = new Set(this.ledger.records.map((record) => record.path));
    const tops = new Set<string>();
    for (const root of this.roots) {
      try {
        tops.add(this.git(root, ["rev-parse", "--show-toplevel"]));
      } catch {
        // not a git working tree: every record counts as uncommitted
      }
    }
    for (const top of tops) {
      const log = this.git(top, ["log", "--first-parent", "--reverse", "--name-only", "--format=%x1e%H"]);
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

  static loadOnly(roots: string[]): Ledger {
    return new Ledger(loadRecords(roots).records);
  }
}
