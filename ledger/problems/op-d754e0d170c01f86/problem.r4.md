---
id: "01M1Q787QR780435R6682GE26Y"
type: "Problem"
schemaVersion: "1.0"
revision: 4
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-17T05:02:42.828Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["quantum-relative-entropy","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Diamond-smoothed max-relative-entropy AEP for quantum channels"
aliases: ["op-d754e0d170c01f86","op_d754e0d170c01f86","01M1Q787QR780435R6682GE26Y"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_d754e0d170c01f86.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_d754e0d170c01f86","ulid":"01M1Q787QR780435R6682GE26Y","aliases":["op_d754e0d170c01f86","01M1Q787QR780435R6682GE26Y","op-d754e0d170c01f86"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-relative-entropy","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Diamond-smoothed max-relative-entropy AEP for quantum channels","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum relative entropy","One-shot and finite-blocklength bounds"],"statement":"Does the max-relative entropy of finite-dimensional quantum channels satisfy an\nasymptotic equipartition property under uniform diamond-norm smoothing?  Let\n$\\mathcal N,\\mathcal M:\\mathcal L(A)\\to\\mathcal L(B)$ be quantum channels\nwith $D_{\\max}(\\mathcal N\\|\\mathcal M)<\\infty$.  Using unnormalized Choi\noperators, define the channel max-relative entropy and its smoothed version by\n\\begin{equation}\n  \\begin{aligned}\n  D_{\\max}(\\mathcal N\\|\\mathcal M)\n    &:=\\inf\\{\\lambda:J_{\\mathcal N}\\leq2^\\lambda J_{\\mathcal M}\\},\\\\\n  D_{\\max}^{\\varepsilon}(\\mathcal N\\|\\mathcal M)\n    &:=\\inf_{\\substack{\\widetilde{\\mathcal N}\\ {\\rm CPTP}:\\\\\n              \\frac12\\|\\widetilde{\\mathcal N}-\\mathcal N\\|_\\diamond\n              \\leq\\varepsilon}}\n       D_{\\max}(\\widetilde{\\mathcal N}\\|\\mathcal M).\n  \\end{aligned}\n  \\label{eq:p65-smooth-channel-max}\n\\end{equation}\nThe smoothing in Eq.~\\eqref{eq:p65-smooth-channel-max} requires one channel\n$\\widetilde{\\mathcal N}$ that approximates $\\mathcal N$ uniformly over all\nancilla-assisted inputs.  Define\n\\begin{equation}\n  \\begin{aligned}\n  D_{\\max}^{\\varepsilon,\\infty}(\\mathcal N\\|\\mathcal M)\n    &:=\\limsup_{n\\to\\infty}\\frac1n\n       D_{\\max}^{\\varepsilon}\n       (\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n}),\\\\\n  D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)\n    &:=\\lim_{n\\to\\infty}\\frac1n\n      \\sup_{\\psi_{R A^n}}\n      D\\!\\left((\\operatorname{id}_R\\otimes\\mathcal N^{\\otimes n})(\\psi)\n      \\middle\\|\n      (\\operatorname{id}_R\\otimes\\mathcal M^{\\otimes n})(\\psi)\\right),\n  \\end{aligned}\n  \\label{eq:p65-regularized-divergences}\n\\end{equation}\nwhere $R\\simeq A^{\\otimes n}$ suffices and $D$ is quantum relative entropy.\nIs the following identity valid for every such channel pair, and can the\n$\\limsup$ in Eq.~\\eqref{eq:p65-regularized-divergences} be replaced by a\nlimit?\n\\begin{equation}\n  \\sup_{\\varepsilon>0}\n  D_{\\max}^{\\varepsilon,\\infty}(\\mathcal N\\|\\mathcal M)\n  =D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M).\n  \\label{eq:p65-channel-aep}\n\\end{equation}","source":"Winter first proposed the identity in Eq.~\\eqref{eq:p65-channel-aep}; Liu and\nWinter discussed it formally in the setting of channel-resource erasure\n\\sourcecite{ref:p65-liu-winter}{LW19}.  Hirche restated it explicitly as the\ntechnical conjecture needed in quantum-network discrimination\n\\sourcecite{ref:p65-hirche}{Hir23}.","progress":["Gour and Winter proved asymptotic equipartition statements for two\n  channel-resource divergences using a more permissive ``liberal'' smoothing.\n  That smoothing does not require the single uniformly diamond-close channel\n  in Eq.~\\eqref{eq:p65-smooth-channel-max}, so it does not establish\n  Eq.~\\eqref{eq:p65-channel-aep}\n  \\sourcecite{ref:p65-gour-winter}{GW19}.","Hirche proved the general bounds\n  \\begin{equation}\n    D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)\n    \\leq D_{\\max}^{\\varepsilon,\\infty}(\\mathcal N\\|\\mathcal M)\n    \\leq D_{\\max}(\\mathcal N\\|\\mathcal M),\n    \\label{eq:p65-known-bounds}\n  \\end{equation}\n  The bounds in Eq.~\\eqref{eq:p65-known-bounds} do not identify the\n  asymptotic rate.  Hirche also showed that Eq.~\\eqref{eq:p65-channel-aep}\n  would collapse the amortized\n  Umegaki relative entropy of superchannels to their regularized relative\n  entropy \\sourcecite{ref:p65-hirche}{Hir23}.","Fang, Gour, and Wang related an analogous AEP for unstabilized channel\n  divergences without quantum-memory assistance to strong converses for\n  channel discrimination.  Their latest formulation leaves that general\n  strong-converse problem unresolved and does not prove the stabilized,\n  diamond-smoothed identity in Eq.~\\eqref{eq:p65-channel-aep}\n  \\sourcecite{ref:p65-fang-gour-wang}{FGW25}.","Gour gives a counterexample in Theorems 11 and 15 of a 2026 preprint\n  \\sourcecite{ref:p65-gour-aep}{Gou26}.  For\n  $0<t<(\\sqrt5-2)^2$ and $0<\\theta<2\\arcsin(1/8)$, set\n  \\begin{equation}\n    \\begin{aligned}\n      \\mathcal N&=\\operatorname{id}_3,\\qquad\n      \\mathcal M=t\\operatorname{id}_3+(1-t)\\mathcal U,\\\\\n      \\mathcal U(X)&=UXU^\\dagger,\\qquad\n      U=\\operatorname{diag}(1,e^{i\\theta},e^{-i\\theta}).\n    \\end{aligned}\n    \\label{eq:p65-qutrit-counterexample}\n  \\end{equation}\n  The channels in Eq.~\\eqref{eq:p65-qutrit-counterexample} have finite\n  $D_{\\max}$.  For every fixed $0<\\varepsilon<\\sin^2\\theta$,\n  \\begin{equation}\n    \\begin{aligned}\n      \\lim_{n\\to\\infty}\\frac1nD_{\\max}^{\\varepsilon}\n        (\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n})\n        &=\\log_2(1/t),\\\\\n      D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)\n        &\\leq\\tfrac12\\log_2(1/t)+\\log_2\\frac4{1-t}\n        <\\log_2(1/t).\n    \\end{aligned}\n    \\label{eq:p65-aep-separation}\n  \\end{equation}\n  Monotonicity and the unsmoothed upper bound make the supremum in\n  Eq.~\\eqref{eq:p65-channel-aep} equal to $\\log_2(1/t)$.\n  Equation~\\eqref{eq:p65-aep-separation} therefore refutes the proposed\n  identity, including its vanishing-error version (Section VII, Eqs.~(232)--(234))."],"references":[{"key":"LW19","label":"ref:p65-liu-winter","tex":"Z.-W. Liu and A. Winter,\n  ``Resource Theories of Quantum Channels and the Universal Role of Resource\n  Erasure,'' arXiv preprint (2019).\n  \\href{https://arxiv.org/abs/1904.04201}{arXiv:1904.04201}."},{"key":"GW19","label":"ref:p65-gour-winter","tex":"G. Gour and A. Winter, ``How to Quantify a Dynamical Quantum Resource,''\n  \\emph{Physical Review Letters} \\textbf{123}, 150401 (2019).\n  \\href{https://doi.org/10.1103/PhysRevLett.123.150401}{doi:10.1103/PhysRevLett.123.150401};\n  \\href{https://arxiv.org/abs/1906.03517}{arXiv:1906.03517}."},{"key":"Hir23","label":"ref:p65-hirche","tex":"C. Hirche, ``Quantum Network Discrimination,''\n  \\emph{Quantum} \\textbf{7}, 1064 (2023).\n  \\href{https://doi.org/10.22331/q-2023-07-25-1064}{doi:10.22331/q-2023-07-25-1064};\n  \\href{https://arxiv.org/abs/2103.02404}{arXiv:2103.02404}."},{"key":"FGW25","label":"ref:p65-fang-gour-wang","tex":"K. Fang, G. Gour, and X. Wang,\n  ``Towards the Ultimate Limits of Quantum Channel Discrimination and Quantum\n  Communication,'' \\emph{Science China Information Sciences} \\textbf{68},\n  180509 (2025).\n  \\href{https://doi.org/10.1007/s11432-024-4488-0}{doi:10.1007/s11432-024-4488-0};\n  \\href{https://arxiv.org/abs/2110.14842}{arXiv:2110.14842}."},{"key":"Gou26","label":"ref:p65-gour-aep","tex":"G. Gour, ``Failure of the Asymptotic Equipartition Property for Quantum\n  Channels,'' arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2609.15004v1}{arXiv:2609.15004v1}."}],"comment":"The universal identity in Eq.~\\eqref{eq:p65-channel-aep} is false by\nGour's preprint \\sourcecite{ref:p65-gour-aep}{Gou26}.  The limit exists for\nthis counterexample family; the separate question of its existence for\narbitrary channel pairs is not settled by this result.  The record therefore\nremains Unsolved while both requests are retained in the statement.  The\ncounterexample also does not decide\n\\href{https://qiqc-op.com/problem/op_08387c140f552732/}{the fixed-error parallel channel Stein problem}\nor the conditional equality in\n\\href{https://qiqc-op.com/problem/op_a4600b38b94042a8/}{the parallel versus nested-adaptive superchannel-discrimination problem}."}}
---
## Source

Winter first proposed the identity in Eq. (3); Liu and Winter discussed it formally in the setting of channel-resource erasure [LW19](https://arxiv.org/abs/1904.04201). Hirche restated it explicitly as the technical conjecture needed in quantum-network discrimination [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

## Progress

Gour and Winter proved asymptotic equipartition statements for two channel-resource divergences using a more permissive “liberal” smoothing. That smoothing does not require the single uniformly diamond-close channel in Eq. (1), so it does not establish Eq. (3) [GW19](https://doi.org/10.1103/PhysRevLett.123.150401).

Hirche proved the general bounds

$$
D_{\rm ch}^{\infty}(\mathcal N\|\mathcal M)
 \leq D_{\max}^{\varepsilon,\infty}(\mathcal N\|\mathcal M)
 \leq D_{\max}(\mathcal N\|\mathcal M),
 \tag{4}
$$

The bounds in Eq. (4) do not identify the asymptotic rate. Hirche also showed that Eq. (3) would collapse the amortized Umegaki relative entropy of superchannels to their regularized relative entropy [Hir23](https://doi.org/10.22331/q-2023-07-25-1064).

Fang, Gour, and Wang related an analogous AEP for unstabilized channel divergences without quantum-memory assistance to strong converses for channel discrimination. Their latest formulation leaves that general strong-converse problem unresolved and does not prove the stabilized, diamond-smoothed identity in Eq. (3) [FGW25](https://doi.org/10.1007/s11432-024-4488-0).

Gour gives a counterexample in Theorems 11 and 15 of a 2026 preprint [Gou26](https://arxiv.org/abs/2609.15004v1). For $0<t<(\sqrt5-2)^2$ and $0<\theta<2\arcsin(1/8)$, set

$$
\begin{aligned}
 \mathcal N&=\operatorname{id}_3,\qquad
 \mathcal M=t\operatorname{id}_3+(1-t)\mathcal U,\\
 \mathcal U(X)&=UXU^\dagger,\qquad
 U=\operatorname{diag}(1,e^{i\theta},e^{-i\theta}).
 \end{aligned}
 \tag{5}
$$

The channels in Eq. (5) have finite $D_{\max}$. For every fixed $0<\varepsilon<\sin^2\theta$,

$$
\begin{aligned}
 \lim_{n\to\infty}\frac1nD_{\max}^{\varepsilon}
 (\mathcal N^{\otimes n}\|\mathcal M^{\otimes n})
 &=\log_2(1/t),\\
 D_{\rm ch}^{\infty}(\mathcal N\|\mathcal M)
 &\leq\tfrac12\log_2(1/t)+\log_2\frac4{1-t}
 <\log_2(1/t).
 \end{aligned}
 \tag{6}
$$

Monotonicity and the unsmoothed upper bound make the supremum in Eq. (3) equal to $\log_2(1/t)$. Equation (6) therefore refutes the proposed identity, including its vanishing-error version (Section VII, Eqs. (232)–(234)).

## Comment

The universal identity in Eq. (3) is false by Gour’s preprint [Gou26](https://arxiv.org/abs/2609.15004v1). The limit exists for this counterexample family; the separate question of its existence for arbitrary channel pairs is not settled by this result. The record therefore remains Unsolved while both requests are retained in the statement. The counterexample also does not decide [the fixed-error parallel channel Stein problem](https://qiqc-op.com/problem/op_08387c140f552732/) or the conditional equality in [the parallel versus nested-adaptive superchannel-discrimination problem](https://qiqc-op.com/problem/op_a4600b38b94042a8/).

## References

**LW19** Z.-W. Liu and A. Winter, “Resource Theories of Quantum Channels and the Universal Role of Resource Erasure,” arXiv preprint (2019). [arXiv:1904.04201](https://arxiv.org/abs/1904.04201).

**GW19** G. Gour and A. Winter, “How to Quantify a Dynamical Quantum Resource,” *Physical Review Letters* **123**, 150401 (2019). [doi:10.1103/PhysRevLett.123.150401](https://doi.org/10.1103/PhysRevLett.123.150401); [arXiv:1906.03517](https://arxiv.org/abs/1906.03517).

**Hir23** C. Hirche, “Quantum Network Discrimination,” *Quantum* **7**, 1064 (2023). [doi:10.22331/q-2023-07-25-1064](https://doi.org/10.22331/q-2023-07-25-1064); [arXiv:2103.02404](https://arxiv.org/abs/2103.02404).

**FGW25** K. Fang, G. Gour, and X. Wang, “Towards the Ultimate Limits of Quantum Channel Discrimination and Quantum Communication,” *Science China Information Sciences* **68**, 180509 (2025). [doi:10.1007/s11432-024-4488-0](https://doi.org/10.1007/s11432-024-4488-0); [arXiv:2110.14842](https://arxiv.org/abs/2110.14842).

**Gou26** G. Gour, “Failure of the Asymptotic Equipartition Property for Quantum Channels,” arXiv preprint (2026). [arXiv:2609.15004v1](https://arxiv.org/abs/2609.15004v1).
