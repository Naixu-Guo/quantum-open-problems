# AI research brief: Maximally entangled mixed states

- Record ID: krueger-2005-maximally-entangled-mixed-states
- Record revision (SHA-256): 5e02a62d44ca291eaf6638c72563442b18b47300142d558383389b1734c37141
- Formal statement digest (SHA-256): e67536618f00757fe82f1e4cd1974116072babfcc559bc9efcba061b113c0aee
- Status: Solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-maximally-entangled-mixed-states/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-maximally-entangled-mixed-states.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Maximally+entangled+mixed+states

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 25 (Problem 5)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Verstraete, Audenaert and De Moor found the same maximisers for entanglement of formation, relative entropy of entanglement and negativity, and a measure-independent notion of the most entangled state at a given spectrum would have been a robust structural fact about mixed two-qubit entanglement.

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | Density operator on a bipartite Hilbert space |
| $\mathrm{spec}(\rho)$ | Spectrum (set of eigenvalues with multiplicity) of $\rho$ |
| $E$ | A generic measure of entanglement (a real-valued functional on density operators) |
| $E_F$ | Entanglement of formation |
| $E_R$ | Relative entropy of entanglement |
| $\mathcal{N}$ | Negativity (entanglement measure based on partial transpose) |
| MEMS | Maximally entangled mixed state(s) |
| $S(\rho)$ | Von Neumann entropy $-\mathrm{tr}(\rho \log \rho)$ |
| $\lambda_{\max}(\rho)$ | Largest eigenvalue of $\rho$ |
| Entanglement monotone | Functional non-increasing on average under LOCC |
| LOCC | Local operations and classical communication |

## Formal statement

Consider density operators on a two-qubit Hilbert space $\mathbf{C}^2 \otimes \mathbf{C}^2$ with a fixed spectrum. Among all such states, look for those maximising a given measure of entanglement. The question is:

For *every* entanglement monotone $E$ on bipartite states, is the set of two-qubit density operators (with fixed spectrum) that maximise $E$ the same family — namely, the VAM "maximally entangled mixed states" — as for entanglement of formation, relative entropy of entanglement, and negativity?

Equivalently: does there exist an entanglement monotone $E$ and a spectrum $(\lambda_1, \ldots, \lambda_4)$ for which the maximiser of $E$ over states with that spectrum differs from the MEMS identified by VAM?

Variants of the question are also posed:

- Replace two qubits by higher-dimensional systems $\mathbf{C}^d \otimes \mathbf{C}^d$ and characterise the maximally entangled states with respect to a given spectrum.
- Replace the spectral constraint by a weaker one — e.g., a fixed largest eigenvalue $\lambda_{\max}(\rho)$, or a fixed von Neumann entropy $S(\rho)$ — and study the corresponding maximisers.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2024: Maximally entangled mixed states for a fixed spectrum need not exist

- Evidence: Peer reviewed; Exact counterexample
- Finding: De Vicente proves that for particular rank-two two-qubit spectra no isospectral state can be converted into every other isospectral state even under non-entangling operations, a class larger than LOCC. Consequently no single state can maximise every entanglement monotone at those spectra, which answers the archived universal question in the negative.
- Source: https://arxiv.org/abs/2402.05673

## Scope and cautions

- Scope: Camacho and de Vicente (Phys. Rev. A 113, 022416 (2026); arXiv:2511.08285) extend the nonexistence theorem to every rank-two and rank-three two-qubit spectrum and to a large class of full-rank spectra.
- Scope: The higher-dimensional variant and the weaker-constraint variants (fixed largest eigenvalue or fixed von Neumann entropy) posed alongside the archived question remain separate open classification problems.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
