// Shared by the classic proposal script and the progress ES module. Only exports
// are adapted for GitHub; textarea values, saved drafts, and inbox payloads stay raw.
(() => {
  const escaped = (text, index) => {
    let slashes = 0;
    while (index > 0 && text[--index] === "\\") slashes++;
    return slashes % 2 === 1;
  };
  const position = (text, index) => {
    const lines = text.slice(0, index).split("\n");
    return `line ${lines.length}, column ${lines.at(-1).length + 1}`;
  };

  function parseMath(input) {
    const text = String(input ?? "");
    const tokens = [], diagnostics = [];
    let cursor = 0, plain = 0;
    const add = (end, properties) => {
      if (plain < cursor) tokens.push({ type: "text", raw: text.slice(plain, cursor), start: plain });
      tokens.push({ raw: text.slice(cursor, end), start: cursor, ...properties });
      cursor = plain = end;
    };
    while (cursor < text.length) {
      const rest = text.slice(cursor);
      const lineStart = cursor === 0 || text[cursor - 1] === "\n";
      // Code examples must never be rewritten or sent to MathJax.
      const fence = lineStart && rest.match(/^ {0,3}(`{3,}|~{3,})([^\n]*)\n/u);
      if (fence) {
        const closing = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}[ \\t]*\\r?(?:\\n|$)`, "m");
        const tail = rest.slice(fence[0].length), end = closing.exec(tail);
        const length = end ? fence[0].length + end.index + end[0].length : rest.length;
        add(cursor + length, fence[2].trim() === "math" && end
          ? { type: "math", tex: tail.slice(0, end.index), display: true, protected: true }
          : { type: "code" });
        continue;
      }
      if (lineStart && /^(?: {4}|\t)/u.test(rest)) {
        const end = text.indexOf("\n", cursor);
        add(end < 0 ? text.length : end + 1, { type: "code" });
        continue;
      }
      if (text[cursor] === "`" && !escaped(text, cursor)) {
        const ticks = rest.match(/^`+/u)[0];
        const end = new RegExp(`(?<!\`)${ticks}(?!\`)`, "u").exec(rest.slice(ticks.length));
        if (end) { add(cursor + ticks.length + end.index + ticks.length, { type: "code" }); continue; }
      }
      if (escaped(text, cursor)) { cursor++; continue; }
      let open, close, display = false, protectedMath = false, environment = false;
      if (rest.startsWith("$`")) { open = "$`"; close = "`$"; protectedMath = true; }
      else if (rest.startsWith("$$")) { open = close = "$$"; display = true; }
      else if (rest.startsWith("$")) { open = close = "$"; }
      else if (rest.startsWith("\\(")) { open = "\\("; close = "\\)"; }
      else if (rest.startsWith("\\[")) { open = "\\["; close = "\\]"; display = true; }
      else {
        const begin = rest.match(/^\\begin\{(equation\*?|align\*?|gather\*?|multline\*?|displaymath|math)\}/u);
        if (begin) { open = begin[0]; close = `\\end{${begin[1]}}`; display = begin[1] !== "math"; environment = true; }
      }
      if (!open) {
        if (rest.startsWith("\\)") || rest.startsWith("\\]")) diagnostics.push({ start: cursor, message: `Closing ${rest.slice(0, 2)} has no opening delimiter. Add its matching opener.` });
        cursor++; continue;
      }
      let end = cursor + open.length;
      for (; end < text.length; end++) {
        if (!display && text[end] === "\n") break;
        if (text.startsWith(close, end) && !escaped(text, end)) break;
      }
      if (end >= text.length || !text.startsWith(close, end)) {
        diagnostics.push({ start: cursor, message: `Unmatched ${open}. Close it with ${close}; use $$ on separate lines for multiline math, or \\$ for a literal dollar sign.` });
        cursor += open.length; continue;
      }
      const tex = environment ? text.slice(cursor, end + close.length) : text.slice(cursor + open.length, end);
      if (/\\\\[A-Za-z]+/u.test(tex) && !/\\begin\{(?:aligned|align\*?|gathered|gather\*?|[pbBvV]?matrix|array|cases|split)/u.test(tex)) {
        diagnostics.push({ start: cursor, message: "Possible double escaping: use one backslash before a TeX command in the form. Keep two only for an intentional row break." });
      }
      add(end + close.length, { type: "math", tex, display, protected: protectedMath });
    }
    if (plain < text.length) tokens.push({ type: "text", raw: text.slice(plain), start: plain });
    return { tokens, diagnostics: diagnostics.map(item => ({ ...item, location: position(text, item.start) })) };
  }

  function githubMath(input) {
    return parseMath(input).tokens.map(token => {
      if (token.type !== "math" || token.protected) return token.raw;
      if (token.display) return `\n\n\`\`\`math\n${token.tex}\n\`\`\`\n\n`;
      return `$\`${token.tex}\`$`;
    }).join("");
  }

  // Keep the renderer shared, while using DOM text nodes rather than interpreting
  // submitted HTML. Each diagnostic names its field and original expression.
  function bindMathPreview({ document, button, output, fields, getMathJax }) {
    if (!button || !output) return;
    let revision = 0;
    const invalidate = () => {
      revision++;
      output.hidden = true;
      output.replaceChildren();
      button.disabled = false;
    };
    for (const field of fields) field.control?.addEventListener("input", invalidate);
    button.addEventListener("click", async () => {
      const current = ++revision;
      button.disabled = true;
      output.hidden = false;
      output.replaceChildren();
      const append = (tag, text, className = "") => {
        const node = document.createElement(tag);
        node.textContent = text; node.className = className; output.append(node);
        return node;
      };
      const jobs = [];
      for (const field of fields) {
        if (!field.control || field.control.closest?.("[hidden]")) continue;
        const text = field.control.value;
        if (!text.trim()) continue;
        append("h3", field.label);
        const { tokens, diagnostics } = parseMath(text);
        const body = append("div", "", "math-preview-body no-math");
        for (const token of tokens) {
          const part = document.createElement(token.type === "code" ? "code" : "span");
          part.textContent = token.raw;
          body.append(part);
          if (token.type === "math") jobs.push({ part, token, field: field.label, text });
        }
        for (const diagnostic of diagnostics) append("p", `${field.label}, ${diagnostic.location}: ${diagnostic.message}`, "form-error");
      }
      if (!output.childNodes.length) append("p", "Nothing to preview yet.");
      try {
        if (jobs.length) {
          const math = getMathJax();
          if (math?.startup?.promise) await math.startup.promise;
          if (!math?.tex2svgPromise) throw new Error("Math renderer unavailable");
          for (const { part, token, field, text } of jobs) {
            if (current !== revision) return;
            try {
              const rendered = await math.tex2svgPromise(token.tex, { display: token.display });
              if (current !== revision) return;
              const error = rendered.querySelector("[data-mjx-error]");
              if (error) throw new Error(error.getAttribute("data-mjx-error"));
              part.replaceChildren(rendered);
            } catch (error) {
              if (current !== revision) return;
              append("p", `${field}, ${position(text, token.start)} (${token.raw}): ${error.message}. Check the command spelling and braces; your source is unchanged.`, "form-error");
            }
          }
          if (current === revision) append("p", "Preview checks formula formatting only. GitHub copy adds math delimiters; your draft and submitted TeX stay unchanged.", "form-hint");
        }
      } catch {
        if (current === revision) append("p", "The math renderer could not load. Your source is shown above and your draft is unchanged. Reload and try Preview again; you can still copy or submit the text.", "form-error");
      } finally {
        if (current === revision) button.disabled = false;
      }
    });
    return { invalidate };
  }

  globalThis.QIQCOPFormMath = { parseMath, githubMath, bindMathPreview };
})();
