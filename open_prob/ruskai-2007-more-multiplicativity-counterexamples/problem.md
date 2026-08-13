# More counterexamples to the multiplicativity conjecture (eq. 24)

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (quantum channels) |
| $\lVert M\rVert_p$ | Schatten $p$-norm, $\lVert M\rVert_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\nu_p(\Phi)=\inf_\gamma\lVert\Phi(\gamma)\rVert_p$ in source notation (sup over inputs of the output $p$-norm) |
| $S(\rho)$ | von Neumann entropy, $-\operatorname{Tr}(\rho\log\rho)$ |
| $S_{\min}(\Phi)$ | Minimum output entropy, $\inf_\gamma S(\Phi(\gamma))$ |
| $S^p(\gamma)$ | Rényi entropy, $S^p(\gamma)\equiv\tfrac{1}{p-1}\log\operatorname{Tr}\gamma^p$ |
| $S^p_{\min}(\Phi)$ | $\inf_\gamma S^p(\Phi(\gamma))$ |
| WH channel | Werner–Holevo channel |
| $p_c$ | Hypothesized critical $p$ at which multiplicativity might fail |

## Background

A *quantum channel* is a completely positive trace-preserving (CPT) linear map between matrix algebras. The Schatten $p$-norm of an output, $\|\Phi(\gamma)\|_p=(\operatorname{Tr}|\Phi(\gamma)|^p)^{1/p}$, is a measure of output purity. Its maximum
$$\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$$
is the *maximal output $p$-norm*. The multiplicativity conjecture, attributed to Amosov, Holevo, and Werner, is the statement
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for all CPT maps $\Phi,\Omega$ and a relevant range of $p$. In Rényi form, eq. (24) is equivalent to
$$S^p_{\min}(\Phi\otimes\Omega)=S^p_{\min}(\Phi)+S^p_{\min}(\Omega), \tag{26}$$
and as $p\to 1$ this reduces to the additivity conjecture for minimal output entropy,
$$S_{\min}(\Phi\otimes\Omega)=S_{\min}(\Phi)+S_{\min}(\Omega), \tag{23}$$
which is in turn known by Shor's reduction to be globally equivalent to the additivity of Holevo capacity and several entanglement-of-formation conjectures.

By summer 2007, the only known counterexample to (24) was Werner and Holevo's WH channel, which fails (24) for $p>4.79$ and only mildly perturbed variants. Some authors had conjectured that (24) holds for $1\le p\le 2$, and more generally that if it holds on $1<p<p_c$ then counterexamples should appear for $p>p_c$ arbitrarily close to $p_c$. Problem 11 asks for *more* counterexamples and what they reveal about the conjectured "safe" range.

## Formal statement

**Problem 11.** Find additional counterexamples — beyond the Werner–Holevo channel and its small perturbations — to the multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega), \tag{24}$$
holding for a range of $p>1$. Determine, on the basis of such counterexamples, whether the conjecture is true for $1\le p\le 2$.

## Status and known progress

This problem has been resolved in the negative.

- A. Winter (July 2007, *The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$*, arXiv:0707.0402) solved Problem 11 by constructing counterexamples to (24) for every $p>2$, using random unitary channels of growing dimension. As stated in Section 5.6 of the source, Winter's approach failed at $p=2$ and initially seemed to support multiplicativity in $1<p\le 2$.
- Soon after, P. Hayden (*The maximal $p$-norm multiplicativity conjecture is false*, arXiv:0707.3291) extended the counterexamples to all $1<p<2$, and Winter subsequently closed the case $p=2$. Together these works disprove (24) for every $p>1$.
- Hayden's analysis indicated that the additivity conjecture (23) at $p=1$ still held for his channel constructions and he suggested attacking it by establishing (26) for $p<1$. King (announcement at AMS–PTM, 2 Aug 2007) reported that the multiplicativity proofs for entanglement-breaking, unital qubit, and depolarizing channels extend to $0<p<1$.
- M. B. Hastings (*Nature Physics* 5, 255 (2009)) constructed counterexamples to the additivity of minimal output entropy at $p=1$, eq. (23), thus disproving the additivity conjecture in general.

Problem 11 is therefore solved (negatively) as a search-for-counterexamples task: counterexamples exist for every $p>1$, including in the originally conjectured "safe" range $1<p\le 2$. The underlying additivity conjecture (23) has also been disproved.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 11, p. 12.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
- G. G. Amosov, A. S. Holevo, and R. F. Werner, "On Some Additivity Problems in Quantum Information Theory," *Problems in Information Transmission* **36**, 305–313 (2000). math-ph/0003002.
- P. W. Shor, "Equivalence of Additivity Questions in Quantum Information Theory," *Commun. Math. Phys.* **246**, 453–472 (2004). quant-ph/0305035.
- C. King, "Maximal $p$-norms of entanglement breaking channels," *Quantum Information and Computation* **3**, 186–190 (2003).
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
- M. Fukuda, "Simplification of additivity conjecture in quantum information theory," arXiv:quant-ph/0608010.
