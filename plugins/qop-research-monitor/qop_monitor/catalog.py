from __future__ import annotations

import json
import os
from pathlib import Path
import re
import subprocess
import tempfile

from .models import PROBLEM
from .store import Store


def run(args: list[str], cwd: Path, timeout=300):
    # Child repository tooling never receives the OAuth/PAT environment.
    env = {"PATH": os.environ.get("PATH", "/usr/bin:/bin"), "LANG": "C.UTF-8",
           "HOME": str(cwd), "CI": "true", "GIT_TERMINAL_PROMPT": "0",
           "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": os.devnull,
           "npm_config_cache": str(cwd / ".npm-cache")}
    result = subprocess.run(args, cwd=cwd, env=env, capture_output=True, text=True, timeout=timeout)
    if result.returncode:
        raise ValueError(f"{args[0]} {args[1]} failed: {(result.stderr or result.stdout)[-3500:]}")
    return result.stdout


class Catalog:
    def __init__(self, store: Store, repository="Naixu-Guo/quantum-open-problems", source_url=None):
        if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repository):
            raise ValueError("Invalid configured repository")
        self.store = store
        self.repository = repository
        self.url = source_url or f"https://github.com/{repository}.git"
        self.path = store.root / "catalog.git"

    def refresh(self):
        with self.store.lock("catalog"):
            if not self.path.exists():
                # No credentials in the URL. The scientific catalog is public.
                run(["git", "clone", "--bare", "--single-branch", "--branch", "main", self.url, str(self.path)], self.store.root)
            run(["git", "fetch", "origin", "main:refs/heads/main"], self.path)
            return run(["git", "rev-parse", "refs/heads/main"], self.path).strip()

    def record(self, problem_id, commit):
        if not re.fullmatch(PROBLEM, problem_id) or not re.fullmatch(r"[0-9a-f]{40}", commit):
            raise ValueError("Invalid problem ID or catalog commit")
        return json.loads(run(["git", "show", f"{commit}:database/problems_json/{problem_id}.json"], self.path))

    def problems(self, commit):
        files = run(["git", "ls-tree", "-r", "--name-only", commit, "database/problems_json/"], self.path).splitlines()
        return [self.record(Path(p).stem, commit) for p in files if re.fullmatch(PROBLEM + r"\.json", Path(p).name)]

    def validate(self, commit: str, record: dict):
        checks = [
            ["npm", "ci", "--prefix", "contract", "--ignore-scripts"],
            ["npm", "ci", "--prefix", "mcp", "--ignore-scripts"],
            ["node", "scripts/migrate-metadata.mjs"],
            ["node", "scripts/sync-tex.mjs"],
            ["npm", "run", "export-ledger"],
            ["node", "scripts/migrate-metadata.mjs", "--check"],
            ["npm", "run", "check-ledger"],
            ["npm", "run", "validate:ledger"],
            ["npm", "test"],
            ["node", "site/build.mjs"],
        ]
        with tempfile.TemporaryDirectory(prefix="validate-", dir=self.store.root) as temp:
            path = Path(temp)
            run(["git", "clone", "--shared", str(self.path), str(path)], self.store.root)
            run(["git", "checkout", "--detach", commit], path)
            record_path = f"database/problems_json/{record['id']}.json"
            (path / record_path).write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n")
            for command in checks:
                run(command, path, timeout=600)
            # Include new exporter files without staging unrelated generated output.
            run(["git", "add", "--", record_path, f"database/problems_tex/{record['id']}.tex", "database/metadata.json", "ledger", "activity"], path)
            names = run(["git", "diff", "--cached", "--name-only"], path).splitlines()
            files = {}
            for name in names:
                allowed = name in {record_path, f"database/problems_tex/{record['id']}.tex", "database/metadata.json"} or name.startswith(("ledger/", "activity/"))
                target = path / name
                if not allowed or target.is_symlink() or not target.is_file():
                    raise ValueError(f"Unexpected/deleted path in generated update: {name}")
                files[name] = target.read_text()
            if not files or len(files) > 100 or sum(len(v.encode()) for v in files.values()) > 10_000_000:
                raise ValueError("Generated diff is empty or exceeds publication limits")
            # Stable identities and all non-update fields are checked again after tooling.
            authored = json.loads((path / record_path).read_text())
            if authored != record:
                raise ValueError("Metadata tooling changed the proposed record; reconcile the catalog first")
            return {"files": files, "diff": run(["git", "diff", "--cached", "--"], path),
                    "checks": [" ".join(command) for command in checks]}
