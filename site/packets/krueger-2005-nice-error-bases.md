# AI research brief: Nice error bases

- Record ID: krueger-2005-nice-error-bases
- Record revision (SHA-256): f62845aee543ef0141f8c224427c65d11b2fb0105e07cbdc28d5f5e24843719d
- Formal statement digest (SHA-256): 2d5d2166d0c60f2f1e1e450d12ff106568aada756960f1e547177ce0227c382c
- Status: Solved
- Field: Quantum information
- Topic: Quantum error correction
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-nice-error-bases/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-nice-error-bases.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Nice+error+bases

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 26-27 (Problem 6)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Orthogonal bases of unitaries are exactly what is needed to build teleportation and dense-coding schemes and underlie stabilizer code theory, and the question asked whether the algebraic notion of a nice error basis coincides with the combinatorial shift-and-multiply notion built from Latin squares and complex Hadamard matrices.

## Notation

| Symbol | Meaning |
|---|---|
| $d$ | Dimension of the Hilbert space |
| $\mathcal{H}$ | $d$-dimensional Hilbert space |
| $U_i$ | Unitary operator on $\mathcal{H}$, $i = 1, \ldots, d^2$ |
| $U_i^{*}$ | Adjoint of $U_i$ |
| $\mathrm{tr}$ | Trace |
| $\delta_{ij}$ | Kronecker delta |
| Orthogonal basis of unitaries | $\{U_1, \ldots, U_{d^2}\}$ with $\mathrm{tr}(U_i^{*} U_j) = d\,\delta_{ij}$ |
| Nice error basis | Orthogonal basis of unitaries such that $U_i U_j = \omega_{ij} U_k$ for some phase $\omega_{ij}$ and label $k$ depending on $(i,j)$ |
| Index group | The group on $\{1, \ldots, d^2\}$ obtained from the multiplication law $(i,j) \mapsto k$ |
| Shift and multiply type | Basis whose unitaries are products of $d$ permutation operators and $d$ multiplication operators |
| Latin square | $d \times d$ matrix whose rows and columns are each permutations of $\{1, \ldots, d\}$ |
| Hadamard matrix (complex) | $d \times d$ complex matrix $H$ with $\lvert H_{ij}\rvert=1$ and $H H^{*} = d I$ |
| Group of central type | Finite group $H$ possessing an irreducible representation of dimension $\sqrt{\lvert H/Z(H)\rvert}$, where $Z(H)$ is the centre of $H$ |
| Monomial unitary | Unitary whose matrix has exactly one non-vanishing entry in each row and column |
| Abstract error group | Central extension of the index group |

## Formal statement

Decide the following question: *is every nice error basis of shift and multiply type?* Equivalently, given an orthogonal basis $\{U_1, \ldots, U_{d^2}\}$ of unitaries on $\mathbf{C}^d$ such that $\mathrm{tr}(U_i^{*} U_j) = d\,\delta_{ij}$ and $U_i U_j = \omega_{ij} U_k$ for some phases $\omega_{ij}$, does there exist a unitary change of basis of $\mathbf{C}^d$ after which every $U_i$ is a product of a permutation matrix and a diagonal unitary?

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2003: Klappenecker and Roetteler exhibit a non-monomial nice error basis

- Evidence: Preprint; Exact counterexample
- Finding: Klappenecker and Roetteler build, from representation-theoretic results of Ferguson and Isaacs on groups of central type, an abstract error group with cyclic centre possessing a non-monomial irreducible representation. The corresponding nice error basis is therefore not monomial and in particular not of shift and multiply type, so the archived universal claim is false.
- Source: https://arxiv.org/abs/quant-ph/0301078

## Scope and cautions

- Scope: Only the shift-and-multiply universality claim is settled; the classification of all abstract error groups and of all nice error bases up to equivalence in arbitrary dimension remains active.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
