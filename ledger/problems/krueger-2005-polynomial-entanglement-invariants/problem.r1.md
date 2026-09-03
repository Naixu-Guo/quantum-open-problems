---
id: 01M1HME780BQ6B3AGVZ5WEWM28
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Polynomial entanglement invariants
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-polynomial-entanglement-invariants
origin: source-stated
posed: 2000-10-13
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
Two bipartite density operators $\rho$ and $\sigma$ are said to be *equally entangled* if they are related by a local change of basis, i.e., there exist unitaries $U_A, U_B$ such that

$$\rho = (U_A \otimes U_B)\,\sigma\,(U_A \otimes U_B)^{*}.$$

An *entanglement invariant* is any real-valued function on density operators that takes the same value on equally entangled states; a *polynomial invariant* is one that can be expressed as a polynomial in the matrix elements of $\rho$ (allowing complex conjugates does not enlarge the class because $\rho$ is Hermitian). Every homogeneous polynomial of degree $k$ in $\rho$ is of the form $\mathrm{tr}(\rho^{\otimes k} X)$ for some operator $X$; invariance under $U_1^{\otimes k} \otimes \cdots \otimes U_n^{\otimes k}$ forces $X$ to be a tensor product of permutation operators (one for each party) by Schur–Weyl duality. The ring of such invariants has been described in the bipartite and general multipartite cases (Grassl–Rötteler–Beth; Rains).

A natural and basic question is whether these polynomial invariants suffice to distinguish equivalence classes — that is, whether they form a *complete* set of invariants for the action of local unitaries. The "unipartite" version of the analogous question is trivial: density operators are unitarily equivalent if and only if they share the same spectrum, and the spectrum is captured by the polynomial functions $a_n = \mathrm{tr}(\rho^n)$, $n=1, \ldots, \dim$. For bipartite (and multipartite) systems, the question is far more delicate because the symmetry group is a product of local unitaries rather than the full unitary group.
