// Identifier generation for operational objects. IDs are opaque, prefixed,
// lowercase, and safe to embed in URLs and canonical provenance fields.

import { randomBytes } from "node:crypto";

const random = (bytes = 8) => randomBytes(bytes).toString("hex");

export const newActorId = () => `actor-${random(6)}`;
export const newCandidateUpdateId = () => `cu-${random(8)}`;
export const newReviewId = () => `rev-${random(8)}`;
export const newCommentId = () => `cmt-${random(8)}`;
export const newModerationId = () => `mod-${random(8)}`;
export const newEventId = () => `sevt-${random(8)}`;
export const newApiKey = () => `qop_${random(24)}`;

export const ID_PATTERNS = {
  actor: /^actor-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  candidateUpdate: /^cu-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  review: /^rev-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  comment: /^cmt-[a-z0-9]+(?:-[a-z0-9]+)*$/,
  problem: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
};
