import { bytesDigest } from "../../contract/src/digest.ts";
import { createHash } from "node:crypto";
import { revisionOf, type Ledger, type LoadedRecord } from "../../contract/src/ledger.ts";

export type ProblemDetailView = "full" | "research";
type ResearchSection = "source" | "progress" | "comment" | "references";

function object(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

/** Compare with the desired catalog projection, never a reconciled export's body. */
export function hasDuplicateCatalogBody(ledger: Ledger, problem: LoadedRecord): boolean {
  const snapshot = object(problem.fields["authoredCatalog"]);
  if (!object(snapshot?.["record"])) return false;
  const desired = ledger.catalogProblemProjections.get(problem.id);
  if (!desired) return false;
  const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
  return hash(problem.body) === desired.bodyHash && hash(snapshot) === desired.authoredCatalogHash;
}

/** Same content identity as context bundles; the source record is not rewritten. */
export function problemProvenance(problem: LoadedRecord) {
  const serialized = JSON.stringify({ fields: problem.fields, body: problem.body }, (_key, value: unknown) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return value;
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
  });
  const catalog = object(problem.fields["authoredCatalog"]);
  return {
    recordId: problem.id,
    revision: revisionOf(problem),
    digest: bytesDigest(Buffer.from(serialized, "utf8")),
    sourcePath: typeof catalog?.["sourcePath"] === "string" ? catalog["sourcePath"] : null,
    resourceUri: `qop://records/${problem.id}`,
    resourceResolution: "current" as const,
  };
}

/** Citation keys are authored sourcecite arguments, not inferred bibliographic facts. */
function citationKeys(text: string): string[] {
  return [...new Set([...text.matchAll(/\\sourcecite\s*\{[^{}]*\}\s*\{([^{}]*)\}/gu)].map((match) => match[1]!.trim()))];
}

export function researchView(problem: LoadedRecord) {
  const catalog = object(problem.fields["authoredCatalog"]);
  const authored = object(catalog?.["record"]);
  const provenance = problemProvenance(problem);
  const entry = (section: ResearchSection, index: number, text: string) => ({
    text,
    textFormat: "tex" as const,
    citationKeys: citationKeys(text),
    provenance: { ...provenance, section, index, locator: `${section}:${index}`, locatorScope: "record-revision" as const },
  });
  const single = (section: "source" | "comment") => typeof authored?.[section] === "string" ? [entry(section, 0, authored[section])] : [];
  const progress = Array.isArray(authored?.["progress"]) ? authored["progress"].flatMap((text: unknown, index: number) => typeof text === "string" ? [entry("progress", index, text)] : []) : [];
  const references = Array.isArray(authored?.["references"]) ? authored["references"].flatMap((value: unknown, index: number) => {
    const reference = object(value);
    if (typeof reference?.["tex"] !== "string" || typeof reference["key"] !== "string" || typeof reference["label"] !== "string") return [];
    return [{ ...entry("references", index, reference["tex"]), key: reference["key"], label: reference["label"], citationKeys: [reference["key"]] }];
  }) : [];
  return {
    schemaVersion: "qop-research/1" as const,
    kind: "authored-catalog-summary" as const,
    available: authored !== undefined,
    semantics: "Maintainer-authored source, progress, comment, and bibliography; these are not accepted ledger claims or reviews. Dates and verification limits remain in the original text. Section:index locators are stable only within the identified Problem revision and digest.",
    ...(!authored ? { unavailableReason: "No authored catalog snapshot is present; this does not imply that no research progress exists." } : {}),
    provenance,
    source: single("source"),
    progress,
    comment: single("comment"),
    references,
  };
}
