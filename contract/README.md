# Contract package

The contract package is the boundary between the Quantum Open Problems
ledger and everything that reads or writes it: the domain service, the web
app, the MCP server, and agents built elsewhere. It contains no service
code. See [`docs/DESIGN.md`](../docs/DESIGN.md) for the design it
implements.

## Contents

| Path | What it is |
| --- | --- |
| `policy/v1.md` | Policy version 1: every vocabulary value with a one-line definition, verification thresholds, independence rules, rate limits. |
| `schema/common.schema.json` | Shared definitions: identifiers, timestamps, digests, base fields, embedded value types. |
| `schema/<type>.schema.json` | One JSON Schema (draft 2020-12) per record type. Thirteen types. |
| `schema/tombstone.schema.json` | The shape a redacted record file takes. |
| `src/record.ts` | Record file format: YAML header plus Markdown body. |
| `src/digest.ts` | Statement and artifact digest rules. |
| `src/types/<type>.ts` | One module per type: its TypeScript shape, outgoing references, and type-specific rules. |
| `src/targets.ts` | Which target types each record type may point at. |
| `src/ledger.ts` | Loads a ledger tree into typed records. |
| `src/validate.ts` | Full-ledger validation: schema, identity, references, layout, digests, decision rules. |
| `src/derive.ts` | Derived state from decisions: problem status, catalog state, contribution state, clause status, index membership. |
| `src/cli/validate.ts` | Command line entry point. |
| `fixtures/ledger/` | A sample main ledger: four real problems migrated from the legacy catalog and one synthetic problem that exercises decomposition, attempts, reviews, and automatic acceptance. |
| `fixtures/activity/` | The matching sample of the second repository: trajectories and comments. |
| `test/` | Tests that the fixtures validate, that every vocabulary value is defined in the policy, and that derived state matches expectations. |

## Record file format

Every record is one file. A YAML header between `---` lines carries the
typed fields; the Markdown that follows is the record's `body`.

```markdown
---
id: 01K4BDR0Z4M8S9V0YQ7X2H3N6P
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01K4BDR0Z4M8S9V0YQ7X2H3N5A
createdAt: 2026-09-02T10:00:00Z
title: Qubit bi-negativity
role: primary
…
---
The source asked whether …
```

Research statuses are exactly `Solved` and `Unsolved`. Authoritative catalog imports carry `Problem.authoredCatalog`; this records the authored status without inventing reviews or claims. Its `sourcePath` points to the maintained JSON record, and an optional `record` preserves all original keys. Normal API revisions must preserve this snapshot. Independent topic classifications use `Taxonomy.independentTopics: true` and nullable topic `areaId`.

Identifiers are ULIDs. Problems also accept original `op_…` IDs and human-readable slugs as aliases. A clause is addressed as `<statementId>#<clauseId>`.
Digests are `sha256:<hex>`.

## Commands

```sh
npm install
npm run validate      # validates fixtures/ledger and fixtures/activity
npm test
```

`src/cli/validate.ts` accepts any number of ledger roots; the first is the
main ledger, the rest are activity repositories. It prints counts and
derived state, and exits non-zero on the first category of failure.

## Versioning

The package version is the contract version. A change to any schema,
vocabulary, layout rule, or derivation is a contract change and bumps the
version; every record carries the `schemaVersion` it was written under.
