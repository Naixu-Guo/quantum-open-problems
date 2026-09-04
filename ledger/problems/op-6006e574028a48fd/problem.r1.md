---
id: "01M1Q787QR7SBS31M6PYNF20RT"
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
topicIds: ["channel-simulation","network-quantum-information-theory","one-shot-quantum-information","semidefinite-programming"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Bidirectional classical-communication cost of bipartite channel simulation"
aliases: ["op-6006e574028a48fd","op_6006e574028a48fd","01M1Q787QR7SBS31M6PYNF20RT"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_6006e574028a48fd.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_6006e574028a48fd","ulid":"01M1Q787QR7SBS31M6PYNF20RT","aliases":["op_6006e574028a48fd","01M1Q787QR7SBS31M6PYNF20RT","op-6006e574028a48fd"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["channel-simulation","network-quantum-information-theory","one-shot-quantum-information","semidefinite-programming"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Bidirectional classical-communication cost of bipartite channel simulation","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Channel simulation","Network quantum information theory","One-shot quantum information","Semidefinite programming"],"statement":"What is the asymptotic classical-communication cost of simulating a\nbipartite quantum channel with bidirectional classical communication and\nnon-signalling assistance?  Let\n$\\mathcal N:\\mathcal L(A_0\\otimes B_0)\\to\\mathcal L(A_1\\otimes B_1)$ be a\nquantum channel on finite-dimensional systems, with Alice holding $A_0,A_1$\nand Bob holding $B_0,B_1$.  A bidirectional simulation protocol consists of\na bipartite channel shared in advance that can signal in neither direction\n(a non-signalling correlation, which includes every shared entangled\nstate), one classical message with $m_\\to$ values from Alice to Bob, one\nclassical message with $m_\\leftarrow$ values from Bob to Alice, and local\noperations; it uses $m:=m_\\to m_\\leftarrow$ classical values in total.  For\n$\\varepsilon\\in[0,1)$ define the one-shot cost\n\\begin{equation}\n  S^{(1)}_{\\leftrightarrow,\\varepsilon}(\\mathcal N)\n  :=\\log_2\\min\\Bigl\\{m\\in\\mathbb N:\n    \\tfrac12\\|\\Upsilon-\\mathcal N\\|_\\diamond\\leq\\varepsilon\n    \\text{ for some protocol }\\Upsilon\\text{ using }m\\text{ values}\\Bigr\\},\n  \\label{eq:6006-one-shot-cost}\n\\end{equation}\nwhere $\\|\\cdot\\|_\\diamond$ is the diamond norm.  The asymptotic exact and\nvanishing-error costs are\n\\begin{equation}\n  S_{\\leftrightarrow,0}(\\mathcal N)\n  :=\\lim_{n\\to\\infty}\\frac1n\n    S^{(1)}_{\\leftrightarrow,0}(\\mathcal N^{\\otimes n}),\n  \\qquad\n  S_{\\leftrightarrow}(\\mathcal N)\n  :=\\lim_{\\varepsilon\\downarrow0}\\limsup_{n\\to\\infty}\n    \\frac1n S^{(1)}_{\\leftrightarrow,\\varepsilon}(\\mathcal N^{\\otimes n}).\n  \\label{eq:6006-asymptotic-cost}\n\\end{equation}\nLet $\\mathrm{NS}$ denote the set of bipartite channels from $A_0B_0$ to\n$A_1B_1$ that are non-signalling in both directions, and define the\nmax-relative entropy of bidirectional communication\n\\begin{equation}\n  \\mathfrak D^{\\leftrightarrow}_{\\max}(\\mathcal N)\n  :=\\min_{\\mathcal E\\in\\mathrm{NS}}D_{\\max}(\\mathcal N\\|\\mathcal E),\n  \\qquad\n  D_{\\max}(\\mathcal N\\|\\mathcal E)\n  :=\\log_2\\min\\{\\lambda\\geq0:J_{\\mathcal N}\\leq\\lambda J_{\\mathcal E}\\},\n  \\label{eq:6006-max-relative-entropy}\n\\end{equation}\nwhere $J$ denotes the Choi operator.  Determine\n$S_{\\leftrightarrow,0}(\\mathcal N)$ and $S_{\\leftrightarrow}(\\mathcal N)$\nin Eq.~\\eqref{eq:6006-asymptotic-cost} for a general bipartite channel.\nIn particular, is either cost equal to the regularization\n$\\lim_{n\\to\\infty}\\frac1n\n\\mathfrak D^{\\leftrightarrow}_{\\max}(\\mathcal N^{\\otimes n})$ of\nEq.~\\eqref{eq:6006-max-relative-entropy}, and does a single-letter formula\nexist?","source":"The question is implicit in Zhu, Zhao, and Wang, who determine the\nasymptotic exact one-way cost of a bipartite channel but obtain only\none-shot semidefinite programs and converse bounds for the bidirectional\ncost \\sourcecite{ref:6006-zhu-zhao-wang}{ZZW25}.","progress":["For a point-to-point channel $\\mathcal M:\\mathcal L(A)\\to\\mathcal L(B)$\n  and tensor-power input sources, the entanglement-assisted quantum reverse\n  Shannon theorem makes simulation and coding reversible: the asymptotic\n  classical-communication cost of simulating $\\mathcal M^{\\otimes n}$ with\n  free entanglement equals the entanglement-assisted classical capacity\n  \\begin{equation}\n    C_E(\\mathcal M)\n    =\\max_{\\phi_{RA}}I(R;B)_{(\\operatorname{id}_R\\otimes\\mathcal M)(\\phi)}.\n    \\label{eq:6006-reverse-shannon}\n  \\end{equation}\n  Equation~\\eqref{eq:6006-reverse-shannon} concerns a single sender and\n  receiver and does not address interactive bipartite processes\n  \\sourcecite{ref:6006-bdhsw}{BDHSW14}.","For one-way simulation of a bipartite channel, Zhu, Zhao, and Wang\n  bound the one-shot $\\varepsilon$-error cost above and below by a smooth\n  max-relative entropy of one-way classical communication and prove that\n  the asymptotic exact one-way cost equals the additive quantity\n  \\begin{equation}\n    \\mathfrak D^{\\to}_{\\max}(\\mathcal N)\n    :=\\min_{\\mathcal E\\in\\mathrm{NS}_\\to}D_{\\max}(\\mathcal N\\|\\mathcal E),\n    \\label{eq:6006-one-way}\n  \\end{equation}\n  where $\\mathrm{NS}_\\to$ is the set of bipartite channels that cannot\n  signal from Alice to Bob.  Equation~\\eqref{eq:6006-one-way} settles the\n  one-way problem but has no proven bidirectional analogue\n  \\sourcecite{ref:6006-zhu-zhao-wang}{ZZW25}.","In the bidirectional setting the same work gives a semidefinite\n  program for the one-shot exact cost\n  $S^{(1)}_{\\leftrightarrow,0}(\\mathcal N)$ of\n  Eq.~\\eqref{eq:6006-one-shot-cost} in terms of non-signalling bipartite\n  superchannels, introduces a bipartite conditional min-entropy of the\n  channel as an efficiently computable lower bound on the asymptotic exact\n  cost, and shows that\n  $\\mathfrak D^{\\leftrightarrow}_{\\max}$ in\n  Eq.~\\eqref{eq:6006-max-relative-entropy} is subadditive under tensor\n  products.  Additivity of $\\mathfrak D^{\\leftrightarrow}_{\\max}$ and an\n  achievability theorem matching either converse are not known\n  \\sourcecite{ref:6006-zhu-zhao-wang}{ZZW25}."],"references":[{"key":"BDHSW14","label":"ref:6006-bdhsw","tex":"C. H. Bennett, I. Devetak, A. W. Harrow, P. W. Shor, and A. Winter,\n  ``The Quantum Reverse Shannon Theorem and Resource Tradeoffs for\n  Simulating Quantum Channels,'' \\emph{IEEE Transactions on Information\n  Theory} \\textbf{60}, 2926--2959 (2014).\n  \\href{https://doi.org/10.1109/TIT.2014.2309968}{doi:10.1109/TIT.2014.2309968};\n  \\href{https://arxiv.org/abs/0912.5537}{arXiv:0912.5537}."},{"key":"ZZW25","label":"ref:6006-zhu-zhao-wang","tex":"C. Zhu, X. Zhao, and X. Wang, ``Classical Communication Cost of a\n  Bipartite Quantum Channel Assisted by Non-Signalling Correlations,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{71}, 6041--6060\n  (2025).\n  \\href{https://doi.org/10.1109/TIT.2025.3568528}{doi:10.1109/TIT.2025.3568528};\n  \\href{https://arxiv.org/abs/2408.02506}{arXiv:2408.02506}."}],"comment":"The point-to-point reverse Shannon theorem does not determine the\ntwo-directional resource trade-off of an interactive bipartite process.\nFor bidirectional simulation only converses and one-shot semidefinite\nprograms are available: it is unknown whether the asymptotic costs in\nEq.~\\eqref{eq:6006-asymptotic-cost} equal a regularized or single-letter\nbidirectional max-relative entropy, and no coding theorem attains the known\nlower bounds."}}
---
## Source

The question is implicit in Zhu, Zhao, and Wang, who determine the asymptotic exact one-way cost of a bipartite channel but obtain only one-shot semidefinite programs and converse bounds for the bidirectional cost [ZZW25](https://doi.org/10.1109/TIT.2025.3568528).

## Progress

For a point-to-point channel $\mathcal M:\mathcal L(A)\to\mathcal L(B)$ and tensor-power input sources, the entanglement-assisted quantum reverse Shannon theorem makes simulation and coding reversible: the asymptotic classical-communication cost of simulating $\mathcal M^{\otimes n}$ with free entanglement equals the entanglement-assisted classical capacity

$$
C_E(\mathcal M)
 =\max_{\phi_{RA}}I(R;B)_{(\operatorname{id}_R\otimes\mathcal M)(\phi)}.
 \tag{4}
$$

Equation (4) concerns a single sender and receiver and does not address interactive bipartite processes [BDHSW14](https://doi.org/10.1109/TIT.2014.2309968).

For one-way simulation of a bipartite channel, Zhu, Zhao, and Wang bound the one-shot $\varepsilon$-error cost above and below by a smooth max-relative entropy of one-way classical communication and prove that the asymptotic exact one-way cost equals the additive quantity

$$
\mathfrak D^{\to}_{\max}(\mathcal N)
 :=\min_{\mathcal E\in\mathrm{NS}_\to}D_{\max}(\mathcal N\|\mathcal E),
 \tag{5}
$$

where $\mathrm{NS}_\to$ is the set of bipartite channels that cannot signal from Alice to Bob. Equation (5) settles the one-way problem but has no proven bidirectional analogue [ZZW25](https://doi.org/10.1109/TIT.2025.3568528).

In the bidirectional setting the same work gives a semidefinite program for the one-shot exact cost $S^{(1)}_{\leftrightarrow,0}(\mathcal N)$ of Eq. (1) in terms of non-signalling bipartite superchannels, introduces a bipartite conditional min-entropy of the channel as an efficiently computable lower bound on the asymptotic exact cost, and shows that $\mathfrak D^{\leftrightarrow}_{\max}$ in Eq. (3) is subadditive under tensor products. Additivity of $\mathfrak D^{\leftrightarrow}_{\max}$ and an achievability theorem matching either converse are not known [ZZW25](https://doi.org/10.1109/TIT.2025.3568528).

## Comment

The point-to-point reverse Shannon theorem does not determine the two-directional resource trade-off of an interactive bipartite process. For bidirectional simulation only converses and one-shot semidefinite programs are available: it is unknown whether the asymptotic costs in Eq. (2) equal a regularized or single-letter bidirectional max-relative entropy, and no coding theorem attains the known lower bounds.

## References

**BDHSW14** C. H. Bennett, I. Devetak, A. W. Harrow, P. W. Shor, and A. Winter, “The Quantum Reverse Shannon Theorem and Resource Tradeoffs for Simulating Quantum Channels,” *IEEE Transactions on Information Theory* **60**, 2926–2959 (2014). [doi:10.1109/TIT.2014.2309968](https://doi.org/10.1109/TIT.2014.2309968); [arXiv:0912.5537](https://arxiv.org/abs/0912.5537).

**ZZW25** C. Zhu, X. Zhao, and X. Wang, “Classical Communication Cost of a Bipartite Quantum Channel Assisted by Non-Signalling Correlations,” *IEEE Transactions on Information Theory* **71**, 6041–6060 (2025). [doi:10.1109/TIT.2025.3568528](https://doi.org/10.1109/TIT.2025.3568528); [arXiv:2408.02506](https://arxiv.org/abs/2408.02506).
