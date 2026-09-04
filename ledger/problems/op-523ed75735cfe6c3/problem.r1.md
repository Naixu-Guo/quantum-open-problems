---
id: "01M1HME78053BRQ9RY6RY1YHSW"
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
areaIds: ["quantum-information-theory","mathematics-of-quantum-information"]
topicIds: ["quantum-channels","choi-states","convex-geometry","convex-optimization","matrix-analysis"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Equal-weight low-Choi-rank decompositions of quantum channels"
aliases: ["op-523ed75735cfe6c3","op_523ed75735cfe6c3","01M1HME78053BRQ9RY6RY1YHSW","ruskai-2007-convex-decompositions-cpt-maps"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_523ed75735cfe6c3.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_523ed75735cfe6c3","ulid":"01M1HME78053BRQ9RY6RY1YHSW","aliases":["op_523ed75735cfe6c3","01M1HME78053BRQ9RY6RY1YHSW","op-523ed75735cfe6c3","ruskai-2007-convex-decompositions-cpt-maps"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-information-theory","mathematics-of-quantum-information"],"topicIds":["quantum-channels","choi-states","convex-geometry","convex-optimization","matrix-analysis"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Equal-weight low-Choi-rank decompositions of quantum channels","status":"Unsolved","fields":["Quantum information theory","Mathematics of quantum information"],"topics":["Quantum channels","Choi states","Convex geometry","Convex optimization","Matrix analysis"],"statement":"Can every finite-dimensional quantum channel be written as the uniform\nmixture of $d_B$ channels whose Choi ranks are at most the input dimension?\nLet $A$ and $B$ have dimensions $d_A$ and $d_B$, respectively, and let\n$\\Phi:\\mathcal L(A)\\to\\mathcal L(B)$ be completely positive and trace\npreserving.  In a fixed orthonormal basis of $A$, define its Choi operator by\n\\begin{equation}\n  J(\\Phi)\n  :=\\sum_{i,j=1}^{d_A}\n      \\lvert i\\rangle\\!\\langle j\\rvert_A\\otimes\n      \\Phi\\!\\left(\\lvert i\\rangle\\!\\langle j\\rvert_A\\right),\n  \\label{eq:p58-choi-operator}\n\\end{equation}\nThe rank of the operator in Eq.~\\eqref{eq:p58-choi-operator} is independent\nof the chosen basis.  Determine whether every $\\Phi$ admits completely\npositive trace-preserving maps\n$\\Phi_1,\\ldots,\\Phi_{d_B}:\\mathcal L(A)\\to\\mathcal L(B)$ satisfying\n\\begin{equation}\n  \\Phi=\\frac1{d_B}\\sum_{r=1}^{d_B}\\Phi_r,\n  \\qquad\n  \\operatorname{rank}J(\\Phi_r)\\leq d_A\n  \\quad\\text{for every }r\\in\\{1,\\ldots,d_B\\}.\n  \\label{eq:p58-equal-weight-decomposition}\n\\end{equation}\nThus Eq.~\\eqref{eq:p58-equal-weight-decomposition} requires both the\nprescribed input-dimension rank bound and exactly equal mixing weights.","source":"Ruskai records the Audenaert--Ruskai channel-decomposition conjecture and its\nunital and positive-block-matrix formulations explicitly\n\\sourcecite{ref:p58-ruskai}{Rus07}.  The Choi-rank bound $d_A$ in\nEq.~\\eqref{eq:p58-equal-weight-decomposition} is the audited correction of\nthe inconsistent $d_B$ bound printed in the source's channel formulation;\nit agrees with the companion formulations and the modern statement studied\nby Kumar and Wolf \\sourcecite{ref:p58-kumar-wolf}{KW26}.","progress":["The stronger positive-block-matrix formulation is known when\n  $d_B=2$: a contraction can be expressed as the midpoint of two unitaries,\n  yielding two positive summands of rank at most $d_A$ with the prescribed\n  diagonal-block sum.  Because that formulation implies the channel\n  decomposition, Eq.~\\eqref{eq:p58-equal-weight-decomposition} holds for\n  every qubit-output channel\n  \\sourcecite{ref:p58-ruskai-szarek-werner}{RSW02},\n  \\sourcecite{ref:p58-ruskai}{Rus07}.","Kumar and Wolf prove the equal-weight decomposition in\n  Eq.~\\eqref{eq:p58-equal-weight-decomposition} for every qubit-input\n  channel, for all classical-to-quantum and quantum-to-classical channels,\n  and for a nonzero-measure family in every pair of dimensions.  They also\n  prove an unequal-weight version for $3\\to3$ channels; that weaker result\n  does not establish the equal weights required here.  Their first-version\n  preprint therefore settles substantial subclasses but not arbitrary\n  $(d_A,d_B)$ \\sourcecite{ref:p58-kumar-wolf}{KW26}."],"references":[{"key":"Rus07","label":"ref:p58-ruskai","tex":"M. B. Ruskai, ``Open Problems in Quantum Information Theory,''\n  arXiv preprint (2007), Conjectures~2--5, pp.~4--6.\n  \\newline\n  \\href{https://doi.org/10.48550/arXiv.0708.1902}{doi:10.48550/arXiv.0708.1902};\n  \\href{https://arxiv.org/abs/0708.1902}{arXiv:0708.1902}."},{"key":"RSW02","label":"ref:p58-ruskai-szarek-werner","tex":"M. B. Ruskai, S. Szarek, and E. Werner,\n  ``An Analysis of Completely Positive Trace-Preserving Maps on $M_2$,''\n  \\emph{Linear Algebra and its Applications} \\textbf{347}, 159--187\n  (2002).\n  \\href{https://doi.org/10.1016/S0024-3795(01)00547-X}{doi:10.1016/S0024-3795(01)00547-X};\n  \\href{https://arxiv.org/abs/quant-ph/0101003}{arXiv:quant-ph/0101003}."},{"key":"KW26","label":"ref:p58-kumar-wolf","tex":"N. Kumar and M. M. Wolf,\n  ``The Ruskai--Audenaert Conjecture \\& Equipartitions of Positive\n  Operators,'' arXiv preprint (2026), version~1.\n  \\href{https://arxiv.org/abs/2607.23066v1}{arXiv:2607.23066v1}."}],"comment":"The remaining problem is the equal-weight decomposition in\nEq.~\\eqref{eq:p58-equal-weight-decomposition} for arbitrary input and output\ndimensions outside the proved subclasses.  At the source audit cutoff, the\nbroad 2026 partial result was an unrefereed first-version preprint."}}
---
## Source

Ruskai records the Audenaert–Ruskai channel-decomposition conjecture and its unital and positive-block-matrix formulations explicitly [Rus07](https://doi.org/10.48550/arXiv.0708.1902). The Choi-rank bound $d_A$ in Eq. (2) is the audited correction of the inconsistent $d_B$ bound printed in the source’s channel formulation; it agrees with the companion formulations and the modern statement studied by Kumar and Wolf [KW26](https://arxiv.org/abs/2607.23066v1).

## Progress

The stronger positive-block-matrix formulation is known when $d_B=2$: a contraction can be expressed as the midpoint of two unitaries, yielding two positive summands of rank at most $d_A$ with the prescribed diagonal-block sum. Because that formulation implies the channel decomposition, Eq. (2) holds for every qubit-output channel [RSW02](https://doi.org/10.1016/S0024-3795\(01\)00547-X), [Rus07](https://doi.org/10.48550/arXiv.0708.1902).

Kumar and Wolf prove the equal-weight decomposition in Eq. (2) for every qubit-input channel, for all classical-to-quantum and quantum-to-classical channels, and for a nonzero-measure family in every pair of dimensions. They also prove an unequal-weight version for $3\to3$ channels; that weaker result does not establish the equal weights required here. Their first-version preprint therefore settles substantial subclasses but not arbitrary $(d_A,d_B)$ [KW26](https://arxiv.org/abs/2607.23066v1).

## Comment

The remaining problem is the equal-weight decomposition in Eq. (2) for arbitrary input and output dimensions outside the proved subclasses. At the source audit cutoff, the broad 2026 partial result was an unrefereed first-version preprint.

## References

**Rus07** M. B. Ruskai, “Open Problems in Quantum Information Theory,” arXiv preprint (2007), Conjectures 2–5, pp. 4–6.
 [doi:10.48550/arXiv.0708.1902](https://doi.org/10.48550/arXiv.0708.1902); [arXiv:0708.1902](https://arxiv.org/abs/0708.1902).

**RSW02** M. B. Ruskai, S. Szarek, and E. Werner, “An Analysis of Completely Positive Trace-Preserving Maps on $M_2$,” *Linear Algebra and its Applications* **347**, 159–187 (2002). [doi:10.1016/S0024-3795(01)00547-X](https://doi.org/10.1016/S0024-3795\(01\)00547-X); [arXiv:quant-ph/0101003](https://arxiv.org/abs/quant-ph/0101003).

**KW26** N. Kumar and M. M. Wolf, “The Ruskai–Audenaert Conjecture & Equipartitions of Positive Operators,” arXiv preprint (2026), version 1. [arXiv:2607.23066v1](https://arxiv.org/abs/2607.23066v1).
