# ADR 0002: Canonical catalog completion and legacy retirement

- Status: Accepted, implemented
- Date: 2026-09-02
- Supersedes: the migration stages in ADR 0001 that described the vertical slice
- Decision owners: repository maintainers

## Context

ADR 0001 introduced a four-record canonical slice under `catalog/` while the
release was still generated from three overlapping authoring surfaces:
`site/data/problems.js`, `open_prob/<id>/problem.md`, and
`open_prob/<id>/metadata.json`. Solved records existed only as Markdown and had
no machine record. The vertical slice could not become the authoring source
until every record, every source, and the home-page watch list lived in it.

## Decision

Every reviewed scientific fact lives in `catalog/` and nowhere else.

```text
catalog/
  registry.json                       taxonomy, collections, site and service URLs, cutoff date
  events.jsonl                        append-only ledger of canonical changes (ADR 0005)
  compatibility/published-revisions.json   digests of every published API v1 record
  schema/*.schema.json                canonical, operational, and read-model contracts
  sources/<source-id>.json            globally normalized bibliographic sources
  problems/<problem-id>/
    record.json                       Problem, StatementVersions, Claims, Evidence, Decisions, editorial
    statements/v<n>.md                immutable Notation and Formal statement text
    notes.md                          editorial narrative: background, progress prose, bibliography
    contributions/<cu-id>.json        frozen snapshots of promoted candidate updates (ADR 0004)
```

Rules:

1. `open_prob/`, `site/data/problems.js`, `site/data/formal-statements.js`,
   and `site/data/problem-sources.js` are deleted. The read-model validator
   fails if any of them reappears.
2. The migration preserved every public ID and URL. All 38 active records
   project to the same `recordDigest` and `statementDigest` they had before the
   migration; the pre-migration digests are frozen in
   `tests/fixtures/legacy-published-revisions.json`.
3. The 20 solved records became archived canonical records with a resolution
   Claim, its Evidence, and an accepted `solved` Decision. Their editorial
   narrative is preserved verbatim in `notes.md`. They now have API records,
   frontiers, packets, and appear in `archive.jsonl`.
4. Legacy evidence rows became one Claim plus one Evidence each. The claim
   relation was derived from the legacy strength label by a documented mapping
   in `scripts/migrate-legacy.mjs`; editors may refine relations through the
   normal review process.
5. Sources cited only by URL in the legacy ledger became `Source` objects with
   `bibliographyState: "url-only"` until an editor completes them. The three
   problem lists are single shared sources; locators live on the references.
6. The home-page claim watch became `editorial.notices` on the records it
   concerns. The home page is generated from those notices.
7. `catalog/compatibility/published-revisions.json` records the digests of
   every public record. Changing research content without refreshing the entry
   in the same change is a validation error, so semantic changes are always
   explicit in review.
8. `open_problem_v2/` is an external source-document mirror, not an authoring
   surface. Records enter the catalog one by one through
   `scripts/import-v2.mjs`, which creates a `candidate` bundle whose imported
   statement version is checked against the source JSON.

## Consequences

- One `node site/build.mjs` regenerates every read model from `catalog/`;
  CI rejects any drift between the catalog and generated files.
- Editors edit `record.json`, statement files, sources, and notes only.
- Statement text is immutable: the ledger records its digest, and a change
  fails validation. Corrections are new statement versions.
- Auto-derived claim relations and url-only sources are recorded technical
  debt, visible in the data rather than hidden in prose.
