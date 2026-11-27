---
id: "01M87VW3VADYY9X987KM4AAFJ0"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T01:42:25.991Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-statistical-inference"]
topicIds: ["quantum-hypothesis-testing"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M22N4PRW93S4YWTEES9RF1MB"]
title: "Exact error exponent for quantum state exclusion"
aliases: ["op-62429171778f2136","op_62429171778f2136","01M87VW3VADYY9X987KM4AAFJ0"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_62429171778f2136.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_62429171778f2136","ulid":"01M87VW3VADYY9X987KM4AAFJ0","aliases":["op_62429171778f2136","01M87VW3VADYY9X987KM4AAFJ0","op-62429171778f2136"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.754Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-statistical-inference"],"topicIds":["quantum-hypothesis-testing"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M22N4PRW93S4YWTEES9RF1MB"]},"title":"Exact error exponent for quantum state exclusion","status":"Unsolved","fields":["Quantum Statistical Inference"],"topics":["Quantum hypothesis testing"],"statement":"Fix $m\\geq 3$ distinct full-rank density matrices $\\rho_1,\\ldots,\\rho_m$ on a space of dimension $d$. A source chooses a label $j$ uniformly and sends $n$ copies of $\\rho_j$. The receiver must name one label to rule out. An error occurs precisely when the receiver rules out the label the source chose.\n\nFor each $n$, the receiver may measure all $n$ copies jointly. Let $M_i$ be the measurement operator for ruling out label $i$. These operators are positive semidefinite and sum to the identity on the $d^n$-dimensional input space. When the source chooses $j$, the probability of error is $\\operatorname{Tr}(M_j\\rho_j^{\\otimes n})$. The minimum average error over all such measurements is $\\varepsilon_n$, as defined in Eq.~\\eqref{eq:d10-02-error}.\n\\begin{equation}\n \\varepsilon_n=\\min_{\\{M_i\\}_{i=1}^{m}}\\frac{1}{m}\\sum_{j=1}^{m}\\operatorname{Tr}(M_j\\rho_j^{\\otimes n}).\n \\label{eq:d10-02-error}\n\\end{equation}\n\nHow fast does this optimal error decay as the number of copies grows? Give and prove an exact formula, in terms of the original density matrices, for the lower asymptotic exclusion exponent $E_{\\mathrm{excl}}$ in Eq.~\\eqref{eq:d10-02-exponent}.\n\\begin{equation}\n E_{\\mathrm{excl}}(\\rho_1,\\ldots,\\rho_m)=\\liminf_{n\\to\\infty}\\frac{-\\ln\\varepsilon_n}{n}.\n \\label{eq:d10-02-exponent}\n\\end{equation}\n\nThe formula may itself involve a minimization or maximization. Once $m$ and $d$ are given, the number and dimensions of its variables must stay fixed as $n$ grows.","source":"Mishra, Nussbaum, and Wilde ask for the general quantum exclusion exponent \\sourcecite{ref:d10-02-mnw24}{MNW24}. Ji et al. restate the question in Sec.~VI.B \\sourcecite{ref:d10-02-jmmw26}{JMMW26}. The statement fixes full-rank inputs and uniform priors.","progress":["For commuting states the exact exponent is the classical multivariate Chernoff divergence. The general quantum lower bound in Mishra et al. includes the largest pairwise quantum Chernoff divergence, since the tester may output only that pair's labels \\sourcecite{ref:d10-02-mnw24}{MNW24}.","Ji et al. bound the upper exponent by a one-copy quantity, the multivariate log-Euclidean Chernoff divergence (Theorem~15). For two states this upper bound can be loose. The exact binary exponent is $-\\ln\\min_{0\\leq s\\leq 1}\\operatorname{Tr}(\\rho_1^s\\rho_2^{1-s})$. The only optimization variable in this asymptotic formula is the scalar $s$ \\sourcecite{ref:d10-02-jmmw26}{JMMW26}."],"references":[{"key":"MNW24","label":"ref:d10-02-mnw24","tex":"H. K. Mishra, M. Nussbaum, and M. M. Wilde, ``On the optimal error exponents for classical and quantum antidistinguishability,'' (2024). \\href{https://arxiv.org/abs/2309.03723}{arXiv:2309.03723}."},{"key":"JMMW26","label":"ref:d10-02-jmmw26","tex":"K. Ji, H. K. Mishra, M. Mosonyi, and M. M. Wilde, ``Barycentric bounds on the error exponents of quantum hypothesis exclusion,'' (2026). \\href{https://arxiv.org/abs/2407.13728v4}{arXiv:2407.13728v4}."}],"comment":"Positive definiteness gives a positive exclusion error at every finite copy count. The related problem of \\href{https://qiqc-op.com/problem/op_a370855db65d4d24/}{Chernoff exponents under restricted tests} concerns binary identification with restrictions on measurements across copies. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Mishra, Nussbaum, and Wilde ask for the general quantum exclusion exponent [MNW24](https://arxiv.org/abs/2309.03723). Ji et al. restate the question in Sec. VI.B [JMMW26](https://arxiv.org/abs/2407.13728v4). The statement fixes full-rank inputs and uniform priors.

## Progress

For commuting states the exact exponent is the classical multivariate Chernoff divergence. The general quantum lower bound in Mishra et al. includes the largest pairwise quantum Chernoff divergence, since the tester may output only that pair’s labels [MNW24](https://arxiv.org/abs/2309.03723).

Ji et al. bound the upper exponent by a one-copy quantity, the multivariate log-Euclidean Chernoff divergence (Theorem 15). For two states this upper bound can be loose. The exact binary exponent is $-\ln\min_{0\leq s\leq 1}\operatorname{Tr}(\rho_1^s\rho_2^{1-s})$. The only optimization variable in this asymptotic formula is the scalar $s$ [JMMW26](https://arxiv.org/abs/2407.13728v4).

## Comment

Positive definiteness gives a positive exclusion error at every finite copy count. The related problem of [Chernoff exponents under restricted tests](https://qiqc-op.com/problem/op_a370855db65d4d24/) concerns binary identification with restrictions on measurements across copies. The catalog and literature were checked through November 26, 2026.

## References

**MNW24** H. K. Mishra, M. Nussbaum, and M. M. Wilde, “On the optimal error exponents for classical and quantum antidistinguishability,” (2024). [arXiv:2309.03723](https://arxiv.org/abs/2309.03723).

**JMMW26** K. Ji, H. K. Mishra, M. Mosonyi, and M. M. Wilde, “Barycentric bounds on the error exponents of quantum hypothesis exclusion,” (2026). [arXiv:2407.13728v4](https://arxiv.org/abs/2407.13728v4).
