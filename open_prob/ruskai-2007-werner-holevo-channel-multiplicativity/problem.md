# Multiplicativity of the polarized Werner–Holevo channel

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d \times d$ complex matrices |
| $\rho$ | a density matrix (positive, trace-one) on $\mathbb{C}^d$ |
| $\mathrm{Tr}\,\rho$ | trace of $\rho$ |
| $\rho^T$ | transpose of $\rho$ in a fixed basis |
| $I$ | identity matrix on $\mathbb{C}^d$ |
| $\mathcal{W}$ | the Werner–Holevo channel $\mathcal{W}(\rho) = \tfrac{1}{d-1}\bigl((\mathrm{Tr}\,\rho)I - \rho^T\bigr)$ on $M_d$ |
| $\mathcal{I}$ | the identity channel ($\mathcal{I}(\rho) = \rho$) |
| $x$ | mixing parameter in $[0,1]$ |
| $\Phi_x$ | the *polarized* (or depolarized) Werner–Holevo channel $\Phi_x = x\mathcal{I} + (1-x)\mathcal{W}$ |
| $\Phi_x \otimes \Phi_x$ | tensor product (parallel two uses) of $\Phi_x$ |
| $\lVert\cdot\rVert_p$ | Schatten $p$-norm on matrices, $\lVert A\rVert_p = (\mathrm{Tr}\lvert A\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | maximal output $p$-norm, $\nu_p(\Phi) = \sup_\rho \lVert\Phi(\rho)\rVert_p$ |
| $p$ | the Schatten norm exponent, here $1 \le p \le 2$ |
| EB | entanglement breaking (a channel whose Choi state is separable) |

## Background

Let $\mathcal{W} : M_d \mapsto M_d$ be the **Werner–Holevo channel**,
$$\mathcal{W}(\rho) \;=\; \tfrac{1}{d-1}\bigl((\mathrm{Tr}\,\rho)I - \rho^T\bigr).$$
It maps every pure state $\lvert\psi\rangle\langle\psi\rvert$ to the rank-$(d-1)$ density matrix $\tfrac{1}{d-1}(I - \lvert\psi\rangle\langle\psi\rvert)$, so for large $d$ it behaves much like the completely noisy (depolarizing) channel — though it is never entanglement breaking. The **maximal output $p$-norm** of a channel $\Phi$ is
$$\nu_p(\Phi) \;=\; \sup_\rho \lVert\Phi(\rho)\rVert_p,$$
and a long-standing question in quantum Shannon theory is the **multiplicativity conjecture**:
$$\nu_p(\Phi \otimes \Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega), \qquad 1 \le p \le 2.$$
For $d = 3$, Werner and Holevo (2002) showed $\nu_p(\mathcal{W})$ is *not* multiplicative for $p > 4.79$; for general $d$, counter-examples can be obtained only for $p \gtrsim 2^p$ (in fact Giovannetti–Lloyd–Ruskai argued that for $d > 2^p$ the WH channel is multiplicative). It is nevertheless known that $\nu_p(\mathcal{W}\otimes\mathcal{W}) = [\nu_p(\mathcal{W})]^2$ for $1 \le p \le 2$.

It is therefore natural to **polarize** the WH channel by mixing with the identity:
$$\Phi_x \;=\; x\mathcal{I} + (1-x)\mathcal{W}, \qquad x\in[0,1],$$
and to ask whether the maximal output $p$-norm of $\Phi_x$ remains multiplicative on tensor products for $1 \le p \le 2$. Channels of this form were studied by Ritter (2005) in a different context. For $d = 3$ and $x = \tfrac{1}{3}$ the channel
$$\Phi_{1/3}(\rho) = \tfrac{1}{3}\bigl(I + \rho - \rho^T\bigr)$$
appears (in a different guise) in early work of Fuchs, Shor and Smolin and is an interesting example: it equals a unital channel $\Psi$ whose Kraus operators are $\tfrac{\sqrt 3}{2}\lvert\psi_k\rangle\langle\psi_k\rvert$ for four specific non-orthogonal states on $\mathbb{C}^3$; $\Psi$ is an extreme point of the EB channels which is neither classical–quantum nor an extreme point of the CPT maps.

## Formal statement

**Problem 6 (Ruskai, 2007).** *Show that the polarized Werner–Holevo channel*
$$\Phi_x \;=\; x\,\mathcal{I} + (1-x)\,\mathcal{W}, \qquad x \in [0,1],$$
*on $M_d$ satisfies the multiplicativity property*
$$\nu_p(\Phi_x \otimes \Phi_x) \;=\; [\nu_p(\Phi_x)]^2 \qquad \text{for } 1 \le p \le 2.$$

## Status and known progress

- **$p = 2$ case fully resolved.** Spyridon Michalakis posted "Multiplicativity of the maximal output $2$-norm for depolarized Werner–Holevo channels" (arXiv:0707.1722, 2007); Ruskai notes explicitly "A solution of Problem 6 in the case $p = 2$ was recently reported by Michalakis [40]." Thus the $p = 2$ instance is *solved* for all $d$ and all $x\in[0,1]$.
- **Two-copy WH ($x=0$) base case.** It is already known that $\nu_p(\mathcal{W}\otimes\mathcal{W}) = [\nu_p(\mathcal{W})]^2$ for $1\le p\le 2$, so the unpolarized end-point is settled in that range.
- **Counterexample regime.** For $d = 3$ the unpolarized WH channel violates multiplicativity for $p > 4.79$ (Werner–Holevo 2002), and Giovannetti–Lloyd–Ruskai (2005) argue that for $d > 2^p$ the WH channel is multiplicative. The natural conjectured boundary $1 \le p \le 2$ is thus consistent with all known evidence.
- **General multiplicativity collapse for $p > 1$.** Shortly after the 14 June 2007 version of the source manuscript was posted, Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291) produced counter-examples to the general multiplicativity conjecture (24) for *all* $p > 1$ via random-channel constructions. These counter-examples do not directly resolve Problem 6 (they use different channels and act in the regime of large output dimension), and the question of multiplicativity for the specific family $\Phi_x$ in the range $1\le p\le 2$ remains open. The source itself emphasizes that "the additivity conjectures and many related questions remain open" despite these random counter-examples.
- **Current status for $p \ne 2$ within $[1,2]$:** Problem 6 is *partially solved* — proved at $p = 2$ (Michalakis, 2007) and at the unpolarized end $x = 0$, otherwise open. The natural extension would invoke entropy-style or relative-entropy-style methods; no such proof is recorded in the source.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, *Open Problems in Quantum Information Theory*, arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 February 2007. DOI: 10.48550/arXiv.0708.1902. (Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*.)
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *Journal of Mathematical Physics* **43**, 4353–4357 (2002).
- V. Giovannetti, S. Lloyd and M. B. Ruskai, "Conditions for multiplicativity of maximal $\ell_p$-norms of channels for fixed integer $p$," *Journal of Mathematical Physics* **46**, 042105 (2005). arXiv:quant-ph/0408103.
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007).
- C. Fuchs, "Nonorthogonal quantum states maximize classical information capacity," *Physical Review Letters* **79**, 1162–1165 (1997).
- M. Horodecki, P. W. Shor and M. B. Ruskai, "Entanglement Breaking Channels," *Reviews in Mathematical Physics* **15**, 629–641 (2003). arXiv:quant-ph/0302031.
- G. W. Ritter, "Quantum Channels and Representation Theory," *Journal of Mathematical Physics* **46**, 082103 (2005). arXiv:quant-ph/0502153.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291 (2007).
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p > 2$," arXiv:0707.0402 (2007).
