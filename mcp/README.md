# Use the MCP server

Connect your assistant directly to the hosted catalog to search open problems,
read statements and references, and assemble research context. Public reads
require no repository download, Node.js installation, account, or API key.

## Connect over HTTP

In a client that supports remote MCP, add a server with:

| Setting | Value |
| --- | --- |
| Name | `quantum-open-problems` |
| Server URL | `https://api.qiqc-op.com/mcp` |
| Transport | Streamable HTTP |
| Authentication | None for public reads |

Save or enable the connection. For clients that accept URL entries in an
`mcpServers` configuration:

```json
{
  "mcpServers": {
    "quantum-open-problems": {
      "url": "https://api.qiqc-op.com/mcp"
    }
  }
}
```

Some clients use a settings form or another configuration format. Use the same
URL and the remote HTTP transport supported by that client.

Try asking: “Use the quantum-open-problems MCP to find unsolved problems about
quantum channel capacity, then summarize one problem's known progress and
references.” The tools include `search_problems`, `get_problem`,
`list_references`, and `build_context`.

Newly published records become available through the existing connection when
the hosted API imports the catalog update. The HTTP endpoint uses the official
MCP SDK and supports both the 2026 protocol and legacy Streamable HTTP clients.
It exposes the Read tools and resources below. Authenticated research writes
are not enabled on the public deployment. The optional local adapter supports
them on a deployment whose operator has provisioned editors, keys, and Git sync.

`get_taxonomy` lists available labels and slugs. `search_problems` accepts either
case-insensitively, for example `area: "Quantum Communication"` and
`topic: "Private capacity"`. An unknown taxonomy name returns an error.
Search returns `total` matching records, `count` rows on this page (50 by
default), and `nextOffset`. Continue with the same filters and `offset` set
to `nextOffset` until it is null; a larger limit is not a promise of completeness.

`get_status.problems` counts permanent records, while `distinctQuestions`
counts published mathematical questions once across equivalent formulations.
`get_problem` omits the duplicate `authoredCatalog.record` unless
`includeAuthoredRecord: true` is requested. Use `build_context` for a bounded
token budget. `search_sources` also searches preserved bibliography text when
structured authors are incomplete, and flags retired sources.

`sort: "stale"` puts missing service human-review dates first, then oldest
reviews, with title/id as ties. Null dates mean no recorded service review;
this order does not measure catalog edit age.

If connecting fails, check the [catalog status](https://api.qiqc-op.com/api/v1/status),
confirm remote MCP support, and use the full URL ending in `/mcp`. A browser GET
may return 405 because an MCP client must negotiate the protocol. HTTP 429 asks
the client to wait for the `Retry-After` interval; the public limit is 240 requests
per minute per address.

## Optional local adapter

Run this command once in a terminal:

```sh
git clone https://github.com/Naixu-Guo/quantum-open-problems.git
```

This option is for clients that only support stdio, development, or authenticated
research contributions. It requires Git and Node.js 22.13 or later. If you already
have a checkout, use it. The stdio adapter itself needs no npm dependencies.
Check the [hosted catalog status](https://api.qiqc-op.com/api/v1/status) to verify
that the service is reachable.

### Configure the local command

Add a local MCP server with the following settings:

| Setting | Value |
| --- | --- |
| Name | `quantum-open-problems` |
| Transport | `stdio` |
| Command | `node` |
| Arguments, in order | `--experimental-strip-types`, `--no-warnings`, the absolute path to `mcp/src/server.ts` |
| Environment | `QOP_SERVICE_URL=https://api.qiqc-op.com` |

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
        "QOP_SERVICE_URL": "https://api.qiqc-op.com"
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
`QOP_SERVICE_URL`. This environment variable names the API origin, so omit the
`/mcp` suffix when using the local adapter.

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

The public HTTP endpoint exposes the Read group. The local stdio adapter also
provides Work and Write tools when authenticated.

| Group | Tools |
| --- | --- |
| Read | `get_status`, `get_taxonomy`, `search_sources`, `get_policy`, `get_schemas`, `search_problems`, `get_problem`, `get_frontier`, `get_tree`, `list_references`, `list_comments`, `list_attempts`, `build_context`, `list_events`, `get_contribution_status`, `get_record`, `claim_queue_item` |
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
Both transports forward tools to the service's HTTP API; records carry stable ids
and statements carry content digests.

New catalog problems need no MCP-specific registration. Commit the JSON, TeX,
and exported ledger together. A service using the same checkout notices the
commit on the next MCP read and refreshes its ledger and index. For a separate
service clone, configure `QOP_GIT_REMOTE` and `QOP_GIT_BRANCH` on the service:
it fetches in the background on startup and every sixty seconds by default
(`QOP_SYNC_INTERVAL_MS`; `0` disables polling). After a valid update arrives,
the existing MCP connection can search the problem and read its statement,
frontier, references, and context. No MCP restart is needed. Service code or
schema changes still require deploying and restarting the service.

```sh
npm ci            # from mcp/: install the official SDK and test client
npm test          # tests stdio and remote HTTP against temporary services
npm run typecheck
```
