---
name: writing-open-problems
description: Use when an expert or contributor wants to add a new open problem to this repository, when a problem should be imported from a paper or problem list into ledger/, or when drafting, structuring, or quality-checking a problem record (problem.r1.md, statement, references, problem-proposal contribution).
---

# Writing a new open problem

## Overview

Turn an expert's problem into a validated ledger record set: `ledger/problems/<slug>/` containing a `problem.r1.md`, a `statements/v1.md` with real clauses, role-tagged `references/`, and a `problem-proposal` contribution — on a branch, validator-clean, ready for PR review.

The schema is easy; the **quality bar lives in the prose**. A record that validates but has a vague statement or boilerplate resolution criteria is a failed record. The authority on intent: `docs/DESIGN.md` §4.4 and §5.1; the policy: `contract/policy/v1.md`; the gold-standard exemplar: `ledger/problems/horodecki-2020-mubs-dimension-six/` (statement) and `open_prob/krueger-2005-additivity-classical-capacity/problem.md` (prose depth).

## When NOT to use

- Updating an existing problem (status, evidence, references) → that is a different contribution kind, not a new problem.
- The problem is a lemma an agent formulated mid-attempt → auxiliary problem, `role: auxiliary` with `parentProblemId`; only humans promote.
- No expert is involved and no identifiable source states the problem → do not invent problems.

## Workflow

### 1. Intake interview (before writing anything)

Ask the expert, one topic at a time. Do not guess answers; record what they actually say:

1. **Source**: Where is this problem stated (paper, problem list, verbal)? → sets `origin`: `source-stated` (identifiable source states it), `derived` (editor derived from a documented limitation), `editor-formulated` (expert formulated it here). Never use `agent-formulated`.
2. **The statement**: exact mathematical content — objects, quantifiers, and the prove-or-disprove dichotomy. Ask "what would count as an answer?"
3. **Decomposition**: which distinct targetable questions does it contain? Each becomes a clause with its own `kind` and `resolutionCriteria`.
4. **Why it matters**: the motivation in the expert's words (why this problem, what a solution unlocks).
5. **Known partial results / prior attempts**: papers, theorems, failed routes → become references with roles (and possibly claims).
6. **Openness**: what is the most recent work, and why does it not settle it? If you cannot answer this, the admission gate is not met — say so and stop.
7. **Metadata**: keywords; area/topic (must exist in the taxonomy — `ledger/problems/*/problem.r1.md` show valid `areaIds`/`topicIds`); related problems; `difficulty`/`verificationCost` only if the expert commits (else `unrated`); `posed` year if known.

### 2. Literature and duplicate check (admission prerequisite)

- **Duplicate**: search the ledger for the same problem — `grep -ril "<key terms>" ledger/problems/*/problem.r1.md` and check aliases/titles/keywords. 113 problems exist; collections overlap (Horodecki, Krüger–Werner, Ruskai, v2 pool). If found, propose a reference or statement-revision to the existing problem instead.
- **Openness**: verify against the source paper and recent literature (arXiv listing, citing papers). Admission requires the open status to have been checked; a problem already solved belongs as a *solved* record only if the expert is archiving it knowingly — otherwise flag and stop.
- **Source record**: one `Source` per bibliographic entity, deduplicated by DOI → arXiv id+version → normalized URL → title+first author+date. Search `ledger/sources/` before creating (`grep -l "<doi-or-arxiv>" ledger/sources/*.md`). `completeness: url-only` is legal but debt — prefer `complete`.

### 3. Draft the records

Directory: `ledger/problems/<primary-slug>/` where `<primary-slug>` = `aliases[0]`, kebab-case, unique catalog-wide (e.g. `ruskai-2007-<short-name>` for a list problem, `<author>-<year>-<short-name>` for a paper problem).

**`problem.r1.md`** — every field present, empty when unused (`null` / `[]`), no fields omitted:

```yaml
---
id: <new ULID>
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: <actor ULID of the expert (create the Actor record if absent)>
createdAt: <UTC ISO 8601>
title: <plain-language title>
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - <primary-slug>
origin: source-stated        # or derived | editor-formulated
posed: "2005"                # year or null
areaIds:
  - quantum-information      # must exist in the taxonomy in use
topicIds:
  - <existing topic or []>
keywords: [<lowercase search terms>]
difficulty: unrated          # accessible | hard | very-hard only if the expert commits
verificationCost: unrated    # low | medium | high likewise
relatedProblemIds: [<ULIDs of existing problems>]
---
<Motivation body: 2–4 paragraphs — why the problem matters, what is known,
what a solution would unlock. Prose, not bullets. This is Problem.body.>
```

**`statements/v1.md`** — `## Notation` (symbol table) then `## Formal statement`:

```yaml
---
id: <new ULID>
type: Statement
schemaVersion: "1.0"
createdBy: <same actor>
createdAt: <same timestamp>
supersedes: null
problemId: <problem ULID>
version: 1
digest: sha256:<computed over the body — see step 4>
clauses:
  - id: main                  # short stable id; add more clauses for decomposable problems
    label: <human label>
    text: "<the clause as a proposition, LaTeX inline>"
    kind: existence           # existence | universal | value | construction | bound | decision
    resolutionCriteria: <what specifically settles THIS clause — concrete, checkable>
    supersedesClauseId: null
    quantity: null            # or {name, symbol, direction: upper|lower|exact} for bound/value clauses
---
## Notation

| Symbol | Meaning |
|---|---|
| $N$ | ... |

## Formal statement

**Problem.** *<the precise statement with explicit quantifiers and the
prove-or-disprove dichotomy>.*
<Setup paragraphs, labeled equations if needed.>
```

**`references/<ref-ULID>.r1.md`** (one per attached source):

```yaml
---
id: <new ULID>
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: <actor>
createdAt: <timestamp>
sourceId: <Source ULID>
targetType: problem          # this record attaches to the problem
targetId: <problem ULID>
role: states-problem         # states-problem | listed-in | background | defines | prior-attempt | partial-result | technique | related | survey | resolves
locator: "Problem 12, p. 34" # verify from the source (DOI/arXiv page or full text) and fill; "" only if the source cannot be consulted
---
<Note: why this source matters and what to look at. This is where a hint lives — write it.>
```

**`ledger/sources/<src-ULID>.r1.md`** (only if the source does not already exist):

```yaml
---
id: <new ULID>
type: Source
schemaVersion: "1.0"
revision: 1
createdBy: <actor>
createdAt: <timestamp>
title: <exact title>
kind: paper                  # paper | preprint | book | problem-list | dataset | thesis | web-record
completeness: complete       # complete | partial | url-only
authors: [<"A. Author">]
venue: <journal/ref or null>
date: "2005"
doi: <or null>
arxivId: <"quant-ph/0504166" or null>
url: <or null>
version: null
---
```

**`contributions/<contrib-ULID>/contribution.md`** — the proposal object:

```yaml
---
id: <new ULID>
type: Contribution
schemaVersion: "1.0"
createdBy: <actor>
createdAt: <timestamp>
supersedes: null
title: "Propose: <problem title>"
kind: problem-proposal
actorId: <actor>
trajectoryId: null
problemIds: []
statementId: <statement ULID>
statementDigest: sha256:<same digest as the statement record>
clauseIds:
  - <statement ULID>#main
stopReason: none
newProblemIds: [<problem ULID>]
newStatementId: <statement ULID>
referenceIds: [<reference ULIDs>]
claimIds: []
artifactIds: []
declaredReadIds: [<ULIDs of records actually read during preparation>]
aiInvolvement: assisted      # none | assisted | autonomous — be honest
license: CC-BY-4.0
---
<What is proposed, the intake source (who supplied it and how), and the
openness check performed: most recent work examined and why it does not settle it.>
```

**Actor**: if the expert has no `ledger/actors/<ULID>.r1.md` (kind `human`, roles `[contributor]`), create one alongside; `createdBy` everywhere names the *expert's* actor, not yours.

### 4. Compute ids and digests, then validate

Mint ULIDs (Crockford base32, 26 chars — schema pattern `^[0-9A-HJKMNP-TV-Z]{26}$`):

```bash
node -e '
const { randomBytes } = require("node:crypto");
const A = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
let t = Date.now(), v = 0n;
for (let i = 0; i < 48; i += 1) { v = (v << 1n) | BigInt(t & 1); t = Math.floor(t / 2); }
const r = randomBytes(10); let n = 0n;
for (const b of r) n = (n << 8n) | BigInt(b);
v = (v << 80n) | n;
let s = "";
for (let i = 0; i < 26; i += 1) { s = A[Number(v & 31n)] + s; v >>= 5n; }
console.log(s);'
```

Statement digest — SHA-256 over the body *below the frontmatter*, NFC-normalized, `\n` endings, trailing whitespace stripped, exactly one trailing newline (mirrors `contract/src/digest.ts`; never hand-wave it):

```bash
node -e '
const { createHash } = require("node:crypto");
const raw = require("node:fs").readFileSync(process.argv[1], "utf8");
const body = raw.split(/^---\n[\s\S]*?\n---\n/).slice(1).join("---\n");
const unified = body.normalize("NFC").replace(/\r\n?/g, "\n");
const lines = unified.split("\n").map(l => l.replace(/[ \t]+$/u, ""));
console.log("sha256:" + createHash("sha256").update(lines.join("\n").replace(/\n+$/u, "") + "\n", "utf8").digest("hex"));' \
  ledger/problems/<slug>/statements/v1.md
```

Validate (must end `Ledger is valid.`):

```bash
cd contract && npm ci && node --experimental-strip-types src/cli/validate.ts ../ledger ../activity
```

### 5. Handoff

Branch (`problem/<slug>`), commit the record set, open a PR. **Do not write an admission, status, or acceptance Decision** — a new problem is `candidate` by default and admission is a human/editor review action (policy v1: two independent AI reviews or one human review). The PR description should carry the openness evidence. The problem is not `published` and not indexed until admitted.

## Quality bar (what separates a real record from a validating one)

1. **Statement precision**: every symbol in the notation table; quantifiers explicit; the dichotomy stated ("prove X or exhibit a counterexample"); all parameters and ranges given (`$0 \le p \le 1$`, dimension, resource model).
2. **Resolution criteria are concrete**: "Construct at least four MUBs in dimension six, or prove that a complete set of seven cannot exist" — not "answer the question with a proof, counterexample, exact value, or construction as it requires" (boilerplate = failure).
3. **Clause honesty**: decompose only where the parts are independently targetable; a single focused question gets one `main` clause.
4. **Motivation says why**, in domain terms (what a solution unlocks, where the construction fails), not metadata-restating.
5. **References carry notes and verified locators** — the hint channel. Fill every locator by consulting the source itself (DOI/arXiv landing page, or full text when load-bearing): section, theorem, or equation. An empty locator means "could not consult the source", never "did not look". A `background` reference needs one sentence on what to extract from it.
6. **Openness evidence** in the contribution body: the most recent relevant result examined and why it falls short. Cite it.
7. **Nothing invented**: values the expert did not supply stay `null`/`unrated`/`[]`. Filled-looking defaults are worse than empty fields. This forbids guessing — it does not forbid verifying: a value you confirmed at the source is not invented.
8. **Verifiable specifics beat qualitative hedging**: when the current frontier is checkable (best known bounds, settled small cases), record it with its citation — "known exactly for n ≤ 4; candidates 6, 7, 12 at n = 5, 6, 7" is a materially better clause than "only small n are known".

## Common mistakes

| Mistake | Fix |
|---|---|
| Boilerplate `resolutionCriteria` | Write what settles *this* clause, in checkable terms |
| Omitting "empty" fields (`quantity:`, `topicIds: []`) | Every field exists on every record; schema requires them |
| New `Source` duplicating an existing one | Grep `ledger/sources/` by DOI/arXiv first |
| Slug collides or drifts from `aliases[0]` | Directory name = `aliases[0]`, kebab-case, unique catalog-wide |
| Digest mismatch after editing the statement | Recompute the digest (step 4) after *every* body edit; it must match in the statement frontmatter and the contribution |
| `createdBy` set to the agent / the migration actor | It names the proposing expert's actor |
| Writing an admission decision to make it "official" | Admission is review-gated; stop at the contribution |
| Skipping the openness check because the expert is confident | The gate requires the check regardless of confidence |
| All locators left empty "to be safe" | Verify from the source and fill; empty means unverifiable, not unattempted |
| Vague where numbers are checkable ("only small n") | Record the current best bounds/values with citations |
| Role `defines`/`background` when the source poses the question itself | If the source states the problem, use `states-problem` — confirm via the verified locator |

## Quick reference

- Validator: `cd contract && node --experimental-strip-types src/cli/validate.ts ../ledger ../activity`
- Schemas: `contract/schema/{problem,statement,reference,source,contribution,actor}.schema.json` (final authority on fields)
- Vocabularies + thresholds: `contract/policy/v1.md`
- Design intent: `docs/DESIGN.md` §3.3 (types), §4.4 (propose-a-problem), §5.1 (admission)
- Exemplar record set: `ledger/problems/horodecki-2020-mubs-dimension-six/`
- Exemplar prose: `open_prob/krueger-2005-additivity-classical-capacity/problem.md`
