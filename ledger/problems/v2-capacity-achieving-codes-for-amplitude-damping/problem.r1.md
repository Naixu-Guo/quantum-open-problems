---
id: 01M1HME780H9TAVH85TF8KJDS5
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Capacity-achieving codes for amplitude damping
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - v2-capacity-achieving-codes-for-amplitude-damping
  - open-problem-v2-problem-2
  - op-fcd21a1a5021e464
origin: source-stated
posed: null
areaIds:
  - quantum-information
topicIds: []
keywords:
  - Amplitude-damping channels
  - Quantum capacity
  - Quantum coding theory
  - Quantum polar codes
  - Degradable channels
  - Qubit systems
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
This constructive gap is implicit in the exact capacity formula of Wolf and
Pérez-García and the polar-code construction of Wilde and Guha, which
attains only the symmetric coherent-information rate for this channel
[WPG07],
[WG13].

## Comment

Because the amplitude-damping channel is nonunital, the maximizing population
$q$ in Eq. \eqref{eq:p2-capacity} is generally not $1/2$.  Renes' asymmetric
polar construction incorporates this input shaping and supplies an explicit
capacity-achieving decoder, thereby solving the problem in the asymptotic
coding sense.  Reducing the decoder complexity below $O(N^2)$ remains a
separate algorithmic question.

Imported from `open_problem_v2/problem_pool/problem_2.tex` (source id `op_fcd21a1a5021e464`, source status "Solved"). Awaiting admission review.
