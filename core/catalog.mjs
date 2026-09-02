// Readers for the canonical Git-backed catalog. The catalog directory is the
// only scientific authoring surface; every other representation is derived.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractSection } from "./domain.mjs";

export const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const catalogDirectory = path.join(repositoryRoot, "catalog");
export const schemaDirectory = path.join(catalogDirectory, "schema");
export const problemsDirectory = path.join(catalogDirectory, "problems");
export const sourcesDirectory = path.join(catalogDirectory, "sources");
export const ledgerPath = path.join(catalogDirectory, "events.jsonl");
export const publishedRevisionsPath = path.join(catalogDirectory, "compatibility", "published-revisions.json");
export const siteDirectory = path.join(repositoryRoot, "site");

export const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
export const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

// Every reader accepts an optional catalog directory so tests and tools can
// operate on a copy of the catalog without touching the repository.
export const catalogPaths = (directory = catalogDirectory) => ({
  directory,
  registryPath: path.join(directory, "registry.json"),
  problemsDirectory: path.join(directory, "problems"),
  sourcesDirectory: path.join(directory, "sources"),
  ledgerPath: path.join(directory, "events.jsonl"),
  publishedRevisionsPath: path.join(directory, "compatibility", "published-revisions.json")
});

export const readRegistry = (directory = catalogDirectory) => readJson(catalogPaths(directory).registryPath);

export const readSources = (directory = catalogDirectory) => {
  const { sourcesDirectory: sources } = catalogPaths(directory);
  return fs.readdirSync(sources)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => readJson(path.join(sources, filename)))
    .sort((a, b) => a.id.localeCompare(b.id));
};

export const readRecords = (directory = catalogDirectory) => {
  const { problemsDirectory: problems } = catalogPaths(directory);
  return fs.readdirSync(problems, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      directory: path.join(problems, entry.name),
      record: readJson(path.join(problems, entry.name, "record.json"))
    }))
    .sort((a, b) => a.record.problem.id.localeCompare(b.record.problem.id));
};

export const readLedger = (directory = catalogDirectory) => {
  const { ledgerPath: ledger } = catalogPaths(directory);
  if (!fs.existsSync(ledger)) return [];
  return fs.readFileSync(ledger, "utf8")
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line));
};

export const readPublishedRevisions = (directory = catalogDirectory) => {
  const { publishedRevisionsPath: manifest } = catalogPaths(directory);
  return fs.existsSync(manifest)
    ? readJson(manifest)
    : { kind: "qop-published-revisions", projection: "content-v1", records: {} };
};

const bundlePath = (bundle, relativePath, label) => {
  const filePath = path.resolve(bundle.directory, relativePath);
  if (!filePath.startsWith(`${bundle.directory}${path.sep}`)) {
    throw new Error(`${bundle.record.problem.id}: ${label} path escapes its problem bundle`);
  }
  return filePath;
};

export const statementContent = (bundle, statement) => {
  const markdown = fs.readFileSync(bundlePath(bundle, statement.bodyPath, "statement"), "utf8");
  return {
    markdown,
    notation: extractSection(markdown, "Notation"),
    statement: extractSection(markdown, "Formal statement")
  };
};

export const editorialNotes = (bundle) => {
  const notesPath = bundle.record.editorial.notesPath;
  if (!notesPath) return null;
  const filePath = bundlePath(bundle, notesPath, "notes");
  if (!fs.existsSync(filePath)) return null;
  const markdown = fs.readFileSync(filePath, "utf8");
  return {
    markdown,
    heading: (markdown.match(/^# (.+)$/m) || [null, null])[1],
    background: extractSection(markdown, "Background"),
    progress: extractSection(markdown, "Status and known progress"),
    bibliography: extractSection(markdown, "Bibliography")
  };
};

export const readContributions = (bundle) => {
  const directory = path.join(bundle.directory, "contributions");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((filename) => filename.endsWith(".json"))
    .sort()
    .map((filename) => readJson(path.join(directory, filename)));
};

// Load the whole catalog once; consumers pass this object around instead of
// re-reading files.
export const loadCatalog = (directory = catalogDirectory) => {
  const registry = readRegistry(directory);
  const sources = readSources(directory);
  const bundles = readRecords(directory);
  return {
    directory,
    paths: catalogPaths(directory),
    registry,
    sources,
    sourceById: new Map(sources.map((source) => [source.id, source])),
    bundles,
    bundleById: new Map(bundles.map((bundle) => [bundle.record.problem.id, bundle])),
    topicById: new Map(registry.taxonomy.topics.map((topic) => [topic.id, topic])),
    areaById: new Map(registry.taxonomy.areas.map((area) => [area.id, area])),
    collectionById: new Map(registry.collections.map((collection) => [collection.id, collection])),
    ledger: readLedger(directory),
    publishedRevisions: readPublishedRevisions(directory)
  };
};
