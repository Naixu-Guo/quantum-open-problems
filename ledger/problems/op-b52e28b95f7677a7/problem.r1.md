---
id: "01M26K8Q6Z6DTG3558MEC99KST"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["gaussian-quantum-information"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Optimal output monitoring for parametric-oscillator squeezing"
aliases: ["op-b52e28b95f7677a7","op_b52e28b95f7677a7","01M26K8Q6Z6DTG3558MEC99KST"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_b52e28b95f7677a7.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b52e28b95f7677a7","ulid":"01M26K8Q6Z6DTG3558MEC99KST","aliases":["op_b52e28b95f7677a7","01M26K8Q6Z6DTG3558MEC99KST","op-b52e28b95f7677a7"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:23:34.239Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["gaussian-quantum-information"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Optimal output monitoring for parametric-oscillator squeezing","status":"Solved","fields":["Quantum Resource Theory"],"topics":["Gaussian quantum information"],"statement":"Can any causal output measurement improve the mean conditional position squeezing achieved by ideal homodyne detection?\nConsider one mode with $[q,p]=i$, $a=(q+ip)/\\sqrt2$, and $0\\leq\\chi<1/2$.\nThe oscillator interacts with a vacuum Markov bath at unit damping rate.\nIts dynamics are Eq.~\\eqref{eq:sr5-dynamics}.\n\\begin{equation}\nH_\\chi=-\\frac\\chi2(qp+pq),\\qquad\n\\dot\\rho=-i[H_\\chi,\\rho]+\\mathcal D[a]\\rho,\\qquad\n\\mathcal D[a]\\rho=a\\rho a^\\dagger-\\frac12\\{a^\\dagger a,\\rho\\}.\n\\label{eq:sr5-dynamics}\n\\end{equation}\nThe initial oscillator state is the unconditional stationary state.\nThe measurement $\\mathsf M$ may be adaptive or non-Gaussian and may access the output field up to the current time.\nIt does not apply control operations to the oscillator.\nLet $\\rho_c(t)$ be the oscillator state conditioned on the measurement record.\nThe mean is over all records, without postselection.\nDefine the optimum by Eq.~\\eqref{eq:sr5-cost}.\n\\begin{equation}\ns_{\\mathrm{all}}(\\chi)=\\inf_{\\mathsf M}\\liminf_{t\\to\\infty}\\mathbb E_{\\mathsf M}\\!\\left[2\\operatorname{Var}_{\\rho_c(t)}q\\right].\n\\label{eq:sr5-cost}\n\\end{equation}\nDoes $s_{\\mathrm{all}}(\\chi)=1-2\\chi$ hold throughout the stated range?","source":"This is a formulation for a fixed-quadrature mean cost in the parametric oscillator of Genoni, Lami, and Serafini, Sec.~6.1 \\sourcecite{ref:sr5-genoni}{GLS16}. The extension of its monitoring optimization to arbitrary non-Gaussian output measurements is editorial.","progress":["At unit damping and zero temperature, Sec.~6.1, Eqs.~(77)--(78) of the arXiv PDF, give the stationary unconditional and ideal-homodyne covariances in Eq.~\\eqref{eq:sr5-covariances} \\sourcecite{ref:sr5-genoni}{GLS16}. Choose the homodyne phase whose output signal is $a+a^\\dagger=\\sqrt2q$. The covariance convention is $V_{jk}=\\langle\\{R_j-\\langle R_j\\rangle,R_k-\\langle R_k\\rangle\\}\\rangle$ for $R=(q,p)^{\\mathsf T}$.\n\\begin{equation}\n\\begin{aligned}\n V_{\\mathrm{unc}}&=\\operatorname{diag}\\!\\left(\\frac1{1+2\\chi},\\frac1{1-2\\chi}\\right),\\\\\n V_{\\mathrm{hom}}&=\\operatorname{diag}\\!\\left(1-2\\chi,\\frac1{1-2\\chi}\\right).\n\\end{aligned}\n\\label{eq:sr5-covariances}\n\\end{equation}","A direct ensemble argument proves optimality even for non-Gaussian monitoring. Write $V_{q,c}=2\\operatorname{Var}_{\\rho_c}q$ and $V_{p,c}=2\\operatorname{Var}_{\\rho_c}p$. Robertson uncertainty gives $V_{q,c}V_{p,c}\\geq1$. Jensen's inequality and the law of total variance then imply Eq.~\\eqref{eq:sr5-lower} at every time.\n\\begin{equation}\n\\mathbb E[V_{q,c}]\\geq\\mathbb E[1/V_{p,c}]\\geq\\frac1{\\mathbb E[V_{p,c}]}\\geq\\frac1{(V_{\\mathrm{unc}})_{pp}}=1-2\\chi.\n\\label{eq:sr5-lower}\n\\end{equation}\nThe unconditional state stays stationary because measurements act only on the output. Combining Eq.~\\eqref{eq:sr5-lower} with the homodyne value in Eq.~\\eqref{eq:sr5-covariances} proves $s_{\\mathrm{all}}(\\chi)=1-2\\chi$. This last argument is supplied here; it is not attributed to the paper."],"references":[{"key":"GLS16","label":"ref:sr5-genoni","tex":"M. G. Genoni, L. Lami, and A. Serafini, ``Conditional and Unconditional Gaussian Quantum Dynamics,'' \\emph{Contemporary Physics} \\textbf{57}, 331--349 (2016). \\href{https://doi.org/10.1080/00107514.2015.1125624}{doi:10.1080/00107514.2015.1125624}; \\href{https://arxiv.org/abs/1607.02619}{arXiv:1607.02619}."}],"comment":"The fixed-quadrature mean cost is completely resolved by the published homodyne solution and the direct lower-bound argument above. The latter is not a separately peer-reviewed theorem. Outcome-dependent quadrature choices, postselected costs, and feedback control on the oscillator define different optimization problems."}}
---
## Source

This is a formulation for a fixed-quadrature mean cost in the parametric oscillator of Genoni, Lami, and Serafini, Sec. 6.1 [GLS16](https://doi.org/10.1080/00107514.2015.1125624). The extension of its monitoring optimization to arbitrary non-Gaussian output measurements is editorial.

## Progress

At unit damping and zero temperature, Sec. 6.1, Eqs. (77)–(78) of the arXiv PDF, give the stationary unconditional and ideal-homodyne covariances in Eq. (3) [GLS16](https://doi.org/10.1080/00107514.2015.1125624). Choose the homodyne phase whose output signal is $a+a^\dagger=\sqrt2q$. The covariance convention is $V_{jk}=\langle\{R_j-\langle R_j\rangle,R_k-\langle R_k\rangle\}\rangle$ for $R=(q,p)^{\mathsf T}$.

$$
\begin{aligned}
 V_{\mathrm{unc}}&=\operatorname{diag}\!\left(\frac1{1+2\chi},\frac1{1-2\chi}\right),\\
 V_{\mathrm{hom}}&=\operatorname{diag}\!\left(1-2\chi,\frac1{1-2\chi}\right).
\end{aligned}
\tag{3}
$$

A direct ensemble argument proves optimality even for non-Gaussian monitoring. Write $V_{q,c}=2\operatorname{Var}_{\rho_c}q$ and $V_{p,c}=2\operatorname{Var}_{\rho_c}p$. Robertson uncertainty gives $V_{q,c}V_{p,c}\geq1$. Jensen’s inequality and the law of total variance then imply Eq. (4) at every time.

$$
\mathbb E[V_{q,c}]\geq\mathbb E[1/V_{p,c}]\geq\frac1{\mathbb E[V_{p,c}]}\geq\frac1{(V_{\mathrm{unc}})_{pp}}=1-2\chi.
\tag{4}
$$

The unconditional state stays stationary because measurements act only on the output. Combining Eq. (4) with the homodyne value in Eq. (3) proves $s_{\mathrm{all}}(\chi)=1-2\chi$. This last argument is supplied here; it is not attributed to the paper.

## Comment

The fixed-quadrature mean cost is completely resolved by the published homodyne solution and the direct lower-bound argument above. The latter is not a separately peer-reviewed theorem. Outcome-dependent quadrature choices, postselected costs, and feedback control on the oscillator define different optimization problems.

## References

**GLS16** M. G. Genoni, L. Lami, and A. Serafini, “Conditional and Unconditional Gaussian Quantum Dynamics,” *Contemporary Physics* **57**, 331–349 (2016). [doi:10.1080/00107514.2015.1125624](https://doi.org/10.1080/00107514.2015.1125624); [arXiv:1607.02619](https://arxiv.org/abs/1607.02619).
