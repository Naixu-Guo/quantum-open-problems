---
id: "01M1Q787QRPDH1Y9ADAGSB1AGN"
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
topicIds: ["entanglement-distillation","ppt-preserving-operations","additivity-and-regularization","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Closed-form exact PPT distillable entanglement"
aliases: ["op-75b91a20dd384110","op_75b91a20dd384110","01M1Q787QRPDH1Y9ADAGSB1AGN"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_75b91a20dd384110.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_75b91a20dd384110","ulid":"01M1Q787QRPDH1Y9ADAGSB1AGN","aliases":["op_75b91a20dd384110","01M1Q787QRPDH1Y9ADAGSB1AGN","op-75b91a20dd384110"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-distillation","ppt-preserving-operations","additivity-and-regularization","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Closed-form exact PPT distillable entanglement","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement distillation","PPT-preserving operations","Additivity and regularization","One-shot and finite-blocklength bounds"],"statement":"What computable expression, if any, equals the regularized exact PPT\ndistillable entanglement of a bipartite state?  Let $\\rho_{AB}$ be a state\non $\\mathbb C^{d_A}\\otimes\\mathbb C^{d_B}$ with support projector\n$P:=\\Pi_{\\operatorname{supp}(\\rho)}$, and let $\\Gamma$ denote partial\ntransposition on $B$.  Exact (zero-error) distillation under\nPPT-preserving operations converts $\\rho^{\\otimes n}$ into a maximally\nentangled state of Schmidt rank $M_n$ with unit fidelity.  The largest\none-shot rate is governed by the semidefinite program\n\\begin{equation}\n  W_0(P):=\\min\\bigl\\{\\|E^{\\Gamma}\\|_\\infty:\\ P\\leq E\\leq\\mathbb 1\\bigr\\},\n  \\qquad\n  E^{(1)}_{0,\\mathrm{PPT}}(\\rho):=-\\log_2W_0(P),\n  \\label{eq:75b9-one-shot}\n\\end{equation}\nwhich depends on $\\rho$ only through its support.  The regularized exact\nPPT distillable entanglement is\n\\begin{equation}\n  E^{\\infty}_{0,\\mathrm{PPT}}(\\rho)\n  :=\\lim_{n\\to\\infty}\\frac1n E^{(1)}_{0,\\mathrm{PPT}}(\\rho^{\\otimes n})\n  =\\lim_{n\\to\\infty}-\\frac1n\\log_2W_0(P^{\\otimes n}).\n  \\label{eq:75b9-regularized}\n\\end{equation}\nIs there a single-letter, efficiently computable formula, for example a\nsemidefinite program in $P$ alone, that equals\nEq.~\\eqref{eq:75b9-regularized} for every bipartite state?","source":"Zhu and Wang disprove the previously conjectured formula and state that\ndetermining the closed form of the exact PPT distillable entanglement\nremains open \\sourcecite{ref:75b9-zhu-wang}{ZW26}.","progress":["Wang and Duan characterize one-copy deterministic PPT distillation\n  by a semidefinite program: a maximally entangled state of integer\n  Schmidt rank $M$ can be distilled exactly from $\\rho$ if and only if\n  $M\\leq W_0(P)^{-1}$, which gives the one-shot rate in\n  Eq.~\\eqref{eq:75b9-one-shot} \\sourcecite{ref:75b9-wang-duan-sdp}{WD16}.","Dropping the constraint $E\\leq\\mathbb 1$ in\n  Eq.~\\eqref{eq:75b9-one-shot} yields the min-Rains relative entropy\n  \\begin{equation}\n    R_{\\min}(\\rho):=-\\log_2M(P),\n    \\qquad\n    M(P):=\\min\\bigl\\{\\|R^{\\Gamma}\\|_\\infty:\\ R\\geq P\\bigr\\},\n    \\label{eq:75b9-min-rains}\n  \\end{equation}\n  which is multiplicative, $M(P\\otimes Q)=M(P)M(Q)$, and therefore an\n  additive single-letter upper bound\n  $E^{\\infty}_{0,\\mathrm{PPT}}(\\rho)\\leq R_{\\min}(\\rho)$.  It is attained\n  for all pure states and for some classes of mixed states, which made\n  Eq.~\\eqref{eq:75b9-min-rains} the candidate closed form\n  \\sourcecite{ref:75b9-wang-duan-nonadditivity}{WD17}.","Every feasible effect in Eq.~\\eqref{eq:75b9-one-shot} must act as\n  the identity on the support of $\\rho$, a constraint absent from\n  Eq.~\\eqref{eq:75b9-min-rains}.  Exploiting it, Zhu and Wang construct a\n  rank-three qutrit--qutrit support $P$ for which every state supported on\n  $P$ satisfies\n  \\begin{equation}\n    E^{\\infty}_{0,\\mathrm{PPT}}(\\rho)\n    <\\log_2\\frac{391}{250}\n    <-\\log_2\\frac{6393}{10000}\n    \\leq R_{\\min}(\\rho),\n    \\label{eq:75b9-separation}\n  \\end{equation}\n  so the min-Rains relative entropy is not the exact rate.  The improved\n  bound in Eq.~\\eqref{eq:75b9-separation} comes from a non-Hermitian,\n  range-supported witness and is not known to be additive or tight\n  \\sourcecite{ref:75b9-zhu-wang}{ZW26}."],"references":[{"key":"WD16","label":"ref:75b9-wang-duan-sdp","tex":"X. Wang and R. Duan, ``Improved Semidefinite Programming Upper Bound on\n  Distillable Entanglement,'' \\emph{Physical Review A} \\textbf{94}, 050301\n  (2016).\n  \\href{https://doi.org/10.1103/PhysRevA.94.050301}{doi:10.1103/PhysRevA.94.050301};\n  \\href{https://arxiv.org/abs/1601.07940}{arXiv:1601.07940}."},{"key":"WD17","label":"ref:75b9-wang-duan-nonadditivity","tex":"X. Wang and R. Duan, ``Nonadditivity of Rains' Bound for Distillable\n  Entanglement,'' \\emph{Physical Review A} \\textbf{95}, 062322 (2017).\n  \\href{https://doi.org/10.1103/PhysRevA.95.062322}{doi:10.1103/PhysRevA.95.062322};\n  \\href{https://arxiv.org/abs/1605.00348}{arXiv:1605.00348}."},{"key":"ZW26","label":"ref:75b9-zhu-wang","tex":"C. Zhu and X. Wang, ``The Min-Rains Relative Entropy Is Not Tight for\n  Exact PPT Entanglement Distillation,'' arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2608.12135}{arXiv:2608.12135}."}],"comment":"The former candidate formula is disproved, but the support quantity whose\nregularization gives the exact zero-error rate in\nEq.~\\eqref{eq:75b9-regularized} has no known closed form.  The remaining\ntask is to find a tensor-stable relaxation of Eq.~\\eqref{eq:75b9-one-shot}\nthat retains the identity-on-support constraint and equals the regularized\nrate, or to show that no single-letter formula exists."}}
---
## Source

Zhu and Wang disprove the previously conjectured formula and state that determining the closed form of the exact PPT distillable entanglement remains open [ZW26](https://arxiv.org/abs/2608.12135).

## Progress

Wang and Duan characterize one-copy deterministic PPT distillation by a semidefinite program: a maximally entangled state of integer Schmidt rank $M$ can be distilled exactly from $\rho$ if and only if $M\leq W_0(P)^{-1}$, which gives the one-shot rate in Eq. (1) [WD16](https://doi.org/10.1103/PhysRevA.94.050301).

Dropping the constraint $E\leq\mathbb 1$ in Eq. (1) yields the min-Rains relative entropy

$$
R_{\min}(\rho):=-\log_2M(P),
 \qquad
 M(P):=\min\bigl\{\|R^{\Gamma}\|_\infty:\ R\geq P\bigr\},
 \tag{3}
$$

which is multiplicative, $M(P\otimes Q)=M(P)M(Q)$, and therefore an additive single-letter upper bound $E^{\infty}_{0,\mathrm{PPT}}(\rho)\leq R_{\min}(\rho)$. It is attained for all pure states and for some classes of mixed states, which made Eq. (3) the candidate closed form [WD17](https://doi.org/10.1103/PhysRevA.95.062322).

Every feasible effect in Eq. (1) must act as the identity on the support of $\rho$, a constraint absent from Eq. (3). Exploiting it, Zhu and Wang construct a rank-three qutrit–qutrit support $P$ for which every state supported on $P$ satisfies

$$
E^{\infty}_{0,\mathrm{PPT}}(\rho)
 <\log_2\frac{391}{250}
 <-\log_2\frac{6393}{10000}
 \leq R_{\min}(\rho),
 \tag{4}
$$

so the min-Rains relative entropy is not the exact rate. The improved bound in Eq. (4) comes from a non-Hermitian, range-supported witness and is not known to be additive or tight [ZW26](https://arxiv.org/abs/2608.12135).

## Comment

The former candidate formula is disproved, but the support quantity whose regularization gives the exact zero-error rate in Eq. (2) has no known closed form. The remaining task is to find a tensor-stable relaxation of Eq. (1) that retains the identity-on-support constraint and equals the regularized rate, or to show that no single-letter formula exists.

## References

**WD16** X. Wang and R. Duan, “Improved Semidefinite Programming Upper Bound on Distillable Entanglement,” *Physical Review A* **94**, 050301 (2016). [doi:10.1103/PhysRevA.94.050301](https://doi.org/10.1103/PhysRevA.94.050301); [arXiv:1601.07940](https://arxiv.org/abs/1601.07940).

**WD17** X. Wang and R. Duan, “Nonadditivity of Rains’ Bound for Distillable Entanglement,” *Physical Review A* **95**, 062322 (2017). [doi:10.1103/PhysRevA.95.062322](https://doi.org/10.1103/PhysRevA.95.062322); [arXiv:1605.00348](https://arxiv.org/abs/1605.00348).

**ZW26** C. Zhu and X. Wang, “The Min-Rains Relative Entropy Is Not Tight for Exact PPT Entanglement Distillation,” arXiv preprint (2026). [arXiv:2608.12135](https://arxiv.org/abs/2608.12135).
