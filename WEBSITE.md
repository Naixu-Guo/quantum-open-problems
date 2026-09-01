# Quantum Open Problems website

The deployable site is in [`site/`](site/). It uses plain HTML, CSS, and JavaScript with no package installation. The build generates a compact browser index, lazy problem records, Markdown research briefs, the public API, one static page per record under `site/problems/`, the sitemap, the Atom and JSON evidence feeds, the evidence log, the release manifest, and the `llms.txt`/`llms-full.txt` agent exports.

## Preview locally

From the repository root, run:

```sh
node site/build.mjs
python3 -m http.server 8000 --directory site
```

Then open `http://localhost:8000/`.

## Publish as a GitHub project site

1. Create a new repository, for example `quantum-information-open-problems`. Do not name it `<username>.github.io`; that name is reserved for your account homepage.
2. Put this project on the repository's `main` branch.
3. In the repository, open **Settings → Pages** and select **GitHub Actions** under **Build and deployment → Source**.
4. Push to `main`, or run the **Deploy research index to GitHub Pages** workflow manually from the Actions tab.

The included [Pages workflow](.github/workflows/pages.yml) publishes only `site/`. This repository uses the following project URL:

```text
https://naixu-guo.github.io/quantum-information-open-problems/
```

All site paths are relative, so the same files also work at a custom domain or another repository name.

## Extend the research ledger

Edit [`site/data/problems.js`](site/data/problems.js). To add a new research field, register it in `taxonomy.areas`, add its narrower subjects to `taxonomy.topics`, and assign each new question a topic ID. Register every source list once in `collections`; problem records refer to that stable collection ID.

Assign the broad field from the problem's source scope and primary literature. A topic match alone does not justify moving an entry from a quantum-information collection into quantum many-body, foundations, or computation. Create a field-specific topic ID when a new source problem belongs to a different field.

Keep these evidence fields separate:

- `status`: whether the exact archived question is open or partially solved
- `importance`: the concrete mathematical, physical, or operational consequence of resolving it
- `remaining`: the present research gap after accounting for known progress
- `maturity`: peer-reviewed, preprint, withdrawn, or another evidence state
- `strength`: exact theorem, restricted theorem, numerical evidence, survey assessment, or another scope label
- `latest`: the latest meaningful progress date, as `YYYY-MM-DD` when the day is known or `YYYY` when it is not
- `verified`: the date an individual entry was last checked when it differs from the baseline audit
- `origin`: whether a later addition is stated by its primary source or derived from a documented limitation

For an imported problem, add `last_verified`, `origin`, `catalog_source`, and `catalog_source_id` to its `metadata.json`. Reject duplicates, entries with an unresolved status review, and records that lack an independent mathematical source.

Write definitions in the article's `## Notation` section and the rigorous formulation in `## Formal statement`. Run `node site/generate-formal.mjs` after editing either section. The generated [`site/data/formal-statements.js`](site/data/formal-statements.js) file preserves the definitions, setup, quantifiers, equations, and resolution criterion. The detail dialog typesets its TeX with MathJax 4. `site/validate.mjs` fails when the generated copy differs from the article.

The source metadata in each active record supplies the paper or problem list that states the question, its authors, a DOI or arXiv link, and the statement locator. Run `node site/generate-sources.mjs` after changing that metadata. The detail dialog displays the generated citation above the formal statement.

Run `node site/generate-packets.mjs` after changing a source, formal statement, or catalog record. It produces one stable Markdown research brief under `site/packets/` for each active problem. The detail view fetches that file when someone selects Copy for AI research.

Run `node site/generate-pages.mjs` after the packets. It writes one static page per record under `site/problems/<record-id>/`, including archived pages for solved records in `open_prob/`, plus the `site/problems/` directory page, the `site/ai/` agent guide, the `site/vocab/` structured-data vocabulary, `site/sitemap.xml`, the Atom and JSON evidence feeds (`site/feed.xml`, `site/feed.json`), the evidence log `site/api/v1/evidence.json`, the release manifest `site/api/v1/release.json`, and `site/llms-full.txt`. Solved records keep their page URLs; only pages for unknown records are removed. `node site/build.mjs` runs every generator in order, so a single command still produces the whole release.

Schema version 3 keeps formal statements out of the summary catalog. `problems.js` stores browsing and evidence metadata; the problem articles remain the mathematical source of truth.

The topic registry assigns each problem its broad research field, so each problem needs only a `topic` ID. `meta.audited` records the baseline audit date; `meta.updated` and `meta.asOf` record the current catalog cutoff. After changing the catalog, update the totals and dates that changed. Test locally, then commit the source records and catalog data together.

Regenerate the statements and run the zero-dependency catalog check before publishing:

```sh
node site/build.mjs
```
