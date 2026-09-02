// Append-only canonical event ledger (catalog/events.jsonl).
//
// The ledger is the sequenced change stream for reviewed scientific state.
// The build derives the current object set from the records and appends one
// event per new object or per revision of a mutable object. Statement
// versions and decisions are immutable: a digest change is a validation
// error, not a revision event. External clients follow the ledger through
// /api/v1/events.json (static) or /api/v1/events?after=<sequence> (service).

import { contentDigest, isPublic, sha256 } from "./domain.mjs";
import { statementContent } from "./catalog.mjs";

export const IMMUTABLE_OBJECT_TYPES = new Set(["StatementVersion", "Decision"]);

const TYPE_ORDER = ["Problem", "StatementVersion", "Claim", "Evidence", "Decision"];

const earliestDate = (dates) => dates.filter(Boolean).sort()[0] || null;

// Every canonical object of every public record, with its content digest and
// the date on which it took effect.
export const deriveCanonicalObjects = (catalog) => {
  const objects = [];
  for (const bundle of catalog.bundles) {
    const record = bundle.record;
    if (!isPublic(record)) continue;
    const problemId = record.problem.id;
    const evidenceByClaim = new Map();
    for (const item of record.evidence) {
      if (!evidenceByClaim.has(item.claimId)) evidenceByClaim.set(item.claimId, []);
      evidenceByClaim.get(item.claimId).push(item);
    }
    objects.push({
      objectType: "Problem",
      objectId: problemId,
      problemId,
      occurredOn: earliestDate(record.statements.map((statement) => statement.created)),
      digest: contentDigest(record.problem),
      payload: { title: record.problem.title, catalogState: record.problem.catalogState, topicId: record.problem.topicId, collectionId: record.problem.collectionId }
    });
    for (const statement of record.statements) {
      const content = statementContent(bundle, statement);
      objects.push({
        objectType: "StatementVersion",
        objectId: statement.id,
        problemId,
        occurredOn: statement.created,
        digest: sha256(content.markdown),
        payload: {
          version: statement.version,
          supersedesStatementId: statement.supersedesStatementId,
          statementDigest: sha256(content.statement),
          targetClauseIds: statement.targetClauses.map((clause) => clause.id)
        }
      });
    }
    for (const claim of record.claims) {
      objects.push({
        objectType: "Claim",
        objectId: claim.id,
        problemId,
        occurredOn: earliestDate((evidenceByClaim.get(claim.id) || []).map((item) => item.date))
          || earliestDate(record.decisions.map((decision) => decision.effectiveDate)),
        digest: contentDigest(claim),
        payload: {
          statementId: claim.statementId,
          relation: claim.relation,
          targetClauseIds: claim.targetClauseIds,
          title: claim.title,
          supersedesClaimId: claim.supersedesClaimId ?? null,
          candidateUpdateId: claim.provenance?.candidateUpdateId ?? null
        }
      });
    }
    for (const item of record.evidence) {
      objects.push({
        objectType: "Evidence",
        objectId: item.id,
        problemId,
        occurredOn: item.date,
        digest: contentDigest(item),
        payload: { claimId: item.claimId, sourceId: item.sourceId, date: item.date, maturity: item.maturity, strength: item.strength }
      });
    }
    for (const decision of record.decisions) {
      objects.push({
        objectType: "Decision",
        objectId: decision.id,
        problemId,
        occurredOn: decision.effectiveDate,
        digest: contentDigest(decision),
        payload: {
          statementId: decision.statementId,
          status: decision.status,
          outcome: decision.outcome,
          supersedesDecisionId: decision.supersedesDecisionId,
          verified: decision.verified,
          candidateUpdateId: decision.provenance?.candidateUpdateId ?? null
        }
      });
    }
  }
  return objects.sort((a, b) => String(a.occurredOn).localeCompare(String(b.occurredOn))
    || a.problemId.localeCompare(b.problemId)
    || TYPE_ORDER.indexOf(a.objectType) - TYPE_ORDER.indexOf(b.objectType)
    || a.objectId.localeCompare(b.objectId));
};

export const EVENT_TYPES = {
  Problem: { created: "problem.created", revised: "problem.revised", removed: "problem.removed" },
  StatementVersion: { created: "statement.published" },
  Claim: { created: "claim.accepted", revised: "claim.revised", removed: "claim.removed" },
  Evidence: { created: "evidence.recorded", revised: "evidence.revised", removed: "evidence.removed" },
  Decision: { created: "decision.published" }
};

export const objectKey = (objectType, objectId) => `${objectType}:${objectId}`;

// Latest ledger entry per object.
export const latestEntries = (ledger) => {
  const latest = new Map();
  for (const entry of ledger) latest.set(objectKey(entry.objectType, entry.objectId), entry);
  return latest;
};

const eventId = (sequence, digest) => `cevt-${String(sequence).padStart(6, "0")}-${digest.slice(0, 8)}`;

// Compute the events that bring the ledger up to date with the catalog.
// Returns { appended, errors }. Immutable objects whose digest changed produce
// errors instead of events.
export const planLedgerUpdate = (catalog) => {
  const ledger = catalog.ledger;
  const latest = latestEntries(ledger);
  const objects = deriveCanonicalObjects(catalog);
  const recordedOn = catalog.registry.catalogAsOf;
  const appended = [];
  const errors = [];
  let sequence = ledger.length ? ledger[ledger.length - 1].sequence : 0;
  const seen = new Set();
  const push = (type, object, digest) => {
    sequence += 1;
    appended.push({
      id: eventId(sequence, digest),
      sequence,
      type,
      objectType: object.objectType,
      objectId: object.objectId,
      problemId: object.problemId,
      occurredOn: object.occurredOn,
      recordedOn,
      digest,
      payload: object.payload
    });
  };
  for (const object of objects) {
    const key = objectKey(object.objectType, object.objectId);
    seen.add(key);
    const entry = latest.get(key);
    const types = EVENT_TYPES[object.objectType];
    if (!entry || entry.type.endsWith(".removed")) {
      push(types.created, object, object.digest);
      continue;
    }
    if (entry.digest === object.digest) continue;
    if (IMMUTABLE_OBJECT_TYPES.has(object.objectType)) {
      errors.push(`${object.objectId}: ${object.objectType} content changed after publication (ledger digest ${entry.digest.slice(0, 12)}, current ${object.digest.slice(0, 12)}); publish a new version instead of editing`);
      continue;
    }
    push(types.revised, object, object.digest);
  }
  for (const [key, entry] of latest) {
    if (seen.has(key) || entry.type.endsWith(".removed")) continue;
    if (IMMUTABLE_OBJECT_TYPES.has(entry.objectType)) {
      errors.push(`${entry.objectId}: published ${entry.objectType} was removed from the catalog; immutable objects must stay in the record`);
      continue;
    }
    const object = { objectType: entry.objectType, objectId: entry.objectId, problemId: entry.problemId, occurredOn: recordedOn, payload: {} };
    push(EVENT_TYPES[entry.objectType].removed, object, entry.digest);
  }
  return { appended, errors };
};

// Structural checks on the ledger file itself.
export const verifyLedgerStructure = (ledger) => {
  const errors = [];
  const ids = new Set();
  ledger.forEach((entry, index) => {
    if (entry.sequence !== index + 1) errors.push(`ledger line ${index + 1}: sequence ${entry.sequence} breaks the contiguous order`);
    if (ids.has(entry.id)) errors.push(`ledger line ${index + 1}: duplicate event ID ${entry.id}`);
    ids.add(entry.id);
    if (!EVENT_TYPES[entry.objectType]) errors.push(`ledger line ${index + 1}: unknown object type ${entry.objectType}`);
    if (index > 0 && ledger[index - 1].recordedOn > entry.recordedOn) {
      errors.push(`ledger line ${index + 1}: recordedOn ${entry.recordedOn} precedes the previous entry`);
    }
  });
  return errors;
};

export const serializeLedgerEntries = (entries) => entries.map((entry) => JSON.stringify(entry)).join("\n");

// Public read model for the static API.
export const projectEventLedger = (catalog, siteUrl) => ({
  kind: "qop-canonical-event-ledger",
  schemaVersion: 1,
  catalogAsOf: catalog.registry.catalogAsOf,
  lastSequence: catalog.ledger.length ? catalog.ledger[catalog.ledger.length - 1].sequence : 0,
  count: catalog.ledger.length,
  note: "Append-only ledger of reviewed scientific state, ascending by sequence. Poll release.json; when ledger.lastSequence grows, fetch events with sequence greater than the last one you processed. Operational events (candidate updates, reviews, comments) are served by the service event stream, which embeds these entries with the same IDs.",
  events: catalog.ledger.map((entry) => ({
    ...entry,
    links: {
      problem: `${siteUrl}/api/v1/problems/${entry.problemId}.json`,
      frontier: `${siteUrl}/api/v1/problems/${entry.problemId}/frontier.json`
    }
  }))
});

export const ledgerDigest = (ledger) => sha256(ledger.map((entry) => entry.id).join("\n"));

