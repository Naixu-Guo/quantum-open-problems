// Authentication, rate limiting, and idempotency helpers.

import { sha256 } from "../core/domain.mjs";

const BEARER = /^Bearer\s+(qop_[a-f0-9]{48})$/i;

// Resolves the actor for a request. Returns { actor } for a valid key,
// { actor: null } for no credentials, or { invalid: true } for a bad key.
export const authenticate = (store, request) => {
  const header = request.headers.authorization;
  if (!header) return { actor: null };
  const match = String(header).match(BEARER);
  if (!match) return { invalid: true };
  const actor = store.actorForApiKey(match[1]);
  if (!actor) return { invalid: true };
  return { actor };
};

// Fixed-window counters; enough for a single-node service and simple to test.
export const createRateLimiter = ({ limit, windowMs, now = () => Date.now() }) => {
  const buckets = new Map();
  return {
    take: (key) => {
      const current = now();
      let bucket = buckets.get(key);
      if (!bucket || bucket.resetAt <= current) {
        bucket = { count: 0, resetAt: current + windowMs };
        buckets.set(key, bucket);
      }
      if (bucket.count >= limit) {
        return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - current) / 1000)) };
      }
      bucket.count += 1;
      return { ok: true, remaining: limit - bucket.count };
    },
    reset: () => buckets.clear()
  };
};

export const requestHash = (method, pathname, body) => sha256(`${method} ${pathname}\n${body}`);

export const clientAddress = (request) => {
  const forwarded = request.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return request.socket?.remoteAddress || "unknown";
};
