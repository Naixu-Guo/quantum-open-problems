---
id: "01M1Q787QRJ5ASJACQYA9R7N35"
type: "Problem"
schemaVersion: "1.0"
revision: 4
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-13T08:01:05.974Z"
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
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_87c77263c8bab523.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_87c77263c8bab523","ulid":"01M1Q787QRJ5ASJACQYA9R7N35","aliases":["op_87c77263c8bab523","01M1Q787QRJ5ASJACQYA9R7N35","op-87c77263c8bab523"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-recovery","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Ordinary-Petz recovery bound for conditional mutual information","status":"Solved","fields":["Quantum Communication"],"topics":["Quantum recovery","Matrix and entropy inequalities"],"statement":"Does the ordinary, unrotated Petz map universally recover a tripartite state\nwith fidelity controlled by its conditional mutual information?  For a\nfinite-dimensional state $\\rho_{ABC}$, define\n\\begin{equation}\n  I(A;B\\mid C)_\\rho\n  :=S(AC)_\\rho+S(BC)_\\rho-S(C)_\\rho-S(ABC)_\\rho,\n  \\qquad\n  S(\\tau):=-\\operatorname{Tr}(\\tau\\log_2\\tau).\n  \\label{eq:p70-cmi}\n\\end{equation}\nThe ordinary Petz map associated with $\\rho_{AC}$ and the channel\n$\\operatorname{Tr}_A:AC\\to C$ is\n\\begin{equation}\n  \\mathcal P^{\\rho}_{C\\to AC}(X_C)\n  :=\\rho_{AC}^{1/2}\\!\\left[\n      I_A\\otimes\\rho_C^{-1/2}X_C\\rho_C^{-1/2}\n    \\right]\\rho_{AC}^{1/2},\n  \\label{eq:p70-petz-map}\n\\end{equation}\nwhere the inverse is taken on $\\operatorname{supp}\\rho_C$.  With squared\nfidelity $F(\\tau,\\omega):=\\lVert\\sqrt\\tau\\sqrt\\omega\\rVert_1^2$, determine\nwhether the quantity in Eq.~\\eqref{eq:p70-cmi} always satisfies\n\\begin{equation}\n  I(A;B\\mid C)_\\rho\n  \\stackrel{?}{\\geq}\n  -\\log_2 F\\!\\left(\n    \\rho_{ABC},\n    (\\operatorname{id}_B\\otimes\\mathcal P^{\\rho}_{C\\to AC})(\\rho_{BC})\n  \\right),\n  \\label{eq:p70-ordinary-petz-cmi}\n\\end{equation}\nwith the recovered systems ordered canonically as $ABC$.","source":"Berta, Seshadreesan, and Wilde state the R\\'enyi-monotonicity conjecture whose\n$\\alpha=1/2$ and $\\alpha=1$ endpoints give\nEq.~\\eqref{eq:p70-ordinary-petz-cmi}; Wilde records this ordinary-Petz\ninequality explicitly in Section~12.7\n\\sourcecite{ref:p70-berta-seshadreesan-wilde}{BSW15},\n\\sourcecite{ref:p70-wilde}{Wil17}.","progress":["Peter supplied two explicit three-qubit counterexamples to\nEq.~\\eqref{eq:p70-ordinary-petz-cmi} through the project submission inbox\non 10 September 2026. For the rank-three example, in computational\n$ABC$ order, set\n\\begin{equation}\n  \\begin{aligned}\n    v_1&=4\\lvert111\\rangle,\\qquad\n    v_2=3(\\lvert011\\rangle-\\lvert101\\rangle),\\\\\n    v_3&=5\\lvert001\\rangle+\\lvert010\\rangle+\\lvert100\\rangle,\\qquad\n    \\rho_{ABC}=\\frac1{61}\\sum_{j=1}^3\\lvert v_j\\rangle\\!\\langle v_j\\rvert.\n  \\end{aligned}\n  \\label{eq:p70-counterexample}\n\\end{equation}\nThe vectors in Eq.~\\eqref{eq:p70-counterexample} are orthogonal with\nsquared norms $16,18,27$, so they define a rank-three density operator.\nIts marginals satisfy\n\\begin{equation}\n  \\rho_{AC}=\\rho_{BC}=\\frac1{61}\n  \\begin{pmatrix}1&0&0&0\\\\0&34&5&0\\\\0&5&1&0\\\\0&0&0&25\\end{pmatrix},\n  \\qquad \\rho_C=\\frac1{61}\\operatorname{diag}(2,59).\n  \\label{eq:p70-counterexample-marginals}\n\\end{equation}\nThus the inverse in Eq.~\\eqref{eq:p70-petz-map} is an ordinary inverse.\nFor $\\sigma_{ABC}=(\\operatorname{id}_B\\otimes\\mathcal P^{\\rho}_{C\\to AC})(\\rho_{BC})$,\nindependent exact symbolic reconstruction and rational interval arithmetic give\n\\begin{equation}\n  \\begin{aligned}\n    I(A;B\\mid C)_\\rho&=0.48665355975796833566\\ldots,\\\\\n    -\\log_2F(\\rho_{ABC},\\sigma_{ABC})&=0.49106481978485687802\\ldots,\\\\\n    -0.004412&<I(A;B\\mid C)_\\rho+\\log_2F(\\rho_{ABC},\\sigma_{ABC})<-0.0044<0.\n  \\end{aligned}\n  \\label{eq:p70-certified-gap}\n\\end{equation}\nEquation~\\eqref{eq:p70-certified-gap} disproves the universal inequality\nwith exactly the map and squared-fidelity convention in the statement.\nA second, rank-two example has a separately certified gap between\n$-0.000881$ and $-0.000880$. Both constructions, their exact fidelity\nmatrices, and an independently written verifier are recorded in the\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md}{counterexample note}\n\\sourcecite{ref:p70-peter-counterexamples}{Pet26}.","A structurally distinct classical-flag construction gives a third\nthree-qubit counterexample. Let $V|0\\rangle=|00\\rangle_{AC}$ and\n$V|1\\rangle=|11\\rangle_{AC}$, and define\n\\begin{equation}\n  \\sigma=\\begin{pmatrix}1/2000&-1/75\\\\-1/75&1999/2000\\end{pmatrix},\n  \\qquad\n  \\rho=\\begin{pmatrix}3/4&\\sqrt3/4\\\\\\sqrt3/4&1/4\\end{pmatrix},\n  \\qquad p=\\frac{3000}{3001},\\quad q=\\frac1{3001}.\n  \\label{eq:p70-flagged-data}\n\\end{equation}\nUsing the data in Eq.~\\eqref{eq:p70-flagged-data}, in canonical\n$ABC$ order, set\n\\begin{equation}\n  \\omega_{ABC}=p|0\\rangle\\!\\langle0|_B\\otimes V\\sigma V^\\dagger\n  +q|1\\rangle\\!\\langle1|_B\\otimes V\\rho V^\\dagger.\n  \\label{eq:p70-flagged-state}\n\\end{equation}\nExact reduction of Eq.~\\eqref{eq:p70-flagged-state}, followed by directed\nArb ball arithmetic, certifies\n\\begin{equation}\n  I(A;B\\mid C)_\\omega<\\frac{435}{10^6}\n  <\\frac{466}{10^6}\n  <-\\log_2 F\\!\\left(\\omega_{ABC},\n    (\\operatorname{id}_B\\otimes\\mathcal P^\\omega_{C\\to AC})(\\omega_{BC})\n  \\right).\n  \\label{eq:p70-flagged-gap}\n\\end{equation}\nThus Eq.~\\eqref{eq:p70-flagged-gap} independently disproves the same\nordinary-map inequality. The analytic reduction, interval verifier, and a\nfull-$8\\times8$-matrix audit are recorded in the\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md}{flagged-state counterexample note}\n\\sourcecite{ref:p70-flagged-counterexample}{QOP26}.","Sutter, Tomamichel, and Harrow proved a strengthened data-processing\n  inequality using a pinched Petz map, equivalently a convex combination of\n  rotated Petz maps.  Their result yields a conditional-mutual-information\n  recovery bound of the form\n  \\begin{equation}\n    I(A;B\\mid C)_\\rho\n    \\geq-\\log_2 F\\!\\left(\n      \\rho_{ABC},\n      (\\operatorname{id}_B\\otimes\\mathcal R_{C\\to AC})(\\rho_{BC})\n    \\right),\n    \\label{eq:p70-rotated-recovery}\n  \\end{equation}\n  for an explicitly averaged recovery map $\\mathcal R_{C\\to AC}$.\n  Equation~\\eqref{eq:p70-rotated-recovery} does not establish\n  Eq.~\\eqref{eq:p70-ordinary-petz-cmi}, because the averaging need not reduce\n  to the unrotated map in Eq.~\\eqref{eq:p70-petz-map}\n  \\sourcecite{ref:p70-sutter-tomamichel-harrow}{STH16}.","Junge, Renner, Sutter, Wilde, and Winter constructed a universal\n  recovery map depending only on the reference state and the channel, and\n  proved a fidelity remainder of the form in\n  Eq.~\\eqref{eq:p70-rotated-recovery}.  Their universal map is an average of\n  rotated Petz maps, so universality alone does not settle the ordinary-map\n  requirement in Eq.~\\eqref{eq:p70-ordinary-petz-cmi}\n  \\sourcecite{ref:p70-junge-et-al}{JRS+18}."],"references":[{"key":"BSW15","label":"ref:p70-berta-seshadreesan-wilde","tex":"M. Berta, K. P. Seshadreesan, and M. M. Wilde,\n  ``R\\'enyi Generalizations of the Conditional Quantum Mutual Information,''\n  \\emph{Journal of Mathematical Physics} \\textbf{56}, 022205 (2015).\n  \\href{https://doi.org/10.1063/1.4908102}{doi:10.1063/1.4908102};\n  \\href{https://arxiv.org/abs/1403.6102}{arXiv:1403.6102}."},{"key":"Wil17","label":"ref:p70-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~12.7.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"STH16","label":"ref:p70-sutter-tomamichel-harrow","tex":"D. Sutter, M. Tomamichel, and A. W. Harrow,\n  ``Strengthened Monotonicity of Relative Entropy via Pinched Petz Recovery\n  Map,'' \\emph{IEEE Transactions on Information Theory} \\textbf{62},\n  2907--2913 (2016).\n  \\href{https://doi.org/10.1109/TIT.2016.2545680}{doi:10.1109/TIT.2016.2545680};\n  \\href{https://arxiv.org/abs/1507.00303}{arXiv:1507.00303}."},{"key":"JRS+18","label":"ref:p70-junge-et-al","tex":"M. Junge, R. Renner, D. Sutter, M. M. Wilde, and A. Winter,\n  ``Universal Recovery Maps and Approximate Sufficiency of Quantum Relative\n  Entropy,'' \\emph{Annales Henri Poincar\\'e} \\textbf{19}, 2955--2978 (2018).\n  \\href{https://doi.org/10.1007/s00023-018-0716-0}{doi:10.1007/s00023-018-0716-0};\n  \\href{https://arxiv.org/abs/1509.07127}{arXiv:1509.07127}."},{"key":"Pet26","label":"ref:p70-peter-counterexamples","tex":"Peter, ``Two three-qubit counterexamples to the ordinary-Petz CMI bound,''\nproject submissions (10 September 2026), consolidated and independently\nverified for QIQCOP Zoo (12 September 2026).\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md}{Counterexample note and exact verification certificate}."},{"key":"QOP26","label":"ref:p70-flagged-counterexample","tex":"\\emph{A flagged-state three-qubit counterexample to the\nordinary-Petz CMI bound}, independent QIQCOP Zoo contribution (10 September\n2026), verified 13 September 2026.\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md}{Proof and verification package}."}],"comment":"The ordinary-map requirement in\nEq.~\\eqref{eq:p70-petz-map} is settled negatively by the compatible-marginal\ncounterexamples above. The results using rotations, pinching, averaging, or\noptimized recovery channels remain valid. Peter's two submitted examples and\nthe independent flagged-state construction are verified with rigorous\ninterval methods; neither result has external peer review or a\nproof-assistant kernel check, and no historical-priority claim is asserted\n\\sourcecite{ref:p70-peter-counterexamples}{Pet26},\n\\sourcecite{ref:p70-flagged-counterexample}{QOP26}.","contributors":[{"name":"Peter","anonymous":false}]}}
---
## Source

Berta, Seshadreesan, and Wilde state the Rényi-monotonicity conjecture whose $\alpha=1/2$ and $\alpha=1$ endpoints give Eq. (3); Wilde records this ordinary-Petz inequality explicitly in Section 12.7 [BSW15](https://doi.org/10.1063/1.4908102), [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Peter supplied two explicit three-qubit counterexamples to Eq. (3) through the project submission inbox on 10 September 2026. For the rank-three example, in computational $ABC$ order, set

$$
\begin{aligned}
 v_1&=4\lvert111\rangle,\qquad
 v_2=3(\lvert011\rangle-\lvert101\rangle),\\
 v_3&=5\lvert001\rangle+\lvert010\rangle+\lvert100\rangle,\qquad
 \rho_{ABC}=\frac1{61}\sum_{j=1}^3\lvert v_j\rangle\!\langle v_j\rvert.
 \end{aligned}
\tag{4}
$$

The vectors in Eq. (4) are orthogonal with squared norms $16,18,27$, so they define a rank-three density operator. Its marginals satisfy

$$
\rho_{AC}=\rho_{BC}=\frac1{61}
 \begin{pmatrix}1&0&0&0\\0&34&5&0\\0&5&1&0\\0&0&0&25\end{pmatrix},
 \qquad \rho_C=\frac1{61}\operatorname{diag}(2,59).
\tag{5}
$$

Thus the inverse in Eq. (2) is an ordinary inverse. For $\sigma_{ABC}=(\operatorname{id}_B\otimes\mathcal P^{\rho}_{C\to AC})(\rho_{BC})$, independent exact symbolic reconstruction and rational interval arithmetic give

$$
\begin{aligned}
 I(A;B\mid C)_\rho&=0.48665355975796833566\ldots,\\
 -\log_2F(\rho_{ABC},\sigma_{ABC})&=0.49106481978485687802\ldots,\\
 -0.004412&<I(A;B\mid C)_\rho+\log_2F(\rho_{ABC},\sigma_{ABC})<-0.0044<0.
 \end{aligned}
\tag{6}
$$

Equation (6) disproves the universal inequality with exactly the map and squared-fidelity convention in the statement. A second, rank-two example has a separately certified gap between $-0.000881$ and $-0.000880$. Both constructions, their exact fidelity matrices, and an independently written verifier are recorded in the [counterexample note](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md) [Pet26](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md).

A structurally distinct classical-flag construction gives a third three-qubit counterexample. Let $V|0\rangle=|00\rangle_{AC}$ and $V|1\rangle=|11\rangle_{AC}$, and define

$$
\sigma=\begin{pmatrix}1/2000&-1/75\\-1/75&1999/2000\end{pmatrix},
 \qquad
 \rho=\begin{pmatrix}3/4&\sqrt3/4\\\sqrt3/4&1/4\end{pmatrix},
 \qquad p=\frac{3000}{3001},\quad q=\frac1{3001}.
\tag{7}
$$

Using the data in Eq. (7), in canonical $ABC$ order, set

$$
\omega_{ABC}=p|0\rangle\!\langle0|_B\otimes V\sigma V^\dagger
 +q|1\rangle\!\langle1|_B\otimes V\rho V^\dagger.
\tag{8}
$$

Exact reduction of Eq. (8), followed by directed Arb ball arithmetic, certifies

$$
I(A;B\mid C)_\omega<\frac{435}{10^6}
 <\frac{466}{10^6}
 <-\log_2 F\!\left(\omega_{ABC},
 (\operatorname{id}_B\otimes\mathcal P^\omega_{C\to AC})(\omega_{BC})
 \right).
\tag{9}
$$

Thus Eq. (9) independently disproves the same ordinary-map inequality. The analytic reduction, interval verifier, and a full-$8\times8$-matrix audit are recorded in the [flagged-state counterexample note](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md) [QOP26](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md).

Sutter, Tomamichel, and Harrow proved a strengthened data-processing inequality using a pinched Petz map, equivalently a convex combination of rotated Petz maps. Their result yields a conditional-mutual-information recovery bound of the form

$$
I(A;B\mid C)_\rho
 \geq-\log_2 F\!\left(
 \rho_{ABC},
 (\operatorname{id}_B\otimes\mathcal R_{C\to AC})(\rho_{BC})
 \right),
 \tag{10}
$$

for an explicitly averaged recovery map $\mathcal R_{C\to AC}$. Equation (10) does not establish Eq. (3), because the averaging need not reduce to the unrotated map in Eq. (2) [STH16](https://doi.org/10.1109/TIT.2016.2545680).

Junge, Renner, Sutter, Wilde, and Winter constructed a universal recovery map depending only on the reference state and the channel, and proved a fidelity remainder of the form in Eq. (10). Their universal map is an average of rotated Petz maps, so universality alone does not settle the ordinary-map requirement in Eq. (3) [JRS+18](https://doi.org/10.1007/s00023-018-0716-0).

## Comment

The ordinary-map requirement in Eq. (2) is settled negatively by the compatible-marginal counterexamples above. The results using rotations, pinching, averaging, or optimized recovery channels remain valid. Peter’s two submitted examples and the independent flagged-state construction are verified with rigorous interval methods; neither result has external peer review or a proof-assistant kernel check, and no historical-priority claim is asserted [Pet26](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md), [QOP26](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md).

## References

**BSW15** M. Berta, K. P. Seshadreesan, and M. M. Wilde, “Rényi Generalizations of the Conditional Quantum Mutual Information,” *Journal of Mathematical Physics* **56**, 022205 (2015). [doi:10.1063/1.4908102](https://doi.org/10.1063/1.4908102); [arXiv:1403.6102](https://arxiv.org/abs/1403.6102).

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 12.7. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**STH16** D. Sutter, M. Tomamichel, and A. W. Harrow, “Strengthened Monotonicity of Relative Entropy via Pinched Petz Recovery Map,” *IEEE Transactions on Information Theory* **62**, 2907–2913 (2016). [doi:10.1109/TIT.2016.2545680](https://doi.org/10.1109/TIT.2016.2545680); [arXiv:1507.00303](https://arxiv.org/abs/1507.00303).

**JRS+18** M. Junge, R. Renner, D. Sutter, M. M. Wilde, and A. Winter, “Universal Recovery Maps and Approximate Sufficiency of Quantum Relative Entropy,” *Annales Henri Poincaré* **19**, 2955–2978 (2018). [doi:10.1007/s00023-018-0716-0](https://doi.org/10.1007/s00023-018-0716-0); [arXiv:1509.07127](https://arxiv.org/abs/1509.07127).

**Pet26** Peter, “Two three-qubit counterexamples to the ordinary-Petz CMI bound,” project submissions (10 September 2026), consolidated and independently verified for QIQCOP Zoo (12 September 2026). [Counterexample note and exact verification certificate](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz.md).

**QOP26** *A flagged-state three-qubit counterexample to the ordinary-Petz CMI bound*, independent QIQCOP Zoo contribution (10 September 2026), verified 13 September 2026. [Proof and verification package](https://github.com/Naixu-Guo/quantum-open-problems/blob/main/database/proofs/ordinary-petz-flagged.md).
