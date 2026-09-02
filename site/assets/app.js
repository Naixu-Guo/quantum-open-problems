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

  // ------------------------------------------------------------------ keyboard
  document.addEventListener("keydown", (event) => {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) return;
    const search = $("#problem-search") || $("#site-search");
    if (search) { event.preventDefault(); search.focus(); }
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
    partial: { label: "Partially solved", title: "A substantial subcase is settled; the general statement remains open." },
    solved: { label: "Solved", title: "A complete solution is known; see Progress and Comment." }
  };
  const cardHtml = (problem) => {
    const meta = statusMeta[problem.statusSlug];
    return `<article class="problem-card status-${problem.statusSlug}" data-id="${problem.id}">
  <div class="card-head">
    <span class="status-tag status-${problem.statusSlug} status-tag-small" title="${meta.title}">${meta.label}</span>
    <span class="card-id">${problem.id}</span>
  </div>
  <h3 class="card-title"><a href="${root}problem/${problem.id}/">${problem.title}</a></h3>
  <div class="card-statement">${problem.statement}</div>
  <ul class="tag-list">${problem.tags.map((tag) => `<li><a class="tag" href="${root}tag/${slugify(tag)}/">${escapeHtml(tag)}</a></li>`).join("")}</ul>
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
    const statusButtons = $$(".segmented-control button");
    const tagSelect = $("#tag-filter");
    const sortSelect = $("#sort-filter");
    const count = $("#results-count");
    const label = $("#results-label");
    const empty = $("#empty-state");
    const params = new URLSearchParams(location.search);
    const state = {
      q: (params.get("q") || "").trim().toLowerCase(),
      status: params.get("status") || "all",
      tag: params.get("tag") || "all",
      sort: params.get("sort") || "title"
    };
    if (searchInput) searchInput.value = params.get("q") || "";
    if (tagSelect && [...tagSelect.options].some((option) => option.value === state.tag)) tagSelect.value = state.tag;
    else state.tag = "all";
    if (sortSelect && [...sortSelect.options].some((option) => option.value === state.sort)) sortSelect.value = state.sort;
    else state.sort = "title";
    statusButtons.forEach((button) => {
      const active = button.dataset.status === state.status;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const statusOrder = { unsolved: 0, partial: 1, solved: 2 };
    const apply = () => {
      const terms = state.q.split(/\s+/).filter(Boolean);
      let visible = 0;
      rows.forEach((row) => {
        const matchesStatus = state.status === "all" || row.dataset.status === state.status;
        const matchesTag = state.tag === "all" || row.dataset.tags.split(" ").includes(state.tag);
        const haystack = row.dataset.search;
        const matchesQuery = terms.every((term) => haystack.includes(term));
        const show = matchesStatus && matchesTag && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });
      const sorted = rows.slice().sort((a, b) => {
        if (state.sort === "updated") return b.dataset.updated.localeCompare(a.dataset.updated) || a.dataset.title.localeCompare(b.dataset.title);
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
      if (state.tag !== "all") next.set("tag", state.tag);
      if (state.sort !== "title") next.set("sort", state.sort);
      const query = next.toString();
      history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}`);
    };

    searchInput?.addEventListener("input", () => { state.q = searchInput.value.trim().toLowerCase(); apply(); });
    statusButtons.forEach((button) => button.addEventListener("click", () => {
      state.status = button.dataset.status;
      statusButtons.forEach((other) => {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      apply();
    }));
    tagSelect?.addEventListener("change", () => { state.tag = tagSelect.value; apply(); });
    sortSelect?.addEventListener("change", () => { state.sort = sortSelect.value; apply(); });
    const clear = () => {
      state.q = ""; state.status = "all"; state.tag = "all"; state.sort = "title";
      if (searchInput) searchInput.value = "";
      if (tagSelect) tagSelect.value = "all";
      if (sortSelect) sortSelect.value = "title";
      statusButtons.forEach((button) => {
        const active = button.dataset.status === "all";
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      apply();
    };
    $("#clear-filters")?.addEventListener("click", clear);
    $$("[data-clear-filters]").forEach((button) => button.addEventListener("click", clear));
    apply();
  }
})();
