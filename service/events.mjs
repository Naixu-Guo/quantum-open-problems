// Unified event stream: ingests the canonical Git ledger and appends
// operational events so a client can follow both with one sequence cursor.

import { newEventId } from "./ids.mjs";

const toIsoDay = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? `${value}T00:00:00Z` : String(value));

// Canonical ledger entries become service events with source "catalog". The
// canonical event ID is reused so the two streams stay reconcilable.
export const ingestCanonicalLedger = (store, readModels) => {
  const ledger = readModels.ledger();
  let ingested = 0;
  store.transaction(() => {
    for (const entry of ledger.events || []) {
      if (store.hasEvent(entry.id)) continue;
      store.appendEvent({
        id: entry.id,
        type: entry.type,
        objectType: entry.objectType,
        objectId: entry.objectId,
        problemId: entry.problemId,
        actorId: null,
        createdAt: toIsoDay(entry.recordedOn),
        revision: entry.digest,
        payload: { ...entry.payload, occurredOn: entry.occurredOn },
        source: "catalog",
        catalogSequence: entry.sequence
      });
      ingested += 1;
    }
    const release = readModels.release();
    const revision = release.catalogRevision || release.activeSnapshotDigest;
    if (revision && store.getMeta("catalogRevision") !== revision) {
      store.appendEvent({
        id: newEventId(),
        type: "catalog.release",
        objectType: "Catalog",
        objectId: "catalog",
        problemId: null,
        createdAt: toIsoDay(release.releaseDate),
        revision,
        payload: {
          releaseDate: release.releaseDate,
          activeSnapshotDigest: release.activeSnapshotDigest,
          ledgerLastSequence: release.ledger?.lastSequence ?? null,
          records: release.records
        },
        source: "service"
      });
      store.setMeta("catalogRevision", revision);
      ingested += 1;
    }
  });
  return { ingested, lastSequence: store.lastSequence() };
};

export const emitEvent = (store, event) => store.appendEvent({
  id: newEventId(),
  actorId: null,
  problemId: null,
  revision: null,
  payload: {},
  source: "service",
  ...event
});
