---
id: 01M1HME780VA8SZ6VA2ZPARVC3
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME780PD99BKGKZC6EM2A2
targetType: problem
targetId: 01M1HME78030A51WENEAWKSA90
role: prior-attempt
locator: ""
---
For $\nu>0$, a thermal input of mean photon number $N_{\rm S}$ gives
  \begin{equation}
    \mathcal Q(\Phi_{\eta,\nu},N_{\rm S})
    \geq[L(\eta,\nu,N_{\rm S})]_+,
    \label{eq:p51-thermal-lower-bound}
  \end{equation}
  where the rate in Eq. \eqref{eq:p51-thermal-lower-bound} is
  \begin{equation}
    \begin{aligned}
    L(\eta,\nu,N_{\rm S})
      &:={}
      g(\eta N_{\rm S}+(1-\eta)\nu)\\
      &\quad-g\!\left(
        \frac{\Delta+(1-\eta)N_{\rm S}-(1-\eta)\nu-1}{2}
      \right)\\
      &\quad-g\!\left(
        \frac{\Delta-(1-\eta)N_{\rm S}+(1-\eta)\nu-1}{2}
      \right),\\
    \Delta
      &:=\sqrt{[(1+\eta)N_{\rm S}+(1-\eta)\nu+1]^2
                -4\eta N_{\rm S}(N_{\rm S}+1)}.
    \end{aligned}
    \label{eq:p51-thermal-rate}
  \end{equation}
  The expression in Eq. \eqref{eq:p51-thermal-rate} is a one-use achievable
  rate, not an exact capacity formula
  [HW01],
  [SWA+18].
