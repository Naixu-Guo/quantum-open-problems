// Main-compatible metadata for the authored JSON database. Research status
// remains an authored Solved/Unsolved value outside main's Problem contract.
import { createHash } from "node:crypto";

export const DEFAULT_METADATA_CREATED_AT = "2026-09-04T22:04:59Z";
export const ULID_PATTERN = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const OP_ID_PATTERN = /^op_[A-Za-z0-9]{16}$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ALIAS_PATTERN = /^(?:op_[A-Za-z0-9]{16}|[0-7][0-9A-HJKMNP-TV-Z]{25}|[a-z0-9]+(?:-[a-z0-9]+)*)$/;
export const METADATA_KEYS = [
  "type", "schemaVersion", "revision", "createdBy", "createdAt", "role",
  "parentProblemId", "parentClauseId", "origin", "posed", "areaIds", "topicIds",
  "keywords", "difficulty", "verificationCost", "relatedProblemIds"
];

export class MetadataError extends Error {}

// Keep this identical to the public URL slug rule in tex.mjs, without making
// the record and TeX libraries depend on each other.
export const metadataSlug = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const filled = (value) => typeof value === "string" && value.trim().length > 0;
const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const unique = (values) => [...new Set(values)];
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (month === undefined) return true;
  if (month < 1 || month > 12) return false;
  if (day === undefined) return true;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return day >= 1 && day <= [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

function validTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  const [hour, minute, second] = value.slice(11, 19).split(":").map(Number);
  return validDate(value.slice(0, 10)) && hour < 24 && minute < 60 && second < 60 && Number.isFinite(Date.parse(value));
}

// A stable 128-bit ULID: the ordinary 48-bit timestamp followed by 80 bits
// of a namespaced key hash. Persist the result; do not regenerate on edits.
export function deterministicUlid(key, timestamp = DEFAULT_METADATA_CREATED_AT) {
  if (!filled(key)) throw new MetadataError("ULID key must be a non-empty string");
  if (!validTimestamp(timestamp)) throw new MetadataError("ULID timestamp must be a valid ISO date-time");
  const milliseconds = Date.parse(timestamp);
  if (milliseconds < 0 || milliseconds > 281474976710655) throw new MetadataError("ULID timestamp must fit an unsigned 48-bit value");
  const hash = createHash("sha256").update(`qiqcop-zoo:${key}`).digest();
  let value = BigInt(milliseconds) << 80n;
  for (let index = 0; index < 10; index += 1) value |= BigInt(hash[index]) << BigInt((9 - index) * 8);
  const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  let result = "";
  for (let index = 0; index < 26; index += 1) {
    result = alphabet[Number(value & 31n)] + result;
    value >>= 5n;
  }
  return result;
}

// Creation is explicit; validation and normal serialization never fill in
// missing metadata. Existing metadata survives unless an option overrides it.
export function createRecordMetadata(record, options = {}) {
  if (!isObject(record) || !Array.isArray(record.fields) || !Array.isArray(record.topics)) throw new MetadataError("metadata creation requires an authored record with fields and topics");
  if (!isObject(options)) throw new MetadataError("metadata options must be an object");
  if (record.metadata !== undefined) validateRecordMetadata(record);
  for (const aliases of [record.aliases, options.aliases]) {
    if (aliases !== undefined && !Array.isArray(aliases)) throw new MetadataError("aliases must be an array");
  }
  const existing = record.metadata ?? {};
  const createdAt = options.createdAt ?? existing.createdAt ?? DEFAULT_METADATA_CREATED_AT;
  const ulid = options.ulid ?? record.ulid ?? deterministicUlid(`problem:${record.id}`, createdAt);
  const defaults = {
    type: "Problem", schemaVersion: "1.0", revision: 1,
    createdBy: deterministicUlid("actor:metadata-system", createdAt), createdAt,
    role: "primary", parentProblemId: null, parentClauseId: null,
    origin: /^\s*(?:\\texttt\{)?Contributor:/.test(record.source ?? "") ? "editor-formulated" : "source-stated", posed: null,
    areaIds: record.fields.map(metadataSlug), topicIds: record.topics.map(metadataSlug),
    keywords: [], difficulty: "unrated", verificationCost: "unrated", relatedProblemIds: []
  };
  const supplied = Object.fromEntries(METADATA_KEYS.filter((key) => options[key] !== undefined).map((key) => [key, options[key]]));
  const values = { ...defaults, ...existing, ...supplied };
  const metadata = Object.fromEntries(METADATA_KEYS.map((key) => [key, Array.isArray(values[key]) ? values[key].slice() : values[key]]));
  const aliases = unique([record.id, ulid, metadataSlug(record.id), ...(record.aliases ?? []), ...(options.aliases ?? [])]);
  const result = { ulid, aliases, metadata };
  validateRecordMetadata({ ...record, ...result });
  return result;
}

export function validateRecordMetadata(record, fileName = "record") {
  const fail = (message) => { throw new MetadataError(`${fileName}: ${message}`); };
  if (!isObject(record)) fail("the record must be an object");
  if (typeof record.id !== "string" || !OP_ID_PATTERN.test(record.id)) fail("id must be an op_ identifier with sixteen alphanumeric characters");
  if (typeof record.ulid !== "string" || !ULID_PATTERN.test(record.ulid)) fail("ulid must be a valid 128-bit uppercase ULID");
  const list = (value, name, predicate) => {
    if (!Array.isArray(value) || !value.every(predicate)) fail(`${name} must be an array of valid values`);
    if (new Set(value).size !== value.length) fail(`${name} must not contain duplicates`);
  };
  list(record.aliases, "aliases", (value) => typeof value === "string" && ALIAS_PATTERN.test(value));
  for (const alias of [record.id, record.ulid, metadataSlug(record.id)]) {
    if (!record.aliases.includes(alias)) fail(`aliases must include ${alias}`);
  }
  const metadata = record.metadata;
  if (!isObject(metadata)) fail("metadata must be an object");
  const missing = METADATA_KEYS.filter((key) => !Object.hasOwn(metadata, key));
  if (missing.length) fail(`metadata is missing field(s): ${missing.join(", ")}`);
  const unknown = Object.keys(metadata).filter((key) => !METADATA_KEYS.includes(key));
  if (unknown.length) fail(`unknown metadata field(s): ${unknown.join(", ")}`);
  if (metadata.type !== "Problem") fail('metadata.type must be "Problem"');
  if (metadata.schemaVersion !== "1.0") fail('metadata.schemaVersion must be "1.0"');
  if (!Number.isSafeInteger(metadata.revision) || metadata.revision < 1) fail("metadata.revision must be a positive integer");
  if (typeof metadata.createdBy !== "string" || !ULID_PATTERN.test(metadata.createdBy)) fail("metadata.createdBy must be a ULID");
  if (!validTimestamp(metadata.createdAt)) fail("metadata.createdAt must be a valid ISO date-time");
  if (!["primary", "auxiliary"].includes(metadata.role)) fail("metadata.role must be primary or auxiliary");
  if (metadata.parentProblemId !== null && (typeof metadata.parentProblemId !== "string" || !ULID_PATTERN.test(metadata.parentProblemId))) fail("metadata.parentProblemId must be a ULID or null");
  if (metadata.parentClauseId !== null && (typeof metadata.parentClauseId !== "string" || !/^[0-7][0-9A-HJKMNP-TV-Z]{25}#[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.parentClauseId))) fail("metadata.parentClauseId must be a statement ULID and clause slug, or null");
  if (metadata.role === "primary" && (metadata.parentProblemId !== null || metadata.parentClauseId !== null)) fail("a primary problem must have null parent fields");
  if (metadata.role === "auxiliary" && metadata.parentProblemId === null) fail("an auxiliary problem must name a parentProblemId");
  if (metadata.role === "auxiliary" && metadata.parentClauseId === null) fail("an auxiliary problem must name a parentClauseId");
  if (!["source-stated", "derived", "editor-formulated", "agent-formulated"].includes(metadata.origin)) fail("metadata.origin is not a main-compatible origin");
  if (metadata.posed !== null && !validDate(metadata.posed)) fail("metadata.posed must be a valid year, year-month, date, or null");
  for (const [key, names] of [["areaIds", record.fields], ["topicIds", record.topics]]) {
    list(metadata[key], `metadata.${key}`, (value) => typeof value === "string" && SLUG_PATTERN.test(value));
    if (!Array.isArray(names) || !names.every(filled)) fail(`${key === "areaIds" ? "fields" : "topics"} must be an array of names`);
    if (!same(metadata[key], names.map(metadataSlug))) fail(`metadata.${key} must match the slugs of ${key === "areaIds" ? "fields" : "topics"} in order`);
  }
  list(metadata.keywords, "metadata.keywords", filled);
  if (!["unrated", "accessible", "hard", "very-hard"].includes(metadata.difficulty)) fail("metadata.difficulty is not a main-compatible difficulty");
  if (!["unrated", "low", "medium", "high"].includes(metadata.verificationCost)) fail("metadata.verificationCost is not a main-compatible verification cost");
  list(metadata.relatedProblemIds, "metadata.relatedProblemIds", (value) => typeof value === "string" && ULID_PATTERN.test(value));
  return record;
}

// This projection is the Problem object shape from main. It deliberately
// excludes research status, statements, reviews, and decisions: none of those
// can be inferred from the existence of compatible Problem metadata.
export function metadataToMainProblem(record) {
  validateRecordMetadata(record);
  return {
    id: record.ulid,
    ...Object.fromEntries(METADATA_KEYS.map((key) => [key, Array.isArray(record.metadata[key]) ? record.metadata[key].slice() : record.metadata[key]])),
    title: record.title,
    aliases: record.aliases.filter((alias) => SLUG_PATTERN.test(alias)),
    body: record.comment
  };
}

// Validate the identity graph after all records have been loaded, so aliases
// and relationships cannot silently point at a different or missing problem.
export function validateRecordIdentities(records) {
  if (!Array.isArray(records)) throw new MetadataError("records must be an array");
  const owners = new Map();
  const byUlid = new Map();
  for (const record of records) {
    validateRecordMetadata(record, record.id ?? "record");
    for (const alias of unique([record.id, record.ulid, ...record.aliases])) {
      const owner = owners.get(alias);
      if (owner) throw new MetadataError(`${record.id}: identity ${alias} is also used by ${owner.id}`);
      owners.set(alias, record);
    }
    byUlid.set(record.ulid, record);
  }
  for (const record of records) {
    const { parentProblemId, relatedProblemIds } = record.metadata;
    for (const id of [...relatedProblemIds, ...(parentProblemId ? [parentProblemId] : [])]) {
      if (id === record.ulid) throw new MetadataError(`${record.id}: a relationship must not refer to the problem itself`);
      if (!byUlid.has(id)) throw new MetadataError(`${record.id}: related or parent problem ${id} does not exist`);
    }
    const visited = new Set([record.ulid]);
    let parent = parentProblemId;
    while (parent !== null) {
      if (visited.has(parent)) throw new MetadataError(`${record.id}: parent relationships contain a cycle`);
      visited.add(parent);
      parent = byUlid.get(parent)?.metadata.parentProblemId ?? null;
    }
  }
  return records;
}
