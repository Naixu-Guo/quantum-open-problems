/**
 * Usage: node --experimental-strip-types src/cli/validate.ts <ledger-root> [activity-root ...]
 */
import path from "node:path";
import { validateLedger } from "../validate.ts";
import { summarizeProblems, contributionState, verificationLevel } from "../derive.ts";
import { RECORD_TYPES } from "../targets.ts";

const roots = process.argv.slice(2).map((root) => path.resolve(root));
if (roots.length === 0) {
  console.error("usage: validate <ledger-root> [activity-root ...]");
  process.exit(2);
}

const { ledger, issues } = validateLedger(roots);

console.log(`Ledger roots: ${roots.join(", ")}`);
console.log("Records:");
for (const type of RECORD_TYPES) {
  const all = ledger.byType.get(type) ?? [];
  if (all.length > 0) console.log(`  ${type.padEnd(13)} ${String(all.length).padStart(4)}  (${ledger.currentOf(type).length} current)`);
}

console.log("Problems:");
for (const summary of summarizeProblems(ledger)) {
  const clauses = summary.clauses.map((clause) => `${clause.ref.split("#")[1]}=${clause.status}`).join(", ");
  console.log(`  ${summary.alias}  [${summary.role}] ${summary.catalogState}/${summary.status}${summary.indexed ? " indexed" : ""}  clauses: ${clauses}`);
}

console.log("Contributions:");
for (const contribution of ledger.currentOf("Contribution")) {
  console.log(`  ${contribution.id}  ${String(contribution.fields["kind"]).padEnd(18)} ${contributionState(ledger, contribution.id)}/${verificationLevel(ledger, contribution.id)}`);
}

if (issues.length > 0) {
  console.error(`\n${issues.length} issue(s):`);
  for (const issue of issues) console.error(`  [${issue.category}] ${issue.path}: ${issue.message}`);
  process.exit(1);
}
console.log("\nLedger is valid.");
