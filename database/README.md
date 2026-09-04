# Problem database

This directory is the only content source of the QIQCOP Zoo website.

- `problems_json/<id>.json`: one JSON record per problem, named by its stable
  ID. These files are the source of truth; the site is built from them. Each
  record holds the title, status, tags, and ID, and the TeX of every section
  (statement, source, progress items, references, comment) as strings.
  `_template.json` shows the shape and `../CONTRIBUTING.md` explains the
  fields.
- `problems_tex/<id>.tex`: the TeX form of each record, in the layout of
  `_template.tex`. It is what `problem/<id>/<id>.tex` serves on the site and
  what a TeX collection can `\input`. It is kept in step with the JSON record
  by `node scripts/sync-tex.mjs`, and the build fails when the two disagree.
  Edit the JSON record, not this file.
- `tags.json`: the canonical tag list. A record may use one to six of these
  names, spelled exactly.
- `_template.json` and `_template.tex`: the required structure of a record in
  each form.

Every record's status is exactly `Unsolved` or `Solved`; the zoo has no third
status, and `node site/build.mjs` fails on any other value.

The records were imported from the numbered TeX pool of the collection
*A list of open problems in quantum information and quantum computation*
with `node scripts/import-problems.mjs`, which parses each TeX file into its
JSON record and keeps the TeX file verbatim under its ID. Two archived solved
problems from that collection's recycle bin are included so that the zoo
shows resolved problems alongside open ones.

Run `node site/build.mjs` after any change; the build validates every record
and fails on schema violations. See `../CONTRIBUTING.md` for the writing
rules.
