import test from "node:test";
import assert from "node:assert/strict";
import {
  ALIAS_PATTERN, ULID_PATTERN, DEFAULT_METADATA_CREATED_AT,
  createRecordMetadata, deterministicUlid, metadataSlug, metadataToMainProblem,
  validateRecordMetadata, validateRecordIdentities
} from "../site/lib/metadata.mjs";

function record(id = "op_0123456789abcdef", options = {}) {
  const authored = {
    id, title: "An unchanged $d$-dimensional question", status: "Solved",
    fields: ["Quantum information theory"], topics: ["Bell nonlocality"],
    statement: "Does the example exist?", source: "The current source.",
    progress: ["The current result."], references: [{ key: "AB26", label: "ref:ab", tex: "The current reference." }],
    comment: "The current comment."
  };
  return { ...authored, ...createRecordMetadata(authored, options) };
}

test("deterministic ULIDs use the timestamp and fit the real 128-bit range", () => {
  const first = deterministicUlid("example", DEFAULT_METADATA_CREATED_AT);
  assert.match(first, ULID_PATTERN);
  assert.equal(first, deterministicUlid("example", DEFAULT_METADATA_CREATED_AT));
  assert.notEqual(first, deterministicUlid("another", DEFAULT_METADATA_CREATED_AT));
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const timestamp = [...first.slice(0, 10)].reduce((value, char) => value * 32 + alphabet.indexOf(char), 0);
  assert.equal(timestamp, Date.parse(DEFAULT_METADATA_CREATED_AT));
  assert.equal(ULID_PATTERN.test(`8${first.slice(1)}`), false);
  assert.throws(() => deterministicUlid("key", "2026-02-30T00:00:00Z"), /date-time/);
  assert.throws(() => deterministicUlid("key", "2026-09-04T24:00:00Z"), /date-time/);
  assert.throws(() => deterministicUlid("key", "1960-01-01T00:00:00Z"), /48-bit/);
});

test("metadata creation retains authored content and existing identity on reruns", () => {
  const original = record();
  const before = structuredClone(original);
  const rerun = createRecordMetadata(original);
  assert.deepEqual(original, before);
  assert.deepEqual(rerun, { ulid: original.ulid, aliases: original.aliases, metadata: original.metadata });
  assert.ok(original.aliases.includes(original.id));
  assert.ok(original.aliases.includes(original.ulid));
  assert.ok(original.aliases.includes("op-0123456789abcdef"));
  assert.ok(original.aliases.every((alias) => ALIAS_PATTERN.test(alias)));
  assert.equal(metadataSlug("Quantum information theory"), "quantum-information-theory");
  rerun.metadata.areaIds.push("another-area");
  assert.deepEqual(original.metadata.areaIds, ["quantum-information-theory"]);
  original.metadata.extra = "must not be silently removed";
  assert.throws(() => createRecordMetadata(original), /unknown metadata/);
});

test("malformed metadata and unsafe aliases are rejected", () => {
  const invalid = [
    [(r) => { r.ulid = `8${r.ulid.slice(1)}`; }, /128-bit/],
    [(r) => { r.aliases = r.aliases.filter((alias) => alias !== r.id); }, /aliases must include/],
    [(r) => { r.aliases.push("../../escape"); }, /aliases/],
    [(r) => { r.aliases.push(r.id); }, /duplicates/],
    [(r) => { r.metadata.reviewed = true; }, /unknown metadata/],
    [(r) => { delete r.metadata.origin; }, /missing field/],
    [(r) => { r.metadata.revision = 0; }, /positive integer/],
    [(r) => { r.metadata.createdAt = "2026-02-30T00:00:00Z"; }, /date-time/],
    [(r) => { r.metadata.posed = "2025-02-29"; }, /metadata.posed/],
    [(r) => { r.metadata.areaIds = ["quantum-information"]; }, /slugs of fields/],
    [(r) => { r.metadata.topicIds = ["quantum-designs"]; }, /slugs of topics/],
    [(r) => { r.metadata.parentProblemId = deterministicUlid("parent"); }, /primary problem/],
    [(r) => { r.metadata.role = "auxiliary"; }, /name a parent/],
    [(r) => { r.metadata.role = "auxiliary"; r.metadata.parentProblemId = deterministicUlid("parent"); }, /name a parentClauseId/]
  ];
  for (const [mutate, error] of invalid) {
    const value = record();
    mutate(value);
    assert.throws(() => validateRecordMetadata(value), error);
  }
});

test("main projection uses the ULID, compatible aliases, and current content", () => {
  const current = record();
  current.aliases.push("existing-main-alias");
  const problem = metadataToMainProblem(current);
  assert.equal(problem.id, current.ulid);
  assert.equal(problem.title, current.title);
  assert.equal(problem.body, current.comment);
  assert.deepEqual(problem.aliases, ["op-0123456789abcdef", "existing-main-alias"]);
  assert.equal(problem.type, "Problem");
  for (const excluded of ["status", "catalogState", "reviews", "decisions", "statement", "ulid", "metadata"]) assert.equal(Object.hasOwn(problem, excluded), false);
  assert.equal(current.status, "Solved");
});

test("contributor attributions default to editor-formulated without changing existing origins", () => {
  for (const source of ["Contributor: Bikun Li.", "\\texttt{Contributor: Bikun Li.}"]) {
    const authored = record();
    delete authored.metadata;
    authored.source = source;
    assert.equal(createRecordMetadata(authored).metadata.origin, "editor-formulated");
  }
  const existing = record();
  existing.source = "Contributor: Bikun Li.";
  assert.equal(createRecordMetadata(existing).metadata.origin, "source-stated");
});

test("all public identifiers have one owner", () => {
  const first = record();
  const second = record("op_fedcba9876543210");
  assert.equal(validateRecordIdentities([first, second]).length, 2);
  second.aliases.push(first.id);
  assert.throws(() => validateRecordIdentities([first, second]), /also used/);
  assert.throws(() => validateRecordIdentities([first, first]), /also used/);
  const third = record("op_0000000000000000", { ulid: first.ulid });
  assert.throws(() => validateRecordIdentities([first, third]), /also used/);
});

test("relationships require existing distinct problems and acyclic parents", () => {
  const first = record();
  const second = record("op_fedcba9876543210");
  first.metadata.relatedProblemIds = [second.ulid];
  validateRecordIdentities([first, second]);
  assert.throws(() => validateRecordIdentities([first]), /does not exist/);
  first.metadata.relatedProblemIds = [first.ulid];
  assert.throws(() => validateRecordIdentities([first, second]), /itself/);
  first.metadata.relatedProblemIds = [];
  first.metadata.role = "auxiliary";
  first.metadata.parentProblemId = second.ulid;
  first.metadata.parentClauseId = `${deterministicUlid("statement:second")}#main`;
  validateRecordIdentities([first, second]);
  second.metadata.role = "auxiliary";
  second.metadata.parentProblemId = first.ulid;
  second.metadata.parentClauseId = `${deterministicUlid("statement:first")}#main`;
  assert.throws(() => validateRecordIdentities([first, second]), /cycle/);
});
