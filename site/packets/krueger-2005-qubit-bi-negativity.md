# AI research brief: Qubit bi-negativity

- Record ID: krueger-2005-qubit-bi-negativity
- Record revision (SHA-256): 94b01645019b01b398bee5aad49da4cf3d33ebfc851f54dfbd951d0f8314b9fa
- Formal statement digest (SHA-256): 7a41d58ca967352317e625f2aa154989ef306b5a2e728bc6bbed4b85adf4bb12
- Status: Solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-qubit-bi-negativity/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-qubit-bi-negativity.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Qubit+bi-negativity

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 53 (Problem 18)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The inequality controls bi-negativity and connects logarithmic negativity with entanglement cost under PPT-preserving operations for two-qubit states.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Two-dimensional (qubit) Hilbert spaces of subsystems $A$ and $B$ |
| $\sigma$ | A density operator (positive trace-1 Hermitian operator) on $\mathcal{H}_A\otimes\mathcal{H}_B$ |
| $T_2$ | Partial transposition with respect to the second subsystem $B$ |
| $\sigma^{T_2}$ | The operator obtained from $\sigma$ by partial transposition with respect to $B$ |
| $\lvert X\rvert$ | The operator absolute value, $\lvert X\rvert = \sqrt{X^* X}$ for an operator $X$ |
| $\bigl\lvert\sigma^{T_2}\bigr\rvert^{T_2}$ | Partial transposition (again w.r.t. $B$) of the operator absolute value of $\sigma^{T_2}$ |
| $A \ge 0$ | The operator $A$ is positive semidefinite |
| $\lVert X\rVert_1$ | Trace norm of $X$, equal to $\operatorname{tr}\lvert X\rvert$ |
| $\mathcal{N}(\sigma)$ | Negativity of $\sigma$, $\mathcal{N}(\sigma) = (\lVert\sigma^{T_2}\rVert_1 - 1)/2$ |
| $\log\lVert\sigma^{T_2}\rVert_1$ | Logarithmic negativity (entanglement monotone) |

## Formal statement

Let $\mathcal{H}_A$ and $\mathcal{H}_B$ be two-dimensional complex Hilbert spaces, and let $\sigma$ be any density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$. Let $T_2$ denote partial transposition with respect to $\mathcal{H}_B$. Prove that
$$\bigl\lvert\sigma^{T_2}\bigr\rvert^{T_2} \;\ge\; 0,$$
where $\lvert X\rvert := \sqrt{X^* X}$ is the operator absolute value.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2004: The two-qubit bi-negativity conjecture holds

- Evidence: Peer reviewed; Exact theorem
- Finding: Ishizaka proves that the second partial transpose of the absolute value of a two-qubit state's partial transpose is positive semidefinite.
- Source: https://arxiv.org/abs/quant-ph/0308056

## Scope and cautions

- Scope: The affirmative result is specific to two qubits; higher-dimensional failures do not affect the archived statement.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
