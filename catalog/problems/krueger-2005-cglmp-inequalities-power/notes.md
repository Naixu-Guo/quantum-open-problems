# The Power of CGLMP Inequalities

## Background

Bell's theorem in its classical $(N,M,K)=(2,2,2)$ form (CHSH) extends in several distinct directions to scenarios with more parties, more settings, or more outcomes. Collins, Gisin, Linden, Massar and Popescu (CGLMP, 2002) introduced a family of bipartite Bell inequalities for two settings per party and $d$ outcomes per measurement, generalising CHSH from $d=2$ to arbitrary $d\ge 2$. In the convex-geometric picture of Bell scenarios (cf. Problem 26 in the source collection), the local classical correlations form a polytope $C$ inside the quantum-achievable convex body $Q$, which itself sits inside the no-signalling polytope $P$. The natural question raised here, in the special case $(N,M,K)=(2,2,d)$, is whether the CGLMP inequalities are *all* there is: do they (and their liftings from lower-dimensional outcome alphabets) exhaust the facets of $C$ that are not facets of $P$?

A second, complementary question concerns the optimal quantum strategy violating CGLMP. Numerical work of Durt, Kaszlikowski and Zukowski (DKZ, 2001) up to $d=16$ shows that, on a maximally entangled state $|\Phi_d^+\rangle$, the observables maximally violating CGLMP have a very specific structure: they are obtained from measurements in the computational basis by composing with the discrete Fourier transform and with diagonal unitaries — i.e. the optimal observables are of "Fourier + diagonal" type. The problem asks whether this is necessarily the case for all $d$. Moreover, these same measurements appear to be optimal not only for the algebraic violation of CGLMP but also for two finer figures of merit: the resistance of the violation to noise (white-noise admixture), and the statistical strength of nonlocality measured by the Kullback–Leibler divergence between quantum and best-classical (local realistic) distributions, in the sense of van Dam, Grünwald and Gill (2003). Establishing this would give a remarkably clean characterisation of optimal nonlocality experiments in the $(2,2,d)$ regime.

## Status and known progress

The problem is **partially solved**. Problem 27.A was disproved; the measurement-optimality questions in 27.B remain open in their general form.

- The CGLMP inequalities themselves (Collins–Gisin–Linden–Massar–Popescu, Phys. Rev. Lett. **88**, 040404 (2002)) are known to be facets of $C$ for every $d\ge 2$ in the $(2,2,d)$ scenario.
- **Problem 27.A, negative resolution.** Bancal, Gisin and Pironio (2010) found facet inequalities for two parties, two settings and four outcomes that are neither CGLMP inequalities nor liftings of lower-outcome CGLMP inequalities. One counterexample suffices to disprove the universal facet-classification conjecture.
- For Problem 27.B, Acín, Durt, Gisin, Latorre (2002) and subsequent works showed that the *state* maximally violating CGLMP is in general *not* the maximally entangled one — a non-uniform Schmidt-coefficient state does better — which complicates the "Fourier + diagonal" picture: the structural conjecture should be read as concerning the optimum over observables given that one fixes the maximally entangled state, not the global optimum over states *and* measurements.
- Concerning statistical strength, van Dam, Grünwald and Gill (Stat. Sci. **23**, 23 (2008); arXiv:quant-ph/0307125) confirmed numerically that the natural CGLMP measurements provide the largest Kullback–Leibler divergence in several low-$d$ cases, but no proof for general $d$ is known.

The global state-and-measurement optimum is also known not to use a maximally entangled state in general. That fact does not by itself answer 27.B, which fixes the maximally entangled state and asks for necessity of the Fourier-plus-diagonal measurements and simultaneous optimality for noise and Kullback–Leibler strength.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 27, pp. 68–69 (contact: R. Gill, 15 Apr 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- D. Collins, N. Gisin, N. Linden, S. Massar, S. Popescu, *Bell inequalities for arbitrarily high dimensional systems*, Phys. Rev. Lett. **88**, 040404 (2002); arXiv:quant-ph/0106024 (2001).
- T. Durt, D. Kaszlikowski, M. Zukowski, *Violations of local realism with quantum systems described by $N$-dimensional Hilbert spaces up to $N=16$*, Phys. Rev. A **64**, 024101 (2001); arXiv:quant-ph/0101084 (2001).
- W. van Dam, P. Grünwald, R. Gill, *The statistical strength of nonlocality proofs*, IEEE Trans. Inf. Theory **51**, 2812 (2005); arXiv:quant-ph/0307125 (2003).
- R. Gill, private communication (cited as [Gill2] in the source).
- A. Acín, T. Durt, N. Gisin, J. I. Latorre, *Quantum non-locality in two three-level systems*, Phys. Rev. A **65**, 052325 (2002); arXiv:quant-ph/0111143.
- D. Collins and N. Gisin, *A relevant two qubit Bell inequality inequivalent to the CHSH inequality*, J. Phys. A **37**, 1775 (2004); arXiv:quant-ph/0306129.
- J.-D. Bancal, N. Gisin, S. Pironio, *Looking for symmetric Bell inequalities*, J. Phys. A: Math. Theor. **43**, 385303 (2010); arXiv:1004.4146.
