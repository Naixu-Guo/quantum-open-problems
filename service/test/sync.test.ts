/**
 * The ledger clone against a remote: pushes after commits, catches up with what others pushed
 * without renumbering what it already served, survives an unreachable remote, and refuses
 * what an operator must look at: edits to ledger files, a conflicting add, a wrong branch, an
 * invalid ledger from the remote.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { submit, type Service } from "../src/write.ts";
import { newId, nowIso } from "../src/ids.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");

let tmp: string;
let bare: string;
let work: string;
let other: string;
let service: Service | undefined;
let server: http.Server | undefined;
let base = "";

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};
const identity = ["-c", "user.name=someone", "-c", "user.email=someone@example.invalid"];
const commitAll = (cwd: string, message: string) => {
  git(cwd, ["add", "-A"]);
  git(cwd, [...identity, "commit", "-q", "-m", message]);
};
const head = (cwd: string, ref = "HEAD") => git(cwd, ["rev-parse", ref]);
const pullRebase = (cwd: string) => git(cwd, [...identity, "pull", "-q", "--rebase", "origin", "main"]);
const offline = () => git(work, ["remote", "set-url", "origin", path.join(tmp, "missing.git")]);
const online = () => git(work, ["remote", "set-url", "origin", bare]);
const state = () => service!.repo.syncState()![0]!;
const relativeToWork = (file: string) => path.relative(fs.realpathSync(work), file);

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-sync-"));
  bare = path.join(tmp, "bare.git");
  git(tmp, ["init", "-q", "--bare", "-b", "main", bare]);
  work = path.join(tmp, "work");
  fs.mkdirSync(work);
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(work, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(work, "activity"), { recursive: true });
  git(work, ["init", "-q", "-b", "main"]);
  commitAll(work, "Seed fixtures");
  git(work, ["remote", "add", "origin", bare]);
  git(work, ["push", "-q", "-u", "origin", "main"]);
  other = path.join(tmp, "other");
  git(tmp, ["clone", "-q", bare, other]);
  service = createService({ ledgerDir: path.join(work, "ledger"), activityDir: path.join(work, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true, git: { remote: "origin", branch: null } });
  server = createServer(service);
  await new Promise<void>((resolve) => server!.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  base = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
});

after(() => {
  server?.close();
  service?.index.close();
  service?.auth.close();
  if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
});

const editorId = () => service!.repo.current().currentOf("Actor").find((a) => (a.fields["roles"] as string[]).includes("editor"))!.id;
const problemId = () => service!.repo.current().currentOf("Problem")[0]!.id;
const commentFields = () => ({ id: newId(), type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: editorId(), createdAt: nowIso(), targetType: "problem", targetId: problemId(), parentCommentId: null, promotedToContributionId: null });
const comment = (text: string) => [{ fields: commentFields(), body: text }];
const write = (text: string) => submit(service!, editorId(), comment(text), text);

test("a committed write is pushed to the remote", () => {
  const result = write("first");
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.equal(head(bare, "main"), head(work), "the remote branch is at the clone's head");
  assert.equal(state().ahead, 0);
  assert.equal(state().behind, 0);
  assert.ok(state().lastPushAt);
  assert.equal(state().lastError, null);
  assert.deepEqual(service!.repo.publicSyncState(), [{ inStep: true, ahead: 0, behind: 0, lastPushAt: state().lastPushAt }]);
});

test("a write lands on top of what others pushed, and served sequence numbers keep their places", () => {
  pullRebase(other);
  fs.writeFileSync(path.join(other, "NOTES.md"), "A note from a code change.\n");
  commitAll(other, "Add notes");
  git(other, ["push", "-q", "origin", "main"]);
  const before = write("second");
  assert.equal(before.ok, true, JSON.stringify(before.issues));
  assert.ok(fs.existsSync(path.join(work, "NOTES.md")), "the clone caught up with the remote");
  assert.equal(head(bare, "main"), head(work));
  const secondPath = before.paths[0]!;
  const sequenceOfSecond = service!.repo.sequences().get(secondPath)!;

  // Now the clone is offline with an unpushed record while the remote gains a record of its own.
  offline();
  const third = write("third, offline");
  assert.equal(third.ok, true);
  const sequenceOfThird = service!.repo.sequences().get(third.paths[0]!)!;
  pullRebase(other);
  const remoteFields = commentFields();
  const remoteFile = path.join(other, path.dirname(relativeToWork(third.paths[0]!)), `${remoteFields.id}.r1.md`);
  fs.writeFileSync(remoteFile, fs.readFileSync(third.paths[0]!, "utf8").replace(String(third.paths[0]!.match(/([0-9A-Z]{26})\.r1\.md$/u)![1]), remoteFields.id));
  commitAll(other, "A record written by another instance");
  git(other, ["push", "-q", "origin", "main"]);
  online();
  const fourth = write("fourth");
  assert.equal(fourth.ok, true, JSON.stringify(fourth.issues));
  assert.equal(head(bare, "main"), head(work), "the merge and the new commit reached the remote");
  assert.match(git(work, ["log", "--first-parent", "--format=%s", "-3"]), /Merge origin\/main into the ledger clone/u, "the clone merged rather than rebased");
  const sequences = service!.repo.sequences();
  assert.equal(sequences.get(secondPath), sequenceOfSecond, "an already served record keeps its number");
  assert.equal(sequences.get(third.paths[0]!), sequenceOfThird, "the record committed offline keeps its number");
  const remotePath = path.join(fs.realpathSync(work), relativeToWork(third.paths[0]!).replace(path.basename(third.paths[0]!), `${remoteFields.id}.r1.md`));
  assert.ok(sequences.get(remotePath)! > sequenceOfThird, "the record the remote brought comes after it");
  assert.ok(sequences.get(fourth.paths[0]!)! > sequences.get(remotePath)!, "and the new record after that");
  assert.equal(fourth.commit, head(work), "the reported commit is the one that holds the batch");
  assert.ok(service!.repo.current().find("Comment", remoteFields.id), "the remote's record is in the loaded ledger");
});

test("an unreachable remote keeps the commit local, and the next write pushes it", () => {
  offline();
  const local = write("fifth, offline");
  assert.equal(local.ok, true, "the clone is canonical; the write stands");
  assert.equal(state().ahead, 1);
  assert.match(state().lastError ?? "", /fetch|push/u);
  online();
  const pushed = write("sixth");
  assert.equal(pushed.ok, true);
  assert.equal(head(bare, "main"), head(work));
  assert.equal(state().ahead, 0);
  assert.equal(state().lastError, null);
});

test("remote commits that edit ledger files are refused until an operator accepts them", () => {
  pullRebase(other);
  const edited = path.join(other, "ledger", "taxonomy.r1.md");
  fs.appendFileSync(edited, "\nAn extra line added behind the service's back.\n");
  commitAll(other, "Edit a ledger file directly");
  git(other, ["push", "-q", "origin", "main"]);
  const refused = write("seventh");
  assert.equal(refused.ok, false);
  assert.equal(refused.retryable, true);
  assert.match(refused.issues[0]!.message, /modify or delete ledger files/u);
  assert.match(refused.issues[0]!.message, /taxonomy\.r1\.md/u);
  assert.equal(git(work, ["status", "--porcelain"]), "");
  const accepted = service!.repo.synchronize({ allowEdits: true });
  assert.equal(accepted.refused, null, accepted.refused ?? "");
  assert.equal(accepted.pushed, true);
  assert.ok(fs.readFileSync(path.join(work, "ledger", "taxonomy.r1.md"), "utf8").includes("extra line"));
  const after = write("eighth");
  assert.equal(after.ok, true, JSON.stringify(after.issues));
});

test("a conflicting add is refused with a clean tree, and the operator's repair is noticed", () => {
  offline();
  const local = write("ninth, offline");
  assert.equal(local.ok, true);
  const relative = relativeToWork(local.paths[0]!);
  pullRebase(other);
  fs.mkdirSync(path.dirname(path.join(other, relative)), { recursive: true });
  fs.writeFileSync(path.join(other, relative), "not a record\n");
  commitAll(other, "Add the same path with other content");
  git(other, ["push", "-q", "origin", "main"]);
  online();
  const refused = write("tenth");
  assert.equal(refused.ok, false);
  assert.match(refused.issues[0]!.message, /cannot be merged/u);
  assert.equal(git(work, ["status", "--porcelain"]), "", "the aborted merge left nothing behind");
  assert.equal(state().ahead, 1, "the local commit is still unpushed");
  // The operator takes the remote's history and removes the stray file, under the running service.
  git(work, ["fetch", "-q", "origin", "main"]);
  git(work, ["reset", "-q", "--hard", "origin/main"]);
  fs.rmSync(path.join(work, relative), { force: true });
  git(work, [...identity, "commit", "-q", "-am", "Remove the stray file"]);
  const recovered = write("eleventh");
  assert.equal(recovered.ok, true, JSON.stringify(recovered.issues));
  assert.equal(recovered.reloaded, true);
  assert.equal(service!.repo.current().records.some((r) => r.path === local.paths[0]), false, "the service re-read the clone after the repair");
  assert.equal(head(bare, "main"), head(work));
});

test("a remote that brings an invalid ledger is undone", () => {
  pullRebase(other);
  fs.writeFileSync(path.join(other, "ledger", "problems", "bogus.md"), "not a record\n");
  commitAll(other, "Push a broken record");
  git(other, ["push", "-q", "origin", "main"]);
  const headBefore = head(work);
  const refused = write("twelfth");
  assert.equal(refused.ok, false);
  assert.equal(refused.retryable, true);
  assert.match(refused.issues[0]!.message, /invalid ledger/u);
  assert.equal(head(work), headBefore, "the clone was put back");
  assert.equal(git(work, ["status", "--porcelain"]), "");
  fs.rmSync(path.join(other, "ledger", "problems", "bogus.md"));
  commitAll(other, "Remove the broken record");
  git(other, ["push", "-q", "origin", "main"]);
  const after = write("thirteenth");
  assert.equal(after.ok, true, JSON.stringify(after.issues));
});

test("a clone on the wrong branch refuses writes with a 503 that idempotent retries do not replay", async () => {
  const token = service!.auth.issueKey(editorId(), "test");
  const body = JSON.stringify({ records: [{ type: "Comment", body: "from the API", targetType: "problem", targetId: problemId(), parentCommentId: null, promotedToContributionId: null }] });
  const post = () => fetch(`${base}/api/v1/batches`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Idempotency-Key": "same-key" }, body });
  git(work, ["checkout", "-q", "-b", "wip"]);
  const refused = await post();
  assert.equal(refused.status, 503);
  assert.match(await refused.text(), /branch wip/u);
  git(work, ["checkout", "-q", "main"]);
  git(work, ["branch", "-q", "-D", "wip"]);
  const accepted = await post();
  assert.equal(accepted.status, 201, await accepted.text());
  assert.equal(accepted.headers.get("idempotent-replay"), null, "the refusal was not remembered");
});
