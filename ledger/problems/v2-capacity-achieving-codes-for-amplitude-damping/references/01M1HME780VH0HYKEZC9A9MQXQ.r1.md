---
id: 01M1HME780VH0HYKEZC9A9MQXQ
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME78054SQNCC8AJ6S3MZT
targetType: problem
targetId: 01M1HME780H9TAVH85TF8KJDS5
role: prior-attempt
locator: ""
---
The channel is degradable for $0\le p\le1/2$ and antidegradable for
  $1/2\le p\le1$.  Consequently,
  \begin{equation}
    \mathcal{Q}(\mathcal A_p)=
    \begin{cases}
      \displaystyle\max_{0\le q\le1}
      \bigl[h_2((1-p)q)-h_2(pq)\bigr],&0\le p\le\tfrac12,\\[1.5mm]
      0,&\tfrac12\le p\le1,
    \end{cases}
    \label{eq:p2-capacity}
  \end{equation}
  where $q$ is the excited-state population of the diagonal input and
  $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_2 0:=0$.  The capacity formula in
  Eq. \eqref{eq:p2-capacity} follows from the small-environment analysis
  [WPG07].
