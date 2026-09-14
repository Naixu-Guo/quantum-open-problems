/** Public MCP transport: modern requests are stateless; legacy cancellation uses bounded SDK sessions. */
import http from "node:http";
import { isIP } from "node:net";
import { randomUUID } from "node:crypto";
import { createMcpHandler, isInitializeRequest, isLegacyRequest, legacyStatelessFallback, WebStandardStreamableHTTPServerTransport, type McpHandlerRequestOptions, type RequestId } from "@modelcontextprotocol/server";
import { hostHeaderValidation, originValidation, toNodeHandler } from "@modelcontextprotocol/node";
import { createAdapter } from "./adapter.ts";
import { createMcpServer } from "./shared-server.ts";

export interface HttpMcpOptions {
  serviceUrl: string;
  allowedHosts?: string[];
  allowedOrigins?: string[];
  /** Enable only behind a proxy that replaces X-Forwarded-For. */
  trustProxy?: boolean;
  requestsPerMinute?: number;
  maxBodyBytes?: number;
  maxLegacySessions?: number;
  legacySessionIdleTimeoutMs?: number;
}

class RequestError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}

function bodyOf(request: http.IncomingMessage, limit: number): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let finished = false;
    const fail = (error: Error) => {
      if (finished) return;
      finished = true;
      request.pause();
      reject(error);
    };
    request.on("error", fail);
    request.on("aborted", () => fail(new RequestError(400, "Request aborted")));
    request.setTimeout(15_000, () => fail(new RequestError(408, "Request body timed out")));
    request.on("data", (chunk: Buffer) => {
      if (finished) return;
      size += chunk.length;
      if (size > limit) { fail(new RequestError(413, "MCP request body is too large")); return; }
      chunks.push(chunk);
    });
    request.on("end", () => {
      request.setTimeout(0);
      if (finished) return;
      finished = true;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch { reject(new RequestError(400, "Invalid JSON")); }
    });
  });
}

export function createHttpMcpServer(options: HttpMcpOptions): http.Server {
  // Public HTTP never receives an operator's API key or forwards caller credentials.
  const adapter = createAdapter(options.serviceUrl, null, true);
  const factory = () => createMcpServer(adapter);
  const handler = createMcpHandler(factory, { legacy: "reject", maxSubscriptions: 0 });
  const sessionLimit = options.maxLegacySessions ?? 256;
  const sessionIdleMs = options.legacySessionIdleTimeoutMs ?? 15 * 60_000;
  if (!Number.isSafeInteger(sessionLimit) || sessionLimit < 1) throw new Error("maxLegacySessions must be a positive integer");
  if (!Number.isSafeInteger(sessionIdleMs) || sessionIdleMs < 1) throw new Error("legacySessionIdleTimeoutMs must be a positive integer");
  type PendingRequest = { id: RequestId; internalId: string; method: string; cancellation?: Promise<void> };
  type Session = {
    instance: ReturnType<typeof factory>;
    transport: WebStandardStreamableHTTPServerTransport;
    wireSend: WebStandardStreamableHTTPServerTransport["send"];
    lastUsed: number;
    internalPrefix: string;
    pending: Map<RequestId, PendingRequest>;
    internalRequests: Map<RequestId, PendingRequest>;
  };
  const sessions = new Map<string, Session>();
  let closing = false;
  const cancelRequest = (session: Session, pending: PendingRequest, reason: string): Promise<void> => {
    if (session.pending.get(pending.id) !== pending || session.internalRequests.get(pending.internalId) !== pending) return Promise.resolve();
    if (pending.cancellation) return pending.cancellation;
    pending.cancellation = (async () => {
      session.transport.onmessage?.({ jsonrpc: "2.0", method: "notifications/cancelled", params: { requestId: pending.id, reason } });
      // Protocol dispatches notifications in a microtask. Abort the tool before settling its HTTP response.
      await Promise.resolve();
      if (session.internalRequests.get(pending.internalId) !== pending) return;
      session.internalRequests.delete(pending.internalId);
      try {
        // SDK 2.0 suppresses canceled handler results but leaves JSON response promises pending.
        // A terminal transport error releases those responses and SDK request mappings through its public API.
        await session.wireSend({ jsonrpc: "2.0", id: pending.id, error: { code: -32800, message: reason } });
      } catch (error) {
        // A normal result can win the race and already release this request's transport state.
        if (!(error instanceof Error) || !error.message.startsWith("No connection established for request ID:")) throw error;
      }
    })();
    return pending.cancellation;
  };
  const closeSession = async (id: string) => {
    const session = sessions.get(id);
    if (!session) return;
    sessions.delete(id);
    await Promise.allSettled([...session.pending.values()].map(pending => cancelRequest(session, pending, "MCP session closed")));
    await session.instance.close();
  };
  const expireSessions = () => {
    const now = Date.now();
    return Promise.allSettled([...sessions].filter(([, session]) => session.lastUsed + sessionIdleMs <= now).map(([id]) => closeSession(id)));
  };
  const expiry = setInterval(() => { void expireSessions(); }, Math.min(sessionIdleMs, 60_000)).unref();
  const protocolError = (status: number, message: string, headers?: HeadersInit) => Response.json({ jsonrpc: "2.0", id: null, error: { code: -32000, message } }, { status, ...(headers ? { headers } : {}) });
  const dispatchLegacy = async (session: Session, request: Request, requestOptions?: McpHandlerRequestOptions): Promise<Response> => {
    const body = requestOptions?.parsedBody;
    const messages = (Array.isArray(body) ? body : [body]).filter((message): message is Record<string, unknown> => !!message && typeof message === "object");
    const requests = messages.filter(message => typeof message.method === "string" && (typeof message.id === "string" || typeof message.id === "number"));
    const ids = requests.map(message => message.id as RequestId);
    if (new Set(ids).size !== ids.length || ids.some(id => session.pending.has(id))) return protocolError(409, "Request ID is already active in this MCP session");
    if (session.pending.size + ids.length > 128) return protocolError(429, "Too many active requests in this MCP session", { "Retry-After": "1" });
    const pendingRequests = requests.map(message => ({ id: message.id as RequestId, internalId: `${session.internalPrefix}${randomUUID()}`, method: message.method as string }));
    for (const pending of pendingRequests) session.pending.set(pending.id, pending);
    const abort = () => { void Promise.allSettled(pendingRequests.map(pending => cancelRequest(session, pending, "HTTP client disconnected"))); };
    request.signal.addEventListener("abort", abort, { once: true });
    try {
      const responsePromise = session.transport.handleRequest(request, requestOptions);
      if (request.signal.aborted) abort();
      return await responsePromise;
    } finally {
      request.signal.removeEventListener("abort", abort);
      for (const pending of pendingRequests) {
        if (session.pending.get(pending.id) === pending) session.pending.delete(pending.id);
        session.internalRequests.delete(pending.internalId);
      }
    }
  };
  // A pre-initialization ping needs no retained state. All tool calls use an isolated session.
  const ping = legacyStatelessFallback(factory);
  const serveLegacy = async (request: Request, requestOptions?: McpHandlerRequestOptions): Promise<Response> => {
    if (request.method === "GET") return protocolError(405, "Subscriptions are not supported", { Allow: "POST, DELETE, OPTIONS" });
    await expireSessions();
    if (closing) return protocolError(503, "MCP server is shutting down");
    const id = request.headers.get("mcp-session-id");
    if (id) {
      const session = sessions.get(id);
      if (!session) return protocolError(404, "MCP session expired or unknown; initialize a new session");
      session.lastUsed = Date.now();
      return dispatchLegacy(session, request, requestOptions);
    }
    const body = requestOptions?.parsedBody;
    if (request.method === "POST" && body && typeof body === "object" && !Array.isArray(body) && (body as { method?: unknown }).method === "ping") return ping(request, requestOptions);
    if (request.method !== "POST" || !isInitializeRequest(body)) return protocolError(400, "Initialize first and include the returned Mcp-Session-Id");
    if (sessions.size >= sessionLimit) return protocolError(429, "Too many MCP sessions; close an unused session or retry later", { "Retry-After": String(Math.ceil(sessionIdleMs / 1000)) });
    const sessionId = randomUUID();
    const instance = factory();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: () => sessionId,
      enableJsonResponse: true,
      onsessionclosed: () => closeSession(sessionId),
    });
    // Reserve capacity before asynchronous initialization. Request IDs never cross this instance boundary.
    const session: Session = { instance, transport, wireSend: transport.send.bind(transport), lastUsed: Date.now(), internalPrefix: `${randomUUID()}:`, pending: new Map(), internalRequests: new Map() };
    sessions.set(sessionId, session);
    instance.server.onclose = () => { sessions.delete(sessionId); };
    try {
      await instance.connect(transport);
      const receive = transport.onmessage;
      // Keep wire IDs at the HTTP boundary. SDK 2.0 ignores cancellation IDs 0 and "",
      // so dispatch each request under a fresh truthy ID using only public transport APIs.
      const isInternalId = (id: RequestId | undefined) => typeof id === "string" && id.startsWith(session.internalPrefix);
      transport.send = async (message, sendOptions) => {
        const terminal = !("method" in message) && isInternalId(message.id);
        const pending = terminal ? session.internalRequests.get(message.id!) : undefined;
        const internalRelated = isInternalId(sendOptions?.relatedRequestId);
        const related = internalRelated ? session.internalRequests.get(sendOptions!.relatedRequestId!) : undefined;
        // Retired handlers must never deliver a late result to another wire operation.
        if ((terminal && !pending) || (internalRelated && !related)) return;
        if (pending) session.internalRequests.delete(pending.internalId);
        await session.wireSend(pending ? { ...message, id: pending.id } : message,
          related ? { ...sendOptions, relatedRequestId: related.id } : sendOptions);
      };
      transport.onmessage = (message, extra) => {
        if ("method" in message && "id" in message) {
          const pending = session.pending.get(message.id);
          if (!pending) return;
          session.internalRequests.set(pending.internalId, pending);
          receive?.({ ...message, id: pending.internalId }, extra);
          return;
        }
        // Observe SDK-validated messages before awaiting the HTTP response: a batch can
        // contain both the request and its cancellation, so that response is still pending.
        if (!("id" in message) && "method" in message && message.method === "notifications/cancelled") {
          const params = message.params;
          const id = params?.["requestId"];
          const pending = typeof id === "string" || typeof id === "number" ? session.pending.get(id) : undefined;
          if ((typeof id === "string" || typeof id === "number") &&
            (params?.["reason"] === undefined || typeof params["reason"] === "string") && pending && pending.method !== "initialize" &&
            session.internalRequests.get(pending.internalId) === pending) {
            receive?.({ ...message, params: { ...params, requestId: pending.internalId } }, extra);
            queueMicrotask(() => { void cancelRequest(session, pending, "Request cancelled").catch(error => transport.onerror?.(error instanceof Error ? error : new Error(String(error)))); });
          }
          return;
        }
        // Client responses to server requests have their own ID space and pass through.
        receive?.(message, extra);
      };
      const response = await dispatchLegacy(session, request, requestOptions);
      const initialized = response.status === 200 && transport.sessionId &&
        (await response.clone().json() as { result?: { protocolVersion?: string } }).result?.protocolVersion;
      if (!initialized) await closeSession(sessionId);
      return response;
    } catch (error) {
      await closeSession(sessionId);
      throw error;
    }
  };
  const serve = toNodeHandler({ fetch: async (request, requestOptions) => await isLegacyRequest(request, requestOptions?.parsedBody)
    ? serveLegacy(request, requestOptions) : handler.fetch(request, requestOptions) });
  const validateHost = hostHeaderValidation(options.allowedHosts ?? ["localhost", "127.0.0.1", "[::1]"]);
  const validateOrigin = originValidation(options.allowedOrigins ?? ["localhost", "127.0.0.1", "[::1]"]);
  const limit = options.maxBodyBytes ?? 64 * 1024;
  const requestLimit = options.requestsPerMinute ?? 240;
  const windows = new Map<string, { until: number; count: number }>();
  const activeResponses = new Set<http.ServerResponse>();

  const server = http.createServer(async (request, response) => {
    activeResponses.add(response);
    response.once("close", () => { activeResponses.delete(response); });
    response.once("finish", () => { activeResponses.delete(response); });
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const reject = (status: number, message: string) => {
      if (response.headersSent || response.destroyed) return;
      response.writeHead(status, { "Content-Type": "application/json", Connection: "close" });
      response.end(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: status === 400 ? -32700 : -32000, message } }));
      response.once("finish", () => request.destroy());
    };
    try {
      if (closing) { reject(503, "MCP server is shutting down"); return; }
      if (!validateHost(request, response) || !validateOrigin(request, response)) { request.resume(); return; }
      if (request.url?.split("?")[0] !== "/mcp") { reject(404, "Unknown endpoint"); return; }
      const mcpRequest = Object.assign(request, { method: request.method ?? "GET", url: request.url });
      if (request.headers.origin) {
        response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
        response.setHeader("Vary", "Origin");
        response.setHeader("Access-Control-Expose-Headers", "MCP-Session-Id, MCP-Protocol-Version");
      }
      if (request.method === "OPTIONS") {
        response.writeHead(204, {
          "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Accept, MCP-Protocol-Version, MCP-Session-Id, Last-Event-ID",
        });
        response.end(); return;
      }
      if (!["GET", "POST", "DELETE"].includes(request.method ?? "")) {
        response.setHeader("Allow", "GET, POST, DELETE, OPTIONS");
        reject(405, "Method not allowed"); return;
      }
      if (request.method !== "POST" && (request.headers["transfer-encoding"] || Number(request.headers["content-length"] ?? 0) > 0)) {
        reject(400, "MCP request bodies require POST"); return;
      }
      const forwarded = request.headers["x-forwarded-for"];
      const address = options.trustProxy && typeof forwarded === "string" && isIP(forwarded) ? forwarded : request.socket.remoteAddress ?? "unknown";
      const now = Date.now();
      let window = windows.get(address);
      if (!window || window.until <= now) {
        for (const [key, value] of windows) if (value.until <= now) windows.delete(key);
        if (windows.size >= 4096 && !windows.has(address)) { reject(429, "Too many active clients; retry in one minute"); return; }
        window = { until: now + 60_000, count: 0 };
        windows.set(address, window);
      }
      if (++window.count > requestLimit) {
        response.setHeader("Retry-After", String(Math.ceil((window.until - now) / 1000)));
        reject(429, "MCP request limit reached; retry shortly"); return;
      }
      if (request.method === "POST") {
        if (request.headers["content-type"]?.split(";")[0]?.trim().toLowerCase() !== "application/json") { reject(415, "Use Content-Type: application/json"); return; }
        if (Number(request.headers["content-length"] ?? 0) > limit) { reject(413, "MCP request body is too large"); return; }
        await serve(mcpRequest, response, await bodyOf(request, limit));
      } else {
        // The SDK handles protocol discovery and method negotiation, including legacy 405s.
        await serve(mcpRequest, response);
      }
    } catch (error) {
      reject(error instanceof RequestError ? error.status : 500, error instanceof RequestError ? error.message : "MCP request failed");
    }
  });
  server.headersTimeout = 10_000;
  server.requestTimeout = 30_000;
  let shutdown: Promise<unknown> | undefined;
  const drain = () => {
    closing = true;
    for (const response of activeResponses) response.shouldKeepAlive = false;
    clearInterval(expiry);
    return shutdown ??= Promise.allSettled([handler.close(), ...[...sessions.keys()].map(closeSession)]);
  };
  // The close event occurs only after active responses end, so drain before waiting for that event.
  const closeServer = server.close.bind(server);
  server.close = callback => { void drain(); return closeServer(callback); };
  server.on("close", () => { void drain(); });
  return server;
}
