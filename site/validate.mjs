import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const dataPath = path.join(siteDirectory, "data", "problems.js");
const formalDataPath = path.join(siteDirectory, "data", "formal-statements.js");
const sourceDataPath = path.join(siteDirectory, "data", "problem-sources.js");
const catalogIndexPath = path.join(siteDirectory, "data", "catalog-index.js");
const packetsDirectory = path.join(siteDirectory, "packets");
const apiDirectory = path.join(siteDirectory, "api", "v1");
const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });
vm.runInNewContext(fs.readFileSync(formalDataPath, "utf8"), sandbox, { filename: formalDataPath });

const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const formalStatements = sandbox.window.QUANTUM_FORMAL_STATEMENTS;
const failures = [];
if (fs.existsSync(sourceDataPath)) {
  vm.runInNewContext(fs.readFileSync(sourceDataPath, "utf8"), sandbox, { filename: sourceDataPath });
} else {
  failures.push("Generated problem sources are missing; run node site/generate-sources.mjs");
}
if (fs.existsSync(catalogIndexPath)) {
  vm.runInNewContext(fs.readFileSync(catalogIndexPath, "utf8"), sandbox, { filename: catalogIndexPath });
} else {
  failures.push("Generated compact catalog index is missing; run node site/build-api.mjs");
}
const problemSources = sandbox.window.QUANTUM_PROBLEM_SOURCES;
const catalogIndex = sandbox.window.QUANTUM_CATALOG_INDEX;
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};
const fullDate = /^\d{4}-\d{2}-\d{2}$/;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

assert(catalog && typeof catalog === "object", "Catalog object is missing");
assert(catalog?.meta?.schemaVersion === 3, "Catalog schemaVersion must be 3");
assert(fullDate.test(catalog?.meta?.audited || ""), "Baseline audit date must be YYYY-MM-DD");
assert(fullDate.test(catalog?.meta?.updated || ""), "Catalog update date must be YYYY-MM-DD");
assert(fullDate.test(catalog?.meta?.asOf || ""), "Catalog as-of date must be YYYY-MM-DD");
assert((catalog?.meta?.updated || "") >= (catalog?.meta?.audited || ""),
  "Catalog update date cannot precede the baseline audit date");
assert(catalog?.meta?.asOf === catalog?.meta?.updated,
  "Catalog as-of date must equal the catalog update date");
assert(Array.isArray(catalog?.problems), "problems must be an array");
assert(Array.isArray(catalog?.taxonomy?.areas), "taxonomy.areas must be an array");
assert(Array.isArray(catalog?.taxonomy?.topics), "taxonomy.topics must be an array");
assert(Array.isArray(catalog?.collections), "collections must be an array");
assert(formalStatements && typeof formalStatements === "object",
  "Generated formal statements are missing");
assert(problemSources && typeof problemSources === "object",
  "Generated problem sources are missing");
assert(catalogIndex && typeof catalogIndex === "object",
  "Generated compact catalog index is missing");
assert(/^https:\/\//.test(catalog?.meta?.siteUrl || ""), "meta.siteUrl must use HTTPS");
assert(/^https:\/\//.test(catalog?.meta?.repositoryUrl || ""), "meta.repositoryUrl must use HTTPS");

const areas = new Map((catalog?.taxonomy?.areas || []).map((area) => [area.id, area]));
const topics = new Map((catalog?.taxonomy?.topics || []).map((topic) => [topic.id, topic]));
const collections = new Map((catalog?.collections || []).map((collection) => [collection.id, collection]));
const provenanceCollections = new Set(["gaugeforge-2026", "theoremdb-2026"]);
const listCollections = new Set(["horodecki-2020", "krueger-2005", "ruskai-2007"]);
const titleFromFilename = (filename = "") => path.basename(filename, path.extname(filename))
  .replace(/_(?:Horodecki|Ruskai_2007|Kurdzialek|Mothe)$/, "")
  .replaceAll("_", " ");
const metadataSourceUrl = (metadata) => {
  if (metadata.primary_url) return metadata.primary_url;
  if (metadata.doi) return `https://doi.org/${metadata.doi}`;
  if (metadata.arxiv_id) return `https://arxiv.org/abs/${metadata.arxiv_id}`;
  return metadata.source_url || "";
};

assert(areas.size === (catalog?.taxonomy?.areas || []).length, "Area ids must be unique");
assert(topics.size === (catalog?.taxonomy?.topics || []).length, "Topic ids must be unique");
assert(collections.size === (catalog?.collections || []).length, "Collection ids must be unique");

for (const area of catalog?.taxonomy?.areas || []) {
  assert(Boolean(area.id), "Every area requires an id");
  assert(Boolean(area.label), `${area.id || "Area"}: label is required`);
  assert(Boolean(area.description), `${area.id || "Area"}: description is required`);
}

for (const topic of catalog?.taxonomy?.topics || []) {
  assert(Boolean(topic.id), "Every topic requires an id");
  assert(Boolean(topic.label), `${topic.id || "Topic"}: label is required`);
  assert(areas.has(topic.area), `${topic.id}: unknown area ${topic.area}`);
}

for (const collection of catalog?.collections || []) {
  assert(Boolean(collection.id), "Every collection requires an id");
  assert(Boolean(collection.label), `${collection.id || "Collection"}: label is required`);
  assert(Boolean(collection.title), `${collection.id || "Collection"}: title is required`);
  assert(Number.isInteger(collection.archiveSize) && collection.archiveSize > 0,
    `${collection.id || "Collection"}: archiveSize must be a positive integer`);
  if (collection.url) assert(/^https:\/\//.test(collection.url), `${collection.id}.url must use HTTPS`);
}

if (Array.isArray(catalog?.problems)) {
  const required = ["id", "title", "status", "topic", "collection", "proposed", "type", "summary", "importance", "remaining", "latest"];
  const seen = new Set();
  const statusCounts = { open: 0, partial: 0 };
  const researchDate = /^\d{4}(?:-\d{2}-\d{2})?$/;
  const stableId = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  for (const [index, problem] of catalog.problems.entries()) {
    const location = `problems[${index}]`;
    for (const key of required) assert(Boolean(problem[key]), `${location}.${key} is required`);
    assert(Boolean(formalStatements?.[problem.id]?.statement),
      `${problem.id}: source-based formal statement is required`);
    const problemSource = problemSources?.[problem.id];
    assert(Boolean(problemSource), `${problem.id}: generated problem source is required`);
    if (problemSource) {
      assert(Boolean(problemSource.title), `${problem.id}: problem source title is required`);
      assert(Array.isArray(problemSource.authors) && problemSource.authors.length > 0,
        `${problem.id}: problem source authors are required`);
      assert(Boolean(problemSource.venue), `${problem.id}: problem source venue is required`);
      assert(Boolean(problemSource.locator), `${problem.id}: problem source locator is required`);
      assert(/^https:\/\//.test(problemSource.url || ""), `${problem.id}: problem source URL must use HTTPS`);
      assert(Boolean(problemSource.relationship), `${problem.id}: source relationship is required`);
    }
    const packetPath = path.join(packetsDirectory, `${problem.id}.md`);
    assert(fs.existsSync(packetPath), `${problem.id}: Markdown research brief is missing`);
    const packet = fs.existsSync(packetPath) ? fs.readFileSync(packetPath, "utf8") : "";
    assert(Boolean(packet), `${problem.id}: generated research packet is required`);
    if (packet) {
      assert(packet.includes(`Record ID: ${problem.id}`), `${problem.id}: packet must contain its stable record ID`);
      assert(packet.includes(catalogIndex?.problems?.find((item) => item.id === problem.id)?.recordDigest || "\0"),
        `${problem.id}: packet must contain the API record revision`);
      assert(packet.includes(catalogIndex?.problems?.find((item) => item.id === problem.id)?.statementDigest || "\0"),
        `${problem.id}: packet must contain the formal statement digest`);
      assert(packet.includes(formalStatements?.[problem.id]?.statement || "\0"),
        `${problem.id}: packet must contain the full formal statement`);
      assert(packet.includes(problem.remaining), `${problem.id}: packet must contain the exact unresolved remainder`);
      assert(packet.includes(problemSource?.title || "\0"), `${problem.id}: packet must contain the problem-source title`);
      assert(packet.includes(problemSource?.url || "\0"), `${problem.id}: packet must contain the problem-source URL`);
      assert(packet.includes("## Research protocol"), `${problem.id}: packet must contain the research protocol`);
      assert(packet.includes("## Requested output"), `${problem.id}: packet must contain the output contract`);

    }
    assert(stableId.test(problem.id), `${location}.id must be a lowercase kebab-case id`);
    assert(!seen.has(problem.id), `Duplicate problem id: ${problem.id}`);
    seen.add(problem.id);
    assert(topics.has(problem.topic), `${problem.id}: unknown topic ${problem.topic}`);
    assert(collections.has(problem.collection), `${problem.id}: unknown collection ${problem.collection}`);
    assert(["open", "partial"].includes(problem.status), `${problem.id}: invalid status ${problem.status}`);
    assert(problem.importance !== problem.summary, `${problem.id}: importance must add information beyond the summary`);
    if (problem.status in statusCounts) statusCounts[problem.status] += 1;
    assert(researchDate.test(problem.latest), `${problem.id}: latest must be YYYY or YYYY-MM-DD`);
    if (problem.verified) {
      assert(fullDate.test(problem.verified), `${problem.id}: verified must be YYYY-MM-DD`);
      assert(problem.verified <= catalog.meta.asOf, `${problem.id}: verified cannot be after the catalog as-of date`);
    }
    if (problem.origin) {
      assert(["source-stated", "derived"].includes(problem.origin.kind),
        `${problem.id}: origin.kind must be source-stated or derived`);
      assert(Boolean(problem.origin.label), `${problem.id}: origin.label is required`);
      assert(Boolean(problem.origin.note), `${problem.id}: origin.note is required`);
    }
    if (provenanceCollections.has(problem.collection)) {
      assert(Boolean(problem.origin), `${problem.id}: imported additions require source provenance`);
      assert(Boolean(problem.verified), `${problem.id}: imported additions require a verification date`);
    }
    assert(Array.isArray(problem.progress) && problem.progress.length > 0, `${problem.id}: progress must not be empty`);
    assert(Array.isArray(problem.keywords), `${problem.id}: keywords must be an array`);

    const progressDates = [];
    for (const [progressIndex, item] of (problem.progress || []).entries()) {
      const itemLocation = `${problem.id}.progress[${progressIndex}]`;
      assert(researchDate.test(item.date), `${itemLocation}.date must be YYYY or YYYY-MM-DD`);
      assert(Boolean(item.title), `${itemLocation}.title is required`);
      assert(Boolean(item.detail), `${itemLocation}.detail is required`);
      assert(Boolean(item.maturity), `${itemLocation}.maturity is required`);
      assert(Boolean(item.strength), `${itemLocation}.strength is required`);
      if (item.url) assert(/^https:\/\//.test(item.url), `${itemLocation}.url must use HTTPS`);
      progressDates.push(item.date);
    }
    const newest = progressDates.sort().at(-1);
    assert(problem.latest === newest, `${problem.id}: latest must equal newest progress date (${newest})`);
  }

  assert(catalog.problems.length === catalog.meta.active,
    `meta.active is ${catalog.meta.active}, found ${catalog.problems.length} active problems`);
  assert(statusCounts.open === catalog.meta.counts.open,
    `meta.counts.open is ${catalog.meta.counts.open}, found ${statusCounts.open}`);
  assert(statusCounts.partial === catalog.meta.counts.partial,
    `meta.counts.partial is ${catalog.meta.counts.partial}, found ${statusCounts.partial}`);
  assert(catalog.meta.counts.open + catalog.meta.counts.partial === catalog.meta.active,
    "meta.counts must sum to meta.active");
  assert(Object.keys(formalStatements || {}).length === catalog.problems.length,
    `Generated formal statement count must equal ${catalog.problems.length}`);
  assert(Object.keys(problemSources || {}).length === catalog.problems.length,
    `Generated problem source count must equal ${catalog.problems.length}`);
  assert(catalogIndex?.problems?.length === catalog.problems.length,
    `Compact catalog index count must equal ${catalog.problems.length}`);
  for (const compact of catalogIndex?.problems || []) {
    assert(seen.has(compact.id), `Compact catalog contains unknown problem ${compact.id}`);
    assert(Boolean(compact.detailUrl), `${compact.id}: compact record requires a detail URL`);
    assert(!("progress" in compact), `${compact.id}: compact record must not embed the progress ledger`);
    assert(!("formulation" in compact), `${compact.id}: compact record must not embed the formal statement`);
  }
  if (fs.existsSync(packetsDirectory)) {
    const packetFiles = fs.readdirSync(packetsDirectory).filter((filename) => filename.endsWith(".md"));
    assert(packetFiles.length === catalog.problems.length,
      `Direct Markdown packet count must equal ${catalog.problems.length}`);
  }

  const archiveSize = [...collections.values()].reduce((total, collection) => total + collection.archiveSize, 0);
  assert(archiveSize === catalog.meta.totalArchive,
    `Collection archive sizes total ${archiveSize}, meta.totalArchive is ${catalog.meta.totalArchive}`);

  for (const problem of catalog.problems) {
    for (const relatedId of problem.related || []) {
      assert(seen.has(relatedId), `${problem.id}: unknown related problem ${relatedId}`);
      assert(relatedId !== problem.id, `${problem.id}: a problem cannot relate to itself`);
    }
  }

  for (const collection of collections.values()) {
    const activeInCollection = catalog.problems.filter((problem) => problem.collection === collection.id).length;
    assert(collection.archiveSize >= activeInCollection,
      `${collection.id}: archiveSize ${collection.archiveSize} is smaller than ${activeInCollection} active problems`);
  }

  const quantumInformationCollections = new Set(["horodecki-2020", "krueger-2005", "ruskai-2007"]);
  for (const problem of catalog.problems) {
    if (quantumInformationCollections.has(problem.collection)) {
      assert(topics.get(problem.topic)?.area === "quantum-information",
        `${problem.id}: legacy quantum-information entries must remain in the quantum-information field`);
    }
  }

  const sourceDirectory = path.join(repositoryRoot, "open_prob");
  if (fs.existsSync(sourceDirectory)) {
    const extractSection = (markdown, heading) => {
      const marker = `## ${heading}\n`;
      const start = markdown.indexOf(marker);
      if (start < 0) return "";
      const body = markdown.slice(start + marker.length);
      const end = body.search(/^## /m);
      return (end < 0 ? body : body.slice(0, end)).trim();
    };
    const sourceStatus = new Map();
    const sourceRecords = new Map();
    const sourceIds = fs.readdirSync(sourceDirectory).filter((id) => {
      const metadataPath = path.join(sourceDirectory, id, "metadata.json");
      return fs.existsSync(metadataPath);
    });
    const activeSourceIds = sourceIds.filter((id) => {
      const metadataPath = path.join(sourceDirectory, id, "metadata.json");
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      sourceRecords.set(id, metadata);
      if (metadata.catalog_source) {
        assert(fullDate.test(metadata.last_verified || ""), `${id}: imported source record requires last_verified`);
        assert(["source-stated", "derived"].includes(metadata.origin?.kind),
          `${id}: imported source record requires a valid origin.kind`);
        assert(Boolean(metadata.origin?.note), `${id}: imported source record requires origin.note`);
      }
      sourceStatus.set(id, metadata.status === "partially_solved" ? "partial" : metadata.status);
      return metadata.status !== "solved";
    });
    assert(sourceIds.length === catalog.meta.totalArchive,
      `Found ${sourceIds.length} source records, meta.totalArchive is ${catalog.meta.totalArchive}`);
    const missing = activeSourceIds.filter((id) => !seen.has(id));
    const extra = [...seen].filter((id) => !activeSourceIds.includes(id));
    assert(missing.length === 0, `Active source records missing from site: ${missing.join(", ")}`);
    assert(extra.length === 0, `Site records not active in source: ${extra.join(", ")}`);
    for (const problem of catalog.problems) {
      assert(problem.status === sourceStatus.get(problem.id), `${problem.id}: site status ${problem.status} disagrees with source status ${sourceStatus.get(problem.id)}`);
      const articlePath = path.join(sourceDirectory, problem.id, "problem.md");
      const article = fs.readFileSync(articlePath, "utf8");
      const sourceFormal = extractSection(article, "Formal statement");
      const sourceNotation = extractSection(article, "Notation");
      assert(Boolean(sourceFormal), `${problem.id}: source article requires a Formal statement section`);
      assert(formalStatements[problem.id]?.statement === sourceFormal,
        `${problem.id}: generated formal statement is stale; run node site/generate-formal.mjs`);
      assert(formalStatements[problem.id]?.notation === sourceNotation,
        `${problem.id}: generated notation is stale; run node site/generate-formal.mjs`);
      const metadata = sourceRecords.get(problem.id);
      const generatedSource = problemSources[problem.id];
      const expectedSourceTitle = metadata.source_title
        || (listCollections.has(problem.collection) ? collections.get(problem.collection)?.title : "")
        || titleFromFilename(metadata.source_pdf)
        || metadata.title;
      assert(generatedSource?.title === expectedSourceTitle,
        `${problem.id}: generated problem-source title is stale; run node site/generate-sources.mjs`);
      assert(JSON.stringify(generatedSource?.authors) === JSON.stringify(metadata.authors || []),
        `${problem.id}: generated problem-source authors are stale; run node site/generate-sources.mjs`);
      assert(generatedSource?.venue === (metadata.venue || ""),
        `${problem.id}: generated problem-source venue is stale; run node site/generate-sources.mjs`);
      assert(generatedSource?.locator === metadata.source_location,
        `${problem.id}: generated problem-source locator is stale; run node site/generate-sources.mjs`);
      assert(generatedSource?.url === metadataSourceUrl(metadata),
        `${problem.id}: generated problem-source URL is stale; run node site/generate-sources.mjs`);
      if (metadata?.catalog_source) {
        assert(problem.verified === metadata.last_verified,
          `${problem.id}: site verification date disagrees with source metadata`);
        assert(problem.origin?.kind === metadata.origin?.kind,
          `${problem.id}: site provenance disagrees with source metadata`);
      }
    }
  }
}

assert(Array.isArray(catalog?.watchlist) && catalog.watchlist.length >= 4, "watchlist must contain at least four entries");
for (const [index, item] of (catalog?.watchlist || []).entries()) {
  assert(Boolean(item.label), `watchlist[${index}].label is required`);
  assert(Boolean(item.title), `watchlist[${index}].title is required`);
  assert(Boolean(item.text), `watchlist[${index}].text is required`);
  if (item.problemId) {
    assert(catalog.problems.some((problem) => problem.id === item.problemId),
      `watchlist[${index}]: unknown problemId ${item.problemId}`);
  }
  if (item.url) assert(/^https:\/\//.test(item.url), `watchlist[${index}].url must use HTTPS`);
}

const apiIndexPath = path.join(apiDirectory, "index.json");
const apiJsonlPath = path.join(apiDirectory, "problems.jsonl");
const problemSchemaPath = path.join(apiDirectory, "problem.schema.json");
const contributionSchemaPath = path.join(apiDirectory, "contribution.schema.json");
const llmsPath = path.join(siteDirectory, "llms.txt");
for (const [filePath, label] of [
  [apiIndexPath, "API index"],
  [apiJsonlPath, "API JSONL snapshot"],
  [problemSchemaPath, "problem JSON Schema"],
  [contributionSchemaPath, "contribution JSON Schema"],
  [llmsPath, "llms.txt"]
]) {
  assert(fs.existsSync(filePath), `${label} is missing; run node site/build-api.mjs`);
}

if (fs.existsSync(apiIndexPath)) {
  const apiIndex = JSON.parse(fs.readFileSync(apiIndexPath, "utf8"));
  assert(apiIndex.meta?.apiVersion === "v1", "API index must declare apiVersion v1");
  assert(apiIndex.problems?.length === catalog.problems.length,
    `API index count must equal ${catalog.problems.length}`);
  assert(JSON.stringify(apiIndex) === JSON.stringify(catalogIndex),
    "Browser catalog index must match api/v1/index.json");
}

const apiRecords = [];
for (const problem of catalog?.problems || []) {
  const apiProblemPath = path.join(apiDirectory, "problems", `${problem.id}.json`);
  assert(fs.existsSync(apiProblemPath), `${problem.id}: API detail record is missing`);
  if (!fs.existsSync(apiProblemPath)) continue;
  const record = JSON.parse(fs.readFileSync(apiProblemPath, "utf8"));
  apiRecords.push(record);
  assert(record.schemaVersion === 1, `${problem.id}: API record must use schemaVersion 1`);
  assert(record.kind === "quantum-open-problem", `${problem.id}: API record kind is invalid`);
  assert(record.id === problem.id, `${problem.id}: API record ID disagrees with the catalog`);
  assert(record.status === problem.status, `${problem.id}: API status disagrees with the catalog`);
  assert(record.question?.unresolved === problem.remaining,
    `${problem.id}: API unresolved remainder disagrees with the catalog`);
  assert(JSON.stringify(record.formulation) === JSON.stringify(formalStatements[problem.id]),
    `${problem.id}: API formulation disagrees with the source-generated statement`);
  assert(JSON.stringify(record.source) === JSON.stringify(problemSources[problem.id]),
    `${problem.id}: API problem source disagrees with source metadata`);
  assert(record.research?.briefMarkdown?.endsWith(`/packets/${problem.id}.md`),
    `${problem.id}: API research brief link is invalid`);
  const { revision, research, links, ...digestBase } = record;
  const digestDates = { ...record.dates };
  delete digestDates.catalogAsOf;
  const digestSource = { ...digestBase, dates: digestDates };
  assert(revision?.algorithm === "sha256", `${problem.id}: API record digest algorithm must be sha256`);
  assert(revision?.projection === "content-v1", `${problem.id}: API record digest projection must be content-v1`);
  assert(revision?.recordDigest === sha256(JSON.stringify(digestSource)),
    `${problem.id}: API record digest is stale`);
  assert(revision?.statementDigest === sha256(record.formulation.statement),
    `${problem.id}: API statement digest is stale`);
  const compact = catalogIndex.problems.find((item) => item.id === problem.id);
  assert(compact?.recordDigest === revision?.recordDigest,
    `${problem.id}: compact index record digest disagrees with the API record`);
  assert(compact?.statementDigest === revision?.statementDigest,
    `${problem.id}: compact index statement digest disagrees with the API record`);
}

if (fs.existsSync(apiJsonlPath)) {
  const lines = fs.readFileSync(apiJsonlPath, "utf8").trim().split("\n").filter(Boolean);
  assert(lines.length === catalog.problems.length,
    `API JSONL snapshot must contain ${catalog.problems.length} records`);
  const jsonlRecords = lines.map((line, index) => {
    try { return JSON.parse(line); } catch { failures.push(`API JSONL line ${index + 1} is invalid JSON`); return null; }
  }).filter(Boolean);
  assert(JSON.stringify(jsonlRecords) === JSON.stringify(apiRecords),
    "API JSONL snapshot differs from per-problem API records");
}

if (fs.existsSync(llmsPath)) {
  const llms = fs.readFileSync(llmsPath, "utf8");
  assert(llms.startsWith("# Quantum Open Problems\n"), "llms.txt must start with the site title");
  assert(llms.includes("/api/v1/index.json"), "llms.txt must link the compact API index");
  assert(llms.includes("/api/v1/contribution.schema.json"), "llms.txt must link the contribution contract");
  assert(llms.includes("/api/v1/evidence.json"), "llms.txt must link the evidence log");
  assert(llms.includes("/api/v1/release.json"), "llms.txt must link the release manifest");
  assert(llms.includes("/llms-full.txt"), "llms.txt must link the full catalog text");
}

const pagesDirectory = path.join(siteDirectory, "problems");
const sitemapPath = path.join(siteDirectory, "sitemap.xml");
const feedPath = path.join(siteDirectory, "feed.xml");
const jsonFeedPath = path.join(siteDirectory, "feed.json");
const evidencePath = path.join(apiDirectory, "evidence.json");
const releasePath = path.join(apiDirectory, "release.json");
const llmsFullPath = path.join(siteDirectory, "llms-full.txt");
for (const [filePath, label] of [
  [path.join(pagesDirectory, "index.html"), "problem directory page"],
  [sitemapPath, "sitemap.xml"],
  [feedPath, "Atom evidence feed"],
  [jsonFeedPath, "JSON evidence feed"],
  [evidencePath, "API evidence log"],
  [releasePath, "API release manifest"],
  [llmsFullPath, "llms-full.txt"]
]) {
  assert(fs.existsSync(filePath), `${label} is missing; run node site/generate-pages.mjs`);
}

const archivedIds = fs.existsSync(path.join(repositoryRoot, "open_prob"))
  ? fs.readdirSync(path.join(repositoryRoot, "open_prob")).filter((id) => {
    const metadataPath = path.join(repositoryRoot, "open_prob", id, "metadata.json");
    if (!fs.existsSync(metadataPath)) return false;
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    return metadata.status === "solved" && !catalog.problems.some((problem) => problem.id === id);
  })
  : [];

if (fs.existsSync(pagesDirectory)) {
  const siteUrlPrefix = String(catalog?.meta?.siteUrl || "").replace(/\/$/, "");
  const knownPageIds = new Set([...(catalog?.problems || []).map((problem) => problem.id), ...archivedIds]);
  for (const entry of fs.readdirSync(pagesDirectory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      assert(knownPageIds.has(entry.name), `Unknown problem page directory: ${entry.name}`);
    }
  }
  for (const problem of catalog?.problems || []) {
    const pagePath = path.join(pagesDirectory, problem.id, "index.html");
    assert(fs.existsSync(pagePath), `${problem.id}: static problem page is missing`);
    if (!fs.existsSync(pagePath)) continue;
    const page = fs.readFileSync(pagePath, "utf8");
    assert(page.includes(`<link rel="canonical" href="${siteUrlPrefix}/problems/${problem.id}/">`),
      `${problem.id}: problem page must declare its canonical URL`);
    assert(page.includes("application/ld+json"), `${problem.id}: problem page must embed JSON-LD`);
    const compact = catalogIndex?.problems?.find((item) => item.id === problem.id);
    assert(page.includes(compact?.recordDigest || "\0"),
      `${problem.id}: problem page must carry the record revision`);
    assert(page.includes(`packets/${problem.id}.md`), `${problem.id}: problem page must link its research brief`);
    assert(page.includes(`api/v1/problems/${problem.id}.json`), `${problem.id}: problem page must link its JSON record`);
  }
  for (const id of archivedIds) {
    const pagePath = path.join(pagesDirectory, id, "index.html");
    assert(fs.existsSync(pagePath), `${id}: archived problem page is missing`);
    if (!fs.existsSync(pagePath)) continue;
    const page = fs.readFileSync(pagePath, "utf8");
    assert(page.includes(`<link rel="canonical" href="${siteUrlPrefix}/problems/${id}/">`),
      `${id}: archived page must declare its canonical URL`);
    assert(page.includes("Archived record"), `${id}: archived page must state its archived status`);
  }
}

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const locCount = (sitemap.match(/<loc>/g) || []).length;
  const expected = (catalog?.problems?.length || 0) + archivedIds.length + 4;
  assert(locCount === expected, `sitemap.xml must list ${expected} URLs, found ${locCount}`);
  for (const problem of catalog?.problems || []) {
    assert(sitemap.includes(`/problems/${problem.id}/`), `sitemap.xml must list ${problem.id}`);
  }
  for (const id of archivedIds) {
    assert(sitemap.includes(`/problems/${id}/`), `sitemap.xml must list archived record ${id}`);
  }
}

if (fs.existsSync(feedPath)) {
  const feed = fs.readFileSync(feedPath, "utf8");
  assert(feed.includes('<feed xmlns="http://www.w3.org/2005/Atom">'), "feed.xml must be an Atom feed");
  assert((feed.match(/<entry>/g) || []).length > 0, "feed.xml must contain at least one entry");
  assert(feed.includes("#qop-evt-"), "feed.xml entries must use stable content-hash IDs");
  assert(feed.includes("<author><name>"), "feed.xml must declare a feed-level author");
  assert(feed.includes("<published>"), "feed.xml entries must carry a published date");
}

if (fs.existsSync(jsonFeedPath)) {
  const feed = JSON.parse(fs.readFileSync(jsonFeedPath, "utf8"));
  assert(feed.version === "https://jsonfeed.org/version/1.1", "feed.json must declare JSON Feed 1.1");
  assert(Array.isArray(feed.items) && feed.items.length > 0, "feed.json must contain items");
  assert(feed.items.every((item) => /^qop-evt-[a-f0-9]{16}$/.test(item.id)),
    "feed.json items must use stable content-hash IDs");
}

if (fs.existsSync(evidencePath)) {
  const evidence = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
  const totalEvents = (catalog?.problems || [])
    .reduce((total, problem) => total + (problem.progress || []).length, 0);
  assert(evidence.count === totalEvents && evidence.events?.length === totalEvents,
    `evidence.json must contain every progress event (${totalEvents})`);
  const sorted = (evidence.events || []).every((event, index, events) =>
    index === 0 || events[index - 1].date >= event.date);
  assert(sorted, "evidence.json events must be sorted newest first");
  const eventIdFor = (event) => `qop-evt-${sha256([
    event.problemId, event.date, event.title, event.detail, event.maturity, event.strength, event.url || ""
  ].join("|")).slice(0, 16)}`;
  assert((evidence.events || []).every((event) => event.eventId === eventIdFor(event)),
    "evidence.json event IDs must hash the complete event payload");
  const eventIds = new Set((evidence.events || []).map((event) => event.eventId));
  assert(eventIds.size === (evidence.events || []).length, "evidence.json event IDs must be unique");
  if (fs.existsSync(jsonFeedPath)) {
    const feed = JSON.parse(fs.readFileSync(jsonFeedPath, "utf8"));
    assert((feed.items || []).every((item) => eventIds.has(item.id)),
      "feed.json items must correspond to evidence.json events");
  }
}

if (fs.existsSync(releasePath)) {
  const release = JSON.parse(fs.readFileSync(releasePath, "utf8"));
  assert(release.releaseDate === catalog.meta.asOf, "release.json date must equal the catalog as-of date");
  assert(release.records?.total === catalog.meta.totalArchive
    && release.records?.active === catalog.meta.active,
  "release.json record counts must match the catalog");
  if (fs.existsSync(apiJsonlPath)) {
    const snapshotDigest = `sha256:${sha256(fs.readFileSync(apiJsonlPath, "utf8"))}`;
    assert(release.activeSnapshotDigest === snapshotDigest, "release.json active snapshot digest is stale");
  }
}

const vocabPath = path.join(siteDirectory, "vocab", "index.html");
assert(fs.existsSync(vocabPath), "Vocabulary page is missing; run node site/generate-pages.mjs");
if (fs.existsSync(vocabPath)) {
  const vocab = fs.readFileSync(vocabPath, "utf8");
  for (const anchor of ["problemStatus", "verified", "recordDigest"]) {
    assert(vocab.includes(`id="${anchor}"`), `Vocabulary page must define qop:${anchor}`);
  }
}

const aiPagePath = path.join(siteDirectory, "ai", "index.html");
assert(fs.existsSync(aiPagePath), "AI agent guide page is missing; run node site/generate-pages.mjs");
if (fs.existsSync(aiPagePath)) {
  const aiPage = fs.readFileSync(aiPagePath, "utf8");
  assert(aiPage.includes("MCP server"), "AI guide must document the MCP server");
  assert(aiPage.includes("mcp add quantum-open-problems"), "AI guide must show the MCP install command");
  for (const tool of ["search_problems", "get_research_brief", "how_to_contribute"]) {
    assert(aiPage.includes(tool), `AI guide must list the ${tool} tool`);
  }
  assert(aiPage.includes("contribution.schema.json"), "AI guide must link the contribution schema");
}

const mcpServerPath = path.join(repositoryRoot, "mcp", "server.mjs");
assert(fs.existsSync(mcpServerPath), "MCP server (mcp/server.mjs) is missing");

if (fs.existsSync(llmsFullPath)) {
  const llmsFull = fs.readFileSync(llmsFullPath, "utf8");
  for (const problem of catalog?.problems || []) {
    assert(llmsFull.includes(`Record ID: ${problem.id}`), `llms-full.txt must contain ${problem.id}`);
  }
}

if (failures.length) {
  console.error(`Catalog validation failed with ${failures.length} error(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  const activeAreas = new Set(catalog.problems.map((problem) => topics.get(problem.topic)?.area));
  console.log(`Catalog validation passed: ${catalog.problems.length} active problems across ${activeAreas.size} research fields.`);
}
