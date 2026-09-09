import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { renderContribute, renderAbout, PROPOSAL_LIMITS, CAPTCHA_WIDGETS } from "../site/lib/render.mjs";
import { loadTaxonomy } from "../site/lib/taxonomy.mjs";
import { LIMITS } from "../service/src/submissions.ts";

const config = JSON.parse(fs.readFileSync(new URL("../site/config.json", import.meta.url), "utf8"));
const taxonomy = loadTaxonomy(fileURLToPath(new URL("../database/tags.json", import.meta.url)));
const clientScript = fs.readFileSync(new URL("../site/assets/app.js", import.meta.url), "utf8");
const counts = { fieldCounts: new Map([[taxonomy.fields[0], 3]]), topicCounts: new Map([[taxonomy.topics[0], 2]]) };
const online = { ...config, contribute: { submissionUrl: "https://inbox.example.org/api/v1/submissions", captcha: { provider: "turnstile", siteKey: "1x00000000000000000000AA" } } };
const offline = { ...config, contribute: { submissionUrl: "", captcha: { provider: "turnstile", siteKey: "" } } };

test("basic protection enables the form explicitly without a third-party widget", () => {
  const basic = { ...online, contribute: { submissionUrl: online.contribute.submissionUrl, spamProtection: "basic" } };
  const html = renderContribute({ config: basic, root: "../", taxonomy, ...counts });
  assert.ok(!html.includes("proposal-offline"));
  assert.ok(!html.includes("challenges.cloudflare.com"));
  assert.ok(html.includes('id="proposal-submit">Send proposal'));
  assert.ok(html.includes('data-captcha-provider="" data-captcha-response=""'));
  const missingKey = renderContribute({ config: { ...online, contribute: { submissionUrl: online.contribute.submissionUrl } }, root: "../", taxonomy, ...counts });
  assert.ok(missingKey.includes('id="proposal-submit" disabled'));
});

test("the form's limits are the inbox's limits", () => {
  for (const [key, limit] of Object.entries(PROPOSAL_LIMITS)) assert.deepEqual(limit, LIMITS[key], `limit for ${key}`);
});

test("the page offers every field and topic in a dropdown with an Other option and carries the limits for the client", () => {
  const html = renderContribute({ config: online, root: "../", taxonomy, ...counts });
  const fieldSelect = html.match(/<select id="field-select"[\s\S]*?<\/select>/u)?.[0] ?? "";
  const topicSelect = html.match(/<select id="topic-select"[\s\S]*?<\/select>/u)?.[0] ?? "";
  for (const name of taxonomy.fields) assert.ok(fieldSelect.includes(`<option value="${name}">`), `field ${name}`);
  for (const name of taxonomy.topics) assert.ok(topicSelect.includes(`<option value="${name.replaceAll("&", "&amp;")}">`), `topic ${name}`);
  assert.ok(fieldSelect.includes(`>${taxonomy.fields[0]} (3)</option>`), "counts accompany the names");
  assert.ok(fieldSelect.endsWith(`<option value="__other__">Other: add a field of your own…</option>\n              </select>`), "Other comes last");
  assert.ok(topicSelect.includes(`<option value="__other__">Other: add a topic of your own…</option>`));
  assert.ok(!html.includes('type="checkbox" name="fields"') && !html.includes('type="checkbox" name="topics"'), "no checkbox grids remain");
  assert.ok(html.includes('data-picker="fields" data-kind="field" data-max="2"'));
  assert.ok(html.includes('data-picker="topics" data-kind="topic" data-max="5"'));
  assert.ok(html.includes('<input id="field-custom" type="text" maxlength="100"'), "a box for a name of the contributor's own");
  assert.ok(html.includes(`data-limits='${JSON.stringify(PROPOSAL_LIMITS).replaceAll('"', "&quot;")}'`));
  assert.ok(html.includes(`maxlength="${PROPOSAL_LIMITS.statement.max}"`));
  assert.ok(html.includes('name="extra"'), "the honeypot is present");
  assert.match(html, /<input id="proposal-name" name="name"[^>]*\brequired\b/u, "name remains required");
  assert.ok(html.includes('type="email" required'), "email is required");
  const affiliationInput = html.match(/<input id="proposal-affiliation"[^>]*>/u)?.[0] ?? "";
  assert.ok(affiliationInput.includes(`name="affiliation" type="text" maxlength="${LIMITS.affiliation.max}" autocomplete="organization"`), "affiliation has a named control and the server limit");
  assert.doesNotMatch(affiliationInput, /\brequired\b/u, "affiliation remains optional");
  assert.match(html, /<input(?=[^>]*\bid="proposal-anonymous")(?=[^>]*\bname="anonymous")(?=[^>]*\btype="checkbox")[^>]*>/u, "contributors can request anonymous public credit");
  assert.match(html, /<textarea id="proposal-statement"[^>]*><\/textarea>/u, "the example is not submitted as statement content");
  assert.match(html, /id="statement-placeholder"/u, "the empty statement offers a separate example");
  assert.ok(html.includes('name="consent"'), "consent is asked");
  assert.ok(html.includes('<a href="../contribute/" aria-current="page">Contribute</a>'), "the nav marks the page");
  assert.ok(html.includes('<a href="../contribute/">Contribute</a>'), "the footer links the page");
  assert.ok(!html.includes('about/#contribute">Contribute'), "the footer no longer sends contributors to the guide first");
});

test("with a submission URL and a site key the page loads the widget and enables sending", () => {
  const html = renderContribute({ config: online, root: "../", taxonomy, ...counts });
  assert.ok(html.includes(`<script src="${CAPTCHA_WIDGETS.turnstile.script}" async defer></script>`));
  assert.ok(html.includes(`<div class="cf-turnstile" data-sitekey="1x00000000000000000000AA" data-theme="auto"></div>`));
  assert.ok(html.includes('data-submit-url="https://inbox.example.org/api/v1/submissions"'));
  assert.ok(html.includes('data-captcha-provider="turnstile" data-captcha-response="cf-turnstile-response"'));
  assert.ok(html.includes('id="proposal-submit">Send proposal</button>'), "sending is enabled");
  assert.ok(!html.includes('id="proposal-offline"'));
  const hcaptcha = renderContribute({ config: { ...online, contribute: { ...online.contribute, captcha: { provider: "hcaptcha", siteKey: "key" } } }, root: "../", taxonomy, ...counts });
  assert.ok(hcaptcha.includes(`<script src="${CAPTCHA_WIDGETS.hcaptcha.script}" async defer></script>`));
  assert.ok(hcaptcha.includes('<div class="h-captcha" data-sitekey="key"'));
  assert.ok(hcaptcha.includes('data-captcha-response="h-captcha-response"'));
  assert.throws(() => renderContribute({ config: { ...online, contribute: { ...online.contribute, captcha: { provider: "recaptcha", siteKey: "key" } } }, root: "../", taxonomy, ...counts }), /contribute\.captcha\.provider/u);
});

test("without a submission URL the page keeps the form usable offline and never loads a third-party script", () => {
  const html = renderContribute({ config: offline, root: "../", taxonomy, ...counts });
  assert.ok(!html.includes("challenges.cloudflare.com"));
  assert.ok(!html.includes("hcaptcha.com"));
  assert.ok(html.includes('id="proposal-offline"'), "the offline notice explains the GitHub route");
  assert.ok(html.includes('id="proposal-submit" disabled>Send proposal</button>'), "sending is disabled");
  assert.ok(html.includes('id="proposal-copy">Copy as text</button>'), "copying is still offered");
  assert.ok(html.includes('data-submit-url="" data-captcha-provider="" data-captcha-response=""'));
  const missing = renderContribute({ config: { ...config, contribute: undefined }, root: "../", taxonomy, ...counts });
  assert.ok(missing.includes('id="proposal-offline"'), "a config without the block renders the offline form");
});

test("the about page advertises account-free sending only when the form is configured", () => {
  const options = { root: "../", stats: { total: 1, unsolved: 1, solved: 0, distinctQuestions: { total: 1, unsolved: 1, solved: 0 } }, dates: { today: "2026-09-08", updated: "2026-09-08" } };
  const off = renderAbout({ ...options, config: offline });
  assert.ok(off.includes('<a href="../contribute/">proposal worksheet</a>'));
  assert.ok(off.includes("a GitHub account is required"));
  assert.ok(!off.includes("No account is needed"));
  const on = renderAbout({ ...options, config: online });
  assert.ok(on.includes('<a href="../contribute/">proposal form</a>'));
  assert.ok(on.includes("No account is needed"));
});

// Run the shipped script with form controls, storage, clipboard, and timers that tests
// can drive directly, without making network requests or depending on a browser.
function createClientForm({ values = {}, draft, anonymous = false, respond = () => ({ ok: true, status: 201, json: async () => ({ accepted: true, id: "01TEST" }) }) } = {}) {
  const listeners = {};
  const element = (properties = {}) => ({
    dataset: {}, hidden: false, value: "", checked: false, disabled: false, textContent: "", listeners: {}, classList: { toggle() {}, add() {}, remove() {} },
    setAttribute() {}, focus() { this.focused = true; this.listeners.focus?.(); }, scrollIntoView() {}, addEventListener(event, listener) { this.listeners[event] = listener; },
    ...properties
  });
  const controls = new Map();
  const text = (name, value) => controls.set(name, element({ name, value }));
  text("title", "A proposal title"); text("statement", "A statement long enough to pass the minimum length."); text("source", "Src"); text("progress", ""); text("references", "Ref"); text("comment", ""); text("name", "Ada"); text("email", "ada@example.org"); text("affiliation", ""); text("extra", ""); text("cf-turnstile-response", "tok");
  controls.set("consent", element({ name: "consent", checked: true }));
  controls.set("anonymous", element({ name: "anonymous", checked: anonymous }));
  for (const [name, value] of Object.entries(values)) controls.get(name).value = value;
  // A picker: the select with its options, the row for a name of the contributor's own, and the list of pills.
  const pickerBox = (plural, kind, max, names) => {
    const select = element({ options: [{ value: "" }, ...names.map((value) => ({ value })), { value: "__other__" }] });
    const customInput = element();
    const addButton = element();
    const customRow = element({ hidden: true, querySelector: () => customInput });
    const list = element({ innerHTML: "" });
    const parts = new Map([["select", select], [".picker-custom", customRow], [".picker-chosen", list], ["[data-picker-add]", addButton], ["[data-picker-cancel]", element()]]);
    return { box: element({ dataset: { max: String(max), kind }, querySelector: (selector) => parts.get(selector) ?? null }), select, customInput, addButton, list, plural };
  };
  const fieldPicker = pickerBox("fields", "field", 2, ["Quantum algorithm", "Quantum metrology"]);
  const topicPicker = pickerBox("topics", "topic", 5, ["Bell nonlocality", "Quantum magic"]);
  const form = element({
    dataset: { submitUrl: "https://inbox.example.org/api/v1/submissions", captchaProvider: "turnstile", captchaResponse: "cf-turnstile-response", limits: JSON.stringify(PROPOSAL_LIMITS) },
    elements: { namedItem: (name) => controls.get(name) ?? null },
    querySelector: (selector) => (selector === '[data-picker="fields"]' ? fieldPicker.box : selector === '[data-picker="topics"]' ? topicPicker.box : null),
    querySelectorAll: () => [],
    reset() { for (const control of controls.values()) { control.value = ""; control.checked = false; } }
  });
  const statusLine = element();
  const submitButton = element();
  const ids = new Map([["#proposal-form", form], ["#proposal-status", statusLine], ["#proposal-submit", submitButton], ["#fields-count", element()], ["#topics-count", element()], ["#proposal-statement", controls.get("statement")], ["#statement-placeholder", element()], ["#proposal-anonymous", controls.get("anonymous")], ["#proposal-copy", element()], ["#proposal-clear", element()]]);
  ids.set("#proposal-done", element({ hidden: true }));
  ids.set("#proposal-receipt", element());
  const fetched = [];
  const document = element({
    body: { dataset: { root: "../" } }, documentElement: { dataset: { theme: "light" } },
    querySelector: (selector) => ids.get(selector) ?? null,
    querySelectorAll: () => [],
    addEventListener(event, listener) { listeners[event] = listener; }
  });
  const storage = new Map();
  if (draft) storage.set("qiqcop-proposal-draft", JSON.stringify(draft));
  const copied = [];
  const timers = new Map();
  let nextTimer = 0;
  vm.runInNewContext(clientScript, {
    document, location: { search: "", pathname: "/contribute/", hash: "" }, URLSearchParams, JSON, Object, Array, String, Boolean, Number, Promise, RegExp, Map, Set, console,
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    window: { setTimeout: (callback) => { timers.set(++nextTimer, callback); return nextTimer; }, clearTimeout: (id) => timers.delete(id), matchMedia: () => ({ matches: false }) },
    navigator: { clipboard: { writeText: async (text) => copied.push(text) } },
    fetch: async (url, init) => { fetched.push({ url, method: init.method, headers: init.headers, body: JSON.parse(init.body) }); return respond(); }
  });
  const choose = (picker, value) => { picker.select.value = value; picker.select.listeners.change(); };
  const flushTimers = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach((callback) => callback()); };
  return { controls, form, ids, storage, fetched, copied, fieldPicker, topicPicker, statusLine, choose, flushTimers };
}

test("the client script assembles a proposal from the form and checks it before sending", () => {
  const { controls, form, ids, fetched, fieldPicker, topicPicker, statusLine, choose } = createClientForm();
  assert.equal(ids.get("#fields-count").textContent, "0 of 2 chosen");
  assert.equal(ids.get("#topics-count").textContent, "0 of 5 chosen");
  // Pick a field from the dropdown, then a topic, then a topic of the contributor's own through "Other".
  choose(fieldPicker, "Quantum algorithm");
  assert.equal(ids.get("#fields-count").textContent, "1 of 2 chosen");
  assert.match(fieldPicker.list.innerHTML, /class="tag tag-field">Quantum algorithm<button type="button" class="tag-remove" data-remove="Quantum algorithm"/u, "a chosen field is a solid pill with a remove button");
  assert.equal(fieldPicker.select.value, "", "the dropdown returns to its placeholder");
  choose(fieldPicker, "quantum algorithm");
  assert.equal(ids.get("#fields-count").textContent, "1 of 2 chosen", "a name is chosen once, whatever its case");
  choose(topicPicker, "Bell nonlocality");
  choose(topicPicker, "__other__");
  assert.equal(topicPicker.customInput.hidden, false);
  assert.equal(topicPicker.customInput.focused, true, "Other opens the box for a name of the contributor's own");
  topicPicker.customInput.value = "  Rényi   entropies ";
  topicPicker.addButton.listeners.click();
  assert.equal(ids.get("#topics-count").textContent, "2 of 5 chosen");
  assert.match(topicPicker.list.innerHTML, /class="tag tag-topic tag-new">Rényi entropies <span class="tag-count">new<\/span>/u, "a name of the contributor's own is a dashed pill marked new");
  const submit = form.listeners.submit;
  assert.equal(typeof submit, "function");
  return submit({ preventDefault() {} }).then(async () => {
    assert.equal(fetched.length, 1, "a complete proposal is sent");
    assert.equal(fetched[0].url, "https://inbox.example.org/api/v1/submissions");
    assert.deepEqual(fetched[0].body, {
      title: "A proposal title", statement: "A statement long enough to pass the minimum length.", fields: ["Quantum algorithm"], newFields: [], topics: ["Bell nonlocality", "Rényi entropies"], newTopics: ["Rényi entropies"],
      source: "Src", progress: "", references: "Ref", comment: "", contributor: { name: "Ada", email: "ada@example.org", affiliation: "", anonymous: false }, consent: true, extra: "", captchaToken: "tok"
    });
    assert.equal(form.hidden, true, "the form gives way to the receipt");
    form.hidden = false;
    controls.get("email").value = "not an address";
    fieldPicker.list.listeners.click({ target: { closest: () => ({ dataset: { remove: "Quantum algorithm" } }) } });
    assert.equal(ids.get("#fields-count").textContent, "0 of 2 chosen", "the remove button takes a pill away");
    await submit({ preventDefault() {} });
    assert.equal(fetched.length, 1, "an incomplete proposal is not sent");
    assert.match(statusLine.textContent, /Choose at least one field/u);
    assert.match(statusLine.textContent, /valid email/u);
    assert.equal(statusLine.dataset.kind, "error");
    assert.equal(fieldPicker.select.focused, true, "the first problem gets focus");
  });
});

test("anonymous proposals still require a name and email and send them privately with the preference", async () => {
  const { controls, form, fetched, fieldPicker, topicPicker, statusLine, choose } = createClientForm({ anonymous: true });
  choose(fieldPicker, "Quantum algorithm");
  choose(topicPicker, "Bell nonlocality");
  controls.get("name").value = "";
  controls.get("email").value = "";
  await form.listeners.submit({ preventDefault() {} });
  assert.equal(fetched.length, 0, "anonymous credit does not bypass contact requirements");
  assert.match(statusLine.textContent, /Your name is required/u);
  assert.match(statusLine.textContent, /valid email/u);
  controls.get("name").value = "Ada";
  await form.listeners.submit({ preventDefault() {} });
  assert.equal(fetched.length, 0, "email is independently required");
  controls.get("email").value = "ada@example.org";
  await form.listeners.submit({ preventDefault() {} });
  assert.equal(fetched.length, 1);
  assert.deepEqual(fetched[0].body.contributor, { name: "Ada", email: "ada@example.org", affiliation: "", anonymous: true });
});

test("drafts restore full Unicode contact details and send them for either public credit preference", async () => {
  const values = { name: "  李明 Zoë García  ", email: "  zoe.garcia+research@example.org  ", affiliation: "  Université de Montréal; 北京大学  " };
  for (const anonymous of [false, true]) {
    const saved = createClientForm({ values, anonymous });
    saved.choose(saved.fieldPicker, "Quantum algorithm");
    saved.choose(saved.topicPicker, "Bell nonlocality");
    saved.form.listeners.input();
    saved.flushTimers();
    const draft = JSON.parse(saved.storage.get("qiqcop-proposal-draft"));
    const restored = createClientForm({ draft, values: { name: "", email: "", affiliation: "" } });
    for (const [name, value] of Object.entries(values)) assert.equal(restored.controls.get(name).value, value, `${name} survives draft restoration`);
    await restored.form.listeners.submit({ preventDefault() {} });
    assert.equal(restored.fetched.length, 1);
    assert.equal(restored.fetched[0].method, "POST");
    assert.equal(restored.fetched[0].headers["Content-Type"], "application/json");
    assert.deepEqual(restored.fetched[0].body.contributor, {
      name: values.name.trim(), email: values.email.trim(), affiliation: values.affiliation.trim(), anonymous
    });
  }
});

test("contact validation checks required values and all server length limits before sending", async () => {
  const cases = [
    ["name", " \t ", /Your name is required/u],
    ["name", "名".repeat(LIMITS.name.max + 1), /Your name is longer than 200 characters/u],
    ["email", " \t ", /valid email/u],
    ["email", "person@@example.org", /valid email/u],
    ["email", `${"a".repeat(LIMITS.email.max)}@example.org`, /Email is longer than 254 characters/u],
    ["affiliation", "校".repeat(LIMITS.affiliation.max + 1), /Affiliation is longer than 300 characters/u]
  ];
  for (const anonymous of [false, true]) {
    for (const [name, value, message] of cases) {
      const client = createClientForm({ values: { [name]: value }, anonymous });
      client.choose(client.fieldPicker, "Quantum algorithm");
      client.choose(client.topicPicker, "Bell nonlocality");
      await client.form.listeners.submit({ preventDefault() {} });
      assert.equal(client.fetched.length, 0, `invalid ${name} is not sent`);
      assert.match(client.statusLine.textContent, message);
      assert.equal(client.controls.get(name).focused, true);
      assert.equal(client.form.hidden, false);
    }
  }
  const client = createClientForm({ values: { name: "名".repeat(LIMITS.name.max), email: `${"a".repeat(LIMITS.email.max - "@example.org".length)}@example.org`, affiliation: "校".repeat(LIMITS.affiliation.max) } });
  client.choose(client.fieldPicker, "Quantum algorithm");
  client.choose(client.topicPicker, "Bell nonlocality");
  await client.form.listeners.submit({ preventDefault() {} });
  assert.equal(client.fetched.length, 1, "the exact contact length limits are accepted");
});

test("failed submissions keep the latest contact details immediately for retry", async () => {
  for (const respond of [
    () => ({ ok: false, status: 422, json: async () => ({ error: "please check your proposal" }) }),
    () => { throw new Error("network unavailable"); }
  ]) {
    const client = createClientForm({ anonymous: true, respond });
    client.choose(client.fieldPicker, "Quantum algorithm");
    client.choose(client.topicPicker, "Bell nonlocality");
    client.form.listeners.input();
    client.flushTimers();
    const values = { name: "李明 Zoë García", email: "zoe+review@example.org", affiliation: "Université de Montréal" };
    for (const [name, value] of Object.entries(values)) client.controls.get(name).value = value;
    client.form.listeners.input();
    await client.form.listeners.submit({ preventDefault() {} });
    const draft = JSON.parse(client.storage.get("qiqcop-proposal-draft"));
    for (const [name, value] of Object.entries(values)) assert.equal(draft.values[name], value, `latest ${name} is kept before the debounce timer runs`);
    assert.equal(draft.anonymous, true);
    assert.equal(client.form.hidden, false);
    assert.equal(client.ids.get("#proposal-done").hidden, true);
    assert.equal(client.ids.get("#proposal-submit").disabled, false);
    assert.equal(client.statusLine.dataset.kind, "error");
  }
});

test("a successful submission displays its receipt and pending saves cannot restore the submitted draft", async () => {
  const client = createClientForm({ values: { affiliation: "Université de Montréal" } });
  client.choose(client.fieldPicker, "Quantum algorithm");
  client.choose(client.topicPicker, "Bell nonlocality");
  client.form.listeners.input();
  await client.form.listeners.submit({ preventDefault() {} });
  assert.equal(client.form.hidden, true);
  assert.equal(client.ids.get("#proposal-done").hidden, false);
  assert.equal(client.ids.get("#proposal-done").focused, true);
  assert.equal(client.ids.get("#proposal-receipt").textContent, "01TEST");
  assert.equal(client.storage.has("qiqcop-proposal-draft"), false);
  client.flushTimers();
  assert.equal(client.storage.has("qiqcop-proposal-draft"), false, "a pending input event cannot recreate the submitted draft");
});

test("copied anonymous proposals omit contact details and record the public credit preference", async () => {
  const { controls, ids, copied } = createClientForm({ values: { affiliation: "Example University" } });
  await ids.get("#proposal-copy").listeners.click();
  assert.match(copied[0], /^Contributor: Ada <ada@example\.org> \(Example University\)$/mu);
  assert.match(copied[0], /^Public credit: Use contributor name$/mu);
  controls.get("anonymous").checked = true;
  await ids.get("#proposal-copy").listeners.click();
  assert.match(copied[1], /^Contributor: Anonymous$/mu);
  assert.match(copied[1], /^Public credit: Remain anonymous$/mu);
  assert.doesNotMatch(copied[1], /Ada|ada@example\.org|Example University/u);
  assert.match(copied[1], /A statement long enough to pass the minimum length\./u, "the proposal itself is retained");
});

test("drafts preserve the anonymous preference and older drafts default to named credit", () => {
  const saved = createClientForm({ anonymous: true });
  saved.form.listeners.change();
  saved.flushTimers();
  const draft = JSON.parse(saved.storage.get("qiqcop-proposal-draft"));
  assert.equal(draft.anonymous, true);
  const restored = createClientForm({ draft, values: { statement: "" } });
  assert.equal(restored.controls.get("anonymous").checked, true);
  assert.equal(restored.controls.get("statement").value, draft.values.statement);
  assert.equal(restored.ids.get("#statement-placeholder").hidden, true, "a restored statement does not show the example");
  restored.controls.get("anonymous").checked = false;
  restored.form.listeners.change();
  restored.flushTimers();
  assert.equal(JSON.parse(restored.storage.get("qiqcop-proposal-draft")).anonymous, false, "changing the preference updates the draft");
  const { anonymous: omitted, ...legacyDraft } = draft;
  const legacy = createClientForm({ draft: legacyDraft });
  assert.equal(legacy.controls.get("anonymous").checked, false);
});

test("the statement example disappears on focus, click, or input and clear restores the empty form", () => {
  const { controls, ids, form, storage, flushTimers } = createClientForm({ values: { statement: "" }, anonymous: true });
  const statement = controls.get("statement");
  const placeholder = ids.get("#statement-placeholder");
  assert.equal(placeholder.hidden, false);
  assert.equal(statement.value, "", "the example is separate from editable content");
  statement.focus();
  assert.equal(placeholder.hidden, true, "entering the statement field dismisses the example");
  statement.value = "A proposed mathematical question.";
  statement.listeners.input();
  form.listeners.input();
  flushTimers();
  assert.equal(placeholder.hidden, true);
  assert.ok(storage.has("qiqcop-proposal-draft"));
  ids.get("#proposal-clear").listeners.click();
  assert.equal(statement.value, "");
  assert.equal(placeholder.hidden, false, "Clear form restores the example");
  assert.equal(controls.get("anonymous").checked, false, "Clear form also clears anonymous credit");
  assert.equal(storage.has("qiqcop-proposal-draft"), false);
  statement.listeners.click();
  assert.equal(placeholder.hidden, true, "clicking an already focused field also dismisses the example");
  ids.get("#proposal-clear").listeners.click();
  statement.value = "Text entered without a preceding focus event.";
  statement.listeners.input();
  assert.equal(placeholder.hidden, true, "input also hides the example");
});
