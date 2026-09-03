---
id: 01M1HME780J0W4KSFMKVTRYDDG
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Additivity of classical capacity and related problems
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-additivity-classical-capacity
origin: source-stated
posed: 2003-01-31
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
A memoryless quantum channel $T$ has several distinct classical-information capacities, depending on which resources (entangled inputs, entangled measurements) are allowed at the encoder and decoder. The four basic capacities are arranged in a diamond:
$$C_{1,\infty} \;=\; \chi \;\geq\; C_{1,1}, \qquad C_{\infty,\infty} \;\geq\; C_{\infty,1} \;=\; C_{1,1},$$
the equality on the right being established by several authors and the equality $C_{1,\infty} = \chi$ being the Holevo–Schumacher–Westmoreland theorem. The full capacity is given by the regularised Holevo quantity,
$$C_{\infty,\infty}(T) \;=\; \lim_{n \to \infty} \frac{1}{n}\,\chi(T^{\otimes n}).$$
Because $\chi$ is superadditive ($\chi(T_1 \otimes T_2) \geq \chi(T_1) + \chi(T_2)$), one always has $C_{\infty,\infty} \geq \chi$. **Additivity** of $\chi$ would force equality and yield a clean single-letter formula for the classical capacity of every quantum channel.

The additivity question is equivalent (via Shor 2003 and earlier reductions by Matsumoto–Shimono–Winter, Audenaert–Braunstein, Pomeransky, Shirokov) to several other apparently distinct conjectures: additivity of the minimal output (von Neumann) entropy $H_{\min}$, additivity of the entanglement of formation, strong superadditivity of EoF, and (at $p \downarrow 1$) multiplicativity of Schatten $p$-norms of completely positive maps:
$$\|T_1 \otimes T_2\|_p \;\stackrel{?}{=}\; \|T_1\|_p\,\|T_2\|_p, \qquad p \geq 1.$$

At the time of posing, additivity was proven in several special cases (identity channel, unital qubit channels, depolarising channel, entanglement-breaking channels), and extensive numerical searches had failed to find a counterexample.
