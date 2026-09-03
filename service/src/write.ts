/**
 * The write path. A batch of new records from one actor lands as files, is validated and
 * committed as a unit, then the automatic decisions that follow are computed and committed
 * as a second unit by the system actor. Every step is a ledger record; nothing is held in
 * the service alone.
 */
import type { LedgerRepo, NewRecord, WriteResult } from "./ledger-repo.ts";
import type { Index } from "./index.ts";
import type { Policy } from "../../contract/src/policy.ts";
import type { Contribution } from "../../contract/src/types/contribution.ts";
import { evaluate, unreviewedAcceptance, acceptanceDecision, consequences, pending, type AcceptanceContext } from "./acceptance.ts";

export interface Service {
  repo: LedgerRepo;
  index: Index;
  policy: Policy;
  systemActorId: string;
}

export interface SubmitResult extends WriteResult {
  decisions: string[];
}

function actorAuthor(service: Service, actorId: string): { name: string; email: string } {
  const actor = service.repo.current().find("Actor", actorId);
  const name = actor ? String(actor.fields["name"]) : actorId;
  return { name, email: `${actorId.toLowerCase()}@actors.quantum-open-problems.invalid` };
}

/** Write a batch on behalf of an actor, then run the automatic decisions. */
export function submit(service: Service, actorId: string, batch: NewRecord[], message: string): SubmitResult {
  const result = service.repo.write(batch, message, actorAuthor(service, actorId));
  if (!result.ok) return { ...result, decisions: [] };
  const decisions = runAutomaticDecisions(service);
  reindex(service);
  return { ...result, decisions };
}

/** Look at every pending contribution and issue whatever the policy now allows. Repeats until nothing changes. */
export function runAutomaticDecisions(service: Service): string[] {
  const issued: string[] = [];
  for (let round = 0; round < 5; round += 1) {
    const ledger = service.repo.current();
    const context: AcceptanceContext = { ledger, policy: service.policy, systemActorId: service.systemActorId };
    const batch: NewRecord[] = [];
    for (const record of pending(ledger)) {
      const contribution = record.fields as unknown as Contribution;
      const verdict = unreviewedAcceptance(context, contribution) ?? evaluate(context, contribution);
      if (!verdict) continue;
      batch.push(acceptanceDecision(context, contribution, verdict));
      batch.push(...consequences(context, contribution, verdict));
    }
    if (batch.length === 0) break;
    const result = service.repo.write(batch, `Automatic decisions under policy ${service.policy.policyVersion}`, actorAuthor(service, service.systemActorId));
    if (!result.ok) {
      const detail = result.issues.slice(0, 3).map((issue) => `${issue.path}: ${issue.message}`).join("; ");
      throw new Error(`automatic decisions did not validate: ${detail}`);
    }
    issued.push(...batch.map((record) => String(record.fields["id"])));
  }
  return issued;
}

export function reindex(service: Service): { records: number; lastSequence: number } {
  return service.index.rebuild(service.repo.current(), service.repo.sequences());
}
