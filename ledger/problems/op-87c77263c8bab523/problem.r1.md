---
id: "01M1Q787QRJ5ASJACQYA9R7N35"
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
areaIds: ["quantum-communication"]
topicIds: ["quantum-recovery","matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Ordinary-Petz recovery bound for conditional mutual information"
aliases: ["op-87c77263c8bab523","op_87c77263c8bab523","01M1Q787QRJ5ASJACQYA9R7N35"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_87c77263c8bab523.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_87c77263c8bab523","ulid":"01M1Q787QRJ5ASJACQYA9R7N35","aliases":["op_87c77263c8bab523","01M1Q787QRJ5ASJACQYA9R7N35","op-87c77263c8bab523"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-recovery","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Ordinary-Petz recovery bound for conditional mutual information","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum recovery","Matrix and entropy inequalities"],"statement":"Does the ordinary, unrotated Petz map universally recover a tripartite state\nwith fidelity controlled by its conditional mutual information?  For a\nfinite-dimensional state $\\rho_{ABC}$, define\n\\begin{equation}\n  I(A;B\\mid C)_\\rho\n  :=S(AC)_\\rho+S(BC)_\\rho-S(C)_\\rho-S(ABC)_\\rho,\n  \\qquad\n  S(\\tau):=-\\operatorname{Tr}(\\tau\\log_2\\tau).\n  \\label{eq:p70-cmi}\n\\end{equation}\nThe ordinary Petz map associated with $\\rho_{AC}$ and the channel\n$\\operatorname{Tr}_A:AC\\to C$ is\n\\begin{equation}\n  \\mathcal P^{\\rho}_{C\\to AC}(X_C)\n  :=\\rho_{AC}^{1/2}\\!\\left[\n      I_A\\otimes\\rho_C^{-1/2}X_C\\rho_C^{-1/2}\n    \\right]\\rho_{AC}^{1/2},\n  \\label{eq:p70-petz-map}\n\\end{equation}\nwhere the inverse is taken on $\\operatorname{supp}\\rho_C$.  With squared\nfidelity $F(\\tau,\\omega):=\\lVert\\sqrt\\tau\\sqrt\\omega\\rVert_1^2$, determine\nwhether the quantity in Eq.~\\eqref{eq:p70-cmi} always satisfies\n\\begin{equation}\n  I(A;B\\mid C)_\\rho\n  \\stackrel{?}{\\geq}\n  -\\log_2 F\\!\\left(\n    \\rho_{ABC},\n    (\\operatorname{id}_B\\otimes\\mathcal P^{\\rho}_{C\\to AC})(\\rho_{BC})\n  \\right),\n  \\label{eq:p70-ordinary-petz-cmi}\n\\end{equation}\nwith the recovered systems ordered canonically as $ABC$.","source":"Berta, Seshadreesan, and Wilde state the R\\'enyi-monotonicity conjecture whose\n$\\alpha=1/2$ and $\\alpha=1$ endpoints give\nEq.~\\eqref{eq:p70-ordinary-petz-cmi}; Wilde records this ordinary-Petz\ninequality explicitly in Section~12.7\n\\sourcecite{ref:p70-berta-seshadreesan-wilde}{BSW15},\n\\sourcecite{ref:p70-wilde}{Wil17}.","progress":["Sutter, Tomamichel, and Harrow proved a strengthened data-processing\n  inequality using a pinched Petz map, equivalently a convex combination of\n  rotated Petz maps.  Their result yields a conditional-mutual-information\n  recovery bound of the form\n  \\begin{equation}\n    I(A;B\\mid C)_\\rho\n    \\geq-\\log_2 F\\!\\left(\n      \\rho_{ABC},\n      (\\operatorname{id}_B\\otimes\\mathcal R_{C\\to AC})(\\rho_{BC})\n    \\right),\n    \\label{eq:p70-rotated-recovery}\n  \\end{equation}\n  for an explicitly averaged recovery map $\\mathcal R_{C\\to AC}$.\n  Equation~\\eqref{eq:p70-rotated-recovery} does not establish\n  Eq.~\\eqref{eq:p70-ordinary-petz-cmi}, because the averaging need not reduce\n  to the unrotated map in Eq.~\\eqref{eq:p70-petz-map}\n  \\sourcecite{ref:p70-sutter-tomamichel-harrow}{STH16}.","Junge, Renner, Sutter, Wilde, and Winter constructed a universal\n  recovery map depending only on the reference state and the channel, and\n  proved a fidelity remainder of the form in\n  Eq.~\\eqref{eq:p70-rotated-recovery}.  Their universal map is an average of\n  rotated Petz maps, so universality alone does not settle the ordinary-map\n  requirement in Eq.~\\eqref{eq:p70-ordinary-petz-cmi}\n  \\sourcecite{ref:p70-junge-et-al}{JRS+18}."],"references":[{"key":"BSW15","label":"ref:p70-berta-seshadreesan-wilde","tex":"M. Berta, K. P. Seshadreesan, and M. M. Wilde,\n  ``R\\'enyi Generalizations of the Conditional Quantum Mutual Information,''\n  \\emph{Journal of Mathematical Physics} \\textbf{56}, 022205 (2015).\n  \\href{https://doi.org/10.1063/1.4908102}{doi:10.1063/1.4908102};\n  \\href{https://arxiv.org/abs/1403.6102}{arXiv:1403.6102}."},{"key":"Wil17","label":"ref:p70-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~12.7.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"STH16","label":"ref:p70-sutter-tomamichel-harrow","tex":"D. Sutter, M. Tomamichel, and A. W. Harrow,\n  ``Strengthened Monotonicity of Relative Entropy via Pinched Petz Recovery\n  Map,'' \\emph{IEEE Transactions on Information Theory} \\textbf{62},\n  2907--2913 (2016).\n  \\href{https://doi.org/10.1109/TIT.2016.2545680}{doi:10.1109/TIT.2016.2545680};\n  \\href{https://arxiv.org/abs/1507.00303}{arXiv:1507.00303}."},{"key":"JRS+18","label":"ref:p70-junge-et-al","tex":"M. Junge, R. Renner, D. Sutter, M. M. Wilde, and A. Winter,\n  ``Universal Recovery Maps and Approximate Sufficiency of Quantum Relative\n  Entropy,'' \\emph{Annales Henri Poincar\\'e} \\textbf{19}, 2955--2978 (2018).\n  \\href{https://doi.org/10.1007/s00023-018-0716-0}{doi:10.1007/s00023-018-0716-0};\n  \\href{https://arxiv.org/abs/1509.07127}{arXiv:1509.07127}."}],"comment":"The unresolved requirement is the specific map in\nEq.~\\eqref{eq:p70-petz-map}, without rotations, pinching, averaging, or an\noptimization over recovery channels.  The general data-processing\ncounterexample recorded in Problem~\\ref{sec:problem-69} does not have the constrained\npartial-trace and compatible-marginal structure imposed here."}}
---
## Source

Berta, Seshadreesan, and Wilde state the Rényi-monotonicity conjecture whose $\alpha=1/2$ and $\alpha=1$ endpoints give Eq. (3); Wilde records this ordinary-Petz inequality explicitly in Section 12.7 [BSW15](https://doi.org/10.1063/1.4908102), [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Sutter, Tomamichel, and Harrow proved a strengthened data-processing inequality using a pinched Petz map, equivalently a convex combination of rotated Petz maps. Their result yields a conditional-mutual-information recovery bound of the form

$$
I(A;B\mid C)_\rho
 \geq-\log_2 F\!\left(
 \rho_{ABC},
 (\operatorname{id}_B\otimes\mathcal R_{C\to AC})(\rho_{BC})
 \right),
 \tag{4}
$$

for an explicitly averaged recovery map $\mathcal R_{C\to AC}$. Equation (4) does not establish Eq. (3), because the averaging need not reduce to the unrotated map in Eq. (2) [STH16](https://doi.org/10.1109/TIT.2016.2545680).

Junge, Renner, Sutter, Wilde, and Winter constructed a universal recovery map depending only on the reference state and the channel, and proved a fidelity remainder of the form in Eq. (4). Their universal map is an average of rotated Petz maps, so universality alone does not settle the ordinary-map requirement in Eq. (3) [JRS+18](https://doi.org/10.1007/s00023-018-0716-0).

## Comment

The unresolved requirement is the specific map in Eq. (2), without rotations, pinching, averaging, or an optimization over recovery channels. The general data-processing counterexample recorded in Problem does not have the constrained partial-trace and compatible-marginal structure imposed here.

## References

**BSW15** M. Berta, K. P. Seshadreesan, and M. M. Wilde, “Rényi Generalizations of the Conditional Quantum Mutual Information,” *Journal of Mathematical Physics* **56**, 022205 (2015). [doi:10.1063/1.4908102](https://doi.org/10.1063/1.4908102); [arXiv:1403.6102](https://arxiv.org/abs/1403.6102).

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 12.7. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**STH16** D. Sutter, M. Tomamichel, and A. W. Harrow, “Strengthened Monotonicity of Relative Entropy via Pinched Petz Recovery Map,” *IEEE Transactions on Information Theory* **62**, 2907–2913 (2016). [doi:10.1109/TIT.2016.2545680](https://doi.org/10.1109/TIT.2016.2545680); [arXiv:1507.00303](https://arxiv.org/abs/1507.00303).

**JRS+18** M. Junge, R. Renner, D. Sutter, M. M. Wilde, and A. Winter, “Universal Recovery Maps and Approximate Sufficiency of Quantum Relative Entropy,” *Annales Henri Poincaré* **19**, 2955–2978 (2018). [doi:10.1007/s00023-018-0716-0](https://doi.org/10.1007/s00023-018-0716-0); [arXiv:1509.07127](https://arxiv.org/abs/1509.07127).
