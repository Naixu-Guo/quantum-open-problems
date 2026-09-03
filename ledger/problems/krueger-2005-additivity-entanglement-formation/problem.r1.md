---
id: 01M1HME780CD7QZP2SPTQ99Y8W
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Additivity of Entanglement of Formation
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-additivity-entanglement-formation
origin: source-stated
posed: 2001-11-16
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
The *entanglement of formation* $E_F$, introduced by Bennett, DiVincenzo, Smolin and Wootters [BD96; quant-ph/9604024], is one of the central measures of bipartite entanglement. It is defined for any bipartite density operator $\rho$ as

$$E_F(\rho) = \inf\Bigl\{\;\sum_i r_i\,S(\rho_i|A)\;\;\Big|\;\;\sum_i r_i \rho_i = \rho\,\Bigr\},$$

where $S(\cdot)$ is the von Neumann entropy, $\rho_i|A$ denotes the restriction of $\rho_i$ to Alice's subsystem, and $\{r_i, \rho_i\}$ ranges over all convex decompositions of $\rho$. Because $S$ is concave, the infimum is always attained on a pure-state decomposition, and the definition is usually given in this restricted form.

The motivation for studying additivity is that any operationally meaningful "resource" measure should be additive on independently prepared copies: if Alice and Bob have a bipartite state $\rho^{(1)}$ from one source and an independent bipartite state $\rho^{(2)}$ from another (treating the two Alice subsystems together and the two Bob subsystems together as one bipartite system), then preparing the pair should cost exactly the sum of the individual costs. Plugging optimal individual decompositions into the joint variational expression gives the easy direction

$$E_F(\rho^{(1)} \otimes \rho^{(2)}) \;\le\; E_F(\rho^{(1)}) + E_F(\rho^{(2)}).$$

The non-trivial — and longstanding — question is whether equality always holds. The status of this additivity conjecture had become tied, by a chain of equivalences due to Shor, to the additivity conjectures for minimum output entropy and the Holevo capacity of quantum channels. This makes it a focal point of quantum Shannon theory.
