# Lockable Entanglement Measures

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of Alice and Bob |
| $\rho_{AB}$ | A bipartite quantum state on $\mathcal{H}_A\otimes\mathcal{H}_B$ |
| $E(\rho_{AB})$ | A generic entanglement measure (a non-negative functional on bipartite states) |
| $E_F$ | Entanglement of formation |
| $E_C$ | Entanglement cost |
| $E_N$ | Logarithmic negativity |
| $E_{sq}$ | Squashed entanglement |
| $D_2(\rho_{AB})$ | Two-way distillable entanglement (asymptotic rate of EPR pairs extractable from $\rho_{AB}$ by two-way LOCC) |
| $K_D(\rho_{AB})$ | Distillable secret-key rate of $\rho_{AB}$ |
| LOCC | Local operations and classical communication |
| "Lockable" | A measure $E$ is *lockable* if there exist states for which tracing out a single local qubit causes $E$ to drop by an arbitrarily large amount |

## Background

Entanglement measures quantify, in various operational or axiomatic senses, the amount of entanglement contained in a bipartite quantum state $\rho_{AB}$. Examples include the entanglement of formation $E_F$, the entanglement cost $E_C$, the (logarithmic) negativity $E_N$, the squashed entanglement $E_{sq}$, the relative entropy of entanglement $E_R$, and operational rates such as the two-way distillable entanglement $D_2$ and distillable secret-key rate $K_D$. A desirable robustness property of any such measure is *asymptotic continuity*: states close in trace distance should have close values of $E$, with corrections vanishing in the dimension.

Horodecki, Horodecki, Horodecki and Oppenheim introduced *locking* in this context. An entanglement measure $E$ is lockable if there are families of states $\rho_{ABA'}$, with $A'$ a single qubit held by Alice, for which tracing out $A'$ decreases $E$ by an arbitrarily large amount. HHHO proved locking for entanglement of formation, entanglement cost, logarithmic negativity, and a broad convex class that includes asymptotically discontinuous measures. Non-asymptotic-continuity is a sufficient mechanism in that theorem, not an equivalent definition of locking. Squashed entanglement supplies the clearest warning against that equivalence: it is asymptotically continuous yet lockable. The remaining question concerns the operational two-way quantities $D_2$ and $K_D$.

## Formal statement

Are two-way distillable entanglement $D_2$ and the distillable secret-key rate $K_D$ lockable?

Concretely: do there exist states $\rho_{ABA'}$ on $\mathcal{H}_A\otimes\mathcal{H}_B\otimes\mathcal{H}_{A'}$ with $\dim\mathcal{H}_{A'}=2$ such that
$$D_2(\rho_{AA'B}) - D_2(\mathrm{tr}_{A'}\,\rho_{AA'B})$$
can be made arbitrarily large (and similarly for $K_D$)? Equivalently, can the loss of a single qubit by Alice decrease the two-way distillable entanglement, or the distillable key rate, by an arbitrarily large amount?

## Status and known progress

**Status: open.** Several nearby measures are lockable, but neither requested two-way quantity has a published unconditional resolution in the exact Alice/Bob locking model.

- Horodecki, Horodecki, Horodecki and Oppenheim, *Locking entanglement measures with a single qubit*, Phys. Rev. Lett. **94**, 200501 (2005); arXiv:quant-ph/0404096 (2004), introduced the concept and proved that entanglement of formation, entanglement cost, logarithmic negativity, and all convex, asymptotically discontinuous entanglement measures are lockable.
- Christandl and Winter, *Uncertainty, Monogamy, and Locking of Quantum Correlations*, IEEE Trans. Inf. Theory **51**, 3159 (2005); arXiv:quant-ph/0501090 (2005), showed that squashed entanglement is lockable as well.
- HHHO also obtained a locking result for one-way distillable entanglement. That does not settle the requested two-way quantity $D_2$.
- Horodecki et al., *Locking of entanglement measures and a bound on the distillable key rate* (quant-ph/0608199), distinguish loss of a local subsystem from locking information held by an eavesdropper. Their non-lockability result for the latter does not answer the Alice/Bob question here.
- A 2021 result for irreducible private states (arXiv:2107.10737) controls $K_D$ on that restricted family only. It does not prove or disprove lockability of $K_D$ for arbitrary states.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 25, p. 65 (contact: P. Horodecki, 15 Mar 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- K. Horodecki, M. Horodecki, P. Horodecki, J. Oppenheim, *Locking entanglement measures with a single qubit*, Phys. Rev. Lett. **94**, 200501 (2005); arXiv:quant-ph/0404096 (2004).
- M. Christandl and A. Winter, *Uncertainty, Monogamy, and Locking of Quantum Correlations*, IEEE Trans. Inf. Theory **51**, 3159 (2005); arXiv:quant-ph/0501090 (2005).
- M. Christandl, N. Schuch, A. Winter, *Highly entangled states with almost no secrecy*, Phys. Rev. Lett. **104**, 240405 (2010); arXiv:0910.4151.
- K. Horodecki, M. Horodecki, P. Horodecki, J. Oppenheim, *Locking of entanglement measures and a bound on the distillable key rate*, arXiv:quant-ph/0608199 (2006); TCC 2007.
- K. Horodecki et al., *On irreducible private states*, arXiv:2107.10737 (2021).
