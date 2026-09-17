---
id: "01M2M9FC6H8290J9PJ3S9MH1SW"
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
topicIds: ["quantum-estimation","gaussian-quantum-information","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Optimal single-copy tomography of fermionic Gaussian states"
aliases: ["op-91c81ca77b99eebf","op_91c81ca77b99eebf","01M2M9FC6H8290J9PJ3S9MH1SW"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_91c81ca77b99eebf.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_91c81ca77b99eebf","ulid":"01M2M9FC6H8290J9PJ3S9MH1SW","aliases":["op_91c81ca77b99eebf","01M2M9FC6H8290J9PJ3S9MH1SW","op-91c81ca77b99eebf"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.625Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["quantum-estimation","gaussian-quantum-information","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Optimal single-copy tomography of fermionic Gaussian states","status":"Unsolved","fields":["Quantum metrology"],"topics":["Quantum estimation","Gaussian quantum information","One-shot and finite-blocklength bounds"],"statement":"Can arbitrary mixed fermionic Gaussian states be learned to trace distance $\\varepsilon$ from $\\Theta(m^2/\\varepsilon^2)$ copies using no measurements across copies?\n\nConsider $m\\geq2$ fermionic modes with Majorana operators $c_1,\\ldots,c_{2m}$ satisfying $c_ac_b+c_bc_a=2\\delta_{ab}I$, where $\\delta_{ab}$ is the Kronecker delta. Let $\\mathcal G_m$ be the fermionic Gaussian states, namely the states\n\n\\begin{equation}\n\\rho=\\frac{e^{-K}}{\\operatorname{Tr}(e^{-K})},\n\\qquad\nK:=\\frac{i}{4}\\sum_{a,b=1}^{2m}A_{ab}c_ac_b,\n\\qquad A\\in\\mathbb R^{2m\\times2m},\\quad A^T=-A,\n\\label{eq:91c8-1}\n\\end{equation}\n\ntogether with their limiting states, including pure Gaussian states. For $0<\\varepsilon<1/10$, let $N_1(m,\\varepsilon)$ be the minimum worst-case copy count for outputting a classical description of $\\widehat\\rho\\in\\mathcal G_m$ such that\n\n\\begin{equation}\n\\Pr\\!\\left[D_{\\mathrm{tr}}(\\rho,\\widehat\\rho)\\leq\\varepsilon\\right]\\geq\\frac23,\n\\qquad\nD_{\\mathrm{tr}}(\\rho,\\sigma):=\\frac12\\|\\rho-\\sigma\\|_1.\n\\label{eq:91c8-2}\n\\end{equation}\n\nEach measurement may act on all modes of one copy and an ancilla. Measurements may adapt to previous classical outcomes, but quantum memory cannot connect different copies. The measurements need not be fermionic Gaussian, and computational efficiency is not imposed.\n\nIs $N_1(m,\\varepsilon)=\\Theta(m^2/\\varepsilon^2)$ for this general mixed-state family?\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:91c8-1}, \\eqref{eq:91c8-2}.","source":"This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature \\sourcecite{ref:91c8-bittel25}{Bittel25}\\sourcecite{ref:91c8-chen26}{Chen26}; it is not presented as a verbatim conjecture of those authors.","progress":["Bittel, Mele, Eisert, and Leone give an efficient single-copy covariance-learning protocol with\n  \\begin{equation}\nN_1(m,\\varepsilon)\n  =O\\!\\left(\\frac{m^4\\log m}{\\varepsilon^2}\\right)\n\\label{eq:91c8-3}\n\\end{equation}\n  at constant success probability. Their mixed-state guarantee, rather than their stronger pure-state guarantee, is the applicable upper bound here. See Theorems 5 and 21 of the arXiv version. \\sourcecite{ref:91c8-bittel25}{Bittel25}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:91c8-3}.","The July 2026 result of Chen and coauthors settles the unrestricted problem. If arbitrary collective measurements are allowed, its optimal copy count is\n  \\begin{equation}\nN_{\\mathrm{coll}}(m,\\varepsilon,\\delta)\n  =\\Theta\\!\\left(\\frac{m^2+\\log(1/\\delta)}{\\varepsilon^2}\\right),\n\\label{eq:91c8-4}\n\\end{equation}\n  where $\\delta$ is the failure probability. The lower bound already holds for pure Gaussian states, and therefore implies $N_1(m,\\varepsilon)=\\Omega(m^2/\\varepsilon^2)$. The upper construction uses operations across copies. \\sourcecite{ref:91c8-chen26}{Chen26}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:91c8-4}.","Chen et al. explicitly leave the necessity of entangled measurements open in Section 6. Together, the established bounds for the stated model leave\n  \\begin{equation}\n\\Omega(m^2/\\varepsilon^2)\n  \\leq N_1(m,\\varepsilon)\n  \\leq O(m^4\\log m/\\varepsilon^2).\n\\label{eq:91c8-5}\n\\end{equation}\n  The unrestricted Gaussian-state tomography problem should not itself be retained as open. \\sourcecite{ref:91c8-bittel25}{Bittel25}\\sourcecite{ref:91c8-chen26}{Chen26}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:91c8-5}."],"references":[{"key":"Bittel25","label":"ref:91c8-bittel25","tex":"L. Bittel, A. A. Mele, J. Eisert, and L. Leone, \"Optimal trace-distance bounds for free-fermionic states: Testing and improved tomography,\" \\emph{PRX Quantum} 6, 030341 (2025). \\href{https://doi.org/10.1103/pzx6-nkfb}{doi:10.1103/pzx6-nkfb}; \\href{https://arxiv.org/abs/2409.17953}{arXiv:2409.17953}."},{"key":"Chen26","label":"ref:91c8-chen26","tex":"S. Chen, M. Fanizza, F. Girardi, L. Lami, F. A. Mele, M. Walter, and F. Witteveen, \"Optimal tomography of bosonic and fermionic Gaussian states,\" arXiv preprint (2026), version 1, 13 July 2026. \\href{https://arxiv.org/abs/2607.11847}{arXiv:2607.11847}."}],"comment":"The unresolved issue is whether prohibiting measurements across copies increases the optimal sample complexity for mixed fermionic Gaussian states. Restricting each measurement to Gaussian operations would be a different, stronger restriction, and is not assumed here. The collective algorithm establishes achievability only after removing the single-copy constraint.","contributors":[]}}
---
## Source

This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature [Bittel25](https://doi.org/10.1103/pzx6-nkfb)[Chen26](https://arxiv.org/abs/2607.11847); it is not presented as a verbatim conjecture of those authors.

## Progress

Bittel, Mele, Eisert, and Leone give an efficient single-copy covariance-learning protocol with

$$
N_1(m,\varepsilon)
 =O\!\left(\frac{m^4\log m}{\varepsilon^2}\right)
\tag{3}
$$

at constant success probability. Their mixed-state guarantee, rather than their stronger pure-state guarantee, is the applicable upper bound here. See Theorems 5 and 21 of the arXiv version. [Bittel25](https://doi.org/10.1103/pzx6-nkfb)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (3).

The July 2026 result of Chen and coauthors settles the unrestricted problem. If arbitrary collective measurements are allowed, its optimal copy count is

$$
N_{\mathrm{coll}}(m,\varepsilon,\delta)
 =\Theta\!\left(\frac{m^2+\log(1/\delta)}{\varepsilon^2}\right),
\tag{4}
$$

where $\delta$ is the failure probability. The lower bound already holds for pure Gaussian states, and therefore implies $N_1(m,\varepsilon)=\Omega(m^2/\varepsilon^2)$. The upper construction uses operations across copies. [Chen26](https://arxiv.org/abs/2607.11847)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (4).

Chen et al. explicitly leave the necessity of entangled measurements open in Section 6. Together, the established bounds for the stated model leave

$$
\Omega(m^2/\varepsilon^2)
 \leq N_1(m,\varepsilon)
 \leq O(m^4\log m/\varepsilon^2).
\tag{5}
$$

The unrestricted Gaussian-state tomography problem should not itself be retained as open. [Bittel25](https://doi.org/10.1103/pzx6-nkfb)[Chen26](https://arxiv.org/abs/2607.11847)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (5).

## Comment

The unresolved issue is whether prohibiting measurements across copies increases the optimal sample complexity for mixed fermionic Gaussian states. Restricting each measurement to Gaussian operations would be a different, stronger restriction, and is not assumed here. The collective algorithm establishes achievability only after removing the single-copy constraint.

## References

**Bittel25** L. Bittel, A. A. Mele, J. Eisert, and L. Leone, "Optimal trace-distance bounds for free-fermionic states: Testing and improved tomography," *PRX Quantum* 6, 030341 (2025). [doi:10.1103/pzx6-nkfb](https://doi.org/10.1103/pzx6-nkfb); [arXiv:2409.17953](https://arxiv.org/abs/2409.17953).

**Chen26** S. Chen, M. Fanizza, F. Girardi, L. Lami, F. A. Mele, M. Walter, and F. Witteveen, "Optimal tomography of bosonic and fermionic Gaussian states," arXiv preprint (2026), version 1, 13 July 2026. [arXiv:2607.11847](https://arxiv.org/abs/2607.11847).
