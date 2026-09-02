#!/usr/bin/env node
// Quantum Open Problems MCP server (stdio transport, zero dependencies).
//
// Add to Claude Code:  claude mcp add quantum-open-problems -- node mcp/server.mjs
// Add to Codex CLI:    codex mcp add quantum-open-problems -- node mcp/server.mjs
//
// The server is an adapter, not a database. Reviewed scientific state comes
// from the published static read models (a local site/ build inside a
// checkout, or the deployed site; override with QOP_SITE_URL). Candidate
// updates, comments, and the unified event stream come from the operational
// service (QOP_SERVICE_URL); writes need QOP_API_KEY for a registered actor.
// Search reuses core/projection/search.mjs, so MCP and the service rank the
// same way. No tool can change a problem's status.

import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { searchIndex } from "../core/projection/search.mjs";

const DEFAULT_SITE_URL = "https://naixu-guo.github.io/quantum-open-problems";
const siteUrl = (process.env.QOP_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
const serviceUrl = (process.env.QOP_SERVICE_URL || "").replace(/\/$/, "");
const apiKey = process.env.QOP_API_KEY || "";
const localSiteDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const SERVER_INFO = { name: "quantum-open-problems", version: "0.2.0" };
const RECORD_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const CANDIDATE_ID = /^cu-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const COMMENT_ID = /^cmt-[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Static read models ----------------------------------------------------------
const cache = new Map();
const readResource = async (relativePath) => {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const localPath = path.join(localSiteDirectory, relativePath);
  let text;
  if (!process.env.QOP_SITE_URL && fs.existsSync(localPath)) {
    text = fs.readFileSync(localPath, "utf8");
  } else {
    const response = await fetch(`${siteUrl}/${relativePath}`, { headers: { "User-Agent": `${SERVER_INFO.name}-mcp/${SERVER_INFO.version}` } });
    if (!response.ok) throw new Error(`The catalog request failed with ${response.status} for ${relativePath}`);
    text = await response.text();
  }
  cache.set(relativePath, text);
  return text;
};
const readJson = async (relativePath) => JSON.parse(await readResource(relativePath));

// Operational service -----------------------------------------------------------
const requireService = () => {
  if (!serviceUrl) {
    throw new Error("This deployment has no operational service configured. Set QOP_SERVICE_URL (and QOP_API_KEY for writes) to use candidate updates, comments, and the unified event stream.");
  }
  return serviceUrl;
};
const serviceRequest = async (route, { method = "GET", body, idempotencyKey } = {}) => {
  const base = requireService();
  if (method !== "GET" && !apiKey) throw new Error("Writes require QOP_API_KEY for a registered actor. Ask the maintainers for an actor key or use the research-update form.");
  const headers = { Accept: "application/json", "User-Agent": `${SERVER_INFO.name}-mcp/${SERVER_INFO.version}` };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const response = await fetch(`${base}${route}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text();
  let payload;
  try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
  if (!response.ok) {
    const error = payload?.error || {};
    throw new Error(`${method} ${route} failed with ${response.status}${error.code ? ` (${error.code})` : ""}: ${error.message || text}${error.details ? ` ${JSON.stringify(error.details)}` : ""}`);
  }
  return payload;
};
const idempotencyKeyFor = (body) => createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0, 48);

const requireId = (value, pattern, label) => {
  const id = String(value || "").trim();
  if (!pattern.test(id)) throw new Error(`"${value}" is not a valid ${label}.`);
  return id;
};
const requireRecordId = (value) => requireId(value, RECORD_ID, "record ID (lowercase kebab-case)");

const problemLinks = (id) => ({
  page: `${siteUrl}/problems/${id}/`,
  record: `${siteUrl}/api/v1/problems/${id}.json`,
  frontier: `${siteUrl}/api/v1/problems/${id}/frontier.json`,
  brief: `${siteUrl}/packets/${id}.md`
});

const getFrontier = async (id) => {
  if (serviceUrl) {
    try { return await serviceRequest(`/api/v1/problems/${id}/frontier`); } catch (error) { if (!String(error.message).includes("404")) console.error(`[mcp] service frontier unavailable, using static: ${error.message}`); }
  }
  return readJson(`api/v1/problems/${id}/frontier.json`);
};

const TOOLS = [
  {
    name: "search_problems",
    description: "Search the open-problem catalog by free text with optional status, field, topic, collection, and latest-evidence date filters. Returns compact records with links to the JSON record, frontier, and Markdown research brief. Solved records are included only when status is solved or includeArchived is true.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text query matched against title, keywords, taxonomy, summary, latest evidence, and source." },
        status: { type: "string", enum: ["open", "partial", "solved"] },
        field: { type: "string", description: "Field ID or label, e.g. quantum-information." },
        topic: { type: "string", description: "Topic ID or label, e.g. quantum-channels." },
        collection: { type: "string", description: "Collection ID or label, e.g. ruskai-2007." },
        since: { type: "string", description: "Only problems whose latest evidence is on or after this date (YYYY or YYYY-MM-DD)." },
        includeArchived: { type: "boolean" },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 }
      }
    },
    run: async (args) => {
      const index = await readJson("api/v1/search-index.json");
      const result = searchIndex(index, args);
      return {
        catalogAsOf: index.catalogAsOf,
        matched: result.matched,
        note: "Statuses are dated editorial assessments derived from accepted decisions. Fetch the frontier or brief and check the verification date before relying on one.",
        results: result.results.map((entry) => ({ ...entry, links: problemLinks(entry.id) }))
      };
    }
  },
  {
    name: "get_problem",
    description: "Fetch one complete problem record: formal statement, source citation, evidence ledger, cautions, and revision digests.",
    inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string", description: "Stable record ID, e.g. theoremdb-p42-quantum-pcp-conjecture." } } },
    run: async (args) => readJson(`api/v1/problems/${requireRecordId(args.id)}.json`)
  },
  {
    name: "get_frontier",
    description: "Fetch the research frontier for one problem: current statement version, target clauses with their states, accepted claims with evidence, unresolved remainder, cautions, the status decision, and (when a service is configured) live pending candidate updates.",
    inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
    run: async (args) => getFrontier(requireRecordId(args.id))
  },
  {
    name: "get_research_brief",
    description: "Fetch a problem's Markdown research brief: the formal statement, exact unresolved remainder, checked evidence, scope cautions, research protocol, and requested output contract. Recommended starting context.",
    inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
    run: async (args) => readResource(`packets/${requireRecordId(args.id)}.md`),
    raw: true
  },
  {
    name: "get_statement",
    description: "Fetch one immutable statement version with its target clauses, source references, and digests.",
    inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" }, version: { type: "integer", minimum: 1, description: "Statement version; defaults to the current version." } } },
    run: async (args) => {
      const id = requireRecordId(args.id);
      let version = args.version;
      if (!version) {
        const frontier = await readJson(`api/v1/problems/${id}/frontier.json`);
        version = frontier.statement.version;
      }
      return readJson(`api/v1/problems/${id}/statements/v${Number(version)}.json`);
    }
  },
  {
    name: "list_fields",
    description: "List the research fields and topics in the catalog with active-problem counts.",
    inputSchema: { type: "object", properties: {} },
    run: async () => {
      const index = await readJson("api/v1/index.json");
      return {
        catalogAsOf: index.meta.asOf,
        records: index.meta.records,
        fields: index.taxonomy.areas.map((area) => ({
          id: area.id,
          label: area.label,
          description: area.description,
          activeProblems: index.problems.filter((problem) => index.taxonomy.topics.find((topic) => topic.id === problem.topic)?.area === area.id).length,
          topics: index.taxonomy.topics.filter((topic) => topic.area === area.id).map((topic) => ({ id: topic.id, label: topic.label }))
        }))
      };
    }
  },
  {
    name: "get_catalog_status",
    description: "Fetch the release manifest: catalog date, digests, ledger sequence, and record counts, plus the service status when configured. Poll this before downloading more.",
    inputSchema: { type: "object", properties: {} },
    run: async () => {
      const release = await readJson("api/v1/release.json");
      let service = null;
      if (serviceUrl) { try { service = await serviceRequest("/api/v1/status"); } catch (error) { service = { error: error.message }; } }
      return { ...release, service };
    }
  },
  {
    name: "list_evidence",
    description: "List dated evidence events for active problems, newest first. Event IDs are stable content hashes.",
    inputSchema: {
      type: "object",
      properties: {
        problem_id: { type: "string" },
        since: { type: "string", description: "Only events on or after this date (YYYY-MM-DD or YYYY)." },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 }
      }
    },
    run: async (args) => {
      const log = await readJson("api/v1/evidence.json");
      const events = log.events
        .filter((event) => !args.problem_id || event.problemId === requireRecordId(args.problem_id))
        .filter((event) => !args.since || event.date >= String(args.since))
        .slice(0, args.limit || 20);
      return { catalogAsOf: log.catalogAsOf, matched: events.length, note: log.note, events };
    }
  },
  {
    name: "list_recent_events",
    description: "Read the event stream after a sequence number for incremental synchronization. With a service configured this is the unified stream (canonical ledger plus candidate updates, reviews, comments); otherwise it is the canonical ledger from the static site.",
    inputSchema: {
      type: "object",
      properties: {
        after: { type: "integer", minimum: 0, default: 0, description: "Return events with sequence greater than this value." },
        limit: { type: "integer", minimum: 1, maximum: 500, default: 100 },
        problem_id: { type: "string" },
        type: { type: "string", description: "Event type filter, e.g. claim.accepted or candidate_update.created." }
      }
    },
    run: async (args) => {
      const after = Number(args.after) || 0;
      const limit = Math.min(Number(args.limit) || 100, 500);
      if (serviceUrl) {
        const query = new URLSearchParams({ after: String(after), limit: String(limit) });
        if (args.problem_id) query.set("problemId", requireRecordId(args.problem_id));
        if (args.type) query.set("type", String(args.type));
        return serviceRequest(`/api/v1/events?${query}`);
      }
      const ledger = await readJson("api/v1/events.json");
      const events = ledger.events
        .filter((event) => event.sequence > after)
        .filter((event) => !args.problem_id || event.problemId === requireRecordId(args.problem_id))
        .filter((event) => !args.type || event.type === args.type)
        .slice(0, limit);
      return { kind: "qop-event-stream", source: "catalog", after, lastSequence: ledger.lastSequence, nextAfter: events.length ? events[events.length - 1].sequence : after, count: events.length, events };
    }
  },
  {
    name: "list_candidate_updates",
    description: "List unverified candidate updates for a problem (or across the catalog) with their review state, submitter identity (human or AI agent), and links. Requires a configured service.",
    inputSchema: {
      type: "object",
      properties: {
        problem_id: { type: "string" },
        state: { type: "string", enum: ["pending", "under-review", "accepted", "needs-revision", "rejected", "withdrawn", "superseded", "promoted"] },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 50 }
      }
    },
    run: async (args) => {
      const query = new URLSearchParams({ limit: String(Math.min(Number(args.limit) || 50, 200)) });
      if (args.state) query.set("state", args.state);
      if (args.problem_id) return serviceRequest(`/api/v1/problems/${requireRecordId(args.problem_id)}/candidate-updates?${query}`);
      return serviceRequest(`/api/v1/candidate-updates?${query}`);
    }
  },
  {
    name: "get_candidate_update",
    description: "Fetch one candidate update with its reviews and review state.",
    inputSchema: { type: "object", required: ["id"], properties: { id: { type: "string" } } },
    run: async (args) => serviceRequest(`/api/v1/candidate-updates/${requireId(args.id, CANDIDATE_ID, "candidate update ID")}`)
  },
  {
    name: "submit_candidate_update",
    description: "Submit a structured, unverified scientific update for editorial review. The body must satisfy the candidate-update schema (problemId, statementId, targetClauseIds, updateKind, title, claim, hypotheses, scope, sources, artifacts, proposedEffect, remainingGap; optional recordDigest, statementDigest, aiUse). The update becomes public immediately, labeled unverified, attributed to the configured actor; it cannot change a status. Retries with identical bodies are idempotent.",
    inputSchema: {
      type: "object",
      required: ["update"],
      properties: { update: { type: "object", description: "A candidate update satisfying candidate-update.schema.json." } }
    },
    run: async (args) => {
      const update = args.update;
      if (!update || typeof update !== "object") throw new Error("update must be an object satisfying candidate-update.schema.json");
      return serviceRequest("/api/v1/candidate-updates", { method: "POST", body: update, idempotencyKey: idempotencyKeyFor(update) });
    }
  },
  {
    name: "list_comments",
    description: "List discussion for a problem, optionally restricted to one candidate update, claim, or target clause. Comments are conversation, never evidence.",
    inputSchema: {
      type: "object",
      required: ["problem_id"],
      properties: {
        problem_id: { type: "string" },
        candidate_update_id: { type: "string" },
        claim_id: { type: "string" },
        target_clause_id: { type: "string" },
        threaded: { type: "boolean", default: true },
        limit: { type: "integer", minimum: 1, maximum: 200, default: 100 }
      }
    },
    run: async (args) => {
      const query = new URLSearchParams({ problemId: requireRecordId(args.problem_id), threaded: String(args.threaded !== false), limit: String(Math.min(Number(args.limit) || 100, 200)) });
      if (args.candidate_update_id) query.set("candidateUpdateId", requireId(args.candidate_update_id, CANDIDATE_ID, "candidate update ID"));
      if (args.claim_id) query.set("claimId", String(args.claim_id));
      if (args.target_clause_id) query.set("targetClauseId", String(args.target_clause_id));
      return serviceRequest(`/api/v1/comments?${query}`);
    }
  },
  {
    name: "post_comment",
    description: "Post a comment on a problem, attributed to the configured actor. Optionally attach it to a target clause, candidate update, or claim. Comments never change scientific status.",
    inputSchema: {
      type: "object",
      required: ["problem_id", "body"],
      properties: {
        problem_id: { type: "string" },
        body: { type: "string", maxLength: 20000 },
        target_clause_id: { type: "string" },
        candidate_update_id: { type: "string" },
        claim_id: { type: "string" },
        references: { type: "array", items: { type: "object", properties: { uri: { type: "string" }, locator: { type: "string" } }, required: ["uri"] } }
      }
    },
    run: async (args) => {
      const body = {
        problemId: requireRecordId(args.problem_id),
        body: String(args.body || ""),
        ...(args.target_clause_id ? { targetClauseId: String(args.target_clause_id) } : {}),
        ...(args.candidate_update_id ? { candidateUpdateId: requireId(args.candidate_update_id, CANDIDATE_ID, "candidate update ID") } : {}),
        ...(args.claim_id ? { claimId: String(args.claim_id) } : {}),
        ...(Array.isArray(args.references) ? { references: args.references } : {})
      };
      return serviceRequest("/api/v1/comments", { method: "POST", body, idempotencyKey: idempotencyKeyFor(body) });
    }
  },
  {
    name: "reply_to_comment",
    description: "Reply inside an existing comment thread, attributed to the configured actor.",
    inputSchema: {
      type: "object",
      required: ["comment_id", "body"],
      properties: {
        comment_id: { type: "string" },
        body: { type: "string", maxLength: 20000 },
        references: { type: "array", items: { type: "object", properties: { uri: { type: "string" }, locator: { type: "string" } }, required: ["uri"] } }
      }
    },
    run: async (args) => {
      const commentId = requireId(args.comment_id, COMMENT_ID, "comment ID");
      const body = { body: String(args.body || ""), ...(Array.isArray(args.references) ? { references: args.references } : {}) };
      return serviceRequest(`/api/v1/comments/${commentId}/replies`, { method: "POST", body, idempotencyKey: idempotencyKeyFor({ commentId, ...body }) });
    }
  },
  {
    name: "get_contribution_contract",
    description: "Explain how to contribute: the candidate-update contract, review policy, schemas, submission endpoints, and the record revision to cite for a problem.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Record ID to prefill the contract for." } } },
    run: async (args) => {
      const index = await readJson("api/v1/index.json");
      const repository = String(index.meta.repositoryUrl || "").replace(/\/$/, "");
      const problem = args.id ? [...index.problems, ...index.archived].find((entry) => entry.id === requireRecordId(args.id)) : null;
      const issueUrl = new URL(`${repository}/issues/new`);
      issueUrl.searchParams.set("template", "research-update.yml");
      if (problem) issueUrl.searchParams.set("title", `[Research update] ${problem.title}`);
      return {
        trustModel: [
          "Comments are discussion and never become evidence.",
          "A candidate update is a structured, unverified submission tied to a problem, a statement version, and target clauses; it is public and labeled unverified until reviewed.",
          "Reviews are explicit records; acceptance needs an editorial review by a human editor after at least one independent human review.",
          "Accepted updates are promoted into canonical Claim, Evidence, and Decision objects through an auditable Git change; no API call can mark a problem solved."
        ],
        contract: [
          "State the exact claim, its hypotheses, and the target clause IDs of the statement version you worked from.",
          "Cite primary sources with theorem, page, equation, or version locators.",
          "Attach reproducible artifacts (code, data, proof files, certificates) by URL, with digests when possible.",
          "Declare AI involvement and the human checks applied to AI output; never upload private reasoning traces.",
          "State the proposed effect (relation and status change) and the gap that remains after acceptance.",
          "Quote the record revision and statement digest of the version you worked from."
        ],
        schemas: {
          candidateUpdate: `${siteUrl}/api/v1/candidate-update.schema.json`,
          review: `${siteUrl}/api/v1/review.schema.json`,
          comment: `${siteUrl}/api/v1/comment.schema.json`
        },
        submit: {
          mcpTool: "submit_candidate_update",
          http: serviceUrl ? `${serviceUrl}/api/v1/candidate-updates` : "POST /api/v1/candidate-updates on a service instance (none configured for this MCP server)",
          issueForm: issueUrl.href,
          contributingGuide: `${repository}/blob/main/CONTRIBUTING.md`,
          apiReference: `${repository}/blob/main/docs/api.md`
        },
        ...(problem ? {
          problem: {
            id: problem.id,
            status: problem.status,
            recordDigest: problem.recordDigest,
            statementDigest: problem.statementDigest,
            frontier: problemLinks(problem.id).frontier,
            brief: problemLinks(problem.id).brief
          }
        } : {})
      };
    }
  }
];
const toolByName = new Map(TOOLS.map((tool) => [tool.name, tool]));

// Resources ------------------------------------------------------------------
const RESOURCE_TEMPLATES = [
  { uriTemplate: "qop://problems/{id}", name: "Problem record", description: "Complete JSON record for one problem.", mimeType: "application/json" },
  { uriTemplate: "qop://problems/{id}/frontier", name: "Research frontier", description: "Target clauses, accepted claims, evidence, unresolved remainder, status decision, pending updates.", mimeType: "application/json" },
  { uriTemplate: "qop://problems/{id}/statements/{version}", name: "Statement version", description: "One immutable statement version with digests.", mimeType: "application/json" },
  { uriTemplate: "qop://problems/{id}/brief", name: "Research brief", description: "Markdown research brief.", mimeType: "text/markdown" },
  { uriTemplate: "qop://candidate-updates/{id}", name: "Candidate update", description: "One unverified candidate update with its reviews (service required).", mimeType: "application/json" }
];
const listResources = async () => {
  const index = await readJson("api/v1/index.json");
  return [...index.problems, ...index.archived].map((problem) => ({
    uri: `qop://problems/${problem.id}`,
    name: problem.title,
    description: `${problem.status} · ${problem.summary}`,
    mimeType: "application/json"
  }));
};
const readResourceUri = async (uri) => {
  const problemMatch = String(uri).match(/^qop:\/\/problems\/([a-z0-9-]+)(?:\/(frontier|brief|statements\/v?(\d+)))?$/);
  if (problemMatch) {
    const id = requireRecordId(problemMatch[1]);
    if (!problemMatch[2]) return { mimeType: "application/json", text: await readResource(`api/v1/problems/${id}.json`) };
    if (problemMatch[2] === "frontier") return { mimeType: "application/json", text: JSON.stringify(await getFrontier(id), null, 2) };
    if (problemMatch[2] === "brief") return { mimeType: "text/markdown", text: await readResource(`packets/${id}.md`) };
    return { mimeType: "application/json", text: await readResource(`api/v1/problems/${id}/statements/v${Number(problemMatch[3])}.json`) };
  }
  const candidateMatch = String(uri).match(/^qop:\/\/candidate-updates\/(cu-[a-z0-9-]+)$/);
  if (candidateMatch) return { mimeType: "application/json", text: JSON.stringify(await serviceRequest(`/api/v1/candidate-updates/${candidateMatch[1]}`), null, 2) };
  throw new Error(`Unknown resource URI: ${uri}`);
};

// JSON-RPC plumbing ------------------------------------------------------------
const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);
const respond = (id, result) => send({ jsonrpc: "2.0", id, result });
const respondError = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });

const handle = async (message) => {
  const { id, method, params } = message;
  const isRequest = id !== undefined && id !== null;
  try {
    if (method === "initialize") {
      respond(id, {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {}, resources: {} },
        serverInfo: SERVER_INFO,
        instructions: [
          "Quantum Open Problems: a reviewed research layer for formal open problems across quantum science.",
          "Typical loop: search_problems -> get_frontier and get_research_brief for context -> work -> submit_candidate_update (unverified until reviewed) -> list_recent_events to follow reviews and promotions.",
          "Statuses are dated editorial decisions; comments and candidate updates never change them.",
          serviceUrl ? `Operational service: ${serviceUrl}${apiKey ? " (writes enabled)" : " (read-only: no QOP_API_KEY)"}.` : "No operational service configured: candidate updates, comments, and the unified event stream are unavailable until QOP_SERVICE_URL is set."
        ].join(" ")
      });
      return;
    }
    if (method === "ping") { if (isRequest) respond(id, {}); return; }
    if (method === "tools/list") { respond(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) }); return; }
    if (method === "resources/list") { respond(id, { resources: await listResources() }); return; }
    if (method === "resources/templates/list") { respond(id, { resourceTemplates: RESOURCE_TEMPLATES }); return; }
    if (method === "resources/read") {
      try {
        const content = await readResourceUri(params?.uri);
        respond(id, { contents: [{ uri: params?.uri, mimeType: content.mimeType, text: content.text }] });
      } catch (error) {
        respondError(id, -32002, String(error?.message || error));
      }
      return;
    }
    if (method === "prompts/list") { respond(id, { prompts: [] }); return; }
    if (method === "tools/call") {
      const tool = toolByName.get(params?.name);
      if (!tool) { respondError(id, -32602, `Unknown tool: ${params?.name}`); return; }
      try {
        const result = await tool.run(params?.arguments || {});
        const text = tool.raw ? String(result) : JSON.stringify(result, null, 2);
        respond(id, { content: [{ type: "text", text }] });
      } catch (error) {
        respond(id, { content: [{ type: "text", text: String(error?.message || error) }], isError: true });
      }
      return;
    }
    if (method?.startsWith("notifications/")) return;
    if (isRequest) respondError(id, -32601, `Method not found: ${method}`);
  } catch (error) {
    if (isRequest) respondError(id, -32603, String(error?.message || error));
  }
};

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf("\n");
  while (newline >= 0) {
    const line = buffer.slice(0, newline).trim();
    buffer = buffer.slice(newline + 1);
    newline = buffer.indexOf("\n");
    if (!line) continue;
    let message;
    try { message = JSON.parse(line); } catch { continue; }
    void handle(message);
  }
});
process.stdin.on("end", () => process.exit(0));
