# Coherent information of random sub-unitary channels: degradability and additivity

## Background

A CPT map $\Phi:M_d\to M_d$ acts on density matrices via Kraus operators, $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$. Every channel has a Stinespring isometric dilation; tracing out the system instead of the environment gives a *complementary channel* $\Phi^C$. The coherent information
$$I_c(\rho,\Phi)=S\!\bigl(\Phi(\rho)\bigr)-S\!\bigl(\Phi^C(\rho)\bigr)$$
is the quantum-information analogue of mutual information: its single-letter maximum $Q^{(1)}(\Phi)=\sup_\rho I_c(\rho,\Phi)$ lower-bounds the quantum capacity $Q(\Phi)=\lim_n n^{-1}Q^{(1)}(\Phi^{\otimes n})$ by the Lloyd–Shor–Devetak (LSD) theorem. In general $I_c$ is super-additive, so the single-letter formula understates the true capacity; the question of *when* coherent information is additive is therefore important.

A channel is **degradable** (Devetak–Shor) if there exists a CPT map $\mathcal D$ with $\Phi^C=\mathcal D\circ\Phi$, and **anti-degradable** if some CPT $\mathcal D$ satisfies $\Phi=\mathcal D\circ\Phi^C$. Degradable channels are known to have additive coherent information, so $Q^{(1)}(\Phi)=Q(\Phi)$; anti-degradable channels have $Q(\Phi)=0$.

Section 4 of Ruskai's survey intends to introduce a *random sub-unitary* class generalizing the Werner–Holevo channel and prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb C^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary. The displayed operators are not a trace-preserving Kraus family: they have a common input kernel, and the coefficient is not the square-root normalization. A normalized cyclic-support construction would also have to rotate the input support, for example by conjugating the block with shifts. The survey does not state which exact correction was intended. This entry therefore treats Problem 10 as a question about the intended normalized cyclic random-sub-unitary family, not about the literal matrices above.

## Status and known progress

**Status: open under the intended formulation.** The source poses Problem 10 as an exploratory question without specific partial results. No comprehensive analysis of degradability and additivity of coherent information for the intended class appears in the published literature. Taken literally, the printed equation does not define channels and the problem is ill-posed until that formula is corrected.

Several related developments narrow the surrounding context:

- For the WH channel ($U_k=I$ in (19)) and more generally for unital channels of dimension $d\ge 3$, no general degradability classification along this family is established.
- Cubitt, Montanaro, Winter (arXiv:0706.0705) and Hayden, Leung, Winter (Aspects of generic entanglement, 2007) studied sub-unitary and "generic" channels with bounded Schmidt rank, providing tools relevant to the structural behaviour of channels in $\overline{\mathcal E}(d,d)$.
- Hastings (2009, *Nature Physics* 5, 255) disproved the additivity conjecture for minimal output entropy at $p=1$ (eq. (23) in the source), removing the general expectation that quantities like the Holevo capacity (and by association coherent information) are additive. Coherent information had already been known to be super-additive in general.

Beyond these general observations, the specific questions of degradability and additivity for the random sub-unitary class (22) remain open.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 10, p. 10.
- I. Devetak and P. W. Shor, "The capacity of a quantum channel for simultaneous transmission of classical and quantum information," *Commun. Math. Phys.* **256**, 287–303 (2005). quant-ph/0311131.
- A. S. Holevo, "On complementary channels and the additivity problem," quant-ph/0509101.
- C. King, K. Matsumoto, M. Nathanson, M. B. Ruskai, "Properties of Conjugate Channels with Applications to Additivity and Multiplicativity," quant-ph/0509126.
- T. S. Cubitt, A. Montanaro and A. Winter, "On the dimension of subspaces with bounded Schmidt rank," arXiv:0706.0705.
- P. Hayden, D. Leung and A. Winter, "Aspects of generic entanglement," *Commun. Math. Phys.* **265**, 95–117 (2007).
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
