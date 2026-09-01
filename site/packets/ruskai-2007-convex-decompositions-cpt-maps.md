# AI research brief: Audenaert-Ruskai decompositions of CPT maps

- Record ID: ruskai-2007-convex-decompositions-cpt-maps
- Record revision (SHA-256): cb12c3dde9eb01909360e16953de105d85e10b1bedc831178679b49511ddcaaf
- Formal statement digest (SHA-256): b90fc2a4038554c27b5437e4e3b5e0d01caf97e48c8f6caa5a43daea0897ec00
- Status: Partially solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-convex-decompositions-cpt-maps/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-convex-decompositions-cpt-maps.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Audenaert-Ruskai+decompositions+of+CPT+maps

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 4-6 (Conjectures 2-5)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

The conjecture is a channel analogue of decomposing a matrix into controlled low-rank pieces. A proof would reduce arbitrary channels to equal mixtures of low-Choi-rank maps and sharpen the convex geometry of quantum operations.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d \times d$ complex matrices |
| $\Phi : M_{d_1} \mapsto M_{d_2}$ | a CPT (completely positive, trace-preserving) quantum channel |
| CPT | completely positive and trace preserving |
| $A_k$ | a Kraus operator for $\Phi$ |
| Choi rank of $\Phi$ | rank of the Choi state $\Phi(\lvert\beta\rangle\langle\beta\rvert)$ |
| $\Phi_m$ | the $m$-th CPT (or unital CP) summand in a convex decomposition |
| $\overline{\mathcal{E}(d_1,d_2)}$ | closure of extreme CPT maps $M_{d_1}\mapsto M_{d_2}$ |
| $\Phi^*$ (adjoint) | unital CP map adjoint of $\Phi$ in the Hilbert–Schmidt inner product |
| $\mathbf{A}$ | a $d_1d_2 \times d_1d_2$ positive semi-definite matrix viewed as a $d_2 \times d_2$ block matrix |
| $A_{jk}$ | the $d_1 \times d_1$ block in position $(j,k)$ of $\mathbf{A}$ |
| $\sum_j A_{jj} = M$ | the partial trace / sum of diagonal blocks |
| $\mathbf{B}_m$ | a $d_1d_2 \times d_1d_2$ block matrix summand, each of rank at most $d_1$ |
| $\mathbf{X}_m$ | a "tall" $d_1d_2 \times d_1$ matrix composed of $d_2$ blocks $X_{jm}$ of size $d_1 \times d_1$ |
| $X_{jm}$ | the $j$-th $d_1 \times d_1$ block of $\mathbf{X}_m$ |
| $\lambda_k,\,a_{kk}$ | eigenvalues and diagonal entries of a Hermitian matrix (in Horn's lemma) |
| $\lvert\beta\rangle$ | the maximally entangled Bell state on $\mathbb{C}^{d_1}\otimes\mathbb{C}^{d_1}$ |

## Formal statement

The source states four closely related formulations. Its printed Conjecture 2 uses a Choi-rank bound $d_2$, but that conflicts with Choi's generalized-extreme bound, its own later formulations, and the modern RA statement. The corrected rank bound is $d_1$.

**Conjecture 2 (Audenaert–Ruskai, corrected rank).** *Let $\Phi : M_{d_1}\mapsto M_{d_2}$ be a CPT map. There exist $d_2$ CPT maps $\Phi_m$ each with Choi rank at most $d_1$ such that*
$$\Phi \;=\; \sum_{m=1}^{d_2} \tfrac{1}{d_2}\,\Phi_m.$$

**Conjecture 3 (adjoint/unital form).** *Let $\Phi : M_{d_2}\mapsto M_{d_1}$ be a CP map with $\Phi(I_2) = I_1$ (unital). There exist $d_2$ unital CP maps $\Phi_m$ each with Choi rank at most $d_1$ such that*
$$\Phi \;=\; \sum_{m=1}^{d_2} \tfrac{1}{d_2}\,\Phi_m.$$

**Conjecture 4 (block-matrix form, generalizing Horn's lemma).** *Let $\mathbf{A}$ be a $d_1 d_2 \times d_1 d_2$ positive semi-definite matrix viewed as a $d_2 \times d_2$ array of $d_1 \times d_1$ blocks $A_{jk}$ with $\sum_j A_{jj} = M$. Then there exist $d_2$ block matrices $\mathbf{B}_m$, each of rank at most $d_1$, such that $\sum_j (\mathbf{B}_m)_{jj} = M$ for all $m$ and*
$$\mathbf{A} \;=\; \sum_{m=1}^{d_2} \tfrac{1}{d_2}\,\mathbf{B}_m.$$

**Conjecture 5 (vectorized block form).** *Let $\mathbf{A}$ be as in Conjecture 4. There exist $d_2$ vectors $\mathbf{X}_m$, each composed of $d_2$ blocks $X_{jm}$ of size $d_1 \times d_1$, such that*
$$\mathbf{A} \;=\; \sum_{m=1}^{d_2} \tfrac{1}{d_2}\,\mathbf{X}_m \mathbf{X}_m^\dagger, \qquad \sum_{k} X_{km} X_{km}^\dagger \;=\; M \quad \forall\,m.$$

**Logical relations.** The source gives Conjecture 4 $\Rightarrow$ Conjecture 3 $\Rightarrow$ Conjecture 2 and treats Conjectures 4 and 5 as equivalent through factorization of the positive summands. These relations do not by themselves make all four statements equivalent.

## Exact unresolved remainder

Prove or refute the strong decomposition conjecture for arbitrary input and output dimensions.

## Checked progress

### 2026-07-25: Large channel classes satisfy the conjectured decomposition

- Evidence: Preprint; Exact major subclasses
- Finding: Kumar and Wolf prove the strong form for qubit input, cq and qc channels, and a nonzero-measure set in every dimension; the general case remains open.
- Source: https://arxiv.org/abs/2607.23066

## Scope and cautions

- Very recent: This substantial advance was an unrefereed first-version preprint at the audit cutoff and does not prove the arbitrary-dimensional conjecture. (https://arxiv.org/abs/2607.23066)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
