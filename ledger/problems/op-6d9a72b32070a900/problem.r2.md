---
id: "01M2M9FB4MRH9G9THBXZ1QJF2M"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["quantum-magic"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME780N8J8JBTFX6CSPACD"]
title: "Hilbert--Schmidt inradius of the multiqubit stabilizer polytope"
aliases: ["op-6d9a72b32070a900","op_6d9a72b32070a900","01M2M9FB4MRH9G9THBXZ1QJF2M"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_6d9a72b32070a900.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_6d9a72b32070a900","ulid":"01M2M9FB4MRH9G9THBXZ1QJF2M","aliases":["op_6d9a72b32070a900","01M2M9FB4MRH9G9THBXZ1QJF2M","op-6d9a72b32070a900"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.540Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["quantum-magic"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME780N8J8JBTFX6CSPACD"]},"title":"Hilbert--Schmidt inradius of the multiqubit stabilizer polytope","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Quantum magic"],"statement":"Is every $n$-qubit state of purity at most $1/(2^n-1/2)$ a convex mixture of stabilizer states?\n\nLet $d=2^n$ and\n\n\\begin{equation}\n\\mathrm{STAB}_n=\\operatorname{conv}\\{|s\\rangle\\langle s|:|s\\rangle\\text{ is an }n\\text{-qubit stabilizer state}\\}.\n\\label{eq:6d9a-1}\n\\end{equation}\n\nIs the following implication valid for every $n\\geq1$?\n\n\\begin{equation}\n\\operatorname{Tr}(\\rho^2)\\leq\\frac1{d-1/2}\n\\quad\\Longrightarrow\\quad\n\\rho\\in\\mathrm{STAB}_n.\n\\label{eq:6d9a-2}\n\\end{equation}\n\nEquivalently, does the Hilbert--Schmidt ball about $I/d$ contained in Eq.~\\eqref{eq:6d9a-1} have radius $1/\\sqrt{d(2d-1)}$? This is the threshold asserted by Eq.~\\eqref{eq:6d9a-2}.","source":"Liu and coauthors pose the purity threshold as Conjecture 1 \\sourcecite{ref:6d9a-liu26}{Liu26}. Zurel and Davis give equivalent dual and inradius formulations in Conjecture 2 and Theorem 7 \\sourcecite{ref:6d9a-zurel26}{Zurel26}.","progress":["Boundary construction. The Triangle Criterion supplies magic arbitrarily close to purity $1/(d-1/2)$, but this is one side of the sharp-threshold question, not a proof that every lower-purity state is stabilizer \\sourcecite{ref:6d9a-liu26}{Liu26} (Theorem 5 and Conjecture 1).","February 25, 2026. Zurel and Davis obtain the same qubit inradius conditionally on their dual-purity conjecture and verify the relevant conjecture for one and two qubits. Their unconditional odd-prime-dimensional inradius result must not be mistaken for an unconditional multiqubit result \\sourcecite{ref:6d9a-zurel26}{Zurel26}.","September 3, revised September 8, 2026. Liu and Liu prove the stronger universal guarantee\n\n\\begin{equation}\n\\operatorname{Tr}(\\rho^2)\\leq\\frac1{d-a_*}\n\\quad\\Longrightarrow\\quad\\rho\\in\\mathrm{STAB}_n,\n\\qquad a_*\\simeq0.458327.\n\\label{eq:6d9a-6}\n\\end{equation}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:6d9a-6}.","Thus the remaining dimension-independent gap is between $a_*\\simeq0.458327$ and $1/2$. Their revised discussion explicitly leaves the exact inradius open \\sourcecite{ref:6d9a-liuliu26}{LiuLiu26} (Theorem 1 and Discussion).","Status: open, with very recent primary-source confirmation. Reporting only the older $1/(d-1/d)$ sufficient bound would miss substantial 2026 progress."],"references":[{"key":"Liu26","label":"ref:6d9a-liu26","tex":"Z. Liu, T. Haug, Q. Ye, Z.-W. Liu, and I. Roth, \\emph{Triangle Criterion: a mixed-state magic criterion with applications in distillation and detection}, \\href{https://arxiv.org/html/2512.16777v2}{arXiv:2512.16777v2}, April 20, 2026. See Theorem 5, Conjecture 1, and the discussion of arbitrary-copy bound magic."},{"key":"Zurel26","label":"ref:6d9a-zurel26","tex":"M. Zurel and J. Davis, \\emph{Basis-independent stabilizerness and maximally noisy magic states}, \\href{https://arxiv.org/html/2602.22336v1}{arXiv:2602.22336v1}, February 25, 2026. See Conjecture 2, Theorem 7, and Corollary 3."},{"key":"LiuLiu26","label":"ref:6d9a-liuliu26","tex":"Z. Liu and Z.-W. Liu, \\emph{On the geometry and typicality of quantum magic}, \\href{https://arxiv.org/html/2609.03944v2}{arXiv:2609.03944v2}, September 8, 2026; first submitted September 3. See Theorem 1 and Discussion."}],"comment":"This formulation asks where magic first becomes possible near the maximally mixed state, without selecting a decoder, a target state, or an asymptotic computational model.\n\nThe dual formulation suggests a concrete mathematical attack: constrain the squared Hilbert–Schmidt norm of every trace-one operator nonnegative on stabilizer vectors. Searching for a feasible $A$ with $\\operatorname{Tr}(A^2)>2$ would directly falsify the conjecture; numerical absence of such operators would not prove it. The negative eigenvalues allowed in $\\mathcal L_n$ are the source of difficulty, not a defect in the formulation.","contributors":[]}}
---
## Source

Liu and coauthors pose the purity threshold as Conjecture 1 [Liu26](https://arxiv.org/abs/2512.16777v2). Zurel and Davis give equivalent dual and inradius formulations in Conjecture 2 and Theorem 7 [Zurel26](https://arxiv.org/abs/2602.22336v1).

## Progress

Boundary construction. The Triangle Criterion supplies magic arbitrarily close to purity $1/(d-1/2)$, but this is one side of the sharp-threshold question, not a proof that every lower-purity state is stabilizer [Liu26](https://arxiv.org/abs/2512.16777v2) (Theorem 5 and Conjecture 1).

February 25, 2026. Zurel and Davis obtain the same qubit inradius conditionally on their dual-purity conjecture and verify the relevant conjecture for one and two qubits. Their unconditional odd-prime-dimensional inradius result must not be mistaken for an unconditional multiqubit result [Zurel26](https://arxiv.org/abs/2602.22336v1).

September 3, revised September 8, 2026. Liu and Liu prove the stronger universal guarantee

$$
\operatorname{Tr}(\rho^2)\leq\frac1{d-a_*}
\quad\Longrightarrow\quad\rho\in\mathrm{STAB}_n,
\qquad a_*\simeq0.458327.
\tag{3}
$$

The displayed definitions, constraints, and target bounds are recorded in Eqs. (3).

Thus the remaining dimension-independent gap is between $a_*\simeq0.458327$ and $1/2$. Their revised discussion explicitly leaves the exact inradius open [LiuLiu26](https://arxiv.org/abs/2609.03944v2) (Theorem 1 and Discussion).

Status: open, with very recent primary-source confirmation. Reporting only the older $1/(d-1/d)$ sufficient bound would miss substantial 2026 progress.

## Comment

This formulation asks where magic first becomes possible near the maximally mixed state, without selecting a decoder, a target state, or an asymptotic computational model.

The dual formulation suggests a concrete mathematical attack: constrain the squared Hilbert–Schmidt norm of every trace-one operator nonnegative on stabilizer vectors. Searching for a feasible $A$ with $\operatorname{Tr}(A^2)>2$ would directly falsify the conjecture; numerical absence of such operators would not prove it. The negative eigenvalues allowed in $\mathcal L_n$ are the source of difficulty, not a defect in the formulation.

## References

**Liu26** Z. Liu, T. Haug, Q. Ye, Z.-W. Liu, and I. Roth, *Triangle Criterion: a mixed-state magic criterion with applications in distillation and detection*, [arXiv:2512.16777v2](https://arxiv.org/html/2512.16777v2), April 20, 2026. See Theorem 5, Conjecture 1, and the discussion of arbitrary-copy bound magic.

**Zurel26** M. Zurel and J. Davis, *Basis-independent stabilizerness and maximally noisy magic states*, [arXiv:2602.22336v1](https://arxiv.org/html/2602.22336v1), February 25, 2026. See Conjecture 2, Theorem 7, and Corollary 3.

**LiuLiu26** Z. Liu and Z.-W. Liu, *On the geometry and typicality of quantum magic*, [arXiv:2609.03944v2](https://arxiv.org/html/2609.03944v2), September 8, 2026; first submitted September 3. See Theorem 1 and Discussion.
