# AI research brief: Separability from spectrum

- Record ID: krueger-2005-separability-from-spectrum
- Record revision (SHA-256): 95a42598410681e7dc9a2c7b6dcf204de88a0f07815d96ad0c234cfbe5f833cb
- Formal statement digest (SHA-256): c373f12f68a4584e6e71ed51b73738589848e1043304edd0d9a43dae4b309374
- Status: Partially solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-separability-from-spectrum/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-separability-from-spectrum.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Separability+from+spectrum

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 48-49 (Problem 15)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Absolute separability identifies mixed states whose eigenvalues forbid entanglement under any global change of basis. A spectral criterion would decide this property without optimizing over unitaries.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | Total complex Hilbert space of dimension $NM$ |
| $N, M$ | Dimensions of the two tensor factors in a candidate bipartition |
| $\rho$ | Density matrix (mixed state) on $\mathcal{H}$ |
| $\mathrm{spec}(\rho)$ | Spectrum (multiset of eigenvalues) of $\rho$ |
| $x_1, x_2, x_3, x_4$ | Eigenvalues of a two-qubit state, listed in decreasing order |
| $U$ | Unitary operator on $\mathcal{H}$ |
| $U \rho U^*$ | State unitarily equivalent to $\rho$ |
| $E_F$ | Entanglement of formation |
| $\mathrm{sep}_{N,M}$ | Set of separable states with respect to a fixed $N \otimes M$ factorisation |

## Formal statement

Fix integers $N, M \geq 2$ and let $\mathcal{H}$ have dimension $NM$. For a mixed state $\rho$ on $\mathcal{H}$, consider the question: does there exist a factorisation $\mathcal{H} \cong \mathbb{C}^N \otimes \mathbb{C}^M$ with respect to which $\rho$ is not separable? Equivalently, does there exist a unitary $U$ on $\mathcal{H}$ such that $U \rho U^*$ is entangled across a fixed $N \otimes M$ bipartition?

Because this question depends only on $\mathrm{spec}(\rho)$, define
$$\mathcal{S}_{N,M} \;=\; \bigl\{\, \mathrm{spec}(\rho) \,:\, \text{for every unitary } U \text{ on } \mathcal{H},\; U \rho U^* \in \mathrm{sep}_{N,M} \,\bigr\}.$$

**Problem.** Characterise the set $\mathcal{S}_{N,M}$ — i.e. the spectra for which the answer to the question above is "no" (no entangling factorisation exists), so that separability with respect to the fixed $N \otimes M$ bipartition is forced by the spectrum alone.

## Exact unresolved remainder

Characterize spectra that remain separable under every global unitary in all higher local dimensions.

## Checked progress

### 2024-08-21: A 4-by-n claim proves APPT, not absolute separability

- Evidence: Preprint; Unaccepted scope claim
- Finding: The theorem establishes an absolute-PPT criterion but does not prove that APPT equals absolute separability in this dimension.
- Source: https://arxiv.org/abs/2408.11684

### 2013-09-08: Every qubit-qudit spectrum is characterized

- Evidence: Peer reviewed; Exact major subclass
- Finding: Johnston proves that APPT and absolute separability coincide for 2-by-n systems and gives the complete criterion there.
- Source: https://arxiv.org/abs/1309.2006

## Scope and cautions

- Terminology: APPT is necessary for absolute separability, but the two sets are not known to coincide in general higher dimensions. (https://arxiv.org/abs/2408.11684)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
