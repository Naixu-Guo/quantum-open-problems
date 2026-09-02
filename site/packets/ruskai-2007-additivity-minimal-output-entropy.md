# AI research brief: Additivity of minimal output (von Neumann) entropy of quantum channels

- Record ID: ruskai-2007-additivity-minimal-output-entropy
- Record revision (SHA-256): a4edfca46eab059776efd5fe373f1e76a51cc79fbf363c8f1cc7d1bb381b1cb8
- Formal statement digest (SHA-256): f6145c52c23df052e3cbb969c57d8502b983a6bc8822efe908e89686743c18e2
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Ruskai
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/ruskai-2007-additivity-minimal-output-entropy/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/ruskai-2007-additivity-minimal-output-entropy.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Additivity+of+minimal+output+%28von+Neumann%29+entropy+of+quantum+channels

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Open problems in quantum information theory
- Authors: Mary Beth Ruskai
- Venue: arXiv:0708.1902 [quant-ph] (2007); based on BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007
- Statement locator: p. 16 (Problem 22)
- Read source: https://doi.org/10.48550/arXiv.0708.1902

## Why it matters

Additivity would have meant that entanglement across the input of a product channel cannot lower the output entropy below the product-state minimum, and Shor had shown the statement globally equivalent to additivity of the Holevo capacity, additivity of the entanglement of formation, and its strong superadditivity.

## Notation

| Symbol | Meaning |
|---|---|
| $M_d$ | algebra of $d\times d$ complex matrices |
| $\Phi,\Omega$ | quantum channels (completely positive trace-preserving maps) on matrix algebras |
| $\Phi\otimes\Omega$ | tensor product channel on $M_{d_\Phi}\otimes M_{d_\Omega}$ |
| $\gamma$ | input density matrix, $\gamma\ge 0$, $\operatorname{Tr}\gamma=1$ |
| $S(\rho)$ | von Neumann entropy, $S(\rho)=-\operatorname{Tr}\rho\log\rho$ |
| $S_{\min}(\Phi)$ | minimal output entropy of $\Phi$, $S_{\min}(\Phi)=\inf_\gamma S[\Phi(\gamma)]$ |
| $\chi^*(\Phi)$ | Holevo (classical) capacity of $\Phi$ |
| $E_F$ | entanglement of formation |

## Formal statement

**Problem 22 (Ruskai 2007).** Prove the additivity of minimal output entropy,
$$S_{\min}(\Phi\otimes\Omega) \;=\; S_{\min}(\Phi)+S_{\min}(\Omega) \tag{23}$$
for every pair of quantum channels $\Phi,\Omega$, or else find a counter-example.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2009: Hastings refutes additivity of the minimal output entropy

- Evidence: Peer reviewed; Exact counterexample
- Finding: Hastings constructs pairs of random unitary channels, the second obtained from the first by complex conjugation, for which the maximally entangled input makes S_min of the product strictly smaller than the sum of the individual minimal output entropies. The argument uses concentration of measure for random unitary Kraus operators in large but finite dimension, and via Shor's equivalence it simultaneously refutes additivity of the Holevo capacity and of the entanglement of formation.
- Source: https://arxiv.org/abs/0809.3972

## Scope and cautions

- Scope: The magnitude of the violation is small and the dimensions required are enormous; how much capacity superadditivity can occur, and for which channel families, remains a very active subject.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
