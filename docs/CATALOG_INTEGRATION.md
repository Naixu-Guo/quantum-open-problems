# Authoritative catalog and research ledger

The maintained catalog is `database/problems_json/`. Its 86 records replace
the older seed catalog while preserving every authored field, classification,
status, and permanent identifier. Research status is exactly `Solved` or
`Unsolved`; settled subcases remain in the progress text and clause history.

The static website reads these JSON records directly. The research service
reads a validated ledger projection created by `npm run export-ledger`.
Each exported Problem contains the complete JSON in
`authoredCatalog.record`, its source path, and its authoritative status.
The contract treats these maintained primary problems as published without
claiming that a review or admission decision occurred. Merge and retirement
decisions still govern catalog visibility. Ordinary API clients cannot
manufacture or replace this catalog provenance.

The export preserves the original `op_` identifier, its equivalent `op-`
alias, the permanent ULID, and confirmed historical aliases. The current
vocabulary is defined by `database/tags.json` and its
[classification guide](../database/TAXONOMY.md). An exported taxonomy declares
`independentTopics`, so a topic can occur across research fields without
inventing a single parent field.

The ledger also contains the current statements and bibliographic sources
and reference links. Exact original TeX remains available in the embedded
JSON; Markdown bodies use dollar-delimited mathematics for rendering.
The exporter does not create claims, reviews, or decisions to justify a
status already maintained by the catalog.

For an authoring update, synchronize metadata and TeX, export the ledger,
then validate:

```sh
node scripts/migrate-metadata.mjs
node scripts/sync-tex.mjs
npm run export-ledger
npm run check-ledger
npm run validate:ledger
npm test
node site/build.mjs
```

Normal exports preserve later service contributions and activity. The
initial replacement explicitly used `--replace-authoritative`; that option
replaces both ledger and activity roots. Old seed data remains recoverable
from Git history. The earlier process design remains useful for the review
workflow; this document governs the authoritative catalog, identifiers,
taxonomy, and binary research status when the descriptions differ.

## Versioned updates and reconciliation

Ordinary `npm run export-ledger` appends `.r2.md`, `.r3.md`, and subsequent
entity revisions. Statement changes append `v2.md`, `v3.md`, and subsequent
versions, with fresh identities and a `supersedes` link. Existing files are
never rewritten or removed. Comments and reviews remain attached to the
statement and digest they actually examined. A changed statement does not
inherit resolution claims merely because its clause is still named `main`.

`ledger/export-manifest.json` version 2 pins the bytes of exported history
and the last desired values of projected fields. The contract recognizes
these operator-authored catalog revisions without inventing research
contributions or reviews. API clients cannot write the manifest, and an
unmanifested Problem revision cannot change `authoredCatalog`. Missing or
modified pinned files fail validation and export. The first ordinary export
migrates a version-1 manifest without rewriting its historical records.

When a service revision changes a different field, export preserves that
edit and applies the catalog change in the next revision. If both paths
change the same field, export reports the conflicting field before writing.
Review the current service version and the authored JSON, reconcile the
content in JSON, then explicitly run:

```sh
npm run export-ledger -- --reconcile-catalog
```

This selects catalog values for colliding fields while retaining all old
revisions. It can also supersede a newer service statement after review.
Removing or renaming a reference appends a retirement revision for the old
link; unused catalog sources are retired too. Retired bibliography is omitted
from active listings but still resolves for historical citations. Reintroducing
it appends a revision under the original identity. Problem identities cannot
be removed by export. Redactions are never restored by reconciliation.
`--replace-authoritative` remains an explicit whole-ledger reset, not a
maintenance workflow.

Each new record path receives a new service event sequence. After a catalog
commit, ordinary `sync` accepts the appended records and updated export
manifest, validates the merged ledger, and rebuilds the index. Existing
record edits and deletions still require an operator's deliberate
`sync --allow-edits`. Sync can push local commits and remains an authorized
deployment operation. Deploy the new service code before syncing version-2
exports into a running instance.

## Accepted service contributions to the static catalog

The publication boundary is explicit: acceptance alone does not synthesize
a scientific JSON record. Prepare the authored TeX fields using the
[writing skill](../.claude/skills/writing-open-problems/SKILL.md), preserving
the exact accepted statement, its evidence, and binary research status.
Then, in a checkout containing the accepted service history, run:

```sh
npm run handoff-catalog -- --problem <service-problem-ULID> --record <authored.json>
npm run check-metadata
npm run check-ledger
npm run validate:ledger
npm test
npm run build
```

The handoff requires a published service problem, preserves its ULID and
aliases (and any existing catalog op ID), imports the creator's actor
provenance, and validates the authored record against the current taxonomy.
Reconciliation is restricted to that problem and its statements and references.
Conflicts on other problems or shared sources abort the entire handoff.
Identical imported actors are adopted without creating an empty revision.
It stages the JSON, TeX, metadata, and versioned ledger export together before
writing. Inspect and commit that diff through the normal catalog PR workflow.
The command performs no Git push, admission decision, or invented review.
Related and parent problems must already have catalog identities.

## Editor setup and historical interfaces

The operator provisions the first real human editor with
`node --experimental-strip-types service/src/cli.ts bootstrap-editor <numeric-github-id> "Full Name"`.
This creates or promotes that human actor and links the numeric GitHub identity.
Repeating it is idempotent; further editors use the existing editor workflow.
The migration actor receives no human role. See [service setup](../service/README.md).

Both `/problem/<alias>/` and the historical `/problems/<alias>/` resolve for
known identities. Former static JSON lookup paths under `/api/v1/problems/`
serve the current `qiqcop-zoo/problem/3` payload, and `/packets/<alias>.md`
serves a current research brief. Release polling, JSONL snapshots, the evidence
endpoint, JSON Feed, and Atom are available. Their dates describe catalog
edits, not inferred publication dates for scientific results. The old static
write schema is explicitly retired; clients use service schemas or catalog PRs.

`database/legacy-routes.json` pins old identifiers and taxonomy membership to
historical commits. Unmapped old records receive an explicit archive link,
never an unverified identity redirect. Removed tag pages and query filters
show their historical problem cohort with current content and statuses.
Current taxonomy pages continue to use only `database/tags.json`.
