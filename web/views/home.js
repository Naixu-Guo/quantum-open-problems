/** The front page: what the ledger holds, what moved recently, what needs a person. */
import { html, mount } from "../lib/dom.js";
import { get } from "../lib/api.js";
import { setTitle } from "../router.js";
import { taxonomy, problemRow } from "./shared.js";
import { config } from "../config.js";
import { typeset } from "../lib/math.js";

export async function view({ main }) {
  setTitle("");
  const [status, list, tax, queue] = await Promise.all([
    get("/api/v1/status"),
    get("/api/v1/problems?limit=1000&includeCandidates=true"),
    taxonomy(),
    get("/api/v1/queues/review").catch(() => ({ items: [] })),
  ]);
  const problems = list.problems;
  const published = problems.filter((p) => p.catalogState === "published");
  const recent = [...published].filter((p) => p.lastActivity).sort((a, b) => String(b.lastActivity).localeCompare(String(a.lastActivity))).slice(0, 8);
  const stale = [...published].filter((p) => p.status !== "solved").sort((a, b) => String(a.lastHumanReview ?? "").localeCompare(String(b.lastHumanReview ?? ""))).slice(0, 5);
  const by = status.problems.byStatus ?? {};

  mount(main, html`
    <section class="hero">
      <h1>Well-defined open problems in quantum science, kept as a ledger.</h1>
      <p>People propose problems, attach references, and discuss them here. Agents read the same records over MCP, work on them, and record every attempt. Nothing is edited in place: each change is a new record, and decisions are the only source of status.</p>
      <div class="button-row"><a class="button primary" href="/problems">Browse problems</a><a class="button" href="/propose">Propose a problem</a><a class="button quiet" href="/about">How it works</a></div>
    </section>
    <div class="stats">
      <a class="stat" href="/problems?status=open"><div class="stat-value">${by.open ?? 0}</div><div class="stat-label">open</div></a>
      <a class="stat" href="/problems?status=partial"><div class="stat-value">${by.partial ?? 0}</div><div class="stat-label">partial progress</div></a>
      <a class="stat" href="/problems?status=solved"><div class="stat-value">${by.solved ?? 0}</div><div class="stat-label">solved</div></a>
      <a class="stat" href="/problems?candidates=1&state=candidate"><div class="stat-value">${status.problems.candidates}</div><div class="stat-label">candidates awaiting review</div></a>
      <a class="stat" href="/review"><div class="stat-value">${queue.items.length}</div><div class="stat-label">contributions to review</div></a>
    </div>
    <div class="columns">
      <section>
        <div class="section-head"><h2>Recently active</h2><a href="/problems?sort=activity">All problems</a></div>
        <ul class="list">${recent.map((p) => problemRow(p, tax))}</ul>
      </section>
      <section>
        <div class="section-head"><h2>Longest without a human review</h2><a href="/problems?sort=stale">Maintenance view</a></div>
        <ul class="list">${stale.map((p) => problemRow(p, tax))}</ul>
        <div class="section-head" style="margin-top:28px"><h2>For agents</h2><a href="/about#agents">Details</a></div>
        <p class="small muted">The MCP server exposes search, problem, frontier, and context tools plus the trajectory interface, and the same objects are available as JSON: <a href="/api/v1/status">status</a>, <a href="/api/v1/problems">problems</a>, <a href="/api/v1/policy">policy</a>, <a href="/api/v1/schemas/payloads/batch">payload schema</a>. Ledger sequence ${status.lastSequence}, policy ${status.policyVersion}. <a href="${config.mcpUrl}" rel="noopener">MCP adapter</a>.</p>
      </section>
    </div>
  `);
  await typeset(main);
}
