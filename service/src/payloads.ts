/**
 * Turns interface payloads into ledger records. A batch is a list of contract records without
 * ids or timestamps; the service assigns ids, resolves `$ref:` names, stamps the actor and the
 * time, and enforces what an actor may write directly.
 */
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import type { Ledger } from "../../contract/src/ledger.ts";
import { REVISABLE_TYPES, type RecordType } from "../../contract/src/targets.ts";
import { hasRole, actorKind } from "../../contract/src/types/actor.ts";
import { bytesDigest, statementDigest } from "../../contract/src/digest.ts";
import type { NewRecord } from "./ledger-repo.ts";
import type { AuthStore, OpenTrajectory } from "./auth.ts";
import { newId, nowIso } from "./ids.ts";

export interface BatchRecord {
  ref?: string;
  type: RecordType;
  body: string;
  [field: string]: unknown;
}

export class PayloadError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const REF = /^\$ref:([a-z][a-z0-9-]{0,40})(#[a-z0-9]+(?:-[a-z0-9]+)*)?$/u;

function resolveRefs(value: unknown, ids: Map<string, string>): unknown {
  if (typeof value === "string") {
    const match = value.match(REF);
    if (!match) return value;
    const id = ids.get(match[1]!);
    if (!id) throw new PayloadError(422, `unknown reference ${value}`);
    return `${id}${match[2] ?? ""}`;
  }
  if (Array.isArray(value)) return value.map((item) => resolveRefs(item, ids));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolveRefs(v, ids)]));
  return value;
}

const ROLE_FIELDS = ["roles", "kind", "operatorId"] as const;

/**
 * What an actor may write directly. Decisions and the taxonomy need the editor role. Actor
 * records: a human may create agents and pipelines it operates and may revise itself, but a
 * self-revision cannot touch roles, kind, or operator; only an editor revises other actors,
 * which is how roles are granted.
 */
function authorize(ledger: Ledger, actorId: string, record: Record<string, unknown>): void {
  const type = record["type"] as RecordType;
  const editor = hasRole(ledger, actorId, "editor");
  if ((type === "Decision" || type === "Taxonomy") && !editor) throw new PayloadError(403, `${type} records need the editor role`);
  if (type !== "Actor") return;
  if (actorKind(ledger, actorId) !== "human") throw new PayloadError(403, "only a human creates or revises actors");
  const targetId = String(record["id"]);
  const current = ledger.find("Actor", targetId);
  if (targetId === actorId) {
    for (const field of ROLE_FIELDS) {
      if (JSON.stringify(record[field]) !== JSON.stringify(current?.fields[field])) throw new PayloadError(403, `an actor cannot change its own ${field}; an editor does that`);
    }
    return;
  }
  if (current) {
    if (!editor) throw new PayloadError(403, "revising another actor needs the editor role");
    return;
  }
  const createsOwnAgent = (record["kind"] === "agent" || record["kind"] === "pipeline") && record["operatorId"] === actorId;
  if (!createsOwnAgent && !editor) throw new PayloadError(403, "an actor may only create agents and pipelines it operates; other actors are created by an editor");
}

/** A record that names an identity the ledger already holds is a revision of it and keeps that id; anything else gets a fresh one. */
function revisionTarget(ledger: Ledger, record: BatchRecord): string | null {
  const id = record["id"];
  if (typeof id !== "string" || !REVISABLE_TYPES.has(record.type)) return null;
  return ledger.find(record.type, id) ? id : null;
}

/** Materialize a batch for one actor: assign ids, resolve refs, stamp provenance, authorize. */
export function materialize(ledger: Ledger, actorId: string, records: BatchRecord[], known: Map<string, string> = new Map()): { records: NewRecord[]; ids: Record<string, string> } {
  const ids = new Map(known);
  const at = nowIso();
  const assigned: { ref: string | undefined; id: string; record: BatchRecord }[] = [];
  for (const record of records) {
    const id = revisionTarget(ledger, record) ?? newId();
    if (record.ref) {
      if (ids.has(record.ref)) throw new PayloadError(422, `duplicate ref ${record.ref}`);
      ids.set(record.ref, id);
    }
    assigned.push({ ref: record.ref, id, record });
  }
  const out: NewRecord[] = [];
  for (const { id, record } of assigned) {
    const { ref: _ref, body, ...fields } = record;
    // Only the repository import may establish this snapshot. Copy it across revisions,
    // before resolving client refs, so a payload cannot fabricate admission or status.
    const authoredCatalog = record.type === "Problem" ? ledger.find("Problem", id)?.fields["authoredCatalog"] : undefined;
    if (record.type === "Problem" && Object.hasOwn(fields, "authoredCatalog")) {
      if (authoredCatalog === undefined || !isDeepStrictEqual(fields["authoredCatalog"], authoredCatalog)) {
        throw new PayloadError(403, "authoredCatalog is read-only imported metadata");
      }
      delete fields["authoredCatalog"];
    }
    const resolved = resolveRefs(fields, ids) as Record<string, unknown>;
    const revisable = REVISABLE_TYPES.has(record.type);
    const stamped: Record<string, unknown> = {
      ...resolved,
      id,
      type: record.type,
      schemaVersion: "1.0",
      createdBy: actorId,
      createdAt: at,
      ...(revisable ? { revision: typeof resolved["revision"] === "number" ? resolved["revision"] : 1 } : { supersedes: resolved["supersedes"] ?? null }),
    };
    if (authoredCatalog !== undefined) stamped["authoredCatalog"] = structuredClone(authoredCatalog);
    if (record.type === "Statement" && typeof stamped["digest"] !== "string") stamped["digest"] = statementDigest(body);
    if (record.type === "Contribution") stamped["actorId"] = actorId;
    if (record.type === "Review") stamped["reviewerId"] = actorId;
    authorize(ledger, actorId, stamped);
    out.push({ fields: stamped, body });
  }
  return { records: out, ids: Object.fromEntries(ids) };
}

export interface ArtifactUpload {
  title: string;
  kind: string;
  mediaType: string;
  bytes: Uint8Array;
}

/** Store an uploaded blob content-addressed and record the artifact as pending until the run closes. */
export function acceptArtifact(auth: AuthStore, storeDir: string, trajectory: OpenTrajectory, upload: ArtifactUpload): { id: string; digest: string; uri: string } {
  const digest = bytesDigest(upload.bytes);
  const hex = digest.slice(7);
  fs.mkdirSync(storeDir, { recursive: true });
  const file = path.join(storeDir, hex);
  if (!fs.existsSync(file)) fs.writeFileSync(file, upload.bytes);
  const id = newId();
  const uri = `artifact-store/${hex}`;
  auth.addPendingArtifact(id, trajectory.id, {
    id, type: "Artifact", schemaVersion: "1.0", createdBy: trajectory.actorId, createdAt: nowIso(), supersedes: null,
    title: upload.title, digest, kind: upload.kind, mediaType: upload.mediaType, size: upload.bytes.length, uri,
    trajectoryId: trajectory.id, checkable: false, checks: [],
  });
  return { id, digest, uri };
}

/** The records that close a run: the event log artifact, every pending artifact, the trajectory itself, and the attempt report batch. */
export function closeRecords(ledger: Ledger, auth: AuthStore, storeDir: string, trajectory: OpenTrajectory, close: { cost: Record<string, unknown>; body: string; attemptReport?: { records: BatchRecord[] } }): { records: NewRecord[]; attemptReportId: string | null; refs: Record<string, string> } {
  const events = auth.events(trajectory.id);
  const at = nowIso();
  const records: NewRecord[] = [];
  let eventsArtifactId: string | null = null;
  if (events.length > 0) {
    const bytes = Buffer.from(`${events.map((event) => JSON.stringify(event)).join("\n")}\n`, "utf8");
    const digest = bytesDigest(bytes);
    fs.mkdirSync(storeDir, { recursive: true });
    fs.writeFileSync(path.join(storeDir, `${digest.slice(7)}.jsonl`), bytes);
    eventsArtifactId = newId();
    records.push({ fields: {
      id: eventsArtifactId, type: "Artifact", schemaVersion: "1.0", createdBy: trajectory.actorId, createdAt: at, supersedes: null,
      title: `Event log of trajectory ${trajectory.id}`, digest, kind: "event-log", mediaType: "application/x-ndjson", size: bytes.length,
      uri: `artifact-store/${digest.slice(7)}.jsonl`, trajectoryId: trajectory.id, checkable: false, checks: [],
    }, body: "" });
  }
  const pendingArtifacts = auth.pendingArtifacts(trajectory.id);
  for (const fields of pendingArtifacts) records.push({ fields, body: "" });

  let attemptReportId: string | null = null;
  let refs: Record<string, string> = { trajectory: trajectory.id };
  if (close.attemptReport) {
    const known = new Map([["trajectory", trajectory.id]]);
    const batch = materialize(ledger, trajectory.actorId, close.attemptReport.records, known);
    refs = batch.ids;
    const reports = batch.records.filter((record) => record.fields["type"] === "Contribution" && record.fields["kind"] === "attempt-report");
    if (reports.length !== 1) throw new PayloadError(422, "an attempt report batch carries exactly one Contribution of kind attempt-report");
    const report = reports[0]!;
    if (report.fields["trajectoryId"] !== trajectory.id) throw new PayloadError(422, "the attempt report must name this trajectory ($ref:trajectory)");
    attemptReportId = String(report.fields["id"]);
    records.push(...batch.records);
  }
  if (trajectory.fields["kind"] === "research" && attemptReportId === null) throw new PayloadError(422, "a research trajectory closes with an attempt report");

  records.push({ fields: {
    ...trajectory.fields,
    id: trajectory.id, type: "Trajectory", schemaVersion: "1.0", createdBy: trajectory.actorId, createdAt: at, supersedes: null,
    actorId: trajectory.actorId, startedAt: trajectory.startedAt, endedAt: at, cost: close.cost,
    eventsArtifactId, eventCount: events.length, attemptReportId,
    artifactIds: [...(eventsArtifactId ? [eventsArtifactId] : []), ...pendingArtifacts.map((fields) => String(fields["id"]))],
  }, body: close.body });
  return { records, attemptReportId, refs };
}
