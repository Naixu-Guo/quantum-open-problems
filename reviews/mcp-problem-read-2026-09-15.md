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
Every category also carries the authoritative binary problem `status` and its
`statusSource`, including in reconstructed continuation content. A service
clause's evidence status can remain `open` for a `Solved` catalog problem; it
does not override the problem status. Missing or invalid authority fails explicitly.

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
All **444 category results** match exactly across **552 default 8 KiB pages**.
At that budget, one statement, seven histories and 74 reference categories need
continuation; all commentary categories fit. These counts include research context
and the response envelope. The largest current reference category fits whole at
32 KiB; this does not bound future/native problem sizes.

The ten SDK tests also cover actual independent Source and Comment writes
returning 409, inherited cursor categories, 2 KiB→32 KiB continuation,
Unicode/later/native background, old-protocol compatibility and LRU eviction.
Alias resolution is covered separately by service HTTP tests and the actual
Chinese example calls. Service regressions include a single unbroken scientific string larger than
1 MiB reconstructed across 212 fixed 8 KiB pages, strict parameters, cursor tampering/TTL, snapshot immutability and cache
bounds. No long statement or citation is replaced with a summary.
The status regression uses a real solved metrology problem whose service clause
remains open, plus an unsolved purification problem. Every category preserves
their exact status and source in whole JSON and at a 2 KiB budget; both statement
reads require actual continuation. Separate service cases cover large status
provenance, authority-only version changes and missing/invalid authority.
Additional checks compare Decision reasons directly with original ledger text,
independently of `get_problem`. Real Source-only version, citation and title
revisions each invalidate prior cursors and pinned document versions. Source
citation, bibliographic version, ledger revision and whole-record digest now
remain visible in references. Replacing service background also preserves all
four maintained research sections in `build_context`.

The full root suite passes **96/96**, MCP **93/93**, and service **137/137** after
the detailed PR review fixes. The unchanged diagnostic harness previously passed
**5/5** Python observer/grader regressions and **1/1** official-SDK schema regression.
Service/MCP typechecks, the required site
build and unchanged ledger check also pass. An earlier
[category-only ultra review](mcp-problem-read-ultra-review-2026-09-15.md)
ran 13 targeted tests without reproducing the previous continuation-performance
or diagnostic-budget issues. The later full-PR review found missing category
status and quadratic search boundary work; see the
[full review and fix verification](mcp-pr-ready-ultra-review-2026-09-15.md).
The subsequent [detailed PR review](mcp-pr-detailed-review-2026-09-15.md)
records the raw-ledger projection and legacy-session findings and their fixes.

The measurements below are historical evidence preserved in commit `1318543`,
before per-category status fields were added. Their payload sizes and timings
have not been rerun for the status fix; the current automated checks are above.

Three paired local measurements of that cached path read 400,000 and
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

A later [three-example acceptance run](mcp-example-acceptance-2026-09-15.md)
uses live local API responses and natural-language requests. It is separate from
the frozen-page marker diagnostic above.

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
