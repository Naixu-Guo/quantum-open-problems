import { isDeepStrictEqual } from "node:util";
import type { ProblemStatus } from "./decision.ts";
import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, type Ref } from "../targets.ts";

export const TYPE = "Problem" as const;

export type ProblemRole = "primary" | "auxiliary";
export type ProblemOrigin = "source-stated" | "derived" | "editor-formulated" | "agent-formulated";

export interface AuthoredCatalog {
  status: ProblemStatus;
  sourcePath: string;
  record?: Record<string, unknown>;
}

export interface Problem extends RevisableBase {
  type: typeof TYPE;
  title: string;
  role: ProblemRole;
  parentProblemId: string | null;
  parentClauseId: string | null;
  aliases: string[];
  /** Imported authority, distinct from any ledger review or verification claim. */
  authoredCatalog?: AuthoredCatalog;
  origin: ProblemOrigin;
  posed: string | null;
  areaIds: string[];
  topicIds: string[];
  keywords: string[];
  difficulty: "unrated" | "accessible" | "hard" | "very-hard";
  verificationCost: "unrated" | "low" | "medium" | "high";
  relatedProblemIds: string[];
}

export function references(problem: Problem): Ref[] {
  return [
    ...ref("createdBy", "Actor", problem.createdBy),
    ...ref("parentProblemId", "Problem", problem.parentProblemId),
    ...ref("parentClauseId", "Clause", problem.parentClauseId),
    ...refs("relatedProblemIds", "Problem", problem.relatedProblemIds),
  ];
}

export function rules(problem: Problem, ledger: Ledger): string[] {
  const errors: string[] = [];
  const previous = (ledger.revisions.get(problem.id) ?? []).find((record) => record.type === "Problem" && record.fields["revision"] === problem.revision - 1);
  if (previous && !isDeepStrictEqual(previous.fields["authoredCatalog"], problem.authoredCatalog)) {
    errors.push("authoredCatalog is an authoritative import snapshot and cannot be added, removed, or changed by a problem revision");
  }
  const hasParent = problem.parentProblemId !== null;
  if (problem.role === "auxiliary" && !hasParent) errors.push("an auxiliary problem must name its parent problem");
  if (problem.role === "primary" && hasParent) errors.push("a primary problem has no parent");
  if (hasParent && problem.parentClauseId === null) errors.push("an auxiliary problem must name the parent clause it was formulated for");
  if (problem.parentClauseId !== null) {
    const clause = ledger.clause(problem.parentClauseId);
    if (clause && clause.statement.problemId !== problem.parentProblemId) {
      errors.push("parentClauseId must belong to a statement of parentProblemId");
    }
  }
  if (problem.relatedProblemIds.includes(problem.id)) errors.push("a problem cannot be related to itself");
  return errors;
}
