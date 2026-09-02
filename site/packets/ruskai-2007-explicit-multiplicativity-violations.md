# AI research brief: Explicit (non-existential) channels violating multiplicativity of maximal output p-norm for p not equal to 1

- Record ID: ruskai-2007-explicit-multiplicativity-violations
- Record revision (SHA-256): e87832e139fa141fcfcc73c0262a2b20b98c010f345a1eea3d501f6ac72fad6e
- Formal statement digest (SHA-256): 3437f29a2890847e19224110f3a282af2e1c2cedd4d5c795181e19bfae95bcbc
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-explicit-multiplicativity-violations/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-explicit-multiplicativity-violations.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Explicit+%28non-existential%29+channels+violating+multiplicativity+of+maximal+output+p-norm+for+p+not+equal+to+1

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 16 (Problem 20)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

The post-Werner-Holevo counterexamples of Winter and Hayden are existential random constructions that exhibit no concrete channel, whereas explicit channels are valuable for testing related conjectures, for numerical experimentation, for structural understanding of how entanglement boosts output purity, and for pedagogy.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi,\Omega$ | quantum channels (CPT maps) on matrix algebras |
| $\gamma$ | input density matrix, $\gamma\ge 0$, $\operatorname{Tr}\gamma=1$ |
| $\lVert X\rVert_p$ | Schatten $p$-norm, $\lVert X\rVert_p=(\operatorname{Tr}\lvert X\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | maximal output $p$-norm purity, $\nu_p(\Phi)=\sup_\gamma\lVert\Phi(\gamma)\rVert_p=\inf_\gamma$ form used in source after a sign-convention; here $\nu_p(\Phi):=\sup_\gamma\lVert\Phi(\gamma)\rVert_p$ for $p>1$ |
| $p$ | Renyi/Schatten parameter, $p\ne 1$ |
| eq. (24) | multiplicativity assertion $\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\nu_p(\Omega)$ |

(Note: Ruskai's text uses $\nu_p(\Phi)=\inf_\gamma\|\Phi(\gamma)\|_p$ as the convention; multiplicativity (24) is the analogous infimum-product statement, and "violation" means the equality fails. The substantive content of the problem is independent of the sup/inf convention.)

## Formal statement

**Problem 20 (Ruskai 2007).** Find *explicit* examples of quantum channels $\Phi,\Omega$ (with explicitly given Kraus operators, in concrete finite dimensions) which violate multiplicativity (24) of the maximal output $p$-norm for some specific $p\ne 1$:
$$\nu_p(\Phi\otimes\Omega) \;\ne\; \nu_p(\Phi)\,\nu_p(\Omega).$$
The desired examples should not be mere instances of the existence theorems of Winter and Hayden, but channels whose Kraus operators (or Stinespring isometry) can be written down concretely so that the violation can be verified directly.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2008: Werner-Holevo channel is an explicit multiplicativity counterexample

- Evidence: Peer reviewed; Explicit construction
- Finding: The Werner-Holevo channel is an explicitly given qutrit channel that violates multiplicativity of the maximal output p-norm for p above 4.79, which already meets the archived request for a concrete example at some p different from 1. Cubitt, Harrow, Leung, Montanaro and Winter later gave an explicit 4-to-3 channel pair with nonmultiplicative minimum output rank at p = 0.
- Source: https://arxiv.org/abs/0712.3628

### 2002: Werner-Holevo channel is an explicit multiplicativity counterexample

- Evidence: Peer reviewed; Explicit construction
- Finding: The Werner-Holevo channel is an explicitly given qutrit channel that violates multiplicativity of the maximal output p-norm for p above 4.79, which already meets the archived request for a concrete example at some p different from 1. Cubitt, Harrow, Leung, Montanaro and Winter later gave an explicit 4-to-3 channel pair with nonmultiplicative minimum output rank at p = 0.

## Scope and cautions

- Scope: For p just above 1 and for 0 < p < 1 no truly small-dimension explicit channel is known; a 2025/2026 preprint by Derksen and Lovitz (arXiv:2510.07547) gives constructive examples for every p > 1 including the difficult interval near one, which strengthens but is not needed for the existential statement.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
