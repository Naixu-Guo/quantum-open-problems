# Multiplicativity of polarized near-maximally-mixed channels

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d \times d$ complex matrices |
| $\rho$ | a density matrix on $\mathbb{C}^d$ |
| $I$ | identity matrix on $\mathbb{C}^d$ |
| $\Phi$ | a generic CPT (quantum channel) on $M_d$ |
| $\mathcal{I}$ | the identity channel ($\mathcal{I}(\rho) = \rho$) |
| $\mathcal{M}_\epsilon$ | a CPT map whose output is close to maximally mixed, $\lVert \mathcal{M}_\epsilon(\rho) - \tfrac{1}{d}I \rVert < \epsilon$ for all $\rho$ |
| $\epsilon$ | small positivity parameter controlling how close $\mathcal{M}_\epsilon$ is to the completely-noisy map |
| $x$ | mixing weight in $[0,1]$ for the polarization |
| $\Phi_{x,\epsilon}$ | the polarized channel $\Phi_{x,\epsilon} = x\mathcal{I} + (1-x)\mathcal{M}_\epsilon$ |
| $\lVert\cdot\rVert_p$ | Schatten $p$-norm, $\lVert A\rVert_p = (\mathrm{Tr}\lvert A\rvert^p)^{1/p}$ |
| $\nu_p(\Phi)$ | maximal output $p$-norm, $\nu_p(\Phi) = \sup_\rho \lVert\Phi(\rho)\rVert_p$ |
| $p$ | Schatten exponent (the range of interest is $1\le p\le 2$) |
| $\lVert \cdot \rVert$ | (in the definition of $\mathcal{M}_\epsilon$) operator/trace norm on $M_d$ |

## Background

A central conjecture in quantum Shannon theory is the *multiplicativity of the maximal output $p$-norm*: for any CPT maps $\Phi$ and $\Omega$,
$$\nu_p(\Phi \otimes \Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega), \qquad \text{where } \nu_p(\Phi) = \sup_\rho \lVert \Phi(\rho)\rVert_p.$$
It is known to *fail* for sufficiently large $p$ (Werner–Holevo 2002 for $p > 4.79$ on $d=3$; later random counter-examples of Winter and Hayden in 2007 rule it out for all $p > 1$ in certain large-dimension regimes), but the case $1\le p\le 2$ remains a key open question and is implied by the longstanding additivity-of-minimum-output-entropy conjecture.

The class of channels whose output is uniformly close to the maximally mixed state — call them $\mathcal{M}_\epsilon$, defined by $\lVert\mathcal{M}_\epsilon(\rho) - \tfrac{1}{d}I\rVert < \epsilon$ for every input $\rho$ — play a central role in Winter's counter-example construction (arXiv:0707.0402). It is therefore natural, by analogy with the Werner–Holevo "depolarization" $\Phi_x = x\mathcal{I} + (1-x)\mathcal{W}$, to ask about the **polarization**
$$\Phi_{x,\epsilon} \;=\; x\,\mathcal{I} + (1-x)\,\mathcal{M}_\epsilon$$
of an arbitrary near-maximally-mixed channel. Intuitively, for $x$ close to 1 the polarization is dominated by the identity, and one expects $p$-norm multiplicativity to be restored. Problem 7 asks for a precise quantitative version of this expectation.

## Formal statement

**Problem 7 (Ruskai, 2007).** *Let $\mathcal{M}_\epsilon : M_d \to M_d$ be a CPT map satisfying $\lVert\mathcal{M}_\epsilon(\rho) - \tfrac{1}{d}I\rVert < \epsilon$ for every density matrix $\rho$, and let*
$$\Phi_{x,\epsilon} \;=\; x\,\mathcal{I} + (1-x)\,\mathcal{M}_\epsilon, \qquad x\in[0,1].$$
*Does $\Phi_{x,\epsilon}$ satisfy multiplicativity,*
$$\nu_p(\Phi_{x,\epsilon} \otimes \Phi_{x,\epsilon}) \;=\; [\nu_p(\Phi_{x,\epsilon})]^2 \quad \text{for } 1\le p \le 2,$$
*for sufficiently small $\epsilon$? If not, for what values of $x$ and/or $p$ does multiplicativity hold, and how do these depend on $\epsilon$?*

## Status and known progress

- The problem is *posed* in the source (2007) and is listed as open; no proof or counter-example is recorded.
- The motivating context is twofold: (i) the depolarized Werner–Holevo channel $\Phi_x = x\mathcal{I} + (1-x)\mathcal{W}$ (Problem 6) shows that polarization can in principle restore multiplicativity, and the $p=2$ instance of that simpler family was settled by Michalakis (arXiv:0707.1722, 2007); (ii) Winter (arXiv:0707.0402, 2007) constructed near-maximally-mixed channels $\mathcal{M}_\epsilon$ whose tensor squares violate multiplicativity for $p > 2$, and Hayden (arXiv:0707.3291, 2007) extended the failure to $p > 1$ using random channel constructions. These counter-examples sit precisely in the class $\mathcal{M}_\epsilon$ that motivates Problem 7, raising the central question whether the polarization $\Phi_{x,\epsilon}$ for $x$ close to 1 (or $\epsilon$ small) protects multiplicativity in the range $1 \le p \le 2$.
- For $x = 1$ trivially $\Phi_{1,\epsilon} = \mathcal{I}$, which is multiplicative for all $p$; this is the only fully trivial sub-case.
- No general bounds relating $x$, $\epsilon$ and $p$ that guarantee multiplicativity are stated in the source. The author explicitly asks for such relations.
- The question is closely linked to the broader $1 \le p \le 2$ multiplicativity conjecture (24) of Amosov–Holevo–Werner, which was widely conjectured to hold before the 2007 random-channel counter-examples for general channels and large $p$; even with the latter, the conjecture is consistent with all available evidence in the range $1\le p \le 2$ for natural channel families.
- Status as of the source: open. The author records no resolution beyond posing the question.

**Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, *Open Problems in Quantum Information Theory*, arXiv:0708.1902 [quant-ph] (2007); based on the BIRS workshop on Operator Structures in QIT, Banff, 11–16 February 2007. DOI: 10.48550/arXiv.0708.1902. (Source PDF: *Open Problems in Quantum Information Theory_Ruskai_2007.pdf*.)
- G. G. Amosov, A. S. Holevo and R. F. Werner, "On some additivity problems in quantum information theory," *Problems in Information Transmission* **36**, 305–313 (2000). arXiv:math-ph/0003002.
- R. F. Werner and A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels," *Journal of Mathematical Physics* **43**, 4353–4357 (2002).
- V. Giovannetti, S. Lloyd and M. B. Ruskai, "Conditions for multiplicativity of maximal $\ell_p$-norms of channels for fixed integer $p$," *Journal of Mathematical Physics* **46**, 042105 (2005). arXiv:quant-ph/0408103.
- S. Michalakis, "Multiplicativity of the maximal output 2-norm for depolarized Werner–Holevo channels," arXiv:0707.1722 (2007).
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p > 2$," arXiv:0707.0402 (2007).
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false," arXiv:0707.3291 (2007).
