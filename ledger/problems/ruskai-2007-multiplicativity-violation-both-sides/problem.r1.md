---
id: 01M1HME780B8E8VVQ6WDPAMRV1
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Channel(s) violating $p$-norm multiplicativity for both $p_1>1$ and $0<p_2<1$
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - ruskai-2007-multiplicativity-violation-both-sides
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
A central thread in quantum information theory has been the question of whether minimum output entropy and related output-purity quantities are additive under tensor products of channels. The 2007 source contains sign and extremum typographical inconsistencies: its $p\to1$ convention requires $1/(1-p)$ for Rényi entropy, while the usual maximal-output $p$-norm uses a supremum. Problem 18 itself explicitly asks about equation (26), the minimum output standard Rényi entropy, and that is the convention audited here.

For $p>1$, Amosov, Holevo and Werner conjectured that
$$\nu_p(\Phi\otimes\Omega) \;=\; \nu_p(\Phi)\,\nu_p(\Omega) \qquad (p>1)$$
and, for that range, equivalently in Rényi-entropy form,
$$S^p_{\min}(\Phi\otimes\Omega) \;=\; S^p_{\min}(\Phi)+S^p_{\min}(\Omega) \qquad (p\ge 0).$$
The $p\to 1$ limit is the von Neumann minimal-output-entropy additivity conjecture, which Shor showed to be globally equivalent to the additivity of Holevo capacity and of entanglement of formation.

Following Ruskai's BIRS workshop (Banff, Feb 2007), several breakthroughs landed: Winter (July 2007, arXiv:0707.0402) produced counter-examples for every $p>2$, and Hayden (arXiv:0707.3291) extended this to all $1<p<2$, with the $p=2$ case then handled by Winter. Counter-examples for $p=0$ had been found earlier by Harrow, Leung and Winter using nearly maximally entangled states in large dimensions, and at that time it appeared "only a matter of time" until counter-examples would be exhibited for arbitrary $p\in(0,1)$.

Strikingly, all these constructions are non-uniform in $p$: as $p$ approaches $1$, the dimension of the counter-example channel must blow up, and the channel itself must be replaced. Moreover, the constructions used for $p>1$ and $p<1$ are structurally different (different Kraus operators, different entanglement structures). It is therefore natural to ask whether one and the same channel — or one and the same pair of channels — can be shown to fail multiplicativity on both sides of $p=1$. A negative answer would imply that one can always approach $p=1$ either from above or below, and would re-open a route towards the additivity conjecture for $p=1$ itself.
