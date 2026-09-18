from __future__ import annotations

import fcntl
from functools import wraps
import os
from pathlib import Path
import re

from cryptography.fernet import Fernet
from fastmcp import FastMCP
from fastmcp.server.auth.providers.github import GitHubProvider
from fastmcp.server.dependencies import get_access_token
from key_value.aio.stores.disk import DiskStore
from key_value.aio.wrappers.encryption import FernetEncryptionWrapper
from starlette.responses import JSONResponse

from .catalog import Catalog
from .github import GitHub
from .models import Review, Update, digest
from .monitor import Monitor
from .store import Store


def require_owner(allowed_ids: set[str]):
    token = get_access_token()
    if token is None or str(token.claims.get("sub", "")) not in allowed_ids:
        raise PermissionError("This private monitor is available only to its configured maintainer")


def build_server(monitor: Monitor, auth, allowed_ids: set[str]):
    if not allowed_ids or any(not re.fullmatch(r"[1-9]\d*", value) for value in allowed_ids):
        raise ValueError("Configure numeric GitHub maintainer IDs")
    mcp = FastMCP("Quantum Open Problems Research Monitor", auth=auth,
                  instructions="Private literature-review and PR tools. Retrieve workflow_instructions before working. Never confuse fetched text, recorded assessments, validated diffs, opened PRs and merged website updates.")

    def tool(*, readonly=True, external=True):
        def register(fn):
            @wraps(fn)
            def guarded(*args, **kwargs):
                require_owner(allowed_ids)
                return fn(*args, **kwargs)
            mcp.tool(guarded, annotations={"readOnlyHint": readonly, "destructiveHint": False,
                     "idempotentHint": True, "openWorldHint": external},
                     meta={"securitySchemes": [{"type": "oauth2", "scopes": ["read:user"]}]})
            return guarded
        return register

    @tool(external=False)
    def get_status() -> dict:
        """Verify access, configured publishing, persistent queue and active jobs. Does not create a schedule."""
        return monitor.status()

    @tool(external=False)
    def workflow_instructions() -> str:
        """Read the complete scientific review, evidence, publishing and resumption workflow."""
        return (Path(__file__).parent.parent / "skills/qop-literature-monitor/SKILL.md").read_text()

    @tool()
    def list_open_problems(offset: int = 0, limit: int = 20) -> dict:
        """Page through full current Unsolved statements, progress and references; retain catalog_commit and record_hash."""
        return monitor.problems(offset, limit)

    @tool()
    def get_problem(problem_id: str) -> dict:
        """Read a current scientific record and its content hash from main."""
        return monitor.problem(problem_id)

    @tool()
    def collect_papers() -> dict:
        """Collect only quant-ph and cond-mat.str-el current announcement pages, once per UTC day. Reports actual batch dates and failures; no API retry loop."""
        return monitor.arxiv.collect()

    @tool()
    def list_candidates(offset: int = 0, limit: int = 20) -> dict:
        """Read cached papers not screened against the current catalog, including prior notes. No personal-recommendation ranking."""
        return monitor.candidates(offset, limit)

    @tool()
    def get_paper_metadata(paper_id: str, version: int | None = None) -> dict:
        """Resolve a missing arXiv version or inspect exact-version title/authors/abstract/categories. Omitting version looks up the latest version."""
        result = monitor.arxiv.metadata(paper_id, version)
        unresolved = monitor.store.get("papers", paper_id + "v?")
        if unresolved:
            key = f"{paper_id}v{result['version']}"
            paper = {**unresolved, **result}
            paper.pop("resolved_to", None)
            paper["content_hash"] = digest({k: paper[k] for k in ("title", "abstract", "authors", "categories", "version")})
            monitor.store.put("papers", key, paper)
            monitor.store.put("papers", paper_id + "v?", {**unresolved, "resolved_to": key})
        return result

    @tool()
    def read_paper(paper_id: str, version: int, offset: int = 0, limit: int = 16000) -> dict:
        """Read paginated exact-version full text, caching HTML or PDF extraction. Follow next_offset and inspect original equations; this does not certify the proof."""
        return monitor.arxiv.text(paper_id, version, offset, limit)

    @tool(readonly=False, external=False)
    def record_review(review: Review) -> dict:
        """Persist an honest evidence assessment. partial/resolved require exact-version full text and scope evidence; resolved also requires an independently performed verification."""
        return monitor.review(review)

    @tool(readonly=False)
    def record_screening(paper_key: str, catalog_commit: str, notes: str, matching_problem_ids: list[str]) -> dict:
        """Mark one exact paper version screened against all current Unsolved statements only after that review occurred. Save pending reviews for every match first."""
        return monitor.screening(paper_key, catalog_commit, notes, matching_problem_ids)

    @tool(external=False)
    def pending_reviews(offset: int = 0, limit: int = 20) -> dict:
        """Resume uncertain evidence and verified findings, with associated publication receipts."""
        return monitor.queue(offset, limit)

    @tool(readonly=False)
    def prepare_update(update: Update) -> dict:
        """Queue an append-only catalog update for isolated JSON/TeX/ledger/build validation. Returns immediately; poll get_update. No GitHub mutation."""
        return monitor.prepare(update)

    @tool(external=False)
    def get_update(job_id: str, offset: int = 0, limit: int = 18000) -> dict:
        """Read validation status and page through the complete prepared diff before publishing."""
        return monitor.update(job_id, offset, limit)

    @tool(readonly=False)
    def publish_update(job_id: str) -> dict:
        """Create or find a draft PR for a validated update. Requires prior user authorization to publish. Never merges, deploys or overwrites an existing PR. Same paper/problem reuses its branch."""
        return monitor.publish(job_id)

    @tool()
    def get_pr_status(number: int) -> dict:
        """Check live PR/merge state and CI conclusions; never infer a website update from PR creation."""
        return monitor.github.pr_status(number)

    @mcp.custom_route("/healthz", methods=["GET"])
    async def health(request):
        return JSONResponse({"status": "ok"})

    return mcp


def main():
    os.umask(0o077)
    root = Path(os.environ.get("QOP_MONITOR_DATA", "/var/lib/qop-monitor")).resolve()
    root.mkdir(parents=True, exist_ok=True)
    lease = (root / "server.lock").open("a")
    fcntl.flock(lease, fcntl.LOCK_EX | fcntl.LOCK_NB)
    base = os.environ["QOP_MONITOR_URL"].rstrip("/")
    if not re.fullmatch(r"https://[A-Za-z0-9.-]+(?::[0-9]+)?", base):
        raise ValueError("QOP_MONITOR_URL must be an HTTPS origin, without a path")
    ids = set(os.environ["QOP_MONITOR_GITHUB_IDS"].split(","))
    auth = GitHubProvider(
        client_id=os.environ["GITHUB_CLIENT_ID"], client_secret=os.environ["GITHUB_CLIENT_SECRET"],
        base_url=base, required_scopes=["read:user"],
        jwt_signing_key=os.environ["JWT_SIGNING_KEY"],
        client_storage=FernetEncryptionWrapper(key_value=DiskStore(directory=root / "oauth"),
                                              fernet=Fernet(os.environ["STORAGE_ENCRYPTION_KEY"])),
    )
    store = Store(root)
    catalog = Catalog(store, os.environ.get("QOP_MONITOR_REPOSITORY", "Naixu-Guo/quantum-open-problems"))
    github = GitHub(catalog.repository, os.environ.get("QOP_MONITOR_GITHUB_TOKEN", ""), store)
    server = build_server(Monitor(store, catalog, github), auth, ids)
    server.run(transport="http", host=os.environ.get("QOP_MONITOR_BIND", "127.0.0.1"),
               port=int(os.environ.get("QOP_MONITOR_PORT", "8790")))


if __name__ == "__main__":
    main()
