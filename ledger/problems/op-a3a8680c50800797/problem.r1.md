---
id: "01M1Q787QRBXA9T9KBKMSKZBMY"
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
topicIds: ["bell-diagonal-states","entanglement-measures","qudit-systems","convex-optimization"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Entanglement of formation of generalized Bell-diagonal states"
aliases: ["op-a3a8680c50800797","op_a3a8680c50800797","01M1Q787QRBXA9T9KBKMSKZBMY"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_a3a8680c50800797.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_a3a8680c50800797","ulid":"01M1Q787QRBXA9T9KBKMSKZBMY","aliases":["op_a3a8680c50800797","01M1Q787QRBXA9T9KBKMSKZBMY","op-a3a8680c50800797"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["bell-diagonal-states","entanglement-measures","qudit-systems","convex-optimization"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Entanglement of formation of generalized Bell-diagonal states","status":"Unsolved","fields":["Entanglement theory"],"topics":["Bell-diagonal states","Entanglement measures","Qudit systems","Convex optimization"],"statement":"For every local dimension $d\\geq3$, determine the entanglement of formation\nof an arbitrary Weyl--Bell-diagonal state.  Let\n$\\omega_d:=\\exp(2\\pi i/d)$ and define the generalized Pauli operators and\ntheir associated Bell basis by\n\\begin{equation}\n  X\\lvert j\\rangle:=\\lvert j+1\\!\\!\\pmod d\\rangle,\n  \\qquad\n  Z\\lvert j\\rangle:=\\omega_d^j\\lvert j\\rangle,\n  \\qquad\n  \\lvert\\Phi_{a,b}\\rangle\n  :=(I\\otimes X^aZ^b)\\lvert\\Phi_d\\rangle,\n  \\qquad\n  \\lvert\\Phi_d\\rangle:=\\frac1{\\sqrt d}\\sum_{j=0}^{d-1}\\lvert j,j\\rangle,\n  \\label{eq:p56-weyl-bell-basis}\n\\end{equation}\nwhere $a,b\\in\\mathbb Z_d$.  In this problem, ``Pauli-diagonal'' means\ndiagonal in the generalized Bell basis in\nEq.~\\eqref{eq:p56-weyl-bell-basis}.  Thus the state is\n\\begin{equation}\n  \\rho_{\\mathbf p}\n  :=\\sum_{a,b\\in\\mathbb Z_d}p_{a,b}\n     \\lvert\\Phi_{a,b}\\rangle\\!\\langle\\Phi_{a,b}\\rvert,\n  \\qquad\n  p_{a,b}\\geq0,\n  \\qquad\n  \\sum_{a,b\\in\\mathbb Z_d}p_{a,b}=1.\n  \\label{eq:p56-weyl-bell-diagonal-state}\n\\end{equation}\nFor every probability array $\\mathbf p$ in\nEq.~\\eqref{eq:p56-weyl-bell-diagonal-state}, determine an evaluable exact\nformula and an optimal pure-state ensemble for\n\\begin{equation}\n  E_F(\\rho_{\\mathbf p})\n  :=\\inf_{\\rho_{\\mathbf p}=\\sum_i q_i\n                    \\lvert\\psi_i\\rangle\\!\\langle\\psi_i\\rvert}\n       \\sum_i q_i\\,\n       S\\!\\left(\\operatorname{Tr}_B\n          \\lvert\\psi_i\\rangle\\!\\langle\\psi_i\\rvert\\right),\n  \\qquad\n  S(\\sigma):=-\\operatorname{Tr}(\\sigma\\log_2\\sigma).\n  \\label{eq:p56-eof}\n\\end{equation}\nThe infimum in Eq.~\\eqref{eq:p56-eof} is over finite pure-state ensembles\nwith $q_i\\geq0$ and $\\sum_iq_i=1$.","source":"The problem is implicit in Vollbrecht and Werner's finite-Weyl symmetry\nconstruction and general convex-roof reduction\n\\sourcecite{ref:p56-vollbrecht-werner}{VW01}.  Terhal and Vollbrecht's\nsolution of the isotropic subfamily isolates a one-parameter slice rather\nthan the full generalized Bell simplex\n\\sourcecite{ref:p56-terhal-vollbrecht}{TV00}.","progress":["For $d=2$, Wootters determined $E_F$ for every two-qubit state and\n  therefore for every ordinary Bell-diagonal state\n  \\sourcecite{ref:p56-wootters}{Woo98}.  This formula relies on the\n  two-qubit concurrence and does not extend to the general $d\\geq3$\n  probability array in Eq.~\\eqref{eq:p56-weyl-bell-diagonal-state}.","The finite-Weyl twirl and the symmetry method of Vollbrecht and\n  Werner reduce the full convex roof to a phase optimization followed by a\n  convexification.  More precisely, define\n  \\begin{equation}\n    \\varepsilon_d(\\mathbf p)\n    :=\\min_{\\boldsymbol\\theta\\in[0,2\\pi)^{d^2}}\n       S\\!\\left(\\operatorname{Tr}_B\n          \\lvert\\psi_{\\mathbf p,\\boldsymbol\\theta}\\rangle\n          \\!\\langle\\psi_{\\mathbf p,\\boldsymbol\\theta}\\rvert\\right),\n    \\qquad\n    \\lvert\\psi_{\\mathbf p,\\boldsymbol\\theta}\\rangle\n    :=\\sum_{a,b\\in\\mathbb Z_d}\n       \\sqrt{p_{a,b}}e^{i\\theta_{a,b}}\\lvert\\Phi_{a,b}\\rangle.\n    \\label{eq:p56-symmetry-reduction}\n  \\end{equation}\n  Their theorem gives\n  \\begin{equation}\n    E_F(\\rho_{\\mathbf p})\n    =\\operatorname{co}\\varepsilon_d(\\mathbf p),\n    \\label{eq:p56-convexification}\n  \\end{equation}\n  where $\\operatorname{co}$ denotes the lower convex envelope on the\n  probability simplex.  Equations~\\eqref{eq:p56-symmetry-reduction} and\n  \\eqref{eq:p56-convexification} are an exact reduction, but the phase\n  minimum and its convex envelope remain unknown for a general\n  $\\mathbf p$ \\sourcecite{ref:p56-vollbrecht-werner}{VW01}.","For the isotropic probability array\n  \\begin{equation}\n    p_{0,0}=F,\n    \\qquad\n    p_{a,b}=\\frac{1-F}{d^2-1}\\quad((a,b)\\neq(0,0)),\n    \\qquad 0\\leq F\\leq1,\n    \\label{eq:p56-isotropic-array}\n  \\end{equation}\n  Terhal and Vollbrecht reduced the answer to the convex hull of an explicit\n  function \\sourcecite{ref:p56-terhal-vollbrecht}{TV00}; Fei and Li-Jost\n  subsequently proved the conjectured convex-hull shape in every dimension\n  \\sourcecite{ref:p56-fei-li-jost}{FLJ06}.  Hence the states in\n  Eq.~\\eqref{eq:p56-isotropic-array} are solved exactly, but they form only a\n  one-dimensional subfamily of the $(d^2-1)$-dimensional simplex.","A 2023 analysis of the same Weyl--Bell simplex classified Bell-diagonal\n  qutrit and ququart states using analytical and numerical separability\n  criteria, but left $22.6\\%$ of its sampled PPT ququart states unclassified\n  as separable or bound entangled\n  \\sourcecite{ref:p56-popp-hiesmayr}{PH23}.  Because $E_F(\\rho)=0$ exactly for\n  separable states, this unresolved zero-versus-positive boundary is already\n  an obstruction to a general exact formula; that work does not evaluate\n  $E_F$ on the unclassified states."],"references":[{"key":"VW01","label":"ref:p56-vollbrecht-werner","tex":"K. G. H. Vollbrecht and R. F. Werner,\n  ``Entanglement Measures under Symmetry,''\n  \\emph{Physical Review A} \\textbf{64}, 062307 (2001).\n  \\href{https://doi.org/10.1103/PhysRevA.64.062307}{doi:10.1103/PhysRevA.64.062307};\n  \\href{https://arxiv.org/abs/quant-ph/0010095}{arXiv:quant-ph/0010095}."},{"key":"TV00","label":"ref:p56-terhal-vollbrecht","tex":"B. M. Terhal and K. G. H. Vollbrecht,\n  ``Entanglement of Formation for Isotropic States,''\n  \\emph{Physical Review Letters} \\textbf{85}, 2625--2628 (2000).\n  \\href{https://doi.org/10.1103/PhysRevLett.85.2625}{doi:10.1103/PhysRevLett.85.2625};\n  \\href{https://arxiv.org/abs/quant-ph/0005062}{arXiv:quant-ph/0005062}."},{"key":"Woo98","label":"ref:p56-wootters","tex":"W. K. Wootters,\n  ``Entanglement of Formation of an Arbitrary State of Two Qubits,''\n  \\emph{Physical Review Letters} \\textbf{80}, 2245--2248 (1998).\n  \\href{https://doi.org/10.1103/PhysRevLett.80.2245}{doi:10.1103/PhysRevLett.80.2245};\n  \\href{https://arxiv.org/abs/quant-ph/9709029}{arXiv:quant-ph/9709029}."},{"key":"FLJ06","label":"ref:p56-fei-li-jost","tex":"S.-M. Fei and X. Li-Jost,\n  ``$R$ Function Related to Entanglement of Formation,''\n  \\emph{Physical Review A} \\textbf{73}, 024302 (2006).\n  \\href{https://doi.org/10.1103/PhysRevA.73.024302}{doi:10.1103/PhysRevA.73.024302};\n  \\href{https://arxiv.org/abs/quant-ph/0602137}{arXiv:quant-ph/0602137}."},{"key":"PH23","label":"ref:p56-popp-hiesmayr","tex":"C. Popp and B. C. Hiesmayr,\n  ``Comparing Bound Entanglement of Bell Diagonal Pairs of Qutrits and\n  Ququarts,'' \\emph{Scientific Reports} \\textbf{13}, 2037 (2023).\n  \\href{https://doi.org/10.1038/s41598-023-29211-w}{doi:10.1038/s41598-023-29211-w};\n  \\href{https://arxiv.org/abs/2209.15267}{arXiv:2209.15267}."}],"comment":"The unresolved task is to evaluate the phase minimum in\nEq.~\\eqref{eq:p56-symmetry-reduction}, determine its lower convex envelope in\nEq.~\\eqref{eq:p56-convexification}, and construct optimal ensembles for\narbitrary $\\mathbf p$ when $d\\geq3$.  Problem~7 instead asks for the\nregularized entanglement cost of qubit Bell-diagonal states."}}
---
## Source

The problem is implicit in Vollbrecht and Werner’s finite-Weyl symmetry construction and general convex-roof reduction [VW01](https://doi.org/10.1103/PhysRevA.64.062307). Terhal and Vollbrecht’s solution of the isotropic subfamily isolates a one-parameter slice rather than the full generalized Bell simplex [TV00](https://doi.org/10.1103/PhysRevLett.85.2625).

## Progress

For $d=2$, Wootters determined $E_F$ for every two-qubit state and therefore for every ordinary Bell-diagonal state [Woo98](https://doi.org/10.1103/PhysRevLett.80.2245). This formula relies on the two-qubit concurrence and does not extend to the general $d\geq3$ probability array in Eq. (2).

The finite-Weyl twirl and the symmetry method of Vollbrecht and Werner reduce the full convex roof to a phase optimization followed by a convexification. More precisely, define

$$
\varepsilon_d(\mathbf p)
 :=\min_{\boldsymbol\theta\in[0,2\pi)^{d^2}}
 S\!\left(\operatorname{Tr}_B
 \lvert\psi_{\mathbf p,\boldsymbol\theta}\rangle
 \!\langle\psi_{\mathbf p,\boldsymbol\theta}\rvert\right),
 \qquad
 \lvert\psi_{\mathbf p,\boldsymbol\theta}\rangle
 :=\sum_{a,b\in\mathbb Z_d}
 \sqrt{p_{a,b}}e^{i\theta_{a,b}}\lvert\Phi_{a,b}\rangle.
 \tag{4}
$$

Their theorem gives

$$
E_F(\rho_{\mathbf p})
 =\operatorname{co}\varepsilon_d(\mathbf p),
 \tag{5}
$$

where $\operatorname{co}$ denotes the lower convex envelope on the probability simplex. Equations (4) and (5) are an exact reduction, but the phase minimum and its convex envelope remain unknown for a general $\mathbf p$ [VW01](https://doi.org/10.1103/PhysRevA.64.062307).

For the isotropic probability array

$$
p_{0,0}=F,
 \qquad
 p_{a,b}=\frac{1-F}{d^2-1}\quad((a,b)\neq(0,0)),
 \qquad 0\leq F\leq1,
 \tag{6}
$$

Terhal and Vollbrecht reduced the answer to the convex hull of an explicit function [TV00](https://doi.org/10.1103/PhysRevLett.85.2625); Fei and Li-Jost subsequently proved the conjectured convex-hull shape in every dimension [FLJ06](https://doi.org/10.1103/PhysRevA.73.024302). Hence the states in Eq. (6) are solved exactly, but they form only a one-dimensional subfamily of the $(d^2-1)$-dimensional simplex.

A 2023 analysis of the same Weyl–Bell simplex classified Bell-diagonal qutrit and ququart states using analytical and numerical separability criteria, but left $22.6\%$ of its sampled PPT ququart states unclassified as separable or bound entangled [PH23](https://doi.org/10.1038/s41598-023-29211-w). Because $E_F(\rho)=0$ exactly for separable states, this unresolved zero-versus-positive boundary is already an obstruction to a general exact formula; that work does not evaluate $E_F$ on the unclassified states.

## Comment

The unresolved task is to evaluate the phase minimum in Eq. (4), determine its lower convex envelope in Eq. (5), and construct optimal ensembles for arbitrary $\mathbf p$ when $d\geq3$. Problem 7 instead asks for the regularized entanglement cost of qubit Bell-diagonal states.

## References

**VW01** K. G. H. Vollbrecht and R. F. Werner, “Entanglement Measures under Symmetry,” *Physical Review A* **64**, 062307 (2001). [doi:10.1103/PhysRevA.64.062307](https://doi.org/10.1103/PhysRevA.64.062307); [arXiv:quant-ph/0010095](https://arxiv.org/abs/quant-ph/0010095).

**TV00** B. M. Terhal and K. G. H. Vollbrecht, “Entanglement of Formation for Isotropic States,” *Physical Review Letters* **85**, 2625–2628 (2000). [doi:10.1103/PhysRevLett.85.2625](https://doi.org/10.1103/PhysRevLett.85.2625); [arXiv:quant-ph/0005062](https://arxiv.org/abs/quant-ph/0005062).

**Woo98** W. K. Wootters, “Entanglement of Formation of an Arbitrary State of Two Qubits,” *Physical Review Letters* **80**, 2245–2248 (1998). [doi:10.1103/PhysRevLett.80.2245](https://doi.org/10.1103/PhysRevLett.80.2245); [arXiv:quant-ph/9709029](https://arxiv.org/abs/quant-ph/9709029).

**FLJ06** S.-M. Fei and X. Li-Jost, “$R$ Function Related to Entanglement of Formation,” *Physical Review A* **73**, 024302 (2006). [doi:10.1103/PhysRevA.73.024302](https://doi.org/10.1103/PhysRevA.73.024302); [arXiv:quant-ph/0602137](https://arxiv.org/abs/quant-ph/0602137).

**PH23** C. Popp and B. C. Hiesmayr, “Comparing Bound Entanglement of Bell Diagonal Pairs of Qutrits and Ququarts,” *Scientific Reports* **13**, 2037 (2023). [doi:10.1038/s41598-023-29211-w](https://doi.org/10.1038/s41598-023-29211-w); [arXiv:2209.15267](https://arxiv.org/abs/2209.15267).
