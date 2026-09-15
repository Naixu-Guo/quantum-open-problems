# MCP information sufficiency and literature handoff audit

Audited on **14 September 2026**, against commit `3bc74404504e977360014ef405019a8016aa8fe6` and catalog version `d76175295aaee4cd1437fe6d876f00acab20b2dc70414ad56d9b7aa3b2fb5c89` (111 records). This was an information-access and evidence audit, not an attempt to solve an open problem. No catalog or production files were changed.

The current MCP supplies enough authored context to identify the three problems, distinguish proved results from remaining questions, and follow their references. **It does not itself supply the cited papers' full text or a current-literature guarantee.** Following the locators worked for the main evidence, with two meaningful format/access fallbacks. One shared-source title that conflicts with the current reference, one additional citation discoverable only through the linked note, and a directly related July 2026 paper absent from the catalog are concrete handoff gaps. The July paper was found by the separate model run and then independently checked; the initial bounded search missed it.

## What was actually read through MCP

An official SDK client pinned to protocol `2026-07-28` connected to `mcp/eval/serve-catalog.ts`: SDK → MCP HTTP → API HTTP → maintained catalog. The local server used in-memory stores, no API key, no remote synchronization and no commits, and was closed after the probe. Exactly six successful tool calls were made: `get_problem(id, view="research")` and `list_references(id)` for each row below.

| Problem | Status | Research source / progress / comment / reference entries |
| --- | --- | --- |
| `op_a64dc63d6ae49127`, universal purification with classically simulable operations | Unsolved | 1 / 3 / 1 / 2 |
| `op_06e9f0c7b3b62f3b`, multi-slot virtual channel conjugation | Unsolved | 1 / 4 / 1 / 2 |
| `op_87c77263c8bab523`, ordinary-Petz CMI recovery bound | Solved | 1 / 3 / 1 / 5 |

The nine returned reference sources all say `completeness: "partial"`. They expose `doi`, `arxivId`, `url`, title, kind and date, but no abstract, paper text, PDF/HTML URL fields, access result, retrieved version or literature-search date. `authors` is empty and `venue` is blank in all nine structured sources, although the authored bibliography strings contain those details. The source `date` is generally just a year and is null for the project counterexample note. These are metadata limitations, not missing authored bibliography paragraphs.

The reproducible probe `qop-mcp-literature-probe-20260914.mjs` and raw responses `qop-mcp-literature-payloads-20260914.json` are temporarily retained outside this repository; they are not included with this report. Raw-response SHA-256: `3e2194d60619f6c6805470ea7413795443f3aee66f708117920b56738a54a1d5`. Only this report is included here; raw responses and downloaded paper full text are not included. Public links and theorem locators below support independent scientific checks.

## Locator and access results

“Full HTML” means that a primary full-paper document with its theorem/proof sections was retrieved and relevant passages inspected. It does not mean every line was reviewed. The browser's internal fetch errors below do not establish that a DOI is invalid or that access would fail for every client.

| MCP reference | Actual handoff result |
| --- | --- |
| HZY+26, purification | [APS DOI](https://doi.org/10.1103/bdw8-k91v) resolved to metadata/abstract, confirming PRL 136, 090204 and publication on 4 March 2026; article text required subscription. [arXiv v2 full HTML](https://arxiv.org/html/2504.10516v2) supplied theorem statements and appendices. |
| CEM99, unrestricted purification | DOI fetch returned an internal error in this browser. [arXiv metadata/abstract](https://arxiv.org/abs/quant-ph/9812075) was retrieved. The initial audit inspected metadata only. During the subsequent model-answer grading, the [four-page PDF](https://arxiv.org/pdf/quant-ph/9812075) was retrieved and pages 2–3, equations (13) and (16), were checked. |
| ZTZ+26, virtual conjugation | MCP arXiv link resolved; [v1 full HTML](https://arxiv.org/html/2602.05828v1) was retrieved. |
| BGSQ26, multicopy transposition | MCP `url` preserves `v2`, although `arxivId` is unversioned. [v2 full HTML](https://arxiv.org/html/2603.23628v2) was retrieved. |
| BSW15, Rényi CMI | DOI fetch returned an internal error; [arXiv v6 full HTML](https://arxiv.org/html/1403.6102v6) was retrieved. |
| Wil17, Wilde textbook | DOI fetch returned an internal error. [arXiv metadata](https://arxiv.org/abs/1106.1445) resolved. HTML retrieval failed with `Content length is too large: 14502142`; the [774-page arXiv PDF](https://arxiv.org/pdf/1106.1445) was successfully retrieved and searched. |
| JRS+18, universal recovery | DOI fetch returned an internal error; [arXiv full HTML](https://arxiv.org/html/1509.07127) was retrieved. |
| STH16, pinched recovery | DOI fetch returned an internal error; [arXiv v3 full HTML](https://arxiv.org/html/1507.00303v3) was retrieved. |
| Pet26, project counterexamples | The [public GitHub note](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md) rendered the complete note, enclosures, verifier link and reproduction command. Raw-file fetching failed in this browser. This is a public project note, not a journal paper. |

## Checks of the scientific handoff

**Purification.** The paper's equations (1)–(3) define the allowed trace-nonincreasing maps and success-conditioned average fidelity. Theorem 1 is the two-copy odd-dimensional CPWP result; Theorem 2 is the two-copy qubit CSPO result. Table 1 supplies numerical three-/four-copy evidence for qubits and qutrits. Appendix D, equations (S53)–(S54), gives the qubit two-copy value `1-delta/2` for every success probability in `(0,1]`. This supports the MCP distinction between a theorem and numerical evidence, and between a specific ensemble and Haar-universal purification. The proposed three-copy analytic result remains a question in the inspected source, not something the audit established. [He et al., full text](https://arxiv.org/html/2504.10516v2)

**Virtual conjugation.** Theorem 4 gives the minimum base norm `d_A d_B - d_A + 1` for a **one-slot** virtual comb acting correctly on every CPTP channel. The discussion explicitly leaves multi-slot extensions for future work. Thus a user needs the slot count and physical/virtual distinction, both retained by MCP. [Zhu et al., full text](https://arxiv.org/html/2602.05828v1)

The later paper's title emphasizes pure states, but its Theorem 3, equations (14)–(15), concerns transposition of arbitrary mixed-state copies with white-noise visibility. For `N >= d-1`, the upper visibility is `N/[d(d-1)+N]`; the lower endpoint is `-1/(d-1)`. This is the relevant input for the catalog's state-preparation construction. The paper's optimal **visibility** theorem must not be relabeled an optimal **virtual base-norm** theorem: the catalog's `g_2(1,2) <= 5/3` remains an upper bound. The MCP text preserves that qualification. [Brzić et al., Theorem 3](https://arxiv.org/html/2603.23628v2)

**Ordinary Petz.** The public note supplies three-qubit matrices, compatible marginals, squared fidelity, base-two logarithms and certified negative gaps. It explicitly distinguishes the 10 September submission from 12 September editorial verification and makes no external-peer-review or historical-priority claim. The note links an independent exact-arithmetic verifier; this audit inspected its availability and reproduction instructions but did not rerun it. [Public counterexample note](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md)

Following that note reached an additional primary source absent from the MCP's five-reference list: Seshadreesan and Wilde, arXiv:1410.1441v8. Equations (1.4), (1.6) and (1.7) state the precise conjectured ordinary-Petz inequality, recovery map and squared-fidelity convention. The full paper was retrieved; the conjecture was not mistaken for one of its proved results. [Original conjecture, full text](https://arxiv.org/html/1410.1441v8)

The retrieved universal-recovery paper instead uses root fidelity in equation (8), and Theorem 2.1 / Remark 2.2 average rotated Petz maps; Corollary 4.1 applies that recovery map to CMI. This verifies the important boundary: the project's ordinary-map counterexample does not refute an optimized or averaged-rotation recovery theorem. [Junge et al., full text](https://arxiv.org/html/1509.07127)

## Concrete gaps and bounded improvements

1. **A shared source title can send a reader to the wrong chapter for this reference.** `list_references` returns Reference `01M1Q787QRAQ0DEAA71K8S90X5` with `Sec. 12.7` in its body, but nested Source `01M1Q787QR8PQGPN8E8ZN5FMKY` says `Section 20.3` in its title and has kind `paper`. In the retrieved Wilde v8 PDF, section 12.7 is the recoverability history (printed pages 384–386; the ordinary-Petz conjecture appears on page 385), whereas section 20.3 is the classical capacity theorem. The Source is shared across references: globally replacing its chapter with 12.7 would not be an appropriate fix. The smallest readability improvement is to prefer the current Reference's body/locator and keep a shared book title free of reference-specific chapters. The correct authored reference should remain intact. [Wilde PDF](https://arxiv.org/pdf/1106.1445)
2. **The most precise conjecture locator needs an extra hop.** The Petz note's arXiv:1410.1441 equations are available publicly but not directly listed among this problem's MCP references. Adding an authored reference and precise locator is a reviewable catalog follow-up; this audit did not add it.
3. **Paper availability differs from bibliography availability.** Successful arXiv/DOI metadata resolution is not successful full-text retrieval. A reading workflow should record the accessed format and version, preserve publisher and arXiv alternatives, and report a failed HTML/PDF attempt explicitly. The Wilde HTML-size failure and He publisher access restriction are observed examples, not hypothetical concerns.
4. **Research locators currently point into the catalog.** A `progress:2` locator is scoped to a Problem revision; it is not a paper theorem or PDF-page locator. Preserving complete catalog text is valuable, but machine-readable links from a specific research paragraph to a pinned paper theorem/section would reduce follow-up ambiguity. For these cases, useful anchors are He Theorems 1/2 and Table 1, Zhu Theorem 4, Brzić Theorem 3 / equations (14)–(15), and Seshadreesan–Wilde equations (1.4)/(1.6)/(1.7).

## Current-literature search and limits

Targeted searches were run on **14 September 2026** using the exact queries below. Returned non-primary summaries and unrelated results were not used as scientific evidence. No later paper resolving either remaining catalog question was identified in the primary material retrieved in this bounded audit. That is a search outcome, not proof that no such paper exists.

Two later purification hits illustrate why matching titles is insufficient. [arXiv:2604.15228v2, full HTML](https://arxiv.org/html/2604.15228v2) studies **energy-preserving** operations, a different restriction; I did not find a resolution of the CSPO/CPWP question there. [arXiv:2607.06683, abstract only](https://arxiv.org/abs/2607.06683) concerns monitored Clifford-circuit rank/entropy dynamics, a different task from recovering an unknown input's Haar-averaged fidelity. It was screened as a scope mismatch, not counted as a solution. The virtual-conjugation searches identified the original preprint and the already-cited multicopy-transposition work, without a verified later result settling the virtual optimum. The Petz title searches did not locate an external publication or peer review of the project note; no priority claim follows.

```text
"2504.10516" purification 2026 conjecture
"2602.05828" multi slot overhead
"2603.23628" virtual conjugation overhead
"ordinary Petz" "counterexample" mutual information
site:arxiv.org "universal purification" "stabilizer" "2026"
site:arxiv.org "virtual" "conjugation" "multi-slot"
site:arxiv.org "Petz" "counterexample" "fidelity"
"2504.10516" "three" "proof"
"virtual channel conjugation" optimal overhead 2026  [domain filter: arxiv.org]
"Petz" "conditional mutual information" "counterexample"  [domain filter: arxiv.org]
"Two three-qubit counterexamples"
```

Catalog edit dates, arXiv version dates, journal publication dates and this audit's literature-search date have different meanings. In particular, the audited MCP gives revision provenance for the maintained summaries; it makes no verified claim that the external literature has been exhaustively searched through that revision date.


## Supplemental finding from the independent model run

After the initial searches above, the separate live-web model run found [He, Xiong and Wang, arXiv:2607.08626v1](https://arxiv.org/abs/2607.08626), submitted **9 July 2026**. I independently retrieved its [full HTML](https://arxiv.org/html/2607.08626v1) and checked Theorems 1–2, Corollary 3 and appendices C–D. Theorem 1 quantifies the **exponentiated** mana cost for two-copy odd-dimensional purification; Theorem 2 gives robustness bounds for multi-qubit systems, coinciding for one qubit. Corollary 3 extends the two-copy CSPO no-go result to multi-qubit inputs. The discussion explicitly leaves more copies for future work. This is directly relevant progress missing from the audited catalog, without closing its arbitrary-copy question.

The initial bounded audit **missed this paper**. The model search included `"universal" "purification" "magic" "2026"` and subsequently `"2607.08626"`; its saved search results do not establish which exact query first surfaced it. This difference is concrete evidence against interpreting either a catalog revision date or a short search as exhaustive freshness.

The grading also checked [arXiv:2509.21111v2, full HTML](https://arxiv.org/html/2509.21111v2), updated 14 June 2026. Its exact-output and approximate sample-complexity obstructions do not establish the catalog's stronger no-positive-fidelity-gain claim. No record was reauthored, and no open problem was solved in this audit.
