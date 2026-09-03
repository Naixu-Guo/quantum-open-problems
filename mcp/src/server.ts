/**
 * The MCP adapter: a stdio JSON-RPC server that exposes the service's HTTP API as tools and
 * resources for AI agents. It holds no state and no research logic; every tool is one HTTP
 * call, and every returned fact is traceable to a record id and, for statements, a digest.
 *
 *   QOP_SERVICE_URL=http://localhost:8787 QOP_API_KEY=qop_… node --experimental-strip-types mcp/src/server.ts
 */
import { createInterface } from "node:readline";

const SERVICE_URL = (process.env["QOP_SERVICE_URL"] ?? "http://localhost:8787").replace(/\/+$/u, "");
const API_KEY = process.env["QOP_API_KEY"] ?? null;
const SERVER_INFO = { name: "quantum-open-problems", version: "1.0.0" };

type Json = Record<string, unknown>;

interface Tool {
  name: string;
  description: string;
  inputSchema: Json;
  call: (args: Json) => Promise<{ status: number; body: unknown }>;
}

// ---------------------------------------------------------------------------
// HTTP client
// ---------------------------------------------------------------------------

async function http(method: "GET" | "POST", route: string, options: { body?: unknown; raw?: Uint8Array<ArrayBuffer>; headers?: Record<string, string> } = {}): Promise<{ status: number; body: unknown }> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`;
  const init: RequestInit = { method, headers };
  if (options.raw) init.body = new Blob([options.raw]);
  else if (options.body !== undefined) { init.body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
  const response = await fetch(`${SERVICE_URL}${route}`, init);
  const text = await response.text();
  let body: unknown = text;
  try { body = JSON.parse(text); } catch { /* not JSON */ }
  return { status: response.status, body };
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

const query = (params: Record<string, unknown>): string => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
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

const TOOLS: Tool[] = [
  // Read
  { name: "get_status", description: "Release date, ledger lastSequence, record counts, published problems by status. Poll this before anything else.", inputSchema: { type: "object", properties: {} }, call: () => http("GET", "/api/v1/status") },
  { name: "get_policy", description: "The current policy: version, verification thresholds, independence rules, limits.", inputSchema: { type: "object", properties: {} }, call: () => http("GET", "/api/v1/policy") },
  { name: "get_schemas", description: "A contract schema by name, e.g. contribution, review, or payloads/batch.", inputSchema: { type: "object", required: ["name"], properties: { name: { type: "string" } } }, call: (a) => http("GET", `/api/v1/schemas/${str(a, "name")}`) },
  { name: "search_problems", description: "Indexed problems (primary and promoted auxiliary) filtered by area, topic, status, difficulty, or text; sort=stale gives the maintenance backlog.", inputSchema: { type: "object", properties: { area: { type: "string" }, topic: { type: "string" }, status: { enum: ["open", "partial", "solved", "refuted"] }, difficulty: { type: "string" }, text: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 200 }, sort: { enum: ["title", "stale"] }, includeCandidates: { type: "boolean" } } }, call: (a) => http("GET", `/api/v1/problems${query(a)}`) },
  { name: "get_problem", description: "A problem with its current statement, clause statuses, references with notes, comments, and decision chain.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}`) },
  { name: "get_frontier", description: "Open clauses, best bounds, accepted claims, the decomposition tree with node statuses, routes tried with stop reasons, pending contributions, lastActivity and lastHumanReview.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/frontier`) },
  { name: "get_tree", description: "The decomposition tree alone: auxiliary problems by parent clause with statuses and attempt reports.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/tree`) },
  { name: "list_references", description: "References attached to a problem with the human notes on why each matters, optionally by role.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id, role: { type: "string" } } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/references${query({ role: a["role"] })}`) },
  { name: "list_comments", description: "Discussion attached to a record.", inputSchema: { type: "object", required: ["targetType", "targetId"], properties: { targetType: { type: "string" }, targetId: { type: "string" } } }, call: (a) => http("GET", `/api/v1/comments${query({ targetType: str(a, "targetType"), targetId: str(a, "targetId") })}`) },
  { name: "list_attempts", description: "Attempt reports on a problem with their state, verification level, and whether they addressed the current statement.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/attempts`) },
  { name: "build_context", description: "A bounded bundle for one problem under a token budget: statement, chosen clauses, accepted claims, tree, routes tried, references with notes, comments. Returns a bundle id to record in start_trajectory.", inputSchema: { type: "object", required: ["id"], properties: { id: S.id, clauseIds: { type: "array", items: S.clauseRef }, tokenBudget: { type: "integer", minimum: 200, default: 8000 } } }, call: (a) => http("GET", `/api/v1/problems/${encodeURIComponent(str(a, "id"))}/context${query({ clauses: Array.isArray(a["clauseIds"]) ? (a["clauseIds"] as string[]).join(",") : undefined, budget: a["tokenBudget"] })}`) },
  { name: "list_events", description: "Records that entered the ledger after a sequence number, for incremental synchronization.", inputSchema: { type: "object", properties: { after: { type: "integer", minimum: 0, default: 0 }, limit: { type: "integer", minimum: 1, maximum: 500 }, type: { type: "string" } } }, call: (a) => http("GET", `/api/v1/events${query(a)}`) },
  { name: "get_contribution_status", description: "A contribution with its reviews, decisions, claims, derived state, and verification level.", inputSchema: { type: "object", required: ["contributionId"], properties: { contributionId: S.ulid } }, call: (a) => http("GET", `/api/v1/contributions/${seg(ulid(a, "contributionId"))}`) },
  { name: "get_record", description: "Any record's current revision by id.", inputSchema: { type: "object", required: ["id"], properties: { id: S.ulid } }, call: (a) => http("GET", `/api/v1/records/${seg(ulid(a, "id"))}`) },
  { name: "claim_queue_item", description: "For verifier and triage agents: the oldest contribution waiting for review that is not the caller's own and that the caller has not reviewed, with the review packet fields.", inputSchema: { type: "object", properties: {} }, call: async () => {
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
  { name: "start_trajectory", description: "Open a run. Record the context bundle id you started from. Events and artifacts accumulate until end_trajectory writes the run to the ledger.", inputSchema: { type: "object", required: ["kind", "problemIds", "statementDigests", "harnessConfig", "budget", "visibility"], properties: { kind: { enum: ["research", "verification", "maintenance", "ingestion"] }, problemIds: { type: "array", items: S.ulid }, statementDigests: { type: "array", items: { type: "string" } }, clauseIds: { type: "array", items: S.clauseRef }, contextBundleId: { type: ["string", "null"] }, harnessConfig: { type: "string" }, budget: { type: "string" }, visibility: { enum: ["public", "embargoed"] }, embargoUntil: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/trajectories", { body: a }) },
  { name: "log_event", description: "Append an event to an open run: read, decompose, attempt, prove, refute, compute, stuck (with an obstacle), revise, submit, note.", inputSchema: { type: "object", required: ["trajectoryId", "kind", "summary"], properties: { trajectoryId: S.ulid, kind: { enum: ["read", "decompose", "attempt", "prove", "refute", "compute", "stuck", "revise", "submit", "note"] }, summary: { type: "string" }, problemId: { type: ["string", "null"] }, clauseId: { type: ["string", "null"] }, obstacle: { enum: ["missing-lemma", "refuted-subgoal", "computational-limit", "ambiguous-statement", "out-of-budget", "none"] }, objectIds: { type: "array", items: S.ulid }, artifactId: { type: ["string", "null"] } } }, call: (a) => { const { trajectoryId, ...event } = a; return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/events`, { body: event }); } },
  { name: "upload_artifact", description: "Store a blob for an open run, content-addressed; returns the artifact id to cite in claims. Pass text, or base64 for binary.", inputSchema: { type: "object", required: ["trajectoryId", "kind", "title", "mediaType"], properties: { trajectoryId: S.ulid, kind: { enum: ["proof-text", "lean", "coq", "code", "certificate", "notebook", "dataset", "transcript", "log", "figure"] }, title: { type: "string" }, mediaType: { type: "string" }, text: { type: "string" }, base64: { type: "string" } } }, call: (a) => {
    const bytes = typeof a["base64"] === "string" ? Buffer.from(a["base64"], "base64") : Buffer.from(String(a["text"] ?? ""), "utf8");
    // Header values are percent-encoded UTF-8: HTTP headers cannot carry characters above U+00FF.
    return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/artifacts`, { raw: Uint8Array.from(bytes), headers: { "Content-Type": str(a, "mediaType"), "X-Artifact-Kind": encodeURIComponent(str(a, "kind")), "X-Artifact-Title": encodeURIComponent(str(a, "title")) } });
  } },
  { name: "end_trajectory", description: "Close a run: writes the trajectory, its event log, uploaded artifacts, and the attempt report's records in one commit. A research run must carry an attempt report: records with one Contribution of kind attempt-report whose trajectoryId is \"$ref:trajectory\", plus any auxiliary problems, statements, and claims it introduces, cross-referenced by \"$ref:<name>\".", inputSchema: { type: "object", required: ["trajectoryId", "cost", "body"], properties: { trajectoryId: S.ulid, cost: { type: "object" }, body: { type: "string" }, attemptReport: { type: "object", properties: { records: { type: "array" } } } } }, call: (a) => { const { trajectoryId, ...close } = a; return http("POST", `/api/v1/trajectories/${seg(ulid(a, "trajectoryId"))}/close`, { body: close }); } },
  // Write
  { name: "submit_batch", description: "Submit records to the ledger: contract records without id, createdBy, or createdAt, cross-referenced by \"$ref:<name>\" (see get_schemas payloads/batch). Use for problem proposals, references, evidence imports, statement revisions, reviews, comments, and entity revisions. Attempt reports go through end_trajectory.", inputSchema: { type: "object", required: ["records"], properties: { message: { type: "string" }, records: { type: "array", minItems: 1 } } }, call: (a) => http("POST", "/api/v1/batches", { body: a }) },
  { name: "submit_review", description: "File one review of a contribution: kind (triage, verification, audit), independence and conflict-of-interest declarations, at least one mechanical method, checks, and a verdict.", inputSchema: { type: "object", required: ["contributionId", "kind", "independence", "conflictOfInterest", "methods", "checks", "verdict", "body"], properties: { contributionId: S.ulid, kind: { enum: ["triage", "verification", "audit"] }, independence: { type: "object" }, conflictOfInterest: { type: "object" }, methods: { type: "array", items: { type: "string" } }, checks: { type: "array" }, verdict: { type: "string" }, body: { type: "string" }, trajectoryId: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/batches", { body: { message: `Review of ${ulid(a, "contributionId")}`, records: [{
    type: "Review", body: str(a, "body"), contributionId: ulid(a, "contributionId"), trajectoryId: a["trajectoryId"] ?? null, kind: str(a, "kind"),
    independence: a["independence"], conflictOfInterest: a["conflictOfInterest"], methods: a["methods"], checks: a["checks"] ?? [], verdict: str(a, "verdict"),
  }] } }) },
  { name: "post_comment", description: "Attach a comment to a record. Comments are discussion; they never change status.", inputSchema: { type: "object", required: ["targetType", "targetId", "body"], properties: { targetType: { type: "string" }, targetId: { type: "string" }, body: { type: "string" }, parentCommentId: { type: ["string", "null"] } } }, call: (a) => http("POST", "/api/v1/batches", { body: { message: "Comment", records: [{ type: "Comment", revision: 1, targetType: str(a, "targetType"), targetId: str(a, "targetId"), parentCommentId: a["parentCommentId"] ?? null, promotedToContributionId: null, body: str(a, "body") }] } }) },
  { name: "withdraw_contribution", description: "Withdraw your own submitted contribution.", inputSchema: { type: "object", required: ["contributionId", "reason"], properties: { contributionId: S.ulid, reason: { type: "string" } } }, call: (a) => http("POST", `/api/v1/contributions/${seg(ulid(a, "contributionId"))}/withdraw`, { body: { reason: str(a, "reason") } }) },
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

// ---------------------------------------------------------------------------
// JSON-RPC over stdio
// ---------------------------------------------------------------------------

const send = (message: Json) => process.stdout.write(`${JSON.stringify(message)}\n`);
const respond = (id: unknown, result: unknown) => send({ jsonrpc: "2.0", id, result });
const fail = (id: unknown, code: number, message: string) => send({ jsonrpc: "2.0", id, error: { code, message } });

async function handle(message: unknown): Promise<void> {
  if (message === null || typeof message !== "object" || Array.isArray(message)) {
    fail(null, -32600, "a JSON-RPC message must be an object");
    return;
  }
  const { id, method, params } = message as { id?: unknown; method?: string; params?: Json };
  const isRequest = id !== undefined && id !== null;
  try {
    switch (method) {
      case "initialize":
        respond(id, { protocolVersion: (params?.["protocolVersion"] as string | undefined) ?? "2024-11-05", capabilities: { tools: {}, resources: {} }, serverInfo: SERVER_INFO, instructions: "Read get_status and get_policy first. Use build_context to start on a problem, start_trajectory to record your run, and end_trajectory to submit an attempt report. Every fact you cite carries a record id." });
        return;
      case "notifications/initialized":
      case "notifications/cancelled":
        return;
      case "ping":
        if (isRequest) respond(id, {});
        return;
      case "tools/list":
        respond(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
        return;
      case "tools/call": {
        const name = String(params?.["name"] ?? "");
        const tool = TOOLS.find((candidate) => candidate.name === name);
        if (!tool) { fail(id, -32602, `unknown tool ${name}`); return; }
        // A tool failure (bad argument, service down, HTTP error) is a tool result the model can read, not a protocol error.
        try {
          const result = await tool.call((params?.["arguments"] as Json | undefined) ?? {});
          respond(id, { content: [{ type: "text", text: typeof result.body === "string" ? result.body : JSON.stringify(result.body, null, 1) }], isError: result.status >= 400 });
        } catch (error) {
          respond(id, { content: [{ type: "text", text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 1) }], isError: true });
        }
        return;
      }
      case "resources/list":
        respond(id, { resources: RESOURCES });
        return;
      case "resources/templates/list":
        respond(id, { resourceTemplates: RESOURCE_TEMPLATES });
        return;
      case "resources/read": {
        const uri = String(params?.["uri"] ?? "");
        const result = await readResource(uri);
        if (result.status >= 400) { fail(id, -32002, `${uri}: ${JSON.stringify(result.body)}`); return; }
        respond(id, { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(result.body, null, 1) }] });
        return;
      }
      case "prompts/list":
        respond(id, { prompts: [] });
        return;
      default:
        if (isRequest) fail(id, -32601, `unknown method ${String(method)}`);
    }
  } catch (error) {
    if (isRequest) fail(id, -32000, error instanceof Error ? error.message : String(error));
  }
}

// Requests are handled concurrently: a slow service call never blocks a ping or another tool.
// On stdin close the process waits briefly for in-flight requests, then exits.
const inFlight = new Set<Promise<void>>();
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let message: unknown;
  try {
    message = JSON.parse(text);
  } catch {
    fail(null, -32700, "parse error");
    return;
  }
  const task = handle(message).catch((error: unknown) => { process.stderr.write(`unhandled: ${error instanceof Error ? error.message : String(error)}\n`); });
  inFlight.add(task);
  void task.finally(() => inFlight.delete(task));
});
lines.on("close", () => {
  const drain = Promise.allSettled([...inFlight]);
  const deadline = new Promise<void>((resolve) => setTimeout(resolve, 2000).unref());
  void Promise.race([drain, deadline]).then(() => process.exit(0));
});
