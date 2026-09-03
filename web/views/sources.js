/**
 * Pick a source: search the ledger's sources, or describe a new one. The controller's `value()`
 * is `{ sourceId, source }` for an existing source, `{ newSource }` for a described one, or
 * null when nothing is chosen. Fields use `data-field` rather than `name` so a picker can sit
 * inside a larger form without colliding with it.
 */
import { html, mount, $, $$ } from "../lib/dom.js";
import { get } from "../lib/api.js";
import { sourceLine } from "./shared.js";

const KINDS = ["paper", "preprint", "book", "problem-list", "thesis", "dataset", "web-record"];
const DATE = /^[0-9]{4}(-[0-9]{2}(-[0-9]{2})?)?$/;
let counter = 0;

export function sourcePicker(container) {
  const id = `picker-${++counter}`;
  mount(container, html`
    <div class="picker">
      <label for="${id}">Source</label>
      <input id="${id}" type="search" placeholder="Search the ledger by title, author, arXiv id, or DOI" autocomplete="off">
      <div class="picker-results" hidden></div>
    </div>
    <div class="picked" hidden></div>
    <details class="new-source">
      <summary class="small muted">Not in the ledger yet? Describe the source</summary>
      <div class="subitem">
        <div class="field"><label>Title</label><input data-field="title"></div>
        <div class="field-row">
          <div class="field"><label>Kind</label><select data-field="kind">${KINDS.map((k) => html`<option value="${k}">${k.replace("-", " ")}</option>`)}</select></div>
          <div class="field"><label>Date <span class="hint">YYYY or YYYY-MM-DD</span></label><input data-field="date" placeholder="2020"></div>
        </div>
        <div class="field"><label>Authors <span class="hint">comma-separated</span></label><input data-field="authors" placeholder="A. Author, B. Author"></div>
        <div class="field"><label>Venue</label><input data-field="venue" placeholder="Journal, volume, page (year), or arXiv:…"></div>
        <div class="field-row">
          <div class="field"><label>DOI</label><input data-field="doi" placeholder="10.1103/…"></div>
          <div class="field"><label>arXiv id</label><input data-field="arxivId" placeholder="2101.01234"></div>
          <div class="field"><label>URL</label><input data-field="url" placeholder="https://…"></div>
        </div>
      </div>
    </details>`);

  const search = $("input[type=search]", container);
  const results = $(".picker-results", container);
  const picked = $(".picked", container);
  const details = $("details", container);
  let chosen = null;
  let timer = null;

  const choose = (source) => {
    chosen = source;
    results.hidden = true;
    search.value = "";
    if (source) {
      mount(picked, html`<span>${sourceLine(source)}</span><button type="button" class="button small quiet">Change</button>`);
      picked.hidden = false;
      $("button", picked).addEventListener("click", () => choose(null));
      details.open = false;
    } else {
      picked.hidden = true;
      picked.innerHTML = "";
    }
  };

  search.addEventListener("input", () => {
    clearTimeout(timer);
    const text = search.value.trim();
    if (text.length < 2) { results.hidden = true; return; }
    timer = setTimeout(async () => {
      const found = await get(`/api/v1/sources?text=${encodeURIComponent(text)}&limit=8`).catch(() => ({ sources: [] }));
      mount(results, found.sources.length
        ? found.sources.map((s) => html`<button type="button" data-id="${s.id}">${sourceLine(s)}</button>`)
        : html`<button type="button" disabled>No source matches; describe it below.</button>`);
      results.hidden = false;
      for (const button of $$("button[data-id]", results)) button.addEventListener("click", () => choose(found.sources.find((s) => s.id === button.dataset.id)));
    }, 250);
  });
  search.addEventListener("blur", () => setTimeout(() => { results.hidden = true; }, 200));

  const fields = () => Object.fromEntries($$("[data-field]", container).map((el) => [el.dataset.field, el.value.trim()]));

  const described = () => {
    const v = fields();
    if (!v.title) return null;
    const authors = v.authors.split(",").map((a) => a.trim()).filter(Boolean);
    const completeness = authors.length && v.venue && v.date ? "complete" : authors.length || v.venue || v.date ? "partial" : "url-only";
    return { type: "Source", title: v.title, kind: v.kind, completeness, authors, venue: v.venue, date: v.date || null, doi: v.doi || null, arxivId: v.arxivId || null, url: v.url || null, version: null, body: "" };
  };

  return {
    value() {
      if (chosen) return { sourceId: chosen.id, source: chosen };
      const newSource = described();
      return newSource ? { newSource } : null;
    },
    /** Human-readable problems with the described source, empty when it is fine. */
    problems() {
      if (chosen) return [];
      const v = fields();
      const out = [];
      if (!v.title) out.push("Choose a source or give the new source a title.");
      if (v.date && !DATE.test(v.date)) out.push("The source date must be YYYY, YYYY-MM, or YYYY-MM-DD.");
      if (v.url && !/^https?:\/\//.test(v.url)) out.push("The source URL must start with http:// or https://.");
      return out;
    },
    title() { return chosen ? chosen.title : fields().title; },
  };
}
