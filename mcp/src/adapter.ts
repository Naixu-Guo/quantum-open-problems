/** Shared tools and resources for the local stdio adapter and hosted HTTP endpoint. */
import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { inputSchemaForTool } from "./schemas.ts";

export const SERVER_INFO = { name: "quantum-open-problems", version: "1.3.0" };
export const REQUIRED_RETRIEVAL_VERSION = "qop-retrieval/1";
export const RETRIEVAL_UPGRADE_MESSAGE = `This MCP release requires API retrieval contract ${REQUIRED_RETRIEVAL_VERSION}. Deploy the matching API, run npm --prefix mcp run check:service, then activate MCP.`;
export const REQUIRED_RESEARCH_SEARCH_VERSION = "qop-search-research/1";
export const RESEARCH_SEARCH_UPGRADE_MESSAGE = `Research search requires API contract ${REQUIRED_RESEARCH_SEARCH_VERSION}. Deploy the matching API, run npm --prefix mcp run check:service, then activate MCP. Summary search remains a separate compatible view.`;
export const REQUIRED_CONTEXT_SCHEMA_VERSION = "qop-context/2";
export const CONTEXT_UPGRADE_MESSAGE = `This MCP release requires API context contract ${REQUIRED_CONTEXT_SCHEMA_VERSION}. Deploy and restart the matching API service first, then run npm --prefix mcp run check:service with QOP_SERVICE_URL set to that API before activating the MCP release.`;
export const REQUIRED_IDEMPOTENCY_VERSION = "qop-idempotency/2";
export const IDEMPOTENCY_UPGRADE_MESSAGE = `Keyed writes require API idempotency contract ${REQUIRED_IDEMPOTENCY_VERSION}. Deploy and restart the matching API service first, then run npm --prefix mcp run check:service with QOP_SERVICE_URL set to that API. No write was sent.`;

export type Json = Record<string, unknown>;

export interface CallOptions { signal?: AbortSignal }
export interface AdapterReply {
  status: number;
  body: unknown;
  headers?: { retryAfter?: string; requestId?: string; idempotentReplay?: boolean };
}
export class AdapterError extends Error {
  readonly code: string;
  readonly details: { httpStatus?: number; retryable?: boolean; outcomeUnknown?: boolean; requestId?: string };
  constructor(
    code: string,
    message: string,
    details: { httpStatus?: number; retryable?: boolean; outcomeUnknown?: boolean; requestId?: string } = {},
  ) { super(message); this.name = "AdapterError"; this.code = code; this.details = details; }
}

export interface Tool {
  readOnly: boolean;
  name: string;
  description: string;
  inputSchema: Json;
  call: (args: Json, options?: CallOptions) => Promise<AdapterReply>;
}

export function createAdapter(serviceUrl: string, apiKey: string | null = null, optionsReadOnly = false) {
  const origin = new URL(serviceUrl);
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) {
    throw new Error("QOP_SERVICE_URL must be an HTTP(S) origin without credentials or a path");
  }
  const SERVICE_URL = origin.origin;
  const API_KEY = optionsReadOnly ? null : apiKey;
  // Invocation metadata never enters a scientific payload. AsyncLocalStorage keeps
  // concurrent calls' cancellation signals and idempotency keys isolated.
  const invocation = new AsyncLocalStorage<CallOptions & { idempotencyKey?: string }>();
  // ---------------------------------------------------------------------------
  // HTTP client
  // ---------------------------------------------------------------------------

  async function http(method: "GET" | "POST", route: string, options: { body?: unknown; raw?: Uint8Array<ArrayBuffer>; headers?: Record<string, string> } = {}): Promise<AdapterReply> {
    const context = invocation.getStore();
    const requestId = randomUUID();
    const headers: Record<string, string> = { ...(options.headers ?? {}) };
    headers["X-Request-Id"] = requestId;
    if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;
    if (method === "POST" && context?.idempotencyKey) headers["Idempotency-Key"] = context.idempotencyKey;
    if (optionsReadOnly && method !== "GET") throw new Error("This MCP endpoint only supports reading the catalog");
    const timeout = AbortSignal.timeout(20_000);
    const signal = context?.signal ? AbortSignal.any([timeout, context.signal]) : timeout;
    const init: RequestInit = { method, headers, signal, redirect: "error" };
    if (options.raw) init.body = new Blob([options.raw]);
    else if (options.body !== undefined) { init.body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
    let dispatched = false;
    try {
      signal.throwIfAborted();
      dispatched = true;
      const response = await fetch(`${SERVICE_URL}${route}`, init);
      const text = await response.text();
      let body: unknown = text;
      try { body = JSON.parse(text); } catch {
        if (response.ok) throw new AdapterError("INVALID_SERVICE_RESPONSE", "The service returned a non-JSON success response", {
          httpStatus: response.status, requestId, retryable: method === "GET" || Boolean(context?.idempotencyKey), outcomeUnknown: method === "POST",
        });
      }
      return { status: response.status, body, headers: {
        requestId: response.headers.get("x-request-id") ?? requestId,
        ...(response.headers.has("retry-after") ? { retryAfter: response.headers.get("retry-after")! } : {}),
        ...(response.headers.get("idempotent-replay") === "true" ? { idempotentReplay: true } : {}),
      } };
    } catch (error) {
      if (error instanceof AdapterError) throw error;
      const cancelled = context?.signal?.aborted;
      const timedOut = timeout.aborted || (error instanceof Error && error.name === "TimeoutError");
      throw new AdapterError(cancelled ? "CANCELLED" : timedOut ? "SERVICE_TIMEOUT" : "SERVICE_UNAVAILABLE",
        cancelled ? "The tool call was cancelled" : timedOut ? "The service did not respond within 20 seconds" : "The service could not be reached or its response was interrupted",
        { requestId, retryable: !cancelled && (method === "GET" || Boolean(context?.idempotencyKey)), outcomeUnknown: method === "POST" && dispatched });
    }
  }

  // Cache only a successful capability check. Initial concurrent calls keep their
  // own fetch and AbortSignal, so cancelling one probe cannot cancel another write.
  let keyedWritesCompatible = false;
  async function ensureKeyedWritesCompatible(): Promise<void> {
    if (keyedWritesCompatible) return;
    const result = await http("GET", "/api/v1/status");
    const details = { httpStatus: result.status, retryable: false, outcomeUnknown: false, ...(result.headers?.requestId ? { requestId: result.headers.requestId } : {}) };
    if (result.status >= 400) throw new AdapterError("SERVICE_PREFLIGHT_FAILED", `Cannot verify keyed-write compatibility: API status returned HTTP ${result.status}. No write was sent.`, details);
    if (result.body === null || typeof result.body !== "object" || (result.body as Json)["idempotencyVersion"] !== REQUIRED_IDEMPOTENCY_VERSION) {
      throw new AdapterError("INCOMPATIBLE_SERVICE", IDEMPOTENCY_UPGRADE_MESSAGE, details);
    }
    keyedWritesCompatible = true;
  }

  const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/u;

  /** A path segment: percent-encoded so that '#', '?', and '/' in an id can never reroute the call. */
  const seg = (value: string): string => encodeURIComponent(value);

  /** A record id argument: must be a ULID, so a clause reference or a stray path never reaches the URL. */
  const ulid = (args: Json, key: string): string => {
    const value = str(args, key);
    if (!ULID.test(value)) throw new Error(`${key} must be a 26-character record id, got ${value}`);
    return value;
  };

  const schemaName = (args: Json): string => {
    const value = str(args, "name");
    if (!/^(?:payloads\/)?[a-z-]+$/u.test(value)) throw new Error("name must be a schema name or payloads/<name>");
    return value;
  };

  const query = (params: Record<string, unknown>, preserveEmptyStrings = false): string => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && (preserveEmptyStrings || value !== "")) search.set(key, String(value));
    const text = search.toString();
    return text ? `?${text}` : "";
  };

  const str = (args: Json, key: string): string => {
    const value = args[key];
    if (typeof value !== "string" || value === "") throw new Error(`${key} is required`);
    return value;
  };

  // ---------------------------------------------------------------------------
  // Tools
  // ---------------------------------------------------------------------------

  const S = {
    id: { type: "string", description: "Record id (ULID) or, for problems, an alias" },
    ulid: { type: "string", pattern: "^[0-9A-HJKMNP-TV-Z]{26}$" },
    clauseRef: { type: "string", description: "<statementId>#<clauseId>" },
  };

  const problemFilters = {
    area: { type: "string", description: "Field label or slug; get_taxonomy lists canonical values, e.g. Quantum Algorithm." },
    topic: { type: "string", description: "Topic label or slug from get_taxonomy." },
    status: { enum: ["Unsolved", "Solved"] }, difficulty: { type: "string" }, text: { type: "string", maxLength: 2048, description: "Up to 32 normalized whitespace-delimited terms; use taxonomy filters for fields/topics." },
    includeCandidates: { type: "boolean", description: "Include active unpublished candidates. Merged and retired identities stay excluded." },
  };
  async function retrieval(route: string, schemaVersion: string): Promise<AdapterReply> {
    const result = await http("GET", route);
    if (result.status < 400 && (result.body as Json)?.["schemaVersion"] !== schemaVersion) throw new AdapterError("INCOMPATIBLE_SERVICE", RETRIEVAL_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
    return result;
  }

  const TOOLS: Tool[] = [
    // Read
    { readOnly: true, name: "get_status", description: "Release and ledger sequence; problems.total counts active records, with merged/retired identities reported separately; distinctQuestions counts published mathematical questions once across equivalent formulations. Each has Solved/Unsolved totals.", inputSchema: { type: "object", properties: {} }, call: () => http("GET", "/api/v1/status") },
    { readOnly: true, name: "get_taxonomy", description: "Available areas and topics with their ids (slugs) and labels. Either form is accepted by search_problems, case-insensitively.", inputSchema: { type: "object", properties: {} }, call: () => http("GET", "/api/v1/taxonomy") },
    { readOnly: true, name: "search_sources", description: "Find papers by author, title, DOI, arXiv id, venue, or preserved bibliography text. Includes retired sources, marked retired, to avoid duplicate registrations. Follow nextOffset for further pages.", inputSchema: { type: "object", properties: { text: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 200, default: 20 }, offset: { type: "integer", minimum: 0, default: 0 } } }, call: a => http("GET", `/api/v1/sources${query(a)}`) },
    { readOnly: true, name: "get_policy", description: "The current policy: version, verification thresholds, independence rules, limits.", inputSchema: { type: "object", properties: {} }, call: () => http("GET", "/api/v1/policy") },
    { readOnly: true, name: "get_schemas", description: "A contract schema by name, e.g. contribution, review, or payloads/batch.", inputSchema: { type: "object", required: ["name"], properties: { name: { type: "string" } } }, call: (a) => http("GET", `/api/v1/schemas/${schemaName(a)}`) },
    { readOnly: true, name: "search_problems", description: "Search scientific content with relevance ranking, controlled spelling/acronym variants and Chinese search terms. Full identifiers resolve separately. view:summary (default) returns summaries; view:research returns multiple complete problem research views for the same query, including full statements, research history and references. Research pages fit whole problems within maxBytes (default 32768 UTF-8 bytes of the entire API JSON response, excluding MCP framing); no problem text is truncated. If the first problem cannot fit, response_budget_too_small reports minimumRequiredBytes and problemId. Default sort is relevance with text, otherwise catalog edit time (not solution date). Repeat filters, view and sort with nextCursor; limit and maxBytes may change. If the catalog changed, start again. total counts all matches; count is this page. Difficulty may be unrated; never infer an objective difficulty score from ordering. Catalog edit dates are not scientific resolution dates.", inputSchema: { type: "object", dependentSchemas: { maxBytes: { required: ["view"], properties: { view: { const: "research" } } } }, properties: { ...problemFilters, view: { enum: ["summary", "research"], default: "summary", description: "Choose summaries or complete research views; tool combinations depend on the task." }, maxBytes: { type: "integer", minimum: 16384, maximum: 1048576, description: "Only with view:research. Entire API JSON response budget in UTF-8 bytes; API default is 32768. Excludes HTTP headers, MCP framing and token accounting." }, limit: { type: "integer", minimum: 1, maximum: 200, default: 50 }, offset: { type: "integer", minimum: 0, description: "Legacy pagination; prefer cursor for change detection." }, cursor: { type: "string", minLength: 1, description: "nextCursor from the previous page; repeat filters, view and sort, omit offset. limit and maxBytes may change." }, sort: { enum: ["relevance", "edited", "title", "stale"], description: "edited: catalog TeX edit time; stale: service human-review age. Neither is the date a scientific problem was solved." } } }, call: async (a) => {
      // Research filters are strict: preserve supplied empty values so the API
      // rejects them instead of silently widening the query. Summary stays compatible.
      const route = `/api/v1/problems${query(a, a["view"] === "research")}`;
      if (a["view"] !== "research") return retrieval(route, "qop-search/2");
      const result = await http("GET", route);
      if (result.status < 400 && ((result.body as Json)?.["schemaVersion"] !== REQUIRED_RESEARCH_SEARCH_VERSION || (result.body as Json)?.["view"] !== "research")) {
        throw new AdapterError("INCOMPATIBLE_SERVICE", RESEARCH_SEARCH_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false, ...(result.headers?.requestId ? { requestId: result.headers.requestId } : {}) });
      }
      return result;
    } },
    { readOnly: true, name: "sample_problem", description: "Draw one problem uniformly from ALL matching catalog records, default Unsolved. Use area/topic to specify the requested field; it never samples just a search page. Returns the candidate total, catalog version and a complete research view including the formal statement, prior progress, remaining gaps and references. An empty set returns problem:null. Each invocation is a new random draw.", inputSchema: { type: "object", properties: problemFilters }, call: (a) => retrieval(`/api/v1/problems/sample${query(a)}`, "qop-sample/1") },
    { readOnly: true, name: "get_problem", description: "Read a problem with complete formal statement and structured research.source/progress/comment/references, preserving original text, citation keys and revision-scoped provenance. Use view:research to omit a verified duplicate import body; if body remains, read that additional service background too, or full (default) for backwards-compatible body and details. Authored research history is independent of accepted workflow claims. Dates in the source text need their stated meaning; catalog edit dates are not solution dates. Old aliases of merged problems resolve to the canonical problem.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id, view: { enum: ["full", "research"], default: "full" }, includeAuthoredRecord: { type: "boolean", default: false, description: "Include the duplicate raw source record; use full view when requesting it." } } }, call: async (a) => {
      const result = await http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}${query({ view: a["view"], includeAuthoredRecord: a["includeAuthoredRecord"] })}`);
      if (result.status < 400 && (result.body as { research?: { schemaVersion?: string } })?.research?.schemaVersion !== "qop-research/1") throw new AdapterError("INCOMPATIBLE_SERVICE", RETRIEVAL_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
      return result;
    } },
    { readOnly: true, name: "get_frontier", description: "Ledger evidence: open clauses, best bounds, accepted claims, the decomposition tree, routes tried, pending contributions, lastActivity and lastHumanReview. Curated literature history is in get_problem.research (and body in full view); empty acceptedClaims or routesTried do not imply no prior research.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/frontier`) },
    { readOnly: true, name: "get_tree", description: "The decomposition tree alone: auxiliary problems by parent clause with statuses and attempt reports.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/tree`) },
    { readOnly: true, name: "list_references", description: "References attached to a problem with the human notes on why each matters, optionally by role.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id, role: { type: "string" } } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/references${query({ role: a["role"] })}`) },
    { readOnly: true, name: "list_comments", description: "Discussion attached to a record.", inputSchema: { type: "object", required: ["targetType", "targetId"], properties: { targetType: { type: "string" }, targetId: { type: "string" } } }, call: (a) => http("GET", `/api/v1/comments${query({ targetType: str(a, "targetType"), targetId: str(a, "targetId") })}`) },
    { readOnly: true, name: "list_attempts", description: "Attempt reports on a problem with their state, verification level, and whether they addressed the current statement.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/attempts`) },
    { readOnly: true, name: "build_context", description: "Research context with authoritative status, complete formal material when it fits, and evidence provenance. The background section contains curated prior research and remaining gaps; if omitted, read get_problem with view:research. tokenBudget estimates section text at four characters per token; metadata is additional. Check incomplete and minimumRequiredTokens, and follow resource links for omitted sections. Returns a content bundle id for start_trajectory.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id, clauseIds: { type: "array", items: S.clauseRef }, tokenBudget: { type: "integer", minimum: 200, default: 8000 } } }, call: async (a) => {
      const result = await http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/context${query({ clauses: Array.isArray(a["clauseIds"]) ? (a["clauseIds"] as string[]).join(",") : undefined, budget: a["tokenBudget"] })}`);
      if (result.status < 400 && (result.body === null || typeof result.body !== "object" || (result.body as Json)["schemaVersion"] !== REQUIRED_CONTEXT_SCHEMA_VERSION)) {
        throw new AdapterError("INCOMPATIBLE_SERVICE", CONTEXT_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false, ...(result.headers?.requestId ? { requestId: result.headers.requestId } : {}) });
      }
      return result;
    } },
    { readOnly: true, name: "list_events", description: "Records that entered the ledger after a sequence number, for incremental synchronization.", inputSchema: { type: "object", properties: { after: { type: "integer", minimum: 0, default: 0 }, limit: { type: "integer", minimum: 1, maximum: 500 }, type: { type: "string" } } }, call: (a) => http("GET", `/api/v1/events${query(a)}`) },
    { readOnly: true, name: "get_contribution_status", description: "A contribution with its reviews, decisions, claims, derived state, and verification level.", inputSchema: { type: "object", required: ["contributionId"], properties: { contributionId: S.ulid } }, call: (a) => http("GET", `/api/v1/contributions/${seg(ulid(a, "contributionId"))}`) },
    { readOnly: true, name: "get_record", description: "Any record's current revision by id.", inputSchema: { type: "object", required: ["id"], properties: { id: S.ulid } }, call: (a) => http("GET", `/api/v1/records/${seg(ulid(a, "id"))}`) },
    { readOnly: true, name: "claim_queue_item", description: "Peek at the oldest contribution awaiting review that is not the caller's own and that the caller has not reviewed. Returns its review packet; does not reserve or claim the item, so concurrent reviewers may receive the same contribution.", inputSchema: { type: "object", properties: {} }, call: async () => {
      const result = await http("GET", "/api/v1/queues/review");
      if (result.status >= 400) return result;
      const items = (result.body as { items?: unknown[] })?.items ?? [];
      const next = items[0] as { id?: string } | undefined;
      if (!next?.id) return { status: 200, body: { queue: "review", item: null, remaining: 0 } };
      const packet = await http("GET", `/api/v1/contributions/${seg(next.id)}`);
      if (packet.status >= 400) return packet;
      return { status: 200, body: { queue: "review", item: packet.body, remaining: items.length - 1 } };
    } },
    // Work
    { readOnly: false, name: "start_trajectory", description: "Open a run. Record the context bundle id you started from. Events and artifacts accumulate until end_trajectory writes the run to the ledger.", inputSchema: { type: "object", required: ["kind", "problemIds", "statementDigests", "harnessConfig", "budget", "visibility"], properties: { kind: { enum: ["research", "verification", "maintenance", "ingestion"] }, problemIds: { type: "array", items: S.ulid }, statementDigests: { type: "array", items: { type: "string" } }, clauseIds: { type: "array", items: S.clauseRef }, contextBundleId: { type: ["string", "null"] }, harnessConfig: { type: "string" }, budget: { type: "string" }, visibility: { enum: ["public", "embargoed"] }, embargoUntil: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/trajectories", { body: a }) },
    { readOnly: false, name: "log_event", description: "Append an event to an open run: read, decompose, attempt, prove, refute, compute, stuck (with an obstacle), revise, submit, note.", inputSchema: { type: "object", required: ["trajectoryId", "kind", "summary"], properties: { trajectoryId: S.ulid, kind: { enum: ["read", "decompose", "attempt", "prove", "refute", "compute", "stuck", "revise", "submit", "note"] }, summary: { type: "string" }, problemId: { type: ["string", "null"] }, clauseId: { type: ["string", "null"] }, obstacle: { enum: ["missing-lemma", "refuted-subgoal", "computational-limit", "ambiguous-statement", "out-of-budget", "none"] }, objectIds: { type: "array", items: S.ulid }, artifactId: { type: ["string", "null"] } } }, call: (a) => { const { trajectoryId, ...event } = a; return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/events`, { body: event }); } },
    { readOnly: false, name: "upload_artifact", description: "Store a blob for an open run, content-addressed; returns the artifact id to cite in claims. Pass text, or base64 for binary.", inputSchema: { type: "object", required: ["trajectoryId", "kind", "title", "mediaType"], properties: { trajectoryId: S.ulid, kind: { enum: ["proof-text", "lean", "coq", "code", "certificate", "notebook", "dataset", "transcript", "log", "figure"] }, title: { type: "string" }, mediaType: { type: "string" }, text: { type: "string" }, base64: { type: "string" } } }, call: (a) => {
      const hasText = typeof a["text"] === "string";
      const hasBase64 = typeof a["base64"] === "string";
      if (hasText === hasBase64) throw new AdapterError("INVALID_ARGUMENT", "Provide exactly one of text or base64");
      const bytes = hasBase64 ? Buffer.from(a["base64"] as string, "base64") : Buffer.from(a["text"] as string, "utf8");
      if (!bytes.length) throw new AdapterError("INVALID_ARGUMENT", "The artifact must not be empty");
      if (hasBase64 && bytes.toString("base64") !== a["base64"]) throw new AdapterError("INVALID_ARGUMENT", "base64 must use the standard alphabet with canonical padding");
      // Header values are percent-encoded UTF-8: HTTP headers cannot carry characters above U+00FF.
      return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/artifacts`, { raw: Uint8Array.from(bytes), headers: { "Content-Type": str(a, "mediaType"), "X-Artifact-Kind": encodeURIComponent(str(a, "kind")), "X-Artifact-Title": encodeURIComponent(str(a, "title")) } });
    } },
    { readOnly: false, name: "end_trajectory", description: "Close a run: writes the trajectory, its event log, uploaded artifacts, and the attempt report's records in one commit. A research run must carry an attempt report: records with one Contribution of kind attempt-report whose trajectoryId is \"$ref:trajectory\", plus any auxiliary problems, statements, and claims it introduces, cross-referenced by \"$ref:<name>\".", inputSchema: { type: "object", required: ["trajectoryId", "cost", "body"], properties: { trajectoryId: S.ulid, cost: { type: "object" }, body: { type: "string" }, attemptReport: { type: "object", properties: { records: { type: "array" } } } } }, call: (a) => { const { trajectoryId, ...close } = a; return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/close`, { body: close }); } },
    // Write
    { readOnly: false, name: "submit_batch", description: "Submit records to the ledger: contract records without id, createdBy, or createdAt, cross-referenced by \"$ref:<name>\" (see get_schemas payloads/batch). Use for problem proposals, references, evidence imports, statement revisions, reviews, comments, and entity revisions. Attempt reports go through end_trajectory.", inputSchema: { type: "object", required: ["records"], properties: { message: { type: "string" }, records: { type: "array", minItems: 1 } } }, call: (a) => http("POST", "/api/v1/batches", { body: a }) },
    { readOnly: false, name: "submit_review", description: "File one review of a contribution: kind (triage, verification, audit), independence and conflict-of-interest declarations, at least one mechanical method, checks, and a verdict.", inputSchema: { type: "object", required: ["contributionId", "kind", "independence", "conflictOfInterest", "methods", "checks", "verdict", "body"], properties: { contributionId: S.ulid, kind: { enum: ["triage", "verification", "audit"] }, independence: { type: "object" }, conflictOfInterest: { type: "object" }, methods: { type: "array", items: { type: "string" } }, checks: { type: "array" }, verdict: { type: "string" }, body: { type: "string" }, trajectoryId: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/batches", { body: { message: `Review of ${ulid(a, "contributionId")}`, records: [{
      type: "Review", body: str(a, "body"), contributionId: ulid(a, "contributionId"), trajectoryId: a["trajectoryId"] ?? null, kind: str(a, "kind"),
      independence: a["independence"], conflictOfInterest: a["conflictOfInterest"], methods: a["methods"], checks: a["checks"] ?? [], verdict: str(a, "verdict"),
    }] } }) },
    { readOnly: false, name: "post_comment", description: "Attach a comment to a record. Comments are discussion; they never change status.", inputSchema: { type: "object", required: ["targetType", "targetId", "body"], properties: { targetType: { type: "string" }, targetId: { type: "string" }, body: { type: "string" }, parentCommentId: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/batches", { body: { message: "Comment", records: [{ type: "Comment", revision: 1, targetType: str(a, "targetType"), targetId: str(a, "targetId"), parentCommentId: a["parentCommentId"] ?? null, promotedToContributionId: null, body: str(a, "body") }] } }) },
    { readOnly: false, name: "withdraw_contribution", description: "Withdraw your own submitted contribution.", inputSchema: { type: "object", required: ["contributionId", "reason"], properties: { contributionId: S.ulid, reason: { type: "string" } } }, call: (a) => http("POST", `/api/v1/contributions/${seg(ulid(a, "contributionId"))}/withdraw`, { body: { reason: str(a, "reason") } }) },
  ];

  // ---------------------------------------------------------------------------
  // Resources
  // ---------------------------------------------------------------------------

  const RESOURCE_TEMPLATES = [
    { uriTemplate: "qop://problems/{id}", name: "Problem", description: "A problem with its current statement, references, comments, and decisions.", mimeType: "application/json" },
    { uriTemplate: "qop://problems/{id}/frontier", name: "Frontier", description: "What is settled, open, tried, and pending for a problem.", mimeType: "application/json" },
    { uriTemplate: "qop://problems/{id}/tree", name: "Decomposition tree", description: "Auxiliary problems by parent clause.", mimeType: "application/json" },
    { uriTemplate: "qop://contributions/{id}", name: "Contribution", description: "A contribution with its reviews and decisions.", mimeType: "application/json" },
    { uriTemplate: "qop://records/{id}", name: "Record", description: "Any record's current revision.", mimeType: "application/json" },
  ];
  const RESOURCES = [
    { uri: "qop://status", name: "Status", description: "Release, lastSequence, counts.", mimeType: "application/json" },
    { uri: "qop://policy", name: "Policy", description: "Thresholds and rules in force.", mimeType: "application/json" },
  ];

  async function readResource(uri: string): Promise<{ status: number; body: unknown }> {
    const match = uri.match(/^qop:\/\/(.+)$/u);
    if (!match) throw new Error(`unsupported uri ${uri}`);
    const route = match[1]!;
    if (route === "status") return http("GET", "/api/v1/status");
    if (route === "policy") return http("GET", "/api/v1/policy");
    const problem = route.match(/^problems\/([^/]+)(?:\/(frontier|tree))?$/u);
    if (problem) return http("GET", `/api/v1/problems/${seg(problem[1]!)}${problem[2] ? `/${problem[2]}` : ""}`);
    const contribution = route.match(/^contributions\/([^/]+)$/u);
    if (contribution) return http("GET", `/api/v1/contributions/${seg(contribution[1]!)}`);
    const record = route.match(/^records\/([^/]+)$/u);
    if (record) return http("GET", `/api/v1/records/${seg(record[1]!)}`);
    throw new Error(`unsupported uri ${uri}`);
  }

  const tools = TOOLS.filter(tool => (!API_KEY || optionsReadOnly) ? tool.readOnly : true).map((tool): Tool => {
    const schema = inputSchemaForTool(tool.name, tool.inputSchema);
    if (!tool.readOnly) {
      schema["properties"] = { ...(schema["properties"] as Json), idempotencyKey: {
        type: "string", minLength: 1, maxLength: 128, pattern: "^[A-Za-z0-9._:-]+$",
        description: "A unique key for this logical write. Reuse it with identical arguments if the response is lost; use a new key for a different write. Sent as an HTTP header, never stored in the scientific payload.",
      } };
    }
    return { ...tool, inputSchema: schema, call: (args, options = {}) => {
      const { idempotencyKey, ...payload } = args;
      if (idempotencyKey !== undefined && (tool.readOnly || typeof idempotencyKey !== "string" || !/^[A-Za-z0-9._:-]{1,128}$/u.test(idempotencyKey))) {
        return Promise.reject(new AdapterError("INVALID_ARGUMENT", "idempotencyKey must be 1–128 ASCII letters, digits, dots, underscores, colons or hyphens, on a write tool"));
      }
      return invocation.run({ ...options, ...(typeof idempotencyKey === "string" ? { idempotencyKey } : {}) }, async () => {
        if (typeof idempotencyKey === "string") await ensureKeyedWritesCompatible();
        return tool.call(payload);
      });
    } };
  });
  return { tools, readResource: (uri: string, options: CallOptions = {}) => invocation.run(options, () => readResource(uri)), resources: RESOURCES, resourceTemplates: RESOURCE_TEMPLATES };
}
