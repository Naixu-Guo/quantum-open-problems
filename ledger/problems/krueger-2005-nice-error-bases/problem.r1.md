---
id: 01M1HME780A30VR57AXQZG6HY7
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Nice error bases
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-nice-error-bases
origin: source-stated
posed: 2001-11-08
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
In quantum information theory one often needs an *orthogonal basis of unitaries*: a collection of $d^2$ unitaries $U_1, \ldots, U_{d^2}$ on a $d$-dimensional Hilbert space such that $\mathrm{tr}(U_i^{*} U_j) = d\,\delta_{ij}$. Such bases are exactly what is required to construct teleportation and dense-coding schemes (Werner [quant-ph/0003070]) and they underlie much of the theory of stabilizer quantum codes.

Two large families of such bases are particularly important:

- **Nice error bases** (Knill [quant-ph/9608049]): orthogonal bases of unitaries in which the product of any two basis elements is again a basis element up to a phase, $U_i U_j = \text{(phase)} \cdot U_k$. The composition rule $(i,j) \mapsto k$ defines a group on the labels, called the *index group*; the full algebraic object is a central extension of this group, called an *abstract error group*. The standard example for $d=2$ is the Pauli matrices (together with the identity); the standard generalisation for general $d$ is the discrete Weyl–Heisenberg group, which is of "shift and multiply" type.
- **Shift and multiply type bases** are those whose unitaries are obtained as products of $d$ permutation operators ("shift" part, classified by Latin squares) and $d$ unitary diagonal multiplication operators ("multiply" part, classified by complex Hadamard matrices).

Both families produce bases that are useful for code-construction; both also have rich combinatorial structure. The question posed here is whether the algebraic ("nice") and combinatorial ("shift and multiply") notions in fact coincide.
