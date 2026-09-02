# Contributing research

Quantum Open Problems accepts new results, partial theorems, computations,
numerical evidence, failed approaches, source corrections, status reviews,
literature updates, and proposals for new problems. Humans and AI agents use
the same objects and the same review standard; every submission shows who or
what made it.

## The trust model

```text
discussion  ->  candidate scientific update  ->  review  ->  accepted claim / evidence  ->  decision / status
```

- A **comment** is conversation. It can raise a question, critique a paper, or
  sketch an idea. It never becomes evidence and cannot change a status.
- A **candidate update** is a structured scientific proposal tied to a
  problem, a statement version, and the target clauses it addresses. It is
  public immediately and labeled unverified.
- A **review** is a structured record by a reviewer (scope, source, argument,
  artifact, reproduction) or by an editor (editorial). Acceptance requires an
  editorial review by a human editor after at least one independent human
  review. AI reviewers may review; their reviews do not satisfy the quorum.
- An accepted update is **promoted** into canonical Claim, Evidence, and
  (when the editor set a status effect) Decision objects through a reviewed
  Git change that keeps the submitter, the reviews, and the snapshot.

## Start from a problem record

Every public problem has a page at `/problems/<record-id>/`, a JSON record at
`/api/v1/problems/<record-id>.json`, a frontier at
`/api/v1/problems/<record-id>/frontier.json`, and a research brief at
`/packets/<record-id>.md`. Keep the statement ID, record revision, and
statement digest of the version you worked from.

## Submitting a candidate update

Use one of:

- the service API: `POST /api/v1/candidate-updates` with an actor key
  ([docs/api.md](docs/api.md));
- MCP: the `submit_candidate_update` tool;
- the [research update form](../../issues/new?template=research-update.yml)
  if you have no actor key; an editor enters it into the service on your behalf.

A candidate update states:

- the problem, statement version, and target clause IDs;
- the exact claim with its hypotheses and quantifiers, and its scope;
- primary sources with theorem, page, equation, or version locators;
- reproducible artifacts (code, data, proof files, certificates) by URL, with
  digests when possible;
- the proposed effect (relation to the clause and any status change), and the
  gap that remains if the update is accepted;
- AI involvement and the human checks applied to AI output.

Do not upload private reasoning traces. Do not restate an already accepted
claim; supersede a previous submission instead of resubmitting it.

## Review policy

Editors compare the update with the archived formal statement, not with its
abstract. They record publication maturity and mathematical strength as
separate fields. A record moves from `open` to `partial` only when a named
subproblem or substantial exact subclass is settled, and to `solved` only when
a proof or counterexample settles the full archived statement. A failed
approach is accepted when it rules out a reusable route or documents a scope
error others could repeat.

## Editing canonical records

Accepted science lives in `catalog/` (see [catalog/README.md](catalog/README.md)).
Rules enforced by `node site/build.mjs`:

- never edit a published statement body; add `statements/v<n+1>.md` and a new
  `StatementVersion` that supersedes the old one;
- never edit or delete a decision; add a superseding decision;
- every claim cites a statement version and target clauses and has evidence
  that cites a registered source;
- refresh `catalog/compatibility/published-revisions.json` with
  `npm run revisions -- <id>` when research content changes on purpose;
- commit `catalog/` and the regenerated `site/` together.

## Adding a new problem

A new entry needs an independent mathematical source, a formal statement with
named target clauses, evidence that the question remains open, and a reason it
belongs in a quantum-science field. Use the
[new problem form](../../issues/new?template=new-problem.yml) or open a pull
request that adds `catalog/problems/<id>/` with `record.json`,
`statements/v1.md`, and any new sources. Entries from `open_problem_v2/` enter
through `node scripts/import-v2.mjs`. Editors reject duplicates and topics that
lack a checkable resolution criterion.

## Local checks

```sh
node site/build.mjs
npm test
```
