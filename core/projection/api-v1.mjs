// API v1 read models projected from canonical records.
//
// The per-record JSON shape is a published contract (schemaVersion 1). The
// revision digest covers research content only, so hypermedia links and the
// catalog-wide date may change without invalidating outstanding
// contributions. New canonical detail (statement versions, target clauses,
// claims, frontier) is published through sibling resources and linked from
// `links`, which keeps every existing record digest stable.

import {
  activeClaims,
  byId,
  currentDecision,
  currentStatement,
  deriveStatus,
  isActive,
  isArchived,
  isPublic,
  sha256,
  trimSlash
} from "../domain.mjs";
import { statementContent } from "../catalog.mjs";

export const SOURCE_RELATIONSHIP_TEXT = {
  "states-problem": "The source states the cataloged problem.",
  "documents-gap": "The source documents the gap used to formulate this problem.",
  "source-record": "The source is the record from which this problem was imported.",
  "supplements-statement": "The source supplements the archived statement."
};

export const contributionUrl = (registry, problem) => {
  const url = new URL(`${trimSlash(registry.repositoryUrl)}/issues/new`);
  url.searchParams.set("template", "research-update.yml");
  url.searchParams.set("title", `[Research update] ${problem.title}`);
  return url.href;
};

// The revision digest covers the research content of one record. It excludes
// catalog-wide dates and hypermedia URLs so that a catalog date bump or a
// site move cannot invalidate outstanding contributions to unchanged problems.
export const digestProjection = (record) => {
  const { research, links, ...rest } = record;
  const dates = { ...record.dates };
  delete dates.catalogAsOf;
  return { ...rest, dates };
};

export const primarySourceRef = (statement) => {
  const refs = statement.sourceRefs.filter((reference) => reference.primary);
  if (refs.length !== 1) throw new Error(`${statement.id}: expected exactly one primary source reference`);
  return refs[0];
};

// Evidence rows in the legacy `progress` shape, newest first. Claims that
// have been superseded are excluded from the public ledger.
export const progressRows = (record, catalog) => {
  const claims = byId(activeClaims(record));
  return record.evidence
    .filter((item) => claims.has(item.claimId))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((item) => {
      const claim = claims.get(item.claimId);
      const source = catalog.sourceById.get(item.sourceId);
      if (!claim || !source) throw new Error(`${record.problem.id}: unresolved claim or evidence source reference`);
      return {
        claimId: claim.id,
        evidenceId: item.id,
        row: {
          date: item.date,
          title: claim.title,
          detail: claim.text,
          maturity: item.maturity,
          strength: item.strength,
          ...(source.url ? { url: source.url } : {}),
          label: item.label
        }
      };
    });
};

export const projectApiV1 = (bundle, catalog) => {
  const { registry } = catalog;
  const canonical = bundle.record;
  const problem = canonical.problem;
  const statement = currentStatement(canonical);
  const decision = currentDecision(canonical);
  if (!isPublic(canonical)) {
    throw new Error(`${problem.id}: API v1 projection requires a published or archived record`);
  }
  if (isArchived(canonical) && decision.status !== "solved") {
    throw new Error(`${problem.id}: archived records must be solved`);
  }
  if (!isArchived(canonical) && decision.status === "solved") {
    throw new Error(`${problem.id}: solved records must be archived`);
  }
  if (!problem.proposed) throw new Error(`${problem.id}: API v1 requires a proposed date`);

  const topic = catalog.topicById.get(problem.topicId);
  const area = catalog.areaById.get(topic?.areaId);
  const collection = catalog.collectionById.get(problem.collectionId);
  const sourceRef = primarySourceRef(statement);
  const problemSource = catalog.sourceById.get(sourceRef.sourceId);
  if (!topic || !area || !collection) throw new Error(`${problem.id}: unresolved taxonomy or collection reference`);
  if (!problemSource?.url) throw new Error(`${problem.id}: API v1 requires a linked primary source`);
  const relationship = SOURCE_RELATIONSHIP_TEXT[sourceRef.relationship];
  if (!relationship) throw new Error(`${problem.id}: unsupported source relationship ${sourceRef.relationship}`);
  const formulation = statementContent(bundle, statement);
  const progress = progressRows(canonical, catalog).map((entry) => entry.row);
  const siteUrl = trimSlash(registry.siteUrl);
  const repositoryUrl = trimSlash(registry.repositoryUrl);
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
      locator: sourceRef.locator,
      url: problemSource.url,
      relationship
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
      contributionSchema: `${siteUrl}/api/v1/contribution.schema.json`,
      candidateUpdateSchema: `${siteUrl}/api/v1/candidate-update.schema.json`,
      frontier: `${siteUrl}/api/v1/problems/${problem.id}/frontier.json`,
      ...(registry.serviceUrl ? {
        candidateUpdates: `${trimSlash(registry.serviceUrl)}/api/v1/problems/${problem.id}/candidate-updates`,
        comments: `${trimSlash(registry.serviceUrl)}/api/v1/problems/${problem.id}/comments`
      } : {})
    },
    links: {
      self: `${siteUrl}/api/v1/problems/${problem.id}.json`,
      human: `${siteUrl}/problems/${problem.id}/`,
      explorer: `${siteUrl}/#${problem.id}`,
      markdown: `${siteUrl}/packets/${problem.id}.md`,
      schema: `${siteUrl}/api/v1/problem.schema.json`,
      api: `${siteUrl}/api/v1/problems/${problem.id}.json`,
      frontier: `${siteUrl}/api/v1/problems/${problem.id}/frontier.json`,
      claims: `${siteUrl}/api/v1/problems/${problem.id}/claims.json`,
      statement: `${siteUrl}/api/v1/problems/${problem.id}/statements/v${statement.version}.json`,
      sourceRecord: `${repositoryUrl}/blob/main/catalog/problems/${problem.id}/record.json`
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

// Compact discovery entry used by the browser index, search, and MCP.
export const projectCompact = (bundle, catalog, detail = projectApiV1(bundle, catalog)) => {
  const problem = bundle.record.problem;
  const decision = currentDecision(bundle.record);
  const latest = detail.evidence.progress[0] || {
    date: decision.effectiveDate,
    title: "No later exact result located",
    maturity: "Audit finding",
    strength: "Status record"
  };
  return {
    id: problem.id,
    title: problem.title,
    status: detail.status,
    topic: problem.topicId,
    collection: problem.collectionId,
    proposed: problem.proposed,
    latest: detail.dates.latestEvidence,
    type: problem.question.type,
    summary: problem.question.summary,
    keywords: problem.keywords,
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
};

export const publicBundles = (catalog) => catalog.bundles.filter((bundle) => isPublic(bundle.record));
export const activeBundles = (catalog) => catalog.bundles.filter((bundle) => isActive(bundle.record));
export const archivedBundles = (catalog) => catalog.bundles.filter((bundle) => isArchived(bundle.record));

// Statement version resource: /api/v1/problems/<id>/statements/v<n>.json
export const projectStatement = (bundle, statement, catalog) => {
  const content = statementContent(bundle, statement);
  const siteUrl = trimSlash(catalog.registry.siteUrl);
  return {
    kind: "qop-statement-version",
    schemaVersion: 1,
    id: statement.id,
    problemId: statement.problemId,
    version: statement.version,
    supersedesStatementId: statement.supersedesStatementId,
    current: currentStatement(bundle.record).id === statement.id,
    created: statement.created,
    sourceRefs: statement.sourceRefs.map((reference) => {
      const source = catalog.sourceById.get(reference.sourceId);
      return {
        ...reference,
        source: source ? { id: source.id, title: source.title, authors: source.authors, venue: source.venue, url: source.url } : null
      };
    }),
    targetClauses: statement.targetClauses,
    formulation: { notation: content.notation, statement: content.statement },
    revision: {
      algorithm: "sha256",
      statementDigest: sha256(content.statement),
      bodyDigest: sha256(content.markdown)
    },
    links: {
      problem: `${siteUrl}/api/v1/problems/${statement.problemId}.json`,
      frontier: `${siteUrl}/api/v1/problems/${statement.problemId}/frontier.json`
    }
  };
};

// Claims resource: /api/v1/problems/<id>/claims.json
export const projectClaims = (bundle, catalog) => {
  const record = bundle.record;
  const siteUrl = trimSlash(catalog.registry.siteUrl);
  const evidenceByClaim = new Map();
  for (const item of record.evidence) {
    if (!evidenceByClaim.has(item.claimId)) evidenceByClaim.set(item.claimId, []);
    evidenceByClaim.get(item.claimId).push(item);
  }
  const claims = record.claims.map((claim) => ({
    ...claim,
    superseded: record.claims.some((other) => other.supersedesClaimId === claim.id),
    evidence: (evidenceByClaim.get(claim.id) || []).map((item) => {
      const source = catalog.sourceById.get(item.sourceId);
      return {
        ...item,
        source: source ? {
          id: source.id, title: source.title, authors: source.authors, venue: source.venue, url: source.url,
          ...(source.bibliographyState ? { bibliographyState: source.bibliographyState } : {})
        } : null
      };
    })
  }));
  return {
    kind: "qop-claims",
    schemaVersion: 1,
    problemId: record.problem.id,
    status: deriveStatus(record),
    statementId: currentStatement(record).id,
    count: claims.length,
    note: "Every claim here has been accepted through editorial review. Unreviewed submissions are candidate updates in the operational service, never claims.",
    claims,
    links: {
      problem: `${siteUrl}/api/v1/problems/${record.problem.id}.json`,
      frontier: `${siteUrl}/api/v1/problems/${record.problem.id}/frontier.json`
    }
  };
};

export const buildCatalogIndex = (catalog, details) => {
  const { registry } = catalog;
  const siteUrl = trimSlash(registry.siteUrl);
  const active = activeBundles(catalog);
  const archived = archivedBundles(catalog);
  const compact = (bundle) => projectCompact(bundle, catalog, details.get(bundle.record.problem.id));
  const counts = active.reduce((totals, bundle) => {
    totals[deriveStatus(bundle.record)] += 1;
    return totals;
  }, { open: 0, partial: 0 });
  const publicCount = publicBundles(catalog).length;
  const collections = registry.collections.map((collection) => {
    const archiveSize = publicBundles(catalog)
      .filter((bundle) => bundle.record.problem.collectionId === collection.id).length;
    return {
      id: collection.id,
      label: collection.label,
      ...(collection.aliases ? { aliases: collection.aliases } : {}),
      title: collection.title,
      archiveSize,
      ...(collection.url ? { url: collection.url } : {})
    };
  }).filter((collection) => collection.archiveSize > 0);
  const notices = publicBundles(catalog)
    .flatMap((bundle) => bundle.record.editorial.notices.map((notice) => ({
      problemId: bundle.record.problem.id,
      tone: notice.tone,
      label: notice.label,
      title: notice.title,
      text: notice.text,
      ...(notice.sourceLabel ? { sourceLabel: notice.sourceLabel } : {}),
      ...(notice.featured ? { featured: true } : {})
    })))
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.problemId.localeCompare(b.problemId));
  return {
    meta: {
      schemaVersion: 3,
      title: registry.title,
      audited: registry.baselineAuditDate,
      updated: registry.catalogAsOf,
      asOf: registry.catalogAsOf,
      totalArchive: publicCount,
      active: active.length,
      counts,
      siteUrl: `${siteUrl}/`,
      repositoryUrl: trimSlash(registry.repositoryUrl),
      note: registry.note,
      apiVersion: "v1",
      records: {
        total: publicCount,
        active: active.length,
        resolved: archived.length
      },
      ...(registry.serviceUrl ? { serviceUrl: trimSlash(registry.serviceUrl) } : {})
    },
    taxonomy: {
      areas: registry.taxonomy.areas,
      topics: registry.taxonomy.topics.map((topic) => ({ id: topic.id, label: topic.label, area: topic.areaId }))
    },
    collections,
    problems: active.map(compact),
    archived: archived.map(compact),
    watchlist: notices
  };
};

export const problemSchema = (siteUrl) => ({
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
    status: { enum: ["open", "partial", "solved"] },
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
});

// The original contribution envelope. Kept at its published URL for
// compatibility; the CandidateUpdate schema is its successor and the service
// accepts only that shape.
export const contributionSchema = (siteUrl) => ({
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${siteUrl}/api/v1/contribution.schema.json`,
  title: "Quantum Open Problem research contribution",
  description: "Legacy contribution envelope for the GitHub issue lane. Machine clients should submit candidate updates that satisfy candidate-update.schema.json instead.",
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
});

// Flatten every dated evidence event for active problems. IDs hash the
// complete semantic payload, so any correction produces a new event ID for
// feed consumers. This is a snapshot; the sequenced ledger is events.json.
export const evidenceEventId = (problemId, item) => `qop-evt-${sha256([
  problemId, item.date, item.title, item.detail, item.maturity, item.strength, item.url || ""
].join("|")).slice(0, 16)}`;

export const evidenceEvents = (catalog, details) => {
  const siteUrl = trimSlash(catalog.registry.siteUrl);
  return activeBundles(catalog)
    .flatMap((bundle) => {
      const record = bundle.record;
      const detail = details.get(record.problem.id);
      return progressRows(record, catalog).map(({ claimId, evidenceId, row }) => ({
        eventId: evidenceEventId(record.problem.id, row),
        problemId: record.problem.id,
        problemTitle: record.problem.title,
        status: detail.status,
        date: row.date,
        title: row.title,
        detail: row.detail,
        maturity: row.maturity,
        strength: row.strength,
        url: row.url || null,
        claimId,
        evidenceId,
        page: `${siteUrl}/problems/${record.problem.id}/`,
        record: `${siteUrl}/api/v1/problems/${record.problem.id}.json`
      }));
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.problemId.localeCompare(b.problemId));
};
