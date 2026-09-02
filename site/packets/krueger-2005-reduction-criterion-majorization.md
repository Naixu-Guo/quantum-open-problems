# AI research brief: Reduction criterion implies majorization?

- Record ID: krueger-2005-reduction-criterion-majorization
- Record revision (SHA-256): 8acc60f15e2749b31cb42e73ca5b923b1b74b485e6ace3043b5ad4f10d02fa3d
- Formal statement digest (SHA-256): c68e752dd7dbb47b2e3d59f1a4dc642fcf54560321771aacc02de86d517ad5da
- Status: Solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-reduction-criterion-majorization/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-reduction-criterion-majorization.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Reduction+criterion+implies+majorization%3F

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 32-33 (Problem 9)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The answer places majorization at the weak end of the established chain separable implies PPT implies undistillable implies reduction, settling where the spectral criteria of Nielsen and Kempe sit inside the hierarchy of separability and distillability criteria.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A, \mathcal{H}_B$ | Finite-dimensional Hilbert spaces of subsystems $A$ and $B$ |
| $\rho_{AB}$ | Bipartite density matrix on $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho_A, \rho_B$ | Reduced density matrices: $\rho_A = \mathrm{Tr}_B \rho_{AB}$, $\rho_B = \mathrm{Tr}_A \rho_{AB}$ |
| $\mathrm{Tr}_X$ | Partial trace over subsystem $X$ |
| $I_A, I_B$ | Identity operator on $\mathcal{H}_A$, $\mathcal{H}_B$ |
| $\rho^{T_B}$ | Partial transpose of $\rho_{AB}$ on subsystem $B$ |
| $\lambda(\rho)$ | Eigenvalue (column) vector of $\rho$ in non-increasing order |
| $\prec$ | Majorization relation: $x \prec y$ iff $\sum_{i=1}^{k} x_i^{\downarrow} \leq \sum_{i=1}^{k} y_i^{\downarrow}$ for all $k$, with equality at $k = \dim$ |
| $\prec_w$ | Weak (sub-)majorization relation |
| $\Vert R\Vert$ | Operator norm of $R$ |
| PPT | Positive partial transpose criterion: $\rho^{T_B} \geq 0$ |

## Formal statement

Let $\rho_{AB}$ be a bipartite density matrix on $\mathcal{H}_A \otimes \mathcal{H}_B$ with reductions $\rho_A = \mathrm{Tr}_B \rho_{AB}$ and $\rho_B = \mathrm{Tr}_A \rho_{AB}$.

**Question.** Does the reduction criterion
$$\rho_A \otimes I_B \;\geq\; \rho_{AB} \qquad \text{and} \qquad I_A \otimes \rho_B \;\geq\; \rho_{AB}$$
imply the majorization inequalities
$$\lambda(\rho_{AB}) \;\prec\; \lambda(\rho_A) \qquad \text{and} \qquad \lambda(\rho_{AB}) \;\prec\; \lambda(\rho_B)\,?$$

More broadly: where does majorization sit in the hierarchy of separability/entanglement criteria?

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2003: Hiroshima proves the reduction criterion implies majorization

- Evidence: Peer reviewed; Exact theorem
- Finding: Hiroshima shows that the reduction inequality yields an operator R of norm at most one with rho_AB^(1/2) = (rho_A^(1/2) tensor I) R, from which one constructs a substochastic matrix relating the two spectra. This gives weak submajorization, which upgrades to ordinary majorization because both spectra have unit trace, so the archived implication holds and majorization is the weakest criterion in the hierarchy.
- Source: https://arxiv.org/abs/quant-ph/0303057

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
