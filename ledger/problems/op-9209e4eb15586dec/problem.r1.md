---
id: "01M1HME780AZ2GCKS76GDX97RQ"
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
title: "Quantum capacity of a bosonic thermal attenuator"
aliases: ["op-9209e4eb15586dec","op_9209e4eb15586dec","01M1HME780AZ2GCKS76GDX97RQ","v2-quantum-capacity-of-a-bosonic-thermal-attenuator","open-problem-v2-problem-49"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_9209e4eb15586dec.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_9209e4eb15586dec","ulid":"01M1HME780AZ2GCKS76GDX97RQ","aliases":["op_9209e4eb15586dec","01M1HME780AZ2GCKS76GDX97RQ","op-9209e4eb15586dec","v2-quantum-capacity-of-a-bosonic-thermal-attenuator","open-problem-v2-problem-49"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["bosonic-channels","quantum-capacity","coherent-information","gaussian-quantum-information","continuous-variable-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Quantum capacity of a bosonic thermal attenuator","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Bosonic channels","Quantum capacity","Coherent information","Gaussian quantum information","Continuous-variable systems"],"statement":"Let $\\Phi_{\\eta,\\nu}$ be the single-mode bosonic thermal attenuator with\ntransmissivity $0<\\eta<1$ and environmental mean photon number\n$0<\\nu<\\infty$, defined by\n\\begin{equation}\n  \\Phi_{\\eta,\\nu}(\\rho_A)\n  :=\\operatorname{Tr}_{E'}\\!\\left[\n     U_\\eta(\\rho_A\\otimes\\tau_{\\nu,E})U_\\eta^\\dagger\n  \\right],\n  \\qquad\n  \\tau_{\\nu,E}:=\\sum_{k=0}^{\\infty}\n     \\frac{\\nu^k}{(\\nu+1)^{k+1}}\n     |k\\rangle_E\\!\\langle k|_E,\n  \\label{eq:p49-thermal-attenuator}\n\\end{equation}\nwhere $U_\\eta:AE\\to BE'$ is a beam-splitter unitary and\n$\\tau_{\\nu,E}$ acts on the environment mode $E$.  For an environment mode of\nangular frequency $\\omega_E$ at temperature $T$,\n$\\nu=(e^{\\hbar\\omega_E/(k_{\\rm B}T)}-1)^{-1}$.  Thus $0<T<\\infty$ is\nequivalent to $0<\\nu<\\infty$ for fixed $\\omega_E>0$; $\\nu=0$ corresponds to\n$T=0$, while $\\nu\\to\\infty$ as $T\\to\\infty$.  Its unassisted quantum capacity\nis the regularized coherent information\n\\begin{equation}\n  \\mathcal Q(\\Phi_{\\eta,\\nu})\n  :=\\lim_{n\\to\\infty}\\frac1n\\sup_{\\rho_{A^n}}\n       I_{\\rm c}(\\rho_{A^n},\\Phi_{\\eta,\\nu}^{\\otimes n}),\n  \\qquad\n  I_{\\rm c}(\\rho,\\mathcal N)\n  :=S(\\mathcal N(\\rho))-S(\\mathcal N^{\\rm c}(\\rho)),\n  \\label{eq:p49-quantum-capacity}\n\\end{equation}\nwhere $S(\\sigma):=-\\operatorname{Tr}(\\sigma\\log_2\\sigma)$ and\n$\\mathcal N^{\\rm c}$ is any complementary channel.  Determine\nEq.~\\eqref{eq:p49-quantum-capacity} for every\n$0<\\eta<1$ and $0<\\nu<\\infty$, equivalently every strictly positive finite\nenvironment temperature.","source":"Rosati, Mari, and Giovannetti explicitly study the unknown thermal-attenuator\nquantum capacity through nonmatching narrow bounds; the exact-capacity\nproblem is retained after the later non-Gaussian separation\n\\sourcecite{ref:p49-rosati-mari-giovannetti}{RMG18},\n\\sourcecite{ref:p49-mele-et-al}{MCF+26}.","progress":["At zero environmental temperature, the pure-loss capacity is\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,0})\n    =\\left[\\log_2\\frac{\\eta}{1-\\eta}\\right]_+,\n    \\qquad [x]_+:=\\max\\{0,x\\}.\n    \\label{eq:p49-pure-loss-capacity}\n  \\end{equation}\n  Thus Eq.~\\eqref{eq:p49-pure-loss-capacity} solves only the boundary case\n  $\\nu=0$ \\sourcecite{ref:p49-wolf-perez-garcia-giedke}{WPG07}.","Optimizing the one-use coherent information over all single-mode\n  Gaussian input states gives exactly\n  \\begin{equation}\n    \\sup_{\\rho\\in\\mathsf G_1}I_{\\rm c}(\\rho,\\Phi_{\\eta,\\nu})\n    =\\left[\\log_2\\frac{\\eta}{1-\\eta}-g(\\nu)\\right]_+,\n    \\qquad\n    g(x):=(x+1)\\log_2(x+1)-x\\log_2x.\n    \\label{eq:p49-gaussian-coherent-information}\n  \\end{equation}\n  Holevo and Werner computed the thermal-input limit, Br\\'adler proved that\n  the thermal-state supremum is attained asymptotically at infinite input\n  energy, and Mele et al.\\ proved that squeezing cannot improve it within\n  $\\mathsf G_1$.  Equation~\\eqref{eq:p49-gaussian-coherent-information} is\n  nevertheless not optimal over arbitrary non-Gaussian inputs\n  \\sourcecite{ref:p49-holevo-werner}{HW01},\n  \\sourcecite{ref:p49-bradler}{Br15},\n  \\sourcecite{ref:p49-mele-et-al}{MCF+26}.","The exact antidegradability region is\n  \\begin{equation}\n    \\eta\\leq\\eta_{\\rm AD}(\\nu):=\n    \\frac{\\nu+\\frac12}{\\nu+1},\n    \\qquad \\mathcal Q(\\Phi_{\\eta,\\nu})=0.\n    \\label{eq:p49-antidegradable-region}\n  \\end{equation}\n  Hence Eq.~\\eqref{eq:p49-quantum-capacity} is settled throughout the region\n  in Eq.~\\eqref{eq:p49-antidegradable-region}\n  \\sourcecite{ref:p49-lami-et-al}{LKA+19}.","In the non-entanglement-breaking region, a bottleneck decomposition\n  gives the analytic upper bound\n  \\begin{equation}\n    \\mathcal Q(\\Phi_{\\eta,\\nu})\n    \\leq\\left[\n      \\log_2\\frac{\\eta-(1-\\eta)\\nu}{(1-\\eta)(\\nu+1)}\n    \\right]_+\n    \\quad\\text{when }\\eta>(1-\\eta)\\nu.\n    \\label{eq:p49-bottleneck-bound}\n  \\end{equation}\n  The channel is entanglement breaking, and therefore has zero capacity,\n  when the displayed condition fails.  The bound in\n  Eq.~\\eqref{eq:p49-bottleneck-bound} was obtained independently by Rosati\n  et al.\\ and Noh et al.\\\n  \\sourcecite{ref:p49-rosati-mari-giovannetti}{RMG18},\n  \\sourcecite{ref:p49-noh-albert-jiang}{NAJ19}.  Degradable extensions and\n  channel-concatenation orderings subsequently produced tighter\n  parameter-dependent upper bounds, but no known upper bound is tight\n  throughout the non-antidegradable region\n  \\sourcecite{ref:p49-fanizza-kianvash-giovannetti}{FKG21},\n  \\sourcecite{ref:p49-kianvash-fanizza-giovannetti}{KFG24}.","Asymptotic multimode symplectic-lattice GKP codes achieve a rate whose\n  gap from the upper bound in Eq.~\\eqref{eq:p49-bottleneck-bound} is at most\n  $\\log_2 e\\simeq1.443$ qubits per channel use in the energy-unconstrained\n  setting.  This is a constant-gap coding theorem, not an exact capacity\n  formula \\sourcecite{ref:p49-noh-albert-jiang}{NAJ19}.","The latest rigorous lower bounds use non-Gaussian one-mode inputs:\n  \\begin{equation}\n    \\begin{aligned}\n      \\sup_{\\rho\\in\\mathsf G_1}I_{\\rm c}(\\rho,\\Phi_{4/5,1})\n        &=0,\n      &\\qquad\n      \\mathcal Q(\\Phi_{4/5,1})\n        &\\geq4.7\\times10^{-4},\\\\\n      \\mathcal Q(\\Phi_{0.7841,1})\n        &\\geq1.4312\\times10^{-7},\\\\\n      \\eta_{\\rm c}\n        &:=\\inf\\{\\eta:\\mathcal Q(\\Phi_{\\eta,1})>0\\},\n      &\\qquad\n      0.75\\leq\\eta_{\\rm c}\n        &\\leq0.7841.\n    \\end{aligned}\n    \\label{eq:p49-nongaussian-separation}\n  \\end{equation}\n  The first certificate uses an explicit rank-two state supported on six\n  Fock levels; numerical optimization over related families reaches about\n  $8.4\\times10^{-3}$ qubits per use at $(\\eta,\\nu)=(0.8,1)$, but that larger\n  value is not certified.  The second certificate in\n  Eq.~\\eqref{eq:p49-nongaussian-separation} also propagates by data processing\n  to a two-dimensional parameter region.  These results disprove\n  single-mode Gaussian optimality but do not determine the capacity\n  \\sourcecite{ref:p49-mele-et-al}{MCF+26}."],"references":[{"key":"WPG07","label":"ref:p49-wolf-perez-garcia-giedke","tex":"M. M. Wolf, D. P\\'erez-Garc\\'ia, and G. Giedke,\n  ``Quantum Capacities of Bosonic Channels,''\n  \\emph{Physical Review Letters} \\textbf{98}, 130501 (2007).\n  \\href{https://doi.org/10.1103/PhysRevLett.98.130501}{doi:10.1103/PhysRevLett.98.130501};\n  \\href{https://arxiv.org/abs/quant-ph/0606132}{arXiv:quant-ph/0606132}."},{"key":"HW01","label":"ref:p49-holevo-werner","tex":"A. S. Holevo and R. F. Werner,\n  ``Evaluating Capacities of Bosonic Gaussian Channels,''\n  \\emph{Physical Review A} \\textbf{63}, 032312 (2001).\n  \\href{https://doi.org/10.1103/PhysRevA.63.032312}{doi:10.1103/PhysRevA.63.032312};\n  \\href{https://arxiv.org/abs/quant-ph/9912067}{arXiv:quant-ph/9912067}."},{"key":"Br15","label":"ref:p49-bradler","tex":"K. Br\\'adler,\n  ``Coherent Information of One-Mode Gaussian Channels---The General Case\n  of Non-Zero Added Classical Noise,''\n  \\emph{Journal of Physics A: Mathematical and Theoretical} \\textbf{48},\n  125301 (2015).\n  \\href{https://doi.org/10.1088/1751-8113/48/12/125301}{doi:10.1088/1751-8113/48/12/125301};\n  \\href{https://arxiv.org/abs/1406.6110}{arXiv:1406.6110}."},{"key":"RMG18","label":"ref:p49-rosati-mari-giovannetti","tex":"M. Rosati, A. Mari, and V. Giovannetti,\n  ``Narrow Bounds for the Quantum Capacity of Thermal Attenuators,''\n  \\emph{Nature Communications} \\textbf{9}, 4339 (2018).\n  \\href{https://doi.org/10.1038/s41467-018-06848-0}{doi:10.1038/s41467-018-06848-0};\n  \\href{https://arxiv.org/abs/1801.04731}{arXiv:1801.04731}."},{"key":"NAJ19","label":"ref:p49-noh-albert-jiang","tex":"{\\sloppy\n  K. Noh, V. V. Albert, and L. Jiang,\n  ``Quantum Capacity Bounds of Gaussian Thermal Loss Channels and\n  Achievable Rates with Gottesman--Kitaev--Preskill Codes,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{65}, 2563--2582\n  (2019).\n  \\href{https://doi.org/10.1109/TIT.2018.2873764}{doi:10.1109/TIT.2018.2873764};\n  \\href{https://arxiv.org/abs/1801.07271}{arXiv:1801.07271}.\n  \\par}"},{"key":"LKA+19","label":"ref:p49-lami-et-al","tex":"L. Lami, S. Khatri, G. Adesso, and M. M. Wilde,\n  ``Extendibility of Bosonic Gaussian States,''\n  \\emph{Physical Review Letters} \\textbf{123}, 050501 (2019).\n  \\href{https://doi.org/10.1103/PhysRevLett.123.050501}{doi:10.1103/PhysRevLett.123.050501};\n  \\href{https://arxiv.org/abs/1904.02692}{arXiv:1904.02692}."},{"key":"FKG21","label":"ref:p49-fanizza-kianvash-giovannetti","tex":"M. Fanizza, F. Kianvash, and V. Giovannetti,\n  ``Estimating Quantum and Private Capacities of Gaussian Channels via\n  Degradable Extensions,''\n  \\emph{Physical Review Letters} \\textbf{127}, 210501 (2021).\n  \\href{https://doi.org/10.1103/PhysRevLett.127.210501}{doi:10.1103/PhysRevLett.127.210501};\n  \\href{https://arxiv.org/abs/2103.09569}{arXiv:2103.09569}."},{"key":"KFG24","label":"ref:p49-kianvash-fanizza-giovannetti","tex":"F. Kianvash, M. Fanizza, and V. Giovannetti,\n  ``Low-Ground/High-Ground Capacity Regions Analysis for Bosonic Gaussian\n  Channels,''\n  \\emph{International Journal of Quantum Information} \\textbf{22}, 2440005\n  (2024).\n  \\href{https://doi.org/10.1142/S0219749924400057}{doi:10.1142/S0219749924400057};\n  \\href{https://arxiv.org/abs/2306.16350}{arXiv:2306.16350}."},{"key":"MCF+26","label":"ref:p49-mele-et-al","tex":"F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami,\n  ``Bosonic Quantum Communication Beyond the Thermal Threshold,''\n  arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2607.27449}{arXiv:2607.27449}."}],"comment":"For generic $\\nu>0$ outside the zero-capacity regions, the lower and upper\nbounds do not coincide.  Non-Gaussian one-mode optimization and possible\nmultimode superadditivity both remain relevant to\nEq.~\\eqref{eq:p49-quantum-capacity}."}}
---
## Source

Rosati, Mari, and Giovannetti explicitly study the unknown thermal-attenuator quantum capacity through nonmatching narrow bounds; the exact-capacity problem is retained after the later non-Gaussian separation [RMG18](https://doi.org/10.1038/s41467-018-06848-0), [MCF+26](https://arxiv.org/abs/2607.27449).

## Progress

At zero environmental temperature, the pure-loss capacity is

$$
\mathcal Q(\Phi_{\eta,0})
 =\left[\log_2\frac{\eta}{1-\eta}\right]_+,
 \qquad [x]_+:=\max\{0,x\}.
 \tag{3}
$$

Thus Eq. (3) solves only the boundary case $\nu=0$ [WPG07](https://doi.org/10.1103/PhysRevLett.98.130501).

Optimizing the one-use coherent information over all single-mode Gaussian input states gives exactly

$$
\sup_{\rho\in\mathsf G_1}I_{\rm c}(\rho,\Phi_{\eta,\nu})
 =\left[\log_2\frac{\eta}{1-\eta}-g(\nu)\right]_+,
 \qquad
 g(x):=(x+1)\log_2(x+1)-x\log_2x.
 \tag{4}
$$

Holevo and Werner computed the thermal-input limit, Brádler proved that the thermal-state supremum is attained asymptotically at infinite input energy, and Mele et al. proved that squeezing cannot improve it within $\mathsf G_1$. Equation (4) is nevertheless not optimal over arbitrary non-Gaussian inputs [HW01](https://doi.org/10.1103/PhysRevA.63.032312), [Br15](https://doi.org/10.1088/1751-8113/48/12/125301), [MCF+26](https://arxiv.org/abs/2607.27449).

The exact antidegradability region is

$$
\eta\leq\eta_{\rm AD}(\nu):=
 \frac{\nu+\frac12}{\nu+1},
 \qquad \mathcal Q(\Phi_{\eta,\nu})=0.
 \tag{5}
$$

Hence Eq. (2) is settled throughout the region in Eq. (5) [LKA+19](https://doi.org/10.1103/PhysRevLett.123.050501).

In the non-entanglement-breaking region, a bottleneck decomposition gives the analytic upper bound

$$
\mathcal Q(\Phi_{\eta,\nu})
 \leq\left[
 \log_2\frac{\eta-(1-\eta)\nu}{(1-\eta)(\nu+1)}
 \right]_+
 \quad\text{when }\eta>(1-\eta)\nu.
 \tag{6}
$$

The channel is entanglement breaking, and therefore has zero capacity, when the displayed condition fails. The bound in Eq. (6) was obtained independently by Rosati et al. and Noh et al. [RMG18](https://doi.org/10.1038/s41467-018-06848-0), [NAJ19](https://doi.org/10.1109/TIT.2018.2873764). Degradable extensions and channel-concatenation orderings subsequently produced tighter parameter-dependent upper bounds, but no known upper bound is tight throughout the non-antidegradable region [FKG21](https://doi.org/10.1103/PhysRevLett.127.210501), [KFG24](https://doi.org/10.1142/S0219749924400057).

Asymptotic multimode symplectic-lattice GKP codes achieve a rate whose gap from the upper bound in Eq. (6) is at most $\log_2 e\simeq1.443$ qubits per channel use in the energy-unconstrained setting. This is a constant-gap coding theorem, not an exact capacity formula [NAJ19](https://doi.org/10.1109/TIT.2018.2873764).

The latest rigorous lower bounds use non-Gaussian one-mode inputs:

$$
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
 \tag{7}
$$

The first certificate uses an explicit rank-two state supported on six Fock levels; numerical optimization over related families reaches about $8.4\times10^{-3}$ qubits per use at $(\eta,\nu)=(0.8,1)$, but that larger value is not certified. The second certificate in Eq. (7) also propagates by data processing to a two-dimensional parameter region. These results disprove single-mode Gaussian optimality but do not determine the capacity [MCF+26](https://arxiv.org/abs/2607.27449).

## Comment

For generic $\nu>0$ outside the zero-capacity regions, the lower and upper bounds do not coincide. Non-Gaussian one-mode optimization and possible multimode superadditivity both remain relevant to Eq. (2).

## References

**WPG07** M. M. Wolf, D. Pérez-García, and G. Giedke, “Quantum Capacities of Bosonic Channels,” *Physical Review Letters* **98**, 130501 (2007). [doi:10.1103/PhysRevLett.98.130501](https://doi.org/10.1103/PhysRevLett.98.130501); [arXiv:quant-ph/0606132](https://arxiv.org/abs/quant-ph/0606132).

**HW01** A. S. Holevo and R. F. Werner, “Evaluating Capacities of Bosonic Gaussian Channels,” *Physical Review A* **63**, 032312 (2001). [doi:10.1103/PhysRevA.63.032312](https://doi.org/10.1103/PhysRevA.63.032312); [arXiv:quant-ph/9912067](https://arxiv.org/abs/quant-ph/9912067).

**Br15** K. Brádler, “Coherent Information of One-Mode Gaussian Channels—The General Case of Non-Zero Added Classical Noise,” *Journal of Physics A: Mathematical and Theoretical* **48**, 125301 (2015). [doi:10.1088/1751-8113/48/12/125301](https://doi.org/10.1088/1751-8113/48/12/125301); [arXiv:1406.6110](https://arxiv.org/abs/1406.6110).

**RMG18** M. Rosati, A. Mari, and V. Giovannetti, “Narrow Bounds for the Quantum Capacity of Thermal Attenuators,” *Nature Communications* **9**, 4339 (2018). [doi:10.1038/s41467-018-06848-0](https://doi.org/10.1038/s41467-018-06848-0); [arXiv:1801.04731](https://arxiv.org/abs/1801.04731).

**NAJ19** K. Noh, V. V. Albert, and L. Jiang, “Quantum Capacity Bounds of Gaussian Thermal Loss Channels and Achievable Rates with Gottesman–Kitaev–Preskill Codes,” *IEEE Transactions on Information Theory* **65**, 2563–2582 (2019). [doi:10.1109/TIT.2018.2873764](https://doi.org/10.1109/TIT.2018.2873764); [arXiv:1801.07271](https://arxiv.org/abs/1801.07271).

**LKA+19** L. Lami, S. Khatri, G. Adesso, and M. M. Wilde, “Extendibility of Bosonic Gaussian States,” *Physical Review Letters* **123**, 050501 (2019). [doi:10.1103/PhysRevLett.123.050501](https://doi.org/10.1103/PhysRevLett.123.050501); [arXiv:1904.02692](https://arxiv.org/abs/1904.02692).

**FKG21** M. Fanizza, F. Kianvash, and V. Giovannetti, “Estimating Quantum and Private Capacities of Gaussian Channels via Degradable Extensions,” *Physical Review Letters* **127**, 210501 (2021). [doi:10.1103/PhysRevLett.127.210501](https://doi.org/10.1103/PhysRevLett.127.210501); [arXiv:2103.09569](https://arxiv.org/abs/2103.09569).

**KFG24** F. Kianvash, M. Fanizza, and V. Giovannetti, “Low-Ground/High-Ground Capacity Regions Analysis for Bosonic Gaussian Channels,” *International Journal of Quantum Information* **22**, 2440005 (2024). [doi:10.1142/S0219749924400057](https://doi.org/10.1142/S0219749924400057); [arXiv:2306.16350](https://arxiv.org/abs/2306.16350).

**MCF+26** F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami, “Bosonic Quantum Communication Beyond the Thermal Threshold,” arXiv preprint (2026). [arXiv:2607.27449](https://arxiv.org/abs/2607.27449).
