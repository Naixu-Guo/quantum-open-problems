/** The review queue: contributions waiting for a review, oldest first, minus the caller's own. */
import { html, mount, relativeTime, label } from "../lib/dom.js";
import { get } from "../lib/api.js";
import { setTitle } from "../router.js";
import { signedIn, hasRole, loginUrl, actorsById } from "../lib/session.js";
import { chip } from "./shared.js";
import { typeset } from "../lib/math.js";
import { inlineMarkup } from "./shared.js";

export async function view({ main }) {
  setTitle("Review queue");
  const [queue, actors] = await Promise.all([get("/api/v1/queues/review"), actorsById().catch(() => new Map())]);
  const canReview = signedIn() && (hasRole("reviewer") || hasRole("editor"));
  mount(main, html`
    <section class="doc-main">
      <h1>Review queue</h1>
      <p class="muted">Contributions that nobody has decided on yet. A human review admits a proposed problem or accepts a reference at once; AI reviews need two independent ones. ${queue.items.length ? "Oldest first." : ""}</p>
      ${!signedIn() ? html`<div class="notice"><a href="${loginUrl()}" data-native>Sign in with GitHub</a> to file reviews. New accounts start as contributors; an editor grants the reviewer role.</div>` : !canReview ? html`<div class="notice">Your account has no reviewer role yet, so you can read these but not file a review. An editor grants roles.</div>` : ""}
      ${queue.items.length === 0 ? html`<p class="muted">The queue is empty.</p>` : html`<ul class="list">${queue.items.map((item) => html`<li><div class="row">
        <a class="row-title" href="/contributions/${item.id}">${inlineMarkup(item.title)}</a>
        <div class="row-meta">${chip(item.kind, "outline")}<span>by ${actors.get(item.actorId)?.name ?? item.actorId}</span>${item.reviews ? html`<span>${item.reviews} review${item.reviews === 1 ? "" : "s"} so far</span>` : ""}</div>
        <div class="row-side"><span title="${item.createdAt}">${relativeTime(item.createdAt)}</span></div>
      </div></li>`)}</ul>`}
    </section>`);
  await typeset(main);
}
