/** Hosted read-only MCP process; nginx publishes /mcp over HTTPS. */
import { createHttpMcpServer } from "./http.ts";

const port = Number(process.env["QOP_MCP_PORT"] ?? 8788);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("QOP_MCP_PORT must be a TCP port");
const names = (name: string, defaults: string) => (process.env[name] ?? defaults).split(",").map(value => value.trim()).filter(Boolean);
const server = createHttpMcpServer({
  serviceUrl: process.env["QOP_SERVICE_URL"] ?? "http://127.0.0.1:8787",
  allowedHosts: names("QOP_MCP_ALLOWED_HOSTS", "localhost,127.0.0.1,[::1]"),
  allowedOrigins: names("QOP_MCP_ALLOWED_ORIGINS", "localhost,127.0.0.1,[::1]"),
  trustProxy: process.env["QOP_MCP_TRUST_PROXY"] === "true",
});
server.listen(port, "127.0.0.1", () => process.stderr.write(`MCP listening on http://127.0.0.1:${port}/mcp\n`));
const stop = () => {
  server.close(() => process.exit(0));
  setTimeout(() => { server.closeAllConnections(); process.exit(0); }, 5000).unref();
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
