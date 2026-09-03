---
id: 01M1HME78082QCR7EEPDCJ84J0
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Maximally entangled mixed states"
statementId: 01M1HME7809XJ052KV05P9AD1S
clauseIds:
  - 01M1HME7809XJ052KV05P9AD1S#main
relation: refutes
bound: null
support:
  - sourceId: 01M1HME780AG8JDYJFV8M6NDRJ
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780J59ZH0EA6JK356TW
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780D1539RN6XJCY7JYQ
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
  - sourceId: 01M1HME780V8SDNBRMXMA4Q8VE
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: counterexample
---
**Status: solved negatively.** De Vicente (2024) proved that a universal maximally entangled state at fixed two-qubit spectrum does not always exist. This rules out the conjecture that the VAM state maximises every entanglement monotone.

- For entanglement of formation, relative entropy of entanglement, and negativity on two qubits, with the spectrum held fixed, VAM showed that the maximisers coincide and form a parameterised family of "maximally entangled mixed states" (often referred to as VAM states in the subsequent literature).
- Ishizaka and Hiroshima (Phys. Rev. A **62**, 022310 (2000)) had independently studied a closely related question for two qubits and identified a similar family of maximally entangled mixed states with respect to certain measures.
- Munro–James–White–Kwiat (Phys. Rev. A **64**, 030302 (2001)) considered states maximising negativity subject only to a fixed purity constraint and found a different family ("MJWK states"), illustrating that varying the constraint can give different maximisers.
- **Decisive counterexample (de Vicente, 2024).** For particular rank-two two-qubit spectra, no isospectral state can be converted to every other isospectral state even under non-entangling operations, a class larger than LOCC. Consequently, no one state can maximise every entanglement monotone on those spectra. This directly answers the original universal question in the negative.
- **Extension (Camacho and de Vicente, 2026).** The nonexistence theorem was extended to every rank-two and rank-three two-qubit spectrum and to a large class of full-rank spectra.
- Higher-dimensional and weaker-constraint variants remain separate classification problems. Their open status does not change the negative answer to the quantified statement in the source.
