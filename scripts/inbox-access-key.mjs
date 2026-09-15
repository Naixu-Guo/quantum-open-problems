#!/usr/bin/env node
// Generates an inbox-only access key in a private file; stdout contains only its hash.
import fs from "node:fs";
import { randomBytes, createHash } from "node:crypto";
const destination = process.argv[2];
if (!destination) { console.error("usage: node scripts/inbox-access-key.mjs <new-private-file>"); process.exit(2); }
const key = randomBytes(32).toString("base64url");
fs.writeFileSync(destination, `Project: Quantum Open Problems proposal inbox\nSign in: https://api.qiqc-op.com/inbox/\nAccess key: ${key}\n\nThis key accesses project submissions only. It does not connect to any email account.\n`, { mode: 0o600, flag: "wx" });
process.stdout.write(`QOP_INBOX_KEY_HASH=${createHash("sha256").update(key).digest("hex")}\n`);
