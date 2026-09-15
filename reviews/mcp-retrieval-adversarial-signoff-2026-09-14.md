No remaining reproducible content-preservation defect was found in this focused review.

- [Validation](/private/tmp/qop-mcp-complete-20260914/contract/src/validate.ts:243) associates desired hashes only with hash-validated Problem exports. [Body omission](/private/tmp/qop-mcp-complete-20260914/service/src/research-view.ts:13) requires both current body and authored snapshot to match; missing projection data preserves the body.
- [Reconciliation](/private/tmp/qop-mcp-complete-20260914/scripts/export-ledger.mjs:287) preserves a service-edited body when only the catalog title changes, while recording the **desired** field hashes separately.
- MCP responses preserve the returned body, schemas allow it, and tool/server instructions explicitly tell clients to read it when present.

All **6 research-view tests passed**, covering complete authored Source/Progress/Comment/References, formal clauses, service body edits, native records, and absent projection data. The read-only exporter check also passed: **111 active problems, 1 merged identity, zero drift**.

The [integration regression](/private/tmp/qop-mcp-complete-20260914/tests/catalog-mcp.test.mjs:134) covers the concrete import → accepted service body edit → title-only export → validated merged revision → MCP read sequence. It asserts that the title updates, the complete added body remains visible, and authored research remains unchanged.

Review limits: I inspected that integration test but did not execute it because its fixture writes files and uses loopback HTTP. Loopback availability was therefore not tested here. No files were changed, network used, credentials read, or other workspaces inspected. The earlier full review and maintainer-run loopback results remain separate evidence.