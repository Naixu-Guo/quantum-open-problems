/** Public, stateless MCP transport over the existing catalog API. */
import http from "node:http";
import { isIP } from "node:net";
import { createMcpHandler, McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { hostHeaderValidation, originValidation, toNodeHandler } from "@modelcontextprotocol/node";
import { fromJSONSchema } from "zod";
import { createAdapter, SERVER_INFO, type Json } from "./adapter.ts";

export interface HttpMcpOptions {
  serviceUrl: string;
  allowedHosts?: string[];
  allowedOrigins?: string[];
  /** Enable only behind a proxy that replaces X-Forwarded-For. */
  trustProxy?: boolean;
  requestsPerMinute?: number;
  maxBodyBytes?: number;
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
  const schemas = new Map(adapter.tools.map(tool => [tool.name, fromJSONSchema(tool.inputSchema)]));
  const handler = createMcpHandler(() => {
    const server = new McpServer(SERVER_INFO, {
      instructions: "Search the quantum open-problem catalog with search_problems. Read get_problem and list_references, and use build_context for a research bundle. This public endpoint offers read tools only; cite record IDs and source references.",
    });
    for (const tool of adapter.tools) {
      server.registerTool(tool.name, {
        description: tool.description,
        inputSchema: schemas.get(tool.name)!,
        annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
      }, async (args) => {
        try {
          const result = await tool.call(args as Json);
          return { content: [{ type: "text", text: typeof result.body === "string" ? result.body : JSON.stringify(result.body) }], isError: result.status >= 400 };
        } catch (error) {
          return { content: [{ type: "text", text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }) }], isError: true };
        }
      });
    }
    const read = async (uri: URL) => {
      const result = await adapter.readResource(uri.href);
      if (result.status >= 400) throw new Error(`Resource unavailable (${result.status}): ${uri.href}`);
      return { contents: [{ uri: uri.href, mimeType: "application/json", text: JSON.stringify(result.body) }] };
    };
    for (const resource of adapter.resources) server.registerResource(resource.name, resource.uri, resource, read);
    for (const template of adapter.resourceTemplates) {
      server.registerResource(template.name, new ResourceTemplate(template.uriTemplate, { list: undefined }), template, read);
    }
    return server;
  }, { legacy: "stateless", maxSubscriptions: 0 });
  const serve = toNodeHandler(handler);
  const validateHost = hostHeaderValidation(options.allowedHosts ?? ["localhost", "127.0.0.1", "[::1]"]);
  const validateOrigin = originValidation(options.allowedOrigins ?? ["localhost", "127.0.0.1", "[::1]"]);
  const limit = options.maxBodyBytes ?? 64 * 1024;
  const requestLimit = options.requestsPerMinute ?? 240;
  const windows = new Map<string, { until: number; count: number }>();

  const server = http.createServer(async (request, response) => {
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-Content-Type-Options", "nosniff");
    const reject = (status: number, message: string) => {
      if (response.headersSent || response.destroyed) return;
      response.writeHead(status, { "Content-Type": "application/json", Connection: "close" });
      response.end(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: status === 400 ? -32700 : -32000, message } }));
      response.once("finish", () => request.destroy());
    };
    try {
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
  server.on("close", () => { void handler.close(); });
  return server;
}
