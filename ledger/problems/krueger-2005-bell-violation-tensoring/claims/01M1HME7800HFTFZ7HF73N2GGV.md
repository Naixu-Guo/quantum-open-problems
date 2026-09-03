---
id: 01M1HME7800HFTFZ7HF73N2GGV
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Bell violation by tensoring"
statementId: 01M1HME7807MN4WD6M3A5E127B
clauseIds:
  - 01M1HME7807MN4WD6M3A5E127B#main
relation: resolves
bound: null
support:
  - sourceId: 01M1HME780WE0E9B4B55R55GQ8
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780QAK8Q1MSAM3YB6C2
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780FFGPP997FPABA7QS
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780DR15ZNJQTG5AJ9Y7
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
---
The problem is **solved (affirmatively)**: Liang's CHSH-by-tensoring question has explicit positive constructions.

- **Hidden non-locality (Popescu, Peres).** Popescu (1995) showed that some Werner states with LHV models for direct measurements can be made to violate CHSH after a local "filtering" step. Peres (1996) demonstrated activation: $\rho^{\otimes n}$ can be CHSH-non-local for $n$ large even when $\rho$ alone is not. Peres' construction, however, uses many copies and/or filtering, not a clean two-copy tensor product without further processing.
- **Liang–Doherty bounds.** Y. C. Liang and A. C. Doherty (2006, 2007) gave numerical bounds via semidefinite hierarchies on CHSH violation for tensored states, ruling out activation in several parameter regimes.
- **Resolution: Navascués–Vértesi (2011).** M. Navascués and T. Vértesi, *Activation of nonlocal quantum resources*, Phys. Rev. Lett. **106**, 060403 (2011); arXiv:1010.5191, gave an explicit positive answer to the precise question posed by Liang: they constructed (i) two two-qubit states $\rho_1,\rho_2$ such that $\rho_1^{\otimes N}$ and $\rho_2^{\otimes N}$ admit local hidden-variable models for any $N$, but $\rho_1\otimes\rho_2$ violates the CHSH inequality (reaching $\approx 2.023$); and (ii) a single CHSH-local state $\rho$ such that $\rho^{\otimes 2}$ violates CHSH. Both constructions use no filtering — only direct measurements on the joint state — and thus settle the original CHSH-from-CHSH-locals question of Liang.
- **Subsequent extensions.** C. Palazuelos, *Super-activation of quantum non-locality*, Phys. Rev. Lett. **109**, 190401 (2012); arXiv:1205.3118, extended these ideas to high-dimensional systems with arbitrarily large activation gaps in general Bell scenarios. Further work has produced single-copy activation via broadcasting and characterised closed-form criteria for hidden two-qubit CHSH nonlocality.
