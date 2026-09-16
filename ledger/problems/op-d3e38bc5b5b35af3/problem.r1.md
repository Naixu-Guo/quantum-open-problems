---
id: "01M2M9FC8R2FX3MFDQX7HZ7ZPW"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T05:53:34.975Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-metrology"]
topicIds: ["quantum-estimation","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Optimal precision dependence of diamond-norm channel tomography"
aliases: ["op-d3e38bc5b5b35af3","op_d3e38bc5b5b35af3","01M2M9FC8R2FX3MFDQX7HZ7ZPW"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_d3e38bc5b5b35af3.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_d3e38bc5b5b35af3","ulid":"01M2M9FC8R2FX3MFDQX7HZ7ZPW","aliases":["op_d3e38bc5b5b35af3","01M2M9FC8R2FX3MFDQX7HZ7ZPW","op-d3e38bc5b5b35af3"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.696Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["quantum-estimation","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Optimal precision dependence of diamond-norm channel tomography","status":"Unsolved","fields":["Quantum metrology"],"topics":["Quantum estimation","One-shot and finite-blocklength bounds"],"statement":"Does tomography of an arbitrary $d$-dimensional quantum channel in diamond norm require and suffice with $\\Theta(d^4/\\varepsilon^2)$ channel uses?\n\nLet $\\Lambda:\\mathcal L(\\mathbb C^d)\\to\\mathcal L(\\mathbb C^d)$ be an arbitrary unknown completely positive, trace-preserving channel, with $d\\geq2$ and no Kraus-rank promise. For sufficiently small $\\varepsilon>0$, let $Q_\\diamond(d,\\varepsilon)$ be the minimum worst-case number of channel uses needed to output a classical description of a channel $\\widehat\\Lambda$ such that\n\n\\begin{equation}\n\\Pr\\!\\left[\\|\\widehat\\Lambda-\\Lambda\\|_\\diamond\\leq\\varepsilon\\right]\\geq\\frac23,\n\\qquad\n\\|\\widehat\\Lambda-\\Lambda\\|_\\diamond\n:=\\sup_{\\omega}\n\\left\\|\\bigl[(\\widehat\\Lambda-\\Lambda)\\otimes\\operatorname{id}_d\\bigr](\\omega)\\right\\|_1,\n\\label{eq:d3e3-1}\n\\end{equation}\n\nwhere the supremum is over density operators on $\\mathbb C^d\\otimes\\mathbb C^d$, and $\\operatorname{id}_d$ is the identity channel. Adaptive inputs, ancillas, quantum memory, and collective measurements are allowed. Only ordinary channel uses are supplied, not a purification of the channel's environment; computational efficiency is not required.\n\nIs $Q_\\diamond(d,\\varepsilon)=\\Theta(d^4/\\varepsilon^2)$ with constants uniform in both $d$ and $\\varepsilon$?\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:d3e3-1}.","source":"This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature \\sourcecite{ref:d3e3-mele25}{Mele25}\\sourcecite{ref:d3e3-chen25}{Chen25}; it is not presented as a verbatim conjecture of those authors.","progress":["General channels with input dimension $d_{\\mathrm{in}}$, output dimension $d_{\\mathrm{out}}$, and Kraus rank at most $r$ admit tomography using\n  \\begin{equation}\nO(d_{\\mathrm{in}}d_{\\mathrm{out}}r/\\varepsilon^2)\n\\label{eq:d3e3-2}\n\\end{equation}\n  queries. Substituting $d_{\\mathrm{in}}=d_{\\mathrm{out}}=d$ and $r=d^2$ proves $Q_\\diamond(d,\\varepsilon)=O(d^4/\\varepsilon^2)$. Mele and Bittel and, independently, Chen, Yu, and Zhang obtain this upper bound. \\sourcecite{ref:d3e3-mele25}{Mele25}\\sourcecite{ref:d3e3-chen25}{Chen25}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:d3e3-2}.","The dimension dependence at fixed accuracy is settled:\n  \\begin{equation}\nQ_\\diamond(d,\\varepsilon)=\\Theta(d^4)\n  \\qquad\\text{for fixed sufficiently small }\\varepsilon>0.\n\\label{eq:d3e3-3}\n\\end{equation}\n  Theorem IV.25 uses the convention $\\tfrac12\\|\\widehat\\Lambda-\\Lambda\\|_\\diamond\\leq\\varepsilon$; substituting source accuracy $\\varepsilon/2$ to match the full-norm convention above changes only constants. More quantitatively, specializing Theorem IV.25 of Mele and Bittel's third version gives\n  \\begin{equation}\nQ_\\diamond(d,\\varepsilon)\n  =\\Omega\\!\\left(\n  \\frac{d^4}{\\varepsilon^{b_d}}\n  +\\frac{d\\log d}{\\varepsilon^2}\n  \\right),\n  \\qquad\n  b_d:=\\frac{d^2}{2(d^2+1)}.\n\\label{eq:d3e3-4}\n\\end{equation}\n  Constant-confidence amplification transfers their sufficiently-small-failure-probability statement to the success convention used here. This does not establish the product $d^4/\\varepsilon^2$. \\sourcecite{ref:d3e3-mele25}{Mele25}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:d3e3-3}, \\eqref{eq:d3e3-4}.","A separate immediate reduction strengthens the accuracy-dependent obstruction. The preparation channels $\\Lambda_\\sigma(X):=\\operatorname{Tr}(X)\\sigma$, with arbitrary $d$-dimensional states $\\sigma$, are a subfamily. Their diamond distance is $\\|\\sigma-\\tau\\|_1$, so the optimal mixed-state tomography lower bound implies\n  \\begin{equation}\nQ_\\diamond(d,\\varepsilon)=\\Omega(d^2/\\varepsilon^2).\n\\label{eq:d3e3-5}\n\\end{equation}\n  This is a reduction from the state-tomography bound reviewed in Section I.1, not a claim that the paper states this as its strongest general-channel theorem. \\sourcecite{ref:d3e3-mele25}{Mele25}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:d3e3-5}.","Section I.5 of Mele and Bittel explicitly leaves the optimal joint dimension--accuracy dependence open; the known lower bounds do not match the general $O(d^4/\\varepsilon^2)$ upper bound. \\sourcecite{ref:d3e3-mele25}{Mele25}\\sourcecite{ref:d3e3-chen25}{Chen25}"],"references":[{"key":"Mele25","label":"ref:d3e3-mele25","tex":"A. A. Mele and L. Bittel, \"Optimal learning of quantum channels in diamond distance,\" arXiv preprint (2025), version 3, 15 June 2026. \\href{https://arxiv.org/abs/2512.10214}{arXiv:2512.10214}."},{"key":"Chen25","label":"ref:d3e3-chen25","tex":"K. Chen, N. Yu, and Z. Zhang, \"Quantum channel tomography and estimation by local test,\" arXiv preprint (2025), version 2, 2 February 2026. \\href{https://arxiv.org/abs/2512.13614}{arXiv:2512.13614}."}],"comment":"The proposed equality is a concrete unrestricted-rank specialization of the published joint-scaling open problem, not a theorem asserted by the papers' titles. Optimal scaling separately in dimension at constant accuracy and in accuracy at fixed dimension does not prove their multiplicative combination. That uniform two-parameter question remains unresolved.","contributors":[]}}
---
## Source

This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature [Mele25](https://arxiv.org/abs/2512.10214)[Chen25](https://arxiv.org/abs/2512.13614); it is not presented as a verbatim conjecture of those authors.

## Progress

General channels with input dimension $d_{\mathrm{in}}$, output dimension $d_{\mathrm{out}}$, and Kraus rank at most $r$ admit tomography using

$$
O(d_{\mathrm{in}}d_{\mathrm{out}}r/\varepsilon^2)
\tag{2}
$$

queries. Substituting $d_{\mathrm{in}}=d_{\mathrm{out}}=d$ and $r=d^2$ proves $Q_\diamond(d,\varepsilon)=O(d^4/\varepsilon^2)$. Mele and Bittel and, independently, Chen, Yu, and Zhang obtain this upper bound. [Mele25](https://arxiv.org/abs/2512.10214)[Chen25](https://arxiv.org/abs/2512.13614)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (2).

The dimension dependence at fixed accuracy is settled:

$$
Q_\diamond(d,\varepsilon)=\Theta(d^4)
 \qquad\text{for fixed sufficiently small }\varepsilon>0.
\tag{3}
$$

Theorem IV.25 uses the convention $\tfrac12\|\widehat\Lambda-\Lambda\|_\diamond\leq\varepsilon$; substituting source accuracy $\varepsilon/2$ to match the full-norm convention above changes only constants. More quantitatively, specializing Theorem IV.25 of Mele and Bittel’s third version gives

$$
Q_\diamond(d,\varepsilon)
 =\Omega\!\left(
 \frac{d^4}{\varepsilon^{b_d}}
 +\frac{d\log d}{\varepsilon^2}
 \right),
 \qquad
 b_d:=\frac{d^2}{2(d^2+1)}.
\tag{4}
$$

Constant-confidence amplification transfers their sufficiently-small-failure-probability statement to the success convention used here. This does not establish the product $d^4/\varepsilon^2$. [Mele25](https://arxiv.org/abs/2512.10214)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (3), (4).

A separate immediate reduction strengthens the accuracy-dependent obstruction. The preparation channels $\Lambda_\sigma(X):=\operatorname{Tr}(X)\sigma$, with arbitrary $d$-dimensional states $\sigma$, are a subfamily. Their diamond distance is $\|\sigma-\tau\|_1$, so the optimal mixed-state tomography lower bound implies

$$
Q_\diamond(d,\varepsilon)=\Omega(d^2/\varepsilon^2).
\tag{5}
$$

This is a reduction from the state-tomography bound reviewed in Section I.1, not a claim that the paper states this as its strongest general-channel theorem. [Mele25](https://arxiv.org/abs/2512.10214)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (5).

Section I.5 of Mele and Bittel explicitly leaves the optimal joint dimension–accuracy dependence open; the known lower bounds do not match the general $O(d^4/\varepsilon^2)$ upper bound. [Mele25](https://arxiv.org/abs/2512.10214)[Chen25](https://arxiv.org/abs/2512.13614)

## Comment

The proposed equality is a concrete unrestricted-rank specialization of the published joint-scaling open problem, not a theorem asserted by the papers’ titles. Optimal scaling separately in dimension at constant accuracy and in accuracy at fixed dimension does not prove their multiplicative combination. That uniform two-parameter question remains unresolved.

## References

**Mele25** A. A. Mele and L. Bittel, "Optimal learning of quantum channels in diamond distance," arXiv preprint (2025), version 3, 15 June 2026. [arXiv:2512.10214](https://arxiv.org/abs/2512.10214).

**Chen25** K. Chen, N. Yu, and Z. Zhang, "Quantum channel tomography and estimation by local test," arXiv preprint (2025), version 2, 2 February 2026. [arXiv:2512.13614](https://arxiv.org/abs/2512.13614).
