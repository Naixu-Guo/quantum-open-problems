# AI research brief: Channel classes with multiplicativity at p = 2

- Record ID: ruskai-2007-multiplicativity-p2-channel-classes
- Record revision (SHA-256): d3ad4d71bbf8f031c2157cb57cedb3e99e1a4492475a1839b4a879e5e07aec90
- Formal statement digest (SHA-256): 50a635b5b3cefe16616539241d4f6b5a1ae3facaae125f4f2434590b9a5973b0
- Status: Partially solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-multiplicativity-p2-channel-classes/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-multiplicativity-p2-channel-classes.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Channel+classes+with+multiplicativity+at+p+%3D+2

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 13 (Problem 12)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

A structural classification would locate the boundary where tensor products preserve maximal output purity. That boundary organizes the positive cases left after general multiplicativity failed.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (quantum channels) |
| $\lVert M\rVert_p$ | Schatten $p$-norm, $\lVert M\rVert_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\sup_\gamma\lVert\Phi(\gamma)\rVert_p$ |
| WH channel | Werner–Holevo channel |
| Mutually unbiased bases (MUB) | Orthonormal bases $\{\lvert e_j^{(a)}\rangle\}$ such that $\lvert\langle e_j^{(a)}\vert e_k^{(b)}\rangle\rvert^2=1/d$ for $a\ne b$ |
| Depolarized channel | $\Phi_{x,\epsilon}=x\mathcal I+(1-x)\mathcal M_\epsilon$ for some $\mathcal M_\epsilon$ near a fully depolarizing map |

## Formal statement

**Problem 12.** For what classes of quantum channels $\Phi,\Omega$ can the multiplicativity identity
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
be proved at $p=2$?

## Exact unresolved remainder

Identify further positive classes or give an exhaustive structural characterization of channels satisfying multiplicativity at p equals two.

## Checked progress

### 2008: PPT-inducing channels form a broad positive class

- Evidence: Peer reviewed; Exact channel class
- Finding: Dierckx, Fannes and Vandenplas prove 2-norm multiplicativity when one tensor factor is PPT-inducing and the other is arbitrary.
- Source: https://arxiv.org/abs/0803.0479

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
