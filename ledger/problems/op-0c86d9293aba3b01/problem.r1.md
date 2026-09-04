---
id: "01M1HME7809XJE4T6RFQKPGJVF"
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
areaIds: ["quantum-resource-theory"]
topicIds: ["absolutely-maximally-entangled-states","local-unitary-equivalence"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Finite nontrivial LU moduli of AME states"
aliases: ["op-0c86d9293aba3b01","op_0c86d9293aba3b01","01M1HME7809XJE4T6RFQKPGJVF","v2-finite-nontrivial-lu-moduli-of-ame-states","open-problem-v2-problem-43"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_0c86d9293aba3b01.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_0c86d9293aba3b01","ulid":"01M1HME7809XJE4T6RFQKPGJVF","aliases":["op_0c86d9293aba3b01","01M1HME7809XJE4T6RFQKPGJVF","op-0c86d9293aba3b01","v2-finite-nontrivial-lu-moduli-of-ame-states","open-problem-v2-problem-43"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["absolutely-maximally-entangled-states","local-unitary-equivalence"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Finite nontrivial LU moduli of AME states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Absolutely maximally entangled states","Local unitary equivalence"],"statement":"Do there exist integers $N,d\\geq 2$ for which the absolutely maximally\nentangled states of $N$ qudits of local dimension $d$ form finitely many, but\nmore than one, local-unitary equivalence classes?  A normalized vector\n$|\\psi\\rangle\\in(\\mathbb{C}^{d})^{\\otimes N}$ is an $\\operatorname{AME}(N,d)$\nstate when every subsystem of at most half the parties is maximally mixed:\n\\begin{equation}\n  \\operatorname{Tr}_{S^{c}}\\!\\left(|\\psi\\rangle\\!\\langle\\psi|\\right)\n  =\\frac{I_{d^{|S|}}}{d^{|S|}}\n  \\quad\\text{for every }S\\subseteq\\{1,\\ldots,N\\}\n  \\text{ with }|S|\\leq\\left\\lfloor\\frac{N}{2}\\right\\rfloor .\n  \\label{eq:p43-ame-condition}\n\\end{equation}\nFor normalized states satisfying Eq.~\\eqref{eq:p43-ame-condition}, define\nlocal-unitary equivalence by\n\\begin{equation}\n  |\\psi\\rangle\\sim_{\\mathrm{LU}}|\\phi\\rangle\n  \\quad\\Longleftrightarrow\\quad\n  |\\psi\\rangle=(U_1\\otimes\\cdots\\otimes U_N)|\\phi\\rangle\n  \\quad\\text{for some }U_1,\\ldots,U_N\\in U(d).\n  \\label{eq:p43-lu-equivalence}\n\\end{equation}\nIf $\\mathcal{A}_{N,d}$ denotes the set specified by\nEq.~\\eqref{eq:p43-ame-condition}, determine whether the quotient under\nEq.~\\eqref{eq:p43-lu-equivalence} can satisfy\n\\begin{equation}\n  \\mathfrak{M}_{N,d}:=\\mathcal{A}_{N,d}/\\!\\sim_{\\mathrm{LU}},\n  \\qquad\n  1<\\lvert\\mathfrak{M}_{N,d}\\rvert<\\infty .\n  \\label{eq:p43-finite-nontrivial-moduli}\n\\end{equation}","source":"Rajchel-Mieldzio\\'c et al. explicitly ask whether an AME family can have a\nfinite number of local-unitary equivalence classes greater than one\n\\sourcecite{ref:p43-review}{RBR+26}.","progress":["For four parties, all $\\operatorname{AME}(4,3)$ states lie in one LU\n  class, whereas $\\operatorname{AME}(4,d)$ has infinitely many LU classes for\n  every $d\\geq 4$ \\sourcecite{ref:p43-rather}{RRKL23}.  The latter theorem\n  includes infinitely many inequivalent $\\operatorname{AME}(4,6)$ states, so\n  neither side of this classification realizes\n  Eq.~\\eqref{eq:p43-finite-nontrivial-moduli}.","Tan completely classifies five-qubit AME states: every such state is\n  LU equivalent to a point of the unique $((5,2,3))$ code $\\mathcal C$, and\n  two points of $\\mathcal C$ are equivalent exactly when related by its\n  finite binary-tetrahedral transversal group\n  \\sourcecite{ref:p43-tan}{Tan26}.  Because the projective state space of the\n  two-dimensional code is a continuum while this group is finite,\n  $\\lvert\\mathfrak{M}_{5,2}\\rvert$ is infinite, not finite and nontrivial.","The 2026 AME review records the known one-class and infinite-class\n  regimes and explicitly leaves Eq.~\\eqref{eq:p43-finite-nontrivial-moduli}\n  as open problem T5 \\sourcecite{ref:p43-review}{RBR+26}."],"references":[{"key":"RRKL23","label":"ref:p43-rather","tex":"S. A. Rather, N. Ramadas, V. Kodiyalam, and A. Lakshminarayan,\n  ``Absolutely Maximally Entangled State Equivalence and the Construction of\n  Infinite Quantum Solutions to the Problem of 36 Officers of Euler,''\n  \\emph{Physical Review A} \\textbf{108}, 032412 (2023).\n  \\href{https://doi.org/10.1103/PhysRevA.108.032412}{doi:10.1103/PhysRevA.108.032412};\n  \\href{https://arxiv.org/abs/2212.06737}{arXiv:2212.06737}."},{"key":"Tan26","label":"ref:p43-tan","tex":"I. Tan, ``Classification of Five-Qubit Absolutely Maximally Entangled\n  States,'' arXiv:2507.02185v4 (2026).\n  \\href{https://arxiv.org/abs/2507.02185}{arXiv:2507.02185}."},{"key":"RBR+26","label":"ref:p43-review","tex":"G. Rajchel-Mieldzio{\\'c}, R. Bistro{\\'n}, A. Rico, A. Lakshminarayan, and\n  K. {\\.{Z}}yczkowski, ``Absolutely Maximally Entangled Pure States of\n  Multipartite Quantum Systems,'' \\emph{Reports on Progress in Physics}\n  \\textbf{89}, 057601 (2026).\n  \\href{https://doi.org/10.1088/1361-6633/ae672a}{doi:10.1088/1361-6633/ae672a};\n  \\href{https://arxiv.org/abs/2508.04777}{arXiv:2508.04777v3}."}],"comment":"The remaining task is either to exhibit an AME parameter pair whose full LU\nquotient is a discrete non-singleton set, or to prove that every nonempty\n$\\mathfrak{M}_{N,d}$ is a singleton or infinite.  Classifying only a selected\nconstruction family would not determine the full quotient in\nEq.~\\eqref{eq:p43-finite-nontrivial-moduli}."}}
---
## Source

Rajchel-Mieldzioć et al. explicitly ask whether an AME family can have a finite number of local-unitary equivalence classes greater than one [RBR+26](https://doi.org/10.1088/1361-6633/ae672a).

## Progress

For four parties, all $\operatorname{AME}(4,3)$ states lie in one LU class, whereas $\operatorname{AME}(4,d)$ has infinitely many LU classes for every $d\geq 4$ [RRKL23](https://doi.org/10.1103/PhysRevA.108.032412). The latter theorem includes infinitely many inequivalent $\operatorname{AME}(4,6)$ states, so neither side of this classification realizes Eq. (3).

Tan completely classifies five-qubit AME states: every such state is LU equivalent to a point of the unique $((5,2,3))$ code $\mathcal C$, and two points of $\mathcal C$ are equivalent exactly when related by its finite binary-tetrahedral transversal group [Tan26](https://arxiv.org/abs/2507.02185). Because the projective state space of the two-dimensional code is a continuum while this group is finite, $\lvert\mathfrak{M}_{5,2}\rvert$ is infinite, not finite and nontrivial.

The 2026 AME review records the known one-class and infinite-class regimes and explicitly leaves Eq. (3) as open problem T5 [RBR+26](https://doi.org/10.1088/1361-6633/ae672a).

## Comment

The remaining task is either to exhibit an AME parameter pair whose full LU quotient is a discrete non-singleton set, or to prove that every nonempty $\mathfrak{M}_{N,d}$ is a singleton or infinite. Classifying only a selected construction family would not determine the full quotient in Eq. (3).

## References

**RRKL23** S. A. Rather, N. Ramadas, V. Kodiyalam, and A. Lakshminarayan, “Absolutely Maximally Entangled State Equivalence and the Construction of Infinite Quantum Solutions to the Problem of 36 Officers of Euler,” *Physical Review A* **108**, 032412 (2023). [doi:10.1103/PhysRevA.108.032412](https://doi.org/10.1103/PhysRevA.108.032412); [arXiv:2212.06737](https://arxiv.org/abs/2212.06737).

**Tan26** I. Tan, “Classification of Five-Qubit Absolutely Maximally Entangled States,” arXiv:2507.02185v4 (2026). [arXiv:2507.02185](https://arxiv.org/abs/2507.02185).

**RBR+26** G. Rajchel-Mieldzioć, R. Bistroń, A. Rico, A. Lakshminarayan, and K. Życzkowski, “Absolutely Maximally Entangled Pure States of Multipartite Quantum Systems,” *Reports on Progress in Physics* **89**, 057601 (2026). [doi:10.1088/1361-6633/ae672a](https://doi.org/10.1088/1361-6633/ae672a); [arXiv:2508.04777v3](https://arxiv.org/abs/2508.04777).
