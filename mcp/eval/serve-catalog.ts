/** Read-only local evaluation endpoint; no API keys and only in-memory service stores. */
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createService } from "../../service/src/service.ts";
import { createServer } from "../../service/src/api.ts";
import { createHttpMcpServer } from "../src/http.ts";

const root = fileURLToPath(new URL("../../", import.meta.url));
const service = createService({ ledgerDir: path.join(root, "ledger"), activityDir: path.join(root, "activity"),
  contractDir: path.join(root, "contract"), dbPath: ":memory:", authDbPath: ":memory:", port: 0, commit: false,
  submissions: { dbPath: ":memory:" }, web: { webDir: null }, git: { remote: null, pollIntervalMs: 0 } });
const listen = async (server: http.Server) => {
  await new Promise<void>((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing local listen address");
  return `http://127.0.0.1:${address.port}`;
};
const api = createServer(service);
const origin = await listen(api);
const mcp = createHttpMcpServer({ serviceUrl: origin });
const endpoint = `${await listen(mcp)}/mcp`;
const page = service.index.problemPage({ limit: 1 });
process.stdout.write(JSON.stringify({ endpoint, api: origin, catalogVersion: page.catalogVersion, count: page.total,
  baseCommit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  implementation: "working-tree", stores: "in-memory", protocol: "real MCP HTTP to real API HTTP" }) + "\n");
let closing = false;
const close = async () => {
  if (closing) return;
  closing = true;
  for (const server of [mcp, api]) {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
  service.index.close(); service.auth.close(); service.submissions.close();
};
process.on("SIGINT", () => { void close(); });
process.on("SIGTERM", () => { void close(); });
