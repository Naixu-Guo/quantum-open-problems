import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const catalogPath = path.join(siteDirectory, "data", "problems.js");
const outputPath = path.join(siteDirectory, "data", "problem-sources.js");
const sandbox = { window: {} };

vm.runInNewContext(fs.readFileSync(catalogPath, "utf8"), sandbox, { filename: catalogPath });

const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const collectionById = new Map(catalog.collections.map((collection) => [collection.id, collection]));
const listCollections = new Set(["horodecki-2020", "krueger-2005", "ruskai-2007"]);

const titleFromFilename = (filename = "") => path.basename(filename, path.extname(filename))
  .replace(/_(?:Horodecki|Ruskai_2007|Kurdzialek|Mothe)$/, "")
  .replaceAll("_", " ");

const sourceUrl = (metadata) => {
  if (metadata.primary_url) return metadata.primary_url;
  if (metadata.doi) return `https://doi.org/${metadata.doi}`;
  if (metadata.arxiv_id) return `https://arxiv.org/abs/${metadata.arxiv_id}`;
  return metadata.source_url || "";
};

const sources = Object.fromEntries(catalog.problems.map((problem) => {
  const metadataPath = path.join(repositoryRoot, "open_prob", problem.id, "metadata.json");
  if (!fs.existsSync(metadataPath)) throw new Error(`Missing source metadata: ${problem.id}`);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
  const collection = collectionById.get(problem.collection);
  const title = metadata.source_title
    || (listCollections.has(problem.collection) ? collection?.title : "")
    || titleFromFilename(metadata.source_pdf)
    || metadata.title;
  const url = sourceUrl(metadata);

  if (!title) throw new Error(`Missing problem-source title: ${problem.id}`);
  if (!url) throw new Error(`Missing problem-source URL: ${problem.id}`);
  if (!metadata.source_location) throw new Error(`Missing problem-source locator: ${problem.id}`);

  return [problem.id, {
    title,
    authors: metadata.authors || [],
    venue: metadata.venue || "",
    locator: metadata.source_location,
    url,
    relationship: metadata.origin?.kind === "derived"
      ? "The source documents the gap used to formulate this problem."
      : "The source states the cataloged problem."
  }];
}));

const generated = [
  '"use strict";',
  "",
  "// Generated from open_prob/<id>/metadata.json. Edit source metadata, then run site/generate-sources.mjs.",
  `window.QUANTUM_PROBLEM_SOURCES = ${JSON.stringify(sources, null, 2)};`,
  ""
].join("\n");

fs.writeFileSync(outputPath, generated);
console.log(`Generated ${Object.keys(sources).length} problem-source records.`);
