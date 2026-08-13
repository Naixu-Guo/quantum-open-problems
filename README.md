# Quantum Information Open Problems

A dated audit of 53 quantum-information problems collected from the Horodecki, Krueger-Werner, and Ruskai lists.

**[Browse the research index](https://naixu-guo.github.io/quantum-information-open-problems/)**

The audit cutoff is 12 August 2026. The current ledger contains:

- 23 open problems
- 10 partially solved problems
- 20 solved problems

The website lists the 33 active questions. Each entry separates the exact remaining problem from recent progress, publication maturity, and warnings about withdrawn, conditional, disputed, or narrower claims.

## Repository structure

- `site/`: dependency-free GitHub Pages website and structured active-problem catalog
- `open_prob/`: one Markdown article and one metadata record for each of the 53 audited problems
- `STATUS_AUDIT.md`: complete status table, evidence summary, and source corrections
- `WEBSITE.md`: local preview, deployment, and update instructions

Run the catalog consistency check with:

```sh
node site/validate.mjs
```

The check compares the website catalog with the source metadata and enforces the audited totals.

## Status policy

`solved` means that a proof or counterexample settles the archived statement. `partially solved` means that a named subproblem or major precise subclass is settled. `open` means that the archived question still lacks a proof or counterexample.

Preprints, peer-reviewed papers, withdrawn manuscripts, and conditional theorems receive separate evidence labels. See [STATUS_AUDIT.md](STATUS_AUDIT.md) for the full methodology and citations.
