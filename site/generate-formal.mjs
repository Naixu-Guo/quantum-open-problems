import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const catalogPath = path.join(siteDirectory, "data", "problems.js");
const outputPath = path.join(siteDirectory, "data", "formal-statements.js");

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(catalogPath, "utf8"), sandbox, { filename: catalogPath });

const extractSection = (markdown, heading) => {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const body = markdown.slice(start + marker.length);
  const end = body.search(/^## /m);
  return (end < 0 ? body : body.slice(0, end)).trim();
};

const statements = Object.fromEntries(
  sandbox.window.QUANTUM_OPEN_PROBLEMS.problems.map((problem) => {
    const articlePath = path.join(repositoryRoot, "open_prob", problem.id, "problem.md");
    if (!fs.existsSync(articlePath)) throw new Error(`Missing source article: ${problem.id}`);
    const markdown = fs.readFileSync(articlePath, "utf8");
    const statement = extractSection(markdown, "Formal statement");
    const notation = extractSection(markdown, "Notation");
    if (!statement) throw new Error(`Missing Formal statement section: ${problem.id}`);
    return [problem.id, { notation, statement }];
  })
);

const generated = [
  '"use strict";',
  "",
  "// Generated from the Notation and Formal statement sections in open_prob/<id>/problem.md.",
  `window.QUANTUM_FORMAL_STATEMENTS = ${JSON.stringify(statements, null, 2)};`,
  ""
].join("\n");

fs.writeFileSync(outputPath, generated);
console.log(`Generated ${Object.keys(statements).length} source-based formal statements.`);
