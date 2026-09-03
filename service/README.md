# Domain service

The domain service is the only writer of the ledger. It turns a batch of
new records into files, validates the whole ledger with the contract
validator, commits or rolls back as a unit, issues the automatic decisions
the policy allows, and rebuilds the SQLite index that the read API serves.
See [`docs/DESIGN.md`](../docs/DESIGN.md) sections 2, 3.5, 4.1, and 5.2.

No dependencies beyond Node 22.13 or later: the index uses `node:sqlite`,
the API uses `node:http`, and the contract package supplies schema
validation and derived state through relative imports.

## Modules

| Module | Role |
| --- | --- |
| `src/ledger-repo.ts` | The ledger on disk. Schema-checks each new record, places it by the contract layout rules inside its root, writes, validates, commits only the batch with the actor as git author, and rolls back on any issue or git failure. Computes sequence numbers from first-parent commit order. |
| `src/index.ts` | The SQLite index: every record revision with its sequence, plus derived problem, clause, and contribution tables. Rebuilt from the ledger; never a source of truth. |
| `src/acceptance.ts` | The automatic decisions: acceptance from the reviews on file against the policy thresholds, the admission and status decisions that follow. Never marks a primary problem solved. |
| `src/write.ts` | The write path: submit a batch for an actor, run the automatic decisions, reindex. |
| `src/read-models.ts` | Problem view, frontier, decomposition tree, attempts, contribution view, status, event stream. |
| `src/api.ts` | The HTTP read API. |
| `src/service.ts`, `src/config.ts`, `src/cli.ts` | Assembly, configuration from the environment, command line. |

## Commands

```sh
export PATH="$HOME/.local/node/current/bin:$PATH"   # if node is not on PATH
cd service
npm run rebuild                                       # index ledger/ and activity/ into service/data/index.sqlite
npm run serve                                         # read API on http://localhost:8787/api/v1/status
node --experimental-strip-types src/cli.ts submit <actorId> batch.json "message"
node --experimental-strip-types src/cli.ts decide     # run the automatic decisions once
npm test
npm run typecheck
```

Environment: `QOP_LEDGER_DIR`, `QOP_ACTIVITY_DIR`, `QOP_CONTRACT_DIR`,
`QOP_DB_PATH`, `QOP_PORT`, and `QOP_COMMIT=0` to write files without
committing.

## Read API

| Route | Returns |
| --- | --- |
| `GET /api/v1/status` | Policy version, `lastSequence`, record counts, published problems by status, candidates, last release |
| `GET /api/v1/policy` | The current policy header |
| `GET /api/v1/schemas/<name>` | A contract schema |
| `GET /api/v1/problems?status=&area=&topic=&difficulty=&text=&limit=&includeCandidates=&sort=` | Indexed problems with `lastActivity` and `lastHumanReview`; `sort=stale` is the maintenance backlog, never-reviewed first, then oldest human review first |
| `GET /api/v1/problems/<id or alias>` | Problem with current statement and clause statuses, references with notes, comments, decision chain |
| `GET /api/v1/problems/<id>/frontier` | Clauses with status, accepted claims, best bounds, decomposition tree, routes tried, pending contributions, `lastActivity`, `lastHumanReview` |
| `GET /api/v1/problems/<id>/tree` | The decomposition tree alone |
| `GET /api/v1/problems/<id>/attempts` | Attempt reports with state and currency |
| `GET /api/v1/contributions/<id>` | A contribution with its reviews, decisions, claims, state, and verification level |
| `GET /api/v1/records/<id>` | Any record's current revision |
| `GET /api/v1/events?after=<sequence>&limit=&type=` | Records that entered the ledger after a sequence |

The authenticated write endpoints, the MCP adapter, and the API payload
schemas follow in later changes; writes today go through `submit` in
`src/write.ts` and the `submit` command.

## Automatic decisions

After each committed write the service looks at every contribution without
an acceptance decision:

- a review with a negative verdict rejects it;
- a human verification review accepts it at `human-signed`;
- an artifact with a passing check accepts it at `machine-verified`;
- the number of independent AI verification reviews the policy asks for,
  from distinct model families and operators (two for admission and
  results, one for attempt reports), accepts it at `ai-verified`;
- one review of any kind with a non-negative verdict accepts a reference or
  entity revision at `reviewed`;
- an entity revision by a human editor, or a reference by a human with a
  prior accepted contribution, is accepted at `unreviewed` on submission.

Independence is computed from actor records, not taken from a review's
flags; a review that another review supersedes does not count. Status
changes need the policy's status bar (the `aiVerified` row for `partial`,
the `auxiliaryStatus` row for an auxiliary `solved` or `refuted`), and a new
status decision supersedes the previous one.

An accepted proposal or attempt report admits the problems it introduced.
Accepted claims move an open problem to `partial`, and an auxiliary problem
to `solved` or `refuted`, by system decision. A primary problem's `solved`
waits for a human editor.
