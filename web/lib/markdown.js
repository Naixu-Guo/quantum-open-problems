/**
 * Markdown for ledger bodies and comments. It covers what the records use: ATX headings,
 * paragraphs, emphasis, inline code, links, lists, block quotes, fenced code, GFM tables,
 * horizontal rules, and TeX math (`$…$`, `$$…$$`, `\(…\)`, `\[…\]`, and `\begin{…}…\end{…}`
 * environments), which is escaped and left for MathJax. Raw HTML never passes through: every
 * character is escaped, and only http(s), mailto, and local links become anchors.
 *
 * Inline markup works by lifting code, links, math, and escaped characters out into numbered
 * holes first, marking up the rest, and putting the pieces back at the end, so nothing inside
 * a code span, a URL, or a formula is ever touched by the emphasis rules. Every scan is linear.
 */
import { escapeHtml } from "./dom.js";

const SAFE_URL = /^(https?:|mailto:|\/(?!\/)|#)/i;
const BLOCK_START = /^(#{1,6}\s|\s*>|\s*([-*+]|\d+[.)])\s+|\s*\$\$|\s*(`{3,}|~{3,}))/;
const TABLE_RULE = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const LIST_ITEM = /^(\s*)([-*+]|\d+[.)])\s+(.*)$/;
/** One pass over every math form; the leftmost delimiter wins, so an environment inside `$…$` stays inside it. */
const MATH = /\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\\begin\{([a-z*]+)\}[\s\S]*?\\end\{\1\}|(^|[^\\$\w])(\$(?:\\.|[^$\\])+?\$)(?![\w$])/g;
/** `[label](url)`; the URL may carry escaped characters and one level of balanced parentheses. */
const LINK = /\[([^\]\n]+)\]\(((?:\\.|[^\s()\\]|\([^\s()]*\))+)\)/g;
/** Placeholders for lifted pieces; NUL never occurs in text. */
const HOLE = String.fromCharCode(0);
const HOLES = new RegExp(`${HOLE}(\\d+)${HOLE}`, "g");

export function renderMarkdown(source, options = {}) {
  const headingOffset = options.headingOffset ?? 0;
  const lines = String(source ?? "").replace(/\r\n?/g, "\n").split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") { i += 1; continue; }

    const fence = line.match(/^\s*(`{3,}|~{3,})\s*(\S*)/);
    if (fence) {
      const code = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) { code.push(lines[i]); i += 1; }
      i += 1;
      const language = fence[2] ? ` class="language-${escapeHtml(fence[2])}"` : "";
      out.push(`<pre><code${language}>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*\$\$/.test(line)) {
      const math = [line.trim()];
      i += 1;
      if (!(math[0].length > 2 && math[0].endsWith("$$"))) {
        while (i < lines.length && !/\$\$\s*$/.test(lines[i])) { math.push(lines[i]); i += 1; }
        if (i < lines.length) { math.push(lines[i]); i += 1; }
      }
      out.push(`<div class="math-display">${escapeHtml(math.join("\n"))}</div>`);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (heading) {
      const level = Math.min(6, heading[1].length + headingOffset);
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push("<hr>"); i += 1; continue; }

    if (line.includes("|") && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1])) {
      const header = cells(line);
      const aligns = cells(lines[i + 1]).map(alignment);
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim() !== "") { rows.push(cells(lines[i])); i += 1; }
      const cell = (tag, text, k) => `<${tag}${aligns[k] ? ` style="text-align:${aligns[k]}"` : ""}>${inline(text ?? "")}</${tag}>`;
      const head = header.map((text, k) => cell("th", text, k)).join("");
      const body = rows.map((row) => `<tr>${header.map((_, k) => cell("td", row[k], k)).join("")}</tr>`).join("");
      out.push(`<div class="table-scroll"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`);
      continue;
    }

    if (/^\s*>/.test(line)) {
      const quoted = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { quoted.push(lines[i].replace(/^\s*>\s?/, "")); i += 1; }
      out.push(`<blockquote>${renderMarkdown(quoted.join("\n"), options)}</blockquote>`);
      continue;
    }

    const item = line.match(LIST_ITEM);
    if (item) {
      const ordered = /\d/.test(item[2]);
      const indent = item[1].length;
      const sameList = (text) => { const m = text.match(LIST_ITEM); return Boolean(m) && m[1].length === indent && /\d/.test(m[2]) === ordered; };
      const items = [];
      while (i < lines.length) {
        if (sameList(lines[i])) { items.push([lines[i].match(LIST_ITEM)[3]]); i += 1; continue; }
        const last = items[items.length - 1];
        if (lines[i].trim() !== "" && /^\s+/.test(lines[i])) { last.push(lines[i].replace(/^\s{1,4}/, "")); i += 1; continue; }
        if (lines[i].trim() === "") {
          let next = i + 1;
          while (next < lines.length && lines[next].trim() === "") next += 1;
          if (next < lines.length && (/^\s+\S/.test(lines[next]) || sameList(lines[next]))) { last.push(""); i = next; continue; }
        }
        break;
      }
      const rendered = items.map((parts) => {
        const text = parts.join("\n").trim();
        const hasBlocks = /\n\s*([-*+]|\d+[.)])\s+|\n\n/.test(text);
        return `<li>${hasBlocks ? renderMarkdown(text, options) : inline(text.replace(/\n/g, " "))}</li>`;
      }).join("");
      out.push(ordered ? `<ol>${rendered}</ol>` : `<ul>${rendered}</ul>`);
      continue;
    }

    const paragraph = [];
    while (i < lines.length && lines[i].trim() !== "" && (paragraph.length === 0 || !BLOCK_START.test(lines[i]))) { paragraph.push(lines[i]); i += 1; }
    out.push(`<p>${inline(paragraph.join("\n"))}</p>`);
  }
  return out.join("\n");
}

function cells(line) {
  let text = line.trim();
  if (text.startsWith("|")) text = text.slice(1);
  if (text.endsWith("|") && !text.endsWith("\\|")) text = text.slice(0, -1);
  return text.split(/(?<!\\)\|/).map((cell) => cell.replace(/\\\|/g, "|").trim());
}

function alignment(rule) {
  const left = rule.startsWith(":");
  const right = rule.endsWith(":");
  return left && right ? "center" : right ? "right" : left ? "left" : "";
}

/** Inline markup for one run of text. Inside a link label, `linkable` is off so anchors never nest. */
export function inline(text, { linkable = true } = {}) {
  const tokens = [];
  const keep = (markup) => { tokens.push(markup); return `${HOLE}${tokens.length - 1}${HOLE}`; };
  const math = (tex) => keep(`<span class="math">${escapeHtml(tex)}</span>`);
  let s = codeSpans(String(text), keep);
  if (linkable) {
    s = s.replace(LINK, (whole, label, url) => {
      const target = url.replace(/\\(.)/g, "$1");
      if (!SAFE_URL.test(target)) return whole;
      return keep(`<a href="${escapeHtml(target)}"${/^https?:/i.test(target) ? ' rel="noopener"' : ""}>${inline(label, { linkable: false })}</a>`);
    });
  }
  s = s.replace(MATH, (whole, _env, before, dollars) => {
    if (dollars === undefined) return math(whole);
    const body = dollars.slice(1, -1);
    return /^\s|\s$/.test(body) ? whole : `${before}${math(dollars)}`;
  });
  s = s.replace(/\\([\\`*_{}[\]()#+\-.!~])/g, (_, char) => keep(escapeHtml(char)));
  // A dollar that is not math must not be paired by MathJax either; an ignored span keeps it apart.
  s = s.replace(/\\?\$/g, () => keep('<span class="no-math">$</span>'));
  s = escapeHtml(s);
  if (linkable) s = autolinks(s, keep);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*\w])\*([^*\n]+)\*(?!\w)/g, "$1<em>$2</em>").replace(/(^|[^_\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");
  s = s.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  s = s.replace(/(?<![~\s])~(?![~\s])/g, "&nbsp;");
  s = s.replace(/\n/g, " ");
  while (HOLES.test(s)) s = s.replace(HOLES, (_, n) => tokens[Number(n)]);
  return s;
}

/** Lift `` `code` `` spans out; a run of backticks closes only with a run of the same length, so an unclosed run is literal. */
function codeSpans(text, keep) {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] !== "`") { out += text[i]; i += 1; continue; }
    let end = i;
    while (end < text.length && text[end] === "`") end += 1;
    const ticks = text.slice(i, end);
    const close = closingRun(text, ticks, end);
    if (close === -1) { out += ticks; i = end; continue; }
    out += keep(`<code>${escapeHtml(text.slice(end, close).trim())}</code>`);
    i = close + ticks.length;
  }
  return out;
}

function closingRun(text, ticks, from) {
  let index = text.indexOf(ticks, from);
  while (index !== -1) {
    const end = index + ticks.length;
    if (text[index - 1] !== "`" && text[end] !== "`") return index;
    let skip = end;
    while (text[skip] === "`") skip += 1;
    index = text.indexOf(ticks, skip);
  }
  return -1;
}

/** Bare http(s) URLs in already-escaped text become links; trailing punctuation and unbalanced parentheses stay outside. */
function autolinks(escaped, keep) {
  return escaped.replace(/(^|[\s(>])(https?:\/\/[^\s<]+)/g, (_, before, raw) => {
    let url = raw;
    let tail = "";
    for (;;) {
      const last = url[url.length - 1];
      const opens = (url.match(/\(/g) ?? []).length;
      const closes = (url.match(/\)/g) ?? []).length;
      if (/[.,;:!?]/.test(last) || (last === ")" && closes > opens)) { tail = last + tail; url = url.slice(0, -1); continue; }
      break;
    }
    return `${before}${keep(`<a href="${url}" rel="noopener">${url}</a>`)}${tail}`;
  });
}

/** The first sentence or so of a body, as plain text, for lists and cards. */
export function excerpt(source, limit = 200) {
  const text = String(source ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^#{1,6}\s.*$/gm, " ")
    .replace(/^\|.*$/gm, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/[*_`>#]/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > limit ? `${text.slice(0, limit).replace(/\s+\S*$/, "")}…` : text;
}
