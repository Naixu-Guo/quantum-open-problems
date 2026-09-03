---
id: 01M1HME7807354SRPYBPD8BS32
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Reduction criterion implies majorization?
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-reduction-criterion-majorization
origin: source-stated
posed: 2002-02-12
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
For bipartite quantum states there is a hierarchy of separability/entanglement criteria. A bipartite state is *separable* if it can be written as a convex combination of product states. Separability implies the Peres positive-partial-transpose (PPT) criterion ($\rho^{T_B} \geq 0$). PPT states are *undistillable*, and any undistillable state in turn satisfies the *reduction criterion*: $\rho_A \otimes I_B \geq \rho_{AB}$ and $I_A \otimes \rho_B \geq \rho_{AB}$.

A distinct family of criteria based on the *spectra* of $\rho_{AB}$ and its reductions also exists. Nielsen and Kempe proved that every separable state is *more disordered globally than locally* in the strong sense of majorization:
$$\lambda(\rho_{AB}) \prec \lambda(\rho_A), \qquad \lambda(\rho_{AB}) \prec \lambda(\rho_B).$$
Majorization is more stringent than entropic comparisons; in particular it implies $S(\rho_A) \leq S(\rho_{AB})$ for every Schur-concave entropy.

At the time of posing (2002) it was unknown where the majorization criterion sat inside the established implication chain
$$\text{separable} \;\Rightarrow\; \text{PPT} \;\Rightarrow\; \text{undistillable} \;\Rightarrow\; \text{reduction criterion}.$$
Intuition suggested that every entry of this chain should be strictly stronger than majorization, but the matter was not decided. The conjecture under investigation was therefore: *reduction criterion implies majorization*.
