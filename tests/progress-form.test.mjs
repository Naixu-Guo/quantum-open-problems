import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { prepareProgressReport, publicProgressText, githubReportUrl, initProgressForm } from "../site/assets/progress-form.mjs";
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

function client({ online = false, draft, query = "?problem=op001", allowAnonymous = false, response, clipboardFails = false } = {}) {
  const element = extra => ({ value: "", checked: false, hidden: false, disabled: false, required: false, dataset: {}, listeners: {}, attributes: {}, textContent: "", addEventListener(name, handler) { this.listeners[name] = handler; }, setAttribute(name, value) { this.attributes[name] = value; }, removeAttribute(name) { delete this.attributes[name]; }, focus() { this.focused = true; }, select() { this.selected = true; }, scrollIntoView() {}, ...extra });
  const names = ["problemId", "kind", "updateType", "archivalLinks", "historicalUrl", "citation", "resultLocator", "relatedReportUrl", "summary", "name", "email", "affiliation", "consent", "extra", "captchaToken"];
  const controls = new Map(names.map(name => [name, element({ name })]));
  if (allowAnonymous) controls.set("anonymous", element());
  Object.assign(controls.get("problemId"), { options: [{ value: "" }, { value: "op001" }, { value: "op002" }] });
  const initial = { kind: "research", updateType: "partial", archivalLinks: source, summary: example().summary, name: "Ada", email: "private@example.org", affiliation: "Institute" };
  for (const [name, value] of Object.entries(initial)) controls.get(name).value = value;
  controls.get("consent").checked = true;
  const form = element({ dataset: { submitUrl: online ? "https://inbox.example/api/v1/research-updates" : "", repositoryUrl: config.repositoryUrl, allowAnonymous: String(allowAnonymous), contentLicense: "CC-BY-4.0", captchaProvider: "", captchaResponse: "" }, elements: { namedItem: name => controls.get(name) ?? null }, reset() { for (const control of controls.values()) { control.value = initial[control.name] ?? ""; control.checked = false; } } });
  const nodes = new Map([["#progress-form", form]]);
  for (const name of ["status", "research-fields", "historical-fields", "updateType-row", "submit", "copy", "open", "clear", "copy-fallback", "copy-text", "done", "receipt", ...names.map(name => `${name}-error`)]) nodes.set(`#progress-${name}`, element());
  nodes.get("#progress-done").hidden = true;
  const values = new Map(draft ? [["qiqcop-progress-draft", JSON.stringify(draft)]] : []);
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
  const sent = [], copied = [], navigations = [];
  initProgressForm({ document: { querySelector: id => nodes.get(id) }, window: { location: { search: query, assign: url => navigations.push(url) } }, storage,
    clipboard: { writeText: async text => { if (clipboardFails) throw new Error("denied"); copied.push(text); } },
    fetch: async (url, options) => { sent.push({ url, body: JSON.parse(options.body) }); if (response) return response(); return { ok: true, status: 201, json: async () => ({ received: true, id: "receipt-1" }) }; }
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
  c.controls.get("historicalUrl").value = original;
  assert.equal(c.nodes.get("#progress-research-fields").hidden, true);
  assert.equal(c.controls.get("historicalUrl").required, true);
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
