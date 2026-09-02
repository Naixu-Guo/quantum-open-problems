// Promotion of an accepted CandidateUpdate into canonical Claim, Evidence,
// and Decision objects. Pure: takes the current record, the candidate
// update, and its reviews; returns the new record, new sources, and the
// frozen contribution snapshot. Writing files and committing is the
// caller's job (service/cli.mjs), and the build validates the result.

import { currentDecision, currentStatement, slugify } from "./domain.mjs";

const SOURCE_TYPES = new Set(["primary-source", "preprint", "published-paper", "problem-list", "dataset", "code", "other"]);

const urlSourceId = (uri, fallback) => {
  const arxiv = uri.match(/arxiv\.org\/abs\/([\w.\/-]+?)(?:v\d+)?\/?$/);
  if (arxiv) return `source-arxiv-${slugify(arxiv[1].replace(/[./]/g, "-"), 4)}`;
  const doi = uri.match(/doi\.org\/(.+)$/);
  if (doi) return `source-doi-${slugify(decodeURIComponent(doi[1]).replace(/[./()]/g, "-"), 6)}`;
  return `source-web-${fallback}`;
};

export const buildPromotion = ({ bundle, catalog, candidateUpdate, reviews, promotedOn, promotedByActorId, serviceEventSequence = null }) => {
  const record = bundle.record;
  const problem = record.problem;
  const errors = [];
  if (candidateUpdate.problemId !== problem.id) errors.push("candidate update belongs to another problem");
  if (!["accepted", "promoted"].includes(candidateUpdate.reviewState)) errors.push(`candidate update is ${candidateUpdate.reviewState}, not accepted`);
  const statement = currentStatement(record);
  if (candidateUpdate.statementId !== statement.id) {
    errors.push(`candidate update targets statement ${candidateUpdate.statementId}; the current statement is ${statement.id}`);
  }
  const clauseIds = new Set(statement.targetClauses.map((clause) => clause.id));
  for (const clauseId of candidateUpdate.targetClauseIds) {
    if (!clauseIds.has(clauseId)) errors.push(`unknown target clause ${clauseId}`);
  }
  const editorial = reviews.filter((review) => review.reviewType === "editorial" && review.verdict === "accept").at(-1);
  if (!editorial) errors.push("no editorial accept review");
  if (editorial && !editorial.acceptedClaim) errors.push("editorial review has no acceptedClaim");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(promotedOn))) errors.push("promotedOn must be YYYY-MM-DD");
  const evidenceSources = (candidateUpdate.sources || []).filter((source) => SOURCE_TYPES.has(source.type));
  if (!evidenceSources.length) errors.push("an accepted claim needs at least one cited source");
  if (errors.length) return { errors };

  const suffix = candidateUpdate.id.replace(/^cu-/, "");
  const contributionPath = `contributions/${candidateUpdate.id}.json`;
  const provenance = {
    candidateUpdateId: candidateUpdate.id,
    reviewIds: reviews.map((review) => review.id),
    submittedByActorId: candidateUpdate.submittedBy.id,
    acceptedOn: promotedOn,
    contributionPath
  };
  const accepted = editorial.acceptedClaim;
  const claimId = `claim-${problem.id}-${suffix}`;
  const claim = {
    kind: "Claim",
    id: claimId,
    statementId: statement.id,
    targetClauseIds: candidateUpdate.targetClauseIds,
    relation: accepted.relation,
    title: accepted.title,
    text: accepted.text,
    supersedesClaimId: null,
    provenance
  };

  const newSources = [];
  const sourceIdByUrl = new Map([...catalog.sources].filter((source) => source.url).map((source) => [source.url, source.id]));
  const usedIds = new Set(catalog.sources.map((source) => source.id));
  const evidence = evidenceSources.map((source, index) => {
    let sourceId = sourceIdByUrl.get(source.uri);
    if (!sourceId) {
      let candidateId = urlSourceId(source.uri, `${suffix}-${index + 1}`);
      while (usedIds.has(candidateId)) candidateId = `${candidateId}-${index + 1}`;
      usedIds.add(candidateId);
      sourceId = candidateId;
      sourceIdByUrl.set(source.uri, sourceId);
      newSources.push({
        kind: "Source",
        id: sourceId,
        title: source.citation || source.uri,
        authors: [],
        venue: "",
        url: source.uri,
        ...(source.citation ? { citation: source.citation } : {}),
        bibliographyState: "url-only"
      });
    }
    return {
      kind: "Evidence",
      id: `evidence-${problem.id}-${suffix}-${index + 1}`,
      claimId,
      sourceId,
      sourceLocator: source.locator || null,
      date: accepted.date || String(candidateUpdate.submittedAt).slice(0, 10),
      maturity: accepted.maturity,
      strength: accepted.strength,
      label: accepted.label,
      ...(candidateUpdate.artifacts?.length && index === 0 ? {
        artifacts: candidateUpdate.artifacts.map((artifact) => ({
          type: artifact.type,
          uri: artifact.uri,
          digest: artifact.digest || null,
          locator: artifact.locator || null
        }))
      } : {}),
      provenance
    };
  });

  const decisions = [];
  const current = currentDecision(record);
  const statusEffect = editorial.statusEffect || "none";
  if (statusEffect !== "none" && statusEffect !== current.status) {
    decisions.push({
      kind: "Decision",
      id: `decision-${problem.id}-status-${promotedOn}-${suffix}`,
      problemId: problem.id,
      statementId: statement.id,
      decisionType: "status-assessment",
      outcome: "accepted",
      supersedesDecisionId: current.id,
      status: statusEffect,
      effectiveDate: promotedOn,
      verified: promotedOn,
      evidenceIds: [...current.evidenceIds, ...evidence.map((item) => item.id)],
      rationale: editorial.summary,
      provenance
    });
  }
  const nextProblem = { ...problem };
  if (statusEffect === "solved") nextProblem.catalogState = "archived";
  const nextRecord = {
    ...record,
    problem: nextProblem,
    claims: [...record.claims, claim],
    evidence: [...record.evidence, ...evidence],
    decisions: [...record.decisions, ...decisions]
  };
  const promotedObjectIds = [claim.id, ...evidence.map((item) => item.id), ...decisions.map((item) => item.id)];
  const latestDate = [promotedOn, ...evidence.map((item) => item.date)].sort().at(-1);
  const registry = latestDate > catalog.registry.catalogAsOf ? { ...catalog.registry, catalogAsOf: latestDate } : null;
  const snapshot = {
    kind: "qop-contribution-snapshot",
    schemaVersion: "1.0.0",
    candidateUpdate: { ...candidateUpdate, reviewState: "accepted" },
    reviews,
    promotedObjectIds,
    promotedOn,
    promotedByActorId,
    serviceEventSequence
  };
  return { errors: [], record: nextRecord, newSources, snapshot, contributionPath, promotedObjectIds, statusEffect, registry };
};
