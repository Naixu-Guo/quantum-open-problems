---
id: "01M1HME780RHDHC0HWTHTESKBH"
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
areaIds: ["quantum-resource-theory","quantum-metrology"]
topicIds: ["quantum-hypothesis-testing","channel-discrimination","quantum-relative-entropy"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Generalized Stein lemma for fully quantum channel resources"
aliases: ["op-2579e084f37ac18c","op_2579e084f37ac18c","01M1HME780RHDHC0HWTHTESKBH","v2-generalized-stein-lemma-for-fully-quantum-channel-resources","open-problem-v2-problem-47"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_2579e084f37ac18c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_2579e084f37ac18c","ulid":"01M1HME780RHDHC0HWTHTESKBH","aliases":["op_2579e084f37ac18c","01M1HME780RHDHC0HWTHTESKBH","op-2579e084f37ac18c","v2-generalized-stein-lemma-for-fully-quantum-channel-resources","open-problem-v2-problem-47"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory","quantum-metrology"],"topicIds":["quantum-hypothesis-testing","channel-discrimination","quantum-relative-entropy"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Generalized Stein lemma for fully quantum channel resources","status":"Unsolved","fields":["Quantum Resource Theory","Quantum metrology"],"topics":["Quantum hypothesis testing","Channel discrimination","Quantum relative entropy"],"statement":"Let $\\mathcal N:\\mathcal L(A)\\to\\mathcal L(B)$ be a finite-dimensional\nquantum channel.  For each $n$, let $\\mathfrak F_n$ be a nonempty compact,\nconvex, permutation-invariant set of channels from $A^{\\otimes n}$ to\n$B^{\\otimes n}$, closed under tensor products and containing\n$\\mathcal R_\\omega^{\\otimes n}$ for one full-rank state $\\omega$, where\n$\\mathcal R_\\omega(X):=\\operatorname{Tr}(X)\\omega$.  Define\n\\begin{equation}\n  D_{\\rm ch}(\\mathcal N^{\\otimes n}\\|\\mathcal M_n)\n  :=\\sup_{\\psi_{R_nA^n}}\n  D\\!\\left(\n    (\\operatorname{id}_{R_n}\\otimes\\mathcal N^{\\otimes n})(\\psi)\n    \\middle\\|\n    (\\operatorname{id}_{R_n}\\otimes\\mathcal M_n)(\\psi)\n  \\right),\n  \\qquad R_n\\simeq A^{\\otimes n},\n  \\label{eq:p47-channel-relative-entropy}\n\\end{equation}\nwhere the supremum in Eq.~\\eqref{eq:p47-channel-relative-entropy} is over\ndensity operators and $D$ is the quantum relative entropy.  The distance to\nthe free set is\n\\begin{equation}\n  E_n^{\\rm QQ}(\\mathcal N\\|\\mathfrak F_n)\n  :=\\inf_{\\mathcal M_n\\in\\mathfrak F_n}\n  D_{\\rm ch}(\\mathcal N^{\\otimes n}\\|\\mathcal M_n).\n  \\label{eq:p47-free-channel-distance}\n\\end{equation}\nEquation~\\eqref{eq:p47-free-channel-distance} is the $n$-use relative-entropy\ndistance to the free channel set.  For $\\varepsilon\\in(0,1)$, define the\noptimal worst-case type-II error of a\nparallel quantum-input/quantum-output test by\n\\begin{equation}\n  \\begin{aligned}\n  \\beta_{\\varepsilon,n}^{\\rm QQ}(\\mathcal N\\|\\mathfrak F_n)\n  :=\\inf_{\\substack{\\psi_{R_nA^n},\\ 0\\leq Q\\leq I\\\\\n       \\operatorname{Tr}[Q(\\operatorname{id}_{R_n}\\otimes\n       \\mathcal N^{\\otimes n})(\\psi)]\\geq1-\\varepsilon}}\n  \\ \\sup_{\\mathcal M_n\\in\\mathfrak F_n}\n  \\operatorname{Tr}\\!\\left[\n       Q(\\operatorname{id}_{R_n}\\otimes\\mathcal M_n)(\\psi)\n  \\right].\n  \\end{aligned}\n  \\label{eq:p47-composite-type-two-error}\n\\end{equation}\nUnder what additional structural assumptions on $(\\mathfrak F_n)_{n\\geq1}$,\nif any, do both limits exist and obey the fully quantum generalized Stein\nidentity\n\\begin{equation}\n  \\lim_{n\\to\\infty}-\\frac1n\\log_2\n  \\beta_{\\varepsilon,n}^{\\rm QQ}(\\mathcal N\\|\\mathfrak F_n)\n  =\\lim_{n\\to\\infty}\\frac1n\n  E_n^{\\rm QQ}(\\mathcal N\\|\\mathfrak F_n)\n  \\qquad\\text{for every }\\varepsilon\\in(0,1)?\n  \\label{eq:p47-fully-quantum-stein}\n\\end{equation}","source":"The fully quantum formulation is implicit in the two generalized Stein\ntheorems for classical-input channels, both of which isolate their\nclassical-input structure from the unresolved quantum-input setting\n\\sourcecite{ref:p47-hayashi-yamasaki-cq}{HY25b},\n\\sourcecite{ref:p47-bergh-datta-khaitan}{BDK25}.","progress":["For an i.i.d. resource state tested against admissible composite sets\n  of free states, the generalized quantum Stein lemma identifies the\n  fixed-error exponent with the regularized relative entropy of resource\n  \\sourcecite{ref:p47-hayashi-yamasaki-state}{HY25a}.","Two independent works prove the channel analogue for\n  classical--quantum channels.  In that setting the channel relative entropy\n  reduces to\n  \\begin{equation}\n    D_{\\rm CQ}(\\Phi\\|\\Psi)=\\max_x D(\\rho_x\\|\\sigma_x),\n    \\qquad \\Phi:x\\mapsto\\rho_x,\\quad\\Psi:x\\mapsto\\sigma_x,\n    \\label{eq:p47-cq-divergence}\n  \\end{equation}\n  and its pointwise structure supplies the additivity and minimax steps needed\n  for a fixed-error theorem.  These steps apply to\n  Eq.~\\eqref{eq:p47-cq-divergence} but are unavailable in this form for QQ\n  channels\n  \\sourcecite{ref:p47-hayashi-yamasaki-cq}{HY25b},\n  \\sourcecite{ref:p47-bergh-datta-khaitan}{BDK25}.","The CQ proof explicitly states that analogous properties for fully\n  quantum channels remain unclear.  Entangled quantum inputs introduce a\n  reference system and a nontrivial order between input optimization and the\n  worst-case free-channel optimization in\n  Eq.~\\eqref{eq:p47-composite-type-two-error}\n  \\sourcecite{ref:p47-hayashi-yamasaki-cq}{HY25b}."],"references":[{"key":"HY25a","label":"ref:p47-hayashi-yamasaki-state","tex":"M. Hayashi and H. Yamasaki,\n  ``The Generalized Quantum Stein's Lemma and the Second Law of Quantum\n  Resource Theories,'' \\emph{Nature Physics} \\textbf{21}, 1988--1993 (2025).\n  \\href{https://doi.org/10.1038/s41567-025-03047-9}{doi:10.1038/s41567-025-03047-9};\n  \\href{https://arxiv.org/abs/2408.02722}{arXiv:2408.02722}."},{"key":"HY25b","label":"ref:p47-hayashi-yamasaki-cq","tex":"M. Hayashi and H. Yamasaki,\n  ``Generalized Quantum Stein's Lemma for Classical-Quantum Dynamical\n  Resources,'' arXiv preprint (2025).\n  \\href{https://arxiv.org/abs/2509.07271}{arXiv:2509.07271}."},{"key":"BDK25","label":"ref:p47-bergh-datta-khaitan","tex":"B. Bergh, N. Datta, and A. Khaitan,\n  ``Generalized Quantum Stein's Lemma and Reversibility of Quantum Resource\n  Theories for Classical-Quantum Channels,'' arXiv preprint (2025).\n  \\href{https://arxiv.org/abs/2509.13280}{arXiv:2509.13280}."}],"comment":"The state theorem and the CQ-channel theorems do not imply\nEq.~\\eqref{eq:p47-fully-quantum-stein} for genuinely quantum inputs.  An\nadaptive quantum-comb version would be a further problem and is not included\nin the present statement."}}
---
## Source

The fully quantum formulation is implicit in the two generalized Stein theorems for classical-input channels, both of which isolate their classical-input structure from the unresolved quantum-input setting [HY25b](https://arxiv.org/abs/2509.07271), [BDK25](https://arxiv.org/abs/2509.13280).

## Progress

For an i.i.d. resource state tested against admissible composite sets of free states, the generalized quantum Stein lemma identifies the fixed-error exponent with the regularized relative entropy of resource [HY25a](https://doi.org/10.1038/s41567-025-03047-9).

Two independent works prove the channel analogue for classical–quantum channels. In that setting the channel relative entropy reduces to

$$
D_{\rm CQ}(\Phi\|\Psi)=\max_x D(\rho_x\|\sigma_x),
 \qquad \Phi:x\mapsto\rho_x,\quad\Psi:x\mapsto\sigma_x,
 \tag{5}
$$

and its pointwise structure supplies the additivity and minimax steps needed for a fixed-error theorem. These steps apply to Eq. (5) but are unavailable in this form for QQ channels [HY25b](https://arxiv.org/abs/2509.07271), [BDK25](https://arxiv.org/abs/2509.13280).

The CQ proof explicitly states that analogous properties for fully quantum channels remain unclear. Entangled quantum inputs introduce a reference system and a nontrivial order between input optimization and the worst-case free-channel optimization in Eq. (3) [HY25b](https://arxiv.org/abs/2509.07271).

## Comment

The state theorem and the CQ-channel theorems do not imply Eq. (4) for genuinely quantum inputs. An adaptive quantum-comb version would be a further problem and is not included in the present statement.

## References

**HY25a** M. Hayashi and H. Yamasaki, “The Generalized Quantum Stein’s Lemma and the Second Law of Quantum Resource Theories,” *Nature Physics* **21**, 1988–1993 (2025). [doi:10.1038/s41567-025-03047-9](https://doi.org/10.1038/s41567-025-03047-9); [arXiv:2408.02722](https://arxiv.org/abs/2408.02722).

**HY25b** M. Hayashi and H. Yamasaki, “Generalized Quantum Stein’s Lemma for Classical-Quantum Dynamical Resources,” arXiv preprint (2025). [arXiv:2509.07271](https://arxiv.org/abs/2509.07271).

**BDK25** B. Bergh, N. Datta, and A. Khaitan, “Generalized Quantum Stein’s Lemma and Reversibility of Quantum Resource Theories for Classical-Quantum Channels,” arXiv preprint (2025). [arXiv:2509.13280](https://arxiv.org/abs/2509.13280).
