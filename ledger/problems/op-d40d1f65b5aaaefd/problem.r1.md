---
id: "01M22DB1330VH6YMAD2R4Y689M"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T06:24:03.656Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-cost","local-operations-and-classical-communication"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Exact LOCC entanglement cost of the elegant joint measurement"
aliases: ["op-d40d1f65b5aaaefd","op_d40d1f65b5aaaefd","01M22DB1330VH6YMAD2R4Y689M"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_d40d1f65b5aaaefd.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_d40d1f65b5aaaefd","ulid":"01M22DB1330VH6YMAD2R4Y689M","aliases":["op_d40d1f65b5aaaefd","01M22DB1330VH6YMAD2R4Y689M","op-d40d1f65b5aaaefd"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T06:23:00.707Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-cost","local-operations-and-classical-communication"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Exact LOCC entanglement cost of the elegant joint measurement","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement cost","Local operations and classical communication"],"statement":"Is the exact deterministic LOCC entanglement cost of the two-qubit elegant joint measurement $\\mathcal M_{\\mathrm{EJM}}$ equal to one ebit when arbitrary finite-dimensional pure entangled resources are allowed? Alice and Bob hold qubits $A$ and $B$ separately, and the measurement returns only a shared classical outcome. Its tetrahedral directions are given by Eq.~\\eqref{eq:ejm-tetrahedron}:\n\\begin{equation}\n\\begin{aligned}\n\\mathbf n_1&:=\\frac{(1,1,1)}{\\sqrt3},&\n\\mathbf n_2&:=\\frac{(1,-1,-1)}{\\sqrt3},\\\\\n\\mathbf n_3&:=\\frac{(-1,1,-1)}{\\sqrt3},&\n\\mathbf n_4&:=\\frac{(-1,-1,1)}{\\sqrt3}.\n\\end{aligned}\n\\label{eq:ejm-tetrahedron}\n\\end{equation}\nFor $j\\in\\{1,2,3,4\\}$, define the singlet $|s\\rangle$, orthonormal measurement eigenstates $|e_j\\rangle$, and rank-one projectors $P_j$ by Eq.~\\eqref{eq:ejm-projectors}:\n\\begin{equation}\n\\begin{gathered}\n|s\\rangle:=\\frac{|01\\rangle-|10\\rangle}{\\sqrt2},\\\\\n|e_j\\rangle:=\\left[\\left(\\frac12 I_A+\\frac{\\sqrt3}{2}\\mathbf n_j\\cdot\\boldsymbol\\sigma_A\\right)\\otimes I_B\\right]|s\\rangle,\n\\qquad P_j:=|e_j\\rangle\\langle e_j|.\n\\end{gathered}\n\\label{eq:ejm-projectors}\n\\end{equation}\nHere $I_A,I_B$ are the qubit identities and $\\boldsymbol\\sigma_A:=(X_A,Y_A,Z_A)$ are the Pauli matrices. For every input density operator $\\rho$, the measurement channel is Eq.~\\eqref{eq:ejm-channel}:\n\\begin{equation}\n\\mathcal M_{\\mathrm{EJM}}(\\rho):=\\sum_{j=1}^4\\operatorname{Tr}(P_j\\rho)\n|j\\rangle\\langle j|_{C_A}\\otimes|j\\rangle\\langle j|_{C_B},\n\\label{eq:ejm-channel}\n\\end{equation}\nwhere $C_A,C_B$ are four-valued classical registers; no postmeasurement quantum state is prescribed.\n\nAllow any normalized pure resource $|\\chi\\rangle\\in\\mathbb C^r\\otimes\\mathbb C^r$ on auxiliary systems $A',B'$ for any finite positive integer $r$. Write $\\chi:=|\\chi\\rangle\\langle\\chi|$, $\\chi_{A'}:=\\operatorname{Tr}_{B'}\\chi$, and $S(\\sigma):=-\\operatorname{Tr}(\\sigma\\log_2\\sigma)$ for a density operator $\\sigma$. With all additional shared entanglement included in $\\chi$, minimize over deterministic LOCC channels $\\Lambda$ across $AA':BB'$ as in Eq.~\\eqref{eq:ejm-cost}:\n\\begin{equation}\nE_{\\mathrm{LOCC}}^{\\mathrm{exact}}(\\mathcal M_{\\mathrm{EJM}}):=\\inf\\left\\{\nS(\\chi_{A'}):\\ \\begin{gathered}\nr\\in\\mathbb N,\\quad |\\chi\\rangle\\in\\mathbb C^r\\otimes\\mathbb C^r,\\\\\n\\langle\\chi|\\chi\\rangle=1,\\quad \\exists\\Lambda\\in\\mathrm{LOCC},\\\\\n\\Lambda(\\rho\\otimes\\chi)=\\mathcal M_{\\mathrm{EJM}}(\\rho)\\quad\\text{for every }\\rho\n\\end{gathered}\\right\\}.\n\\label{eq:ejm-cost}\n\\end{equation}\nThe target is to decide whether the infimum in Eq.~\\eqref{eq:ejm-cost} equals $1$.","source":"Akibue, Miyazaki, and Osaka explicitly leave open whether a higher-Schmidt-rank resource with less than one ebit can implement this joint measurement, in Section 5.3, final paragraph, p.~28 of arXiv version 4 (28 August 2026) \\sourcecite{ref:ejm-optimization}{AMO26}. Their numerical optimization uses separable-operation optimization as a relaxation of LOCC; this entry asks the exact deterministic LOCC version with classical output only. The EJM is defined by Gisin (Section 4, p.~5, Eq.~(10)) \\sourcecite{ref:ejm-gisin}{Gis19}.","progress":["The four EJM eigenstates have identical reduced-state spectra and entanglement entropy:\n  \\begin{equation}\n\\operatorname{spec}(\\operatorname{Tr}_B P_j)\n  =\\left\\{\\frac{2+\\sqrt3}{4},\\frac{2-\\sqrt3}{4}\\right\\},\n  \\qquad\n  S(\\operatorname{Tr}_B P_j)\n  =h_2\\left(\\frac{2+\\sqrt3}{4}\\right)\\approx0.3546,\n\\label{eq:ejm-progress1-1}\n\\end{equation}\n  In Eq.~\\eqref{eq:ejm-progress1-1}, $h_2(x):=-x\\log_2x-(1-x)\\log_2(1-x)$ is the binary entropy for $x\\in[0,1]$, with $0\\log_2 0:=0$; these are partially entangled eigenstates, not a Bell basis. \\sourcecite{ref:ejm-gisin}{Gis19}","An elementary lower bound follows by applying an exact implementation to one half of a Bell pair prepared locally at each site: the untouched reference qubits are projected onto a complex-conjugated EJM eigenstate, and outcome-dependent local unitaries convert all four possibilities into the same pure state, so deterministic pure-state LOCC conversion implies\n  \\begin{equation}\nE_{\\mathrm{LOCC}}^{\\mathrm{exact}}(\\mathcal M_{\\mathrm{EJM}})\n  \\geq h_2\\left(\\frac{2+\\sqrt3}{4}\\right)\\approx0.3546.\n\\label{eq:ejm-progress2-1}\n\\end{equation}\n  Equation~\\eqref{eq:ejm-progress2-1} is a derived lower bound using the eigenstate spectra and the pure-state conversion theorem, not a claim that the bound is tight. \\sourcecite{ref:ejm-gisin}{Gis19}, \\sourcecite{ref:ejm-nielsen}{Nie99}","One shared Bell pair permits Alice to teleport her input qubit to Bob, who performs the joint measurement locally and communicates the outcome, giving\n  \\begin{equation}\nE_{\\mathrm{LOCC}}^{\\mathrm{exact}}(\\mathcal M_{\\mathrm{EJM}})\\leq1.\n\\label{eq:ejm-progress3-1}\n\\end{equation}\n  The protocol giving Eq.~\\eqref{eq:ejm-progress3-1} consumes the resource to implement a measurement; no maximally entangled output is required. \\sourcecite{ref:ejm-gisin}{Gis19}, \\sourcecite{ref:ejm-optimization}{AMO26}","For the Schmidt-rank-two resource family in Eq.~\\eqref{eq:ejm-progress4-1}, the concurrence-based necessary condition is Eq.~\\eqref{eq:ejm-progress4-2}:\n\\begin{equation}\n|\\chi_\\theta\\rangle:=\\cos\\theta|00\\rangle+\\sin\\theta|11\\rangle,\n\\qquad0<\\theta\\leq\\frac\\pi4,\n\\label{eq:ejm-progress4-1}\n\\end{equation}\n\\begin{equation}\n\\theta\\geq\\frac\\pi{12},\\qquad\n\\sin^2\\theta\\geq\\frac{2-\\sqrt3}{4}\\approx0.0670.\n\\label{eq:ejm-progress4-2}\n\\end{equation}\nThe separable-operation numerical bounds in Section 5.3 and Figure 5(c) of Akibue et al. support the stronger necessity of $\\theta=\\pi/4$ for deterministic implementation \\sourcecite{ref:ejm-optimization}{AMO26}. Those numerical bounds do not address unrestricted resource rank. The computations are available in the authors' \\href{https://github.com/akibue/DPS-based-on-MFLE}{reproducibility repository}.","A stronger analytical conclusion for Schmidt rank two follows from Corollary 1, p.~21 of Akibue et al., itself a consequence of Theorem 3(2) \\sourcecite{ref:ejm-optimization}{AMO26}. Coarse-graining an exact EJM implementation into outcome $j$ versus all other outcomes implements the optimal verification measurement $\\{P_j,I_{AB}-P_j\\}$. Since $|e_j\\rangle$ has Schmidt rank two, the corollary forces every pure resource of Schmidt rank two that implements this verification, even by separable operations, to be maximally entangled. Applied to EJM, this proves that a rank-two resource must have one ebit; it does not constrain all higher-rank resources to have entropy at least one."],"references":[{"key":"Gis19","label":"ref:ejm-gisin","tex":"N. Gisin, ``Entanglement 25 Years after Quantum Teleportation: Testing Joint Measurements in Quantum Networks,'' \\emph{Entropy} \\textbf{21}, 325 (2019). \\href{https://doi.org/10.3390/e21030325}{doi:10.3390/e21030325}; \\href{https://arxiv.org/abs/1809.10901}{arXiv:1809.10901}."},{"key":"Nie99","label":"ref:ejm-nielsen","tex":"M. A. Nielsen, ``Conditions for a Class of Entanglement Transformations,'' \\emph{Physical Review Letters} \\textbf{83}, 436–439 (1999). \\href{https://doi.org/10.1103/PhysRevLett.83.436}{doi:10.1103/PhysRevLett.83.436}; \\href{https://arxiv.org/abs/quant-ph/9811053}{arXiv:quant-ph/9811053}."},{"key":"AMO26","label":"ref:ejm-optimization","tex":"S. Akibue, J. Miyazaki, and H. Osaka, ``Optimizing Entanglement Manipulation via Algebraic-Geometric Decompositions and Semi-Definite Programming Hierarchies,'' \\emph{Letters in Mathematical Physics} \\textbf{116}, 110 (2026); arXiv version 4, 28 August 2026. \\href{https://doi.org/10.1007/s11005-026-02138-9}{doi:10.1007/s11005-026-02138-9}; \\href{https://arxiv.org/abs/2501.17394}{arXiv:2501.17394}."}],"comment":"The literature checked through 9 September 2026 leaves open whether $E_{\\mathrm{LOCC}}^{\\mathrm{exact}}(\\mathcal M_{\\mathrm{EJM}})=1$ or a finite-dimensional pure resource with strictly less than one ebit implements the measurement exactly. The rank-two case has the analytical resolution described in Progress, but the arbitrary-rank optimization remains unresolved; Section 5.3, p.~28 of Akibue et al. explicitly leaves higher-rank resources open \\sourcecite{ref:ejm-optimization}{AMO26}. The cost is the entropy of the supplied pure resource, not an integer Bell-pair count, a net-consumption rate, or a cost under nonadaptive measurement localization. The status audit used public primary sources and later-work searches; it was not an exhaustive citation-index audit."}}
---
## Source

Akibue, Miyazaki, and Osaka explicitly leave open whether a higher-Schmidt-rank resource with less than one ebit can implement this joint measurement, in Section 5.3, final paragraph, p. 28 of arXiv version 4 (28 August 2026) [AMO26](https://doi.org/10.1007/s11005-026-02138-9). Their numerical optimization uses separable-operation optimization as a relaxation of LOCC; this entry asks the exact deterministic LOCC version with classical output only. The EJM is defined by Gisin (Section 4, p. 5, Eq. (10)) [Gis19](https://doi.org/10.3390/e21030325).

## Progress

The four EJM eigenstates have identical reduced-state spectra and entanglement entropy:

$$
\operatorname{spec}(\operatorname{Tr}_B P_j)
 =\left\{\frac{2+\sqrt3}{4},\frac{2-\sqrt3}{4}\right\},
 \qquad
 S(\operatorname{Tr}_B P_j)
 =h_2\left(\frac{2+\sqrt3}{4}\right)\approx0.3546,
\tag{5}
$$

In Eq. (5), $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$ is the binary entropy for $x\in[0,1]$, with $0\log_2 0:=0$; these are partially entangled eigenstates, not a Bell basis. [Gis19](https://doi.org/10.3390/e21030325)

An elementary lower bound follows by applying an exact implementation to one half of a Bell pair prepared locally at each site: the untouched reference qubits are projected onto a complex-conjugated EJM eigenstate, and outcome-dependent local unitaries convert all four possibilities into the same pure state, so deterministic pure-state LOCC conversion implies

$$
E_{\mathrm{LOCC}}^{\mathrm{exact}}(\mathcal M_{\mathrm{EJM}})
 \geq h_2\left(\frac{2+\sqrt3}{4}\right)\approx0.3546.
\tag{6}
$$

Equation (6) is a derived lower bound using the eigenstate spectra and the pure-state conversion theorem, not a claim that the bound is tight. [Gis19](https://doi.org/10.3390/e21030325), [Nie99](https://doi.org/10.1103/PhysRevLett.83.436)

One shared Bell pair permits Alice to teleport her input qubit to Bob, who performs the joint measurement locally and communicates the outcome, giving

$$
E_{\mathrm{LOCC}}^{\mathrm{exact}}(\mathcal M_{\mathrm{EJM}})\leq1.
\tag{7}
$$

The protocol giving Eq. (7) consumes the resource to implement a measurement; no maximally entangled output is required. [Gis19](https://doi.org/10.3390/e21030325), [AMO26](https://doi.org/10.1007/s11005-026-02138-9)

For the Schmidt-rank-two resource family in Eq. (8), the concurrence-based necessary condition is Eq. (9):

$$
|\chi_\theta\rangle:=\cos\theta|00\rangle+\sin\theta|11\rangle,
\qquad0<\theta\leq\frac\pi4,
\tag{8}
$$

$$
\theta\geq\frac\pi{12},\qquad
\sin^2\theta\geq\frac{2-\sqrt3}{4}\approx0.0670.
\tag{9}
$$

The separable-operation numerical bounds in Section 5.3 and Figure 5(c) of Akibue et al. support the stronger necessity of $\theta=\pi/4$ for deterministic implementation [AMO26](https://doi.org/10.1007/s11005-026-02138-9). Those numerical bounds do not address unrestricted resource rank. The computations are available in the authors’ [reproducibility repository](https://github.com/akibue/DPS-based-on-MFLE).

A stronger analytical conclusion for Schmidt rank two follows from Corollary 1, p. 21 of Akibue et al., itself a consequence of Theorem 3(2) [AMO26](https://doi.org/10.1007/s11005-026-02138-9). Coarse-graining an exact EJM implementation into outcome $j$ versus all other outcomes implements the optimal verification measurement $\{P_j,I_{AB}-P_j\}$. Since $|e_j\rangle$ has Schmidt rank two, the corollary forces every pure resource of Schmidt rank two that implements this verification, even by separable operations, to be maximally entangled. Applied to EJM, this proves that a rank-two resource must have one ebit; it does not constrain all higher-rank resources to have entropy at least one.

## Comment

The literature checked through 9 September 2026 leaves open whether $E_{\mathrm{LOCC}}^{\mathrm{exact}}(\mathcal M_{\mathrm{EJM}})=1$ or a finite-dimensional pure resource with strictly less than one ebit implements the measurement exactly. The rank-two case has the analytical resolution described in Progress, but the arbitrary-rank optimization remains unresolved; Section 5.3, p. 28 of Akibue et al. explicitly leaves higher-rank resources open [AMO26](https://doi.org/10.1007/s11005-026-02138-9). The cost is the entropy of the supplied pure resource, not an integer Bell-pair count, a net-consumption rate, or a cost under nonadaptive measurement localization. The status audit used public primary sources and later-work searches; it was not an exhaustive citation-index audit.

## References

**Gis19** N. Gisin, “Entanglement 25 Years after Quantum Teleportation: Testing Joint Measurements in Quantum Networks,” *Entropy* **21**, 325 (2019). [doi:10.3390/e21030325](https://doi.org/10.3390/e21030325); [arXiv:1809.10901](https://arxiv.org/abs/1809.10901).

**Nie99** M. A. Nielsen, “Conditions for a Class of Entanglement Transformations,” *Physical Review Letters* **83**, 436–439 (1999). [doi:10.1103/PhysRevLett.83.436](https://doi.org/10.1103/PhysRevLett.83.436); [arXiv:quant-ph/9811053](https://arxiv.org/abs/quant-ph/9811053).

**AMO26** S. Akibue, J. Miyazaki, and H. Osaka, “Optimizing Entanglement Manipulation via Algebraic-Geometric Decompositions and Semi-Definite Programming Hierarchies,” *Letters in Mathematical Physics* **116**, 110 (2026); arXiv version 4, 28 August 2026. [doi:10.1007/s11005-026-02138-9](https://doi.org/10.1007/s11005-026-02138-9); [arXiv:2501.17394](https://arxiv.org/abs/2501.17394).
