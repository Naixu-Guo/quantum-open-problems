/**
 * One contribution: what it introduces, its reviews and decisions, and the review form for
 * reviewers. Proposals, references, and attempt reports all land here.
 */
import { html, mount, $, $$, label, formatDate, shortId, toast } from "../lib/dom.js";
import { get, post, submitBatch } from "../lib/api.js";
import { setTitle, refresh } from "../router.js";
import { signedIn, hasRole, actor, loginUrl, actorsById } from "../lib/session.js";
import { markdown, inlineMarkup, chip, statusChip, sourceLine, problemPath, errorBox } from "./shared.js";
import { renderDiscussion } from "./comments.js";
import { typeset } from "../lib/math.js";

const VERDICTS = [
  ["verified", "Verified: the claim holds as stated"],
  ["verified-partial", "Verified in part"],
  ["unverified-plausible", "Plausible, not verified"],
  ["incomplete", "Incomplete"],
  ["scope-mismatch", "Scope mismatch"],
  ["duplicate", "Duplicate"],
  ["junk", "Junk"],
  ["rejected", "Rejected"],
];
const METHODS = ["citation-check", "argument-read", "scope-check", "duplicate-check", "reproduction", "artifact-execution", "formal-check"];

function reviewForm(contribution) {
  const defaultKind = contribution.kind === "attempt-report" || contribution.kind === "evidence-import" ? "verification" : "triage";
  return html`<form id="review-form" class="form">
    <h3>File a review</h3>
    <p class="form-intro small">One human review admits a proposal or accepts a reference. A positive verdict on an attempt report accepts it; a negative one rejects it. Write what you checked.</p>
    <div class="field-row">
      <div class="field"><label for="review-kind">Kind</label><select id="review-kind">${["triage", "verification", "audit"].map((k) => html`<option value="${k}" ${k === defaultKind ? "selected" : ""}>${k}</option>`)}</select></div>
      <div class="field"><label for="review-verdict">Verdict</label><select id="review-verdict">${VERDICTS.map(([v, t]) => html`<option value="${v}">${t}</option>`)}</select></div>
    </div>
    <div class="field"><label>Methods</label><div class="choice">${METHODS.map((m) => html`<label class="check"><input type="checkbox" name="method" value="${m}"> ${label(m)}</label>`)}</div></div>
    <div class="field"><label for="review-body">Review</label><textarea id="review-body" required placeholder="What you checked, what holds, what does not. Markdown and TeX math work."></textarea></div>
    <div class="field"><label class="check"><input type="checkbox" id="review-coi"> I have a conflict of interest to declare</label><input id="review-coi-text" placeholder="State it" hidden></div>
    <div id="review-error"></div>
    <div class="form-foot"><button class="button primary" type="submit">Submit review</button></div>
  </form>`;
}

export async function view({ main, params }) {
  const c = await get(`/api/v1/contributions/${encodeURIComponent(params[0])}`);
  const [actors, newProblem, problems, references, comments] = await Promise.all([
    actorsById().catch(() => new Map()),
    c.newProblemIds[0] ? get(`/api/v1/problems/${c.newProblemIds[0]}`).catch(() => null) : null,
    Promise.all(c.problemIds.map((id) => get(`/api/v1/problems/${id}`).catch(() => null))),
    Promise.all(c.referenceIds.map((id) => get(`/api/v1/records/${id}`).catch(() => null))),
    get(`/api/v1/comments?targetType=contribution&targetId=${c.id}`).catch(() => ({ comments: [] })),
  ]);
  const sources = new Map(await Promise.all(references.filter(Boolean).map(async (r) => [r.sourceId, await get(`/api/v1/records/${r.sourceId}`).catch(() => null)])));
  setTitle(c.title);
  const who = (id) => actors.get(id)?.name ?? shortId(id);
  const me = actor();
  const alreadyReviewed = me && c.reviews.some((r) => r.reviewerId === me.id);
  const canReview = signedIn() && (hasRole("reviewer") || hasRole("editor")) && c.actorId !== me.id && c.state === "submitted" && !alreadyReviewed;
  const canWithdraw = signedIn() && c.actorId === me?.id && c.state === "submitted";
  const context = problems.filter(Boolean)[0] ?? newProblem;

  mount(main, html`<div class="doc">
    <article class="doc-main">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/review">Review queue</a><span>›</span>${context ? html`<a href="${problemPath(context)}">${inlineMarkup(context.title)}</a><span>›</span>` : ""}<span>${label(c.kind)}</span></nav>
      <h1 class="doc-title">${inlineMarkup(c.title)}</h1>
      <div class="doc-meta">
        ${chip(c.kind, "outline")}${chip(c.state)}${c.verificationLevel && c.verificationLevel !== "none" ? chip(c.verificationLevel, "outline") : ""}
        <span>by ${who(c.actorId)}${actors.get(c.actorId)?.kind && actors.get(c.actorId).kind !== "human" ? html` <span class="chip outline">${actors.get(c.actorId).kind}</span>` : ""}</span>
        <span>${formatDate(c.createdAt)}</span>
        ${c.aiInvolvement && c.aiInvolvement !== "none" ? html`<span>AI ${c.aiInvolvement}</span>` : ""}
        ${c.statementIsCurrent === false ? html`<span class="chip outline" title="The statement has been revised since">earlier statement</span>` : ""}
      </div>
      ${c.state === "submitted" ? html`<div class="notice">Waiting for review. ${c.reviews.length} review${c.reviews.length === 1 ? "" : "s"} so far.</div>` : ""}

      <section id="body"><h2>${c.kind === "attempt-report" ? "Report" : "Note"}</h2><div class="prose">${c.body ? markdown(c.body) : html`<p class="muted">No text.</p>`}</div></section>

      ${newProblem ? html`<section id="introduces"><h2>Introduces</h2>
        <ul class="list"><li><div class="row"><a class="row-title" href="${problemPath(newProblem)}">${inlineMarkup(newProblem.title)}</a><div class="row-meta">${statusChip(newProblem)}${newProblem.role === "auxiliary" ? html`<span class="chip outline">auxiliary</span>` : ""}<span>${newProblem.statement?.clauses.length ?? 0} clause${newProblem.statement?.clauses.length === 1 ? "" : "s"}</span><span>${newProblem.references.length} reference${newProblem.references.length === 1 ? "" : "s"}</span></div></div></li></ul>
        ${newProblem.statement ? html`<h3 class="group-title">Statement</h3><div class="prose serif">${markdown(newProblem.statement.body, { headingOffset: 1 })}</div>` : ""}
      </section>` : ""}

      ${references.filter(Boolean).length ? html`<section id="references"><h2>References added</h2><ul class="refs">${references.filter(Boolean).map((r) => html`<li class="ref"><div>${sourceLine(sources.get(r.sourceId))}</div><div class="ref-meta">${label(r.role)}${r.locator ? ` · ${r.locator}` : ""}${r.targetType !== "problem" ? ` · on ${r.targetType}` : ""}</div>${r.body ? html`<div class="ref-note prose">${markdown(r.body)}</div>` : ""}</li>`)}</ul></section>` : ""}

      ${c.claims.length ? html`<section id="claims"><h2>Claims</h2><ul class="claims">${c.claims.map((claim) => html`<li class="claim"><div class="claim-head">${chip(claim.relation, "outline")}<strong>${inlineMarkup(claim.title)}</strong></div><div class="prose small">${markdown(claim.body)}</div><div class="claim-support">${claim.clauseIds.join(", ")}</div></li>`)}</ul></section>` : ""}

      ${c.kind === "attempt-report" ? html`<section id="process"><h2>Process</h2><dl class="defs">
        <dt>Stop reason</dt><dd>${label(c.stopReason)}</dd>
        ${c.trajectoryId ? html`<dt>Trajectory</dt><dd><a href="/api/v1/records/${c.trajectoryId}" data-native class="mono">${c.trajectoryId}</a></dd>` : ""}
        ${c.artifactIds.length ? html`<dt>Artifacts</dt><dd>${c.artifactIds.map((id) => html`<a href="/api/v1/records/${id}" data-native class="mono">${shortId(id)}</a> `)}</dd>` : ""}
        ${c.declaredReadIds.length ? html`<dt>Declared reads</dt><dd class="mono small">${c.declaredReadIds.join(", ")}</dd>` : ""}
        ${c.newProblemIds.length ? html`<dt>Formulated</dt><dd>${c.newProblemIds.length} auxiliary problem${c.newProblemIds.length === 1 ? "" : "s"}</dd>` : ""}
      </dl></section>` : ""}

      <section id="reviews">
        <h2>Reviews <span class="small muted">${c.reviews.length}</span></h2>
        ${c.reviews.length === 0 ? html`<p class="muted">No reviews yet.</p>` : html`<ul class="claims">${c.reviews.map((r) => html`<li class="claim">
          <div class="claim-head">${chip(r.verdict)}<span class="chip outline">${r.kind}</span><strong>${who(r.reviewerId)}</strong><span class="faint">${formatDate(r.createdAt)}</span></div>
          ${r.methods?.length ? html`<div class="claim-support">Methods: ${r.methods.map(label).join(", ")}</div>` : ""}
          ${r.conflictOfInterest?.declared ? html`<div class="claim-support">Conflict of interest declared: ${r.conflictOfInterest.statement}</div>` : ""}
          <div class="prose small">${markdown(r.body)}</div>
        </li>`)}</ul>`}
        ${canReview ? reviewForm(c) : !signedIn() ? html`<p class="muted small"><a href="${loginUrl()}" data-native>Sign in</a> to review.</p>` : alreadyReviewed ? html`<p class="muted small">You reviewed this contribution.</p>` : c.actorId === me?.id ? "" : c.state !== "submitted" ? "" : html`<p class="muted small">Reviews need the reviewer role; an editor grants it.</p>`}
      </section>

      <section id="decisions">
        <h2>Decisions</h2>
        ${c.decisions.length === 0 ? html`<p class="muted">None yet.</p>` : html`<ul class="timeline">${c.decisions.map((d) => html`<li><time>${formatDate(d.effectiveAt)}</time><span>${label(d.kind)} ${d.outcome}${d.verificationLevel ? html` at <strong>${d.verificationLevel}</strong>` : ""} <span class="faint">· policy ${d.policyVersion}</span>${d.body ? html`<div class="small muted">${inlineMarkup(d.body)}</div>` : ""}</span></li>`)}</ul>`}
        ${canWithdraw ? html`<p style="margin-top:12px"><button class="button small" type="button" id="withdraw">Withdraw this contribution</button></p>` : ""}
      </section>

      <section id="discussion"><h2>Discussion</h2><div id="discussion-thread"></div></section>
    </article>
    <aside class="rail">
      <div><h3>Record</h3><dl class="defs">
        <dt>Id</dt><dd class="mono">${c.id}</dd>
        <dt>License</dt><dd>${c.license}</dd>
        ${c.statementId ? html`<dt>Statement</dt><dd class="mono" title="${c.statementDigest ?? ""}">${shortId(c.statementId)}</dd>` : ""}
        <dt>JSON</dt><dd><a href="/api/v1/contributions/${c.id}" data-native>contribution view</a></dd>
      </dl></div>
    </aside>
  </div>`);

  const form = $("#review-form", main);
  if (form) {
    $("#review-coi", form).addEventListener("change", (event) => { $("#review-coi-text", form).hidden = !event.target.checked; });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = $("button[type=submit]", form);
      button.disabled = true;
      const declared = $("#review-coi", form).checked;
      try {
        const result = await submitBatch([{
          type: "Review", contributionId: c.id, trajectoryId: null, kind: $("#review-kind", form).value,
          independence: { differentOperator: true, differentModelFamily: true, noSharedReads: true },
          conflictOfInterest: { declared, statement: declared ? $("#review-coi-text", form).value.trim() : "" },
          methods: $$("input[name=method]:checked", form).map((el) => el.value), checks: [],
          verdict: $("#review-verdict", form).value, body: $("#review-body", form).value.trim(),
        }]);
        toast(result.decisions?.length ? `Review filed; ${result.decisions.length} decision${result.decisions.length === 1 ? "" : "s"} followed` : "Review filed");
        await refresh();
      } catch (error) {
        mount($("#review-error", form), errorBox(error));
        button.disabled = false;
      }
    });
  }
  $("#withdraw", main)?.addEventListener("click", async () => {
    const reason = prompt("Why withdraw it? The reason is recorded.");
    if (!reason) return;
    try { await post(`/api/v1/contributions/${c.id}/withdraw`, { reason }); toast("Withdrawn"); await refresh(); }
    catch (error) { toast(error.message, "error"); }
  });
  await renderDiscussion($("#discussion-thread", main), { targetType: "contribution", targetId: c.id }, comments.comments, { onChange: refresh });
  await typeset(main);
}
