from __future__ import annotations

from contextlib import contextmanager
from datetime import datetime, timezone
import fcntl
import json
from pathlib import Path
import sqlite3


def now():
    return datetime.now(timezone.utc).isoformat()


class Store:
    def __init__(self, root: Path):
        self.root = root
        root.mkdir(parents=True, exist_ok=True, mode=0o700)
        with self.db() as db:
            db.execute("CREATE TABLE IF NOT EXISTS objects (kind TEXT, key TEXT, value TEXT, updated TEXT, PRIMARY KEY(kind,key))")

    @contextmanager
    def db(self):
        db = sqlite3.connect(self.root / "monitor.sqlite", timeout=30)
        db.execute("PRAGMA journal_mode=WAL")
        try:
            with db:
                yield db
        finally:
            db.close()

    @contextmanager
    def lock(self, name="operation"):
        # Lock names are constants in server code, never caller-provided paths.
        with (self.root / f"{name}.lock").open("a") as stream:
            fcntl.flock(stream, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(stream, fcntl.LOCK_UN)

    def get(self, kind, key, default=None):
        with self.db() as db:
            row = db.execute("SELECT value FROM objects WHERE kind=? AND key=?", (kind, key)).fetchone()
        return json.loads(row[0]) if row else default

    def put(self, kind, key, value):
        with self.db() as db:
            db.execute("INSERT INTO objects VALUES(?,?,?,?) ON CONFLICT(kind,key) DO UPDATE SET value=excluded.value,updated=excluded.updated",
                       (kind, key, json.dumps(value, ensure_ascii=False), now()))

    def items(self, kind):
        with self.db() as db:
            rows = db.execute("SELECT key,value,updated FROM objects WHERE kind=? ORDER BY updated,key", (kind,)).fetchall()
        return [{"key": key, "value": json.loads(value), "updated": updated} for key, value, updated in rows]
