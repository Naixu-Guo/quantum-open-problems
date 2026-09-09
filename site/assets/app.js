// QIQCOP Zoo client script: theme toggle, dialogs, copy buttons, search
// suggestions, random problem panels, directory filtering. No dependencies.
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

  // ------------------------------------------------------------------ suggested topic (home)
  const index = window.QIQCOP_INDEX;
  const homeSearch = $("#home-search");
  if (homeSearch && Array.isArray(index?.problems)) {
    const topics = [...new Set(index.problems.flatMap((problem) => problem.topics || []))];
    const suggestedTopic = topics[Math.floor(Math.random() * topics.length)];
    if (suggestedTopic) {
      homeSearch.placeholder = document.activeElement === homeSearch ? "" : suggestedTopic;
      homeSearch.addEventListener("focus", () => { homeSearch.placeholder = ""; });
      homeSearch.addEventListener("blur", () => { homeSearch.placeholder = suggestedTopic; });
      homeSearch.form?.addEventListener("submit", () => {
        if (!homeSearch.value.trim()) homeSearch.value = suggestedTopic;
      });
    }
  }

  // ------------------------------------------------------------------ random panels (home)
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
    const historicalTags = window.QIQCOP_LEGACY_TAGS || {};
    state.legacyTag = [params.get("legacyTag"), params.get("tag"), params.get("field"), params.get("topic")]
      .find((key) => key && Object.hasOwn(historicalTags, key) && Array.isArray(historicalTags[key]?.ids) && !fieldSlugs.has(key) && !topicSlugs.has(key)) || "";
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
        const matchesHistory = !state.legacyTag || historicalTags[state.legacyTag].ids.includes(row.dataset.id);
        const show = matchesStatus && matchesField && matchesTopic && matchesQuery && matchesHistory;
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
      if (label) label.textContent = (visible === 1 ? "record" : "records") + (state.legacyTag ? ` · historical classification: ${historicalTags[state.legacyTag].name}` : "");
      if (empty) empty.hidden = visible > 0;
      const next = new URLSearchParams();
      if (state.q) next.set("q", state.q);
      if (state.status !== "all") next.set("status", state.status);
      if (state.field !== "all") next.set("field", state.field);
      if (state.topic !== "all") next.set("topic", state.topic);
      if (state.sort !== "updated") next.set("sort", state.sort);
      if (state.legacyTag) next.set("legacyTag", state.legacyTag);
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
      state.legacyTag = "";
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

  // ------------------------------------------------------------------ proposal form (contribute)
  // The form posts a JSON proposal to the service's inbox with the CAPTCHA
  // token the widget adds to the form. Drafts are kept in this browser until
  // the proposal is accepted, so a failed send never loses a long statement.
  const proposalForm = $("#proposal-form");
  if (proposalForm) {
    const statusLine = $("#proposal-status");
    const submitButton = $("#proposal-submit");
    const doneBox = $("#proposal-done");
    const preview = $("#statement-preview");
    const submitUrl = proposalForm.dataset.submitUrl || "";
    const captchaProvider = proposalForm.dataset.captchaProvider || "";
    const captchaField = proposalForm.dataset.captchaResponse || "";
    const allowAnonymous = proposalForm.dataset.allowAnonymous === "true";
    let limits = {};
    try { limits = JSON.parse(proposalForm.dataset.limits || "{}"); } catch (error) { limits = {}; }
    const control = (name) => proposalForm.elements.namedItem(name);
    const value = (name) => String(control(name)?.value ?? "").trim();
    // An older deployment may restore a draft made when anonymous credit was available.
    // Keep that choice even when this form has no checkbox, so neither a save nor a send loses it.
    let restoredAnonymous = false;
    const anonymousRequested = () => Boolean(control("anonymous")?.checked) || (!allowAnonymous && restoredAnonymous);
    const anonymousUnavailable = "Your draft requests anonymous credit, which is not available through this form yet. Keep your draft and return later, or use Clear form to start a new proposal with named credit.";
    const say = (message, kind = "") => {
      if (!statusLine) return;
      statusLine.textContent = message;
      statusLine.dataset.kind = kind;
    };

    // Fields and topics come from a dropdown of the existing names; "Other" opens a box for a
    // name of the contributor's own. The chosen names are pills with a remove button, and a
    // counter says how many of the allowed number are chosen.
    const picker = (plural, counter) => {
      const box = $(`[data-picker="${plural}"]`, proposalForm);
      const empty = { select: null, chosen: () => [], custom: () => [], set() {} };
      if (!box) return empty;
      const max = Number(box.dataset.max) || 1;
      const kind = box.dataset.kind || "topic";
      const select = $("select", box);
      const customRow = $(".picker-custom", box);
      const customInput = customRow ? $("input", customRow) : null;
      const list = $(".picker-chosen", box);
      const known = select ? Array.from(select.options).map((option) => option.value).filter((name) => name && name !== "__other__") : [];
      let items = [];
      const render = () => {
        if (list) {
          list.innerHTML = items.map((item) => `<li><span class="tag tag-${kind}${item.custom ? " tag-new" : ""}">${escapeHtml(item.name)}${item.custom ? ' <span class="tag-count">new</span>' : ""}<button type="button" class="tag-remove" data-remove="${escapeHtml(item.name)}" aria-label="Remove ${escapeHtml(item.name)}">×</button></span></li>`).join("");
        }
        const full = items.length >= max;
        if (select) { select.value = ""; select.disabled = full; }
        if (full && customRow) customRow.hidden = true;
        if (counter) counter.textContent = `${items.length} of ${max} chosen`;
      };
      const add = (name, custom) => {
        const clean = String(name || "").replace(/\s+/g, " ").trim();
        if (!clean || items.length >= max) return false;
        if (items.some((item) => item.name.toLowerCase() === clean.toLowerCase())) { render(); return false; }
        const existing = known.find((candidate) => candidate.toLowerCase() === clean.toLowerCase());
        items.push(existing ? { name: existing, custom: false } : { name: clean, custom: Boolean(custom) });
        render();
        return true;
      };
      const closeCustom = () => { if (customRow) customRow.hidden = true; if (customInput) customInput.value = ""; };
      select?.addEventListener("change", () => {
        if (select.value === "__other__") {
          select.value = "";
          if (customRow) customRow.hidden = false;
          customInput?.focus();
          return;
        }
        if (select.value) add(select.value, false);
      });
      const addCustom = () => { if (add(customInput?.value, true)) closeCustom(); };
      $("[data-picker-add]", box)?.addEventListener("click", addCustom);
      $("[data-picker-cancel]", box)?.addEventListener("click", () => { closeCustom(); select?.focus(); });
      customInput?.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); addCustom(); } });
      list?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove]");
        if (!button) return;
        items = items.filter((item) => item.name !== button.dataset.remove);
        render();
        select?.focus();
      });
      render();
      return {
        select,
        chosen: () => items.map((item) => item.name),
        custom: () => items.filter((item) => item.custom).map((item) => item.name),
        set(names, own) { items = []; (Array.isArray(names) ? names : []).forEach((name) => add(name, Array.isArray(own) && own.includes(name))); render(); }
      };
    };
    const fields = picker("fields", $("#fields-count"));
    const topics = picker("topics", $("#topics-count"));

    // The proposal as the inbox expects it.
    const proposal = () => ({
      title: value("title"),
      statement: value("statement"),
      fields: fields.chosen(),
      newFields: fields.custom(),
      topics: topics.chosen(),
      newTopics: topics.custom(),
      source: value("source"),
      progress: value("progress"),
      references: value("references"),
      comment: value("comment"),
      contributor: { name: value("name"), email: value("email"), affiliation: value("affiliation"), ...(allowAnonymous ? { anonymous: anonymousRequested() } : {}) },
      consent: Boolean(control("consent")?.checked),
      extra: value("extra"),
      captchaToken: captchaField ? value(captchaField) : ""
    });

    // The same checks the inbox makes, so a proposal is complete before it leaves the browser.
    const problems = (p) => {
      const list = [];
      if (!allowAnonymous && anonymousRequested()) list.push({ message: anonymousUnavailable });
      const between = (text, limit, label, name) => {
        if (limit.min && text.length < limit.min) list.push({ message: text ? `${label} needs at least ${limit.min} characters.` : `${label} is required.`, control: control(name) });
        else if (limit.max && text.length > limit.max) list.push({ message: `${label} is longer than ${limit.max} characters.`, control: control(name) });
      };
      between(p.title, limits.title || {}, "The title", "title");
      between(p.statement, limits.statement || {}, "The statement", "statement");
      if (p.fields.length < (limits.fields?.min ?? 1)) list.push({ message: "Choose at least one field.", control: fields.select });
      if (p.topics.length < (limits.topics?.min ?? 1)) list.push({ message: "Choose at least one topic or add your own.", control: topics.select });
      between(p.contributor.name, limits.name || { min: 1 }, "Your name", "name");
      between(p.contributor.email, limits.email || {}, "Email", "email");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.contributor.email)) list.push({ message: "Enter a valid email address.", control: control("email") });
      between(p.contributor.affiliation, limits.affiliation || {}, "Affiliation", "affiliation");
      if (!p.consent) list.push({ message: "Tick the consent box.", control: control("consent") });
      return list;
    };

    // Drafts.
    const DRAFT_KEY = "qiqcop-proposal-draft";
    const textNames = ["title", "statement", "source", "progress", "references", "comment", "name", "email", "affiliation"];
    let saveTimer = 0;
    const saveDraft = () => {
      window.clearTimeout(saveTimer);
      try {
        const draft = { values: Object.fromEntries(textNames.map((name) => [name, String(control(name)?.value ?? "")])), anonymous: anonymousRequested(), fields: fields.chosen(), newFields: fields.custom(), topics: topics.chosen(), newTopics: topics.custom() };
        if (Object.values(draft.values).some(Boolean) || draft.anonymous || draft.fields.length || draft.topics.length) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
        else localStorage.removeItem(DRAFT_KEY);
      } catch (error) { /* storage unavailable */ }
    };
    const clearDraft = () => {
      window.clearTimeout(saveTimer);
      try { localStorage.removeItem(DRAFT_KEY); } catch (error) { /* ignore */ }
    };
    const restoreDraft = () => {
      let draft = null;
      try { draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null"); } catch (error) { draft = null; }
      if (!draft || typeof draft !== "object") return false;
      textNames.forEach((name) => { const element = control(name); if (element && draft.values?.[name]) element.value = draft.values[name]; });
      restoredAnonymous = draft.anonymous === true;
      if (control("anonymous")) control("anonymous").checked = restoredAnonymous;
      fields.set(draft.fields, draft.newFields);
      topics.set(draft.topics, draft.newTopics);
      return true;
    };
    const scheduleSave = () => { window.clearTimeout(saveTimer); saveTimer = window.setTimeout(saveDraft, 400); };
    proposalForm.addEventListener("input", scheduleSave);
    proposalForm.addEventListener("change", scheduleSave);
    proposalForm.addEventListener("click", (event) => { if (event.target.closest("[data-remove], [data-picker-add]")) scheduleSave(); });
    if (restoreDraft()) {
      if (!allowAnonymous && anonymousRequested()) say(anonymousUnavailable, "error");
      else say("Restored the unsent draft kept in this browser.");
    }

    // This example is a visual placeholder, never part of the statement or its draft.
    const statementPlaceholder = $("#statement-placeholder");
    const hideStatementPlaceholder = () => { if (statementPlaceholder) statementPlaceholder.hidden = true; };
    control("statement")?.addEventListener("focus", hideStatementPlaceholder);
    control("statement")?.addEventListener("click", hideStatementPlaceholder);
    control("statement")?.addEventListener("input", hideStatementPlaceholder);
    if (value("statement")) hideStatementPlaceholder();

    // Mathematics preview of the statement. $…$ and $…$ become the delimiters MathJax is configured with.
    $("#statement-preview-button")?.addEventListener("click", () => {
      if (!preview) return;
      const text = value("statement");
      preview.hidden = false;
      preview.textContent = text
        ? text.replace(/\$\$([\s\S]+?)\$\$/g, "\\[$1\\]").replace(/(^|[^\\$])\$([^$\n]+?)\$/g, "$1\\($2\\)")
        : "Nothing to preview yet.";
      typeset(preview);
    });

    // The proposal as text, the same shape the maintainers see in the inbox.
    const asText = (p) => {
      const section = (heading, body) => (body ? `## ${heading}\n\n${body}\n\n` : "");
      const marked = (all, own) => all.map((name) => (own.includes(name) ? `${name} (new)` : name)).join("; ") || "none";
      return `# ${p.title || "(untitled)"}\n\n`
        + (anonymousRequested() ? "Contributor: Anonymous\n" : `Contributor: ${p.contributor.name}${p.contributor.email ? ` <${p.contributor.email}>` : ""}${p.contributor.affiliation ? ` (${p.contributor.affiliation})` : ""}\n`)
        + `Public credit: ${anonymousRequested() ? "Remain anonymous" : "Use contributor name"}\n`
        + `Fields: ${marked(p.fields, p.newFields)}\nTopics: ${marked(p.topics, p.newTopics)}\n\n`
        + section("Statement", p.statement) + section("Source", p.source) + section("Progress", p.progress) + section("References", p.references) + section("Comment", p.comment);
    };
    $("#proposal-copy")?.addEventListener("click", async () => {
      const ok = await copyText(`${asText(proposal()).trimEnd()}\n`);
      notify(ok ? "Proposal copied as text" : "Copy failed; select the text manually");
    });
    $("#proposal-clear")?.addEventListener("click", () => {
      proposalForm.reset();
      restoredAnonymous = false;
      fields.set([], []);
      topics.set([], []);
      if (preview) { preview.hidden = true; preview.textContent = ""; }
      if (statementPlaceholder) statementPlaceholder.hidden = false;
      clearDraft();
      say("Form cleared.");
    });

    const resetCaptcha = () => {
      try {
        if (captchaProvider === "turnstile" && window.turnstile) window.turnstile.reset();
        if (captchaProvider === "hcaptcha" && window.hcaptcha) window.hcaptcha.reset();
      } catch (error) { /* the widget resets on reload */ }
    };
    const explain = (status, reply) => {
      const detail = reply && typeof reply.error === "string" ? reply.error : "";
      if (status === 403 && /verification/i.test(detail)) return "The human verification did not pass. Complete it again and send once more.";
      if (status === 422) return `The proposal was not accepted: ${detail || "check the required fields"}.`;
      if (status === 429) return "Too many proposals from this connection for now. Your draft is kept in this browser; try again in an hour.";
      if (status === 503) return "The inbox is not accepting proposals at the moment. Use Copy as text and the GitHub route instead.";
      if (status === 413) return "The proposal is too large to send; shorten the longest sections.";
      return `The proposal could not be sent (${detail || `HTTP ${status}`}). Your draft is kept in this browser.`;
    };
    proposalForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      saveDraft();
      const p = proposal();
      const issues = problems(p);
      if (issues.length) {
        say(issues.map((issue) => issue.message).join(" "), "error");
        issues[0].control?.focus?.();
        return;
      }
      if (!submitUrl) { say("Online sending is not connected on this deployment; use Copy as text.", "error"); return; }
      if (captchaProvider && !p.captchaToken) { say("Complete the human verification above the Send button, then send again.", "error"); return; }
      if (submitButton) submitButton.disabled = true;
      say("Sending…");
      try {
        const response = await fetch(submitUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
        let reply = {};
        try { reply = await response.json(); } catch (error) { reply = {}; }
        if (response.ok && reply.accepted) {
          clearDraft();
          proposalForm.hidden = true;
          const receipt = $("#proposal-receipt");
          if (receipt) receipt.textContent = reply.id || "";
          if (doneBox) {
            doneBox.hidden = false;
            doneBox.scrollIntoView({ block: "start" });
            doneBox.focus();
          }
          say("");
          return;
        }
        resetCaptcha();
        say(explain(response.status, reply), "error");
      } catch (error) {
        resetCaptcha();
        say("The proposal could not be sent because the inbox could not be reached. Your draft is kept in this browser; try again later or use Copy as text.", "error");
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }
})();
