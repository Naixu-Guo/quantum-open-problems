import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import crypto from "node:crypto";
import { syncBuiltinESMExports } from "node:module";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords, type LoadedRecord } from "../../contract/src/ledger.ts";
import { statementDigest } from "../../contract/src/digest.ts";
import type { Clause } from "../../contract/src/types/statement.ts";
import { Index, SearchError } from "../src/index.ts";
import { searchMatch, type SearchDocument } from "../src/search.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));

function load(rootPath: string): LoadedRecord[] {
  const loaded = loadRecords([rootPath]);
  assert.deepEqual(loaded.issues, []);
  return loaded.records;
}

test("catalog search finds formal-statement terms missing from the problem overview", () => {
  const ledger = new Ledger(load(path.join(root, "ledger")));
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map());
    for (const [term, title] of [
      ["separable", "Absolute separability from spectra"],
      ["bipartite", "Additivity of the entanglement of purification"],
    ] as const) {
      const problem = ledger.currentOf("Problem").find((record) => record.fields["title"] === title);
      assert.ok(problem, title);
      const oldSearchText = [problem.fields["title"], ...(problem.fields["keywords"] as string[]), ...(problem.fields["aliases"] as string[]), problem.body].join(" ").toLowerCase();
      assert.ok(!oldSearchText.includes(term), `${term} must exercise the omitted statement text`);
      assert.ok(index.problemRows({ text: term }).some((row) => row.id === problem.id), `${term} should find ${title}`);
    }
  } finally { index.close(); }
});

function fixture() {
  const records = load(path.join(root, "contract", "fixtures", "ledger"));
  const problem = records.find((record) => record.type === "Problem" && record.fields["title"] === "Example conformance problem")!;
  const statement = records.find((record) => record.type === "Statement" && record.fields["problemId"] === problem.id)!;
  return { records, problem, statement };
}

test("rebuilding search replaces superseded statement text and ignores redacted statements", () => {
  const { records, problem, statement } = fixture();
  statement.body = "obsoletebodymarker";
  statement.fields["digest"] = statementDigest(statement.body);
  (statement.fields["clauses"] as Clause[])[0]!.text = "obsoleteclausemarker";
  const index = new Index(":memory:");
  const ids = (text: string) => index.problemRows({ text }).map((row) => row.id);
  try {
    index.rebuild(new Ledger(records), new Map());
    assert.deepEqual(ids("obsoletebodymarker"), [problem.id]);
    assert.deepEqual(ids("obsoleteclausemarker"), [problem.id]);

    const current = structuredClone(statement);
    current.id = "01M1HDJG00ZZZZZZZZZZZZZZZ1";
    current.path = `${statement.path}.v2`;
    current.relPath = `${statement.relPath}.v2`;
    current.body = "currentbodymarker";
    Object.assign(current.fields, { id: current.id, version: 2, supersedes: statement.id, digest: statementDigest(current.body) });
    const clauses = current.fields["clauses"] as Clause[];
    clauses[0]!.text = "currentclausemarker";
    clauses[0]!.label = "currentlabelmarker";
    clauses[0]!.resolutionCriteria = "currentcriteriamarker";
    clauses[0]!.supersedesClauseId = `${statement.id}#${clauses[0]!.id}`;
    clauses[1]!.quantity!.name = "currentquantitymarker";
    const redacted = structuredClone(current);
    redacted.id = "01M1HDJG00ZZZZZZZZZZZZZZZ2";
    redacted.path = `${statement.path}.v3`;
    redacted.relPath = `${statement.relPath}.v3`;
    redacted.redacted = true;
    redacted.body = "redactedbodymarker";
    Object.assign(redacted.fields, { id: redacted.id, version: 3, supersedes: current.id, redacted: true });
    index.rebuild(new Ledger([...records, current, redacted]), new Map());

    for (const term of ["currentbodymarker", "currentclausemarker", "currentlabelmarker", "currentcriteriamarker", "currentquantitymarker"]) {
      assert.deepEqual(ids(term), [problem.id], term);
    }
    for (const term of ["obsoletebodymarker", "obsoleteclausemarker", "redactedbodymarker"]) assert.deepEqual(ids(term), [], term);
  } finally { index.close(); }
});

test("formal statement searches preserve literal SQL wildcard escaping", () => {
  const { records, problem, statement } = fixture();
  statement.body = String.raw`literal%marker literal_marker \literalmarker`;
  const decoy = records.find((record) => record.type === "Problem" && record.id !== problem.id)!;
  decoy.body = "literalXmarker literalamarker literalmarker";
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map());
    for (const text of ["literal%marker", "literal_marker", String.raw`\literalmarker`]) {
      assert.deepEqual(index.problemRows({ text, indexedOnly: false }).map((row) => row.id), [problem.id], text);
    }
  } finally { index.close(); }
});

test("search includes current taxonomy labels and preserves filters and pagination", () => {
  const { records, problem } = fixture();
  const taxonomy = records.find((record) => record.type === "Taxonomy")!;
  const area = (taxonomy.fields["areas"] as { id: string; label: string }[]).find((entry) => entry.id === (problem.fields["areaIds"] as string[])[0])!;
  const topic = (taxonomy.fields["topics"] as { id: string; label: string }[]).find((entry) => entry.id === (problem.fields["topicIds"] as string[])[0])!;
  area.label = "Distinctive field label";
  topic.label = "Distinctive topic label";
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map());
    assert.ok(index.problemRows({ text: area.label }).some((row) => row.id === problem.id));
    assert.ok(index.problemRows({ text: topic.label }).some((row) => row.id === problem.id));
    const filter = { text: "distinctive", status: "Unsolved", area: area.id, topic: topic.id, difficulty: "accessible" };
    assert.deepEqual(index.problemRows(filter).map((row) => row.id), [problem.id]);
    assert.deepEqual(index.problemRows({ ...filter, status: "Solved" }), []);
    assert.deepEqual(index.problemRows({ ...filter, topic: "unrelated-topic" }), []);
    const all = index.problemRows({ text: "distinctive" });
    assert.ok(all.length > 1);
    const page = index.problemPage({ text: "distinctive", limit: 1, offset: 1 });
    assert.deepEqual(page.rows.map((row) => row.id), [all[1]!.id]);
    assert.equal(page.total, all.length);
    assert.equal(page.nextOffset, all.length > 2 ? 2 : null);
  } finally { index.close(); }
});

test("real catalog search separates exact identifiers from scientific words and normalizes reviewed aliases", () => {
  const ledger = new Ledger(load(path.join(root, "ledger")));
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map());
    const ids = (text: string) => index.problemRows({ text, limit: 1000 }).map((row) => row.id);
    const thermal = ledger.currentOf("Problem").find((record) => record.id === "01M1HME7803ZFMDQWV9SVP8FH8")!;
    assert.ok(thermal);
    assert.ok(!ids("SVP").includes(thermal.id), "a random SVP substring in a ULID is not scientific evidence");
    assert.ok(ids("SVP").length > 0);
    assert.deepEqual(ids("SVP"), ids("Shortest Vector Problem"));
    assert.deepEqual(ids("SVP"), ids("最短向量"));
    for (const alias of [thermal.id, ...(thermal.fields["aliases"] as string[])]) {
      assert.equal(ids(alias)[0], thermal.id, `full identifier/alias ${alias} must still resolve`);
    }
    for (const variants of [["QMA(2)", "QMA2", "QMA 2"], ["stabilizer rank", "stabiliser rank", "稳定子秩"], ["quantum algorithm", "quantum algorithms", "量子算法"]]) {
      const first = ids(variants[0]!);
      assert.ok(first.length > 0, variants.join(" / "));
      for (const variant of variants.slice(1)) assert.deepEqual(ids(variant), first, variant);
    }
    assert.match(index.problemRows({ text: "QMA 2" })[0]!.title, /QMA\(2\)/u, "title relevance wins over incidental reference mentions");
  } finally { index.close(); }
});

test("scientific token boundaries exclude substrings without changing mathematical parameters", () => {
  const { records, problem, statement } = fixture();
  problem.body = "A classification of QMA(20) and SVPish problems, not suffixliteralmarker.";
  statement.body = "QMA(20)";
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map());
    for (const text of ["class", "QMA2", "SVP", "literalmarker"]) {
      assert.ok(!index.problemRows({ text }).some((row) => row.id === problem.id), text);
    }
    assert.ok(index.problemRows({ text: "classification" }).some((row) => row.id === problem.id));
    assert.ok(index.problemRows({ text: "QMA(20)" }).some((row) => row.id === problem.id));
  } finally { index.close(); }
});

test("relevance ranks the title and reports original excerpts with matched fields", () => {
  const { records, problem, statement } = fixture();
  const others = records.filter((record) => record.type === "Problem" && record.id !== problem.id);
  assert.ok(others.length >= 2);
  problem.body = `Body evidence ${"filler ".repeat(100)}WitnessMarker $K > k$`;
  statement.body = "Statement-only WitnessMarker";
  others[0]!.fields["title"] = "WitnessMarker title evidence";
  others[1]!.body = "Incidental WitnessMarker reference";
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map());
    const rows = index.problemRows({ text: "WitnessMarker", indexedOnly: false });
    assert.equal(rows[0]!.id, others[0]!.id);
    assert.ok(rows.findIndex((row) => row.id === problem.id) < rows.findIndex((row) => row.id === others[1]!.id));
    const hit = rows.find((row) => row.id === problem.id)!;
    assert.ok(hit.match!.fields.includes("statement"));
    assert.match(hit.match!.snippet, /WitnessMarker/u, "excerpt case is authored, not normalized");
    assert.equal(hit.match!.normalizedQuery, "witnessmarker");
    assert.ok(!Object.hasOwn(hit, "search_text"));
    assert.ok(!Object.hasOwn(hit, "search_document"));
    const titled = index.problemRows({ text: "WitnessMarker", indexedOnly: false, sort: "title" });
    assert.deepEqual(titled.map((row) => row.title), [...titled.map((row) => row.title)].sort((a, b) => a.localeCompare(b)));
  } finally { index.close(); }
});

test("default catalog order uses exact authored edit dates, then creation and stable ID; unknown dates remain explicit", () => {
  const { records, problem } = fixture();
  const other = records.find((record) => record.type === "Problem" && record.id !== problem.id)!;
  const dates = new Map([
    [problem.id, { updatedAt: "2026-09-14T11:12:14Z", createdAt: "2026-09-01T00:00:00Z", basis: "tex-git-history" as const }],
    [other.id, { updatedAt: "2026-09-14T11:12:13Z", createdAt: "2026-09-14T00:00:00Z", basis: "tex-git-history" as const }],
  ]);
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map(), dates);
    const rows = index.problemRows({ indexedOnly: false });
    assert.deepEqual(rows.slice(0, 2).map((row) => row.id), [problem.id, other.id]);
    assert.ok(rows.slice(2).every((row) => row.edited_at === null && row.created_at === null));
    assert.equal(rows[0]!.edited_at, dates.get(problem.id)!.updatedAt);
    dates.get(other.id)!.updatedAt = dates.get(problem.id)!.updatedAt;
    index.rebuild(new Ledger(records), new Map(), dates);
    assert.equal(index.problemRows({ indexedOnly: false })[0]!.id, other.id, "creation time resolves equal edit seconds");
    dates.get(other.id)!.createdAt = dates.get(problem.id)!.createdAt;
    index.rebuild(new Ledger(records), new Map(), dates);
    assert.deepEqual(index.problemRows({ indexedOnly: false }).slice(0, 2).map((row) => row.id), [problem.id, other.id].sort());
  } finally { index.close(); }
});

test("exact edit and creation ties follow authored op IDs as on the website, while title ties still use ULIDs", () => {
  const { records, problem } = fixture();
  const other = records.find((record) => record.type === "Problem" && record.id !== problem.id)!;
  const [first, second] = [problem, other].sort((a, b) => a.id.localeCompare(b.id)) as [LoadedRecord, LoadedRecord];
  first.fields["authoredCatalog"] = { status: "Unsolved", sourcePath: "database/problems_json/op_ffffffffffffffff.json", record: { id: "op_ffffffffffffffff" } };
  second.fields["authoredCatalog"] = { status: "Unsolved", sourcePath: "database/problems_json/op_0000000000000000.json", record: { id: "op_0000000000000000" } };
  first.fields["title"] = second.fields["title"] = "Same title";
  const dates = new Map([first, second].map((record) => [record.id, {
    updatedAt: "2026-09-14T11:12:13Z", createdAt: "2026-09-01T00:00:00Z", basis: "tex-git-history" as const,
  }]));
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map(), dates);
    // These authored IDs intentionally have the opposite order to the ULIDs.
    assert.deepEqual(index.problemRows({ indexedOnly: false }).slice(0, 2).map((row) => row.id), [second.id, first.id]);
    assert.deepEqual(index.problemRows({ indexedOnly: false, sort: "title" }).filter((row) => row.title === "Same title").map((row) => row.id), [first.id, second.id]);
    assert.equal(index.problemRows({ text: first.id, indexedOnly: false })[0]!.id, first.id, "the permanent record identity is unchanged");
  } finally { index.close(); }
});

test("cursor pages preserve membership until catalog changes, reject reuse for other filters, and retain offset compatibility", () => {
  const { records, problem } = fixture();
  const ledger = new Ledger(records);
  const index = new Index(":memory:");
  const fails = (code: SearchError["code"]) => (error: unknown) => error instanceof SearchError && error.code === code;
  try {
    index.rebuild(ledger, new Map());
    const filter = { indexedOnly: false, sort: "title" as const, limit: 1 };
    const first = index.problemPage(filter);
    assert.ok(first.nextCursor);
    const second = index.problemPage({ ...filter, cursor: first.nextCursor });
    assert.equal(second.catalogVersion, first.catalogVersion);
    assert.equal(second.offset, 1);
    assert.deepEqual(second.rows, index.problemPage({ ...filter, offset: 1 }).rows);
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor!, status: "Solved" }), fails("cursor_query_mismatch"));
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor!, sort: "edited" }), fails("cursor_query_mismatch"));
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor!, offset: 1 }), fails("invalid_cursor"));
    const tampered = `${first.nextCursor.slice(0, 8)}${first.nextCursor[8] === "A" ? "B" : "A"}${first.nextCursor.slice(9)}`;
    assert.throws(() => index.problemPage({ ...filter, cursor: tampered }), fails("invalid_cursor"));
    index.rebuild(ledger, new Map());
    assert.equal(index.problemPage({ ...filter, cursor: first.nextCursor }).offset, 1, "unchanged rebuilds preserve valid cursors");
    problem.body += "\nA new authored progress entry.";
    index.rebuild(new Ledger(records), new Map());
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor! }), fails("catalog_changed"));
    assert.notEqual(index.catalogVersion(), first.catalogVersion);
    assert.ok(index.problemPage({ ...filter, offset: 1 }).rows.length > 0, "legacy offset reads remain available");
  } finally { index.close(); }
});

test("cursor expiry, normalized query reuse, and edit-date-only invalidation are explicit", (context) => {
  const { records } = fixture();
  for (const record of records.filter((record) => record.type === "Problem")) record.body += " stabilizer rank";
  const ledger = new Ledger(records);
  const index = new Index(":memory:");
  try {
    index.rebuild(ledger, new Map());
    const filter = { text: "stabiliser rank", limit: 1, indexedOnly: false };
    const first = index.problemPage(filter);
    assert.ok(first.nextCursor);
    assert.equal(index.problemPage({ ...filter, text: "  STABILIZER rank  ", cursor: first.nextCursor }).offset, 1);
    const now = Date.now();
    context.mock.method(Date, "now", () => now + 61 * 60 * 1000);
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor! }), (error: unknown) => error instanceof SearchError && error.code === "cursor_expired" && error.status === 410);
    context.mock.restoreAll();
    const problem = records.find((record) => record.type === "Problem")!;
    index.rebuild(ledger, new Map(), new Map([[problem.id, { updatedAt: "2026-09-14T00:00:00Z", createdAt: "2026-09-01T00:00:00Z", basis: "tex-git-history" }]]));
    assert.throws(() => index.problemPage({ ...filter, cursor: first.nextCursor! }), (error: unknown) => error instanceof SearchError && error.code === "catalog_changed");
  } finally { context.mock.restoreAll(); index.close(); }
});

test("cursor signing survives a service index reopen", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "qop-search-cursor-"));
  const dbPath = path.join(dir, "index.sqlite");
  const { records } = fixture();
  const index = new Index(dbPath);
  index.rebuild(new Ledger(records), new Map());
  const first = index.problemPage({ limit: 1, indexedOnly: false });
  index.close();
  const reopened = new Index(dbPath);
  try {
    assert.ok(first.nextCursor);
    assert.equal(reopened.problemPage({ limit: 1, indexedOnly: false, cursor: first.nextCursor }).offset, 1);
  } finally { reopened.close(); fs.rmSync(dir, { recursive: true, force: true }); }
});

test("normalized query cursors do not cross an exact-alias ranking change", () => {
  const { records, problem } = fixture();
  for (const record of records.filter((record) => record.type === "Problem")) record.body += " QMA(2)";
  (problem.fields["aliases"] as string[]).push("qma2");
  const index = new Index(":memory:");
  try {
    index.rebuild(new Ledger(records), new Map());
    const filter = { text: "qma2", indexedOnly: false, limit: 1 };
    const first = index.problemPage(filter);
    assert.equal(first.rows[0]!.id, problem.id);
    assert.ok(first.nextCursor);
    assert.throws(() => index.problemPage({ ...filter, text: "QMA(2)", cursor: first.nextCursor! }), (error: unknown) => error instanceof SearchError && error.code === "cursor_query_mismatch");
  } finally { index.close(); }
});

test("sampling draws from all matches, including candidates beyond page one, and returns empty populations honestly", (context) => {
  const { records } = fixture();
  const index = new Index(":memory:");
  let population = 0;
  context.mock.method(crypto, "randomInt", (maximum: number) => { population = maximum; return maximum - 1; });
  syncBuiltinESMExports();
  try {
    index.rebuild(new Ledger(records), new Map());
    const filter = { indexedOnly: false, limit: 1 };
    const all = index.problemPage({ ...filter, limit: 1000 });
    assert.ok(all.total > 1);
    const sample = index.sampleProblem(filter);
    assert.equal(population, all.total);
    assert.equal(sample.total, all.total);
    assert.equal(sample.row!.id, all.rows.at(-1)!.id);
    assert.equal(sample.catalogVersion, all.catalogVersion);
    assert.deepEqual(index.sampleProblem({ text: "no-such-scientific-term" }), { row: null, total: 0, catalogVersion: all.catalogVersion });
    assert.throws(() => index.sampleProblem({ ...filter, offset: 1 }), SearchError);
  } finally { context.mock.restoreAll(); syncBuiltinESMExports(); index.close(); }
});

const document = (body: string): SearchDocument => ({ title: "", statement: "", progress: "", body, taxonomy: "", keywords: "", stableId: "", aliases: [] });

test("one-character searches of long words do not repeatedly copy the remaining document", (context) => {
  const size = 16_384;
  const text = "a".repeat(size);
  let slicedUnits = 0;
  const slice = String.prototype.slice;
  context.mock.method(String.prototype, "slice", function (this: string, start?: number, end?: number) {
    const result = slice.call(this, start, end);
    if (String(this).length === size) slicedUnits += result.length;
    return result;
  });
  assert.equal(searchMatch(document(text), "a"), null, "a single letter is not a complete scientific word");
  assert.ok(slicedUnits <= size * 4, `${slicedUnits} copied UTF-16 units exceeds the linear neighbor-reading bound`);
  assert.ok(searchMatch(document(text + " a"), "a"), "a later complete word must remain discoverable");
});

test("scientific word boundaries inspect full astral letters and numbers on both sides of literal terms", () => {
  for (const point of ["𐐨", "𝟘"]) {
    for (const [text, term] of [[`${point}x`, point], [`x${point}`, point], [`${point}${point}`, point], [`x${point}+`, `${point}+`], [`+${point}x`, `+${point}`], [`${point}a`, "a"], [`a${point}`, "a"]]) {
      assert.equal(searchMatch(document(text!), term!), null, `${JSON.stringify(term)} must not match inside ${JSON.stringify(text)}`);
    }
    assert.ok(searchMatch(document(`(${point})`), point));
    assert.ok(searchMatch(document(`🧪${point}🧪`), point), "astral punctuation does not become a word character");
  }
});

test("a rejected literal occurrence does not skip a valid overlapping scientific expression", () => {
  for (const [text, term] of [["xa+a+a", "a+a"], ["x𐐨+𐐨+𐐨", "𐐨+𐐨"]]) {
    const match = searchMatch(document(text!), term!);
    assert.ok(match, `${term} has a valid later overlapping occurrence in ${text}`);
    assert.deepEqual(match.fields, ["body"]);
  }
  for (const term of ["a%a", "a_a", String.raw`\alpha`, "a*a", "a.a", "a[a]"]) {
    assert.ok(searchMatch(document(` ${term} `), term), `${term} remains literal`);
  }
  assert.equal(searchMatch(document(" axa "), "a.a"), null, "a period is not a regex wildcard");
  assert.equal(searchMatch(document(" axa "), "a%a"), null, "percent is not a SQL wildcard");
});
