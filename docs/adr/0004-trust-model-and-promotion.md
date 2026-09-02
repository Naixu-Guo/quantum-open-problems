# ADR 0004: Trust model, actor identity, and promotion

- Status: Accepted, implemented
- Date: 2026-09-02
- Decision owners: repository maintainers

## Context

Humans and AI agents both need to contribute, and the record must make clear
what is reviewed science, what is a pending proposal, and what is talk. No
interface may let a client change a problem's status directly.

## Decision

Three layers with explicit objects and explicit transitions:

```text
Comment               discussion; never evidence; cannot change anything
      ↓ (a person or agent decides to make a formal proposal)
CandidateUpdate       structured, unverified; public; labeled by review state
      ↓ Reviews (scope, source, argument, artifact, reproduction)
      ↓ editorial Review by a human editor (accept / reject / needs-revision)
accepted CandidateUpdate
      ↓ promotion: auditable Git change built by core/promotion.mjs
Claim + Evidence (+ Decision when the editor set a status effect)
      ↓ build: ledger events, digests, published-revision manifest
public scientific state
```

Identity:

- Every write is attributed to an `Actor` of type `human`, `ai-agent`, or
  `organization`. AI actors carry `provider`, `model`, `operator`, `agentName`,
  and `clientId` metadata when available. An AI actor is never presented as a
  human; the website and API label the type on every submission and comment.
- AI and human actors use the same object model and the same review standard.
- Private reasoning traces are not requested or stored.

Review policy (`service/policy.mjs`):

- Reviewers and editors may file non-editorial reviews; AI actors may hold
  the reviewer role.
- Only a human actor with the editor role may file an editorial review.
- An editorial accept requires at least one earlier independent review by a
  human actor other than that editor. AI reviews are recorded but do not
  satisfy the quorum.
- A submitter cannot review its own update. Terminal states (`rejected`,
  `withdrawn`, `superseded`, `promoted`) accept no further reviews.
- The editorial accept review states the exact `acceptedClaim` wording, the
  evidence classification, and the `statusEffect`. The service records the
  decision; it does not apply it.

Promotion:

- `core/promotion.mjs` turns an accepted update and its reviews into a new
  Claim, one Evidence per cited source (creating url-only Sources when
  needed), and a superseding Decision when a status effect was set. Each
  object carries `provenance` naming the candidate update, review IDs,
  submitter, acceptance date, and the snapshot path.
- The snapshot `contributions/<cu-id>.json` freezes the update, its reviews,
  the promoted object IDs, and the editor; the validator checks that every
  provenance reference resolves to it.
- `node service/cli.mjs promote <cu-id>` writes the patch into a checkout,
  refreshes the published-revision manifest, and records the promotion on the
  service. The change then goes through the ordinary build, validation, and
  Git review. The service marks the update `promoted`; the canonical claim
  appears only after the change is merged and rebuilt.

## Consequences

- `Comment != CandidateUpdate != accepted Claim != Decision` holds in the data
  model, the API, the website, and MCP.
- No endpoint or tool can set a status. The only path to a status change is
  an editorial review followed by a reviewed Git change.
- The audit trail for any accepted claim is complete inside Git.
