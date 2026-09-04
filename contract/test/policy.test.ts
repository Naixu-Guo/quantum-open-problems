import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaDir = path.join(here, "..", "schema");
const policyPath = path.join(here, "..", "policy", "v1.md");

function enumValues(node: unknown, out: Set<string>): void {
  if (Array.isArray(node)) {
    for (const item of node) enumValues(item, out);
    return;
  }
  if (node && typeof node === "object") {
    for (const [key, value] of Object.entries(node)) {
      if (key === "enum" && Array.isArray(value)) {
        for (const item of value) if (typeof item === "string") out.add(item);
      } else {
        enumValues(value, out);
      }
    }
  }
}

test("every vocabulary value in the schemas has a definition line in the policy", () => {
  const policy = fs.readFileSync(policyPath, "utf8");
  const values = new Set<string>();
  for (const file of fs.readdirSync(schemaDir)) {
    if (!file.endsWith(".schema.json") || file === "tombstone.schema.json") continue;
    enumValues(JSON.parse(fs.readFileSync(path.join(schemaDir, file), "utf8")), values);
  }
  const structural = new Set(["1.0", "Problem", "Statement", "Claim", "Source", "Reference", "Actor", "Trajectory", "Contribution", "Artifact", "Review", "Comment", "Decision"]);
  const missing = [...values].filter((value) => !structural.has(value) && !policy.includes(`\`${value}\``));
  assert.deepEqual(missing, []);
});

test("the policy header parses and names its version", () => {
  const text = fs.readFileSync(policyPath, "utf8");
  const header = text.slice(4, text.indexOf("\n---\n"));
  const policy = parseYaml(header) as Record<string, unknown>;
  assert.equal(policy["policyVersion"], "1");
  assert.ok(policy["thresholds"] && typeof policy["thresholds"] === "object");
});
