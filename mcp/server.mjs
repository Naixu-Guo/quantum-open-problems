#!/usr/bin/env node
// Quantum Open Problems MCP server (stdio transport, zero dependencies).
//
// Add to Claude Code:  claude mcp add quantum-open-problems -- node mcp/server.mjs
// Add to Codex CLI:    codex mcp add quantum-open-problems -- node mcp/server.mjs
//
// The server reads the generated static catalog. Inside a repository checkout
// it uses the local site/ build; anywhere else it fetches the published site.
// Override the source with QOP_SITE_URL.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_SITE_URL = "https://naixu-guo.github.io/quantum-information-open-problems";
const siteUrl = (process.env.QOP_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, "");
const localSiteDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "site");
const SERVER_INFO = { name: "quantum-open-problems", version: "0.1.0" };
const RECORD_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const cache = new Map();
const readResource = async (relativePath) => {
  if (cache.has(relativePath)) return cache.get(relativePath);
  const localPath = path.join(localSiteDirectory, relativePath);
  let text;
  if (!process.env.QOP_SITE_URL && fs.existsSync(localPath)) {
    text = fs.readFileSync(localPath, "utf8");
  } else {
    const response = await fetch(`${siteUrl}/${relativePath}`, {
      headers: { "User-Agent": `${SERVER_INFO.name}-mcp/${SERVER_INFO.version}` }
    });
    if (!response.ok) throw new Error(`The catalog request failed with ${response.status} for ${relativePath}`);
    text = await response.text();
  }
  cache.set(relativePath, text);
  return text;
};

const readIndex = async () => JSON.parse(await readResource("api/v1/index.json"));

const requireRecordId = (value) => {
  const id = String(value || "").trim();
  if (!RECORD_ID.test(id)) throw new Error(`"${value}" is not a valid record ID (lowercase kebab-case).`);
  return id;
};

const problemLinks = (id) => ({
  page: `${siteUrl}/problems/${id}/`,
  record: `${siteUrl}/api/v1/problems/${id}.json`,
  brief: `${siteUrl}/packets/${id}.md`
});

const compactView = (index, problem) => {
  const topic = index.taxonomy.topics.find((entry) => entry.id === problem.topic);
  const area = index.taxonomy.areas.find((entry) => entry.id === topic?.area);
  return {
    id: problem.id,
    title: problem.title,
    status: problem.status,
    field: area?.label || topic?.area || "Unclassified",
    topic: topic?.label || problem.topic,
    proposed: problem.proposed,
    latestEvidence: problem.latestEvidence,
    summary: problem.summary,
    recordDigest: problem.recordDigest,
    statementDigest: problem.statementDigest,
    links: problemLinks(problem.id)
  };
};

const TOOLS = [
  {
    name: "search_problems",
    description: "Search the active open-problem catalog by free text, status, field, or topic. Returns compact records with links to the full JSON record and Markdown research brief.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text query matched against title, summary, keywords, field, and topic." },
        status: { type: "string", enum: ["open", "partial"], description: "Restrict to fully open or partially solved problems." },
        field: { type: "string", description: "Field ID or label, e.g. quantum-information." },
        topic: { type: "string", description: "Topic ID or label, e.g. quantum-channels." },
        limit: { type: "integer", minimum: 1, maximum: 50, default: 10 }
      }
    },
    run: async (args) => {
      const index = await readIndex();
      const normalize = (value = "") => String(value).toLowerCase();
      const terms = normalize(args.query || "").split(/\s+/).filter(Boolean);
      const wantedField = normalize(args.field || "");
      const wantedTopic = normalize(args.topic || "");
      const results = index.problems
        .map((problem) => compactView(index, problem))
        .filter((problem) => !args.status || problem.status === args.status)
        .filter((problem) => !wantedField
          || normalize(problem.field) === wantedField
          || normalize(problem.field).includes(wantedField)
          || index.taxonomy.topics.some((topic) => topic.id === wantedField && topic.area === wantedField))
        .filter((problem) => !wantedTopic
          || normalize(problem.topic).includes(wantedTopic)
          || index.problems.find((entry) => entry.id === problem.id)?.topic === wantedTopic)
        .map((problem) => {
          const source = index.problems.find((entry) => entry.id === problem.id);
          const haystacks = [
            [normalize(problem.title), 3],
            [normalize((source.keywords || []).join(" ")), 2],
            [normalize(`${problem.field} ${problem.topic}`), 2],
            [normalize(problem.summary), 1],
            [normalize(source.latestEvidence?.title || ""), 1]
          ];
          const score = terms.length === 0 ? 1 : terms.reduce((total, term) =>
            total + haystacks.reduce((sum, [text, weight]) => sum + (text.includes(term) ? weight : 0), 0), 0);
          return { problem, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, args.limit || 10)
        .map((entry) => entry.problem);
      return {
        catalogAsOf: index.meta.asOf,
        matched: results.length,
        note: "Statuses are dated editorial assessments. Fetch the record or brief and check dates.verified before relying on one.",
        results
      };
    }
  },
  {
    name: "get_problem",
    description: "Fetch one complete problem record: formal statement, source citation, evidence ledger, cautions, and revision digests.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "Stable record ID, e.g. theoremdb-p42-quantum-pcp-conjecture." } }
    },
    run: async (args) => JSON.parse(await readResource(`api/v1/problems/${requireRecordId(args.id)}.json`))
  },
  {
    name: "get_research_brief",
    description: "Fetch a problem's Markdown research brief: the formal statement, exact unresolved remainder, checked evidence, scope cautions, research protocol, and requested output contract. This is the recommended starting context for working on a problem.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: { id: { type: "string", description: "Stable record ID." } }
    },
    run: async (args) => readResource(`packets/${requireRecordId(args.id)}.md`),
    raw: true
  },
  {
    name: "list_fields",
    description: "List the research fields and topics in the catalog with active-problem counts.",
    inputSchema: { type: "object", properties: {} },
    run: async () => {
      const index = await readIndex();
      return {
        catalogAsOf: index.meta.asOf,
        records: index.meta.records,
        fields: index.taxonomy.areas.map((area) => ({
          id: area.id,
          label: area.label,
          description: area.description,
          activeProblems: index.problems.filter((problem) =>
            index.taxonomy.topics.find((topic) => topic.id === problem.topic)?.area === area.id).length,
          topics: index.taxonomy.topics.filter((topic) => topic.area === area.id)
            .map((topic) => ({ id: topic.id, label: topic.label }))
        }))
      };
    }
  },
  {
    name: "get_catalog_status",
    description: "Fetch the release manifest: catalog date, active-snapshot digest, and record counts. Poll this before downloading more; an unchanged digest means the catalog has not changed.",
    inputSchema: { type: "object", properties: {} },
    run: async () => JSON.parse(await readResource("api/v1/release.json"))
  },
  {
    name: "list_evidence",
    description: "List dated evidence events for active problems, newest first. Event IDs are stable content hashes, so agents can diff runs.",
    inputSchema: {
      type: "object",
      properties: {
        problem_id: { type: "string", description: "Restrict to one record ID." },
        since: { type: "string", description: "Only events on or after this date (YYYY-MM-DD or YYYY)." },
        limit: { type: "integer", minimum: 1, maximum: 100, default: 20 }
      }
    },
    run: async (args) => {
      const log = JSON.parse(await readResource("api/v1/evidence.json"));
      const events = log.events
        .filter((event) => !args.problem_id || event.problemId === requireRecordId(args.problem_id))
        .filter((event) => !args.since || event.date >= String(args.since))
        .slice(0, args.limit || 20);
      return { catalogAsOf: log.catalogAsOf, matched: events.length, note: log.note, events };
    }
  },
  {
    name: "how_to_contribute",
    description: "Explain the evidence contract for submitting a research result, correction, or failed route, with the contribution schema and prefilled submission link.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Record ID to prefill the submission for." } }
    },
    run: async (args) => {
      const index = await readIndex();
      const repository = String(index.meta.repositoryUrl || "").replace(/\/$/, "");
      const problem = args.id
        ? index.problems.find((entry) => entry.id === requireRecordId(args.id))
        : null;
      const issueUrl = new URL(`${repository}/issues/new`);
      issueUrl.searchParams.set("template", "research-update.yml");
      if (problem) issueUrl.searchParams.set("title", `[Research update] ${problem.title}`);
      return {
        contract: [
          "State the exact claim, its hypotheses, and which part of the archived statement it addresses.",
          "Cite primary sources with theorem, page, equation, or version locators.",
          "Attach reproducible artifacts (code, data, proof files, certificates) by URL.",
          "Declare AI involvement and the human checks applied to AI output.",
          "State the gap that remains after accepting the contribution.",
          "Quote the record revision and statement digest of the version you worked from."
        ],
        contributionSchema: `${siteUrl}/api/v1/contribution.schema.json`,
        submitUrl: issueUrl.href,
        contributingGuide: `${repository}/blob/main/CONTRIBUTING.md`,
        ...(problem ? {
          problem: {
            id: problem.id,
            recordDigest: problem.recordDigest,
            statementDigest: problem.statementDigest,
            brief: problemLinks(problem.id).brief
          }
        } : {})
      };
    }
  }
];

const toolByName = new Map(TOOLS.map((tool) => [tool.name, tool]));

const respond = (id, result) => send({ jsonrpc: "2.0", id, result });
const respondError = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });
const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);

const handle = async (message) => {
  const { id, method, params } = message;
  const isRequest = id !== undefined && id !== null;
  try {
    if (method === "initialize") {
      respond(id, {
        protocolVersion: params?.protocolVersion || "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
        instructions: [
          "Quantum Open Problems: a source-audited catalog of formal open problems across quantum science.",
          "Typical loop: search_problems or list_fields -> get_research_brief for full context -> work -> how_to_contribute to submit evidence.",
          "Statuses are dated editorial assessments; check verification dates and cautions before relying on one."
        ].join(" ")
      });
      return;
    }
    if (method === "ping") { if (isRequest) respond(id, {}); return; }
    if (method === "tools/list") {
      respond(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
      return;
    }
    if (method === "resources/list") { respond(id, { resources: [] }); return; }
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
