# AI research brief: Extreme CPT maps beyond qubit input

- Record ID: ruskai-2007-extreme-points-cpt-maps
- Record revision (SHA-256): 8c4f692e848f41fb7a40837a88893845fecbaab2618bbf546941d5f195b3be9c
- Formal statement digest (SHA-256): 1872dce6f4408d25266be8b259803852dd6154fb77e7a09f4878b04cd55c78bb
- Status: Partially solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-extreme-points-cpt-maps/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-extreme-points-cpt-maps.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Extreme+CPT+maps+beyond+qubit+input

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 3 (Problem 1)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Extreme channels are the irreducible building blocks of the convex set of quantum operations. A canonical parameterization would support channel optimization without redundant mixtures.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d \times d$ complex matrices |
| $\Phi : M_{d_1} \mapsto M_{d_2}$ | a linear map between matrix algebras representing a quantum channel |
| CPT | completely positive and trace preserving |
| $A_k$ | a Kraus (operator-sum) operator for $\Phi$ |
| $A_k^\dagger$ | Hermitian (conjugate-transpose) of $A_k$ |
| $I_{d_1}$ | identity operator on $\mathbb{C}^{d_1}$ |
| $\rho$ | a density matrix (positive, trace-one) input to $\Phi$ |
| $\lvert\beta\rangle$ | the maximally entangled "Bell" state in $\mathbb{C}^{d_1} \otimes \mathbb{C}^{d_1}$ |
| $\Phi(\lvert\beta\rangle\langle\beta\rvert)$ | the Choi (state) matrix of $\Phi$ (acting on one half of $\lvert\beta\rangle\langle\beta\rvert$) |
| Choi rank | rank of the Choi matrix, equivalently the minimum number of nonzero Kraus operators |
| $\mathcal{E}(d_1,d_2)$ | the set of extreme points of the convex set of CPT maps $M_{d_1} \mapsto M_{d_2}$ |
| $\overline{\mathcal{E}(d_1,d_2)}$ | the topological closure of $\mathcal{E}(d_1,d_2)$ |
| $\alpha_j,\,\lvert u_j\rangle,\,\lvert v_j\rangle,\,\lvert w_j\rangle$ | parameters/vectors in the $d_1=2$ SVD parameterization (3) |

## Formal statement

**Problem 1 (Ruskai, 2007).** *Characterize, classify and/or parameterize the closure $\overline{\mathcal{E}(d_1,d_2)}$ of the set of extreme points of CPT maps $\Phi : M_{d_1} \mapsto M_{d_2}$ for $d_1 > 2$ and $d_2$ arbitrary.*

By Theorem 1 of the source, $\overline{\mathcal{E}(d_1,d_2)}$ is precisely the set of CPT maps $\Phi$ whose Choi rank is at most $d_1$; equivalently, those $\Phi$ that admit a Choi–Kraus representation with at most $d_1$ nonzero operators $A_k$ satisfying $\sum_k A_k^\dagger A_k = I_{d_1}$. The goal is to exhibit a useful and explicit parameterization of this set, generalizing the qubit ($d_1 = 2$) SVD form above.

## Exact unresolved remainder

Give a useful complete classification or canonical parameterization of the closure of extreme CPT maps for arbitrary input dimension above two.

## Checked progress

### 2018: Fixed-rank channels receive a quotient-manifold parameterization

- Evidence: Peer reviewed; General parameterization
- Finding: Iten and Colbeck describe fixed-Kraus-rank channel sets as Stiefel quotients and identify smooth submanifolds of extreme channels.
- Source: https://arxiv.org/abs/1610.02513

### 2014: Important low-dimensional extreme maps are classified

- Evidence: Peer reviewed; Exact low-dimensional classes
- Finding: Friedland and Loewy settle qubit-to-qubit and qutrit-to-qubit cases and derive broader generic conditions.
- Source: https://arxiv.org/abs/1309.5898

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
