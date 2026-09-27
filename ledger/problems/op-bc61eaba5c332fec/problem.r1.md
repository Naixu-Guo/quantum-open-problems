---
id: "01M2M9FB6ZWP4KA207XNSVBXXB"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T05:53:34.975Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["quantum-magic","resource-conversion","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1Q787QRD6APNHX659G4CTEF"]
title: "Optimal universal eight-copy concentration to a CCZ state"
aliases: ["op-bc61eaba5c332fec","op_bc61eaba5c332fec","01M2M9FB6ZWP4KA207XNSVBXXB"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_bc61eaba5c332fec.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_bc61eaba5c332fec","ulid":"01M2M9FB6ZWP4KA207XNSVBXXB","aliases":["op_bc61eaba5c332fec","01M2M9FB6ZWP4KA207XNSVBXXB","op-bc61eaba5c332fec"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.615Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["quantum-magic","resource-conversion","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1Q787QRD6APNHX659G4CTEF"]},"title":"Optimal universal eight-copy concentration to a CCZ state","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Quantum magic","Resource conversion","One-shot and finite-blocklength bounds"],"statement":"What is the optimal success probability for a fixed catalyst-free stabilizer protocol that converts eight copies of an arbitrary unknown pure qubit into an exact $|CCZ\\rangle$ state?\n\nA stabilizer operation is constructed from stabilizer ancillas, Clifford unitaries, Pauli measurements, classical randomness and feedforward, and discarding systems. Heralding is permitted where stated. It does not mean an arbitrary stabilizer-preserving channel, and no magic catalyst is free. These distinctions affect conversion theorems \\sourcecite{ref:bc61-zurel26}{Zurel26}, \\sourcecite{ref:bc61-fang26}{Fang26}.\n\nLet $\\mathcal U_8$ comprise fixed stabilizer protocols, chosen independently of the input, such that for every pure qubit state $\\psi$, every accepted branch on $\\psi^{\\otimes8}$ outputs exactly $|CCZ\\rangle$. Acceptance may be zero on stabilizer inputs. Define\n\n\\begin{equation}\n|CCZ\\rangle=2^{-3/2}\\sum_{x\\in\\{0,1\\}^3}(-1)^{x_1x_2x_3}|x\\rangle.\n\\label{eq:bc61-1}\n\\end{equation}\n\nDetermine $p_8^*(\\psi)=\\sup_{\\Lambda\\in\\mathcal U_8}p_\\Lambda(\\psi)$. In particular, is\n\n\\begin{equation}\np_8^*(\\psi)=\\frac23m_3(\\psi),\\qquad\nm_3(\\psi)=\\frac{1-x^6-y^6-z^6}{2},\n\\label{eq:bc61-2}\n\\end{equation}\n\nwhere $(x,y,z)$ is the pure-state Bloch vector? No magic catalysts are allowed.\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:bc61-1}, \\eqref{eq:bc61-2}.","source":"The question is explicitly posed or retained as open in the cited primary literature \\sourcecite{ref:bc61-rizzo26}{Rizzo26}.  The statement is rewritten here to make its hypotheses and success criterion self-contained.","progress":["Rizzo and Leone establish\n\n\\begin{equation}\n\\frac23m_3(\\psi)\\leq p_8^*(\\psi)\\leq\\frac76m_3(\\psi)\n\\label{eq:bc61-3}\n\\end{equation}\n\nand explicitly leave eight-copy optimality open \\sourcecite{ref:bc61-rizzo26}{Rizzo26}. Equality with the lower bound is a candidate, not a published theorem or asserted consensus conjecture.\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:bc61-3}.","Status: open in the August 2026 preprint; no subsequent resolution identified."],"references":[{"key":"Zurel26","label":"ref:bc61-zurel26","tex":"M. Zurel, S. Jana, and N. de Silva, \\emph{High-threshold magic state distillation with quantum quadratic residue codes}, \\href{https://arxiv.org/html/2603.18560v1}{arXiv:2603.18560v1}, March 19, 2026. Introduction explicitly states the open conjectures; Sections 4.2–4.3 give the new constructions."},{"key":"Fang26","label":"ref:bc61-fang26","tex":"K. Fang and Z.-W. Liu, \\emph{One-shot distillation with constant overhead using catalysts}, Nature Communications 17, 6010 (2026); \\href{https://arxiv.org/html/2410.14547v3}{arXiv:2410.14547v3}, September 2, 2026. See Definitions 1–2 and Theorem 7."},{"key":"Rizzo26","label":"ref:bc61-rizzo26","tex":"J. Rizzo and L. Leone, \\emph{Universal magic state concentration}, \\href{https://arxiv.org/html/2608.13376v1}{arXiv:2608.13376v1}, August 13, 2026. See Theorem 7, Proposition 3, and the intervening optimality discussion."}],"comment":"This finite-copy question offers a bounded input space, but “universal” is essential: optimizing a circuit for one known input is a different task. Its short history warrants more caution about community prominence than longer-established magic-state problems.","contributors":[]}}
---
## Source

The question is explicitly posed or retained as open in the cited primary literature [Rizzo26](https://arxiv.org/abs/2608.13376v1). The statement is rewritten here to make its hypotheses and success criterion self-contained.

## Progress

Rizzo and Leone establish

$$
\frac23m_3(\psi)\leq p_8^*(\psi)\leq\frac76m_3(\psi)
\tag{3}
$$

and explicitly leave eight-copy optimality open [Rizzo26](https://arxiv.org/abs/2608.13376v1). Equality with the lower bound is a candidate, not a published theorem or asserted consensus conjecture.

The displayed definitions, constraints, and target bounds are recorded in Eqs. (3).

Status: open in the August 2026 preprint; no subsequent resolution identified.

## Comment

This finite-copy question offers a bounded input space, but “universal” is essential: optimizing a circuit for one known input is a different task. Its short history warrants more caution about community prominence than longer-established magic-state problems.

## References

**Zurel26** M. Zurel, S. Jana, and N. de Silva, *High-threshold magic state distillation with quantum quadratic residue codes*, [arXiv:2603.18560v1](https://arxiv.org/html/2603.18560v1), March 19, 2026. Introduction explicitly states the open conjectures; Sections 4.2–4.3 give the new constructions.

**Fang26** K. Fang and Z.-W. Liu, *One-shot distillation with constant overhead using catalysts*, Nature Communications 17, 6010 (2026); [arXiv:2410.14547v3](https://arxiv.org/html/2410.14547v3), September 2, 2026. See Definitions 1–2 and Theorem 7.

**Rizzo26** J. Rizzo and L. Leone, *Universal magic state concentration*, [arXiv:2608.13376v1](https://arxiv.org/html/2608.13376v1), August 13, 2026. See Theorem 7, Proposition 3, and the intervening optimality discussion.
