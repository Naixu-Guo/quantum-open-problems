# Canonical migration map

This document defines how the current authoring surfaces enter canonical
record bundles. It describes a transformation, not permission to accept a
problem or change its research status.

## Existing catalog records

| Legacy source | Canonical destination | Rule |
| --- | --- | --- |
| `site/data/problems.js:id` | `Problem.id` | Preserve exactly during the migration. |
| Existing page/API ID | `Problem.aliases` | Add only when it differs from the canonical ID. |
| `title`, `proposed`, `topic`, `collection`, `keywords`, `related` | `Problem` fields | Preserve values; registry references must resolve. |
| `summary`, `importance`, `remaining`, `type` | `Problem.question` | Preserve wording for API v1 compatibility. |
| `open_prob/<id>/problem.md` → `Notation` and `Formal statement` | `StatementVersion.bodyPath` | Copy without semantic editing into an immutable statement file. |
| `open_prob/<id>/metadata.json` | Primary statement source reference plus `Source` | Preserve authors, venue, and DOI/arXiv/primary URL precedence on the source; preserve the locator and contextual relationship on the statement-to-source reference. |
| `progress[]` | one `Claim` plus one `Evidence` | Claim receives title/detail; Evidence receives date, maturity, strength, label, and source reference. |
| `watch[]` and `interpretation` | `editorial` | Preserve as cautions, not evidence or status decisions. |
| `origin` | `editorial.provenance` | Preserve `source-stated` versus `derived`. |
| `status` and verification date | accepted status `Decision` | Normalize `partially_solved` to `partial`; keep mathematical status separate from catalog state. |

New statement and status objects supersede old objects by ID. Migration code
must not mark an old object as superseded by editing that object in place.

Statement sources live in `StatementVersion.sourceRefs`. Each reference names
the global source and carries its contextual `relationship`, `locator`, and an
explicit `primary` flag. Exactly one reference is primary; list order never
selects it implicitly. Bibliographic facts remain on the reusable `Source`.

## Solved records

A solved legacy record becomes:

- `Problem.catalogState = archived`;
- an immutable statement version containing the archived target;
- a resolution `Claim` scoped to every settled target clause;
- peer-reviewed or otherwise classified `Evidence` supporting that claim;
- an accepted `Decision` with `status = solved`.

The existing problem URL remains an alias/read model. Migration must not
reformulate the target to match the later theorem.

## `open_problem_v2` imports

An imported v2 record starts with `Problem.catalogState = candidate`. The
source JSON maps as follows:

| v2 JSON field | Canonical destination |
| --- | --- |
| `id` | `Problem.aliases` and `compatibility.sourceImport.sourceId` |
| `title` | `Problem.title` |
| `status = Unsolved` | provisional accepted status decision `open` |
| `tags` | `Problem.keywords` |
| `sections.problem_statement.latex` | statement `Formal statement` body |
| `source.sha256` | `compatibility.sourceImport.sourceSha256` |
| `source_tex` | integrity check against the referenced TeX file |

The importer must not invent a proposal date, publication source, or reviewed
catalog status. Missing values remain null or require editorial research. A v2
candidate enters API v1 only after duplicate detection, source review, a
formal-statement review, and an explicit catalog-acceptance decision.

## Compatibility gate

For every migrated active record, the transition is accepted only when:

1. the canonical record passes its JSON Schema and reference checks;
2. its current statement has named target clauses and a primary source;
3. status is derivable from an accepted decision;
4. the projected API v1 JSON is structurally identical to the current record;
5. the projected Markdown research packet is byte-identical;
6. record and statement digests therefore remain unchanged;
7. old IDs and URLs continue to resolve.

Once all consumers read canonical projections, the matching legacy authoring
fields can be removed in a separate reviewed change.
