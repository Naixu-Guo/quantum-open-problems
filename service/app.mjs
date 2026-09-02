// HTTP application for the operational service. Exported as a factory so
// tests can run it in-process against an in-memory store.
//
// Reads of reviewed scientific state come from the generated read models.
// Writes create actors' candidate updates, reviews, and comments; none of
// them can change canonical state. Promotion produces an auditable record
// that an editor applies to the Git catalog.

import fs from "node:fs";
import path from "node:path";
import { canonicalJson, sha256, trimSlash } from "../core/domain.mjs";
import { validateAgainstSchema } from "../core/schema-validator.mjs";
import { schemaDirectory } from "../core/catalog.mjs";
import { authenticate, clientAddress, createRateLimiter, requestHash } from "./auth.mjs";
import { emitEvent, ingestCanonicalLedger } from "./events.mjs";
import { ID_PATTERNS, newCandidateUpdateId, newCommentId, newModerationId, newReviewId } from "./ids.mjs";
import {
  LIMITS,
  RATE_LIMITS,
  REVIEW_STATES,
  REVIEW_STATE_TRUST,
  TERMINAL_REVIEW_STATES,
  canFileReview,
  canModerate,
  canSubmit,
  editorialBlockReason,
  nextReviewState
} from "./policy.mjs";

export class HttpError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const CONTENT_TYPES = {
  ".json": "application/json; charset=utf-8",
  ".jsonl": "application/x-ndjson; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml"
};

const schemaPath = (name) => path.join(schemaDirectory, `${name}.schema.json`);

export const createApp = ({ store, readModels, publicUrl = "http://localhost:8787", now = () => new Date(), rateLimits = RATE_LIMITS, serviceInfo = {} }) => {
  const baseUrl = trimSlash(publicUrl);
  const limiters = {
    actorWrites: createRateLimiter({ limit: rateLimits.actorWritesPerHour, windowMs: 3600_000 }),
    addressRequests: createRateLimiter({ limit: rateLimits.addressRequestsPerMinute, windowMs: 60_000 }),
    addressUnauthenticatedWrites: createRateLimiter({ limit: rateLimits.addressUnauthenticatedWritesPerHour, windowMs: 3600_000 })
  };
  const timestamp = () => now().toISOString();
  const today = () => timestamp().slice(0, 10);

  // Views ------------------------------------------------------------------
  const actorView = (actor) => actor && {
    kind: "Actor",
    id: actor.id,
    type: actor.type,
    displayName: actor.displayName,
    identifier: actor.identifier,
    metadata: actor.metadata,
    roles: actor.roles,
    state: actor.state,
    createdAt: actor.createdAt
  };
  const actorSummary = (id) => actorView(store.getActor(id));
  const candidateLinks = (update) => ({
    self: `${baseUrl}/api/v1/candidate-updates/${update.id}`,
    reviews: `${baseUrl}/api/v1/candidate-updates/${update.id}/reviews`,
    comments: `${baseUrl}/api/v1/comments?candidateUpdateId=${update.id}`,
    problem: `${baseUrl}/api/v1/problems/${update.problemId}`,
    frontier: `${baseUrl}/api/v1/problems/${update.problemId}/frontier`
  });
  const candidateView = (update, { includeReviews = false } = {}) => {
    const { submittedById, contentHash, ...rest } = update;
    const reviews = store.listReviews(update.id);
    return {
      kind: "CandidateUpdate",
      ...rest,
      trust: REVIEW_STATE_TRUST[update.reviewState] || "unverified",
      submittedBy: actorSummary(submittedById),
      contentHash: `sha256:${contentHash}`,
      reviewCount: reviews.length,
      ...(includeReviews ? { reviews: reviews.map(reviewView) } : {}),
      links: candidateLinks(update)
    };
  };
  const reviewView = (review) => {
    const { reviewerId, ...rest } = review;
    return {
      kind: "Review",
      ...rest,
      reviewer: actorSummary(reviewerId),
      links: {
        self: `${baseUrl}/api/v1/reviews/${review.id}`,
        candidateUpdate: `${baseUrl}/api/v1/candidate-updates/${review.candidateUpdateId}`
      }
    };
  };
  const commentView = (comment, { moderator = false } = {}) => {
    const { authorId, ...rest } = comment;
    const removed = comment.moderationState !== "visible" && !moderator;
    return {
      kind: "Comment",
      ...rest,
      body: removed ? null : comment.body,
      references: removed ? [] : comment.references,
      author: actorSummary(authorId),
      replyCount: store.countReplies(comment.id),
      links: {
        self: `${baseUrl}/api/v1/comments/${comment.id}`,
        replies: `${baseUrl}/api/v1/comments/${comment.id}/replies`,
        problem: `${baseUrl}/api/v1/problems/${comment.problemId}`
      }
    };
  };
  const threaded = (comments, options) => {
    const byParent = new Map();
    for (const comment of comments) {
      const key = comment.parentId || null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key).push(comment);
    }
    const build = (parentId) => (byParent.get(parentId) || []).map((comment) => ({
      ...commentView(comment, options),
      replies: build(comment.id)
    }));
    return build(null);
  };

  // Validation against read models ------------------------------------------
  const requireProblem = (id) => {
    if (!ID_PATTERNS.problem.test(String(id || ""))) throw new HttpError(400, "invalid_id", `"${id}" is not a valid problem ID`);
    const problem = readModels.problem(id);
    if (!problem) throw new HttpError(404, "not_found", `Problem ${id} is not in the public catalog`);
    return problem;
  };
  const requireCandidateUpdate = (id, actor) => {
    if (!ID_PATTERNS.candidateUpdate.test(String(id || ""))) throw new HttpError(400, "invalid_id", `"${id}" is not a valid candidate update ID`);
    const update = store.getCandidateUpdate(id);
    if (!update || (update.moderationState !== "visible" && !canModerate(actor) && update.submittedById !== actor?.id)) {
      throw new HttpError(404, "not_found", `Candidate update ${id} does not exist`);
    }
    return update;
  };
  const requireComment = (id) => {
    if (!ID_PATTERNS.comment.test(String(id || ""))) throw new HttpError(400, "invalid_id", `"${id}" is not a valid comment ID`);
    const comment = store.getComment(id);
    if (!comment) throw new HttpError(404, "not_found", `Comment ${id} does not exist`);
    return comment;
  };
  const validateBody = (body, schemaName) => {
    const errors = validateAgainstSchema(body, schemaPath(schemaName));
    if (errors.length) throw new HttpError(422, "schema_validation_failed", `Body does not satisfy ${schemaName}.schema.json`, errors);
  };
  const requireActor = (actor, invalid) => {
    if (invalid) throw new HttpError(401, "invalid_api_key", "The API key is unknown or revoked");
    if (!actor) throw new HttpError(401, "authentication_required", "Writes require an Authorization: Bearer <api key> header");
    if (actor.state !== "active") throw new HttpError(403, "actor_suspended", "This actor is suspended");
    return actor;
  };

  // Handlers ---------------------------------------------------------------
  const status = () => {
    const release = readModels.release();
    return {
      kind: "qop-service-status",
      service: { name: "quantum-open-problems-service", version: serviceInfo.version || "0.2.0", publicUrl: baseUrl },
      catalog: {
        releaseDate: release.releaseDate,
        activeSnapshotDigest: release.activeSnapshotDigest,
        catalogRevision: release.catalogRevision || null,
        ledgerLastSequence: release.ledger?.lastSequence ?? null,
        siteUrl: trimSlash(readModels.index().meta.siteUrl)
      },
      events: { lastSequence: store.lastSequence(), url: `${baseUrl}/api/v1/events` },
      counts: {
        candidateUpdates: store.listCandidateUpdates({ limit: 1 }).total,
        comments: store.listComments({ limit: 1 }).total
      },
      links: {
        problems: `${baseUrl}/api/v1/problems`,
        candidateUpdates: `${baseUrl}/api/v1/candidate-updates`,
        comments: `${baseUrl}/api/v1/comments`,
        events: `${baseUrl}/api/v1/events`,
        schemas: `${baseUrl}/api/v1/schemas/`,
        candidateUpdateSchema: `${baseUrl}/api/v1/candidate-update.schema.json`
      }
    };
  };

  const listProblems = (query) => {
    const includeArchived = query.get("includeArchived") === "true" || query.get("status") === "solved";
    const result = readModels.search({
      query: query.get("q") || "",
      status: query.get("status"),
      field: query.get("field"),
      topic: query.get("topic"),
      collection: query.get("collection"),
      since: query.get("since"),
      includeArchived,
      limit: Math.min(Number(query.get("limit")) || 50, LIMITS.listLimitMax)
    });
    return {
      kind: "qop-problem-list",
      catalogAsOf: readModels.index().meta.asOf,
      matched: result.matched,
      items: result.results.map((entry) => ({
        ...entry,
        links: {
          self: `${baseUrl}/api/v1/problems/${entry.id}`,
          frontier: `${baseUrl}/api/v1/problems/${entry.id}/frontier`,
          human: `${trimSlash(readModels.index().meta.siteUrl)}/problems/${entry.id}/`
        }
      }))
    };
  };

  const pendingForProblem = (problemId) => {
    const pending = store.listCandidateUpdates({ problemId, limit: LIMITS.listLimitMax })
      .items.filter((update) => !TERMINAL_REVIEW_STATES.has(update.reviewState) || update.reviewState === "promoted");
    return {
      available: true,
      count: pending.length,
      url: `${baseUrl}/api/v1/problems/${problemId}/candidate-updates`,
      items: pending.map((update) => {
        const view = candidateView(update);
        return {
          id: view.id, title: view.title, updateKind: view.updateKind, reviewState: view.reviewState, trust: view.trust,
          targetClauseIds: view.targetClauseIds, statementId: view.statementId, submittedBy: view.submittedBy,
          submittedAt: view.submittedAt, reviewCount: view.reviewCount, links: view.links
        };
      })
    };
  };

  const frontier = (problemId) => {
    requireProblem(problemId);
    const base = readModels.frontier(problemId);
    return { ...base, pendingCandidateUpdates: pendingForProblem(problemId), links: { ...base.links, service: `${baseUrl}/api/v1/problems/${problemId}/frontier` } };
  };

  const evidenceList = (problemId) => {
    requireProblem(problemId);
    const claims = readModels.claims(problemId);
    const items = claims.claims.flatMap((claim) => claim.evidence.map((item) => ({ ...item, claimId: claim.id, relation: claim.relation, claimTitle: claim.title, superseded: claim.superseded })));
    return { kind: "qop-evidence-list", problemId, count: items.length, items };
  };

  const submitCandidateUpdate = (actor, body) => {
    if (!canSubmit(actor)) throw new HttpError(403, "forbidden", "This actor lacks the contributor role");
    validateBody(body, "candidate-update");
    requireProblem(body.problemId);
    const problemFrontier = readModels.frontier(body.problemId);
    const statementEntry = problemFrontier.history.statementVersions.find((statement) => statement.id === body.statementId);
    if (!statementEntry) throw new HttpError(422, "unknown_statement", `Statement ${body.statementId} does not belong to ${body.problemId}`, { known: problemFrontier.history.statementVersions.map((statement) => statement.id) });
    const statement = readModels.statement(body.problemId, statementEntry.version);
    const clauseIds = new Set(statement.targetClauses.map((clause) => clause.id));
    const unknownClauses = body.targetClauseIds.filter((clauseId) => !clauseIds.has(clauseId));
    if (unknownClauses.length) throw new HttpError(422, "unknown_target_clause", `Unknown target clause(s): ${unknownClauses.join(", ")}`, { known: [...clauseIds] });
    const daily = store.countCandidateUpdatesSince(actor.id, new Date(now().getTime() - 86_400_000).toISOString());
    if (daily >= rateLimits.actorCandidateUpdatesPerDay) throw new HttpError(429, "rate_limited", "Daily candidate-update limit reached for this actor");
    const contentHash = sha256(canonicalJson({ problemId: body.problemId, statementId: body.statementId, claim: body.claim.replace(/\s+/g, " ").trim().toLowerCase() }));
    const duplicates = store.findCandidateUpdateByHash(contentHash);
    const own = duplicates.find((update) => update.submittedById === actor.id);
    if (own) throw new HttpError(409, "duplicate_submission", `This actor already submitted the same claim as ${own.id}`, { candidateUpdateId: own.id });
    let superseded = null;
    if (body.supersedesCandidateUpdateId) {
      superseded = store.getCandidateUpdate(body.supersedesCandidateUpdateId);
      if (!superseded || superseded.problemId !== body.problemId) throw new HttpError(422, "unknown_candidate_update", "supersedesCandidateUpdateId does not name a candidate update of this problem");
      if (superseded.submittedById !== actor.id && !actor.roles.includes("editor")) throw new HttpError(403, "forbidden", "Only the original submitter or an editor may supersede a candidate update");
      if (TERMINAL_REVIEW_STATES.has(superseded.reviewState)) throw new HttpError(409, "invalid_state", `Candidate update ${superseded.id} is ${superseded.reviewState} and cannot be superseded`);
    }
    const update = store.transaction(() => {
      const created = store.insertCandidateUpdate({
        ...body,
        id: newCandidateUpdateId(),
        reviewState: "pending",
        submittedById: actor.id,
        submittedAt: timestamp(),
        contentHash,
        possibleDuplicateOf: duplicates[0]?.id || null,
        statementIsCurrent: statementEntry.current,
        revisionMatchesCurrent: body.recordDigest ? body.recordDigest === problemFrontier.revision.recordDigest : null
      });
      emitEvent(store, {
        type: "candidate_update.created",
        objectType: "CandidateUpdate",
        objectId: created.id,
        problemId: created.problemId,
        actorId: actor.id,
        revision: `sha256:${contentHash}`,
        payload: { title: created.title, updateKind: created.updateKind, statementId: created.statementId, targetClauseIds: created.targetClauseIds, submitterType: actor.type, reviewState: created.reviewState }
      });
      if (superseded) {
        store.setCandidateUpdateState(superseded.id, "superseded");
        emitEvent(store, { type: "candidate_update.updated", objectType: "CandidateUpdate", objectId: superseded.id, problemId: superseded.problemId, actorId: actor.id, payload: { reviewState: "superseded", supersededBy: created.id } });
      }
      return created;
    });
    return { status: 201, body: candidateView(update) };
  };

  const withdrawCandidateUpdate = (actor, id) => {
    const update = requireCandidateUpdate(id, actor);
    if (update.submittedById !== actor.id && !actor.roles.includes("editor")) throw new HttpError(403, "forbidden", "Only the submitter or an editor may withdraw a candidate update");
    if (TERMINAL_REVIEW_STATES.has(update.reviewState)) throw new HttpError(409, "invalid_state", `Candidate update is already ${update.reviewState}`);
    store.transaction(() => {
      store.setCandidateUpdateState(id, "withdrawn");
      emitEvent(store, { type: "candidate_update.withdrawn", objectType: "CandidateUpdate", objectId: id, problemId: update.problemId, actorId: actor.id, payload: { previousState: update.reviewState } });
    });
    return { status: 200, body: candidateView(store.getCandidateUpdate(id)) };
  };

  const STATE_EVENTS = { accepted: "candidate_update.accepted", rejected: "candidate_update.rejected", "needs-revision": "candidate_update.needs_revision" };

  const fileReview = (actor, body) => {
    validateBody(body, "review");
    if (!canFileReview(actor, body.reviewType)) {
      throw new HttpError(403, "forbidden", body.reviewType === "editorial"
        ? "Editorial reviews require a human actor with the editor role"
        : "Reviews require the reviewer or editor role");
    }
    const update = requireCandidateUpdate(body.candidateUpdateId, actor);
    if (update.submittedById === actor.id) throw new HttpError(403, "forbidden", "An actor cannot review its own candidate update");
    if (TERMINAL_REVIEW_STATES.has(update.reviewState)) throw new HttpError(409, "invalid_state", `Candidate update is ${update.reviewState}; no further reviews are accepted`);
    if (body.reviewType === "editorial" && body.verdict === "accept" && !body.acceptedClaim) {
      throw new HttpError(422, "accepted_claim_required", "An editorial accept review must state the acceptedClaim to promote");
    }
    if (body.reviewType !== "editorial" && (body.statusEffect || body.acceptedClaim)) {
      throw new HttpError(422, "editorial_fields_not_allowed", "statusEffect and acceptedClaim belong to editorial reviews only");
    }
    const prior = store.listReviews(update.id).map((review) => ({ ...review, reviewer: store.getActor(review.reviewerId) }));
    if (body.reviewType === "editorial") {
      const reason = editorialBlockReason(body.verdict, prior, actor);
      if (reason) throw new HttpError(409, "quorum_not_met", reason, { reviews: prior.length });
    }
    const nextState = nextReviewState(update.reviewState, body);
    const review = store.transaction(() => {
      const created = store.insertReview({ ...body, id: newReviewId(), reviewerId: actor.id, createdAt: timestamp() });
      emitEvent(store, { type: "review.created", objectType: "Review", objectId: created.id, problemId: update.problemId, actorId: actor.id, payload: { candidateUpdateId: update.id, reviewType: created.reviewType, verdict: created.verdict, reviewerType: actor.type } });
      if (nextState && nextState !== update.reviewState) {
        store.setCandidateUpdateState(update.id, nextState);
        emitEvent(store, { type: STATE_EVENTS[nextState] || "candidate_update.reviewed", objectType: "CandidateUpdate", objectId: update.id, problemId: update.problemId, actorId: actor.id, payload: { reviewId: created.id, previousState: update.reviewState, reviewState: nextState, statusEffect: body.statusEffect || null } });
      } else {
        emitEvent(store, { type: "candidate_update.reviewed", objectType: "CandidateUpdate", objectId: update.id, problemId: update.problemId, actorId: actor.id, payload: { reviewId: created.id, reviewState: update.reviewState } });
      }
      return created;
    });
    return { status: 201, body: reviewView(review) };
  };

  const recordPromotion = (actor, id, body) => {
    if (!actor.roles.includes("editor")) throw new HttpError(403, "forbidden", "Recording a promotion requires the editor role");
    const update = requireCandidateUpdate(id, actor);
    if (update.reviewState !== "accepted") throw new HttpError(409, "invalid_state", `Only accepted candidate updates can be promoted (state is ${update.reviewState})`);
    const promotedObjectIds = Array.isArray(body?.promotedObjectIds) ? body.promotedObjectIds.filter((value) => typeof value === "string") : [];
    if (!promotedObjectIds.length) throw new HttpError(422, "promoted_objects_required", "promotedObjectIds must list the canonical objects created by the promotion");
    const promotion = {
      promotedOn: typeof body.promotedOn === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.promotedOn) ? body.promotedOn : today(),
      promotedByActorId: actor.id,
      promotedObjectIds,
      contributionPath: typeof body.contributionPath === "string" ? body.contributionPath : `contributions/${id}.json`,
      commit: typeof body.commit === "string" ? body.commit : null,
      pullRequest: typeof body.pullRequest === "string" ? body.pullRequest : null,
      recordedAt: timestamp()
    };
    store.transaction(() => {
      store.setCandidateUpdatePromotion(id, promotion);
      emitEvent(store, { type: "candidate_update.promoted", objectType: "CandidateUpdate", objectId: id, problemId: update.problemId, actorId: actor.id, payload: promotion });
    });
    return { status: 200, body: candidateView(store.getCandidateUpdate(id), { includeReviews: true }) };
  };

  const postComment = (actor, body, parentId = null) => {
    if (!canSubmit(actor)) throw new HttpError(403, "forbidden", "This actor lacks the contributor role");
    const payload = parentId ? { ...body, parentId } : body;
    validateBody(payload, "comment");
    requireProblem(payload.problemId);
    let parent = null;
    if (payload.parentId) {
      parent = requireComment(payload.parentId);
      if (parent.problemId !== payload.problemId) throw new HttpError(422, "thread_mismatch", "A reply must belong to the same problem as its parent");
      if (parent.moderationState === "deleted") throw new HttpError(409, "invalid_state", "Cannot reply to a deleted comment");
    }
    if (payload.candidateUpdateId) {
      const update = store.getCandidateUpdate(payload.candidateUpdateId);
      if (!update || update.problemId !== payload.problemId) throw new HttpError(422, "unknown_candidate_update", "candidateUpdateId does not name a candidate update of this problem");
    }
    if (payload.targetClauseId) {
      const problemFrontier = readModels.frontier(payload.problemId);
      if (!problemFrontier.targetClauses.some((clause) => clause.id === payload.targetClauseId)) {
        throw new HttpError(422, "unknown_target_clause", `Unknown target clause ${payload.targetClauseId}`, { known: problemFrontier.targetClauses.map((clause) => clause.id) });
      }
    }
    if (payload.claimId) {
      const claims = readModels.claims(payload.problemId);
      if (!claims.claims.some((claim) => claim.id === payload.claimId)) throw new HttpError(422, "unknown_claim", `Unknown claim ${payload.claimId}`);
    }
    const comment = store.transaction(() => {
      const created = store.insertComment({
        id: newCommentId(),
        problemId: payload.problemId,
        authorId: actor.id,
        parentId: parent?.id || null,
        rootId: parent ? parent.rootId : undefined,
        targetClauseId: payload.targetClauseId || parent?.targetClauseId || null,
        candidateUpdateId: payload.candidateUpdateId || parent?.candidateUpdateId || null,
        claimId: payload.claimId || parent?.claimId || null,
        body: payload.body,
        references: payload.references || [],
        createdAt: timestamp()
      });
      emitEvent(store, { type: "comment.created", objectType: "Comment", objectId: created.id, problemId: created.problemId, actorId: actor.id, payload: { parentId: created.parentId, rootId: created.rootId, candidateUpdateId: created.candidateUpdateId, targetClauseId: created.targetClauseId, claimId: created.claimId, authorType: actor.type } });
      return created;
    });
    return { status: 201, body: commentView(comment) };
  };

  const editComment = (actor, id, body) => {
    const comment = requireComment(id);
    if (comment.authorId !== actor.id) throw new HttpError(403, "forbidden", "Only the author may edit a comment");
    if (comment.moderationState !== "visible") throw new HttpError(409, "invalid_state", "This comment is not editable");
    if (typeof body?.body !== "string" || !body.body.trim() || body.body.length > 20000) throw new HttpError(422, "schema_validation_failed", "body must be a non-empty string of at most 20000 characters");
    store.transaction(() => {
      store.updateCommentBody(id, body.body, Array.isArray(body.references) ? body.references : comment.references);
      emitEvent(store, { type: "comment.updated", objectType: "Comment", objectId: id, problemId: comment.problemId, actorId: actor.id, payload: {} });
    });
    return { status: 200, body: commentView(store.getComment(id)) };
  };

  const deleteComment = (actor, id) => {
    const comment = requireComment(id);
    if (comment.authorId !== actor.id && !canModerate(actor)) throw new HttpError(403, "forbidden", "Only the author or a moderator may delete a comment");
    store.transaction(() => {
      store.setCommentModeration(id, "deleted");
      emitEvent(store, { type: "comment.deleted", objectType: "Comment", objectId: id, problemId: comment.problemId, actorId: actor.id, payload: { byAuthor: comment.authorId === actor.id } });
    });
    return { status: 200, body: commentView(store.getComment(id), { moderator: canModerate(actor) }) };
  };

  const MODERATION = {
    comment: { actions: { hide: "hidden", unhide: "visible", delete: "deleted" }, apply: (targetId, state) => { requireComment(targetId); store.setCommentModeration(targetId, state); } },
    "candidate-update": { actions: { hide: "hidden", unhide: "visible" }, apply: (targetId, state) => { if (!store.getCandidateUpdate(targetId)) throw new HttpError(404, "not_found", "Unknown candidate update"); store.setCandidateUpdateModeration(targetId, state); } },
    actor: { actions: { suspend: "suspended", reinstate: "active" }, apply: (targetId, state) => { if (!store.getActor(targetId)) throw new HttpError(404, "not_found", "Unknown actor"); store.setActorState(targetId, state); } }
  };
  const moderate = (actor, body) => {
    if (!canModerate(actor)) throw new HttpError(403, "forbidden", "Moderation requires the moderator or editor role");
    const target = MODERATION[body?.targetType];
    if (!target) throw new HttpError(422, "schema_validation_failed", "targetType must be comment, candidate-update, or actor");
    const state = target.actions[body.action];
    if (!state) throw new HttpError(422, "schema_validation_failed", `action must be one of ${Object.keys(target.actions).join(", ")}`);
    if (typeof body.targetId !== "string" || typeof body.reason !== "string" || !body.reason.trim()) throw new HttpError(422, "schema_validation_failed", "targetId and a non-empty reason are required");
    const action = store.transaction(() => {
      target.apply(body.targetId, state);
      const created = store.insertModerationAction({ id: newModerationId(), actorId: actor.id, targetType: body.targetType, targetId: body.targetId, action: body.action, reason: body.reason, createdAt: timestamp() });
      const objectType = { comment: "Comment", "candidate-update": "CandidateUpdate", actor: "Actor" }[body.targetType];
      const problemId = body.targetType === "comment" ? store.getComment(body.targetId)?.problemId : body.targetType === "candidate-update" ? store.getCandidateUpdate(body.targetId)?.problemId : null;
      emitEvent(store, { type: body.targetType === "actor" ? (state === "suspended" ? "actor.suspended" : "actor.reinstated") : "moderation.applied", objectType, objectId: body.targetId, problemId: problemId || null, actorId: actor.id, payload: { action: body.action, moderationActionId: created.id, reason: body.reason } });
      return created;
    });
    return { status: 201, body: { kind: "ModerationAction", ...action } };
  };

  // Request plumbing ----------------------------------------------------------
  const readBody = (request, limit) => new Promise((resolve, reject) => {
    const declared = Number(request.headers["content-length"]);
    if (Number.isFinite(declared) && declared > limit) {
      request.resume();
      reject(new HttpError(413, "payload_too_large", `Request body exceeds ${limit} bytes`));
      return;
    }
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    request.on("data", (chunk) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > limit) { tooLarge = true; chunks.length = 0; return; }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) reject(new HttpError(413, "payload_too_large", `Request body exceeds ${limit} bytes`));
      else resolve(Buffer.concat(chunks).toString("utf8"));
    });
    request.on("error", reject);
  });

  const send = (response, status, body, extraHeaders = {}) => {
    const text = typeof body === "string" ? body : `${JSON.stringify(body, null, 2)}\n`;
    response.writeHead(status, {
      "Content-Type": typeof body === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Authorization, Content-Type, Idempotency-Key",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Cache-Control": status === 200 && response.req?.method === "GET" ? "public, max-age=15" : "no-store",
      ...extraHeaders
    });
    response.end(text);
  };
  const sendError = (response, error) => {
    if (error instanceof HttpError) {
      send(response, error.status, { error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } },
        error.status === 429 && error.retryAfterSeconds ? { "Retry-After": String(error.retryAfterSeconds) } : {});
      return;
    }
    console.error(error);
    send(response, 500, { error: { code: "internal_error", message: "Unexpected server error" } });
  };
  const serveStatic = (response, filePath) => {
    const type = CONTENT_TYPES[path.extname(filePath)] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": type, "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" });
    fs.createReadStream(filePath).pipe(response);
  };

  const ROUTES = [
    ["GET", /^\/api\/v1\/status$/, () => status()],
    ["GET", /^\/api\/v1\/problems$/, ({ query }) => listProblems(query)],
    ["GET", /^\/api\/v1\/search$/, ({ query }) => listProblems(query)],
    ["GET", /^\/api\/v1\/problems\/([^/]+)$/, ({ params }) => requireProblem(params[0])],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/frontier$/, ({ params }) => frontier(params[0])],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/claims$/, ({ params }) => { requireProblem(params[0]); return readModels.claims(params[0]); }],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/evidence$/, ({ params }) => evidenceList(params[0])],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/statements\/v(\d+)$/, ({ params }) => { requireProblem(params[0]); const statement = readModels.statement(params[0], Number(params[1])); if (!statement) throw new HttpError(404, "not_found", "Unknown statement version"); return statement; }],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/candidate-updates$/, ({ params, query, actor }) => {
      requireProblem(params[0]);
      const result = store.listCandidateUpdates({ problemId: params[0], state: query.get("state") || undefined, limit: Math.min(Number(query.get("limit")) || 50, LIMITS.listLimitMax), offset: Number(query.get("offset")) || 0, includeHidden: canModerate(actor) });
      return { kind: "qop-candidate-update-list", problemId: params[0], total: result.total, items: result.items.map((update) => candidateView(update)) };
    }],
    ["GET", /^\/api\/v1\/problems\/([^/]+)\/comments$/, ({ params, query, actor }) => {
      requireProblem(params[0]);
      const result = store.listComments({ problemId: params[0], limit: Math.min(Number(query.get("limit")) || 100, LIMITS.listLimitMax), offset: Number(query.get("offset")) || 0, includeHidden: canModerate(actor) });
      const options = { moderator: canModerate(actor) };
      return { kind: "qop-comment-list", problemId: params[0], total: result.total, items: query.get("threaded") === "true" ? threaded(result.items, options) : result.items.map((comment) => commentView(comment, options)) };
    }],
    ["GET", /^\/api\/v1\/candidate-updates$/, ({ query, actor }) => {
      const state = query.get("state");
      if (state && !REVIEW_STATES.includes(state)) throw new HttpError(400, "invalid_query", `state must be one of ${REVIEW_STATES.join(", ")}`);
      const result = store.listCandidateUpdates({ problemId: query.get("problemId") || undefined, state: state || undefined, actorId: query.get("actorId") || undefined, limit: Math.min(Number(query.get("limit")) || 50, LIMITS.listLimitMax), offset: Number(query.get("offset")) || 0, includeHidden: canModerate(actor) });
      return { kind: "qop-candidate-update-list", total: result.total, items: result.items.map((update) => candidateView(update)) };
    }],
    ["POST", /^\/api\/v1\/candidate-updates$/, ({ actor, body }) => submitCandidateUpdate(actor, body), { auth: true, limit: LIMITS.candidateUpdateBodyBytes }],
    ["GET", /^\/api\/v1\/candidate-updates\/([^/]+)$/, ({ params, actor }) => candidateView(requireCandidateUpdate(params[0], actor), { includeReviews: true })],
    ["GET", /^\/api\/v1\/candidate-updates\/([^/]+)\/reviews$/, ({ params, actor }) => { const update = requireCandidateUpdate(params[0], actor); const reviews = store.listReviews(update.id); return { kind: "qop-review-list", candidateUpdateId: update.id, total: reviews.length, items: reviews.map(reviewView) }; }],
    ["POST", /^\/api\/v1\/candidate-updates\/([^/]+)\/withdraw$/, ({ params, actor }) => withdrawCandidateUpdate(actor, params[0]), { auth: true, limit: LIMITS.reviewBodyBytes }],
    ["POST", /^\/api\/v1\/candidate-updates\/([^/]+)\/promotion$/, ({ params, actor, body }) => recordPromotion(actor, params[0], body || {}), { auth: true, limit: LIMITS.reviewBodyBytes }],
    ["GET", /^\/api\/v1\/reviews\/([^/]+)$/, ({ params }) => { const review = store.getReview(params[0]); if (!review) throw new HttpError(404, "not_found", "Unknown review"); return reviewView(review); }],
    ["POST", /^\/api\/v1\/reviews$/, ({ actor, body }) => fileReview(actor, body), { auth: true, limit: LIMITS.reviewBodyBytes }],
    ["GET", /^\/api\/v1\/comments$/, ({ query, actor }) => {
      const result = store.listComments({ problemId: query.get("problemId") || undefined, candidateUpdateId: query.get("candidateUpdateId") || undefined, claimId: query.get("claimId") || undefined, targetClauseId: query.get("targetClauseId") || undefined, authorId: query.get("actorId") || undefined, limit: Math.min(Number(query.get("limit")) || 100, LIMITS.listLimitMax), offset: Number(query.get("offset")) || 0, includeHidden: canModerate(actor) });
      const options = { moderator: canModerate(actor) };
      return { kind: "qop-comment-list", total: result.total, items: query.get("threaded") === "true" ? threaded(result.items, options) : result.items.map((comment) => commentView(comment, options)) };
    }],
    ["POST", /^\/api\/v1\/comments$/, ({ actor, body }) => postComment(actor, body), { auth: true, limit: LIMITS.commentBodyBytes }],
    ["GET", /^\/api\/v1\/comments\/([^/]+)$/, ({ params, actor }) => { const comment = requireComment(params[0]); const options = { moderator: canModerate(actor) }; return { ...commentView(comment, options), thread: threaded(store.listThread(comment.rootId), options) }; }],
    ["POST", /^\/api\/v1\/comments\/([^/]+)\/replies$/, ({ params, actor, body }) => postComment(actor, { ...(body || {}), problemId: body?.problemId || requireComment(params[0]).problemId }, params[0]), { auth: true, limit: LIMITS.commentBodyBytes }],
    ["PATCH", /^\/api\/v1\/comments\/([^/]+)$/, ({ params, actor, body }) => editComment(actor, params[0], body), { auth: true, limit: LIMITS.commentBodyBytes }],
    ["DELETE", /^\/api\/v1\/comments\/([^/]+)$/, ({ params, actor }) => deleteComment(actor, params[0]), { auth: true, limit: 1024 }],
    ["GET", /^\/api\/v1\/events$/, ({ query }) => {
      const after = Math.max(0, Number(query.get("after")) || 0);
      const limit = Math.min(Math.max(1, Number(query.get("limit")) || 100), LIMITS.eventsLimitMax);
      const events = store.listEvents({ after, limit: limit + 1, problemId: query.get("problemId") || undefined, type: query.get("type") || undefined, source: query.get("source") || undefined });
      const page = events.slice(0, limit);
      return { kind: "qop-event-stream", after, lastSequence: store.lastSequence(), nextAfter: page.length ? page[page.length - 1].sequence : after, hasMore: events.length > limit, count: page.length, events: page };
    }],
    ["GET", /^\/api\/v1\/actors\/me$/, ({ actor, invalid }) => actorView(requireActor(actor, invalid))],
    ["GET", /^\/api\/v1\/actors\/([^/]+)$/, ({ params }) => { const actor = store.getActor(params[0]); if (!actor) throw new HttpError(404, "not_found", "Unknown actor"); return actorView(actor); }],
    ["POST", /^\/api\/v1\/moderation\/actions$/, ({ actor, body }) => moderate(actor, body), { auth: true, limit: LIMITS.commentBodyBytes }],
    ["GET", /^\/api\/v1\/moderation\/actions$/, ({ actor, invalid, query }) => { if (!canModerate(requireActor(actor, invalid))) throw new HttpError(403, "forbidden", "Moderation log requires the moderator or editor role"); return { kind: "qop-moderation-log", items: store.listModerationActions({ limit: Math.min(Number(query.get("limit")) || 100, LIMITS.listLimitMax), offset: Number(query.get("offset")) || 0 }) }; }],
    ["POST", /^\/api\/v1\/admin\/reload$/, ({ actor, invalid }) => { if (!requireActor(actor, invalid).roles.includes("editor")) throw new HttpError(403, "forbidden", "Reload requires the editor role"); readModels.reload(); return { reloaded: true, ...ingestCanonicalLedger(store, readModels) }; }, { auth: true, limit: 1024 }]
  ];

  const handler = async (request, response) => {
    try {
      const url = new URL(request.url, baseUrl);
      const method = request.method.toUpperCase();
      if (method === "OPTIONS") { send(response, 204, ""); return; }
      const address = clientAddress(request);
      const addressBudget = limiters.addressRequests.take(address);
      if (!addressBudget.ok) throw Object.assign(new HttpError(429, "rate_limited", "Too many requests from this address"), { retryAfterSeconds: addressBudget.retryAfterSeconds });
      const auth = authenticate(store, request);
      if (auth.invalid && method !== "GET") throw new HttpError(401, "invalid_api_key", "The API key is unknown or revoked");
      const actor = auth.actor || null;

      for (const [routeMethod, pattern, handle, options = {}] of ROUTES) {
        if (routeMethod !== method) continue;
        const match = url.pathname.match(pattern);
        if (!match) continue;
        const params = match.slice(1).map(decodeURIComponent);
        let body = null;
        let rawBody = "";
        if (method !== "GET") {
          if (!actor) {
            const budget = limiters.addressUnauthenticatedWrites.take(address);
            if (!budget.ok) throw Object.assign(new HttpError(429, "rate_limited", "Too many unauthenticated write attempts"), { retryAfterSeconds: budget.retryAfterSeconds });
          }
          if (options.auth) requireActor(actor, auth.invalid);
          rawBody = await readBody(request, options.limit || LIMITS.commentBodyBytes);
          if (rawBody.trim()) {
            try { body = JSON.parse(rawBody); } catch { throw new HttpError(400, "invalid_json", "Request body is not valid JSON"); }
          }
          if (actor) {
            const budget = limiters.actorWrites.take(actor.id);
            if (!budget.ok) throw Object.assign(new HttpError(429, "rate_limited", "Hourly write limit reached for this actor"), { retryAfterSeconds: budget.retryAfterSeconds });
          }
          const idempotencyKey = request.headers["idempotency-key"];
          if (idempotencyKey && actor) {
            if (String(idempotencyKey).length > LIMITS.idempotencyKeyLength) throw new HttpError(400, "invalid_idempotency_key", "Idempotency-Key is too long");
            const hash = requestHash(method, url.pathname, rawBody);
            const stored = store.getIdempotentResponse(actor.id, String(idempotencyKey));
            if (stored) {
              if (stored.request_hash !== hash) throw new HttpError(422, "idempotency_key_reused", "Idempotency-Key was already used with a different request");
              send(response, stored.status, JSON.parse(stored.body), { "Idempotent-Replay": "true" });
              return;
            }
            const result = await handle({ params, query: url.searchParams, actor, invalid: auth.invalid, body, request });
            const status = result?.status || 200;
            const payload = result?.status ? result.body : result;
            if (status < 500) store.storeIdempotentResponse(actor.id, String(idempotencyKey), hash, status, JSON.stringify(payload));
            send(response, status, payload);
            return;
          }
        }
        const result = await handle({ params, query: url.searchParams, actor, invalid: auth.invalid, body, request });
        if (result?.status && Object.hasOwn(result, "body")) send(response, result.status, result.body);
        else send(response, 200, result);
        return;
      }

      if (method === "GET") {
        const pathname = url.pathname.endsWith("/") ? `${url.pathname}index.html` : url.pathname;
        const filePath = readModels.staticFile(pathname);
        if (filePath) { serveStatic(response, filePath); return; }
        if (url.pathname === "/") { send(response, 200, status()); return; }
      }
      throw new HttpError(404, "not_found", `No route for ${method} ${url.pathname}`);
    } catch (error) {
      sendError(response, error);
    }
  };

  return { handler, limiters, ingest: () => ingestCanonicalLedger(store, readModels) };
};
