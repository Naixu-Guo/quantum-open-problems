# Contributing research

Quantum Open Problems accepts source corrections, status updates, partial results, computations, failed approaches, and proposals for new problems. Human and AI-assisted work follows the same evidence rules.

## Start from a problem record

Every active problem has a stable page at `/problems/<record-id>/`, a JSON record at `/api/v1/problems/<record-id>.json`, and a Markdown research brief at `/packets/<record-id>.md`. Solved problems keep an archived page at the same URL pattern. Open a problem on the website and select **Copy for AI research**, or fetch the brief directly. The brief contains the problem-source citation, source notation, formal statement, exact unresolved remainder, checked progress, and scope cautions. Keep the record ID and record revision in any notes or artifacts you produce.

Use the [research update form](../../issues/new?template=research-update.yml) for work attached to an existing record. Use the [new problem form](../../issues/new?template=new-problem.yml) for a question that the catalog does not cover.

## Required evidence

A research update must state:

- the exact claim and its hypotheses;
- the part of the cataloged statement that the claim addresses;
- primary sources with theorem, page, equation, or version locators when available;
- the evidence type, such as proof, computation, numerical result, survey assessment, or failed route;
- code, data, proof files, or certificates needed to reproduce the result;
- the gap that remains after accepting the contribution.

Report whether you used an AI system and how a person checked its output. AI-generated citations, proof steps, and computations need source or artifact verification.

## Review policy

Editors compare the contribution with the archived formal statement. They record publication maturity and mathematical strength as separate fields. A contribution changes `open` to `partial` only when it settles a named subproblem or substantial exact subclass. It changes a record to `solved` only when a proof or counterexample settles the full archived statement.

Editors may record a failed approach when it rules out a reusable route or documents a scope error that another researcher could repeat.

## The ledger is written by the service

`ledger/` and `activity/` are the database. The service writes them, commits
each batch, and pushes; people add problems, references, and comments
through the web app or the API, and agents through MCP. A pull request that
edits those directories directly is refused by CI unless it carries the
`ledger-change` label, which marks a deliberate migration.

## Adding a new problem

A new entry needs an independent mathematical source, a formal statement, evidence that the question remains open, and a reason it belongs in a quantum-science field. Editors reject duplicates and broad topics that lack a checkable resolution criterion.

Add accepted problems under `open_prob/<stable-id>/` with `problem.md` and `metadata.json`. Register the collection, field, and topic in `site/data/problems.js`.

## Local checks

Run:

```sh
node site/build.mjs
```

The build generates formal statements, problem-source citations, Markdown research briefs, the compact browser index, and API v1. The validator rejects stale generated files, invalid taxonomy references, status mismatches, and inconsistent catalog totals.
