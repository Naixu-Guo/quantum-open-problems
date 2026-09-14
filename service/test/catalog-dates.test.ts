import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Ledger, loadRecords, type LoadedRecord } from "../../contract/src/ledger.ts";
import { catalogDates } from "../src/catalog-dates.ts";
import { Index } from "../src/index.ts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const stamp = (second: number) => `2026-01-02T03:04:${String(second).padStart(2, "0")}.000Z`;
const git = (root: string, args: string[], authorDate = stamp(50)) => execFileSync("git", args, {
  cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, GIT_AUTHOR_NAME: "Date fixture", GIT_AUTHOR_EMAIL: "dates@example.invalid", GIT_COMMITTER_NAME: "Date fixture", GIT_COMMITTER_EMAIL: "dates@example.invalid", GIT_AUTHOR_DATE: authorDate, GIT_COMMITTER_DATE: "2026-02-03T04:05:06Z" },
}).trim();

function fixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-dates-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, ["init", "-q", "-b", "main"]);
  const loaded = loadRecords([path.join(repository, "contract/fixtures/ledger")]);
  assert.deepEqual(loaded.issues, []);
  const ledger = new Ledger(loaded.records);
  const problems = ledger.currentOf("Problem");
  const paths = new Map<string, { json: string; tex: string; original: Record<string, unknown> }>();
  for (const [index, problem] of problems.entries()) {
    const opId = `op_${String(index).padStart(16, "0")}`;
    const sourcePath = `database/problems_json/${opId}.json`;
    const texPath = `database/problems_tex/${opId}.tex`;
    const original = { id: opId, title: problem.fields["title"], progress: ["An authored fixture without any inferred research date."] };
    problem.fields["authoredCatalog"] = { status: "Unsolved", sourcePath, record: original };
    paths.set(problem.id, { json: sourcePath, tex: texPath, original });
  }
  const write = (relative: string, text: string) => {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.writeFileSync(path.join(root, relative), text);
  };
  const add = (problem: LoadedRecord, tex = "Initial mathematical statement.\n", historical = false) => {
    const files = paths.get(problem.id)!;
    write(files.json, JSON.stringify(files.original));
    write(historical ? files.tex.replace("problems_tex/", "problems/") : files.tex, tex);
  };
  const commit = (message: string, second: number) => {
    git(root, ["add", "--all"]);
    return git(root, ["commit", "-q", "-m", message], stamp(second));
  };
  return { root, ledger, problems, paths, write, add, commit };
}

test("pure TeX folder rename preserves original creation/edit author seconds; later content changes update only edit time", (t) => {
  const { root, ledger, problems, paths, add, commit, write } = fixture(t);
  const problem = problems[0]!;
  const tex = paths.get(problem.id)!.tex;
  add(problem, "The unchanged mathematical statement.\n", true);
  commit("Create before the folder migration", 1);
  fs.mkdirSync(path.join(root, "database/problems_tex"));
  git(root, ["mv", tex.replace("problems_tex/", "problems/"), tex]);
  commit("Pure folder rename", 5);
  assert.deepEqual(catalogDates(root, ledger).get(problem.id), { createdAt: stamp(1), updatedAt: stamp(1), basis: "tex-git-history" });
  write(tex, "The unchanged mathematical statement.\nA necessary additional condition.\n");
  commit("Edit mathematical content", 8);
  assert.deepEqual(catalogDates(root, ledger).get(problem.id), { createdAt: stamp(1), updatedAt: stamp(8), basis: "tex-git-history" });
});

test("reverting to a previously cached TeX tree reports the revert edit time", (t) => {
  const { root, ledger, problems, paths, add, commit, write } = fixture(t);
  const problem = problems[0]!;
  const tex = paths.get(problem.id)!.tex;
  add(problem);
  commit("Initial text", 1);
  const originalTree = git(root, ["rev-parse", "HEAD:database/problems_tex"]);
  assert.equal(catalogDates(root, ledger).get(problem.id)!.updatedAt, stamp(1));
  write(tex, "Changed statement.\n");
  commit("Change text", 4);
  assert.equal(catalogDates(root, ledger).get(problem.id)!.updatedAt, stamp(4));
  write(tex, "Initial mathematical statement.\n");
  commit("Revert text", 9);
  assert.equal(git(root, ["rev-parse", "HEAD:database/problems_tex"]), originalTree, "this must exercise an identical cached tree");
  assert.deepEqual(catalogDates(root, ledger).get(problem.id), { createdAt: stamp(1), updatedAt: stamp(9), basis: "tex-git-history" });
});

test("activity-only commits reuse cached per-file histories", (t) => {
  const { root, ledger, problems, add, commit, write } = fixture(t);
  const problem = problems[0]!;
  add(problem);
  commit("Initial catalog text", 1);
  const tracePath = path.join(root, "git-trace.log");
  const previous = process.env["GIT_TRACE"];
  try {
    process.env["GIT_TRACE"] = tracePath;
    const first = catalogDates(root, ledger);
    write("activity/run.md", "An agent wrote an activity record, not a catalog edit.\n");
    // Keep the trace outside the fixture commit so its file never changes HEAD.
    git(root, ["add", "activity/run.md"]);
    git(root, ["commit", "-q", "-m", "Activity only"], stamp(7));
    const second = catalogDates(root, ledger);
    assert.deepEqual(second, first);
    assert.equal(second.get(problem.id)!.updatedAt, stamp(1));
    const trace = fs.readFileSync(tracePath, "utf8");
    assert.equal([...trace.matchAll(/log --follow/g)].length, 1, "an activity commit must not rescan per-file Git history");
  } finally {
    if (previous === undefined) delete process.env["GIT_TRACE"];
    else process.env["GIT_TRACE"] = previous;
  }
});

test("edited ordering preserves author seconds and uses newer creation time to break simultaneous edits", (t) => {
  const { root, ledger, problems, paths, add, commit, write } = fixture(t);
  const [older, newer, untouched] = problems as [LoadedRecord, LoadedRecord, LoadedRecord, ...LoadedRecord[]];
  add(older, "The older problem's distinct mathematical statement.\n");
  commit("Create older", 1);
  add(newer, "The newer problem's different mathematical statement.\n");
  commit("Create one second later", 2);
  add(untouched, "The untouched problem has its own statement.\n");
  commit("Create untouched", 3);
  for (const problem of [older, newer]) write(paths.get(problem.id)!.tex, "The same-second edited statement.\n");
  commit("Edit two records together", 7);
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map(), catalogDates(root, ledger));
    const rows = index.problemRows({ sort: "edited", indexedOnly: false });
    assert.deepEqual(rows.slice(0, 3).map((row) => row.id), [newer.id, older.id, untouched.id]);
    assert.equal(rows[0]!.created_at, stamp(2));
    assert.equal(rows[0]!.edited_at, stamp(7));
    assert.ok(rows.slice(3).every((row) => row.edited_at === null && row.created_at === null));
  } finally { index.close(); }
});

test("missing, untracked, stale or unavailable catalog sources remain unknown instead of taking filesystem dates", (t) => {
  const { root, ledger, problems, paths, add, commit, write } = fixture(t);
  const problem = problems[0]!;
  const files = paths.get(problem.id)!;
  assert.equal(catalogDates(root, ledger).size, 0);
  write("activity/note.md", "Service-only clone.");
  commit("No website catalog", 1);
  assert.equal(catalogDates(root, ledger).size, 0);
  add(problem);
  assert.equal(catalogDates(root, ledger).size, 0, "untracked files have no Git history");
  commit("Add catalog", 3);
  assert.ok(catalogDates(root, ledger).has(problem.id));
  write(files.json, JSON.stringify({ ...files.original, title: "A different authored snapshot" }));
  assert.equal(catalogDates(root, ledger).size, 0);
  write(files.json, JSON.stringify(files.original));
  fs.rmSync(path.join(root, files.tex));
  assert.equal(catalogDates(root, ledger).size, 0);
  fs.rmSync(path.join(root, files.json));
  assert.equal(catalogDates(root, ledger).size, 0);
});

test("shallow Git history cannot assert an original creation date", (t) => {
  const { root, ledger, problems, paths, add, commit, write } = fixture(t);
  const problem = problems[0]!;
  add(problem);
  commit("Original creation", 1);
  write(paths.get(problem.id)!.tex, "A later edit that is not the creation.\n");
  commit("Recent edit", 9);
  const clone = path.join(root, "shallow-clone");
  git(root, ["clone", "-q", "--depth", "1", pathToFileURL(root).href, clone]);
  assert.equal(git(clone, ["rev-parse", "--is-shallow-repository"]), "true");
  assert.equal(catalogDates(clone, ledger).size, 0);
});
