# AI research brief: Does undistillability imply PPT?

- Record ID: krueger-2005-undistillability-implies-ppt
- Record revision (SHA-256): 86613e211818dd34dc368b509bfa38cfd37a3395d881f0039d4a3e16befd416e
- Formal statement digest (SHA-256): 3fc4dffa1562ff4d7f3c75ff6da78b1aff1ad1707f3c80923ce1f5c174aa70ae
- Status: Open
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-undistillability-implies-ppt/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-undistillability-implies-ppt.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Does+undistillability+imply+PPT%3F

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 15-17 (Problem 2)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The implication would make the partial-transpose test the exact criterion for whether bipartite entanglement can yield singlets. A counterexample would establish NPT bound entanglement.

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | A density operator on a bipartite Hilbert space $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho^{T_A}$ | Partial transpose of $\rho$ over Alice's subsystem, defined in a product basis by $\langle ij\vert\rho^{T_A}\vert kl\rangle = \langle kj\vert\rho\vert il\rangle$ |
| PPT | $\rho$ has positive partial transpose, i.e., $\rho^{T_A} \ge 0$ |
| NPT | $\rho$ has non-positive partial transpose, i.e., $\rho^{T_A}$ has at least one negative eigenvalue |
| $\rho^{\otimes n}$ | $n$-fold tensor power of $\rho$ |
| $P, Q$ | Two-dimensional projectors acting on $\mathcal{H}_A^{\otimes n}$ and $\mathcal{H}_B^{\otimes n}$, respectively |
| LOCC | Local operations and classical communication |
| $S$ | A completely positive map |
| $T$ | The transposition map |
| $\mathrm{id}_2$ | Identity map on $2\times 2$ matrices |
| $TS$ | Composition of transposition with $S$ |
| $n$-distillable | $\rho^{\otimes n}$ can be locally projected onto an entangled two-qubit subspace |
| distillable | $n$-distillable for some $n \ge 1$ |
| Werner state | Bipartite state invariant under $U \otimes U$ for all unitaries $U$ |

## Formal statement

Decide the following implication for bipartite density operators on a finite-dimensional Hilbert space:

$$\text{$\rho$ undistillable} \;\Longrightarrow\; \text{$\rho$ is PPT.}$$

Equivalently, decide whether there exists a bipartite state $\rho$ such that $\rho^{T_A}$ has a negative eigenvalue but $\rho$ is not distillable, i.e., there exist no integer $n$ and rank-2 projectors $P$ on $\mathcal{H}_A^{\otimes n}$ and $Q$ on $\mathcal{H}_B^{\otimes n}$ for which

$$\bigl((P \otimes Q)\,\rho^{\otimes n}\,(P \otimes Q)\bigr)^{T_A}$$

has a negative eigenvalue.

An equivalent operator-theoretic reformulation (Horodecki; restated in DiVincenzo–Shor–Smolin–Terhal–Thapliyal): given a completely positive map $S$ such that $TS$ is 2-positive (equivalently, $\mathrm{id}_2 \otimes TS$ is positive), decide whether $TS \otimes TS$ is necessarily 2-positive.

## Exact unresolved remainder

Prove that every NPT state is distillable, or construct an NPT state undistillable for all copy numbers.

## Checked progress

### 2026-08-09: Selected NPT candidates fail at two copies

- Evidence: Preprint; Exact restricted theorem
- Finding: An exact all-dimension theorem proves two-copy distillability for selected one-copy-undistillable candidates.
- Source: https://arxiv.org/abs/2608.08836

### 2026-07-27: Two-copy Werner distillability is completely classified

- Evidence: Preprint; Exact two-copy theorem
- Finding: Four concurrent proofs settle two copies in every dimension but do not control three or more copies.
- Source: https://arxiv.org/abs/2607.24479

## Scope and cautions

- Quantifier: One-copy, two-copy and restricted three-copy results do not settle undistillability for all tensor powers. (https://arxiv.org/abs/2608.08836)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
