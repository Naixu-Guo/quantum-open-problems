# Complete research details in search results

`search_problems(view="research")` lets a caller retrieve complete matching research records without first collecting IDs. Summary search remains the default, and the caller chooses filters, view, page size and tool composition. This adds a retrieval capability without prescribing a selection workflow or assigning difficulty scores.

Later [model-visibility testing](mcp-information-access-2026-09-14.md) found host truncation at the original default and reduced the default page budget to 32 KiB. The 64 KiB measurements below are retained as historical observations at that explicit budget.

## Contract

- Research results use `qop-search-research/1`; existing summary results and cursors retain `qop-search/2` behavior.
- Each result equals `get_problem(view="research")`, with optional search-match evidence. Statements, clauses, research history, references, comments, decisions, provenance and additional service body remain intact.
- `limit` bounds record count; `maxBytes` bounds the entire compact UTF-8 API JSON response, including its pagination and size metadata. The default is now 32,768 bytes, with an accepted range of 16,384–1,048,576. HTTP headers, MCP framing and host token limits are outside that budget.
- Pages contain a complete prefix of matching records. The continuation advances by the actual returned count, preserves expiry, and binds the query, sort, view and catalog version. Callers may change the count or byte limit between pages. Switching view starts a fresh query.
- If the first complete record cannot fit, an explicit 413 response reports its ID and a sufficient minimum budget. Tests retry that exact budget. Records exceeding the maximum remain available through the individual reader.
- The service captures the ledger once and uses the already selected rows for catalog dates. `/api/v1/status` and MCP preflight advertise/check `researchSearchVersion` alongside the existing context, idempotency and retrieval capabilities.

## Equal-content local measurement

The [official-SDK measurement script](../mcp/eval/measure-search.mjs) starts an in-memory local service and reads all 25 unsolved quantum-algorithm records through both interfaces. It compares every complete returned object deeply, including catalog version, order and unique coverage. Three paired repetitions use an explicit 65,536-byte research budget (the default when measured); the individual baseline runs up to eight detail reads concurrently.

| Path | MCP calls | Complete records | Median read time |
| --- | ---: | ---: | ---: |
| Summary search plus individual research reads | 26 | 25 | 638.63 ms |
| Research search with continuation | 8 | 25 | 128.76 ms |

JSON-serialized SDK `CallToolResult` volume was approximately 1,019 KB versus 964 KB, including both text and structured content but excluding JSON-RPC and HTTP wire framing. This does not establish what a particular client feeds into its model. Startup is excluded from the table. Both paths share a server and client, and the individual path runs first in every pair; order is not randomized. The benchmark is local, has three repetitions per path, and is not a production-network or model-response latency guarantee. [Raw measurements](mcp-research-search-measurement-2026-09-14.json) identify the implementation as a working-tree change over `8942539`.

Reproduce from the repository root:

```sh
node mcp/eval/measure-search.mjs --max-bytes 65536 --output /tmp/research-search-measurement.json
```

## Model-driven selection

The original Chinese question, “现在这里面哪个你觉得最容易解决”, was replayed with identical preceding answer text, model (`gpt-6-astra`), reasoning effort (`ultra`), date and CLI settings. Each run was an ephemeral session against its respective real local MCP and API, and the model chose all tool arguments. The baseline checkout was `8942539`; the updated checkout included this feature. Neither run used external tools.

| Observation | Before | After |
| --- | ---: | ---: |
| End-to-end wall time | 87.77 s | 121.27 s |
| Tool calls | 9 | 4 |
| Complete research records retrieved | 7 | 25 |
| Non-overlapping tool rounds | 4 | 4 |

The updated model chose three research pages with a 200,000-byte budget and retrieved 11, 10 and 4 complete records. The baseline searched 25 summaries and individually read seven selected records in two parallel groups. These are different reading workloads. Fewer calls did not produce a faster final answer in this one-pair observation, and reducing request overhead alone does not eliminate model planning, reading and response time. The benchmark above provides the equal-content comparison.

Both answers explicitly treated approachability as subjective and distinguished a tractable subcase from solving an entire catalog problem. The baseline recommended a two-query virtual-conjugation subcase; the updated model recommended a three-copy state-purification subcase after retrieving the broader set. Answers, tool choices, usage and host-observed timings are preserved in the [comparison artifact](mcp-research-search-model-comparison-2026-09-14.json). An [independent evidence check](mcp-research-search-model-grading-2026-09-14.md) accepted both answers against the catalog. Raw SDK responses are complete, but the CLI's internal model-visible context and potential client truncation are not independently observable from its event log.

## Verification and rollout

Root tests: 96/96. Service tests: 119/119. MCP tests: 73/73. Service and MCP typechecks pass. The mandatory site build validates all 111 records, 485 references and 385 equations. Ledger export check reports zero changed files.

Real official SDK → MCP HTTP → API HTTP regressions compare all 25 algorithm records and all 99 unsolved records against individual research reads. They cover whole-record byte boundaries, changing budgets, exact suggested-budget retries, empty pages, actual UTF-8 wire length, cross-view cursor rejection, genuine committed-catalog invalidation, Chinese/TeX content and preservation of later service body changes after export. Service tests independently cover original summary signatures, expiry preservation and malformed or repeated arguments.

The [Codex ultra adversarial review](mcp-research-search-ultra-review-2026-09-14.md) found one P2 issue: the adapter discarded explicitly empty research filters, bypassing API validation and broadening the query. The correction preserves those supplied values for strict API rejection. Both SDK protocol versions now exercise empty strings, whitespace, valid research filtering and summary compatibility through the real API. The measurements and model runs above preceded only this empty-filter correction; they supplied no empty parameters. Final MCP regressions cover the corrected implementation.

The matching API must be deployed first; run `npm --prefix mcp run check:service` against that API before activating MCP. This work updates draft PR #60 and does not activate production services.
