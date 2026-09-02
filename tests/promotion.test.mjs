import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { catalogDirectory, loadCatalog, schemaDirectory, writeJson } from "../core/catalog.mjs";
import { buildPromotion } from "../core/promotion.mjs";
import { refreshPublishedRevisions } from "../core/published-revisions.mjs";
import { syncLedger } from "../core/sync-ledger.mjs";
import { validateCatalog } from "../core/validate.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";
import { PROBLEM_ID, editorialAccept, sampleCandidateUpdate, sampleReview, startService } from "./helpers.mjs";

const copyCatalog = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-"));
  fs.cpSync(catalogDirectory, directory, { recursive: true });
  return directory;
};

test("an accepted candidate update promotes into auditable canonical objects that validate", async () => {
  const service = await startService();
  const directory = copyCatalog();
  try {
    const agent = service.createActor("agent", "ai-agent", ["contributor"], { provider: "TestProvider", model: "test-model", operator: "Test Lab" });
    const reviewer = service.createActor("reviewer", "human", ["reviewer"]);
    const editor = service.createActor("editor", "human", ["editor"]);
    const created = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(created.body.id) });
    await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(created.body.id) });
    const detail = (await service.call("GET", `/api/v1/candidate-updates/${created.body.id}`)).body;
    assert.equal(detail.reviewState, "accepted");

    const catalog = loadCatalog(directory);
    const bundle = catalog.bundleById.get(PROBLEM_ID);
    const { reviews, links, kind, trust, reviewCount, ...candidateUpdate } = detail;
    const result = buildPromotion({
      bundle,
      catalog,
      candidateUpdate,
      reviews: reviews.map(({ links: _links, kind: _kind, ...review }) => review),
      promotedOn: "2026-08-31",
      promotedByActorId: editor.actor.id
    });
    assert.deepEqual(result.errors, []);
    assert.equal(result.record.claims.length, bundle.record.claims.length + 1);
    assert.equal(result.record.evidence.length, bundle.record.evidence.length + 1);
    assert.equal(result.record.decisions.length, bundle.record.decisions.length, "statusEffect none adds no decision");
    const claim = result.record.claims.at(-1);
    assert.equal(claim.provenance.candidateUpdateId, created.body.id);
    assert.equal(claim.provenance.submittedByActorId, agent.actor.id);
    assert.equal(result.newSources.length, 1);
    assert.equal(result.newSources[0].bibliographyState, "url-only");
    assert.deepEqual(validateAgainstSchema(result.snapshot, path.join(schemaDirectory, "contribution-snapshot.schema.json")), []);

    writeJson(path.join(bundle.directory, "record.json"), result.record);
    fs.mkdirSync(path.join(bundle.directory, "contributions"), { recursive: true });
    writeJson(path.join(bundle.directory, result.contributionPath), result.snapshot);
    for (const source of result.newSources) writeJson(path.join(catalog.paths.sourcesDirectory, `${source.id}.json`), source);
    const refreshed = refreshPublishedRevisions(loadCatalog(directory), { ids: [PROBLEM_ID] });
    assert.deepEqual(refreshed.changed, [PROBLEM_ID]);
    writeJson(catalog.paths.publishedRevisionsPath, refreshed.manifest);
    const plan = syncLedger(loadCatalog(directory));
    assert.deepEqual(plan.errors, []);
    assert.deepEqual(plan.appended.map((event) => event.type), ["claim.accepted", "evidence.recorded"]);
    assert.equal(plan.appended[0].payload.candidateUpdateId, created.body.id);

    const { failures, frontiers } = validateCatalog(loadCatalog(directory));
    assert.deepEqual(failures, []);
    const frontier = frontiers.get(PROBLEM_ID);
    assert.equal(frontier.acceptedClaims.length, 2);
    assert.ok(frontier.acceptedClaims.some((entry) => entry.provenance?.candidateUpdateId === created.body.id));
    assert.equal(frontier.status, "partial");
  } finally {
    await service.close();
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("promotion with a status effect supersedes the current decision and archives solved records", async () => {
  const directory = copyCatalog();
  try {
    const catalog = loadCatalog(directory);
    const bundle = catalog.bundleById.get(PROBLEM_ID);
    const submittedBy = { kind: "Actor", id: "actor-test", type: "human", displayName: "Tester", identifier: null, metadata: {}, roles: ["contributor"], state: "active", createdAt: "2026-09-01T00:00:00Z" };
    const reviewer = { ...submittedBy, id: "actor-reviewer", displayName: "Reviewer", roles: ["reviewer"] };
    const editorActor = { ...submittedBy, id: "actor-editor", displayName: "Editor", roles: ["editor"] };
    const candidateUpdate = { ...sampleCandidateUpdate({ updateKind: "proof", proposedEffect: { relation: "resolves", statusChange: "solved" } }), id: "cu-testsolved", submittedBy, submittedAt: "2026-09-01T00:00:00Z", reviewState: "accepted" };
    const reviews = [
      { ...sampleReview("cu-testsolved"), id: "rev-one", reviewer, createdAt: "2026-09-01T01:00:00Z" },
      { ...editorialAccept("cu-testsolved", { statusEffect: "solved", acceptedClaim: { title: "Complete classification", text: "The exhaustive characterization is proved.", relation: "resolves", maturity: "Preprint", strength: "Exact theorem", label: "arXiv", date: "2026-08-30" } }), id: "rev-two", reviewer: editorActor, createdAt: "2026-09-01T02:00:00Z" }
    ];
    const result = buildPromotion({ bundle, catalog, candidateUpdate, reviews, promotedOn: "2026-08-31", promotedByActorId: "actor-editor" });
    assert.deepEqual(result.errors, []);
    const decision = result.record.decisions.at(-1);
    assert.equal(decision.status, "solved");
    assert.equal(decision.supersedesDecisionId, bundle.record.decisions[0].id);
    assert.equal(result.record.problem.catalogState, "archived");
    writeJson(path.join(bundle.directory, "record.json"), result.record);
    fs.mkdirSync(path.join(bundle.directory, "contributions"), { recursive: true });
    writeJson(path.join(bundle.directory, result.contributionPath), result.snapshot);
    for (const source of result.newSources) writeJson(path.join(catalog.paths.sourcesDirectory, `${source.id}.json`), source);
    writeJson(catalog.paths.publishedRevisionsPath, refreshPublishedRevisions(loadCatalog(directory), { ids: [PROBLEM_ID] }).manifest);
    const plan = syncLedger(loadCatalog(directory));
    assert.deepEqual(plan.errors, []);
    assert.ok(plan.appended.some((event) => event.type === "decision.published"));
    const { failures, frontiers } = validateCatalog(loadCatalog(directory));
    assert.deepEqual(failures, []);
    assert.equal(frontiers.get(PROBLEM_ID).status, "solved");
    assert.deepEqual(frontiers.get(PROBLEM_ID).unresolved.clauseIds, []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test("promotion refuses updates that are not accepted or target a stale statement", () => {
  const catalog = loadCatalog();
  const bundle = catalog.bundleById.get(PROBLEM_ID);
  const submittedBy = { id: "actor-x", type: "human", displayName: "X", identifier: null, metadata: {} };
  const base = { ...sampleCandidateUpdate(), id: "cu-pending", submittedBy, submittedAt: "2026-09-01T00:00:00Z", reviewState: "pending" };
  const pending = buildPromotion({ bundle, catalog, candidateUpdate: base, reviews: [], promotedOn: "2026-08-31", promotedByActorId: "actor-e" });
  assert.ok(pending.errors.some((error) => /not accepted/.test(error)));
  assert.ok(pending.errors.some((error) => /no editorial accept review/.test(error)));
  const stale = buildPromotion({ bundle, catalog, candidateUpdate: { ...base, reviewState: "accepted", statementId: "old-statement" }, reviews: [{ ...editorialAccept("cu-pending"), id: "rev-e", reviewer: submittedBy, createdAt: "2026-09-01T00:00:00Z" }], promotedOn: "2026-08-31", promotedByActorId: "actor-e" });
  assert.ok(stale.errors.some((error) => /current statement is/.test(error)));
});
