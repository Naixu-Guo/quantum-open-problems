import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const sourceDirectory = path.join(repositoryRoot, "open_prob");
const dataDirectory = path.join(siteDirectory, "data");
const packetsDirectory = path.join(siteDirectory, "packets");
const pagesDirectory = path.join(siteDirectory, "problems");
const apiDirectory = path.join(siteDirectory, "api", "v1");
const sandbox = { window: {} };

for (const filename of ["problems.js", "formal-statements.js", "problem-sources.js", "catalog-index.js"]) {
  const filePath = path.join(dataDirectory, filename);
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
}

const catalog = sandbox.window.QUANTUM_OPEN_PROBLEMS;
const formalStatements = sandbox.window.QUANTUM_FORMAL_STATEMENTS;
const problemSources = sandbox.window.QUANTUM_PROBLEM_SOURCES;
const catalogIndex = sandbox.window.QUANTUM_CATALOG_INDEX;
const compactById = new Map(catalogIndex.problems.map((problem) => [problem.id, problem]));
const areaById = new Map(catalog.taxonomy.areas.map((area) => [area.id, area]));
const topicById = new Map(catalog.taxonomy.topics.map((topic) => [topic.id, topic]));
const collectionById = new Map(catalog.collections.map((collection) => [collection.id, collection]));
const siteUrl = String(catalog.meta.siteUrl).replace(/\/$/, "");
const repositoryUrl = String(catalog.meta.repositoryUrl).replace(/\/$/, "");
const titleById = new Map(catalog.problems.map((problem) => [problem.id, problem.title]));
const activeIds = new Set(catalog.problems.map((problem) => problem.id));

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

// Every page carries the same primary navigation as the homepage:
// real destinations, not homepage scroll anchors.
const siteNav = (rootPrefix, current = "") => `<nav class="site-nav" aria-label="Primary navigation">
        <a href="${rootPrefix}problems/"${current === "directory" ? ' aria-current="page"' : ""}>Problems</a>
        <a href="${rootPrefix}#claim-watch">Claim watch</a>
        <a href="${rootPrefix}ai/"${current === "ai" ? ' aria-current="page"' : ""}>For AI</a>
        <a href="${repositoryUrl}/blob/main/CONTRIBUTING.md" rel="noreferrer">Contribute ↗</a>
      </nav>`;

const statusLabel = (status) => {
  if (status === "partial" || status === "partially_solved") return "Partially solved";
  if (status === "solved") return "Solved";
  return "Open";
};
const statusSlug = (status) => {
  if (status === "partial" || status === "partially_solved") return "partially-solved";
  return status;
};
const pageUrl = (id) => `${siteUrl}/problems/${id}/`;
const apiUrl = (id) => `${siteUrl}/api/v1/problems/${id}.json`;
const packetUrl = (id) => `${siteUrl}/packets/${id}.md`;
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const writeHTML = (filePath, value) => fs.writeFileSync(
  filePath,
  String(value).replace(/[ \t]+$/gm, "")
);

const contributionUrl = (problem) => {
  const url = new URL(`${repositoryUrl}/issues/new`);
  url.searchParams.set("template", "research-update.yml");
  url.searchParams.set("title", `[Research update] ${problem.title}`);
  return url.href;
};

const escapeHTML = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const escapeXML = escapeHTML;

const displayDate = (value = "") => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T00:00:00Z`));
};

const isoDate = (value = "") => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (/^\d{4}$/.test(value)) return `${value}-01-01`;
  return null;
};

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

const plainText = (markdown = "") => String(markdown)
  .replace(/\$\$[\s\S]*?\$\$/g, " ")
  .replace(/\$[^$\n]*\$/g, " ")
  .replaceAll("**", "")
  .replaceAll("*", "")
  .replace(/\s+/g, " ")
  .trim();

const truncateAtWord = (value = "", limit = 240) => value.length <= limit
  ? value
  : `${value.slice(0, limit).replace(/\s+\S*$/, "")}…`;

const extractSection = (markdown, heading) => {
  const marker = `## ${heading}\n`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const body = markdown.slice(start + marker.length);
  const end = body.search(/^## /m);
  return (end < 0 ? body : body.slice(0, end)).trim();
};

const readMetadata = (id) => {
  const metadataPath = path.join(sourceDirectory, id, "metadata.json");
  if (!fs.existsSync(metadataPath)) return null;
  return JSON.parse(fs.readFileSync(metadataPath, "utf8"));
};

const metadataSourceUrl = (metadata) => {
  if (!metadata) return "";
  if (metadata.primary_url) return metadata.primary_url;
  if (metadata.doi) return `https://doi.org/${metadata.doi}`;
  if (metadata.arxiv_id) return `https://arxiv.org/abs/${metadata.arxiv_id}`;
  return metadata.source_url || "";
};

// Archived (solved) records keep their page and URL after resolution.
const archivedRecords = fs.existsSync(sourceDirectory)
  ? fs.readdirSync(sourceDirectory)
    .filter((id) => !activeIds.has(id))
    .map((id) => ({ id, metadata: readMetadata(id) }))
    .filter((record) => record.metadata && record.metadata.status === "solved")
    .map((record) => ({
      ...record,
      article: fs.readFileSync(path.join(sourceDirectory, record.id, "problem.md"), "utf8")
    }))
    .sort((a, b) => a.id.localeCompare(b.id))
  : [];

const collectionForId = (id) => catalog.collections.find((collection) => id.startsWith(`${collection.id}-`)) || null;

// Prev/next ordering matches the directory listing: field by field, titles A-Z.
// Archived records chain separately, ordered by record ID.
const directoryOrder = (() => {
  const byArea = new Map();
  for (const problem of catalog.problems) {
    const areaId = topicById.get(problem.topic)?.area || "uncategorized";
    if (!byArea.has(areaId)) byArea.set(areaId, []);
    byArea.get(areaId).push(problem);
  }
  return [...byArea.values()].flatMap((list) => list.slice().sort((a, b) => a.title.localeCompare(b.title)));
})();

const pagerFromList = (list, index) => ({
  previous: index > 0 ? list[index - 1] : null,
  next: index < list.length - 1 ? list[index + 1] : null
});

const activePagerById = new Map(directoryOrder.map((problem, index) => {
  const pager = pagerFromList(directoryOrder, index);
  return [problem.id, {
    previous: pager.previous ? { id: pager.previous.id, title: pager.previous.title } : null,
    next: pager.next ? { id: pager.next.id, title: pager.next.title } : null
  }];
}));

const archivePagerById = new Map(archivedRecords.map((record, index) => {
  const pager = pagerFromList(archivedRecords, index);
  return [record.id, {
    previous: pager.previous ? { id: pager.previous.id, title: pager.previous.metadata.title } : null,
    next: pager.next ? { id: pager.next.id, title: pager.next.metadata.title } : null
  }];
}));

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

const jumpNav = (links) => `
        <nav class="page-jump" aria-label="On this page">
          <span>On this page</span>
          ${links.map(([target, label]) => `<a href="#${target}">${label}</a>`).join("\n          ")}
        </nav>`;

const sourceIdentifiers = (metadata) => {
  const identifiers = [];
  if (metadata?.doi) identifiers.push({ "@type": "PropertyValue", propertyID: "DOI", value: metadata.doi });
  if (metadata?.arxiv_id) identifiers.push({ "@type": "PropertyValue", propertyID: "arXiv", value: metadata.arxiv_id });
  return identifiers;
};

const jsonLdGraph = ({ id, title, description, status, verified, keywords, aboutLabels, source, metadata, includeEncodings, recordDigest, statementText }) => {
  const page = pageUrl(id);
  const question = {
    "@type": "Question",
    "@id": `${page}#problem`,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Quantum Open Problems",
      value: id
    },
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
    const identifiers = sourceIdentifiers(metadata);
    question.isBasedOn = {
      "@type": "ScholarlyArticle",
      name: source.title,
      author: (source.authors || []).map((name) => ({ "@type": "Person", name })),
      ...(identifiers.length ? { identifier: identifiers } : {}),
      url: source.url
    };
  }
  if (includeEncodings) {
    question.encoding = [
      { "@type": "MediaObject", encodingFormat: "application/json", contentUrl: apiUrl(id) },
      { "@type": "MediaObject", encodingFormat: "text/markdown", contentUrl: packetUrl(id) }
    ];
  }
  return {
    "@context": ["https://schema.org", { qop: `${siteUrl}/vocab#` }],
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${page}#page`,
        url: page,
        name: title,
        dateModified: verified,
        isPartOf: { "@type": "Dataset", "@id": `${siteUrl}/#dataset`, name: catalog.meta.title, url: `${siteUrl}/` },
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

const pageHead = ({ title, description, canonical, extra = "" }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="${escapeHTML(description)}">
    <meta name="theme-color" content="#0d1b2a">
    <title>${escapeHTML(title)} · Quantum Open Problems</title>
    <link rel="canonical" href="${escapeHTML(canonical)}">
    <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../../styles.css">
    <link rel="alternate" href="../../feed.xml" type="application/atom+xml" title="Quantum Open Problems evidence feed">
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

const pageChrome = (main) => `
  <body class="problem-page">
    <header class="site-header">
      <a class="brand" href="../../" aria-label="Quantum Open Problems home">
        <span class="brand-mark" aria-hidden="true">Q</span>
        <span class="brand-copy">
          <strong>Open Problems</strong>
          <span>Across quantum science</span>
        </span>
      </a>
      ${siteNav("../../")}
      ${THEME_BUTTON}
    </header>
${main}
    <footer class="site-footer">
      <p>Quantum Open Problems</p>
      <p>A dated research index. Verify a result before citing the status.</p>
      <a href="../../">Back to the catalog ↖</a>
    </footer>
    ${THEME_SCRIPT}
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

const problemPage = (problem) => {
  const topic = topicById.get(problem.topic);
  const area = areaById.get(topic?.area);
  const formal = formalStatements[problem.id] || { notation: "", statement: "" };
  const problemSource = problemSources[problem.id];
  const compact = compactById.get(problem.id);
  const metadata = readMetadata(problem.id);
  const verified = problem.verified || catalog.meta.audited;
  const orderedProgress = (problem.progress || []).slice().sort((a, b) => b.date.localeCompare(a.date));
  const canonical = pageUrl(problem.id);
  const headExtra = [
    `<link rel="alternate" href="../../api/v1/problems/${escapeHTML(problem.id)}.json" type="application/json" title="Problem record (JSON)">`,
    `<link rel="alternate" href="../../packets/${escapeHTML(problem.id)}.md" type="text/markdown" title="AI research brief (Markdown)">`,
    MATHJAX_TAGS,
    jsonLdTag(jsonLdGraph({
      id: problem.id,
      title: problem.title,
      description: problem.summary,
      status: problem.status,
      verified,
      keywords: problem.keywords,
      aboutLabels: [topic?.label, area?.label].filter(Boolean),
      source: problemSource,
      metadata,
      includeEncodings: true,
      recordDigest: compact.recordDigest,
      statementText: formal.statement
    }))
  ].join("\n    ");

  return `${pageHead({
    title: problem.title,
    description: problem.summary,
    canonical,
    extra: headExtra
  })}${pageChrome(`
    <main class="page-shell">
${breadcrumbNav(problem.title)}

      <article aria-labelledby="page-title">
        <div class="dialog-meta">
          <span class="status-badge ${problem.status === "partial" ? "partial" : ""}">${statusLabel(problem.status)}</span>
          <span class="area-badge">${escapeHTML(area?.label || "Unclassified")}</span>
          <span class="meta-badge">${escapeHTML(topic?.label || problem.topic)}</span>
          <span class="meta-badge">Proposed ${escapeHTML(problem.proposed)}</span>
          <span class="meta-badge">Verified ${escapeHTML(displayDate(verified))}</span>
        </div>
        <h1 id="page-title">${escapeHTML(problem.title)}</h1>
        <p class="dialog-summary">${escapeHTML(problem.summary)}</p>
${jumpNav([
    ["formal-heading", "Statement"],
    ["remaining", "What remains"],
    ["progress-heading", "Progress"],
    ["machine-heading", "Interfaces"],
    ["cite-heading", "Cite"]
  ])}
        <div class="problem-framing">
          <section class="framing-row" aria-labelledby="importance-heading">
            <h2 id="importance-heading">Why it matters</h2>
            <p>${escapeHTML(problem.importance)}</p>
          </section>
          <section class="framing-row" aria-labelledby="source-heading">
            <h2 id="source-heading">Problem source</h2>
            <div class="problem-source-record">
              <strong>${escapeHTML(problemSource.title)}</strong>
              <p>${escapeHTML(problemSource.authors.join(", "))}</p>
              <p>${escapeHTML(problemSource.venue)}</p>
              <div class="problem-source-scope">
                <span>${escapeHTML(problemSource.relationship)}</span>
                <span>Statement locator: ${escapeHTML(problemSource.locator)}</span>
              </div>
              <a href="${escapeHTML(problemSource.url)}" rel="noreferrer">Read problem source ↗</a>
            </div>
          </section>
        </div>

        <section class="formal-statement" aria-labelledby="formal-heading">
          <div class="formal-heading">
            <div>
              <span class="dialog-section-label">Verified formulation</span>
              <h2 id="formal-heading">Formal statement</h2>
            </div>
            <span class="formal-source">Matched to the source and locator above</span>
          </div>
          ${formal.notation ? `
          <details class="formal-notation">
            <summary>Notation <span>Definitions used by the source statement</span></summary>
            <div class="formal-notation-body">${renderFormalMarkdown(formal.notation)}</div>
          </details>` : ""}
          <div class="formal-body">${renderFormalMarkdown(formal.statement)}</div>
        </section>

        <div class="remaining-question ${problem.status === "partial" ? "partial" : ""}" id="remaining">
          <span>What remains</span>
          <p>${escapeHTML(problem.remaining)}</p>
        </div>

        ${problem.origin ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>${escapeHTML(problem.origin.label)}</strong><p>${escapeHTML(problem.origin.note)}</p></div>
          </div>
        </section>` : ""}

        <section class="dialog-section" aria-labelledby="progress-heading">
          <span class="dialog-section-label">Evidence ledger</span>
          <h2 id="progress-heading">Recent progress</h2>
          <ol class="timeline">
            ${orderedProgress.map((item) => `
            <li id="${escapeHTML(eventIdFor(problem.id, item))}">
              <time datetime="${escapeHTML(item.date)}">${escapeHTML(displayDate(item.date))}</time>
              <div>
                <h3>${escapeHTML(item.title)}</h3>
                <p>${escapeHTML(item.detail)}</p>
                <div class="dialog-source-meta">
                  <span class="maturity-badge">${escapeHTML(item.maturity || "Unspecified")}</span>
                  ${item.strength ? `<span class="maturity-badge">${escapeHTML(item.strength)}</span>` : ""}
                  ${item.url ? `<a href="${escapeHTML(item.url)}" rel="noreferrer">${escapeHTML(item.label || "Primary source")} ↗</a>` : ""}
                </div>
              </div>
            </li>`).join("")}
          </ol>
        </section>

        ${(problem.watch || []).length ? `
        <section class="dialog-section" aria-labelledby="cautions-heading">
          <span class="dialog-section-label">Claim watch</span>
          <h2 id="cautions-heading">Scope and cautions</h2>
          ${problem.watch.map((note) => `
          <div class="watch-note">
            <span class="note-icon" aria-hidden="true">!</span>
            <div>
              <strong>${escapeHTML(note.label || "Caution")}</strong>
              <p>${escapeHTML(note.text)} ${note.url ? `<a href="${escapeHTML(note.url)}" rel="noreferrer">Source ↗</a>` : ""}</p>
            </div>
          </div>`).join("")}
        </section>` : ""}

        ${problem.interpretation ? `
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div><strong>Interpretation note</strong><p>${escapeHTML(problem.interpretation)}</p></div>
          </div>
        </section>` : ""}

        ${(problem.related || []).length ? `
        <section class="dialog-section" aria-labelledby="related-heading">
          <span class="dialog-section-label">Related entries</span>
          <h2 id="related-heading">Related problems</h2>
          <div class="related-links">
            ${problem.related.map((id) => `<a href="../${escapeHTML(id)}/">${escapeHTML(titleById.get(id) || id)}</a>`).join("")}
          </div>
        </section>` : ""}

        <section class="dialog-section" aria-labelledby="machine-heading">
          <span class="dialog-section-label">Work on this problem</span>
          <h2 id="machine-heading">Research interfaces</h2>
          <ul class="machine-links">
            <li><a href="../../packets/${escapeHTML(problem.id)}.md" type="text/markdown">AI research brief (Markdown)</a> — the full dated brief for human or AI research.</li>
            <li><a href="../../api/v1/problems/${escapeHTML(problem.id)}.json" type="application/json">Problem record (JSON)</a> — the complete structured record behind this page.</li>
            <li><a href="${escapeHTML(contributionUrl(problem))}" rel="noreferrer">Submit a research update ↗</a> — the evidence contract applies to human and AI results.</li>
            <li><a href="${escapeHTML(repositoryUrl)}/blob/main/open_prob/${escapeHTML(problem.id)}/problem.md" rel="noreferrer">Source article ↗</a> — the canonical statement and notes in the repository.</li>
          </ul>
        </section>
${citeSection({ id: problem.id, source: problemSource, verified, recordDigest: compact.recordDigest })}
        <footer class="page-record-footer">
          <p>Record <code>${escapeHTML(problem.id)}</code></p>
          <p>Record revision <code>${escapeHTML(compact.recordDigest)}</code></p>
          <p>Statement digest <code>${escapeHTML(compact.statementDigest)}</code></p>
          <p>Catalog as of ${escapeHTML(displayDate(catalog.meta.asOf))}. Verify a result before citing the status.</p>
        </footer>
      </article>
${pagerNav(activePagerById.get(problem.id))}
    </main>`)}`;
};

const archivePage = (record) => {
  const { id, metadata, article } = record;
  const title = metadata.title;
  const notation = extractSection(article, "Notation");
  const statement = extractSection(article, "Formal statement");
  const progress = extractSection(article, "Status and known progress");
  const bibliography = extractSection(article, "Bibliography");
  const heading = (article.match(/^# (.+)$/m) || [null, title])[1];
  const collection = collectionForId(id);
  const verified = metadata.last_verified || catalog.meta.audited;
  const description = `Solved record. ${truncateAtWord(plainText(progress), 240)}`;
  const source = {
    title: metadata.source_title || collection?.title || title,
    authors: metadata.authors || [],
    venue: metadata.venue || "",
    locator: metadata.source_location || "",
    url: metadataSourceUrl(metadata)
  };
  const canonical = pageUrl(id);
  const headExtra = [
    MATHJAX_TAGS,
    jsonLdTag(jsonLdGraph({
      id,
      title,
      description,
      status: "solved",
      verified,
      keywords: [],
      aboutLabels: collection ? [collection.label] : [],
      source,
      metadata,
      includeEncodings: false,
      recordDigest: null,
      statementText: statement
    }))
  ].join("\n    ");

  return `${pageHead({ title, description, canonical, extra: headExtra })}${pageChrome(`
    <main class="page-shell">
${breadcrumbNav(title)}

      <article aria-labelledby="page-title">
        <div class="dialog-meta">
          <span class="status-badge solved">Solved</span>
          ${collection ? `<span class="area-badge">${escapeHTML(collection.label)}</span>` : ""}
          <span class="meta-badge">Proposed ${escapeHTML(metadata.proposed_date || "")}</span>
          <span class="meta-badge">Verified ${escapeHTML(displayDate(verified))}</span>
        </div>
        <h1 id="page-title">${renderInlineMarkdown(heading)}</h1>
${jumpNav([
    ["formal-heading", "Statement"],
    ["resolution-heading", "Resolution"],
    ...(bibliography ? [["bibliography-heading", "Bibliography"]] : []),
    ["cite-heading", "Cite"]
  ])}
        <section class="dialog-section">
          <div class="interpretation-note">
            <span class="note-icon" aria-hidden="true">i</span>
            <div>
              <strong>Archived record</strong>
              <p>The audit records this problem as solved, so it no longer appears in the active explorer. The statement, resolution evidence, and bibliography stay at this URL.</p>
            </div>
          </div>
        </section>

        <div class="problem-framing">
          <section class="framing-row" aria-labelledby="source-heading">
            <h2 id="source-heading">Problem source</h2>
            <div class="problem-source-record">
              <strong>${escapeHTML(source.title)}</strong>
              <p>${escapeHTML(source.authors.join(", "))}</p>
              <p>${escapeHTML(source.venue)}</p>
              <div class="problem-source-scope">
                <span>Statement locator: ${escapeHTML(source.locator)}</span>
              </div>
              ${source.url ? `<a href="${escapeHTML(source.url)}" rel="noreferrer">Read problem source ↗</a>` : ""}
            </div>
          </section>
        </div>

        <section class="formal-statement" aria-labelledby="formal-heading">
          <div class="formal-heading">
            <div>
              <span class="dialog-section-label">Archived formulation</span>
              <h2 id="formal-heading">Formal statement</h2>
            </div>
            <span class="formal-source">As archived before resolution</span>
          </div>
          ${notation ? `
          <details class="formal-notation">
            <summary>Notation <span>Definitions used by the source statement</span></summary>
            <div class="formal-notation-body">${renderFormalMarkdown(notation)}</div>
          </details>` : ""}
          <div class="formal-body">${renderFormalMarkdown(statement)}</div>
        </section>

        <section class="dialog-section" aria-labelledby="resolution-heading">
          <span class="dialog-section-label">Resolution</span>
          <h2 id="resolution-heading">Status and known progress</h2>
          <div class="archive-progress">${renderFormalMarkdown(progress)}</div>
        </section>

        ${bibliography ? `
        <section class="dialog-section" aria-labelledby="bibliography-heading">
          <span class="dialog-section-label">References</span>
          <h2 id="bibliography-heading">Bibliography</h2>
          <div class="archive-bibliography">${renderFormalMarkdown(bibliography)}</div>
        </section>` : ""}

        <section class="dialog-section" aria-labelledby="machine-heading">
          <span class="dialog-section-label">Record</span>
          <h2 id="machine-heading">Research interfaces</h2>
          <ul class="machine-links">
            <li><a href="${escapeHTML(repositoryUrl)}/blob/main/open_prob/${escapeHTML(id)}/problem.md" rel="noreferrer">Source article ↗</a> — the canonical archived statement and audit notes.</li>
            <li><a href="../">Problem directory</a> — every active and archived record.</li>
          </ul>
        </section>
${citeSection({ id, source, verified, recordDigest: null })}
        <footer class="page-record-footer">
          <p>Record <code>${escapeHTML(id)}</code></p>
          <p>Status solved · archived from the active catalog</p>
          <p>Catalog as of ${escapeHTML(displayDate(catalog.meta.asOf))}. Verify a result before citing the status.</p>
        </footer>
      </article>
${pagerNav(archivePagerById.get(id))}
    </main>`)}`;
};

const problemsIndexPage = () => {
  const statusBadge = (status) => {
    const variant = status === "partial" || status === "partially_solved" ? " partial" : status === "solved" ? " solved" : "";
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

  const byArea = new Map();
  for (const problem of catalog.problems) {
    const areaId = topicById.get(problem.topic)?.area || "uncategorized";
    if (!byArea.has(areaId)) byArea.set(areaId, []);
    byArea.get(areaId).push(problem);
  }
  const sectionHead = (id, index, label, count) => `
        <div class="directory-section-head">
          <h2 class="list-area-heading" id="${escapeHTML(id)}"><span class="dir-index">${String(index).padStart(2, "0")}</span>${escapeHTML(label)}</h2>
          <span class="directory-count">${escapeHTML(count)}</span>
        </div>`;
  const sections = [...byArea.entries()].map(([areaId, problems], index) => {
    const area = areaById.get(areaId);
    const rows = problems
      .slice()
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((problem) => directoryRow(
        `${problem.id}/`,
        problem.status,
        problem.title,
        topicById.get(problem.topic)?.label || problem.topic
      )).join("");
    return `
      <section aria-labelledby="area-${escapeHTML(areaId)}">
${sectionHead(`area-${areaId}`, index + 1, area?.label || areaId, `${problems.length} active`)}
        <ul class="problem-list">${rows}</ul>
      </section>`;
  }).join("");

  const archiveRows = archivedRecords.map((record) => directoryRow(
    `${record.id}/`,
    "solved",
    record.metadata.title,
    collectionForId(record.id)?.label || "Archive"
  )).join("");
  const archiveSection = archivedRecords.length ? `
      <section aria-labelledby="area-archive">
${sectionHead("area-archive", byArea.size + 1, "Archived · solved", `${archivedRecords.length} records`)}
        <p class="directory-note">Resolved records keep their statement, resolution evidence, and URL.</p>
        <ul class="problem-list">${archiveRows}</ul>
      </section>` : "";

  return `${pageHead({
    title: "All problems",
    description: `Directory of the ${catalog.problems.length} active and ${archivedRecords.length} archived problems in the Quantum Open Problems catalog.`,
    canonical: `${siteUrl}/problems/`,
    extra: ""
  }).replaceAll("../../", "../")}
  <body class="problem-page">
    <header class="site-header">
      <a class="brand" href="../" aria-label="Quantum Open Problems home">
        <span class="brand-mark" aria-hidden="true">Q</span>
        <span class="brand-copy">
          <strong>Open Problems</strong>
          <span>Across quantum science</span>
        </span>
      </a>
      ${siteNav("../", "directory")}
      ${THEME_BUTTON}
    </header>
    <main class="page-shell">
      <article>
        <header class="directory-head">
          <p class="section-index">Catalog directory</p>
          <h1>All problems</h1>
          <p class="dialog-summary">One stable page per record, catalog as of ${escapeHTML(displayDate(catalog.meta.asOf))}. Each page carries the formal statement, evidence ledger, and machine-readable links.</p>
          <div class="directory-metrics">
            <span><strong>${catalog.meta.active}</strong> active</span>
            <span><strong>${catalog.meta.counts.open}</strong> open</span>
            <span><strong>${catalog.meta.counts.partial}</strong> partially solved</span>
            <span><strong>${archivedRecords.length}</strong> solved in archive</span>
          </div>
        </header>
        ${sections}
        ${archiveSection}
      </article>
    </main>
    <footer class="site-footer">
      <p>Quantum Open Problems</p>
      <p>A dated research index. Verify a result before citing the status.</p>
      <a href="../">Back to the catalog ↖</a>
    </footer>
    ${THEME_SCRIPT}
  </body>
</html>
`;
};

// Flatten every dated evidence event. IDs hash the complete semantic payload,
// so any correction to an event produces a new event for feed consumers.
const eventIdFor = (problemId, item) => `qop-evt-${sha256([
  problemId, item.date, item.title, item.detail, item.maturity, item.strength, item.url || ""
].join("|")).slice(0, 16)}`;

const evidenceEvents = catalog.problems
  .flatMap((problem) => (problem.progress || []).map((item) => ({
    eventId: eventIdFor(problem.id, item),
    problemId: problem.id,
    problemTitle: problem.title,
    status: problem.status,
    date: item.date,
    title: item.title,
    detail: item.detail,
    maturity: item.maturity,
    strength: item.strength,
    url: item.url || null,
    page: pageUrl(problem.id),
    record: apiUrl(problem.id)
  })))
  .sort((a, b) => b.date.localeCompare(a.date) || a.problemId.localeCompare(b.problemId));

const evidenceJson = {
  kind: "quantum-open-problems-evidence-log",
  generated: catalog.meta.asOf,
  catalogAsOf: catalog.meta.asOf,
  count: evidenceEvents.length,
  note: "Every dated evidence event for active problems, newest first. Event IDs are stable content hashes. Poll release.json first; this file is a snapshot of recorded evidence, not an append-only change ledger.",
  events: evidenceEvents
};

const atomFeed = () => {
  const catalogUpdated = `${catalog.meta.asOf}T00:00:00Z`;
  const entries = evidenceEvents.slice(0, 100).map((event) => {
    const published = `${isoDate(event.date) || catalog.meta.asOf}T00:00:00Z`;
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
  items: evidenceEvents.slice(0, 100).map((event) => ({
    id: event.eventId,
    url: `${event.page}#${event.eventId}`,
    external_url: event.url || undefined,
    title: `${event.problemTitle}: ${event.title}`,
    content_text: `${event.detail} [${event.maturity}; ${event.strength}]`,
    date_published: `${isoDate(event.date) || catalog.meta.asOf}T00:00:00Z`,
    tags: [event.maturity, event.strength].filter(Boolean)
  }))
});

const sitemap = () => {
  const urls = [
    { loc: `${siteUrl}/`, lastmod: catalog.meta.updated },
    { loc: `${siteUrl}/problems/`, lastmod: catalog.meta.updated },
    { loc: `${siteUrl}/ai/`, lastmod: catalog.meta.updated },
    { loc: `${siteUrl}/vocab/`, lastmod: catalog.meta.updated },
    ...catalog.problems.map((problem) => ({
      loc: pageUrl(problem.id),
      lastmod: problem.verified || catalog.meta.audited
    })),
    ...archivedRecords.map((record) => ({
      loc: pageUrl(record.id),
      lastmod: record.metadata.last_verified || catalog.meta.audited
    }))
  ];
  return `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${escapeXML(url.loc)}</loc><lastmod>${escapeXML(url.lastmod)}</lastmod></url>`).join("\n")}
</urlset>
`;
};

const llmsFull = () => {
  const header = [
    "# Quantum Open Problems: full catalog",
    "",
    `> Every active research brief in one file. Catalog as of ${catalog.meta.asOf}.`,
    `> ${catalog.problems.length} active problems. Structured records: ${siteUrl}/api/v1/problems.jsonl`,
    "",
    "---",
    ""
  ];
  const briefs = catalog.problems.map((problem) => {
    const packetPath = path.join(packetsDirectory, `${problem.id}.md`);
    return fs.readFileSync(packetPath, "utf8").trim();
  });
  return `${header.join("\n")}${briefs.join("\n\n---\n\n")}\n`;
};

// Write pages. Archived solved records keep their URLs; only directories for
// unknown records are removed.
fs.mkdirSync(pagesDirectory, { recursive: true });
const knownIds = new Set([...activeIds, ...archivedRecords.map((record) => record.id)]);
for (const entry of fs.readdirSync(pagesDirectory, { withFileTypes: true })) {
  if (entry.isDirectory() && !knownIds.has(entry.name)) {
    fs.rmSync(path.join(pagesDirectory, entry.name), { recursive: true });
  }
}
for (const problem of catalog.problems) {
  const directory = path.join(pagesDirectory, problem.id);
  fs.mkdirSync(directory, { recursive: true });
  writeHTML(path.join(directory, "index.html"), problemPage(problem));
}
for (const record of archivedRecords) {
  const directory = path.join(pagesDirectory, record.id);
  fs.mkdirSync(directory, { recursive: true });
  writeHTML(path.join(directory, "index.html"), archivePage(record));
}
writeHTML(path.join(pagesDirectory, "index.html"), problemsIndexPage());
fs.writeFileSync(path.join(siteDirectory, "sitemap.xml"), sitemap());
fs.writeFileSync(path.join(siteDirectory, "feed.xml"), atomFeed());
fs.writeFileSync(path.join(siteDirectory, "feed.json"), `${JSON.stringify(jsonFeed(), null, 2)}\n`);
fs.writeFileSync(path.join(apiDirectory, "evidence.json"), `${JSON.stringify(evidenceJson, null, 2)}\n`);
fs.writeFileSync(path.join(siteDirectory, "llms-full.txt"), llmsFull());

const MCP_TOOLS = [
  ["search_problems", "Search active problems by free text, status, field, or topic."],
  ["get_problem", "Fetch one complete JSON record with the formal statement and evidence ledger."],
  ["get_research_brief", "Fetch the Markdown research brief — the recommended working context."],
  ["list_fields", "List research fields and topics with active-problem counts."],
  ["get_catalog_status", "Poll the release manifest: catalog date, digest, and counts."],
  ["list_evidence", "List dated evidence events, newest first, with stable content-hash IDs."],
  ["how_to_contribute", "Get the evidence contract, contribution schema, and prefilled submission link."]
];

const aiPage = () => {
  const endpointRows = [
    ["llms.txt", "/llms.txt", "Short interface guide for LLM agents."],
    ["Full catalog text", "/llms-full.txt", "Every research brief in one Markdown file."],
    ["Release manifest", "/api/v1/release.json", "Catalog date, active-snapshot digest, counts. Poll this first."],
    ["Compact index", "/api/v1/index.json", "Discovery metadata for every active problem."],
    ["Problem record", "/api/v1/problems/&lt;record-id&gt;.json", "One complete structured record."],
    ["Research brief", "/packets/&lt;record-id&gt;.md", "One Markdown brief per active problem."],
    ["Bulk snapshot", "/api/v1/problems.jsonl", "One JSON record per line for batch indexing."],
    ["Evidence log", "/api/v1/evidence.json", "Every dated evidence event, newest first."],
    ["Feeds", "/feed.xml · /feed.json", "Atom and JSON Feed views of the latest evidence."],
    ["Schemas", "/api/v1/problem.schema.json · /api/v1/contribution.schema.json", "Read and write contracts."],
    ["Vocabulary", "/vocab/", "Definitions of the qop: JSON-LD properties."]
  ].map(([label, urlPath, note]) => `
            <tr>
              <td><strong>${label}</strong></td>
              <td><code>${urlPath}</code></td>
              <td>${note}</td>
            </tr>`).join("");

  return `${pageHead({
    title: "For AI agents",
    description: "How AI research agents use the Quantum Open Problems catalog: MCP server setup, HTTP interfaces, catalog watching, and the contribution contract.",
    canonical: `${siteUrl}/ai/`,
    extra: ""
  }).replaceAll("../../", "../")}
  <body class="problem-page">
    <header class="site-header">
      <a class="brand" href="../" aria-label="Quantum Open Problems home">
        <span class="brand-mark" aria-hidden="true">Q</span>
        <span class="brand-copy">
          <strong>Open Problems</strong>
          <span>Across quantum science</span>
        </span>
      </a>
      ${siteNav("../", "ai")}
      ${THEME_BUTTON}
    </header>
    <main class="page-shell">
      <article>
        <header class="directory-head">
          <p class="section-index">Machine interfaces</p>
          <h1>Built for AI research agents</h1>
          <p class="dialog-summary">Every record in this catalog is designed to be read, cited, and worked on by AI systems under the same evidence rules as human researchers. Connect through MCP for tool access, or use the plain HTTP interfaces below.</p>
        </header>

        <section class="dialog-section" aria-labelledby="mcp-heading">
          <span class="dialog-section-label">Tool access</span>
          <h2 class="list-area-heading" id="mcp-heading">MCP server</h2>
          <p class="ai-copy">The repository ships a zero-dependency MCP server (stdio transport, Node 18+). It reads the published catalog, so it never goes stale. Add it to your agent:</p>
          <pre class="code-block"><code># Claude Code
claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems

# Codex CLI
codex mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems

# From a repository checkout (uses your local build)
claude mcp add quantum-open-problems -- node mcp/server.mjs</code></pre>
          <p class="ai-copy">Point the server at another deployment with <code>QOP_SITE_URL</code>. Tools:</p>
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
            <li><strong>Load context.</strong> Call <code>get_research_brief</code>. The brief carries the formal statement, exact unresolved remainder, checked evidence, scope cautions, and the requested output contract. Keep the record revision digest.</li>
            <li><strong>Work.</strong> Match every claimed result against the statement's quantifiers and domain. Record failed routes that rule out a reusable approach.</li>
            <li><strong>Submit.</strong> Call <code>how_to_contribute</code> and file the result through the research-update form, quoting the record revision you worked from. Human and AI contributions follow one evidence contract, and editors review both the same way.</li>
          </ol>
        </section>

        <section class="dialog-section" aria-labelledby="http-heading">
          <span class="dialog-section-label">No MCP required</span>
          <h2 class="list-area-heading" id="http-heading">HTTP interfaces</h2>
          <p class="ai-copy">Everything the MCP server exposes is also plain static HTTPS under <code>${escapeHTML(siteUrl)}</code> — no authentication, no rate keys.</p>
          <div class="notation-table-wrap">
            <table class="notation-table">
              <thead><tr><th scope="col">Interface</th><th scope="col">Path</th><th scope="col">Use</th></tr></thead>
              <tbody>${endpointRows}
              </tbody>
            </table>
          </div>
        </section>

        <section class="dialog-section" aria-labelledby="watch-heading">
          <span class="dialog-section-label">Staying current</span>
          <h2 class="list-area-heading" id="watch-heading">Watching the catalog</h2>
          <p class="ai-copy">Poll <code>/api/v1/release.json</code>; if <code>activeSnapshotDigest</code> is unchanged, stop. Otherwise diff <code>/api/v1/evidence.json</code> by event ID, or subscribe to the Atom or JSON feed. Event IDs are content hashes, so a changed event appears as a new ID.</p>
        </section>

        <section class="dialog-section" aria-labelledby="contract-heading">
          <span class="dialog-section-label">Writes</span>
          <h2 class="list-area-heading" id="contract-heading">Contribution contract</h2>
          <p class="ai-copy">Reads need no account. A research result, correction, or failed route enters through the <a href="${escapeHTML(repositoryUrl)}/issues/new?template=research-update.yml" rel="noreferrer">research-update form ↗</a> and must state the exact claim and hypotheses, primary sources with locators, reproducible artifacts, declared AI involvement with human checks, and the remaining gap — see the <a href="../api/v1/contribution.schema.json">contribution schema</a> and <a href="${escapeHTML(repositoryUrl)}/blob/main/CONTRIBUTING.md" rel="noreferrer">contributing guide ↗</a>. Editors review human and AI work by one standard.</p>
        </section>
      </article>
    </main>
    <footer class="site-footer">
      <p>Quantum Open Problems</p>
      <p>A dated research index. Verify a result before citing the status.</p>
      <a href="../">Back to the catalog ↖</a>
    </footer>
    ${THEME_SCRIPT}
  </body>
</html>
`;
};

const vocabPage = () => `${pageHead({
  title: "Vocabulary",
  description: "Definitions for the qop: JSON-LD properties used by Quantum Open Problems structured data.",
  canonical: `${siteUrl}/vocab/`,
  extra: ""
}).replaceAll("../../", "../")}
  <body class="problem-page">
    <header class="site-header">
      <a class="brand" href="../" aria-label="Quantum Open Problems home">
        <span class="brand-mark" aria-hidden="true">Q</span>
        <span class="brand-copy">
          <strong>Open Problems</strong>
          <span>Across quantum science</span>
        </span>
      </a>
      ${siteNav("../")}
      ${THEME_BUTTON}
    </header>
    <main class="page-shell">
      <article>
        <h1>Structured-data vocabulary</h1>
        <p class="dialog-summary">Problem pages embed JSON-LD using Schema.org plus the project properties below, namespaced as <code>qop:</code> under <code>${escapeHTML(siteUrl)}/vocab#</code>. Schema.org's <code>creativeWorkStatus</code> describes a publication lifecycle, so the mathematical status uses a project property instead.</p>

        <section class="dialog-section" aria-labelledby="problemStatus">
          <h2 class="list-area-heading" id="problemStatus"><code>qop:problemStatus</code></h2>
          <p>The editorial mathematical status of the archived question on the verification date. One of:</p>
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
      </article>
    </main>
    <footer class="site-footer">
      <p>Quantum Open Problems</p>
      <p>A dated research index. Verify a result before citing the status.</p>
      <a href="../">Back to the catalog ↖</a>
    </footer>
    ${THEME_SCRIPT}
  </body>
</html>
`;

fs.mkdirSync(path.join(siteDirectory, "vocab"), { recursive: true });
writeHTML(path.join(siteDirectory, "vocab", "index.html"), vocabPage());
fs.mkdirSync(path.join(siteDirectory, "ai"), { recursive: true });
writeHTML(path.join(siteDirectory, "ai", "index.html"), aiPage());

const snapshot = fs.readFileSync(path.join(apiDirectory, "problems.jsonl"), "utf8");
const releaseJson = {
  kind: "quantum-open-problems-release",
  apiVersion: "v1",
  releaseDate: catalog.meta.asOf,
  activeSnapshotDigest: `sha256:${sha256(snapshot)}`,
  digestNote: "SHA-256 of api/v1/problems.jsonl, which contains active records only.",
  records: {
    total: catalog.meta.totalArchive,
    active: catalog.meta.active,
    resolved: catalog.meta.totalArchive - catalog.meta.active,
    open: catalog.meta.counts.open,
    partial: catalog.meta.counts.partial
  },
  evidenceEvents: evidenceEvents.length,
  links: {
    index: `${siteUrl}/api/v1/index.json`,
    snapshot: `${siteUrl}/api/v1/problems.jsonl`,
    evidence: `${siteUrl}/api/v1/evidence.json`,
    feedAtom: `${siteUrl}/feed.xml`,
    feedJson: `${siteUrl}/feed.json`,
    llms: `${siteUrl}/llms.txt`,
    llmsFull: `${siteUrl}/llms-full.txt`,
    sitemap: `${siteUrl}/sitemap.xml`,
    directory: `${siteUrl}/problems/`
  }
};
fs.writeFileSync(path.join(apiDirectory, "release.json"), `${JSON.stringify(releaseJson, null, 2)}\n`);

console.log(`Generated ${catalog.problems.length} problem pages, ${archivedRecords.length} archive pages, sitemap, feeds, evidence log, release manifest, and llms-full.txt.`);
