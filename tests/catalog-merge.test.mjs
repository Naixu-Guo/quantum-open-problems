import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { exportLedger, serializeRecord } from "../scripts/export-ledger.mjs";
import { loadMergedProblems } from "../site/lib/merged-problems.mjs";
import { validateLedger } from "../contract/src/validate.ts";
import { catalogState, isIndexed } from "../contract/src/derive.ts";
import { deterministicUlid } from "../site/lib/metadata.mjs";

const repo = path.resolve(import.meta.dirname, "..");
const entry = JSON.parse(fs.readFileSync(path.join(repo, "database/merged_problems_json/op_12fc55f67580588e.json"), "utf8"));
const canonical = JSON.parse(fs.readFileSync(path.join(repo, "database/problems_json/op_fd75613c5bab4164.json"), "utf8"));
const write = (root, relative, value) => {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
};
const archived = `database/merged_problems_json/${entry.record.id}.json`;
const original = `database/problems_json/${entry.record.id}.json`;
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-merge-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "database/problems_json"), { recursive: true });
  for (const name of ["metadata.json", "actors.json", "tags.json"]) fs.copyFileSync(path.join(repo, "database", name), path.join(root, "database", name));
  write(root, `database/problems_json/${canonical.id}.json`, canonical);
  return root;
}

test("catalog merge appends authority, preserves every historical byte and remains exportable", async t => {
  const root = fixture(t);
  write(root, original, entry.record);
  await exportLedger({ root });
  const before = validateLedger([path.join(root, "ledger"), path.join(root, "activity")]);
  assert.deepEqual(before.issues, []);
  const oldStatement = before.ledger.currentOf("Statement").find(s => s.fields.problemId === entry.record.ulid);
  const comment = { id: deterministicUlid("merge-history-comment"), type: "Comment", schemaVersion: "1.0", revision: 1,
    createdBy: entry.record.metadata.createdBy, createdAt: entry.record.metadata.createdAt, targetType: "statement", targetId: oldStatement.id,
    parentCommentId: null, promotedToContributionId: null, body: "Historical discussion of this exact formulation." };
  const commentPath = path.join(root, "activity/comments/statement", oldStatement.id, `${comment.id}.r1.md`);
  fs.mkdirSync(path.dirname(commentPath), { recursive: true });
  fs.writeFileSync(commentPath, serializeRecord(comment));
  const history = new Map([...before.ledger.records.map(r => r.path), commentPath].map(file => [file, fs.readFileSync(file)]));
  write(root, archived, entry);
  fs.rmSync(path.join(root, original));
  await assert.rejects(exportLedger({ root, check: true }), /Ledger export drift/);
  const result = await exportLedger({ root });
  assert.equal(result.activeProblemCount, 1);
  assert.equal(result.mergedProblemCount, 1);
  const { ledger, issues } = validateLedger([path.join(root, "ledger"), path.join(root, "activity")]);
  assert.deepEqual(issues, []);
  assert.equal(catalogState(ledger, entry.record.ulid), "merged");
  assert.equal(isIndexed(ledger, entry.record.ulid), false);
  assert.equal(isIndexed(ledger, canonical.ulid), true);
  assert.deepEqual(ledger.find("Problem", entry.record.ulid).fields.authoredCatalog.record, entry.record);
  for (const [file, bytes] of history) assert.deepEqual(fs.readFileSync(file), bytes);
  await exportLedger({ root, check: true });
  assert.equal((await exportLedger({ root })).changed, 0);
  // Removing the archive must not silently retire another permanent entity.
  fs.rmSync(path.join(root, archived));
  await assert.rejects(exportLedger({ root }), /Exported entity disappeared/);
  for (const [file, bytes] of history) assert.deepEqual(fs.readFileSync(file), bytes);
});

test("merge archives reject missing targets, loops, lost aliases and reintroduced identities", t => {
  const root = fixture(t);
  for (const target of [entry.record.ulid, "01AAAAAAAAAAAAAAAAAAAAAAAA"]) {
    write(root, archived, { ...entry, mergedIntoProblemId: target });
    assert.throws(() => loadMergedProblems(root, [canonical]), /active canonical problem/);
  }
  write(root, archived, { ...entry, record: { ...entry.record, aliases: entry.record.aliases.filter(a => a !== "open-problem-v2-problem-52") } });
  assert.throws(() => loadMergedProblems(root, [canonical]), /permanent alias/);
  write(root, archived, entry);
  assert.throws(() => loadMergedProblems(root, [canonical, entry.record]), /identity/);
  assert.equal(loadMergedProblems(root, [canonical]).length, 1);
});

test("a later canonical resolution updates effective status without rewriting the archived question", async t => {
  const root = fixture(t);
  const unresolved = { ...entry, record: { ...entry.record, status: "Unsolved" } };
  write(root, `database/problems_json/${canonical.id}.json`, { ...canonical, status: "Unsolved" });
  write(root, original, unresolved.record);
  await exportLedger({ root });
  write(root, archived, unresolved);
  fs.rmSync(path.join(root, original));
  await exportLedger({ root });
  const archivedBytes = fs.readFileSync(path.join(root, archived));
  write(root, `database/problems_json/${canonical.id}.json`, canonical);
  await exportLedger({ root });
  const { ledger, issues } = validateLedger([path.join(root, "ledger"), path.join(root, "activity")]);
  assert.deepEqual(issues, []);
  const merged = ledger.find("Problem", entry.record.ulid).fields.authoredCatalog;
  assert.equal(merged.status, "Solved");
  assert.equal(merged.record.status, "Unsolved");
  assert.deepEqual(fs.readFileSync(path.join(root, archived)), archivedBytes);
  await exportLedger({ root, check: true });
});

test("fresh exports preserve merged identity routing and reject an unpinned merge mutation", async t => {
  const root = fixture(t);
  write(root, archived, entry);
  await exportLedger({ root });
  const roots = [path.join(root, "ledger"), path.join(root, "activity")];
  const { ledger, issues } = validateLedger(roots);
  assert.deepEqual(issues, []);
  assert.equal(catalogState(ledger, entry.record.ulid), "merged");
  const current = ledger.find("Problem", entry.record.ulid);
  const changed = { ...current.fields, revision: current.fields.revision + 1, authoredCatalog: { ...current.fields.authoredCatalog }, body: current.body };
  delete changed.authoredCatalog.mergedIntoProblemId;
  delete changed.authoredCatalog.mergeReason;
  fs.writeFileSync(current.path.replace(/\.r\d+\.md$/, `.r${changed.revision}.md`), serializeRecord(changed));
  assert.ok(validateLedger(roots).issues.some(issue => /authoredCatalog/.test(issue.message)));
});
