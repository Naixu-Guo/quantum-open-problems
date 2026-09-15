# Information-access adversarial review and resolution

Read-only review: Codex CLI 0.154.0-alpha.6.2, gpt-6-astra, effort ultra, web disabled. The review inspected the changes after `3bc74404504e977360014ef405019a8016aa8fe6`; the final artifact below predates the harness corrections. Line numbers identify the reviewed snapshot.

## Review findings

1. **P2 — Unfinished extra calls pass the one-call gate** — [run-visibility.py:334](../mcp/eval/run-visibility.py). `toolCalls` counts only completions. One completed, exactly served call plus another `qop.search_problems` start that never completes or reaches the server still produces `exactlyOnePromptedCall=true` and eligibility. Reproduced with synthetic CLI events. Reject additional starts and unmatched active calls.

2. **P2 — Timeout cleanup can hang after the parent exits** — [run-visibility.py:36](../mcp/eval/run-visibility.py). If a CLI wrapper exits while a descendant holds stdout open, `stop_process()` skips killing the surviving process group. The subsequent `stdout.close()` can block indefinitely. A bounded reproduction with a two-second child exceeded a 0.1-second timeout, returning after 2.04 seconds. Clean up surviving descendants and bound pipe shutdown independently of the parent’s status.

Both typechecks and four pagination tests passed. In-memory API/adapter/SDK checks preserved all 25 algorithm and 99 unsolved records, including exact-minimum retries; all three visibility fixtures passed their integrity checks. Custom-question/web-opt-in checks also passed.

No actionable server regression found. HTTP-listener, disk-artifact, and live-model integration were not run; the supplied host-truncation observations were not independently reproduced.

## Corrections and verification

Both P2 findings are fixed in `run-visibility.py`. The one-call predicate now requires exactly one start and completion with a matching ID, no active call, one complete timing entry, and one exactly served request. Process cleanup signals the full session group even after the leader has exited, kills remaining group members, and reaps the leader before closing stdout.

`test_visibility.py` passes 3/3 tests, independently rerun after the fixes: a valid call, five invalid event sequences, and a real exited-leader/TERM-ignoring-child timeout regression supervised by a bounded outer process. Four earlier diagnostic/error-filter checks also pass. No new model invocation was needed to reproduce or fix these harness defects.

The six historical direct runs were rechecked from raw events: each has one start and one matching completion, no unmatched active call, normal exit, and no timeout. Neither defect affected their reported evidence. Their original artifacts and eligibility flags remain unchanged; this audit is additional evidence, not a rerun or retroactive rewrite.

[Historical event audit](mcp-information-access-call-audit-2026-09-14.json). The original reviewer did not rerun live-model measurements or inspect these later fixes; regression verification was performed separately.
