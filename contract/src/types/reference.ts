import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, ALLOWED_TARGET_TYPES, TARGET_TYPE_TO_KIND, type Ref } from "../targets.ts";

export const TYPE = "Reference" as const;

export type ReferenceRole =
  | "states-problem"
  | "listed-in"
  | "background"
  | "defines"
  | "prior-attempt"
  | "partial-result"
  | "technique"
  | "related"
  | "survey"
  | "resolves";

export interface Reference extends RevisableBase {
  type: typeof TYPE;
  sourceId: string;
  targetType: "problem" | "statement" | "clause" | "claim";
  targetId: string;
  role: ReferenceRole;
  locator: string;
}

export function references(reference: Reference): Ref[] {
  const kind = TARGET_TYPE_TO_KIND[reference.targetType];
  return [
    ...ref("createdBy", "Actor", reference.createdBy),
    ...ref("sourceId", "Source", reference.sourceId),
    ...(kind ? ref("targetId", kind, reference.targetId) : []),
  ];
}

export function rules(reference: Reference, ledger: Ledger): string[] {
  const errors: string[] = [];
  if (!ALLOWED_TARGET_TYPES.Reference.includes(reference.targetType)) errors.push(`references cannot target ${reference.targetType}`);
  if (reference.role === "listed-in") {
    const source = ledger.find("Source", reference.sourceId);
    if (source && source.fields["kind"] !== "problem-list") errors.push("a listed-in reference must point at a problem-list source");
  }
  return errors;
}
