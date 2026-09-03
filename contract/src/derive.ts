/**
 * Derived state. Everything here is computed from decisions and the records they cite.
 * Plain functions over plain lists; no state is stored.
 */
import type { Ledger, LoadedRecord } from "./ledger.ts";
import type { Decision, ProblemStatus, VerificationLevel } from "./types/decision.ts";
import type { Claim } from "./types/claim.ts";
import type { Statement } from "./types/statement.ts";

export type CatalogState = "candidate" | "published" | "retired" | "merged";
export type ContributionState = "submitted" | "triaged" | "accepted" | "rejected" | "superseded" | "withdrawn";
export type ClauseStatus = "open" | "partial" | "resolved";

const asDecision = (record: LoadedRecord): Decision => record.fields as unknown as Decision;

/** Decisions that no other decision supersedes, newest first by effectiveAt. */
export function currentDecisions(ledger: Ledger): Decision[] {
  const all = ledger.currentOf("Decision").map(asDecision);
  const superseded = new Set(all.map((decision) => decision.supersedes).filter((id): id is string => id !== null));
  return all.filter((decision) => !superseded.has(decision.id)).sort((a, b) => (a.effectiveAt < b.effectiveAt ? 1 : a.effectiveAt > b.effectiveAt ? -1 : 0));
}

function latest(decisions: Decision[], predicate: (decision: Decision) => boolean): Decision | undefined {
  return decisions.find((decision) => decision.outcome === "accepted" && predicate(decision));
}

export function catalogState(ledger: Ledger, problemId: string, decisions = currentDecisions(ledger)): CatalogState {
  const about = (decision: Decision) => decision.targetType === "problem" && decision.targetId === problemId;
  if (latest(decisions, (d) => about(d) && d.kind === "merge")) return "merged";
  if (latest(decisions, (d) => about(d) && d.kind === "retire")) return "retired";
  if (latest(decisions, (d) => about(d) && d.kind === "admission")) return "published";
  return "candidate";
}

export function problemStatus(ledger: Ledger, problemId: string, decisions = currentDecisions(ledger)): ProblemStatus {
  const decision = latest(decisions, (d) => d.kind === "status" && d.targetType === "problem" && d.targetId === problemId);
  return decision?.status ?? "open";
}

export function isIndexed(ledger: Ledger, problemId: string, decisions = currentDecisions(ledger)): boolean {
  const problem = ledger.find("Problem", problemId);
  if (!problem) return false;
  if (problem.fields["role"] === "primary") return catalogState(ledger, problemId, decisions) === "published";
  return latest(decisions, (d) => d.kind === "promotion" && d.targetType === "problem" && d.targetId === problemId) !== undefined;
}

export function contributionState(ledger: Ledger, contributionId: string, decisions = currentDecisions(ledger)): ContributionState {
  const contribution = ledger.find("Contribution", contributionId);
  if (!contribution) return "submitted";
  const supersededBy = ledger.currentOf("Contribution").some((other) => other.fields["supersedes"] === contributionId);
  if (supersededBy) return "superseded";
  const acceptance = decisions.find((d) => d.kind === "acceptance" && d.targetType === "contribution" && d.targetId === contributionId);
  if (!acceptance) return "submitted";
  if (acceptance.outcome === "rejected") return "rejected";
  return acceptance.verificationLevel === "triaged" ? "triaged" : "accepted";
}

export function verificationLevel(ledger: Ledger, contributionId: string, decisions = currentDecisions(ledger)): VerificationLevel | "none" {
  const acceptance = decisions.find((d) => d.kind === "acceptance" && d.targetType === "contribution" && d.targetId === contributionId && d.outcome === "accepted");
  return acceptance?.verificationLevel ?? "none";
}

/** Claims cited by an accepted contribution. */
export function acceptedClaims(ledger: Ledger, decisions = currentDecisions(ledger)): Claim[] {
  const accepted = new Set<string>();
  for (const contribution of ledger.currentOf("Contribution")) {
    if (contributionState(ledger, contribution.id, decisions) === "accepted") {
      for (const claimId of contribution.fields["claimIds"] as string[]) accepted.add(claimId);
    }
  }
  return ledger.currentOf("Claim").map((record) => record.fields as unknown as Claim).filter((claim) => accepted.has(claim.id));
}

/** Lineage: every clause reference that a clause continues, including itself. */
function clauseLineage(ledger: Ledger, clauseRef: string): Set<string> {
  const lineage = new Set<string>();
  let cursor: string | null = clauseRef;
  while (cursor && !lineage.has(cursor)) {
    lineage.add(cursor);
    const found = ledger.clause(cursor);
    cursor = found ? found.clause.supersedesClauseId : null;
  }
  return lineage;
}

export function clauseStatus(ledger: Ledger, clauseRef: string, claims = acceptedClaims(ledger)): ClauseStatus {
  const lineage = clauseLineage(ledger, clauseRef);
  let partial = false;
  for (const claim of claims) {
    if (!claim.clauseIds.some((id) => lineage.has(id))) continue;
    if (claim.relation === "resolves" || claim.relation === "refutes") return "resolved";
    partial = true;
  }
  return partial ? "partial" : "open";
}

/** Whether the statement a contribution pinned is still its problem's current statement. */
export function statementIsCurrent(ledger: Ledger, contributionId: string): boolean | null {
  const contribution = ledger.find("Contribution", contributionId);
  const statementId = contribution?.fields["statementId"];
  if (typeof statementId !== "string") return null;
  const statement = ledger.find("Statement", statementId);
  if (!statement) return null;
  const problemId = statement.fields["problemId"] as string;
  const newest = ledger
    .currentOf("Statement")
    .filter((s) => s.fields["problemId"] === problemId)
    .reduce((best, s) => ((s.fields["version"] as number) > ((best?.fields["version"] as number) ?? 0) ? s : best), undefined as LoadedRecord | undefined);
  return newest?.id === statementId;
}

/** The status-versus-clause invariant: returns one message per violating problem. */
export function consistencyErrors(ledger: Ledger): { problemId: string; message: string }[] {
  const errors: { problemId: string; message: string }[] = [];
  for (const summary of summarizeProblems(ledger)) {
    const states = summary.clauses.map((clause) => clause.status);
    if (states.length === 0) continue;
    const resolved = states.filter((state) => state === "resolved").length;
    if ((summary.status === "solved" || summary.status === "refuted") && resolved !== states.length) {
      errors.push({ problemId: summary.id, message: `status ${summary.status} requires every clause resolved by an accepted claim (${resolved} of ${states.length})` });
    }
    if (summary.status === "open" && resolved > 0) {
      errors.push({ problemId: summary.id, message: "status open conflicts with a clause resolved by an accepted claim" });
    }
    if (summary.status === "partial" && !states.some((state) => state !== "open")) {
      errors.push({ problemId: summary.id, message: "status partial requires at least one clause narrowed, bounded, or supported by an accepted claim" });
    }
  }
  return errors;
}

export interface ProblemSummary {
  id: string;
  alias: string;
  title: string;
  role: string;
  catalogState: CatalogState;
  status: ProblemStatus;
  indexed: boolean;
  clauses: { ref: string; status: ClauseStatus }[];
}

export function summarizeProblems(ledger: Ledger): ProblemSummary[] {
  const decisions = currentDecisions(ledger);
  const claims = acceptedClaims(ledger, decisions);
  return ledger.currentOf("Problem").map((record) => {
    const statements = ledger
      .currentOf("Statement")
      .map((s) => s.fields as unknown as Statement)
      .filter((s) => s.problemId === record.id)
      .sort((a, b) => b.version - a.version);
    const current = statements[0];
    return {
      id: record.id,
      alias: (record.fields["aliases"] as string[])[0] ?? record.id,
      title: record.fields["title"] as string,
      role: record.fields["role"] as string,
      catalogState: catalogState(ledger, record.id, decisions),
      status: problemStatus(ledger, record.id, decisions),
      indexed: isIndexed(ledger, record.id, decisions),
      clauses: current ? current.clauses.map((clause) => ({ ref: `${current.id}#${clause.id}`, status: clauseStatus(ledger, `${current.id}#${clause.id}`, claims) })) : [],
    };
  });
}
