---
id: "01M1HME780803VM2A45MA86N41"
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
areaIds: ["quantum-resource-theory"]
topicIds: ["bell-nonlocality"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Quantum violations of bipartite Bell facets"
aliases: ["op-dcea1e5e3032b8c5","op_dcea1e5e3032b8c5","01M1HME780803VM2A45MA86N41","v2-quantum-violations-of-bipartite-bell-facets","open-problem-v2-problem-23"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_dcea1e5e3032b8c5.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_dcea1e5e3032b8c5","ulid":"01M1HME780803VM2A45MA86N41","aliases":["op_dcea1e5e3032b8c5","01M1HME780803VM2A45MA86N41","op-dcea1e5e3032b8c5","v2-quantum-violations-of-bipartite-bell-facets","open-problem-v2-problem-23"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["bell-nonlocality"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Quantum violations of bipartite Bell facets","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Bell nonlocality"],"statement":"Must every nontrivial facet Bell inequality in a finite bipartite scenario\nhave a quantum violation?  Let $\\mathcal L$ be the local polytope, and let\n$\\mathcal Q$ consist of behaviors realizable as\n\\begin{equation}\n  p(a,b\\mid x,y)\n  =\\operatorname{Tr}\\!\\left[\\rho_{AB}\n    \\bigl(M_x^a\\otimes N_y^b\\bigr)\\right],\n  \\label{eq:p23-quantum-behavior}\n\\end{equation}\nwhere $\\rho_{AB}$ is a finite-dimensional state and $\\{M_x^a\\}_a$ and\n$\\{N_y^b\\}_b$ are local POVMs.  Equation~\\eqref{eq:p23-quantum-behavior}\ndefines the quantum set used below.\n\nFor a linear functional $F(p)=\\sum_{a,b,x,y}c_{abxy}p(a,b\\mid x,y)$, suppose\n$F(p)\\leq\\beta_{\\mathrm L}$ supports a facet of $\\mathcal L$ and is not a\npositivity facet within the normalization and no-signalling affine hull.  Is\nit necessarily true that\n\\begin{equation}\n  \\sup_{p\\in\\mathcal Q}F(p)>\\beta_{\\mathrm L}?\n  \\label{eq:p23-facet-violation}\n\\end{equation}\nEquation~\\eqref{eq:p23-facet-violation} asks whether the bipartite local and\nquantum sets can share a nontrivial facet-supporting hyperplane.","source":"Ramanathan explicitly asks whether every nontrivial bipartite facet Bell\ninequality, rather than only every such almost-quantum facet, admits a quantum\nviolation \\sourcecite{ref:p23-almost-quantum}{Ram21}.","progress":["Escolà-Farràs, Calsamiglia, and Winter proved\n  Eq.~\\eqref{eq:p23-facet-violation} for every tight bipartite correlation\n  inequality, including every facet inequality of a two-player XOR game.\n  Their theorem does not cover general Bell behaviors with arbitrary outcome\n  probabilities \\sourcecite{ref:p23-correlation-facets}{ECW20}.","Ramanathan proved that every nontrivial bipartite facet is violated by\n  the almost-quantum set and that the quantum statement holds for the\n  correlation-polytope projection.  Because the almost-quantum set strictly\n  contains the quantum set, this does not establish\n  Eq.~\\eqref{eq:p23-facet-violation} in general\n  \\sourcecite{ref:p23-almost-quantum}{Ram21}."],"references":[{"key":"ECW20","label":"ref:p23-correlation-facets","tex":"L. Escolà-Farràs, J. Calsamiglia, and A. Winter,\n  ``All Tight Correlation Bell Inequalities Have Quantum Violations,''\n  \\emph{Physical Review Research} \\textbf{2}, 012044(R) (2020).\n  \\href{https://doi.org/10.1103/PhysRevResearch.2.012044}{doi:10.1103/PhysRevResearch.2.012044};\n  \\href{https://arxiv.org/abs/1908.06669}{arXiv:1908.06669}."},{"key":"Ram21","label":"ref:p23-almost-quantum","tex":"R. Ramanathan,\n  ``Violation of All Two-Party Facet Bell Inequalities by Almost-Quantum\n  Correlations,'' \\emph{Physical Review Research} \\textbf{3}, 033100 (2021).\n  \\href{https://doi.org/10.1103/PhysRevResearch.3.033100}{doi:10.1103/PhysRevResearch.3.033100};\n  \\href{https://arxiv.org/abs/2004.07673}{arXiv:2004.07673}."}],"comment":"The missing step is to replace the almost-quantum violation by a quantum\nbehavior for every nontrivial bipartite facet.  A solution may instead exhibit\na facet for which\n$\\sup_{p\\in\\mathcal Q}F(p)=\\beta_{\\mathrm L}$, rather than the strict\ninequality in Eq.~\\eqref{eq:p23-facet-violation}."}}
---
## Source

Ramanathan explicitly asks whether every nontrivial bipartite facet Bell inequality, rather than only every such almost-quantum facet, admits a quantum violation [Ram21](https://doi.org/10.1103/PhysRevResearch.3.033100).

## Progress

Escolà-Farràs, Calsamiglia, and Winter proved Eq. (2) for every tight bipartite correlation inequality, including every facet inequality of a two-player XOR game. Their theorem does not cover general Bell behaviors with arbitrary outcome probabilities [ECW20](https://doi.org/10.1103/PhysRevResearch.2.012044).

Ramanathan proved that every nontrivial bipartite facet is violated by the almost-quantum set and that the quantum statement holds for the correlation-polytope projection. Because the almost-quantum set strictly contains the quantum set, this does not establish Eq. (2) in general [Ram21](https://doi.org/10.1103/PhysRevResearch.3.033100).

## Comment

The missing step is to replace the almost-quantum violation by a quantum behavior for every nontrivial bipartite facet. A solution may instead exhibit a facet for which $\sup_{p\in\mathcal Q}F(p)=\beta_{\mathrm L}$, rather than the strict inequality in Eq. (2).

## References

**ECW20** L. Escolà-Farràs, J. Calsamiglia, and A. Winter, “All Tight Correlation Bell Inequalities Have Quantum Violations,” *Physical Review Research* **2**, 012044(R) (2020). [doi:10.1103/PhysRevResearch.2.012044](https://doi.org/10.1103/PhysRevResearch.2.012044); [arXiv:1908.06669](https://arxiv.org/abs/1908.06669).

**Ram21** R. Ramanathan, “Violation of All Two-Party Facet Bell Inequalities by Almost-Quantum Correlations,” *Physical Review Research* **3**, 033100 (2021). [doi:10.1103/PhysRevResearch.3.033100](https://doi.org/10.1103/PhysRevResearch.3.033100); [arXiv:2004.07673](https://arxiv.org/abs/2004.07673).
