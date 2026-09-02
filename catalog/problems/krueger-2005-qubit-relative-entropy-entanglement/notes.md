# Qubit formula for Relative Entropy of Entanglement

## Background

The relative entropy of entanglement is a central entanglement monotone in quantum information theory. It quantifies, in the operational sense of Stein's lemma in quantum hypothesis testing, how well a given bipartite state can be distinguished from the closest state that is either separable or has a positive partial transpose. Geometrically it is the relative-entropy "distance" from the state to the convex set of unentangled (or PPT) states, and it serves as an upper bound on distillable entanglement; in its regularised (asymptotic) form it has been conjectured to coincide with the Rains bound.

For most entanglement monotones, evaluation reduces to solving an optimisation problem. In the case of the relative entropy of entanglement, this optimisation is convex (the relative entropy is jointly convex and $D$ is a convex set), but the minimisation has nonetheless resisted closed-form solution even in the smallest non-trivial setting of two qubits.

The contrast with the entanglement of formation $E_F$ is striking. $E_F$ is also defined as an optimisation, yet for two-qubit systems Wootters obtained a celebrated closed formula based on the concurrence. The Wootters formula relies on special structural features of $\mathbb{C}^2 \otimes \mathbb{C}^2$ (in particular the structure of optimal decompositions identified by Vollbrecht and Werner). It is therefore natural to ask whether a similar miracle occurs for $E_R$: is there an explicit, closed-form expression for the relative entropy of entanglement of an arbitrary two-qubit state?

## Status and known progress

- **Status:** open. As stated in the source, no published closed-form expression for the two-qubit relative entropy of entanglement is known.
- **Partial result (Ishizaka 2003):** For a related problem on two-qubit systems — namely, given a state $\sigma$ on the boundary $\partial D$ of the separable states, characterise those $\rho$ for which $E_R(\rho) = S(\rho \,\|\, \sigma)$ — Ishizaka provided a complete characterisation. This determines the set of $\rho$ for which a given separable $\sigma$ is an optimiser, but does not yield an explicit formula $\rho \mapsto E_R(\rho)$ for arbitrary $\rho$.
- **Context:** The corresponding two-qubit problem for the entanglement of formation was famously solved by Wootters via the concurrence formula, relying on properties (such as the existence of decompositions with constant pure-state entanglement) particular to $\mathbb{C}^2 \otimes \mathbb{C}^2$ identified by Vollbrecht and Werner. No analogous closed expression has been established for $E_R$.
- Subsequent work has produced explicit formulas for restricted families (Bell-diagonal states and certain symmetric families) and tight numerical/analytical methods, but a fully closed-form expression in the spirit of Wootters' concurrence formula remains unavailable in the general two-qubit case.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 8, pp. 30–31 (proposed by J. Eisert, 20 June 2003).
- V. Vedral and M. B. Plenio, *Entanglement measures and purification procedures*, Phys. Rev. A **57**, 1619 (1998).
- W. K. Wootters, *Entanglement of formation of an arbitrary state of two qubits*, Phys. Rev. Lett. **78**, 5022 (1997).
- K. G. H. Vollbrecht and R. F. Werner, *Entanglement measures under symmetry*, J. Math. Phys. **41**, 6772 (2000).
- S. Ishizaka, *Analytical formula connecting entangled states and the closest disentangled state*, Phys. Rev. A **67**, 060301(R) (2003).
