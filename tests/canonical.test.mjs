import test from "node:test";
import assert from "node:assert/strict";
import { loadCatalog } from "../core/catalog.mjs";
import { validateCatalog } from "../core/validate.mjs";
import { currentStatement } from "../core/domain.mjs";

const clone = (value) => JSON.parse(JSON.stringify(value));
const catalogWith = (mutate) => {
  const catalog = loadCatalog();
  const bundles = catalog.bundles.map((bundle) => ({ directory: bundle.directory, record: clone(bundle.record) }));
  const next = { ...catalog, bundles, bundleById: new Map(bundles.map((bundle) => [bundle.record.problem.id, bundle])), ledger: clone(catalog.ledger), publishedRevisions: clone(catalog.publishedRevisions) };
  mutate(next);
  return next;
};
const failuresOf = (catalog) => validateCatalog(catalog, { allowStaleLedger: true }).failures;
const hasFailure = (failures, pattern) => failures.some((failure) => pattern.test(failure));

test("the committed catalog validates with a current ledger", () => {
  const { failures } = validateCatalog(loadCatalog());
  assert.deepEqual(failures, []);
});

test("every public record derives exactly one status from an accepted decision", () => {
  const catalog = loadCatalog();
  for (const bundle of catalog.bundles) {
    const accepted = bundle.record.decisions.filter((decision) => decision.outcome === "accepted");
    assert.ok(accepted.length >= 1, `${bundle.record.problem.id} has an accepted decision`);
    assert.ok(currentStatement(bundle.record).targetClauses.length >= 1);
  }
});

test("a claim that cites an unknown target clause is rejected", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes");
    bundle.record.claims[0].targetClauseIds = ["no-such-clause"];
  });
  assert.ok(hasFailure(failuresOf(catalog), /unknown target clause no-such-clause/));
});

test("an accepted claim without evidence is rejected", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes");
    bundle.record.evidence = [];
  });
  assert.ok(hasFailure(failuresOf(catalog), /needs at least one evidence record/));
});

test("evidence must reference a registered source", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("theoremdb-p3114-kashaev-volume-conjecture");
    bundle.record.evidence[0].sourceId = "source-does-not-exist";
  });
  assert.ok(hasFailure(failuresOf(catalog), /unknown source source-does-not-exist/));
});

test("solved status requires every clause to be resolved by an accepted claim", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("krueger-2005-qubit-bi-negativity");
    bundle.record.claims[0].relation = "narrows";
  });
  assert.ok(hasFailure(failuresOf(catalog), /status solved requires every target clause to be resolved/));
});

test("open status conflicts with a resolving claim", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("theoremdb-p3114-kashaev-volume-conjecture");
    bundle.record.claims[0].relation = "resolves";
  });
  assert.ok(hasFailure(failuresOf(catalog), /status open conflicts with a resolved or refuted target clause/));
});

test("research-content edits must update the published-revision manifest", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes");
    bundle.record.problem.question.summary = "A silently edited summary.";
  });
  assert.ok(hasFailure(failuresOf(catalog), /record digest .* differs from the published revision/));
});

test("a published statement version cannot change after publication", () => {
  const catalog = catalogWith((next) => {
    const entry = next.ledger.find((event) => event.type === "statement.published");
    entry.digest = "0".repeat(64);
  });
  assert.ok(hasFailure(failuresOf(catalog), /StatementVersion content changed after publication/));
});

test("a published decision cannot be removed", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("krueger-2005-qubit-bi-negativity");
    bundle.record.decisions.push({ ...bundle.record.decisions[0], id: "decision-replacement", supersedesDecisionId: bundle.record.decisions[0].id, effectiveDate: "2026-08-30", verified: "2026-08-30" });
    bundle.record.decisions.shift();
    bundle.record.decisions[0].supersedesDecisionId = null;
  });
  assert.ok(hasFailure(failuresOf(catalog), /published Decision was removed/));
});

test("a superseding statement must carry a higher version and a later date", () => {
  const catalog = catalogWith((next) => {
    const bundle = next.bundleById.get("theoremdb-p3114-kashaev-volume-conjecture");
    const [first] = bundle.record.statements;
    bundle.record.statements.push({ ...first, id: `${first.id}-next`, version: 1, supersedesStatementId: first.id, created: "2026-08-31" });
    for (const decision of bundle.record.decisions) decision.statementId = `${first.id}-next`;
    for (const claim of bundle.record.claims) claim.statementId = `${first.id}-next`;
  });
  assert.ok(hasFailure(failuresOf(catalog), /statement versions must increase/));
});

test("problem IDs and aliases are globally unique", () => {
  const catalog = catalogWith((next) => {
    next.bundleById.get("theoremdb-p3114-kashaev-volume-conjecture").record.problem.aliases.push("krueger-2005-qubit-bi-negativity");
  });
  assert.ok(hasFailure(failuresOf(catalog), /is already assigned to/));
});

test("entries inherited from the quantum-information lists stay in that field", () => {
  const catalog = catalogWith((next) => {
    next.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes").record.problem.topicId = "quantum-metrology";
  });
  assert.ok(hasFailure(failuresOf(catalog), /must stay in the quantum-information field/));
});
