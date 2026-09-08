import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildLedger, exportLedger, htmlToMarkdown, serializeRecord, statementDigest } from "../scripts/export-ledger.mjs";
import { deterministicUlid, metadataSlug } from "../site/lib/metadata.mjs";
import { texToHtml } from "../site/lib/tex.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function parse(text) {
  const close = text.indexOf("\n---\n");
  const fields = Object.fromEntries(text.slice(4, close).split("\n").map((line) => {
    const colon = line.indexOf(": ");
    return [line.slice(0, colon), JSON.parse(line.slice(colon + 2))];
  }));
  return { ...fields, body: text.slice(close + 5).replace(/\n$/, "") };
}

const projection = buildLedger(root);

test("the authoritative export round-trips every authored record and both public identifiers", () => {
  assert.equal(projection.counts.Problem, projection.records.length);
  assert.equal(projection.counts.Statement, projection.records.length);
  for (const type of ["Review", "Decision", "Claim", "Contribution", "Trajectory"]) assert.equal(projection.counts[type], undefined);
  for (const original of projection.records) {
    const dir = `ledger/problems/${metadataSlug(original.id)}`;
    const problem = parse(projection.files.get(`${dir}/problem.r1.md`));
    const statement = parse(projection.files.get(`${dir}/statements/v1.md`));
    assert.deepEqual(problem.authoredCatalog.record, original);
    const canonical = projection.records.find(record => record.ulid === problem.authoredCatalog.mergedIntoProblemId);
    assert.equal(problem.authoredCatalog.status, canonical?.status ?? original.status);
    assert.equal(problem.id, original.ulid);
    assert.equal(problem.aliases[0], metadataSlug(original.id));
    for (const alias of original.aliases) assert.ok(problem.aliases.includes(alias));
    assert.deepEqual(problem.areaIds, original.metadata.areaIds);
    assert.deepEqual(problem.topicIds, original.metadata.topicIds);
    assert.equal(problem.revision, 1);
    assert.equal(statement.clauses[0].text, original.statement);
    assert.equal(statement.digest, statementDigest(statement.body));
    assert.equal(statement.supersedes, null);
  }
  const taxonomy = parse(projection.files.get("ledger/taxonomy.r1.md"));
  const authored = JSON.parse(fs.readFileSync(path.join(root, "database/tags.json"), "utf8"));
  assert.equal(taxonomy.independentTopics, true);
  assert.deepEqual(taxonomy.areas.map((area) => area.label), authored.fields);
  assert.deepEqual(taxonomy.topics.map((topic) => topic.label), authored.topics);
  assert.ok(taxonomy.topics.every((topic) => topic.areaId === null));
});

test("Markdown conversion preserves nested math environments and working reference links", () => {
  const nested = texToHtml("$\\text{See Eq.~\\eqref{eq:known}}$", { equationNumbers: new Map([["eq:known", 2]]) });
  assert.ok(nested.includes("\\text{See Eq.~(2)}"));
  assert.throws(() => texToHtml("$\\text{See Eq.~\\eqref{eq:missing}}$", { equationNumbers: new Map() }), /no matching labeled equation/);
  const tex = "Let $x$ satisfy \\begin{equation*}\\begin{aligned}x&=1\\\\y&=2\\end{aligned}\\end{equation*}. See \\href{https://example.org/a(b)}{a source}.";
  const markdown = htmlToMarkdown(texToHtml(tex));
  assert.match(markdown, /Let \$x\$/);
  assert.ok(markdown.includes("$$\n\\begin{aligned}x&=1\\\\y&=2\\end{aligned}\n$$"));
  assert.ok(markdown.includes("[a source](https://example.org/a\\(b\\))"));
  assert.doesNotMatch(markdown, /\\begin\{aligned\}\}/);
  assert.doesNotMatch(markdown.split(". See")[0], /\\\(|\\\[/);
  const controlSpace = htmlToMarkdown(texToHtml("\\begin{equation*}x,\\ \ny\\end{equation*}"));
  assert.ok(controlSpace.includes("x,\\ %\ny"), "preserve the TeX control space before a comment marker");
  for (const [name, text] of projection.files) {
    if (!name.endsWith(".md") || !text.startsWith("---\n")) continue;
    const body = parse(text).body;
    assert.doesNotMatch(body, /[ \t]+$/m, name);
    const withoutMath = body.replace(/\$\$[\s\S]*?\$\$/g, "").replace(/(?<!\\)\$(?:\\.|[^$\\])*\$/g, "");
    assert.doesNotMatch(withoutMath, /(?<!\\)\$/, name);
    assert.doesNotMatch(withoutMath, /\\(?:begin|end|mathcal|mathbb|frac|rho|sigma|eqref|label)\b/, name);
  }
});

test("catalog updates append versions while preserving pinned research history", async () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "qop-ledger-test-"));
  try {
    fs.mkdirSync(path.join(fixture, "database/problems_json"), { recursive: true });
    for (const name of ["metadata.json", "actors.json", "tags.json"]) fs.copyFileSync(path.join(root, "database", name), path.join(fixture, "database", name));
    const original = projection.records[0];
    const sourcePath = path.join(fixture, "database/problems_json", `${original.id}.json`);
    fs.writeFileSync(sourcePath, JSON.stringify(original));
    for (const dir of ["ledger", "activity"]) {
      fs.mkdirSync(path.join(fixture, dir));
      fs.writeFileSync(path.join(fixture, dir, "stale.md"), "Stale main database record");
    }
    await assert.rejects(exportLedger({ root: fixture }), /requires --replace-authoritative/);
    await exportLedger({ root: fixture, replaceAuthoritative: true });
    for (const dir of ["ledger", "activity"]) assert.equal(fs.existsSync(path.join(fixture, dir, "stale.md")), false);
    await exportLedger({ root: fixture, check: true });
    const statementPath = path.join(fixture, "ledger/problems", metadataSlug(original.id), "statements/v1.md");
    const statement = parse(fs.readFileSync(statementPath, "utf8"));
    const comment = {
      id: deterministicUlid("future-test-comment"), type: "Comment", schemaVersion: "1.0", revision: 1,
      createdBy: original.metadata.createdBy, createdAt: original.metadata.createdAt,
      targetType: "statement", targetId: statement.id, parentCommentId: null, promotedToContributionId: null,
      body: "A later activity record attached to this formulation."
    };
    const commentPath = path.join(fixture, "activity/comments/statement", statement.id, `${comment.id}.r1.md`);
    fs.mkdirSync(path.dirname(commentPath), { recursive: true });
    const commentText = serializeRecord(comment);
    fs.writeFileSync(commentPath, commentText);
    await exportLedger({ root: fixture });
    assert.equal(fs.readFileSync(commentPath, "utf8"), commentText);
    const before = fs.readFileSync(statementPath, "utf8");
    fs.writeFileSync(sourcePath, JSON.stringify({ ...original, statement: `${original.statement}\nAn additional authored clarification.` }));
    await assert.rejects(exportLedger({ root: fixture, check: true }), /Ledger export drift/);
    await exportLedger({ root: fixture });
    const newer = parse(fs.readFileSync(statementPath.replace("v1.md", "v2.md"), "utf8"));
    assert.equal(newer.version, 2);
    assert.equal(newer.supersedes, statement.id);
    assert.notEqual(newer.id, statement.id);
    assert.equal(newer.clauses[0].supersedesClauseId, null, "changed statements must not inherit old resolution claims");
    await exportLedger({ root: fixture, check: true });
    assert.equal((await exportLedger({ root: fixture })).changed, 0, "repeat export is a no-op");
    assert.equal(fs.readFileSync(statementPath, "utf8"), before);
    assert.equal(fs.readFileSync(commentPath, "utf8"), commentText);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});


test("renderer-only catalog versions preserve explicit lineage and repair pinned historical edges", async () => {
  const { validateLedger } = await import("../contract/src/validate.ts");
  const { clauseOutcome } = await import("../contract/src/derive.ts");
  const { ledger, issues } = validateLedger([path.join(root, "ledger"), path.join(root, "activity")]);
  assert.deepEqual(issues, []);
  // The ledger retains the preserved identity of the removed duplicate record
  // op_12fc55f67580588e, whose renderer-only revision carries catalog-export trust only.
  const problemId = "01M1HME780WGX30SANKVAEX4S2";
  const versions = ledger.currentOf("Statement").filter((s) => s.fields.problemId === problemId).sort((a, b) => a.fields.version - b.fields.version);
  const [first, second] = versions;
  assert.equal(first.fields.clauses[0].text, second.fields.clauses[0].text);
  assert.notEqual(first.fields.digest, second.fields.digest);
  const historicalClaim = [{ clauseIds: [`${first.id}#main`], relation: "resolves" }];
  assert.equal(clauseOutcome(ledger, `${second.id}#main`, historicalClaim), "resolved");
  ledger.catalogExports.clear();
  assert.equal(clauseOutcome(ledger, `${second.id}#main`, historicalClaim), "open", "untrusted service statements need explicit lineage");

  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "qop-renderer-lineage-"));
  try {
    fs.cpSync(path.join(root, "database"), path.join(fixture, "database"), { recursive: true });
    await exportLedger({ root: fixture });
    const manifestPath = path.join(fixture, "ledger/export-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath));
    const key = "ledger/problems/op-25e23d6e92ebce9d/statements/v1.md";
    // Simulate a previous renderer's body, preserving the exact clause TeX.
    const file = path.join(fixture, key);
    const previous = parse(fs.readFileSync(file, "utf8"));
    previous.body += "\n\nEarlier renderer output.";
    previous.digest = statementDigest(previous.body);
    const bytes = serializeRecord(previous);
    fs.writeFileSync(file, bytes);
    const { createHash } = await import("node:crypto");
    const hash = (value) => createHash("sha256").update(value).digest("hex");
    manifest.fileHashes[key] = hash(bytes);
    manifest.projections[key].digest = hash(bytes);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest));
    await exportLedger({ root: fixture });
    const next = parse(fs.readFileSync(file.replace("v1.md", "v2.md"), "utf8"));
    assert.equal(next.clauses[0].supersedesClauseId, `${previous.id}#main`);
    assert.equal(fs.readFileSync(file, "utf8"), bytes);
  } finally { fs.rmSync(fixture, { recursive: true, force: true }); }
});
