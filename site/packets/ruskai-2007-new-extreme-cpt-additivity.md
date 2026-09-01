# AI research brief: New extreme CPT classes with additivity

- Record ID: ruskai-2007-new-extreme-cpt-additivity
- Record revision (SHA-256): e9e8ae271cdc8ddea7e1754a5e2c8dc711d39160ab2d2cff5c57e5e336990311
- Formal statement digest (SHA-256): 5cc2366d7e1f808e6985d9b7c3b0f1040fa7e22fdc333a77d88ad66f56407048
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-new-extreme-cpt-additivity/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-new-extreme-cpt-additivity.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+New+extreme+CPT+classes+with+additivity

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 14 (Problem 14)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Since universal additivity is false, structured channel families with exact tensor-product laws define the remaining positive theory. Extreme channels are the sharpest place to search for such laws.

## Notation

| Symbol | Meaning |
|---|---|
| $M_{d_A}, M_{d_B}, M_{d_E}$ | Algebras of complex matrices of the indicated dimensions, representing input, output, and environment spaces |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi:M_{d_A}\to M_{d_B}$ | CPT (completely positive trace-preserving) linear map |
| $\Phi^C:M_{d_A}\to M_{d_E}$ | A complementary channel of $\Phi$ |
| Choi rank | Minimum number of Kraus operators in a Kraus representation of a channel |
| Extreme CPT map | An extreme point of the convex set of CPT maps with fixed input/output dimensions |
| $\mathcal E(d_1,d_2)$, $\overline{\mathcal E}(d_1,d_2)$ | Set of generalized extreme CPT maps $M_{d_1}\to M_{d_2}$ with at most $d_2$ Kraus operators and its closure |
| $\|M\|_p$ | Schatten $p$-norm, $(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\sup_\gamma\|\Phi(\gamma)\|_p$ |
| $S_{\min}(\Phi)$ | Minimum output entropy, $\inf_\gamma S(\Phi(\gamma))$ |

## Formal statement

**Problem 14.** Identify new classes of extreme CPT maps $\Phi:M_{d_A}\to M_{d_B}$ for which one can prove the additivity conjecture
$$S_{\min}(\Phi\otimes\Omega)=S_{\min}(\Phi)+S_{\min}(\Omega) \tag{23}$$
and/or the multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for the appropriate range of $p$, when tensored with an arbitrary CPT $\Omega$.

## Exact unresolved remainder

Find a genuinely new class of extreme CPT maps for which minimum-output-entropy additivity or output-norm multiplicativity can be proved.

## Checked progress

### 2021: New extreme channel families do not supply the requested theorem

- Evidence: Peer reviewed; Related structural progress
- Finding: Haagerup, Musat and Ruskai develop relevant extreme maps, but this does not yield a new positive additivity class answering the program.
- Source: https://arxiv.org/abs/2006.03414

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
