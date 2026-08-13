# Polynomial entanglement invariants

> **Audit status (2026-08-12): SOLVED**

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

## Background

Two bipartite density operators $\rho$ and $\sigma$ are said to be *equally entangled* if they are related by a local change of basis, i.e., there exist unitaries $U_A, U_B$ such that

$$\rho = (U_A \otimes U_B)\,\sigma\,(U_A \otimes U_B)^{*}.$$

An *entanglement invariant* is any real-valued function on density operators that takes the same value on equally entangled states; a *polynomial invariant* is one that can be expressed as a polynomial in the matrix elements of $\rho$ (allowing complex conjugates does not enlarge the class because $\rho$ is Hermitian). Every homogeneous polynomial of degree $k$ in $\rho$ is of the form $\mathrm{tr}(\rho^{\otimes k} X)$ for some operator $X$; invariance under $U_1^{\otimes k} \otimes \cdots \otimes U_n^{\otimes k}$ forces $X$ to be a tensor product of permutation operators (one for each party) by Schur–Weyl duality. The ring of such invariants has been described in the bipartite and general multipartite cases (Grassl–Rötteler–Beth; Rains).

A natural and basic question is whether these polynomial invariants suffice to distinguish equivalence classes — that is, whether they form a *complete* set of invariants for the action of local unitaries. The "unipartite" version of the analogous question is trivial: density operators are unitarily equivalent if and only if they share the same spectrum, and the spectrum is captured by the polynomial functions $a_n = \mathrm{tr}(\rho^n)$, $n=1, \ldots, \dim$. For bipartite (and multipartite) systems, the question is far more delicate because the symmetry group is a product of local unitaries rather than the full unitary group.

## Formal statement

Decide the following:

- (Completeness.) Are the polynomial entanglement invariants of bipartite (and more generally multipartite) density operators complete? That is, if for every polynomial invariant $f$ one has $f(\rho) = f(\sigma)$, does there exist a tuple of local unitaries $(U_A, U_B)$ (or, for $n$ parties, $(U_1, \ldots, U_n)$) such that
$$\rho = (U_A \otimes U_B)\,\sigma\,(U_A \otimes U_B)^{*}\,?$$

Additional related sub-problems are also posed:

- (Finite generating sets.) Given the dimensions of the parties, exhibit a finite set of polynomial invariants that is already complete.
- (Multipartite extension.) Solve the analogous problems for multipartite states; even the pure-state case is non-trivial in this setting.
- (Separability via invariants.) Decide whether the set of separable states can be characterised by a polynomial invariant $f$ such that $f(\rho) \ge 0$ iff $\rho$ is separable; or in weaker form, find polynomial sufficient or necessary separability criteria (possibly depending on dimensions).

## Status and known progress

**Solved (the principal completeness question).** The basic question of completeness of polynomial entanglement invariants is answered affirmatively by A. Sudbery via a classical theorem of Onishchik and Vinberg:

> *The orbits of a compact linear group acting on a real vector space are separated by the polynomial invariants.* (Onishchik–Vinberg, *Lie Groups and Algebraic Groups*, Springer 1990, Chap. 3, §4, Theorem 3.)

The local unitary group is compact, and its action on the space of density operators is a compact linear action on a real vector space, so the polynomial invariants separate orbits. Consequently, two multipartite quantum states are related by a local unitary if and only if all polynomial invariants agree. This solution appears in the "Solution" section of the source. (The compactness assumption is essential; the analogous statement is false for $\mathrm{GL}(n,\mathbf{C})$ similarity actions, as illustrated by the Jordan-form obstruction.)

The source dates Sudbery's resolution to 2001-12-18, recorded as "last progress" on the title page of Problem 3.

**Partial results on finite complete sets and dimensions of orbit spaces.**

- Y. Makhlin [M; quant-ph/0002045] gave a complete set of 18 invariants for the bipartite two-qubit case, none of which can be omitted; the space of entanglement types of mixed two-qubit states is a 9-dimensional manifold in $\mathbf{R}^{18}$ with 9 relations among the 18 generators.
- A. Sudbery [S; quant-ph/0001116] solved the pure three-qubit case with 8 polynomial invariants, 6 being the dimension of the manifold of all invariants; together with one more invariant found by Grassl, [AAJT; quant-ph/0009107] obtained the six independent invariants describing pure three-qubit states. The space of entanglement types of pure three-qubit states is a hypersurface in real projective 6-space.
- For pure $n$-partite states with parties of dimensions $d_1 \le \cdots \le d_n$, the dimension of the space of entanglement types is
$$D_{\text{pure}} = 2 \prod_{r=1}^n d_r - \sum_{r=1}^n d_r^2 + n - 2 + \Delta^2,$$
with $\Delta = d_n - d_1\cdots d_{n-1}$ if positive and $0$ otherwise; for $n$ parties of equal local dimension $d$ this becomes $D_{\text{pure}} = 2 d^n - n d^2 + n - 2$. The corresponding dimension for mixed states is $D_{\text{mixed}} = d^{2n} - n d^2 + n - 1$.
- The three-qubit SLOCC classification has two genuine entanglement classes. The four-qubit result of Verstraete, Dehaene, De Moor and Verschelde gives nine families with continuous parameters, not nine individual SLOCC orbits.
- A basis for the ring of polynomial invariants in the multipartite case for arbitrary Hilbert-space dimensions was given by Grassl–Rötteler–Beth [GRB; quant-ph/9712040] and by Rains [R; quant-ph/9704042].

The remaining sub-problems (finite complete generating sets in all dimensions; analogous classifications for higher-party multipartite systems; polynomial separability characterisations) are still active research areas as of 2026, but the principal completeness question of Problem 3 is settled.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 3, pp. 18–22.
- A. Acín, A. Andrianov, E. Jané, R. Tarrach, *Three-qubit pure-state canonical forms*, J. Phys. A **34**, 6725 (2001); arXiv:quant-ph/0009107.
- H. A. Carteret, A. Higuchi, A. Sudbery, *Multipartite generalisation of the Schmidt decomposition*, J. Math. Phys. **41** (2000); arXiv:quant-ph/0006125.
- H. A. Carteret and A. Sudbery, *Local symmetry properties of pure states of three qubits*, J. Phys. A **33**, 4981 (2000); arXiv:quant-ph/0001091.
- W. Dür, G. Vidal, J. I. Cirac, *Three qubits can be entangled in two inequivalent ways*, Phys. Rev. A **62**, 062314 (2000); arXiv:quant-ph/0005115.
- M. Grassl, M. Rötteler, T. Beth, *Computing local invariants of qubit systems*, Phys. Rev. A **58**, 1833 (1998); arXiv:quant-ph/9712040.
- Y. Makhlin, *Nonlocal properties of two-qubit gates and mixed states and optimization of quantum computations*, arXiv:quant-ph/0002045 (2000).
- B. De Moor, F. Verstraete, J. Dehaene, H. Verschelde, *Four qubits can be entangled in nine inequivalent ways*, arXiv:quant-ph/0109033 (2001).
- A. L. Onishchik and E. B. Vinberg, *Seminar on Lie Groups and Algebraic Groups*, Springer (Berlin), 1990 (English translation *Lie Groups and Algebraic Groups*), Chap. 3, Paragraph 4, Theorem 3.
- E. M. Rains, *Polynomial invariants of quantum codes*, arXiv:quant-ph/9704042 (1997).
- A. Sudbery, *On local invariants of pure three-qubit states*, J. Phys. A **34**, 643 (2001); arXiv:quant-ph/0001116.
