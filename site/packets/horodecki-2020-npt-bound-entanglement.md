# AI research brief: NPT bound entanglement

- Record ID: horodecki-2020-npt-bound-entanglement
- Record revision (SHA-256): c03605e5446dc0ee317291e0bb84e97a95faa5d14da5e82685ca7bc3d953f0ed
- Formal statement digest (SHA-256): 5794ecb4f03e16ec60ebf8314d595902bd5bdce3ecbd4d0c9d7186bec31b51aa
- Status: Open
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Horodecki
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/horodecki-2020-npt-bound-entanglement/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/horodecki-2020-npt-bound-entanglement.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+NPT+bound+entanglement

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Five open problems in theory of quantum information
- Authors: Paweł Horodecki, Łukasz Rudnicki, Karol Życzkowski
- Venue: PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]
- Statement locator: p. 6-8 (Problem 4)
- Read source: https://doi.org/10.1103/PRXQuantum.3.010101

## Why it matters

The answer determines whether the PPT test marks the exact boundary between distillable and bound entanglement. It also controls tensor-stable positivity questions for quantum maps.

## Notation

| Symbol | Meaning |
|---|---|
| $d$ | Local Hilbert-space dimension of each subsystem |
| $\mathcal{H}_d$ | $d$-dimensional complex Hilbert space |
| $\mathcal{H}_d\otimes\mathcal{H}_d$ | Bipartite Hilbert space with two $d$-level parties |
| $\rho$ | Bipartite density operator (mixed quantum state) |
| $\rho_{ij,lm}=\langle ij\vert\rho\vert lm\rangle$ | Matrix elements of $\rho$ in the product computational basis |
| $\rho^\Gamma$ | Partial transpose of $\rho$: $\langle ij\vert\rho^\Gamma\vert lm\rangle=\langle im\vert\rho\vert lj\rangle$ |
| PPT | Positive partial transpose (all eigenvalues of $\rho^\Gamma$ are $\geq 0$) |
| NPT | Negative partial transpose (some eigenvalue of $\rho^\Gamma$ is $<0$) |
| $n$ | Number of independent copies of $\rho$ used in a distillation protocol |
| $P,Q$ | Rank-two local projectors acting on $(\mathcal{H}_d)^{\otimes n}$ |
| $\Lambda$ | A linear map $M_d(\mathbb{C})\to M_d(\mathbb{C})$ |
| $M_k(\mathbb{C})$ | Algebra of complex $k\times k$ matrices |
| $\mathbb{1}_k$ | Identity map on $M_k(\mathbb{C})$ |
| $T$ | Transposition map |
| $\Lambda^{\otimes n}$ | $n$-fold tensor power of $\Lambda$ |

## Formal statement

**Problem 4:** *Establish whether there exist bound entangled states with negative partial transpose.*

Setup: Fix $d>2$ and consider bipartite states on $\mathcal{H}_d\otimes\mathcal{H}_d$. A state $\rho$ is called $n$-copy distillable if there exist two-dimensional (i.e. rank two) projectors $P$ and $Q$ acting on $(\mathcal{H}_d)^{\otimes n}$ such that the matrix
$$(P\otimes Q)\,(\rho^\Gamma)^{\otimes n}\,(P\otimes Q)$$
has a negative eigenvalue. The state is distillable if it is $n$-copy distillable for some finite $n$. The problem asks: do there exist NPT states $\rho$ on $\mathcal{H}_d\otimes\mathcal{H}_d$ (some $d>2$) that are not distillable, i.e. for which no such $n$, $P$, $Q$ exist?

In the Choi-map formulation, if $S$ is the completely positive map associated with a state, $n$-copy nondistillability is equivalent to $S^{\otimes n}$ being 2-copositive, or $(T\circ S)^{\otimes n}$ being 2-positive. A related but logically distinct sufficient route is to construct a tensor-stable positive map that is neither completely positive nor completely copositive. These formulations should not be collapsed into one condition on an arbitrary positive map.

## Exact unresolved remainder

Construct an NPT state that is undistillable for all tensor powers, or prove that every NPT state is distillable.

## Checked progress

### 2026-08-09: A candidate family is two-copy distillable in every dimension

- Evidence: Preprint; Exact restricted theorem
- Finding: Tabia, Chen and Hsieh prove two-copy distillability for selected one-copy-undistillable NPT states in every local dimension at least three. This removes candidates rather than producing bound entanglement.
- Source: https://arxiv.org/abs/2608.08836

### 2026-07-27: The two-copy Werner threshold is exact

- Evidence: Preprint; Exact two-copy theorem
- Finding: Four concurrent preprints prove that a Werner state is two-copy distillable exactly when it is one-copy distillable. Three-copy and all-copy distillability remain unresolved.
- Source: https://arxiv.org/abs/2607.24479

## Scope and cautions

- Scope: Finite-copy theorems do not settle all-copy undistillability. The July and August 2026 manuscripts are recent preprints at the audit cutoff. (https://arxiv.org/abs/2608.08836)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
