---
id: 01M1HME7809FHXG73N4X83XHK0
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Asymptotic cloning is state estimation?
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-asymptotic-cloning-state-estimation
origin: source-stated
posed: 2005-02-10
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
Two of the most basic limitations on quantum information are no-cloning and the finite information content of a quantum measurement. The two are intimately connected: if one could clone an unknown state, one could measure copies separately and beat the Holevo bound; conversely, if one could perfectly estimate an unknown state from finitely many copies, one could reprepare arbitrarily many high-fidelity copies, again contradicting no-cloning.

These intuitions are made quantitative by *optimal cloning theory* and *optimal state-estimation theory*. Given an input ensemble $\mu$ on pure states of $\mathbb{C}^d$, one defines:

- $F(N,M)$: the best single-copy fidelity, averaged over $\mu$ and over all $M$ output clones, achievable by an $N$-to-$M$ cloning channel.
- $F(N,\infty)$: the best single-copy fidelity achievable by a "measure-and-reprepare" strategy, in which one first measures the $N$ input copies (obtaining a classical estimate) and then reprepares any number of identical output copies according to the estimate. Since any such strategy is a particular $N$-to-$M$ cloner for any $M$, $F(N,M) \ge F(N,\infty)$ for all $M$; equivalently, $F(N,M)$ is non-increasing in $M$, and the limit $F(N,\infty) = \lim_{M\to\infty} F(N,M)$ always exists and satisfies $F(N,\infty) \ge F_{\text{measure-then-prepare}}(N)$.

For all examples in which both quantities had been explicitly computed at the time of the problem statement — universal cloning of qubits and qudits (Bruss–Ekert–Macchiavello and others), phase-covariant cloning (Bruss–Cinchetti–D'Ariano–Macchiavello), Keyl–Werner optimal cloning for arbitrary input distributions — the limit formula held: $F(N,\infty)$ as computed from cloning agreed with the best measure-and-reprepare fidelity. The folklore expectation is that this is general: "asymptotic cloning equals state estimation". But the naïve argument (clone many times, then statistically measure the clones, then reprepare) is suspect because the clones produced by the optimal cloner are typically *correlated* (often entangled) — measurement statistics on them are not the same as on independent copies of the input state.
