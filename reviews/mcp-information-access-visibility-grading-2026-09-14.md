# Independent grading: MCP result visibility diagnostic

**The recorded marker scores are correct.** In this forced-direct CLI configuration, the 64 KiB page repeatedly failed complete readback; the 200,000-byte page improved from 8/33 markers at the host default to 33/33 with an explicit 100,000-token tool output cap. The 32 KiB case returned one problem and read back all 3 markers. This supports a conservative smaller default for this observed path, **not universal host compatibility, whole-page understanding, or scientific comprehension**.

Audited 14 September 2026. All cases use `gpt-6-astra`, effort `ultra`, the same maintained 25-algorithm-problem population and catalog version `d76175295aaee4cd1437fe6d876f00acab20b2dc70414ad56d9b7aa3b2fb5c89`. The original evidence sets, labelled `qop-mcp-visibility-{direct,recovery,small-and-repeat,accessibility,accessibility-diagnostic}-20260914`, are temporarily retained outside this repository. Each contains `runs.json` plus per-case `expected.json`, `answer.json`, `events.jsonl`, `probe.json`, `raw-result.json`, `served-calls.jsonl` and `prompt.txt`; these files are not included with this report.

## Independently reproduced results

“Default cap” means **no explicit host output-token-limit override**; its numerical value is not known. API budgets are bytes, distinct from tool output token limits and MCP framing.

| Case | Requested API maxBytes | Actual original / decorated page bytes | Problems returned | Marker matches | Exact matches by start / before-research / end |
| --- | ---: | ---: | ---: | ---: | --- |
| Direct, default cap | 65,536 | 61,373 / 62,438 | 2 | 5/6 | 2 / 1 / 2 |
| Direct, default cap | 200,000 | 190,506 / 193,237 | 11 | 8/33 | 3 / 2 / 3 |
| Direct, cap 1,024 | 200,000 | 190,506 / 193,237 | 11 | 2/33 | 1 / 0 / 1 |
| Direct, cap 100,000 | 200,000 | 190,506 / 193,237 | 11 | 33/33 | 11 / 11 / 11 |
| Direct, default cap, smaller page | 32,768 | 23,057 / 23,936 | 1 | 3/3 | 1 / 1 / 1 |
| Direct, default cap, repeat | 65,536 | 61,373 / 62,438 | 2 | 5/6 | 2 / 1 / 2 |

The 64 KiB runs used fresh random values but missed the **same field of the same second problem**, `01M208CJ9MKVF4X0B83M9V7QZM`: `diagnosticMiddle`, explicitly returned as null. Both runs copied its start and end correctly. At 200,000 bytes/default cap, row patterns were `111,100,000,000,000,000,000,000,000,001,111`, where bits denote the three markers. The 1,024-token control retained only the first row's start and last row's end. All omitted markers remain present in the raw CLI tool event.

`diagnosticMiddle` is **not a byte midpoint**: it is a property inserted immediately before `research`. The repeated missing marker is at byte 24,947 of the decorated 64 KiB page, only 3.2% into that problem's serialized object. The smaller case's corresponding marker is approximately 5% into its problem. These are boundary/location probes, not continuous sampling throughout research paragraphs.

## Integrity and experiment eligibility

I recomputed exact marker comparisons directly from expected values and answers for all eight cases, without relying on `runs.json` scores. No unknown or duplicate returned IDs were present. The prompts contain none of the generated marker values. For every case:

- Exactly one model/external MCP call was served, with the exact prompted arguments. The separately labelled SDK preflight is not a model call. There was no continuation or retry.
- The MCP event's text JSON equals structured content and the saved raw SDK result. All expected markers are present in that raw result; its compact hash matches `decoratedPageSha256`.
- Removing the synthetic fields reconstructs `originalPageSha256` and original byte count. Original statement clause, source, progress, authored comment and references match the catalog text exactly.

The six direct cases have no recorded foreign tools, unknown item types or Code Mode execution, and their raw eligibility flags are true. The runner explicitly requests direct-only qop namespaces; it ignores user configuration and disables shell, web and multi-agent features in fresh ephemeral sessions. This is a **forced direct-presentation experiment**, not a measurement of every ordinary Astra/host presentation path. Inspection of runner configuration and the call logs is consistent with the declared modes; this is not introspection into private host internals.

## Optional accessibility cases

Both Code Mode-enabled cases returned 33/33 markers, with one correct external MCP call. They permit programmatic extraction and cannot establish that an entire page was presented to the model. Both retain `visibilityEvidenceEligible=false` and `accessibilityEvidenceEligible=false` in the raw results.

The earlier accessibility run has an `error` item with no retained message. Its cause cannot be independently classified, and its invalid automatic eligibility must remain unchanged. The diagnostic rerun retains the message: an under-development `code_mode` feature warning, emitted at 0.190467 seconds, before the first tool started at 22.191837 seconds. **Manual classification: startup feature warning, not evidence of a failed MCP request or a contaminating external tool.** Its 33/33 readback can be described as a manually interpreted accessibility observation, while preserving the raw invalid flags. This classification does not retroactively explain the earlier opaque error. The retained events do not reveal whether programmatic extraction actually occurred, so do not claim that it did.

## Limits and practical implication

The low-cap control, repeat and high-cap recovery are consistent with a host presentation/output-budget effect. They do not by themselves distinguish truncation from model omission for each missing marker. Conversely, complete raw API/SDK output does not prove complete model visibility; complete marker copying does not prove that every intervening scientific condition was read or understood.

The 32 KiB result exercised **one 23,057-byte original page containing one problem**, not all 25 problems, every page near the budget ceiling, or all larger individual records. Larger whole records can correctly require a 413 and an increased budget; that retry may again exceed a particular host's presentation capacity. Existing scripted whole-catalog pagination tests verify service delivery, a different property from these marker readbacks. No p95, failure rate or cross-host guarantee follows from these few runs.

No implementation or raw evaluation artifacts were changed during grading. Raw events, stderr and probe metadata are not included with this report. The report includes no local user paths, temporary endpoints, credentials or unpublished scientific content.
