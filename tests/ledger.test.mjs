import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../core/catalog.mjs";
import { deriveCanonicalObjects, planLedgerUpdate, verifyLedgerStructure } from "../core/ledger.mjs";

const clone = (value) => JSON.parse(JSON.stringify(value));
const withRecord = (id, mutate) => {
  const catalog = loadCatalog();
  const bundles = catalog.bundles.map((bundle) => ({ directory: bundle.directory, record: clone(bundle.record) }));
  const next = { ...catalog, bundles, bundleById: new Map(bundles.map((bundle) => [bundle.record.problem.id, bundle])) };
  mutate(next.bundleById.get(id).record);
  return next;
};

test("the ledger is contiguous, unique, and current", () => {
  const catalog = loadCatalog();
  assert.deepEqual(verifyLedgerStructure(catalog.ledger), []);
  const plan = planLedgerUpdate(catalog);
  assert.deepEqual(plan.errors, []);
  assert.equal(plan.appended.length, 0);
  assert.equal(catalog.ledger.at(-1).sequence, catalog.ledger.length);
});

test("every canonical object of every public record has a ledger entry", () => {
  const catalog = loadCatalog();
  const keys = new Set(catalog.ledger.map((entry) => `${entry.objectType}:${entry.objectId}`));
  for (const object of deriveCanonicalObjects(catalog)) {
    assert.ok(keys.has(`${object.objectType}:${object.objectId}`), `${object.objectId} is in the ledger`);
  }
});

test("a new claim with evidence appends sequenced events", () => {
  const catalog = withRecord("theoremdb-p3114-kashaev-volume-conjecture", (record) => {
    record.claims.push({ kind: "Claim", id: "claim-test-new", statementId: record.statements[0].id, targetClauseIds: ["volume-limit"], relation: "narrows", title: "New", text: "New claim" });
    record.evidence.push({ kind: "Evidence", id: "evidence-test-new", claimId: "claim-test-new", sourceId: "source-kashaev-1997", sourceLocator: null, date: "2026-08-30", maturity: "Preprint", strength: "Exact special case", label: "Test" });
  });
  const plan = planLedgerUpdate(catalog);
  assert.deepEqual(plan.errors, []);
  assert.deepEqual(plan.appended.map((event) => event.type), ["claim.accepted", "evidence.recorded"]);
  assert.equal(plan.appended[0].sequence, catalog.ledger.length + 1);
  assert.equal(plan.appended[1].sequence, catalog.ledger.length + 2);
  assert.match(plan.appended[0].id, /^cevt-\d{6}-[a-f0-9]{8}$/);
});

test("editing a claim appends a revision event instead of rewriting history", () => {
  const catalog = withRecord("theoremdb-p3114-kashaev-volume-conjecture", (record) => {
    record.claims[0].text = `${record.claims[0].text} (typo fixed)`;
  });
  const plan = planLedgerUpdate(catalog);
  assert.deepEqual(plan.errors, []);
  assert.deepEqual(plan.appended.map((event) => event.type), ["claim.revised"]);
});

test("removing a claim appends a removal event", () => {
  const catalog = withRecord("theoremdb-p3114-kashaev-volume-conjecture", (record) => {
    const [removed] = record.claims.splice(1, 1);
    record.evidence = record.evidence.filter((item) => item.claimId !== removed.id);
  });
  const plan = planLedgerUpdate(catalog);
  assert.deepEqual(plan.errors, []);
  assert.deepEqual(plan.appended.map((event) => event.type).sort(), ["claim.removed", "evidence.removed"]);
});

test("editing an immutable decision is refused", () => {
  const catalog = withRecord("theoremdb-p3114-kashaev-volume-conjecture", (record) => {
    record.decisions[0].rationale = "Rewritten rationale";
  });
  const plan = planLedgerUpdate(catalog);
  assert.equal(plan.appended.length, 0);
  assert.match(plan.errors[0], /Decision content changed after publication/);
});

test("ledger structure checks catch gaps and duplicates", () => {
  const catalog = loadCatalog();
  const broken = catalog.ledger.slice(0, 3).map((entry) => ({ ...entry }));
  broken[2].sequence = 5;
  assert.match(verifyLedgerStructure(broken)[0], /breaks the contiguous order/);
  const duplicated = catalog.ledger.slice(0, 2).map((entry) => ({ ...entry }));
  duplicated[1].id = duplicated[0].id;
  assert.ok(verifyLedgerStructure(duplicated).some((error) => /duplicate event ID/.test(error)));
});
