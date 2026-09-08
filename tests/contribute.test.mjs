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

test("the form's limits are the inbox's limits", () => {
  for (const [key, limit] of Object.entries(PROPOSAL_LIMITS)) assert.deepEqual(limit, LIMITS[key], `limit for ${key}`);
});

test("the page offers every field and topic as a choice and carries the limits for the client", () => {
  const html = renderContribute({ config: online, root: "../", taxonomy, ...counts });
  for (const name of taxonomy.fields) assert.ok(html.includes(`<input type="checkbox" name="fields" value="${name}">`), `field ${name}`);
  for (const name of taxonomy.topics) assert.ok(html.includes(`<input type="checkbox" name="topics" value="${name.replaceAll("&", "&amp;")}">`), `topic ${name}`);
  assert.ok(html.includes(`<span class="choice-count">3</span>`), "counts accompany the names");
  assert.ok(html.includes(`data-limits='${JSON.stringify(PROPOSAL_LIMITS).replaceAll('"', "&quot;")}'`));
  assert.ok(html.includes(`maxlength="${PROPOSAL_LIMITS.statement.max}"`));
  assert.ok(html.includes('name="extra"'), "the honeypot is present");
  assert.ok(html.includes('type="email" required'), "email is required");
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

test("the about page and the problem page point at the form", () => {
  const about = renderAbout({ config, root: "../", stats: { total: 1, unsolved: 1, solved: 0, distinctQuestions: { total: 1, unsolved: 1, solved: 0 } }, dates: { today: "2026-09-08", updated: "2026-09-08" } });
  assert.ok(about.includes('<a href="../contribute/">proposal form</a>'));
});

// The shipped script must load on a page without the form, and on the form page it must
// build the proposal the inbox expects from the controls and refuse an incomplete one.
test("the client script assembles a proposal from the form and checks it before sending", () => {
  const listeners = {};
  const element = (properties = {}) => ({
    dataset: {}, hidden: false, value: "", checked: false, disabled: false, textContent: "", listeners: {}, classList: { toggle() {}, add() {}, remove() {} },
    setAttribute() {}, focus() { this.focused = true; }, scrollIntoView() {}, addEventListener(event, listener) { this.listeners[event] = listener; },
    ...properties
  });
  const controls = new Map();
  const text = (name, value) => controls.set(name, element({ name, value }));
  text("title", "A proposal title"); text("statement", "A statement long enough to pass the minimum length."); text("suggestedTopics", ""); text("source", "Src"); text("progress", ""); text("references", "Ref"); text("comment", ""); text("name", "Ada"); text("email", "ada@example.org"); text("affiliation", ""); text("extra", ""); text("cf-turnstile-response", "tok");
  controls.set("consent", element({ name: "consent", checked: true }));
  const box = (name, value, checked) => element({ name, value, checked });
  const fieldBoxes = [box("fields", "Quantum algorithm", true), box("fields", "Quantum metrology", false)];
  const topicBoxes = [box("topics", "Bell nonlocality", true), box("topics", "Quantum magic", false)];
  const form = element({
    dataset: { submitUrl: "https://inbox.example.org/api/v1/submissions", captchaProvider: "turnstile", captchaResponse: "cf-turnstile-response", limits: JSON.stringify(PROPOSAL_LIMITS) },
    elements: { namedItem: (name) => controls.get(name) ?? null },
    querySelectorAll: (selector) => (selector.includes('"fields"') ? fieldBoxes : selector.includes('"topics"') ? topicBoxes : []),
    reset() {}
  });
  const statusLine = element();
  const submitButton = element();
  const ids = new Map([["#proposal-form", form], ["#proposal-status", statusLine], ["#proposal-submit", submitButton], ["#fields-count", element()], ["#topics-count", element()]]);
  const fetched = [];
  const document = element({
    body: { dataset: { root: "../" } }, documentElement: { dataset: { theme: "light" } },
    querySelector: (selector) => ids.get(selector) ?? null,
    querySelectorAll: () => [],
    addEventListener(event, listener) { listeners[event] = listener; }
  });
  const storage = new Map();
  vm.runInNewContext(clientScript, {
    document, location: { search: "", pathname: "/contribute/", hash: "" }, URLSearchParams, JSON, Object, Array, String, Boolean, Number, Promise, RegExp, Map, Set, console,
    localStorage: { getItem: (key) => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    window: { setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }) }, navigator: {},
    fetch: async (url, init) => { fetched.push({ url, body: JSON.parse(init.body) }); return { ok: true, status: 201, json: async () => ({ accepted: true, id: "01TEST" }) }; }
  });
  assert.equal(ids.get("#fields-count").textContent, "1 of 2 chosen");
  assert.equal(ids.get("#topics-count").textContent, "1 of 5 chosen");
  const submit = form.listeners.submit;
  assert.equal(typeof submit, "function");
  return submit({ preventDefault() {} }).then(async () => {
    assert.equal(fetched.length, 1, "a complete proposal is sent");
    assert.equal(fetched[0].url, "https://inbox.example.org/api/v1/submissions");
    assert.deepEqual(fetched[0].body, {
      title: "A proposal title", statement: "A statement long enough to pass the minimum length.", fields: ["Quantum algorithm"], topics: ["Bell nonlocality"], suggestedTopics: "",
      source: "Src", progress: "", references: "Ref", comment: "", contributor: { name: "Ada", email: "ada@example.org", affiliation: "" }, consent: true, extra: "", captchaToken: "tok"
    });
    assert.equal(form.hidden, true, "the form gives way to the receipt");
    form.hidden = false;
    controls.get("email").value = "not an address";
    fieldBoxes[0].checked = false;
    await submit({ preventDefault() {} });
    assert.equal(fetched.length, 1, "an incomplete proposal is not sent");
    assert.match(statusLine.textContent, /Choose at least one field/u);
    assert.match(statusLine.textContent, /valid email/u);
    assert.equal(statusLine.dataset.kind, "error");
    assert.equal(fieldBoxes[0].focused, true, "the first problem gets focus");
  });
});
