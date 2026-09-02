# Implementation plan: shared research layer (September 2026)

This plan records the audit of the repository at commit `8e3bd40` and the
slices used to turn it into an AI-native research layer. ADRs 0002-0005 hold
the decisions; this file holds the sequencing and the migration inventory.

## Audit findings

Correct and retained:

- `catalog/` already models Problem, StatementVersion, Source, Claim,
  Evidence, and Decision with JSON Schemas, a zero-dependency validator, and a
  projector that reproduces API v1 records and research packets byte for byte.
- Status is derived from the sole unsuperseded accepted status Decision.
- Generated HTML, API JSON, feeds, packets, `llms.txt`, and `llms-full.txt`
  are read models produced by one build command that CI diffs.
- Content-scoped revision digests (`recordDigest`, `statementDigest`) let a
  client pin the version it worked from.
- The MCP server is a stdio adapter over the published read models.

Duplication and inconsistencies:

- Three authoring surfaces for the 38 active records (`site/data/problems.js`,
  `open_prob/<id>/problem.md`, `open_prob/<id>/metadata.json`) plus 20 solved
  records that exist only as Markdown and have no machine record.
- The canonical slice covers 4 of 58 records and does not drive the build.
- The homepage "claim watch" list is hand-written in `problems.js`.
- Evidence events are content-hash snapshots with no sequence, so a client
  cannot ask for "everything after X".
- MCP reimplements search; nothing shares a domain module.
- There is no write path other than GitHub issue forms, no Actor identity, no
  candidate/review objects, and no tests.

## Target layout

```text
catalog/      canonical Git-backed reviewed state (records, statements, sources, ledger)
core/         domain rules, validation, projections (API v1, frontier, packets, search, events)
service/      operational HTTP service: actors, candidate updates, reviews, comments, events
mcp/          stdio MCP adapter over core read models and the service
site/         generated website and static API (GitHub Pages)
scripts/      one-off migration and import tools
tests/        node --test suites
docs/         architecture, ADRs, API reference, development guide
```

## Status (3 September 2026)

All seven slices are implemented; see ADRs 0002-0005, `docs/api.md`, and the
engineering report delivered with the change. Remaining technical debt is
listed at the end of this file.

## Slices

1. Canonical completion: migrate all 58 records plus the watch list into
   `catalog/`, add the append-only event ledger and the published-revision
   manifest, rebuild every read model from `catalog/`, delete `open_prob/`
   and the three `site/data` authoring files.
2. Domain expansion: schemas and identity rules for Actor, CandidateUpdate,
   Review, Comment, Event, Frontier, and contribution snapshots; optional
   provenance on Claim, Evidence, and Decision.
3. Operational service: relational store on `node:sqlite`, authenticated
   writes, idempotency, rate limits, moderation, unified event stream.
4. Frontier: one derived representation used by the static API, the service,
   the website, and MCP.
5. Website: verified progress, target clauses, pending updates, discussion,
   trust labels, actor-type labels.
6. MCP: resources plus semantic tools that call core and the service.
7. Tests, CI, documentation, ADRs, migration notes.

## Migration inventory

| Legacy surface | Destination | Disposition |
| --- | --- | --- |
| `site/data/problems.js` problem entries | `catalog/problems/<id>/record.json` | deleted after migration |
| `site/data/problems.js` taxonomy, collections, meta | `catalog/registry.json` | deleted |
| `site/data/problems.js` watchlist | `editorial.notices` on each record | deleted |
| `open_prob/<id>/problem.md` Notation and Formal statement | `statements/v1.md` | deleted |
| `open_prob/<id>/problem.md` Background, Status, Bibliography | `notes.md` | deleted |
| `open_prob/<id>/metadata.json` | `Source` objects and statement `sourceRefs` | deleted |
| `site/data/formal-statements.js`, `problem-sources.js` | none (projection) | deleted |
| `site/data/catalog-index.js` | generated from canonical | kept, generated |
| `open_problem_v2/` | external source document mirror | kept, imported record by record |
| current API v1 digests | `catalog/compatibility/published-revisions.json` | added |

Compatibility gate: every one of the 38 active records must project to the
same `recordDigest` and `statementDigest` it had before the migration, every
`/problems/<id>/` page must still exist, and every active record must keep
its `/api/v1/problems/<id>.json` and `/packets/<id>.md` URLs.

## Remaining technical debt

- Claim relations for the 38 active records were derived from legacy strength
  labels by a fixed mapping; editors should review them clause by clause.
- Fourteen sources created from evidence URLs are `url-only`; complete their
  bibliographic fields.
- Auto-migrated active records have one target clause each; partially solved
  records would benefit from split clauses through new statement versions.
- The service uses SQLite; a PostgreSQL adapter behind `service/store.mjs` is
  the planned path for multi-node hosting.
- The issue-form lane still needs an editor to transcribe submissions into the
  service.
