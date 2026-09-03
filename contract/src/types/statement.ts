import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";
import { statementDigest } from "../digest.ts";

export const TYPE = "Statement" as const;

export type ClauseKind = "existence" | "universal" | "value" | "construction" | "bound" | "decision";

export interface Quantity {
  name: string;
  symbol: string;
  direction: "upper" | "lower" | "exact";
}

export interface Clause {
  id: string;
  label: string;
  text: string;
  kind: ClauseKind;
  resolutionCriteria: string;
  supersedesClauseId: string | null;
  quantity: Quantity | null;
}

export interface Statement extends ImmutableBase {
  type: typeof TYPE;
  problemId: string;
  version: number;
  digest: string;
  clauses: Clause[];
}

export function references(statement: Statement): Ref[] {
  return [
    ...ref("createdBy", "Actor", statement.createdBy),
    ...ref("supersedes", "Statement", statement.supersedes),
    ...ref("problemId", "Problem", statement.problemId),
    ...statement.clauses.flatMap((clause) => ref(`clauses[${clause.id}].supersedesClauseId`, "Clause", clause.supersedesClauseId)),
  ];
}

export function rules(statement: Statement, ledger: Ledger): string[] {
  const errors: string[] = [];
  const expected = statementDigest(statement.body);
  if (statement.digest !== expected) errors.push(`digest ${statement.digest} does not match the normalized body (${expected})`);

  const ids = new Set<string>();
  for (const clause of statement.clauses) {
    if (ids.has(clause.id)) errors.push(`duplicate clause id ${clause.id}`);
    ids.add(clause.id);
    const needsQuantity = clause.kind === "bound" || clause.kind === "value";
    if (needsQuantity && clause.quantity === null) errors.push(`clause ${clause.id} of kind ${clause.kind} needs a quantity`);
    if (!needsQuantity && clause.quantity !== null) errors.push(`clause ${clause.id} of kind ${clause.kind} must not carry a quantity`);
    if (clause.supersedesClauseId !== null) {
      const previous = ledger.clause(clause.supersedesClauseId);
      if (previous && previous.statement.problemId !== statement.problemId) {
        errors.push(`clause ${clause.id} supersedes a clause of another problem`);
      }
      if (previous && previous.statement.version >= statement.version) {
        errors.push(`clause ${clause.id} supersedes a clause from a later or equal statement version`);
      }
    }
  }

  if (statement.version === 1 && statement.supersedes !== null) errors.push("version 1 cannot supersede a statement");
  if (statement.version > 1) {
    if (statement.supersedes === null) errors.push(`version ${statement.version} must name the statement it supersedes`);
    const previous = statement.supersedes ? ledger.find("Statement", statement.supersedes) : undefined;
    if (previous) {
      const prev = previous.fields as unknown as Statement;
      if (prev.problemId !== statement.problemId) errors.push("a statement can only supersede a statement of the same problem");
      if (prev.version !== statement.version - 1) errors.push("statement versions must be consecutive");
    }
  }
  return errors;
}
