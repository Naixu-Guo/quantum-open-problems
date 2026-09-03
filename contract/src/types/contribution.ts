import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, type Ref } from "../targets.ts";

export const TYPE = "Contribution" as const;

export type ContributionKind =
  | "problem-proposal"
  | "statement-revision"
  | "reference"
  | "attempt-report"
  | "evidence-import"
  | "merge-proposal"
  | "retire-proposal"
  | "entity-revision";

export interface Revision {
  entityId: string;
  revision: number;
}

export type StopReason = "solved" | "partial" | "obstacle" | "refuted-subgoal" | "ambiguous-statement" | "out-of-budget" | "abandoned" | "none";

export interface Contribution extends ImmutableBase {
  type: typeof TYPE;
  title: string;
  kind: ContributionKind;
  actorId: string;
  trajectoryId: string | null;
  problemIds: string[];
  statementId: string | null;
  statementDigest: string | null;
  clauseIds: string[];
  stopReason: StopReason;
  newProblemIds: string[];
  newStatementId: string | null;
  referenceIds: string[];
  claimIds: string[];
  artifactIds: string[];
  declaredReadIds: string[];
  revisions: Revision[];
  aiInvolvement: "none" | "assisted" | "autonomous";
  license: string;
}

export function references(contribution: Contribution): Ref[] {
  return [
    ...ref("createdBy", "Actor", contribution.createdBy),
    ...ref("supersedes", "Contribution", contribution.supersedes),
    ...ref("actorId", "Actor", contribution.actorId),
    ...ref("trajectoryId", "Trajectory", contribution.trajectoryId),
    ...refs("problemIds", "Problem", contribution.problemIds),
    ...ref("statementId", "Statement", contribution.statementId),
    ...refs("clauseIds", "Clause", contribution.clauseIds),
    ...refs("newProblemIds", "Problem", contribution.newProblemIds),
    ...ref("newStatementId", "Statement", contribution.newStatementId),
    ...refs("referenceIds", "Reference", contribution.referenceIds),
    ...refs("claimIds", "Claim", contribution.claimIds),
    ...refs("artifactIds", "Artifact", contribution.artifactIds),
  ];
}

const REVISABLE_BY_CONTRIBUTION = new Set(["Problem", "Source", "Reference", "Taxonomy"]);

/** The problem whose directory holds this contribution. */
export function primaryProblemId(contribution: Contribution): string | null {
  return contribution.problemIds[0] ?? contribution.newProblemIds[0] ?? null;
}

export function rules(contribution: Contribution, ledger: Ledger): string[] {
  const errors: string[] = [];
  const isAttempt = contribution.kind === "attempt-report";
  if (isAttempt && contribution.trajectoryId === null) errors.push("an attempt report must name its trajectory");
  if (isAttempt && contribution.stopReason === "none") errors.push("an attempt report needs a stop reason");
  if (!isAttempt && contribution.stopReason !== "none") errors.push("only an attempt report has a stop reason");
  if (!isAttempt && contribution.newProblemIds.length > 0 && contribution.kind !== "problem-proposal") {
    errors.push("only a problem proposal or an attempt report introduces problems");
  }
  if (contribution.kind === "problem-proposal") {
    if (contribution.newProblemIds.length !== 1) errors.push("a problem proposal introduces exactly one problem");
    if (contribution.newStatementId === null) errors.push("a problem proposal introduces the first statement");
  }
  if (contribution.kind === "statement-revision" && contribution.newStatementId === null) errors.push("a statement revision introduces a statement");
  if (contribution.kind === "reference" && contribution.referenceIds.length === 0) errors.push("a reference contribution introduces at least one reference");
  if (contribution.kind === "evidence-import" && contribution.claimIds.length === 0) errors.push("an evidence import introduces at least one claim");
  if (contribution.statementId !== null && contribution.statementDigest === null) errors.push("a contribution that names a statement must pin its digest");
  if (contribution.statementId !== null && contribution.statementDigest !== null) {
    const statement = ledger.find("Statement", contribution.statementId);
    if (statement && statement.fields["digest"] !== contribution.statementDigest) errors.push("statementDigest does not match the named statement");
  }
  for (const clauseRef of contribution.clauseIds) {
    if (contribution.statementId !== null && !clauseRef.startsWith(`${contribution.statementId}#`)) errors.push(`clause ${clauseRef} is not in the named statement`);
  }
  if (primaryProblemId(contribution) === null && contribution.kind !== "merge-proposal" && contribution.kind !== "entity-revision") errors.push("a contribution must name a problem");
  if (contribution.kind === "entity-revision" && contribution.revisions.length === 0) errors.push("an entity revision names at least one revised entity");
  if (contribution.kind !== "entity-revision" && contribution.revisions.length > 0) errors.push("only an entity revision names revised entities");
  for (const item of contribution.revisions) {
    const versions = ledger.revisions.get(item.entityId) ?? [];
    const record = versions.find((candidate) => candidate.fields["revision"] === item.revision);
    if (!record) { errors.push(`revision ${item.revision} of ${item.entityId} does not exist`); continue; }
    if (!REVISABLE_BY_CONTRIBUTION.has(record.type)) errors.push(`${record.type} ${item.entityId} is not revised through contributions`);
    if (item.revision < 2) errors.push(`revision 1 of ${item.entityId} is introduced by its creating contribution, not an entity revision`);
    if (record.fields["createdBy"] !== contribution.actorId) errors.push(`revision ${item.revision} of ${item.entityId} was written by another actor`);
  }
  if (contribution.trajectoryId !== null) {
    const trajectory = ledger.find("Trajectory", contribution.trajectoryId);
    if (trajectory && trajectory.fields["actorId"] !== contribution.actorId) errors.push("the contribution's actor must be the trajectory's actor");
  }
  for (const claimId of contribution.claimIds) {
    const claim = ledger.find("Claim", claimId);
    if (claim && claim.fields["createdBy"] !== contribution.actorId) errors.push(`claim ${claimId} was created by another actor`);
  }
  const actor = ledger.find("Actor", contribution.actorId);
  if (actor) {
    const kind = actor.fields["kind"];
    if (kind === "agent" && contribution.aiInvolvement !== "autonomous") errors.push("a contribution by an agent is autonomous");
    if (kind === "human" && contribution.aiInvolvement === "autonomous") errors.push("a contribution by a human is not autonomous");
  }
  return errors;
}
