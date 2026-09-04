/** Assemble a service from configuration: repository, index, auth store, policy, system actor. */
import path from "node:path";
import { LedgerRepo } from "./ledger-repo.ts";
import { Index } from "./index.ts";
import { AuthStore } from "./auth.ts";
import { loadPolicy, currentPolicyVersion } from "../../contract/src/policy.ts";
import { webDefaults, type Config } from "./config.ts";
import type { Service } from "./write.ts";
import { reindex } from "./write.ts";

export function createService(config: Config): Service {
  const sync = config.git?.remote ? { remote: config.git.remote, branch: config.git.branch ?? null } : null;
  const repo = new LedgerRepo({ mainRoot: config.ledgerDir, activityRoot: config.activityDir, contractDir: config.contractDir, commit: config.commit, sync });
  const policyDir = path.join(config.contractDir, "policy");
  const policy = loadPolicy(currentPolicyVersion(policyDir), policyDir);
  const system = repo.current().currentOf("Actor").find((actor) => actor.fields["kind"] === "system");
  if (!system) throw new Error("the ledger has no system actor");
  const service: Service = {
    repo,
    index: new Index(config.dbPath),
    auth: new AuthStore(config.authDbPath),
    policy,
    systemActorId: system.id,
    artifactStoreDir: path.join(repo.activityRoot, "artifact-store"),
    web: webDefaults(config),
  };
  reindex(service);
  return service;
}
