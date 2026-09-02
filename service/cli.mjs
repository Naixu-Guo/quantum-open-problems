#!/usr/bin/env node
// Administrative and editorial command line for the operational service.
//
//   node service/cli.mjs actor create --db <path> --type human|ai-agent|organization --name "..." [--identifier ...]
//        [--roles contributor,reviewer,editor,moderator] [--provider ...] [--model ...] [--operator ...] [--agent-name ...] [--client-id ...]
//   node service/cli.mjs actor list --db <path>
//   node service/cli.mjs actor set-roles --db <path> --actor <id> --roles ...
//   node service/cli.mjs key issue --db <path> --actor <id> [--label ...]
//   node service/cli.mjs key revoke --db <path> --key <api key>
//   node service/cli.mjs ingest --db <path> [--site <dir>]
//   node service/cli.mjs promote <cu-id> --service <url> --api-key <key> [--date YYYY-MM-DD] [--dry-run]
//
// Admin commands open the database directly and run on the service host.
// `promote` is an HTTP client: it reads the accepted candidate update from
// the service, writes the canonical patch into this checkout, refreshes the
// published-revision manifest, and records the promotion on the service.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { loadCatalog, repositoryRoot, sourcesDirectory, writeJson } from "../core/catalog.mjs";
import { buildPromotion } from "../core/promotion.mjs";
import { newActorId, newApiKey } from "./ids.mjs";
import { ROLES } from "./policy.mjs";
import { openReadModels } from "./read-models.mjs";
import { ingestCanonicalLedger } from "./events.mjs";
import { openStore } from "./store.mjs";

const args = process.argv.slice(2);
const positional = [];
const flags = {};
for (let index = 0; index < args.length; index += 1) {
  if (args[index].startsWith("--")) {
    const key = args[index].slice(2);
    const next = args[index + 1];
    if (next === undefined || next.startsWith("--")) flags[key] = true;
    else { flags[key] = next; index += 1; }
  } else positional.push(args[index]);
}
const fail = (message) => { console.error(message); process.exit(1); };
const requireFlag = (name) => flags[name] ?? fail(`--${name} is required`);
const withStore = (operation) => {
  const dbPath = requireFlag("db");
  fs.mkdirSync(path.dirname(path.resolve(dbPath)), { recursive: true });
  const store = openStore(dbPath);
  try { return operation(store); } finally { store.close(); }
};
const parseRoles = (value) => {
  const roles = String(value || "contributor").split(",").map((role) => role.trim()).filter(Boolean);
  for (const role of roles) if (!ROLES.includes(role)) fail(`unknown role ${role}; valid roles: ${ROLES.join(", ")}`);
  return roles;
};

const [command, subcommand] = positional;

if (command === "actor" && subcommand === "create") {
  withStore((store) => {
    const type = requireFlag("type");
    if (!["human", "ai-agent", "organization"].includes(type)) fail("--type must be human, ai-agent, or organization");
    const actor = store.insertActor({
      id: newActorId(),
      type,
      displayName: requireFlag("name"),
      identifier: flags.identifier || null,
      metadata: {
        ...(flags.provider ? { provider: flags.provider } : {}),
        ...(flags.model ? { model: flags.model } : {}),
        ...(flags.operator ? { operator: flags.operator } : {}),
        ...(flags["agent-name"] ? { agentName: flags["agent-name"] } : {}),
        ...(flags["client-id"] ? { clientId: flags["client-id"] } : {}),
        ...(flags.affiliation ? { affiliation: flags.affiliation } : {}),
        ...(flags.url ? { url: flags.url } : {})
      },
      roles: parseRoles(flags.roles),
      state: "active"
    });
    if (type === "ai-agent" && !actor.metadata.operator) console.warn("Warning: AI agents should declare an accountable --operator.");
    const key = newApiKey();
    store.insertApiKey(key, actor.id, flags.label || "initial");
    store.appendEvent({ id: `sevt-${actor.id.replace("actor-", "")}-registered`, type: "actor.registered", objectType: "Actor", objectId: actor.id, problemId: null, actorId: actor.id, revision: null, payload: { type: actor.type, displayName: actor.displayName, roles: actor.roles }, source: "service" });
    console.log(JSON.stringify({ actor, apiKey: key, note: "Store the API key now; it is not retrievable later." }, null, 2));
  });
} else if (command === "actor" && subcommand === "list") {
  withStore((store) => console.log(JSON.stringify(store.listActors(), null, 2)));
} else if (command === "actor" && subcommand === "set-roles") {
  withStore((store) => {
    const id = requireFlag("actor");
    if (!store.getActor(id)) fail(`unknown actor ${id}`);
    store.setActorRoles(id, parseRoles(requireFlag("roles")));
    console.log(JSON.stringify(store.getActor(id), null, 2));
  });
} else if (command === "key" && subcommand === "issue") {
  withStore((store) => {
    const id = requireFlag("actor");
    if (!store.getActor(id)) fail(`unknown actor ${id}`);
    const key = newApiKey();
    store.insertApiKey(key, id, flags.label || null);
    console.log(JSON.stringify({ actorId: id, apiKey: key }, null, 2));
  });
} else if (command === "key" && subcommand === "revoke") {
  withStore((store) => { store.revokeApiKey(requireFlag("key")); console.log("revoked"); });
} else if (command === "ingest") {
  withStore((store) => {
    const readModels = openReadModels(path.resolve(flags.site || path.join(repositoryRoot, "site")));
    console.log(JSON.stringify(ingestCanonicalLedger(store, readModels)));
  });
} else if (command === "promote") {
  const candidateUpdateId = subcommand || fail("usage: promote <cu-id> --service <url> --api-key <key>");
  const serviceUrl = String(flags.service || process.env.QOP_SERVICE_URL || "").replace(/\/$/, "") || fail("--service or QOP_SERVICE_URL is required");
  const apiKey = flags["api-key"] || process.env.QOP_API_KEY || fail("--api-key or QOP_API_KEY is required");
  const promotedOn = flags.date || new Date().toISOString().slice(0, 10);
  const headers = { Authorization: `Bearer ${apiKey}`, Accept: "application/json", "Content-Type": "application/json" };
  const request = async (route, options = {}) => {
    const response = await fetch(`${serviceUrl}${route}`, { headers, ...options });
    const body = await response.json();
    if (!response.ok) fail(`${route} failed with ${response.status}: ${JSON.stringify(body.error || body)}`);
    return body;
  };
  const run = async () => {
    const me = await request("/api/v1/actors/me");
    if (!me.roles.includes("editor")) fail("promotion requires an actor with the editor role");
    const candidateUpdate = await request(`/api/v1/candidate-updates/${candidateUpdateId}`);
    const catalog = loadCatalog();
    const bundle = catalog.bundleById.get(candidateUpdate.problemId) || fail(`problem ${candidateUpdate.problemId} is not in the canonical catalog checkout`);
    const { reviews, links, kind, trust, reviewCount, ...update } = candidateUpdate;
    const result = buildPromotion({
      bundle,
      catalog,
      candidateUpdate: update,
      reviews: reviews.map(({ links: reviewLinks, kind: reviewKind, ...review }) => review),
      promotedOn,
      promotedByActorId: me.id
    });
    if (result.errors.length) fail(`Promotion refused:\n- ${result.errors.join("\n- ")}`);
    console.log(`Promotion of ${candidateUpdateId} into ${candidateUpdate.problemId}:`);
    for (const id of result.promotedObjectIds) console.log(`  + ${id}`);
    for (const source of result.newSources) console.log(`  + source ${source.id} (url-only; complete the bibliography)`);
    if (result.statusEffect !== "none") console.log(`  status effect: ${result.statusEffect}`);
    if (flags["dry-run"]) { console.log("Dry run: no files written, nothing recorded."); return; }
    writeJson(path.join(bundle.directory, "record.json"), result.record);
    fs.mkdirSync(path.join(bundle.directory, "contributions"), { recursive: true });
    writeJson(path.join(bundle.directory, result.contributionPath), result.snapshot);
    for (const source of result.newSources) writeJson(path.join(sourcesDirectory, `${source.id}.json`), source);
    if (result.registry) {
      writeJson(catalog.paths.registryPath, result.registry);
      console.log(`  catalogAsOf advanced to ${result.registry.catalogAsOf}`);
    }
    const manifest = spawnSync(process.execPath, [path.join(repositoryRoot, "scripts", "record-published-revisions.mjs"), candidateUpdate.problemId], { stdio: "inherit" });
    if (manifest.status !== 0) fail("could not refresh the published-revision manifest");
    const recorded = await request(`/api/v1/candidate-updates/${candidateUpdateId}/promotion`, {
      method: "POST",
      body: JSON.stringify({ promotedOn, promotedObjectIds: result.promotedObjectIds, contributionPath: result.contributionPath })
    });
    console.log(`Recorded promotion on the service (state ${recorded.reviewState}).`);
    console.log("Next: run `node site/build.mjs`, review the diff under catalog/, and commit or open a pull request.");
  };
  run().catch((error) => fail(error.message));
} else {
  fail("usage: node service/cli.mjs <actor create|actor list|actor set-roles|key issue|key revoke|ingest|promote> ...");
}
