# Codex MCP information-access host audit — 2026-09-14

This document audits source behavior in a specific Codex CLI release. It is not a measurement of the effective default configuration of a live session, and it does not establish that a model saw an entire research response or understood its scientific content. The audit did not read user configuration, credentials, model caches, or existing sessions, and did not modify production code.

## Version and evidence

- Audited CLI version: `0.154.0-alpha.6.2`.
- Matching public release: [`rust-v0.154.0-alpha.6.2`](https://github.com/openai/codex/releases/tag/rust-v0.154.0-alpha.6.2), source commit [`b5bffd3ec4db487e7e3dec59663875b0ef7b72ca`](https://github.com/openai/codex/tree/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca).
- The source links below are pinned to that matching release commit. Current-main source was not used for the final behavioral conclusions.
- The installed binary contains the matching per-tool configuration symbols and bundled model truncation fields. This corroborates the public release source, but does not reveal the effective configuration of a running model session.

## Confirmed behavior

### Direct MCP presentation

For ordinary unencrypted MCP results, a non-null `structuredContent` is JSON-serialized as the single model-facing text payload. The ordinary text `content` is not added again. There is a separate encrypted-content branch.

Source: [CallToolResult conversion](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/protocol/src/models.rs#L2258).

The presentation budget is the configured per-tool override, if present; otherwise it is the model's truncation policy. A wall-time header is added, then a standard 20% allowance is applied to the policy before truncating the presentation. For a 10,000-token policy this means approximately 48,000 UTF-8 bytes of retained text, including the header; added truncation markers mean this is not a strict final-wire-byte ceiling.

Sources: [MCP policy selection](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/handlers/mcp.rs#L220), [MCP presentation](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/context.rs#L152).

### Code Mode is a different path

MCP results supplied to Code Mode retain both `content` and `structuredContent`, with top-level private `_meta` removed. The MCP presentation truncation above does not truncate this JavaScript result.

- `text(result)` can emit both copies, including JSON escaping overhead.
- `text(result.structuredContent)` emits one copy.
- JavaScript can extract fields from the complete raw object before emitting a small result. Successful marker extraction in JavaScript does not establish that the whole source page was ever presented to the model.

Sources: [raw MCP-to-Code-Mode conversion](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/tools/src/tool_output.rs#L200), [MCP output keeps raw Code Mode result](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/context.rs#L135).

The final Code Mode output has its own `max_output_tokens`. When omitted, its fallback is 10,000, corresponding to approximately 40,000 UTF-8 bytes of emitted text before headers and truncation markers. Increasing an MCP per-tool `output_token_limit` does not increase this separate cell-output budget. Further history/context processing is a reason to verify any explicit larger budget through actual model readback, rather than assuming the override guarantees visibility.

Sources: [Code Mode output truncation](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/code_mode/mod.rs#L326), [fallback resolution](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/unified_exec/mod.rs#L219).

### Default values and configuration scope

The installed binary's bundled model fields match the exact release catalog: Astra, Sol, Terra, Luna, GPT-5.5, GPT-5.4 and GPT-5.4-mini have a 10,000-token truncation policy; GPT-5.2 has a 10,000-byte policy. Astra/Sol/Terra/Luna are bundled with `code_mode_only`.

These are bundled defaults, not an assertion about the effective live session. Model discovery can merge remote catalog data, and configuration overrides can change the policy.

Sources: [bundled model catalog](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/models-manager/models.json), [model manager](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/models-manager/src/manager.rs#L186).

Supported per-tool key:

```toml
[mcp_servers.qop.tools.search_problems]
output_token_limit = 30000
```

The server's original tool name is used. The value is a positive integer, before the standard 20% allowance; 30,000 is an example override, not a default. The global `tool_output_token_limit` overrides the model's default policy, while the per-tool value takes precedence for that direct MCP presentation. Neither is the Code Mode cell's `max_output_tokens` argument.

Sources: [official configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference), [exact-release per-tool configuration type](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/config/src/mcp_types.rs#L75), [global model-policy override](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/models-manager/src/model_info.rs#L38).

### Truncation shape and markers

Text truncation estimates one token as four UTF-8 bytes, preserves approximately half the retained bytes from the beginning and half from the end, and removes the middle on UTF-8 boundaries. It is not a tokenizer count and is not tail-only clipping.

The inline marker is `…N tokens truncated…` or `…N chars truncated…`. Code Mode's pure-text formatting also prepends a warning with the estimated original token count and original line count. Multi-item content can additionally report omitted text/audio items. Thus a surviving final problem or `nextCursor` does not prove that the intervening problems survived.

Sources: [head-and-tail truncation and token approximation](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/utils/string/src/truncate.rs), [formatting and content-item budgets](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/utils/output-truncation/src/lib.rs).

## Black-box acceptance requirements

1. Record the exact host version, model, unchanged default configuration, invocation path and actual Code Mode source. Distinguish direct MCP from Code Mode and distinguish raw-object output from field extraction.
2. Generate opaque random markers only in server responses, outside prompts and accessible evaluation context. Place markers at dense page positions and inside each problem; disclose synthetic overhead separately from the actual API byte budget.
3. Require literal model readback after the page has been emitted as the intended full payload. Reject JavaScript marker extraction as evidence of full-page model visibility. It can be a separate raw-runtime-access test.
4. Keep all expected problems in the denominator; detect missing/extra/duplicate IDs, wrong markers, extra tools, retries and file/web access. A low-cap control must alter the actual presentation path being tested: an MCP-only cap is not a Code Mode cell cap.
5. Report raw server/CLI receipt, model readback and scientific comprehension separately. Raw events do not prove model input visibility; a missed marker can also be model omission, so repeat with new randomization and inspect visible truncation markers before assigning cause.
6. Use larger-output overrides only as explicitly labeled diagnostic controls. Do not mix them into the baseline or claim an application speedup by increasing host limits.

No numerical page size alone is a universal host-visibility guarantee. In this release a 65,536-byte response can exceed both the direct 48,000-byte retained budget and Code Mode's default 40,000-byte budget, even before duplication/escaping. A smaller page can still exceed the latter when both MCP representations are emitted.

## Supported fixed-direct diagnostic on Astra

`features.code_mode.enabled=false` is a supported configuration field, but it does **not** establish that Astra stops using Code Mode: `requested_tool_mode` prioritizes a non-null model `tool_mode`, and Astra's bundled value is `code_mode_only`. The model policy must not be assumed to disappear merely because that feature flag is false.

Source: [model tool-mode precedence](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/mod.rs#L68).

The supported way to route only this dedicated diagnostic MCP server directly is:

```toml
[features.code_mode]
direct_only_tool_namespaces = ["qop", "mcp__qop"]
```

This leaves the chosen model unchanged. The two names cover the server's plain namespace and its historical MCP-prefixed namespace; the source supports prefix selection, so this avoids assuming a particular runtime naming default. The registry changes the matching tools to `DirectModelOnly` and excludes them from nested Code Mode exposure. A release regression test verifies the direct-only namespace remains directly exposed even in `code_mode_only` and is absent from the `exec` tool definitions.

Sources: [supported configuration fields](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/features/src/feature_configs.rs#L22), [registry override](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/spec_plan.rs#L499), [CodeModeOnly regression](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/core/src/tools/spec_plan_tests.rs#L2540), [MCP namespace prefixing](https://github.com/openai/codex/blob/b5bffd3ec4db487e7e3dec59663875b0ef7b72ca/codex-rs/codex-mcp/src/tools.rs#L113).

A test using this setting must label its result as a **fixed direct-MCP presentation diagnostic**, not normal/default Astra behavior. “Default” in the case name may describe only the unmodified output budget. Verify actual observed calls and reject unexpected tool/event shapes; a flag alone is not the measured outcome. Per-tool output limits can then serve as direct-path truncation/recovery controls. Code Mode raw-object accessibility remains a separate experiment that cannot certify full research-page presentation.
