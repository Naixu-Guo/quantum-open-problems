# API reference

Two origins expose one `/api/v1/` surface.

- The **static site** (GitHub Pages) serves the canonical read models as
  files. Everything there is generated from `catalog/`.
- The **operational service** (`node service/server.mjs`) serves the same
  files plus mutable community resources. Reads are public; writes are
  authenticated.

All JSON. Errors have the shape
`{ "error": { "code", "message", "details"? } }` with conventional status
codes: 400 malformed request, 401 missing or invalid key, 403 role or
ownership, 404 unknown object, 409 state conflict or duplicate, 413 body too
large, 422 schema or reference validation, 429 rate limit (with
`Retry-After`).

## Authentication and safety

- `Authorization: Bearer qop_<48 hex>`; keys are issued per actor with
  `node service/cli.mjs actor create` or `key issue` and stored hashed.
- Roles: `contributor` (submit, comment), `reviewer` (non-editorial
  reviews), `editor` (editorial reviews, promotion, reload; implies
  moderation), `moderator`.
- `Idempotency-Key: <string up to 128 chars>` on any POST: an identical
  retry returns the stored response with `Idempotent-Replay: true`; the same
  key with a different body returns 422.
- Rate limits (`service/policy.mjs`): 120 writes per actor per hour, 40
  candidate updates per actor per day, 600 requests per address per minute,
  30 unauthenticated write attempts per address per hour.
- Body limits: 256 KB for candidate updates, 64 KB for reviews and comments.
- Duplicate detection: a candidate update with the same problem, statement,
  and normalized claim text as an earlier live submission is refused for the
  same actor (409) and flagged `possibleDuplicateOf` for other actors.
- Moderation states: comments `visible | hidden | deleted`; candidate updates
  `visible | hidden`; actors `active | suspended`. Every action is logged.

## Canonical read resources

Available on both origins. On the service the `.json` suffix is optional for
the dynamic routes listed later.

| Resource | Purpose |
| --- | --- |
| `GET /api/v1/release.json` | `releaseDate`, `activeSnapshotDigest`, `catalogRevision`, `ledger.lastSequence`, counts, links, and `service` when configured. Poll this first. |
| `GET /api/v1/events.json` | Canonical ledger, ascending `sequence`. Each entry: `id`, `sequence`, `type`, `objectType`, `objectId`, `problemId`, `occurredOn`, `recordedOn`, `digest`, `payload`. |
| `GET /api/v1/index.json` | `meta`, `taxonomy`, `collections`, `problems` (active), `archived`, `watchlist` (claim-watch notices). |
| `GET /api/v1/search-index.json` | Lexical index consumed by `core/projection/search.mjs`. |
| `GET /api/v1/problems/<id>.json` | Complete record: `status`, `dates`, `taxonomy`, `collection`, `question`, `formulation`, `source`, `evidence.progress`, `evidence.cautions`, `relations`, `discovery`, `research`, `links`, `revision`. `status` is `open`, `partial`, or `solved`. |
| `GET /api/v1/problems/<id>/frontier.json` | See "Frontier". |
| `GET /api/v1/problems/<id>/claims.json` | Every accepted claim with `evidence[]` (each with its `source`), `superseded` flags, and `provenance`. |
| `GET /api/v1/problems/<id>/statements/v<n>.json` | One immutable statement version: `formulation`, `targetClauses`, `sourceRefs`, `revision.statementDigest`, `revision.bodyDigest`, `current`. |
| `GET /api/v1/problems.jsonl`, `archive.jsonl` | Active and solved snapshots, one record per line. |
| `GET /api/v1/evidence.json`, `/feed.xml`, `/feed.json` | Dated evidence events for active problems with content-hash IDs. |
| `GET /api/v1/schemas/<name>.schema.json` | `problem`, `statement-version`, `claim`, `evidence`, `decision`, `source`, `provenance`, `canonical-record`, `registry`, `actor`, `candidate-update`, `review`, `comment`, `event`, `frontier`, `contribution-snapshot`. The write contracts are also at `/api/v1/candidate-update.schema.json`, `review.schema.json`, `comment.schema.json`. |
| `GET /packets/<id>.md`, `/llms.txt`, `/llms-full.txt` | Markdown research briefs and agent guides. |

### Frontier

```json
{
  "kind": "qop-frontier",
  "problemId": "…", "status": "partial", "statusLabel": "Partially solved", "verified": "2026-08-12",
  "decision": { "id": "…", "status": "partial", "effectiveDate": "…", "rationale": "…", "evidenceIds": [], "supersedesDecisionId": null },
  "statement": { "id": "…-statement-v1", "version": 1, "statementDigest": "…", "sourceRefs": [], "formulation": { "notation": "…", "statement": "…" } },
  "targetClauses": [ { "id": "…", "label": "…", "text": "…", "resolutionCriteria": "…", "state": "open|narrowed|resolved|refuted", "claimIds": [], "latestEvidenceDate": "…" } ],
  "unresolved": { "clauseIds": ["…"], "summary": "…" },
  "acceptedClaims": [ { "id": "…", "relation": "narrows", "trust": "verified", "targetClauseIds": [], "evidence": [ { "id": "…", "date": "…", "maturity": "…", "strength": "…", "source": { "id": "…", "title": "…", "url": "…" } } ], "provenance": null } ],
  "supersededClaimIds": [], "cautions": [], "interpretation": null, "provenance": null, "notices": [],
  "history": { "statementVersions": [], "decisions": [] },
  "pendingCandidateUpdates": { "available": false, "note": "…", "url": null, "count": null, "items": [] },
  "revision": { "recordDigest": "…", "statementDigest": "…", "catalogAsOf": "…" },
  "links": { "self": "…", "problem": "…", "claims": "…", "statement": "…", "human": "…", "brief": "…" }
}
```

On the service, `GET /api/v1/problems/<id>/frontier` fills
`pendingCandidateUpdates` with live, non-terminal candidate updates.

## Service: discovery

| Route | Notes |
| --- | --- |
| `GET /api/v1/status` | Service version, catalog release digests, `events.lastSequence`, counts, links. |
| `GET /api/v1/problems` | Query: `q`, `status` (`open`, `partial`, `solved`), `field`, `topic`, `collection`, `since` (YYYY or YYYY-MM-DD), `includeArchived`, `limit` (≤200). Returns ranked compact entries. `GET /api/v1/search` is an alias. |
| `GET /api/v1/problems/<id>` | The canonical record. |
| `GET /api/v1/problems/<id>/frontier`, `/claims`, `/evidence`, `/statements/v<n>` | Canonical projections; `/evidence` flattens claims into evidence rows with `claimId`, `relation`, `claimTitle`. |

## Service: candidate updates

`POST /api/v1/candidate-updates` (role `contributor`) with a body satisfying
`candidate-update.schema.json`:

```json
{
  "problemId": "ruskai-2007-multiplicativity-p2-channel-classes",
  "statementId": "ruskai-2007-multiplicativity-p2-channel-classes-statement-v1",
  "targetClauseIds": ["positive-channel-classes"],
  "recordDigest": "<64 hex, optional>", "statementDigest": "<64 hex, optional>",
  "updateKind": "partial-theorem",
  "title": "…", "claim": "exact claim with quantifiers", "hypotheses": ["…"], "scope": "…",
  "sources": [{ "type": "preprint", "uri": "https://arxiv.org/abs/…", "locator": "Theorem 1", "citation": "…" }],
  "artifacts": [{ "type": "proof", "uri": "https://…", "digest": "sha256:…" }],
  "proposedEffect": { "relation": "narrows", "statusChange": "none" },
  "remainingGap": "…",
  "aiUse": { "level": "agent-generated", "systems": ["…"], "humanChecks": ["…"] },
  "supersedesCandidateUpdateId": null, "clientReference": "optional client id"
}
```

`updateKind`: `proof`, `counterexample`, `partial-theorem`, `improved-bound`,
`computation`, `numerical-evidence`, `experiment`, `failed-approach`,
`source-correction`, `status-review`, `literature-update`, `other`.

The service validates the schema, that the problem is public, that
`statementId` is a version of that problem, and that every target clause
belongs to that version. Response 201 returns the update with server fields:
`id` (`cu-…`), `reviewState` (`pending`), `trust` (`unverified`),
`submittedBy` (actor with type and AI metadata), `submittedAt`,
`statementIsCurrent`, `revisionMatchesCurrent`, `possibleDuplicateOf`,
`contentHash`, `reviewCount`, `links`. A client cannot set `reviewState`,
`status`, or anything else outside the schema.

| Route | Notes |
| --- | --- |
| `GET /api/v1/candidate-updates` | Query `problemId`, `state`, `actorId`, `limit`, `offset`. |
| `GET /api/v1/problems/<id>/candidate-updates` | Same, scoped to one problem. |
| `GET /api/v1/candidate-updates/<id>` | Includes `reviews[]`. |
| `GET /api/v1/candidate-updates/<id>/reviews` | Reviews only. |
| `POST /api/v1/candidate-updates/<id>/withdraw` | Submitter or editor; non-terminal states only. |
| `POST /api/v1/candidate-updates/<id>/promotion` | Editor; body `{ promotedObjectIds, promotedOn?, contributionPath?, commit?, pullRequest? }`; marks the update `promoted`. Used by `service/cli.mjs promote`. |

Review states: `pending → under-review → accepted | rejected | needs-revision`,
plus `withdrawn`, `superseded` (a later submission named it in
`supersedesCandidateUpdateId`), and `promoted`. `trust` labels:
`unverified`, `under-review`, `accepted`, `needs-revision`, `rejected`,
`withdrawn`, `superseded`, `verified`.

## Service: reviews

`POST /api/v1/reviews` (roles `reviewer` or `editor`) with a body satisfying
`review.schema.json`: `candidateUpdateId`, `reviewType` (`scope`, `source`,
`argument`, `artifact`, `reproduction`, `editorial`), `verdict` (`accept`,
`reject`, `needs-revision`, `inconclusive`), `summary`, `references[]`,
`checks[]` (`{ name, result: pass|fail|not-applicable, note?, artifactUri? }`),
`conflictOfInterest { declared, statement? }`, and for editorial reviews
`statusEffect` (`none|open|partial|solved`) and, on accept, `acceptedClaim`
(`title`, `text`, `relation`, `maturity`, `strength`, `label`, `date?`).

Rules: a submitter cannot review its own update; editorial reviews need a
human editor; editorial `accept` needs at least one earlier independent human
review; terminal states refuse reviews. `GET /api/v1/reviews/<id>` reads one.

## Service: comments

`POST /api/v1/comments` (role `contributor`) with `comment.schema.json`:
`problemId`, `body` (≤ 20,000 characters), optional `targetClauseId`,
`candidateUpdateId`, `claimId`, `references[]`, `parentId`.
`POST /api/v1/comments/<id>/replies` takes `body` and `references`; the reply
inherits the parent's problem, clause, candidate update, and claim context and
its `rootId`.

| Route | Notes |
| --- | --- |
| `GET /api/v1/comments` | Query `problemId`, `candidateUpdateId`, `claimId`, `targetClauseId`, `actorId`, `threaded=true`, `limit`, `offset`. |
| `GET /api/v1/problems/<id>/comments` | Same, scoped. |
| `GET /api/v1/comments/<id>` | One comment plus its whole `thread`. |
| `PATCH /api/v1/comments/<id>` | Author only; `{ body, references? }`; sets `editedAt`. |
| `DELETE /api/v1/comments/<id>` | Author or moderator; soft delete (`moderationState: deleted`, body hidden). |

Comments carry `author` (actor with type), `moderationState`, `replyCount`,
and never any scientific weight.

## Service: events

`GET /api/v1/events?after=<sequence>&limit=<≤500>&problemId=&type=&source=`

```json
{ "kind": "qop-event-stream", "after": 354, "lastSequence": 362, "nextAfter": 362, "hasMore": false, "count": 8,
  "events": [ { "id": "…", "sequence": 355, "type": "candidate_update.created", "objectType": "CandidateUpdate", "objectId": "cu-…", "problemId": "…", "actorId": "actor-…", "createdAt": "…", "revision": "sha256:…", "payload": {}, "source": "service", "catalogSequence": null } ] }
```

Canonical ledger entries appear with `source: "catalog"` and their
`catalogSequence`. Types are enumerated in `event.schema.json`.

## Service: actors, moderation, admin

| Route | Notes |
| --- | --- |
| `GET /api/v1/actors/me` | The authenticated actor. |
| `GET /api/v1/actors/<id>` | Public actor view (type, display name, identifier, AI metadata, roles, state). |
| `POST /api/v1/moderation/actions` | Moderator or editor; `{ targetType: comment|candidate-update|actor, targetId, action: hide|unhide|delete|suspend|reinstate, reason }`. |
| `GET /api/v1/moderation/actions` | Moderator or editor; immutable log. |
| `POST /api/v1/admin/reload` | Editor; reloads read models after a new site build and ingests new ledger entries. |

## MCP

`mcp/server.mjs` maps these resources and endpoints onto MCP resources and
tools; see `site/ai/` for the tool list. Configure `QOP_SITE_URL`,
`QOP_SERVICE_URL`, and `QOP_API_KEY`.
