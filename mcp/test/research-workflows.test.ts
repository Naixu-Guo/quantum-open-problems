/**
 * Scripted business integration tests: official SDK -> HTTP MCP -> HTTP API ->
 * an isolated copy of the maintained catalog. These are not model evaluations.
 */
import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { syncBuiltinESMExports } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createHttpMcpServer } from "../src/http.ts";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
type Json = Record<string, unknown>;
interface AuthoredRecord {
  id: string; ulid: string; aliases: string[]; title: string; status: string;
  statement: string; source: string; progress: string[]; comment: string;
  fields: string[]; topics: string[]; metadata: { difficulty: string };
  references: { key: string; label: string; tex: string }[];
}
interface Problem {
  id: string; title: string; status: string; difficulty: string;
  body: string; statement: { id: string; body: string; clauses: { id: string; text: string }[] };
  authoredCatalog?: { record?: AuthoredRecord };
  references: { id: string; sourceId: string; source: Json }[];
}
interface SearchPage {
  problems: (Pick<Problem, "id" | "title" | "status" | "difficulty"> & {
    areaIds: string[]; topicIds: string[];
    match?: { score: number; fields: string[]; snippet: string; normalizedQuery: string };
  })[];
  total: number; count: number; catalogVersion: string; nextCursor: string | null;
}
interface Sample {
  schemaVersion: string; total: number; catalogVersion: string; problem: Problem | null;
}
interface ResearchEntry {
  text: string; textFormat: string; citationKeys: string[];
  provenance: { recordId: string; revision: number; digest: string; sourcePath: string;
    resourceUri: string; resourceResolution: string; section: string; index: number;
    locator: string; locatorScope: string };
}
interface ResearchProblem extends Problem {
  view: string;
  research: { schemaVersion: string; available: boolean; source: ResearchEntry[];
    progress: ResearchEntry[]; comment: ResearchEntry[];
    references: (ResearchEntry & { key: string; label: string })[] };
}

async function listen(server: http.Server): Promise<string> {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

async function fixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-research-workflows-"));
  for (const dir of ["ledger", "activity", "database/problems_json"]) {
    fs.cpSync(path.join(repo, dir), path.join(root, dir), { recursive: true });
  }
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git(["init", "-q", "-b", "main"]);
  git(["add", "-A"]);
  git(["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Isolated catalog snapshot"]);
  const records = fs.readdirSync(path.join(root, "database/problems_json"))
    .filter(name => name.endsWith(".json"))
    .map(name => JSON.parse(fs.readFileSync(path.join(root, "database/problems_json", name), "utf8")) as AuthoredRecord);
  const record = (id: string) => {
    const found = records.find(entry => entry.id === id);
    assert.ok(found, `The maintained catalog contains ${id}`);
    return found;
  };
  const service = createService({
    ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"),
    contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:",
    port: 0, commit: false, git: { remote: null, pollIntervalMs: 0 },
  });
  const authoredBodies = new Map(service.repo.current().currentOf("Problem").map(problem => [problem.id, problem.body]));
  const api = createServer(service);
  const origin = await listen(api);
  const remote = createHttpMcpServer({ serviceUrl: origin, requestsPerMinute: 1000 });
  const client = new Client({ name: "catalog-research-workflows", version: "1" }, {
    versionNegotiation: { mode: { pin: "2026-07-28" } },
  });
  t.after(async () => {
    await client.close();
    for (const server of [remote, api]) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  await client.connect(new StreamableHTTPClientTransport(new URL(`${await listen(remote)}/mcp`)));
  const call = async <T>(name: string, args: Json = {}): Promise<T> => {
    const result = await client.callTool({ name, arguments: args });
    assert.equal(result.isError, false, `${name}: ${JSON.stringify(result)}`);
    const text = result.content.find(content => content.type === "text");
    assert.ok(text && text.type === "text");
    assert.deepEqual(result.structuredContent, JSON.parse(text.text));
    return result.structuredContent as T;
  };
  return { client, call, record, records, origin, authoredBodies };
}

test("maintained catalog research workflows through the official HTTP SDK", { timeout: 120_000 }, async t => {
  const { client, call, record, records, origin, authoredBodies } = await fixture(t);
  const qma = record("op_61cc0e261b3889c6");
  const svp = record("op_36ac6718d2c37628");
  const thermal = record("op_2beed65d248be57a");
  const petz = record("op_87c77263c8bab523");
  const amplitude = record("op_fcd21a1a5021e464");
  const ids = (page: SearchPage) => page.problems.map(problem => problem.id);

  await t.test("sampling is not cached and ambiguous or empty read parameters are rejected", async () => {
    const sample = await fetch(`${origin}/api/v1/problems/sample?status=Unsolved`);
    assert.equal(sample.status, 200);
    assert.equal(sample.headers.get("cache-control"), "no-store");
    const tools = (await client.listTools()).tools;
    assert.equal(tools.find(tool => tool.name === "sample_problem")?.annotations?.readOnlyHint, true);
    for (const query of ["cursor=", "cursor=%20", "sort=unknown"]) {
      assert.equal((await fetch(`${origin}/api/v1/problems?${query}`)).status, 400, query);
    }
    for (const query of ["limit=1", "offset=0", "sort=title", "cursor=anything"]) {
      assert.equal((await fetch(`${origin}/api/v1/problems/sample?${query}`)).status, 400, query);
    }
    assert.equal((await fetch(`${origin}/api/v1/problems/${qma.id}?view=research&includeAuthoredRecord=true`)).status, 400);
    const empty = await call<Sample>("sample_problem", { text: "noSuchScientificKeyword9zqx" });
    assert.equal(empty.total, 0);
    assert.equal(empty.problem, null);
  });

  await t.test("the fixture reads the complete maintained catalog without inventing difficulty ratings", async () => {
    const page = await call<SearchPage>("search_problems", { limit: 200 });
    assert.equal(page.total, records.length);
    assert.equal(page.count, records.length);
    assert.equal(page.nextCursor, null);
    assert.equal(new Set(ids(page)).size, records.length);
    assert.ok(page.catalogVersion.length > 0);
    for (const problem of page.problems) assert.equal(problem.difficulty, records.find(record => record.ulid === problem.id)!.metadata.difficulty);
  });

  await t.test("scientific search excludes opaque-ID substrings while complete identities still resolve", async () => {
    assert.ok(thermal.ulid.includes("SVP"), "This is the historical false-positive fixture");
    const page = await call<SearchPage>("search_problems", { text: "SVP", sort: "relevance", limit: 200 });
    assert.ok(ids(page).includes(svp.ulid));
    assert.ok(!ids(page).includes(thermal.ulid), "An opaque ID substring is not scientific evidence");
    for (const alias of [thermal.id, thermal.ulid, "op-2beed65d248be57a", "v2-positivity-threshold-for-thermal-attenuator-quantum-capacity"]) {
      assert.equal((await call<Problem>("get_problem", { id: alias })).id, thermal.ulid, alias);
    }
    const exact = await call<SearchPage>("search_problems", { text: thermal.ulid });
    assert.deepEqual(ids(exact), [thermal.ulid]);
  });

  await t.test("spelling, notation and Chinese variants preserve the intended scientific matches", async () => {
    const american = await call<SearchPage>("search_problems", { text: "stabilizer rank", sort: "relevance", limit: 200 });
    const british = await call<SearchPage>("search_problems", { text: "stabiliser rank", sort: "relevance", limit: 200 });
    assert.ok(american.count > 0);
    assert.deepEqual(ids(british), ids(american));
    for (const text of ["QMA(2)", "QMA 2", "QMA2"]) {
      const page = await call<SearchPage>("search_problems", { text, sort: "relevance" });
      assert.equal(page.problems[0]?.id, qma.ulid, text);
      const match = page.problems[0]!.match;
      assert.ok(match && Number.isFinite(match.score) && match.score > 0);
      assert.ok(match.fields.length > 0);
      assert.ok(match.snippet.length > 0);
      assert.ok(match.normalizedQuery.length > 0);
    }
    const english = await call<SearchPage>("search_problems", { text: "quantum algorithm", status: "Unsolved", limit: 200 });
    const chinese = await call<SearchPage>("search_problems", { text: "量子算法", status: "Unsolved", limit: 200 });
    assert.ok(english.total > 0);
    assert.deepEqual(new Set(ids(chinese)), new Set(ids(english)));
  });

  await t.test("default details keep the original body and full authored material remains available", async () => {
    const defaults = await call<Problem>("get_problem", { id: qma.id });
    const full = await call<Problem>("get_problem", { id: qma.id, view: "full", includeAuthoredRecord: true });
    assert.equal(defaults.body, full.body);
    assert.deepEqual(full.authoredCatalog?.record, qma);
    assert.equal(defaults.authoredCatalog?.record, undefined);
    assert.equal(defaults.body, authoredBodies.get(qma.ulid), "The existing exported Markdown body is unchanged");
    assert.equal(defaults.statement.clauses.find(clause => clause.id === "main")?.text, qma.statement);
    const response = await fetch(`${origin}/api/v1/problems/${qma.id}`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), defaults, "MCP forwards the real API view");
    const resource = await client.readResource({ uri: `qop://problems/${qma.id}` });
    const content = resource.contents[0];
    assert.ok(content && "text" in content);
    assert.deepEqual(JSON.parse(content.text), defaults);
  });

  await t.test("research details preserve every history paragraph with revision-scoped citations and complete formal conditions", async () => {
    const research = await call<ResearchProblem>("get_problem", { id: qma.id, view: "research" });
    const full = await call<Problem>("get_problem", { id: qma.id });
    assert.equal(research.view, "research");
    assert.equal(research.research.schemaVersion, "qop-research/1");
    assert.equal(research.research.available, true);
    assert.equal(research.body, undefined, "The research view removes only the duplicate body");
    assert.equal(research.authoredCatalog?.record, undefined);
    assert.deepEqual(research.statement, full.statement, "Formal conditions remain complete");
    assert.deepEqual(research.references, full.references, "Ledger reference identities remain available");
    assert.deepEqual(research.research.source.map(entry => entry.text), [qma.source]);
    assert.ok(qma.progress.length > 1, "Exercise an ordered collection of distinct prior-research entries");
    assert.deepEqual(research.research.progress.map(entry => entry.text), qma.progress);
    assert.deepEqual(research.research.comment.map(entry => entry.text), [qma.comment]);
    assert.deepEqual(research.research.references.map(({ key, label, text }) => ({ key, label, tex: text })), qma.references);
    const keys = new Set(qma.references.map(reference => reference.key));
    for (const [index, entry] of research.research.progress.entries()) {
      assert.equal(entry.textFormat, "tex");
      assert.equal(entry.provenance.recordId, qma.ulid);
      assert.ok(Number.isInteger(entry.provenance.revision) && entry.provenance.revision > 0);
      assert.match(entry.provenance.digest, /^sha256:/u);
      assert.equal(entry.provenance.sourcePath, `database/problems_json/${qma.id}.json`);
      assert.equal(entry.provenance.resourceUri, `qop://records/${qma.ulid}`);
      assert.equal(entry.provenance.resourceResolution, "current");
      assert.equal(entry.provenance.locatorScope, "record-revision");
      assert.equal(entry.provenance.section, "progress");
      assert.equal(entry.provenance.index, index);
      assert.equal(entry.provenance.locator, `progress:${index}`);
      assert.ok(entry.citationKeys.length > 0);
      assert.ok(entry.citationKeys.every(key => keys.has(key)));
    }
    const front = await call<{ acceptedClaims: unknown[] }>("get_frontier", { id: qma.id });
    assert.deepEqual(front.acceptedClaims, []);
    assert.equal(research.research.progress.length, qma.progress.length, "Empty service claims must not erase curated literature");
  });

  await t.test("version-bound pagination returns each member exactly once and rejects a different query", async () => {
    const filters = { area: "Quantum algorithm", status: "Unsolved", sort: "relevance", limit: 3 };
    const complete = await call<SearchPage>("search_problems", { ...filters, limit: 200 });
    let page = await call<SearchPage>("search_problems", filters);
    assert.ok(page.nextCursor, "This query must span several pages");
    const cursor = page.nextCursor;
    const seen = [...ids(page)];
    let requests = 1;
    while (page.nextCursor) {
      assert.ok(requests++ <= complete.total, "Pagination must terminate");
      page = await call<SearchPage>("search_problems", { ...filters, cursor: page.nextCursor });
      assert.equal(page.catalogVersion, complete.catalogVersion);
      seen.push(...ids(page));
    }
    assert.deepEqual(seen, ids(complete));
    assert.equal(new Set(seen).size, complete.total);
    const wrongScope = await client.callTool({ name: "search_problems", arguments: { ...filters, status: "Solved", cursor } });
    assert.equal(wrongScope.isError, true);
  });

  await t.test("sampling uses every matching candidate, including the final row beyond a default page", async t => {
    const all = await call<SearchPage>("search_problems", { status: "Unsolved", limit: 200 });
    assert.ok(all.total > 50, "The fixture exercises candidates beyond the default first page");
    let upperBound: number | undefined;
    const originalRandomInt = crypto.randomInt;
    t.mock.method(crypto, "randomInt", ((...args: unknown[]) => {
      const minimum = args.length === 1 ? 0 : Number(args[0]);
      const maximum = Number(args.length === 1 ? args[0] : args[1]);
      assert.equal(minimum, 0);
      upperBound = maximum;
      return maximum - 1;
    }) as typeof crypto.randomInt);
    syncBuiltinESMExports();
    try {
      const sample = await call<Sample>("sample_problem");
      assert.equal(sample.schemaVersion, "qop-sample/1");
      assert.equal(sample.total, all.total);
      assert.equal(upperBound, all.total, "The RNG sees the full candidate population");
      assert.equal(sample.catalogVersion, all.catalogVersion);
      assert.equal(sample.problem?.status, "Unsolved");
      assert.equal(sample.problem?.id, all.problems.at(-1)?.id, "The final candidate beyond the first page is reachable");
    } finally {
      t.mock.restoreAll();
      assert.equal(crypto.randomInt, originalRandomInt);
      syncBuiltinESMExports();
    }
    const algorithms = await call<SearchPage>("search_problems", { area: "Quantum algorithm", status: "Unsolved", limit: 200 });
    const sample = await call<Sample>("sample_problem", { area: "Quantum algorithm" });
    assert.equal(sample.total, algorithms.total);
    assert.ok(sample.problem && ids(algorithms).includes(sample.problem.id));
    const empty = await call<Sample>("sample_problem", { text: "nonexistentcatalogquery7846113" });
    assert.equal(empty.total, 0);
    assert.equal(empty.problem, null);
  });

  await t.test("recent-resolution evidence preserves distinct submission, verification and historical publication dates", async () => {
    const recent = await call<Problem>("get_problem", { id: petz.id, includeAuthoredRecord: true });
    assert.equal(recent.status, "Solved");
    assert.equal(recent.statement.id, "01M1Q787QRR5XQNYT924KSRZC7");
    assert.ok(recent.statement.clauses.some(clause => clause.id === "main" && clause.text.includes("squared")));
    const authored = recent.authoredCatalog!.record!;
    assert.match(authored.progress[0]!, /inbox\s+on 10 September 2026/u);
    assert.match(authored.comment, /no external peer review/u);
    const citation = authored.references.find(reference => reference.label === "ref:p70-peter-counterexamples");
    assert.ok(citation);
    assert.match(citation.tex, /submissions \(10 September 2026\)/u);
    assert.match(citation.tex, /verified for QIQCOP Zoo \(12 September 2026\)/u);
    assert.ok(recent.references.some(reference => reference.id === "01M29R893JN9SWH8GQYCZH48C9" && reference.sourceId === "01M29R893JEZ6NY0Y0PJ3QAMA4"));
    const historical = await call<Problem>("get_problem", { id: amplitude.id, includeAuthoredRecord: true });
    assert.equal(historical.status, "Solved");
    const old = historical.authoredCatalog!.record!;
    assert.match(old.progress.at(-1)!, /ref:p2-renes-belief-propagation/u);
    assert.match(old.references.find(reference => reference.label === "ref:p2-renes-belief-propagation")!.tex, /\(2017\)/u);
    assert.match(old.comment, /Reducing the decoder complexity/u);
    for (const expected of [petz, amplitude]) {
      const research = await call<ResearchProblem>("get_problem", { id: expected.id, view: "research" });
      assert.deepEqual(research.research.progress.map(entry => entry.text), expected.progress);
      assert.deepEqual(research.research.references.map(({ key, label, text }) => ({ key, label, tex: text })), expected.references);
      assert.equal((research as unknown as Json)["solvedAt"], undefined, "Reading prose must not invent a normalized resolution date");
    }
  });
});
