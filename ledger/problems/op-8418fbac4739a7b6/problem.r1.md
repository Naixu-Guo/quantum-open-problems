---
id: "01M8CYD2G69BNE4X6C1J37P4A6"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-26T22:14:13.511Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-distillation","bound-entanglement","local-operations-and-classical-communication"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME780V1V27MDXXVA3SCW5"]
title: "Minimum rank of NPT bound-entangled states"
aliases: ["op-8418fbac4739a7b6","op_8418fbac4739a7b6","01M8CYD2G69BNE4X6C1J37P4A6"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_8418fbac4739a7b6.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_8418fbac4739a7b6","ulid":"01M8CYD2G69BNE4X6C1J37P4A6","aliases":["op_8418fbac4739a7b6","01M8CYD2G69BNE4X6C1J37P4A6","op-8418fbac4739a7b6"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-26T22:07:48.742Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-distillation","bound-entanglement","local-operations-and-classical-communication"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME780V1V27MDXXVA3SCW5"]},"title":"Minimum rank of NPT bound-entangled states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement distillation","Bound entanglement","Local operations and classical communication"],"statement":"What is the smallest rank of a finite-dimensional bipartite state with negative\npartial transpose (NPT) that is undistillable under two-way local operations and classical communication\n(LOCC)? Let $\\rho_{AB}$ be a density operator on\n$\\mathbb C^{d_A}\\otimes\\mathbb C^{d_B}$, with finite integers $d_A,d_B\\geq2$,\n$\\rho_{AB}\\succeq0$, and $\\operatorname{Tr}\\rho_{AB}=1$.\nWrite $\\rho_{AB}^{T_B}=(\\operatorname{id}_A\\otimes T_B)(\\rho_{AB})$ for\npartial transposition on $B$. The state is NPT when\n$\\rho_{AB}^{T_B}\\not\\succeq0$.\n\nA fixed state is undistillable precisely when, for every integer $n\\geq1$\nand every unit vector $\\lvert\\psi_n\\rangle$ of Schmidt rank at most two\nacross the bipartition $A^n:B^n$, it satisfies\n\\begin{equation}\n  \\langle\\psi_n\\rvert(\\rho_{AB}^{T_B})^{\\otimes n}\\lvert\\psi_n\\rangle\\geq0.\n  \\label{eq:a7b6-all-copy}\n\\end{equation}\nDetermine the exact minimum\n\\begin{equation}\n  r_{\\min}:=\\min_{\\rho_{AB}}\\operatorname{rank}(\\rho_{AB}),\n  \\label{eq:a7b6-minimum-rank}\n\\end{equation}\nwhere the minimization ranges over all NPT density operators satisfying\nEq.~\\eqref{eq:a7b6-all-copy}, allowing arbitrary finite local dimensions.\nThe rank in Eq.~\\eqref{eq:a7b6-minimum-rank} is the operator rank of the\njoint density matrix. A complete solution must exhibit a state attaining\nthe proposed minimum and prove that every NPT state of smaller rank is\ndistillable, in every finite-dimensional bipartite system.","source":"This minimum-rank formulation is derived from the low-rank obstruction and\nrank-five conjecture of Chen and \\DJ okovi\\'c\n\\sourcecite{ref:a7b6-chen-djokovic}{CD16}, Theorem 5, Corollary 6, and\nConjecture 9, together with the NPT bound-entangled construction in\nFaisal's Theorem 1 \\sourcecite{ref:a7b6-faisal}{Fai26}.\nThe criterion in Eq.~\\eqref{eq:a7b6-all-copy} is the finite-copy\ndistillability criterion of Horodecki, Horodecki, and Horodecki\n\\sourcecite{ref:a7b6-horodecki}{HHH98}.","progress":["Chen and \\DJ okovi\\'c proved that every rank-four NPT state is\none-copy distillable; together with the lower-rank cases, this gives\n\\begin{equation}\n  \\operatorname{rank}(\\rho_{AB})\\leq4,\\quad\n  \\rho_{AB}^{T_B}\\not\\succeq0\n  \\quad\\Longrightarrow\\quad\n  \\rho_{AB}\\text{ is one-copy distillable}.\n  \\label{eq:a7b6-low-rank}\n\\end{equation}\nThus Eq.~\\eqref{eq:a7b6-low-rank} implies $r_{\\min}\\geq5$\n\\sourcecite{ref:a7b6-chen-djokovic}{CD16}, Theorem 5 and Corollary 6.","Chen and \\DJ okovi\\'c also constructed rank-five two-qutrit NPT\nstates $\\rho_\\epsilon$ in Section III. Their Lemma 8 establishes\n\\begin{equation}\n  \\forall\\,n\\geq1\\ \\exists\\,\\delta_n>0\\ \\forall\\,\\epsilon\\in(0,\\delta_n]:\n  \\quad\\rho_\\epsilon\\text{ is }n\\text{-undistillable}.\n  \\label{eq:a7b6-fixed-copy}\n\\end{equation}\nEquation~\\eqref{eq:a7b6-fixed-copy} permits the parameter to depend on\nthe copy number. Their Conjecture 9 asks for a fixed positive parameter\nthat gives undistillability for every copy number; such a state would\nattain $r_{\\min}=5$\n\\sourcecite{ref:a7b6-chen-djokovic}{CD16}.","For a different family of symmetric rank-five two-qutrit states,\nLei, Song, Chen, and Liu proved one-copy undistillability on the NPT\nparameter interval $[(24\\sqrt2-33)/7,(33-12\\sqrt6)/25)$ in Proposition 7.\nProposition 8 restricts possible two-copy negative-expectation witnesses:\na Schmidt-rank-at-most-two witness must have a component outside a\nspecified $17$-dimensional subspace. These results establish neither\ntwo-copy nor all-copy undistillability\n\\sourcecite{ref:a7b6-lei-et-al}{LSC+26}.","Faisal's Theorem 1, in arXiv preprint version 1 submitted on\n25 November 2026, supplies the fixed NPT state\n\\begin{equation}\n  \\rho_* = \\frac{23I-3F}{1448}\n  \\quad\\text{on }\\mathbb C^8\\otimes\\mathbb C^8,\n  \\qquad F\\lvert x\\rangle\\lvert y\\rangle=\\lvert y\\rangle\\lvert x\\rangle,\n  \\label{eq:a7b6-upper-example}\n\\end{equation}\nand proves its undistillability under two-way LOCC for all copy numbers\n\\sourcecite{ref:a7b6-faisal}{Fai26}.\nThe state in Eq.~\\eqref{eq:a7b6-upper-example} has eigenvalues $20/1448$\nand $26/1448$ on the symmetric and antisymmetric subspaces, of dimensions\n$36$ and $28$, respectively. It therefore has rank $64$ and yields\n$r_{\\min}\\leq64$. Its partial transpose has a negative eigenvalue\n$-1/1448$."],"references":[{"key":"HHH98","label":"ref:a7b6-horodecki","tex":"M. Horodecki, P. Horodecki, and R. Horodecki,\n  ``Mixed-State Entanglement and Distillation: Is There a ``Bound''\n  Entanglement in Nature?''\n  \\emph{Physical Review Letters} \\textbf{80}, 5239--5242 (1998).\n  \\href{https://doi.org/10.1103/PhysRevLett.80.5239}{doi:10.1103/PhysRevLett.80.5239};\n  \\href{https://arxiv.org/abs/quant-ph/9801069}{arXiv:quant-ph/9801069}."},{"key":"CD16","label":"ref:a7b6-chen-djokovic","tex":"L. Chen and D. \\v{Z}. \\DJ okovi\\'c,\n  ``Distillability of Non-Positive-Partial-Transpose Bipartite Quantum States\n  of Rank Four,'' \\emph{Physical Review A} \\textbf{94}, 052318 (2016).\n  \\href{https://doi.org/10.1103/PhysRevA.94.052318}{doi:10.1103/PhysRevA.94.052318};\n  \\href{https://arxiv.org/abs/1602.04416}{arXiv:1602.04416}."},{"key":"LSC+26","label":"ref:a7b6-lei-et-al","tex":"Y. Lei, Z. Song, L. Chen, and M. Liu,\n  ``Entanglement Distillation of Some Rank-Five Symmetric NPT States in\n  Two-Qutrit Systems,'' arXiv:2608.03710 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2608.03710}{doi:10.48550/arXiv.2608.03710};\n  \\href{https://arxiv.org/abs/2608.03710}{arXiv:2608.03710}."},{"key":"Fai26","label":"ref:a7b6-faisal","tex":"I. Faisal,\n  “Bound Entanglement with Negative Partial Transpose Exists,”\n  arXiv:2611.34921v1 (2026), preprint, version 1, submitted 25 November 2026.\n  \\href{https://doi.org/10.48550/arXiv.2611.34921}{doi:10.48550/arXiv.2611.34921};\n  \\href{https://arxiv.org/abs/2611.34921v1}{arXiv:2611.34921v1}."}],"comment":"The cited lower-rank theorem and explicit construction give\n\\begin{equation}\n  5\\leq r_{\\min}\\leq64.\n  \\label{eq:a7b6-bounds}\n\\end{equation}\nThe exact value within Eq.~\\eqref{eq:a7b6-bounds} remains unresolved.\nIn particular, the existence of a rank-five NPT bound-entangled state\nwould attain the lower bound; excluding rank five alone would still leave\nthe higher ranks to determine.\n\nThe related \\href{https://qiqc-op.com/problem/op_74c4ffb5b042baf2/}{existence\nof NPT bound entanglement} problem asks whether any such state exists.\nThe present question asks for the least possible rank. It imposes no\nWerner symmetry or fixed local dimension. Proving a minimum within a\nparticular family or dimension, or verifying only finitely many tensor\npowers, does not settle this unrestricted minimum.","contributors":[]}}
---
## Source

This minimum-rank formulation is derived from the low-rank obstruction and rank-five conjecture of Chen and Đoković [CD16](https://doi.org/10.1103/PhysRevA.94.052318), Theorem 5, Corollary 6, and Conjecture 9, together with the NPT bound-entangled construction in Faisal’s Theorem 1 [Fai26](https://doi.org/10.48550/arXiv.2611.34921). The criterion in Eq. (1) is the finite-copy distillability criterion of Horodecki, Horodecki, and Horodecki [HHH98](https://doi.org/10.1103/PhysRevLett.80.5239).

## Progress

Chen and Đoković proved that every rank-four NPT state is one-copy distillable; together with the lower-rank cases, this gives

$$
\operatorname{rank}(\rho_{AB})\leq4,\quad
 \rho_{AB}^{T_B}\not\succeq0
 \quad\Longrightarrow\quad
 \rho_{AB}\text{ is one-copy distillable}.
\tag{3}
$$

Thus Eq. (3) implies $r_{\min}\geq5$ [CD16](https://doi.org/10.1103/PhysRevA.94.052318), Theorem 5 and Corollary 6.

Chen and Đoković also constructed rank-five two-qutrit NPT states $\rho_\epsilon$ in Section III. Their Lemma 8 establishes

$$
\forall\,n\geq1\ \exists\,\delta_n>0\ \forall\,\epsilon\in(0,\delta_n]:
 \quad\rho_\epsilon\text{ is }n\text{-undistillable}.
\tag{4}
$$

Equation (4) permits the parameter to depend on the copy number. Their Conjecture 9 asks for a fixed positive parameter that gives undistillability for every copy number; such a state would attain $r_{\min}=5$ [CD16](https://doi.org/10.1103/PhysRevA.94.052318).

For a different family of symmetric rank-five two-qutrit states, Lei, Song, Chen, and Liu proved one-copy undistillability on the NPT parameter interval $[(24\sqrt2-33)/7,(33-12\sqrt6)/25)$ in Proposition 7. Proposition 8 restricts possible two-copy negative-expectation witnesses: a Schmidt-rank-at-most-two witness must have a component outside a specified $17$-dimensional subspace. These results establish neither two-copy nor all-copy undistillability [LSC+26](https://doi.org/10.48550/arXiv.2608.03710).

Faisal’s Theorem 1, in arXiv preprint version 1 submitted on 25 November 2026, supplies the fixed NPT state

$$
\rho_* = \frac{23I-3F}{1448}
 \quad\text{on }\mathbb C^8\otimes\mathbb C^8,
 \qquad F\lvert x\rangle\lvert y\rangle=\lvert y\rangle\lvert x\rangle,
\tag{5}
$$

and proves its undistillability under two-way LOCC for all copy numbers [Fai26](https://doi.org/10.48550/arXiv.2611.34921). The state in Eq. (5) has eigenvalues $20/1448$ and $26/1448$ on the symmetric and antisymmetric subspaces, of dimensions $36$ and $28$, respectively. It therefore has rank $64$ and yields $r_{\min}\leq64$. Its partial transpose has a negative eigenvalue $-1/1448$.

## Comment

The cited lower-rank theorem and explicit construction give

$$
5\leq r_{\min}\leq64.
\tag{6}
$$

The exact value within Eq. (6) remains unresolved. In particular, the existence of a rank-five NPT bound-entangled state would attain the lower bound; excluding rank five alone would still leave the higher ranks to determine.

The related [existence of NPT bound entanglement](https://qiqc-op.com/problem/op_74c4ffb5b042baf2/) problem asks whether any such state exists. The present question asks for the least possible rank. It imposes no Werner symmetry or fixed local dimension. Proving a minimum within a particular family or dimension, or verifying only finitely many tensor powers, does not settle this unrestricted minimum.

## References

**HHH98** M. Horodecki, P. Horodecki, and R. Horodecki, “Mixed-State Entanglement and Distillation: Is There a “Bound” Entanglement in Nature?” *Physical Review Letters* **80**, 5239–5242 (1998). [doi:10.1103/PhysRevLett.80.5239](https://doi.org/10.1103/PhysRevLett.80.5239); [arXiv:quant-ph/9801069](https://arxiv.org/abs/quant-ph/9801069).

**CD16** L. Chen and D. Ž. Đoković, “Distillability of Non-Positive-Partial-Transpose Bipartite Quantum States of Rank Four,” *Physical Review A* **94**, 052318 (2016). [doi:10.1103/PhysRevA.94.052318](https://doi.org/10.1103/PhysRevA.94.052318); [arXiv:1602.04416](https://arxiv.org/abs/1602.04416).

**LSC+26** Y. Lei, Z. Song, L. Chen, and M. Liu, “Entanglement Distillation of Some Rank-Five Symmetric NPT States in Two-Qutrit Systems,” arXiv:2608.03710 (2026). [doi:10.48550/arXiv.2608.03710](https://doi.org/10.48550/arXiv.2608.03710); [arXiv:2608.03710](https://arxiv.org/abs/2608.03710).

**Fai26** I. Faisal, “Bound Entanglement with Negative Partial Transpose Exists,” arXiv:2611.34921v1 (2026), preprint, version 1, submitted 25 November 2026. [doi:10.48550/arXiv.2611.34921](https://doi.org/10.48550/arXiv.2611.34921); [arXiv:2611.34921v1](https://arxiv.org/abs/2611.34921v1).
