import http from "node:http";
import { createApp } from "../service/app.mjs";
import { newActorId, newApiKey } from "../service/ids.mjs";
import { openReadModels } from "../service/read-models.mjs";
import { openStore } from "../service/store.mjs";
import { siteDirectory } from "../core/catalog.mjs";

export const PROBLEM_ID = "ruskai-2007-multiplicativity-p2-channel-classes";
export const STATEMENT_ID = `${PROBLEM_ID}-statement-v1`;
export const CLAUSE_ID = "positive-channel-classes";

export const sampleCandidateUpdate = (overrides = {}) => ({
  problemId: PROBLEM_ID,
  statementId: STATEMENT_ID,
  targetClauseIds: [CLAUSE_ID],
  updateKind: "partial-theorem",
  title: "Unital qubit factors preserve multiplicativity",
  claim: "For every unital qubit channel Phi and every channel Omega, the maximal output 2-norm is multiplicative.",
  hypotheses: ["Phi is a unital qubit channel"],
  scope: "Restricted class; the general classification remains open.",
  sources: [{ type: "preprint", uri: "https://arxiv.org/abs/9999.00001", locator: "Theorem 1", citation: "A. Author, Test paper, arXiv:9999.00001" }],
  artifacts: [{ type: "proof", uri: "https://example.org/proof.pdf", digest: null, locator: null, description: "Proof file" }],
  proposedEffect: { relation: "narrows", statusChange: "none" },
  remainingGap: "The exhaustive characterization is untouched.",
  aiUse: { level: "agent-generated", systems: ["test-model"], humanChecks: ["operator read the proof"] },
  ...overrides
});

export const sampleReview = (candidateUpdateId, overrides = {}) => ({
  candidateUpdateId,
  reviewType: "argument",
  verdict: "accept",
  summary: "The argument is complete and matches the stated hypotheses.",
  references: [],
  checks: [{ name: "proof read", result: "pass" }],
  conflictOfInterest: { declared: false },
  ...overrides
});

export const editorialAccept = (candidateUpdateId, overrides = {}) => sampleReview(candidateUpdateId, {
  reviewType: "editorial",
  verdict: "accept",
  summary: "Accepted after an independent argument review; promote as a narrowing claim.",
  statusEffect: "none",
  acceptedClaim: {
    title: "Unital qubit factors preserve multiplicativity at p = 2",
    text: "Multiplicativity of the maximal output 2-norm holds whenever one tensor factor is a unital qubit channel.",
    relation: "narrows",
    maturity: "Preprint",
    strength: "Exact restricted theorem",
    label: "arXiv",
    date: "2026-08-30"
  },
  ...overrides
});

export const startService = async (options = {}) => {
  const store = openStore(":memory:");
  const readModels = openReadModels(siteDirectory);
  const app = createApp({ store, readModels, publicUrl: "http://service.test", ...options });
  app.ingest();
  const server = http.createServer(app.handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const actors = {};
  const createActor = (name, type, roles, metadata = {}) => {
    const actor = store.insertActor({ id: newActorId(), type, displayName: name, identifier: null, metadata, roles, state: "active" });
    const key = newApiKey();
    store.insertApiKey(key, actor.id, "test");
    actors[name] = { actor, key };
    return actors[name];
  };
  const call = async (method, route, { key, body, headers = {}, raw } = {}) => {
    const response = await fetch(`${base}${route}`, {
      method,
      headers: { ...(key ? { Authorization: `Bearer ${key}` } : {}), ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers },
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body))
    });
    const text = await response.text();
    let json = null;
    try { json = JSON.parse(text); } catch { json = text; }
    return { status: response.status, body: json, headers: response.headers };
  };
  const close = async () => { await new Promise((resolve) => server.close(resolve)); store.close(); };
  return { store, readModels, app, base, call, createActor, actors, close };
};
