---
id: "01M1HME7803QE7KXJDNM1ACKBP"
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
topicIds: ["transpose-degradable-channels","degradable-channels","partial-transpose-criterion","choi-states","quantum-channels"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Minimal dimensions for strict transpose degradability"
aliases: ["op-b315f0d0b6ddbdee","op_b315f0d0b6ddbdee","01M1HME7803QE7KXJDNM1ACKBP","v2-minimal-dimensions-for-strict-transpose-degradability","open-problem-v2-problem-54"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_b315f0d0b6ddbdee.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b315f0d0b6ddbdee","ulid":"01M1HME7803QE7KXJDNM1ACKBP","aliases":["op_b315f0d0b6ddbdee","01M1HME7803QE7KXJDNM1ACKBP","op-b315f0d0b6ddbdee","v2-minimal-dimensions-for-strict-transpose-degradability","open-problem-v2-problem-54"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["transpose-degradable-channels","degradable-channels","partial-transpose-criterion","choi-states","quantum-channels"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Minimal dimensions for strict transpose degradability","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Transpose-degradable channels","Degradable channels","Partial transpose criterion","Choi states","Quantum channels"],"statement":"What are the componentwise-minimal dimension triples\n$(d_A,d_B,d_E)$ that admit a transpose-degradable but nondegradable channel?\nLet $d_X:=\\dim X$ and let $V:A\\to B\\otimes E$ be a support-minimal isometry,\nmeaning that the channels\n\\begin{equation}\n  \\Phi_V(X):=\\operatorname{Tr}_E(VXV^\\dagger),\n  \\qquad\n  \\Phi_V^c(X):=\\operatorname{Tr}_B(VXV^\\dagger)\n  \\label{eq:p54-complementary-pair}\n\\end{equation}\nsatisfy\n$\\operatorname{supp}(\\Phi_V(I_A))=B$ and\n$\\operatorname{supp}(\\Phi_V^c(I_A))=E$.\nEquation~\\eqref{eq:p54-complementary-pair} is strictly transpose degradable\nwhen, for a fixed-basis transpose $\\mathsf T_E$, its factorization properties\nare\n\\begin{equation}\n  \\begin{aligned}\n    &\\exists\\ \\mathcal D:\\mathcal L(B)\\to\\mathcal L(E)\\ \\text{CPTP},\n    &&\\mathsf T_E\\circ\\Phi_V^c=\\mathcal D\\circ\\Phi_V,\\\\\n    &\\nexists\\ \\widetilde{\\mathcal D}:\\mathcal L(B)\\to\\mathcal L(E)\\\n      \\text{CPTP},\n    &&\\Phi_V^c=\\widetilde{\\mathcal D}\\circ\\Phi_V.\n  \\end{aligned}\n  \\label{eq:p54-strict-factorizations}\n\\end{equation}\nA feasible triple is componentwise minimal if no distinct feasible\n$(d'_A,d'_B,d'_E)$ satisfies $d'_X\\leq d_X$ for every $X\\in\\{A,B,E\\}$.\nDetermine all minimal triples satisfying\nEq.~\\eqref{eq:p54-strict-factorizations}.","source":"This dimension-refined problem is implicit in Singh and Datta's explicit\nquestion about whether transpose degradability differs from degradability and\nin their support-minimal dimension formalism\n\\sourcecite{ref:p54-singh-datta}{SD22}.","progress":["Support minimality in Eq.~\\eqref{eq:p54-complementary-pair} gives the\n  Choi-rank identities\n  \\begin{equation}\n    d_E=\\operatorname{rank}J(\\Phi_V),\n    \\qquad\n    d_B=\\operatorname{rank}J(\\Phi_V^c).\n    \\label{eq:p54-choi-ranks}\n  \\end{equation}\n  Equation~\\eqref{eq:p54-choi-ranks} removes artificial output or environment\n  dimensions introduced by nonminimal dilations\n  \\sourcecite{ref:p54-singh-datta}{SD22}.","The first line of Eq.~\\eqref{eq:p54-strict-factorizations} makes\n  $J(\\Phi_V^c)$ PPT, whereas separability of this Choi operator would make\n  $\\Phi_V$ degradable.  The low-rank PPT separability theorem therefore gives\n  the necessary inequality\n  \\begin{equation}\n    d_B=\\operatorname{rank}J(\\Phi_V^c)\n      >\\max\\{d_A,d_E\\}.\n    \\label{eq:p54-rank-obstruction}\n  \\end{equation}\n  Equation~\\eqref{eq:p54-rank-obstruction} is only an obstruction: a\n  PPT-entangled Choi operator need not satisfy the channel factorization in\n  Eq.~\\eqref{eq:p54-strict-factorizations}\n  \\sourcecite{ref:p54-bradler}{Bra15},\n  \\sourcecite{ref:p54-horodecki-low-rank}{HLVC00}.","PPT is equivalent to separability on $2\\otimes2$ and $2\\otimes3$.\n  Combining this fact with Eq.~\\eqref{eq:p54-rank-obstruction}, the\n  componentwise-minimal triples not excluded by the known tests are\n  \\begin{equation}\n    (d_A,d_B,d_E)\\in\n      \\{(2,5,4),\\ (3,4,3),\\ (4,5,2)\\}.\n    \\label{eq:p54-candidate-triples}\n  \\end{equation}\n  No triple in Eq.~\\eqref{eq:p54-candidate-triples} is known to be realizable\n  \\sourcecite{ref:p54-horodecki-ppt}{HHH96},\n  \\sourcecite{ref:p54-horodecki-low-rank}{HLVC00}."],"references":[{"key":"SD22","label":"ref:p54-singh-datta","tex":"S. Singh and N. Datta,\n  \\lq\\lq Detecting Positive Quantum Capacities of Quantum Channels,\\rq\\rq{}\n  \\emph{npj Quantum Information} \\textbf{8}, 50 (2022).\n  \\href{https://doi.org/10.1038/s41534-022-00550-2}{doi:10.1038/s41534-022-00550-2};\n  \\href{https://arxiv.org/abs/2105.06327}{arXiv:2105.06327}."},{"key":"Bra15","label":"ref:p54-bradler","tex":"K. Br{\\'a}dler,\n  \\lq\\lq The Pitfalls of Deciding Whether a Quantum Channel Is (Conjugate)\n  Degradable and How to Avoid Them,\\rq\\rq{}\n  \\emph{Open Systems \\& Information Dynamics} \\textbf{22}, 1550026 (2015).\n  \\href{https://doi.org/10.1142/S1230161215500262}{doi:10.1142/S1230161215500262};\n  \\href{https://arxiv.org/abs/1507.06159}{arXiv:1507.06159}."},{"key":"HLVC00","label":"ref:p54-horodecki-low-rank","tex":"P. Horodecki, M. Lewenstein, G. Vidal, and I. Cirac,\n  \\lq\\lq Operational Criterion and Constructive Checks for the Separability of\n  Low-Rank Density Matrices,\\rq\\rq{} \\emph{Physical Review A} \\textbf{62},\n  032310 (2000).\n  \\href{https://doi.org/10.1103/PhysRevA.62.032310}{doi:10.1103/PhysRevA.62.032310};\n  \\href{https://arxiv.org/abs/quant-ph/0002089}{arXiv:quant-ph/0002089}."},{"key":"HHH96","label":"ref:p54-horodecki-ppt","tex":"M. Horodecki, P. Horodecki, and R. Horodecki,\n  \\lq\\lq Separability of Mixed States: Necessary and Sufficient\n  Conditions,\\rq\\rq{} \\emph{Physics Letters A} \\textbf{223}, 1--8 (1996).\n  \\href{https://doi.org/10.1016/S0375-9601(96)00706-2}{doi:10.1016/S0375-9601(96)00706-2};\n  \\href{https://arxiv.org/abs/quant-ph/9605038}{arXiv:quant-ph/9605038}."}],"comment":"The feasible set may be empty because existence of any strict\ntranspose-degradable channel is unresolved in Problem~53.  Under channel\ncomplementation, the triples for the equivalent strict\ntranspose-antidegradable formulation are obtained by interchanging $d_B$ and\n$d_E$."}}
---
## Source

This dimension-refined problem is implicit in Singh and Datta’s explicit question about whether transpose degradability differs from degradability and in their support-minimal dimension formalism [SD22](https://doi.org/10.1038/s41534-022-00550-2).

## Progress

Support minimality in Eq. (1) gives the Choi-rank identities

$$
d_E=\operatorname{rank}J(\Phi_V),
 \qquad
 d_B=\operatorname{rank}J(\Phi_V^c).
 \tag{3}
$$

Equation (3) removes artificial output or environment dimensions introduced by nonminimal dilations [SD22](https://doi.org/10.1038/s41534-022-00550-2).

The first line of Eq. (2) makes $J(\Phi_V^c)$ PPT, whereas separability of this Choi operator would make $\Phi_V$ degradable. The low-rank PPT separability theorem therefore gives the necessary inequality

$$
d_B=\operatorname{rank}J(\Phi_V^c)
 >\max\{d_A,d_E\}.
 \tag{4}
$$

Equation (4) is only an obstruction: a PPT-entangled Choi operator need not satisfy the channel factorization in Eq. (2) [Bra15](https://doi.org/10.1142/S1230161215500262), [HLVC00](https://doi.org/10.1103/PhysRevA.62.032310).

PPT is equivalent to separability on $2\otimes2$ and $2\otimes3$. Combining this fact with Eq. (4), the componentwise-minimal triples not excluded by the known tests are

$$
(d_A,d_B,d_E)\in
 \{(2,5,4),\ (3,4,3),\ (4,5,2)\}.
 \tag{5}
$$

No triple in Eq. (5) is known to be realizable [HHH96](https://doi.org/10.1016/S0375-9601\(96\)00706-2), [HLVC00](https://doi.org/10.1103/PhysRevA.62.032310).

## Comment

The feasible set may be empty because existence of any strict transpose-degradable channel is unresolved in Problem 53. Under channel complementation, the triples for the equivalent strict transpose-antidegradable formulation are obtained by interchanging $d_B$ and $d_E$.

## References

**SD22** S. Singh and N. Datta, “ Detecting Positive Quantum Capacities of Quantum Channels,” *npj Quantum Information* **8**, 50 (2022). [doi:10.1038/s41534-022-00550-2](https://doi.org/10.1038/s41534-022-00550-2); [arXiv:2105.06327](https://arxiv.org/abs/2105.06327).

**Bra15** K. Brádler, “ The Pitfalls of Deciding Whether a Quantum Channel Is (Conjugate) Degradable and How to Avoid Them,” *Open Systems & Information Dynamics* **22**, 1550026 (2015). [doi:10.1142/S1230161215500262](https://doi.org/10.1142/S1230161215500262); [arXiv:1507.06159](https://arxiv.org/abs/1507.06159).

**HLVC00** P. Horodecki, M. Lewenstein, G. Vidal, and I. Cirac, “ Operational Criterion and Constructive Checks for the Separability of Low-Rank Density Matrices,” *Physical Review A* **62**, 032310 (2000). [doi:10.1103/PhysRevA.62.032310](https://doi.org/10.1103/PhysRevA.62.032310); [arXiv:quant-ph/0002089](https://arxiv.org/abs/quant-ph/0002089).

**HHH96** M. Horodecki, P. Horodecki, and R. Horodecki, “ Separability of Mixed States: Necessary and Sufficient Conditions,” *Physics Letters A* **223**, 1–8 (1996). [doi:10.1016/S0375-9601(96)00706-2](https://doi.org/10.1016/S0375-9601\(96\)00706-2); [arXiv:quant-ph/9605038](https://arxiv.org/abs/quant-ph/9605038).
