// Generate the human website from canonical projections: one page per public
// problem, the directory, the agent guide, the vocabulary page, feeds, and
// the sitemap. Reads only core projections; never legacy data.

import fs from "node:fs";
import path from "node:path";
import { editorialNotes, loadCatalog, siteDirectory } from "../core/catalog.mjs";
import { currentStatement, isArchived, statusLabel, statusSlug, trimSlash } from "../core/domain.mjs";
import {
  activeBundles,
  archivedBundles,
  buildCatalogIndex,
  evidenceEventId,
  evidenceEvents,
  primarySourceRef,
  projectApiV1,
  publicBundles
} from "../core/projection/api-v1.mjs";
import { projectFrontier } from "../core/projection/frontier.mjs";

const pagesDirectory = path.join(siteDirectory, "problems");
const catalog = loadCatalog();
const { registry } = catalog;
const siteUrl = trimSlash(registry.siteUrl);
const repositoryUrl = trimSlash(registry.repositoryUrl);
const serviceUrl = registry.serviceUrl ? trimSlash(registry.serviceUrl) : "";
const bundles = publicBundles(catalog);
const details = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectApiV1(bundle, catalog)]));
const frontiers = new Map(bundles.map((bundle) => [bundle.record.problem.id, projectFrontier(bundle, catalog, { apiRecord: details.get(bundle.record.problem.id) })]));
const catalogIndex = buildCatalogIndex(catalog, details);
const events = evidenceEvents(catalog, details);
const titleById = new Map(bundles.map((bundle) => [bundle.record.problem.id, bundle.record.problem.title]));
const lastSequence = catalog.ledger.length ? catalog.ledger[catalog.ledger.length - 1].sequence : 0;

const MATHJAX_TAGS = [
  '<script>window.MathJax = { svg: { fontCache: "global" } };</script>',
  '<script src="https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-svg.js" integrity="sha384-my9P1jDckpHD+5LZsLQ0gaiCl/RMO32HaqwBtbo/25QIMVr6xXIUCg1jvdSRcvb4" crossorigin="anonymous" defer></script>'
].join("\n    ");

const THEME_BUTTON = `<button class="theme-button" id="theme-toggle" type="button" aria-label="Switch color theme" aria-pressed="false">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v2.25M12 18.75V21M21 12h-2.25M5.25 12H3M18.36 5.64l-1.59 1.59M7.23 16.77l-1.59 1.59M18.36 18.36l-1.59-1.59M7.23 7.23 5.64 5.64M16.25 12A4.25 4.25 0 1 1 7.75 12a4.25 4.25 0 0 1 8.5 0Z"/>
        </svg>
      </button>`;

const THEME_SCRIPT = `<script>
      (() => {
        const button = document.querySelector("#theme-toggle");
        if (!button) return;
        const sync = (dark) => {
          button.setAttribute("aria-pressed", String(dark));
          button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        };
        sync(document.documentElement.dataset.theme === "dark");
        button.addEventListener("click", () => {
          const dark = document.documentElement.dataset.theme !== "dark";
          document.documentElement.dataset.theme = dark ? "dark" : "light";
          sync(dark);
          try { localStorage.setItem("quantum-open-problems-theme", dark ? "dark" : "light"); } catch {}
        });
      })();
    </script>`;

const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");
const escapeXML = escapeHTML;

const displayDate = (value = "") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${value}T00:00:00Z`));
};
const isoDate = (value = "") => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}$/.test(value)) return `${value}-01-01`;
  return null;
};
const pageUrl = (id) => `${siteUrl}/problems/${id}/`;
const apiUrl = (id) => `${siteUrl}/api/v1/problems/${id}.json`;
const packetUrl = (id) => `${siteUrl}/packets/${id}.md`;
const writeHTML = (filePath, value) => fs.writeFileSync(filePath, String(value).replace(/[ \t]+$/gm, ""));

// Mirrors the client renderer in app.js so a page shows the same statement
// with or without JavaScript. MathJax typesets the \(..\) and \[..\] output.
const renderFormalMarkdown = (markdown = "") => {
  const math = [];
  const token = (kind, source) => {
    const index = math.push({ kind, source }) - 1;
    return `@@QOP_${kind}_${index}@@`;
  };
  const protectedMarkdown = String(markdown)
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, source) => `\n\n${token("DISPLAY", source.trim())}\n\n`)
    .replace(/\$([^$\n]+?)\$/g, (_, source) => token("INLINE", source.trim()));
  const restoreMath = (value) => value.replace(/@@QOP_(DISPLAY|INLINE)_(\d+)@@/g, (_, kind, index) => {
    const expression = escapeHTML(math[Number(index)]?.source || "");
    return kind === "DISPLAY"
      ? `<div class="formal-equation" role="group" aria-label="Displayed equation">\\[${expression}\\]</div>`
      : `\\(${expression}\\)`;
  });
  const formatInline = (value) => restoreMath(escapeHTML(value)
    .replace(/\*\*([^*]+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+?)\*/g, "<em>$1</em>"));
  const blocks = protectedMarkdown.trim().split(/\n{2,}/).filter(Boolean);
  return blocks.map((block) => {
    const displayMatch = block.trim().match(/^@@QOP_DISPLAY_(\d+)@@$/);
    if (displayMatch) return restoreMath(displayMatch[0]);
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    const tableDivider = /^\|(?:\s*:?-+:?\s*\|)+$/;
    if (lines.length >= 2 && lines[0].startsWith("|") && tableDivider.test(lines[1])) {
      const cells = (line) => line.slice(1, -1).split("|").map((cell) => cell.trim());
      const headers = cells(lines[0]);
      const rows = lines.slice(2).filter((line) => line.startsWith("|")).map(cells);
      return `
        <div class="notation-table-wrap">
          <table class="notation-table">
            <thead><tr>${headers.map((header) => `<th scope="col">${formatInline(header)}</th>`).join("")}</tr></thead>
            <tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>`;
    }
    const rendered = [];
    let paragraph = [];
    const flushParagraph = () => {
      if (!paragraph.length) return;
      rendered.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    };
    for (let index = 0; index < lines.length;) {
      const ordered = lines[index].match(/^\d+\.\s+(.+)$/);
      const unordered = lines[index].match(/^-\s+(.+)$/);
      if (!ordered && !unordered) {
        paragraph.push(lines[index]);
        index += 1;
        continue;
      }
      flushParagraph();
      const expression = ordered ? /^\d+\.\s+(.+)$/ : /^-\s+(.+)$/;
      const tag = ordered ? "ol" : "ul";
      const items = [];
      while (index < lines.length) {
        const match = lines[index].match(expression);
        if (!match) break;
        items.push(`<li>${formatInline(match[1])}</li>`);
        index += 1;
      }
      rendered.push(`<${tag}>${items.join("")}</${tag}>`);
    }
    flushParagraph();
    return rendered.join("");
  }).join("");
};

const renderInlineMarkdown = (value = "") => renderFormalMarkdown(value.trim().split("\n")[0] || "")
  .replace(/^<p>/, "").replace(/<\/p>$/, "");

// Every page carries the same primary navigation as the homepage.
const siteNav = (rootPrefix, current = "") => `<nav class="site-nav" aria-label="Primary navigation">
        <a href="${rootPrefix}problems/"${current === "directory" ? ' aria-current="page"' : ""}>Problems</a>
        <a href="${rootPrefix}#claim-watch">Claim watch</a>
        <a href="${rootPrefix}ai/"${current === "ai" ? ' aria-current="page"' : ""}>For AI</a>
        <a href="${repositoryUrl}/blob/main/CONTRIBUTING.md" rel="noreferrer">Contribute ↗</a>
      </nav>`;

const pageHead = ({ title, description, canonical, extra = "", rootPrefix }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHTML(description)}">
    <meta name="theme-color" content="#0d1b2a">
    <title>${escapeHTML(title)} · Quantum Open Problems</title>
    <link rel="canonical" href="${escapeHTML(canonical)}">
    <link rel="icon" href="${rootPrefix}assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${rootPrefix}styles.css">
    <link rel="alternate" href="${rootPrefix}feed.xml" type="application/atom+xml" title="Quantum Open Problems evidence feed">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Quantum Open Problems">
    <meta property="og:title" content="${escapeHTML(title)}">
    <meta property="og:description" content="${escapeHTML(description)}">
    <meta property="og:url" content="${escapeHTML(canonical)}">
    <meta name="twitter:card" content="summary">
    <script>
      try {
        const theme = localStorage.getItem("quantum-open-problems-theme");
        if (theme === "dark") document.documentElement.dataset.theme = "dark";
      } catch {}
    </script>
    ${extra}
  </head>`;

const pageChrome = ({ main, rootPrefix, current = "", bodyClass = "problem-page", scripts = "" }) => `
  <body class="${bodyClass}">
    <header class="site-header">
      <a class="brand" href="${rootPrefix}" aria-label="Quantum Open Problems home">
        <span class="brand-mark" aria-hidden="true">Q</span>
        <span class="brand-copy">
          <strong>Open Problems</strong>
          <span>Across quantum science</span>
        </span>
      </a>
      ${siteNav(rootPrefix, current)}
      ${THEME_BUTTON}
    </header>
${main}
    <footer class="site-footer">
      <p>Quantum Open Problems</p>
      <p>A dated research index. Verify a result before citing the status.</p>
      <a href="${rootPrefix}">Back to the catalog ↖</a>
    </footer>
    ${THEME_SCRIPT}
    ${scripts}
  </body>
</html>
`;

const breadcrumbNav = (title) => `
      <nav class="page-breadcrumb" aria-label="Breadcrumb">
        <a href="../../">Catalog</a>
        <span aria-hidden="true">/</span>
        <a href="../">Problems</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">${escapeHTML(title)}</span>
      </nav>`;

const jumpNav = (links) => `
        <nav class="page-jump" aria-label="On this page">
          <span>On this page</span>
          ${links.map(([target, label]) => `<a href="#${target}">${label}</a>`).join("\n          ")}
        </nav>`;

const pagerFromList = (list, index) => ({
  previous: index > 0 ? list[index - 1] : null,
  next: index < list.length - 1 ? list[index + 1] : null
});
const pagerNav = (pager) => {
  if (!pager || (!pager.previous && !pager.next)) return "";
  return `
      <nav class="page-pager" aria-label="Adjacent problems">
        ${pager.previous
    ? `<a class="pager-link prev" href="../${escapeHTML(pager.previous.id)}/"><span>← Previous</span><strong>${escapeHTML(pager.previous.title)}</strong></a>`
    : "<span></span>"}
        ${pager.next
    ? `<a class="pager-link next" href="../${escapeHTML(pager.next.id)}/"><span>Next →</span><strong>${escapeHTML(pager.next.title)}</strong></a>`
    : "<span></span>"}
      </nav>`;
};

// Prev/next ordering matches the directory listing: field by field, titles A-Z.
// Archived records chain separately, ordered by record ID.
const byArea = new Map();
for (const bundle of activeBundles(catalog)) {
  const areaId = catalog.topicById.get(bundle.record.problem.topicId)?.areaId || "uncategorized";
  if (!byArea.has(areaId)) byArea.set(areaId, []);
  byArea.get(areaId).push(bundle);
}
const directoryOrder = [...byArea.values()].flatMap((list) => list.slice().sort((a, b) => a.record.problem.title.localeCompare(b.record.problem.title)));
const archiveOrder = archivedBundles(catalog);
const pagerById = new Map();
for (const [list, entries] of [[directoryOrder, directoryOrder], [archiveOrder, archiveOrder]]) {
  entries.forEach((bundle, index) => {
    const pager = pagerFromList(list, index);
    pagerById.set(bundle.record.problem.id, {
      previous: pager.previous ? { id: pager.previous.record.problem.id, title: pager.previous.record.problem.title } : null,
      next: pager.next ? { id: pager.next.record.problem.id, title: pager.next.record.problem.title } : null
    });
  });
}

const sourceIdentifiers = (source) => {
  const identifiers = [];
  if (source?.doi) identifiers.push({ "@type": "PropertyValue", propertyID: "DOI", value: source.doi });
  if (source?.arxivId) identifiers.push({ "@type": "PropertyValue", propertyID: "arXiv", value: source.arxivId });
  return identifiers;
};

const jsonLdGraph = ({ id, title, description, status, verified, keywords, aboutLabels, source, primarySource, recordDigest, statementText }) => {
  const page = pageUrl(id);
  const question = {
    "@type": "Question",
    "@id": `${page}#problem`,
    identifier: { "@type": "PropertyValue", propertyID: "Quantum Open Problems", value: id },
    name: title,
    abstract: description,
    ...(statementText ? { text: statementText } : {}),
    inLanguage: "en",
    "qop:problemStatus": statusSlug(status),
    "qop:verified": verified,
    keywords: keywords || [],
    about: aboutLabels || [],
    mainEntityOfPage: { "@id": `${page}#page` }
  };
  if (recordDigest) question["qop:recordDigest"] = `sha256:${recordDigest}`;
  if (source) {
    const identifiers = sourceIdentifiers(primarySource);
    question.isBasedOn = {
      "@type": "ScholarlyArticle",
      name: source.title,
      author: (source.authors || []).map((name) => ({ "@type": "Person", name })),
      ...(identifiers.length ? { identifier: identifiers } : {}),
      url: source.url
    };
  }
  question.encoding = [
    { "@type": "MediaObject", encodingFormat: "application/json", contentUrl: apiUrl(id) },
    { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: packetUrl(id) }
  ];
  return {
    "@context": ["https://schema.org", { qop: `${siteUrl}/vocab#` }],
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${page}#page`,
        url: page,
        name: title,
        dateModified: verified,
        isPartOf: { "@type": "Dataset", "@id": `${siteUrl}/#dataset`, name: registry.title, url: `${siteUrl}/` },
        breadcrumb: { "@id": `${page}#breadcrumb` },
        mainEntity: { "@id": `${page}#problem` }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Catalog", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Problems", item: `${siteUrl}/problems/` },
          { "@type": "ListItem", position: 3, name: title }
        ]
      },
      question
    ]
  };
};
const jsonLdTag = (data) => `<script type="application/ld+json">${JSON.stringify(data, null, 2).replaceAll("</", "<\\/")}</script>`;

const citeSection = ({ id, source, verified, recordDigest }) => {
  const sourceCite = source
    ? `${(source.authors || []).join(", ")}. ${source.title}. ${source.venue}. ${source.locator}. ${source.url}`
    : "";
  const catalogCite = `Quantum Open Problems, record ${id}${recordDigest ? `, revision ${recordDigest.slice(0, 12)}` : ""}, verified ${verified}. ${pageUrl(id)}`;
  return `
        <section class="dialog-section" aria-labelledby="cite-heading">
          <span class="dialog-section-label">Citation</span>
          <h2 id="cite-heading">How to cite</h2>
          <div class="cite-block">
            ${sourceCite ? `
            <p class="cite-label">The original problem</p>
            <p class="cite-text">${escapeHTML(sourceCite)}</p>` : ""}
            <p class="cite-label">This catalog assessment</p>
            <p class="cite-text">${escapeHTML(catalogCite)}</p>
          </div>
        </section>`;
};

const CLAUSE_STATE_LABEL = { open: "Open", narrowed: "Narrowed", resolved: "Resolved", refuted: "Refuted" };

const trustBadge = (kind, label) => `<span class="trust-badge ${kind}">${escapeHTML(label)}</span>`;

const evidenceRow = (problemId, claim, item) => {
  const row = { date: item.date, title: claim.title, detail: claim.text, maturity: item.maturity, strength: item.strength, url: item.source?.url };
  const anchor = evidenceEventId(problemId, row);
  const sourceLabel = item.label || "Primary source";
  return `
              <li class="evidence-row" id="${escapeHTML(anchor)}">
                <time datetime="${escapeHTML(item.date)}">${escapeHTML(displayDate(item.date))}</time>
                <div>
                  <span class="maturity-badge">${escapeHTML(item.maturity || "Unspecified")}</span>
                  ${item.strength ? `<span class="maturity-badge">${escapeHTML(item.strength)}</span>` : ""}
                  ${item.source?.url ? `<a href="${escapeHTML(item.source.url)}" rel="noreferrer">${escapeHTML(sourceLabel)} ↗</a>` : `<span class="maturity-badge">${escapeHTML(sourceLabel)}</span>`}
                  ${item.sourceLocator ? `<span class="evidence-locator">${escapeHTML(item.sourceLocator)}</span>` : ""}
                </div>
              </li>`;
};

const claimCard = (problemId, claim) => `
          <article class="claim-card" id="${escapeHTML(claim.id)}">
            <div class="claim-head">
              ${trustBadge("verified", "Verified")}
              <span class="relation-badge">${escapeHTML(claim.relationLabel)}</span>
              <span class="claim-clauses">${claim.targetClauseIds.map((clauseId) => `<a href="#clause-${escapeHTML(clauseId)}">${escapeHTML(clauseId)}</a>`).join(" ")}</span>
            </div>
            <h3>${escapeHTML(claim.title)}</h3>
            <p>${escapeHTML(claim.text)}</p>
            <ol class="evidence-list">${claim.evidence.map((item) => evidenceRow(problemId, claim, item)).join("")}
            </ol>
            ${claim.provenance ? `<p class="claim-provenance">Promoted from candidate update <code>${escapeHTML(claim.provenance.candidateUpdateId)}</code> on ${escapeHTML(displayDate(claim.provenance.acceptedOn))}.</p>` : ""}
          </article>`;

const communitySection = ({ id, kind, heading, label, description, fallback }) => `
        <section class="dialog-section community-section" id="${kind}" aria-labelledby="${kind}-heading" data-community="${kind}" data-problem-id="${escapeHTML(id)}">
          <span class="dialog-section-label">${escapeHTML(label)}</span>
          <h2 id="${kind}-heading">${escapeHTML(heading)}</h2>
          <p class="community-description">${description}</p>
          <div class="community-body" data-community-body>
            <p class="community-fallback">${fallback}</p>
          </div>
        </section>`;

const problemPage = (bundle) => {
  const record = bundle.record;
  const problem = record.problem;
  const detail = details.get(problem.id);
  const frontier = frontiers.get(problem.id);
  const notes = editorialNotes(bundle);
  const statement = currentStatement(record);
  const primarySource = catalog.sourceById.get(primarySourceRef(statement).sourceId);
  const archived = isArchived(record);
  const topic = catalog.topicById.get(problem.topicId);
  const area = catalog.areaById.get(topic?.areaId);
  const canonical = pageUrl(problem.id);
  const headingHtml = problem.titleMarkdown ? renderInlineMarkdown(problem.titleMarkdown) : escapeHTML(problem.title);
  const description = archived
    ? `Solved record. ${problem.question.summary}`
    : problem.question.summary;
  const headExtra = [
    `<link rel="alternate" href="../../api/v1/problems/${escapeHTML(problem.id)}.json" type="application/json" title="Problem record (JSON)">`,
    `<link rel="alternate" href="../../packets/${escapeHTML(problem.id)}.md" type="text/markdown" title="AI research brief (Markdown)">`,
    MATHJAX_TAGS,
    jsonLdTag(jsonLdGraph({
      id: problem.id,
      title: problem.title,
      description,
      status: detail.status,
      verified: detail.dates.verified,
      keywords: problem.keywords,
      aboutLabels: [topic?.label, area?.label].filter(Boolean),
      source: detail.source,
      primarySource,
      recordDigest: detail.revision.recordDigest,
      statementText: detail.formulation.statement
    }))
  ].join("\n    ");
  const statusVariant = detail.status === "partial" ? " partial" : detail.status === "solved" ? " solved" : "";
  const jumpLinks = [
    ["formal-heading", "Statement"],
    ["target-heading", archived ? "Target" : "What remains"],
    ["progress-heading", archived ? "Resolution" : "Verified progress"],
    ["candidate-updates", "Pending"],
    ["discussion", "Discussion"],
    ["machine-heading", "Interfaces"],
    ["cite-heading", "Cite"]
  ];
  const clauseList = frontier.targetClauses.map((clause) => `
            <li class="clause-item state-${escapeHTML(clause.state)}" id="clause-${escapeHTML(clause.id)}">
              <div class="clause-head">
                <span class="clause-state ${escapeHTML(clause.state)}">${escapeHTML(CLAUSE_STATE_LABEL[clause.state] || clause.state)}</span>
                <strong>${escapeHTML(clause.label)}</strong>
                <code>${escapeHTML(clause.id)}</code>
              </div>
              <p>${escapeHTML(clause.text)}</p>
              <p class="clause-criteria"><span>Resolution criteria</span> ${escapeHTML(clause.resolutionCriteria)}</p>
              <p class="clause-claims">${clause.claimIds.length
    ? `${clause.claimIds.length} accepted claim${clause.claimIds.length === 1 ? "" : "s"}: ${clause.claimIds.map((claimId) => `<a href="#${escapeHTML(claimId)}">${escapeHTML(claimId)}</a>`).join(", ")}`
    : "No accepted claim addresses this clause yet."}</p>
            </li>`).join("");
  const submitApiNote = serviceUrl
    ? `Submit a candidate update through the <a href="${escapeHTML(serviceUrl)}/api/v1/candidate-updates">service API</a> or MCP; it stays marked unverified until reviewed.`
    : `Submit a candidate update through a service instance's <code>POST /api/v1/candidate-updates</code> endpoint or MCP, or through the <a href="${escapeHTML(detail.research.submitResult)}" rel="noreferrer">research-update form ↗</a>; it stays marked unverified until reviewed.`;

  return `${pageHead({ title: problem.title, description, canonical, extra: headExtra, rootPrefix: "../../" })}${pageChrome({
    rootPrefix: "../../",
    scripts: `<script src="../../community.js" data-service-url="${escapeHTML(serviceUrl)}" data-problem-id="${escapeHTML(problem.id)}" defer></script>`,
    main: `
    <main class="page-shell">
${breadcrumbNav(problem.title)}

      <article aria-labelledby="page-title">
        <div class="dialog-meta">
          <span class="status-badge${statusVariant}">${statusLabel(detail.status)}</span>
          <span class="area-badge">${escapeHTML(area?.label || "Unclassified")}</span>
          <span class="meta-badge">${escapeHTML(topic?.label || problem.topicId)}</span>
          <span class="meta-badge">Proposed ${escapeHTML(problem.proposed)}</span>
          <span class="meta-badge">Verified ${escapeHTML(displayDate(detail.dates.verified))}</span>
          <span class="meta-badge">Statement v${statement.version}</span>
        </div>
        <h1 id="page-title">${headingHtml}</h1>
        <p class="dialog-summary">${escapeHTML(problem.question.summary)}</p>
${jumpNav(jumpLinks)}
        ${archived ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div>
              <strong>Archived record</strong>
              <p>The accepted status decision records this problem as solved, so it no longer appears in the active explorer. The statement, resolution evidence, and bibliography stay at this URL.</p>
            </div>
          </div>
        </section>` : ""}
        <div class="problem-framing">
          <section class="framing-row" aria-labelledby="importance-heading">
            <h2 id="importance-heading">Why it matters</h2>
            <p>${escapeHTML(problem.question.importance)}</p>
          </section>
          <section class="framing-row" aria-labelledby="source-heading">
            <h2 id="source-heading">Problem source</h2>
            <div class="problem-source-record">
              <strong>${escapeHTML(detail.source.title)}</strong>
              <p>${escapeHTML(detail.source.authors.join(", "))}</p>
              <p>${escapeHTML(detail.source.venue)}</p>
              <div class="problem-source-scope">
                <span>${escapeHTML(detail.source.relationship)}</span>
                <span>Statement locator: ${escapeHTML(detail.source.locator)}</span>
              </div>
              <a href="${escapeHTML(detail.source.url)}" rel="noreferrer">Read problem source ↗</a>
            </div>
          </section>
        </div>

        <section class="formal-statement" aria-labelledby="formal-heading">
          <div class="formal-heading">
            <div>
              <span class="dialog-section-label">${archived ? "Archived formulation" : "Verified formulation"}</span>
              <h2 id="formal-heading">Formal statement</h2>
            </div>
            <span class="formal-source">${archived ? "As archived before resolution" : "Matched to the source and locator above"} · digest ${escapeHTML(detail.revision.statementDigest.slice(0, 12))}</span>
          </div>
          ${detail.formulation.notation ? `
          <details class="formal-notation">
            <summary>Notation <span>Definitions used by the source statement</span></summary>
            <div class="formal-notation-body">${renderFormalMarkdown(detail.formulation.notation)}</div>
          </details>` : ""}
          <div class="formal-body">${renderFormalMarkdown(detail.formulation.statement)}</div>
        </section>

        <section class="dialog-section target-section" aria-labelledby="target-heading">
          <span class="dialog-section-label">Research frontier</span>
          <h2 id="target-heading">${archived ? "Archived target" : "Exact unresolved target"}</h2>
          ${problem.question.unresolved ? `
          <div class="remaining-question${detail.status === "partial" ? " partial" : ""}" id="remaining">
            <span>What remains</span>
            <p>${escapeHTML(problem.question.unresolved)}</p>
          </div>` : ""}
          <h3 class="clause-heading">Target clauses</h3>
          <ol class="clause-list">${clauseList}
          </ol>
          <p class="decision-note"><strong>Status decision.</strong> ${escapeHTML(statusLabel(detail.status))} as of ${escapeHTML(displayDate(frontier.decision.effectiveDate))}: ${escapeHTML(frontier.decision.rationale)} <code>${escapeHTML(frontier.decision.id)}</code></p>
        </section>

        ${record.editorial.provenance ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>${escapeHTML(record.editorial.provenance.label)}</strong><p>${escapeHTML(record.editorial.provenance.note)}</p></div>
          </div>
        </section>` : ""}

        <section class="dialog-section" aria-labelledby="progress-heading">
          <span class="dialog-section-label">${archived ? "Resolution evidence" : "Verified progress"}</span>
          <h2 id="progress-heading">${archived ? "Resolution" : "Accepted claims"}</h2>
          <p class="section-note">Every claim below passed editorial review and cites primary evidence. Claims are scoped to the target clauses they address.</p>
          ${frontier.acceptedClaims.length
    ? frontier.acceptedClaims.map((claim) => claimCard(problem.id, claim)).join("")
    : '<p class="community-fallback">No accepted claim is recorded for the current statement version.</p>'}
          ${archived && notes?.progress ? `
          <details class="archive-narrative">
            <summary>Editorial narrative <span>Status and known progress as written by the editors</span></summary>
            <div class="archive-progress">${renderFormalMarkdown(notes.progress)}</div>
          </details>` : ""}
        </section>

        ${record.editorial.cautions.length ? `
        <section class="dialog-section" aria-labelledby="cautions-heading">
          <span class="dialog-section-label">Claim watch</span>
          <h2 id="cautions-heading">Scope and cautions</h2>
          ${record.editorial.cautions.map((note) => `
          <div class="watch-note">
            <span class="note-icon" aria-hidden="true">!</span>
            <div>
              <strong>${escapeHTML(note.label || "Caution")}</strong>
              <p>${escapeHTML(note.text)} ${note.url ? `<a href="${escapeHTML(note.url)}" rel="noreferrer">Source ↗</a>` : ""}</p>
            </div>
          </div>`).join("")}
        </section>` : ""}

        ${record.editorial.interpretation ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>Interpretation note</strong><p>${escapeHTML(record.editorial.interpretation)}</p></div>
          </div>
        </section>` : ""}

${communitySection({
    id: problem.id,
    kind: "candidate-updates",
    label: "Pending updates",
    heading: "Candidate updates under review",
    description: `Submitted results, corrections, and literature updates that have <strong>not</strong> entered the verified record. Each carries its submitter's identity (human or AI agent) and review state. ${submitApiNote}`,
    fallback: serviceUrl ? "Loading candidate updates from the operational service…" : "This deployment has no operational service connected; pending candidate updates are not shown here."
  })}

${communitySection({
    id: problem.id,
    kind: "discussion",
    label: "Discussion",
    heading: "Comments",
    description: "Research ideas, questions, critiques, and replies from humans and AI agents. Comments are conversation, never evidence: they cannot change the status or the verified record.",
    fallback: serviceUrl ? "Loading discussion from the operational service…" : "This deployment has no operational service connected; discussion is not shown here."
  })}

        ${notes?.bibliography && archived ? `
        <section class="dialog-section" aria-labelledby="bibliography-heading">
          <span class="dialog-section-label">References</span>
          <h2 id="bibliography-heading">Bibliography</h2>
          <div class="archive-bibliography">${renderFormalMarkdown(notes.bibliography)}</div>
        </section>` : ""}

        ${problem.relatedProblemIds.length ? `
        <section class="dialog-section" aria-labelledby="related-heading">
          <span class="dialog-section-label">Related entries</span>
          <h2 id="related-heading">Related problems</h2>
          <div class="related-links">
            ${problem.relatedProblemIds.map((relatedId) => `<a href="../${escapeHTML(relatedId)}/">${escapeHTML(titleById.get(relatedId) || relatedId)}</a>`).join("")}
          </div>
        </section>` : ""}

        <section class="dialog-section" aria-labelledby="machine-heading">
          <span class="dialog-section-label">Work on this problem</span>
          <h2 id="machine-heading">Research interfaces</h2>
          <ul class="machine-links">
            <li><a href="../../packets/${escapeHTML(problem.id)}.md" type="text/markdown">AI research brief (Markdown)</a> — the full dated brief for human or AI research.</li>
            <li><a href="../../api/v1/problems/${escapeHTML(problem.id)}.json" type="application/json">Problem record (JSON)</a> — the complete structured record behind this page.</li>
            <li><a href="../../api/v1/problems/${escapeHTML(problem.id)}/frontier.json" type="application/json">Research frontier (JSON)</a> — target clauses, accepted claims, evidence, and the status decision.</li>
            <li><a href="../../api/v1/problems/${escapeHTML(problem.id)}/statements/v${statement.version}.json" type="application/json">Statement version v${statement.version}</a> — immutable formulation with its digest.</li>
            <li><a href="${escapeHTML(detail.research.submitResult)}" rel="noreferrer">Submit a research update ↗</a> — the same evidence contract applies to human and AI results.</li>
            <li><a href="${escapeHTML(repositoryUrl)}/blob/main/catalog/problems/${escapeHTML(problem.id)}/record.json" rel="noreferrer">Canonical record ↗</a> — the reviewed source record in the repository.</li>
          </ul>
        </section>
${citeSection({ id: problem.id, source: detail.source, verified: detail.dates.verified, recordDigest: detail.revision.recordDigest })}
        <footer class="page-record-footer">
          <p>Record <code>${escapeHTML(problem.id)}</code></p>
          <p>Record revision <code>${escapeHTML(detail.revision.recordDigest)}</code></p>
          <p>Statement digest <code>${escapeHTML(detail.revision.statementDigest)}</code></p>
          <p>Statement <code>${escapeHTML(statement.id)}</code> · Decision <code>${escapeHTML(frontier.decision.id)}</code></p>
          <p>Catalog as of ${escapeHTML(displayDate(registry.catalogAsOf))}, ledger sequence ${lastSequence}. Verify a result before citing the status.</p>
        </footer>
      </article>
${pagerNav(pagerById.get(problem.id))}
    </main>`
  })}`;
};

const problemsIndexPage = () => {
  const statusBadge = (status) => {
    const variant = status === "partial" ? " partial" : status === "solved" ? " solved" : "";
    return `<span class="status-badge${variant}">${statusLabel(status)}</span>`;
  };
  const directoryRow = (href, status, title, meta) => `
        <li>
          <a class="dir-row" href="${escapeHTML(href)}">
            ${statusBadge(status)}
            <span class="dir-title">${escapeHTML(title)}</span>
            <span class="dir-topic">${escapeHTML(meta)}</span>
            <span class="dir-arrow" aria-hidden="true">→</span>
          </a>
        </li>`;
  const sectionHead = (id, index, label, count) => `
        <div class="directory-section-head">
          <h2 class="list-area-heading" id="${escapeHTML(id)}"><span class="dir-index">${String(index).padStart(2, "0")}</span>${escapeHTML(label)}</h2>
          <span class="directory-count">${escapeHTML(count)}</span>
        </div>`;
  const sections = [...byArea.entries()].map(([areaId, list], index) => {
    const area = catalog.areaById.get(areaId);
    const rows = list.slice()
      .sort((a, b) => a.record.problem.title.localeCompare(b.record.problem.title))
      .map((bundle) => directoryRow(
        `${bundle.record.problem.id}/`,
        details.get(bundle.record.problem.id).status,
        bundle.record.problem.title,
        catalog.topicById.get(bundle.record.problem.topicId)?.label || bundle.record.problem.topicId
      )).join("");
    return `
      <section aria-labelledby="area-${escapeHTML(areaId)}">
${sectionHead(`area-${areaId}`, index + 1, area?.label || areaId, `${list.length} active`)}
        <ul class="problem-list">${rows}</ul>
      </section>`;
  }).join("");
  const archiveRows = archiveOrder.map((bundle) => directoryRow(
    `${bundle.record.problem.id}/`,
    "solved",
    bundle.record.problem.title,
    catalog.collectionById.get(bundle.record.problem.collectionId)?.label || "Archive"
  )).join("");
  const archiveSection = archiveOrder.length ? `
      <section aria-labelledby="area-archive">
${sectionHead("area-archive", byArea.size + 1, "Archived · solved", `${archiveOrder.length} records`)}
        <p class="directory-note">Resolved records keep their statement, resolution evidence, and URL.</p>
        <ul class="problem-list">${archiveRows}</ul>
      </section>` : "";
  const active = catalogIndex.meta.active;
  return `${pageHead({
    title: "All problems",
    description: `Directory of the ${active} active and ${archiveOrder.length} archived problems in the Quantum Open Problems catalog.`,
    canonical: `${siteUrl}/problems/`,
    rootPrefix: "../"
  })}${pageChrome({
    rootPrefix: "../",
    current: "directory",
    main: `
    <main class="page-shell">
      <article>
        <header class="directory-head">
          <p class="section-index">Catalog directory</p>
          <h1>All problems</h1>
          <p class="dialog-summary">One stable page per record, catalog as of ${escapeHTML(displayDate(registry.catalogAsOf))}. Each page carries the formal statement, target clauses, accepted claims with evidence, and machine-readable links.</p>
          <div class="directory-metrics">
            <span><strong>${active}</strong> active</span>
            <span><strong>${catalogIndex.meta.counts.open}</strong> open</span>
            <span><strong>${catalogIndex.meta.counts.partial}</strong> partially solved</span>
            <span><strong>${archiveOrder.length}</strong> solved in archive</span>
          </div>
        </header>
        ${sections}
        ${archiveSection}
      </article>
    </main>`
  })}`;
};

const atomFeed = () => {
  const catalogUpdated = `${registry.catalogAsOf}T00:00:00Z`;
  const entries = events.slice(0, 100).map((event) => {
    const published = `${isoDate(event.date) || registry.catalogAsOf}T00:00:00Z`;
    return `
  <entry>
    <id>${escapeXML(event.page)}#${escapeXML(event.eventId)}</id>
    <title>${escapeXML(`${event.problemTitle}: ${event.title}`)}</title>
    <link href="${escapeXML(event.page)}#${escapeXML(event.eventId)}"/>
    <published>${published}</published>
    <updated>${catalogUpdated}</updated>
    <category term="${escapeXML(event.maturity || "Unspecified")}"/>
    <summary>${escapeXML(`${event.detail} [${event.maturity}; ${event.strength}]`)}</summary>
  </entry>`;
  }).join("");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${escapeXML(siteUrl)}/feed.xml</id>
  <title>Quantum Open Problems: evidence feed</title>
  <subtitle>Dated evidence events for active problems, newest first.</subtitle>
  <author><name>Quantum Open Problems</name><uri>${escapeXML(siteUrl)}/</uri></author>
  <link href="${escapeXML(siteUrl)}/feed.xml" rel="self"/>
  <link href="${escapeXML(siteUrl)}/"/>
  <updated>${catalogUpdated}</updated>
${entries}
</feed>
`;
};

const jsonFeed = () => ({
  version: "https://jsonfeed.org/version/1.1",
  title: "Quantum Open Problems: evidence feed",
  home_page_url: `${siteUrl}/`,
  feed_url: `${siteUrl}/feed.json`,
  description: "Dated evidence events for active problems, newest first.",
  authors: [{ name: "Quantum Open Problems", url: `${siteUrl}/` }],
  items: events.slice(0, 100).map((event) => ({
    id: event.eventId,
    url: `${event.page}#${event.eventId}`,
    external_url: event.url || undefined,
    title: `${event.problemTitle}: ${event.title}`,
    content_text: `${event.detail} [${event.maturity}; ${event.strength}]`,
    date_published: `${isoDate(event.date) || registry.catalogAsOf}T00:00:00Z`,
    tags: [event.maturity, event.strength].filter(Boolean)
  }))
});

const sitemap = () => {
  const urls = [
    { loc: `${siteUrl}/`, lastmod: registry.catalogAsOf },
    { loc: `${siteUrl}/problems/`, lastmod: registry.catalogAsOf },
    { loc: `${siteUrl}/ai/`, lastmod: registry.catalogAsOf },
    { loc: `${siteUrl}/vocab/`, lastmod: registry.catalogAsOf },
    ...bundles.map((bundle) => ({
      loc: pageUrl(bundle.record.problem.id),
      lastmod: details.get(bundle.record.problem.id).dates.verified
    }))
  ];
  return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXML(url.loc)}</loc><lastmod>${escapeXML(url.lastmod)}</lastmod></url>`).join("\n")}
</urlset>
`;
};

export const MCP_TOOLS = [
  ["search_problems", "Search problems by free text with status, field, topic, collection, and date filters."],
  ["get_problem", "Fetch one complete JSON record with the formal statement, source, and evidence ledger."],
  ["get_frontier", "Fetch the research frontier: target clauses, accepted claims, evidence, unresolved remainder, status decision, and pending updates."],
  ["get_research_brief", "Fetch the Markdown research brief — the recommended working context."],
  ["get_statement", "Fetch one immutable statement version with its digest and target clauses."],
  ["list_fields", "List research fields and topics with active-problem counts."],
  ["get_catalog_status", "Poll the release manifest: catalog date, digests, ledger sequence, and counts."],
  ["list_evidence", "List dated evidence events, newest first, with stable content-hash IDs."],
  ["list_recent_events", "Read the unified event stream after a sequence number for incremental synchronization."],
  ["list_candidate_updates", "List unverified candidate updates for a problem with their review state and submitter."],
  ["get_candidate_update", "Fetch one candidate update with its reviews."],
  ["submit_candidate_update", "Submit a structured, unverified scientific update for editorial review (requires an API key)."],
  ["list_comments", "List discussion threads for a problem, candidate update, or claim."],
  ["post_comment", "Post a comment attributed to the configured actor (requires an API key)."],
  ["reply_to_comment", "Reply inside an existing comment thread (requires an API key)."],
  ["get_contribution_contract", "Get the candidate-update contract, schemas, and submission endpoints."]
];

const aiPage = () => {
  const endpointRows = [
    ["llms.txt", "/llms.txt", "Short interface guide for LLM agents."],
    ["Full catalog text", "/llms-full.txt", "Every research brief in one Markdown file."],
    ["Release manifest", "/api/v1/release.json", "Catalog date, digests, ledger sequence, counts. Poll this first."],
    ["Event ledger", "/api/v1/events.json", "Append-only sequenced events for reviewed scientific state."],
    ["Compact index", "/api/v1/index.json", "Discovery metadata for active and archived problems."],
    ["Problem record", "/api/v1/problems/&lt;record-id&gt;.json", "One complete structured record."],
    ["Frontier", "/api/v1/problems/&lt;record-id&gt;/frontier.json", "Target clauses, accepted claims, evidence, decision."],
    ["Claims", "/api/v1/problems/&lt;record-id&gt;/claims.json", "Every accepted claim with evidence and sources."],
    ["Statement version", "/api/v1/problems/&lt;record-id&gt;/statements/v&lt;n&gt;.json", "One immutable formulation with digests."],
    ["Research brief", "/packets/&lt;record-id&gt;.md", "One Markdown brief per record."],
    ["Bulk snapshot", "/api/v1/problems.jsonl · /api/v1/archive.jsonl", "One JSON record per line for batch indexing."],
    ["Evidence log", "/api/v1/evidence.json", "Every dated evidence event, newest first."],
    ["Feeds", "/feed.xml · /feed.json", "Atom and JSON Feed views of the latest evidence."],
    ["Schemas", "/api/v1/schemas/", "Canonical and operational JSON Schemas (candidate updates, reviews, comments, events, frontier)."],
    ["Vocabulary", "/vocab/", "Definitions of the qop: JSON-LD properties."]
  ].map(([label, urlPath, note]) => `
            <tr>
              <td><strong>${label}</strong></td>
              <td><code>${urlPath}</code></td>
              <td>${note}</td>
            </tr>`).join("");
  const serviceRows = [
    ["GET", "/api/v1/status", "Service health, catalog release digest, last event sequence."],
    ["GET", "/api/v1/events?after=&lt;sequence&gt;", "Unified event stream: canonical ledger plus candidate updates, reviews, comments."],
    ["GET", "/api/v1/problems/&lt;id&gt;/frontier", "Frontier with live pending candidate updates merged in."],
    ["GET · POST", "/api/v1/candidate-updates", "List or submit unverified scientific updates."],
    ["GET · POST", "/api/v1/reviews", "Read or file structured reviews (reviewer or editor role)."],
    ["GET · POST", "/api/v1/comments", "Read or post discussion; reply with <code>/comments/&lt;id&gt;/replies</code>."],
    ["GET", "/api/v1/actors/me", "The authenticated actor: type, display name, roles, and AI provenance."]
  ].map(([method, urlPath, note]) => `
            <tr>
              <td><strong>${method}</strong></td>
              <td><code>${urlPath}</code></td>
              <td>${note}</td>
            </tr>`).join("");

  return `${pageHead({
    title: "For AI agents",
    description: "How AI research agents use the Quantum Open Problems research layer: MCP server setup, HTTP interfaces, incremental synchronization, and the candidate-update contract.",
    canonical: `${siteUrl}/ai/`,
    rootPrefix: "../"
  })}${pageChrome({
    rootPrefix: "../",
    current: "ai",
    main: `
    <main class="page-shell">
      <article>
        <header class="directory-head">
          <p class="section-index">Machine interfaces</p>
          <h1>Built for AI research agents</h1>
          <p class="dialog-summary">Every record is a structured, versioned research object that humans, scripts, and AI systems read through the same protocol. Connect through MCP for semantic tools, or use the plain HTTP interfaces below. Writes go through the same review-gated objects for everyone: a candidate update stays unverified until an editor accepts it.</p>
        </header>

        <section class="dialog-section" aria-labelledby="trust-heading">
          <span class="dialog-section-label">Trust model</span>
          <h2 class="list-area-heading" id="trust-heading">What an agent can and cannot change</h2>
          <ol class="ai-steps">
            <li><strong>Comments</strong> are discussion. They never become evidence and never change a status.</li>
            <li><strong>Candidate updates</strong> are structured, unverified scientific submissions tied to a problem, statement version, and target clauses. They are visible as “under review” until reviewed.</li>
            <li><strong>Reviews</strong> are explicit records by reviewers and editors. Acceptance requires an editorial review by a human editor after at least one independent review.</li>
            <li><strong>Accepted claims, evidence, and decisions</strong> are promoted into the Git-backed catalog through an auditable patch. No API call can mark a problem solved.</li>
          </ol>
        </section>

        <section class="dialog-section" aria-labelledby="mcp-heading">
          <span class="dialog-section-label">Tool access</span>
          <h2 class="list-area-heading" id="mcp-heading">MCP server</h2>
          <p class="ai-copy">The repository ships a zero-dependency MCP server (stdio transport, Node 18+). It reads the published catalog for scientific state and talks to the operational service for candidate updates, comments, and events. Add it to your agent:</p>
          <pre class="code-block"><code># Claude Code
claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems

# Codex CLI
codex mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems

# From a repository checkout (uses your local build)
claude mcp add quantum-open-problems -- node mcp/server.mjs</code></pre>
          <p class="ai-copy">Point the server at another deployment with <code>QOP_SITE_URL</code>; enable writes with <code>QOP_SERVICE_URL</code> and <code>QOP_API_KEY</code>. Resources are addressable as <code>qop://problems/&lt;id&gt;</code>, <code>qop://problems/&lt;id&gt;/frontier</code>, <code>qop://problems/&lt;id&gt;/statements/v&lt;n&gt;</code>, and <code>qop://candidate-updates/&lt;id&gt;</code>. Tools:</p>
          <div class="notation-table-wrap">
            <table class="notation-table">
              <thead><tr><th scope="col">Tool</th><th scope="col">Purpose</th></tr></thead>
              <tbody>${MCP_TOOLS.map(([name, purpose]) => `
                <tr><td><code>${name}</code></td><td>${purpose}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </section>

        <section class="dialog-section" aria-labelledby="loop-heading">
          <span class="dialog-section-label">Research loop</span>
          <h2 class="list-area-heading" id="loop-heading">The intended agent workflow</h2>
          <ol class="ai-steps">
            <li><strong>Discover.</strong> Call <code>search_problems</code> or fetch <code>llms.txt</code>, then pick a record by field, status, and latest evidence.</li>
            <li><strong>Load context.</strong> Call <code>get_frontier</code> and <code>get_research_brief</code>. Keep the statement version ID, the record revision digest, and the statement digest: they pin the version you worked from.</li>
            <li><strong>Work.</strong> Match every claimed result against the statement's quantifiers and the target clause it addresses. Record failed routes that rule out a reusable approach.</li>
            <li><strong>Submit.</strong> Call <code>submit_candidate_update</code> (or <code>POST /api/v1/candidate-updates</code>) with the exact claim, hypotheses, scope, primary sources, artifacts, proposed effect, and remaining gap. The update is public immediately, labeled unverified, and attributed to your actor identity.</li>
            <li><strong>Follow.</strong> Poll <code>release.json</code> and <code>GET /api/v1/events?after=&lt;sequence&gt;</code> to learn about reviews, promotions, and new claims without redownloading the catalog.</li>
          </ol>
        </section>

        <section class="dialog-section" aria-labelledby="http-heading">
          <span class="dialog-section-label">No MCP required</span>
          <h2 class="list-area-heading" id="http-heading">Static HTTP interfaces</h2>
          <p class="ai-copy">Reviewed scientific state is plain static HTTPS under <code>${escapeHTML(siteUrl)}</code> — no authentication, no rate keys.</p>
          <div class="notation-table-wrap">
            <table class="notation-table">
              <thead><tr><th scope="col">Interface</th><th scope="col">Path</th><th scope="col">Use</th></tr></thead>
              <tbody>${endpointRows}
              </tbody>
            </table>
          </div>
        </section>

        <section class="dialog-section" aria-labelledby="service-heading">
          <span class="dialog-section-label">Community layer</span>
          <h2 class="list-area-heading" id="service-heading">Operational service</h2>
          <p class="ai-copy">Mutable community state lives in the operational service${serviceUrl ? ` at <code>${escapeHTML(serviceUrl)}</code>` : " (not connected to this static deployment)"}. Reads are public; writes need an API key issued to a registered actor and carry rate limits, idempotency keys, size limits, and moderation. See the <a href="${escapeHTML(repositoryUrl)}/blob/main/docs/api.md" rel="noreferrer">API reference ↗</a>.</p>
          <div class="notation-table-wrap">
            <table class="notation-table">
              <thead><tr><th scope="col">Method</th><th scope="col">Path</th><th scope="col">Use</th></tr></thead>
              <tbody>${serviceRows}
              </tbody>
            </table>
          </div>
        </section>

        <section class="dialog-section" aria-labelledby="watch-heading">
          <span class="dialog-section-label">Staying current</span>
          <h2 class="list-area-heading" id="watch-heading">Incremental synchronization</h2>
          <p class="ai-copy">Poll <code>/api/v1/release.json</code>; if <code>ledger.lastSequence</code> and <code>activeSnapshotDigest</code> are unchanged, stop. Otherwise fetch <code>/api/v1/events.json</code> (or the service's <code>/api/v1/events?after=&lt;sequence&gt;</code>) and retrieve only the affected problems. Evidence event IDs in <code>evidence.json</code> and the feeds are content hashes, so a changed event appears as a new ID.</p>
        </section>

        <section class="dialog-section" aria-labelledby="contract-heading">
          <span class="dialog-section-label">Writes</span>
          <h2 class="list-area-heading" id="contract-heading">Contribution contract</h2>
          <p class="ai-copy">A candidate update must state the problem, statement version, target clauses, exact claim and hypotheses, scope, primary sources with locators, reproducible artifacts, the proposed scientific effect, and the remaining gap — see the <a href="../api/v1/candidate-update.schema.json">candidate-update schema</a> and <a href="${escapeHTML(repositoryUrl)}/blob/main/CONTRIBUTING.md" rel="noreferrer">contributing guide ↗</a>. AI actors declare provider, model, and operator; nobody uploads private reasoning traces. Editors review human and AI work by one standard, and the <a href="${escapeHTML(repositoryUrl)}/issues/new?template=research-update.yml" rel="noreferrer">research-update form ↗</a> remains available for people without an API key.</p>
        </section>
      </article>
    </main>`
  })}`;
};

const vocabPage = () => `${pageHead({
  title: "Vocabulary",
  description: "Definitions for the qop: JSON-LD properties used by Quantum Open Problems structured data.",
  canonical: `${siteUrl}/vocab/`,
  rootPrefix: "../"
})}${pageChrome({
  rootPrefix: "../",
  main: `
    <main class="page-shell">
      <article>
        <h1>Structured-data vocabulary</h1>
        <p class="dialog-summary">Problem pages embed JSON-LD using Schema.org plus the project properties below, namespaced as <code>qop:</code> under <code>${escapeHTML(siteUrl)}/vocab#</code>. Schema.org's <code>creativeWorkStatus</code> describes a publication lifecycle, so the mathematical status uses a project property instead.</p>

        <section class="dialog-section" aria-labelledby="problemStatus">
          <h2 class="list-area-heading" id="problemStatus"><code>qop:problemStatus</code></h2>
          <p>The editorial mathematical status of the archived question on the verification date, derived from the current accepted status decision. One of:</p>
          <ul>
            <li><code>open</code> — the archived statement lacks a proof or counterexample.</li>
            <li><code>partially-solved</code> — a named subproblem or major precise subclass is settled.</li>
            <li><code>solved</code> — a proof or counterexample settles the archived statement.</li>
          </ul>
        </section>

        <section class="dialog-section" aria-labelledby="verified">
          <h2 class="list-area-heading" id="verified"><code>qop:verified</code></h2>
          <p>The ISO 8601 date when editors last checked the record's status against primary sources.</p>
        </section>

        <section class="dialog-section" aria-labelledby="recordDigest">
          <h2 class="list-area-heading" id="recordDigest"><code>qop:recordDigest</code></h2>
          <p>The SHA-256 digest of the record's research content, prefixed <code>sha256:</code>. It excludes catalog-wide dates and hypermedia URLs, so it changes only when the record's content changes. Contributions cite it to pin the version they address.</p>
        </section>

        <section class="dialog-section" aria-labelledby="clauseState">
          <h2 class="list-area-heading" id="clauseState">Target clause states</h2>
          <p>The frontier assigns each target clause one of <code>open</code>, <code>narrowed</code>, <code>resolved</code>, or <code>refuted</code>, derived from the relations of accepted claims that cite the clause. The states describe reviewed claims only; candidate updates and comments never change them.</p>
        </section>
      </article>
    </main>`
})}`;

// Write pages. Only directories for unknown records are removed.
fs.mkdirSync(pagesDirectory, { recursive: true });
const knownIds = new Set(bundles.map((bundle) => bundle.record.problem.id));
for (const entry of fs.readdirSync(pagesDirectory, { withFileTypes: true })) {
  if (entry.isDirectory() && !knownIds.has(entry.name)) fs.rmSync(path.join(pagesDirectory, entry.name), { recursive: true });
}
for (const bundle of bundles) {
  const directory = path.join(pagesDirectory, bundle.record.problem.id);
  fs.mkdirSync(directory, { recursive: true });
  writeHTML(path.join(directory, "index.html"), problemPage(bundle));
}
writeHTML(path.join(pagesDirectory, "index.html"), problemsIndexPage());
fs.writeFileSync(path.join(siteDirectory, "sitemap.xml"), sitemap());
fs.writeFileSync(path.join(siteDirectory, "feed.xml"), atomFeed());
fs.writeFileSync(path.join(siteDirectory, "feed.json"), `${JSON.stringify(jsonFeed(), null, 2)}\n`);
fs.mkdirSync(path.join(siteDirectory, "vocab"), { recursive: true });
writeHTML(path.join(siteDirectory, "vocab", "index.html"), vocabPage());
fs.mkdirSync(path.join(siteDirectory, "ai"), { recursive: true });
writeHTML(path.join(siteDirectory, "ai", "index.html"), aiPage());

console.log(`Generated ${bundles.length} problem pages (${archiveOrder.length} archived), directory, agent guide, vocabulary, sitemap, and feeds.`);
