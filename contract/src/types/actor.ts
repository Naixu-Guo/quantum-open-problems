import type { RevisableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, type Ref } from "../targets.ts";

export const TYPE = "Actor" as const;

export type ActorKind = "human" | "agent" | "pipeline" | "system";

export interface Actor extends RevisableBase {
  type: typeof TYPE;
  name: string;
  kind: ActorKind;
  externalIdentity: string | null;
  operatorId: string | null;
  modelFamily: string | null;
  modelVersion: string | null;
  harness: string | null;
}

export function references(actor: Actor): Ref[] {
  return [...ref("createdBy", "Actor", actor.createdBy), ...ref("operatorId", "Actor", actor.operatorId)];
}

export function rules(actor: Actor, ledger: Ledger): string[] {
  const errors: string[] = [];
  const needsOperator = actor.kind === "agent" || actor.kind === "pipeline";
  if (needsOperator && actor.operatorId === null) errors.push(`a ${actor.kind} must name its operator`);
  if (!needsOperator && actor.operatorId !== null) errors.push(`a ${actor.kind} has no operator`);
  if (actor.kind === "agent" && actor.modelFamily === null) errors.push("an agent must name its model family");
  if (actor.kind !== "agent" && actor.modelFamily !== null) errors.push("only an agent has a model family");
  if (actor.operatorId !== null) {
    const operator = ledger.find("Actor", actor.operatorId);
    if (operator && operator.fields["kind"] !== "human") errors.push("an operator must be a human actor");
  }
  return errors;
}

export function actorKind(ledger: Ledger, actorId: string): ActorKind | null {
  const actor = ledger.find("Actor", actorId);
  return actor ? (actor.fields["kind"] as ActorKind) : null;
}
