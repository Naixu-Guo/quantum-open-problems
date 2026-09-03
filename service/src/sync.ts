/**
 * Keeps the ledger's repositories in step with a remote. The service's working clone is the
 * canonical copy of the ledger; the remote (GitHub) mirrors it. Before a write the clone catches
 * up with the remote: a fast-forward when it has nothing unpushed, a rebase of its unpushed
 * ledger commits otherwise. After a commit the clone pushes. A push that fails leaves the commit
 * local and is retried on the next write; a catch-up that cannot rebase refuses the write, since
 * the two copies would otherwise diverge for good. Ledger commits only add files, so a rebase
 * conflicts only when someone else wrote a ledger file directly, which the repository's rules
 * forbid.
 */
import { spawnSync } from "node:child_process";

export interface SyncConfig {
  remote: string;
  /** The branch to push to; the clone's current branch when null. */
  branch: string | null;
}

export interface SyncState {
  repository: string;
  remote: string;
  branch: string;
  /** Commits the clone has that the remote-tracking branch does not, as of the last fetch or push. */
  ahead: number | null;
  behind: number | null;
  lastPushAt: string | null;
  lastError: string | null;
}

export interface CatchUp {
  /** Why the write must be refused, or null when the clone is in step. */
  refused: string | null;
  /** Whether HEAD moved, so the caller must re-read the ledger. */
  moved: boolean;
}

function run(cwd: string, args: string[]): { ok: boolean; out: string; err: string } {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) return { ok: false, out: "", err: result.error.message };
  return { ok: result.status === 0, out: result.stdout.trim(), err: result.stderr.trim() };
}

function git(cwd: string, args: string[]): string {
  const result = run(cwd, args);
  if (!result.ok) throw new Error(`git ${args.join(" ")} failed in ${cwd}: ${result.err || result.out}`);
  return result.out;
}

class RepositorySync {
  readonly top: string;
  readonly remote: string;
  readonly branch: string;
  lastPushAt: string | null = null;
  lastError: string | null = null;

  constructor(top: string, config: SyncConfig) {
    this.top = top;
    this.remote = config.remote;
    this.branch = config.branch ?? git(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  }

  private counts(reference: string): { ahead: number | null; behind: number | null } {
    const known = run(this.top, ["rev-parse", "--verify", "-q", reference]);
    if (!known.ok) return { ahead: null, behind: null };
    const ahead = run(this.top, ["rev-list", "--count", `${reference}..HEAD`]);
    const behind = run(this.top, ["rev-list", "--count", `HEAD..${reference}`]);
    return { ahead: ahead.ok ? Number(ahead.out) : null, behind: behind.ok ? Number(behind.out) : null };
  }

  /** Fetch, then fast-forward or rebase onto the remote branch. */
  catchUp(): CatchUp {
    const fetched = run(this.top, ["fetch", "-q", this.remote, this.branch]);
    if (!fetched.ok) {
      // An unreachable remote does not stop a write: the clone is canonical and the push is retried later.
      this.lastError = `fetch: ${fetched.err || fetched.out}`;
      return { refused: null, moved: false };
    }
    const { ahead, behind } = this.counts("FETCH_HEAD");
    if (!behind) return { refused: null, moved: false };
    const dirty = run(this.top, ["status", "--porcelain"]);
    if (dirty.ok && dirty.out !== "") {
      this.lastError = "the working tree has uncommitted changes, so the clone cannot catch up with the remote";
      return { refused: this.lastError, moved: false };
    }
    // A rebase rewrites the committer, so it needs an identity even where none is configured.
    const step = ahead
      ? run(this.top, ["-c", "user.name=quantum-open-problems-service", "-c", "user.email=service@quantum-open-problems.invalid", "rebase", "-q", "FETCH_HEAD"])
      : run(this.top, ["merge", "-q", "--ff-only", "FETCH_HEAD"]);
    if (!step.ok) {
      if (ahead) run(this.top, ["rebase", "--abort"]);
      this.lastError = `the clone is ${behind} commit(s) behind ${this.remote}/${this.branch} and its ${ahead} unpushed commit(s) cannot be rebased onto it: ${step.err || step.out}`;
      return { refused: this.lastError, moved: false };
    }
    this.lastError = null;
    return { refused: null, moved: true };
  }

  /** Push HEAD; on a rejected push catch up once and try again. */
  push(): boolean {
    const attempt = () => run(this.top, ["push", "-q", this.remote, `HEAD:refs/heads/${this.branch}`]);
    let pushed = attempt();
    if (!pushed.ok) {
      const caught = this.catchUp();
      if (caught.refused === null && !this.lastError) pushed = attempt();
    }
    if (!pushed.ok) {
      this.lastError = `push: ${pushed.err || pushed.out}`;
      return false;
    }
    this.lastPushAt = new Date().toISOString();
    this.lastError = null;
    return true;
  }

  state(): SyncState {
    return { repository: this.top, remote: this.remote, branch: this.branch, ...this.counts(`refs/remotes/${this.remote}/${this.branch}`), lastPushAt: this.lastPushAt, lastError: this.lastError };
  }
}

export class GitSync {
  private readonly repositories: RepositorySync[];

  /** One synchronizer per distinct repository; the two ledger roots may share one. */
  constructor(tops: string[], config: SyncConfig) {
    this.repositories = [...new Set(tops)].map((top) => new RepositorySync(top, config));
  }

  catchUp(): CatchUp {
    let moved = false;
    for (const repository of this.repositories) {
      const result = repository.catchUp();
      if (result.refused) return { refused: `${result.refused} (${repository.top})`, moved };
      moved = moved || result.moved;
    }
    return { refused: null, moved };
  }

  /** Push every repository; failures are recorded in the state, never thrown. */
  push(): boolean {
    let all = true;
    for (const repository of this.repositories) all = repository.push() && all;
    return all;
  }

  state(): SyncState[] {
    return this.repositories.map((repository) => repository.state());
  }
}
