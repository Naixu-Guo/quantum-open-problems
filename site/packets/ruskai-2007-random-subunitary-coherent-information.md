# AI research brief: Coherent information of random sub-unitary channels

- Record ID: ruskai-2007-random-subunitary-coherent-information
- Record revision (SHA-256): d5b77f20bc8a851393f9a0f93e18e2ad8394154a6948c65cd83823649afceefa
- Formal statement digest (SHA-256): 73253408e993cc6236ee823b286bc1483b4579d5a18881f37957faa4e3e51727
- Status: Open
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/ruskai-2007-random-subunitary-coherent-information/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/ruskai-2007-random-subunitary-coherent-information.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Coherent+information+of+random+sub-unitary+channels

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 10 (Problem 10)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

The cyclic low-rank Kraus structure offers a controlled testbed for degradability and superadditive coherent information. A solution would give exact capacities for a nontrivial noisy-channel family.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$ | A density matrix (positive semi-definite, trace $1$) |
| $\Phi$ | A completely positive trace-preserving (CPT) linear map (quantum channel) |
| $\Phi^C$ | A complementary channel of $\Phi$ |
| $\{A_k\}$ | Kraus operators of a channel, $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$ |
| $X$ | Cyclic shift operator on $\mathbb{C}^d$, $X\lvert e_j\rangle=\lvert e_{j+1}\rangle$ |
| $U_k$ | A $(d-1)\times(d-1)$ unitary appearing in the $k$-th Kraus operator |
| $S(\sigma)$ | von Neumann entropy, $S(\sigma)=-\operatorname{Tr}(\sigma\log\sigma)$ |
| $I_c(\rho,\Phi)$ | Coherent information of $\rho$ through $\Phi$, $I_c(\rho,\Phi)=S(\Phi(\rho))-S(\Phi^C(\rho))$ |
| $Q^{(1)}(\Phi)$ | Single-letter coherent information capacity, $Q^{(1)}(\Phi)=\sup_\rho I_c(\rho,\Phi)$ |
| $Q(\Phi)$ | Quantum capacity, $Q(\Phi)=\lim_{n\to\infty}\frac{1}{n}Q^{(1)}(\Phi^{\otimes n})$ |
| Degradable channel | $\Phi$ such that there exists a CPT map $\mathcal D$ with $\Phi^C=\mathcal D\circ\Phi$ |

## Formal statement

Interpreting equation (22) as the intended normalized cyclic random-sub-unitary CPT construction, let $\Phi:M_d\to M_d$ belong to that family. The source prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $U_k$ arbitrary $(d-1)\times(d-1)$ unitaries, but this formula is not CPT as written.

**Problem 10.** Determine the properties of the coherent information $I_c(\rho,\Phi)$ of random sub-unitary channels $\Phi$ of this form. In particular:

1. For which choices of $\{U_k\}$, $d$ is $\Phi$ degradable?
2. When is the coherent information of $\Phi$ additive in the sense
$$\sup_\rho I_c(\rho,\Phi\otimes\Phi)=2\sup_\rho I_c(\rho,\Phi),$$
i.e. $Q^{(1)}(\Phi^{\otimes 2})=2Q^{(1)}(\Phi)$, and more generally for all tensor powers?
3. What are the resulting consequences for the quantum capacity $Q(\Phi)$?

## Exact unresolved remainder

Classify degradability and determine coherent-information additivity and quantum capacity for the intended random sub-unitary channel class.

## Checked progress

### 2007: Bounded-Schmidt-rank tools address only the surrounding structure

- Evidence: Peer reviewed; Related methods
- Finding: Sub-unitary and generic-channel methods provide context, but no full theorem for this cyclic family.
- Source: https://arxiv.org/abs/0706.0705

## Scope and cautions

- Interpretation: The printed Kraus formula is not trace preserving. The research question is interpreted for the intended normalized cyclic family with varying input supports.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
