---
id: "01M20E31B526DAX81WYGMDD01T"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-08T13:38:52.186Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity-and-computability","hamiltonian-complexity","quantum-max-cut"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Is bipartite Quantum Max-Cut in BPP?"
aliases: ["op-1576e5f52f7ff3b2","op_1576e5f52f7ff3b2","01M20E31B526DAX81WYGMDD01T"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_1576e5f52f7ff3b2.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_1576e5f52f7ff3b2","ulid":"01M20E31B526DAX81WYGMDD01T","aliases":["op_1576e5f52f7ff3b2","01M20E31B526DAX81WYGMDD01T","op-1576e5f52f7ff3b2"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-08T11:57:38.533Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity-and-computability","hamiltonian-complexity","quantum-max-cut"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Is bipartite Quantum Max-Cut in BPP?","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity and computability","Hamiltonian complexity","Quantum Max-Cut"],"statement":"Is the following bipartite Quantum Max-Cut promise problem in\n$\\mathrm{BPP}$? Given a bipartite graph $G=(V,E)$ with $|V|=n$,\npolynomially bounded nonnegative rational weights $w_{ij}$, and rational\nthresholds $a<b$ with $b-a\\geq1/\\operatorname{poly}(n)$, define\n\\begin{equation}\n  H_G:=\\sum_{\\{i,j\\}\\in E}w_{ij}(X_iX_j+Y_iY_j+Z_iZ_j),\n  \\qquad E_0:=\\lambda_{\\min}(H_G).\n  \\label{eq:bqmc-ground-energy}\n\\end{equation}\nHere $X_i,Y_i,Z_i$ are Pauli operators on qubit $i$.\nFor the energy in Eq.~\\eqref{eq:bqmc-ground-energy}, distinguish\n$E_0\\leq a$ from $E_0\\geq b$, promised one holds, using a randomized\nclassical algorithm polynomial in the input length and correct with\nprobability at least $2/3$.","source":"The remaining classical part of Open question 3.4 in Gharibian's\n\\emph{The 7 faces of quantum NP}, Section 3, arXiv page 7\n\\sourcecite{ref:bqmc-gharibian}{Gha24}.\nThe original question asks for the complexity of bipartite QMC;\nthe present formulation focuses on $\\mathrm{BPP}$ membership following\nthe 2026 $\\mathrm{BQP}$ upper bound \\sourcecite{ref:bqmc-rt}{RT26}.","progress":["Earlier upper bound: conjugating one bipartition by Pauli $Y$ makes\n$H_G$ stoquastic, placing bipartite QMC in $\\mathrm{StoqMA}$\n(summarized in Section 3) \\sourcecite{ref:bqmc-gharibian}{Gha24}.","July 2026: Rayudu--Takahashi prove a Lee-Yang spectral gap at least\n$h/4$ under field strength $h>0$, enabling adiabatic ground-energy\nestimation to inverse-polynomial additive error and establishing\n$\\mathrm{BQP}$ membership (Theorem 11; Section 1.1)\n\\sourcecite{ref:bqmc-rt}{RT26}.","Independently, Bravyi--Gosset--Liu--Wong give a\n$\\operatorname{poly}(n,J,1/\\epsilon)$-time quantum algorithm for\nadditive-$\\epsilon$ ground-energy estimation on weighted bipartite graphs,\nwhere $J=\\max_{\\{i,j\\}\\in E}w_{ij}$ (Corollary 2)\n\\sourcecite{ref:bqmc-bglw}{BGLW26}."],"references":[{"key":"Gha24","label":"ref:bqmc-gharibian","tex":"S. Gharibian, \"Guest Column: The 7 faces of quantum NP,\"\n\\emph{ACM SIGACT News} \\textbf{54}(4), 54--91 (2024).\n\\href{https://doi.org/10.1145/3639528.3639535}{doi:10.1145/3639528.3639535};\n\\href{https://arxiv.org/abs/2310.18010}{arXiv:2310.18010} (2023 preprint)."},{"key":"RT26","label":"ref:bqmc-rt","tex":"C. Rayudu and J. Takahashi, \"Spectral gap of Lee-Yang Hamiltonians,\"\narXiv preprint (July 2026).\n\\href{https://doi.org/10.48550/arXiv.2607.10765}{doi:10.48550/arXiv.2607.10765};\n\\href{https://arxiv.org/abs/2607.10765v1}{arXiv:2607.10765v1}."},{"key":"BGLW26","label":"ref:bqmc-bglw","tex":"S. Bravyi, D. Gosset, Y. Liu, and B. Wong,\n\"Efficient quantum algorithm for Heisenberg spin systems,\"\narXiv preprint (July 2026).\n\\href{https://doi.org/10.48550/arXiv.2607.14401}{doi:10.48550/arXiv.2607.14401};\n\\href{https://arxiv.org/abs/2607.14401v1}{arXiv:2607.14401v1}."}],"comment":"Membership in $\\mathrm{BPP}$ remains open: the quantum upper bound\nleaves classical complexity unresolved \\sourcecite{ref:bqmc-rt}{RT26}.\nHere $\\mathrm{BPP}$ and $\\mathrm{BQP}$ denote their promise-problem\nversions. The target is inverse-polynomial additive precision."}}
---
## Source

The remaining classical part of Open question 3.4 in Gharibian’s *The 7 faces of quantum NP*, Section 3, arXiv page 7 [Gha24](https://doi.org/10.1145/3639528.3639535). The original question asks for the complexity of bipartite QMC; the present formulation focuses on $\mathrm{BPP}$ membership following the 2026 $\mathrm{BQP}$ upper bound [RT26](https://doi.org/10.48550/arXiv.2607.10765).

## Progress

Earlier upper bound: conjugating one bipartition by Pauli $Y$ makes $H_G$ stoquastic, placing bipartite QMC in $\mathrm{StoqMA}$ (summarized in Section 3) [Gha24](https://doi.org/10.1145/3639528.3639535).

July 2026: Rayudu–Takahashi prove a Lee-Yang spectral gap at least $h/4$ under field strength $h>0$, enabling adiabatic ground-energy estimation to inverse-polynomial additive error and establishing $\mathrm{BQP}$ membership (Theorem 11; Section 1.1) [RT26](https://doi.org/10.48550/arXiv.2607.10765).

Independently, Bravyi–Gosset–Liu–Wong give a $\operatorname{poly}(n,J,1/\epsilon)$-time quantum algorithm for additive-$\epsilon$ ground-energy estimation on weighted bipartite graphs, where $J=\max_{\{i,j\}\in E}w_{ij}$ (Corollary 2) [BGLW26](https://doi.org/10.48550/arXiv.2607.14401).

## Comment

Membership in $\mathrm{BPP}$ remains open: the quantum upper bound leaves classical complexity unresolved [RT26](https://doi.org/10.48550/arXiv.2607.10765). Here $\mathrm{BPP}$ and $\mathrm{BQP}$ denote their promise-problem versions. The target is inverse-polynomial additive precision.

## References

**Gha24** S. Gharibian, "Guest Column: The 7 faces of quantum NP," *ACM SIGACT News* **54**(4), 54–91 (2024). [doi:10.1145/3639528.3639535](https://doi.org/10.1145/3639528.3639535); [arXiv:2310.18010](https://arxiv.org/abs/2310.18010) (2023 preprint).

**RT26** C. Rayudu and J. Takahashi, "Spectral gap of Lee-Yang Hamiltonians," arXiv preprint (July 2026). [doi:10.48550/arXiv.2607.10765](https://doi.org/10.48550/arXiv.2607.10765); [arXiv:2607.10765v1](https://arxiv.org/abs/2607.10765v1).

**BGLW26** S. Bravyi, D. Gosset, Y. Liu, and B. Wong, "Efficient quantum algorithm for Heisenberg spin systems," arXiv preprint (July 2026). [doi:10.48550/arXiv.2607.14401](https://doi.org/10.48550/arXiv.2607.14401); [arXiv:2607.14401v1](https://arxiv.org/abs/2607.14401v1).
