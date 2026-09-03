/**
 * The write path. A batch of new records from one actor lands as files, is validated and
 * committed as a unit; then the automatic decisions that follow are computed one contribution
 * at a time, each committed by the system actor before the next is evaluated, so every
 * decision sees the ledger as it is. A failure in the automatic step is reported, never thrown
 * past the caller: the actor's own write has already been committed and must be acknowledged.
 */
import type { LedgerRepo, NewRecord, WriteResult } from "./ledger-repo.ts";
import type { Issue } from "../../contract/src/validate.ts";
import type { Index } from "./index.ts";
import type { AuthStore } from "./auth.ts";
import type { Policy } from "../../contract/src/policy.ts";
import type { WebConfig } from "./config.ts";
import type { Contribution } from "../../contract/src/types/contribution.ts";
import { evaluate, unreviewedAcceptance, acceptanceDecision, consequences, pending, type AcceptanceContext } from "./acceptance.ts";

export interface Service {
  repo: LedgerRepo;
  index: Index;
  auth: AuthStore;
  policy: Policy;
  systemActorId: string;
  artifactStoreDir: string;
  /** The web app and human login; see `config.ts`. */
  web: WebConfig;
}

export interface SubmitResult extends WriteResult {
  /** Ids of the automatic decisions issued after this write. */
  decisions: string[];
  /** Issues from automatic decisions that could not be written; the actor's write stands. */
  automaticIssues: Issue[];
}

function actorAuthor(service: Service, actorId: string): { name: string; email: string } {
  const actor = service.repo.current().find("Actor", actorId);
  const name = actor ? String(actor.fields["name"]) : actorId;
  return { name, email: `${actorId.toLowerCase()}@actors.quantum-open-problems.invalid` };
}

/** Write a batch on behalf of an actor, then run the automatic decisions and reindex. */
export function submit(service: Service, actorId: string, batch: NewRecord[], message: string): SubmitResult {
  const result = service.repo.write(batch, message, actorAuthor(service, actorId));
  if (!result.ok) return { ...result, decisions: [], automaticIssues: [] };
  const automatic = runAutomaticDecisions(service);
  reindex(service);
  return { ...result, decisions: automatic.issued, automaticIssues: automatic.issues };
}

/**
 * Settle pending contributions one at a time: evaluate, write the acceptance and its
 * consequences, reload, repeat. Stops when no pending contribution has a verdict or when a
 * write fails; a failed contribution is skipped for the rest of this run and reported.
 */
export function runAutomaticDecisions(service: Service): { issued: string[]; issues: Issue[] } {
  const issued: string[] = [];
  const issues: Issue[] = [];
  const skipped = new Set<string>();
  const limit = pending(service.repo.current()).length + 8;
  for (let round = 0; round < limit; round += 1) {
    const ledger = service.repo.current();
    const context: AcceptanceContext = { ledger, policy: service.policy, systemActorId: service.systemActorId };
    let progressed = false;
    for (const record of pending(ledger)) {
      if (skipped.has(record.id)) continue;
      const contribution = record.fields as unknown as Contribution;
      const verdict = unreviewedAcceptance(context, contribution) ?? evaluate(context, contribution);
      if (!verdict) continue;
      const batch = [acceptanceDecision(context, contribution, verdict), ...consequences(context, contribution, verdict)];
      const result = service.repo.write(batch, `Automatic decisions on ${contribution.id} under policy ${service.policy.policyVersion}`, actorAuthor(service, service.systemActorId));
      if (!result.ok) {
        skipped.add(record.id);
        issues.push(...result.issues.map((issue) => ({ ...issue, path: `${record.id}: ${issue.path}` })));
        continue;
      }
      issued.push(...batch.map((item) => String(item.fields["id"])));
      progressed = true;
      break;
    }
    if (!progressed) break;
  }
  return { issued, issues };
}

export function reindex(service: Service): { records: number; lastSequence: number } {
  return service.index.rebuild(service.repo.current(), service.repo.sequences());
}
