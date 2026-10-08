from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor

from .arxiv import Arxiv
from .catalog import Catalog
from .github import GitHub
from .models import Review, Update, digest, updated_record
from .store import Store, now


class Monitor:
    def __init__(self, store: Store, catalog: Catalog, github: GitHub):
        self.store, self.catalog, self.github = store, catalog, github
        self.arxiv = Arxiv(store)
        self.worker = ThreadPoolExecutor(max_workers=1, thread_name_prefix="qop-validation")
        self.futures = {}
        # A single server process owns this persistent volume.
        for item in store.items("jobs"):
            if item["value"]["state"] in {"queued", "running"}:
                store.put("jobs", item["key"], {**item["value"], "state": "interrupted",
                          "error": "Server restarted; call prepare_update again with the same update"})

    def status(self):
        return {"service": "qop-research-monitor/0.1.0", "repository": self.catalog.repository,
                "publication_configured": bool(self.github.token), "auto_merge": False,
                "categories": ["quant-ph", "cond-mat.str-el"],
                "reviews": len(self.store.items("reviews")), "papers": len(self.store.items("papers")),
                "jobs": [{"id": x["key"], "state": x["value"]["state"]} for x in self.store.items("jobs")],
                "arxiv_limits": self.store.get("meta", "arxiv", {}),
                "schedule": "Scheduling is owned by ChatGPT; this service does not create a daily timer."}

    def problem(self, problem_id):
        commit = self.catalog.refresh()
        record = self.catalog.record(problem_id, commit)
        return {"record": record, "record_hash": digest(record), "catalog_commit": commit,
                "url": f"https://qiqc-op.com/problems/{problem_id}/"}

    def problems(self, offset=0, limit=20):
        if offset < 0 or not 1 <= limit <= 50:
            raise ValueError("Invalid pagination")
        commit = self.catalog.refresh()
        records = [r for r in self.catalog.problems(commit) if r["status"] == "Unsolved"]
        return {"catalog_commit": commit, "total": len(records), "offset": offset,
                "next_offset": offset+limit if offset+limit < len(records) else None,
                "problems": [{"record": r, "record_hash": digest(r)} for r in records[offset:offset+limit]]}

    def candidates(self, offset=0, limit=20):
        if offset < 0 or not 1 <= limit <= 50:
            raise ValueError("Invalid pagination")
        commit = self.catalog.refresh()
        all_papers = list(reversed(self.store.items("papers")))
        pending = []
        for item in all_papers:
            if item["value"].get("resolved_to"):
                continue
            screening = self.store.get("screenings", item["key"], {})
            if screening.get("content_hash") == item["value"]["content_hash"] and screening.get("catalog_commit") == commit:
                continue
            pending.append({"paper_key": item["key"], **item["value"], "previous_screening": screening or None})
        return {"catalog_commit": commit, "total": len(pending), "offset": offset,
                "next_offset": offset+limit if offset+limit < len(pending) else None,
                "papers": pending[offset:offset+limit]}

    def screening(self, paper_key, catalog_commit, notes, matching_problem_ids):
        paper = self.store.get("papers", paper_key)
        if not paper:
            raise ValueError("Unknown paper key")
        if not paper.get("version"):
            raise ValueError("Resolve the paper version using get_paper_metadata before screening it")
        if len(notes.strip()) < 20:
            raise ValueError("Record the actual screening scope and rationale")
        current = self.catalog.refresh()
        if current != catalog_commit:
            raise ValueError("Catalog changed; account for the new statements before marking screened")
        for problem_id in matching_problem_ids:
            self.catalog.record(problem_id, current)
            review = self.store.get("reviews", f"{problem_id}:{paper_key}")
            if not review or review["review"]["record_hash"] != digest(self.catalog.record(problem_id, current)):
                raise ValueError("Save an up-to-date review (uncertain is sufficient) for each match before marking screened")
        result = {"catalog_commit": current, "content_hash": paper["content_hash"],
                  "notes": notes, "matches": matching_problem_ids, "screened_at": now()}
        self.store.put("screenings", paper_key, result)
        return result

    def review(self, review: Review):
        record = self.problem(review.problem_id)["record"]
        if review.record_hash != digest(record):
            raise ValueError("Stale problem hash; read the current problem first")
        if review.result in {"partial", "resolved"}:
            if not self.store.get("fulltexts", f"{review.paper_id}v{review.paper_version}"):
                raise ValueError("Retrieve the exact paper full text before recording a verified update")
        previous = self.store.get("reviews", review.key, {})
        item = {"review": review.model_dump(), "updated_at": now()}
        if previous.get("publication"):
            item["publication"] = previous["publication"]
        self.store.put("reviews", review.key, item)
        return {"review_key": review.key, **item}

    def queue(self, offset=0, limit=20):
        if offset < 0 or not 1 <= limit <= 50:
            raise ValueError("Invalid pagination")
        items = [x for x in self.store.items("reviews") if x["value"]["review"]["result"] in {"uncertain", "partial", "resolved"}]
        return {"total": len(items), "reviews": items[offset:offset+limit],
                "next_offset": offset+limit if offset+limit < len(items) else None}

    def prepare(self, update: Update):
        item = self.store.get("reviews", update.review_key)
        if not item:
            raise ValueError("Save the evidence review before preparing an update")
        review = Review.model_validate(item["review"])
        commit = self.catalog.refresh()
        record = self.catalog.record(review.problem_id, commit)
        proposed = updated_record(record, review, update)
        job_id = digest({"base": commit, "review": review.model_dump(), "update": update.model_dump()})
        with self.store.lock("queue"):
            previous = self.store.get("jobs", job_id)
            if previous and previous["state"] in {"queued", "running", "ready", "published"}:
                return {"job_id": job_id, "state": previous["state"], "reused": True}
            if any(x["value"]["state"] in {"queued", "running"} for x in self.store.items("jobs")):
                raise ValueError("A validation job is active; poll get_update and resume after it finishes")
            self.store.put("jobs", job_id, {"state": "queued", "review_key": review.key, "created_at": now()})
            self.futures[job_id] = self.worker.submit(self._build, job_id, commit, review, proposed)
        return {"job_id": job_id, "state": "queued", "next": "Call get_update later; validation runs independently of this MCP request."}

    def _build(self, job_id, commit, review, proposed):
        try:
            self.store.put("jobs", job_id, {"state": "running", "review_key": review.key})
            with self.store.lock("publication"):
                validated = self.catalog.validate(commit, proposed)
            title = f"Record {'resolution' if review.result == 'resolved' else 'progress'} for {proposed['title']}"[:200]
            body = (f"Updates `{review.problem_id}` using {review.evidence_url} ({review.publication_status}).\n\n"
                    f"Evidence: {review.theorem_locator}\n\n{review.scope_comparison}\n\n"
                    f"Verification: {review.reason}\n\n"
                    + (f"Independent verification: {review.independent_verification}\n\n" if review.independent_verification else "")
                    + "Validation:\n" + "\n".join(f"- `{c}`" for c in validated["checks"])
                    + "\n\nThe checks validate repository consistency, not the scientific proof. This PR is not auto-merged.\n\n"
                    + "I submit the original catalog text under CC BY 4.0 and code under Apache-2.0, per CONTRIBUTING.md. No third-party full text is included.\n\n"
                    + f"<!-- qop-monitor:{review.key} -->")
            preview = {"id": job_id, "base_commit": commit, "review_key": review.key,
                       "review_hash": digest(review.model_dump()), "title": title, "body": body, **validated}
            self.store.put("previews", job_id, preview)
            self.store.put("jobs", job_id, {"state": "ready", "review_key": review.key})
        except Exception as exc:
            self.store.put("jobs", job_id, {"state": "failed", "review_key": review.key, "error": str(exc)[-4000:]})

    def update(self, job_id, offset=0, limit=18000):
        if offset < 0 or not 100 <= limit <= 24000:
            raise ValueError("Invalid diff pagination")
        job = self.store.get("jobs", job_id)
        if not job:
            raise ValueError("Unknown validation job")
        preview = self.store.get("previews", job_id)
        if not preview:
            return job
        end = offset + limit
        return {**job, "job_id": job_id, "base_commit": preview["base_commit"],
                "title": preview["title"], "body": preview["body"], "files": list(preview["files"]),
                "diff": preview["diff"][offset:end], "next_offset": end if end < len(preview["diff"]) else None}

    def publish(self, job_id):
        with self.store.lock("publication"):
            preview = self.store.get("previews", job_id)
            if not preview:
                raise ValueError("Validation must finish successfully before publishing")
            item = self.store.get("reviews", preview["review_key"])
            if not item or digest(item["review"]) != preview["review_hash"]:
                raise ValueError("Evidence changed after preview; prepare a new update")
            result = self.github.publish(preview)
            self.store.put("reviews", preview["review_key"], {**item, "publication": result})
            self.store.put("jobs", job_id, {"state": "published", "review_key": preview["review_key"], "publication": result})
            return result
