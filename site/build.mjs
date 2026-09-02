import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const scripts = [
  path.join(siteDirectory, "generate-formal.mjs"),
  path.join(siteDirectory, "generate-sources.mjs"),
  path.join(siteDirectory, "build-api.mjs"),
  path.join(siteDirectory, "generate-packets.mjs"),
  path.join(siteDirectory, "generate-pages.mjs"),
  path.join(siteDirectory, "validate.mjs"),
  path.join(repositoryRoot, "catalog", "validate.mjs")
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
