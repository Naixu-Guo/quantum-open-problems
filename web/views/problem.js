/** One problem: statement, clauses, progress, references, discussion, history. */
import { html, mount, $, label, formatDate, shortId, copyText } from "../lib/dom.js";
import { get } from "../lib/api.js";
import { refresh } from "../router.js";
import { signedIn, loginUrl, actorsById } from "../lib/session.js";
import { markdown, inlineMarkup, statusChip, chip, taxonomy, sourceLine, openDialog, groupBy, problemPath, copyButton } from "./shared.js";
import { renderDiscussion } from "./comments.js";
import { referenceDialog, REFERENCE_ROLES } from "./references.js";
import { typeset } from "../lib/math.js";
import { config } from "../config.js";

const ROLE_ORDER = REFERENCE_ROLES.map(([value]) => value);
const ROLE_TEXT = new Map(REFERENCE_ROLES);

/** What a decision did, in words; a rejected decision changed nothing. */
function decisionText(decision) {
  const accepted = decision.outcome === "accepted";
  switch (decision.kind) {
    case "admission": return accepted ? "Admitted to the catalog" : "Admission refused";
    case "status": return accepted ? `Status set to ${decision.status}` : `Status change to ${decision.status} refused`;
    case "maintenance": return "Reviewed by a human editor";
    case "promotion": return accepted ? "Promoted to the main index" : "Promotion refused";
    case "merge": return accepted ? "Merged into another problem" : "Merge refused";
    case "retire": return accepted ? "Retired from the catalog" : "Retirement refused";
    default: return `${label(decision.kind)} ${decision.outcome}`;
  }
}

function treeList(nodes) {
  if (!nodes.length) return "";
  return html`<ul class="tree">${nodes.map((node) => html`<li>
    <a href="${problemPath(node)}">${inlineMarkup(node.title)}</a> ${statusChip(node)}${node.indexed ? "" : html` <span class="chip outline" title="Listed in the tree only; promotion to the index is a human decision">tree only</span>`}
    ${node.attemptReports?.length ? html`<span class="faint small"> · ${node.attemptReports.length} attempt${node.attemptReports.length === 1 ? "" : "s"}</span>` : ""}
    ${treeList(node.children ?? [])}
  </li>`)}</ul>`;
}

function citeDialog(problem, statement) {
  const url = `${location.origin}${problemPath(problem)}`;
  const today = new Date().toISOString().slice(0, 10);
  const alias = problem.aliases?.[0] ?? problem.id;
  const text = `Quantum Open Problems, “${problem.title}”, problem ${alias}, statement version ${statement.version} (${statement.digest}). ${url}. Retrieved ${today}.`;
  const bibtex = `@misc{qop-${alias},\n  title = {${problem.title}},\n  howpublished = {Quantum Open Problems, problem ${alias}, statement v${statement.version}},\n  note = {${statement.digest}},\n  url = {${url}},\n  year = {${today.slice(0, 4)}},\n}`;
  openDialog("Cite this problem", html`
    <p class="small muted">Cite the primary sources under References for the mathematics. Cite this page for the statement text, its version, and its digest.</p>
    <div class="copy-block"><pre>${text}</pre>${copyButton(text)}</div>
    <div class="copy-block"><pre>${bibtex}</pre>${copyButton(bibtex, "Copy BibTeX")}</div>`);
}

/** The problem's ancestors, nearest first; an auxiliary problem lives under its parent's directory. */
async function ancestors(problem) {
  const chain = [];
  let parentId = problem.parentProblemId;
  while (parentId && chain.length < 8) {
    const parent = await get(`/api/v1/problems/${parentId}`).catch(() => null);
    if (!parent) break;
    chain.push(parent);
    parentId = parent.parentProblemId;
  }
  return chain;
}

function ledgerDirectory(problem, chain) {
  if (!problem.aliases?.[0] || chain.some((p) => !p.aliases?.[0])) return null;
  const root = chain[chain.length - 1] ?? problem;
  const below = [...chain.slice(0, -1).reverse(), ...(chain.length ? [problem] : [])];
  return `problems/${root.aliases[0]}${below.map((p) => `/auxiliary/${p.aliases[0]}`).join("")}`;
}

function stateNotice(problem, proposal, mergedInto) {
  switch (problem.catalogState) {
    case "candidate": return html`<div class="notice">This problem is a candidate: its proposal waits for a review, and it is not in the index yet.${proposal ? html` <a href="/contributions/${proposal.id}">Open the proposal</a>.` : ""}</div>`;
    case "merged": return html`<div class="notice warn">This problem was merged${mergedInto ? html` into <a href="${problemPath(mergedInto)}">${inlineMarkup(mergedInto.title)}</a>` : " into another problem"}; it stays here for the record.</div>`;
    case "retired": return html`<div class="notice warn">This problem was retired from the catalog; it stays here for the record.</div>`;
    default: return "";
  }
}

export async function view({ main, params, setTitle, alive }) {
  const key = encodeURIComponent(params[0]);
  const [problem, front, tax, actors] = await Promise.all([
    get(`/api/v1/problems/${key}`),
    get(`/api/v1/problems/${key}/frontier`).catch(() => null),
    taxonomy(),
    actorsById().catch(() => new Map()),
  ]);
  const chain = await ancestors(problem);
  const merge = problem.catalogState === "merged" ? problem.decisions.find((d) => d.kind === "merge" && d.outcome === "accepted") : null;
  const mergedInto = merge?.mergeIntoProblemId ? await get(`/api/v1/problems/${merge.mergeIntoProblemId}`).catch(() => null) : null;
  if (!alive()) return;
  setTitle(problem.title);
  const parent = chain[0] ?? null;
  const alias = problem.aliases?.[0];
  const directory = ledgerDirectory(problem, chain);
  const statement = problem.statement;
  const proposal = front?.pendingContributions?.find((c) => c.kind === "problem-proposal") ?? null;
  const groups = groupBy(problem.references, (r) => r.role);
  const roles = [...ROLE_ORDER.filter((r) => groups.has(r)), ...[...groups.keys()].filter((r) => !ROLE_ORDER.includes(r))];
  const clauseLabel = new Map((statement?.clauses ?? []).map((c) => [c.ref, c.label]));
  const who = (id) => actors.get(id)?.name ?? shortId(id);
  const hasProgress = front && (front.acceptedClaims.length || front.routesTried.length || front.pendingContributions.length || front.tree.length || front.bestBounds.some((b) => b.bounds.length));

  mount(main, html`<div class="doc">
    <article class="doc-main">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/problems">Problems</a><span>›</span>${parent ? html`<a href="${problemPath(parent)}">${inlineMarkup(parent.title)}</a><span>›</span>` : ""}<span>${alias ?? shortId(problem.id)}</span></nav>
      <h1 class="doc-title">${inlineMarkup(problem.title)}</h1>
      <div class="doc-meta">
        ${statusChip(problem)}
        ${problem.role === "auxiliary" ? html`<span class="chip outline" title="${problem.indexed ? "An auxiliary problem promoted into the main index" : "An auxiliary problem, listed in its parent's tree"}">auxiliary${problem.indexed ? " · indexed" : ""}</span>` : ""}
        ${problem.areaIds.map((id) => html`<a class="tag" href="/problems?area=${id}">${tax.areaLabel(id)}</a>`)}
        ${problem.topicIds.map((id) => html`<a class="tag" href="/problems?topic=${id}">${tax.topicLabel(id)}</a>`)}
        ${problem.difficulty !== "unrated" ? html`<span>${label(problem.difficulty)}</span>` : ""}
        ${problem.posed ? html`<span>posed ${problem.posed}</span>` : ""}
        <span title="How the problem entered the ledger">${label(problem.origin)}</span>
      </div>
      ${stateNotice(problem, proposal, mergedInto)}
      <div class="doc-actions">
        ${signedIn() ? html`<button class="button small" id="add-reference" type="button">Add reference</button>` : html`<a class="button small" href="${loginUrl()}" data-native title="Sign in to add references and comments">Sign in to contribute</a>`}
        <a class="button small" href="#discussion">Comment</a>
        <button class="button small" id="cite" type="button">Cite</button>
        <button class="button small" id="share" type="button">Share</button>
        <a class="button small quiet" href="/api/v1/problems/${problem.id}" data-native>JSON</a>
        <a class="button small quiet" href="/api/v1/problems/${problem.id}/context" data-native title="What an agent starts from, cut to a token budget">Context bundle</a>
        ${directory ? html`<a class="button small quiet" href="${config.ledgerUrl}/${directory}" rel="noopener" title="The files behind this page">Ledger files</a>` : ""}
      </div>

      ${problem.body ? html`<section id="background"><h2>Background</h2><div class="prose">${markdown(problem.body, { headingOffset: 2 })}</div></section>` : ""}

      <section id="statement">
        <h2>Statement ${statement ? html`<span class="small muted">version ${statement.version} · <span class="mono" title="${statement.digest}">${statement.digest.slice(7, 19)}</span></span>` : ""}</h2>
        ${statement ? html`<div class="prose serif">${markdown(statement.body, { headingOffset: 1 })}</div>` : html`<p class="muted">No statement on file.</p>`}
      </section>

      ${statement ? html`<section id="clauses">
        <h2>Clauses <span class="small muted">what counts as resolving it</span></h2>
        <ol class="clauses">${statement.clauses.map((c) => html`<li class="clause" id="clause-${c.id}">
          <div class="clause-head"><strong>${inlineMarkup(c.label)}</strong>${chip(c.status)}<span class="chip outline">${c.kind}</span><span class="faint mono">${c.id}</span></div>
          <div class="clause-text">${inlineMarkup(c.text)}</div>
          <div class="clause-criteria"><span class="faint">Resolved when:</span> ${inlineMarkup(c.resolutionCriteria)}</div>
          ${c.quantity ? html`<div class="clause-criteria"><span class="faint">Quantity:</span> ${c.quantity.name}${c.quantity.symbol ? html` ${inlineMarkup(c.quantity.symbol)}` : ""} (${c.quantity.direction})</div>` : ""}
        </li>`)}</ol>
      </section>` : ""}

      <section id="progress">
        <h2>Progress</h2>
        ${!hasProgress ? html`<p class="muted">No accepted results, attempts, or pending contributions yet.</p>` : ""}
        ${front?.acceptedClaims.length ? html`<h3 class="group-title">Accepted claims</h3><ul class="claims">${front.acceptedClaims.map((claim) => html`<li class="claim">
          <div class="claim-head">${chip(claim.relation, "outline")}<strong>${inlineMarkup(claim.title)}</strong></div>
          <div class="claim-support">On ${claim.clauseIds.map((ref) => clauseLabel.get(ref) ?? ref).join(", ")}${claim.bound ? html` · bound: ${claim.bound.direction} ${inlineMarkup(claim.bound.value)}` : ""}</div>
          <ul class="refs small">${claim.support.map((s) => html`<li class="ref">${s.source ? sourceLine(s.source) : s.artifactId ? html`Artifact <a href="/api/v1/records/${s.artifactId}" data-native class="mono">${shortId(s.artifactId)}</a>` : ""}<span class="ref-meta">${label(s.maturity)} · ${label(s.strength)}${s.locator ? ` · ${s.locator}` : ""}</span></li>`)}</ul>
        </li>`)}</ul>` : ""}
        ${front?.bestBounds.some((b) => b.bounds.length) ? html`<h3 class="group-title">Best bounds</h3><ul class="claims">${front.bestBounds.filter((b) => b.bounds.length).map((b) => html`<li class="claim"><strong>${clauseLabel.get(b.clauseRef) ?? b.clauseRef}</strong> ${b.quantity ? html`<span class="muted">${b.quantity.name}</span>` : ""}<ul>${b.bounds.map((bound) => html`<li>${bound.direction}: ${inlineMarkup(bound.value)}${bound.conditions ? html` <span class="muted">(${bound.conditions})</span>` : ""}</li>`)}</ul></li>`)}</ul>` : ""}
        ${front?.routesTried.length ? html`<h3 class="group-title">Routes tried</h3><ul class="claims">${front.routesTried.map((r) => html`<li class="claim"><div class="claim-head"><a href="/contributions/${r.id}">${inlineMarkup(r.title)}</a>${chip(r.stopReason, "outline")}${r.statementIsCurrent === false ? html`<span class="chip outline" title="Worked from an earlier statement version">earlier statement</span>` : ""}</div><div class="claim-support">by ${who(r.actorId)}${r.newProblemIds.length ? ` · formulated ${r.newProblemIds.length} auxiliary problem${r.newProblemIds.length === 1 ? "" : "s"}` : ""}</div></li>`)}</ul>` : ""}
        ${front?.tree.length ? html`<h3 class="group-title">Decomposition</h3>${treeList(front.tree)}` : ""}
        ${front?.pendingContributions.length ? html`<h3 class="group-title">Awaiting review</h3><ul class="list">${front.pendingContributions.map((c) => html`<li><div class="row"><a class="row-title" href="/contributions/${c.id}">${inlineMarkup(c.title)}</a><div class="row-meta">${chip(c.kind, "outline")}<span>by ${who(c.actorId)}</span></div><div class="row-side">${formatDate(c.createdAt)}</div></div></li>`)}</ul>` : ""}
      </section>

      <section id="references">
        <h2>References <span class="small muted">${problem.references.length}</span></h2>
        ${roles.map((role) => html`<h3 class="group-title">${ROLE_TEXT.get(role) ?? label(role)}</h3><ul class="refs">${groups.get(role).map((ref) => html`<li class="ref" id="reference-${ref.id}">
          <div>${sourceLine(ref.source)}</div>
          ${ref.locator ? html`<div class="ref-meta">${ref.locator}</div>` : ""}
          ${ref.body ? html`<div class="ref-note prose">${markdown(ref.body)}</div>` : ""}
          ${ref.targetType !== "problem" ? html`<div class="ref-meta faint">on ${ref.targetType} ${clauseLabel.get(ref.targetId) ?? ref.targetId}</div>` : ""}
        </li>`)}</ul>`)}
        ${problem.references.length === 0 ? html`<p class="muted">No references yet.${signedIn() ? " Use “Add reference” above." : ""}</p>` : ""}
      </section>

      <section id="discussion"><h2>Discussion</h2><div id="discussion-thread"></div></section>

      <section id="history">
        <h2>History</h2>
        <ul class="timeline">
          <li><time>${formatDate(problem.createdAt)}</time><span>Problem record created by ${who(problem.createdBy)}</span></li>
          ${problem.decisions.map((d) => html`<li><time>${formatDate(d.effectiveAt)}</time><span>${decisionText(d)} <span class="faint">· policy ${d.policyVersion}</span>${d.body ? html`<div class="small muted">${inlineMarkup(d.body)}</div>` : ""}</span></li>`)}
        </ul>
      </section>
    </article>

    <aside class="rail">
      <div><h3>On this page</h3><nav>${["statement", "clauses", "progress", "references", "discussion", "history"].map((id) => html`<a href="#${id}">${id[0].toUpperCase()}${id.slice(1)}</a>`)}</nav></div>
      <div><h3>Record</h3><dl class="defs">
        <dt>Id</dt><dd class="mono">${problem.id}</dd>
        ${alias ? html`<dt>Alias</dt><dd class="mono">${alias}</dd>` : ""}
        ${statement ? html`<dt>Statement digest</dt><dd class="mono" title="${statement.digest}">${statement.digest.slice(0, 22)}…</dd>` : ""}
        <dt>Last activity</dt><dd>${front?.lastActivity ? formatDate(front.lastActivity) : "none"}</dd>
        <dt>Last human review</dt><dd>${front?.lastHumanReview ? formatDate(front.lastHumanReview) : "never"}</dd>
        <dt>Problem record</dt><dd>revision ${problem.revision} · ${formatDate(problem.createdAt)}</dd>
      </dl></div>
    </aside>
  </div>`);

  $("#add-reference", main)?.addEventListener("click", () => referenceDialog(problem, refresh));
  $("#cite", main).addEventListener("click", () => citeDialog(problem, statement ?? { version: 0, digest: "" }));
  $("#share", main).addEventListener("click", () => copyText(`${location.origin}${problemPath(problem)}`));
  await renderDiscussion($("#discussion-thread", main), { targetType: "problem", targetId: problem.id }, problem.comments, { onChange: refresh });
  await typeset(main);
}
