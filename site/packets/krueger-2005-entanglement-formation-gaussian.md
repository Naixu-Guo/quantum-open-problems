# AI research brief: Entanglement of formation for Gaussian states

- Record ID: krueger-2005-entanglement-formation-gaussian
- Record revision (SHA-256): 0a3da2397d10ebc6800dc9b5cc605d8ad3d27584c9df79bcb49f6849c1705801
- Formal statement digest (SHA-256): 39add630f17c11577506f2ba6fb44834acdf68480c1077f8c538be7d1744536f
- Status: Partially solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-entanglement-formation-gaussian/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-entanglement-formation-gaussian.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Entanglement+of+formation+for+Gaussian+states

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 72-73 (Problem 29)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Gaussian decompositions are computable from covariance data, while the unrestricted convex roof is hard. Equality would give the exact entanglement cost for a broad class of continuous-variable states.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of bipartite modes (Alice/Bob), here infinite-dimensional bosonic |
| $\rho_{AB}$ | A bipartite quantum state (density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$) |
| Gaussian state | A bosonic state whose Wigner function is a Gaussian; equivalently a state characterised entirely by its first and second canonical moments |
| Squeezed Gaussian state | A pure Gaussian state obtained from the vacuum by a Gaussian unitary (displacements and symplectic transformations); in single-mode language, a squeezed vacuum |
| $\vert\psi_i\rangle$ | Pure states in a convex decomposition of $\rho_{AB}$ |
| $p_i$ | Probabilities in the convex decomposition, with $\sum_i p_i = 1$ |
| $S(\sigma)$ | Von Neumann entropy of a quantum state $\sigma$, $S(\sigma)=-\mathrm{tr}(\sigma\log\sigma)$ |
| $S(\mathrm{tr}_B\vert\psi\rangle\langle\psi\vert)$ | Entropy of entanglement of a pure bipartite state $\vert\psi\rangle$ |
| $E_F(\rho_{AB})$ | Entanglement of formation of $\rho_{AB}$, defined as the convex-roof extension of the entropy of entanglement |
| $E_F^G(\rho_{AB})$ | Gaussian entanglement of formation: same convex-roof construction but restricted to decompositions into pure *Gaussian* states |
| Two-mode Gaussian state | A Gaussian state on $\mathcal{H}_A\otimes\mathcal{H}_B$ with one mode on each side |
| Mode-symmetric | A two-mode Gaussian state invariant under swap of the two modes (equivalently, with identical local marginals) |

## Formal statement

Let $\rho_{AB}$ be an arbitrary (mixed) bipartite Gaussian state on $\mathcal{H}_A\otimes\mathcal{H}_B$.

**Question.** Is the infimum defining $E_F(\rho_{AB})$ always attained by a decomposition of $\rho_{AB}$ into pure states which are all translates (by Gaussian-weighted displacements) of a *single* pure squeezed Gaussian state? Equivalently, does
$$E_F(\rho_{AB}) \;=\; E_F^G(\rho_{AB})$$
hold for *every* bipartite Gaussian state $\rho_{AB}$?

Show or disprove this statement.

## Exact unresolved remainder

Prove or refute equality with Gaussian entanglement of formation for arbitrary nonsymmetric multimode Gaussian states.

## Checked progress

### 2026-08-03: All two-mode Gaussian states are settled

- Evidence: Preprint; Exact major subclass
- Finding: Adesso proves equality for every two-mode Gaussian state and for bisymmetric multimode states, but not for generic nonsymmetric multimode states.
- Source: https://arxiv.org/abs/2608.01909

## Scope and cautions

- Very recent: This was a first-version preprint nine days old at the audit cutoff. Its theorem is a major partial result, not a solution for all multimode states. (https://arxiv.org/abs/2608.01909)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
