// The published-revision manifest records the API v1 digests of every public
// record. Refreshing it is a deliberate editorial act; the validator treats
// any other digest change as an error.

import { isPublic } from "./domain.mjs";
import { projectApiV1 } from "./projection/api-v1.mjs";

export const refreshPublishedRevisions = (catalog, { onlyMissing = false, ids = [] } = {}) => {
  const records = { ...catalog.publishedRevisions.records };
  const changed = [];
  for (const bundle of catalog.bundles) {
    const id = bundle.record.problem.id;
    if (!isPublic(bundle.record)) {
      if (records[id]) { delete records[id]; changed.push(id); }
      continue;
    }
    if (onlyMissing && records[id]) continue;
    if (ids.length && !ids.includes(id)) continue;
    const detail = projectApiV1(bundle, catalog);
    const next = { recordDigest: detail.revision.recordDigest, statementDigest: detail.revision.statementDigest };
    if (JSON.stringify(records[id]) !== JSON.stringify(next)) {
      records[id] = next;
      changed.push(id);
    }
  }
  const ordered = Object.fromEntries(Object.keys(records).sort().map((id) => [id, records[id]]));
  return { manifest: { ...catalog.publishedRevisions, records: ordered }, changed };
};
