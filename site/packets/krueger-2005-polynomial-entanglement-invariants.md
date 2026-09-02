# AI research brief: Polynomial entanglement invariants

- Record ID: krueger-2005-polynomial-entanglement-invariants
- Record revision (SHA-256): ea000f7ee8da402cfe635231ec3352d21c7a26d062fbe729d481272b653e5d70
- Formal statement digest (SHA-256): df65a9380330a3eb67f9febe2b578d1a3a7604b6beef1dee0dd1dc7e6959fa00
- Status: Solved
- Field: Quantum information
- Topic: Quantum invariants and representability
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-polynomial-entanglement-invariants/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-polynomial-entanglement-invariants.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Polynomial+entanglement+invariants

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 18-22 (Problem 3)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Completeness would reduce local-unitary classification of entanglement to evaluating polynomials, and the bipartite and multipartite cases are far more delicate than the unipartite case because the symmetry group is a product of local unitaries rather than the full unitary group.

## Notation

| Symbol | Meaning |
|---|---|
| $\rho, \sigma$ | Bipartite (or multipartite) density operators |
| $U_A, U_B$ | Local unitaries on Alice's and Bob's subsystems |
| $\mathrm{tr}$ | Trace |
| $d_1, d_2, \ldots, d_n$ | Hilbert-space dimensions of the $n$ parties |
| $f$ | A real-valued function on the space of density operators (entanglement invariant) |
| $\rho^{\otimes k}$ | $k$-fold tensor power of $\rho$ |
| $U_m^{\otimes k}$ | $k$-fold tensor power of a unitary on the $m$-th subsystem |
| $X$ | An operator on the $nk$-fold tensor product used to define a polynomial invariant via $\mathrm{tr}(\rho^{\otimes k} X)$ |
| $D_{\text{pure}}, D_{\text{mixed}}$ | Dimensions of the space of entanglement types for pure / mixed states |
| $\Delta$ | $d_n - d_1 d_2 \cdots d_{n-1}$ if positive, else $0$ |
| $\mathrm{GL}(n,\mathbf{C})$ | Complex general linear group |
| SLOCC | Stochastic LOCC (action of $\mathrm{GL}(m,\mathbf{C}) \times \mathrm{GL}(n,\mathbf{C})$ in the bipartite case) |
| LOCC | Local operations and classical communication |

## Formal statement

Decide the following:

- (Completeness.) Are the polynomial entanglement invariants of bipartite (and more generally multipartite) density operators complete? That is, if for every polynomial invariant $f$ one has $f(\rho) = f(\sigma)$, does there exist a tuple of local unitaries $(U_A, U_B)$ (or, for $n$ parties, $(U_1, \ldots, U_n)$) such that
$$\rho = (U_A \otimes U_B)\,\sigma\,(U_A \otimes U_B)^{*}\,?$$

Additional related sub-problems are also posed:

- (Finite generating sets.) Given the dimensions of the parties, exhibit a finite set of polynomial invariants that is already complete.
- (Multipartite extension.) Solve the analogous problems for multipartite states; even the pure-state case is non-trivial in this setting.
- (Separability via invariants.) Decide whether the set of separable states can be characterised by a polynomial invariant $f$ such that $f(\rho) \ge 0$ iff $\rho$ is separable; or in weaker form, find polynomial sufficient or necessary separability criteria (possibly depending on dimensions).

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2005: Compact-group invariants separate local unitary orbits

- Evidence: Official status page; Elementary consequence
- Finding: Sudbery answers the completeness question affirmatively by invoking the Onishchik-Vinberg theorem that the orbits of a compact linear group acting on a real vector space are separated by the polynomial invariants. The local unitary group is compact and acts linearly on the real space of density operators, so two multipartite states agree on all polynomial invariants exactly when they are related by a local unitary.
- Source: https://doi.org/10.48550/arXiv.quant-ph/0504166

### 1990: Compact-group invariants separate local unitary orbits

- Evidence: Peer reviewed; Exact theorem
- Finding: Sudbery answers the completeness question affirmatively by invoking the Onishchik-Vinberg theorem that the orbits of a compact linear group acting on a real vector space are separated by the polynomial invariants. The local unitary group is compact and acts linearly on the real space of density operators, so two multipartite states agree on all polynomial invariants exactly when they are related by a local unitary.

## Scope and cautions

- Scope: Only the principal completeness question is settled; the accompanying sub-problems on finite complete generating sets in all dimensions, on higher-party multipartite classification, and on polynomial separability criteria remain active.
- Scope: Compactness of the group is essential; the analogous separation statement is false for GL(n,C) similarity actions, as the Jordan-form obstruction shows.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
