import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { normalizeArchivalLink, normalizeHistoricalLink } from "../shared/progress-sources.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const canonical = (text) => String(text).replace(/\s+/gu, " ").trim();
const noReport = new Set(["No progress has been reported.", "No reported progress."]);

function citedReferences(item, record) {
  const labels = [...item.matchAll(/\\sourcecite\{([^}]+)\}\{[^}]+\}/gu)].map((match) => match[1]);
  return (record.references ?? []).filter((reference) => labels.includes(reference.label)).map((reference) => reference.tex).join("\n");
}

export function archivalLinksIn(text) {
  const candidates = [...String(text).matchAll(/https?:\/\/[^\s{}<>"\\]+/gu)].map((match) => match[0]);
  const links = new Set();
  for (const candidate of candidates) {
    try { links.add(normalizeArchivalLink(candidate).url); } catch { /* Supplementary links do not satisfy the requirement. */ }
  }
  return [...links];
}

/** Validate new or changed documentary entries; mathematical relevance remains a human documentation check. */
export function checkRecordProgress(record, previous, historicalEntries = []) {
  const problems = [];
  for (const [index, item] of record.progress.entries()) {
    const oldItem = previous?.progress.find((old) => canonical(old) === canonical(item));
    if (oldItem && citedReferences(oldItem, previous) === citedReferences(item, record)) continue;
    if (noReport.has(item.trim())) continue;
    const historical = historicalEntries.some((entry) => entry.problemId === record.id && canonical(entry.text) === canonical(item));
    if (historical) continue;
    if (!archivalLinksIn(`${item}\n${citedReferences(item, record)}`).length) {
      problems.push(`${record.id} progress item ${index + 1}: new research needs an archival manuscript or paper link in the item or its cited reference; historical text must match its dated inventory.`);
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

export function checkHistoricalCoverage(entries, readRecord) {
  const problems = [];
  for (const entry of entries) {
    const record = readRecord(entry.problemId);
    if (!record?.progress.some((text) => canonical(text) === canonical(entry.text))) problems.push(`${entry.problemId}: documented historical entry or original links are missing from Progress.`);
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
  const entries = audits.flatMap((name) => historicalEntriesFrom(JSON.parse(fs.readFileSync(path.join(root, "docs/audits", name), "utf8"))));
  const read = (id) => {
    const filename = path.join(root, "database/problems_json", `${id}.json`);
    return fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : null;
  };
  const problems = checkHistoricalCoverage(entries, read);
  for (const filename of changed) {
    let previous = null;
    try { previous = JSON.parse(git("show", `${baseHash}:${filename}`)); } catch { /* New catalog record. */ }
    problems.push(...checkRecordProgress(JSON.parse(fs.readFileSync(path.join(root, filename), "utf8")), previous, entries));
  }
  if (problems.length) throw new Error(problems.join("\n"));
  console.log(`Progress sources checked in ${changed.size} changed records; ${entries.length} historical entries retain their original links. No mathematical assessment or status change performed.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
