# MCP information access acceptance — 14 September 2026

The tested MCP-to-paper workflow supplied the complete maintained research context and reached relevant primary literature. It also found a directly relevant July paper absent from the catalog. A separate actual-model diagnostic exposed incomplete readback of larger direct MCP responses. The research-search default is therefore reduced from 65,536 to **32,768 UTF-8 bytes**. This is a conservative mitigation, not a guarantee that every host displays every record completely.

The scope is research preparation and information delivery. No scientific problem was solved, no catalog content/status/identifier was changed, and no remote service was activated. Measurements used the working tree based on `3bc74404504e977360014ef405019a8016aa8fe6`, catalog version `d76175295aaee4cd1437fe6d876f00acab20b2dc70414ad56d9b7aa3b2fb5c89` (111 records), and an installed Codex CLI `0.154.0-alpha.6.2` with `gpt-6-astra`, effort `ultra`.

## Literature handoff

An independent official-SDK → MCP HTTP → API HTTP audit retrieved research views and references for universal purification, virtual channel conjugation, and the solved ordinary-Petz counterexample: six successful MCP calls. The maintained statements, progress, commentary and bibliography were preserved. Primary-source inspection checked the distinctions between proved two-copy results and higher-copy conjectures, one-slot and multi-slot constructions, and ordinary versus averaged rotated Petz maps.

The links were useful, but a bibliography is not paper full text. Publisher access needed an arXiv alternative in one case; a large textbook HTML response needed a PDF reader. One shared book Source title embeds a chapter that disagrees with the current Reference body; another precise conjecture source requires following the linked project note. These are documented catalog/metadata follow-ups, not silently corrected scientific records. [Three-problem audit](mcp-information-access-literature-2026-09-14.md).

A separate model freely chose tools for this request:

> 请为 Universal purification with classically simulable operations 这道题准备研究资料。请从题库定位后，查阅原论文全文确认允许的操作、已证明结论和仍开放部分，给出可定位的章节或定理以及公开全文链接，并检查是否有较新的相关进展。请明确区分题库信息和外部核查，也明确说明没能读到的材料。不要尝试求解。

It completed in 347.52 seconds with two MCP calls and 19 web calls. The two MCP calls took approximately 62 and 49 ms as observed at CLI stdout, so the whole literature-reading duration is not an API-latency measurement. The run found [He, Xiong and Wang, arXiv:2607.08626v1](https://arxiv.org/html/2607.08626v1), submitted 9 July 2026, which was absent from the two catalog references. Independent reading verified its two-copy resource laws and multi-qubit CSPO no-go extension; it does not settle the catalog's arbitrary-copy question. The initial bounded independent search missed this paper, which is itself evidence against treating a short search as exhaustive.

The answer was accepted for research preparation with two wording notes: empty service discussions do not mean empty authored commentary, and a background theorem summary could state its full-support assumption explicitly. Recorded web events identify activity and URLs but do not retain all delivered passages or HTTP statuses; independent checks support the cited claims without proving that every claimed full-text section entered the model. [Independent grading](mcp-information-access-paper-grading-2026-09-14.md), [unedited answer](mcp-information-access-paper-answer-2026-09-14.md), [sanitized run record](mcp-information-access-paper-run-2026-09-14.json).

## Host delivery diagnostic

The eval-only MCP server freezes a real research page and adds three random 128-bit marker strings per problem. Removing these fields reproduces every original record and its original page hash. Markers sit at the start, immediately before `research`, and at the end; the field named `diagnosticMiddle` is **not** the byte midpoint or dense coverage of the research body. Expected values are outside the model's empty working directory and absent from its prompt.

Direct cases force only the `qop` namespace into direct tool presentation using the release's supported `direct_only_tool_namespaces` configuration. Each requires exactly one actual MCP call and rejects recorded foreign/shell/web/file or unknown tool paths. “Default cap” means no explicit output-limit override; it does not mean default Astra tool presentation or a verified numerical live-host limit.

| Direct case | Requested API budget | Actual original / decorated bytes | Problems | Exact marker readback |
| --- | ---: | ---: | ---: | ---: |
| Default host cap | 65,536 | 61,373 / 62,438 | 2 | 5/6 |
| Repeat, new random strings | 65,536 | 61,373 / 62,438 | 2 | 5/6 |
| Default host cap | 200,000 | 190,506 / 193,237 | 11 | 8/33 |
| Host cap 1,024 tokens | 200,000 | 190,506 / 193,237 | 11 | 2/33 |
| Host cap 100,000 tokens | 200,000 | 190,506 / 193,237 | 11 | 33/33 |
| Default host cap, smaller page | 32,768 | 23,057 / 23,936 | 1 | 3/3 |

Both 64 KiB runs missed the same before-research field of the second problem while retaining its beginning/end and the page count. All markers remained in raw tool events. The repeat, low-cap control and high-cap recovery support a presentation-budget effect. Missing markers alone could also reflect model omission; complete marker copying does not establish understanding or complete reading of intervening text. The 32 KiB run covered one 23,057-byte page, not every page near 32 KiB or every host. [Independent marker grading](mcp-information-access-visibility-grading-2026-09-14.md), [all eight runs with expected values, answers and original hashes](mcp-information-access-visibility-2026-09-14.json).

Two optional Code Mode-enabled runs copied 33/33 markers. They permit programmatic extraction and measure data accessibility only. Both remain automatically invalid because of an `error` event. The diagnostic rerun retained its message, which was manually classified as a startup warning about experimental Code Mode, before the first tool. The earlier opaque event cannot be retroactively classified. Neither raw eligibility flag has been rewritten, and the events do not establish whether programmatic extraction actually occurred.

The exact installed release source confirms separate budgets: direct MCP presentation uses one serialized `structuredContent`, while Code Mode receives the raw object and can accidentally print both representations. Its final cell output has its own limit. Truncation preserves head and tail while removing the middle, so surviving page counts or final references are insufficient evidence of completeness. [Exact-release source audit and official links](mcp-information-access-host-audit-2026-09-14.md).

## Resulting changes

- Research search defaults to 32,768 bytes. Explicit larger requests remain supported; complete records are never shortened to fit. A single oversized record still returns a structured 413 with the exact minimum needed for that cursor. Increasing it may require a compatible host output budget.
- Tool instructions distinguish service `comments[]` from authored `research.comment`, prefer citation-specific Reference text for chapter locations, and distinguish catalog information from external literature actually retrieved.
- Client documentation explains direct and Code Mode output controls, avoiding duplicated output, and HTML/PDF/publisher/arXiv fallbacks. Neither an updated catalog timestamp nor successful API delivery certifies exhaustive freshness or full model visibility.
- `run-research.py` supports an explicit custom question and opt-in live web; existing MCP-only scenarios still prohibit web. `run-visibility.py` and `visibility-probe.ts` make the isolated diagnostics reproducible without changing catalog text.

The equal-content local benchmark still retrieves all 25 complete algorithm records. Across three paired repetitions, individual reads used 26 MCP calls and a 550.23 ms median; research pages starting at 32 KiB used 18 calls and 190.76 ms. The latter includes a 413 retry, raises the budget to the exact required minimum, and retains that raised budget for later pages. These are local SDK retrieval measurements, not model-speed guarantees. Result byte totals serialize SDK `CallToolResult` objects, not HTTP wire bytes or model token input. [Measurement data](mcp-information-access-measurement-2026-09-14.json).

## Verification and reproduction

Root tests: 96/96; service: 119/119; MCP: 73/73. Service and MCP typechecks pass. The mandatory site build validates 111 problems, and ledger checking reports zero changed files. Real SDK traversal tests compare all 25 algorithm and all 99 unsolved research records with individual reads, exercising default-budget 413 retries and changing budgets across cursors without omission. Diagnostic harness checks cover local SDK integrity, fake-CLI controls and error-message retention. The ultra adversarial review found two evaluation-harness bugs, both fixed and covered by 3/3 Python regressions; historical direct-call logs were rechecked and remain valid. It found no actionable server regression. [Findings, corrections and verification limits](mcp-information-access-ultra-review-2026-09-14.md).

From the repository root, with dependencies installed and an already authenticated CLI:

```sh
python3 -m unittest discover -s mcp/eval -p 'test_visibility.py' -v
python3 mcp/eval/run-visibility.py --prepare-only --output /tmp/qop-visibility-fixture
python3 mcp/eval/run-visibility.py --case direct-defaultcap-32768 --case direct-defaultcap-65536 --output /tmp/qop-visibility-small
python3 mcp/eval/run-visibility.py --case direct-defaultcap-200000 --case direct-lowcap-200000 --case direct-recovery-200000 --output /tmp/qop-visibility-controls
node mcp/eval/measure-search.mjs --max-bytes 32768 --output /tmp/qop-search-measurement.json
python3 mcp/eval/run-research.py --model gpt-6-astra --effort ultra --allow-web --as-of 2026-09-14 --question '请为 Universal purification with classically simulable operations 准备研究资料，核查原始文献和较新进展，区分目录与外部证据，不要尝试求解。' --output /tmp/qop-paper-handoff
```

Choose new output directories for each diagnostic. Set `--codex` when the CLI is not on PATH. Model runs consume provider resources and can differ from these samples. Published artifacts omit raw paper/tool bodies, internal thread identifiers, local paths and temporary endpoints; the marker evidence retains expected strings, answers, scores and hashes, including failures and controls.
