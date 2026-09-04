# Legacy migration

This tool describes the historical seed import. Its source catalogs have
been replaced by the maintained database. Use `npm run export-ledger` from
the repository root for current updates; see
[the catalog integration](../../docs/CATALOG_INTEGRATION.md).

`migrate.ts` performs the one-time ingestion described in section 7 of
[`docs/DESIGN.md`](../../docs/DESIGN.md). It reads the legacy authoring
surfaces and writes a ledger:

| Input | Records |
| --- | --- |
| `site/data/problems.js` | taxonomy; for the 38 active problems: title, summary, importance, remaining, type, keywords, related, progress, watch, interpretation |
| `open_prob/<slug>/problem.md` | title, background, notation and formal statement, status section, bibliography |
| `open_prob/<slug>/metadata.json` | stating source, locator, posed date, audit status, catalog provenance |
| `open_problem_v2/problem_pool_json/*.json` | 55 candidate problems with statements, source attribution, progress items, and references |

Output: `ledger/` (main ledger) and `activity/` (trajectories, artifacts,
comments). Identifiers are deterministic, derived from the legacy slug and
record role, so re-running produces the same files.

```sh
export PATH="$HOME/.local/node/current/bin:$PATH"   # if node is not on PATH
node --experimental-strip-types --no-warnings tools/migrate-legacy/migrate.ts
node --experimental-strip-types --no-warnings contract/src/cli/validate.ts ledger activity
```

## Mapping rules that involve judgement

- A legacy progress entry becomes a `narrows` claim when its strength names
  a subclass, restriction, special case, or counterexample, and a `supports`
  claim otherwise. Single-clause problems never receive `resolves` or
  `refutes` from progress entries, because that would mark the clause
  resolved while the audited status says otherwise.
- A progress entry whose strength is a status review or audit becomes a
  `survey` reference, not a claim.
- A progress entry or watch item about an unaccepted claim becomes its own
  `evidence-import` contribution carrying one `resolves` or `refutes` claim,
  a human review with verdict `rejected`, and a rejected acceptance
  decision. The claim is on record; it never feeds derived state.
- A solved problem's resolving claim is supported by the bibliography
  entries whose first author's surname appears in the status section's
  resolution paragraphs. Where nothing matches, support is left empty for
  maintenance to fill.
- The 20 solved problems have no `problems.js` entry; their motivation is the
  article's background section, their topic is left empty, and their area is
  quantum information, which covers every problem in the three lists.
- `open_problem_v2` problems enter as `candidate` with no review, no
  decision, and no claims. Their source attribution becomes `states-problem`
  references and their progress items become `prior-attempt` references
  carrying the item text. Claims are created at admission review.
- The audit reviews are attributed to a placeholder human actor named
  "Legacy audit editor". Replace it with the real editor's actor when one
  exists; the review dates are the audit dates recorded in the legacy files.
