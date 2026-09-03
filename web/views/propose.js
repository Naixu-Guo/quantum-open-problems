/**
 * Propose a problem: the problem record, its first statement with clauses, and the initial
 * references, submitted as one proposal batch. The service assigns the ids; the proposal then
 * waits for a review to admit the problem.
 */
import { html, mount, $, $$, toast, slugify } from "../lib/dom.js";
import { submitBatch } from "../lib/api.js";
import { navigate } from "../router.js";
import { signedIn, loginUrl } from "../lib/session.js";
import { taxonomy, markdown, errorBox } from "./shared.js";
import { sourcePicker } from "./sources.js";
import { REFERENCE_ROLES, referenceRecords } from "./references.js";
import { statementDigest } from "../lib/digest.js";
import { typeset, resetMath } from "../lib/math.js";

const CLAUSE_KINDS = [["decision", "decision: prove or refute"], ["existence", "existence"], ["universal", "universal"], ["construction", "construction"], ["value", "value: determine a quantity"], ["bound", "bound: improve a quantity"]];
const QUANTIFIED = new Set(["value", "bound"]);
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const STATEMENT_TEMPLATE = [
  "## Notation",
  "",
  "| Symbol | Meaning |",
  "|---|---|",
  "| $d$ | Local Hilbert-space dimension |",
  "",
  "## Formal statement",
  "",
  "**Problem.** *State the problem precisely, using only the objects defined above.*",
  "",
].join("\n");

function clauseEditor(index) {
  return html`<div class="subitem" data-clause>
    <div class="subitem-head"><span>Clause ${index + 1}</span><button type="button" class="button small quiet" data-remove>Remove</button></div>
    <div class="field-row">
      <div class="field"><label>Id <span class="hint">short slug, unique in the statement</span></label><input data-field="id" value="${index === 0 ? "main" : ""}"></div>
      <div class="field"><label>Kind</label><select data-field="kind">${CLAUSE_KINDS.map(([k, t]) => html`<option value="${k}">${t}</option>`)}</select></div>
    </div>
    <div class="field"><label>Label</label><input data-field="label" placeholder="A short name for what is asked"></div>
    <div class="field"><label>Text</label><textarea data-field="text" placeholder="The precise question this clause asks. TeX math works."></textarea></div>
    <div class="field"><label>Resolved when</label><input data-field="resolutionCriteria" placeholder="Prove or refute the statement; exhibit a construction; determine the value with proof"></div>
    <div class="field-row" data-quantity hidden>
      <div class="field"><label>Quantity</label><input data-field="quantityName" placeholder="e.g. the minimal number of copies"></div>
      <div class="field"><label>Symbol <span class="hint">TeX, optional</span></label><input data-field="quantitySymbol" placeholder="$n_{\\min}$"></div>
      <div class="field"><label>Direction</label><select data-field="quantityDirection"><option value="exact">exact value</option><option value="upper">upper bound</option><option value="lower">lower bound</option></select></div>
    </div>
  </div>`;
}

function referenceEditor(index) {
  return html`<div class="subitem" data-reference>
    <div class="subitem-head"><span>Reference ${index + 1}</span><button type="button" class="button small quiet" data-remove>Remove</button></div>
    <div data-picker></div>
    <div class="field-row">
      <div class="field"><label>Role</label><select data-ref-field="role">${REFERENCE_ROLES.map(([value, text]) => html`<option value="${value}" ${index === 0 && value === "states-problem" ? "selected" : ""}>${text}</option>`)}</select></div>
      <div class="field"><label>Where to look <span class="hint">optional</span></label><input data-ref-field="locator" placeholder="Theorem 3.2; Section 4"></div>
    </div>
    <div class="field"><label>Why it matters and what to look at</label><textarea data-ref-field="note" placeholder="Two or three sentences."></textarea></div>
  </div>`;
}

function topicChoices(tax, areaId) {
  const topics = tax.topics.filter((t) => t.areaId === areaId);
  return topics.length ? topics.map((t) => html`<label class="check"><input type="checkbox" name="topic" value="${t.id}"> ${t.label}</label>`) : html`<span class="muted small">No topics in this area yet.</span>`;
}

function readClause(el) {
  const v = Object.fromEntries($$("[data-field]", el).map((f) => [f.dataset.field, f.value.trim()]));
  const quantity = QUANTIFIED.has(v.kind) ? { name: v.quantityName, symbol: v.quantitySymbol, direction: v.quantityDirection } : null;
  return { id: v.id, label: v.label, text: v.text, kind: v.kind, resolutionCriteria: v.resolutionCriteria, supersedesClauseId: null, quantity };
}

export async function view({ main, setTitle, alive }) {
  setTitle("Propose a problem");
  if (!signedIn()) {
    mount(main, html`<section class="empty"><h1>Propose a problem</h1><p>Sign in first; the proposal is recorded under your name.</p><p><a class="button primary" href="${loginUrl("/propose")}" data-native>Sign in with GitHub</a></p></section>`);
    return;
  }
  const tax = await taxonomy();
  if (!alive()) return;
  mount(main, html`<form class="form" id="propose" novalidate>
    <div><h1>Propose a problem</h1><p class="form-intro">Any well-defined open problem in quantum science qualifies. Write the statement so a reader can tell, without asking you, what would resolve it. The proposal becomes a candidate; a human verification review admits it to the catalog.</p></div>

    <fieldset class="group"><legend>Problem</legend>
      <div class="field"><label for="p-title">Title</label><input id="p-title" placeholder="Additivity of …"></div>
      <div class="field"><label for="p-alias">Alias <span class="hint">stable slug used in links and file names</span></label><input id="p-alias"></div>
      <div class="field-row">
        <div class="field"><label for="p-area">Area</label><select id="p-area">${tax.areas.map((a) => html`<option value="${a.id}">${a.label}</option>`)}</select></div>
        <div class="field"><label for="p-difficulty">Difficulty</label><select id="p-difficulty">${["unrated", "accessible", "hard", "very-hard"].map((d) => html`<option value="${d}">${d.replace("-", " ")}</option>`)}</select></div>
        <div class="field"><label for="p-origin">Origin</label><select id="p-origin"><option value="source-stated">Stated in a source</option><option value="editor-formulated">Formulated by the proposer</option><option value="derived">Derived from another problem</option></select></div>
        <div class="field"><label for="p-posed">Posed <span class="hint">year, optional</span></label><input id="p-posed" placeholder="2004"></div>
      </div>
      <div class="field"><label>Topics</label><div class="choice" id="p-topics">${topicChoices(tax, tax.areas[0]?.id)}</div></div>
      <div class="field"><label for="p-keywords">Keywords <span class="hint">comma-separated, optional</span></label><input id="p-keywords"></div>
      <div class="field"><label for="p-body">Background and motivation <span class="hint">Markdown</span></label><textarea id="p-body" placeholder="Where the problem comes from, why it matters, what is known."></textarea></div>
    </fieldset>

    <fieldset class="group"><legend>Statement</legend>
      <div class="field"><label for="p-statement">Statement <span class="hint">Markdown: a notation table, then the formal statement</span></label><textarea id="p-statement" class="code" rows="14">${STATEMENT_TEMPLATE}</textarea></div>
      <div class="button-row"><button type="button" class="button small" id="preview-toggle">Preview</button></div>
      <div class="preview prose serif" id="preview" hidden></div>
      <div class="field"><label>Clauses <span class="hint">each clause is one thing that can be resolved on its own</span></label><div id="clauses" style="display:grid;gap:10px"></div></div>
      <div><button type="button" class="button small" id="add-clause">Add clause</button></div>
    </fieldset>

    <fieldset class="group"><legend>References</legend>
      <p class="small muted">Where the problem is stated, the background a reader needs, prior attempts. The notes are the hints agents get; say what to look at, not how to solve it.</p>
      <div id="references" style="display:grid;gap:10px"></div>
      <div><button type="button" class="button small" id="add-reference">Add reference</button></div>
    </fieldset>

    <fieldset class="group"><legend>Submission</legend>
      <div class="field-row">
        <div class="field"><label for="p-ai">AI involvement in drafting</label><select id="p-ai"><option value="none">None</option><option value="assisted">Assisted</option></select></div>
      </div>
      <div class="field"><label for="p-note">Note to reviewers <span class="hint">optional</span></label><textarea id="p-note" placeholder="Why you believe the problem is open, what you checked, what a reviewer should look at."></textarea></div>
    </fieldset>

    <div id="propose-error"></div>
    <div class="form-foot"><button class="button primary" type="submit">Submit proposal</button><span class="small muted">Records are licensed CC-BY-4.0.</span></div>
  </form>`);

  const form = $("#propose", main);
  const pickers = new Map();
  let aliasEdited = false;

  $("#p-title", form).addEventListener("input", (event) => { if (!aliasEdited) $("#p-alias", form).value = slugify(event.target.value); });
  $("#p-alias", form).addEventListener("input", () => { aliasEdited = true; });
  $("#p-area", form).addEventListener("change", (event) => mount($("#p-topics", form), topicChoices(tax, event.target.value)));

  const addClause = () => {
    const holder = document.createElement("div");
    holder.innerHTML = String(clauseEditor($$("[data-clause]", form).length));
    const editor = holder.firstElementChild;
    $("#clauses", form).append(editor);
    $("[data-remove]", editor).addEventListener("click", () => editor.remove());
    $("[data-field=kind]", editor).addEventListener("change", (event) => { $("[data-quantity]", editor).hidden = !QUANTIFIED.has(event.target.value); });
  };
  const addReference = () => {
    const holder = document.createElement("div");
    holder.innerHTML = String(referenceEditor($$("[data-reference]", form).length));
    const editor = holder.firstElementChild;
    $("#references", form).append(editor);
    pickers.set(editor, sourcePicker($("[data-picker]", editor)));
    $("[data-remove]", editor).addEventListener("click", () => { pickers.delete(editor); editor.remove(); });
  };
  $("#add-clause", form).addEventListener("click", addClause);
  $("#add-reference", form).addEventListener("click", addReference);
  addClause();
  addReference();

  $("#preview-toggle", form).addEventListener("click", async (event) => {
    const preview = $("#preview", form);
    preview.hidden = !preview.hidden;
    event.target.textContent = preview.hidden ? "Preview" : "Hide preview";
    if (!preview.hidden) { resetMath(); mount(preview, markdown($("#p-statement", form).value, { headingOffset: 1 })); await typeset(preview); }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = $("#propose-error", form);
    const value = (id) => $(id, form).value.trim();
    const problems = [];
    const title = value("#p-title");
    const alias = value("#p-alias");
    if (!title) problems.push("Give the problem a title.");
    if (!SLUG.test(alias)) problems.push("The alias must be lowercase letters, digits, and single hyphens.");
    const posed = value("#p-posed");
    if (posed && !/^[0-9]{4}(-[0-9]{2}(-[0-9]{2})?)?$/.test(posed)) problems.push("Posed must be a year, YYYY-MM, or YYYY-MM-DD.");
    if (!value("#p-body")) problems.push("Write the background and motivation.");
    const statementBody = $("#p-statement", form).value;
    if (!statementBody.trim()) problems.push("Write the statement.");
    const clauses = $$("[data-clause]", form).map(readClause);
    if (clauses.length === 0) problems.push("Add at least one clause.");
    clauses.forEach((c, i) => {
      if (!SLUG.test(c.id)) problems.push(`Clause ${i + 1} needs a slug id such as “main”.`);
      if (!c.label || !c.text || !c.resolutionCriteria) problems.push(`Clause ${i + 1} needs a label, a text, and a resolution criterion.`);
      if (c.quantity && !c.quantity.name) problems.push(`Clause ${i + 1} asks about a quantity; name it.`);
    });
    if (new Set(clauses.map((c) => c.id)).size !== clauses.length) problems.push("Clause ids must be unique.");
    const references = $$("[data-reference]", form).map((el) => ({ el, picker: pickers.get(el), role: $("[data-ref-field=role]", el).value, locator: $("[data-ref-field=locator]", el).value.trim(), note: $("[data-ref-field=note]", el).value.trim() }));
    references.forEach((r, i) => { for (const p of r.picker.problems()) problems.push(`Reference ${i + 1}: ${p}`); });
    if (problems.length) { mount(errors, html`<div class="notice error" role="alert"><ul>${problems.map((p) => html`<li>${p}</li>`)}</ul></div>`); errors.scrollIntoView({ block: "center" }); return; }

    const digest = await statementDigest(statementBody);
    const records = [
      {
        ref: "problem", type: "Problem", title, role: "primary", parentProblemId: null, parentClauseId: null, aliases: [alias],
        origin: value("#p-origin"), posed: posed || null, areaIds: [value("#p-area")], topicIds: $$("input[name=topic]:checked", form).map((el) => el.value),
        keywords: value("#p-keywords").split(",").map((k) => k.trim()).filter(Boolean), difficulty: value("#p-difficulty"), verificationCost: "unrated", relatedProblemIds: [],
        body: value("#p-body"),
      },
      // Without WebCrypto (plain http away from localhost) the digest is null and the service computes it.
      { ref: "statement", type: "Statement", problemId: "$ref:problem", version: 1, ...(digest ? { digest } : {}), clauses, body: statementBody },
    ];
    references.forEach((r, i) => records.push(...referenceRecords({ id: "$ref:problem" }, r.picker.value(), { role: r.role, target: "problem", locator: r.locator, note: r.note, suffix: `-${i}` })));
    records.push({
      type: "Contribution", kind: "problem-proposal", title: `Proposal: ${title}`, trajectoryId: null,
      problemIds: [], statementId: null, statementDigest: null, clauseIds: [], stopReason: "none",
      newProblemIds: ["$ref:problem"], newStatementId: "$ref:statement", referenceIds: references.map((_, i) => `$ref:reference-${i}`),
      claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [], aiInvolvement: value("#p-ai"), license: "CC-BY-4.0",
      body: value("#p-note") || "Proposed through the web app.",
    });

    const button = $("button[type=submit]", form);
    button.disabled = true;
    try {
      const result = await submitBatch(records);
      const proposalId = result.recordIds[result.recordIds.length - 1];
      toast("Proposal submitted; it waits for a review");
      navigate(`/contributions/${proposalId}`);
    } catch (error) {
      mount(errors, errorBox(error));
      errors.scrollIntoView({ block: "center" });
      button.disabled = false;
    }
  });
}
