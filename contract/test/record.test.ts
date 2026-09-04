import { test } from "node:test";
import assert from "node:assert/strict";
import { parseRecordText, serializeRecord } from "../src/record.ts";
import { normalizeStatementBody, statementDigest } from "../src/digest.ts";

test("record files round-trip through parse and serialize", () => {
  const fields = { id: "01K4BDR0Z4M8S9V0YQ7X2H3N6P", type: "Problem", schemaVersion: "1.0", revision: 1, aliases: ["a-b"] };
  const body = "Line one.\n\n$$x^2$$";
  const text = serializeRecord(fields, body);
  const parsed = parseRecordText("x.md", text);
  assert.deepEqual(parsed.fields, fields);
  assert.equal(parsed.body, body);
});

test("a body key inside the header is rejected", () => {
  assert.throws(() => parseRecordText("x.md", "---\nid: a\nbody: no\n---\ntext\n"), /body belongs below/);
});

test("statement digest ignores trailing whitespace and line endings", () => {
  const a = "## Formal statement\r\n\r\nLet $x$.  \r\n";
  const b = "## Formal statement\n\nLet $x$.\n\n\n";
  assert.equal(normalizeStatementBody(a), normalizeStatementBody(b));
  assert.equal(statementDigest(a), statementDigest(b));
  assert.match(statementDigest(a), /^sha256:[a-f0-9]{64}$/);
});
