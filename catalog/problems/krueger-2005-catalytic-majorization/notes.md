# Catalytic majorization

## Background

Nielsen's theorem provides a completely explicit criterion for converting one pure bipartite state $A$ into another pure bipartite state $B$ using only LOCC: this is possible iff the Schmidt coefficient vector of (the reduced state of) $A$ is more mixed than that of $B$ in the sense of majorization. Using this criterion, Jonathan and Plenio observed the surprising phenomenon of *catalysis*: there exist pure bipartite states $A$ and $B$ such that $A$ cannot be converted to $B$ by LOCC, and yet $A \otimes C$ can be converted to $B \otimes C$ for a suitable additional entangled state $C$ — which is returned intact at the end of the protocol. The catalyst $C$ thus enables a transformation it does not participate in stoichiometrically. The set of such triples is non-empty but its structure remains mysterious.

Because Nielsen's criterion translates LOCC convertibility of pure bipartite states into a statement about majorization of classical probability vectors (the Schmidt-coefficient vectors), the entire problem of catalysis can be recast in elementary classical terms: characterise the order relation "$p$ majorizes $q$ with a catalyst" on probability vectors. There are several known equivalent characterisations of ordinary majorization (decreasing partial-sum inequalities, doubly stochastic mixing, convex-function expectations); the open problem is to find a comparably handy characterisation of the catalytic version. Multiplicative monotones such as $p \mapsto \sum_i p_i^x$ for $x > 1$ are natural candidates because they behave well under tensor products.

## Status and known progress

The problem is **partially solved**: an explicit characterisation of catalytic majorization in terms of Rényi-type entropies has been established (Klimesh 2007; Turgut 2007), although the resulting criterion is an infinite family of inequalities rather than a finite "partial-sum" check fully analogous to Nielsen's theorem.

- M. A. Nielsen [N; quant-ph/9811053] established the original majorization criterion for LOCC convertibility of pure bipartite states without a catalyst.
- D. Jonathan and M. B. Plenio [JP1; quant-ph/9905071] discovered the phenomenon of entanglement-assisted (catalytic) LOCC conversion and exhibited explicit examples of state pairs $A,B$ where $A \not\to B$ by LOCC but $A \otimes C \to B \otimes C$.
- G. Vidal [V1; quant-ph/9902033] and D. Jonathan and M. B. Plenio [JP2; quant-ph/9903054] gave further results on majorization-based pure-state entanglement manipulation and the role of catalysts.
- G. Vidal, D. Jonathan, M. A. Nielsen [VJN1] (Phys. Rev. A **62**, 012304 (2000)) developed the structural understanding of catalytic transformations.
- M. Nielsen [N2; quant-ph/0008073] extended the analysis of majorization in the context of pure-state entanglement.
- J. Eisert and M. Wilkens [EW1] (Phys. Rev. Lett. **85**, 437–440 (2000)) gave further criteria related to catalysis.
- **Resolution (Klimesh 2007; Turgut 2007).** M. Klimesh, *Inequalities that collectively completely characterize the catalytic majorization relation*, arXiv:0709.3680 (2007), and independently S. Turgut, *Catalytic transformations for bipartite pure states*, J. Phys. A **40**, 12185 (2007), proved that for strictly positive probability vectors $p,q$ of equal sum and equal length, $p$ is catalytically majorized by $q$ (equivalently, $A$ converts to $B$ via LOCC with a catalyst) if and only if the Rényi-type functionals $\sum_i p_i^\alpha$ and $-\sum_i p_i^\alpha$ (for $\alpha > 1$ and $\alpha < 0$ respectively) and the Shannon-entropy-type functional $-\sum_i p_i \log p_i$ satisfy the corresponding inequalities relating $p$ and $q$. This gives a complete characterisation in terms of an infinite family of multiplicative monotones, validating the intuition recorded in the source.
- **Refinements.** Subsequent work by Aubrun and Nechita (Comm. Math. Phys. **278**, 133 (2008)) developed a probabilistic geometric description; Brandão, Horodecki and collaborators related catalytic majorization to second laws of (quantum) thermodynamics (PNAS **112**, 3275 (2015)).

The headline question — a finite, syntactically simple criterion fully analogous to Nielsen's partial-sum inequalities — remains open in that strict form, but the Klimesh/Turgut characterisation is widely regarded as the definitive answer to the original problem.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 4, pp. 23–24.
- M. A. Nielsen, Phys. Rev. Lett. **83**, 436–439 (1999); arXiv:quant-ph/9811053 (1998).
- G. Vidal, Phys. Rev. Lett. **83**, 1046–1049 (1999); arXiv:quant-ph/9902033 (1999).
- D. Jonathan and M. B. Plenio, Phys. Rev. Lett. **83**, 3566–3569 (1999); arXiv:quant-ph/9905071 (2000).
- D. Jonathan and M. B. Plenio, Phys. Rev. Lett. **83**, 1455–1458 (1999); arXiv:quant-ph/9903054 (1999).
- G. Vidal, D. Jonathan, and M. A. Nielsen, Phys. Rev. A **62**, 012304 (2000).
- M. Nielsen, arXiv:quant-ph/0008073 (2000).
- J. Eisert and M. Wilkens, Phys. Rev. Lett. **85**, 437–440 (2000).
- G. H. Hardy, J. E. Littlewood, and G. Pólya, *Inequalities*, Cambridge University Press (1934).
- A. W. Marshall and I. Olkin, *Inequalities: Theory of Majorization and Its Applications*, Academic Press (1979).
- R. Bhatia, *Matrix Analysis*, Springer (1996).
- M. Klimesh, *Inequalities that collectively completely characterize the catalytic majorization relation*, arXiv:0709.3680 (2007).
- S. Turgut, *Catalytic transformations for bipartite pure states*, J. Phys. A: Math. Theor. **40**, 12185 (2007).
- G. Aubrun and I. Nechita, *Catalytic majorization and $\ell_p$ norms*, Comm. Math. Phys. **278**, 133 (2008); arXiv:quant-ph/0702153.
- F. G. S. L. Brandão, M. Horodecki, N. Ng, J. Oppenheim, S. Wehner, *The second laws of quantum thermodynamics*, Proc. Natl. Acad. Sci. USA **112**, 3275 (2015); arXiv:1305.5278.
