import { test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseRecordText, serializeRecord } from "../src/record.ts";
import { validateLedger } from "../src/validate.ts";

const fixtures = fileURLToPath(new URL("../fixtures/", import.meta.url));
const bytesHash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const fieldHash = (value: unknown) => bytesHash(JSON.stringify(value));
const problemPath = "ledger/problems/v2-quantum-capacity-qubit-pauli-channel/problem.r1.md";

function fixture(t: TestContext) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qop-projection-proof-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const directory of ["ledger", "activity"]) fs.cpSync(path.join(fixtures, directory), path.join(root, directory), { recursive: true });
  const roots = [path.join(root, "ledger"), path.join(root, "activity")];
  assert.deepEqual(validateLedger(roots).issues, []);
  const original = parseRecordText(problemPath, fs.readFileSync(path.join(root, problemPath), "utf8"));
  const authoredCatalog = { status: "Unsolved", sourcePath: "database/problems_json/op_0123456789abcdef.json", record: { source: "An authored attribution.", progress: ["The complete authored progress."], comment: "The authored caveat." } };
  const fields: Record<string, unknown> = { ...original.fields, authoredCatalog };
  const desired = { bodyHash: fieldHash(original.body), authoredCatalogHash: fieldHash(authoredCatalog) };
  const serviceBody = `${original.body}\n\nA service-authored mathematical qualification that is absent from the catalog projection.`;
  fs.writeFileSync(path.join(root, problemPath), serializeRecord(fields, serviceBody));
  const id = String(fields["id"]);
  const pin = (relative: string) => ({ [relative]: bytesHash(fs.readFileSync(path.join(root, relative))) });
  const projection = (relative = problemPath) => ({ path: relative, fields: { body: desired.bodyHash, authoredCatalog: desired.authoredCatalogHash } });
  const manifest = (projections: unknown, fileHashes: Record<string, string> = pin(problemPath)) => ({ schema: "qiqcop-zoo/ledger-export/2", fileHashes, projections });
  const writeManifest = (value: unknown, directory = "ledger") => fs.writeFileSync(path.join(root, directory, "export-manifest.json"), JSON.stringify(value));
  const validate = () => validateLedger(roots);
  return { root, roots, fields, original, authoredCatalog, desired, serviceBody, id, pin, projection, manifest, writeManifest, validate };
}

test("a validated reconciled Problem stores desired field hashes rather than hashes of its pinned service body", (t) => {
  const f = fixture(t);
  const actualPath = problemPath.replace(".r1.md", ".r2.md");
  fs.writeFileSync(path.join(f.root, actualPath), serializeRecord({ ...f.fields, revision: 2 }, f.serviceBody));
  // A desired canonical r1 key can point at a later revision under a retained
  // service alias. Only projection.path identifies the actual pinned record.
  const desiredPath = "ledger/problems/op-0123456789abcdef/problem.r1.md";
  f.writeManifest(f.manifest({ [desiredPath]: { ...f.projection(actualPath), digest: fieldHash("desired serialization differs from the actual file") } }, f.pin(actualPath)));
  const { ledger, issues } = f.validate();
  assert.deepEqual(issues, []);
  assert.ok(ledger.catalogExports.has(`${f.id}@2`));
  assert.equal(ledger.find("Problem", f.id)!.body, f.serviceBody);
  assert.notEqual(fieldHash(f.serviceBody), f.desired.bodyHash);
  assert.deepEqual(ledger.catalogProblemProjections.get(f.id), f.desired);
});

test("absent, legacy v1, missing and malformed projection data grant no omission proof", (t) => {
  const f = fixture(t);
  const check = () => {
    const { ledger, issues } = f.validate();
    assert.deepEqual(issues, []);
    assert.equal(ledger.catalogProblemProjections.size, 0);
  };
  check();
  f.writeManifest({ schema: "qiqcop-zoo/ledger-export/1", files: [problemPath], projections: { [problemPath]: f.projection() } });
  check();
  for (const projections of [
    undefined, null, [], "not a projection map",
    { [problemPath]: null },
    { [problemPath]: [] },
    { [problemPath]: { path: problemPath } },
    { [problemPath]: { path: problemPath, fields: [] } },
    { [problemPath]: { path: problemPath, fields: { body: f.desired.bodyHash } } },
    { [problemPath]: { path: problemPath, fields: { body: "not-sha256", authoredCatalog: f.desired.authoredCatalogHash } } },
    { [problemPath]: { path: problemPath, fields: { body: f.desired.bodyHash, authoredCatalog: 17 } } },
  ]) {
    f.writeManifest(f.manifest(projections));
    check();
  }
});

test("unverified paths and other record types cannot lend a Problem projection proof", (t) => {
  const f = fixture(t);
  const source = f.validate().ledger.currentOf("Source")[0]!;
  const sourcePath = `ledger/${source.relPath}`;
  for (const [value, pins] of [
    [f.projection(), {}],
    [f.projection("ledger/../" + problemPath), f.pin(problemPath)],
    [f.projection(path.join(f.root, problemPath)), f.pin(problemPath)],
    [f.projection("ledger/problems/absent/problem.r1.md"), f.pin(problemPath)],
    [f.projection(sourcePath), f.pin(sourcePath)],
  ] as const) {
    f.writeManifest(f.manifest({ [problemPath]: value }, pins));
    const { ledger, issues } = f.validate();
    assert.deepEqual(issues, []);
    assert.equal(ledger.catalogProblemProjections.size, 0);
  }
  f.writeManifest(f.manifest({ [problemPath]: f.projection() }, { [problemPath]: "0".repeat(64) }));
  const failedPin = f.validate();
  assert.ok(failedPin.issues.some((issue) => /catalog export history changed or missing/u.test(issue.message)));
  assert.equal(failedPin.ledger.catalogProblemProjections.size, 0);
});

test("a projection must refer to a pin verified in the same manifest", (t) => {
  const f = fixture(t);
  f.writeManifest(f.manifest({}));
  f.writeManifest(f.manifest({ [problemPath]: f.projection() }, {}), "activity");
  const { ledger, issues } = f.validate();
  assert.deepEqual(issues, []);
  assert.ok(ledger.catalogExports.has(`${f.id}@1`));
  assert.equal(ledger.catalogProblemProjections.size, 0);
});

test("a pinned historical redacted Problem never grants desired-field proof", (t) => {
  const f = fixture(t);
  const currentPath = problemPath.replace(".r1.md", ".r2.md");
  fs.writeFileSync(path.join(f.root, currentPath), serializeRecord({ ...f.fields, revision: 2 }, f.serviceBody));
  fs.writeFileSync(path.join(f.root, problemPath), serializeRecord({
    id: f.id, type: "Problem", schemaVersion: "1.0", revision: 1,
    redacted: true, redactionDecisionId: "01KZZZZZZZZZZZZZZZZZZZZZZ9",
  }, ""));
  f.writeManifest(f.manifest({ [problemPath]: f.projection() }, { ...f.pin(problemPath), ...f.pin(currentPath) }));
  const { ledger, issues } = f.validate();
  assert.deepEqual(issues, []);
  assert.ok(ledger.catalogExports.has(`${f.id}@1`));
  assert.ok(ledger.catalogExports.has(`${f.id}@2`));
  assert.equal(ledger.catalogProblemProjections.size, 0);
});
