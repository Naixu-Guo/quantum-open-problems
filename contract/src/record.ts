/**
 * Record file format: a YAML header between `---` lines, then a Markdown body.
 * The header carries every typed field except `body`; the body is the record's `body`.
 */
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export interface ParsedRecord {
  path: string;
  fields: Record<string, unknown>;
  body: string;
}

const HEADER_OPEN = "---\n";
const HEADER_CLOSE = "\n---\n";

export function parseRecordText(path: string, text: string): ParsedRecord {
  if (!text.startsWith(HEADER_OPEN)) {
    throw new Error(`${path}: record must start with a YAML header`);
  }
  const closeAt = text.indexOf(HEADER_CLOSE, HEADER_OPEN.length - 1);
  if (closeAt < 0) {
    throw new Error(`${path}: YAML header is not terminated by a line containing only ---`);
  }
  const header = text.slice(HEADER_OPEN.length, closeAt);
  const raw = text.slice(closeAt + HEADER_CLOSE.length);
  const parsed: unknown = parseYaml(header);
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`${path}: YAML header must be a mapping`);
  }
  const fields = parsed as Record<string, unknown>;
  if ("body" in fields) {
    throw new Error(`${path}: body belongs below the header, not in it`);
  }
  return { path, fields, body: raw.replace(/\n$/, "") };
}

export function serializeRecord(fields: Record<string, unknown>, body: string): string {
  const header = stringifyYaml(fields, { lineWidth: 0 }).replace(/\n$/, "");
  return `${HEADER_OPEN}${header}${HEADER_CLOSE}${body}\n`;
}

/** The object a schema validates: header fields plus the body. */
export function recordObject(record: ParsedRecord): Record<string, unknown> {
  return { ...record.fields, body: record.body };
}
