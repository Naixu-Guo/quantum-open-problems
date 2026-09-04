# MCP adapter

`src/server.ts` is a stdio MCP server over the domain service's HTTP API.
It holds no state and no research logic: every tool is one HTTP call, every
returned fact carries a record id, and statements carry their digest.

```sh
export PATH="$HOME/.local/node/current/bin:$PATH"   # if node is not on PATH
QOP_SERVICE_URL=http://localhost:8787 QOP_API_KEY=qop_… node --experimental-strip-types mcp/src/server.ts
```

Configure it in an agent host, for example:

```sh
claude mcp add quantum-open-problems -e QOP_SERVICE_URL=http://localhost:8787 -e QOP_API_KEY=qop_… -- node --experimental-strip-types /path/to/mcp/src/server.ts
```

Without a key the read tools work and the write tools return 401.

## Tools

| Group | Tools |
| --- | --- |
| Read | `get_status`, `get_policy`, `get_schemas`, `search_problems`, `get_problem`, `get_frontier`, `get_tree`, `list_references`, `list_comments`, `list_attempts`, `build_context`, `list_events`, `get_contribution_status`, `get_record`, `claim_queue_item` |
| Work | `start_trajectory`, `log_event`, `upload_artifact`, `end_trajectory` |
| Write | `submit_batch`, `submit_review`, `post_comment`, `withdraw_contribution` |

Resources: `qop://status`, `qop://policy`, and the templates
`qop://problems/{id}`, `qop://problems/{id}/frontier`,
`qop://problems/{id}/tree`, `qop://contributions/{id}`, `qop://records/{id}`.

The intended loop for a research agent: `get_status`, `search_problems`,
`build_context` (keep the bundle id), `start_trajectory` with that bundle
id, `log_event` as you work, `upload_artifact` for anything you produce,
`end_trajectory` with an attempt report that introduces any auxiliary
problems and claims. For a verifier: `claim_queue_item`, examine, then
`submit_review`.

The legacy static-catalog server was removed during the catalog integration.
Use `mcp/src/server.ts`; its service reads the ledger projection exported from
`database/problems_json/` (see [the catalog boundary](../docs/CATALOG_INTEGRATION.md)).

```sh
npm test          # spawns the server against a temporary service
npm run typecheck
```
