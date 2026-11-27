---
id: "01M87VW3X02NCD28MDQYXFBACF"
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
areaIds: ["quantum-computation"]
topicIds: ["quantum-circuit-complexity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M2M9FBXJJ9AW5EYY6M1R9RAX"]
title: "Exact CNOT count for arbitrary three-qubit unitaries"
aliases: ["op-8cd24cb9148d9dab","op_8cd24cb9148d9dab","01M87VW3X02NCD28MDQYXFBACF"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_8cd24cb9148d9dab.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_8cd24cb9148d9dab","ulid":"01M87VW3X02NCD28MDQYXFBACF","aliases":["op_8cd24cb9148d9dab","01M87VW3X02NCD28MDQYXFBACF","op-8cd24cb9148d9dab"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.808Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-computation"],"topicIds":["quantum-circuit-complexity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2M9FBXJJ9AW5EYY6M1R9RAX"]},"title":"Exact CNOT count for arbitrary three-qubit unitaries","status":"Unsolved","fields":["Quantum Computation"],"topics":["Quantum circuit complexity"],"statement":"What is the smallest integer $k$ such that every three-qubit unitary can be implemented exactly, up to a global phase, by a circuit with at most $k$ CNOT gates?\n\nThe circuit acts on exactly the three data qubits. Arbitrary one-qubit unitaries are free, and any ordered pair of distinct qubits can be the control and target of a CNOT. Ancillas and measurements are excluded. The full circuit, including the sequence of control and target pairs, may depend on the target unitary.","source":"Krol and Al-Ars list the remaining gap between the theoretical lower bound and their construction in Sec.~1, Table~1 \\sourcecite{ref:d11-block-zxz}{KA24}.","progress":["Shende, Bullock, and Markov give a parameter-counting lower bound of $\\lceil(4^n-3n-1)/4\\rceil$ CNOTs for general $n$-qubit unitaries. For three qubits, the unitary up to phase has $63$ real parameters and a circuit with $k$ CNOTs has at most $9+4k$, so $k\\geq 14$ \\sourcecite{ref:d11-logic-synthesis}{SBM06}.","The block-ZXZ decomposition in Krol and Al-Ars uses $19$ CNOTs for arbitrary three-qubit targets. See Sec.~1, Table~1, and Sec.~5.3 \\sourcecite{ref:d11-block-zxz}{KA24}."],"references":[{"key":"KA24","label":"ref:d11-block-zxz","tex":"A. M. Krol and Z. Al-Ars, \\emph{Beyond Quantum Shannon: Circuit Construction for General n-Qubit Gates Based on Block ZXZ-Decomposition} (2024). \\href{https://arxiv.org/abs/2403.13692v2}{arXiv:2403.13692v2}."},{"key":"SBM06","label":"ref:d11-logic-synthesis","tex":"V. V. Shende, S. S. Bullock, and I. L. Markov, \\emph{Synthesis of Quantum Logic Circuits} (2006). \\href{https://arxiv.org/abs/quant-ph/0406176v5}{arXiv:quant-ph/0406176v5}."},{"key":"Paw25","label":"ref:d11-triality","tex":"B. Pawlowski, \\emph{Real 3-qubit gate decompositions via triality}. \\href{https://arxiv.org/abs/2512.18049v2}{arXiv:2512.18049v2}."}],"comment":"A matching upper bound requires an exact circuit for every three-qubit unitary. Pawlowski gives a $14$-CNOT construction for $\\mathrm{SO}(8)$, the determinant-one real orthogonal targets, in Theorem~5.4 \\sourcecite{ref:d11-triality}{Paw25}. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Krol and Al-Ars list the remaining gap between the theoretical lower bound and their construction in Sec. 1, Table 1 [KA24](https://arxiv.org/abs/2403.13692v2).

## Progress

Shende, Bullock, and Markov give a parameter-counting lower bound of $\lceil(4^n-3n-1)/4\rceil$ CNOTs for general $n$-qubit unitaries. For three qubits, the unitary up to phase has $63$ real parameters and a circuit with $k$ CNOTs has at most $9+4k$, so $k\geq 14$ [SBM06](https://arxiv.org/abs/quant-ph/0406176v5).

The block-ZXZ decomposition in Krol and Al-Ars uses $19$ CNOTs for arbitrary three-qubit targets. See Sec. 1, Table 1, and Sec. 5.3 [KA24](https://arxiv.org/abs/2403.13692v2).

## Comment

A matching upper bound requires an exact circuit for every three-qubit unitary. Pawlowski gives a $14$-CNOT construction for $\mathrm{SO}(8)$, the determinant-one real orthogonal targets, in Theorem 5.4 [Paw25](https://arxiv.org/abs/2512.18049v2). The catalog and literature were checked through November 26, 2026.

## References

**KA24** A. M. Krol and Z. Al-Ars, *Beyond Quantum Shannon: Circuit Construction for General n-Qubit Gates Based on Block ZXZ-Decomposition* (2024). [arXiv:2403.13692v2](https://arxiv.org/abs/2403.13692v2).

**SBM06** V. V. Shende, S. S. Bullock, and I. L. Markov, *Synthesis of Quantum Logic Circuits* (2006). [arXiv:quant-ph/0406176v5](https://arxiv.org/abs/quant-ph/0406176v5).

**Paw25** B. Pawlowski, *Real 3-qubit gate decompositions via triality*. [arXiv:2512.18049v2](https://arxiv.org/abs/2512.18049v2).
