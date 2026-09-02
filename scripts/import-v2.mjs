#!/usr/bin/env node
// Import one problem from the mirrored open_problem_v2 list as a canonical
// candidate bundle. The importer copies the statement verbatim and records
// the source digest; editorial fields must be supplied explicitly.
//
//   node scripts/import-v2.mjs <n> --topic <topic-id> --summary "..." --importance "..." [--type "..."] [--unresolved "..."]

import fs from "node:fs";
import path from "node:path";
import { catalogDirectory, loadCatalog, readJson, repositoryRoot, writeJson } from "../core/catalog.mjs";
import { sha256 } from "../core/domain.mjs";

const args = process.argv.slice(2);
const number = Number(args[0]);
const flag = (name) => { const index = args.indexOf(`--${name}`); return index >= 0 ? args[index + 1] : null; };
const fail = (message) => { console.error(message); process.exit(1); };
if (!Number.isInteger(number) || number < 1) fail("usage: node scripts/import-v2.mjs <n> --topic <id> --summary ... --importance ...");
const topicId = flag("topic") || fail("--topic is required");
const summary = flag("summary") || fail("--summary is required");
const importance = flag("importance") || fail("--importance is required");
const type = flag("type") || "Open question";

const catalog = loadCatalog();
if (!catalog.topicById.has(topicId)) fail(`unknown topic ${topicId}`);
const sourceJsonPath = path.join("open_problem_v2", "problem_pool_json", `problem_${number}.json`);
const absoluteJsonPath = path.join(repositoryRoot, sourceJsonPath);
if (!fs.existsSync(absoluteJsonPath)) fail(`${sourceJsonPath} does not exist`);
const imported = readJson(absoluteJsonPath);
const texPath = path.resolve(path.dirname(absoluteJsonPath), imported.source.file);
if (sha256(fs.readFileSync(texPath, "utf8")) !== imported.source.sha256 || sha256(imported.source_tex) !== imported.source.sha256) fail("source TeX digest mismatch");

const id = `v2-${String(imported.id).replaceAll("_", "-")}`;
const directory = path.join(catalogDirectory, "problems", id);
if (fs.existsSync(directory)) fail(`${id} already exists`);
for (const bundle of catalog.bundles) {
  if (bundle.record.problem.aliases.includes(imported.id)) fail(`${imported.id} is already an alias of ${bundle.record.problem.id}`);
}
const status = String(imported.status).toLowerCase() === "unsolved" ? "open" : String(imported.status).toLowerCase() === "partially solved" ? "partial" : String(imported.status).toLowerCase();
if (!["open", "partial", "solved"].includes(status)) fail(`unsupported source status ${imported.status}`);
const today = new Date().toISOString().slice(0, 10);
const sourceId = `source-open-problem-v2-problem-${number}`;
const statementId = `${id}-statement-v1`;
const record = {
  schemaVersion: "0.2.0",
  kind: "qop-canonical-record",
  problem: {
    kind: "Problem",
    id,
    accession: null,
    aliases: [imported.id, `open-problem-v2-problem-${number}`],
    catalogState: "candidate",
    title: imported.title,
    proposed: null,
    topicId,
    collectionId: "open-problem-v2",
    question: { type, summary, importance, unresolved: flag("unresolved") || (status === "solved" ? "" : summary) },
    keywords: imported.tags,
    relatedProblemIds: []
  },
  statements: [{
    kind: "StatementVersion",
    id: statementId,
    problemId: id,
    version: 1,
    supersedesStatementId: null,
    created: today,
    bodyPath: "statements/v1.md",
    sourceRefs: [{ sourceId, relationship: "source-record", locator: `problem_pool/problem_${number}.tex`, primary: true }],
    targetClauses: [{
      id: "imported-statement",
      label: "Imported statement",
      text: "The problem statement as imported from the source list.",
      resolutionCriteria: flag("unresolved") || "Settle the imported statement as posed, or replace this clause set through a reviewed statement version."
    }]
  }],
  claims: [],
  evidence: [],
  decisions: [{
    kind: "Decision",
    id: `decision-${id}-import-${today}`,
    problemId: id,
    statementId,
    decisionType: "status-assessment",
    outcome: "accepted",
    supersedesDecisionId: null,
    status,
    effectiveDate: today,
    verified: today,
    evidenceIds: [],
    rationale: `The source record is marked ${imported.status}; this import validates representation and does not publish the record.`
  }],
  editorial: {
    cautions: [],
    interpretation: "Imported candidate; not yet reviewed for the public catalog.",
    provenance: { kind: "source-stated", label: "Imported source record", note: `Imported from open_problem_v2 problem ${number} with the source digest recorded.` },
    notices: [],
    notesPath: null
  },
  sourceImport: { format: "open-problem-v2-json-1.1", sourceJsonPath, sourceId: imported.id, sourceSha256: imported.source.sha256, statementId }
};
if (status === "solved") fail("solved source records need a resolution claim; import manually");
fs.mkdirSync(path.join(directory, "statements"), { recursive: true });
fs.writeFileSync(path.join(directory, "statements", "v1.md"), `## Formal statement\n\n${imported.sections.problem_statement.latex}\n`);
writeJson(path.join(directory, "record.json"), record);
const sourcePath = path.join(catalogDirectory, "sources", `${sourceId}.json`);
if (!fs.existsSync(sourcePath)) {
  writeJson(sourcePath, { kind: "Source", id: sourceId, title: `Open problem v2: ${imported.title}`, authors: [], venue: "Repository problem pool", url: null });
}
console.log(`Imported ${id} as a candidate. Run node core/validate.mjs, then review before publishing.`);
