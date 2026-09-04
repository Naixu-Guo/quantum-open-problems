// The problem record: the JSON schema of database/problems_json/<id>.json,
// its validation, the canonical form used to compare records, and the TeX
// serialization written to database/problems_tex/<id>.tex.
//
// A record file holds the TeX fragments of one problem:
//
//   {
//     "schema": "qiqcop-zoo/record/3",
//     "id": "op_0123456789abcdef",
//     "ulid": "...", "aliases": [...], "metadata": { ... },
//     "title": "TeX title",
//     "status": "Unsolved" | "Solved",
//     "fields": ["Canonical field", ...],        // one or two, from database/tags.json "fields"
//     "topics": ["Canonical topic", ...],        // one to five, from database/tags.json "topics"
//     "statement": "TeX of the problem statement",
//     "source": "TeX of the source attribution",
//     "progress": ["TeX of one progress item", ...],
//     "references": [{ "key": "AutYY", "label": "ref:...", "tex": "TeX entry" }, ...],
//     "comment": "TeX of the comment"
//   }
//
// Version 2 split tags into fields/topics. Version 3 adds main-compatible
// problem metadata without changing the authored content or the TeX format.

import { validateRecordMetadata, MetadataError } from "./metadata.mjs";

export const RECORD_SCHEMA = "qiqcop-zoo/record/3";

export const RECORD_KEYS = ["schema", "id", "ulid", "aliases", "metadata", "title", "status", "fields", "topics", "statement", "source", "progress", "references", "comment"];

export const ID_PATTERN = /^op_[A-Za-z0-9]{16}$/;

export class RecordError extends Error {}

const isString = (value) => typeof value === "string";
const isFilled = (value) => isString(value) && value.trim().length > 0;

// Validate the shape of a parsed JSON record and return it with the keys in
// canonical order. Content rules (status values, the number of fields and
// topics and their membership in the taxonomy, citations, equation labels)
// are checked when the record is rendered.
export function validateRecordShape(data, fileName = "record") {
  const fail = (message) => { throw new RecordError(`${fileName}: ${message}`); };
  if (!data || typeof data !== "object" || Array.isArray(data)) fail("the record must be a JSON object");
  if (data.schema === "qiqcop-zoo/record/1" || (data.schema === undefined && "tags" in data)) {
    fail(`records of schema version 1 list a single "tags" array; split it into "fields" and "topics" (see database/tags.json) and set "schema" to "${RECORD_SCHEMA}"`);
  }
  if (data.schema === "qiqcop-zoo/record/2") fail("schema version 2 needs identity and problem metadata; run: node scripts/migrate-metadata.mjs");
  const unknown = Object.keys(data).filter((key) => !RECORD_KEYS.includes(key));
  if (unknown.length) fail(`unknown field(s): ${unknown.join(", ")}`);
  if (data.schema !== RECORD_SCHEMA) fail(`unsupported schema "${data.schema}"; expected "${RECORD_SCHEMA}"`);
  if (!isString(data.id) || !ID_PATTERN.test(data.id)) fail("\"id\" must be \"op_\" followed by sixteen alphanumeric characters");
  if (!isFilled(data.title)) fail("\"title\" must be a non-empty string");
  if (/[\r\n]/.test(data.title)) fail("\"title\" must be a single line");
  if (data.status !== "Solved" && data.status !== "Unsolved") fail('"status" must be exactly "Solved" or "Unsolved"');
  if (!Array.isArray(data.fields) || data.fields.length === 0 || !data.fields.every(isFilled)) fail("\"fields\" must be a non-empty array of strings");
  if (!Array.isArray(data.topics) || data.topics.length === 0 || !data.topics.every(isFilled)) fail("\"topics\" must be a non-empty array of strings");
  if (!isFilled(data.statement)) fail("\"statement\" must be a non-empty string");
  if (!isFilled(data.source)) fail("\"source\" must be a non-empty string");
  if (!Array.isArray(data.progress) || data.progress.length === 0 || !data.progress.every(isFilled)) fail("\"progress\" must be a non-empty array of strings");
  if (!Array.isArray(data.references) || data.references.length === 0) fail("\"references\" must be a non-empty array");
  data.references.forEach((entry, index) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) fail(`reference ${index + 1} must be an object`);
    const extra = Object.keys(entry).filter((key) => !["key", "label", "tex"].includes(key));
    if (extra.length) fail(`reference ${index + 1} has unknown field(s): ${extra.join(", ")}`);
    if (!isFilled(entry.key)) fail(`reference ${index + 1} needs a "key" such as "BDSW96"`);
    if (!isFilled(entry.label)) fail(`reference ${index + 1} needs a "label" such as "ref:abcd-source"`);
    if (!isFilled(entry.tex)) fail(`reference ${index + 1} needs a "tex" entry`);
  });
  if (!isFilled(data.comment)) fail("\"comment\" must be a non-empty string");
  try {
    validateRecordMetadata(data, fileName);
  } catch (error) {
    if (error instanceof MetadataError) throw new RecordError(error.message);
    throw error;
  }
  return orderRecord(data);
}

// Put the fields in canonical order so every record file reads the same way.
export function orderRecord(record) {
  return {
    schema: RECORD_SCHEMA,
    id: record.id,
    ulid: record.ulid,
    aliases: record.aliases.slice(),
    metadata: structuredClone(record.metadata),
    title: record.title,
    status: record.status,
    fields: record.fields.slice(),
    topics: record.topics.slice(),
    statement: record.statement,
    source: record.source,
    progress: record.progress.slice(),
    references: record.references.map((entry) => ({ key: entry.key, label: entry.label, tex: entry.tex })),
    comment: record.comment
  };
}

// Canonical form of a TeX fragment: LF line endings, at most one blank line
// in a row, trimmed. Spaces inside lines are kept verbatim because TeX gives
// them meaning (a control space at the end of a line, for example).
export const canonicalTex = (value) => String(value)
  .replace(/\r\n/g, "\n")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

// The canonical authored content: what the TeX sync check compares. Metadata
// deliberately stays in JSON so adding identities never rewrites the TeX.
export function canonicalRecord(record) {
  return {
    id: record.id.trim(),
    title: canonicalTex(record.title),
    status: record.status.trim(),
    fields: record.fields.map((name) => name.trim()),
    topics: record.topics.map((name) => name.trim()),
    statement: canonicalTex(record.statement),
    source: canonicalTex(record.source),
    progress: record.progress.map(canonicalTex),
    references: record.references.map((entry) => ({ key: entry.key.trim(), label: entry.label.trim(), tex: canonicalTex(entry.tex) })),
    comment: canonicalTex(record.comment)
  };
}

// The public JSON digest also changes when identity or metadata changes.
export const canonicalJson = (record) => JSON.stringify({
  schema: RECORD_SCHEMA,
  ...canonicalRecord(record),
  ulid: record.ulid,
  aliases: record.aliases,
  metadata: record.metadata
});

// Names of the fields whose canonical content differs between two records.
export function recordDifferences(a, b) {
  const left = canonicalRecord(a);
  const right = canonicalRecord(b);
  return Object.keys(left).filter((key) => JSON.stringify(left[key]) !== JSON.stringify(right[key]));
}

// The JSON text of a record file: canonical key order, two-space indent.
export function recordToJson(record) {
  return `${JSON.stringify(orderRecord(record), null, 2)}\n`;
}

// The TeX form of a record, in the layout of database/_template.tex. Every
// fragment is written verbatim so that the TeX parser reads the file back to
// the same record, which is what the build's sync check relies on.
export function recordToTex(record, { jsonPath = "database/problems_json" } = {}) {
  const items = record.progress.map((item) => `  \\item ${canonicalTex(item)}`).join("\n\n");
  const entries = record.references.map((entry) => `  \\item[\\textup{[${entry.key.trim()}]}]\\label{${entry.label.trim()}}\n  ${canonicalTex(entry.tex)}`).join("\n\n");
  const fields = record.fields.map((name) => name.trim()).join("; ");
  const topics = record.topics.map((name) => name.trim()).join("; ");
  return `% Problem record ${record.id}. This TeX file is derived from
% ${jsonPath}/${record.id}.json by scripts/sync-tex.mjs; edit the JSON record
% and rerun the script rather than editing this file.
\\section{${record.title.trim()}}
\\label{sec:${record.id}}

\\paragraph{Problem.}
${canonicalTex(record.statement)}

\\subsection*{Status}

${record.status.trim()}

\\subsection*{Source}

${canonicalTex(record.source)}

\\subsection*{Progress}

\\begin{itemize}
${items}
\\end{itemize}

\\subsection*{References}

\\begin{enumerate}[label={},leftmargin=4.8em,labelsep=0.5em]
  \\footnotesize
${entries}
\\end{enumerate}

\\subsection*{Comment}

${canonicalTex(record.comment)}

\\subsection*{Field}

${fields}

\\subsection*{Topic}

${topics}

\\subsection*{ID}

\\texttt{${record.id.replace("_", "\\_")}}
`;
}
