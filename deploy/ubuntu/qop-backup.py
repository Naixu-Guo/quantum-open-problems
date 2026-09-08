#!/usr/bin/env python3
"""Online SQLite snapshots and a self-contained Git bundle; never stop the API."""
import argparse
from contextlib import closing
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import sqlite3
import subprocess
import tarfile
import tempfile
import time


def git(repo, *args):
    return subprocess.check_output(
        ["git", "-c", f"safe.directory={repo}", "-C", str(repo), *args],
        text=True, stderr=subprocess.PIPE, timeout=120,
    ).strip()


def backup_database(source, target):
    deadline = time.monotonic() + 45

    def progress(_status, _remaining, _total):
        if time.monotonic() > deadline:
            raise TimeoutError(f"SQLite backup timed out: {source.name}")

    with closing(sqlite3.connect(source.resolve().as_uri() + "?mode=ro", uri=True)) as live:
        with closing(sqlite3.connect(target)) as snapshot:
            live.backup(snapshot, pages=256, progress=progress, sleep=0.05)
            if snapshot.execute("PRAGMA quick_check").fetchone()[0] != "ok":
                raise RuntimeError(f"Invalid SQLite snapshot: {source.name}")


def snapshot(data_root, config_dir, output):
    os.umask(0o077)
    catalog = data_root / "catalog"
    output.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    if output.exists():
        raise FileExistsError(output)
    with tempfile.TemporaryDirectory(prefix=".qop-snapshot-", dir=output.parent) as temporary:
        stage = Path(temporary) / "snapshot"
        # Ledger changes during the database copies require a new attempt. Rate-limit,
        # session, and inbox activity can continue throughout SQLite's online backup.
        for attempt in range(3):
            if stage.exists():
                shutil.rmtree(stage)
            stage.mkdir(mode=0o700)
            head = git(catalog, "rev-parse", "HEAD")
            branch = git(catalog, "symbolic-ref", "--short", "HEAD")
            if git(catalog, "status", "--porcelain", "--untracked-files=no"):
                if attempt == 2:
                    raise RuntimeError("Tracked catalog files changed during backup; retry later")
                time.sleep(1)
                continue
            git(catalog, "bundle", "create", str(stage / "catalog.bundle"), "--all")
            data = stage / "data"
            data.mkdir(mode=0o700)
            databases = sorted((data_root / "data").glob("*.sqlite"))
            if not {"auth.sqlite", "submissions.sqlite"}.issubset({p.name for p in databases}):
                raise RuntimeError("Missing persistent authentication or submissions database")
            for source in databases:
                backup_database(source, data / source.name)
            # Extra state and content-addressed artifacts are not necessarily in Git.
            for source in (data_root / "data").iterdir():
                if source.name.endswith((".sqlite", ".sqlite-wal", ".sqlite-shm")):
                    continue
                if source.is_dir():
                    shutil.copytree(source, data / source.name)
                else:
                    shutil.copy2(source, data / source.name)
            artifacts = catalog / "activity" / "artifact-store"
            if artifacts.exists():
                shutil.copytree(artifacts, stage / "artifact-store")
            shutil.copytree(config_dir, stage / "configuration")
            unchanged = head == git(catalog, "rev-parse", "HEAD") and not git(catalog, "status", "--porcelain", "--untracked-files=no")
            if unchanged:
                break
            if attempt == 2:
                raise RuntimeError("Catalog kept changing; no backup was published, retry later")
        manifest = {
            "format": "qop-backup/2", "createdAt": datetime.now(timezone.utc).isoformat(),
            "catalogHead": head, "catalogBranch": branch,
            "databases": [p.name for p in databases],
            "indexIsDisposable": True,
        }
        (stage / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
        partial = output.with_name(output.name + ".partial")
        try:
            with tarfile.open(partial, "x:gz", compresslevel=6) as archive:
                for entry in sorted(stage.iterdir()):
                    archive.add(entry, arcname=entry.name)
            os.replace(partial, output)
        finally:
            partial.unlink(missing_ok=True)
    print(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-root", type=Path, default=Path("/var/lib/qop"))
    parser.add_argument("--config-dir", type=Path, default=Path("/etc/qop"))
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    snapshot(args.data_root.resolve(), args.config_dir.resolve(), args.output.resolve())
