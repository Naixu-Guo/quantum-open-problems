/**
 * Record types, target types, and the one table of which targets each record type may name.
 */
export const RECORD_TYPES = [
  "Problem",
  "Statement",
  "Claim",
  "Source",
  "Reference",
  "Actor",
  "Trajectory",
  "Contribution",
  "Artifact",
  "Review",
  "Comment",
  "Decision",
] as const;
export type RecordType = (typeof RECORD_TYPES)[number];

export const REVISABLE_TYPES: ReadonlySet<RecordType> = new Set(["Problem", "Source", "Reference", "Actor", "Comment"]);

/** What a reference field may point at. `Clause` is addressed as `<statementId>#<clauseId>`. */
export type TargetKind = RecordType | "Clause" | "Ledger";

/** Lower-case `targetType` values used in record headers, mapped to what they resolve to. */
export const TARGET_TYPE_TO_KIND: Readonly<Record<string, TargetKind>> = {
  problem: "Problem",
  statement: "Statement",
  clause: "Clause",
  claim: "Claim",
  source: "Source",
  reference: "Reference",
  actor: "Actor",
  trajectory: "Trajectory",
  contribution: "Contribution",
  artifact: "Artifact",
  review: "Review",
  comment: "Comment",
  decision: "Decision",
  ledger: "Ledger",
};

/** Allowed `targetType` values per record type that carries a polymorphic target. */
export const ALLOWED_TARGET_TYPES: Readonly<Record<"Reference" | "Comment" | "Decision", readonly string[]>> = {
  Reference: ["problem", "statement", "clause", "claim"],
  Comment: ["problem", "statement", "clause", "claim", "reference", "contribution", "trajectory", "review"],
  Decision: ["problem", "contribution", "comment", "statement", "claim", "reference", "trajectory", "review", "ledger"],
};

/** Which target type each decision kind acts on. */
export const DECISION_TARGETS: Readonly<Record<string, readonly string[]>> = {
  admission: ["problem"],
  promotion: ["problem"],
  acceptance: ["contribution"],
  status: ["problem"],
  merge: ["problem"],
  retire: ["problem"],
  moderation: ["comment"],
  redaction: ["problem", "contribution", "comment", "statement", "claim", "reference", "trajectory", "review"],
  release: ["ledger"],
};

export interface Ref {
  field: string;
  target: TargetKind;
  id: string;
}

export const ref = (field: string, target: TargetKind, id: string | null | undefined): Ref[] =>
  id === null || id === undefined ? [] : [{ field, target, id }];

export const refs = (field: string, target: TargetKind, ids: readonly string[]): Ref[] =>
  ids.map((id) => ({ field, target, id }));

export function parseClauseRef(value: string): { statementId: string; clauseId: string } | null {
  const at = value.indexOf("#");
  if (at <= 0) return null;
  return { statementId: value.slice(0, at), clauseId: value.slice(at + 1) };
}
