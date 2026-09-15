# Detailed PR review

The complete PR diff from `e4d58d143c6d3999ae27cc35a9602f53da3be01d`
to `c377a1f1eb331df00b1510a1f243616a13acc040` was reviewed again across
transport, search/pagination, scientific read projections, context construction,
idempotent writes and catalog projection validation. Four P2 issues were
reproduced and corrected. No scientific catalog, TeX, ledger or activity data
was edited.

## Findings and fixes

1. **Decision rationale was omitted.** `currentDecisions` returns record fields;
   the Markdown rationale lives on the loaded ledger record. Reading `d.body`
   therefore omitted the reason from problem, frontier and contribution views,
   and from the new `comment` category. The projections now hydrate the selected
   Decision's original body without changing decision selection or authority.
   Tests compare directly with raw ledger text, including the native problem's
   actual refutation rationale.
2. **Source-only updates could preserve an obsolete reading version.** Source
   summaries omitted bibliographic version, citation body and revision. Changing
   those fields could leave the derived problem document identical, so a previous
   cursor remained accepted after the source changed. Summaries now include
   `version`, `revision`, `citation` and a `sha256:` digest of the complete current
   Source record. The MCP schema accepts that exact digest representation.
   Valid independent version, body and title updates now return 409 for old
   cursors and pinned document versions. Redacted sources expose their current
   tombstone, without restoring historical citation text.
3. **Replacing service background could hide maintained research in context.**
   A legal Problem body revision can preserve `authoredCatalog` while replacing
   the generated Markdown background. `build_context` previously read only the
   replacement body and could report no omitted sections while excluding the
   maintained research. It now adds whole `authoredSource`, `authoredProgress`,
   `authoredComment` and `authoredReferences` sections under the existing budget.
   Independent service background remains present; only a proven duplicate
   catalog body is suppressed. Formal sections retain priority, and omitted
   optional material has explicit flags and resource links. JSON and provenance
   encoded inside section text count toward that text budget.
4. **Idle legacy sessions could deny new connections.** One unauthenticated
   client could occupy all 256 session slots within two rate windows, then keep
   them alive without active operations. Other legacy clients received 429.
   Ordinary SDK `Client.close()` also leaves the server session allocated unless
   it is explicitly terminated. At capacity the server now reclaims the least
   recently used idle session, protecting active requests and initializing
   sessions. Replacement capacity is reserved synchronously before asynchronous
   teardown, preventing concurrent admission from exceeding the cap. Reclaimed
   clients receive 404 and reinitialize. When every slot is active or initializing,
   capacity rejection remains intentional backpressure.

The architecture document also incorrectly described cursor pagination as future
work. It now describes the implemented query/version-bound cursors and separates
them from future historical resource pinning and subscriptions.

## Verification

A fresh read-only Codex `gpt-6-astra` run at `ultra` reviewed the complete
uncommitted follow-up patch against `c377a1f` and reported **no actionable
findings**. It passed 17 targeted service tests, MCP typechecking, and independent
probes covering five successive Source revisions, all four category versions,
MCP schemas and tombstone safety. Its HTTP race assessment used code and installed
SDK inspection; the real loopback and full-catalog execution below were separate
root checks. Review processes were capped below 60 seconds each and did not edit
files, spawn agents or run provider/model tests.

Final complete local suites passed: **96 root tests, 137 service tests and 93 MCP
tests**. Service/MCP typechecks, the required site build and zero-change ledger
consistency check passed. The build contains 111 problems: 99 Unsolved and 12
Solved.

Official SDK → MCP HTTP → API HTTP acceptance reconstructed **111 problems × four
categories**, producing **444 exact category results over 552 default 8 KiB
pages**. Continued category counts are statement 1, history 7, references 74,
comment 0. The largest reference content is 29,360 compact JSON bytes before the
API envelope and still fits in a whole 32 KiB response. The increase from 519 pages
reflects the restored Source content and identity metadata.

The new raw-ledger and HTTP cases cover Source-only revisions, Decision reasons,
and maintained context after a valid service body replacement. Five transport
regressions cover official SDK disconnect/reconnect, LRU ordering, active-call
protection, initialization/expiry protection, and simultaneous replacement with
delayed teardown. Gates have three-second deadlines and the new tests have
ten-second limits. HTTP and stdio transport checks passed **37/37**.

Independent inspection reproduced the three read-model failures before fixes
and checked the corrected projections against raw ledger records afterward,
including redactions, changes outside displayed Source fields, native background
and exact formal-budget priority. The Source digest schema mismatch found during
this check was corrected before complete validation.

The separate search review found no new actionable issue. Six real-catalog cursor
walks matched complete result order without duplicates, and all 111 problems had
TeX history dates. Contract projection, idempotency and adapter checks passed
**17/17**, including real loopback replay and restart cases. Tests and independent
review provide bounded evidence; they do not establish bug freedom or guarantee
every MCP host exposes all returned bytes.

Earlier provider/model examples remain pinned to `1318543`; this review does not
relabel their payload sizes or timings as measurements of these fixes. The public
MCP remains read-only. The four content categories and intentional omission of
contributor credits from ordinary research responses are unchanged.
