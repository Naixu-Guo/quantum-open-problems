# The Power of CGLMP Inequalities

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Number of parties (here $N=2$, parties $X$ and $Y$) |
| $M$ | Number of measurement settings per party (here $M=2$) |
| $K$ | Number of outcomes per measurement (here $K=d$) |
| $d$ | Common outcome alphabet size; equivalently, local Hilbert-space dimension for the canonical realisation |
| $X_1,X_2$ | The two observables (each with $d$ outcomes) of party $X$ |
| $Y_1,Y_2$ | The two observables of party $Y$ |
| $m(x)$ | The mod-$d$ representative function $m(x)=x\bmod d \in\{0,1,\dots,d-1\}$ for integer $x$ |
| $\mathsf{E}[\cdot]$ | Expectation value under the experimentally observed joint distribution |
| $P$ | No-signalling polytope in the $(N,M,K)=(2,2,d)$ scenario |
| $Q$ | Convex set of quantum-achievable correlation data in that scenario |
| $C$ | Local classical (deterministic + shared randomness) polytope in that scenario |
| CGLMP inequality | The family of Bell inequalities introduced by Collins, Gisin, Linden, Massar and Popescu for two parties, two settings, and $d$ outcomes |
| Lifting | The operation of producing a Bell inequality for a larger-outcome scenario from one with fewer outcomes by formally identifying ("fusing") some outcomes |
| Kullback–Leibler divergence | Information-theoretic measure $D_{\mathrm{KL}}(p\Vert q)=\sum_a p(a)\log\bigl(p(a)/q(a)\bigr)$, used to quantify statistical strength of nonlocality proofs |
| Discrete Fourier transform | Unitary $F_{jk}=d^{-1/2}\,e^{i 2\pi jk/d}$ on $\mathbb{C}^d$ |
| Diagonal unitary | A unitary whose matrix in the computational basis is diagonal |
| Maximally entangled state | $\vert\Phi_d^+\rangle = d^{-1/2}\sum_{j=0}^{d-1} \vert j\rangle\vert j\rangle$ |

## Background

Bell's theorem in its classical $(N,M,K)=(2,2,2)$ form (CHSH) extends in several distinct directions to scenarios with more parties, more settings, or more outcomes. Collins, Gisin, Linden, Massar and Popescu (CGLMP, 2002) introduced a family of bipartite Bell inequalities for two settings per party and $d$ outcomes per measurement, generalising CHSH from $d=2$ to arbitrary $d\ge 2$. In the convex-geometric picture of Bell scenarios (cf. Problem 26 in the source collection), the local classical correlations form a polytope $C$ inside the quantum-achievable convex body $Q$, which itself sits inside the no-signalling polytope $P$. The natural question raised here, in the special case $(N,M,K)=(2,2,d)$, is whether the CGLMP inequalities are *all* there is: do they (and their liftings from lower-dimensional outcome alphabets) exhaust the facets of $C$ that are not facets of $P$?

A second, complementary question concerns the optimal quantum strategy violating CGLMP. Numerical work of Durt, Kaszlikowski and Zukowski (DKZ, 2001) up to $d=16$ shows that, on a maximally entangled state $|\Phi_d^+\rangle$, the observables maximally violating CGLMP have a very specific structure: they are obtained from measurements in the computational basis by composing with the discrete Fourier transform and with diagonal unitaries — i.e. the optimal observables are of "Fourier + diagonal" type. The problem asks whether this is necessarily the case for all $d$. Moreover, these same measurements appear to be optimal not only for the algebraic violation of CGLMP but also for two finer figures of merit: the resistance of the violation to noise (white-noise admixture), and the statistical strength of nonlocality measured by the Kullback–Leibler divergence between quantum and best-classical (local realistic) distributions, in the sense of van Dam, Grünwald and Gill (2003). Establishing this would give a remarkably clean characterisation of optimal nonlocality experiments in the $(2,2,d)$ regime.

## Formal statement

In the bipartite Bell scenario with $(N,M,K)=(2,2,d)$, let $X_1,X_2$ be the two observables of party $X$ and $Y_1,Y_2$ the two observables of party $Y$, each with outcome alphabet $\{0,1,\dots,d-1\}$. Let $m(x)=x\bmod d$ on the integers, and let $\mathsf{E}[\cdot]$ denote expectation under the experimentally observed joint distribution. The CGLMP inequality (in the form used here, following R. Gill) reads
$$\mathsf{E}\bigl[m(X_1-Y_1)\bigr] + \mathsf{E}\bigl[m(Y_1-X_2)\bigr] + \mathsf{E}\bigl[m(X_2-Y_2)\bigr] + \mathsf{E}\bigl[m(Y_2 - X_1 - 1)\bigr] \;\ge\; d-1 ,$$
which holds for every local classical model. (One may note the proof identity $(X_1-Y_1)+(Y_1-X_2)+(X_2-Y_2)+(Y_2-X_1-1) = -1$ together with the inequality $m(a)+m(b)+m(c)+m(d)\ge m(a+b+c+d)$ for integers $a,b,c,d$.)

**Problem 27.A.** Show that every facet of the local polytope $C$ (in this scenario) which is *not* a facet of the no-signalling polytope $P$ is of CGLMP type: it is either an inequality of the CGLMP form written above, or a *lifting* of such an inequality from a strictly lower-dimensional outcome alphabet — i.e. an inequality obtained by formally fusing outcomes of a CGLMP inequality at smaller $d'<d$.

**Problem 27.B.** Numerically, the observables maximally violating CGLMP on a maximally entangled state $|\Phi_d^+\rangle$ have the specific structure (DKZ; CGLMP): each is a computational-basis measurement preceded by the discrete Fourier transform and a diagonal unitary. Show that this structure is necessary. Show in addition that these "Fourier + diagonal" measurements simultaneously realise the highest resistance of the violation to (white) noise, and the best discrimination against classical realism in the sense of Kullback–Leibler divergence (the statistical strength of nonlocality proofs in the sense of van Dam–Grünwald–Gill).

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
