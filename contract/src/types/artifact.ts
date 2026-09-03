import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";

export const TYPE = "Artifact" as const;

export interface Check {
  actorId: string;
  method: string;
  outcome: "pass" | "fail" | "error";
  log: string;
}

export interface Artifact extends ImmutableBase {
  type: typeof TYPE;
  title: string;
  digest: string;
  kind: "proof-text" | "lean" | "coq" | "code" | "certificate" | "notebook" | "dataset" | "transcript" | "event-log" | "log" | "figure";
  mediaType: string;
  size: number;
  uri: string;
  trajectoryId: string | null;
  checkable: boolean;
  checks: Check[];
}

export function references(artifact: Artifact): Ref[] {
  return [
    ...ref("createdBy", "Actor", artifact.createdBy),
    ...ref("supersedes", "Artifact", artifact.supersedes),
    ...ref("trajectoryId", "Trajectory", artifact.trajectoryId),
    ...artifact.checks.flatMap((check, index) => ref(`checks[${index}].actorId`, "Actor", check.actorId)),
  ];
}

const CHECKABLE_KINDS = new Set(["lean", "coq", "code", "certificate", "notebook"]);

export function rules(artifact: Artifact, _ledger: Ledger): string[] {
  const errors: string[] = [];
  if (artifact.checkable && !CHECKABLE_KINDS.has(artifact.kind)) errors.push(`an artifact of kind ${artifact.kind} cannot be checkable`);
  if (!artifact.checkable && artifact.checks.length > 0) errors.push("checks were recorded on an artifact that is not checkable");
  return errors;
}

export function passedCheck(artifact: Artifact): boolean {
  return artifact.checkable && artifact.checks.some((check) => check.outcome === "pass");
}
