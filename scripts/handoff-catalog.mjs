#!/usr/bin/env node
// Apply an explicitly authored catalog record to an admitted service identity.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { validateLedger } from "../contract/src/validate.ts";
import { catalogState } from "../contract/src/derive.ts";
import { recordObject } from "../contract/src/record.ts";
import { createRecordMetadata, metadataSlug, validateRecordIdentities } from "../site/lib/metadata.mjs";
import { validateRecordShape, recordToTex } from "../site/lib/record.mjs";
import { renderRecord } from "../site/lib/tex.mjs";
import { loadTaxonomy } from "../site/lib/taxonomy.mjs";
import { exportLedger } from "./export-ledger.mjs";
const ROOT = path.resolve(import.meta.dirname, "..");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const json = (data) => JSON.stringify(data, null, 2) + "\n";

export async function handoffCatalog({ root = ROOT, problemId, recordFile } = {}) {
  if (!problemId || !recordFile) throw new Error("Both --problem ULID and --record authored.json are required.");
  const report = validateLedger([path.join(root, "ledger"), path.join(root, "activity")]);
  if (report.issues.length) throw new Error("Repair ledger validation errors before a catalog handoff.");
  const problem = report.ledger.find("Problem", problemId);
  if (!problem || catalogState(report.ledger, problemId) !== "published") throw new Error("Catalog handoff requires an admitted, published service problem.");
  const input = read(recordFile);
  const all = fs.readdirSync(path.join(root, "database/problems_json")).filter((name) => name.endsWith(".json")).map((name) => read(path.join(root, "database/problems_json", name)));
  const prior = all.find((record) => record.ulid === problemId);
  if (prior && prior.id !== input.id) throw new Error("Preserve the existing catalog op ID during handoff.");
  if (all.some((record) => record.id === input.id && record.ulid !== problemId)) throw new Error("The requested op ID belongs to another problem.");
  const { metadata: ignoredMetadata, ulid: ignoredUlid, aliases: ignoredAliases, ...authored } = input;
  const options = { ...problem.fields, ...(prior?.metadata ?? {}), ulid: problemId, aliases: [...new Set([...(prior?.aliases ?? []), ...(input.aliases ?? []), ...problem.fields.aliases])], areaIds: input.fields.map(metadataSlug), topicIds: input.topics.map(metadataSlug) };
  // A scaffold's unused ULID is not an alias for the admitted service problem.
  options.aliases = options.aliases.filter((alias) => alias !== input.ulid || alias === problemId);
  const record = { ...authored, ...createRecordMetadata(authored, options) };
  validateRecordShape(record);
  validateRecordIdentities([...all.filter((item) => item.id !== record.id), record]);
  renderRecord(record, { taxonomy: loadTaxonomy(path.join(root, "database/tags.json")) });
  const registry = read(path.join(root, "database/actors.json"));
  const addActor = (id) => {
    if (registry.actors.some((actor) => actor.id === id)) return;
    const actor = report.ledger.find("Actor", id);
    if (!actor) throw new Error(`Missing actor ${id}`);
    registry.actors.push(recordObject(actor));
    addActor(actor.fields.createdBy);
    if (actor.fields.operatorId) addActor(actor.fields.operatorId);
  };
  addActor(record.metadata.createdBy);
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), "qop-handoff-"));
  try {
    for (const dir of ["database", "ledger", "activity"]) fs.cpSync(path.join(root, dir), path.join(stage, dir), { recursive: true });
    fs.writeFileSync(path.join(stage, "database/problems_json", `${record.id}.json`), json(record));
    fs.mkdirSync(path.join(stage, "database/problems_tex"), { recursive: true });
    fs.writeFileSync(path.join(stage, "database/problems_tex", `${record.id}.tex`), recordToTex(record));
    fs.writeFileSync(path.join(stage, "database/actors.json"), json(registry));
    execFileSync(process.execPath, [path.join(ROOT, "scripts/migrate-metadata.mjs"), "--root", stage], { stdio: "pipe" });
    await exportLedger({ root: stage, reconcileCatalog: true });
    const writes = [];
    function collect(directory, prefix = "") {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const file = path.posix.join(prefix, entry.name);
        if (entry.isDirectory()) collect(path.join(directory, entry.name), file);
        else {
          const contents = fs.readFileSync(path.join(stage, file));
          const destination = path.join(root, file);
          const before = fs.existsSync(destination) ? fs.readFileSync(destination) : null;
          if (before === null || !before.equals(contents)) writes.push({ destination, before, contents });
        }
      }
    }
    collect(stage);
    const applied = [];
    try {
      for (const item of writes) {
        const { destination, contents, before } = item;
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, contents, { flag: before === null ? "wx" : "w" });
        applied.push(item);
      }
    } catch (error) {
      for (const { destination, before } of applied.reverse()) {
        if (before === null) fs.rmSync(destination, { force: true });
        else fs.writeFileSync(destination, before);
      }
      throw error;
    }
    return { id: record.id, ulid: record.ulid, changed: writes.length };
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      const key = { "--root": "root", "--problem": "problemId", "--record": "recordFile" }[args[i]];
      if (!key || !args[i + 1]) throw new Error("Usage: handoff-catalog.mjs --problem ULID --record authored.json [--root DIR]");
      options[key] = args[i + 1];
    }
    console.log(JSON.stringify(await handoffCatalog(options)));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
