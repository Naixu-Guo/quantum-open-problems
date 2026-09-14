/** MCP projections of the authored contract, shared by validation and discovery. */
import { readFileSync } from "node:fs";
import type { Json } from "./adapter.ts";

const contractRoot = new URL("../../contract/schema/", import.meta.url);
const documents = new Map<string, Json>();
function document(url: URL): Json {
  let schema = documents.get(url.href);
  if (!schema) { schema = JSON.parse(readFileSync(url, "utf8")) as Json; documents.set(url.href, schema); }
  return schema;
}
/** Only trusted local contract references enter this resolver. */
function resolve(value: unknown, base: URL): unknown {
  if (Array.isArray(value)) return value.map(item => resolve(item, base));
  if (!value || typeof value !== "object") return value;
  const schema = value as Json;
  if (typeof schema["$ref"] === "string") {
    const target = new URL(schema["$ref"], base);
    const fragment = target.hash.slice(1);
    target.hash = "";
    if (!target.href.startsWith(contractRoot.href)) throw new Error("MCP schemas must refer to the local contract");
    let referenced: unknown = document(target);
    for (const key of fragment.split("/").filter(Boolean)) referenced = (referenced as Json)[key.replaceAll("~1", "/").replaceAll("~0", "~")];
    if (referenced === undefined) throw new Error(`Missing contract schema reference ${schema["$ref"]}`);
    const { $ref: _ref, ...siblings } = schema;
    return { ...(resolve(referenced, target) as Json), ...(resolve(siblings, base) as Json) };
  }
  return Object.fromEntries(Object.entries(schema).filter(([key]) => !["$schema", "$id", "$defs"].includes(key)).map(([key, item]) => [key, resolve(item, base)]));
}
function contract(name: string): Json {
  const url = new URL(`${name}.schema.json`, contractRoot);
  return resolve(document(url), url) as Json;
}
const properties = (schema: Json): Json => (schema["properties"] ?? {}) as Json;
const required = (schema: Json): string[] => (schema["required"] ?? []) as string[];

export function inputSchemaForTool(name: string, authored: Json): Json {
  const schema: Json = structuredClone(authored);
  schema["additionalProperties"] = false;
  const payloadNames: Record<string, string> = { start_trajectory: "trajectory-start", log_event: "trajectory-event", end_trajectory: "trajectory-close", submit_batch: "batch" };
  if (payloadNames[name]) {
    const payload = contract(`payloads/${payloadNames[name]}`);
    schema["properties"] = { ...properties(schema), ...properties(payload) };
    schema["required"] = [...new Set([...required(schema), ...required(payload)])];
  }
  if (name === "submit_review" || name === "post_comment") {
    const record = properties(contract(name === "submit_review" ? "review" : "comment"));
    schema["properties"] = Object.fromEntries(Object.entries(properties(schema)).map(([key, value]) => [key, record[key] ?? value]));
  }
  if (name === "upload_artifact") {
    schema["oneOf"] = [{ required: ["text"] }, { required: ["base64"] }];
    schema["properties"] = { ...properties(schema),
      text: { type: "string", minLength: 1, description: "Artifact text; provide exactly one of text or base64." },
      base64: { type: "string", minLength: 4, pattern: "^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$", description: "Canonical padded base64; provide exactly one of text or base64." },
    };
  }
  return schema;
}

const string = { type: "string" };
const integer = { type: "integer", minimum: 0 };
const boolean = { type: "boolean" };
const strings = { type: "array", items: string };
const status = { type: "string", enum: ["Unsolved", "Solved"] };
const nullableString = { type: ["string", "null"] };
const record = { type: "object", additionalProperties: true };
const records = { type: "array", items: record };
const nullableRecord = { ...record, type: ["object", "null"] };
const object = (props: Json, requiredKeys = Object.keys(props)): Json => ({ type: "object", properties: props, required: requiredKeys, additionalProperties: true });
const byStatus = object({ Unsolved: integer, Solved: integer });
const pagination = { total: integer, count: integer, limit: integer, offset: integer, nextOffset: { type: ["integer", "null"], minimum: 0 } };
const source = object({ id: string, title: nullableString, doi: nullableString, arxivId: nullableString }, ["id"]);
const reference = object({ id: string, sourceId: string, role: string, body: string, source: { ...source, type: ["object", "null"] } });
const references = { type: "array", items: reference };
const provenance = object({ recordId: string, revision: integer, digest: string, sourcePath: nullableString,
  resourceUri: string, resourceResolution: { const: "current" } });
const researchEntry = object({ text: string, textFormat: { const: "tex" }, citationKeys: strings,
  provenance: object({ ...properties(provenance), section: { enum: ["source", "progress", "comment", "references"] },
    index: integer, locator: string, locatorScope: { const: "record-revision" } }) });
const researchEntries = { type: "array", items: researchEntry };
const research = object({ schemaVersion: { const: "qop-research/1" }, kind: { const: "authored-catalog-summary" },
  available: boolean, semantics: string, provenance, source: researchEntries, progress: researchEntries, comment: researchEntries,
  references: { type: "array", items: object({ ...properties(researchEntry), key: string, label: string }) } });
const problem = object({ id: string, title: string, status, statement: nullableRecord, references, comments: records, decisions: records,
  bodyDisposition: { enum: ["included", "omitted-duplicate-import"] },
  view: { enum: ["full", "research"] }, difficulty: string, provenance, research,
  statusSource: object({ kind: { enum: ["authored-catalog", "decision", "default"] }, recordId: string }) });
const searchPage = { ...pagination, catalogVersion: string, nextCursor: nullableString,
  unit: { const: "records" }, sort: { enum: ["title", "stale", "relevance", "edited"] } };
const summarySearch = object({ ...searchPage, schemaVersion: { const: "qop-search/2" },
  problems: { type: "array", items: object({ id: string, alias: nullableString, title: string, status, areaIds: strings, topicIds: strings,
    difficulty: string, lastActivity: nullableString, lastHumanReview: nullableString, catalogEditedAt: nullableString, catalogCreatedAt: nullableString,
    match: object({ score: { type: "number" }, fields: strings, snippet: string, normalizedQuery: string }) }, ["id", "title", "status", "areaIds", "topicIds", "difficulty"]) } });
const researchSearch = object({ ...searchPage, schemaVersion: { const: "qop-search-research/1" }, view: { const: "research" },
  sortDescription: string,
  problems: { type: "array", items: object({ ...properties(problem), view: { const: "research" } }) },
  maxBytes: { type: "integer", minimum: 16384, maximum: 1048576 }, responseBytes: { type: "integer", minimum: 1 },
  budgetSemantics: object({ unit: { const: "utf8-json-bytes" }, representation: { const: "compact-json" },
    scope: { const: "entire-api-response" }, atomicUnit: { const: "problem" },
    excludes: { const: ["http-headers", "mcp-envelope", "tokens"] } }) });
const OUTPUT_SCHEMAS: Record<string, Json> = {
  get_status: object({ policyVersion: string, lastSequence: integer, counts: record,
    problems: object({ unit: { const: "records" }, total: integer, published: integer, candidates: integer, merged: integer, retired: integer, byStatus }),
    distinctQuestions: object({ unit: { const: "distinct questions" }, scope: string, total: integer, byStatus }), lastRelease: nullableRecord }),
  search_problems: { ...object({ ...searchPage, schemaVersion: { enum: ["qop-search/2", "qop-search-research/1"] }, problems: records }),
    oneOf: [summarySearch, researchSearch] },
  search_sources: object({ ...pagination, returned: integer, text: string, sources: { type: "array", items: source } }, ["total", "count", "limit", "offset", "nextOffset", "sources"]),
  get_problem: problem,
  sample_problem: object({ schemaVersion: { const: "qop-sample/1" }, total: integer, catalogVersion: string,
    sampling: { const: "uniform-over-all-matching-records" }, problem: { ...problem, type: ["object", "null"] } }),
  get_frontier: object({ problemId: string, title: string, status, statement: object({ id: string, version: integer, digest: string }), clauses: records, acceptedClaims: records, bestBounds: records, tree: records, routesTried: records, pendingContributions: records, lastActivity: nullableString, lastHumanReview: nullableString }),
  get_tree: object({ problemId: string, tree: records }),
  list_references: object({ problemId: string, references }),
  build_context: object({ schemaVersion: { const: "qop-context/2" }, bundleId: string, problemId: string, statementId: string, statementVersion: { type: "integer", minimum: 1 }, statementDigest: string, clauseIds: strings,
    status, statusSource: object({ kind: { enum: ["authored-catalog", "decision", "default"] }, recordId: string, sourcePath: string, reason: string }, ["kind", "recordId"]),
    tokenBudget: integer, approximateTokens: integer, minimumRequiredTokens: integer, formalContextComplete: boolean, incomplete: boolean, omittedSections: strings,
    budgetSemantics: object({ unit: { const: "approximate-section-tokens" }, charactersPerToken: { const: 4 }, excludes: strings }),
    sections: { type: "array", items: object({ name: string, text: string, truncated: boolean, omitted: boolean, required: boolean, resourceUris: strings, approximateTokens: integer }) },
    included: strings, shownRecordIds: strings,
    sourcesUsed: { type: "array", items: object({ id: string, type: string, revision: integer, digest: string, resourceUri: string }) },
    resources: { type: "array", items: object({ uri: string, name: string, resolution: { const: "current" }, id: string, revision: integer, digest: string }) } }),
};

/** Stable envelopes are constrained; heterogeneous scientific record details remain intact. */
export function outputSchemaForTool(name: string): Json | undefined { return OUTPUT_SCHEMAS[name]; }
