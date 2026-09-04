# QIQCOP Zoo

**Quantum Information and Quantum Computation Open Problem Zoo**: a curated,
citable catalog of research-level open problems in quantum information and
quantum computation.

**[Browse the zoo](https://naixu-guo.github.io/quantum-open-problems/)**

Every problem is a self-contained JSON record whose fields hold the TeX of a
typeset statement, a source attribution, dated progress, a comment on the
remaining gap, alpha-style references with DOI and arXiv links, canonical
tags, and a stable identifier of the form `op_` followed by sixteen
hexadecimal digits. A TeX form of each record accompanies it. Solved problems
stay in the zoo with their resolution, so citations survive.

## Repository layout

```text
database/            The content. One JSON record per problem, its TeX form, and the tag list.
  problems_json/<id>.json   The records the site is built from.
  problems_tex/<id>.tex     The TeX form of each record, kept in step by scripts/sync-tex.mjs.
  tags.json
  _template.json, _template.tex
  README.md
site/                The static-site generator (no dependencies beyond Node).
  build.mjs          Validates every record and writes the site to dist/.
  config.json        Site name, public URL, repository URL, branch for edit links, database paths.
  lib/record.mjs     Record schema, validation, canonical form, and JSON-to-TeX serialization.
  lib/tex.mjs        TeX record parser, validator, and text-mode TeX to HTML converter.
  lib/render.mjs     Page templates.
  assets/            styles.css, app.js, favicon.svg (copied into dist/).
scripts/             Maintenance helpers.
  new-problem-id.mjs Prints a fresh stable ID.
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
- **Stable IDs.** The `op_` identifier of a record is never changed or reused.
- **Canonical tags.** Records use only names from `database/tags.json`.
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
unknown tags, citations without a reference entry, `\eqref` targets without an
equation, an unsupported text-mode TeX command, or a TeX file that is missing
or disagrees with its JSON record.

Links inside the site are relative, so `dist/` works from any subpath, but the
folder-style URLs need a web server; opening `dist/index.html` directly from
the file system will not resolve links such as `problem/<id>/`.

## Add or update a problem

1. Copy `database/_template.json` to `database/problems_json/<id>.json`, where
   the ID comes from `node scripts/new-problem-id.mjs`.
2. Fill in the fields following [CONTRIBUTING.md](CONTRIBUTING.md).
3. Run `node scripts/sync-tex.mjs` to write `database/problems_tex/<id>.tex`,
   then `node site/build.mjs`, and check the generated page.
4. Open a pull request with both files. The validation workflow runs the same
   build.

To import records written in TeX (following `database/_template.tex`), run
`node scripts/import-problems.mjs <directory-or-files>`. Records are matched
by the ID inside each file, so reruns update rather than duplicate, and both
the JSON record and the TeX file are written.

## Site map

| URL | Content |
| --- | --- |
| `/` | Statistics panel, one random unsolved and one random solved problem with shuffle buttons, recent edits, method notes. |
| `/problems/` | Every problem with search and status, tag, and sort filters (`?q=`, `?status=`, `?tag=`, `?sort=`). |
| `/problem/<id>/` | One problem: statement, source, progress, comment, references, related problems, edit log, and Edit, Cite, Share actions. |
| `/problem/<id>/<id>.tex` | The TeX form of the record. |
| `/tags/`, `/tag/<slug>/` | Tag index and per-tag listings. |
| `/random/unsolved/`, `/random/solved/` | Redirect to a random problem. |
| `/about/` | Scope, status semantics, contribution guide, citation. |
| `/api/index.json`, `/api/problems/<id>.json`, `/api/tags.json` | Machine-readable records. |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Agent guide and crawler files. |

## How the build works

1. `site/lib/record.mjs` validates the shape of each JSON record (fields,
   types, ID format) and defines its canonical form and TeX serialization.
2. `site/lib/tex.mjs` numbers every labeled equation in order of appearance,
   converts the text-mode TeX of each field to HTML (quotes, dashes, accents,
   `\emph`, `\href`, lists, `\sourcecite`, `\eqref`), and leaves mathematics
   untouched for MathJax with an explicit `\tag{n}`, so equation numbers are
   stable on every page. The same module parses TeX files, which the build
   uses to check that `problems_tex/` agrees with `problems_json/`.
3. `site/lib/render.mjs` produces the pages from those records.
4. `site/build.mjs` checks the set (unique IDs, file names matching IDs,
   canonical tags, JSON and TeX in step), computes related problems from
   shared tags, reads edit dates from git history, appends content hashes to
   asset links so browsers refetch changed files, and writes everything under
   `dist/`.

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
