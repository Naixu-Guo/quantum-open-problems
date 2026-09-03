/** Assemble a service from configuration: repository, index, policy, system actor. */
import { LedgerRepo } from "./ledger-repo.ts";
import { Index } from "./index.ts";
import { loadPolicy, currentPolicyVersion } from "../../contract/src/policy.ts";
import path from "node:path";
import type { Config } from "./config.ts";
import type { Service } from "./write.ts";
import { reindex } from "./write.ts";

export function createService(config: Config): Service {
  const repo = new LedgerRepo({ mainRoot: config.ledgerDir, activityRoot: config.activityDir, contractDir: config.contractDir, commit: config.commit });
  const policyDir = path.join(config.contractDir, "policy");
  const policy = loadPolicy(currentPolicyVersion(policyDir), policyDir);
  const system = repo.current().currentOf("Actor").find((actor) => actor.fields["kind"] === "system");
  if (!system) throw new Error("the ledger has no system actor");
  const index = new Index(config.dbPath);
  const service: Service = { repo, index, policy, systemActorId: system.id };
  reindex(service);
  return service;
}
