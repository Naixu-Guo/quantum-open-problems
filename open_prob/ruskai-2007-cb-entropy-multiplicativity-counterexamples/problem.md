# Do all multiplicativity counter-examples have non-negative CB entropy and/or zero coherent information?

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi$ | quantum channel (CPT map) |
| $\Phi^C$ | complementary channel of $\Phi$ |
| $S(\rho)$ | von Neumann entropy of state $\rho$, $S(\rho)=-\operatorname{Tr}\rho\log\rho$ |
| $S^p(\rho)$ | Renyi $p$-entropy, $\tfrac{1}{p-1}\log\operatorname{Tr}\rho^p$ for $p\ne 1$ |
| $I_{\rm coh}(\rho,\Phi)$ | coherent information, $I_{\rm coh}(\rho,\Phi)=S[\Phi(\rho)]-S[\Phi^C(\rho)]$ |
| $S_{\rm CB}(\Phi)$ | completely-bounded (CB) entropy of the channel $\Phi$, as defined in Devetak-Junge-King-Ruskai (CMP 266, 2006) |
| EB | entanglement-breaking channel |
| WH | Werner-Holevo channel (Werner-Holevo 2002) |
| eq. (24) | multiplicativity assertion $\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\nu_p(\Omega)$ |

## Background

Devetak, Junge, King and Ruskai (*Commun. Math. Phys.* 266 (2006), 37-63; arXiv:quant-ph/0506196) introduced a notion of completely-bounded (CB) minimal output entropy of a quantum channel and proved that multiplicativity of CB $p$-norms implies an additivity result for ordinary minimal output entropy. The sign of the CB entropy and, equivalently for maximally entangled inputs, the sign of the coherent information
$$I_{\rm coh}(\rho,\Phi) \;=\; S[\Phi(\rho)]-S[\Phi^C(\rho)]$$
control how much entanglement a channel "preserves". Entanglement-breaking (EB) channels have $I_{\rm coh}(\rho,\Phi)\le 0$ for every input and are known to satisfy multiplicativity (King 2003, arXiv:quant-ph/0301050).

A striking observation in the immediate aftermath of the Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291) counter-examples is that, although these channels are not EB, the maximally entangled input that achieves the multiplicativity violation has *positive* CB entropy (equivalently *negative* coherent information). The Werner-Holevo channel itself has positive CB entropy except in the boundary dimension $d=3$, where it is exactly zero. Thus the known counter-examples to (24) for $p>2$ are channels that "barely fail" to be entanglement-breaking: they preserve very little entanglement — not even enough to distil a single EPR pair in the sense of Horodecki-Oppenheim-Winter (state merging, *Commun. Math. Phys.* 269 (2007), 107-136).

This raises the structural question of whether *all* counter-examples to (24) must lie in this near-EB regime — i.e. whether positivity of the CB entropy (resp. non-positivity of the coherent information at the optimal input) is a *necessary* feature of any multiplicativity violation. A positive answer would be a strong qualitative constraint on the geometry of channels witnessing the failure of (24), and would suggest that the only route to violating multiplicativity is to be "almost entanglement-breaking".

## Formal statement

**Problem 21 (Ruskai 2007).** Do *all* counter-examples to multiplicativity (24) of the maximal output $p$-norm have non-negative CB entropy and/or zero (i.e. non-positive at the violating input) coherent information?

Equivalently: does every quantum channel $\Phi$ for which there exists $\Omega$ and $p\ne 1$ with $\nu_p(\Phi\otimes\Omega)\ne\nu_p(\Phi)\nu_p(\Omega)$ necessarily satisfy
$$S_{\rm CB}(\Phi) \;\ge\; 0$$
and/or admit a multiplicativity-violating maximally entangled input $\rho$ with $I_{\rm coh}(\rho,\Phi)\le 0$? The question is of particular interest for $p<2$.

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
