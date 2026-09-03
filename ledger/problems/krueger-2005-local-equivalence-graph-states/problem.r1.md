---
id: 01M1HME7803PD22Y12YJ6R552G
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Local Equivalence of Graph States
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-local-equivalence-graph-states
origin: source-stated
posed: 2005-04-21
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
A graph state $|\psi_G\rangle$ is a multi-qubit pure state attached to a simple undirected graph $G$ with $n$ vertices; each vertex carries a qubit and each edge encodes a controlled-phase entangling interaction. Equivalently, in the computational basis,
$$\langle q_1,q_2,\dots,q_n|\psi_G\rangle = 2^{-n/2}\,\prod_{(i,j)\in E(G)}(-1)^{q_i q_j} ,$$
and $|\psi_G\rangle$ can be characterised as the unique joint $+1$ eigenstate of the $n$ stabiliser generators
$$K_i = X^{(i)}\!\!\prod_{j:\,(i,j)\in E(G)}\!\!Z^{(j)},\qquad i=1,\dots,n .$$
Graph states are central in measurement-based quantum computation and quantum error correction; the Clifford group $\mathcal{C}_n$ is the natural symmetry group of stabiliser states.

Two natural equivalence relations on $n$-qubit states are *local unitary* (LU) equivalence — both states are connected by a product of arbitrary single-qubit unitaries — and *local Clifford* (LC) equivalence — the same with each single-qubit unitary restricted to the single-qubit Clifford group $\mathcal{C}_1$. LC is the equivalence preserving the stabiliser-state structure, and admits a clean combinatorial description (Van den Nest, Dehaene, De Moor 2004): two graph states are LC-equivalent iff their underlying graphs are related by a sequence of *local complementations*. Decision and enumeration of LC equivalence are therefore well understood and computable.

LU equivalence is a finer notion. Trivially LC equivalence implies LU equivalence; whether the converse holds for graph states — equivalently, whether *every* LU-equivalence among graph states can already be realised by LC operations — is the LU=LC conjecture. A positive answer would mean that the easy-to-handle combinatorial classification of stabiliser states by local complementations is the *complete* classification of graph states by single-qubit unitaries; a negative answer would force a richer, non-combinatorial theory of LU classes. This is the open problem under consideration.
