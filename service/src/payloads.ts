/**
 * Turns interface payloads into ledger records. A batch is a list of contract records without
 * ids or timestamps; the service assigns ids, resolves `$ref:` names, stamps the actor and the
 * time, and enforces what an actor may write directly.
 */
import fs from "node:fs";
import path from "node:path";
import type { Ledger } from "../../contract/src/ledger.ts";
import { REVISABLE_TYPES, type RecordType } from "../../contract/src/targets.ts";
import { hasRole, actorKind } from "../../contract/src/types/actor.ts";
import { bytesDigest } from "../../contract/src/digest.ts";
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

/** What an actor may write directly. Decisions and the taxonomy need the editor role; an actor record must be the actor's own agent or pipeline. */
function authorize(ledger: Ledger, actorId: string, record: Record<string, unknown>): void {
  const type = record["type"] as RecordType;
  if ((type === "Decision" || type === "Taxonomy") && !hasRole(ledger, actorId, "editor")) throw new PayloadError(403, `${type} records need the editor role`);
  if (type === "Actor") {
    if (actorKind(ledger, actorId) !== "human") throw new PayloadError(403, "only a human creates actors");
    if (record["id"] !== actorId && record["operatorId"] !== actorId) throw new PayloadError(403, "an actor may only create agents and pipelines it operates, or revise itself");
  }
}

/** Materialize a batch for one actor: assign ids, resolve refs, stamp provenance, authorize. */
export function materialize(ledger: Ledger, actorId: string, records: BatchRecord[], known: Map<string, string> = new Map()): { records: NewRecord[]; ids: Record<string, string> } {
  const ids = new Map(known);
  const at = nowIso();
  const assigned: { ref: string | undefined; id: string; record: BatchRecord }[] = [];
  for (const record of records) {
    const id = typeof record["id"] === "string" && record["id"] === actorId ? actorId : newId();
    if (record.ref) {
      if (ids.has(record.ref)) throw new PayloadError(422, `duplicate ref ${record.ref}`);
      ids.set(record.ref, id);
    }
    assigned.push({ ref: record.ref, id, record });
  }
  const out: NewRecord[] = [];
  for (const { id, record } of assigned) {
    const { ref: _ref, body, ...fields } = record;
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
    if (record.type === "Contribution") stamped["actorId"] = actorId;
    if (record.type === "Review") stamped["reviewerId"] = actorId;
    if (record.type === "Actor" && record["id"] === actorId) stamped["id"] = actorId;
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
