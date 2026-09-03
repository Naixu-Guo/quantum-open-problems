import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, DECISION_TARGETS, TARGET_TYPE_TO_KIND, type Ref } from "../targets.ts";
import { actorKind } from "./actor.ts";

export const TYPE = "Decision" as const;

export type DecisionKind = "admission" | "promotion" | "acceptance" | "status" | "merge" | "retire" | "moderation" | "redaction" | "release";
export type ProblemStatus = "open" | "partial" | "solved" | "refuted";
export type VerificationLevel = "triaged" | "ai-verified" | "machine-verified" | "human-signed";

export interface Decision extends ImmutableBase {
  type: typeof TYPE;
  kind: DecisionKind;
  targetType: "problem" | "contribution" | "comment" | "statement" | "claim" | "reference" | "trajectory" | "review" | "ledger";
  targetId: string;
  outcome: "accepted" | "rejected";
  status: ProblemStatus | null;
  verificationLevel: VerificationLevel | null;
  reviewIds: string[];
  contributionIds: string[];
  policyVersion: string;
  effectiveAt: string;
}

export function references(decision: Decision): Ref[] {
  const kind = TARGET_TYPE_TO_KIND[decision.targetType];
  return [
    ...ref("createdBy", "Actor", decision.createdBy),
    ...ref("supersedes", "Decision", decision.supersedes),
    ...(kind && kind !== "Ledger" ? ref("targetId", kind, decision.targetId) : []),
    ...refs("reviewIds", "Review", decision.reviewIds),
    ...refs("contributionIds", "Contribution", decision.contributionIds),
  ];
}

const HUMAN_ONLY_KINDS: ReadonlySet<DecisionKind> = new Set(["promotion", "merge", "retire", "moderation", "redaction"]);
const REVIEW_CITING_KINDS: ReadonlySet<DecisionKind> = new Set(["admission", "acceptance", "status", "promotion"]);

export function rules(decision: Decision, ledger: Ledger): string[] {
  const errors: string[] = [];
  const allowedTargets = DECISION_TARGETS[decision.kind] ?? [];
  if (!allowedTargets.includes(decision.targetType)) errors.push(`a ${decision.kind} decision cannot target ${decision.targetType}`);

  if (decision.kind === "status" && decision.status === null) errors.push("a status decision must carry a status");
  if (decision.kind !== "status" && decision.status !== null) errors.push("only a status decision carries a status");
  if (decision.kind === "acceptance" && decision.verificationLevel === null) errors.push("an acceptance decision records the verification level reached");
  if (decision.kind !== "acceptance" && decision.verificationLevel !== null) errors.push("only an acceptance decision carries a verification level");

  if (REVIEW_CITING_KINDS.has(decision.kind) && decision.reviewIds.length === 0 && decision.outcome === "accepted") {
    errors.push(`an accepted ${decision.kind} decision must cite at least one review`);
  }
  if (decision.kind === "release" && (decision.reviewIds.length > 0 || decision.contributionIds.length > 0)) {
    errors.push("a release decision cites nothing");
  }

  const author = actorKind(ledger, decision.createdBy);
  if (HUMAN_ONLY_KINDS.has(decision.kind) && author !== null && author !== "human") errors.push(`a ${decision.kind} decision is made by a human`);
  if (decision.kind === "acceptance" && author !== null && author !== "system" && author !== "human") errors.push("acceptance decisions are issued by the system or a human");

  if (decision.kind === "status" && decision.status === "solved" && decision.targetType === "problem") {
    const problem = ledger.find("Problem", decision.targetId);
    if (problem && problem.fields["role"] === "primary" && author !== "human") errors.push("a primary problem is marked solved only by a human");
  }
  if (decision.kind === "status" && decision.status === "refuted" && decision.targetType === "problem") {
    const problem = ledger.find("Problem", decision.targetId);
    if (problem && problem.fields["role"] !== "auxiliary") errors.push("refuted applies to auxiliary problems");
  }

  for (const reviewId of decision.reviewIds) {
    const review = ledger.find("Review", reviewId);
    if (!review) continue;
    if (decision.kind === "acceptance" && review.fields["contributionId"] !== decision.targetId) {
      errors.push(`review ${reviewId} is about another contribution`);
    }
  }
  if (decision.supersedes !== null) {
    const previous = ledger.find("Decision", decision.supersedes);
    if (previous && (previous.fields["kind"] !== decision.kind || previous.fields["targetId"] !== decision.targetId)) {
      errors.push("a decision supersedes only a decision of the same kind on the same target");
    }
  }
  return errors;
}
