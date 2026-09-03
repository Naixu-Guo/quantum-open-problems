/** ULIDs: 48-bit millisecond time plus 80 random bits, Crockford base32. */
import { randomBytes } from "node:crypto";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newId(now: number = Date.now()): string {
  const random = randomBytes(10);
  let value = BigInt(now) << 80n;
  for (const byte of random) value = (value << 8n) | BigInt(byte);
  let text = "";
  for (let i = 0; i < 26; i += 1) {
    text = CROCKFORD[Number(value & 31n)] + text;
    value >>= 5n;
  }
  return text;
}

export const nowIso = (): string => new Date().toISOString().replace(/\.\d{3}Z$/u, "Z");
