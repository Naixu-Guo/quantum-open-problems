import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { archivalLinksIn, checkRecordProgress, historicalEntriesFrom, checkHistoricalCoverage } from "../scripts/check-progress-sources.mjs";
import { texToHtml } from "../site/lib/tex.mjs";

const record = (progress, references = []) => ({ id: "op_0123456789abcdef", status: "Unsolved", progress, references });
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
