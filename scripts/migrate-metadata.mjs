#!/usr/bin/env node
// Add ledger-compatible identities without changing the scientific record.
// The persisted manifest makes subsequent runs independent of Git or main.
// Usage: node scripts/migrate-metadata.mjs [--check] [--root DIR] [--main-ref REF]
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  createRecordMetadata, deterministicUlid, metadataSlug,
  validateRecordMetadata, validateRecordIdentities,
} from "../site/lib/metadata.mjs";
import { validateRecordShape } from "../site/lib/record.mjs";

const MIGRATION_TIMESTAMP = "2026-09-04T22:04:59Z";
const MANIFEST_SCHEMA = "qiqcop-zoo/metadata/1";
const RECORD_SCHEMA = "qiqcop-zoo/record/3";
const ACTORS_SCHEMA = "qiqcop-zoo/actors/1";
const ID_PATTERN = /^op_[A-Za-z0-9]{16}$/;
const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const LEGACY_MATCHES = {
  op_09b9fa91a1ac1a76: "mothe-2023-indefinite-causal-order-asymptotic-metrology",
  op_523ed75735cfe6c3: "ruskai-2007-convex-decompositions-cpt-maps",
  op_7920f48995bc8511: "ruskai-2007-mutually-degradable-channels",
  op_ad05396ff490713c: "ruskai-2007-werner-holevo-channel-multiplicativity",
  op_bca77ec42ddd1d5c: "theoremdb-p42-quantum-pcp-conjecture",
  op_c0b1045a614d2353: "ruskai-2007-additivity-violation-power-m",
};

const object = (value) => value && typeof value === "object" && !Array.isArray(value);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const unique = (values) => [...new Set(values)];
const fail = (message) => { throw new Error(message); };

function options(args) {
  const result = { root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."), check: false, mainRef: null };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--check") result.check = true;
    else if (arg === "--root" || arg === "--main-ref") {
      const value = args[++i];
      if (!value || value.startsWith("--")) fail(`${arg} requires a value`);
      if (arg === "--root") result.root = path.resolve(value);
      else result.mainRef = value;
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: node scripts/migrate-metadata.mjs [--check] [--root DIR] [--main-ref REF]");
      console.log("--main-ref reads only Problem identities, aliases, and revisions from a local Git commit; it never fetches or imports scientific content.");
      return null;
    } else fail(`unknown option: ${arg}`);
  }
  return result;
}

function validateManifest(manifest) {
  if (!object(manifest) || manifest.schema !== MANIFEST_SCHEMA) fail(`metadata.json must use ${MANIFEST_SCHEMA}`);
  if (!ULID_PATTERN.test(manifest.actorId || "")) fail("metadata.json has an invalid actorId");
  if (typeof manifest.migrationTimestamp !== "string" || !Number.isFinite(Date.parse(manifest.migrationTimestamp))) fail("metadata.json has an invalid migrationTimestamp");
  if (!/^[a-f0-9]{40}$/.test(manifest.mainRef || "")) fail("metadata.json mainRef must be a complete Git commit hash");
  if (!object(manifest.mappings)) fail("metadata.json mappings must be an object");
  for (const [id, mapping] of Object.entries(manifest.mappings)) {
    if (!ID_PATTERN.test(id) || !object(mapping) || !ULID_PATTERN.test(mapping.ulid || "")) fail(`invalid identity mapping for ${id}`);
    if (!Array.isArray(mapping.mainAliases) || !mapping.mainAliases.every((alias) => typeof alias === "string" && alias.length > 0)) fail(`invalid mainAliases for ${id}`);
    if (mapping.mainId === null) {
      if (mapping.mainRevision !== null || mapping.mainAliases.length || mapping.matchedBy !== "generated") fail(`invalid generated mapping for ${id}`);
    } else {
      if (!ULID_PATTERN.test(mapping.mainId || "") || mapping.ulid !== mapping.mainId) fail(`inconsistent main identity for ${id}`);
      if (!Number.isSafeInteger(mapping.mainRevision) || mapping.mainRevision < 1) fail(`invalid mainRevision for ${id}`);
      if (!["source-id-alias", "confirmed-legacy-alias"].includes(mapping.matchedBy)) fail(`invalid matchedBy for ${id}`);
    }
  }
  return manifest;
}

// Only these frontmatter fields cross the branch boundary. Statements, titles,
// classifications, statuses, references, and the Markdown body are discarded.
function parseMainIdentity(text, file) {
  const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!header) fail(`${file}: missing frontmatter`);
  const scalar = (key) => header.match(new RegExp(`^${key}: (.+)$`, "m"))?.[1]?.trim();
  const unquote = (value) => value.startsWith('"') ? JSON.parse(value) : value.startsWith("'") ? value.slice(1, -1).replace(/''/g, "'") : value;
  if (unquote(scalar("type") || "") !== "Problem") fail(`${file}: expected a Problem record`);
  const id = unquote(scalar("id") || "");
  const revision = Number(scalar("revision"));
  if (!ULID_PATTERN.test(id) || !Number.isSafeInteger(revision) || revision < 1) fail(`${file}: invalid main identity or revision`);
  const lines = header.split(/\r?\n/);
  const aliasLine = lines.findIndex((line) => /^aliases:(?:\s|$)/.test(line));
  if (aliasLine < 0) fail(`${file}: expected an aliases array`);
  const inline = lines[aliasLine].slice("aliases:".length).trim();
  const aliases = inline ? JSON.parse(inline) : [];
  if (!inline) for (let i = aliasLine + 1; i < lines.length && /^  - /.test(lines[i]); i += 1) aliases.push(unquote(lines[i].slice(4)));
  if (!Array.isArray(aliases) || !aliases.every((alias) => typeof alias === "string")) fail(`${file}: invalid aliases array`);
  return { id, revision, aliases };
}

function mainIdentities(root, ref) {
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
  const commit = git("rev-parse", "--verify", "--end-of-options", `${ref}^{commit}`).trim();
  if (!/^[a-f0-9]{40}$/.test(commit)) fail("--main-ref did not resolve to a Git commit");
  const files = git("ls-tree", "-r", "--name-only", commit, "ledger/problems").trim().split("\n")
    .filter((file) => /^ledger\/problems\/[^/]+\/problem\.r[1-9][0-9]*\.md$/.test(file));
  if (!files.length) fail(`${commit} contains no ledger Problem records`);
  const latest = new Map();
  for (const file of files) {
    const identity = parseMainIdentity(git("show", `${commit}:${file}`), file);
    const previous = latest.get(identity.id);
    if (previous?.revision === identity.revision && json(previous) !== json(identity)) fail(`ambiguous revision of main identity ${identity.id}`);
    if (!previous || previous.revision < identity.revision) latest.set(identity.id, identity);
  }
  const aliases = new Map();
  for (const identity of latest.values()) for (const alias of identity.aliases) {
    if (aliases.has(alias) && aliases.get(alias).id !== identity.id) fail(`ambiguous main alias ${alias}`);
    aliases.set(alias, identity);
  }
  return { commit, aliases };
}

function mappingFor(record, main, timestamp) {
  const sourceMatch = main?.aliases.get(metadataSlug(record.id));
  const legacyMatch = main?.aliases.get(LEGACY_MATCHES[record.id]);
  const match = sourceMatch || legacyMatch;
  if (!match) return {
    ulid: deterministicUlid(`problem:${record.id}`, timestamp),
    mainId: null, mainAliases: [], mainRevision: null, matchedBy: "generated",
  };
  return {
    ulid: match.id, mainId: match.id, mainAliases: match.aliases.slice(),
    mainRevision: match.revision, matchedBy: sourceMatch ? "source-id-alias" : "confirmed-legacy-alias",
  };
}

function systemActor(manifest) {
  return {
    id: manifest.actorId, type: "Actor", schemaVersion: "1.0", revision: 1,
    createdBy: manifest.actorId, createdAt: manifest.migrationTimestamp,
    name: "QIQCOP Zoo metadata migration", kind: "system", roles: [],
    externalIdentity: null, operatorId: null, modelFamily: null, modelVersion: null,
    harness: "scripts/migrate-metadata.mjs",
    body: "System identity recording the metadata adaptation of existing QIQCOP Zoo records. It attributes the identity and classification metadata migration only; it carries no scientific authorship, verification, or admission-review claim.",
  };
}

function validateActors(registry, records) {
  const keys = Object.keys(systemActor({ actorId: "", migrationTimestamp: "" }));
  const actors = new Map();
  for (const actor of registry.actors) {
    if (!object(actor) || keys.some((key) => !Object.hasOwn(actor, key)) || Object.keys(actor).some((key) => !keys.includes(key))) fail("actors.json contains an Actor with missing or unknown fields");
    for (const key of ["id", "createdBy"]) if (!ULID_PATTERN.test(actor[key] || "")) fail(`Actor ${actor.id}: invalid ${key}`);
    if (actors.has(actor.id)) fail(`actors.json contains duplicate actor ${actor.id}`);
    if (actor.type !== "Actor" || actor.schemaVersion !== "1.0" || !Number.isSafeInteger(actor.revision) || actor.revision < 1) fail(`Actor ${actor.id}: invalid type, schemaVersion, or revision`);
    if (typeof actor.name !== "string" || !actor.name.length || typeof actor.body !== "string") fail(`Actor ${actor.id}: name and body must be strings`);
    if (!["human", "agent", "pipeline", "system"].includes(actor.kind)) fail(`Actor ${actor.id}: invalid kind`);
    if (!Array.isArray(actor.roles) || new Set(actor.roles).size !== actor.roles.length || !actor.roles.every((role) => ["contributor", "reviewer", "editor", "moderator"].includes(role))) fail(`Actor ${actor.id}: invalid roles`);
    if (typeof actor.createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(actor.createdAt) || !Number.isFinite(Date.parse(actor.createdAt))) fail(`Actor ${actor.id}: invalid createdAt`);
    for (const key of ["externalIdentity", "modelFamily", "modelVersion", "harness"]) if (actor[key] !== null && typeof actor[key] !== "string") fail(`Actor ${actor.id}: ${key} must be a string or null`);
    if (actor.operatorId !== null && !ULID_PATTERN.test(actor.operatorId || "")) fail(`Actor ${actor.id}: invalid operatorId`);
    actors.set(actor.id, actor);
  }
  for (const actor of actors.values()) {
    if (!actors.has(actor.createdBy)) fail(`Actor ${actor.id}: createdBy actor does not exist`);
    if (actor.operatorId !== null && actors.get(actor.operatorId)?.kind !== "human") fail(`Actor ${actor.id}: operatorId must name a human actor`);
    if (["agent", "pipeline"].includes(actor.kind) && actor.operatorId === null) fail(`Actor ${actor.id}: ${actor.kind} requires a human operator`);
  }
  for (const record of records) if (!actors.has(record.metadata.createdBy)) fail(`${record.id}: metadata.createdBy actor does not exist`);
}

function migrateRecord(record, mapping, manifest, file) {
  if (!ID_PATTERN.test(record.id || "")) fail(`${file}: invalid stable op ID`);
  if (record.schema === RECORD_SCHEMA) {
    // These two values are derived from the authored taxonomy labels. Refresh
    // them during migration so authors never need to maintain duplicate lists.
    const refreshed = {
      ...record,
      metadata: {
        ...record.metadata,
        areaIds: record.fields.map(metadataSlug),
        topicIds: record.topics.map(metadataSlug),
      },
    };
    validateRecordMetadata(refreshed, file);
    if (mapping && record.ulid !== mapping.ulid) fail(`${file}: refusing identity remap from ${record.ulid} to ${mapping.ulid}`);
    if (mapping && !mapping.mainAliases.every((alias) => record.aliases.includes(alias))) fail(`${file}: existing record is missing a preserved main alias`);
    return refreshed;
  }
  if (record.schema !== "qiqcop-zoo/record/2") fail(`${file}: expected record schema 2 or 3`);
  if (["ulid", "aliases", "metadata"].some((key) => key in record)) fail(`${file}: refusing to overwrite metadata on a schema 2 record`);
  if (!mapping) fail(`${file}: missing migration mapping`);
  const envelope = createRecordMetadata(record, {
    ulid: mapping.ulid,
    aliases: unique([...mapping.mainAliases, metadataSlug(record.id)]),
    revision: mapping.mainRevision === null ? 1 : mapping.mainRevision + 1,
    createdBy: manifest.actorId, createdAt: manifest.migrationTimestamp,
  });
  const { schema, id, ...scientific } = record;
  const migrated = { schema: RECORD_SCHEMA, id, ...envelope, ...scientific };
  validateRecordMetadata(migrated, file);
  for (const [key, value] of Object.entries(record)) {
    if (key !== "schema" && JSON.stringify(value) !== JSON.stringify(migrated[key])) fail(`${file}: migration changed existing field ${key}`);
  }
  return migrated;
}

function run(config) {
  const database = path.join(config.root, "database");
  const manifestPath = path.join(database, "metadata.json");
  const actorsPath = path.join(database, "actors.json");
  const manifestExists = fs.existsSync(manifestPath);
  let manifest = manifestExists ? validateManifest(readJson(manifestPath)) : null;
  if (!manifest && !config.mainRef) fail("metadata.json is missing; initialize the mapping with an explicit --main-ref REF");
  const main = config.mainRef ? mainIdentities(config.root, config.mainRef) : null;
  manifest ??= {
    schema: MANIFEST_SCHEMA, migrationTimestamp: MIGRATION_TIMESTAMP,
    actorId: deterministicUlid("actor:metadata-system", MIGRATION_TIMESTAMP),
    mainRef: main.commit, mappings: {},
  };
  if (main) manifest.mainRef = main.commit;
  const staged = new Map();
  const records = [];
  const problems = path.join(database, "problems_json");
  for (const name of fs.readdirSync(problems).filter((file) => file.endsWith(".json")).sort()) {
    const file = path.join(problems, name);
    const record = readJson(file);
    if (name !== `${record.id}.json`) fail(`${name}: filename does not match the stable op ID`);
    let mapping = manifest.mappings[record.id];
    if (main || (!mapping && record.schema !== RECORD_SCHEMA)) {
      const next = mappingFor(record, main, manifest.migrationTimestamp);
      // A later main snapshot can omit an old source without erasing its provenance.
      if (!mapping || next.mainId !== null) {
        if (mapping && mapping.ulid !== next.ulid) fail(`${name}: refusing persisted identity remap from ${mapping.ulid} to ${next.ulid}`);
        mapping = manifest.mappings[record.id] = next;
      }
    }
    const migrated = migrateRecord(record, mapping, manifest, name);
    validateRecordShape(migrated, name);
    records.push(migrated);
    staged.set(file, json(migrated));
  }
  validateRecordIdentities(records);
  validateManifest(manifest);
  const actors = fs.existsSync(actorsPath) ? readJson(actorsPath) : { schema: ACTORS_SCHEMA, actors: [] };
  if (!object(actors) || actors.schema !== ACTORS_SCHEMA || !Array.isArray(actors.actors)) fail(`actors.json must use ${ACTORS_SCHEMA} with an actors array`);
  const actorIds = actors.actors.map((actor) => actor?.id);
  if (new Set(actorIds).size !== actorIds.length || !actorIds.every((id) => ULID_PATTERN.test(id || ""))) fail("actors.json contains duplicate or invalid actor IDs");
  const expectedActor = systemActor(manifest);
  const previousActor = actors.actors.find((actor) => actor.id === manifest.actorId);
  if (previousActor && json(previousActor) !== json(expectedActor)) fail("refusing to overwrite the metadata migration actor");
  if (!previousActor) actors.actors.push(expectedActor);
  validateActors(actors, records);
  const templatePath = path.join(database, "_template.json");
  if (fs.existsSync(templatePath)) {
    const template = readJson(templatePath);
    const mapping = template.schema === RECORD_SCHEMA ? null : mappingFor(template, null, manifest.migrationTimestamp);
    const migratedTemplate = migrateRecord(template, mapping, manifest, "_template.json");
    validateRecordShape(migratedTemplate, "_template.json");
    staged.set(templatePath, json(migratedTemplate));
  }
  staged.set(manifestPath, json(manifest));
  staged.set(actorsPath, json(actors));
  const pending = [...staged].filter(([file, content]) => !fs.existsSync(file) || fs.readFileSync(file, "utf8") !== content);
  const matched = records.filter((record) => manifest.mappings[record.id]?.mainId).length;
  if (config.check) {
    if (pending.length) {
      console.error(`Metadata migration pending: ${pending.length} file(s). Run node scripts/migrate-metadata.mjs${config.root === path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..") ? "" : " --root DIR"}.`);
      process.exitCode = 1;
    } else console.log(`Metadata check passed: ${records.length} records; ${matched} main identities preserved.`);
    return;
  }
  // All parsing, identity comparisons, actor checks, and scientific preservation
  // checks finish before any destination is written. Each replacement is atomic.
  for (const [file, content] of pending) {
    const temporary = `${file}.metadata-${process.pid}.tmp`;
    try {
      fs.writeFileSync(temporary, content, { flag: "wx" });
      fs.renameSync(temporary, file);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
  }
  console.log(`Metadata migration: ${records.length} records; ${matched} main identities preserved; ${pending.length} file(s) updated.`);
}

try {
  const config = options(process.argv.slice(2));
  if (config) run(config);
} catch (error) {
  console.error(`Metadata migration failed: ${error.message}`);
  process.exitCode = 1;
}
