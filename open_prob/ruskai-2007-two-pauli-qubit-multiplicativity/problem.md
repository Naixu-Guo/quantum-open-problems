# Multiplicativity for the two-Pauli qubit channel without negative multipliers

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $M_2$ | Algebra of complex $2\times 2$ matrices (qubit observables) |
| $I, X, Y, Z$ | The four Pauli matrices: $X=\sigma_x$, $Y=\sigma_y$, $Z=\sigma_z$ |
| $\rho$, $\gamma$ | Density matrices on a qubit Hilbert space |
| $\Phi$, $\Omega$ | CPT (completely positive trace-preserving) linear maps (qubit quantum channels) |
| $\|M\|_p$ | Schatten $p$-norm of an operator, $\|M\|_p=(\operatorname{Tr}\lvert M\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | Maximal output $p$-norm, $\sup_\gamma\|\Phi(\gamma)\|_p$ |
| Pauli channel | $\Phi(\rho)=\sum_{j=0}^3 q_j\,\sigma_j\rho\sigma_j$ with probabilities $q_j\ge 0$ summing to $1$ ($\sigma_0=I$) |
| Two-Pauli channel | The one-parameter Bennett-Fuchs-Smolin channel supported on two nonidentity Pauli errors and the identity |
| "Multipliers" | The coefficients (eigenvalues) describing a unital qubit channel in the Bloch picture; can be made non-negative or negative depending on representation |
| Unital channel | $\Phi(I)=I$ |
| MUB | Mutually unbiased bases |

## Background

A *Pauli channel* on a qubit is a convex combination of conjugations by the Pauli matrices. The two-Pauli channel in the cited Bennett-Fuchs-Smolin convention is the one-parameter family
$$\Theta_\lambda(\rho)=\lambda\rho+\frac{1-\lambda}{2}\sigma_i\rho\sigma_i+\frac{1-\lambda}{2}\sigma_j\rho\sigma_j,$$
for two distinct nonidentity Pauli matrices $\sigma_i,\sigma_j$. The earlier version of this entry allowed independent $q_1,q_2$ and therefore described a broader Pauli face.

The multiplicativity conjecture
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for CPT maps was widely studied for qubit channels. King proved (24) for all unital qubit channels for $1\le p\le\infty$, but his proof uses unitary conjugations that may turn positive multipliers into negative ones. Nathanson and Ruskai (arXiv:quant-ph/0611106) introduced classes of channels built from mutually unbiased bases (MUB) with non-negative multipliers, where some natural questions remained open. They formulated a conjecture (Conjecture 9 in [41]) whose validity would reduce additivity and multiplicativity to "maximally squashed" channels — generalisations of the two-Pauli qubit channel.

Section 5.4 of Ruskai's survey asks for a direct multiplicativity proof for the two-Pauli qubit channel that avoids the unitary-equivalence trick to channels with negative multipliers. Such a proof would clarify the role of positivity of multipliers in the multiplicativity argument and could open a path to broader extensions.

## Formal statement

Let $\Phi:M_2\to M_2$ be a two-Pauli qubit channel of the one-parameter form above.
**Problem 13.** Find a proof of the multiplicativity identity
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for arbitrary CPT $\Omega$ and the relevant range of $p$, that does **not** use a unitary equivalence to channels having negative multipliers.

## Status and known progress

For unital qubit channels in general, King (*J. Math. Phys.* **43**, 4641–4653 (2002)) proved (24) for $1\le p\le\infty$, including the two-Pauli channel as a special case. However, King's argument is based on a unitary equivalence to channels with negative multipliers, exactly the route Problem 13 wishes to avoid. Subsequent work by King and Koldan ("New multiplicativity results for qubit maps," quant-ph/0512185) further developed multiplicativity for qubit channels but again leveraged the same multiplier-sign manipulations.

C. King's announcement at the AMS–PTM meeting in Warsaw (2 Aug 2007) extended the multiplicativity proofs for entanglement-breaking channels to $0<p<1$. Nathanson and Ruskai (quant-ph/0611106) studied the related "maximally squashed" generalisations and formulated Conjecture 9 mentioned in Section 5.4.

The broader multiplicativity conjecture (24) at the channel-class level was subsequently disproved by Winter (arXiv:0707.0402) for $p>2$ and Hayden (arXiv:0707.3291) for $1<p<2$, with $p=2$ closed by Winter. Hastings (*Nature Physics* 5, 255 (2009)) disproved additivity of minimum output entropy at $p=1$, eq. (23). These counterexamples involve high-dimensional random channels and do not contradict (24) for the *specific* two-Pauli qubit channel, which is two-dimensional and structured.

The multiplicativity theorem itself is known from King's unital-qubit result. What remains open is the proof-method request: no published proof for this channel that avoids the negative-multiplier route was located.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory," arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 Feb 2007. DOI: 10.48550/arXiv.0708.1902. Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*. Problem 13, p. 13.
- C. King, "Additivity for unital qubit channels," *J. Math. Phys.* **43**, 4641–4653 (2002).
- C. King and N. Koldan, "New multiplicativity results for qubit maps," quant-ph/0512185.
- M. Nathanson and M. B. Ruskai, "Pauli Diagonal Channels Constant on Axes," *J. Phys. A: Math. Theor.* **40**, 8171–8204 (2007). quant-ph/0611106.
- C. King, M. Nathanson and M. B. Ruskai, "Multiplicativity results for entrywise positive maps," *Lin. Alg. Appl.* **404**, 367–379 (2005). quant-ph/0409181.
- C. King and M. B. Ruskai, "Comments on multiplicativity of maximal $p$-norms when $p=2$," in *Quantum Information, Statistics and Probability*, ed. O. Hirota (World Scientific, 2004). quant-ph/0401026.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$," arXiv:0707.0402.
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs," *Nature Physics* **5**, 255–257 (2009).
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *J. Math. Phys.* **43**, 4353–4357 (2002).
