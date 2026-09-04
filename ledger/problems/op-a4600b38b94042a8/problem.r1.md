---
id: "01M1Q787QRN9XH5T5717HHCXHG"
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
areaIds: ["quantum-metrology"]
topicIds: ["channel-discrimination","quantum-hypothesis-testing","superchannels-and-quantum-combs"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Parallel versus nested-adaptive superchannel discrimination"
aliases: ["op-a4600b38b94042a8","op_a4600b38b94042a8","01M1Q787QRN9XH5T5717HHCXHG"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_a4600b38b94042a8.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_a4600b38b94042a8","ulid":"01M1Q787QRN9XH5T5717HHCXHG","aliases":["op_a4600b38b94042a8","01M1Q787QRN9XH5T5717HHCXHG","op-a4600b38b94042a8"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["channel-discrimination","quantum-hypothesis-testing","superchannels-and-quantum-combs"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Parallel versus nested-adaptive superchannel discrimination","status":"Unsolved","fields":["Quantum metrology"],"topics":["Channel discrimination","Quantum hypothesis testing","Superchannels and quantum combs"],"statement":"Can nested-adaptive strategies improve the Stein exponent for discriminating\ntwo finite-dimensional quantum superchannels?  A superchannel maps channels\n$\\mathcal N:A\\to B$ to channels $C\\to D$ and admits a realization\n\\begin{equation}\n  \\Theta(\\mathcal N)\n  =\\mathcal D\\circ(\\mathcal N\\otimes\\operatorname{id}_S)\\circ\\mathcal E,\n  \\qquad\n  \\mathcal E:C\\to A S,\n  \\quad \\mathcal D:B S\\to D.\n  \\label{eq:p66-superchannel-realization}\n\\end{equation}\nThe memory system $S$ in Eq.~\\eqref{eq:p66-superchannel-realization} is\ninternal to the superchannel.  In a fully parallel $n$-use strategy, one applies\n$\\Theta_i^{\\otimes n}$ to a joint $n$-partite inserted channel and then tests\nthe resulting output on a joint input state.  A nested-adaptive strategy may\ninstead recursively insert the channel produced by one tested use into the\nchannel slot of another, with arbitrary compatible CPTP maps between uses and\na final binary measurement.  For\n$\\mathsf S\\in\\{\\mathrm{par},\\mathrm{nest}\\}$, let\n\\begin{equation}\n  \\begin{aligned}\n  \\beta_{\\varepsilon,n}^{\\mathsf S}(\\Theta_1\\|\\Theta_2)\n    &:=\\inf\\{\\beta_n(P):P\\in\\mathsf S_n,\\ \\alpha_n(P)\\leq\\varepsilon\\},\\\\\n  \\zeta_{\\mathsf S}(\\Theta_1\\|\\Theta_2)\n    &:=\\lim_{\\varepsilon\\downarrow0}\\liminf_{n\\to\\infty}\n      -\\frac1n\\log_2\n      \\beta_{\\varepsilon,n}^{\\mathsf S}(\\Theta_1\\|\\Theta_2),\n  \\end{aligned}\n  \\label{eq:p66-stein-exponents}\n\\end{equation}\nwhere $\\alpha_n$ and $\\beta_n$ are the type-I and type-II errors.  Is\n\\begin{equation}\n  \\zeta_{\\mathrm{nest}}(\\Theta_1\\|\\Theta_2)\n  =\\zeta_{\\mathrm{par}}(\\Theta_1\\|\\Theta_2)\n  \\label{eq:p66-nested-parallel-equality}\n\\end{equation}\nfor every pair $\\Theta_1,\\Theta_2$?","source":"Hirche explicitly conjectured the equality in\nEq.~\\eqref{eq:p66-nested-parallel-equality} while developing the first\nasymptotic discrimination framework for quantum superchannels\n\\sourcecite{ref:p66-hirche}{Hir23}.","progress":["The fully parallel Stein exponent in\n  Eq.~\\eqref{eq:p66-stein-exponents} is known exactly:\n  \\begin{equation}\n    \\zeta_{\\mathrm{par}}(\\Theta_1\\|\\Theta_2)\n    =D_{\\rm sc}^{\\infty}(\\Theta_1\\|\\Theta_2),\n    \\label{eq:p66-parallel-exponent}\n  \\end{equation}\n  In Eq.~\\eqref{eq:p66-parallel-exponent}, $D_{\\rm sc}^{\\infty}$ is the\n  regularized superchannel relative\n  entropy optimized over joint inserted channels and input states\n  \\sourcecite{ref:p66-hirche}{Hir23}.","Every parallel strategy can be embedded into a nested one.  Hirche's\n  amortized-superchannel meta-converse therefore gives\n  \\begin{equation}\n    D_{\\rm sc}^{\\infty}(\\Theta_1\\|\\Theta_2)\n    \\leq\\zeta_{\\mathrm{nest}}(\\Theta_1\\|\\Theta_2)\n    \\leq D_{\\rm sc}^{A}(\\Theta_1\\|\\Theta_2),\n    \\label{eq:p66-known-hierarchy}\n  \\end{equation}\n  with $D_{\\rm sc}^{A}$ the amortized superchannel relative entropy\n  \\sourcecite{ref:p66-hirche}{Hir23}.","The channel chain rule underlying\n  Eq.~\\eqref{eq:p66-known-hierarchy} implies\n  $D_{\\rm sc}^{A}=D_{\\rm sc}^{\\infty}$, and hence\n  Eq.~\\eqref{eq:p66-nested-parallel-equality}, conditional on the\n  diamond-smoothed channel AEP in Problem~\\ref{sec:problem-65}.  No\n  unconditional proof or counterexample is known\n  \\sourcecite{ref:p66-hirche}{Hir23}.","For classical superchannels, all relevant relative-entropy\n  amortizations collapse and product strategies already achieve the optimum;\n  thus Eq.~\\eqref{eq:p66-nested-parallel-equality} holds in that special case\n  \\sourcecite{ref:p66-hirche}{Hir23}."],"references":[{"key":"Hir23","label":"ref:p66-hirche","tex":"C. Hirche, ``Quantum Network Discrimination,''\n  \\emph{Quantum} \\textbf{7}, 1064 (2023).\n  \\href{https://doi.org/10.22331/q-2023-07-25-1064}{doi:10.22331/q-2023-07-25-1064};\n  \\href{https://arxiv.org/abs/2103.02404}{arXiv:2103.02404}."}],"comment":"This problem compares two causal strategy classes.  It is distinct from\nProblem~\\ref{sec:problem-67}, which allows arbitrary interleavings of the\nphysical components of different superchannel uses."}}
---
## Source

Hirche explicitly conjectured the equality in Eq. (3) while developing the first asymptotic discrimination framework for quantum superchannels [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

## Progress

The fully parallel Stein exponent in Eq. (2) is known exactly:

$$
\zeta_{\mathrm{par}}(\Theta_1\|\Theta_2)
 =D_{\rm sc}^{\infty}(\Theta_1\|\Theta_2),
 \tag{4}
$$

In Eq. (4), $D_{\rm sc}^{\infty}$ is the regularized superchannel relative entropy optimized over joint inserted channels and input states [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

Every parallel strategy can be embedded into a nested one. Hirche’s amortized-superchannel meta-converse therefore gives

$$
D_{\rm sc}^{\infty}(\Theta_1\|\Theta_2)
 \leq\zeta_{\mathrm{nest}}(\Theta_1\|\Theta_2)
 \leq D_{\rm sc}^{A}(\Theta_1\|\Theta_2),
 \tag{5}
$$

with $D_{\rm sc}^{A}$ the amortized superchannel relative entropy [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

The channel chain rule underlying Eq. (5) implies $D_{\rm sc}^{A}=D_{\rm sc}^{\infty}$, and hence Eq. (3), conditional on the diamond-smoothed channel AEP in Problem . No unconditional proof or counterexample is known [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

For classical superchannels, all relevant relative-entropy amortizations collapse and product strategies already achieve the optimum; thus Eq. (3) holds in that special case [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

## Comment

This problem compares two causal strategy classes. It is distinct from Problem , which allows arbitrary interleavings of the physical components of different superchannel uses.

## References

**Hir23** C. Hirche, “Quantum Network Discrimination,” *Quantum* **7**, 1064 (2023). [doi:10.22331/q-2023-07-25-1064](https://doi.org/10.22331/q-2023-07-25-1064); [arXiv:2103.02404](https://arxiv.org/abs/2103.02404).
