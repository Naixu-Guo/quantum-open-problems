# Quantum Open Problems: system design

- Status: Adopted; phase 0 delivered except the API payload schemas and the
  conformance test, which are written with the phase 1 service
- Date: 2026-09-02, revised 2026-09-03
- Scope: the whole project, designed from its goals. Supersedes
  `ARCHITECTURE.md` and ADR 0001 where they conflict. The current repository
  is seed data and a static export target, not a constraint.

## 1. Goal and boundary

The project is a **database**. Its scientific purpose is to collect, from
humans, well-defined open problems in quantum science together with the
references and discussion around them; to make that knowledge available to
AI agents that form their own approaches and attempt the problems; and to
record the whole solving process, not only its outcomes. Humans do not
prescribe solution routes; agents derive them.

The record of a solving process is a tree: a problem is decomposed into
auxiliary problems, some are settled, some refuted, some block. Every node
of that tree, every attempt at it, and every verification of an attempt is
a first-class record, so that the next agent starts from the tree rather
than from the original statement.

The division of labor:

| Party | Role |
| --- | --- |
| Humans | Propose problems, write precise statements, add references with notes, comment, revise, sign off on `solved`, run periodic maintenance with AI help |
| AI agents (built elsewhere) | Read problems, references, comments, and the frontier; form approaches; run attempts; record trajectories; submit results, attempt reports, and reviews |
| This project | The ledger, the domain service, the interfaces, the contract, and the human collection interface |

**What this project builds:** the ledger and its record format, the domain
service that validates and commits writes, the HTTP API, the MCP server,
the web app for human collection and maintenance, the static export, and a
contract package (schemas, policy, fixtures, conformance tests) that agent
builders develop against.

**What this project does not build:** research agents, verification agents,
triage agents. They are external actors that speak the interface. The
design must make it possible to build them without reading this codebase.

Problems are independent of papers. A paper is a reference that supplies
background, prior attempts, definitions, or techniques, and a human's note
on a reference is where a hint lives. Scope is all of quantum science;
admission requires only that a problem is well defined.

## 2. Shape of the system

```text
  Humans ──── Web app ────┐
                          │     ┌──────────────────────────────┐
  Agents ──── MCP ────────┼────▶│ Domain service               │──▶ Ledger: text files in Git (truth)
  (external)              │     │  validate · policy · commit  │──▶ Index: relational DB, rebuilt from files
  Scripts ─── HTTP API ───┘     │  derive state · serve reads  │──▶ Artifact store: content-addressed blobs
                                └──────────────────────────────┘
                                               │
                                               ▼
                                Static export: file mirror, JSONL, llms.txt, feeds, Pages
```

| Component | Role |
| --- | --- |
| Ledger | Append-only tree of record files in Git. The only source of truth. One file per object, YAML header with typed fields, Markdown body for prose. |
| Index | Relational database rebuilt from the ledger. Serves queries, frontier, queues. Disposable. |
| Artifact store | Content-addressed blobs referenced from the ledger by digest. Large blobs live outside Git. |
| Domain service | The only committer. Validates each write against schema and policy, writes files, commits with actor metadata, updates the index, computes derived state. |
| HTTP API | Authoritative versioned interface. Web, MCP, and scripts are its clients. |
| MCP server | Agent-facing adapter over the API: read, build context, record trajectory, submit. |
| Web app | Human-facing adapter: collection forms, discussion, review, maintenance console. |
| Static export | Read-only mirror on GitHub Pages. Never an authoring surface. |
| Contract package | JSON Schemas for every type and every API payload, the policy file, fixture records, and a conformance test an external agent can run against a local service. |

Trajectories and comments are high volume and live in a second repository
so the main ledger's history stays readable. Policy files live in the
contract package, not in the ledger; a decision names a policy by version.

## 3. Domain model

### 3.1 Principles

- **Append-only.** Records are never edited. An immutable object is
  replaced by a new object with `supersedes`; a revisable entity gets a new
  revision file. The only rewrite of a committed file is a redaction, which
  leaves a tombstone.
- **Identity is separate from version.** An entity keeps one `id` for life;
  its revisions are numbered. References always name the entity id, never a
  revision.
- **Decisions are the only source of state.** Problem status, contribution
  state, verification level, and `lastReviewed` are read from accepted
  decisions. Reviews are inputs to decisions, not state.
- **Provenance on everything.** Every record names its actor; activity
  records name their trajectory.
- **Content addressing.** Statements and artifacts have digests; every
  submission names the digest it targets.
- **One standard for humans and AI.** Same objects, same policy; actor kind
  and independence are policy inputs.
- **Explicit types.** Flat records with named, typed fields. No generic
  envelope, no `data` blob, no field whose shape depends on a `kind`.
- **Readable records.** One text file per record; prose never inside JSON
  strings.
- **Small closed vocabularies.** Enums with one-line definitions in the
  policy file. No free-form status strings.

### 3.2 Shape of a type

Two kinds of type.

**Immutable objects** are written once. Their `id` is the record.
`Statement, Clause, Claim, Contribution, Review, Decision, Artifact,
Trajectory`.

```text
id             opaque permanent identifier
schemaVersion  record format version
createdBy      actor id
createdAt      timestamp
supersedes     id of the object this one replaces, or null
```

**Revisable entities** keep one `id` and accumulate numbered revisions.
`Problem, Source, Reference, Actor, Comment, Taxonomy`. A later revision of
a Problem, Source, Reference, or Taxonomy is introduced by an
`entity-revision` contribution; Actors revise themselves and Comments are
edited by their authors directly.

```text
id             opaque permanent entity identifier
revision       1, 2, 3, …
schemaVersion  record format version
createdBy      actor id of this revision
createdAt      timestamp of this revision
```

The current revision is the highest number. A reference field holds an
entity id and resolves to the current revision unless the referring record
pins one with a digest.

Rules: a reference field is named after what it points at (`statementId`,
`reviewerId`); every field exists on every instance, empty when unused;
prose lives in `body`; embedded value types are `Support`, `Event`,
`Check`, `Bound`, `Quantity`, `Revision`, `Area`, `Topic`, and are never
addressed from outside their record. Any record that can point at several kinds of target uses the pair
`targetType, targetId`; the validator holds one table of which target
types each record type may name.

### 3.3 Types

Fourteen types in three groups.

```text
Knowledge     Problem   Statement   Clause   Claim   Source   Reference   Taxonomy
Activity      Actor     Trajectory   Contribution   Artifact
Judgement     Review    Comment   Decision
```

**Problem** (revisable). A permanent question, primary or auxiliary.
`title, body (motivation), role (primary | auxiliary), parentProblemId,
parentClauseId, aliases[], origin (source-stated | derived |
editor-formulated | agent-formulated), posed (date first posed, or null),
areaIds[], topicIds[], keywords[], difficulty, verificationCost,
relatedProblemIds[]`. Areas and topics must exist in the taxonomy, and a
problem lists the area of every topic it names.
Catalog state (`candidate | published | retired | merged`) and research
status are not fields; they are read from decisions.
A primary problem is collected from humans. An auxiliary problem is a
lemma, reduction, or intermediate conjecture that an agent formulated while
attacking a clause of its parent; it has its own statement and clauses and
is attacked, settled, or refuted like any other. The decomposition tree of
a primary problem is the record of how it was attacked.

An auxiliary problem is listed only inside its parent's tree unless a human
promotes it. Promotion requires that its statement is a complete
proposition that stands without the parent's local context and that its
status is open. A promoted auxiliary problem appears in the main search
index with its own page while staying in the tree.

**Statement** (immutable). One formulation of a problem.
`problemId, version, digest, body (notation and formal statement)`.
The digest is computed over the normalized body (see 3.7). A new statement
names the one it supersedes.

**Clause** (immutable, child of Statement). A named target inside a
statement, addressed by `statementId + id`. A clause changes only through a
new statement version; `supersedesClauseId` carries its lineage.
`statementId, label, text, kind (existence | universal | value |
construction | bound | decision), resolutionCriteria, supersedesClauseId
(the clause in the previous statement version it continues), quantity
{ name, symbol, direction (upper | lower | exact) }`.
Clauses are stored inside the statement file but indexed as their own
table because claims, events, and auxiliary problems point at them.

**Claim** (immutable). A scoped assertion about clauses.
`title, statementId, clauseIds[], relation (resolves | refutes | narrows |
supports | bounds), body (argument), bound { clauseId, direction, value,
valueForm (exact-rational | decimal | expression), conditions }, support[]`.
`Support`: `sourceId, artifactId, locator, date, maturity, strength`. An
artifact-backed support is written with maturity `unreviewed-artifact`; its
effective maturity is derived from the contribution's verification level.

**Source** (revisable). A bibliographic record.
`title, kind (paper | preprint | book | problem-list | dataset | thesis |
web-record), completeness (complete | partial | url-only), authors[], venue,
date, doi, arxivId, url, version`. `completeness` makes bibliographic debt
visible in the data: a source created from a bare URL is `url-only` until a
revision completes it.
Uniqueness: one source per DOI; one per arXiv id and version; else one per
normalized URL; else one per title, first author, and date.

**Reference** (revisable). A source attached to a problem, statement,
clause, or claim, with the human's note on why it matters. This is the
main channel for human hints.
`sourceId, targetType (problem | statement | clause | claim), targetId,
role (states-problem | listed-in | background | defines | prior-attempt |
partial-result | technique | related | survey | resolves), locator, body
(why this is relevant and what to look at)`.
Adding a reference never revises the object it points at.

**Taxonomy** (revisable, exactly one per ledger). The registry of research
areas and topics. `areas[] { id, label, description }, topics[] { id, label,
areaId }`. Adding a field or topic is an entity revision of this record.

**Actor** (revisable). Human, agent, pipeline, or system.
`name, kind (human | agent | pipeline | system), roles[] (contributor |
reviewer | editor | moderator), externalIdentity, operatorId, modelFamily,
modelVersion, harness`. `operatorId` is required for agents and pipelines.
Roles gate what an actor may write: only a human with the `editor` role
signs a primary problem `solved`, promotes, merges, or retires; only
`moderator` or `editor` moderates. One `system` actor issues automatic
decisions and holds no roles.

**Trajectory** (immutable, written once at close). One run by one actor;
primary scientific data, public by default.
`kind (research | verification | maintenance | ingestion), actorId,
operatorId, problemIds[], statementDigests[], clauseIds[], contextBundleId,
startedAt, endedAt, harnessConfig, budget, cost { tokens, wallTimeSeconds,
moneyUsd }, body (the agent's own plan and outcome note), eventsArtifactId,
eventCount, attemptReportId, artifactIds[], visibility (public |
embargoed), embargoUntil`.
While a run is open, events stream to an append-only log in the artifact
store; the index tracks open runs. At close the service writes the
trajectory file once, naming the event log by digest. A research
trajectory cannot close without its attempt report.
`Event` (in the log): `seq, at, kind (read | decompose | attempt | prove |
refute | compute | stuck | revise | submit | note), summary, problemId,
clauseId, obstacle (missing-lemma | refuted-subgoal | computational-limit |
ambiguous-statement | out-of-budget | none), objectIds[], artifactId`.

**Contribution** (immutable). One submission of knowledge.
`title, kind (problem-proposal | statement-revision | reference |
attempt-report | evidence-import | merge-proposal | retire-proposal |
entity-revision), actorId, trajectoryId, problemIds[], statementId,
statementDigest, clauseIds[], stopReason (solved | partial | obstacle |
refuted-subgoal | ambiguous-statement | out-of-budget | abandoned | none),
body (summary; for attempt reports, the route the agent formed, what it
tried, and why it stopped), newProblemIds[], newStatementId,
referenceIds[], claimIds[], artifactIds[], declaredReadIds[], revisions[]
{ entityId, revision }, aiInvolvement, license`.
There is no separate `result` kind: an agent's claims, auxiliary problems,
and artifacts arrive together in its attempt report. Results found in the
literature enter through `evidence-import`. State is read from decisions.

**Artifact** (immutable). A content-addressed blob.
`title, digest, kind (proof-text | lean | coq | code | certificate | notebook |
dataset | transcript | event-log | log | figure), mediaType, size, uri,
trajectoryId, checkable, checks[]`.
`Check`: `actorId, method, outcome, log`.

**Review** (immutable). One assessment of one contribution. An input to
decisions, never state.
`contributionId, reviewerId, trajectoryId, kind (triage | verification |
audit), independence { differentOperator, differentModelFamily,
noSharedReads }, conflictOfInterest { declared, statement }, methods[]
(citation-check | artifact-execution | argument-read | formal-check |
reproduction | scope-check | duplicate-check), checks[], verdict (rejected
| duplicate | junk | incomplete | scope-mismatch | unverified-plausible |
verified-partial | verified), body (notes)`.

**Comment** (revisable). Discussion attached to one object.
`targetType, targetId, parentCommentId, body, promotedToContributionId`.
Moderation is a decision, not a field. Never cited by a status decision.

**Decision** (immutable). The only source of state.
`kind (admission | promotion | acceptance | withdrawal | status | merge |
retire | moderation | redaction | release), targetType, targetId,
mergeIntoProblemId, outcome, status (open | partial | solved | refuted),
verificationLevel (unreviewed | triaged | ai-verified | machine-verified |
human-signed), reviewIds[], contributionIds[], policyVersion, effectiveAt,
body (rationale)`. A `release` targets the ledger with the release tag as
`targetId` and records the commit and `lastSequence` in its body.
`acceptance` decisions are issued automatically by the system actor when
the policy thresholds are met by the reviews on file, and record the
policy version applied; a later policy change never alters them.
`status` for a primary problem's `solved`, `promotion`, `merge`, `retire`,
and `redaction` are issued by humans. A decision cites reviews, never
contributions directly, except `release` and `redaction`.

### 3.4 Record layout

A problem's directory is its complete history.

```text
problems/<problem-id>/
  problem.r1.md                     revisions of the entity; highest is current
  problem.r2.md
  statements/v1.md                  immutable; clauses embedded
  statements/v2.md
  references/<reference-id>.r1.md
  claims/<claim-id>.md
  contributions/<contrib-id>/
    contribution.md
    reviews/<review-id>.md
  decisions/<decision-id>.md
  auxiliary/<aux-problem-id>/       same layout, nested under the parent
    problem.r1.md                   so the decomposition tree is the directory tree
    statements/v1.md
    claims/<claim-id>.md
    auxiliary/...
sources/<source-id>.r1.md
actors/<actor-id>.r1.md
taxonomy.r1.md

(second repository)
trajectories/<trajectory-id>.md     written once at close; event log by digest
comments/<target-type>/<target-id>/<comment-id>.r1.md

(artifact store, outside Git)
<digest>                            blobs, including trajectory event logs
```

Committed files are never modified, with one exception: a `redaction`
decision replaces a file's content with a tombstone that keeps the id, the
decision id, and nothing else; for a revisable entity every revision file is
tombstoned. References to a tombstone still resolve, so redaction never
breaks another record. A person with a file browser and `git log`
can answer every provenance question without the service.

### 3.5 Derived state

Everything below is computed from decisions and the objects they cite.

- **Problem catalog state**: from `admission`, `promotion`, `merge`, and
  `retire` decisions; `candidate` by default.
- **Problem status**: latest unsuperseded accepted `status` decision;
  `open` by default. `refuted` applies to auxiliary problems whose
  conjecture was disproved; it is itself a finding.
- **Clause status**: `resolved` if an accepted claim with `resolves` or
  `refutes` covers it; `partial` if accepted `narrows`, `bounds`, or
  `supports` claims exist; otherwise `open`. Accepted means cited by an `acceptance` decision.
  `supersedesClauseId` merges status across statement versions.
- **Contribution state**: `submitted` on intake; `triaged`, `accepted`, or
  `rejected` from its `acceptance` decision; `withdrawn` from a
  `withdrawal` decision; `superseded` when a later contribution names it in
  `supersedes`.
- **Verification level** per contribution: the `verificationLevel`
  recorded on its `acceptance` decision.
- **Indexed**: a problem is in the main search index if it is primary and
  published, or auxiliary with an accepted `promotion` decision.
- **Decomposition tree** per primary problem: its auxiliary problems by
  parent clause, each with status, the attempt reports that created or
  settled it, and the obstacle recorded where attempts stopped.
- **Frontier** per problem: open clauses, best bound per quantity, accepted
  partial results, the decomposition tree with node statuses, routes tried
  (from accepted attempt reports, with stop reason), pending contributions,
  `lastReviewed`.
- **Contribution currency**: `statementIsCurrent`, whether the statement
  digest a contribution pinned is still the problem's current statement.
  Stale contributions stay valid; the frontier shows them against the
  version they addressed.
- **Event stream**: every record, in the order it entered the ledger,
  numbered with one global `sequence`. A client keeps the last sequence it
  saw and asks for everything after it. The release manifest carries
  `lastSequence` as the cheap poll target.
- **Queues**: contributions without an `acceptance` decision, grouped by
  what they still need; `solved` sign-off; maintenance backlog.
- **Actor record**: contributions, reviews, trajectories, acceptance and
  rejection counts.

The validator enforces two invariants that tie decisions to the records they
rest on. First, status versus clauses: a problem marked `solved` or
`refuted` has every clause of its current statement resolved by an accepted
claim; a problem marked `open` has none resolved; a problem marked `partial`
has at least one clause that is not open. Second, the policy threshold for
`solved`: under policy 1 a primary problem's `solved` decision must rest on
an accepted claim with peer-reviewed or machine-checked support, or on two
independent human verification reviews. A decision that violates either is
a validation error, not a silent disagreement. Seed decisions name policy 0,
the legacy audit, and are exempt from the second.

### 3.6 Implementation principles

- One module per type: schema, validator, and the pure functions that
  derive state from lists of it.
- Derived state is computed by plain functions over plain lists of
  decisions and the records they cite. No event replay framework, no ORM
  magic, no reflection.
- Every enum switch is exhaustive and local to the module that owns the
  enum.
- Policy thresholds are named constants read from the versioned policy
  file, never literals in logic. The automatic `acceptance` decision is the
  only code that reads them.
- The validator owns one table of allowed `targetType` per record type and
  one table of allowed references between types; the full ledger is
  re-validated in CI on every commit.
- No base class with dynamic payloads.
- Each type ships one fixture file that is both its test input and its
  documentation, and the contract package publishes the same fixtures.

### 3.7 Specifications the implementation must fix

- **Identifiers.** ULIDs for immutable objects and entities; human-readable
  aliases for problems are kept in `aliases[]`, never used as keys.
- **Statement digest.** SHA-256 over the statement body after Unicode NFC
  normalization, line-ending normalization to `\n`, and removal of trailing
  whitespace; clauses are part of the body and therefore of the digest.
- **Artifact digest.** SHA-256 over the raw bytes.
- **Numbers in bounds.** `value` is a string; `valueForm` says how to read
  it. Floats are never stored as the primary form of a mathematical bound.
- **Uniqueness.** Source by DOI, else arXiv id and version, else normalized
  URL, else title, first author, and date. Problem aliases unique across the
  catalog. One `acceptance` decision per contribution per policy version.
  Exactly one taxonomy record.
- **Event sequence.** A record's sequence is its position in the
  first-parent commit order of the ledger's main branch, ties within a
  commit broken by path. The index assigns it at ingestion; it is never
  stored in a record.
- **Context bundle id.** The SHA-256 of the sorted list of `(id, digest)`
  pairs the bundle contains. A bundle is not a record; the service can
  rebuild it from the id.
- **Time.** All timestamps UTC ISO 8601; `effectiveAt` on decisions may
  precede `createdAt` when recording history.
- **Schema versioning.** Every file carries `schemaVersion`; the validator
  refuses unknown versions; migrations are scripts that write new revisions
  or superseding objects, never in-place edits.

## 4. Interfaces

The interfaces are the product boundary. An agent builder should be able to
implement a research agent, a verifier, or a triage agent from this section
and the contract package alone.

### 4.1 Agent read interface

| Tool | Returns |
| --- | --- |
| `search_problems(area?, topic?, status?, difficulty?, text?)` | Indexed problems (primary and promoted auxiliary) with status, clause counts, reference and comment counts |
| `get_problem(problemId)` | Problem, current statement with clauses and their status, references grouped by role with their notes, comments, decision chain |
| `get_frontier(problemId)` | Open clauses, best bounds, accepted partial results, the decomposition tree with node statuses and obstacles, routes tried with stop reason, pending contributions |
| `get_tree(problemId)` | The decomposition tree alone: auxiliary problems by parent clause, status, settling claims, blocking obstacles |
| `list_references(problemId, role?)` | References with notes and the sources they point at |
| `list_comments(targetType, targetId)` | Discussion threads on a problem, statement, clause, or contribution |
| `list_attempts(problemId, outcome?)` | Accepted attempt reports with the routes they describe |
| `build_context(problemId, clauseIds?, tokenBudget)` | A bounded bundle: statement, chosen clauses, references with notes, comments, accepted claims, the decomposition tree with settled nodes usable as lemmas and blocked nodes with their obstacles, routes tried; returns a bundle ID and the digests it was built from. Trajectories record the bundle ID they started from. |
| `get_policy()` | Current policy version and thresholds |
| `get_schemas()` | JSON Schemas for every payload |
| `get_status()` | Release date, ledger `lastSequence`, record counts; poll this before anything else |
| `list_events(after, limit?, type?, problemId?)` | Records that entered the ledger after a sequence, for incremental synchronization |

The MCP server also exposes the same objects as resources
(`qop://problems/{id}`, `qop://problems/{id}/frontier`,
`qop://problems/{id}/statements/{version}`, `qop://contributions/{id}`,
`qop://trajectories/{id}`) so an agent can read by URI as well as by tool.

Every read returns object IDs and statement digests so the agent's
submission can name exactly what it worked from.

### 4.2 Agent work interface

| Tool | Effect |
| --- | --- |
| `start_trajectory(kind, problemIds, statementDigests, clauseIds?, contextBundleId?, harnessConfig, budget, visibility)` | Opens a trajectory; returns its ID |
| `log_event(trajectoryId, kind, summary, problemId?, clauseId?, obstacle?, objectIds?, artifactId?)` | Appends an event |
| `upload_artifact(trajectoryId, kind, mediaType, bytes)` | Stores a blob; returns its digest |
| `end_trajectory(trajectoryId, attemptReportId, cost)` | Freezes the trajectory; a research trajectory cannot close without its attempt report |

### 4.3 Agent write interface

| Tool | Creates |
| --- | --- |
| `submit_contribution(kind, targets, body, claims?, artifactIds?, newStatement?, newProblems?, references?, stopReason?, declaredReadIds, aiInvolvement, license, trajectoryId?)` | One contribution and the objects it introduces; returns intake result and contribution ID. An attempt report may introduce auxiliary problems with their statements, claims about any problem in the tree, and artifacts. |
| `submit_review(contributionId, kind, independence, conflictOfInterest, methods, checks, verdict, body, trajectoryId?)` | One review |
| `withdraw_contribution(contributionId, reason)` | A `withdrawal` decision on the actor's own contribution |
| `post_comment(targetType, targetId, body, parentCommentId?)` | One comment; editing creates a revision |
| `get_contribution_status(contributionId)` | Derived state, reviews, verification level |
| `claim_queue_item(queue)` | For verifier and triage agents: the next contribution to assess, with the review packet fields |

Intake performs only mechanical checks: schema, statement digest matches a
current or historical statement, clause and reference IDs resolve, declared
artifacts exist, rate limits. Failures are rejected and not
recorded. Everything after intake is recorded.

### 4.4 Human interface

The web app is a collection tool first.

- **Propose a problem**: title, motivation, a Markdown statement with
  clauses, initial references by role. The form writes the same files an
  agent's `problem-proposal` would.
- **Add a reference**: attach a source to a problem, statement, or claim
  with a role and a note on why it matters and what to look at. This is the
  main channel for human hints and must be as light as posting a comment.
- **Discuss**: comments on any object. Agents read comments; an editor can
  promote a comment into a reference or a problem proposal.
- **Revise**: edit a statement as a Markdown file; the service creates a
  `statement-revision` contribution with clause lineage.
- **Review**: a reviewer sees one contribution directory plus the clause it
  targets and prior reviews, and files a review.
- **Maintain**: queues, sampling of AI-verified contributions, merge and
  retire, promotion of auxiliary problems, `solved` sign-off, release.

Humans authenticate with GitHub; the first login creates the human's actor
record. An operator creates agent and pipeline actors and issues their
scoped tokens; the operator is a human actor.

### 4.5 HTTP API and export

Versioned REST over the thirteen types plus the query endpoints the tools
above use, including `/status` and `/events?after=<sequence>`. Operational
rules the service enforces on every write: bearer keys issued per actor and
stored hashed; an `Idempotency-Key` on every POST, with identical retries
replayed and conflicting retries refused; body size limits per record type;
rate limits per actor and per client address from the policy file;
duplicate detection by content hash of the claim text against live
contributions on the same statement; moderation states (`visible | hidden |
deleted`) applied only through `moderation` decisions, which form an
immutable log. Each release publishes the
ledger files, a JSONL index, `llms.txt` and `llms-full.txt`, and feeds of
decisions, to GitHub Pages under stable URLs.

### 4.6 Contract package

Published as a versioned package: JSON Schemas for all types and payloads,
the policy file, one fixture per type, a sample problem directory, and a
conformance test that starts a local service, runs an agent through read,
work, and write, and checks the resulting files. Agent builders develop
against this package; a change to it is a versioned contract change.

## 5. Policies

### 5.1 Admission

A problem is well defined when its statement is precise, each clause has a
resolution criterion, its open status has been checked against the
literature, and its formulator and origin are declared. Difficulty and
verification cost are labels, not gates. Admission: two independent AI
reviews or one human review.

A reference is accepted when its source resolves and its role is
plausible: one review, AI or human, or acceptance on submission for
references added by human actors with prior accepted contributions. The bar
is low so that humans add hints freely.

### 5.2 Verification thresholds

| Transition | Minimum requirement |
| --- | --- |
| Contribution shown as `ai-verified`, clause or problem marked `partial` | two independent AI reviews with `verified` or `verified-partial`, or one passing machine check on a checkable artifact |
| Attempt report accepted (route listed as tried, auxiliary problems it formulated become `published`) | one independent AI review confirming the account |
| Auxiliary problem marked `solved` or `refuted` | two independent AI reviews with `verified`, or one passing machine check |
| Primary problem marked `solved` | a human `status` decision plus one of: passing machine check, peer-reviewed publication, two independent human reviews |
| Statement revision accepted | two independent AI reviews or one human review; clause lineage complete |
| Auxiliary problem promoted to the main index | one human decision: statement is a complete self-contained proposition and status is open |
| Merge or retire | one human decision during maintenance |
| Entity revision accepted | automatic at `unreviewed` for a human editor; otherwise one review |
| Statement revision that breaks the status invariant | accepted only together with a new `status` decision |

Independence: different `operatorId`, different `modelFamily`, and the
reviewer has not read the submitter's trajectory; the first two are checked
against actor records, the third against the reviewer's trajectory when one
is on file. Every review must include at least one mechanical method.

When the reviews on file meet a threshold, the system actor issues an
`acceptance` decision recording the policy version and the verification
level reached. Human decisions are required only where the table says so.
A later policy version applies to later decisions only.

### 5.3 Junk control

Intake rejects malformed submissions without recording. Triage reviews
(external agents via `claim_queue_item`) label duplicates, junk, and
incomplete submissions; these are recorded, hidden from the frontier, and
appealable by comment. Rate limits per actor and per problem are policy
constants.

### 5.4 Maintenance

Humans with AI run a `maintenance` trajectory on a fixed interval:

1. re-check each problem's open status against new literature and file
   `evidence-import` contributions;
2. audit a sample of `ai-verified` contributions and their reviewers'
   independence;
3. merge duplicates, retire problems no longer well defined, revise
   ambiguous statements, promote auxiliary problems that are complete open
   propositions;
4. review references and comments: remove dead links, merge duplicate
   references, promote comments that carry a hint into references;
5. resolve appeals; purge hidden junk past the retention window;
6. cut a `release`.

`lastReviewed` per problem derives from the latest maintenance decision
touching it.

## 6. Lifecycles

- **Problem**: `candidate → published → (retired | merged)`. Status
  (`open | partial | solved | refuted`) is orthogonal; solved problems stay
  published. Auxiliary problems are `candidate` until the attempt report
  that formulated them is accepted.
- **Contribution**: `submitted → (triaged | accepted | rejected) →
  (superseded | withdrawn)`; each step is a decision except `superseded`,
  which a later contribution records in `supersedes`.
- **Trajectory**: `open → closed`, closing only with an attempt report for
  research runs.

## 7. Seed data and migration

The legacy repository supplied the seed: 58 problems with statements and
evidence from `open_prob/` and `site/data/problems.js`, and 55 candidates
from `open_problem_v2/`. The migration (`tools/migrate-legacy/`) is a
one-time `ingestion` trajectory run by a pipeline actor; it produces
`problem-proposal` and `evidence-import` contributions, reviews that record
the original audit, and the decisions that make the seed `published`, all
under policy 0. Nothing is invented: a value the legacy record lacks stays
empty. The table records the rules the tool applies.

| Legacy field | Destination | Rule |
| --- | --- | --- |
| `id` (slug) | `Problem.aliases[]` | New ULID as `id`; slug kept as alias and as the URL path. |
| `title`, `summary`, `importance` | `Problem.title`, `Problem.body` | Summary and importance become the motivation body. |
| `type` | `Clause.kind` | Map "Existence" → `existence`, "Universal …" → `universal`, "Construction" → `construction`, "Exact …" → `value`; unmapped values become `decision`. |
| `remaining` / `question.unresolved` | not migrated | Derived by the frontier. |
| `topic` → area | `Problem.topicIds[]`, `Problem.areaIds[]` | Taxonomy kept as registry data. |
| `collection` | `Source` (kind `problem-list`) + `Reference` role `listed-in` | Collections stop being identity. |
| `metadata.json` source fields | `Source` + `Reference` role `states-problem` | DOI, arXiv, URL precedence preserved; `source_location` becomes the reference locator. |
| `problem.md` Notation + Formal statement | `Statement.body` | Copied without semantic editing; digest computed per 3.7. |
| Existing `targetClauses` (catalog slice) | `Clause` | Kept; `supersedesClauseId` empty. |
| `progress[]` item | `Claim` + `Support` | `narrows` when the strength names a subclass, restriction, special case, or counterexample; otherwise `supports`. Never `resolves` or `refutes` on a single-clause problem. `maturity`, `strength`, `date`, `url` → support; `url` creates or matches a `url-only` `Source`. |
| `progress[]` item that is a status survey | `Reference` role `survey` | Not a claim. |
| `progress[]` or `watch[]` item about an unaccepted claim | Its own `evidence-import` contribution with one `resolves` or `refutes` claim, a `Review` (`rejected`), and a rejected `acceptance` decision | The claim is on record and never feeds derived state. |
| Solved `problem.md` status section | `Claim` (`resolves` or `refutes`) with support from bibliography entries whose first author's surname appears in the resolution paragraphs | Peer-reviewed when the entry names a journal or DOI. |
| `watch[]` caution about scope | `Problem.body` | Appended as a "Cautions" paragraph. |
| `status` + audit date | `Review` (human auditor, `verification`, methods `citation-check`, `argument-read`) + `Decision` (`status`, cites the review) | `partially_solved` → `partial`; `verified` date is the review's `createdAt`. |
| `origin` | `Problem.origin` | `source-stated` or `derived`. |
| Bibliography entries in `problem.md` | `Source` + `Reference` role `background` | Locator from the entry text where present. |
| v2 `id`, `source.sha256` | `Problem.aliases[]`, ingestion trajectory events | Alias retained; digest recorded in the ingestion event and checked against the TeX file. |
| v2 `problem_statement.latex` | `Statement.body` | Verbatim. |
| v2 `tags` | `Problem.keywords[]` | Verbatim. |
| v2 `status` | `Decision` (`status`) only if a human review exists; else `open` by default | Nothing invents a reviewed status. |
| v2 `progress.items[]` | `Reference` role `prior-attempt` carrying the item text | Claims are created at admission review, not by the importer. |
| v2 `references.entries[]` | `Source` | Deduplicated by DOI or arXiv id. |

Every migrated problem enters as `candidate`. The legacy 58 receive an
`admission` decision citing the audit review; the v2 55 wait for
admission. Old URLs resolve through aliases.

## 8. Phasing

| Phase | Deliverable | Exit criterion |
| --- | --- | --- |
| 0 Contract | Types, schemas, policy v1, interface specification, contract package with fixtures and conformance test | An external team can build a conforming agent from the package. Delivered except the payload schemas and conformance test, which need the phase 1 service |
| 1 Database | Ledger repository with seed data, domain service and index, HTTP API, MCP, human collection web app with discussion | Humans add problems, references, and comments through the web; a conforming test agent completes read, work, write |
| 2 Operation | Verification and triage queues in use by external agents, maintenance console, static export, public tokens for operators | First `ai-verified` results and accepted attempt reports on seed problems |
| 3 Community | Shared maintenance, actor records as credit, more operators | Measured contribution and review volume from outside the maintainers |

## 9. Decisions taken

Defaults adopted on 2026-09-02; each can be revisited by a later decision.

1. **Trajectory detail.** Structured events; raw transcripts are artifacts
   referenced from events. The event vocabulary is chosen so the process can
   be studied without transcripts.
2. **Agent comments.** Allowed, marked by actor kind.
3. **Retention.** Hidden junk is purged after 90 days; an embargo on a
   trajectory expires after at most one year.
4. **License.** Text CC BY 4.0; code and certificates MIT unless the
   contribution declares another OSI license.
5. **Hosting.** A single host with an object store for artifacts until the
   public release; provider chosen at phase 2.
6. **Second repository.** Trajectories and comments live in a separate
   repository owned by the same service.
7. **Abandoned runs.** A research trajectory that ends with no finding
   closes with a one-line attempt report whose `stopReason` is `abandoned`.
8. **Implementation.** TypeScript; SQLite as the index; standard JSON
   Schema validation. The contract package, ledger, and service live in
   this repository under `contract/`, `ledger/`, and `service/`; the legacy
   directories are removed after migration.
9. **The `research-layer` branch.** Reviewed on 3 September 2026. It
   completed ADR 0001's path with a bundle-per-problem catalog, a
   byte-for-byte compatibility gate, a human-only review quorum, and
   promotion through generated pull requests; those conflict with this
   design and are not merged. Absorbed from it: the sequenced event stream
   with a cursor, the status-versus-clause consistency invariant, actor
   roles, conflict-of-interest declarations on reviews, source
   completeness, contribution currency, and the operational rules in 4.5.
10. **Second review, 3 September 2026.** Added the entity-revision
    contribution, the withdrawal decision, the merge target, the taxonomy
    record, the `unreviewed` verification level, policy 0 for seed
    decisions, the policy-1 threshold check on `solved`, tombstone-safe
    references, and the sequence and bundle specifications; aligned the
    type listings with the contract package.
