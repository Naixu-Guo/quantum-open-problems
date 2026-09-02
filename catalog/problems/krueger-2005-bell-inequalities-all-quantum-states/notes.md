# Bell Inequalities Holding for All Quantum States

## Background

The Bell scenario considered here fixes $N$ parties, $M$ measurement settings per party, and $K$ possible outcomes per measurement. The joint probability distributions $p(\vec a|\vec x)$ form a convex polytope when subjected to positivity (probabilities $\ge 0$, normalised), and a smaller convex polytope $P$ — the *no-signalling polytope* — when further restricted by the no-signalling condition: the marginal distribution seen by any one party (or subset) must be independent of the measurement settings of the other parties. Inside $P$ sits the convex set $Q$ of correlation data attainable by performing local POVM measurements on a shared multipartite quantum state. Inside $Q$ in turn sits the (smaller) convex polytope $C$ of correlations realisable by classical local realistic theories: convex combinations of deterministic strategies in which each party's output is a function of its own setting and shared randomness. The strict inclusion $C \subsetneq Q \subsetneq P$ encodes both Bell's theorem ($Q\not\subset C$, "quantum mechanics is not classical") and Tsirelson-type bounds ($Q\not= P$, "quantum mechanics is not maximally no-signalling").

A *Bell inequality* corresponds to a face of the polytope $C$. A *proper* (non-trivial) Bell inequality corresponds to a maximal face of $C$ that is not also a face of $P$ — that is, a tight linear inequality for classical correlations which is not implied merely by positivity and the no-signalling constraint. Such a face is depicted as a blue line in the schematic figure of the source problem. The conceptual question is: how does $Q$ fit in between $C$ and $P$? In particular, can every proper Bell inequality be quantum-mechanically violated (so that $Q$ always "pokes through" any face of $C$ that is not already a face of $P$), or do there exist proper Bell inequalities that hold for all quantum states? The latter would represent a striking additional structural constraint on quantum mechanics beyond Tsirelson-type bounds.

A second, complementary question concerns the *outer* boundary of $Q$ that is not part of the boundary of $P$: can these boundary points be saturated using "minimal-dimension" quantum resources — local Hilbert spaces of dimension $K$ measured by complete von Neumann measurements on pure states — or do some require larger dimension or non-projective POVMs?

## Status and known progress

**Status: solved negatively.** Both universal questions have counterexamples.

- For the simplest non-trivial setting $(N,M,K)=(2,2,2)$ (CHSH), the only non-trivial facet inequalities of $C$ are the CHSH inequalities, and all of them are violated by quantum states (Tsirelson). Hence Problem 26.B is affirmative in this case.
- For $(2,2,K)$ with $K\ge 3$, Collins–Gisin–Linden–Massar–Popescu (the CGLMP inequalities, Phys. Rev. Lett. **88**, 040404 (2002)) showed that the natural family of facet inequalities admits quantum violations. Subsequent classifications (Collins–Gisin 2004; Pironio 2014; Brunner et al. *Bell nonlocality*, RMP 2014) extended this verification to many further low-complexity scenarios.
- **26.A, negative.** Slofstra's $\mathrm{CHSH}(n)$ XOR games have binary outcomes, so $K=2$, but every optimal strategy needs local dimension at least $2^{\lfloor n/2\rfloor}$. For $n=4$ this is at least four. The associated optimal behavior has uniform marginals and full-correlation entries $0$ or $\pm1/\sqrt2$, so all joint probabilities are strictly positive and the behavior lies away from the positivity boundary of the no-signalling polytope. It lies on $\partial Q$ because it maximises the game functional. Thus it is a point of $\partial Q\setminus\partial P$ that cannot be realised with local dimension $K=2$.
- **26.B, negative.** The Guess Your Neighbor's Input inequalities have equal classical and quantum optima, while no-signalling correlations do better. Almeida et al. gave the construction, and Augusiak et al. proved explicit instances are tight facets, including GYNI inequalities for every odd number of parties. These are proper maximal faces of $C$ that no quantum behavior violates, exactly the requested counterexamples.
- MIP*=RE and later dimension-witness results strengthen the conclusion but are not needed for either exact counterexample.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 26, pp. 66–67 (contact: R. Gill, 11 Apr 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- J. S. Bell, *On the Einstein–Podolsky–Rosen paradox*, Physics **1**, 195 (1964).
- B. S. Tsirelson, *Quantum generalizations of Bell's inequality*, Lett. Math. Phys. **4**, 93 (1980).
- D. Collins, N. Gisin, N. Linden, S. Massar, S. Popescu, *Bell inequalities for arbitrarily high dimensional systems*, Phys. Rev. Lett. **88**, 040404 (2002); arXiv:quant-ph/0106024.
- D. Collins and N. Gisin, *A relevant two qubit Bell inequality inequivalent to the CHSH inequality*, J. Phys. A **37**, 1775 (2004); arXiv:quant-ph/0306129.
- N. Brunner, D. Cavalcanti, S. Pironio, V. Scarani, S. Wehner, *Bell nonlocality*, Rev. Mod. Phys. **86**, 419 (2014); arXiv:1303.2849.
- Z. Ji, A. Natarajan, T. Vidick, J. Wright, H. Yuen, *MIP* = RE*, arXiv:2001.04383 (2020); Communications of the ACM **64**, 131 (2021).
- W. Slofstra, *Lower bounds on the entanglement needed to play XOR non-local games*, J. Math. Phys. **52**, 102202 (2011); arXiv:1007.2248.
- M. L. Almeida, J.-D. Bancal, N. Brunner, A. Acín, N. Gisin, S. Pironio, *Guess Your Neighbor's Input: A multipartite nonlocal game with no quantum advantage*, Phys. Rev. Lett. **104**, 230404 (2010); arXiv:1003.3844.
- R. Augusiak et al., *Tight Bell inequalities with no quantum violation from qubit unextendible product bases*, Phys. Rev. A **85**, 042113 (2012); arXiv:1112.3238.
