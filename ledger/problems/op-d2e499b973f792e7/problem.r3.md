---
id: "01M2M9FAFXNJ6DPB5Y3JNBB9PY"
type: "Problem"
schemaVersion: "1.0"
revision: 3
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-25T06:20:24.641Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M2M9FAJ3CTQ7V1WMFR7X6VD7"]
title: "Quantum erasure-channel upper bound for information combining"
aliases: ["op-d2e499b973f792e7","op_d2e499b973f792e7","01M2M9FAFXNJ6DPB5Y3JNBB9PY"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_d2e499b973f792e7.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_d2e499b973f792e7","ulid":"01M2M9FAFXNJ6DPB5Y3JNBB9PY","aliases":["op_d2e499b973f792e7","01M2M9FAFXNJ6DPB5Y3JNBB9PY","op-d2e499b973f792e7"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:46.877Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2M9FAJ3CTQ7V1WMFR7X6VD7"]},"title":"Quantum erasure-channel upper bound for information combining","status":"Unsolved","fields":["Quantum Communication"],"topics":["Matrix and entropy inequalities"],"statement":"Does the quantum erasure-channel upper information-combining bound hold for two independent uniform bits with arbitrary quantum side information?\n\nLet\n\n\\begin{equation}\n\\rho_{X_iB_i}=\\frac12\\sum_{x=0}^1|x\\rangle\\langle x|\\otimes\\rho_x^{(i)},\n\\qquad\n\\rho_{X_1B_1X_2B_2}=\\rho_{X_1B_1}\\otimes\\rho_{X_2B_2},\n\\label{eq:d2e4-1}\n\\end{equation}\n\nwhere $X_1,X_2$ are uniform bits. Put $Z=X_1\\oplus X_2$ and $s_i=H(X_i\\mid B_i)$, using base-two von Neumann entropy. The proposed upper bound is\n\n\\begin{equation}\nH(Z\\mid B_1B_2)\\leq s_1+s_2-s_1s_2\n\\label{eq:d2e4-2}\n\\end{equation}\n\nDoes Eq.~\\eqref{eq:d2e4-2} hold for every state in Eq.~\\eqref{eq:d2e4-1}?","source":"Hirche and Reeb pose this as Conjecture VII.2 \\sourcecite{ref:d2e4-hirche18}{Hirche18}; later work retains the sharp quantum information-combining problem \\sourcecite{ref:d2e4-hirche23}{Hirche23}.","progress":["For classical side information, the sharp upper bound is $H(X_1\\oplus X_2\\mid Y_1Y_2)\\leq s_1+s_2-s_1s_2$, with equality for binary erasure channels \\sourcecite{ref:d2e4-hirche20}{Hirche20}. The question asks whether this same upper bound extends to arbitrary quantum side information.","Hirche, Guan, and Tomamichel revisited the problem in 2023, deriving Rényi chain rules and symmetry relations. They proved exact formulas for a particular order-two Rényi conditional entropy and its dual, but retained general sharp-bound conjectures extending the von Neumann cases. Their Section V.B, Conjectures V.5–V.6, is the relevant distinction; the order-two theorem is not an order-one solution. The proposed extremizers are embedded binary symmetric channels or pure-state channels for the lower bound and erasure channels for the upper bound. \\sourcecite{ref:d2e4-hirche23}{Hirche23}","A further August 27, 2025 paper by Hirche studies classical channel extremality and, in its conclusions, explicitly points back to the unresolved quantum information-combining problems of Hirche and Reeb. This is a more recent status check, not a new proof of either displayed quantum bound. \\sourcecite{ref:d2e4-hirche25}{Hirche25}","Historical GitHub report (2026-09-24): Yuxuan Zhang (GitHub: yuxuanzhang1995) withdrew an earlier partial-result submission and asked that it not be treated as a current result; this link records the withdrawal only. \\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/106}{Issue \\#106}."],"references":[{"key":"Hirche20","label":"ref:d2e4-hirche20","tex":"C. Hirche, \\emph{Rényi Bounds on Information Combining}, arXiv:2004.14408 (2020), Section II, reviewing the classical Shannon-entropy bounds. \\href{https://arxiv.org/html/2004.14408v1}{Full text}."},{"key":"Hirche18","label":"ref:d2e4-hirche18","tex":"C. Hirche and D. Reeb, \\emph{Bounds on Information Combining With Quantum Side Information}, arXiv:1706.09752v2; IEEE Transactions on Information Theory 64(7), 4739–4757 (2018), Conjectures VII.1–VII.2 and Section VII.A. Entropies here are converted consistently from nats to bits. \\href{https://arxiv.org/html/1706.09752v2}{Full text}."},{"key":"Hirche23","label":"ref:d2e4-hirche23","tex":"C. Hirche, X. Guan, and M. Tomamichel, \\emph{Chain Rules for Rényi Information Combining}, arXiv:2305.02589 (2023), Propositions V.3–V.4, Conjectures V.5–V.6, and conclusions. \\href{https://arxiv.org/html/2305.02589}{Full text}."},{"key":"Hirche25","label":"ref:d2e4-hirche25","tex":"C. Hirche, \\emph{Rényi partial orders for BISO channels}, arXiv:2508.19951v1, August 27, 2025, Section 4, which identifies the quantum information-combining problems as a remaining direction. \\href{https://arxiv.org/html/2508.19951}{Full text}."}],"comment":"This upper-bound conjecture remains unresolved. Hirche and Reeb stated the sharp lower and upper conjectures in 2018; Hirche, Guan, and Tomamichel restated them in 2023, and Hirche identified them as unresolved in 2025. Commuting outputs, selected entropy orders, and numerical evidence do not settle arbitrary noncommuting outputs with von Neumann entropy.\n\nIn the source, this statement and its companion conjecture appear together under “Sharp entropy bounds for combining two binary quantum channels.” They share the same minimal setup but concern opposite extremal bounds and can be settled independently.","contributors":[]}}
---
## Source

Hirche and Reeb pose this as Conjecture VII.2 [Hirche18](https://arxiv.org/abs/1706.09752v2); later work retains the sharp quantum information-combining problem [Hirche23](https://arxiv.org/abs/2305.02589).

## Progress

For classical side information, the sharp upper bound is $H(X_1\oplus X_2\mid Y_1Y_2)\leq s_1+s_2-s_1s_2$, with equality for binary erasure channels [Hirche20](https://arxiv.org/abs/2004.14408). The question asks whether this same upper bound extends to arbitrary quantum side information.

Hirche, Guan, and Tomamichel revisited the problem in 2023, deriving Rényi chain rules and symmetry relations. They proved exact formulas for a particular order-two Rényi conditional entropy and its dual, but retained general sharp-bound conjectures extending the von Neumann cases. Their Section V.B, Conjectures V.5–V.6, is the relevant distinction; the order-two theorem is not an order-one solution. The proposed extremizers are embedded binary symmetric channels or pure-state channels for the lower bound and erasure channels for the upper bound. [Hirche23](https://arxiv.org/abs/2305.02589)

A further August 27, 2025 paper by Hirche studies classical channel extremality and, in its conclusions, explicitly points back to the unresolved quantum information-combining problems of Hirche and Reeb. This is a more recent status check, not a new proof of either displayed quantum bound. [Hirche25](https://arxiv.org/abs/2508.19951v1)

Historical GitHub report (2026-09-24): Yuxuan Zhang (GitHub: yuxuanzhang1995) withdrew an earlier partial-result submission and asked that it not be treated as a current result; this link records the withdrawal only. [Issue #106](https://github.com/Naixu-Guo/quantum-open-problems/issues/106).

## Comment

This upper-bound conjecture remains unresolved. Hirche and Reeb stated the sharp lower and upper conjectures in 2018; Hirche, Guan, and Tomamichel restated them in 2023, and Hirche identified them as unresolved in 2025. Commuting outputs, selected entropy orders, and numerical evidence do not settle arbitrary noncommuting outputs with von Neumann entropy.

In the source, this statement and its companion conjecture appear together under “Sharp entropy bounds for combining two binary quantum channels.” They share the same minimal setup but concern opposite extremal bounds and can be settled independently.

## References

**Hirche20** C. Hirche, *Rényi Bounds on Information Combining*, arXiv:2004.14408 (2020), Section II, reviewing the classical Shannon-entropy bounds. [Full text](https://arxiv.org/html/2004.14408v1).

**Hirche18** C. Hirche and D. Reeb, *Bounds on Information Combining With Quantum Side Information*, arXiv:1706.09752v2; IEEE Transactions on Information Theory 64(7), 4739–4757 (2018), Conjectures VII.1–VII.2 and Section VII.A. Entropies here are converted consistently from nats to bits. [Full text](https://arxiv.org/html/1706.09752v2).

**Hirche23** C. Hirche, X. Guan, and M. Tomamichel, *Chain Rules for Rényi Information Combining*, arXiv:2305.02589 (2023), Propositions V.3–V.4, Conjectures V.5–V.6, and conclusions. [Full text](https://arxiv.org/html/2305.02589).

**Hirche25** C. Hirche, *Rényi partial orders for BISO channels*, arXiv:2508.19951v1, August 27, 2025, Section 4, which identifies the quantum information-combining problems as a remaining direction. [Full text](https://arxiv.org/html/2508.19951).
