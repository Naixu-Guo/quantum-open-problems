#!/usr/bin/env node
// Append missing canonical events to catalog/events.jsonl. Run by the build
// before validation; CI rejects a commit whose ledger is behind its records.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "./catalog.mjs";
import { planLedgerUpdate, serializeLedgerEntries } from "./ledger.mjs";

// Append pending events for a loaded catalog; returns the plan.
export const syncLedger = (catalog) => {
  const plan = planLedgerUpdate(catalog);
  if (plan.errors.length) return plan;
  if (plan.appended.length) {
    const existing = fs.existsSync(catalog.paths.ledgerPath) ? fs.readFileSync(catalog.paths.ledgerPath, "utf8") : "";
    const prefix = existing.length && !existing.endsWith("\n") ? "\n" : "";
    fs.appendFileSync(catalog.paths.ledgerPath, `${prefix}${serializeLedgerEntries(plan.appended)}\n`);
  }
  return plan;
};

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const catalog = loadCatalog();
  const plan = syncLedger(catalog);
  if (plan.errors.length) {
    console.error(`Ledger sync refused ${plan.errors.length} change(s):`);
    for (const error of plan.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  if (plan.appended.length) {
    console.log(`Appended ${plan.appended.length} event(s) to catalog/events.jsonl (last sequence ${plan.appended.at(-1).sequence}).`);
  } else {
    console.log(`Ledger is current at sequence ${catalog.ledger.length}.`);
  }
}
