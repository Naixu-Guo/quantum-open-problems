// Relational store for operational community state on node:sqlite.
//
// Tables hold actors, API keys, candidate updates, reviews, comments, the
// unified event stream, idempotency keys, and immutable moderation actions.
// SQL is plain enough to port to PostgreSQL behind this same interface.

import { DatabaseSync } from "node:sqlite";
import { createHash } from "node:crypto";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS actors (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  identifier TEXT,
  metadata TEXT NOT NULL,
  roles TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_keys (
  key_hash TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES actors(id),
  label TEXT,
  created_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE TABLE IF NOT EXISTS candidate_updates (
  id TEXT PRIMARY KEY,
  problem_id TEXT NOT NULL,
  statement_id TEXT NOT NULL,
  review_state TEXT NOT NULL,
  submitted_by TEXT NOT NULL REFERENCES actors(id),
  submitted_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  body TEXT NOT NULL,
  moderation_state TEXT NOT NULL DEFAULT 'visible',
  possible_duplicate_of TEXT,
  promotion TEXT
);
CREATE INDEX IF NOT EXISTS candidate_updates_problem ON candidate_updates(problem_id, submitted_at);
CREATE INDEX IF NOT EXISTS candidate_updates_hash ON candidate_updates(content_hash);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  candidate_update_id TEXT NOT NULL REFERENCES candidate_updates(id),
  reviewer_id TEXT NOT NULL REFERENCES actors(id),
  review_type TEXT NOT NULL,
  verdict TEXT NOT NULL,
  created_at TEXT NOT NULL,
  body TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS reviews_update ON reviews(candidate_update_id, created_at);
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  problem_id TEXT NOT NULL,
  author_id TEXT NOT NULL REFERENCES actors(id),
  parent_id TEXT REFERENCES comments(id),
  root_id TEXT NOT NULL,
  target_clause_id TEXT,
  candidate_update_id TEXT,
  claim_id TEXT,
  body TEXT NOT NULL,
  refs TEXT NOT NULL,
  created_at TEXT NOT NULL,
  edited_at TEXT,
  moderation_state TEXT NOT NULL DEFAULT 'visible'
);
CREATE INDEX IF NOT EXISTS comments_problem ON comments(problem_id, created_at);
CREATE INDEX IF NOT EXISTS comments_root ON comments(root_id, created_at);
CREATE TABLE IF NOT EXISTS events (
  sequence INTEGER PRIMARY KEY AUTOINCREMENT,
  id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_id TEXT NOT NULL,
  problem_id TEXT,
  actor_id TEXT,
  created_at TEXT NOT NULL,
  revision TEXT,
  payload TEXT NOT NULL,
  source TEXT NOT NULL,
  catalog_sequence INTEGER
);
CREATE INDEX IF NOT EXISTS events_problem ON events(problem_id, sequence);
CREATE TABLE IF NOT EXISTS idempotency_keys (
  actor_id TEXT NOT NULL,
  key TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  status INTEGER NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (actor_id, key)
);
CREATE TABLE IF NOT EXISTS moderation_actions (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL REFERENCES actors(id),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL
);
`;

export const hashApiKey = (key) => createHash("sha256").update(String(key)).digest("hex");
const now = () => new Date().toISOString();
const json = (value) => JSON.stringify(value);
const parse = (value) => (value === null || value === undefined ? null : JSON.parse(value));

const actorRow = (row) => row && {
  kind: "Actor",
  id: row.id,
  type: row.type,
  displayName: row.display_name,
  identifier: row.identifier,
  metadata: parse(row.metadata),
  roles: parse(row.roles),
  state: row.state,
  createdAt: row.created_at
};

const candidateRow = (row) => row && {
  ...parse(row.body),
  id: row.id,
  problemId: row.problem_id,
  statementId: row.statement_id,
  reviewState: row.review_state,
  submittedById: row.submitted_by,
  submittedAt: row.submitted_at,
  updatedAt: row.updated_at,
  contentHash: row.content_hash,
  moderationState: row.moderation_state,
  possibleDuplicateOf: row.possible_duplicate_of,
  promotion: parse(row.promotion)
};

const reviewRow = (row) => row && {
  ...parse(row.body),
  id: row.id,
  candidateUpdateId: row.candidate_update_id,
  reviewerId: row.reviewer_id,
  reviewType: row.review_type,
  verdict: row.verdict,
  createdAt: row.created_at
};

const commentRow = (row) => row && {
  id: row.id,
  problemId: row.problem_id,
  authorId: row.author_id,
  parentId: row.parent_id,
  rootId: row.root_id,
  targetClauseId: row.target_clause_id,
  candidateUpdateId: row.candidate_update_id,
  claimId: row.claim_id,
  body: row.body,
  references: parse(row.refs),
  createdAt: row.created_at,
  editedAt: row.edited_at,
  moderationState: row.moderation_state
};

const eventRow = (row) => row && {
  id: row.id,
  sequence: row.sequence,
  type: row.type,
  objectType: row.object_type,
  objectId: row.object_id,
  problemId: row.problem_id,
  actorId: row.actor_id,
  createdAt: row.created_at,
  revision: row.revision,
  payload: parse(row.payload),
  source: row.source,
  catalogSequence: row.catalog_sequence
};

export const openStore = (location = ":memory:") => {
  const db = new DatabaseSync(location);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);
  const one = (sql, ...params) => db.prepare(sql).get(...params) ?? null;
  const all = (sql, ...params) => db.prepare(sql).all(...params);
  const run = (sql, ...params) => db.prepare(sql).run(...params);
  const transaction = (operation) => {
    db.exec("BEGIN");
    try {
      const result = operation();
      db.exec("COMMIT");
      return result;
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
  };

  const appendEvent = (event) => {
    const createdAt = event.createdAt || now();
    run(
      `INSERT INTO events (id, type, object_type, object_id, problem_id, actor_id, created_at, revision, payload, source, catalog_sequence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      event.id, event.type, event.objectType, event.objectId, event.problemId ?? null, event.actorId ?? null,
      createdAt, event.revision ?? null, json(event.payload || {}), event.source || "service", event.catalogSequence ?? null
    );
    return eventRow(one("SELECT * FROM events WHERE id = ?", event.id));
  };

  return {
    db,
    transaction,
    close: () => db.close(),

    // Meta ---------------------------------------------------------------
    getMeta: (key) => one("SELECT value FROM meta WHERE key = ?", key)?.value ?? null,
    setMeta: (key, value) => run("INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", key, String(value)),

    // Actors -------------------------------------------------------------
    insertActor: (actor) => {
      run(
        "INSERT INTO actors (id, type, display_name, identifier, metadata, roles, state, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        actor.id, actor.type, actor.displayName, actor.identifier ?? null, json(actor.metadata || {}), json(actor.roles || []), actor.state || "active", actor.createdAt || now()
      );
      return actorRow(one("SELECT * FROM actors WHERE id = ?", actor.id));
    },
    getActor: (id) => actorRow(one("SELECT * FROM actors WHERE id = ?", id)),
    listActors: () => all("SELECT * FROM actors ORDER BY created_at").map(actorRow),
    setActorState: (id, state) => run("UPDATE actors SET state = ? WHERE id = ?", state, id),
    setActorRoles: (id, roles) => run("UPDATE actors SET roles = ? WHERE id = ?", json(roles), id),

    // API keys -----------------------------------------------------------
    insertApiKey: (key, actorId, label = null) => run(
      "INSERT INTO api_keys (key_hash, actor_id, label, created_at) VALUES (?, ?, ?, ?)", hashApiKey(key), actorId, label, now()
    ),
    revokeApiKey: (key) => run("UPDATE api_keys SET revoked_at = ? WHERE key_hash = ?", now(), hashApiKey(key)),
    actorForApiKey: (key) => {
      const row = one("SELECT actor_id FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL", hashApiKey(key));
      return row ? actorRow(one("SELECT * FROM actors WHERE id = ?", row.actor_id)) : null;
    },
    listApiKeys: (actorId) => all("SELECT key_hash, label, created_at, revoked_at FROM api_keys WHERE actor_id = ?", actorId),

    // Candidate updates --------------------------------------------------
    insertCandidateUpdate: (update) => {
      const timestamp = update.submittedAt || now();
      const { id, problemId, statementId, reviewState, submittedById, contentHash, possibleDuplicateOf, ...body } = update;
      delete body.submittedAt; delete body.updatedAt; delete body.moderationState; delete body.promotion;
      run(
        `INSERT INTO candidate_updates (id, problem_id, statement_id, review_state, submitted_by, submitted_at, updated_at, content_hash, body, possible_duplicate_of)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, problemId, statementId, reviewState || "pending", submittedById, timestamp, timestamp, contentHash, json(body), possibleDuplicateOf ?? null
      );
      return candidateRow(one("SELECT * FROM candidate_updates WHERE id = ?", id));
    },
    getCandidateUpdate: (id) => candidateRow(one("SELECT * FROM candidate_updates WHERE id = ?", id)),
    findCandidateUpdateByHash: (contentHash) => all(
      "SELECT * FROM candidate_updates WHERE content_hash = ? AND review_state NOT IN ('withdrawn', 'rejected', 'superseded') ORDER BY submitted_at", contentHash
    ).map(candidateRow),
    listCandidateUpdates: ({ problemId, state, actorId, limit = 50, offset = 0, includeHidden = false } = {}) => {
      const clauses = [];
      const params = [];
      if (problemId) { clauses.push("problem_id = ?"); params.push(problemId); }
      if (state) { clauses.push("review_state = ?"); params.push(state); }
      if (actorId) { clauses.push("submitted_by = ?"); params.push(actorId); }
      if (!includeHidden) clauses.push("moderation_state = 'visible'");
      const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
      const total = one(`SELECT COUNT(*) AS count FROM candidate_updates ${where}`, ...params).count;
      const rows = all(`SELECT * FROM candidate_updates ${where} ORDER BY submitted_at DESC, id LIMIT ? OFFSET ?`, ...params, limit, offset);
      return { total, items: rows.map(candidateRow) };
    },
    setCandidateUpdateState: (id, reviewState) => run("UPDATE candidate_updates SET review_state = ?, updated_at = ? WHERE id = ?", reviewState, now(), id),
    setCandidateUpdateModeration: (id, state) => run("UPDATE candidate_updates SET moderation_state = ?, updated_at = ? WHERE id = ?", state, now(), id),
    setCandidateUpdatePromotion: (id, promotion) => run("UPDATE candidate_updates SET promotion = ?, review_state = 'promoted', updated_at = ? WHERE id = ?", json(promotion), now(), id),
    countCandidateUpdatesSince: (actorId, since) => one(
      "SELECT COUNT(*) AS count FROM candidate_updates WHERE submitted_by = ? AND submitted_at >= ?", actorId, since
    ).count,

    // Reviews ------------------------------------------------------------
    insertReview: (review) => {
      const { id, candidateUpdateId, reviewerId, reviewType, verdict, createdAt, ...body } = review;
      run(
        "INSERT INTO reviews (id, candidate_update_id, reviewer_id, review_type, verdict, created_at, body) VALUES (?, ?, ?, ?, ?, ?, ?)",
        id, candidateUpdateId, reviewerId, reviewType, verdict, createdAt || now(), json(body)
      );
      return reviewRow(one("SELECT * FROM reviews WHERE id = ?", id));
    },
    getReview: (id) => reviewRow(one("SELECT * FROM reviews WHERE id = ?", id)),
    listReviews: (candidateUpdateId) => all("SELECT * FROM reviews WHERE candidate_update_id = ? ORDER BY created_at, id", candidateUpdateId).map(reviewRow),

    // Comments -----------------------------------------------------------
    insertComment: (comment) => {
      const createdAt = comment.createdAt || now();
      run(
        `INSERT INTO comments (id, problem_id, author_id, parent_id, root_id, target_clause_id, candidate_update_id, claim_id, body, refs, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        comment.id, comment.problemId, comment.authorId, comment.parentId ?? null, comment.rootId || comment.id,
        comment.targetClauseId ?? null, comment.candidateUpdateId ?? null, comment.claimId ?? null, comment.body, json(comment.references || []), createdAt
      );
      return commentRow(one("SELECT * FROM comments WHERE id = ?", comment.id));
    },
    getComment: (id) => commentRow(one("SELECT * FROM comments WHERE id = ?", id)),
    listComments: ({ problemId, candidateUpdateId, claimId, targetClauseId, rootId, authorId, limit = 100, offset = 0, includeHidden = false } = {}) => {
      const clauses = [];
      const params = [];
      if (problemId) { clauses.push("problem_id = ?"); params.push(problemId); }
      if (candidateUpdateId) { clauses.push("candidate_update_id = ?"); params.push(candidateUpdateId); }
      if (claimId) { clauses.push("claim_id = ?"); params.push(claimId); }
      if (targetClauseId) { clauses.push("target_clause_id = ?"); params.push(targetClauseId); }
      if (rootId) { clauses.push("root_id = ?"); params.push(rootId); }
      if (authorId) { clauses.push("author_id = ?"); params.push(authorId); }
      if (!includeHidden) clauses.push("moderation_state <> 'deleted'");
      const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
      const total = one(`SELECT COUNT(*) AS count FROM comments ${where}`, ...params).count;
      const rows = all(`SELECT * FROM comments ${where} ORDER BY created_at, id LIMIT ? OFFSET ?`, ...params, limit, offset);
      return { total, items: rows.map(commentRow) };
    },
    listThread: (rootId) => all("SELECT * FROM comments WHERE root_id = ? ORDER BY created_at, id", rootId).map(commentRow),
    updateCommentBody: (id, body, references) => run("UPDATE comments SET body = ?, refs = ?, edited_at = ? WHERE id = ?", body, json(references || []), now(), id),
    setCommentModeration: (id, state) => run("UPDATE comments SET moderation_state = ? WHERE id = ?", state, id),
    countReplies: (id) => one("SELECT COUNT(*) AS count FROM comments WHERE parent_id = ? AND moderation_state <> 'deleted'", id).count,

    // Events -------------------------------------------------------------
    appendEvent,
    hasEvent: (id) => Boolean(one("SELECT 1 FROM events WHERE id = ?", id)),
    lastSequence: () => one("SELECT MAX(sequence) AS sequence FROM events").sequence || 0,
    listEvents: ({ after = 0, limit = 100, problemId, type, source } = {}) => {
      const clauses = ["sequence > ?"];
      const params = [after];
      if (problemId) { clauses.push("problem_id = ?"); params.push(problemId); }
      if (type) { clauses.push("type = ?"); params.push(type); }
      if (source) { clauses.push("source = ?"); params.push(source); }
      return all(`SELECT * FROM events WHERE ${clauses.join(" AND ")} ORDER BY sequence LIMIT ?`, ...params, limit).map(eventRow);
    },

    // Idempotency --------------------------------------------------------
    getIdempotentResponse: (actorId, key) => one("SELECT * FROM idempotency_keys WHERE actor_id = ? AND key = ?", actorId, key),
    storeIdempotentResponse: (actorId, key, requestHash, status, body) => run(
      "INSERT OR IGNORE INTO idempotency_keys (actor_id, key, request_hash, status, body, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      actorId, key, requestHash, status, body, now()
    ),

    // Moderation ---------------------------------------------------------
    insertModerationAction: (action) => {
      run(
        "INSERT INTO moderation_actions (id, actor_id, target_type, target_id, action, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
        action.id, action.actorId, action.targetType, action.targetId, action.action, action.reason, action.createdAt || now()
      );
      return one("SELECT * FROM moderation_actions WHERE id = ?", action.id);
    },
    listModerationActions: ({ limit = 100, offset = 0 } = {}) => all(
      "SELECT * FROM moderation_actions ORDER BY created_at DESC LIMIT ? OFFSET ?", limit, offset
    ).map((row) => ({ id: row.id, actorId: row.actor_id, targetType: row.target_type, targetId: row.target_id, action: row.action, reason: row.reason, createdAt: row.created_at }))
  };
};
