---
id: 01M1HME7803WTECCZ48RRZDNDX
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME780WJM907DXRW0HEC2M
targetType: problem
targetId: 01M1HME780TJ3Z7X332QY1GWFR
role: prior-attempt
locator: ""
---
For the explicit inner-product function, the best robust result is
  \begin{equation}
    f_n(x,y)=\bigoplus_{i=1}^n x_i y_i,
    \qquad
    d\log_2(2d)=\Omega(n),
    \qquad
    E_{\mathrm{dim}}\geq
      \log_2n-\log_2\log_2n-O(1),
    \label{eq:p38-inner-product-lower-bound}
  \end{equation}
  where $d=\min\{\operatorname{rank}\rho_L,
  \operatorname{rank}\rho_R\}$ and the worst-case error is at most $0.09$
  [Bog26].
  Equation \eqref{eq:p38-inner-product-lower-bound} is logarithmic rather than
  polynomial in the cost measure of Eq. \eqref{eq:p38-dimension-cost}.
