from __future__ import annotations

from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import io
import re
import time

from bs4 import BeautifulSoup
import httpx
from pypdf import PdfReader

from .announcements import parse_listing
from .models import PAPER, digest
from .store import Store, now

ALLOWED = {"quant-ph", "cond-mat.str-el"}


class Arxiv:
    def __init__(self, store: Store):
        self.store = store

    def fetch(self, path: str, max_bytes=24 * 1024 * 1024):
        url = "https://arxiv.org" + path
        with self.store.lock("arxiv"):
            limits = self.store.get("meta", "arxiv", {})
            if limits.get("cooldown_until", 0) > time.time():
                raise ValueError(f"arXiv cooling down until {limits['cooldown_until']}; resume later")
            time.sleep(max(0, limits.get("last_request", 0) + 3.1 - time.time()))
            limits["last_request"] = time.time()
            self.store.put("meta", "arxiv", limits)
            # Never follow arbitrary redirects; no caller-controlled host or URL.
            with httpx.stream("GET", url, timeout=40, follow_redirects=False,
                              headers={"User-Agent": "QOPResearchMonitor/0.1 (https://qiqc-op.com/)"}) as response:
                if response.status_code in {429, 503}:
                    value = response.headers.get("Retry-After", "")
                    until = time.time() + 900
                    try:
                        until = max(until, time.time() + int(value))
                    except ValueError:
                        try:
                            until = max(until, parsedate_to_datetime(value).timestamp())
                        except (ValueError, TypeError, OverflowError):
                            pass
                    limits["cooldown_until"] = until
                    self.store.put("meta", "arxiv", limits)
                    raise ValueError(f"arXiv HTTP {response.status_code}; persistent cooldown enabled")
                response.raise_for_status()
                chunks, size = [], 0
                for chunk in response.iter_bytes():
                    size += len(chunk)
                    if size > max_bytes:
                        raise ValueError("arXiv response exceeds size limit")
                    chunks.append(chunk)
                return b"".join(chunks)

    def collect(self):
        today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        previous = self.store.get("batches", today)
        if previous:
            return {**previous, "cached": True}
        health, count = [], 0
        for category in sorted(ALLOWED):
            url = f"https://arxiv.org/list/{category}/new"
            try:
                listing = parse_listing(self.fetch(f"/list/{category}/new", 12 * 1024 * 1024), url)
                health.append(listing["health"])
                for paper in listing["papers"] + listing["unversioned_papers"]:
                    if not ALLOWED.intersection(paper["categories"]):
                        continue
                    # Unknown replacement versions remain unresolved, never invented v1.
                    key = paper["id"] + (f"v{paper['version']}" if paper["version"] else "v?")
                    paper["content_hash"] = digest({k: paper[k] for k in ("title", "abstract", "authors", "categories", "version")})
                    self.store.put("papers", key, paper)
                    count += 1
            except (ValueError, httpx.HTTPError) as exc:
                health.append({"source_url": url, "status": "failed", "error": str(exc)[:500]})
        result = {"checked_at": now(), "health": health, "entries_seen": count,
                  "note": "Only the currently published announcement batches were collected; missed days are not silently backfilled."}
        # Persist failed batches as well: do not loop against a failing source.
        self.store.put("batches", today, result)
        return result

    def metadata(self, paper_id: str, version: int | None = None):
        if not re.fullmatch(PAPER, paper_id) or (version is not None and not 1 <= version <= 1000):
            raise ValueError("Invalid arXiv identifier or version")
        suffix = f"v{version}" if version else ""
        key = paper_id + suffix
        # Latest-version lookups expire daily; versioned metadata is immutable.
        cached = self.store.get("metadata", key)
        if cached and (version or cached["checked_at"][:10] == now()[:10]):
            return cached
        soup = BeautifulSoup(self.fetch(f"/abs/{key}"), "html.parser")
        def meta(name):
            return [node.get("content", "") for node in soup.select(f'meta[name="{name}"]')]
        subjects = soup.select_one(".subjects")
        categories = re.findall(r"\(([a-z][a-z.-]+)\)", subjects.get_text(" ") if subjects else "")
        if not ALLOWED.intersection(categories):
            raise ValueError("Paper metadata does not establish an allowed category")
        history = soup.select_one(".submission-history")
        versions = [int(v) for v in re.findall(r"\[v([1-9]\d*)\]", history.get_text(" ") if history else "")]
        if not versions:
            raise ValueError("Cannot establish paper version from submission history")
        if version and version not in versions:
            raise ValueError("Requested version is absent from the submission history")
        chosen = version or max(versions)
        abstract = soup.select_one(".abstract")
        if not meta("citation_title") or not meta("citation_author") or not abstract:
            raise ValueError("Incomplete arXiv metadata; refuse to infer it")
        result = {"id": paper_id, "version": chosen, "latest_version": max(versions),
                  "title": meta("citation_title")[0], "authors": meta("citation_author"),
                  "abstract": abstract.get_text(" ", strip=True), "categories": categories,
                  "url": f"https://arxiv.org/abs/{paper_id}v{chosen}", "checked_at": now()}
        self.store.put("metadata", key, result)
        return result

    def text(self, paper_id: str, version: int, offset=0, limit=16000):
        if offset < 0 or not 100 <= limit <= 24000:
            raise ValueError("Use a nonnegative offset and a limit between 100 and 24000")
        metadata = self.metadata(paper_id, version)
        key = f"{paper_id}v{version}"
        cached = self.store.get("fulltexts", key)
        if not cached:
            try:
                soup = BeautifulSoup(self.fetch(f"/html/{key}"), "html.parser")
                article = soup.select_one("article")
                if article is None:
                    raise ValueError("No article text in HTML")
                text = article.get_text("\n", strip=True)
                if len(text) < 1000:
                    raise ValueError("Article text is unexpectedly short")
                source = f"https://arxiv.org/html/{key}"
            except (ValueError, httpx.HTTPStatusError) as exc:
                if isinstance(exc, httpx.HTTPStatusError) and exc.response.status_code not in {404, 406}:
                    raise
                # fetch enforces a shared cooldown before any PDF fallback.
                pdf = PdfReader(io.BytesIO(self.fetch(f"/pdf/{key}")))
                if len(pdf.pages) > 500:
                    raise ValueError("Paper exceeds extraction page limit")
                text = "\n\n".join(f"[PDF page {i+1}]\n{page.extract_text() or ''}" for i, page in enumerate(pdf.pages))
                source = f"https://arxiv.org/pdf/{key}"
            cached = {"text": text, "source": source}
            self.store.put("fulltexts", key, cached)
        chunk = cached["text"][offset:offset+limit]
        end = offset + len(chunk)
        return {"metadata": metadata, "source": cached["source"], "text": chunk,
                "offset": offset, "next_offset": end if end < len(cached["text"]) else None,
                "total_characters": len(cached["text"]),
                "warning": "Text extraction may omit equations/figures. Inspect the original for load-bearing details; fetching text is not proof verification."}
