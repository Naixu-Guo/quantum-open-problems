import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { revisionOf } from "../../contract/src/ledger.ts";
import { ProblemReader, ProblemReadError, PROBLEM_READ_CURSOR_TTL_MS, PROBLEM_READ_CACHE_DOCUMENTS, PROBLEM_READ_CACHE_BYTES, PROBLEM_READ_SECTIONS, type ProblemReadPage, type ProblemReadSection } from "../src/problem-read.ts";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { reindex } from "../src/write.ts";

const id = "01M1GRZA80XTEK4461CFZWMS65";
const otherId = "01M1GRZA80M747GFDZQRS8V17M";
const repository = fileURLToPath(new URL("../../", import.meta.url));
const contractDir = path.join(repository, "contract");
const query = (values: Record<string, string | number>) => new URLSearchParams(Object.entries(values).map(([key, value]): [string, string] => [key, String(value)]));
const errorIs = (status: number, code: string) => (error: unknown) => error instanceof ProblemReadError && error.status === status && error.code === code;

/** Independent consumer: parse a complete object or concatenate continuation text in request order. */
function reconstruct(pages: ProblemReadPage[]) {
  assert.ok(pages.length > 0);
  const first = pages[0]!;
  if (first.format === "json") {
    assert.equal(pages.length, 1);
    assert.ok(first.content && typeof first.content === "object");
    assert.equal(first.text, null);
    assert.equal(first.continued, false);
    assert.equal(first.complete, true);
    assert.equal(first.nextCursor, null);
    return first.content;
  }
  pages.forEach((page, i) => {
    assert.equal(page.format, "json-continuation", "representation stays text until the section is complete");
    assert.equal(page.content, null);
    assert.ok(typeof page.text === "string" && page.text.length > 0);
    assert.equal(page.continued, i > 0);
    assert.equal(page.complete, i === pages.length - 1);
    assert.equal(page.nextCursor === null, page.complete);
    assert.equal(page.documentVersion, first.documentVersion);
    assert.equal(page.section, first.section);
  });
  return JSON.parse(pages.map(page => page.text).join(""));
}

function expected(detail: Record<string, any>, section: ProblemReadSection) {
  const { source, progress, comment, references, ...researchContext } = detail.research ?? { available: false };
  if (section === "statement") return { statement: detail.statement ?? null, ...(Object.hasOwn(detail, "body") ? { body: detail.body } : {}) };
  if (section === "history") return { source: source ?? [], progress: progress ?? [], researchContext };
  if (section === "references") return { bibliography: references ?? [], references: detail.references ?? [], researchContext };
  return { comment: comment ?? [], discussion: detail.comments ?? [], decisions: detail.decisions ?? [], researchContext };
}

function assertEnvelope(page: ProblemReadPage) {
  assert.equal(page.responseBytes, Buffer.byteLength(JSON.stringify(page)));
  assert.ok(page.responseBytes <= page.maxBytes);
  assert.deepEqual(Object.keys(page).sort(), ["schemaVersion", "problemId", "documentVersion", "section", "format", "content", "text", "continued", "complete", "nextCursor", "maxBytes", "responseBytes", "budgetSemantics"].sort());
  assert.deepEqual(page.budgetSemantics, { unit: "utf8-json-bytes", representation: "compact-json", scope: "entire-api-response", excludes: ["http-headers", "mcp-envelope", "tokens"] });
  assert.equal(page.complete, page.nextCursor === null);
}

function collect(reader: ProblemReader, detail: Record<string, unknown>, section: ProblemReadSection, maxBytes = 2048) {
  const pages: ProblemReadPage[] = [];
  const prepared = reader.prepare(detail);
  let params = query({ section, maxBytes });
  for (;;) {
    const response = reader.readPrepared(String(detail["id"]), prepared, params);
    assert.equal(response.status, 200);
    assert.equal(response.compactJson, true);
    assertEnvelope(response.body);
    pages.push(response.body);
    if (!response.body.nextCursor) break;
    assert.ok(pages.length < 3000, "continuation must make progress");
    params = query({ cursor: response.body.nextCursor, maxBytes: pages.length % 3 === 0 ? 8192 : maxBytes });
  }
  return pages;
}
function longDetail() {
  return {
    id, title: "A title longer than the smallest response budget: " + "量子\"".repeat(1900),
    unknownMetadata: JSON.parse('{"__proto__":{"preserved":true},"a/b~c":null,"array":[null,{},[],"unrecognized scientific metadata"]}'),
    statement: { id: "s1", body: "  Definitions\n\n" + "α→β🧪 ".repeat(1000),
      quantity: { symbol: String.raw`\min_{\rho\in\mathcal D}f(\rho)` },
      clauses: [{ id: "c1", text: String.raw`\forall X, A_X \neq A_x; ` .repeat(300), textFormat: "tex",
        resolutionCriteria: "Prove or disprove, preserving all hypotheses.\n".repeat(100), other: { empty: [], bool: false } }] },
    research: { schemaVersion: "qop-research/1", available: true, unknown: { preserved: "yes" },
      source: [{ text: "Source α\n", textFormat: "tex", provenance: { revision: 1, custom: "unknown" } }],
      progress: [{ text: "  First step\n\n第二步🧪\n".repeat(400), textFormat: "tex", evidence: null }],
      comment: [{ text: "", textFormat: "tex" }], references: [{ text: "Bibliographic text", key: "k", label: "[1]" }] },
    body: " \t" + String.raw`\begin{align}x_i&\leq y_i\\ z_i&=0\end{align}`.repeat(650) + "\n\n ",
    references: [{ id: "ref1", body: "reference discussion\n", source: { title: "An unusually long source title " + "源".repeat(2000), unknown: [null] } }],
    comments: [{ id: "c1", body: "A service discussion 🧪\n", anonymous: false }],
    decisions: [{ id: "d1", body: "Full decision rationale\n", status: null }],
    catalogDates: { editedAt: null, createdAt: null, basis: "unavailable" },
  };
}

test("semantic reads return complete natural objects with original citation/provenance metadata", () => {
  const detail = { id, statement: { body: "Definition α", clauses: [{ text: String.raw`\forall x`, textFormat: "tex", extra: [null, { units: "q" }] }] },
    body: "Native background", research: { available: true, schemaVersion: "qop-research/1", semantics: { authored: true },
      source: [{ text: "Original source", citations: ["a"], provenance: { file: "source.tex" } }],
      progress: [{ text: "A resolved subcase", date: null }], references: [{ key: "a", text: "Literature", doi: "10.1234/example" }], comment: [{ text: "Author caveat" }] },
    references: [{ source: { title: "Service reference", authors: ["A"] }, body: "Evidence" }], comments: [{ body: "Discussion" }], decisions: [{ kind: "status", body: "Decision rationale" }] };
  const reader = new ProblemReader();
  assert.equal(reader.read(id, detail).body.section, "statement");
  for (const section of PROBLEM_READ_SECTIONS) {
    const pages = collect(reader, detail, section, 8192);
    assert.equal(pages.length, 1);
    assert.equal(pages[0]!.format, "json");
    assert.deepEqual(reconstruct(pages), expected(detail, section));
  }
});

test("long sections reconstruct exactly with changing small budgets and opaque continuations", () => {
  const detail = longDetail();
  const reader = new ProblemReader();
  for (const section of PROBLEM_READ_SECTIONS) {
    const pages = collect(reader, detail, section);
    assert.deepEqual(reconstruct(pages), expected(detail, section));
    if (section !== "comment") assert.ok(pages.length > 1);
  }
  const first = reader.read(id, detail, query({ section: "history", maxBytes: 2048 })).body;
  assert.ok(first.nextCursor);
  const final = reader.read(id, detail, query({ cursor: first.nextCursor, maxBytes: 65536 })).body;
  assert.equal(final.section, "history", "omitted section inherits the cursor's section");
  assert.equal(final.format, "json-continuation", "larger budgets never change an ongoing continuation into an object");
  assert.equal(final.continued, true);
  assert.equal(final.complete, true);
  assert.deepEqual(reconstruct([first, final]), expected(detail, "history"));
  assert.deepEqual(reader.read(id, detail, query({ cursor: first.nextCursor, maxBytes: 65536 })).body, final, "cursor replay is deterministic");
});

test("a continuous TeX/Unicode section larger than 1 MiB reconstructs at fixed 8 KiB with bounded per-page work", (t) => {
  const start = performance.now();
  const phrase = String.raw`\forall \rho,\; \|\rho-\sigma\|_1\leq\varepsilon\quad α🧪`;
  const body = phrase.repeat(Math.floor(1_048_576 / Buffer.byteLength(phrase)) + 1);
  assert.ok(Buffer.byteLength(body) > 1_048_576);
  assert.ok(!body.includes("\n"));
  const reader = new ProblemReader();
  let bodyLoads = 0;
  const prepared = reader.prepare({ id, get body() { bodyLoads++; return body; } });
  assert.ok(Object.isFrozen(prepared));
  let candidateBytes = 0;
  let largestCandidate = 0;
  const stringify = JSON.stringify;
  t.mock.method(JSON, "stringify", ((value: any, replacer: any, space: any) => {
    if (value?.schemaVersion === "qop-problem-read/1") {
      const size = value.format === "json" ? Buffer.byteLength(stringify(value.content)) : Buffer.byteLength(value.text);
      assert.ok(size <= 8192, "fit probes never serialize the huge remaining section");
      candidateBytes += size;
      largestCandidate = Math.max(largestCandidate, size);
    }
    return stringify(value, replacer, space);
  }) as typeof JSON.stringify);
  const pages: ProblemReadPage[] = [];
  let params = query({ maxBytes: 8192 });
  for (;;) {
    const page = reader.readPrepared(id, prepared, params).body;
    assertEnvelope(page);
    assert.equal(page.maxBytes, 8192);
    pages.push(page);
    if (!page.nextCursor) break;
    assert.ok(pages.length < 1000);
    params = query({ cursor: page.nextCursor, maxBytes: 8192 });
  }
  assert.deepEqual(reconstruct(pages), { statement: null, body });
  assert.equal(bodyLoads, 1, "all pages reuse one preparation");
  assert.ok(candidateBytes <= pages.length * 8192 * 64);
  t.diagnostic(`${Buffer.byteLength(body)} original UTF-8 bytes in ${pages.length} fixed-8192-byte pages; ${(performance.now() - start).toFixed(1)} ms; largest fit candidate ${largestCandidate} bytes`);
});

test("current-document caching is lazy, bounded by LRU, and invalidates on either epoch component", () => {
  const reader = new ProblemReader();
  let epoch = { ledger: {}, catalogVersion: "catalog-1" };
  let loads = 0;
  let body = "x".repeat(10_000);
  const detail = () => { loads++; return { id, body }; };
  const first = reader.readCurrent(id, epoch, detail, query({ maxBytes: 2048 })).body;
  assert.ok(first.nextCursor);
  reader.readCurrent(id, epoch, detail, query({ cursor: first.nextCursor, maxBytes: 2048 }));
  assert.equal(loads, 1, "a hit never invokes the research-detail factory");
  epoch = { ledger: {}, catalogVersion: "catalog-1" };
  reader.readCurrent(id, epoch, detail);
  assert.equal(loads, 2, "changing only ledger identity rebuilds the snapshot");
  body = "updated related content " + body;
  epoch = { ...epoch, catalogVersion: "catalog-2" };
  assert.throws(() => reader.readCurrent(id, epoch, detail, query({ cursor: first.nextCursor! })), errorIs(409, "document_changed"));
  assert.equal(loads, 3, "changing only catalog version rebuilds the snapshot");
  reader.readCurrent(id, epoch, detail);
  assert.equal(loads, 3);
  let evictedLoads = 0;
  const evicted = () => { evictedLoads++; return { id: "lru-0", body: "small" }; };
  reader.readCurrent("lru-0", epoch, evicted);
  for (let i = 1; i < PROBLEM_READ_CACHE_DOCUMENTS; i++) reader.readCurrent(`lru-${i}`, epoch, () => ({ id: `lru-${i}` }));
  reader.readCurrent("lru-0", epoch, evicted);
  assert.equal(evictedLoads, 1, "a hit updates LRU order");
  for (let i = PROBLEM_READ_CACHE_DOCUMENTS; i <= 2 * PROBLEM_READ_CACHE_DOCUMENTS; i++) reader.readCurrent(`lru-${i}`, epoch, () => ({ id: `lru-${i}` }));
  reader.readCurrent("lru-0", epoch, evicted);
  assert.equal(evictedLoads, 2);
});

test("cache byte limits apply and oversized sections remain readable without retention", () => {
  const reader = new ProblemReader();
  const epoch = { ledger: {}, catalogVersion: "catalog-1" };
  const body = "m".repeat(PROBLEM_READ_CACHE_BYTES / 2);
  let loads = 0;
  const detail = () => { loads++; return { id, body }; };
  reader.readCurrent(id, epoch, detail);
  reader.readCurrent(otherId, epoch, () => ({ id: otherId, body }));
  reader.readCurrent(id, epoch, detail);
  assert.equal(loads, 2, "byte eviction happens before document-count eviction");
  const oversized = "z".repeat(PROBLEM_READ_CACHE_BYTES + 1);
  let oversizedLoads = 0;
  const loadOversized = () => { oversizedLoads++; return { id, body: oversized }; };
  const otherEpoch = { ledger: {}, catalogVersion: "catalog-2" };
  const first = reader.readCurrent(id, otherEpoch, loadOversized, query({ maxBytes: 2048 })).body;
  assert.ok(first.nextCursor);
  const next = reader.readCurrent(id, otherEpoch, loadOversized, query({ cursor: first.nextCursor, maxBytes: 2048 })).body;
  assert.equal(oversizedLoads, 2, "an oversized document is prepared again, not retained without bound");
  assert.equal(next.continued, true);
  assert.equal(next.documentVersion, first.documentVersion);
  assertEnvelope(next);
});

test("cursors reject tampering, wrong section/problem, independent signers, expiry and changes outside the selected section", (t) => {
  let clock = 1_800_000_000_000;
  t.mock.method(Date, "now", () => clock);
  const reader = new ProblemReader();
  const detail = longDetail();
  const first = reader.read(id, detail, query({ section: "history", maxBytes: 2048 })).body;
  assert.ok(first.nextCursor);
  const cursor = first.nextCursor;
  const expiry = (value: string) => (JSON.parse(Buffer.from(value.split(".")[0]!, "base64url").toString()) as { e: number }).e;
  assert.equal(expiry(cursor), clock + PROBLEM_READ_CURSOR_TTL_MS);
  assert.throws(() => reader.read(id, detail, query({ cursor: (cursor[0] === "A" ? "B" : "A") + cursor.slice(1) })), errorIs(400, "invalid_cursor"));
  assert.throws(() => new ProblemReader().read(id, detail, query({ cursor })), errorIs(400, "invalid_cursor"));
  assert.throws(() => reader.read(otherId, { ...detail, id: otherId }, query({ cursor })), errorIs(400, "cursor_scope_mismatch"));
  assert.throws(() => reader.read(id, detail, query({ cursor, section: "statement" })), errorIs(400, "cursor_scope_mismatch"));
  for (const key of ["statement", "references", "comments", "decisions", "catalogDates"] as const) {
    const changed = { ...detail, [key]: { relatedRecordChanged: true } };
    assert.throws(() => reader.read(id, changed, query({ cursor })), errorIs(409, "document_changed"), key);
    assert.throws(() => reader.read(id, changed, query({ documentVersion: first.documentVersion })), errorIs(409, "document_changed"), key);
  }
  clock += 30 * 60 * 1000;
  const next = reader.read(id, detail, query({ cursor, maxBytes: 2048 })).body;
  assert.ok(next.nextCursor);
  assert.equal(expiry(next.nextCursor), expiry(cursor));
  clock = expiry(cursor);
  assert.throws(() => reader.read(id, detail, query({ cursor: next.nextCursor! })), errorIs(400, "cursor_expired"));
});

test("native/null/absent sections are explicit and large metadata plus unusual Unicode remain exact", () => {
  const reader = new ProblemReader();
  const native = { id, statement: null, research: { available: false, source: [], progress: null, comment: [], references: [] },
    body: "", references: [], comments: null, decisions: [] };
  for (const section of PROBLEM_READ_SECTIONS) {
    assert.deepEqual(reconstruct(collect(reader, native, section)), expected(native, section));
    assert.deepEqual(reconstruct(collect(reader, { id }, section)), expected({ id }, section));
  }
  assert.deepEqual(reader.read(id, { id, body: null }).body.content, { statement: null, body: null });
  const unusual = { ...native, body: "before\ud800after\udfff".repeat(2000),
    statement: { title: "metadata\ud800".repeat(1500), future: JSON.parse('{"__proto__":{"preserved":true},"a/b~c":null}') },
    research: { ...native.research, futureMetadata: "研究🧪\ud800".repeat(1000) } };
  for (const section of PROBLEM_READ_SECTIONS) assert.deepEqual(reconstruct(collect(reader, unusual, section)), expected(unusual, section));
});

test("only semantic section queries are accepted; removed selectors and invalid parameters fail explicitly", () => {
  const reader = new ProblemReader();
  const detail = { id, body: "\n  Original whitespace α\t\n".repeat(500) };
  for (const key of ["section", "documentVersion", "cursor", "maxBytes"]) {
    for (const value of ["", " \t\n", "\u00a0"]) assert.throws(() => reader.read(id, detail, query({ [key]: value })), errorIs(400, "invalid_query"));
    assert.throws(() => reader.read(id, detail, new URLSearchParams(`${key}=x&${key}=x`)), errorIs(400, "invalid_query"));
  }
  for (const params of ["unknown=1", "section=all", "section=metadata", "section=body", "section=source", "section=full", "blockId=b0", "offset=0", "path=/body", "documentVersion=not-a-digest", "maxBytes=2047", "maxBytes=65537", "maxBytes=2e3", "maxBytes=2048.5", "maxBytes=-1"]) {
    assert.throws(() => reader.read(id, detail, new URLSearchParams(params)), errorIs(400, "invalid_query"), params);
  }
  assert.deepEqual(reconstruct(collect(reader, detail, "statement")), expected(detail, "statement"));
});
async function httpFixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-problem-read-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(root, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(root, "activity"), { recursive: true });
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  git(["init", "-q", "-b", "main"]); git(["add", "--all"]);
  git(["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed problem-reader fixture"]);
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir,
    dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false, submissions: { dbPath: ":memory:" } });
  const server = createServer(service);
  t.after(async () => {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address(); assert.ok(address && typeof address === "object");
  const get = async (route: string) => {
    const response = await fetch(`http://127.0.0.1:${address.port}${route}`, { headers: { Connection: "close" } });
    const text = await response.text();
    return { status: response.status, contentLength: Number(response.headers.get("content-length")), cache: response.headers.get("cache-control"), text, body: JSON.parse(text) as Record<string, any> };
  };
  return { service, get };
}

test("semantic HTTP reads use aliases, exact compact budgets and the same research section values", async (t) => {
  const { service, get } = await httpFixture(t);
  assert.equal((await get("/api/v1/status")).body.problemReadVersion, "qop-problem-read/1");
  const problems = service.repo.current().currentOf("Problem");
  for (const problem of problems) {
    const direct = await get(`/api/v1/problems/${problem.id}?view=research`);
    assert.equal(direct.status, 200);
    for (const section of PROBLEM_READ_SECTIONS) {
      const pages: ProblemReadPage[] = [];
      let params = query({ section, maxBytes: 2048 });
      for (let number = 0;; number++) {
        assert.ok(number < 1000);
        const page = await get(`/api/v1/problems/${problem.id}/read?${params}`);
        assert.equal(page.status, 200);
        assert.equal(page.text, JSON.stringify(page.body));
        assert.equal(page.contentLength, Buffer.byteLength(page.text));
        assert.equal(page.body.responseBytes, page.contentLength);
        assert.equal(page.cache, "no-store");
        assertEnvelope(page.body as ProblemReadPage);
        pages.push(page.body as ProblemReadPage);
        if (!page.body.nextCursor) break;
        params = query({ cursor: page.body.nextCursor, maxBytes: 2048 });
      }
      assert.deepEqual(reconstruct(pages), expected(direct.body, section));
    }
  }
  const first = problems[0]!;
  const alias = (first.fields["aliases"] as string[])[0]!;
  const byAlias = await get(`/api/v1/problems/${encodeURIComponent(alias)}/read`);
  assert.equal(byAlias.status, 200);
  assert.equal(byAlias.body.problemId, first.id);
  assert.equal(byAlias.body.section, "statement");
  assert.equal(byAlias.body.maxBytes, 8192);
  assert.equal(byAlias.body.documentVersion, (await get(`/api/v1/problems/${first.id}/read`)).body.documentVersion);
  const merged = problems[1]!;
  const mergedStatus = (await get(`/api/v1/problems/${merged.id}?view=research`)).body.status;
  merged.fields["authoredCatalog"] = { status: mergedStatus, ...(merged.fields["authoredCatalog"] as object ?? {}), mergedIntoProblemId: first.id };
  reindex(service);
  const byMerged = await get(`/api/v1/problems/${merged.id}/read`);
  assert.equal(byMerged.status, 200);
  assert.equal(byMerged.body.problemId, first.id);
  assert.equal(byMerged.body.documentVersion, byAlias.body.documentVersion);
  for (const params of ["maxBytes=2047", "section=", "cursor=", "maxBytes=8192&maxBytes=8192", "blockId=b0", "section=all", "extra=1"]) {
    const result = await get(`/api/v1/problems/${first.id}/read?${params}`);
    assert.equal(result.status, 400);
    assert.equal(result.body.code, "invalid_query");
  }
});

test("related Source and Statement edits invalidate any section while the Problem revision remains unchanged", async (t) => {
  const { service, get } = await httpFixture(t);
  const current = service.repo.current();
  let selected: { id: string; sourceId: string } | undefined;
  for (const problem of current.currentOf("Problem")) {
    const result = await get(`/api/v1/problems/${problem.id}?view=research`);
    const reference = result.body.references.find((ref: any) => ref.source && current.find("Source", ref.sourceId));
    if (reference) { selected = { id: problem.id, sourceId: reference.sourceId }; break; }
  }
  assert.ok(selected);
  const problem = current.find("Problem", selected.id)!;
  const originalRevision = revisionOf(problem);
  const first = await get(`/api/v1/problems/${selected.id}/read?section=references&maxBytes=2048`);
  const source = current.find("Source", selected.sourceId)!;
  source.fields["title"] = String(source.fields["title"]) + " — changed related source";
  reindex(service);
  const staleSource = await get(`/api/v1/problems/${selected.id}/read?${query({ section: "statement", documentVersion: first.body.documentVersion })}`);
  assert.equal(staleSource.status, 409, "a changed reference invalidates even an unchanged definition read");
  assert.equal(staleSource.body.code, "document_changed");
  assert.equal(revisionOf(problem), originalRevision);
  const fresh = await get(`/api/v1/problems/${selected.id}/read?section=references&maxBytes=2048`);
  assert.notEqual(fresh.body.documentVersion, first.body.documentVersion);
  const statement = current.currentOf("Statement").find(record => record.fields["problemId"] === selected.id)!;
  statement.body += "\nChanged definitions in the related Statement.";
  reindex(service);
  const staleStatement = await get(`/api/v1/problems/${selected.id}/read?${query({ section: "history", documentVersion: fresh.body.documentVersion })}`);
  assert.equal(staleStatement.status, 409);
  assert.equal(staleStatement.body.code, "document_changed");
  assert.equal(revisionOf(problem), originalRevision);
});
