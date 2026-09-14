/** Local SDK stdio entry point; credentials enable research tools. */
import { serveStdio, StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { createAdapter } from "./adapter.ts";
import { createMcpServer } from "./shared-server.ts";
import { StdioRequestIdTransport } from "./stdio-transport.ts";

const apiKey = process.env["QOP_API_KEY"]?.trim() || null;
const adapter = createAdapter(process.env["QOP_SERVICE_URL"] ?? "http://localhost:8787", apiKey, apiKey === null);
const handle = serveStdio(() => createMcpServer(adapter), {
  transport: new StdioRequestIdTransport(new StdioServerTransport()),
  maxSubscriptions: 0,
  onerror: error => process.stderr.write(`MCP: ${error.message}\n`),
});
const close = () => { void handle.close(); };
process.stdin.once("end", close);
process.once("SIGTERM", close);
process.once("SIGINT", close);
