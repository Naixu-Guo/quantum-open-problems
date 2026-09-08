# Use the MCP server

Connect an MCP-compatible assistant to search open problems, read statements
and references, and assemble research context. The adapter runs locally and
queries the hosted catalog at `https://43.160.217.208`. You need Git,
Node.js 22.13 or later, and a client that supports local **stdio** MCP servers.
No API key is needed to read problems.

## Download the adapter

Run this command once in a terminal:

```sh
git clone https://github.com/Naixu-Guo/quantum-open-problems.git
```

If you already have a checkout, use it. The adapter needs no npm dependencies.
Check the [hosted catalog status](https://43.160.217.208/api/v1/status) to verify
that the service is reachable.

## Connect your assistant

Add a local MCP server with the following settings:

| Setting | Value |
| --- | --- |
| Name | `quantum-open-problems` |
| Transport | `stdio` |
| Command | `node` |
| Arguments, in order | `--experimental-strip-types`, `--no-warnings`, the absolute path to `mcp/src/server.ts` |
| Environment | `QOP_SERVICE_URL=https://43.160.217.208` |

For clients using an `mcpServers` JSON configuration:

```json
{
  "mcpServers": {
    "quantum-open-problems": {
      "command": "node",
      "args": [
        "--experimental-strip-types",
        "--no-warnings",
        "/absolute/path/quantum-open-problems/mcp/src/server.ts"
      ],
      "env": {
        "QOP_SERVICE_URL": "https://43.160.217.208"
      }
    }
  }
}
```

Replace the example path with your checkout's full path. Add the server to any
existing `mcpServers` entries, save the configuration, and reload the client's
MCP connection. The client starts the adapter automatically.

Try asking: “Use the quantum-open-problems MCP to find unsolved problems about
quantum channel capacity, then summarize one problem's known progress and
references.” The assistant can search with `search_problems`, read a statement
with `get_problem`, retrieve citations with `list_references`, and gather a
research bundle with `build_context`.

If the client cannot start `node`, use the full path to the Node executable as
the command. If queries fail, check the status URL above and the configured
`QOP_SERVICE_URL`. This URL is an HTTPS API, not a Streamable HTTP MCP endpoint;
configure the adapter as a local command using stdio.

To connect to another service, set `QOP_SERVICE_URL` to its origin.
Authenticated research contributions also require a `QOP_API_KEY` issued by that
service's operator (see [service key management](../service/README.md#commands)).
Without a key, read tools work and write tools return 401.

## Run your own local service

For development or a separate catalog, run these commands from the repository
root and leave the service running:

```sh
npm --prefix contract ci
npm run service
```

Set the adapter's `QOP_SERVICE_URL` to `http://localhost:8787` and check
<http://localhost:8787/api/v1/status>. The adapter defaults to this local URL
when the variable is unset. See the [Ubuntu deployment guide](../deploy/ubuntu/README.md)
for the hosted service's setup and operations.

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
The adapter forwards tools to the service's HTTP API; records carry stable ids
and statements carry content digests.

New catalog problems need no MCP-specific registration. Commit the JSON, TeX,
and exported ledger together. A service using the same checkout notices the
commit on the next MCP read and refreshes its ledger and index. For a separate
service clone, configure `QOP_GIT_REMOTE` and `QOP_GIT_BRANCH` on the service:
it fetches in the background on startup and every five seconds by default
(`QOP_SYNC_INTERVAL_MS`; `0` disables polling). After a valid update arrives,
the existing MCP connection can search the problem and read its statement,
frontier, references, and context. No MCP restart is needed. Service code or
schema changes still require deploying and restarting the service.

```sh
npm test          # spawns the server against a temporary service
npm run typecheck
```
