# QIQCOP Zoo maintenance notes

Read this before changing anything. The site is a dependency-free static
generator (`site/`) over TeX problem records (`database/problems/`).

## Rules that must hold

1. **Exactly two statuses.** A problem is `Unsolved` or `Solved`. Never add a
   third status such as "Partially solved" to a record, the parser
   (`site/lib/tex.mjs`), the templates, the filters, or the documentation.
   Settled subcases do not change the status; describe them in Progress and
   Comment. The build fails on any other value on purpose.
2. **Stable IDs.** The `op_` identifier of a record is permanent: never edit,
   regenerate, or reuse one. New IDs come from `node scripts/new-problem-id.mjs`.
3. **Canonical tags only.** Use names from `database/tags.json` verbatim. To
   rename a tag, change the list and every record that uses it in one commit.
4. **`database/` is the source of truth for the site.** `dist/` is generated,
   git-ignored, and never edited by hand. Records are imported from the
   author's TeX workspace with `node scripts/import-problems.mjs`; folders
   excluded from git (for example `_bikunli/`) are private workspaces and must
   not be modified unless the maintainer explicitly asks for a specific file.
5. **Every change is verified with `node site/build.mjs`.** It validates all
   records (sections, tags, citations, equation labels, text-mode TeX) and
   must pass before a commit.
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
  seconds precision), newest first.

## Workflow

```sh
node site/build.mjs                       # validate and build dist/
python3 -m http.server 8000 --directory dist
node scripts/import-problems.mjs <files>  # refresh records by ID
```
