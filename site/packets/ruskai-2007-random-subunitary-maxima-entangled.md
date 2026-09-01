# AI research brief: Maximally entangled relative maxima for sub-unitary channels

- Record ID: ruskai-2007-random-subunitary-maxima-entangled
- Record revision (SHA-256): b9a02c8d36abacde237dea59968bee9ad9d23485bb1627953f35939d9fb40be0
- Formal statement digest (SHA-256): 854d336a72d1c7b508562f1fbd69e565d1228f736ab5ddae5c50232d9c0ee71f
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-random-subunitary-maxima-entangled/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-random-subunitary-maxima-entangled.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Maximally+entangled+relative+maxima+for+sub-unitary+channels

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 10 (Problem 8)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Maximally entangled inputs form the standard ansatz for two-copy channel optimization. Confirming or rejecting that ansatz in this family would locate the states responsible for output-norm extrema.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$ | A density matrix (positive semi-definite, trace $1$) acting on a finite-dimensional Hilbert space |
| $\Phi$ | A completely positive trace-preserving (CPT) linear map (quantum channel) |
| $\{A_k\}$ | Kraus operators of a channel, so $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$ with $\sum_k A_k^{\dagger}A_k=I$ |
| $X$ | Cyclic shift operator on $\mathbb{C}^d$, $X\lvert e_j\rangle=\lvert e_{j+1}\rangle$ (indices mod $d$) |
| $U_k$ | A $(d-1)\times(d-1)$ unitary matrix used in the $k$-th Kraus operator |
| $d$ | Dimension of the input/output Hilbert space of the channel |
| $\|M\|_p$ | Schatten $p$-norm, $\|M\|_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\Phi\otimes\Phi$ | Tensor (parallel) action of two copies of $\Phi$ on $M_d\otimes M_d$ |
| Maximally entangled state | Pure state on $\mathbb{C}^d\otimes\mathbb{C}^d$ of the form $\lvert\Psi\rangle=\frac{1}{\sqrt d}\sum_{j}\lvert j\rangle\otimes\lvert j\rangle$ (up to local unitaries) |
| $\nu_p(\Phi)$ | Maximal output $p$-norm purity, $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$ |
| WH channel | Werner–Holevo channel |
| Relative maximum | Critical input state at which $\|(\Phi\otimes\Phi)(\rho)\|_p$ attains a local maximum |

## Formal statement

Interpreting equation (22) as the intended normalized cyclic random-sub-unitary construction, let $\Phi:M_d\to M_d$ belong to that CPT family. The source prints
$$A_k=\frac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb{C}^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary, but this formula is not CPT as written.

**Problem 8.** Does the set of relative maxima of
$$\rho\mapsto\|(\Phi\otimes\Phi)(\rho)\|_p,\qquad \rho\in M_d\otimes M_d,$$
always include inputs that are maximally entangled pure states? If not, for which values of $p$ and under what additional circumstances do maximally entangled inputs yield outputs that are relative maxima of $\|(\Phi\otimes\Phi)(\rho)\|_p$?

## Exact unresolved remainder

Decide whether maximally entangled inputs are always among the relative maxima of the two-copy output p-norm for the corrected family.

## Checked progress

### 2007: The Werner-Holevo critical point is a special case only

- Evidence: Peer reviewed; Exact special case
- Finding: Nathanson proves an analytic critical-point statement for the Werner-Holevo channel; private numerical evidence about relative maxima does not extend to arbitrary family parameters.
- Source: https://arxiv.org/abs/quant-ph/0611106

## Scope and cautions

- Interpretation: The source formula requires a trace-preserving normalization and rotating input support before this optimization problem is well posed.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
