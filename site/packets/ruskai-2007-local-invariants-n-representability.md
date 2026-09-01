# AI research brief: Local invariants and N-representability

- Record ID: ruskai-2007-local-invariants-n-representability
- Record revision (SHA-256): a76b701a4b5cbe62b23f7b16e91498fcac68d566b78fbada579b178d145164d5
- Formal statement digest (SHA-256): 6216d9a5a0c63e0a378bda6ff4533f7de05da02a40f5ae590b188e41eccabf61
- Status: Partially solved
- Field: Quantum information
- Topic: Quantum invariants and representability
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-local-invariants-n-representability/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-local-invariants-n-representability.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Local+invariants+and+N-representability

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 17 (Problem 24, Section 7)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Local invariants provide basis-independent coordinates for two-particle states. Expressing N-representability in those coordinates would connect orbit classification to the quantum marginal problem.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | total number of particles |
| $p$ | number of particles retained in the reduced density matrix; $p<N$ |
| $\rho=\rho_{1,2,\dots,N}$ | $N$-particle density matrix on the (anti-)symmetric subspace of the single-particle Hilbert space $\mathcal{H}^{\otimes N}$ |
| $\rho_{1,2,\dots,p}$ | $p$-particle reduced density matrix, $\rho_{1,2,\dots,p}=\operatorname{Tr}_{p+1,\dots,N}\rho$ |
| $\rho_1$ | 1-particle reduced density matrix |
| $\rho_{12}$ | 2-particle reduced density matrix (the "2-matrix") |
| $U$ | unitary on the single-particle space $\mathcal{H}$ |
| $U^{\otimes p}$ | $p$-fold tensor product unitary $U\otimes U\otimes\cdots\otimes U$ |
| local invariant | function of $\rho_{1,2,\dots,p}$ invariant under $\rho_{1,2,\dots,p}\mapsto U^{\otimes p}\,\rho_{1,2,\dots,p}\,U^{\otimes p\,\dagger}$ |
| QMA | the quantum analogue of NP (Merlin-Arthur with quantum witness) |

## Formal statement

**Problem 24 (Ruskai 2007).** Find a *minimal complete set of local invariants* for an antisymmetric (or symmetric) 2-particle density matrix $\rho_{12}$. That is, exhibit a finite set of polynomial (or otherwise tractable) functionals
$$I_1(\rho_{12}),\, I_2(\rho_{12}),\, \dots,\, I_K(\rho_{12})$$
each invariant under the action $\rho_{12}\mapsto (U\otimes U)\,\rho_{12}\,(U\otimes U)^\dagger$ for every unitary $U$ on the single-particle space, with the properties:
1. (Completeness) $I_j(\rho_{12})=I_j(\sigma_{12})$ for all $j$ if and only if $\sigma_{12}=(U\otimes U)\,\rho_{12}\,(U\otimes U)^\dagger$ for some unitary $U$.
2. (Minimality) $K$ is the smallest cardinality with property (1).
The desired set should be such that the $N$-representability constraints for the antisymmetric (resp. symmetric) 2-matrix can be expressed in terms of these invariants.

## Exact unresolved remainder

Find a finite-dimensional minimal complete invariant set for mixed symmetric or antisymmetric two-particle states and express N-representability in those invariants.

## Checked progress

### 2011: The stable invariant algebra has graph-indexed generators

- Evidence: Mixed; Stable-regime characterization
- Finding: Vrana constructs systematic complete families and a free stable algebra, without solving the finite-dimensional minimal mixed-state problem.
- Source: https://arxiv.org/abs/1107.2438

### 2007: General two-body N-representability is QMA-complete

- Evidence: Peer reviewed; Complexity classification
- Finding: The complexity theorem gives a strong obstruction to any efficient general criterion, but does not identify the requested minimal invariants.
- Source: https://arxiv.org/abs/quant-ph/0609125

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
