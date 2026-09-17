from __future__ import annotations

import hashlib
import json
import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

PAPER = r"(?:\d{4}\.\d{4,5}|[a-z][a-z.-]*/\d{7})"
PROBLEM = r"op_[0-9a-f]{16}"


def digest(value) -> str:
    return hashlib.sha256(json.dumps(value, sort_keys=True, ensure_ascii=False,
                                     separators=(",", ":")).encode()).hexdigest()


class Review(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    problem_id: str = Field(pattern=f"^{PROBLEM}$")
    record_hash: str = Field(pattern=r"^[0-9a-f]{64}$")
    paper_id: str = Field(pattern=f"^{PAPER}$")
    paper_version: int = Field(ge=1, le=1000)
    result: Literal["uncertain", "irrelevant", "related", "partial", "resolved"]
    reason: str = Field(min_length=10, max_length=12000)
    evidence_url: str = Field(default="", max_length=1000)
    theorem_locator: str = Field(default="", max_length=2000)
    scope_comparison: str = Field(default="", max_length=12000)
    full_text_verified: bool = False
    independent_verification: str = Field(default="", max_length=12000)
    publication_status: Literal["preprint", "peer-reviewed", "unknown"] = "unknown"

    @model_validator(mode="after")
    def evidence(self):
        if self.result in {"partial", "resolved"}:
            expected = f"https://arxiv.org/abs/{self.paper_id}v{self.paper_version}"
            if self.evidence_url != expected:
                raise ValueError(f"Use the exact reviewed arXiv version: {expected}")
            if not self.full_text_verified or len(self.theorem_locator) < 3 or len(self.scope_comparison) < 30:
                raise ValueError("A scientific update needs full text, a theorem locator and a scope comparison")
            if self.publication_status == "unknown":
                raise ValueError("Identify whether the evidence is a preprint or peer-reviewed")
        if self.result == "resolved" and len(self.independent_verification) < 50:
            raise ValueError("Resolved requires a separately performed verification, with method and outcome")
        return self

    @property
    def key(self):
        return f"{self.problem_id}:{self.paper_id}v{self.paper_version}"


class Reference(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    key: str = Field(min_length=1, max_length=200)
    label: str = Field(pattern=r"^ref:[a-zA-Z0-9_.:-]+$", max_length=200)
    tex: str = Field(min_length=10, max_length=12000)


class Update(BaseModel):
    """Append-only scientific additions; identities and statements are immutable."""
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
    review_key: str = Field(min_length=10, max_length=200)
    progress: str = Field(min_length=30, max_length=12000)
    references: list[Reference] = Field(min_length=1, max_length=10)
    status: Literal["Unsolved", "Solved"] = "Unsolved"


def updated_record(record: dict, review: Review, update: Update) -> dict:
    if review.key != update.review_key or record["id"] != review.problem_id:
        raise ValueError("Review and update refer to different problems")
    if digest(record) != review.record_hash:
        raise ValueError("Problem changed since review; read it again and update the evidence")
    if record["status"] != "Unsolved":
        raise ValueError("Automatic updates target Unsolved problems only")
    if review.result not in {"partial", "resolved"}:
        raise ValueError("Only a verified partial or resolved result can create a PR")
    if (review.result == "resolved") != (update.status == "Solved"):
        raise ValueError("Partial progress stays Unsolved; Solved requires a resolved review")
    exact = f"{review.paper_id}v{review.paper_version}"
    exact_refs = [r for r in update.references if re.search(
        r"https://arxiv\.org/(?:abs|pdf)/" + re.escape(exact) + r"(?![0-9])", r.tex)]
    if not exact_refs:
        raise ValueError("Reference must include the reviewed paper version")
    result = json.loads(json.dumps(record))
    refs = {r["key"]: r for r in result["references"]}
    labels = {r["label"]: r["key"] for r in result["references"]}
    for ref in update.references:
        item = ref.model_dump()
        if ref.key in refs and refs[ref.key] != item:
            raise ValueError("Cannot overwrite an existing reference; use a new key")
        if ref.label in labels and labels[ref.label] != ref.key:
            raise ValueError("Reference label already belongs to another key")
        if ref.key not in refs:
            result["references"].append(item)
        refs[ref.key] = item
        labels[ref.label] = ref.key
    if not any(f"\\sourcecite{{{r.label}}}{{{r.key}}}" in update.progress for r in exact_refs):
        raise ValueError("Progress must cite its reference using sourcecite")
    if update.progress not in result["progress"]:
        result["progress"].append(update.progress)
    result["status"] = update.status
    return result
