# Use the MCP server

Connect your assistant directly to the hosted catalog to search open problems,
read statements and references, and assemble research context. Public reads
require no repository download, Node.js installation, account, or API key.

## Connect over HTTP

In a client that supports remote MCP, add a server with:

| Setting | Value |
| --- | --- |
| Name | `quantum-open-problems` |
| Server URL | `https://api.qiqc-op.com/mcp` |
| Transport | Streamable HTTP |
| Authentication | None for public reads |

Save or enable the connection. For clients that accept URL entries in an
`mcpServers` configuration:

```json
{
  "mcpServers": {
    "quantum-open-problems": {
      "url": "https://api.qiqc-op.com/mcp"
    }
  }
}
```

Some clients use a settings form or another configuration format. Use the same
URL and the remote HTTP transport supported by that client.

Try asking: “Use the quantum-open-problems MCP to find unsolved problems about
quantum channel capacity, then summarize one problem's known progress and
references.” The tools include `search_problems`, `sample_problem`, `get_problem`, `read_problem`,
`list_references`, and `build_context`.

Newly published records become available through the existing connection when
the hosted API imports the catalog update. The HTTP endpoint uses the official
MCP SDK and supports both the 2026 protocol and legacy Streamable HTTP clients.
Legacy sessions expire after 15 idle minutes. At the session limit, the oldest
idle session can be reclaimed for a new connection; active requests and sessions
still initializing are protected. Clients reinitialize after a session 404.
It exposes the Read tools and resources below. Authenticated research writes
are not enabled on the public deployment. The optional local adapter supports
them on a deployment whose operator has provisioned editors, keys, and Git sync.

`get_taxonomy` lists available labels and slugs. `search_problems` accepts either
case-insensitively, for example `area: "Quantum Communication"` and
`topic: "Private capacity"`. An unknown taxonomy name returns an error.
Search returns `total` matching records, `count` rows on this page (50 by default),
`catalogVersion`, `nextCursor`, and legacy `nextOffset`. Prefer repeating the same
filters and sort with `cursor: nextCursor`, without an offset. Cursors expire after
one hour; changes to the catalog return `catalog_changed` (409), requiring a fresh
query. This detects changes rather than retaining a historical snapshot. Empty,
tampered, expired, and mismatched cursors are errors. Legacy offsets remain supported.

Search defaults to `view: "summary"`. Request `view: "research"` to retrieve full
research details for a filtered set without first collecting IDs and issuing
individual detail calls:

```json
{"area":"quantum-algorithm","status":"Unsolved","view":"research"}
```

Research search returns `qop-search-research/1`. Every result has the same complete
formal statement, research history, references, comments, decisions and retained
service body as `get_problem(view: "research")`, plus match evidence when searching
text. It supplies data for the caller's chosen workflow; ordering is not a difficulty
ranking. Existing summary search remains `qop-search/2`.

`limit` caps the number of problems and `maxBytes` caps the complete compact UTF-8
API JSON response (default 32,768; accepted range 16,384–1,048,576). Problems are
atomic: a page may contain fewer than `limit` to fit the byte budget, and its
`nextCursor` continues after the last problem actually returned. Repeat the filters,
sort and `view`; switching view requires a fresh query. `responseBytes` includes
the API envelope, but excludes HTTP headers, MCP framing and any token accounting.
On `search_problems`, `maxBytes` only applies to research view and can change between pages.
Supplied research-search parameters must be nonempty; omit unused filters.

If even the first problem cannot fit, HTTP 413 with `response_budget_too_small`
reports `minimumRequiredBytes` and `problemId`; increase the budget within the
allowed range or use `read_problem` to read the needed content category. The server never substitutes a
truncated statement or an empty success page. Client history limits are separate;
for example, [Codex supports per-tool output token limits](https://learn.chatgpt.com/docs/extend/mcp).
Choose a page budget compatible with the client, and lower it if the client reports
truncated tool output.

The default was reduced to 32 KiB after a real Codex direct-tool readback test lost
middle-of-page markers at 64 KiB. This reduces the chance of host truncation; it
does not establish a universal host limit. A large single problem can use
`read_problem` without increasing the page budget. A visible `count`, problem title
or final reference does not prove the middle of a displayed response survived.

Codex direct tool presentation and Code Mode have separate output controls. For a
direct connection named `qop`, a tested large-page configuration is:

```toml
[mcp_servers.qop.tools.search_problems]
output_token_limit = 100000
```

This restored all diagnostic markers for the tested 200,000-byte research page;
it is not a requirement for every client or a guarantee for arbitrary page sizes.
In Code Mode, the full tool object is available to the program, while the cell's
`max_output_tokens` controls what gets displayed to the model. Printing only
`result.structuredContent` avoids repeating the same data from `content`. Raising
the direct MCP limit does not raise the Code Mode cell limit. See the
[official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference)
and the [reproducible host-output audit](../reviews/mcp-information-access-2026-09-14.md).

`research.comment` contains authored catalog commentary; `comments` contains service
discussion threads. Empty discussion threads do not mean that authored commentary
is missing. Cited sources can have partial bibliographic metadata: use the current
reference body and authored bibliography for citation-specific chapters and
locations, then verify them in the paper. The MCP provides maintained research
notes with source citation text, bibliographic version, ledger revision and digest.
The digest includes the whole Source record, so independent source edits change
the problem-reading version even when its title and URL are unchanged.
The MCP does not fetch paper full text or certify exhaustive coverage of the
latest literature. DOI/publisher access can fail
while an arXiv version is available; a large HTML document can require a PDF reader.

Text search covers the current formal statement and clauses, titles, authored
progress, taxonomy, keywords, and background. Complete IDs and aliases are resolved
separately so accidental substrings in opaque IDs cannot match scientific queries.
Controlled equivalents include QMA(2)/QMA2/QMA 2, stabilizer/stabiliser, SVP/Shortest
Vector Problem, and selected Chinese field terms. Queries allow up to 2048 characters
and 32 normalized whitespace-delimited terms. Results report matched fields, a
relative relevance score and an original-text excerpt; excerpts may be shortened,
so read the full statement before drawing scientific conclusions.

With text, the default order is relevance. Without text, it is newest catalog TeX
git author edit time, then creation time, then the original permanent ID. The site
and API share this ordering when the service clone includes the complete catalog
history. Service-only or shallow clones expose unknown catalog dates, ordered last.
Catalog edit dates are not dates of scientific results. `sort: title` remains explicit.

For random selection use `sample_problem` with field/topic/status filters. It draws
uniformly from every matching record, defaults to Unsolved, and returns the candidate
count, catalog version and selected problem's research view. Empty populations return
`problem: null`. It accepts no pagination and is not cached.

`get_status.problems.total` counts active records, with merged and retired
identities reported separately. `distinctQuestions`
counts published mathematical questions once across equivalent formulations.
Old problem IDs resolve to the canonical question after a catalog merge;
`get_record` still exposes the archived ledger identity.
`get_problem` returns `research` (`qop-research/1`): separate source, ordered
progress, comment and references entries containing the complete authored TeX,
citation keys, and a record revision/digest plus section/index locator. These
locators are scoped to that revision; resource links still retrieve current records.
`view: research` removes the catalog Markdown body only when its body and catalog
snapshot match the desired field hashes in a validated export manifest. A reconciled
export can retain service edits, so a pinned revision alone is not sufficient.
Later service background revisions and unverified
projections retain their complete body (`bodyDisposition: included`); read it too.
The view preserves the
complete formal statement, clauses, conditions, bibliography and workflow records.
`view: full` is the backwards-compatible default, and `includeAuthoredRecord: true`
adds the raw source snapshot in full view. Native ledger problems without a catalog
snapshot retain their body in either view and explicitly report research unavailable.

### Read by content category

`read_problem` reads one category of a problem. Whole-problem `get_problem` and
batch research search remain available; the caller chooses which to use.
These reads preserve the core scientific material. Contributor credits and
website navigation, sharing and citation controls are outside the scope of
ordinary research responses.

| `section` | Content |
| --- | --- |
| `statement` (initial default) | Full problem definition, clauses and conditions, plus any retained service background |
| `history` | Maintainer-authored origin and prior research progress |
| `references` | Authored bibliography and structured service references |
| `comment` | Maintainer commentary, service discussions and clearly separated decisions |

```json
{"id":"op_a64dc63d6ae49127","section":"history"}
```

A normal response returns the category as a structured `content` object, with
`format: "json"`, `complete: true` and `nextCursor: null`. Every category includes
the authoritative problem `status` (`Unsolved` or `Solved`) and its `statusSource`.
The status of a service clause is an independent evidence state: a clause may
still be `open` for a catalog problem whose authoritative status is `Solved`.
Use the problem status to decide whether the scientific question is resolved.
Original text, citation
keys and provenance are preserved. Research categories include `researchContext`
to distinguish unavailable catalog notes from a claim that no research exists.

Only an oversized category requires continuation. In that case, `format` is
`json-continuation`, `content` is null, and `text` contains successive portions of
that category's serialized JSON. Follow `nextCursor` with the same problem ID
until null. Read the entire sequence before interpreting an unfinished formula;
if parsing as JSON, concatenate the text in response order and parse once.
`continued` is false on the first page (including a first oversized page) and
true on subsequent pages. `complete` means the selected category has ended.
There is no paragraph selector, block identifier or positional addressing.

`maxBytes` defaults to 8,192 and accepts 2,048–65,536. It measures the entire
compact UTF-8 API JSON response, including the cursor, and excludes HTTP headers,
MCP framing and token accounting. It may change during continuation. Smaller
responses reduce exposure to host truncation but cannot override a host's limits.

`documentVersion` identifies the complete research view, including independently
updated statements, sources, discussions and derived statuses. Supply it when
reading another category to require the same snapshot. Cursors preserve the
selected category when `section` is omitted; conflicting categories are rejected.
Changed material returns HTTP 409 `document_changed`, requiring a fresh read.
Cursors expire after one hour and API restarts invalidate them. They do not retain
historical content. Unknown, empty, duplicate and invalid parameters are rejected.

The reader covers maintained catalog material; it does not fetch cited papers'
full text. See the [section-read acceptance report](../reviews/mcp-problem-read-2026-09-15.md).

Selected-problem answers should explain known results, the remaining gap and key
references. Empty service comments, accepted claims or routes do not imply absence
of literature. `build_context` still offers whole sections under an approximate
section-text budget; when relevant authored or background sections are omitted, read the research view or
use `read_problem` for the needed category.
Difficulty remains the maintained rating, often `unrated`; tool ordering is not a
difficulty estimate. For recent resolutions, filter Solved and inspect dated progress
and bibliography. Keep submission, publication, verification and editing dates distinct;
do not turn settled subcases or edits into a new full-problem resolution.
`search_sources` also searches preserved bibliography text when
structured authors are incomplete, and flags retired sources.

`sort: "stale"` puts missing service human-review dates first, then oldest
reviews, with title/id as ties. Null dates mean no recorded service review;
this order does not measure catalog edit age.

If connecting fails, check the [catalog status](https://api.qiqc-op.com/api/v1/status),
confirm remote MCP support, and use the full URL ending in `/mcp`. A browser GET
may return 405 because an MCP client must negotiate the protocol. HTTP 429 asks
the client to wait for the `Retry-After` interval; the public limit is 240 requests
per minute per address.

## Optional local adapter

Run these commands once in a terminal:

```sh
git clone https://github.com/Naixu-Guo/quantum-open-problems.git
cd quantum-open-problems
npm --prefix mcp ci
QOP_SERVICE_URL=https://api.qiqc-op.com npm --prefix mcp run check:service
```

This option is for clients that only support stdio, development, or authenticated
research contributions. It requires Git and Node.js 22.13 or later. If you already
have a checkout, run `npm --prefix mcp ci` from its root. Both stdio and HTTP use
the official MCP SDK, with shared parameter validation and result schemas.
MCP 1.3 requires an API advertising `contextSchemaVersion: "qop-context/2"` and
`idempotencyVersion: "qop-idempotency/2"`, `retrievalVersion: "qop-retrieval/1"`,
`researchSearchVersion: "qop-search-research/1"`, and
`problemReadVersion: "qop-problem-read/1"` at `/api/v1/status`.
The `check:service` command verifies all five capabilities; point it at the same `QOP_SERVICE_URL` as the adapter. If it fails,
the operator must deploy and restart the matching API release before activating
this MCP release. See [API-first deployment](../deploy/ubuntu/README.md#public-mcp-endpoint).
Check the [hosted catalog status](https://api.qiqc-op.com/api/v1/status) to verify
that the service is reachable.

### Configure the local command

Add a local MCP server with the following settings:

| Setting | Value |
| --- | --- |
| Name | `quantum-open-problems` |
| Transport | `stdio` |
| Command | `node` |
| Arguments, in order | `--experimental-strip-types`, `--no-warnings`, the absolute path to `mcp/src/server.ts` |
| Environment | `QOP_SERVICE_URL=https://api.qiqc-op.com` |

For clients using an `mcpServers` JSON configuration:

```json
{
  "mcpServers": {
    "quantum-open-problems": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "--no-warnings",
        "/absolute/path/quantum-open-problems/mcp/src/server.ts"
      ],
      "env": {
        "QOP_SERVICE_URL": "https://api.qiqc-op.com"
      }
    }
  }
}
```

Replace the example path with your checkout's full path. Add the server to any
existing `mcpServers` entries, save the configuration, and reload the client's
MCP connection. The client starts the adapter automatically.

Try asking: “Use the quantum-open-problems MCP to find unsolved problems about
quantum channel capacity, then summarize one problem's known progress and
references.” The assistant can search with `search_problems`, read a statement
with `get_problem`, retrieve citations with `list_references`, and gather a
research bundle with `build_context`.

If the client cannot start `node`, use the full path to the Node executable as
the command. If queries fail, check the status URL above and the configured
`QOP_SERVICE_URL`. This environment variable names the API origin, so omit the
`/mcp` suffix when using the local adapter.

To connect to another service, set `QOP_SERVICE_URL` to its origin.
Authenticated research contributions also require a `QOP_API_KEY` issued by that
service's operator (see [service key management](../service/README.md#commands)).
Without a key, the adapter exposes only read tools. Configuring a key also exposes
Work and Write tools; the service checks the key and the caller's permissions
when a tool runs. Public HTTP continues to expose only read tools.

## Run your own local service

For development or a separate catalog, run these commands from the repository
root and leave the service running:

```sh
npm --prefix contract ci
npm run service
```

Set the adapter's `QOP_SERVICE_URL` to `http://localhost:8787` and check
<http://localhost:8787/api/v1/status>. The adapter defaults to this local URL
when the variable is unset. See the [Ubuntu deployment guide](../deploy/ubuntu/README.md)
for the hosted service's setup and operations.

## Tools

The public HTTP endpoint exposes the Read group. The local stdio adapter also
provides Work and Write tools when authenticated.

| Group | Tools |
| --- | --- |
| Read | `get_status`, `get_taxonomy`, `search_sources`, `get_policy`, `get_schemas`, `search_problems`, `sample_problem`, `get_problem`, `read_problem`, `get_frontier`, `get_tree`, `list_references`, `list_comments`, `list_attempts`, `build_context`, `list_events`, `get_contribution_status`, `get_record`, `claim_queue_item` |
| Work | `start_trajectory`, `log_event`, `upload_artifact`, `end_trajectory` |
| Write | `submit_batch`, `submit_review`, `post_comment`, `withdraw_contribution` |

Resources: `qop://status`, `qop://policy`, and the templates
`qop://problems/{id}`, `qop://problems/{id}/frontier`,
`qop://problems/{id}/tree`, `qop://contributions/{id}`, `qop://records/{id}`.

Successful tool calls return typed `structuredContent`, JSON text for clients
that consume text, and resource links where further records can be read. Optional
navigation links are capped at 20 per result; the complete result rows remain in
the data. `_meta["qop/resourceLinksOmitted"]` reports additional links when capped.
Resource URIs resolve the current record revision when read. A revision and digest
returned with a context source describe the record used to build that bundle;
the URI does not pin a historical revision.

The intended loop for a research agent: `get_status`, `search_problems`,
`build_context` (keep the bundle id), `start_trajectory` with that bundle
id, `log_event` as you work, `upload_artifact` for anything you produce,
`end_trajectory` with an attempt report that introduces any auxiliary
problems and claims. For a verifier: `claim_queue_item`, examine, then
`submit_review`.

Despite its retained name, `claim_queue_item` only peeks at the review queue.
It does not reserve an item, so concurrent reviewers can receive the same
contribution.

### Read context completeness and provenance

An older API's context response returns a nonretryable `INCOMPATIBLE_SERVICE`
error with upgrade instructions, rather than being presented as a complete v2
bundle. Other read tools remain available if their own API contracts are supported.

`build_context` returns `qop-context/2`. It prioritizes the authoritative problem
status, complete formal statement, and selected clauses, including their
resolution criteria. It keeps sections whole so an insufficient budget does not
silently cut an equation or its conditions.

Maintained source, progress, commentary and bibliography have separate whole
sections (`authoredSource`, `authoredProgress`, `authoredComment`, and
`authoredReferences`). They remain available when a later service edit replaces
the problem's background. Independent service background is preserved; only a
proven duplicate catalog body is omitted without spending the budget twice.
Decision projections retain the actual ledger justification text.

Check both completeness flags:

- `formalContextComplete` says whether the required formal material fits.
  If false, increase `tokenBudget` to at least `minimumRequiredTokens`, or read
  the linked problem and statement before reasoning from the result.
- `incomplete` says whether any nonempty section was omitted. It may be true
  even when the formal context is complete because background or supporting
  material did not fit. `omittedSections` and each section's `omitted`, `required`,
  and `resourceUris` identify what remains to read.

`tokenBudget` and `approximateTokens` count section text using four characters
per token. Section text includes any JSON or provenance encoded within it. This
approximation excludes response framing and metadata outside section text,
MCP framing, and model-specific tokenization; it does not bound the entire tool
response's token count.

`status` is the authoritative `Unsolved` or `Solved` value; `statusSource`
identifies its catalog record, accepted decision, or default. Clause statuses
describe accepted ledger evidence separately. `statementId`, `statementVersion`,
and `statementDigest` identify the formal version. Accepted claims retain their
conditions and support, including claims continued through clause lineage from
an older statement.

`sourcesUsed` records source IDs, revisions, and content digests used to assemble
the bundle, including supporting records whose text is not shown.
`shownRecordIds` identifies records represented in retained sections; it does not
mean their entire contents were reproduced. Keep the returned `bundleId` with
your trajectory: its digest covers the delivered context payload and provenance.

### Write safely after an uncertain response

Every Work and Write tool accepts an optional `idempotencyKey`: 1–128 ASCII
letters, digits, or the characters `._:-`. The adapter forwards it as the
service's `Idempotency-Key` header. Before its first keyed write, the adapter
checks the API's `qop-idempotency/2` capability and caches only a successful check.
An old or incompatible API returns `INCOMPATIBLE_SERVICE` before any POST is sent.
Unkeyed writes remain available subject to the service's ordinary contracts.

If a response is lost and the error is retryable, retry the same tool
with the same key **and identical payload**. Use a new key for a different
operation. Reusing a key with changed content produces a conflict. The adapter
does not automatically retry POST requests.

The service saves a durable receipt before executing a keyed write. Concurrent
identical requests await or replay the original result. If a crash or failed
response save leaves the outcome unrecorded, the pending receipt blocks execution
and returns HTTP 409 with `code: "IDEMPOTENCY_OUTCOME_UNKNOWN"`,
`retryable: false`, and `outcomeUnknown: true`. Inspect the service state and ask
the operator to reconcile the pending receipt; do not use a new key to repeat
that write. Confirmed refusals before execution, such as temporary 429 or 503
responses, may permit retry with the same key.

Service and adapter errors return `isError: true` and a JSON error object in both
text and `structuredContent`. The object includes a stable `code`, an `error` message,
and `retryable`; `httpStatus`, `retryAfterMs`, and `requestId` are included when
available. `outcomeUnknown: true` means a write may already have reached the
service. If retry is permitted, use the original idempotency key and payload to
recover its result; for a nonretryable error, inspect the state as described above.
Without an idempotency key, inspect the service state before deciding whether
to repeat an uncertain write. A retryable error does not trigger an automatic
retry in the adapter.

Both stdio and HTTP propagate request cancellation to the upstream API request.
Cancellation stops waiting for a result; it does not roll back a write the API
has already accepted. Recover an uncertain write using its original idempotency
key and the rules above.

Input-schema validation errors retain the SDK's standard `isError` text response
and may not include `structuredContent`.

`upload_artifact` requires exactly one of nonempty `text` or nonempty `base64`.
Binary data must use canonical standard base64, including padding where required;
URL-safe encoding, whitespace, missing required padding, and malformed encodings
are rejected.

The legacy static-catalog server was removed during the catalog integration.
Use `mcp/src/server.ts`; its service reads the ledger projection exported from
`database/problems_json/` (see [the catalog boundary](../docs/CATALOG_INTEGRATION.md)).
Both transports forward tools to the service's HTTP API; records carry stable ids
and statements carry content digests.

New catalog problems need no MCP-specific registration. Commit the JSON, TeX,
and exported ledger together. A service using the same checkout notices the
commit on the next MCP read and refreshes its ledger and index. For a separate
service clone, configure `QOP_GIT_REMOTE` and `QOP_GIT_BRANCH` on the service:
it fetches in the background on startup and every sixty seconds by default
(`QOP_SYNC_INTERVAL_MS`; `0` disables polling). After a valid update arrives,
the existing MCP connection can search the problem and read its statement,
frontier, references, and context. No MCP restart is needed. Service code or
schema changes still require deploying and restarting the service.

```sh
npm ci            # from mcp/: install the official SDK and test client
npm test          # tests stdio and remote HTTP against temporary services
npm run typecheck
```

## Research workflow verification

`npm --prefix mcp test` includes official-SDK HTTP calls through the real API against
an isolated copy of the maintained catalog. It checks search variants and identity,
complete research history, cursor continuation, full-population sampling and date evidence.
These scripted integration checks do not measure whether a model selects the right tools.

For an opt-in model-driven run, use an authenticated Codex CLI:

```sh
python3 mcp/eval/run-research.py --codex /path/to/codex --model MODEL --effort ultra --output /tmp/qop-research-eval
```

The harness starts a loopback read-only MCP/API with memory stores, disables model
shell/web/multi-agent tools, and asks the three original Chinese scenarios without
prescribing calls. It records tool activity, answers, usage and elapsed time, excluding
reasoning events. Cases 2 and 3 receive prior user/assistant text in fresh ephemeral
sessions, not a replay of tool state. `--holdouts` adds three independent paraphrases.
The model receives catalog content through your configured Codex provider; use only
a dataset authorized for that destination. Script completion is not a passing score:
review answer accuracy, evidence, scope and tool choice independently.

Each retained event now includes a host observation timestamp. Separate
`case-N.timings.jsonl` files record arrival times for every JSON event without
reasoning text. `runs.json` reports first/last tool events and per-call observed
durations. These include CLI buffering, scheduling and transport; they are not
isolated API execution times, and overlapping calls must not be summed as wall time.
To repeat only the selection case with the original preceding answer:

```sh
python3 mcp/eval/run-research.py --codex /path/to/codex --model MODEL --effort ultra --case 2 --history-from /tmp/qop-research-eval --output /tmp/qop-selection-repeat
```

For local service/transport measurements without invoking a model:

```sh
node --experimental-strip-types --no-warnings mcp/eval/measure-reads.mjs --output /tmp/qop-read-latency.json
```

The probe starts an in-memory API/MCP, measures three sequential and pooled batches
of complete algorithm-problem research reads, and reports startup time, elapsed time,
JSON bytes, MCP response bytes and duplicated metadata. Optional
`--model-events /tmp/qop-research-eval` also summarizes the original three traces'
call overlap. It rejects an empty catalog or an algorithm listing exceeding its
200-record discovery page. Local timings do not predict a remote client's model latency.
