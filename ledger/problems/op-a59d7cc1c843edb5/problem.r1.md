---
id: "01M1Q787QRJWENG45M2E70WZXW"
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
areaIds: ["quantum-shannon-theory"]
topicIds: ["amplitude-damping-channels","quantum-capacity","coherent-information","quantum-channels","qutrit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Exactly solvable nondegradable quantum channels"
aliases: ["op-a59d7cc1c843edb5","op_a59d7cc1c843edb5","01M1Q787QRJWENG45M2E70WZXW"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_a59d7cc1c843edb5.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_a59d7cc1c843edb5","ulid":"01M1Q787QRJWENG45M2E70WZXW","aliases":["op_a59d7cc1c843edb5","01M1Q787QRJWENG45M2E70WZXW","op-a59d7cc1c843edb5"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["amplitude-damping-channels","quantum-capacity","coherent-information","quantum-channels","qutrit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Exactly solvable nondegradable quantum channels","status":"Solved","fields":["Quantum Shannon theory"],"topics":["Amplitude-damping channels","Quantum capacity","Coherent information","Quantum channels","Qutrit systems"],"statement":"Does there exist a finite-dimensional quantum channel that is neither\ndegradable nor antidegradable and whose unassisted quantum capacity is known\nexactly?  For a channel $\\mathcal N_{A\\to B}$ with complementary channel\n$\\mathcal N^c_{A\\to E}$, degradability and antidegradability mean,\nrespectively, that there is a channel $\\mathcal D$ or $\\mathcal A$ satisfying\n\\begin{equation}\n  \\mathcal N^c=\\mathcal D_{B\\to E}\\circ\\mathcal N,\n  \\qquad\\text{or}\\qquad\n  \\mathcal N=\\mathcal A_{E\\to B}\\circ\\mathcal N^c.\n  \\label{eq:p74-degradability-definitions}\n\\end{equation}\nThe channel sought must satisfy neither identity in\nEq.~\\eqref{eq:p74-degradability-definitions}.  Its quantum capacity is\ndefined by the coherent-information regularization\n\\begin{equation}\n  Q(\\mathcal N)\n  :=\\sup_{n\\geq1}\\frac1n\\max_{\\rho_{A^n}}\n  \\left[\n    S(\\mathcal N^{\\otimes n}(\\rho_{A^n}))\n    -S((\\mathcal N^c)^{\\otimes n}(\\rho_{A^n}))\n  \\right].\n  \\label{eq:p74-quantum-capacity}\n\\end{equation}\nThe question asks for an explicit channel outside both classes in\nEq.~\\eqref{eq:p74-degradability-definitions} together with an exact evaluation\nof Eq.~\\eqref{eq:p74-quantum-capacity}.","source":"Wilde explicitly identified finding the quantum capacity of a nondegradable\nchannel as an important open challenge\n\\sourcecite{ref:p74-wilde}{Wil17}.","progress":["Chessa and Giovannetti supplied a simple explicit qutrit solution to\n  the existential problem.  For $1/2<\\gamma<1$, define a channel\n  $\\mathcal N_\\gamma$ by the Stinespring isometry\n  \\begin{equation}\n    \\begin{aligned}\n      V_\\gamma|0\\rangle_A&=|0\\rangle_B|0\\rangle_E,\\\\\n      V_\\gamma|1\\rangle_A\n        &=\\sqrt{1-\\gamma}\\,|1\\rangle_B|0\\rangle_E\n          +\\sqrt{\\gamma}\\,|0\\rangle_B|1\\rangle_E,\\\\\n      V_\\gamma|2\\rangle_A&=|2\\rangle_B|0\\rangle_E,\n      \\qquad\n      \\mathcal N_\\gamma(\\rho):=\n        \\operatorname{Tr}_E[V_\\gamma\\rho V_\\gamma^\\dagger].\n    \\end{aligned}\n    \\label{eq:p74-single-decay-mad-channel}\n  \\end{equation}\n  They proved that the channel in\n  Eq.~\\eqref{eq:p74-single-decay-mad-channel} is neither degradable nor\n  antidegradable throughout this parameter range and nevertheless has\n  \\begin{equation}\n    Q(\\mathcal N_\\gamma)=1.\n    \\label{eq:p74-mad-capacity}\n  \\end{equation}\n  The noiseless subspace $\\operatorname{span}\\{|0\\rangle,|2\\rangle\\}$ gives\n  the achievable qubit in Eq.~\\eqref{eq:p74-mad-capacity}; their channel\n  analysis supplies the matching upper bound\n  \\sourcecite{ref:p74-chessa-giovannetti}{CG21}.","Earlier work of D'Arrigo, Benenti, Falci, and Macchiavello determined\n  the quantum capacity and studied the degradability properties of a fully\n  correlated two-qubit amplitude-damping channel.  It is a historical\n  antecedent to the multilevel constructions, but the qutrit witness in\n  Eq.~\\eqref{eq:p74-single-decay-mad-channel} independently suffices for the\n  existential question here\n  \\sourcecite{ref:p74-darrigo-et-al}{DBF+13}.","Smith and Wu later constructed broader families of genuinely\n  nondegradable channels with additive coherent information, hence with\n  quantum capacities given by a one-use optimization.  Their results provide\n  further exactly solvable examples but postdate the family in\n  Eq.~\\eqref{eq:p74-single-decay-mad-channel}\n  \\sourcecite{ref:p74-smith-wu}{SW25}."],"references":[{"key":"Wil17","label":"ref:p74-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~26.6.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"CG21","label":"ref:p74-chessa-giovannetti","tex":"S. Chessa and V. Giovannetti, ``Quantum Capacity Analysis of Multi-Level\n  Amplitude Damping Channels,'' \\emph{Communications Physics} \\textbf{4}, 22\n  (2021).\n  \\href{https://doi.org/10.1038/s42005-021-00524-4}{doi:10.1038/s42005-021-00524-4};\n  \\href{https://arxiv.org/abs/2008.00477v3}{arXiv:2008.00477v3}."},{"key":"DBF+13","label":"ref:p74-darrigo-et-al","tex":"A. D'Arrigo, G. Benenti, G. Falci, and C. Macchiavello,\n  ``Classical and Quantum Capacities of a Fully Correlated Amplitude Damping\n  Channel,'' \\emph{Physical Review A} \\textbf{88}, 042337 (2013).\n  \\href{https://doi.org/10.1103/PhysRevA.88.042337}{doi:10.1103/PhysRevA.88.042337};\n  \\href{https://arxiv.org/abs/1309.2219}{arXiv:1309.2219}."},{"key":"SW25","label":"ref:p74-smith-wu","tex":"G. Smith and P. Wu, ``Additivity of Quantum Capacities in Simple\n  Non-Degradable Quantum Channels,'' \\emph{IEEE Transactions on Information\n  Theory} \\textbf{71}, 6134--6154 (2025).\n  \\href{https://doi.org/10.1109/TIT.2025.3583936}{doi:10.1109/TIT.2025.3583936};\n  \\href{https://arxiv.org/abs/2409.03927v4}{arXiv:2409.03927v4}."}],"comment":"The family in Eq.~\\eqref{eq:p74-single-decay-mad-channel} solves the literal\nexistence problem.  It does not provide a general single-letter formula or a\nclassification of nondegradable channels with additive coherent information."}}
---
## Source

Wilde explicitly identified finding the quantum capacity of a nondegradable channel as an important open challenge [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Chessa and Giovannetti supplied a simple explicit qutrit solution to the existential problem. For $1/2<\gamma<1$, define a channel $\mathcal N_\gamma$ by the Stinespring isometry

$$
\begin{aligned}
 V_\gamma|0\rangle_A&=|0\rangle_B|0\rangle_E,\\
 V_\gamma|1\rangle_A
 &=\sqrt{1-\gamma}\,|1\rangle_B|0\rangle_E
 +\sqrt{\gamma}\,|0\rangle_B|1\rangle_E,\\
 V_\gamma|2\rangle_A&=|2\rangle_B|0\rangle_E,
 \qquad
 \mathcal N_\gamma(\rho):=
 \operatorname{Tr}_E[V_\gamma\rho V_\gamma^\dagger].
 \end{aligned}
 \tag{3}
$$

They proved that the channel in Eq. (3) is neither degradable nor antidegradable throughout this parameter range and nevertheless has

$$
Q(\mathcal N_\gamma)=1.
 \tag{4}
$$

The noiseless subspace $\operatorname{span}\{|0\rangle,|2\rangle\}$ gives the achievable qubit in Eq. (4); their channel analysis supplies the matching upper bound [CG21](https://doi.org/10.1038/s42005-021-00524-4).

Earlier work of D’Arrigo, Benenti, Falci, and Macchiavello determined the quantum capacity and studied the degradability properties of a fully correlated two-qubit amplitude-damping channel. It is a historical antecedent to the multilevel constructions, but the qutrit witness in Eq. (3) independently suffices for the existential question here [DBF+13](https://doi.org/10.1103/PhysRevA.88.042337).

Smith and Wu later constructed broader families of genuinely nondegradable channels with additive coherent information, hence with quantum capacities given by a one-use optimization. Their results provide further exactly solvable examples but postdate the family in Eq. (3) [SW25](https://doi.org/10.1109/TIT.2025.3583936).

## Comment

The family in Eq. (3) solves the literal existence problem. It does not provide a general single-letter formula or a classification of nondegradable channels with additive coherent information.

## References

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 26.6. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**CG21** S. Chessa and V. Giovannetti, “Quantum Capacity Analysis of Multi-Level Amplitude Damping Channels,” *Communications Physics* **4**, 22 (2021). [doi:10.1038/s42005-021-00524-4](https://doi.org/10.1038/s42005-021-00524-4); [arXiv:2008.00477v3](https://arxiv.org/abs/2008.00477v3).

**DBF+13** A. D’Arrigo, G. Benenti, G. Falci, and C. Macchiavello, “Classical and Quantum Capacities of a Fully Correlated Amplitude Damping Channel,” *Physical Review A* **88**, 042337 (2013). [doi:10.1103/PhysRevA.88.042337](https://doi.org/10.1103/PhysRevA.88.042337); [arXiv:1309.2219](https://arxiv.org/abs/1309.2219).

**SW25** G. Smith and P. Wu, “Additivity of Quantum Capacities in Simple Non-Degradable Quantum Channels,” *IEEE Transactions on Information Theory* **71**, 6134–6154 (2025). [doi:10.1109/TIT.2025.3583936](https://doi.org/10.1109/TIT.2025.3583936); [arXiv:2409.03927v4](https://arxiv.org/abs/2409.03927v4).
