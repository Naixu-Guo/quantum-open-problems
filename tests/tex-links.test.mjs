import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { texToHtml, renderRecord } from "../site/lib/tex.mjs";
import { recordToTex } from "../site/lib/record.mjs";
import vm from "node:vm";
import { layout } from "../site/lib/render.mjs";

const root = path.resolve(import.meta.dirname, "..");
const record = JSON.parse(fs.readFileSync(path.join(root, "database/problems_json/op_02bb8f8228649ac3.json")));

test("records cannot define macros or aliases that evade link validation", () => {
  const payloads = [
    String.raw`\newcommand{\h}{\href}\h{javascript:alert(1)}{x}`,
    String.raw`\let\h\href \h{javascript:alert(1)}{x}`,
    ...["newcommand", "renewcommand", "providecommand", "def", "gdef", "edef", "xdef", "let", "futurelet", "csname", "DeclareMathOperator", "newenvironment", "renewenvironment"].map(name => `\\${name}{x}{y}`),
    "\\new% comment joins the command\n  command{\\h}{x}",
  ];
  for (const payload of payloads) {
    for (const tex of [`$${payload}$`, `\\[${payload}\\]`, `\\begin{equation}${payload}\\end{equation}`]) {
      assert.throws(() => texToHtml(tex), /Macro definitions and aliases are not allowed/);
    }
  }
  const bad = `$${payloads[0]}$`;
  for (const key of ["title", "statement", "source", "comment"]) assert.throws(() => renderRecord({ ...record, [key]: bad }), /Macro definitions and aliases/);
  assert.throws(() => renderRecord({ ...record, progress: [bad] }), /Macro definitions and aliases/);
  assert.throws(() => renderRecord({ ...record, references: [{ ...record.references[0], tex: bad }] }), /Macro definitions and aliases/);
  assert.match(texToHtml(String.raw`$\operatorname{Tr}(\rho)=1$`), /operatorname/);
});

test("both MathJax clients filter URLs and reject user CSS, classes, and IDs", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "site/config.json")));
  const site = layout({ config, root: "./", title: "Safety fixture", description: "", path: "", body: "" });
  const web = fs.readFileSync(path.join(root, "web/index.html"), "utf8");
  for (const html of [site, web]) {
    const script = html.match(/window\.MathJax\s*=\s*\{[\s\S]*?<\/script>/u)[0].replace(/<\/script>$/u, "");
    const window = {};
    vm.runInNewContext(script, { window });
    const settings = window.MathJax;
    assert.ok(settings.loader.load.includes("ui/safe"));
    assert.equal(settings.options.safeOptions.allow.URLs, "safe");
    for (const name of ["classes", "cssIDs", "styles"]) assert.equal(settings.options.safeOptions.allow[name], "none");
    for (const name of ["javascript", "data", "file"]) assert.equal(settings.options.safeOptions.safeProtocols[name], false);
    for (const name of ["http", "https"]) assert.equal(settings.options.safeOptions.safeProtocols[name], true);
  }
});
test("external TeX links allow only absolute HTTP(S) URLs, including inside mathematics", () => {
  for (const url of ["http://example.org/a", "HTTPS://example.org/a?q=1&x=2#part"]) {
    for (const link of [`\\href{${url}}{a paper}`, `\\url{${url}}`]) assert.match(texToHtml(link), /<a href=/);
  }
  for (const url of ["javascript:alert(1)", "JaVaScRiPt:alert(1)", "java\nscript:alert(1)", "data:text/html,script", "file:///tmp/x", "ftp://example.org", "//example.org", "#part", "https://", "https://example.org\\x"]) {
    for (const link of [`\\href{${url}}{x}`, `\\url{${url}}`]) {
      for (const tex of [link, `$${link}$`, `\\[${link}\\]`]) assert.throws(() => texToHtml(tex), /absolute http/);
    }
  }
  assert.match(texToHtml("\\href{https://example.org/?a=1\\&b=2}{safe}"), /a=1&amp;b=2/);
});

test("every authored section and stripped identifier links go through the URL gate", () => {
  const bad = "\\href{javascript:alert(1)}{x}";
  for (const key of ["title", "statement", "source", "comment"]) {
    assert.throws(() => renderRecord({ ...record, [key]: bad }), /absolute http/);
  }
  assert.throws(() => renderRecord({ ...record, progress: [bad] }), /absolute http/);
  const references = [{ ...record.references[0], tex: "\\href{javascript:alert(1)//doi.org/10.5555/test}{x}" }];
  assert.throws(() => renderRecord({ ...record, references }), /absolute http/);
});

test("an unsafe catalog URL fails the build before publishing HTML or Markdown packets", (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "qop-link-build-"));
  t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
  for (const dir of ["site", "database"]) fs.cpSync(path.join(root, dir), path.join(temporary, dir), { recursive: true });
  const unsafe = { ...record, comment: "\\url{javascript:alert(1)}" };
  fs.writeFileSync(path.join(temporary, "database/problems_json", `${record.id}.json`), JSON.stringify(unsafe));
  fs.writeFileSync(path.join(temporary, "database/problems_tex", `${record.id}.tex`), recordToTex(unsafe));
  const output = path.join(temporary, "dist");
  fs.mkdirSync(output);
  fs.writeFileSync(path.join(output, "previous.txt"), "Previously published output");
  const result = spawnSync(process.execPath, [path.join(temporary, "site/build.mjs")], { encoding: "utf8" });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /absolute http/);
  assert.deepEqual(fs.readdirSync(output), ["previous.txt"]);
});
