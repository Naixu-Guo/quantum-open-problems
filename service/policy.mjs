// Editorial and abuse-resistance policy. Every rule that decides who may do
// what, or when an unverified object changes state, lives here so it can be
// reviewed in one place and tested directly.

export const ROLES = ["contributor", "reviewer", "editor", "moderator"];

export const REVIEW_STATES = [
  "pending", "under-review", "accepted", "needs-revision", "rejected", "withdrawn", "superseded", "promoted"
];

export const TERMINAL_REVIEW_STATES = new Set(["rejected", "withdrawn", "superseded", "promoted"]);

export const LIMITS = {
  candidateUpdateBodyBytes: 256 * 1024,
  reviewBodyBytes: 64 * 1024,
  commentBodyBytes: 64 * 1024,
  idempotencyKeyLength: 128,
  listLimitMax: 200,
  eventsLimitMax: 500
};

// Token buckets per actor (writes) and per client address (all requests).
export const RATE_LIMITS = {
  actorWritesPerHour: 120,
  actorCandidateUpdatesPerDay: 40,
  addressRequestsPerMinute: 600,
  addressUnauthenticatedWritesPerHour: 30
};

// Acceptance requires an editorial review by a human editor, and at least
// one earlier independent review (any type except editorial) by a human
// actor other than that editor. AI reviews are recorded and shown but do not
// satisfy the human quorum.
export const ACCEPTANCE = {
  editorialReviewerRole: "editor",
  editorialReviewerMustBeHuman: true,
  minimumIndependentHumanReviews: 1
};

export const canFileReview = (actor, reviewType) => {
  if (!actor || actor.state !== "active") return false;
  if (reviewType === "editorial") {
    return actor.roles.includes(ACCEPTANCE.editorialReviewerRole)
      && (!ACCEPTANCE.editorialReviewerMustBeHuman || actor.type === "human");
  }
  return actor.roles.includes("reviewer") || actor.roles.includes("editor");
};

export const canModerate = (actor) => Boolean(actor && actor.state === "active"
  && (actor.roles.includes("moderator") || actor.roles.includes("editor")));

export const canSubmit = (actor) => Boolean(actor && actor.state === "active" && actor.roles.includes("contributor"));

// Returns null when the editorial verdict may be applied, otherwise a reason.
export const editorialBlockReason = (verdict, priorReviews, editor) => {
  if (verdict !== "accept") return null;
  const independent = priorReviews.filter((review) => review.reviewType !== "editorial"
    && review.reviewer?.type === "human"
    && review.reviewer?.id !== editor.id);
  if (independent.length < ACCEPTANCE.minimumIndependentHumanReviews) {
    return `acceptance requires at least ${ACCEPTANCE.minimumIndependentHumanReviews} independent human review(s) before the editorial review`;
  }
  return null;
};

// State transition produced by a review.
export const nextReviewState = (currentState, review) => {
  if (TERMINAL_REVIEW_STATES.has(currentState)) return null;
  if (review.reviewType !== "editorial") {
    return currentState === "pending" ? "under-review" : currentState;
  }
  if (review.verdict === "accept") return "accepted";
  if (review.verdict === "reject") return "rejected";
  if (review.verdict === "needs-revision") return "needs-revision";
  return currentState === "pending" ? "under-review" : currentState;
};

export const REVIEW_STATE_TRUST = {
  pending: "unverified",
  "under-review": "under-review",
  accepted: "accepted",
  "needs-revision": "needs-revision",
  rejected: "rejected",
  withdrawn: "withdrawn",
  superseded: "superseded",
  promoted: "verified"
};
