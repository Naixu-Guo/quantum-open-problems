# Bound entangled states with negative partial transpose

> **Audit status (2026-08-12): OPEN**

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

## Background

For bipartite quantum systems with Hilbert space $\mathcal{H}_d\otimes\mathcal{H}_d$, a mixed state $\rho$ is separable if it can be written as a convex combination of product states and entangled otherwise. The partial transpose $\rho^\Gamma$ obtained by transposing one of the two subsystems provides a useful test: if any eigenvalue of $\rho^\Gamma$ is strictly negative ($\rho$ is NPT) the state is certainly entangled, while if $\rho^\Gamma$ is positive semidefinite ($\rho$ is PPT) the state may be either separable or entangled. The Horodecki separability criterion gives a complete characterisation only in the smallest cases ($2\otimes 2$ and $2\otimes 3$).

Entanglement distillation is the process by which two distant parties, using local quantum operations and classical communication, convert many copies of a noisy entangled state into a smaller number of pure maximally entangled pairs. A state $\rho$ is called $n$-copy distillable if some such protocol applied to $n$ copies of $\rho$ outputs a state of fidelity $>1/2$ with a singlet; it is called distillable if it is $n$-copy distillable for some finite $n$, and bound entangled if it is entangled yet undistillable.

All two-qubit entangled states are distillable. In higher dimensions, PPT entangled states exist and they are necessarily bound entangled. The big open question is whether there exist bound entangled states whose partial transpose is negative — NPT bound entangled states. Operationally, finding one would prove non-additivity (and non-convexity) of distillable entanglement, would create extremal examples of superadditivity, and would change our picture of entanglement as a resource. The problem is famously related to a long-standing mathematical question about tensor powers of $2$-co-positive maps.

## Formal statement

**Problem 4:** *Establish whether there exist bound entangled states with negative partial transpose.*

Setup: Fix $d>2$ and consider bipartite states on $\mathcal{H}_d\otimes\mathcal{H}_d$. A state $\rho$ is called $n$-copy distillable if there exist two-dimensional (i.e. rank two) projectors $P$ and $Q$ acting on $(\mathcal{H}_d)^{\otimes n}$ such that the matrix
$$(P\otimes Q)\,(\rho^\Gamma)^{\otimes n}\,(P\otimes Q)$$
has a negative eigenvalue. The state is distillable if it is $n$-copy distillable for some finite $n$. The problem asks: do there exist NPT states $\rho$ on $\mathcal{H}_d\otimes\mathcal{H}_d$ (some $d>2$) that are not distillable, i.e. for which no such $n$, $P$, $Q$ exist?

In the Choi-map formulation, if $S$ is the completely positive map associated with a state, $n$-copy nondistillability is equivalent to $S^{\otimes n}$ being 2-copositive, or $(T\circ S)^{\otimes n}$ being 2-positive. A related but logically distinct sufficient route is to construct a tensor-stable positive map that is neither completely positive nor completely copositive. These formulations should not be collapsed into one condition on an arbitrary positive map.

## Status and known progress

**Status: open.** The problem has been open since at least 1999 and remains one of the central problems of entanglement theory.

- DiVincenzo, Shor, Smolin, Terhal, Thapliyal (2000) and Dür, Cirac, Lewenstein, Bruß (2000) provided strong numerical and analytic evidence that a one-parameter family of Werner states contains NPT states that might remain undistillable for every number of copies. This evidence is not an all-copy proof.
- Pankowski, Piani, M. Horodecki, P. Horodecki (2010): improvements towards NPT bound entanglement, reducing the problem to specific algebraic statements.
- Eggeling, Vollbrecht, Werner, Wolf (2001): equivalence between NPT bound entanglement and a positivity-respecting partial-transpose protocol; NPT bound entanglement is equivalent to existence of NPT undistillable Werner states for $d>2$.
- Watrous (2004) constructed states that are $n$-copy non-distillable but $(n+1)$-copy distillable, indicating that the problem is genuinely hard.
- Müller-Hermes, Reeb, Wolf (2016) formalised tensor-stable positivity and connected it to NPT bound entanglement.
- Christandl, Schuch, Winter, Smith–Yard (2010): if NPT bound entangled states exist then distillable entanglement is non-additive and non-convex; combined with PPT-state results this implies extremal superadditivity.
- Qian, Chen, Chu, Shen (2019) and follow-up: progress on a matrix inequality whose resolution would close a key sub-case (bound $1/2$ for normal $A,B$ proven, general case remains).
- **Two-copy milestone, July 2026.** Four concurrent preprints, arXiv:2607.21367, 2607.23416, 2607.24309, and 2607.24479, prove the exact two-copy Werner-state threshold in arbitrary dimension: a Werner state is two-copy distillable if and only if it is already one-copy distillable. This solves the separate two-copy problem in this collection, but not the all-copy question here. None of the four manuscripts had passed journal peer review by the verification date.
- **Three-copy and special-family claims do not close the problem.** Wu and Zou, arXiv:2608.02647v1, prove nonnegativity only for specified rank-two sectors of the three-copy Werner endpoint. Lei, Song, Chen and Liu, arXiv:2608.03710v1, settle one-copy undistillability for a parameter interval in a special rank-five two-qutrit family and obtain a two-copy obstruction plus numerics. Neither paper exhibits an all-copy-undistillable NPT state.
- Tabia, Chen and Hsieh, arXiv:2608.08836v1, posted 9 August 2026, prove that selected one-copy-undistillable NPT states are two-copy distillable in every local dimension $d\ge3$. This eliminates candidates rather than producing NPT bound entanglement.

No proof or counterexample to the full finite-dimensional bipartite question is known as of the verification date.

**Last verified:** 2026-08-12.

## Bibliography

- P. Horodecki, Ł. Rudnicki, K. Życzkowski, *Five open problems in theory of quantum information*, PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]. (Source paper; Problem 4 on p. 6–8.)
- D. P. DiVincenzo, P. W. Shor, J. A. Smolin, B. M. Terhal, A. V. Thapliyal, *Evidence for bound entangled states with negative partial transpose*, Phys. Rev. A 61, 062312 (2000).
- W. Dür, J. I. Cirac, M. Lewenstein, D. Bruß, *Distillability and partial transposition in bipartite systems*, Phys. Rev. A 61, 062313 (2000).
- M. Horodecki, P. Horodecki, R. Horodecki, *Mixed-state entanglement and distillation: Is there a "bound" entanglement in Nature?*, Phys. Rev. Lett. 80, 5239 (1998).
- M. Horodecki, P. Horodecki, R. Horodecki, *Inseparable two spin-$\tfrac12$ density matrices can be distilled to a singlet form*, Phys. Rev. Lett. 78, 574 (1997).
- T. Eggeling, K. G. H. Vollbrecht, R. F. Werner, M. M. Wolf, *Distillability via protocols respecting the positivity of partial transpose*, Phys. Rev. Lett. 87, 257902 (2001).
- L. Pankowski, M. Piani, M. Horodecki, P. Horodecki, *A few steps more towards NPT bound entanglement*, IEEE Trans. Inf. Theory 56, 4085 (2010).
- L. Clarisse, *Entanglement Distillation. A Discourse on Bound Entanglement in Quantum Information Theory*, arXiv:quant-ph/0612072 (2006).
- J. Watrous, *Many copies may be required for entanglement distillation*, Phys. Rev. Lett. 93, 010502 (2004).
- A. Müller-Hermes, D. Reeb, M. M. Wolf, *Positivity of linear maps under tensor powers*, J. Math. Phys. 57, 015202 (2016).
- R. F. Werner, *Quantum states with Einstein-Podolsky-Rosen correlations admitting a hidden-variable model*, Phys. Rev. A 40, 4277 (1989).
- D. Đoković, *On two-distillable Werner states*, Entropy 18, 216 (2016).
- L. Qian, L. Chen, D. Chu, Y. Shen, *A matrix inequality related to the entanglement distillation problem*, arXiv:1908.02428 (2019).
- J. Fu, L. Gao, S.-J. Park, *A solution to 2-copy distillability of Werner states*, arXiv:2607.21367 (2026).
- Z. Song, L. Chen, *A partial-trace matrix inequality and Werner-state distillability*, arXiv:2607.23416 (2026).
- T. C. Fraser, F. Huber, B. Pozsgay, I. Vona, *On the two-copy distillability of Werner states and a new partial trace inequality*, arXiv:2607.24309 (2026).
- K. Bharti, S. Gajjala, T. Haug, *Two-copy nondistillability of Werner states: sharp partial-trace inequalities and finite-copy extensions*, arXiv:2607.24479 (2026).
- T. Wu, Q. Zou, *Sharp Plucker Geometry for Three-Copy Werner Distillation*, arXiv:2608.02647 (2026).
- Y. Lei, Z. Song, L. Chen, M. Liu, *Entanglement Distillation of some Rank-Five Symmetric NPT States in Two-Qutrit Systems*, arXiv:2608.03710 (2026).
- G. N. M. Tabia, K.-S. Chen, M.-H. Hsieh, *Two-copy distillability of one-copy-undistillable negative-partial-transpose states in every dimension*, arXiv:2608.08836 (2026).
- G. Smith, J. Yard, *Quantum communication with zero-capacity channels*, Science 321, 1812 (2008).
- K. Horodecki, M. Pankowski, M. Horodecki, P. Horodecki, *Low-dimensional bound entanglement with one-way distillable cryptographic key*, IEEE Trans. Inf. Theory 54, 2621 (2008) — see also K. Horodecki, M. Horodecki, P. Horodecki, J. Oppenheim, *Secure key from bound entanglement*, Phys. Rev. Lett. 94, 160502 (2005).
