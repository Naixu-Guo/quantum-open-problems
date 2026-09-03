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

const view = (record: LoadedRecord) => ({ ...record.fields, body: record.body });

export function currentStatement(ledger: Ledger, problemId: string): Statement | undefined {
  return ledger.currentOf("Statement").map((s) => s.fields as unknown as Statement).filter((s) => s.problemId === problemId).sort((a, b) => b.version - a.version)[0];
}

export function problemView(ledger: Ledger, problemId: string) {
  const problem = ledger.find("Problem", problemId);
  if (!problem) return null;
  const decisions = currentDecisions(ledger);
  const claims = acceptedClaims(ledger, decisions);
  const statement = currentStatement(ledger, problemId);
  const references = referencesOf(ledger, problemId);
  const comments = commentsOn(ledger, "problem", problemId);
  return {
    ...view(problem),
    catalogState: catalogState(ledger, problemId, decisions),
    status: problemStatus(ledger, problemId, decisions),
    indexed: isIndexed(ledger, problemId, decisions),
    statement: statement ? {
      ...statement,
      body: ledger.find("Statement", statement.id)?.body ?? "",
      clauses: statement.clauses.map((clause) => ({ ...clause, ref: `${statement.id}#${clause.id}`, status: clauseStatus(ledger, `${statement.id}#${clause.id}`, claims) })),
    } : null,
    references,
    comments,
    decisions: decisions.filter((d) => d.targetType === "problem" && d.targetId === problemId).map((d) => ({ id: d.id, kind: d.kind, outcome: d.outcome, status: d.status, effectiveAt: d.effectiveAt, policyVersion: d.policyVersion, body: d.body })),
  };
}

export function sourceSummary(ledger: Ledger, sourceId: string) {
  const source = ledger.findAny("Source", sourceId);
  if (!source) return null;
  const f = source.fields;
  return { id: sourceId, redacted: source.redacted, title: f["title"], kind: f["kind"], completeness: f["completeness"], authors: f["authors"], venue: f["venue"], date: f["date"], doi: f["doi"], arxivId: f["arxivId"], url: f["url"] };
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
  return {
    problemId,
    title: problem.fields["title"],
    status: problemStatus(ledger, problemId, decisions),
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
  return {
    ...view(contribution),
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

/**
 * A bounded bundle for one problem: what an agent needs to start, cut to a token budget in
 * priority order. The bundle id is the digest of the sorted (id, digest) pairs it was built
 * from, so a trajectory can name exactly what it read.
 */
export function contextBundle(ledger: Ledger, problemId: string, clauseIds: string[] | undefined, tokenBudget: number) {
  const front = frontier(ledger, problemId);
  const problem = ledger.find("Problem", problemId);
  if (!front || !problem) return null;
  const statement = currentStatement(ledger, problemId)!;
  if (clauseIds && clauseIds.length) {
    const unknown = clauseIds.filter((ref) => !front.clauses.some((c) => c.ref === ref));
    if (unknown.length > 0) throw new ContextError(`unknown clause(s) for the current statement: ${unknown.join(", ")}`);
  }
  const chosen = clauseIds && clauseIds.length ? front.clauses.filter((c) => clauseIds.includes(c.ref)) : front.clauses;
  const included = new Map<string, string | null>([[problem.id, null], [statement.id, statement.digest]]);
  const sections: { name: string; text: string; ids: string[] }[] = [];
  sections.push({ name: "problem", text: `# ${String(problem.fields["title"])}\n\n${problem.body}`, ids: [problem.id] });
  sections.push({ name: "statement", text: ledger.find("Statement", statement.id)?.body ?? "", ids: [statement.id] });
  sections.push({ name: "clauses", text: chosen.map((c) => `- ${c.ref} [${c.status}] ${c.label}: ${c.resolutionCriteria}`).join("\n"), ids: [] });
  const claims = front.acceptedClaims.filter((claim) => claim.clauseIds.some((ref) => chosen.some((c) => c.ref === ref)));
  sections.push({ name: "acceptedClaims", text: claims.map((c) => `- ${c.id} (${c.relation}) ${c.title}`).join("\n"), ids: claims.map((c) => c.id) });
  sections.push({ name: "tree", text: JSON.stringify(front.tree.map((node: any) => ({ id: node.id, title: node.title, status: node.status, parentClauseId: node.parentClauseId }))), ids: front.tree.map((node: any) => node.id as string) });
  sections.push({ name: "routesTried", text: front.routesTried.map((r) => `- ${r.id} [${String(r.stopReason)}] ${String(r.title)}`).join("\n"), ids: front.routesTried.map((r) => r.id) });
  const references = referencesOf(ledger, problemId);
  sections.push({ name: "references", text: references.map((r: any) => `- (${r.role}) ${r.source?.title ?? r.sourceId}${r.locator ? `, ${r.locator}` : ""}${r.body ? `: ${r.body}` : ""}`).join("\n"), ids: references.map((r: any) => String(r.id)) });
  const comments = commentsOn(ledger, "problem", problemId);
  sections.push({ name: "comments", text: comments.map((c: any) => `- ${c.body}`).join("\n"), ids: comments.map((c: any) => String(c.id)) });

  const budgetChars = Math.max(tokenBudget, 200) * 4;
  let used = 0;
  const kept: { name: string; text: string; truncated: boolean }[] = [];
  for (const section of sections) {
    const room = budgetChars - used;
    if (room <= 0) { kept.push({ name: section.name, text: "", truncated: true }); continue; }
    const text = section.text.length > room ? section.text.slice(0, room) : section.text;
    used += text.length;
    kept.push({ name: section.name, text, truncated: text.length < section.text.length });
    if (!kept[kept.length - 1]!.truncated) for (const id of section.ids) if (!included.has(id)) included.set(id, null);
  }
  // The bundle id covers what was read: the records included, the clauses chosen, and which sections were cut.
  const pairs = [...included.entries()].map(([id, digest]) => `${id}:${digest ?? ""}`).sort();
  const shape = [...chosen.map((c) => `clause:${c.ref}`), ...kept.map((k) => `${k.name}:${k.truncated ? "cut" : "full"}`)];
  const bundleId = bytesDigest(Buffer.from([...pairs, ...shape].join("\n"), "utf8"));
  return { bundleId, problemId, statementId: statement.id, statementDigest: statement.digest, clauseIds: chosen.map((c) => c.ref), tokenBudget, approximateTokens: Math.ceil(used / 4), sections: kept, included: pairs };
}

export function recordView(ledger: Ledger, id: string) {
  const record = ledger.current.get(id);
  if (!record) return null;
  return { ...view(record), redacted: record.redacted, revision: revisionOf(record), path: record.relPath };
}

export function status(ledger: Ledger, index: Index, policyVersion: string) {
  const decisions = currentDecisions(ledger);
  const problems = ledger.currentOf("Problem");
  const byStatus: Record<string, number> = {};
  for (const problem of problems) {
    if (catalogState(ledger, problem.id, decisions) !== "published") continue;
    const status = problemStatus(ledger, problem.id, decisions);
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }
  const release = decisions.find((d) => d.kind === "release");
  return {
    policyVersion,
    lastSequence: index.lastSequence(),
    counts: index.counts(),
    problems: { total: problems.length, published: Object.values(byStatus).reduce((a, b) => a + b, 0), candidates: problems.filter((p) => catalogState(ledger, p.id, decisions) === "candidate").length, byStatus },
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
  return { id: taxonomy.id, revision: revisionOf(taxonomy), areas: taxonomy.fields["areas"], topics: taxonomy.fields["topics"] };
}

/** A request for a context bundle that cannot be built as asked. */
/** Every current actor, so pages can name who wrote a record. Keys and identities stay in the auth store. */
export function actorsView(ledger: Ledger) {
  return ledger.currentOf("Actor").map((a) => ({ id: a.id, name: a.fields["name"], kind: a.fields["kind"], roles: a.fields["roles"], operatorId: a.fields["operatorId"], modelFamily: a.fields["modelFamily"] }));
}

export class ContextError extends Error {}

/** Sources matching every whitespace-separated term in title, authors, DOI, arXiv id, URL, or venue, for attaching a reference without creating a duplicate. */
export function searchSources(ledger: Ledger, text: string, limit: number) {
  const terms = text.trim().toLowerCase().split(/\s+/u).filter(Boolean).slice(0, 8);
  const all = ledger.currentOf("Source");
  const matches = terms.length === 0 ? all : all.filter((s) => {
    const f = s.fields;
    const haystack = [f["title"], ...(f["authors"] as string[]), f["doi"], f["arxivId"], f["url"], f["venue"]].filter((v) => typeof v === "string").join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
  return { text, count: matches.length, sources: matches.slice(0, limit).map((s) => sourceSummary(ledger, s.id)) };
}
