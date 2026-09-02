// Zero-dependency parser and HTML converter for the problem TeX records.
//
// Each record follows database/_template.tex: a \section title, a
// \paragraph{Problem.} statement, then the subsections Status, Source,
// Progress, References, Comment, Tag, and ID. Mathematics is left as TeX
// for MathJax; every text-mode construct used by the collection is converted
// to HTML here. Unknown commands throw, so the build cannot silently drop
// content.

import { createHash } from "node:crypto";

const SECTION_MARKERS = [
  ["statement", "\\paragraph{Problem.}"],
  ["status", "\\subsection*{Status}"],
  ["source", "\\subsection*{Source}"],
  ["progress", "\\subsection*{Progress}"],
  ["references", "\\subsection*{References}"],
  ["comment", "\\subsection*{Comment}"],
  ["tag", "\\subsection*{Tag}"],
  ["id", "\\subsection*{ID}"]
];

export const STATUSES = {
  "Unsolved": { slug: "unsolved", label: "Unsolved", short: "Open" },
  "Solved": { slug: "solved", label: "Solved", short: "Solved" },
  "Partially solved": { slug: "partial", label: "Partially solved", short: "Partial" }
};

const DISPLAY_ENVIRONMENTS = [
  "equation", "equation*", "align", "align*", "gather", "gather*",
  "multline", "multline*", "eqnarray", "eqnarray*", "flalign", "flalign*",
  "alignat", "alignat*", "displaymath"
];

// Placeholders that mark protected mathematics inside text.
const MATH_OPEN = "";
const MATH_CLOSE = "";
const PLACEHOLDER = new RegExp(`(${MATH_OPEN}\\d+${MATH_CLOSE})`);
const PLACEHOLDER_ONLY = new RegExp(`^${MATH_OPEN}(\\d+)${MATH_CLOSE}$`);

const COMBINING = {
  "'": "́", "`": "̀", "^": "̂", '"': "̈", "~": "̃",
  "=": "̄", ".": "̇", "u": "̆", "v": "̌", "H": "̋",
  "c": "̧", "k": "̨", "r": "̊", "d": "̣", "b": "̱",
  "t": "͡"
};

const SYMBOL_COMMANDS = {
  ss: "ß", l: "ł", L: "Ł", o: "ø", O: "Ø", aa: "å", AA: "Å", ae: "æ", AE: "Æ",
  oe: "œ", OE: "Œ", DJ: "Đ", dj: "đ", i: "ı", j: "ȷ", S: "§", P: "¶",
  dag: "†", ddag: "‡", copyright: "©", pounds: "£", ldots: "…", dots: "…",
  textellipsis: "…", textendash: "–", textemdash: "—", textbackslash: "\\",
  textasciitilde: "~", textasciicircum: "^", textbar: "|", textless: "<",
  textgreater: ">", textquotedblleft: "“", textquotedblright: "”",
  textquoteleft: "‘", textquoteright: "’", TeX: "TeX", LaTeX: "LaTeX",
  lq: "‘", rq: "’", slash: "/", textdegree: "°", textperiodcentered: "·"
};

const IGNORED_COMMANDS = new Set([
  "footnotesize", "scriptsize", "small", "normalsize", "large", "Large",
  "tiny", "sloppy", "newpage", "clearpage", "noindent", "centering",
  "raggedright", "raggedbottom", "relax", "linebreak", "nolinebreak",
  "allowbreak", "protect", "displaystyle", "textstyle"
]);

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const escapeAttribute = (value) => escapeHtml(value).replaceAll('"', "&quot;");

export const slug = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export const anchorFor = (label) => label.replace(/[^A-Za-z0-9]+/g, "-");

export class TexError extends Error {}

// Remove TeX comments. A comment also swallows the line break that follows
// it and the leading spaces of the next line, exactly as TeX does.
export function stripComments(tex) {
  let out = "";
  for (let i = 0; i < tex.length; i += 1) {
    const ch = tex[i];
    if (ch === "\\") {
      out += ch + (tex[i + 1] ?? "");
      i += 1;
      continue;
    }
    if (ch === "%") {
      while (i < tex.length && tex[i] !== "\n") i += 1;
      i += 1;
      while (i < tex.length && (tex[i] === " " || tex[i] === "\t")) i += 1;
      i -= 1;
      continue;
    }
    out += ch;
  }
  return out;
}

const readGroup = (text, start) => {
  // text[start] must be "{"; returns [content, indexAfterClosingBrace]
  if (text[start] !== "{") throw new TexError(`Expected "{" near: ${text.slice(start, start + 40)}`);
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "\\") { i += 1; continue; }
    if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) return [text.slice(start + 1, i), i + 1];
    }
  }
  throw new TexError(`Unbalanced braces near: ${text.slice(start, start + 60)}`);
};

const readOptional = (text, start) => {
  if (text[start] !== "[") return ["", start];
  const end = text.indexOf("]", start);
  if (end < 0) return ["", start];
  return [text.slice(start + 1, end), end + 1];
};

const skipSpaces = (text, start) => {
  let i = start;
  while (i < text.length && /\s/.test(text[i])) i += 1;
  return i;
};

// Replace every mathematical fragment with a placeholder so that the text
// conversion never touches TeX mathematics.
function protectMath(text) {
  const store = [];
  let out = "";
  let i = 0;
  const push = (kind, tex, env = null) => {
    store.push({ kind, tex, env });
    out += `${MATH_OPEN}${store.length - 1}${MATH_CLOSE}`;
  };
  while (i < text.length) {
    const ch = text[i];
    if (ch === "\\") {
      const next = text[i + 1] ?? "";
      if (next === "(") {
        const end = text.indexOf("\\)", i + 2);
        if (end < 0) throw new TexError("Unterminated \\( ... \\)");
        push("inline", text.slice(i + 2, end));
        i = end + 2;
        continue;
      }
      if (next === "[") {
        const end = text.indexOf("\\]", i + 2);
        if (end < 0) throw new TexError("Unterminated \\[ ... \\]");
        push("display", text.slice(i + 2, end));
        i = end + 2;
        continue;
      }
      const envMatch = text.slice(i).match(/^\\begin\{([a-z*]+)\}/);
      if (envMatch && DISPLAY_ENVIRONMENTS.includes(envMatch[1])) {
        const closer = `\\end{${envMatch[1]}}`;
        const end = text.indexOf(closer, i + envMatch[0].length);
        if (end < 0) throw new TexError(`Unterminated ${envMatch[0]}`);
        const stop = end + closer.length;
        push("environment", text.slice(i, stop), envMatch[1]);
        i = stop;
        continue;
      }
      out += ch + next;
      i += 2;
      continue;
    }
    if (ch === "$") {
      const double = text[i + 1] === "$";
      const open = double ? "$$" : "$";
      let j = i + open.length;
      let end = -1;
      while (j < text.length) {
        if (text[j] === "\\") { j += 2; continue; }
        if (text.startsWith(open, j)) { end = j; break; }
        j += 1;
      }
      if (end < 0) throw new TexError(`Unterminated ${open} near: ${text.slice(i, i + 60)}`);
      push(double ? "display" : "inline", text.slice(i + open.length, end));
      i = end + open.length;
      continue;
    }
    out += ch;
    i += 1;
  }
  return { text: out, store };
}

const applyAccent = (mark, base) => {
  const cleaned = base.trim();
  if (cleaned === "\\i" || cleaned === "ı") return ("i" + COMBINING[mark]).normalize("NFC");
  if (cleaned === "\\j" || cleaned === "ȷ") return ("j" + COMBINING[mark]).normalize("NFC");
  if (cleaned === "") return mark;
  return (cleaned[0] + COMBINING[mark] + cleaned.slice(1)).normalize("NFC");
};

const unescapeUrl = (value) => value
  .replace(/\\([_%&#$~])/g, "$1")
  .replace(/\\textasciitilde\{?\}?/g, "~")
  .trim();

// Convert an inline TeX fragment (with mathematics already protected).
function convertInline(text, ctx) {
  let out = "";
  let i = 0;
  const emitText = (value) => { out += escapeHtml(value); };
  while (i < text.length) {
    const ch = text[i];
    if (ch === MATH_OPEN) {
      const end = text.indexOf(MATH_CLOSE, i);
      const index = Number(text.slice(i + 1, end));
      out += renderMath(ctx.store[index], ctx);
      i = end + 1;
      continue;
    }
    if (ch === "\\") {
      const next = text[i + 1] ?? "";
      if (/[A-Za-z]/.test(next)) {
        let j = i + 1;
        while (j < text.length && /[A-Za-z]/.test(text[j])) j += 1;
        let name = text.slice(i + 1, j);
        if (text[j] === "*") { name += "*"; j += 1; }
        const result = handleCommand(name, text, j, ctx);
        out += result.html;
        i = result.next;
        continue;
      }
      // Non-letter control symbols.
      i += 2;
      switch (next) {
        case "\\": out += ctx.dropNewline ? " " : "<br>"; break;
        case ",": case ";": case ":": case ">": out += " "; break;
        case "!": case "-": case "/": case "@": break;
        case " ": case "\n": out += " "; break;
        case "{": case "}": case "_": case "%": case "#": case "$": emitText(next); break;
        case "&": out += "&amp;"; break;
        case "|": emitText("|"); break;
        case "'": case "`": case "^": case '"': case "~": case "=": case ".": {
          let base;
          const at = skipSpaces(text, i);
          if (text[at] === "{") {
            const [group, after] = readGroup(text, at);
            base = group;
            i = after;
          } else if (text[at] === "\\") {
            const m = text.slice(at).match(/^\\([ij])\b/);
            if (!m) throw new TexError(`Unsupported accent argument near: ${text.slice(i, i + 30)}`);
            base = m[0];
            i = at + m[0].length;
          } else {
            base = text[at] ?? "";
            i = at + 1;
          }
          emitText(applyAccent(next, base));
          break;
        }
        default:
          throw new TexError(`Unsupported control symbol \\${next} near: ${text.slice(Math.max(0, i - 20), i + 30)}`);
      }
      continue;
    }
    if (ch === "{" || ch === "}") { i += 1; continue; }
    if (ch === "~") { out += "&nbsp;"; i += 1; continue; }
    if (ch === "`") {
      if (text[i + 1] === "`") { out += "“"; i += 2; } else { out += "‘"; i += 1; }
      continue;
    }
    if (ch === "'") {
      if (text[i + 1] === "'") { out += "”"; i += 2; } else { out += "’"; i += 1; }
      continue;
    }
    if (ch === "-") {
      if (text.startsWith("---", i)) { out += "—"; i += 3; continue; }
      if (text.startsWith("--", i)) { out += "–"; i += 2; continue; }
    }
    if (ch === "\n") { out += " "; i += 1; continue; }
    emitText(ch);
    i += 1;
  }
  return out.replace(/[ \t]{2,}/g, " ");
}

function handleCommand(name, text, at, ctx) {
  const arg = (position) => {
    const start = skipSpaces(text, position);
    if (text[start] !== "{") throw new TexError(`Command \\${name} needs a braced argument near: ${text.slice(at, at + 40)}`);
    return readGroup(text, start);
  };
  const wrap = (tag, cls = "") => {
    const [content, next] = arg(at);
    const open = cls ? `<${tag} class="${cls}">` : `<${tag}>`;
    return { html: `${open}${convertInline(content, ctx)}</${tag}>`, next };
  };
  switch (name) {
    case "emph": case "textit": return wrap("em");
    case "textbf": return wrap("strong");
    case "texttt": return wrap("code");
    case "textsc": return wrap("span", "smallcaps");
    case "textsuperscript": return wrap("sup");
    case "textsubscript": return wrap("sub");
    case "textup": case "textrm": case "textnormal": case "textsf": case "mbox": case "text": {
      const [content, next] = arg(at);
      return { html: convertInline(content, ctx), next };
    }
    case "href": {
      const [url, afterUrl] = arg(at);
      const [label, next] = arg(afterUrl);
      const href = escapeAttribute(unescapeUrl(url));
      return { html: `<a href="${href}" rel="noreferrer">${convertInline(label, ctx)}</a>`, next };
    }
    case "url": {
      const [url, next] = arg(at);
      const href = escapeAttribute(unescapeUrl(url));
      return { html: `<a href="${href}" rel="noreferrer">${escapeHtml(unescapeUrl(url))}</a>`, next };
    }
    case "sourcecite": {
      const [label, afterLabel] = arg(at);
      const [key, next] = arg(afterLabel);
      ctx.citations?.push({ label: label.trim(), key: key.trim() });
      const anchor = anchorFor(label.trim());
      return { html: `<a class="cite" href="#${anchor}">[${escapeHtml(key.trim())}]</a>`, next };
    }
    case "eqref": {
      const [label, next] = arg(at);
      const key = label.trim();
      ctx.eqrefs?.push(key);
      const number = ctx.equationNumbers?.get(key);
      if (number === undefined) throw new TexError(`\\eqref{${key}} has no matching labeled equation`);
      return { html: `<a class="eqref" href="#${anchorFor(key)}">(${number})</a>`, next };
    }
    case "ref": case "label": {
      const [, next] = arg(at);
      return { html: "", next };
    }
    case "hspace": case "hspace*": case "vspace": case "vspace*": case "phantom": case "hphantom": case "vphantom": {
      const [, next] = arg(at);
      return { html: " ", next };
    }
    case "newline": return { html: ctx.dropNewline ? " " : "<br>", next: at };
    case "par": return { html: "</p><p>", next: at };
    case "verb": {
      const delimiter = text[at];
      const end = text.indexOf(delimiter, at + 1);
      return { html: `<code>${escapeHtml(text.slice(at + 1, end))}</code>`, next: end + 1 };
    }
    default: break;
  }
  if (name in COMBINING && /^[A-Za-z]$/.test(name)) {
    const start = skipSpaces(text, at);
    let base; let next;
    if (text[start] === "{") [base, next] = readGroup(text, start);
    else { base = text[start]; next = start + 1; }
    return { html: escapeHtml(applyAccent(name, base)), next };
  }
  if (name in SYMBOL_COMMANDS) {
    let next = at;
    // Double \lq\lq and \rq\rq are typographic double quotes.
    if (name === "lq" && text.startsWith("\\lq", at)) return { html: "“", next: at + 3 };
    if (name === "rq" && text.startsWith("\\rq", at)) return { html: "”", next: at + 3 };
    if (text[next] === "{" && text[next + 1] === "}") next += 2;
    else if (text[next] === " ") next += 1;
    return { html: escapeHtml(SYMBOL_COMMANDS[name]), next };
  }
  if (IGNORED_COMMANDS.has(name)) {
    let next = at;
    if (text[next] === "{" && text[next + 1] === "}") next += 2;
    return { html: "", next };
  }
  throw new TexError(`Unsupported command \\${name} near: ${text.slice(Math.max(0, at - 30), at + 40)}`);
}

// Turn stored mathematics back into MathJax-ready markup.
function renderMath(entry, ctx) {
  if (entry.kind === "inline") {
    return `<span class="math">\\(${escapeHtml(entry.tex.trim())}\\)</span>`;
  }
  if (entry.kind === "display") {
    return `<div class="equation">\\[${escapeHtml(entry.tex.trim())}\\]</div>`;
  }
  // Numbered environment: replace the label by an explicit tag.
  let tex = entry.tex;
  const labelMatch = tex.match(/\\label\{([^}]+)\}/);
  let anchor = "";
  if (labelMatch) {
    const label = labelMatch[1].trim();
    const number = ctx.equationNumbers?.get(label);
    tex = tex.replace(labelMatch[0], "");
    if (number !== undefined) {
      tex = tex.replace(/\\end\{(equation\*?)\}\s*$/, (m, env) => `\\tag{${number}}\n\\end{${env}}`);
      anchor = ` id="${anchorFor(label)}"`;
    }
  }
  tex = tex.replace(/\n[ \t]*\n+/g, "\n");
  return `<div class="equation"${anchor}>${escapeHtml(tex.trim())}</div>`;
}

// Convert a block of TeX (paragraphs, lists, and displayed mathematics).
function convertBlocks(text, ctx) {
  const parts = [];
  let rest = text.replace(/\\par\b/g, "\n\n");
  const listPattern = /\\begin\{(itemize|enumerate|description)\}/;
  while (rest.length > 0) {
    const match = rest.match(listPattern);
    if (!match) { parts.push(convertParagraphs(rest, ctx)); break; }
    parts.push(convertParagraphs(rest.slice(0, match.index), ctx));
    const env = match[1];
    const bodyStart = match.index + match[0].length;
    let depth = 1;
    let cursor = bodyStart;
    const tokens = /\\begin\{(?:itemize|enumerate|description)\}|\\end\{(?:itemize|enumerate|description)\}/g;
    tokens.lastIndex = cursor;
    let end = -1;
    let token;
    while ((token = tokens.exec(rest))) {
      depth += token[0].startsWith("\\begin") ? 1 : -1;
      if (depth === 0) { end = token.index; cursor = token.index + token[0].length; break; }
    }
    if (end < 0) throw new TexError(`Unterminated \\begin{${env}}`);
    let body = rest.slice(bodyStart, end);
    const [, afterOptional] = readOptional(body, skipSpaces(body, 0));
    body = body.slice(afterOptional);
    parts.push(convertList(env, body, ctx));
    rest = rest.slice(cursor);
  }
  return parts.join("\n").replace(/<p>\s*<\/p>/g, "").trim();
}

function convertList(env, body, ctx) {
  const items = [];
  let depth = 0;
  let current = null;
  const pattern = /\\begin\{(?:itemize|enumerate|description)\}|\\end\{(?:itemize|enumerate|description)\}|\\item\b/g;
  let last = 0;
  let match;
  const flush = (end) => { if (current !== null) current.text += body.slice(last, end); };
  while ((match = pattern.exec(body))) {
    flush(match.index);
    last = match.index;
    if (match[0].startsWith("\\begin")) depth += 1;
    else if (match[0].startsWith("\\end")) depth -= 1;
    else if (depth === 0) {
      current = { label: "", text: "" };
      items.push(current);
      const cursor = match.index + match[0].length;
      const [label, after] = readOptional(body, skipSpaces(body, cursor));
      current.label = label;
      last = after;
      pattern.lastIndex = after;
    }
  }
  flush(body.length);
  const tag = env === "enumerate" ? "ol" : "ul";
  const rendered = items.map((item) => {
    const inner = convertBlocks(item.text, ctx);
    if (env === "description" || item.label) {
      return `<li><span class="item-label">${convertInline(item.label, ctx)}</span> ${inner}</li>`;
    }
    return `<li>${inner}</li>`;
  });
  return `<${tag}>\n${rendered.join("\n")}\n</${tag}>`;
}

function convertParagraphs(text, ctx) {
  const paragraphs = text.split(/\n[ \t]*\n+/).map((p) => p.trim()).filter(Boolean);
  const html = [];
  for (const paragraph of paragraphs) {
    // Split around displayed mathematics so equations become block elements.
    const pieces = paragraph.split(PLACEHOLDER).filter(Boolean);
    let buffer = "";
    const flush = () => {
      const inline = convertInline(buffer, ctx).trim();
      if (inline) html.push(`<p>${inline}</p>`);
      buffer = "";
    };
    for (const piece of pieces) {
      const placeholder = piece.match(PLACEHOLDER_ONLY);
      if (placeholder && ctx.store[Number(placeholder[1])].kind !== "inline") {
        flush();
        html.push(convertInline(piece, ctx));
      } else {
        buffer += piece;
      }
    }
    flush();
  }
  return html.join("\n");
}

const baseContext = (options, store) => ({
  store,
  equationNumbers: options.equationNumbers ?? new Map(),
  citations: options.citations ?? null,
  eqrefs: options.eqrefs ?? null,
  dropNewline: Boolean(options.dropNewline)
});

export function texToHtml(tex, options = {}) {
  const { text, store } = protectMath(stripComments(tex));
  const ctx = baseContext(options, store);
  return convertBlocks(text, ctx);
}

export function texToInlineHtml(tex, options = {}) {
  const { text, store } = protectMath(stripComments(tex));
  const ctx = baseContext(options, store);
  return convertInline(text.replace(/\s+/g, " ").trim(), ctx).trim();
}

const decodeEntities = (value) => value
  .replaceAll("&nbsp;", " ")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&amp;", "&");

// Plain text with mathematics kept as $...$ TeX. Used for search, metadata,
// and the machine-readable records.
export function htmlToText(html) {
  return decodeEntities(
    html
      .replace(/<div class="equation"[^>]*>([\s\S]*?)<\/div>/g, (m, inner) => ` ${inner.trim()} `)
      .replace(/\\\((.*?)\\\)/g, (m, inner) => `$${inner}$`)
      .replace(/<\/(p|li|div)>/g, "\n")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<[^>]+>/g, "")
  ).replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

// Number every labeled equation environment in order of appearance.
function collectEquations(tex) {
  const pattern = /\\begin\{(equation\*?|align\*?|gather\*?|multline\*?)\}[\s\S]*?\\end\{\1\}/g;
  const equations = [];
  const numbers = new Map();
  let match;
  while ((match = pattern.exec(tex))) {
    const block = match[0];
    const label = block.match(/\\label\{([^}]+)\}/);
    if (!label) {
      if (match[1].endsWith("*")) continue;
      throw new TexError(`Displayed equation ${equations.length + 1} has no \\label`);
    }
    const key = label[1].trim();
    if (numbers.has(key)) throw new TexError(`Duplicate equation label ${key}`);
    const number = equations.length + 1;
    equations.push({ number, label: key, anchor: anchorFor(key), tex: block });
    numbers.set(key, number);
  }
  return { equations, numbers };
}

function extractSections(tex) {
  const positions = SECTION_MARKERS.map(([name, marker]) => {
    const position = tex.indexOf(marker);
    if (position < 0) throw new TexError(`Missing required marker ${marker}`);
    return { name, marker, position };
  });
  for (let i = 1; i < positions.length; i += 1) {
    if (positions[i].position < positions[i - 1].position) {
      throw new TexError("Subsections do not follow the canonical order");
    }
  }
  const sections = {};
  positions.forEach((entry, index) => {
    const start = entry.position + entry.marker.length;
    const end = index + 1 < positions.length ? positions[index + 1].position : tex.length;
    sections[entry.name] = tex.slice(start, end).replace(/^\n+|\n+$/g, "");
  });
  return sections;
}

function extractReferences(referencesTex) {
  const cleaned = stripComments(referencesTex);
  const pattern = /\\item\[\\textup\{\[([^\]]+)\]\}\]\s*\\label\{([^}]+)\}/g;
  const starts = [];
  let match;
  while ((match = pattern.exec(cleaned))) {
    starts.push({ key: match[1].trim(), label: match[2].trim(), start: match.index, bodyStart: match.index + match[0].length });
  }
  if (starts.length === 0) throw new TexError("References contains no entries");
  const terminator = cleaned.lastIndexOf("\\end{enumerate}");
  if (terminator < 0) throw new TexError("References is missing the enumerate terminator");
  return starts.map((entry, index) => {
    const end = index + 1 < starts.length ? starts[index + 1].start : terminator;
    const body = cleaned.slice(entry.bodyStart, end).trim();
    return { key: entry.key, label: entry.label, anchor: anchorFor(entry.label), tex: body };
  });
}

function extractProgressItems(progressTex) {
  const cleaned = stripComments(progressTex).trim();
  const match = cleaned.match(/^\\begin\{itemize\}([\s\S]*)\\end\{itemize\}$/);
  if (!match) throw new TexError("Progress must contain one itemize environment");
  const chunks = match[1].split(/\\item\b/).map((chunk) => chunk.trim()).filter(Boolean);
  if (chunks.length === 0) throw new TexError("Progress contains no items");
  return chunks;
}

const splitTags = (tagTex) => stripComments(tagTex)
  .split("\n").map((line) => line.trim()).filter(Boolean).join(" ")
  .split(";").map((tag) => tag.trim()).filter(Boolean);

// Remove the inline DOI and arXiv links from a reference entry; the page
// shows them as buttons instead. Other links stay in the text.
export function stripIdentifierLinks(tex) {
  return tex
    .replace(/\s*(?:\\newline\s*)?\\href\{[^}]*\}\{(?:doi|arXiv|arxiv):[^}]*\}\s*[;.,]?/g, "")
    .replace(/\s*\\newline\s*$/, "")
    .trim();
}

// Extract the arXiv identifiers and DOIs cited by a reference entry.
function referenceLinks(tex) {
  const links = [];
  const pattern = /\\href\{([^}]+)\}/g;
  let match;
  while ((match = pattern.exec(tex))) {
    const url = unescapeUrl(match[1]);
    if (/arxiv\.org\/abs\//.test(url)) links.push({ kind: "arxiv", url, id: url.replace(/^.*arxiv\.org\/abs\//, "").replace(/v\d+$/, "") });
    else if (/doi\.org\//.test(url)) links.push({ kind: "doi", url, id: url.replace(/^.*doi\.org\//, "") });
    else links.push({ kind: "url", url, id: url });
  }
  return links;
}

export function parseProblem(sourceTex, { canonicalTags = null, fileName = "" } = {}) {
  const fail = (message) => { throw new TexError(`${fileName || "record"}: ${message}`); };
  try {
    const tex = sourceTex.replace(/\r\n/g, "\n");
    const titleMatch = tex.match(/^\\section\{(.+)\}$/m);
    if (!titleMatch) fail("missing \\section title");
    const sections = extractSections(tex);
    const status = stripComments(sections.status).trim();
    if (!(status in STATUSES)) fail(`invalid status "${status}"`);
    const idMatch = stripComments(sections.id).trim().match(/^\\texttt\{(op\\_[A-Za-z0-9]{16})\}$/);
    if (!idMatch) fail("invalid or missing problem ID");
    const id = idMatch[1].replace("\\_", "_");
    const tags = splitTags(sections.tag);
    if (tags.length < 1 || tags.length > 6) fail("a problem needs between one and six tags");
    if (new Set(tags).size !== tags.length) fail("duplicate tags");
    if (canonicalTags) {
      const unknown = tags.filter((tag) => !canonicalTags.has(tag));
      if (unknown.length) fail(`unknown tags: ${unknown.join(", ")}`);
    }

    const { equations, numbers } = collectEquations(stripComments(tex));
    const references = extractReferences(sections.references).map((entry) => ({
      ...entry,
      html: texToInlineHtml(stripIdentifierLinks(entry.tex), { equationNumbers: numbers, dropNewline: true }),
      links: referenceLinks(entry.tex)
    }));
    const referenceByLabel = new Map(references.map((entry) => [entry.label, entry]));
    if (referenceByLabel.size !== references.length) fail("duplicate reference labels");

    const citations = [];
    const eqrefs = [];
    const convert = (section) => texToHtml(section, { equationNumbers: numbers, citations, eqrefs });

    const sourceCitations = [];
    const statementHtml = convert(sections.statement);
    const sourceHtml = texToHtml(sections.source, { equationNumbers: numbers, citations: sourceCitations, eqrefs });
    citations.push(...sourceCitations);
    const progressItems = extractProgressItems(sections.progress).map((item) => ({ tex: item, html: convert(item) }));
    const commentHtml = convert(sections.comment);
    const titleHtml = texToInlineHtml(titleMatch[1], { equationNumbers: numbers });

    for (const citation of citations) {
      const entry = referenceByLabel.get(citation.label);
      if (!entry) fail(`citation label ${citation.label} has no reference entry`);
      if (entry.key !== citation.key) fail(`citation key ${citation.key} does not match reference key ${entry.key}`);
    }
    const citedLabels = new Set(citations.map((c) => c.label));
    const uncited = references.filter((entry) => !citedLabels.has(entry.label));
    for (const label of eqrefs) if (!numbers.has(label)) fail(`\\eqref{${label}} has no equation`);
    const sourceText = stripComments(sections.source).trim();
    if (!sourceText) fail("empty source attribution");
    if (sourceCitations.length === 0 && sourceText !== "unknown" && !sourceText.startsWith("Contributor:")) {
      fail("source must cite literature, name a contributor, or be 'unknown'");
    }

    return {
      id,
      file: fileName,
      title: { tex: titleMatch[1], html: titleHtml, text: htmlToText(titleHtml) },
      status,
      statusSlug: STATUSES[status].slug,
      tags,
      statement: { tex: sections.statement.trim(), html: statementHtml, text: htmlToText(statementHtml) },
      source: {
        tex: sections.source.trim(),
        html: sourceHtml,
        text: htmlToText(sourceHtml),
        citations: sourceCitations.map((c) => ({ label: c.label, key: c.key }))
      },
      progress: progressItems.map((item) => ({ tex: item.tex, html: item.html, text: htmlToText(item.html) })),
      references: references.map((entry) => ({ key: entry.key, label: entry.label, anchor: entry.anchor, tex: entry.tex, html: entry.html, text: htmlToText(entry.html), links: entry.links })),
      uncitedReferences: uncited.map((entry) => entry.key),
      comment: { tex: sections.comment.trim(), html: commentHtml, text: htmlToText(commentHtml) },
      equations,
      sha256: createHash("sha256").update(sourceTex).digest("hex"),
      sourceTex
    };
  } catch (error) {
    if (error instanceof TexError && !error.message.startsWith(fileName)) {
      throw new TexError(`${fileName || "record"}: ${error.message}`);
    }
    throw error;
  }
}
