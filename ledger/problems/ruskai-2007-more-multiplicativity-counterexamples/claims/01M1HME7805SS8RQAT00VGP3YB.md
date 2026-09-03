---
id: 01M1HME7805SS8RQAT00VGP3YB
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: More counterexamples to the multiplicativity conjecture (eq. 24)"
statementId: 01M1HME780V2PAHM8G7B868GAC
clauseIds:
  - 01M1HME780V2PAHM8G7B868GAC#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780JC3THY6Z4FX9H6M2
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780KKEXCK06EGSWPEQR
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780HFGASM64WE5ZSVBB
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780KXQZYP16R2PK3B7J
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780PDRYX1RGNTNGTC5N
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780W7HKT4SZPDQP50YS
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780BMA1N74EQW4G0DE4
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME78095KP2YZG1JVRBDNH
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
---
This problem has been resolved in the negative.

- A. Winter (July 2007, *The maximum output $p$-norm of quantum channels is not multiplicative for any $p>2$*, arXiv:0707.0402) solved Problem 11 by constructing counterexamples to (24) for every $p>2$, using random unitary channels of growing dimension. As stated in Section 5.6 of the source, Winter's approach failed at $p=2$ and initially seemed to support multiplicativity in $1<p\le 2$.
- Soon after, P. Hayden (*The maximal $p$-norm multiplicativity conjecture is false*, arXiv:0707.3291) extended the counterexamples to all $1<p<2$, and Winter subsequently closed the case $p=2$. Together these works disprove (24) for every $p>1$.
- Hayden's analysis indicated that the additivity conjecture (23) at $p=1$ still held for his channel constructions and he suggested attacking it by establishing (26) for $p<1$. King (announcement at AMS–PTM, 2 Aug 2007) reported that the multiplicativity proofs for entanglement-breaking, unital qubit, and depolarizing channels extend to $0<p<1$.
- M. B. Hastings (*Nature Physics* 5, 255 (2009)) constructed counterexamples to the additivity of minimal output entropy at $p=1$, eq. (23), thus disproving the additivity conjecture in general.

Problem 11 is therefore solved (negatively) as a search-for-counterexamples task: counterexamples exist for every $p>1$, including in the originally conjectured "safe" range $1<p\le 2$. The underlying additivity conjecture (23) has also been disproved.
