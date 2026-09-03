import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, ALLOWED_TARGET_TYPES, TARGET_TYPE_TO_KIND, type Ref } from "../targets.ts";

export const TYPE = "Comment" as const;

export interface Comment extends RevisableBase {
  type: typeof TYPE;
  targetType: "problem" | "statement" | "clause" | "claim" | "reference" | "contribution" | "trajectory" | "review";
  targetId: string;
  parentCommentId: string | null;
  promotedToContributionId: string | null;
}

export function references(comment: Comment): Ref[] {
  const kind = TARGET_TYPE_TO_KIND[comment.targetType];
  return [
    ...ref("createdBy", "Actor", comment.createdBy),
    ...(kind ? ref("targetId", kind, comment.targetId) : []),
    ...ref("parentCommentId", "Comment", comment.parentCommentId),
    ...ref("promotedToContributionId", "Contribution", comment.promotedToContributionId),
  ];
}

export function rules(comment: Comment, ledger: Ledger): string[] {
  const errors: string[] = [];
  if (!ALLOWED_TARGET_TYPES.Comment.includes(comment.targetType)) errors.push(`comments cannot target ${comment.targetType}`);
  if (comment.parentCommentId !== null) {
    const parent = ledger.find("Comment", comment.parentCommentId);
    if (parent && (parent.fields["targetType"] !== comment.targetType || parent.fields["targetId"] !== comment.targetId)) {
      errors.push("a reply must target the same record as its parent");
    }
  }
  return errors;
}
