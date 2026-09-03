/**
 * The HTTP API, read side. JSON over node:http; every route is a pure function of the ledger
 * and the index. Writes arrive through the domain functions in write.ts; the authenticated
 * write endpoints come with the next change.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import type { Service } from "./write.ts";
import { problemView, frontier, tree, attempts, contributionView, recordView, status, events } from "./read-models.ts";
import { currentDecisions, isIndexed } from "../../contract/src/derive.ts";

class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type Handler = (params: string[], query: URLSearchParams) => unknown;

function routes(service: Service): [RegExp, Handler][] {
  const ledger = () => service.repo.current();
  const resolveProblem = (idOrAlias: string): string => {
    const l = ledger();
    if (l.find("Problem", idOrAlias)) return idOrAlias;
    const byAlias = l.currentOf("Problem").find((p) => (p.fields["aliases"] as string[]).includes(idOrAlias));
    if (!byAlias) throw new HttpError(404, `unknown problem ${idOrAlias}`);
    return byAlias.id;
  };
  const notNull = <T>(value: T | null, what: string): T => {
    if (value === null) throw new HttpError(404, `unknown ${what}`);
    return value;
  };
  return [
    [/^\/api\/v1\/status$/u, () => status(ledger(), service.index, service.policy.policyVersion)],
    [/^\/api\/v1\/policy$/u, () => ({ policyVersion: service.policy.policyVersion, thresholds: service.policy.thresholds, independence: service.policy.independence, mechanicalMethods: service.policy.mechanicalMethods, rateLimits: service.policy.rateLimits, bodyLimits: service.policy.bodyLimits, licenses: service.policy.licenses })],
    [/^\/api\/v1\/schemas\/([a-z-]+)$/u, ([name]) => {
      const file = path.join(service.repo.schemaDir, `${name}.schema.json`);
      if (!fs.existsSync(file)) throw new HttpError(404, `unknown schema ${name}`);
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }],
    [/^\/api\/v1\/problems$/u, (_p, query) => {
      const rows = service.index.problemRows({
        ...(query.get("status") ? { status: query.get("status")! } : {}),
        ...(query.get("area") ? { area: query.get("area")! } : {}),
        ...(query.get("topic") ? { topic: query.get("topic")! } : {}),
        ...(query.get("difficulty") ? { difficulty: query.get("difficulty")! } : {}),
        ...(query.get("text") ? { text: query.get("text")! } : {}),
        indexedOnly: query.get("includeCandidates") !== "true",
        limit: Number(query.get("limit") ?? 50),
      });
      return { count: rows.length, problems: rows.map((row) => ({ id: row.id, alias: row.alias, title: row.title, role: row.role, catalogState: row.catalog_state, status: row.status, areaIds: JSON.parse(row.area_ids), topicIds: JSON.parse(row.topic_ids), difficulty: row.difficulty, lastReviewed: row.last_reviewed })) };
    }],
    [/^\/api\/v1\/problems\/([^/]+)$/u, ([id]) => notNull(problemView(ledger(), resolveProblem(id!)), "problem")],
    [/^\/api\/v1\/problems\/([^/]+)\/frontier$/u, ([id]) => notNull(frontier(ledger(), resolveProblem(id!)), "problem")],
    [/^\/api\/v1\/problems\/([^/]+)\/tree$/u, ([id]) => ({ problemId: resolveProblem(id!), tree: tree(ledger(), resolveProblem(id!)) })],
    [/^\/api\/v1\/problems\/([^/]+)\/attempts$/u, ([id]) => ({ problemId: resolveProblem(id!), attempts: attempts(ledger(), resolveProblem(id!)) })],
    [/^\/api\/v1\/problems\/([^/]+)\/indexed$/u, ([id]) => ({ problemId: resolveProblem(id!), indexed: isIndexed(ledger(), resolveProblem(id!), currentDecisions(ledger())) })],
    [/^\/api\/v1\/contributions\/([^/]+)$/u, ([id]) => notNull(contributionView(ledger(), id!), "contribution")],
    [/^\/api\/v1\/records\/([^/]+)$/u, ([id]) => notNull(recordView(ledger(), id!), "record")],
    [/^\/api\/v1\/events$/u, (_p, query) => events(ledger(), service.index, Number(query.get("after") ?? 0), Number(query.get("limit") ?? 100), query.get("type") ?? undefined)],
  ];
}

export function createServer(service: Service): http.Server {
  const table = routes(service);
  return http.createServer((request, response) => {
    const send = (code: number, payload: unknown) => {
      const body = JSON.stringify(payload, null, 1);
      response.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Content-Length": Buffer.byteLength(body), "Cache-Control": code === 200 ? "public, max-age=15" : "no-store" });
      response.end(body);
    };
    try {
      if (request.method !== "GET") throw new HttpError(405, "the read API accepts GET only");
      const url = new URL(request.url ?? "/", "http://localhost");
      for (const [pattern, handler] of table) {
        const match = url.pathname.match(pattern);
        if (match) {
          send(200, handler(match.slice(1).map((s) => decodeURIComponent(s)), url.searchParams));
          return;
        }
      }
      throw new HttpError(404, `no route for ${url.pathname}`);
    } catch (error) {
      if (error instanceof HttpError) send(error.status, { error: error.message });
      else send(500, { error: error instanceof Error ? error.message : String(error) });
    }
  });
}
