# QIQCOP Zoo

**Quantum Information and Quantum Computation Open Problem Zoo**: a curated,
citable catalog of research-level open problems in quantum information and
quantum computation.

**[Browse the zoo](https://naixu-guo.github.io/quantum-open-problems/)**

Every problem is a self-contained TeX record with a typeset statement, a source
attribution, dated progress, a comment on the remaining gap, alpha-style
references with DOI and arXiv links, canonical tags, and a stable identifier of
the form `op_` followed by sixteen hexadecimal digits. Solved problems stay in
the zoo with their resolution, so citations survive.

## Repository layout

```text
database/            The content. One TeX record per problem plus the tag list.
  problems/<id>.tex
  tags.json
  _template.tex
  README.md
site/                The static-site generator (no dependencies beyond Node).
  build.mjs          Validates every record and writes the site to dist/.
  config.json        Site name, public URL, repository URL, branch for edit links.
  lib/tex.mjs        TeX parser, validator, and text-mode TeX to HTML converter.
  lib/render.mjs     Page templates.
  assets/            styles.css, app.js, favicon.svg (copied into dist/).
scripts/             Maintenance helpers.
  new-problem-id.mjs Prints a fresh stable ID.
  import-problems.mjs Imports problem_N.tex files from a TeX workspace by ID.
.github/             Pages deployment, pull-request validation, issue templates.
dist/                Generated site. Ignored by git; rebuilt by the build.
```

Two documents accompany the code: this file for building and deploying, and
[CONTRIBUTING.md](CONTRIBUTING.md) for writing problem records.

## Build and preview

```sh
node site/build.mjs                       # or: npm run build
python3 -m http.server 8000 --directory dist   # or: npm run serve
```

Then open `http://localhost:8000/`. Node 18 or newer is the only requirement.
The build fails when a record breaks the schema: missing sections, unknown
tags, citations without a reference entry, `\eqref` targets without an
equation, or an unsupported text-mode TeX command.

Links inside the site are relative, so `dist/` works from any subpath, but the
folder-style URLs need a web server; opening `dist/index.html` directly from
the file system will not resolve links such as `problem/<id>/`.

## Add or update a problem

1. Copy `database/_template.tex` to `database/problems/<id>.tex`, where the ID
   comes from `node scripts/new-problem-id.mjs`.
2. Fill in the sections following the template comments and
   [CONTRIBUTING.md](CONTRIBUTING.md).
3. Run `node site/build.mjs` and check the generated page.
4. Open a pull request. The validation workflow runs the same build.

To refresh many records from a numbered TeX pool, run
`node scripts/import-problems.mjs <directory-or-files>`. Records are matched by
the ID inside each file, so reruns update rather than duplicate.

## Site map

| URL | Content |
| --- | --- |
| `/` | Statistics panel, one random unsolved and one random solved problem with shuffle buttons, recent edits, method notes. |
| `/problems/` | Every problem with search and status, tag, and sort filters (`?q=`, `?status=`, `?tag=`, `?sort=`). |
| `/problem/<id>/` | One problem: statement, source, progress, comment, references, related problems, edit log, and Edit, Cite, Share, TeX, JSON actions. |
| `/problem/<id>/<id>.tex` | The TeX record. |
| `/tags/`, `/tag/<slug>/` | Tag index and per-tag listings. |
| `/random/unsolved/`, `/random/solved/` | Redirect to a random problem. |
| `/about/` | Scope, status semantics, contribution guide, citation. |
| `/api/index.json`, `/api/problems/<id>.json`, `/api/tags.json` | Machine-readable records. |
| `/llms.txt`, `/sitemap.xml`, `/robots.txt` | Agent guide and crawler files. |

## How the build works

1. `site/lib/tex.mjs` splits each record into its sections, numbers every
   labeled equation in order of appearance, converts text-mode TeX to HTML
   (quotes, dashes, accents, `\emph`, `\href`, lists, `\sourcecite`,
   `\eqref`), and leaves mathematics untouched for MathJax with an explicit
   `\tag{n}`, so equation numbers are stable on every page.
2. `site/lib/render.mjs` produces the pages from those records.
3. `site/build.mjs` checks the set (unique IDs, file names matching IDs,
   canonical tags), computes related problems from shared tags, reads edit
   dates from git history, appends content hashes to asset links so browsers
   refetch changed files, and writes everything under `dist/`.

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
or the branch used by the Edit and history links.

## License

MIT for the site code. Problem records cite their primary sources; please cite
those sources for any mathematical claim.
