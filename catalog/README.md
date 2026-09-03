> **Superseded (2026-09-02).** The vertical slice here validated the read-side contract; its bundle-per-problem format, compatibility projector, and hand-written schema validator are not carried forward. Its four example problems become the contract-package fixtures. The current design is
> [`docs/DESIGN.md`](../docs/DESIGN.md). This file is kept for the history
> of the decision and as a description of the legacy release that now
> serves as seed data.

# Canonical catalog vertical slice

`catalog/` is the first implementation of the database-first architecture in
[`docs/adr/0001-database-first-architecture.md`](../docs/adr/0001-database-first-architecture.md).
It is deliberately small: four representative records establish the data
contract before the full catalog is migrated.

## Contents

- `registry.json`: catalog-wide URLs, taxonomy, and collection registries used
  by the slice;
- `MIGRATION.md`: field mapping and acceptance gates for legacy and v2 records;
- `schema/`: JSON Schema contracts for canonical records and their core
  objects;
- `sources/`: globally normalized Source objects shared by problem records;
- `problems/<id>/record.json`: one canonical object bundle per problem;
- `problems/<id>/statements/v1.md`: immutable mathematical statement content;
- `project-v1.mjs`: canonical-to-API-v1 and research-packet projector;
- `validate.mjs`: structural, referential, source-import, and compatibility
  checks.

Source objects contain reusable bibliographic facts. A statement's
`sourceRefs` select the primary source and carry the relationship and locator;
evidence carries its own source locator. This keeps contextual citation data
out of the global source registry.

The slice covers:

- an open active record;
- a partially solved active record;
- a solved archived record;
- an imported `open_problem_v2` record.

The two active records must project byte-for-byte to their currently published
API v1 JSON records and Markdown research packets. The solved record must retain
its archive page. The v2 record must match the title, source ID, status, tags,
statement text, and source digest in its generated source JSON.

## Commands

Validate the slice:

```sh
node catalog/validate.mjs
```

Write projected API v1 records and packets to a disposable directory:

```sh
node catalog/project-v1.mjs --out /tmp/qop-canonical-preview
```

The repository-wide `node site/build.mjs` command generates and validates the
existing site, then checks its outputs against the canonical slice.

## Migration rule

Do not add a record here as an independent copy. A record enters the canonical
slice only together with a compatibility or import check. While an active
record is represented in both the legacy source and the slice, an edit must
update both and the validator must prove that their public projections agree.
The temporary duplication ends when the site generators consume canonical
records directly.
