# QIQCOP Zoo

**Quantum Information and Quantum Computation Open Problem Zoo**: a curated,
citable catalog of research-level open problems in quantum information and
quantum computation.

**[Browse the zoo](https://naixu-guo.github.io/quantum-open-problems/)**

Every problem is a self-contained JSON record whose fields hold the TeX of a
typeset statement, a source attribution, dated progress, a comment on the
remaining gap, alpha-style references with DOI and arXiv links, one or two
fields and one to five topics from a controlled taxonomy, and a stable
identifier of the form `op_` followed by sixteen hexadecimal digits. A TeX
form of each record accompanies it. Solved problems
stay in the zoo with their resolution, so citations survive.

Records also carry a stable ULID, lookup aliases, and metadata compatible
with main's Problem model. These additions preserve the existing JSON
fields, authored content, field and topic names, and the two statuses used
by this site.

## Repository layout

```text
database/            The content. One JSON record per problem, its TeX form, and the taxonomy.
  problems_json/<id>.json   The records the site is built from.
  problems_tex/<id>.tex     The TeX form of each record, kept in step by scripts/sync-tex.mjs.
  tags.json                 The taxonomy: the list of fields and the list of topics.
  metadata.json             Pinned identifier crosswalk, provenance, and migration epoch.
  actors.json               The system actor responsible for the metadata migration.
  _template.json, _template.tex
  README.md
site/                The static-site generator (no dependencies beyond Node).
  build.mjs          Validates every record and writes the site to dist/.
  config.json        Site name, public URL, repository URL, branch for edit links, database paths.
  lib/record.mjs     Record schema, validation, canonical form, and JSON-to-TeX serialization.
  lib/taxonomy.mjs   Loads and validates tags.json; splits legacy tag lists into fields and topics.
  lib/tex.mjs        TeX record parser, validator, and text-mode TeX to HTML converter.
  lib/render.mjs     Page templates.
  assets/            styles.css, app.js, favicon.svg (copied into dist/).
scripts/             Maintenance helpers.
  new-problem-id.mjs Prints a fresh stable ID; --create writes a new record scaffold.
  migrate-metadata.mjs Initializes metadata and syncs taxonomy IDs; --check verifies them.
  sync-tex.mjs       Rewrites TeX files that disagree with their JSON records.
  import-problems.mjs Imports TeX records (problem_N.tex) into JSON and TeX by ID.
.github/             Pages deployment, pull-request validation, issue templates.
dist/                Generated site. Ignored by git; rebuilt by the build.
```

Two documents accompany the code: this file for building and deploying, and
[CONTRIBUTING.md](CONTRIBUTING.md) for writing problem records.
[CLAUDE.md](CLAUDE.md) lists the conventions that every change must respect.

## Conventions that must not change

- **Exactly two statuses.** A problem is `Unsolved` or `Solved`. There is no
  partial, conditional, or intermediate status; when subcases are settled but
  the archived statement is not, the problem stays `Unsolved` and the Progress
  and Comment sections say what is known and what remains. The build rejects
  any other value.
- **Stable IDs.** The `op_` identifier and ULID of a record are never changed
  or reused. Existing links continue to use the `op_` identifier.
- **Canonical fields and topics.** A record has one or two fields and one to
  five topics, spelled exactly as in `database/tags.json`; a name is either a
  field or a topic, never both.
- **JSON is the source of truth.** `database/problems_json/` is what the site
  is built from; `database/problems_tex/` is derived from it and must agree.
- **Generated output is never edited.** `dist/` is rebuilt from `database/`.

## Build and preview

```sh
node site/build.mjs                       # or: npm run build
python3 -m http.server 8000 --directory dist   # or: npm run serve
```

Then open `http://localhost:8000/`. Node 18 or newer is the only requirement.
The build fails when a record breaks the schema: missing or unknown fields,
unknown fields or topics or the wrong number of them, citations without a
reference entry, `\eqref` targets without an equation, an unsupported
text-mode TeX command, or a TeX file that is missing or disagrees with its
JSON record.

Links inside the site are relative, so `dist/` works from any subpath, but the
folder-style URLs need a web server; opening `dist/index.html` directly from
the file system will not resolve links such as `problem/<id>/`.

## Add or update a problem

1. Run `node scripts/new-problem-id.mjs --create` to create a record scaffold
   in `database/problems_json/` with fresh permanent identifiers. Use
   `database/_template.json` as a format reference; do not reuse its example IDs.
2. Fill in the fields following [CONTRIBUTING.md](CONTRIBUTING.md).
3. Run `node scripts/migrate-metadata.mjs` to initialize metadata and sync
   taxonomy IDs, then `node scripts/sync-tex.mjs` to write `database/problems_tex/<id>.tex`,
   then `node site/build.mjs`, and check the generated page.
4. Open a pull request with the record, its TeX form, and any updated
   metadata files. The validation workflow runs the same build.

To import records written in TeX (following `database/_template.tex`), run
`node scripts/import-problems.mjs <directory-or-files>`. Records are matched
by the ID inside each file. Replacing an existing record requires `--replace`;
review the incoming TeX before using it. The import preserves existing
identifiers and metadata and writes both the JSON record and the TeX file.

## Site map

| URL | Content |
| --- | --- |
| `/` | Overview panel with the site search box and statistics, one random unsolved and one random solved problem with shuffle buttons, recent edits. |
| `/problems/` | Every problem, with a sidebar of search (including ULIDs), status, field, topic, and sort filters (`?q=`, `?status=`, `?field=`, `?topic=`, `?sort=`; the older `?tag=` still works). |
| `/problem/<id>/` | One problem: statement, source, progress, comment, references, related problems, edit log, and Edit, Cite, Share actions. |
| `/problem/<alias>/` | Redirect from a ULID or another registered alias to the existing problem page. |
| `/problem/<id>/<id>.tex` | The TeX form of the record. |
| `/tags/`, `/tag/<slug>/` | Index of fields and topics; one listing per field and per topic. |
| `/random/unsolved/`, `/random/solved/` | Redirect to a random problem. |
| `/about/` | Scope, status semantics, contribution guide, citation. |
| `/api/index.json`, `/api/problems/<id>.json`, `/api/tags.json` | Machine-readable records and the taxonomy with counts. |
| `/api/problems/<alias>.json`, `/api/identifiers.json` | Record lookup by any registered alias, and the identifier crosswalk. |
| `/api/main/problems/<ulid>.json`, `/api/main/actors.json` | Main-compatible Problem projections with the full authored records, and the migration actor. |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Agent guide and crawler files. |

## Metadata and main compatibility

The source record uses `qiqcop-zoo/record/3`. Its `ulid`, `aliases`, and
`metadata` fields connect existing zoo records to main's Problem model.
`database/metadata.json` pins the crosswalk and migration provenance, so
rerunning `node scripts/migrate-metadata.mjs` fills missing metadata without
overwriting scientific content or importing changes from main. It also
keeps metadata taxonomy IDs in step with the authored field and topic names. Use
`node scripts/migrate-metadata.mjs --check` to check without writing.

An export at `/api/main/problems/<ulid>.json` contains `problem`, a strict
main Problem projection; `status`, the zoo's `Unsolved` or `Solved` value;
and `record`, the complete authored JSON. The projection includes only
aliases accepted by main's slug rules. The enclosing record and identifier
crosswalk retain every alias, including the original `op_` identifier.

These exports do not admit records to main's ledger or invent reviews and
decisions. A ledger integration still needs taxonomy reconciliation,
admission or revision contributions, and decisions; using the zoo's binary
statuses and raw aliases there also requires explicit policy or schema
changes. The site continues to build from `database/problems_json/`.

## How the build works

1. `site/lib/record.mjs` validates the shape of each JSON record (fields,
   types, ID format) and defines its canonical form and TeX serialization.
   Identifiers and metadata are included in JSON hashes; the additional
   metadata is omitted from the TeX representation and content comparison.
2. `site/lib/tex.mjs` numbers every labeled equation in order of appearance,
   converts the text-mode TeX of each field to HTML (quotes, dashes, accents,
   `\emph`, `\href`, lists, `\sourcecite`, `\eqref`), and leaves mathematics
   untouched for MathJax with an explicit `\tag{n}`, so equation numbers are
   stable on every page. The same module parses TeX files, which the build
   uses to check that `problems_tex/` agrees with `problems_json/`.
3. `site/lib/render.mjs` produces the pages from those records.
4. `site/build.mjs` checks the set (unique IDs, file names matching IDs,
   canonical fields and topics in the right numbers, JSON and TeX in step),
   computes related problems from shared topics and fields (a shared topic
   counts twice as much as a shared field), reads edit dates from git history,
   appends content hashes to asset links so browsers refetch changed files,
   and writes everything under `dist/`.

Mathematics is typeset in the browser by MathJax 4 (SVG output), so equations
scale with zoom and render the same across browsers. Fonts come from Google
Fonts with system fallbacks; the logo uses Jost, whose letter O is a circle.

## Deployment

The [Pages workflow](.github/workflows/pages.yml) runs on every push to `main`
that touches `database/`, `site/`, or `scripts/`, builds `dist/`, and deploys
it with GitHub Actions. Configure the repository under **Settings → Pages →
Source: GitHub Actions**. The workflow checks out the full history so each
page can show when its record was created and last edited.

Pull requests run the [validation workflow](.github/workflows/validate.yml),
which executes the same build into a temporary directory.

Edit `site/config.json` to change the site name, public URL, repository URL,
the branch used by the Edit and history links, or the database paths.

## License

MIT for the site code. Problem records cite their primary sources; please cite
those sources for any mathematical claim.
