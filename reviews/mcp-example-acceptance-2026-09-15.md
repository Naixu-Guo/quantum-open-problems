# Three natural-language MCP examples

These examples ran against commit `13185434da0eb7ddd5c09abdaf6acd13679145fe`
using the real local MCP HTTP server, API and maintained catalog. There was no
response replay or synthetic marker injection. The client was Codex CLI
`0.154.0-alpha.6.2`, `gpt-6-astra` with `ultra` effort; QOP was forced into direct
MCP presentation without an output-cap override. Each example was an independent
session with read-only catalog tools and no external literature access or solving.
These runs preceded the follow-up search-boundary fix and addition of `status`
and `statusSource` to each category. Their byte counts and timings describe that
recorded revision, not a rerun of the latest implementation.

| Request | Observed reading | Result |
| --- | --- | --- |
| Draw an unsolved quantum-algorithm problem, then read its definition and history | Taxonomy; one uniform sample over 25 matching problems; separate statement and history reads | Universal purification with classically simulable operations; both categories complete, 4,638 and 4,490 API JSON bytes |
| Compare a few relatively approachable algorithm problems | 25 summaries, five complete problem details, three frontiers | Three candidates compared; all 25 difficulty fields are `unrated`; recommendation explicitly subjective, with no claim of reading all 25 details |
| Give a recently resolved problem with history and references | 12 solved summaries; one research-search page; separate history, references and comment reads for the ordinary-Petz CMI problem | Distinguishes 10 September counterexample submission from 12 September project verification; does not equate editing with discovery/publication or claim globally latest resolution |

There were 4, 10 and 5 matching tool starts/completions respectively: **19 in all**,
with no recorded foreign tools, unfinished calls or interface errors. Each CLI
text result parsed to the same object as its structured result. Independent
review checked the scientific qualifications and quoted catalog evidence.
Host-observed total durations were 65.26, 156.27 and 92.38 seconds, including
model processing and transport; they are not API latency measurements.

Important coverage boundaries:

- These category calls all returned whole objects with `format: "json"`. The model explicitly
  selected larger byte budgets, so these examples do not validate the default
  8 KiB limit or continuation. Separate SDK and frozen-page diagnostics cover
  those paths in the [category acceptance report](mcp-problem-read-2026-09-15.md).
- The selection example used `get_problem`, not the new category tool. The sample
  response already contained research details before the requested category reads.
  The observations therefore do not establish minimal-call client behavior.
- The research search requested four rows but returned one whole problem within
  its byte budget. Its continuation was not followed; the answer presents a recent
  example, not a resolution-date ranking of every solved problem.
- Exact response capture does not establish that the model understood every
  character, or that an arbitrary host displays the entire response.
- Contributor credits and webpage interface elements are intentionally outside
  ordinary research-response scope. The scientific sections remain available.

The Petz example exposed an existing shared bibliography inconsistency: its own
bibliography and Reference body name Wilde Section 12.7, while the shared Source
**title** contains Section 20.3. The answer reported the discrepancy and did not
claim to have checked the book. This is a catalog-metadata follow-up; the MCP
preserves the problem-specific citation, and this PR does not reauthor the source.
Raw calls and independent detailed grading were retained in the local task
artifacts supplied to the maintainer; this summary omits local endpoints and paths.
