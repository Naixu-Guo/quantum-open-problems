---
id: "01M1HME7803ZFMDQWV9SVP8FH8"
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
topicIds: ["bosonic-channels","quantum-capacity","antidegradable-channels","coherent-information","continuous-variable-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Positivity threshold for thermal-attenuator quantum capacity"
aliases: ["op-2beed65d248be57a","op_2beed65d248be57a","01M1HME7803ZFMDQWV9SVP8FH8","v2-positivity-threshold-for-thermal-attenuator-quantum-capacity","open-problem-v2-problem-50"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_2beed65d248be57a.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_2beed65d248be57a","ulid":"01M1HME7803ZFMDQWV9SVP8FH8","aliases":["op_2beed65d248be57a","01M1HME7803ZFMDQWV9SVP8FH8","op-2beed65d248be57a","v2-positivity-threshold-for-thermal-attenuator-quantum-capacity","open-problem-v2-problem-50"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["bosonic-channels","quantum-capacity","antidegradable-channels","coherent-information","continuous-variable-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Positivity threshold for thermal-attenuator quantum capacity","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Bosonic channels","Quantum capacity","Antidegradable channels","Coherent information","Continuous-variable systems"],"statement":"For $0<\\eta<1$ and $0<\\nu<\\infty$, let the single-mode bosonic thermal\nattenuator be\n\\begin{equation}\n  \\Phi_{\\eta,\\nu}(\\rho_A)\n  :=\\operatorname{Tr}_{E'}\\!\\left[\n     U_\\eta(\\rho_A\\otimes\\tau_{\\nu,E})U_\\eta^\\dagger\n  \\right],\n  \\qquad\n  \\tau_{\\nu,E}:=\\sum_{k=0}^{\\infty}\n     \\frac{\\nu^k}{(\\nu+1)^{k+1}}\n     |k\\rangle_E\\!\\langle k|_E,\n  \\label{eq:p50-thermal-attenuator}\n\\end{equation}\nwhere $U_\\eta:AE\\to BE'$ is a beam-splitter unitary and\n$\\tau_{\\nu,E}$ acts on the environment mode $E$.  For an environment mode\nof angular frequency $\\omega_E$ at temperature $T$,\n$\\nu=(e^{\\hbar\\omega_E/(k_{\\rm B}T)}-1)^{-1}$.  Thus $0<T<\\infty$ is\nequivalent to $0<\\nu<\\infty$ for fixed $\\omega_E>0$; $\\nu=0$ corresponds\nto $T=0$, while $\\nu\\to\\infty$ as $T\\to\\infty$.  Define its unassisted quantum\ncapacity and its critical transmissivity by\n\\begin{equation}\n  \\mathcal Q(\\Phi_{\\eta,\\nu})\n  :=\\lim_{n\\to\\infty}\\frac1n\\sup_{\\rho_{A^n}}\n       I_{\\rm c}(\\rho_{A^n},\\Phi_{\\eta,\\nu}^{\\otimes n}),\n  \\qquad\n  \\eta_{\\rm c}(\\nu)\n  :=\\inf\\{\\eta\\in(0,1):\\mathcal Q(\\Phi_{\\eta,\\nu})>0\\},\n  \\label{eq:p50-critical-transmissivity}\n\\end{equation}\nwhere $I_{\\rm c}(\\rho,\\mathcal N)\n:=S(\\mathcal N(\\rho))-S(\\mathcal N^{\\rm c}(\\rho))$.  Determine the exact\nthreshold curve in Eq.~\\eqref{eq:p50-critical-transmissivity} for the channel\nin Eq.~\\eqref{eq:p50-thermal-attenuator}.","source":"The exact positivity threshold is implicit in the gap between the\nantidegradability boundary of Lami et al. and the non-Gaussian positive-rate\nwitnesses of Mele et al. \\sourcecite{ref:p50-lami-et-al}{LKA+19},\n\\sourcecite{ref:p50-mele-et-al}{MCF+26}.","progress":["Exact antidegradability gives the lower bound\n  \\begin{equation}\n    \\eta_{\\rm c}(\\nu)\\geq\\eta_{\\rm AD}(\\nu)\n    :=\\frac{\\nu+\\frac12}{\\nu+1}.\n    \\label{eq:p50-antidegradable-lower-bound}\n  \\end{equation}\n  The capacity vanishes at and below the right-hand side of\n  Eq.~\\eqref{eq:p50-antidegradable-lower-bound}\n  \\sourcecite{ref:p50-lami-et-al}{LKA+19}.","Thermal input states give the upper bound\n  \\begin{equation}\n    \\eta_{\\rm c}(\\nu)\\leq\\eta_{\\rm G}(\\nu)\n    :=\\frac{2^{g(\\nu)}}{1+2^{g(\\nu)}},\n    \\qquad\n    g(x):=(x+1)\\log_2(x+1)-x\\log_2x.\n    \\label{eq:p50-gaussian-upper-bound}\n  \\end{equation}\n  Above the right-hand side of Eq.~\\eqref{eq:p50-gaussian-upper-bound}, the\n  thermal-state coherent information is positive\n  \\sourcecite{ref:p50-holevo-werner}{HW01}.","For one environmental thermal photon, certified non-Gaussian inputs\n  and antidegradability narrow the threshold to\n  \\begin{equation}\n    \\frac34\\leq\\eta_{\\rm c}(1)\\leq0.7841\n    <\\eta_{\\rm G}(1)=\\frac45.\n    \\label{eq:p50-one-photon-window}\n  \\end{equation}\n  In particular, Eq.~\\eqref{eq:p50-one-photon-window} proves that the Gaussian\n  threshold is not the true positivity threshold\n  \\sourcecite{ref:p50-mele-et-al}{MCF+26}."],"references":[{"key":"LKA+19","label":"ref:p50-lami-et-al","tex":"L. Lami, S. Khatri, G. Adesso, and M. M. Wilde,\n  ``Extendibility of Bosonic Gaussian States,''\n  \\emph{Physical Review Letters} \\textbf{123}, 050501 (2019).\n  \\href{https://doi.org/10.1103/PhysRevLett.123.050501}{doi:10.1103/PhysRevLett.123.050501};\n  \\href{https://arxiv.org/abs/1904.02692}{arXiv:1904.02692}."},{"key":"HW01","label":"ref:p50-holevo-werner","tex":"A. S. Holevo and R. F. Werner,\n  ``Evaluating Capacities of Bosonic Gaussian Channels,''\n  \\emph{Physical Review A} \\textbf{63}, 032312 (2001).\n  \\href{https://doi.org/10.1103/PhysRevA.63.032312}{doi:10.1103/PhysRevA.63.032312};\n  \\href{https://arxiv.org/abs/quant-ph/9912067}{arXiv:quant-ph/9912067}."},{"key":"MCF+26","label":"ref:p50-mele-et-al","tex":"F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami,\n  ``Bosonic Quantum Communication Beyond the Thermal Threshold,''\n  arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2607.27449}{arXiv:2607.27449}."}],"comment":"This is the positivity-boundary subproblem of determining the full capacity\nin Problem~49.  Even the single value in\nEq.~\\eqref{eq:p50-one-photon-window} is not known exactly."}}
---
## Source

The exact positivity threshold is implicit in the gap between the antidegradability boundary of Lami et al. and the non-Gaussian positive-rate witnesses of Mele et al. [LKA+19](https://doi.org/10.1103/PhysRevLett.123.050501), [MCF+26](https://arxiv.org/abs/2607.27449).

## Progress

Exact antidegradability gives the lower bound

$$
\eta_{\rm c}(\nu)\geq\eta_{\rm AD}(\nu)
 :=\frac{\nu+\frac12}{\nu+1}.
 \tag{3}
$$

The capacity vanishes at and below the right-hand side of Eq. (3) [LKA+19](https://doi.org/10.1103/PhysRevLett.123.050501).

Thermal input states give the upper bound

$$
\eta_{\rm c}(\nu)\leq\eta_{\rm G}(\nu)
 :=\frac{2^{g(\nu)}}{1+2^{g(\nu)}},
 \qquad
 g(x):=(x+1)\log_2(x+1)-x\log_2x.
 \tag{4}
$$

Above the right-hand side of Eq. (4), the thermal-state coherent information is positive [HW01](https://doi.org/10.1103/PhysRevA.63.032312).

For one environmental thermal photon, certified non-Gaussian inputs and antidegradability narrow the threshold to

$$
\frac34\leq\eta_{\rm c}(1)\leq0.7841
 <\eta_{\rm G}(1)=\frac45.
 \tag{5}
$$

In particular, Eq. (5) proves that the Gaussian threshold is not the true positivity threshold [MCF+26](https://arxiv.org/abs/2607.27449).

## Comment

This is the positivity-boundary subproblem of determining the full capacity in Problem 49. Even the single value in Eq. (5) is not known exactly.

## References

**LKA+19** L. Lami, S. Khatri, G. Adesso, and M. M. Wilde, “Extendibility of Bosonic Gaussian States,” *Physical Review Letters* **123**, 050501 (2019). [doi:10.1103/PhysRevLett.123.050501](https://doi.org/10.1103/PhysRevLett.123.050501); [arXiv:1904.02692](https://arxiv.org/abs/1904.02692).

**HW01** A. S. Holevo and R. F. Werner, “Evaluating Capacities of Bosonic Gaussian Channels,” *Physical Review A* **63**, 032312 (2001). [doi:10.1103/PhysRevA.63.032312](https://doi.org/10.1103/PhysRevA.63.032312); [arXiv:quant-ph/9912067](https://arxiv.org/abs/quant-ph/9912067).

**MCF+26** F. A. Mele, G. Catalano, M. Fanizza, V. Giovannetti, and L. Lami, “Bosonic Quantum Communication Beyond the Thermal Threshold,” arXiv preprint (2026). [arXiv:2607.27449](https://arxiv.org/abs/2607.27449).
