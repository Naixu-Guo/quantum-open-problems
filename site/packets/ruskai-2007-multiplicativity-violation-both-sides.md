# AI research brief: Channel or pair of channels violating p-norm multiplicativity for both some p>1 and some 0<p<1

- Record ID: ruskai-2007-multiplicativity-violation-both-sides
- Record revision (SHA-256): 9499c3d8e4e8cdd8669f2436a085eb8090679308e3e4c0940af469c8b3089ae5
- Formal statement digest (SHA-256): 732d4ca8bf0381b1a629f58bfd823196675ad0d76338f2bce427139b08b54dd4
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-multiplicativity-violation-both-sides/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-multiplicativity-violation-both-sides.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Channel+or+pair+of+channels+violating+p-norm+multiplicativity+for+both+some+p%3E1+and+some+0%3Cp%3C1

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 15 (Problem 18)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

All known constructions were non-uniform in p, with the dimension blowing up as p approaches 1 and structurally different Kraus operators above and below one, and a negative answer would have forced a one-sided approach to p = 1 and reopened a route to the additivity conjecture there.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi,\Omega$ | completely positive trace-preserving (CPT) maps (quantum channels) |
| $\Phi^{\otimes n}$ | $n$-fold tensor product channel |
| $\gamma$ | input density matrix (state), $\gamma\ge 0$, $\operatorname{Tr}\gamma=1$ |
| $\|X\|_p$ | Schatten $p$-norm, $\|X\|_p=(\operatorname{Tr}\lvert X\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | maximal output $p$-norm in the conventional formulation, $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$ |
| $S^p(\gamma)$ | Standard Rényi $p$-entropy, $S^p(\gamma)=\tfrac{1}{1-p}\log\operatorname{Tr}\gamma^p$ for $p\ne 1$; $S^0(\gamma)=\log\operatorname{rank}\gamma$; $S^1(\gamma)$ is the von Neumann entropy |
| $S^p_{\min}(\Phi)$ | minimal output Renyi entropy, $S^p_{\min}(\Phi)=\inf_\gamma S^p[\Phi(\gamma)]$ |
| $p_1,p_2$ | two values of the Renyi/Schatten parameter, with $p_1>1$ and $0<p_2<1$ |
| eq. (26) | the multiplicativity/additivity assertion $S^p_{\min}(\Phi\otimes\Omega)=S^p_{\min}(\Phi)+S^p_{\min}(\Omega)$ |

## Formal statement

**Problem 18 (Ruskai 2007).** Does there exist a quantum channel $\Phi$, or a pair of channels $(\Phi,\Omega)$ on finite-dimensional matrix algebras, and values $p_1>1$ and $p_2$ with $0<p_2<1$, such that the multiplicativity equality
$$S^p_{\min}(\Phi\otimes\Omega) \;=\; S^p_{\min}(\Phi)+S^p_{\min}(\Omega) \tag{26}$$
**fails** at both $p=p_1$ and $p=p_2$? Equivalently, is there a single example that violates (26) simultaneously for some $p>1$ and some $p<1$?

If the answer is negative, then for every channel (pair) one can always approach $p=1$ from at least one side along which (26) does hold, which would force additivity at $p=1$.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2026: Hastings gap plus continuity in p gives a two-sided violation

- Evidence: Preprint; Exact theorem
- Finding: Hastings produced a fixed finite-dimensional channel pair with a strict additivity gap at p = 1, and for fixed finite-dimensional channels the minimum output Renyi entropy is continuous in p at 1 because the state Renyi entropy is jointly continuous in state and order and the input-state set is compact. The strict gap therefore persists on an interval around one, and choosing one order on each side of one gives the single pair requested; Leung, Lovitz and Wu independently make this implication explicit and prove nonadditivity for every p > 3/4.
- Source: https://arxiv.org/abs/2607.15210

### 2009: Hastings gap plus continuity in p gives a two-sided violation

- Evidence: Peer reviewed; Exact counterexample
- Finding: Hastings produced a fixed finite-dimensional channel pair with a strict additivity gap at p = 1, and for fixed finite-dimensional channels the minimum output Renyi entropy is continuous in p at 1 because the state Renyi entropy is jointly continuous in state and order and the input-state set is compact. The strict gap therefore persists on an interval around one, and choosing one order on each side of one gives the single pair requested; Leung, Lovitz and Wu independently make this implication explicit and prove nonadditivity for every p > 3/4.
- Source: https://arxiv.org/abs/0809.3972

## Scope and cautions

- Scope: The solved label follows the source's explicit equation (26) for minimum output standard Renyi entropy; the continuity argument does not answer the different question of conventional maximal-output p-quasinorm multiplicativity for p < 1.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
