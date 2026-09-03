---
id: 01M1HME7804F99WGATABEG18YG
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Continuity of the quantum channel capacity
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-continuity-quantum-channel-capacity
origin: source-stated
posed: 2003-06-20
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
A noisy quantum channel $T$ has a quantum capacity $Q(T)$ equal to the largest rate at which it can faithfully transmit qubits when used many times in parallel, with arbitrary encoding and decoding by quantum operations. In contrast to classical Shannon capacity, $Q$ is defined only via a regularisation limit and is known to display several surprising features: it can be strictly superadditive on tensor products, it cannot be expressed by any known single-letter formula, and it depends discontinuously on the very nature of the noise in subtle ways (e.g. zero-capacity channels can combine to give positive capacity, the phenomenon of superactivation).

A natural mathematical question is whether $Q$, regarded as a function from the metric space of quantum channels (equipped with the cb-norm, equivalently the diamond norm) to the real line, is continuous. Continuity would entail that if the noise model $T$ is known only up to a small uncertainty $\varepsilon$ in cb-norm, then the available transmission rate is also known up to a vanishing error. Such a robustness property is fundamental for both the theoretical analysis of capacities and the practical design of fault-tolerant protocols.

It is already known, by an argument due to Keyl and Werner, that $Q$ is lower semi-continuous: small cb-perturbations cannot abruptly decrease the capacity. Upper semi-continuity, however, is delicate: the regularisation
$$Q(T) \;=\; \lim_{n\to\infty}\,\frac{1}{n}\,Q^{(1)}(T^{\otimes n})$$
involves an unbounded number of channel uses, and small changes in $T$ can in principle accumulate exponentially.
