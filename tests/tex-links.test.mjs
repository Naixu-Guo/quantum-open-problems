import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { texToHtml, renderRecord } from "../site/lib/tex.mjs";
import { recordToTex } from "../site/lib/record.mjs";
import vm from "node:vm";
import { layout, renderProblemPage } from "../site/lib/render.mjs";

const root = path.resolve(import.meta.dirname, "..");
const record = JSON.parse(fs.readFileSync(path.join(root, "database/problems_json/op_02bb8f8228649ac3.json")));

function bibliographyEntries(references) {
  const rendered = renderRecord({ ...record, references: [...record.references,
    ...references.map((tex, n) => ({ key: `fixture${n}`, label: `ref:fixture${n}`, tex }))] });
  const config = JSON.parse(fs.readFileSync(path.join(root, "site/config.json")));
  const dates = { today: "2026-11-27", created: "2026-11-27", updated: "2026-11-27", revisions: 1 };
  const page = renderProblemPage({ record: { ...rendered, dates }, config, root: "../../", related: [], dates });
  const section = page.match(/<section[^>]+id="references"[^>]*>(.*?)<\/section>/s)[1];
  return [...section.matchAll(/<dd>(.*?)<\/dd>/gs)].slice(-references.length).map(([, body]) => {
    const [, citation, buttons] = body.match(/^(.*?)<span class="reference-links">(.*?)<\/span>$/s);
    return { citation, text: citation.replace(/<[^>]+>/g, ""), prose: citation.replace(/<a\b[^>]*>.*?<\/a>/gs, "").replace(/<[^>]+>/g, ""),
      buttons, buttonText: buttons.replace(/<[^>]+>/g, "") };
  });
}

test("bibliographies display the cited arXiv number and revision across link formats", () => {
  const references = [
    [String.raw`Preprint, version~3. \href{https://arxiv.org/abs/2608.01909v3}{arXiv:2608.01909v3}.`, "2608.01909v3"],
    [String.raw`\href{https://arxiv.org/abs/2608.15870}{arXiv:2608.15870v2}.`, "2608.15870v2"],
    [String.raw`\href{https://arxiv.org/html/2603.18560v1#S1}{arXiv:2603.18560v1}.`, "2603.18560v1"],
    [String.raw`\href{https://arxiv.org/pdf/quant-ph/0501234v2.pdf}{Paper}.`, "quant-ph/0501234v2"],
    [String.raw`\href{https://doi.org/10.48550/arXiv.2403.10969}{doi:10.48550/arXiv.2403.10969}.`, "2403.10969"],
    [String.raw`arXiv:1206.1307. \href{https://arxiv.org/abs/1206.1307}{arXiv:1206.1307}.`, "1206.1307"],
    [String.raw`arXiv:2503.14660. \href{https://arxiv.org/html/2503.14660v3}{Version checked}.`, "2503.14660v3"],
    [String.raw`arXiv:2606.06287v2. \href{https://arxiv.org/abs/2606.06287}{Abstract}.`, "2606.06287v2"],
    [String.raw`\href{https://doi.org/10.48550/arXiv.2607.10765}{doi:10.48550/arXiv.2607.10765}. \href{https://arxiv.org/abs/2607.10765v1}{arXiv:2607.10765v1}.`, "2607.10765v1"]
  ];
  const entries = bibliographyEntries(references.map(([tex]) => tex));
  for (const [index, [, id]] of references.entries()) {
    const { citation, text, buttonText } = entries[index];
    assert.ok(text.includes(`arXiv:${id}`), `missing arXiv:${id} in citation text`);
    assert.doesNotMatch(citation, /<a\b/);
    assert.equal(text.split(id.replace(/v\d+$/, "")).length - 1, 1, text);
    assert.ok(buttonText.includes("arXiv") || buttonText.includes("DOI"));
    assert.doesNotMatch(buttonText, /\d/);
  }
});

test("Zenodo references show the full DOI in text and link the record button", () => {
  const id = "23215121";
  const doi = `10.5281/zenodo.${id}`;
  const url = `https://doi.org/${doi}`;
  const recordUrl = `https://zenodo.org/records/${id}`;
  const pdf = `${recordUrl}/files/proof.pdf?download=1`;
  const doiRef = `\\href{${url}}{doi:${doi}}`;
  const fileRef = `\\href{${pdf}}{Proof PDF}`;
  const arxivRef = String.raw`\href{https://arxiv.org/abs/2610.00112v1}{arXiv:2610.00112v1}`;
  const [preprint, versioned, collection, mixed, software, directOnly, otherDoi] = bibliographyEntries([
    `Author, “Paper,” Zenodo preprint (2026). ${doiRef}.`,
    `Author, “Paper,” preprint, version~1.0 (13 October 2026). ${doiRef}.`,
    `Archived in a collection. ${fileRef}; \\href{${url}}{collection doi:${doi}}.`,
    `Author, “Paper,” preprint (2026). ${arxivRef}; Zenodo manuscript v1.0.0 with proof supplement (2026), ${doiRef}.`,
    `Software archive, version~1.0.0 (2026). ${doiRef}.`,
    String.raw`\href{https://zenodo.org/record/23215121}{Manuscript}.`,
    String.raw`\href{https://doi.org/10.1234/zenodo.12345}{doi:10.1234/zenodo.12345}.`
  ]);
  for (const entry of [preprint, versioned, collection, mixed, software]) {
    assert.ok(entry.text.includes(doi));
    assert.doesNotMatch(entry.citation, /<a\b/);
    assert.equal(entry.text.split(id).length - 1, 1, entry.text);
    assert.ok(entry.buttons.includes(`href="${recordUrl}" rel="noreferrer" class="ref-link ref-zenodo">Zenodo</a>`));
    assert.doesNotMatch(entry.buttonText, /\d/);
  }
  assert.equal(preprint.text, `Author, “Paper.” Preprint (2026). ${doi}.`);
  assert.equal(preprint.buttonText, "Zenodo");
  assert.match(versioned.text, /Preprint, version&nbsp;1\.0 \(13 October 2026\)/);
  assert.ok(collection.buttons.includes(`href="${pdf}"`));
  assert.match(collection.text, /Proof PDF; collection DOI 10\.5281/);
  assert.match(mixed.text, /Preprint \(2026\)\. arXiv:2610\.00112v1\. Manuscript v1\.0\.0 with proof supplement/);
  assert.equal(mixed.buttonText, "arXivZenodo");
  assert.match(software.text, /Software archive, version&nbsp;1\.0\.0/);
  assert.equal(directOnly.buttonText, "Zenodo");
  assert.doesNotMatch(directOnly.citation, /10\.5281/);
  assert.equal(otherDoi.buttonText, "DOI");
});

test("arXiv preprints state the archive and a pinned revision once", () => {
  const ref = String.raw`\href{https://arxiv.org/abs/2608.01909v3}{arXiv:2608.01909v3}`;
  const [pinned, title, italicTitle] = bibliographyEntries([
    `Author, “Paper,” arXiv preprint, version~3 (2026). ${ref}.`,
    `Author, “An arXiv preprint (2026) in context,” Journal (2026). ${ref}.`,
    `Author, \\emph{arXiv preprint (2026)}, Journal (2026). ${ref}.`
  ]);
  assert.equal(pinned.text, "Author, “Paper.” Preprint (2026). arXiv:2608.01909v3.");
  assert.doesNotMatch(pinned.citation, /<a\b/);
  assert.equal(pinned.buttonText, "arXiv");
  assert.ok(pinned.buttons.includes('href="https://arxiv.org/abs/2608.01909v3"'));
  assert.match(title.prose, /An arXiv preprint \(2026\) in context/);
  assert.match(italicTitle.citation, /<em>arXiv preprint \(2026\)<\/em>/);
});

test("legacy arXiv identifiers remain plain citation text", () => {
  const [entry] = bibliographyEntries([
    String.raw`Author, “Paper,” arXiv preprint quant-ph/0410063 (2004). \href{https://arxiv.org/abs/quant-ph/0410063}{arXiv:quant-ph/0410063}.`
  ]);
  assert.doesNotMatch(entry.citation, /<a\b/);
  assert.equal(entry.text.split("quant-ph/0410063").length - 1, 1);
  assert.equal(entry.buttonText, "arXiv");
});

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
  for (const dir of ["site", "shared", "database"]) fs.cpSync(path.join(root, dir), path.join(temporary, dir), { recursive: true });
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
