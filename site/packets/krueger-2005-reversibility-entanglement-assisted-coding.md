# AI research brief: Reversibility of entanglement assisted coding

- Record ID: krueger-2005-reversibility-entanglement-assisted-coding
- Record revision (SHA-256): f6c77cba0f3701d6ecdb0cfbe1de1bc8d320c4094547c1e9b2c03097fc9027f2
- Formal statement digest (SHA-256): ecf52c94c11728e60d57aedb3a1f9bc2e219dec26479b571365a7a362ccd4fb9
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-reversibility-entanglement-assisted-coding/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-reversibility-entanglement-assisted-coding.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Reversibility+of+entanglement+assisted+coding

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 51-52 (Problem 17)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Without free entanglement the resource theory of quantum channels is badly irreversible, whereas free entanglement was conjectured to restore the Shannon-like picture in which any two channels of equal entanglement-assisted capacity simulate each other at unit rate per bit of capacity.

## Notation

| Symbol | Meaning |
|---|---|
| $S$, $T$, $R$ | Quantum channels (completely positive trace-preserving maps) |
| $S_1$ | The ideal noiseless classical 1-bit channel, used as the standard reference channel |
| $C_{\mathrm{E}}(T,S)$ | The entanglement-assisted capacity of $T$ for $S$-messages: the supremum of rates $r$ such that, for large $n$, $rn$ parallel copies of $T$ can be simulated by $n$ copies of $S$ with vanishing error, using free pre-shared entanglement |
| $C_{\mathrm{E}}(T)$ | Entanglement-assisted classical capacity of $T$, defined as $C_{\mathrm{E}}(T) = C_{\mathrm{E}}(T,S_1)$ |
| $C(T,S)$ | The (un-assisted) capacity of $T$ for $S$-messages |
| $n$ | Number of independent uses of the source channel in the simulation |
| $r$, $rn$ | Rate, and number of uses of $T$ available to simulate $n$ uses of $S$ |
| $\otimes$ | Tensor product of channels (parallel use) |

## Formal statement

For any two quantum channels $S$ and $T$, define the entanglement-assisted capacity $C_{\mathrm{E}}(T,S)$ as the supremum of rates $r$ such that, for sufficiently large $n$, $rn$ parallel copies of $T$ can be simulated by $n$ copies of $S$. The simulation may use arbitrary local encoding and decoding operations together with arbitrarily many shared entangled pairs, and its error must vanish as $n \to \infty$.

Prove the *reversibility* identity
$$C_{\mathrm{E}}(T,S) \;=\; C_{\mathrm{E}}(S,T)^{-1}$$
for every pair of quantum channels $S$, $T$.

Equivalently (combined with the easy two-step inequality $C_{\mathrm{E}}(T,S)\,C_{\mathrm{E}}(S,T) \le 1$), show that $C_{\mathrm{E}}(T,S)\,C_{\mathrm{E}}(S,T) = 1$ always.

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2014: Quantum Reverse Shannon Theorem gives the reciprocal identity

- Evidence: Peer reviewed; Exact theorem
- Finding: Bennett, Devetak, Harrow, Shor and Winter prove the full Quantum Reverse Shannon Theorem, and Berta, Christandl and Renner give a one-shot information-theoretic proof. Under the source's convention the theorem yields C_E(T,S) = C_E(S)/C_E(T) = C_E(S,T) to the power minus one for every pair of memoryless channels in the i.i.d. asymptotic resource model, establishing the archived reversibility identity.
- Source: https://arxiv.org/abs/0912.5537

### 2011: Quantum Reverse Shannon Theorem gives the reciprocal identity

- Evidence: Peer reviewed; Exact theorem
- Finding: Bennett, Devetak, Harrow, Shor and Winter prove the full Quantum Reverse Shannon Theorem, and Berta, Christandl and Renner give a one-shot information-theoretic proof. Under the source's convention the theorem yields C_E(T,S) = C_E(S)/C_E(T) = C_E(S,T) to the power minus one for every pair of memoryless channels in the i.i.d. asymptotic resource model, establishing the archived reversibility identity.
- Source: https://arxiv.org/abs/0912.3805

## Scope and cautions

- Scope: The identity is established for memoryless channels in the i.i.d. asymptotic resource model; more general source models can require extra conventions about feedback or embezzling entanglement and should not be inferred from this statement without specifying resources.

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
