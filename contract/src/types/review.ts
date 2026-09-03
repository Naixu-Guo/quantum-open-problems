import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";

export const TYPE = "Review" as const;

export type ReviewMethod = "citation-check" | "artifact-execution" | "argument-read" | "formal-check" | "reproduction" | "scope-check" | "duplicate-check";
export type Verdict = "rejected" | "duplicate" | "junk" | "incomplete" | "scope-mismatch" | "unverified-plausible" | "verified-partial" | "verified";

export interface ReviewCheck {
  name: string;
  outcome: "pass" | "fail" | "error";
  note: string;
}

export interface Independence {
  differentOperator: boolean;
  differentModelFamily: boolean;
  noSharedReads: boolean;
}

export interface Review extends ImmutableBase {
  type: typeof TYPE;
  contributionId: string;
  reviewerId: string;
  trajectoryId: string | null;
  kind: "triage" | "verification" | "audit";
  independence: Independence;
  methods: ReviewMethod[];
  checks: ReviewCheck[];
  verdict: Verdict;
}

export const MECHANICAL_METHODS: ReadonlySet<ReviewMethod> = new Set(["citation-check", "artifact-execution", "formal-check", "reproduction"]);

export function references(review: Review): Ref[] {
  return [
    ...ref("createdBy", "Actor", review.createdBy),
    ...ref("supersedes", "Review", review.supersedes),
    ...ref("contributionId", "Contribution", review.contributionId),
    ...ref("reviewerId", "Actor", review.reviewerId),
    ...ref("trajectoryId", "Trajectory", review.trajectoryId),
  ];
}

export function isIndependent(review: Review): boolean {
  return review.independence.differentOperator && review.independence.differentModelFamily && review.independence.noSharedReads;
}

export function rules(review: Review, ledger: Ledger): string[] {
  const errors: string[] = [];
  if (review.createdBy !== review.reviewerId) errors.push("a review is created by its reviewer");
  if (review.kind === "verification" && !review.methods.some((method) => MECHANICAL_METHODS.has(method))) {
    errors.push("a verification review must use at least one mechanical method");
  }
  const contribution = ledger.find("Contribution", review.contributionId);
  if (contribution && contribution.fields["actorId"] === review.reviewerId) errors.push("an actor cannot review its own contribution");
  const reviewer = ledger.find("Actor", review.reviewerId);
  if (contribution && reviewer) {
    const submitter = ledger.find("Actor", contribution.fields["actorId"] as string);
    if (submitter) {
      const sameOperator = submitter.fields["operatorId"] !== null && submitter.fields["operatorId"] === reviewer.fields["operatorId"];
      if (sameOperator && review.independence.differentOperator) errors.push("independence.differentOperator is claimed but the operators match");
      const sameFamily = submitter.fields["modelFamily"] !== null && submitter.fields["modelFamily"] === reviewer.fields["modelFamily"];
      if (sameFamily && review.independence.differentModelFamily) errors.push("independence.differentModelFamily is claimed but the model families match");
    }
  }
  return errors;
}
