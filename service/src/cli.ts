/**
 * Usage:
 *   node --experimental-strip-types src/cli.ts serve            start the read API
 *   node --experimental-strip-types src/cli.ts rebuild          rebuild the index from the ledger
 *   node --experimental-strip-types src/cli.ts submit <actorId> <batch.json> [message]
 *   node --experimental-strip-types src/cli.ts decide           run the automatic decisions once
 *   node --experimental-strip-types src/cli.ts id               print a fresh ULID
 */
import fs from "node:fs";
import { configFromEnv } from "./config.ts";
import { createService } from "./service.ts";
import { createServer } from "./api.ts";
import { submit, runAutomaticDecisions, reindex } from "./write.ts";
import { newId } from "./ids.ts";

const [command, ...args] = process.argv.slice(2);

if (command === "id") {
  console.log(newId());
  process.exit(0);
}

const config = configFromEnv();
const service = createService(config);

switch (command) {
  case "serve": {
    const server = createServer(service);
    server.listen(config.port, () => console.log(`Quantum Open Problems service on http://localhost:${config.port}/api/v1/status`));
    break;
  }
  case "rebuild": {
    const result = reindex(service);
    console.log(`Indexed ${result.records} records; last sequence ${result.lastSequence}.`);
    break;
  }
  case "submit": {
    const [actorId, file, message] = args;
    if (!actorId || !file) { console.error("usage: submit <actorId> <batch.json> [message]"); process.exit(2); }
    const batch = JSON.parse(fs.readFileSync(file, "utf8")) as { fields: Record<string, unknown>; body: string }[];
    const result = submit(service, actorId, batch, message ?? `Submission by ${actorId}`);
    if (!result.ok) {
      console.error(`Rejected with ${result.issues.length} issue(s):`);
      for (const issue of result.issues) console.error(`  [${issue.category}] ${issue.path}: ${issue.message}`);
      process.exit(1);
    }
    console.log(`Committed ${result.paths.length} record(s)${result.commit ? ` in ${result.commit.slice(0, 7)}` : ""}; ${result.decisions.length} automatic decision(s).`);
    for (const issue of result.automaticIssues) console.error(`  automatic decision skipped: [${issue.category}] ${issue.path}: ${issue.message}`);
    break;
  }
  case "decide": {
    const automatic = runAutomaticDecisions(service);
    reindex(service);
    console.log(`Issued ${automatic.issued.length} decision(s).`);
    for (const issue of automatic.issues) console.error(`  [${issue.category}] ${issue.path}: ${issue.message}`);
    break;
  }
  default:
    console.error("usage: serve | rebuild | submit <actorId> <batch.json> [message] | decide | id");
    process.exit(2);
}
