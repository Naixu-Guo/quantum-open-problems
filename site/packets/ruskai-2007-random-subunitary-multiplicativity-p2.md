# AI research brief: Random sub-unitary multiplicativity at p = 2

- Record ID: ruskai-2007-random-subunitary-multiplicativity-p2
- Record revision (SHA-256): 9aef639cd5dbc39993f49a27ffe4fd45ea9dfcde6407a496f2371107d0c81d5d
- Formal statement digest (SHA-256): 2f2c6f68e3f5dad0373ea47278680d5f33a589b70ce8bf84b887f6f397727ac5
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-random-subunitary-multiplicativity-p2/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-random-subunitary-multiplicativity-p2.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Random+sub-unitary+multiplicativity+at+p+%3D+2

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 14 (Problem 15)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

At p = 2 the output norm measures purity and often permits matrix methods unavailable at other p. This subclass can reveal which Kraus structures preserve purity under tensor products.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (quantum channels) |
| $\{A_k\}$ | Kraus operators of a channel, $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$, $\sum_k A_k^{\dagger}A_k=I$ |
| $X$ | Cyclic shift operator on $\mathbb{C}^d$, $X\lvert e_j\rangle=\lvert e_{j+1}\rangle$ |
| $U_k$ | A $(d-1)\times(d-1)$ unitary in the $k$-th Kraus operator |
| $\|M\|_p$ | Schatten $p$-norm, $(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\sup_\gamma\|\Phi(\gamma)\|_p$ |
| WH channel | Werner–Holevo channel |
| $\mathcal E(d,d)$, $\overline{\mathcal E}(d,d)$ | Set of extreme CPT maps with $d$ Kraus operators on $M_d$ and its closure |

## Formal statement

Interpreting equation (22) as the intended normalized cyclic random-sub-unitary construction, let $\Phi:M_d\to M_d$ belong to that CPT family. The source prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb C^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary, but this formula is not CPT as written.

**Problem 15.** Prove the multiplicativity conjecture (24),
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega),$$
for such channels $\Phi$ (tensored with arbitrary CPT $\Omega$) at least in the case $p=2$. If this is not possible, exhibit a member of the family (22) that provides an additional counterexample to (24).

## Exact unresolved remainder

Prove maximal-output 2-norm multiplicativity for every channel in the corrected family, or exhibit a family-specific counterexample.

## Checked progress

### 2007: The closest positive theorem concerns another family

- Evidence: Peer reviewed; Different structured class
- Finding: Michalakis proves the p equals two case for identical polarized Werner-Holevo channels, not for arbitrary random sub-unitary channels.
- Source: https://arxiv.org/abs/0707.1722

## Scope and cautions

- Interpretation: The archived Kraus formula is malformed. This entry tracks the intended normalized cyclic family rather than the literal non-channel formula.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
