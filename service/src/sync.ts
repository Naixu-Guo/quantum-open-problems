/**
 * Keeps the ledger's repositories in step with a remote. The service's working clone is the
 * canonical copy of the ledger; the remote (GitHub) mirrors it. Before a write the clone
 * catches up with the remote branch: a fast-forward when it has nothing unpushed, otherwise a
 * merge whose first parent is the clone's own history, so the sequence numbers already served
 * from that history never move. After a commit the clone pushes.
 *
 * What the catch-up refuses, and leaves for an operator: the clone checked out on another
 * branch, a rebase or merge someone left in progress, uncommitted changes to tracked files,
 * remote commits that modify or delete ledger files (the service only adds; a deliberate
 * migration is accepted with `allowEdits`), and a merge that conflicts. A push that fails
 * leaves the commit local and is retried on the next write. Network commands carry a timeout
 * and never prompt. The caller decides when to fetch: once per submission, not once per commit.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

export interface SyncConfig {
  remote: string;
  /** The branch the ledger lives on; the clone's current branch when null. */
  branch: string | null;
}

export interface CatchUpOptions {
  /** Accept remote commits that modify or delete ledger files. */
  allowEdits?: boolean;
}

export interface CatchUp {
  /** Why the write must be refused, or null when the clone is in step. */
  refused: string | null;
  /** Whether HEAD moved in any repository, so the caller must re-read the ledger. */
  moved: boolean;
}

export interface SyncState {
  repository: string;
  remote: string;
  branch: string;
  /** Counts against the remote branch as of the last fetch or push; null before the first. */
  ahead: number | null;
  behind: number | null;
  lastFetchAt: string | null;
  lastPushAt: string | null;
  lastError: string | null;
}

/** What anyone may see: whether the mirror is current, not where it is or what git said. */
export interface PublicSyncState {
  inStep: boolean;
  ahead: number | null;
  behind: number | null;
  lastPushAt: string | null;
}

const NETWORK_TIMEOUT_MS = 30_000;
const IDENTITY = ["-c", "user.name=quantum-open-problems-service", "-c", "user.email=service@quantum-open-problems.invalid"];

interface Outcome { ok: boolean; out: string; err: string }

function run(cwd: string, args: string[], timeout?: number): Outcome {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout, env: { ...process.env, GIT_TERMINAL_PROMPT: "0" } });
  if (result.error) {
    const timedOut = (result.error as NodeJS.ErrnoException).code === "ETIMEDOUT" || result.signal === "SIGTERM";
    return { ok: false, out: "", err: timedOut ? `git ${args[0]} timed out after ${Math.round((timeout ?? 0) / 1000)}s` : result.error.message };
  }
  return { ok: result.status === 0, out: result.stdout.trim(), err: result.stderr.trim() };
}

function git(cwd: string, args: string[]): string {
  const result = run(cwd, args);
  if (!result.ok) throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.err || result.out}`);
  return result.out;
}

const why = (outcome: Outcome): string => outcome.err || outcome.out || "no output";

class RepositorySync {
  readonly top: string;
  readonly remote: string;
  readonly branch: string;
  /** The ledger roots inside this repository, relative to its top. */
  private readonly roots: string[];
  private ahead: number | null = null;
  private behind: number | null = null;
  private lastFetchAt: string | null = null;
  private lastFetchOk = false;
  private lastPushAt: string | null = null;
  private lastError: string | null = null;
  /** HEAD before the last catch-up that moved it, so an invalid result can be undone. */
  private before: string | null = null;

  constructor(top: string, roots: string[], config: SyncConfig) {
    this.top = top;
    this.remote = config.remote;
    this.roots = roots.map((root) => path.relative(top, root) || ".");
    const current = this.currentBranch();
    if (!current) throw new Error(`the ledger clone at ${top} is on a detached HEAD; check out the ledger branch or set QOP_GIT_BRANCH`);
    if (!run(top, ["rev-parse", "--verify", "-q", "HEAD"]).ok) throw new Error(`the ledger clone at ${top} has no commits yet`);
    this.branch = config.branch ?? current;
  }

  private currentBranch(): string | null {
    const result = run(this.top, ["symbolic-ref", "--short", "-q", "HEAD"]);
    return result.ok && result.out ? result.out : null;
  }

  private head(): string {
    return git(this.top, ["rev-parse", "HEAD"]);
  }

  private inProgress(): string | null {
    const gitDir = git(this.top, ["rev-parse", "--git-dir"]);
    const absolute = path.isAbsolute(gitDir) ? gitDir : path.join(this.top, gitDir);
    if (fs.existsSync(path.join(absolute, "rebase-merge")) || fs.existsSync(path.join(absolute, "rebase-apply"))) return "a rebase is in progress in the clone";
    if (fs.existsSync(path.join(absolute, "MERGE_HEAD"))) return "a merge is in progress in the clone";
    return null;
  }

  private countAgainst(reference: string): void {
    const ahead = run(this.top, ["rev-list", "--count", `${reference}..HEAD`]);
    const behind = run(this.top, ["rev-list", "--count", `HEAD..${reference}`]);
    this.ahead = ahead.ok ? Number(ahead.out) : null;
    this.behind = behind.ok ? Number(behind.out) : null;
  }

  /** Remote commits that change ledger files other than by adding them: what the remote did since the histories parted, not what the clone added. */
  private ledgerEdits(reference: string): string[] {
    const diff = run(this.top, ["diff", "--name-status", "--no-renames", `HEAD...${reference}`, "--", ...this.roots]);
    if (!diff.ok) return [];
    return diff.out.split("\n").filter((line) => line && !line.startsWith("A\t")).map((line) => line.replace("\t", " "));
  }

  private fetch(): boolean {
    const fetched = run(this.top, ["fetch", "-q", this.remote, this.branch], NETWORK_TIMEOUT_MS);
    this.lastFetchAt = new Date().toISOString();
    this.lastFetchOk = fetched.ok;
    if (!fetched.ok) this.lastError = `fetch: ${why(fetched)}`;
    return fetched.ok;
  }

  catchUp(options: CatchUpOptions = {}): CatchUp {
    const refuse = (reason: string): CatchUp => { this.lastError = reason; return { refused: reason, moved: false }; };
    const current = this.currentBranch();
    if (current !== this.branch) return refuse(`the clone is on ${current ? `branch ${current}` : "a detached HEAD"}, not the ledger branch ${this.branch}`);
    const busy = this.inProgress();
    if (busy) return refuse(busy);
    // An unreachable remote does not stop a write: the clone is canonical and the push is retried later.
    if (!this.fetch()) return { refused: null, moved: false };
    this.countAgainst("FETCH_HEAD");
    if (!this.behind) {
      this.lastError = null;
      return { refused: null, moved: false };
    }
    const dirty = run(this.top, ["status", "--porcelain", "--untracked-files=no"]);
    if (dirty.ok && dirty.out !== "") return refuse("the clone has uncommitted changes to tracked files");
    const edits = this.ledgerEdits("FETCH_HEAD");
    if (edits.length > 0 && !options.allowEdits) return refuse(`the remote's commits modify or delete ledger files, which only the service writes: ${edits.slice(0, 5).join(", ")}${edits.length > 5 ? ` and ${edits.length - 5} more` : ""}; an operator accepts a deliberate migration with 'sync --allow-edits'`);
    const before = this.head();
    const merge = this.ahead
      ? run(this.top, [...IDENTITY, "merge", "-q", "--no-edit", "-m", `Merge ${this.remote}/${this.branch} into the ledger clone`, "FETCH_HEAD"])
      : run(this.top, ["merge", "-q", "--ff-only", "FETCH_HEAD"]);
    if (!merge.ok) {
      if (this.inProgress()) run(this.top, ["merge", "--abort"]);
      return refuse(`the clone is ${this.behind} commit(s) behind ${this.remote}/${this.branch} and its ${this.ahead} unpushed commit(s) cannot be merged with it: ${why(merge)}`);
    }
    this.before = before;
    this.countAgainst("FETCH_HEAD");
    this.lastError = null;
    const outside = run(this.top, ["diff", "--name-only", before, "HEAD", "--", ".", ...this.roots.map((root) => `:!${root}`)]);
    if (outside.ok && outside.out) console.warn(`sync: files outside the ledger changed in ${this.top} (${outside.out.split("\n").length} file(s)); restart the service to run the new code`);
    return { refused: null, moved: true };
  }

  /** Put HEAD back where it was before the last catch-up that moved it; for a remote that brought an invalid ledger. */
  undo(reason: string): void {
    if (!this.before) return;
    run(this.top, ["reset", "-q", "--hard", this.before]);
    this.before = null;
    this.lastError = reason;
    this.lastFetchOk = false;
    this.countAgainst(`refs/remotes/${this.remote}/${this.branch}`);
  }

  /** Push HEAD; on a rejected push catch up once and try again. Returns whether it pushed and whether HEAD moved meanwhile. */
  push(): { pushed: boolean; moved: boolean } {
    const attempt = () => run(this.top, ["push", "-q", this.remote, `HEAD:refs/heads/${this.branch}`], NETWORK_TIMEOUT_MS);
    let pushed = attempt();
    let moved = false;
    if (!pushed.ok) {
      const caught = this.catchUp();
      moved = caught.moved;
      if (caught.refused === null && this.lastFetchOk) pushed = attempt();
    }
    if (!pushed.ok) {
      this.lastError = `push: ${why(pushed)}`;
      this.countAgainst(`refs/remotes/${this.remote}/${this.branch}`);
      return { pushed: false, moved };
    }
    this.lastPushAt = new Date().toISOString();
    this.lastError = null;
    this.ahead = 0;
    this.behind = 0;
    return { pushed: true, moved };
  }

  state(): SyncState {
    return { repository: this.top, remote: this.remote, branch: this.branch, ahead: this.ahead, behind: this.behind, lastFetchAt: this.lastFetchAt, lastPushAt: this.lastPushAt, lastError: this.lastError };
  }
}

export class GitSync {
  private readonly repositories: RepositorySync[];

  /** One synchronizer per distinct repository; the two ledger roots may share one. */
  constructor(roots: string[], config: SyncConfig) {
    const byTop = new Map<string, string[]>();
    for (const root of roots) {
      const top = git(root, ["rev-parse", "--show-toplevel"]);
      byTop.set(top, [...(byTop.get(top) ?? []), root]);
    }
    this.repositories = [...byTop].map(([top, inside]) => new RepositorySync(top, inside, config));
  }

  /** Catch up every repository. A refusal in a later one does not hide that an earlier one moved. */
  catchUp(options: CatchUpOptions = {}): CatchUp {
    let moved = false;
    for (const repository of this.repositories) {
      const result = repository.catchUp(options);
      moved = moved || result.moved;
      if (result.refused) return { refused: `${result.refused} (${repository.top})`, moved };
    }
    return { refused: null, moved };
  }

  undo(reason: string): void {
    for (const repository of this.repositories) repository.undo(reason);
  }

  /** Push every repository; failures are recorded in the state, never thrown. */
  push(): { pushed: boolean; moved: boolean } {
    let pushed = true;
    let moved = false;
    for (const repository of this.repositories) {
      const result = repository.push();
      pushed = pushed && result.pushed;
      moved = moved || result.moved;
    }
    return { pushed, moved };
  }

  state(): SyncState[] {
    return this.repositories.map((repository) => repository.state());
  }

  publicState(): PublicSyncState[] {
    return this.repositories.map((repository) => {
      const s = repository.state();
      return { inStep: s.ahead === 0 && s.behind === 0 && s.lastError === null, ahead: s.ahead, behind: s.behind, lastPushAt: s.lastPushAt };
    });
  }
}
