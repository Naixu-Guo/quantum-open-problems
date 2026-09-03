/**
 * The ledger clone against a remote: pushes after commits, catches up with what others pushed,
 * survives an unreachable remote, and refuses a write it cannot rebase.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { submit, type Service } from "../src/write.ts";
import { newId, nowIso } from "../src/ids.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");

let tmp: string;
let bare: string;
let work: string;
let other: string;
let service: Service;

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")}: ${result.stderr}`);
  return result.stdout.trim();
};
const commitAll = (cwd: string, message: string) => {
  git(cwd, ["add", "-A"]);
  git(cwd, ["-c", "user.name=someone", "-c", "user.email=someone@example.invalid", "commit", "-q", "-m", message]);
};
const head = (cwd: string, ref = "HEAD") => git(cwd, ["rev-parse", ref]);
const pullRebase = (cwd: string) => git(cwd, ["-c", "user.name=someone", "-c", "user.email=someone@example.invalid", "pull", "-q", "--rebase", "origin", "main"]);
const state = () => service.repo.syncState()![0]!;

before(() => {
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
});

after(() => {
  service.index.close();
  service.auth.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

const editorId = () => service.repo.current().currentOf("Actor").find((a) => (a.fields["roles"] as string[]).includes("editor"))!.id;
const problemId = () => service.repo.current().currentOf("Problem")[0]!.id;
const comment = (text: string) => [{
  fields: { id: newId(), type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: editorId(), createdAt: nowIso(), targetType: "problem", targetId: problemId(), parentCommentId: null, promotedToContributionId: null },
  body: text,
}];

test("a committed write is pushed to the remote", () => {
  const result = submit(service, editorId(), comment("first"), "First comment");
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.equal(head(bare, "main"), head(work), "the remote branch is at the clone's head");
  assert.equal(state().ahead, 0);
  assert.equal(state().behind, 0);
  assert.ok(state().lastPushAt);
  assert.equal(state().lastError, null);
});

test("a write first catches up with what others pushed, then lands on top of it", () => {
  pullRebase(other);
  fs.writeFileSync(path.join(other, "NOTES.md"), "A note from a code change.\n");
  commitAll(other, "Add notes");
  git(other, ["push", "-q", "origin", "main"]);
  const result = submit(service, editorId(), comment("second"), "Second comment");
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  assert.ok(fs.existsSync(path.join(work, "NOTES.md")), "the clone fast-forwarded to the remote first");
  assert.equal(head(bare, "main"), head(work));
  assert.match(git(work, ["log", "--oneline", "-3"]), /Add notes/u);
});

test("an unreachable remote keeps the commit local, and the next write pushes both", () => {
  git(work, ["remote", "set-url", "origin", path.join(tmp, "missing.git")]);
  const offline = submit(service, editorId(), comment("third, offline"), "Third comment");
  assert.equal(offline.ok, true, "the clone is canonical; the write stands");
  assert.ok(offline.commit);
  assert.equal(state().ahead, 1);
  assert.match(state().lastError ?? "", /fetch|push/u);
  git(work, ["remote", "set-url", "origin", bare]);
  const online = submit(service, editorId(), comment("fourth"), "Fourth comment");
  assert.equal(online.ok, true);
  assert.equal(head(bare, "main"), head(work), "both commits reached the remote");
  assert.equal(state().ahead, 0);
  assert.equal(state().lastError, null);
});

test("a write the clone cannot rebase is refused, the tree stays clean, and an operator can recover", () => {
  git(work, ["remote", "set-url", "origin", path.join(tmp, "missing.git")]);
  const local = submit(service, editorId(), comment("fifth, offline"), "Fifth comment");
  assert.equal(local.ok, true);
  const relative = path.relative(fs.realpathSync(work), local.paths[0]!);
  // Someone writes the very same ledger file behind the service's back and pushes it.
  pullRebase(other);
  fs.mkdirSync(path.dirname(path.join(other, relative)), { recursive: true });
  fs.writeFileSync(path.join(other, relative), "not a record\n");
  commitAll(other, "Edit a ledger file directly");
  git(other, ["push", "-q", "origin", "main"]);
  git(work, ["remote", "set-url", "origin", bare]);
  const refused = submit(service, editorId(), comment("sixth"), "Sixth comment");
  assert.equal(refused.ok, false);
  assert.equal(refused.issues[0]!.category, "commit");
  assert.match(refused.issues[0]!.message, /cannot be rebased/u);
  assert.equal(git(work, ["status", "--porcelain"]), "", "the aborted rebase left nothing behind");
  assert.equal(state().ahead, 1, "the local commit is still unpushed");
  // The operator resolves it by taking the remote's history; the next write goes through again.
  git(work, ["reset", "-q", "--hard", "origin/main"]);
  fs.rmSync(path.join(work, relative), { force: true });
  git(work, ["-c", "user.name=operator", "-c", "user.email=operator@example.invalid", "commit", "-q", "-am", "Remove the stray file"]);
  const recovered = submit(service, editorId(), comment("seventh"), "Seventh comment");
  assert.equal(recovered.ok, true, JSON.stringify(recovered.issues));
  assert.equal(head(bare, "main"), head(work));
});
