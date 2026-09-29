# Quantum Open Problems research monitor

A private, authenticated MCP service for a separate ChatGPT cloud literature-maintenance task. It collects the current `quant-ph` and `cond-mat.str-el` announcement batches, persists evidence assessments and unfinished work, validates append-only scientific updates, and creates draft GitHub PRs. ChatGPT performs the scientific reasoning; this service does not call an LLM or require an OpenAI API key.

See [the Chinese setup guide](CHATGPT_SETUP.zh-CN.md) for deployment, ChatGPT connection, and the ready-to-use recurring-task prompt. The proposed `research.qiqc-op.com` origin is an example, not a deployment created by this package. The existing public read-only MCP at `api.qiqc-op.com` is independent.

## Architecture

ChatGPT scheduled task → HTTPS/OAuth → private FastMCP server → arXiv / public catalog / persistent review state → isolated repository validation → draft PR.

- GitHub OAuth requests `read:user` for login. Every tool separately checks the account's numeric GitHub ID against the configured allowlist.
- A separate repository-scoped fine-grained token authorizes publishing. It stays on the server, is not returned to the model, and is not inherited by repository validation subprocesses.
- OAuth client/token state uses encrypted persistent storage and a stable signing key. Scientific state and publication receipts use SQLite. One server process owns the volume; concurrent replicas are unsupported.
- Changes are restricted to appended Progress/References and a justified status change. Permanent identities, statements and provenance remain unchanged. `Solved` requires a documented separate scientific verification; passing checks cannot certify the proof.
- Preparation runs in a background worker. A timeout or restart cannot silently discard the validation job; an interrupted job can be resubmitted. Publication checks the exact reviewed record, evidence hash and validated main commit.
- One deterministic branch per paper-version/problem prevents duplicate PRs. Existing PRs are returned without overwriting them. No merge, deployment, general shell, arbitrary URL or arbitrary repository tool is exposed.
- arXiv calls share a persistent 3.1-second spacing and HTTP 429/503 cooldown. Announcement collection is cached per UTC day, including failures. There is no historical backfill or automatic retry storm.

## Tools

`get_status`, `workflow_instructions`, `list_open_problems`, `get_problem`, `collect_papers`, `list_candidates`, `get_paper_metadata`, `read_paper`, `record_review`, `record_screening`, `pending_reviews`, `prepare_update`, `get_update`, `publish_update`, `get_pr_status`.

The scientific workflow is available through `workflow_instructions`, so installing a separate skills ZIP is optional. The included `.codex-plugin` manifest packages the same skill for Codex. Connect the deployed MCP URL explicitly in ChatGPT; a GitHub repository URL alone does not start this server.

## Development and validation

Python 3.11+, Node 22.13+, npm and git are needed. From this directory:

```sh
uv sync --locked
uv run pytest -q
```

`uv.lock`, `requirements.lock` (runtime) and `requirements-dev.lock` (CI) pin the dependency graph. To regenerate exports after an intentional dependency change:

```sh
uv lock
uv export --locked --no-dev --no-emit-project --format requirements-txt --output-file requirements.lock
uv export --locked --no-emit-project --format requirements-txt --output-file requirements-dev.lock
```

The validation worker checks out trusted repository `main`, installs locked contract/MCP dependencies with install scripts disabled, runs metadata/TeX/ledger generation and checks, the root test suite, and the static site build. It deliberately does not execute code from a submitted PR. These scripts are still trusted repository code, not a hostile-code sandbox.

Run `python3 configure.py` on the deployment host; it securely prompts for credentials and creates a mode-0600 `.env` without overwriting persistent keys. Then `docker compose up -d --build`. Reverse-proxy the whole HTTPS origin, including OAuth discovery and callback routes, to local port 8790. The health endpoint exposes no scientific or account data.

Back up the stopped container's `monitor-data` volume and `.env` together into encrypted storage. `.env` is needed to decrypt OAuth state. Never commit it, publish the volume, or use `docker compose down -v` as an update procedure. Review state and cached paper full text are private operational data; only the reviewed catalog diff goes into a PR. Monitor disk use and archive old caches when needed.

## Source references

- [ChatGPT cloud scheduled tasks](https://learn.chatgpt.com/docs/automations)
- [Connect a remote MCP to ChatGPT](https://developers.openai.com/plugins/deploy/connect-chatgpt)
- [OpenAI OAuth requirements](https://developers.openai.com/plugins/build/auth)
- [FastMCP GitHub OAuth provider](https://gofastmcp.com/integrations/github)
- [FastMCP persistent storage](https://gofastmcp.com/servers/storage-backends)

Software follows this repository's Apache-2.0 license. Referenced research retains its authors' rights; the service does not republish full paper text.
