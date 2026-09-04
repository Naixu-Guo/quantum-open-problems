#!/usr/bin/env node
// Build the QIQCOP Zoo static site from database/problems_json/*.json into dist/.
//
//   node site/build.mjs            # build into <repo>/dist
//   node site/build.mjs --out DIR  # build somewhere else
//
// The build validates every record and fails loudly on a malformed JSON
// record, unsupported text-mode TeX, unknown tags, unresolved citations,
// unlabeled equations, or a TeX file in database/problems_tex that is missing
// or disagrees with its JSON record.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseTexRecord, renderRecord, STATUSES, slug, TexError } from "./lib/tex.mjs";
import { validateRecordShape, canonicalJson, recordDifferences, RecordError } from "./lib/record.mjs";
import {
  renderHome, renderProblemPage, renderDirectory, renderTagsIndex, renderTagPage,
  renderAbout, renderRandomPage, renderNotFound
} from "./lib/render.mjs";

const siteDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(siteDir);
const config = JSON.parse(fs.readFileSync(path.join(siteDir, "config.json"), "utf8"));
const databaseDir = path.join(repoRoot, config.databasePath);
const texDir = path.join(repoRoot, config.texPath);
const tagsPath = path.join(repoRoot, "database", "tags.json");

// Short content hashes so browsers refetch changed assets (favicons are cached aggressively).
const assetVersion = (name) => createHash("sha256").update(fs.readFileSync(path.join(siteDir, "assets", name))).digest("hex").slice(0, 8);
config.assetVersions = { favicon: assetVersion("favicon.svg"), styles: assetVersion("styles.css"), app: assetVersion("app.js") };

const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const outDir = outIndex >= 0 ? path.resolve(args[outIndex + 1]) : path.join(repoRoot, "dist");
const today = new Date().toISOString().slice(0, 10);

const write = (relative, content) => {
  const target = path.join(outDir, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};

// ---------------------------------------------------------------------------
// Load and validate records
// ---------------------------------------------------------------------------

const canonicalTags = JSON.parse(fs.readFileSync(tagsPath, "utf8")).tags;
if (new Set(canonicalTags).size !== canonicalTags.length) throw new Error("database/tags.json contains duplicate tags");
const canonicalSet = new Set(canonicalTags);

// Creation and last-edit times from git history, to the second. The history
// of a record is the history of its TeX file, which has accompanied the
// record since the zoo's TeX-only days and is regenerated on every content
// change; it is followed across renames, and a pure rename is not an edit.
// Files that are not committed yet fall back to their modification time.
const toPosix = (value) => value.split(path.sep).join("/");
const gitHistory = (relativePath) => {
  const output = execFileSync("git", ["log", "--follow", "--format=%x1e%H%x09%at", "--name-status", "--", toPosix(relativePath)], {
    cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"]
  });
  const commits = [];
  for (const chunk of output.split("\x1e")) {
    const lines = chunk.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const [hash, at] = lines[0].split("\t");
    if (!/^[0-9a-f]{40}$/.test(hash ?? "")) continue;
    const status = lines.slice(1).find((line) => /^[A-Z]/.test(line)) ?? "";
    if (/^R100\b/.test(status)) continue;
    commits.push({ hash, at: new Date(Number(at) * 1000).toISOString() });
  }
  return commits;
};
const gitDates = (historyPath, fallbackPath) => {
  const fromMtime = () => {
    const stamp = fs.statSync(path.join(repoRoot, fallbackPath)).mtime.toISOString();
    return { created: stamp.slice(0, 10), updated: stamp.slice(0, 10), createdAt: stamp, updatedAt: stamp, revisions: 0, tracked: false };
  };
  try {
    const stamps = gitHistory(historyPath).map((commit) => commit.at);
    if (stamps.length === 0) return fromMtime();
    const updatedAt = stamps[0];
    const createdAt = stamps[stamps.length - 1];
    return { created: createdAt.slice(0, 10), updated: updatedAt.slice(0, 10), createdAt, updatedAt, revisions: stamps.length, tracked: true };
  } catch {
    return fromMtime();
  }
};

const readJson = (filePath, name) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new RecordError(`${name}: invalid JSON (${error.message})`);
  }
};

const jsonFiles = fs.readdirSync(databaseDir).filter((name) => name.endsWith(".json")).sort();
const strayTex = new Set(fs.readdirSync(texDir).filter((name) => name.endsWith(".tex")));
const records = [];
const errors = [];
for (const name of jsonFiles) {
  const filePath = path.join(databaseDir, name);
  try {
    const stored = validateRecordShape(readJson(filePath, name), name);
    if (`${stored.id}.json` !== name) throw new RecordError(`${name}: file name does not match the record ID ${stored.id}`);
    const record = renderRecord(stored, { canonicalTags: canonicalSet, fileName: name });

    // The TeX companion must exist and carry the same content.
    const texName = `${stored.id}.tex`;
    const texPath = path.join(texDir, texName);
    const fix = `run: node scripts/sync-tex.mjs ${stored.id}`;
    if (!fs.existsSync(texPath)) throw new RecordError(`${name}: ${config.texPath}/${texName} is missing; ${fix}`);
    const sourceTex = fs.readFileSync(texPath, "utf8");
    let fromTex;
    try {
      fromTex = parseTexRecord(sourceTex, { fileName: texName });
    } catch (error) {
      throw new RecordError(`${name}: ${config.texPath}/${texName} cannot be parsed (${error.message}); ${fix}`);
    }
    const differences = recordDifferences(stored, fromTex);
    if (differences.length) throw new RecordError(`${name}: ${config.texPath}/${texName} disagrees with the JSON record in ${differences.join(", ")}; ${fix}`);
    strayTex.delete(texName);

    record.sourceTex = sourceTex;
    record.sha256 = createHash("sha256").update(canonicalJson(stored)).digest("hex");
    record.dates = gitDates(path.relative(repoRoot, texPath), path.relative(repoRoot, filePath));
    records.push(record);
  } catch (error) {
    errors.push(error instanceof TexError || error instanceof RecordError ? error.message : `${name}: ${error.stack}`);
  }
}
for (const name of strayTex) {
  errors.push(`${config.texPath}/${name} has no JSON record in ${config.databasePath}; import it with node scripts/import-problems.mjs or delete it`);
}
if (errors.length) {
  console.error(`Build failed with ${errors.length} invalid record(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
const seen = new Map();
for (const record of records) {
  if (seen.has(record.id)) errors.push(`duplicate ID ${record.id} in ${seen.get(record.id)} and ${record.file}`);
  seen.set(record.id, record.file);
}
if (errors.length) {
  console.error(`Build failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
records.sort((a, b) => a.title.text.localeCompare(b.title.text, "en"));

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

const stats = { total: records.length, unsolved: 0, solved: 0, references: 0, equations: 0 };
const tagCounts = new Map();
for (const record of records) {
  stats[record.statusSlug] += 1;
  stats.references += record.references.length;
  stats.equations += record.equations.length;
  for (const tag of record.tags) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
}
const dates = {
  today,
  updated: records.reduce((latest, record) => (record.dates.updated > latest ? record.dates.updated : latest), "0000-00-00")
};
if (dates.updated === "0000-00-00") dates.updated = today;

const relatedFor = (record) => records
  .filter((other) => other.id !== record.id)
  .map((other) => {
    const shared = record.tags.filter((tag) => other.tags.includes(tag));
    const union = new Set([...record.tags, ...other.tags]).size;
    return { record: other, shared, score: shared.length / union };
  })
  .filter((item) => item.shared.length > 0)
  .sort((a, b) => b.score - a.score || b.shared.length - a.shared.length || a.record.title.text.localeCompare(b.record.title.text))
  .slice(0, 6);

const pools = {
  unsolved: records.filter((record) => record.statusSlug !== "solved"),
  solved: records.filter((record) => record.statusSlug === "solved")
};
if (pools.unsolved.length === 0 || pools.solved.length === 0) {
  throw new Error("The home page needs at least one unsolved and one solved problem");
}
const initial = { unsolved: pools.unsolved[0], solved: pools.solved[0] };
const randomPayload = `window.QIQCOP_RANDOM = ${JSON.stringify({ unsolved: pools.unsolved.map((r) => r.id), solved: pools.solved.map((r) => r.id) })};\n`;
config.assetVersions.random = createHash("sha256").update(randomPayload).digest("hex").slice(0, 8);

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

// Clear the output directory without deleting the directory itself, so that
// attributes such as a Dropbox "ignored" flag on dist/ survive rebuilds.
fs.mkdirSync(outDir, { recursive: true });
for (const entry of fs.readdirSync(outDir)) fs.rmSync(path.join(outDir, entry), { recursive: true, force: true });

write("index.html", renderHome({ config, root: "", records, stats, tagCounts, initial, dates }));
write("problems/index.html", renderDirectory({ config, root: "../", records, tagCounts }));
write("tags/index.html", renderTagsIndex({ config, root: "../", tagCounts, canonicalTags }));
write("about/index.html", renderAbout({ config, root: "../", stats, dates }));
write("404.html", renderNotFound({ config, root: "/" + config.siteUrl.replace(/^https?:\/\/[^/]+\/?/, "") }));

for (const record of records) {
  const root = "../../";
  write(`problem/${record.id}/index.html`, renderProblemPage({ record, config, root, related: relatedFor(record), dates }));
  write(`problem/${record.id}/${record.id}.tex`, record.sourceTex);
}

for (const [tag, count] of tagCounts) {
  const tagged = records.filter((record) => record.tags.includes(tag));
  if (tagged.length !== count) throw new Error(`tag count mismatch for ${tag}`);
  write(`tag/${slug(tag)}/index.html`, renderTagPage({ config, root: "../../", tag, records: tagged }));
}

for (const [pool, label] of [["unsolved", "unsolved"], ["solved", "solved"]]) {
  const ids = pools[pool].map((record) => ({ id: record.id, title: record.title.html }));
  write(`random/${pool}/index.html`, renderRandomPage({ config, root: "../../", pool, ids, label }));
}

// Assets
for (const asset of fs.readdirSync(path.join(siteDir, "assets"))) {
  write(`assets/${asset}`, fs.readFileSync(path.join(siteDir, "assets", asset)));
}
write(".nojekyll", "");
write("data/random.js", randomPayload);

// Client-side index for the random panels and search.
const indexEntries = records.map((record) => ({
  id: record.id,
  title: record.title.html,
  titleText: record.title.text,
  status: record.status,
  statusSlug: record.statusSlug,
  tags: record.tags,
  statement: record.statement.html,
  updated: record.dates.updated,
  updatedAt: record.dates.updatedAt,
  references: record.references.length,
  equations: record.equations.length
}));
write("data/index.js", `window.QIQCOP_INDEX = ${JSON.stringify({ generated: today, updated: dates.updated, problems: indexEntries })};\n`);

// JSON API
const siteUrl = config.siteUrl.replace(/\/$/, "");
const apiIndex = {
  name: config.fullName,
  shortName: config.shortName,
  siteUrl: config.siteUrl,
  repositoryUrl: config.repositoryUrl,
  generated: today,
  updated: dates.updated,
  counts: { total: stats.total, unsolved: stats.unsolved, solved: stats.solved, tags: tagCounts.size, references: stats.references, equations: stats.equations },
  problems: records.map((record) => ({
    id: record.id,
    title: record.title.text,
    status: record.status,
    tags: record.tags,
    statement: record.statement.text,
    url: `${siteUrl}/problem/${record.id}/`,
    json: `${siteUrl}/api/problems/${record.id}.json`,
    tex: `${siteUrl}/problem/${record.id}/${record.id}.tex`,
    created: record.dates.created,
    updated: record.dates.updated,
    createdAt: record.dates.createdAt,
    updatedAt: record.dates.updatedAt,
    sha256: record.sha256
  }))
};
write("api/index.json", `${JSON.stringify(apiIndex, null, 2)}\n`);
write("api/tags.json", `${JSON.stringify({
  generated: today,
  tags: canonicalTags.map((tag) => ({ tag, slug: slug(tag), count: tagCounts.get(tag) ?? 0, url: tagCounts.has(tag) ? `${siteUrl}/tag/${slug(tag)}/` : null }))
}, null, 2)}\n`);
for (const record of records) {
  const payload = {
    schema: "qiqcop-zoo/problem/1",
    id: record.id,
    url: `${siteUrl}/problem/${record.id}/`,
    title: { tex: record.title.tex, html: record.title.html, text: record.title.text },
    status: record.status,
    tags: record.tags,
    created: record.dates.created,
    updated: record.dates.updated,
    createdAt: record.dates.createdAt,
    updatedAt: record.dates.updatedAt,
    statement: record.statement,
    source: record.source,
    progress: record.progress,
    comment: record.comment,
    references: record.references,
    equations: record.equations,
    related: relatedFor(record).map((item) => ({ id: item.record.id, title: item.record.title.text, sharedTags: item.shared })),
    sha256: record.sha256,
    sourceTex: record.sourceTex
  };
  write(`api/problems/${record.id}.json`, `${JSON.stringify(payload, null, 2)}\n`);
}

// Sitemap, robots, llms.txt
const urls = [
  "", "problems/", "tags/", "about/",
  ...records.map((record) => `problem/${record.id}/`),
  ...[...tagCounts.keys()].map((tag) => `tag/${slug(tag)}/`)
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${siteUrl}/${url}</loc><lastmod>${dates.updated}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /random/\nSitemap: ${siteUrl}/sitemap.xml\n`);
write("llms.txt", `# ${config.fullName} (${config.shortName})

> ${config.tagline}

The zoo holds ${stats.total} problems (${stats.unsolved} unsolved, ${stats.solved} solved). Each record has a self-contained statement with TeX mathematics, a source attribution, scoped progress items, a comment on the remaining gap, and full references with alpha-style labels.

## Machine-readable access

- ${siteUrl}/api/index.json: every problem with title, status, tags, plain-text statement, and links.
- ${siteUrl}/api/problems/<id>.json: one full record (TeX source, HTML, plain text, references, equation labels).
- ${siteUrl}/api/tags.json: the tag taxonomy with counts.
- ${siteUrl}/problem/<id>/<id>.tex: the TeX form of one record.

## Contributing

Records are JSON files in ${config.repositoryUrl}/tree/${config.branch}/${config.databasePath}, with a TeX form of each in ${config.texPath}. Follow database/_template.json and open a pull request; the build validates every record.
`);

console.log(`Built ${records.length} problems, ${tagCounts.size} tags into ${path.relative(repoRoot, outDir) || "."}`);
console.log(`Status: ${stats.unsolved} unsolved, ${stats.solved} solved; ${stats.references} references; ${stats.equations} equations.`);
const untracked = records.filter((record) => !record.dates.tracked).length;
if (untracked) console.log(`Note: ${untracked} record(s) have no git history yet; today's date is used for them.`);
