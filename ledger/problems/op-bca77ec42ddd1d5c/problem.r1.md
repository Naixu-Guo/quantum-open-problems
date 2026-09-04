---
id: "01M1HME780S5JZKCQN8X0RR8TG"
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
areaIds: ["quantum-algorithm"]
topicIds: ["hamiltonian-complexity","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "The quantum PCP conjecture"
aliases: ["op-bca77ec42ddd1d5c","op_bca77ec42ddd1d5c","01M1HME780S5JZKCQN8X0RR8TG","theoremdb-p42-quantum-pcp-conjecture","theoremdb-p42"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_bca77ec42ddd1d5c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_bca77ec42ddd1d5c","ulid":"01M1HME780S5JZKCQN8X0RR8TG","aliases":["op_bca77ec42ddd1d5c","01M1HME780S5JZKCQN8X0RR8TG","op-bca77ec42ddd1d5c","theoremdb-p42-quantum-pcp-conjecture","theoremdb-p42"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["hamiltonian-complexity","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"The quantum PCP conjecture","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Hamiltonian complexity","Computational complexity and computability"],"statement":"Is the constant-relative-gap local Hamiltonian problem QMA-hard?  More\nprecisely, do there exist fixed integers $q,k\\geq2$ and constants\n$0\\leq a<b\\leq1$ such that the following promise problem is QMA-hard?  An\ninstance consists of $n$ subsystems of local dimension $q$ and\n$m=\\operatorname{poly}(n)$ positive semidefinite terms, each specified with\npolynomially many bits, for which\n\\begin{equation}\n  H:=\\sum_{i=1}^{m}H_i,\n  \\qquad\n  0\\preceq H_i\\preceq I,\n  \\qquad\n  \\lvert\\operatorname{supp}(H_i)\\rvert\\leq k.\n  \\label{eq:p62-local-hamiltonian}\n\\end{equation}\nGiven the Hamiltonian in Eq.~\\eqref{eq:p62-local-hamiltonian}, distinguish\nthe promised alternatives\n\\begin{equation}\n  \\lambda_{\\min}(H)\\leq am\n  \\qquad\\text{and}\\qquad\n  \\lambda_{\\min}(H)\\geq bm.\n  \\label{eq:p62-constant-gap-promise}\n\\end{equation}\nThus the gap in Eq.~\\eqref{eq:p62-constant-gap-promise} is a fixed positive\nfraction $(b-a)m$ of the number of local terms, independent of $n$.","source":"Aharonov, Arad, and Vidick give the standard constant-relative-gap local\nHamiltonian formulation as Conjecture~1.3 of their quantum-PCP survey\n\\sourcecite{ref:p62-aharonov}{AAV13}.","progress":["Aharonov, Arad, and Vidick review the QMA-completeness of local\n  Hamiltonian with an inverse-polynomial promise gap and formulate the\n  constant-gap strengthening in\n  Eq.~\\eqref{eq:p62-constant-gap-promise}\n  \\sourcecite{ref:p62-aharonov}{AAV13}.  Gap amplification methods known for\n  classical constraint systems do not establish the quantum statement.","Anshu, Breuckmann, and Nirkhe construct local Hamiltonians with the\n  no-low-energy-trivial-states property from good quantum LDPC codes\n  \\sourcecite{ref:p62-anshu}{ABN23}.  This establishes the required\n  low-energy entanglement phenomenon but does not prove QMA-hardness of the\n  promise problem in Eqs.~\\eqref{eq:p62-local-hamiltonian} and\n  \\eqref{eq:p62-constant-gap-promise}.","Buhrman, Helsen, and Weggemans prove reductions among several\n  quantum-PCP formulations and oracle separations showing that a proof of\n  constant-gap local-Hamiltonian hardness must use nonrelativizing\n  techniques \\sourcecite{ref:p62-buhrman}{BHW25}.  Their results restrict\n  possible proofs but neither prove nor refute the conjecture."],"references":[{"key":"AAV13","label":"ref:p62-aharonov","tex":"D. Aharonov, I. Arad, and T. Vidick,\n  ``Guest Column: The Quantum PCP Conjecture,''\n  \\emph{ACM SIGACT News} \\textbf{44}(2), 47--79 (2013).\n  \\href{https://doi.org/10.1145/2491533.2491549}{doi:10.1145/2491533.2491549};\n  \\href{https://arxiv.org/abs/1309.7495}{arXiv:1309.7495}."},{"key":"ABN23","label":"ref:p62-anshu","tex":"A. Anshu, N. P. Breuckmann, and C. Nirkhe,\n  ``NLTS Hamiltonians from Good Quantum Codes,'' in\n  \\emph{Proceedings of the 55th Annual ACM Symposium on Theory of Computing},\n  1090--1096 (2023).\n  \\href{https://doi.org/10.1145/3564246.3585114}{doi:10.1145/3564246.3585114};\n  \\href{https://arxiv.org/abs/2206.13228}{arXiv:2206.13228}."},{"key":"BHW25","label":"ref:p62-buhrman","tex":"H. Buhrman, J. Helsen, and J. Weggemans,\n  ``Quantum PCPs: On Adaptivity, Multiple Provers and Reductions to Local\n  Hamiltonians,'' \\emph{Quantum} \\textbf{9}, 1791 (2025).\n  \\href{https://doi.org/10.22331/q-2025-07-11-1791}{doi:10.22331/q-2025-07-11-1791};\n  \\href{https://arxiv.org/abs/2403.04841}{arXiv:2403.04841}."}],"comment":"NLTS supplies a central structural prerequisite, and the known reductions\nclarify which formulations and proof methods are viable, but neither gives\nthe constant-gap QMA-hardness required by\nEq.~\\eqref{eq:p62-constant-gap-promise}.  No algorithmic obstruction that\nwould refute that hardness statement is known either."}}
---
## Source

Aharonov, Arad, and Vidick give the standard constant-relative-gap local Hamiltonian formulation as Conjecture 1.3 of their quantum-PCP survey [AAV13](https://doi.org/10.1145/2491533.2491549).

## Progress

Aharonov, Arad, and Vidick review the QMA-completeness of local Hamiltonian with an inverse-polynomial promise gap and formulate the constant-gap strengthening in Eq. (2) [AAV13](https://doi.org/10.1145/2491533.2491549). Gap amplification methods known for classical constraint systems do not establish the quantum statement.

Anshu, Breuckmann, and Nirkhe construct local Hamiltonians with the no-low-energy-trivial-states property from good quantum LDPC codes [ABN23](https://doi.org/10.1145/3564246.3585114). This establishes the required low-energy entanglement phenomenon but does not prove QMA-hardness of the promise problem in Eqs. (1) and (2).

Buhrman, Helsen, and Weggemans prove reductions among several quantum-PCP formulations and oracle separations showing that a proof of constant-gap local-Hamiltonian hardness must use nonrelativizing techniques [BHW25](https://doi.org/10.22331/q-2025-07-11-1791). Their results restrict possible proofs but neither prove nor refute the conjecture.

## Comment

NLTS supplies a central structural prerequisite, and the known reductions clarify which formulations and proof methods are viable, but neither gives the constant-gap QMA-hardness required by Eq. (2). No algorithmic obstruction that would refute that hardness statement is known either.

## References

**AAV13** D. Aharonov, I. Arad, and T. Vidick, “Guest Column: The Quantum PCP Conjecture,” *ACM SIGACT News* **44**(2), 47–79 (2013). [doi:10.1145/2491533.2491549](https://doi.org/10.1145/2491533.2491549); [arXiv:1309.7495](https://arxiv.org/abs/1309.7495).

**ABN23** A. Anshu, N. P. Breuckmann, and C. Nirkhe, “NLTS Hamiltonians from Good Quantum Codes,” in *Proceedings of the 55th Annual ACM Symposium on Theory of Computing*, 1090–1096 (2023). [doi:10.1145/3564246.3585114](https://doi.org/10.1145/3564246.3585114); [arXiv:2206.13228](https://arxiv.org/abs/2206.13228).

**BHW25** H. Buhrman, J. Helsen, and J. Weggemans, “Quantum PCPs: On Adaptivity, Multiple Provers and Reductions to Local Hamiltonians,” *Quantum* **9**, 1791 (2025). [doi:10.22331/q-2025-07-11-1791](https://doi.org/10.22331/q-2025-07-11-1791); [arXiv:2403.04841](https://arxiv.org/abs/2403.04841).
