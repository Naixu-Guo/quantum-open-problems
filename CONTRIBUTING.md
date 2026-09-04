# Contributing to the QIQCOP Zoo

Problems are JSON records in `database/problems_json/`, one file per problem
named by its stable ID, with the TeX form of each record in
`database/problems_tex/`. A pull request that adds or edits a record is the
only way content enters the site; the build validates every record, and the
validation workflow runs it on each pull request.

## Record format

Copy `database/_template.json` to `database/problems_json/<id>.json` and fill
in its fields. Every text field holds TeX, written exactly as in a TeX file
except for JSON escaping: backslashes are doubled (`\\emph{...}`) and line
breaks are written as `\n`.

| Field | Content |
| --- | --- |
| `schema` | `qiqcop-zoo/record/1`. |
| `id` | `op_` followed by sixteen hexadecimal digits, generated once with `node scripts/new-problem-id.mjs` and never changed. The file is named `<id>.json`. |
| `title` | The descriptive title only, on one line; the site never shows a problem number. |
| `status` | Exactly `Unsolved` or `Solved`. |
| `tags` | One to six names from `database/tags.json`, spelled exactly. |
| `statement` | The self-contained statement. |
| `source` | The paper that posed the problem, or the papers in which it is implicit, cited with `\\sourcecite{ref:...}{KEY}`. Write `Contributor: Full Name.` when no literature source exists, or `unknown`. |
| `progress` | An array of accurately scoped results, one TeX item each. |
| `references` | An array of `{ "key": "KEY", "label": "ref:...", "tex": "..." }`, each `tex` giving the full entry with DOI and arXiv links. |
| `comment` | The precise remaining gap and relations to other problems. |

After editing a record, run `node scripts/sync-tex.mjs` to write its TeX form
to `database/problems_tex/<id>.tex`, then `node site/build.mjs`. The build
fails when the TeX file is missing or disagrees with the record, so commit the
two files together.

A record can also be written in TeX following `database/_template.tex`, whose
sections map one to one onto the JSON fields, and imported with
`node scripts/import-problems.mjs <file>`; the import writes both files.

## Writing rules

- Begin with the open question in one direct sentence, then give only the
  definitions and notation needed to make it precise. State domains,
  hypotheses, parameter ranges, and quantifier order explicitly.
- Number every displayed equation with `\begin{equation}...\label{eq:...}`
  and cite it with `\eqref`. Unlabeled displays fail the build.
- Report only results that materially delimit the problem. Say exactly what
  each result proves, in which regime, and why it falls short.
- Use alpha-style keys such as `[BDSW96]` and cite every reference at least
  once with `\sourcecite`. Every citation must point to an entry in the same
  record.
- Do not refer to other problems in the statement; put relations in Comment.
- Labels are local to a record. Use a prefix unique to the record (for example
  `eq:a1b2-capacity`) to keep them readable.

## Status semantics

The zoo has exactly two statuses. Do not introduce a third one (no "partially
solved", "conditionally solved", or similar): the build rejects it, and the
site's filters, statistics, and colours are designed for two.

- **Unsolved**: no complete answer to the archived question, even when
  substantial subcases are settled; say in Progress and Comment what is known
  and what remains.
- **Solved**: a complete proof or counterexample for the archived statement.
  Say in Comment whether the resolving result is peer-reviewed.

Progress on a nearby variant does not change a status.

## Supported TeX

Text mode supports the constructs used by the collection: `\emph`, `\textbf`,
`\texttt`, `\textup`, `\href`, `\url`, quotes and dashes, accents
(`\'e`, `\"u`, `\v{s}`, `\.{Z}`, ...), `\ss`, `\l`, `\L`, `\DJ`, `\newline`,
`itemize` and `enumerate`, `\sourcecite`, and `\eqref`. Mathematics passes
through to MathJax unchanged. An unsupported text-mode command stops the build
with the offending fragment; extend `site/lib/tex.mjs` if a new construct is
genuinely needed.

## Reporting progress without a pull request

Open an issue with the *Report progress or a correction* template, quoting the
problem ID, the exact claim, and the primary sources.
