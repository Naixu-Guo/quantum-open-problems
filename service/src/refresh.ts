/** Background remote ingestion belongs to the HTTP server's lifetime, not to MCP sessions. */
import type { Server } from "node:http";
import { refresh, type Service } from "./write.ts";

export function watchLedger(server: Server, service: Service): void {
  if (!service.repo.syncState() || service.syncIntervalMs === 0) return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let active: AbortController | undefined;
  let stopped = true;
  let generation = 0;
  let lastError: string | null = null;

  async function poll(epoch: number): Promise<void> {
    const controller = new AbortController();
    active = controller;
    try {
      await service.repo.poll(controller.signal);
      if (stopped || epoch !== generation) return;
      refresh(service);
      lastError = null;
    } catch (error) {
      if (stopped || epoch !== generation) return;
      // A refusal in a later repository may follow a valid update to an earlier one.
      try { refresh(service); } catch { /* the next request will report the unavailable ledger */ }
      const message = error instanceof Error ? error.message : String(error);
      if (message !== lastError) console.error(`Background ledger sync: ${message}`);
      lastError = message;
    } finally {
      if (active === controller) active = undefined;
      if (!stopped && epoch === generation) {
        timer = setTimeout(() => void poll(epoch), service.syncIntervalMs);
        timer.unref();
      }
    }
  }

  server.on("listening", () => { stopped = false; void poll(++generation); });
  server.on("close", () => {
    stopped = true;
    generation++;
    if (timer) clearTimeout(timer);
    active?.abort();
  });
}
