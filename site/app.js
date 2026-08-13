(() => {
  "use strict";

  const catalog = window.QI_OPEN_PROBLEMS;
  if (!catalog || !Array.isArray(catalog.problems)) {
    document.querySelector("#problem-grid").innerHTML =
      '<p class="data-error">The problem catalog could not be loaded.</p>';
    return;
  }

  const problems = catalog.problems.slice();
  const byId = new Map(problems.map((problem) => [problem.id, problem]));
  const elements = {
    grid: document.querySelector("#problem-grid"),
    watchGrid: document.querySelector("#watch-grid"),
    search: document.querySelector("#problem-search"),
    category: document.querySelector("#category-filter"),
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
    category: "all",
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

  const statusLabel = (status) => status === "partial" ? "Partially solved" : "Open";

  const latestProgress = (problem) => (problem.progress || [])
    .slice()
    .sort((a, b) => dateValue(b.date) - dateValue(a.date))[0] || {
      date: problem.latest,
      title: "No later exact result located",
      maturity: "Audit finding"
    };

  const searchText = (problem) => normalize([
    problem.title,
    problem.category,
    problem.collection,
    problem.type,
    problem.summary,
    problem.remaining,
    ...(problem.keywords || []),
    ...(problem.progress || []).flatMap((item) => [item.title, item.detail, item.maturity, item.strength])
  ].join(" "));

  const fillSelect = (select, values) => {
    values.sort((a, b) => a.localeCompare(b)).forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.append(option);
    });
  };

  fillSelect(elements.category, [...new Set(problems.map((problem) => problem.category))]);
  fillSelect(elements.collection, [...new Set(problems.map((problem) => problem.collection))]);

  const readQuery = () => {
    const query = new URLSearchParams(window.location.search);
    const validStatus = ["all", "open", "partial"];
    const validActivity = ["all", "2026", "2024", "older"];
    const validSort = ["recent", "oldest", "title"];
    state.status = validStatus.includes(query.get("status")) ? query.get("status") : "all";
    state.search = query.get("q") || "";
    state.category = [...elements.category.options].some((option) => option.value === query.get("topic"))
      ? query.get("topic") : "all";
    state.collection = [...elements.collection.options].some((option) => option.value === query.get("source"))
      ? query.get("source") : "all";
    state.activity = validActivity.includes(query.get("activity")) ? query.get("activity") : "all";
    state.sort = validSort.includes(query.get("sort")) ? query.get("sort") : "recent";
  };

  const syncControls = () => {
    elements.search.value = state.search;
    elements.category.value = state.category;
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
    if (state.category !== "all") query.set("topic", state.category);
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
          <span class="meta-badge">${escapeHTML(problem.category)}</span>
          <span class="card-index">${String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>${escapeHTML(problem.title)}</h3>
        <p class="summary">${escapeHTML(problem.summary)}</p>
        <div class="latest-progress">
          <div class="latest-meta">
            <time datetime="${escapeHTML(latest.date || "")}">${escapeHTML(displayDate(latest.date || problem.latest))}</time>
            <span class="maturity-badge">${escapeHTML(latest.maturity || "Audit finding")}</span>
          </div>
          <p>${escapeHTML(latest.title)}</p>
        </div>
        <div class="card-footer">
          <span>${escapeHTML(problem.collection)} · ${escapeHTML(problem.proposed)}</span>
          <button class="detail-button" type="button" data-open-problem="${escapeHTML(problem.id)}">Evidence</button>
        </div>
      </article>`;
  };

  const filteredProblems = () => {
    const query = normalize(state.search.trim());
    return problems
      .filter((problem) => state.status === "all" || problem.status === state.status)
      .filter((problem) => state.category === "all" || problem.category === state.category)
      .filter((problem) => state.collection === "all" || problem.collection === state.collection)
      .filter((problem) => {
        const year = Number(String(problem.latest).slice(0, 4));
        if (state.activity === "2026") return year === 2026;
        if (state.activity === "2024") return year >= 2024;
        if (state.activity === "older") return year < 2024;
        return true;
      })
      .filter((problem) => !query || searchText(problem).includes(query))
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

  const currentShareUrl = (id) => {
    const url = new URL(window.location.href);
    url.hash = id;
    return url.href;
  };

  const sourceLink = (item) => item.url
    ? `<a href="${escapeHTML(safeUrl(item.url))}" rel="noreferrer">${escapeHTML(item.label || "Primary source")} ↗</a>`
    : "";

  const renderProblemDialog = (problem) => {
    const ordered = (problem.progress || []).slice().sort((a, b) => dateValue(b.date) - dateValue(a.date));
    const position = problems.findIndex((item) => item.id === problem.id) + 1;
    elements.dialogPosition.textContent = `Active problem ${position} of ${problems.length} · ${problem.collection}`;
    elements.dialogContent.innerHTML = `
      <div class="dialog-meta">
        <span class="status-badge ${problem.status === "partial" ? "partial" : ""}">${statusLabel(problem.status)}</span>
        <span class="meta-badge">${escapeHTML(problem.category)}</span>
        <span class="meta-badge">Proposed ${escapeHTML(problem.proposed)}</span>
      </div>
      <h2 id="dialog-title">${escapeHTML(problem.title)}</h2>
      <p class="dialog-summary">${escapeHTML(problem.summary)}</p>
      <div class="remaining-question ${problem.status === "partial" ? "partial" : ""}">
        <span>What remains</span>
        <p>${escapeHTML(problem.remaining)}</p>
      </div>
      <section class="dialog-section" aria-labelledby="timeline-${escapeHTML(problem.id)}">
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
        <p>Last verified ${escapeHTML(displayDate(catalog.meta.audited))}</p>
        <button type="button" class="copy-link-button" data-copy-link="${escapeHTML(problem.id)}">Copy link to this problem</button>
      </div>`;
  };

  const openProblem = (id, updateHash = true) => {
    const problem = byId.get(id);
    if (!problem) return;
    renderProblemDialog(problem);
    if (!elements.dialog.open) elements.dialog.showModal();
    document.body.classList.add("dialog-open");
    if (updateHash && window.location.hash !== `#${id}`) {
      window.history.pushState(null, "", `${window.location.pathname}${window.location.search}#${id}`);
    }
    elements.closeDialog.focus();
  };

  const closeProblem = (clearHash = true) => {
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

  const clearFilters = () => {
    Object.assign(state, {
      status: "all",
      search: "",
      category: "all",
      collection: "all",
      activity: "all",
      sort: "recent"
    });
    syncControls();
    render();
  };

  document.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-problem]");
    if (openButton) {
      openProblem(openButton.dataset.openProblem);
      return;
    }
    if (event.target.closest("[data-clear-filters]")) clearFilters();
    const copyButton = event.target.closest("[data-copy-link]");
    if (copyButton) {
      const link = currentShareUrl(copyButton.dataset.copyLink);
      const showCopied = () => {
        elements.toast.textContent = "Problem link copied";
        elements.toast.classList.add("is-visible");
        window.setTimeout(() => elements.toast.classList.remove("is-visible"), 1800);
      };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(link).then(showCopied).catch(() => {});
      } else {
        window.prompt("Copy this link", link);
      }
    }
  });

  document.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
      state.status = button.dataset.status;
      syncControls();
      render();
    });
  });

  elements.search.addEventListener("input", () => {
    state.search = elements.search.value;
    render();
  });
  elements.category.addEventListener("change", () => { state.category = elements.category.value; render(); });
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
    try { return localStorage.getItem("qi-theme"); } catch { return null; }
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
    try { localStorage.setItem("qi-theme", dark ? "dark" : "light"); } catch {}
  });

  const totals = problems.reduce((result, problem) => {
    result[problem.status] += 1;
    return result;
  }, { open: 0, partial: 0 });
  document.querySelector("#open-total").textContent = totals.open;
  document.querySelector("#partial-total").textContent = totals.partial;
  document.querySelector("#active-total").textContent = problems.length;
  document.querySelector('[data-status="all"] span').textContent = problems.length;
  document.querySelector('[data-status="open"] span').textContent = totals.open;
  document.querySelector('[data-status="partial"] span').textContent = totals.partial;

  if (catalog.meta.repositoryUrl) {
    elements.repository.href = safeUrl(catalog.meta.repositoryUrl);
  } else {
    elements.repository.hidden = true;
  }

  readQuery();
  syncControls();
  render();
  renderWatchlist();

  const initialId = window.location.hash.slice(1);
  if (byId.has(initialId)) window.setTimeout(() => openProblem(initialId, false), 0);
})();
