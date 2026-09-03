/**
 * Full-ledger validation: parse, schema, identity, layout, references, type rules, uniqueness.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Ajv2020, type ValidateFunction } from "ajv/dist/2020.js";
import addFormatsModule from "ajv-formats";

const addFormats = ((addFormatsModule as unknown as { default?: unknown }).default ?? addFormatsModule) as (ajv: Ajv2020) => void;
import { Ledger, loadRecords, revisionOf, isRevisable, type LoadedRecord } from "./ledger.ts";
import { recordObject } from "./record.ts";
import { TYPE_MODULES } from "./types/index.ts";
import { RECORD_TYPES, TARGET_TYPE_TO_KIND, parseClauseRef, type RecordType, type TargetKind } from "./targets.ts";
import { uniquenessKey, type Source } from "./types/source.ts";
import { primaryProblemId, type Contribution } from "./types/contribution.ts";

export type IssueCategory = "parse" | "schema" | "identity" | "layout" | "reference" | "rule" | "uniqueness";

export interface Issue {
  category: IssueCategory;
  path: string;
  message: string;
}

export interface ValidationReport {
  ledger: Ledger;
  issues: Issue[];
}

const DEFAULT_SCHEMA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "schema");

function buildValidators(schemaDir: string): { byType: Map<RecordType, ValidateFunction>; tombstone: ValidateFunction } {
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictTypes: false, strictRequired: false, allowUnionTypes: true });
  addFormats(ajv);
  for (const file of fs.readdirSync(schemaDir).filter((name) => name.endsWith(".schema.json"))) {
    ajv.addSchema(JSON.parse(fs.readFileSync(path.join(schemaDir, file), "utf8")));
  }
  const byType = new Map<RecordType, ValidateFunction>();
  for (const type of RECORD_TYPES) {
    const file = TYPE_MODULES[type].schemaFile;
    const validate = ajv.getSchema(`https://naixu-guo.github.io/quantum-open-problems/contract/v1/${file}`);
    if (!validate) throw new Error(`schema for ${type} (${file}) did not load`);
    byType.set(type, validate);
  }
  const tombstone = ajv.getSchema("https://naixu-guo.github.io/quantum-open-problems/contract/v1/tombstone.schema.json");
  if (!tombstone) throw new Error("tombstone schema did not load");
  return { byType, tombstone };
}

function formatAjvErrors(validate: ValidateFunction): string {
  return (validate.errors ?? [])
    .map((error) => `${error.instancePath || "/"} ${error.message ?? ""}${error.params && "allowedValues" in error.params ? ` (${JSON.stringify(error.params["allowedValues"])})` : ""}`)
    .join("; ");
}

/** The problem a record belongs to, for layout purposes. */
function owningProblemId(ledger: Ledger, kind: TargetKind, id: string, depth = 0): string | null {
  if (depth > 8) return null;
  switch (kind) {
    case "Problem":
      return ledger.find("Problem", id) ? id : null;
    case "Statement": {
      const statement = ledger.find("Statement", id);
      return statement ? (statement.fields["problemId"] as string) : null;
    }
    case "Clause": {
      const parts = parseClauseRef(id);
      return parts ? owningProblemId(ledger, "Statement", parts.statementId, depth + 1) : null;
    }
    case "Claim": {
      const claim = ledger.find("Claim", id);
      return claim ? owningProblemId(ledger, "Statement", claim.fields["statementId"] as string, depth + 1) : null;
    }
    case "Reference": {
      const reference = ledger.find("Reference", id);
      if (!reference) return null;
      const targetKind = TARGET_TYPE_TO_KIND[reference.fields["targetType"] as string];
      return targetKind ? owningProblemId(ledger, targetKind, reference.fields["targetId"] as string, depth + 1) : null;
    }
    case "Contribution": {
      const contribution = ledger.find("Contribution", id);
      return contribution ? primaryProblemId(contribution.fields as unknown as Contribution) : null;
    }
    case "Review": {
      const review = ledger.find("Review", id);
      return review ? owningProblemId(ledger, "Contribution", review.fields["contributionId"] as string, depth + 1) : null;
    }
    case "Trajectory": {
      const trajectory = ledger.find("Trajectory", id);
      const problemIds = trajectory?.fields["problemIds"];
      return Array.isArray(problemIds) && typeof problemIds[0] === "string" ? problemIds[0] : null;
    }
    case "Comment": {
      const comment = ledger.find("Comment", id);
      if (!comment) return null;
      const targetKind = TARGET_TYPE_TO_KIND[comment.fields["targetType"] as string];
      return targetKind ? owningProblemId(ledger, targetKind, comment.fields["targetId"] as string, depth + 1) : null;
    }
    default:
      return null;
  }
}

/** Where a record must live, relative to its ledger root. */
export function expectedRelPath(record: LoadedRecord, ledger: Ledger): string | undefined {
  const f = record.fields;
  const rev = revisionOf(record);
  const dirOf = (problemId: string | null) => (problemId ? ledger.problemDir(problemId) : undefined);
  switch (record.type) {
    case "Problem": {
      const dir = ledger.problemDir(record.id);
      return dir ? `${dir}/problem.r${rev}.md` : undefined;
    }
    case "Statement": {
      const dir = dirOf(f["problemId"] as string);
      return dir ? `${dir}/statements/v${String(f["version"])}.md` : undefined;
    }
    case "Claim": {
      const dir = dirOf(owningProblemId(ledger, "Claim", record.id));
      return dir ? `${dir}/claims/${record.id}.md` : undefined;
    }
    case "Reference": {
      const dir = dirOf(owningProblemId(ledger, "Reference", record.id));
      return dir ? `${dir}/references/${record.id}.r${rev}.md` : undefined;
    }
    case "Contribution": {
      const problemId = primaryProblemId(f as unknown as Contribution);
      const dir = dirOf(problemId);
      return problemId === null ? `contributions/${record.id}/contribution.md` : dir ? `${dir}/contributions/${record.id}/contribution.md` : undefined;
    }
    case "Review": {
      const contributionId = f["contributionId"] as string;
      const problemId = owningProblemId(ledger, "Contribution", contributionId);
      const dir = dirOf(problemId);
      const base = problemId === null ? `contributions/${contributionId}` : dir ? `${dir}/contributions/${contributionId}` : undefined;
      return base ? `${base}/reviews/${record.id}.md` : undefined;
    }
    case "Decision": {
      const targetKind = TARGET_TYPE_TO_KIND[f["targetType"] as string];
      const problemId = targetKind && targetKind !== "Ledger" ? owningProblemId(ledger, targetKind, f["targetId"] as string) : null;
      const dir = dirOf(problemId);
      return problemId === null ? `decisions/${record.id}.md` : dir ? `${dir}/decisions/${record.id}.md` : undefined;
    }
    case "Source":
      return `sources/${record.id}.r${rev}.md`;
    case "Actor":
      return `actors/${record.id}.r${rev}.md`;
    case "Trajectory":
      return `trajectories/${record.id}.md`;
    case "Artifact":
      return `artifacts/${record.id}.md`;
    case "Comment":
      return `comments/${String(f["targetType"])}/${String(f["targetId"]).replace("#", "--")}/${record.id}.r${rev}.md`;
    default:
      return undefined;
  }
}

export function validateLedger(roots: string[], schemaDir: string = DEFAULT_SCHEMA_DIR): ValidationReport {
  const issues: Issue[] = [];
  const push = (category: IssueCategory, record: { relPath: string } | string, message: string) =>
    issues.push({ category, path: typeof record === "string" ? record : record.relPath, message });

  const { records, issues: loadIssues } = loadRecords(roots);
  for (const issue of loadIssues) push("parse", issue.path, issue.message);
  const ledger = new Ledger(records);
  const validators = buildValidators(schemaDir);

  // Schema.
  for (const record of records) {
    const validate = record.redacted ? validators.tombstone : validators.byType.get(record.type);
    if (!validate) continue;
    if (!validate(recordObject(record))) push("schema", record, formatAjvErrors(validate));
  }

  // Identity: one type per id, unique immutable ids, contiguous revisions.
  for (const [id, list] of ledger.revisions) {
    const types = new Set(list.map((record) => record.type));
    if (types.size > 1) {
      push("identity", list[0]!, `id ${id} is used by more than one type (${[...types].join(", ")})`);
      continue;
    }
    const type = list[0]!.type;
    if (!isRevisable(type)) {
      if (list.length > 1) push("identity", list[1]!, `immutable ${type} ${id} appears ${list.length} times`);
      for (const record of list) if ("revision" in record.fields) push("identity", record, `immutable ${type} carries a revision`);
      continue;
    }
    list.forEach((record, index) => {
      if (revisionOf(record) !== index + 1) push("identity", record, `revisions of ${id} must run 1..n without gaps; found r${revisionOf(record)} at position ${index + 1}`);
    });
  }

  // Layout.
  for (const record of records) {
    const expected = expectedRelPath(record, ledger);
    if (expected === undefined) push("layout", record, "cannot determine where this record belongs (an owner it names is missing)");
    else if (expected !== record.relPath) push("layout", record, `expected at ${expected}`);
  }

  // References and rules, on current, non-redacted records.
  for (const record of records) {
    if (record.redacted) continue;
    const module = TYPE_MODULES[record.type];
    const object = recordObject(record) as never;
    let outgoing: ReturnType<typeof module.references> = [];
    try {
      outgoing = module.references(object);
    } catch (error) {
      push("reference", record, `could not enumerate references: ${error instanceof Error ? error.message : String(error)}`);
    }
    for (const reference of outgoing) {
      if (reference.target === "Ledger") continue;
      if (reference.target === "Clause") {
        if (!ledger.clause(reference.id)) push("reference", record, `${reference.field}: clause ${reference.id} does not resolve`);
        continue;
      }
      if (!ledger.find(reference.target, reference.id)) push("reference", record, `${reference.field}: ${reference.target} ${reference.id} does not resolve`);
    }
    try {
      for (const message of module.rules(object, ledger)) push("rule", record, message);
    } catch (error) {
      push("rule", record, `rule check failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Uniqueness.
  const aliasOwners = new Map<string, LoadedRecord>();
  for (const problem of ledger.currentOf("Problem")) {
    for (const alias of problem.fields["aliases"] as string[]) {
      const owner = aliasOwners.get(alias);
      if (owner && owner.id !== problem.id) push("uniqueness", problem, `alias ${alias} is also used by problem ${owner.id}`);
      aliasOwners.set(alias, problem);
    }
  }
  const sourceKeys = new Map<string, LoadedRecord>();
  for (const source of ledger.currentOf("Source")) {
    const key = uniquenessKey(source.fields as unknown as Source);
    if (!key) continue;
    const owner = sourceKeys.get(key);
    if (owner && owner.id !== source.id) push("uniqueness", source, `source duplicates ${owner.id} (${key})`);
    sourceKeys.set(key, source);
  }
  const acceptances = new Map<string, LoadedRecord>();
  for (const decision of ledger.currentOf("Decision")) {
    if (decision.fields["kind"] !== "acceptance" || decision.fields["supersedes"] !== null) continue;
    const key = `${String(decision.fields["targetId"])}@${String(decision.fields["policyVersion"])}`;
    const owner = acceptances.get(key);
    if (owner) push("uniqueness", decision, `a second acceptance decision for the same contribution under policy ${String(decision.fields["policyVersion"])} (see ${owner.id})`);
    acceptances.set(key, decision);
  }
  for (const problem of ledger.currentOf("Problem")) {
    const versions = ledger.currentOf("Statement").filter((statement) => statement.fields["problemId"] === problem.id);
    if (versions.length === 0) push("uniqueness", problem, "a problem needs at least one statement");
    const seen = new Set<number>();
    for (const statement of versions) {
      const version = statement.fields["version"] as number;
      if (seen.has(version)) push("uniqueness", statement, `statement version ${version} appears twice for this problem`);
      seen.add(version);
    }
  }

  return { ledger, issues };
}
