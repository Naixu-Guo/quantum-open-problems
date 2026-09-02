// Read-model consistency checks: every generated file under site/ must equal
// its canonical projection, every public record must have its page, packet,
// and API resources, and the agent exports must link the required interfaces.

import fs from "node:fs";
import path from "node:path";
import { catalogDirectory, loadCatalog, siteDirectory } from "../core/catalog.mjs";
import { sha256 } from "../core/domain.mjs";
import { projectEventLedger } from "../core/ledger.mjs";
import {
  activeBundles,
  archivedBundles,
  buildCatalogIndex,
  projectApiV1,
  projectClaims,
  projectStatement,
  publicBundles
} from "../core/projection/api-v1.mjs";
import { projectFrontier } from "../core/projection/frontier.mjs";
import { projectResearchPacket } from "../core/projection/packet.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";

const apiDirectory = path.join(siteDirectory, "api", "v1");
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const sameJson = (filePath, expected, label) => {
  if (!fs.existsSync(filePath)) { failures.push(`${label} is missing; run node site/build.mjs`); return; }
  assert(JSON.stringify(readJson(filePath)) === JSON.stringify(expected), `${label} is stale; run node site/build.mjs`);
};

const catalog = loadCatalog();
const { registry } = catalog;
const bundles = publicBundles(catalog);
const details = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectApiV1(bundle, catalog)]));
const catalogIndex = buildCatalogIndex(catalog, details);
const frontierSchema = path.join(catalogDirectory, "schema", "frontier.schema.json");

for (const bundle of bundles) {
  const id = bundle.record.problem.id;
  const detail = details.get(id);
  sameJson(path.join(apiDirectory, "problems", `${id}.json`), detail, `${id}: API record`);
  const frontier = projectFrontier(bundle, catalog, { apiRecord: detail });
  sameJson(path.join(apiDirectory, "problems", id, "frontier.json"), frontier, `${id}: frontier`);
  if (fs.existsSync(frontierSchema)) {
    for (const error of validateAgainstSchema(frontier, frontierSchema)) failures.push(`${id}: frontier ${error}`);
  }
  sameJson(path.join(apiDirectory, "problems", id, "claims.json"), projectClaims(bundle, catalog), `${id}: claims`);
  for (const statement of bundle.record.statements) {
    sameJson(path.join(apiDirectory, "problems", id, "statements", `v${statement.version}.json`), projectStatement(bundle, statement, catalog), `${id}: statement v${statement.version}`);
  }
  const packetPath = path.join(siteDirectory, "packets", `${id}.md`);
  const packet = fs.existsSync(packetPath) ? fs.readFileSync(packetPath, "utf8") : "";
  assert(packet === projectResearchPacket(bundle, catalog, detail), `${id}: research packet is stale; run node site/build.mjs`);
  assert(packet.includes(`Record ID: ${id}`), `${id}: packet must contain its stable record ID`);
  assert(packet.includes(detail.revision.recordDigest), `${id}: packet must contain the API record revision`);
  assert(packet.includes(detail.revision.statementDigest), `${id}: packet must contain the formal statement digest`);
  assert(packet.includes(detail.formulation.statement), `${id}: packet must contain the full formal statement`);
  assert(packet.includes("## Research protocol"), `${id}: packet must contain the research protocol`);
  const pagePath = path.join(siteDirectory, "problems", id, "index.html");
  assert(fs.existsSync(pagePath), `${id}: problem page is missing`);
  if (fs.existsSync(pagePath)) {
    const page = fs.readFileSync(pagePath, "utf8");
    assert(page.includes(detail.revision.recordDigest), `${id}: page must show the record revision`);
    assert(page.includes(`data-problem-id="${id}"`), `${id}: page must carry the community hooks`);
    if (detail.status === "solved") assert(page.includes("Archived record"), `${id}: archived page must identify itself`);
  }
  const { revision, research, links, ...digestBase } = detail;
  const digestDates = { ...detail.dates };
  delete digestDates.catalogAsOf;
  assert(revision.recordDigest === sha256(JSON.stringify({ ...digestBase, dates: digestDates })), `${id}: record digest is inconsistent`);
  assert(revision.statementDigest === sha256(detail.formulation.statement), `${id}: statement digest is inconsistent`);
  for (const relatedId of detail.relations.relatedProblems) {
    assert(details.has(relatedId), `${id}: related problem ${relatedId} is not public`);
  }
}

// Catalog-wide files.
sameJson(path.join(apiDirectory, "index.json"), catalogIndex, "API index");
sameJson(path.join(apiDirectory, "events.json"), projectEventLedger(catalog, registry.siteUrl.replace(/\/$/, "")), "event ledger read model");
const browserIndexPath = path.join(siteDirectory, "data", "catalog-index.js");
assert(fs.existsSync(browserIndexPath), "browser catalog index is missing");
if (fs.existsSync(browserIndexPath)) {
  const source = fs.readFileSync(browserIndexPath, "utf8");
  assert(source.includes(JSON.stringify(catalogIndex, null, 2)), "browser catalog index is stale; run node site/build.mjs");
}
for (const legacy of ["problems.js", "formal-statements.js", "problem-sources.js"]) {
  assert(!fs.existsSync(path.join(siteDirectory, "data", legacy)), `site/data/${legacy} is a retired authoring surface and must not exist`);
}
assert(!fs.existsSync(path.join(path.dirname(siteDirectory), "open_prob")), "open_prob/ is a retired authoring surface and must not exist");

const active = activeBundles(catalog).map((bundle) => details.get(bundle.record.problem.id));
const archived = archivedBundles(catalog).map((bundle) => details.get(bundle.record.problem.id));
const jsonlPath = path.join(apiDirectory, "problems.jsonl");
if (fs.existsSync(jsonlPath)) {
  const lines = fs.readFileSync(jsonlPath, "utf8").trim().split("\n").filter(Boolean);
  assert(lines.length === active.length, `API JSONL snapshot must contain ${active.length} records`);
  assert(JSON.stringify(lines.map((line) => JSON.parse(line))) === JSON.stringify(active), "API JSONL snapshot differs from per-problem API records");
} else failures.push("API JSONL snapshot is missing");
const archivePath = path.join(apiDirectory, "archive.jsonl");
if (fs.existsSync(archivePath)) {
  const lines = fs.readFileSync(archivePath, "utf8").trim().split("\n").filter(Boolean);
  assert(JSON.stringify(lines.map((line) => JSON.parse(line))) === JSON.stringify(archived), "archive JSONL snapshot differs from per-problem API records");
} else failures.push("archive JSONL snapshot is missing");

const releasePath = path.join(apiDirectory, "release.json");
if (fs.existsSync(releasePath)) {
  const release = readJson(releasePath);
  assert(release.activeSnapshotDigest === `sha256:${sha256(fs.readFileSync(jsonlPath, "utf8"))}`, "release digest does not match the snapshot");
  assert(release.records.active === active.length && release.records.resolved === archived.length, "release counts disagree with the catalog");
  assert(release.ledger?.lastSequence === (catalog.ledger.at(-1)?.sequence || 0), "release ledger sequence is stale");
} else failures.push("release manifest is missing");

for (const [file, label] of [["problem.schema.json", "problem schema"], ["contribution.schema.json", "contribution schema"], ["candidate-update.schema.json", "candidate-update schema"], ["search-index.json", "search index"], ["evidence.json", "evidence log"]]) {
  assert(fs.existsSync(path.join(apiDirectory, file)), `${label} is missing`);
}
if (fs.existsSync(path.join(apiDirectory, "problem.schema.json"))) {
  const schemaPath = path.join(apiDirectory, "problem.schema.json");
  for (const detail of details.values()) {
    for (const error of validateAgainstSchema(detail, schemaPath)) failures.push(`${detail.id}: API record ${error}`);
  }
}

const llmsPath = path.join(siteDirectory, "llms.txt");
if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, "utf8");
  assert(llms.startsWith("# Quantum Open Problems\n"), "llms.txt must start with the site title");
  for (const needle of ["/api/v1/index.json", "/api/v1/release.json", "/api/v1/events.json", "/api/v1/evidence.json", "/llms-full.txt", "candidate-update.schema.json"]) {
    assert(llms.includes(needle), `llms.txt must link ${needle}`);
  }
} else failures.push("llms.txt is missing");
const llmsFullPath = path.join(siteDirectory, "llms-full.txt");
if (fs.existsSync(llmsFullPath)) {
  const text = fs.readFileSync(llmsFullPath, "utf8");
  for (const detail of details.values()) assert(text.includes(`Record ID: ${detail.id}`), `llms-full.txt must include ${detail.id}`);
}
for (const file of ["sitemap.xml", "feed.xml", "feed.json", path.join("problems", "index.html"), path.join("ai", "index.html"), path.join("vocab", "index.html"), "community.js"]) {
  assert(fs.existsSync(path.join(siteDirectory, file)), `${file} is missing`);
}
if (fs.existsSync(path.join(siteDirectory, "sitemap.xml"))) {
  const sitemap = fs.readFileSync(path.join(siteDirectory, "sitemap.xml"), "utf8");
  for (const detail of details.values()) assert(sitemap.includes(`/problems/${detail.id}/`), `sitemap must list ${detail.id}`);
}

if (failures.length) {
  console.error(`Read-model validation failed with ${failures.length} error(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`Read models validated: ${active.length} active and ${archived.length} archived records across pages, API, packets, feeds, and exports.`);
}
