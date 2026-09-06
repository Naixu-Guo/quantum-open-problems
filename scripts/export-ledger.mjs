#!/usr/bin/env node
// Materialize the authored JSON catalog in the main branch ledger format.
// No scientific content is read from an existing ledger.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseRecordText, recordObject } from "../contract/src/record.ts";
import { Ledger, loadRecords } from "../contract/src/ledger.ts";
import { sameClause } from "../contract/src/types/statement.ts";
import { deterministicUlid, metadataSlug, validateRecordIdentities } from "../site/lib/metadata.mjs";
import { validateRecordShape } from "../site/lib/record.mjs";
import { renderRecord, texToHtml } from "../site/lib/tex.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = "ledger/export-manifest.json";
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const unique = (values) => [...new Set(values)];
const decode = (value) => value.replaceAll("&nbsp;", " ").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&amp;", "&");

export function serializeRecord(record) {
  const { body, ...fields } = record;
  // JSON values are valid YAML flow values and preserve the complete source JSON.
  return `---\n${Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join("\n")}\n---\n${body}\n`;
}

export function statementDigest(body) {
  const normalized = body.normalize("NFC").replace(/\r\n?/g, "\n").split("\n").map((line) => line.replace(/[ \t]+$/u, "")).join("\n").replace(/\n+$/u, "") + "\n";
  return `sha256:${createHash("sha256").update(normalized).digest("hex")}`;
}

// The established TeX renderer handles citations, accents, lists and equations.
// Protect mathematics before converting its small HTML vocabulary to Markdown.
export function htmlToMarkdown(html, citationUrls = new Map()) {
  const math = [];
  const hold = (body, display) => {
    const token = `\u0001${math.length}\u0002`;
    // A trailing TeX control space is meaningful. Keep it before a comment
    // marker so Git sees no trailing whitespace and the renderer keeps it.
    const content = body.split("\n").map((line) => {
      const slashRun = line.match(/(\\+)[ \t]+$/)?.[1];
      return slashRun && slashRun.length % 2 === 1 ? `${line}%` : line.replace(/[ \t]+$/u, "");
    }).join("\n").trim();
    math.push(display ? `\n\n$$\n${content}\n$$\n\n` : `$${content}$`);
    return token;
  };
  let text = html.replace(/<div class="equation"[^>]*>([\s\S]*?)<\/div>/g, (_, content) => {
    let body = decode(content).trim().replace(/^\\\[([\s\S]*)\\\]$/, "$1");
    body = body.replace(/^\\begin\{(equation\*?|displaymath)\}([\s\S]*)\\end\{\1\}$/, "$2");
    for (const [from, to] of [["align", "aligned"], ["gather", "gathered"], ["eqnarray", "aligned"], ["alignat", "alignedat"]]) {
      body = body.replace(new RegExp(`\\\\begin\\{${from}\\*?\\}`), `\\begin{${to}}`)
        .replace(new RegExp(`\\\\end\\{${from}\\*?\\}`), `\\end{${to}}`);
    }
    return hold(body, true);
  }).replace(/<span class="math">\\\(([\s\S]*?)\\\)<\/span>/g, (_, body) => hold(decode(body), false));
  text = text.replace(/<a\b([^>]*)href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, attributes, href, label) => {
    if (attributes.includes('class="eqref"')) return label;
    const target = citationUrls.get(decode(href)) ?? decode(href);
    const labelText = label.replace(/^\[|\]$/g, "");
    return `[${labelText}](${target.replace(/[()]/g, (char) => `\\${char}`)})`;
  }).replace(/<(em|strong)>([\s\S]*?)<\/\1>/g, (_, tag, body) => tag === "em" ? `*${body}*` : `**${body}**`)
    .replace(/<code>([\s\S]*?)<\/code>/g, "`$1`")
    .replace(/<li(?: [^>]*)?>/g, "\n- ").replace(/<\/(?:p|li|div|ul|ol|dl|dt|dd)>/g, "\n\n")
    .replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "");
  text = decode(text).replace(/[ \t]+/g, " ").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  return text.replace(/\u0001(\d+)\u0002/g, (_, index) => math[Number(index)]).replace(/\n{3,}/g, "\n\n").trim();
}

function sourceInfo(reference) {
  const links = reference.links.filter((link) => /^https?:\/\/\S+$/.test(link.url));
  const doi = links.find((link) => link.kind === "doi")?.id ?? reference.tex.match(/\b(10\.\d{4,}\/[^\s{};,]+)(?=[\s{};,]|$)/)?.[1] ?? null;
  const arxivLink = links.find((link) => link.kind === "arxiv");
  const arxiv = arxivLink?.url.match(/\/abs\/(.+)$/)?.[1] ?? reference.tex.match(/arXiv:\s*((?:\d{4}\.\d{4,5}|[a-z-]+\/\d{7})(?:v\d+)?)/i)?.[1] ?? null;
  const version = arxiv?.match(/v(\d+)$/)?.[1] ?? null;
  const arxivId = arxiv?.replace(/v\d+$/, "") ?? null;
  const url = doi ? `https://doi.org/${doi}` : arxivId ? `https://arxiv.org/abs/${arxivId}${version ? `v${version}` : ""}` : links[0]?.url ?? null;
  const plain = reference.text;
  const title = plain.match(/“([^”]+)”/)?.[1]?.replace(/[,.;]$/, "") ?? plain;
  const date = plain.match(/\((1[89]\d{2}|20\d{2})\)/)?.[1] ?? null;
  // Match DOI first, then exact arXiv version, then URL, then the contract fallback.
  const keys = [doi && `doi:${doi.toLowerCase()}`, arxivId && `arxiv:${arxivId.toLowerCase()}${version ? `v${version}` : ""}`,
    ...links.filter((link) => link.kind === "url").map((link) => `url:${link.url.replace(/\/+$/u, "").toLowerCase()}`)].filter(Boolean);
  if (!keys.length) keys.push(`text:${title.toLowerCase().replace(/[^a-z0-9]/gu, "")}||${date ?? ""}`);
  return { title, kind: doi ? "paper" : arxivId ? "preprint" : "web-record", completeness: "partial", authors: [], venue: "", date, doi, arxivId, url, version, keys };
}

export function buildLedger(root = ROOT) {
  const database = path.join(root, "database");
  const metadata = readJson(path.join(database, "metadata.json"));
  const taxonomy = readJson(path.join(database, "tags.json"));
  const actors = readJson(path.join(database, "actors.json")).actors;
  const records = fs.readdirSync(path.join(database, "problems_json")).filter((name) => name.endsWith(".json")).sort().map((name) => {
    const record = readJson(path.join(database, "problems_json", name));
    if (name !== `${record.id}.json`) throw new Error(`${name}: problem ID differs from filename`);
    validateRecordShape(record, name);
    return record;
  });
  if (!records.length) throw new Error("Refusing to export an empty database");
  validateRecordIdentities(records);
  const rendered = new Map(records.map((record) => [record.id, renderRecord(record)]));
  const serviceSources = fs.existsSync(path.join(root, "ledger")) && fs.existsSync(path.join(root, "activity"))
    ? [...new Ledger(loadRecords([path.join(root, "ledger"), path.join(root, "activity")]).records).current.values()].filter((record) => record.type === "Source" && !record.redacted) : [];
  const files = new Map();
  const counts = {};
  const put = (relative, record) => {
    if (files.has(relative)) throw new Error(`Duplicate export path ${relative}`);
    files.set(relative, serializeRecord(record));
    counts[record.type] = (counts[record.type] ?? 0) + 1;
  };
  const base = (key) => ({ id: deterministicUlid(`ledger:${key}`, metadata.migrationTimestamp), schemaVersion: "1.0", revision: 1, createdBy: metadata.actorId, createdAt: metadata.migrationTimestamp });
  for (const actor of actors) put(`ledger/actors/${actor.id}.r1.md`, { ...actor, revision: 1 });
  put("ledger/taxonomy.r1.md", {
    ...base("taxonomy"), type: "Taxonomy", independentTopics: true,
    areas: taxonomy.fields.map((label) => ({ id: metadataSlug(label), label, description: "" })),
    topics: taxonomy.topics.map((label) => ({ id: metadataSlug(label), label, areaId: null })),
    body: "Fields and topics are independent classifications, preserved from the authored database/tags.json registry."
  });

  const groups = new Set();
  const byKey = new Map();
  const referenceGroups = new Map();
  for (const record of records) for (const reference of rendered.get(record.id).references) {
    const info = sourceInfo(reference);
    const matches = unique(info.keys.map((key) => byKey.get(key)).filter(Boolean));
    const group = matches[0] ?? { entries: [], keys: new Set() };
    for (const other of matches.slice(1)) {
      group.entries.push(...other.entries);
      for (const key of other.keys) { group.keys.add(key); byKey.set(key, group); }
      for (const entry of other.entries) referenceGroups.set(entry.key, group);
      groups.delete(other);
    }
    const key = `${record.id}:${reference.label}`;
    group.entries.push({ key, info, reference });
    for (const key of info.keys) { group.keys.add(key); byKey.set(key, group); }
    referenceGroups.set(key, group);
    groups.add(group);
  }
  for (const group of groups) {
    const best = group.entries.find(({ info }) => info.doi) ?? group.entries.find(({ info }) => info.arxivId) ?? group.entries[0];
    const { keys, ...info } = best.info;
    const identity = [...group.keys].sort((a, b) => {
      const rank = (key) => key.startsWith("doi:") ? 0 : key.startsWith("arxiv:") ? 1 : key.startsWith("url:") ? 2 : 3;
      return rank(a) - rank(b) || a.localeCompare(b);
    })[0];
    const source = { ...base(`source:${identity}`), type: "Source", ...info,
      body: unique(group.entries.map(({ reference }) => htmlToMarkdown(texToHtml(reference.tex)))).join("\n\n") };
    const existingSource = serviceSources.find(({ fields }) =>
      (source.doi && String(fields.doi).toLowerCase() === source.doi.toLowerCase()) ||
      (source.arxivId && fields.arxivId === source.arxivId && fields.version === source.version) ||
      (source.url && fields.url === source.url));
    if (existingSource) source.id = existingSource.id;
    group.source = source;
    put(`ledger/sources/${source.id}.r1.md`, source);
  }
  for (const record of records) {
    const display = rendered.get(record.id);
    const dir = `ledger/problems/${metadataSlug(record.id)}`;
    const citations = new Map(display.references.map((reference) => [`#${reference.anchor}`, referenceGroups.get(`${record.id}:${reference.label}`).source.url ?? `references/${base(`reference:${record.id}:${reference.label}`).id}.r1.md`]));
    const markdown = (html) => htmlToMarkdown(html, citations);
    const body = ["## Source", markdown(display.source.html), "## Progress", ...display.progress.map((item) => markdown(item.html)), "## Comment", markdown(display.comment.html), "## References",
      ...display.references.map((reference) => `**${reference.key}** ${htmlToMarkdown(texToHtml(reference.tex))}`)].join("\n\n");
    put(`${dir}/problem.r1.md`, {
      id: record.ulid, ...record.metadata, revision: 1, title: record.title,
      aliases: unique([metadataSlug(record.id), ...record.aliases]),
      authoredCatalog: { status: record.status, sourcePath: `database/problems_json/${record.id}.json`, record }, body
    });
    const statementBody = markdown(display.statement.html);
    const statement = {
      ...base(`statement:${record.ulid}:v1`), type: "Statement", supersedes: null,
      problemId: record.ulid, version: 1, digest: statementDigest(statementBody),
      clauses: [{ id: "main", label: "Problem", text: record.statement, kind: "decision", resolutionCriteria: "Resolve the authored problem statement as stated.", supersedesClauseId: null, quantity: null }], body: statementBody
    };
    delete statement.revision;
    put(`${dir}/statements/v1.md`, statement);
    const sourceLabels = new Set(display.source.citations.map((citation) => citation.label));
    for (const reference of display.references) {
      const source = referenceGroups.get(`${record.id}:${reference.label}`).source;
      const projected = {
        ...base(`reference:${record.id}:${reference.label}`), type: "Reference", sourceId: source.id,
        targetType: "problem", targetId: record.ulid, role: sourceLabels.has(reference.label) ? "states-problem" : "related",
        locator: reference.key, body: htmlToMarkdown(texToHtml(reference.tex))
      };
      put(`${dir}/references/${projected.id}.r1.md`, projected);
    }
  }
  files.set("ledger/README.md", "# Ledger\n\nThis ledger is generated from the authoritative records in `database/problems_json` by `scripts/export-ledger.mjs`. Each Problem retains the full source JSON in `authoredCatalog.record`, including extra keys and the original TeX. The catalog has exactly two authored statuses: Solved and Unsolved. Publication reflects the existing authored catalog; it does not assert a review or a verification result.\n\nProblem ULIDs, original `op_` IDs, and existing aliases remain usable. The first alias is the stable folder slug. Fields and topics retain independent membership. Bibliographic metadata is partial; full bibliography text is preserved. No scientific reviews, decisions, claims, or trajectories are generated.\n\nRun `npm run export-ledger` after changing JSON records, and `npm run check-ledger` to check for drift. Normal exports append immutable revisions and statement versions, preserve service activity, and validate the combined ledger before writing. Bibliography removal appends retirement records; it never deletes historical citations. Conflicting service edits require explicit reconciliation. The manifest pins exported history, counts all exported record files separately from active projections, and records the last changed export time. `--replace-authoritative` explicitly replaces the ledger and activity roots; use it only when intentionally resetting those derived databases.\n");
  files.set("activity/README.md", "# Activity\n\nThis activity root starts empty after replacing the stale catalog with the authoritative authored database. Future service activity belongs here and is preserved by normal database exports. No historical reviews or research activity are inferred from a problem's authored status.\n");
  files.set(MANIFEST, json({ schema: "qiqcop-zoo/ledger-export/1", source: "database/problems_json", generatedAt: metadata.migrationTimestamp, counts, files: [...files.keys()].sort() }));
  return { files, counts, records };
}

function writeFiles(root, files) {
  for (const [relative, content] of files) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

const hash = (value) => createHash("sha256").update(value).digest("hex");
const fieldHashes = (record) => Object.fromEntries(Object.entries(record).map(([key, value]) => [key, hash(JSON.stringify(value))]));
const parsed = (file, text) => recordObject(parseRecordText(file, text));
const safePath = (file) => typeof file === "string" && /^(ledger|activity)\//.test(file) && !file.split("/").some((part) => ["..", ".", ""].includes(part)) && !file.includes("\\");

// A manifest pins immutable exported files and the last desired value of each
// field. The latter makes reconciliation a three-way merge with service edits.
export async function exportLedger({ root = ROOT, check = false, replaceAuthoritative = false, reconcileCatalog = false, reconcileProblemIds = [] } = {}) {
  if (check && replaceAuthoritative) throw new Error("--check and --replace-authoritative cannot be combined");
  const desired = buildLedger(root);
  const manifestPath = path.join(root, MANIFEST);
  const previous = !replaceAuthoritative && fs.existsSync(manifestPath) ? readJson(manifestPath) : null;
  if (previous && (!["qiqcop-zoo/ledger-export/1", "qiqcop-zoo/ledger-export/2"].includes(previous.schema) || !Array.isArray(previous.files) || previous.files.some((file) => !safePath(file)))) throw new Error("Invalid ledger export manifest");
  if (!previous && !replaceAuthoritative && fs.existsSync(path.join(root, "ledger"))) throw new Error("Existing ledger has no export manifest. An intentional initial replacement requires --replace-authoritative.");
  const existing = previous ? new Ledger(loadRecords([path.join(root, "ledger"), path.join(root, "activity")]).records) : new Ledger([]);
  const owned = { ...(previous?.fileHashes ?? {}) };
  const projections = { ...(previous?.projections ?? {}) };
  const retiredProjections = { ...(previous?.retiredProjections ?? {}) };
  const reconcileIds = new Set(reconcileProblemIds);
  if (previous?.schema === "qiqcop-zoo/ledger-export/1") {
    for (const file of previous.files) {
      if (!file.endsWith(".md") || file.endsWith("README.md")) continue;
      const content = fs.readFileSync(path.join(root, file), "utf8");
      owned[file] = hash(content);
      projections[file] = { path: file, digest: hash(content), fields: fieldHashes(parsed(file, content)) };
    }
  }
  for (const [file, digest] of Object.entries(owned)) {
    if (!safePath(file) || !fs.existsSync(path.join(root, file)) || hash(fs.readFileSync(path.join(root, file))) !== digest) throw new Error(`Export history changed or missing: ${file}. Restore its committed contents before exporting.`);
  }
  const writes = new Map();
  const now = new Date().toISOString();
  const exportActor = readJson(path.join(root, "database/actors.json")).actors.find((actor) => actor.harness === "scripts/export-ledger.mjs" && actor.kind === "system");
  if (!exportActor) throw new Error("Register the catalog exporter system actor in database/actors.json before exporting.");
  for (const [file, content] of desired.files) {
    if (!content.startsWith("---\n")) continue;
    const wanted = parsed(file, content);
    const retired = retiredProjections[file];
    const baseline = projections[file] ?? retired;
    if (!retired && baseline?.digest === hash(content)) continue;
    if (check) throw new Error(`Ledger export drift: ${file}. Run npm run export-ledger.`);
    let destination = file;
    let next = { ...wanted };
    const current = wanted.type === "Statement"
      ? existing.currentOf("Statement").filter((record) => record.fields.problemId === wanted.problemId).sort((a, b) => b.fields.version - a.fields.version)[0]
      : existing.current.get(wanted.id);
    const owner = wanted.type === "Statement" ? wanted.problemId : wanted.type === "Reference" && wanted.targetType === "problem" ? wanted.targetId : null;
    if (current?.redacted || existing.current.get(wanted.id)?.redacted || existing.current.get(owner)?.redacted) throw new Error(`Refusing to restore redacted catalog content: ${file}. Resolve the takedown explicitly before exporting.`);
    const canReconcile = reconcileCatalog || reconcileIds.has(wanted.type === "Problem" ? wanted.id : owner);
    if (!current && owner && existing.problemDir(owner)) destination = file.replace(/^ledger\/problems\/[^/]+/, `ledger/${existing.problemDir(owner)}`);
    if (current) {
      const latest = recordObject(current);
      if (wanted.type === "Statement") {
        if (!baseline && !canReconcile) throw new Error(`Existing service identity ${wanted.id} needs an explicit catalog handoff.`);
        if (baseline && current.path !== path.join(root, baseline.path) && !canReconcile) throw new Error(`A service statement supersedes ${baseline.path}. Review it before using --reconcile-catalog.`);
        const version = latest.version + 1;
        // A changed statement does not inherit old resolution claims. Only a
        // byte-equivalent formulation can continue the old clause lineage.
        next = { ...wanted, id: deterministicUlid(`statement:${wanted.problemId}:v${version}:${hash(content)}`, now), version, supersedes: latest.id, createdAt: now,
          clauses: wanted.clauses.map((clause) => ({ ...clause, supersedesClauseId: latest.clauses.some((old) => sameClause(old, clause)) ? `${latest.id}#${clause.id}` : null })) };
        destination = path.relative(root, current.path).split(path.sep).join("/").replace(/v\d+\.md$/, `v${version}.md`);
      } else {
        next = { ...latest };
        for (const [key, value] of Object.entries(wanted)) {
          if (["revision", "createdAt", "createdBy"].includes(key)) continue;
          const before = baseline?.fields[key];
          const incoming = hash(JSON.stringify(value));
          const present = latest[key] === undefined ? undefined : hash(JSON.stringify(latest[key]));
          if (before === incoming) continue;
          if ((before === undefined ? present !== incoming : present !== before && present !== incoming) && !canReconcile) throw new Error(`Catalog/service conflict at ${file}: ${key}. Reconcile the source or review --reconcile-catalog.`);
          next[key] = value;
        }
        // Alias order controls on-disk layout. Keep the service's primary alias
        // and retain every public identity during an explicit handoff.
        if (wanted.type === "Problem") next.aliases = unique([...(latest.aliases ?? []), ...wanted.aliases]);
        if (retired) delete next.retired;
        // Adopting identical service data only records the projection baseline.
        // It must not manufacture a revision or an incremental event.
        if (JSON.stringify(next) === JSON.stringify(latest)) {
          projections[file] = { path: path.relative(root, current.path).split(path.sep).join("/"), digest: hash(content), fields: fieldHashes(wanted) };
          delete retiredProjections[file];
          continue;
        }
        next.revision = latest.revision + 1;
        next.createdAt = now;
        next.createdBy = exportActor.id;
        destination = path.relative(root, current.path).split(path.sep).join("/").replace(/\.r\d+\.md$/, `.r${next.revision}.md`);
      }
    }
    // The deterministic desired projection is a comparison baseline, not a
    // creation event. New records describe this export, never the migration.
    if (wanted.type !== "Actor") {
      next.createdAt = now;
      next.createdBy = exportActor.id;
    }
    if (fs.existsSync(path.join(root, destination)) && !replaceAuthoritative) throw new Error(`Refusing to overwrite existing record ${destination}`);
    const exported = serializeRecord(next);
    writes.set(destination, exported);
    owned[destination] = hash(exported);
    projections[file] = { path: destination, digest: hash(content), fields: fieldHashes(wanted) };
    delete retiredProjections[file];
  }
  const removed = Object.keys(projections).filter((file) => !desired.files.has(file));
  for (const file of removed) {
    const baseline = projections[file];
    const prior = parsed(baseline.path, fs.readFileSync(path.join(root, baseline.path), "utf8"));
    if (!["Reference", "Source"].includes(prior.type)) throw new Error(`Exported entity disappeared from the catalog: ${file}. Preserve its identity.`);
    if (check) throw new Error(`Ledger export drift: ${file} needs retirement. Run npm run export-ledger.`);
    const current = existing.current.get(prior.id);
    if (!current || current.redacted) throw new Error(`Cannot retire missing or redacted catalog entity ${prior.id}.`);
    const latest = recordObject(current);
    const canReconcile = reconcileCatalog || (prior.type === "Reference" && reconcileIds.has(prior.targetId));
    if (current.path !== path.join(root, baseline.path) && !canReconcile) throw new Error(`Catalog/service conflict at ${file}: retirement would discard service edits.`);
    if (!latest.retired) {
      const next = { ...latest, retired: true, revision: latest.revision + 1, createdAt: now, createdBy: exportActor.id };
      const destination = path.relative(root, current.path).split(path.sep).join("/").replace(/\.r\d+\.md$/, `.r${next.revision}.md`);
      const exported = serializeRecord(next);
      writes.set(destination, exported);
      owned[destination] = hash(exported);
      baseline.path = destination;
    }
    retiredProjections[file] = baseline;
    delete projections[file];
  }
  const counts = {};
  for (const file of Object.keys(owned)) {
    const { type } = parsed(file, writes.get(file) ?? fs.readFileSync(path.join(root, file), "utf8"));
    counts[type] = (counts[type] ?? 0) + 1;
  }
  for (const file of ["ledger/README.md", "activity/README.md"]) {
    if (!fs.existsSync(path.join(root, file)) || fs.readFileSync(path.join(root, file), "utf8") !== desired.files.get(file)) writes.set(file, desired.files.get(file));
  }
  const manifest = { schema: "qiqcop-zoo/ledger-export/2", source: "database/problems_json", generatedAt: previous?.generatedAt ?? now,
    migrationTimestamp: readJson(path.join(root, "database/metadata.json")).migrationTimestamp,
    counts, projectionCounts: desired.counts, files: [...Object.keys(owned), "ledger/README.md", "activity/README.md"].sort(), fileHashes: owned, projections, ...(Object.keys(retiredProjections).length ? { retiredProjections } : {}) };
  const manifestChanged = !fs.existsSync(manifestPath) || fs.readFileSync(manifestPath, "utf8") !== json(manifest) || writes.size > 0;
  if (check) {
    if (manifestChanged) throw new Error("Ledger export drift: export manifest needs migration. Run npm run export-ledger.");
    return { counts: desired.counts, changed: 0 };
  }
  if (manifestChanged) { manifest.generatedAt = now; writes.set(MANIFEST, json(manifest)); }
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), "qop-ledger-export-"));
  try {
    for (const dir of ["ledger", "activity"]) {
      const current = path.join(root, dir);
      if (!replaceAuthoritative && fs.existsSync(current)) fs.cpSync(current, path.join(stage, dir), { recursive: true });
      else fs.mkdirSync(path.join(stage, dir), { recursive: true });
    }
    writeFiles(stage, writes);
    const { validateLedger } = await import("../contract/src/validate.ts");
    const { issues } = validateLedger([path.join(stage, "ledger"), path.join(stage, "activity")]);
    if (issues.length) throw new Error(`Generated ledger failed validation:\n${issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n")}`);
    if (replaceAuthoritative) for (const dir of ["ledger", "activity"]) fs.rmSync(path.join(root, dir), { recursive: true, force: true });
    // Stage validation precedes every write. Roll back partial filesystem writes
    // so an I/O error cannot leave a new revision without its manifest.
    const backups = new Map([...writes.keys()].map((file) => [file, fs.existsSync(path.join(root, file)) ? fs.readFileSync(path.join(root, file)) : null]));
    const applied = [];
    try {
      for (const [file, content] of writes) {
        const target = path.join(root, file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        // Exclusive creation also protects a revision added by a concurrent
        // service write after the staging check.
        fs.writeFileSync(target, content, { flag: content.startsWith("---\n") ? "wx" : "w" });
        applied.push(file);
      }
    }
    catch (error) {
      for (const file of applied.reverse()) {
        const before = backups.get(file);
        if (before === null) fs.rmSync(path.join(root, file), { force: true });
        else fs.writeFileSync(path.join(root, file), before);
      }
      throw error;
    }
    return { counts: desired.counts, changed: writes.size };
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = {};
  try {
    for (let i = 2; i < process.argv.length; i += 1) {
      const argument = process.argv[i];
      if (argument === "--check") options.check = true;
      else if (argument === "--reconcile-catalog") options.reconcileCatalog = true;
      else if (argument === "--replace-authoritative") options.replaceAuthoritative = true;
      else if (argument === "--root" && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) options.root = path.resolve(process.argv[++i]);
      else if (argument === "--help") { console.log("Usage: node --experimental-strip-types scripts/export-ledger.mjs [--check | --replace-authoritative] [--reconcile-catalog] [--root DIR]"); process.exit(0); }
      else throw new Error(`Unknown or incomplete option: ${argument}`);
    }
    const result = await exportLedger(options);
    console.log(`${options.check ? "Checked" : "Exported"} ${result.counts.Problem} authored problems, ${result.counts.Statement} statements, ${result.counts.Source} sources, ${result.counts.Reference} references; ${result.changed} changed file(s).`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
