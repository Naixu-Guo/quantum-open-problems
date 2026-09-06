# Corrections to early catalog export provenance

The initial metadata migration happened on 2026-09-04. Until the export
provenance fix, new Source and Reference records reused that migration's
`createdAt` and `createdBy`; later Problem and Statement revisions also used
the migration actor. Those headers describe neither scientific authorship
nor a review, and the reused creation date is incorrect for later additions.

In particular, the ZW26 link in
`ledger/problems/op-12fc55f67580588e/references/01M1Q787QR1KDGTN3D2FFQE1NP.r1.md`
was first committed by `e0ceab8156a51d4285fcf77571bd3e34dabfe866` at
2026-09-06T11:06:52Z, despite its 4 September creation header. The exact
pre-commit export time is not recoverable from that header. The two Problem
r2 files and op-12fc's statement v2 in that commit were mechanical catalog
exports; their migration-actor attribution was also incorrect. Git records
the editorial commit, and the authored records identify the cited researchers.

These immutable files and their existing hashes are retained. The dedicated
catalog exporter actor now records new export operations at the actual export
time. This correction does not invent a reviewer or amend the mathematical
status decision. Scientific conclusions and their source checks should be
reviewed separately from export implementation changes.
