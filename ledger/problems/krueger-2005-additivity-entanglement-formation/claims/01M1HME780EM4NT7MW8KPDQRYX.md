---
id: 01M1HME780EM4NT7MW8KPDQRYX
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Additivity of Entanglement of Formation"
statementId: 01M1HME780167WPEZPHA906YT7
clauseIds:
  - 01M1HME780167WPEZPHA906YT7#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780AG8JDYJFV8M6NDRJ
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780K0PR13RSWYGDDKHF
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780X5SVXXKNBPC7T0P8
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780WMSMFY029CS0JHWT
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780T2PS9R66TG1A1CHN
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
---
**Solved (disproved).** The additivity of entanglement of formation is now known to be *false* in general.

P. W. Shor proved in 2003 that several additivity questions are equivalent: additivity of the minimum output entropy $S_{\min}$ of all channels, additivity of the Holevo capacity $\chi^{*}$ of all channels, additivity of the entanglement of formation $E_F$ for all bipartite states, and the strong superadditivity of $E_F$ (P. W. Shor, *Equivalence of additivity questions in quantum information theory*, Commun. Math. Phys. **246**, 453–472 (2004); arXiv:quant-ph/0305035). Hence a single counterexample to any one of these statements refutes all of them simultaneously.

In 2008, M. B. Hastings disproved additivity of the minimum output entropy by a randomised construction of two channels for which

$$S_{\min}(\Phi \otimes \bar{\Phi}) \;<\; S_{\min}(\Phi) + S_{\min}(\bar{\Phi})$$

(M. B. Hastings, *Superadditivity of communication capacity using entangled inputs*, Nature Physics **5**, 255 (2009); arXiv:0809.3972). By Shor's equivalences, this Hastings violation immediately implies the existence of bipartite density operators $\rho^{(1)}, \rho^{(2)}$ for which

$$E_F\!\bigl(\rho^{(1)} \otimes \rho^{(2)}\bigr) \;<\; E_F\!\bigl(\rho^{(1)}\bigr) + E_F\!\bigl(\rho^{(2)}\bigr),$$

so the additivity conjecture for entanglement of formation is false in general. Subsequent work has produced explicit (though not low-dimensional) examples, sharpened bounds on the size of the gap, and constructed counterexamples in lower dimensions and with stronger structural properties (see e.g. Brandão–Horodecki; Belinschi–Collins–Nechita; Aubrun–Szarek–Werner; Fukuda–King–Moser).

Prior partial positive results (now superseded by the general counterexample but still relevant for restricted classes):

- G. Vidal, W. Dür, and J. I. Cirac [VDC02; quant-ph/0112131] (*Entanglement cost of mixed states*, Phys. Rev. Lett. **89**, 027901 (2002)) proved additivity of entanglement of formation for several explicit families of states.
- Earlier work established additivity for many special classes — e.g. for states of the form $\rho \otimes \sigma$ with one factor separable, for Werner and isotropic states, and for states with certain symmetries — without resolving the general question.

The TOC of the source records the "last progress" date of this problem as 2004-11-11; the Hastings refutation (2008/9) post-dates the source paper but settles the conjecture decisively in the negative.
