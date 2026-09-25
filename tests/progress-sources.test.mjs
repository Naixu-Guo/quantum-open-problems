import assert from "node:assert/strict";
import test from "node:test";
import { normalizeArchivalLink, normalizeHistoricalLink } from "../shared/progress-sources.mjs";

test("canonical sources preserve manuscript versions and normalize common paper identifiers", () => {
  for (const [input, url, type] of [
    ["arXiv:2509.12345v2", "https://arxiv.org/abs/2509.12345v2", "arxiv"],
    ["https://arxiv.org/pdf/quant-ph/0605070v1.pdf", "https://arxiv.org/abs/quant-ph/0605070v1", "arxiv"],
    ["http://zenodo.org/record/123456", "https://zenodo.org/records/123456", "zenodo"],
    ["doi:10.1000/example", "https://doi.org/10.1000/example", "doi"],
    ["https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.123.123456", "https://doi.org/10.1103/PhysRevLett.123.123456", "doi"],
    ["https://eprint.iacr.org/2026/123.pdf", "https://eprint.iacr.org/2026/123", "preprint"],
    ["https://quantum-journal.org/papers/q-2026-01-01-1234/", "https://quantum-journal.org/papers/q-2026-01-01-1234/", "publication"],
  ]) assert.deepEqual(normalizeArchivalLink(input), { url, type });
});

test("new progress cannot substitute arbitrary links, home pages, credentials, or disguised hosts", () => {
  for (const value of [undefined, "", "   ", "Paper title", "https://arxiv.org", "https://arxiv.org/abs/2513.12345", "https://zenodo.org", "https://doi.org/", "https://github.com/Naixu-Guo/quantum-open-problems/issues/1", "https://example.com/paper.pdf", "https://arxiv.org.example.com/abs/2509.12345", "https://user:password@arxiv.org/abs/2509.12345", "https://arxiv.org:9000/abs/2509.12345", "javascript:alert(1)", "https://arxiv.org/abs/2509.12345\nhttps://evil.example", "https://doi.org/10.1000/%ZZ"])
    assert.throws(() => normalizeArchivalLink(value), undefined, String(value));
});

test("historical links identify the original project report or comment without claiming eligibility", () => {
  assert.equal(normalizeHistoricalLink("https://github.com/Naixu-Guo/quantum-open-problems/issues/12#issuecomment-1234"), "https://github.com/Naixu-Guo/quantum-open-problems/issues/12#issuecomment-1234");
  assert.equal(normalizeHistoricalLink("https://github.com/naixu-guo/quantum-open-problems/pull/42"), "https://github.com/Naixu-Guo/quantum-open-problems/pull/42");
  for (const value of ["https://github.com/Naixu-Guo/quantum-open-problems/issues", "https://github.com/elsewhere/repo/issues/12", "https://github.com/Naixu-Guo/quantum-open-problems/issues/12?claim=new", "https://github.com/Naixu-Guo/quantum-open-problems/issues/12#unknown", "https://example.com/Naixu-Guo/quantum-open-problems/issues/12"])
    assert.throws(() => normalizeHistoricalLink(value));
});
