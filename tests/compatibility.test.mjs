import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadCatalog, repositoryRoot, siteDirectory } from "../core/catalog.mjs";
import { projectApiV1 } from "../core/projection/api-v1.mjs";

const legacyDigests = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "tests", "fixtures", "legacy-published-revisions.json"), "utf8")).records;
const legacyIds = JSON.parse(fs.readFileSync(path.join(repositoryRoot, "tests", "fixtures", "legacy-record-ids.json"), "utf8")).ids;
const catalog = loadCatalog();

test("every record published before the migration keeps its revision digests", () => {
  for (const [id, digests] of Object.entries(legacyDigests)) {
    const bundle = catalog.bundleById.get(id);
    assert.ok(bundle, `${id} is still in the catalog`);
    const detail = projectApiV1(bundle, catalog);
    assert.equal(detail.revision.recordDigest, digests.recordDigest, `${id} record digest`);
    assert.equal(detail.revision.statementDigest, digests.statementDigest, `${id} statement digest`);
  }
});

test("every legacy record ID keeps its page, API record, packet, and frontier", () => {
  assert.equal(legacyIds.length, 58);
  for (const id of legacyIds) {
    assert.ok(fs.existsSync(path.join(siteDirectory, "problems", id, "index.html")), `${id} page`);
    assert.ok(fs.existsSync(path.join(siteDirectory, "api", "v1", "problems", `${id}.json`)), `${id} API record`);
    assert.ok(fs.existsSync(path.join(siteDirectory, "packets", `${id}.md`)), `${id} packet`);
    assert.ok(fs.existsSync(path.join(siteDirectory, "api", "v1", "problems", id, "frontier.json")), `${id} frontier`);
    assert.ok(catalog.bundleById.has(id), `${id} canonical record`);
  }
});

test("legacy authoring surfaces no longer exist", () => {
  assert.ok(!fs.existsSync(path.join(repositoryRoot, "open_prob")));
  for (const file of ["problems.js", "formal-statements.js", "problem-sources.js"]) {
    assert.ok(!fs.existsSync(path.join(siteDirectory, "data", file)), file);
  }
});

test("the release manifest and API index keep their published shape", () => {
  const release = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "release.json"), "utf8"));
  for (const key of ["kind", "apiVersion", "releaseDate", "activeSnapshotDigest", "records", "evidenceEvents", "links"]) assert.ok(key in release, key);
  assert.equal(release.records.total, 58);
  assert.equal(release.records.active, 38);
  const index = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "index.json"), "utf8"));
  for (const key of ["meta", "taxonomy", "collections", "problems", "watchlist"]) assert.ok(key in index, key);
  assert.equal(index.meta.schemaVersion, 3);
  assert.ok(index.taxonomy.topics.every((topic) => "area" in topic));
  for (const problem of index.problems) {
    for (const key of ["id", "title", "status", "topic", "collection", "proposed", "latest", "summary", "keywords", "latestEvidence", "recordDigest", "statementDigest", "detailUrl"]) assert.ok(key in problem, `${problem.id}.${key}`);
  }
});
