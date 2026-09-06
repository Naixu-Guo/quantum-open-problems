/**
 * Rendering helpers shared by the views. `html` is a template tag that escapes every
 * interpolated value; `raw` marks a string that is already markup. Views build a string and
 * hand it to `mount`, then wire behaviour with plain listeners.
 */

class Markup {
  constructor(text) { this.text = text; }
  toString() { return this.text; }
}

export const raw = (text) => new Markup(String(text));

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

function render(value) {
  if (value instanceof Markup) return value.text;
  if (Array.isArray(value)) return value.map(render).join("");
  if (value === null || value === undefined || value === false) return "";
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = "";
  strings.forEach((chunk, index) => {
    out += chunk;
    if (index < values.length) out += render(values[index]);
  });
  return new Markup(out);
}

/** Replace the contents of an element with rendered markup (a template result, or a list of them) and return it. */
export function mount(element, markup) {
  element.innerHTML = render(markup);
  return element;
}

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function formatDate(iso) {
  if (!iso) return "";
  return String(iso).slice(0, 10);
}

export function relativeTime(iso, now = Date.now()) {
  if (!iso) return "";
  const seconds = Math.round((now - Date.parse(iso)) / 1000);
  if (!Number.isFinite(seconds)) return formatDate(iso);
  if (seconds < 0) return "just now";
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [name, size] of units) {
    if (Math.abs(seconds) >= size) {
      const count = Math.round(seconds / size);
      return `${count} ${name}${count === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}

export function shortId(id) {
  return id ? `${String(id).slice(0, 6)}…${String(id).slice(-4)}` : "";
}

/** Words with hyphens become readable labels: "problem-proposal" -> "problem proposal". */
export function label(value) {
  return String(value ?? "").replace(/-/g, " ");
}

let toastTimer = null;
export function toast(message, kind = "info") {
  const element = document.getElementById("toast");
  if (!element) return;
  element.textContent = message;
  element.dataset.kind = kind;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, kind === "error" ? 8000 : 3500);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast("Copied");
  } catch {
    toast("Copy failed; select the text instead", "error");
  }
}

/** Turn a title into a slug that fits the contract's alias pattern: letters lose their accents, everything else becomes a hyphen. */
export function slugify(text) {
  const plain = String(text).normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
  return plain.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80).replace(/-+$/g, "");
}

/** A random id for idempotency keys; `randomUUID` exists only in secure contexts, `getRandomValues` everywhere. */
export function randomId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
