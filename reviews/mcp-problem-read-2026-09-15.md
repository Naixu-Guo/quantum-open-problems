# Reading a problem by content category

The reader exposes four content categories: `statement`, `history`, `references`,
and `comment`. Whole-problem `get_problem` and batch research search remain
available. The caller chooses what information to retrieve.

A normal response returns the entire selected category as structured `content`.
Only an oversized category uses `text` and opaque `nextCursor` continuation.
There are no paragraph selectors, block IDs, JSON pointers or byte-offset fields.
The initial category is `statement`; the default response budget is 8 KiB.

The selected category preserves the original scientific text and structured
citation/provenance metadata. Definitions include formal clauses, conditions
and any retained native/later service background. History includes the authored
source and progress. References include authored bibliography and service
references. Commentary, discussions and decisions remain explicitly separated.
`researchContext` preserves availability and provenance for catalog research.

Continuation is section-wide serialized JSON. The cursor carries its position;
callers need only follow responses in order. Machine consumers concatenate the
`text` values and parse once. A changed complete research view returns 409, also
when a Source or discussion changes independently of the Problem revision.
Cursors expire after one hour and API restarts invalidate them.

HTTP responses use `no-store`. Internally, prepared documents are cached under
both ledger identity and catalog version, with limits of eight documents and
an estimated 16 MiB. Misses and eviction require preparation again; oversized
entries remain readable but are not retained. Fit checks process bounded text.

## Validation

Official SDK → MCP HTTP → API HTTP acceptance checks **111 problems × four
categories** against an independent projection of `get_problem(view: "research")`.
All **444 category results** match exactly across **515 default 8 KiB pages**.
At that budget, one statement, seven histories and 51 reference categories need
continuation; all commentary categories fit. These counts include research context
and the response envelope. The largest current reference category fits whole at
32 KiB; this does not bound future/native problem sizes.

The nine SDK tests also cover actual independent Source and Comment writes
returning 409, inherited cursor categories, 2 KiB→32 KiB continuation, aliases,
Unicode/later/native background, old-protocol compatibility and LRU eviction.
Service regressions include a single unbroken scientific string larger than
1 MiB reconstructed across 212 fixed 8 KiB pages, strict parameters, cursor tampering/TTL, snapshot immutability and cache
bounds. No long statement or citation is replaced with a summary.

The full root suite passes **96/96** and MCP **86/86**, plus **5/5** Python
observer/grader regressions and **1/1** official-SDK diagnostic schema regression.
The service suite passes **129/129**. Service/MCP typechecks, the required site
build and unchanged ledger check also pass. A final [ultra adversarial review](mcp-problem-read-ultra-review-2026-09-15.md)
reports no blocking findings after 13 targeted tests; neither previous performance
nor maximum-budget diagnostic issue reproduced.

Three paired local measurements of the final cached path read 400,000 and
800,000 body bytes at a fixed 2 KiB budget in median **51.71 ms** and **102.90 ms**,
over 312 and 623 pages. Each traversal prepares once and includes first preparation.
This is in-process retrieval, not HTTP/model latency; cache misses and oversized
entries have different costs. [All repetitions and scope](mcp-problem-read-cache-measurement-2026-09-15.json).

A separate real-client diagnostic reads the `references` category of the private
capacity problem `op_d2813fe3fcdf09ad`. The model follows **four pages exactly once
in order** and copies **12/12 random markers**, with four matching starts/completions
and no unexpected tools. The original pages are at most **8,192 bytes**; diagnostic
pages are at most **8,652 bytes**. Elapsed time is **52.88 seconds**, including host,
model and transport time. The endpoint replays pages frozen from the real local API.

This uses the installed Codex CLI with `gpt-6-astra` at `ultra`, forces direct MCP
presentation, and does not override its output cap. The three markers surround
the response envelope and category payload; the marker named Middle is not a
byte midpoint. Original content/text is unchanged, and disclosed marker overhead
lies outside the production budget. [Sanitized run and marker evidence](mcp-problem-read-visibility-2026-09-15.json).
An [independent evidence check](mcp-problem-read-visibility-grading-2026-09-15.md)
verifies both response carriers, original/decorated hashes, call sequence and an
exact 23,056-byte category projection containing 13 authored bibliography entries
and 13 service references.
Exact recall is delivery evidence for this path, not proof of scientific
understanding or support for every host. Earlier experimental block-reader
measurements are not evidence for this final category interface.

## Reproduction

```sh
npm --prefix service test
npm --prefix mcp test
node --experimental-strip-types --no-warnings --test mcp/eval/problem-read-diagnostics.test.ts
python3 -B -m unittest discover -s mcp/eval -p 'test*visibility.py' -v
python3 mcp/eval/run-problem-read-visibility.py --prepare-only --id op_d2813fe3fcdf09ad --section references --output /tmp/qop-section-fixture
```

For an actual model readback, omit `--prepare-only` and pass `--codex` if necessary.
The fixture reads the local API, then replays frozen pages through MCP. Synthetic
markers are outside the original API budget; the production payload is unchanged.
Marker recall measures delivery in that particular host, not scientific
understanding or universal host visibility. This reader does not retrieve the
cited papers' full text.
