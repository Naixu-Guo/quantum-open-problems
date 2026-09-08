import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { DatabaseSync } from "node:sqlite";

const run = promisify(execFile);
const repo = path.resolve(import.meta.dirname, "..");
test("online backup restores committed WAL data, Git history, private config and untracked artifacts while writes continue", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-online-backup-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const state = path.join(root, "state");
  const catalog = path.join(state, "catalog");
  const data = path.join(state, "data");
  const config = path.join(root, "configuration");
  for (const directory of [catalog, data, config]) fs.mkdirSync(directory, { recursive: true });
  const git = (...args) => execFileSync("git", args, { cwd: catalog, encoding: "utf8", stdio: "pipe" }).trim();
  git("init", "-q", "-b", "main");
  fs.writeFileSync(path.join(catalog, "README.md"), "Committed ledger fixture\n");
  fs.writeFileSync(path.join(catalog, ".gitignore"), "activity/artifact-store/\n");
  git("add", "README.md", ".gitignore");
  git("-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Seed");
  const head = git("rev-parse", "HEAD");
  // Unchanged content with a stale stat cache makes plain `git status` rewrite
  // the index. A root backup must leave the service-owned index untouched.
  const readme = path.join(catalog, "README.md");
  const older = new Date(Date.now() - 5000);
  fs.utimesSync(readme, older, older);
  const gitIndex = path.join(catalog, ".git/index");
  const indexBefore = fs.readFileSync(gitIndex);
  const indexStat = fs.statSync(gitIndex);
  fs.mkdirSync(path.join(catalog, "activity/artifact-store"), { recursive: true });
  fs.writeFileSync(path.join(catalog, "activity/artifact-store", "fixture-blob"), "Uncommitted trajectory artifact");
  fs.writeFileSync(path.join(config, "service.env"), "FIXTURE_PRIVATE_SETTING=preserved\n", { mode: 0o600 });
  const databases = ["auth.sqlite", "submissions.sqlite", "index.sqlite"].map(name => {
    const db = new DatabaseSync(path.join(data, name));
    db.exec("PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; CREATE TABLE entries (id INTEGER PRIMARY KEY, value TEXT);");
    db.prepare("INSERT INTO entries VALUES (?, ?)").run(1, `Committed ${name} in WAL`);
    return db;
  });
  t.after(() => databases.forEach(db => db.close()));
  assert.ok(fs.statSync(path.join(data, "auth.sqlite-wal")).size > 0);
  let writes = 0;
  const writer = setInterval(() => { databases[0].prepare("INSERT INTO entries (value) VALUES (?)").run(`Concurrent write ${++writes}`); }, 10);
  const archive = path.join(root, "backup.tar.gz");
  try {
    await run("python3", [path.join(repo, "deploy/ubuntu/qop-backup.py"), "--data-root", state, "--config-dir", config, "--output", archive]);
  } finally { clearInterval(writer); }
  assert.ok(writes > 0, "the live database kept accepting writes");
  assert.equal(fs.statSync(archive).mode & 0o077, 0);
  assert.deepEqual(fs.readFileSync(gitIndex), indexBefore, "backup must not refresh the Git index");
  const indexAfter = fs.statSync(gitIndex);
  for (const key of ["ino", "uid", "gid", "mode", "mtimeMs"]) assert.equal(indexAfter[key], indexStat[key], `index ${key} must remain unchanged`);
  const extracted = path.join(root, "restored");
  fs.mkdirSync(extracted);
  execFileSync("tar", ["-xzf", archive, "-C", extracted]);
  const manifest = JSON.parse(fs.readFileSync(path.join(extracted, "manifest.json"), "utf8"));
  assert.equal(manifest.format, "qop-backup/2");
  assert.equal(manifest.catalogHead, head);
  const restoredCatalog = path.join(root, "restored-catalog");
  execFileSync("git", ["clone", "-q", path.join(extracted, "catalog.bundle"), restoredCatalog]);
  assert.equal(execFileSync("git", ["-C", restoredCatalog, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(), head);
  for (const name of manifest.databases) {
    const db = new DatabaseSync(path.join(extracted, "data", name));
    try {
      assert.equal(db.prepare("SELECT value FROM entries WHERE id=1").get().value, `Committed ${name} in WAL`);
      assert.equal(Object.values(db.prepare("PRAGMA integrity_check").get())[0], "ok");
    } finally { db.close(); }
  }
  assert.equal(fs.readFileSync(path.join(extracted, "artifact-store/fixture-blob"), "utf8"), "Uncommitted trajectory artifact");
  assert.match(fs.readFileSync(path.join(extracted, "configuration/service.env"), "utf8"), /preserved/);
});
