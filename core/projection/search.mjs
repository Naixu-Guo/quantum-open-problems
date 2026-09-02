// Lexical search over the compact catalog index. Shared by the static
// search-index read model, the service search endpoint, and MCP.

const normalize = (value = "") => String(value)
  .normalize("NFKD")
  .replace(/[̀-ͯ]/g, "")
  .toLowerCase();

const tokens = (value) => normalize(value).split(/[^a-z0-9]+/).filter((token) => token.length > 1);

export const buildSearchIndex = (catalogIndex) => {
  const topicById = new Map(catalogIndex.taxonomy.topics.map((topic) => [topic.id, topic]));
  const areaById = new Map(catalogIndex.taxonomy.areas.map((area) => [area.id, area]));
  const collectionById = new Map(catalogIndex.collections.map((collection) => [collection.id, collection]));
  const entries = [...catalogIndex.problems, ...catalogIndex.archived].map((problem) => {
    const topic = topicById.get(problem.topic);
    const area = areaById.get(topic?.area);
    return {
      id: problem.id,
      title: problem.title,
      status: problem.status,
      field: area?.id || null,
      fieldLabel: area?.label || null,
      topic: problem.topic,
      topicLabel: topic?.label || problem.topic,
      collection: problem.collection,
      collectionLabel: collectionById.get(problem.collection)?.label || problem.collection,
      proposed: problem.proposed,
      latest: problem.latest,
      summary: problem.summary,
      keywords: problem.keywords,
      latestEvidence: problem.latestEvidence,
      recordDigest: problem.recordDigest,
      statementDigest: problem.statementDigest,
      fields: {
        title: tokens(problem.title),
        keywords: tokens(problem.keywords.join(" ")),
        taxonomy: tokens(`${area?.label || ""} ${topic?.label || ""} ${collectionById.get(problem.collection)?.label || ""}`),
        summary: tokens(problem.summary),
        evidence: tokens(`${problem.latestEvidence?.title || ""} ${problem.latestEvidence?.strength || ""} ${problem.latestEvidence?.maturity || ""}`),
        source: tokens(`${problem.sourceTitle || ""} ${(problem.sourceAuthors || []).join(" ")}`)
      }
    };
  });
  return {
    kind: "qop-search-index",
    schemaVersion: 1,
    catalogAsOf: catalogIndex.meta.asOf,
    weights: { title: 3, keywords: 2, taxonomy: 2, summary: 1, evidence: 1, source: 1 },
    count: entries.length,
    entries
  };
};

// Structured filters plus weighted term matching. `query` terms match as
// prefixes of indexed tokens so "capac" finds "capacity".
export const searchIndex = (index, options = {}) => {
  const terms = tokens(options.query || "");
  const wanted = (value) => (value ? normalize(value) : null);
  const status = wanted(options.status);
  const field = wanted(options.field);
  const topic = wanted(options.topic);
  const collection = wanted(options.collection);
  const since = options.since ? String(options.since) : null;
  const includeArchived = options.includeArchived ?? (status === "solved");
  const results = index.entries
    .filter((entry) => includeArchived || entry.status !== "solved")
    .filter((entry) => !status || entry.status === status)
    .filter((entry) => !field || entry.field === field || normalize(entry.fieldLabel || "").includes(field))
    .filter((entry) => !topic || entry.topic === topic || normalize(entry.topicLabel).includes(topic))
    .filter((entry) => !collection || entry.collection === collection || normalize(entry.collectionLabel).includes(collection))
    .filter((entry) => !since || String(entry.latest) >= since)
    .map((entry) => {
      if (!terms.length) return { entry, score: 1 };
      let score = 0;
      let matchedTerms = 0;
      for (const term of terms) {
        let termScore = 0;
        for (const [fieldName, weight] of Object.entries(index.weights)) {
          const fieldTokens = entry.fields[fieldName] || [];
          if (fieldTokens.some((token) => token === term)) termScore += weight * 2;
          else if (fieldTokens.some((token) => token.startsWith(term))) termScore += weight;
        }
        if (termScore > 0) matchedTerms += 1;
        score += termScore;
      }
      if (matchedTerms < terms.length && options.requireAllTerms !== false) return { entry, score: 0 };
      return { entry, score };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || String(b.entry.latest).localeCompare(String(a.entry.latest)) || a.entry.title.localeCompare(b.entry.title));
  const limit = Math.max(1, Math.min(Number(options.limit) || 10, 100));
  return {
    matched: results.length,
    results: results.slice(0, limit).map(({ entry, score }) => ({
      id: entry.id,
      title: entry.title,
      status: entry.status,
      field: entry.fieldLabel,
      fieldId: entry.field,
      topic: entry.topicLabel,
      topicId: entry.topic,
      collection: entry.collectionLabel,
      proposed: entry.proposed,
      latestEvidence: entry.latestEvidence,
      summary: entry.summary,
      recordDigest: entry.recordDigest,
      statementDigest: entry.statementDigest,
      score
    }))
  };
};
