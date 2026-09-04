---
id: "01M1HME780FM4P69SQZX74G5NE"
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
areaIds: ["quantum-resource-theory","quantum-communication"]
topicIds: ["quantum-separability","quantum-channel-structure"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "The PPT-squared conjecture"
aliases: ["op-69520395226dc45a","op_69520395226dc45a","01M1HME780FM4P69SQZX74G5NE","v2-the-ppt-squared-conjecture","open-problem-v2-problem-32"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_69520395226dc45a.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_69520395226dc45a","ulid":"01M1HME780FM4P69SQZX74G5NE","aliases":["op_69520395226dc45a","01M1HME780FM4P69SQZX74G5NE","op-69520395226dc45a","v2-the-ppt-squared-conjecture","open-problem-v2-problem-32"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory","quantum-communication"],"topicIds":["quantum-separability","quantum-channel-structure"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"The PPT-squared conjecture","status":"Unsolved","fields":["Quantum Resource Theory","Quantum Communication"],"topics":["Quantum separability","Quantum channel structure"],"statement":"Must the composition of any two compatible PPT completely positive maps be\nentanglement breaking?  Let\n$\\Phi:M_{d_1}(\\mathbb C)\\to M_{d_2}(\\mathbb C)$ and\n$\\Psi:M_{d_2}(\\mathbb C)\\to M_{d_3}(\\mathbb C)$ be completely positive.  The\nChoi operator of $\\Phi$ is\n\\begin{equation}\n  J(\\Phi)\n  :=\\sum_{i,j=1}^{d_1}\\lvert i\\rangle\\!\\langle j\\rvert\n       \\otimes\\Phi(\\lvert i\\rangle\\!\\langle j\\rvert),\n  \\label{eq:p32-choi-operator}\n\\end{equation}\nand $J(\\Psi)$ is defined analogously.  In the convention of\nEq.~\\eqref{eq:p32-choi-operator}, a map $\\Phi$ is PPT when\n\\begin{equation}\n  (T\\otimes\\operatorname{id})\\bigl(J(\\Phi)\\bigr)\\succeq0,\n  \\label{eq:p32-ppt-condition}\n\\end{equation}\nand it is entanglement breaking when $J(\\Phi)$ is separable; the same\ndefinitions apply to $\\Psi$.  Under condition\nEq.~\\eqref{eq:p32-ppt-condition} for both maps, is\n$J(\\Psi\\circ\\Phi)$ necessarily separable?  Equivalently, does postselection\non any joint measurement outcome on the middle systems of two PPT bipartite\nstates always leave a separable state on the two outer systems?","source":"Christandl, M\\\"uller--Hermes, and Wolf formulate the PPT-squared statement as\nan explicit conjecture about compositions of PPT maps\n\\sourcecite{ref:p32-christandl}{CMW19}.","progress":["The conjecture was recorded in the Banff workshop report on operator\n  structures in quantum information\n  \\sourcecite{ref:p32-birs}{BIRS12}.","Christandl, M\\\"uller--Hermes, and Wolf formulated the two-map\n  statement above, proved its equivalence to the self-composition version,\n  and established it in equal dimension $d=2$, for Gaussian channels, and\n  for several further special classes.  Their eventual\n  entanglement-breaking results for repeated composition do not imply the\n  two-composition claim \\sourcecite{ref:p32-christandl}{CMW19}.","The equal-dimension conjecture holds for $d=3$\n  \\sourcecite{ref:p32-chen}{CYT19}.  Consequently, equal dimension $d\\geq4$\n  is the first unresolved regime.","The conjecture holds for diagonal-unitary-covariant maps, a class\n  containing Choi-type, depolarizing, dephasing, and amplitude-damping\n  examples \\sourcecite{ref:p32-singh}{SN22}.  This covariance restriction\n  does not cover arbitrary PPT maps.","Other repeated-composition theorems prove eventual entanglement\n  breaking for broad PPT families, but not after exactly two maps\n  \\sourcecite{ref:p32-kennedy}{KMP18}.","A 2026 qutrit theorem proves a stronger composition statement for\n  cones larger than the PPT cone and extends it to arbitrary selective\n  measurements.  Its dimension-specific hypothesis leaves higher dimensions\n  open \\sourcecite{ref:p32-an-lee}{AL26}."],"references":[{"key":"BIRS12","label":"ref:p32-birs","tex":"M. B. Ruskai, M. Junge, D. Kribs, P. Hayden, and A. Winter (organizers),\n  \\emph{Operator Structures in Quantum Information Theory}, Banff\n  International Research Station Workshop Report 12w5084 (2012).\n  \\href{https://www.birs.ca/workshops/2012/12w5084/report12w5084.pdf}{workshop report}."},{"key":"CMW19","label":"ref:p32-christandl","tex":"M. Christandl, A. M\\\"uller--Hermes, and M. M. Wolf, ``When Do Composed Maps\n  Become Entanglement Breaking?'' \\emph{Annales Henri Poincar\\'e} \\textbf{20},\n  2295--2322 (2019).\n  \\href{https://doi.org/10.1007/s00023-019-00774-7}{doi:10.1007/s00023-019-00774-7};\n  \\href{https://arxiv.org/abs/1807.01266}{arXiv:1807.01266}."},{"key":"CYT19","label":"ref:p32-chen","tex":"L. Chen, Y. Yang, and W.-S. Tang, ``Positive-Partial-Transpose Square\n  Conjecture for $n=3$,'' \\emph{Physical Review A} \\textbf{99}, 012337\n  (2019). \\href{https://doi.org/10.1103/PhysRevA.99.012337}{doi:10.1103/PhysRevA.99.012337};\n  \\href{https://arxiv.org/abs/1807.03636}{arXiv:1807.03636}."},{"key":"SN22","label":"ref:p32-singh","tex":"S. Singh and I. Nechita, ``The $\\mathrm{PPT}^2$ Conjecture Holds for All\n  Choi-Type Maps,'' \\emph{Annales Henri Poincar\\'e} \\textbf{23}, 3311--3329\n  (2022). \\href{https://doi.org/10.1007/s00023-022-01166-0}{doi:10.1007/s00023-022-01166-0};\n  \\href{https://arxiv.org/abs/2011.03809}{arXiv:2011.03809}."},{"key":"KMP18","label":"ref:p32-kennedy","tex":"M. Kennedy, N. A. Manor, and V. I. Paulsen, ``Composition of PPT Maps,''\n  \\emph{Quantum Information and Computation} \\textbf{18}, 472--480 (2018).\n  \\href{https://arxiv.org/abs/1710.08475}{arXiv:1710.08475}."},{"key":"AL26","label":"ref:p32-an-lee","tex":"J. An and S. Lee, ``Beyond the Positive Partial Transpose Squared\n  Conjecture: The Qutrit Case,'' arXiv:2607.15947 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2607.15947}{doi:10.48550/arXiv.2607.15947};\n  \\href{https://arxiv.org/abs/2607.15947}{arXiv:2607.15947}."}],"comment":"The two-composition claim is settled in equal dimensions two and three and\nfor several structured families.  No proof or counterexample is known for\narbitrary compatible finite-dimensional PPT maps, with equal dimension four\nbeing the first open square case."}}
---
## Source

Christandl, Müller–Hermes, and Wolf formulate the PPT-squared statement as an explicit conjecture about compositions of PPT maps [CMW19](https://doi.org/10.1007/s00023-019-00774-7).

## Progress

The conjecture was recorded in the Banff workshop report on operator structures in quantum information [BIRS12](https://www.birs.ca/workshops/2012/12w5084/report12w5084.pdf).

Christandl, Müller–Hermes, and Wolf formulated the two-map statement above, proved its equivalence to the self-composition version, and established it in equal dimension $d=2$, for Gaussian channels, and for several further special classes. Their eventual entanglement-breaking results for repeated composition do not imply the two-composition claim [CMW19](https://doi.org/10.1007/s00023-019-00774-7).

The equal-dimension conjecture holds for $d=3$ [CYT19](https://doi.org/10.1103/PhysRevA.99.012337). Consequently, equal dimension $d\geq4$ is the first unresolved regime.

The conjecture holds for diagonal-unitary-covariant maps, a class containing Choi-type, depolarizing, dephasing, and amplitude-damping examples [SN22](https://doi.org/10.1007/s00023-022-01166-0). This covariance restriction does not cover arbitrary PPT maps.

Other repeated-composition theorems prove eventual entanglement breaking for broad PPT families, but not after exactly two maps [KMP18](https://arxiv.org/abs/1710.08475).

A 2026 qutrit theorem proves a stronger composition statement for cones larger than the PPT cone and extends it to arbitrary selective measurements. Its dimension-specific hypothesis leaves higher dimensions open [AL26](https://doi.org/10.48550/arXiv.2607.15947).

## Comment

The two-composition claim is settled in equal dimensions two and three and for several structured families. No proof or counterexample is known for arbitrary compatible finite-dimensional PPT maps, with equal dimension four being the first open square case.

## References

**BIRS12** M. B. Ruskai, M. Junge, D. Kribs, P. Hayden, and A. Winter (organizers), *Operator Structures in Quantum Information Theory*, Banff International Research Station Workshop Report 12w5084 (2012). [workshop report](https://www.birs.ca/workshops/2012/12w5084/report12w5084.pdf).

**CMW19** M. Christandl, A. Müller–Hermes, and M. M. Wolf, “When Do Composed Maps Become Entanglement Breaking?” *Annales Henri Poincaré* **20**, 2295–2322 (2019). [doi:10.1007/s00023-019-00774-7](https://doi.org/10.1007/s00023-019-00774-7); [arXiv:1807.01266](https://arxiv.org/abs/1807.01266).

**CYT19** L. Chen, Y. Yang, and W.-S. Tang, “Positive-Partial-Transpose Square Conjecture for $n=3$,” *Physical Review A* **99**, 012337 (2019). [doi:10.1103/PhysRevA.99.012337](https://doi.org/10.1103/PhysRevA.99.012337); [arXiv:1807.03636](https://arxiv.org/abs/1807.03636).

**SN22** S. Singh and I. Nechita, “The $\mathrm{PPT}^2$ Conjecture Holds for All Choi-Type Maps,” *Annales Henri Poincaré* **23**, 3311–3329 (2022). [doi:10.1007/s00023-022-01166-0](https://doi.org/10.1007/s00023-022-01166-0); [arXiv:2011.03809](https://arxiv.org/abs/2011.03809).

**KMP18** M. Kennedy, N. A. Manor, and V. I. Paulsen, “Composition of PPT Maps,” *Quantum Information and Computation* **18**, 472–480 (2018). [arXiv:1710.08475](https://arxiv.org/abs/1710.08475).

**AL26** J. An and S. Lee, “Beyond the Positive Partial Transpose Squared Conjecture: The Qutrit Case,” arXiv:2607.15947 (2026). [doi:10.48550/arXiv.2607.15947](https://doi.org/10.48550/arXiv.2607.15947); [arXiv:2607.15947](https://arxiv.org/abs/2607.15947).
