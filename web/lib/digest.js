/**
 * The statement digest as the contract defines it (DESIGN.md section 3.7): SHA-256 over the
 * body after NFC normalization, `\n` line endings, trailing whitespace stripped from each line,
 * and exactly one trailing newline. Must match contract/src/digest.ts byte for byte.
 *
 * WebCrypto exists only in secure contexts (https, or localhost); elsewhere `statementDigest`
 * returns null and the service computes the digest from the body it receives.
 */
export function normalizeStatementBody(body) {
  const unified = String(body).normalize("NFC").replace(/\r\n?/g, "\n");
  const lines = unified.split("\n").map((line) => line.replace(/[ \t]+$/u, ""));
  return `${lines.join("\n").replace(/\n+$/u, "")}\n`;
}

export async function statementDigest(body) {
  if (!globalThis.crypto?.subtle) return null;
  const bytes = new TextEncoder().encode(normalizeStatementBody(body));
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  const hex = [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `sha256:${hex}`;
}
