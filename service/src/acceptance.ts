/**
 * Automatic decisions. After every write the service looks at each contribution without an
 * acceptance decision and asks whether the reviews on file meet the policy thresholds. If they
 * do, it issues the acceptance decision as the system actor, then the admission and status
 * decisions that follow from it. Every threshold is read from the policy; independence is
 * computed from actor records, not taken from a review's own flags; superseded reviews do not
 * count. Humans are never bypassed: a primary problem's `Solved` is left to a human editor.
 */
import type { Ledger, LoadedRecord } from "../../contract/src/ledger.ts";
import type { Policy, ReviewThreshold } from "../../contract/src/policy.ts";
import { currentDecisions, contributionState, acceptedClaims, clauseOutcome, problemStatus, catalogState } from "../../contract/src/derive.ts";
import type { Review } from "../../contract/src/types/review.ts";
import { passedCheck, type Artifact } from "../../contract/src/types/artifact.ts";
import { actorKind, hasRole } from "../../contract/src/types/actor.ts";
import type { Contribution } from "../../contract/src/types/contribution.ts";
import type { Claim } from "../../contract/src/types/claim.ts";
import type { Statement } from "../../contract/src/types/statement.ts";
import type { Decision, VerificationLevel } from "../../contract/src/types/decision.ts";
import type { NewRecord } from "./ledger-repo.ts";
import { newId, nowIso } from "./ids.ts";

export interface AcceptanceContext {
  ledger: Ledger;
  policy: Policy;
  systemActorId: string;
}

export interface Verdict {
  outcome: "accepted" | "rejected";
  level: VerificationLevel;
  reviewIds: string[];
  rationale: string;
}

const NEGATIVE = new Set(["rejected", "duplicate", "junk", "incomplete", "scope-mismatch"]);
const VERIFIED_ONLY = new Set(["verified"]);
const VERIFIED_OR_PARTIAL = new Set(["verified", "verified-partial"]);
const ANY_NON_NEGATIVE = new Set(["verified", "verified-partial", "unverified-plausible"]);

/** Current reviews of a contribution, excluding any that a later review supersedes. */
export function liveReviews(ledger: Ledger, contributionId: string): Review[] {
  const all = ledger.currentOf("Review").map((r) => r.fields as unknown as Review).filter((review) => review.contributionId === contributionId);
  const superseded = new Set(all.map((review) => review.supersedes).filter((id): id is string => id !== null));
  return all.filter((review) => !superseded.has(review.id));
}

/**
 * Independence computed from the records: the reviewer is a different actor, operated by
 * someone other than the submitter or the submitter's operator, of a different model family,
 * and its review declares all three flags. `noSharedReads` stays a declaration until reviewer
 * trajectories carry their reads.
 */
export function independentOf(ledger: Ledger, review: Review, contribution: Contribution): boolean {
  const reviewer = ledger.find("Actor", review.reviewerId);
  const submitter = ledger.find("Actor", contribution.actorId);
  if (!reviewer || !submitter) return false;
  if (review.reviewerId === contribution.actorId) return false;
  const flags = review.independence;
  if (!flags.differentOperator || !flags.differentModelFamily || !flags.noSharedReads) return false;
  const reviewerOperator = reviewer.fields["operatorId"] as string | null;
  const submitterOperator = submitter.fields["operatorId"] as string | null;
  if (reviewerOperator !== null && (reviewerOperator === submitterOperator || reviewerOperator === contribution.actorId)) return false;
  const reviewerFamily = reviewer.fields["modelFamily"] as string | null;
  const submitterFamily = submitter.fields["modelFamily"] as string | null;
  if (reviewerFamily !== null && reviewerFamily === submitterFamily) return false;
  return true;
}

function familyOf(ledger: Ledger, actorId: string): string {
  return String(ledger.find("Actor", actorId)?.fields["modelFamily"] ?? actorId);
}

/** Independent AI verification reviews with an allowed verdict, one per reviewer, from distinct model families. */
function independentAiReviews(ledger: Ledger, reviews: Review[], contribution: Contribution, verdicts: Set<string>): Review[] {
  const byFamily = new Map<string, Review>();
  for (const review of reviews) {
    if (review.kind !== "verification" || !verdicts.has(review.verdict)) continue;
    if (actorKind(ledger, review.reviewerId) !== "agent" || !independentOf(ledger, review, contribution)) continue;
    const family = familyOf(ledger, review.reviewerId);
    if (!byFamily.has(family)) byFamily.set(family, review);
  }
  return [...byFamily.values()];
}

function humanVerifications(ledger: Ledger, reviews: Review[], verdicts: Set<string>): Review[] {
  return reviews.filter((review) => review.kind === "verification" && verdicts.has(review.verdict) && actorKind(ledger, review.reviewerId) === "human");
}

function machineChecked(ledger: Ledger, contribution: Contribution): string | null {
  for (const artifactId of contribution.artifactIds) {
    const artifact = ledger.find("Artifact", artifactId);
    if (artifact && passedCheck(artifact.fields as unknown as Artifact)) return artifactId;
  }
  return null;
}

/** The policy row and the verdicts it accepts for a contribution kind. */
function thresholdFor(policy: Policy, kind: string): { key: string; threshold: ReviewThreshold; verdicts: Set<string> } {
  const pick = (key: string, verdicts: Set<string>) => ({ key, threshold: policy.thresholds[key] ?? {}, verdicts });
  switch (kind) {
    case "problem-proposal": return pick("admission", VERIFIED_ONLY);
    case "statement-revision": return pick("statementRevision", VERIFIED_ONLY);
    case "reference":
    case "entity-revision": return pick("reference", ANY_NON_NEGATIVE);
    case "attempt-report": return pick("attemptReport", VERIFIED_OR_PARTIAL);
    default: return pick("aiVerified", VERIFIED_OR_PARTIAL);
  }
}

/** Decide whether the reviews on file settle a contribution. Returns null when they do not yet. */
export function evaluate(context: AcceptanceContext, contribution: Contribution): Verdict | null {
  const { ledger, policy } = context;
  const reviews = liveReviews(ledger, contribution.id);
  const negative = reviews.find((review) => NEGATIVE.has(review.verdict));
  if (negative) {
    const level: VerificationLevel = negative.kind === "triage" ? "triaged" : actorKind(ledger, negative.reviewerId) === "human" ? "human-signed" : "reviewed";
    return { outcome: "rejected", level, reviewIds: [negative.id], rationale: `Review ${negative.id} returned ${negative.verdict}.` };
  }
  const { key, threshold, verdicts } = thresholdFor(policy, contribution.kind);
  const humans = humanVerifications(ledger, reviews, verdicts);
  if (humans.length >= 1) {
    return { outcome: "accepted", level: "human-signed", reviewIds: humans.map((r) => r.id), rationale: "A human verification review is on file." };
  }
  const artifactId = machineChecked(ledger, contribution);
  if (artifactId && threshold.orMachineCheck) {
    return { outcome: "accepted", level: "machine-verified", reviewIds: [], rationale: `Artifact ${artifactId} passed its check.` };
  }
  if (threshold.anyReviews !== undefined) {
    const any = reviews.filter((review) => verdicts.has(review.verdict) && review.reviewerId !== contribution.actorId);
    if (any.length >= threshold.anyReviews) {
      return { outcome: "accepted", level: "reviewed", reviewIds: any.slice(0, threshold.anyReviews).map((r) => r.id), rationale: `${any.length} review(s) on file meet the ${key} threshold of ${threshold.anyReviews}.` };
    }
    return null;
  }
  const needed = threshold.independentAiReviews ?? 2;
  const independent = independentAiReviews(ledger, reviews, contribution, verdicts);
  if (independent.length >= needed) {
    return { outcome: "accepted", level: "ai-verified", reviewIds: independent.map((r) => r.id), rationale: `${independent.length} independent AI verification review(s) from distinct model families meet the ${key} threshold of ${needed}.` };
  }
  return null;
}

/** Contributions a trusted human may have accepted on submission, without any review. */
export function unreviewedAcceptance(context: AcceptanceContext, contribution: Contribution): Verdict | null {
  const { ledger } = context;
  if (actorKind(ledger, contribution.actorId) !== "human") return null;
  if (contribution.kind !== "entity-revision" && contribution.kind !== "reference") return null;
  if (liveReviews(ledger, contribution.id).some((review) => NEGATIVE.has(review.verdict))) return null;
  const editor = hasRole(ledger, contribution.actorId, "editor");
  if (contribution.kind === "entity-revision") {
    return editor ? { outcome: "accepted", level: "unreviewed", reviewIds: [], rationale: "Entity revision by a human editor; accepted under the policy rule without review." } : null;
  }
  const decisions = currentDecisions(ledger);
  const prior = ledger.currentOf("Contribution").some((other) => other.id !== contribution.id && other.fields["actorId"] === contribution.actorId && contributionState(ledger, other.id, decisions) === "accepted");
  return editor || prior ? { outcome: "accepted", level: "unreviewed", reviewIds: [], rationale: "Reference by a human actor with prior accepted contributions; accepted under the policy rule without review." } : null;
}

function decision(context: AcceptanceContext, fields: Record<string, unknown>, body: string): NewRecord {
  const at = nowIso();
  return {
    fields: {
      id: newId(), type: "Decision", schemaVersion: "1.0", createdBy: context.systemActorId, createdAt: at, supersedes: null,
      mergeIntoProblemId: null, status: null, verificationLevel: null, reviewIds: [], contributionIds: [],
      policyVersion: context.policy.policyVersion, effectiveAt: at, outcome: "accepted", ...fields,
    },
    body,
  };
}

export function acceptanceDecision(context: AcceptanceContext, contribution: Contribution, verdict: Verdict): NewRecord {
  return decision(context, { kind: "acceptance", targetType: "contribution", targetId: contribution.id, outcome: verdict.outcome, verificationLevel: verdict.level, reviewIds: verdict.reviewIds }, verdict.rationale);
}

/** Whether the reviews on an accepted contribution reach a status bar: independent AI reviews from distinct families, a human review, or a machine check. */
function statusEvidence(context: AcceptanceContext, contribution: Contribution, row: ReviewThreshold, verdicts: Set<string>, verdict: Verdict): string[] | null {
  const { ledger } = context;
  if (verdict.level === "human-signed") return verdict.reviewIds;
  if (verdict.level === "machine-verified" && row.orMachineCheck) return [];
  const reviews = liveReviews(ledger, contribution.id);
  const independent = independentAiReviews(ledger, reviews, contribution, verdicts);
  return independent.length >= (row.independentAiReviews ?? 2) ? independent.map((r) => r.id) : null;
}

/** The decisions that follow from accepting a contribution: admission of proposed problems, status changes the policy lets the system make. */
export function consequences(context: AcceptanceContext, contribution: Contribution, verdict: Verdict): NewRecord[] {
  const { ledger, policy } = context;
  const out: NewRecord[] = [];
  if (verdict.outcome !== "accepted") return out;
  const decisions = currentDecisions(ledger);
  if (contribution.kind === "problem-proposal" || contribution.kind === "attempt-report") {
    for (const problemId of contribution.newProblemIds) {
      if (catalogState(ledger, problemId, decisions) === "candidate") {
        out.push(decision(context, { kind: "admission", targetType: "problem", targetId: problemId, reviewIds: verdict.reviewIds, contributionIds: [contribution.id] },
          contribution.kind === "problem-proposal" ? "Admitted on acceptance of its proposal." : "Auxiliary problem formulated in an accepted attempt report; published inside its parent's tree."));
      }
    }
  }
  const claimIds = new Set(contribution.claimIds);
  if (claimIds.size === 0) return out;
  const newClaims = ledger.currentOf("Claim").map((c) => c.fields as unknown as Claim).filter((claim) => claimIds.has(claim.id));
  const accepted = [...acceptedClaims(ledger, decisions), ...newClaims];
  const touched = new Set(newClaims.map((claim) => ledger.find("Statement", claim.statementId)?.fields["problemId"] as string | undefined).filter((id): id is string => Boolean(id)));
  for (const problemId of touched) {
    const problem = ledger.find("Problem", problemId);
    if (!problem) continue;
    // Imported research status is maintained in its source JSON; accepting claims still
    // updates clause progress but cannot replace the catalog's authoritative status.
    if (problem.fields["authoredCatalog"]) continue;
    const statement = ledger.currentOf("Statement").map((s) => s.fields as unknown as Statement).filter((s) => s.problemId === problemId).sort((a, b) => b.version - a.version)[0];
    if (!statement) continue;
    const outcomes = statement.clauses.map((clause) => clauseOutcome(ledger, `${statement.id}#${clause.id}`, accepted));
    const status = problemStatus(ledger, problemId, decisions);
    const previous = decisions.find((d) => d.kind === "status" && d.targetType === "problem" && d.targetId === problemId && d.outcome === "accepted") ?? null;
    const settled = outcomes.every((o) => o === "resolved" || o === "refuted");
    const auxiliary = problem.fields["role"] === "auxiliary";
    const supersede = (d: Decision | null) => (d ? { supersedes: d.id } : {});
    if (auxiliary && outcomes.length > 0 && settled && status !== "Solved") {
      const evidence = statusEvidence(context, contribution, policy.thresholds["auxiliaryStatus"] ?? {}, VERIFIED_ONLY, verdict);
      if (evidence === null) continue;
      const refuted = outcomes.includes("refuted");
      out.push(decision(context, { kind: "status", targetType: "problem", targetId: problemId, status: "Solved", reviewIds: evidence, contributionIds: [contribution.id], ...supersede(previous) },
        refuted ? "A clause is refuted by an accepted claim." : "Every clause is resolved by accepted claims."));
    }
  }
  return out;
}

/** Every contribution still waiting for an acceptance decision. */
export function pending(ledger: Ledger): LoadedRecord[] {
  const decisions = currentDecisions(ledger);
  return ledger.currentOf("Contribution").filter((record) => contributionState(ledger, record.id, decisions) === "submitted");
}
