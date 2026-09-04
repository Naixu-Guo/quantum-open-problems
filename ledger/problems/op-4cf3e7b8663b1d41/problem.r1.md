---
id: "01M1HME78004TME758T7JBWF1D"
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
areaIds: ["entanglement-theory"]
topicIds: ["bell-diagonal-states","rains-bound","ppt-preserving-operations","entanglement-distillation","semidefinite-programming"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Achievability of the Rains bound under PPT-preserving channels"
aliases: ["op-4cf3e7b8663b1d41","op_4cf3e7b8663b1d41","01M1HME78004TME758T7JBWF1D","v2-achievability-of-the-rains-bound-under-ppt-preserving-channels","open-problem-v2-problem-4"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_4cf3e7b8663b1d41.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_4cf3e7b8663b1d41","ulid":"01M1HME78004TME758T7JBWF1D","aliases":["op_4cf3e7b8663b1d41","01M1HME78004TME758T7JBWF1D","op-4cf3e7b8663b1d41","v2-achievability-of-the-rains-bound-under-ppt-preserving-channels","open-problem-v2-problem-4"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["bell-diagonal-states","rains-bound","ppt-preserving-operations","entanglement-distillation","semidefinite-programming"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Achievability of the Rains bound under PPT-preserving channels","status":"Unsolved","fields":["Entanglement theory"],"topics":["Bell-diagonal states","Rains bound","PPT-preserving operations","Entanglement distillation","Semidefinite programming"],"statement":"Consider distilling the bipartite Bell-diagonal state\n\\begin{equation}\n  \\rho_{\\mathbf p}\n  =p_I\\lvert\\Phi^+\\rangle\\!\\langle\\Phi^+\\rvert\n  +p_X\\lvert\\Psi^+\\rangle\\!\\langle\\Psi^+\\rvert\n  +p_Y\\lvert\\Psi^-\\rangle\\!\\langle\\Psi^-\\rvert\n  +p_Z\\lvert\\Phi^-\\rangle\\!\\langle\\Phi^-\\rvert,\n  \\label{eq:p4-bell-diagonal-state}\n\\end{equation}\nwhere $p_i>0$ and $p_I+p_X+p_Y+p_Z=1$, and\n$\\lvert\\Phi^\\pm\\rangle:=(\\lvert00\\rangle\\pm\\lvert11\\rangle)/\\sqrt2$ and\n$\\lvert\\Psi^\\pm\\rangle:=(\\lvert01\\rangle\\pm\\lvert10\\rangle)/\\sqrt2$.\nIs the Rains bound of the state in Eq.~\\eqref{eq:p4-bell-diagonal-state}\nachievable by a positive-partial-transpose-state-preserving\n(PPT-state-preserving, or PPT-preserving) quantum channel?  If so, what is the\nconstructive quantum channel?  A channel is PPT-state-preserving if every PPT\ninput state is mapped to a PPT output state.","source":"Rains introduced the PPT-preserving distillation framework and its\nsemidefinite-programming bound; the present Bell-diagonal achievability\nquestion is an implicit specialization of that work\n\\sourcecite{ref:p4-rains-1999}{Rai99},\n\\sourcecite{ref:p4-rains-2001}{Rai01}.","progress":["Rains showed that the Rains bound $R(\\rho_{\\mathbf p})$ upper-bounds\n  the entanglement distillable from $\\rho_{\\mathbf p}$ by PPT-preserving\n  operations:\n  \\begin{equation}\n    D_{\\mathrm{PPT}}(\\rho_{\\mathbf p})\\le R(\\rho_{\\mathbf p}).\n    \\label{eq:p4-rains-upper-bound}\n  \\end{equation}\n  Equation~\\eqref{eq:p4-rains-upper-bound} is the relevant converse bound for\n  the operational class in this problem\n  \\sourcecite{ref:p4-rains-1999}{Rai99},\n  \\sourcecite{ref:p4-rains-2001}{Rai01}."],"references":[{"key":"Rai99","label":"ref:p4-rains-1999","tex":"E. M. Rains, ``An Improved Bound on Distillable Entanglement,''\n  \\emph{Physical Review A} \\textbf{60}, 179--184 (1999).\n  \\newline\n  \\href{https://doi.org/10.1103/PhysRevA.60.179}{doi:10.1103/PhysRevA.60.179};\n  \\href{https://arxiv.org/abs/quant-ph/9809082}{arXiv:quant-ph/9809082}."},{"key":"Rai01","label":"ref:p4-rains-2001","tex":"E. M. Rains, ``A Semidefinite Program for Distillable Entanglement,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{47}, 2921--2933\n  (2001). \\href{https://doi.org/10.1109/18.959270}{doi:10.1109/18.959270};\n  \\href{https://arxiv.org/abs/quant-ph/0008047}{arXiv:quant-ph/0008047}."}],"comment":"The problem asks whether the upper bound in\nEq.~\\eqref{eq:p4-rains-upper-bound} is achievable for the Bell-diagonal family\nin Eq.~\\eqref{eq:p4-bell-diagonal-state}, and, if so, for an explicit\nconstruction of a PPT-preserving channel attaining it."}}
---
## Source

Rains introduced the PPT-preserving distillation framework and its semidefinite-programming bound; the present Bell-diagonal achievability question is an implicit specialization of that work [Rai99](https://doi.org/10.1103/PhysRevA.60.179), [Rai01](https://doi.org/10.1109/18.959270).

## Progress

Rains showed that the Rains bound $R(\rho_{\mathbf p})$ upper-bounds the entanglement distillable from $\rho_{\mathbf p}$ by PPT-preserving operations:

$$
D_{\mathrm{PPT}}(\rho_{\mathbf p})\le R(\rho_{\mathbf p}).
 \tag{2}
$$

Equation (2) is the relevant converse bound for the operational class in this problem [Rai99](https://doi.org/10.1103/PhysRevA.60.179), [Rai01](https://doi.org/10.1109/18.959270).

## Comment

The problem asks whether the upper bound in Eq. (2) is achievable for the Bell-diagonal family in Eq. (1), and, if so, for an explicit construction of a PPT-preserving channel attaining it.

## References

**Rai99** E. M. Rains, “An Improved Bound on Distillable Entanglement,” *Physical Review A* **60**, 179–184 (1999).
 [doi:10.1103/PhysRevA.60.179](https://doi.org/10.1103/PhysRevA.60.179); [arXiv:quant-ph/9809082](https://arxiv.org/abs/quant-ph/9809082).

**Rai01** E. M. Rains, “A Semidefinite Program for Distillable Entanglement,” *IEEE Transactions on Information Theory* **47**, 2921–2933 (2001). [doi:10.1109/18.959270](https://doi.org/10.1109/18.959270); [arXiv:quant-ph/0008047](https://arxiv.org/abs/quant-ph/0008047).
