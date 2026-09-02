// Access to the canonical read models the service needs: the compact index,
// per-problem records, frontiers, statements, and the canonical ledger. The
// service reads the generated site/ directory (or any directory holding the
// same files) and reloads when release.json changes. It never reads
// catalog/ directly and never writes any of these files.

import fs from "node:fs";
import path from "node:path";
import { buildSearchIndex, searchIndex } from "../core/projection/search.mjs";

export const openReadModels = (siteDirectory, { reloadIntervalMs = 10000 } = {}) => {
  const apiDirectory = path.join(siteDirectory, "api", "v1");
  const releasePath = path.join(apiDirectory, "release.json");
  const readJson = (relativePath) => {
    const filePath = path.join(apiDirectory, relativePath);
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  };
  let cache = null;
  let lastCheck = 0;
  const load = () => {
    const release = readJson("release.json");
    const index = readJson("index.json");
    if (!release || !index) throw new Error(`No static API build found under ${apiDirectory}; run node site/build.mjs`);
    const search = readJson("search-index.json") || buildSearchIndex(index);
    const ledger = readJson("events.json") || { events: [], lastSequence: 0 };
    cache = {
      release,
      index,
      search,
      ledger,
      releaseMtime: fs.statSync(releasePath).mtimeMs,
      problems: new Map(),
      frontiers: new Map(),
      statements: new Map()
    };
    return cache;
  };
  const current = () => {
    const nowMs = Date.now();
    if (!cache) return load();
    if (nowMs - lastCheck > reloadIntervalMs) {
      lastCheck = nowMs;
      const mtime = fs.existsSync(releasePath) ? fs.statSync(releasePath).mtimeMs : 0;
      if (mtime !== cache.releaseMtime) return load();
    }
    return cache;
  };
  const cached = (map, key, relativePath) => {
    const state = current();
    if (!state[map].has(key)) state[map].set(key, readJson(relativePath));
    return state[map].get(key);
  };
  return {
    apiDirectory,
    siteDirectory,
    reload: () => load(),
    release: () => current().release,
    index: () => current().index,
    ledger: () => current().ledger,
    search: (options) => searchIndex(current().search, options),
    problemIds: () => {
      const index = current().index;
      return new Set([...index.problems, ...index.archived].map((problem) => problem.id));
    },
    compact: (id) => {
      const index = current().index;
      return [...index.problems, ...index.archived].find((problem) => problem.id === id) || null;
    },
    problem: (id) => cached("problems", id, path.join("problems", `${id}.json`)),
    frontier: (id) => cached("frontiers", id, path.join("problems", id, "frontier.json")),
    claims: (id) => readJson(path.join("problems", id, "claims.json")),
    statement: (id, version) => cached("statements", `${id}/${version}`, path.join("problems", id, "statements", `v${version}.json`)),
    statementById: (id, statementId) => {
      const frontier = cached("frontiers", id, path.join("problems", id, "frontier.json"));
      const entry = frontier?.history?.statementVersions?.find((statement) => statement.id === statementId);
      return entry ? cached("statements", `${id}/${entry.version}`, path.join("problems", id, "statements", `v${entry.version}.json`)) : null;
    },
    staticFile: (relativePath) => {
      const filePath = path.resolve(siteDirectory, `.${relativePath}`);
      if (!filePath.startsWith(`${siteDirectory}${path.sep}`)) return null;
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return null;
      return filePath;
    }
  };
};
