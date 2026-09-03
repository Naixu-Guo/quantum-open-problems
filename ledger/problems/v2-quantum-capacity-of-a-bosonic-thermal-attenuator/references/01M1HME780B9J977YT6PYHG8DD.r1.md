---
id: 01M1HME780B9J977YT6PYHG8DD
type: Reference
schemaVersion: "1.0"
revision: 1
createdBy: 01M1HME780JC7TB3G87MSB1YG9
createdAt: 2026-09-02T18:00:00Z
sourceId: 01M1HME780Z98D49JXX52VXH3P
targetType: problem
targetId: 01M1HME780AZ2GCKS76GDX97RQ
role: prior-attempt
locator: ""
---
The latest rigorous lower bounds use non-Gaussian one-mode inputs:
  \begin{equation}
    \begin{aligned}
      \sup_{\rho\in\mathsf G_1}I_{\rm c}(\rho,\Phi_{4/5,1})
        &=0,
      &\qquad
      \mathcal Q(\Phi_{4/5,1})
        &\geq4.7\times10^{-4},\\
      \mathcal Q(\Phi_{0.7841,1})
        &\geq1.4312\times10^{-7},\\
      \eta_{\rm c}
        &:=\inf\{\eta:\mathcal Q(\Phi_{\eta,1})>0\},
      &\qquad
      0.75\leq\eta_{\rm c}
        &\leq0.7841.
    \end{aligned}
    \label{eq:p49-nongaussian-separation}
  \end{equation}
  The first certificate uses an explicit rank-two state supported on six
  Fock levels; numerical optimization over related families reaches about
  $8.4\times10^{-3}$ qubits per use at $(\eta,\nu)=(0.8,1)$, but that larger
  value is not certified.  The second certificate in
  Eq. \eqref{eq:p49-nongaussian-separation} also propagates by data processing
  to a two-dimensional parameter region.  These results disprove
  single-mode Gaussian optimality but do not determine the capacity
  [MCF+26].
