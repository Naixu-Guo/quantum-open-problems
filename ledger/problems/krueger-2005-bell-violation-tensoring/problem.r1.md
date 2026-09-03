---
id: 01M1HME780F7T7ZKY3PNTNYTM4
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Bell violation by tensoring
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-bell-violation-tensoring
origin: source-stated
posed: 2005-02-08
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
Bell non-locality is a non-additive resource in a striking and somewhat counterintuitive way. Whereas entanglement is preserved under tensor products (a tensor product of entangled states is entangled) and most entanglement measures are weakly additive or super-additive, Bell-non-locality can *activate*: a state $\rho$ which, on its own, satisfies all CHSH inequalities may, when tensored with itself or with another similarly "local" state $\rho'$, produce a joint state $\rho\otimes\rho'$ that *does* violate CHSH on the joint system.

This phenomenon, often called "super-activation of non-locality" or "hidden non-locality", was first systematically studied by Peres (1996), who exhibited states with hidden non-locality, and later by Liang and Doherty, Navascués and Vértesi, Palazuelos, and others. It is part of a broader pattern: nonlocality, entanglement distillation and steering all exhibit activation phenomena that are forbidden for entanglement itself.

The cleanest version of the question — fixed by Y. C. Liang in this problem — restricts attention to the simplest Bell scenario, namely CHSH. Concretely: can one find a pair of bipartite states $\rho_1$ and $\rho_2$ such that *neither* $\rho_1$ nor $\rho_2$, on its own, violates *any* CHSH inequality, but the joint state $\rho_1\otimes\rho_2$ (with Alice holding both $A$-systems and Bob holding both $B$-systems) *does* violate CHSH? Equivalently, the question asks whether CHSH-non-locality can be "activated" by simply tensoring two CHSH-local states.

For two-qubit states there is a beautiful sufficient and necessary condition for CHSH violation: the Horodecki criterion. Writing $T_\rho$ for the correlation matrix $T_{\rho;ij}=\operatorname{tr}(\rho\,\sigma_i\otimes\sigma_j)$, a two-qubit $\rho$ violates some CHSH inequality iff $M(\rho) := \lambda_1(T_\rho^* T_\rho) + \lambda_2(T_\rho^* T_\rho) > 1$, where $\lambda_1,\lambda_2$ are the two largest eigenvalues. This makes the two-qubit version of the problem amenable to direct computation.
