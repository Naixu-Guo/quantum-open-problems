---
id: 01M1HME7805ZPMPAJ571HPGWHX
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Additivity of minimal output (von Neumann) entropy of quantum channels"
statementId: 01M1HME7800MQE0CD3MTPPYMB4
clauseIds:
  - 01M1HME7800MQE0CD3MTPPYMB4#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780T2PS9R66TG1A1CHN
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780PDRYX1RGNTNGTC5N
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME78030PW26V4K1XEF45D
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780H8858PGM40XTE7MX
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780XEM771VG59EQFGMQ
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780D822XR1GH7PC66J5
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780TXXA19CDQPQ3WA1D
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME78095KP2YZG1JVRBDNH
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780XA0TNN1XRT510KAD
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
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
---
**Resolved (negatively) in 2009.** M. B. Hastings, "Superadditivity of communication capacity using entangled inputs", *Nature Physics* 5 (2009), 255-257 (arXiv:0809.3972), disproved the conjecture by constructing pairs of random unitary channels $\Phi,\Omega$ (with $\Omega$ obtained from $\Phi$ via complex conjugation) for which the maximally entangled input $\frac{1}{\sqrt{d}}\sum_i|i\rangle|i\rangle$ achieves
$$S_{\min}(\Phi\otimes\Omega) \;<\; S_{\min}(\Phi)+S_{\min}(\Omega).$$
Hastings's argument uses concentration of measure for random unitary Kraus operators in very large dimension; the channel dimension required for the violation is large but finite. Via Shor's equivalence (quant-ph/0305035), this simultaneously refutes the additivity of Holevo capacity and of entanglement of formation.

Subsequent work has simplified and quantified the counter-example:
- F. G. S. L. Brandão, M. Horodecki, "On Hastings' counterexamples to the minimum output entropy additivity conjecture", *Open Syst. Inf. Dyn.* 17 (2010), 31-52 (arXiv:0907.3210), gave a more constructive version with sharper dimensional estimates.
- M. Fukuda, C. King, D. K. Moser, "Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143 (arXiv:0905.3697), provided a detailed rigorous reworking.
- G. Aubrun, S. Szarek, E. Werner, "Hastings' additivity counterexample via Dvoretzky's theorem", *Commun. Math. Phys.* 305 (2011), 85-97 (arXiv:1003.4925), gave a conceptual proof via almost-Euclidean sections of Schatten spaces.
- Subsequent quantitative work (Belinschi-Collins-Nechita, Communications in Mathematical Physics 2012; arXiv:1206.5874) provides further constructions.

Despite the resolution at $p=1$, the *magnitude* of the violation is small and the dimensions required are enormous; the question of how much capacity superadditivity can occur, and for which channel families, remains a very active subject.

-
