#!/usr/bin/env node
// Materialize the authored JSON catalog in the main branch ledger format.
// No scientific content is read from an existing ledger.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
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
  files.set("ledger/README.md", "# Ledger\n\nThis ledger is generated from the authoritative records in `database/problems_json` by `scripts/export-ledger.mjs`. Each Problem retains the full source JSON in `authoredCatalog.record`, including extra keys and the original TeX. The catalog has exactly two authored statuses: Solved and Unsolved. Publication reflects the existing authored catalog; it does not assert a review or a verification result.\n\nProblem ULIDs, original `op_` IDs, and existing aliases remain usable. The first alias is the stable folder slug. Fields and topics retain independent membership. Bibliographic metadata is partial; full bibliography text is preserved. No scientific reviews, decisions, claims, or trajectories are generated.\n\nRun `npm run export-ledger` after changing JSON records, and `npm run check-ledger` to check for drift. Normal exports preserve records not owned by the export manifest and validate the combined ledger before writing. `--replace-authoritative` explicitly replaces the ledger and activity roots; use it only when intentionally resetting those derived databases.\n");
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

export async function exportLedger({ root = ROOT, check = false, replaceAuthoritative = false } = {}) {
  if (check && replaceAuthoritative) throw new Error("--check and --replace-authoritative cannot be combined");
  const { files, counts } = buildLedger(root);
  const manifestPath = path.join(root, MANIFEST);
  const previous = fs.existsSync(manifestPath) ? readJson(manifestPath) : null;
  if (previous && (previous.schema !== "qiqcop-zoo/ledger-export/1" || !Array.isArray(previous.files) || previous.files.some((file) => !/^(ledger|activity)\//.test(file) || file.split("/").includes("..")))) throw new Error("Invalid ledger export manifest");
  const stale = (previous?.files ?? []).filter((file) => !files.has(file));
  const changed = [...files].filter(([file, content]) => !fs.existsSync(path.join(root, file)) || fs.readFileSync(path.join(root, file), "utf8") !== content);
  if (check) {
    if (changed.length || stale.length) throw new Error(`Ledger export drift: ${changed.length} changed or missing file(s), ${stale.length} obsolete export(s). Run npm run export-ledger.`);
    return { counts, changed: 0 };
  }
  if (!previous && !replaceAuthoritative && fs.existsSync(path.join(root, "ledger"))) throw new Error("Existing ledger has no export manifest. An intentional initial replacement requires --replace-authoritative.");
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), "qop-ledger-export-"));
  try {
    for (const dir of ["ledger", "activity"]) {
      const current = path.join(root, dir);
      if (!replaceAuthoritative && fs.existsSync(current)) fs.cpSync(current, path.join(stage, dir), { recursive: true });
      else fs.mkdirSync(path.join(stage, dir), { recursive: true });
    }
    for (const file of stale) fs.rmSync(path.join(stage, file), { force: true });
    writeFiles(stage, files);
    const { validateLedger } = await import("../contract/src/validate.ts");
    if (!replaceAuthoritative && changed.length) {
      // Reviewed revisions and service activity are not export-owned. Do not
      // silently change an identity or formulation they already depend on.
      const { loadRecords } = await import("../contract/src/ledger.ts");
      const existing = loadRecords([path.join(root, "ledger"), path.join(root, "activity")]).records;
      const changedPaths = new Set([...changed.map(([file]) => file), ...stale]);
      const owned = new Set(previous?.files ?? []);
      const relative = (record) => path.relative(root, record.path).split(path.sep).join("/");
      const changingIds = new Set(existing.filter((record) => changedPaths.has(relative(record))).map((record) => record.id));
      const dependsOn = (value) => {
        if (typeof value === "string") return changingIds.has(value) || changingIds.has(value.split("#")[0]);
        if (Array.isArray(value)) return value.some(dependsOn);
        return value !== null && typeof value === "object" && Object.values(value).some(dependsOn);
      };
      const dependent = existing.find((record) => !owned.has(relative(record)) && dependsOn(record.fields));
      if (dependent) throw new Error(`Refusing to overwrite exported records referenced by ${relative(dependent)}. Reconcile the existing ledger history before exporting; --replace-authoritative explicitly resets that history.`);
    }
    const { issues } = validateLedger([path.join(stage, "ledger"), path.join(stage, "activity")]);
    if (issues.length) throw new Error(`Generated ledger failed validation:\n${issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n")}`);
    if (replaceAuthoritative) {
      for (const dir of ["ledger", "activity"]) fs.rmSync(path.join(root, dir), { recursive: true, force: true });
    } else {
      for (const file of stale) fs.rmSync(path.join(root, file), { force: true });
    }
    writeFiles(root, files);
    return { counts, changed: changed.length };
  } finally {
    fs.rmSync(stage, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const options = {};
  try {
    for (let i = 2; i < process.argv.length; i += 1) {
      const argument = process.argv[i];
      if (argument === "--check") options.check = true;
      else if (argument === "--replace-authoritative") options.replaceAuthoritative = true;
      else if (argument === "--root" && process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) options.root = path.resolve(process.argv[++i]);
      else if (argument === "--help") { console.log("Usage: node --experimental-strip-types scripts/export-ledger.mjs [--check | --replace-authoritative] [--root DIR]"); process.exit(0); }
      else throw new Error(`Unknown or incomplete option: ${argument}`);
    }
    const result = await exportLedger(options);
    console.log(`${options.check ? "Checked" : "Exported"} ${result.counts.Problem} authored problems, ${result.counts.Statement} statements, ${result.counts.Source} sources, ${result.counts.Reference} references; ${result.changed} changed file(s).`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
