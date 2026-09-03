---
id: 01M1HME7802MK7T0RSHT17BXEB
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME780HX39YAWPGZCK7C8Q
targetType: problem
targetId: 01M1HME7805PVXXPJE60E83TJ5
role: prior-attempt
locator: ""
---
Let $M(k,d)$ denote the maximum length of any, not necessarily
  linear, $d$-ary MDS code of cardinality $d^k$.  Bernal proved the
  conditional implication
  \begin{equation}
    \left.
    \begin{gathered}
      d\geq8\text{ is a prime power},\qquad
      k_0=\left\lfloor\frac{d+2}{2}\right\rfloor,\\
      M(k_0,d)=d+1
    \end{gathered}
    \right\}
    \quad\Longrightarrow\quad
    \mathcal N(d)=d+1.
    \label{eq:p42-conditional-frontier}
  \end{equation}
  The general MDS conjecture supplies the premise in
  \eqref{eq:p42-conditional-frontier}.  Its possible $d+2$ exceptions for
  $d=2^j$ and $k\in\{3,d-1\}$ do not apply here because
  $3<k_0<d-1$ for $d\geq8$; the missing step is the conjecture for general
  nonlinear codes
  [Ber19].
