/** Read-only deployment preflight; activate the MCP release only after this passes. */
import { pathToFileURL } from "node:url";
import { AdapterError, CONTEXT_UPGRADE_MESSAGE, IDEMPOTENCY_UPGRADE_MESSAGE, REQUIRED_CONTEXT_SCHEMA_VERSION, REQUIRED_IDEMPOTENCY_VERSION, REQUIRED_RETRIEVAL_VERSION, RETRIEVAL_UPGRADE_MESSAGE, REQUIRED_RESEARCH_SEARCH_VERSION, RESEARCH_SEARCH_UPGRADE_MESSAGE, REQUIRED_PROBLEM_READ_VERSION, PROBLEM_READ_UPGRADE_MESSAGE, createAdapter, type Json } from "./adapter.ts";

export async function checkService(serviceUrl: string) {
  const adapter = createAdapter(serviceUrl, null, true);
  const result = await adapter.tools.find(tool => tool.name === "get_status")!.call({});
  if (result.status >= 400) {
    throw new AdapterError("SERVICE_PREFLIGHT_FAILED", `API status returned HTTP ${result.status}. Verify QOP_SERVICE_URL and the running API service before activating MCP.`, { httpStatus: result.status, retryable: false });
  }
  const status = result.body !== null && typeof result.body === "object" ? result.body as Json : {};
  if (status["contextSchemaVersion"] !== REQUIRED_CONTEXT_SCHEMA_VERSION) {
    throw new AdapterError("INCOMPATIBLE_SERVICE", CONTEXT_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
  }
  if (status["idempotencyVersion"] !== REQUIRED_IDEMPOTENCY_VERSION) {
    throw new AdapterError("INCOMPATIBLE_SERVICE", IDEMPOTENCY_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
  }
  if (status["retrievalVersion"] !== REQUIRED_RETRIEVAL_VERSION) {
    throw new AdapterError("INCOMPATIBLE_SERVICE", RETRIEVAL_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
  }
  if (status["researchSearchVersion"] !== REQUIRED_RESEARCH_SEARCH_VERSION) {
    throw new AdapterError("INCOMPATIBLE_SERVICE", RESEARCH_SEARCH_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
  }
  if (status["problemReadVersion"] !== REQUIRED_PROBLEM_READ_VERSION) {
    throw new AdapterError("INCOMPATIBLE_SERVICE", PROBLEM_READ_UPGRADE_MESSAGE, { httpStatus: result.status, retryable: false });
  }
  return { problemReadVersion: REQUIRED_PROBLEM_READ_VERSION, researchSearchVersion: REQUIRED_RESEARCH_SEARCH_VERSION, retrievalVersion: REQUIRED_RETRIEVAL_VERSION, serviceUrl: new URL(serviceUrl).origin, contextSchemaVersion: REQUIRED_CONTEXT_SCHEMA_VERSION, idempotencyVersion: REQUIRED_IDEMPOTENCY_VERSION };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await checkService(process.env["QOP_SERVICE_URL"] ?? "http://127.0.0.1:8787");
    process.stdout.write(`Compatible API: ${result.serviceUrl} (${result.contextSchemaVersion}, ${result.idempotencyVersion}, ${result.retrievalVersion}, ${result.researchSearchVersion}, ${result.problemReadVersion})\n`);
  } catch (error) {
    const code = error instanceof AdapterError ? error.code : "SERVICE_PREFLIGHT_FAILED";
    process.stderr.write(`${code}: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
