// Domain rules shared by the validator, projections, service, and MCP adapter.
// Everything here is pure: no file or network access.

import { createHash } from "node:crypto";

export const RECORD_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const FULL_DATE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
export const RESEARCH_DATE = /^[0-9]{4}(?:-[0-9]{2}-[0-9]{2})?$/;

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");

// Stable JSON serialization with sorted object keys, used for content digests.
export const canonicalJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

export const contentDigest = (value) => sha256(canonicalJson(value));

export const extractSection = (markdown, heading) => {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const body = markdown.slice(start + marker.length);
  const end = body.search(/^## /m);
  return (end < 0 ? body : body.slice(0, end)).trim();
};

export const byId = (items) => new Map(items.map((item) => [item.id, item]));

export const currentStatement = (record) => {
  const superseded = new Set(record.statements
    .map((statement) => statement.supersedesStatementId)
    .filter(Boolean));
  const statements = record.statements.filter((statement) => !superseded.has(statement.id));
  if (statements.length !== 1) {
    throw new Error(`${record.problem.id}: expected exactly one current statement`);
  }
  return statements[0];
};

export const currentDecision = (record) => {
  const superseded = new Set(record.decisions
    .filter((decision) => decision.outcome === "accepted")
    .map((decision) => decision.supersedesDecisionId)
    .filter(Boolean));
  const decisions = record.decisions.filter((decision) => decision.decisionType === "status-assessment"
    && decision.outcome === "accepted"
    && !superseded.has(decision.id));
  if (decisions.length !== 1) {
    throw new Error(`${record.problem.id}: expected exactly one current accepted status decision`);
  }
  return decisions[0];
};

// Claims that are not superseded by a later claim in the same record.
export const activeClaims = (record) => {
  const superseded = new Set(record.claims.map((claim) => claim.supersedesClaimId).filter(Boolean));
  return record.claims.filter((claim) => !superseded.has(claim.id));
};

export const deriveStatus = (record) => currentDecision(record).status;

export const statusLabel = (status) => {
  if (status === "partial" || status === "partially_solved") return "Partially solved";
  if (status === "solved") return "Solved";
  return "Open";
};

export const statusSlug = (status) => {
  if (status === "partial" || status === "partially_solved") return "partially-solved";
  return status;
};

export const isActive = (record) => record.problem.catalogState === "published"
  && ["open", "partial"].includes(deriveStatus(record));

export const isArchived = (record) => record.problem.catalogState === "archived";

export const isPublic = (record) => ["published", "archived"].includes(record.problem.catalogState);

// Clause state derived from accepted claims. A clause is resolved when an
// accepted claim resolves or refutes it; narrowed when a claim narrows or
// supports it; otherwise open. Status-review, reformulation, and rules-out
// claims add context without changing the clause state.
export const clauseState = (clauseId, claims) => {
  const covering = claims.filter((claim) => claim.targetClauseIds.includes(clauseId));
  if (covering.some((claim) => claim.relation === "resolves")) return "resolved";
  if (covering.some((claim) => claim.relation === "refutes")) return "refuted";
  if (covering.some((claim) => ["narrows", "supports"].includes(claim.relation))) return "narrowed";
  return "open";
};

export const RELATION_LABELS = {
  supports: "Supports",
  narrows: "Narrows",
  refutes: "Refutes",
  resolves: "Resolves",
  reformulates: "Reformulates",
  "rules-out": "Rules out an approach",
  "status-review": "Status review"
};

export const slugify = (value, maxWords = 6) => String(value)
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim()
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, maxWords)
  .join("-");

export const trimSlash = (value) => String(value).replace(/\/$/, "");
