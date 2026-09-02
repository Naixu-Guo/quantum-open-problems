# Canonical migration record

The migration from the legacy authoring surfaces to `catalog/` completed on
2 September 2026 (`scripts/migrate-legacy.mjs`). This file records the mapping
for auditability; the legacy surfaces no longer exist.

| Legacy source | Canonical destination | Rule applied |
| --- | --- | --- |
| `site/data/problems.js:id` | `Problem.id` | preserved exactly |
| `title`, `proposed`, `topic`, `collection`, `keywords`, `related` | `Problem` fields | preserved |
| `summary`, `importance`, `remaining`, `type` | `Problem.question` | preserved for API v1 compatibility |
| `open_prob/<id>/problem.md` Notation and Formal statement | `statements/v1.md` | copied without semantic editing |
| `open_prob/<id>/problem.md` Background, Status, Bibliography | `notes.md` | copied verbatim |
| `open_prob/<id>/metadata.json` | `Source` plus the statement's primary `sourceRefs` entry | bibliographic facts on the source; locator, relationship, stated title on the reference |
| `progress[]` | one `Claim` plus one `Evidence` per item | relation derived from the strength label (table in the script); evidence source resolved from the article bibliography or created url-only |
| `watch[]`, `interpretation`, `origin` | `editorial.cautions`, `interpretation`, `provenance` | preserved as context, not evidence |
| `watchlist` | `editorial.notices` | ordered featured first, then by problem ID |
| `status`, verification date | accepted status `Decision` | `partially_solved` normalized to `partial` |
| solved `problem.md` narratives | resolution `Claim`, `Evidence`, `solved` Decision | curated from the narrative and bibliography; scope caveats became cautions |
| `catalog_source_id` | `Problem.aliases` | `theoremdb-p42`, `gaugeforge-quantum-0056`, and similar |

Compatibility gate, verified by `tests/compatibility.test.mjs`:

1. all 38 active records project to the digests published before the
   migration (`tests/fixtures/legacy-published-revisions.json`);
2. all 58 legacy IDs keep their page, API record, packet, and frontier;
3. the legacy surfaces do not exist.

## `open_problem_v2` imports

`open_problem_v2/` mirrors an external problem list (TeX plus generated JSON).
`node scripts/import-v2.mjs <n>` creates a `candidate` bundle whose statement
version 1 reproduces `sections.problem_statement.latex` verbatim; the validator
checks the statement, the source ID alias, and the TeX digest against the JSON
(`record.sourceImport`). The importer does not invent a proposal date,
publication source, or reviewed status: an editor supplies the summary,
importance, and topic, and a candidate becomes `published` only after
duplicate detection, source review, statement review, and an explicit
decision.
