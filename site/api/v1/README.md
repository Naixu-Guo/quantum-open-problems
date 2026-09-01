# Quantum Open Problems API v1

Public read endpoints need no authentication.

- `release.json`: release date, catalog digest, and record counts; poll this first
- `index.json`: compact catalog metadata and discovery records
- `problems/<record-id>.json`: one complete, source-aware problem record
- `problems.jsonl`: full snapshot for batch research and indexing
- `evidence.json`: every dated evidence event, newest first, for catalog watching
- `problem.schema.json`: JSON Schema for problem records
- `contribution.schema.json`: shared write contract for future human forms and agent tools

Each record also has a human page at `/problems/<record-id>/` and a Markdown research brief at `/packets/<record-id>.md`. Solved records keep an archived page at the same URL pattern.

Treat `status` as a dated editorial assessment. Read `dates.verified`, `source.relationship`, and `evidence.cautions` before using a record. A source may state the question or document a limitation from which editors derived a narrower problem.
