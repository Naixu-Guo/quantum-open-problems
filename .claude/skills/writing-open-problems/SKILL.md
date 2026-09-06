---
name: writing-open-problems
description: Add or revise sourced quantum open problems in this repository's authoritative JSON catalog, including duplicate and literature checks, precise TeX statements, taxonomy, and synchronized TeX and ledger exports. Use for importing a problem from a paper or preparing a catalog contribution.
---

# Writing open problems for the QIQCOP Zoo

Author `database/problems_json/<id>.json`. The website reads this database;
`database/problems_tex/` and `ledger/` are derived outputs. Do not recreate
the removed `open_prob/` layout or author ordinary catalog additions directly
in `ledger/`.

Read `CLAUDE.md`, `CONTRIBUTING.md`, `database/_template.json`, and
`database/TAXONOMY.md` before writing. `database/tags.json` is the current
classification registry; never rely on a remembered list or record count.
`docs/CATALOG_INTEGRATION.md` governs the research-service boundary.

## Establish the question and its evidence

Use the user's supplied paper, statement, and context first. Ask only for
missing information that affects the mathematical question or attribution;
do not require an interview when the sources already answer it.

- Identify the exact question, objects, quantifiers, parameter ranges, access
  and resource models, and what would constitute a complete answer.
- Consult primary sources. Verify the source locator (problem, theorem,
  section, or equation), hypotheses, and relevant recent results. A citation's
  title or abstract alone is insufficient for a load-bearing theorem claim.
- Distinguish a source-stated question from one derived from a documented
  limitation and one formulated by a contributor. Preserve honest attribution
  in `source` and `metadata.origin`; do not attribute the agent's formulation
  or a migration script's work to a named researcher.
- Record the strongest relevant partial results with their exact scope and
  citations. Explain the remaining gap. If the evidence cannot establish the
  proposed status, retain a draft and report the specific unresolved check;
  do not publish unsupported certainty.

## Check for equivalent existing questions

Search `database/problems_json/` using `rg` for titles, synonyms, mathematical
objects, source identifiers, and alternate formulations. Inspect full
statements, progress, and comments of plausible matches. Search aliases and
related IDs too. Shared topics alone do not establish equivalence: compare
hypotheses, quantifiers, resource models, and requested outputs.

If the question already exists, update that record rather than create a new
identity. If two existing records are equivalent, reconcile their evidence
and status together, retain both permanent IDs and links, and document their
relationship in Comment. Set `metadata.equivalentToProblemId` on the duplicate
formulation to the canonical record's ULID; retain related links where useful.
The canonical record cannot itself point to another equivalent record, and
equivalent records must have the same binary status. Question totals count
that group once; record counts retain every permanent entry. Never delete an
archived identity merely to remove a duplicate. Different regimes or targets
can remain separate records with an explicit relationship.

## Author the current format

For a genuinely new problem, run:

```sh
node scripts/new-problem-id.mjs --create
```

Fill the generated `qiqcop-zoo/record/3` JSON using the template as the exact
field reference. Do not copy its example identifiers. Use a JSON serializer
for substantial TeX edits so backslashes and newlines are escaped correctly.

- Preserve an existing record's `id`, `ulid`, aliases, and creation metadata.
  An ID is `op_` followed by sixteen hexadecimal digits. A relationship uses
  the other problem's ULID, not its `op_` ID.
- Set `status` to exactly `Unsolved` or `Solved`. Settled subcases stay in
  Progress; they do not create a third status. A solved archive must identify
  the complete resolving result and its publication or preprint status.
- Choose one or two fields and one to five topics, spelled exactly as in
  `database/tags.json`. Classify the statement, not every technique cited in
  Progress. Reuse existing topics; add a genuinely needed topic with its
  first record and synchronized taxonomy outputs. Keep the six fields unless
  the maintainer requests a taxonomy revision.
- Begin `statement` with the actual question. Define all required notation
  locally and make the success criterion checkable. Do not force an
  existence question, value computation, or construction into an inaccurate
  prove-or-disprove formulation. Put relations to other catalog records in
  `comment`, not in the statement.
- Follow the repository's TeX rules: each display uses a numbered, labeled
  equation environment and is referenced with `\eqref`; labels are local
  to the record. Preserve meaningful conditions and resource counts.
- `progress` is an array of scoped TeX results. `references` contains
  `{key, label, tex}` entries with full bibliographic information and verified
  DOI/arXiv links. Cite entries using `\sourcecite{ref:...}{KEY}` and place
  verified locators in Source or Progress. Never invent a locator or citation.
- Leave unsupported difficulty and verification cost `unrated`, dates `null`,
  and optional lists empty. Do not leave required fields or topics empty.
  Generated `createdBy` records metadata provenance, not scientific authorship
  or human approval. Do not grant roles or create fictional reviews.

## Synchronize and verify

Install locked contract dependencies if absent, then run from the repository
root:

```sh
npm ci --prefix contract --ignore-scripts
node scripts/migrate-metadata.mjs
node scripts/sync-tex.mjs
npm run export-ledger
npm run check-metadata
npm run check-ledger
npm run validate:ledger
npm test
node site/build.mjs
```

Inspect the generated problem page and the diff. Check mathematical meaning,
status evidence, citation targets, classifications, stable identities, and
JSON/TeX agreement. Commit the authored record, its TeX mirror, changed
metadata, and ledger exports together; never edit or commit `dist/`.
Export history must remain intact. If reconciliation is required, use the
versioned workflow in `docs/CATALOG_INTEGRATION.md`; never use
`--replace-authoritative` as an ordinary update workaround.

Prepare a branch and PR when requested or appropriate to the user's task.
The PR should explain the question or correction and cite the status evidence.
Changes under `ledger/` or `activity/` require the `ledger-change` label.
Follow the user's existing authorization for committing, merging, and
publishing; the skill itself does not authorize external actions.

## Research-service submissions

A request specifically for a service proposal or review uses the service API
and `contract/policy/v1.md`. It is a different publication path: a candidate
needs the policy's actual acceptance decision. Do not write a decision to
make a proposal appear reviewed. For an accepted problem, prepare the authored JSON and run
`npm run handoff-catalog -- --problem <service-ULID> --record <authored.json>`
as documented in `docs/CATALOG_INTEGRATION.md`, then inspect and commit the
synchronized outputs before they appear on the static website. Preserve the
service problem's identity and provenance during that handoff.
