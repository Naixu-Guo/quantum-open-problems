---
id: 01M1HME780KPFQ5JD36VF6FD11
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Explicit channels violating multiplicativity of maximal output $p$-norm for $p\ne 1$
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - ruskai-2007-explicit-multiplicativity-violations
origin: source-stated
posed: "2007"
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
The Amosov-Holevo-Werner conjecture asserted that the maximal output $p$-norm purity of a quantum channel is multiplicative under tensor product:
$$\nu_p(\Phi\otimes\Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega), \qquad p>1 \tag{24}$$
with the equivalent additivity statement
$$S^p_{\min}(\Phi\otimes\Omega) \;=\; S^p_{\min}(\Phi)+S^p_{\min}(\Omega).$$
Werner and Holevo (*J. Math. Phys.* 43 (2002), 4353-4357) had given a counter-example for $p>4.79$ using a particular qutrit channel (the "WH channel"). In summer 2007, Winter (arXiv:0707.0402) extended this to all $p>2$, and Hayden (arXiv:0707.3291) extended it to all $1<p<2$. The $p=0$ regime was addressed by Harrow, Leung and Winter using random nearly-maximally-entangled subspaces.

A common feature of all these post-WH counter-examples is that they are *existential*: they show that a channel violating (24) must exist (typically by averaging over random unitary Kraus operators and showing positive measure for the violating set), but they do not exhibit any concrete channel. In sharp contrast, the Werner-Holevo construction for $p>4.79$ is genuinely explicit (small dimension, explicit Kraus operators). Having explicit counter-examples in the harder regimes — particularly for $1<p<2$, and for $0<p<1$ — would be valuable for testing related conjectures (CB entropy positivity, coherent information sign, see Problem 21), for numerical experimentation, for refining the structural understanding of how entanglement boosts output purity, and for pedagogy.
