import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { schemaDirectory } from "../core/catalog.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";
import { sampleCandidateUpdate, sampleReview, editorialAccept } from "./helpers.mjs";

const schema = (name) => path.join(schemaDirectory, `${name}.schema.json`);

test("a well-formed candidate update passes and malformed ones fail", () => {
  assert.deepEqual(validateAgainstSchema(sampleCandidateUpdate(), schema("candidate-update")), []);
  assert.ok(validateAgainstSchema(sampleCandidateUpdate({ updateKind: "miracle" }), schema("candidate-update")).length > 0);
  assert.ok(validateAgainstSchema(sampleCandidateUpdate({ targetClauseIds: [] }), schema("candidate-update")).length > 0);
  assert.ok(validateAgainstSchema(sampleCandidateUpdate({ status: "solved" }), schema("candidate-update")).some((error) => /additional property/.test(error)));
  assert.ok(validateAgainstSchema(sampleCandidateUpdate({ sources: [{ type: "preprint", uri: "not a uri" }] }), schema("candidate-update")).length > 0);
  const { claim, ...missing } = sampleCandidateUpdate();
  assert.ok(validateAgainstSchema(missing, schema("candidate-update")).some((error) => /missing required property claim/.test(error)));
});

test("review schema enforces types, verdicts, and check results", () => {
  assert.deepEqual(validateAgainstSchema(sampleReview("cu-abc123"), schema("review")), []);
  assert.deepEqual(validateAgainstSchema(editorialAccept("cu-abc123"), schema("review")), []);
  assert.ok(validateAgainstSchema(sampleReview("cu-abc123", { verdict: "maybe" }), schema("review")).length > 0);
  assert.ok(validateAgainstSchema(sampleReview("cu-abc123", { reviewType: "vibes" }), schema("review")).length > 0);
  assert.ok(validateAgainstSchema(sampleReview("cu-abc123", { checks: [{ name: "x", result: "meh" }] }), schema("review")).length > 0);
  assert.ok(validateAgainstSchema(sampleReview("bad id"), schema("review")).length > 0);
});

test("comment schema accepts threads and rejects oversized or malformed bodies", () => {
  assert.deepEqual(validateAgainstSchema({ problemId: "abc-1", body: "hello", parentId: "cmt-1a" }, schema("comment")), []);
  assert.ok(validateAgainstSchema({ problemId: "abc-1", body: "" }, schema("comment")).length > 0);
  assert.ok(validateAgainstSchema({ problemId: "abc-1", body: "x".repeat(20001) }, schema("comment")).length > 0);
  assert.ok(validateAgainstSchema({ problemId: "abc-1", body: "hi", parentId: "not-a-comment" }, schema("comment")).length > 0);
});

test("actor schema distinguishes AI agents and rejects unknown types", () => {
  const agent = { kind: "Actor", id: "actor-1a2b", type: "ai-agent", displayName: "Scout", identifier: null, metadata: { provider: "Anthropic", model: "claude", operator: "Lab" }, roles: ["contributor"], state: "active", createdAt: "2026-09-02T00:00:00Z" };
  assert.deepEqual(validateAgainstSchema(agent, schema("actor")), []);
  assert.ok(validateAgainstSchema({ ...agent, type: "robot" }, schema("actor")).length > 0);
  assert.ok(validateAgainstSchema({ ...agent, metadata: { secret: "x" } }, schema("actor")).length > 0);
});

test("event schema covers canonical and operational event types", () => {
  const event = { id: "cevt-000001-abcdef01", sequence: 1, type: "claim.accepted", objectType: "Claim", objectId: "claim-x", problemId: "abc-1", createdAt: "2026-09-02T00:00:00Z", revision: "sha256:0", payload: {}, source: "catalog" };
  assert.deepEqual(validateAgainstSchema(event, schema("event")), []);
  assert.ok(validateAgainstSchema({ ...event, type: "problem.solved" }, schema("event")).length > 0);
  assert.ok(validateAgainstSchema({ ...event, source: "browser" }, schema("event")).length > 0);
});

test("the zero-dependency validator refuses schema keywords it does not implement", () => {
  const errors = validateAgainstSchema({ a: 1 }, path.join(schemaDirectory, "..", "..", "tests", "fixtures", "unsupported.schema.json"));
  assert.ok(errors.some((error) => /not supported by the validator/.test(error)));
});
