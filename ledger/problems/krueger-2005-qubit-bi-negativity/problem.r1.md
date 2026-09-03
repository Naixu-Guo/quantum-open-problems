---
id: 01M1HME780R7TNDDHZDNQKZRTV
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Qubit bi-negativity
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-qubit-bi-negativity
origin: source-stated
posed: 2003-02-10
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
Negativity-based entanglement measures sit at the heart of the resource theory of mixed-state entanglement, because they can actually be computed: the partial transpose is a simple linear map, its eigenvalues are accessible numerically, and the resulting quantities (negativity, logarithmic negativity) are entanglement monotones under local operations and classical communication.

Beyond the negativity itself, several monotones involve more elaborate "second-order" combinations of partial transposes. Audenaert, De Moor, Vollbrecht and Werner (AMVW02), in their study of the asymptotic relative entropy of entanglement for orthogonally invariant states, introduced the operator
$$\bigl\lvert\sigma^{T_2}\bigr\rvert^{T_2},$$
the partial transpose of the operator absolute value of the partial transpose of $\sigma$. The positivity of this operator, called the *bi-negativity* condition, is closely related to additivity of logarithmic negativity on tensor products and to the structure of PPT entanglement measures.

For general bipartite systems the operator $\lvert\sigma^{T_2}\rvert^{T_2}$ need not be positive — it can have small negative eigenvalues. However, when both subsystems are qubits ($2\times 2$ systems) the available numerical and analytical evidence suggests that positivity always holds. The "qubit bi-negativity conjecture" of AMVW02 asserts exactly this: for every two-qubit density operator the partially transposed absolute value of the partial transpose is positive. A proof would simplify the structure of negativity-based entanglement quantities in the simplest interesting bipartite regime and would have consequences for additivity of the logarithmic negativity on two-qubit pairs.
