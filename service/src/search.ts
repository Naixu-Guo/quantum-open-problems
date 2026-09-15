/** Deliberately small lexical equivalences; do not stem arbitrary mathematical notation. */
const CHINESE_TERMS: [string, string][] = [
  ["量子错误纠正", "quantum error correction"], ["量子纠错", "quantum error correction"],
  ["量子资源理论", "quantum resource theory"], ["量子密码学", "quantum cryptography"],
  ["量子密码", "quantum cryptography"], ["量子通信", "quantum communication"],
  ["量子通讯", "quantum communication"], ["量子计量", "quantum metrology"],
  ["量子算法", "quantum algorithm"], ["量子容量", "quantum capacity"],
  ["最短向量问题", "svp"], ["最短向量", "svp"], ["稳定子秩", "stabilizer rank"],
  ["纠缠蒸馏", "entanglement distillation"], ["哈密顿量模拟", "hamiltonian simulation"],
  ["玻色子采样", "boson sampling"], ["量子复杂性", "quantum complexity"],
];

export function normalizeSearch(text: string): string {
  let normalized = text.normalize("NFC").toLowerCase();
  for (const [source, target] of CHINESE_TERMS) normalized = normalized.replaceAll(source, ` ${target} `);
  return normalized
    .replace(/(?<![\p{L}\p{N}_])qma\s*(?:\(\s*2\s*\)|2)(?![\p{L}\p{N}_])/gu, "qma(2)")
    .replace(/\bshortest[\s-]+vector(?:[\s-]+problems?)?\b/gu, "svp")
    .replace(/\bstabilis(er|ers|ation)\b/gu, (_, suffix: string) => `stabiliz${suffix}`)
    .replace(/\bquantum algorithms\b/gu, "quantum algorithm")
    .replace(/\s+/gu, " ").trim();
}

export type MatchField = "title" | "statement" | "progress" | "body" | "taxonomy" | "keywords" | "alias";
export interface SearchDocument {
  title: string; statement: string; progress: string; body: string; taxonomy: string; keywords: string;
  /** Authored catalog ID for the site's final chronological tie-break; not a search term. */
  stableId: string;
  /** Identifiers and aliases are only eligible for a complete exact match. */
  aliases: string[];
}
export interface SearchMatch {
  score: number;
  fields: MatchField[];
  snippet: string;
  normalizedQuery: string;
}

const WEIGHTS = { title: 100, statement: 50, keywords: 40, taxonomy: 30, progress: 25, body: 10 } as const;
const FIELDS = Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[];
const WORD = /[\p{L}\p{N}_]/u;

/** Read only the neighboring code point, never a document-sized prefix or suffix. */
function pointAt(text: string, index: number): string {
  const point = text.codePointAt(index);
  return point === undefined ? "" : String.fromCodePoint(point);
}

function pointBefore(text: string, index: number): string {
  if (index === 0) return "";
  const last = text.charCodeAt(index - 1);
  const previous = text.charCodeAt(index - 2);
  const pair = last >= 0xdc00 && last <= 0xdfff && previous >= 0xd800 && previous <= 0xdbff;
  return text.slice(index - (pair ? 2 : 1), index);
}

/** SQL LIKE and regular-expression metacharacters remain literal, with word boundaries. */
function position(text: string, term: string): number {
  const startsWord = WORD.test(pointAt(term, 0));
  const endsWord = WORD.test(pointBefore(term, term.length));
  let from = 0;
  while (from <= text.length) {
    const at = text.indexOf(term, from);
    if (at < 0) return -1;
    if ((!startsWord || !WORD.test(pointBefore(text, at))) && (!endsWord || !WORD.test(pointAt(text, at + term.length)))) return at;
    // A rejected occurrence can overlap a later valid literal occurrence.
    from = at + 1;
  }
  return -1;
}

export function searchMatch(document: SearchDocument, query: string): SearchMatch | null {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return null;
  // Normalization is for prose, never for opaque identifiers or exact aliases.
  if (document.aliases.some((alias) => alias.toLowerCase() === query.trim().toLowerCase())) {
    return { score: 1000, fields: ["alias"], snippet: document.title, normalizedQuery };
  }
  const terms = [...new Set(normalizedQuery.split(" "))];
  const normalized = Object.fromEntries(FIELDS.map((field) => [field, normalizeSearch(document[field])])) as Record<keyof typeof WEIGHTS, string>;
  const matched = new Set<keyof typeof WEIGHTS>();
  let score = 0;
  for (const term of terms) {
    let best = 0;
    for (const field of FIELDS) {
      if (position(normalized[field], term) >= 0) {
        matched.add(field);
        best = Math.max(best, WEIGHTS[field]);
      }
    }
    if (best === 0) return null;
    score += best;
  }
  for (const field of matched) if (position(normalized[field], normalizedQuery) >= 0) score += WEIGHTS[field];
  const fields = FIELDS.filter((field) => matched.has(field));
  const snippetField = fields[0]!;
  // Search normalization is never shown as authored science: preserve original case,
  // symbols, and TeX in excerpts. Overlapping windows find aliases without applying
  // offsets from the (possibly shorter) normalized text to the original.
  const source = document[snippetField];
  let start = 0;
  for (let offset = 0; offset < source.length; offset += 160) {
    if (terms.some((term) => position(normalizeSearch(source.slice(offset, offset + 320)), term) >= 0)) {
      start = offset;
      break;
    }
  }
  const end = Math.min(source.length, start + 320);
  return { score, fields, snippet: `${start > 0 ? "…" : ""}${source.slice(start, end)}${end < source.length ? "…" : ""}`, normalizedQuery };
}

export class SearchError extends Error {
  readonly status: number;
  readonly code: "invalid_cursor" | "cursor_query_mismatch" | "catalog_changed" | "cursor_expired" | "invalid_search";
  constructor(status: number, code: SearchError["code"], message: string) {
    super(message);
    this.name = "SearchError";
    this.status = status;
    this.code = code;
  }
}
