# Bell violation by tensoring

## Background

Bell non-locality is a non-additive resource in a striking and somewhat counterintuitive way. Whereas entanglement is preserved under tensor products (a tensor product of entangled states is entangled) and most entanglement measures are weakly additive or super-additive, Bell-non-locality can *activate*: a state $\rho$ which, on its own, satisfies all CHSH inequalities may, when tensored with itself or with another similarly "local" state $\rho'$, produce a joint state $\rho\otimes\rho'$ that *does* violate CHSH on the joint system.

This phenomenon, often called "super-activation of non-locality" or "hidden non-locality", was first systematically studied by Peres (1996), who exhibited states with hidden non-locality, and later by Liang and Doherty, Navascués and Vértesi, Palazuelos, and others. It is part of a broader pattern: nonlocality, entanglement distillation and steering all exhibit activation phenomena that are forbidden for entanglement itself.

The cleanest version of the question — fixed by Y. C. Liang in this problem — restricts attention to the simplest Bell scenario, namely CHSH. Concretely: can one find a pair of bipartite states $\rho_1$ and $\rho_2$ such that *neither* $\rho_1$ nor $\rho_2$, on its own, violates *any* CHSH inequality, but the joint state $\rho_1\otimes\rho_2$ (with Alice holding both $A$-systems and Bob holding both $B$-systems) *does* violate CHSH? Equivalently, the question asks whether CHSH-non-locality can be "activated" by simply tensoring two CHSH-local states.

For two-qubit states there is a beautiful sufficient and necessary condition for CHSH violation: the Horodecki criterion. Writing $T_\rho$ for the correlation matrix $T_{\rho;ij}=\operatorname{tr}(\rho\,\sigma_i\otimes\sigma_j)$, a two-qubit $\rho$ violates some CHSH inequality iff $M(\rho) := \lambda_1(T_\rho^* T_\rho) + \lambda_2(T_\rho^* T_\rho) > 1$, where $\lambda_1,\lambda_2$ are the two largest eigenvalues. This makes the two-qubit version of the problem amenable to direct computation.

## Status and known progress

The problem is **solved (affirmatively)**: Liang's CHSH-by-tensoring question has explicit positive constructions.

- **Hidden non-locality (Popescu, Peres).** Popescu (1995) showed that some Werner states with LHV models for direct measurements can be made to violate CHSH after a local "filtering" step. Peres (1996) demonstrated activation: $\rho^{\otimes n}$ can be CHSH-non-local for $n$ large even when $\rho$ alone is not. Peres' construction, however, uses many copies and/or filtering, not a clean two-copy tensor product without further processing.
- **Liang–Doherty bounds.** Y. C. Liang and A. C. Doherty (2006, 2007) gave numerical bounds via semidefinite hierarchies on CHSH violation for tensored states, ruling out activation in several parameter regimes.
- **Resolution: Navascués–Vértesi (2011).** M. Navascués and T. Vértesi, *Activation of nonlocal quantum resources*, Phys. Rev. Lett. **106**, 060403 (2011); arXiv:1010.5191, gave an explicit positive answer to the precise question posed by Liang: they constructed (i) two two-qubit states $\rho_1,\rho_2$ such that $\rho_1^{\otimes N}$ and $\rho_2^{\otimes N}$ admit local hidden-variable models for any $N$, but $\rho_1\otimes\rho_2$ violates the CHSH inequality (reaching $\approx 2.023$); and (ii) a single CHSH-local state $\rho$ such that $\rho^{\otimes 2}$ violates CHSH. Both constructions use no filtering — only direct measurements on the joint state — and thus settle the original CHSH-from-CHSH-locals question of Liang.
- **Subsequent extensions.** C. Palazuelos, *Super-activation of quantum non-locality*, Phys. Rev. Lett. **109**, 190401 (2012); arXiv:1205.3118, extended these ideas to high-dimensional systems with arbitrarily large activation gaps in general Bell scenarios. Further work has produced single-copy activation via broadcasting and characterised closed-form criteria for hidden two-qubit CHSH nonlocality.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 21 on p. 57; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- R. Horodecki, P. Horodecki, M. Horodecki, *Violating Bell inequality by mixed spin-1/2 states: necessary and sufficient condition*, Phys. Lett. A 200, 340 (1995).
- S. Popescu, *Bell's inequalities and density matrices: Revealing "hidden" nonlocality*, Phys. Rev. Lett. 74, 2619 (1995); arXiv:quant-ph/9502005.
- A. Peres, *Collective tests for quantum nonlocality*, Phys. Rev. A 54, 2685 (1996); arXiv:quant-ph/9603023.
- Y. C. Liang, A. C. Doherty, *Bounds on quantum correlations in Bell inequality experiments*, Phys. Rev. A 75, 042103 (2007); arXiv:quant-ph/0608128.
- M. Navascués, T. Vértesi, *Activation of nonlocal quantum resources*, Phys. Rev. Lett. 106, 060403 (2011); arXiv:1010.5191.
- C. Palazuelos, *Super-activation of quantum non-locality*, Phys. Rev. Lett. 109, 190401 (2012); arXiv:1205.3118.
