---
id: "01M1HME780N8J8JBTFX6CSPACD"
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
areaIds: ["entanglement-theory"]
topicIds: ["quantum-separability","partial-transpose-criterion","convex-geometry","qudit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Absolute separability from spectra"
aliases: ["op-b063bdae4363cda8","op_b063bdae4363cda8","01M1HME780N8J8JBTFX6CSPACD","v2-absolute-separability-from-spectra","open-problem-v2-problem-15"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_b063bdae4363cda8.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b063bdae4363cda8","ulid":"01M1HME780N8J8JBTFX6CSPACD","aliases":["op_b063bdae4363cda8","01M1HME780N8J8JBTFX6CSPACD","op-b063bdae4363cda8","v2-absolute-separability-from-spectra","open-problem-v2-problem-15"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["quantum-separability","partial-transpose-criterion","convex-geometry","qudit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Absolute separability from spectra","status":"Unsolved","fields":["Entanglement theory"],"topics":["Quantum separability","Partial transpose criterion","Convex geometry","Qudit systems"],"statement":"Characterize the spectra of bipartite states that remain separable under every\nglobal unitary, and decide whether absolute separability equals absolute\npositivity under partial transpose in higher local dimensions.  Let\n$2\\le m\\le n$ and let\n$\\lambda=(\\lambda_1,\\ldots,\\lambda_{mn})$ be a decreasing probability vector.\nDefine the absolutely separable spectra by\n\\begin{equation}\n  \\operatorname{ASEP}_{m,n}\n  :=\\left\\{\n    \\lambda:\n    U\\operatorname{diag}(\\lambda)U^\\dagger\n    \\text{ is separable on }\\mathbb{C}^m\\otimes\\mathbb{C}^n\n    \\text{ for every }U\\in\\mathrm{U}(mn)\n  \\right\\}.\n  \\label{eq:p15-asep-spectra}\n\\end{equation}\nThe relaxation by positivity under partial transpose is\n\\begin{equation}\n  \\operatorname{APPT}_{m,n}\n  :=\\left\\{\n    \\lambda:\n    \\left(U\\operatorname{diag}(\\lambda)U^\\dagger\\right)^{T_B}\\succeq0\n    \\text{ for every }U\\in\\mathrm{U}(mn)\n  \\right\\}.\n  \\label{eq:p15-appt-spectra}\n\\end{equation}\nThe task is to characterize the set in Eq.~\\eqref{eq:p15-asep-spectra} and,\nfor $3\\le m\\le n$, decide whether it equals the set in\nEq.~\\eqref{eq:p15-appt-spectra}.","source":"Kr\\\"uger and Werner pose the spectral characterization of absolute\nseparability, and Ahiable, Kothakonda, and Winter explicitly retain the\nhigher-dimensional characterization and ASEP--APPT equality as open\n\\sourcecite{ref:p15-krueger-werner}{KW05},\n\\sourcecite{ref:p15-ahiable-et-al}{AKW26}.","progress":["For two qubits, Verstraete, Audenaert, and De Moor obtained the exact\n  condition\n  \\begin{equation}\n    \\lambda\\in\\operatorname{ASEP}_{2,2}\n    \\quad\\Longleftrightarrow\\quad\n    \\lambda_1-\\lambda_3-2\\sqrt{\\lambda_2\\lambda_4}\\le0.\n    \\label{eq:p15-two-qubit-criterion}\n  \\end{equation}\n  Equation~\\eqref{eq:p15-two-qubit-criterion} settles only the smallest\n  bipartite dimension\n  \\sourcecite{ref:p15-verstraete-et-al}{VAD01}.","Hildebrand gave necessary-and-sufficient linear-matrix-inequality\n  conditions for membership in Eq.~\\eqref{eq:p15-appt-spectra} in arbitrary\n  finite dimensions.  This characterizes the relaxation, not absolute\n  separability\n  \\sourcecite{ref:p15-hildebrand}{Hil07}.","Johnston proved\n  $\\operatorname{ASEP}_{2,n}=\\operatorname{APPT}_{2,n}$ for every $n$, so all\n  cases with a qubit factor are excluded from the remaining problem\n  \\sourcecite{ref:p15-johnston}{Joh13}.","Abellanet-Vidal et al. derived sufficient spectral criteria for\n  absolute separability in arbitrary dimensions by inverting positive maps\n  and taking convex hulls of the resulting regions.  These provide\n  computable inner approximations to\n  $\\operatorname{ASEP}_{m,n}$, but are not necessary conditions\n  \\sourcecite{ref:p15-abellanet-vidal-et-al}{AMR+25}.","Ahiable, Kothakonda, and Winter established new geometric properties\n  of both spectral sets.  In particular, $\\operatorname{APPT}_{m,n}$ is a\n  spectrahedron whose faces are all exposed, whereas\n  $\\operatorname{ASEP}_{m,n}$ is semialgebraic.  They explicitly retain the\n  higher-dimensional characterization and equality as open\n  \\sourcecite{ref:p15-ahiable-et-al}{AKW26}.","Tran subsequently derived an explicit dimension-dependent upper\n  bound on the purity of every absolutely-PPT state.  This is a quantitative\n  outer constraint on $\\operatorname{APPT}_{m,n}$, not a spectral\n  characterization, and hence does not settle its equality with\n  $\\operatorname{ASEP}_{m,n}$\n  \\sourcecite{ref:p15-tran}{Tra26}."],"references":[{"key":"VAD01","label":"ref:p15-verstraete-et-al","tex":"F. Verstraete, K. Audenaert, and B. De Moor,\n  ``Maximally Entangled Mixed States of Two Qubits,''\n  \\emph{Physical Review A} \\textbf{64}, 012316 (2001).\n  \\href{https://doi.org/10.1103/PhysRevA.64.012316}{doi:10.1103/PhysRevA.64.012316};\n  \\href{https://arxiv.org/abs/quant-ph/0011110}{arXiv:quant-ph/0011110}."},{"key":"Hil07","label":"ref:p15-hildebrand","tex":"R. Hildebrand,\n  ``Positive Partial Transpose from Spectra,''\n  \\emph{Physical Review A} \\textbf{76}, 052325 (2007).\n  \\href{https://doi.org/10.1103/PhysRevA.76.052325}{doi:10.1103/PhysRevA.76.052325};\n  \\href{https://arxiv.org/abs/quant-ph/0502170}{arXiv:quant-ph/0502170}."},{"key":"Joh13","label":"ref:p15-johnston","tex":"N. Johnston,\n  ``Separability from Spectrum for Qubit--Qudit States,''\n  \\emph{Physical Review A} \\textbf{88}, 062330 (2013).\\newline\n  \\href{https://doi.org/10.1103/PhysRevA.88.062330}{doi:10.1103/PhysRevA.88.062330};\n  \\href{https://arxiv.org/abs/1309.2006}{arXiv:1309.2006}."},{"key":"AMR+25","label":"ref:p15-abellanet-vidal-et-al","tex":"J. Abellanet-Vidal, G. Müller-Rigat, G. Rajchel-Mieldzioć, and A. Sanpera,\n  ``Sufficient Criteria for Absolute Separability in Arbitrary Dimensions\n  via Linear Map Inverses,''\n  \\emph{Reports on Progress in Physics} \\textbf{88}, 107601 (2025).\n  \\href{https://doi.org/10.1088/1361-6633/ae0cfa}{doi:10.1088/1361-6633/ae0cfa};\n  \\href{https://arxiv.org/abs/2410.22415}{arXiv:2410.22415}."},{"key":"AKW26","label":"ref:p15-ahiable-et-al","tex":"J. Ahiable, N. B. T. Kothakonda, and A. Winter,\n  ``The Geometry of Absolute Separability and Other Convex Matrix Properties\n  from Spectrum,'' arXiv:2608.03390 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2608.03390}{doi:10.48550/arXiv.2608.03390};\n  \\href{https://arxiv.org/abs/2608.03390}{arXiv:2608.03390}."},{"key":"Tra26","label":"ref:p15-tran","tex":"A. T. Tran,\n  ``An Upper Bound for the Purity of Absolutely Positive Partial Transpose\n  States,'' arXiv:2608.09832 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2608.09832}{doi:10.48550/arXiv.2608.09832};\n  \\href{https://arxiv.org/abs/2608.09832}{arXiv:2608.09832}."},{"key":"KW05","label":"ref:p15-krueger-werner","tex":"O. Krüger and R. F. Werner (eds.),\n  ``Some Open Problems in Quantum Information Theory,''\n  arXiv:quant-ph/0504166 (2005).\n  \\href{https://doi.org/10.48550/arXiv.quant-ph/0504166}{doi:10.48550/arXiv.quant-ph/0504166};\n  \\href{https://arxiv.org/abs/quant-ph/0504166}{arXiv:quant-ph/0504166}."}],"comment":"The spectral characterization was posed in the source collection\n\\sourcecite{ref:p15-krueger-werner}{KW05}.  The remaining gap begins when both\nlocal dimensions are at least $3$: the complete boundary of\nEq.~\\eqref{eq:p15-asep-spectra} is unknown, as is its possible equality with\nEq.~\\eqref{eq:p15-appt-spectra}."}}
---
## Source

Krüger and Werner pose the spectral characterization of absolute separability, and Ahiable, Kothakonda, and Winter explicitly retain the higher-dimensional characterization and ASEP–APPT equality as open [KW05](https://doi.org/10.48550/arXiv.quant-ph/0504166), [AKW26](https://doi.org/10.48550/arXiv.2608.03390).

## Progress

For two qubits, Verstraete, Audenaert, and De Moor obtained the exact condition

$$
\lambda\in\operatorname{ASEP}_{2,2}
 \quad\Longleftrightarrow\quad
 \lambda_1-\lambda_3-2\sqrt{\lambda_2\lambda_4}\le0.
 \tag{3}
$$

Equation (3) settles only the smallest bipartite dimension [VAD01](https://doi.org/10.1103/PhysRevA.64.012316).

Hildebrand gave necessary-and-sufficient linear-matrix-inequality conditions for membership in Eq. (2) in arbitrary finite dimensions. This characterizes the relaxation, not absolute separability [Hil07](https://doi.org/10.1103/PhysRevA.76.052325).

Johnston proved $\operatorname{ASEP}_{2,n}=\operatorname{APPT}_{2,n}$ for every $n$, so all cases with a qubit factor are excluded from the remaining problem [Joh13](https://doi.org/10.1103/PhysRevA.88.062330).

Abellanet-Vidal et al. derived sufficient spectral criteria for absolute separability in arbitrary dimensions by inverting positive maps and taking convex hulls of the resulting regions. These provide computable inner approximations to $\operatorname{ASEP}_{m,n}$, but are not necessary conditions [AMR+25](https://doi.org/10.1088/1361-6633/ae0cfa).

Ahiable, Kothakonda, and Winter established new geometric properties of both spectral sets. In particular, $\operatorname{APPT}_{m,n}$ is a spectrahedron whose faces are all exposed, whereas $\operatorname{ASEP}_{m,n}$ is semialgebraic. They explicitly retain the higher-dimensional characterization and equality as open [AKW26](https://doi.org/10.48550/arXiv.2608.03390).

Tran subsequently derived an explicit dimension-dependent upper bound on the purity of every absolutely-PPT state. This is a quantitative outer constraint on $\operatorname{APPT}_{m,n}$, not a spectral characterization, and hence does not settle its equality with $\operatorname{ASEP}_{m,n}$ [Tra26](https://doi.org/10.48550/arXiv.2608.09832).

## Comment

The spectral characterization was posed in the source collection [KW05](https://doi.org/10.48550/arXiv.quant-ph/0504166). The remaining gap begins when both local dimensions are at least $3$: the complete boundary of Eq. (1) is unknown, as is its possible equality with Eq. (2).

## References

**VAD01** F. Verstraete, K. Audenaert, and B. De Moor, “Maximally Entangled Mixed States of Two Qubits,” *Physical Review A* **64**, 012316 (2001). [doi:10.1103/PhysRevA.64.012316](https://doi.org/10.1103/PhysRevA.64.012316); [arXiv:quant-ph/0011110](https://arxiv.org/abs/quant-ph/0011110).

**Hil07** R. Hildebrand, “Positive Partial Transpose from Spectra,” *Physical Review A* **76**, 052325 (2007). [doi:10.1103/PhysRevA.76.052325](https://doi.org/10.1103/PhysRevA.76.052325); [arXiv:quant-ph/0502170](https://arxiv.org/abs/quant-ph/0502170).

**Joh13** N. Johnston, “Separability from Spectrum for Qubit–Qudit States,” *Physical Review A* **88**, 062330 (2013).
 [doi:10.1103/PhysRevA.88.062330](https://doi.org/10.1103/PhysRevA.88.062330); [arXiv:1309.2006](https://arxiv.org/abs/1309.2006).

**AMR+25** J. Abellanet-Vidal, G. Müller-Rigat, G. Rajchel-Mieldzioć, and A. Sanpera, “Sufficient Criteria for Absolute Separability in Arbitrary Dimensions via Linear Map Inverses,” *Reports on Progress in Physics* **88**, 107601 (2025). [doi:10.1088/1361-6633/ae0cfa](https://doi.org/10.1088/1361-6633/ae0cfa); [arXiv:2410.22415](https://arxiv.org/abs/2410.22415).

**AKW26** J. Ahiable, N. B. T. Kothakonda, and A. Winter, “The Geometry of Absolute Separability and Other Convex Matrix Properties from Spectrum,” arXiv:2608.03390 (2026). [doi:10.48550/arXiv.2608.03390](https://doi.org/10.48550/arXiv.2608.03390); [arXiv:2608.03390](https://arxiv.org/abs/2608.03390).

**Tra26** A. T. Tran, “An Upper Bound for the Purity of Absolutely Positive Partial Transpose States,” arXiv:2608.09832 (2026). [doi:10.48550/arXiv.2608.09832](https://doi.org/10.48550/arXiv.2608.09832); [arXiv:2608.09832](https://arxiv.org/abs/2608.09832).

**KW05** O. Krüger and R. F. Werner (eds.), “Some Open Problems in Quantum Information Theory,” arXiv:quant-ph/0504166 (2005). [doi:10.48550/arXiv.quant-ph/0504166](https://doi.org/10.48550/arXiv.quant-ph/0504166); [arXiv:quant-ph/0504166](https://arxiv.org/abs/quant-ph/0504166).
