import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { exportLedger, serializeRecord } from "../scripts/export-ledger.mjs";
import { createService } from "../service/src/service.ts";
import { reindex } from "../service/src/write.ts";
import { bootstrapEditor } from "../service/src/bootstrap.ts";
import { ensureHumanActor } from "../service/src/web.ts";
import { linkGitHubIdentity } from "../service/src/github-identity.ts";
import { materialize } from "../service/src/payloads.ts";
import { AuthStore } from "../service/src/auth.ts";
import { validateLedger } from "../contract/src/validate.ts";
import { deterministicUlid } from "../site/lib/metadata.mjs";
import { referencesOf } from "../service/src/read-models.ts";
import { handoffCatalog } from "../scripts/handoff-catalog.mjs";

const repo = path.resolve(import.meta.dirname, "..");
const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
function commit(cwd, message) {
  git(cwd, "add", "-A");
  git(cwd, "-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", message);
}
async function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-service-")));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "database/problems_json"), { recursive: true });
  for (const name of ["actors.json", "metadata.json", "tags.json"]) fs.copyFileSync(path.join(repo, "database", name), path.join(root, "database", name));
  const record = JSON.parse(fs.readFileSync(path.join(repo, "database/problems_json/op_02bb8f8228649ac3.json"), "utf8"));
  const recordPath = path.join(root, "database/problems_json", `${record.id}.json`);
  fs.writeFileSync(recordPath, JSON.stringify(record));
  await exportLedger({ root });
  git(root, "init", "-q", "-b", "main");
  commit(root, "Seed authored catalog");
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true });
  t.after(() => { service.index.close(); service.auth.close(); });
  return { root, record, recordPath, service };
}

test("catalog handoff preserves an admitted identity and writes all derived outputs together", async (t) => {
  const { root, record, service } = await fixture(t);
  const draft = path.join(root, "draft.json");
  fs.writeFileSync(draft, JSON.stringify({ ...record, comment: `${record.comment}\nA reviewed editorial clarification.` }));
  const result = await handoffCatalog({ root, problemId: record.ulid, recordFile: draft });
  assert.equal(result.id, record.id);
  assert.equal(result.ulid, record.ulid);
  assert.ok(fs.existsSync(path.join(root, "database/problems_tex", `${record.id}.tex`)));
  assert.equal(validateLedger(service.repo.roots).issues.length, 0);
  await exportLedger({ root, check: true });
  assert.equal((await handoffCatalog({ root, problemId: record.ulid, recordFile: draft })).changed, 0);
  await assert.rejects(handoffCatalog({ root, problemId: "missing", recordFile: draft }), /admitted/);
  fs.writeFileSync(draft, JSON.stringify({ ...record, id: "op_0123456789abcdef" }));
  await assert.rejects(handoffCatalog({ root, problemId: record.ulid, recordFile: draft }), /Preserve the existing/);
});

test("catalog revisions reach incremental consumers and retain old statements and event sequences", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const before = service.repo.sequences();
  const cursor = service.index.lastSequence();
  const statement = service.repo.current().currentOf("Statement")[0];
  const originalBytes = fs.readFileSync(statement.path, "utf8");
  fs.writeFileSync(recordPath, JSON.stringify({ ...record, title: `${record.title}: clarification`, statement: `${record.statement}\nAn additional hypothesis applies.` }));
  await exportLedger({ root });
  commit(root, "Publish catalog clarification");
  service.repo.refreshIfMoved();
  reindex(service);
  const events = service.index.recordsAfter(cursor, 100);
  assert.deepEqual(events.map((event) => event.type).sort(), ["Problem", "Statement"]);
  for (const [file, sequence] of before) assert.equal(service.repo.sequences().get(file), sequence);
  assert.equal(fs.readFileSync(statement.path, "utf8"), originalBytes);
  assert.equal(service.repo.current().find("Problem", record.ulid).fields.authoredCatalog.record.title, `${record.title}: clarification`);
  assert.equal(service.repo.current().currentOf("Statement").length, 2);
  assert.equal((await exportLedger({ root })).changed, 0);
  const current = service.repo.current().find("Problem", record.ulid);
  const forgedPath = current.path.replace("r2.md", "r3.md");
  fs.writeFileSync(forgedPath, serializeRecord({ ...current.fields, revision: 3, authoredCatalog: { ...current.fields.authoredCatalog, status: "Solved" }, body: current.body }));
  assert.ok(validateLedger(service.repo.roots).issues.some((issue) => /authoredCatalog/.test(issue.message)), "unmanifested API-style revisions cannot change catalog authority");
  fs.rmSync(forgedPath);
  fs.appendFileSync(statement.path, "Unexpected historical edit\n");
  await assert.rejects(exportLedger({ root }), /Export history changed/);
  assert.ok(validateLedger(service.repo.roots).issues.some((issue) => /history changed/.test(issue.message)));
});

test("first-editor bootstrap creates a human, links numeric identity, and is idempotent after auth-store recovery", async (t) => {
  const { service } = await fixture(t);
  assert.throws(() => bootstrapEditor(service, "a-handle", "Editor"), /numeric/);
  const id = bootstrapEditor(service, "123456", "Example Editor");
  assert.equal(service.auth.actorForIdentity("github", "123456"), id);
  const actor = service.repo.current().find("Actor", id);
  assert.equal(actor.fields.kind, "human");
  assert.ok(actor.fields.roles.includes("editor"));
  assert.equal(bootstrapEditor(service, "123456", "Example Editor"), id);
  assert.equal(service.repo.current().revisions.get(id).length, 1);
  service.auth.close();
  service.auth = new AuthStore(":memory:");
  assert.equal(bootstrapEditor(service, "123456", "Example Editor"), id);
  assert.throws(() => bootstrapEditor(service, "987654", "Second Editor"), /already exists/);
  assert.equal(service.repo.current().find("Actor", service.systemActorId).fields.roles.includes("editor"), false);
});

test("bootstrap promotes an existing contributor without replacing their identity or first revision", async (t) => {
  const { service } = await fixture(t);
  const id = ensureHumanActor(service, { id: 123456, login: "example", name: "Example Editor" });
  assert.equal(bootstrapEditor(service, "123456", "Example Editor"), id);
  assert.equal(service.repo.current().revisions.get(id).length, 2);
  assert.deepEqual(service.repo.current().revisions.get(id)[0].fields.roles, ["contributor"]);
  assert.ok(service.repo.current().find("Actor", id).fields.roles.includes("editor"));
});

test("a service clone accepts a versioned catalog update with manifest changes through ordinary sync", async (t) => {
  const { root, record, service: initial } = await fixture(t);
  const remoteRoot = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-remote-")));
  t.after(() => fs.rmSync(remoteRoot, { recursive: true, force: true }));
  const bare = path.join(remoteRoot, "remote.git");
  const author = path.join(remoteRoot, "author");
  git(remoteRoot, "init", "--bare", "-q", "-b", "main", bare);
  git(root, "remote", "add", "origin", bare);
  git(root, "push", "-q", "-u", "origin", "main");
  git(remoteRoot, "clone", "-q", bare, author);
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true, git: { remote: "origin", branch: "main" } });
  t.after(() => { service.index.close(); service.auth.close(); });
  const cursor = initial.index.lastSequence();
  fs.writeFileSync(path.join(author, "database/problems_json", `${record.id}.json`), JSON.stringify({ ...record, comment: `${record.comment}\nAn editorial clarification.` }));
  await exportLedger({ root: author });
  commit(author, "Update catalog with preserved history");
  git(author, "push", "-q", "origin", "main");
  const result = service.repo.synchronize();
  assert.equal(result.refused, null);
  assert.equal(result.pushed, true);
  reindex(service);
  assert.deepEqual(service.index.recordsAfter(cursor, 100).map((row) => row.type), ["Problem"]);
});

test("a newly admitted service proposal can enter the catalog under its original service slug", async (t) => {
  const { root, record, service } = await fixture(t);
  const { submit } = await import("../service/src/write.ts");
  const { newId, nowIso } = await import("../service/src/ids.ts");
  const { catalogState } = await import("../contract/src/derive.ts");
  const author = ensureHumanActor(service, { id: 111, login: "fixture-author", name: "Fixture author" });
  const editor = bootstrapEditor(service, "222", "Fixture editor");
  const problemId = newId(), statementId = newId(), referenceId = newId(), contributionId = newId();
  const stamp = nowIso();
  const originalStatement = service.repo.current().currentOf("Statement")[0];
  const base = { schemaVersion: "1.0", createdBy: author, createdAt: stamp };
  const source = service.repo.current().currentOf("Source")[0];
  const proposal = submit(service, author, [
    { fields: { ...record.metadata, ...base, id: problemId, revision: 1, title: "Synthetic handoff fixture", aliases: ["synthetic-handoff-fixture"] }, body: "Synthetic fixture for catalog identity transfer." },
    { fields: { ...originalStatement.fields, ...base, id: statementId, problemId }, body: originalStatement.body },
    { fields: { ...base, id: referenceId, type: "Reference", revision: 1, sourceId: source.id, targetType: "problem", targetId: problemId, role: "states-problem", locator: "Synthetic test fixture" }, body: "Fixture reference." },
    { fields: { ...base, id: contributionId, type: "Contribution", supersedes: null, title: "Synthetic proposal", kind: "problem-proposal", actorId: author, trajectoryId: null, problemIds: [], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [problemId], newStatementId: statementId, referenceIds: [referenceId], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "none", license: "CC-BY-4.0" }, body: "Synthetic fixture, not a scientific submission." },
  ], "Fixture proposal");
  assert.ok(proposal.ok, JSON.stringify(proposal.issues));
  const draft = path.join(root, "draft.json");
  const opId = "op_1111222233334444";
  fs.writeFileSync(draft, JSON.stringify({ ...record, id: opId, ulid: problemId, aliases: [opId, problemId, "op-1111222233334444"], title: "Synthetic handoff fixture" }));
  await assert.rejects(handoffCatalog({ root, problemId, recordFile: draft }), /admitted/);
  const review = submit(service, editor, [{ fields: {
    ...base, id: newId(), createdBy: editor, type: "Review", supersedes: null, contributionId, reviewerId: editor, trajectoryId: null,
    kind: "verification", independence: { differentOperator: true, differentModelFamily: true, noSharedReads: true },
    conflictOfInterest: { declared: false, statement: "" }, methods: ["scope-check", "citation-check"], checks: [{ name: "Fixture consistency", outcome: "pass", note: "Synthetic test data only." }], verdict: "verified",
  }, body: "Synthetic review for the admission workflow." }], "Fixture review");
  assert.ok(review.ok, JSON.stringify(review.issues));
  assert.equal(catalogState(service.repo.current(), problemId), "published");
  const actorBytes = fs.readFileSync(service.repo.current().find("Actor", author).path);
  const actorRevisions = service.repo.current().revisions.get(author).length;
  const result = await handoffCatalog({ root, problemId, recordFile: draft });
  const afterHandoff = validateLedger(service.repo.roots).ledger;
  assert.equal(afterHandoff.revisions.get(author).length, actorRevisions, "handoff must not create a no-op Actor revision");
  assert.deepEqual(fs.readFileSync(afterHandoff.find("Actor", author).path), actorBytes);
  assert.equal(result.ulid, problemId);
  assert.equal(validateLedger(service.repo.roots).issues.length, 0);
  assert.ok(fs.existsSync(path.join(root, "ledger/problems/synthetic-handoff-fixture/problem.r2.md")));
  const authored = JSON.parse(fs.readFileSync(path.join(root, "database/problems_json", `${opId}.json`), "utf8"));
  assert.ok(authored.aliases.includes("synthetic-handoff-fixture"));
  assert.equal(authored.metadata.createdBy, author);
  await exportLedger({ root, check: true });
});

test("reconciliation preserves independent service edits and requires an explicit choice for colliding fields", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const { submit } = await import("../service/src/write.ts");
  const { newId, nowIso } = await import("../service/src/ids.ts");
  const editor = bootstrapEditor(service, "333", "Fixture editor");
  const current = service.repo.current().find("Problem", record.ulid);
  const serviceTitle = "Title revised by the service";
  const changed = submit(service, editor, [
    { fields: { ...current.fields, revision: 2, title: serviceTitle, createdBy: editor, createdAt: nowIso() }, body: current.body },
    { fields: { id: newId(), type: "Contribution", schemaVersion: "1.0", createdBy: editor, createdAt: nowIso(), supersedes: null, title: "Revise title", kind: "entity-revision", actorId: editor, trajectoryId: null, problemIds: [record.ulid], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: [], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [{ entityId: record.ulid, revision: 2 }], aiInvolvement: "none", license: "CC-BY-4.0" }, body: "Synthetic editor revision." },
  ], "Fixture title revision");
  assert.ok(changed.ok, JSON.stringify(changed.issues));
  const authored = { ...record, comment: `${record.comment}\nAn independent catalog clarification.` };
  fs.writeFileSync(recordPath, JSON.stringify(authored));
  await exportLedger({ root });
  const revised = validateLedger(service.repo.roots).ledger.find("Problem", record.ulid);
  assert.equal(revised.fields.title, serviceTitle);
  assert.equal(revised.fields.revision, 3);
  assert.equal(revised.fields.authoredCatalog.record.comment, authored.comment);
  const bytes = fs.readFileSync(revised.path, "utf8");
  fs.writeFileSync(recordPath, JSON.stringify({ ...authored, title: "An explicitly reconciled title" }));
  await assert.rejects(exportLedger({ root }), /Catalog\/service conflict.*title/);
  assert.equal(fs.readFileSync(revised.path, "utf8"), bytes);
  await exportLedger({ root, reconcileCatalog: true });
  const final = validateLedger(service.repo.roots);
  assert.deepEqual(final.issues, []);
  assert.equal(final.ledger.find("Problem", record.ulid).fields.title, "An explicitly reconciled title");
  assert.equal(final.ledger.find("Problem", record.ulid).fields.revision, 4);
  assert.equal(fs.readFileSync(revised.path, "utf8"), bytes);
});


test("reference renames, removals, merges and reintroductions preserve history and remain exportable", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const original = service.repo.current().currentOf("Reference")[0];
  const originalBytes = fs.readFileSync(original.path);
  const label = record.references[0].label;
  const renamed = JSON.parse(JSON.stringify(record).replaceAll(label, `${label}-fixed`));
  fs.writeFileSync(recordPath, JSON.stringify(renamed));
  await exportLedger({ root });
  let report = validateLedger(service.repo.roots);
  assert.deepEqual(report.issues, []);
  assert.equal(report.ledger.find("Reference", original.id).fields.retired, true);
  assert.deepEqual(fs.readFileSync(original.path), originalBytes);
  assert.equal(referencesOf(report.ledger, record.ulid).length, record.references.length);
  assert.equal((await exportLedger({ root })).changed, 0);
  // Add and merge a second label for the same source.
  renamed.references.push({ ...renamed.references[0], label: `${label}-duplicate`, key: "Duplicate" });
  fs.writeFileSync(recordPath, JSON.stringify(renamed));
  await exportLedger({ root });
  renamed.references.pop();
  fs.writeFileSync(recordPath, JSON.stringify(renamed));
  await exportLedger({ root });
  // Replace the original bibliography entry and remove its authored citations.
  const removed = { ...renamed, source: "unknown", progress: ["Synthetic fixture progress."], comment: "Synthetic fixture.", references: [{ key: "Fixture", label: "ref:replacement", tex: "Synthetic replacement. \\url{https://example.invalid/replacement}" }] };
  fs.writeFileSync(recordPath, JSON.stringify(removed));
  await exportLedger({ root });
  report = validateLedger(service.repo.roots);
  assert.deepEqual(report.issues, []);
  assert.equal(referencesOf(report.ledger, record.ulid).length, 1);
  assert.ok(referencesOf(report.ledger, record.ulid).every((ref) => ref.id !== original.id));
  assert.equal(report.ledger.currentOf("Source").length, 1);
  assert.equal(report.ledger.find("Source", original.fields.sourceId).fields.retired, true);
  assert.equal((await exportLedger({ root })).changed, 0);
  fs.writeFileSync(recordPath, JSON.stringify(record));
  await exportLedger({ root });
  report = validateLedger(service.repo.roots);
  assert.deepEqual(report.issues, []);
  assert.equal(report.ledger.find("Reference", original.id).fields.retired, undefined);
  assert.equal(report.ledger.currentOf("Source").length, 1);
  assert.equal(referencesOf(report.ledger, record.ulid)[0].id, original.id);
  await exportLedger({ root, check: true });
});

test("handoff cannot reconcile conflicts on another catalog problem", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const other = structuredClone(record);
  other.id = "op_1111222233334444";
  other.ulid = deterministicUlid("other-handoff-problem");
  other.aliases = [other.id, other.ulid, "op-1111222233334444"];
  fs.writeFileSync(path.join(root, "database/problems_json", `${other.id}.json`), JSON.stringify(other));
  await exportLedger({ root });
  commit(root, "Second problem fixture");
  service.repo.refreshIfMoved();
  const current = service.repo.current().find("Problem", record.ulid);
  // A valid pinned fixture revision establishes divergent service-side content.
  const revisedPath = current.path.replace("r1.md", "r2.md");
  fs.writeFileSync(revisedPath, serializeRecord({ ...current.fields, revision: 2, title: "Service title", body: current.body }));
  const { createHash } = await import("node:crypto");
  const manifestPath = path.join(root, "ledger/export-manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  manifest.fileHashes[path.relative(root, revisedPath)] = createHash("sha256").update(fs.readFileSync(revisedPath)).digest("hex");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest));
  fs.writeFileSync(recordPath, JSON.stringify({ ...record, title: "Catalog title" }));
  const draft = path.join(root, "draft.json");
  fs.writeFileSync(draft, JSON.stringify({ ...other, comment: "Intended handoff only." }));
  const before = fs.readFileSync(manifestPath);
  await assert.rejects(handoffCatalog({ root, problemId: other.ulid, recordFile: draft }), /Catalog\/service conflict.*title/);
  assert.deepEqual(fs.readFileSync(manifestPath), before, "rejected handoff is atomic");
  assert.equal(validateLedger(service.repo.roots).ledger.find("Problem", record.ulid).fields.title, "Service title");
});

test("catalog reconciliation cannot resurrect a redacted problem", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const current = service.repo.current().find("Problem", record.ulid);
  const tombstone = current.path.replace("r1.md", "r2.md");
  fs.writeFileSync(tombstone, serializeRecord({ id: record.ulid, type: "Problem", schemaVersion: "1.0", revision: 2,
    redacted: true, redactionDecisionId: deterministicUlid("fixture-takedown"), body: "" }));
  fs.writeFileSync(recordPath, JSON.stringify({ ...record, title: "Updated catalog title" }));
  for (const reconcileCatalog of [false, true]) await assert.rejects(exportLedger({ root, reconcileCatalog }), /Refusing to restore redacted/);
  assert.equal(fs.existsSync(current.path.replace("r1.md", "r3.md")), false);
});


test("web login and bootstrap recover the same contributor after auth-store loss and account rename", async (t) => {
  const { service } = await fixture(t);
  const id = ensureHumanActor(service, { id: 123456, login: "old-name", name: "Contributor" });
  const original = service.repo.current().find("Actor", id);
  assert.equal(original.fields.externalIdentity, "github-id:123456");
  service.auth.close();
  service.auth = new AuthStore(":memory:");
  assert.equal(ensureHumanActor(service, { id: 123456, login: "new-name", name: "Contributor" }), id);
  service.auth.close();
  service.auth = new AuthStore(":memory:");
  assert.equal(bootstrapEditor(service, "123456", "Contributor"), id);
  assert.equal(service.repo.current().currentOf("Actor").filter((a) => a.fields.kind === "human").length, 1);
  assert.equal(service.repo.current().revisions.get(id).length, 2);
  assert.equal(service.repo.current().revisions.get(id)[0].path, original.path);
  assert.throws(() => materialize(service.repo.current(), id, [{ ...service.repo.current().find("Actor", id).fields,
    revision: 3, externalIdentity: "github-id:999", body: "" }]), /GitHub identities are assigned/);
});

test("legacy username-only actors require an explicit link instead of silent duplication", async (t) => {
  const { service } = await fixture(t);
  const id = ensureHumanActor(service, { id: 123456, login: "legacy", name: "Contributor" });
  const actor = service.repo.current().find("Actor", id);
  const changed = service.repo.write([{ fields: { ...actor.fields, revision: 2, externalIdentity: "github:legacy" }, body: actor.body }],
    "Legacy actor fixture", { name: "fixture", email: "fixture@example.invalid" });
  assert.ok(changed.ok);
  service.auth.close();
  service.auth = new AuthStore(":memory:");
  assert.throws(() => bootstrapEditor(service, "123456", "Contributor"), /Legacy GitHub actors/);
  assert.throws(() => ensureHumanActor(service, { id: 123456, login: "legacy", name: "Contributor" }), /Legacy GitHub actors/);
  linkGitHubIdentity(service, "123456", id);
  service.auth.close();
  service.auth = new AuthStore(":memory:");
  assert.equal(bootstrapEditor(service, "123456", "Contributor"), id);
  assert.equal(service.repo.current().currentOf("Actor").filter((a) => a.fields.kind === "human").length, 1);
});


test("new catalog bibliography uses export provenance and manifest counts include historical revisions", async (t) => {
  const { root, record, recordPath, service } = await fixture(t);
  const before = Date.now();
  fs.writeFileSync(recordPath, JSON.stringify({ ...record, statement: `${record.statement}\nA revised fixture hypothesis.`,
    references: [...record.references, { label: "ref:later", key: "Later", tex: "Later fixture reference. \\url{https://example.invalid/later}" }] }));
  await exportLedger({ root });
  const report = validateLedger(service.repo.roots);
  assert.deepEqual(report.issues, []);
  const actor = report.ledger.currentOf("Actor").find((a) => a.fields.harness === "scripts/export-ledger.mjs");
  const reference = report.ledger.currentOf("Reference").find((r) => r.fields.locator === "Later");
  const source = report.ledger.find("Source", reference.fields.sourceId);
  const problem = report.ledger.find("Problem", record.ulid);
  for (const entry of [reference, source, problem]) {
    assert.equal(entry.fields.createdBy, actor.id);
    assert.ok(Date.parse(entry.fields.createdAt) >= before);
  }
  const manifestPath = path.join(root, "ledger/export-manifest.json");
  const bytes = fs.readFileSync(manifestPath);
  const manifest = JSON.parse(bytes);
  assert.equal(manifest.counts.Statement, 2);
  assert.equal(manifest.projectionCounts.Statement, 1);
  assert.equal(manifest.counts.Problem, 2);
  assert.notEqual(manifest.generatedAt, manifest.migrationTimestamp);
  assert.ok(Date.parse(manifest.generatedAt) >= before);
  await exportLedger({ root, check: true });
  assert.equal((await exportLedger({ root })).changed, 0);
  assert.deepEqual(fs.readFileSync(manifestPath), bytes);
});
