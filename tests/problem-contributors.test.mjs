import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderProblemPage } from "../site/lib/render.mjs";
import { renderRecord } from "../site/lib/tex.mjs";

const config = JSON.parse(fs.readFileSync(new URL("../site/config.json", import.meta.url), "utf8"));
const recordFiles = fs.readdirSync(new URL("../database/problems_json/", import.meta.url));
const source = JSON.parse(fs.readFileSync(new URL(`../database/problems_json/${recordFiles.find((name) => name.endsWith(".json"))}`, import.meta.url), "utf8"));
const dates = { today: "2026-09-08", created: "2026-09-01", updated: "2026-09-08", revisions: 1 };
const page = (contributors) => renderProblemPage({
  record: { ...renderRecord({ ...source, ...(contributors === undefined ? {} : { contributors }) }), dates },
  config, root: "../../", related: [], dates
});

test("a problem without explicit public contributor credit has no Contributors section", () => {
  for (const contributors of [undefined, [], [{ anonymous: true }], [{ name: "Undecided contributor" }], [{ name: "   ", anonymous: false }]]) {
    assert.doesNotMatch(page(contributors), /id="contributors"|id="contributors-title"/u);
  }
});

test("public contributors appear between References and Related problems with escaped names and affiliations", () => {
  const html = page([
    { name: "Example <Researcher>", affiliation: "Institute & Laboratory", anonymous: false },
    { anonymous: true },
    { name: "Second Researcher", anonymous: false }
  ]);
  const section = html.match(/<section[^>]+id="contributors"[\s\S]*?<\/section>/u)?.[0];
  assert.ok(section);
  assert.ok(html.indexOf('id="references"') < html.indexOf('id="contributors"'));
  assert.ok(html.indexOf('id="contributors"') < html.indexOf('id="related"'));
  assert.equal((section.match(/<li>/gu) ?? []).length, 2);
  assert.match(section, /Example &lt;Researcher&gt;/u);
  assert.match(section, /Institute &amp; Laboratory/u);
  assert.match(section, /Second Researcher/u);
  assert.doesNotMatch(section, /<Researcher>|Anonymous/iu);
});

test("a contributor's public credit is specific to each problem", () => {
  const publicCredit = { name: "Example Researcher", anonymous: false };
  const namedProblem = page([publicCredit]);
  const anonymousProblem = page([{ anonymous: true }]);
  assert.match(namedProblem, /id="contributors"/u);
  assert.match(namedProblem, /Example Researcher/u);
  assert.doesNotMatch(anonymousProblem, /id="contributors"|Example Researcher/u);
  assert.match(page([publicCredit]), /Example Researcher/u, "rendering an anonymous credit never changes another problem's preference");
});

test("an anonymous contributor is never rendered even if an unvalidated record includes their identity", () => {
  const html = page([{ name: "Private Researcher", affiliation: "Private Institute", email: "private@example.invalid", anonymous: true }]);
  assert.doesNotMatch(html, /id="contributors"|Private Researcher|Private Institute|private@example\.invalid/u);
});
