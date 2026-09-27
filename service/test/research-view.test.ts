import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords } from "../../contract/src/ledger.ts";
import { validateLedger, validateRecordShape } from "../../contract/src/validate.ts";
import { materialize } from "../src/payloads.ts";
import { contextBundle, contributionView, currentStatement, frontier, problemView, sourceSummary, status } from "../src/read-models.ts";
import { currentDecisions } from "../../contract/src/derive.ts";
import { rules as problemRules } from "../../contract/src/types/problem.ts";
import type { Problem } from "../../contract/src/types/problem.ts";
import { Index } from "../src/index.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));

function load(...directories: string[]) {
  if (!directories.includes("ledger")) {
    const loaded = loadRecords(directories.map((directory) => path.join(root, directory)));
    assert.deepEqual(loaded.issues, []);
    return new Ledger(loaded.records);
  }
  const checked = validateLedger(directories.map((directory) => path.join(root, directory)), path.join(root, "contract/schema"), path.join(root, "contract/policy"));
  assert.deepEqual(checked.issues, []);
  return checked.ledger;
}

function fixture() {
  const ledger = load("contract/fixtures/ledger", "contract/fixtures/activity");
  const problem = ledger.currentOf("Problem").find((record) => (record.fields["aliases"] as string[]).includes("example-conformance-problem"))!;
  return { ledger, problem };
}

test("all maintained authored problems retain every source, progress, comment, bibliography and formal clause", () => {
  const ledger = load("ledger");
  const files = fs.readdirSync(path.join(root, "database/problems_json")).filter((name) => name.endsWith(".json"));
  assert.ok(files.length > 0);
  for (const file of files) {
    const authored = JSON.parse(fs.readFileSync(path.join(root, "database/problems_json", file), "utf8"));
    const full = problemView(ledger, authored.ulid)!;
    const compact = problemView(ledger, authored.ulid, true, "research")!;
    assert.ok(full, file);
    assert.equal(full.view, "full");
    assert.equal(compact.view, "research");
    assert.equal(full.research.schemaVersion, "qop-research/1");
    assert.equal(full.research.available, true);
    assert.deepEqual(full.research, compact.research);
    assert.deepEqual(full.research.source.map((entry) => entry.text), [authored.source], file);
    assert.deepEqual(full.research.progress.map((entry) => entry.text), authored.progress, file);
    assert.deepEqual(full.research.comment.map((entry) => entry.text), [authored.comment], file);
    assert.deepEqual(full.research.references.map((entry) => ({ key: entry.key, label: entry.label, tex: entry.text })), authored.references, file);
    const source = ledger.find("Problem", authored.ulid)!;
    assert.equal((full as Record<string, unknown>)["body"], source.body);
    assert.equal(Object.hasOwn(compact, "body"), false);
    assert.equal(Object.hasOwn((compact as Record<string, unknown>)["authoredCatalog"] as object, "record"), false);
    assert.deepEqual(compact.statement, full.statement);
    assert.ok(compact.statement!.clauses.some((clause) => clause.text === authored.statement));
    assert.deepEqual(compact.references, full.references);
    assert.deepEqual(compact.comments, full.comments);
    assert.deepEqual(compact.decisions, full.decisions);
    assert.equal(compact.status, authored.status);
    assert.equal(compact.statusSource.kind, "authored-catalog");
    assert.equal(compact.difficulty, authored.metadata.difficulty);
    assert.deepEqual(compact.provenance, full.provenance);
    for (const section of ["source", "progress", "comment", "references"] as const) {
      for (const [index, entry] of full.research[section].entries()) {
        assert.equal(entry.textFormat, "tex");
        assert.equal(entry.provenance.recordId, source.id);
        assert.equal(entry.provenance.revision, source.fields["revision"]);
        assert.equal(entry.provenance.digest, full.provenance.digest);
        assert.equal(entry.provenance.locator, `${section}:${index}`);
        assert.equal(entry.provenance.locatorScope, "record-revision");
        assert.equal(entry.provenance.resourceResolution, "current");
        const keys = new Set(authored.references.map((reference: { key: string }) => reference.key));
        assert.ok(entry.citationKeys.every((key) => keys.has(key)), `${file} ${section}:${index}`);
      }
    }
  }
});

test("Petz CMI preserves the submission date, exact counterexamples and local verification limits without inventing scientific dates", () => {
  const ledger = load("ledger");
  const problem = ledger.currentOf("Problem").find((record) => (record.fields["aliases"] as string[]).includes("op_87c77263c8bab523"))!;
  const detail = problemView(ledger, problem.id, false, "research")!;
  assert.equal(detail.status, "Solved");
  assert.match(detail.research.progress[0]!.text, /10 September 2026/u);
  assert.match(detail.research.progress[0]!.text, /-0\.004412/u);
  assert.deepEqual(detail.research.progress[0]!.citationKeys, ["Pet26"]);
  assert.match(detail.research.comment[0]!.text, /neither result has external peer review or a\s+proof-assistant kernel check/u);
  assert.match(detail.research.comment[0]!.text, /no historical-priority claim is asserted/u);
  assert.deepEqual(detail.research.comment[0]!.citationKeys, ["Pet26", "QOP26"]);
  assert.match(detail.research.references.find((reference) => reference.key === "Pet26")!.text, /12 September 2026/u);
  assert.deepEqual(frontier(ledger, problem.id)!.acceptedClaims, []);
  for (const invented of ["solvedAt", "submittedAt", "verifiedAt", "reviewedAt"]) {
    assert.equal(Object.hasOwn(detail, invented), false);
    assert.equal(Object.hasOwn(detail.research, invented), false);
    assert.ok(detail.research.progress.every((entry) => !Object.hasOwn(entry, invented)));
  }
});

test("research locators are revision scoped, citation keys are explicit, and provenance agrees with context bundles", () => {
  const { ledger, problem } = fixture();
  const longText = `${"An unabridged mathematical qualification. ".repeat(500)}\\sourcecite{ref:first}{A24} and \\sourcecite {ref:second} {B25}, again \\sourcecite{ref:first}{A24}.`;
  problem.fields["authoredCatalog"] = {
    status: "Solved", sourcePath: "database/problems_json/fixture.json",
    record: { source: "Source attribution", progress: [longText], comment: "Locally checked only.", references: [{ key: "A24", label: "ref:first", tex: "Full bibliography A." }, { key: "B25", label: "ref:second", tex: "Full bibliography B." }] },
  };
  const first = problemView(ledger, problem.id)!;
  assert.equal(first.research.progress[0]!.text, longText);
  assert.deepEqual(first.research.progress[0]!.citationKeys, ["A24", "B25"]);
  assert.match(first.research.semantics, /not accepted ledger claims or reviews/u);
  const context = contextBundle(ledger, problem.id, undefined, 100_000)!;
  const contextSource = context.sourcesUsed.find((source) => source.id === problem.id)!;
  assert.equal(first.provenance.digest, contextSource.digest);
  assert.equal(first.provenance.revision, contextSource.revision);
  const reordered = Object.fromEntries(Object.entries(problem.fields).reverse());
  problem.fields = reordered;
  assert.equal(problemView(ledger, problem.id)!.provenance.digest, first.provenance.digest);
  problem.fields["revision"] = Number(problem.fields["revision"]) + 1;
  const second = problemView(ledger, problem.id)!;
  assert.equal(second.research.progress[0]!.provenance.locator, "progress:0");
  assert.notEqual(second.provenance.revision, first.provenance.revision);
  assert.notEqual(second.provenance.digest, first.provenance.digest);
});

test("native ledger research view keeps the body, statement definitions, clause conditions, discussions and honest unrated difficulty", () => {
  const { ledger, problem } = fixture();
  delete problem.fields["difficulty"];
  const statement = ledger.find("Statement", currentStatement(ledger, problem.id)!.id)!;
  statement.body += "\nShared definitions required by every clause.";
  const full = problemView(ledger, problem.id)!;
  const compact = problemView(ledger, problem.id, false, "research")!;
  assert.equal(compact.research.available, false);
  assert.match(compact.research.unavailableReason!, /does not imply/u);
  assert.equal((compact as Record<string, unknown>)["body"], problem.body);
  assert.equal(compact.difficulty, "unrated");
  assert.deepEqual(compact.statement, full.statement);
  assert.equal(compact.statement!.body, statement.body);
  assert.ok(compact.statement!.clauses[1]!.quantity);
  assert.deepEqual(compact.comments, full.comments);
  assert.deepEqual(compact.decisions, full.decisions);
  assert.equal(compact.statusSource.kind, "decision");
  assert.ok(compact.decisions.some((decision) => decision.id === compact.statusSource.recordId));
  const withoutActivity = load("contract/fixtures/ledger");
  const withoutDecisions = new Ledger(withoutActivity.records.filter((record) => record.type !== "Decision"));
  assert.equal(problemView(withoutDecisions, problem.id)!.statusSource.kind, "default");
  assert.equal(problemView(ledger, "missing"), null);
});

test("decision projections preserve the original ledger rationale for problems, frontiers and contributions", () => {
  const { ledger } = fixture();
  const current = currentDecisions(ledger);
  let checked = 0;
  for (const problem of ledger.currentOf("Problem")) {
    const detail = problemView(ledger, problem.id, false, "research")!;
    const relevant = current.filter(decision => decision.targetType === "problem" && decision.targetId === problem.id);
    assert.deepEqual(detail.decisions.map(decision => decision.id), relevant.map(decision => decision.id));
    for (const decision of detail.decisions) {
      const original = ledger.find("Decision", decision.id)!;
      assert.ok(original.body.length > 0);
      assert.equal(decision.body, original.body);
      checked++;
    }
    const statusDecision = frontier(ledger, problem.id)?.statusDecision;
    if (statusDecision) assert.equal(statusDecision.body, ledger.find("Decision", statusDecision.id)!.body);
  }
  for (const contribution of ledger.currentOf("Contribution")) {
    for (const decision of contributionView(ledger, contribution.id)!.decisions) {
      assert.equal(decision.body, ledger.find("Decision", decision.id)!.body);
      checked++;
    }
  }
  assert.ok(checked > 3, "Exercise real status, admission and contribution decisions");
});

test("source summaries preserve citation text and bibliographic version, and digest every current field", () => {
  const { ledger } = fixture();
  const source = ledger.currentOf("Source")[0]!;
  source.fields["version"] = "2";
  const initial = sourceSummary(ledger, source.id)!;
  assert.equal(initial.version, "2");
  assert.equal(initial.revision, source.fields["revision"]);
  assert.equal(initial.citation, source.body);
  assert.match(initial.digest, /^sha256:[a-f0-9]{64}$/u);
  source.fields = Object.fromEntries(Object.entries(source.fields).reverse());
  assert.equal(sourceSummary(ledger, source.id)!.digest, initial.digest, "Field ordering is not a content edit");
  let digest = initial.digest;
  for (const change of [() => { source.body += "\nA revised locator and qualification."; },
    () => { source.fields["version"] = "3"; }, () => { source.fields["revision"] = Number(source.fields["revision"]) + 1; },
    () => { source.fields["retired"] = true; }]) {
    change();
    const next = sourceSummary(ledger, source.id)!;
    assert.notEqual(next.digest, digest);
    digest = next.digest;
  }
  assert.equal(sourceSummary(ledger, source.id)!.retired, true);
  const tombstone = { id: source.id, type: "Source", schemaVersion: source.fields["schemaVersion"],
    revision: Number(source.fields["revision"]) + 1, redacted: true, redactionDecisionId: ledger.currentOf("Decision")[0]!.id, body: "" };
  assert.deepEqual(validateRecordShape(tombstone), []);
  const { body, ...fields } = tombstone;
  const redacted = new Ledger([...ledger.records, { ...source, fields, body, redacted: true }]);
  const safe = sourceSummary(redacted, source.id)!;
  assert.equal(safe.redacted, true);
  assert.equal(safe.citation, "");
  assert.equal(safe.title, undefined);
  assert.equal(safe.version, undefined);
  assert.notEqual(safe.digest, digest);
});

test("retrieval capability is advertised without changing the context schema or budget semantics", () => {
  const { ledger, problem } = fixture();
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map());
    const capabilities = status(ledger, index, "1");
    assert.equal(capabilities.retrievalVersion, "qop-retrieval/1");
    assert.equal(capabilities.contextSchemaVersion, "qop-context/2");
    const context = contextBundle(ledger, problem.id, undefined, 200)!;
    assert.equal(context.schemaVersion, "qop-context/2");
    assert.equal(context.budgetSemantics.unit, "approximate-section-tokens");
  } finally { index.close(); }
});


test("research view retains post-import body revisions and omits only proven duplicate imports", () => {
  const ledger = load("ledger");
  const original = ledger.currentOf("Problem")[0]!;
  const actor = ledger.currentOf("Actor")[0]!.id;
  const marker = "Additional service background: this route assumes finite-dimensional Hilbert spaces.";
  const batch = materialize(ledger, actor, [{ ...original.fields, type: "Problem", revision: Number(original.fields["revision"]) + 1, body: `${original.body}\n\n${marker}` }]);
  const changed = { ...original, fields: batch.records[0]!.fields, body: batch.records[0]!.body,
    path: `${original.path}.test-r2`, relPath: `${original.relPath}.test-r2` };
  assert.deepEqual(validateRecordShape({ ...changed.fields, body: changed.body }, path.join(root, "contract/schema")), []);
  const revised = new Ledger([...ledger.records, changed]);
  for (const revision of ledger.catalogExports) revised.catalogExports.add(revision);
  for (const [id, projection] of ledger.catalogProblemProjections) revised.catalogProblemProjections.set(id, projection);
  const compact = problemView(revised, original.id, false, "research")!;
  const full = problemView(revised, original.id)!;
  assert.equal((compact as Record<string, unknown>)["body"], changed.body);
  assert.equal(compact.bodyDisposition, "included");
  assert.deepEqual(compact.research, full.research);
  assert.deepEqual(compact.statement, full.statement);
  assert.ok(JSON.stringify(compact).includes(marker));

  // Replacing only body is a legal service revision: the authored snapshot must
  // remain available even when no generated Markdown background survives.
  changed.body = marker;
  assert.deepEqual(problemRules({ ...changed.fields, body: changed.body } as unknown as Problem, revised), []);
  const retainedResearch = problemView(revised, original.id, false, "research")!.research;
  const context = contextBundle(revised, original.id, undefined, 1_000_000)!;
  assert.equal(context.incomplete, false);
  assert.equal(context.sections.find(section => section.name === "background")!.text, marker);
  for (const [section, field] of [["authoredSource", "source"], ["authoredProgress", "progress"],
    ["authoredComment", "comment"], ["authoredReferences", "references"]] as const) {
    const value = JSON.parse(context.sections.find(item => item.name === section)!.text);
    assert.deepEqual(value.entries, retainedResearch[field]);
    assert.match(value.semantics, /not accepted ledger claims or reviews/u);
  }

  changed.body = original.body;
  const metadataOnly = problemView(revised, original.id, false, "research")!;
  assert.equal(Object.hasOwn(metadataOnly, "body"), false, "Unchanged body still matches the desired catalog projection");
  assert.equal(metadataOnly.bodyDisposition, "omitted-duplicate-import");
  const deduplicated = contextBundle(revised, original.id, undefined, 1_000_000)!;
  assert.equal(deduplicated.sections.find(section => section.name === "background")!.text, "");
  assert.equal(deduplicated.sections.find(section => section.name === "background")!.omitted, false);
  assert.ok(deduplicated.sections.find(section => section.name === "authoredProgress")!.text.length > 0);

  const unverified = new Ledger(ledger.records);
  assert.equal((problemView(unverified, original.id, false, "research") as Record<string, unknown>)["body"], original.body,
    "Without validated import provenance retain the body conservatively");
});
