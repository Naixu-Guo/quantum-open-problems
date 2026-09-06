/**
 * Each test copies the fixtures, breaks one thing, and checks that the validator reports it.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLedger, type Issue } from "../src/validate.ts";

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(here, "..", "fixtures");

function withCopy(run: (ledger: string, activity: string) => void): Issue[] {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qop-contract-"));
  fs.cpSync(path.join(fixtures, "ledger"), path.join(tmp, "ledger"), { recursive: true });
  fs.cpSync(path.join(fixtures, "activity"), path.join(tmp, "activity"), { recursive: true });
  try {
    run(path.join(tmp, "ledger"), path.join(tmp, "activity"));
    return validateLedger([path.join(tmp, "ledger"), path.join(tmp, "activity")]).issues;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

const statementFile = "problems/krueger-2005-qubit-bi-negativity/statements/v1.md";
const problemFile = "problems/krueger-2005-qubit-bi-negativity/problem.r1.md";

test("editing a statement body without recomputing the digest is caught", () => {
  const issues = withCopy((ledger) => {
    const file = path.join(ledger, statementFile);
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("Prove that", "Prove or disprove that"));
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /digest/.test(issue.message)), JSON.stringify(issues));
});

test("a dangling reference is caught", () => {
  const issues = withCopy((ledger) => {
    const file = path.join(ledger, problemFile);
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("relatedProblemIds: []", "relatedProblemIds:\n  - 01KZZZZZZZZZZZZZZZZZZZZZZZ"));
  });
  assert.ok(issues.some((issue) => issue.category === "reference" && /relatedProblemIds/.test(issue.message)), JSON.stringify(issues));
});

test("a revision gap is caught", () => {
  const issues = withCopy((ledger) => {
    const file = path.join(ledger, problemFile);
    fs.renameSync(file, file.replace(".r1.md", ".r3.md"));
    const text = fs.readFileSync(file.replace(".r1.md", ".r3.md"), "utf8").replace("revision: 1", "revision: 3");
    fs.writeFileSync(file.replace(".r1.md", ".r3.md"), text);
  });
  assert.ok(issues.some((issue) => issue.category === "identity" && /revisions/.test(issue.message)), JSON.stringify(issues));
});

test("a record in the wrong directory is caught", () => {
  const issues = withCopy((ledger) => {
    const from = path.join(ledger, "problems/krueger-2005-qubit-bi-negativity/claims");
    const claim = fs.readdirSync(from)[0]!;
    fs.mkdirSync(path.join(ledger, "problems/ruskai-2007-multiplicativity-p2-channel-classes/claims"), { recursive: true });
    fs.renameSync(path.join(from, claim), path.join(ledger, "problems/ruskai-2007-multiplicativity-p2-channel-classes/claims", claim));
  });
  assert.ok(issues.some((issue) => issue.category === "layout"), JSON.stringify(issues));
});

test("an agent marking a primary problem solved is caught", () => {
  const issues = withCopy((ledger) => {
    const dir = path.join(ledger, "problems/krueger-2005-qubit-bi-negativity/decisions");
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      const text = fs.readFileSync(file, "utf8");
      if (/kind: status/.test(text)) {
        const agentId = fs.readdirSync(path.join(ledger, "actors")).map((f) => fs.readFileSync(path.join(ledger, "actors", f), "utf8"))
          .find((t) => /kind: agent/.test(t))!.match(/^id: (\S+)/m)![1]!;
        fs.writeFileSync(file, text.replace(/^createdBy: \S+/m, `createdBy: ${agentId}`));
      }
    }
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /solved only by a human/.test(issue.message)), JSON.stringify(issues));
});

test("a review claiming independence from a same-family reviewer is caught", () => {
  const issues = withCopy((ledger) => {
    const actors = path.join(ledger, "actors");
    for (const name of fs.readdirSync(actors)) {
      const file = path.join(actors, name);
      const text = fs.readFileSync(file, "utf8");
      if (/name: Example verifier 1/.test(text)) fs.writeFileSync(file, text.replace("modelFamily: example-family-b", "modelFamily: example-family-a"));
    }
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /model families match/.test(issue.message)), JSON.stringify(issues));
});

test("a research trajectory without an attempt report is caught", () => {
  const issues = withCopy((_ledger, activity) => {
    const dir = path.join(activity, "trajectories");
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      const text = fs.readFileSync(file, "utf8");
      if (/kind: research/.test(text)) fs.writeFileSync(file, text.replace(/^attemptReportId: \S+/m, "attemptReportId: null"));
    }
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /attempt report/.test(issue.message)), JSON.stringify(issues));
});

test("a status decision that contradicts the accepted claims is caught", () => {
  const issues = withCopy((ledger) => {
    const dir = path.join(ledger, "problems/theoremdb-p3114-kashaev-volume-conjecture/decisions");
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      const text = fs.readFileSync(file, "utf8");
      if (/kind: status/.test(text)) fs.writeFileSync(file, text.replace("status: Unsolved", "status: Solved"));
    }
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /status Solved requires/.test(issue.message)), JSON.stringify(issues));
});

test("a reference to a redacted record still resolves", () => {
  const issues = withCopy((ledger) => {
    const sources = path.join(ledger, "sources");
    const name = fs.readdirSync(sources)[0]!;
    const file = path.join(sources, name);
    const id = fs.readFileSync(file, "utf8").match(/^id: (\S+)/m)![1]!;
    fs.writeFileSync(file, `---\nid: ${id}\ntype: Source\nschemaVersion: "1.0"\nrevision: 1\nredacted: true\nredactionDecisionId: 01KZZZZZZZZZZZZZZZZZZZZZZ9\n---\n`);
  });
  assert.deepEqual(issues.filter((issue) => issue.category === "reference" || issue.category === "schema"), []);
});

test("a policy-1 solved decision without peer-reviewed support is caught", () => {
  const issues = withCopy((ledger) => {
    const dir = path.join(ledger, "problems/krueger-2005-qubit-bi-negativity/claims");
    for (const name of fs.readdirSync(dir)) {
      const file = path.join(dir, name);
      fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("maturity: peer-reviewed", "maturity: preprint"));
    }
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /policy 1 requires a solved decision/.test(issue.message)), JSON.stringify(issues));
});

test("an unknown topic is caught", () => {
  const issues = withCopy((ledger) => {
    const file = path.join(ledger, problemFile);
    fs.writeFileSync(file, fs.readFileSync(file, "utf8").replace("  - entanglement-theory", "  - entanglement-theory\n  - no-such-topic"));
  });
  assert.ok(issues.some((issue) => issue.category === "reference" && /unknown topic no-such-topic/.test(issue.message)), JSON.stringify(issues));
});

test("a second revision without an entity-revision contribution is caught", () => {
  const issues = withCopy((ledger) => {
    const file = path.join(ledger, problemFile);
    const text = fs.readFileSync(file, "utf8").replace("revision: 1", "revision: 2").replace("title: Qubit bi-negativity", "title: Qubit bi-negativity (revised)");
    fs.writeFileSync(file.replace(".r1.md", ".r2.md"), text);
  });
  assert.ok(issues.some((issue) => issue.category === "rule" && /not introduced by an entity-revision contribution/.test(issue.message)), JSON.stringify(issues));
});
