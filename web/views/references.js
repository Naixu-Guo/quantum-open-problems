/**
 * Attach a source to a problem: the reference with its role and note, and the contribution
 * that introduces it so it can be reviewed. This is the main channel for human hints.
 */
import { html, mount, $, toast } from "../lib/dom.js";
import { submitBatch } from "../lib/api.js";
import { openDialog, errorBox } from "./shared.js";
import { sourcePicker } from "./sources.js";

export const REFERENCE_ROLES = [
  ["background", "Background"],
  ["states-problem", "States the problem"],
  ["listed-in", "Lists the problem"],
  ["defines", "Defines the objects"],
  ["prior-attempt", "Prior attempt"],
  ["partial-result", "Partial result"],
  ["technique", "Technique that may apply"],
  ["related", "Related result"],
  ["survey", "Survey"],
  ["resolves", "Resolves the problem"],
];

/** The records for one reference on a problem. `source` is a picker value; `target` is "problem" or a clause ref. */
export function referenceRecords(problem, source, { role, target, locator, note, suffix = "" }) {
  const records = [];
  if (source.newSource) records.push({ ref: `source${suffix}`, ...source.newSource });
  const onClause = target !== "problem";
  records.push({ ref: `reference${suffix}`, type: "Reference", sourceId: source.sourceId ?? `$ref:source${suffix}`, targetType: onClause ? "clause" : "problem", targetId: onClause ? target : problem.id, role, locator, body: note });
  return records;
}

export function referenceDialog(problem, onChange) {
  const clauses = problem.statement?.clauses ?? [];
  const dialog = openDialog("Add a reference", html`<form id="reference-form" class="form">
    <p class="form-intro small">Point agents at a source: which one, what role it plays, and what to look at in it. Say why it matters; do not write the solution plan.</p>
    <div id="source-picker"></div>
    <div class="field-row">
      <div class="field"><label for="ref-role">Role</label><select id="ref-role">${REFERENCE_ROLES.map(([value, text]) => html`<option value="${value}">${text}</option>`)}</select></div>
      <div class="field"><label for="ref-target">Attach to</label><select id="ref-target"><option value="problem">The whole problem</option>${clauses.map((c) => html`<option value="${c.ref}">Clause: ${c.label}</option>`)}</select></div>
    </div>
    <div class="field"><label for="ref-locator">Where to look <span class="hint">optional</span></label><input id="ref-locator" placeholder="Theorem 3.2; Section 4; page 12"></div>
    <div class="field"><label for="ref-note">Why it matters and what to look at</label><textarea id="ref-note" required placeholder="Two or three sentences. Markdown and TeX math work."></textarea></div>
    <div id="ref-error"></div>
    <div class="form-foot"><button class="button primary" type="submit">Add reference</button><button class="button quiet" type="button" id="ref-cancel">Cancel</button></div>
  </form>`);
  const picker = sourcePicker($("#source-picker", dialog));
  $("#ref-cancel", dialog).addEventListener("click", () => dialog.close());
  $("#reference-form", dialog).addEventListener("submit", async (event) => {
    event.preventDefault();
    const errors = $("#ref-error", dialog);
    const problems = picker.problems();
    if (problems.length) { mount(errors, html`<div class="notice error"><ul>${problems.map((p) => html`<li>${p}</li>`)}</ul></div>`); return; }
    const source = picker.value();
    const target = $("#ref-target", dialog).value;
    const note = $("#ref-note", dialog).value.trim();
    const onClause = target !== "problem";
    const records = [
      ...referenceRecords(problem, source, { role: $("#ref-role", dialog).value, target, locator: $("#ref-locator", dialog).value.trim(), note }),
      {
        type: "Contribution", kind: "reference", title: `Reference: ${picker.title()}`, trajectoryId: null,
        problemIds: [problem.id], statementId: onClause ? problem.statement.id : null, statementDigest: onClause ? problem.statement.digest : null, clauseIds: onClause ? [target] : [],
        stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: ["$ref:reference"], claimIds: [], artifactIds: [], declaredReadIds: [], revisions: [],
        aiInvolvement: "none", license: "CC-BY-4.0", body: note,
      },
    ];
    const button = $("button[type=submit]", dialog);
    button.disabled = true;
    try {
      await submitBatch(records);
      dialog.close();
      toast("Reference added; it shows on the problem and waits for a review");
      await onChange();
    } catch (error) {
      mount(errors, errorBox(error));
      button.disabled = false;
    }
  });
}
