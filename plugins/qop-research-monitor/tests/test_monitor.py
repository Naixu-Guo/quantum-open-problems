from copy import deepcopy
from pathlib import Path
from types import SimpleNamespace

from fastmcp import Client
import pytest

from qop_monitor.models import Review, Update, digest, updated_record
from qop_monitor.store import Store
from qop_monitor.monitor import Monitor
from qop_monitor.github import GitHub
from qop_monitor import server


@pytest.fixture
def record():
    return {"id": "op_0123456789abcdef", "ulid": "permanent", "aliases": ["old-name"],
            "metadata": {"createdBy": "original"}, "title": "An example question", "statement": "For all dimensions?",
            "status": "Unsolved", "progress": [], "references": [], "comment": "Original scope"}


def evidence(record, result="partial"):
    return Review(problem_id=record["id"], record_hash=digest(record), paper_id="2609.12345", paper_version=2,
                  result=result, reason="Checked the necessary proof in the original preprint.",
                  evidence_url="https://arxiv.org/abs/2609.12345v2", theorem_locator="Theorem 2",
                  scope_comparison="This establishes the finite-dimensional special case only; the uniform statement remains open.",
                  full_text_verified=True, publication_status="preprint",
                  independent_verification="A separate exact calculation verified the stated counterexample and checked every assumption." if result == "resolved" else "")


def addition(review, status="Unsolved"):
    return Update(review_key=review.key, status=status,
                  progress=r"A scoped result follows from Theorem 2; see \sourcecite{ref:example}{Example2026}.",
                  references=[{"key": "Example2026", "label": "ref:example", "tex": "Example, a preprint, https://arxiv.org/abs/2609.12345v2"}])


class FakeCatalog:
    repository = "owner/repo"
    commit = "a" * 40
    def __init__(self, record):
        self.value = record
    def refresh(self):
        return self.commit
    def record(self, problem_id, commit):
        assert problem_id == self.value["id"]
        return deepcopy(self.value)
    def problems(self, commit):
        return [deepcopy(self.value)]
    def validate(self, commit, record):
        return {"files": {"database/problems_json/example.json": "{}"}, "diff": "verified diff", "checks": ["test fixture validator"]}


def test_append_only_and_partial_status(record):
    review = evidence(record)
    result = updated_record(record, review, addition(review))
    for field in ("id", "ulid", "aliases", "metadata", "statement", "comment"):
        assert result[field] == record[field]
    assert record["progress"] == []
    assert result["status"] == "Unsolved"
    with pytest.raises(ValueError, match="Partial"):
        updated_record(record, review, addition(review, "Solved"))


def test_scientific_evidence_gates(record):
    data = evidence(record).model_dump()
    for field, value in [("full_text_verified", False), ("evidence_url", "https://arxiv.org/abs/2609.12345"),
                         ("theorem_locator", ""), ("scope_comparison", "same"), ("result", "resolved")]:
        with pytest.raises(ValueError):
            Review.model_validate({**data, field: value})
    review = evidence(record, "resolved")
    assert updated_record(record, review, addition(review, "Solved"))["status"] == "Solved"


def test_stale_and_unsupported_fields_rejected(record):
    review = evidence(record)
    record["statement"] = "Different quantifiers"
    with pytest.raises(ValueError, match="changed since review"):
        updated_record(record, review, addition(review))
    with pytest.raises(ValueError):
        Update.model_validate({**addition(review).model_dump(), "statement": "Change the question"})


def test_reference_collision_rejected(record):
    record["references"] = [{"key": "Example2026", "label": "ref:old", "tex": "Original citation"}]
    review = evidence(record)
    with pytest.raises(ValueError, match="overwrite"):
        updated_record(record, review, addition(review))


def test_persistence_and_jobs(tmp_path, record):
    store = Store(tmp_path)
    catalog = FakeCatalog(record)
    monitor = Monitor(store, catalog, SimpleNamespace(token=""))
    review = evidence(record)
    with pytest.raises(ValueError, match="full text"):
        monitor.review(review)
    store.put("fulltexts", "2609.12345v2", {"text": "Proof text"})
    monitor.review(review)
    job = monitor.prepare(addition(review))
    monitor.futures[job["job_id"]].result(timeout=5)
    assert monitor.update(job["job_id"])["state"] == "ready"
    assert monitor.prepare(addition(review))["reused"]
    other = Monitor(Store(tmp_path), catalog, SimpleNamespace(token=""))
    assert other.queue()["total"] == 1
    assert other.update(job["job_id"])["diff"] == "verified diff"
    changed = review.model_copy(update={"reason": "Subsequent review changed the evidence assessment."})
    other.review(changed)
    with pytest.raises(ValueError, match="Evidence changed"):
        other.publish(job["job_id"])


def test_restart_recovers_unfinished_validation(tmp_path, record):
    store = Store(tmp_path)
    store.put("jobs", "test", {"state": "running"})
    monitor = Monitor(store, FakeCatalog(record), SimpleNamespace(token=""))
    assert monitor.update("test")["state"] == "interrupted"


def test_screening_cannot_drop_unsaved_matches(tmp_path, record):
    store = Store(tmp_path)
    monitor = Monitor(store, FakeCatalog(record), SimpleNamespace(token=""))
    paper_key = "2609.12345v2"
    store.put("papers", paper_key, {"version": 2, "content_hash": "paperhash"})
    with pytest.raises(ValueError, match="Save an up-to-date review"):
        monitor.screening(paper_key, "a"*40, "Compared against the full current statement set.", [record["id"]])
    review = Review(problem_id=record["id"], record_hash=digest(record), paper_id="2609.12345", paper_version=2,
                    result="uncertain", reason="The proof needs inspection; candidate relevance only.")
    monitor.review(review)
    monitor.screening(paper_key, "a"*40, "Compared against the full current statement set.", [record["id"]])
    assert monitor.candidates()["total"] == 0
    monitor.catalog.commit = "b"*40
    assert monitor.candidates()["total"] == 1


class FakeGitHub(GitHub):
    def __init__(self, store):
        super().__init__("owner/repo", "secret", store)
        self.main = "a"*40
        self.refs, self.prs, self.calls = [], [], []
        self.lose_pr_response = False
    def api(self, method, path, body=None):
        self.calls.append((method, path, body))
        if path.startswith("pulls?"):
            return self.prs
        if path == "git/ref/heads/main":
            return {"object": {"sha": self.main}}
        if path.startswith("git/commits/"):
            return {"tree": {"sha": "tree-base"}}
        if path == "git/trees":
            return {"sha": "new-tree"}
        if path == "git/commits":
            return {"sha": "new-commit"}
        if path.startswith("git/matching-refs/"):
            return self.refs
        if path == "git/refs":
            self.refs.append({"ref": body["ref"], "object": {"sha": body["sha"]}})
            return self.refs[-1]
        if path == "pulls":
            pr = {"html_url": "https://github.com/owner/repo/pull/1", "number": 1, "state": "open"}
            self.prs.append(pr)
            if self.lose_pr_response:
                raise TimeoutError("Connection lost after PR creation")
            return pr
        if path.endswith("/labels"):
            return []
        raise AssertionError((method, path))


def preview():
    return {"id": "preview", "review_key": "op_0123456789abcdef:2609.12345v2", "base_commit": "a"*40,
            "files": {"record.json": "{}"}, "title": "Record scoped progress", "body": "Proof locator"}


def test_publication_retry_after_lost_response_does_not_duplicate(tmp_path):
    gh = FakeGitHub(Store(tmp_path))
    gh.lose_pr_response = True
    with pytest.raises(TimeoutError):
        gh.publish(preview())
    result = gh.publish(preview())
    assert result["reused"] and result["number"] == 1
    assert len([c for c in gh.calls if c[:2] == ("POST", "pulls")]) == 1
    assert any(c[:2] == ("POST", "issues/1/labels") for c in gh.calls)
    assert not any(c[0] in {"PATCH", "PUT", "DELETE"} for c in gh.calls)


def test_publication_rejects_stale_main_before_writing(tmp_path):
    gh = FakeGitHub(Store(tmp_path))
    gh.main = "b"*40
    with pytest.raises(ValueError, match="main changed"):
        gh.publish(preview())
    assert all(c[0] == "GET" for c in gh.calls)


def test_publication_does_not_overwrite_external_branch(tmp_path):
    gh = FakeGitHub(Store(tmp_path))
    gh.refs = [{"ref": "refs/heads/research-monitor/"+digest(preview()["review_key"])[:24], "object": {"sha": "human-change"}}]
    with pytest.raises(ValueError, match="changed externally"):
        gh.publish(preview())
    assert not gh.prs


async def test_mcp_tools_and_owner_gate(tmp_path, record, monkeypatch):
    monitor = Monitor(Store(tmp_path), FakeCatalog(record), SimpleNamespace(token=""))
    mcp = server.build_server(monitor, None, {"58557763"})
    async with Client(mcp) as client:
        tools = await client.list_tools()
        names = {t.name for t in tools}
        assert {"get_status", "prepare_update", "publish_update", "record_review"} <= names
        assert not any("merge" in name or "delete" in name for name in names)
        monkeypatch.setattr(server, "get_access_token", lambda: SimpleNamespace(claims={"sub": "attacker"}))
        result = await client.call_tool("get_status", {}, raise_on_error=False)
        assert result.is_error
        monkeypatch.setattr(server, "get_access_token", lambda: SimpleNamespace(claims={"sub": "58557763"}))
        result = await client.call_tool("get_status", {})
        assert result.data["repository"] == "owner/repo"
        rules = await client.call_tool("workflow_instructions", {})
        assert "Solved" in rules.data
