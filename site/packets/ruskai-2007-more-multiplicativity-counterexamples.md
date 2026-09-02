# AI research brief: Find more counterexamples to multiplicativity (eq. 24); do they support holding for 1 <= p <= 2?

- Record ID: ruskai-2007-more-multiplicativity-counterexamples
- Record revision (SHA-256): e94fd7d5e602999f3d5e829d724754f94f3a9ec4a0b3ddfe1014d6a75bc0058d
- Formal statement digest (SHA-256): 40cc7f85f89b0ccf642ec9a32497046c5e8cc605f85411813783e4c6c018f32e
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-more-multiplicativity-counterexamples/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-more-multiplicativity-counterexamples.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Find+more+counterexamples+to+multiplicativity+%28eq.+24%29%3B+do+they+support+holding+for+1+%3C%3D+p+%3C%3D+2%3F

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 12 (Problem 11)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Before summer 2007 the Werner-Holevo channel and mildly perturbed variants were the only known counterexamples, several authors had conjectured a safe range 1 <= p <= 2, and the p to 1 limit of the conjecture is the additivity statement Shor showed equivalent to additivity of the Holevo capacity and of the entanglement of formation.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (quantum channels) |
| $\lVert M\rVert_p$ | Schatten $p$-norm, $\lVert M\rVert_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\nu_p(\Phi)=\inf_\gamma\lVert\Phi(\gamma)\rVert_p$ in source notation (sup over inputs of the output $p$-norm) |
| $S(\rho)$ | von Neumann entropy, $-\operatorname{Tr}(\rho\log\rho)$ |
| $S_{\min}(\Phi)$ | Minimum output entropy, $\inf_\gamma S(\Phi(\gamma))$ |
| $S^p(\gamma)$ | Rényi entropy, $S^p(\gamma)\equiv\tfrac{1}{p-1}\log\operatorname{Tr}\gamma^p$ |
| $S^p_{\min}(\Phi)$ | $\inf_\gamma S^p(\Phi(\gamma))$ |
| WH channel | Werner–Holevo channel |
| $p_c$ | Hypothesized critical $p$ at which multiplicativity might fail |

## Formal statement

**Problem 11.** Find additional counterexamples — beyond the Werner–Holevo channel and its small perturbations — to the multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega), \tag{24}$$
holding for a range of $p>1$. Determine, on the basis of such counterexamples, whether the conjecture is true for $1\le p\le 2$.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2007: Winter and Hayden refute multiplicativity for every p above 1

- Evidence: Preprint; Exact counterexample
- Finding: Winter constructs counterexamples to multiplicativity for every p above 2 using random unitary channels of growing dimension, and Hayden extends the counterexamples to all 1 < p < 2, with Winter subsequently closing the case p = 2. Together they supply the requested counterexamples beyond the Werner-Holevo family and show that multiplicativity fails throughout the conjectured safe range 1 < p <= 2.
- Source: https://arxiv.org/abs/0707.0402

### 2007: Winter and Hayden refute multiplicativity for every p above 1

- Evidence: Preprint; Exact counterexample
- Finding: Winter constructs counterexamples to multiplicativity for every p above 2 using random unitary channels of growing dimension, and Hayden extends the counterexamples to all 1 < p < 2, with Winter subsequently closing the case p = 2. Together they supply the requested counterexamples beyond the Werner-Holevo family and show that multiplicativity fails throughout the conjectured safe range 1 < p <= 2.
- Source: https://arxiv.org/abs/0707.3291

## Scope and cautions

- Scope: The separate additivity conjecture at p = 1 was refuted later by Hastings (Nature Physics 5, 255 (2009)); that is a distinct statement from p-norm multiplicativity for p > 1.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
