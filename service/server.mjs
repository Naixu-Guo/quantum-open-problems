#!/usr/bin/env node
// Operational service entry point.
//
//   QOP_PORT        listening port (default 8787)
//   QOP_DB_PATH     SQLite database file (default ./data/qop-service.sqlite)
//   QOP_SITE_DIR    directory with the generated static site (default ./site)
//   QOP_PUBLIC_URL  public origin used in links (default http://localhost:<port>)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { repositoryRoot } from "../core/catalog.mjs";
import { createApp } from "./app.mjs";
import { openReadModels } from "./read-models.mjs";
import { openStore } from "./store.mjs";

const port = Number(process.env.QOP_PORT) || 8787;
const dbPath = process.env.QOP_DB_PATH || path.join(repositoryRoot, "data", "qop-service.sqlite");
const siteDirectory = path.resolve(process.env.QOP_SITE_DIR || path.join(repositoryRoot, "site"));
const publicUrl = process.env.QOP_PUBLIC_URL || `http://localhost:${port}`;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const store = openStore(dbPath);
const readModels = openReadModels(siteDirectory);
const app = createApp({ store, readModels, publicUrl });
const ingested = app.ingest();
const server = http.createServer(app.handler);
server.listen(port, () => {
  console.log(`Quantum Open Problems service listening on ${publicUrl} (db ${dbPath}, site ${siteDirectory}, ${ingested.ingested} canonical events ingested, sequence ${ingested.lastSequence}).`);
});
const shutdown = () => { server.close(() => { store.close(); process.exit(0); }); };
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
