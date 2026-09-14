import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash, createHmac } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { Ledger, loadRecords } from "../../contract/src/ledger.ts";
import { Index, SearchError, type ProblemRow } from "../src/index.ts";
import { researchSearchPage, RESEARCH_SEARCH_MIN_BYTES, RESEARCH_SEARCH_MAX_BYTES } from "../src/research-search.ts";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { reindex } from "../src/write.ts";

const repository = fileURLToPath(new URL("../../", import.meta.url));
const contractDir = path.join(repository, "contract");

function indexed(t: TestContext) {
  const loaded = loadRecords([path.join(contractDir, "fixtures/ledger"), path.join(contractDir, "fixtures/activity")]);
  assert.deepEqual(loaded.issues, []);
  const ledger = new Ledger(loaded.records);
  const index = new Index(":memory:");
  index.rebuild(ledger, new Map());
  t.after(() => index.close());
  return { ledger, index };
}

const details = (row: ProblemRow) => ({ id: row.id, title: row.title,
  body: `${"界".repeat(1500)} ${String.raw`\forall K > k, x_i^2 \leq 1; "quoted". ` .repeat(20)}`,
  statement: { clauses: [{ text: String.raw`\forall x \in X,\quad f(x)\geq 0` }], conditions: ["Every hypothesis remains present."] },
});
const options = { sort: "edited", sortDescription: "Fixture catalog order, not mathematical difficulty.", maxBytes: RESEARCH_SEARCH_MIN_BYTES };

test("research byte pages retain every whole record, advance by actual count, and preserve the cursor TTL", (t) => {
  const { index } = indexed(t);
  let clock = 1_800_000_000_000;
  t.mock.method(Date, "now", () => clock);
  const filter = { indexedOnly: false, view: "research" as const, limit: 1000 };
  const page = index.problemPage(filter);
  assert.ok(page.rows.length > 2);
  const first = researchSearchPage(index, page, options, details);
  assert.equal(first.status, 200);
  if (first.status !== 200) return;
  assert.ok(first.body.count > 0 && first.body.count < page.rows.length, "the byte limit must stop before the row limit");
  assert.equal(first.body.nextOffset, first.body.count);
  assert.equal(first.body.limit, 1000);
  assert.equal(first.body.responseBytes, Buffer.byteLength(JSON.stringify(first.body), "utf8"));
  assert.ok(first.body.responseBytes <= options.maxBytes);
  assert.deepEqual(first.body.problems, page.rows.slice(0, first.body.count).map(details));
  const cursorData = (cursor: string) => JSON.parse(Buffer.from(cursor.split(".")[0]!, "base64url").toString("utf8")) as { expiresAt: number };
  assert.equal(cursorData(first.body.nextCursor!).expiresAt, clock + 3_600_000);
  const ids = first.body.problems.map(problem => problem.id);
  let cursor = first.body.nextCursor;
  clock += 30 * 60 * 1000;
  while (cursor) {
    const next = researchSearchPage(index, index.problemPage({ ...filter, limit: 2, cursor }), { ...options, maxBytes: 32_768 }, details);
    assert.equal(next.status, 200);
    if (next.status !== 200) return;
    assert.ok(next.body.count > 0);
    if (next.body.nextCursor) assert.equal(cursorData(next.body.nextCursor).expiresAt, 1_800_000_000_000 + 3_600_000, "continuing cannot renew expiry");
    ids.push(...next.body.problems.map(problem => problem.id));
    cursor = next.body.nextCursor;
  }
  assert.deepEqual(ids, page.rows.map(row => row.id), "no record is skipped or repeated when byte and row limits change");
});

test("the oversized first record fails explicitly and the exact recommended byte budget succeeds", (t) => {
  const { index } = indexed(t);
  const filter = { indexedOnly: false, view: "research" as const, limit: 1000 };
  const page = index.problemPage(filter);
  const oversized = (row: ProblemRow) => ({ ...details(row), body: "界".repeat(30_000) + String.raw`\frac{A}{B}\neq C` });
  const refused = researchSearchPage(index, page, options, oversized);
  assert.equal(refused.status, 413);
  if (refused.status !== 413) return;
  assert.equal(refused.body.code, "response_budget_too_small");
  assert.equal(refused.body.problemId, page.rows[0]!.id);
  assert.ok(refused.body.minimumRequiredBytes > options.maxBytes);
  assert.ok(!Object.hasOwn(refused.body, "problems"), "an oversized record never becomes partial scientific success");
  const retry = researchSearchPage(index, page, { ...options, maxBytes: refused.body.minimumRequiredBytes }, oversized);
  assert.equal(retry.status, 200);
  if (retry.status !== 200) return;
  assert.equal(retry.body.count, 1);
  assert.equal(retry.body.responseBytes, refused.body.minimumRequiredBytes);
  assert.deepEqual(retry.body.problems[0], oversized(page.rows[0]!));
});

test("research and summary cursors are isolated while original summary scopes remain valid", (t) => {
  const { ledger, index } = indexed(t);
  const filter = { indexedOnly: false, limit: 1 };
  const summary = index.problemPage(filter);
  const research = index.problemPage({ ...filter, view: "research" });
  const mismatch = (error: unknown) => error instanceof SearchError && error.code === "cursor_query_mismatch";
  assert.throws(() => index.problemPage({ ...filter, view: "research", cursor: summary.nextCursor! }), mismatch);
  assert.throws(() => index.problemPage({ ...filter, cursor: research.nextCursor! }), mismatch);

  // Construct the exact pre-research-view scope independently; no new default
  // projection property may invalidate already signed summary cursors.
  const scope = createHash("sha256").update(JSON.stringify({ text: "", status: null, area: null, topic: null,
    difficulty: null, indexedOnly: false, sort: "edited", exactAliasIds: [] })).digest("hex");
  const payload = Buffer.from(JSON.stringify({ version: index.catalogVersion(), scope, offset: 1, expiresAt: Date.now() + 60_000 })).toString("base64url");
  const secret = (index.db.prepare("SELECT value FROM meta WHERE key = 'cursorSecret'").get() as { value: string }).value;
  const legacy = `${payload}.${createHmac("sha256", secret).update(payload).digest("base64url")}`;
  assert.equal(index.problemPage({ ...filter, view: "summary", cursor: legacy }).offset, 1);

  const pending = index.problemPage({ ...filter, view: "research" });
  ledger.currentOf("Problem")[0]!.body += "\nNew progress changes the catalog version.";
  index.rebuild(ledger, new Map());
  assert.throws(() => index.prefixProblemPage(pending, 1), (error: unknown) => error instanceof SearchError && error.code === "catalog_changed");
});

test("empty research pages terminate honestly without a cursor or implicit scientific content", (t) => {
  const { index } = indexed(t);
  const result = researchSearchPage(index, index.problemPage({ text: "nonexistent-search-marker", view: "research" }), options, () => assert.fail("no missing record can be materialized"));
  assert.equal(result.status, 200);
  if (result.status !== 200) return;
  assert.equal(result.body.count, 0);
  assert.equal(result.body.total, 0);
  assert.equal(result.body.nextCursor, null);
  assert.equal(result.body.nextOffset, null);
  assert.deepEqual(result.body.problems, []);
  assert.equal(result.body.responseBytes, Buffer.byteLength(JSON.stringify(result.body), "utf8"));
});

test("research-search HTTP preserves single-detail content, exact wire bytes, strict arguments and budget errors", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-research-search-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(root, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(root, "activity"), { recursive: true });
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: "pipe" });
  git(["init", "-q", "-b", "main"]);
  git(["add", "--all"]);
  git(["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "commit", "-q", "-m", "Seed research-search fixture"]);
  const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"), contractDir,
    dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false });
  const server = createServer(service);
  t.after(async () => {
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    service.index.close(); service.auth.close(); service.submissions.close();
    fs.rmSync(root, { recursive: true, force: true });
  });
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const get = async (route: string) => {
    const response = await fetch(`http://127.0.0.1:${address.port}${route}`, { headers: { Connection: "close" } });
    const text = await response.text();
    return { status: response.status, contentLength: Number(response.headers.get("content-length")), text, body: JSON.parse(text) as Record<string, any> };
  };

  const capabilities = await get("/api/v1/status");
  assert.equal(capabilities.body.retrievalVersion, "qop-retrieval/1");
  assert.equal(capabilities.body.researchSearchVersion, "qop-search-research/1");
  const plain = await get("/api/v1/problems?limit=1");
  const explicit = await get("/api/v1/problems?limit=1&view=summary");
  assert.equal(plain.body.schemaVersion, "qop-search/2");
  const withoutCursor = ({ nextCursor: _next, ...body }: Record<string, any>) => body;
  assert.deepEqual(withoutCursor(explicit.body), withoutCursor(plain.body));
  assert.ok(!Object.hasOwn(plain.body, "maxBytes"));

  const defaultBudget = await get("/api/v1/problems?view=research&includeCandidates=true");
  assert.equal(defaultBudget.status, 200);
  assert.equal(defaultBudget.body.maxBytes, 32_768, "an omitted maxBytes uses the conservative research-page default");
  assert.equal(defaultBudget.body.responseBytes, defaultBudget.contentLength);
  assert.ok(defaultBudget.contentLength <= 32_768);

  const complete = await get(`/api/v1/problems?view=research&includeCandidates=true&maxBytes=${RESEARCH_SEARCH_MAX_BYTES}`);
  assert.equal(complete.status, 200);
  assert.equal(complete.text, JSON.stringify(complete.body));
  assert.equal(complete.contentLength, Buffer.byteLength(complete.text, "utf8"));
  assert.equal(complete.body.responseBytes, complete.contentLength);
  assert.equal(complete.body.count, complete.body.total);
  assert.equal(complete.body.nextCursor, null);
  assert.deepEqual(defaultBudget.body.problems, complete.body.problems.slice(0, defaultBudget.body.count), "the default budget returns complete records without dropping fields");
  for (const problem of complete.body.problems) {
    const single = await get(`/api/v1/problems/${problem.id}?view=research`);
    assert.equal(single.status, 200);
    assert.deepEqual(problem, single.body, "every scientific field must equal the existing single-problem research view");
  }

  for (const query of ["view=full", "view=", "view=summary&view=research", "maxBytes=65536", "view=summary&maxBytes=65536",
    "view=research&maxBytes=65536&maxBytes=65536", "view=research&status=Solved&status=Unsolved", "view=research&text=a&text=b",
    "view=research&maxBytes=16383", "view=research&maxBytes=1048577", "view=research&maxBytes=NaN", "view=research&maxBytes=1e6",
    "view=research&maxBytes=16384.5", "view=research&limit=0", "view=research&offset=-1", "view=research&includeCandidates=maybe",
    "view=research&difficulty=easy", "view=research&topic=missing-topic", "view=research&status=Improved", "view=research&sort=recently-solved",
    "view=research&text=", "view=research&cursor=", "view=research&unknown=1"]) {
    assert.equal((await get(`/api/v1/problems?${query}`)).status, 400, query);
  }

  const firstId = String(complete.body.problems[0].id);
  const record = service.repo.current().find("Problem", firstId)!;
  record.body += `\n${"界".repeat(40_000)}\n${String.raw`\forall X, A_X \neq A_x`}`;
  reindex(service);
  const selector = `view=research&includeCandidates=true&text=${firstId}&limit=1`;
  const defaultRefused = await get(`/api/v1/problems?${selector}`);
  assert.equal(defaultRefused.status, 413, "a problem exceeding the default budget must fail rather than truncate");
  assert.equal(defaultRefused.body.maxBytes, 32_768);
  assert.equal(defaultRefused.body.problemId, firstId);
  assert.ok(defaultRefused.body.minimumRequiredBytes > 32_768);
  assert.ok(!Object.hasOwn(defaultRefused.body, "problems"));
  const refused = await get(`/api/v1/problems?${selector}&maxBytes=${RESEARCH_SEARCH_MIN_BYTES}`);
  assert.equal(refused.status, 413);
  assert.equal(refused.body.code, "response_budget_too_small");
  assert.equal(refused.body.problemId, firstId);
  assert.ok(!Object.hasOwn(refused.body, "problems"));
  const retried = await get(`/api/v1/problems?${selector}&maxBytes=${refused.body.minimumRequiredBytes}`);
  assert.equal(retried.status, 200);
  assert.equal(retried.body.responseBytes, retried.contentLength);
  assert.ok(retried.contentLength <= refused.body.minimumRequiredBytes);
  assert.equal(retried.body.problems[0].body, record.body);
});
