import test from "node:test";
import assert from "node:assert/strict";
import { statementDigest, normalizeStatementBody } from "../lib/digest.js";
import { statementDigest as contractDigest } from "../../contract/src/digest.ts";

test("the browser digest matches the contract's digest byte for byte", async () => {
  const bodies = [
    "## Formal statement\n\nLet $d = 4$.  \r\nThen \\rho is NPT.\n\n\n",
    "Ångström Å vs A\u030a",
    "no trailing newline",
  ];
  for (const body of bodies) {
    assert.equal(normalizeStatementBody(body).endsWith("\n"), true);
    assert.equal(await statementDigest(body), contractDigest(body));
  }
});
