#!/usr/bin/env node
// Import problem TeX files into the database.
//
// Usage:
//   node scripts/import-problems.mjs [--replace] <file-or-directory> [...more]
//
// Every problem_*.tex file found in a directory, and every file named
// explicitly, is parsed and validated like the build does, then stored twice:
// as the JSON record database/problems_json/<op_id>.json, which the site is
// built from, and as the TeX file database/problems_tex/<op_id>.tex, copied
// verbatim. <op_id> is the stable ID declared in the file's final "ID"
// subsection. A file may classify its problem with Field and Topic
// subsections, or with the older single Tag subsection, whose names are
// sorted into fields and topics by database/tags.json. Existing content is
// protected unless --replace is explicitly supplied. Identity and metadata
// survive replacement. All inputs are validated before any file is written.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseProblem, TexError } from "../site/lib/tex.mjs";
import { recordToJson, recordDifferences, validateRecordShape, RecordError, RECORD_SCHEMA } from "../site/lib/record.mjs";
import { loadTaxonomy } from "../site/lib/taxonomy.mjs";
import { createRecordMetadata, validateRecordIdentities, metadataSlug } from "../site/lib/metadata.mjs";

const args = process.argv.slice(2);
const rootIndex = args.indexOf("--root");
if (rootIndex >= 0 && (!args[rootIndex + 1] || args[rootIndex + 1].startsWith("--"))) throw new Error("--root needs a directory");
const repoRoot = rootIndex < 0 ? path.dirname(path.dirname(fileURLToPath(import.meta.url))) : path.resolve(args.splice(rootIndex, 2)[1]);
const replace = args.includes("--replace");
const inputs = args.filter((arg) => arg !== "--replace");
if (inputs.some((arg) => arg.startsWith("--"))) throw new Error("Unknown import option");
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "site", "config.json"), "utf8"));
const jsonDir = path.join(repoRoot, config.databasePath);
const texDir = path.join(repoRoot, config.texPath);
const taxonomy = loadTaxonomy(path.join(repoRoot, "database", "tags.json"));

if (inputs.length === 0) {
  console.error("Usage: node scripts/import-problems.mjs [--replace] <file-or-directory> [...more]");
  process.exit(1);
}

const collect = (entry) => {
  const stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    return fs.readdirSync(entry)
      .filter((name) => /^problem_.*\.tex$/.test(name))
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .map((name) => path.join(entry, name));
  }
  return [entry];
};

const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "database", "metadata.json"), "utf8"));
const existing = new Map(fs.readdirSync(jsonDir).filter((name) => name.endsWith(".json")).map((name) => {
  const record = validateRecordShape(JSON.parse(fs.readFileSync(path.join(jsonDir, name), "utf8")), name);
  return [record.id, record];
}));
const planned = new Map(existing);
const updates = [];
const errors = [];
const seen = new Set();
let unchanged = 0;
for (const file of inputs.flatMap(collect)) {
  try {
    const source = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
    const tex = source.endsWith("\n") ? source : `${source}\n`;
    const content = parseProblem(tex, { taxonomy, fileName: path.basename(file) }).record;
    if (seen.has(content.id)) throw new RecordError(`duplicate input ID ${content.id}`);
    seen.add(content.id);
    const previous = existing.get(content.id);
    if (previous) {
      const differences = recordDifferences(previous, content);
      if (differences.length === 0) { unchanged += 1; continue; }
      if (!replace) throw new RecordError(`${content.id} already exists and differs in ${differences.join(", ")}; edit the JSON or use --replace for an intentional content update`);
    }
    const identity = previous ? {
      ulid: previous.ulid,
      aliases: previous.aliases,
      metadata: { ...previous.metadata, areaIds: content.fields.map(metadataSlug), topicIds: content.topics.map(metadataSlug) }
    } : createRecordMetadata(content, { createdAt: new Date().toISOString(), createdBy: manifest.actorId });
    const record = validateRecordShape({ schema: RECORD_SCHEMA, ...content, ...identity }, path.basename(file));
    const pinned = manifest.mappings[record.id];
    if (pinned && pinned.ulid !== record.ulid) throw new RecordError(`${record.id}: ULID disagrees with database/metadata.json`);
    planned.set(record.id, record);
    updates.push({ record, tex, file, existed: Boolean(previous) });
  } catch (error) {
    const reason = error instanceof TexError || error instanceof RecordError ? error.message : error.stack;
    errors.push(`${path.relative(repoRoot, file)}: ${reason}`);
  }
}
try { validateRecordIdentities([...planned.values()]); } catch (error) { errors.push(error.message); }
if (errors.length) {
  console.error(`Import aborted; no files written:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
fs.mkdirSync(jsonDir, { recursive: true });
fs.mkdirSync(texDir, { recursive: true });
for (const { record, tex, file, existed } of updates) {
  const jsonTarget = path.join(jsonDir, `${record.id}.json`);
  const texTarget = path.join(texDir, `${record.id}.tex`);
  fs.writeFileSync(jsonTarget, recordToJson(record));
  fs.writeFileSync(texTarget, tex);
  console.log(`${existed ? "updated" : "added  "} ${path.relative(repoRoot, jsonTarget)} (+ ${path.basename(texTarget)})  <- ${path.relative(repoRoot, file)}`);
}
console.log(`${updates.length} problem file(s) imported, ${unchanged} unchanged.`);
