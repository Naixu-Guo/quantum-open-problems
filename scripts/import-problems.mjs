#!/usr/bin/env node
// Import problem TeX files into the site's own database.
//
// Usage:
//   node scripts/import-problems.mjs <file-or-directory> [...more]
//
// Every problem_*.tex file found is copied verbatim to
// database/problems/<op_id>.tex, where <op_id> is the stable ID declared in
// the file's final "ID" subsection. Existing records with the same ID are
// replaced, so the command is safe to rerun after editing a source file.
// Recycled or archived files are imported like any other file; the status
// inside the file decides how the site presents it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const targetDir = path.join(repoRoot, "database", "problems");

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

const readId = (tex) => {
  const idSection = tex.split(/\\subsection\*\{ID\}/)[1];
  const match = idSection && idSection.match(/\\texttt\{(op\\_[A-Za-z0-9]{16})\}/);
  return match ? match[1].replace("\\_", "_") : null;
};

fs.mkdirSync(targetDir, { recursive: true });
let imported = 0;
for (const file of args.flatMap(collect)) {
  const tex = fs.readFileSync(file, "utf8");
  const id = readId(tex);
  if (!id) {
    console.error(`skip ${file}: no stable ID found`);
    continue;
  }
  const target = path.join(targetDir, `${id}.tex`);
  const existed = fs.existsSync(target);
  fs.writeFileSync(target, tex.endsWith("\n") ? tex : `${tex}\n`);
  imported += 1;
  console.log(`${existed ? "updated" : "added  "} ${path.relative(repoRoot, target)}  <- ${path.relative(repoRoot, file)}`);
}
console.log(`${imported} problem file(s) imported.`);
