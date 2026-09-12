---
id: "01M22C44153TRK3JWDTNCS9RWZ"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T06:02:34.082Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm","quantum-resource-theory"]
topicIds: ["local-unitary-equivalence","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1Q787QR08CREPZSZYDXBTGN"]
title: "Polynomial-time local-unitary equivalence of graph states"
aliases: ["op-66affd4b198fd445","op_66affd4b198fd445","01M22C44153TRK3JWDTNCS9RWZ"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_66affd4b198fd445.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_66affd4b198fd445","ulid":"01M22C44153TRK3JWDTNCS9RWZ","aliases":["op_66affd4b198fd445","01M22C44153TRK3JWDTNCS9RWZ","op-66affd4b198fd445"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T06:01:45.765Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm","quantum-resource-theory"],"topicIds":["local-unitary-equivalence","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1Q787QR08CREPZSZYDXBTGN"]},"title":"Polynomial-time local-unitary equivalence of graph states","status":"Unsolved","fields":["Quantum algorithm","Quantum Resource Theory"],"topics":["Local unitary equivalence","Computational complexity and computability"],"statement":"Does a deterministic classical algorithm running in $n^{O(1)}$ time decide local-unitary equivalence of arbitrary graph states on $n$ labelled qubits? The input consists of two finite simple graphs $G$ and $H$ on the same labelled vertex set $[n]:=\\{1,\\ldots,n\\}$, for any integer $n\\geq1$. For $F\\in\\{G,H\\}$, define its graph state by Eq.~\\eqref{eq:glu-state}:\n\\begin{equation}\n\\begin{aligned}\n|F\\rangle&:=\\prod_{\\{u,v\\}\\in E(F)}CZ_{uv}|+\\rangle^{\\otimes n},\\\\\n|+\\rangle&:=\\frac{|0\\rangle+|1\\rangle}{\\sqrt2},\n\\qquad CZ:=\\operatorname{diag}(1,1,1,-1).\n\\end{aligned}\n\\label{eq:glu-state}\n\\end{equation}\nWith $U(2)$ denoting the group of single-qubit unitary matrices, the required decision predicate is Eq.~\\eqref{eq:glu-equivalence}, with vertex labels fixed:\n\\begin{equation}\n\\begin{aligned}\n|G\\rangle\\sim_{\\mathrm{LU}}|H\\rangle\n\\quad:\\Longleftrightarrow\\quad\n&\\exists U_1,\\ldots,U_n\\in U(2),\\ \\exists\\phi\\in\\mathbb R:\\\\\n&|H\\rangle=e^{i\\phi}\\left(\\bigotimes_{v=1}^{n}U_v\\right)|G\\rangle.\n\\end{aligned}\n\\label{eq:glu-equivalence}\n\\end{equation}","source":"Claudet explicitly asks whether local-unitary equivalence of graph states can be decided in polynomial time in Chapter 8, Conclusion, p.~107 of his thesis (arXiv version 2) \\sourcecite{ref:glu-thesis}{Cla25}. The input convention here keeps the vertex labels fixed, as in the quasi-polynomial algorithm of Claudet and Perdrix \\sourcecite{ref:glu-quasipolynomial}{CP25}.","progress":["Local-Clifford equivalence, denoted by $\\sim_{\\mathrm{LC}}$ and obtained by restricting each $U_v$ to a unitary that normalizes the single-qubit Pauli group, has a deterministic decision algorithm (Lemma 1 and the following discussion, p.~2) with running time\n  \\begin{equation}\nT_{\\mathrm{LC}}(n)=O(n^4).\n\\label{eq:glu-progress-3}\n\\end{equation}\n  The algorithm with running time in Eq.~\\eqref{eq:glu-progress-3} also constructs an equivalence transformation when one exists; this solves the restricted Clifford problem, not the general unitary problem. \\sourcecite{ref:glu-lc}{VDD04}","Claudet and Perdrix give an exact deterministic algorithm (Theorem 30, Section 3.5, p.~59:15) for the general problem with running time\n  \\begin{equation}\nT_{\\mathrm{LU}}(n)=n^{\\log_2 n+O(1)}.\n\\label{eq:glu-progress-4}\n\\end{equation}\n  By Eq.~\\eqref{eq:glu-progress-4}, the finite-input problem is decidable, but the established bound is quasi-polynomial rather than polynomial; Claudet's subsequent thesis explicitly identifies the polynomial-time question as unresolved. \\sourcecite{ref:glu-quasipolynomial}{CP25}, \\sourcecite{ref:glu-thesis}{Cla25}","The 2026 circle-graph result (Theorem 1) establishes\n  \\begin{equation}\nG\\text{ is a circle graph}\n  \\quad\\Longrightarrow\\quad\n  \\left(|G\\rangle\\sim_{\\mathrm{LU}}|H\\rangle\n  \\Longleftrightarrow\n  |G\\rangle\\sim_{\\mathrm{LC}}|H\\rangle\\right),\n\\label{eq:glu-progress-5}\n\\end{equation}\n  In Eq.~\\eqref{eq:glu-progress-5}, a circle graph is the intersection graph of chords of a circle and $H$ is any graph on the same labelled vertices; consequently this subclass admits a polynomial-time decision algorithm. \\sourcecite{ref:glu-circle}{HMNC26}"],"references":[{"key":"VDD04","label":"ref:glu-lc","tex":"M. Van den Nest, J. Dehaene, and B. De Moor, ``Efficient Algorithm to Recognize the Local Clifford Equivalence of Graph States,'' \\emph{Physical Review A} \\textbf{70}, 034302 (2004). \\href{https://doi.org/10.1103/PhysRevA.70.034302}{doi:10.1103/PhysRevA.70.034302}; \\href{https://arxiv.org/abs/quant-ph/0405023}{arXiv:quant-ph/0405023}."},{"key":"CP25","label":"ref:glu-quasipolynomial","tex":"N. Claudet and S. Perdrix, ``Deciding Local Unitary Equivalence of Graph States in Quasi-Polynomial Time,'' in \\emph{52nd International Colloquium on Automata, Languages, and Programming (ICALP 2025)}, 59:1–59:20 (2025). \\href{https://doi.org/10.4230/LIPIcs.ICALP.2025.59}{doi:10.4230/LIPIcs.ICALP.2025.59}; \\href{https://arxiv.org/abs/2502.06566}{arXiv:2502.06566}."},{"key":"Cla25","label":"ref:glu-thesis","tex":"N. Claudet, ``Local Equivalences of Graph States,'' PhD thesis, Université de Lorraine (2025); arXiv version 2, revised 21 July 2026. \\href{https://doi.org/10.48550/arXiv.2511.22271}{doi:10.48550/arXiv.2511.22271}; \\href{https://arxiv.org/abs/2511.22271}{arXiv:2511.22271}."},{"key":"HMNC26","label":"ref:glu-circle","tex":"F. Hahn, R. McCarty, H. Poulsen Nautrup, and N. Claudet, ``The Structure of Circle Graph States,'' arXiv preprint (2026), version 2, 28 April 2026. \\href{https://doi.org/10.48550/arXiv.2603.08847}{doi:10.48550/arXiv.2603.08847}; \\href{https://arxiv.org/abs/2603.08847}{arXiv:2603.08847}."}],"comment":"No polynomial-time algorithm for arbitrary graph states, or result ruling one out under a stated complexity assumption, was found in the public literature checked through 9 September 2026. The open issue is the complexity of an already decidable problem, not the existence of an exact decision procedure; the circle-graph theorem only resolves a special class. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit. The catalog's minimum LU--LC counterexample problem (\\texttt{op\\_c37650bfb81dbfc6}) asks for the smallest failure of Clifford equivalence, whereas this entry asks the complexity of deciding unrestricted unitary equivalence."}}
---
## Source

Claudet explicitly asks whether local-unitary equivalence of graph states can be decided in polynomial time in Chapter 8, Conclusion, p. 107 of his thesis (arXiv version 2) [Cla25](https://doi.org/10.48550/arXiv.2511.22271). The input convention here keeps the vertex labels fixed, as in the quasi-polynomial algorithm of Claudet and Perdrix [CP25](https://doi.org/10.4230/LIPIcs.ICALP.2025.59).

## Progress

Local-Clifford equivalence, denoted by $\sim_{\mathrm{LC}}$ and obtained by restricting each $U_v$ to a unitary that normalizes the single-qubit Pauli group, has a deterministic decision algorithm (Lemma 1 and the following discussion, p. 2) with running time

$$
T_{\mathrm{LC}}(n)=O(n^4).
\tag{3}
$$

The algorithm with running time in Eq. (3) also constructs an equivalence transformation when one exists; this solves the restricted Clifford problem, not the general unitary problem. [VDD04](https://doi.org/10.1103/PhysRevA.70.034302)

Claudet and Perdrix give an exact deterministic algorithm (Theorem 30, Section 3.5, p. 59:15) for the general problem with running time

$$
T_{\mathrm{LU}}(n)=n^{\log_2 n+O(1)}.
\tag{4}
$$

By Eq. (4), the finite-input problem is decidable, but the established bound is quasi-polynomial rather than polynomial; Claudet’s subsequent thesis explicitly identifies the polynomial-time question as unresolved. [CP25](https://doi.org/10.4230/LIPIcs.ICALP.2025.59), [Cla25](https://doi.org/10.48550/arXiv.2511.22271)

The 2026 circle-graph result (Theorem 1) establishes

$$
G\text{ is a circle graph}
 \quad\Longrightarrow\quad
 \left(|G\rangle\sim_{\mathrm{LU}}|H\rangle
 \Longleftrightarrow
 |G\rangle\sim_{\mathrm{LC}}|H\rangle\right),
\tag{5}
$$

In Eq. (5), a circle graph is the intersection graph of chords of a circle and $H$ is any graph on the same labelled vertices; consequently this subclass admits a polynomial-time decision algorithm. [HMNC26](https://doi.org/10.48550/arXiv.2603.08847)

## Comment

No polynomial-time algorithm for arbitrary graph states, or result ruling one out under a stated complexity assumption, was found in the public literature checked through 9 September 2026. The open issue is the complexity of an already decidable problem, not the existence of an exact decision procedure; the circle-graph theorem only resolves a special class. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit. The catalog’s minimum LU–LC counterexample problem (`op_c37650bfb81dbfc6`) asks for the smallest failure of Clifford equivalence, whereas this entry asks the complexity of deciding unrestricted unitary equivalence.

## References

**VDD04** M. Van den Nest, J. Dehaene, and B. De Moor, “Efficient Algorithm to Recognize the Local Clifford Equivalence of Graph States,” *Physical Review A* **70**, 034302 (2004). [doi:10.1103/PhysRevA.70.034302](https://doi.org/10.1103/PhysRevA.70.034302); [arXiv:quant-ph/0405023](https://arxiv.org/abs/quant-ph/0405023).

**CP25** N. Claudet and S. Perdrix, “Deciding Local Unitary Equivalence of Graph States in Quasi-Polynomial Time,” in *52nd International Colloquium on Automata, Languages, and Programming (ICALP 2025)*, 59:1–59:20 (2025). [doi:10.4230/LIPIcs.ICALP.2025.59](https://doi.org/10.4230/LIPIcs.ICALP.2025.59); [arXiv:2502.06566](https://arxiv.org/abs/2502.06566).

**Cla25** N. Claudet, “Local Equivalences of Graph States,” PhD thesis, Université de Lorraine (2025); arXiv version 2, revised 21 July 2026. [doi:10.48550/arXiv.2511.22271](https://doi.org/10.48550/arXiv.2511.22271); [arXiv:2511.22271](https://arxiv.org/abs/2511.22271).

**HMNC26** F. Hahn, R. McCarty, H. Poulsen Nautrup, and N. Claudet, “The Structure of Circle Graph States,” arXiv preprint (2026), version 2, 28 April 2026. [doi:10.48550/arXiv.2603.08847](https://doi.org/10.48550/arXiv.2603.08847); [arXiv:2603.08847](https://arxiv.org/abs/2603.08847).
