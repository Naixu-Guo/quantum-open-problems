#!/usr/bin/env node
// Import problem TeX files into the database.
//
// Usage:
//   node scripts/import-problems.mjs <file-or-directory> [...more]
//
// Every problem_*.tex file found in a directory, and every file named
// explicitly, is parsed and validated like the build does, then stored twice:
// as the JSON record database/problems_json/<op_id>.json, which the site is
// built from, and as the TeX file database/problems_tex/<op_id>.tex, copied
// verbatim. <op_id> is the stable ID declared in the file's final "ID"
// subsection. Existing records with the same ID are replaced, so the command
// is safe to rerun after editing a source file. A file that fails validation
// (for example with a status other than Unsolved or Solved) is skipped with
// the reason, and the command exits with status 1.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseProblem, TexError } from "../site/lib/tex.mjs";
import { recordToJson, validateRecordShape, RecordError } from "../site/lib/record.mjs";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const config = JSON.parse(fs.readFileSync(path.join(repoRoot, "site", "config.json"), "utf8"));
const jsonDir = path.join(repoRoot, config.databasePath);
const texDir = path.join(repoRoot, config.texPath);
const canonicalTags = new Set(JSON.parse(fs.readFileSync(path.join(repoRoot, "database", "tags.json"), "utf8")).tags);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/import-problems.mjs <file-or-directory> [...more]");
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

fs.mkdirSync(jsonDir, { recursive: true });
fs.mkdirSync(texDir, { recursive: true });
let imported = 0;
let skipped = 0;
for (const file of args.flatMap(collect)) {
  const source = fs.readFileSync(file, "utf8").replace(/\r\n?/g, "\n");
  const tex = source.endsWith("\n") ? source : `${source}\n`;
  let record;
  try {
    record = validateRecordShape(parseProblem(tex, { canonicalTags, fileName: path.basename(file) }).record, path.basename(file));
  } catch (error) {
    const reason = error instanceof TexError || error instanceof RecordError ? error.message : error.stack;
    console.error(`skip ${path.relative(repoRoot, file)}: ${reason}`);
    skipped += 1;
    continue;
  }
  const jsonTarget = path.join(jsonDir, `${record.id}.json`);
  const texTarget = path.join(texDir, `${record.id}.tex`);
  const existed = fs.existsSync(jsonTarget);
  fs.writeFileSync(jsonTarget, recordToJson(record));
  fs.writeFileSync(texTarget, tex);
  imported += 1;
  console.log(`${existed ? "updated" : "added  "} ${path.relative(repoRoot, jsonTarget)} (+ ${path.basename(texTarget)})  <- ${path.relative(repoRoot, file)}`);
}
console.log(`${imported} problem file(s) imported${skipped ? `, ${skipped} skipped` : ""}.`);
if (skipped) process.exit(1);
