---
id: "01M1HME780J76RC69YY1FTM06V"
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
topicIds: ["amplitude-damping-channels","choi-states","entanglement-cost","local-operations-and-classical-communication","qubit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Entanglement cost of an amplitude-damping-channel Choi state"
aliases: ["op-7a9051ff6d0a1739","op_7a9051ff6d0a1739","01M1HME780J76RC69YY1FTM06V","v2-entanglement-cost-of-an-amplitude-damping-channel-choi-state","open-problem-v2-problem-8"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_7a9051ff6d0a1739.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_7a9051ff6d0a1739","ulid":"01M1HME780J76RC69YY1FTM06V","aliases":["op_7a9051ff6d0a1739","01M1HME780J76RC69YY1FTM06V","op-7a9051ff6d0a1739","v2-entanglement-cost-of-an-amplitude-damping-channel-choi-state","open-problem-v2-problem-8"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["amplitude-damping-channels","choi-states","entanglement-cost","local-operations-and-classical-communication","qubit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Entanglement cost of an amplitude-damping-channel Choi state","status":"Unsolved","fields":["Entanglement theory"],"topics":["Amplitude-damping channels","Choi states","Entanglement cost","Local operations and classical communication","Qubit systems"],"statement":"What is the entanglement cost of the Choi state of the qubit\namplitude-damping channel\n\\begin{equation}\n  \\mathcal A_p(\\rho)=A_0\\rho A_0^\\dagger+A_1\\rho A_1^\\dagger,\n  \\qquad 0\\le p\\le1?\n  \\label{eq:p8-amplitude-damping}\n\\end{equation}\nThe Kraus operators in Eq.~\\eqref{eq:p8-amplitude-damping} are\n\\begin{equation}\n  \\begin{aligned}\n    A_0&=\\lvert0\\rangle\\!\\langle0\\rvert\n         +\\sqrt{1-p}\\,\\lvert1\\rangle\\!\\langle1\\rvert\n       =\\begin{pmatrix}1&0\\\\0&\\sqrt{1-p}\\end{pmatrix},\\\\\n    A_1&=\\sqrt p\\,\\lvert0\\rangle\\!\\langle1\\rvert\n       =\\begin{pmatrix}0&\\sqrt p\\\\0&0\\end{pmatrix}.\n  \\end{aligned}\n  \\label{eq:p8-kraus-operators}\n\\end{equation}\nIn Eq.~\\eqref{eq:p8-kraus-operators}, $p$ is the decay probability of the\nexcited state.  Let\n$\\lvert\\Phi^+\\rangle_{RA}=(\\lvert00\\rangle+\\lvert11\\rangle)/\\sqrt2$.\nThe normalized Choi state of the channel in\nEq.~\\eqref{eq:p8-amplitude-damping} is\n\\begin{equation}\n  \\begin{aligned}\n    \\omega_p^{RB}\n      &:=(\\operatorname{id}_R\\otimes\\mathcal A_p)\n          (\\lvert\\Phi^+\\rangle\\!\\langle\\Phi^+\\rvert_{RA})\\\\\n      &=\\frac12\\Bigl[\n          \\lvert00\\rangle\\!\\langle00\\rvert\n          +\\sqrt{1-p}\\bigl(\\lvert00\\rangle\\!\\langle11\\rvert\n                           +\\lvert11\\rangle\\!\\langle00\\rvert\\bigr)\n          +(1-p)\\lvert11\\rangle\\!\\langle11\\rvert\n          +p\\lvert10\\rangle\\!\\langle10\\rvert\n        \\Bigr].\n  \\end{aligned}\n  \\label{eq:p8-choi-state}\n\\end{equation}\nHere the first and second entries in each ket in\nEq.~\\eqref{eq:p8-choi-state} label $R$ and $B$, respectively.  Thus the\nquestion is to determine $E_C(\\omega_p)$, the asymptotic number of ebits per\ncopy required to prepare many copies of $\\omega_p$ by local operations and\nclassical communication.","source":"The question is implicit in the identity between entanglement cost and\nregularized entanglement of formation, together with Wootters' single-copy\nformula applied to this Choi state\n\\sourcecite{ref:p8-hayden-horodecki-terhal}{HHT01},\n\\sourcecite{ref:p8-wootters}{Woo98}.","progress":["Wootters' two-qubit formula, together with the concurrence of\n  $\\omega_p$, gives the exact single-copy entanglement of formation\n  \\begin{equation}\n    C(\\omega_p)=\\sqrt{1-p},\n    \\qquad\n    E_F(\\omega_p)=h_2\\!\\left(\\frac{1+\\sqrt p}{2}\\right),\n    \\label{eq:p8-entanglement-of-formation}\n  \\end{equation}\n  where $h_2(x):=-x\\log_2x-(1-x)\\log_2(1-x)$, with $0\\log_2 0:=0$,\n  \\sourcecite{ref:p8-wootters}{Woo98}.  Equation~\n  \\eqref{eq:p8-entanglement-of-formation} determines one copy exactly, but it\n  does not by itself determine the asymptotic entanglement cost.","The entanglement cost equals the regularized entanglement of formation\n  \\begin{equation}\n    E_C(\\omega_p)\n      =\\lim_{n\\to\\infty}\\frac1n E_F(\\omega_p^{\\otimes n})\n      \\le E_F(\\omega_p)\n      =h_2\\!\\left(\\frac{1+\\sqrt p}{2}\\right)\n    \\label{eq:p8-regularized-entanglement-of-formation}\n  \\end{equation}\n  \\sourcecite{ref:p8-hayden-horodecki-terhal}{HHT01}.  Consequently,\n  Eq.~\\eqref{eq:p8-regularized-entanglement-of-formation} reduces the problem\n  to evaluating the regularization for this particular family of Choi\n  states."],"references":[{"key":"Woo98","label":"ref:p8-wootters","tex":"W. K. Wootters,\n  ``Entanglement of Formation of an Arbitrary State of Two Qubits,''\n  \\emph{Physical Review Letters} \\textbf{80}, 2245--2248 (1998).\n  \\href{https://doi.org/10.1103/PhysRevLett.80.2245}{doi:10.1103/PhysRevLett.80.2245};\n  \\href{https://arxiv.org/abs/quant-ph/9709029}{arXiv:quant-ph/9709029}."},{"key":"HHT01","label":"ref:p8-hayden-horodecki-terhal","tex":"P. M. Hayden, M. Horodecki, and B. M. Terhal,\n  ``The Asymptotic Entanglement Cost of Preparing a Quantum State,''\n  \\emph{Journal of Physics A: Mathematical and General} \\textbf{34},\n  6891--6898 (2001).\n  \\href{https://doi.org/10.1088/0305-4470/34/35/314}{doi:10.1088/0305-4470/34/35/314};\n  \\href{https://arxiv.org/abs/quant-ph/0008134}{arXiv:quant-ph/0008134}."}],"comment":"The unresolved step is to decide whether regularization lowers the\nsingle-copy value in Eq.~\\eqref{eq:p8-entanglement-of-formation}; equivalently,\none must evaluate the entanglement of formation on tensor powers of this Choi\nstate.  Problems~2 and~5 concern the same channel family but ask about channel\ncapacities, whereas the present problem asks about the entanglement cost of a\nbipartite state associated with the channel."}}
---
## Source

The question is implicit in the identity between entanglement cost and regularized entanglement of formation, together with Wootters’ single-copy formula applied to this Choi state [HHT01](https://doi.org/10.1088/0305-4470/34/35/314), [Woo98](https://doi.org/10.1103/PhysRevLett.80.2245).

## Progress

Wootters’ two-qubit formula, together with the concurrence of $\omega_p$, gives the exact single-copy entanglement of formation

$$
C(\omega_p)=\sqrt{1-p},
 \qquad
 E_F(\omega_p)=h_2\!\left(\frac{1+\sqrt p}{2}\right),
 \tag{4}
$$

where $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_2 0:=0$, [Woo98](https://doi.org/10.1103/PhysRevLett.80.2245). Equation (4) determines one copy exactly, but it does not by itself determine the asymptotic entanglement cost.

The entanglement cost equals the regularized entanglement of formation

$$
E_C(\omega_p)
 =\lim_{n\to\infty}\frac1n E_F(\omega_p^{\otimes n})
 \le E_F(\omega_p)
 =h_2\!\left(\frac{1+\sqrt p}{2}\right)
 \tag{5}
$$

[HHT01](https://doi.org/10.1088/0305-4470/34/35/314). Consequently, Eq. (5) reduces the problem to evaluating the regularization for this particular family of Choi states.

## Comment

The unresolved step is to decide whether regularization lowers the single-copy value in Eq. (4); equivalently, one must evaluate the entanglement of formation on tensor powers of this Choi state. Problems 2 and 5 concern the same channel family but ask about channel capacities, whereas the present problem asks about the entanglement cost of a bipartite state associated with the channel.

## References

**Woo98** W. K. Wootters, “Entanglement of Formation of an Arbitrary State of Two Qubits,” *Physical Review Letters* **80**, 2245–2248 (1998). [doi:10.1103/PhysRevLett.80.2245](https://doi.org/10.1103/PhysRevLett.80.2245); [arXiv:quant-ph/9709029](https://arxiv.org/abs/quant-ph/9709029).

**HHT01** P. M. Hayden, M. Horodecki, and B. M. Terhal, “The Asymptotic Entanglement Cost of Preparing a Quantum State,” *Journal of Physics A: Mathematical and General* **34**, 6891–6898 (2001). [doi:10.1088/0305-4470/34/35/314](https://doi.org/10.1088/0305-4470/34/35/314); [arXiv:quant-ph/0008134](https://arxiv.org/abs/quant-ph/0008134).
