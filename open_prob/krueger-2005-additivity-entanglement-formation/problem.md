# Additivity of Entanglement of Formation

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | A density operator on a bipartite Hilbert space $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho_i$ | Pure-state (or general) constituents in a convex decomposition of $\rho$ |
| $r_i$ | Non-negative weights summing to $1$ in a convex decomposition |
| $\rho\vert A$ | Restriction of $\rho$ to Alice's subsystem (partial trace over Bob) |
| $S(\sigma)$ | Von Neumann entropy $-\mathrm{tr}(\sigma \log \sigma)$ |
| $E_F(\rho)$ | Entanglement of formation, $\inf\bigl\{\sum_i r_i S(\rho_i\vert A) \mid \sum_i r_i \rho_i = \rho\bigr\}$ |
| $\rho^{(1)}, \rho^{(2)}$ | Two bipartite density operators on possibly different Hilbert spaces |
| $\rho^{(1)} \otimes \rho^{(2)}$ | Their tensor product, regarded as a bipartite state on the combined Alice and Bob spaces |
| $\Phi$ | A quantum channel (completely positive trace preserving map) |
| $S_{\min}(\Phi)$ | Minimal output entropy of $\Phi$, $\inf_\rho S(\Phi(\rho))$ |
| $\chi^*(\Phi)$ | Holevo capacity of $\Phi$ |
| LOCC | Local operations and classical communication |

## Background

The *entanglement of formation* $E_F$, introduced by Bennett, DiVincenzo, Smolin and Wootters [BD96; quant-ph/9604024], is one of the central measures of bipartite entanglement. It is defined for any bipartite density operator $\rho$ as

$$E_F(\rho) = \inf\Bigl\{\;\sum_i r_i\,S(\rho_i|A)\;\;\Big|\;\;\sum_i r_i \rho_i = \rho\,\Bigr\},$$

where $S(\cdot)$ is the von Neumann entropy, $\rho_i|A$ denotes the restriction of $\rho_i$ to Alice's subsystem, and $\{r_i, \rho_i\}$ ranges over all convex decompositions of $\rho$. Because $S$ is concave, the infimum is always attained on a pure-state decomposition, and the definition is usually given in this restricted form.

The motivation for studying additivity is that any operationally meaningful "resource" measure should be additive on independently prepared copies: if Alice and Bob have a bipartite state $\rho^{(1)}$ from one source and an independent bipartite state $\rho^{(2)}$ from another (treating the two Alice subsystems together and the two Bob subsystems together as one bipartite system), then preparing the pair should cost exactly the sum of the individual costs. Plugging optimal individual decompositions into the joint variational expression gives the easy direction

$$E_F(\rho^{(1)} \otimes \rho^{(2)}) \;\le\; E_F(\rho^{(1)}) + E_F(\rho^{(2)}).$$

The non-trivial — and longstanding — question is whether equality always holds. The status of this additivity conjecture had become tied, by a chain of equivalences due to Shor, to the additivity conjectures for minimum output entropy and the Holevo capacity of quantum channels. This makes it a focal point of quantum Shannon theory.

## Formal statement

Show that for any pair of bipartite density operators $\rho^{(1)}$ and $\rho^{(2)}$ (defined on possibly different bipartite Hilbert spaces) one has

$$E_F\bigl(\rho^{(1)} \otimes \rho^{(2)}\bigr) \;=\; E_F\!\bigl(\rho^{(1)}\bigr) + E_F\!\bigl(\rho^{(2)}\bigr).$$

The inequality $E_F(\rho^{(1)} \otimes \rho^{(2)}) \le E_F(\rho^{(1)}) + E_F(\rho^{(2)})$ is elementary (by tensoring the optimal pure-state decompositions); the open problem asks whether equality always holds.

The source records this problem as *equivalent to Problem 10* of the same collection.

## Status and known progress

**Solved (disproved).** The additivity of entanglement of formation is now known to be *false* in general.

P. W. Shor proved in 2003 that several additivity questions are equivalent: additivity of the minimum output entropy $S_{\min}$ of all channels, additivity of the Holevo capacity $\chi^{*}$ of all channels, additivity of the entanglement of formation $E_F$ for all bipartite states, and the strong superadditivity of $E_F$ (P. W. Shor, *Equivalence of additivity questions in quantum information theory*, Commun. Math. Phys. **246**, 453–472 (2004); arXiv:quant-ph/0305035). Hence a single counterexample to any one of these statements refutes all of them simultaneously.

In 2008, M. B. Hastings disproved additivity of the minimum output entropy by a randomised construction of two channels for which

$$S_{\min}(\Phi \otimes \bar{\Phi}) \;<\; S_{\min}(\Phi) + S_{\min}(\bar{\Phi})$$

(M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255 (2009); arXiv:0809.3972). By Shor's equivalences, this Hastings violation immediately implies the existence of bipartite density operators $\rho^{(1)}, \rho^{(2)}$ for which

$$E_F\!\bigl(\rho^{(1)} \otimes \rho^{(2)}\bigr) \;<\; E_F\!\bigl(\rho^{(1)}\bigr) + E_F\!\bigl(\rho^{(2)}\bigr),$$

so the additivity conjecture for entanglement of formation is false in general. Subsequent work has produced explicit (though not low-dimensional) examples, sharpened bounds on the size of the gap, and constructed counterexamples in lower dimensions and with stronger structural properties (see e.g. Brandão–Horodecki; Belinschi–Collins–Nechita; Aubrun–Szarek–Werner; Fukuda–King–Moser).

Prior partial positive results (now superseded by the general counterexample but still relevant for restricted classes):

- G. Vidal, W. Dür, and J. I. Cirac [VDC02; quant-ph/0112131] (*Entanglement cost of mixed states*, Phys. Rev. Lett. **89**, 027901 (2002)) proved additivity of entanglement of formation for several explicit families of states.
- Earlier work established additivity for many special classes — e.g. for states of the form $\rho \otimes \sigma$ with one factor separable, for Werner and isotropic states, and for states with certain symmetries — without resolving the general question.

The TOC of the source records the "last progress" date of this problem as 2004-11-11; the Hastings refutation (2008/9) post-dates the source paper but settles the conjecture decisively in the negative.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 7, pp. 28–29.
- C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, and W. K. Wootters, *Mixed-state entanglement and quantum error correction*, Phys. Rev. A **54**, 3824 (1996); arXiv:quant-ph/9604024.
- G. Vidal, W. Dür, and J. I. Cirac, *Entanglement cost of mixed states*, Phys. Rev. Lett. **89**, 027901 (2002); arXiv:quant-ph/0112131.
- P. W. Shor, *Equivalence of additivity questions in quantum information theory*, Commun. Math. Phys. **246**, 453–472 (2004); arXiv:quant-ph/0305035.
- M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255 (2009); arXiv:0809.3972.
