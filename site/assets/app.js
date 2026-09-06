// QIQCOP Zoo client script: theme toggle, dialogs, copy buttons, random
// problem panels, directory filtering. No dependencies.
(() => {
  const root = document.body.dataset.root || "";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // ------------------------------------------------------------------ theme
  const themeButton = $("#theme-toggle");
  const syncTheme = () => {
    const dark = document.documentElement.dataset.theme === "dark";
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    }
  };
  syncTheme();
  themeButton?.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    try { localStorage.setItem("qiqcop-theme", dark ? "dark" : "light"); } catch (error) { /* ignore */ }
    syncTheme();
  });

  // ------------------------------------------------------------------ toast
  const toast = $("#toast");
  let toastTimer = 0;
  const notify = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  // ------------------------------------------------------------------ copy
  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.append(area);
      area.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      area.remove();
      return ok;
    }
  };
  document.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const source = document.getElementById(button.dataset.copy);
    if (!source) return;
    const ok = await copyText(source.textContent);
    notify(ok ? "Copied to clipboard" : "Copy failed; select the text manually");
  });

  // ------------------------------------------------------------------ dialogs
  document.addEventListener("click", (event) => {
    const opener = event.target.closest("[data-dialog]");
    if (!opener) return;
    const dialog = document.getElementById(opener.dataset.dialog);
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  });
  $$(".dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  // ------------------------------------------------------------------ native share
  const nativeShare = $(".native-share");
  if (nativeShare && navigator.share) {
    nativeShare.hidden = false;
    nativeShare.addEventListener("click", () => {
      navigator.share({ title: nativeShare.dataset.shareTitle, url: nativeShare.dataset.shareUrl }).catch(() => {});
    });
  }

  // ------------------------------------------------------------------ random buttons
  // Jump straight to a random problem instead of loading the redirect page,
  // which would flash the intermediate layout. Modified clicks keep the link.
  document.addEventListener("click", (event) => {
    const link = event.target.closest(".random-pill");
    const ids = window.QIQCOP_RANDOM;
    if (!link || !ids || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const pool = link.classList.contains("random-solved") ? ids.solved : ids.unsolved;
    if (!Array.isArray(pool) || pool.length === 0) return;
    const currentId = document.querySelector("article.problem")?.id;
    const candidates = pool.length > 1 ? pool.filter((id) => id !== currentId) : pool;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    event.preventDefault();
    location.href = `${root}problem/${pick}/`;
  });

  // ------------------------------------------------------------------ local times
  // Timestamps are rendered in UTC at build time; show them in the viewer's zone.
  $$("time[data-localize]").forEach((element) => {
    const date = new Date(element.getAttribute("datetime"));
    if (Number.isNaN(date.getTime())) return;
    try {
      element.textContent = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(date);
      element.title = date.toISOString();
    } catch (error) { /* keep the UTC text */ }
  });

  // ------------------------------------------------------------------ keyboard
  // "/" focuses the search box of the page (home panel or catalog sidebar);
  // on pages without one it opens the catalog with the search box focused.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) return;
    event.preventDefault();
    const search = $("#problem-search") || $("#home-search");
    if (search) search.focus();
    else location.href = `${root}problems/#search`;
  });

  // ------------------------------------------------------------------ math helper
  const markClipped = (element) => {
    $$(".card-statement", element).forEach((statement) => {
      statement.classList.toggle("is-clipped", statement.scrollHeight > statement.clientHeight + 4);
    });
  };
  const typeset = (element) => {
    const mj = window.MathJax;
    if (!mj || !mj.startup || !mj.startup.promise) return;
    mj.startup.promise.then(() => {
      if (mj.typesetClear) mj.typesetClear([element]);
      return mj.typesetPromise([element]);
    }).then(() => markClipped(element)).catch((error) => console.error("MathJax typeset failed", error));
  };

  // ------------------------------------------------------------------ random panels (home)
  const index = window.QIQCOP_INDEX;
  const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  const slugify = (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const statusMeta = {
    unsolved: { label: "Unsolved", title: "No complete solution is known." },
    solved: { label: "Solved", title: "A complete solution is known; see Progress and Comment." }
  };
  const tagHtml = (name, kind) => `<li><a class="tag tag-${kind}" href="${root}tag/${slugify(name)}/" title="${kind === "field" ? "Field" : "Topic"}: ${escapeHtml(name)}">${escapeHtml(name)}</a></li>`;
  const cardHtml = (problem) => {
    const meta = statusMeta[problem.statusSlug];
    return `<article class="problem-card status-${problem.statusSlug}" data-id="${problem.id}">
  <div class="card-head">
    <span class="status-tag status-${problem.statusSlug} status-tag-small" title="${meta.title}">${meta.label}</span>
    <span class="card-id">${problem.id}</span>
  </div>
  <h3 class="card-title"><a href="${root}problem/${problem.id}/">${problem.title}</a></h3>
  <div class="card-statement">${problem.statement}</div>
  <ul class="tag-list">${(problem.fields || []).map((name) => tagHtml(name, "field")).join("")}${(problem.topics || []).map((name) => tagHtml(name, "topic")).join("")}</ul>
  <a class="card-link" href="${root}problem/${problem.id}/">Open problem page <span aria-hidden="true">→</span></a>
</article>`;
  };
  if (index && Array.isArray(index.problems)) {
    const pools = {
      unsolved: index.problems.filter((problem) => problem.statusSlug !== "solved"),
      solved: index.problems.filter((problem) => problem.statusSlug === "solved")
    };
    const pick = (pool, excludeId) => {
      const candidates = pool.length > 1 ? pool.filter((problem) => problem.id !== excludeId) : pool;
      return candidates[Math.floor(Math.random() * candidates.length)];
    };
    const fill = (slot, problem, animate) => {
      if (!problem) return;
      const swap = () => {
        slot.innerHTML = cardHtml(problem);
        slot.classList.remove("is-fading");
        typeset(slot);
      };
      if (animate) {
        slot.classList.add("is-fading");
        window.setTimeout(swap, 120);
      } else {
        swap();
      }
    };
    $$(".random-slot").forEach((slot) => {
      const pool = pools[slot.dataset.pool] || [];
      const current = slot.querySelector("[data-id]")?.dataset.id;
      // Randomize on load so each visit starts from a different problem.
      fill(slot, pick(pool, current), false);
    });
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-shuffle]");
      if (!button) return;
      const slot = $(`.random-slot[data-pool="${button.dataset.shuffle}"]`);
      if (!slot) return;
      const pool = pools[button.dataset.shuffle] || [];
      const current = slot.querySelector("[data-id]")?.dataset.id;
      button.classList.remove("is-busy");
      void button.offsetWidth;
      button.classList.add("is-busy");
      fill(slot, pick(pool, current), true);
    });
  }

  // ------------------------------------------------------------------ directory filters
  const list = $("#problem-list");
  if (list) {
    const rows = $$(".problem-row", list);
    const searchInput = $("#problem-search");
    const statusButtons = $$(".filter-panel [data-status]");
    const fieldButtons = $$(".filter-panel [data-field]");
    const topicSelect = $("#topic-filter");
    const sortSelect = $("#sort-filter");
    const count = $("#results-count");
    const label = $("#results-label");
    const empty = $("#empty-state");
    const params = new URLSearchParams(location.search);
    const fieldSlugs = new Set(fieldButtons.map((button) => button.dataset.field));
    const topicSlugs = new Set(topicSelect ? [...topicSelect.options].map((option) => option.value) : []);
    const state = {
      q: (params.get("q") || "").trim().toLowerCase(),
      status: params.get("status") || "all",
      field: params.get("field") || "all",
      topic: params.get("topic") || "all",
      sort: params.get("sort") || "updated"
    };
    // Links written before the taxonomy was split use ?tag=; honour them.
    const legacyTag = params.get("tag");
    if (legacyTag) {
      if (fieldSlugs.has(legacyTag) && state.field === "all") state.field = legacyTag;
      else if (topicSlugs.has(legacyTag) && state.topic === "all") state.topic = legacyTag;
    }
    if (!["all", "unsolved", "solved"].includes(state.status)) state.status = "all";
    if (!fieldSlugs.has(state.field)) state.field = "all";
    if (!topicSlugs.has(state.topic)) state.topic = "all";
    if (!sortSelect || ![...sortSelect.options].some((option) => option.value === state.sort)) state.sort = "updated";
    if (searchInput) searchInput.value = params.get("q") || "";
    if (topicSelect) topicSelect.value = state.topic;
    if (sortSelect) sortSelect.value = state.sort;

    const activate = (buttons, attr, value) => buttons.forEach((button) => {
      const active = button.dataset[attr] === value;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    activate(statusButtons, "status", state.status);
    activate(fieldButtons, "field", state.field);

    const statusOrder = { unsolved: 0, solved: 1 };
    const apply = () => {
      const terms = state.q.split(/\s+/).filter(Boolean);
      let visible = 0;
      rows.forEach((row) => {
        const matchesStatus = state.status === "all" || row.dataset.status === state.status;
        const matchesField = state.field === "all" || row.dataset.fields.split(" ").includes(state.field);
        const matchesTopic = state.topic === "all" || row.dataset.topics.split(" ").includes(state.topic);
        const haystack = row.dataset.search;
        const matchesQuery = terms.every((term) => haystack.includes(term));
        const show = matchesStatus && matchesField && matchesTopic && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });
      const sorted = rows.slice().sort((a, b) => {
        if (state.sort === "updated") return Date.parse(b.dataset.updated) - Date.parse(a.dataset.updated)
          || Date.parse(b.dataset.created) - Date.parse(a.dataset.created)
          || a.dataset.id.localeCompare(b.dataset.id, "en");
        if (state.sort === "status") return statusOrder[a.dataset.status] - statusOrder[b.dataset.status] || a.dataset.title.localeCompare(b.dataset.title);
        return a.dataset.title.localeCompare(b.dataset.title);
      });
      sorted.forEach((row) => list.append(row));
      if (count) count.textContent = String(visible);
      if (label) label.textContent = visible === 1 ? "problem" : "problems";
      if (empty) empty.hidden = visible > 0;
      const next = new URLSearchParams();
      if (state.q) next.set("q", state.q);
      if (state.status !== "all") next.set("status", state.status);
      if (state.field !== "all") next.set("field", state.field);
      if (state.topic !== "all") next.set("topic", state.topic);
      if (state.sort !== "updated") next.set("sort", state.sort);
      const query = next.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
    };

    searchInput?.addEventListener("input", () => { state.q = searchInput.value.trim().toLowerCase(); apply(); });
    statusButtons.forEach((button) => button.addEventListener("click", () => {
      state.status = button.dataset.status;
      activate(statusButtons, "status", state.status);
      apply();
    }));
    fieldButtons.forEach((button) => button.addEventListener("click", () => {
      state.field = button.dataset.field;
      activate(fieldButtons, "field", state.field);
      apply();
    }));
    topicSelect?.addEventListener("change", () => { state.topic = topicSelect.value; apply(); });
    sortSelect?.addEventListener("change", () => { state.sort = sortSelect.value; apply(); });
    const clear = () => {
      state.q = ""; state.status = "all"; state.field = "all"; state.topic = "all"; state.sort = "updated";
      if (searchInput) searchInput.value = "";
      if (topicSelect) topicSelect.value = "all";
      if (sortSelect) sortSelect.value = "updated";
      activate(statusButtons, "status", "all");
      activate(fieldButtons, "field", "all");
      apply();
    };
    $("#clear-filters")?.addEventListener("click", clear);
    $$("[data-clear-filters]").forEach((button) => button.addEventListener("click", clear));
    apply();
    if (location.hash === "#search" && searchInput) searchInput.focus();
  }
})();
