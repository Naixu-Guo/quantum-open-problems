/**
 * Usage:
 *   node --experimental-strip-types src/cli.ts serve            start the read API
 *   node --experimental-strip-types src/cli.ts rebuild          rebuild the index from the ledger
 *   node --experimental-strip-types src/cli.ts submit <actorId> <batch.json> [message]
 *   node --experimental-strip-types src/cli.ts decide           run the automatic decisions once
 *   node --experimental-strip-types src/cli.ts sync [--allow-edits]   catch up with the git remote and push unpushed commits
 *   node --experimental-strip-types src/cli.ts id               print a fresh ULID
 *   node --experimental-strip-types src/cli.ts key issue <actorId> [label]   print a new bearer token once
 *   node --experimental-strip-types src/cli.ts key revoke <token>
 *   node --experimental-strip-types src/cli.ts identity link github <github-user-id> <actorId>   bind a GitHub account to an existing actor
 *   node --experimental-strip-types src/cli.ts bootstrap-editor <github-user-id> <name>   provision and link the first human editor
 *   node --experimental-strip-types src/cli.ts proposals list [state] [limit]   the inbox of proposals from the contribution form, newest first
 *   node --experimental-strip-types src/cli.ts proposals show <id>              one proposal as text
 *   node --experimental-strip-types src/cli.ts proposals export <id> [file]     one proposal as JSON, to stdout or a file
 *   node --experimental-strip-types src/cli.ts proposals set <id> <state> [note]   move a proposal to new, in-review, accepted, rejected, or spam
 */
import fs from "node:fs";
import { configFromEnv } from "./config.ts";
import { createService } from "./service.ts";
import { createServer } from "./api.ts";
import { submit, runAutomaticDecisions, reindex } from "./write.ts";
import { newId } from "./ids.ts";
import { bootstrapEditor } from "./bootstrap.ts";
import { linkGitHubIdentity } from "./github-identity.ts";
import { submissionText, SUBMISSION_STATES, type SubmissionState } from "./submissions.ts";

const [command, ...args] = process.argv.slice(2);

if (command === "id") {
  console.log(newId());
  process.exit(0);
}

const config = configFromEnv();
const service = createService(config);

switch (command) {
  case "bootstrap-editor": {
    try {
      if (args.length !== 2) throw new Error("usage: bootstrap-editor <numeric-github-user-id> <name>");
      console.log(`Editor ${bootstrapEditor(service, args[0]!, args[1]!)} linked to GitHub user ${args[0]}.`);
    } catch (error) { console.error(String(error)); process.exitCode = 1; }
    service.index.close();
    service.auth.close();
    break;
  }
  case "serve": {
    const server = createServer(service);
    server.listen(config.port, config.host, () => console.log(`Quantum Open Problems service on http://${config.host ?? "localhost"}:${config.port}/api/v1/status`));
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
  case "key": {
    const [action, subject, label] = args;
    if (action === "issue" && subject) {
      if (!service.repo.current().find("Actor", subject)) { console.error(`unknown actor ${subject}`); process.exit(1); }
      console.log(service.auth.issueKey(subject, label ?? "cli"));
    } else if (action === "revoke" && subject) {
      console.log(service.auth.revokeKey(subject) ? "revoked" : "no such active key");
    } else {
      console.error("usage: key issue <actorId> [label] | key revoke <token>");
      process.exit(2);
    }
    break;
  }
  case "identity": {
    const [action, provider, subject, actorId] = args;
    if (action === "link" && provider && subject && actorId) {
      if (!service.repo.current().find("Actor", actorId)) { console.error(`unknown actor ${actorId}`); process.exit(1); }
      if (provider === "github") linkGitHubIdentity(service, subject, actorId);
      else service.auth.linkIdentity(provider, subject, actorId, "");
      console.log(`linked ${provider}:${subject} to ${actorId}`);
    } else {
      console.error("usage: identity link <provider> <subject> <actorId>");
      process.exit(2);
    }
    break;
  }
  case "sync": {
    const result = service.repo.synchronize({ allowEdits: args.includes("--allow-edits") });
    if (result.refused) { console.error(`refused: ${result.refused}`); process.exit(1); }
    for (const state of result.state ?? []) console.log(`${state.repository}: ${state.remote}/${state.branch} ahead ${state.ahead ?? "?"} behind ${state.behind ?? "?"}${state.lastError ? ` (${state.lastError})` : ""}`);
    reindex(service);
    if (!result.pushed) process.exit(1);
    break;
  }
  case "decide": {
    const automatic = runAutomaticDecisions(service);
    reindex(service);
    console.log(`Issued ${automatic.issued.length} decision(s).`);
    for (const issue of automatic.issues) console.error(`  [${issue.category}] ${issue.path}: ${issue.message}`);
    break;
  }
  case "proposals": {
    const [action, first, second, ...rest] = args;
    const inbox = service.submissions;
    const isState = (value: string | undefined): value is SubmissionState => value !== undefined && (SUBMISSION_STATES as readonly string[]).includes(value);
    if (action === "list") {
      if (first !== undefined && !isState(first)) { console.error(`state must be one of ${SUBMISSION_STATES.join(", ")}`); process.exit(2); }
      const counts = inbox.counts();
      console.log(SUBMISSION_STATES.map((state) => `${state} ${counts[state]}`).join("  "));
      for (const row of inbox.list({ state: first, limit: second ? Number(second) : 50 })) {
        console.log(`${row.id}  ${row.receivedAt}  ${row.state.padEnd(9)}  ${row.title}  —  ${row.contributor.name} <${row.contributor.email}>`);
      }
    } else if (action === "show" && first) {
      const found = inbox.get(first);
      if (!found) { console.error(`no proposal ${first}`); process.exit(1); }
      console.log(submissionText(found));
    } else if (action === "export" && first) {
      const found = inbox.get(first);
      if (!found) { console.error(`no proposal ${first}`); process.exit(1); }
      const json = `${JSON.stringify(found, null, 2)}\n`;
      if (second) { fs.writeFileSync(second, json); console.log(`wrote ${second}`); } else process.stdout.write(json);
    } else if (action === "set" && first && isState(second)) {
      const updated = inbox.setState(first, second, rest.join(" "), null);
      if (!updated) { console.error(`no proposal ${first}`); process.exit(1); }
      console.log(`${updated.id} is now ${updated.state}`);
    } else {
      console.error("usage: proposals list [state] [limit] | proposals show <id> | proposals export <id> [file] | proposals set <id> <state> [note]");
      process.exit(2);
    }
    break;
  }
  default:
    console.error("usage: serve | rebuild | submit <actorId> <batch.json> [message] | decide | sync | bootstrap-editor <github-id> <name> | key issue|revoke | identity link | proposals list|show|export|set | id");
    process.exit(2);
}
