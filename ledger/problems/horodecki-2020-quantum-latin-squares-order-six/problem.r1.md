---
id: 01M1HME780X5MBH1S4BS17AV7W
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Quantum orthogonal Latin squares of order six (quantum 36 officers of Euler)
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - horodecki-2020-quantum-latin-squares-order-six
origin: source-stated
posed: "2020"
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
A classical Latin square of order $N$ is an $N\times N$ array filled with $N$ copies of $N$ symbols such that each symbol appears exactly once per row and once per column. Two Latin squares $A,B$ of order $N$ are orthogonal (forming a Graeco-Latin square) if the $N^2$ ordered pairs $(A_{ij},B_{ij})$ are all distinct. In 1782 Euler asked whether two orthogonal Latin squares of order six exist — equivalently, whether 36 officers of six different ranks from six different regiments can be arranged on a $6\times 6$ parade ground so that each row and each column contains exactly one officer of each rank and each regiment. Euler conjectured the answer was negative; Tarry confirmed this in 1901 by exhaustive enumeration.

A quantum Latin square of order $N$ generalizes this classical object: it is an $N\times N$ array of vectors in $\mathcal{H}_N$ such that each row and each column is an orthonormal basis. Two quantum Latin squares $A$ and $B$ are orthogonal (forming a pair of orthogonal quantum Latin squares, OQLS) if the $N^2$ tensor-product entries $\lvert A_{ij}\rangle\otimes\lvert B_{ij}\rangle\in\mathcal{H}_N\otimes\mathcal{H}_N$ form an orthonormal basis, and moreover for every row (column) the equal-amplitude superposition of the cells is the maximally entangled state. The existence of such a pair in dimension $N$ is equivalent to the existence of an absolutely maximally entangled (AME) state of four $N$-level systems and to the existence of a $2$-unitary matrix in $\mathcal{U}(N^2)$, equivalently to a perfect tensor with four indices each running from $1$ to $N$. Scott (2004) and Huber–Gühne–Siewert (2017) showed that AME states do not exist for four qubits ($N=2$) nor for $m\geq 8$ qubits, and Huber–Wyderka maintain an online catalogue of known AME states. For $N=6$ the existence question was open until very recently.
