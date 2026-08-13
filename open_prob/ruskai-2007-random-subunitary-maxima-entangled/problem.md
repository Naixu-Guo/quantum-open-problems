# Relative $p$-norm maxima of random sub-unitary channels and maximally entangled inputs

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | Algebra of complex $d\times d$ matrices |
| $\rho$ | A density matrix (positive semi-definite, trace $1$) acting on a finite-dimensional Hilbert space |
| $\Phi$ | A completely positive trace-preserving (CPT) linear map (quantum channel) |
| $\{A_k\}$ | Kraus operators of a channel, so $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$ with $\sum_k A_k^{\dagger}A_k=I$ |
| $X$ | Cyclic shift operator on $\mathbb{C}^d$, $X\lvert e_j\rangle=\lvert e_{j+1}\rangle$ (indices mod $d$) |
| $U_k$ | A $(d-1)\times(d-1)$ unitary matrix used in the $k$-th Kraus operator |
| $d$ | Dimension of the input/output Hilbert space of the channel |
| $\|M\|_p$ | Schatten $p$-norm, $\|M\|_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\Phi\otimes\Phi$ | Tensor (parallel) action of two copies of $\Phi$ on $M_d\otimes M_d$ |
| Maximally entangled state | Pure state on $\mathbb{C}^d\otimes\mathbb{C}^d$ of the form $\lvert\Psi\rangle=\frac{1}{\sqrt d}\sum_{j}\lvert j\rangle\otimes\lvert j\rangle$ (up to local unitaries) |
| $\nu_p(\Phi)$ | Maximal output $p$-norm purity, $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$ |
| WH channel | Werner–Holevo channel |
| Relative maximum | Critical input state at which $\|(\Phi\otimes\Phi)(\rho)\|_p$ attains a local maximum |

## Background

Quantum channels are completely positive trace-preserving (CPT) linear maps $\Phi:M_{d}\to M_{d}$, which admit a Kraus representation $\Phi(\rho)=\sum_k A_k\rho A_k^{\dagger}$ with $\sum_k A_k^{\dagger}A_k=I$. The Schatten $p$-norm $\|M\|_p=(\operatorname{Tr}|M|^p)^{1/p}$ measures the purity of an output state: higher $p$-norm corresponds to a less mixed (purer) output. The maximal output $p$-norm $\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$ captures how pure a channel can keep its output and is central to additivity questions.

The Werner–Holevo (WH) channel provided the first counterexample to multiplicativity of $\nu_p$ for large $p$: a maximally entangled input across two copies gives an output strictly purer than the product of two single-copy optima. Section 4 of Ruskai's paper intends to introduce a class of "random sub-unitary" channels and prints
$$A_k=\frac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
where $X$ is the cyclic shift and each $U_k$ is a $(d-1)\times(d-1)$ unitary. This displayed family is not trace preserving: all operators have a common input kernel, and the coefficient is not the square-root normalization. A normalized cyclic-support construction would also have to rotate the input support, for example by conjugating the block with shifts. Because the survey does not specify the exact correction, this entry uses "random sub-unitary" for the intended corrected CPT family rather than the literal matrices above.

Nathanson and Shor's analytic and numerical work shows that for the WH channel a maximally entangled input is always a critical point of $\rho\mapsto\|(\Phi\otimes\Phi)(\rho)\|_p$, but it is only a relative maximum for $p\ge 3$. Problem 8 asks whether the more general random sub-unitary channels share the property that maximally entangled inputs sit among the relative maxima of the two-copy output $p$-norm functional.

## Formal statement

Interpreting equation (22) as the intended normalized cyclic random-sub-unitary construction, let $\Phi:M_d\to M_d$ belong to that CPT family. The source prints
$$A_k=\frac{1}{d-1}X^k\begin{pmatrix}U_k & 0\\ 0 & 0\end{pmatrix},\qquad k=0,1,\dots,d-1,$$
with $X$ the cyclic shift on $\mathbb{C}^d$ and each $U_k$ a $(d-1)\times(d-1)$ unitary, but this formula is not CPT as written.

**Problem 8.** Does the set of relative maxima of
$$\rho\mapsto\|(\Phi\otimes\Phi)(\rho)\|_p,\qquad \rho\in M_d\otimes M_d,$$
always include inputs that are maximally entangled pure states? If not, for which values of $p$ and under what additional circumstances do maximally entangled inputs yield outputs that are relative maxima of $\|(\Phi\otimes\Phi)(\rho)\|_p$?

## Status and known progress

**Status: open under the intended formulation.** For the WH channel itself, Nathanson [41] proved analytically that the maximally entangled input is a critical point of $\|(\mathcal W\otimes\mathcal W)(\rho)\|_p$ for every $p$, and Shor's unpublished numerics [49] (confirmed by Nathanson) found that this critical point is only a relative maximum for $p\ge 3$. No general answer is known for the intended broader family. Taken literally, the printed equation does not define a quantum channel.

Subsequent developments substantially change the surrounding landscape:

- Winter (2007, arXiv:0707.0402) showed that the maximal output $p$-norm of quantum channels is not multiplicative for any $p>2$, resolving the existence of counterexamples to the multiplicativity conjecture (24) above $p=2$.
- Hayden (2007, arXiv:0707.3291) constructed counterexamples to multiplicativity for all $1<p<2$, later extended by Winter to $p=2$. This invalidates the working hypothesis in Section 5 that multiplicativity might hold on $1\le p\le 2$.
- Hastings (2009, *Nature Physics* 5, 255) constructed counterexamples to the additivity of minimal output entropy ($p=1$, eq. (23)), disproving the additivity conjecture in general.

These resolutions concern multiplicativity/additivity overall, not the specific question of whether maximally entangled inputs are relative maxima of $(\Phi\otimes\Phi)$ for channels of the form (22). Problem 8 itself, as a structural question about the location of relative maxima of the two-copy $p$-norm functional for the random sub-unitary family, does not appear to have been resolved in the published literature.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 8, p. 10.
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
- M. Nathanson and M. B. Ruskai, "Pauli Diagonal Channels Constant on Axes," *J. Phys. A: Math. Theor.* **40**, 8171–8204 (2007). arXiv:quant-ph/0611106.
- P. W. Shor, private communication; result confirmed by M. Nathanson.
- G. G. Amosov, A. S. Holevo, and R. F. Werner, "On Some Additivity Problems in Quantum Information Theory," *Problems in Information Transmission* **36**, 305–313 (2000). math-ph/0003002.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
