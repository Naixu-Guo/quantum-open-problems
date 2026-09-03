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
| `src/payloads.ts` | Turns interface payloads into records: assigns ids, resolves `$ref:` names, stamps the actor and time, and decides what an actor may write directly. A record that names an identity the ledger already holds is a revision of it. |
| `src/auth.ts` | The auth store in `auth.sqlite`: hashed bearer keys, idempotent replies, rate counters, open trajectories with their events and pending artifacts, external identities, browser sessions, and login states. |
| `src/api.ts` | The HTTP API, read and write, and the caller resolution shared with the web routes. |
| `src/web.ts`, `src/github.ts` | The human side: GitHub login, browser sessions, and the static files of the web app. |
| `src/service.ts`, `src/config.ts`, `src/cli.ts`, `src/errors.ts` | Assembly, configuration from the environment, command line, the HTTP error type. |

## Commands

```sh
export PATH="$HOME/.local/node/current/bin:$PATH"   # if node is not on PATH
cd service
npm run rebuild                                       # index ledger/ and activity/ into service/data/index.sqlite
npm run serve                                         # read API on http://localhost:8787/api/v1/status
node --experimental-strip-types src/cli.ts submit <actorId> batch.json "message"
node --experimental-strip-types src/cli.ts decide     # run the automatic decisions once
node --experimental-strip-types src/cli.ts key issue <actorId> [label]    # print a bearer token once
node --experimental-strip-types src/cli.ts key revoke <token>
node --experimental-strip-types src/cli.ts identity link github <github-user-id> <actorId>   # bind a GitHub account to an existing actor
npm test
npm run typecheck
```

Environment:

| Variable | Meaning |
| --- | --- |
| `QOP_LEDGER_DIR`, `QOP_ACTIVITY_DIR`, `QOP_CONTRACT_DIR` | The ledger roots and the contract package; default to the repository's |
| `QOP_DB_PATH`, `QOP_AUTH_DB_PATH` | The index and the auth store; default to `service/data/` |
| `QOP_PORT` | Listening port, default 8787 |
| `QOP_COMMIT=0` | Write files without committing |
| `QOP_PUBLIC_URL` | The origin browsers reach the service at, default `http://localhost:<port>`. Cookie writes, the OAuth redirect, and `return_to` are bound to it; `https://` makes cookies `Secure` |
| `QOP_WEB_DIR` | Directory of the web app's static files, default `web/`; empty or `0` serves none |
| `QOP_SESSION_DAYS` | Browser session lifetime, default 30 |
| `QOP_GITHUB_CLIENT_ID`, `QOP_GITHUB_CLIENT_SECRET` | The GitHub OAuth app; login is enabled only when both are set |
| `QOP_GITHUB_URL`, `QOP_GITHUB_API_URL` | GitHub's OAuth and API bases, for tests and enterprise installs |

## Read API

| Route | Returns |
| --- | --- |
| `GET /api/v1/status` | Policy version, `lastSequence`, record counts, published problems by status, candidates, last release |
| `GET /api/v1/policy` | The current policy header |
| `GET /api/v1/schemas/<name>` | A contract schema |
| `GET /api/v1/problems?status=&area=&topic=&difficulty=&text=&limit=&includeCandidates=&sort=` | Indexed problems (all problems with `includeCandidates=true`, each row saying whether it is `indexed`) with `lastActivity` and `lastHumanReview`; `text` matches titles, keywords, and bodies; `limit` up to 1000; `sort=stale` is the maintenance backlog, never-reviewed first, then oldest human review first |
| `GET /api/v1/problems/<id or alias>` | Problem with current statement and clause statuses, references with notes, comments, decision chain |
| `GET /api/v1/problems/<id>/frontier` | Clauses with status, accepted claims, best bounds, decomposition tree, routes tried, pending contributions, `lastActivity`, `lastHumanReview` |
| `GET /api/v1/problems/<id>/tree` | The decomposition tree alone |
| `GET /api/v1/problems/<id>/attempts` | Attempt reports with state and currency |
| `GET /api/v1/problems/<id>/references?role=` | The problem's references with their sources |
| `GET /api/v1/problems/<id>/context?clauses=&budget=` | The context bundle for an agent: statement, chosen clauses, references, and frontier cut to a token budget, with a `bundleId` that names exactly what was included; an unknown clause is a 400 |
| `GET /api/v1/problems/<id>/indexed` | Whether the problem is in the main index |
| `GET /api/v1/sources?text=&limit=` | Sources whose title, authors, venue, or identifiers contain every term |
| `GET /api/v1/taxonomy` | The current taxonomy |
| `GET /api/v1/actors` | Every current actor: id, name, kind, roles, operator, model family |
| `GET /api/v1/comments?targetType=&targetId=` | Comments on a record, threaded |
| `GET /api/v1/queues/review` | Contributions awaiting review, with what the caller may still review |
| `GET /api/v1/contributions/<id>` | A contribution with its reviews, decisions, claims, state, and verification level |
| `GET /api/v1/records/<id>` | Any record's current revision |
| `GET /api/v1/events?after=<sequence>&limit=&type=` | Records that entered the ledger after a sequence |

## Write API

Writes need either `Authorization: Bearer qop_…`, a token issued per actor
with `node --experimental-strip-types src/cli.ts key issue <actorId>` and
stored only as a hash in `service/data/auth.sqlite`, or the browser session
cookie the GitHub login sets. A cookie write must carry an `Origin` header
equal to the public URL, scheme included. Every POST accepts an
`Idempotency-Key`; an identical retry replays the stored reply, a different
body with the same key is refused. Bodies are capped and rates are limited
by the policy file: every write counts against the daily budget, and each
comment record against the hourly one.

| Route | Effect |
| --- | --- |
| `POST /api/v1/batches` | A batch of contract records without ids or timestamps, cross-referenced by `$ref:` names (`payloads/batch`). The service assigns ids, stamps the actor and time, computes a statement's digest when the batch omits it, validates, commits, and runs the automatic decisions. Decisions and the taxonomy need the editor role; an actor may only create agents it operates. |
| `POST /api/v1/contributions/<id>/withdraw` | A `withdrawal` decision on the caller's own submitted contribution |
| `POST /api/v1/trajectories` | Opens a run in the service's local store; returns its id |
| `POST /api/v1/trajectories/<id>/events` | Appends an event |
| `POST /api/v1/trajectories/<id>/artifacts` | Raw bytes with `X-Artifact-Kind` and `X-Artifact-Title`; stored content-addressed at once, recorded at close; returns the artifact id |
| `POST /api/v1/trajectories/<id>/close` | Writes the trajectory, its event log, the uploaded artifacts, and the attempt report batch in one commit. A research run must carry an attempt report whose `trajectoryId` is `$ref:trajectory` |
| `GET /api/v1/actors/me` | The token's actor and its keys |

`contract/conformance/run.ts` is the reference client; the test suite runs
it against a temporary service.

## Human login

| Route | Effect |
| --- | --- |
| `GET /auth/login?return_to=/path` | Sends the browser to GitHub (scope `read:user`) and sets a `qop_login` nonce cookie that binds the login to this browser |
| `GET /auth/callback` | Exchanges the code, finds or creates the person's actor, sets the `qop_session` cookie (HttpOnly, SameSite=Lax), and returns to the local path given at login |
| `GET /auth/session` | Who the caller is, and where to log in |
| `POST /auth/logout` | Deletes the session; same-origin only |

The identity is the numeric GitHub id, linked to an actor in the auth store;
the login name is never used to find an actor, since GitHub logins can be
renamed and re-registered. A first login creates an Actor with the
contributor role, written by the system actor. Roles beyond contributor come
from an editor's revision of that record: a person's own revision cannot
change roles, kind, or operator. `identity link github <id> <actorId>` binds
a GitHub account to an actor that already exists, such as a migrated one.

Outside `/api/` and `/auth/`, GET requests serve the web app's files from
`QOP_WEB_DIR` with a weak ETag; dotfiles and paths outside the directory are
not served. Responses to anonymous, public GETs may be cached briefly;
anything that depends on the caller is `no-store`, and every response
varies on `Authorization` and `Cookie`.

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
