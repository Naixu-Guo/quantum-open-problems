/** Whole-problem research pages. Budgets never remove individual scientific fields. */
import type { Index, ProblemPage, ProblemRow } from "./index.ts";

export const RESEARCH_SEARCH_VERSION = "qop-search-research/1";
export const RESEARCH_SEARCH_DEFAULT_BYTES = 32_768;
export const RESEARCH_SEARCH_MIN_BYTES = 16_384;
export const RESEARCH_SEARCH_MAX_BYTES = 1_048_576;
export const RESEARCH_SEARCH_BUDGET_SEMANTICS = {
  unit: "utf8-json-bytes", representation: "compact-json", scope: "entire-api-response",
  atomicUnit: "problem", excludes: ["http-headers", "mcp-envelope", "tokens"],
} as const;

/** Include the size field itself. Its digit count converges after at most a few passes. */
function measured<T extends { responseBytes: number }>(body: T): T {
  for (;;) {
    const bytes = Buffer.byteLength(JSON.stringify(body), "utf8");
    if (bytes === body.responseBytes) return body;
    body.responseBytes = bytes;
  }
}

export function researchSearchPage<T extends Record<string, unknown>>(
  index: Index,
  page: ProblemPage,
  options: { sort: string; sortDescription: string; maxBytes: number },
  detail: (row: ProblemRow) => T,
) {
  const compose = (problems: T[], maxBytes = options.maxBytes) => {
    const { rows: _rows, ...pagination } = index.prefixProblemPage(page, problems.length);
    return measured({
      schemaVersion: RESEARCH_SEARCH_VERSION, view: "research" as const, ...pagination,
      unit: "records" as const, count: problems.length, sort: options.sort, sortDescription: options.sortDescription,
      problems, maxBytes, responseBytes: 0, budgetSemantics: RESEARCH_SEARCH_BUDGET_SEMANTICS,
    });
  };
  let accepted = compose([]);
  for (const row of page.rows) {
    const candidate = compose([...accepted.problems, detail(row)]);
    if (candidate.responseBytes <= options.maxBytes) {
      accepted = candidate;
      continue;
    }
    if (accepted.count > 0) break;
    // Raising maxBytes can add digits to the response itself. Report a budget
    // which still fits when the caller retries with precisely this suggested value.
    let minimumRequiredBytes = candidate.responseBytes;
    for (;;) {
      const required = compose(candidate.problems, minimumRequiredBytes).responseBytes;
      if (required <= minimumRequiredBytes) break;
      minimumRequiredBytes = required;
    }
    return { status: 413 as const, body: {
      error: minimumRequiredBytes <= RESEARCH_SEARCH_MAX_BYTES
        ? "The first complete problem does not fit maxBytes. Raise maxBytes to minimumRequiredBytes or read this problem separately with get_problem; no scientific fields were truncated."
        : "The first complete problem exceeds the maximum research-search response budget. Read this problem separately with get_problem; no scientific fields were truncated.",
      code: "response_budget_too_small", minimumRequiredBytes, problemId: row.id, maxBytes: options.maxBytes,
    } };
  }
  return { status: 200 as const, body: accepted, compactJson: true as const };
}
