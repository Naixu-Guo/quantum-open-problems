import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const siteDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.dirname(siteDirectory);
const dataPath = path.join(siteDirectory, "data", "problems.js");
const source = fs.readFileSync(dataPath, "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { filename: dataPath });

const catalog = sandbox.window.QI_OPEN_PROBLEMS;
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert(catalog && typeof catalog === "object", "Catalog object is missing");
assert(/^\d{4}-\d{2}-\d{2}$/.test(catalog?.meta?.audited || ""), "Audit date must be YYYY-MM-DD");
assert(Array.isArray(catalog?.problems), "problems must be an array");

if (Array.isArray(catalog?.problems)) {
  const required = ["id", "title", "status", "category", "collection", "proposed", "summary", "remaining", "latest"];
  const seen = new Set();
  const statusCounts = { open: 0, partial: 0 };
  const researchDate = /^\d{4}(?:-\d{2}-\d{2})?$/;

  for (const [index, problem] of catalog.problems.entries()) {
    const location = `problems[${index}]`;
    for (const key of required) assert(Boolean(problem[key]), `${location}.${key} is required`);
    assert(!seen.has(problem.id), `Duplicate problem id: ${problem.id}`);
    seen.add(problem.id);
    assert(["open", "partial"].includes(problem.status), `${problem.id}: invalid status ${problem.status}`);
    if (problem.status in statusCounts) statusCounts[problem.status] += 1;
    assert(researchDate.test(problem.latest), `${problem.id}: latest must be YYYY or YYYY-MM-DD`);
    assert(Array.isArray(problem.progress) && problem.progress.length > 0, `${problem.id}: progress must not be empty`);

    const progressDates = [];
    for (const [progressIndex, item] of (problem.progress || []).entries()) {
      const itemLocation = `${problem.id}.progress[${progressIndex}]`;
      assert(researchDate.test(item.date), `${itemLocation}.date must be YYYY or YYYY-MM-DD`);
      assert(Boolean(item.title), `${itemLocation}.title is required`);
      assert(Boolean(item.detail), `${itemLocation}.detail is required`);
      assert(Boolean(item.maturity), `${itemLocation}.maturity is required`);
      assert(Boolean(item.strength), `${itemLocation}.strength is required`);
      if (item.url) assert(/^https:\/\//.test(item.url), `${itemLocation}.url must use HTTPS`);
      progressDates.push(item.date);
    }
    const newest = progressDates.sort().at(-1);
    assert(problem.latest === newest, `${problem.id}: latest must equal newest progress date (${newest})`);
  }

  assert(catalog.problems.length === 33, `Expected 33 active problems, found ${catalog.problems.length}`);
  assert(statusCounts.open === 23, `Expected 23 open problems, found ${statusCounts.open}`);
  assert(statusCounts.partial === 10, `Expected 10 partial problems, found ${statusCounts.partial}`);

  const sourceDirectory = path.join(repositoryRoot, "open_prob");
  if (fs.existsSync(sourceDirectory)) {
    const sourceStatus = new Map();
    const activeSourceIds = fs.readdirSync(sourceDirectory).filter((id) => {
      const metadataPath = path.join(sourceDirectory, id, "metadata.json");
      if (!fs.existsSync(metadataPath)) return false;
      const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
      sourceStatus.set(id, metadata.status === "partially_solved" ? "partial" : metadata.status);
      return metadata.status !== "solved";
    });
    const missing = activeSourceIds.filter((id) => !seen.has(id));
    const extra = [...seen].filter((id) => !activeSourceIds.includes(id));
    assert(missing.length === 0, `Active source records missing from site: ${missing.join(", ")}`);
    assert(extra.length === 0, `Site records not active in source: ${extra.join(", ")}`);
    for (const problem of catalog.problems) {
      assert(problem.status === sourceStatus.get(problem.id), `${problem.id}: site status ${problem.status} disagrees with source status ${sourceStatus.get(problem.id)}`);
    }
  }
}

assert(Array.isArray(catalog?.watchlist) && catalog.watchlist.length >= 4, "watchlist must contain at least four entries");

if (failures.length) {
  console.error(`Catalog validation failed with ${failures.length} error(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Catalog validation passed: 33 active problems (23 open, 10 partially solved).");
}
