---
id: 01M1HME780PVQJ2W0DZGM7D72M
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Additivity of classical capacity and related problems"
statementId: 01M1HME780CXHZE2TZ3RKH918C
clauseIds:
  - 01M1HME780CXHZE2TZ3RKH918C#main
relation: resolves
bound: null
support:
  - sourceId: 01M1HME7806JDYP1Q5F2G2GRPD
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780TCJYY1WDCXK85M03
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780D542V7N6KMTM3GV9
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780WMSMFY029CS0JHWT
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME7806A5V87P2YK0GE0MW
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780B636RJXRP9ETMG9N
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780T2PS9R66TG1A1CHN
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
---
- **Status:** solved (disproven).
- **Resolution (Hastings, 2009):** M. B. Hastings produced random-unitary channels (in very large dimension) violating additivity of the minimal output von Neumann entropy. Via Shor's equivalence (P. W. Shor, 2003), this directly implies failure of additivity of the Holevo capacity $\chi$ and superadditivity of the entanglement of formation in general. The full classical capacity is therefore *not* given by a single-letter Holevo formula.
- **Reference of resolution:** M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255–257 (2009); arXiv:0809.3972.
- **Special cases of additivity (still valid):** additivity of $\chi$ is known to hold for: the identity channel (Amosov–Holevo–Werner; Schumacher–Westmoreland); unital qubit channels (King); the depolarising channel in every dimension (King); entanglement-breaking channels (Shor). For Gaussian channels there are also additivity and multiplicativity results in special cases (Giovannetti–Lloyd and coauthors).
- **Multiplicativity counterexamples.** Werner and Holevo gave a channel $T(\rho) = (I - \rho^T)/(d-1)$ in $d = 3$ for which $\|T \otimes T\|_p < \|T\|_p^2$ fails for sufficiently large $p$ (in their case $p \geq 4.7823$); nevertheless additivity of $H_{\min}$ and $\chi$ holds for this channel. After Hastings, even the "small-$p$" multiplicativity of $\|\cdot\|_p$ for $p > 1$ near $1$ is known to fail in general.
- **Implications.** The dichotomy laid out in the source PDF — that proving multiplicativity would solve superadditivity of EoF — instead resolves in the opposite direction: additivity fails for $\chi$, $H_{\min}$, and EoF, and multiplicativity of $\|\cdot\|_p$ fails for $p > 1$ in a neighbourhood of $1$.
- **Remaining open sub-questions.** Even after Hastings' disproof, several quantitative questions remain active: the exact size of additivity violations, identification of channels for which additivity does hold, the qubit-channel case ($\dim = 2$), the Gaussian-channel case in infinite dimension, and the rate of convergence of the regularisation.
