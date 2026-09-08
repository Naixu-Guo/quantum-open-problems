const $ = selector => document.querySelector(selector);
const labels = { new: "New", "in-review": "In review", accepted: "Accepted", rejected: "Rejected", spam: "Spam" };
let offset = 0;
let nextOffset = null;
let selected = null;
let requestId = 0;
let dirty = false;
const LIMIT = 25;
const date = value => new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
function notice(message = "", error = false) { $("#notice").textContent = message; $("#notice").dataset.error = String(error); }
function signedOut() {
  requestId++;
  $("#workspace").hidden = true; $("#logout").hidden = true; $("#login").hidden = false;
  $("#list").replaceChildren(); $("#detail").replaceChildren(); selected = null; dirty = false;
}
async function api(path, body) {
  const response = await fetch(path, {
    credentials: "same-origin", cache: "no-store",
    ...(body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  });
  const result = await response.json();
  if (!response.ok) {
    if (response.status === 401 && path !== "/inbox/login") signedOut();
    throw new Error(response.status === 429 ? "Too many attempts. Wait a few minutes and try again." : result.error || `Request failed (${response.status}). Try again.`);
  }
  return result;
}
function discardChanges() { return !dirty || window.confirm("Discard your unsaved review note and status changes?"); }
async function list() {
  const version = ++requestId;
  $("#workspace").setAttribute("aria-busy", "true");
  try {
    const filter = $("#state-filter").value;
    const data = await api(`/api/v1/submissions?limit=${LIMIT}&offset=${offset}${filter ? `&state=${encodeURIComponent(filter)}` : ""}`);
    if (version !== requestId) return;
    if (offset > 0 && offset >= data.total) { offset = 0; return await list(); }
    nextOffset = data.nextOffset;
    $("#state-filter").replaceChildren(...[["", "All proposals"], ...Object.entries(labels)].map(([value, label]) => {
      const option = el("option", `${label} (${value ? data.counts[value] : Object.values(data.counts).reduce((a, b) => a + b, 0)})`);
      option.value = value; return option;
    }));
    $("#state-filter").value = filter;
    $("#list-count").textContent = data.total ? `${offset + 1}–${offset + data.count} of ${data.total} proposals` : "0 proposals";
    $("#list").replaceChildren(...data.submissions.map(row => {
      const button = el("button", undefined, "proposal-row");
      button.type = "button"; button.dataset.id = row.id; button.setAttribute("aria-current", String(row.id === selected));
      button.append(el("strong", row.title), el("span", `${labels[row.state]} · ${row.contributor.name}`), el("span", date(row.receivedAt)));
      button.addEventListener("click", () => { if (discardChanges()) open(row.id).catch(error => notice(error.message, true)); });
      return button;
    }));
    if (!data.count) $("#list").append(el("p", filter ? "No proposals with this status." : "No proposals yet. New submissions from the website will appear here.", "empty"));
    $("#previous").disabled = offset === 0; $("#next").disabled = nextOffset === null;
  } finally { $("#workspace").removeAttribute("aria-busy"); }
}
async function open(id) {
  const version = ++requestId;
  notice("Loading proposal…");
  const data = await api(`/api/v1/submissions/${encodeURIComponent(id)}`);
  if (version !== requestId) return;
  selected = id; dirty = false;
  const detail = $("#detail");
  const title = el("h2", data.title); title.tabIndex = -1;
  const metadata = el("p", undefined, "proposal-meta");
  const showMetadata = () => { metadata.textContent = `${data.contributor.name}${data.contributor.affiliation ? ` · ${data.contributor.affiliation}` : ""}\n${data.contributor.email}\nReceived ${date(data.receivedAt)} · ${labels[data.state]}`; };
  showMetadata(); detail.replaceChildren(title, metadata);
  detail.append(el("p", `Fields: ${data.fields.join("; ")} · Topics: ${data.topics.join("; ")}`, "hint"));
  for (const [field, name] of [["statement", "Statement"], ["source", "Source"], ["progress", "Progress"], ["references", "References"], ["comment", "Contributor’s note"]]) {
    if (data.payload[field]) detail.append(el("h3", name), el("div", data.payload[field], "proposal-text"));
  }
  const review = el("form", undefined, "review-form");
  const heading = el("h3", "Review");
  const stateLabel = el("label", "Status"); stateLabel.htmlFor = "review-state";
  const state = el("select"); state.id = "review-state";
  for (const [value, label] of Object.entries(labels)) { const option = el("option", label); option.value = value; state.append(option); }
  state.value = data.state;
  const noteLabel = el("label", "Review note"); noteLabel.htmlFor = "review-note";
  const note = el("textarea"); note.id = "review-note"; note.maxLength = 2000; note.value = data.stateNote;
  const help = el("p", "Keep your assessment or paste an AI review here. Acceptance queues a proposal for publication; it does not change the catalog.", "hint");
  const save = el("button", "Save review", "button primary"); save.type = "submit";
  const download = el("button", "Export for AI (JSON)", "button"); download.type = "button";
  download.addEventListener("click", () => {
    // Only export on a user click. Contact email and request metadata stay in the project inbox.
    const { contributor, ...content } = data.payload;
    const packet = { schema: "qiqcop-zoo/proposal-review/1", id: data.id, receivedAt: data.receivedAt, state: state.value, reviewNote: note.value,
      proposal: { ...content, contributor: { name: contributor.name, affiliation: contributor.affiliation } } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2) + "\n"], { type: "application/json" }));
    const anchor = el("a"); anchor.href = url; anchor.download = `proposal-${data.id}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice("Export downloaded. The contributor’s email is omitted; nothing was sent to an AI service.");
  });
  const actions = el("div", undefined, "button-row"); actions.append(save, download);
  review.append(heading, stateLabel, state, noteLabel, note, help, actions);
  review.addEventListener("input", () => { dirty = true; });
  review.addEventListener("submit", async event => {
    event.preventDefault(); save.disabled = true; state.disabled = true; note.disabled = true; notice("Saving review…");
    try {
      const saved = await api(`/api/v1/submissions/${encodeURIComponent(id)}/state`, { state: state.value, note: note.value });
      data.state = saved.state; data.stateNote = saved.stateNote; showMetadata();
      dirty = false; await list(); notice("Review saved.");
    } catch (error) { notice(error.message, true); } finally { save.disabled = false; state.disabled = false; note.disabled = false; }
  });
  detail.append(review);
  for (const row of document.querySelectorAll(".proposal-row")) row.setAttribute("aria-current", String(row.dataset.id === id));
  notice(); title.focus();
}
async function showInbox() {
  $("#login").hidden = true; $("#workspace").hidden = false; $("#logout").hidden = false;
  await list(); notice();
}
$("#login").addEventListener("submit", async event => {
  event.preventDefault(); const button = $("#login button"); button.disabled = true; notice("Signing in…");
  const key = $("#access-key").value; $("#access-key").value = "";
  try { await api("/inbox/login", { key }); await showInbox(); }
  catch (error) { notice(error.message, true); } finally { button.disabled = false; }
});
$("#logout").addEventListener("click", async () => {
  if (!discardChanges()) return;
  try { await api("/inbox/logout", {}); signedOut(); notice("Signed out."); }
  catch (error) { notice(error.message, true); }
});
$("#state-filter").addEventListener("change", () => { offset = 0; list().catch(error => notice(error.message, true)); });
$("#refresh").addEventListener("click", () => list().then(() => notice("Inbox refreshed.")).catch(error => notice(error.message, true)));
$("#previous").addEventListener("click", () => { offset = Math.max(0, offset - LIMIT); list().catch(error => notice(error.message, true)); });
$("#next").addEventListener("click", () => { if (nextOffset !== null) { offset = nextOffset; list().catch(error => notice(error.message, true)); } });
window.addEventListener("beforeunload", event => { if (dirty) { event.preventDefault(); event.returnValue = ""; } });
// A restored back/forward page must re-check the session before showing private content.
window.addEventListener("pageshow", event => { if (event.persisted) location.reload(); });
try {
  const session = await api("/inbox/session");
  if (session.authenticated) await showInbox();
  else { signedOut(); notice(session.enabled ? "" : "Project inbox login is not configured yet.", !session.enabled); $("#login button").disabled = !session.enabled; }
} catch (error) { signedOut(); notice(`Cannot connect to the inbox. Reload this page to retry. ${error.message}`, true); }
