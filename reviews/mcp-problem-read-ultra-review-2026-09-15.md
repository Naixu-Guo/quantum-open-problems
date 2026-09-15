# Category-reader adversarial review

The final semantic-category implementation was reviewed read-only with Codex
`gpt-6-astra` at `ultra` on 2026-09-15, after replacing the experimental block
interface. Scope covered the service reader, API integration, MCP adapter/schema,
relevant tests and the diagnostic output-schema boundary. The review did not
change files, access credentials, spawn agents or call external services.

Final review result:

> No blocking findings in the uncommitted semantic-category change.
>
> Verification: 13 targeted tests passed, covering category reconstruction, bounded oversized pagination, cache limits/invalidation, cursor integrity and expiry, schema branches, and maximum-budget diagnostics. Neither previous P2 issue reproduced.
>
> Residual limits: HTTP integration was inspected but not executed. No full-catalog or provider/model tests were run. No files were edited.

The earlier experimental implementation had two P2 findings. Long-content
continuation repeatedly prepared the entire document and considered oversized
fit candidates, producing quadratic CPU growth. The final reader caches immutable
section buffers under a ledger/index epoch and bounds candidate work by the page
budget. Cache size/eviction limits remain explicit. Separately, synthetic markers
made a valid 64 KiB diagnostic page exceed the production output schema; the eval
server now clones that schema and sets a finite diagnostic-only limit equal to the
actual decorated fixture maximum. Production byte limits are unchanged.

The final targeted review did not reproduce either problem. The separate full
service/MCP suites, 111-problem category acceptance and actual-client run are
reported in [implementation and acceptance](mcp-problem-read-2026-09-15.md).
The review's limited execution scope is distinct from those separately run checks.
