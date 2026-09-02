# Channel(s) violating $p$-norm multiplicativity for both $p_1>1$ and $0<p_2<1$

## Background

A central thread in quantum information theory has been the question of whether minimum output entropy and related output-purity quantities are additive under tensor products of channels. The 2007 source contains sign and extremum typographical inconsistencies: its $p\to1$ convention requires $1/(1-p)$ for Rényi entropy, while the usual maximal-output $p$-norm uses a supremum. Problem 18 itself explicitly asks about equation (26), the minimum output standard Rényi entropy, and that is the convention audited here.

For $p>1$, Amosov, Holevo and Werner conjectured that
$$\nu_p(\Phi\otimes\Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega) \qquad (p>1)$$
and, for that range, equivalently in Rényi-entropy form,
$$S^p_{\min}(\Phi\otimes\Omega) \;=\; S^p_{\min}(\Phi)+S^p_{\min}(\Omega) \qquad (p\ge 0).$$
The $p\to 1$ limit is the von Neumann minimal-output-entropy additivity conjecture, which Shor showed to be globally equivalent to the additivity of Holevo capacity and of entanglement of formation.

Following Ruskai's BIRS workshop (Banff, Feb 2007), several breakthroughs landed: Winter (July 2007, arXiv:0707.0402) produced counter-examples for every $p>2$, and Hayden (arXiv:0707.3291) extended this to all $1<p<2$, with the $p=2$ case then handled by Winter. Counter-examples for $p=0$ had been found earlier by Harrow, Leung and Winter using nearly maximally entangled states in large dimensions, and at that time it appeared "only a matter of time" until counter-examples would be exhibited for arbitrary $p\in(0,1)$.

Strikingly, all these constructions are non-uniform in $p$: as $p$ approaches $1$, the dimension of the counter-example channel must blow up, and the channel itself must be replaced. Moreover, the constructions used for $p>1$ and $p<1$ are structurally different (different Kraus operators, different entanglement structures). It is therefore natural to ask whether one and the same channel — or one and the same pair of channels — can be shown to fail multiplicativity on both sides of $p=1$. A negative answer would imply that one can always approach $p=1$ either from above or below, and would re-open a route towards the additivity conjecture for $p=1$ itself.

## Status and known progress

- **Status: solved for equation (26).** Hastings produced a fixed finite-dimensional channel pair with a strict additivity gap at $p=1$. For fixed finite-dimensional channels, $S^p_{\min}$ is continuous in $p$ at $1$: the state Rényi entropy is jointly continuous in the state and order, and minimisation over the compact input-state set preserves continuity. The same strict gap therefore persists throughout some interval $(1-\varepsilon,1+\varepsilon)$. Choosing one order on each side of one gives the single pair requested by Problem 18.
- Leung, Lovitz and Wu (16 July 2026) independently make this continuity implication explicit and prove broader existence results below one, including nonadditivity for every $p>3/4$. Their manuscript was an unrefereed first version at the audit cutoff. It corroborates the classification but is not needed once Hastings' strict finite-dimensional gap is combined with continuity.
- **Convention caveat.** If one instead asks about conventional *maximal-output $p$-quasinorm multiplicativity* for $p<1$, the continuity argument above does not answer that different question. The solved label follows the source's explicit equation (26).
- **Last verified:** 2026-08-12.

## Bibliography

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 18, p. 15. DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- G. G. Amosov, A. S. Holevo, R. F. Werner, "On Some Additivity Problems in Quantum Information Theory", *Probl. Inf. Transm.* 36 (2000), 305-313; math-ph/0003002.
- R. F. Werner, A. S. Holevo, "Counterexample to an additivity conjecture for output purity of quantum channels", *J. Math. Phys.* 43 (2002), 4353-4357.
- A. Winter, "The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$", arXiv:0707.0402 (2007).
- P. Hayden, "The maximal $p$-norm multiplicativity conjecture is false", arXiv:0707.3291 (2007).
- P. Hayden, D. Leung, A. Winter, "Aspects of generic entanglement", *Commun. Math. Phys.* 265 (2007), 95-117.
- T. S. Cubitt, A. Montanaro, A. Winter, "On the dimension of subspaces with bounded Schmidt rank", arXiv:0706.0705 (2007).
- M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257; arXiv:0809.3972.
- P. W. Shor, "Equivalence of Additivity Questions in Quantum Information Theory", *Commun. Math. Phys.* 246 (2004), 453-472; quant-ph/0305035.
- D. Leung, B. Lovitz, P. Wu, *Counterexamples to additivity of minimum output $p$-Rényi entropy of quantum channels for $p>3/4$ and $0\le p<1/4$*, arXiv:2607.15210 (2026).
