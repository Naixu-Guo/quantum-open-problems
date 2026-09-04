---
id: "01M1HME78030A51WENEAWKSA90"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1Q787QRVXGPCXG6KEQTF7N1"
createdAt: "2026-09-04T22:04:59Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-shannon-theory"]
topicIds: ["bosonic-channels","quantum-capacity","coherent-information","gaussian-quantum-information","continuous-variable-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Energy-constrained quantum capacity of a thermal attenuator"
aliases: ["op-b65cf15705065d81","op_b65cf15705065d81","01M1HME78030A51WENEAWKSA90","v2-energy-constrained-quantum-capacity-of-a-thermal-attenuator","open-problem-v2-problem-51"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_b65cf15705065d81.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b65cf15705065d81","ulid":"01M1HME78030A51WENEAWKSA90","aliases":["op_b65cf15705065d81","01M1HME78030A51WENEAWKSA90","op-b65cf15705065d81","v2-energy-constrained-quantum-capacity-of-a-thermal-attenuator","open-problem-v2-problem-51"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["bosonic-channels","quantum-capacity","coherent-information","gaussian-quantum-information","continuous-variable-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Energy-constrained quantum capacity of a thermal attenuator","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Bosonic channels","Quantum capacity","Coherent information","Gaussian quantum information","Continuous-variable systems"],"statement":"For $0<\\eta<1$ and $0<\\nu<\\infty$, let the single-mode bosonic thermal\nattenuator be\n\\begin{equation}\n  \\Phi_{\\eta,\\nu}(\\rho_A)\n  :=\\operatorname{Tr}_{E'}\\!\\left[\n     U_\\eta(\\rho_A\\otimes\\tau_{\\nu,E})U_\\eta^\\dagger\n  \\right],\n  \\qquad\n  \\tau_{\\nu,E}:=\\sum_{k=0}^{\\infty}\n     \\frac{\\nu^k}{(\\nu+1)^{k+1}}\n     |k\\rangle_E\\!\\langle k|_E,\n  \\label{eq:p51-thermal-attenuator}\n\\end{equation}\nwhere $U_\\eta:AE\\to BE'$ is a beam-splitter unitary and\n$\\tau_{\\nu,E}$ acts on the environment mode $E$.  For an environment mode\nof angular frequency $\\omega_E$ at temperature $T$,\n$\\nu=(e^{\\hbar\\omega_E/(k_{\\rm B}T)}-1)^{-1}$.  Thus $0<T<\\infty$ is\nequivalent to $0<\\nu<\\infty$ for fixed $\\omega_E>0$; $\\nu=0$ corresponds\nto $T=0$, while $\\nu\\to\\infty$ as $T\\to\\infty$.  For a finite mean input photon\nnumber $0<N_{\\rm S}<\\infty$, define the energy-constrained unassisted quantum\ncapacity by\n\\begin{equation}\n  \\mathcal Q(\\Phi_{\\eta,\\nu},N_{\\rm S})\n  :=\\lim_{n\\to\\infty}\\frac1n\n  \\sup_{\\substack{\\rho_{A^n}:\\\\\n       \\operatorname{Tr}[\\rho_{A^n}\\sum_{j=1}^n\\hat n_j]\n       \\leq nN_{\\rm S}}}\n       I_{\\rm c}(\\rho_{A^n},\\Phi_{\\eta,\\nu}^{\\otimes n}),\n  \\label{eq:p51-energy-constrained-capacity}\n\\end{equation}\nwhere $\\hat n_j$ is the photon-number operator of the $j$th mode and\n$I_{\\rm c}(\\rho,\\mathcal N)\n:=S(\\mathcal N(\\rho))-S(\\mathcal N^{\\rm c}(\\rho))$.  Determine\nEq.~\\eqref{eq:p51-energy-constrained-capacity} for the thermal channel in\nEq.~\\eqref{eq:p51-thermal-attenuator}.","source":"The problem is implicit in the nonmatching energy-constrained bounds of\nSharma et al. and the strict multimode achievable-rate improvements of Noh,\nPirandola, and Jiang \\sourcecite{ref:p51-sharma-et-al}{SWA+18},\n\\sourcecite{ref:p51-noh-pirandola-jiang}{NPJ20}.","progress":["For the zero-temperature pure-loss channel, the constrained capacity\n  is known exactly:\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,0},N_{\\rm S})\n    =\\left[g(\\eta N_{\\rm S})-g((1-\\eta)N_{\\rm S})\\right]_+,\n    \\qquad\n    g(x):=(x+1)\\log_2(x+1)-x\\log_2x.\n    \\label{eq:p51-pure-loss-capacity}\n  \\end{equation}\n  Equation~\\eqref{eq:p51-pure-loss-capacity} does not extend directly to a\n  thermal environment \\sourcecite{ref:p51-wilde-qi}{WQ18}.","For $\\nu>0$, a thermal input of mean photon number $N_{\\rm S}$ gives\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,\\nu},N_{\\rm S})\n    \\geq[L(\\eta,\\nu,N_{\\rm S})]_+,\n    \\label{eq:p51-thermal-lower-bound}\n  \\end{equation}\n  where the rate in Eq.~\\eqref{eq:p51-thermal-lower-bound} is\n  \\begin{equation}\n    \\begin{aligned}\n    L(\\eta,\\nu,N_{\\rm S})\n      &:={}\n      g(\\eta N_{\\rm S}+(1-\\eta)\\nu)\\\\\n      &\\quad-g\\!\\left(\n        \\frac{\\Delta+(1-\\eta)N_{\\rm S}-(1-\\eta)\\nu-1}{2}\n      \\right)\\\\\n      &\\quad-g\\!\\left(\n        \\frac{\\Delta-(1-\\eta)N_{\\rm S}+(1-\\eta)\\nu-1}{2}\n      \\right),\\\\\n    \\Delta\n      &:=\\sqrt{[(1+\\eta)N_{\\rm S}+(1-\\eta)\\nu+1]^2\n                -4\\eta N_{\\rm S}(N_{\\rm S}+1)}.\n    \\end{aligned}\n    \\label{eq:p51-thermal-rate}\n  \\end{equation}\n  The expression in Eq.~\\eqref{eq:p51-thermal-rate} is a one-use achievable\n  rate, not an exact capacity formula\n  \\sourcecite{ref:p51-holevo-werner}{HW01},\n  \\sourcecite{ref:p51-sharma-et-al}{SWA+18}.","Multimode Gaussian constructions improve the raw thermal-input rate\n  through the convexified bound\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,\\nu},N_{\\rm S})\n    \\geq\\sup_{0<x\\leq1}\n      xI_{\\rm c}(\\tau_{N_{\\rm S}/x},\\Phi_{\\eta,\\nu})\n    \\geq[L(\\eta,\\nu,N_{\\rm S})]_+.\n    \\label{eq:p51-convexified-achievable-rate}\n  \\end{equation}\n  For $\\nu=N_{\\rm S}=1$, this construction numerically improves the\n  single-mode thermal rate in a nontrivial loss regime\n  \\sourcecite{ref:p51-noh-pirandola-jiang}{NPJ20}.","A data-processing decomposition gives, for $1/2\\leq\\eta<1$,\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,\\nu},N_{\\rm S})\n    \\leq[U(\\eta,\\nu,N_{\\rm S})]_+,\n    \\qquad\n    U:=g(\\eta'N_{\\rm S})-g((1-\\eta')N_{\\rm S}),\n    \\quad\n    \\eta':=\\frac{\\eta}{1+(1-\\eta)\\nu}.\n    \\label{eq:p51-data-processing-upper-bound}\n  \\end{equation}\n  The upper bound in Eq.~\\eqref{eq:p51-data-processing-upper-bound} generally\n  does not meet Eq.~\\eqref{eq:p51-convexified-achievable-rate}\n  \\sourcecite{ref:p51-sharma-et-al}{SWA+18}.","The unconstrained optimization over all single-mode Gaussian inputs\n  is known, but its proof fixes output entropy rather than input energy and\n  explicitly does not establish thermal-state optimality at fixed\n  $N_{\\rm S}$ \\sourcecite{ref:p51-mele-et-al}{MCF+26}."],"references":[{"key":"WQ18","label":"ref:p51-wilde-qi","tex":"M. M. Wilde and H. Qi,\n  ``Energy-Constrained Private and Quantum Capacities of Quantum Channels,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{64}, 7802--7827\n  (2018).\n  \\href{https://doi.org/10.1109/TIT.2018.2854766}{doi:10.1109/TIT.2018.2854766};\n  \\href{https://arxiv.org/abs/1609.01997}{arXiv:1609.01997}."},{"key":"HW01","label":"ref:p51-holevo-werner","tex":"A. S. Holevo and R. F. Werner,\n  ``Evaluating Capacities of Bosonic Gaussian Channels,''\n  \\emph{Physical Review A} \\textbf{63}, 032312 (2001).\n  \\href{https://doi.org/10.1103/PhysRevA.63.032312}{doi:10.1103/PhysRevA.63.032312};\n  \\href{https://arxiv.org/abs/quant-ph/9912067}{arXiv:quant-ph/9912067}."},{"key":"SWA+18","label":"ref:p51-sharma-et-al","tex":"K. Sharma, M. M. Wilde, S. Adhikari, and M. Takeoka,\n  ``Bounding the Energy-Constrained Quantum and Private Capacities of\n  Phase-Insensitive Bosonic Gaussian Channels,''\n  \\emph{New Journal of Physics} \\textbf{20}, 063025 (2018).\n  \\href{https://doi.org/10.1088/1367-2630/aac11a}{doi:10.1088/1367-2630/aac11a};\n  \\href{https://arxiv.org/abs/1708.07257}{arXiv:1708.07257}."},{"key":"NPJ20","label":"ref:p51-noh-pirandola-jiang","tex":"K. Noh, S. Pirandola, and L. Jiang,\n  ``Enhanced Energy-Constrained Quantum Communication over Bosonic Gaussian\n  Channels,'' \\emph{Nature Communications} \\textbf{11}, 457 (2020).\n  \\href{https://doi.org/10.1038/s41467-020-14329-6}{doi:10.1038/s41467-020-14329-6};\n  \\href{https://arxiv.org/abs/1811.06988}{arXiv:1811.06988}."},{"key":"MCF+26","label":"ref:p51-mele-et-al","tex":"F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami,\n  ``Bosonic Quantum Communication Beyond the Thermal Threshold,''\n  arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2607.27449}{arXiv:2607.27449}."}],"comment":"For finite $\\nu>0$ and finite $N_{\\rm S}$, neither the optimal one-use input\nnor the necessity of regularization is known.  This constrained problem is\ndistinct from the unconstrained capacity in Problem~49."}}
---
## Source

The problem is implicit in the nonmatching energy-constrained bounds of Sharma et al. and the strict multimode achievable-rate improvements of Noh, Pirandola, and Jiang [SWA+18](https://doi.org/10.1088/1367-2630/aac11a), [NPJ20](https://doi.org/10.1038/s41467-020-14329-6).

## Progress

For the zero-temperature pure-loss channel, the constrained capacity is known exactly:

$$
\mathcal Q(\Phi_{\eta,0},N_{\rm S})
 =\left[g(\eta N_{\rm S})-g((1-\eta)N_{\rm S})\right]_+,
 \qquad
 g(x):=(x+1)\log_2(x+1)-x\log_2x.
 \tag{3}
$$

Equation (3) does not extend directly to a thermal environment [WQ18](https://doi.org/10.1109/TIT.2018.2854766).

For $\nu>0$, a thermal input of mean photon number $N_{\rm S}$ gives

$$
\mathcal Q(\Phi_{\eta,\nu},N_{\rm S})
 \geq[L(\eta,\nu,N_{\rm S})]_+,
 \tag{4}
$$

where the rate in Eq. (4) is

$$
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
 \tag{5}
$$

The expression in Eq. (5) is a one-use achievable rate, not an exact capacity formula [HW01](https://doi.org/10.1103/PhysRevA.63.032312), [SWA+18](https://doi.org/10.1088/1367-2630/aac11a).

Multimode Gaussian constructions improve the raw thermal-input rate through the convexified bound

$$
\mathcal Q(\Phi_{\eta,\nu},N_{\rm S})
 \geq\sup_{0<x\leq1}
 xI_{\rm c}(\tau_{N_{\rm S}/x},\Phi_{\eta,\nu})
 \geq[L(\eta,\nu,N_{\rm S})]_+.
 \tag{6}
$$

For $\nu=N_{\rm S}=1$, this construction numerically improves the single-mode thermal rate in a nontrivial loss regime [NPJ20](https://doi.org/10.1038/s41467-020-14329-6).

A data-processing decomposition gives, for $1/2\leq\eta<1$,

$$
\mathcal Q(\Phi_{\eta,\nu},N_{\rm S})
 \leq[U(\eta,\nu,N_{\rm S})]_+,
 \qquad
 U:=g(\eta'N_{\rm S})-g((1-\eta')N_{\rm S}),
 \quad
 \eta':=\frac{\eta}{1+(1-\eta)\nu}.
 \tag{7}
$$

The upper bound in Eq. (7) generally does not meet Eq. (6) [SWA+18](https://doi.org/10.1088/1367-2630/aac11a).

The unconstrained optimization over all single-mode Gaussian inputs is known, but its proof fixes output entropy rather than input energy and explicitly does not establish thermal-state optimality at fixed $N_{\rm S}$ [MCF+26](https://arxiv.org/abs/2607.27449).

## Comment

For finite $\nu>0$ and finite $N_{\rm S}$, neither the optimal one-use input nor the necessity of regularization is known. This constrained problem is distinct from the unconstrained capacity in Problem 49.

## References

**WQ18** M. M. Wilde and H. Qi, “Energy-Constrained Private and Quantum Capacities of Quantum Channels,” *IEEE Transactions on Information Theory* **64**, 7802–7827 (2018). [doi:10.1109/TIT.2018.2854766](https://doi.org/10.1109/TIT.2018.2854766); [arXiv:1609.01997](https://arxiv.org/abs/1609.01997).

**HW01** A. S. Holevo and R. F. Werner, “Evaluating Capacities of Bosonic Gaussian Channels,” *Physical Review A* **63**, 032312 (2001). [doi:10.1103/PhysRevA.63.032312](https://doi.org/10.1103/PhysRevA.63.032312); [arXiv:quant-ph/9912067](https://arxiv.org/abs/quant-ph/9912067).

**SWA+18** K. Sharma, M. M. Wilde, S. Adhikari, and M. Takeoka, “Bounding the Energy-Constrained Quantum and Private Capacities of Phase-Insensitive Bosonic Gaussian Channels,” *New Journal of Physics* **20**, 063025 (2018). [doi:10.1088/1367-2630/aac11a](https://doi.org/10.1088/1367-2630/aac11a); [arXiv:1708.07257](https://arxiv.org/abs/1708.07257).

**NPJ20** K. Noh, S. Pirandola, and L. Jiang, “Enhanced Energy-Constrained Quantum Communication over Bosonic Gaussian Channels,” *Nature Communications* **11**, 457 (2020). [doi:10.1038/s41467-020-14329-6](https://doi.org/10.1038/s41467-020-14329-6); [arXiv:1811.06988](https://arxiv.org/abs/1811.06988).

**MCF+26** F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami, “Bosonic Quantum Communication Beyond the Thermal Threshold,” arXiv preprint (2026). [arXiv:2607.27449](https://arxiv.org/abs/2607.27449).
