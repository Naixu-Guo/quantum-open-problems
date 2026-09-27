const $ = selector => document.querySelector(selector);
const proposalLabels = { new: "New", "in-review": "In review", accepted: "Accepted", rejected: "Rejected", spam: "Spam" };
const progressLabels = { received: "Received", "needs-details": "Needs details", documented: "Documented", duplicate: "Duplicate", "outside-scope": "Outside scope" };
const labels = { ...proposalLabels, ...progressLabels };
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
function capacity(data) {
  const status = $("#capacity-status");
  if (!data) { status.textContent = "Capacity could not be loaded. Refresh the inbox to retry."; return; }
  status.dataset.state = data.state;
  status.textContent = data.state === "full" ? "New submissions are paused: an inbox limit has been reached. Existing submissions are preserved."
    : data.state === "warning" ? "An inbox limit is at least 80% used. Review capacity before it fills up."
    : "The inbox is accepting new submissions.";
  const number = value => Number(value).toLocaleString();
  const mib = value => (value / 1048576).toLocaleString(undefined, { maximumFractionDigits: 2 });
  $("#capacity-usage").textContent = `${number(data.hour.used)} / ${number(data.hour.limit)} attempts this hour${data.hour.resetsAt ? ` (resets ${date(data.hour.resetsAt)})` : ""} · ${number(data.rows.used)} / ${number(data.rows.limit)} submissions stored · ${mib(data.storage.usedBytes)} / ${mib(data.storage.limitBytes)} MiB storage.`;
  const previous = $("#capacity-last-alert");
  previous.hidden = !data.lastAlert;
  if (data.lastAlert) previous.textContent = `Last alert: ${data.lastAlert.level === "full" ? "limit reached" : "80% warning"}, ${date(data.lastAlert.at)}. Hourly limits reset automatically. For stored proposals or storage limits, ask the server maintainer to archive old entries or increase capacity. Marking an entry spam does not free storage.`;
}
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
function discardChanges() { return !dirty || window.confirm("Discard your unsaved handling note and state changes?"); }
async function list() {
  const version = ++requestId;
  $("#workspace").setAttribute("aria-busy", "true");
  try {
    const filter = $("#state-filter").value;
    const data = await api(`/api/v1/submissions?limit=${LIMIT}&offset=${offset}${filter ? `&state=${encodeURIComponent(filter)}` : ""}`);
    if (version !== requestId) return;
    if (offset > 0 && offset >= data.total) { offset = 0; return await list(); }
    nextOffset = data.nextOffset;
    capacity(data.capacity);
    $("#state-filter").replaceChildren(...[["", "All submissions"], ...Object.entries(labels)].map(([value, label]) => {
      const option = el("option", `${label} (${value ? data.counts[value] : Object.values(data.counts).reduce((a, b) => a + b, 0)})`);
      option.value = value; return option;
    }));
    $("#state-filter").value = filter;
    $("#list-count").textContent = data.total ? `${offset + 1}–${offset + data.count} of ${data.total} submissions` : "0 submissions";
    $("#list").replaceChildren(...data.submissions.map(row => {
      const button = el("button", undefined, "proposal-row");
      button.type = "button"; button.dataset.id = row.id; button.setAttribute("aria-current", String(row.id === selected));
      button.append(el("strong", row.title), el("span", (row.kind === "historical" ? "Historical listing · " : row.kind ? "Progress report · " : "") + `${labels[row.state]} · ${row.contributor.name}${row.contributor.anonymous ? " · Anonymous requested" : ""}`), el("span", date(row.receivedAt)));
      button.addEventListener("click", () => { if (discardChanges()) open(row.id).catch(error => notice(error.message, true)); });
      return button;
    }));
    if (!data.count) $("#list").append(el("p", filter ? "No submissions with this state." : "No submissions yet. New submissions from the website will appear here.", "empty"));
    $("#previous").disabled = offset === 0; $("#next").disabled = nextOffset === null;
  } finally { $("#workspace").removeAttribute("aria-busy"); }
}
async function open(id) {
  const version = ++requestId;
  notice("Loading submission…");
  const data = await api(`/api/v1/submissions/${encodeURIComponent(id)}`);
  if (version !== requestId) return;
  selected = id; dirty = false;
  const progress = data.payload.researchUpdate;
  const stateLabels = progress ? progressLabels : proposalLabels;
  const detail = $("#detail");
  const title = el("h2", data.title); title.tabIndex = -1;
  const metadata = el("p", undefined, "proposal-meta");
  const showMetadata = () => { metadata.textContent = `${data.contributor.name}${data.contributor.affiliation ? ` · ${data.contributor.affiliation}` : ""}\n${data.contributor.email}\nReceived ${date(data.receivedAt)} · ${labels[data.state]}`; };
  showMetadata(); detail.replaceChildren(title, metadata);
  detail.append(el("p", data.contributor.anonymous
    ? "Anonymous publication requested. Keep the contributor’s name, email, and affiliation private."
    : "The contributor may be named publicly. Their email remains private.", "hint"));
  if (!progress) detail.append(el("p", `Fields: ${data.fields.join("; ")} · Topics: ${data.topics.join("; ")}`, "hint"));
  detail.append(el("p", data.payload.contentLicense === "CC-BY-4.0"
    ? "Content license: CC BY 4.0 for the contributor’s original text. Check third-party material separately."
    : "Content license not recorded. Confirm permission before publishing the original text under CC BY 4.0.", "hint"));
  for (const [field, name] of progress ? [] : [["statement", "Statement"], ["source", "Source"], ["progress", "Progress"], ["references", "References"], ["comment", "Contributor’s note"]]) {
    if (data.payload[field]) detail.append(el("h3", name), el("div", data.payload[field], "proposal-text"));
  }
  if (progress) {
    detail.append(el("p", "Problem: " + progress.problemId + " · Reported scope: " + progress.updateType, "hint"));
    detail.append(el("p", "This is a documentary report. The team does not referee proofs. Inbox handling does not publish an entry or change Solved/Unsolved status.", "hint"));
    if (progress.kind === "historical") detail.append(el("p", "The incoming historical request does not establish provenance: confirm the original report date and specific pre-policy content before listing it, and record the corresponding catalog update in the handling note. A new claim requires its own archival manuscript link.", "hint"));
    for (const [field, name] of [["summary", "Report summary"], ["citation", "Citation"], ["resultLocator", "Result location"]]) {
      if (progress[field]) detail.append(el("h3", name), el("div", progress[field], "proposal-text"));
    }
    for (const [name, urls] of [["Archival manuscript or paper links", progress.archivalLinks], ["Original GitHub report", [progress.historicalUrl]], ["Related report", [progress.relatedReportUrl]]]) {
      const links = urls.filter(Boolean);
      if (!links.length) continue;
      detail.append(el("h3", name));
      for (const url of links) { const link = el("a", url); link.href = url; link.rel = "noopener noreferrer"; detail.append(link, el("br")); }
    }
  }
  if (!progress && data.payload.archivalLinks?.length) detail.append(el("h3", "Known progress archival links"), el("div", data.payload.archivalLinks.join("\n"), "proposal-text"));
  const review = el("form", undefined, "review-form");
  const heading = el("h3", progress ? "Documentation handling" : "Review");
  const stateLabel = el("label", progress ? "Handling state" : "Status"); stateLabel.htmlFor = "review-state";
  const state = el("select"); state.id = "review-state";
  for (const [value, label] of Object.entries(stateLabels)) { const option = el("option", label); option.value = value; state.append(option); }
  state.value = data.state;
  const noteLabel = el("label", progress ? "Documentation note" : "Review note"); noteLabel.htmlFor = "review-note";
  const note = el("textarea"); note.id = "review-note"; note.maxLength = 2000; note.value = data.stateNote;
  const help = el("p", progress ? "Record citation details, attribution, duplicates, and historical provenance. Documented means the report has been recorded through the catalog workflow; it does not certify correctness. The maintainer team determines problem status separately." : "Keep your proposal assessment here. Acceptance queues a proposal for publication; it does not change the catalog.", "hint");
  const save = el("button", progress ? "Save handling note" : "Save review", "button primary"); save.type = "submit";
  const download = el("button", progress ? "Export report (JSON)" : "Export for AI (JSON)", "button"); download.type = "button";
  download.addEventListener("click", () => {
    // Only export on a user click. Contact email and request metadata stay in the project inbox.
    const { contributor, ...content } = data.payload;
    const packet = { schema: progress ? "qiqcop-zoo/progress-documentation/1" : "qiqcop-zoo/proposal-review/1", id: data.id, receivedAt: data.receivedAt, state: state.value, ...(progress ? { documentationNote: note.value } : { reviewNote: note.value }),
      proposal: { ...content, contributor: { name: contributor.anonymous ? "Anonymous" : contributor.name, affiliation: contributor.anonymous ? "" : contributor.affiliation, anonymous: contributor.anonymous === true } } };
    const url = URL.createObjectURL(new Blob([JSON.stringify(packet, null, 2) + "\n"], { type: "application/json" }));
    const anchor = el("a"); anchor.href = url; anchor.download = (progress ? "progress-" : "proposal-") + `${data.id}.json`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    notice("Export downloaded. The contributor’s email is omitted; nothing was sent to an AI service.");
  });
  const actions = el("div", undefined, "button-row"); actions.append(save, download);
  review.append(heading, stateLabel, state, noteLabel, note, help, actions);
  review.addEventListener("input", () => { dirty = true; });
  review.addEventListener("submit", async event => {
    event.preventDefault(); save.disabled = true; state.disabled = true; note.disabled = true; notice("Saving handling note…");
    try {
      const saved = await api(`/api/v1/submissions/${encodeURIComponent(id)}/state`, { state: state.value, note: note.value });
      data.state = saved.state; data.stateNote = saved.stateNote; showMetadata();
      dirty = false; await list(); notice("Handling note saved.");
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
// Refresh aggregate capacity without replacing an unsaved handling note.
setInterval(async () => {
  if (document.hidden || $("#workspace").hidden) return;
  try { capacity(await api("/inbox/capacity")); }
  catch { if (!$("#workspace").hidden) $("#capacity-status").textContent = "Capacity update failed. Refresh the inbox to retry."; }
}, 60_000);
try {
  const session = await api("/inbox/session");
  if (session.authenticated) await showInbox();
  else { signedOut(); notice(session.enabled ? "" : "Project inbox login is not configured yet.", !session.enabled); $("#login button").disabled = !session.enabled; }
} catch (error) { signedOut(); notice(`Cannot connect to the inbox. Reload this page to retry. ${error.message}`, true); }
