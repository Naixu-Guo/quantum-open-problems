---
id: 01M1HME78098T1BJYK4M0KRE6S
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Reduction criterion implies majorization?"
statementId: 01M1HME780RJKM3FCA8HH8R6ZS
clauseIds:
  - 01M1HME780RJKM3FCA8HH8R6ZS#main
relation: resolves
bound: null
support:
  - sourceId: 01M1HME780VT8WMZT9SZJ47TMF
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780P3P5Q92V7JC1NV7B
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME7801C9RWWC0W7YY08QD
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780WQTBKE9PDGBHRB7J
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780ZGBP6AG80127KC6Y
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780XMEGHGCNTKDD8632
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME7809FJG1RQSXC70X8C6
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
---
- **Status:** solved (affirmatively).
- **Resolution (Hiroshima, 2003):** T. Hiroshima proved that the reduction criterion does imply majorization. The key step is the observation that $\rho_A \otimes I_B \geq \rho_{AB}$ implies the existence of an operator $R$ with $\|R\| \leq 1$ such that
  $$\rho_{AB}^{1/2} \;=\; (\rho_A^{1/2} \otimes I_B)\,R.$$
  From this one constructs a substochastic matrix $S$ with $\lambda(\rho_{AB}) = S\,\lambda(\rho_A)$, which is equivalent to the weak submajorization $\lambda(\rho_{AB}) \prec_w \lambda(\rho_A)$. Since both vectors have the same trace ($= 1$), weak submajorization upgrades to ordinary majorization $\lambda(\rho_{AB}) \prec \lambda(\rho_A)$.
- **Reference of resolution:** T. Hiroshima, *Majorization criterion for distillability of a bipartite quantum state*, Phys. Rev. Lett. **91**, 057902 (2003); arXiv:quant-ph/0303057 (2003).
- **Consequence.** The full implication chain extends to
  $$\text{separable} \;\Rightarrow\; \text{PPT} \;\Rightarrow\; \text{undistillable} \;\Rightarrow\; \text{reduction} \;\Rightarrow\; \text{majorization},$$
  placing majorization as the weakest criterion in this hierarchy.
- **Earlier partial result.** Vollbrecht and Wolf showed that the reduction criterion implies positivity of conditional Renyi entropies for every value of the entropic parameter. This is implied by, but strictly weaker than, the majorization conclusion.
