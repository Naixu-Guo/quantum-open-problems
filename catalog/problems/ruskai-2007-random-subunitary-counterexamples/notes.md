# New multiplicativity counterexamples from random sub-unitary channels

## Background

The multiplicativity conjecture (24) in Ruskai's survey asserts that the maximal output $p$-norm is multiplicative under tensor products:
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega).$$
A counterexample is a pair of channels (often two copies of the same channel) and an entangled input state whose output is strictly purer than any product output, i.e. for which the supremum of $\|(\Phi\otimes\Omega)(\gamma)\|_p$ exceeds the product of the single-copy maxima. The first such counterexample, due to Werner and Holevo, used the WH channel for large $p$.

Section 4 of the source paper intends to introduce a generalisation of the WH channel called *random sub-unitary channels* and prints
$$A_k=\tfrac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
where $X$ is the cyclic shift on $\mathbb C^d$ and each $U_k$ is a $(d-1)\times(d-1)$ unitary. The displayed operators do not satisfy $\sum_k A_k^\dagger A_k=I$: they have a common input kernel, and the coefficient is not the square-root normalization. A normalized cyclic-support construction would also have to rotate the input support, for example by conjugating the block with shifts. The survey does not state which exact correction was intended. This entry treats the problem as referring to that intended CPT family, not to the literal matrices above.

Ruskai reports that her own limited numerical attempts to find counterexamples among channels of the form (22) for $d=4,5$ did not produce a violation, but those searches were preliminary and used only a small sample of unitaries $U_k$. Problem 9 calls for systematic numerical exploration over this family, including with independently randomly chosen $U_k$'s.

## Status and known progress

**Status: open under the intended formulation.** Limited numerical investigations by Ruskai herself for $d=4,5$ did not produce counterexamples beyond the analogue of the WH situation. Taken literally, the printed equation does not define channels; the research question is meaningful only for the intended corrected family.

The wider problem of finding *any* counterexamples to multiplicativity has since been resolved (independently of the random sub-unitary class):

- Winter (2007, arXiv:0707.0402) proved that the maximal output $p$-norm is not multiplicative for any $p>2$ using random-channel constructions.
- Hayden (2007, arXiv:0707.3291) extended counterexamples to all $1<p<2$, and Winter later closed the $p=2$ case.
- Hastings (2009, *Nature Physics* 5, 255) constructed counterexamples to additivity of minimal output entropy at $p=1$ (eq. (23) of the source), disproving the additivity conjecture in general.

Ruskai's added Remark (11 August 2007) notes that for $d=4$, the sub-unitary channel with $3\times 3$ unitaries corresponding to the permutations $(123),(134),(142),(243)$ has minimal output rank 3, while $\Phi\otimes\Phi$ on a maximally entangled state has output rank 10, which is not a violation of multiplicativity of the minimal rank but suggests examining higher $d$ for counterexamples to multiplicativity of $p$-norms for $p<1$ (Section 5.6). No published counterexample of the specific random-sub-unitary form (22) for the multiplicativity conjecture (24) appears to have been reported beyond the WH channel itself.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 9, p. 10.
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
- T. S. Cubitt, A. Montanaro and A. Winter, "On the dimension of subspaces with bounded Schmidt rank," arXiv:0706.0705.
- P. Hayden, D. Leung and A. Winter, "Aspects of generic entanglement," *Commun. Math. Phys.* **265**, 95–117 (2007).
