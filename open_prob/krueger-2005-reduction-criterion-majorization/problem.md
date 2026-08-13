# Reduction criterion implies majorization?

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A, \mathcal{H}_B$ | Finite-dimensional Hilbert spaces of subsystems $A$ and $B$ |
| $\rho_{AB}$ | Bipartite density matrix on $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho_A, \rho_B$ | Reduced density matrices: $\rho_A = \mathrm{Tr}_B \rho_{AB}$, $\rho_B = \mathrm{Tr}_A \rho_{AB}$ |
| $\mathrm{Tr}_X$ | Partial trace over subsystem $X$ |
| $I_A, I_B$ | Identity operator on $\mathcal{H}_A$, $\mathcal{H}_B$ |
| $\rho^{T_B}$ | Partial transpose of $\rho_{AB}$ on subsystem $B$ |
| $\lambda(\rho)$ | Eigenvalue (column) vector of $\rho$ in non-increasing order |
| $\prec$ | Majorization relation: $x \prec y$ iff $\sum_{i=1}^{k} x_i^{\downarrow} \leq \sum_{i=1}^{k} y_i^{\downarrow}$ for all $k$, with equality at $k = \dim$ |
| $\prec_w$ | Weak (sub-)majorization relation |
| $\Vert R\Vert$ | Operator norm of $R$ |
| PPT | Positive partial transpose criterion: $\rho^{T_B} \geq 0$ |

## Background

For bipartite quantum states there is a hierarchy of separability/entanglement criteria. A bipartite state is *separable* if it can be written as a convex combination of product states. Separability implies the Peres positive-partial-transpose (PPT) criterion ($\rho^{T_B} \geq 0$). PPT states are *undistillable*, and any undistillable state in turn satisfies the *reduction criterion*: $\rho_A \otimes I_B \geq \rho_{AB}$ and $I_A \otimes \rho_B \geq \rho_{AB}$.

A distinct family of criteria based on the *spectra* of $\rho_{AB}$ and its reductions also exists. Nielsen and Kempe proved that every separable state is *more disordered globally than locally* in the strong sense of majorization:
$$\lambda(\rho_{AB}) \prec \lambda(\rho_A), \qquad \lambda(\rho_{AB}) \prec \lambda(\rho_B).$$
Majorization is more stringent than entropic comparisons; in particular it implies $S(\rho_A) \leq S(\rho_{AB})$ for every Schur-concave entropy.

At the time of posing (2002) it was unknown where the majorization criterion sat inside the established implication chain
$$\text{separable} \;\Rightarrow\; \text{PPT} \;\Rightarrow\; \text{undistillable} \;\Rightarrow\; \text{reduction criterion}.$$
Intuition suggested that every entry of this chain should be strictly stronger than majorization, but the matter was not decided. The conjecture under investigation was therefore: *reduction criterion implies majorization*.

## Formal statement

Let $\rho_{AB}$ be a bipartite density matrix on $\mathcal{H}_A \otimes \mathcal{H}_B$ with reductions $\rho_A = \mathrm{Tr}_B \rho_{AB}$ and $\rho_B = \mathrm{Tr}_A \rho_{AB}$.

**Question.** Does the reduction criterion
$$\rho_A \otimes I_B \;\geq\; \rho_{AB} \qquad \text{and} \qquad I_A \otimes \rho_B \;\geq\; \rho_{AB}$$
imply the majorization inequalities
$$\lambda(\rho_{AB}) \;\prec\; \lambda(\rho_A) \qquad \text{and} \qquad \lambda(\rho_{AB}) \;\prec\; \lambda(\rho_B)\,?$$

More broadly: where does majorization sit in the hierarchy of separability/entanglement criteria?

## Status and known progress

- **Status:** solved (affirmatively).
- **Resolution (Hiroshima, 2003):** T. Hiroshima proved that the reduction criterion does imply majorization. The key step is the observation that $\rho_A \otimes I_B \geq \rho_{AB}$ implies the existence of an operator $R$ with $\|R\| \leq 1$ such that
  $$\rho_{AB}^{1/2} \;=\; (\rho_A^{1/2} \otimes I_B)\,R.$$
  From this one constructs a substochastic matrix $S$ with $\lambda(\rho_{AB}) = S\,\lambda(\rho_A)$, which is equivalent to the weak submajorization $\lambda(\rho_{AB}) \prec_w \lambda(\rho_A)$. Since both vectors have the same trace ($= 1$), weak submajorization upgrades to ordinary majorization $\lambda(\rho_{AB}) \prec \lambda(\rho_A)$.
- **Reference of resolution:** T. Hiroshima, *Majorization criterion for distillability of a bipartite quantum state*, Phys. Rev. Lett. **91**, 057902 (2003); arXiv:quant-ph/0303057 (2003).
- **Consequence.** The full implication chain extends to
  $$\text{separable} \;\Rightarrow\; \text{PPT} \;\Rightarrow\; \text{undistillable} \;\Rightarrow\; \text{reduction} \;\Rightarrow\; \text{majorization},$$
  placing majorization as the weakest criterion in this hierarchy.
- **Earlier partial result.** Vollbrecht and Wolf showed that the reduction criterion implies positivity of conditional Renyi entropies for every value of the entropic parameter. This is implied by, but strictly weaker than, the majorization conclusion.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 9, pp. 32–33 (proposed by M. M. Wolf, 12 Feb 2002).
- M. A. Nielsen and J. Kempe, *Separable states are more disordered globally than locally*, Phys. Rev. Lett. **86**, 5184 (2001); arXiv:quant-ph/0011117.
- A. Peres, *Separability criterion for density matrices*, Phys. Rev. Lett. **77**, 1413 (1996); arXiv:quant-ph/9604005.
- M. Horodecki, P. Horodecki, and R. Horodecki, *Mixed-state entanglement and distillation: Is there a "bound" entanglement in nature?*, Phys. Rev. Lett. **80**, 5239 (1998); arXiv:quant-ph/9801069.
- M. Horodecki and P. Horodecki, *Reduction criterion of separability and limits for a class of distillation protocols*, Phys. Rev. A **59**, 4206 (1999); arXiv:quant-ph/9708015 (1997).
- N. J. Cerf, C. Adami, and R. M. Gingrich, *Reduction criterion for separability*, Phys. Rev. A **60**, 898 (1999); arXiv:quant-ph/9710001 (1997).
- K. G. H. Vollbrecht and M. M. Wolf, *Conditional entropies and their relation to entanglement criteria*, arXiv:quant-ph/0202058 (2002).
- T. Hiroshima, *Majorization criterion for distillability of a bipartite quantum state*, Phys. Rev. Lett. **91**, 057902 (2003); arXiv:quant-ph/0303057.
