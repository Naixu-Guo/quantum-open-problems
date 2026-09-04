# Workspace audit after the catalog replacement

Audit date: 2026-09-04. Baseline: merge `7654b789ae0a1ab54e53e9823d39583153dc0bf1`.
Its second parent, `fc28fa4a9e6fd8e7c7e2c0e4cd4179188ea99571`, is the original
main before integration; its first parent is the redesigned catalog.
At the audit baseline, local `main` and the redesign branch already pointed
to the merge. The audit compared these revisions without repeating the merge.

There are no unmerged Git index entries or unresolved conflict markers.
The conflicts below concern content and operating behavior. Passing existing
tests does not resolve those gaps.

During publication preparation, Git also reported a rebase because an empty
`.git/rebase-merge/` directory remained from earlier work. It contained no
rebase instructions or recovery state. Removing that empty directory cleared
the stale marker without changing commits or working files.

## Completed in this revision

- Reviewed all 86 statements and replaced 16 fields and 146 topics with the
  six requested fields and 53 used topics. Corrected “Cryptography” and
  “Resource Theory” spelling. See [the taxonomy guide](../database/TAXONOMY.md).
- Synchronized all JSON classifications, metadata slugs, TeX mirrors, and
  the ledger taxonomy and Problem projections. A comparison against the
  baseline confirms that science, statuses, IDs, aliases, and unrelated
  metadata are unchanged across all 86 records.
- Reworked the local `.claude/skills/add-op-private/SKILL.md` to author the
  authoritative JSON first, read the current taxonomy, search for semantic
  duplicates, audit primary sources, and generate all dependent outputs.
  Private collection work is now an optional path. Premerge main had no
  corresponding skill; its useful evidence and review requirements informed
  the revision through its contribution guide.
- Replaced stale field examples in contributor and site documentation,
  corrected the claim that the service is the sole ledger writer, removed
  the obsolete MCP entry point, and documented the absent seed editor and
  the explicit deployment synchronization boundary.

## Remaining conflicts, in priority order

### 1. Equivalent questions have contradictory research statuses

[Regularized less-noisy channels beyond degradability](../database/problems_json/op_12fc55f67580588e.json)
is `Unsolved`, while
[Strict inclusion of degradable channels in the less-noisy class](../database/problems_json/op_fd75613c5bab4164.json)
is `Solved`. Both ask for a nondegradable channel whose complementary
regularized private capacity is zero. The second record cites a later Zhu–Wang
preprint, arXiv:2607.24693, which the first record does not include.

Next step: verify the exact primary-source theorem and reconcile the duplicate
records' progress and status, retaining both permanent identities and existing
links. This audit establishes the internal disagreement; it does not independently
verify the later paper or decide which status is correct. Neither record was
deleted or scientifically revised by the taxonomy change.

The three thermal-attenuator capacity questions, three SIC existence
questions, and the general versus constrained Petz recovery questions have
different hypotheses or targets. Shared topics do not make them duplicates.

### 2. Catalog edits do not produce incremental service events

[`scripts/export-ledger.mjs`](../scripts/export-ledger.mjs), in `buildLedger`,
rewrites owned revision-one Problem, Taxonomy, and statement files.
[`LedgerRepo.sequences()`](../service/src/ledger-repo.ts) assigns an event
sequence only when a path first appears in Git. The
[`events` query](../service/src/index.ts) returns sequences strictly after
the client's cursor. An update confined to existing exported files can
therefore change content without advancing the cursor or returning an event.

Next step: introduce an explicit catalog-update event/cursor or export new
revisions and statement versions while preserving sequence stability.
Rebuilding the index updates full reads but does not repair incremental
consumers' missed events.

### 3. Reconciliation with later research history is not implemented

The dependency guard in
[`exportLedger`](../scripts/export-ledger.mjs) correctly refuses to overwrite
export-owned entities that later service records depend on. A comment,
review, or new revision can consequently prevent an otherwise ordinary
catalog update. The current exporter has no workflow for reconciling those
dependencies into new revisions and statement versions.

Next step: implement and document revision-aware reconciliation. Preserve
the existing guard. `--replace-authoritative` resets the ledger and activity
roots and is not an ordinary maintenance workaround. This taxonomy export
succeeded because the present ledger has no later dependent service activity.

### 4. The new database has no human-editor bootstrap

[`database/actors.json`](../database/actors.json) contains one migration
system actor with no editor role. GitHub login creates contributors, and
[`service/src/payloads.ts`](../service/src/payloads.ts) prevents contributors
from granting themselves editor privileges. The old instructions assumed a
human editor in the replaced seed ledger.

The documentation now states this limitation. Next step: provide an operator
bootstrap command for a real human editor and then link that person's GitHub
identity. Linking an identity alone does not grant roles; the migration
system actor must not be used as a substitute human editor.

### 5. Historical public route compatibility is incomplete

Original main's `site/api/v1/README.md` advertised `/problems/<record-id>/`.
The current [`site/build.mjs`](../site/build.mjs) emits
`/problem/<id-or-alias>/`. Alias preservation therefore does not preserve
the old plural URL prefix. The old static API, packets, and feeds also have
no complete compatibility contract with the replacement site.

Next step: add redirects for confirmed historical record URLs and decide
which former interfaces need compatibility responses. Renamed or removed
taxonomy URLs and bookmarked filters also need a migration policy if those
links are to be retained; the current revision publishes only current tags.

### 6. Service clause rendering receives raw TeX

The exporter puts the entire original TeX statement in the main clause's
`text`, while [`web/views/problem.js`](../web/views/problem.js) renders clause
text with `inlineMarkup`. That renderer does not translate text-mode TeX
commands such as `\eqref` and `\emph`, and the clause repeats the equations
already present in the converted statement body.

Next step: use a concise clause representation or a compatible rendered
representation, keeping original TeX in `authoredCatalog.record`. Avoid
changing historical statement digests without the revision procedure above.

## Workspace and workflow boundaries

- The private `_bikunli/` collection still has legacy tag, section, and status
  conventions. It is not the maintained database. Its files were inspected
  as context but not modified. A requested private PDF or pool migration
  must reconcile its generator and templates with the new taxonomy.
- `.claude/` and `_bikunli/` are excluded by `.git/info/exclude`, not by
  tracked repository rules. The revised local skill is therefore outside a
  normal Git diff or PR. Its existing invocation name is retained. Sharing
  it needs an explicit tracking choice; exclude rules remain intact.
- Service proposals and accepted contributions do not automatically become
  static-site JSON records. The [catalog integration guide](CATALOG_INTEGRATION.md)
  now documents the handoff and the operator's authorized `sync --allow-edits`
  step for reviewed catalog deployments. That command was not run here.
- Historical architecture notes, migration documentation, and contract
  fixtures deliberately retain older data models. They are not live taxonomy
  mirrors and were not rewritten to hide the history.

## Verification

The post-migration build reports 86 problems, six fields, 53 topics, 78
unsolved records, eight solved records, 330 references, and 311 equations.
Metadata, JSON/TeX agreement, ledger-export drift, and ledger validation pass.
All topics are used. The root database/export suite passes all 17 tests.

The independent integration audit passed the contract's 24 tests, service's
55 tests, web app's 11 tests, MCP adapter's four tests, and all three
TypeScript typechecks. The service and MCP HTTP suites needed an approved
local-listening sandbox escalation after ordinary runs returned `EPERM`.
These checks use isolated fixtures; they are not a live deployment test.

The revised skill passed its official structural validator, Markdown parsing,
and an independent duplicate-handling scenario that found the contradictory
less-noisy pair without creating another record. Markdown documents and
changed generated bodies are parse-checked separately. These checks do not
constitute scientific status reverification or a live research-service update.
