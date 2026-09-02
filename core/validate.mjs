#!/usr/bin/env node
// Canonical catalog validation: schemas, identities, references, immutability,
// status derivation, published-revision compatibility, and the event ledger.
// Usage: node core/validate.mjs [--allow-stale-ledger]

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  editorialNotes,
  loadCatalog,
  readContributions,
  readJson,
  repositoryRoot,
  schemaDirectory,
  sourcesDirectory,
  statementContent
} from "./catalog.mjs";
import {
  RECORD_ID,
  currentDecision,
  currentStatement,
  isArchived,
  isPublic,
  sha256
} from "./domain.mjs";
import { planLedgerUpdate, verifyLedgerStructure } from "./ledger.mjs";
import { projectApiV1 } from "./projection/api-v1.mjs";
import { frontierConsistencyErrors, projectFrontier } from "./projection/frontier.mjs";
import { validateAgainstSchema } from "./schema-validator.mjs";

export const validateCatalog = (catalog = loadCatalog(), options = {}) => {
  const failures = [];
  const check = (condition, message) => { if (!condition) failures.push(message); };
  const attempt = (label, operation) => {
    try { operation(); } catch (error) { failures.push(`${label}: ${error.message}`); }
  };
  const repoPath = (relativePath, label) => {
    const resolved = path.resolve(repositoryRoot, relativePath);
    check(resolved.startsWith(`${repositoryRoot}${path.sep}`), `${label}: path escapes the repository: ${relativePath}`);
    return resolved;
  };

  // Schemas -----------------------------------------------------------------
  const schemaFiles = fs.readdirSync(schemaDirectory).filter((filename) => filename.endsWith(".schema.json")).sort();
  const schemaNames = new Set(schemaFiles);
  for (const filename of schemaFiles) {
    attempt(`schema/${filename}`, () => {
      const schema = readJson(path.join(schemaDirectory, filename));
      check(schema.$schema === "https://json-schema.org/draft/2020-12/schema", `${filename}: wrong JSON Schema draft`);
      check(Boolean(schema.$id), `${filename}: missing $id`);
      const references = JSON.stringify(schema).match(/[a-z-]+\.schema\.json/g) || [];
      for (const reference of references) {
        if (reference !== filename) check(schemaNames.has(reference), `${filename}: missing schema reference ${reference}`);
      }
    });
  }

  // Registry ----------------------------------------------------------------
  const { registry, sources, bundles, topicById, areaById, collectionById, sourceById } = catalog;
  for (const error of validateAgainstSchema(registry, path.join(schemaDirectory, "registry.schema.json"))) {
    failures.push(`registry: ${error}`);
  }
  check(areaById.size === registry.taxonomy.areas.length, "registry: duplicate area IDs");
  check(topicById.size === registry.taxonomy.topics.length, "registry: duplicate topic IDs");
  check(collectionById.size === registry.collections.length, "registry: duplicate collection IDs");
  check(registry.baselineAuditDate <= registry.catalogAsOf, "registry: baselineAuditDate must not follow catalogAsOf");
  for (const topic of registry.taxonomy.topics) {
    check(areaById.has(topic.areaId), `registry: topic ${topic.id} references unknown area ${topic.areaId}`);
  }

  // Sources -----------------------------------------------------------------
  check(sourceById.size === sources.length, "sources: duplicate source IDs");
  const sourceUrls = new Map();
  for (const source of sources) {
    check(fs.existsSync(path.join(catalog.paths?.sourcesDirectory || sourcesDirectory, `${source.id}.json`)), `${source.id}: source filename must equal its ID`);
    for (const error of validateAgainstSchema(source, path.join(schemaDirectory, "source.schema.json"))) {
      failures.push(`${source.id}: ${error}`);
    }
    if (source.url) {
      check(!sourceUrls.has(source.url), `${source.id}: duplicates the URL of ${sourceUrls.get(source.url)}`);
      sourceUrls.set(source.url, source.id);
    }
  }
  const referencedSources = new Set();

  // Records -----------------------------------------------------------------
  const problemIds = new Set();
  const problemIdentifiers = new Map();
  const entityIds = new Set(sources.map((source) => source.id));
  const frontiers = new Map();
  const details = new Map();

  for (const bundle of bundles) {
    const record = bundle.record;
    const problem = record.problem;
    const label = problem?.id || path.basename(bundle.directory);
    for (const error of validateAgainstSchema(record, path.join(schemaDirectory, "canonical-record.schema.json"))) {
      failures.push(`${label}: ${error}`);
    }
    attempt(label, () => {
      const assert = (condition, message) => { if (!condition) throw new Error(message); };
      assert(record.schemaVersion === "0.2.0", "unsupported record schema version");
      assert(RECORD_ID.test(problem.id), "problem ID must be lowercase kebab-case");
      assert(path.basename(bundle.directory) === problem.id, "bundle directory must equal the problem ID");
      assert(!problemIds.has(problem.id), `duplicate problem ID ${problem.id}`);
      problemIds.add(problem.id);
      for (const identifier of [problem.id, ...problem.aliases]) {
        assert(!problemIdentifiers.has(identifier), `${identifier} is already assigned to ${problemIdentifiers.get(identifier)}`);
        problemIdentifiers.set(identifier, problem.id);
      }
      assert(topicById.has(problem.topicId), `unknown topic ${problem.topicId}`);
      assert(collectionById.has(problem.collectionId), `unknown collection ${problem.collectionId}`);
      assert(!problem.aliases.includes(problem.id), "canonical ID must not repeat as an alias");
      assert(problem.question.importance !== problem.question.summary, "importance must add information beyond the summary");
      const collection = collectionById.get(problem.collectionId);
      if (collection.quantumInformationLegacy) {
        assert(topicById.get(problem.topicId).areaId === "quantum-information",
          "entries inherited from the quantum-information lists must stay in the quantum-information field");
      }

      for (const entity of [record.statements, record.claims, record.evidence, record.decisions].flat()) {
        assert(entity.id, `${entity.kind || "entity"} is missing an ID`);
        assert(!entityIds.has(entity.id), `duplicate canonical entity ID ${entity.id}`);
        entityIds.add(entity.id);
      }

      const statements = new Map(record.statements.map((statement) => [statement.id, statement]));
      const claims = new Map(record.claims.map((claim) => [claim.id, claim]));
      const evidence = new Map(record.evidence.map((item) => [item.id, item]));
      const decisions = new Map(record.decisions.map((item) => [item.id, item]));
      const statement = currentStatement(record);
      const decision = currentDecision(record);
      const candidate = problem.catalogState === "candidate";
      assert(statement.problemId === problem.id, "current statement belongs to another problem");
      assert(decision.problemId === problem.id, "status decision belongs to another problem");
      assert(decision.statementId === statement.id, "current status decision must assess the current statement");
      assert(decision.verified <= registry.catalogAsOf || candidate, "verification is after catalog cutoff");
      assert(isArchived(record) === (decision.status === "solved") || candidate,
        "archived catalog state and solved status must coincide for public records");

      for (const item of record.statements) {
        assert(item.problemId === problem.id, `${item.id}: statement belongs to another problem`);
        assert(item.created <= registry.catalogAsOf || candidate, `${item.id}: creation is after catalog cutoff`);
        const content = statementContent(bundle, item);
        assert(content.statement, `${item.id}: statement body has no Formal statement section`);
        const sourceIds = item.sourceRefs.map((reference) => reference.sourceId);
        assert(new Set(sourceIds).size === sourceIds.length, `${item.id}: duplicate source references`);
        assert(item.sourceRefs.filter((reference) => reference.primary).length === 1, `${item.id}: expected exactly one primary source reference`);
        for (const sourceId of sourceIds) {
          assert(sourceById.has(sourceId), `${item.id}: unknown source ${sourceId}`);
          referencedSources.add(sourceId);
        }
        const clauseIds = item.targetClauses.map((clause) => clause.id);
        assert(new Set(clauseIds).size === clauseIds.length, `${item.id}: duplicate target clause IDs`);
        if (item.supersedesStatementId) {
          const previous = statements.get(item.supersedesStatementId);
          assert(previous, `${item.id}: unknown superseded statement ${item.supersedesStatementId}`);
          assert(previous.version < item.version, `${item.id}: statement versions must increase along supersedes links`);
          assert(previous.created <= item.created, `${item.id}: statement dates must increase along supersedes links`);
        }
      }
      const versions = record.statements.map((item) => item.version);
      assert(new Set(versions).size === versions.length, "duplicate statement versions");

      const clausesByStatement = new Map(record.statements.map((item) => [item.id, new Set(item.targetClauses.map((clause) => clause.id))]));
      for (const claim of record.claims) {
        assert(statements.has(claim.statementId), `${claim.id}: unknown statement ${claim.statementId}`);
        for (const clauseId of claim.targetClauseIds) {
          assert(clausesByStatement.get(claim.statementId)?.has(clauseId), `${claim.id}: unknown target clause ${clauseId}`);
        }
        if (claim.supersedesClaimId) {
          assert(claim.supersedesClaimId !== claim.id, `${claim.id}: a claim cannot supersede itself`);
          assert(claims.has(claim.supersedesClaimId), `${claim.id}: unknown superseded claim ${claim.supersedesClaimId}`);
        }
        assert(record.evidence.some((item) => item.claimId === claim.id), `${claim.id}: an accepted claim needs at least one evidence record`);
      }
      for (const item of record.evidence) {
        assert(claims.has(item.claimId), `${item.id}: unknown claim ${item.claimId}`);
        assert(sourceById.has(item.sourceId), `${item.id}: unknown source ${item.sourceId}`);
        referencedSources.add(item.sourceId);
        assert(item.date <= registry.catalogAsOf || candidate, `${item.id}: evidence is after catalog cutoff`);
      }
      for (const item of record.decisions) {
        assert(item.problemId === problem.id, `${item.id}: decision belongs to another problem`);
        assert(statements.has(item.statementId), `${item.id}: unknown statement ${item.statementId}`);
        assert(item.effectiveDate <= item.verified, `${item.id}: verification precedes the decision date`);
        assert(item.verified <= registry.catalogAsOf || candidate, `${item.id}: verification is after catalog cutoff`);
        for (const evidenceId of item.evidenceIds) {
          const supporting = evidence.get(evidenceId);
          assert(supporting, `${item.id}: unknown evidence ${evidenceId}`);
          assert(claims.get(supporting.claimId)?.statementId === item.statementId, `${item.id}: evidence is scoped to another statement`);
        }
        if (item.outcome === "rejected") {
          assert(item.supersedesDecisionId === null, `${item.id}: a rejected decision cannot supersede an accepted decision`);
        }
        if (!item.supersedesDecisionId) continue;
        assert(item.supersedesDecisionId !== item.id, `${item.id}: a decision cannot supersede itself`);
        const previous = decisions.get(item.supersedesDecisionId);
        assert(previous, `${item.id}: unknown superseded decision ${item.supersedesDecisionId}`);
        assert(previous.outcome === "accepted", `${item.id}: only an accepted decision can be superseded`);
        assert(previous.effectiveDate <= item.effectiveDate, `${item.id}: decision dates must increase along supersedes links`);
      }

      // Provenance snapshots must exist and agree with the object.
      const contributions = new Map(readContributions(bundle).map((snapshot) => [snapshot.candidateUpdate.id, snapshot]));
      for (const object of [...record.claims, ...record.evidence, ...record.decisions]) {
        if (!object.provenance) continue;
        const snapshotPath = path.join(bundle.directory, object.provenance.contributionPath);
        assert(fs.existsSync(snapshotPath), `${object.id}: provenance snapshot ${object.provenance.contributionPath} is missing`);
        const snapshot = contributions.get(object.provenance.candidateUpdateId);
        assert(snapshot, `${object.id}: provenance references unknown candidate update ${object.provenance.candidateUpdateId}`);
        assert(snapshot.candidateUpdate.problemId === problem.id, `${object.id}: promoted candidate update belongs to another problem`);
        for (const reviewId of object.provenance.reviewIds) {
          assert(snapshot.reviews.some((review) => review.id === reviewId), `${object.id}: provenance cites review ${reviewId} missing from the snapshot`);
        }
      }
      for (const snapshot of contributions.values()) {
        for (const error of validateAgainstSchema(snapshot, path.join(schemaDirectory, "contribution-snapshot.schema.json"))) {
          failures.push(`${label}: contributions/${snapshot.candidateUpdate.id}: ${error}`);
        }
        assert(snapshot.candidateUpdate.problemId === problem.id, `contributions/${snapshot.candidateUpdate.id}: belongs to another problem`);
        assert(snapshot.promotedObjectIds.every((id) => claims.has(id) || evidence.has(id) || decisions.has(id)),
          `contributions/${snapshot.candidateUpdate.id}: promotedObjectIds must exist in the record`);
      }

      if (record.editorial.notesPath) {
        assert(editorialNotes(bundle), `editorial notes ${record.editorial.notesPath} are missing`);
      }

      if (isPublic(record)) {
        assert(problem.proposed, "public records need a proposed date");
        const detail = projectApiV1(bundle, catalog);
        details.set(problem.id, detail);
        const frontier = projectFrontier(bundle, catalog, { apiRecord: detail });
        frontiers.set(problem.id, frontier);
        for (const error of frontierConsistencyErrors(frontier)) failures.push(error);
        const published = catalog.publishedRevisions.records[problem.id];
        assert(published, "public record is missing from catalog/compatibility/published-revisions.json; run node scripts/record-published-revisions.mjs and review the digest change");
        if (published) {
          assert(published.recordDigest === detail.revision.recordDigest,
            `record digest ${detail.revision.recordDigest.slice(0, 12)} differs from the published revision ${published.recordDigest.slice(0, 12)}; research content changed. Re-run node scripts/record-published-revisions.mjs in the same change if the change is intended`);
          assert(published.statementDigest === detail.revision.statementDigest,
            "statement digest differs from the published revision; publish a new statement version instead of editing");
        }
      }

      if (record.sourceImport) {
        const mapping = record.sourceImport;
        const importedStatement = statements.get(mapping.statementId);
        assert(importedStatement, `sourceImport references unknown statement ${mapping.statementId}`);
        const sourcePath = repoPath(mapping.sourceJsonPath, label);
        const imported = readJson(sourcePath);
        assert(imported.id === mapping.sourceId, "source import ID drifted");
        assert(problem.aliases.includes(imported.id), "source import ID is not retained as an alias");
        assert(imported.source.sha256 === mapping.sourceSha256, "recorded source digest drifted");
        assert(sha256(imported.source_tex) === mapping.sourceSha256, "embedded TeX digest is invalid");
        const sourceTexPath = path.resolve(path.dirname(sourcePath), imported.source.file);
        assert(sourceTexPath.startsWith(`${repositoryRoot}${path.sep}`), "imported TeX path escapes the repository");
        assert(fs.readFileSync(sourceTexPath, "utf8") === imported.source_tex, "source TeX and embedded TeX differ");
        const content = statementContent(bundle, importedStatement);
        assert(content.statement === imported.sections.problem_statement.latex, "imported statement version differs from the source record");
        if (importedStatement.id === statement.id) {
          assert(String(imported.title) === problem.title, "source import title drifted while the imported statement is current");
        }
      }
    });
  }

  for (const bundle of bundles) {
    for (const relatedId of bundle.record.problem.relatedProblemIds) {
      check(problemIds.has(relatedId), `${bundle.record.problem.id}: unknown related problem ${relatedId}`);
      check(relatedId !== bundle.record.problem.id, `${bundle.record.problem.id}: a problem cannot relate to itself`);
    }
  }
  for (const source of sources) {
    check(referencedSources.has(source.id), `${source.id}: source is not referenced by any record`);
  }
  for (const id of Object.keys(catalog.publishedRevisions.records)) {
    const bundle = catalog.bundleById.get(id);
    check(bundle && isPublic(bundle.record), `published-revisions: ${id} is not a public record`);
  }

  // Ledger ------------------------------------------------------------------
  for (const error of verifyLedgerStructure(catalog.ledger)) failures.push(error);
  attempt("ledger", () => {
    const plan = planLedgerUpdate(catalog);
    for (const error of plan.errors) failures.push(`ledger: ${error}`);
    if (plan.appended.length && !options.allowStaleLedger) {
      failures.push(`ledger: ${plan.appended.length} canonical change(s) are not recorded in catalog/events.jsonl; run node site/build.mjs and commit the ledger`);
    }
  });
  for (const entry of catalog.ledger) {
    if (entry.type.endsWith(".removed")) continue;
    check(problemIds.has(entry.problemId), `ledger ${entry.id}: unknown problem ${entry.problemId}`);
  }

  return { failures, details, frontiers };
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const catalog = loadCatalog();
  const { failures } = validateCatalog(catalog, { allowStaleLedger: process.argv.includes("--allow-stale-ledger") });
  if (failures.length) {
    console.error(`Canonical validation failed with ${failures.length} error(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  } else {
    const states = catalog.bundles.reduce((counts, bundle) => {
      const state = bundle.record.problem.catalogState;
      counts[state] = (counts[state] || 0) + 1;
      return counts;
    }, {});
    console.log(`Canonical catalog passed: ${catalog.bundles.length} records `
      + `(${states.published || 0} published, ${states.archived || 0} archived, ${states.candidate || 0} candidate), `
      + `${catalog.sources.length} sources, ${catalog.ledger.length} ledger events.`);
  }
}
