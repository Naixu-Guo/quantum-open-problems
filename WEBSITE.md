# Quantum Information Open Problems website

The deployable site is in [`site/`](site/). It is plain HTML, CSS, and JavaScript, with no package installation or build step.

## Preview locally

From the repository root, run:

```sh
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

## Update the research ledger

Edit [`site/data/problems.js`](site/data/problems.js). Keep these fields separate:

- `status`: whether the exact archived question is open or partially solved
- `maturity`: peer-reviewed, preprint, withdrawn, or another evidence state
- `strength`: exact theorem, restricted theorem, numerical evidence, survey assessment, or another scope label
- `latest`: the latest meaningful progress date, as `YYYY-MM-DD` when the day is known or `YYYY` when it is not

After changing the catalog, update `meta.audited`, test locally, and commit the source and audit date together.

Run the zero-dependency catalog check before publishing:

```sh
node site/validate.mjs
```
