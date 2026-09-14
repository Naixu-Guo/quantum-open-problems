# Full-PR adversarial review and fix verification

On 2026-09-15, a new read-only Codex `gpt-6-astra` review at `ultra`
examined the full production diff from main
`e4d58d143c6d3999ae27cc35a9602f53da3be01d` to PR head
`13185434da0eb7ddd5c09abdaf6acd13679145fe`. It found two actionable P2 issues.
The fixes below were then independently reviewed in a second fresh ultra run
against `1318543`, before committing them with this report.

## Findings and corrections

1. **Category reads omitted authoritative problem status.** The solved metrology
   problem `op_09b9fa91a1ac1a76` retained `open` service clause states, while
   category responses lacked the problem's status and its source. Every category
   now includes the exact binary `status` and `statusSource` from the research
   detail. They live inside fragmentable content, so large provenance remains
   readable at small budgets. Missing or invalid authority fails explicitly;
   service clause evidence states remain unchanged. Tool descriptions and
   schemas distinguish these two kinds of status.
2. **Rejected search occurrences triggered quadratic boundary work.** A short
   query inside a long word repeatedly copied whole prefixes and suffixes just
   to inspect neighboring characters. Boundary checks now inspect at most one
   adjacent Unicode code point. Regression cases also cover astral letters and
   numbers, overlapping occurrences, and literal punctuation. In three paired
   local runs, a 16 KiB repeated-word case decreased from median 807.6 ms to
   0.34 ms. This is synthetic in-process matching, not HTTP or model latency;
   [all repetitions and scope](mcp-search-boundary-measurement-2026-09-15.json)
   are preserved.

The follow-up review concluded:

> No actionable P0–P3 findings. Neither prior P2 issue reproduces, and I found no concrete regression in the scoped fixes against `1318543`.

## Verification and limits

The full-PR reviewer executed 68 targeted tests, 32 legacy/2026 SDK tool checks
through an in-memory HTTP parser, and MCP typechecking. It did not execute
real-network transport or disk-backed crash/restart fixtures.

The independent follow-up executed 32 targeted tests covering reader semantics,
search, strict MCP schemas and diagnostic fixtures. It additionally checked
126 SDK pages across five documents and four categories with changing budgets;
the solved problem retained `Solved` and its exact source alongside unchanged
`open` clauses, and large provenance reconstructed exactly. An independent
matcher agreed on 30,000 Unicode/literal cases. One-character and 2,048-character
queries showed roughly linear growth across measured document sizes through
1 MiB. These are bounded observations, not a general complexity proof.

Both review runs were read-only and capped each test process at 60 seconds.
The follow-up sandbox blocked an initial heredoc wrapper; file-free invocations
succeeded. It did not run real HTTP, provider/model tests, or fixtures requiring
filesystem writes. No review run edited files or spawned agents.

Separate final integration checks on the corrected implementation passed:

- Root tests **96/96**, service **134/134**, MCP **88/88**.
- Official SDK → MCP HTTP → API HTTP: **111 problems × four categories**,
  **444 exact projections over 519 default 8 KiB pages**. This includes the
  solved/open-clause conflict and an unsolved countercase, continuation, real
  independent Source/Comment updates, and retained native/later service content.
- Python observer/grader regressions **5/5**, official-SDK diagnostic schema
  regression **1/1**, and service/MCP typechecks.
- Required site build: **111 problems**, **99 Unsolved / 12 Solved**. Ledger
  consistency check reports **zero changed files**; scientific catalog records,
  permanent identifiers, TeX, ledger and activity data are unchanged.

A separate bounded transport/auth inspection found no additional concrete
finding; six existing in-memory/mock checks covered authenticated schemas,
cancellation, request-key isolation and uncertain unkeyed writes. That inspection
is distinct from both ultra runs and the real HTTP integration suite.

The earlier actual model readbacks remain evidence for their recorded revision
`1318543`, before these two fixes; they were not rerun or relabeled as current.
See [category acceptance](mcp-problem-read-2026-09-15.md) and the
[three natural-language examples](mcp-example-acceptance-2026-09-15.md).
Contributor credits and webpage controls remain outside ordinary research
returns by design. These checks do not prove bug freedom, universal host
visibility, scientific understanding, or current coverage of external literature.
