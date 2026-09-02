# Do all multiplicativity counter-examples have non-negative CB entropy and/or zero coherent information?

## Background

Devetak, Junge, King and Ruskai (*Commun. Math. Phys.* 266 (2006), 37-63; arXiv:quant-ph/0506196) introduced a notion of completely-bounded (CB) minimal output entropy of a quantum channel and proved that multiplicativity of CB $p$-norms implies an additivity result for ordinary minimal output entropy. The sign of the CB entropy and, equivalently for maximally entangled inputs, the sign of the coherent information
$$I_{\rm coh}(\rho,\Phi) \;=\; S[\Phi(\rho)]-S[\Phi^C(\rho)]$$
control how much entanglement a channel "preserves". Entanglement-breaking (EB) channels have $I_{\rm coh}(\rho,\Phi)\le 0$ for every input and are known to satisfy multiplicativity (King 2003, arXiv:quant-ph/0301050).

A striking observation in the immediate aftermath of the Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291) counter-examples is that, although these channels are not EB, the maximally entangled input that achieves the multiplicativity violation has *positive* CB entropy (equivalently *negative* coherent information). The Werner-Holevo channel itself has positive CB entropy except in the boundary dimension $d=3$, where it is exactly zero. Thus the known counter-examples to (24) for $p>2$ are channels that "barely fail" to be entanglement-breaking: they preserve very little entanglement — not even enough to distil a single EPR pair in the sense of Horodecki-Oppenheim-Winter (state merging, *Commun. Math. Phys.* 269 (2007), 107-136).

This raises the structural question of whether *all* counter-examples to (24) must lie in this near-EB regime — i.e. whether positivity of the CB entropy (resp. non-positivity of the coherent information at the optimal input) is a *necessary* feature of any multiplicativity violation. A positive answer would be a strong qualitative constraint on the geometry of channels witnessing the failure of (24), and would suggest that the only route to violating multiplicativity is to be "almost entanglement-breaking".

## Status and known progress

- For $p>2$: Winter's examples (arXiv:0707.0402) and the WH examples have non-negative CB entropy (positive except at the boundary $d=3$ for WH, where it vanishes), consistent with an affirmative answer.
- For $p<2$, Hayden (arXiv:0707.3291) and (after the problem was posed) Hastings (*Nature Physics* 5 (2009), 255-257; arXiv:0809.3972, which disproved the $p=1$ additivity conjecture) constructed random-channel counter-examples; their CB entropy / coherent information properties were not the focus of those works and remain less systematically catalogued.
- No general theorem either confirming or refuting the conjecture in Problem 21 across all $p$ is known.
- Related: Devetak, Junge, King, Ruskai ("Multiplicativity of completely bounded $p$-norms implies a new additivity result", *Commun. Math. Phys.* 266 (2006), 37-63; arXiv:quant-ph/0506196) provide the foundational link between CB entropy and additivity, but do not settle the converse direction asked here.
- The problem appears to remain open in the form stated.
- **Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 21, p. 16. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- I. Devetak, M. Junge, C. King, M. B. Ruskai, "Multiplicativity of completely bounded $p$-norms implies a new additivity result", *Commun. Math. Phys.* 266 (2006), 37-63; arXiv:quant-ph/0506196.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$", arXiv:0707.0402 (2007).
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false", arXiv:0707.3291 (2007).
- R. F. Werner, A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels", *J. Math. Phys.* 43 (2002), 4353-4357.
- M. Horodecki, J. Oppenheim, A. Winter, "Quantum state merging and negative information", *Commun. Math. Phys.* 269 (2007), 107-136.
- M. Horodecki, J. Oppenheim, A. Winter, "Partial quantum information", *Nature* 436 (2005), 673-676; quant-ph/0505062.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257; arXiv:0809.3972.
- C. King, "Maximal $p$-norms of entanglement breaking channels", *Quantum Inf. Comput.* 3, no. 2 (2003), 186-190.
