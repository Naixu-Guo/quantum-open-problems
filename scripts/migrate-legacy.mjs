#!/usr/bin/env node
// One-time migration of the legacy authoring surfaces into canonical bundles.
//
//   site/data/problems.js        -> catalog/problems/<id>/record.json (+ registry)
//   open_prob/<id>/problem.md    -> statements/v1.md (Notation, Formal statement)
//                                   notes.md (Background, Status, Bibliography)
//   open_prob/<id>/metadata.json -> catalog/sources/*.json + statement sourceRefs
//   watchlist                    -> editorial.notices
//   solved records               -> claims/evidence from a curated JSON file
//
// The script is idempotent for hand-migrated bundles: it keeps their
// statements, claims, evidence, decisions, and editorial fields and only adds
// the fields introduced by schema 0.2.0.
//
// Usage: node scripts/migrate-legacy.mjs --solved-claims <file> [--skip-solved]

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { extractSection, sha256, slugify } from "../core/domain.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legacyDataPath = path.join(repositoryRoot, "site", "data", "problems.js");
const openProbDirectory = path.join(repositoryRoot, "open_prob");
const catalogDirectory = path.join(repositoryRoot, "catalog");
const problemsDirectory = path.join(catalogDirectory, "problems");
const sourcesDirectory = path.join(catalogDirectory, "sources");
const args = process.argv.slice(2);
const argValue = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
};
const skipSolved = args.includes("--skip-solved");
const solvedClaimsPath = argValue("--solved-claims");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const writeJson = (filePath, value) => fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(legacyDataPath, "utf8"), sandbox, { filename: legacyDataPath });
const legacy = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const legacyById = new Map(legacy.problems.map((problem) => [problem.id, problem]));
const solvedClaims = solvedClaimsPath && fs.existsSync(solvedClaimsPath) ? readJson(solvedClaimsPath) : {};

const SOLVED_TOPICS = {
  "horodecki-2020-quantum-latin-squares-order-six": "quantum-designs",
  "horodecki-2020-werner-2-copy-distillability": "entanglement-theory",
  "krueger-2005-additivity-classical-capacity": "quantum-channels",
  "krueger-2005-additivity-entanglement-formation": "entanglement-theory",
  "krueger-2005-asymptotic-cloning-state-estimation": "quantum-channels",
  "krueger-2005-bell-inequalities-all-quantum-states": "bell-nonlocality",
  "krueger-2005-bell-violation-tensoring": "bell-nonlocality",
  "krueger-2005-continuity-quantum-channel-capacity": "quantum-channels",
  "krueger-2005-local-equivalence-graph-states": "entanglement-theory",
  "krueger-2005-maximally-entangled-mixed-states": "entanglement-theory",
  "krueger-2005-nice-error-bases": "quantum-error-correction",
  "krueger-2005-polynomial-entanglement-invariants": "quantum-invariants",
  "krueger-2005-qubit-bi-negativity": "entanglement-theory",
  "krueger-2005-reduction-criterion-majorization": "entanglement-theory",
  "krueger-2005-reversibility-entanglement-assisted-coding": "quantum-channels",
  "krueger-2005-stronger-bell-werner-states": "bell-nonlocality",
  "ruskai-2007-additivity-minimal-output-entropy": "quantum-channels",
  "ruskai-2007-explicit-multiplicativity-violations": "quantum-channels",
  "ruskai-2007-more-multiplicativity-counterexamples": "quantum-channels",
  "ruskai-2007-multiplicativity-violation-both-sides": "quantum-channels"
};

const LIST_COLLECTIONS = new Map([
  ["horodecki-2020", "source-horodecki-2020"],
  ["krueger-2005", "source-krueger-werner-2005"],
  ["ruskai-2007", "source-ruskai-2007"]
]);
const RENAMED_SOURCES = new Map([
  ["source-krueger-werner-2005-problem-18", "source-krueger-werner-2005"],
  ["source-krueger-werner-2005-problem-3", "source-krueger-werner-2005"],
  ["source-ruskai-2007-problem-12", "source-ruskai-2007"]
]);

const titleFromFilename = (filename = "") => path.basename(filename, path.extname(filename))
  .replace(/_(?:Horodecki|Ruskai_2007|Kurdzialek|Mothe)$/, "")
  .replaceAll("_", " ");

const metadataUrl = (metadata) => {
  if (metadata.primary_url) return metadata.primary_url;
  if (metadata.doi) return `https://doi.org/${metadata.doi}`;
  if (metadata.arxiv_id) return `https://arxiv.org/abs/${metadata.arxiv_id}`;
  return metadata.source_url || null;
};

const lastName = (author = "") => slugify(author.trim().split(/\s+/).at(-1) || "author", 1);

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
const registry = readJson(path.join(catalogDirectory, "registry.json"));
const legacyCollections = new Map(legacy.collections.map((collection) => [collection.id, collection]));
registry.schemaVersion = "0.2.0";
registry.title = legacy.meta.title;
registry.note = legacy.meta.note;
registry.baselineAuditDate = legacy.meta.audited;
registry.serviceUrl = registry.serviceUrl ?? null;
registry.collections = registry.collections.map((collection) => {
  const legacyCollection = legacyCollections.get(collection.id);
  const next = { id: collection.id, label: collection.label };
  if (legacyCollection?.aliases) next.aliases = legacyCollection.aliases;
  next.title = collection.title;
  next.url = collection.url ?? null;
  if (LIST_COLLECTIONS.has(collection.id)) next.quantumInformationLegacy = true;
  return next;
});
const orderedRegistry = {
  schemaVersion: registry.schemaVersion,
  kind: registry.kind,
  title: registry.title,
  note: registry.note,
  baselineAuditDate: registry.baselineAuditDate,
  catalogAsOf: registry.catalogAsOf,
  siteUrl: registry.siteUrl,
  repositoryUrl: registry.repositoryUrl,
  serviceUrl: registry.serviceUrl,
  taxonomy: registry.taxonomy,
  collections: registry.collections
};
writeJson(path.join(catalogDirectory, "registry.json"), orderedRegistry);

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------
const sources = new Map();
const sourceIdByUrl = new Map();
const registerSource = (source) => {
  if (sources.has(source.id)) {
    const existing = sources.get(source.id);
    for (const key of ["title", "url"]) {
      if (existing[key] !== source[key]) {
        throw new Error(`source ${source.id}: conflicting ${key}: ${existing[key]} vs ${source[key]}`);
      }
    }
    return existing.id;
  }
  sources.set(source.id, source);
  if (source.url && !sourceIdByUrl.has(source.url)) sourceIdByUrl.set(source.url, source.id);
  return source.id;
};
const normalizeSource = (source) => {
  const ordered = {
    kind: "Source",
    id: source.id,
    title: source.title,
    authors: source.authors || [],
    venue: source.venue || "",
    url: source.url || null
  };
  if (source.doi) ordered.doi = source.doi;
  if (source.arxivId) ordered.arxivId = source.arxivId;
  if (source.citation) ordered.citation = source.citation;
  if (source.bibliographyState && source.bibliographyState !== "complete") ordered.bibliographyState = source.bibliographyState;
  return ordered;
};

for (const filename of fs.readdirSync(sourcesDirectory)) {
  if (!filename.endsWith(".json")) continue;
  const source = readJson(path.join(sourcesDirectory, filename));
  const id = RENAMED_SOURCES.get(source.id) || source.id;
  if (RENAMED_SOURCES.has(source.id)) fs.rmSync(path.join(sourcesDirectory, filename));
  registerSource(normalizeSource({ ...source, id }));
}

// Curated sources for solved records are registered first so that active
// records citing the same paper reuse the complete bibliographic entry.
for (const curated of Object.values(solvedClaims)) {
  for (const item of curated.evidence || []) {
    if (!item.source) continue;
    if (item.source.url && sourceIdByUrl.has(item.source.url)) continue;
    const id = RENAMED_SOURCES.get(item.sourceId) || item.sourceId;
    if (sources.has(id)) continue;
    registerSource(normalizeSource({ id, ...item.source }));
  }
}

const metadataById = new Map();
for (const id of fs.readdirSync(openProbDirectory)) {
  const metadataPath = path.join(openProbDirectory, id, "metadata.json");
  if (fs.existsSync(metadataPath)) metadataById.set(id, readJson(metadataPath));
}

const primarySourceFor = (id, metadata) => {
  const collectionId = legacyById.get(id)?.collection || [...LIST_COLLECTIONS.keys()].find((prefix) => id.startsWith(`${prefix}-`)) || null;
  const collection = registry.collections.find((entry) => entry.id === collectionId);
  const url = metadataUrl(metadata);
  const title = metadata.source_title
    || (LIST_COLLECTIONS.has(collectionId) ? collection?.title : "")
    || titleFromFilename(metadata.source_pdf)
    || metadata.title;
  const existingId = sourceIdByUrl.get(url);
  const year = String(metadata.proposed_date || "").slice(0, 4);
  const id_ = LIST_COLLECTIONS.get(collectionId)
    || existingId
    || `source-${lastName(metadata.authors?.[0])}-${year}`;
  const source = normalizeSource({
    id: id_,
    title,
    authors: metadata.authors || [],
    venue: metadata.venue || "",
    url,
    doi: metadata.doi || null,
    arxivId: metadata.arxiv_id || null
  });
  if (sources.has(id_)) {
    const existing = sources.get(id_);
    if (existing.title !== source.title || existing.url !== source.url) {
      throw new Error(`${id}: primary source ${id_} disagrees with an existing source (${existing.title} / ${source.title})`);
    }
    // Backfill identifiers the hand-written source lacked.
    if (!existing.doi && source.doi) existing.doi = source.doi;
    if (!existing.arxivId && source.arxivId) existing.arxivId = source.arxivId;
    return id_;
  }
  return registerSource(source);
};

// Best-effort bibliographic parse of one Markdown bibliography line.
const parseBibliographyLine = (line) => {
  const citation = line.replace(/^-\s*/, "").trim();
  const titleMatch = citation.match(/\*([^*]+)\*/) || citation.match(/["“]([^"”]+)["”]/);
  const yearMatch = citation.match(/\b(19|20)\d{2}\b/);
  if (!titleMatch) return { title: citation, authors: [], venue: "", citation, year: yearMatch?.[0] || null };
  const title = titleMatch[1].trim().replace(/[,.]$/, "");
  const before = citation.slice(0, titleMatch.index).replace(/[,\s]+$/, "").replace(/^\[[^\]]+\]\s*/, "");
  const after = citation.slice(titleMatch.index + titleMatch[0].length).replace(/^[,.\s]+/, "").trim();
  const authors = before
    .split(/,\s*|\s+and\s+|\s*&\s*/)
    .map((author) => author.trim())
    .filter((author) => author && !/^et al\.?$/i.test(author) && author.length < 60);
  return { title, authors, venue: after, citation, year: yearMatch?.[0] || null };
};

const urlKey = (url) => {
  const arxiv = url.match(/arxiv\.org\/abs\/([\w.\/-]+?)(?:v\d+)?\/?$/);
  if (arxiv) return { kind: "arxiv", value: arxiv[1] };
  const doi = url.match(/doi\.org\/(.+)$/);
  if (doi) return { kind: "doi", value: decodeURIComponent(doi[1]) };
  return { kind: "url", value: url };
};

const evidenceSourceFor = (problemId, item, bibliography) => {
  if (sourceIdByUrl.has(item.url)) return sourceIdByUrl.get(item.url);
  const key = urlKey(item.url);
  const needle = key.value;
  const line = bibliography.find((entry) => entry.includes(needle));
  const parsed = line ? parseBibliographyLine(line) : null;
  let id;
  if (parsed && parsed.authors.length && parsed.year) {
    id = `source-${lastName(parsed.authors[0])}-${parsed.year}-${slugify(parsed.title, 3)}`;
  } else if (key.kind === "arxiv") {
    id = `source-arxiv-${slugify(key.value.replace(/[./]/g, "-"), 4)}`;
  } else if (key.kind === "doi") {
    id = `source-doi-${slugify(key.value.replace(/[./()]/g, "-"), 6)}`;
  } else {
    id = `source-web-${slugify(new URL(item.url).hostname.replace(/^www\./, "") + " " + new URL(item.url).pathname.replace(/[/_]/g, " "), 6)}`;
  }
  if (sources.has(id) && sources.get(id).url !== item.url) id = `${id}-${sha256(item.url).slice(0, 6)}`;
  const source = parsed
    ? normalizeSource({
      id,
      title: parsed.title,
      authors: parsed.authors,
      venue: parsed.venue,
      url: item.url,
      doi: key.kind === "doi" ? key.value : null,
      arxivId: key.kind === "arxiv" ? key.value : null,
      citation: parsed.citation
    })
    : normalizeSource({
      id,
      title: item.title,
      authors: [],
      venue: item.label || "",
      url: item.url,
      doi: key.kind === "doi" ? key.value : null,
      arxivId: key.kind === "arxiv" ? key.value : null,
      bibliographyState: "url-only"
    });
  return registerSource(source);
};

// ---------------------------------------------------------------------------
// Relation mapping for legacy evidence strength labels
// ---------------------------------------------------------------------------
const relationFor = (item) => {
  const strength = String(item.strength).toLowerCase();
  if (item.maturity === "Withdrawn") return "status-review";
  if (/status|unaccepted|incorrect|unverified|proof correction|open formulation|authoritative|audit/.test(strength)) return "status-review";
  if (/excluded method|limitation|incomplete/.test(strength)) return "rules-out";
  if (/formulation|implication|parameterization/.test(strength)) return "reformulates";
  if (/numerical|related|foundational|milestone|constraints|restrictions|methods/.test(strength)) return "supports";
  if (/exact|theorem|counterexample|characterization|construction|criterion|separation|protocol|subclass|class|slice|case|regime|no-go/.test(strength)) return "narrows";
  return "supports";
};
const relationTable = [];

// ---------------------------------------------------------------------------
// Records
// ---------------------------------------------------------------------------
const uniqueId = (used, base) => {
  let candidate = base;
  let counter = 2;
  while (used.has(candidate)) candidate = `${base}-${counter++}`;
  used.add(candidate);
  return candidate;
};

const notesMarkdown = (heading, article) => {
  const sections = [
    ["Background", extractSection(article, "Background")],
    ["Status and known progress", extractSection(article, "Status and known progress")],
    ["Bibliography", extractSection(article, "Bibliography")]
  ].filter(([, body]) => body);
  return [`# ${heading}`, "", ...sections.flatMap(([title, body]) => [`## ${title}`, "", body, ""])].join("\n");
};

const statementMarkdown = (article) => {
  const notation = extractSection(article, "Notation");
  const statement = extractSection(article, "Formal statement");
  if (!statement) throw new Error("missing Formal statement section");
  return [...(notation ? ["## Notation", "", notation, ""] : []), "## Formal statement", "", statement, ""].join("\n");
};

const aliasFor = (metadata) => {
  if (!metadata.catalog_source_id) return [];
  const prefix = /theoremdb/.test(metadata.catalog_source || "") ? "theoremdb" : "gaugeforge";
  return [`${prefix}-${String(metadata.catalog_source_id).toLowerCase().replaceAll("_", "-")}`];
};

const migrated = [];
const skipped = [];

for (const id of [...metadataById.keys()].sort()) {
  const metadata = metadataById.get(id);
  const article = fs.readFileSync(path.join(openProbDirectory, id, "problem.md"), "utf8");
  const heading = (article.match(/^# (.+)$/m) || [null, metadata.title])[1];
  const legacyProblem = legacyById.get(id) || null;
  const solved = metadata.status === "solved";
  const directory = path.join(problemsDirectory, id);
  const recordPath = path.join(directory, "record.json");
  const existing = fs.existsSync(recordPath) ? readJson(recordPath) : null;
  const curated = solvedClaims[id] || null;
  if (solved && !existing && !curated) {
    if (skipSolved) { skipped.push(id); continue; }
    throw new Error(`${id}: solved record needs curated claims (pass --solved-claims)`);
  }
  if (!solved && !legacyProblem) throw new Error(`${id}: active source record has no site entry`);
  if (legacyProblem && legacyProblem.proposed !== metadata.proposed_date) {
    throw new Error(`${id}: proposed date disagrees (${legacyProblem.proposed} vs ${metadata.proposed_date})`);
  }

  const status = metadata.status === "partially_solved" ? "partial" : metadata.status;
  const verified = legacyProblem?.verified || metadata.last_verified || legacy.meta.audited;
  const bibliography = extractSection(article, "Bibliography").split("\n").filter((line) => line.trim().startsWith("-"));
  const primarySourceId = primarySourceFor(id, metadata);
  const usedIds = new Set();

  const problem = existing ? { ...existing.problem } : {
    kind: "Problem",
    id,
    accession: null,
    aliases: aliasFor(metadata),
    catalogState: solved ? "archived" : "published",
    title: legacyProblem ? legacyProblem.title : metadata.title,
    proposed: metadata.proposed_date,
    topicId: legacyProblem ? legacyProblem.topic : SOLVED_TOPICS[id],
    collectionId: legacyProblem ? legacyProblem.collection : [...LIST_COLLECTIONS.keys()].find((prefix) => id.startsWith(`${prefix}-`)),
    question: legacyProblem ? {
      type: legacyProblem.type,
      summary: legacyProblem.summary,
      importance: legacyProblem.importance,
      unresolved: legacyProblem.remaining
    } : { ...curated.question, unresolved: "" },
    keywords: legacyProblem ? legacyProblem.keywords || [] : curated.keywords || [],
    relatedProblemIds: legacyProblem?.related || []
  };
  if (!problem.topicId) throw new Error(`${id}: no topic assigned`);
  const plainHeading = heading.trim();
  if (solved && plainHeading !== problem.title && /\$/.test(plainHeading)) problem.titleMarkdown = plainHeading;

  const statementId = existing ? existing.statements[0].id : `${id}-statement-v1`;
  const statedTitle = metadata.title && metadata.title !== problem.title ? metadata.title : null;
  const statements = existing
    ? existing.statements.map((statement) => ({
      ...statement,
      sourceRefs: statement.sourceRefs.map((reference) => ({
        sourceId: RENAMED_SOURCES.get(reference.sourceId) || reference.sourceId,
        relationship: reference.relationship,
        locator: reference.locator,
        primary: reference.primary,
        ...(reference.primary && statedTitle ? { statedTitle } : {})
      }))
    }))
    : [{
      kind: "StatementVersion",
      id: statementId,
      problemId: id,
      version: 1,
      supersedesStatementId: null,
      created: verified,
      bodyPath: "statements/v1.md",
      sourceRefs: [{
        sourceId: primarySourceId,
        relationship: metadata.origin?.kind === "derived" ? "documents-gap" : "states-problem",
        locator: metadata.source_location,
        primary: true,
        ...(statedTitle ? { statedTitle } : {})
      }],
      targetClauses: solved
        ? [{ ...curated.clause }]
        : [{
          id: "archived-statement",
          label: "Archived statement",
          text: "The formal statement of this version, as archived from the source.",
          resolutionCriteria: legacyProblem.remaining
        }]
    }];
  const clauseId = statements[0].targetClauses[0].id;

  let claims;
  let evidence;
  let decisions;
  let editorial;
  if (existing) {
    claims = existing.claims;
    evidence = existing.evidence.map((item) => ({ ...item, sourceId: RENAMED_SOURCES.get(item.sourceId) || item.sourceId }));
    decisions = existing.decisions;
    editorial = { ...existing.editorial };
  } else if (solved) {
    const claimId = `claim-${id}-${slugify(curated.claim.title, 4)}`;
    claims = [{
      kind: "Claim",
      id: claimId,
      statementId,
      targetClauseIds: [clauseId],
      relation: curated.claim.relation,
      title: curated.claim.title,
      text: curated.claim.text
    }];
    evidence = curated.evidence.map((item, index) => {
      const sourceId = (item.source?.url && sourceIdByUrl.get(item.source.url))
        || RENAMED_SOURCES.get(item.sourceId)
        || item.sourceId;
      if (!sources.has(sourceId)) throw new Error(`${id}: curated source ${sourceId} was not registered`);
      return {
        kind: "Evidence",
        id: uniqueId(usedIds, `evidence-${id}-${slugify(item.label || item.source.title, 3)}`),
        claimId,
        sourceId,
        sourceLocator: item.sourceLocator || null,
        date: item.date,
        maturity: item.maturity,
        strength: item.strength,
        label: item.label
      };
    });
    decisions = [{
      kind: "Decision",
      id: `decision-${id}-status-${verified}`,
      problemId: id,
      statementId,
      decisionType: "status-assessment",
      outcome: "accepted",
      supersedesDecisionId: null,
      status: "solved",
      effectiveDate: verified,
      verified,
      evidenceIds: evidence.map((item) => item.id),
      rationale: curated.decision.maturityNote
        ? `${curated.decision.rationale} ${curated.decision.maturityNote}`
        : curated.decision.rationale
    }];
    editorial = {
      cautions: (curated.cautions || []).map((caution) => ({ label: caution.label, text: caution.text, url: caution.url || null })),
      interpretation: null,
      provenance: null
    };
  } else {
    claims = [];
    evidence = [];
    for (const item of legacyProblem.progress) {
      const year = item.date.slice(0, 4);
      const slug = slugify(item.title, 4);
      const claimId = uniqueId(usedIds, `claim-${id}-${year}-${slug}`);
      const relation = relationFor(item);
      relationTable.push([item.strength, relation, id]);
      claims.push({
        kind: "Claim",
        id: claimId,
        statementId,
        targetClauseIds: [clauseId],
        relation,
        title: item.title,
        text: item.detail
      });
      if (!item.url) throw new Error(`${id}: progress item without URL: ${item.title}`);
      evidence.push({
        kind: "Evidence",
        id: uniqueId(usedIds, `evidence-${id}-${year}-${slug}`),
        claimId,
        sourceId: evidenceSourceFor(id, item, bibliography),
        sourceLocator: null,
        date: item.date,
        maturity: item.maturity,
        strength: item.strength,
        label: item.label
      });
    }
    decisions = [{
      kind: "Decision",
      id: `decision-${id}-status-${verified}`,
      problemId: id,
      statementId,
      decisionType: "status-assessment",
      outcome: "accepted",
      supersedesDecisionId: null,
      status,
      effectiveDate: verified,
      verified,
      evidenceIds: evidence.map((item) => item.id),
      rationale: `Status assessed against the archived statement in the ${verified} primary-source audit; the evidence ledger lists the results considered.`
    }];
    editorial = {
      cautions: (legacyProblem.watch || []).map((note) => ({ label: note.label, text: note.text, url: note.url || null })),
      interpretation: legacyProblem.interpretation || null,
      provenance: legacyProblem.origin
        ? { kind: legacyProblem.origin.kind, label: legacyProblem.origin.label, note: legacyProblem.origin.note }
        : null
    };
  }

  const notices = (legacy.watchlist || [])
    .filter((item) => item.problemId === id)
    .map((item) => ({
      tone: item.tone || "",
      label: item.label,
      title: item.title,
      text: item.text,
      sourceLabel: item.sourceLabel || null,
      featured: Boolean(item.featured)
    }));
  editorial = {
    cautions: editorial.cautions,
    interpretation: editorial.interpretation ?? null,
    provenance: editorial.provenance ?? null,
    notices,
    notesPath: "notes.md"
  };

  const sourceImport = existing?.compatibility?.sourceImport
    ? { ...existing.compatibility.sourceImport, statementId: existing.statements[0].id }
    : (existing?.sourceImport ?? null);

  const record = {
    schemaVersion: "0.2.0",
    kind: "qop-canonical-record",
    problem,
    statements,
    claims,
    evidence,
    decisions,
    editorial,
    sourceImport
  };

  fs.mkdirSync(path.join(directory, "statements"), { recursive: true });
  const statementPath = path.join(directory, "statements", "v1.md");
  const derivedStatement = statementMarkdown(article);
  if (existing) {
    const current = fs.readFileSync(statementPath, "utf8");
    const same = extractSection(current, "Formal statement") === extractSection(derivedStatement, "Formal statement")
      && extractSection(current, "Notation") === extractSection(derivedStatement, "Notation");
    if (!same) throw new Error(`${id}: hand-migrated statement differs from the legacy article`);
  } else {
    fs.writeFileSync(statementPath, derivedStatement);
  }
  fs.writeFileSync(path.join(directory, "notes.md"), notesMarkdown(heading, article));
  writeJson(recordPath, record);
  migrated.push(id);
}

// v2 import record that has no legacy article: upgrade its schema in place.
for (const entry of fs.readdirSync(problemsDirectory)) {
  const recordPath = path.join(problemsDirectory, entry, "record.json");
  if (!fs.existsSync(recordPath) || migrated.includes(entry)) continue;
  const record = readJson(recordPath);
  if (record.schemaVersion === "0.2.0") continue;
  const sourceImport = record.compatibility?.sourceImport
    ? { ...record.compatibility.sourceImport, statementId: record.statements[0].id }
    : null;
  delete record.compatibility;
  writeJson(recordPath, {
    schemaVersion: "0.2.0",
    kind: record.kind,
    problem: record.problem,
    statements: record.statements,
    claims: record.claims,
    evidence: record.evidence,
    decisions: record.decisions,
    editorial: { ...record.editorial, notices: [], notesPath: null },
    sourceImport
  });
  migrated.push(entry);
}

for (const source of sources.values()) {
  writeJson(path.join(sourcesDirectory, `${source.id}.json`), source);
}

console.log(`Migrated ${migrated.length} records; ${sources.size} sources; skipped ${skipped.length} solved records without curated claims.`);
if (skipped.length) console.log(`Skipped: ${skipped.join(", ")}`);
const relationCounts = relationTable.reduce((counts, [strength, relation]) => {
  const key = `${relation} <- ${strength}`;
  counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});
console.log("Relation mapping (relation <- legacy strength):");
for (const [key, count] of Object.entries(relationCounts).sort()) console.log(`  ${count} ${key}`);
