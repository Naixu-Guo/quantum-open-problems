---
id: 01M1HME780RJA74K3FVRJC7079
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Stronger Bell inequalities for Werner states?
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-stronger-bell-werner-states
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
Werner states are the family of bipartite density operators that are invariant under all local unitaries of the form $U\otimes U$, with $U$ acting on each subsystem. In dimension $d$ on each side they form a one-parameter family that interpolates between a maximally entangled (anti-symmetric) projector and the symmetric projector; equivalently they can be written as noisy versions of a singlet. They are the canonical testbed for separating different notions of "non-classicality": a Werner state can be entangled and yet admit a local hidden variable (LHV) model for projective measurements, demonstrating that entanglement and Bell-non-locality are distinct resources.

For two-qubit Werner states with singlet fraction $F$, the CHSH inequality is violated iff $F > (1+1/\sqrt 2)/2$, equivalently iff the "Werner parameter" $p$ exceeds $1/\sqrt 2$. Below this threshold no two-setting two-outcome Bell inequality of the CHSH type is violated. A natural and longstanding question — going back to Gisin and Peres in the 1990s — is whether there exist *other* Bell inequalities (with more measurement settings, more outcomes, or more parties) that detect non-locality of Werner states in a strictly larger range of $p$ than CHSH does. Such inequalities would imply that the CHSH threshold for Werner states is not the true non-locality threshold and would shrink the gap between known LHV models for Werner states (Werner, Barrett, Hirsch–Quintino–Vértesi, etc.) and the region of established non-locality.

Recently Collins and Gisin (2003) found a two-qubit Bell inequality (the so-called $I_{3322}$) inequivalent to CHSH, and exhibited quantum states violating $I_{3322}$ but not CHSH. However, for Werner states their inequality is *weaker* than CHSH: the range of Werner parameters violating $I_{3322}$ is smaller than the range violating CHSH. The problem asks whether one can do better.
