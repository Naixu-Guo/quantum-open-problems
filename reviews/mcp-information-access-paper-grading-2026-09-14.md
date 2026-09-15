# Independent grading: MCP to primary-literature handoff

**Verdict: accepted for the requested research-preparation task, with two minor wording notes.** The answer preserves the original conjecture's scope, separates proved cases from numerical evidence, finds a real later development missing from the catalog, and does not attempt to solve the problem. It is not an exhaustive literature review or a proof audit.

Evaluated on 14 September 2026 against commit `3bc74404504e977360014ef405019a8016aa8fe6`, catalog version `d76175295aaee4cd1437fe6d876f00acab20b2dc70414ad56d9b7aa3b2fb5c89`. The original evidence set, labelled `qop-mcp-paper-model-20260914`, is temporarily retained outside this repository. It contains `case-1.answer.md`, `case-1.events.jsonl`, `case-1.timings.jsonl`, `runs.json` and `environment.json`; these files are not included with this report. See the [independent three-problem literature audit](mcp-information-access-literature-2026-09-14.md).

## Actual run and retrieval coverage

The model was `gpt-6-astra`, effort `ultra`, with live web enabled. It completed in **347.52 seconds**: **2 MCP calls and 19 web calls**, exit 0. MCP calls were research search for the exact title followed by `get_problem(view="research")` for `01M1Q787QRD6APNHX659G4CTEF`. Both successfully returned one complete problem, including 1 source paragraph, 3 progress entries, 1 authored comment and 2 references. The original TeX statement in clause `main` and every authored research string exactly match the source catalog; the two calls' research and statement objects also agree. JSON in MCP text matches structured content. No truncation is visible in those recorded payloads; this does not prove absence of model-internal context truncation.

Host-observed MCP durations were 0.062420 and 0.049452 seconds. The first tool started at 16.691571 seconds and the last web tool completed at 272.536787 seconds. Some calls overlap, including the second MCP call with the initial web call and a three-web-call group. These are event-arrival timings, not pure server or model latency. One run establishes neither p95 nor typical literature-handoff duration. Usage: 2,348,215 cumulative input tokens, including 2,151,936 cached; 6,822 output tokens, including 2,673 reasoning output tokens. Cumulative input is not unique paper volume or a monetary bill.

Recorded completed tools contain only the authorized qop MCP and web activity. The harness reports `contamination: []`. Stderr nevertheless contains one internal `collab spawn failed` error; no successful collaborator or outside-tool result appears in the events. Thus the supported claim is **no recorded successful contaminating tool use**, not that no attempt occurred.

## Scientific evidence checks

| Item | Independent check and judgment |
| --- | --- |
| Catalog scope | Correct: unknown pure state, identical depolarized copies, d=2 or odd, n≥2, 0<δ<1, Haar average, fixed average success probability 0<s≤1 and CP trace-nonincreasing successful branches. The allowed CSPO/CPWP restriction applies to the operation; the input is not assumed to be a stabilizer state. |
| Original no-go paper | [arXiv:2504.10516v2 full text](https://arxiv.org/html/2504.10516v2) supports Definitions S2/S3, equation (1), S16, Theorems 1/2 and appendix results S31/S54. Analytic claims are restricted to two copies. Table 1's additional qubit/qutrit n=3,4 cases are correctly called numerical. The paper's conjectural language and finite-ensemble exception are correctly separated. |
| Background paper | [Cirac–Ekert–Macchiavello PDF](https://arxiv.org/pdf/quant-ph/9812075), pages 2–3, contains the angular-momentum procedure, equation (13) branch fidelity, two-copy example and optimality argument near equation (16). The answer's locators are supported. |
| July 2026 progress | [arXiv:2607.08626v1 full text](https://arxiv.org/html/2607.08626v1) supports Theorem 1 / S48–S49 (**exponentiated mana**, not mana itself), Theorem 2 / S79–S81 (robustness bounds; equality for one qubit), and Corollary 3 (two-copy multi-qubit CSPO no-go). The feasible target-pair qualification and remaining higher-copy work are correctly stated. The paper is a new preprint, not described as peer-reviewed. |
| General purification no-go | [arXiv:2509.21111v2 full text](https://arxiv.org/html/2509.21111v2) supports the distinction between exact pure-output obstruction / approximate sample complexity and this catalog's no-improvement conjecture. The answer does not mistake the title for a solution. |
| Energy-preserving paper | [arXiv:2604.15228v2 full text](https://arxiv.org/html/2604.15228v2) supports Theorems 2 and 4 and the different operation class. A precision note is needed if restating these results as standalone theorems: they assume equation (6), full support of the Haar-averaged noisy n-copy ensemble. Nontrivial depolarizing noise satisfies this condition. |
| Dates and freshness | Catalog edit date, arXiv version dates and journal publication date are distinguished. [APS metadata](https://doi.org/10.1103/bdw8-k91v) supports PRL 136, 090204, 4 March 2026. [July preprint metadata](https://arxiv.org/abs/2607.08626) supports 9 July submission; [Liu et al. metadata](https://arxiv.org/abs/2509.21111) supports 14 June v2; [energy-paper metadata](https://arxiv.org/abs/2604.15228) supports 19 August v2. No exhaustive-current-status guarantee is claimed. |

The original independent bounded search missed the July resource-law paper. After the model identified it, the grader independently retrieved and checked the full primary text. This is useful new information, and also an observed limitation of short literature searches. The paper's existence is not proof that other later work was exhaustively excluded.

## Read-trace limits and small corrections

The saved web events contain search queries and human-readable URL summaries, including primary HTML/PDF targets. Most have `action.type="other"`; they do **not** retain fetched page bodies, sections delivered to the model, HTTP responses or exact full-text coverage. Independent retrieval verifies that the cited theorem passages exist and support the answer. It cannot independently prove the model read every claimed appendix line. In particular, the answer's exact `401 Unauthorized` observation is not recoverable from this event log; the independent audit confirmed publisher metadata/access restriction and successful arXiv alternatives, not that specific model HTTP response. Keep these distinct.

Two nonblocking edits would improve the answer:

1. Replace “评论、裁决均为空” with “服务讨论评论与裁决为空；目录的 Comment 研究说明有一段”. Top-level `comments=[]` and `decisions=[]` are true, but `research.comment` contains text. The answer elsewhere cites `comment:0`, so this is ambiguity rather than lost research content.
2. Add the equation (6) full-support assumption to the energy-preserving theorem summary. The original purification problem's conditions are already complete, and no incorrect application to CSPO/CPWP was made.

## Actionable handoff improvements

- Describe `comments` as service discussions and `research.comment` as authored catalog commentary in tool documentation; preserve both data sources.
- Preserve bibliography and pinned versions while offering explicit paper metadata/HTML/PDF locators. An access record should distinguish metadata, abstract and full text, and record inspected theorem/section and retrieval time; a link alone is not a read receipt.
- Keep catalog revision provenance separate from any literature-search date. The July paper is a candidate for a reviewed catalog update, not automatic status mutation.
- Improve evaluation telemetry to capture a sanitized URL, version/format, access result and delivered-section record without publishing full copyrighted paper text. The current events substantiate tool use and correctness checks, not complete full-text-read traceability.

No production repair or repeat model run is required to accept this sample. The two wording notes and telemetry/bibliography gaps are bounded follow-ups. The grading report contains public scientific data only. Raw events, stderr, environment metadata and downloaded paper full text are not included. No credentials or unpublished scientific content were observed in the inspected answer/events/environment artifacts.
