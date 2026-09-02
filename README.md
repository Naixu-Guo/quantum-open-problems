# QIQCOP Zoo

**Quantum Information and Quantum Computation Open Problem Zoo** — a curated,
citable catalog of research-level open problems in quantum information and
quantum computation.

**[Browse the zoo](https://naixu-guo.github.io/quantum-open-problems/)**

Every problem is a self-contained TeX record with a typeset statement, a source
attribution, dated progress, a comment on the remaining gap, alpha-style
references with DOI and arXiv links, canonical tags, and a stable identifier of
the form `op_` followed by sixteen hexadecimal digits. Solved problems stay in
the zoo with their resolution, so citations survive.

## Repository structure

| Path | Purpose |
| --- | --- |
| `database/problems/<id>.tex` | One TeX record per problem. This is the site's database and the only content source. |
| `database/tags.json` | The canonical tag taxonomy. Records may use only these tags. |
| `database/_template.tex` | The structure every record must follow. |
| `site/build.mjs` | Zero-dependency build: parses and validates every record, converts TeX to HTML, and writes the static site to `dist/`. |
| `site/lib/` | The TeX parser/converter and the page templates. |
| `site/assets/` | Stylesheet, client script, and favicon. |
| `site/config.json` | Site name, URLs, and the branch used for edit links. |
| `scripts/import-problems.mjs` | Imports `problem_N.tex` files from a TeX workspace into the database by stable ID. |
| `scripts/new-problem-id.mjs` | Prints a fresh stable ID. |
| `open_problem_v2/` | The compiled PDF collection and its numbered TeX pool. The database records are imported from such a pool. |

`dist/` is generated and ignored by git. GitHub Pages builds it from `main`.

## Build and preview

```sh
node site/build.mjs
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000/`. The build needs Node 18 or newer and no
packages. It fails when a record breaks the schema: missing sections, unknown
tags, citations without a reference entry, `\eqref` targets without an
equation, or an unsupported text-mode TeX command.

## Add or update a problem

1. Copy `database/_template.tex` to `database/problems/<id>.tex`, where the ID
   comes from `node scripts/new-problem-id.mjs`.
2. Fill in the sections following the template comments and
   [CONTRIBUTING.md](CONTRIBUTING.md).
3. Run `node site/build.mjs` and open the generated page.
4. Open a pull request. The validation workflow runs the same build.

To refresh the database from a numbered TeX pool, run
`node scripts/import-problems.mjs <directory-or-files>`; records are matched by
the ID inside each file, so reruns update rather than duplicate.

See [WEBSITE.md](WEBSITE.md) for deployment details and the URL scheme.

## License

MIT for the site code. Problem records cite their primary sources; please cite
those sources for any mathematical claim.
