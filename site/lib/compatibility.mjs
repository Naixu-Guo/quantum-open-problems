// Historical entry points, with explicit payload versions and archive notices.
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { slug } from "./tex.mjs";
const escape = (text) => String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
export function redirect(target, title) {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>${escape(title)}</title><link rel="canonical" href="${escape(target)}"><meta http-equiv="refresh" content="0;url=${escape(target)}"><a href="${escape(target)}">${escape(title)}</a><script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script></html>\n`;
}
export function legacyTagIndex(legacy) {
  return Object.fromEntries(Object.entries(legacy.tags).map(([name, entry]) => [slug(name), { name, ...entry }]));
}
export function buildCompatibility({ write, records, payloads, apiIndex, legacy, config, merges = [] }) {
  const siteUrl = config.siteUrl.replace(/\/$/, "");
  const aliases = new Map(records.flatMap((r) => r.aliases.map((alias) => [alias, r])));
  for (const record of records) {
    const packet = `# ${record.title.text}\n\nStatus: ${record.status}\n\n${siteUrl}/problem/${record.id}/\n\n## Statement (TeX)\n\n\`\`\`tex\n${record.storedRecord.statement}\n\`\`\`\n\n## Source\n\n${record.source.text}\n\n## Progress\n\n${record.progress.map((p) => p.text).join("\n\n")}\n\n## Comment\n\n${record.comment.text}\n\n## References\n\n${record.references.map((r) => r.text).join("\n\n")}\n`;
    for (const alias of record.aliases) {
      write(`problems/${alias}/index.html`, redirect(`../../problem/${record.id}/`, record.title.text));
      write(`api/v1/problems/${alias}.json`, json(payloads.get(record.id)));
      write(`packets/${alias}.md`, packet);
    }
  }
  for (const { record, target, reason } of merges) {
    for (const alias of record.aliases) {
      aliases.set(alias, target);
      write(`problems/${alias}/index.html`, redirect(`${siteUrl}/problem/${target.id}/`, target.title));
      write(`api/v1/problems/${alias}.json`, json({ ...payloads.get(target.id), mergedFrom: { id: record.id, ulid: record.ulid, reason } }));
      write(`packets/${alias}.md`, `# ${target.title}\n\nThis duplicate record was merged into [the canonical question](${siteUrl}/problem/${target.id}/).\n\n[Read the current Markdown packet](${siteUrl}/packets/${target.id}.md).\n`);
    }
  }
  for (const [id, entry] of Object.entries(legacy.problems)) {
    if (aliases.has(id)) continue;
    // An unconfirmed mapping must not send a citation to a different question.
    const notice = { schema: "qiqcop-zoo/archived-entry/1", id, title: entry.title, archived: true, archive: entry.archive, catalog: `${siteUrl}/problems/` };
    write(`api/v1/problems/${id}.json`, json(notice));
    write(`problems/${id}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(entry.title)}</title><link rel="stylesheet" href="../../assets/styles.css"><main class="container"><h1>${escape(entry.title)}</h1><p>This historical entry has not been mapped to the maintained catalog. Its original statement remains available in the repository archive.</p><p><a href="${escape(entry.archive)}">Read the archived record</a></p><p><a href="../">Browse the current catalog</a></p></main></html>\n`);
    write(`packets/${id}.md`, `# ${entry.title}\n\nHistorical entry; no confirmed current mapping.\n\n[Archived source record](${entry.archive})\n`);
  }
  const snapshot = records.map((record) => payloads.get(record.id));
  const digest = createHash("sha256").update(JSON.stringify(snapshot)).digest("hex");
  write("api/v1/index.json", json({ schema: "qiqcop-zoo/index/3", ...apiIndex }));
  write("api/v1/release.json", json({ schema: "qiqcop-zoo/release/1", catalogDigest: `sha256:${digest}`, counts: apiIndex.counts, updated: apiIndex.updated, problemSchema: "qiqcop-zoo/problem/3", migration: `${siteUrl}/api/v1/README.md` }));
  const jsonl = snapshot.map((record) => JSON.stringify(record)).join("\n") + "\n";
  write("api/v1/problems.jsonl", jsonl);
  write("api/v1/problems.jsonl.gz", gzipSync(jsonl));
  write("api/v1/problems.json", JSON.stringify(snapshot) + "\n");
  const feedItems = records.slice().sort((a, b) => b.dates.updatedAt.localeCompare(a.dates.updatedAt)).map((record) => ({
    id: `${siteUrl}/problem/${record.id}/#${record.sha256}`, url: `${siteUrl}/problem/${record.id}/`, title: record.title.text,
    content_text: `${record.status}. ${record.comment.text}`, date_modified: record.dates.updatedAt,
  }));
  write("feed.json", json({ version: "https://jsonfeed.org/version/1.1", title: `${config.shortName}: catalog updates`, home_page_url: `${siteUrl}/`, feed_url: `${siteUrl}/feed.json`, description: "Catalog edit times; these are not scientific-result publication dates.", items: feedItems }));
  write("feed.xml", `<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom"><id>${escape(siteUrl)}/feed.xml</id><title>${escape(config.shortName)}: catalog updates</title><author><name>${escape(config.shortName)}</name></author><link rel="self" href="${escape(siteUrl)}/feed.xml"/><updated>${escape(feedItems[0]?.date_modified ?? `${apiIndex.updated}T00:00:00Z`)}</updated>${feedItems.map((item) => `<entry><id>${escape(item.id)}</id><title>${escape(item.title)}</title><link href="${escape(item.url)}"/><updated>${escape(item.date_modified)}</updated><summary>${escape(item.content_text)}</summary></entry>`).join("")}</feed>\n`);
  write("api/v1/evidence.json", json({ schema: "qiqcop-zoo/evidence/1", dateMeaning: "Catalog edit time, not the date of the scientific result", events: records.flatMap((r) => r.progress.map((item) => ({ problemId: r.id, catalogUpdatedAt: r.dates.updatedAt, ...item }))).sort((a, b) => b.catalogUpdatedAt.localeCompare(a.catalogUpdatedAt)) }));
  write("api/v1/problem.schema.json", json({ $schema: "https://json-schema.org/draft/2020-12/schema", title: "QIQCOP Zoo problem response", type: "object", required: ["schema", "id", "ulid", "status", "statement", "references"], properties: { schema: { const: "qiqcop-zoo/problem/3" }, id: { type: "string" }, ulid: { type: "string" }, status: { enum: ["Solved", "Unsolved"] }, statement: { type: "object" }, references: { type: "array" } } }));
  write("api/v1/contribution.schema.json", json({ $schema: "https://json-schema.org/draft/2020-12/schema", description: "The former static write contract is retired. Submit through the research service POST /api/v1/batches using its published schemas, or contribute catalog JSON by pull request.", not: {} }));
  write("api/v1/README.md", "# Static API compatibility\n\nHistorical problem URLs, JSON lookups, Markdown packets, release polling, snapshots, and the evidence feed are available here. Problem responses now declare `schema: qiqcop-zoo/problem/3`, use permanent op IDs and the binary statuses `Solved` and `Unsolved`, and match `/api/problems/`. Read this schema before migrating an old client; the former v1 payload shape is retired. Unmapped historical entries return `qiqcop-zoo/archived-entry/1` with an archive link rather than an inferred identity. Counts total/unsolved/solved are permanent record counts; counts.distinctQuestions deduplicates explicit equivalence relationships. Evidence timestamps are catalog edit times. The static write contract is retired; its schema rejects payloads and directs authors to the service or catalog PR workflow.\n");
}
