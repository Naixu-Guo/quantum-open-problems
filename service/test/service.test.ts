/**
 * End-to-end tests against a temporary git repository seeded with the contract fixtures.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { submit, reindex } from "../src/write.ts";
import { newId, nowIso } from "../src/ids.ts";
import type { Service } from "../src/write.ts";
import { statementDigest } from "../../contract/src/digest.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const contractDir = path.resolve(here, "..", "..", "contract");

let tmp: string;
let service: Service;
let server: http.Server;
let base: string;

const git = (cwd: string, args: string[]) => {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

const getJson = async (route: string): Promise<{ status: number; body: any }> => {
  const response = await fetch(`${base}${route}`);
  return { status: response.status, body: await response.json() };
};

before(async () => {
  tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-service-"));
  fs.cpSync(path.join(contractDir, "fixtures", "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures", "activity"), path.join(tmp, "activity"), { recursive: true });
  git(tmp, ["init", "-q", "-b", "main"]);
  git(tmp, ["add", "-A"]);
  git(tmp, ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed fixtures"]);
  service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: true });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  base = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
});

after(() => {
  server.close();
  service.index.close();
  service.auth.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

const actorByName = (name: string) => service.repo.current().currentOf("Actor").find((a) => a.fields["name"] === name)!.id;
const problemByAlias = (alias: string) => service.repo.current().currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes(alias))!;

test("the index holds every fixture record with a sequence", () => {
  const counts = service.index.counts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  assert.equal(total, service.repo.current().records.length);
  assert.ok(service.index.lastSequence() >= total);
});

test("GET /api/v1/status reports counts and the policy", async () => {
  const { status, body } = await getJson("/api/v1/status");
  assert.equal(status, 200);
  assert.equal(body.policyVersion, "1");
  assert.equal(body.problems.byStatus.Solved, 2);
  assert.ok(body.lastSequence > 0);
  assert.deepEqual(Object.keys(body.problems.byStatus).sort(), ["Solved", "Unsolved"]);
});

test("GET /api/v1/problems lists indexed problems only, with filters", async () => {
  const all = await getJson("/api/v1/problems");
  assert.ok(all.body.problems.every((p: { catalogState: string }) => p.catalogState === "published"));
  assert.ok(!all.body.problems.some((p: { alias: string }) => p.alias === "example-auxiliary-lemma"), "auxiliary problems are not indexed until promoted");
  const solved = await getJson("/api/v1/problems?status=Solved");
  assert.deepEqual(solved.body.problems.map((p: { alias: string }) => p.alias), ["krueger-2005-qubit-bi-negativity"]);
  const unsupported = await getJson("/api/v1/problems?status=partial");
  assert.equal(unsupported.status, 400);
  const text = await getJson("/api/v1/problems?text=kashaev");
  assert.equal(text.body.count, 1);
});

test("GET /api/v1/problems/<alias>/frontier shows the tree, the bound, and the route tried", async () => {
  const { status, body } = await getJson("/api/v1/problems/example-conformance-problem/frontier");
  assert.equal(status, 200);
  assert.equal(body.status, "Unsolved");
  assert.equal(body.tree.length, 1);
  assert.equal(body.tree[0].status, "Solved");
  assert.equal(body.bestBounds[0].bounds[0].value, "1/2");
  assert.equal(body.routesTried.length, 1);
  assert.equal(body.routesTried[0].stopReason, "refuted-subgoal");
});

test("GET /api/v1/events returns records after a sequence", async () => {
  const { body } = await getJson("/api/v1/events?after=0&limit=5");
  assert.equal(body.events.length, 5);
  assert.equal(body.events[0].sequence, 1);
  const rest = await getJson(`/api/v1/events?after=${body.nextAfter}&type=Decision`);
  assert.ok(rest.body.events.every((e: { type: string }) => e.type === "Decision"));
});

test("a submitted comment is validated, committed, and indexed", async () => {
  const operator = actorByName("Example operator B");
  const problem = problemByAlias("example-conformance-problem");
  const id = newId();
  const result = submit(service, operator, [{
    fields: { id, type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: operator, createdAt: nowIso(), targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null },
    body: "A second synthetic comment, submitted through the service.",
  }], "Post a comment");
  assert.ok(result.ok, JSON.stringify(result.issues));
  assert.ok(result.commit, "the write was committed");
  assert.equal(git(tmp, ["log", "-1", "--format=%an"]), "Example operator B");
  const view = await getJson(`/api/v1/records/${id}`);
  assert.equal(view.status, 200);
  assert.equal(service.index.recordsAfter(0, 1000, "Comment").length, 2);
});

test("an invalid submission is rolled back and nothing is committed", () => {
  const operator = actorByName("Example operator B");
  const head = git(tmp, ["rev-parse", "HEAD"]);
  const result = submit(service, operator, [{
    fields: { id: newId(), type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: operator, createdAt: nowIso(), targetType: "problem", targetId: "01KZZZZZZZZZZZZZZZZZZZZZZZ", parentCommentId: null, promotedToContributionId: null },
    body: "Points at a problem that does not exist.",
  }], "Bad comment");
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((issue) => issue.category === "reference"));
  assert.equal(git(tmp, ["rev-parse", "HEAD"]), head);
  assert.equal(git(tmp, ["status", "--porcelain"]), "");
});

test("a reference by an editor is accepted without review", async () => {
  const editor = actorByName("Legacy audit editor");
  const problem = problemByAlias("theoremdb-p3114-kashaev-volume-conjecture");
  const source = service.repo.current().currentOf("Source")[0]!;
  const referenceId = newId();
  const contributionId = newId();
  const result = submit(service, editor, [
    { fields: { id: referenceId, type: "Reference", schemaVersion: "1.0", revision: 1, createdBy: editor, createdAt: nowIso(), sourceId: source.id, targetType: "problem", targetId: problem.id, role: "technique", locator: "" }, body: "Editor's hint: compare the asymptotics used here." },
    { fields: { id: contributionId, type: "Contribution", schemaVersion: "1.0", createdBy: editor, createdAt: nowIso(), supersedes: null, title: "Add a technique reference", kind: "reference", actorId: editor, trajectoryId: null, problemIds: [problem.id], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: [referenceId], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "none", license: "CC-BY-4.0" }, body: "Submitted through the service." },
  ], "Add a reference");
  assert.ok(result.ok, JSON.stringify(result.issues));
  assert.equal(result.decisions.length, 1, "one automatic acceptance decision");
  const view = await getJson(`/api/v1/contributions/${contributionId}`);
  assert.equal(view.body.state, "accepted");
  assert.equal(view.body.verificationLevel, "unreviewed");
  assert.equal(view.body.decisions[0].policyVersion, "1");
});

test("two independent AI reviews admit a candidate problem automatically", async () => {
  const problem = problemByAlias("v2-quantum-capacity-qubit-pauli-channel");
  const proposal = service.repo.current().currentOf("Contribution").find((c) => (c.fields["newProblemIds"] as string[]).includes(problem.id))!;
  const before = await getJson(`/api/v1/problems/${problem.id}`);
  assert.equal(before.body.catalogState, "candidate");
  const review = (reviewer: string) => ({
    fields: { id: newId(), type: "Review", schemaVersion: "1.0", createdBy: reviewer, createdAt: nowIso(), supersedes: null, contributionId: proposal.id, reviewerId: reviewer, trajectoryId: null, kind: "verification", independence: { differentOperator: true, differentModelFamily: true, noSharedReads: true }, conflictOfInterest: { declared: false, statement: "" }, methods: ["citation-check", "scope-check"], checks: [{ name: "statement precise", outcome: "pass", note: "" }], verdict: "verified" },
    body: "Well defined.",
  });
  const first = submit(service, actorByName("Example verifier 1"), [review(actorByName("Example verifier 1"))], "Review 1");
  assert.ok(first.ok, JSON.stringify(first.issues));
  assert.equal(first.decisions.length, 0, "one review is below the admission threshold");
  const second = submit(service, actorByName("Example verifier 2"), [review(actorByName("Example verifier 2"))], "Review 2");
  assert.ok(second.ok, JSON.stringify(second.issues));
  assert.equal(second.decisions.length, 2, "acceptance plus admission");
  const after = await getJson(`/api/v1/problems/${problem.id}`);
  assert.equal(after.body.catalogState, "published");
  assert.equal(after.body.status, "Unsolved");
  const listed = await getJson("/api/v1/problems?text=pauli");
  assert.equal(listed.body.count, 1);
  assert.deepEqual(service.repo.validate(), []);
});

const reviewFor = (contributionId: string, reviewer: string, verdict: string, extra: Record<string, unknown> = {}) => ({
  fields: { id: newId(), type: "Review", schemaVersion: "1.0", createdBy: reviewer, createdAt: nowIso(), supersedes: null, contributionId, reviewerId: reviewer, trajectoryId: null, kind: "verification", independence: { differentOperator: true, differentModelFamily: true, noSharedReads: true }, conflictOfInterest: { declared: false, statement: "" }, methods: ["citation-check", "scope-check"], checks: [], verdict, ...extra },
  body: `Review with verdict ${verdict}.`,
});

test("newId() carries the timestamp and sorts after the fixture ids", () => {
  const id = newId();
  assert.match(id, /^[0-9A-HJKMNP-TV-Z]{26}$/u);
  assert.ok(id > "01M1HDJG00T1ZF52D75H8DQGFN", `${id} should sort after the 2026-09-02 fixture ids`);
  assert.notEqual(id.slice(0, 10), "0000000000");
});

test("a record whose id would escape the ledger root is refused before anything is written", () => {
  const editor = actorByName("Legacy audit editor");
  const head = git(tmp, ["rev-parse", "HEAD"]);
  const result = submit(service, editor, [{
    fields: { id: "../../escaped/pwned", type: "Source", schemaVersion: "1.0", revision: 1, createdBy: editor, createdAt: nowIso(), title: "x", kind: "paper", completeness: "partial", authors: [], venue: "", date: null, doi: null, arxivId: null, url: null, version: null },
    body: "",
  }], "Escape attempt");
  assert.equal(result.ok, false);
  assert.equal(result.issues[0]?.category, "schema");
  assert.equal(fs.existsSync(path.join(tmp, "escaped")), false);
  assert.equal(git(tmp, ["rev-parse", "HEAD"]), head);
});

test("a malformed record is refused without leaving a file behind", () => {
  const editor = actorByName("Legacy audit editor");
  const before = fs.readdirSync(path.join(tmp, "ledger", "sources")).length;
  const result = submit(service, editor, [{
    fields: { id: newId(), type: "Source", schemaVersion: "1.0", revision: 1, createdBy: editor, createdAt: nowIso(), title: "No authors field", kind: "paper" },
    body: "",
  }], "Malformed source");
  assert.equal(result.ok, false);
  assert.equal(result.issues[0]?.category, "schema");
  assert.equal(fs.readdirSync(path.join(tmp, "ledger", "sources")).length, before);
  assert.deepEqual(service.repo.validate(), []);
});

test("a failing commit rolls the files back and leaves the index clean", () => {
  const operator = actorByName("Example operator B");
  const problem = problemByAlias("example-conformance-problem");
  const hook = path.join(tmp, ".git", "hooks", "pre-commit");
  fs.writeFileSync(hook, "#!/bin/sh\nexit 1\n", { mode: 0o755 });
  const head = git(tmp, ["rev-parse", "HEAD"]);
  try {
    const result = submit(service, operator, [{
      fields: { id: newId(), type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: operator, createdAt: nowIso(), targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null },
      body: "This commit is refused by a hook.",
    }], "Hook-refused comment");
    assert.equal(result.ok, false);
    assert.equal(result.issues[0]?.category, "commit");
  } finally {
    fs.rmSync(hook);
  }
  assert.equal(git(tmp, ["rev-parse", "HEAD"]), head);
  assert.equal(git(tmp, ["status", "--porcelain"]), "");
});

test("a commit carries only the batch, not files the developer had staged", () => {
  const operator = actorByName("Example operator B");
  const problem = problemByAlias("example-conformance-problem");
  fs.writeFileSync(path.join(tmp, "notes.txt"), "staged by a developer\n");
  git(tmp, ["add", "notes.txt"]);
  const result = submit(service, operator, [{
    fields: { id: newId(), type: "Comment", schemaVersion: "1.0", revision: 1, createdBy: operator, createdAt: nowIso(), targetType: "problem", targetId: problem.id, parentCommentId: null, promotedToContributionId: null },
    body: "Committed alongside unrelated staged work.",
  }], "Comment only");
  assert.ok(result.ok, JSON.stringify(result.issues));
  const shown = git(tmp, ["show", "--stat", "--format=", "HEAD"]);
  assert.ok(!shown.includes("notes.txt"), shown);
  assert.match(git(tmp, ["status", "--porcelain"]), /^A  notes.txt/u);
  git(tmp, ["restore", "--staged", "notes.txt"]);
  fs.rmSync(path.join(tmp, "notes.txt"));
});

test("one review of any kind accepts an agent's reference at the reviewed level", () => {
  const operatorB = actorByName("Example operator B");
  const sameFamily = newId();
  const created = submit(service, operatorB, [{
    fields: { id: sameFamily, type: "Actor", schemaVersion: "1.0", revision: 1, createdBy: operatorB, createdAt: nowIso(), name: "Example verifier 3", kind: "agent", roles: ["contributor", "reviewer"], externalIdentity: null, operatorId: operatorB, modelFamily: "example-family-b", modelVersion: "1.0", harness: "example-harness 0.1" },
    body: "Shares verifier 1's model family.",
  }], "Add verifier 3");
  assert.ok(created.ok, JSON.stringify(created.issues));
  const problem = problemByAlias("v2-quantum-capacity-qubit-pauli-channel");
  const proposal = service.repo.current().currentOf("Contribution").find((c) => (c.fields["newProblemIds"] as string[]).includes(problem.id))!;
  // The earlier admission test already accepted this proposal; use a fresh reference contribution instead.
  const agent = actorByName("Example research agent");
  const source = service.repo.current().currentOf("Source")[0]!;
  const referenceId = newId();
  const contributionId = newId();
  const submitted = submit(service, agent, [
    { fields: { id: referenceId, type: "Reference", schemaVersion: "1.0", revision: 1, createdBy: agent, createdAt: nowIso(), sourceId: source.id, targetType: "problem", targetId: problem.id, role: "related", locator: "" }, body: "Agent-added reference." },
    { fields: { id: contributionId, type: "Contribution", schemaVersion: "1.0", createdBy: agent, createdAt: nowIso(), supersedes: null, title: "Agent reference", kind: "reference", actorId: agent, trajectoryId: null, problemIds: [problem.id], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: [referenceId], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" }, body: "" },
  ], "Agent reference");
  assert.ok(submitted.ok, JSON.stringify(submitted.issues));
  assert.equal(submitted.decisions.length, 0, "an agent's reference waits for a review");
  assert.ok(proposal, "the proposal exists");
  // One review of any kind accepts a reference at `reviewed`.
  const reviewed = submit(service, sameFamily, [reviewFor(contributionId, sameFamily, "unverified-plausible", { kind: "triage", methods: ["duplicate-check"] })], "Triage");
  assert.ok(reviewed.ok, JSON.stringify(reviewed.issues));
  assert.equal(reviewed.decisions.length, 1);
  const decision = service.repo.current().find("Decision", reviewed.decisions[0]!)!;
  assert.equal(decision.fields["verificationLevel"], "reviewed");
});

test("reviewers from one model family do not meet the admission threshold; a third family does", async () => {
  const agent = actorByName("Example research agent");
  const problemId = newId();
  const statementId = newId();
  const contributionId = newId();
  const body = "## Formal statement\n\nSynthetic second candidate: is the example family closed under composition?\n";
  const proposal = submit(service, agent, [
    { fields: { id: problemId, type: "Problem", schemaVersion: "1.0", revision: 1, createdBy: agent, createdAt: nowIso(), title: "Second synthetic candidate", role: "primary", parentProblemId: null, parentClauseId: null, aliases: ["example-second-candidate"], origin: "agent-formulated", posed: null, areaIds: ["quantum-information"], topicIds: ["quantum-channels"], keywords: ["fixture"], difficulty: "unrated", verificationCost: "unrated", relatedProblemIds: [] }, body: "Synthetic candidate proposed by an agent." },
    { fields: { id: statementId, type: "Statement", schemaVersion: "1.0", createdBy: agent, createdAt: nowIso(), supersedes: null, problemId, version: 1, digest: statementDigest(body), clauses: [{ id: "closed", label: "Closure under composition", text: "The example family is closed under composition.", kind: "decision", resolutionCriteria: "Prove or refute closure.", supersedesClauseId: null, quantity: null }] }, body },
    { fields: { id: contributionId, type: "Contribution", schemaVersion: "1.0", createdBy: agent, createdAt: nowIso(), supersedes: null, title: "Propose: second synthetic candidate", kind: "problem-proposal", actorId: agent, trajectoryId: null, problemIds: [], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [problemId], newStatementId: statementId, referenceIds: [], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" }, body: "" },
  ], "Second candidate");
  assert.ok(proposal.ok, JSON.stringify(proposal.issues));
  const verifier1 = actorByName("Example verifier 1");
  const verifier3 = actorByName("Example verifier 3");
  const verifier2 = actorByName("Example verifier 2");
  const sameFamily = submit(service, verifier1, [reviewFor(contributionId, verifier1, "verified"), reviewFor(contributionId, verifier3, "verified")], "Two reviews, one family");
  assert.ok(sameFamily.ok, JSON.stringify(sameFamily.issues));
  assert.equal(sameFamily.decisions.length, 0, "verifiers 1 and 3 share a model family");
  const partialOnly = submit(service, verifier2, [reviewFor(contributionId, verifier2, "verified-partial")], "Second family, partial verdict");
  assert.ok(partialOnly.ok, JSON.stringify(partialOnly.issues));
  assert.equal(partialOnly.decisions.length, 0, "admission needs verified, not verified-partial");
  const secondFamily = submit(service, verifier2, [reviewFor(contributionId, verifier2, "verified")], "Second family");
  assert.ok(secondFamily.ok, JSON.stringify(secondFamily.issues));
  assert.equal(secondFamily.decisions.length, 2, "acceptance plus admission");
  const view = await getJson(`/api/v1/problems/example-second-candidate`);
  assert.equal(view.body.catalogState, "published");
});

test("a superseded review no longer counts", async () => {
  const problem = problemByAlias("theoremdb-p3114-kashaev-volume-conjecture");
  const agent = actorByName("Example research agent");
  const source = service.repo.current().currentOf("Source")[1]!;
  const referenceId = newId();
  const contributionId = newId();
  const submitted = submit(service, agent, [
    { fields: { id: referenceId, type: "Reference", schemaVersion: "1.0", revision: 1, createdBy: agent, createdAt: nowIso(), sourceId: source.id, targetType: "problem", targetId: problem.id, role: "related", locator: "" }, body: "Agent-added reference." },
    { fields: { id: contributionId, type: "Contribution", schemaVersion: "1.0", createdBy: agent, createdAt: nowIso(), supersedes: null, title: "Agent reference 2", kind: "reference", actorId: agent, trajectoryId: null, problemIds: [problem.id], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: [referenceId], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" }, body: "" },
  ], "Agent reference 2");
  assert.ok(submitted.ok, JSON.stringify(submitted.issues));
  const verifier = actorByName("Example verifier 1");
  const rejected = reviewFor(contributionId, verifier, "rejected");
  const retraction = reviewFor(contributionId, verifier, "unverified-plausible", { supersedes: rejected.fields["id"] });
  const result = submit(service, verifier, [rejected, retraction], "Reject then retract in one batch");
  assert.ok(result.ok, JSON.stringify(result.issues));
  assert.equal(result.decisions.length, 1, "the retraction counts, the rejection does not");
  const view = await getJson(`/api/v1/contributions/${contributionId}`);
  assert.equal(view.body.state, "accepted");
});

test("lastHumanReview moves only when a human looks; lastActivity moves on any decision", async () => {
  const problem = problemByAlias("example-second-candidate");
  const before = await getJson(`/api/v1/problems/${problem.id}/frontier`);
  assert.equal(before.body.lastHumanReview, null, "admitted by two AI reviews, never seen by a human");
  assert.ok(before.body.lastActivity, "the system admission counts as activity");
  const editor = actorByName("Legacy audit editor");
  const at = nowIso();
  const result = submit(service, editor, [{
    fields: { id: newId(), type: "Decision", schemaVersion: "1.0", createdBy: editor, createdAt: at, supersedes: null, kind: "maintenance", targetType: "problem", targetId: problem.id, mergeIntoProblemId: null, outcome: "accepted", status: null, verificationLevel: null, reviewIds: [], contributionIds: [], policyVersion: "1", effectiveAt: at },
    body: "Maintenance pass: statement re-read, no change.",
  }], "Maintenance decision");
  assert.ok(result.ok, JSON.stringify(result.issues));
  const after = await getJson(`/api/v1/problems/${problem.id}/frontier`);
  assert.equal(after.body.lastHumanReview, at);
  const backlog = await getJson("/api/v1/problems?sort=stale&limit=3");
  assert.ok(backlog.body.problems.every((p: { lastHumanReview: string | null }) => p.lastHumanReview === null || p.lastHumanReview <= at));
});

test("statement digests in the ledger match the contract digest rule", () => {
  for (const statement of service.repo.current().currentOf("Statement")) {
    assert.equal(statement.fields["digest"], statementDigest(statement.body));
  }
  reindex(service);
});
