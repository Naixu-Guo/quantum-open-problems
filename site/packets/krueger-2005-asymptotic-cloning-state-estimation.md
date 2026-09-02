# AI research brief: Asymptotic cloning is state estimation?

- Record ID: krueger-2005-asymptotic-cloning-state-estimation
- Record revision (SHA-256): 893c5eec526bb8e71b121826c3f71f5152f3a0ded1a28dbfc0a9cf1186f38175
- Formal statement digest (SHA-256): d412584f21f81560a7c8903b3d18e5586b62b95e9f35e23463901442e6d43e6c
- Status: Solved
- Field: Quantum information
- Topic: Quantum channels
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-asymptotic-cloning-state-estimation/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-asymptotic-cloning-state-estimation.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Asymptotic+cloning+is+state+estimation%3F

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 58-59 (Problem 22)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The identity makes precise the link between no-cloning and the finite information content of a quantum measurement, and the naive argument fails because optimal clones are typically correlated or entangled, so measurement statistics on them differ from statistics on independent copies.

## Notation

| Symbol | Meaning |
|---|---|
| $d$ | Dimension of the local quantum system (each state lives in $\mathbb{C}^d$) |
| $\mu$ | A fixed probability measure on the pure states of $\mathbb{C}^d$ |
| $N$ | Number of input copies of an unknown pure state |
| $M$ | Number of output (clone) copies, $M \ge N$ |
| $\mathcal{C}_{N\to M}$ | An $N$-to-$M$ cloning transformation: a CPTP map from $N$ input copies to $M$ output systems |
| $F(N,M)$ | Optimal single-copy fidelity averaged over $\mu$ and over all $M$ output clones, for the best $N$-to-$M$ cloner |
| $F(N,\infty)$ | $\lim_{M\to\infty} F(N,M)$; equivalently, the best mean single-copy fidelity achievable by a "measure-and-reprepare" strategy: measure on $N$ input copies and prepare a state according to the measurement outcome |
| $\lvert\langle\phi\,\vert\,\psi\rangle\rvert^2$ | Fidelity between two pure states $\lvert\phi\rangle$ and $\lvert\psi\rangle$ |

## Formal statement

Fix a dimension $d$ and an arbitrary probability measure $\mu$ on the pure states of $\mathbb{C}^d$. For $N \ge 1$ and $M \ge N$, let $F(N,M)$ be the optimal single-copy fidelity, averaged with respect to $\mu$ and over all $M$ output clones, attained by $N$-to-$M$ cloning transformations. Let $F(N,\infty)$ be the best mean single-copy fidelity achievable by first measuring on $N$ input copies of the state and then repreparing a state according to the measured data.

Decide whether, for every $\mu$ and every $N$,
$$\lim_{M\to\infty} F(N,M) \;=\; F(N,\infty).$$

A weaker but still interesting version of the problem asks whether the equality holds in the further limit $N \to \infty$,
$$\lim_{N\to\infty}\lim_{M\to\infty} F(N,M) \;=\; \lim_{N\to\infty} F(N,\infty).$$

## Resolution

The archived statement is settled. The checked progress below records the settling result and its evidence.

## Checked progress

### 2006: Asymptotic quantum cloning is state estimation

- Evidence: Peer reviewed; Exact theorem
- Finding: Bae and Acin prove the limiting equality in full generality with a short argument via monogamy of entanglement and properties of entanglement-breaking channels. Chiribella and D'Ariano give a complementary independent proof via group-theoretic, de Finetti-type analysis of the asymptotic state of the clones, so the archived conjecture holds for every input distribution and every N.
- Source: https://arxiv.org/abs/quant-ph/0603078

### 2006: Asymptotic quantum cloning is state estimation

- Evidence: Peer reviewed; Exact theorem
- Finding: Bae and Acin prove the limiting equality in full generality with a short argument via monogamy of entanglement and properties of entanglement-breaking channels. Chiribella and D'Ariano give a complementary independent proof via group-theoretic, de Finetti-type analysis of the asymptotic state of the clones, so the archived conjecture holds for every input distribution and every N.
- Source: https://arxiv.org/abs/quant-ph/0608007

## Research protocol

1. Treat the archived statement and its resolution evidence as the record; do not reformulate the target to match the theorem.
2. Report only corrections: an error in the cited resolution, a withdrawn or corrected source, or a mismatch between the theorem and the archived quantifiers.
3. Cite primary sources with theorem, page, equation, or version locators when available.

## Requested output

Return a correction with its exact scope, the supporting argument or artifact, and primary-source links. Propose a status change only when the cited resolution no longer settles the archived statement.
