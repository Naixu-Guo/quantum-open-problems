# Secret Key from All Entangled States

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of Alice and Bob in a bipartite quantum system |
| $\rho_{AB}$ | A bipartite quantum state (density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$) |
| LOCC | Local operations and classical communication |
| Entangled state | A bipartite state that is not separable, i.e. not a convex combination of product states |
| PPT | Positive partial transpose (a property used to detect/define bound entanglement) |
| Bound entangled state | An entangled state from which no pure entanglement (singlets) can be distilled by LOCC |
| Secret key | A pair of perfectly correlated classical bits held by Alice and Bob and uncorrelated with any eavesdropper Eve |
| $K_D(\rho_{AB})$ | The distillable secret-key rate of $\rho_{AB}$ (bits of secret key extractable per copy by LOCC + public discussion, asymptotically and in the worst case over purifications to Eve) |
| $E_D(\rho_{AB})$ | The distillable entanglement of $\rho_{AB}$ |

## Background

A central operational task in quantum information is the extraction of a shared secret key between two distant parties, Alice and Bob, from many copies of a bipartite quantum state $\rho_{AB}$ by means of local operations and classical communication (LOCC). The eavesdropper Eve is assumed, in the worst case, to hold the purifying system of $\rho_{AB}$; her knowledge after Alice and Bob's protocol must be (asymptotically) zero. The achievable rate is the distillable secret-key rate $K_D(\rho_{AB})$.

A historically natural strategy is: first distill pure singlet pairs from $\rho_{AB}$ using entanglement-distillation protocols, then measure them in conjugate bases (as in BB84/Ekert) to obtain a secret key. This route equates secret-key extraction with the distillation of pure entanglement, and so $K_D(\rho_{AB})\ge E_D(\rho_{AB})$. Some entangled states, however, are *bound entangled*: they are entangled, but $E_D(\rho_{AB})=0$ — no pure singlets can be distilled by any LOCC protocol. The straightforward "distill then measure" approach therefore yields zero key for such states.

Strikingly, Horodecki, Horodecki, Horodecki and Oppenheim (2003) constructed bound entangled states from which a positive amount of secret key can nevertheless be extracted directly, without going through distilled singlets. This shows that $K_D$ can be strictly larger than $E_D$ and isolates secret-key extractability as a distinct operational property of bipartite quantum states. The problem posed here asks how universal this phenomenon is: does *every* entangled state — including states arbitrarily close to the separable boundary — admit some nonzero rate of secret-key extraction? Equivalently, is the operational distinction between separable and entangled states the same as the distinction between states with $K_D(\rho_{AB})=0$ and $K_D(\rho_{AB})>0$? An affirmative answer would identify entanglement, in a tight operational sense, with the resource that powers quantum key distribution.

## Formal statement

Let $\rho_{AB}$ be any entangled bipartite quantum state on a finite-dimensional Hilbert space $\mathcal{H}_A\otimes\mathcal{H}_B$. Decide whether
$$K_D(\rho_{AB}) \;>\; 0 \qquad \text{for every entangled } \rho_{AB} ,$$
i.e. whether secret keys can be generated from every bipartite entangled state by LOCC plus public classical communication (with eavesdropper holding the purifying system).

## Status and known progress

**Status: open.** Positive-key subclasses are known, including PPT bound-entangled states, but the universal yes-or-no statement has not been resolved. Under the audit taxonomy, examples and subclasses count as progress but do not make a single universal question "partially solved."

- The motivating result of Horodecki, Horodecki, Horodecki and Oppenheim (2005), *Secure key from bound entanglement* (Phys. Rev. Lett. **94**, 160502; arXiv:quant-ph/0309110, posted 2003 and published 2005), exhibits explicit bound entangled states with strictly positive $K_D$. This shows that key extractability is *not* equivalent to distillability of pure entanglement.
- A subsequent series of works by the same authors (Horodecki–Horodecki–Horodecki–Oppenheim, *General paradigm for distilling classical key from quantum states*, IEEE Trans. Inf. Theory **55**, 1898 (2009); arXiv:quant-ph/0506189) developed the formalism of "private states" / "pdits" and produced many examples of bound entangled states with positive key rate, including PPT classes parametrised in continuous families.
- It is also known that distillable entanglement is a lower bound on secret-key rate, $E_D(\rho_{AB})\le K_D(\rho_{AB})$, and that the upper bound $K_D(\rho_{AB})\le E_R^\infty(\rho_{AB})$ holds with the regularised relative entropy of entanglement on the right (Christandl, Winter 2004; Horodecki et al. 2005).
- Despite this body of evidence supporting positive answers for ever-broader classes of states, no proof has been given that *every* entangled state has $K_D>0$. The general question — whether entanglement and positive distillable key rate coincide as operational properties — remains open as of 2026.
- A 2026 analysis of the cost of quantum secret key still states its conclusions conditionally on the absence of entangled zero-key states and explains that the results remain valid if such states are later found. This is direct current evidence that the dichotomy remains unsettled.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 24, p. 64 (contact: P. Horodecki, 15 Mar 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- K. Horodecki, M. Horodecki, P. Horodecki, J. Oppenheim, *Secure key from bound entanglement*, Phys. Rev. Lett. **94**, 160502 (2005); arXiv:quant-ph/0309110 (2003).
- K. Horodecki, M. Horodecki, P. Horodecki, J. Oppenheim, *General paradigm for distilling classical key from quantum states*, IEEE Trans. Inf. Theory **55**, 1898 (2009); arXiv:quant-ph/0506189.
- M. Christandl and A. Winter, *"Squashed entanglement": an additive entanglement measure*, J. Math. Phys. **45**, 829 (2004); arXiv:quant-ph/0308088.
- K. Horodecki, L. Sikorski, S. Das, M. M. Wilde, *Cost of quantum secret key*, Quantum **10**, 2098 (2026); arXiv:2402.17007.
