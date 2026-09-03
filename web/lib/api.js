/**
 * The service API from the browser. Reads go through `get`; writes are batches of contract
 * records sent with the session cookie, an idempotency key, and our own origin. Errors carry
 * the service's status and message, and the validator's issues when a batch was refused.
 */
import { randomId } from "./dom.js";

export class ApiError extends Error {
  constructor(status, message, issues = []) {
    super(message);
    this.status = status;
    this.issues = issues;
  }
  /** One line per issue, for a form's error box. */
  get details() {
    return this.issues.map((issue) => `${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
  }
}

async function parse(response) {
  const text = await response.text();
  try { return text ? JSON.parse(text) : null; } catch { return { error: text }; }
}

function fail(response, body) {
  const message = body && typeof body.error === "string" ? body.error : `${response.status} ${response.statusText}`;
  const issues = body && Array.isArray(body.issues) ? body.issues : [];
  throw new ApiError(response.status, message, issues);
}

export async function get(path) {
  const response = await fetch(path, { credentials: "same-origin", cache: "no-cache", headers: { Accept: "application/json" } });
  const body = await parse(response);
  if (!response.ok) fail(response, body);
  return body;
}

export async function post(path, body) {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", Accept: "application/json", "Idempotency-Key": randomId() },
    body: JSON.stringify(body),
  });
  const reply = await parse(response);
  if (!response.ok) fail(response, reply);
  return reply;
}

/** Submit contract records without ids; `$ref:` names cross-reference records in the batch. */
export function submitBatch(records) {
  return post("/api/v1/batches", { records });
}

const memo = new Map();

/** Reads that rarely change during a visit: the taxonomy, the actor list, the policy. */
export async function cached(path) {
  if (!memo.has(path)) memo.set(path, get(path).catch((error) => { memo.delete(path); throw error; }));
  return memo.get(path);
}

export function forget(path) {
  if (path) memo.delete(path); else memo.clear();
}
