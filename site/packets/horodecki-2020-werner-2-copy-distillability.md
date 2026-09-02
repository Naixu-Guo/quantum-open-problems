# AI research brief: Show that the Werner state rho(4, -1/2) of two ququarts is not 2-copy distillable

- Record ID: horodecki-2020-werner-2-copy-distillability
- Record revision (SHA-256): 9e98dfe6d30bee90d0fc5909a01006b3e5d7ac51a0cf7764fe07a0f30c2ce046
- Formal statement digest (SHA-256): f466f1f207bdfa402f1fe569a5ff0c27f241e042c97bbfceae4b95f9e2c9a503
- Status: Solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Horodecki
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/horodecki-2020-werner-2-copy-distillability/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/horodecki-2020-werner-2-copy-distillability.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Show+that+the+Werner+state+rho%284%2C+-1%2F2%29+of+two+ququarts+is+not+2-copy+distillable

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Five open problems in theory of quantum information
- Authors: Paweł Horodecki, Łukasz Rudnicki, Karol Życzkowski
- Venue: PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]
- Statement locator: p. 8-9 (Problem 5)
- Read source: https://doi.org/10.1103/PRXQuantum.3.010101

## Why it matters

The state sits exactly on the boundary between 1-copy distillable and 1-copy non-distillable Werner states, and its partial transpose is uniquely proportional to a dichotomic unitary, a property preserved under tensor products, which makes it the most tractable concrete step toward proving the existence of NPT bound entanglement.

## Notation

| Symbol | Meaning |
|---|---|
| $d$ | Local Hilbert-space dimension; in this problem $d=4$ |
| $\mathcal{H}_d$ | $d$-dimensional complex Hilbert space |
| $\mathcal{H}_d\otimes\mathcal{H}_d$ | Bipartite Hilbert space with two $d$-level parties |
| $\mathbb{1}$ | Identity operator on $\mathcal{H}_d\otimes\mathcal{H}_d$ |
| $V$ | Swap operator on $\mathcal{H}_d\otimes\mathcal{H}_d$, $\langle ij\vert V\vert kl\rangle=\delta_{il}\delta_{jk}$ |
| $\delta_{ij}$ | Kronecker delta |
| $\alpha$ | Real parameter, $\alpha\in[-1,1]$ |
| $\rho(d,\alpha)$ | One-parameter family of Werner states |
| $\rho^\Gamma$ | Partial transpose of $\rho$ |
| $n$ | Number of copies used in a distillation protocol |
| $P,Q$ | Rank-two projectors acting on $(\mathcal{H}_d)^{\otimes n}$ |
| $U$ | Unitary on $\mathcal{H}_d$ |
| $I$ | $d\times d$ identity matrix |
| $\lvert\psi_+\rangle$ | Maximally entangled state $\frac{1}{\sqrt{d}}\sum_{j=1}^d \lvert j\rangle\otimes\lvert j\rangle$ |
| $A,B$ | Traceless complex $4\times 4$ matrices normalized by $\mathrm{Tr}(A^\dagger A)+\mathrm{Tr}(B^\dagger B)=1/4$ |
| $A\oplus B$ | Kronecker sum $A\otimes\mathbb{1}+\mathbb{1}\otimes B$ |
| $B_1,B_2,B_\infty$ | Boundaries of the sets of $1$-copy, $2$-copy, and $n$-copy ($\forall n$) non-distillable Werner states |

## Formal statement

**Problem 5:** *Show that the Werner state $\rho(4,-1/2)$ of two ququarts, $d=4$, defined in Eq. (5) below, is not 2-copy distillable.*

Setup: Consider the family of Werner states on $\mathcal{H}_d\otimes\mathcal{H}_d$
$$\rho(d,\alpha) = \frac{\mathbb{1}\otimes\mathbb{1}+\alpha V}{d^2+\alpha d}, \qquad \alpha\in[-1,1],$$
where $V$ is the swap operator, $\langle ij|V|kl\rangle=\delta_{il}\delta_{jk}$. The state $\rho(d,\alpha)$ is NPT for $\alpha\in[-1,-1/d)$ and PPT (hence non-distillable) for $\alpha\in[-1/d,1]$. The distinguished state $\rho(4,-1/2)$ is the unique Werner state whose partial transpose is proportional to the dichotomic unitary $U=I-2\lvert\psi_+\rangle\langle\psi_+\rvert$ (which has eigenvalues $\pm 1$); it sits on the boundary between $1$-copy distillability and $1$-copy non-distillability of Werner states in $d=4$. The problem asks for a proof that no $2$-copy distillation protocol succeeds on $\rho(4,-1/2)$: there exist no rank-two projectors $P,Q$ on $\mathcal{H}_4\otimes\mathcal{H}_4$ such that
$$(P\otimes Q)\bigl(\rho(4,-1/2)^\Gamma\bigr)^{\otimes 2}(P\otimes Q)$$
has a negative eigenvalue.

Equivalent algebraic form (Pankowski, Piani, Horodecki, Horodecki): show that the sum of squares of the two largest singular values of the Kronecker sum $A\oplus B=A\otimes\mathbb{1}+\mathbb{1}\otimes B$ is bounded by $1/2$ for any pair of traceless $4\times 4$ matrices $A,B$ normalized by $\mathrm{Tr}(A^\dagger A)+\mathrm{Tr}(B^\dagger B)=1/4$.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2026: Werner states are 2-copy distillable only if 1-copy distillable

- Evidence: Preprint; Exact theorem
- Finding: Fu, Gao and Park prove that a Werner state in any local dimension is 2-copy distillable if and only if it is already 1-copy distillable, which in the archived parametrisation gives 2-copy non-distillability exactly for alpha at least -1/2 and therefore includes rho(4,-1/2). Song and Chen, Fraser, Huber, Pozsgay and Vona, and Bharti, Gajjala and Haug posted concurrent independent proofs of the same sharp two-copy threshold, so the archived statement is affirmed.
- Source: https://arxiv.org/abs/2607.21367

### 2026: Werner states are 2-copy distillable only if 1-copy distillable

- Evidence: Preprint; Exact theorem
- Finding: Fu, Gao and Park prove that a Werner state in any local dimension is 2-copy distillable if and only if it is already 1-copy distillable, which in the archived parametrisation gives 2-copy non-distillability exactly for alpha at least -1/2 and therefore includes rho(4,-1/2). Song and Chen, Fraser, Huber, Pozsgay and Vona, and Bharti, Gajjala and Haug posted concurrent independent proofs of the same sharp two-copy threshold, so the archived statement is affirmed.
- Source: https://arxiv.org/abs/2607.23416

### 2026: Werner states are 2-copy distillable only if 1-copy distillable

- Evidence: Preprint; Exact theorem
- Finding: Fu, Gao and Park prove that a Werner state in any local dimension is 2-copy distillable if and only if it is already 1-copy distillable, which in the archived parametrisation gives 2-copy non-distillability exactly for alpha at least -1/2 and therefore includes rho(4,-1/2). Song and Chen, Fraser, Huber, Pozsgay and Vona, and Bharti, Gajjala and Haug posted concurrent independent proofs of the same sharp two-copy threshold, so the archived statement is affirmed.
- Source: https://arxiv.org/abs/2607.24309

## Scope and cautions

- Scope: These papers settle two-copy distillability for Werner states; they do not prove non-distillability for every number of copies and do not resolve whether NPT bound-entangled states exist.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
