// Explicit catalog merges retain historical inputs without listing a second question.
import fs from "node:fs";
import path from "node:path";
import { validateRecordShape } from "./record.mjs";
import { validateRecordIdentities, metadataSlug } from "./metadata.mjs";

export function loadMergedProblems(root, activeRecords) {
  const directory = path.join(root, "database/merged_problems_json");
  if (!fs.existsSync(directory)) return [];
  const mappings = JSON.parse(fs.readFileSync(path.join(root, "database/metadata.json"), "utf8")).mappings;
  const byId = new Map(activeRecords.map((record) => [record.ulid, record]));
  const merges = fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort().map((name) => {
    const entry = JSON.parse(fs.readFileSync(path.join(directory, name), "utf8"));
    if (entry.schema !== "qiqcop-zoo/merged-problem/1" || typeof entry.reason !== "string" || !entry.reason.trim()) throw new Error(`${name}: invalid catalog merge`);
    const record = validateRecordShape(entry.record, name);
    if (name !== `${record.id}.json`) throw new Error(`${name}: merged problem ID differs from filename`);
    const pinned = mappings[record.id];
    if (pinned && pinned.ulid !== record.ulid) throw new Error(`${name}: permanent ULID differs from pinned identity`);
    for (const alias of [record.id, record.ulid, metadataSlug(record.id), ...(pinned?.mainAliases ?? [])]) {
      if (!record.aliases.includes(alias)) throw new Error(`${name}: missing permanent alias ${alias}`);
    }
    const target = byId.get(entry.mergedIntoProblemId);
    if (!target || target.metadata.equivalentToProblemId) throw new Error(`${name}: merge target must be an active canonical problem`);
    return { record, target, reason: entry.reason };
  });
  // Reject alias collisions, accidental reintroduction, self-merges and dangling links.
  // Historical research status stays in record; current equivalence follows the target.
  validateRecordIdentities([...activeRecords, ...merges.map(({ record, target }) => ({ ...record, status: target.status,
    metadata: { ...record.metadata, equivalentToProblemId: target.ulid } }))]);
  return merges;
}
