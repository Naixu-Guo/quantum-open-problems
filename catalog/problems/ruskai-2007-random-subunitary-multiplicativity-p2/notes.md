# Multiplicativity at $p=2$ for random sub-unitary channels (or new counterexample)

## Background

A quantum channel $\Phi:M_d\to M_d$ is a CPT map. The Schatten $p$-norm of an output, $\|\Phi(\gamma)\|_p$, measures output purity, and its maximum $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$ controls many capacity-related quantities. The multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
was central to additivity questions in quantum information theory.

Section 4 of the source intends to introduce a *random sub-unitary* family and prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb C^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary. The displayed operators are not trace preserving: they have a common input kernel, and the coefficient is not the square-root normalization. A normalized cyclic-support construction would also have to rotate the input support, for example by conjugating the block with shifts. The survey does not identify the exact correction. This entry therefore uses the intended corrected CPT family. The Werner–Holevo channel provides a counterexample to (24) for large $p$ (specifically $p>4.79$) but not for $p\le 2$.

A natural special value is $p=2$, where many channel classes admit explicit multiplicativity proofs (King's results for unital qubit and depolarizing channels; Michalakis's proof for depolarized WH channels at $p=2$; King–Nathanson–Ruskai entrywise-positive results). Problem 15 in Section 5.5 of the source asks whether the multiplicativity conjecture (24) at $p=2$ can be established for the entire random sub-unitary family (22) — or if not, whether these channels supply *additional* counterexamples beyond the WH channel.

## Status and known progress

**Status: open under the intended formulation.** No proof of (24) for the intended full random sub-unitary class at $p=2$ appears to have been published. Taken literally, the printed equation does not define channels. Closest known cases:

- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007), establishes multiplicativity at $p=2$ for the depolarized WH channel (eq. (16)/(17) family in the source), a structured sub-case overlapping the random sub-unitary family in spirit but not literally.
- C. King, M. Nathanson and M. B. Ruskai (quant-ph/0409181) and M. Nathanson and M. B. Ruskai (quant-ph/0611106) prove $p=2$ multiplicativity for entrywise-positive and Pauli-diagonal-constant-on-axes classes.
- Ruskai's own preliminary numerical searches for counterexamples of the form (22) at $d=4,5$ found no violation (Section 5.3).
- Ruskai's added Remark (11 August 2007, p. 10) notes a $d=4$ example: the sub-unitary channel $\Phi$ with $3\times 3$ unitaries corresponding to the permutations $(123),(134),(142),(243)$ has minimal output rank 3, while $\Phi\otimes\Phi$ on a maximally entangled state has output rank 10 — not a violation of (24) at finite $p$ but suggesting investigations for $p<1$.

The wider multiplicativity landscape changed dramatically after the survey:

- A. Winter (arXiv:0707.0402, 2007) showed (24) fails for every $p>2$; P. Hayden (arXiv:0707.3291, 2007) extended counterexamples to all $1<p<2$, and Winter then closed $p=2$. These counterexamples use random-channel constructions of growing dimension, not specifically the form (22).
- M. B. Hastings (*Nature Physics* 5, 255 (2009)) disproved the additivity conjecture (23) at $p=1$.

Thus the *general* multiplicativity conjecture at $p=2$ is now known to be false, but this does not immediately settle Problem 15 because the random sub-unitary family (22) is a structured sub-class that may or may not contain a counterexample for $p=2$, and a structural multiplicativity proof restricted to this family remains a meaningful goal.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 15, p. 14.
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007).
- C. King, M. Nathanson and M. B. Ruskai, "Multiplicativity results for entrywise positive maps," *Lin. Alg. Appl.* **404**, 367–379 (2005). quant-ph/0409181.
- M. Nathanson and M. B. Ruskai, "Pauli Diagonal Channels Constant on Axes," *J. Phys. A: Math. Theor.* **40**, 8171–8204 (2007). quant-ph/0611106.
- C. King and M. B. Ruskai, "Comments on multiplicativity of maximal $p$-norms when $p=2$," in *Quantum Information, Statistics and Probability*, ed. O. Hirota (World Scientific, 2004). quant-ph/0401026.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
- T. S. Cubitt, A. Montanaro and A. Winter, "On the dimension of subspaces with bounded Schmidt rank," arXiv:0706.0705.
- P. Hayden, D. Leung and A. Winter, "Aspects of generic entanglement," *Commun. Math. Phys.* **265**, 95–117 (2007).
