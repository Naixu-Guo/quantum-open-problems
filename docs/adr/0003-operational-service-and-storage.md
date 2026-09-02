# ADR 0003: Operational service and relational storage

- Status: Accepted, implemented
- Date: 2026-09-02
- Decision owners: repository maintainers

## Context

Community interaction (candidate updates, reviews, comments, moderation,
actors, API keys) needs mutable shared state and authenticated writes. Putting
each interaction through a Git commit would make participation impractical and
would blur the boundary between conversation and reviewed science. ADR 0001
deferred a service until a measured need existed; the write path for external
agents is that need.

## Decision

An operational service under `service/` owns mutable community state. The
canonical catalog stays in Git and is read by the service through the
generated read models; the service never writes to `catalog/`.

Storage is a conventional relational schema on SQLite through Node's built-in
`node:sqlite` module (Node 22.13 or later). Tables:

```text
actors, api_keys, candidate_updates, reviews, comments, events,
idempotency_keys, moderation_actions, meta
```

Why SQLite rather than PostgreSQL now:

- the repository stays dependency-free, so `npm test` and local development
  need no external process;
- the write volume of a research catalog is small and single-node;
- the SQL is plain, and `service/store.mjs` is the only module that touches
  the database, so a PostgreSQL adapter behind the same functions is a
  bounded change when concurrency or hosting requires it.

The service serves the generated static site as well, so one origin can offer
the complete `/api/v1/` surface: canonical read models plus operational
resources. GitHub Pages continues to serve the canonical read models alone.

Abuse resistance is built in rather than bolted on: bearer API keys hashed at
rest, actor roles (`contributor`, `reviewer`, `editor`, `moderator`),
fixed-window rate limits per actor and per client address, `Idempotency-Key`
replay, body size limits, duplicate detection by claim content hash, hidden
and deleted moderation states, actor suspension, and an immutable moderation
log.

## Consequences

- One comment costs one database row, not one Git commit.
- The service can be redeployed or its database rebuilt without touching the
  scientific record; the canonical ledger is re-ingested on start.
- Deployments that publish only the static site remain fully valid; the
  website shows that no community layer is connected.
