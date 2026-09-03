---
id: 01M1HME780A9M67AXSQPAZKNDE
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME780Y30NKB9Q85WFEHSA
targetType: problem
targetId: 01M1HME7809M71BG24CSMYKA8A
role: prior-attempt
locator: ""
---
In the depolarizing case, write $p_I=f$ and
  $p_X=p_Y=p_Z=(1-f)/3$, and let $r:=(1-f)/3$ be the per-Pauli error
  probability.  Krohn-Grimberghe constructed an explicit rank-two,
  permutation-symmetric input across $45$ channel uses and certified in exact
  rational arithmetic that its coherent information is positive at
  $r=16239/250000=0.064956$.  Monotonicity under channel post-processing
  therefore gives $\mathcal Q(\Lambda_{\mathbf p})>0$ whenever
  $f\ge201283/250000=0.805132$.  In particular, throughout
  $0.805132\le f<0.81071$ the capacity is positive although the hashing
  expression in Eq. \eqref{eq:p1-hashing-bound} is negative.  Table 1 of the
  paper lists the preceding best printed positivity point as $r=0.064657$,
  obtained by Agarwal et al. through symmetry-reduced coherent-information
  optimization [AKL+26].  The new point is
  machine-checkable but is not claimed to be the exact capacity threshold
  [KG26].
