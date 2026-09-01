(() => {
  "use strict";

  const catalog = window.QUANTUM_CATALOG_INDEX;
  if (!catalog || !Array.isArray(catalog.problems)) {
    document.querySelector("#problem-grid").innerHTML =
      '<p class="data-error">The problem catalog could not be loaded.</p>';
    return;
  }

  const areas = catalog.taxonomy?.areas || [];
  const topics = catalog.taxonomy?.topics || [];
  const collections = catalog.collections || [];
  const areaById = new Map(areas.map((area) => [area.id, area]));
  const topicById = new Map(topics.map((topic) => [topic.id, topic]));
  const collectionById = new Map(collections.map((collection) => [collection.id, collection]));
  const catalogDate = catalog.meta.updated || catalog.meta.audited;
  const problems = catalog.problems.map((problem) => ({
    ...problem,
    area: topicById.get(problem.topic)?.area || "uncategorized"
  }));
  const byId = new Map(problems.map((problem) => [problem.id, problem]));
  const detailCache = new Map();
  let activeProblemId = null;
  const elements = {
    grid: document.querySelector("#problem-grid"),
    watchGrid: document.querySelector("#watch-grid"),
    areaGrid: document.querySelector("#area-grid"),
    fieldBrowserCount: document.querySelector("#field-browser-count"),
    signals: document.querySelector("#signal-items"),
    search: document.querySelector("#problem-search"),
    area: document.querySelector("#area-filter"),
    topic: document.querySelector("#topic-filter"),
    collection: document.querySelector("#collection-filter"),
    activity: document.querySelector("#activity-filter"),
    sort: document.querySelector("#sort-filter"),
    count: document.querySelector("#results-count"),
    label: document.querySelector("#results-label"),
    empty: document.querySelector("#empty-state"),
    clear: document.querySelector("#clear-filters"),
    dialog: document.querySelector("#problem-dialog"),
    dialogContent: document.querySelector("#dialog-content"),
    dialogPosition: document.querySelector("#dialog-position"),
    closeDialog: document.querySelector(".dialog-close"),
    theme: document.querySelector("#theme-toggle"),
    toast: document.querySelector("#toast"),
    repository: document.querySelector("#repository-link")
  };

  const state = {
    status: "all",
    search: "",
    area: "all",
    topic: "all",
    collection: "all",
    activity: "all",
    sort: "recent"
  };

  const escapeHTML = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const safeUrl = (value = "") => {
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
    } catch {
      return "#";
    }
  };

  const renderFormalMarkdown = (markdown = "") => {
    const math = [];
    const token = (kind, source) => {
      const index = math.push({ kind, source }) - 1;
      return `@@QOP_${kind}_${index}@@`;
    };
    const protectedMarkdown = String(markdown)
      .replace(/\$\$([\s\S]*?)\$\$/g, (_, source) => `\n\n${token("DISPLAY", source.trim())}\n\n`)
      .replace(/\$([^$\n]+?)\$/g, (_, source) => token("INLINE", source.trim()));

    const restoreMath = (value) => value.replace(/@@QOP_(DISPLAY|INLINE)_(\d+)@@/g, (_, kind, index) => {
      const expression = escapeHTML(math[Number(index)]?.source || "");
      return kind === "DISPLAY"
        ? `<div class="formal-equation" role="group" aria-label="Displayed equation">\\[${expression}\\]</div>`
        : `\\(${expression}\\)`;
    });
    const formatInline = (value) => restoreMath(escapeHTML(value)
      .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+?)\*/g, "<em>$1</em>"));
    const blocks = protectedMarkdown.trim().split(/\n{2,}/).filter(Boolean);

    return blocks.map((block) => {
      const displayMatch = block.trim().match(/^@@QOP_DISPLAY_(\d+)@@$/);
      if (displayMatch) return restoreMath(displayMatch[0]);

      const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
      const tableDivider = /^\|(?:\s*:?-+:?\s*\|)+$/;
      if (lines.length >= 2 && lines[0].startsWith("|") && tableDivider.test(lines[1])) {
        const cells = (line) => line.slice(1, -1).split("|").map((cell) => cell.trim());
        const headers = cells(lines[0]);
        const rows = lines.slice(2).filter((line) => line.startsWith("|")).map(cells);
        return `
          <div class="notation-table-wrap">
            <table class="notation-table">
              <thead><tr>${headers.map((header) => `<th scope="col">${formatInline(header)}</th>`).join("")}</tr></thead>
              <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
            </table>
          </div>`;
      }
      const rendered = [];
      let paragraph = [];
      const flushParagraph = () => {
        if (!paragraph.length) return;
        rendered.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
        paragraph = [];
      };

      for (let index = 0; index < lines.length;) {
        const ordered = lines[index].match(/^\d+\.\s+(.+)$/);
        const unordered = lines[index].match(/^-\s+(.+)$/);
        if (!ordered && !unordered) {
          paragraph.push(lines[index]);
          index += 1;
          continue;
        }
        flushParagraph();
        const expression = ordered ? /^\d+\.\s+(.+)$/ : /^-\s+(.+)$/;
        const tag = ordered ? "ol" : "ul";
        const items = [];
        while (index < lines.length) {
          const match = lines[index].match(expression);
          if (!match) break;
          items.push(`<li>${formatInline(match[1])}</li>`);
          index += 1;
        }
        rendered.push(`<${tag}>${items.join("")}</${tag}>`);
      }
      flushParagraph();
      return rendered.join("");
    }).join("");
  };

  const clearTypesetMath = () => {
    if (typeof window.MathJax?.typesetClear === "function") {
      window.MathJax.typesetClear([elements.dialogContent]);
    }
  };

  const typesetFormalMath = () => {
    if (typeof window.MathJax?.typesetPromise !== "function") return;
    window.MathJax.typesetPromise([elements.dialogContent]).catch((error) => {
      console.error("MathJax could not typeset the formal statement", error);
    });
  };

  const normalize = (value = "") => String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  const dateValue = (value = "") => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return Date.parse(`${value}T00:00:00Z`);
    if (/^\d{4}$/.test(value)) return Date.parse(`${value}-01-01T00:00:00Z`);
    return 0;
  };

  const displayDate = (value = "") => {
    if (/^\d{4}$/.test(value)) return value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
  };

  const displayShortDate = (value = "") => {
    if (/^\d{4}$/.test(value)) return value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      timeZone: "UTC"
    }).format(new Date(`${value}T00:00:00Z`));
  };

  const statusLabel = (status) => status === "partial" ? "Partially solved" : "Open";
  const areaLabel = (problem) => areaById.get(problem.area)?.label || problem.area;
  const topicLabel = (problem) => topicById.get(problem.topic)?.label || problem.topic;
  const collectionLabel = (problem) => collectionById.get(problem.collection)?.label || problem.collection;

  const latestProgress = (problem) => problem.latestEvidence || {
      date: problem.latest,
      title: "No later exact result located",
      maturity: "Audit finding"
    };

  const searchTextCache = new Map();
  const searchText = (problem) => normalize([
    problem.title,
    areaLabel(problem),
    topicLabel(problem),
    collectionLabel(problem),
    problem.type,
    problem.summary,
    problem.sourceTitle,
    ...(problem.sourceAuthors || []),
    ...(problem.keywords || []),
    problem.latestEvidence?.title,
    problem.latestEvidence?.maturity,
    problem.latestEvidence?.strength
  ].join(" "));

  const cachedSearchText = (problem) => {
    if (!searchTextCache.has(problem.id)) searchTextCache.set(problem.id, searchText(problem));
    return searchTextCache.get(problem.id);
  };

  const fillSelect = (select, values) => {
    values.slice().sort((a, b) => a.label.localeCompare(b.label)).forEach((value) => {
      const option = document.createElement("option");
      option.value = value.id;
      option.textContent = value.label;
      select.append(option);
    });
  };

  const activeAreaIds = new Set(problems.map((problem) => problem.area));
  fillSelect(elements.area, areas.filter((area) => activeAreaIds.has(area.id)));
  fillSelect(elements.collection, collections.filter((collection) =>
    problems.some((problem) => problem.collection === collection.id)));

  const syncTopicOptions = () => {
    const available = topics.filter((topic) =>
      (state.area === "all" || topic.area === state.area)
      && problems.some((problem) => problem.topic === topic.id));
    elements.topic.replaceChildren(elements.topic.options[0]);
    fillSelect(elements.topic, available);
    if (![...elements.topic.options].some((option) => option.value === state.topic)) state.topic = "all";
  };

  const readQuery = () => {
    const query = new URLSearchParams(window.location.search);
    const validStatus = ["all", "open", "partial"];
    const validActivity = ["all", "audit-year", "recent", "older"];
    const validSort = ["recent", "oldest", "title"];
    state.status = validStatus.includes(query.get("status")) ? query.get("status") : "all";
    state.search = query.get("q") || "";
    state.area = [...elements.area.options].some((option) => option.value === query.get("area"))
      ? query.get("area") : "all";
    syncTopicOptions();
    state.topic = [...elements.topic.options].some((option) => option.value === query.get("topic"))
      ? query.get("topic") : "all";
    const requestedSource = query.get("source");
    const legacyCollection = collections.find((collection) =>
      collection.label === requestedSource || collection.aliases?.includes(requestedSource))?.id;
    const collectionValue = collections.some((collection) => collection.id === requestedSource)
      ? requestedSource : legacyCollection;
    state.collection = [...elements.collection.options].some((option) => option.value === collectionValue)
      ? collectionValue : "all";
    state.activity = validActivity.includes(query.get("activity")) ? query.get("activity") : "all";
    state.sort = validSort.includes(query.get("sort")) ? query.get("sort") : "recent";
  };

  const syncControls = () => {
    elements.search.value = state.search;
    elements.area.value = state.area;
    syncTopicOptions();
    elements.topic.value = state.topic;
    elements.collection.value = state.collection;
    elements.activity.value = state.activity;
    elements.sort.value = state.sort;
    document.querySelectorAll("[data-status]").forEach((button) => {
      const active = button.dataset.status === state.status;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  };

  const syncQuery = () => {
    const query = new URLSearchParams();
    if (state.search) query.set("q", state.search);
    if (state.status !== "all") query.set("status", state.status);
    if (state.area !== "all") query.set("area", state.area);
    if (state.topic !== "all") query.set("topic", state.topic);
    if (state.collection !== "all") query.set("source", state.collection);
    if (state.activity !== "all") query.set("activity", state.activity);
    if (state.sort !== "recent") query.set("sort", state.sort);
    const suffix = query.toString() ? `?${query}` : window.location.pathname;
    const next = query.toString() ? `${window.location.pathname}?${query}${window.location.hash}` : `${window.location.pathname}${window.location.hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      window.history.replaceState(null, "", next);
    }
    return suffix;
  };

  const problemCard = (problem, index) => {
    const latest = latestProgress(problem);
    return `
      <article class="problem-card" data-status="${escapeHTML(problem.status)}" id="card-${escapeHTML(problem.id)}">
        <div class="card-meta">
          <span class="status-badge ${problem.status === "partial" ? "partial" : ""}">${statusLabel(problem.status)}</span>
          <span class="area-badge">${escapeHTML(areaLabel(problem))}</span>
          <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <p class="card-topic">${escapeHTML(topicLabel(problem))}</p>
        <h3><a class="card-title-link" href="problems/${escapeHTML(problem.id)}/">${escapeHTML(problem.title)}</a></h3>
        <p class="summary">${escapeHTML(problem.summary)}</p>
        <div class="latest-progress">
          <div class="latest-meta">
            <time datetime="${escapeHTML(latest.date || "")}">${escapeHTML(displayDate(latest.date || problem.latest))}</time>
            <span class="maturity-badge">${escapeHTML(latest.maturity || "Audit finding")}</span>
          </div>
          <p>${escapeHTML(latest.title)}</p>
        </div>
        <div class="card-footer">
          <span>${escapeHTML(collectionLabel(problem))} · ${escapeHTML(problem.proposed)}</span>
          <button class="detail-button" type="button" data-open-problem="${escapeHTML(problem.id)}">Evidence</button>
        </div>
      </article>`;
  };

  const filteredProblems = () => {
    const query = normalize(state.search.trim());
    return problems
      .filter((problem) => state.status === "all" || problem.status === state.status)
      .filter((problem) => state.area === "all" || problem.area === state.area)
      .filter((problem) => state.topic === "all" || problem.topic === state.topic)
      .filter((problem) => state.collection === "all" || problem.collection === state.collection)
      .filter((problem) => {
        const year = Number(String(problem.latest).slice(0, 4));
        const catalogYear = Number(catalogDate.slice(0, 4));
        const recentYear = catalogYear - 2;
        if (state.activity === "audit-year") return year === catalogYear;
        if (state.activity === "recent") return year >= recentYear;
        if (state.activity === "older") return year < recentYear;
        return true;
      })
      .filter((problem) => !query || cachedSearchText(problem).includes(query))
      .sort((a, b) => {
        if (state.sort === "title") return a.title.localeCompare(b.title);
        if (state.sort === "oldest") return Number(a.proposed.slice(0, 4)) - Number(b.proposed.slice(0, 4));
        return dateValue(b.latest) - dateValue(a.latest) || a.title.localeCompare(b.title);
      });
  };

  const render = () => {
    const filtered = filteredProblems();
    elements.grid.innerHTML = filtered.map(problemCard).join("");
    elements.count.textContent = String(filtered.length);
    elements.label.textContent = filtered.length === 1 ? "active entry" : "active entries";
    elements.empty.hidden = filtered.length !== 0;
    elements.grid.hidden = filtered.length === 0;
    syncQuery();
  };

  const currentShareUrl = (id) => new URL(`problems/${id}/`, window.location.href).href;

  const contributionIssueUrl = (problem) => {
    const repository = String(catalog.meta.repositoryUrl || "").replace(/\/$/, "");
    const url = new URL(`${repository}/issues/new`, window.location.href);
    url.searchParams.set("template", "research-update.yml");
    if (problem) url.searchParams.set("title", `[Research update] ${problem.title}`);
    return url.href;
  };

  const showToast = (message) => {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
  };

  const copyText = (value, successMessage, promptLabel) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value)
        .then(() => showToast(successMessage))
        .catch(() => window.prompt(promptLabel, value));
      return;
    }
    window.prompt(promptLabel, value);
  };

  const sourceLink = (item) => item.url
    ? `<a href="${escapeHTML(safeUrl(item.url))}" rel="noreferrer">${escapeHTML(item.label || "Primary source")} ↗</a>`
    : "";

  const detailToView = (record) => ({
    id: record.id,
    title: record.title,
    status: record.status,
    area: record.taxonomy.field.id,
    topic: record.taxonomy.topic.id,
    collection: record.collection.id,
    proposed: record.dates.proposed,
    verified: record.dates.verified,
    type: record.question.type,
    summary: record.question.summary,
    importance: record.question.importance,
    remaining: record.question.unresolved,
    formal: record.formulation,
    problemSource: record.source,
    progress: record.evidence.progress,
    watch: record.evidence.cautions,
    interpretation: record.evidence.interpretation,
    origin: record.evidence.provenance,
    related: record.relations.relatedProblems,
    keywords: record.discovery.keywords,
    research: record.research
  });

  const loadProblemDetail = (problem) => {
    if (!detailCache.has(problem.id)) {
      const request = fetch(problem.detailUrl, { headers: { Accept: "application/json" } })
        .then((response) => {
          if (!response.ok) throw new Error(`Problem request failed with ${response.status}`);
          return response.json();
        })
        .then((record) => {
          if (record.id !== problem.id || record.kind !== "quantum-open-problem") {
            throw new Error("Problem response did not match the requested record");
          }
          return detailToView(record);
        })
        .catch((error) => {
          detailCache.delete(problem.id);
          throw error;
        });
      detailCache.set(problem.id, request);
    }
    return detailCache.get(problem.id);
  };

  const renderProblemDialog = (problem) => {
    const ordered = (problem.progress || []).slice().sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const position = problems.findIndex((item) => item.id === problem.id) + 1;
    const formal = problem.formal || {
      notation: "",
      statement: "Formal statement unavailable."
    };
    const problemSource = problem.problemSource;
    elements.dialogPosition.textContent = `Active problem ${position} of ${problems.length} · ${collectionLabel(problem)}`;
    clearTypesetMath();
    elements.dialogContent.innerHTML = `
      <div class="dialog-meta">
        <span class="status-badge ${problem.status === "partial" ? "partial" : ""}">${statusLabel(problem.status)}</span>
        <span class="area-badge">${escapeHTML(areaLabel(problem))}</span>
        <span class="meta-badge">${escapeHTML(topicLabel(problem))}</span>
        <span class="meta-badge">Proposed ${escapeHTML(problem.proposed)}</span>
        <span class="meta-badge">Verified ${escapeHTML(displayDate(problem.verified || catalog.meta.audited))}</span>
      </div>
      <h2 id="dialog-title">${escapeHTML(problem.title)}</h2>
      <p class="dialog-summary">${escapeHTML(problem.summary)}</p>
      <nav class="dialog-index" aria-label="Sections in this problem">
        <span>Jump to</span>
        <button type="button" data-dialog-target="context-${escapeHTML(problem.id)}">Why it matters</button>
        <button type="button" data-dialog-target="statement-${escapeHTML(problem.id)}">Statement</button>
        <button type="button" data-dialog-target="remaining-${escapeHTML(problem.id)}">What remains</button>
        <button type="button" data-dialog-target="progress-${escapeHTML(problem.id)}">Progress</button>
      </nav>
      <div class="problem-framing dialog-anchor" id="context-${escapeHTML(problem.id)}">
        <section class="framing-row" aria-labelledby="importance-${escapeHTML(problem.id)}">
          <h3 id="importance-${escapeHTML(problem.id)}">Why it matters</h3>
          <p>${escapeHTML(problem.importance)}</p>
        </section>
        ${problemSource ? `
          <section class="framing-row" aria-labelledby="source-${escapeHTML(problem.id)}">
            <h3 id="source-${escapeHTML(problem.id)}">Problem source</h3>
            <div class="problem-source-record">
              <strong>${escapeHTML(problemSource.title)}</strong>
              <p>${escapeHTML((problemSource.authors || []).join(", "))}</p>
              <p>${escapeHTML(problemSource.venue)}</p>
              <div class="problem-source-scope">
                <span>${escapeHTML(problemSource.relationship)}</span>
                <span>Statement locator: ${escapeHTML(problemSource.locator)}</span>
              </div>
              <a href="${escapeHTML(safeUrl(problemSource.url))}" rel="noreferrer">Read problem source ↗</a>
            </div>
          </section>` : ""}
      </div>
      <section class="formal-statement dialog-anchor" id="statement-${escapeHTML(problem.id)}" aria-labelledby="formal-${escapeHTML(problem.id)}">
        <div class="formal-heading">
          <div>
            <span class="dialog-section-label">Verified formulation</span>
            <h3 id="formal-${escapeHTML(problem.id)}">Formal statement</h3>
          </div>
          <span class="formal-source">Matched to the source and locator above</span>
        </div>
        ${formal.notation ? `
          <details class="formal-notation">
            <summary>Notation <span>Definitions used by the source statement</span></summary>
            <div class="formal-notation-body">${renderFormalMarkdown(formal.notation)}</div>
          </details>` : ""}
        <div class="formal-body">${renderFormalMarkdown(formal.statement)}</div>
        <div class="formal-actions">
          <button type="button" class="packet-action" data-copy-research-packet="${escapeHTML(problem.id)}">Copy for AI research</button>
          <a href="${escapeHTML(safeUrl(contributionIssueUrl(problem)))}" rel="noreferrer">Submit research result ↗</a>
        </div>
      </section>
      <div class="remaining-question dialog-anchor ${problem.status === "partial" ? "partial" : ""}" id="remaining-${escapeHTML(problem.id)}">
        <span>What remains</span>
        <p>${escapeHTML(problem.remaining)}</p>
      </div>
      ${problem.origin ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>${escapeHTML(problem.origin.label)}</strong><p>${escapeHTML(problem.origin.note)}</p></div>
          </div>
        </section>` : ""}
      <section class="dialog-section dialog-anchor" id="progress-${escapeHTML(problem.id)}" aria-labelledby="timeline-${escapeHTML(problem.id)}">
        <span class="dialog-section-label">Evidence ledger</span>
        <h3 id="timeline-${escapeHTML(problem.id)}">Recent progress</h3>
        <ol class="timeline">
          ${ordered.map((item) => `
            <li>
              <time datetime="${escapeHTML(item.date)}">${escapeHTML(displayDate(item.date))}</time>
              <div>
                <h4>${escapeHTML(item.title)}</h4>
                <p>${escapeHTML(item.detail)}</p>
                <div class="dialog-source-meta">
                  <span class="maturity-badge">${escapeHTML(item.maturity || "Unspecified")}</span>
                  ${item.strength ? `<span class="maturity-badge">${escapeHTML(item.strength)}</span>` : ""}
                  ${sourceLink(item)}
                </div>
              </div>
            </li>`).join("")}
        </ol>
      </section>
      ${(problem.watch || []).length ? `
        <section class="dialog-section">
          <span class="dialog-section-label">Claim watch</span>
          <h3>Scope and cautions</h3>
          ${problem.watch.map((note) => `
            <div class="watch-note">
              <span class="note-icon" aria-hidden="true">!</span>
              <div>
                <strong>${escapeHTML(note.label || "Caution")}</strong>
                <p>${escapeHTML(note.text)} ${note.url ? `<a href="${escapeHTML(safeUrl(note.url))}" rel="noreferrer">Source ↗</a>` : ""}</p>
              </div>
            </div>`).join("")}
        </section>` : ""}
      ${problem.interpretation ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>Interpretation note</strong><p>${escapeHTML(problem.interpretation)}</p></div>
          </div>
        </section>` : ""}
      ${(problem.related || []).length ? `
        <section class="dialog-section">
          <span class="dialog-section-label">Related entries</span>
          <div class="related-links">${problem.related.map((id) => {
            const related = byId.get(id);
            return related ? `<button type="button" data-open-problem="${escapeHTML(id)}">${escapeHTML(related.title)}</button>` : "";
          }).join("")}</div>
        </section>` : ""}
      <div class="dialog-footer">
        <p>Record ${escapeHTML(problem.id)}</p>
        <div class="dialog-footer-actions">
          <a class="record-page-link" href="problems/${escapeHTML(problem.id)}/">Open full record ↗</a>
          <button type="button" class="copy-link-button" data-copy-link="${escapeHTML(problem.id)}">Copy link to this problem</button>
        </div>
      </div>`;
    typesetFormalMath();
  };

  const openProblem = (id, updateHash = true) => {
    const compactProblem = byId.get(id);
    if (!compactProblem) return;
    activeProblemId = id;
    clearTypesetMath();
    elements.dialogPosition.textContent = `Loading ${compactProblem.title}`;
    elements.dialogContent.innerHTML = `
      <div class="dialog-loading" role="status">
        <span aria-hidden="true"></span>
        <p>Loading the formal statement and evidence…</p>
      </div>`;
    if (!elements.dialog.open) elements.dialog.showModal();
    document.body.classList.add("dialog-open");
    if (updateHash && window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    }
    elements.closeDialog.focus();
    loadProblemDetail(compactProblem)
      .then((problem) => {
        if (activeProblemId === id && elements.dialog.open) renderProblemDialog(problem);
      })
      .catch((error) => {
        console.error("Problem detail could not be loaded", error);
        if (activeProblemId !== id || !elements.dialog.open) return;
        elements.dialogPosition.textContent = "Problem detail unavailable";
        elements.dialogContent.innerHTML = `
          <div class="dialog-load-error" role="alert">
            <h2>Could not load this record</h2>
            <p>Check the connection and open the problem again.</p>
          </div>`;
      });
  };

  const closeProblem = (clearHash = true) => {
    activeProblemId = null;
    if (elements.dialog.open) elements.dialog.close();
    document.body.classList.remove("dialog-open");
    if (clearHash && byId.has(window.location.hash.slice(1))) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  const renderWatchlist = () => {
    elements.watchGrid.innerHTML = (catalog.watchlist || []).map((item) => `
      <article class="watch-card ${item.featured ? "featured" : ""}">
        <span class="watch-badge ${escapeHTML(item.tone || "")}">${escapeHTML(item.label)}</span>
        <h3>${escapeHTML(item.title)}</h3>
        <p>${escapeHTML(item.text)}</p>
        <footer>
          <span>${escapeHTML(item.sourceLabel || "Primary-source check")}</span>
          ${item.problemId && byId.has(item.problemId)
            ? `<button type="button" data-open-problem="${escapeHTML(item.problemId)}">Open evidence ↗</button>`
            : sourceLink(item)}
        </footer>
      </article>`).join("");
  };

  const renderAreaMap = () => {
    elements.fieldBrowserCount.textContent = `${activeAreaIds.size} research fields`;
    elements.areaGrid.innerHTML = areas
      .filter((area) => activeAreaIds.has(area.id))
      .map((area, index) => {
        const areaProblems = problems.filter((problem) => problem.area === area.id);
        return `
          <button class="area-card" type="button" data-filter-area="${escapeHTML(area.id)}">
            <span class="area-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="area-count"><strong>${areaProblems.length}</strong> active</span>
            <strong class="area-title">${escapeHTML(area.label)}</strong>
            <span class="area-description">${escapeHTML(area.description)}</span>
            <span class="area-action">Explore field <span aria-hidden="true">↘</span></span>
          </button>`;
      }).join("");
  };

  const renderSignals = () => {
    elements.signals.innerHTML = problems
      .slice()
      .sort((a, b) => dateValue(b.latest) - dateValue(a.latest))
      .slice(0, 3)
      .map((problem) => {
        const latest = latestProgress(problem);
        return `
          <a href="#${escapeHTML(problem.id)}">
            <time datetime="${escapeHTML(latest.date)}">${escapeHTML(displayShortDate(latest.date))}</time>
            <span>${escapeHTML(latest.title)}</span>
          </a>`;
      }).join("");
  };

  const clearFilters = () => {
    Object.assign(state, {
      status: "all",
      search: "",
      area: "all",
      topic: "all",
      collection: "all",
      activity: "all",
      sort: "recent"
    });
    syncControls();
    render();
  };

  document.addEventListener("click", (event) => {
    const dialogTargetButton = event.target.closest("[data-dialog-target]");
    if (dialogTargetButton) {
      document.getElementById(dialogTargetButton.dataset.dialogTarget)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const areaButton = event.target.closest("[data-filter-area]");
    if (areaButton) {
      state.area = areaButton.dataset.filterArea;
      state.topic = "all";
      syncControls();
      render();
      document.querySelector("#problem-explorer").scrollIntoView({ behavior: "smooth" });
      return;
    }
    const openButton = event.target.closest("[data-open-problem]");
    if (openButton) {
      openProblem(openButton.dataset.openProblem);
      return;
    }
    if (event.target.closest("[data-clear-filters]")) clearFilters();
    const packetButton = event.target.closest("[data-copy-research-packet]");
    if (packetButton) {
      const id = packetButton.dataset.copyResearchPacket;
      const originalLabel = packetButton.textContent;
      packetButton.disabled = true;
      packetButton.setAttribute("aria-busy", "true");
      packetButton.textContent = "Preparing…";
      fetch(`packets/${encodeURIComponent(id)}.md`, { headers: { Accept: "text/markdown" } })
        .then((response) => {
          if (!response.ok) throw new Error(`Research brief request failed with ${response.status}`);
          return response.text();
        })
        .then((brief) => copyText(brief, "Copied for AI research", "Copy this problem for AI research"))
        .catch((error) => {
          console.error("Research brief could not be loaded", error);
          showToast("Research brief could not be loaded");
        })
        .finally(() => {
          packetButton.disabled = false;
          packetButton.removeAttribute("aria-busy");
          packetButton.textContent = originalLabel;
        });
      return;
    }
    const copyButton = event.target.closest("[data-copy-link]");
    if (copyButton) {
      const link = currentShareUrl(copyButton.dataset.copyLink);
      copyText(link, "Problem link copied", "Copy this link");
    }
  });

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.status = button.dataset.status;
      syncControls();
      render();
    });
  });

  let searchDebounce = 0;
  elements.search.addEventListener("input", () => {
    window.clearTimeout(searchDebounce);
    searchDebounce = window.setTimeout(() => {
      state.search = elements.search.value;
      render();
    }, 120);
  });
  elements.area.addEventListener("change", () => {
    state.area = elements.area.value;
    state.topic = "all";
    syncTopicOptions();
    elements.topic.value = state.topic;
    render();
  });
  elements.topic.addEventListener("change", () => { state.topic = elements.topic.value; render(); });
  elements.collection.addEventListener("change", () => { state.collection = elements.collection.value; render(); });
  elements.activity.addEventListener("change", () => { state.activity = elements.activity.value; render(); });
  elements.sort.addEventListener("change", () => { state.sort = elements.sort.value; render(); });
  elements.clear.addEventListener("click", clearFilters);
  elements.closeDialog.addEventListener("click", () => closeProblem());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target === elements.dialog) closeProblem();
  });
  elements.dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (byId.has(window.location.hash.slice(1))) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !elements.dialog.open && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      event.preventDefault();
      elements.search.focus();
    }
  });

  window.addEventListener("hashchange", () => {
    const id = window.location.hash.slice(1);
    if (byId.has(id)) openProblem(id, false);
    else if (elements.dialog.open) closeProblem(false);
  });

  const preferredTheme = (() => {
    try { return localStorage.getItem("quantum-open-problems-theme") || localStorage.getItem("qi-theme"); } catch { return null; }
  })();
  if (preferredTheme === "dark") document.documentElement.dataset.theme = "dark";
  const startsDark = document.documentElement.dataset.theme === "dark";
  elements.theme.setAttribute("aria-pressed", String(startsDark));
  elements.theme.setAttribute("aria-label", startsDark ? "Switch to light theme" : "Switch to dark theme");
  elements.theme.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    elements.theme.setAttribute("aria-pressed", String(dark));
    elements.theme.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("quantum-open-problems-theme", dark ? "dark" : "light"); } catch {}
  });

  const totals = problems.reduce((result, problem) => {
    result[problem.status] += 1;
    return result;
  }, { open: 0, partial: 0 });
  document.querySelector("#open-total").textContent = totals.open;
  document.querySelector("#partial-total").textContent = totals.partial;
  document.querySelector("#active-total").textContent = problems.length;
  document.querySelector("#area-total").textContent = activeAreaIds.size;
  document.querySelector("#archive-total").textContent = catalog.meta.totalArchive;
  document.querySelector("#active-total-method").textContent = problems.length;
  document.querySelector("#area-total-method").textContent = activeAreaIds.size;
  document.querySelector("#collection-total-method").textContent = collections.length;
  document.querySelector("#catalog-date-hero").textContent = displayDate(catalogDate);
  document.querySelector("#catalog-date-method").textContent = displayDate(catalogDate);
  document.querySelector('[data-status="all"] span').textContent = problems.length;
  document.querySelector('[data-status="open"] span').textContent = totals.open;
  document.querySelector('[data-status="partial"] span').textContent = totals.partial;

  const catalogYear = Number(catalogDate.slice(0, 4));
  const recentYear = catalogYear - 2;
  document.querySelector("#activity-audit-year").textContent = `Updated in ${catalogYear}`;
  document.querySelector("#activity-recent").textContent = `Since ${recentYear}`;
  document.querySelector('#activity-filter option[value="older"]').textContent = `Before ${recentYear}`;

  if (catalog.meta.repositoryUrl) {
    elements.repository.href = safeUrl(catalog.meta.repositoryUrl);
  } else {
    elements.repository.hidden = true;
  }

  readQuery();
  syncControls();
  render();
  renderAreaMap();
  renderSignals();
  renderWatchlist();

  const initialId = window.location.hash.slice(1);
  if (byId.has(initialId)) window.setTimeout(() => openProblem(initialId, false), 0);
})();
