import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadCatalog, siteDirectory } from "../core/catalog.mjs";
import { buildCatalogIndex, digestProjection, projectApiV1, publicBundles, activeBundles, archivedBundles } from "../core/projection/api-v1.mjs";
import { projectResearchPacket } from "../core/projection/packet.mjs";
import { buildSearchIndex, searchIndex } from "../core/projection/search.mjs";
import { sha256 } from "../core/domain.mjs";

const catalog = loadCatalog();
const details = new Map(publicBundles(catalog).map((bundle) => [bundle.record.problem.id, projectApiV1(bundle, catalog)]));

test("API v1 records carry content-scoped digests that ignore links and catalog dates", () => {
  for (const detail of details.values()) {
    const { revision, ...content } = detail;
    assert.equal(revision.recordDigest, sha256(JSON.stringify(digestProjection(content))));
    assert.equal(revision.statementDigest, sha256(detail.formulation.statement));
    const relinked = { ...content, links: {}, research: {}, dates: { ...detail.dates, catalogAsOf: "1999-01-01" } };
    assert.equal(sha256(JSON.stringify(digestProjection(relinked))), revision.recordDigest);
  }
});

test("projected digests equal the published-revision manifest", () => {
  for (const [id, detail] of details) {
    const published = catalog.publishedRevisions.records[id];
    assert.ok(published, `${id} is recorded`);
    assert.equal(detail.revision.recordDigest, published.recordDigest, id);
    assert.equal(detail.revision.statementDigest, published.statementDigest, id);
  }
});

test("archived records are solved and active records are open or partial", () => {
  for (const bundle of archivedBundles(catalog)) assert.equal(details.get(bundle.record.problem.id).status, "solved");
  for (const bundle of activeBundles(catalog)) assert.ok(["open", "partial"].includes(details.get(bundle.record.problem.id).status));
});

test("packets carry the record ID, both digests, and the full statement", () => {
  for (const bundle of publicBundles(catalog)) {
    const detail = details.get(bundle.record.problem.id);
    const packet = projectResearchPacket(bundle, catalog, detail);
    assert.ok(packet.includes(`Record ID: ${detail.id}`));
    assert.ok(packet.includes(detail.revision.recordDigest));
    assert.ok(packet.includes(detail.revision.statementDigest));
    assert.ok(packet.includes(detail.formulation.statement));
    if (detail.status === "solved") assert.ok(packet.includes("## Resolution"));
    else assert.ok(packet.includes("## Exact unresolved remainder"));
  }
});

test("the compact index separates active and archived records and orders claim-watch notices", () => {
  const index = buildCatalogIndex(catalog, details);
  assert.equal(index.problems.length, index.meta.active);
  assert.equal(index.archived.length, index.meta.records.resolved);
  assert.equal(index.meta.counts.open + index.meta.counts.partial, index.meta.active);
  assert.ok(index.problems.every((problem) => problem.status !== "solved"));
  assert.ok(index.watchlist.length >= 4);
  const featured = index.watchlist.map((notice) => Boolean(notice.featured));
  assert.ok(featured.slice(0, featured.lastIndexOf(true) + 1).every(Boolean), "featured notices come first");
  for (const problem of index.problems) assert.ok(!("progress" in problem) && !("formulation" in problem));
});

test("lexical search supports prefixes, filters, and archived inclusion", () => {
  const index = buildSearchIndex(buildCatalogIndex(catalog, details));
  const capacity = searchIndex(index, { query: "capac" });
  assert.ok(capacity.matched >= 1);
  assert.ok(capacity.results.every((entry) => entry.status !== "solved"));
  const solved = searchIndex(index, { status: "solved", limit: 100 });
  assert.equal(solved.matched, archivedBundles(catalog).length);
  const channels = searchIndex(index, { topic: "quantum-channels", limit: 100 });
  assert.ok(channels.results.every((entry) => entry.topicId === "quantum-channels"));
  const nothing = searchIndex(index, { query: "zzzz-no-such-term" });
  assert.equal(nothing.matched, 0);
  const ranked = searchIndex(index, { query: "mutually unbiased bases" });
  assert.match(ranked.results[0].title, /unbiased/i);
});

test("generated read models on disk match the projections", () => {
  for (const [id, detail] of details) {
    const onDisk = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "problems", `${id}.json`), "utf8"));
    assert.deepEqual(onDisk, detail, id);
  }
});
