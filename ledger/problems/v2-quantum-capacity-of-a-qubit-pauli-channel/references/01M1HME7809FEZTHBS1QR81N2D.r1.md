---
id: 01M1HME7809FEZTHBS1QR81N2D
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME7803N2X6MWRVXN47AQ9
targetType: problem
targetId: 01M1HME7809M71BG24CSMYKA8A
role: prior-attempt
locator: ""
---
The hashing construction gives the achievable lower bound
  \begin{equation}
    \mathcal{Q}(\Lambda_{\mathbf p})\ge \max\{0,1-H(\mathbf p)\},
    \qquad
    H(\mathbf p):=-\sum_{i\in\{I,X,Y,Z\}}p_i\log_2p_i,
    \qquad 0\log_2 0:=0.
    \label{eq:p1-hashing-bound}
  \end{equation}
  The quantity $1-H(\mathbf p)$ in Eq. \eqref{eq:p1-hashing-bound} equals
  $I_c(I/2,\Lambda_{\mathbf p})$, the coherent information at the maximally
  mixed input (often called the symmetric coherent information), rather than
  the optimized one-shot coherent information in general
  [BDSW96], [Dev05].
