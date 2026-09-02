import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { schemaDirectory } from "../core/catalog.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";
import { PROBLEM_ID, CLAUSE_ID, editorialAccept, sampleCandidateUpdate, sampleReview, startService } from "./helpers.mjs";

const setup = async (options) => {
  const service = await startService(options);
  service.createActor("agent", "ai-agent", ["contributor"], { provider: "TestProvider", model: "test-model", operator: "Test Lab" });
  service.createActor("human", "human", ["contributor"]);
  service.createActor("reviewer", "human", ["reviewer"]);
  service.createActor("aiReviewer", "ai-agent", ["reviewer"], { provider: "TestProvider", model: "review-model", operator: "Test Lab" });
  service.createActor("editor", "human", ["editor", "contributor"]);
  return service;
};

test("public reads need no credentials and serve canonical state plus static files", async () => {
  const service = await setup();
  try {
    const status = await service.call("GET", "/api/v1/status");
    assert.equal(status.status, 200);
    assert.equal(status.body.kind, "qop-service-status");
    assert.ok(status.body.events.lastSequence > 0);
    const problem = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}`);
    assert.equal(problem.body.id, PROBLEM_ID);
    const frontier = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/frontier`);
    assert.equal(frontier.body.pendingCandidateUpdates.available, true);
    assert.equal(frontier.body.pendingCandidateUpdates.count, 0);
    const list = await service.call("GET", "/api/v1/problems?q=multiplicativity&limit=5");
    assert.ok(list.body.items.some((item) => item.id === PROBLEM_ID));
    const release = await service.call("GET", "/api/v1/release.json");
    assert.equal(release.body.kind, "quantum-open-problems-release");
    const missing = await service.call("GET", "/api/v1/problems/no-such-problem");
    assert.equal(missing.status, 404);
    const evidence = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/evidence`);
    assert.ok(evidence.body.items.length >= 1);
  } finally { await service.close(); }
});

test("writes require a valid key and the right role", async () => {
  const service = await setup();
  try {
    const { agent, reviewer } = service.actors;
    assert.equal((await service.call("POST", "/api/v1/candidate-updates", { body: sampleCandidateUpdate() })).status, 401);
    assert.equal((await service.call("POST", "/api/v1/candidate-updates", { key: "qop_" + "f".repeat(48), body: sampleCandidateUpdate() })).status, 401);
    assert.equal((await service.call("POST", "/api/v1/candidate-updates", { key: "not-a-key", body: sampleCandidateUpdate() })).status, 401);
    const noContributor = await service.call("POST", "/api/v1/candidate-updates", { key: reviewer.key, body: sampleCandidateUpdate() });
    assert.equal(noContributor.status, 403);
    const review = await service.call("POST", "/api/v1/reviews", { key: agent.key, body: sampleReview("cu-0000000000000000") });
    assert.equal(review.status, 403);
    const moderation = await service.call("POST", "/api/v1/moderation/actions", { key: agent.key, body: { targetType: "comment", targetId: "cmt-x", action: "hide", reason: "no" } });
    assert.equal(moderation.status, 403);
    const me = await service.call("GET", "/api/v1/actors/me", { key: agent.key });
    assert.equal(me.body.type, "ai-agent");
    assert.equal(me.body.metadata.model, "test-model");
  } finally { await service.close(); }
});

test("submissions are validated against the schema and the canonical statement", async () => {
  const service = await setup();
  try {
    const { agent } = service.actors;
    const bad = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ updateKind: "miracle" }) });
    assert.equal(bad.status, 422);
    assert.equal(bad.body.error.code, "schema_validation_failed");
    const unknownStatement = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ statementId: "nope-v9" }) });
    assert.equal(unknownStatement.status, 422);
    assert.equal(unknownStatement.body.error.code, "unknown_statement");
    const unknownClause = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ targetClauseIds: ["not-a-clause"] }) });
    assert.equal(unknownClause.body.error.code, "unknown_target_clause");
    const smuggled = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: { ...sampleCandidateUpdate(), reviewState: "accepted" } });
    assert.equal(smuggled.status, 422);
    const invalidJson = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, raw: "{not json", headers: { "Content-Type": "application/json" } });
    assert.equal(invalidJson.status, 400);
    const created = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ recordDigest: "0".repeat(64) }) });
    assert.equal(created.status, 201);
    assert.equal(created.body.reviewState, "pending");
    assert.equal(created.body.trust, "unverified");
    assert.equal(created.body.revisionMatchesCurrent, false);
    assert.equal(created.body.statementIsCurrent, true);
    assert.equal(created.body.submittedBy.type, "ai-agent");
    assert.ok(!("status" in created.body));
  } finally { await service.close(); }
});

test("idempotency keys replay the original response and reject reuse with a different body", async () => {
  const service = await setup();
  try {
    const { agent } = service.actors;
    const first = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate(), headers: { "Idempotency-Key": "same-key" } });
    const replay = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate(), headers: { "Idempotency-Key": "same-key" } });
    assert.equal(replay.status, 201);
    assert.equal(replay.body.id, first.body.id);
    assert.equal(replay.headers.get("idempotent-replay"), "true");
    const reused = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ title: "Different" }), headers: { "Idempotency-Key": "same-key" } });
    assert.equal(reused.status, 422);
    const list = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/candidate-updates`);
    assert.equal(list.body.total, 1);
  } finally { await service.close(); }
});

test("duplicate submissions are detected across actors", async () => {
  const service = await setup();
  try {
    const { agent, human } = service.actors;
    const first = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    const own = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate({ title: "Retitled" }) });
    assert.equal(own.status, 409);
    const other = await service.call("POST", "/api/v1/candidate-updates", { key: human.key, body: sampleCandidateUpdate() });
    assert.equal(other.status, 201);
    assert.equal(other.body.possibleDuplicateOf, first.body.id);
  } finally { await service.close(); }
});

test("the review state machine enforces quorum, actor type, and terminal states", async () => {
  const service = await setup();
  try {
    const { agent, reviewer, aiReviewer, editor, human } = service.actors;
    const created = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    const id = created.body.id;
    const early = await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(id) });
    assert.equal(early.status, 409);
    assert.equal(early.body.error.code, "quorum_not_met");
    const aiReview = await service.call("POST", "/api/v1/reviews", { key: aiReviewer.key, body: sampleReview(id) });
    assert.equal(aiReview.status, 201, "AI reviewers may file reviews");
    const stillBlocked = await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(id) });
    assert.equal(stillBlocked.status, 409, "AI reviews do not satisfy the human quorum");
    const selfReview = await service.call("POST", "/api/v1/reviews", { key: agent.key, body: sampleReview(id) });
    assert.equal(selfReview.status, 403);
    const aiEditorial = await service.call("POST", "/api/v1/reviews", { key: aiReviewer.key, body: editorialAccept(id) });
    assert.equal(aiEditorial.status, 403);
    const humanReview = await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(id) });
    assert.equal(humanReview.status, 201);
    assert.equal((await service.call("GET", `/api/v1/candidate-updates/${id}`)).body.reviewState, "under-review");
    const leaked = await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(id, { statusEffect: "solved" }) });
    assert.equal(leaked.status, 422);
    const withoutClaim = await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(id, { acceptedClaim: undefined }) });
    assert.equal(withoutClaim.status, 422);
    const accepted = await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(id) });
    assert.equal(accepted.status, 201);
    const detail = await service.call("GET", `/api/v1/candidate-updates/${id}`);
    assert.equal(detail.body.reviewState, "accepted");
    assert.equal(detail.body.trust, "accepted");
    assert.equal(detail.body.reviews.length, 3);
    const frontier = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/frontier`);
    assert.equal(frontier.body.pendingCandidateUpdates.count, 1);
    assert.equal(frontier.body.acceptedClaims.length, 1, "acceptance does not add a canonical claim");
    const withdraw = await service.call("POST", `/api/v1/candidate-updates/${id}/withdraw`, { key: human.key });
    assert.equal(withdraw.status, 403);
    const rejected = await service.call("POST", "/api/v1/candidate-updates", { key: human.key, body: sampleCandidateUpdate({ claim: "A completely different claim about depolarizing channels and multiplicativity." }) });
    const reject = await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(rejected.body.id, { verdict: "reject", acceptedClaim: undefined, statusEffect: undefined, summary: "The claim restates a known theorem." }) });
    assert.equal(reject.status, 201);
    assert.equal((await service.call("GET", `/api/v1/candidate-updates/${rejected.body.id}`)).body.reviewState, "rejected");
    const late = await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(rejected.body.id) });
    assert.equal(late.status, 409);
  } finally { await service.close(); }
});

test("comments thread, inherit context, and never touch scientific state", async () => {
  const service = await setup();
  try {
    const { agent, human, editor } = service.actors;
    const update = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    const root = await service.call("POST", "/api/v1/comments", { key: human.key, body: { problemId: PROBLEM_ID, body: "Does this extend to qutrits?", candidateUpdateId: update.body.id, targetClauseId: CLAUSE_ID } });
    assert.equal(root.status, 201);
    assert.equal(root.body.rootId, root.body.id);
    assert.equal(root.body.author.type, "human");
    const reply = await service.call("POST", `/api/v1/comments/${root.body.id}/replies`, { key: agent.key, body: { body: "Not with this argument." } });
    assert.equal(reply.status, 201);
    assert.equal(reply.body.parentId, root.body.id);
    assert.equal(reply.body.rootId, root.body.id);
    assert.equal(reply.body.candidateUpdateId, update.body.id);
    const nested = await service.call("POST", `/api/v1/comments/${reply.body.id}/replies`, { key: editor.key, body: { body: "Agreed." } });
    assert.equal(nested.body.rootId, root.body.id);
    const threaded = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/comments?threaded=true`);
    assert.equal(threaded.body.items.length, 1);
    assert.equal(threaded.body.items[0].replies[0].replies[0].id, nested.body.id);
    const mismatch = await service.call("POST", `/api/v1/comments/${root.body.id}/replies`, { key: agent.key, body: { problemId: "theoremdb-p42-quantum-pcp-conjecture", body: "wrong problem" } });
    assert.equal(mismatch.status, 422);
    const badClause = await service.call("POST", "/api/v1/comments", { key: human.key, body: { problemId: PROBLEM_ID, body: "x", targetClauseId: "no-clause" } });
    assert.equal(badClause.status, 422);
    const edit = await service.call("PATCH", `/api/v1/comments/${root.body.id}`, { key: human.key, body: { body: "Does this extend to qutrits? (edited)" } });
    assert.equal(edit.status, 200);
    assert.ok(edit.body.editedAt);
    const notAuthor = await service.call("PATCH", `/api/v1/comments/${root.body.id}`, { key: agent.key, body: { body: "hijack" } });
    assert.equal(notAuthor.status, 403);
    const frontier = await service.call("GET", `/api/v1/problems/${PROBLEM_ID}/frontier`);
    assert.equal(frontier.body.status, "partial");
    assert.equal(frontier.body.acceptedClaims.length, 1);
    const removed = await service.call("DELETE", `/api/v1/comments/${reply.body.id}`, { key: agent.key });
    assert.equal(removed.body.body, null);
    assert.equal(removed.body.moderationState, "deleted");
  } finally { await service.close(); }
});

test("the event stream is sequenced, filterable, and schema-valid", async () => {
  const service = await setup();
  try {
    const { agent, reviewer } = service.actors;
    const start = (await service.call("GET", "/api/v1/status")).body.events.lastSequence;
    const first = await service.call("GET", "/api/v1/events?after=0&limit=3");
    assert.equal(first.body.count, 3);
    assert.equal(first.body.hasMore, true);
    assert.deepEqual(first.body.events.map((event) => event.sequence), [1, 2, 3]);
    assert.equal(first.body.events[0].source, "catalog");
    const update = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(update.body.id) });
    await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "hello" } });
    const after = await service.call("GET", `/api/v1/events?after=${start}`);
    assert.deepEqual(after.body.events.map((event) => event.type), ["candidate_update.created", "review.created", "candidate_update.reviewed", "comment.created"]);
    assert.ok(after.body.events.every((event, index) => event.sequence === start + index + 1));
    assert.equal(after.body.nextAfter, start + 4);
    const schemaPath = path.join(schemaDirectory, "event.schema.json");
    for (const event of [...first.body.events, ...after.body.events]) assert.deepEqual(validateAgainstSchema(event, schemaPath), []);
    const filtered = await service.call("GET", `/api/v1/events?after=${start}&type=comment.created`);
    assert.equal(filtered.body.count, 1);
    const byProblem = await service.call("GET", `/api/v1/events?after=0&problemId=${PROBLEM_ID}&limit=500`);
    assert.ok(byProblem.body.events.every((event) => event.problemId === PROBLEM_ID));
    assert.ok(byProblem.body.events.some((event) => event.type === "claim.accepted"));
  } finally { await service.close(); }
});

test("rate limits and size limits apply to writes", async () => {
  const service = await setup({ rateLimits: { actorWritesPerHour: 2, actorCandidateUpdatesPerDay: 40, addressRequestsPerMinute: 1000, addressUnauthenticatedWritesPerHour: 1 } });
  try {
    const { agent } = service.actors;
    assert.equal((await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "one" } })).status, 201);
    assert.equal((await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "two" } })).status, 201);
    const limited = await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "three" } });
    assert.equal(limited.status, 429);
    assert.ok(limited.headers.get("retry-after"));
    assert.equal((await service.call("POST", "/api/v1/comments", { body: { problemId: PROBLEM_ID, body: "anon" } })).status, 401);
    assert.equal((await service.call("POST", "/api/v1/comments", { body: { problemId: PROBLEM_ID, body: "anon again" } })).status, 429);
    service.app.limiters.actorWrites.reset();
    const huge = await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "x".repeat(70 * 1024) } });
    assert.equal(huge.status, 413);
  } finally { await service.close(); }
});

test("moderation hides content, records an immutable audit trail, and suspension blocks writes", async () => {
  const service = await setup();
  try {
    const { agent, editor, human } = service.actors;
    const comment = await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "spam" } });
    const hide = await service.call("POST", "/api/v1/moderation/actions", { key: editor.key, body: { targetType: "comment", targetId: comment.body.id, action: "hide", reason: "off topic" } });
    assert.equal(hide.status, 201);
    const publicView = await service.call("GET", `/api/v1/comments/${comment.body.id}`);
    assert.equal(publicView.body.body, null);
    const moderatorView = await service.call("GET", `/api/v1/comments/${comment.body.id}`, { key: editor.key });
    assert.equal(moderatorView.body.body, "spam");
    const suspend = await service.call("POST", "/api/v1/moderation/actions", { key: editor.key, body: { targetType: "actor", targetId: agent.actor.id, action: "suspend", reason: "repeated spam" } });
    assert.equal(suspend.status, 201);
    const blocked = await service.call("POST", "/api/v1/comments", { key: agent.key, body: { problemId: PROBLEM_ID, body: "more" } });
    assert.equal(blocked.status, 403);
    const log = await service.call("GET", "/api/v1/moderation/actions", { key: editor.key });
    assert.equal(log.body.items.length, 2);
    assert.equal((await service.call("GET", "/api/v1/moderation/actions", { key: human.key })).status, 403);
    const events = await service.call("GET", "/api/v1/events?after=0&type=actor.suspended&limit=5");
    assert.equal(events.body.count, 1);
  } finally { await service.close(); }
});

test("recording a promotion requires an editor and an accepted update", async () => {
  const service = await setup();
  try {
    const { agent, reviewer, editor } = service.actors;
    const update = await service.call("POST", "/api/v1/candidate-updates", { key: agent.key, body: sampleCandidateUpdate() });
    const early = await service.call("POST", `/api/v1/candidate-updates/${update.body.id}/promotion`, { key: editor.key, body: { promotedObjectIds: ["claim-x"] } });
    assert.equal(early.status, 409);
    await service.call("POST", "/api/v1/reviews", { key: reviewer.key, body: sampleReview(update.body.id) });
    await service.call("POST", "/api/v1/reviews", { key: editor.key, body: editorialAccept(update.body.id) });
    const forbidden = await service.call("POST", `/api/v1/candidate-updates/${update.body.id}/promotion`, { key: agent.key, body: { promotedObjectIds: ["claim-x"] } });
    assert.equal(forbidden.status, 403);
    const promoted = await service.call("POST", `/api/v1/candidate-updates/${update.body.id}/promotion`, { key: editor.key, body: { promotedObjectIds: ["claim-x"], promotedOn: "2026-09-02" } });
    assert.equal(promoted.status, 200);
    assert.equal(promoted.body.reviewState, "promoted");
    assert.equal(promoted.body.trust, "verified");
    const events = await service.call("GET", "/api/v1/events?after=0&type=candidate_update.promoted&limit=5");
    assert.equal(events.body.count, 1);
  } finally { await service.close(); }
});
