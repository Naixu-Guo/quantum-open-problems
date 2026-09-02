# Explicit channels violating multiplicativity of maximal output $p$-norm for $p\ne 1$

## Background

The Amosov-Holevo-Werner conjecture asserted that the maximal output $p$-norm purity of a quantum channel is multiplicative under tensor product:
$$\nu_p(\Phi\otimes\Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega), \qquad p>1 \tag{24}$$
with the equivalent additivity statement
$$S^p_{\min}(\Phi\otimes\Omega) \;=\; S^p_{\min}(\Phi)+S^p_{\min}(\Omega).$$
Werner and Holevo (*J. Math. Phys.* 43 (2002), 4353-4357) had given a counter-example for $p>4.79$ using a particular qutrit channel (the "WH channel"). In summer 2007, Winter (arXiv:0707.0402) extended this to all $p>2$, and Hayden (arXiv:0707.3291) extended it to all $1<p<2$. The $p=0$ regime was addressed by Harrow, Leung and Winter using random nearly-maximally-entangled subspaces.

A common feature of all these post-WH counter-examples is that they are *existential*: they show that a channel violating (24) must exist (typically by averaging over random unitary Kraus operators and showing positive measure for the violating set), but they do not exhibit any concrete channel. In sharp contrast, the Werner-Holevo construction for $p>4.79$ is genuinely explicit (small dimension, explicit Kraus operators). Having explicit counter-examples in the harder regimes — particularly for $1<p<2$, and for $0<p<1$ — would be valuable for testing related conjectures (CB entropy positivity, coherent information sign, see Problem 21), for numerical experimentation, for refining the structural understanding of how entanglement boosts output purity, and for pedagogy.

## Status and known progress

- The Werner-Holevo channel (Werner-Holevo 2002) remains the canonical *explicit* example: it violates (24) for $p>4.79$. Variants and small perturbations of it are the only such channels known explicitly at the time the problem was posed.
- Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291) extended the existence range to $p>2$ and to $1<p<2$ respectively, but via random-channel arguments that do not produce a single named channel.
- Harrow, Leung and Winter ("Aspects of generic entanglement", *Commun. Math. Phys.* 265 (2007)) addressed the $p=0$ regime existentially using high-dimensional random subspaces.
- Brandão and Horodecki (2010, *Open Syst. Inf. Dyn.* 17, 31-52, arXiv:0907.3210; see also arXiv:0907.4798) gave a more explicit (algorithmically constructive) version of Hastings's $p=1$ counter-example, providing more concrete channels in lower dimensions, though still very large.
- Fukuda, King and Moser ("Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143; arXiv:0905.3697) and Aubrun, Szarek, Werner (arXiv:1003.4925, arXiv:1010.1571) substantially simplified the random-construction proofs but did not yield small fully-explicit channels.
- For $p>1$ but $p$ close to $1$, and for $0<p<1$, no truly small-dimension, explicit channel violating (24) is known.
- **Status: solved.** Problem 20 asks only for explicit channels violating (24) at some $p\ne1$; it does not require modest dimension, a hand calculation, or coverage near $p=1$. The Werner–Holevo channel already supplies an explicit counterexample for $p>4.79$. Cubitt, Harrow, Leung, Montanaro and Winter later gave an explicit $4$-to-$3$ pair with nonmultiplicative minimum output rank at $p=0$. More recent constructions give explicit examples over wider ranges.
- A 2025/2026 preprint by Derksen and Lovitz gives constructive examples for every $p>1$, including the difficult interval near one. This strengthens the resolution but is not needed for the existential statement.
- **Last verified:** 2026-08-12.

## Bibliography

- T. S. Cubitt, A. W. Harrow, D. Leung, A. Montanaro, A. Winter, *Counterexamples to additivity of minimum output $p$-Rényi entropy for $p$ close to 0*, Commun. Math. Phys. **284**, 281 (2008); arXiv:0712.3628.
- H. Derksen, B. Lovitz, *Constructive counterexamples to the additivity of minimum output Rényi entropy of quantum channels for all $p>1$*, arXiv:2510.07547 (2026), v2.

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 20, p. 16. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- R. F. Werner, A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels", *J. Math. Phys.* 43 (2002), 4353-4357.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$", arXiv:0707.0402 (2007).
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false", arXiv:0707.3291 (2007).
- P. Hayden, D. Leung, A. Winter, "Aspects of generic entanglement", *Commun. Math. Phys.* 265 (2007), 95-117.
- G. G. Amosov, A. S. Holevo, R. F. Werner, "On Some Additivity Problems in Quantum Information Theory", *Probl. Inf. Transm.* 36 (2000), 305-313; math-ph/0003002.
- F. G. S. L. Brandão, M. Horodecki, "On Hastings' counterexamples to the minimum output entropy additivity conjecture", *Open Syst. Inf. Dyn.* 17 (2010), 31-52; arXiv:0907.3210.
- M. Fukuda, C. King, D. K. Moser, "Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143; arXiv:0905.3697.
- G. Aubrun, S. Szarek, E. Werner, "Hastings' additivity counterexample via Dvoretzky's theorem", *Commun. Math. Phys.* 305 (2011), 85-97; arXiv:1003.4925.
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257; arXiv:0809.3972.
