import type { ImmutableBase } from "./base.ts";
import type { Ledger } from "../ledger.ts";
import { ref, refs, type Ref } from "../targets.ts";

export const TYPE = "Trajectory" as const;

export type TrajectoryKind = "research" | "verification" | "maintenance" | "ingestion";

export interface Cost {
  tokens: number | null;
  wallTimeSeconds: number | null;
  moneyUsd: number | null;
}

export interface Trajectory extends ImmutableBase {
  type: typeof TYPE;
  kind: TrajectoryKind;
  actorId: string;
  operatorId: string | null;
  problemIds: string[];
  statementDigests: string[];
  clauseIds: string[];
  contextBundleId: string | null;
  startedAt: string;
  endedAt: string;
  harnessConfig: string;
  budget: string;
  cost: Cost;
  eventsArtifactId: string | null;
  eventCount: number;
  attemptReportId: string | null;
  artifactIds: string[];
  visibility: "public" | "embargoed";
  embargoUntil: string | null;
}

export function references(trajectory: Trajectory): Ref[] {
  return [
    ...ref("createdBy", "Actor", trajectory.createdBy),
    ...ref("supersedes", "Trajectory", trajectory.supersedes),
    ...ref("actorId", "Actor", trajectory.actorId),
    ...ref("operatorId", "Actor", trajectory.operatorId),
    ...refs("problemIds", "Problem", trajectory.problemIds),
    ...refs("clauseIds", "Clause", trajectory.clauseIds),
    ...ref("eventsArtifactId", "Artifact", trajectory.eventsArtifactId),
    ...ref("attemptReportId", "Contribution", trajectory.attemptReportId),
    ...refs("artifactIds", "Artifact", trajectory.artifactIds),
  ];
}

export function rules(trajectory: Trajectory, ledger: Ledger): string[] {
  const errors: string[] = [];
  if (trajectory.kind === "research" && trajectory.attemptReportId === null) errors.push("a research trajectory cannot close without its attempt report");
  if (trajectory.kind !== "research" && trajectory.attemptReportId !== null) errors.push("only a research trajectory has an attempt report");
  if (trajectory.attemptReportId !== null) {
    const report = ledger.find("Contribution", trajectory.attemptReportId);
    if (report) {
      if (report.fields["kind"] !== "attempt-report") errors.push("attemptReportId must name an attempt-report contribution");
      if (report.fields["trajectoryId"] !== trajectory.id) errors.push("the attempt report must name this trajectory");
    }
  }
  if (trajectory.endedAt < trajectory.startedAt) errors.push("endedAt precedes startedAt");
  if (trajectory.visibility === "embargoed" && trajectory.embargoUntil === null) errors.push("an embargoed trajectory needs embargoUntil");
  if (trajectory.visibility === "public" && trajectory.embargoUntil !== null) errors.push("a public trajectory has no embargoUntil");
  if (trajectory.eventCount > 0 && trajectory.eventsArtifactId === null) errors.push("events were logged but no event-log artifact is named");
  if (trajectory.eventsArtifactId !== null) {
    const artifact = ledger.find("Artifact", trajectory.eventsArtifactId);
    if (artifact && artifact.fields["kind"] !== "event-log") errors.push("eventsArtifactId must name an event-log artifact");
  }
  const actor = ledger.find("Actor", trajectory.actorId);
  if (actor) {
    const kind = actor.fields["kind"];
    if ((kind === "agent" || kind === "pipeline") && trajectory.operatorId === null) errors.push("a run by an agent or pipeline must name the operator");
    if (kind === "agent" || kind === "pipeline") {
      if (trajectory.operatorId !== actor.fields["operatorId"]) errors.push("operatorId must match the actor's operator");
    }
  }
  if (trajectory.problemIds.length === 0 && trajectory.kind === "research") errors.push("a research trajectory must name at least one problem");
  return errors;
}
