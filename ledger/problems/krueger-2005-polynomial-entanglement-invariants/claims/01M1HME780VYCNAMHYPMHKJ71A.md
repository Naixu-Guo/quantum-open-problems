---
id: 01M1HME780VYCNAMHYPMHKJ71A
type: Claim
schemaVersion: "1.0"
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
supersedes: null
title: "Resolution of: Polynomial entanglement invariants"
statementId: 01M1HME780ZDCE3B1BGZY97AS0
clauseIds:
  - 01M1HME780ZDCE3B1BGZY97AS0#main
relation: resolves
bound: null
support:
  - sourceId: 01M1HME780AG8JDYJFV8M6NDRJ
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780CTW5BN6VXZHBNZBX
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME78091YVV0RD0WB4G3R7
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME7801952C2MCE0GYG649
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780S3C2B6D6FWS06MMF
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780F6BKGS03CGCH72ZX
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME7800R4N5ZSB0M3YR4HC
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME7800EF1928TAPJQV4WH
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780H5QEGCFTYX3T0DF1
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
  - sourceId: 01M1HME780BWF1MGZJQPV5FDHD
    artifactId: null
    locator: ""
    date: null
    maturity: preprint
    strength: exact-theorem
  - sourceId: 01M1HME780SWDWXXNGRREGR0HW
    artifactId: null
    locator: ""
    date: null
    maturity: peer-reviewed
    strength: exact-theorem
---
**Solved (the principal completeness question).** The basic question of completeness of polynomial entanglement invariants is answered affirmatively by A. Sudbery via a classical theorem of Onishchik and Vinberg:

> *The orbits of a compact linear group acting on a real vector space are separated by the polynomial invariants.* (Onishchik–Vinberg, *Lie Groups and Algebraic Groups*, Springer 1990, Chap. 3, §4, Theorem 3.)

The local unitary group is compact, and its action on the space of density operators is a compact linear action on a real vector space, so the polynomial invariants separate orbits. Consequently, two multipartite quantum states are related by a local unitary if and only if all polynomial invariants agree. This solution appears in the "Solution" section of the source. (The compactness assumption is essential; the analogous statement is false for $\mathrm{GL}(n,\mathbf{C})$ similarity actions, as illustrated by the Jordan-form obstruction.)

The source dates Sudbery's resolution to 2001-12-18, recorded as "last progress" on the title page of Problem 3.

**Partial results on finite complete sets and dimensions of orbit spaces.**

- Y. Makhlin [M; quant-ph/0002045] gave a complete set of 18 invariants for the bipartite two-qubit case, none of which can be omitted; the space of entanglement types of mixed two-qubit states is a 9-dimensional manifold in $\mathbf{R}^{18}$ with 9 relations among the 18 generators.
- A. Sudbery [S; quant-ph/0001116] solved the pure three-qubit case with 8 polynomial invariants, 6 being the dimension of the manifold of all invariants; together with one more invariant found by Grassl, [AAJT; quant-ph/0009107] obtained the six independent invariants describing pure three-qubit states. The space of entanglement types of pure three-qubit states is a hypersurface in real projective 6-space.
- For pure $n$-partite states with parties of dimensions $d_1 \le \cdots \le d_n$, the dimension of the space of entanglement types is
$$D_{\text{pure}} = 2 \prod_{r=1}^n d_r - \sum_{r=1}^n d_r^2 + n - 2 + \Delta^2,$$
with $\Delta = d_n - d_1\cdots d_{n-1}$ if positive and $0$ otherwise; for $n$ parties of equal local dimension $d$ this becomes $D_{\text{pure}} = 2 d^n - n d^2 + n - 2$. The corresponding dimension for mixed states is $D_{\text{mixed}} = d^{2n} - n d^2 + n - 1$.
- The three-qubit SLOCC classification has two genuine entanglement classes. The four-qubit result of Verstraete, Dehaene, De Moor and Verschelde gives nine families with continuous parameters, not nine individual SLOCC orbits.
- A basis for the ring of polynomial invariants in the multipartite case for arbitrary Hilbert-space dimensions was given by Grassl–Rötteler–Beth [GRB; quant-ph/9712040] and by Rains [R; quant-ph/9704042].

The remaining sub-problems (finite complete generating sets in all dimensions; analogous classifications for higher-party multipartite systems; polynomial separability characterisations) are still active research areas as of 2026, but the principal completeness question of Problem 3 is settled.
