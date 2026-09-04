import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, type Ref } from "../targets.ts";

export const TYPE = "Claim" as const;

export type ClaimRelation = "resolves" | "refutes" | "narrows" | "supports" | "bounds";

export interface Bound {
  clauseId: string;
  direction: "upper" | "lower" | "exact";
  value: string;
  valueForm: "exact-rational" | "decimal" | "expression";
  conditions: string;
}

export interface Support {
  sourceId: string | null;
  artifactId: string | null;
  locator: string;
  date: string | null;
  maturity: string;
  strength: string;
}

export interface Claim extends ImmutableBase {
  type: typeof TYPE;
  title: string;
  statementId: string;
  clauseIds: string[];
  relation: ClaimRelation;
  bound: Bound | null;
  support: Support[];
}

export function references(claim: Claim): Ref[] {
  return [
    ...ref("createdBy", "Actor", claim.createdBy),
    ...ref("supersedes", "Claim", claim.supersedes),
    ...ref("statementId", "Statement", claim.statementId),
    ...refs("clauseIds", "Clause", claim.clauseIds),
    ...(claim.bound ? ref("bound.clauseId", "Clause", claim.bound.clauseId) : []),
    ...claim.support.flatMap((support, index) => [
      ...ref(`support[${index}].sourceId`, "Source", support.sourceId),
      ...ref(`support[${index}].artifactId`, "Artifact", support.artifactId),
    ]),
  ];
}

export function rules(claim: Claim, ledger: Ledger): string[] {
  const errors: string[] = [];
  for (const clauseRef of claim.clauseIds) {
    if (!clauseRef.startsWith(`${claim.statementId}#`)) errors.push(`clause ${clauseRef} is not a clause of statement ${claim.statementId}`);
  }
  if (claim.relation === "bounds" && claim.bound === null) errors.push("a bounds claim needs a bound");
  if (claim.relation !== "bounds" && claim.bound !== null) errors.push("only a bounds claim carries a bound");
  if (claim.bound) {
    if (!claim.clauseIds.includes(claim.bound.clauseId)) errors.push("bound.clauseId must be one of the claim's clauses");
    const clause = ledger.clause(claim.bound.clauseId);
    if (clause && clause.clause.quantity === null) errors.push("a bound must target a clause with a quantity");
  }
  claim.support.forEach((support, index) => {
    const hasSource = support.sourceId !== null;
    const hasArtifact = support.artifactId !== null;
    if (hasSource === hasArtifact) errors.push(`support[${index}] must name exactly one of sourceId or artifactId`);
  });
  return errors;
}
