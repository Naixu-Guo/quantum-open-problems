# Development guide

Requirements: Node.js 22.13 or later (the service uses the built-in
`node:sqlite` module). No package installation is needed; `npm install` is a
no-op.

## Commands

```sh
node site/build.mjs            # sync ledger, build API and pages, validate everything
npm test                       # node --test: canonical, ledger, frontier, projections, schemas, service, promotion, MCP, compatibility
npm run validate               # canonical + read-model validation without rebuilding
npm run site                   # serve site/ at http://localhost:8000
npm run service                # operational service at http://localhost:8787 (QOP_PORT, QOP_DB_PATH, QOP_SITE_DIR, QOP_PUBLIC_URL)
npm run mcp                    # MCP server over stdio (QOP_SITE_URL, QOP_SERVICE_URL, QOP_API_KEY)
npm run revisions -- <id>      # refresh the published-revision manifest after an intended content change
```

## Editing scientific state

1. Edit `catalog/problems/<id>/record.json`, add a statement version under
   `statements/`, or add a source under `catalog/sources/`.
2. Run `node site/build.mjs`. The ledger gains events for new objects; the
   validator fails if a statement or decision was edited in place, if a
   reference is dangling, if status and clause states disagree, or if a
   record's digest changed without a manifest refresh.
3. If the change is an intended research-content change, run
   `npm run revisions -- <id>` and rebuild.
4. Commit `catalog/` and `site/` together; CI rebuilds and diffs both.

## Running the community layer locally

```sh
node service/cli.mjs actor create --db data/qop-service.sqlite --type human --name "Editor" --roles contributor,reviewer,editor
node service/cli.mjs actor create --db data/qop-service.sqlite --type ai-agent --name "Scout" --roles contributor \
  --provider Anthropic --model claude --operator "Your name" --agent-name literature-scout
QOP_DB_PATH=data/qop-service.sqlite node service/server.mjs
```

Then, for example:

```sh
curl -s -X POST http://localhost:8787/api/v1/candidate-updates \
  -H "Authorization: Bearer qop_…" -H "Content-Type: application/json" -H "Idempotency-Key: my-run-1" \
  --data @update.json
```

To show pending updates and discussion on the website, set
`serviceUrl` in `catalog/registry.json` to the service origin and rebuild.

## Promoting an accepted update

```sh
QOP_SERVICE_URL=http://localhost:8787 QOP_API_KEY=qop_… node service/cli.mjs promote cu-… --dry-run
QOP_SERVICE_URL=http://localhost:8787 QOP_API_KEY=qop_… node service/cli.mjs promote cu-…
node site/build.mjs
git diff -- catalog   # review the claim, evidence, decision, snapshot, sources
```

## Layout

```text
catalog/   canonical reviewed state (only scientific authoring surface)
core/      domain rules, validation, projections, ledger, promotion
service/   HTTP service, store, policy, CLI
mcp/       stdio MCP adapter
site/      generated website and static API, plus the build scripts
scripts/   migration and import tools
tests/     node --test suites and frozen compatibility fixtures
docs/      architecture, ADRs, API reference, plans
```
