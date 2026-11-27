---
id: "01M87VW3Q24QM6WF98A8BVR9R1"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T01:42:25.991Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-error-correction"]
topicIds: ["quantum-coding-theory"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M87VW3P77TAQ8YWV6A03DTQE","01M2JD6D1YCESPTHQZDT5TZB77"]
title: "Optimal dimension of 11-qubit distance-4 codes"
aliases: ["op-3ca7a14810280d8c","op_3ca7a14810280d8c","01M87VW3Q24QM6WF98A8BVR9R1"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_3ca7a14810280d8c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_3ca7a14810280d8c","ulid":"01M87VW3Q24QM6WF98A8BVR9R1","aliases":["op_3ca7a14810280d8c","01M87VW3Q24QM6WF98A8BVR9R1","op-3ca7a14810280d8c"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.618Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-error-correction"],"topicIds":["quantum-coding-theory"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M87VW3P77TAQ8YWV6A03DTQE","01M2JD6D1YCESPTHQZDT5TZB77"]},"title":"Optimal dimension of 11-qubit distance-4 codes","status":"Unsolved","fields":["Quantum Error Correction"],"topics":["Quantum coding theory"],"statement":"How large a logical Hilbert space can eleven physical qubits encode while detecting every Pauli error of weight at most three? Let $P$ be the orthogonal projector onto the code subspace of $(\\mathbb C^2)^{\\otimes 11}$. Its rank $K=\\operatorname{Tr}P>0$ is the dimension of the encoded logical Hilbert space, or equivalently the number of mutually orthogonal logical basis states. A Pauli string $E\\in\\{I,X,Y,Z\\}^{\\otimes 11}$ has weight $\\operatorname{wt}(E)$ equal to its number of nonidentity factors. Find the largest $K$ for which some projector satisfies\n\\begin{equation}\nPEP=\\frac{\\operatorname{Tr}(PE)}{K}P\n\\qquad(1\\leq\\operatorname{wt}(E)\\leq3).\n\\label{eq:ed4-knill-laflamme}\n\\end{equation}\nThe constraints in Eq.~\\eqref{eq:ed4-knill-laflamme} hold for every Pauli string of the stated weights. Arbitrary subspaces and degenerate codes are allowed.","source":"Anglès Munné and Huber list the gap between construction and converse at these parameters in Section~4.2, Table~1 \\sourcecite{ref:ed4-amh}{AMH26}.","progress":["A code of dimension $4$ gives the lower bound. The rational-certificate table gives $7$ as the upper bound on the dimension of an arbitrary code, retaining the bounds compared with Rigby, Olivier and Jarvis \\sourcecite{ref:ed4-amh}{AMH26}, \\sourcecite{ref:ed4-roj}{ROJ19}.","The upper bound excludes the next power of two, so any dimension above $4$ would require a nonstabilizer code. The same rational-certificate paper excludes dimension $5$ at block length ten in Section~4.2 \\sourcecite{ref:ed4-amh}{AMH26}."],"references":[{"key":"AMH26","label":"ref:ed4-amh","tex":"G. Anglès Munné and F. Huber, ``SDP bounds on quantum codes: rational certificates,'' arXiv preprint (2026). \\href{https://arxiv.org/abs/2603.19901v1}{arXiv:2603.19901v1}."},{"key":"ROJ19","label":"ref:ed4-roj","tex":"A. Rigby, J. C. Olivier, and P. Jarvis, ``Heuristic construction of codeword stabilized codes,'' \\emph{Physical Review A} \\textbf{100}, 062303 (2019). \\href{https://doi.org/10.1103/PhysRevA.100.062303}{doi:10.1103/PhysRevA.100.062303}; \\href{https://arxiv.org/abs/1907.04537}{arXiv:1907.04537}."}],"comment":"The optimal logical dimension lies in $\\{4,5,6,7\\}$. The separate \\href{https://qiqc-op.com/problem/op_458e9e86ccbddccb/}{eleven-qubit stabilizer problem} fixes three logical qubits and asks about the weights of stabilizer generators at distance three. Here the code distance is at least four and the code subspace is unrestricted. The nearby \\href{https://qiqc-op.com/problem/op_0d6ac674da115857/}{nine-qubit distance-three problem} asks about a shorter code and fewer detectable Pauli weights. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Anglès Munné and Huber list the gap between construction and converse at these parameters in Section 4.2, Table 1 [AMH26](https://arxiv.org/abs/2603.19901v1).

## Progress

A code of dimension $4$ gives the lower bound. The rational-certificate table gives $7$ as the upper bound on the dimension of an arbitrary code, retaining the bounds compared with Rigby, Olivier and Jarvis [AMH26](https://arxiv.org/abs/2603.19901v1), [ROJ19](https://doi.org/10.1103/PhysRevA.100.062303).

The upper bound excludes the next power of two, so any dimension above $4$ would require a nonstabilizer code. The same rational-certificate paper excludes dimension $5$ at block length ten in Section 4.2 [AMH26](https://arxiv.org/abs/2603.19901v1).

## Comment

The optimal logical dimension lies in $\{4,5,6,7\}$. The separate [eleven-qubit stabilizer problem](https://qiqc-op.com/problem/op_458e9e86ccbddccb/) fixes three logical qubits and asks about the weights of stabilizer generators at distance three. Here the code distance is at least four and the code subspace is unrestricted. The nearby [nine-qubit distance-three problem](https://qiqc-op.com/problem/op_0d6ac674da115857/) asks about a shorter code and fewer detectable Pauli weights. The catalog and literature were checked through November 26, 2026.

## References

**AMH26** G. Anglès Munné and F. Huber, “SDP bounds on quantum codes: rational certificates,” arXiv preprint (2026). [arXiv:2603.19901v1](https://arxiv.org/abs/2603.19901v1).

**ROJ19** A. Rigby, J. C. Olivier, and P. Jarvis, “Heuristic construction of codeword stabilized codes,” *Physical Review A* **100**, 062303 (2019). [doi:10.1103/PhysRevA.100.062303](https://doi.org/10.1103/PhysRevA.100.062303); [arXiv:1907.04537](https://arxiv.org/abs/1907.04537).
