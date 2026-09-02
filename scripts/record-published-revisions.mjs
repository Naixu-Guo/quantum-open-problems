#!/usr/bin/env node
// Refresh catalog/compatibility/published-revisions.json from the current
// canonical projection. Run deliberately when a record's research content is
// meant to change; the validator otherwise rejects digest drift.
//
//   node scripts/record-published-revisions.mjs                 refresh every public record
//   node scripts/record-published-revisions.mjs --only-missing  add records that have no entry
//   node scripts/record-published-revisions.mjs <id> [<id>...]  refresh the named records

import { loadCatalog, writeJson } from "../core/catalog.mjs";
import { refreshPublishedRevisions } from "../core/published-revisions.mjs";

const args = process.argv.slice(2);
const catalog = loadCatalog();
const { manifest, changed } = refreshPublishedRevisions(catalog, {
  onlyMissing: args.includes("--only-missing"),
  ids: args.filter((argument) => !argument.startsWith("--"))
});
for (const id of changed) {
  const entry = manifest.records[id];
  console.log(entry ? `${id}: ${entry.recordDigest.slice(0, 12)} / ${entry.statementDigest.slice(0, 12)}` : `${id}: removed`);
}
writeJson(catalog.paths.publishedRevisionsPath, manifest);
console.log(`${changed.length} entr${changed.length === 1 ? "y" : "ies"} updated; ${Object.keys(manifest.records).length} public records recorded.`);
