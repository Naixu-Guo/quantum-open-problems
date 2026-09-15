import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { canonicalJson, canonicalRecord, orderRecord, recordDifferences, recordToJson, recordToTex, validateRecordShape } from "../site/lib/record.mjs";

const database = new URL("../database/problems_json/", import.meta.url);
const records = fs.readdirSync(database).filter(name => name.endsWith(".json"))
  .map(name => JSON.parse(fs.readFileSync(new URL(name, database), "utf8")));
const example = records[0];
const named = { name: "Ada Example", affiliation: "Example University", anonymous: false };

test("contributors require explicit per-problem attribution and anonymous entries contain no identity", () => {
  const publicRecord = validateRecordShape({ ...example, contributors: [named, { name: "Robin Example", anonymous: false }] });
  const anonymousRecord = validateRecordShape({ ...example, contributors: [{ anonymous: true }] });
  assert.deepEqual(publicRecord.contributors, [named, { name: "Robin Example", anonymous: false }]);
  assert.deepEqual(anonymousRecord.contributors, [{ anonymous: true }], "the same contributor can be anonymous for another problem without a public identity link");
  assert.deepEqual(validateRecordShape({ ...example, contributors: [] }).contributors, []);
  for (const contributors of [null, undefined, {}, "Ada Example"]) {
    assert.throws(() => validateRecordShape({ ...example, contributors }), /contributors.*must be an array/);
  }
  for (const entry of [null, "Ada Example", []]) {
    assert.throws(() => validateRecordShape({ ...example, contributors: [entry] }), /contributor 1 must be an object/);
  }
  for (const anonymous of [undefined, null, "false", "true", 0, 1]) {
    assert.throws(() => validateRecordShape({ ...example, contributors: [{ name: "Ada Example", anonymous }] }), /must explicitly set "anonymous"/);
  }
  for (const name of [undefined, null, "", "   ", 1]) {
    assert.throws(() => validateRecordShape({ ...example, contributors: [{ name, anonymous: false }] }), /non-empty "name"/);
  }
  for (const key of ["name", "email", "affiliation", "actorId"]) {
    assert.throws(() => validateRecordShape({ ...example, contributors: [{ anonymous: true, [key]: "Private identity" }] }), /anonymous contributors must contain no identifying details/);
  }
  assert.throws(() => validateRecordShape({ ...example, contributors: [{ ...named, email: "private@example.invalid" }] }), /disallowed field\(s\): email/);
  assert.throws(() => validateRecordShape({ ...example, contributors: [{ ...named, affiliation: null }] }), /"affiliation" must be a string/);
});

test("existing records keep their previous serialization and digest inputs when contributors are absent", () => {
  for (const record of records) {
    const without = structuredClone(record);
    delete without.contributors;
    const expected = JSON.stringify({ schema: without.schema, ...canonicalRecord(without), ulid: without.ulid, aliases: without.aliases, metadata: without.metadata });
    assert.equal(Object.hasOwn(validateRecordShape(without), "contributors"), false);
    assert.equal(Object.hasOwn(orderRecord(without), "contributors"), false);
    assert.equal(Object.hasOwn(JSON.parse(recordToJson(without)), "contributors"), false);
    assert.equal(canonicalJson(without), expected, `${record.id} retains its digest input`);
  }
});

test("attribution changes JSON digests while staying outside TeX content and synchronization", () => {
  const credited = { ...example, contributors: [named, { anonymous: true }] };
  const anonymous = { ...example, contributors: [{ anonymous: true }] };
  const reordered = { ...example, contributors: [{ anonymous: false, affiliation: named.affiliation, name: named.name }, { anonymous: true }] };
  assert.deepEqual(JSON.parse(recordToJson(credited)).contributors, credited.contributors);
  assert.deepEqual(JSON.parse(canonicalJson(credited)).contributors, credited.contributors);
  assert.equal(recordToJson(credited), recordToJson(reordered), "contributor object keys have a stable order");
  assert.equal(canonicalJson(credited), canonicalJson(reordered));
  assert.notEqual(canonicalJson(example), canonicalJson(credited));
  assert.notEqual(canonicalJson(anonymous), canonicalJson(credited));
  assert.notEqual(canonicalJson({ ...example, contributors: [{ ...named, affiliation: "New University" }] }), canonicalJson({ ...example, contributors: [named] }));
  assert.deepEqual(canonicalRecord(example), canonicalRecord(credited));
  assert.equal(recordToTex(example), recordToTex(credited));
  assert.deepEqual(recordDifferences(example, credited), []);
  const ordered = orderRecord(credited);
  ordered.contributors[0].name = "Edited copy";
  assert.equal(credited.contributors[0].name, named.name, "canonical ordering does not share mutable contributor entries");
});
