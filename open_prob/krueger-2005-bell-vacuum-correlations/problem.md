# Bell inequalities for long range vacuum correlations

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $\Omega$ | The vacuum state of a relativistic quantum field |
| $\phi(x)$ | Massive scalar free Bose field at spacetime point $x$ |
| $m$ | Mass parameter of the scalar field, $m > 0$ |
| $\mathcal{O}_A, \mathcal{O}_B$ | Bounded open spacetime regions (typically spacelike separated) |
| $\mathcal{A}(\mathcal{O})$ | Local von Neumann algebra of observables associated with region $\mathcal{O}$ |
| $d(\mathcal{O}_A, \mathcal{O}_B)$ | Minimum spatial distance between $\mathcal{O}_A$ and $\mathcal{O}_B$ |
| CHSH | Clauser–Horne–Shimony–Holt inequality |
| $\beta(\mathcal{O}_A, \mathcal{O}_B; \Omega)$ | Maximal CHSH value attainable using observables from $\mathcal{A}(\mathcal{O}_A)$ and $\mathcal{A}(\mathcal{O}_B)$ in the vacuum |
| PPT | Positive partial transpose |

## Background

Algebraic quantum field theory associates to every bounded open spacetime region $\mathcal{O}$ a von Neumann algebra $\mathcal{A}(\mathcal{O})$ of local observables, and the vacuum $\Omega$ defines a state on the global algebra. Even in regions of zero entanglement entropy in the usual non-relativistic sense, the vacuum exhibits strong non-classical correlations between spacelike separated regions.

A landmark result of Summers and Werner (1985) shows that for suitably chosen spacelike separated tangent regions, the vacuum *maximally* violates the CHSH–Bell inequalities: the Tsirelson bound $2\sqrt{2}$ is saturated. Their construction relies on choosing regions whose boundaries touch; as the two regions are pulled apart, the maximal CHSH value $\beta$ degrades towards the classical bound $2$ and tends to zero violation in the limit of large separation.

A subsequent result of Halvorson and Clifton (1999) shows that the vacuum is *not separable across any distance*: for every pair of spacelike separated bounded regions, the restriction of the vacuum is entangled in the operator-algebraic sense. Verch and Werner (2004) strengthen this to show that an analogue of the *positive partial transpose* property also fails for arbitrary regions at any distance.

These facts establish entanglement and the failure of PPT-type criteria for arbitrarily separated regions, but they do not by themselves produce concrete Bell-type observables violating CHSH at arbitrary distance. The question is whether such a violation, however small, can be exhibited for arbitrarily far apart regions, or whether at sufficient distances the local restrictions admit a *local hidden-variable model* despite being entangled.

## Formal statement

Consider a massive scalar free relativistic Bose field of mass $m > 0$, and its vacuum state $\Omega$.

For bounded open spacelike-separated regions $\mathcal{O}_A, \mathcal{O}_B$, let
$$\beta(\mathcal{O}_A, \mathcal{O}_B;\,\Omega) \;=\; \sup\Bigl\{\, \bigl|\langle A_1 (B_1 + B_2) + A_2 (B_1 - B_2)\rangle_{\Omega}\bigr| \,:\, A_i \in \mathcal{A}(\mathcal{O}_A),\; B_j \in \mathcal{A}(\mathcal{O}_B),\; \|A_i\|, \|B_j\| \leq 1,\; A_i = A_i^*,\; B_j = B_j^* \Bigr\}$$
be the maximal CHSH value attainable with observables drawn from the two regions in the vacuum.

**Problem.** Decide whether some (necessarily small) CHSH violation is possible for regions arbitrarily far apart, i.e. whether
$$\beta(\mathcal{O}_A, \mathcal{O}_B;\,\Omega) \;>\; 2$$
can hold for spacelike-separated regions with $d(\mathcal{O}_A, \mathcal{O}_B)$ arbitrarily large; or, conversely, show that beyond some distance the vacuum restriction admits a local hidden-variable model.

## Status and known progress

- **Status:** open. No definitive resolution has been published establishing either (i) a CHSH violation for arbitrary large spacelike separations in the free massive scalar vacuum, or (ii) the existence of a local hidden-variable model for the vacuum beyond some distance.
- **Maximal violation for tangent regions (Summers–Werner, 1985).** The vacuum maximally violates CHSH (saturating $\beta = 2\sqrt{2}$) for suitable spacelike separated tangent regions; the construction fails as the regions are pulled apart.
- **Non-separability at every distance (Halvorson–Clifton, 1999).** The vacuum restriction to two spacelike separated regions is always entangled, no matter how far apart.
- **Failure of PPT at every distance (Verch–Werner, 2004).** An operator-algebraic analogue of the positive partial transpose criterion fails for every pair of spacelike separated regions.
- These results establish entanglement and rule out PPT-type separability at all distances, but do not produce explicit Bell-type observables witnessing a CHSH violation for arbitrarily large separations. The exponential clustering of vacuum correlations in a massive theory (mass gap) suggests $\beta \to 2$ as $d \to \infty$, but does not rule out a strict inequality $\beta > 2$ at every finite distance.
- Reznik, Retzker and Silman (quant-ph/0310058) show entanglement harvesting at arbitrary separation. Their unfiltered detector state does not violate CHSH; the violation appears only after local filtering and postselection. That is hidden nonlocality, not the direct bounded-region CHSH statement asked here.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 12, p. 42 (proposed by R. Verch, 22 Jan 2002).
- S. J. Summers and R. F. Werner, *The vacuum violates Bell's inequalities*, Phys. Lett. A **110**, 257–259 (1985).
- H. Halvorson and R. Clifton, *Generic Bell correlation between arbitrary local algebras in quantum field theory*, J. Math. Phys. **41**, 1711–1717 (2000); arXiv:math-ph/9909013 (1999).
- R. Verch and R. F. Werner, *Distillability and positivity of partial transposes in general quantum field systems*, arXiv:quant-ph/0403089 (2004).
- B. Reznik, A. Retzker, J. Silman, *Violating Bell's inequalities in vacuum*, Phys. Rev. A **71**, 042104 (2005); arXiv:quant-ph/0310058.
