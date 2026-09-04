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
alias, the permanent ULID, and confirmed historical aliases. Topic and field
names retain their original meaning: an exported taxonomy declares
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
