# AI research brief: Lockability of two-way distillable entanglement and key

- Record ID: krueger-2005-lockable-entanglement-measures
- Record revision (SHA-256): da5bbcb4a5cd84c1fe1d740e921319cd5f83d8c9678173af894874437b2df987
- Formal statement digest (SHA-256): 4759a7fcb022e32fe496ad71c71ac778f0e9ddeae9fc745dcb54d38a056f38f4
- Status: Open
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-lockable-entanglement-measures/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-lockable-entanglement-measures.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Lockability+of+two-way+distillable+entanglement+and+key

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 65 (Problem 25)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

An affirmative answer would show that losing one qubit can destroy an unbounded amount of recoverable entanglement or secret key. That behavior sets a sharp limit on the robustness of these resources.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of Alice and Bob |
| $\rho_{AB}$ | A bipartite quantum state on $\mathcal{H}_A\otimes\mathcal{H}_B$ |
| $E(\rho_{AB})$ | A generic entanglement measure (a non-negative functional on bipartite states) |
| $E_F$ | Entanglement of formation |
| $E_C$ | Entanglement cost |
| $E_N$ | Logarithmic negativity |
| $E_{sq}$ | Squashed entanglement |
| $D_2(\rho_{AB})$ | Two-way distillable entanglement (asymptotic rate of EPR pairs extractable from $\rho_{AB}$ by two-way LOCC) |
| $K_D(\rho_{AB})$ | Distillable secret-key rate of $\rho_{AB}$ |
| LOCC | Local operations and classical communication |
| "Lockable" | A measure $E$ is *lockable* if there exist states for which tracing out a single local qubit causes $E$ to drop by an arbitrarily large amount |

## Formal statement

Are two-way distillable entanglement $D_2$ and the distillable secret-key rate $K_D$ lockable?

Concretely: do there exist states $\rho_{ABA'}$ on $\mathcal{H}_A\otimes\mathcal{H}_B\otimes\mathcal{H}_{A'}$ with $\dim\mathcal{H}_{A'}=2$ such that
$$D_2(\rho_{AA'B}) - D_2(\mathrm{tr}_{A'}\,\rho_{AA'B})$$
can be made arbitrarily large (and similarly for $K_D$)? Equivalently, can the loss of a single qubit by Alice decrease the two-way distillable entanglement, or the distillable key rate, by an arbitrarily large amount?

## Exact unresolved remainder

Decide whether discarding one qubit held by Alice can reduce two-way distillable entanglement or distillable key by an arbitrarily large amount.

## Checked progress

### 2021-07-22: Non-lockability is proved for irreducible private states

- Evidence: Peer reviewed; Restricted theorem
- Finding: The result controls two-way distillable key on a restricted family, not arbitrary bipartite states.
- Source: https://arxiv.org/abs/2107.10737

### 2006-08-25: Eve-side information obeys a different non-locking result

- Evidence: Peer reviewed; Different operational model
- Finding: The theorem concerns information held by an eavesdropper, not loss of a local qubit by Alice or Bob.
- Source: https://arxiv.org/abs/quant-ph/0608199

### 2004-04-16: Several other entanglement measures can be locked

- Evidence: Peer reviewed; Exact nearby result
- Finding: One qubit can lock entanglement of formation, entanglement cost, logarithmic negativity and one-way distillable entanglement.
- Source: https://arxiv.org/abs/quant-ph/0404096

## Scope and cautions

- Interpretation: Alice-or-Bob loss of a subsystem is not the same operational model as changing an eavesdropper's side information.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
