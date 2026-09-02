import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { loadCatalog, schemaDirectory } from "../core/catalog.mjs";
import { clauseState } from "../core/domain.mjs";
import { frontierConsistencyErrors, projectFrontier } from "../core/projection/frontier.mjs";
import { publicBundles } from "../core/projection/api-v1.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";

const catalog = loadCatalog();
const frontierSchema = path.join(schemaDirectory, "frontier.schema.json");

test("every public frontier satisfies the frontier schema and its own consistency rule", () => {
  for (const bundle of publicBundles(catalog)) {
    const frontier = projectFrontier(bundle, catalog);
    assert.deepEqual(validateAgainstSchema(frontier, frontierSchema), [], bundle.record.problem.id);
    assert.deepEqual(frontierConsistencyErrors(frontier), []);
    assert.equal(frontier.revision.recordDigest.length, 64);
    assert.ok(frontier.acceptedClaims.every((claim) => claim.trust === "verified" && claim.evidence.length >= 1));
  }
});

test("clause states derive from claim relations", () => {
  const claims = [
    { targetClauseIds: ["a"], relation: "narrows" },
    { targetClauseIds: ["b"], relation: "resolves" },
    { targetClauseIds: ["c"], relation: "status-review" },
    { targetClauseIds: ["d"], relation: "refutes" }
  ];
  assert.equal(clauseState("a", claims), "narrowed");
  assert.equal(clauseState("b", claims), "resolved");
  assert.equal(clauseState("c", claims), "open");
  assert.equal(clauseState("d", claims), "refuted");
  assert.equal(clauseState("e", claims), "open");
});

test("a solved record has no unresolved clauses and an open record has no resolved clause", () => {
  const solved = projectFrontier(catalog.bundleById.get("krueger-2005-qubit-bi-negativity"), catalog);
  assert.deepEqual(solved.unresolved.clauseIds, []);
  assert.equal(solved.status, "solved");
  const open = projectFrontier(catalog.bundleById.get("theoremdb-p3114-kashaev-volume-conjecture"), catalog);
  assert.equal(open.status, "open");
  assert.ok(open.unresolved.clauseIds.length >= 1);
  assert.ok(open.targetClauses.every((clause) => clause.state === "open"));
});

test("pending candidate updates are marked unavailable without a service and injectable with one", () => {
  const bundle = catalog.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes");
  const withoutService = projectFrontier(bundle, catalog);
  assert.equal(withoutService.pendingCandidateUpdates.available, false);
  const pending = { available: true, count: 1, items: [{ id: "cu-test" }] };
  const withService = projectFrontier(bundle, catalog, { pending });
  assert.deepEqual(withService.pendingCandidateUpdates, pending);
});

test("frontier evidence rows resolve their sources", () => {
  const frontier = projectFrontier(catalog.bundleById.get("ruskai-2007-multiplicativity-p2-channel-classes"), catalog);
  const evidence = frontier.acceptedClaims[0].evidence[0];
  assert.equal(evidence.source.id, "source-dierckx-fannes-vandenplas-2008");
  assert.ok(evidence.source.url.startsWith("https://"));
});
