/** ULIDs: 48-bit millisecond time plus 80 random bits, Crockford base32, 26 characters. */
import { randomBytes } from "node:crypto";

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function newId(now: number = Date.now()): string {
  let value = BigInt(now);
  for (const byte of randomBytes(10)) value = (value << 8n) | BigInt(byte);
  let text = "";
  for (let i = 0; i < 26; i += 1) {
    text = CROCKFORD[Number(value & 31n)] + text;
    value >>= 5n;
  }
  return text;
}

/** UTC timestamp with millisecond precision, so decisions made in the same second still order. */
export const nowIso = (): string => new Date().toISOString();
