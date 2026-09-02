# All the Bell Inequalities

## Background

A correlation experiment in the Bell sense involves $N$ spatially separated subsystems, $M$ measurement choices per subsystem, and $K$ outcomes per measurement. A local deterministic model assigns one of $K$ values to each of the $NM$ observables, giving $K^{NM}$ deterministic vertices. The raw conditional-probability table has $(MK)^N$ coordinates, but normalization and, when imposed, no-signalling constraints reduce its affine dimension. Bell inequalities are supporting linear inequalities; the facet-defining ones describe maximal faces of the local polytope.

For the simplest scenario $(N,M,K)=(2,2,2)$ the polytope's facets are exhausted by the two CHSH inequalities together with positivity constraints (Fine 1982). For larger $(N,M,K)$ the polytope has so many facets that a complete enumeration is computationally intractable: Pitovsky has shown that the general problem is at least as hard as well-known NP-hard problems. The literature has nevertheless built up a substantial body of partial results — for restricted symmetries (Garg–Mermin), for full-correlation inequalities (Werner–Wolf for $M=K=2$ and arbitrary $N$), and via numerics (Pitowsky–Svozil for $(3,2,2)$ and $(2,3,2)$) — and the present problem is intended as a focal point for organising these contributions and pushing them further.

## Status and known progress

The problem remains open in its general $(N,M,K)$ formulation, although several restricted cases are completely solved:

- $(N,M,K)=(2,2,2)$: completely classified by Fine (1982); the only facets are positivity and CHSH.
- $M=K=2$, arbitrary $N$ (full correlation inequalities): Werner and Wolf (2001) [arXiv:quant-ph/0102024] gave the complete list of $2^{(2^N)}$ facet inequalities on the $2^N$-dimensional space of full correlation functions, equivalently captured by a single non-linear inequality identifying the maximal faces of a hyper-octahedron; the maximal violations are attained by generalised GHZ states.
- $(N,M,K)=(3,2,2)$ and $(2,3,2)$: Pitowsky and Svozil (2000) [quant-ph/0011060] numerically enumerated complete sets (53856 inequalities) taking marginal constraints into account.
- Bacon and Toner (2002) [quant-ph/0208057] gave the complete set of "one-bit-of-classical-communication" correlation inequalities for $(2,2,2)$ and $(2,3,2)$.
- Acín, Scarani and Wolf (2001/2002) [quant-ph/0112102, quant-ph/0206084] showed that every two-qubit state violating any $(N,2,2)$ Bell inequality is at least bipartite distillable, linking violation size to distillability.
- Collins–Gisin–Linden–Massar–Popescu (2002) [quant-ph/0106024] and Massar–Pironio–Roland–Gisin (2002) [quant-ph/0205130] gave Bell inequalities for bipartite systems with more than two outcomes per observable.

Pitowsky proved that finding all facets of the general correlation polytope is at least as hard as well-known NP-hard problems, so no efficient algorithm is expected without exploiting the special structure of these polytopes. As of 2026 no closed-form list of facets is known for general $(N,M,K)$, and the problem in its full generality is still open.

A current large-scale effort, Staufenbiel's *Bell Inequalities from Polyhedral Sampling* (arXiv:2604.22859v1), explicitly gives up completeness for speed and reports millions of new classes in scenarios without a full enumeration. This is strong contemporary evidence of progress, but also direct confirmation that the general classification remains open.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 1, pp. 9–14.
- A. Acín, *Distillability, Bell inequalities and multiparticle bound entanglement*, Phys. Rev. Lett. **88**, 027901 (2002); arXiv:quant-ph/0108029.
- A. Acín, V. Scarani, M. M. Wolf, *Violation of Bell's inequalities implies distillability for $N$ qubits*, arXiv:quant-ph/0112102 (2001).
- A. Acín, V. Scarani, M. M. Wolf, *Bell inequalities and distillability in $N$-quantum-bit systems*, arXiv:quant-ph/0206084 (2002).
- J. S. Bell, *On the Einstein Podolsky Rosen Paradox*, Physics **1** (1964).
- D. Bacon and B. F. Toner, *Bell inequalities with communication*, arXiv:quant-ph/0208057 (2002).
- D. Collins, N. Gisin, N. Linden, S. Massar, S. Popescu, *Bell Inequalities for Arbitrarily High-Dimensional Systems*, Phys. Rev. Lett. **88**, 040404 (2002); arXiv:quant-ph/0106024.
- M. Froissart, *Constructive generalization of Bell's inequalities*, Nuovo Cimento B **64**, 241 (1981).
- M. Żukowski and Č. Brukner, *Bell's theorem for general $N$-qubit states*, Phys. Rev. Lett. **88**, 210401 (2002); arXiv:quant-ph/0102039.
- B. S. Tsirelson, *Quantum Analogues to the Bell Inequalities*, J. Sov. Math. **36** (1987); B. S. Tsirelson and L. A. Khalfin, *Quantum/Classical Correspondence in the Light of Bell's Inequalities*, Found. Phys. **22**, 879 (1992).
- W. Dür, *Multipartite bound entangled states that violate Bell's inequality*, Phys. Rev. Lett. **87**, 230402 (2001); arXiv:quant-ph/0107050.
- A. Fine, *Hidden Variables, Joint Probability, and the Bell Inequalities*, Phys. Rev. Lett. **48**, 291 (1982).
- A. Garg and N. D. Mermin, *Farkas's lemma and the nature of reality: Statistical implications of quantum correlations*, Found. Phys. **14**, 1 (1984).
- S. Massar, S. Pironio, J. Roland, B. Gisin, *A Zoology of Bell inequalities resistant to detector inefficiency*, arXiv:quant-ph/0205130 (2002).
- A. Peres, *All the Bell Inequalities*, Found. Phys. **29**, 589 (1999); arXiv:quant-ph/9807017.
- I. Pitowsky, *Quantum Probability — Quantum Logic*, Springer (Berlin), 1989.
- M. Fréchet, *Les Probabilités Associées à un Système d'Événtments Compatibles et Dépendants*, Hermann (Paris), 1940.
- H. H. Schaefer, *Topological Vector Spaces*, Springer (Berlin), 1980.
- I. Pitowsky and K. Svozil, *New optimal tests of quantum nonlocality*, arXiv:quant-ph/0011060 (2000).
- R. F. Werner and M. M. Wolf, *All multipartite Bell correlation inequalities for two dichotomic observables per site*, arXiv:quant-ph/0102024 (2001).
- R. F. Werner and M. M. Wolf, *Bell inequalities and Entanglement*, Quant. Inf. Comp. **1**(3), 1 (2002); arXiv:quant-ph/0107093.
- C. Staufenbiel, *Bell Inequalities from Polyhedral Sampling*, arXiv:2604.22859 (2026 preprint).
