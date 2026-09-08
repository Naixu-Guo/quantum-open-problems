import { submissionsOnline as acceptsSubmissions } from "./submission-settings.mjs";
// HTML templates for every page of the zoo. Pure functions: records in,
// strings out. No runtime dependencies.

import { STATUSES, slug } from "./tex.mjs";
import { distinctQuestionCounts } from "./metadata.mjs";
import { TAG_KINDS } from "./taxonomy.mjs";

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

export const displayDateTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" }).format(date)} UTC`;
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

const SEARCH_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>`;

export const logo = (extraClass = "") => `<span class="logo ${extraClass}" aria-hidden="true">
        <span class="logo-line"><span class="logo-q">QIQC</span><span class="logo-bar"></span><span class="logo-o">O</span><span class="logo-p">P</span><svg class="logo-ket" viewBox="0 0 10 24"><path d="M1.6 1.2 L8.4 12 L1.6 22.8"/></svg></span>
        <span class="logo-line logo-line-2"><span class="logo-ghost">QIQC<span class="logo-bar"></span></span><span class="logo-oo"><span class="logo-z">Z</span>OO</span></span>
      </span>`;

export const statusTag = (status, extraClass = "") => {
  const meta = STATUSES[status];
  const titles = {
    unsolved: "No complete solution is known.",
    solved: "A complete solution is known; see Progress and Comment."
  };
  return `<span class="status-tag status-${meta.slug} ${extraClass}" title="${titles[meta.slug]}">${meta.label}</span>`;
};

// A field or topic pill. Fields are primary (solid), topics secondary (outlined).
export const tagLink = (tag, root, kind = "topic", count = null) =>
  `<a class="tag tag-${kind}" href="${root}tag/${slug(tag)}/" title="${TAG_KINDS[kind].label}: ${escape(tag)}">${escape(tag)}${count === null ? "" : ` <span class="tag-count">${count}</span>`}</a>`;

// The list items of a record's fields followed by its topics.
export const tagItems = (record, root) => [
  ...record.fields.map((name) => `<li>${tagLink(name, root, "field")}</li>`),
  ...record.topics.map((name) => `<li>${tagLink(name, root, "topic")}</li>`)
].join("");

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
        ${nav("contribute/", "Contribute", "contribute")}
        <a href="${config.repositoryUrl}" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>
      <div class="header-tools">
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
        <a href="${root}tags/">Fields and topics</a>
        <a href="${root}about/">About and how to cite</a>
        <a href="${root}contribute/">Contribute</a>
        <a href="${root}api/index.json">JSON API</a>
        <a href="${config.repositoryUrl}" rel="noreferrer">Source repository</a>
      </nav>
      ${current === "home" ? `<p class="footer-note footer-credit">Developed and maintained by Bikun Li, Qicheng Tang, Chengkai Zhu, Minbo Gao, Bin Cheng, and Naixu Guo. <a href="${root}about/#contributions">Contributions</a>.</p>` : ""}
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
  <ul class="tag-list">${tagItems(record, root)}</ul>
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

// Keep batch edits chronological by creation time; exact ties use the stable ID.
export const byRecentEdit = (records) => records.slice().sort((a, b) =>
  Date.parse(b.dates.updatedAt) - Date.parse(a.dates.updatedAt)
  || Date.parse(b.dates.createdAt) - Date.parse(a.dates.createdAt)
  || a.id.localeCompare(b.id, "en"));

const equivalenceLinks = (record, root) => (record.equivalentRecords ?? []).length
  ? `<p>Equivalent question: ${(record.equivalentRecords ?? []).map((other) => `<a href="${root}problem/${other.id}/">${escape(other.title || other.id)}</a>`).join(", ")}. Counted once in question totals.</p>` : "";

export function problemRow(record, root) {
  const search = [record.title.text, record.id, ...(record.aliases ?? []), record.fields.join(" "), record.topics.join(" "), record.statement.text].join(" ").toLowerCase();
  return `<li class="problem-row status-${record.statusSlug}" data-id="${record.id}" data-status="${record.statusSlug}" data-fields="${escape(record.fields.map(slug).join(" "))}" data-topics="${escape(record.topics.map(slug).join(" "))}" data-title="${escape(record.title.text.toLowerCase())}" data-updated="${record.dates.updatedAt}" data-created="${record.dates.createdAt}" data-search="${escape(search)}">
  <div class="row-main">
    <a class="row-title" href="${root}problem/${record.id}/">${record.title.html}</a>
    <p class="row-excerpt">${leadSentenceHtml(record.statement.html)}</p>
    ${equivalenceLinks(record, root)}
    <ul class="tag-list tag-list-compact">${tagItems(record, root)}</ul>
  </div>
  <div class="row-side">
    ${statusTag(record.status)}
  </div>
</li>`;
}

export function renderProblemPage({ record, config, root, related, dates }) {
  const editUrl = `${config.repositoryUrl}/edit/${config.branch}/${config.databasePath}/${record.id}.json`;
  const historyUrl = `${config.repositoryUrl}/commits/${config.branch}/${config.databasePath}/${record.id}.json`;
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
    : `<p class="muted">No other problem shares a field or topic with this one yet.</p>`;
  const taxonomyRow = (kind, names) => `<div class="taxonomy-row">
            <dt>${names.length === 1 ? TAG_KINDS[kind].label : TAG_KINDS[kind].plural}</dt>
            <dd><ul class="tag-list">${names.map((name) => `<li>${tagLink(name, root, kind)}</li>`).join("")}</ul></dd>
          </div>`;
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
            <div class="problem-actions no-math">
              <a class="action" href="${editUrl}" rel="noreferrer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"/><path d="m13.5 6.5 3 3"/></svg>Edit</a>
              <button class="action" type="button" data-dialog="cite-dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h4v4H7zM13 7h4v4h-4zM11 11c0 3-1 4-4 5M17 11c0 3-1 4-4 5"/></svg>Cite</button>
              <button class="action" type="button" data-dialog="share-dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>Share</button>
            </div>
          </div>
          <dl class="taxonomy">
          ${taxonomyRow("field", record.fields)}
          ${taxonomyRow("topic", record.topics)}
          </dl>
          ${equivalenceLinks(record, root)}
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
            <p><a href="${historyUrl}" rel="noreferrer">View the full history on GitHub</a></p>
          </div>
          <div class="contribute-box">
            <h2>Your contribution is welcome!</h2>
            <p>Found progress, a correction, or a resolution? <a href="${editUrl}" rel="noreferrer">Edit this record on GitHub</a> and open a pull request, or <a href="${issueUrl}" rel="noreferrer">report an update</a> with the primary sources. The <a href="${root}contribute/">proposal page</a> explains the available submission route; see the <a href="${root}about/#contribute">contribution guide</a> for details.</p>
          </div>
          <div class="cite-box">
            <h2>Cite this page</h2>
            <p>${escape(`“${record.title.text},” ${config.fullName} (${config.shortName}), ID ${record.id}, accessed ${dates.today}.`)}</p>
            <p class="muted">Use the Cite button above for BibTeX and the permanent link.</p>
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
        <h3>Identifiers</h3>
        <div class="copy-block"><pre id="share-identifiers">${escape(record.id)}\n${escape(record.ulid)}</pre><button class="copy-button" type="button" data-copy="share-identifiers">Copy</button></div>
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

const byCountThenName = (counts) => [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

export function renderHome({ config, root, records, stats, fieldCounts, topicCounts, initial, dates }) {
  const questions = stats.distinctQuestions ?? stats;
  const metric = (value, label, href, cls = "") => `<a class="metric ${cls}" href="${escape(href)}"><strong>${value}</strong><span>${label}</span></a>`;
  const fields = byCountThenName(fieldCounts);
  const topTopics = byCountThenName(topicCounts).slice(0, 12);
  const total = questions.total || 1;
  const bar = ["unsolved", "solved"].map((key) => `<span class="bar-${key}" style="width:${(100 * questions[key] / total).toFixed(1)}%" title="${STATUSES[key === "unsolved" ? "Unsolved" : "Solved"].label}: ${questions[key]}"></span>`).join("");
  const body = `
    <section class="panels" aria-label="Database overview">
      <div class="panel panel-stats">
        <div class="panel-head">
          <span class="panel-note">Updated ${displayDate(dates.updated)}</span>
        </div>
        <form class="hero-search no-math" action="${root}problems/" method="get" role="search">
          <label class="visually-hidden" for="home-search">Search problems</label>
          ${SEARCH_ICON}
          <input id="home-search" name="q" type="search" placeholder="Search ${stats.total} records by title, statement, ID, field, or topic" autocomplete="off" aria-describedby="home-search-hint">
          <button class="hero-search-button" type="submit">Search</button>
        </form>
        <p class="hero-search-hint" id="home-search-hint">Click Search to explore the suggested topic, or type your own query. Press <kbd>/</kbd> to start typing.</p>
        <div class="metric-grid">
          ${metric(questions.total, "Distinct questions", `${root}problems/`)}
          ${metric(questions.unsolved, "Unsolved", `${root}problems/?status=unsolved`, "metric-unsolved")}
          ${metric(questions.solved, "Solved", `${root}problems/?status=solved`, "metric-solved")}
        </div>
        <div class="status-bar" role="img" aria-label="${questions.unsolved} unsolved, ${questions.solved} solved">${bar}</div>
        <div class="top-tags">
          <span class="top-tags-label">Fields</span>
          <ul class="tag-list">${fields.map(([tag, count]) => `<li>${tagLink(tag, root, "field", count)}</li>`).join("")}</ul>
        </div>
        <div class="top-tags">
          <span class="top-tags-label">Most frequent topics</span>
          <ul class="tag-list">${topTopics.map(([tag, count]) => `<li>${tagLink(tag, root, "topic", count)}</li>`).join("")}<li><a class="tag tag-more" href="${root}tags/#topics">All ${topicCounts.size} topics →</a></li></ul>
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
        <a class="text-link" href="${root}problems/">All problems by date →</a>
      </div>
      <ul class="recent-list">
        ${byRecentEdit(records).slice(0, 8).map((record) => `<li><time datetime="${record.dates.updatedAt}" data-localize>${displayDateTime(record.dates.updatedAt)}</time><a href="${root}problem/${record.id}/">${record.title.html}</a>${statusTag(record.status, "status-tag-small")}</li>`).join("\n        ")}
      </ul>
    </section>
`;
  return layout({
    config, root, path: "", current: "home",
    title: "",
    description: `${config.fullName}: ${questions.total} distinct questions in quantum information and quantum computation with typeset statements, sources, progress, and references.`,
    body, bodyClass: "page-home",
    extraScripts: `<script src="${root}data/index.js"></script>`
  });
}

export function renderDirectory({ config, root, records, fieldCounts, topicCounts }) {
  const questions = distinctQuestionCounts(records);
  const fields = byCountThenName(fieldCounts);
  const topics = [...topicCounts.keys()].sort((a, b) => a.localeCompare(b));
  const unsolved = records.filter((r) => r.statusSlug === "unsolved").length;
  const solved = records.filter((r) => r.statusSlug === "solved").length;
  const facet = (attr, value, label, count, active = false) =>
    `<button type="button"${active ? ' class="is-active"' : ""} data-${attr}="${value}" aria-pressed="${active}"><span class="facet-name">${label}</span><span class="facet-count">${count}</span></button>`;
  const body = `
    <section class="section-shell directory">
      <div class="section-heading">
        <div><p class="section-index">Catalog</p><h1>All records</h1></div>
        <p>${records.length} records covering ${questions.total} distinct questions. Filter counts refer to records.</p>
      </div>
      <div class="directory-layout">
        <aside class="filter-sidebar no-math" aria-label="Search and filters">
          <div class="filter-panel">
            <div class="filter-group search-field">
              <label for="problem-search">Search</label>
              <div class="search-box">
                ${SEARCH_ICON}
                <input id="problem-search" type="search" placeholder="Try “capacity”, “SIC”, “Bell”, or an ID" autocomplete="off">
              </div>
            </div>
            <fieldset class="filter-group">
              <legend>Status</legend>
              <div class="facet-list">
                ${facet("status", "all", "All", records.length, true)}
                ${facet("status", "unsolved", '<span class="facet-dot dot-unsolved"></span>Unsolved', unsolved)}
                ${facet("status", "solved", '<span class="facet-dot dot-solved"></span>Solved', solved)}
              </div>
            </fieldset>
            <fieldset class="filter-group">
              <legend>Field</legend>
              <div class="facet-list">
                ${facet("field", "all", "All fields", records.length, true)}
                ${fields.map(([tag, count]) => facet("field", slug(tag), escape(tag), count)).join("\n                ")}
              </div>
            </fieldset>
            <div class="filter-group select-filter">
              <label for="topic-filter">Topic</label>
              <select id="topic-filter"><option value="all">All topics</option>${topics.map((tag) => `<option value="${slug(tag)}">${escape(tag)} (${topicCounts.get(tag)})</option>`).join("")}</select>
            </div>
            <div class="filter-group select-filter">
              <label for="sort-filter">Sort</label>
              <select id="sort-filter"><option value="updated" selected>Newest first</option><option value="title">Title A–Z</option><option value="status">Status</option></select>
            </div>
            <button class="clear-button" id="clear-filters" type="button">Clear filters</button>
          </div>
        </aside>
        <div class="directory-results">
          <p class="results-toolbar" aria-live="polite"><strong id="results-count">${records.length}</strong> <span id="results-label">records</span></p>
          <ul class="problem-list" id="problem-list">
            ${byRecentEdit(records).map((record) => problemRow(record, root)).join("\n            ")}
          </ul>
          <div class="empty-state" id="empty-state" hidden>
            <p>No problems match these filters.</p>
            <button type="button" class="button button-ghost" data-clear-filters>Reset filters</button>
          </div>
        </div>
      </div>
    </section>`;
  return layout({
    config, root, path: "problems/", current: "problems",
    title: "All records",
    description: `Browse all ${records.length} problem records of the ${config.shortName} by status, field, topic, or keyword.`,
    body, bodyClass: "page-directory"
  });
}

export function renderTagsIndex({ config, root, taxonomy, fieldCounts, topicCounts }) {
  const usedFields = byCountThenName(fieldCounts);
  const usedTopics = [...topicCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const unusedFields = taxonomy.fields.filter((name) => !fieldCounts.has(name));
  const unusedTopics = taxonomy.topics.filter((name) => !topicCounts.has(name));
  const unused = unusedFields.length + unusedTopics.length;
  const groups = new Map();
  for (const [tag, count] of usedTopics) {
    const letter = tag[0].toUpperCase();
    if (!groups.has(letter)) groups.set(letter, []);
    groups.get(letter).push([tag, count]);
  }
  const body = `
    <section class="section-shell">
      <div class="section-heading">
        <div><p class="section-index">Taxonomy</p><h1>Fields and topics</h1></div>
      </div>
      <h2 class="taxonomy-heading" id="fields">Fields <span>${usedFields.length}</span></h2>
      <ul class="tag-list tag-list-large">${usedFields.map(([tag, count]) => `<li>${tagLink(tag, root, "field", count)}</li>`).join("")}</ul>
      <h2 class="taxonomy-heading" id="topics">Topics <span>${usedTopics.length}</span></h2>
      <div class="tag-groups">
        ${[...groups.entries()].map(([letter, entries]) => `<div class="tag-group"><h3>${letter}</h3><ul class="tag-list tag-list-large">${entries.map(([tag, count]) => `<li>${tagLink(tag, root, "topic", count)}</li>`).join("")}</ul></div>`).join("\n        ")}
      </div>
      <details class="unused-tags">
        <summary>Reserved names without problems yet (${unused})</summary>
        ${unusedFields.length ? `<p class="unused-label">Fields</p>
        <ul class="tag-list">${unusedFields.map((tag) => `<li><span class="tag tag-field tag-muted">${escape(tag)}</span></li>`).join("")}</ul>` : ""}
        ${unusedTopics.length ? `<p class="unused-label">Topics</p>
        <ul class="tag-list">${unusedTopics.map((tag) => `<li><span class="tag tag-topic tag-muted">${escape(tag)}</span></li>`).join("")}</ul>` : ""}
      </details>
    </section>`;
  return layout({
    config, root, path: "tags/", current: "tags",
    title: "Fields and topics",
    description: `The ${usedFields.length} fields and ${usedTopics.length} topics used to classify the problems of the ${config.shortName}.`,
    body, bodyClass: "page-tags", withMath: false
  });
}

export function renderTagPage({ config, root, kind, tag, tagSlug = slug(tag), historical = false, records, related }) {
  const meta = TAG_KINDS[kind];
  const otherKind = kind === "field" ? "topic" : "field";
  const counts = { unsolved: 0, solved: 0 };
  for (const record of records) counts[record.statusSlug] += 1;
  const relatedEntries = byCountThenName(related);
  const body = `
    <section class="section-shell">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Zoo</a><span aria-hidden="true">›</span><a href="${root}tags/">Fields and topics</a><span aria-hidden="true">›</span><span>${escape(tag)}</span></nav>
      <div class="section-heading">
        <div><p class="section-index">${historical ? "Historical classification" : meta.label}</p><h1>${escape(tag)}</h1></div>
        <p>${records.length} record${records.length === 1 ? "" : "s"}: ${counts.unsolved} unsolved, ${counts.solved} solved. <a class="text-link" href="${root}problems/?${historical ? "legacyTag" : kind}=${encodeURIComponent(tagSlug)}">Filter the catalog by this ${historical ? "historical classification" : kind} →</a></p>
      </div>
      ${relatedEntries.length ? `<div class="top-tags tag-page-related">
        <span class="top-tags-label">${kind === "field" ? "Topics in this field" : "Fields of these problems"}</span>
        <ul class="tag-list">${relatedEntries.map(([name, count]) => `<li>${tagLink(name, root, otherKind, count)}</li>`).join("")}</ul>
      </div>` : ""}
      <ul class="problem-list">
        ${byRecentEdit(records).map((record) => problemRow(record, root)).join("\n        ")}
      </ul>
    </section>`;
  return layout({
    config, root, path: `tag/${tagSlug}/`, current: "tags",
    title: `${tag} · ${historical ? "Historical classification" : meta.label}`,
    description: historical ? `${records.length} records from the historical classification “${tag}” of the ${config.shortName}.` : `${records.length} problem records in the ${kind} “${tag}” of the ${config.shortName}.`,
    body, bodyClass: "page-tag"
  });
}

export function renderAbout({ config, root, stats, dates }) {
  const submissionsOnline = acceptsSubmissions(config);
  const mcpServiceUrl = config.mcp.serviceUrl;
  const mcpUrl = config.mcp.url;
  const mcpConfig = JSON.stringify({
    mcpServers: {
      "quantum-open-problems": {
        url: mcpUrl
      }
    }
  }, null, 2);
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
        <p>The zoo holds ${stats.total} permanent records covering ${(stats.distinctQuestions ?? stats).total} distinct questions: ${(stats.distinctQuestions ?? stats).unsolved} unsolved and ${(stats.distinctQuestions ?? stats).solved} solved. Equivalent formulations are linked and count once in these question totals. Solved problems stay in the zoo with their resolution so that citations survive.</p>

        <h2 id="contribute">How to contribute</h2>
        <p>${submissionsOnline
          ? `Use the <a href="${root}contribute/">proposal form</a> to send a problem, its sources, and what is known. No account is needed.`
          : `Propose a problem through a <a href="${config.repositoryUrl}/issues/new?template=new-problem.yml">GitHub issue</a> (a GitHub account is required). The <a href="${root}contribute/">proposal worksheet</a> helps you prepare and copy the text; online sending is not enabled yet.`} The maintainers check proposals against the literature and publish reviewed records with credit to contributors. To add a record yourself through GitHub:</p>
        <ol>
          <li>Fork the <a href="${config.repositoryUrl}" rel="noreferrer">repository</a> and run <code>node scripts/new-problem-id.mjs --create</code> to create a problem template with permanent identifiers.</li>
          <li>Write the statement, status, source, progress, references, and comment as TeX fragments in the record's fields, following the contribution guide, and choose one or two fields and one to five topics from <code>database/tags.json</code>. Run <code>node scripts/migrate-metadata.mjs</code> after changing the classifications.</li>
          <li>Run <code>node scripts/sync-tex.mjs</code> to write the record's TeX form, then <code>node site/build.mjs</code>. The build rejects records with missing fields, unknown or miscounted fields and topics, unresolved citations, or unlabeled equations.</li>
          <li>Open a pull request. To report progress on an existing problem, use the Edit button on its page or open an issue with the primary sources.</li>
        </ol>

        <h2 id="cite">How to cite</h2>
        <p>Cite the primary sources for any mathematical claim. To cite a problem page for its statement, status, or stable identifier, use the Cite button on that page. To cite the zoo as a whole:</p>
        <div class="copy-block no-math"><pre id="zoo-bibtex">${escape(zooBib)}</pre><button class="copy-button" type="button" data-copy="zoo-bibtex">Copy</button></div>

        <h2 id="mcp"><span id="api">Use the MCP server</span></h2>
        <p>Connect your AI assistant through the Model Context Protocol (MCP) to search the zoo, read problem statements and references, and gather the known results and remaining questions for a research session.</p>
        <p>Use a client that supports remote MCP servers over Streamable HTTP. Connect with the address below; no download, local setup, or API key is needed to read the catalog.</p>
        <ol>
          <li><strong>Add the server.</strong> In your client's MCP or connector settings, add a remote server named <code>quantum-open-problems</code>. Paste this server URL and choose <strong>Streamable HTTP</strong> if a transport is requested:
            <div class="copy-block no-math"><pre id="mcp-url">${escape(mcpUrl)}</pre><button class="copy-button" type="button" data-copy="mcp-url" aria-label="Copy MCP server URL">Copy</button></div>
          </li>
          <li><strong>Connect your assistant.</strong> Save or enable the connection. For clients that accept URL entries in an <code>mcpServers</code> configuration:
            <details>
              <summary>JSON configuration for clients using <code>mcpServers</code></summary>
              <p>Add this entry to your existing configuration, then reload the client's MCP connection. Some clients use a settings form instead.</p>
              <div class="copy-block no-math"><pre id="mcp-config">${escape(mcpConfig)}</pre><button class="copy-button" type="button" data-copy="mcp-config" aria-label="Copy MCP client configuration">Copy</button></div>
            </details>
          </li>
          <li><strong>Ask a research question.</strong> For example: “Use the quantum-open-problems MCP to find unsolved problems about quantum channel capacity, then summarize one problem's known progress and references.” The assistant can use <code>search_problems</code>, <code>get_problem</code>, <code>list_references</code>, and <code>build_context</code>.</li>
        </ol>
        <p>The connection reads the current hosted catalog, including newly published problems. If it fails, check the <a href="${escape(mcpServiceUrl)}/api/v1/status" rel="noreferrer">catalog service status</a> and confirm that your client supports remote MCP. The <a href="${config.repositoryUrl}/blob/${config.branch}/mcp/README.md" rel="noreferrer">MCP setup and tool guide</a> also covers local clients and authenticated research contributions. For direct downloads, the <a href="${root}api/index.json">JSON catalog</a>, <a href="${root}api/tags.json">taxonomy</a>, and <a href="${root}llms.txt">agent guide</a> are available.</p>

        <h2 id="contributions"><span id="credits">Contributions</span></h2>
        <p>This project is developed and maintained by Bikun Li, Qicheng Tang, Chengkai Zhu, Minbo Gao, Bin Cheng, and Naixu Guo.</p>
        <p>We thank <a href="https://gauge-forge.com/" rel="noreferrer">GaugeForge</a> for its financial support of this project.</p>
        <p>Mathematics is typeset with <a href="https://www.mathjax.org/" rel="noreferrer">MathJax</a>.</p>
      </div>
    </section>`;
  return layout({
    config, root, path: "about/", current: "about",
    title: "About",
    description: `What the ${config.shortName} is, how to contribute, how to cite, and how to connect an AI assistant through MCP.`,
    body, bodyClass: "page-about", withMath: false
  });
}

// The proposal form's limits, as the inbox in service/src/submissions.ts enforces them;
// tests/contribute.test.mjs checks that the two agree.
export const PROPOSAL_LIMITS = {
  title: { min: 3, max: 300 },
  statement: { min: 20, max: 30000 },
  fields: { min: 1, max: 2 },
  topics: { min: 1, max: 5 },
  source: { max: 5000 },
  progress: { max: 30000 },
  references: { max: 30000 },
  comment: { max: 30000 },
  name: { min: 1, max: 200 },
  email: { max: 254 },
  affiliation: { max: 300 }
};

// The CAPTCHA widgets the form can carry. Both add a hidden input with the
// token to the form and verify through the same protocol on the service.
export const CAPTCHA_WIDGETS = {
  turnstile: { name: "Cloudflare Turnstile", script: "https://challenges.cloudflare.com/turnstile/v0/api.js", className: "cf-turnstile", responseField: "cf-turnstile-response", privacyUrl: "https://www.cloudflare.com/privacypolicy/" },
  hcaptcha: { name: "hCaptcha", script: "https://js.hcaptcha.com/1/api.js", className: "h-captcha", responseField: "h-captcha-response", privacyUrl: "https://www.hcaptcha.com/privacy" }
};

export function renderContribute({ config, root, taxonomy, fieldCounts, topicCounts }) {
  const settings = config.contribute ?? {};
  const submissionUrl = String(settings.submissionUrl ?? "").trim();
  const providerKey = settings.captcha?.provider ?? "turnstile";
  const widget = CAPTCHA_WIDGETS[providerKey];
  if (!widget) throw new Error(`site/config.json: contribute.captcha.provider must be one of ${Object.keys(CAPTCHA_WIDGETS).join(", ")}`);
  const siteKey = String(settings.captcha?.siteKey ?? "").trim();
  const online = acceptsSubmissions(config);
  const usesCaptcha = online && settings.spamProtection !== "basic";
  const issueUrl = `${config.repositoryUrl}/issues/new?template=new-problem.yml`;
  const L = PROPOSAL_LIMITS;
  const topics = taxonomy.topics.slice().sort((a, b) => a.localeCompare(b));
  // A dropdown of the existing names plus "Other", which opens a box for a name of the
  // contributor's own; the chosen names appear as removable pills below it.
  const picker = (kind, plural, names, counts, max, placeholder) => `<div class="picker" data-picker="${plural}" data-kind="${kind}" data-max="${max}">
              <select id="${kind}-select" aria-describedby="${kind}-select-hint">
                <option value="">${placeholder}</option>
                ${names.map((name) => `<option value="${escape(name)}">${escape(name)}${counts.get(name) ? ` (${counts.get(name)})` : ""}</option>`).join("\n                ")}
                <option value="__other__">Other: add a ${kind} of your own…</option>
              </select>
              <div class="picker-custom" hidden>
                <label class="visually-hidden" for="${kind}-custom">Name of the new ${kind}</label>
                <input id="${kind}-custom" type="text" maxlength="100" placeholder="Name the new ${kind}" autocomplete="off">
                <button class="button button-ghost button-small" type="button" data-picker-add>Add</button>
                <button class="button button-ghost button-small" type="button" data-picker-cancel>Cancel</button>
              </div>
              <ul class="tag-list picker-chosen" aria-live="polite" aria-label="Chosen ${plural}"></ul>
            </div>`;
  // A labelled control; the hint, when there is one, describes the control for assistive technology.
  const field = (id, label, control, hint = "") => `<div class="form-row">
            <label for="${id}">${label}</label>
            ${hint ? control : control.replace(` aria-describedby="${id}-hint"`, "")}
            ${hint ? `<p class="form-hint" id="${id}-hint">${hint}</p>` : ""}
          </div>`;
  const input = (id, name, attrs = "") => `<input id="${id}" name="${name}" type="text" ${attrs} aria-describedby="${id}-hint">`;
  const textarea = (id, name, rows, attrs = "") => `<textarea id="${id}" name="${name}" rows="${rows}" ${attrs} aria-describedby="${id}-hint"></textarea>`;
  const captchaSlot = usesCaptcha
    ? `<div class="${widget.className}" data-sitekey="${escape(siteKey)}" data-theme="auto"></div>
            <p class="form-hint">Verification by <a href="${widget.privacyUrl}" rel="noreferrer">${widget.name}</a>, which keeps automated submissions out of the inbox.</p>`
    : online ? "" : `<div class="form-notice" id="proposal-offline">Online sending is not enabled yet. Fill in this worksheet, use <strong>Copy as text</strong>, and paste it into a <a href="${issueUrl}" rel="noreferrer">new-problem issue on GitHub</a>. Submitting the issue requires a GitHub account. The worksheet does not send your details anywhere.</div>`;
  const body = `
    <div class="contribute-layout">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${root}">Zoo</a><span aria-hidden="true">›</span><span>Contribute</span></nav>
      <div class="section-heading">
        <div><p class="section-index">Contribute</p><h1>Propose an open problem</h1></div>
        <p>${online ? "Send a proposal without an account." : "Prepare a proposal here, then submit it through GitHub with an account."} The maintainers review proposals and publish accepted records with credit to contributors.</p>
      </div>
      <div class="contribute-routes no-math">
        <div class="route-card">
          <h2>${online ? "Use this form" : "Prepare a proposal"}</h2>
          <p>Describe the problem, where it was posed, and what is known. ${online ? "The maintainers may email you about the details." : "Copy the completed text into a GitHub issue and remove contact details you do not want to publish."} Nothing appears on the site until it has been reviewed.</p>
        </div>
        <div class="route-card">
          <h2>Or write the record yourself</h2>
          <p>Comfortable with Git and TeX? Follow the <a href="${root}about/#contribute">contribution guide</a> and open a pull request, or <a href="${issueUrl}" rel="noreferrer">open a GitHub issue</a>. Updates to an existing problem go through the Edit button on its page.</p>
        </div>
      </div>

      <form class="proposal-form no-math" id="proposal-form" novalidate data-submit-url="${escape(submissionUrl)}" data-captcha-provider="${usesCaptcha ? providerKey : ""}" data-captcha-response="${usesCaptcha ? widget.responseField : ""}" data-limits='${escape(JSON.stringify(L))}'>
        <fieldset>
          <legend>The problem</legend>
          ${field("proposal-title", "Title", input("proposal-title", "title", `required minlength="${L.title.min}" maxlength="${L.title.max}" autocomplete="off"`), "A short descriptive title, as it would head the problem page.")}
          ${field("proposal-statement", "Statement", textarea("proposal-statement", "statement", 12, `required minlength="${L.statement.min}" maxlength="${L.statement.max}" spellcheck="false"`), `Self-contained, with the definitions, hypotheses, and quantifiers a reader needs, and a checkable resolution criterion. Write mathematics as in TeX: <code>$\\ldots$</code> inline, <code>\\[ \\ldots \\]</code> or an <code>equation</code> environment for display. Up to ${L.statement.max.toLocaleString("en")} characters.`)}
          <div class="form-row form-row-inline">
            <button class="button button-ghost button-small" type="button" id="statement-preview-button">Preview</button>
            <div class="statement-preview math-ready" id="statement-preview" hidden aria-live="polite"></div>
          </div>
        </fieldset>

        <fieldset>
          <legend>Classification</legend>
          <div class="form-row">
            <label for="field-select">Fields <span class="choice-count" id="fields-count"></span></label>
            <p class="form-hint" id="field-select-hint">One or two broad research areas. Pick from the list, or choose “Other” to name one of your own. Numbers show how many problems each field holds today.</p>
            ${picker("field", "fields", taxonomy.fields, fieldCounts, L.fields.max, "Choose a field…")}
          </div>
          <div class="form-row">
            <label for="topic-select">Topics <span class="choice-count" id="topics-count"></span></label>
            <p class="form-hint" id="topic-select-hint">One to five specific objects, techniques, or settings. Pick from the list, or choose “Other” to name one of your own.</p>
            ${picker("topic", "topics", topics, topicCounts, L.topics.max, "Choose a topic…")}
          </div>
        </fieldset>

        <fieldset>
          <legend>Sources and progress</legend>
          ${field("proposal-source", "Source", textarea("proposal-source", "source", 3, `maxlength="${L.source.max}"`), "The paper or preprint that posed the problem, or the papers in which it is implicit. Write “Contributor: your name” if it has no literature source.")}
          ${field("proposal-progress", "Known progress", textarea("proposal-progress", "progress", 6, `maxlength="${L.progress.max}"`), "Results that delimit the problem, each with its source and a sentence on why it falls short of the full question.")}
          ${field("proposal-references", "References", textarea("proposal-references", "references", 6, `maxlength="${L.references.max}"`), "Full bibliographic entries with DOI and arXiv identifiers, one per line. BibTeX is welcome.")}
        </fieldset>

        <fieldset>
          <legend>Anything else</legend>
          ${field("proposal-comment", "Comment (optional)", textarea("proposal-comment", "comment", 4, `maxlength="${L.comment.max}"`), "The remaining gap, relations to problems already in the zoo (give their IDs), naming conventions, or notes for the maintainers, such as how you would like to be credited.")}
        </fieldset>

        <fieldset>
          <legend>About you</legend>
          <div class="form-grid-2">
            ${field("proposal-name", "Name", input("proposal-name", "name", `required maxlength="${L.name.max}" autocomplete="name"`), "As you would like to be credited.")}
            ${field("proposal-email", "Email", `<input id="proposal-email" name="email" type="email" required maxlength="${L.email.max}" autocomplete="email" aria-describedby="proposal-email-hint">`, "For questions about the proposal only; never published.")}
          </div>
          ${field("proposal-affiliation", "Affiliation (optional)", input("proposal-affiliation", "affiliation", `maxlength="${L.affiliation.max}" autocomplete="organization"`))}
          <div class="form-row">
            <label class="consent"><input type="checkbox" name="consent" id="proposal-consent" required><span>I agree that the maintainers store this proposal with my name and email address to review it and to contact me about it, and that the problem, once rewritten, may be published in the zoo under its <a href="${config.repositoryUrl}/blob/${config.branch}/LICENSE" rel="noreferrer">license</a> with credit to me.</span></label>
          </div>
          <div class="hp" aria-hidden="true">
            <label for="proposal-extra">Leave this field empty</label>
            <input id="proposal-extra" name="extra" type="text" tabindex="-1" autocomplete="off">
          </div>
        </fieldset>

        <div class="captcha-slot" id="captcha-slot">
          ${captchaSlot}
        </div>

        <div class="form-actions">
          <button class="button button-primary" type="submit" id="proposal-submit"${online ? "" : " disabled"}>Send proposal</button>
          <button class="button button-ghost" type="button" id="proposal-copy">Copy as text</button>
          <button class="button button-ghost" type="button" id="proposal-clear">Clear form</button>
        </div>
        <p class="form-status" id="proposal-status" role="status" aria-live="polite"></p>
      </form>

      <div class="proposal-done no-math" id="proposal-done" hidden tabindex="-1">
        <h2>Thank you, your proposal is in the inbox</h2>
        <p>Receipt <code id="proposal-receipt"></code>. The maintainers will check the sources, rewrite the statement in the zoo's format, and email you if anything is unclear. Nothing appears on the site until that review is done, so please allow some time.</p>
        <p><a href="${root}contribute/">Propose another problem</a> · <a href="${root}problems/">Browse the catalog</a></p>
      </div>
    </div>`;
  return layout({
    config, root, path: "contribute/", current: "contribute",
    title: "Propose an open problem",
    description: `Propose an open problem for the ${config.shortName}: statement, fields and topics, sources, progress, and how to reach you. Proposals are reviewed and rewritten by the maintainers before publication.`,
    body, bodyClass: "page-contribute",
    extraHead: usesCaptcha ? `<script src="${widget.script}" async defer></script>` : ""
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
