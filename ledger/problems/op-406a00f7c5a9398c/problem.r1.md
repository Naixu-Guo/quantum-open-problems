---
id: "01M20BHBBG223ZDPK3F526EHFH"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-08T12:10:50.365Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity","quantum-supremacy","iqp-sampling"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Average-case approximation hardness of squared normalized gaps of random cubic polynomials"
aliases: ["op-406a00f7c5a9398c","op_406a00f7c5a9398c","01M20BHBBG223ZDPK3F526EHFH"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_406a00f7c5a9398c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_406a00f7c5a9398c","ulid":"01M20BHBBG223ZDPK3F526EHFH","aliases":["op_406a00f7c5a9398c","01M20BHBBG223ZDPK3F526EHFH","op-406a00f7c5a9398c"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-08T11:13:01.808Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity","quantum-supremacy","iqp-sampling"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Average-case approximation hardness of squared normalized gaps of random cubic polynomials","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity","Quantum supremacy","IQP sampling"],"statement":"Is it $\\#\\mathrm{P}$-hard to approximate $\\operatorname{ngap}(f)^2$ to\nrelative multiplicative error $a+o(1)$ on a $b$ fraction of uniformly random\ndegree-3 polynomials over $\\mathbb{F}_2$?\nHere $a>0$ and $0<b\\leq1$ are constant parameters independent of the number\nof variables $n$, specifying the relative error and polynomial fraction.\n\nWrite the random polynomial in multilinear form as\n\\begin{equation}\n  f(x)=\\sum_{i<j<k}\\alpha_{ijk}x_i x_j x_k\n       +\\sum_{i<j}\\beta_{ij}x_i x_j\n       +\\sum_i\\gamma_i x_i \\pmod{2},\n  \\qquad x\\in\\{0,1\\}^n.\n  \\label{eq:bms-poly-ensemble}\n\\end{equation}\nIn Eq.~\\eqref{eq:bms-poly-ensemble}, all coefficients are independent uniform\nbits. The degree-3 ensemble allows terms of degrees one through three,\nwithout conditioning on a nonzero cubic term. A constant term is omitted\nbecause it changes only the sign of the gap. Define\n\\begin{equation}\n  \\operatorname{gap}(f)\n    =|\\{x\\in\\{0,1\\}^n:f(x)=0\\}|-|\\{x\\in\\{0,1\\}^n:f(x)=1\\}|,\n  \\qquad\n  \\operatorname{ngap}(f)=2^{-n}\\operatorname{gap}(f).\n  \\label{eq:bms-poly-gap}\n\\end{equation}\nThe target is the square of the normalized gap in Eq.~\\eqref{eq:bms-poly-gap}.\nAn estimate $\\widetilde Q_f$ is required to satisfy\n\\begin{equation}\n  \\bigl|\\widetilde Q_f-\\operatorname{ngap}(f)^2\\bigr|\n    \\leq(a+o(1))\\operatorname{ngap}(f)^2.\n  \\label{eq:bms-poly-approximation}\n\\end{equation}\nThe $b$ fraction in the question is measured over the coefficient choices\nfor which Eq.~\\eqref{eq:bms-poly-approximation} holds; $o(1)$ tends to zero\nas $n\\to\\infty$.","source":"Conjecture 3 of Bremner, Montanaro, and Shepherd, on page 2 of arXiv v2,\nstates this average-case hardness conjecture with $a=1/4$ and $b=1/24$\n\\sourcecite{ref:bms-poly-source}{BMS16}.\nThe present formulation replaces those two numerical constants by the\nparameters $a$ and $b$, as requested by the contributor, and retains the\noriginal $o(1)$ term and squared normalized-gap target.\nThe parameterized formulation is not a verbatim claim of the paper.","progress":["Appendix D proves worst-case $\\#\\mathrm{P}$-hardness of approximating\n$\\operatorname{ngap}(f)^2$ with relative multiplicative error less than $1/2$\n\\sourcecite{ref:bms-poly-source}{BMS16}.\nThis worst-case result does not establish hardness on a constant fraction\nof uniformly random polynomials."],"references":[{"key":"BMS16","label":"ref:bms-poly-source","tex":"M. J. Bremner, A. Montanaro, and D. J. Shepherd,\n\"Average-case complexity versus approximate simulation of commuting quantum computations,\"\n\\emph{Physical Review Letters} \\textbf{117}, 080501 (2016).\n\\href{https://doi.org/10.1103/PhysRevLett.117.080501}{doi:10.1103/PhysRevLett.117.080501};\n\\href{https://arxiv.org/abs/1504.07999v2}{arXiv:1504.07999v2}."}],"comment":"The remaining task is to establish average-case approximation hardness\nfor the uniform polynomial ensemble. The pair $(a,b)$ indexes a family of\nquestions; hardness for every pair is not asserted. The source's original\nparameter choice is $(a,b)=(1/4,1/24)$.\nThe instance fraction $b$ concerns polynomials, not an algorithm's internal\nsuccess probability. The target remains the square of the normalized gap."}}
---
## Source

Conjecture 3 of Bremner, Montanaro, and Shepherd, on page 2 of arXiv v2, states this average-case hardness conjecture with $a=1/4$ and $b=1/24$ [BMS16](https://doi.org/10.1103/PhysRevLett.117.080501). The present formulation replaces those two numerical constants by the parameters $a$ and $b$, as requested by the contributor, and retains the original $o(1)$ term and squared normalized-gap target. The parameterized formulation is not a verbatim claim of the paper.

## Progress

Appendix D proves worst-case $\#\mathrm{P}$-hardness of approximating $\operatorname{ngap}(f)^2$ with relative multiplicative error less than $1/2$ [BMS16](https://doi.org/10.1103/PhysRevLett.117.080501). This worst-case result does not establish hardness on a constant fraction of uniformly random polynomials.

## Comment

The remaining task is to establish average-case approximation hardness for the uniform polynomial ensemble. The pair $(a,b)$ indexes a family of questions; hardness for every pair is not asserted. The source’s original parameter choice is $(a,b)=(1/4,1/24)$. The instance fraction $b$ concerns polynomials, not an algorithm’s internal success probability. The target remains the square of the normalized gap.

## References

**BMS16** M. J. Bremner, A. Montanaro, and D. J. Shepherd, "Average-case complexity versus approximate simulation of commuting quantum computations," *Physical Review Letters* **117**, 080501 (2016). [doi:10.1103/PhysRevLett.117.080501](https://doi.org/10.1103/PhysRevLett.117.080501); [arXiv:1504.07999v2](https://arxiv.org/abs/1504.07999v2).
