---
id: 01M1HME780CC21XQAXBTWRJRCY
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Collective cost of tensor-power state preparation
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - v2-collective-cost-of-tensor-power-state-preparation
  - open-problem-v2-problem-16
  - op-56cf60cdecde44f7
origin: source-stated
posed: null
areaIds:
  - quantum-information
topicIds: []
keywords:
  - Quantum state preparation
  - Quantum circuit complexity
  - Qubit systems
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
The exact and approximate tensor-power preparation questions are posed in the
open-problem collection of Krüger and Werner; Scarani et al. independently
identify collective product-state preparation complexity as an open direction
[KW05],
[SIG+05].

## Comment

The exact cost model and its approximate variant are posed in the source
collection [KW05]; a cloning review also
identifies product-preparation complexity as an open direction
[SIG+05].  The state is known, so the problem
is not universal cloning.  The unresolved quantity is the collective saving
in Eqs. \eqref{eq:p16-regularized-cost} and
\eqref{eq:p16-approximate-preparation-cost} for this specific continuous gate
metric.

## Progress items without a cited source

- Independent preparation gives
  $C_n(\psi)\le nC_1(\psi)$.  Concatenation gives
  $C_{n+k}(\psi)\le C_n(\psi)+C_k(\psi)$, so Fekete's lemma establishes the
  equality in Eq. \eqref{eq:p16-regularized-cost}.  These elementary bounds do
  not decide whether the inequality can be strict.

Imported from `open_problem_v2/problem_pool/problem_16.tex` (source id `op_56cf60cdecde44f7`, source status "Unsolved"). Awaiting admission review.
