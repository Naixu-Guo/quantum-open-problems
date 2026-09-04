import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, DECISION_TARGETS, TARGET_TYPE_TO_KIND, type Ref } from "../targets.ts";
import { actorKind, hasRole } from "./actor.ts";

export const TYPE = "Decision" as const;

export type DecisionKind = "admission" | "promotion" | "acceptance" | "withdrawal" | "status" | "merge" | "retire" | "moderation" | "redaction" | "maintenance" | "release";
export type ProblemStatus = "Solved" | "Unsolved";
export type VerificationLevel = "unreviewed" | "reviewed" | "triaged" | "ai-verified" | "machine-verified" | "human-signed";

/** The policy version under which the legacy audit decisions were recorded; threshold checks start at policy 1. */
const LEGACY_POLICY = "0";

export interface Decision extends ImmutableBase {
  type: typeof TYPE;
  kind: DecisionKind;
  targetType: "problem" | "contribution" | "comment" | "statement" | "claim" | "reference" | "trajectory" | "review" | "source" | "artifact" | "ledger";
  targetId: string;
  mergeIntoProblemId: string | null;
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
    ...ref("mergeIntoProblemId", "Problem", decision.mergeIntoProblemId),
    ...refs("reviewIds", "Review", decision.reviewIds),
    ...refs("contributionIds", "Contribution", decision.contributionIds),
  ];
}

const HUMAN_ONLY_KINDS: ReadonlySet<DecisionKind> = new Set(["promotion", "merge", "retire", "moderation", "redaction", "maintenance"]);
const REVIEW_CITING_KINDS: ReadonlySet<DecisionKind> = new Set(["admission", "acceptance", "status", "promotion"]);

export function rules(decision: Decision, ledger: Ledger): string[] {
  const errors: string[] = [];
  const author = actorKind(ledger, decision.createdBy);
  const allowedTargets = DECISION_TARGETS[decision.kind] ?? [];
  if (!allowedTargets.includes(decision.targetType)) errors.push(`a ${decision.kind} decision cannot target ${decision.targetType}`);

  if (decision.kind === "status" && decision.status === null) errors.push("a status decision must carry a status");
  if (decision.kind !== "status" && decision.status !== null) errors.push("only a status decision carries a status");
  if (decision.kind === "acceptance" && decision.verificationLevel === null) errors.push("an acceptance decision records the verification level reached");
  if (decision.kind !== "acceptance" && decision.verificationLevel !== null) errors.push("only an acceptance decision carries a verification level");

  const unreviewedAcceptance = decision.kind === "acceptance" && decision.verificationLevel === "unreviewed";
  // An admission or status decision may rest on a cited contribution whose acceptance was a passing machine check.
  const restsOnMachineCheck = decision.contributionIds.some((contributionId) =>
    ledger.currentOf("Decision").some((other) => other.fields["kind"] === "acceptance" && other.fields["targetId"] === contributionId && other.fields["outcome"] === "accepted" && other.fields["verificationLevel"] === "machine-verified"));
  if (REVIEW_CITING_KINDS.has(decision.kind) && decision.reviewIds.length === 0 && decision.outcome === "accepted" && !unreviewedAcceptance && !restsOnMachineCheck) {
    errors.push(`an accepted ${decision.kind} decision must cite at least one review`);
  }
  if (decision.kind === "merge" && decision.mergeIntoProblemId === null) errors.push("a merge decision names the problem merged into");
  if (decision.kind === "merge" && decision.mergeIntoProblemId === decision.targetId) errors.push("a problem cannot be merged into itself");
  if (decision.kind !== "merge" && decision.mergeIntoProblemId !== null) errors.push("only a merge decision names a problem merged into");
  if (decision.kind === "withdrawal") {
    const contribution = ledger.find("Contribution", decision.targetId);
    const byAuthor = contribution && contribution.fields["actorId"] === decision.createdBy;
    if (contribution && !byAuthor && author !== "system" && !hasRole(ledger, decision.createdBy, "editor")) {
      errors.push("a withdrawal is issued by the contribution's actor, the system, or an editor");
    }
  }
  if (decision.kind === "release" && (decision.reviewIds.length > 0 || decision.contributionIds.length > 0)) {
    errors.push("a release decision cites nothing");
  }

  if (HUMAN_ONLY_KINDS.has(decision.kind) && author !== null && author !== "human") errors.push(`a ${decision.kind} decision is made by a human`);
  if (decision.kind === "moderation" && author === "human" && !hasRole(ledger, decision.createdBy, "moderator")) errors.push("a moderation decision needs the moderator role");
  if ((decision.kind === "promotion" || decision.kind === "merge" || decision.kind === "retire" || decision.kind === "redaction") && author === "human" && !hasRole(ledger, decision.createdBy, "editor")) {
    errors.push(`a ${decision.kind} decision needs the editor role`);
  }
  if (decision.kind === "acceptance" && author !== null && author !== "system" && author !== "human") errors.push("acceptance decisions are issued by the system or a human");

  if (decision.kind === "status" && decision.status === "Solved" && decision.targetType === "problem") {
    const problem = ledger.find("Problem", decision.targetId);
    if (problem && problem.fields["role"] === "primary" && author !== "human") errors.push("a primary problem is marked solved only by a human");
    if (problem && problem.fields["role"] === "primary" && author === "human" && !hasRole(ledger, decision.createdBy, "editor")) errors.push("marking a primary problem solved needs the editor role");
    if (problem && problem.fields["role"] === "primary" && decision.policyVersion !== LEGACY_POLICY && !solvedThresholdMet(ledger, decision)) {
      errors.push("policy 1 requires a solved decision to rest on a peer-reviewed publication, a passing machine check, or two independent human reviews");
    }
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

/**
 * Policy 1 threshold for marking a primary problem solved: among the contributions the decision
 * cites, an accepted claim supported by a peer-reviewed source or by an artifact with a passing
 * check; or, among the reviews it cites, verification reviews with verdict verified from two
 * distinct human reviewers.
 */
export function solvedThresholdMet(ledger: Ledger, decision: Decision): boolean {
  for (const contributionId of decision.contributionIds) {
    const contribution = ledger.find("Contribution", contributionId);
    if (!contribution) continue;
    for (const claimId of contribution.fields["claimIds"] as string[]) {
      const claim = ledger.find("Claim", claimId);
      if (!claim) continue;
      for (const support of claim.fields["support"] as { sourceId: string | null; artifactId: string | null; maturity: string }[]) {
        if (support.maturity === "peer-reviewed") return true;
        if (support.artifactId) {
          const artifact = ledger.find("Artifact", support.artifactId);
          const checks = (artifact?.fields["checks"] as { outcome: string }[] | undefined) ?? [];
          if (artifact?.fields["checkable"] === true && checks.some((check) => check.outcome === "pass")) return true;
        }
      }
    }
  }
  const humanVerifiers = new Set<string>();
  for (const reviewId of decision.reviewIds) {
    const review = ledger.find("Review", reviewId);
    if (!review || review.fields["kind"] !== "verification" || review.fields["verdict"] !== "verified") continue;
    if (actorKind(ledger, review.fields["reviewerId"] as string) === "human") humanVerifiers.add(review.fields["reviewerId"] as string);
  }
  return humanVerifiers.size >= 2;
}
