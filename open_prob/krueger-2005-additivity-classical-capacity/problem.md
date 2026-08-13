# Additivity of classical capacity and related problems

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | Finite-dimensional complex Hilbert space |
| $T$ | Quantum channel (completely positive trace-preserving map) in the Schrödinger picture |
| $T^{\otimes n}$ | $n$-fold tensor product channel $T \otimes \cdots \otimes T$ |
| $T_1 \otimes T_2$ | Tensor product of two channels |
| $\rho, \rho_i$ | Density operators |
| $p = (p_1,\ldots,p_n)$ | Probability vector |
| $H(\rho)$ | von Neumann entropy $-\mathrm{Tr}(\rho \log \rho)$ |
| $\chi(T)$ | Holevo quantity (one-shot Holevo capacity) of channel $T$ |
| $C_{1,\infty}$ | Capacity with unentangled coding, quantum block decoding (= $\chi$) |
| $C_{\infty,1}$ | Capacity with quantum block coding and separate decoding |
| $C_{1,1}$ | Capacity with separate quantum (de)coding and only classical block (de)coding |
| $C_{\infty,\infty}$ | Full classical capacity, arbitrary (de)coding |
| $\ell_p(\mathcal{H})$ | Schatten $p$-class, $\lVert X\rVert_p = (\mathrm{Tr}\lvert X\rvert^p)^{1/p}$ |
| $\lVert T\rVert_p$ | $\sup_\rho \lVert T(\rho)\rVert_p$ |
| $H_{\min}(T)$ | Minimal output (von Neumann) entropy of $T$, $\min_\rho H(T(\rho))$ |
| EoF | Entanglement of formation |
| $d$ | Hilbert-space dimension |
| $I$ | Identity operator |
| $\rho^T$ | Transpose of $\rho$ |

## Background

A memoryless quantum channel $T$ has several distinct classical-information capacities, depending on which resources (entangled inputs, entangled measurements) are allowed at the encoder and decoder. The four basic capacities are arranged in a diamond:
$$C_{1,\infty} \;=\; \chi \;\geq\; C_{1,1}, \qquad C_{\infty,\infty} \;\geq\; C_{\infty,1} \;=\; C_{1,1},$$
the equality on the right being established by several authors and the equality $C_{1,\infty} = \chi$ being the Holevo–Schumacher–Westmoreland theorem. The full capacity is given by the regularised Holevo quantity,
$$C_{\infty,\infty}(T) \;=\; \lim_{n \to \infty} \frac{1}{n}\,\chi(T^{\otimes n}).$$
Because $\chi$ is superadditive ($\chi(T_1 \otimes T_2) \geq \chi(T_1) + \chi(T_2)$), one always has $C_{\infty,\infty} \geq \chi$. **Additivity** of $\chi$ would force equality and yield a clean single-letter formula for the classical capacity of every quantum channel.

The additivity question is equivalent (via Shor 2003 and earlier reductions by Matsumoto–Shimono–Winter, Audenaert–Braunstein, Pomeransky, Shirokov) to several other apparently distinct conjectures: additivity of the minimal output (von Neumann) entropy $H_{\min}$, additivity of the entanglement of formation, strong superadditivity of EoF, and (at $p \downarrow 1$) multiplicativity of Schatten $p$-norms of completely positive maps:
$$\|T_1 \otimes T_2\|_p \;\stackrel{?}{=}\; \|T_1\|_p\,\|T_2\|_p, \qquad p \geq 1.$$

At the time of posing, additivity was proven in several special cases (identity channel, unital qubit channels, depolarising channel, entanglement-breaking channels), and extensive numerical searches had failed to find a counterexample.

## Formal statement

For a quantum channel $T$ in the Schrödinger picture, define the Holevo quantity
$$\chi(T) \;=\; \sup_{p,\,\rho}\;\Bigl( H\!\Bigl(\textstyle\sum_i p_i\,T(\rho_i)\Bigr) \;-\; \sum_i p_i\, H\!\bigl(T(\rho_i)\bigr) \Bigr),$$
where the supremum runs over all probability vectors $p = (p_1, \ldots, p_n)$ and all collections $\{\rho_1, \ldots, \rho_n\}$ of input states.

**Problem.** Either prove
$$\chi(T_1 \otimes T_2) \;=\; \chi(T_1) \;+\; \chi(T_2) \qquad \text{for every pair of quantum channels } T_1, T_2,$$
or give an explicit counterexample.

Equivalent forms include: $H_{\min}(T_1 \otimes T_2) = H_{\min}(T_1) + H_{\min}(T_2)$ for all $T_1, T_2$; additivity of the entanglement of formation; strong superadditivity of the entanglement of formation; and multiplicativity of $\|\cdot\|_p$ on tensor products for $p$ in a right-neighbourhood of $1$.

## Status and known progress

- **Status:** solved (disproven).
- **Resolution (Hastings, 2009):** M. B. Hastings produced random-unitary channels (in very large dimension) violating additivity of the minimal output von Neumann entropy. Via Shor's equivalence (P. W. Shor, 2003), this directly implies failure of additivity of the Holevo capacity $\chi$ and superadditivity of the entanglement of formation in general. The full classical capacity is therefore *not* given by a single-letter Holevo formula.
- **Reference of resolution:** M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255–257 (2009); arXiv:0809.3972.
- **Special cases of additivity (still valid):** additivity of $\chi$ is known to hold for: the identity channel (Amosov–Holevo–Werner; Schumacher–Westmoreland); unital qubit channels (King); the depolarising channel in every dimension (King); entanglement-breaking channels (Shor). For Gaussian channels there are also additivity and multiplicativity results in special cases (Giovannetti–Lloyd and coauthors).
- **Multiplicativity counterexamples.** Werner and Holevo gave a channel $T(\rho) = (I - \rho^T)/(d-1)$ in $d = 3$ for which $\|T \otimes T\|_p < \|T\|_p^2$ fails for sufficiently large $p$ (in their case $p \geq 4.7823$); nevertheless additivity of $H_{\min}$ and $\chi$ holds for this channel. After Hastings, even the "small-$p$" multiplicativity of $\|\cdot\|_p$ for $p > 1$ near $1$ is known to fail in general.
- **Implications.** The dichotomy laid out in the source PDF — that proving multiplicativity would solve superadditivity of EoF — instead resolves in the opposite direction: additivity fails for $\chi$, $H_{\min}$, and EoF, and multiplicativity of $\|\cdot\|_p$ fails for $p > 1$ in a neighbourhood of $1$.
- **Remaining open sub-questions.** Even after Hastings' disproof, several quantitative questions remain active: the exact size of additivity violations, identification of channels for which additivity does hold, the qubit-channel case ($\dim = 2$), the Gaussian-channel case in infinite dimension, and the rate of convergence of the regularisation.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 10, pp. 34–40 (proposed by A. S. Holevo, 31 Jan 2003).
- C. H. Bennett, C. A. Fuchs, and J. A. Smolin, *Entanglement-enhanced classical communication on a noisy quantum channel*, in: Quantum Communication, Computing and Measurement, Proc. QCM96, ed. O. Hirota, A. S. Holevo, and C. M. Caves, New York: Plenum 1997, pp. 79–88; arXiv:quant-ph/9611006.
- C. H. Bennett and P. W. Shor, *Quantum information theory*, IEEE Trans. Inform. Theory **44**, 2724 (1998).
- A. S. Holevo, *The capacity of the quantum channel with general signal states*, IEEE Trans. Inform. Theory **44**, 269 (1998); arXiv:quant-ph/9611023.
- B. Schumacher and M. D. Westmoreland, *Sending classical information via noisy quantum channels*, Phys. Rev. A **56**, 131 (1997).
- A. S. Holevo, *Quantum coding theorems*, Russ. Math. Surveys **53**, 1295 (1998); arXiv:quant-ph/9809023.
- G. G. Amosov, A. S. Holevo, and R. F. Werner, *On some additivity problems in quantum information theory*, Probl. Inform. Transm. **36** (4), 25 (2000); arXiv:math-ph/0003002.
- G. G. Amosov and A. S. Holevo, *On the multiplicativity conjecture for quantum channels*, arXiv:math-ph/0103015 (2001).
- C. King and M. B. Ruskai, *Minimal entropy of states emerging from noisy quantum channels*, IEEE Trans. Inform. Theory **47**, 192 (2001); arXiv:quant-ph/9911079.
- C. King and M. B. Ruskai, *Capacity of quantum channels using product measurements*, J. Math. Phys. **42**, 87 (2001); arXiv:quant-ph/0004062.
- C. King, *Additivity for a class of unital qubit channels*, arXiv:quant-ph/0103156 (2001).
- C. King, *Maximization of capacity and $l_p$ norms for some product channels*, J. Math. Phys. **43**, 1247 (2002); arXiv:quant-ph/0103086.
- C. King, *The capacity of the quantum depolarizing channel*, arXiv:quant-ph/0204172 (2002).
- C. King, M. Nathanson, and M. B. Ruskai, *Multiplicativity properties of entrywise positive maps on matrix algebras*, arXiv:quant-ph/0409181 (2004).
- C. King and M. B. Ruskai, *Comments on multiplicativity of maximal $p$-norms when $p=2$*, arXiv:quant-ph/0401026 (2004).
- P. W. Shor, *Additivity of the classical capacity of entanglement-breaking quantum channels*, Commun. Math. Phys. **246**, 453 (2004); arXiv:quant-ph/0201149.
- P. W. Shor, *Equivalence of additivity questions in quantum information theory*, arXiv:quant-ph/0305035 (2003).
- R. F. Werner and A. S. Holevo, *Counterexample to an additivity conjecture for output purity of quantum channels*, J. Math. Phys. **43**, 4353 (2002).
- K. Matsumoto, T. Shimono, and A. Winter, *Remarks on additivity of the Holevo channel capacity and of the entanglement of formation*, arXiv:quant-ph/0206148 (2002).
- K. Matsumoto and F. Yura, *Entanglement cost of antisymmetric states and additivity of capacity of some quantum channel*, arXiv:quant-ph/0306009 (2003).
- K. M. R. Audenaert and S. L. Braunstein, *On strong superadditivity of the entanglement of formation*, arXiv:quant-ph/0303045 (2003).
- A. A. Pomeransky, *Strong superadditivity of the entanglement of formation follows from its additivity*, arXiv:quant-ph/0305056 (2003).
- N. Datta, A. S. Holevo, and Y. M. Suhov, *A quantum channel with additive minimum output entropy*, arXiv:quant-ph/0408176 (2004).
- R. Alicki and M. Fannes, *Note on multiple additivity of Renyi entropy output for Werner–Holevo channel*, arXiv:quant-ph/0407033 (2004).
- V. Giovannetti, S. Lloyd, L. Maccone, J. H. Shapiro, and B. J. Yen, *Minimum Renyi and Wehrl entropies at the output of bosonic channels*, arXiv:quant-ph/0404037 (2003).
- V. Giovannetti and S. Lloyd, *Additivity properties of a Gaussian channel*, arXiv:quant-ph/0403075 (2004).
- V. Giovannetti, S. Lloyd, and M. B. Ruskai, *Conditions for the multiplicativity of maximal $l_p$-norms of channels for fixed integer $p$*, arXiv:quant-ph/0408103 (2004).
- M. Hayashi, H. Imai, K. Matsumoto, M. B. Ruskai, and T. Shimono, *Qubit channels which require four inputs to achieve capacity: implications for additivity conjectures*, arXiv:quant-ph/0403176 (2004).
- A. S. Holevo and M. E. Shirokov, *On Shor's channel extension and constrained channels*, Commun. Math. Phys. **249**, 417 (2004); arXiv:quant-ph/0306196.
- M. E. Shirokov, *On the additivity conjecture for channels with arbitrary constrains*, arXiv:quant-ph/0308168 (2003).
- A. S. Holevo and M. E. Shirokov, *Continuous ensembles and the $\chi$-capacity of infinite-dimensional channels*, arXiv:quant-ph/0403072 (2004).
- M. E. Shirokov, *The Holevo capacity of infinite-dimensional channels*, arXiv:quant-ph/0408009 (2004).
- B. Schumacher and M. D. Westmoreland, *Relative entropy in quantum information theory*, arXiv:quant-ph/0004045 (2000).
- B. Schumacher and M. D. Westmoreland, *Optimal signal ensembles*, Phys. Rev. A **63**, 022308 (2001); arXiv:quant-ph/9912122.
- M. Sasaki, K. Kato, M. Izutsu, and O. Hirota, *Quantum channels showing superadditivity in capacity*, arXiv:quant-ph/9801012 (1998).
- S. Osawa and H. Nagaoka, *Numerical experiments on the capacity of quantum channel with entangled input states*, arXiv:quant-ph/0007115 (2000).
- M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255–257 (2009); arXiv:0809.3972.
