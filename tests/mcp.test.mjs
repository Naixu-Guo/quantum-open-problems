import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { repositoryRoot, siteDirectory } from "../core/catalog.mjs";
import { searchIndex } from "../core/projection/search.mjs";
import { PROBLEM_ID } from "./helpers.mjs";

const startMcp = (env = {}) => {
  const child = spawn(process.execPath, [path.join(repositoryRoot, "mcp", "server.mjs")], { env: { ...process.env, QOP_SITE_URL: "", QOP_SERVICE_URL: "", QOP_API_KEY: "", ...env }, stdio: ["pipe", "pipe", "pipe"] });
  const pending = new Map();
  let buffer = "";
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline);
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
      if (!line.trim()) continue;
      const message = JSON.parse(line);
      pending.get(message.id)?.(message);
      pending.delete(message.id);
    }
  });
  let counter = 0;
  const request = (method, params = {}) => new Promise((resolve) => {
    const id = ++counter;
    pending.set(id, resolve);
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
  const call = async (name, args = {}) => {
    const response = await request("tools/call", { name, arguments: args });
    const text = response.result.content[0].text;
    return { isError: Boolean(response.result.isError), text, json: (() => { try { return JSON.parse(text); } catch { return null; } })() };
  };
  return { request, call, stop: () => child.kill() };
};

test("MCP tools return exactly the published read models", async () => {
  const mcp = startMcp();
  try {
    const init = await mcp.request("initialize", { protocolVersion: "2024-11-05" });
    assert.equal(init.result.serverInfo.name, "quantum-open-problems");
    assert.ok(init.result.capabilities.resources);
    const tools = (await mcp.request("tools/list")).result.tools.map((tool) => tool.name);
    for (const name of ["search_problems", "get_problem", "get_frontier", "get_research_brief", "get_statement", "list_recent_events", "list_candidate_updates", "submit_candidate_update", "list_comments", "post_comment", "reply_to_comment", "get_contribution_contract"]) {
      assert.ok(tools.includes(name), `${name} is exposed`);
    }
    assert.ok(!tools.some((name) => /solve|set_status|accept/.test(name)), "no status-changing tool exists");
    const record = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "problems", `${PROBLEM_ID}.json`), "utf8"));
    assert.deepEqual((await mcp.call("get_problem", { id: PROBLEM_ID })).json, record);
    const frontier = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "problems", PROBLEM_ID, "frontier.json"), "utf8"));
    assert.deepEqual((await mcp.call("get_frontier", { id: PROBLEM_ID })).json, frontier);
    const statement = await mcp.call("get_statement", { id: PROBLEM_ID });
    assert.equal(statement.json.id, frontier.statement.id);
    const brief = await mcp.call("get_research_brief", { id: PROBLEM_ID });
    assert.equal(brief.text, fs.readFileSync(path.join(siteDirectory, "packets", `${PROBLEM_ID}.md`), "utf8"));
    const index = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "search-index.json"), "utf8"));
    const expected = searchIndex(index, { query: "multiplicativity", limit: 5 }).results.map((entry) => entry.id);
    assert.deepEqual((await mcp.call("search_problems", { query: "multiplicativity", limit: 5 })).json.results.map((entry) => entry.id), expected);
    const events = await mcp.call("list_recent_events", { after: 350, limit: 10 });
    assert.equal(events.json.source, "catalog");
    assert.ok(events.json.events.every((event) => event.sequence > 350));
    const contract = await mcp.call("get_contribution_contract", { id: PROBLEM_ID });
    assert.equal(contract.json.problem.recordDigest, record.revision.recordDigest);
    const invalid = await mcp.call("get_problem", { id: "Not Valid" });
    assert.equal(invalid.isError, true);
  } finally { mcp.stop(); }
});

test("MCP resources address problems, frontiers, statements, and briefs", async () => {
  const mcp = startMcp();
  try {
    const templates = (await mcp.request("resources/templates/list")).result.resourceTemplates.map((template) => template.uriTemplate);
    assert.ok(templates.includes("qop://problems/{id}/frontier"));
    assert.ok(templates.includes("qop://candidate-updates/{id}"));
    const resources = (await mcp.request("resources/list")).result.resources;
    assert.ok(resources.some((resource) => resource.uri === `qop://problems/${PROBLEM_ID}`));
    const frontier = await mcp.request("resources/read", { uri: `qop://problems/${PROBLEM_ID}/frontier` });
    const expected = JSON.parse(fs.readFileSync(path.join(siteDirectory, "api", "v1", "problems", PROBLEM_ID, "frontier.json"), "utf8"));
    assert.deepEqual(JSON.parse(frontier.result.contents[0].text), expected);
    const statement = await mcp.request("resources/read", { uri: `qop://problems/${PROBLEM_ID}/statements/v1` });
    assert.equal(JSON.parse(statement.result.contents[0].text).version, 1);
    const unknown = await mcp.request("resources/read", { uri: "qop://nonsense" });
    assert.ok(unknown.error);
  } finally { mcp.stop(); }
});

test("write tools explain the missing service instead of pretending to write", async () => {
  const mcp = startMcp();
  try {
    const result = await mcp.call("submit_candidate_update", { update: { problemId: PROBLEM_ID } });
    assert.equal(result.isError, true);
    assert.match(result.text, /QOP_SERVICE_URL/);
    const comments = await mcp.call("list_comments", { problem_id: PROBLEM_ID });
    assert.equal(comments.isError, true);
  } finally { mcp.stop(); }
});
