// The tag taxonomy of database/tags.json. Every problem carries one or two
// fields (the broad research areas it belongs to) and one to five topics
// (the specific objects, techniques, and settings it concerns). A name is
// either a field or a topic, never both, and records use the names verbatim.
//
//   { "fields": ["Quantum Resource Theory", ...], "topics": ["Bell nonlocality", ...] }
//
// No runtime dependencies.

import fs from "node:fs";

export const FIELD_LIMITS = { min: 1, max: 2 };
export const TOPIC_LIMITS = { min: 1, max: 5 };

export const TAG_KINDS = {
  field: { key: "fields", label: "Field", plural: "Fields" },
  topic: { key: "topics", label: "Topic", plural: "Topics" }
};

export class TaxonomyError extends Error {}

// Validate the parsed JSON of tags.json and return the taxonomy with lookup sets.
export function validateTaxonomy(data, fileName = "database/tags.json") {
  const fail = (message) => { throw new TaxonomyError(`${fileName}: ${message}`); };
  if (!data || typeof data !== "object" || Array.isArray(data)) fail('must be a JSON object with "fields" and "topics"');
  const unknown = Object.keys(data).filter((key) => key !== "fields" && key !== "topics");
  if (unknown.length) fail(`unknown key(s): ${unknown.join(", ")}`);
  for (const key of ["fields", "topics"]) {
    const list = data[key];
    const wellFormed = Array.isArray(list) && list.length > 0
      && list.every((name) => typeof name === "string" && name.trim().length > 0 && name.trim() === name);
    if (!wellFormed) fail(`"${key}" must be a non-empty array of trimmed, non-empty strings`);
    if (new Set(list).size !== list.length) fail(`"${key}" contains duplicate names`);
  }
  const fieldSet = new Set(data.fields);
  const both = data.topics.filter((name) => fieldSet.has(name));
  if (both.length) fail(`listed as both a field and a topic: ${both.join(", ")}`);
  return { fields: data.fields.slice(), topics: data.topics.slice(), fieldSet, topicSet: new Set(data.topics) };
}

export function loadTaxonomy(filePath) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new TaxonomyError(`${filePath}: cannot read the taxonomy (${error.message})`);
  }
  return validateTaxonomy(data, filePath);
}

// "field", "topic", or null for a name that is in neither list.
export const kindOf = (name, taxonomy) => (taxonomy.fieldSet.has(name) ? "field" : taxonomy.topicSet.has(name) ? "topic" : null);

// Split a flat list of names, as written in the legacy "Tag" subsection of a
// TeX record, into fields and topics. Names in neither list are kept as
// topics so that the record validation can report them as unknown.
export function classifyTags(names, taxonomy) {
  const fields = [];
  const topics = [];
  for (const name of names) (taxonomy.fieldSet.has(name) ? fields : topics).push(name);
  return { fields, topics };
}
