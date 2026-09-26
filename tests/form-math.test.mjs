import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import "../site/assets/form-math.js";
import { texToHtml } from "../site/lib/tex.mjs";

const { parseMath, githubMath, bindMathPreview } = globalThis.QIQCOPFormMath;
const paragraph = fs.readFileSync(new URL("fixtures/issue-41-math.txt", import.meta.url), "utf8");
const expressions = source => parseMath(source).tokens.filter(token => token.type === "math").map(token => token.tex);

test("issue 41's seven expressions keep their exact TeX through GitHub export and website rendering", () => {
  const original = expressions(paragraph);
  assert.equal(original.length, 7);
  const exported = githubMath(paragraph);
  assert.equal((exported.match(/\$`/gu) ?? []).length, 7);
  assert.deepEqual(expressions(exported), original);
  assert.equal(githubMath(exported), exported, "already protected math is not wrapped twice");
  assert.deepEqual(parseMath(paragraph).diagnostics, []);
  const html = texToHtml(paragraph);
  for (const expression of original) assert.ok(html.includes(expression));
  assert.doesNotMatch(html, /<em>/u);
});

test("operators, norm delimiters, subscripts, multiline displays and row breaks survive JSON and GitHub export", () => {
  const source = String.raw`Inline $\operatorname{Tr}(\rho)=1$ and $\lVert A\rVert_\infty$.
\[
\begin{aligned}
a_1 &= b_2 \\
a_2 &= b_3
\end{aligned}
\]
$$
\sum_{i=1}^n x_i
$$
\(x_1\) and \begin{equation}a=b\end{equation}`;
  const saved = JSON.parse(JSON.stringify({ source })).source;
  assert.equal(saved, source);
  assert.deepEqual(parseMath(source).diagnostics, []);
  // Math fences append only a separating newline, never escape/strip commands.
  assert.deepEqual(expressions(githubMath(saved)).map(s => s.trim()), expressions(source).map(s => s.trim()));
  assert.equal(githubMath(githubMath(saved)), githubMath(saved));
  const windowsFence = "```math\r\nx_1=y_2\r\n```\r\n";
  assert.deepEqual(expressions(windowsFence), ["x_1=y_2\r\n"]);
  assert.equal(githubMath(windowsFence), windowsFence);
});

test("code examples, escaped dollars, and non-math backticks remain literal", () => {
  const source = String.raw`A literal \$5; example ` + '`$x_1$` and `` ` $y_2$ ``.\n'
    + '```tex\n$\\operatorname{Tr}(A)$\n```\n'
    + '~~~~\n$$not math$$\n~~~\n~~~~\n'
    + '    $indented_code$\n';
  assert.equal(githubMath(source), source);
  assert.deepEqual(expressions(source), []);
  assert.equal(githubMath(String.raw`Cost \$5 and math $x_1$.`), 'Cost \\$5 and math $`x_1`$.');
});

test("unmatched delimiters and likely JSON double escaping identify their source location without changing it", () => {
  const source = 'Line one\n' + String.raw`$\\operatorname{Tr}(A)$ then \[x_1`;
  const result = parseMath(source);
  assert.equal(result.tokens.map(token => token.raw).join(""), source);
  assert.equal(result.diagnostics.length, 2);
  assert.match(result.diagnostics[0].location, /line 2, column 1/u);
  assert.match(result.diagnostics[0].message, /double escaping/u);
  assert.match(result.diagnostics[1].message, /Unmatched/u);
  assert.match(parseMath(String.raw`x\)`).diagnostics[0].message, /no opening/u);
});

// Exercise failure/stale-result UI behavior without network access. Real MathJax
// rendering and GitHub recognition are also checked through the browser/API.
function previewClient(renderer) {
  const element = () => ({ textContent: "", className: "", childNodes: [], listeners: {}, hidden: false, disabled: false,
    append(node) { this.childNodes.push(node); }, replaceChildren(...nodes) { this.childNodes = nodes; },
    addEventListener(name, callback) { this.listeners[name] = callback; } });
  const button = element(), output = element(), control = element();
  control.value = String.raw`An expression $\operatorname{Tr}(A)=1$.`;
  const preview = bindMathPreview({ document: { createElement: element }, button, output, fields: [{ label: "Summary", control }], getMathJax: () => renderer });
  const messages = () => output.childNodes.filter(node => node.className === "form-error").map(node => node.textContent);
  return { button, output, control, preview, messages, click: () => button.listeners.click() };
}

test("unavailable MathJax leaves the draft intact and exposes a retry message", async () => {
  const c = previewClient(undefined), source = c.control.value;
  await c.click();
  assert.match(c.messages().join(" "), /could not load.*draft is unchanged/u);
  assert.equal(c.control.value, source);
  assert.equal(c.button.disabled, false);
});

test("MathJax errors identify the field and expression without treating them as a successful preview", async () => {
  const c = previewClient({ tex2svgPromise: async () => ({ querySelector: () => ({ getAttribute: () => "Undefined control sequence \\unknown" }) }) });
  c.control.value = String.raw`$\unknown{x}$`;
  await c.click();
  assert.match(c.messages()[0], /Summary, line 1, column 1.*unknown.*Check the command/u);
  assert.equal(c.control.value, String.raw`$\unknown{x}$`);
});

test("editing or clearing a preview prevents an in-flight rendering result from restoring stale formulas", async () => {
  let finish;
  const c = previewClient({ tex2svgPromise: () => new Promise(resolve => { finish = resolve; }) });
  const running = c.click();
  c.control.value = "An updated draft";
  c.control.listeners.input();
  finish({ querySelector: () => null });
  await running;
  assert.equal(c.output.hidden, true);
  assert.equal(c.output.childNodes.length, 0);
  assert.equal(c.button.disabled, false);
  assert.equal(c.control.value, "An updated draft");
});
