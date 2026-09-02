# Contributing to the QIQCOP Zoo

Problems are TeX records in `database/problems/`. A pull request that adds or
edits a record is the only way content enters the site; the build validates
every record, and the validation workflow runs it on each pull request.

## Record format

Copy `database/_template.tex` and keep its section order:

1. `\section{Title}` — only the descriptive title.
2. `\paragraph{Problem.}` — the self-contained statement.
3. `\subsection*{Status}` — exactly `Unsolved`, `Partially solved`, or `Solved`.
4. `\subsection*{Source}` — the paper that posed the problem, or the papers in
   which it is implicit, cited with `\sourcecite{ref:...}{KEY}`. Write
   `Contributor: Full Name.` when no literature source exists, or `unknown`.
5. `\subsection*{Progress}` — one `itemize` list of accurately scoped results.
6. `\subsection*{References}` — one `enumerate` list; each item starts with
   `\item[\textup{[KEY]}]\label{ref:...}` and gives the full entry with DOI and
   arXiv links.
7. `\subsection*{Comment}` — the precise remaining gap and relations to other
   problems.
8. `\subsection*{Tag}` — one to six names from `database/tags.json`,
   separated by semicolons.
9. `\subsection*{ID}` — `\texttt{op\_...}`, generated once with
   `node scripts/new-problem-id.mjs` and never changed.

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

- **Unsolved**: no complete answer to the archived question.
- **Partially solved**: a substantial subcase or direction is settled.
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
