/**
 * Conformance run: drives a service through the agent interface using only HTTP and the
 * payload schemas, the way an external agent would. Read, work, write, and confirm that
 * the records the service wrote are what the contract says they should be.
 *
 *   node --experimental-strip-types contract/conformance/run.ts <baseUrl> <agentToken> [verifierToken ...]
 */

export interface ConformanceOptions {
  baseUrl: string;
  tokens: { agent: string; verifiers: string[] };
}

export interface ConformanceReport {
  steps: { name: string; ok: boolean; detail: string }[];
  failures: string[];
}

async function request(baseUrl: string, method: "GET" | "POST", route: string, options: { token?: string; body?: unknown; raw?: Uint8Array; headers?: Record<string, string> } = {}): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = { ...(options.headers ?? {}) };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  let body: string | Uint8Array | undefined;
  if (options.raw) body = options.raw;
  else if (options.body !== undefined) { body = JSON.stringify(options.body); headers["Content-Type"] = "application/json"; }
  const init: RequestInit = { method, headers };
  if (body !== undefined) init.body = body;
  const response = await fetch(`${baseUrl}${route}`, init);
  return { status: response.status, body: await response.json() };
}

export async function runConformance(options: ConformanceOptions): Promise<ConformanceReport> {
  const { baseUrl, tokens } = options;
  const report: ConformanceReport = { steps: [], failures: [] };
  const step = (name: string, ok: boolean, detail: string) => {
    report.steps.push({ name, ok, detail });
    if (!ok) report.failures.push(`${name}: ${detail}`);
  };
  const get = (route: string, token?: string) => request(baseUrl, "GET", route, token ? { token } : {});
  const post = (route: string, token: string, body: unknown, headers: Record<string, string> = {}) => request(baseUrl, "POST", route, { token, body, headers });

  // Read.
  const status = await get("/api/v1/status");
  step("status", status.status === 200 && typeof status.body.lastSequence === "number", JSON.stringify(status.body).slice(0, 200));
  const policy = await get("/api/v1/policy");
  step("policy", policy.status === 200 && typeof policy.body.policyVersion === "string", `policy ${policy.body.policyVersion}`);
  const schema = await get("/api/v1/schemas/payloads/batch");
  step("payload schema", schema.status === 200 && schema.body.title === "Batch submission", schema.body.title ?? "");
  const list = await get("/api/v1/problems?status=partial&limit=5");
  const target = list.body.problems?.[0];
  step("search", list.status === 200 && Boolean(target), `${list.body.count} problem(s)`);
  if (!target) return report;
  const frontier = await get(`/api/v1/problems/${target.id}/frontier`);
  step("frontier", frontier.status === 200 && frontier.body.statement?.digest?.startsWith("sha256:"), `${frontier.body.clauses?.length} clause(s)`);
  const clause = frontier.body.clauses?.find((c: { status: string }) => c.status === "open") ?? frontier.body.clauses?.[0];
  const events = await get("/api/v1/events?after=0&limit=3");
  step("events", events.status === 200 && events.body.events?.length === 3 && events.body.events[0].sequence === 1, `next ${events.body.nextAfter}`);

  // Work.
  const started = await post("/api/v1/trajectories", tokens.agent, { kind: "research", problemIds: [target.id], statementDigests: [frontier.body.statement.digest], clauseIds: [clause.ref], contextBundleId: null, harnessConfig: "conformance", budget: "conformance", visibility: "public" });
  step("start trajectory", started.status === 201 && typeof started.body.trajectoryId === "string", JSON.stringify(started.body).slice(0, 200));
  const trajectoryId = started.body.trajectoryId as string;
  const read = await post(`/api/v1/trajectories/${trajectoryId}/events`, tokens.agent, { kind: "read", summary: "Read the frontier", problemId: target.id, clauseId: clause.ref });
  const decompose = await post(`/api/v1/trajectories/${trajectoryId}/events`, tokens.agent, { kind: "decompose", summary: "Formulated an auxiliary lemma", problemId: target.id, clauseId: clause.ref });
  step("log events", read.status === 201 && decompose.body.seq === 2, `seq ${decompose.body.seq}`);
  const upload = await request(baseUrl, "POST", `/api/v1/trajectories/${trajectoryId}/artifacts`, { token: tokens.agent, raw: new TextEncoder().encode("# Conformance notes\n\nThe auxiliary lemma reduces the clause.\n"), headers: { "Content-Type": "text/markdown", "X-Artifact-Kind": "proof-text", "X-Artifact-Title": "Conformance notes" } });
  step("upload artifact", upload.status === 201 && typeof upload.body.id === "string", upload.body.digest ?? JSON.stringify(upload.body));

  // Write: an attempt report that formulates an auxiliary problem and claims a partial result on it.
  const lemmaBody = "## Formal statement\n\nConformance lemma: the clause admits a reduction to a finite check.\n";
  const digest = await sha256Text(lemmaBody);
  const closed = await post(`/api/v1/trajectories/${trajectoryId}/close`, tokens.agent, {
    cost: { tokens: 1000, wallTimeSeconds: 10, moneyUsd: 0.01 },
    body: "Conformance run: decomposed the clause into a lemma and stopped at an obstacle.",
    attemptReport: { records: [
      { ref: "lemma", type: "Problem", body: "Formulated during the conformance run.", revision: 1, title: "Conformance lemma", role: "auxiliary", parentProblemId: target.id, parentClauseId: clause.ref, aliases: [`conformance-lemma-${trajectoryId.slice(-6).toLowerCase()}`], origin: "agent-formulated", posed: null, areaIds: target.areaIds, topicIds: target.topicIds, keywords: ["conformance"], difficulty: "unrated", verificationCost: "unrated", relatedProblemIds: [] },
      { ref: "lemma-statement", type: "Statement", body: lemmaBody, problemId: "$ref:lemma", version: 1, digest, clauses: [{ id: "reduces", label: "Reduction", text: "The clause reduces to a finite check.", kind: "decision", resolutionCriteria: "Prove or refute the reduction.", supersedesClauseId: null, quantity: null }] },
      { ref: "claim", type: "Claim", body: "The reduction holds for the first case.", title: "Reduction in the first case", statementId: "$ref:lemma-statement", clauseIds: ["$ref:lemma-statement#reduces"], relation: "narrows", bound: null, support: [{ sourceId: null, artifactId: upload.body.id, locator: "Section 1", date: null, maturity: "unreviewed-artifact", strength: "restricted-theorem" }] },
      { ref: "report", type: "Contribution", body: "Route: reduce the clause to a lemma. Result: the lemma holds in the first case; the general case is blocked.", title: "Conformance attempt", kind: "attempt-report", trajectoryId: "$ref:trajectory", problemIds: [target.id], statementId: frontier.body.statement.id, statementDigest: frontier.body.statement.digest, clauseIds: [clause.ref], stopReason: "obstacle", newProblemIds: ["$ref:lemma"], newStatementId: "$ref:lemma-statement", referenceIds: [], claimIds: ["$ref:claim"], artifactIds: [upload.body.id], declaredReadIds: [frontier.body.statement.id], revisions: [], aiInvolvement: "autonomous", license: "CC-BY-4.0" },
    ] },
  });
  step("close with attempt report", closed.status === 201 && closed.body.accepted === true, JSON.stringify(closed.body).slice(0, 300));
  if (closed.status !== 201) return report;
  const reportId = closed.body.attemptReportId as string;
  const view = await get(`/api/v1/contributions/${reportId}`);
  step("attempt report submitted", view.status === 200 && view.body.state === "submitted", `state ${view.body.state}`);
  const trajectory = await get(`/api/v1/records/${trajectoryId}`);
  step("trajectory written once at close", trajectory.status === 200 && trajectory.body.eventCount === 2 && trajectory.body.attemptReportId === reportId, `events ${trajectory.body.eventCount}`);

  // Verification by independent reviewers, then the automatic decisions.
  for (const [index, token] of tokens.verifiers.entries()) {
    const review = await post("/api/v1/batches", token, { records: [
      { type: "Review", body: "Conformance review.", contributionId: reportId, trajectoryId: null, kind: "verification", independence: { differentOperator: true, differentModelFamily: true, noSharedReads: true }, conflictOfInterest: { declared: false, statement: "" }, methods: ["citation-check", "argument-read", "scope-check"], checks: [{ name: "report matches events", outcome: "pass", note: "" }], verdict: "verified-partial" },
    ] });
    step(`verifier ${index + 1} review`, review.status === 201, JSON.stringify(review.body).slice(0, 200));
  }
  const after = await get(`/api/v1/contributions/${reportId}`);
  const expectAccepted = tokens.verifiers.length >= 1;
  step("attempt report accepted after review", !expectAccepted || after.body.state === "accepted", `state ${after.body.state}, level ${after.body.verificationLevel}`);
  const tree = await get(`/api/v1/problems/${target.id}/tree`);
  const lemma = tree.body.tree?.find((node: { id: string }) => node.id === closed.body.refs.lemma);
  step("auxiliary problem in the tree", Boolean(lemma) && (!expectAccepted || lemma.catalogState === "published"), lemma ? `${lemma.catalogState}/${lemma.status}` : "missing");
  const frontierAfter = await get(`/api/v1/problems/${target.id}/frontier`);
  step("route tried on the frontier", !expectAccepted || frontierAfter.body.routesTried?.some((r: { id: string }) => r.id === reportId), `${frontierAfter.body.routesTried?.length} route(s)`);
  return report;
}

async function sha256Text(body: string): Promise<string> {
  const normalized = `${body.normalize("NFC").replace(/\r\n?/gu, "\n").split("\n").map((line) => line.replace(/[ \t]+$/u, "")).join("\n").replace(/\n+$/u, "")}\n`;
  const bytes = new TextEncoder().encode(normalized);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return `sha256:${[...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
}

const invokedDirectly = typeof process !== "undefined" && process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop() ?? "");
if (invokedDirectly) {
  const [baseUrl, agent, ...verifiers] = process.argv.slice(2);
  if (!baseUrl || !agent) {
    console.error("usage: run.ts <baseUrl> <agentToken> [verifierToken ...]");
    process.exit(2);
  }
  runConformance({ baseUrl, tokens: { agent, verifiers } }).then((report) => {
    for (const s of report.steps) console.log(`${s.ok ? "ok  " : "FAIL"} ${s.name}: ${s.detail}`);
    console.log(report.failures.length === 0 ? "Conformance passed." : `Conformance failed: ${report.failures.length} step(s).`);
    process.exit(report.failures.length === 0 ? 0 : 1);
  });
}
