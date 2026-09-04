/**
 * Digest rules from DESIGN.md section 3.7.
 * Statement: SHA-256 over the body after NFC normalization, `\n` line endings,
 * trailing whitespace removed from every line, and exactly one trailing newline.
 * Artifact: SHA-256 over the raw bytes.
 */
import { createHash } from "node:crypto";

export function normalizeStatementBody(body: string): string {
  const unified = body.normalize("NFC").replace(/\r\n?/g, "\n");
  const lines = unified.split("\n").map((line) => line.replace(/[ \t]+$/u, ""));
  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

export function statementDigest(body: string): string {
  return `sha256:${createHash("sha256").update(normalizeStatementBody(body), "utf8").digest("hex")}`;
}

export function bytesDigest(bytes: Uint8Array): string {
  return `sha256:${createHash("sha256").update(bytes).digest("hex")}`;
}
