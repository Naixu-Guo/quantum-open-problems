/** Version-bound reads of complete semantic sections, with opaque continuation for long sections. */
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const PROBLEM_READ_VERSION = "qop-problem-read/1";
export const PROBLEM_READ_DEFAULT_BYTES = 8_192;
export const PROBLEM_READ_MIN_BYTES = 2_048;
export const PROBLEM_READ_MAX_BYTES = 65_536;
export const PROBLEM_READ_CURSOR_TTL_MS = 3_600_000;
export const PROBLEM_READ_CACHE_DOCUMENTS = 8;
export const PROBLEM_READ_CACHE_BYTES = 16 * 1024 * 1024;
export const PROBLEM_READ_SECTIONS = ["statement", "history", "references", "comment"] as const;
export type ProblemReadSection = typeof PROBLEM_READ_SECTIONS[number];
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type ObjectJson = { [key: string]: Json };

export const PROBLEM_READ_BUDGET_SEMANTICS = {
  unit: "utf8-json-bytes", representation: "compact-json", scope: "entire-api-response",
  excludes: ["http-headers", "mcp-envelope", "tokens"],
} as const;

export class ProblemReadError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** An immutable handle; prepared section buffers remain private to the reader. */
export interface PreparedProblemDocument {
  readonly documentVersion: string;
  /** Estimated retained buffer and indexing bytes, not a total process heap limit. */
  readonly retainedBytes: number;
}

export interface ProblemReadPage {
  schemaVersion: typeof PROBLEM_READ_VERSION;
  problemId: string;
  documentVersion: string;
  section: ProblemReadSection;
  format: "json" | "json-continuation";
  content: ObjectJson | null;
  text: string | null;
  continued: boolean;
  complete: boolean;
  nextCursor: string | null;
  maxBytes: number;
  responseBytes: number;
  budgetSemantics: typeof PROBLEM_READ_BUDGET_SEMANTICS;
}

interface PreparedState {
  readonly sections: ReadonlyMap<ProblemReadSection, Buffer>;
}
const preparedStates = new WeakMap<PreparedProblemDocument, PreparedState>();

interface Cursor {
  v: typeof PROBLEM_READ_VERSION;
  p: string;
  d: string;
  s: ProblemReadSection;
  o: number;
  e: number;
}

const isObject = (value: Json | undefined): value is ObjectJson => value !== null && typeof value === "object" && !Array.isArray(value);
const sectionIsValid = (value: string): value is ProblemReadSection => (PROBLEM_READ_SECTIONS as readonly string[]).includes(value);
const versionIsValid = (value: string) => /^[a-f0-9]{64}$/u.test(value);

/** JSON wire semantics, with recursively sorted object keys and unchanged array order. */
function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return item;
    return Object.fromEntries(Object.entries(item).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  });
}

/** Preserve original section values and their citation/provenance metadata without summarizing them. */
function sectionContents(detail: ObjectJson): Record<ProblemReadSection, ObjectJson> {
  const research = isObject(detail["research"]) ? detail["research"] : { available: false };
  const researchContext = Object.fromEntries(Object.entries(research).filter(([key]) => !["source", "progress", "comment", "references"].includes(key)));
  return {
    statement: { statement: detail["statement"] ?? null, ...(Object.hasOwn(detail, "body") ? { body: detail["body"]! } : {}) },
    history: { source: research["source"] ?? [], progress: research["progress"] ?? [], researchContext },
    references: { bibliography: research["references"] ?? [], references: detail["references"] ?? [], researchContext },
    comment: { comment: research["comment"] ?? [], discussion: detail["comments"] ?? [], decisions: detail["decisions"] ?? [], researchContext },
  };
}

function measured<T extends { responseBytes: number }>(body: T): T {
  for (;;) {
    const size = Buffer.byteLength(JSON.stringify(body), "utf8");
    if (size === body.responseBytes) return body;
    body.responseBytes = size;
  }
}

function queryOptions(query: URLSearchParams) {
  const allowed = new Set(["section", "documentVersion", "cursor", "maxBytes"]);
  for (const key of query.keys()) {
    if (!allowed.has(key)) throw new ProblemReadError(400, "invalid_query", `Unknown problem-read parameter ${key}`);
    if (query.getAll(key).length !== 1) throw new ProblemReadError(400, "invalid_query", `${key} must be supplied only once`);
    if (!query.get(key)?.trim()) throw new ProblemReadError(400, "invalid_query", `${key} must be nonempty when supplied`);
  }
  const section = query.get("section");
  if (section !== null && !sectionIsValid(section)) throw new ProblemReadError(400, "invalid_query", "Unknown problem-read section");
  const documentVersion = query.get("documentVersion");
  if (documentVersion !== null && !versionIsValid(documentVersion)) throw new ProblemReadError(400, "invalid_query", "documentVersion must be a lowercase SHA-256 digest");
  const rawBytes = query.get("maxBytes");
  const maxBytes = rawBytes === null ? PROBLEM_READ_DEFAULT_BYTES : Number(rawBytes);
  if ((rawBytes !== null && !/^\d+$/u.test(rawBytes)) || !Number.isSafeInteger(maxBytes) || maxBytes < PROBLEM_READ_MIN_BYTES || maxBytes > PROBLEM_READ_MAX_BYTES) {
    throw new ProblemReadError(400, "invalid_query", `maxBytes must be an integer between ${PROBLEM_READ_MIN_BYTES} and ${PROBLEM_READ_MAX_BYTES}`);
  }
  return { section: section as ProblemReadSection | null, documentVersion, cursor: query.get("cursor"), maxBytes };
}

/** Find a valid UTF-8 boundary, never losing part of a code point. */
function boundary(buffer: Buffer, end: number): number {
  while (end > 0 && end < buffer.length && (buffer[end]! & 0xc0) === 0x80) end--;
  return end;
}

/** One instance per HTTP API owns an independent, process-local cursor signing key. */
export class ProblemReader {
  private readonly secret = randomBytes(32);
  private readonly documents = new Map<string, PreparedProblemDocument>();
  private cachedLedger: object | null = null;
  private cachedCatalogVersion: string | null = null;
  private retainedBytes = 0;

  prepare(detail: Record<string, unknown>): PreparedProblemDocument {
    const serialized = canonicalJson(detail);
    const sections = new Map<ProblemReadSection, Buffer>();
    const projected = sectionContents(JSON.parse(serialized) as ObjectJson);
    for (const section of PROBLEM_READ_SECTIONS) sections.set(section, Buffer.from(JSON.stringify(projected[section]), "utf8"));
    // Only the UTF-8 section buffers and small handles/maps remain retained, not
    // the complete canonical string or parsed detail. JSON also preserves lone
    // surrogates through escapes before any UTF-8 encoding takes place.
    const prepared = Object.freeze({ documentVersion: createHash("sha256").update(serialized).digest("hex"),
      retainedBytes: [...sections.values()].reduce((sum, buffer) => sum + buffer.length + 256, 256),
    });
    preparedStates.set(prepared, { sections });
    return prepared;
  }

  /** Cache only under a caller-supplied, reliable whole-ledger and index-version epoch. */
  readCurrent(problemId: string, epoch: { ledger: object; catalogVersion: string }, detail: () => Record<string, unknown>, query = new URLSearchParams()) {
    return this.readPrepared(problemId, () => {
      if (this.cachedLedger !== epoch.ledger || this.cachedCatalogVersion !== epoch.catalogVersion) {
        this.documents.clear(); this.retainedBytes = 0;
        this.cachedLedger = epoch.ledger; this.cachedCatalogVersion = epoch.catalogVersion;
      }
      const cached = this.documents.get(problemId);
      if (cached) {
        this.documents.delete(problemId); this.documents.set(problemId, cached);
        return cached;
      }
      const prepared = this.prepare(detail());
      // Oversized documents remain readable without retaining an unbounded cache entry.
      if (prepared.retainedBytes <= PROBLEM_READ_CACHE_BYTES) {
        while (this.documents.size >= PROBLEM_READ_CACHE_DOCUMENTS || this.retainedBytes + prepared.retainedBytes > PROBLEM_READ_CACHE_BYTES) {
          const oldest = this.documents.keys().next().value!;
          this.retainedBytes -= this.documents.get(oldest)!.retainedBytes;
          this.documents.delete(oldest);
        }
        this.documents.set(problemId, prepared); this.retainedBytes += prepared.retainedBytes;
      }
      return prepared;
    }, query);
  }

  private sign(cursor: Cursor): string {
    const payload = Buffer.from(JSON.stringify(cursor)).toString("base64url");
    return `${payload}.${createHmac("sha256", this.secret).update(payload).digest("base64url")}`;
  }

  private verify(encoded: string): Cursor {
    const invalid = () => new ProblemReadError(400, "invalid_cursor", "Invalid problem-read cursor; start a fresh read");
    if (encoded.length > 4096 || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u.test(encoded)) throw invalid();
    const [payload, signature] = encoded.split(".") as [string, string];
    const expected = createHmac("sha256", this.secret).update(payload).digest();
    const supplied = Buffer.from(signature, "base64url");
    if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected) || supplied.toString("base64url") !== signature) throw invalid();
    let cursor: Cursor;
    try { cursor = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Cursor; } catch { throw invalid(); }
    if (!cursor || cursor.v !== PROBLEM_READ_VERSION || typeof cursor.p !== "string" || typeof cursor.d !== "string" || !versionIsValid(cursor.d)
      || typeof cursor.s !== "string" || !sectionIsValid(cursor.s) || !Number.isSafeInteger(cursor.o) || cursor.o <= 0 || !Number.isSafeInteger(cursor.e)) throw invalid();
    if (Date.now() >= cursor.e) throw new ProblemReadError(400, "cursor_expired", "The problem-read cursor expired; start a fresh read");
    return cursor;
  }

  read(problemId: string, detail: Record<string, unknown>, query = new URLSearchParams()) {
    // Mutable details are never implicitly cached by object identity.
    return this.readPrepared(problemId, () => this.prepare(detail), query);
  }

  readPrepared(problemId: string, snapshot: PreparedProblemDocument | (() => PreparedProblemDocument), query = new URLSearchParams()) {
    const options = queryOptions(query);
    const cursor = options.cursor === null ? null : this.verify(options.cursor);
    if (cursor && (cursor.p !== problemId || options.section !== null && options.section !== cursor.s)) {
      throw new ProblemReadError(400, "cursor_scope_mismatch", "The cursor belongs to another problem or section");
    }
    const prepared = typeof snapshot === "function" ? snapshot() : snapshot;
    const state = preparedStates.get(prepared);
    if (!state) throw new ProblemReadError(500, "invalid_prepared_document", "The prepared document must originate from this reader implementation");
    const { documentVersion } = prepared;
    if (cursor && cursor.d !== documentVersion || options.documentVersion !== null && options.documentVersion !== documentVersion) {
      throw new ProblemReadError(409, "document_changed", "The complete research document changed; start a fresh section read before combining continuations");
    }
    const section = options.section ?? cursor?.s ?? "statement";
    const buffer = state.sections.get(section)!;
    const expiresAt = cursor?.e ?? Date.now() + PROBLEM_READ_CURSOR_TTL_MS;
    const offset = cursor?.o ?? 0;
    if (cursor && (offset >= buffer.length || boundary(buffer, offset) !== offset)) {
      throw new ProblemReadError(400, "invalid_cursor", "The cursor contains an invalid continuation position");
    }
    const base = { schemaVersion: PROBLEM_READ_VERSION as typeof PROBLEM_READ_VERSION, problemId, documentVersion, section,
      maxBytes: options.maxBytes, responseBytes: 0, budgetSemantics: PROBLEM_READ_BUDGET_SEMANTICS };
    const reply = (body: ProblemReadPage) => ({ status: 200, body, noStore: true, compactJson: true });
    // Never parse/stringify a huge section merely to discover it cannot fit.
    // A continuation always stays in text mode, even if its remainder becomes short.
    if (!cursor && buffer.length <= options.maxBytes) {
      const complete: ProblemReadPage = measured({ ...base, format: "json", content: JSON.parse(buffer.toString("utf8")) as ObjectJson,
        text: null, continued: false, complete: true, nextCursor: null });
      if (complete.responseBytes <= options.maxBytes) return reply(complete);
    }
    const compose = (end: number): ProblemReadPage => measured({ ...base, format: "json-continuation", content: null,
      text: buffer.subarray(offset, end).toString("utf8"), continued: cursor !== null, complete: end === buffer.length,
      nextCursor: end < buffer.length ? this.sign({ v: PROBLEM_READ_VERSION, p: problemId, d: documentVersion, s: section, o: end, e: expiresAt }) : null,
    });
    // Removing the final cursor makes the complete remainder cheaper; try it
    // separately before the monotone search over non-final candidates.
    if (buffer.length - offset <= options.maxBytes) {
      const final = compose(buffer.length);
      if (final.responseBytes <= options.maxBytes) return reply(final);
    }
    let low = offset + 1;
    let high = Math.min(buffer.length - 1, offset + options.maxBytes);
    let end = offset;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const candidate = boundary(buffer, middle);
      if (compose(candidate).responseBytes <= options.maxBytes) {
        end = candidate; low = middle + 1;
      } else high = middle - 1;
    }
    if (end === offset) throw new ProblemReadError(500, "reader_envelope_too_large", "The response envelope does not fit the requested budget");
    return reply(compose(end));
  }
}
