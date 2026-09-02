# Problem database

This directory is the only content source of the QIQCOP Zoo website.

- `problems/<id>.tex`: one TeX record per problem, named by its stable ID.
  The ID inside the record's final `ID` subsection must match the file name.
- `tags.json`: the canonical tag list. A record may use one to six of these
  names, spelled exactly.
- `_template.tex`: the required structure of a record.

Every record's `Status` subsection is exactly `Unsolved` or `Solved`; the zoo
has no third status, and `node site/build.mjs` fails on any other value.

The records were imported from the numbered TeX pool of the collection
*A list of open problems in quantum information and quantum computation*
with `node scripts/import-problems.mjs`, which copies each file verbatim under
its ID. Two archived solved problems from that collection's recycle bin are
included so that the zoo shows resolved problems alongside open ones.

Run `node site/build.mjs` after any change; the build validates every record
and fails on schema violations. See `../CONTRIBUTING.md` for the writing
rules.
