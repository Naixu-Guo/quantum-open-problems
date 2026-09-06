/** Small pieces several pages use: chips, rows, source lines, dialogs, error boxes. */
import { html, raw, label, formatDate, relativeTime, $, copyText } from "../lib/dom.js";
import { renderMarkdown, inline, excerpt } from "../lib/markdown.js";
import { cached, ApiError } from "../lib/api.js";

export const markdown = (text, options) => raw(renderMarkdown(text ?? "", options));
export const inlineMarkup = (text) => raw(inline(text ?? ""));
export { excerpt, formatDate, relativeTime };

export const chip = (value, extra = "") => html`<span class="chip ${String(value).toLowerCase()} ${extra}">${label(value)}</span>`;

/** A problem's chip: its status once published; otherwise where it stands in the catalog. */
export function statusChip(problem) {
  const state = problem.catalogState ?? "published";
  if (state === "candidate") return html`<span class="chip candidate" title="Proposed; awaits admission by review">candidate</span>`;
  if (state === "merged") return html`<span class="chip merged" title="Merged into another problem">merged</span>`;
  if (state === "retired") return html`<span class="chip retired" title="Retired from the catalog">retired</span>`;
  return chip(problem.status ?? "Unsolved");
}

export const problemPath = (problem) => `/problems/${problem.alias ?? problem.aliases?.[0] ?? problem.id}`;

export async function taxonomy() {
  const view = await cached("/api/v1/taxonomy");
  const areas = new Map(view.areas.map((area) => [area.id, area]));
  const topics = new Map(view.topics.map((topic) => [topic.id, topic]));
  return { ...view, areaLabel: (id) => areas.get(id)?.label ?? label(id), topicLabel: (id) => topics.get(id)?.label ?? label(id) };
}

export function problemRow(problem, tax) {
  return html`<li><div class="row">
    <a class="row-title" href="${problemPath(problem)}">${inlineMarkup(problem.title)}</a>
    <div class="row-meta">
      ${statusChip(problem)}
      ${problem.role === "auxiliary" ? html`<span class="chip outline">auxiliary</span>` : ""}
      ${(problem.areaIds ?? []).map((id) => html`<a class="tag" href="/problems?area=${id}">${tax.areaLabel(id)}</a>`)}
      ${(problem.topicIds ?? []).map((id) => html`<a class="tag" href="/problems?topic=${id}">${tax.topicLabel(id)}</a>`)}
      ${problem.difficulty && problem.difficulty !== "unrated" ? html`<span class="faint">${label(problem.difficulty)}</span>` : ""}
    </div>
    <div class="row-side">
      ${problem.lastActivity ? html`<span title="Last activity ${problem.lastActivity}">${relativeTime(problem.lastActivity)}</span>` : ""}
    </div>
  </div></li>`;
}

/** Where a source can be opened: its URL when it is a web address, else its DOI or arXiv page. */
export function sourceHref(source) {
  if (!source) return null;
  if (typeof source.url === "string" && /^https?:\/\//i.test(source.url)) return source.url;
  if (source.doi) return `https://doi.org/${source.doi}`;
  if (source.arxivId) return `https://arxiv.org/abs/${source.arxivId}`;
  return null;
}

/** One line for a source: authors, title (linked when asked and we can), venue and year. */
export function sourceLine(source, { link = true } = {}) {
  if (!source) return html`<span class="muted">unknown source</span>`;
  if (source.redacted) return html`<span class="muted">redacted source</span>`;
  const href = link ? sourceHref(source) : null;
  const authors = (source.authors ?? []).join(", ");
  const title = href ? html`<a class="ref-title" href="${href}" rel="noopener">${inlineMarkup(source.title)}</a>` : html`<span class="ref-title">${inlineMarkup(source.title)}</span>`;
  const venue = source.venue ? html`<span class="ref-meta"> · ${source.venue}</span>` : source.date ? html`<span class="ref-meta"> · ${source.date}</span>` : "";
  const arxiv = source.arxivId && !String(source.venue ?? "").includes(source.arxivId) ? html`<span class="ref-meta"> · arXiv:${source.arxivId}</span>` : "";
  return html`${authors ? html`<span class="ref-authors">${authors}. </span>` : ""}${title}${venue}${arxiv}`;
}

/** Open a modal with the given body markup. Returns the dialog; it removes itself when closed. */
export function openDialog(title, body) {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = String(html`<div class="dialog-head"><h2>${title}</h2><button class="dialog-close" type="button" aria-label="Close">×</button></div><div class="dialog-body">${body}</div>`);
  document.body.append(dialog);
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => dialog.remove());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.showModal();
  return dialog;
}

/** A box explaining why a write failed, with the validator's issues when there are any. */
export function errorBox(error) {
  const details = error instanceof ApiError ? error.details : [];
  const hint = error instanceof ApiError && error.status === 401 ? " Sign in first." : error instanceof ApiError && error.status === 429 ? " The rate limit for your account was reached; try again later." : "";
  return html`<div class="notice error" role="alert"><strong>${error.message}</strong>${hint}${details.length ? html`<ul>${details.map((line) => html`<li>${line}</li>`)}</ul>` : ""}</div>`;
}

/** A button that copies `text`; wire it after the markup is in the document. */
export function copyButton(text, caption = "Copy") {
  const id = `copy-${Math.random().toString(36).slice(2, 8)}`;
  queueMicrotask(() => document.getElementById(id)?.addEventListener("click", () => copyText(text)));
  return html`<button class="button small" type="button" id="${id}">${caption}</button>`;
}

export function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const k = key(item);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(item);
  }
  return groups;
}
