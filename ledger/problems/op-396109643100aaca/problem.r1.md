---
id: "01M22MXHD69PEA36XK1QY3ARAY"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T08:42:44.429Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["quantum-source-coding"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Distributed compression of bipartite pure-state ensembles"
aliases: ["op-396109643100aaca","op_396109643100aaca","01M22MXHD69PEA36XK1QY3ARAY"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_396109643100aaca.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_396109643100aaca","ulid":"01M22MXHD69PEA36XK1QY3ARAY","aliases":["op_396109643100aaca","01M22MXHD69PEA36XK1QY3ARAY","op-396109643100aaca"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T08:35:27.270Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-source-coding"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Distributed compression of bipartite pure-state ensembles","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum source coding"],"statement":"Determine the achievable rate region for independent local compression of an arbitrary finite ensemble of bipartite pure states. Let $\\mathcal E=\\{p_i,|\\phi_i\\rangle^{AB}\\}_{i\\in\\mathcal I}$, where $A$ and $B$ are finite-dimensional and $p_i>0$ with $\\sum_i p_i=1$. Write $p_{i^n}=\\prod_{t=1}^n p_{i_t}$, $|\\phi_{i^n}\\rangle:=\\bigotimes_{t=1}^n|\\phi_{i_t}\\rangle$, and $\\phi_{i^n}:=|\\phi_{i^n}\\rangle\\langle\\phi_{i^n}|$. Alice and Bob receive the respective shares of $\\phi_{i^n}$, without the classical label $i^n$. They apply independent completely positive trace-preserving encoders $\\mathcal E_{A,n}:\\mathcal L(A^{\\otimes n})\\to\\mathcal L(M_{A,n})$ and $\\mathcal E_{B,n}:\\mathcal L(B^{\\otimes n})\\to\\mathcal L(M_{B,n})$, and send both quantum messages to one receiver. The receiver applies a completely positive trace-preserving decoder $\\mathcal D_n$ with output $\\widehat A^{\\otimes n}\\widehat B^{\\otimes n}$, where $\\widehat A\\cong A$ and $\\widehat B\\cong B$. The parties have no initially shared entanglement and exchange no other messages. Define the average squared fidelity by\n\\begin{equation}\n F_n:=\\sum_{i^n}p_{i^n}\\langle\\phi_{i^n}|\\mathcal D_n\\circ(\\mathcal E_{A,n}\\otimes\\mathcal E_{B,n})(\\phi_{i^n})|\\phi_{i^n}\\rangle.\n \\label{eq:h16-fidelity}\n\\end{equation}\nA nonnegative pair $(R_A,R_B)$ is achievable if there is a sequence of such codes with $F_n\\to1$ in Eq.~\\eqref{eq:h16-fidelity} and\n\\begin{equation}\n \\limsup_{n\\to\\infty}\\frac1n\\log_2\\dim M_{A,n}\\le R_A,\\qquad\n \\limsup_{n\\to\\infty}\\frac1n\\log_2\\dim M_{B,n}\\le R_B.\n \\label{eq:h16-rates}\n\\end{equation}\nGive necessary and sufficient conditions on $(R_A,R_B)$ for membership in the closure $\\mathcal R(\\mathcal E)$ of the pairs satisfying Eq.~\\eqref{eq:h16-rates}.","source":"Ahn, Doherty, Hayden, and Winter formulate this ensemble-fidelity model in Section~II, Eqs.~(2)--(3), and explicitly ask for a formula covering all ensembles in Section~VI, p.~15 of arXiv version~3 \\sourcecite{ref:h16-ahn}{ADHW06}.","progress":["Put $\\overline\\rho_{AB}:=\\sum_i p_i|\\phi_i\\rangle\\langle\\phi_i|$ and write $S(A)$, $S(B)$, and $S(AB)$ for its marginal von Neumann entropies in bits. Fully quantum Slepian--Wolf protocols imply that the two pairs\n\\begin{equation}\n \\left(S(A),\\frac{S(B)+S(AB)-S(A)}2\\right),\\qquad\n \\left(\\frac{S(A)+S(AB)-S(B)}2,S(B)\\right)\n \\label{eq:h16-corners}\n\\end{equation}\nare achievable. The upper-right convex closure of Eq.~\\eqref{eq:h16-corners} is therefore an inner bound for every ensemble. These protocols preserve a purification of $\\overline\\rho_{AB}$, which is sufficient for the weaker criterion in Eq.~\\eqref{eq:h16-fidelity} \\sourcecite{ref:h16-mother}{ADHW09}, Section~X, Theorem~X.1.","For an irreducible product ensemble $\\{p_i,|a_i\\rangle\\otimes|b_i\\rangle\\}$, Theorem~III.3 of \\sourcecite{ref:h16-ahn}{ADHW06} proves the sum-rate lower bound\n\\begin{equation}\n R_A+R_B\\ge\\frac{S(A)+S(B)+S(AB)}2.\n \\label{eq:h16-product-bound}\n\\end{equation}\nHere irreducibility means that the global signal vectors cannot be partitioned into two nonempty mutually orthogonal groups. Equation~\\eqref{eq:h16-corners} attains Eq.~\\eqref{eq:h16-product-bound}, determining the minimum total rate for this class. Global irreducibility is essential; local irreducibility of both marginal ensembles alone is insufficient.","For a two-qubit Bell-basis ensemble with probability distribution $p=(p_1,p_2,p_3,p_4)$, Theorem~IV.1 of \\sourcecite{ref:h16-ahn}{ADHW06} determines the full region:\n\\begin{equation}\n \\mathcal R(\\mathcal E)=\\{(R_A,R_B):R_A\\ge H(p)/2,\\ R_B\\ge H(p)/2\\},\n \\label{eq:h16-bell-region}\n\\end{equation}\nwhere $H$ is Shannon entropy in bits. Equation~\\eqref{eq:h16-bell-region} follows from a hashing protocol and matching converses."],"references":[{"key":"ADHW06","label":"ref:h16-ahn","tex":"C. Ahn, A. C. Doherty, P. Hayden, and A. Winter, ``On the Distributed Compression of Quantum Information,'' \\emph{IEEE Transactions on Information Theory} \\textbf{52}(10), 4349--4357 (2006). \\href{https://doi.org/10.1109/TIT.2006.881734}{doi:10.1109/TIT.2006.881734}; \\href{https://arxiv.org/abs/quant-ph/0403042v3}{arXiv:quant-ph/0403042v3}."},{"key":"ADHW09","label":"ref:h16-mother","tex":"A. Abeyesinghe, I. Devetak, P. Hayden, and A. Winter, ``The Mother of All Protocols: Restructuring Quantum Information's Family Tree,'' \\emph{Proceedings of the Royal Society A} \\textbf{465}(2108), 2537--2563 (2009). \\href{https://doi.org/10.1098/rspa.2009.0202}{doi:10.1098/rspa.2009.0202}; \\href{https://arxiv.org/abs/quant-ph/0606225}{arXiv:quant-ph/0606225}."},{"key":"BKW20","label":"ref:h16-cq","tex":"Z. Baghali Khanian and A. Winter, ``Distributed Compression of Correlated Classical-Quantum Sources or: The Price of Ignorance,'' \\emph{IEEE Transactions on Information Theory} \\textbf{66}(9), 5620--5633 (2020). \\href{https://doi.org/10.1109/TIT.2020.2981322}{doi:10.1109/TIT.2020.2981322}; \\href{https://arxiv.org/abs/1811.09177}{arXiv:1811.09177}."}],"comment":"The unresolved target is the complete region for the specified ensemble, including globally reducible sources and entangled signal states. Preserving one fixed ensemble in Eq.~\\eqref{eq:h16-fidelity} must be distinguished from preserving every pure-state decomposition of its average density operator, equivalently its purification; Ahn et al. explain this distinction in the postscript to Section~VI \\sourcecite{ref:h16-ahn}{ADHW06}. The latter model also has only general inner and outer bounds in Theorems~X.1--X.2 of \\sourcecite{ref:h16-mother}{ADHW09}, with optimality established there for separable density operators. The generic classical-quantum result of \\sourcecite{ref:h16-cq}{BKW20}, Theorem~14, preserves an additional inaccessible reference conditioned on the classical label and is not a solution of this unrestricted ensemble problem. Literature audited on 9 September 2026. The cited primary formulations and theorem passages were checked; the audit did not identify a complete later characterization, and the source note's Hayashi book passages were not independently accessible."}}
---
## Source

Ahn, Doherty, Hayden, and Winter formulate this ensemble-fidelity model in Section II, Eqs. (2)–(3), and explicitly ask for a formula covering all ensembles in Section VI, p. 15 of arXiv version 3 [ADHW06](https://doi.org/10.1109/TIT.2006.881734).

## Progress

Put $\overline\rho_{AB}:=\sum_i p_i|\phi_i\rangle\langle\phi_i|$ and write $S(A)$, $S(B)$, and $S(AB)$ for its marginal von Neumann entropies in bits. Fully quantum Slepian–Wolf protocols imply that the two pairs

$$
\left(S(A),\frac{S(B)+S(AB)-S(A)}2\right),\qquad
 \left(\frac{S(A)+S(AB)-S(B)}2,S(B)\right)
\tag{3}
$$

are achievable. The upper-right convex closure of Eq. (3) is therefore an inner bound for every ensemble. These protocols preserve a purification of $\overline\rho_{AB}$, which is sufficient for the weaker criterion in Eq. (1) [ADHW09](https://doi.org/10.1098/rspa.2009.0202), Section X, Theorem X.1.

For an irreducible product ensemble $\{p_i,|a_i\rangle\otimes|b_i\rangle\}$, Theorem III.3 of [ADHW06](https://doi.org/10.1109/TIT.2006.881734) proves the sum-rate lower bound

$$
R_A+R_B\ge\frac{S(A)+S(B)+S(AB)}2.
\tag{4}
$$

Here irreducibility means that the global signal vectors cannot be partitioned into two nonempty mutually orthogonal groups. Equation (3) attains Eq. (4), determining the minimum total rate for this class. Global irreducibility is essential; local irreducibility of both marginal ensembles alone is insufficient.

For a two-qubit Bell-basis ensemble with probability distribution $p=(p_1,p_2,p_3,p_4)$, Theorem IV.1 of [ADHW06](https://doi.org/10.1109/TIT.2006.881734) determines the full region:

$$
\mathcal R(\mathcal E)=\{(R_A,R_B):R_A\ge H(p)/2,\ R_B\ge H(p)/2\},
\tag{5}
$$

where $H$ is Shannon entropy in bits. Equation (5) follows from a hashing protocol and matching converses.

## Comment

The unresolved target is the complete region for the specified ensemble, including globally reducible sources and entangled signal states. Preserving one fixed ensemble in Eq. (1) must be distinguished from preserving every pure-state decomposition of its average density operator, equivalently its purification; Ahn et al. explain this distinction in the postscript to Section VI [ADHW06](https://doi.org/10.1109/TIT.2006.881734). The latter model also has only general inner and outer bounds in Theorems X.1–X.2 of [ADHW09](https://doi.org/10.1098/rspa.2009.0202), with optimality established there for separable density operators. The generic classical-quantum result of [BKW20](https://doi.org/10.1109/TIT.2020.2981322), Theorem 14, preserves an additional inaccessible reference conditioned on the classical label and is not a solution of this unrestricted ensemble problem. Literature audited on 9 September 2026. The cited primary formulations and theorem passages were checked; the audit did not identify a complete later characterization, and the source note’s Hayashi book passages were not independently accessible.

## References

**ADHW06** C. Ahn, A. C. Doherty, P. Hayden, and A. Winter, “On the Distributed Compression of Quantum Information,” *IEEE Transactions on Information Theory* **52**(10), 4349–4357 (2006). [doi:10.1109/TIT.2006.881734](https://doi.org/10.1109/TIT.2006.881734); [arXiv:quant-ph/0403042v3](https://arxiv.org/abs/quant-ph/0403042v3).

**ADHW09** A. Abeyesinghe, I. Devetak, P. Hayden, and A. Winter, “The Mother of All Protocols: Restructuring Quantum Information’s Family Tree,” *Proceedings of the Royal Society A* **465**(2108), 2537–2563 (2009). [doi:10.1098/rspa.2009.0202](https://doi.org/10.1098/rspa.2009.0202); [arXiv:quant-ph/0606225](https://arxiv.org/abs/quant-ph/0606225).

**BKW20** Z. Baghali Khanian and A. Winter, “Distributed Compression of Correlated Classical-Quantum Sources or: The Price of Ignorance,” *IEEE Transactions on Information Theory* **66**(9), 5620–5633 (2020). [doi:10.1109/TIT.2020.2981322](https://doi.org/10.1109/TIT.2020.2981322); [arXiv:1811.09177](https://arxiv.org/abs/1811.09177).
