import { normalizeArchivalLink, normalizeHistoricalLink } from "../../shared/progress-sources.mjs";

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
  const section = (heading, value) => value ? `## ${heading}\n\n${value}\n\n` : "";
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

export function githubReportUrl(report, repositoryUrl) {
  const url = new URL(`${repositoryUrl.replace(/\/$/u, "")}/issues/new`);
  const historical = report.kind === "historical";
  url.searchParams.set("template", historical ? "historical-progress.yml" : "research-update.yml");
  url.searchParams.set("record_id", report.problemId);
  url.searchParams.set("title", `[${historical ? "Historical progress" : "Progress"}] ${report.problemId}`);
  const fields = historical ? { original_report: report.historicalUrl, summary: report.summary } : {
    archival_links: report.archivalLinks.join("\n"), citation: report.citation, summary: report.summary,
    result_locator: report.resultLocator, related_report: report.relatedReportUrl
  };
  fields.contributor = report.contributor.anonymous ? "Anonymous website credit requested (GitHub account remains public)" : `${report.contributor.name}${report.contributor.affiliation ? ` (${report.contributor.affiliation})` : ""}`;
  // Avoid an unusably long navigation URL; the full public text is copied separately.
  for (const [key, value] of Object.entries(fields)) {
    if (!value) continue;
    url.searchParams.set(key, value);
    if (url.href.length > 7500) url.searchParams.delete(key);
  }
  return url.href;
}

export function initProgressForm({ document, window, storage, fetch, clipboard }) {
  const form = document.querySelector("#progress-form");
  if (!form) return;
  const node = id => document.querySelector(`#progress-${id}`);
  const control = name => form.elements.namedItem(name);
  const value = name => String(control(name)?.value ?? "").trim();
  const status = node("status");
  const online = Boolean(form.dataset.submitUrl);
  const allowAnonymous = form.dataset.allowAnonymous === "true";
  const draftKey = "qiqcop-progress-draft";
  const textNames = ["problemId", "kind", "updateType", "archivalLinks", "historicalUrl", "citation", "resultLocator", "relatedReportUrl", "summary", "name", "email", "affiliation"];
  const problemIds = Array.from(control("problemId").options).map(option => option.value).filter(Boolean);
  let restoredAnonymous = false;
  const anonymous = () => allowAnonymous ? Boolean(control("anonymous")?.checked) : restoredAnonymous;
  const say = (message, kind = "") => { status.textContent = message; status.dataset.kind = kind; };
  const saveDraft = () => {
    try {
      storage.setItem(draftKey, JSON.stringify({ values: Object.fromEntries(textNames.map(name => [name, String(control(name)?.value ?? "")])), anonymous: anonymous() }));
    } catch { /* Storage can be unavailable; sending still works. */ }
  };
  const clearDraft = () => { try { storage.removeItem(draftKey); } catch { /* No persistent draft. */ } };
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
  } catch { /* Leave the form ready for a fresh report. */ }
  const query = new URLSearchParams(window.location.search);
  if (!restored) {
    if (problemIds.includes(query.get("problem"))) control("problemId").value = query.get("problem");
    if (query.get("kind") === "historical") control("kind").value = "historical";
  }
  if (!allowAnonymous && restoredAnonymous) say("Your saved draft requests anonymous credit, which is not enabled here. Keep it for later or use Clear form to start a named report.", "error");
  const switchKind = () => {
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
    saveDraft();
    for (const field of [...textNames, "consent"]) {
      control(field)?.removeAttribute("aria-invalid");
      const error = node(`${field}-error`);
      if (error) { error.hidden = true; error.textContent = ""; }
    }
    const { report, errors } = prepareProgressReport(rawReport(), { requireEmail, allowAnonymous, problemIds });
    if (!errors.length) return report;
    for (const { field, message } of errors) {
      control(field)?.setAttribute("aria-invalid", "true");
      const error = node(`${field}-error`);
      if (error) { error.textContent = message; error.hidden = false; }
    }
    say(errors.map(error => error.message).join(" "), "error");
    (control(errors[0].field) ?? status).focus();
    return null;
  };
  const copyReport = async report => {
    const text = publicProgressText(report);
    try {
      await clipboard.writeText(text);
      node("copy-fallback").hidden = true;
      say("Public report copied. Paste it into the matching GitHub form if needed, check its fields, and submit there. Your email was not copied; no report has been sent yet.");
      return true;
    } catch {
      node("copy-text").value = text;
      node("copy-fallback").hidden = false;
      node("copy-text").focus();
      node("copy-text").select();
      say("Automatic copying is unavailable. Select and copy the public text below; your email is excluded. No report has been sent.", "error");
      return false;
    }
  };
  node("copy")?.addEventListener("click", async () => { const report = validate(false); if (report) await copyReport(report); });
  node("open")?.addEventListener("click", () => {
    const report = validate(false);
    if (!report) return;
    window.location.assign(githubReportUrl(report, form.dataset.repositoryUrl));
  });
  node("clear").addEventListener("click", () => {
    form.reset(); restoredAnonymous = false; clearDraft(); switchKind();
    node("copy-fallback").hidden = true;
    node("copy-text").value = "";
    for (const field of [...textNames, "consent"]) {
      control(field)?.removeAttribute("aria-invalid");
      const error = node(`${field}-error`); if (error) error.hidden = true;
    }
    say("Form and saved draft cleared.");
  });
  const resetCaptcha = () => { try { window[form.dataset.captchaProvider]?.reset(); } catch { /* Widget may need reload. */ } };
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const report = validate(online);
    if (!report) return;
    if (!online) { await copyReport(report); return; }
    if (form.dataset.captchaProvider && !report.captchaToken) { say("Complete the human verification, then submit again.", "error"); status.focus(); return; }
    node("submit").disabled = true;
    say("Sending report…");
    try {
      const response = await fetch(form.dataset.submitUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) });
      let reply = {};
      try { reply = await response.json(); } catch { /* Report the unsuccessful response below. */ }
      if (response.ok && reply.received === true && typeof reply.id === "string" && reply.id) {
        clearDraft(); form.hidden = true; node("receipt").textContent = reply.id;
        node("done").hidden = false; node("done").scrollIntoView({ block: "start" }); node("done").focus(); say("");
      } else {
        resetCaptcha();
        const detail = typeof reply.error === "string" ? reply.error : "Please check your details and try again later.";
        say(`The report was not received (${response.status}). ${detail} Your draft is kept in this browser.`, "error");
        status.focus();
      }
    } catch {
      resetCaptcha(); say("The inbox could not be reached. Your draft is kept in this browser; retry later. No receipt was issued.", "error"); status.focus();
    } finally { node("submit").disabled = false; }
  });
  // Keep the native submit button inert until its validation handler is attached.
  node("submit").disabled = false;
  if (node("loading")) node("loading").hidden = true;
}

if (typeof document !== "undefined") {
  initProgressForm({ document, window, storage: { getItem: key => localStorage.getItem(key), setItem: (key, value) => localStorage.setItem(key, value), removeItem: key => localStorage.removeItem(key) }, fetch: (...args) => fetch(...args), clipboard: { writeText: text => navigator.clipboard.writeText(text) } });
}
