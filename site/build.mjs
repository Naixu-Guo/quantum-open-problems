// One command builds and validates every read model from the canonical
// catalog: ledger sync, API v1 and packets, website pages and feeds, then
// canonical and read-model validation.

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const scripts = [
  path.join(repositoryRoot, "core", "sync-ledger.mjs"),
  path.join(siteDirectory, "build-api.mjs"),
  path.join(siteDirectory, "generate-pages.mjs"),
  path.join(repositoryRoot, "core", "validate.mjs"),
  path.join(siteDirectory, "validate.mjs")
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
