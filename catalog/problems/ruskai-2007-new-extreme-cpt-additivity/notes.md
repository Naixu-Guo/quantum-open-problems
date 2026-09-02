# New classes of extreme CPT maps with provable additivity/multiplicativity

## Background

The set of completely positive trace-preserving (CPT) maps $\Phi:M_{d_A}\to M_{d_B}$ is convex; its extreme points are precisely the CPT maps whose Kraus representations $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$ have the operators $\{A_j^{\dagger}A_k\}$ linearly independent (Choi). The Choi rank of an extreme CPT map is at most $d_A$, but mixtures and limits of extreme points fill in the closure $\overline{\mathcal E}(d_A,d_B)$.

The additivity and multiplicativity conjectures
$$S_{\min}(\Phi\otimes\Omega)=S_{\min}(\Phi)+S_{\min}(\Omega) \tag{23}$$
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for CPT maps are central in quantum information theory. Although convexity alone does not reduce the problem to extreme points, the *complementary channel* construction provides a partial reduction: for a CPT map $\Phi:M_{d_A}\to M_{d_B}$ with complement $\Phi^C:M_{d_A}\to M_{d_E}$ of Choi rank $d_E$, whenever $d_B\le d_A$ the complement belongs to the class of generalized extreme points (in $\overline{\mathcal E}(d_A,d_B)$). Therefore, results in [25, 34] of the source imply that proving additivity for all maps in $\overline{\mathcal E}(d_1,d_2)$ would yield it for all CPT maps with $d_B\le d_A$. Combined with Shor's channel extensions [48] establishing equivalence of various additivity results that only increase $d_A$, additivity for tensor products of all extreme maps with $d_A\ge d_B$ would imply additivity for all maps with $d_A=d_B$.

Section 5.5 of Ruskai's survey identifies this reduction and asks for further classes of extreme CPT maps on which (23)/(24) can be proven. Problem 14 is exactly this call.

## Status and known progress

Problem 14 is an open research-program question without a single resolution; what is known consists of specific extreme-map classes for which additivity and/or multiplicativity have been established. Highlights include:

- C. King (2002, 2003): unital qubit channels and depolarizing channels satisfy (24) for $1\le p\le\infty$, hence (23).
- P. Shor (2002) and C. King (2003): entanglement-breaking (EB) channels satisfy (23) and (24). King (announcement AMS–PTM Warsaw 2 Aug 2007) extended the EB proof to $0<p<1$.
- C. King, M. Nathanson and M. B. Ruskai (2005, quant-ph/0409181): multiplicativity at $p=2$ for entrywise positive maps.
- M. Nathanson and M. B. Ruskai (quant-ph/0611106): multiplicativity for Pauli-diagonal channels constant on axes, including extreme classes built from mutually unbiased bases.
- S. Michalakis (arXiv:0707.1722, 2007): multiplicativity of the maximal output 2-norm for depolarized WH channels, with a proof that does not rely on positivity of matrix entries.
- I. Devetak, M. Junge, C. King, M. B. Ruskai (*Commun. Math. Phys.* **266**, 37, 2006): a multiplicativity-implies-additivity bridge via completely bounded $p$-norms.

After the source survey was written, the broader landscape was changed by negative results:

- A. Winter (arXiv:0707.0402, 2007) and P. Hayden (arXiv:0707.3291, 2007) disproved the multiplicativity conjecture (24) for every $p>1$ via random-channel constructions, with $p=2$ closed by Winter.
- M. B. Hastings (*Nature Physics* 5, 255 (2009)) disproved the additivity conjecture (23) for minimal output entropy at $p=1$.

These counterexamples are themselves extreme CPT maps in high dimension built from random isometries. So while the *general* conjectures (23) and (24) are now known to be false, identifying further structured classes of extreme CPT maps on which additivity and/or multiplicativity *do* hold (and using the reduction in Section 5.5) remains an active and open program.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 14, p. 14.
- M-D. Choi, "Completely Positive Linear Maps on Complex Matrices," *Lin. Alg. Appl.* **10**, 285–290 (1975).
- I. Devetak and P. W. Shor, "The capacity of a quantum channel for simultaneous transmission of classical and quantum information," *Commun. Math. Phys.* **256**, 287–303 (2005). quant-ph/0311131.
- A. S. Holevo, "On complementary channels and the additivity problem," quant-ph/0509101.
- C. King, K. Matsumoto, M. Nathanson, M. B. Ruskai, "Properties of Conjugate Channels with Applications to Additivity and Multiplicativity," quant-ph/0509126.
- P. W. Shor, "Equivalence of Additivity Questions in Quantum Information Theory," *Commun. Math. Phys.* **246**, 453–472 (2004). quant-ph/0305035.
- C. King, "Additivity for unital qubit channels," *J. Math. Phys.* **43**, 4641–4653 (2002).
- C. King, "The capacity of the quantum depolarizing channel," *IEEE Trans. Inform. Theory* **49**, 221–229 (2003).
- C. King, "Maximal $p$-norms of entanglement breaking channels," *Quantum Information and Computation* **3**, 186–190 (2003).
- P. Shor, "Additivity of the classical capacity of entanglement-breaking quantum channels," *J. Math. Phys.* **43**, 4334–4340 (2002).
- C. King, M. Nathanson and M. B. Ruskai, "Multiplicativity results for entrywise positive maps," *Lin. Alg. Appl.* **404**, 367–379 (2005). quant-ph/0409181.
- M. Nathanson and M. B. Ruskai, "Pauli Diagonal Channels Constant on Axes," *J. Phys. A: Math. Theor.* **40**, 8171–8204 (2007). quant-ph/0611106.
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007).
- I. Devetak, M. Junge, C. King, and M. B. Ruskai, "Multiplicativity of completely bounded $p$-norms implies a new additivity result," *Commun. Math. Phys.* **266**, 37–63 (2006). quant-ph/0506196.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
