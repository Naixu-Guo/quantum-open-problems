/**
 * Automatic decisions. After every write the service looks at each contribution without an
 * acceptance decision and asks whether the reviews on file meet the policy thresholds. If they
 * do, it issues the acceptance decision as the system actor, then the admission and status
 * decisions that follow from it. Humans are never bypassed: a primary problem's `solved` is
 * left to a human editor.
 */
import type { Ledger, LoadedRecord } from "../../contract/src/ledger.ts";
import type { Policy } from "../../contract/src/policy.ts";
import { currentDecisions, contributionState, acceptedClaims, clauseStatus, problemStatus, catalogState } from "../../contract/src/derive.ts";
import { isIndependent, type Review } from "../../contract/src/types/review.ts";
import { passedCheck, type Artifact } from "../../contract/src/types/artifact.ts";
import { actorKind, hasRole } from "../../contract/src/types/actor.ts";
import type { Contribution } from "../../contract/src/types/contribution.ts";
import type { Claim } from "../../contract/src/types/claim.ts";
import type { Statement } from "../../contract/src/types/statement.ts";
import type { NewRecord } from "./ledger-repo.ts";
import { newId, nowIso } from "./ids.ts";

export interface AcceptanceContext {
  ledger: Ledger;
  policy: Policy;
  systemActorId: string;
}

const NEGATIVE_VERDICTS = new Set(["rejected", "duplicate", "junk", "incomplete", "scope-mismatch"]);
const POSITIVE_VERDICTS = new Set(["verified", "verified-partial"]);

function reviewsOf(ledger: Ledger, contributionId: string): Review[] {
  return ledger.currentOf("Review").map((r) => r.fields as unknown as Review).filter((review) => review.contributionId === contributionId);
}

/** The threshold key that governs a contribution kind. */
function thresholdKey(kind: string): string {
  switch (kind) {
    case "problem-proposal": return "admission";
    case "statement-revision": return "statementRevision";
    case "reference": return "reference";
    case "attempt-report": return "attemptReport";
    case "entity-revision": return "reference";
    default: return "aiVerified";
  }
}

interface Verdict {
  outcome: "accepted" | "rejected";
  level: "unreviewed" | "triaged" | "ai-verified" | "machine-verified" | "human-signed";
  reviewIds: string[];
  rationale: string;
}

/** Decide whether the reviews on file settle a contribution. Returns null when they do not yet. */
export function evaluate(context: AcceptanceContext, contribution: Contribution): Verdict | null {
  const { ledger, policy } = context;
  const reviews = reviewsOf(ledger, contribution.id);
  const negative = reviews.find((review) => NEGATIVE_VERDICTS.has(review.verdict));
  if (negative) {
    const level = negative.kind === "triage" ? "triaged" : actorKind(ledger, negative.reviewerId) === "human" ? "human-signed" : "ai-verified";
    return { outcome: "rejected", level, reviewIds: [negative.id], rationale: `Review ${negative.id} returned ${negative.verdict}.` };
  }
  const positive = reviews.filter((review) => review.kind === "verification" && POSITIVE_VERDICTS.has(review.verdict));
  const human = positive.filter((review) => actorKind(ledger, review.reviewerId) === "human");
  if (human.length >= 1) {
    return { outcome: "accepted", level: "human-signed", reviewIds: human.map((r) => r.id), rationale: "A human verification review is on file." };
  }
  for (const artifactId of contribution.artifactIds) {
    const artifact = ledger.find("Artifact", artifactId);
    if (artifact && passedCheck(artifact.fields as unknown as Artifact)) {
      return { outcome: "accepted", level: "machine-verified", reviewIds: positive.map((r) => r.id), rationale: `Artifact ${artifactId} passed its check.` };
    }
  }
  const threshold = policy.thresholds[thresholdKey(contribution.kind)] ?? policy.thresholds["aiVerified"] ?? {};
  const needed = threshold.independentAiReviews ?? threshold.anyReviews ?? 2;
  const independentAi = positive.filter((review) => actorKind(ledger, review.reviewerId) === "agent" && (threshold.anyReviews !== undefined || isIndependent(review)));
  const families = new Set(independentAi.map((review) => ledger.find("Actor", review.reviewerId)?.fields["modelFamily"] ?? review.reviewerId));
  const distinctReviewers = new Set(independentAi.map((review) => review.reviewerId));
  if (independentAi.length >= needed && distinctReviewers.size >= needed && families.size >= Math.min(needed, families.size || 1)) {
    return { outcome: "accepted", level: "ai-verified", reviewIds: independentAi.map((r) => r.id), rationale: `${independentAi.length} independent AI verification review(s) on file meet the ${thresholdKey(contribution.kind)} threshold of ${needed}.` };
  }
  return null;
}

/** Contributions a trusted human may have accepted on submission, without any review. */
export function unreviewedAcceptance(context: AcceptanceContext, contribution: Contribution): Verdict | null {
  const { ledger } = context;
  if (actorKind(ledger, contribution.actorId) !== "human") return null;
  const editor = hasRole(ledger, contribution.actorId, "editor");
  if (contribution.kind === "entity-revision" && editor) {
    return { outcome: "accepted", level: "unreviewed", reviewIds: [], rationale: "Entity revision by a human editor; accepted under the policy rule without review." };
  }
  if (contribution.kind === "reference") {
    const decisions = currentDecisions(ledger);
    const prior = ledger.currentOf("Contribution").some((other) => other.id !== contribution.id && other.fields["actorId"] === contribution.actorId && contributionState(ledger, other.id, decisions) === "accepted");
    if (editor || prior) return { outcome: "accepted", level: "unreviewed", reviewIds: [], rationale: "Reference by a human actor with prior accepted contributions; accepted under the policy rule without review." };
  }
  return null;
}

function decision(context: AcceptanceContext, fields: Record<string, unknown>, body: string): NewRecord {
  return {
    fields: {
      id: newId(), type: "Decision", schemaVersion: "1.0", createdBy: context.systemActorId, createdAt: nowIso(), supersedes: null,
      mergeIntoProblemId: null, status: null, verificationLevel: null, reviewIds: [], contributionIds: [],
      policyVersion: context.policy.policyVersion, effectiveAt: nowIso(), outcome: "accepted", ...fields,
    },
    body,
  };
}

/** The decisions that follow from accepting a contribution: admission of proposed problems, status changes the policy lets the system make. */
export function consequences(context: AcceptanceContext, contribution: Contribution, verdict: Verdict): NewRecord[] {
  const { ledger } = context;
  const out: NewRecord[] = [];
  if (verdict.outcome !== "accepted") return out;
  const decisions = currentDecisions(ledger);
  const newlyPublished = new Set<string>();
  if (contribution.kind === "problem-proposal" || contribution.kind === "attempt-report") {
    for (const problemId of contribution.newProblemIds) {
      if (catalogState(ledger, problemId, decisions) === "candidate") {
        out.push(decision(context, { kind: "admission", targetType: "problem", targetId: problemId, reviewIds: verdict.reviewIds, contributionIds: [contribution.id] },
          contribution.kind === "problem-proposal" ? "Admitted on acceptance of its proposal." : "Auxiliary problem formulated in an accepted attempt report; published inside its parent's tree."));
        newlyPublished.add(problemId);
      }
    }
  }
  // Status changes the system may make once claims are accepted: partial anywhere, solved or refuted on auxiliary problems.
  const claimIds = new Set(contribution.claimIds);
  if (claimIds.size === 0) return out;
  const claims = ledger.currentOf("Claim").map((c) => c.fields as unknown as Claim).filter((claim) => claimIds.has(claim.id));
  const accepted = [...acceptedClaims(ledger, decisions), ...claims];
  const touched = new Set(claims.map((claim) => ledger.find("Statement", claim.statementId)?.fields["problemId"] as string | undefined).filter((id): id is string => Boolean(id)));
  for (const problemId of touched) {
    const problem = ledger.find("Problem", problemId);
    if (!problem) continue;
    const statement = ledger.currentOf("Statement").map((s) => s.fields as unknown as Statement).filter((s) => s.problemId === problemId).sort((a, b) => b.version - a.version)[0];
    if (!statement) continue;
    const states = statement.clauses.map((clause) => clauseStatus(ledger, `${statement.id}#${clause.id}`, accepted));
    const status = problemStatus(ledger, problemId, decisions);
    const allResolved = states.every((state) => state === "resolved");
    const anyProgress = states.some((state) => state !== "open");
    const auxiliary = problem.fields["role"] === "auxiliary";
    if (auxiliary && allResolved && status !== "solved" && status !== "refuted") {
      const refuted = claims.some((claim) => claim.relation === "refutes" && claim.statementId === statement.id);
      out.push(decision(context, { kind: "status", targetType: "problem", targetId: problemId, status: refuted ? "refuted" : "solved", reviewIds: verdict.reviewIds, contributionIds: [contribution.id] },
        refuted ? "Refuted by an accepted claim." : "Every clause resolved by accepted claims."));
    } else if (anyProgress && status === "open") {
      out.push(decision(context, { kind: "status", targetType: "problem", targetId: problemId, status: "partial", reviewIds: verdict.reviewIds, contributionIds: [contribution.id] },
        "An accepted claim settles part of the statement."));
    }
  }
  return out;
}

export function acceptanceDecision(context: AcceptanceContext, contribution: Contribution, verdict: Verdict): NewRecord {
  return decision(context, {
    kind: "acceptance", targetType: "contribution", targetId: contribution.id, outcome: verdict.outcome,
    verificationLevel: verdict.level, reviewIds: verdict.reviewIds,
  }, verdict.rationale);
}

/** Every contribution still waiting for an acceptance decision. */
export function pending(ledger: Ledger): LoadedRecord[] {
  const decisions = currentDecisions(ledger);
  return ledger.currentOf("Contribution").filter((record) => contributionState(ledger, record.id, decisions) === "submitted");
}
