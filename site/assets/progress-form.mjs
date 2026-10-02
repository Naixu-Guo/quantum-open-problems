import "./form-math.js";
import { normalizeArchivalLink, normalizeHistoricalLink } from "../../shared/progress-sources.mjs";

const { githubMath, bindMathPreview } = globalThis.QIQCOPFormMath;

export const parseSourceLines = text => String(text ?? "").split(/\r?\n/u).map(line => line.trim()).filter(Boolean);

/** Validate identifiers and required documentation fields, never the scientific argument. */
export function prepareProgressReport(raw, { requireEmail = true, allowAnonymous = false, problemIds = null } = {}) {
  const report = { ...raw, contributor: { ...raw.contributor } };
  const errors = [];
  const error = (field, message) => errors.push({ field, message });
  if (!report.problemId || (problemIds && !problemIds.includes(report.problemId))) error("problemId", "Choose a problem from the catalog.");
  if (!["research", "historical"].includes(report.kind)) error("kind", "Choose new research progress or an earlier GitHub report.");
  if (report.kind === "research") {
    if (!["resolution", "partial", "computation", "correction", "follow-up"].includes(report.updateType)) error("updateType", "Choose a type of report.");
    const links = Array.isArray(report.archivalLinks) ? report.archivalLinks : [];
    if (!links.length) error("archivalLinks", "Add an eligible archival manuscript or paper link to submit this report.");
    else if (links.length > 10) error("archivalLinks", "Provide at most 10 archival manuscript or paper links.");
    else {
      try { report.archivalLinks = [...new Set(links.map(link => normalizeArchivalLink(link).url))]; }
      catch (failure) { error("archivalLinks", failure.message); }
    }
  } else if (report.kind === "historical") {
    report.archivalLinks = [];
    try { report.historicalUrl = normalizeHistoricalLink(report.historicalUrl); }
    catch (failure) { error("historicalUrl", failure.message); }
  }
  if (report.relatedReportUrl) {
    try { report.relatedReportUrl = normalizeHistoricalLink(report.relatedReportUrl); }
    catch (failure) { error("relatedReportUrl", failure.message); }
  }
  if (!report.summary || report.summary.length > 1500) error("summary", "Add a brief summary of up to 1,500 characters.");
  for (const [field, max] of [["citation", 2000], ["resultLocator", 500]]) {
    if (report[field]?.length > max) error(field, `Keep this field within ${max.toLocaleString("en")} characters.`);
  }
  const { name = "", email = "", affiliation = "", anonymous = false } = report.contributor;
  if (!name || name.length > 200) error("name", "Enter your name, up to 200 characters.");
  if ((requireEmail || email) && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) || email.length > 254)) error("email", "Enter a valid email address, up to 254 characters.");
  if (affiliation.length > 300) error("affiliation", "Keep your affiliation within 300 characters.");
  if (anonymous && !allowAnonymous) error("name", "Your saved draft requests anonymous credit, which is not enabled here. Keep it for later or use Clear form to begin a new report with named credit.");
  if (report.consent !== true || report.contentLicense !== "CC-BY-4.0") error("consent", "Confirm the licensing and contact consent to submit your report.");
  return { report, errors };
}

/** Public handoff deliberately excludes the private email and anonymous identity. */
export function publicProgressText(report) {
  const section = (heading, value) => value ? `## ${heading}\n\n${githubMath(value)}\n\n` : "";
  const credit = report.contributor.anonymous ? "Anonymous" : `${report.contributor.name}${report.contributor.affiliation ? ` (${report.contributor.affiliation})` : ""}`;
  return `# ${report.kind === "historical" ? "Historical progress listing" : "Reported research progress"}: ${report.problemId}\n\n`
    + section("Type of report", report.kind === "historical" ? "Historical GitHub report" : report.updateType)
    + section("Archival manuscript or paper links", report.archivalLinks?.join("\n"))
    + section("Original GitHub report", report.historicalUrl)
    + section("Citation", report.citation)
    + section("Summary", report.summary)
    + section("Result locator", report.resultLocator)
    + section("Earlier related report", report.relatedReportUrl)
    + section("Reporting contributor", credit)
    + "Original submitted text: CC BY 4.0; third-party and historical material retain their terms.\n\nThis report documents a source and does not certify correctness or change the problem's status.\n";
}

const reportTypeLabels = { resolution: "Reported resolution", partial: "Partial progress", computation: "Computational finding", correction: "Research correction", "follow-up": "Follow-up publication" };

export function githubReportUrl(report, repositoryUrl) {
  const url = new URL(`${repositoryUrl.replace(/\/$/u, "")}/issues/new`);
  const historical = report.kind === "historical";
  url.searchParams.set("template", historical ? "historical-progress.yml" : "research-update.yml");
  url.searchParams.set("record_id", report.problemId);
  url.searchParams.set("title", `[${historical ? "Historical progress" : "Progress"}] ${report.problemId}`);
  const fields = historical ? { original_report: report.historicalUrl, summary: report.summary } : {
    archival_links: report.archivalLinks.join("\n"), citation: report.citation, summary: "Reported update type: " + reportTypeLabels[report.updateType] + "\n\n" + report.summary,
    result_locator: report.resultLocator, related_report: report.relatedReportUrl
  };
  fields.contributor = report.contributor.anonymous ? "Anonymous website credit requested (GitHub account remains public)" : `${report.contributor.name}${report.contributor.affiliation ? ` (${report.contributor.affiliation})` : ""}`;
  // Preserve every field. A long report must use an explicit manual handoff, never silent truncation.
  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;
    url.searchParams.set(key, ["summary", "citation", "result_locator"].includes(key) ? githubMath(value) : value);
  }
  if (url.href.length > 7500) throw new Error("This report is too long to prefill GitHub safely. Your entries remain in this form. Use Copy report for GitHub, then open the matching form from the repository’s issue chooser and paste the complete public report. No fields were dropped and no GitHub page was opened.");
  return url.href;
}

/** Search the embedded public catalog; an empty query never expands the entire list. */
export function matchingProgressProblems(catalog, query, limit = 8) {
  const normalized = String(query ?? "").normalize("NFKC").trim().toLowerCase();
  if (!normalized) return { matches: [], total: 0 };
  const terms = normalized.split(/\s+/u);
  const ranked = catalog.flatMap((problem, order) => {
    const id = problem.id.toLowerCase();
    const title = problem.title.normalize("NFKC").toLowerCase();
    if (!terms.every(term => (id + " — " + title).includes(term))) return [];
    const rank = id === normalized ? 0 : id.startsWith(normalized) ? 1 : title.startsWith(normalized) ? 2 : 3;
    return [{ problem, rank, order }];
  }).sort((a, b) => a.rank - b.rank || a.order - b.order);
  return { matches: ranked.slice(0, limit).map(item => item.problem), total: ranked.length };
}

export function initProgressForm({ document, window, storage, fetch, clipboard, requestTimeoutMs = 30_000 }) {
  const form = document.querySelector("#progress-form");
  if (!form) return;
  const node = id => document.querySelector(`#progress-${id}`);
  const control = name => form.elements.namedItem(name);
  const value = name => String(control(name)?.value ?? "").trim();
  const status = node("status");
  const online = Boolean(form.dataset.submitUrl);
  const allowAnonymous = form.dataset.allowAnonymous === "true";
  const draftKey = "qiqcop-progress-draft";
  const textNames = ["problemId", "problemSearch", "kind", "updateType", "archivalLinks", "historicalUrl", "citation", "resultLocator", "relatedReportUrl", "summary", "name", "email", "affiliation"];
  const catalog = JSON.parse(node("problem-catalog").textContent);
  const problemIds = catalog.map(problem => problem.id);
  const problemsById = new Map(catalog.map(problem => [problem.id, problem]));
  const search = control("problemSearch");
  const suggestions = node("problem-options");
  const lookupStatus = node("problem-matches");
  const initialLookupHint = "Type a problem ID or words from its title to find a match.";
  const labelFor = problem => problem.id + " — " + problem.title;
  const sameText = (left, right) => left.normalize("NFKC").trim().toLowerCase() === right.normalize("NFKC").trim().toLowerCase();
  let matches = [];
  let optionNodes = [];
  let activeOption = -1;
  const closeSuggestions = () => {
    suggestions.hidden = true;
    search.setAttribute("aria-expanded", "false");
    search.removeAttribute("aria-activedescendant");
    activeOption = -1;
    for (const option of optionNodes) option.setAttribute("aria-selected", "false");
  };
  const clearProblemError = () => {
    search.removeAttribute("aria-invalid");
    const error = node("problemId-error");
    error.hidden = true; error.textContent = "";
  };
  const syncProblemId = () => {
    const exact = catalog.find(problem => sameText(problem.id, search.value));
    const selected = problemsById.get(value("problemId"));
    if (exact) control("problemId").value = exact.id;
    else if (!selected || !sameText(labelFor(selected), search.value)) control("problemId").value = "";
  };
  const mathPreview = bindMathPreview({
    document, button: node("preview-button"), output: node("preview"),
    fields: [["summary", "Summary"], ["citation", "Citation"], ["resultLocator", "Result locator"]].map(([name, label]) => ({ label, control: control(name) })),
    getMathJax: () => window.MathJax
  });
  let busy = false;
  let restoredAnonymous = false;
  const anonymous = () => allowAnonymous ? Boolean(control("anonymous")?.checked) : restoredAnonymous;
  let storageUnavailable = false;
  let statusMessage = "";
  let statusKind = "";
  const showStatus = () => {
    const warning = storageUnavailable ? "Browser storage is unavailable: current edits may not be saved, and an older draft may remain. Keep this page open and use Copy report for GitHub to save the public text elsewhere." : "";
    status.textContent = [statusMessage, warning].filter(Boolean).join(" ");
    status.dataset.kind = storageUnavailable ? "error" : statusKind;
  };
  const say = (message, kind = "") => { statusMessage = message; statusKind = kind; showStatus(); };
  let copyRevision = 0;
  let copyFeedback = false;
  const invalidatePublicCopy = () => {
    copyRevision++;
    node("copy-fallback").hidden = true;
    node("copy-text").value = "";
    if (copyFeedback) { copyFeedback = false; say(""); }
  };
  const saveDraft = () => {
    invalidatePublicCopy();
    try {
      storage.setItem(draftKey, JSON.stringify({ values: Object.fromEntries(textNames.map(name => [name, String(control(name)?.value ?? "")])), anonymous: anonymous() }));
      storageUnavailable = false;
    } catch { storageUnavailable = true; }
    showStatus();
  };
  const clearDraft = () => {
    try { storage.removeItem(draftKey); storageUnavailable = false; return true; }
    catch { storageUnavailable = true; return false; }
  };
  const selectProblem = problem => {
    control("problemId").value = problem.id;
    search.value = labelFor(problem);
    closeSuggestions(); clearProblemError();
    lookupStatus.textContent = "Selected: " + labelFor(problem);
    saveDraft(); search.focus();
  };
  const showSuggestions = () => {
    const found = matchingProgressProblems(catalog, search.value);
    matches = found.matches;
    activeOption = -1;
    search.removeAttribute("aria-activedescendant");
    optionNodes = matches.map((problem, index) => {
      const option = document.createElement("li");
      option.id = "progress-problem-option-" + index;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", "false");
      option.textContent = labelFor(problem);
      option.addEventListener("pointerdown", event => event.preventDefault());
      option.addEventListener("click", () => selectProblem(problem));
      return option;
    });
    suggestions.replaceChildren(...optionNodes);
    suggestions.hidden = matches.length === 0;
    search.setAttribute("aria-expanded", String(matches.length > 0));
    lookupStatus.textContent = !search.value.trim() ? initialLookupHint
      : !found.total ? "No matching problems. Try a different title word or check the problem ID."
      : found.total > matches.length ? "Showing the first " + matches.length + " of " + found.total + " matching problems. Keep typing to narrow the list."
      : found.total + (found.total === 1 ? " matching problem. Choose it from the list." : " matching problems. Choose one from the list.");
  };
  search.addEventListener("input", () => {
    // Editing a chosen label cannot retain the previous hidden catalog ID.
    control("problemId").value = "";
    syncProblemId(); clearProblemError(); showSuggestions(); saveDraft();
  });
  search.addEventListener("focus", () => {
    if (!value("problemId") && search.value.trim()) showSuggestions();
  });
  search.addEventListener("blur", closeSuggestions);
  search.addEventListener("keydown", event => {
    if (event.isComposing) return;
    if (event.key === "Escape") { event.preventDefault(); closeSuggestions(); return; }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (suggestions.hidden) showSuggestions();
      if (!matches.length) return;
      activeOption = event.key === "ArrowDown" ? (activeOption + 1) % matches.length : (activeOption <= 0 ? matches.length - 1 : activeOption - 1);
      for (const [index, option] of optionNodes.entries()) option.setAttribute("aria-selected", String(index === activeOption));
      search.setAttribute("aria-activedescendant", optionNodes[activeOption].id);
      optionNodes[activeOption].scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter") {
      // Choosing a catalog item must never implicitly submit the research report.
      event.preventDefault();
      if (!suggestions.hidden && activeOption >= 0) selectProblem(matches[activeOption]);
      else {
        syncProblemId();
        const exact = problemsById.get(value("problemId"));
        if (exact) selectProblem(exact);
        else if (!suggestions.hidden && matches.length === 1) selectProblem(matches[0]);
        else { showSuggestions(); if (matches.length) lookupStatus.textContent += " Use the arrow keys and Enter to choose a problem."; }
      }
    }
  });
  let restored = false;
  try {
    const draft = JSON.parse(storage.getItem(draftKey) || "null");
    if (draft && typeof draft.values === "object") {
      for (const name of textNames) if (typeof draft.values[name] === "string") control(name).value = draft.values[name];
      restoredAnonymous = draft.anonymous === true;
      if (control("anonymous")) control("anonymous").checked = restoredAnonymous;
      restored = true;
      say("Restored the unsent draft kept in this browser. Check the selected problem before continuing.");
    }
  } catch { storageUnavailable = true; showStatus(); }
  const query = new URLSearchParams(window.location.search);
  if (!restored) {
    if (problemIds.includes(query.get("problem"))) control("problemId").value = query.get("problem");
    if (query.get("kind") === "historical") control("kind").value = "historical";
  }
  const initialProblem = problemsById.get(value("problemId"));
  if (initialProblem && !search.value.trim()) search.value = labelFor(initialProblem);
  syncProblemId();
  closeSuggestions();
  lookupStatus.textContent = value("problemId") ? "Selected: " + labelFor(problemsById.get(value("problemId"))) : initialLookupHint;
  if (restored && query.get("problem") && query.get("problem") !== value("problemId")) say("Restored your saved draft for " + (value("problemId") || "an unselected problem") + "; the linked problem " + query.get("problem") + " did not replace it. Check the problem field or clear the saved draft.");
  if (!allowAnonymous && restoredAnonymous) say("Your saved draft requests anonymous credit, which is not enabled here. Keep it for later or use Clear form to start a named report.", "error");
  const switchKind = () => {
    mathPreview?.invalidate();
    const historical = value("kind") === "historical";
    node("research-fields").hidden = historical;
    node("historical-fields").hidden = !historical;
    node("updateType-row").hidden = historical;
    control("archivalLinks").required = !historical;
    control("historicalUrl").required = historical;
    if (online) node("submit").textContent = historical ? "Request historical listing" : "Submit progress report";
  };
  switchKind();
  form.addEventListener("input", saveDraft);
  form.addEventListener("change", () => { switchKind(); saveDraft(); });
  const rawReport = () => ({
    kind: value("kind"), problemId: value("problemId"), ...(value("kind") === "research" ? { updateType: value("updateType") } : {}),
    archivalLinks: parseSourceLines(value("archivalLinks")),
    ...(value("kind") === "historical" ? { historicalUrl: value("historicalUrl") } : { citation: value("citation"), resultLocator: value("resultLocator"), relatedReportUrl: value("relatedReportUrl") }),
    summary: value("summary"), contributor: { name: value("name"), email: value("email"), affiliation: value("affiliation"), anonymous: anonymous() },
    consent: Boolean(control("consent")?.checked), contentLicense: form.dataset.contentLicense,
    captchaToken: form.dataset.captchaResponse ? value(form.dataset.captchaResponse) : "", extra: value("extra")
  });
  const validate = (requireEmail) => {
    syncProblemId();
    saveDraft();
    for (const field of [...textNames, "consent"]) {
      control(field)?.removeAttribute("aria-invalid");
      const error = node(`${field}-error`);
      if (error) { error.hidden = true; error.textContent = ""; }
    }
    const { report, errors } = prepareProgressReport(rawReport(), { requireEmail, allowAnonymous, problemIds });
    if (!errors.length) return report;
    for (const { field, message } of errors) {
      (field === "problemId" ? search : control(field))?.setAttribute("aria-invalid", "true");
      const error = node(`${field}-error`);
      if (error) { error.textContent = message; error.hidden = false; }
    }
    say(errors.map(error => error.message).join(" "), "error");
    (errors[0].field === "problemId" ? search : control(errors[0].field) ?? status).focus();
    return null;
  };
  const copyReport = async report => {
    invalidatePublicCopy();
    const revision = copyRevision;
    copyFeedback = true;
    const text = publicProgressText(report);
    try {
      await clipboard.writeText(text);
      if (revision !== copyRevision) return false;
      node("copy-fallback").hidden = true;
      say("Public report copied. Paste it into the matching GitHub form if needed, check its fields, and submit there. Your email was not copied; no report has been sent yet.");
      return true;
    } catch {
      if (revision !== copyRevision) return false;
      node("copy-text").value = text;
      node("copy-fallback").hidden = false;
      node("copy-text").focus();
      node("copy-text").select();
      say("Automatic copying is unavailable. Select and copy the public text below; your email is excluded. No report has been sent.", "error");
      return false;
    }
  };
  node("copy")?.addEventListener("click", async () => { if (busy) return; const report = validate(false); if (report) await copyReport(report); });
  node("open")?.addEventListener("click", () => {
    if (busy) return;
    const report = validate(false);
    if (!report) return;
    if (storageUnavailable) {
      say("GitHub was not opened because leaving this page could lose your current edits. Use Copy report for GitHub, then open the repository's issue chooser in a separate tab and paste the public report into the matching form.", "error");
      status.focus();
      return;
    }
    try { window.location.assign(githubReportUrl(report, form.dataset.repositoryUrl)); }
    catch (error) { say(error.message, "error"); status.focus(); }
  });
  node("clear").addEventListener("click", () => {
    if (busy) return;
    invalidatePublicCopy();
    form.reset(); restoredAnonymous = false; const removed = clearDraft(); switchKind();
    closeSuggestions(); suggestions.replaceChildren(); matches = []; optionNodes = []; lookupStatus.textContent = initialLookupHint;
    for (const field of [...textNames, "consent"]) {
      control(field)?.removeAttribute("aria-invalid");
      const error = node(`${field}-error`); if (error) error.hidden = true;
    }
    say(removed ? "Form and saved draft cleared." : "Form cleared, but the saved draft could not be removed. Clear this site's browser data to remove it, especially on a shared computer.", removed ? "" : "error");
  });
  const resetCaptcha = () => { try { window[form.dataset.captchaProvider]?.reset(); } catch { /* Widget may need reload. */ } };
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (busy) return;
    const report = validate(online);
    if (!report) return;
    if (!online) { await copyReport(report); return; }
    if (form.dataset.captchaProvider && !report.captchaToken) { say("Complete the human verification, then submit again.", "error"); status.focus(); return; }
    busy = true;
    closeSuggestions();
    const disabledControls = Array.from(form.elements).map(element => [element, element.disabled]);
    for (const [element] of disabledControls) element.disabled = true;
    form.setAttribute("aria-busy", "true");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
    let savedAtSend;
    let savedSnapshotKnown = false;
    try { savedAtSend = storage.getItem(draftKey); savedSnapshotKnown = true; } catch { /* Storage is optional. */ }
    say("Sending report… Keep this page open until a receipt or retry message appears.");
    try {
      const response = await fetch(form.dataset.submitUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report), signal: controller.signal });
      let reply = {};
      try { reply = await response.json(); } catch { /* Report the unsuccessful response below. */ }
      if (response.ok && reply.received === true && typeof reply.id === "string" && reply.id) {
        let cleanupFailed = !savedSnapshotKnown;
        try { if (savedSnapshotKnown && savedAtSend === storage.getItem(draftKey)) cleanupFailed = !clearDraft(); }
        catch { cleanupFailed = true; /* Do not erase an unavailable or newer draft. */ }
        node("draft-warning").hidden = !cleanupFailed;
        form.hidden = true; node("receipt").textContent = reply.id;
        node("done").hidden = false; node("done").scrollIntoView({ block: "start" }); node("done").focus(); say("");
      } else {
        resetCaptcha();
        const detail = typeof reply.error === "string" ? reply.error : "Please check your details and try again later.";
        say(`The report was not received (${response.status}). ${detail} ` + (storageUnavailable ? "Your entries remain in this open form." : "Your draft is kept in this browser."), "error");
        status.focus();
      }
    } catch {
      resetCaptcha();
      say((controller.signal.aborted ? "The request timed out." : "The inbox could not be reached.") + " No receipt was received. " + (storageUnavailable ? "Your entries remain in this open form." : "Your draft is kept in this browser; retry the same report later."), "error");
      status.focus();
    } finally {
      clearTimeout(timeout);
      busy = false;
      for (const [element, disabled] of disabledControls) element.disabled = disabled;
      form.removeAttribute("aria-busy");
    }
  });
  // Keep the native submit button inert until its validation handler is attached.
  node("submit").disabled = false;
  if (node("loading")) node("loading").hidden = true;
}

if (typeof document !== "undefined") {
  initProgressForm({ document, window, storage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value), removeItem: key => localStorage.removeItem(key) }, fetch: (...args) => fetch(...args), clipboard: { writeText: text => navigator.clipboard.writeText(text) } });
}
