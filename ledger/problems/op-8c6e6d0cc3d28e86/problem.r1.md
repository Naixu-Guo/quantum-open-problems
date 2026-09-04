---
id: "01M1Q787QRMK8JJ7BH5J7A8VXS"
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
areaIds: ["quantum-information-theory","quantum-shannon-theory"]
topicIds: ["quantum-channels","convex-optimization"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Umegaki relative entropy of local recovery"
aliases: ["op-8c6e6d0cc3d28e86","op_8c6e6d0cc3d28e86","01M1Q787QRMK8JJ7BH5J7A8VXS"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_8c6e6d0cc3d28e86.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_8c6e6d0cc3d28e86","ulid":"01M1Q787QRMK8JJ7BH5J7A8VXS","aliases":["op_8c6e6d0cc3d28e86","01M1Q787QRMK8JJ7BH5J7A8VXS","op-8c6e6d0cc3d28e86"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-information-theory","quantum-shannon-theory"],"topicIds":["quantum-channels","convex-optimization"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Umegaki relative entropy of local recovery","status":"Solved","fields":["Quantum information theory","Quantum Shannon theory"],"topics":["Quantum channels","Convex optimization"],"statement":"Does the conditional mutual information of every finite-dimensional\ntripartite state dominate its Umegaki relative entropy of local recovery?\nFor a state $\\rho_{ABC}$, define\n\\begin{equation}\n  I(A:C\\mid B)_\\rho\n  :=S(AB)_\\rho+S(BC)_\\rho-S(B)_\\rho-S(ABC)_\\rho.\n  \\label{eq:p46-cmi}\n\\end{equation}\nWith $D(\\tau\\Vert\\omega):=\\operatorname{Tr}[\\tau(\\log\\tau-\\log\\omega)]$\nwhen $\\operatorname{supp}\\tau\\subseteq\\operatorname{supp}\\omega$, the\nquestion is whether the quantity in Eq.~\\eqref{eq:p46-cmi} always satisfies\n\\begin{equation}\n  I(A:C\\mid B)_\\rho\n  \\stackrel{?}{\\ge}\n  \\min_{\\mathcal R_{B\\to BC}}\n  D\\!\\left(\n    \\rho_{ABC}\n    \\middle\\Vert\n    (\\operatorname{id}_A\\otimes\\mathcal R_{B\\to BC})(\\rho_{AB})\n  \\right),\n  \\label{eq:p46-recovery-bound}\n\\end{equation}\nwhere the minimum in Eq.~\\eqref{eq:p46-recovery-bound} is over all completely\npositive trace-preserving recovery maps $\\mathcal R_{B\\to BC}$.","source":"The local Umegaki-recovery inequality was formulated by Li and Winter\n\\sourcecite{ref:p46-li-winter}{LW18}; the associated universal recovery-map\nproposal is recorded as Eq.~(12.153) of Wilde's text\n\\sourcecite{ref:p46-wilde}{Wil17}.","progress":["Li and Winter formulated the local Umegaki-recovery inequality in\n  Eq.~\\eqref{eq:p46-recovery-bound} and related it to a proposed universal,\n  functorial recovery-map strengthening of relative-entropy monotonicity\n  \\sourcecite{ref:p46-li-winter}{LW18}.  Wilde recorded the latter proposal as\n  Eq.~(12.153) in his text \\sourcecite{ref:p46-wilde}{Wil17}.","Fawzi and Fawzi disproved Eq.~\\eqref{eq:p46-recovery-bound}.  Their\n  explicit family consists of the pure three-qubit states\n  \\begin{equation}\n    \\begin{aligned}\n      \\rho^{(\\theta)}_{ABC}\n      &=\\lvert\\psi_\\theta\\rangle\\!\\langle\\psi_\\theta\\rvert,\\\\\n      \\lvert\\psi_\\theta\\rangle_{ABC}\n      &=\\frac{1}{\\sqrt2}\\lvert0\\rangle_B\\lvert00\\rangle_{AC}\n        +\\frac{1}{\\sqrt2}\\lvert1\\rangle_B\n        \\bigl(\\cos\\theta\\,\\lvert01\\rangle_{AC}\n              +\\sin\\theta\\,\\lvert10\\rangle_{AC}\\bigr).\n    \\end{aligned}\n    \\label{eq:p46-counterexample-family}\n  \\end{equation}\n  For sufficiently small positive $\\theta$, the states in\n  Eq.~\\eqref{eq:p46-counterexample-family} violate\n  Eq.~\\eqref{eq:p46-recovery-bound}.  The violation is certified by optimizing\n  a semidefinite-representable Petz--R\\'enyi-divergence lower bound on the\n  relative entropy of recovery \\sourcecite{ref:p46-fawzi}{FF18}."],"references":[{"key":"LW18","label":"ref:p46-li-winter","tex":"K. Li and A. Winter, ``Squashed Entanglement, $k$-Extendibility, Quantum\n  Markov Chains, and Recovery Maps,'' \\emph{Foundations of Physics}\n  \\textbf{48}, 910--924 (2018).\n  \\href{https://doi.org/10.1007/s10701-018-0143-6}{doi:10.1007/s10701-018-0143-6};\n  \\href{https://arxiv.org/abs/1410.4184}{arXiv:1410.4184}."},{"key":"Wil17","label":"ref:p46-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~12.7.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"FF18","label":"ref:p46-fawzi","tex":"H. Fawzi and O. Fawzi, ``Efficient Optimization of the Quantum Relative\n  Entropy,'' \\emph{Journal of Physics A: Mathematical and Theoretical}\n  \\textbf{51}, 154003 (2018).\n  \\href{https://doi.org/10.1088/1751-8121/aab285}{doi:10.1088/1751-8121/aab285};\n  \\href{https://arxiv.org/abs/1705.06671}{arXiv:1705.06671}."}],"comment":"The answer to the local-recovery question in\nEq.~\\eqref{eq:p46-recovery-bound} is negative.  This is the conditional-mutual-\ninformation consequence of the recovery proposal associated with\nEq.~(12.153) of \\sourcecite{ref:p46-wilde}{Wil17}.  The archived statement is\ndeliberately restricted to local recovery: it does not assert that the same\ncounterexample rules out every nonfunctorial recovery channel allowed to act\njointly on an otherwise spectator system."}}
---
## Source

The local Umegaki-recovery inequality was formulated by Li and Winter [LW18](https://doi.org/10.1007/s10701-018-0143-6); the associated universal recovery-map proposal is recorded as Eq. (12.153) of Wilde’s text [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Li and Winter formulated the local Umegaki-recovery inequality in Eq. (2) and related it to a proposed universal, functorial recovery-map strengthening of relative-entropy monotonicity [LW18](https://doi.org/10.1007/s10701-018-0143-6). Wilde recorded the latter proposal as Eq. (12.153) in his text [Wil17](https://doi.org/10.1017/9781316809976).

Fawzi and Fawzi disproved Eq. (2). Their explicit family consists of the pure three-qubit states

$$
\begin{aligned}
 \rho^{(\theta)}_{ABC}
 &=\lvert\psi_\theta\rangle\!\langle\psi_\theta\rvert,\\
 \lvert\psi_\theta\rangle_{ABC}
 &=\frac{1}{\sqrt2}\lvert0\rangle_B\lvert00\rangle_{AC}
 +\frac{1}{\sqrt2}\lvert1\rangle_B
 \bigl(\cos\theta\,\lvert01\rangle_{AC}
 +\sin\theta\,\lvert10\rangle_{AC}\bigr).
 \end{aligned}
 \tag{3}
$$

For sufficiently small positive $\theta$, the states in Eq. (3) violate Eq. (2). The violation is certified by optimizing a semidefinite-representable Petz–Rényi-divergence lower bound on the relative entropy of recovery [FF18](https://doi.org/10.1088/1751-8121/aab285).

## Comment

The answer to the local-recovery question in Eq. (2) is negative. This is the conditional-mutual- information consequence of the recovery proposal associated with Eq. (12.153) of [Wil17](https://doi.org/10.1017/9781316809976). The archived statement is deliberately restricted to local recovery: it does not assert that the same counterexample rules out every nonfunctorial recovery channel allowed to act jointly on an otherwise spectator system.

## References

**LW18** K. Li and A. Winter, “Squashed Entanglement, $k$-Extendibility, Quantum Markov Chains, and Recovery Maps,” *Foundations of Physics* **48**, 910–924 (2018). [doi:10.1007/s10701-018-0143-6](https://doi.org/10.1007/s10701-018-0143-6); [arXiv:1410.4184](https://arxiv.org/abs/1410.4184).

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 12.7. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**FF18** H. Fawzi and O. Fawzi, “Efficient Optimization of the Quantum Relative Entropy,” *Journal of Physics A: Mathematical and Theoretical* **51**, 154003 (2018). [doi:10.1088/1751-8121/aab285](https://doi.org/10.1088/1751-8121/aab285); [arXiv:1705.06671](https://arxiv.org/abs/1705.06671).
