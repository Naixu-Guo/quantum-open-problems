---
id: "01M2M9FCD8BZKAGDQ46Z2H5KCX"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["random-circuit-sampling","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Conditional-correlation decay in amplitude-damped random circuits"
aliases: ["op-72937f30974953ba","op_72937f30974953ba","01M2M9FCD8BZKAGDQ46Z2H5KCX"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_72937f30974953ba.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_72937f30974953ba","ulid":"01M2M9FCD8BZKAGDQ46Z2H5KCX","aliases":["op_72937f30974953ba","01M2M9FCD8BZKAGDQ46Z2H5KCX","op-72937f30974953ba"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.840Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["random-circuit-sampling","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Conditional-correlation decay in amplitude-damped random circuits","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Random circuit sampling","Computational complexity and computability"],"statement":"Do computational-basis outputs of one-dimensional Haar-random circuits with fixed amplitude damping have conditional mutual information that decays exponentially with separation, uniformly in circuit depth?\n\nConsider an $n$-qubit nearest-neighbor Haar-random brickwork circuit on a line, starting from $|0^n\\rangle$. After each layer, apply amplitude damping of fixed strength $\\gamma\\in(0,1)$ independently to every qubit, with\n\n\\begin{equation}\nK_0=|0\\rangle\\langle0|+\\sqrt{1-\\gamma}|1\\rangle\\langle1|,\n\\qquad\nK_1=\\sqrt\\gamma|0\\rangle\\langle1|.\n\\label{eq:7293-1}\n\\end{equation}\n\nLet $P_U$ be the computational-basis output distribution. For disjoint $A,B,C$, define\n\n\\begin{equation}\nI_{P_U}(A:C\\mid B)=H_{P_U}(AB)+H_{P_U}(BC)-H_{P_U}(B)-H_{P_U}(ABC),\n\\label{eq:7293-2}\n\\end{equation}\n\nand let $r(A,C)$ be the chain distance between nonempty $A$ and $C$. For every fixed $\\gamma$, do constants $a,b,c>0$ exist, independent of system size, depth, and the subsets, such that\n\n\\begin{equation}\n\\mathbb E_U I_{P_U}(A:C\\mid B)\\leq an^b e^{-c r(A,C)}?\n\\label{eq:7293-3}\n\\end{equation}\n\nEquation~\\eqref{eq:7293-3} concerns the distribution produced using Eq.~\\eqref{eq:7293-1} and the classical conditional mutual information in Eq.~\\eqref{eq:7293-2}.","source":"This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature \\sourcecite{ref:7293-lee25}{Lee25}\\sourcecite{ref:7293-mele26}{Mele26}\\sourcecite{ref:7293-shravan26}{Shravan26}; it is not presented as a verbatim conjecture of those authors.","progress":["Lee and coauthors identify this average approximate-Markov condition as sufficient for classical sampling. In one dimension, their Theorem 3 gives runtime $\\operatorname{poly}(n,1/\\varepsilon,1/\\delta)$ and output error $\\|P_U-Q_U\\|_1\\leq\\varepsilon$, except on a fraction $\\delta$ of circuits, provided the condition holds uniformly over depth. Their amplitude-damping evidence is numerical, not a general proof. \\sourcecite{ref:7293-lee25}{Lee25}","Mele and coauthors prove effective-depth bounds for expectation values under nonunital noise. For a bounded observable $O$, the effect of discarding all but the last $m$ noisy layers is bounded on average by\n  \\begin{equation}\nO\\!\\left(\\|O\\|_\\infty e^{-\\alpha_\\gamma m}\\right),\n  \\qquad \\alpha_\\gamma>0.\n\\label{eq:7293-4}\n\\end{equation}\n  Their 2026 publication explicitly distinguishes these results from the still-open general sampling problem. \\sourcecite{ref:7293-mele26}{Mele26}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:7293-4}.","The April 2026 IQP simulation paper explicitly describes the nonunital conditional-mutual-information evidence as numerical. Its polynomial-time result for amplitude-damped IQP circuits at $d=\\Omega(\\log n)$ uses a different, diagonal-gate structure and does not prove the Haar-circuit inequality above. No later proof of this inequality was located. \\sourcecite{ref:7293-shravan26}{Shravan26}"],"references":[{"key":"Lee25","label":"ref:7293-lee25","tex":"S.-u. Lee, S. Ghosh, C. Oh, K. Noh, B. Fefferman, and L. Jiang, \"Classical simulation of noisy random circuits from exponential decay of correlation,\" arXiv preprint (2025), version 1, 7 October 2025. \\href{https://arxiv.org/abs/2510.06328}{arXiv:2510.06328}."},{"key":"Mele26","label":"ref:7293-mele26","tex":"A. A. Mele, A. Angrisani, S. Ghosh, S. Khatri, J. Eisert, D. Stilck França, and Y. Quek, \"Noise-induced shallow circuits and the absence of barren plateaus,\" \\emph{Nature Physics} 22, 751–756 (2026). \\href{https://doi.org/10.1038/s41567-026-03245-z}{doi:10.1038/s41567-026-03245-z}; \\href{https://arxiv.org/abs/2403.13927}{arXiv:2403.13927}."},{"key":"Shravan26","label":"ref:7293-shravan26","tex":"S. Shravan, M. Raza, and A. Shlosberg, \"Efficient simulation of noisy IQP circuits with amplitude-damping noise,\" arXiv preprint (2026), version 2, 22 April 2026. \\href{https://arxiv.org/abs/2604.05036}{arXiv:2604.05036}."}],"comment":"This would give a rigorous route from dissipative loss of conditional correlations to efficient full-distribution sampling at arbitrary depth. Efficient local-observable estimation, decay of ordinary two-point correlations, and a quantum-state conditional-mutual-information bound are not interchangeable with the classical inequality asked here.","contributors":[]}}
---
## Source

This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature [Lee25](https://arxiv.org/abs/2510.06328)[Mele26](https://doi.org/10.1038/s41567-026-03245-z)[Shravan26](https://arxiv.org/abs/2604.05036); it is not presented as a verbatim conjecture of those authors.

## Progress

Lee and coauthors identify this average approximate-Markov condition as sufficient for classical sampling. In one dimension, their Theorem 3 gives runtime $\operatorname{poly}(n,1/\varepsilon,1/\delta)$ and output error $\|P_U-Q_U\|_1\leq\varepsilon$, except on a fraction $\delta$ of circuits, provided the condition holds uniformly over depth. Their amplitude-damping evidence is numerical, not a general proof. [Lee25](https://arxiv.org/abs/2510.06328)

Mele and coauthors prove effective-depth bounds for expectation values under nonunital noise. For a bounded observable $O$, the effect of discarding all but the last $m$ noisy layers is bounded on average by

$$
O\!\left(\|O\|_\infty e^{-\alpha_\gamma m}\right),
 \qquad \alpha_\gamma>0.
\tag{4}
$$

Their 2026 publication explicitly distinguishes these results from the still-open general sampling problem. [Mele26](https://doi.org/10.1038/s41567-026-03245-z)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (4).

The April 2026 IQP simulation paper explicitly describes the nonunital conditional-mutual-information evidence as numerical. Its polynomial-time result for amplitude-damped IQP circuits at $d=\Omega(\log n)$ uses a different, diagonal-gate structure and does not prove the Haar-circuit inequality above. No later proof of this inequality was located. [Shravan26](https://arxiv.org/abs/2604.05036)

## Comment

This would give a rigorous route from dissipative loss of conditional correlations to efficient full-distribution sampling at arbitrary depth. Efficient local-observable estimation, decay of ordinary two-point correlations, and a quantum-state conditional-mutual-information bound are not interchangeable with the classical inequality asked here.

## References

**Lee25** S.-u. Lee, S. Ghosh, C. Oh, K. Noh, B. Fefferman, and L. Jiang, "Classical simulation of noisy random circuits from exponential decay of correlation," arXiv preprint (2025), version 1, 7 October 2025. [arXiv:2510.06328](https://arxiv.org/abs/2510.06328).

**Mele26** A. A. Mele, A. Angrisani, S. Ghosh, S. Khatri, J. Eisert, D. Stilck França, and Y. Quek, "Noise-induced shallow circuits and the absence of barren plateaus," *Nature Physics* 22, 751–756 (2026). [doi:10.1038/s41567-026-03245-z](https://doi.org/10.1038/s41567-026-03245-z); [arXiv:2403.13927](https://arxiv.org/abs/2403.13927).

**Shravan26** S. Shravan, M. Raza, and A. Shlosberg, "Efficient simulation of noisy IQP circuits with amplitude-damping noise," arXiv preprint (2026), version 2, 22 April 2026. [arXiv:2604.05036](https://arxiv.org/abs/2604.05036).
