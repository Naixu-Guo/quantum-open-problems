---
id: "01M2JD9V7470D2X37R3B59R2VX"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-15T18:45:29.941Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["superactivation","bell-nonlocality","quantum-separability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Many-copy Bell nonlocality of every entangled state"
aliases: ["op-0e0ceaac739b74fd","op_0e0ceaac739b74fd","01M2JD9V7470D2X37R3B59R2VX"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_0e0ceaac739b74fd.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_0e0ceaac739b74fd","ulid":"01M2JD9V7470D2X37R3B59R2VX","aliases":["op_0e0ceaac739b74fd","01M2JD9V7470D2X37R3B59R2VX","op-0e0ceaac739b74fd"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-15T11:30:12.836Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["superactivation","bell-nonlocality","quantum-separability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Many-copy Bell nonlocality of every entangled state","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Superactivation","Bell nonlocality","Quantum separability"],"statement":"Does every entangled bipartite state become Bell nonlocal under collective\nlocal measurements on some finite number of copies?  Fix an integer $d\\geq2$\nand a state $\\rho$ on $\\mathbb C^d\\otimes\\mathbb C^d$.  At blocklength $n$,\nAlice and Bob choose arbitrary collective positive operator-valued measurements\n$\\{M_{a|x}\\}_a$ and $\\{N_{b|y}\\}_b$ on their respective $n$ subsystems.\nSettings $x,y$ and outcomes $a,b$ range over finite sets, and\n\\begin{equation}\n  p_\\rho^{(n)}(a,b\\mid x,y)\n  :=\\operatorname{Tr}\\!\\left[\\rho^{\\otimes n}(M_{a|x}\\otimes N_{b|y})\\right].\n  \\label{eq:0e0c-behavior}\n\\end{equation}\nA behavior is Bell local when it admits a local hidden-variable decomposition\n\\begin{equation}\n  p(a,b\\mid x,y)=\\int\\mu(d\\lambda)\\,p_A(a\\mid x,\\lambda)\\,p_B(b\\mid y,\\lambda),\n  \\label{eq:0e0c-local}\n\\end{equation}\nwhere $\\mu$ is a probability measure independent of the settings and\n$p_A,p_B$ are local response distributions.  For $s\\geq2$, let\n$\\mathsf L^{(s)}$ be the set of states on $\\mathbb C^s\\otimes\\mathbb C^s$ all\nof whose behaviors, for all finite setting and outcome sets and all local\npositive operator-valued measurements, are Bell local.  Let\n$\\mathsf L_\\infty^{(d)}$ be the set of states $\\rho$ for which every behavior\nin Eq.~\\eqref{eq:0e0c-behavior} admits a decomposition as in\nEq.~\\eqref{eq:0e0c-local} for every finite $n$; equivalently,\n$\\rho^{\\otimes n}\\in\\mathsf L^{(d^n)}$ for all $n\\geq1$, with Alice's $n$\nsubsystems grouped against Bob's.  Let $\\mathrm{SEP}_d$ denote the separable\nstates on $\\mathbb C^d\\otimes\\mathbb C^d$.  No communication, auxiliary\nentangled state, or postselection is allowed, and every measurement outcome is\nretained.  The question is whether\n\\begin{equation}\n  \\mathsf L_\\infty^{(d)}=\\mathrm{SEP}_d\n  \\qquad\\text{for every finite }d\\geq2.\n  \\label{eq:0e0c-question}\n\\end{equation}","source":"Cavalcanti, Ac\\'in, Brunner, and V\\'ertesi explicitly ask, in the discussion\nof their results, whether every entangled state is a nonlocal resource when a\nsufficient number of copies is considered \\sourcecite{ref:0e0c-cabv}{CABV13}.\n\\v{S}upi\\'c, Skrzypczyk, and Cavalcanti state in Sec.~I that whether every\nentangled state can be superactivated in this way is open\n\\sourcecite{ref:0e0c-ssc}{SSC17}.  Eq.~\\eqref{eq:0e0c-question} is a precise\nformulation of that question.","progress":["Palazuelos proves that Bell nonlocality can be superactivated by tensor\n  powers without local preprocessing: certain isotropic states that admit a\n  local hidden-variable model for all local positive operator-valued\n  measurements have tensor powers violating a Bell inequality based on the\n  Khot--Vishnoi game \\sourcecite{ref:0e0c-pal}{Pal12}.  Thus\n  \\begin{equation}\n    \\rho\\in\\mathsf L^{(d)},\n    \\qquad\n    \\rho^{\\otimes n}\\notin\\mathsf L^{(d^n)}\n    \\label{eq:0e0c-superactivation}\n  \\end{equation}\n  is possible for some states $\\rho$ and finite $n$.  Existence of the effect\n  in Eq.~\\eqref{eq:0e0c-superactivation} is settled; its universality over\n  entangled states is the question.","Cavalcanti, Ac\\'in, Brunner, and V\\'ertesi prove the sufficient condition\n  \\begin{equation}\n    F_d(\\rho)>\\frac1d\n    \\quad\\Longrightarrow\\quad\n    \\rho\\notin\\mathsf L_\\infty^{(d)},\n    \\label{eq:0e0c-fraction-criterion}\n  \\end{equation}\n  where\n  \\begin{equation}\n    F_d(\\rho):=\\max_{U\\in\\mathrm U(d)}\n    \\langle\\Phi_d|(I_d\\otimes U)\\rho(I_d\\otimes U^\\dagger)|\\Phi_d\\rangle,\n    \\qquad\n    |\\Phi_d\\rangle:=\\frac1{\\sqrt d}\\sum_{j=0}^{d-1}|jj\\rangle,\n    \\label{eq:0e0c-fraction}\n  \\end{equation}\n  is the fully entangled fraction and $\\mathrm U(d)$ is the unitary group\n  \\sourcecite{ref:0e0c-cabv}{CABV13}.  Their proof twirls $\\rho$ into an\n  isotropic state with the same value of Eq.~\\eqref{eq:0e0c-fraction} and\n  applies Khot--Vishnoi Bell inequalities to collective local measurements on\n  $\\rho^{\\otimes k}$; the twirling unitaries are absorbed into the local\n  measurements, so no filtering, auxiliary state, or postselection is used.\n  Eq.~\\eqref{eq:0e0c-fraction-criterion} covers every entangled isotropic\n  state, but not every entangled state: the authors note that it does not\n  apply to some distillable states.","\\v{S}upi\\'c, Skrzypczyk, and Cavalcanti distinguish the many-copy scenario\n  from quantum networks, hidden nonlocality with local preprocessing, and\n  Bell tests with quantum inputs, in which every entangled state can be\n  detected \\sourcecite{ref:0e0c-ssc}{SSC17}.  The unresolved implication is\n  \\begin{equation}\n    \\rho\\notin\\mathrm{SEP}_d\n    \\quad\\Longrightarrow\\quad\n    \\exists\\,n\\geq1:\\ \\rho^{\\otimes n}\\notin\\mathsf L^{(d^n)},\n    \\label{eq:0e0c-implication}\n  \\end{equation}\n  not a scenario in which a referee supplies additional quantum inputs.","Renner, Lobo, Konderak, Augusiak, and Ac\\'in prove a stronger many-copy\n  statement for pure states: for every pure entangled state $|\\psi\\rangle$\n  there is an integer $k$ such that suitable local measurements on\n  $|\\psi\\rangle^{\\otimes k}$ give a behavior with zero local content (Result~2\n  in Sec.~V of \\sourcecite{ref:0e0c-rlkaa}{RLKAA26}).  The local content of a\n  nonsignaling behavior $p$ is\n  \\begin{equation}\n    \\operatorname{LC}(p):=\\max\\left\\{q\\in[0,1]:\\\n    p=q\\,p_L+(1-q)\\,p_{\\mathrm{NS}},\\\n    p_L\\ \\text{Bell local},\\ p_{\\mathrm{NS}}\\ \\text{nonsignaling}\\right\\}.\n    \\label{eq:0e0c-local-content}\n  \\end{equation}\n  Pure entangled states are already Bell nonlocal for a single copy, as\n  recalled in \\sourcecite{ref:0e0c-pal}{Pal12}; the conclusion\n  $\\operatorname{LC}(p)=0$ in Eq.~\\eqref{eq:0e0c-local-content} strengthens\n  the pure-state case and does not address mixed states."],"references":[{"key":"Pal12","label":"ref:0e0c-pal","tex":"C. Palazuelos, ``Superactivation of Quantum Nonlocality,''\n  \\emph{Physical Review Letters} \\textbf{109}, 190401 (2012).\n  \\href{https://doi.org/10.1103/PhysRevLett.109.190401}{doi:10.1103/PhysRevLett.109.190401};\n  \\href{https://arxiv.org/abs/1205.3118}{arXiv:1205.3118}."},{"key":"CABV13","label":"ref:0e0c-cabv","tex":"D. Cavalcanti, A. Ac\\'in, N. Brunner, and T. V\\'ertesi, ``All Quantum\n  States Useful for Teleportation Are Nonlocal Resources,'' \\emph{Physical\n  Review A} \\textbf{87}, 042104 (2013).\n  \\href{https://doi.org/10.1103/PhysRevA.87.042104}{doi:10.1103/PhysRevA.87.042104};\n  \\href{https://arxiv.org/abs/1207.5485}{arXiv:1207.5485}."},{"key":"SSC17","label":"ref:0e0c-ssc","tex":"I. \\v{S}upi\\'c, P. Skrzypczyk, and D. Cavalcanti,\n  ``Measurement-Device-Independent Entanglement and Randomness Estimation in\n  Quantum Networks,'' \\emph{Physical Review A} \\textbf{95}, 042340 (2017).\n  \\href{https://doi.org/10.1103/PhysRevA.95.042340}{doi:10.1103/PhysRevA.95.042340};\n  \\href{https://arxiv.org/abs/1702.04752}{arXiv:1702.04752}."},{"key":"RLKAA26","label":"ref:0e0c-rlkaa","tex":"M. J. Renner, E. P. Lobo, A. Konderak, R. Augusiak, and A. Ac\\'in, ``All\n  Pure Entangled States Can Lead to Fully Nonlocal Correlations,'' arXiv\n  preprint, version 1, 29 April 2026.\n  \\href{https://arxiv.org/abs/2604.26605}{arXiv:2604.26605}."}],"comment":"No proof or counterexample to Eq.~\\eqref{eq:0e0c-question} is known.  A\ncounterexample must be an entangled state with a local hidden-variable model\nfor every finite tensor power and all collective local measurements, not\nmerely a state that passes finitely many Bell tests.  This many-copy property\nis not a regularized rate, so activation by copies of the same state is\nmeaningful here.  Activation with auxiliary states, local filtering, networks,\nor quantum inputs concerns different scenarios.  Literature checked through 15 September 2026.","contributors":[]}}
---
## Source

Cavalcanti, Acín, Brunner, and Vértesi explicitly ask, in the discussion of their results, whether every entangled state is a nonlocal resource when a sufficient number of copies is considered [CABV13](https://doi.org/10.1103/PhysRevA.87.042104). Šupić, Skrzypczyk, and Cavalcanti state in Sec. I that whether every entangled state can be superactivated in this way is open [SSC17](https://doi.org/10.1103/PhysRevA.95.042340). Eq. (3) is a precise formulation of that question.

## Progress

Palazuelos proves that Bell nonlocality can be superactivated by tensor powers without local preprocessing: certain isotropic states that admit a local hidden-variable model for all local positive operator-valued measurements have tensor powers violating a Bell inequality based on the Khot–Vishnoi game [Pal12](https://doi.org/10.1103/PhysRevLett.109.190401). Thus

$$
\rho\in\mathsf L^{(d)},
 \qquad
 \rho^{\otimes n}\notin\mathsf L^{(d^n)}
 \tag{4}
$$

is possible for some states $\rho$ and finite $n$. Existence of the effect in Eq. (4) is settled; its universality over entangled states is the question.

Cavalcanti, Acín, Brunner, and Vértesi prove the sufficient condition

$$
F_d(\rho)>\frac1d
 \quad\Longrightarrow\quad
 \rho\notin\mathsf L_\infty^{(d)},
 \tag{5}
$$

where

$$
F_d(\rho):=\max_{U\in\mathrm U(d)}
 \langle\Phi_d|(I_d\otimes U)\rho(I_d\otimes U^\dagger)|\Phi_d\rangle,
 \qquad
 |\Phi_d\rangle:=\frac1{\sqrt d}\sum_{j=0}^{d-1}|jj\rangle,
 \tag{6}
$$

is the fully entangled fraction and $\mathrm U(d)$ is the unitary group [CABV13](https://doi.org/10.1103/PhysRevA.87.042104). Their proof twirls $\rho$ into an isotropic state with the same value of Eq. (6) and applies Khot–Vishnoi Bell inequalities to collective local measurements on $\rho^{\otimes k}$; the twirling unitaries are absorbed into the local measurements, so no filtering, auxiliary state, or postselection is used. Eq. (5) covers every entangled isotropic state, but not every entangled state: the authors note that it does not apply to some distillable states.

Šupić, Skrzypczyk, and Cavalcanti distinguish the many-copy scenario from quantum networks, hidden nonlocality with local preprocessing, and Bell tests with quantum inputs, in which every entangled state can be detected [SSC17](https://doi.org/10.1103/PhysRevA.95.042340). The unresolved implication is

$$
\rho\notin\mathrm{SEP}_d
 \quad\Longrightarrow\quad
 \exists\,n\geq1:\ \rho^{\otimes n}\notin\mathsf L^{(d^n)},
 \tag{7}
$$

not a scenario in which a referee supplies additional quantum inputs.

Renner, Lobo, Konderak, Augusiak, and Acín prove a stronger many-copy statement for pure states: for every pure entangled state $|\psi\rangle$ there is an integer $k$ such that suitable local measurements on $|\psi\rangle^{\otimes k}$ give a behavior with zero local content (Result 2 in Sec. V of [RLKAA26](https://arxiv.org/abs/2604.26605)). The local content of a nonsignaling behavior $p$ is

$$
\operatorname{LC}(p):=\max\left\{q\in[0,1]:\
 p=q\,p_L+(1-q)\,p_{\mathrm{NS}},\
 p_L\ \text{Bell local},\ p_{\mathrm{NS}}\ \text{nonsignaling}\right\}.
 \tag{8}
$$

Pure entangled states are already Bell nonlocal for a single copy, as recalled in [Pal12](https://doi.org/10.1103/PhysRevLett.109.190401); the conclusion $\operatorname{LC}(p)=0$ in Eq. (8) strengthens the pure-state case and does not address mixed states.

## Comment

No proof or counterexample to Eq. (3) is known. A counterexample must be an entangled state with a local hidden-variable model for every finite tensor power and all collective local measurements, not merely a state that passes finitely many Bell tests. This many-copy property is not a regularized rate, so activation by copies of the same state is meaningful here. Activation with auxiliary states, local filtering, networks, or quantum inputs concerns different scenarios. Literature checked through 15 September 2026.

## References

**Pal12** C. Palazuelos, “Superactivation of Quantum Nonlocality,” *Physical Review Letters* **109**, 190401 (2012). [doi:10.1103/PhysRevLett.109.190401](https://doi.org/10.1103/PhysRevLett.109.190401); [arXiv:1205.3118](https://arxiv.org/abs/1205.3118).

**CABV13** D. Cavalcanti, A. Acín, N. Brunner, and T. Vértesi, “All Quantum States Useful for Teleportation Are Nonlocal Resources,” *Physical Review A* **87**, 042104 (2013). [doi:10.1103/PhysRevA.87.042104](https://doi.org/10.1103/PhysRevA.87.042104); [arXiv:1207.5485](https://arxiv.org/abs/1207.5485).

**SSC17** I. Šupić, P. Skrzypczyk, and D. Cavalcanti, “Measurement-Device-Independent Entanglement and Randomness Estimation in Quantum Networks,” *Physical Review A* **95**, 042340 (2017). [doi:10.1103/PhysRevA.95.042340](https://doi.org/10.1103/PhysRevA.95.042340); [arXiv:1702.04752](https://arxiv.org/abs/1702.04752).

**RLKAA26** M. J. Renner, E. P. Lobo, A. Konderak, R. Augusiak, and A. Acín, “All Pure Entangled States Can Lead to Fully Nonlocal Correlations,” arXiv preprint, version 1, 29 April 2026. [arXiv:2604.26605](https://arxiv.org/abs/2604.26605).
