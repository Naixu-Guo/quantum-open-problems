import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { parseResearchUpdate } from "../src/research-updates.ts";
import { parseSubmission, SubmissionStore } from "../src/submissions.ts";
import { verifyArchivalDocuments } from "../src/archival-sources.ts";
import { configFromEnv, submissionsDefaults } from "../src/config.ts";
import { createService } from "../src/service.ts";
import { createServer } from "../src/api.ts";
import { hashKey } from "../src/auth.ts";

const report = (extra: Record<string, unknown> = {}) => ({
  kind: "research", problemId: "op_0000000000000001", updateType: "resolution",
  archivalLinks: ["https://arxiv.org/abs/2401.00001"],
  summary: "The authors report a resolution in the cited manuscript.",
  contributor: { name: "Example Reporter", email: "private@example.test", affiliation: "Example University", anonymous: true },
  consent: true, contentLicense: "CC-BY-4.0", extra: "", ...extra,
});
const proposal = (extra: Record<string, unknown> = {}) => ({
  title: "A proposed catalog problem", statement: "Does this synthetic test problem have a solution?",
  fields: ["Quantum Computing"], topics: ["Complexity"], contributor: report().contributor, consent: true, ...extra,
});

test("archival links are mandatory on all new progress kinds and known-progress proposals", () => {
  for (const updateType of ["resolution", "partial", "computation", "correction", "follow-up"]) {
    for (const archivalLinks of [undefined, [], [""], ["https://github.com/Naixu-Guo/quantum-open-problems/issues/1"], ["https://example.org/manuscript.pdf"]]) {
      assert.throws(() => parseResearchUpdate(report({ updateType, archivalLinks }), false), /archival|manuscript|source|paper/i);
    }
  }
  const parsed = parseResearchUpdate(report({ archivalLinks: ["arXiv:2401.00001v2"] }), false);
  assert.deepEqual(parsed.payload.archivalLinks, ["https://arxiv.org/abs/2401.00001v2"]);
  assert.equal(parsed.payload.researchUpdate!.updateType, "resolution", "reported scope does not certify it");
  assert.equal(parsed.payload.contributor.anonymous, true);
  assert.throws(() => parseResearchUpdate(report({ summary: "x".repeat(1501) }), false), /1500/);
  assert.throws(() => parseResearchUpdate(report({ consent: false }), false), /consent/);
  assert.throws(() => parseResearchUpdate(report({ extra: "spam" }), false), /anti-spam/);
  assert.throws(() => parseResearchUpdate(report({ contributor: { name: "Example" } }), false), /email/);
  assert.throws(() => parseResearchUpdate(report({ relatedReportUrl: "javascript:alert(1)" }), false), /HTTPS/);
  assert.doesNotThrow(() => parseSubmission(proposal(), false), "ordinary proposals need no resolving paper");
  assert.throws(() => parseSubmission(proposal({ progress: "A new result is claimed." }), false), /archival/);
  assert.doesNotThrow(() => parseSubmission(proposal({ progress: "A result is reported in this manuscript.", archivalLinks: report().archivalLinks }), false));
});

test("historical requests preserve GitHub-only provenance and cannot self-certify eligibility", () => {
  const parsed = parseResearchUpdate(report({
    kind: "historical", archivalLinks: [], historicalUrl: "https://github.com/Naixu-Guo/quantum-open-problems/issues/12#issuecomment-123",
    historicalProvenance: "confirmed", status: "solved",
  }), false);
  assert.equal(parsed.payload.researchUpdate!.historicalProvenance, "pending");
  assert.deepEqual(parsed.payload.archivalLinks, []);
  for (const historicalUrl of ["https://github.com/other/project/issues/12", "https://github.com/Naixu-Guo/quantum-open-problems", "https://github.com.evil.test/Naixu-Guo/quantum-open-problems/issues/12"]) {
    assert.throws(() => parseResearchUpdate(report({ kind: "historical", archivalLinks: [], historicalUrl }), false), /original|project|GitHub|report|Link/);
  }
  const store = new SubmissionStore(":memory:");
  try {
    const receipt = store.accept(parsed.payload, { address: "test", userAgent: "", captchaProvider: "basic" });
    assert.equal(store.get(receipt.id)!.state, "received");
    assert.throws(() => store.setState(receipt.id, "accepted", "", null), /received.*documented/);
    assert.equal(store.setState(receipt.id, "needs-details", "Identify the original report version.", null)!.state, "needs-details");
    assert.equal(store.setState(receipt.id, "documented", "Recorded through a separate catalog PR.", null)!.state, "documented");
    assert.equal(store.get(receipt.id)!.payload.researchUpdate!.historicalProvenance, "pending", "an inbox state is not a provenance assertion");
  } finally { store.close(); }
});

test("metadata checks allow unreviewed manuscripts and reject non-paper deposits using trusted registries", async () => {
  const requested: string[] = [];
  const fake = (body: unknown, status = 200): typeof fetch => (async (input: string | URL | Request, init?: RequestInit) => {
    requested.push(String(input));
    assert.equal(init?.redirect, "error");
    assert.ok(init?.signal);
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  }) as typeof fetch;
  await verifyArchivalDocuments(["https://arxiv.org/abs/2401.00001"], fake({}));
  assert.equal(requested.length, 0, "arXiv IDs do not require a peer-review lookup");
  await verifyArchivalDocuments(["https://zenodo.org/records/123"], fake({ metadata: { resource_type: { type: "publication", subtype: "preprint" } } }));
  assert.equal(requested.pop(), "https://zenodo.org/api/records/123");
  await verifyArchivalDocuments(["https://doi.org/10.5281/zenodo.123"], fake({ metadata: { resource_type: { type: "publication", subtype: "preprint" } } }));
  for (const type of ["dataset", "software"]) {
    await assert.rejects(verifyArchivalDocuments(["https://zenodo.org/records/123"], fake({ metadata: { resource_type: { type } } })), /dataset and software/);
  }
  await verifyArchivalDocuments(["https://doi.org/10.1234/paper"], fake({ message: { type: "posted-content" } }));
  await assert.rejects(verifyArchivalDocuments(["https://doi.org/10.1234/data"], fake({ message: { type: "dataset" } })), /not a dataset/);
  const datacite = (type: string): typeof fetch => (async input => String(input).startsWith("https://api.crossref.org/")
    ? new Response("{}", { status: 404 })
    : new Response(JSON.stringify({ data: { attributes: { types: { resourceTypeGeneral: type, resourceType: type } } } }))) as typeof fetch;
  await verifyArchivalDocuments(["https://doi.org/10.1234/preprint"], datacite("Preprint"));
  await assert.rejects(verifyArchivalDocuments(["https://doi.org/10.1234/dataset"], datacite("Dataset")), /not a dataset/);
  await assert.rejects(verifyArchivalDocuments(["https://doi.org/10.1234/software"], datacite("Software")), /not a dataset/);
  await assert.rejects(verifyArchivalDocuments(["https://doi.org/10.1234/paper"], fake({}, 503)), /temporarily unavailable/);
  await assert.rejects(verifyArchivalDocuments(["https://doi.org/10.1234/paper"], (async () => { throw new Error("offline"); }) as typeof fetch), /keep your draft and retry/);
});

test("HTTP progress filing is opt-in, source-gated, private, rate-limited, and never changes the catalog", async t => {
  const contractDir = path.resolve(import.meta.dirname, "../../contract");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-progress-"));
  fs.cpSync(path.join(contractDir, "fixtures/ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(contractDir, "fixtures/activity"), path.join(tmp, "activity"), { recursive: true });
  const key = "test-only-random-progress-inbox-key";
  const origin = "https://api.example.test";
  const site = "https://site.example.test";
  const service = createService({
    ledgerDir: path.join(tmp, "ledger"), activityDir: path.join(tmp, "activity"), contractDir,
    dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false, web: { publicUrl: origin, webDir: null },
    submissions: { mode: "basic", inboxKeyHash: hashKey(key), allowedOrigins: [site], perAddressPerHour: 50 },
  });
  const server = createServer(service);
  t.after(async () => { await new Promise<void>(resolve => server.close(() => resolve())); service.index.close(); service.auth.close(); service.submissions.close(); fs.rmSync(tmp, { recursive: true, force: true }); });
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = "http://127.0.0.1:" + (server.address() as { port: number }).port;
  const before = JSON.stringify(service.repo.current().records.map(row => [row.id, row.fields, row.body]));
  const problemId = service.repo.current().currentOf("Problem")[0]!.id;
  async function call(route: string, body?: unknown, headers: Record<string, string> = {}) {
    const response = await fetch(base + route, { headers: { ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers }, ...(body === undefined ? {} : { method: "POST", body: JSON.stringify(body) }) });
    return { status: response.status, headers: response.headers, body: await response.json() as any };
  }
  const endpoint = "/api/v1/research-updates";
  assert.equal(submissionsDefaults(configFromEnv({ QOP_SUBMISSIONS_MODE: "basic" })).researchUpdatesEnabled, false);
  assert.equal(submissionsDefaults(configFromEnv({ QOP_RESEARCH_UPDATES_ENABLED: "true" })).researchUpdatesEnabled, true);
  assert.equal((await call(endpoint, report({ problemId }))).status, 503);
  service.submissionsConfig.researchUpdatesEnabled = true;
  assert.equal((await call(endpoint, report({ problemId, archivalLinks: [] }))).status, 422, "direct API calls cannot bypass required links");
  assert.equal(service.submissions.capacity.usage().rows.used, 0);
  assert.equal((await call(endpoint, report({ problemId: "not-a-catalog-problem" }))).status, 404);
  const received = await call(endpoint, report({ problemId }), { Origin: site });
  assert.equal(received.status, 201);
  assert.equal(received.body.received, true);
  assert.equal(received.body.accepted, undefined);
  assert.equal(received.headers.get("access-control-allow-origin"), site);
  assert.ok(!JSON.stringify(received.body).includes("private@example.test"));
  assert.equal((await call(endpoint, report({ problemId }))).body.id, received.body.id);
  assert.equal((await call("/api/v1/submissions/" + received.body.id)).status, 401);
  const historical = await call(endpoint, report({ problemId, kind: "historical", archivalLinks: [], historicalUrl: "https://github.com/Naixu-Guo/quantum-open-problems/issues/12", historicalProvenance: "confirmed" }));
  assert.equal(historical.status, 201);
  assert.equal(service.submissions.get(historical.body.id)!.payload.researchUpdate!.historicalProvenance, "pending");
  const login = await call("/inbox/login", { key }, { Origin: origin });
  const headers = { Cookie: login.headers.get("set-cookie")!.split(";")[0]!, Origin: origin };
  const privateReport = await call("/api/v1/submissions/" + received.body.id, undefined, headers);
  assert.equal(privateReport.body.contributor.email, report().contributor.email);
  assert.match(privateReport.headers.get("cache-control")!, /no-store/);
  assert.equal((await call("/api/v1/submissions/" + received.body.id + "/state", { state: "accepted" }, headers)).status, 422);
  assert.equal((await call("/api/v1/submissions/" + received.body.id + "/state", { state: "documented", note: "Recorded separately." }, headers)).status, 200);
  assert.equal((await call("/api/v1/submissions", proposal())).status, 201, "old proposal intake remains available");
  assert.equal((await call("/api/v1/submissions", proposal({ progress: "A new source-free claim." }))).status, 422);
  assert.equal(JSON.stringify(service.repo.current().records.map(row => [row.id, row.fields, row.body])), before);
  service.submissionsConfig.perAddressPerHour = 1;
  assert.equal((await call(endpoint, report({ problemId }))).status, 429, "report and proposal routes share the address budget");
});
