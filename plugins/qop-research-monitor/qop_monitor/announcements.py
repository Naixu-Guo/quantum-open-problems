#!/usr/bin/env python3
"""Read official arXiv announcement HTML without waiting for the API/RSS batch.

Python standard library only. /list/<category>/new supplies announcement dates,
titles, authors, categories and abstracts, but not submission timestamps. Those
timestamps remain null. Versions come from explicit versioned links, or v1 only
for the page's New submissions section. Unversioned cross-lists/replacements are
retained separately for review, never imported as an invented v1.
"""
from __future__ import annotations

import datetime as dt
from html.parser import HTMLParser
import re
import urllib.parse

UTC = dt.timezone.utc
MAX_BYTES = 12 * 1024 * 1024
CATEGORY_RE = re.compile(r"(?:[a-z]+(?:-[a-z]+)*)(?:\.[A-Za-z][A-Za-z-]*)?\Z")
ID_RE = re.compile(r"(?P<id>\d{4}\.\d{4,5}|[a-z][a-z.-]*/\d{7})(?:v(?P<version>[1-9]\d*))?\Z")
MONTHS = {name: i + 1 for i, name in enumerate(("January February March April May June July August September October November December").split())}


class AnnouncementError(ValueError):
    pass


def clean(value):
    return " ".join(value.split())


def iso(value):
    return value.astimezone(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


class Node:
    def __init__(self, tag, attrs=()):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []

    def text(self):
        return clean(" ".join(child.text() if isinstance(child, Node) else child for child in self.children))

    def descendants(self, tag=None, cls=None):
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag == tag) and (cls is None or cls in child.attrs.get("class", "").split()):
                    yield child
                yield from child.descendants(tag, cls)


class Document(HTMLParser):
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}

    def __init__(self, raw):
        super().__init__(convert_charrefs=True)
        self.root = Node("document")
        self.stack = [self.root]
        self.feed(raw)
        self.close()

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in self.VOID:
            if len(self.stack) > 150:
                raise AnnouncementError("Unexpectedly nested arXiv HTML")
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def first(node, tag=None, cls=None):
    return next(node.descendants(tag, cls), None)


def page_date(document):
    for heading in document.descendants("h3"):
        match = re.search(r"Showing new listings for [A-Za-z]+, (\d{1,2}) ([A-Za-z]+) (\d{4})", heading.text())
        if match:
            try:
                return dt.date(int(match[3]), MONTHS[match[2]], int(match[1])).isoformat()
            except (KeyError, ValueError) as exc:
                raise AnnouncementError("Invalid announcement date on arXiv page") from exc
    raise AnnouncementError("Missing official announcement date; refusing to label the page as today's batch")


def parse_listing(raw, source_url, checked_at=None):
    """Parse one complete official /new page; no network or inferred timestamps."""
    if isinstance(raw, bytes):
        if len(raw) > MAX_BYTES:
            raise AnnouncementError("Oversized arXiv HTML")
        raw = raw.decode("utf-8")
    parsed_url = urllib.parse.urlparse(source_url)
    if parsed_url.scheme != "https" or parsed_url.hostname != "arxiv.org" or not re.fullmatch(r"/list/[^/]+/new", parsed_url.path):
        raise AnnouncementError("Listing source must be an official https://arxiv.org/list/<category>/new URL")
    checked_at = checked_at or iso(dt.datetime.now(UTC))
    tree = Document(raw).root
    announcement_date = page_date(tree)
    totals = [re.search(r"Total of ([\d,]+) entries", node.text()) for node in tree.descendants(cls="paging")]
    total = next((int(match[1].replace(",", "")) for match in totals if match), None)
    papers, unresolved, errors = [], [], []
    observed = 0
    sections = {}
    for listing in tree.descendants("dl"):
        if listing.attrs.get("id") != "articles":
            continue
        section, pending = None, None
        for child in listing.children:
            if not isinstance(child, Node):
                continue
            if child.tag == "h3":
                label = child.text()
                if label.startswith("New submissions"):
                    section = "new"
                elif label.startswith(("Cross submissions", "Cross-lists")):
                    section = "cross-list"
                elif label.startswith(("Replacement submissions", "Replacements")):
                    section = "replacement"
                else:
                    section = None
                counts = re.search(r"showing ([\d,]+) of ([\d,]+) entries", label)
                if section and counts:
                    sections[section] = {"shown": int(counts[1].replace(",", "")), "total": int(counts[2].replace(",", ""))}
            elif child.tag == "dt":
                if pending is not None:
                    errors.append("Entry missing its metadata block")
                pending = child
            elif child.tag == "dd":
                observed += 1
                if pending is None or section is None:
                    errors.append("Entry missing an identifier or recognized section")
                    continue
                try:
                    record = parse_entry(pending, child, section, source_url, announcement_date, checked_at)
                    (papers if record["version"] is not None else unresolved).append(record)
                except AnnouncementError as exc:
                    errors.append(str(exc))
                pending = None
        if pending is not None:
            errors.append("Entry missing its metadata block")
    if total is None:
        # A known date without a count is not enough to distinguish an empty
        # announcement from a changed HTML template.
        raise AnnouncementError("Missing listing total; arXiv HTML may have changed")
    truncated = observed < total or any(item["shown"] < item["total"] for item in sections.values())
    if observed > total:
        errors.append("Parsed entries exceed the advertised listing total")
    if total and not sections:
        errors.append("No recognized announcement sections")
    health = {"source_url": source_url, "announcement_date": announcement_date,
              "checked_at": checked_at, "status": "degraded" if errors or truncated else "ok",
              "advertised_entries": total, "observed_entries": observed,
              "importable_entries": len(papers), "unversioned_entries": len(unresolved),
              "truncated": truncated, "sections": sections, "errors": errors}
    return {"papers": papers, "unversioned_papers": unresolved, "health": health}


def parse_entry(header, body, section, source_url, announcement_date, checked_at):
    links = list(header.descendants("a"))
    identifier_link = next((node for node in links if node.attrs.get("href", "").startswith("/abs/")), None)
    if identifier_link is None:
        raise AnnouncementError("Entry lacks an official abstract link")
    match = ID_RE.fullmatch(identifier_link.attrs["href"].removeprefix("/abs/"))
    if not match:
        raise AnnouncementError("Malformed arXiv identifier in announcement")
    paper_id = match["id"]
    versions = {int(match["version"])} if match["version"] else set()
    for node in links:
        href = urllib.parse.urljoin("https://arxiv.org", node.attrs.get("href", ""))
        parsed = urllib.parse.urlparse(href)
        if parsed.hostname != "arxiv.org":
            continue
        linked = re.fullmatch(r"/(?:abs|html|pdf)/" + re.escape(paper_id) + r"v([1-9]\d*)(?:\.pdf)?", parsed.path)
        if linked:
            versions.add(int(linked[1]))
    if len(versions) > 1 or (section == "new" and versions and versions != {1}):
        raise AnnouncementError(f"{paper_id}: contradictory version evidence")
    version = next(iter(versions), 1 if section == "new" else None)
    title_node = first(body, cls="list-title")
    author_node = first(body, cls="list-authors")
    subject_node = first(body, cls="list-subjects")
    abstract_node = first(body, "p", "mathjax")
    if any(node is None for node in (title_node, author_node, subject_node, abstract_node)):
        raise AnnouncementError(f"{paper_id}: incomplete title/author/subject/abstract fields")
    title = re.sub(r"^Title:\s*", "", title_node.text())
    abstract = abstract_node.text()
    authors = [node.text() for node in author_node.descendants("a") if node.text()]
    categories = [code for code in re.findall(r"\(([^()]+)\)", subject_node.text()) if CATEGORY_RE.fullmatch(code)]
    if not title or not abstract or not authors or not categories:
        raise AnnouncementError(f"{paper_id}: empty essential metadata")
    version_suffix = f"v{version}" if version else ""
    return {"id": paper_id, "version": version, "title": title, "abstract": abstract,
            "authors": authors, "categories": list(dict.fromkeys(categories)),
            "published": None, "updated": None,
            "url": f"https://arxiv.org/abs/{paper_id}{version_suffix}",
            "pdf_url": f"https://arxiv.org/pdf/{paper_id}{version_suffix}",
            "source": "arxiv-announcements", "source_url": source_url,
            "announcement_date": announcement_date, "checked_at": checked_at,
            "announcement_type": section,
            "version_evidence": "explicit_versioned_link" if versions else "new_submissions_section" if section == "new" else "not_available",
            "metadata_note": "Submission/revision timestamps are not present on the announcement page."}
