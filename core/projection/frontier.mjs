// Research frontier: what is settled, what is open, and what is pending for
// one problem. Derived entirely from canonical state; the operational
// service adds live pending candidate updates through the `pending` option.

import {
  RELATION_LABELS,
  activeClaims,
  byId,
  clauseState,
  currentDecision,
  currentStatement,
  sha256,
  statusLabel,
  trimSlash
} from "../domain.mjs";
import { statementContent } from "../catalog.mjs";
import { projectApiV1 } from "./api-v1.mjs";

const sourceSummary = (catalog, sourceId) => {
  const source = catalog.sourceById.get(sourceId);
  if (!source) return null;
  return {
    id: source.id,
    title: source.title,
    authors: source.authors,
    venue: source.venue,
    url: source.url,
    ...(source.doi ? { doi: source.doi } : {}),
    ...(source.arxivId ? { arxivId: source.arxivId } : {}),
    ...(source.bibliographyState ? { bibliographyState: source.bibliographyState } : {})
  };
};

export const projectFrontier = (bundle, catalog, options = {}) => {
  const record = bundle.record;
  const problem = record.problem;
  const statement = currentStatement(record);
  const decision = currentDecision(record);
  const content = statementContent(bundle, statement);
  const claims = activeClaims(record).filter((claim) => claim.statementId === statement.id);
  const supersededClaimIds = record.claims
    .filter((claim) => !claims.includes(claim))
    .map((claim) => claim.id);
  const evidenceByClaim = new Map();
  for (const item of record.evidence) {
    if (!evidenceByClaim.has(item.claimId)) evidenceByClaim.set(item.claimId, []);
    evidenceByClaim.get(item.claimId).push(item);
  }
  const siteUrl = trimSlash(catalog.registry.siteUrl);
  const serviceUrl = catalog.registry.serviceUrl ? trimSlash(catalog.registry.serviceUrl) : null;
  const apiRecord = options.apiRecord || projectApiV1(bundle, catalog);

  const acceptedClaims = claims.map((claim) => {
    const evidence = (evidenceByClaim.get(claim.id) || [])
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((item) => ({
        id: item.id,
        date: item.date,
        maturity: item.maturity,
        strength: item.strength,
        label: item.label,
        sourceLocator: item.sourceLocator,
        source: sourceSummary(catalog, item.sourceId),
        ...(item.artifacts?.length ? { artifacts: item.artifacts } : {}),
        ...(item.note ? { note: item.note } : {})
      }));
    return {
      id: claim.id,
      relation: claim.relation,
      relationLabel: RELATION_LABELS[claim.relation],
      title: claim.title,
      text: claim.text,
      targetClauseIds: claim.targetClauseIds,
      supersedesClaimId: claim.supersedesClaimId ?? null,
      provenance: claim.provenance ?? null,
      trust: "verified",
      latestEvidenceDate: evidence[0]?.date || null,
      evidence
    };
  }).sort((a, b) => String(b.latestEvidenceDate).localeCompare(String(a.latestEvidenceDate)) || a.id.localeCompare(b.id));

  const targetClauses = statement.targetClauses.map((clause) => {
    const covering = acceptedClaims.filter((claim) => claim.targetClauseIds.includes(clause.id));
    return {
      id: clause.id,
      label: clause.label,
      text: clause.text,
      resolutionCriteria: clause.resolutionCriteria,
      state: clauseState(clause.id, claims),
      claimIds: covering.map((claim) => claim.id),
      latestEvidenceDate: covering.map((claim) => claim.latestEvidenceDate).filter(Boolean).sort().at(-1) || null
    };
  });
  const unresolvedClauseIds = targetClauses
    .filter((clause) => !["resolved", "refuted"].includes(clause.state))
    .map((clause) => clause.id);

  const pending = options.pending || {
    available: false,
    note: serviceUrl
      ? "Pending candidate updates are served live by the operational service."
      : "No operational service is configured for this deployment; candidate updates are submitted through the documented API of a service instance.",
    url: serviceUrl ? `${serviceUrl}/api/v1/problems/${problem.id}/candidate-updates?state=pending` : null,
    count: null,
    items: []
  };

  return {
    kind: "qop-frontier",
    schemaVersion: 1,
    problemId: problem.id,
    title: problem.title,
    catalogState: problem.catalogState,
    status: decision.status,
    statusLabel: statusLabel(decision.status),
    verified: decision.verified,
    decision: {
      id: decision.id,
      status: decision.status,
      outcome: decision.outcome,
      effectiveDate: decision.effectiveDate,
      verified: decision.verified,
      rationale: decision.rationale,
      evidenceIds: decision.evidenceIds,
      supersedesDecisionId: decision.supersedesDecisionId,
      provenance: decision.provenance ?? null
    },
    statement: {
      id: statement.id,
      version: statement.version,
      created: statement.created,
      supersedesStatementId: statement.supersedesStatementId,
      statementDigest: sha256(content.statement),
      sourceRefs: statement.sourceRefs.map((reference) => ({ ...reference, source: sourceSummary(catalog, reference.sourceId) })),
      formulation: { notation: content.notation, statement: content.statement }
    },
    question: problem.question,
    targetClauses,
    unresolved: {
      clauseIds: unresolvedClauseIds,
      summary: problem.question.unresolved
    },
    acceptedClaims,
    supersededClaimIds,
    cautions: record.editorial.cautions,
    interpretation: record.editorial.interpretation,
    provenance: record.editorial.provenance,
    notices: record.editorial.notices,
    history: {
      statementVersions: record.statements.map((item) => ({
        id: item.id, version: item.version, created: item.created, supersedesStatementId: item.supersedesStatementId, current: item.id === statement.id
      })),
      decisions: record.decisions.map((item) => ({
        id: item.id, status: item.status, outcome: item.outcome, effectiveDate: item.effectiveDate, supersedesDecisionId: item.supersedesDecisionId, current: item.id === decision.id
      }))
    },
    pendingCandidateUpdates: pending,
    revision: {
      algorithm: "sha256",
      projection: "content-v1",
      recordDigest: apiRecord.revision.recordDigest,
      statementDigest: apiRecord.revision.statementDigest,
      catalogAsOf: catalog.registry.catalogAsOf
    },
    links: {
      self: `${siteUrl}/api/v1/problems/${problem.id}/frontier.json`,
      problem: `${siteUrl}/api/v1/problems/${problem.id}.json`,
      claims: `${siteUrl}/api/v1/problems/${problem.id}/claims.json`,
      statement: `${siteUrl}/api/v1/problems/${problem.id}/statements/v${statement.version}.json`,
      human: `${siteUrl}/problems/${problem.id}/`,
      brief: `${siteUrl}/packets/${problem.id}.md`,
      ...(serviceUrl ? {
        candidateUpdates: `${serviceUrl}/api/v1/problems/${problem.id}/candidate-updates`,
        comments: `${serviceUrl}/api/v1/problems/${problem.id}/comments`
      } : {})
    }
  };
};

// Status/clause consistency rule shared by the validator.
export const frontierConsistencyErrors = (frontier) => {
  const errors = [];
  const states = frontier.targetClauses.map((clause) => clause.state);
  const settled = states.filter((state) => ["resolved", "refuted"].includes(state)).length;
  if (frontier.status === "solved" && settled !== states.length) {
    errors.push(`${frontier.problemId}: status solved requires every target clause to be resolved or refuted by an accepted claim`);
  }
  if (frontier.status === "open" && settled > 0) {
    errors.push(`${frontier.problemId}: status open conflicts with a resolved or refuted target clause`);
  }
  if (frontier.status === "partial" && !states.some((state) => state !== "open")) {
    errors.push(`${frontier.problemId}: status partial requires at least one clause narrowed, resolved, or refuted by an accepted claim`);
  }
  return errors;
};
