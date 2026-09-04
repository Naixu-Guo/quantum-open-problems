import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { renderDirectory } from "../site/lib/render.mjs";

const config = JSON.parse(fs.readFileSync(new URL("../site/config.json", import.meta.url), "utf8"));
const clientScript = fs.readFileSync(new URL("../site/assets/app.js", import.meta.url), "utf8");
const record = (id, title, updated, created) => ({
  id, title: { text: title, html: title }, status: "Unsolved", statusSlug: "unsolved",
  dates: { updatedAt: `2026-09-04T12:00:${updated}.000Z`, createdAt: `2026-09-03T10:00:${created}.000Z` },
  fields: [], topics: [], statement: { text: "A problem statement.", html: "<p>A problem statement.</p>" }
});
const records = [
  record("op_001", "Alpha older batch entry", "01", "01"),
  record("op_004", "Bravo exact time tie", "01", "02"),
  record("op_005", "Charlie earlier edit", "00", "03"),
  record("op_002", "Yankee newer batch entry", "01", "02"),
  record("op_003", "Zulu latest edit", "02", "00")
];
const expected = ["op_003", "op_002", "op_004", "op_001", "op_005"];
const html = renderDirectory({ config, root: "../", records, fieldCounts: new Map(), topicCounts: new Map() });

const renderedRows = () => Array.from(html.matchAll(/<li class="problem-row[^>]+>/g), ([tag]) => ({
  dataset: Object.fromEntries(Array.from(tag.matchAll(/data-([a-z]+)="([^"]*)"/g), ([, key, value]) => [key, value]))
}));

test("the catalog initially renders edits to the second, then creation time, then stable ID", () => {
  const rows = renderedRows();
  assert.deepEqual(rows.map((row) => row.dataset.id), expected);
  assert.equal(rows[0].dataset.updated, "2026-09-04T12:00:02.000Z");
  assert.equal(rows[1].dataset.created, "2026-09-03T10:00:02.000Z");
});

// Exercise the shipped script against the attributes emitted by the renderer.
// DOM movement and filter events are enough here; no browser dependency is needed.
function loadCatalog(search = "") {
  const element = (properties = {}) => ({
    dataset: {}, listeners: {}, classList: { toggle() {} },
    setAttribute() {}, addEventListener(event, listener) { this.listeners[event] = listener; },
    ...properties
  });
  const rows = renderedRows().reverse();
  const list = element({
    querySelectorAll: () => rows,
    append(row) { rows.splice(rows.indexOf(row), 1); rows.push(row); }
  });
  const sort = element({ options: ["updated", "title", "status"].map((value) => ({ value })) });
  const clear = element();
  const field = element({ dataset: { field: "all" } });
  const topic = element({ options: [{ value: "all" }] });
  const elements = new Map([["#problem-list", list], ["#sort-filter", sort], ["#clear-filters", clear], ["#topic-filter", topic]]);
  const location = { search, pathname: "/problems/", hash: "" };
  const document = element({
    body: { dataset: { root: "../" } }, documentElement: { dataset: { theme: "light" } },
    querySelector: (selector) => elements.get(selector) ?? null,
    querySelectorAll: (selector) => selector === ".filter-panel [data-field]" ? [field] : []
  });
  vm.runInNewContext(clientScript, {
    document, window: {}, location, URLSearchParams,
    history: { replaceState(_state, _title, url) { location.search = new URL(url, "https://example.test").search; } }
  });
  return { ids: () => rows.map((row) => row.dataset.id), sort, clear, location };
}

test("browser initialization and filter reset preserve newest-first ordering at second precision", () => {
  const catalog = loadCatalog();
  assert.deepEqual(catalog.ids(), expected);
  assert.equal(catalog.sort.value, "updated");
  catalog.sort.value = "title";
  catalog.sort.listeners.change();
  assert.deepEqual(catalog.ids(), records.map((entry) => entry.id));
  assert.equal(catalog.location.search, "?sort=title");
  catalog.clear.listeners.click();
  assert.deepEqual(catalog.ids(), expected);
  assert.equal(catalog.location.search, "");
});

test("an explicit title sort remains available while invalid sort links use newest first", () => {
  assert.deepEqual(loadCatalog("?sort=title").ids(), records.map((entry) => entry.id));
  assert.deepEqual(loadCatalog("?sort=invalid").ids(), expected);
});
