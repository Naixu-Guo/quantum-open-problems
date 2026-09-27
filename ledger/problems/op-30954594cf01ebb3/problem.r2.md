---
id: "01M2M9FC484RZN7CN5FV721TKH"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-metrology","quantum-algorithm"]
topicIds: ["quantum-estimation","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Sparse Hamiltonian learning without short-time control"
aliases: ["op-30954594cf01ebb3","op_30954594cf01ebb3","01M2M9FC484RZN7CN5FV721TKH"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_30954594cf01ebb3.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_30954594cf01ebb3","ulid":"01M2M9FC484RZN7CN5FV721TKH","aliases":["op_30954594cf01ebb3","01M2M9FC484RZN7CN5FV721TKH","op-30954594cf01ebb3"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.552Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-metrology","quantum-algorithm"],"topicIds":["quantum-estimation","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Sparse Hamiltonian learning without short-time control","status":"Unsolved","fields":["Quantum metrology","Quantum algorithm"],"topics":["Quantum estimation","Computational complexity and computability"],"statement":"Can every polynomially sparse Hamiltonian be learned with Heisenberg-limited total evolution time when every oracle call has a fixed minimum duration?\n\nLet\n\n\\begin{equation}\nH=\\sum_{P\\neq I^{\\otimes n}}a_PP,\n\\qquad\n|\\{P:a_P\\neq0\\}|\\leq m\\leq n^c,\n\\qquad\n\\|H\\|_{\\mathrm{op}}\\leq1,\n\\label{eq:3095-1}\n\\end{equation}\n\nwhere $c>0$ is fixed, the sum ranges over nonidentity $n$-qubit Pauli strings, and the nonzero coefficients and their supports are unknown. An oracle supplies only forward evolution $e^{-iHt}$ for chosen times $t\\geq T$, where $T>0$ is fixed independently of $n,m,$ and $\\varepsilon$. Known controls and ancillas may be used between calls.\n\nCan a learner output $\\widehat a_P$ with $\\max_P|\\widehat a_P-a_P|\\leq\\varepsilon$ and success probability at least $2/3$, using total evolution time $\\widetilde O(\\operatorname{poly}(n,m)/\\varepsilon)$ and polynomial query, circuit, and classical-processing costs for every Hamiltonian in Eq.~\\eqref{eq:3095-1}?","source":"Shin, Lee, and Oh explicitly pose the polynomial-sparsity, fixed-minimum-duration question in the discussion following their Theorem 2 \\sourcecite{ref:3095-shin26}{Shin26}. The statement is rewritten here to make its hypotheses and success criterion self-contained.","progress":["Without the fixed minimum-duration restriction, general sparse Hamiltonian learning can already achieve Heisenberg precision scaling. The ancilla-assisted protocol of Hu and coauthors has\n  \\begin{equation}\nt_{\\mathrm{tot}}\n  =O\\!\\left(\\frac{m^2\\log(m/\\delta)\\log^2(1/\\varepsilon)}{\\varepsilon}\\right),\n\\label{eq:3095-2}\n\\end{equation}\n  where $\\delta$ is the failure probability. Its access assumptions allow short-time control, so the absence of a known Pauli support alone is no longer the open issue. \\sourcecite{ref:3095-hu25}{Hu25}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:3095-2}.","Shin, Lee, and Oh solve the minimum-duration problem for logarithmic sparsity. Their Theorem 1 gives\n  \\begin{equation}\nt_{\\mathrm{tot}}\n  =\\widetilde O\\!\\left(\n  \\min\\left\\{\\frac{4^mT^3}{\\varepsilon},\n  \\frac{4^mT}{\\varepsilon^2}\\right\\}\\right).\n\\label{eq:3095-3}\n\\end{equation}\n  For $m=O(\\log n)$, this is efficient at any fixed $T$. \\sourcecite{ref:3095-shin26}{Shin26}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:3095-3}.","Their Theorem 2 gives the tradeoff\n  \\begin{equation}\nt_{\\mathrm{tot}}\n  =\\widetilde O\\!\\left(\n  \\min\\left\\{\\frac{m^{K+2}T}{\\varepsilon},\n  \\frac{m^KT}{\\varepsilon^2}\\right\\}\\right),\n  \\qquad T=\\Theta(m^{-1/K}),\\quad K\\in\\mathbb N.\n\\label{eq:3095-4}\n\\end{equation}\n  A fixed $K$ permits polynomial sparsity dependence but a shrinking minimum time. Taking $K=\\Theta(\\log m)$ makes $T=\\Theta(1)$, at the cost of $m^{O(\\log m)}$ dependence. \\sourcecite{ref:3095-shin26}{Shin26}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:3095-4}.","The paragraph following Theorem 2 explicitly asks for polynomial cost at polynomial sparsity and arbitrary constant $T$. The later June 2026 work on long-time learning instead establishes recovery up to overall scale for broad ensembles satisfying an approximate-conservation identifiability condition; it does not establish the worst-case, absolute-coefficient, Heisenberg guarantee requested here. \\sourcecite{ref:3095-shin26}{Shin26}\\sourcecite{ref:3095-pradenne26}{Pradenne26}"],"references":[{"key":"Hu25","label":"ref:3095-hu25","tex":"H.-Y. Hu, M. Ma, W. Gong, Q. Ye, Y. Tong, S. T. Flammia, and S. F. Yelin, \"Ansatz-free Hamiltonian learning with Heisenberg-limited scaling,\" \\emph{PRX Quantum} 6, 040315 (2025). \\href{https://doi.org/10.1103/j7b8-pb77}{doi:10.1103/j7b8-pb77}; \\href{https://arxiv.org/abs/2502.11900}{arXiv:2502.11900}."},{"key":"Shin26","label":"ref:3095-shin26","tex":"M. Shin, J. Lee, and C. Oh, \"Heisenberg-limited Hamiltonian learning without short-time control,\" arXiv preprint (2026), version 1, 30 April 2026. \\href{https://arxiv.org/abs/2604.27838}{arXiv:2604.27838}."},{"key":"Pradenne26","label":"ref:3095-pradenne26","tex":"C. Cedillo Vayson de Pradenne, J. Cotler, and H.-Y. Huang, \"Learning Hamiltonians at Long Times,\" arXiv preprint (2026), version 1, 4 June 2026. \\href{https://arxiv.org/abs/2606.05690}{arXiv:2606.05690}."}],"comment":"The open resource tradeoff concerns polynomial sparsity together with a nonshrinking minimum query duration, not merely whether long-time dynamics contain information. Real-valued programmable durations are allowed, so this is not a question about aliasing from a single fixed sampling interval or finite timing resolution. The available constant-duration generalization is quasipolynomial rather than polynomial in sparsity.","contributors":[]}}
---
## Source

Shin, Lee, and Oh explicitly pose the polynomial-sparsity, fixed-minimum-duration question in the discussion following their Theorem 2 [Shin26](https://arxiv.org/abs/2604.27838). The statement is rewritten here to make its hypotheses and success criterion self-contained.

## Progress

Without the fixed minimum-duration restriction, general sparse Hamiltonian learning can already achieve Heisenberg precision scaling. The ancilla-assisted protocol of Hu and coauthors has

$$
t_{\mathrm{tot}}
 =O\!\left(\frac{m^2\log(m/\delta)\log^2(1/\varepsilon)}{\varepsilon}\right),
\tag{2}
$$

where $\delta$ is the failure probability. Its access assumptions allow short-time control, so the absence of a known Pauli support alone is no longer the open issue. [Hu25](https://doi.org/10.1103/j7b8-pb77)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (2).

Shin, Lee, and Oh solve the minimum-duration problem for logarithmic sparsity. Their Theorem 1 gives

$$
t_{\mathrm{tot}}
 =\widetilde O\!\left(
 \min\left\{\frac{4^mT^3}{\varepsilon},
 \frac{4^mT}{\varepsilon^2}\right\}\right).
\tag{3}
$$

For $m=O(\log n)$, this is efficient at any fixed $T$. [Shin26](https://arxiv.org/abs/2604.27838)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (3).

Their Theorem 2 gives the tradeoff

$$
t_{\mathrm{tot}}
 =\widetilde O\!\left(
 \min\left\{\frac{m^{K+2}T}{\varepsilon},
 \frac{m^KT}{\varepsilon^2}\right\}\right),
 \qquad T=\Theta(m^{-1/K}),\quad K\in\mathbb N.
\tag{4}
$$

A fixed $K$ permits polynomial sparsity dependence but a shrinking minimum time. Taking $K=\Theta(\log m)$ makes $T=\Theta(1)$, at the cost of $m^{O(\log m)}$ dependence. [Shin26](https://arxiv.org/abs/2604.27838)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (4).

The paragraph following Theorem 2 explicitly asks for polynomial cost at polynomial sparsity and arbitrary constant $T$. The later June 2026 work on long-time learning instead establishes recovery up to overall scale for broad ensembles satisfying an approximate-conservation identifiability condition; it does not establish the worst-case, absolute-coefficient, Heisenberg guarantee requested here. [Shin26](https://arxiv.org/abs/2604.27838)[Pradenne26](https://arxiv.org/abs/2606.05690)

## Comment

The open resource tradeoff concerns polynomial sparsity together with a nonshrinking minimum query duration, not merely whether long-time dynamics contain information. Real-valued programmable durations are allowed, so this is not a question about aliasing from a single fixed sampling interval or finite timing resolution. The available constant-duration generalization is quasipolynomial rather than polynomial in sparsity.

## References

**Hu25** H.-Y. Hu, M. Ma, W. Gong, Q. Ye, Y. Tong, S. T. Flammia, and S. F. Yelin, "Ansatz-free Hamiltonian learning with Heisenberg-limited scaling," *PRX Quantum* 6, 040315 (2025). [doi:10.1103/j7b8-pb77](https://doi.org/10.1103/j7b8-pb77); [arXiv:2502.11900](https://arxiv.org/abs/2502.11900).

**Shin26** M. Shin, J. Lee, and C. Oh, "Heisenberg-limited Hamiltonian learning without short-time control," arXiv preprint (2026), version 1, 30 April 2026. [arXiv:2604.27838](https://arxiv.org/abs/2604.27838).

**Pradenne26** C. Cedillo Vayson de Pradenne, J. Cotler, and H.-Y. Huang, "Learning Hamiltonians at Long Times," arXiv preprint (2026), version 1, 4 June 2026. [arXiv:2606.05690](https://arxiv.org/abs/2606.05690).
