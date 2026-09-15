import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createService } from "../service/src/service.ts";
import { createServer } from "../service/src/api.ts";
import { distinctQuestionCounts, metadataSlug } from "../site/lib/metadata.mjs";
import { loadMergedProblems } from "../site/lib/merged-problems.mjs";

const repo = path.resolve(import.meta.dirname, "..");
const records = fs.readdirSync(path.join(repo, "database/problems_json")).filter(f => f.endsWith(".json")).map(f => JSON.parse(fs.readFileSync(path.join(repo, "database/problems_json", f), "utf8")));
let root, service, server, base;
const get = async route => {
  const response = await fetch(base + route);
  return { response, body: await response.json() };
};
before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-catalog-access-"));
  for (const directory of ["ledger", "activity"]) fs.cpSync(path.join(repo, directory), path.join(root, directory), { recursive: true });
  service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false });
  server = createServer(service);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (service) { service.index.close(); service.auth.close(); service.submissions.close(); }
  if (root) fs.rmSync(root, { recursive: true, force: true });
});

test("catalog area/topic labels match slugs regardless of case and extra spaces", async () => {
  const expected = records.filter(r => r.fields.includes("Quantum Communication") && r.topics.includes("Private capacity")).map(r => r.ulid).sort();
  assert.ok(expected.length);
  for (const [area, topic] of [["Quantum Communication", "Private capacity"], [" QUANTUM   communication ", "PRIVATE CAPACITY"], [metadataSlug("Quantum Communication"), metadataSlug("Private capacity")]]) {
    const { response, body } = await get(`/api/v1/problems?${new URLSearchParams({ area, topic, limit: "200" })}`);
    assert.equal(response.status, 200);
    assert.deepEqual(body.problems.map(p => p.id).sort(), expected);
    assert.equal(body.total, expected.length);
  }
  const unknown = await get("/api/v1/problems?area=missing-area");
  assert.equal(unknown.response.status, 400);
  assert.match(unknown.body.error, /taxonomy/);
});

test("catalog search reports total matches and paginates every permanent record exactly once", async () => {
  const { body: first } = await get("/api/v1/problems");
  assert.equal(first.total, records.length);
  assert.equal(first.count, Math.min(50, records.length));
  assert.equal(first.unit, "records");
  const ids = [];
  let offset = 0;
  do {
    const { body: page } = await get(`/api/v1/problems?limit=17&offset=${offset}`);
    assert.equal(page.total, records.length);
    assert.equal(page.count, page.problems.length);
    assert.equal(page.offset, offset);
    ids.push(...page.problems.map(p => p.id));
    if (page.nextOffset !== null) assert.ok(page.nextOffset > offset);
    offset = page.nextOffset;
  } while (offset !== null);
  assert.deepEqual(ids.sort(), records.map(r => r.ulid).sort());
  const { body: beyond } = await get(`/api/v1/problems?offset=${records.length + 1}`);
  assert.equal(beyond.total, records.length);
  assert.equal(beyond.count, 0);
  assert.equal(beyond.nextOffset, null);
  assert.equal((await get("/api/v1/problems?offset=-1")).response.status, 400);
  assert.equal((await get("/api/v1/problems?offset=9999999999999999999999")).response.status, 400);
});

test("API record and distinct-question counts agree with the static catalog counting rule", async () => {
  const { body } = await get("/api/v1/status");
  const questions = distinctQuestionCounts(records);
  assert.equal(body.problems.total, records.length);
  assert.equal(body.problems.unit, "records");
  assert.deepEqual(body.problems.byStatus, { Unsolved: records.filter(r => r.status === "Unsolved").length, Solved: records.filter(r => r.status === "Solved").length });
  assert.equal(body.distinctQuestions.total, questions.total);
  assert.deepEqual(body.distinctQuestions.byStatus, { Unsolved: questions.unsolved, Solved: questions.solved });
});

test("problem views omit the duplicate authored record while preserving full opt-in data and TeX rendering hints", async () => {
  const record = [...records].sort((a, b) => JSON.stringify(b).length - JSON.stringify(a).length)[0];
  const { body: compact } = await get(`/api/v1/problems/${record.id}`);
  const { body: full } = await get(`/api/v1/problems/${record.id}?includeAuthoredRecord=true`);
  assert.ok(!Object.hasOwn(compact.authoredCatalog, "record"));
  assert.deepEqual(full.authoredCatalog.record, record);
  assert.deepEqual(compact.statement, full.statement);
  assert.deepEqual(compact.references, full.references);
  assert.equal(compact.statement.clauses.find(c => c.text === record.statement).textFormat, "tex");
  assert.ok(JSON.stringify(compact).length < JSON.stringify(full).length * 0.85);
  // A compact read must not mutate the ledger's authoritative copy.
  assert.deepEqual(service.repo.current().find("Problem", record.ulid).fields.authoredCatalog.record, record);
});

test("merged identities resolve to the canonical problem without entering search, counts or bulk downloads", async () => {
  const merges = loadMergedProblems(repo, records);
  const { body: status } = await get("/api/v1/status");
  assert.equal(status.problems.merged, merges.length);
  assert.equal(status.problems.total, records.length);
  const { body: withCandidates } = await get("/api/v1/problems?includeCandidates=true&limit=1000");
  assert.equal(withCandidates.total, records.length);
  for (const { record, target } of merges) {
    for (const alias of record.aliases) {
      const { response, body } = await get(`/api/v1/problems/${alias}`);
      assert.equal(response.status, 200);
      assert.equal(body.id, target.ulid);
      assert.equal(body.catalogState, "published");
    }
    const { body: search } = await get(`/api/v1/problems?text=${record.id}`);
    assert.ok(search.problems.every(p => p.id !== record.ulid));
    const { body: old } = await get(`/api/v1/records/${record.ulid}`);
    assert.equal(old.authoredCatalog.mergedIntoProblemId, target.ulid);
    assert.deepEqual(old.authoredCatalog.record, record);
    const { body: refs } = await get(`/api/v1/problems/${record.id}/references`);
    assert.equal(refs.problemId, target.ulid);
    const { body: context } = await get(`/api/v1/problems/${record.id}/context?budget=800`);
    assert.equal(context.problemId, target.ulid);
  }
});

test("catalog bibliography searches find authors preserved only in citation text", async () => {
  const sources = service.repo.current().currentOf("Source", { includeRetired: true });
  const expected = sources.filter(s => /watanabe/i.test(s.body)).map(s => s.id);
  assert.ok(expected.length);
  const { body } = await get("/api/v1/sources?text=WATANABE&limit=200");
  for (const id of expected) assert.ok(body.sources.some(s => s.id === id));
  assert.ok(body.sources.some(s => s.authors.length === 0 && /watanabe/i.test(s.citation)));
});

test("published API snapshot is NDJSON and contains all published record ids", async () => {
  const response = await fetch(base + "/api/v1/problems.jsonl");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /^application\/x-ndjson/);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const entries = (await response.text()).trim().split("\n").map(line => JSON.parse(line));
  assert.deepEqual(entries.map(r => r.id).sort(), records.map(r => r.ulid).sort());
  assert.ok(entries.every(r => !r.authoredCatalog.record));
});

test("all served contract and payload schemas use the canonical domain", async () => {
  for (const prefix of ["", "payloads/"]) {
    for (const file of fs.readdirSync(path.join(repo, "contract/schema", prefix)).filter(f => f.endsWith(".schema.json"))) {
      const { response, body } = await get(`/api/v1/schemas/${prefix}${file.replace(".schema.json", "")}`);
      assert.equal(response.status, 200);
      assert.equal(body.$id, `https://qiqc-op.com/contract/v1/${prefix}${file}`);
    }
  }
});
