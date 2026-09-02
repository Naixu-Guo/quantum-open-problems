# Canonical catalog

`catalog/` is the only scientific authoring surface of Quantum Open Problems.
Every website page, API resource, feed, packet, and MCP result is generated
from it by `node site/build.mjs`. See ADR 0001 and ADR 0002 for the decisions.

## Contents

- `registry.json`: site, repository, and service URLs; catalog cutoff date;
  taxonomy; collections.
- `events.jsonl`: append-only ledger of canonical changes with contiguous
  sequence numbers; the build appends, editors never edit it.
- `compatibility/published-revisions.json`: digests of every public record;
  refresh with `npm run revisions -- <id>` when research content changes.
- `schema/`: JSON Schemas for canonical objects, operational objects, read
  models, and contribution snapshots.
- `sources/<source-id>.json`: bibliographic sources normalized once and cited
  by ID; `bibliographyState: "url-only"` marks entries that still need
  bibliographic completion.
- `problems/<problem-id>/record.json`: the Problem, its StatementVersions,
  Claims, Evidence, Decisions, editorial cautions, notices, and provenance.
- `problems/<problem-id>/statements/v<n>.md`: immutable `## Notation` and
  `## Formal statement` sections.
- `problems/<problem-id>/notes.md`: editorial narrative (background, progress
  prose, bibliography); informative, not authoritative.
- `problems/<problem-id>/contributions/<cu-id>.json`: frozen snapshot of a
  promoted candidate update and its reviews.

## Rules

- A statement body is immutable once published; corrections are new versions.
- A decision is immutable; corrections supersede it.
- A claim cites one statement version and at least one of its target clauses,
  and needs evidence citing a registered source.
- Status is derived: the current accepted decision. The validator checks that
  `solved` records have every clause resolved or refuted, `open` records none,
  and `partial` records at least one clause narrowed, resolved, or refuted.
- `catalogState`: `candidate` records are not public; `published` records are
  active; `archived` records are solved and keep their URLs.
- Editorial notices (the home-page claim watch) and cautions are editorial
  context, never evidence.

## Commands

```sh
node core/validate.mjs                        # validate the catalog alone
node site/build.mjs                           # sync ledger, regenerate, validate everything
node scripts/record-published-revisions.mjs <id>
node scripts/import-v2.mjs <n> --topic <topic-id> --summary "..." --importance "..."
```
