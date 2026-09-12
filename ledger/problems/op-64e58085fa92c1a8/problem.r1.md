---
id: "01M27CPFREERH7V1EX15KMGMM9"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-11T09:30:58.169Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-measures","bell-diagonal-states"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Squashed entanglement of qubit Bell-diagonal states"
aliases: ["op-64e58085fa92c1a8","op_64e58085fa92c1a8","01M27CPFREERH7V1EX15KMGMM9"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_64e58085fa92c1a8.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_64e58085fa92c1a8","ulid":"01M27CPFREERH7V1EX15KMGMM9","aliases":["op_64e58085fa92c1a8","01M27CPFREERH7V1EX15KMGMM9","op-64e58085fa92c1a8"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-11T04:47:59.758Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-measures","bell-diagonal-states"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Squashed entanglement of qubit Bell-diagonal states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement measures","Bell-diagonal states"],"statement":"Is there a closed-form formula for the squashed entanglement\n$E_{\\mathrm{sq}}$ of an arbitrary two-qubit Bell-diagonal state, or a\ncertified approach to determining it numerically?  Let $A$ and $B$ be qubits, let $I,X,Y,Z$ be the identity and Pauli\nmatrices, and set $\\lvert\\Phi^+\\rangle:=(\\lvert00\\rangle+\\lvert11\\rangle)/\\sqrt2$\nand $\\lvert\\Phi_P\\rangle:=(I\\otimes P)\\lvert\\Phi^+\\rangle$ for\n$P\\in\\{I,X,Y,Z\\}$.  The states under consideration are\n\\begin{equation}\n  \\rho_{\\mathbf p}:=\\sum_{P\\in\\{I,X,Y,Z\\}}p_P\n  \\lvert\\Phi_P\\rangle\\!\\langle\\Phi_P\\rvert,\n  \\qquad p_P\\geq0,\\qquad \\sum_Pp_P=1.\n  \\label{eq:sqbd-state}\n\\end{equation}\nWith $S(\\tau):=-\\operatorname{Tr}(\\tau\\log_2\\tau)$, define the squashed\nentanglement of the state in Eq.~\\eqref{eq:sqbd-state} by\n\\begin{equation}\n  \\begin{aligned}\n    E_{\\mathrm{sq}}(\\rho_{\\mathbf p})\n      &:=\\frac12\\inf_{\\substack{\\omega_{ABE}\\geq0,\\ \\operatorname{Tr}\\omega_{ABE}=1\\\\\n                    \\operatorname{Tr}_E\\omega_{ABE}=\\rho_{\\mathbf p}}}\n                    I(A:B\\mid E)_\\omega,\\\\\n    I(A:B\\mid E)_\\omega\n      &:=S(\\omega_{AE})+S(\\omega_{BE})-S(\\omega_E)-S(\\omega_{ABE}).\n  \\end{aligned}\n  \\label{eq:sqbd-definition}\n\\end{equation}\nThe infimum in Eq.~\\eqref{eq:sqbd-definition} ranges over all finite-dimensional\nquantum systems $E$, with no fixed bound on their dimension.  Values are in\nebits; this is the quantum squashed entanglement of\n\\sourcecite{ref:sqbd-christandl-winter}{CW04}.\n\nA certified numerical approach should, for any specified probabilities\n$\\mathbf p$ and tolerance $\\varepsilon>0$, produce an estimate of\n$E_{\\mathrm{sq}}(\\rho_{\\mathbf p})$ with a rigorously guaranteed absolute\nerror at most $\\varepsilon$.  Restricting $E$ to a classical register, or\nto a chosen finite dimension, suffices only if the restriction is proved\noptimal or its approximation error is controlled.","source":"This question specializes the computational obstruction documented by\nFawzi and Fawzi, who study two-qubit Werner states in Sec.~3.2 and leave\nconvergence and extension-dimension bounds open in Sec.~4\n\\sourcecite{ref:sqbd-fawzi-fawzi}{FF22}.  The present catalog formulation\nasks for a closed-form formula or certified numerical evaluation for the\nfull Bell-diagonal family; it is not quoted verbatim from that paper.","progress":["Write $p_\\star:=\\max_Pp_P$.  The separable region is exactly\n$p_\\star\\leq1/2$, as follows from the Bell-diagonal specialization of\nWootters' concurrence formula, Eqs.~(8)--(10)\n\\sourcecite{ref:sqbd-wootters}{Woo98}.  Squashed entanglement is zero there\nby Theorem~7 of \\sourcecite{ref:sqbd-christandl-winter}{CW04}, and is\nstrictly positive for $p_\\star>1/2$ by faithfulness, Corollary~1 of\n\\sourcecite{ref:sqbd-brandao-christandl-yard}{BCY11}.  At every pure Bell\nvertex, $p_\\star=1$, it is exactly one ebit by the pure-state evaluation\nin Example~2 of \\sourcecite{ref:sqbd-christandl-winter}{CW04}.","Define $H(\\mathbf p):=-\\sum_Pp_P\\log_2p_P$,\n$h_2(x):=-x\\log_2x-(1-x)\\log_2(1-x)$, with $0\\log_2 0:=0$, and\n$C_{\\mathbf p}:=\\max\\{0,2p_\\star-1\\}$.  Explicit bounds for every Bell-diagonal state are\n\\begin{equation}\n  \\max\\{0,1-H(\\mathbf p)\\}\n  \\leq E_{\\mathrm{sq}}(\\rho_{\\mathbf p})\n  \\leq\\min\\!\\left\\{\n    1-\\frac{H(\\mathbf p)}2,\n    h_2\\!\\left(\\frac{1+\\sqrt{1-C_{\\mathbf p}^2}}2\\right)\n  \\right\\}.\n  \\label{eq:sqbd-bounds}\n\\end{equation}\nThe lower bound in Eq.~\\eqref{eq:sqbd-bounds} follows from Corollary~12 of\n\\sourcecite{ref:sqbd-christandl-winter}{CW04}, since both qubit marginals\nare maximally mixed.  The first upper bound uses a trivial extension;\nthe second combines $E_{\\mathrm{sq}}\\leq E_F$, Proposition~5 of\n\\sourcecite{ref:sqbd-christandl-winter}{CW04}, with Wootters' exact\nentanglement-of-formation formula \\sourcecite{ref:sqbd-wootters}{Woo98}.\nThese are bounds on the desired measure, rather than a formula for it.","Fawzi and Fawzi construct semidefinite-programming lower bounds.\nTheir Sec.~3.2 and Fig.~1 show close numerical agreement with heuristic\nfinite-extension upper bounds for two-qubit Werner states, a\none-parameter Bell-diagonal subfamily\n\\sourcecite{ref:sqbd-fawzi-fawzi}{FF22}.  Their Proposition~2.4 controls\nthe entropy-approximation error in an intermediate optimization; it does\nnot bound the gap of the finite semidefinite relaxation.  Sec.~4 leaves\nconvergence of that hierarchy open, so these results do not establish the\nrequested certified numerical evaluation."],"references":[{"key":"CW04","label":"ref:sqbd-christandl-winter","tex":"M. Christandl and A. Winter, ``'Squashed entanglement': An additive\nentanglement measure,'' \\emph{Journal of Mathematical Physics}\n\\textbf{45}(3), 829--840 (2004).\n\\href{https://doi.org/10.1063/1.1643788}{doi:10.1063/1.1643788};\n\\href{https://arxiv.org/abs/quant-ph/0308088}{arXiv:quant-ph/0308088}."},{"key":"Woo98","label":"ref:sqbd-wootters","tex":"W. K. Wootters, ``Entanglement of Formation of an Arbitrary State of Two\nQubits,'' \\emph{Physical Review Letters} \\textbf{80}, 2245--2248 (1998).\n\\href{https://doi.org/10.1103/PhysRevLett.80.2245}{doi:10.1103/PhysRevLett.80.2245};\n\\href{https://arxiv.org/abs/quant-ph/9709029}{arXiv:quant-ph/9709029}."},{"key":"BCY11","label":"ref:sqbd-brandao-christandl-yard","tex":"F. G. S. L. Brand\\~ao, M. Christandl, and J. Yard, ``Faithful Squashed\nEntanglement,'' \\emph{Communications in Mathematical Physics}\n\\textbf{306}, 805--830 (2011).\n\\href{https://doi.org/10.1007/s00220-011-1302-1}{doi:10.1007/s00220-011-1302-1};\n\\href{https://arxiv.org/abs/1010.1750v5}{arXiv:1010.1750v5}."},{"key":"FF22","label":"ref:sqbd-fawzi-fawzi","tex":"H. Fawzi and O. Fawzi, ``Semidefinite programming lower bounds on the\nsquashed entanglement,'' arXiv preprint (2022).\n\\href{https://arxiv.org/abs/2203.03394}{arXiv:2203.03394}."}],"comment":"Squashed entanglement is additive:\n$E_{\\mathrm{sq}}(\\rho_{\\mathbf p}^{\\otimes n})\n=nE_{\\mathrm{sq}}(\\rho_{\\mathbf p})$ for every positive integer $n$,\nby Proposition~4 of \\sourcecite{ref:sqbd-christandl-winter}{CW04}.\nThus no regularization is needed; the unknown is the single-state value\nas a function of the Bell probabilities.\n\nThe remaining task is a closed-form formula or certified numerical\nevaluation of $E_{\\mathrm{sq}}(\\rho_{\\mathbf p})$ for arbitrary entangled\nmixed Bell-diagonal states.  The known zero region, pure-state values,\nand numerical bounds do not settle this question."}}
---
## Source

This question specializes the computational obstruction documented by Fawzi and Fawzi, who study two-qubit Werner states in Sec. 3.2 and leave convergence and extension-dimension bounds open in Sec. 4 [FF22](https://arxiv.org/abs/2203.03394). The present catalog formulation asks for a closed-form formula or certified numerical evaluation for the full Bell-diagonal family; it is not quoted verbatim from that paper.

## Progress

Write $p_\star:=\max_Pp_P$. The separable region is exactly $p_\star\leq1/2$, as follows from the Bell-diagonal specialization of Wootters’ concurrence formula, Eqs. (8)–(10) [Woo98](https://doi.org/10.1103/PhysRevLett.80.2245). Squashed entanglement is zero there by Theorem 7 of [CW04](https://doi.org/10.1063/1.1643788), and is strictly positive for $p_\star>1/2$ by faithfulness, Corollary 1 of [BCY11](https://doi.org/10.1007/s00220-011-1302-1). At every pure Bell vertex, $p_\star=1$, it is exactly one ebit by the pure-state evaluation in Example 2 of [CW04](https://doi.org/10.1063/1.1643788).

Define $H(\mathbf p):=-\sum_Pp_P\log_2p_P$, $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_2 0:=0$, and $C_{\mathbf p}:=\max\{0,2p_\star-1\}$. Explicit bounds for every Bell-diagonal state are

$$
\max\{0,1-H(\mathbf p)\}
 \leq E_{\mathrm{sq}}(\rho_{\mathbf p})
 \leq\min\!\left\{
 1-\frac{H(\mathbf p)}2,
 h_2\!\left(\frac{1+\sqrt{1-C_{\mathbf p}^2}}2\right)
 \right\}.
\tag{3}
$$

The lower bound in Eq. (3) follows from Corollary 12 of [CW04](https://doi.org/10.1063/1.1643788), since both qubit marginals are maximally mixed. The first upper bound uses a trivial extension; the second combines $E_{\mathrm{sq}}\leq E_F$, Proposition 5 of [CW04](https://doi.org/10.1063/1.1643788), with Wootters’ exact entanglement-of-formation formula [Woo98](https://doi.org/10.1103/PhysRevLett.80.2245). These are bounds on the desired measure, rather than a formula for it.

Fawzi and Fawzi construct semidefinite-programming lower bounds. Their Sec. 3.2 and Fig. 1 show close numerical agreement with heuristic finite-extension upper bounds for two-qubit Werner states, a one-parameter Bell-diagonal subfamily [FF22](https://arxiv.org/abs/2203.03394). Their Proposition 2.4 controls the entropy-approximation error in an intermediate optimization; it does not bound the gap of the finite semidefinite relaxation. Sec. 4 leaves convergence of that hierarchy open, so these results do not establish the requested certified numerical evaluation.

## Comment

Squashed entanglement is additive: $E_{\mathrm{sq}}(\rho_{\mathbf p}^{\otimes n})
=nE_{\mathrm{sq}}(\rho_{\mathbf p})$ for every positive integer $n$, by Proposition 4 of [CW04](https://doi.org/10.1063/1.1643788). Thus no regularization is needed; the unknown is the single-state value as a function of the Bell probabilities.

The remaining task is a closed-form formula or certified numerical evaluation of $E_{\mathrm{sq}}(\rho_{\mathbf p})$ for arbitrary entangled mixed Bell-diagonal states. The known zero region, pure-state values, and numerical bounds do not settle this question.

## References

**CW04** M. Christandl and A. Winter, “’Squashed entanglement’: An additive entanglement measure,” *Journal of Mathematical Physics* **45**(3), 829–840 (2004). [doi:10.1063/1.1643788](https://doi.org/10.1063/1.1643788); [arXiv:quant-ph/0308088](https://arxiv.org/abs/quant-ph/0308088).

**Woo98** W. K. Wootters, “Entanglement of Formation of an Arbitrary State of Two Qubits,” *Physical Review Letters* **80**, 2245–2248 (1998). [doi:10.1103/PhysRevLett.80.2245](https://doi.org/10.1103/PhysRevLett.80.2245); [arXiv:quant-ph/9709029](https://arxiv.org/abs/quant-ph/9709029).

**BCY11** F. G. S. L. Brandão, M. Christandl, and J. Yard, “Faithful Squashed Entanglement,” *Communications in Mathematical Physics* **306**, 805–830 (2011). [doi:10.1007/s00220-011-1302-1](https://doi.org/10.1007/s00220-011-1302-1); [arXiv:1010.1750v5](https://arxiv.org/abs/1010.1750v5).

**FF22** H. Fawzi and O. Fawzi, “Semidefinite programming lower bounds on the squashed entanglement,” arXiv preprint (2022). [arXiv:2203.03394](https://arxiv.org/abs/2203.03394).
