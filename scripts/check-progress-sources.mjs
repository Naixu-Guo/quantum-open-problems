import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { normalizeArchivalLink, normalizeHistoricalLink } from "../shared/progress-sources.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonical = (text) => String(text).replace(/\s+/gu, " ").trim();
const textHash = (text) => createHash("sha256").update(canonical(text)).digest("hex");
const noReport = new Set(["No progress has been reported.", "No reported progress."]);
const urlsIn = (text) => [...String(text).matchAll(/https?:\/\/[^\s{}<>"\\]+/gu)].map((match) => match[0]);

function citedReferences(item, record) {
  const labels = [...item.matchAll(/\\sourcecite\{([^}]+)\}\{[^}]+\}/gu)].map((match) => match[1]);
  return (record.references ?? []).filter((reference) => labels.includes(reference.label)).map((reference) => reference.tex).join("\n");
}

export function archivalLinksIn(text) {
  const links = new Set();
  for (const candidate of urlsIn(text)) {
    try { links.add(normalizeArchivalLink(candidate).url); } catch { /* Supplementary links do not satisfy the requirement. */ }
  }
  return [...links];
}

/** Catalog-only exceptions are explicit policy changes, never archival classifications. */
export function catalogExceptionsFrom(inventory) {
  if (inventory.schema !== "qiqcop-zoo/catalog-source-exceptions/1" || !Array.isArray(inventory.records)) throw new Error("Invalid catalog source exception schema.");
  const hash = /^[a-f0-9]{64}$/u;
  const httpsUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !url.username && !url.password && !url.port && !url.search && !url.hash && url.href === value;
    } catch { return false; }
  };
  const date = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/u.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  const entries = [];
  const seen = new Set();
  for (const source of inventory.records) {
    if (typeof source.title !== "string" || !source.title.trim() || !httpsUrl(source.sourceUrl) || !httpsUrl(source.provenanceUrl) || !date(source.documentDate) || !date(source.retrievedOn) || source.documentDate > source.retrievedOn || !hash.test(source.documentSha256) || typeof source.reason !== "string" || !source.reason.trim() || !Array.isArray(source.progressEntries) || !source.progressEntries.length) {
      throw new Error("Catalog source exceptions require a title, exact HTTPS source and provenance URLs, dated document fingerprint, reason, and scoped entries.");
    }
    for (const entry of source.progressEntries) {
      if (!/^op_[a-f0-9]{16}$/u.test(entry.problemId) || !hash.test(entry.progressSha256) || !hash.test(entry.referencesSha256)) throw new Error("Catalog source exceptions must bind a problem, progress text, and cited references.");
      const key = `${entry.problemId}:${entry.progressSha256}`;
      if (seen.has(key)) throw new Error("Duplicate catalog source exception scope.");
      seen.add(key);
      entries.push({ ...entry, sourceUrl: source.sourceUrl });
    }
  }
  return entries;
}

function matchesCatalogException(record, item, entry) {
  const references = citedReferences(item, record);
  return record.id === entry.problemId && textHash(item) === entry.progressSha256 && textHash(references) === entry.referencesSha256 && urlsIn(`${item}\n${references}`).includes(entry.sourceUrl);
}

/** Check every exception, including unchanged records, so stale scopes cannot pass silently. */
export function checkCatalogExceptionCoverage(entries, readRecord) {
  const problems = [];
  for (const entry of entries) {
    const record = readRecord(entry.problemId);
    if (!record?.progress.some((item) => matchesCatalogException(record, item, entry))) problems.push(`${entry.problemId}: catalog source exception no longer matches its progress text, cited references, or exact source URL; review or retire the exception.`);
  }
  return problems;
}

/** Validate new or changed documentary entries; mathematical relevance remains a human documentation check. */
export function checkRecordProgress(record, previous, historicalEntries = [], catalogExceptions = []) {
  const problems = [];
  for (const [index, item] of record.progress.entries()) {
    const oldItem = previous?.progress.find((old) => canonical(old) === canonical(item));
    if (oldItem && citedReferences(oldItem, previous) === citedReferences(item, record)) continue;
    if (noReport.has(item.trim())) continue;
    const historical = historicalEntries.some((entry) => entry.problemId === record.id && canonical(entry.text) === canonical(item));
    if (historical) continue;
    if (catalogExceptions.some((entry) => matchesCatalogException(record, item, entry))) continue;
    if (!archivalLinksIn(`${item}\n${citedReferences(item, record)}`).length) {
      problems.push(`${record.id} progress item ${index + 1}: new research needs an archival manuscript or paper link in the item or its cited reference, or an exact documented catalog source exception; historical text must match its dated inventory.`);
    }
  }
  return problems;
}

export function historicalEntriesFrom(audit) {
  if (audit.schema !== "qiqcop-zoo/github-progress-audit/1" || !Array.isArray(audit.records)) throw new Error("Invalid historical progress inventory schema.");
  const cutoff = Date.parse(audit.cutoffAt);
  const snapshot = Date.parse(audit.snapshotAt);
  if (!Number.isFinite(cutoff) || !Number.isFinite(snapshot) || cutoff > snapshot) throw new Error("Historical inventory requires a valid cutoff and snapshot.");
  const entries = [];
  for (const report of audit.records) {
    const checkVersion = (version, deadline, description) => {
      const created = Date.parse(version.createdAt);
      const updated = Date.parse(version.updatedAt);
      if (!Number.isFinite(created) || !Number.isFinite(updated) || created > updated || updated > deadline || !/^[a-f0-9]{64}$/u.test(version.bodySha256)) throw new Error(`${description} lacks eligible dated content-version provenance.`);
    };
    checkVersion(report, snapshot, `Report ${report.number}`);
    if (report.progressEntries?.length) checkVersion(report, cutoff, `Historical report ${report.number}`);
    const original = normalizeHistoricalLink(report.url);
    const comments = new Map();
    for (const comment of report.comments ?? []) {
      checkVersion(comment, snapshot, `Comment on report ${report.number}`);
      comments.set(normalizeHistoricalLink(comment.url), comment);
    }
    const knownUrls = new Set([original, ...comments.keys()]);
    for (const entry of report.progressEntries ?? []) {
      if (!report.mappedProblemIds.includes(entry.problemId) || typeof entry.text !== "string" || !Array.isArray(entry.requiredSourceUrls) || !entry.requiredSourceUrls.includes(original)) throw new Error(`Invalid historical mapping for report ${report.number}.`);
      if (!entry.requiredSourceUrls.every((url) => knownUrls.has(normalizeHistoricalLink(url)) && entry.text.includes(url))) throw new Error(`Historical report ${report.number} must retain its original direct links.`);
      for (const url of entry.requiredSourceUrls) {
        const comment = comments.get(normalizeHistoricalLink(url));
        if (comment) checkVersion(comment, cutoff, `Historical comment on report ${report.number}`);
      }
      entries.push(entry);
    }
  }
  return entries;
}

export function checkHistoricalCoverage(entries, readRecord, excludedEntries = []) {
  const problems = [];
  for (const entry of entries) {
    const record = readRecord(entry.problemId);
    if (!record?.progress.some((text) => canonical(text) === canonical(entry.text))) problems.push(`${entry.problemId}: documented historical entry or original links are missing from Progress.`);
  }
  for (const entry of excludedEntries) {
    const record = readRecord(entry.problemId);
    if (record?.progress.some((text) => canonical(text) === canonical(entry.text))) problems.push(`${entry.problemId}: internal GitHub review or catalog work must not be imported as research progress.`);
  }
  return problems;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== "--base")) throw new Error("Usage: node scripts/check-progress-sources.mjs [--base <commit-or-branch>]");
  const base = args[1] ?? "origin/main";
  const git = (...argv) => execFileSync("git", argv, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const baseHash = git("rev-parse", "--verify", "--end-of-options", `${base}^{commit}`);
  const changed = new Set([
    ...git("diff", "--name-only", "--diff-filter=AM", baseHash, "--", "database/problems_json").split("\n"),
    ...git("ls-files", "--others", "--exclude-standard", "--", "database/problems_json").split("\n"),
  ].filter((name) => /^database\/problems_json\/op_[a-zA-Z0-9]{16}\.json$/u.test(name)));
  const audits = fs.readdirSync(path.join(root, "docs/audits")).filter((name) => /^github-progress-\d{4}-\d{2}-\d{2}\.json$/u.test(name));
  const inventories = audits.map((name) => JSON.parse(fs.readFileSync(path.join(root, "docs/audits", name), "utf8")));
  const entries = inventories.flatMap(historicalEntriesFrom);
  const excludedEntries = inventories.flatMap((audit) => audit.records.flatMap((report) => report.excludedProgressEntries ?? []));
  const catalogExceptions = catalogExceptionsFrom(JSON.parse(fs.readFileSync(path.join(root, "docs/audits/catalog-source-exceptions.json"), "utf8")));
  const read = (id) => {
    const filename = path.join(root, "database/problems_json", `${id}.json`);
    return fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : null;
  };
  const problems = [...checkHistoricalCoverage(entries, read, excludedEntries), ...checkCatalogExceptionCoverage(catalogExceptions, read)];
  for (const filename of changed) {
    let previous = null;
    try { previous = JSON.parse(git("show", `${baseHash}:${filename}`)); } catch { /* New catalog record. */ }
    problems.push(...checkRecordProgress(JSON.parse(fs.readFileSync(path.join(root, filename), "utf8")), previous, entries, catalogExceptions));
  }
  if (problems.length) throw new Error(problems.join("\n"));
  console.log(`Progress sources checked in ${changed.size} changed records; ${entries.length} historical entries retain their original links; ${catalogExceptions.length} scoped catalog source exceptions checked. No mathematical assessment or status change performed.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
