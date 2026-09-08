/** Local stdio entry point, including authenticated research tools. */
import { createInterface } from "node:readline";
import { createAdapter, SERVER_INFO, type Json } from "./adapter.ts";

const { tools: TOOLS, readResource, resources: RESOURCES, resourceTemplates: RESOURCE_TEMPLATES } = createAdapter(
  process.env["QOP_SERVICE_URL"] ?? "http://localhost:8787", process.env["QOP_API_KEY"] ?? null
);

// ---------------------------------------------------------------------------
// JSON-RPC over stdio
// ---------------------------------------------------------------------------

const send = (message: Json) => process.stdout.write(`${JSON.stringify(message)}\n`);
const respond = (id: unknown, result: unknown) => send({ jsonrpc: "2.0", id, result });
const fail = (id: unknown, code: number, message: string) => send({ jsonrpc: "2.0", id, error: { code, message } });

async function handle(message: unknown): Promise<void> {
  if (message === null || typeof message !== "object" || Array.isArray(message)) {
    fail(null, -32600, "a JSON-RPC message must be an object");
    return;
  }
  const { id, method, params } = message as { id?: unknown; method?: string; params?: Json };
  const isRequest = id !== undefined && id !== null;
  try {
    switch (method) {
      case "initialize":
        respond(id, { protocolVersion: (params?.["protocolVersion"] as string | undefined) ?? "2024-11-05", capabilities: { tools: {}, resources: {} }, serverInfo: SERVER_INFO, instructions: "Read get_status and get_policy first. Use build_context to start on a problem, start_trajectory to record your run, and end_trajectory to submit an attempt report. Every fact you cite carries a record id." });
        return;
      case "notifications/initialized":
      case "notifications/cancelled":
        return;
      case "ping":
        if (isRequest) respond(id, {});
        return;
      case "tools/list":
        respond(id, { tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })) });
        return;
      case "tools/call": {
        const name = String(params?.["name"] ?? "");
        const tool = TOOLS.find((candidate) => candidate.name === name);
        if (!tool) { fail(id, -32602, `unknown tool ${name}`); return; }
        // A tool failure (bad argument, service down, HTTP error) is a tool result the model can read, not a protocol error.
        try {
          const result = await tool.call((params?.["arguments"] as Json | undefined) ?? {});
          respond(id, { content: [{ type: "text", text: typeof result.body === "string" ? result.body : JSON.stringify(result.body, null, 1) }], isError: result.status >= 400 });
        } catch (error) {
          respond(id, { content: [{ type: "text", text: JSON.stringify({ error: error instanceof Error ? error.message : String(error) }, null, 1) }], isError: true });
        }
        return;
      }
      case "resources/list":
        respond(id, { resources: RESOURCES });
        return;
      case "resources/templates/list":
        respond(id, { resourceTemplates: RESOURCE_TEMPLATES });
        return;
      case "resources/read": {
        const uri = String(params?.["uri"] ?? "");
        const result = await readResource(uri);
        if (result.status >= 400) { fail(id, -32002, `${uri}: ${JSON.stringify(result.body)}`); return; }
        respond(id, { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(result.body, null, 1) }] });
        return;
      }
      case "prompts/list":
        respond(id, { prompts: [] });
        return;
      default:
        if (isRequest) fail(id, -32601, `unknown method ${String(method)}`);
    }
  } catch (error) {
    if (isRequest) fail(id, -32000, error instanceof Error ? error.message : String(error));
  }
}

// Requests are handled concurrently: a slow service call never blocks a ping or another tool.
// On stdin close the process waits briefly for in-flight requests, then exits.
const inFlight = new Set<Promise<void>>();
const lines = createInterface({ input: process.stdin, crlfDelay: Infinity });
lines.on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let message: unknown;
  try {
    message = JSON.parse(text);
  } catch {
    fail(null, -32700, "parse error");
    return;
  }
  const task = handle(message).catch((error: unknown) => { process.stderr.write(`unhandled: ${error instanceof Error ? error.message : String(error)}\n`); });
  inFlight.add(task);
  void task.finally(() => inFlight.delete(task));
});
lines.on("close", () => {
  const drain = Promise.allSettled([...inFlight]);
  const deadline = new Promise<void>((resolve) => setTimeout(resolve, 2000).unref());
  void Promise.race([drain, deadline]).then(() => process.exit(0));
});
