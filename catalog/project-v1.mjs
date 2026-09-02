import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const catalogDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(catalogDirectory);
const problemsDirectory = path.join(catalogDirectory, "problems");
const sourcesDirectory = path.join(catalogDirectory, "sources");

export const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

export const readRegistry = () => readJson(path.join(catalogDirectory, "registry.json"));

export const readCanonicalSources = () => fs.readdirSync(sourcesDirectory)
  .filter((filename) => filename.endsWith(".json"))
  .map((filename) => readJson(path.join(sourcesDirectory, filename)))
  .sort((a, b) => a.id.localeCompare(b.id));

export const readCanonicalRecords = () => fs.readdirSync(problemsDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    directory: path.join(problemsDirectory, entry.name),
    record: readJson(path.join(problemsDirectory, entry.name, "record.json"))
  }))
  .sort((a, b) => a.record.problem.id.localeCompare(b.record.problem.id));

export const extractSection = (markdown, heading) => {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const body = markdown.slice(start + marker.length);
  const end = body.search(/^## /m);
  return (end < 0 ? body : body.slice(0, end)).trim();
};

const byId = (items) => new Map(items.map((item) => [item.id, item]));
const sha256 = (value) => createHash("sha256").update(value).digest("hex");

export const currentStatement = (record) => {
  const superseded = new Set(record.statements
    .map((statement) => statement.supersedesStatementId)
    .filter(Boolean));
  const statements = record.statements.filter((statement) => !superseded.has(statement.id));
  if (statements.length !== 1) {
    throw new Error(`${record.problem.id}: expected exactly one current statement`);
  }
  return statements[0];
};

export const currentDecision = (record) => {
  const superseded = new Set(record.decisions
    .filter((decision) => decision.outcome === "accepted")
    .map((decision) => decision.supersedesDecisionId)
    .filter(Boolean));
  const decisions = record.decisions.filter((decision) => decision.decisionType === "status-assessment"
    && decision.outcome === "accepted"
    && !superseded.has(decision.id));
  if (decisions.length !== 1) {
    throw new Error(`${record.problem.id}: expected exactly one current accepted status decision`);
  }
  return decisions[0];
};

export const statementContent = (bundle, statement = currentStatement(bundle.record)) => {
  const filePath = path.resolve(bundle.directory, statement.bodyPath);
  if (!filePath.startsWith(`${bundle.directory}${path.sep}`)) {
    throw new Error(`${bundle.record.problem.id}: statement path escapes its problem bundle`);
  }
  const markdown = fs.readFileSync(filePath, "utf8");
  return {
    markdown,
    notation: extractSection(markdown, "Notation"),
    statement: extractSection(markdown, "Formal statement")
  };
};

const sourceRelationship = (relationship) => {
  if (relationship === "states-problem") return "The source states the cataloged problem.";
  if (relationship === "documents-gap") return "The source documents the gap used to formulate this problem.";
  throw new Error(`Unsupported API v1 problem-source relationship: ${relationship}`);
};

const contributionUrl = (registry, problem) => {
  const url = new URL(`${registry.repositoryUrl.replace(/\/$/, "")}/issues/new`);
  url.searchParams.set("template", "research-update.yml");
  url.searchParams.set("title", `[Research update] ${problem.title}`);
  return url.href;
};

const digestProjection = (record) => {
  const { research, links, ...rest } = record;
  const dates = { ...record.dates };
  delete dates.catalogAsOf;
  return { ...rest, dates };
};

export const projectApiV1 = (bundle, registry = readRegistry(), canonicalSources = readCanonicalSources()) => {
  const canonical = bundle.record;
  const problem = canonical.problem;
  const statement = currentStatement(canonical);
  const decision = currentDecision(canonical);
  if (!canonical.compatibility.apiV1) {
    throw new Error(`${problem.id}: record is not enabled for API v1 compatibility projection`);
  }
  if (problem.catalogState !== "published") {
    throw new Error(`${problem.id}: API v1 projection requires catalogState published`);
  }
  if (!["open", "partial"].includes(decision.status)) {
    throw new Error(`${problem.id}: API v1 supports active records only`);
  }
  if (!problem.proposed) throw new Error(`${problem.id}: API v1 requires a proposed date`);

  const topics = byId(registry.taxonomy.topics);
  const areas = byId(registry.taxonomy.areas);
  const collections = byId(registry.collections);
  const sources = byId(canonicalSources);
  const claims = byId(canonical.claims);
  const topic = topics.get(problem.topicId);
  const area = areas.get(topic?.areaId);
  const collection = collections.get(problem.collectionId);
  const primarySourceRefs = statement.sourceRefs.filter((reference) => reference.primary);
  if (primarySourceRefs.length !== 1) {
    throw new Error(`${problem.id}: API v1 requires exactly one primary statement source`);
  }
  const primarySourceRef = primarySourceRefs[0];
  const problemSource = sources.get(primarySourceRef.sourceId);
  if (!topic || !area || !collection) throw new Error(`${problem.id}: unresolved taxonomy or collection reference`);
  if (!problemSource?.url) throw new Error(`${problem.id}: API v1 requires a linked primary source`);
  const formulation = statementContent(bundle, statement);
  const progress = canonical.evidence
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) => {
      const claim = claims.get(item.claimId);
      const source = sources.get(item.sourceId);
      if (!claim || !source) throw new Error(`${problem.id}: unresolved claim or evidence source reference`);
      return {
        date: item.date,
        title: claim.title,
        detail: claim.text,
        maturity: item.maturity,
        strength: item.strength,
        ...(source.url ? { url: source.url } : {}),
        label: item.label
      };
    });
  const siteUrl = registry.siteUrl.replace(/\/$/, "");
  const repositoryUrl = registry.repositoryUrl.replace(/\/$/, "");
  const record = {
    schemaVersion: 1,
    kind: "quantum-open-problem",
    id: problem.id,
    title: problem.title,
    status: decision.status,
    dates: {
      proposed: problem.proposed,
      latestEvidence: progress[0]?.date || decision.effectiveDate,
      verified: decision.verified,
      catalogAsOf: registry.catalogAsOf
    },
    taxonomy: {
      field: { id: area.id, label: area.label },
      topic: { id: topic.id, label: topic.label }
    },
    collection: {
      id: collection.id,
      label: collection.label,
      title: collection.title,
      url: collection.url
    },
    question: {
      type: problem.question.type,
      summary: problem.question.summary,
      importance: problem.question.importance,
      unresolved: problem.question.unresolved
    },
    formulation: {
      notation: formulation.notation,
      statement: formulation.statement
    },
    source: {
      title: problemSource.title,
      authors: problemSource.authors,
      venue: problemSource.venue,
      locator: primarySourceRef.locator,
      url: problemSource.url,
      relationship: sourceRelationship(primarySourceRef.relationship)
    },
    evidence: {
      progress,
      cautions: canonical.editorial.cautions.map((caution) => ({
        label: caution.label,
        text: caution.text,
        ...(caution.url ? { url: caution.url } : {})
      })),
      interpretation: canonical.editorial.interpretation,
      provenance: canonical.editorial.provenance
    },
    relations: {
      relatedProblems: problem.relatedProblemIds
    },
    discovery: {
      keywords: problem.keywords
    },
    research: {
      briefMarkdown: `${siteUrl}/packets/${problem.id}.md`,
      submitResult: contributionUrl(registry, problem),
      contributionSchema: `${siteUrl}/api/v1/contribution.schema.json`
    },
    links: {
      self: `${siteUrl}/api/v1/problems/${problem.id}.json`,
      human: `${siteUrl}/problems/${problem.id}/`,
      explorer: `${siteUrl}/#${problem.id}`,
      markdown: `${siteUrl}/packets/${problem.id}.md`,
      schema: `${siteUrl}/api/v1/problem.schema.json`,
      api: `${siteUrl}/api/v1/problems/${problem.id}.json`,
      sourceRecord: `${repositoryUrl}/blob/main/open_prob/${problem.id}/problem.md`
    }
  };
  return {
    ...record,
    revision: {
      algorithm: "sha256",
      projection: "content-v1",
      recordDigest: sha256(JSON.stringify(digestProjection(record))),
      statementDigest: sha256(record.formulation.statement)
    }
  };
};

const statusLabel = (status) => status === "partial" ? "Partially solved" : "Open";

export const projectResearchPacket = (
  bundle,
  registry = readRegistry(),
  canonicalSources = readCanonicalSources()
) => {
  const canonical = bundle.record;
  const problem = canonical.problem;
  const apiRecord = projectApiV1(bundle, registry, canonicalSources);
  const orderedProgress = apiRecord.evidence.progress;
  const siteUrl = registry.siteUrl.replace(/\/$/, "");
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
  lines.push(
    "## Formal statement",
    "",
    apiRecord.formulation.statement,
    "",
    "## Exact unresolved remainder",
    "",
    problem.question.unresolved,
    "",
    "## Checked progress",
    ""
  );

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
  return lines.join("\n");
};

const writePreview = (outputDirectory) => {
  const registry = readRegistry();
  const canonicalSources = readCanonicalSources();
  const bundles = readCanonicalRecords().filter((bundle) => bundle.record.compatibility.apiV1);
  const problemOutput = path.join(outputDirectory, "api", "v1", "problems");
  const packetOutput = path.join(outputDirectory, "packets");
  fs.mkdirSync(problemOutput, { recursive: true });
  fs.mkdirSync(packetOutput, { recursive: true });
  for (const bundle of bundles) {
    const id = bundle.record.problem.id;
    fs.writeFileSync(
      path.join(problemOutput, `${id}.json`),
      `${JSON.stringify(projectApiV1(bundle, registry, canonicalSources), null, 2)}\n`
    );
    fs.writeFileSync(
      path.join(packetOutput, `${id}.md`),
      projectResearchPacket(bundle, registry, canonicalSources)
    );
  }
  console.log(`Projected ${bundles.length} canonical records to ${outputDirectory}`);
};

const isMain = process.argv[1]
  && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  const outIndex = process.argv.indexOf("--out");
  if (outIndex < 0 || !process.argv[outIndex + 1]) {
    console.error("Usage: node catalog/project-v1.mjs --out <directory>");
    process.exit(2);
  }
  writePreview(path.resolve(repositoryRoot, process.argv[outIndex + 1]));
}
