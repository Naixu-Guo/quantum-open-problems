---
id: "01M26KH5ZAB056C2SMQZFX96S3"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["gaussian-quantum-information","entanglement-distillation","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Optimal success probability for Gaussian processing of non-Gaussian entanglement"
aliases: ["op-6f6de1a285416bb2","op_6f6de1a285416bb2","01M26KH5ZAB056C2SMQZFX96S3"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_6f6de1a285416bb2.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_6f6de1a285416bb2","ulid":"01M26KH5ZAB056C2SMQZFX96S3","aliases":["op_6f6de1a285416bb2","01M26KH5ZAB056C2SMQZFX96S3","op-6f6de1a285416bb2"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:28:11.498Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["gaussian-quantum-information","entanglement-distillation","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Optimal success probability for Gaussian processing of non-Gaussian entanglement","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Gaussian quantum information","Entanglement distillation","One-shot and finite-blocklength bounds"],"statement":"What is the maximal success probability for preparing an approximate two-mode squeezed vacuum from finitely many copies of a non-Gaussian state?\n\nLet $\\rho$ be a non-Gaussian density operator of one bosonic mode at Alice and one at Bob. Fix an integer $m\\geq1$, squeezing $r>0$, and error tolerance $0<\\varepsilon<1$. The target is the two-mode squeezed vacuum\n\n\\begin{equation}\n\\psi_r:=|\\psi_r\\rangle\\langle\\psi_r|,\\qquad\n|\\psi_r\\rangle:=\\sqrt{1-\\tanh^2r}\\sum_{j=0}^{\\infty}(\\tanh r)^j|j,j\\rangle,\n\\label{eq:ser18-statement-1}\n\\end{equation}\n\nEquation~\\eqref{eq:ser18-statement-1} uses the product photon-number basis.\n\nPreparation from $m$ copies of $\\rho$ uses local Gaussian operations and classical communication. Allowed success maps $\\Lambda$ are trace-nonincreasing completely positive maps. Each implementation is a finite sequence using local Gaussian ancillary states, local Gaussian unitaries, Gaussian measurements or vacuum-projection success branches, discarding, and classical feedforward. Gaussian measurement records may be accepted on a specified measurable set; their probabilities are integrated over that set. A nonvacuum outcome of a vacuum projection terminates that run in failure; its output cannot be reused. The input copies are the only non-Gaussian resource.\n\nFor each allowed map, write $p_\\Lambda:=\\operatorname{Tr}\\Lambda(\\rho^{\\otimes m})$. When $p_\\Lambda>0$, let $\\tau_\\Lambda:=\\Lambda(\\rho^{\\otimes m})/p_\\Lambda$. Define the maximal heralding probability by\n\n\\begin{equation}\nP_G^{(m)}(\\rho,r,\\varepsilon):=\n\\sup_{\\Lambda}\\left\\{p_\\Lambda:p_\\Lambda>0,\\quad\n\\tfrac12\\|\\tau_\\Lambda-\\psi_r\\|_1\\leq\\varepsilon\\right\\}.\n\\label{eq:ser18-statement-2}\n\\end{equation}\n\nDetermine Eq.~\\eqref{eq:ser18-statement-2}, with $\\sup\\varnothing:=0$. Here $\\|X\\|_1:=\\operatorname{Tr}\\sqrt{X^\\dagger X}$.","source":"This optimization is a precise formulation of the probability-versus-accuracy question suggested by Browne et al., Sections II--III and Figures 2--3. The source supplies particular protocols, not this universal optimum \\sourcecite{ref:ser18-1}{BESP03}.","progress":["For the input $|\\varphi_\\lambda\\rangle:=(|0,0\\rangle+\\lambda|1,1\\rangle)/\\sqrt{1+\\lambda^2}$, $0<\\lambda<1$, a balanced beam-splitter tree with $m=2^k$ input copies, $k\\geq0$, and vacuum projections on all discarded ports produces coefficients\n\n\\begin{equation}\n\\begin{aligned}\nb_{m,j}&:=\\lambda^j\\prod_{\\ell=0}^{j-1}(1-\\ell/m),\n&Z_m&:=\\sum_{j=0}^{m}b_{m,j}^2,\\\\\n|\\varphi_{\\lambda,m}\\rangle&:=Z_m^{-1/2}\n\\sum_{j=0}^{m}b_{m,j}|j,j\\rangle,\n&p_m&:=\\frac{Z_m}{(1+\\lambda^2)^m}.\n\\end{aligned}\n\\label{eq:ser18-progress-1-1}\n\\end{equation}\n\nEquation~\\eqref{eq:ser18-progress-1-1} follows by expanding the published optical iteration; the empty product equals one. \\sourcecite{ref:ser18-1}{BESP03}","Consequently, with $r=\\operatorname{arctanh}\\lambda$ and $\\varepsilon_m:=\\sqrt{1-|\\langle\\psi_r|\\varphi_{\\lambda,m}\\rangle|^2}$, the protocol gives\n\n\\begin{equation}\n\\begin{gathered}\nP_G^{(m)}(|\\varphi_\\lambda\\rangle\\langle\\varphi_\\lambda|,r,\\varepsilon_m)\\geq p_m,\n\\\\ \\varepsilon_m\\longrightarrow0,\\qquad\np_m\\sim\\frac{(1+\\lambda^2)^{-m}}{1-\\lambda^2}.\n\\end{gathered}\n\\label{eq:ser18-progress-2-1}\n\\end{equation}\n\nThe limits in Eq.~\\eqref{eq:ser18-progress-2-1} follow directly from $0\\leq b_{m,j}\\leq\\lambda^j$ and $b_{m,j}\\to\\lambda^j$; this establishes attainability, not an optimal asymptotic yield. \\sourcecite{ref:ser18-1}{BESP03}, \\sourcecite{ref:ser18-2}{CE12}"],"references":[{"key":"BESP03","label":"ref:ser18-1","tex":"D. E. Browne, J. Eisert, S. Scheel, and M. B. Plenio, \"Driving Non-Gaussian to Gaussian States with Linear Optics,\" \\emph{Physical Review A} \\textbf{67}, 062320 (2003). \\href{https://doi.org/10.1103/PhysRevA.67.062320}{doi:10.1103/PhysRevA.67.062320}; \\href{https://arxiv.org/abs/quant-ph/0211173}{arXiv:quant-ph/0211173}."},{"key":"CE12","label":"ref:ser18-2","tex":"E. T. Campbell and J. Eisert, \"Gaussification and Entanglement Distillation of Continuous Variable Systems: A Unifying Picture,\" \\emph{Physical Review Letters} \\textbf{108}, 020501 (2012). \\href{https://doi.org/10.1103/PhysRevLett.108.020501}{doi:10.1103/PhysRevLett.108.020501}; \\href{https://arxiv.org/abs/1107.1406}{arXiv:1107.1406}."}],"comment":"The optimal probability for arbitrary non-Gaussian inputs remains unresolved. The displayed convergent protocol has exponentially decreasing success probability when every branch of a fixed input tree must succeed. Convergence alone does not establish a positive asymptotic yield."}}
---
## Source

This optimization is a precise formulation of the probability-versus-accuracy question suggested by Browne et al., Sections II–III and Figures 2–3. The source supplies particular protocols, not this universal optimum [BESP03](https://doi.org/10.1103/PhysRevA.67.062320).

## Progress

For the input $|\varphi_\lambda\rangle:=(|0,0\rangle+\lambda|1,1\rangle)/\sqrt{1+\lambda^2}$, $0<\lambda<1$, a balanced beam-splitter tree with $m=2^k$ input copies, $k\geq0$, and vacuum projections on all discarded ports produces coefficients

$$
\begin{aligned}
b_{m,j}&:=\lambda^j\prod_{\ell=0}^{j-1}(1-\ell/m),
&Z_m&:=\sum_{j=0}^{m}b_{m,j}^2,\\
|\varphi_{\lambda,m}\rangle&:=Z_m^{-1/2}
\sum_{j=0}^{m}b_{m,j}|j,j\rangle,
&p_m&:=\frac{Z_m}{(1+\lambda^2)^m}.
\end{aligned}
\tag{3}
$$

Equation (3) follows by expanding the published optical iteration; the empty product equals one. [BESP03](https://doi.org/10.1103/PhysRevA.67.062320)

Consequently, with $r=\operatorname{arctanh}\lambda$ and $\varepsilon_m:=\sqrt{1-|\langle\psi_r|\varphi_{\lambda,m}\rangle|^2}$, the protocol gives

$$
\begin{gathered}
P_G^{(m)}(|\varphi_\lambda\rangle\langle\varphi_\lambda|,r,\varepsilon_m)\geq p_m,
\\ \varepsilon_m\longrightarrow0,\qquad
p_m\sim\frac{(1+\lambda^2)^{-m}}{1-\lambda^2}.
\end{gathered}
\tag{4}
$$

The limits in Eq. (4) follow directly from $0\leq b_{m,j}\leq\lambda^j$ and $b_{m,j}\to\lambda^j$; this establishes attainability, not an optimal asymptotic yield. [BESP03](https://doi.org/10.1103/PhysRevA.67.062320), [CE12](https://doi.org/10.1103/PhysRevLett.108.020501)

## Comment

The optimal probability for arbitrary non-Gaussian inputs remains unresolved. The displayed convergent protocol has exponentially decreasing success probability when every branch of a fixed input tree must succeed. Convergence alone does not establish a positive asymptotic yield.

## References

**BESP03** D. E. Browne, J. Eisert, S. Scheel, and M. B. Plenio, "Driving Non-Gaussian to Gaussian States with Linear Optics," *Physical Review A* **67**, 062320 (2003). [doi:10.1103/PhysRevA.67.062320](https://doi.org/10.1103/PhysRevA.67.062320); [arXiv:quant-ph/0211173](https://arxiv.org/abs/quant-ph/0211173).

**CE12** E. T. Campbell and J. Eisert, "Gaussification and Entanglement Distillation of Continuous Variable Systems: A Unifying Picture," *Physical Review Letters* **108**, 020501 (2012). [doi:10.1103/PhysRevLett.108.020501](https://doi.org/10.1103/PhysRevLett.108.020501); [arXiv:1107.1406](https://arxiv.org/abs/1107.1406).
