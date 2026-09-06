import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords } from "../../contract/src/ledger.ts";
import { materialize, PayloadError, type BatchRecord } from "../src/payloads.ts";
import { frontier, taxonomyView } from "../src/read-models.ts";

function fixture() {
  const { records, issues } = loadRecords([fileURLToPath(new URL("../../contract/fixtures/ledger", import.meta.url))]);
  assert.deepEqual(issues, []);
  const ledger = new Ledger(records);
  const problem = ledger.currentOf("Problem")[0]!;
  const editor = ledger.currentOf("Actor").find((actor) => actor.fields["name"] === "Legacy audit editor")!;
  return { ledger, problem, editor };
}

const snapshot = { status: "Solved", sourcePath: "database/problems_json/op_0123456789abcdef.json", record: { customKey: "$ref:literal-note" } };
const readOnly = (error: unknown) => error instanceof PayloadError && error.status === 403 && /read-only/.test(error.message);

test("API payloads cannot add catalog authority to new or existing ordinary problems", () => {
  const { ledger, problem, editor } = fixture();
  const revision = { ...problem.fields, type: "Problem", body: problem.body, revision: 2, authoredCatalog: snapshot } as BatchRecord;
  assert.throws(() => materialize(ledger, editor.id, [revision]), readOnly);
  const { id: _id, ...creation } = revision;
  assert.throws(() => materialize(ledger, editor.id, [{ ...creation, revision: 1 } as BatchRecord]), readOnly);
});

test("imported problem revisions preserve the snapshot when omitted or repeated", () => {
  const { ledger, problem, editor } = fixture();
  problem.fields["authoredCatalog"] = structuredClone(snapshot);
  const { authoredCatalog: _snapshot, ...fields } = problem.fields;
  const revision = { ...fields, type: "Problem", body: problem.body, revision: 2, title: "Revised title" } as BatchRecord;
  for (const record of [revision, { ...revision, authoredCatalog: structuredClone(snapshot) }]) {
    const written = materialize(ledger, editor.id, [record]).records[0]!;
    assert.deepEqual(written.fields["authoredCatalog"], snapshot);
    assert.notEqual(written.fields["authoredCatalog"], problem.fields["authoredCatalog"]);
    assert.equal(written.fields["title"], "Revised title");
  }
});

test("even editors cannot alter or remove imported problem status or custom metadata", () => {
  const { ledger, problem, editor } = fixture();
  problem.fields["authoredCatalog"] = structuredClone(snapshot);
  for (const changed of [null, { ...snapshot, status: "Unsolved" }, { ...snapshot, sourcePath: "other.json" }, { ...snapshot, record: {} }]) {
    const revision = { ...problem.fields, type: "Problem", body: problem.body, revision: 2, authoredCatalog: changed } as BatchRecord;
    assert.throws(() => materialize(ledger, editor.id, [revision]), readOnly);
  }
});

test("the frontier identifies catalog status independently of accepted clause claims", () => {
  const { ledger } = fixture();
  const problem = ledger.currentOf("Problem").find((record) => (record.fields["aliases"] as string[]).includes("theoremdb-p3114-kashaev-volume-conjecture"))!;
  problem.fields["authoredCatalog"] = structuredClone(snapshot);
  const result = frontier(ledger, problem.id)!;
  assert.equal(result.status, "Solved");
  assert.deepEqual(result.statusSource, { kind: "authored-catalog", sourcePath: snapshot.sourcePath });
  assert.ok(result.clauses.every((clause) => clause.status === "open"));
  assert.deepEqual(result.acceptedClaims, []);
});

test("the taxonomy API preserves independent topic membership for browser filters", () => {
  const { ledger } = fixture();
  const taxonomy = ledger.currentOf("Taxonomy")[0]!;
  taxonomy.fields["independentTopics"] = true;
  assert.equal(taxonomyView(ledger)!.independentTopics, true);
});
