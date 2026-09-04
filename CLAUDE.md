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
3. **Canonical tags only.** Use names from `database/tags.json` verbatim. To
   rename a tag, change the list and every record that uses it in one commit.
4. **`database/problems_json/` is the source of truth for the site.**
   `database/problems_tex/` holds the TeX form of every record and must agree
   with it: after editing a JSON record run `node scripts/sync-tex.mjs`, and
   commit both files together. The build fails when the two disagree, when a
   TeX file has no record, or when a record has no TeX file. `dist/` is
   generated, git-ignored, and never edited by hand. Records authored in TeX
   are imported with `node scripts/import-problems.mjs`, which writes both
   files; folders excluded from git (for example `_bikunli/`) are private
   workspaces and must not be modified unless the maintainer explicitly asks
   for a specific file.
5. **Every change is verified with `node site/build.mjs`.** It validates all
   records (fields, tags, citations, equation labels, text-mode TeX, and the
   agreement between JSON and TeX) and must pass before a commit.
6. **No AI attribution** in commit messages or pull requests.

## Design conventions

- Status colours: unsolved is red, solved is cyan; the logo O is light cyan
  and the P light red. Keep the status bar, tags, accents, and favicon in step.
- Content first: no hero banners, marketing strips, or sidebars. Problem pages
  are a single centered column.
- Header: one row above 1200 px, brand and tools over the nav down to 900 px,
  three stacked rows on phones; focusing the search box must not move anything.
- References show DOI and arXiv as buttons only; inline identifier links are
  stripped by the converter.
- Lists of problems are ordered by exact last-edit time (git author timestamp,
  seconds precision), newest first. A record's history is the git history of
  its TeX file, followed across renames; a pure rename is not an edit. That is
  why moving the TeX files from `database/problems/` to
  `database/problems_tex/` did not reset any date.

## Workflow

```sh
node site/build.mjs                       # validate and build dist/
python3 -m http.server 8000 --directory dist
node scripts/sync-tex.mjs [id ...]        # rewrite TeX files that disagree with their JSON records
node scripts/sync-tex.mjs --check         # report disagreements without writing
node scripts/import-problems.mjs <files>  # import TeX records by ID (writes JSON and TeX)
```
