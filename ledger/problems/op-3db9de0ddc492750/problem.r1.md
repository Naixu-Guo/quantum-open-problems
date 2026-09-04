---
id: "01M1HME7807PZA3MKVGSNTAP1V"
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
areaIds: ["quantum-resource-theory"]
topicIds: ["bell-nonlocality","resource-conversion"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Finite-alphabet nonsignalling simulation of entangled qubits"
aliases: ["op-3db9de0ddc492750","op_3db9de0ddc492750","01M1HME7807PZA3MKVGSNTAP1V","v2-finite-alphabet-nonsignalling-simulation-of-entangled-qubits","open-problem-v2-problem-29"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_3db9de0ddc492750.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_3db9de0ddc492750","ulid":"01M1HME7807PZA3MKVGSNTAP1V","aliases":["op_3db9de0ddc492750","01M1HME7807PZA3MKVGSNTAP1V","op-3db9de0ddc492750","v2-finite-alphabet-nonsignalling-simulation-of-entangled-qubits","open-problem-v2-problem-29"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["bell-nonlocality","resource-conversion"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Finite-alphabet nonsignalling simulation of entangled qubits","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Bell nonlocality","Resource conversion"],"statement":"For every partially entangled two-qubit pure state, does some fixed\nfinite-alphabet nonsignalling resource give an exact noncommunicating\nsimulation of all local projective measurements?  Fix\n\\begin{equation}\n  \\lvert\\psi_\\theta\\rangle\n  =\\cos\\theta\\,\\lvert00\\rangle+\\sin\\theta\\,\\lvert11\\rangle,\n  \\qquad 0<\\theta<\\frac{\\pi}{4}.\n  \\label{eq:p29-partially-entangled-state}\n\\end{equation}\nThe target correlations for Bloch directions\n$\\mathbf x,\\mathbf y\\in S^2$ are\n\\begin{equation}\n  P_\\theta(a,b\\mid\\mathbf x,\\mathbf y)\n  =\\operatorname{Tr}\\!\\left[\n    \\lvert\\psi_\\theta\\rangle\\!\\langle\\psi_\\theta\\rvert\n    \\bigl(M_{a\\mid\\mathbf x}\\otimes M_{b\\mid\\mathbf y}\\bigr)\n    \\right],\n  \\qquad a,b\\in\\{0,1\\},\n  \\label{eq:p29-target-correlation}\n\\end{equation}\nwhere $M_{a\\mid\\mathbf x}=(I+(-1)^a\\mathbf x\\cdot\\boldsymbol\\sigma)/2$\nand similarly for Bob.  For each $\\theta$ in\nEq.~\\eqref{eq:p29-partially-entangled-state}, one may choose a nonsignalling\nbox $R(u,v\\mid s,t)$ with finite input and output alphabets and a finite\nnumber of copies of it.  The box, the number of copies, and the local wiring\nmay depend on $\\theta$ but not on $\\mathbf x$ or $\\mathbf y$, and the wiring\nmay use unlimited shared randomness but no communication.  It must reproduce\nEq.~\\eqref{eq:p29-target-correlation} exactly.","source":"Gisin explicitly poses finite-alphabet nonsignalling simulation, while\nBrunner et al. isolate the same finiteness gap after giving a continuous-input\nconstruction \\sourcecite{ref:p29-gisin}{Gis09},\n\\sourcecite{ref:p29-brunner-pra}{BGPS08}.","progress":["Gisin posed the existence of a finite-input, finite-output\n  nonsignalling resource for this task\n  \\sourcecite{ref:p29-gisin}{Gis09}.","At the excluded maximally entangled endpoint $\\theta=\\pi/4$, one\n  finite-alphabet PR box and shared randomness reproduce all local projective\n  measurements exactly \\sourcecite{ref:p29-cerf}{CGMP05}.","Brunner, Gisin, Popescu, and Scarani constructed an exact simulation\n  for every state in Eq.~\\eqref{eq:p29-partially-entangled-state}, but their\n  protocol uses a continuous-input millionaire box that compares real\n  parameters.  They explicitly leave replacement by finite-input resources\n  open \\sourcecite{ref:p29-brunner-pra}{BGPS08}.","Some finite measurement sets obtained from partially entangled states\n  cannot be simulated with a single PR box.  This rules out one particular\n  resource budget, not all finite-alphabet resources or all finite numbers of\n  uses \\sourcecite{ref:p29-brunner-njp}{BGS05}."],"references":[{"key":"Gis09","label":"ref:p29-gisin","tex":"N. Gisin, ``Bell Inequalities: Many Questions, a Few Answers,'' in\n  W. C. Myrvold and J. Christian (eds.), \\emph{Quantum Reality, Relativistic\n  Causality, and Closing the Epistemic Circle}, The Western Ontario Series in\n  Philosophy of Science \\textbf{73}, 125--138 (Springer, 2009).\n  \\href{https://doi.org/10.1007/978-1-4020-9107-0_9}{doi:10.1007/978-1-4020-9107-0\\_9};\n  \\href{https://arxiv.org/abs/quant-ph/0702021}{arXiv:quant-ph/0702021}."},{"key":"CGMP05","label":"ref:p29-cerf","tex":"N. J. Cerf, N. Gisin, S. Massar, and S. Popescu, ``Simulating Maximal\n  Quantum Entanglement without Communication,'' \\emph{Physical Review\n  Letters} \\textbf{94}, 220403 (2005).\n  \\href{https://doi.org/10.1103/PhysRevLett.94.220403}{doi:10.1103/PhysRevLett.94.220403};\n  \\href{https://arxiv.org/abs/quant-ph/0410027}{arXiv:quant-ph/0410027}."},{"key":"BGPS08","label":"ref:p29-brunner-pra","tex":"N. Brunner, N. Gisin, S. Popescu, and V. Scarani, ``Simulation of Partial\n  Entanglement with Nonsignaling Resources,'' \\emph{Physical Review A}\n  \\textbf{78}, 052111 (2008).\n  \\href{https://doi.org/10.1103/PhysRevA.78.052111}{doi:10.1103/PhysRevA.78.052111};\n  \\href{https://arxiv.org/abs/0803.2359}{arXiv:0803.2359}."},{"key":"BGS05","label":"ref:p29-brunner-njp","tex":"N. Brunner, N. Gisin, and V. Scarani, ``Entanglement and Non-locality Are\n  Different Resources,'' \\emph{New Journal of Physics} \\textbf{7}, 88\n  (2005). \\href{https://doi.org/10.1088/1367-2630/7/1/088}{doi:10.1088/1367-2630/7/1/088};\n  \\href{https://arxiv.org/abs/quant-ph/0412109}{arXiv:quant-ph/0412109}."}],"comment":"Continuous-input nonsignalling simulation is known, whereas exact simulation\nby any finite-alphabet box used finitely many times is not.  The finiteness\nrequirement applies to both input and output alphabets and to the number of\nresource uses."}}
---
## Source

Gisin explicitly poses finite-alphabet nonsignalling simulation, while Brunner et al. isolate the same finiteness gap after giving a continuous-input construction [Gis09](https://doi.org/10.1007/978-1-4020-9107-0_9), [BGPS08](https://doi.org/10.1103/PhysRevA.78.052111).

## Progress

Gisin posed the existence of a finite-input, finite-output nonsignalling resource for this task [Gis09](https://doi.org/10.1007/978-1-4020-9107-0_9).

At the excluded maximally entangled endpoint $\theta=\pi/4$, one finite-alphabet PR box and shared randomness reproduce all local projective measurements exactly [CGMP05](https://doi.org/10.1103/PhysRevLett.94.220403).

Brunner, Gisin, Popescu, and Scarani constructed an exact simulation for every state in Eq. (1), but their protocol uses a continuous-input millionaire box that compares real parameters. They explicitly leave replacement by finite-input resources open [BGPS08](https://doi.org/10.1103/PhysRevA.78.052111).

Some finite measurement sets obtained from partially entangled states cannot be simulated with a single PR box. This rules out one particular resource budget, not all finite-alphabet resources or all finite numbers of uses [BGS05](https://doi.org/10.1088/1367-2630/7/1/088).

## Comment

Continuous-input nonsignalling simulation is known, whereas exact simulation by any finite-alphabet box used finitely many times is not. The finiteness requirement applies to both input and output alphabets and to the number of resource uses.

## References

**Gis09** N. Gisin, “Bell Inequalities: Many Questions, a Few Answers,” in W. C. Myrvold and J. Christian (eds.), *Quantum Reality, Relativistic Causality, and Closing the Epistemic Circle*, The Western Ontario Series in Philosophy of Science **73**, 125–138 (Springer, 2009). [doi:10.1007/978-1-4020-9107-0_9](https://doi.org/10.1007/978-1-4020-9107-0_9); [arXiv:quant-ph/0702021](https://arxiv.org/abs/quant-ph/0702021).

**CGMP05** N. J. Cerf, N. Gisin, S. Massar, and S. Popescu, “Simulating Maximal Quantum Entanglement without Communication,” *Physical Review Letters* **94**, 220403 (2005). [doi:10.1103/PhysRevLett.94.220403](https://doi.org/10.1103/PhysRevLett.94.220403); [arXiv:quant-ph/0410027](https://arxiv.org/abs/quant-ph/0410027).

**BGPS08** N. Brunner, N. Gisin, S. Popescu, and V. Scarani, “Simulation of Partial Entanglement with Nonsignaling Resources,” *Physical Review A* **78**, 052111 (2008). [doi:10.1103/PhysRevA.78.052111](https://doi.org/10.1103/PhysRevA.78.052111); [arXiv:0803.2359](https://arxiv.org/abs/0803.2359).

**BGS05** N. Brunner, N. Gisin, and V. Scarani, “Entanglement and Non-locality Are Different Resources,” *New Journal of Physics* **7**, 88 (2005). [doi:10.1088/1367-2630/7/1/088](https://doi.org/10.1088/1367-2630/7/1/088); [arXiv:quant-ph/0412109](https://arxiv.org/abs/quant-ph/0412109).
