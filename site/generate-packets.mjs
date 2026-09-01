import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(siteDirectory, "data");
const packetsDirectory = path.join(siteDirectory, "packets");
const sandbox = { window: {} };

for (const filename of ["problems.js", "formal-statements.js", "problem-sources.js", "catalog-index.js"]) {
  const filePath = path.join(dataDirectory, filename);
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
}

const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const formalStatements = sandbox.window.QUANTUM_FORMAL_STATEMENTS;
const problemSources = sandbox.window.QUANTUM_PROBLEM_SOURCES;
const compactById = new Map(sandbox.window.QUANTUM_CATALOG_INDEX.problems.map((problem) => [problem.id, problem]));
const areaById = new Map(catalog.taxonomy.areas.map((area) => [area.id, area]));
const topicById = new Map(catalog.taxonomy.topics.map((topic) => [topic.id, topic]));
const collectionById = new Map(catalog.collections.map((collection) => [collection.id, collection]));
const statusLabel = (status) => status === "partial" ? "Partially solved" : "Open";
const catalogUrl = (id) => `${String(catalog.meta.siteUrl).replace(/\/$/, "")}/problems/${id}/`;
const contributionUrl = (problem) => {
  const url = new URL(`${String(catalog.meta.repositoryUrl).replace(/\/$/, "")}/issues/new`);
  url.searchParams.set("template", "research-update.yml");
  url.searchParams.set("title", `[Research update] ${problem.title}`);
  return url.href;
};

const buildPacket = (problem) => {
  const topic = topicById.get(problem.topic);
  const formal = formalStatements[problem.id] || { notation: "", statement: "" };
  const problemSource = problemSources[problem.id];
  const compact = compactById.get(problem.id);
  const orderedProgress = (problem.progress || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const lines = [
    `# AI research brief: ${problem.title}`,
    "",
    `- Record ID: ${problem.id}`,
    `- Record revision (SHA-256): ${compact.recordDigest}`,
    `- Formal statement digest (SHA-256): ${compact.statementDigest}`,
    `- Status: ${statusLabel(problem.status)}`,
    `- Field: ${areaById.get(topic?.area)?.label || topic?.area || "Unclassified"}`,
    `- Topic: ${topic?.label || problem.topic}`,
    `- Collection: ${collectionById.get(problem.collection)?.label || problem.collection}`,
    `- Verified: ${problem.verified || catalog.meta.audited}`,
    `- Catalog entry: ${catalogUrl(problem.id)}`,
    `- JSON record: ${String(catalog.meta.siteUrl).replace(/\/$/, "")}/api/v1/problems/${problem.id}.json`,
    `- Propose an update: ${contributionUrl(problem)}`,
    "",
    "## Problem source",
    "",
    `- Relationship: ${problemSource.relationship}`,
    `- Title: ${problemSource.title}`,
    `- Authors: ${problemSource.authors.join(", ")}`,
    `- Venue: ${problemSource.venue}`,
    `- Statement locator: ${problemSource.locator}`,
    `- Read source: ${problemSource.url}`,
    "",
    "## Why it matters",
    "",
    problem.importance,
    ""
  ];

  if (formal.notation) lines.push("## Notation", "", formal.notation, "");
  lines.push(
    "## Formal statement",
    "",
    formal.statement,
    "",
    "## Exact unresolved remainder",
    "",
    problem.remaining,
    "",
    "## Checked progress",
    ""
  );

  for (const item of orderedProgress) {
    lines.push(
      `### ${item.date}: ${item.title}`,
      "",
      `- Evidence: ${item.maturity}; ${item.strength}`,
      `- Finding: ${item.detail}`,
      ...(item.url ? [`- Source: ${item.url}`] : []),
      ""
    );
  }

  const cautions = [
    ...(problem.watch || []).map((item) => `${item.label}: ${item.text}${item.url ? ` (${item.url})` : ""}`),
    ...(problem.interpretation ? [`Interpretation: ${problem.interpretation}`] : []),
    ...(problem.origin?.note ? [`Provenance: ${problem.origin.note}`] : [])
  ];
  if (cautions.length) lines.push("## Scope and cautions", "", ...cautions.map((item) => `- ${item}`), "");

  lines.push(
    "## Research protocol",
    "",
    "1. Restate the target and its hypotheses before starting the analysis.",
    "2. Match each claimed result against the statement's quantifiers and domain.",
    "3. Label proofs, computations, numerical evidence, and conjectural steps separately.",
    "4. Cite primary sources with theorem, page, equation, or version locators when available.",
    "5. Record failed routes when they rule out a reusable approach.",
    "",
    "## Requested output",
    "",
    "Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.",
    ""
  );
  return lines.join("\n");
};

const packets = Object.fromEntries(catalog.problems.map((problem) => [problem.id, buildPacket(problem)]));
fs.mkdirSync(packetsDirectory, { recursive: true });
for (const filename of fs.readdirSync(packetsDirectory)) {
  if (filename.endsWith(".md") && !(path.basename(filename, ".md") in packets)) {
    fs.rmSync(path.join(packetsDirectory, filename));
  }
}
for (const [id, packet] of Object.entries(packets)) {
  fs.writeFileSync(path.join(packetsDirectory, `${id}.md`), packet);
}

console.log(`Generated ${Object.keys(packets).length} AI research packets.`);
