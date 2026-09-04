---
id: "01M1Q787QR3RWGKBRKK8CQSZF6"
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
areaIds: ["quantum-information-theory"]
topicIds: ["channel-discrimination","quantum-hypothesis-testing","quantum-networks","superchannels"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Advantage of fully general superchannel-discrimination strategies"
aliases: ["op-02bb8f8228649ac3","op_02bb8f8228649ac3","01M1Q787QR3RWGKBRKK8CQSZF6"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_02bb8f8228649ac3.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_02bb8f8228649ac3","ulid":"01M1Q787QR3RWGKBRKK8CQSZF6","aliases":["op_02bb8f8228649ac3","01M1Q787QR3RWGKBRKK8CQSZF6","op-02bb8f8228649ac3"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-information-theory"],"topicIds":["channel-discrimination","quantum-hypothesis-testing","quantum-networks","superchannels"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Advantage of fully general superchannel-discrimination strategies","status":"Unsolved","fields":["Quantum information theory"],"topics":["Channel discrimination","Quantum hypothesis testing","Quantum networks","Superchannels"],"statement":"Can a fully general adaptive strategy attain a larger Stein exponent than\nevery nested-adaptive strategy for discriminating two quantum superchannels?\nFix finite-dimensional physical realizations\n\\begin{equation}\n  \\Theta_i(\\mathcal N)\n  =\\mathcal D_i\\circ(\\mathcal N\\otimes\\operatorname{id}_{S_i})\n     \\circ\\mathcal E_i,\n  \\qquad i\\in\\{1,2\\}.\n  \\label{eq:p67-superchannel-realizations}\n\\end{equation}\nThe systems $S_i$ in Eq.~\\eqref{eq:p67-superchannel-realizations} are internal\nmemories.  A nested strategy recursively places complete uses of $\\Theta_i$ inside one\nanother.  A fully general strategy may interleave the preprocessing and\npostprocessing components of different uses in any causally valid order,\nprovided each $\\mathcal E_i$ precedes its matched $\\mathcal D_i$ and the\ntester cannot access the internal memory $S_i$.  Define the vanishing-type-I-error Stein\nexponent for a strategy class $\\mathsf S$ by\n\\begin{equation}\n  \\zeta_{\\mathsf S}(\\Theta_1\\|\\Theta_2)\n  :=\\lim_{\\varepsilon\\downarrow0}\\liminf_{n\\to\\infty}\n    -\\frac1n\\log_2\n    \\inf_{\\substack{P\\in\\mathsf S_n:\\alpha_n(P)\\leq\\varepsilon}}\n    \\beta_n(P).\n  \\label{eq:p67-strategy-exponent}\n\\end{equation}\nThe definition in Eq.~\\eqref{eq:p67-strategy-exponent} uses the type-I and\ntype-II errors $\\alpha_n(P)$ and $\\beta_n(P)$ of protocol $P$.\nDoes there exist a pair of realizations for which\n\\begin{equation}\n  \\zeta_{\\mathrm{fg}}(\\Theta_1\\|\\Theta_2)\n  >\\zeta_{\\mathrm{nest}}(\\Theta_1\\|\\Theta_2),\n  \\label{eq:p67-general-advantage}\n\\end{equation}\nwhere $\\mathrm{fg}$ denotes fully general strategies?  If not, prove equality\nin Eq.~\\eqref{eq:p67-general-advantage} with $>$ replaced by $=$ for all\nsuperchannel pairs.","source":"Hirche explicitly identified the achievability and optimality of fully general\nadaptive strategies as the principal unresolved problem in quantum-network\ndiscrimination \\sourcecite{ref:p67-hirche}{Hir23}.","progress":["Fully parallel strategies are exactly characterized by the regularized\n  superchannel relative entropy.  Since they are contained in the fully\n  general class, Hirche's meta-converse yields\n  \\begin{equation}\n    D_{\\rm sc}^{\\infty}(\\Theta_1\\|\\Theta_2)\n    \\leq\\zeta_{\\mathrm{fg}}(\\Theta_1\\|\\Theta_2)\n    \\leq D_{\\rm sc}^{A*}(\\Theta_1\\|\\Theta_2),\n    \\label{eq:p67-general-bounds}\n  \\end{equation}\n  where $D_{\\rm sc}^{A*}$ is a fully amortized superchannel relative entropy\n  that accounts for the exposed preprocessing and postprocessing components\n  \\sourcecite{ref:p67-hirche}{Hir23}.","A braided strategy gives a concrete fully general ordering that need\n  not be nested.  No pair is known for which such an ordering makes the first\n  inequality in Eq.~\\eqref{eq:p67-general-bounds} strict, and no protocol is\n  known to attain $D_{\\rm sc}^{A*}$ in general\n  \\sourcecite{ref:p67-hirche}{Hir23}.","For classical superchannels, the fully amortized relative entropy\n  collapses to the ordinary superchannel relative entropy.  Product strategies\n  are therefore optimal, ruling out Eq.~\\eqref{eq:p67-general-advantage} in\n  the classical special case \\sourcecite{ref:p67-hirche}{Hir23}."],"references":[{"key":"Hir23","label":"ref:p67-hirche","tex":"C. Hirche, ``Quantum Network Discrimination,''\n  \\emph{Quantum} \\textbf{7}, 1064 (2023).\n  \\href{https://doi.org/10.22331/q-2023-07-25-1064}{doi:10.22331/q-2023-07-25-1064};\n  \\href{https://arxiv.org/abs/2103.02404}{arXiv:2103.02404}."}],"comment":"The open alternatives are operationally different: either construct a strict\nadvantage as in Eq.~\\eqref{eq:p67-general-advantage}, prove a protocol that\nattains the upper bound in Eq.~\\eqref{eq:p67-general-bounds}, or sharpen that\nconverse until it meets an achievable nested or parallel rate."}}
---
## Source

Hirche explicitly identified the achievability and optimality of fully general adaptive strategies as the principal unresolved problem in quantum-network discrimination [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

## Progress

Fully parallel strategies are exactly characterized by the regularized superchannel relative entropy. Since they are contained in the fully general class, Hirche’s meta-converse yields

$$
D_{\rm sc}^{\infty}(\Theta_1\|\Theta_2)
 \leq\zeta_{\mathrm{fg}}(\Theta_1\|\Theta_2)
 \leq D_{\rm sc}^{A*}(\Theta_1\|\Theta_2),
 \tag{4}
$$

where $D_{\rm sc}^{A*}$ is a fully amortized superchannel relative entropy that accounts for the exposed preprocessing and postprocessing components [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

A braided strategy gives a concrete fully general ordering that need not be nested. No pair is known for which such an ordering makes the first inequality in Eq. (4) strict, and no protocol is known to attain $D_{\rm sc}^{A*}$ in general [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

For classical superchannels, the fully amortized relative entropy collapses to the ordinary superchannel relative entropy. Product strategies are therefore optimal, ruling out Eq. (3) in the classical special case [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

## Comment

The open alternatives are operationally different: either construct a strict advantage as in Eq. (3), prove a protocol that attains the upper bound in Eq. (4), or sharpen that converse until it meets an achievable nested or parallel rate.

## References

**Hir23** C. Hirche, “Quantum Network Discrimination,” *Quantum* **7**, 1064 (2023). [doi:10.22331/q-2023-07-25-1064](https://doi.org/10.22331/q-2023-07-25-1064); [arXiv:2103.02404](https://arxiv.org/abs/2103.02404).
