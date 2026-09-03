---
id: 01M1HME78006FY567CSBTQ2KRN
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Bell Inequalities Holding for All Quantum States"
statementId: 01M1HME780A6MNAT4E737NC16C
clauseIds:
  - 01M1HME780A6MNAT4E737NC16C#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780XE204JVBJVBK6APG
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME7800V3XJNZKRZ2SZWR6
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME78088NQYT7AQMNVEYM7
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780PVHM7VZ05GHK5YAP
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780Y83DQ7VXACST0ANH
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780NYFBPKDTMMPQ72MB
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME7803NANE4ZGGNPTNXMC
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780FJ02TN2GB7QJT6RG
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
---
**Status: solved negatively.** Both universal questions have counterexamples.

- For the simplest non-trivial setting $(N,M,K)=(2,2,2)$ (CHSH), the only non-trivial facet inequalities of $C$ are the CHSH inequalities, and all of them are violated by quantum states (Tsirelson). Hence Problem 26.B is affirmative in this case.
- For $(2,2,K)$ with $K\ge 3$, Collins–Gisin–Linden–Massar–Popescu (the CGLMP inequalities, Phys. Rev. Lett. **88**, 040404 (2002)) showed that the natural family of facet inequalities admits quantum violations. Subsequent classifications (Collins–Gisin 2004; Pironio 2014; Brunner et al. *Bell nonlocality*, RMP 2014) extended this verification to many further low-complexity scenarios.
- **26.A, negative.** Slofstra's $\mathrm{CHSH}(n)$ XOR games have binary outcomes, so $K=2$, but every optimal strategy needs local dimension at least $2^{\lfloor n/2\rfloor}$. For $n=4$ this is at least four. The associated optimal behavior has uniform marginals and full-correlation entries $0$ or $\pm1/\sqrt2$, so all joint probabilities are strictly positive and the behavior lies away from the positivity boundary of the no-signalling polytope. It lies on $\partial Q$ because it maximises the game functional. Thus it is a point of $\partial Q\setminus\partial P$ that cannot be realised with local dimension $K=2$.
- **26.B, negative.** The Guess Your Neighbor's Input inequalities have equal classical and quantum optima, while no-signalling correlations do better. Almeida et al. gave the construction, and Augusiak et al. proved explicit instances are tight facets, including GYNI inequalities for every odd number of parties. These are proper maximal faces of $C$ that no quantum behavior violates, exactly the requested counterexamples.
- MIP*=RE and later dimension-witness results strengthen the conclusion but are not needed for either exact counterexample.
