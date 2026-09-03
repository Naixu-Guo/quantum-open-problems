---
id: 01M1HME7802A598TTM94KP1SND
type: Problem
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
title: Bell Inequalities Holding for All Quantum States
role: primary
parentProblemId: null
parentClauseId: null
aliases:
  - krueger-2005-bell-inequalities-all-quantum-states
origin: source-stated
posed: 2005-04-11
areaIds:
  - quantum-information
topicIds: []
keywords: []
difficulty: unrated
verificationCost: unrated
relatedProblemIds: []
---
The Bell scenario considered here fixes $N$ parties, $M$ measurement settings per party, and $K$ possible outcomes per measurement. The joint probability distributions $p(\vec a|\vec x)$ form a convex polytope when subjected to positivity (probabilities $\ge 0$, normalised), and a smaller convex polytope $P$ — the *no-signalling polytope* — when further restricted by the no-signalling condition: the marginal distribution seen by any one party (or subset) must be independent of the measurement settings of the other parties. Inside $P$ sits the convex set $Q$ of correlation data attainable by performing local POVM measurements on a shared multipartite quantum state. Inside $Q$ in turn sits the (smaller) convex polytope $C$ of correlations realisable by classical local realistic theories: convex combinations of deterministic strategies in which each party's output is a function of its own setting and shared randomness. The strict inclusion $C \subsetneq Q \subsetneq P$ encodes both Bell's theorem ($Q\not\subset C$, "quantum mechanics is not classical") and Tsirelson-type bounds ($Q\not= P$, "quantum mechanics is not maximally no-signalling").

A *Bell inequality* corresponds to a face of the polytope $C$. A *proper* (non-trivial) Bell inequality corresponds to a maximal face of $C$ that is not also a face of $P$ — that is, a tight linear inequality for classical correlations which is not implied merely by positivity and the no-signalling constraint. Such a face is depicted as a blue line in the schematic figure of the source problem. The conceptual question is: how does $Q$ fit in between $C$ and $P$? In particular, can every proper Bell inequality be quantum-mechanically violated (so that $Q$ always "pokes through" any face of $C$ that is not already a face of $P$), or do there exist proper Bell inequalities that hold for all quantum states? The latter would represent a striking additional structural constraint on quantum mechanics beyond Tsirelson-type bounds.

A second, complementary question concerns the *outer* boundary of $Q$ that is not part of the boundary of $P$: can these boundary points be saturated using "minimal-dimension" quantum resources — local Hilbert spaces of dimension $K$ measured by complete von Neumann measurements on pure states — or do some require larger dimension or non-projective POVMs?
