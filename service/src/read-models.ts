/**
 * Read models the API serves. Computed from the ledger and the index; nothing stored.
 */
import type { Ledger, LoadedRecord } from "../../contract/src/ledger.ts";
import { revisionOf } from "../../contract/src/ledger.ts";
import { currentDecisions, acceptedClaims, clauseStatus, problemStatus, catalogState, isIndexed, contributionState, verificationLevel, statementIsCurrent, lineageOf, lastActivity, lastHumanReview } from "../../contract/src/derive.ts";
import type { Claim } from "../../contract/src/types/claim.ts";
import type { Statement } from "../../contract/src/types/statement.ts";
import type { Contribution } from "../../contract/src/types/contribution.ts";
import type { Decision } from "../../contract/src/types/decision.ts";
import type { Index } from "./index.ts";
import { bytesDigest } from "../../contract/src/digest.ts";
import { hasDuplicateCatalogBody, problemProvenance, researchView, type ProblemDetailView } from "./research-view.ts";

const view = (record: LoadedRecord) => ({ ...record.fields, body: record.body });

export function currentStatement(ledger: Ledger, problemId: string): Statement | undefined {
  return ledger.currentOf("Statement").map((s) => s.fields as unknown as Statement).filter((s) => s.problemId === problemId).sort((a, b) => b.version - a.version)[0];
}

export function problemView(ledger: Ledger, problemId: string, includeAuthoredRecord = false, detailView: ProblemDetailView = "full") {
  const problem = ledger.find("Problem", problemId);
  if (!problem) return null;
  const decisions = currentDecisions(ledger);
  const claims = acceptedClaims(ledger, decisions);
  const statement = currentStatement(ledger, problemId);
  const references = referencesOf(ledger, problemId);
  const comments = commentsOn(ledger, "problem", problemId);
  const fields: Record<string, unknown> = view(problem);
  const catalog = fields["authoredCatalog"] as Record<string, unknown> | undefined;
  const authoredRecord = catalog?.["record"] as Record<string, unknown> | undefined;
  if (catalog && (!includeAuthoredRecord || detailView === "research")) {
    const { record: _record, ...provenance } = catalog;
    fields["authoredCatalog"] = provenance;
  }
  // Omit only a proven duplicate of a pinned import. Subsequent service body
  // revisions and unverified/native backgrounds remain visible in either view.
  const omitDuplicateBody = detailView === "research" && hasDuplicateCatalogBody(ledger, problem);
  if (omitDuplicateBody) delete fields["body"];
  const statusDecision = decisions.find((decision) => decision.kind === "status" && decision.targetType === "problem" && decision.targetId === problemId && decision.outcome === "accepted");
  const statusSource = catalog
    ? { kind: "authored-catalog" as const, recordId: problem.id, sourcePath: catalog["sourcePath"] }
    : statusDecision
      ? { kind: "decision" as const, recordId: statusDecision.id }
      : { kind: "default" as const, recordId: problem.id, reason: "No accepted status decision; the problem defaults to Unsolved." };
  const result = {
    ...fields,
    view: detailView,
    bodyDisposition: omitDuplicateBody ? "omitted-duplicate-import" : "included",
    difficulty: fields["difficulty"] ?? "unrated",
    provenance: problemProvenance(problem),
    research: researchView(problem),
    catalogState: catalogState(ledger, problemId, decisions),
    status: problemStatus(ledger, problemId, decisions),
    statusSource,
    indexed: isIndexed(ledger, problemId, decisions),
    statement: statement ? {
      ...statement,
      body: ledger.find("Statement", statement.id)?.body ?? "",
      clauses: statement.clauses.map((clause) => ({ ...clause, textFormat: authoredRecord?.["statement"] === clause.text ? "tex" : "markdown", ref: `${statement.id}#${clause.id}`, status: clauseStatus(ledger, `${statement.id}#${clause.id}`, claims) })),
    } : null,
    references,
    comments,
    decisions: decisions.filter((d) => d.targetType === "problem" && d.targetId === problemId).map((d) => ({ id: d.id, kind: d.kind, outcome: d.outcome, status: d.status, mergeIntoProblemId: d.mergeIntoProblemId, effectiveAt: d.effectiveAt, policyVersion: d.policyVersion, body: d.body })),
  };
  return result;
}

export function sourceSummary(ledger: Ledger, sourceId: string) {
  const source = ledger.findAny("Source", sourceId);
  if (!source) return null;
  const f = source.fields;
  return { id: sourceId, redacted: source.redacted, retired: f["retired"] === true, title: f["title"], kind: f["kind"], completeness: f["completeness"], authors: f["authors"], venue: f["venue"], date: f["date"], doi: f["doi"], arxivId: f["arxivId"], url: f["url"] };
}

/** Auxiliary problems of a problem, recursively, with statuses. */
export function tree(ledger: Ledger, problemId: string, decisions = currentDecisions(ledger), claims = acceptedClaims(ledger, decisions)): unknown[] {
  const children = ledger.currentOf("Problem").filter((p) => p.fields["parentProblemId"] === problemId);
  return children.map((child) => {
    const statement = currentStatement(ledger, child.id);
    const reports = ledger.currentOf("Contribution").filter((c) => c.fields["kind"] === "attempt-report" && ((c.fields["newProblemIds"] as string[]).includes(child.id) || (c.fields["problemIds"] as string[]).includes(child.id)));
    return {
      id: child.id,
      alias: (child.fields["aliases"] as string[])[0],
      title: child.fields["title"],
      parentClauseId: child.fields["parentClauseId"],
      catalogState: catalogState(ledger, child.id, decisions),
      status: problemStatus(ledger, child.id, decisions),
      indexed: isIndexed(ledger, child.id, decisions),
      clauses: statement ? statement.clauses.map((clause) => ({ ref: `${statement.id}#${clause.id}`, label: clause.label, status: clauseStatus(ledger, `${statement.id}#${clause.id}`, claims) })) : [],
      attemptReports: reports.map((c) => ({ id: c.id, stopReason: c.fields["stopReason"], state: contributionState(ledger, c.id, decisions) })),
      children: tree(ledger, child.id, decisions, claims),
    };
  });
}

export function attempts(ledger: Ledger, problemId: string) {
  const decisions = currentDecisions(ledger);
  return ledger.currentOf("Contribution")
    .filter((c) => c.fields["kind"] === "attempt-report" && (c.fields["problemIds"] as string[]).includes(problemId))
    .map((c) => ({
      ...(c.fields as unknown as Contribution),
      body: c.body,
      state: contributionState(ledger, c.id, decisions),
      verificationLevel: verificationLevel(ledger, c.id, decisions),
      statementIsCurrent: statementIsCurrent(ledger, c.id),
    }));
}

export function frontier(ledger: Ledger, problemId: string) {
  const problem = ledger.find("Problem", problemId);
  if (!problem) return null;
  const decisions = currentDecisions(ledger);
  const claims = acceptedClaims(ledger, decisions);
  const statement = currentStatement(ledger, problemId);
  if (!statement) return null;
  // Claims are matched through clause lineage, so results accepted against an earlier statement version still show.
  const lineages = new Map(statement.clauses.map((clause) => [`${statement.id}#${clause.id}`, lineageOf(ledger, `${statement.id}#${clause.id}`)]));
  const covers = (claim: Claim, ref: string) => claim.clauseIds.some((id) => lineages.get(ref)?.has(id));
  const relevant = claims.filter((claim) => [...lineages.keys()].some((ref) => covers(claim, ref)));
  const bestBounds = statement.clauses.filter((clause) => clause.quantity).map((clause) => {
    const ref = `${statement.id}#${clause.id}`;
    const bounds = relevant.filter((claim) => claim.bound && lineages.get(ref)?.has(claim.bound.clauseId)).map((claim) => ({ claimId: claim.id, ...claim.bound! }));
    return { clauseRef: ref, quantity: clause.quantity, bounds };
  });
  const attemptReports = attempts(ledger, problemId).filter((a) => a.state === "accepted");
  const pendingContributions = ledger.currentOf("Contribution")
    .filter((c) => ((c.fields["problemIds"] as string[]).includes(problemId) || (c.fields["newProblemIds"] as string[]).includes(problemId)) && contributionState(ledger, c.id, decisions) === "submitted")
    .map((c) => ({ id: c.id, kind: c.fields["kind"], title: c.fields["title"], actorId: c.fields["actorId"], createdAt: c.fields["createdAt"] }));
  const statusDecision = decisions.find((d) => d.kind === "status" && d.targetType === "problem" && d.targetId === problemId && d.outcome === "accepted");
  const authoredCatalog = problem.fields["authoredCatalog"] as { sourcePath: string } | undefined;
  return {
    problemId,
    title: problem.fields["title"],
    status: problemStatus(ledger, problemId, decisions),
    ...(authoredCatalog ? { statusSource: { kind: "authored-catalog", sourcePath: authoredCatalog.sourcePath } } : {}),
    statusDecision: statusDecision ? { id: statusDecision.id, effectiveAt: statusDecision.effectiveAt, policyVersion: statusDecision.policyVersion, body: statusDecision.body } : null,
    statement: { id: statement.id, version: statement.version, digest: statement.digest },
    clauses: statement.clauses.map((clause) => {
      const ref = `${statement.id}#${clause.id}`;
      return { ref, label: clause.label, kind: clause.kind, resolutionCriteria: clause.resolutionCriteria, status: clauseStatus(ledger, ref, claims), claimIds: relevant.filter((claim) => covers(claim, ref)).map((claim) => claim.id) };
    }),
    acceptedClaims: relevant.map((claim) => ({ id: claim.id, title: claim.title, relation: claim.relation, clauseIds: claim.clauseIds, bound: claim.bound, support: claim.support.map((s) => ({ ...s, source: s.sourceId ? sourceSummary(ledger, s.sourceId) : null })) })),
    bestBounds,
    tree: tree(ledger, problemId, decisions, claims),
    routesTried: attemptReports.map((a) => ({ id: a.id, title: a.title, stopReason: a.stopReason, actorId: a.actorId, trajectoryId: a.trajectoryId, newProblemIds: a.newProblemIds, statementIsCurrent: a.statementIsCurrent })),
    pendingContributions,
    lastActivity: lastActivity(ledger, problemId, decisions),
    lastHumanReview: lastHumanReview(ledger, problemId, decisions),
  };
}

export function contributionView(ledger: Ledger, contributionId: string) {
  const contribution = ledger.find("Contribution", contributionId);
  if (!contribution) return null;
  const decisions = currentDecisions(ledger);
  const reviews = ledger.currentOf("Review").filter((r) => r.fields["contributionId"] === contributionId).map(view);
  const related = decisions.filter((d) => d.targetType === "contribution" && d.targetId === contributionId);
  const claims = (contribution.fields["claimIds"] as string[]).map((id) => ledger.find("Claim", id)).filter((c): c is LoadedRecord => Boolean(c)).map(view);
  const references = (contribution.fields["referenceIds"] as string[]).map((id) => ledger.find("Reference", id)).filter((r): r is LoadedRecord => Boolean(r)).map((r) => ({ ...view(r), source: sourceSummary(ledger, String(r.fields["sourceId"])) }));
  return {
    ...view(contribution),
    references,
    state: contributionState(ledger, contributionId, decisions),
    verificationLevel: verificationLevel(ledger, contributionId, decisions),
    statementIsCurrent: statementIsCurrent(ledger, contributionId),
    reviews,
    decisions: related.map((d: Decision) => ({ id: d.id, kind: d.kind, outcome: d.outcome, verificationLevel: d.verificationLevel, policyVersion: d.policyVersion, effectiveAt: d.effectiveAt, body: d.body })),
    claims,
  };
}

export function referencesOf(ledger: Ledger, problemId: string, role?: string) {
  const statement = currentStatement(ledger, problemId);
  return ledger.currentOf("Reference")
    .filter((r) => {
      const targetId = String(r.fields["targetId"]);
      const about = targetId === problemId || (statement !== undefined && (targetId === statement.id || targetId.startsWith(`${statement.id}#`)));
      return about && (!role || r.fields["role"] === role);
    })
    .map((r) => ({ ...view(r), source: sourceSummary(ledger, String(r.fields["sourceId"])) }));
}

export function commentsOn(ledger: Ledger, targetType: string, targetId: string) {
  return ledger.currentOf("Comment").filter((c) => c.fields["targetType"] === targetType && c.fields["targetId"] === targetId).map(view);
}

/** Contributions waiting for review, oldest first, excluding the caller's own and those the caller already reviewed. */
export function reviewQueue(ledger: Ledger, callerId: string | null) {
  const decisions = currentDecisions(ledger);
  const reviewedByCaller = new Set(ledger.currentOf("Review").filter((r) => r.fields["reviewerId"] === callerId).map((r) => String(r.fields["contributionId"])));
  return ledger.currentOf("Contribution")
    .filter((c) => contributionState(ledger, c.id, decisions) === "submitted" && c.fields["actorId"] !== callerId && !reviewedByCaller.has(c.id))
    .sort((a, b) => String(a.fields["createdAt"]).localeCompare(String(b.fields["createdAt"])))
    .map((c) => ({ id: c.id, kind: c.fields["kind"], title: c.fields["title"], actorId: c.fields["actorId"], problemIds: c.fields["problemIds"], newProblemIds: c.fields["newProblemIds"], createdAt: c.fields["createdAt"], reviews: ledger.currentOf("Review").filter((r) => r.fields["contributionId"] === c.id).length }));
}

/** Stable JSON for context identities, including authored record content and revisions. */
function contextJson(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  });
}

const contextResource = (id: string) => `qop://records/${id}`;
const CONTEXT_SCHEMA_VERSION = "qop-context/2" as const;

/**
 * Whole sections under an approximate character-based budget. The formal statement and
 * selected clauses are atomic: a small budget yields an explicit incomplete result and
 * current-record links, never a cut formula. The digest identifies the delivered payload;
 * resource links still resolve current records, not the recorded historical revisions.
 */
export function contextBundle(ledger: Ledger, problemId: string, clauseIds: string[] | undefined, tokenBudget: number) {
  if (!Number.isSafeInteger(tokenBudget) || tokenBudget < 200) throw new ContextError("tokenBudget must be a safe integer of at least 200");
  const front = frontier(ledger, problemId);
  const problem = ledger.find("Problem", problemId);
  if (!front || !problem) return null;
  const statement = currentStatement(ledger, problemId)!;
  if (clauseIds && clauseIds.length) {
    const unknown = clauseIds.filter((ref) => !front.clauses.some((c) => c.ref === ref));
    if (unknown.length > 0) throw new ContextError(`unknown clause(s) for the current statement: ${unknown.join(", ")}`);
  }
  const chosen = clauseIds && clauseIds.length ? front.clauses.filter((c) => clauseIds.includes(c.ref)) : front.clauses;
  const authoredCatalog = problem.fields["authoredCatalog"] as { sourcePath: string; record?: { statement?: string } } | undefined;
  const statusSource = authoredCatalog
    ? { kind: "authored-catalog" as const, recordId: problem.id, sourcePath: authoredCatalog.sourcePath }
    : front.statusDecision
      ? { kind: "decision" as const, recordId: front.statusDecision.id }
      : { kind: "default" as const, recordId: problem.id, reason: "No accepted status decision; the problem defaults to Unsolved." };
  const selectedClaimIds = new Set(chosen.flatMap((clause) => clause.claimIds));
  const claims = front.acceptedClaims.filter((claim) => selectedClaimIds.has(claim.id));
  const sections: { name: string; text: string; ids: string[]; required: boolean }[] = [];
  const add = (name: string, text: string, ids: string[], required = false) => sections.push({ name, text, ids: [...new Set(ids)].sort(), required });
  add("problem", `# ${String(problem.fields["title"])}\n\nStatus: ${front.status}\nStatus source: ${statusSource.kind}\nClause statuses below describe accepted ledger evidence, independently of the authoritative problem status.`, [problem.id], true);
  // The complete body retains definitions that may be shared across selected clauses.
  add("statement", ledger.find("Statement", statement.id)?.body ?? "", [statement.id], true);
  add("clauses", chosen.map((clause) => {
    const authored = statement.clauses.find((item) => `${statement.id}#${item.id}` === clause.ref)!;
    const format = authoredCatalog?.record?.statement === authored.text ? "tex" : "markdown";
    const formalMetadata = JSON.stringify({ kind: authored.kind, quantity: authored.quantity });
    return `## ${clause.label}\n${clause.ref} [ledger evidence: ${clause.status}]\nText format: ${format}\nFormal metadata (JSON): ${formalMetadata}\n\n${authored.text}\n\nResolution criteria: ${clause.resolutionCriteria}`;
  }).join("\n\n"), [statement.id], true);
  add("acceptedClaims", claims.length ? JSON.stringify(claims.map((claim) => ({ ...claim, body: ledger.find("Claim", claim.id)?.body ?? "", resourceUri: contextResource(claim.id) })), null, 2) : "", claims.flatMap((claim) => [claim.id, ...claim.support.flatMap((support) => support.sourceId ? [support.sourceId] : [])]));
  add("background", problem.body, [problem.id]);
  add("tree", JSON.stringify(front.tree.map((node: any) => ({ id: node.id, title: node.title, status: node.status, parentClauseId: node.parentClauseId }))), front.tree.map((node: any) => String(node.id)));
  add("routesTried", front.routesTried.map((route) => `- ${route.id} [${String(route.stopReason)}] ${String(route.title)}`).join("\n"), front.routesTried.map((route) => route.id));
  const references = referencesOf(ledger, problemId);
  add("references", references.length ? JSON.stringify(references.map((reference: any) => ({ ...reference, resourceUri: contextResource(String(reference.id)) })), null, 2) : "", references.flatMap((reference: any) => [String(reference.id), String(reference.sourceId)]));
  const comments = commentsOn(ledger, "problem", problemId);
  add("comments", comments.map((comment: any) => `- ${comment.id}: ${comment.body}`).join("\n"), comments.map((comment: any) => String(comment.id)));

  const sourceIds = new Set(sections.flatMap((section) => section.ids));
  sourceIds.add(statusSource.recordId);
  for (const claim of claims) for (const support of claim.support) if (support.artifactId) sourceIds.add(support.artifactId);
  for (const clause of chosen) for (const ref of lineageOf(ledger, clause.ref)) sourceIds.add(ref.split("#")[0]!);
  // Acceptance/withdrawal decisions and their contributions support the derived claim
  // and route states even when their own text is not shown in the bundle.
  for (const contribution of ledger.currentOf("Contribution")) {
    if ((contribution.fields["claimIds"] as string[]).some((id) => selectedClaimIds.has(id))) sourceIds.add(contribution.id);
  }
  for (const decision of currentDecisions(ledger)) if (sourceIds.has(decision.targetId)) sourceIds.add(decision.id);
  const sourcesUsed = [...sourceIds].sort().flatMap((id) => {
    const record = ledger.current.get(id);
    if (!record) return [];
    return [{ id, type: record.type, revision: revisionOf(record), digest: bytesDigest(Buffer.from(contextJson({ fields: record.fields, body: record.body }), "utf8")), resourceUri: contextResource(id) }];
  });

  const budgetChars = tokenBudget * 4;
  const minimumRequiredTokens = Math.ceil(sections.filter((section) => section.required).reduce((sum, section) => sum + section.text.length, 0) / 4);
  const formalContextComplete = tokenBudget >= minimumRequiredTokens;
  let used = 0;
  const shown = new Set<string>();
  const kept: { name: string; text: string; truncated: boolean; omitted: boolean; required: boolean; resourceUris: string[]; approximateTokens: number }[] = [];
  for (const section of sections) {
    const omit = Boolean(section.text) && ((!formalContextComplete && section.name !== "problem") || section.text.length > budgetChars - used);
    const text = omit ? "" : section.text;
    used += text.length;
    kept.push({ name: section.name, text, truncated: omit, omitted: omit, required: section.required, resourceUris: section.ids.map(contextResource), approximateTokens: Math.ceil(text.length / 4) });
    if (text) for (const id of section.ids) shown.add(id);
  }
  const omittedSections = kept.filter((section) => section.omitted).map((section) => section.name);
  const payload = {
    schemaVersion: CONTEXT_SCHEMA_VERSION,
    problemId, status: front.status, statusSource,
    statementId: statement.id, statementVersion: statement.version, statementDigest: statement.digest, clauseIds: chosen.map((clause) => clause.ref),
    tokenBudget, approximateTokens: Math.ceil(used / 4),
    budgetSemantics: { unit: "approximate-section-tokens" as const, charactersPerToken: 4 as const, excludes: ["JSON framing", "metadata and provenance", "MCP transport framing", "model-specific tokenization"] },
    minimumRequiredTokens, formalContextComplete, incomplete: omittedSections.length > 0, omittedSections,
    sections: kept,
    included: sourcesUsed.filter((source) => shown.has(source.id)).map((source) => `${source.id}:${source.digest}`),
    shownRecordIds: [...shown].sort(), sourcesUsed,
    resources: sourcesUsed.map((source) => ({ uri: source.resourceUri, name: `${source.type} ${source.id}`, resolution: "current" as const, id: source.id, revision: source.revision, digest: source.digest })),
  };
  return { bundleId: bytesDigest(Buffer.from(contextJson(payload), "utf8")), ...payload };
}

export function recordView(ledger: Ledger, id: string) {
  const record = ledger.current.get(id);
  if (!record) return null;
  return { ...view(record), redacted: record.redacted, revision: revisionOf(record), path: record.relPath };
}

export function status(ledger: Ledger, index: Index, policyVersion: string) {
  const decisions = currentDecisions(ledger);
  const problems = ledger.currentOf("Problem");
  const states = problems.map((p) => catalogState(ledger, p.id, decisions));
  const byStatus: Record<string, number> = { Unsolved: 0, Solved: 0 };
  const questions = new Map<string, string>();
  for (const problem of problems) {
    if (catalogState(ledger, problem.id, decisions) !== "published") continue;
    const status = problemStatus(ledger, problem.id, decisions);
    byStatus[status] = (byStatus[status] ?? 0) + 1;
    questions.set(String(problem.fields["equivalentToProblemId"] ?? problem.id), status);
  }
  const release = decisions.find((d) => d.kind === "release");
  return {
    policyVersion,
    contextSchemaVersion: CONTEXT_SCHEMA_VERSION,
    retrievalVersion: "qop-retrieval/1",
    idempotencyVersion: "qop-idempotency/2",
    lastSequence: index.lastSequence(),
    counts: index.counts(),
    problems: { unit: "records", total: states.filter((state) => state === "published" || state === "candidate").length,
      published: Object.values(byStatus).reduce((a, b) => a + b, 0), candidates: states.filter((state) => state === "candidate").length,
      merged: states.filter((state) => state === "merged").length, retired: states.filter((state) => state === "retired").length, byStatus },
    distinctQuestions: { unit: "distinct questions", scope: "published records", total: questions.size, byStatus: { Unsolved: [...questions.values()].filter(s => s === "Unsolved").length, Solved: [...questions.values()].filter(s => s === "Solved").length } },
    lastRelease: release ? { id: release.id, effectiveAt: release.effectiveAt, tag: release.targetId } : null,
  };
}

export function events(ledger: Ledger, index: Index, after: number, limit: number, type?: string) {
  const rows = index.recordsAfter(after, limit, type);
  return {
    after,
    lastSequence: index.lastSequence(),
    nextAfter: rows.length ? rows[rows.length - 1]!.sequence : after,
    events: rows.map((row) => {
      const record = ledger.revisions.get(row.id)?.find((r) => revisionOf(r) === row.revision);
      const problemId = record ? (record.fields["problemId"] ?? (record.fields["targetType"] === "problem" ? record.fields["targetId"] : null) ?? (record.fields["problemIds"] as string[] | undefined)?.[0] ?? null) : null;
      return { sequence: row.sequence, id: row.id, revision: row.revision, type: row.type, kind: record?.fields["kind"] ?? null, problemId, createdAt: row.created_at, createdBy: row.created_by, path: row.path };
    }),
  };
}


/** The current taxonomy: areas and topics for the collection forms and filters. */
export function taxonomyView(ledger: Ledger) {
  const taxonomy = ledger.currentOf("Taxonomy")[0];
  if (!taxonomy) return null;
  return { id: taxonomy.id, revision: revisionOf(taxonomy), areas: taxonomy.fields["areas"], topics: taxonomy.fields["topics"], independentTopics: taxonomy.fields["independentTopics"] === true };
}

/** Accept either a taxonomy id or its human label, independently of case and spacing. */
export function taxonomyId(ledger: Ledger, kind: "areas" | "topics", value: string): string | null {
  const fold = (text: string) => text.trim().replace(/\s+/gu, " ").toLowerCase();
  const entries = taxonomyView(ledger)?.[kind] as { id: string; label: string }[] | undefined;
  const found = entries?.find(entry => fold(entry.id) === fold(value) || fold(entry.label) === fold(value));
  return found?.id ?? null;
}

/** Every current actor, so pages can name who wrote a record. Keys and identities stay in the auth store. */
export function actorsView(ledger: Ledger) {
  return ledger.currentOf("Actor").map((a) => ({ id: a.id, name: a.fields["name"], kind: a.fields["kind"], roles: a.fields["roles"], operatorId: a.fields["operatorId"], modelFamily: a.fields["modelFamily"] }));
}

/** A request for a context bundle that cannot be built as asked. */
export class ContextError extends Error {}

/** Include the preserved bibliography text when structured authors or venue are incomplete. */
export function searchSources(ledger: Ledger, text: string, limit: number, offset = 0) {
  const terms = text.trim().toLowerCase().split(/\s+/u).filter(Boolean).slice(0, 8);
  const all = ledger.currentOf("Source", { includeRetired: true });
  const matches = terms.length === 0 ? all : all.filter((s) => {
    const f = s.fields;
    const haystack = [f["title"], ...(f["authors"] as string[]), f["doi"], f["arxivId"], f["url"], f["venue"], s.body].filter((v) => typeof v === "string").join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  matches.sort((a, b) => String(a.fields["title"]).localeCompare(String(b.fields["title"])) || a.id.localeCompare(b.id));
  const pageSize = Math.min(Math.max(limit, 1), 200);
  const sources = matches.slice(offset, offset + pageSize).map(s => ({ ...sourceSummary(ledger, s.id), citation: s.body }));
  return { text, count: matches.length, total: matches.length, returned: sources.length, limit: pageSize, offset, nextOffset: offset + sources.length < matches.length ? offset + sources.length : null, sources };
}
