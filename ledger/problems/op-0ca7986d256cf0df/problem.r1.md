---
id: "01M22DB10WQKKPR643DRENCH01"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T06:24:03.656Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication","quantum-resource-theory"]
topicIds: ["entanglement-cost","quantum-communication-complexity","local-operations-and-classical-communication"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME780TJ3Z7X332QY1GWFR"]
title: "Exponential entanglement cost with simultaneous classical communication"
aliases: ["op-0ca7986d256cf0df","op_0ca7986d256cf0df","01M22DB10WQKKPR643DRENCH01"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_0ca7986d256cf0df.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_0ca7986d256cf0df","ulid":"01M22DB10WQKKPR643DRENCH01","aliases":["op_0ca7986d256cf0df","01M22DB10WQKKPR643DRENCH01","op-0ca7986d256cf0df"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T06:23:00.636Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication","quantum-resource-theory"],"topicIds":["entanglement-cost","quantum-communication-complexity","local-operations-and-classical-communication"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME780TJ3Z7X332QY1GWFR"]},"title":"Exponential entanglement cost with simultaneous classical communication","status":"Unsolved","fields":["Quantum Communication","Quantum Resource Theory"],"topics":["Entanglement cost","Quantum communication complexity","Local operations and classical communication"],"statement":"Does there exist a family of bipartite unitaries requiring exponentially many shared Bell pairs for fixed-error implementation when classical communication is limited to one simultaneous exchange? For every integer $n\\geq1$, let $U_n$ act on $\\mathcal H_{A_n}\\otimes\\mathcal H_{B_n}=(\\mathbb C^2)^{\\otimes n}\\otimes(\\mathbb C^2)^{\\otimes n}$, with $n$ qubits held by each party. The allowed protocols $\\Lambda\\in\\mathrm{LOBC}$ use arbitrary local quantum operations and one simultaneous exchange of classical messages: each outgoing message is fixed before the incoming message is read. No quantum communication or shared entanglement beyond the supplied Bell pairs is allowed.\n\nDefine the Bell-pair state and target channel by Eq.~\\eqref{eq:lobc-target}, where $\\rho$ is an arbitrary input density operator:\n\\begin{equation}\n\\begin{gathered}\n|\\Phi_2\\rangle:=\\frac{|00\\rangle+|11\\rangle}{\\sqrt2},\\qquad\n\\Phi_2:=|\\Phi_2\\rangle\\langle\\Phi_2|,\\\\\n\\mathcal U_n(\\rho):=U_n\\rho U_n^\\dagger.\n\\end{gathered}\n\\label{eq:lobc-target}\n\\end{equation}\nFor $0\\leq\\varepsilon<1/10$, the minimum Bell-pair cost is Eq.~\\eqref{eq:lobc-cost}:\n\\begin{equation}\nE_{\\parallel}^{\\varepsilon}(U_n):=\\min\\left\\{\nE\\in\\mathbb Z_{\\geq0}:\\ \\begin{gathered}\n\\exists\\Lambda\\in\\mathrm{LOBC},\\\\\n\\frac12\\left\\|\\Lambda\\bigl(\\,\\cdot\\,\\otimes\\Phi_2^{\\otimes E}\\bigr)-\\mathcal U_n\\right\\|_{\\diamond}\\leq\\varepsilon\n\\end{gathered}\\right\\}.\n\\label{eq:lobc-cost}\n\\end{equation}\nHere $\\|\\cdot\\|_{\\diamond}$ is the diamond norm, including arbitrary reference systems, and the minimum is $+\\infty$ if the feasible set is empty. Each $\\Lambda$ is a deterministic channel returning the two prescribed $n$-qubit outputs after discarding auxiliary systems. The question asks whether there exist such a family and constants $c>0$ and $\\varepsilon_0\\in(0,1/10)$ satisfying Eq.~\\eqref{eq:lobc-exponential}:\n\\begin{equation}\nE_{\\parallel}^{\\varepsilon_0}(U_n)\\geq2^{cn}\n\\qquad\\text{for all sufficiently large }n.\n\\label{eq:lobc-exponential}\n\\end{equation}","source":"This is the fixed-error formulation of the exponential LOBC entanglement-cost question discussed by Gonzales and Chitambar in Section II, p.~3 of the arXiv version \\sourcecite{ref:lobc-bounds}{GC20}. The Bell-pair cost, half-diamond-norm convention, and worst-case family quantifiers make the supplied formulation precise. The simultaneous-classical-message restriction is essential; the broader quantum-message problem discussed by May is distinct \\sourcecite{ref:lobc-may}{May26}.","progress":["With unrestricted interactive LOCC, teleporting one input to the other party and teleporting its output back gives\n  \\begin{equation}\nE_{\\mathrm{LOCC}}^{0}(U_n)\\leq2n,\n\\label{eq:lobc-progress1-1}\n\\end{equation}\n  In Eq.~\\eqref{eq:lobc-progress1-1}, $E_{\\mathrm{LOCC}}^{0}(U_n)$ denotes the minimum Bell-pair cost of exact implementation with unrestricted classical interaction; the two successive teleportations generally violate the simultaneous-message restriction. \\sourcecite{ref:lobc-teleportation}{BK11}","Port-based teleportation gives a universal sufficient resource bound: Theorem III.1(ii) of \\sourcecite{ref:lobc-teleportation}{BK11}, converted to the half-diamond-norm convention above and rounded to an integer number of ports, yields\n  \\begin{equation}\nE_{\\parallel}^{\\varepsilon}(U_n)\n  \\leq n\\left(1+3\\left\\lceil\\frac{2^{8n+2}}{\\varepsilon^2}\\right\\rceil\\right)\n  =O\\left(\\frac{n\\,2^{8n}}{\\varepsilon^2}\\right),\n  \\qquad 0<\\varepsilon<1/10.\n\\label{eq:lobc-progress2-1}\n\\end{equation}\n  Equation~\\eqref{eq:lobc-progress2-1} is an achievable upper bound, not a claim that this particular exponent or error dependence is optimal. \\sourcecite{ref:lobc-teleportation}{BK11}","Theorem 3 of Gonzales and Chitambar (arXiv p.~6) gives a rigorous unbounded separation between interactive and simultaneous classical communication for exact controlled gates: writing $A_n=A_1A_{\\mathrm{rest}}$ for Alice's first qubit and remaining qubits, define\n  \\begin{equation}\nD_n:=\\sum_{k=0}^{2^n-1}e^{i\\theta_k}|k\\rangle\\langle k|_{B_n},\n  \\qquad\n  \\theta_k\\in[0,2\\pi),\\quad\\theta_k\\neq\\theta_l\\text{ for }k\\neq l,\n\\label{eq:lobc-progress3-1}\n\\end{equation}\n  \\begin{equation}\nV_n:=|0\\rangle\\langle0|_{A_1}\\otimes I_{A_{\\mathrm{rest}}}\\otimes I_{B_n}\n  +|1\\rangle\\langle1|_{A_1}\\otimes I_{A_{\\mathrm{rest}}}\\otimes D_n,\n\\label{eq:lobc-progress3-2}\n\\end{equation}\n  In Eqs.~\\eqref{eq:lobc-progress3-1} and \\eqref{eq:lobc-progress3-2}, $k$ labels Bob's computational basis and the $I$ operators are identities on the indicated systems, for which\n  \\begin{equation}\nE_{\\parallel}^{0}(V_n)\\geq n,\n  \\qquad\n  E_{\\mathrm{LOCC}}^{0}(V_n)\\leq2.\n\\label{eq:lobc-progress3-3}\n\\end{equation}\n  The lower bound in Eq.~\\eqref{eq:lobc-progress3-3} is linear in the number of qubits and assumes zero error. \\sourcecite{ref:lobc-bounds}{GC20}","The July 19, 2026 revision of May's treatment (version 2, Chapter 13) explicitly leaves exponential entanglement lower bounds open in the more permissive model with a simultaneous exchange of quantum messages; denoting its minimum Bell-pair cost at the same error tolerance by $E_{\\parallel,\\mathrm q}^{\\varepsilon}(U_n)$, protocol inclusion gives\n  \\begin{equation}\nE_{\\parallel,\\mathrm q}^{\\varepsilon}(U_n)\n  \\leq E_{\\parallel}^{\\varepsilon}(U_n).\n\\label{eq:lobc-progress4-1}\n\\end{equation}\n  By Eq.~\\eqref{eq:lobc-progress4-1}, an exponential lower bound in that model would imply one here, but its unresolved status alone does not establish the status of the classical-message subcase, which is formulated separately in \\sourcecite{ref:lobc-bounds}{GC20}. \\sourcecite{ref:lobc-bounds}{GC20}, \\sourcecite{ref:lobc-may}{May26}"],"references":[{"key":"BK11","label":"ref:lobc-teleportation","tex":"S. Beigi and R. König, ``Simplified Instantaneous Non-Local Quantum Computation with Applications to Position-Based Cryptography,'' \\emph{New Journal of Physics} \\textbf{13}, 093036 (2011). \\href{https://doi.org/10.1088/1367-2630/13/9/093036}{doi:10.1088/1367-2630/13/9/093036}; \\href{https://arxiv.org/abs/1101.1065}{arXiv:1101.1065}."},{"key":"GC20","label":"ref:lobc-bounds","tex":"A. Gonzales and E. Chitambar, ``Bounds on Instantaneous Nonlocal Quantum Computation,'' \\emph{IEEE Transactions on Information Theory} \\textbf{66}, 2951–2963 (2020). \\href{https://doi.org/10.1109/TIT.2019.2950190}{doi:10.1109/TIT.2019.2950190}; \\href{https://arxiv.org/abs/1810.00994}{arXiv:1810.00994}."},{"key":"May26","label":"ref:lobc-may","tex":"A. May, ``Entanglement Cost in Non-Local Quantum Computation,'' arXiv preprint (2026), version 2, revised 19 July 2026. \\href{https://doi.org/10.48550/arXiv.2605.02840}{doi:10.48550/arXiv.2605.02840}; \\href{https://arxiv.org/abs/2605.02840}{arXiv:2605.02840}."}],"comment":"No resolution of the stated classical-message, fixed-error exponential lower bound was found in the literature checked through September 9, 2026. An exponential achievable cost does not prove necessity, and an exact-implementation lower bound need not survive a fixed nonzero error tolerance. The question concerns a worst-case family rather than every unitary, and permits protocols tailored to a complete classical description of each $U_n$, not only black-box protocols. The status audit used public primary sources and later-work searches through 9 September 2026; it was not an exhaustive citation-index audit. The related catalog entry \\texttt{op\\_96cf7aa1c1be9be2} asks a polynomial support-rank lower bound for an explicit Boolean routing family with arbitrary shared states and unrestricted simultaneous message type. This entry instead asks an exponential Bell-pair lower bound for general bipartite unitary families with classical messages only."}}
---
## Source

This is the fixed-error formulation of the exponential LOBC entanglement-cost question discussed by Gonzales and Chitambar in Section II, p. 3 of the arXiv version [GC20](https://doi.org/10.1109/TIT.2019.2950190). The Bell-pair cost, half-diamond-norm convention, and worst-case family quantifiers make the supplied formulation precise. The simultaneous-classical-message restriction is essential; the broader quantum-message problem discussed by May is distinct [May26](https://doi.org/10.48550/arXiv.2605.02840).

## Progress

With unrestricted interactive LOCC, teleporting one input to the other party and teleporting its output back gives

$$
E_{\mathrm{LOCC}}^{0}(U_n)\leq2n,
\tag{4}
$$

In Eq. (4), $E_{\mathrm{LOCC}}^{0}(U_n)$ denotes the minimum Bell-pair cost of exact implementation with unrestricted classical interaction; the two successive teleportations generally violate the simultaneous-message restriction. [BK11](https://doi.org/10.1088/1367-2630/13/9/093036)

Port-based teleportation gives a universal sufficient resource bound: Theorem III.1(ii) of [BK11](https://doi.org/10.1088/1367-2630/13/9/093036), converted to the half-diamond-norm convention above and rounded to an integer number of ports, yields

$$
E_{\parallel}^{\varepsilon}(U_n)
 \leq n\left(1+3\left\lceil\frac{2^{8n+2}}{\varepsilon^2}\right\rceil\right)
 =O\left(\frac{n\,2^{8n}}{\varepsilon^2}\right),
 \qquad 0<\varepsilon<1/10.
\tag{5}
$$

Equation (5) is an achievable upper bound, not a claim that this particular exponent or error dependence is optimal. [BK11](https://doi.org/10.1088/1367-2630/13/9/093036)

Theorem 3 of Gonzales and Chitambar (arXiv p. 6) gives a rigorous unbounded separation between interactive and simultaneous classical communication for exact controlled gates: writing $A_n=A_1A_{\mathrm{rest}}$ for Alice’s first qubit and remaining qubits, define

$$
D_n:=\sum_{k=0}^{2^n-1}e^{i\theta_k}|k\rangle\langle k|_{B_n},
 \qquad
 \theta_k\in[0,2\pi),\quad\theta_k\neq\theta_l\text{ for }k\neq l,
\tag{6}
$$

$$
V_n:=|0\rangle\langle0|_{A_1}\otimes I_{A_{\mathrm{rest}}}\otimes I_{B_n}
 +|1\rangle\langle1|_{A_1}\otimes I_{A_{\mathrm{rest}}}\otimes D_n,
\tag{7}
$$

In Eqs. (6) and (7), $k$ labels Bob’s computational basis and the $I$ operators are identities on the indicated systems, for which

$$
E_{\parallel}^{0}(V_n)\geq n,
 \qquad
 E_{\mathrm{LOCC}}^{0}(V_n)\leq2.
\tag{8}
$$

The lower bound in Eq. (8) is linear in the number of qubits and assumes zero error. [GC20](https://doi.org/10.1109/TIT.2019.2950190)

The July 19, 2026 revision of May’s treatment (version 2, Chapter 13) explicitly leaves exponential entanglement lower bounds open in the more permissive model with a simultaneous exchange of quantum messages; denoting its minimum Bell-pair cost at the same error tolerance by $E_{\parallel,\mathrm q}^{\varepsilon}(U_n)$, protocol inclusion gives

$$
E_{\parallel,\mathrm q}^{\varepsilon}(U_n)
 \leq E_{\parallel}^{\varepsilon}(U_n).
\tag{9}
$$

By Eq. (9), an exponential lower bound in that model would imply one here, but its unresolved status alone does not establish the status of the classical-message subcase, which is formulated separately in [GC20](https://doi.org/10.1109/TIT.2019.2950190). [GC20](https://doi.org/10.1109/TIT.2019.2950190), [May26](https://doi.org/10.48550/arXiv.2605.02840)

## Comment

No resolution of the stated classical-message, fixed-error exponential lower bound was found in the literature checked through September 9, 2026. An exponential achievable cost does not prove necessity, and an exact-implementation lower bound need not survive a fixed nonzero error tolerance. The question concerns a worst-case family rather than every unitary, and permits protocols tailored to a complete classical description of each $U_n$, not only black-box protocols. The status audit used public primary sources and later-work searches through 9 September 2026; it was not an exhaustive citation-index audit. The related catalog entry `op_96cf7aa1c1be9be2` asks a polynomial support-rank lower bound for an explicit Boolean routing family with arbitrary shared states and unrestricted simultaneous message type. This entry instead asks an exponential Bell-pair lower bound for general bipartite unitary families with classical messages only.

## References

**BK11** S. Beigi and R. König, “Simplified Instantaneous Non-Local Quantum Computation with Applications to Position-Based Cryptography,” *New Journal of Physics* **13**, 093036 (2011). [doi:10.1088/1367-2630/13/9/093036](https://doi.org/10.1088/1367-2630/13/9/093036); [arXiv:1101.1065](https://arxiv.org/abs/1101.1065).

**GC20** A. Gonzales and E. Chitambar, “Bounds on Instantaneous Nonlocal Quantum Computation,” *IEEE Transactions on Information Theory* **66**, 2951–2963 (2020). [doi:10.1109/TIT.2019.2950190](https://doi.org/10.1109/TIT.2019.2950190); [arXiv:1810.00994](https://arxiv.org/abs/1810.00994).

**May26** A. May, “Entanglement Cost in Non-Local Quantum Computation,” arXiv preprint (2026), version 2, revised 19 July 2026. [doi:10.48550/arXiv.2605.02840](https://doi.org/10.48550/arXiv.2605.02840); [arXiv:2605.02840](https://arxiv.org/abs/2605.02840).
