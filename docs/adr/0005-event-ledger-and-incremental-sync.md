# ADR 0005: Event ledger and incremental synchronization

- Status: Accepted, implemented
- Date: 2026-09-02
- Decision owners: repository maintainers

## Context

The evidence log and feeds let a client detect new evidence by content-hash
IDs, but nothing let a client ask "what changed after X" or follow reviews,
candidate updates, and comments. External research clients need one cursor.

## Decision

Two cooperating streams with one event shape (`event.schema.json`):

1. `catalog/events.jsonl` is the canonical ledger. The build derives every
   canonical object (Problem, StatementVersion, Claim, Evidence, Decision) of
   every public record, and appends `*.created`/`*.published`/`*.accepted`
   events for new objects, `*.revised` events for changed mutable objects, and
   `*.removed` events for retired claims and evidence. StatementVersions and
   Decisions are immutable: a digest change fails validation. Entries carry a
   contiguous `sequence`, a content `digest`, the object's own date
   (`occurredOn`), and the catalog cutoff on which they were recorded.
   The static API publishes it as `/api/v1/events.json`, and `release.json`
   exposes `ledger.lastSequence` as the cheap poll target.
2. The service `events` table is the unified stream. On start and on reload
   the service ingests canonical ledger entries it has not seen (by ID) with
   `source: "catalog"`, and appends operational events (`candidate_update.*`,
   `review.created`, `comment.*`, `actor.*`, `moderation.applied`,
   `catalog.release`) with `source: "service"`. `GET /api/v1/events?after=N`
   returns events with a greater global sequence.

A client therefore does one of:

- static only: poll `release.json`; when `ledger.lastSequence` grows, fetch
  `events.json` and process entries above its cursor;
- with a service: poll `/api/v1/status`; fetch `/api/v1/events?after=<cursor>`
  and retrieve affected objects by ID.

The evidence log and Atom/JSON feeds remain as human-oriented and
content-hash-addressed views.

## Consequences

- No client needs to redownload the catalog to detect change.
- The ledger doubles as the immutability guard for statements and decisions.
- Global service sequences and canonical sequences differ; each service event
  carries the canonical sequence in `catalogSequence`, so the two can always be
  reconciled.
