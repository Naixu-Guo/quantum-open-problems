# AI research brief: SIC POVMs in infinitely many dimensions

- Record ID: horodecki-2020-sic-povm-infinite-dimensions
- Record revision (SHA-256): 66aa45d9392755bea77803c546dd115f67d825cbee90a8737f41ded3755e9e26
- Formal statement digest (SHA-256): 5bd2d0214053ad35b60a5e61a53884f7d170480303e967561094798ef63031f0
- Status: Open
- Field: Quantum information
- Topic: Quantum designs
- Collection: Horodecki
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/horodecki-2020-sic-povm-infinite-dimensions/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/horodecki-2020-sic-povm-infinite-dimensions.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+SIC+POVMs+in+infinitely+many+dimensions

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Five open problems in theory of quantum information
- Authors: Paweł Horodecki, Łukasz Rudnicki, Karol Życzkowski
- Venue: PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]
- Statement locator: p. 2-3 (Problem 1)
- Read source: https://doi.org/10.1103/PRXQuantum.3.010101

## Why it matters

A SIC gives a minimal d²-outcome scheme for quantum-state tomography and forms a complex projective 2-design. An infinite exact family would expose the arithmetic mechanism behind known examples.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Dimension of a complex Hilbert space |
| $\mathcal{H}_N$ | $N$-dimensional complex Hilbert space |
| $\lvert\psi_j\rangle$ | Pure state vector in $\mathcal{H}_N$, with $j=1,\dots,N^2$ |
| $\langle\psi_j\vert\psi_k\rangle$ | Inner product of two state vectors |
| $\delta_{jk}$ | Kronecker delta: $1$ if $j=k$, $0$ otherwise |
| $N_1, N_2, N_3, \dots$ | An infinite sequence of dimensions in which SICs are sought |
| $\mathbb{Z}$ | The integers (used for the Weyl–Heisenberg index group) |
| $F_N$ | Discrete Fourier matrix of size $N$ |

## Formal statement

**Problem 1:** *Construct SIC POVMs in an infinite sequence of dimensions, $N_1, N_2, N_3, \dots$.*

A symmetric informationally complete positive operator valued measure associated with $\mathcal{H}_N$ is a set of $N^2$ vectors $\lvert\psi_j\rangle\in\mathcal{H}_N$ satisfying the overlap relations
$$|\langle\psi_j|\psi_k\rangle|^2 = \frac{N\,\delta_{jk}+1}{N+1}, \qquad j,k=1,\dots,N^2.$$
The task is to exhibit an infinite increasing sequence of dimensions $N_1<N_2<\dots$ together with explicit SIC POVMs in each $\mathcal{H}_{N_i}$. Equivalently, prove Zauner's conjecture (existence of a SIC in $\mathcal{H}_N$ for every $N\geq 2$) along an infinite family of dimensions.

## Exact unresolved remainder

Give an unconditional exact SIC construction in infinitely many dimensions.

## Checked progress

### 2026-05-31: Claimed all-dimension proof was withdrawn

- Evidence: Withdrawn; Incorrect claim
- Finding: The arXiv withdrawal notice for Joka's manuscript states that the proof is incorrect.
- Source: https://arxiv.org/abs/2601.13475

### 2025-03-17: Uniform construction remains conditional

- Evidence: Preprint; Conditional theorem
- Finding: Appleby, Flammia and Kopp obtain all dimensions only under two unproved arithmetic and special-value conjectures.
- Source: https://arxiv.org/abs/2501.03970

## Scope and cautions

- Withdrawn claim: The 2026 all-dimension claim is explicitly withdrawn as incorrect. The 2025 construction is conditional, so neither closes this problem. (https://arxiv.org/abs/2601.13475)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
