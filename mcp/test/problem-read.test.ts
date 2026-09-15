/** Official SDK -> MCP HTTP -> API HTTP; client-side reconstruction, not a model evaluation. */
import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createHttpMcpServer } from "../src/http.ts";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import { bootstrapEditor } from "../../service/src/bootstrap.ts";

const repo = fileURLToPath(new URL("../../", import.meta.url));
type Json = Record<string, unknown>;
interface Page {
  schemaVersion: string; problemId: string; documentVersion: string;
  section: "statement" | "history" | "references" | "comment";
  format: "json" | "json-continuation"; content: Json | null; text: string | null;
  continued: boolean; complete: boolean; nextCursor: string | null;
  maxBytes: number; responseBytes: number; budgetSemantics: Json;
}
const sections = ["statement", "history", "references", "comment"] as const;
type Section = typeof sections[number];
const bytes = (value: unknown) => Buffer.byteLength(JSON.stringify(value), "utf8");
const textBytes = (text: string) => Buffer.byteLength(text, "utf8");

async function listen(server: http.Server) {
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  return `http://127.0.0.1:${address.port}`;
}

async function fixture(t: TestContext, native = false) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-problem-read-"));
  const seed = native ? path.join(repo, "contract/fixtures") : repo;
  for (const dir of ["ledger", "activity"]) fs.cpSync(path.join(seed, dir), path.join(root, dir), { recursive: true });
  if (!native) fs.cpSync(path.join(repo, "database/problems_json"), path.join(root, "database/problems_json"), { recursive: true });
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  git(["init", "-q", "-b", "main"]);
  git(["add", "-A"]);
  git(["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-qm", "Isolated research reading snapshot"]);
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"),
    contractDir: path.join(repo, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0,
    commit: true, git: { remote: null, pollIntervalMs: 0 } });
  // The API has its own address quota in addition to the MCP transport quota.
  // Raise both only in this isolated, in-memory acceptance fixture.
  service.policy.rateLimits["requestsPerAddressPerMinute"] = 10_000;
  const api = createServer(service);
  const origin = await listen(api);
  // Whole-catalog traversal deliberately exceeds ordinary interactive request
  // rates. This isolated test override does not change the public server limit.
  const remote = createHttpMcpServer({ serviceUrl: origin, requestsPerMinute: 10_000 });
  const endpoint = new URL(`${await listen(remote)}/mcp`);
  const clients: Client[] = [];
  t.after(async () => {
    for (const client of clients) await client.close();
    for (const server of [remote, api]) {
      server.closeAllConnections();
      await new Promise<void>(resolve => server.close(() => resolve()));
    }
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  const connect = async (modern = true) => {
    const client = new Client({ name: "problem-read-acceptance", version: "1" },
      modern ? { versionNegotiation: { mode: { pin: "2026-07-28" } } } : {});
    clients.push(client);
    await client.connect(new StreamableHTTPClientTransport(endpoint));
    return client;
  };
  let token: string | undefined;
  const post = async (records: Json[]) => {
    if (!token) {
      const existing = service.repo.current().currentOf("Actor").find(actor => actor.fields["kind"] === "human"
        && (actor.fields["roles"] as string[]).includes("editor"));
      const editor = existing?.id ?? bootstrapEditor(service, "19731", "Problem reader fixture editor");
      token = service.auth.issueKey(editor, "problem-read-fixture");
    }
    const response = await fetch(`${origin}/api/v1/batches`, { method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: "Exercise independently versioned research information", records }) });
    const body = await response.json();
    assert.equal(response.status, 201, JSON.stringify(body));
    assert.equal((body as Json)["accepted"], true);
  };
  const revise = async (id: string, problemId: string, changes: Json, body?: string) => {
    const original = service.repo.current().current.get(id);
    assert.ok(original);
    const revision = Number(original.fields["revision"]) + 1;
    await post([
      { ...original.fields, ...changes, revision, body: body ?? original.body },
      { ref: "revision", type: "Contribution", title: "Record a reading regression revision", kind: "entity-revision",
        body: "Fixture-only revision; every other record remains unchanged.", trajectoryId: null,
        problemIds: [problemId], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none",
        newProblemIds: [], newStatementId: null, referenceIds: [], claimIds: [], artifactIds: [],
        declaredReadIds: [id], revisions: [{ entityId: id, revision }], aiInvolvement: "none", license: "CC-BY-4.0" },
    ]);
  };
  const maintainedIds = new Set(native ? [] : fs.readdirSync(path.join(root, "database/problems_json"))
    .filter(name => name.endsWith(".json"))
    .map(name => String((JSON.parse(fs.readFileSync(path.join(root, "database/problems_json", name), "utf8")) as Json)["ulid"])));
  return { service, origin, connect, post, revise, maintainedIds };
}

async function call<T>(client: Client, name: string, args: Json = {}): Promise<T> {
  const result = await client.callTool({ name, arguments: args });
  assert.equal(result.isError, false, `${name}: ${JSON.stringify(result)}`);
  const text = result.content.find(item => item.type === "text");
  assert.ok(text && text.type === "text");
  assert.deepEqual(result.structuredContent, JSON.parse(text.text), "SDK text and structured data agree");
  return result.structuredContent as T;
}

function checkPage(page: Page, budget: number) {
  assert.equal(page.schemaVersion, "qop-problem-read/1");
  assert.match(page.documentVersion, /^[0-9a-f]{64}$/u);
  assert.equal(page.maxBytes, budget);
  assert.equal(page.responseBytes, bytes(page), "The complete compact JSON, including cursor and accounting, is measured");
  assert.ok(page.responseBytes <= budget);
  assert.equal(page.complete, page.nextCursor === null, "Completion refers to the selected semantic category");
  assert.deepEqual(page.budgetSemantics, { unit: "utf8-json-bytes", representation: "compact-json",
    scope: "entire-api-response", excludes: ["http-headers", "mcp-envelope", "tokens"] });
  for (const removed of ["blocks", "blockId", "offset", "nextOffset", "totalBytes", "path"]) {
    assert.equal(Object.hasOwn(page, removed), false, "The public result exposes categories, not internal addressing");
  }
  if (page.format === "json") {
    assert.ok(page.content && typeof page.content === "object" && !Array.isArray(page.content));
    assert.equal(page.text, null);
    assert.equal(page.continued, false);
    assert.equal(page.complete, true);
  } else {
    assert.equal(page.format, "json-continuation");
    assert.equal(page.content, null);
    assert.equal(typeof page.text, "string");
    assert.ok(page.text!.length > 0, "Each continuation advances");
    assert.equal(Buffer.from(page.text!, "utf8").toString("utf8"), page.text, "No broken Unicode code point");
  }
}

/** Independent semantic projection: no production section builder or splitting code. */
function project(document: Json, section: Section): Json {
  const problemStatus = { status: document["status"], statusSource: document["statusSource"] };
  const research = document["research"] as Json;
  const researchContext = Object.fromEntries(Object.entries(research)
    .filter(([key]) => !["source", "progress", "comment", "references"].includes(key)));
  switch (section) {
    case "statement": return { ...problemStatus, statement: document["statement"] ?? null,
      ...(Object.hasOwn(document, "body") ? { body: document["body"] } : {}) };
    case "history": return { ...problemStatus, source: research["source"] ?? [], progress: research["progress"] ?? [], researchContext };
    case "references": return { ...problemStatus, bibliography: research["references"] ?? [], references: document["references"] ?? [], researchContext };
    case "comment": return { ...problemStatus, comment: research["comment"] ?? [], discussion: document["comments"] ?? [],
      decisions: document["decisions"] ?? [], researchContext };
  }
}

async function readCategory(client: Client, id: string, initial: Json = {}, budgetForPage?: (page: number) => number) {
  const pages: Page[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const budget = budgetForPage?.(pages.length) ?? (typeof initial["maxBytes"] === "number" ? initial["maxBytes"] : 8192);
    const args: Json = cursor ? { id, cursor } : { id, ...initial };
    if (budgetForPage || initial["maxBytes"] !== undefined) args["maxBytes"] = budget;
    const page = await call<Page>(client, "read_problem", args);
    checkPage(page, budget);
    assert.equal(page.continued, pages.length > 0);
    if (pages.length) {
      assert.equal(page.documentVersion, pages[0]!.documentVersion);
      assert.equal(page.problemId, pages[0]!.problemId);
      assert.equal(page.section, pages[0]!.section, "Omitted section inherits the cursor scope");
      assert.equal(page.format, "json-continuation", "A started text continuation remains text through its final page");
    }
    pages.push(page);
    cursor = page.nextCursor ?? undefined;
    if (cursor) { assert.ok(!cursors.has(cursor), "A cursor must advance"); cursors.add(cursor); }
    assert.ok(pages.length < 2000, "Bounded fixture traversal terminates");
  } while (cursor);
  const content: Json = pages[0]!.format === "json"
    ? pages[0]!.content! : JSON.parse(pages.map(page => page.text).join("")) as Json;
  assert.ok(content && typeof content === "object" && !Array.isArray(content));
  return { pages, content, documentVersion: pages[0]!.documentVersion };
}

async function refused(client: Client, args: Json, status: number, code: string) {
  const result = await client.callTool({ name: "read_problem", arguments: args });
  assert.equal(result.isError, true);
  const error = result.structuredContent as Json;
  assert.equal(error["httpStatus"], status, JSON.stringify(result));
  assert.equal(error["code"], code);
}

const unicodeParagraph = String.raw`单段测试 🧪 é 𝛿 \forall x\in\mathbb{C}^d,\quad \frac{A_x}{B_x}\neq 0; "quoted" / ~ ` .repeat(220);

test("official SDK reads complete semantic research categories", { timeout: 180_000 }, async t => {
  const { service, origin, connect, revise, maintainedIds } = await fixture(t);
  const client = await connect();
  const records = service.repo.current().currentOf("Problem").filter(record => maintainedIds.has(record.id));
  const documents = new Map<string, Json>();
  let largestReferences: { id: string; size: number } | undefined;

  await t.test("all four categories of every maintained problem match the exact research projection", async () => {
    assert.ok(records.length > 100, "Exercise the complete real maintained catalog");
    assert.deepEqual(new Set(records.map(record => record.id)), maintainedIds);
    let pageCount = 0;
    const continuedCategories: Record<Section, number> = { statement: 0, history: 0, references: 0, comment: 0 };
    const categorySizes: Record<Section, { id: string; bytes: number }[]> = { statement: [], history: [], references: [], comment: [] };
    for (const record of records) {
      const document = await call<Json>(client, "get_problem", { id: record.id, view: "research" });
      documents.set(record.id, document);
      let version: string | undefined;
      for (const section of sections) {
        const expected = project(document, section);
        categorySizes[section].push({ id: record.id, bytes: bytes(expected) });
        const read = await readCategory(client, record.id, { section });
        assert.deepEqual(read.content, expected, "Exact scientific strings, citations and metadata in " + record.id + "/" + section);
        assert.deepEqual(Object.keys(read.content).sort(), Object.keys(expected).sort(), "A category does not include unrelated sections");
        version ??= read.documentVersion;
        assert.equal(read.documentVersion, version, "All categories bind the same complete research document");
        pageCount += read.pages.length;
        if (read.pages.length > 1) continuedCategories[section]++;
        if (section === "references" && (!largestReferences || bytes(expected) > largestReferences.size)) {
          largestReferences = { id: record.id, size: bytes(expected) };
        }
      }
    }
    t.diagnostic("Read " + documents.size + " maintained problems in all four semantic categories across " + pageCount
      + " default-budget pages; continued categories " + JSON.stringify(continuedCategories));
    t.diagnostic("Category content bytes (compact JSON, before API envelope; p95 nearest rank): " + JSON.stringify(
      Object.fromEntries(sections.map(section => {
        const ordered = categorySizes[section].sort((a, b) => a.bytes - b.bytes);
        return [section, { p95: ordered[Math.ceil(ordered.length * 0.95) - 1]!.bytes, max: ordered.at(-1) }];
      })),
    ));
  });

  await t.test("every standalone category exposes the authoritative problem status, independently of service clause status", async () => {
    const solvedId = "01M1HME780EGVAT19D7T4BGNB5";
    const solved = documents.get(solvedId)!;
    assert.equal(solved["status"], "Solved", "The maintained metrology problem is already solved");
    const solvedStatement = solved["statement"] as Json;
    assert.ok((solvedStatement["clauses"] as Json[]).some(clause => clause["status"] === "open"),
      "Exercise the real authored-status versus service-evidence distinction");
    const unsolved = documents.get("01M1Q787QRD6APNHX659G4CTEF")!;
    assert.equal(unsolved["status"], "Unsolved", "The purification countercase remains unsolved");
    for (const document of [solved, unsolved]) for (const section of sections) {
      const id = String(document["id"]);
      const native = await call<Page>(client, "read_problem", { id, section, maxBytes: 32768 });
      checkPage(native, 32768);
      assert.equal(native.format, "json");
      assert.equal(native.content!["status"], document["status"]);
      assert.deepEqual(native.content!["statusSource"], document["statusSource"]);
      const small = await readCategory(client, id, { section, maxBytes: 2048 });
      assert.deepEqual(small.content, project(document, section));
      assert.equal(small.content["status"], document["status"]);
      assert.deepEqual(small.content["statusSource"], document["statusSource"]);
      assert.equal(small.documentVersion, native.documentVersion);
      if (section === "statement") assert.ok(small.pages.length > 1, "Status survives an actual JSON continuation");
    }
  });

  await t.test("default statement and complete references return native JSON when they fit", async () => {
    const id = records[0]!.id;
    const statement = await call<Page>(client, "read_problem", { id });
    checkPage(statement, 8192);
    assert.equal(statement.section, "statement");
    assert.equal(statement.format, "json");
    assert.deepEqual(statement.content, project(documents.get(id)!, "statement"));
    assert.ok(largestReferences);
    const references = await call<Page>(client, "read_problem", { id: largestReferences.id, section: "references", maxBytes: 32768 });
    checkPage(references, 32768);
    assert.equal(references.format, "json", "The largest current reference category is complete at 32 KiB");
    assert.deepEqual(references.content, project(documents.get(largestReferences.id)!, "references"));
  });

  await t.test("large categories continue at 2 KiB and legacy clients preserve the same content under changing budgets", async () => {
    assert.ok(largestReferences);
    const expected = project(documents.get(largestReferences.id)!, "references");
    const modern = await readCategory(client, largestReferences.id, { section: "references", maxBytes: 2048 });
    assert.ok(modern.pages.length > 1);
    assert.equal(modern.pages[0]!.format, "json-continuation");
    assert.deepEqual(modern.content, expected);
    const legacy = await connect(false);
    const read = await readCategory(legacy, largestReferences.id, { section: "references" }, page => page === 0 ? 2048 : 32768);
    assert.equal(read.pages.length, 2);
    assert.equal(read.pages[1]!.format, "json-continuation", "Larger later budget does not switch away from an already started JSON text stream");
    assert.deepEqual(read.content, expected);
    assert.equal(read.documentVersion, modern.documentVersion);
  });

  await t.test("cursor replay, section inheritance, removed selector rejection and actual HTTP byte accounting", async () => {
    assert.ok(largestReferences);
    const id = largestReferences.id;
    const first = await call<Page>(client, "read_problem", { id, section: "references", maxBytes: 2048 });
    assert.ok(first.nextCursor);
    const args = { id, cursor: first.nextCursor, maxBytes: 2048 };
    const replay = await call<Page>(client, "read_problem", args);
    assert.deepEqual(await call<Page>(client, "read_problem", args), replay, "Retry returns the same category continuation");
    assert.equal(replay.section, "references");
    await refused(client, { ...args, section: "history" }, 400, "cursor_scope_mismatch");
    await refused(client, { ...args, id: records.find(record => record.id !== id)!.id }, 400, "cursor_scope_mismatch");
    await refused(client, { ...args, cursor: first.nextCursor + "x" }, 400, "invalid_cursor");
    for (const removed of [{ section: "all" }, { section: "metadata" }, { blockId: "b0", documentVersion: first.documentVersion }]) {
      const result = await client.callTool({ name: "read_problem", arguments: { id, ...removed } });
      assert.equal(result.isError, true, "Only the four public categories are accepted");
      const query = new URLSearchParams(removed);
      const response = await fetch(origin + "/api/v1/problems/" + id + "/read?" + query);
      assert.equal(response.status, 400);
      assert.equal((await response.json() as Json)["code"], "invalid_query");
    }
    const wire = await fetch(origin + "/api/v1/problems/" + id + "/read?" + new URLSearchParams({ cursor: first.nextCursor, maxBytes: "2048" }));
    assert.equal(wire.status, 200);
    assert.equal(wire.headers.get("cache-control"), "no-store");
    const raw = await wire.text();
    const page = JSON.parse(raw) as Page;
    assert.equal(raw, JSON.stringify(page));
    assert.equal(textBytes(raw), page.responseBytes);
    checkPage(page, 2048);
    assert.deepEqual(page, replay);
    const pinned = await readCategory(client, id, { section: "history", documentVersion: first.documentVersion });
    assert.deepEqual(pinned.content, project(documents.get(id)!, "history"));
  });

  await t.test("resuming after other documents evict the prepared document preserves the exact next response", async () => {
    assert.ok(largestReferences);
    const id = largestReferences.id;
    const first = await call<Page>(client, "read_problem", { id, section: "references", maxBytes: 2048 });
    assert.ok(first.nextCursor);
    const args = { id, cursor: first.nextCursor, maxBytes: 2048 };
    const expected = await call<Page>(client, "read_problem", args);
    const otherIds = records.filter(record => record.id !== id).slice(0, 12).map(record => record.id);
    assert.equal(otherIds.length, 12, "Working set exceeds the eight-document prepared cache");
    for (const otherId of otherIds) checkPage(await call<Page>(client, "read_problem", { id: otherId }), 8192);
    const resumed = await call<Page>(client, "read_problem", args);
    checkPage(resumed, 2048);
    assert.deepEqual(resumed, expected, "Re-preparation preserves content, identity, cursor and original expiry");
  });

  await t.test("legal Source version, citation and title revisions invalidate pinned categories without changing the Problem revision", async () => {
    assert.ok(largestReferences);
    const id = largestReferences.id;
    const problemRevision = service.repo.current().find("Problem", id)!.fields["revision"];
    const reference = (documents.get(id)!["references"] as Json[])[0]!;
    const sourceId = String(reference["sourceId"]);
    for (const change of ["version", "citation", "title"] as const) {
      const first = await call<Page>(client, "read_problem", { id, section: "references", maxBytes: 2048 });
      assert.ok(first.nextCursor);
      const source = service.repo.current().find("Source", sourceId)!;
      await revise(sourceId, id, change === "version" ? { version: "2" }
        : change === "title" ? { title: String(source.fields["title"]) + " (isolated revised source metadata)" } : {},
      change === "citation" ? source.body + "\nRevised bibliographic locator: version-specific appendix." : undefined);
      assert.equal(service.repo.current().find("Problem", id)!.fields["revision"], problemRevision);
      await refused(client, { id, cursor: first.nextCursor }, 409, "document_changed");
      await refused(client, { id, documentVersion: first.documentVersion, section: "statement" }, 409, "document_changed");
      const updated = await readCategory(client, id, { section: "references", maxBytes: 2048 });
      assert.notEqual(updated.documentVersion, first.documentVersion);
      assert.deepEqual(updated.content, project(await call<Json>(client, "get_problem", { id, view: "research" }), "references"));
      const raw = service.repo.current().find("Source", sourceId)!;
      const shown = ((updated.content["references"] as Json[]).find(item => item["sourceId"] === sourceId)!["source"] as Json);
      assert.equal(shown["version"], raw.fields["version"]);
      assert.equal(shown["revision"], raw.fields["revision"]);
      assert.equal(shown["citation"], raw.body);
      assert.match(String(shown["digest"]), /^sha256:[a-f0-9]{64}$/u);
    }
  });

  await t.test("later service body stays in the statement category and never leaks into other categories", async () => {
    const id = records[0]!.id;
    const original = service.repo.current().find("Problem", id)!;
    const body = unicodeParagraph;
    await revise(id, id, {}, body);
    const expected = await call<Json>(client, "get_problem", { id, view: "research" });
    assert.equal(expected["bodyDisposition"], "included");
    assert.equal(expected["body"], body);
    for (const section of sections) {
      const read = await readCategory(client, id, { section, maxBytes: 2048 });
      assert.deepEqual(read.content, project(expected, section));
      if (section === "statement") {
        assert.equal(read.content["body"], body);
        assert.ok(read.pages.length > 3);
      } else assert.equal(Object.hasOwn(read.content, "body"), false);
    }
    const context = await call<Json>(client, "build_context", { id, tokenBudget: 100_000 });
    assert.equal(context["incomplete"], false);
    const contextSections = context["sections"] as Json[];
    assert.equal(contextSections.find(section => section["name"] === "background")!["text"], body);
    for (const [name, field] of [["authoredSource", "source"], ["authoredProgress", "progress"],
      ["authoredComment", "comment"], ["authoredReferences", "references"]] as const) {
      const shown = JSON.parse(String(contextSections.find(section => section["name"] === name)!["text"])) as Json;
      assert.deepEqual(shown["entries"], (expected["research"] as Json)[field]);
    }
  });
});

test("native research preserves background and independent discussion in their semantic categories", { timeout: 60_000 }, async t => {
  const { service, connect, post, revise } = await fixture(t, true);
  const client = await connect();
  const problem = service.repo.current().currentOf("Problem").find(record => (record.fields["aliases"] as string[]).includes("example-conformance-problem"))!;
  await revise(problem.id, problem.id, {}, unicodeParagraph);
  const expected = await call<Json>(client, "get_problem", { id: problem.id, view: "research" });
  assert.equal((expected["research"] as Json)["available"], false);
  assert.equal(expected["body"], unicodeParagraph);
  let pending: Page | undefined;
  for (const section of sections) {
    const read = await readCategory(client, problem.id, { section, maxBytes: 2048 });
    assert.deepEqual(read.content, project(expected, section));
    if (section === "statement") pending = read.pages[0];
    else assert.equal((read.content["researchContext"] as Json)["available"], false);
  }
  assert.ok(pending?.nextCursor);
  const priorRevision = service.repo.current().find("Problem", problem.id)!.fields["revision"];
  const discussion = "Independent discussion: 中文 🧪 and an additional hypothesis.";
  await post([{ type: "Comment", body: discussion, targetType: "problem", targetId: problem.id,
    parentCommentId: null, promotedToContributionId: null }]);
  assert.equal(service.repo.current().find("Problem", problem.id)!.fields["revision"], priorRevision);
  await refused(client, { id: problem.id, cursor: pending.nextCursor }, 409, "document_changed");
  const after = await readCategory(client, problem.id, { section: "comment" });
  assert.notEqual(after.documentVersion, pending.documentVersion);
  assert.deepEqual(after.content, project(await call<Json>(client, "get_problem", { id: problem.id, view: "research" }), "comment"));
  assert.ok((after.content["discussion"] as Json[]).some(comment => comment["body"] === discussion));
  const decisions = after.content["decisions"] as Json[];
  assert.ok(decisions.length > 0);
  for (const decision of decisions) {
    const raw = service.repo.current().find("Decision", String(decision["id"]))!;
    assert.ok(raw.body.length > 0);
    assert.equal(decision["body"], raw.body, "Check the original ledger rationale independently of get_problem");
  }
});
