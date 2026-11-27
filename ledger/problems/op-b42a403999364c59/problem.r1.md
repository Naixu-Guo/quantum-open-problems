---
id: "01M87VW3RS02EH9M5EZ7YZQXQ9"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T01:42:25.991Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-foundations"]
topicIds: ["bell-nonlocality"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M2JD9V7470D2X37R3B59R2VX"]
title: "Can pairwise Bell nonlocality be transitive among three qubits?"
aliases: ["op-b42a403999364c59","op_b42a403999364c59","01M87VW3RS02EH9M5EZ7YZQXQ9"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_b42a403999364c59.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b42a403999364c59","ulid":"01M87VW3RS02EH9M5EZ7YZQXQ9","aliases":["op_b42a403999364c59","01M87VW3RS02EH9M5EZ7YZQXQ9","op-b42a403999364c59"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.673Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-foundations"],"topicIds":["bell-nonlocality"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2JD9V7470D2X37R3B59R2VX"]},"title":"Can pairwise Bell nonlocality be transitive among three qubits?","status":"Unsolved","fields":["Quantum Foundations"],"topics":["Bell nonlocality"],"statement":"Alice ($A$), Bob ($B$), and Charlie ($C$) hold one qubit each. Bob is the middle party in the chain $A\\!-\\!B\\!-\\!C$. Tracing out one qubit gives the state of the other two, called their marginal. The given two-qubit marginals $\\rho_{AB}$ and $\\rho_{BC}$ overlap on Bob's qubit. A three-qubit density matrix $\\sigma_{ABC}$ satisfying $\\operatorname{Tr}_C\\sigma_{ABC}=\\rho_{AB}$ and $\\operatorname{Tr}_A\\sigma_{ABC}=\\rho_{BC}$ is a completion. If at least one completion exists, the marginals are compatible.\n\nEach pair tests its state separately on one shared copy per trial. On $\\rho_{AB}$, Alice and Bob independently choose measurements from their own finite menus of positive operator-valued measures (POVMs). Their choices are called settings, denoted by $x$ for Alice and $y$ for Bob. They record outcomes $a$ and $b$, respectively. For example, Alice might label a Pauli $Z$ measurement $x=0$ and a Pauli $X$ measurement $x=1$. Both have outcomes $\\pm1$, and the labels are arbitrary. For fixed settings, Alice's POVM effects $\\{M_{a\\mid x}\\}_a$ and Bob's $\\{N_{b\\mid y}\\}_b$ are positive semidefinite and each family sums to the identity. Given settings $x$ and $y$, the probability of outcomes $a$ and $b$ is $p(a,b\\mid x,y)=\\operatorname{Tr}[(M_{a\\mid x}\\otimes N_{b\\mid y})\\rho_{AB}]$.\n\nIn a classical local model, the parties share a random label $\\lambda$. Its probabilities $q_\\lambda\\ge 0$ sum to one and are independent of both settings. Each $\\lambda$ selects a pair of deterministic local response functions $f_\\lambda$ and $g_\\lambda$ mapping each party's own setting to its outcome. Let $\\delta_{u,v}$ equal one if $u=v$ and zero otherwise. A probability table is Bell-local if it admits the mixture in Eq.~\\eqref{eq:d8-local-mixture} with the same distribution and response functions for all setting pairs.\n\\begin{equation}\np(a,b\\mid x,y)=\\sum_{\\lambda}q_\\lambda\\,\\delta_{a,f_\\lambda(x)}\\,\\delta_{b,g_\\lambda(y)}.\n\\label{eq:d8-local-mixture}\n\\end{equation}\nSuch mixtures form the convex hull of deterministic local response functions. A linear bound on joint probabilities obeyed by every Bell-local table is a Bell inequality. A state is Bell-nonlocal if some finite menus of local POVMs yield a table outside this hull, violating a Bell inequality.\n\nBob and Charlie test $\\rho_{BC}$ in the same way. For each completion $\\sigma_{ABC}$, Alice and Charlie test the unconditional marginal $\\sigma_{AC}=\\operatorname{Tr}_B\\sigma_{ABC}$ obtained by discarding Bob's qubit. Their measurements may depend on $\\sigma_{AC}$.\n\nAre there compatible Bell-nonlocal marginals $\\rho_{AB}$ and $\\rho_{BC}$ for which every completion $\\sigma_{ABC}$ has a Bell-nonlocal end marginal $\\sigma_{AC}$?","source":"Chen et al. define transitivity at the state level in Definition~3 and ask whether it can occur with three qubits in their Discussion \\sourcecite{ref:d8-01-cth-26}{CTH+26}.","progress":["Theorem~3 constructs examples from sufficiently many copies of the three-qubit $W$ state, with all qubits belonging to each party treated as one local system. Appendix~E.2 certifies the construction for at least $29$ copies \\sourcecite{ref:d8-01-cth-26}{CTH+26}.","Section~V.2 reports examples with local dimension three. Appendix~F, Corollary~5, proves single-copy transitivity of steering for the marginals of the three-qubit $W$ state \\sourcecite{ref:d8-01-cth-26}{CTH+26}."],"references":[{"key":"CTH+26","label":"ref:d8-01-cth-26","tex":"K.-S. Chen, G. N. M. Tabia, C.-Y. Hsieh, Y.-C. Yin, and Y.-C. Liang, ``Nonlocality of Quantum States can be Transitive,'' \\emph{npj Quantum Information} \\textbf{12}, 37 (2026). \\href{https://doi.org/10.1038/s41534-025-01173-z}{doi:10.1038/s41534-025-01173-z}. \\href{https://arxiv.org/abs/2412.10505v3}{arXiv:2412.10505v3}."}],"comment":"Each party holds one qubit. The related problem of \\href{https://qiqc-op.com/problem/op_0e0ceaac739b74fd/}{many-copy Bell nonlocality} concerns a single bipartite input state and permits joint measurements across copies. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Chen et al. define transitivity at the state level in Definition 3 and ask whether it can occur with three qubits in their Discussion [CTH+26](https://doi.org/10.1038/s41534-025-01173-z).

## Progress

Theorem 3 constructs examples from sufficiently many copies of the three-qubit $W$ state, with all qubits belonging to each party treated as one local system. Appendix E.2 certifies the construction for at least $29$ copies [CTH+26](https://doi.org/10.1038/s41534-025-01173-z).

Section V.2 reports examples with local dimension three. Appendix F, Corollary 5, proves single-copy transitivity of steering for the marginals of the three-qubit $W$ state [CTH+26](https://doi.org/10.1038/s41534-025-01173-z).

## Comment

Each party holds one qubit. The related problem of [many-copy Bell nonlocality](https://qiqc-op.com/problem/op_0e0ceaac739b74fd/) concerns a single bipartite input state and permits joint measurements across copies. The catalog and literature were checked through November 26, 2026.

## References

**CTH+26** K.-S. Chen, G. N. M. Tabia, C.-Y. Hsieh, Y.-C. Yin, and Y.-C. Liang, “Nonlocality of Quantum States can be Transitive,” *npj Quantum Information* **12**, 37 (2026). [doi:10.1038/s41534-025-01173-z](https://doi.org/10.1038/s41534-025-01173-z). [arXiv:2412.10505v3](https://arxiv.org/abs/2412.10505v3).
