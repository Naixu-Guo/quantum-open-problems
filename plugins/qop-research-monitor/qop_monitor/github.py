from __future__ import annotations

import httpx

from .models import digest
from .store import Store


class GitHub:
    def __init__(self, repository: str, token: str, store: Store):
        self.repository, self.token, self.store = repository, token, store

    def api(self, method, path, body=None):
        if not self.token:
            raise ValueError("Publishing is not configured: provision the repository-scoped GitHub token on the server")
        response = httpx.request(method, f"https://api.github.com/repos/{self.repository}/{path}",
                                headers={"Authorization": f"Bearer {self.token}",
                                         "Accept": "application/vnd.github+json",
                                         "X-GitHub-Api-Version": "2022-11-28"},
                                json=body, timeout=45, follow_redirects=False)
        if response.status_code >= 400:
            # Never include response payloads or request headers containing credentials.
            raise ValueError(f"GitHub {method} {path} returned HTTP {response.status_code}; inspect state before retrying")
        return response.json()

    def existing(self, branch):
        owner = self.repository.split("/")[0]
        result = self.api("GET", f"pulls?state=all&head={owner}:{branch}&per_page=100")
        return result[0] if result else None

    def publish(self, preview: dict):
        key = preview["review_key"]
        branch = "research-monitor/" + digest(key)[:24]
        receipt = self.store.get("publications", key, {})
        prior = self.existing(branch)
        if prior:
            result = {"url": prior["html_url"], "number": prior["number"],
                    "state": "merged" if prior.get("merged_at") else prior["state"],
                    "reused": True, "note": "Existing PR was not overwritten. Inspect its diff before treating this preview as published."}
            if receipt.get("preview_id") == preview["id"] and prior["state"] == "open":
                self.label(result)
                self.store.put("publications", key, {**receipt, "phase": "created", "result": result})
            return result
        if receipt and receipt.get("preview_id") != preview["id"]:
            raise ValueError("An earlier publication for this paper/problem may be in flight. Reconcile it before changing the preview")
        main = self.api("GET", "git/ref/heads/main")["object"]["sha"]
        if main != preview["base_commit"]:
            raise ValueError("main changed after validation; create a fresh preview")
        if not receipt.get("commit"):
            self.store.put("publications", key, {"preview_id": preview["id"], "phase": "preparing"})
            base = self.api("GET", f"git/commits/{main}")
            tree = self.api("POST", "git/trees", {"base_tree": base["tree"]["sha"], "tree": [
                {"path": name, "mode": "100644", "type": "blob", "content": text}
                for name, text in preview["files"].items()]})
            commit = self.api("POST", "git/commits", {
                "message": preview["title"], "tree": tree["sha"], "parents": [main]})
            receipt = {"preview_id": preview["id"], "phase": "commit_ready", "commit": commit["sha"]}
            self.store.put("publications", key, receipt)
        # A crash after ref creation is reconciled without force-pushing.
        refs = self.api("GET", "git/matching-refs/heads/" + branch)
        exact = next((r for r in refs if r["ref"] == "refs/heads/" + branch), None)
        if exact and exact["object"]["sha"] != receipt["commit"]:
            raise ValueError("Publication branch changed externally; refusing to overwrite it")
        if not exact:
            self.api("POST", "git/refs", {"ref": "refs/heads/" + branch, "sha": receipt["commit"]})
        self.store.put("publications", key, {**receipt, "phase": "pr_pending"})
        pr = self.api("POST", "pulls", {"title": preview["title"], "body": preview["body"],
                                       "head": branch, "base": "main", "draft": True})
        result = {"url": pr["html_url"], "number": pr["number"], "state": "open", "draft": True, "reused": False}
        self.label(result)
        self.store.put("publications", key, {**receipt, "phase": "created", "result": result})
        return result

    def label(self, result):
        try:
            self.api("POST", f"issues/{result['number']}/labels", {"labels": ["ledger-change"]})
        except (ValueError, httpx.HTTPError):
            result["warning"] = "PR exists but ledger-change labeling failed. Apply that label before evaluating CI."

    def pr_status(self, number: int):
        if number < 1:
            raise ValueError("Invalid PR number")
        pr = self.api("GET", f"pulls/{number}")
        checks = self.api("GET", f"commits/{pr['head']['sha']}/check-runs?per_page=100")
        status = self.api("GET", f"commits/{pr['head']['sha']}/status")
        return {"url": pr["html_url"], "state": "merged" if pr.get("merged_at") else pr["state"],
                "draft": pr["draft"], "head": pr["head"]["sha"],
                "checks": [{"name": c["name"], "status": c["status"], "conclusion": c["conclusion"]} for c in checks["check_runs"]],
                "checks_total": checks["total_count"], "commit_status": status["state"],
                "note": "CI checks validate repository integrity, not the mathematical proof."}
