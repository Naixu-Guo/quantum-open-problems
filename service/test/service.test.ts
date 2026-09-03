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
  service = createService({ ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir, dbPath: ":memory:", port: 0, commit: true });
  server = createServer(service);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  base = typeof address === "object" && address ? `http://127.0.0.1:${address.port}` : "";
});

after(() => {
  server.close();
  service.index.close();
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
  assert.equal(body.problems.byStatus.solved, 1);
  assert.ok(body.lastSequence > 0);
});

test("GET /api/v1/problems lists indexed problems only, with filters", async () => {
  const all = await getJson("/api/v1/problems");
  assert.ok(all.body.problems.every((p: { catalogState: string }) => p.catalogState === "published"));
  assert.ok(!all.body.problems.some((p: { alias: string }) => p.alias === "example-auxiliary-lemma"), "auxiliary problems are not indexed until promoted");
  const solved = await getJson("/api/v1/problems?status=solved");
  assert.deepEqual(solved.body.problems.map((p: { alias: string }) => p.alias), ["krueger-2005-qubit-bi-negativity"]);
  const text = await getJson("/api/v1/problems?text=kashaev");
  assert.equal(text.body.count, 1);
});

test("GET /api/v1/problems/<alias>/frontier shows the tree, the bound, and the route tried", async () => {
  const { status, body } = await getJson("/api/v1/problems/example-conformance-problem/frontier");
  assert.equal(status, 200);
  assert.equal(body.status, "partial");
  assert.equal(body.tree.length, 1);
  assert.equal(body.tree[0].status, "refuted");
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
  assert.equal(after.body.status, "open");
  const listed = await getJson("/api/v1/problems?text=pauli");
  assert.equal(listed.body.count, 1);
  assert.deepEqual(service.repo.validate(), []);
});

test("statement digests in the ledger match the contract digest rule", () => {
  for (const statement of service.repo.current().currentOf("Statement")) {
    assert.equal(statement.fields["digest"], statementDigest(statement.body));
  }
  reindex(service);
});
