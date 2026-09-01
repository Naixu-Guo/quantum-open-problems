import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const scripts = [
  "generate-formal.mjs",
  "generate-sources.mjs",
  "build-api.mjs",
  "generate-packets.mjs",
  "generate-pages.mjs",
  "validate.mjs"
];

for (const script of scripts) {
  const result = spawnSync(process.execPath, [path.join(siteDirectory, script)], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}
