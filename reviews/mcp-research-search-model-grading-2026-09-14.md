# Independent grading: research search selection comparison

Both answers pass the catalog-evidence check. The new run retrieved all 25 algorithm problems with fewer calls, but took longer. This pair does **not** demonstrate an end-to-end speedup: the baseline fetched research details for only 7 problems, while the new run fetched all 25.

The runs used the same `gpt-6-astra` model, `ultra` effort, question and supplied conversation history. Their prompt files have identical SHA-256 `5ddcd314dc2b9e2392ffb740622942723e115617ff3050f36a8280fd85db5724`. Both used the maintained 111-record catalog, version `d76175295aaee4cd1437fe6d876f00acab20b2dc70414ad56d9b7aa3b2fb5c89`. This review inspected the recorded MCP results, final answers and host timing events against `database/problems_json/`; it did not run another model or independently verify the cited papers.

| Observation | Before | After |
| --- | ---: | ---: |
| Process wall time | 87.77 s | 121.27 s |
| Successful MCP calls | 9 | 4 |
| Non-overlapping tool rounds | 4 | 4 |
| Unique research-detail records returned | 7 of 25 | 25 of 25 |
| Summary records returned | 25 | 0 |
| Last tool completion, from process start | 46.399 s | 55.825 s |
| Serialized structured-result values, all calls | 115,697 bytes | 459,982 bytes |
| Input tokens reported by the CLI | 239,172 | 529,178 |
| Cached input tokens reported by the CLI | 174,336 | 453,632 |

“Rounds” here means groups of overlapping tool lifetimes observed in stdout events, not a measurement of internal model reasoning turns. Before used taxonomy, a summary search, four parallel detail requests, then three parallel detail requests. After used taxonomy followed by three sequential research-search pages. All searches selected `area=quantum-algorithm`, `status=Unsolved`, sorted by title. The new pages requested `limit=50, maxBytes=200000` and returned 11, 10 and 4 complete records at offsets 0, 11 and 21. Their reported compact response sizes were 190,505, 197,874 and 66,069 bytes; the final cursor was null. There were no repeated or missing candidate IDs. These figures describe returned records, not a claim that attention to every record can be measured.

For each of the 7 before and 25 after research results, the status, difficulty, full `main` clause, source, every progress paragraph, comment and bibliography exactly matched the authored JSON record. Each recorded MCP text payload parsed to its corresponding structured result. No truncation occurred in these recorded scientific fields. The artifacts do **not** expose the final model-input serialization, so they cannot establish whether the host applied additional context or tool-output truncation internally. Transport completeness must not be presented as proof that every byte was model-visible.

The before answer recommends the two-copy qubit state-preparation subcase of `op_06e9f0c7b3b62f3b` (`01M1Q787QRCCSDNVA159Y6S261`, “Multi-slot overhead of virtual channel conjugation”). Its claims are supported: `g_1(1,2)=2`, `1 <= g_2(1,2) <= 5/3`, the exact finite-copy optimum remains unresolved, and the one-slot semidefinite-duality proof does not automatically extend to correlated multi-slot strategies. It correctly treats `5/3` as an upper bound, distinguishes this subcase from general-channel conjugation, and labels a search for a dual certificate as a suggested route. The comparison with the previously drawn Hamiltonian-simulation problem is qualitative and consistent with that record's multi-parameter precision gap. The answer does not pretend that all 25 research histories were examined.

The after answer recommends the three-copy qubit subcase of `op_a64dc63d6ae49127` (`01M1Q787QRD6APNHX659G4CTEF`, “Universal purification with classically simulable operations”). Its premises and evidence are supported: identical copies of an unknown depolarized pure state; completely stabilizer-preserving maps for qubits; Haar-averaged fidelity and success probability; the proposed equality `F^{A_2}_delta(3,s)=1-delta/2` for `0<delta<1` and `0<s<=1`. It correctly distinguishes the proved two-copy theorem, including postselection, from numerical evidence for `(d,n)=(2,3),(2,4),(3,3),(3,4)`. The proposed analytic proof or certified dual witness is explicitly a research suggestion. It does not extend the odd-dimensional Wigner-preserving formulation to even dimensions above two or claim an unrestricted purification impossibility. The He et al. citation, PRL 136, 090204 (2026), and arXiv:2504.10516 match the catalog. It correctly says proving the three-copy case would not settle arbitrary copy counts.

Both answers explicitly state that all 25 candidates are unrated, mark their recommendation as subjective, and distinguish a tractable-looking subproblem from resolving an entire catalog problem. The different recommendations are not a correctness failure. No answer-related implementation repair or repeat model run is warranted by this evidence.

Only successful `qop` tool calls appear in either event stream, and both run summaries report no contamination. The evidence supports fewer calls and broader complete retrieval, not lower total selection latency. This is one run per condition with unequal research coverage; it supports neither a p95 estimate nor a reliable same-workload latency comparison. Host timing includes CLI scheduling, buffering and transport. Serialized result bytes are neither model token counts nor a measurement of pure API cost.

Reproducible evidence identities (artifact names are relative to each before/after evaluation directory):

| Artifact | Before SHA-256 | After SHA-256 |
| --- | --- | --- |
| `case-2.answer.md` | `8c37bf6567806eef35c95d54074a9bd38afdb0994894eb2dcc47805683cd53ec` | `b4ded2a2bc7e7724eefdffe95ab94ab82d785602ca268a64e091fc2ba7c25bd6` |
| `case-2.events.jsonl` | `7916c348780db77eb48d4fbcad11f5185fe732c76d8a34dd271d6a831bc519c2` | `22be9a1638520b868a0e118d4151bf175eab217a0d06d5b510e3e262958d84ca` |
| `case-2.timings.jsonl` | `5b53759ddd91a51234dfdccdc7c964f135f58942edd06f8f5ca76405c13a0ce9` | `09978df0885241bf8137532a4ed051ea01229c14988b9f2c81b285562e0a8097` |

This report contains public catalog content and evaluation aggregates only; no credentials, ephemeral access material, private correspondence or absolute machine paths are included.

The committed [comparison artifact](mcp-research-search-model-comparison-2026-09-14.json) contains the final answers, tool arguments and run summaries. The raw event/timing files identified above are retained in the local evaluation directories; they are not included in this PR.
