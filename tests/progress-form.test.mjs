import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { prepareProgressReport, publicProgressText, githubReportUrl, initProgressForm, matchingProgressProblems } from "../site/assets/progress-form.mjs";
import { renderProgressContribute } from "../site/lib/render.mjs";
import { progressSubmissionsOnline } from "../site/lib/submission-settings.mjs";

const config = JSON.parse(fs.readFileSync(new URL("../site/config.json", import.meta.url), "utf8"));
const source = "https://arxiv.org/abs/2601.12345";
const original = "https://github.com/Naixu-Guo/quantum-open-problems/issues/1#issuecomment-123";
const example = () => ({ kind: "research", problemId: "op001", updateType: "partial", archivalLinks: [source], summary: "The cited manuscript reports a bound for a special case.", citation: "Research authors, manuscript title, 2026", contributor: { name: "Ada", email: "private@example.org", affiliation: "Institute", anonymous: false }, consent: true, contentLicense: "CC-BY-4.0" });
const check = report => prepareProgressReport(report, { problemIds: ["op001"] });

test("new progress requires a supported document link for every report type", () => {
  for (const updateType of ["resolution", "partial", "computation", "correction", "follow-up"]) {
    for (const archivalLinks of [[], [" "], ["https://github.com/Naixu-Guo/quantum-open-problems/issues/1"], ["https://example.org/proof.pdf"], ["https://arxiv.org/"]]) {
      assert.ok(check({ ...example(), updateType, archivalLinks }).errors.some(error => error.field === "archivalLinks"));
    }
    assert.deepEqual(check({ ...example(), updateType }).errors, [], "no peer-review requirement is invented");
  }
  assert.equal(check({ ...example(), archivalLinks: ["2601.12345v2"] }).report.archivalLinks[0], `${source}v2`);
});

test("historical requests need an original project report, not a manuscript or a new status", () => {
  const report = { ...example(), kind: "historical", archivalLinks: [], historicalUrl: original };
  assert.deepEqual(check(report).errors, []);
  assert.equal(check(report).report.historicalUrl, original);
  assert.ok(check({ ...report, historicalUrl: "https://github.com/elsewhere/repo/issues/1" }).errors.some(error => error.field === "historicalUrl"));
  assert.ok(check({ ...report, historicalUrl: "" }).errors.some(error => error.field === "historicalUrl"));
  assert.equal(Object.hasOwn(check(report).report, "status"), false);
});

test("public GitHub text and URLs exclude emails and anonymous names and affiliations", () => {
  for (const anonymous of [false, true]) {
    const report = example(); report.contributor.anonymous = anonymous;
    for (const text of [publicProgressText(report), decodeURIComponent(githubReportUrl(report, config.repositoryUrl))]) {
      assert.doesNotMatch(text, /private@example\.org/u);
      if (anonymous) assert.doesNotMatch(text, /Ada|Institute/u);
      else assert.match(text, /Ada/u);
    }
  }
  const url = new URL(githubReportUrl(example(), config.repositoryUrl));
  assert.equal(url.searchParams.get("archival_links"), source);
  assert.equal(url.searchParams.get("record_id"), "op001");
  assert.equal(url.searchParams.get("template"), "research-update.yml");
});

test("rendering keeps progress intake independently disabled until deployment is configured", () => {
  assert.equal(config.contribute.progressSubmissionUrl, "");
  assert.equal(progressSubmissionsOnline(config), false);
  const page = configuration => renderProgressContribute({ config: configuration, root: "../../", records: [{ id: "op001", title: { text: "An example problem" } }] });
  const offline = page(config);
  assert.match(offline, /id="progress-offline"/u);
  assert.match(offline, /data-submit-url=""/u);
  assert.match(offline, /name="archivalLinks"[^>]*required/u);
  assert.match(offline, /name="summary"[^>]*maxlength="1500"/u);
  assert.doesNotMatch(offline, /id="progress-anonymous"/u);
  assert.match(offline, /type="module" src="..\/..\/assets\/progress-form\.mjs/u);
  assert.doesNotMatch(offline, /challenges\.cloudflare\.com/u);
  const enabled = { ...config, contribute: { ...config.contribute, progressSubmissionUrl: "https://inbox.example/api/v1/research-updates", allowAnonymous: true } };
  assert.equal(progressSubmissionsOnline(enabled), true);
  const online = page(enabled);
  assert.doesNotMatch(online, /id="progress-offline"/u);
  assert.match(online, /id="progress-submit" disabled>Submit progress report/u, "no native GET submission before validation initializes");
  assert.match(online, /id="progress-anonymous"/u);
  assert.match(online, /received for documentation/u);
  assert.doesNotMatch(online, /Verified solution|Accepted research progress|editorial review/u);
});

function client({ online = false, draft, query = "?problem=op001", allowAnonymous = false, response, clipboardFails = false, clipboardResponse, requestTimeoutMs = 30_000, catalog = [{ id: "op001", title: "Quantum channel capacity" }, { id: "op002", title: "Quantum error correction" }] } = {}) {
  const element = extra => ({ value: "", checked: false, hidden: false, disabled: false, required: false, dataset: {}, listeners: {}, attributes: {}, children: [], textContent: "", replaceChildren(...children) { this.children = children; }, addEventListener(name, handler) { this.listeners[name] = handler; }, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; }, focus() { this.focused = true; }, select() { this.selected = true; }, scrollIntoView() {}, ...extra });
  const names = ["problemId", "problemSearch", "kind", "updateType", "archivalLinks", "historicalUrl", "citation", "resultLocator", "relatedReportUrl", "summary", "name", "email", "affiliation", "consent", "extra", "captchaToken"];
  const controls = new Map(names.map(name => [name, element({ name })]));
  if (allowAnonymous) controls.set("anonymous", element());
  const initial = { kind: "research", updateType: "partial", archivalLinks: source, summary: example().summary, name: "Ada", email: "private@example.org", affiliation: "Institute" };
  for (const [name, value] of Object.entries(initial)) controls.get(name).value = value;
  controls.get("consent").checked = true;
  const form = element({ dataset: { submitUrl: online ? "https://inbox.example/api/v1/research-updates" : "", repositoryUrl: config.repositoryUrl, allowAnonymous: String(allowAnonymous), contentLicense: "CC-BY-4.0", captchaProvider: "", captchaResponse: "" }, elements: { namedItem: name => controls.get(name) ?? null }, reset() { for (const control of controls.values()) { control.value = initial[control.name] ?? ""; control.checked = false; } } });
  const nodes = new Map([["#progress-form", form]]);
  for (const name of ["problem-catalog", "problem-options", "problem-matches", "status", "research-fields", "historical-fields", "updateType-row", "submit", "copy", "open", "clear", "copy-fallback", "copy-text", "done", "receipt", "draft-warning", ...names.map(name => `${name}-error`)]) nodes.set(`#progress-${name}`, element());
  form.elements[Symbol.iterator] = function* () { yield* controls.values(); for (const name of ["submit", "copy", "open", "clear"]) yield nodes.get("#progress-" + name); };
  nodes.get("#progress-problem-catalog").textContent = JSON.stringify(catalog);
  nodes.get("#progress-done").hidden = true;
  const values = new Map(draft ? [["qiqcop-progress-draft", JSON.stringify(draft)]] : []);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const sent = [], copied = [], navigations = [];
  initProgressForm({ document: { querySelector: id => nodes.get(id), createElement: () => element() }, window: { location: { search: query, assign: url => navigations.push(url) } }, storage, requestTimeoutMs,
    clipboard: { writeText: async text => { if (clipboardFails) throw new Error("denied"); if (clipboardResponse) await clipboardResponse(text); copied.push(text); } },
    fetch: async (url, options) => { sent.push({ url, body: JSON.parse(options.body) }); if (response) return response(url, options); return { ok: true, status: 201, json: async () => ({ received: true, id: "receipt-1" }) }; }
  });
  return { form, controls, nodes, sent, copied, values, navigations, submit: () => form.listeners.submit({ preventDefault() {} }), click: name => nodes.get(`#progress-${name}`).listeners.click() };
}

test("offline form blocks missing links on both Copy and Open GitHub and preserves the draft", async () => {
  const c = client();
  assert.equal(c.controls.get("problemId").value, "op001");
  c.controls.get("archivalLinks").value = "";
  await c.submit(); c.click("open");
  assert.equal(c.copied.length, 0); assert.equal(c.navigations.length, 0); assert.equal(c.sent.length, 0);
  assert.equal(c.controls.get("archivalLinks").focused, true);
  assert.equal(c.controls.get("archivalLinks").attributes["aria-invalid"], "true");
  assert.match(c.nodes.get("#progress-archivalLinks-error").textContent, /Add an eligible archival/u);
  assert.ok(c.values.has("qiqcop-progress-draft"));
  c.controls.get("archivalLinks").value = source;
  c.controls.get("email").value = "";
  await c.submit(); c.click("open");
  assert.equal(c.copied.length, 1); assert.equal(c.navigations.length, 1);
  assert.equal(c.nodes.get("#progress-done").hidden, true, "copying is never a submission receipt");
  assert.equal(c.sent.length, 0);
  assert.doesNotMatch(c.copied[0], /private@example/u);
});

test("historical mode prefill has no archival requirement and sends the original link", async () => {
  const c = client({ online: true, query: "?problem=op001&kind=historical" });
  c.controls.get("archivalLinks").value = "";
  assert.equal(c.nodes.get("#progress-research-fields").hidden, true);
  assert.equal(c.controls.get("historicalUrl").required, true);
  for (const historicalUrl of ["", "issues/1"]) {
    c.controls.get("historicalUrl").value = historicalUrl;
    await c.submit();
    assert.equal(c.sent.length, 0);
    assert.equal(c.controls.get("historicalUrl").focused, true);
    const message = c.nodes.get("#progress-historicalUrl-error").textContent;
    assert.match(message, /original GitHub issue/u);
    assert.doesNotMatch(message, /archival|manuscript|paper|DOI/u);
  }
  c.controls.get("historicalUrl").value = original;
  await c.submit();
  assert.equal(c.sent.length, 1);
  assert.equal(c.sent[0].body.kind, "historical");
  assert.equal(c.sent[0].body.historicalUrl, original);
  assert.deepEqual(c.sent[0].body.archivalLinks, []);
  assert.equal(Object.hasOwn(c.sent[0].body, "status"), false);
});

test("receipt requires the new endpoint response and success removes the saved draft", async () => {
  const c = client({ online: true });
  await c.submit();
  assert.equal(c.sent.length, 1);
  assert.equal(c.sent[0].body.contributor.email, "private@example.org");
  assert.equal(c.form.hidden, true);
  assert.equal(c.nodes.get("#progress-done").hidden, false);
  assert.equal(c.nodes.get("#progress-done").focused, true);
  assert.equal(c.nodes.get("#progress-receipt").textContent, "receipt-1");
  assert.equal(c.values.has("qiqcop-progress-draft"), false);
});

test("server validation errors, outages, and old proposal receipts retain the draft", async () => {
  const responses = [
    () => ({ ok: false, status: 422, json: async () => ({ error: "Missing source" }) }),
    () => ({ ok: false, status: 503, json: async () => ({ error: "Intake unavailable" }) }),
    () => ({ ok: true, status: 201, json: async () => ({ accepted: true, id: "legacy" }) }),
    () => { throw new Error("network"); }
  ];
  for (const response of responses) {
    const c = client({ online: true, response });
    await c.submit();
    assert.equal(c.form.hidden, false);
    assert.equal(c.nodes.get("#progress-done").hidden, true);
    assert.equal(c.nodes.get("#progress-submit").disabled, false);
    assert.equal(c.nodes.get("#progress-status").dataset.kind, "error");
    assert.ok(c.values.has("qiqcop-progress-draft"));
  }
});

test("saved anonymous drafts cannot silently become named credit on another deployment", async () => {
  const draft = { values: { problemId: "op002", summary: "Saved earlier summary", kind: "research", updateType: "partial", archivalLinks: source, name: "Private Name", email: "private@example.org", affiliation: "Private Place" }, anonymous: true };
  const c = client({ online: true, draft });
  assert.equal(c.controls.get("problemId").value, "op002", "link prefill does not move a restored report to a different problem");
  await c.submit(); await c.click("copy");
  assert.equal(c.sent.length, 0); assert.equal(c.copied.length, 0);
  assert.equal(JSON.parse(c.values.get("qiqcop-progress-draft")).anonymous, true);
  c.click("clear");
  assert.equal(c.values.has("qiqcop-progress-draft"), false);
});

test("clipboard failure provides selectable public text without losing the draft", async () => {
  const c = client({ clipboardFails: true });
  await c.submit();
  assert.equal(c.nodes.get("#progress-copy-fallback").hidden, false);
  assert.equal(c.nodes.get("#progress-copy-text").selected, true);
  assert.doesNotMatch(c.nodes.get("#progress-copy-text").value, /private@example/u);
  assert.ok(c.values.has("qiqcop-progress-draft"));
});

test("edits and Clear invalidate stale clipboard fallback and delayed copy feedback", async () => {
  let rejectCopy;
  const c = client({ clipboardResponse: () => new Promise((_resolve, reject) => { rejectCopy = reject; }) });
  const pending = c.submit();
  c.click("clear");
  rejectCopy(new Error("denied"));
  await pending;
  assert.equal(c.nodes.get("#progress-copy-fallback").hidden, true);
  assert.equal(c.nodes.get("#progress-copy-text").value, "");
  assert.match(c.nodes.get("#progress-status").textContent, /Form and saved draft cleared/u);
  assert.equal(c.values.has("qiqcop-progress-draft"), false);

  const edited = client({ clipboardFails: true, allowAnonymous: true });
  await edited.submit();
  assert.match(edited.nodes.get("#progress-copy-text").value, /Ada/u);
  edited.controls.get("anonymous").checked = true;
  edited.form.listeners.change();
  assert.equal(edited.nodes.get("#progress-copy-fallback").hidden, true);
  assert.equal(edited.nodes.get("#progress-copy-text").value, "");
  await edited.submit();
  assert.match(edited.nodes.get("#progress-copy-text").value, /Anonymous/u);
  assert.doesNotMatch(edited.nodes.get("#progress-copy-text").value, /Ada|Institute/u);
  edited.controls.get("summary").value = "Changed report";
  edited.form.listeners.input();
  assert.equal(edited.nodes.get("#progress-copy-text").value, "");

  let resolveCopy;
  const changed = client({ allowAnonymous: true, clipboardResponse: () => new Promise(resolve => { resolveCopy = resolve; }) });
  const earlierCopy = changed.submit();
  changed.controls.get("anonymous").checked = true;
  changed.form.listeners.change();
  resolveCopy();
  await earlierCopy;
  assert.doesNotMatch(changed.nodes.get("#progress-status").textContent, /Public report copied/u, "a completed OS copy cannot announce an obsolete report as current");
});

test("failed storage writes or removal never promise that current edits are saved or an older draft erased", async () => {
  const c = client({ online: true, response: () => ({ ok: false, status: 503, json: async () => ({ error: "Try later" }) }) });
  const older = JSON.stringify({ values: { problemId: "op002", summary: "Older saved draft" } });
  c.values.set("qiqcop-progress-draft", older);
  c.values.set = () => { throw new Error("QuotaExceededError"); };
  await c.submit();
  assert.equal(c.values.get("qiqcop-progress-draft"), older);
  assert.equal(c.controls.get("summary").value, example().summary);
  assert.match(c.nodes.get("#progress-status").textContent, /current edits may not be saved.*older draft may remain/u);
  assert.match(c.nodes.get("#progress-status").textContent, /Copy report for GitHub/u);
  assert.doesNotMatch(c.nodes.get("#progress-status").textContent, /draft is kept/u);
  c.click("open");
  assert.equal(c.navigations.length, 0);
  assert.match(c.nodes.get("#progress-status").textContent, /GitHub was not opened.*separate tab/u);
  await c.click("copy");
  assert.match(c.copied[0], /special case/u);
  assert.match(c.nodes.get("#progress-status").textContent, /storage is unavailable/u);
  c.values.delete = () => { throw new Error("SecurityError"); };
  c.click("clear");
  assert.equal(c.values.get("qiqcop-progress-draft"), older);
  assert.match(c.nodes.get("#progress-status").textContent, /saved draft could not be removed/u);
  assert.doesNotMatch(c.nodes.get("#progress-status").textContent, /Form and saved draft cleared/u);

  const received = client({ online: true });
  received.values.delete = () => { throw new Error("SecurityError"); };
  await received.submit();
  assert.equal(received.form.hidden, true);
  assert.equal(received.nodes.get("#progress-done").hidden, false);
  assert.equal(received.nodes.get("#progress-draft-warning").hidden, false, "cleanup failure stays visible in the receipt panel");
  assert.ok(received.values.has("qiqcop-progress-draft"));
});

test("problem lookup searches ID or title words, bounds suggestions, and stays empty until typing", () => {
  const catalog = Array.from({ length: 20 }, (_, index) => ({ id: "op_" + index, title: "Quantum channel " + index + " capacity" }));
  assert.deepEqual(matchingProgressProblems(catalog, ""), { matches: [], total: 0 });
  assert.deepEqual(matchingProgressProblems(catalog, "  "), { matches: [], total: 0 });
  const found = matchingProgressProblems(catalog, "QUANTUM capacity");
  assert.equal(found.total, 20); assert.equal(found.matches.length, 8);
  assert.equal(matchingProgressProblems(catalog, "op_12").matches[0].id, "op_12");
  assert.equal(matchingProgressProblems(catalog, "not present").total, 0);
});

test("lookup rendering has accessible controls and safely embeds catalog titles without a full select", () => {
  const title = "A </script><img src=x onerror=alert(1)> & title";
  const html = renderProgressContribute({ config, root: "../../", records: [{ id: "op001", title: { text: title } }] });
  assert.match(html, /name="problemSearch"[^>]*role="combobox"/u);
  assert.match(html, /aria-controls="progress-problem-options"/u);
  assert.match(html, /name="problemId" type="hidden"/u);
  assert.doesNotMatch(html, /<select id="progress-problemId"/u);
  assert.match(html, /id="progress-problem-options"[^>]*role="listbox"[^>]*hidden/u);
  const embedded = html.match(/id="progress-problem-catalog">([^<]*)<\/script>/u)[1];
  assert.equal(JSON.parse(embedded)[0].title, title);
  assert.doesNotMatch(html, /<img src=x/u);
});

const typeProblem = (c, text) => {
  c.controls.get("problemSearch").value = text;
  c.controls.get("problemSearch").listeners.input();
};
const problemKey = (c, key) => {
  let prevented = false;
  c.controls.get("problemSearch").listeners.keydown({ key, preventDefault() { prevented = true; } });
  return prevented;
};

test("combobox keyboard selection is canonical, edits clear stale IDs, and errors focus the visible input", async () => {
  const c = client({ online: true, query: "" });
  const search = c.controls.get("problemSearch");
  const list = c.nodes.get("#progress-problem-options");
  assert.equal(list.hidden, true); assert.equal(list.children.length, 0);
  search.listeners.focus();
  assert.equal(list.children.length, 0, "focusing an empty input never lists the catalog");
  typeProblem(c, "quantum");
  assert.equal(list.children.length, 2);
  assert.equal(search.attributes["aria-expanded"], "true");
  assert.equal(problemKey(c, "ArrowUp"), true);
  assert.equal(list.children[1].attributes["aria-selected"], "true");
  assert.equal(search.attributes["aria-activedescendant"], list.children[1].id);
  assert.equal(problemKey(c, "Enter"), true);
  assert.equal(c.controls.get("problemId").value, "op002");
  assert.match(search.value, /Quantum error correction/u);
  assert.equal(c.sent.length, 0, "Enter chooses a problem without submitting a report");
  assert.equal(list.hidden, true);
  problemKey(c, "ArrowDown");
  assert.equal(list.children.length, 1, "the complete selected label can reopen its matching item");
  problemKey(c, "Escape");
  assert.equal(list.hidden, true);
  assert.equal(search.attributes["aria-activedescendant"], undefined);
  typeProblem(c, "no such problem");
  assert.equal(c.controls.get("problemId").value, "");
  assert.equal(list.children.length, 0);
  assert.match(c.nodes.get("#progress-problem-matches").textContent, /No matching problems/u);
  await c.submit();
  assert.equal(c.sent.length, 0);
  assert.equal(search.focused, true);
  assert.equal(search.attributes["aria-invalid"], "true");
  assert.equal(c.controls.get("problemId").focused, undefined);
  assert.equal(JSON.parse(c.values.get("qiqcop-progress-draft")).values.problemId, "");
});

test("pointer selection and exact IDs work; clear removes the selection and search draft", async () => {
  const c = client({ online: true, query: "" });
  typeProblem(c, "channel");
  c.nodes.get("#progress-problem-options").children[0].listeners.click();
  assert.equal(c.controls.get("problemId").value, "op001");
  typeProblem(c, "OP002");
  assert.equal(c.controls.get("problemId").value, "op002", "case-insensitive exact ID resolves canonically");
  await c.submit();
  assert.equal(c.sent[0].body.problemId, "op002");
  assert.equal(Object.hasOwn(c.sent[0].body, "problemSearch"), false, "visible lookup text never changes the API contract");
  const cleared = client();
  cleared.click("clear");
  assert.equal(cleared.controls.get("problemId").value, "");
  assert.equal(cleared.controls.get("problemSearch").value, "");
  assert.equal(cleared.nodes.get("#progress-problem-options").children.length, 0);
  assert.equal(cleared.nodes.get("#progress-problem-options").hidden, true);
  assert.equal(cleared.values.has("qiqcop-progress-draft"), false);
});

test("legacy drafts and prefill stay selected while incomplete or edited drafts cannot inherit stale IDs", async () => {
  const legacy = client({ draft: { values: { problemId: "op002" } }, query: "?problem=op001&kind=historical" });
  assert.equal(legacy.controls.get("problemId").value, "op002");
  assert.match(legacy.controls.get("problemSearch").value, /op002 — Quantum error correction/u);
  assert.match(legacy.nodes.get("#progress-status").textContent, /saved draft for op002.*linked problem op001/u);
  assert.equal(legacy.controls.get("kind").value, "research", "query mode does not overwrite a saved report");
  const edited = client({ draft: { values: { problemId: "op002", problemSearch: "unfinished title search" } } });
  assert.equal(edited.controls.get("problemId").value, "");
  assert.equal(edited.controls.get("problemSearch").value, "unfinished title search");
  await edited.submit();
  assert.equal(edited.copied.length, 0);
  const removed = client({ draft: { values: { problemId: "op999" } } });
  assert.equal(removed.controls.get("problemId").value, "");
});

test("GitHub handoff preserves chosen scope in text and refuses overlong URLs without silently dropping fields", async () => {
  for (const [updateType, label] of [["resolution", "Reported resolution"], ["partial", "Partial progress"], ["computation", "Computational finding"], ["correction", "Research correction"], ["follow-up", "Follow-up publication"]]) {
    const url = new URL(githubReportUrl({ ...example(), updateType }, config.repositoryUrl));
    assert.ok(url.searchParams.get("summary").startsWith("Reported update type: " + label + "\n\n"));
    assert.ok(url.searchParams.get("summary").endsWith(example().summary));
  }
  const longSources = Array.from({ length: 10 }, (_, i) => "https://doi.org/10.1234/" + "a".repeat(800) + i);
  for (const changed of [{ citation: "字".repeat(2000) }, { summary: "字".repeat(1500) }, { archivalLinks: longSources }]) {
    const report = { ...example(), ...changed };
    assert.throws(() => githubReportUrl(report, config.repositoryUrl), /too long.*No fields were dropped/u);
    const c = client();
    for (const [field, text] of Object.entries(changed)) c.controls.get(field).value = Array.isArray(text) ? text.join("\n") : text;
    c.click("open");
    assert.equal(c.navigations.length, 0);
    assert.match(c.nodes.get("#progress-status").textContent, /Copy report for GitHub/u);
    assert.ok(c.values.has("qiqcop-progress-draft"));
    await c.click("copy");
    assert.equal(c.copied.length, 1, "the complete report is still available for manual handoff");
    assert.doesNotMatch(c.copied[0], /private@example.org/u);
    if (changed.archivalLinks) for (const link of longSources) assert.ok(c.copied[0].includes(link));
  }
});

test("pending sends prevent duplicate actions and draft clearing, then release controls on failure", async () => {
  let resolveResponse;
  const c = client({ online: true, response: () => new Promise(resolve => { resolveResponse = resolve; }) });
  const first = c.submit();
  assert.equal(c.form.attributes["aria-busy"], "true");
  assert.equal(c.controls.get("problemSearch").disabled, true);
  assert.equal(c.nodes.get("#progress-clear").disabled, true);
  const saved = c.values.get("qiqcop-progress-draft");
  c.click("clear"); c.click("open"); await c.click("copy"); await c.submit();
  assert.equal(c.sent.length, 1);
  assert.equal(c.values.get("qiqcop-progress-draft"), saved);
  assert.equal(c.copied.length, 0); assert.equal(c.navigations.length, 0);
  resolveResponse({ ok: false, status: 503, json: async () => ({ error: "Retry later" }) });
  await first;
  assert.equal(c.controls.get("problemSearch").disabled, false);
  assert.equal(c.nodes.get("#progress-clear").disabled, false);
  assert.equal(c.form.attributes["aria-busy"], undefined);
  assert.equal(c.values.get("qiqcop-progress-draft"), saved);
});

test("timeout preserves the draft and a successful response cannot erase a newer draft", async () => {
  const timed = client({ online: true, requestTimeoutMs: 5, response: (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new Error("aborted")));
  }) });
  await timed.submit();
  assert.match(timed.nodes.get("#progress-status").textContent, /timed out.*No receipt was received/u);
  assert.equal(timed.nodes.get("#progress-submit").disabled, false);
  assert.ok(timed.values.has("qiqcop-progress-draft"));
  let resolveResponse;
  const c = client({ online: true, response: () => new Promise(resolve => { resolveResponse = resolve; }) });
  const pending = c.submit();
  const newer = JSON.stringify({ values: { problemId: "op002", summary: "New draft from another tab" } });
  c.values.set("qiqcop-progress-draft", newer);
  resolveResponse({ ok: true, status: 201, json: async () => ({ received: true, id: "receipt-1" }) });
  await pending;
  assert.equal(c.values.get("qiqcop-progress-draft"), newer);
});
