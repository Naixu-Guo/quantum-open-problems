---
id: 01M1HME780ND1ZDCW33R2RFH3Z
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME7802XJP9Z68EX34SKM7
targetType: problem
targetId: 01M1HME780JH0D9Y0RQ750ZZPY
role: prior-attempt
locator: ""
---
Let $p_\star:=\max\{p_I,p_X,p_Y,p_Z\}$,
  $C_{\mathbf p}:=\max\{0,2p_\star-1\}$, and
  $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_2 0:=0$.  Regularized relative entropy of
  entanglement, entanglement cost, and Wootters' one-copy entanglement of
  formation give the rigorous bounds
  \begin{equation}
    L(p_\star)=E_R^\infty(\rho_{\mathbf p})
    \leq E_C(\rho_{\mathbf p})
    \leq E_F(\rho_{\mathbf p})
    =h_2\!\left(\frac{1+\sqrt{1-C_{\mathbf p}^{2}}}{2}\right),
    \qquad
    L(t):=
    \begin{cases}
      0, & 0\leq t\leq\tfrac12,\\
      1-h_2(t), & \tfrac12<t\leq1.
    \end{cases}
    \label{eq:p7-cost-bounds}
  \end{equation}
  Here $E_C=E_F^\infty$
  [HHT01]; Wootters gives the
  right endpoint [Woo98]; and additivity of the
  relative entropy of entanglement gives
  $E_R^\infty(\rho_{\mathbf p})=L(p_\star)$
  [ZCH10].  Thus
  Eq. \eqref{eq:p7-cost-bounds} solves $p_\star\leq1/2$ but generally leaves
  a gap for $p_\star>1/2$.  A recent semidefinite-programming construction
  gives a faithful, efficiently computable lower bound on
  $E_C(\rho_{\mathbf p})$ for every entangled two-qubit Bell-diagonal state,
  but does not close the gap
  [WJZ25].
