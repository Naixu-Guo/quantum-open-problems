/**
 * Discussion on any record: a thread of comments with replies, and a composer for people who
 * are signed in. A comment is one Comment record; posting one is a batch of one.
 */
import { html, mount, $, $$, toast, relativeTime } from "../lib/dom.js";
import { submitBatch } from "../lib/api.js";
import { signedIn, loginUrl, actorsById } from "../lib/session.js";
import { markdown, errorBox } from "./shared.js";
import { typeset } from "../lib/math.js";

function initial(name) {
  return (name || "?").trim().slice(0, 1).toUpperCase();
}

function comment(entry, actors, replies) {
  const who = actors.get(entry.createdBy)?.name ?? entry.createdBy;
  const kind = actors.get(entry.createdBy)?.kind;
  return html`<li class="comment" id="comment-${entry.id}">
    <span class="avatar" aria-hidden="true">${initial(who)}</span>
    <div>
      <div class="comment-head"><strong>${who}</strong>${kind && kind !== "human" ? html`<span class="chip outline">${kind}</span>` : ""}<span class="faint" title="${entry.createdAt}">${relativeTime(entry.createdAt)}</span>${entry.revision > 1 ? html`<span class="faint">edited</span>` : ""}</div>
      <div class="comment-body prose">${markdown(entry.body)}</div>
      ${signedIn() ? html`<div class="comment-actions"><button type="button" data-reply="${entry.id}">Reply</button></div>` : ""}
      ${replies.length ? html`<ul class="replies">${replies}</ul>` : ""}
    </div>
  </li>`;
}

/** Render a thread into `container` and wire the composer. `target` is `{ targetType, targetId }`. */
export async function renderDiscussion(container, target, comments, { onChange }) {
  const actors = await actorsById().catch(() => new Map());
  const byParent = new Map();
  for (const entry of comments) {
    const key = entry.parentCommentId ?? "";
    if (!byParent.has(key)) byParent.set(key, []);
    byParent.get(key).push(entry);
  }
  const sorted = (list) => [...list].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  const render = (parentId) => sorted(byParent.get(parentId ?? "") ?? []).map((entry) => comment(entry, actors, render(entry.id)));
  const roots = render(null);

  mount(container, html`
    ${roots.length ? html`<ul class="comments">${roots}</ul>` : html`<p class="muted">No comments yet.</p>`}
    ${signedIn()
      ? html`<form class="composer" id="composer">
          <input type="hidden" name="parentCommentId" value="">
          <div class="notice small" id="replying" hidden></div>
          <textarea name="body" placeholder="Add to the discussion. Markdown and TeX math work here." required></textarea>
          <div class="composer-foot"><span>Comments are records in the ledger, signed with your name.</span><button class="button primary" type="submit">Post comment</button></div>
          <div id="composer-error"></div>
        </form>`
      : html`<p class="muted small"><a href="${loginUrl()}" data-native>Sign in with GitHub</a> to join the discussion.</p>`}
  `);
  await typeset(container);

  const form = $("#composer", container);
  if (!form) return;
  for (const button of $$("[data-reply]", container)) {
    button.addEventListener("click", () => {
      form.parentCommentId.value = button.dataset.reply;
      const box = $("#replying", form);
      box.hidden = false;
      box.innerHTML = String(html`Replying to a comment. <button type="button" class="button small quiet" id="cancel-reply">Cancel</button>`);
      $("#cancel-reply", box).addEventListener("click", () => { form.parentCommentId.value = ""; box.hidden = true; });
      form.body.focus();
    });
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      await submitBatch([{ type: "Comment", targetType: target.targetType, targetId: target.targetId, parentCommentId: form.parentCommentId.value || null, promotedToContributionId: null, body: form.body.value.trim() }]);
      toast("Comment posted");
      await onChange();
    } catch (error) {
      mount($("#composer-error", form), errorBox(error));
      button.disabled = false;
    }
  });
}
