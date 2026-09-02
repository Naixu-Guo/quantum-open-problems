# Quantum Open Problems

An index of open problems across quantum science, checked against primary papers and recent claims.

**[Browse the research index](https://naixu-guo.github.io/quantum-open-problems/)**

The baseline audit covers 53 questions from the Horodecki, Krueger–Werner, and Ruskai quantum-information lists. The 33 active questions inherited from those lists stay in the `Quantum information` field; their topic labels do not promote them into other research fields.

The catalog also includes two quantum-sensing questions found through GaugeForge and three TheoremDB questions accepted after a primary-source review.

As of 31 August 2026, the catalog contains:

- 28 open problems
- 10 partially solved problems
- 20 solved problems

The website lists the 38 active questions across five research fields. Each problem has a stable page at `/problems/<record-id>/` with the source article's full formal statement with typeset equations, the exact remaining problem, recent progress, publication maturity, and warnings about withdrawn, conditional, disputed, or narrower claims. Solved records keep an archived page at the same URL pattern, so citations survive resolution. Each active record is also available as JSON, as a Markdown research brief, and inside the bulk snapshot.

## Repository structure

- `site/`: dependency-free GitHub Pages website and structured active-problem catalog
- `mcp/`: zero-dependency MCP server exposing the catalog to AI agents over stdio
- `catalog/`: canonical data contract, schemas, representative records, and compatibility projector
- `open_prob/`: one Markdown article and one metadata record for each of the 58 cataloged problems
- `docs/adr/`: accepted architecture decisions, beginning with the database-first boundary
- `ARCHITECTURE.md`: scale plan for canonical records, evidence events, review, and agent interfaces
- `CONTRIBUTING.md`: evidence requirements for human and AI-assisted research updates
- `STATUS_AUDIT.md`: complete status table, evidence summary, and source corrections
- `WEBSITE.md`: local preview, deployment, and update instructions

Run the catalog consistency check with:

```sh
node site/build.mjs
```

The build generates the website read models and API, then checks them against source metadata, taxonomy, status, and catalog totals.

The build also validates the canonical vertical slice. That slice proves that
canonical Problem, StatementVersion, Source, Claim, Evidence, and Decision
objects can reproduce existing API v1 records and research packets without
changing their public revisions. See [`catalog/README.md`](catalog/README.md)
and [ADR 0001](docs/adr/0001-database-first-architecture.md).

## Catalog architecture

Editors maintain the current catalog in [`site/data/problems.js`](site/data/problems.js). The build creates a compact browser index and one complete JSON record per problem. The schema has three independent layers:

- `taxonomy.areas`: broad fields such as quantum information or quantum field theory
- `taxonomy.topics`: narrower subjects, each attached to one field
- `collections`: provenance records for the source lists

Each problem stores stable topic and collection IDs. The topic registry assigns the broad field. Editors add a field and its topics through data records, and the explorer reads them from the catalog.

The website generates `site/data/formal-statements.js` from the `## Notation` and `## Formal statement` sections of each active article. It generates `site/data/problem-sources.js` from each record's source metadata, including the paper or problem list, authors, statement locator, and primary URL. The validator compares the generated data with its sources.

Agents can connect through MCP: `claude mcp add quantum-open-problems -- npx -y github:Naixu-Guo/quantum-open-problems` (or `codex mcp add …`) runs [`mcp/server.mjs`](mcp/server.mjs), which exposes search, records, research briefs, evidence watching, and the contribution contract as tools over the published catalog. The [agent guide](site/ai/) documents the full research loop. Without MCP, agents can discover the catalog through [`site/llms.txt`](site/llms.txt), read individual records under `site/api/v1/problems/`, or download the JSONL snapshot. `site/llms-full.txt` concatenates every research brief for one-fetch ingestion. An agent should poll `site/api/v1/release.json` for the catalog date, digest, and counts, then read `site/api/v1/evidence.json` or the Atom/JSON feeds (`site/feed.xml`, `site/feed.json`) for dated evidence events with stable content-hash IDs. `site/sitemap.xml` lists the stable problem pages for crawlers. The browser loads the compact discovery index and fetches complete records on demand. See [ARCHITECTURE.md](ARCHITECTURE.md) for the canonical-record migration and contribution model.

## AI research packets

Every active record has a generated Markdown research brief at `site/packets/<record-id>.md`. It combines the problem-source citation, source formulation, exact remaining question, checked evidence, scope cautions, and a research-output contract. The detail view copies the same generated text, so a person and an AI agent start from the same dated record.

Research updates enter through structured GitHub issue forms. Contributors must identify the claim's exact scope, primary sources, reproducible artifacts, remaining gap, AI involvement, and human checks. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Status policy

`solved` means that a proof or counterexample settles the archived statement. `partially solved` means that a named subproblem or major precise subclass is settled. `open` means that the archived question still lacks a proof or counterexample.

Preprints, peer-reviewed papers, withdrawn manuscripts, and conditional theorems receive separate evidence labels. See [STATUS_AUDIT.md](STATUS_AUDIT.md) for the baseline audit and the later catalog additions.
