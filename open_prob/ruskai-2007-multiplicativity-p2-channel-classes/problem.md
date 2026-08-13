# Classes of channels for which multiplicativity can be proved at $p=2$

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$, $\gamma$ | Density matrices on a finite-dimensional Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (quantum channels) |
| $\lVert M\rVert_p$ | Schatten $p$-norm, $\lVert M\rVert_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\sup_\gamma\lVert\Phi(\gamma)\rVert_p$ |
| WH channel | Werner–Holevo channel |
| Mutually unbiased bases (MUB) | Orthonormal bases $\{\lvert e_j^{(a)}\rangle\}$ such that $\lvert\langle e_j^{(a)}\vert e_k^{(b)}\rangle\rvert^2=1/d$ for $a\ne b$ |
| Depolarized channel | $\Phi_{x,\epsilon}=x\mathcal I+(1-x)\mathcal M_\epsilon$ for some $\mathcal M_\epsilon$ near a fully depolarizing map |

## Background

A central conjecture in quantum information theory of the 2000s was the *multiplicativity of the maximal output $p$-norm*:
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for CPT maps $\Phi,\Omega$ and an appropriate range of $p$, where $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$. By the Rényi formulation, the $p\to 1$ limit recovers additivity of minimum output entropy, equivalent (via Shor's reductions) to additivity of Holevo capacity and several entanglement-of-formation conjectures.

The Werner–Holevo channel violates (24) for large $p$, but for many natural classes of channels the conjecture was confirmed in the case $p=2$ using explicit Lieb–Thirring-type inequalities or representation-theoretic arguments. Examples included unital qubit channels (King), depolarizing channels (King), entanglement-breaking channels (Shor), and most recently the depolarized WH channel: Michalakis (2007, arXiv:0707.1722) proved multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels. Michalakis's approach is notable because it does not rely on positivity of matrix entries used in earlier extensions (King, Nathanson, Ruskai), and so may apply more broadly.

Section 5.4 of Ruskai's survey poses Problem 12, asking which broad classes of channels admit a proof of (24) at the special value $p=2$.

## Formal statement

**Problem 12.** For what classes of quantum channels $\Phi,\Omega$ can the multiplicativity identity
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
be proved at $p=2$?

## Status and known progress

Problem 12 is a research-program question. Substantial partial progress was already known at the time of writing and has been extended since:

- C. King, "Additivity for unital qubit channels," *J. Math. Phys.* **43**, 4641–4653 (2002): (24) holds for all unital qubit channels for $1\le p\le \infty$.
- C. King, "The capacity of the quantum depolarizing channel," *IEEE Trans. Inform. Theory* **49**, 221–229 (2003): (24) holds for depolarizing channels in any dimension for $1\le p\le \infty$.
- P. Shor, "Additivity of the classical capacity of entanglement-breaking quantum channels," *J. Math. Phys.* **43**, 4334–4340 (2002), and C. King, "Maximal $p$-norms of entanglement breaking channels," QIC **3**, 186–190 (2003): (24) holds for entanglement-breaking channels.
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007): (24) at $p=2$ for depolarized WH channels, by an approach not relying on positive entries.
- M. Nathanson and M. B. Ruskai (Pauli diagonal channels constant on axes; quant-ph/0611106) and C. King with Nathanson and Ruskai (Multiplicativity results for entrywise positive maps; quant-ph/0409181) provide multiplicativity at $p=2$ for additional structured families of channels.
- C. King (announcement, AMS–PTM Warsaw 2 Aug 2007) extended multiplicativity proofs for entanglement-breaking channels to $0<p<1$.

After Ruskai's survey, the broader multiplicativity conjecture (24) at $p\ne 2$ was disproved: Winter (arXiv:0707.0402) found counterexamples for $p>2$; Hayden (arXiv:0707.3291) extended these to $1<p<2$, with Winter then covering $p=2$ (a counterexample for general channels at $p=2$). Hastings (*Nature Physics* 5, 255 (2009)) disproved additivity of minimal output entropy at $p=1$, eq. (23). However these counterexamples occur for *random* channel constructions; the question of identifying *classes* of channels on which (24) does hold at $p=2$ — Problem 12's actual content — remains a live research program. No exhaustive classification is known.

- Dierckx, Fannes and Vandenplas (2008) proved $p=2$ multiplicativity when one factor is a PPT-inducing channel and the other factor is arbitrary. This adds a broad post-survey class and includes channels whose Choi matrices are separable or bound entangled.
- **Status: partially solved.** The problem is an open-ended classification program. Many nontrivial positive classes are known, but there is no exhaustive characterisation, and general multiplicativity at $p=2$ is false.

**Last verified:** 2026-08-12.

## Bibliography

- B. Dierckx, M. Fannes, C. Vandenplas, *Additivity of the Rényi entropy of order 2 for positive-partial-transpose-inducing channels*, Phys. Rev. A **77**, 060302(R) (2008); arXiv:0803.0479.

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 12, p. 13.
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007).
- C. King, "Additivity for unital qubit channels," *J. Math. Phys.* **43**, 4641–4653 (2002).
- C. King, "The capacity of the quantum depolarizing channel," *IEEE Trans. Inform. Theory* **49**, 221–229 (2003).
- C. King, "Maximal $p$-norms of entanglement breaking channels," *Quantum Information and Computation* **3**, 186–190 (2003).
- P. Shor, "Additivity of the classical capacity of entanglement-breaking quantum channels," *J. Math. Phys.* **43**, 4334–4340 (2002).
- C. King, M. Nathanson and M. B. Ruskai, "Multiplicativity results for entrywise positive maps," *Lin. Alg. Appl.* **404**, 367–379 (2005). quant-ph/0409181.
- M. Nathanson and M. B. Ruskai, "Pauli Diagonal Channels Constant on Axes," *J. Phys. A: Math. Theor.* **40**, 8171–8204 (2007). quant-ph/0611106.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
