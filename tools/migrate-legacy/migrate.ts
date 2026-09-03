/**
 * One-time migration of the legacy catalog into the ledger. See README.md.
 *
 *   node --experimental-strip-types --no-warnings tools/migrate-legacy/migrate.ts [--out <repo-root>]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { serializeRecord } from "../../contract/src/record.ts";
import { statementDigest, bytesDigest } from "../../contract/src/digest.ts";

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..");
const outRoot = process.argv.includes("--out") ? path.resolve(process.argv[process.argv.indexOf("--out") + 1]!) : repoRoot;
const LEDGER = path.join(outRoot, "ledger");
const ACTIVITY = path.join(outRoot, "activity");
const STORE = path.join(ACTIVITY, "artifact-store");

const MIGRATION_AT = "2026-09-02T18:00:00Z";
const BASELINE_AUDIT_AT = "2026-08-12T09:00:00Z";
const POLICY = "1";
const LICENSE = "CC-BY-4.0";

type Fields = Record<string, unknown>;
interface Out { root: string; rel: string; fields: Fields; body: string }
const out: Out[] = [];
const emit = (root: string, rel: string, fields: Fields, body: string) => out.push({ root, rel, fields, body });

// Deterministic ULIDs: fixed time part, random part from a hash of the record's key.
const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const TIME_MS = BigInt(Date.parse(MIGRATION_AT));
const issued = new Map<string, string>();
function ulid(key: string): string {
  const existing = issued.get(key);
  if (existing) return existing;
  const hash = createHash("sha256").update(`qop-migrate:${key}`).digest();
  let random = 0n;
  for (let i = 0; i < 10; i += 1) random = (random << 8n) | BigInt(hash[i]!);
  let value = (TIME_MS << 80n) | random;
  let text = "";
  for (let i = 0; i < 26; i += 1) {
    text = CROCKFORD[Number(value & 31n)] + text;
    value >>= 5n;
  }
  issued.set(key, text);
  return text;
}

const slugify = (text: string) =>
  text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "problem";

// ---------------------------------------------------------------------------
// Actors
// ---------------------------------------------------------------------------

const SYSTEM = ulid("actor:system");
const EDITOR = ulid("actor:legacy-audit-editor");
const INGEST = ulid("actor:legacy-ingestion");

function actor(id: string, name: string, kind: string, extra: Fields, body: string): void {
  emit(LEDGER, `actors/${id}.r1.md`, {
    id, type: "Actor", schemaVersion: "1.0", revision: 1, createdBy: SYSTEM, createdAt: MIGRATION_AT,
    name, kind, externalIdentity: null, operatorId: null, modelFamily: null, modelVersion: null, harness: null, ...extra,
  }, body);
}
actor(SYSTEM, "Quantum Open Problems service", "system", {}, "The domain service. Issues automatic acceptance decisions and records ingestion.");
actor(EDITOR, "Legacy audit editor", "human", {}, "Placeholder for the person who performed the 12 August 2026 baseline audit and the 31 August 2026 additions review of the legacy catalog (STATUS_AUDIT.md). Replace with the editor's real actor when one exists.");
actor(INGEST, "Legacy catalog ingestion", "pipeline", { operatorId: EDITOR, harness: "tools/migrate-legacy/migrate.ts" }, "Pipeline that migrated the legacy catalog and the open_problem_v2 pool into the ledger on 2 September 2026.");

// ---------------------------------------------------------------------------
// Sources, deduplicated
// ---------------------------------------------------------------------------

interface SourceSpec {
  title: string; kind: string; authors: string[]; venue: string; date: string | null;
  doi: string | null; arxivId: string | null; url: string | null; version: string | null; body?: string;
}
const sources = new Map<string, string>();
function sourceKey(s: SourceSpec): string {
  if (s.doi) return `doi:${s.doi.toLowerCase()}`;
  if (s.arxivId) return `arxiv:${s.arxivId.toLowerCase()}`;
  if (s.url) return `url:${s.url.replace(/\/+$/u, "").toLowerCase()}`;
  return `text:${s.title.toLowerCase().replace(/[^a-z0-9]/gu, "")}|${(s.authors[0] ?? "").toLowerCase().replace(/[^a-z]/gu, "")}|${s.date ?? ""}`;
}
function source(spec: SourceSpec): string {
  const key = sourceKey(spec);
  const existing = sources.get(key);
  if (existing) return existing;
  const id = ulid(`source:${key}`);
  sources.set(key, id);
  emit(LEDGER, `sources/${id}.r1.md`, {
    id, type: "Source", schemaVersion: "1.0", revision: 1, createdBy: INGEST, createdAt: MIGRATION_AT,
    title: spec.title, kind: spec.kind, authors: spec.authors, venue: spec.venue, date: spec.date,
    doi: spec.doi, arxivId: spec.arxivId, url: spec.url, version: spec.version,
  }, spec.body ?? "");
  return id;
}

const normalizeDoi = (doi: string | null | undefined): string | null => {
  if (!doi) return null;
  const bare = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").replace(/[.,;)]+$/u, "");
  return /^10\.\d{4,}\//.test(bare) ? bare : null;
};
const arxivFromUrl = (url: string | null | undefined): string | null => {
  const match = url?.match(/arxiv\.org\/abs\/([^\s?#]+)/i);
  return match ? match[1]!.replace(/v\d+$/u, "") : null;
};
const doiFromUrl = (url: string | null | undefined): string | null => {
  const match = url?.match(/doi\.org\/([^\s?#]+)/i);
  return match ? normalizeDoi(match[1]) : null;
};
const yearOf = (text: string): string | null => text.match(/\((\d{4})\)/)?.[1] ?? text.match(/\b(19|20)\d{2}\b/)?.[0] ?? null;

// ---------------------------------------------------------------------------
// Legacy inputs
// ---------------------------------------------------------------------------

const sandbox = { window: {} as { QUANTUM_OPEN_PROBLEMS?: LegacyCatalog } };
vm.runInNewContext(fs.readFileSync(path.join(repoRoot, "site/data/problems.js"), "utf8"), sandbox);
const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS!;

interface LegacyProgress { date: string; title: string; detail: string; maturity: string; strength: string; url: string; label: string }
interface LegacyWatch { label: string; text: string; url?: string }
interface LegacyProblem {
  id: string; title: string; status: string; topic: string; collection: string; proposed: string; type: string;
  summary: string; importance: string; remaining: string; latest: string; keywords: string[];
  progress: LegacyProgress[]; watch?: LegacyWatch[]; related?: string[]; interpretation?: string; verified?: string;
  origin?: { kind: string; note: string };
}
interface LegacyCatalog {
  taxonomy: { areas: { id: string }[]; topics: { id: string; area: string }[] };
  collections: { id: string; label: string; title: string; url?: string }[];
  problems: LegacyProblem[];
}
interface Metadata {
  doi?: string; arxiv_id?: string; primary_url?: string; source_url?: string; source_title?: string;
  proposed_date?: string; status: string; source_location?: string; authors: string[]; title: string; venue: string;
  last_verified?: string; origin?: { kind: string; note: string }; catalog_source?: string; catalog_source_id?: string;
}

const topicArea = new Map(catalog.taxonomy.topics.map((topic) => [topic.id, topic.area]));
const activeBySlug = new Map(catalog.problems.map((problem) => [problem.id, problem]));
const problemDir = path.join(repoRoot, "open_prob");
const slugs = fs.readdirSync(problemDir).filter((name) => fs.existsSync(path.join(problemDir, name, "problem.md"))).sort();
const problemIdOf = (slug: string) => ulid(`problem:${slug}`);

function sectionsOf(markdown: string): { title: string; sections: Map<string, string> } {
  const lines = markdown.split(/\r?\n/);
  const title = lines.find((line) => line.startsWith("# "))?.slice(2).trim() ?? "Untitled";
  const sections = new Map<string, string>();
  let current: string | null = null;
  let buffer: string[] = [];
  const flush = () => { if (current !== null) sections.set(current, buffer.join("\n").trim()); };
  for (const line of lines) {
    if (line.startsWith("## ")) { flush(); current = line.slice(3).trim(); buffer = []; }
    else if (current !== null) buffer.push(line);
  }
  flush();
  return { title, sections };
}

interface BiblioEntry { sourceId: string; note: string; surname: string }
function parseBibliography(text: string): BiblioEntry[] {
  const entries: BiblioEntry[] = [];
  for (const raw of text.split("\n")) {
    if (!raw.startsWith("- ")) continue;
    // Bold runs (volume numbers) are not titles; a title is *italic*, or "double quoted" when the entry has no italics.
    let line = raw.slice(2).trim().replace(/^\[[^\]]+\]\s*/u, "").replace(/\*\*([^*]+)\*\*/gu, "$1");
    const note = line.match(/\(([^()]*(?:Source paper|Problem \d+|see also)[^()]*)\)\.?$/iu)?.[1] ?? "";
    // The title is the first italic run, unless a double-quoted segment precedes it (quoted title, italic journal).
    // Quotes inside an italic title, or in a trailing "Source PDF" note, do not count.
    const firstItalic = line.match(/\*([^*]+)\*/u);
    const quoted = line.match(/[“"]([^”"]{6,})[”"]/u);
    const italic = quoted && (!firstItalic || quoted.index! < firstItalic.index!) ? quoted : firstItalic;
    const doi = normalizeDoi(line.match(/DOI:\s*([^\s;,]+)/iu)?.[1] ?? doiFromUrl(line.match(/https?:\/\/[^\s)]+/u)?.[0] ?? null));
    const arxivId = line.match(/arXiv:([A-Za-z-]+\/\d{7}|\d{4}\.\d{4,5})/u)?.[1] ?? null;
    const url = line.match(/https?:\/\/[^\s)]+/u)?.[0]?.replace(/[.,;]+$/u, "") ?? (arxivId ? `https://arxiv.org/abs/${arxivId}` : null);
    let title: string;
    let authors: string[] = [];
    let venue = "";
    if (italic) {
      title = italic[1]!.trim();
      const before = line.slice(0, italic.index).replace(/[,\s]+$/u, "");
      authors = before.split(/,\s*|\s+and\s+/u).map((a) => a.trim()).filter(Boolean);
      venue = line.slice(italic.index! + italic[0].length).replace(/^[,\s]+/u, "").replace(/\s*\([^()]*(?:Source paper|Problem \d+|see also)[^()]*\)\.?$/iu, "").replace(/\.$/u, "").trim();
    } else {
      title = line.replace(/\s*\([^()]*(?:Source paper|Problem \d+|see also)[^()]*\)\.?$/iu, "").trim();
    }
    const date = yearOf(venue) ?? (arxivId && /^\d{4}\./.test(arxivId) ? `20${arxivId.slice(0, 2)}` : null);
    const kind = doi ? "paper" : arxivId ? "preprint" : /Press|Springer|Wiley|Verlag|Cambridge|Oxford/u.test(venue) ? "book" : "paper";
    const sourceId = source({ title, kind, authors, venue, date, doi, arxivId, url, version: null });
    const surname = (authors[0] ?? "").split(/\s+/u).pop() ?? "";
    entries.push({ sourceId, note, surname });
  }
  return entries;
}

const CLAUSE_KIND: [RegExp, string][] = [
  [/existence/i, "existence"],
  [/construction/i, "construction"],
  [/universal|positivity|dichotomy/i, "universal"],
];
const clauseKindOf = (type: string | undefined) => CLAUSE_KIND.find(([pattern]) => type && pattern.test(type))?.[1] ?? "decision";

const MATURITY: Record<string, string> = {
  "peer reviewed": "peer-reviewed", preprint: "preprint", withdrawn: "withdrawn", mixed: "preprint",
  "archived source": "web-record", "official status page": "web-record", "reviewed database record": "web-record",
};
function strengthOf(raw: string): string {
  const s = raw.toLowerCase();
  if (/unaccepted|unverified|incorrect/.test(s)) return "unaccepted-claim";
  if (/counterexample/.test(s)) return "counterexample";
  if (/status|audit|open formulation/.test(s)) return "survey-assessment";
  if (/correction/.test(s)) return "correction";
  if (/numerical/.test(s)) return "numerical-evidence";
  if (/bound/.test(s)) return "bound";
  if (/restricted|subclass|special case|class|slice|endpoint|regime|low-dimensional|lower-class|two-copy|nearby|adjacent|finite-use|physical-scope|sufficient|parameter/.test(s)) return "restricted-theorem";
  if (/exact|theorem|characterization|solution|no-go|protocol|classification|parameterization/.test(s)) return "exact-theorem";
  return "related-result";
}
const isStatusReview = (raw: string) => /status|audit|open formulation/i.test(raw);
const isUnaccepted = (raw: string) => /unaccepted|unverified|incorrect/i.test(raw);
const isNarrowing = (raw: string) => /restricted|subclass|special case|class|slice|endpoint|regime|low-dimensional|lower-class|two-copy|counterexample|parameter|inverse|nearby|adjacent|sufficient/i.test(raw);
const cleanUrl = (url: string) => url.replace(/[.,;]+$/u, "");

function progressSource(item: LegacyProgress): string {
  const arxivId = arxivFromUrl(item.url);
  const doi = doiFromUrl(item.url);
  const kind = item.maturity === "Peer reviewed" ? "paper" : /theoremdb|claymath/i.test(item.url) ? "web-record" : arxivId ? "preprint" : "paper";
  return source({
    title: item.label || item.url, kind, authors: [], venue: item.label || "", date: item.date.slice(0, 4),
    doi, arxivId, url: cleanUrl(item.url), version: null,
    body: "Imported from a legacy progress entry; bibliographic details to be completed during maintenance.",
  });
}

// ---------------------------------------------------------------------------
// Emitters for one problem bundle
// ---------------------------------------------------------------------------

interface Bundle { slug: string; dir: string; problemId: string; statementId: string; clauseRef: string; digest: string; reviewAt: string }
const eventsLog: object[] = [];
let eventSeq = 0;
const logEvent = (summary: string, problemId: string | null, objectIds: string[]) => {
  eventSeq += 1;
  eventsLog.push({ seq: eventSeq, at: MIGRATION_AT, kind: "read", summary, problemId, clauseId: null, obstacle: "none", objectIds, artifactId: null });
};
const TRAJECTORY = ulid("trajectory:legacy-ingestion");

function reference(bundle: Bundle, key: string, sourceId: string, targetType: string, targetId: string, role: string, locator: string, body: string): string {
  const id = ulid(`reference:${bundle.slug}:${key}`);
  emit(LEDGER, `${bundle.dir}/references/${id}.r1.md`, {
    id, type: "Reference", schemaVersion: "1.0", revision: 1, createdBy: INGEST, createdAt: MIGRATION_AT,
    sourceId, targetType, targetId, role, locator,
  }, body);
  return id;
}

function claim(bundle: Bundle, key: string, title: string, relation: string, support: Fields[], body: string): string {
  const id = ulid(`claim:${bundle.slug}:${key}`);
  emit(LEDGER, `${bundle.dir}/claims/${id}.md`, {
    id, type: "Claim", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
    title, statementId: bundle.statementId, clauseIds: [bundle.clauseRef], relation, bound: null, support,
  }, body);
  return id;
}

function contribution(bundle: Bundle, key: string, title: string, kind: string, fields: Fields, body: string): string {
  const id = ulid(`contribution:${bundle.slug}:${key}`);
  emit(LEDGER, `${bundle.dir}/contributions/${id}/contribution.md`, {
    id, type: "Contribution", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
    title, kind, actorId: INGEST, trajectoryId: TRAJECTORY, problemIds: [], statementId: null, statementDigest: null,
    clauseIds: [], stopReason: "none", newProblemIds: [], newStatementId: null, referenceIds: [], claimIds: [],
    artifactIds: [], declaredReadIds: [], aiInvolvement: "none", license: LICENSE, ...fields,
  }, body);
  return id;
}

function review(bundle: Bundle, key: string, contributionId: string, verdict: string, checks: [string, string, string][], body: string): string {
  const id = ulid(`review:${bundle.slug}:${key}`);
  emit(LEDGER, `${bundle.dir}/contributions/${contributionId}/reviews/${id}.md`, {
    id, type: "Review", schemaVersion: "1.0", createdBy: EDITOR, createdAt: bundle.reviewAt, supersedes: null,
    contributionId, reviewerId: EDITOR, trajectoryId: null, kind: "verification",
    independence: { differentOperator: false, differentModelFamily: true, noSharedReads: true },
    methods: ["citation-check", "argument-read", "scope-check"],
    checks: checks.map(([name, outcome, note]) => ({ name, outcome, note })), verdict,
  }, body);
  return id;
}

function decision(bundle: Bundle, key: string, by: string, kind: string, targetType: string, targetId: string, fields: Fields, body: string): string {
  const id = ulid(`decision:${bundle.slug}:${key}`);
  emit(LEDGER, `${bundle.dir}/decisions/${id}.md`, {
    id, type: "Decision", schemaVersion: "1.0", createdBy: by, createdAt: MIGRATION_AT, supersedes: null,
    kind, targetType, targetId, outcome: "accepted", status: null, verificationLevel: null, reviewIds: [], contributionIds: [],
    policyVersion: POLICY, effectiveAt: MIGRATION_AT, ...fields,
  }, body);
  return id;
}

// ---------------------------------------------------------------------------
// Legacy problems (58)
// ---------------------------------------------------------------------------

const summary = { legacy: 0, v2: 0, claims: 0, rejected: 0, references: 0, unsupportedSolved: [] as string[] };
const collectionSource = new Map<string, string>();

for (const slug of slugs) {
  const markdown = fs.readFileSync(path.join(problemDir, slug, "problem.md"), "utf8");
  const metadata = JSON.parse(fs.readFileSync(path.join(problemDir, slug, "metadata.json"), "utf8")) as Metadata;
  const active = activeBySlug.get(slug);
  const { title, sections } = sectionsOf(markdown);
  const problemId = problemIdOf(slug);
  const statementId = ulid(`statement:${slug}:1`);
  const clauseRef = `${statementId}#main`;
  const dir = `problems/${slug}`;
  const reviewAt = metadata.last_verified ? `${metadata.last_verified}T09:00:00Z` : active?.verified ? `${active.verified}T09:00:00Z` : BASELINE_AUDIT_AT;
  const bundle: Bundle = { slug, dir, problemId, statementId, clauseRef, digest: "", reviewAt };

  // Statement.
  const notation = sections.get("Notation");
  const formal = sections.get("Formal statement") ?? "";
  const statementBody = `${notation ? `## Notation\n\n${notation}\n\n` : ""}## Formal statement\n\n${formal}\n`;
  bundle.digest = statementDigest(statementBody);
  const firstParagraph = formal.replace(/^\*\*[^*]+\*\*\s*/u, "").split(/\n\s*\n/u)[0]?.replace(/\s+/gu, " ").trim() ?? title;
  emit(LEDGER, `${dir}/statements/v1.md`, {
    id: statementId, type: "Statement", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
    problemId, version: 1, digest: bundle.digest,
    clauses: [{
      id: "main", label: title, text: firstParagraph.slice(0, 600), kind: clauseKindOf(active?.type),
      resolutionCriteria: active?.remaining ?? "Prove or refute the formal statement.", supersedesClauseId: null, quantity: null,
    }],
  }, statementBody);

  // Sources and references: list source first (so the bibliography's copy of the list deduplicates onto it), then bibliography, stating source, catalog provenance.
  const referenceIds: string[] = [];
  const metaDoi = normalizeDoi(metadata.doi) ?? doiFromUrl(metadata.primary_url);
  const metaArxiv = metadata.arxiv_id ?? arxivFromUrl(metadata.primary_url);
  const collectionId = active?.collection ?? slug.replace(/^([a-z]+-\d{4}).*$/u, "$1");
  const collection = catalog.collections.find((c) => c.id === collectionId);
  const isList = ["horodecki-2020", "krueger-2005", "ruskai-2007"].includes(collectionId);

  let statingSourceId: string;
  if (isList) {
    statingSourceId = collectionSource.get(collectionId) ?? source({
      title: collection?.title ?? metadata.title, kind: "problem-list", authors: metadata.authors, venue: metadata.venue,
      date: yearOf(metadata.venue), doi: metaDoi, arxivId: metaArxiv, url: metadata.primary_url ?? (metaDoi ? `https://doi.org/${metaDoi}` : null), version: null,
    });
    collectionSource.set(collectionId, statingSourceId);
    referenceIds.push(reference(bundle, "listed-in", statingSourceId, "problem", problemId, "listed-in", metadata.source_location ?? "", ""));
  }
  const biblio = parseBibliography(sections.get("Bibliography") ?? "");
  if (!isList) {
    const matched = biblio.find((entry) => {
      const key = [...sources.entries()].find(([, id]) => id === entry.sourceId)?.[0] ?? "";
      return (metaDoi && key === `doi:${metaDoi.toLowerCase()}`) || (metaArxiv && key === `arxiv:${metaArxiv.toLowerCase()}`);
    });
    statingSourceId = matched?.sourceId ?? source({
      title: metadata.source_title ?? metadata.title, kind: metaDoi ? "paper" : "preprint", authors: metadata.authors, venue: metadata.venue,
      date: yearOf(metadata.venue), doi: metaDoi, arxivId: metaArxiv, url: metadata.primary_url ?? null, version: null,
    });
  }
  referenceIds.push(reference(bundle, "states-problem", statingSourceId, "problem", problemId, "states-problem", metadata.source_location ?? "",
    metadata.origin?.note ?? active?.origin?.note ?? ""));
  if (metadata.catalog_source && collection) {
    const catalogKind = /theoremdb/i.test(metadata.catalog_source) ? "web-record" : "problem-list";
    const catalogUrl = metadata.source_url ?? metadata.catalog_source;
    const catalogSource = source({
      title: catalogKind === "web-record" ? (metadata.source_title ? `TheoremDB: ${metadata.source_title}` : collection.title) : collection.title,
      kind: catalogKind, authors: [], venue: collection.label, date: "2026", doi: null, arxivId: null, url: catalogUrl, version: null,
    });
    referenceIds.push(reference(bundle, "catalog", catalogSource, "problem", problemId, catalogKind === "web-record" ? "survey" : "listed-in", metadata.catalog_source_id ?? "", ""));
  }
  const statingKey = [...sources.entries()].find(([, id]) => id === statingSourceId)?.[0];
  biblio.forEach((entry, index) => {
    const entryKey = [...sources.entries()].find(([, id]) => id === entry.sourceId)?.[0];
    if (entryKey === statingKey) return;
    referenceIds.push(reference(bundle, `biblio-${index}`, entry.sourceId, "problem", problemId, "background", "", entry.note));
  });

  // Problem body and record.
  const cautions: string[] = [];
  const bodyParts: string[] = [];
  if (active) {
    bodyParts.push(active.summary, active.importance);
    if (active.interpretation) bodyParts.push(`## Interpretation\n\n${active.interpretation}`);
  } else {
    bodyParts.push(sections.get("Background") ?? "");
  }
  const areaIds = active ? [topicArea.get(active.topic) ?? "quantum-information"] : ["quantum-information"];
  const aliases = [slug];
  if (metadata.catalog_source_id) aliases.push(slugify(`${collection?.label ?? "catalog"}-${metadata.catalog_source_id}`));
  const problemFields: Fields = {
    id: problemId, type: "Problem", schemaVersion: "1.0", revision: 1, createdBy: INGEST, createdAt: MIGRATION_AT,
    title, role: "primary", parentProblemId: null, parentClauseId: null, aliases,
    origin: (metadata.origin?.kind ?? active?.origin?.kind ?? "source-stated"),
    posed: metadata.proposed_date ?? active?.proposed ?? null,
    areaIds, topicIds: active ? [active.topic] : [], keywords: active?.keywords ?? [],
    difficulty: "unrated", verificationCost: "unrated",
    relatedProblemIds: (active?.related ?? []).filter((r) => slugs.includes(r)).map(problemIdOf),
  };

  // Claims from progress, watch, or the solved status section.
  const claimIds: string[] = [];
  const rejectedClaims: { claimId: string; title: string; detail: string; url: string }[] = [];
  const seenUrls = new Set<string>();
  if (active) {
    active.progress.forEach((item, index) => {
      seenUrls.add(cleanUrl(item.url));
      if (isStatusReview(item.strength)) {
        referenceIds.push(reference(bundle, `progress-${index}`, progressSource(item), "problem", problemId, "survey", item.label, `${item.title}. ${item.detail}`));
        return;
      }
      const support = [{ sourceId: progressSource(item), artifactId: null, locator: item.label, date: item.date,
        maturity: /conditional/i.test(item.strength) ? "conditional" : (MATURITY[item.maturity.toLowerCase()] ?? "preprint"), strength: strengthOf(item.strength) }];
      if (isUnaccepted(item.strength)) {
        const relation = /exclud|impossib|no |cannot|disprov/i.test(`${item.title} ${item.detail}`) ? "refutes" : "resolves";
        const claimId = claim(bundle, `progress-${index}`, item.title, relation, support, item.detail);
        rejectedClaims.push({ claimId, title: item.title, detail: item.detail, url: item.url });
        return;
      }
      claimIds.push(claim(bundle, `progress-${index}`, item.title, isNarrowing(item.strength) ? "narrows" : "supports", support, item.detail));
    });
    for (const watch of active.watch ?? []) {
      const aboutClaim = /claim|recent|unreviewed/i.test(watch.label);
      if (aboutClaim && watch.url && !seenUrls.has(cleanUrl(watch.url))) {
        const sourceId = source({ title: watch.label, kind: "preprint", authors: [], venue: "", date: null, doi: doiFromUrl(watch.url), arxivId: arxivFromUrl(watch.url), url: cleanUrl(watch.url), version: null,
          body: "Imported from a legacy watch item; bibliographic details to be completed during maintenance." });
        const claimId = claim(bundle, `watch-${slugify(watch.label)}`, watch.label, "resolves",
          [{ sourceId, artifactId: null, locator: "", date: null, maturity: "preprint", strength: "unaccepted-claim" }], watch.text);
        rejectedClaims.push({ claimId, title: watch.label, detail: watch.text, url: watch.url });
      } else if (aboutClaim && watch.url) {
        const target = rejectedClaims.find((r) => cleanUrl(r.url) === cleanUrl(watch.url));
        if (target) target.detail = `${target.detail}\n\n${watch.text}`;
        else cautions.push(`**${watch.label}.** ${watch.text}`);
      } else {
        cautions.push(`**${watch.label}.** ${watch.text}`);
      }
    }
  } else {
    const status = sections.get("Status and known progress") ?? "";
    const resolutionText = status.split("\n").filter((line) => /\*\*(Status|Resolution|Concurrent|Solved)/i.test(line) || !line.startsWith("- ")).join("\n");
    const negative = /solved (negatively|in the negative)|answer is no|is false|disproved|counterexample/i.test(resolutionText) && !/solved affirmatively|solved positively/i.test(resolutionText);
    const supporters = biblio.filter((entry) => entry.surname.length >= 3 && new RegExp(`\\b${entry.surname.replace(/[^\\p{L}]/gu, "")}\\b`, "u").test(resolutionText))
      .filter((entry) => entry.sourceId !== statingSourceId);
    if (supporters.length === 0) summary.unsupportedSolved.push(slug);
    const support = supporters.map((entry) => {
      const key = [...sources.entries()].find(([, id]) => id === entry.sourceId)?.[0] ?? "";
      return { sourceId: entry.sourceId, artifactId: null, locator: "", date: null,
        maturity: key.startsWith("doi:") ? "peer-reviewed" : "preprint", strength: negative ? "counterexample" : "exact-theorem" };
    });
    claimIds.push(claim(bundle, "resolution", `Resolution of: ${title}`, negative ? "refutes" : "resolves", support, status.replace(/\*\*Last verified:\*\*.*$/su, "").trim()));
  }
  if (cautions.length) bodyParts.push(`## Cautions\n\n${cautions.map((c) => `- ${c}`).join("\n")}`);
  emit(LEDGER, `${dir}/problem.r1.md`, problemFields, bodyParts.filter(Boolean).join("\n\n"));

  // Contributions, reviews, decisions.
  const proposal = contribution(bundle, "proposal", `Migrate legacy record: ${title}`, "problem-proposal",
    { newProblemIds: [problemId], newStatementId: statementId, referenceIds },
    `Problem, statement, and references migrated from \`open_prob/${slug}\` and \`site/data/problems.js\` without semantic editing. Values the legacy record lacked were left empty.`);
  const auditLabel = reviewAt === BASELINE_AUDIT_AT ? "Baseline audit of 12 August 2026" : `Review of ${reviewAt.slice(0, 10)}`;
  const proposalReview = review(bundle, "proposal", proposal, "verified",
    [["source located", "pass", `${metadata.venue}${metadata.source_location ? `, ${metadata.source_location}` : ""}`], ["statement checked against source", "pass", "Legacy audit accepted the formalization."]],
    `${auditLabel} (STATUS_AUDIT.md): the statement is a faithful formalization of the source question.`);
  decision(bundle, "admission", EDITOR, "admission", "problem", problemId, { reviewIds: [proposalReview], effectiveAt: reviewAt }, `Admitted from the legacy catalog on the strength of the ${auditLabel.toLowerCase()}.`);
  decision(bundle, "accept-proposal", SYSTEM, "acceptance", "contribution", proposal, { verificationLevel: "human-signed", reviewIds: [proposalReview] }, "Human review on file; accepted under policy 1.");

  let evidenceReview: string | null = null;
  let evidence: string | null = null;
  if (claimIds.length > 0) {
    evidence = contribution(bundle, "evidence", `Migrate legacy evidence: ${title}`, "evidence-import",
      { problemIds: [problemId], statementId, statementDigest: bundle.digest, clauseIds: [clauseRef], claimIds },
      active ? "Progress entries from the legacy record mapped to claims with source support." : "The legacy status section mapped to a resolving claim; support lists the bibliography entries named in the resolution.");
    evidenceReview = review(bundle, "evidence", evidence, "verified",
      [["sources located", "pass", "Legacy audit checked the cited results."], ["claim scope", "pass", "Relations follow the audit's status classification."]],
      `${auditLabel} (STATUS_AUDIT.md): the cited results support the recorded status.`);
    decision(bundle, "accept-evidence", SYSTEM, "acceptance", "contribution", evidence, { verificationLevel: "human-signed", reviewIds: [evidenceReview] }, "Human review on file; accepted under policy 1.");
    summary.claims += claimIds.length;
  }
  rejectedClaims.forEach((rejected, index) => {
    const contributionId = contribution(bundle, `rejected-${index}`, `Unaccepted claim on record: ${rejected.title}`, "evidence-import",
      { problemIds: [problemId], statementId, statementDigest: bundle.digest, clauseIds: [clauseRef], claimIds: [rejected.claimId] },
      "A claimed resolution recorded so that the frontier can show it was assessed and not accepted.");
    const reviewId = review(bundle, `rejected-${index}`, contributionId, "rejected",
      [["claim assessment", "fail", rejected.detail]], `${auditLabel}: the claim was examined and not accepted. ${rejected.detail}`);
    decision(bundle, `reject-${index}`, SYSTEM, "acceptance", "contribution", contributionId, { outcome: "rejected", verificationLevel: "human-signed", reviewIds: [reviewId] }, "Human review with verdict rejected.");
    summary.rejected += 1;
  });

  const status = metadata.status === "partially_solved" ? "partial" : metadata.status;
  const statusReview = evidenceReview ?? proposalReview;
  decision(bundle, "status", status === "solved" ? EDITOR : SYSTEM, "status", "problem", problemId,
    { status, reviewIds: [statusReview], contributionIds: evidence ? [evidence] : [], effectiveAt: reviewAt },
    status === "solved" ? "The legacy audit found a proof or counterexample settling the archived statement." : status === "partial" ? "The legacy audit found a named subproblem or precise subclass settled." : "The legacy audit found no accepted proof or counterexample.");

  summary.legacy += 1;
  summary.references += referenceIds.length;
  logEvent(`Read legacy record ${slug}`, problemId, [problemId, statementId]);
}

// ---------------------------------------------------------------------------
// open_problem_v2 (55)
// ---------------------------------------------------------------------------

interface V2Entry { alpha_key: string; label: string; entry_latex: string }
interface V2 {
  problem_number: number; title: string; id: string; status: string; tags: string[];
  source: { file: string; sha256: string }; source_tex: string;
  sections: {
    problem_statement: { latex: string }; source: { latex: string; citations: { label: string; alpha_key: string }[] };
    progress: { items: { index: number; latex: string }[] }; references: { entries: V2Entry[] }; comment?: { latex: string };
  };
}
const v2List = source({
  title: "A list of open problems in quantum information and quantum computation", kind: "problem-list", authors: [],
  venue: "Repository problem pool open_problem_v2", date: "2026", doi: null, arxivId: null,
  url: "https://github.com/Naixu-Guo/quantum-open-problems/tree/main/open_problem_v2", version: null,
});
const ACCENTS: [RegExp, string][] = [
  [/\{\\'a\}|\\'a/gu, "á"], [/\{\\'e\}|\\'e/gu, "é"], [/\{\\'i\}|\\'i|\\'\\i/gu, "í"], [/\{\\'o\}|\\'o/gu, "ó"], [/\{\\'u\}|\\'u/gu, "ú"],
  [/\{\\'c\}|\\'c/gu, "ć"], [/\{\\'n\}|\\'n/gu, "ń"], [/\{\\'s\}|\\'s/gu, "ś"], [/\{\\'z\}|\\'z/gu, "ź"], [/\{\\'y\}|\\'y/gu, "ý"],
  [/\{\\"a\}|\\"a/gu, "ä"], [/\{\\"o\}|\\"o/gu, "ö"], [/\{\\"u\}|\\"u/gu, "ü"], [/\{\\"e\}|\\"e/gu, "ë"], [/\{\\"i\}|\\"i/gu, "ï"],
  [/\{\\`e\}|\\`e/gu, "è"], [/\{\\`a\}|\\`a/gu, "à"], [/\{\\\^o\}|\\\^o/gu, "ô"], [/\{\\\^e\}|\\\^e/gu, "ê"], [/\{\\~n\}|\\~n/gu, "ñ"],
  [/\{\\v\{s\}\}|\\v\{s\}/gu, "š"], [/\{\\v\{c\}\}|\\v\{c\}/gu, "č"], [/\{\\v\{z\}\}|\\v\{z\}/gu, "ž"], [/\{\\c\{c\}\}|\\c\{c\}/gu, "ç"],
  [/\{\\ss\}|\\ss\{\}|\\ss(?![a-z])/gu, "ß"], [/\{\\l\}|\\l\{\}|\\l(?![a-z])/gu, "ł"], [/\{\\o\}|\\o\{\}|\\o(?![a-z])/gu, "ø"], [/\{\\ae\}|\\ae(?![a-z])/gu, "æ"],
  [/\\&/gu, "&"], [/~/gu, " "],
];
const deaccent = (text: string) => ACCENTS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
const detex = (latex: string) => deaccent(latex.replace(/\\sourcecite\{[^}]*\}\{([^}]*)\}/gu, "[$1]").replace(/\\emph\{([^}]*)\}/gu, "*$1*").replace(/\\textbf\{([^}]*)\}/gu, "**$1**")).trim();
function v2Source(entry: V2Entry): string {
  const latex = deaccent(entry.entry_latex.replace(/%\s*\n\s*/gu, "").replace(/\s+/gu, " ").replace(/\\lq\\lq\s*/gu, "``").replace(/\s*\\rq\\rq(\{\})?/gu, "''"));
  // Title forms seen in the pool: ``title,'' then "title," then \emph{title} (books and theses).
  const quoted = latex.match(/``(.+?)''/u) ?? latex.match(/"(.{6,}?)"/u);
  const emphasized = quoted ? null : latex.match(/\\emph\{([^}]*)\}/u);
  const titleMatch = quoted ?? emphasized;
  const title = titleMatch ? titleMatch[1]!.replace(/[,.]$/u, "").trim() : latex.split("\\href")[0]!.slice(0, 160).trim();
  const titleStart = titleMatch?.index ?? latex.length;
  const before = latex.slice(0, titleStart);
  const authors = before.replace(/[,\s]+$/u, "").split(/,\s*|\s+and\s+/u).map((a) => a.trim()).filter((a) => a && !/^(and|et al\.?)$/iu.test(a));
  const after = titleMatch ? latex.slice(titleStart + titleMatch[0].length) : "";
  const venue = after.split("\\href")[0]!.replace(/\\emph\{([^}]*)\}/gu, "$1").replace(/\\textbf\{([^}]*)\}/gu, "$1").replace(/--/gu, "-").replace(/^[,\s]+|[.\s]+$/gu, "").trim();
  const doi = normalizeDoi(latex.match(/doi\.org\/([^}\s]+)/u)?.[1] ?? null);
  const arxivRaw = latex.match(/arxiv\.org\/abs\/([^}\s]+)/u)?.[1] ?? null;
  const arxivId = arxivRaw ? arxivRaw.replace(/v\d+$/u, "") : null;
  const version = arxivRaw?.match(/v(\d+)$/u)?.[1] ?? null;
  const url = doi ? `https://doi.org/${doi}` : arxivId ? `https://arxiv.org/abs/${arxivId}` : latex.match(/\\href\{([^}]+)\}/u)?.[1] ?? null;
  const date = yearOf(venue) ?? (arxivId && /^\d{4}\./.test(arxivId) ? `20${arxivId.slice(0, 2)}` : null);
  return source({ title, kind: doi ? "paper" : arxivId ? "preprint" : "paper", authors, venue, date, doi, arxivId, url, version });
}

const v2Dir = path.join(repoRoot, "open_problem_v2", "problem_pool_json");
const v2Files = fs.readdirSync(v2Dir).filter((f) => /^problem_\d+\.json$/.test(f)).sort((a, b) => Number(a.match(/\d+/)![0]) - Number(b.match(/\d+/)![0]));
for (const file of v2Files) {
  const v2 = JSON.parse(fs.readFileSync(path.join(v2Dir, file), "utf8")) as V2;
  const tex = fs.readFileSync(path.resolve(v2Dir, v2.source.file), "utf8");
  const texDigest = bytesDigest(Buffer.from(tex, "utf8"));
  if (texDigest !== `sha256:${v2.source.sha256}` || tex !== v2.source_tex) throw new Error(`${file}: TeX digest mismatch`);
  const slug = `v2-${slugify(v2.title)}`;
  const problemId = problemIdOf(slug);
  const statementId = ulid(`statement:${slug}:1`);
  const clauseRef = `${statementId}#main`;
  const dir = `problems/${slug}`;
  const bundle: Bundle = { slug, dir, problemId, statementId, clauseRef, digest: "", reviewAt: MIGRATION_AT };

  const statementBody = `## Formal statement\n\n${v2.sections.problem_statement.latex.trim()}\n`;
  bundle.digest = statementDigest(statementBody);
  const question = v2.sections.problem_statement.latex.replace(/\s+/gu, " ").trim();
  const firstSentence = question.match(/^.*?[?.](?=\s|$)/u)?.[0] ?? question;
  const kind = /^(does there exist|is there|are there|do there exist)/iu.test(question) ? "existence" : /^(for (every|all)|is every|does every)/iu.test(question) ? "universal" : /^(construct|find|give|exhibit)/iu.test(question) ? "construction" : "decision";
  emit(LEDGER, `${dir}/statements/v1.md`, {
    id: statementId, type: "Statement", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
    problemId, version: 1, digest: bundle.digest,
    clauses: [{ id: "main", label: v2.title, text: firstSentence.slice(0, 600), kind,
      resolutionCriteria: "Answer the question in the formal statement with a proof, counterexample, exact value, or construction as it requires.", supersedesClauseId: null, quantity: null }],
  }, statementBody);

  const byLabel = new Map(v2.sections.references.entries.map((entry) => [entry.label, v2Source(entry)]));
  const referenceIds: string[] = [];
  referenceIds.push(reference(bundle, "listed-in", v2List, "problem", problemId, "listed-in", v2.source.file.replace(/^\.\.\//u, ""), ""));
  v2.sections.source.citations.forEach((citation, index) => {
    const sourceId = byLabel.get(citation.label);
    if (sourceId) referenceIds.push(reference(bundle, `source-${index}`, sourceId, "problem", problemId, "states-problem", "", detex(v2.sections.source.latex)));
  });
  const uncited: string[] = [];
  for (const item of v2.sections.progress.items) {
    const labels = [...item.latex.matchAll(/\\sourcecite\{([^}]*)\}\{[^}]*\}/gu)].map((m) => m[1]!);
    const cited = labels.map((label) => byLabel.get(label)).filter((id): id is string => Boolean(id));
    if (cited.length === 0) { uncited.push(detex(item.latex)); continue; }
    cited.forEach((sourceId, index) => referenceIds.push(reference(bundle, `progress-${item.index}-${index}`, sourceId, "problem", problemId, "prior-attempt", "", detex(item.latex))));
  }
  for (const entry of v2.sections.references.entries) {
    const sourceId = byLabel.get(entry.label)!;
    const already = out.some((o) => o.fields["type"] === "Reference" && o.fields["sourceId"] === sourceId && o.fields["targetId"] === problemId);
    if (!already) referenceIds.push(reference(bundle, `ref-${entry.label}`, sourceId, "problem", problemId, "background", "", ""));
  }

  const body = [
    detex(v2.sections.source.latex),
    v2.sections.comment ? `## Comment\n\n${detex(v2.sections.comment.latex)}` : "",
    uncited.length ? `## Progress items without a cited source\n\n${uncited.map((u) => `- ${u}`).join("\n")}` : "",
    `Imported from \`open_problem_v2/problem_pool/problem_${v2.problem_number}.tex\` (source id \`${v2.id}\`, source status "${v2.status}"). Awaiting admission review.`,
  ].filter(Boolean).join("\n\n");
  emit(LEDGER, `${dir}/problem.r1.md`, {
    id: problemId, type: "Problem", schemaVersion: "1.0", revision: 1, createdBy: INGEST, createdAt: MIGRATION_AT,
    title: v2.title, role: "primary", parentProblemId: null, parentClauseId: null,
    aliases: [slug, `open-problem-v2-problem-${v2.problem_number}`, slugify(v2.id)],
    origin: "source-stated", posed: null, areaIds: ["quantum-information"], topicIds: [], keywords: v2.tags,
    difficulty: "unrated", verificationCost: "unrated", relatedProblemIds: [],
  }, body);
  contribution(bundle, "proposal", `Import open_problem_v2 record ${v2.problem_number}: ${v2.title}`, "problem-proposal",
    { newProblemIds: [problemId], newStatementId: statementId, referenceIds },
    `Imported verbatim from \`open_problem_v2/problem_pool_json/${file}\` (source id \`${v2.id}\`, TeX digest \`${texDigest}\`). Candidate until admission review; progress items were kept as references, not claims.`);
  summary.v2 += 1;
  summary.references += referenceIds.length;
  logEvent(`Imported open_problem_v2 record ${v2.id} with TeX digest ${texDigest}`, problemId, [problemId, statementId]);
}

// ---------------------------------------------------------------------------
// Ingestion trajectory and event log
// ---------------------------------------------------------------------------

const logBytes = Buffer.from(`${eventsLog.map((event) => JSON.stringify(event)).join("\n")}\n`, "utf8");
const logDigest = bytesDigest(logBytes);
const LOG_ARTIFACT = ulid("artifact:legacy-ingestion-log");
emit(ACTIVITY, `artifacts/${LOG_ARTIFACT}.md`, {
  id: LOG_ARTIFACT, type: "Artifact", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
  title: "Event log of the legacy ingestion", digest: logDigest, kind: "event-log", mediaType: "application/x-ndjson", size: logBytes.length,
  uri: `artifact-store/${logDigest.slice(7)}.jsonl`, trajectoryId: TRAJECTORY, checkable: false, checks: [],
}, "");
const allProblemIds = out.filter((o) => o.fields["type"] === "Problem").map((o) => o.fields["id"] as string);
const allDigests = [...new Set(out.filter((o) => o.fields["type"] === "Statement").map((o) => o.fields["digest"] as string))];
emit(ACTIVITY, `trajectories/${TRAJECTORY}.md`, {
  id: TRAJECTORY, type: "Trajectory", schemaVersion: "1.0", createdBy: INGEST, createdAt: MIGRATION_AT, supersedes: null,
  kind: "ingestion", actorId: INGEST, operatorId: EDITOR, problemIds: allProblemIds, statementDigests: allDigests, clauseIds: [],
  contextBundleId: null, startedAt: MIGRATION_AT, endedAt: MIGRATION_AT, harnessConfig: "tools/migrate-legacy/migrate.ts", budget: "",
  cost: { tokens: null, wallTimeSeconds: null, moneyUsd: null }, eventsArtifactId: LOG_ARTIFACT, eventCount: eventsLog.length,
  attemptReportId: null, artifactIds: [LOG_ARTIFACT], visibility: "public", embargoUntil: null,
}, "Migration of the 58 legacy catalog records and the 55 open_problem_v2 candidates into the ledger. Values absent from the legacy records were left empty; see tools/migrate-legacy/README.md for the mapping rules.");

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

for (const target of [LEDGER, ACTIVITY]) fs.rmSync(target, { recursive: true, force: true });
fs.mkdirSync(STORE, { recursive: true });
fs.writeFileSync(path.join(STORE, `${logDigest.slice(7)}.jsonl`), logBytes);
for (const record of out) {
  const file = path.join(record.root, record.rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, serializeRecord(record.fields, record.body));
}
fs.writeFileSync(path.join(LEDGER, "README.md"), `# Ledger

The main ledger of Quantum Open Problems: one text file per record, laid out as described in section 3.4 of \`docs/DESIGN.md\`.
Validate with \`node --experimental-strip-types contract/src/cli/validate.ts ledger activity\`.
Seeded on 2 September 2026 by \`tools/migrate-legacy/migrate.ts\`.
`);
fs.writeFileSync(path.join(ACTIVITY, "README.md"), `# Activity

Trajectories, artifacts, and comments. This directory stands in for the second repository described in \`docs/DESIGN.md\`; \`artifact-store/\` stands in for the object store.
`);

const counts = new Map<string, number>();
for (const record of out) counts.set(record.fields["type"] as string, (counts.get(record.fields["type"] as string) ?? 0) + 1);
console.log(`Wrote ${out.length} records to ${LEDGER} and ${ACTIVITY}`);
for (const [type, count] of [...counts].sort()) console.log(`  ${type.padEnd(13)} ${count}`);
console.log(`Legacy problems: ${summary.legacy}; v2 candidates: ${summary.v2}; accepted claims: ${summary.claims}; rejected claims on record: ${summary.rejected}; references: ${summary.references}; sources: ${sources.size}`);
if (summary.unsupportedSolved.length) console.log(`Solved problems whose resolving claim has no matched support (fill during maintenance): ${summary.unsupportedSolved.join(", ")}`);
