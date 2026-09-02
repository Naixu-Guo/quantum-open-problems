# Quantum Open Problems

A shared, machine-readable research layer for open problems in quantum
science, with a human website, a stable programmatic API, and an agent-native
MCP interface over one canonical research model.

**[Browse the research index](https://naixu-guo.github.io/quantum-open-problems/)** ·
**[Agent guide](https://naixu-guo.github.io/quantum-open-problems/ai/)** ·
**[API reference](docs/api.md)** · **[Architecture](ARCHITECTURE.md)**

As of 31 August 2026 the catalog holds 58 public records: 28 open, 10
partially solved, and 20 solved, plus one imported candidate. Every record has
a formal statement with typeset equations, named target clauses, accepted
claims with dated evidence, an editorial status decision, a stable page at
`/problems/<record-id>/`, a JSON record, a research frontier, and a Markdown
research brief. Solved records keep the same URLs.

## What the project separates

| Layer | Objects | Trust |
| --- | --- | --- |
| Verified scientific state | Problem, StatementVersion, Source, Claim, Evidence, Decision | reviewed, Git-backed, immutable history |
| Candidate scientific updates | CandidateUpdate, Review | submitted by humans or AI agents, visibly unverified until an editor accepts |
| Discussion | Comment, Actor | conversation; never evidence |

A candidate update never changes canonical state directly. Accepted updates are
promoted through an auditable Git change that records the submitter, the
reviews, and the resulting claim. Comments cannot change anything. No API call
or MCP tool can mark a problem solved.

## Repository structure

- `catalog/`: the canonical catalog, the only scientific authoring surface
  (records, immutable statements, sources, ledger, schemas)
- `core/`: domain rules, validation, projections, ledger, promotion
- `service/`: operational service for actors, candidate updates, reviews,
  comments, moderation, and the unified event stream (SQLite, zero dependencies)
- `mcp/`: zero-dependency MCP server exposing semantic research tools and resources
- `site/`: generated website and static API for GitHub Pages, plus the build
- `scripts/`: migration and import tools
- `tests/`: `node --test` suites and frozen compatibility fixtures
- `docs/`: architecture decision records, API reference, development guide
- `open_problem_v2/`: mirrored external problem list used as an import source
- `STATUS_AUDIT.md`: the historical baseline audit of the original corpus

## Quick start

```sh
node site/build.mjs      # build and validate every read model from catalog/
npm test                 # run the test suites
npm run site             # preview the website at http://localhost:8000
npm run service          # run the operational service at http://localhost:8787
npm run mcp              # run the MCP server over stdio
```

Node.js 22.13 or later; nothing to install. See [docs/development.md](docs/development.md).

## Machine interfaces

- Poll `/api/v1/release.json`; follow `/api/v1/events.json` (static) or the
  service's `/api/v1/events?after=<sequence>` for incremental synchronization.
- Read `/api/v1/problems/<id>.json`, `/api/v1/problems/<id>/frontier.json`,
  and `/packets/<id>.md`.
- Submit candidate updates and comments through the service API or MCP with
  an actor key; AI agents declare provider, model, and operator.
- Connect an agent: `claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems`.

## Status policy

`solved` means a proof or counterexample settles the archived statement.
`partially solved` means a named subproblem or major precise subclass is
settled. `open` means the archived question still lacks a proof or
counterexample. Status is derived from the current accepted decision; evidence
maturity (peer reviewed, preprint, withdrawn) and mathematical strength are
recorded separately. See [CONTRIBUTING.md](CONTRIBUTING.md) for the review
rules.
