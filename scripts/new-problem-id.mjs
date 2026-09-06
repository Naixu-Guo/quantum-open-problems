#!/usr/bin/env node
// Print a fresh op_ ID, print an enriched template with --json, or create a
// correctly named JSON scaffold with --create. Scientific text is a template
// for the author to fill in; no existing problem is ever replaced.
import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRecordMetadata } from "../site/lib/metadata.mjs";
import { recordToJson, RECORD_SCHEMA } from "../site/lib/record.mjs";

const args = process.argv.slice(2);
const rootIndex = args.indexOf("--root");
if (rootIndex >= 0 && (!args[rootIndex + 1] || args[rootIndex + 1].startsWith("--"))) throw new Error("--root needs a directory");
const repoRoot = rootIndex < 0 ? path.dirname(path.dirname(fileURLToPath(import.meta.url))) : path.resolve(args.splice(rootIndex, 2)[1]);
if (args.length > 1 || args.some((arg) => !["--json", "--create"].includes(arg))) throw new Error("Usage: node scripts/new-problem-id.mjs [--json | --create]");
const id = `op_${randomBytes(8).toString("hex")}`;
if (args.length === 0) {
  console.log(id);
} else {
  const template = JSON.parse(fs.readFileSync(path.join(repoRoot, "database", "_template.json"), "utf8"));
  const { ulid: ignoredUlid, aliases: ignoredAliases, metadata: ignoredMetadata, ...content } = template;
  content.id = id;
  content.schema = RECORD_SCHEMA;
  const manifest = JSON.parse(fs.readFileSync(path.join(repoRoot, "database", "metadata.json"), "utf8"));
  const record = { ...content, ...createRecordMetadata(content, { createdAt: new Date().toISOString(), createdBy: manifest.actorId }) };
  const json = recordToJson(record);
  if (args[0] === "--json") console.log(json.trimEnd());
  else {
    const target = path.join(repoRoot, "database", "problems_json", `${id}.json`);
    fs.writeFileSync(target, json, { flag: "wx" });
    console.log(path.relative(repoRoot, target));
  }
}
