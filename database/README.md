# Problem database

This directory is the only content source of the QIQCOP Zoo website.

- `problems_json/<id>.json`: one JSON record per problem, named by its stable
  ID. These files are the source of truth; the site is built from them. Each
  record uses `qiqcop-zoo/record/3` and holds the title, status, fields,
  topics, stable `op_` ID, ULID, aliases, main-compatible metadata, and the TeX of every section
  (statement, source, progress items, references, comment) as strings.
  `_template.json` shows the shape and `../CONTRIBUTING.md` explains the
  fields.
- `problems_tex/<id>.tex`: the TeX form of each record, in the layout of
  `_template.tex`. It is what `problem/<id>/<id>.tex` serves on the site and
  what a TeX collection can `\input`. It is kept in step with the JSON record
  by `node scripts/sync-tex.mjs`, and the build fails when the two disagree.
  The additional identifiers and metadata are excluded from the TeX content
  comparison; they remain part of the full JSON hash. Edit the JSON record,
  then regenerate this file.
- `tags.json`: the taxonomy, two disjoint lists of names. A record uses one
  or two `fields` (broad research areas) and one to five `topics` (specific
  objects, techniques, and settings), spelled exactly. TeX files written
  before the split carry a single `Tag` subsection; the parser sorts its
  names into fields and topics, and `sync-tex` leaves such a file untouched
  while it agrees with its record, so the record's edit date survives.
- `_template.json` and `_template.tex`: the required structure of a record in
  each form.
- `metadata.json`: the pinned identifier crosswalk, matching provenance, and
  metadata migration epoch. Existing main identifiers are reused only for
  confirmed matches; other records receive stable new ULIDs. The original
  `op_` identifiers, existing JSON fields, and scientific content remain intact.
- `actors.json`: the system actor responsible for the metadata migration.
  This records the migration's provenance without claiming research
  authorship or human review.

Every record's status is exactly `Unsolved` or `Solved`; the zoo has no third
status, and `node site/build.mjs` fails on any other value.

The records were imported from the numbered TeX pool of the collection
*A list of open problems in quantum information and quantum computation*
with `node scripts/import-problems.mjs`, which parses each TeX file into its
JSON record and keeps the TeX file verbatim under its ID. Two archived solved
problems from that collection's recycle bin are included so that the zoo
shows resolved problems alongside open ones.

Run `node scripts/migrate-metadata.mjs` to initialize missing identifiers
and metadata and sync taxonomy IDs, or add `--check` to verify without writing.
The script is idempotent and uses the pinned crosswalk; it does not overwrite
scientific content or merge new changes from main. TeX imports preserve existing
identifiers and metadata, and require `--replace` to replace an existing
record's content.

Create new records with `node scripts/new-problem-id.mjs --create`, which
writes a scaffold with fresh permanent identifiers. Fill in the authored
content, run the metadata migration to sync taxonomy IDs, then run
`node scripts/sync-tex.mjs` and the build. `_template.json` documents the
format; its example identifiers must not be reused.

The site exports alias lookups at `/api/problems/<alias>.json`, the crosswalk
at `/api/identifiers.json`, and main-compatible envelopes at
`/api/main/problems/<ulid>.json`. Each envelope contains a strict `problem`
projection, the binary `status`, and the full authored `record`. The
projection filters aliases through main's slug rules; the full record and
crosswalk preserve all aliases. `/api/main/actors.json` exports the migration
actor. These are derived views of this database. Importing them into main's
ledger still requires admission or revision contributions and decisions,
taxonomy reconciliation, and explicit policy or schema changes for binary
statuses and raw aliases. Metadata taxonomy IDs are the slugs of this
database's authored field and topic names.

Run `node site/build.mjs` after any change; the build validates every record
and fails on schema violations. See `../CONTRIBUTING.md` for the writing
rules.
