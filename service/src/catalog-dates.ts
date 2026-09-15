/** Catalog edit history is the TeX git history, never a research-result date. */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import type { Ledger } from "../../contract/src/ledger.ts";

export interface CatalogDate { createdAt: string; updatedAt: string; basis: "tex-git-history" }
export type CatalogDates = Map<string, CatalogDate>;
const cache = new Map<string, Map<string, CatalogDate | null>>();
const git = (root: string, args: string[]) => execFileSync("git", args, {
  cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 16 * 1024 * 1024,
});

export function catalogDates(mainRoot: string, ledger: Ledger): CatalogDates {
  const dates: CatalogDates = new Map();
  let root: string, historyTip: string;
  try {
    root = git(mainRoot, ["rev-parse", "--show-toplevel"]).trim();
    // A shallow boundary is not evidence of the record's original creation time.
    if (git(root, ["rev-parse", "--is-shallow-repository"]).trim() === "true") return dates;
    // Equal trees can have different histories after a revert. Anchor the cache
    // to the most recent catalog-history commit instead; activity-only commits
    // still reuse every per-file history result.
    historyTip = git(root, ["log", "-1", "--format=%H", "--", "database/problems_tex"]).trim();
    if (!historyTip) return dates;
  } catch { return dates; }
  const cacheKey = `${root}\0${historyTip}`;
  let histories = cache.get(cacheKey);
  if (!histories) {
    histories = new Map();
    if (cache.size >= 8) cache.delete(cache.keys().next().value!);
    cache.set(cacheKey, histories);
  }
  for (const problem of ledger.currentOf("Problem")) {
    const authored = problem.fields["authoredCatalog"] as { sourcePath?: string; record?: unknown } | undefined;
    const sourcePath = authored?.sourcePath;
    if (!sourcePath || !/^database\/problems_json\/op_[A-Za-z0-9]{16}\.json$/u.test(sourcePath)) continue;
    const texPath = sourcePath.replace("problems_json/", "problems_tex/").replace(/\.json$/u, ".tex");
    try {
      // A stale import must not acquire dates from a different scientific record.
      if (!isDeepStrictEqual(JSON.parse(fs.readFileSync(path.join(root, sourcePath), "utf8")), authored?.record)) continue;
      if (!fs.existsSync(path.join(root, texPath))) continue;
      let value = histories.get(texPath);
      if (value === undefined) {
        const output = git(root, ["log", "--follow", "--format=%x1e%H%x09%at", "--name-status", "--", texPath]);
        const stamps: string[] = [];
        for (const chunk of output.split("\x1e")) {
          const lines = chunk.split("\n").map(line => line.trim()).filter(Boolean);
          const [hash, seconds] = (lines[0] ?? "").split("\t");
          if (!/^[0-9a-f]{40}$/u.test(hash ?? "")) continue;
          const change = lines.slice(1).find(line => /^[A-Z]/u.test(line)) ?? "";
          if (/^R100\b/u.test(change)) continue;
          stamps.push(new Date(Number(seconds) * 1000).toISOString());
        }
        value = stamps.length ? { createdAt: stamps.at(-1)!, updatedAt: stamps[0]!, basis: "tex-git-history" } : null;
        histories.set(texPath, value);
      }
      if (value) dates.set(problem.id, value);
    } catch { /* Service-only or incomplete clones keep dates explicitly unknown. */ }
  }
  return dates;
}
