# QIQCOP Zoo maintenance notes

Read this before changing anything. The site is a dependency-free static
generator (`site/`) over JSON problem records (`database/problems_json/`),
each mirrored by a TeX file (`database/problems_tex/`).

## Rules that must hold

1. **Exactly two statuses.** A problem is `Unsolved` or `Solved`. Never add a
   third status such as "Partially solved" to a record, the record schema
   (`site/lib/record.mjs`), the parser (`site/lib/tex.mjs`), the templates,
   the filters, or the documentation. Settled subcases do not change the
   status; describe them in Progress and Comment. The build fails on any other
   value on purpose.
2. **Stable IDs.** The `op_` identifier of a record is permanent: never edit,
   regenerate, or reuse one. New IDs come from `node scripts/new-problem-id.mjs`.
   Use `--create` to write a new record scaffold with fresh identifiers;
   `--json` prints the scaffold without writing it. The template's IDs are
   examples and must not be reused.
   The ULID is also permanent. Preserve the full alias set, including the
   original `op_` ID, ULID, `op-` alias, and confirmed main slugs. Initialize
   missing identifiers and metadata with `node scripts/migrate-metadata.mjs`,
   using the pinned crosswalk and provenance in `database/metadata.json`.
3. **Canonical fields and topics only.** Every record has one or two `fields`
   and one to five `topics`, spelled exactly as in `database/tags.json`, whose
   `fields` and `topics` lists are disjoint: a name is either a field or a
   topic, never both. To rename a name or move it between the lists, change
   the list and every record that uses it in one commit. Never add a third
   kind of tag. Metadata `areaIds` and `topicIds` must equal the URL slugs of
   the authored field and topic names in the same order. Run the metadata
   migration after changing those names to update the derived IDs.
4. **`database/problems_json/` is the source of truth for the site.**
   `database/problems_tex/` holds the TeX form of every record and must agree
   with it: after editing a JSON record run `node scripts/sync-tex.mjs`, and
   commit both files together. The build fails when the two disagree, when a
   TeX file has no record, or when a record has no TeX file. `dist/` is
   generated, git-ignored, and never edited by hand. Records authored in TeX
   are imported with `node scripts/import-problems.mjs`, which writes both
   files and preserves existing identifiers and metadata; replacing existing
   content requires `--replace` after reviewing the incoming TeX. Folders
   excluded from git (for example `_bikunli/`) are private
   workspaces and must not be modified unless the maintainer explicitly asks
   for a specific file. TeX files written before the taxonomy was split into
   fields and topics carry a single `Tag` subsection; the parser still reads
   them, and `sync-tex` leaves such a file alone while it agrees with its
   record, which keeps the record's git history and edit date intact. Do not
   rewrite them by hand.
   Schema `qiqcop-zoo/record/3` adds `ulid`, `aliases`, and `metadata` while
   preserving all existing authored fields. These additions are included in
   JSON hashes and omitted from the TeX content comparison. Metadata-only
   changes must not rewrite otherwise matching TeX files or reset their
   edit history.
5. **Every change is verified with `node site/build.mjs`.** It validates all
   records (fields, topics and their counts, citations, equation labels,
   text-mode TeX, and the agreement between JSON and TeX) and must pass
   before a commit.
6. **No AI attribution** in commit messages or pull requests.
7. **Main compatibility preserves the authored database.** The migration
   fills missing metadata without replacing scientific content, field or
   topic names, or binary statuses. `database/actors.json` records an honest
   system migration actor. Main exports contain a strict Problem projection
   alongside the full source record and binary status, preserving all aliases.
   After authoring changes, run `npm run export-ledger` and commit the ledger
   projection. Its `authoredCatalog` provenance makes the maintained records
   visible to the research service with their authoritative status. Do not
   invent reviews or decisions. Regular exports preserve subsequent service
   activity; full replacement requires the explicit `--replace-authoritative`
   flag. The contract accepts both identifiers, binary research statuses,
   and an independent field/topic taxonomy.

## Design conventions

- Status colours: unsolved is red, solved is cyan; the logo O is light cyan
  and the P light red. Keep the status bar, tags, accents, and favicon in step.
- Content first: no hero banners or marketing strips. Problem pages are a
  single centered column; the only sidebar is the catalog's filter column.
- Fields are solid pills and topics outlined pills everywhere; the problem
  page labels the two rows Field and Topic. Fields come before topics.
- Search lives in the large box of the home overview panel and in the
  catalog's left sidebar; the header has no search box. `/` focuses the
  page's search box or opens the catalog. Focusing a search box must not
  move anything.
- Header: one row above 1200 px, brand and tools over the nav down to 900 px,
  three stacked rows on phones.
- References show DOI and arXiv as buttons only; inline identifier links are
  stripped by the converter.
- Lists of problems are ordered by exact last-edit time (git author timestamp,
  seconds precision), newest first. Equal edit times use creation time,
  newest first, then the stable ID for exact ties; alphabetical sorting is
  an explicit catalog option. A record's history is the git history of
  its TeX file, followed across renames; a pure rename is not an edit. That is
  why moving the TeX files from `database/problems/` to
  `database/problems_tex/` did not reset any date.

## Workflow

```sh
node site/build.mjs                       # validate and build dist/
python3 -m http.server 8000 --directory dist
node scripts/sync-tex.mjs [id ...]        # rewrite TeX files that disagree with their JSON records
node scripts/sync-tex.mjs --check         # report disagreements without writing
node scripts/new-problem-id.mjs --create # create a scaffold with fresh permanent identifiers
node scripts/migrate-metadata.mjs        # initialize metadata and sync taxonomy IDs
node scripts/migrate-metadata.mjs --check # check metadata without writing
node scripts/import-problems.mjs <files>  # import TeX records by ID (writes JSON and TeX)
node scripts/import-problems.mjs --replace <files> # intentionally replace existing content, retaining metadata
```
