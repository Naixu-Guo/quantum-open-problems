# AI research brief: Additivity of classical capacity and related problems

- Record ID: krueger-2005-additivity-classical-capacity
- Record revision (SHA-256): 60c9202955735aa112749c65bf8c895119925b9e092913b1b62cdafbade79eb5
- Formal statement digest (SHA-256): ac5cd3b2bbb9fa75606b88983008dca06ecb0fb351d29fab63859f40f7e78e0b
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-additivity-classical-capacity/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-additivity-classical-capacity.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Additivity+of+classical+capacity+and+related+problems

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 34-40 (Problem 10)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Additivity would have collapsed the regularised expression for the classical capacity of every quantum channel into a clean single-letter Holevo formula, and it was known to be equivalent to additivity of minimal output entropy, additivity and strong superadditivity of the entanglement of formation, and p-norm multiplicativity near p = 1.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | Finite-dimensional complex Hilbert space |
| $T$ | Quantum channel (completely positive trace-preserving map) in the Schrödinger picture |
| $T^{\otimes n}$ | $n$-fold tensor product channel $T \otimes \cdots \otimes T$ |
| $T_1 \otimes T_2$ | Tensor product of two channels |
| $\rho, \rho_i$ | Density operators |
| $p = (p_1,\ldots,p_n)$ | Probability vector |
| $H(\rho)$ | von Neumann entropy $-\mathrm{Tr}(\rho \log \rho)$ |
| $\chi(T)$ | Holevo quantity (one-shot Holevo capacity) of channel $T$ |
| $C_{1,\infty}$ | Capacity with unentangled coding, quantum block decoding (= $\chi$) |
| $C_{\infty,1}$ | Capacity with quantum block coding and separate decoding |
| $C_{1,1}$ | Capacity with separate quantum (de)coding and only classical block (de)coding |
| $C_{\infty,\infty}$ | Full classical capacity, arbitrary (de)coding |
| $\ell_p(\mathcal{H})$ | Schatten $p$-class, $\lVert X\rVert_p = (\mathrm{Tr}\lvert X\rvert^p)^{1/p}$ |
| $\lVert T\rVert_p$ | $\sup_\rho \lVert T(\rho)\rVert_p$ |
| $H_{\min}(T)$ | Minimal output (von Neumann) entropy of $T$, $\min_\rho H(T(\rho))$ |
| EoF | Entanglement of formation |
| $d$ | Hilbert-space dimension |
| $I$ | Identity operator |
| $\rho^T$ | Transpose of $\rho$ |

## Formal statement

For a quantum channel $T$ in the Schrödinger picture, define the Holevo quantity
$$\chi(T) \;=\; \sup_{p,\,\rho}\;\Bigl( H\!\Bigl(\textstyle\sum_i p_i\,T(\rho_i)\Bigr) \;-\; \sum_i p_i\, H\!\bigl(T(\rho_i)\bigr) \Bigr),$$
where the supremum runs over all probability vectors $p = (p_1, \ldots, p_n)$ and all collections $\{\rho_1, \ldots, \rho_n\}$ of input states.

**Problem.** Either prove
$$\chi(T_1 \otimes T_2) \;=\; \chi(T_1) \;+\; \chi(T_2) \qquad \text{for every pair of quantum channels } T_1, T_2,$$
or give an explicit counterexample.

Equivalent forms include: $H_{\min}(T_1 \otimes T_2) = H_{\min}(T_1) + H_{\min}(T_2)$ for all $T_1, T_2$; additivity of the entanglement of formation; strong superadditivity of the entanglement of formation; and multiplicativity of $\|\cdot\|_p$ on tensor products for $p$ in a right-neighbourhood of $1$.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2009: Hastings disproves additivity of the Holevo capacity

- Evidence: Peer reviewed; Exact counterexample
- Finding: Hastings produced random-unitary channels in very large dimension that violate additivity of the minimal output von Neumann entropy. Via Shor's equivalence this directly implies failure of additivity of the Holevo capacity chi and of superadditivity of the entanglement of formation, so the archived additivity conjecture is false and the classical capacity is not given by a single-letter Holevo formula.
- Source: https://arxiv.org/abs/0809.3972

### 2004: Hastings disproves additivity of the Holevo capacity

- Evidence: Peer reviewed; Exact theorem
- Finding: Hastings produced random-unitary channels in very large dimension that violate additivity of the minimal output von Neumann entropy. Via Shor's equivalence this directly implies failure of additivity of the Holevo capacity chi and of superadditivity of the entanglement of formation, so the archived additivity conjecture is false and the classical capacity is not given by a single-letter Holevo formula.
- Source: https://arxiv.org/abs/quant-ph/0305035

## Scope and cautions

- Scope: Additivity of chi still holds for special classes (identity channel, unital qubit channels, the depolarising channel in every dimension, entanglement-breaking channels, and some Gaussian cases); quantitative sub-questions such as the size of the violation, the qubit-channel case and the rate of convergence of the regularisation remain open.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
