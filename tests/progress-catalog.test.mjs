import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { archivalLinksIn, checkRecordProgress, historicalEntriesFrom, checkHistoricalCoverage, catalogExceptionsFrom, checkCatalogExceptionCoverage } from "../scripts/check-progress-sources.mjs";
import { normalizeArchivalLink } from "../shared/progress-sources.mjs";
import { texToHtml, renderRecord } from "../site/lib/tex.mjs";
import { renderProblemPage } from "../site/lib/render.mjs";

const record = (progress, references = []) => ({ id: "op_0123456789abcdef", status: "Unsolved", progress, references });
const exceptionInventory = () => JSON.parse(fs.readFileSync(new URL("../docs/audits/catalog-source-exceptions.json", import.meta.url), "utf8"));
const catalogRecord = (id) => JSON.parse(fs.readFileSync(new URL(`../database/problems_json/${id}.json`, import.meta.url), "utf8"));

test("scoped SIC entries pass the catalog exception without treating their PDF as archival", () => {
  const inventory = exceptionInventory();
  const entries = catalogExceptionsFrom(inventory);
  assert.equal(entries.length, 3);
  assert.deepEqual(checkCatalogExceptionCoverage(entries, catalogRecord), []);
  assert.throws(() => normalizeArchivalLink(inventory.records[0].sourceUrl), /eligible archival/);
  for (const entry of entries) {
    const current = catalogRecord(entry.problemId);
    current.progress = [current.progress.at(-1)];
    assert.equal(current.status, "Unsolved");
    assert.match(current.progress[0], /has not yet passed peer review/);
    assert.equal(checkRecordProgress(current, null).length, 1);
    assert.deepEqual(checkRecordProgress(current, null, [], entries), []);
    assert.equal(current.status, "Unsolved");
  }
});

test("a manuscript exception cannot cover other problems, new claims, or a removed qualification", () => {
  const entries = catalogExceptionsFrom(exceptionInventory());
  const current = catalogRecord(entries[0].problemId);
  const item = current.progress.at(-1);
  for (const altered of [
    { ...current, id: "op_0123456789abcdef", progress: [item] },
    { ...current, progress: [`${item} A further theorem is now proved.`] },
    { ...current, progress: [item.replace("The manuscript has not yet passed peer review.", "")] },
  ]) assert.equal(checkRecordProgress(altered, null, [], entries).length, 1);
  assert.equal(checkRecordProgress({ ...current, progress: [item, "An additional result with https://example.com/proof.pdf."] }, null, [], entries).length, 1);
});

test("exception coverage detects changed citations even in otherwise unchanged records", () => {
  const entries = catalogExceptionsFrom(exceptionInventory());
  const altered = catalogRecord(entries[0].problemId);
  const citation = altered.references.find((reference) => reference.key === "SU26");
  citation.tex = citation.tex.replace("stark-reciprocity.pdf", "different-manuscript.pdf");
  const read = (id) => id === altered.id ? altered : catalogRecord(id);
  assert.equal(checkCatalogExceptionCoverage(entries, read).length, 1);
  // An unchanged record normally skips new-progress validation; inventory coverage still catches it.
  assert.deepEqual(checkRecordProgress(altered, altered, [], entries), []);
  altered.progress = [altered.progress.at(-1)];
  assert.equal(checkRecordProgress(altered, null, [], entries).length, 1);
  citation.tex = citation.tex.replace("different-manuscript.pdf", "stark-reciprocity.pdf") + " Additional citation text.";
  assert.equal(checkRecordProgress(altered, null, [], entries).length, 1);
  assert.equal(checkCatalogExceptionCoverage(entries, read).length, 1);
  assert.equal(checkCatalogExceptionCoverage(entries, (id) => id === altered.id ? null : catalogRecord(id)).length, 1);
});

test("exception scopes require the exact document URL and tolerate only whitespace reformatting", () => {
  const inventory = exceptionInventory();
  const entries = catalogExceptionsFrom(inventory);
  const current = catalogRecord(entries[0].problemId);
  current.progress = [`  ${current.progress.at(-1).replace(/\s+/gu, "\n  ")}  `];
  current.references = current.references.map((reference) => ({ ...reference, tex: reference.tex.replace(/\s+/gu, "\n  ") }));
  assert.deepEqual(checkRecordProgress(current, null, [], entries), []);
  for (const sourceUrl of ["https://www.danrad.net/papers/", "https://www.danrad.net/papers/stark-reciprocity.pdf.extra", "https://example.com/stark-reciprocity.pdf"]) {
    const changed = structuredClone(inventory);
    changed.records[0].sourceUrl = sourceUrl;
    assert.equal(checkRecordProgress(current, null, [], catalogExceptionsFrom(changed)).length, 1);
  }
});

test("catalog exception inventories require document provenance and valid, unique content scopes", () => {
  for (const [field, value] of [
    ["title", ""], ["reason", ""], ["documentDate", "2026-02-31"],
    ["retrievedOn", "2026-01-01"], ["documentSha256", ""],
    ["sourceUrl", "http://example.com/paper.pdf"],
    ["sourceUrl", "https://user:secret@example.com/paper.pdf"],
    ["sourceUrl", "https://example.com/paper.pdf?version=other"],
    ["provenanceUrl", ""], ["progressEntries", []],
  ]) {
    const inventory = exceptionInventory();
    inventory.records[0][field] = value;
    assert.throws(() => catalogExceptionsFrom(inventory), /source exceptions require/);
  }
  for (const field of ["problemId", "progressSha256", "referencesSha256"]) {
    const inventory = exceptionInventory();
    inventory.records[0].progressEntries[0][field] = "";
    assert.throws(() => catalogExceptionsFrom(inventory), /must bind/);
  }
  const duplicate = exceptionInventory();
  duplicate.records[0].progressEntries.push(duplicate.records[0].progressEntries[0]);
  assert.throws(() => catalogExceptionsFrom(duplicate), /Duplicate/);
  assert.throws(() => catalogExceptionsFrom({ schema: "wrong", records: [] }), /schema/);
});

test("catalog progress checks the reported item's own source rather than unrelated bibliography", () => {
  const reference = { label: "ref:paper", tex: "Paper \\href{https://arxiv.org/abs/2609.12345}{preprint}." };
  assert.equal(checkRecordProgress(record(["A new result."], [reference]), null).length, 1);
  assert.deepEqual(checkRecordProgress(record(["The paper reports a partial result \\sourcecite{ref:paper}{Paper}."], [reference]), null), []);
  assert.deepEqual(checkRecordProgress(record(["No progress has been reported."]), null), []);
  assert.equal(checkRecordProgress(record(["No progress has been reported. We now solve it."]), null).length, 1);
  assert.deepEqual(archivalLinksIn("\\href{https://example.com/proof}{claim}"), []);
});

test("unchanged historical prose is preserved but a new claim in an old issue is not grandfathered", () => {
  const old = "An earlier report \\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/12}{issue 12}.";
  const entry = { problemId: "op_0123456789abcdef", text: old };
  assert.deepEqual(checkRecordProgress(record([old]), record([old])), []);
  assert.deepEqual(checkRecordProgress(record([old]), null, [entry]), []);
  assert.equal(checkRecordProgress(record([`${old} A new resolution is now claimed.`]), record([old]), [entry]).length, 1);
});

test("changing a cited archival source to a non-archival link is caught", () => {
  const item = "Reported result \\sourcecite{ref:paper}{Paper}.";
  const old = record([item], [{ label: "ref:paper", tex: "https://arxiv.org/abs/2609.12345" }]);
  const next = record([item], [{ label: "ref:paper", tex: "https://example.com/proof" }]);
  assert.equal(checkRecordProgress(next, old).length, 1);
  assert.equal(next.status, "Unsolved");
});

test("historical eligibility follows content versions, not an old thread's creation date", () => {
  const url = "https://github.com/Naixu-Guo/quantum-open-problems/issues/12";
  const commentUrl = `${url}#issuecomment-1234`;
  const entry = { problemId: "op_0123456789abcdef", text: `Original report ${url}; follow-up ${commentUrl}`, requiredSourceUrls: [url, commentUrl] };
  const version = { createdAt: "2025-12-01T00:00:00Z", updatedAt: "2025-12-02T00:00:00Z", bodySha256: "a".repeat(64) };
  const audit = { schema: "qiqcop-zoo/github-progress-audit/1", cutoffAt: "2026-01-01T00:00:00Z", snapshotAt: "2026-02-01T00:00:00Z", records: [{ ...version, number: 12, url, mappedProblemIds: [entry.problemId], progressEntries: [entry], comments: [{ ...version, url: commentUrl }] }] };
  assert.equal(historicalEntriesFrom(audit).length, 1);
  const changedIssue = structuredClone(audit);
  changedIssue.records[0].updatedAt = "2026-01-15T00:00:00Z";
  assert.throws(() => historicalEntriesFrom(changedIssue), /content-version provenance/);
  const changedComment = structuredClone(audit);
  changedComment.records[0].comments[0].updatedAt = "2026-01-15T00:00:00Z";
  assert.throws(() => historicalEntriesFrom(changedComment), /content-version provenance/);
  const missingHash = structuredClone(audit);
  missingHash.records[0].comments[0].bodySha256 = "";
  assert.throws(() => historicalEntriesFrom(missingHash), /content-version provenance/);
});

test("every inventoried historical report remains in Progress with rendered direct links", () => {
  const audit = JSON.parse(fs.readFileSync(new URL("../docs/audits/github-progress-2026-09-25.json", import.meta.url), "utf8"));
  const entries = historicalEntriesFrom(audit);
  const read = (id) => JSON.parse(fs.readFileSync(new URL(`../database/problems_json/${id}.json`, import.meta.url), "utf8"));
  assert.deepEqual(checkHistoricalCoverage(entries, read), []);
  for (const entry of entries) {
    const html = texToHtml(entry.text);
    for (const url of entry.requiredSourceUrls) assert.ok(html.includes(`href="${url}"`), `${entry.problemId}: ${url}`);
  }
  assert.ok(checkHistoricalCoverage(entries.slice(0, 1), () => record([])).length);
});

test("problem panels retain research-report links and exclude internal catalog review", () => {
  const audit = JSON.parse(fs.readFileSync(new URL("../docs/audits/github-progress-2026-09-25.json", import.meta.url), "utf8"));
  const config = JSON.parse(fs.readFileSync(new URL("../site/config.json", import.meta.url), "utf8"));
  const entries = historicalEntriesFrom(audit);
  const excluded = audit.records.flatMap((report) => report.excludedProgressEntries ?? []);
  const read = (id) => JSON.parse(fs.readFileSync(new URL(`../database/problems_json/${id}.json`, import.meta.url), "utf8"));
  assert.deepEqual(checkHistoricalCoverage(entries, read, excluded), []);
  const accidentallyRestored = { ...read(excluded[0].problemId), progress: [excluded[0].text] };
  assert.match(checkHistoricalCoverage([], () => accidentallyRestored, [excluded[0]])[0], /internal GitHub review/);
  const dates = { today: "2026-09-25", created: "2026-09-01", updated: "2026-09-25", revisions: 1 };
  const ids = new Set([...entries, ...excluded].map((entry) => entry.problemId));
  for (const id of ids) {
    const rendered = renderRecord(read(id));
    const page = renderProblemPage({ record: { ...rendered, dates }, config, root: "../../", related: [], dates });
    const panel = page.match(/<section[^>]*id="progress">([\s\S]*?)<\/section>/u)?.[1];
    assert.ok(panel, id);
    assert.doesNotMatch(panel, /Historical GitHub report \(/u);
    for (const entry of entries.filter((entry) => entry.problemId === id)) {
      for (const url of entry.requiredSourceUrls) assert.ok(panel.includes(`href="${url}"`), `${id}: ${url}`);
      if (entry.text.includes("this link records the withdrawal only.")) assert.match(panel, /\(withdrawn\)/u);
    }
    for (const item of rendered.progress.filter((item) => !item.tex.startsWith("Historical GitHub report ("))) assert.ok(panel.includes(item.html), `${id}: ordinary literature content`);
  }
  for (const number of [41, 42, 43, 50]) assert.deepEqual(audit.records.find((report) => report.number === number).progressEntries, []);
});
