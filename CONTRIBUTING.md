# Contributing to the QIQCOP Zoo

Problems are JSON records in `database/problems_json/`, one file per problem
named by its stable ID, with the TeX form of each record in
`database/problems_tex/`. A pull request that adds or edits a record is the
only way content enters the site; the build validates every record, and the
validation workflow runs it on each pull request.

To suggest a problem without editing the repository, use the
[proposal form](https://qiqc-op.com/contribute/) to submit the statement,
sources, and known progress without an account. Maintainers review
proposals and publish accepted records with each contributor's chosen public
credit. Names and emails are required for private review, including when a
contributor chooses to remain anonymous on that problem. The rest of this
guide is for people who write the record themselves.

For agent-assisted additions and revisions, follow the repository's
[writing-open-problems skill](.claude/skills/writing-open-problems/SKILL.md).
It covers primary-source verification, semantic duplicate checks, the current
JSON format, and synchronization of derived outputs. Use the supplied sources
and ask only for information needed to make the question or attribution precise.

## Record format

Run `node scripts/new-problem-id.mjs --create` to create a record scaffold
in `database/problems_json/<id>.json`, then fill in its authored fields.
The command generates permanent identifiers and metadata. The template is
a format reference; do not copy its example identifiers into a new record.
Use `--json` instead of `--create` to print a fresh scaffold without writing
a file; the command without options continues to print only a new `op_` ID.

Authored research text holds TeX, written exactly as in a TeX file
except for JSON escaping: backslashes are doubled (`\\emph{...}`) and line
breaks are written as `\n`.

| Field | Content |
| --- | --- |
| `schema` | `qiqcop-zoo/record/3`. |
| `id` | `op_` followed by sixteen hexadecimal digits, generated once with `node scripts/new-problem-id.mjs` and never changed. The file is named `<id>.json`. |
| `ulid` | A permanent main-compatible identifier, assigned by the new-record command or the metadata migration. Never regenerate it for an existing problem. |
| `aliases` | The original `op_` identifier, the ULID, the equivalent `op-` alias, and any confirmed legacy aliases. Keep them unique across records and preserve existing aliases. |
| `metadata` | Main-compatible Problem attributes, including record type and version, revision, creator and creation time, role, parent relationships, origin, posed date, taxonomy IDs, keywords, difficulty, verification cost, and related problem IDs. Initialize missing values with the metadata migration script; consult the template for the exact structure. |
| `contributors` | Optional array of public credit choices for this problem. A named entry has `name`, optional `affiliation`, and `anonymous: false`; an anonymous entry contains only `anonymous: true`. See [Public contributor credit](#public-contributor-credit). |
| `title` | The descriptive title only, on one line; the site never shows a problem number. |
| `status` | Exactly `Unsolved` or `Solved`. |
| `fields` | One or two names from the `fields` list of `database/tags.json`, spelled exactly: the broad research areas the problem belongs to. |
| `topics` | One to five names from the `topics` list of `database/tags.json`, spelled exactly: the specific objects, techniques, and settings it concerns. |
| `statement` | The self-contained statement. |
| `source` | The paper that posed the problem, or the papers in which it is implicit, cited with `\\sourcecite{ref:...}{KEY}`. For an original contribution, write `Contributor: Full Name.` only with permission for named credit on this problem; otherwise use `unknown`. |
| `progress` | An array of accurately scoped results, one TeX item each. |
| `references` | An array of `{ "key": "KEY", "label": "ref:...", "tex": "..." }`, each `tex` giving the full entry with DOI and arXiv links. |
| `comment` | The precise remaining gap and relations to other problems. |

For a new record, run `node scripts/migrate-metadata.mjs` after filling the
authored fields. It initializes missing metadata using the pinned crosswalk
in `database/metadata.json` and syncs taxonomy IDs with the authored field
and topic names. It does not replace authored JSON content or refresh
records from main. Use the same command with
`--check` to check without writing. Include changes to the metadata files
with the new record.

After any content edit, run `node scripts/sync-tex.mjs` to write its TeX form
to `database/problems_tex/<id>.tex`, then `node site/build.mjs`. The build
fails when the TeX file is missing or disagrees with the record, so commit the
two files together. The additional identifiers, metadata, and contributor
credit choices live in JSON; they are excluded from the TeX content comparison
but included in the JSON hash. When editing fields or topics, run the metadata migration before
syncing TeX to update the derived taxonomy IDs.

A record can also be written in TeX following `database/_template.tex`, whose
sections map onto the authored JSON content fields, and imported with
`node scripts/import-problems.mjs <file>`; the import writes both files. A TeX
import that replaces an existing record requires `--replace` and preserves
that record's identifiers, metadata, and contributor credit choices. Review
the incoming content before replacing a record, since an old TeX copy can
contain outdated science. A TeX file may carry `Field` and `Topic` subsections
or, in the older layout, a
single `Tag` subsection whose names are sorted into fields and topics by
`database/tags.json`; either way the build enforces one or two fields and one
to five topics.

## Public contributor credit

Each problem page lists only people who agreed to be named for that problem.
Record this choice in its optional `contributors` array: use
`{ "name": "Contributor name", "anonymous": false }` for named credit,
with an optional `affiliation` string. For anonymous participation, omit the
person from the array or include only `{ "anonymous": true }`, with no
identifying fields. Anonymous entries are not displayed in the Contributors
section. Public records must not contain contributor email addresses.

The choice applies to one problem record. The same person may be named on
one problem and remain anonymous on another; do not infer consent from an
actor profile, Git history, a paper's author list, or credit on another
record. Leave credit absent when permission has not been established.

When publishing an accepted proposal, maintainers transfer the contributor's
public credit choice from the private inbox to the problem record. Keep the
required contact name and email in the inbox, and honor anonymity in authored
prose as well as the credit array. Confirm the same permission for a direct
pull request. Credit people only; do not list an assistant, model, agent, or
tool as a contributor.

## Metadata and main exports

The metadata `areaIds` and `topicIds` are the URL slugs of the authored
`fields` and `topics`, in the same order. The metadata migration keeps these
arrays in step when taxonomy assignments change. Adding compatibility
metadata preserves the existing JSON keys and field and topic names; it does not change the
scientific content or status. The ledger exporter preserves this registry
with independent topics. The migration actor in
`database/actors.json` identifies the system migration; it does not claim
authorship or human review of the research.

The build publishes every alias for record lookup and redirects it to the
existing `op_` page. `/api/main/problems/<ulid>.json` wraps a strict main
Problem projection in `problem`, with the zoo's binary `status` and the full
authored JSON in `record`. All aliases are retained in the projection and
`/api/identifiers.json`.

Run `npm run export-ledger` after a database change to update the service's
ledger projection, then `npm run check-ledger` and `npm run validate:ledger`.
The projection embeds the authored JSON and its binary status. Imported
catalog entries are published through that explicit catalog provenance;
do not create fictional reviews, decisions, or research attribution.
Service contributions and reviews remain in the ledger. Pull requests
changing the ledger or activity roots need the `ledger-change` label to
identify a deliberate update.

For an existing duplicate, consolidate its useful content into the canonical
question and follow the [catalog merge procedure](docs/CATALOG_INTEGRATION.md#merging-duplicate-records).
An explicit archive preserves the old identifiers and makes their URLs resolve
to the canonical question while removing the duplicate from active lists and
API/MCP counts. Deleting the active JSON alone is incomplete.

## Fields and topics

A **field** is one of the six research areas in `database/tags.json`;
a **topic** names the central question, resource, or operational task.
Use [the taxonomy guide](database/TAXONOMY.md) for field boundaries and
examples. Give a problem one primary field and a second only when its
statement materially spans both, then one to five topics that help a reader
find related questions. Classify the statement, rather than every technique
or system mentioned in its progress notes. Topics are independent of fields.

Reuse the controlled vocabulary. Avoid dimension-only tags, generic labels
such as "Quantum channels", and overlapping descriptions of the same setting.
A new topic should express a useful distinction absent from the registry and
arrive with its first problem in the same pull request. Keep the six fields
fixed unless a maintainer requests a taxonomy revision. Every renamed or
removed tag must be reconciled across all records, metadata, TeX, and ledger
exports in the same change.

## Writing rules

- Begin with the open question in one direct sentence, then give only the
  definitions and notation needed to make it precise. State domains,
  hypotheses, parameter ranges, and quantifier order explicitly.
- Number every displayed equation with `\begin{equation}...\label{eq:...}`
  and cite it with `\eqref`. Unlabeled displays fail the build.
- Report only results that materially delimit the problem. Say exactly what
  each result proves, in which regime, and why it falls short.
- Use alpha-style keys such as `[BDSW96]` and cite every reference at least
  once with `\sourcecite`. Every citation must point to an entry in the same
  record.
- Do not refer to other problems in the statement; put relations in Comment.
- Labels are local to a record. Use a prefix unique to the record (for example
  `eq:a1b2-capacity`) to keep them readable.

## Status semantics

The zoo has exactly two statuses. Do not introduce a third one (no "partially
solved", "conditionally solved", or similar): the build rejects it, and the
site's filters, statistics, and colours are designed for two.

- **Unsolved**: no complete answer to the archived question, even when
  substantial subcases are settled; say in Progress and Comment what is known
  and what remains.
- **Solved**: a complete proof or counterexample for the archived statement.
  Say in Comment whether the resolving result is peer-reviewed.

Progress on a nearby variant does not change a status.

## Supported TeX

Text mode supports the constructs used by the collection: `\emph`, `\textbf`,
`\texttt`, `\textup`, `\href`, `\url`, quotes and dashes, accents
(`\'e`, `\"u`, `\v{s}`, `\.{Z}`, ...), `\ss`, `\l`, `\L`, `\DJ`, `\newline`,
`itemize` and `enumerate`, `\sourcecite`, and `\eqref`. Mathematics passes
through to MathJax with record-local equation references resolved. External
`\\href` and `\\url` targets must be absolute `http://` or `https://` URLs;
the build checks these targets in prose, references, and mathematics.
An unsupported text-mode command stops the build
with the offending fragment; extend `site/lib/tex.mjs` if a new construct is
genuinely needed.

## Reporting progress without a pull request

Open an issue with the *Report progress or a correction* template, quoting the
problem ID, the exact claim, and the primary sources.

## Required reviews and checks

Changes to main require a PR, approval from a code owner, and all four CI checks
against the latest main. New pushes dismiss earlier approvals. The infrastructure
maintainers and scientific reviewers are listed in `.github/CODEOWNERS`; admins
follow the same rules. Do not define TeX macros or aliases in records: write
expressions with standard commands, using `\operatorname` for named operators.
See [security operations](docs/SECURITY_OPERATIONS.md) for deployment boundaries.
