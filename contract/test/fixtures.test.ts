import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLedger } from "../src/validate.ts";
import { summarizeProblems, contributionState, verificationLevel } from "../src/derive.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const roots = [path.join(here, "..", "fixtures", "ledger"), path.join(here, "..", "fixtures", "activity")];

test("fixture ledger validates without issues", () => {
  const { issues } = validateLedger(roots);
  assert.deepEqual(issues, []);
});

test("derived state of the fixture problems", () => {
  const { ledger } = validateLedger(roots);
  const byAlias = new Map(summarizeProblems(ledger).map((summary) => [summary.alias, summary]));

  const binegativity = byAlias.get("krueger-2005-qubit-bi-negativity");
  assert.equal(binegativity?.catalogState, "published");
  assert.equal(binegativity?.status, "solved");
  assert.equal(binegativity?.clauses[0]?.status, "resolved");

  const ruskai = byAlias.get("ruskai-2007-multiplicativity-p2-channel-classes");
  assert.equal(ruskai?.status, "partial");
  assert.equal(ruskai?.clauses[0]?.status, "partial");

  const kashaev = byAlias.get("theoremdb-p3114-kashaev-volume-conjecture");
  assert.equal(kashaev?.status, "open");
  assert.equal(kashaev?.clauses[0]?.status, "open");

  const pauli = byAlias.get("v2-quantum-capacity-qubit-pauli-channel");
  assert.equal(pauli?.catalogState, "candidate");
  assert.equal(pauli?.indexed, false);

  const example = byAlias.get("example-conformance-problem");
  assert.equal(example?.catalogState, "published");
  assert.equal(example?.status, "partial");

  const auxiliary = byAlias.get("example-auxiliary-lemma");
  assert.equal(auxiliary?.role, "auxiliary");
  assert.equal(auxiliary?.catalogState, "published");
  assert.equal(auxiliary?.status, "refuted");
  assert.equal(auxiliary?.indexed, false);
});

test("attempt report in the fixtures is ai-verified", () => {
  const { ledger } = validateLedger(roots);
  const report = ledger.currentOf("Contribution").find((record) => record.fields["kind"] === "attempt-report");
  assert.ok(report, "an attempt report exists");
  assert.equal(contributionState(ledger, report.id), "accepted");
  assert.equal(verificationLevel(ledger, report.id), "ai-verified");
});
