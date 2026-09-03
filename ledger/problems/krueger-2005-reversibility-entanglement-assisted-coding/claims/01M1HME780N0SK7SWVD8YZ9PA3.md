---
id: 01M1HME780N0SK7SWVD8YZ9PA3
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Reversibility of entanglement assisted coding"
statementId: 01M1HME7807F59C3J8FV122PCQ
clauseIds:
  - 01M1HME7807F59C3J8FV122PCQ#main
relation: resolves
bound: null
support:
  - sourceId: 01M1HME780WAE5VR56T1W4FV2C
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780EF08R1RCA56WR2C5
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME7802SGKQA2DXNK5G50W
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780KV8N83V7673QH7AT
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
---
- **Status:** solved by the Quantum Reverse Shannon Theorem (QRST).
- **Background.** The forward (achievability) coding theorem giving a formula for $C_{\mathrm{E}}(T) = C_{\mathrm{E}}(T, S_1)$ was proved by Bennett, Shor, Smolin and Thapliyal in 1999. The reverse Shannon theorem in the form above was formulated in their 2001 paper. At the time of the IMaPh snapshot the result was known only in the special case of a *known tensor-power source*, i.e. when the message channel $S$ emits the same, known density matrix at each time step; P. W. Shor (private communication, 2003) had been working on the *unknown* tensor-power case and on the *known tensor-product source* case (the density matrix is a tensor product, but the marginals may vary with time).
- **Resolution.** The full Quantum Reverse Shannon Theorem was proved by C. H. Bennett, I. Devetak, A. W. Harrow, P. W. Shor and A. Winter (announced 2009; published IEEE Trans. Inform. Theory 60, 2926 (2014); arXiv:0912.5537), with a one-shot approach by M. Berta, M. Christandl and R. Renner (Commun. Math. Phys. 306, 579 (2011); arXiv:0912.3805). Under the source's convention, $C_{\mathrm{E}}(T,S)$ counts how many uses of $T$ can be produced per use of $S$. The theorem therefore gives
  $$C_{\mathrm{E}}(T,S) \;=\; \frac{C_{\mathrm{E}}(S)}{C_{\mathrm{E}}(T)} \;=\; C_{\mathrm{E}}(S,T)^{-1}$$
  for every pair of memoryless channels in the i.i.d. asymptotic resource model. The ratio had been reversed in an earlier version of this entry; the reciprocal identity was unaffected. More general source models can require extra conventions about feedback or embezzling entanglement, so they should not be inferred from this statement without specifying the resources.
- **Subsequent refinements.** Work continues on refinements involving the precise resource cost (entanglement vs. classical communication), strong-converse rates and non-i.i.d./compound sources (e.g. Berta–Christandl–Renner 2011 strong-converse, Datta–Hsieh strong converse), but these are extensions beyond the formal statement of Problem 17.
