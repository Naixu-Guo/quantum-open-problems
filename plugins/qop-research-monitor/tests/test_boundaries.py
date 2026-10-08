from contextlib import contextmanager
from pathlib import Path
from types import SimpleNamespace
import json
import os
import sys

from cryptography.fernet import Fernet
from fastmcp.server.auth.providers.github import GitHubProvider
import httpx
from key_value.aio.stores.disk import DiskStore
from key_value.aio.wrappers.encryption import FernetEncryptionWrapper
import pytest

from configure import write_config
from qop_monitor.arxiv import Arxiv
from qop_monitor.announcements import parse_listing
from qop_monitor.catalog import run
from qop_monitor.monitor import Monitor
from qop_monitor.server import build_server
from qop_monitor.store import Store


@pytest.mark.parametrize("status", [429, 503])
def test_arxiv_cooldown_survives_restart(tmp_path, monkeypatch, status):
    calls = []
    @contextmanager
    def response(*args, **kwargs):
        calls.append(args)
        yield httpx.Response(status, headers={"Retry-After": "1800"}, request=httpx.Request("GET", args[1]))
    monkeypatch.setattr("qop_monitor.arxiv.httpx.stream", response)
    with pytest.raises(ValueError, match="persistent cooldown"):
        Arxiv(Store(tmp_path)).fetch("/list/quant-ph/new")
    with pytest.raises(ValueError, match="cooling down"):
        Arxiv(Store(tmp_path)).fetch("/list/cond-mat.str-el/new")
    assert len(calls) == 1


def test_arxiv_request_spacing_and_size_limit(tmp_path, monkeypatch):
    store = Store(tmp_path)
    store.put("meta", "arxiv", {"last_request": 99.0})
    slept = []
    monkeypatch.setattr("qop_monitor.arxiv.time.time", lambda: 100.0)
    monkeypatch.setattr("qop_monitor.arxiv.time.sleep", slept.append)
    @contextmanager
    def response(*args, **kwargs):
        yield httpx.Response(200, content=b"oversized", request=httpx.Request("GET", args[1]))
    monkeypatch.setattr("qop_monitor.arxiv.httpx.stream", response)
    with pytest.raises(ValueError, match="size limit"):
        Arxiv(store).fetch("/list/quant-ph/new", max_bytes=2)
    assert slept == [pytest.approx(2.1)]


def test_bad_announcement_is_cached_as_failure(tmp_path, monkeypatch):
    arxiv = Arxiv(Store(tmp_path))
    calls = []
    def changed_template(path, max_bytes):
        calls.append(path)
        return b"<html>upstream page has changed</html>"
    monkeypatch.setattr(arxiv, "fetch", changed_template)
    batch = arxiv.collect()
    assert all(item["status"] == "failed" for item in batch["health"])
    assert arxiv.collect()["cached"]
    assert set(calls) == {"/list/quant-ph/new", "/list/cond-mat.str-el/new"}


def test_replacement_version_is_not_invented():
    html = '''<h3>Showing new listings for Friday, 18 September 2026</h3>
    <div class="paging">Total of 1 entries</div><dl id="articles">
    <h3>Replacement submissions (showing 1 of 1 entries)</h3>
    <dt><a href="/abs/2609.12345">arXiv:2609.12345</a></dt><dd>
    <div class="list-title">Title: Example paper</div>
    <div class="list-authors"><a>First Author</a></div>
    <div class="list-subjects">Quantum Physics (quant-ph)</div>
    <p class="mathjax">Example abstract</p></dd></dl>'''
    listing = parse_listing(html, "https://arxiv.org/list/quant-ph/new")
    assert listing["papers"] == []
    assert listing["unversioned_papers"][0]["version"] is None
    assert listing["health"]["announcement_date"] == "2026-09-18"


def test_full_text_pages_do_not_repeat_fetches(tmp_path, monkeypatch):
    arxiv = Arxiv(Store(tmp_path))
    monkeypatch.setattr(arxiv, "metadata", lambda *args: {"id": "2609.12345", "version": 2})
    calls = []
    def fetch(path):
        calls.append(path)
        return ("<article>" + "abcdefghij" * 150 + "</article>").encode()
    monkeypatch.setattr(arxiv, "fetch", fetch)
    page = arxiv.text("2609.12345", 2, limit=1000)
    rest = Arxiv(Store(tmp_path))
    monkeypatch.setattr(rest, "metadata", arxiv.metadata)
    second = rest.text("2609.12345", 2, offset=page["next_offset"], limit=1000)
    assert len(page["text"] + second["text"]) == 1500
    assert second["next_offset"] is None
    assert len(calls) == 1


def test_validation_subprocess_does_not_inherit_secrets(tmp_path, monkeypatch):
    monkeypatch.setenv("QOP_MONITOR_GITHUB_TOKEN", "test-secret-not-real")
    monkeypatch.setenv("GITHUB_CLIENT_SECRET", "another-test-secret")
    env = json.loads(run([sys.executable, "-c", "import os,json; print(json.dumps(dict(os.environ)))"], tmp_path))
    assert "QOP_MONITOR_GITHUB_TOKEN" not in env
    assert "GITHUB_CLIENT_SECRET" not in env
    assert env["GIT_TERMINAL_PROMPT"] == "0"


def test_configuration_is_private_and_never_overwrites_keys(tmp_path):
    path = tmp_path / ".env"
    values = {"QOP_MONITOR_URL": "https://research.example.com", "QOP_MONITOR_GITHUB_IDS": "58557763", "JWT_SIGNING_KEY": "test-key"}
    write_config(path, values)
    assert path.stat().st_mode & 0o777 == 0o600
    with pytest.raises(FileExistsError):
        write_config(path, {**values, "JWT_SIGNING_KEY": "replacement"})
    assert "replacement" not in path.read_text()
    with pytest.raises(ValueError):
        write_config(tmp_path / "injected", {**values, "JWT_SIGNING_KEY": "line\nINJECTED=value"})


async def test_http_auth_discovery_and_anonymous_denial(tmp_path):
    auth = GitHubProvider(client_id="test-client", client_secret="test-secret",
                          base_url="https://research.example.com", required_scopes=["read:user"],
                          jwt_signing_key="a" * 64,
                          client_storage=FernetEncryptionWrapper(key_value=DiskStore(directory=tmp_path / "oauth"), fernet=Fernet(Fernet.generate_key())))
    monitor = Monitor(Store(tmp_path), SimpleNamespace(repository="owner/repo"), SimpleNamespace(token=""))
    mcp = build_server(monitor, auth, {"58557763"})
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=mcp.http_app()), base_url="https://research.example.com") as client:
        health = await client.get("/healthz")
        assert health.json() == {"status": "ok"}
        discovery = await client.get("/.well-known/oauth-authorization-server")
        assert discovery.status_code == 200
        assert discovery.json()["authorization_endpoint"].startswith("https://research.example.com/")
        response = await client.post("/mcp", json={"jsonrpc": "2.0", "id": 1, "method": "tools/list"})
        assert response.status_code == 401
        assert "resource_metadata" in response.headers["www-authenticate"]
