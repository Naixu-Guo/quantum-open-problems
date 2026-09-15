/** Shared results preserve the service body and add structured errors and resource links. */
import type { CallToolResult, ResourceLink } from "@modelcontextprotocol/server";
import type { Json } from "./adapter.ts";

interface ServiceResult {
  status: number;
  body: unknown;
  headers?: { retryAfter?: string; requestId?: string; idempotentReplay?: boolean };
}
const object = (value: unknown): Json | undefined => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Json : undefined;
const string = (value: unknown): string | undefined => typeof value === "string" && value.length > 0 ? value : undefined;
function retryAfterMs(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds * 1000);
  const date = Date.parse(value);
  return Number.isFinite(date) ? Math.max(0, date - Date.now()) : undefined;
}
function httpCode(status: number): string {
  if (status === 400 || status === 422) return "INVALID_ARGUMENT";
  if (status === 401) return "AUTHENTICATION_REQUIRED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 429) return "RATE_LIMITED";
  return status >= 500 ? "SERVICE_UNAVAILABLE" : "SERVICE_ERROR";
}
/** Only emit links to resources this adapter can actually read. */
function resourceLinks(name: string, args: Json, body: Json): ResourceLink[] {
  const links = new Map<string, ResourceLink>();
  const add = (uri: string, title: string) => {
    if (!/^qop:\/\/(?:status|policy|problems\/[^/?#]+(?:\/(?:frontier|tree))?|(?:records|contributions)\/[0-9A-HJKMNP-TV-Z]{26})$/u.test(uri)) return;
    links.set(uri, { type: "resource_link", uri, name: title, mimeType: "application/json" });
  };
  const record = (id: unknown, title = "Record") => { if (string(id)) add(`qop://records/${encodeURIComponent(String(id))}`, title); };
  const problemId = string(body["problemId"]) ?? string(body["id"]) ?? string(args["id"]);
  if (name === "sample_problem") {
    const sampled = object(body["problem"]);
    if (sampled) return resourceLinks("get_problem", {}, sampled);
  }
  if (name === "get_status") add("qop://status", "Catalog status");
  if (name === "get_policy") add("qop://policy", "Research policy");
  if (["get_problem", "get_frontier", "get_tree", "list_references", "build_context"].includes(name) && problemId) {
    const suffix = name === "get_frontier" ? "/frontier" : name === "get_tree" ? "/tree" : "";
    add(`qop://problems/${encodeURIComponent(problemId)}${suffix}`, string(body["title"]) ?? "Problem");
  }
  if (name === "get_problem" || name === "get_frontier") {
    record(object(body["statement"])?.["id"], "Current statement");
    if (Array.isArray(body["acceptedClaims"])) for (const item of body["acceptedClaims"]) {
      const claim = object(item);
      if (!claim) continue;
      record(claim["id"], string(claim["title"]) ?? "Accepted claim");
      if (Array.isArray(claim["support"])) for (const item of claim["support"]) {
        const support = object(item);
        if (!support) continue;
        record(support["sourceId"], string(object(support["source"])?.["title"]) ?? "Supporting source");
        record(support["artifactId"], "Supporting artifact");
      }
    }
  }
  if (name === "get_record") record(body["id"] ?? args["id"], string(body["title"]) ?? "Record");
  if (name === "get_contribution_status" && string(body["id"])) add(`qop://contributions/${encodeURIComponent(String(body["id"]))}`, string(body["title"]) ?? "Contribution");
  if (name === "search_problems" && Array.isArray(body["problems"])) for (const item of body["problems"]) {
    const row = object(item);
    if (row && string(row["id"])) add(`qop://problems/${encodeURIComponent(String(row["id"]))}`, string(row["title"]) ?? "Problem");
  }
  if (name === "search_sources" && Array.isArray(body["sources"])) for (const item of body["sources"]) {
    const row = object(item); if (row) record(row["id"], string(row["title"]) ?? "Source");
  }
  if (Array.isArray(body["references"])) for (const item of body["references"]) {
    const row = object(item);
    if (!row) continue;
    record(row["id"], "Reference");
    const source = object(row["source"]);
    record(source?.["id"] ?? row["sourceId"], string(source?.["title"]) ?? "Source");
  }
  if (name === "build_context" && Array.isArray(body["resources"])) for (const item of body["resources"]) {
    const row = object(item);
    if (row && string(row["uri"])) add(String(row["uri"]), string(row["name"]) ?? "Context source");
  }
  return [...links.values()];
}

export function toolResult(name: string, args: Json, result: ServiceResult, readOnly = true): CallToolResult {
  const body = object(result.body) ?? { data: result.body };
  const delay = retryAfterMs(result.headers?.retryAfter);
  const meta: Json = { "qop/httpStatus": result.status,
    ...(result.headers?.requestId ? { "qop/requestId": result.headers.requestId } : {}),
    ...(result.headers?.idempotentReplay !== undefined ? { "qop/idempotentReplay": result.headers.idempotentReplay } : {}),
    ...(delay !== undefined ? { "qop/retryAfterMs": delay } : {}) };
  if (result.status >= 400) {
    const detail = object(body["error"]);
    const message = string(body["error"]) ?? string(detail?.["message"]) ?? string(result.body) ?? `Service request failed (${result.status})`;
    const error = { ...body, error: body["error"] ?? message,
      code: string(body["code"]) ?? string(detail?.["code"]) ?? httpCode(result.status),
      httpStatus: result.status, retryable: (result.status === 429 || result.status >= 500) && (readOnly || Boolean(args["idempotencyKey"])),
      ...(!readOnly && result.status >= 500 ? { outcomeUnknown: true } : {}),
      ...(delay !== undefined ? { retryAfterMs: delay } : {}),
      ...(result.headers?.requestId ? { requestId: result.headers.requestId } : {}) };
    return { content: [{ type: "text", text: JSON.stringify(error) }], structuredContent: error, isError: true, _meta: meta };
  }
  const links = resourceLinks(name, args, body);
  // Rows remain complete; only optional navigation hints are bounded separately.
  if (links.length > 20) meta["qop/resourceLinksOmitted"] = links.length - 20;
  return { content: [{ type: "text", text: typeof result.body === "string" ? result.body : JSON.stringify(result.body) }, ...links.slice(0, 20)], structuredContent: body, isError: false, _meta: meta };
}

export function toolFailure(error: unknown): CallToolResult {
  const fault = object(error) ?? {};
  const details = object(fault["details"]) ?? fault;
  const body: Json = { error: error instanceof Error ? error.message : String(error),
    code: string(fault["code"]) ?? (error instanceof Error && error.name === "AbortError" ? "REQUEST_CANCELLED" : "TOOL_ERROR"),
    retryable: details["retryable"] === true,
    ...(typeof details["httpStatus"] === "number" ? { httpStatus: details["httpStatus"] } : {}),
    ...(typeof details["outcomeUnknown"] === "boolean" ? { outcomeUnknown: details["outcomeUnknown"] } : {}),
    ...(string(details["requestId"]) ? { requestId: details["requestId"] } : {}) };
  return { content: [{ type: "text", text: JSON.stringify(body) }], structuredContent: body, isError: true };
}
