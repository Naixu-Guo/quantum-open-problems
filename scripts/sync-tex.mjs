#!/usr/bin/env node
// Keep database/problems_tex in step with database/problems_json.
//
// Usage:
//   node scripts/sync-tex.mjs              # every record
//   node scripts/sync-tex.mjs <id> [...]   # only the named records
//   node scripts/sync-tex.mjs --check      # report differences, write nothing, exit 1 if any
//
// For each JSON record the TeX file database/problems_tex/<id>.tex is
// compared with the record's content. A TeX file that already agrees is left
// untouched, so imported TeX sources keep their original formatting (including
// a legacy single Tag subsection whose names sort into the record's fields and
// topics); a missing or outdated one is rewritten in the layout of
// database/_template.tex. Without explicit IDs, TeX files that have no JSON
// record are deleted.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseTexRecord, TexError } from "../site/lib/tex.mjs";
import { recordToTex, recordDifferences, validateRecordShape, RecordError } from "../site/lib/record.mjs";
import { loadTaxonomy } from "../site/lib/taxonomy.mjs";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "site", "config.json"), "utf8"));
const jsonDir = path.join(repoRoot, config.databasePath);
const texDir = path.join(repoRoot, config.texPath);
const taxonomy = loadTaxonomy(path.join(repoRoot, "database", "tags.json"));

const args = process.argv.slice(2);
const check = args.includes("--check");
const ids = args.filter((arg) => !arg.startsWith("--"));

fs.mkdirSync(texDir, { recursive: true });
const names = ids.length ? ids.map((id) => `${id}.json`) : fs.readdirSync(jsonDir).filter((name) => name.endsWith(".json")).sort();
let written = 0;
let outdated = 0;
let failed = 0;

for (const name of names) {
  const jsonPath = path.join(jsonDir, name);
  let record;
  try {
    if (!fs.existsSync(jsonPath)) throw new RecordError(`${name}: no such record in ${config.databasePath}`);
    record = validateRecordShape(JSON.parse(fs.readFileSync(jsonPath, "utf8")), name);
    if (`${record.id}.json` !== name) throw new RecordError(`${name}: file name does not match the record ID ${record.id}`);
  } catch (error) {
    console.error(error instanceof RecordError ? error.message : `${name}: ${error.message}`);
    failed += 1;
    continue;
  }
  const texPath = path.join(texDir, `${record.id}.tex`);
  let reason = "";
  if (!fs.existsSync(texPath)) {
    reason = "missing";
  } else {
    try {
      const fromTex = parseTexRecord(fs.readFileSync(texPath, "utf8"), { fileName: `${record.id}.tex`, taxonomy });
      const differences = recordDifferences(record, fromTex);
      if (differences.length) reason = `differs in ${differences.join(", ")}`;
    } catch (error) {
      reason = error instanceof TexError ? "cannot be parsed" : error.message;
    }
  }
  if (!reason) continue;
  outdated += 1;
  if (check) {
    console.log(`outdated ${path.relative(repoRoot, texPath)}: ${reason}`);
    continue;
  }
  fs.writeFileSync(texPath, recordToTex(record, { jsonPath: config.databasePath }));
  written += 1;
  console.log(`wrote ${path.relative(repoRoot, texPath)} (${reason})`);
}

if (ids.length === 0) {
  const known = new Set(names.map((name) => name.replace(/\.json$/, ".tex")));
  for (const stray of fs.readdirSync(texDir).filter((name) => name.endsWith(".tex") && !known.has(name))) {
    outdated += 1;
    if (check) {
      console.log(`stray ${config.texPath}/${stray}: no JSON record`);
      continue;
    }
    fs.rmSync(path.join(texDir, stray));
    console.log(`deleted ${config.texPath}/${stray}: no JSON record`);
  }
}

if (check) {
  console.log(outdated ? `${outdated} TeX file(s) out of date.` : "All TeX files agree with their JSON records.");
} else {
  console.log(`${written} TeX file(s) written; ${names.length - failed - written} already in step.`);
}
if (failed || (check && outdated)) process.exit(1);
