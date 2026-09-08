import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { canonicalJson, canonicalRecord, recordToTex, validateRecordShape } from "../site/lib/record.mjs";
import { parseProblem } from "../site/lib/tex.mjs";
import { loadTaxonomy } from "../site/lib/taxonomy.mjs";
import { metadataSlug, validateRecordIdentities, distinctQuestionCounts } from "../site/lib/metadata.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const records = fs.readdirSync(path.join(repoRoot, "database/problems_json")).filter((name) => name.endsWith(".json"))
  .map((name) => read(path.join(repoRoot, "database/problems_json", name)));
const canonicalQuestions = records.filter((record) => !record.metadata.equivalentToProblemId);
const expectedQuestionCounts = { total: canonicalQuestions.length,
  unsolved: canonicalQuestions.filter((record) => record.status === "Unsolved").length,
  solved: canonicalQuestions.filter((record) => record.status === "Solved").length };
const example = records.find((record) => record.status === "Solved");
const script = (name, args = []) => spawnSync(process.execPath, [path.join(repoRoot, "scripts", name), ...args], { encoding: "utf8" });
const succeed = (result) => assert.equal(result.status, 0, result.stdout + result.stderr);

// Include the relationship closure instead of choosing a conveniently isolated record.
function fixtureRecords(seed) {
  const included = new Map();
  function visit(record) {
    if (included.has(record.id)) return;
    included.set(record.id, record);
    for (const id of [...record.metadata.relatedProblemIds, ...[record.metadata.parentProblemId, record.metadata.equivalentToProblemId].filter(Boolean)]) {
      const dependency = records.find((other) => other.ulid === id);
      assert.ok(dependency, `missing related fixture record ${id}`);
      visit(dependency);
    }
  }
  visit(seed);
  return [...included.values()];
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qiqcop-metadata-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, "site"));
  fs.mkdirSync(path.join(root, "database/problems_json"), { recursive: true });
  fs.mkdirSync(path.join(root, "database/problems_tex"));
  for (const file of ["site/config.json", "database/tags.json", "database/metadata.json", "database/actors.json", "database/_template.json",
    ...fixtureRecords(example).flatMap((record) => [`database/problems_json/${record.id}.json`, `database/problems_tex/${record.id}.tex`])]) {
    fs.copyFileSync(path.join(repoRoot, file), path.join(root, file));
  }
  return root;
}

test("the authoring schema permits exactly two statuses and hashes metadata separately from TeX content", () => {
  for (const status of ["Solved", "Unsolved"]) validateRecordShape({ ...example, status });
  for (const status of ["open", "partial", "Partially solved", "solved", "refuted", "candidate", "toString"]) {
    assert.throws(() => validateRecordShape({ ...example, status }), /exactly/);
    assert.throws(() => parseProblem(recordToTex({ ...example, status }), { taxonomy: loadTaxonomy(path.join(repoRoot, "database/tags.json")) }), /exactly two statuses/);
  }
  const changed = structuredClone(example);
  changed.metadata.keywords.push("Metadata-only test");
  assert.deepEqual(canonicalRecord(example), canonicalRecord(changed));
  assert.equal(recordToTex(example), recordToTex(changed));
  assert.notEqual(canonicalJson(example), canonicalJson(changed));
});

test("TeX reimport is a byte-preserving no-op and content replacement retains both identities", (t) => {
  const root = fixture(t);
  const jsonPath = path.join(root, `database/problems_json/${example.id}.json`);
  const texPath = path.join(root, `database/problems_tex/${example.id}.tex`);
  const beforeJson = fs.readFileSync(jsonPath, "utf8");
  const beforeTex = fs.readFileSync(texPath, "utf8");
  succeed(script("import-problems.mjs", ["--root", root, texPath]));
  assert.equal(fs.readFileSync(jsonPath, "utf8"), beforeJson);
  assert.equal(fs.readFileSync(texPath, "utf8"), beforeTex);
  const updated = { ...example, comment: `${example.comment}\n\nA deliberate local content update.` };
  const incoming = path.join(root, "incoming.tex");
  fs.writeFileSync(incoming, recordToTex(updated));
  const rejected = script("import-problems.mjs", ["--root", root, incoming]);
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /--replace/);
  assert.equal(fs.readFileSync(jsonPath, "utf8"), beforeJson);
  assert.equal(fs.readFileSync(texPath, "utf8"), beforeTex);
  succeed(script("import-problems.mjs", ["--root", root, "--replace", incoming]));
  const after = read(jsonPath);
  assert.equal(after.comment, updated.comment);
  assert.equal(after.id, example.id);
  assert.equal(after.ulid, example.ulid);
  assert.equal(after.status, example.status);
  assert.deepEqual(after.aliases, example.aliases);
  assert.deepEqual(after.metadata, example.metadata);
});

test("a rejected stale import prevents earlier valid inputs from being written", (t) => {
  const root = fixture(t);
  const newId = "op_0000000000000000";
  const fresh = path.join(root, "fresh.tex");
  const stale = path.join(root, "stale.tex");
  fs.writeFileSync(fresh, recordToTex({ ...example, id: newId }));
  fs.writeFileSync(stale, recordToTex({ ...example, comment: "An older and incomplete account." }));
  const before = fs.readFileSync(path.join(root, `database/problems_json/${example.id}.json`), "utf8");
  const result = script("import-problems.mjs", ["--root", root, fresh, stale]);
  assert.equal(result.status, 1);
  assert.equal(fs.existsSync(path.join(root, `database/problems_json/${newId}.json`)), false);
  assert.equal(fs.readFileSync(path.join(root, `database/problems_json/${example.id}.json`), "utf8"), before);
});

test("metadata migration preserves content, detects taxonomy drift, and is idempotent", (t) => {
  const root = fixture(t);
  const jsonPath = path.join(root, `database/problems_json/${example.id}.json`);
  succeed(script("migrate-metadata.mjs", ["--root", root, "--check"]));
  const legacy = structuredClone(example);
  legacy.schema = "qiqcop-zoo/record/2";
  delete legacy.ulid;
  delete legacy.aliases;
  delete legacy.metadata;
  fs.writeFileSync(jsonPath, JSON.stringify(legacy, null, 2) + "\n");
  const before = fs.readFileSync(jsonPath, "utf8");
  assert.equal(script("migrate-metadata.mjs", ["--root", root, "--check"]).status, 1);
  assert.equal(fs.readFileSync(jsonPath, "utf8"), before);
  succeed(script("migrate-metadata.mjs", ["--root", root]));
  const migrated = read(jsonPath);
  assert.deepEqual(canonicalRecord(migrated), canonicalRecord(example));
  assert.equal(migrated.ulid, example.ulid);
  const once = fs.readFileSync(jsonPath, "utf8");
  succeed(script("migrate-metadata.mjs", ["--root", root]));
  assert.equal(fs.readFileSync(jsonPath, "utf8"), once);
  const taxonomy = loadTaxonomy(path.join(root, "database/tags.json"));
  const changedField = taxonomy.fields.find((field) => !migrated.fields.includes(field));
  assert.ok(changedField, "fixture needs a different canonical field");
  const changed = { ...migrated, fields: [changedField] };
  fs.writeFileSync(jsonPath, JSON.stringify(changed, null, 2) + "\n");
  if (JSON.stringify(changed.fields) !== JSON.stringify(migrated.fields)) {
    assert.equal(script("migrate-metadata.mjs", ["--root", root, "--check"]).status, 1);
  }
  succeed(script("migrate-metadata.mjs", ["--root", root]));
  const synchronized = read(jsonPath);
  assert.deepEqual(synchronized.metadata.areaIds, [metadataSlug(changedField)]);
  assert.equal(synchronized.ulid, example.ulid);
  assert.deepEqual(canonicalRecord(synchronized), canonicalRecord(changed));
  synchronized.status = "Partially solved";
  fs.writeFileSync(jsonPath, JSON.stringify(synchronized, null, 2) + "\n");
  assert.equal(script("migrate-metadata.mjs", ["--root", root]).status, 1);
});

test("new JSON scaffolds receive unique identifiers and can synchronize edited classifications", (t) => {
  const root = fixture(t);
  const result = script("new-problem-id.mjs", ["--root", root, "--create"]);
  succeed(result);
  const file = path.join(root, result.stdout.trim());
  const fresh = read(file);
  assert.notEqual(fresh.id, example.id);
  assert.notEqual(fresh.ulid, example.ulid);
  assert.ok(fresh.aliases.includes(fresh.id));
  assert.ok(fresh.aliases.includes(fresh.ulid));
  Object.assign(fresh, { fields: example.fields, topics: example.topics });
  fs.writeFileSync(file, JSON.stringify(fresh, null, 2) + "\n");
  succeed(script("migrate-metadata.mjs", ["--root", root]));
  validateRecordShape(read(file));
  assert.equal(read(file).ulid, fresh.ulid);
});

test("explicit identity refresh reads the exported ledger's inline aliases without importing its content", (t) => {
  const root = fixture(t);
  const ledgerDir = path.join(root, "ledger/problems/example");
  fs.mkdirSync(ledgerDir, { recursive: true });
  fs.writeFileSync(path.join(ledgerDir, "problem.r1.md"), `---\nid: ${JSON.stringify(example.ulid)}\ntype: "Problem"\nrevision: 1\naliases: ${JSON.stringify(example.aliases)}\n---\nStale content that must never replace the authored record.\n`);
  const git = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8" });
  succeed(git("init", "--quiet"));
  succeed(git("add", "ledger"));
  succeed(git("-c", "user.name=Database test", "-c", "user.email=database-test@example.invalid", "commit", "--quiet", "-m", "Identity fixture"));
  const jsonPath = path.join(root, `database/problems_json/${example.id}.json`);
  const before = fs.readFileSync(jsonPath, "utf8");
  succeed(script("migrate-metadata.mjs", ["--root", root, "--main-ref", "HEAD"]));
  assert.equal(fs.readFileSync(jsonPath, "utf8"), before);
  const mapping = read(path.join(root, "database/metadata.json")).mappings[example.id];
  assert.equal(mapping.mainId, example.ulid);
  assert.ok(mapping.mainAliases.includes(example.id));
  assert.ok(mapping.mainAliases.includes(example.ulid));
});

test("built aliases and main adapter preserve every authored record and binary status", (t) => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), "qiqcop-alias-build-"));
  t.after(() => fs.rmSync(output, { recursive: true, force: true }));
  const build = spawnSync(process.execPath, [path.join(repoRoot, "site/build.mjs"), "--out", output], { encoding: "utf8" });
  succeed(build);
  const identities = read(path.join(output, "api/identifiers.json"));
  const index = read(path.join(output, "api/index.json"));
  assert.equal(index.counts.total, records.length, "compatible counts remain record counts");
  assert.deepEqual(index.counts.distinctQuestions, expectedQuestionCounts);
  const home = fs.readFileSync(path.join(output, "index.html"), "utf8");
  assert.ok(home.includes(`<strong>${expectedQuestionCounts.total}</strong><span>Distinct questions</span>`));
  assert.ok(home.includes(`<strong>${expectedQuestionCounts.solved}</strong><span>Solved</span>`));
  const catalog = fs.readFileSync(path.join(output, "problems/index.html"), "utf8");
  assert.equal(identities.problems.length, records.length);
  for (const record of records) {
    const canonical = fs.readFileSync(path.join(output, `api/problems/${record.id}.json`), "utf8");
    for (const alias of record.aliases) {
      assert.equal(identities.aliases[alias].ulid, record.ulid);
      assert.equal(fs.readFileSync(path.join(output, `api/problems/${alias}.json`), "utf8"), canonical);
      assert.equal(fs.readFileSync(path.join(output, `api/v1/problems/${alias}.json`), "utf8"), canonical);
      assert.ok(fs.readFileSync(path.join(output, `problems/${alias}/index.html`), "utf8").includes(`../../problem/${record.id}/`));
      assert.ok(fs.readFileSync(path.join(output, `packets/${alias}.md`), "utf8").includes(record.statement));
      if (alias !== record.id) assert.match(fs.readFileSync(path.join(output, `problem/${alias}/index.html`), "utf8"), new RegExp(`../${record.id}/`));
    }
    assert.ok(catalog.includes(record.ulid.toLowerCase()));
    const adapter = read(path.join(output, `api/main/problems/${record.ulid}.json`));
    assert.equal(adapter.status, record.status);
    assert.equal(adapter.problem.id, record.ulid);
    assert.deepEqual(adapter.record, record);
    assert.equal(adapter.problem.body, record.comment);
    assert.equal(adapter.problem.title, record.title);
    assert.ok(adapter.problem.aliases.includes(record.id.replace("_", "-").toLowerCase()));
    assert.equal(Object.hasOwn(adapter.problem, "status"), false);
  }
  assert.equal(fs.readFileSync(path.join(output, "api/v1/problems.jsonl"), "utf8").trim().split("\n").length, records.length);
  assert.equal(read(path.join(output, "feed.json")).items.length, records.length);
  for (const dir of fs.readdirSync(path.join(output, "tag"))) {
    const page = fs.readFileSync(path.join(output, "tag", dir, "index.html"), "utf8");
    if (!page.includes("Historical classification")) continue;
    assert.ok(page.includes(`href="../../problems/?legacyTag=${dir}"`));
    assert.ok(page.includes(`rel="canonical" href="${read(path.join(repoRoot, "site/config.json")).siteUrl.replace(/\/$/, "")}/tag/${dir}/"`));
  }
  assert.ok(read(path.join(output, "api/v1/release.json")).catalogDigest.startsWith("sha256:"));
});


test("equivalent records retain both identities but count as one question", () => {
  const base = { ...example, metadata: { ...example.metadata, relatedProblemIds: [] } };
  const canonical = { ...base, id: "op_0000000000000aa1", ulid: "01AAAAAAAAAAAAAAAAAAAAAAAA", aliases: ["op_0000000000000aa1", "01AAAAAAAAAAAAAAAAAAAAAAAA", "op-0000000000000aa1"] };
  const duplicate = { ...base, id: "op_0000000000000aa2", ulid: "01BBBBBBBBBBBBBBBBBBBBBBBB", aliases: ["op_0000000000000aa2", "01BBBBBBBBBBBBBBBBBBBBBBBB", "op-0000000000000aa2"], metadata: { ...base.metadata, equivalentToProblemId: "01AAAAAAAAAAAAAAAAAAAAAAAA" } };
  validateRecordIdentities([duplicate, canonical]);
  assert.deepEqual(distinctQuestionCounts([duplicate, canonical]), { total: 1, unsolved: canonical.status === "Unsolved" ? 1 : 0, solved: canonical.status === "Solved" ? 1 : 0 });
  assert.deepEqual(distinctQuestionCounts(records), expectedQuestionCounts);
  const loop = structuredClone(canonical);
  loop.metadata.equivalentToProblemId = duplicate.ulid;
  assert.throws(() => validateRecordIdentities([duplicate, loop]), /canonical problem/);
  assert.throws(() => validateRecordIdentities([{ ...duplicate, status: canonical.status === "Solved" ? "Unsolved" : "Solved" }, canonical]), /same status/);
});


test("question totals grow with new independent records without revising count fixtures", () => {
  for (const status of ["Solved", "Unsolved"]) {
    const fresh = { ...example, id: `fixture-${status}`, ulid: `fixture-${status}`, status, metadata: {} };
    const expected = { ...expectedQuestionCounts, total: expectedQuestionCounts.total + 1 };
    expected[status.toLowerCase()] += 1;
    assert.deepEqual(distinctQuestionCounts([...records, fresh]), expected);
  }
});
