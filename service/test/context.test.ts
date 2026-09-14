import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords } from "../../contract/src/ledger.ts";
import { statementDigest } from "../../contract/src/digest.ts";
import { contextBundle, currentStatement, frontier, status } from "../src/read-models.ts";
import { Index } from "../src/index.ts";

function fixture() {
  const loaded = loadRecords(["ledger", "activity"].map((dir) => fileURLToPath(new URL(`../../contract/fixtures/${dir}`, import.meta.url))));
  assert.deepEqual(loaded.issues, []);
  const ledger = new Ledger(loaded.records);
  const problem = ledger.currentOf("Problem").find((record) => (record.fields["aliases"] as string[]).includes("example-conformance-problem"))!;
  const statement = ledger.find("Statement", currentStatement(ledger, problem.id)!.id)!;
  const bundle = (budget = 100_000, clauses?: string[]) => {
    const result = contextBundle(ledger, problem.id, clauses, budget);
    assert.ok(result);
    return result;
  };
  return { ledger, problem, statement, bundle };
}

test("context separates authoritative binary status from ledger clause evidence", () => {
  const { problem, bundle } = fixture();
  problem.fields["authoredCatalog"] = { status: "Solved", sourcePath: "database/problems_json/example.json" };
  const result = bundle();
  assert.equal(result.status, "Solved");
  assert.deepEqual(result.statusSource, { kind: "authored-catalog", recordId: problem.id, sourcePath: "database/problems_json/example.json" });
  assert.match(result.sections.find((section) => section.name === "problem")!.text, /Status: Solved/u);
  assert.match(result.sections.find((section) => section.name === "clauses")!.text, /ledger evidence: open/u);
  assert.match(result.sections.find((section) => section.name === "problem")!.text, /independently of the authoritative problem status/u);
});

test("small context budgets omit the formal group intact and advertise its required size", () => {
  const { statement, bundle } = fixture();
  statement.body += "\n\nNecessary definition:\n\\begin{align}\nF(x) &= \\sum_{i=1}^{n} x_i^2 \\\\\n&= \\lVert x \\rVert^2\n\\end{align}\n";
  statement.fields["digest"] = statementDigest(statement.body);
  const full = bundle();
  assert.ok(full.minimumRequiredTokens > 200);
  const small = bundle(full.minimumRequiredTokens - 1);
  assert.equal(small.formalContextComplete, false);
  assert.equal(small.incomplete, true);
  for (const name of ["statement", "clauses"]) {
    const section = small.sections.find((section) => section.name === name)!;
    assert.equal(section.text, "");
    assert.equal(section.omitted, true);
    assert.equal(section.truncated, true);
    assert.ok(section.resourceUris.includes(`qop://records/${statement.id}`));
    assert.ok(small.omittedSections.includes(name));
  }
  assert.ok(!small.shownRecordIds.includes(statement.id));
  assert.ok(!small.included.some((pair) => pair.startsWith(`${statement.id}:`)));
  assert.ok(small.sourcesUsed.some((source) => source.id === statement.id));
  assert.ok(small.approximateTokens <= small.tokenBudget);
  const exact = bundle(full.minimumRequiredTokens);
  assert.equal(exact.formalContextComplete, true);
  assert.equal(exact.sections.find((section) => section.name === "statement")!.text, statement.body);
  assert.ok(exact.shownRecordIds.includes(statement.id));
  assert.equal(exact.budgetSemantics.unit, "approximate-section-tokens");
  assert.ok(exact.budgetSemantics.excludes.includes("model-specific tokenization"));
});

test("selected clauses keep their full text and the shared statement definitions", () => {
  const { ledger, problem, statement, bundle } = fixture();
  const current = currentStatement(ledger, problem.id)!;
  const selected = current.clauses[1]!;
  const ref = `${current.id}#${selected.id}`;
  const result = bundle(100_000, [ref]);
  assert.deepEqual(result.clauseIds, [ref]);
  assert.equal(result.sections.find((section) => section.name === "statement")!.text, statement.body);
  const text = result.sections.find((section) => section.name === "clauses")!.text;
  assert.ok(text.includes(selected.text));
  assert.ok(text.includes(selected.resolutionCriteria));
  assert.ok(!text.includes(current.clauses[0]!.text));
  assert.throws(() => bundle(100_000, [`${current.id}#unknown`]), /unknown clause/u);
});

test("formal completeness includes kind and quantity definitions that appear only in clause metadata", () => {
  const { ledger, problem, statement, bundle } = fixture();
  const authored = currentStatement(ledger, problem.id)!;
  const clause = authored.clauses[1]!;
  clause.text = "Determine a bound for the quantity defined in the structured clause metadata.";
  clause.resolutionCriteria = "Prove a bound in the specified direction.";
  clause.quantity = { name: "Fixture-only spectral defect", symbol: "\\Delta_{\\mathrm{fixture}}", direction: "upper" };
  statement.body = "";
  statement.fields["digest"] = statementDigest(statement.body);
  const ref = `${authored.id}#${clause.id}`;
  const full = bundle(100_000, [ref]);
  assert.equal(full.formalContextComplete, true);
  const clauseSection = full.sections.find((section) => section.name === "clauses")!;
  assert.equal(clauseSection.required, true);
  const text = clauseSection.text;
  const metadataLine = text.split("\n").find((line) => line.startsWith("Formal metadata (JSON): "))!;
  assert.deepEqual(JSON.parse(metadataLine.slice("Formal metadata (JSON): ".length)), { kind: clause.kind, quantity: clause.quantity });
  const requiredChars = full.sections.filter((section) => section.required).reduce((sum, section) => sum + section.text.length, 0);
  assert.equal(full.minimumRequiredTokens, Math.ceil(requiredChars / 4));
  assert.equal(clauseSection.approximateTokens, Math.ceil(text.length / 4));
  assert.equal(bundle(Math.max(200, full.minimumRequiredTokens), [ref]).formalContextComplete, true);
});

test("service status advertises the actual context contract for deployment preflight", () => {
  const { ledger, bundle } = fixture();
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map());
    assert.equal(status(ledger, index, "1").contextSchemaVersion, "qop-context/2");
    assert.equal(status(ledger, index, "1").contextSchemaVersion, bundle().schemaVersion);
  } finally { index.close(); }
});

test("context retains accepted bounds and support across statement lineage", () => {
  const { ledger, problem, statement } = fixture();
  const old = currentStatement(ledger, problem.id)!;
  const id = "01MZZZZZZZZZZZZZZZZZZZZZZZ";
  const successor = {
    ...statement, id,
    fields: { ...statement.fields, id, version: 2, supersedes: old.id, clauses: old.clauses.map((clause) => ({ ...clause, supersedesClauseId: `${old.id}#${clause.id}` })) },
  };
  const updated = new Ledger([...ledger.records, successor]);
  const ref = `${id}#${old.clauses[1]!.id}`;
  const result = contextBundle(updated, problem.id, [ref], 100_000)!;
  assert.equal(result.statementVersion, 2);
  const claims = JSON.parse(result.sections.find((section) => section.name === "acceptedClaims")!.text);
  assert.equal(claims.length, 1);
  assert.equal(claims[0].id, frontier(updated, problem.id)!.acceptedClaims[0]!.id);
  assert.equal(claims[0].bound.value, "1/2");
  assert.equal(claims[0].bound.conditions, "symmetric subfamily only");
  assert.equal(claims[0].support[0].locator, "Section 3");
  assert.ok(claims[0].body.includes("symmetric subfamily"));
  assert.ok(result.sourcesUsed.some((source) => source.id === old.id));
  assert.ok(result.sourcesUsed.some((source) => source.id === claims[0].support[0].artifactId));
  assert.ok(!result.shownRecordIds.includes(old.id));
});

test("bundle identities cover delivered budgets, content, source revisions and supporting decisions", () => {
  const { ledger, problem, bundle } = fixture();
  const first = bundle();
  assert.equal(bundle().bundleId, first.bundleId);
  assert.notEqual(bundle(200).bundleId, bundle(250).bundleId);
  problem.body += "\nAdditional published progress.";
  const edited = bundle();
  assert.notEqual(edited.bundleId, first.bundleId);
  problem.fields["revision"] = Number(problem.fields["revision"]) + 1;
  const revised = bundle();
  assert.notEqual(revised.bundleId, edited.bundleId);
  const source = ledger.find("Source", revised.sourcesUsed.find((item) => item.type === "Source")!.id)!;
  source.fields["title"] = "Updated bibliography title";
  const bibliographyChanged = bundle();
  assert.notEqual(bibliographyChanged.bundleId, revised.bundleId);
  source.fields["revision"] = Number(source.fields["revision"]) + 1;
  const bibliographyRevised = bundle();
  assert.notEqual(bibliographyRevised.bundleId, bibliographyChanged.bundleId);
  assert.equal(bibliographyRevised.sourcesUsed.find((item) => item.id === source.id)!.revision, source.fields["revision"]);
  const decision = ledger.find("Decision", bibliographyRevised.sourcesUsed.find((item) => item.type === "Decision")!.id)!;
  decision.body += "\nDecision provenance update.";
  assert.notEqual(bundle().bundleId, bibliographyRevised.bundleId);
  for (const resource of bundle().resources) {
    assert.equal(resource.resolution, "current");
    assert.equal(resource.uri, `qop://records/${resource.id}`);
    assert.match(resource.digest, /^sha256:[a-f0-9]{64}$/u);
  }
});

test("optional sections are kept whole or omitted and invalid budgets fail explicitly", () => {
  const { problem, bundle } = fixture();
  problem.body = `${"Long background. ".repeat(2000)}\n$$x^2+y^2=1$$`;
  const minimum = bundle().minimumRequiredTokens;
  const result = bundle(minimum + 100);
  assert.equal(result.formalContextComplete, true);
  const background = result.sections.find((section) => section.name === "background")!;
  assert.equal(background.text, "");
  assert.equal(background.omitted, true);
  assert.ok(result.approximateTokens <= result.tokenBudget);
  for (const invalid of [199, 0, -1, 200.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => bundle(invalid), /safe integer of at least 200/u);
  }
});
