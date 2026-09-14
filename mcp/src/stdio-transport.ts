/** Public transport seam for SDK 2.0's cancellation bug with request IDs 0 and "". */
import { randomUUID } from "node:crypto";
import { isJSONRPCRequest, isJSONRPCNotification, isJSONRPCResponse, isSpecType, type JSONRPCMessage, type RequestId, type Transport, type TransportSendOptions } from "@modelcontextprotocol/server";

type Pending = { wireId: RequestId; internalId: string };

export class StdioRequestIdTransport implements Transport {
  private readonly wire: Transport;
  private readonly prefix = `qop-stdio-${randomUUID()}:`;
  private readonly incoming = new Map<RequestId, Pending>();
  private readonly internal = new Map<string, Pending>();
  private closed = false;
  private closeNotified = false;
  onmessage: Transport["onmessage"];
  onerror: Transport["onerror"];
  onclose: Transport["onclose"];

  constructor(wire: Transport) { this.wire = wire; }
  get sessionId() { return this.wire.sessionId; }
  setProtocolVersion(version: string) { this.wire.setProtocolVersion?.(version); }
  setSupportedProtocolVersions(versions: string[]) { this.wire.setSupportedProtocolVersions?.(versions); }

  private release(pending: Pending) {
    this.incoming.delete(pending.wireId);
    this.internal.delete(pending.internalId);
  }
  private finishClose() {
    this.closed = true;
    this.incoming.clear();
    this.internal.clear();
    if (!this.closeNotified) { this.closeNotified = true; this.onclose?.(); }
  }
  async start() {
    this.wire.onmessage = (message, extra) => {
      if (this.closed) return;
      if (isJSONRPCRequest(message)) {
        if (this.incoming.has(message.id)) {
          void this.wire.send({ jsonrpc: "2.0", id: message.id, error: { code: -32600, message: "Request ID is already active" } }).catch(error => this.onerror?.(error));
          return;
        }
        const pending = { wireId: message.id, internalId: `${this.prefix}${randomUUID()}` };
        this.incoming.set(message.id, pending);
        this.internal.set(pending.internalId, pending);
        this.onmessage?.({ ...message, id: pending.internalId }, extra);
        return;
      }
      if (isJSONRPCNotification(message) && message.method === "notifications/cancelled") {
        if (!isSpecType.CancelledNotification(message) || message.params?.requestId === undefined) return;
        const pending = this.incoming.get(message.params.requestId as RequestId);
        if (!pending) return; // Never let a caller name an internal ID directly.
        this.release(pending); // The SDK deliberately sends no response after cancellation.
        this.onmessage?.({ ...message, params: { ...message.params, requestId: pending.internalId } }, extra);
        return;
      }
      // Client responses belong to server-originated requests, a separate ID space.
      this.onmessage?.(message, extra);
    };
    this.wire.onerror = error => this.onerror?.(error);
    this.wire.onclose = () => this.finishClose();
    await this.wire.start();
  }

  async send(message: JSONRPCMessage, options?: TransportSendOptions) {
    if (this.closed) throw new Error("Stdio transport is closed");
    let outgoing = message;
    let outgoingOptions = options;
    if (typeof options?.relatedRequestId === "string" && options.relatedRequestId.startsWith(this.prefix)) {
      const pending = this.internal.get(options.relatedRequestId);
      if (pending) outgoingOptions = { ...options, relatedRequestId: pending.wireId };
      else {
        // Aborting an incoming parent can cancel a server-originated child.
        // Its cancellation must reach the client even after the parent retired.
        const serverCancellation = isJSONRPCNotification(message) && isSpecType.CancelledNotification(message)
          && message.params?.requestId !== undefined
          && !(typeof message.params.requestId === "string" && message.params.requestId.startsWith(this.prefix));
        if (!serverCancellation) return;
        const { relatedRequestId: _retired, ...remaining } = options;
        outgoingOptions = remaining;
      }
    }
    // Associated notifications may carry the incoming ID in params. Cancellation
    // of a server-originated request is sent unchanged (its ID is not ours).
    if (isJSONRPCNotification(message) && typeof message.params?.requestId === "string" && message.params.requestId.startsWith(this.prefix)) {
      const pending = this.internal.get(message.params.requestId);
      if (!pending) return;
      outgoing = { ...message, params: { ...message.params, requestId: pending.wireId } };
    }
    if (isJSONRPCResponse(message) && typeof message.id === "string" && message.id.startsWith(this.prefix)) {
      const pending = this.internal.get(message.id);
      if (!pending) return; // Late replies are dropped without retaining retired IDs.
      outgoing = { ...message, id: pending.wireId };
      this.release(pending);
    }
    await this.wire.send(outgoing, outgoingOptions);
  }
  async close() {
    if (this.closed) return;
    this.closed = true;
    try { await this.wire.close(); }
    finally { this.finishClose(); }
  }
}
