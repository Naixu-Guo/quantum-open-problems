// Markdown research packets ("AI research briefs") projected from canonical
// records. Active records keep the exact text published before the canonical
// migration; archived records get a resolution section instead of the
// unresolved remainder.

import { statusLabel, trimSlash } from "../domain.mjs";
import { projectApiV1 } from "./api-v1.mjs";

export const projectResearchPacket = (bundle, catalog, apiRecord = projectApiV1(bundle, catalog)) => {
  const canonical = bundle.record;
  const problem = canonical.problem;
  const orderedProgress = apiRecord.evidence.progress;
  const siteUrl = trimSlash(catalog.registry.siteUrl);
  const solved = apiRecord.status === "solved";
  const lines = [
    `# AI research brief: ${problem.title}`,
    "",
    `- Record ID: ${problem.id}`,
    `- Record revision (SHA-256): ${apiRecord.revision.recordDigest}`,
    `- Formal statement digest (SHA-256): ${apiRecord.revision.statementDigest}`,
    `- Status: ${statusLabel(apiRecord.status)}`,
    `- Field: ${apiRecord.taxonomy.field.label}`,
    `- Topic: ${apiRecord.taxonomy.topic.label}`,
    `- Collection: ${apiRecord.collection.label}`,
    `- Verified: ${apiRecord.dates.verified}`,
    `- Catalog entry: ${siteUrl}/problems/${problem.id}/`,
    `- JSON record: ${siteUrl}/api/v1/problems/${problem.id}.json`,
    `- Propose an update: ${apiRecord.research.submitResult}`,
    "",
    "## Problem source",
    "",
    `- Relationship: ${apiRecord.source.relationship}`,
    `- Title: ${apiRecord.source.title}`,
    `- Authors: ${apiRecord.source.authors.join(", ")}`,
    `- Venue: ${apiRecord.source.venue}`,
    `- Statement locator: ${apiRecord.source.locator}`,
    `- Read source: ${apiRecord.source.url}`,
    "",
    "## Why it matters",
    "",
    problem.question.importance,
    ""
  ];

  if (apiRecord.formulation.notation) {
    lines.push("## Notation", "", apiRecord.formulation.notation, "");
  }
  lines.push("## Formal statement", "", apiRecord.formulation.statement, "");
  if (solved) {
    lines.push("## Resolution", "", "The archived statement is settled. The checked progress below records the settling result and its evidence.", "");
  } else {
    lines.push("## Exact unresolved remainder", "", problem.question.unresolved, "");
  }
  lines.push("## Checked progress", "");

  for (const item of orderedProgress) {
    lines.push(
      `### ${item.date}: ${item.title}`,
      "",
      `- Evidence: ${item.maturity}; ${item.strength}`,
      `- Finding: ${item.detail}`,
      ...(item.url ? [`- Source: ${item.url}`] : []),
      ""
    );
  }

  const cautions = [
    ...canonical.editorial.cautions.map((item) => `${item.label}: ${item.text}${item.url ? ` (${item.url})` : ""}`),
    ...(canonical.editorial.interpretation ? [`Interpretation: ${canonical.editorial.interpretation}`] : []),
    ...(canonical.editorial.provenance?.note ? [`Provenance: ${canonical.editorial.provenance.note}`] : [])
  ];
  if (cautions.length) lines.push("## Scope and cautions", "", ...cautions.map((item) => `- ${item}`), "");

  if (solved) {
    lines.push(
      "## Research protocol",
      "",
      "1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.",
      "2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.",
      "3. Cite primary sources with theorem, page, equation, or version locators when available.",
      "",
      "## Requested output",
      "",
      "Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.",
      ""
    );
  } else {
    lines.push(
      "## Research protocol",
      "",
      "1. Restate the target and its hypotheses before starting the analysis.",
      "2. Match each claimed result against the statement's quantifiers and domain.",
      "3. Label proofs, computations, numerical evidence, and conjectural steps separately.",
      "4. Cite primary sources with theorem, page, equation, or version locators when available.",
      "5. Record failed routes when they rule out a reusable approach.",
      "",
      "## Requested output",
      "",
      "Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.",
      ""
    );
  }
  return lines.join("\n");
};
