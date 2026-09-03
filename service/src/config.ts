/** Service configuration from the environment, with defaults that point at this repository. */
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");

export interface Config {
  ledgerDir: string;
  activityDir: string;
  contractDir: string;
  dbPath: string;
  port: number;
  /** Whether the service commits to git after each accepted write. Tests turn it on against a temporary repository. */
  commit: boolean;
}

export function configFromEnv(env: NodeJS.ProcessEnv = process.env): Config {
  return {
    ledgerDir: path.resolve(env["QOP_LEDGER_DIR"] ?? path.join(repoRoot, "ledger")),
    activityDir: path.resolve(env["QOP_ACTIVITY_DIR"] ?? path.join(repoRoot, "activity")),
    contractDir: path.resolve(env["QOP_CONTRACT_DIR"] ?? path.join(repoRoot, "contract")),
    dbPath: path.resolve(env["QOP_DB_PATH"] ?? path.join(repoRoot, "service", "data", "index.sqlite")),
    port: Number(env["QOP_PORT"] ?? 8787),
    commit: env["QOP_COMMIT"] !== "0",
  };
}
