> **Historical design.** The current catalog and ledger boundary is documented in
> [`docs/CATALOG_INTEGRATION.md`](docs/CATALOG_INTEGRATION.md). This document describes the legacy static release and its migration plan. The `catalog/` slice it mentions has been removed; its four problems live on as fixtures under `contract/fixtures/`. The process design is
> [`docs/DESIGN.md`](docs/DESIGN.md). This file is kept for the history
> of the decision and as a description of the legacy release that now
> serves as seed data.

# Quantum Open Problems architecture

## Product position

Quantum Open Problems should operate as a research ledger for quantum science. Human readers need a clear statement and evidence history. Agents need stable identifiers, versioned records, bounded context, explicit output contracts, and machine-readable review decisions.

The project should specialize in evidence that generic theorem databases handle poorly:

- mathematical proofs and counterexamples;
- numerical optimization, finite certificates, and code;
- experimental results, calibration records, and datasets;
- physical assumptions, resource models, and implementability limits;
- preprints, withdrawals, corrections, and scope conflicts.

Editors apply one evidence standard to human and AI work. The system records who or what produced each artifact and who checked it.

## Current release

The static release supports more records without requiring a backend:

- every record, active or solved, has a generated page at `/problems/<id>/` with the full statement, evidence, JSON-LD structured data, and citation blocks; active pages link their JSON and Markdown representations, while resolved records keep their page URL and human-readable history (their machine records arrive with Stage 1);
- the browser loads `site/data/catalog-index.js`, a compact discovery index;
- the browser fetches one `api/v1/problems/<id>.json` record when a reader opens a problem;
- `/llms.txt` directs agents to the API, schemas, bulk snapshot, and contribution policy; `/llms-full.txt` carries every research brief in one file;
- `/api/v1/problems.jsonl` supports batch indexing and offline research;
- `/api/v1/release.json` publishes the release date, catalog digest, and record counts as a cheap poll target;
- `/api/v1/evidence.json`, the Atom feed `/feed.xml`, and the JSON feed `/feed.json` expose every dated evidence event with stable content-hash IDs;
- record revision digests cover only research content, so catalog-wide date bumps cannot invalidate contributions to unchanged problems;
- `/sitemap.xml` lists the home page, directory, and every problem page;
- JSON Schemas define problem reads and contribution writes;
- `node site/build.mjs` generates and validates the release;
- pull requests run the same build and reject stale generated files.

GitHub Pages can support about one thousand records with this design. The team should introduce a database after measured query, write, or review limits justify the operational cost.

## Target content graph

Editors should migrate the current article, metadata, and catalog fields into one canonical record per problem. Generated website files must not become authoring surfaces.

| Object | Purpose | Required identity |
| --- | --- | --- |
| `Problem` | Stable research question across revisions | Permanent problem ID |
| `StatementVersion` | Exact objects, hypotheses, quantifiers, target clauses, and resolution criteria | Problem ID plus version |
| `Source` | Paper, problem list, dataset, or official statement | DOI, arXiv version, or stable source ID |
| `Claim` | Result that supports, narrows, refutes, or resolves a target clause | Claim ID and statement version |
| `Evidence` | Publication or check that supports a claim assessment | Evidence ID and source locator |
| `Artifact` | Code, proof file, certificate, dataset, notebook, or experiment log | URI plus content digest |
| `Task` | Bounded next action with an acceptance test | Task ID and target clause |
| `ResearchTrace` | Reusable outcome from one human or agent research run | Trace ID, task ID, actor IDs, and artifact IDs |
| `Review` | Independent scope, source, argument, or reproduction check | Review ID and contribution version |
| `Decision` | Editorial acceptance, rejection, correction, or status change | Decision ID and cited reviews |

Objects use typed relations such as `supports`, `refutes`, `narrows`, `depends_on`, `duplicates`, and `supersedes`. Editors retain rejected, withdrawn, failed, and superseded work because later researchers need that history.

## Research frontier

A flat progress timeline cannot show which part of a statement remains open. Each `StatementVersion` should contain named target clauses. A contribution must identify the clauses it addresses, its hypotheses, and its exact scope.

The site then presents a research frontier:

- accepted claims and the clauses they cover;
- unresolved clauses and documented blockers;
- conflicting evidence and pending reviews;
- computation-ready or experiment-ready tasks;
- failed routes with conditions that would justify another attempt.

Editors approve status changes. Accepted claims and decisions supply the audit trail for that approval.

## Contribution and review flow

GitHub Issues remain an inbox during the static phase. They must not serve as database records or stable identifiers.

```text
submission envelope
→ automated schema and reference checks
→ editor triage
→ scope and source review
→ argument or artifact reproduction
→ editorial decision
→ generated catalog update
```

The contribution envelope records:

- problem and statement version;
- exact claim, hypotheses, and target clauses;
- evidence and artifact URIs with locators or digests;
- remaining gap and proposed status effect;
- human contributors, agent runs, operators, and verifiers;
- external GitHub references without using an Issue number as the primary key.

Full or partial resolutions require independent domain review. Computational and experimental claims require an artifact check. AI reviews can assist editors; they should not satisfy the initial human review quorum.

## Agent interface

Agents can discover problems, read formal statements and references, and inspect
accepted claims through the research service's HTTP API. The MCP adapter forwards
to that API; its data comes from the maintained catalog's ledger projection and
subsequent service activity. Search includes the current formal statement and
clauses, without indexing superseded statement text.

`mcp/src/server.ts` provides local stdio and `mcp/src/http-server.ts` provides
Streamable HTTP. Both use the official MCP SDK and share input validation, output
schemas, structured results, and resource links. Public HTTP and anonymous stdio
expose read tools such as `search_problems`, `get_problem`, `get_frontier`,
`list_references`, and `build_context`. Configuring an operator-issued API key
enables local Work and Write tools for trajectories, artifacts, contributions,
comments, and reviews; the service enforces authentication and permissions.
Setup and the full tool list are in the [MCP guide](mcp/README.md).

`build_context` accepts a problem, optional current clause references, and an
approximate section-text budget. It prioritizes authoritative status and complete
formal material, omitting whole sections when necessary. Completeness flags and
`minimumRequiredTokens` make omissions explicit. The bundle records statement
version, status source, source revisions and digests, and which records appear in
retained sections. Its `bundleId` hashes the delivered payload and provenance.
Resource links resolve current revisions when read; they do not pin the historical
revisions recorded in a bundle. The budget excludes response metadata outside
section text and transport framing
and is not a model-specific token count.

Research trajectories retain the starting bundle ID, work events, costs, and
artifacts. Write tools accept optional idempotency keys; recovery from a lost
response requires the same key and identical payload. The adapter does not
automatically retry writes. Review-queue lookup is a peek, without reservation.
The platform should not request private chain-of-thought.

Search supports version-bound, query-bound pagination cursors; legacy offsets
remain available. `read_problem` selects a complete content category, using
version-bound continuation only when the category exceeds the response budget.
Resources pinned to historical revisions and resource-update subscriptions
remain future work; current resource links resolve the latest revision.

## Migration stages

### Stage 0: scalable static reads

This release provides the compact browser index, lazy detail records, API v1, JSONL snapshot, `llms.txt`, shared schemas, one build command, and pull-request validation.

### Stage 1: canonical records and evidence events

Delivered: generated `/problems/<id>/` pages for active and solved records, the evidence log with stable event IDs, Atom and JSON feeds, the release manifest, the sitemap, content-scoped revision digests, and full-catalog text exports.

Canonical migration has started with the contract and compatibility slice under
`catalog/`. The slice models Problem, StatementVersion, Source, Claim,
Evidence, and Decision objects and must reproduce existing API v1 records and
research packets for its active examples. It is not yet the authoring source
for the full release; ADR 0001 defines the migration boundary.

Before the catalog reaches roughly 100 active records:

- move each problem into one canonical `record.json` plus statement Markdown, retiring the three overlapping authoring surfaces (`problems.js`, `metadata.json`, `problem.md`);
- assign short permanent accession IDs such as `QOP-0042` and keep every existing long ID as a stable alias;
- add statement versions with named target clauses, so a contribution can state exactly which clause it addresses;
- convert embedded progress items into an append-only event ledger (`changes.jsonl`) whose entries survive edits and reordering; the current evidence log is a snapshot, not a ledger;
- extend API records and research packets to solved records so resolution evidence is machine-readable;
- publish a compact lexical search index if client-side filtering degrades.

### Stage 2: contributor operations

As review volume grows:

- align the issue forms with the contribution schema so both lanes round-trip one submission format, and let agents submit schema-valid JSON through pull requests that CI validates;
- make the published JSON Schemas strict and validate every generated record against them in CI;
- convert accepted Issue submissions into contribution records and pull requests;
- add actor, claim, artifact, review, and decision ledgers;
- assign field editors and conflict-of-interest rules;
- publish task queues and contribution credit;
- add artifact storage only when repository links cannot support reproducibility.

### Stage 3: service layer

Add a database, authenticated API, search service, and MCP writes after static generation or GitHub review becomes a measured bottleneck. The database should index canonical events; it should not create a second source of truth.

## Decisions to defer

The project should defer vector search until query logs expose lexical-search failures. It should defer agent reputation scores until reviewers have enough accepted and rejected work to measure reliability. It should also defer autonomous status changes: an agent may propose a decision, while an editor remains accountable for publication.
