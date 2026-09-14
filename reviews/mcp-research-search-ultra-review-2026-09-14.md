# Research-search adversarial review

Read-only Codex CLI review using `gpt-6-astra` with `ultra` effort, scoped to the research-search change over `8942539`. The findings below describe the implementation before the empty-filter correction. File links have been normalized to repository-relative paths.

- **P2 — MCP silently drops invalid empty research filters.** [mcp/src/adapter.ts:171](../mcp/src/adapter.ts#L171): `search_problems({view:"research", text:"", limit:1})` passes SDK validation, but `query(a)` removes `text`. Reproduced an unfiltered success with `total:111`; the equivalent API request returns 400. Empty `area`, `topic`, and `difficulty` behave identically. This bypasses research argument validation and silently broadens searches. Reject empty research filters in the MCP schema or forward them for API validation.

Seven targeted tests, TypeScript checking, and additional in-memory boundary probes passed. Full HTTP integration suites and the measurement script were inspected but not run because they require filesystem writes or network listeners. No files were changed.

## Correction and verification

The adapter's query serializer now accepts an opt-in `preserveEmptyStrings` flag, enabled only for research search. Explicit empty filters reach the existing API validator and produce HTTP 400 instead of disappearing. Whitespace is preserved too; summary serialization keeps its previous behavior.

The new regressions exercise the real official legacy and 2026 SDK → HTTP MCP → HTTP API path. Empty strings, ASCII whitespace and nonbreaking spaces in `text`, `area`, `topic` and `difficulty` produce `INVALID_ARGUMENT`, HTTP 400 and `retryable:false`, with no problem list. Cursor/sort boundary inputs are rejected, valid research filters remain effective, and default/explicit summary compatibility is checked. Direct adapter assertions independently verify serialization.

Final targeted tests pass 18/18; the complete MCP suite passes 73/73, with typechecking and diff validation also passing. The original ultra review was not rerun after this minimal correction; its sole finding is addressed by the implementation and these regressions.
