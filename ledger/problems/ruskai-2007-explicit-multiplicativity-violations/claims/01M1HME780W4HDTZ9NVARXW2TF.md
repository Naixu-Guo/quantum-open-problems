---
id: 01M1HME780W4HDTZ9NVARXW2TF
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Explicit channels violating multiplicativity of maximal output $p$-norm for $p\\ne 1$"
statementId: 01M1HME780K7F8PQH6V4WXFADK
clauseIds:
  - 01M1HME780K7F8PQH6V4WXFADK#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780E1994F4T8NHN9S3M
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780HFGASM64WE5ZSVBB
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: counterexample
  - sourceId: 01M1HME780JC3THY6Z4FX9H6M2
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
---
- The Werner-Holevo channel (Werner-Holevo 2002) remains the canonical *explicit* example: it violates (24) for $p>4.79$. Variants and small perturbations of it are the only such channels known explicitly at the time the problem was posed.
- Winter (arXiv:0707.0402) and Hayden (arXiv:0707.3291) extended the existence range to $p>2$ and to $1<p<2$ respectively, but via random-channel arguments that do not produce a single named channel.
- Harrow, Leung and Winter ("Aspects of generic entanglement", *Commun. Math. Phys.* 265 (2007)) addressed the $p=0$ regime existentially using high-dimensional random subspaces.
- Brandão and Horodecki (2010, *Open Syst. Inf. Dyn.* 17, 31-52, arXiv:0907.3210; see also arXiv:0907.4798) gave a more explicit (algorithmically constructive) version of Hastings's $p=1$ counter-example, providing more concrete channels in lower dimensions, though still very large.
- Fukuda, King and Moser ("Comments on Hastings' Additivity Counterexamples", *Commun. Math. Phys.* 296 (2010), 111-143; arXiv:0905.3697) and Aubrun, Szarek, Werner (arXiv:1003.4925, arXiv:1010.1571) substantially simplified the random-construction proofs but did not yield small fully-explicit channels.
- For $p>1$ but $p$ close to $1$, and for $0<p<1$, no truly small-dimension, explicit channel violating (24) is known.
- **Status: solved.** Problem 20 asks only for explicit channels violating (24) at some $p\ne1$; it does not require modest dimension, a hand calculation, or coverage near $p=1$. The Werner–Holevo channel already supplies an explicit counterexample for $p>4.79$. Cubitt, Harrow, Leung, Montanaro and Winter later gave an explicit $4$-to-$3$ pair with nonmultiplicative minimum output rank at $p=0$. More recent constructions give explicit examples over wider ranges.
- A 2025/2026 preprint by Derksen and Lovitz gives constructive examples for every $p>1$, including the difficult interval near one. This strengthens the resolution but is not needed for the existential statement.
-
