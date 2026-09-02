import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import {
  currentDecision,
  currentStatement,
  projectApiV1,
  projectResearchPacket,
  readCanonicalRecords,
  readCanonicalSources,
  readJson,
  readRegistry,
  statementContent
} from "./project-v1.mjs";
import { validateAgainstSchema } from "./schema-validator.mjs";

const catalogDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(catalogDirectory);
const schemaDirectory = path.join(catalogDirectory, "schema");
const failures = [];

const check = (condition, message) => {
  if (!condition) failures.push(message);
};

const attempt = (label, operation) => {
  try {
    operation();
  } catch (error) {
    failures.push(`${label}: ${error.message}`);
  }
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

const repoPath = (relativePath, label) => {
  const resolved = path.resolve(repositoryRoot, relativePath);
  check(
    resolved === repositoryRoot || resolved.startsWith(`${repositoryRoot}${path.sep}`),
    `${label}: path escapes the repository: ${relativePath}`
  );
  return resolved;
};

const schemaFiles = fs.readdirSync(schemaDirectory)
  .filter((filename) => filename.endsWith(".schema.json"))
  .sort();
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

const registry = readRegistry();
const bundles = readCanonicalRecords();
const canonicalSources = readCanonicalSources();
const problemIds = new Set();
const problemIdentifiers = new Map();
const entityIds = new Set();
const topicById = new Map(registry.taxonomy.topics.map((topic) => [topic.id, topic]));
const areaById = new Map(registry.taxonomy.areas.map((area) => [area.id, area]));
const collectionById = new Map(registry.collections.map((collection) => [collection.id, collection]));
const sourceById = new Map(canonicalSources.map((source) => [source.id, source]));

check(registry.schemaVersion === "0.1.0", "registry: unsupported schema version");
check(/^\d{4}-\d{2}-\d{2}$/.test(registry.catalogAsOf), "registry: catalogAsOf must be YYYY-MM-DD");
check(areaById.size === registry.taxonomy.areas.length, "registry: duplicate area IDs");
check(topicById.size === registry.taxonomy.topics.length, "registry: duplicate topic IDs");
check(collectionById.size === registry.collections.length, "registry: duplicate collection IDs");
check(sourceById.size === canonicalSources.length, "sources: duplicate source IDs");
for (const error of validateAgainstSchema(registry, path.join(schemaDirectory, "registry.schema.json"))) {
  failures.push(`registry: ${error}`);
}
for (const topic of registry.taxonomy.topics) {
  check(areaById.has(topic.areaId), `registry: topic ${topic.id} references unknown area ${topic.areaId}`);
}
for (const source of canonicalSources) {
  check(
    fs.existsSync(path.join(catalogDirectory, "sources", `${source.id}.json`)),
    `${source.id}: source filename must equal its ID`
  );
  for (const error of validateAgainstSchema(source, path.join(schemaDirectory, "source.schema.json"))) {
    failures.push(`${source.id}: ${error}`);
  }
  entityIds.add(source.id);
}

for (const bundle of bundles) {
  const record = bundle.record;
  const problem = record.problem;
  const label = problem?.id || path.basename(bundle.directory);
  for (const error of validateAgainstSchema(record, path.join(schemaDirectory, "canonical-record.schema.json"))) {
    failures.push(`${label}: ${error}`);
  }
  attempt(label, () => {
    assert.equal(record.schemaVersion, "0.1.0");
    assert.equal(record.kind, "qop-canonical-record");
    assert.equal(problem.kind, "Problem");
    assert.match(problem.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(path.basename(bundle.directory), problem.id);
    assert.ok(!problemIds.has(problem.id), `duplicate problem ID ${problem.id}`);
    problemIds.add(problem.id);
    for (const identifier of [problem.id, ...problem.aliases]) {
      assert.ok(!problemIdentifiers.has(identifier), `${identifier} is already assigned to ${problemIdentifiers.get(identifier)}`);
      problemIdentifiers.set(identifier, problem.id);
    }
    assert.ok(topicById.has(problem.topicId), `unknown topic ${problem.topicId}`);
    assert.ok(collectionById.has(problem.collectionId), `unknown collection ${problem.collectionId}`);
    assert.equal(new Set(problem.aliases).size, problem.aliases.length, "duplicate aliases");
    assert.ok(!problem.aliases.includes(problem.id), "canonical ID must not repeat as an alias");

    const groups = [record.statements, record.claims, record.evidence, record.decisions];
    for (const entity of groups.flat()) {
      assert.ok(entity.id, `${entity.kind || "entity"} is missing an ID`);
      assert.ok(!entityIds.has(entity.id), `duplicate canonical entity ID ${entity.id}`);
      entityIds.add(entity.id);
    }

    const statements = new Map(record.statements.map((statement) => [statement.id, statement]));
    const sources = sourceById;
    const claims = new Map(record.claims.map((claim) => [claim.id, claim]));
    const evidence = new Map(record.evidence.map((item) => [item.id, item]));
    const decisions = new Map(record.decisions.map((item) => [item.id, item]));
    const statement = currentStatement(record);
    const decision = currentDecision(record);
    assert.equal(statement.problemId, problem.id, "current statement belongs to another problem");
    assert.equal(decision.problemId, problem.id, "status decision belongs to another problem");
    assert.ok(statements.has(decision.statementId), "status decision references an unknown statement");
    assert.equal(decision.statementId, statement.id, "current status decision must assess the current statement");
    assert.ok(decision.verified <= registry.catalogAsOf || problem.catalogState === "candidate", "verification is after catalog cutoff");
    assert.ok(["open", "partial", "solved"].includes(decision.status), "invalid derived status");

    const content = statementContent(bundle, statement);
    for (const item of record.statements) {
      assert.equal(item.problemId, problem.id, `${item.id}: statement belongs to another problem`);
      assert.ok(item.created <= registry.catalogAsOf || problem.catalogState === "candidate", `${item.id}: creation is after catalog cutoff`);
      const itemContent = statementContent(bundle, item);
      assert.ok(itemContent.statement, `${item.id}: statement body has no Formal statement section`);
      const sourceIds = item.sourceRefs.map((reference) => reference.sourceId);
      const primarySourceRefs = item.sourceRefs.filter((reference) => reference.primary);
      assert.equal(new Set(sourceIds).size, sourceIds.length, `${item.id}: duplicate source references`);
      assert.equal(primarySourceRefs.length, 1, `${item.id}: expected exactly one primary source reference`);
      for (const sourceId of sourceIds) assert.ok(sources.has(sourceId), `${item.id}: unknown source ${sourceId}`);
    }
    for (const item of record.statements) {
      if (!item.supersedesStatementId) continue;
      const previous = statements.get(item.supersedesStatementId);
      assert.ok(previous, `${item.id}: unknown superseded statement ${item.supersedesStatementId}`);
      assert.ok(previous.version < item.version, `${item.id}: statement versions must increase along supersedes links`);
    }

    const clausesByStatement = new Map(record.statements.map((item) => {
      const clauseIds = new Set(item.targetClauses.map((clause) => clause.id));
      assert.equal(clauseIds.size, item.targetClauses.length, `${item.id}: duplicate target clause IDs`);
      return [item.id, clauseIds];
    }));
    for (const claim of record.claims) {
      assert.ok(statements.has(claim.statementId), `${claim.id}: unknown statement ${claim.statementId}`);
      for (const clauseId of claim.targetClauseIds) {
        assert.ok(clausesByStatement.get(claim.statementId)?.has(clauseId), `${claim.id}: unknown target clause ${clauseId}`);
      }
    }
    for (const item of record.evidence) {
      assert.ok(claims.has(item.claimId), `${item.id}: unknown claim ${item.claimId}`);
      assert.ok(sources.has(item.sourceId), `${item.id}: unknown source ${item.sourceId}`);
      assert.ok(item.date <= registry.catalogAsOf || problem.catalogState === "candidate", `${item.id}: evidence is after catalog cutoff`);
    }
    for (const item of record.decisions) {
      assert.equal(item.problemId, problem.id, `${item.id}: decision belongs to another problem`);
      assert.ok(statements.has(item.statementId), `${item.id}: unknown statement ${item.statementId}`);
      assert.ok(item.effectiveDate <= item.verified, `${item.id}: verification precedes the decision date`);
      assert.ok(item.verified <= registry.catalogAsOf || problem.catalogState === "candidate", `${item.id}: verification is after catalog cutoff`);
      for (const evidenceId of item.evidenceIds) {
        const supportingEvidence = evidence.get(evidenceId);
        assert.ok(supportingEvidence, `${item.id}: unknown evidence ${evidenceId}`);
        const supportingClaim = supportingEvidence && claims.get(supportingEvidence.claimId);
        assert.equal(supportingClaim?.statementId, item.statementId, `${item.id}: evidence is scoped to another statement`);
      }
      if (item.outcome === "rejected") {
        assert.equal(item.supersedesDecisionId, null, `${item.id}: a rejected decision cannot supersede an accepted decision`);
      }
      if (!item.supersedesDecisionId) continue;
      assert.notEqual(item.supersedesDecisionId, item.id, `${item.id}: a decision cannot supersede itself`);
      const previous = decisions.get(item.supersedesDecisionId);
      assert.ok(previous, `${item.id}: unknown superseded decision ${item.supersedesDecisionId}`);
      assert.equal(previous.outcome, "accepted", `${item.id}: only an accepted decision can be superseded`);
      assert.ok(previous.effectiveDate <= item.effectiveDate, `${item.id}: decision dates must increase along supersedes links`);
    }

    if (record.compatibility.apiV1) {
      assert.equal(problem.catalogState, "published", "API v1 compatibility requires catalogState published");
      assert.ok(["open", "partial"].includes(decision.status), "API v1 compatibility requires an active status");
      assert.ok(problem.proposed, "API v1 compatibility requires a proposed date");
      const expectedRecordPath = repoPath(record.compatibility.apiV1.expectedRecordPath, label);
      const expectedPacketPath = repoPath(record.compatibility.apiV1.expectedPacketPath, label);
      assert.ok(fs.existsSync(expectedRecordPath), "expected API v1 record is missing");
      assert.ok(fs.existsSync(expectedPacketPath), "expected research packet is missing");
      assert.deepEqual(
        projectApiV1(bundle, registry, canonicalSources),
        readJson(expectedRecordPath),
        "API v1 projection drifted"
      );
      assert.equal(
        projectResearchPacket(bundle, registry, canonicalSources),
        fs.readFileSync(expectedPacketPath, "utf8"),
        "research packet projection drifted"
      );
    }

    if (record.compatibility.archivePagePath) {
      assert.equal(problem.catalogState, "archived", "archivePagePath requires catalogState archived");
      assert.equal(decision.status, "solved", "only solved records use archivePagePath");
      const archivePath = repoPath(record.compatibility.archivePagePath, label);
      assert.ok(fs.existsSync(archivePath), "archive page is missing");
      const archive = fs.readFileSync(archivePath, "utf8");
      assert.ok(archive.includes("Archived record"), "archive page does not identify an archived record");
      assert.ok(archive.includes(problem.title), "archive page title disagrees with canonical data");
    }

    if (record.compatibility.sourceImport) {
      assert.equal(problem.catalogState, "candidate", "source imports remain candidates until editorial acceptance");
      const mapping = record.compatibility.sourceImport;
      const sourcePath = repoPath(mapping.sourceJsonPath, label);
      const imported = readJson(sourcePath);
      const importedStatus = String(imported.status).toLowerCase() === "unsolved" ? "open" : String(imported.status).toLowerCase();
      assert.equal(imported.id, mapping.sourceId, "source import ID drifted");
      assert.ok(problem.aliases.includes(imported.id), "source import ID is not retained as an alias");
      assert.equal(imported.title, problem.title, "source import title drifted");
      assert.equal(importedStatus, decision.status, "source import status drifted");
      assert.deepEqual(imported.tags, problem.keywords, "source import tags drifted");
      assert.equal(imported.source.sha256, mapping.sourceSha256, "recorded source digest drifted");
      assert.equal(sha256(imported.source_tex), mapping.sourceSha256, "embedded TeX digest is invalid");
      const sourceTexPath = path.resolve(path.dirname(sourcePath), imported.source.file);
      assert.ok(sourceTexPath.startsWith(`${repositoryRoot}${path.sep}`), "imported TeX path escapes the repository");
      assert.equal(fs.readFileSync(sourceTexPath, "utf8"), imported.source_tex, "source TeX and embedded TeX differ");
      assert.equal(content.statement, imported.sections.problem_statement.latex, "canonical statement differs from source import");
    }
  });
}

const statuses = bundles.map((bundle) => currentDecision(bundle.record).status);
check(statuses.includes("open"), "vertical slice requires an open record");
check(statuses.includes("partial"), "vertical slice requires a partially solved record");
check(statuses.includes("solved"), "vertical slice requires a solved record");
check(bundles.some((bundle) => bundle.record.compatibility.sourceImport), "vertical slice requires a v2 source import");
check(bundles.filter((bundle) => bundle.record.compatibility.apiV1).length >= 2, "vertical slice requires two API v1 projections");

if (failures.length) {
  console.error(`Canonical validation failed with ${failures.length} error(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const states = bundles.reduce((counts, bundle) => {
    const state = bundle.record.problem.catalogState;
    counts[state] = (counts[state] || 0) + 1;
    return counts;
  }, {});
  console.log(
    `Canonical vertical slice passed: ${bundles.length} records `
    + `(${states.published || 0} published, ${states.archived || 0} archived, ${states.candidate || 0} candidate).`
  );
}
