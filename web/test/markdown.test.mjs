import test from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, inline, excerpt } from "../lib/markdown.js";

test("blocks: headings with offset, paragraphs, lists, quotes, rules, fenced code", () => {
  const out = renderMarkdown("## Notation\n\nFirst line\nsecond line.\n\n- one\n- two *em*\n\n1. a\n2. b\n\n> quoted\n\n---\n\n```js\nlet x = 1 < 2;\n```", { headingOffset: 1 });
  assert.match(out, /<h3>Notation<\/h3>/);
  assert.match(out, /<p>First line second line\.<\/p>/);
  assert.match(out, /<ul><li>one<\/li><li>two <em>em<\/em><\/li><\/ul>/);
  assert.match(out, /<ol><li>a<\/li><li>b<\/li><\/ol>/);
  assert.match(out, /<blockquote><p>quoted<\/p><\/blockquote>/);
  assert.match(out, /<hr>/);
  assert.match(out, /<pre><code class="language-js">let x = 1 &lt; 2;<\/code><\/pre>/);
});

test("a loose list stays one list; a different marker starts a new one", () => {
  const out = renderMarkdown("1. first\n\n2. second\n\n- other");
  assert.equal((out.match(/<ol>/g) ?? []).length, 1, out);
  assert.match(out, /<ol><li>first<\/li><li>second<\/li><\/ol>\n<ul><li>other<\/li><\/ul>/);
});

test("tables keep math cells intact and escape everything else", () => {
  const out = renderMarkdown("| Symbol | Meaning |\n|---|---|\n| $\\rho^\\Gamma$ | Partial transpose of $\\rho$ |\n| $a_1 * b_2$ | <b>not bold</b> |");
  assert.match(out, /<table><thead><tr><th>Symbol<\/th><th>Meaning<\/th><\/tr><\/thead>/);
  assert.match(out, /<span class="math">\$\\rho\^\\Gamma\$<\/span>/);
  assert.match(out, /<span class="math">\$a_1 \* b_2\$<\/span>/, "underscores and stars inside math are not emphasis");
  assert.match(out, /&lt;b&gt;not bold&lt;\/b&gt;/);
  assert.doesNotMatch(out, /<b>/);
});

test("math: display blocks, inline spans, environments, and dollars that are not math", () => {
  const out = renderMarkdown("Setup:\n$$\n\\rho = \\frac{1}{d}\n$$\nwhere $d \\ge 2$ and it costs $5 or $10, i.e. \\$5.");
  assert.match(out, /<div class="math-display">\$\$\n\\rho = \\frac\{1\}\{d\}\n\$\$<\/div>/);
  assert.match(out, /<span class="math">\$d \\ge 2\$<\/span>/);
  assert.equal((out.match(/<span class="no-math">\$<\/span>/g) ?? []).length, 3, "lone dollars are kept away from MathJax");
  const matrix = inline("$H=\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}$ and $$\\begin{aligned}a&=b\\end{aligned}$$");
  assert.equal(matrix, '<span class="math">$H=\\frac{1}{\\sqrt{2}}\\begin{pmatrix}1&amp;1\\\\1&amp;-1\\end{pmatrix}$</span> and <span class="math">$$\\begin{aligned}a&amp;=b\\end{aligned}$$</span>', "an environment inside math stays inside it");
  assert.doesNotMatch(matrix, /\u0000/);
});

test("TeX environments inside a paragraph stay literal for MathJax", () => {
  const out = renderMarkdown("Define the set by\n\\begin{equation}\n  A := \\left\\{ \\lambda_1 : x_{m,n} \\right\\}.\n  \\label{eq:a}\n\\end{equation}\nThe task is Eq.~\\eqref{eq:a}.");
  assert.ok(out.includes('<span class="math">\\begin{equation}\n  A := \\left\\{ \\lambda_1 : x_{m,n} \\right\\}.\n  \\label{eq:a}\n\\end{equation}</span>'), out);
  assert.doesNotMatch(out, /<em>/);
  assert.match(out, /Eq\.&nbsp;\\eqref\{eq:a\}\./);
});

test("math keeps ordinal suffixes and interval brackets separate from citation links", () => {
  assert.equal(inline("the $j$th and $m$th entries"), 'the <span class="math">$j$</span>th and <span class="math">$m$</span>th entries');
  assert.equal(inline("$[(d-1)/d,1)$ [reference](https://example.org/paper)"), '<span class="math">$[(d-1)/d,1)$</span> <a href="https://example.org/paper" rel="noopener">reference</a>');
  assert.equal(inline("[bound $d \\ge 2$](https://example.org/paper)"), '<a href="https://example.org/paper" rel="noopener">bound <span class="math">$d \\ge 2$</span></a>');
  assert.equal(inline("[$d$](https://example.org/paper)"), '<a href="https://example.org/paper" rel="noopener"><span class="math">$d$</span></a>');
});

test("inline: code, links with safe schemes only, autolinks, emphasis, escapes", () => {
  assert.equal(inline("use `a*b` and **bold** and _em_"), "use <code>a*b</code> and <strong>bold</strong> and <em>em</em>");
  assert.equal(inline("[x](https://e.org/a?b=1&c=2)"), '<a href="https://e.org/a?b=1&amp;c=2" rel="noopener">x</a>');
  assert.equal(inline("[x](javascript:alert(1))"), "[x](javascript:alert(1))");
  assert.equal(inline("see https://arxiv.org/abs/1.2."), 'see <a href="https://arxiv.org/abs/1.2" rel="noopener">https://arxiv.org/abs/1.2</a>.');
  assert.equal(inline("snake_case_word and 2*3*4"), "snake_case_word and 2*3*4");
  assert.equal(inline("\\*literal\\*"), "*literal*");
  assert.equal(inline("<img src=x onerror=alert(1)>"), "&lt;img src=x onerror=alert(1)&gt;");
  assert.equal(inline("see Eq.~(1) but ~~gone~~"), "see Eq.&nbsp;(1) but <del>gone</del>", "a TeX tie becomes a non-breaking space");
});

test("URLs survive the emphasis, tie, and math rules", () => {
  assert.equal(inline("https://www.cs.umd.edu/~amchilds/ page"), '<a href="https://www.cs.umd.edu/~amchilds/" rel="noopener">https://www.cs.umd.edu/~amchilds/</a> page');
  assert.equal(inline("(https://x.org/_foo_/bar)"), '(<a href="https://x.org/_foo_/bar" rel="noopener">https://x.org/_foo_/bar</a>)');
  assert.equal(inline("doi https://doi.org/10.1016/S0375-9601(98)00012-3."), 'doi <a href="https://doi.org/10.1016/S0375-9601(98)00012-3" rel="noopener">https://doi.org/10.1016/S0375-9601(98)00012-3</a>.');
  assert.equal(inline("[Pauli](https://w.org/Pauli_group_\\(disambiguation\\))"), '<a href="https://w.org/Pauli_group_(disambiguation)" rel="noopener">Pauli</a>');
  assert.equal(inline("[see https://a.org](https://a.org)"), '<a href="https://a.org" rel="noopener">see https://a.org</a>', "a URL inside a link label is not linked again");
});

test("unclosed backtick runs are literal and cost linear time", () => {
  const start = performance.now();
  const out = inline("`".repeat(20000));
  assert.ok(performance.now() - start < 200, "took too long");
  assert.equal(out, "`".repeat(20000));
  assert.equal(inline("``a`b`` and `x"), "<code>a`b</code> and `x");
});

test("excerpt strips markup and cuts at a word", () => {
  const cut = excerpt("## Heading\n\nThe **Werner** states are $U\\otimes U$-invariant. More text follows here.", 60);
  assert.ok(cut.startsWith("The Werner states are $U\\otimes U$-invariant. More"), cut);
  assert.ok(cut.endsWith("…") && cut.length <= 61, cut);
});
