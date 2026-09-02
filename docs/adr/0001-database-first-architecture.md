# ADR 0001: Database-first product architecture

- Status: Accepted for incremental implementation
- Date: 2026-09-01
- Decision owners: repository maintainers

## Context

Quantum Open Problems publishes researched statements, status assessments, and
evidence in several forms. The current release has three overlapping authoring
surfaces (`open_prob/*/problem.md`, `open_prob/*/metadata.json`, and
`site/data/problems.js`) plus a separate `open_problem_v2/` collection. The
website, static API, research packets, feeds, and MCP server already behave like
views over a database, but no single canonical data contract currently governs
all of them.

That ambiguity makes ordinary updates risky. A change can be correct in one
surface and stale in another, status is stored rather than derived from a
reviewed decision, and the site and MCP server can independently implement
query behavior.

## Decision

Quantum Open Problems is a database-first product. Its core product is a
versioned, evidence-reviewed database of open questions in quantum science.

The system has four boundaries:

1. The canonical store and append-only ledger hold research facts and editorial
   decisions.
2. Domain code validates identities and references and derives current state.
3. The HTTP API is the authoritative machine-readable interface.
4. The website is the human interface, while MCP is an agent-oriented adapter
   over the API.

The intended dependency direction is:

```text
canonical store -> domain/projectors -> HTTP API -> website
                                           `-----> MCP -> AI agent
```

Neither the website nor MCP owns research data or status logic. MCP may combine
multiple API resources into a bounded research context, but every returned fact
must remain traceable to stable API records and revisions.

## Logical database before physical database

The canonical database initially remains Git-backed. JSON records carry typed
objects and relations; Markdown or LaTeX files carry mathematical prose that
benefits from direct editing. Git supplies review history and recoverability,
and the build produces static read models.

A hosted relational database is deferred until concurrent writes, query load,
or review operations create a measured need. Moving storage must not change the
domain identities or public API semantics.

## Canonical objects

The v0.1 read-side contract introduces these objects:

- `Problem`: permanent identity, aliases, taxonomy, collection, and question
  framing;
- `StatementVersion`: immutable mathematical formulation and named target
  clauses;
- `Source`: a paper, dataset, problem list, or reviewed external record;
- `Claim`: a precisely scoped assertion about target clauses;
- `Evidence`: dated support for a claim, with publication maturity and
  mathematical strength kept separate;
- `Decision`: an editorial acceptance or status assessment citing the record
  version and supporting evidence.

Sources are normalized globally and referenced by ID from statements and
evidence. Contextual relationships such as `states-problem` and locators such
as a theorem or page number live on those references, not on the Source object,
and sources are not copied into each problem bundle.

Later write-side revisions add `Artifact`, `Task`, `ResearchTrace`,
`Contribution`, and `Review`. They must follow the same identity and reference
rules rather than being embedded as unversioned prose.

## Identity and version rules

- Canonical IDs are opaque and permanent. The v0.1 slice preserves existing
  published record IDs; a later accession registry may add short `QOP-NNNN`
  identifiers without replacing old IDs or URLs.
- Existing IDs and imported IDs are aliases, never lookup heuristics.
- A statement edit creates a new `StatementVersion` with a
  `supersedesStatementId`; it never mutates an accepted historical version.
- Target clauses have stable IDs within a statement version.
- Claims identify both the statement version and the target clauses they
  address.
- Current status is derived from the sole unsuperseded accepted status
  `Decision`.
- A corrected status decision points to `supersedesDecisionId`; rejected and
  superseded decisions remain in the ledger unchanged.
- Mathematical status (`open`, `partial`, or `solved`) is independent from
  catalog state (`candidate`, `published`, or `archived`).
- Solved records remain addressable after leaving the active index.
- Generated HTML, API JSON, feeds, indexes, and research packets are read
  models, not authoring surfaces.

## Read and write paths

The API exposes complete, versioned resources for generic clients. MCP exposes
task-level tools for interactive agents and calls the same domain/API path.
Batch AI pipelines may call the API directly.

All writes converge on one contribution workflow:

```text
human form / HTTP client / MCP tool
        -> contribution validation
        -> source and scope review
        -> artifact or argument review
        -> editorial decision
        -> canonical ledger event
        -> rebuilt read models
```

An MCP tool cannot directly mark a problem solved or bypass review.

## Incremental migration

The migration uses a compatibility vertical slice rather than a full rewrite.
The first slice contains an open record, a partially solved record, a solved
record, and one `open_problem_v2` import. A projector must reproduce the current
API v1 record and Markdown research packet exactly for active slice records.

Until all records migrate, legacy files remain in place. Compatibility checks
prevent the canonical slice and existing release from drifting. Once the
projector supplies every current read model, the overlapping authoring surfaces
can be retired and `open_problem_v2` can be imported through the same contract.

## Consequences

- Data quality, provenance, versioning, and reviewability take precedence over
  a particular UI or storage engine.
- API and MCP schemas become versioned product contracts.
- Domain behavior is implemented once and reused by all adapters.
- Initial migration adds temporary compatibility checks and some duplicated
  source content; that duplication is removed record by record.
- The project does not require a graph database. Typed relations can be stored
  in JSON now and relational tables later.
