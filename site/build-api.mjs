// Generate the static API v1 read models, research packets, and agent text
// exports from the canonical catalog. Every file written here is derived;
// none is an authoring surface.

import fs from "node:fs";
import path from "node:path";
import { loadCatalog, schemaDirectory, siteDirectory } from "../core/catalog.mjs";
import { sha256, trimSlash } from "../core/domain.mjs";
import { ledgerDigest, projectEventLedger } from "../core/ledger.mjs";
import {
  activeBundles,
  archivedBundles,
  buildCatalogIndex,
  contributionSchema,
  evidenceEvents,
  problemSchema,
  projectApiV1,
  projectClaims,
  projectStatement,
  publicBundles
} from "../core/projection/api-v1.mjs";
import { projectFrontier } from "../core/projection/frontier.mjs";
import { projectResearchPacket } from "../core/projection/packet.mjs";
import { buildSearchIndex } from "../core/projection/search.mjs";

const apiDirectory = path.join(siteDirectory, "api", "v1");
const problemDirectory = path.join(apiDirectory, "problems");
const schemasDirectory = path.join(apiDirectory, "schemas");
const packetsDirectory = path.join(siteDirectory, "packets");
const dataDirectory = path.join(siteDirectory, "data");

const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

const catalog = loadCatalog();
const { registry } = catalog;
const siteUrl = trimSlash(registry.siteUrl);
const repositoryUrl = trimSlash(registry.repositoryUrl);
const bundles = publicBundles(catalog);
const details = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectApiV1(bundle, catalog)]));
const frontiers = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectFrontier(bundle, catalog, { apiRecord: details.get(bundle.record.problem.id) })]));
const packets = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectResearchPacket(bundle, catalog, details.get(bundle.record.problem.id))]));
const catalogIndex = buildCatalogIndex(catalog, details);
const events = evidenceEvents(catalog, details);

// Per-problem resources -----------------------------------------------------
fs.mkdirSync(problemDirectory, { recursive: true });
fs.mkdirSync(packetsDirectory, { recursive: true });
fs.mkdirSync(schemasDirectory, { recursive: true });
const publicIds = new Set(bundles.map((bundle) => bundle.record.problem.id));
for (const entry of fs.readdirSync(problemDirectory, { withFileTypes: true })) {
  const id = entry.isDirectory() ? entry.name : path.basename(entry.name, ".json");
  if (!publicIds.has(id)) fs.rmSync(path.join(problemDirectory, entry.name), { recursive: true, force: true });
}
for (const filename of fs.readdirSync(packetsDirectory)) {
  if (filename.endsWith(".md") && !publicIds.has(path.basename(filename, ".md"))) fs.rmSync(path.join(packetsDirectory, filename));
}
for (const bundle of bundles) {
  const id = bundle.record.problem.id;
  const directory = path.join(problemDirectory, id);
  fs.mkdirSync(path.join(directory, "statements"), { recursive: true });
  writeJson(path.join(problemDirectory, `${id}.json`), details.get(id));
  writeJson(path.join(directory, "frontier.json"), frontiers.get(id));
  writeJson(path.join(directory, "claims.json"), projectClaims(bundle, catalog));
  const statementIds = new Set();
  for (const statement of bundle.record.statements) {
    statementIds.add(`v${statement.version}.json`);
    writeJson(path.join(directory, "statements", `v${statement.version}.json`), projectStatement(bundle, statement, catalog));
  }
  for (const filename of fs.readdirSync(path.join(directory, "statements"))) {
    if (!statementIds.has(filename)) fs.rmSync(path.join(directory, "statements", filename));
  }
  fs.writeFileSync(path.join(packetsDirectory, `${id}.md`), packets.get(id));
}

// Catalog-wide resources ----------------------------------------------------
const activeRecords = activeBundles(catalog).map((bundle) => details.get(bundle.record.problem.id));
const archivedRecords = archivedBundles(catalog).map((bundle) => details.get(bundle.record.problem.id));
const snapshot = `${activeRecords.map((record) => JSON.stringify(record)).join("\n")}\n`;
fs.writeFileSync(path.join(apiDirectory, "problems.jsonl"), snapshot);
fs.writeFileSync(path.join(apiDirectory, "archive.jsonl"), `${archivedRecords.map((record) => JSON.stringify(record)).join("\n")}\n`);
writeJson(path.join(apiDirectory, "index.json"), catalogIndex);
writeJson(path.join(apiDirectory, "search-index.json"), buildSearchIndex(catalogIndex));
writeJson(path.join(apiDirectory, "problem.schema.json"), problemSchema(siteUrl));
writeJson(path.join(apiDirectory, "contribution.schema.json"), contributionSchema(siteUrl));
fs.writeFileSync(path.join(dataDirectory, "catalog-index.js"), [
  '"use strict";',
  "",
  "// Generated compact browser index. Full records live under api/v1/problems/.",
  `window.QUANTUM_CATALOG_INDEX = ${JSON.stringify(catalogIndex, null, 2)};`,
  ""
].join("\n"));

// Published schema contracts (canonical and operational objects).
const PUBLISHED_SCHEMAS = [
  "actor", "candidate-update", "review", "comment", "event", "frontier", "contribution-snapshot",
  "problem", "statement-version", "claim", "evidence", "decision", "source", "provenance", "canonical-record", "registry"
];
for (const filename of fs.readdirSync(schemasDirectory)) fs.rmSync(path.join(schemasDirectory, filename));
for (const name of PUBLISHED_SCHEMAS) {
  const sourcePath = path.join(schemaDirectory, `${name}.schema.json`);
  if (!fs.existsSync(sourcePath)) continue;
  const schema = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  writeJson(path.join(schemasDirectory, `${name}.schema.json`), schema);
}
for (const name of ["candidate-update", "review", "comment", "actor", "event", "frontier"]) {
  const sourcePath = path.join(schemaDirectory, `${name}.schema.json`);
  if (fs.existsSync(sourcePath)) writeJson(path.join(apiDirectory, `${name}.schema.json`), JSON.parse(fs.readFileSync(sourcePath, "utf8")));
}

// Evidence snapshot and sequenced ledger.
writeJson(path.join(apiDirectory, "evidence.json"), {
  kind: "quantum-open-problems-evidence-log",
  generated: registry.catalogAsOf,
  catalogAsOf: registry.catalogAsOf,
  count: events.length,
  note: "Every dated evidence event for active problems, newest first. Event IDs are stable content hashes. Poll release.json first; this file is a snapshot of recorded evidence. The append-only sequenced ledger is events.json.",
  events
});
writeJson(path.join(apiDirectory, "events.json"), projectEventLedger(catalog, siteUrl));

// Release manifest: the cheap poll target.
const lastSequence = catalog.ledger.length ? catalog.ledger[catalog.ledger.length - 1].sequence : 0;
writeJson(path.join(apiDirectory, "release.json"), {
  kind: "quantum-open-problems-release",
  apiVersion: "v1",
  releaseDate: registry.catalogAsOf,
  activeSnapshotDigest: `sha256:${sha256(snapshot)}`,
  digestNote: "SHA-256 of api/v1/problems.jsonl, which contains active records only.",
  catalogRevision: `sha256:${sha256([...details.values()].map((record) => `${record.id}:${record.revision.recordDigest}`).sort().join("\n"))}`,
  ledger: {
    lastSequence,
    digest: `sha256:${ledgerDigest(catalog.ledger)}`,
    url: `${siteUrl}/api/v1/events.json`
  },
  records: {
    total: catalogIndex.meta.records.total,
    active: catalogIndex.meta.records.active,
    resolved: catalogIndex.meta.records.resolved,
    open: catalogIndex.meta.counts.open,
    partial: catalogIndex.meta.counts.partial
  },
  evidenceEvents: events.length,
  service: registry.serviceUrl ? {
    url: trimSlash(registry.serviceUrl),
    status: `${trimSlash(registry.serviceUrl)}/api/v1/status`,
    events: `${trimSlash(registry.serviceUrl)}/api/v1/events`
  } : null,
  links: {
    index: `${siteUrl}/api/v1/index.json`,
    snapshot: `${siteUrl}/api/v1/problems.jsonl`,
    archive: `${siteUrl}/api/v1/archive.jsonl`,
    evidence: `${siteUrl}/api/v1/evidence.json`,
    events: `${siteUrl}/api/v1/events.json`,
    search: `${siteUrl}/api/v1/search-index.json`,
    schemas: `${siteUrl}/api/v1/schemas/`,
    feedAtom: `${siteUrl}/feed.xml`,
    feedJson: `${siteUrl}/feed.json`,
    llms: `${siteUrl}/llms.txt`,
    llmsFull: `${siteUrl}/llms-full.txt`,
    sitemap: `${siteUrl}/sitemap.xml`,
    directory: `${siteUrl}/problems/`
  }
});

// Agent text exports ----------------------------------------------------------
const llmsFull = [
  "# Quantum Open Problems: full catalog",
  "",
  `> Every active research brief in one file. Catalog as of ${registry.catalogAsOf}.`,
  `> ${activeRecords.length} active problems. Structured records: ${siteUrl}/api/v1/problems.jsonl`,
  "",
  "---",
  "",
  activeRecords.map((record) => packets.get(record.id).trim()).join("\n\n---\n\n"),
  "",
  "---",
  "",
  `# Archived solved problems (${archivedRecords.length})`,
  "",
  `> Solved records keep their statement, resolution evidence, and URL. Structured records: ${siteUrl}/api/v1/archive.jsonl`,
  "",
  "---",
  "",
  archivedRecords.map((record) => packets.get(record.id).trim()).join("\n\n---\n\n"),
  ""
].join("\n");
fs.writeFileSync(path.join(siteDirectory, "llms-full.txt"), llmsFull);

const llmsText = `# Quantum Open Problems

> A source-audited, reviewed research layer for formal open problems across quantum science. Records separate the formal target, original source, exact target clauses, accepted claims with evidence, editorial status decisions, and unverified candidate updates.

Use the compact index for discovery, then fetch one problem record, its frontier, or its Markdown research brief. Each public problem has an HTML page at \`/problems/<record-id>/\`, a JSON record at \`/api/v1/problems/<record-id>.json\`, a frontier at \`/api/v1/problems/<record-id>/frontier.json\`, and a Markdown research brief at \`/packets/<record-id>.md\`. Check the verification date, statement version, and cautions before relying on a status. Accepted claims are reviewed; candidate updates and comments are not scientific evidence until promoted. Human and AI contributions use the same object model with transparent actor identity.

## Machine interfaces

- [Agent guide](${siteUrl}/ai/): MCP server setup, endpoint map, research loop, and contribution contract.
- [API reference](${repositoryUrl}/blob/main/docs/api.md): Every static and service endpoint with request and response shapes.
- [MCP server](${repositoryUrl}/blob/main/mcp/server.mjs): Zero-dependency stdio server; add with \`claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems\`.
- [Release manifest](${siteUrl}/api/v1/release.json): Catalog date, digests, ledger sequence, and counts; poll this before downloading more.
- [Event ledger](${siteUrl}/api/v1/events.json): Append-only sequenced events for reviewed scientific state.
- [Compact catalog](${siteUrl}/api/v1/index.json): Discovery metadata for active and archived problems.
- [Search index](${siteUrl}/api/v1/search-index.json): Lexical index used by the website and MCP search.
- [Full snapshot](${siteUrl}/api/v1/problems.jsonl): One complete JSON record per active problem; [archive](${siteUrl}/api/v1/archive.jsonl) holds solved records.
- [Evidence log](${siteUrl}/api/v1/evidence.json): Every dated evidence event, newest first.
- [Evidence feed](${siteUrl}/feed.xml): Atom feed of the latest evidence events; [JSON Feed](${siteUrl}/feed.json) carries the same entries.
- [Full catalog text](${siteUrl}/llms-full.txt): Every research brief concatenated in one Markdown file.
- [Schemas](${siteUrl}/api/v1/schemas/): Canonical and operational JSON Schemas, including [candidate updates](${siteUrl}/api/v1/candidate-update.schema.json), [reviews](${siteUrl}/api/v1/review.schema.json), [comments](${siteUrl}/api/v1/comment.schema.json), and [events](${siteUrl}/api/v1/event.schema.json).

## Research and contribution

- [Human explorer](${siteUrl}/): Browse fields, status, sources, formal statements, and verified progress.
- [Problem directory](${siteUrl}/problems/): One stable HTML page per record, including archived solved problems.
- [Contribution guide](${repositoryUrl}/blob/main/CONTRIBUTING.md): Trust model, review rules, and required evidence.
${registry.serviceUrl ? `- [Operational service](${trimSlash(registry.serviceUrl)}/api/v1/status): Candidate updates, reviews, comments, and the unified event stream.\n` : ""}
## Optional

- [Source repository](${repositoryUrl}): Canonical records, schemas, projections, service, and validation.
`;
fs.writeFileSync(path.join(siteDirectory, "llms.txt"), llmsText);

fs.writeFileSync(path.join(apiDirectory, "README.md"), `# Quantum Open Problems API v1

Public read endpoints need no authentication. Every file here is generated from the canonical catalog in \`catalog/\`.

- \`release.json\`: release date, digests, ledger sequence, and record counts; poll this first
- \`events.json\`: append-only sequenced ledger of reviewed scientific changes
- \`index.json\`: compact catalog metadata, active and archived discovery records, and claim-watch notices
- \`search-index.json\`: lexical search index
- \`problems/<record-id>.json\`: one complete, source-aware problem record (active and solved)
- \`problems/<record-id>/frontier.json\`: target clauses, accepted claims with evidence, unresolved remainder, status decision
- \`problems/<record-id>/claims.json\`: every accepted claim with its evidence and sources
- \`problems/<record-id>/statements/v<n>.json\`: one immutable statement version
- \`problems.jsonl\`: snapshot of active records; \`archive.jsonl\`: snapshot of solved records
- \`evidence.json\`: every dated evidence event, newest first, for catalog watching
- \`problem.schema.json\`: JSON Schema for problem records
- \`candidate-update.schema.json\`, \`review.schema.json\`, \`comment.schema.json\`, \`actor.schema.json\`, \`event.schema.json\`: operational write and read contracts served by the service
- \`schemas/\`: every canonical and operational schema
- \`contribution.schema.json\`: legacy issue-form envelope, superseded by the candidate-update schema

Each record also has a human page at \`/problems/<record-id>/\` and a Markdown research brief at \`/packets/<record-id>.md\`. Solved records keep the same URL patterns.

Treat \`status\` as a dated editorial assessment derived from the current accepted decision. Read \`dates.verified\`, \`source.relationship\`, and \`evidence.cautions\` before using a record. Candidate updates, reviews, comments, and the unified event stream are served by the operational service documented in \`docs/api.md\`; they are never mixed into these canonical files.
`);

console.log(`Generated API v1: ${activeRecords.length} active and ${archivedRecords.length} archived records, ${catalog.ledger.length} ledger events, ${events.length} evidence events.`);
