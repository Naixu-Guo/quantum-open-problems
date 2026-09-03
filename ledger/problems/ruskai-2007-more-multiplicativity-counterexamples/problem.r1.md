---
id: 01M1HME780A83VXQ5HNPCTND8H
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: More counterexamples to the multiplicativity conjecture (eq. 24)
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - ruskai-2007-more-multiplicativity-counterexamples
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
A *quantum channel* is a completely positive trace-preserving (CPT) linear map between matrix algebras. The Schatten $p$-norm of an output, $\|\Phi(\gamma)\|_p=(\operatorname{Tr}|\Phi(\gamma)|^p)^{1/p}$, is a measure of output purity. Its maximum
$$\nu_p(\Phi)=\sup_\gamma\|\Phi(\gamma)\|_p$$
is the *maximal output $p$-norm*. The multiplicativity conjecture, attributed to Amosov, Holevo, and Werner, is the statement
$$\nu_p(\Phi\otimes\Omega)=\nu_p(\Phi)\,\nu_p(\Omega) \tag{24}$$
for all CPT maps $\Phi,\Omega$ and a relevant range of $p$. In Rényi form, eq. (24) is equivalent to
$$S^p_{\min}(\Phi\otimes\Omega)=S^p_{\min}(\Phi)+S^p_{\min}(\Omega), \tag{26}$$
and as $p\to 1$ this reduces to the additivity conjecture for minimal output entropy,
$$S_{\min}(\Phi\otimes\Omega)=S_{\min}(\Phi)+S_{\min}(\Omega), \tag{23}$$
which is in turn known by Shor's reduction to be globally equivalent to the additivity of Holevo capacity and several entanglement-of-formation conjectures.

By summer 2007, the only known counterexample to (24) was Werner and Holevo's WH channel, which fails (24) for $p>4.79$ and only mildly perturbed variants. Some authors had conjectured that (24) holds for $1\le p\le 2$, and more generally that if it holds on $1<p<p_c$ then counterexamples should appear for $p>p_c$ arbitrarily close to $p_c$. Problem 11 asks for *more* counterexamples and what they reveal about the conjectured "safe" range.
