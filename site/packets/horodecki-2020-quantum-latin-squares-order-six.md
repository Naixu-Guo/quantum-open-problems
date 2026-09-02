# AI research brief: Determine whether there exist two quantum orthogonal Latin squares of order six (quantum 36 officers of Euler)

- Record ID: horodecki-2020-quantum-latin-squares-order-six
- Record revision (SHA-256): af12b08b729f088eeaf2d70467b755dffa280342aaccd83cc983d98cf4321c90
- Formal statement digest (SHA-256): 1c5498a5c192c7e07b13fb399c1c73671d6428da1b696dae9b478f7f14479d67
- Status: Solved
- Field: Quantum information
- Topic: Quantum designs
- Collection: Horodecki
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/horodecki-2020-quantum-latin-squares-order-six/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/horodecki-2020-quantum-latin-squares-order-six.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Determine+whether+there+exist+two+quantum+orthogonal+Latin+squares+of+order+six+%28quantum+36+officers+of+Euler%29

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Five open problems in theory of quantum information
- Authors: Paweł Horodecki, Łukasz Rudnicki, Karol Życzkowski
- Venue: PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]
- Statement locator: p. 4-6 (Problem 3)
- Read source: https://doi.org/10.1103/PRXQuantum.3.010101

## Why it matters

Euler conjectured and Tarry proved that no classical pair of orthogonal Latin squares of order six exists, and the quantum version is equivalent to an absolutely maximally entangled state of four six-level systems, a 2-unitary matrix in U(36), a perfect four-index tensor, and a ((4,1,3))_6 quantum code.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Order of a (quantum) Latin square; here $N=6$ |
| $\mathcal{H}_N$ | $N$-dimensional complex Hilbert space |
| $\mathcal{H}_6$ | $6$-dimensional Hilbert space, the relevant subsystem space |
| $\lvert j\rangle$ | Computational-basis vector of $\mathcal{H}_N$, $j=1,\dots,N$ |
| $\lvert\psi_+\rangle$ | Generalized Bell state on $\mathcal{H}_N\otimes\mathcal{H}_N$ |
| $\otimes$ | Tensor (Kronecker) product |
| $\oplus$ | Direct sum of matrices, also Kronecker sum: $A\oplus B=A\otimes\mathbb{1}+\mathbb{1}\otimes B$ |
| $\mathbb{1}_N$ | $N\times N$ identity matrix |
| $\rho_\ast$ | Maximally mixed state, $\rho_\ast=\mathbb{1}_N/N$ |
| $T_{ijkl}$ | Components of a $4$-index tensor used to encode a $4$-partite pure state |
| $U^{\Gamma}$ | Partial transpose of a unitary $U$ acting on a bipartite system |
| $U^R$ | Reshuffling (realignment) of a bipartite matrix $U$ |
| $\mathcal{U}(36)$ | Group of $36\times 36$ unitary matrices |
| $((4,1,3))_6$ | Quantum error correction code on $4$ subsystems with $1$ logical level and distance $3$ over alphabet of size $6$ |
| AME | Absolutely maximally entangled state |
| OQLS | Orthogonal quantum Latin squares |
| MOLS | Mutually orthogonal Latin squares |

## Formal statement

**Problem 3:** *Determine whether there exist two quantum orthogonal Latin squares of order six. In other words, find a solution of the problem of $36$ "entangled officers" of Euler or demonstrate that it does not exist.*

Equivalent reformulations established in the source:
- There exists an AME state of four subsystems with six levels each, i.e. a pure state $\lvert\Psi\rangle\in\mathcal{H}_6^{\otimes 4}$ such that every partition of its four parties into two-against-two yields a maximally mixed reduced state $\rho_\ast=\mathbb{1}_{36}/36$.
- The corresponding quantum error-correction code $((4,1,3))_6$ exists.
- There exists a $2$-unitary matrix $U\in\mathcal{U}(36)$ (a unitary of size $36\times 36$ whose partial transpose $U^\Gamma$ and reshuffling $U^R$ are also unitary).
- There exists a perfect tensor $T_{ijkl}$ with four indices each running from $1$ to $6$.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2022: Explicit AME(4,6) state solves the 36 entangled officers

- Evidence: Peer reviewed; Explicit construction
- Finding: Rather, Burchardt, Bruzda, Rajchel-Mieldzioc, Lakshminarayan and Zyczkowski construct an exact AME(4,6) state, equivalently a pair of orthogonal quantum Latin squares of order six and a 2-unitary matrix in U(36). Numerical iteration led to the construction, but the published object and its verification are exact and analytic, using golden-ratio amplitudes and roots of unity, so the archived existence question is answered affirmatively.
- Source: https://arxiv.org/abs/2104.05122

## Scope and cautions

- Scope: The same paper separately constructs a nonadditive ((3,6,2))_6 code; that is a distinct result from the AME(4,6) construction which settles the archived statement.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
