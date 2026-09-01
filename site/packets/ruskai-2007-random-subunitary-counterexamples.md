# AI research brief: Counterexamples among random sub-unitary channels

- Record ID: ruskai-2007-random-subunitary-counterexamples
- Record revision (SHA-256): 84c6e073c14bbd011aa4dfc8d628441965d941f1eb5ae728ad3d5b772e99e2b3
- Formal statement digest (SHA-256): 4245d41e5a1e616b64424dff8a6713fe979274babb36bfb1e479d0817d04d851
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-random-subunitary-counterexamples/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-random-subunitary-counterexamples.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Counterexamples+among+random+sub-unitary+channels

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 10 (Problem 9)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

The problem tests whether the rigid cyclic Kraus structure can support the multiplicativity violations known for less structured random channels.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | Completely positive trace-preserving (CPT) linear maps |
| $\{A_k\}$ | Kraus operators of a channel, $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$, $\sum_k A_k^{\dagger}A_k=I$ |
| $X$ | Cyclic shift operator on $\mathbb{C}^d$, $X\lvert e_j\rangle=\lvert e_{j+1}\rangle$ |
| $U_k$ | A $(d-1)\times(d-1)$ unitary in the $k$-th Kraus operator |
| $\|M\|_p$ | Schatten $p$-norm, $\|M\|_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\nu_p(\Phi)=\inf_\gamma\|\Phi(\gamma)\|_p$ in source notation (which uses $\inf$ throughout; the maximum is attained on pure inputs) |
| WH channel | Werner–Holevo channel |
| $\mathcal E(d,d)$, $\overline{\mathcal E}(d,d)$ | Set of extreme CPT maps with $d$ Kraus operators on $M_d$, and its closure |

## Formal statement

Interpreting equation (22) as the intended normalized cyclic random-sub-unitary construction, let $\Phi:M_d\to M_d$ belong to that CPT family. The source prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb{C}^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary, but this formula is not CPT as written.

**Problem 9.** Search for new counterexamples to the multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
with $\Phi$ a channel having Kraus operators of the form (22). In particular, exhibit (or rule out) channels $\Phi$ of this family and entangled inputs for which $\nu_p(\Phi\otimes\Phi)>\nu_p(\Phi)^2$.

## Exact unresolved remainder

Construct a multiplicativity counterexample in the corrected random sub-unitary class, or prove a positive theorem excluding one in a stated p-range.

## Checked progress

### 2009: Unrestricted random channels violate entropy additivity

- Evidence: Peer reviewed; General counterexample
- Finding: Hastings settles the general conjecture negatively, but his construction is not a family-specific solution to this structured search.
- Source: https://arxiv.org/abs/0809.3972

## Scope and cautions

- Interpretation: The source's displayed Kraus operators do not define a trace-preserving map as printed; the status concerns the intended corrected family.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
