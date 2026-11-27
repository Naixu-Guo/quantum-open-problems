---
id: "01M87VW3QY09EMJZKSCXE9WQ7E"
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
relatedProblemIds: ["01M2JD6D42ZF21JR0CXSY184XW","01M2JD6D1YCESPTHQZDT5TZB77"]
title: "Optimal dimension of a 9-qubit code that detects 1 error"
aliases: ["op-0af3e22238a42d74","op_0af3e22238a42d74","01M87VW3QY09EMJZKSCXE9WQ7E"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_0af3e22238a42d74.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_0af3e22238a42d74","ulid":"01M87VW3QY09EMJZKSCXE9WQ7E","aliases":["op_0af3e22238a42d74","01M87VW3QY09EMJZKSCXE9WQ7E","op-0af3e22238a42d74"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.646Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-error-correction"],"topicIds":["quantum-coding-theory"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2JD6D42ZF21JR0CXSY184XW","01M2JD6D1YCESPTHQZDT5TZB77"]},"title":"Optimal dimension of a 9-qubit code that detects 1 error","status":"Unsolved","fields":["Quantum Error Correction"],"topics":["Quantum coding theory"],"statement":"What is the largest dimension of a nine-qubit code that detects every single-qubit error exactly?\n\nLet $P$ be the orthogonal projector onto a subspace of $(\\mathbb C^2)^{\\otimes9}$. Exact detection here requires $PEP=c_E P$ for a scalar $c_E$ for each $E$ that applies one Pauli operator $X$, $Y$, or $Z$ to one qubit and the identity to the others. By linearity these conditions cover arbitrary one-qubit errors. Determine the largest rank of $P$ subject to all the conditions, allowing any subspace.","source":"Anglès Munné and Huber record the gap for nine qubits and distance two in Sec.~4.2, Table~1 \\sourcecite{ref:d6-04-amh26}{AMH26}.","progress":["Rigby, Olivier, and Jarvis give a nine-qubit code of dimension $100$ in their search for codeword-stabilized codes \\sourcecite{ref:d6-04-roj19}{ROJ19}.","Table~1 of Anglès Munné and Huber lists the linear programming bound $112$ \\sourcecite{ref:d6-04-amh26}{AMH26}. Rains, Theorems~2 and~3, shows that this bound cannot be attained at length nine. Since the code dimension is an integer, it is at most $111$ \\sourcecite{ref:d6-04-rains99}{Rai99}."],"references":[{"key":"AMH26","label":"ref:d6-04-amh26","tex":"G. Anglès Munné and F. Huber, ``SDP bounds on quantum codes: rational certificates,'' arXiv preprint (2026). \\href{https://arxiv.org/abs/2603.19901v1}{arXiv:2603.19901v1}."},{"key":"ROJ19","label":"ref:d6-04-roj19","tex":"A. Rigby, J. C. Olivier, and P. Jarvis, ``Heuristic construction of codeword stabilized codes,'' \\emph{Physical Review A} \\textbf{100}, 062303 (2019). \\href{https://doi.org/10.1103/PhysRevA.100.062303}{doi:10.1103/PhysRevA.100.062303}; \\href{https://arxiv.org/abs/1907.04537}{arXiv:1907.04537}."},{"key":"Rai99","label":"ref:d6-04-rains99","tex":"E. M. Rains, \\emph{Quantum codes of minimum distance two}, IEEE Transactions on Information Theory \\textbf{45}, 266--271 (1999). \\href{https://doi.org/10.1109/18.746807}{doi:10.1109/18.746807}. \\href{https://arxiv.org/abs/quant-ph/9704043}{arXiv:quant-ph/9704043}."}],"comment":"The \\href{https://qiqc-op.com/problem/op_5ea7cb9abb281829/}{seven-qubit distance-two problem} imposes the same detection requirement on a shorter block. The \\href{https://qiqc-op.com/problem/op_0d6ac674da115857/}{nine-qubit distance-three problem} also requires detection of errors of weight two. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Anglès Munné and Huber record the gap for nine qubits and distance two in Sec. 4.2, Table 1 [AMH26](https://arxiv.org/abs/2603.19901v1).

## Progress

Rigby, Olivier, and Jarvis give a nine-qubit code of dimension $100$ in their search for codeword-stabilized codes [ROJ19](https://doi.org/10.1103/PhysRevA.100.062303).

Table 1 of Anglès Munné and Huber lists the linear programming bound $112$ [AMH26](https://arxiv.org/abs/2603.19901v1). Rains, Theorems 2 and 3, shows that this bound cannot be attained at length nine. Since the code dimension is an integer, it is at most $111$ [Rai99](https://doi.org/10.1109/18.746807).

## Comment

The [seven-qubit distance-two problem](https://qiqc-op.com/problem/op_5ea7cb9abb281829/) imposes the same detection requirement on a shorter block. The [nine-qubit distance-three problem](https://qiqc-op.com/problem/op_0d6ac674da115857/) also requires detection of errors of weight two. The catalog and literature were checked through November 26, 2026.

## References

**AMH26** G. Anglès Munné and F. Huber, “SDP bounds on quantum codes: rational certificates,” arXiv preprint (2026). [arXiv:2603.19901v1](https://arxiv.org/abs/2603.19901v1).

**ROJ19** A. Rigby, J. C. Olivier, and P. Jarvis, “Heuristic construction of codeword stabilized codes,” *Physical Review A* **100**, 062303 (2019). [doi:10.1103/PhysRevA.100.062303](https://doi.org/10.1103/PhysRevA.100.062303); [arXiv:1907.04537](https://arxiv.org/abs/1907.04537).

**Rai99** E. M. Rains, *Quantum codes of minimum distance two*, IEEE Transactions on Information Theory **45**, 266–271 (1999). [doi:10.1109/18.746807](https://doi.org/10.1109/18.746807). [arXiv:quant-ph/9704043](https://arxiv.org/abs/quant-ph/9704043).
