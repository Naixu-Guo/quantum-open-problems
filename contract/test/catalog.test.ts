import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords } from "../src/ledger.ts";
import { validateRecordShape } from "../src/validate.ts";
import { catalogState, consistencyErrors, isIndexed, problemStatus } from "../src/derive.ts";
import type { Decision } from "../src/types/decision.ts";
import { rules as problemRules, type Problem } from "../src/types/problem.ts";
import { rules as taxonomyRules, type Taxonomy } from "../src/types/taxonomy.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const roots = [path.join(here, "..", "fixtures", "ledger"), path.join(here, "..", "fixtures", "activity")];
const fixture = () => new Ledger(loadRecords(roots).records);
const candidate = (ledger: Ledger) => ledger.currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes("v2-quantum-capacity-qubit-pauli-channel"))!;

test("an authored solved problem is published without fabricating accepted claims or reviews", () => {
  const original = fixture();
  const problem = candidate(original);
  const authoredCatalog = { status: "Solved", sourcePath: "database/problems_json/op_0123456789abcdef.json", record: { customKey: "retained" } };
  const imported = { ...problem, fields: { ...problem.fields, authoredCatalog, aliases: [...problem.fields["aliases"] as string[], "op_0123456789abcdef", problem.id] } };
  const ledger = new Ledger(original.records.map((r) => r === problem ? imported : r));
  assert.deepEqual(validateRecordShape({ ...imported.fields, body: imported.body }), []);
  assert.equal(problemStatus(ledger, problem.id), "Solved");
  assert.equal(catalogState(ledger, problem.id), "published");
  assert.equal(isIndexed(ledger, problem.id), true);
  assert.deepEqual(consistencyErrors(ledger), []);
  assert.equal(ledger.currentOf("Review").length, original.currentOf("Review").length);
  assert.equal(ledger.currentOf("Decision").length, original.currentOf("Decision").length);
  const baseRecord = ledger.currentOf("Decision")[0]!;
  const baseDecision = { ...baseRecord.fields, body: baseRecord.body } as unknown as Decision;
  const overrides = ([{ kind: "status", status: "Unsolved" }, { kind: "retire" }, { kind: "merge" }] satisfies Partial<Decision>[]).map((extra, i): Decision => ({ ...baseDecision, id: `decision-${i}`, effectiveAt: "2026-09-05T00:00:00Z", createdAt: "2026-09-05T00:00:00Z", outcome: "accepted", targetType: "problem", targetId: problem.id, ...extra }));
  assert.equal(problemStatus(ledger, problem.id, overrides), "Solved");
  assert.equal(catalogState(ledger, problem.id, overrides.slice(0, 2)), "retired");
  assert.equal(catalogState(ledger, problem.id, overrides), "merged");
});

test("research statuses reject all legacy values while clause status remains detailed", () => {
  const ledger = fixture();
  const decision = ledger.currentOf("Decision").find((d) => d.fields["kind"] === "status")!;
  for (const status of ["open", "partial", "solved", "refuted", "Unknown"]) {
    assert.ok(validateRecordShape({ ...decision.fields, status, body: decision.body }).length > 0, status);
  }
  for (const status of ["Solved", "Unsolved"]) {
    assert.deepEqual(validateRecordShape({ ...decision.fields, status, body: decision.body }), []);
  }
});

test("ordinary revisions cannot change, add, or remove authored catalog snapshots", () => {
  const original = fixture();
  const record = candidate(original);
  const authoredCatalog = { status: "Solved" as const, sourcePath: "database/problems_json/op_0123456789abcdef.json" };
  const problem = { ...record.fields, body: record.body, authoredCatalog } as unknown as Problem;
  const imported = { ...record, fields: { ...record.fields, authoredCatalog } };
  const ledger = new Ledger(original.records.map((r) => r === record ? imported : r));
  assert.deepEqual(problemRules({ ...problem, revision: 2 }, ledger), []);
  assert.ok(problemRules({ ...problem, revision: 2, authoredCatalog: { ...authoredCatalog, status: "Unsolved" } }, ledger).some((message) => message.includes("authoredCatalog")));
  const removed = { ...problem, revision: 2 };
  delete removed.authoredCatalog;
  assert.ok(problemRules(removed, ledger).some((message) => message.includes("authoredCatalog")));
  assert.ok(problemRules({ ...problem, revision: 2 }, original).some((message) => message.includes("authoredCatalog")));
});

test("independent topics support no parent area without weakening default taxonomy rules", () => {
  const ledger = fixture();
  const record = ledger.currentOf("Taxonomy")[0]!;
  const taxonomy = { ...record.fields, body: record.body } as unknown as Taxonomy;
  const independent = { ...taxonomy, independentTopics: true, topics: taxonomy.topics.map((topic) => ({ ...topic, areaId: null })) };
  assert.deepEqual(validateRecordShape(independent as unknown as Record<string, unknown>), []);
  assert.deepEqual(taxonomyRules(independent, ledger), []);
  assert.ok(taxonomyRules({ ...independent, independentTopics: false }, ledger).length > 0);
  assert.ok(taxonomyRules({ ...independent, topics: [{ ...independent.topics[0]!, areaId: "unknown-area" }] }, ledger).some((message) => message.includes("unknown area")));
});
