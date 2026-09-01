import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(siteDirectory, "data");
const apiDirectory = path.join(siteDirectory, "api", "v1");
const problemDirectory = path.join(apiDirectory, "problems");
const sandbox = { window: {} };

for (const filename of ["problems.js", "formal-statements.js", "problem-sources.js"]) {
  const filePath = path.join(dataDirectory, filename);
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
}

const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const formalStatements = sandbox.window.QUANTUM_FORMAL_STATEMENTS;
const problemSources = sandbox.window.QUANTUM_PROBLEM_SOURCES;
const siteUrl = String(catalog.meta.siteUrl).replace(/\/$/, "");
const repositoryUrl = String(catalog.meta.repositoryUrl).replace(/\/$/, "");
const topicById = new Map(catalog.taxonomy.topics.map((topic) => [topic.id, topic]));
const areaById = new Map(catalog.taxonomy.areas.map((area) => [area.id, area]));
const collectionById = new Map(catalog.collections.map((collection) => [collection.id, collection]));

const contributionUrl = (problem) => {
  const url = new URL(`${repositoryUrl}/issues/new`);
  url.searchParams.set("template", "research-update.yml");
  url.searchParams.set("title", `[Research update] ${problem.title}`);
  return url.href;
};

const latestEvidence = (problem) => (problem.progress || [])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date))[0] || {
    date: problem.latest,
    title: "No later exact result located",
    maturity: "Audit finding",
    strength: "Status record"
  };

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

// The revision digest covers the research content of one record. It excludes
// catalog-wide dates and hypermedia URLs so that a catalog date bump or a
// site move cannot invalidate outstanding contributions to unchanged problems.
const digestProjection = (record) => {
  const { research, links, ...rest } = record;
  const dates = { ...record.dates };
  delete dates.catalogAsOf;
  return { ...rest, dates };
};

const detailRecord = (problem) => {
  const topic = topicById.get(problem.topic);
  const area = areaById.get(topic?.area);
  const collection = collectionById.get(problem.collection);
  const verified = problem.verified || catalog.meta.audited;
  const record = {
    schemaVersion: 1,
    kind: "quantum-open-problem",
    id: problem.id,
    title: problem.title,
    status: problem.status,
    dates: {
      proposed: problem.proposed,
      latestEvidence: problem.latest,
      verified,
      catalogAsOf: catalog.meta.asOf
    },
    taxonomy: {
      field: { id: area?.id || "uncategorized", label: area?.label || "Uncategorized" },
      topic: { id: topic?.id || problem.topic, label: topic?.label || problem.topic }
    },
    collection: {
      id: collection?.id || problem.collection,
      label: collection?.label || problem.collection,
      title: collection?.title || problem.collection,
      url: collection?.url || null
    },
    question: {
      type: problem.type,
      summary: problem.summary,
      importance: problem.importance,
      unresolved: problem.remaining
    },
    formulation: formalStatements[problem.id],
    source: problemSources[problem.id],
    evidence: {
      progress: problem.progress || [],
      cautions: problem.watch || [],
      interpretation: problem.interpretation || null,
      provenance: problem.origin || null
    },
    relations: {
      relatedProblems: problem.related || []
    },
    discovery: {
      keywords: problem.keywords || []
    },
    research: {
      briefMarkdown: `${siteUrl}/packets/${problem.id}.md`,
      submitResult: contributionUrl(problem),
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

const detailRecords = catalog.problems.map(detailRecord);
const detailById = new Map(detailRecords.map((record) => [record.id, record]));
const compactProblems = catalog.problems.map((problem) => {
  const detail = detailById.get(problem.id);
  const latest = latestEvidence(problem);
  return {
    id: problem.id,
    title: problem.title,
    status: problem.status,
    topic: problem.topic,
    collection: problem.collection,
    proposed: problem.proposed,
    latest: problem.latest,
    type: problem.type,
    summary: problem.summary,
    keywords: problem.keywords || [],
    latestEvidence: {
      date: latest.date,
      title: latest.title,
      maturity: latest.maturity,
      strength: latest.strength
    },
    sourceTitle: detail.source.title,
    sourceAuthors: detail.source.authors,
    recordDigest: detail.revision.recordDigest,
    statementDigest: detail.revision.statementDigest,
    detailUrl: `api/v1/problems/${problem.id}.json`
  };
});

const catalogIndex = {
  meta: {
    ...catalog.meta,
    apiVersion: "v1",
    records: {
      total: catalog.meta.totalArchive,
      active: catalog.meta.active,
      resolved: catalog.meta.totalArchive - catalog.meta.active
    }
  },
  taxonomy: catalog.taxonomy,
  collections: catalog.collections,
  problems: compactProblems,
  watchlist: catalog.watchlist || []
};

const problemSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${siteUrl}/api/v1/problem.schema.json`,
  title: "Quantum Open Problem",
  type: "object",
  required: ["schemaVersion", "kind", "id", "title", "status", "dates", "taxonomy", "question", "formulation", "source", "evidence", "research", "links", "revision"],
  properties: {
    schemaVersion: { const: 1 },
    kind: { const: "quantum-open-problem" },
    id: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    title: { type: "string", minLength: 1 },
    status: { enum: ["open", "partial"] },
    dates: { type: "object" },
    taxonomy: { type: "object" },
    collection: { type: "object" },
    question: {
      type: "object",
      required: ["type", "summary", "importance", "unresolved"],
      properties: {
        type: { type: "string" },
        summary: { type: "string" },
        importance: { type: "string" },
        unresolved: { type: "string" }
      }
    },
    formulation: {
      type: "object",
      required: ["notation", "statement"],
      properties: {
        notation: { type: "string" },
        statement: { type: "string", minLength: 1 }
      }
    },
    source: { type: "object" },
    evidence: { type: "object" },
    relations: { type: "object" },
    discovery: { type: "object" },
    research: { type: "object" },
    links: { type: "object" },
    revision: {
      type: "object",
      required: ["algorithm", "projection", "recordDigest", "statementDigest"],
      properties: {
        algorithm: { const: "sha256" },
        projection: { const: "content-v1" },
        recordDigest: { type: "string", pattern: "^[a-f0-9]{64}$" },
        statementDigest: { type: "string", pattern: "^[a-f0-9]{64}$" }
      }
    }
  }
};

const contributionSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${siteUrl}/api/v1/contribution.schema.json`,
  title: "Quantum Open Problem research contribution",
  type: "object",
  additionalProperties: false,
  required: ["problemId", "problemRevision", "statementDigest", "kind", "actors", "claim", "scope", "evidence", "remainingGap", "aiUse"],
  properties: {
    problemId: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    problemRevision: { type: "string", pattern: "^[a-f0-9]{64}$" },
    statementDigest: { type: "string", pattern: "^[a-f0-9]{64}$" },
    kind: { enum: ["proof", "counterexample", "partial-theorem", "computation", "numerical-evidence", "experiment", "failed-approach", "source-correction", "status-review"] },
    actors: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["type", "name", "role"],
        properties: {
          type: { enum: ["human", "ai-agent", "organization"] },
          name: { type: "string" },
          role: { enum: ["author", "operator", "reviewer", "verifier"] },
          identifier: { type: ["string", "null"] },
          model: { type: ["string", "null"] },
          provider: { type: ["string", "null"] }
        }
      }
    },
    claim: { type: "string", minLength: 1 },
    hypotheses: { type: "array", items: { type: "string" } },
    scope: { type: "string", minLength: 1 },
    evidence: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["type", "uri"],
        properties: {
          type: { enum: ["primary-source", "proof", "code", "data", "certificate", "experiment-log", "review"] },
          uri: { type: "string", format: "uri" },
          locator: { type: ["string", "null"] },
          digest: { type: ["string", "null"] }
        }
      }
    },
    reproduction: { type: ["string", "null"] },
    remainingGap: { type: "string" },
    aiUse: {
      type: "object",
      required: ["level", "humanChecks"],
      properties: {
        level: { enum: ["none", "assisted", "agent-generated"] },
        systems: { type: "array", items: { type: "string" } },
        humanChecks: { type: "array", items: { type: "string" } }
      }
    }
  }
};

fs.mkdirSync(problemDirectory, { recursive: true });
const activeRecordIds = new Set(detailRecords.map((record) => record.id));
for (const filename of fs.readdirSync(problemDirectory)) {
  if (filename.endsWith(".json") && !activeRecordIds.has(path.basename(filename, ".json"))) {
    fs.rmSync(path.join(problemDirectory, filename));
  }
}
for (const record of detailRecords) {
  fs.writeFileSync(path.join(problemDirectory, `${record.id}.json`), `${JSON.stringify(record, null, 2)}\n`);
}
fs.writeFileSync(path.join(apiDirectory, "index.json"), `${JSON.stringify(catalogIndex, null, 2)}\n`);
fs.writeFileSync(path.join(apiDirectory, "problems.jsonl"), `${detailRecords.map((record) => JSON.stringify(record)).join("\n")}\n`);
fs.writeFileSync(path.join(apiDirectory, "problem.schema.json"), `${JSON.stringify(problemSchema, null, 2)}\n`);
fs.writeFileSync(path.join(apiDirectory, "contribution.schema.json"), `${JSON.stringify(contributionSchema, null, 2)}\n`);

const browserIndex = [
  '"use strict";',
  "",
  "// Generated compact browser index. Full records live under api/v1/problems/.",
  `window.QUANTUM_CATALOG_INDEX = ${JSON.stringify(catalogIndex, null, 2)};`,
  ""
].join("\n");
fs.writeFileSync(path.join(dataDirectory, "catalog-index.js"), browserIndex);

const apiReadme = `# Quantum Open Problems API v1

Public read endpoints need no authentication.

- \`release.json\`: release date, catalog digest, and record counts; poll this first
- \`index.json\`: compact catalog metadata and discovery records
- \`problems/<record-id>.json\`: one complete, source-aware problem record
- \`problems.jsonl\`: full snapshot for batch research and indexing
- \`evidence.json\`: every dated evidence event, newest first, for catalog watching
- \`problem.schema.json\`: JSON Schema for problem records
- \`contribution.schema.json\`: shared write contract for future human forms and agent tools

Each record also has a human page at \`/problems/<record-id>/\` and a Markdown research brief at \`/packets/<record-id>.md\`. Solved records keep an archived page at the same URL pattern.

Treat \`status\` as a dated editorial assessment. Read \`dates.verified\`, \`source.relationship\`, and \`evidence.cautions\` before using a record. A source may state the question or document a limitation from which editors derived a narrower problem.
`;
fs.writeFileSync(path.join(apiDirectory, "README.md"), apiReadme);

const llmsText = `# Quantum Open Problems

> A source-audited catalog of formal open problems across quantum science. Records separate the formal target, original source, unresolved remainder, dated evidence, and editorial status.

Use the compact index for discovery, then fetch one problem record or Markdown research brief. Each active problem has three representations: an HTML page at \`/problems/<record-id>/\`, a JSON record at \`/api/v1/problems/<record-id>.json\`, and a Markdown research brief at \`/packets/<record-id>.md\`. Check the verification date and source relationship before relying on a status. Human and AI contributions use the same evidence contract.

## Machine interfaces

- [Agent guide](${siteUrl}/ai/): MCP server setup, endpoint map, research loop, and contribution contract.
- [MCP server](${repositoryUrl}/blob/main/mcp/server.mjs): Zero-dependency stdio server; add with \`claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems\`.
- [API guide](${siteUrl}/api/v1/README.md): Endpoint map and interpretation rules.
- [Release manifest](${siteUrl}/api/v1/release.json): Catalog date, digest, and counts; poll this before downloading more.
- [Compact catalog](${siteUrl}/api/v1/index.json): Discovery metadata for active problems.
- [Full snapshot](${siteUrl}/api/v1/problems.jsonl): One complete JSON problem record per line.
- [Evidence log](${siteUrl}/api/v1/evidence.json): Every dated evidence event, newest first.
- [Evidence feed](${siteUrl}/feed.xml): Atom feed of the latest evidence events; [JSON Feed](${siteUrl}/feed.json) carries the same entries.
- [Full catalog text](${siteUrl}/llms-full.txt): Every research brief concatenated in one Markdown file.
- [Problem schema](${siteUrl}/api/v1/problem.schema.json): Versioned JSON Schema for problem records.
- [Contribution schema](${siteUrl}/api/v1/contribution.schema.json): Evidence contract for human and AI research results.

## Research and contribution

- [Human explorer](${siteUrl}/): Browse fields, status, sources, formal statements, and progress.
- [Problem directory](${siteUrl}/problems/): One stable HTML page per record, including archived solved problems.
- [Contribution guide](${repositoryUrl}/blob/main/CONTRIBUTING.md): Review rules and required evidence.

## Optional

- [Source repository](${repositoryUrl}): Canonical articles, metadata, generators, and validation.
`;
fs.writeFileSync(path.join(siteDirectory, "llms.txt"), llmsText);

console.log(`Generated API v1 with ${detailRecords.length} lazy problem records.`);
