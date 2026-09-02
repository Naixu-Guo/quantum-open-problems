# Stronger Bell inequalities for Werner states?

## Background

Werner states are the family of bipartite density operators that are invariant under all local unitaries of the form $U\otimes U$, with $U$ acting on each subsystem. In dimension $d$ on each side they form a one-parameter family that interpolates between a maximally entangled (anti-symmetric) projector and the symmetric projector; equivalently they can be written as noisy versions of a singlet. They are the canonical testbed for separating different notions of "non-classicality": a Werner state can be entangled and yet admit a local hidden variable (LHV) model for projective measurements, demonstrating that entanglement and Bell-non-locality are distinct resources.

For two-qubit Werner states with singlet fraction $F$, the CHSH inequality is violated iff $F > (1+1/\sqrt 2)/2$, equivalently iff the "Werner parameter" $p$ exceeds $1/\sqrt 2$. Below this threshold no two-setting two-outcome Bell inequality of the CHSH type is violated. A natural and longstanding question — going back to Gisin and Peres in the 1990s — is whether there exist *other* Bell inequalities (with more measurement settings, more outcomes, or more parties) that detect non-locality of Werner states in a strictly larger range of $p$ than CHSH does. Such inequalities would imply that the CHSH threshold for Werner states is not the true non-locality threshold and would shrink the gap between known LHV models for Werner states (Werner, Barrett, Hirsch–Quintino–Vértesi, etc.) and the region of established non-locality.

Recently Collins and Gisin (2003) found a two-qubit Bell inequality (the so-called $I_{3322}$) inequivalent to CHSH, and exhibited quantum states violating $I_{3322}$ but not CHSH. However, for Werner states their inequality is *weaker* than CHSH: the range of Werner parameters violating $I_{3322}$ is smaller than the range violating CHSH. The problem asks whether one can do better.

## Status and known progress

**Status: solved affirmatively.** Vértesi (2008) constructed Bell inequalities violated by two-qubit Werner states for $p>0.7056$, strictly below the CHSH threshold $1/\sqrt{2}\approx0.7071$.

- **Two-qubit CHSH threshold.** Two-qubit Werner states violate CHSH iff $p > 1/\sqrt 2$ (Horodecki–Horodecki–Horodecki 1995). The corresponding singlet fraction threshold is $F > (1+1/\sqrt 2)/2$.
- **Collins–Gisin $I_{3322}$ (2003).** Cited in the source: the inequality is inequivalent to CHSH and reveals non-locality of states that CHSH cannot, but its Werner-state range is *smaller* than that of CHSH. So $I_{3322}$ is *not* an example of the kind sought.
- **Resolution (Vértesi, 2008).** A family with many binary settings gives an explicit local bound and a Werner-state quantum value that yields the threshold $p>0.7056$. Since $0.7056<1/\sqrt 2$, this is exactly the stronger-than-CHSH example requested by the source problem.
- **Later bounds.** Local-hidden-variable models and numerical improvements continue to narrow the exact Werner-state nonlocality threshold. Determining that optimal threshold is a different question from the existence question posed here.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 19 on p. 54; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- [CG] D. Collins, N. Gisin, *A Relevant Two Qubit Bell Inequality Inequivalent to the CHSH Inequality*, J. Phys. A 37, 1775 (2004); arXiv:quant-ph/0306129 (2003).
- R. F. Werner, *Quantum states with Einstein–Podolsky–Rosen correlations admitting a hidden-variable model*, Phys. Rev. A 40, 4277 (1989).
- J. Barrett, *Nonsequential positive-operator-valued measurements on entangled mixed states do not always violate a Bell inequality*, Phys. Rev. A 65, 042302 (2002); arXiv:quant-ph/0107045.
- F. Hirsch, M. T. Quintino, T. Vértesi, M. Navascués, N. Brunner, *Better local hidden variable models for two-qubit Werner states and an upper bound on the Grothendieck constant $K_G(3)$*, Quantum 1, 3 (2017); arXiv:1609.06114.
- T. Vértesi, *More efficient Bell inequalities for Werner states*, Phys. Rev. A **78**, 032112 (2008); arXiv:0806.0096.
