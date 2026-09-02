# Quantum Open Problems API v1

Public read endpoints need no authentication. Every file here is generated from the canonical catalog in `catalog/`.

- `release.json`: release date, digests, ledger sequence, and record counts; poll this first
- `events.json`: append-only sequenced ledger of reviewed scientific changes
- `index.json`: compact catalog metadata, active and archived discovery records, and claim-watch notices
- `search-index.json`: lexical search index
- `problems/<record-id>.json`: one complete, source-aware problem record (active and solved)
- `problems/<record-id>/frontier.json`: target clauses, accepted claims with evidence, unresolved remainder, status decision
- `problems/<record-id>/claims.json`: every accepted claim with its evidence and sources
- `problems/<record-id>/statements/v<n>.json`: one immutable statement version
- `problems.jsonl`: snapshot of active records; `archive.jsonl`: snapshot of solved records
- `evidence.json`: every dated evidence event, newest first, for catalog watching
- `problem.schema.json`: JSON Schema for problem records
- `candidate-update.schema.json`, `review.schema.json`, `comment.schema.json`, `actor.schema.json`, `event.schema.json`: operational write and read contracts served by the service
- `schemas/`: every canonical and operational schema
- `contribution.schema.json`: legacy issue-form envelope, superseded by the candidate-update schema

Each record also has a human page at `/problems/<record-id>/` and a Markdown research brief at `/packets/<record-id>.md`. Solved records keep the same URL patterns.

Treat `status` as a dated editorial assessment derived from the current accepted decision. Read `dates.verified`, `source.relationship`, and `evidence.cautions` before using a record. Candidate updates, reviews, comments, and the unified event stream are served by the operational service documented in `docs/api.md`; they are never mixed into these canonical files.
