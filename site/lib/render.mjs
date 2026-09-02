// HTML templates for every page of the zoo. Pure functions: records in,
// strings out. No runtime dependencies.

import { STATUSES, slug } from "./tex.mjs";

const escape = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

export const displayDate = (iso) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${iso}T00:00:00Z`));
};

const MATHJAX = `<script>
      window.MathJax = {
        tex: {
          inlineMath: [["\\\\(", "\\\\)"]],
          displayMath: [["\\\\[", "\\\\]"]],
          processEnvironments: true,
          processEscapes: false,
          tags: "none"
        },
        svg: { fontCache: "global", scale: 1 },
        options: { ignoreHtmlClass: "no-math", processHtmlClass: "math-ready" },
        startup: { typeset: true }
      };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@4.1.3/tex-svg.js" integrity="sha384-my9P1jDckpHD+5LZsLQ0gaiCl/RMO32HaqwBtbo/25QIMVr6xXIUCg1jvdSRcvb4" crossorigin="anonymous" defer></script>`;

const THEME_BOOT = `<script>
      (() => {
        try {
          const stored = localStorage.getItem("qiqcop-theme");
          const dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
          document.documentElement.dataset.theme = dark ? "dark" : "light";
        } catch (error) { document.documentElement.dataset.theme = "light"; }
      })();
    </script>`;

export const logo = (extraClass = "") => `<span class="logo ${extraClass}" aria-hidden="true">
        <span class="logo-line">QIQC<span class="logo-bar"></span><span class="logo-o">O</span><span class="logo-p">P</span><svg class="logo-ket" viewBox="0 0 10 24"><path d="M1.6 1.2 L8.4 12 L1.6 22.8"/></svg></span>
        <span class="logo-line logo-line-2"><span class="logo-ghost">QIQC<span class="logo-bar"></span></span><span class="logo-oo"><span class="logo-z">Z</span>OO</span></span>
      </span>`;

export const statusTag = (status, extraClass = "") => {
  const meta = STATUSES[status];
  const titles = {
    unsolved: "No complete solution is known.",
    solved: "A complete solution is known; see Progress and Comment.",
    partial: "A substantial subcase is settled; the general statement remains open."
  };
  return `<span class="status-tag status-${meta.slug} ${extraClass}" title="${titles[meta.slug]}">${meta.label}</span>`;
};

export const tagLink = (tag, root) => `<a class="tag" href="${root}tag/${slug(tag)}/">${escape(tag)}</a>`;

export function layout({ config, root, title, description, path, body, current = "", extraHead = "", bodyClass = "", withMath = true, extraScripts = "" }) {
  const canonical = `${config.siteUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const pageTitle = title ? `${title} · ${config.shortName}` : `${config.shortName} · ${config.fullName}`;
  const nav = (href, label, key) => `<a href="${root}${href}"${current === key ? ' aria-current="page"' : ""}>${label}</a>`;
  return `<!doctype html>
<html lang="${config.language}" data-theme="light">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escape(pageTitle)}</title>
    <meta name="description" content="${escape(description)}">
    <meta name="theme-color" content="#0d1b2a">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${escape(config.shortName)}">
    <meta property="og:title" content="${escape(title || config.fullName)}">
    <meta property="og:description" content="${escape(description)}">
    <meta property="og:url" content="${canonical}">
    <meta name="twitter:card" content="summary">
    <link rel="icon" href="${root}assets/favicon.svg?v=${config.assetVersions?.favicon ?? ""}" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&display=swap">
    <link rel="stylesheet" href="${root}assets/styles.css?v=${config.assetVersions?.styles ?? ""}">
    <link rel="alternate" type="application/json" href="${root}api/index.json" title="${escape(config.shortName)} API">
    ${THEME_BOOT}
    ${withMath ? MATHJAX : ""}
    ${extraHead}
  </head>
  <body class="${bodyClass}" id="top" data-root="${root}">
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="${root}" aria-label="${escape(config.shortName)} home">
        ${logo()}
        <span class="brand-copy">${escape(config.fullName).replace(" Open Problem Zoo", "<br>Open Problem Zoo")}</span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        ${nav("problems/", "Problems", "problems")}
        ${nav("tags/", "Tags", "tags")}
        ${nav("about/", "About", "about")}
        <a href="${config.repositoryUrl}" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
      <div class="header-tools">
        <form class="search-form" action="${root}problems/" method="get" role="search">
          <label class="visually-hidden" for="site-search">Search problems</label>
          <input id="site-search" name="q" type="search" placeholder="Search problems" autocomplete="off">
        </form>
        <span class="random-control" role="group" aria-label="Open a random problem">
          <span class="random-label">Random</span>
          <a class="random-pill random-unsolved" href="${root}random/unsolved/">Unsolved</a>
          <a class="random-pill random-solved" href="${root}random/solved/">Solved</a>
        </span>
        <button class="theme-button" id="theme-toggle" type="button" aria-label="Switch color theme" aria-pressed="false">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2.25M12 18.75V21M21 12h-2.25M5.25 12H3M18.36 5.64l-1.59 1.59M7.23 16.77l-1.59 1.59M18.36 18.36l-1.59-1.59M7.23 7.23 5.64 5.64M16.25 12A4.25 4.25 0 1 1 7.75 12a4.25 4.25 0 0 1 8.5 0Z"/></svg>
        </button>
      </div>
    </header>
    <main id="main">
${body}
    </main>
    <footer class="site-footer">
      <div class="footer-brand">
        ${logo("logo-small")}
        <span class="brand-copy">${escape(config.fullName).replace(" Open Problem Zoo", "<br>Open Problem Zoo")}</span>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <a href="${root}problems/">All problems</a>
        <a href="${root}tags/">Tags</a>
        <a href="${root}about/">About and how to cite</a>
        <a href="${root}about/#contribute">Contribute</a>
        <a href="${root}api/index.json">JSON API</a>
        <a href="${config.repositoryUrl}" rel="noreferrer">Source repository</a>
      </nav>
      <p class="footer-note">A dated research index. Verify a status against the cited sources before relying on it. <a href="#top">Back to top ↑</a></p>
    </footer>
    <div class="toast" id="toast" role="status" aria-live="polite"></div>
    <script src="${root}data/random.js?v=${config.assetVersions?.random ?? ""}" defer></script>
    <script src="${root}assets/app.js?v=${config.assetVersions?.app ?? ""}" defer></script>
    ${extraScripts}
  </body>
</html>
`;
}

const problemUrl = (config, id) => `${config.siteUrl.replace(/\/$/, "")}/problem/${id}/`;

export function bibtex(record, config, dates) {
  const year = (dates.updated || dates.created || "").slice(0, 4);
  return `@incollection{qiqcop_${record.id},
  title = {${record.title.text.replace(/[{}]/g, "")}},
  booktitle = {${config.fullName} (${config.shortName})},
  year = {${year}},
  howpublished = {\\url{${problemUrl(config, record.id)}}},
  note = {Stable ID ${record.id}; status: ${record.status}; accessed ${dates.today}}
}`;
}

export function textCitation(record, config, dates) {
  return `“${record.title.text},” ${config.fullName} (${config.shortName}), ${problemUrl(config, record.id)}, ID ${record.id}, accessed ${dates.today}.`;
}

const excerpt = (text, length = 220) => {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).replace(/\s+\S*$/, "")}…`;
};

export function problemCard(record, root, { showStatement = true } = {}) {
  return `<article class="problem-card status-${record.statusSlug}" data-id="${record.id}">
  <div class="card-head">
    ${statusTag(record.status, "status-tag-small")}
    <span class="card-id">${record.id}</span>
  </div>
  <h3 class="card-title"><a href="${root}problem/${record.id}/">${record.title.html}</a></h3>
  ${showStatement ? `<div class="card-statement">${record.statement.html}</div>` : ""}
  <ul class="tag-list">${record.tags.map((tag) => `<li>${tagLink(tag, root)}</li>`).join("")}</ul>
  <a class="card-link" href="${root}problem/${record.id}/">Open problem page <span aria-hidden="true">→</span></a>
</article>`;
}

// First sentence of the statement as HTML, keeping inline mathematics so the
// directory can typeset it. Tags are re-balanced after the cut.
export function leadSentenceHtml(html, limit = 260) {
  const first = html.match(/<p>([\s\S]*?)<\/p>/);
  const inner = first ? first[1] : html;
  let out = "";
  let visible = 0;
  let i = 0;
  const stack = [];
  while (i < inner.length) {
    if (inner.startsWith('<span class="math">', i)) {
      const end = inner.indexOf("</span>", i);
      out += inner.slice(i, end + 7);
      i = end + 7;
      visible += 6;
      continue;
    }
    if (inner[i] === "<") {
      const end = inner.indexOf(">", i);
      const tag = inner.slice(i, end + 1);
      const name = tag.match(/^<\/?([a-z]+)/i)?.[1];
      if (name && !tag.endsWith("/>")) {
        if (tag.startsWith("</")) stack.pop();
        else stack.push(name);
      }
      out += tag;
      i = end + 1;
      continue;
    }
    const ch = inner[i];
    out += ch;
    visible += 1;
    i += 1;
    if ((ch === "?" || ch === ".") && (i >= inner.length || /\s/.test(inner[i]))) break;
    if (visible >= limit && /\s/.test(ch)) { out = `${out.trimEnd()}…`; break; }
  }
  while (stack.length) out += `</${stack.pop()}>`;
  return out.trim();
}

export function problemRow(record, root) {
  const search = [record.title.text, record.id, record.tags.join(" "), record.statement.text].join(" ").toLowerCase();
  return `<li class="problem-row status-${record.statusSlug}" data-id="${record.id}" data-status="${record.statusSlug}" data-tags="${escape(record.tags.map(slug).join(" "))}" data-title="${escape(record.title.text.toLowerCase())}" data-updated="${record.dates.updated}" data-search="${escape(search)}">
  <div class="row-main">
    <a class="row-title" href="${root}problem/${record.id}/">${record.title.html}</a>
    <p class="row-excerpt">${leadSentenceHtml(record.statement.html)}</p>
    <ul class="tag-list tag-list-compact">${record.tags.map((tag) => `<li>${tagLink(tag, root)}</li>`).join("")}</ul>
  </div>
  <div class="row-side">
    ${statusTag(record.status)}
  </div>
</li>`;
}

export function renderProblemPage({ record, config, root, related, dates }) {
  const editUrl = `${config.repositoryUrl}/edit/${config.branch}/${config.databasePath}/${record.id}.tex`;
  const historyUrl = `${config.repositoryUrl}/commits/${config.branch}/${config.databasePath}/${record.id}.tex`;
  const blobUrl = `${config.repositoryUrl}/blob/${config.branch}/${config.databasePath}/${record.id}.tex`;
  const issueUrl = `${config.repositoryUrl}/issues/new?template=research-update.yml&title=${encodeURIComponent(`[Update] ${record.title.text} (${record.id})`)}`;
  const permalink = problemUrl(config, record.id);
  const bib = bibtex(record, config, dates);
  const plain = textCitation(record, config, dates);
  const references = record.references.map((entry) => `<div class="reference" id="${entry.anchor}">
        <dt><a href="#${entry.anchor}">[${escape(entry.key)}]</a></dt>
        <dd>${entry.html}${entry.links.length ? `<span class="reference-links">${entry.links.map((link) => `<a href="${escape(link.url)}" rel="noreferrer" class="ref-link ref-${link.kind}">${link.kind === "arxiv" ? "arXiv" : link.kind === "doi" ? "DOI" : "link"}</a>`).join("")}</span>` : ""}</dd>
      </div>`).join("\n");
  const relatedList = related.length
    ? `<ul class="related-list">${related.map((item) => `<li>
        <a href="${root}problem/${item.record.id}/">${item.record.title.html}</a>
        ${statusTag(item.record.status, "status-tag-small")}
        <span class="related-tags">${item.shared.map((tag) => escape(tag)).join(" · ")}</span>
      </li>`).join("")}</ul>`
    : `<p class="muted">No other problem shares a tag with this one yet.</p>`;
  const body = `
    <div class="problem-layout">
      <article class="problem" id="${record.id}">
        <nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Zoo</a><span aria-hidden="true">›</span><a href="${root}problems/">Problems</a><span aria-hidden="true">›</span><span>${escape(record.id)}</span></nav>
        <header class="problem-header">
          <h1 class="problem-title">${record.title.html}</h1>
          <div class="status-row">
            ${statusTag(record.status)}
            <span class="problem-id">ID <code>${record.id}</code></span>
            <span class="problem-updated">Last edited ${displayDate(record.dates.updated)}</span>
          </div>
          <ul class="tag-list">${record.tags.map((tag) => `<li>${tagLink(tag, root)}</li>`).join("")}</ul>
          <div class="problem-actions no-math">
            <a class="action" href="${editUrl}" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m13.5 6.5 3 3"/></svg>Edit</a>
            <button class="action" type="button" data-dialog="cite-dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h4v4H7zM13 7h4v4h-4zM11 11c0 3-1 4-4 5M17 11c0 3-1 4-4 5"/></svg>Cite</button>
            <button class="action" type="button" data-dialog="share-dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>Share</button>
            <a class="action action-quiet" href="${root}problem/${record.id}/${record.id}.tex">TeX</a>
            <a class="action action-quiet" href="${root}api/problems/${record.id}.json">JSON</a>
          </div>
        </header>

        <section class="problem-section" id="problem">
          <h2>Problem</h2>
          <div class="statement">${record.statement.html}</div>
        </section>

        <section class="problem-section" id="source">
          <h2>Source</h2>
          ${record.source.html}
        </section>

        <section class="problem-section" id="progress">
          <h2>Progress</h2>
          <ul class="progress-list">
            ${record.progress.map((item) => `<li>${item.html}</li>`).join("\n            ")}
          </ul>
        </section>

        <section class="problem-section" id="comment">
          <h2>Comment</h2>
          ${record.comment.html}
        </section>

        <section class="problem-section" id="references">
          <h2>References</h2>
          <dl class="references">
      ${references}
          </dl>
        </section>

        <section class="problem-section" id="related">
          <h2>Related problems</h2>
          ${relatedList}
        </section>

        <footer class="problem-footer no-math">
          <div class="edit-log">
            <h2>Page edit log</h2>
            <ul>
              <li><span>Record created</span><time datetime="${record.dates.created}">${displayDate(record.dates.created)}</time></li>
              <li><span>Last edited</span><time datetime="${record.dates.updated}">${displayDate(record.dates.updated)}</time></li>
              <li><span>Revisions</span><span>${record.dates.revisions}</span></li>
            </ul>
            <p><a href="${historyUrl}" rel="noreferrer">View the full history on GitHub</a> · <a href="${blobUrl}" rel="noreferrer">View the TeX source</a></p>
          </div>
          <div class="contribute-box">
            <h2>Your contribution is welcome!</h2>
            <p>Found progress, a correction, or a resolution? <a href="${editUrl}" rel="noreferrer">Edit this record on GitHub</a> and open a pull request, or <a href="${issueUrl}" rel="noreferrer">report an update</a> with the primary sources. See the <a href="${root}about/#contribute">contribution guide</a>.</p>
          </div>
          <div class="cite-box">
            <h2>Cite this page</h2>
            <p>${escape(plain)}</p>
          </div>
        </footer>
      </article>

    </div>

    <dialog class="dialog no-math" id="cite-dialog" aria-labelledby="cite-title">
      <form method="dialog" class="dialog-frame">
        <div class="dialog-head"><h2 id="cite-title">Cite this problem</h2><button class="dialog-close" type="submit" aria-label="Close">×</button></div>
        <p class="dialog-intro">Please also cite the primary sources listed under References. Cite this page for the statement, status, and stable identifier.</p>
        <h3>BibTeX</h3>
        <div class="copy-block"><pre id="cite-bibtex">${escape(bib)}</pre><button class="copy-button" type="button" data-copy="cite-bibtex">Copy</button></div>
        <h3>Plain text</h3>
        <div class="copy-block"><pre id="cite-text">${escape(plain)}</pre><button class="copy-button" type="button" data-copy="cite-text">Copy</button></div>
      </form>
    </dialog>

    <dialog class="dialog no-math" id="share-dialog" aria-labelledby="share-title">
      <form method="dialog" class="dialog-frame">
        <div class="dialog-head"><h2 id="share-title">Share this problem</h2><button class="dialog-close" type="submit" aria-label="Close">×</button></div>
        <h3>Permanent link</h3>
        <div class="copy-block"><pre id="share-link">${escape(permalink)}</pre><button class="copy-button" type="button" data-copy="share-link">Copy</button></div>
        <div class="share-links">
          <a href="https://bsky.app/intent/compose?text=${encodeURIComponent(`${record.title.text} — ${config.shortName} ${permalink}`)}" rel="noreferrer">Bluesky</a>
          <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(`${record.title.text} — ${config.shortName}`)}&url=${encodeURIComponent(permalink)}" rel="noreferrer">X / Twitter</a>
          <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(permalink)}" rel="noreferrer">LinkedIn</a>
          <a href="mailto:?subject=${encodeURIComponent(`${record.title.text} (${config.shortName})`)}&body=${encodeURIComponent(`${record.title.text}\n${permalink}`)}">Email</a>
          <button type="button" class="native-share" data-share-title="${escape(record.title.text)}" data-share-url="${escape(permalink)}" hidden>More…</button>
        </div>
      </form>
    </dialog>`;
  return layout({
    config, root, path: `problem/${record.id}/`, current: "problems",
    title: record.title.text,
    description: excerpt(`${record.status}. ${record.statement.text}`, 300),
    body, bodyClass: "page-problem"
  });
}

export function renderHome({ config, root, records, stats, tagCounts, initial, dates }) {
  const metric = (value, label, cls = "") => `<div class="metric ${cls}"><strong>${value}</strong><span>${label}</span></div>`;
  const topTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12);
  const total = stats.total || 1;
  const bar = ["unsolved", "partial", "solved"].map((key) => `<span class="bar-${key}" style="width:${(100 * stats[key] / total).toFixed(1)}%" title="${STATUSES[key === "unsolved" ? "Unsolved" : key === "solved" ? "Solved" : "Partially solved"].label}: ${stats[key]}"></span>`).join("");
  const body = `
    <section class="panels" aria-label="Database overview">
      <div class="panel panel-stats">
        <div class="panel-head">
          <h2>The database at a glance</h2>
          <span class="panel-note">Updated ${displayDate(dates.updated)}</span>
        </div>
        <div class="metric-grid">
          ${metric(stats.total, "Problems")}
          ${metric(stats.unsolved, "Unsolved", "metric-unsolved")}
          ${metric(stats.partial, "Partially solved", "metric-partial")}
          ${metric(stats.solved, "Solved", "metric-solved")}
          ${metric(tagCounts.size, "Categories (tags)")}
        </div>
        <div class="status-bar" role="img" aria-label="${stats.unsolved} unsolved, ${stats.partial} partially solved, ${stats.solved} solved">${bar}</div>
        <div class="top-tags">
          <span class="top-tags-label">Most frequent categories</span>
          <ul class="tag-list">${topTags.map(([tag, count]) => `<li>${tagLink(tag, root).replace("</a>", ` <span class="tag-count">${count}</span></a>`)}</li>`).join("")}<li><a class="tag tag-more" href="${root}tags/">All ${tagCounts.size} tags →</a></li></ul>
        </div>
      </div>

      <div class="panel panel-random" id="panel-unsolved">
        <div class="panel-head">
          <h2>Random unsolved problem</h2>
          <button class="shuffle" type="button" data-shuffle="unsolved" aria-label="Show another random unsolved problem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l3 5 3 5h3"/><path d="M4 17h3l3-5 3-5h3"/><path d="m17 5 3 2-3 2M17 15l3 2-3 2"/></svg>Another one</button>
        </div>
        <div class="random-slot" data-pool="unsolved">${problemCard(initial.unsolved, root)}</div>
      </div>

      <div class="panel panel-random" id="panel-solved">
        <div class="panel-head">
          <h2>Random solved problem</h2>
          <button class="shuffle" type="button" data-shuffle="solved" aria-label="Show another random solved problem"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h3l3 5 3 5h3"/><path d="M4 17h3l3-5 3-5h3"/><path d="m17 5 3 2-3 2M17 15l3 2-3 2"/></svg>Another one</button>
        </div>
        <div class="random-slot" data-pool="solved">${problemCard(initial.solved, root)}</div>
      </div>
    </section>

    <section class="section-shell" id="recent" aria-labelledby="recent-title">
      <div class="section-heading">
        <div><p class="section-index">Activity</p><h2 id="recent-title">Recently edited</h2></div>
        <a class="text-link" href="${root}problems/?sort=updated">All problems by date →</a>
      </div>
      <ul class="recent-list">
        ${records.slice().sort((a, b) => b.dates.updated.localeCompare(a.dates.updated) || a.title.text.localeCompare(b.title.text)).slice(0, 6).map((record) => `<li><time datetime="${record.dates.updated}">${displayDate(record.dates.updated)}</time><a href="${root}problem/${record.id}/">${record.title.html}</a>${statusTag(record.status, "status-tag-small")}</li>`).join("\n        ")}
      </ul>
    </section>
`;
  return layout({
    config, root, path: "", current: "home",
    title: "",
    description: `${config.fullName}: ${stats.total} problems in quantum information and quantum computation with typeset statements, sources, progress, and references.`,
    body, bodyClass: "page-home",
    extraScripts: `<script src="${root}data/index.js"></script>`
  });
}

export function renderDirectory({ config, root, records, tagCounts }) {
  const tags = [...tagCounts.keys()].sort((a, b) => a.localeCompare(b));
  const body = `
    <section class="section-shell directory">
      <div class="section-heading">
        <div><p class="section-index">Catalog</p><h1>All problems</h1></div>
        <p>${records.length} records. Filter by status or tag, or search titles, identifiers, and statements.</p>
      </div>
      <div class="filter-panel no-math" aria-label="Filters">
        <div class="search-field">
          <label for="problem-search">Search</label>
          <input id="problem-search" type="search" placeholder="Try “capacity”, “SIC”, “Bell”, or an ID" autocomplete="off">
        </div>
        <fieldset class="status-filter">
          <legend>Status</legend>
          <div class="segmented-control">
            <button type="button" class="is-active" data-status="all" aria-pressed="true">All <span>${records.length}</span></button>
            <button type="button" data-status="unsolved" aria-pressed="false">Unsolved <span>${records.filter((r) => r.statusSlug === "unsolved").length}</span></button>
            <button type="button" data-status="partial" aria-pressed="false">Partial <span>${records.filter((r) => r.statusSlug === "partial").length}</span></button>
            <button type="button" data-status="solved" aria-pressed="false">Solved <span>${records.filter((r) => r.statusSlug === "solved").length}</span></button>
          </div>
        </fieldset>
        <div class="select-filter">
          <label for="tag-filter">Tag</label>
          <select id="tag-filter"><option value="all">All tags</option>${tags.map((tag) => `<option value="${slug(tag)}">${escape(tag)} (${tagCounts.get(tag)})</option>`).join("")}</select>
        </div>
        <div class="select-filter">
          <label for="sort-filter">Sort</label>
          <select id="sort-filter"><option value="title">Title A–Z</option><option value="updated">Recently edited</option><option value="status">Status</option></select>
        </div>
        <button class="clear-button" id="clear-filters" type="button">Clear</button>
      </div>
      <p class="results-toolbar" aria-live="polite"><strong id="results-count">${records.length}</strong> <span id="results-label">problems</span></p>
      <ul class="problem-list" id="problem-list">
        ${records.map((record) => problemRow(record, root)).join("\n        ")}
      </ul>
      <div class="empty-state" id="empty-state" hidden>
        <p>No problems match these filters.</p>
        <button type="button" class="button button-ghost" data-clear-filters>Reset filters</button>
      </div>
    </section>`;
  return layout({
    config, root, path: "problems/", current: "problems",
    title: "All problems",
    description: `Browse all ${records.length} problems of the ${config.shortName} by status, tag, or keyword.`,
    body, bodyClass: "page-directory"
  });
}

export function renderTagsIndex({ config, root, tagCounts, canonicalTags }) {
  const used = [...tagCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const unused = canonicalTags.filter((tag) => !tagCounts.has(tag));
  const groups = new Map();
  for (const [tag, count] of used) {
    const letter = tag[0].toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push([tag, count]);
  }
  const body = `
    <section class="section-shell">
      <div class="section-heading">
        <div><p class="section-index">Taxonomy</p><h1>Tags</h1></div>
        <p>${used.length} tags are in use across the zoo; ${unused.length} further canonical tags are reserved for future records. Tags are assigned from a controlled list, one to six per problem.</p>
      </div>
      <div class="tag-groups">
        ${[...groups.entries()].map(([letter, entries]) => `<div class="tag-group"><h2>${letter}</h2><ul class="tag-list tag-list-large">${entries.map(([tag, count]) => `<li>${tagLink(tag, root).replace("</a>", ` <span class="tag-count">${count}</span></a>`)}</li>`).join("")}</ul></div>`).join("\n        ")}
      </div>
      <details class="unused-tags">
        <summary>Reserved tags without problems yet (${unused.length})</summary>
        <ul class="tag-list">${unused.map((tag) => `<li><span class="tag tag-muted">${escape(tag)}</span></li>`).join("")}</ul>
      </details>
    </section>`;
  return layout({
    config, root, path: "tags/", current: "tags",
    title: "Tags",
    description: `All ${used.length} tags used to classify the problems of the ${config.shortName}.`,
    body, bodyClass: "page-tags", withMath: false
  });
}

export function renderTagPage({ config, root, tag, records }) {
  const counts = { unsolved: 0, partial: 0, solved: 0 };
  for (const record of records) counts[record.statusSlug] += 1;
  const body = `
    <section class="section-shell">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Zoo</a><span aria-hidden="true">›</span><a href="${root}tags/">Tags</a><span aria-hidden="true">›</span><span>${escape(tag)}</span></nav>
      <div class="section-heading">
        <div><p class="section-index">Tag</p><h1>${escape(tag)}</h1></div>
        <p>${records.length} problem${records.length === 1 ? "" : "s"}: ${counts.unsolved} unsolved, ${counts.partial} partially solved, ${counts.solved} solved.</p>
      </div>
      <ul class="problem-list">
        ${records.map((record) => problemRow(record, root)).join("\n        ")}
      </ul>
    </section>`;
  return layout({
    config, root, path: `tag/${slug(tag)}/`, current: "tags",
    title: `${tag} · Tag`,
    description: `${records.length} problems tagged “${tag}” in the ${config.shortName}.`,
    body, bodyClass: "page-tag"
  });
}

export function renderAbout({ config, root, stats, dates }) {
  const zooBib = `@misc{qiqcop_zoo,
  title = {${config.fullName} (${config.shortName})},
  howpublished = {\\url{${config.siteUrl}}},
  year = {${dates.updated.slice(0, 4)}},
  note = {Accessed ${dates.today}}
}`;
  const body = `
    <section class="section-shell about">
      <div class="section-heading">
        <div><p class="section-index">About</p><h1>${escape(config.fullName)}</h1></div>
        <p>${escape(config.tagline)}</p>
      </div>
      <div class="prose">
        <h2 id="what">What the zoo is</h2>
        <p>The ${escape(config.shortName)} collects research-level open problems in quantum information and quantum computation. Each record is written for readers with a PhD in the field: a self-contained statement with the definitions it needs, the paper that posed the problem, the results that delimit it, the precise remaining gap, and full references with author–year labels.</p>
        <p>The zoo currently holds ${stats.total} problems: ${stats.unsolved} unsolved, ${stats.partial} partially solved, and ${stats.solved} solved. Solved problems stay in the zoo with their resolution so that citations survive.</p>

        <h2 id="status">How statuses are assigned</h2>
        <ul>
          <li><strong>Unsolved</strong>: no complete answer to the exact archived question is known.</li>
          <li><strong>Partially solved</strong>: a substantial subcase, subclass, or direction is settled; the general statement remains open. The label carries no completion percentage.</li>
          <li><strong>Solved</strong>: a complete proof or counterexample exists for the archived statement. The Comment section says whether the resolving result is peer-reviewed.</li>
        </ul>
        <p>Progress on a nearby variant does not change a status. A status records the state of the literature at the last edit date shown on the page, so verify it against the cited sources before relying on it.</p>

        <h2 id="contribute">How to contribute</h2>
        <ol>
          <li>Fork the <a href="${config.repositoryUrl}" rel="noreferrer">repository</a> and copy <code>database/_template.tex</code> to <code>database/problems/&lt;id&gt;.tex</code>, where the ID comes from <code>node scripts/new-problem-id.mjs</code>.</li>
          <li>Write the statement, status, source, progress, references, comment, and one to six tags from <code>database/tags.json</code>, following the template comments.</li>
          <li>Run <code>node site/build.mjs</code>. The build rejects records with missing sections, unknown tags, unresolved citations, or unlabeled equations.</li>
          <li>Open a pull request. To report progress on an existing problem, use the Edit button on its page or open an issue with the primary sources.</li>
        </ol>

        <h2 id="cite">How to cite</h2>
        <p>Cite the primary sources for any mathematical claim. To cite a problem page for its statement, status, or stable identifier, use the Cite button on that page. To cite the zoo as a whole:</p>
        <div class="copy-block no-math"><pre id="zoo-bibtex">${escape(zooBib)}</pre><button class="copy-button" type="button" data-copy="zoo-bibtex">Copy</button></div>

        <h2 id="api">Machine-readable access</h2>
        <ul>
          <li><a href="${root}api/index.json">api/index.json</a>: every problem with title, status, tags, plain-text statement, and links.</li>
          <li><code>api/problems/&lt;id&gt;.json</code>: one full record with TeX source, converted HTML, plain text, references, and equation labels.</li>
          <li><a href="${root}api/tags.json">api/tags.json</a>: the tag taxonomy with counts.</li>
          <li><a href="${root}llms.txt">llms.txt</a>: a short guide for AI agents.</li>
        </ul>

        <h2 id="credits">Credits</h2>
        <p>The problem collection is compiled and maintained by Bikun Li and the contributors to the <a href="${config.repositoryUrl}" rel="noreferrer">GitHub repository</a>. The site design draws on the <a href="https://errorcorrectionzoo.org/" rel="noreferrer">Error Correction Zoo</a> and the <a href="https://www.erdosproblems.com/" rel="noreferrer">Erdős Problems</a> database. Mathematics is typeset with <a href="https://www.mathjax.org/" rel="noreferrer">MathJax</a>.</p>
      </div>
    </section>`;
  return layout({
    config, root, path: "about/", current: "about",
    title: "About",
    description: `What the ${config.shortName} is, how statuses are assigned, how to contribute, and how to cite.`,
    body, bodyClass: "page-about", withMath: false
  });
}

export function renderRandomPage({ config, root, pool, ids, label }) {
  const body = `
    <section class="section-shell">
      <div class="section-heading"><div><p class="section-index">Random</p><h1>Picking a random ${label} problem…</h1></div></div>
      <noscript><p>JavaScript is disabled, so here is the full list instead.</p></noscript>
      <ul class="plain-list">${ids.map((entry) => `<li><a href="${root}problem/${entry.id}/">${entry.title}</a></li>`).join("")}</ul>
    </section>`;
  return layout({
    config, root, path: `random/${pool}/`, current: "",
    title: `Random ${label} problem`,
    description: `Jump to a random ${label} problem in the ${config.shortName}.`,
    body, bodyClass: "page-random", withMath: false,
    extraHead: `<meta name="robots" content="noindex">
    <script>(() => { const ids = ${JSON.stringify(ids.map((entry) => entry.id))}; const pick = ids[Math.floor(Math.random() * ids.length)]; if (pick) location.replace(${JSON.stringify(root)} + "problem/" + pick + "/"); })();</script>`
  });
}

export function renderNotFound({ config, root }) {
  const body = `
    <section class="section-shell">
      <div class="section-heading"><div><p class="section-index">404</p><h1>Page not found</h1></div></div>
      <p class="prose">The page you asked for does not exist. Problem pages live at <code>problem/&lt;id&gt;/</code>, where the ID starts with <code>op_</code>. Try the <a href="${root}problems/">problem directory</a> or the <a href="${root}">home page</a>.</p>
    </section>`;
  return layout({
    config, root, path: "404.html", title: "Page not found",
    description: "Page not found.", body, bodyClass: "page-404", withMath: false
  });
}
