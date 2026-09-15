---
id: "01M22C448YAVGY33AV04GHTFGC"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T06:02:34.082Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["quantum-state-preparation","resource-conversion"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M22C4460W3FYGAFEKQT833BJ"]
title: "Quasi-linear graph-state resources for Pauli pairability"
aliases: ["op-21cb3e1c3ed33976","op_21cb3e1c3ed33976","01M22C448YAVGY33AV04GHTFGC"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_21cb3e1c3ed33976.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_21cb3e1c3ed33976","ulid":"01M22C448YAVGY33AV04GHTFGC","aliases":["op_21cb3e1c3ed33976","01M22C448YAVGY33AV04GHTFGC","op-21cb3e1c3ed33976"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T06:01:46.014Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["quantum-state-preparation","resource-conversion"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M22C4460W3FYGAFEKQT833BJ"]},"title":"Quasi-linear graph-state resources for Pauli pairability","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Quantum state preparation","Resource conversion"],"statement":"Does there exist an absolute constant $a\\geq0$ such that $N_{\\mathrm P}(k)=O(k[\\log_2(k+1)]^a)$ as the integer $k\\geq2$ tends to infinity? Here $N_{\\mathrm P}(k)$ is the smallest number $n\\geq2k$ of parties holding one qubit each of a graph state as defined in Eq.~\\eqref{eq:gpp-state}:\n\\begin{equation}\n\\begin{aligned}\n|G\\rangle&:=\\prod_{\\{u,v\\}\\in E}CZ_{uv}|+\\rangle^{\\otimes n},\n\\qquad G=(V,E),\\quad |V|=n,\\\\\n|+\\rangle&:=\\frac{|0\\rangle+|1\\rangle}{\\sqrt2},\n\\qquad CZ:=\\operatorname{diag}(1,1,1,-1).\n\\end{aligned}\n\\label{eq:gpp-state}\n\\end{equation}\nEvery requested set of $k$ disjoint pairs of labelled parties $(a_1,b_1),\\ldots,(a_k,b_k)$ must be able to obtain $\\bigotimes_{j=1}^k|\\Phi^+\\rangle_{a_jb_j}$ deterministically, where $|\\Phi^+\\rangle:=(|00\\rangle+|11\\rangle)/\\sqrt2$. The allowed operations are single-qubit Clifford unitaries (unitaries normalizing the Pauli group), destructive single-qubit Pauli measurements on discarded parties, and classical communication.\n\nEquivalently, define $N_{\\mathrm P}(k)$ by Eq.~\\eqref{eq:gpp-minimum}, with $G$ ranging over finite simple graphs:\n\\begin{equation}\nN_{\\mathrm P}(k):=\\min\\left\\{\n|V(G)|:\\ \\begin{gathered}\n|V(G)|\\geq2k,\\\\\n\\forall S\\subseteq V(G)\\text{ with }|S|=2k,\\\\\n\\forall M\\text{ a perfect matching on }S,\\quad M\\leq_{\\mathrm{vm}}G\n\\end{gathered}\n\\right\\}.\n\\label{eq:gpp-minimum}\n\\end{equation}\nA perfect matching consists of $k$ disjoint edges covering $S$. The relation $M\\leq_{\\mathrm{vm}}G$ means reachability, with surviving labels fixed, by vertex deletion and local complementation, which toggles edges between distinct neighbors of a vertex.","source":"The second open question in Section 5, p.~36:15 of Cautrès et al. asks whether pairable resource states can have quasi-linear size \\sourcecite{ref:gpp-universal}{CCM+24}. This entry specializes that question to graph states with single-qubit Clifford operations and destructive Pauli measurements. Propositions 4 and 5 of the same paper justify the vertex-minor formulation in Eq.~\\eqref{eq:gpp-minimum}; no equivalence with unrestricted local operations and classical communication is asserted.","progress":["Theorem 13 and Corollary 15 of Bravyi et al. show that even unrestricted local operations and classical communication impose a sublinear pairability bound when each of the $n$ parties initially holds one qubit:\n  \\begin{equation}\nk=O\\!\\left(\\frac{n\\log\\log n}{\\log n}\\right),\n  \\qquad\n  N_{\\mathrm P}(k)=\\Omega\\!\\left(\\frac{k\\log k}{\\log\\log k}\\right).\n\\label{eq:gpp-progress-3}\n\\end{equation}\n  The bound in Eq.~\\eqref{eq:gpp-progress-3} concerns one qubit per party. Constructions allowing several qubits at each party do not settle the one-qubit-per-party problem. \\sourcecite{ref:gpp-epr}{BSSW24}","An elementary counting consequence of the Pauli-measurement normal form gives a stronger bound for the restricted model here: on a fixed set of $2k$ terminals, there are $(2k)!/(2^k k!)$ labelled perfect matchings, and distinct matchings are not local-Clifford equivalent; the $n-2k$ discarded qubits offer only $3^{n-2k}$ choices of Pauli bases, with measurement outcomes affecting only local Pauli corrections, so\n  \\begin{equation}\n\\frac{(2k)!}{2^k k!}\\leq3^{n-2k},\n  \\qquad\n  N_{\\mathrm P}(k)\\geq\n  2k+\\left\\lceil\\log_3\\frac{(2k)!}{2^k k!}\\right\\rceil\n  =\\Omega(k\\log k).\n\\label{eq:gpp-progress-4}\n\\end{equation}\n  The bound in Eq.~\\eqref{eq:gpp-progress-4} is the direct counting deduction just given, using the normal form underlying the cited paper's vertex-minor-universality bound (Proposition 5 and its proof), rather than a claim that the paper states this particular formula. \\sourcecite{ref:gpp-small-pairable}{CMP23}","Every $2k$-vertex-minor-universal graph, meaning one that can produce every labelled graph on every prescribed $2k$-vertex subset, has the matching property defining $N_{\\mathrm P}(k)$; the 2024 quadratic existence theorem (Theorem 8) therefore gives, for each $\\varepsilon>0$ and all sufficiently large $k$,\n  \\begin{equation}\nN_{\\mathrm P}(k)\\leq(8+\\varepsilon)k^2.\n\\label{eq:gpp-progress-5}\n\\end{equation}\n  Beyond the upper bound in Eq.~\\eqref{eq:gpp-progress-5}, the same paper explicitly asks whether pairable resources can instead have quasi-linear size. \\sourcecite{ref:gpp-universal}{CCM+24}","Substituting $2k$ for the universality parameter in the 2026 random-graph theorem (Theorem 1.1) yields the improved quadratic upper bound\n  \\begin{equation}\n\\limsup_{k\\to\\infty}\\frac{N_{\\mathrm P}(k)}{k^2}\n  \\leq\\frac{2}{\\log_2(4/3)}.\n\\label{eq:gpp-progress-6}\n\\end{equation}\n  Equation~\\eqref{eq:gpp-progress-6} is a consequence of the stronger universality property, not a proof of quasi-linear pairability. \\sourcecite{ref:gpp-random}{AFF+26}"],"references":[{"key":"BSSW24","label":"ref:gpp-epr","tex":"S. Bravyi, Y. Sharma, M. Szegedy, and R. de Wolf, ``Generating $k$ EPR-Pairs from an $n$-Party Resource State,'' \\emph{Quantum} \\textbf{8}, 1348 (2024). \\href{https://doi.org/10.22331/q-2024-05-14-1348}{doi:10.22331/q-2024-05-14-1348}; \\href{https://arxiv.org/abs/2211.06497}{arXiv:2211.06497}."},{"key":"CMP23","label":"ref:gpp-small-pairable","tex":"N. Claudet, M. Mhalla, and S. Perdrix, ``Small $k$-Pairable States,'' arXiv preprint (2023). \\href{https://doi.org/10.48550/arXiv.2309.09956}{doi:10.48550/arXiv.2309.09956}; \\href{https://arxiv.org/abs/2309.09956}{arXiv:2309.09956}."},{"key":"CCM+24","label":"ref:gpp-universal","tex":"M. Cautrès, N. Claudet, M. Mhalla, S. Perdrix, V. Savin, and S. Thomassé, ``Vertex-Minor Universal Graphs for Generating Entangled Quantum Subsystems,'' in \\emph{51st International Colloquium on Automata, Languages, and Programming (ICALP 2024)}, 36:1–36:18 (2024). \\href{https://doi.org/10.4230/LIPIcs.ICALP.2024.36}{doi:10.4230/LIPIcs.ICALP.2024.36}; \\href{https://arxiv.org/abs/2402.06260}{arXiv:2402.06260}."},{"key":"AFF+26","label":"ref:gpp-random","tex":"R. Ascoli, B. Frederickson, S. Frederickson, C. McFarland, and L. Post, ``Almost All Graphs Are Vertex-Minor Universal,'' arXiv preprint (2026), version 2; accepted for RANDOM 2026. \\href{https://doi.org/10.48550/arXiv.2602.09049}{doi:10.48550/arXiv.2602.09049}; \\href{https://arxiv.org/abs/2602.09049}{arXiv:2602.09049}."}],"comment":"No quasi-linear construction or existence proof for $N_{\\mathrm P}(k)$ was found in the public literature checked through 9 September 2026; the displayed bounds leave a gap between order $k\\log k$ and order $k^2$. This entry deliberately asks the Clifford-and-Pauli graph-state version, not an asserted equivalent formulation for unrestricted local operations and classical communication. Its finite feasibility problem is decidable by exhaustive exploration of finitely many labelled graphs and their vertex-minors. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit. The related deterministic vertex-minor-universality question requires all graphs on prescribed terminals and a polynomial-time construction; the present question asks only for perfect matchings and allows an existence proof."}}
---
## Source

The second open question in Section 5, p. 36:15 of Cautrès et al. asks whether pairable resource states can have quasi-linear size [CCM+24](https://doi.org/10.4230/LIPIcs.ICALP.2024.36). This entry specializes that question to graph states with single-qubit Clifford operations and destructive Pauli measurements. Propositions 4 and 5 of the same paper justify the vertex-minor formulation in Eq. (2); no equivalence with unrestricted local operations and classical communication is asserted.

## Progress

Theorem 13 and Corollary 15 of Bravyi et al. show that even unrestricted local operations and classical communication impose a sublinear pairability bound when each of the $n$ parties initially holds one qubit:

$$
k=O\!\left(\frac{n\log\log n}{\log n}\right),
 \qquad
 N_{\mathrm P}(k)=\Omega\!\left(\frac{k\log k}{\log\log k}\right).
\tag{3}
$$

The bound in Eq. (3) concerns one qubit per party. Constructions allowing several qubits at each party do not settle the one-qubit-per-party problem. [BSSW24](https://doi.org/10.22331/q-2024-05-14-1348)

An elementary counting consequence of the Pauli-measurement normal form gives a stronger bound for the restricted model here: on a fixed set of $2k$ terminals, there are $(2k)!/(2^k k!)$ labelled perfect matchings, and distinct matchings are not local-Clifford equivalent; the $n-2k$ discarded qubits offer only $3^{n-2k}$ choices of Pauli bases, with measurement outcomes affecting only local Pauli corrections, so

$$
\frac{(2k)!}{2^k k!}\leq3^{n-2k},
 \qquad
 N_{\mathrm P}(k)\geq
 2k+\left\lceil\log_3\frac{(2k)!}{2^k k!}\right\rceil
 =\Omega(k\log k).
\tag{4}
$$

The bound in Eq. (4) is the direct counting deduction just given, using the normal form underlying the cited paper’s vertex-minor-universality bound (Proposition 5 and its proof), rather than a claim that the paper states this particular formula. [CMP23](https://doi.org/10.48550/arXiv.2309.09956)

Every $2k$-vertex-minor-universal graph, meaning one that can produce every labelled graph on every prescribed $2k$-vertex subset, has the matching property defining $N_{\mathrm P}(k)$; the 2024 quadratic existence theorem (Theorem 8) therefore gives, for each $\varepsilon>0$ and all sufficiently large $k$,

$$
N_{\mathrm P}(k)\leq(8+\varepsilon)k^2.
\tag{5}
$$

Beyond the upper bound in Eq. (5), the same paper explicitly asks whether pairable resources can instead have quasi-linear size. [CCM+24](https://doi.org/10.4230/LIPIcs.ICALP.2024.36)

Substituting $2k$ for the universality parameter in the 2026 random-graph theorem (Theorem 1.1) yields the improved quadratic upper bound

$$
\limsup_{k\to\infty}\frac{N_{\mathrm P}(k)}{k^2}
 \leq\frac{2}{\log_2(4/3)}.
\tag{6}
$$

Equation (6) is a consequence of the stronger universality property, not a proof of quasi-linear pairability. [AFF+26](https://doi.org/10.48550/arXiv.2602.09049)

## Comment

No quasi-linear construction or existence proof for $N_{\mathrm P}(k)$ was found in the public literature checked through 9 September 2026; the displayed bounds leave a gap between order $k\log k$ and order $k^2$. This entry deliberately asks the Clifford-and-Pauli graph-state version, not an asserted equivalent formulation for unrestricted local operations and classical communication. Its finite feasibility problem is decidable by exhaustive exploration of finitely many labelled graphs and their vertex-minors. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit. The related deterministic vertex-minor-universality question requires all graphs on prescribed terminals and a polynomial-time construction; the present question asks only for perfect matchings and allows an existence proof.

## References

**BSSW24** S. Bravyi, Y. Sharma, M. Szegedy, and R. de Wolf, “Generating $k$ EPR-Pairs from an $n$-Party Resource State,” *Quantum* **8**, 1348 (2024). [doi:10.22331/q-2024-05-14-1348](https://doi.org/10.22331/q-2024-05-14-1348); [arXiv:2211.06497](https://arxiv.org/abs/2211.06497).

**CMP23** N. Claudet, M. Mhalla, and S. Perdrix, “Small $k$-Pairable States,” arXiv preprint (2023). [doi:10.48550/arXiv.2309.09956](https://doi.org/10.48550/arXiv.2309.09956); [arXiv:2309.09956](https://arxiv.org/abs/2309.09956).

**CCM+24** M. Cautrès, N. Claudet, M. Mhalla, S. Perdrix, V. Savin, and S. Thomassé, “Vertex-Minor Universal Graphs for Generating Entangled Quantum Subsystems,” in *51st International Colloquium on Automata, Languages, and Programming (ICALP 2024)*, 36:1–36:18 (2024). [doi:10.4230/LIPIcs.ICALP.2024.36](https://doi.org/10.4230/LIPIcs.ICALP.2024.36); [arXiv:2402.06260](https://arxiv.org/abs/2402.06260).

**AFF+26** R. Ascoli, B. Frederickson, S. Frederickson, C. McFarland, and L. Post, “Almost All Graphs Are Vertex-Minor Universal,” arXiv preprint (2026), version 2; accepted for RANDOM 2026. [doi:10.48550/arXiv.2602.09049](https://doi.org/10.48550/arXiv.2602.09049); [arXiv:2602.09049](https://arxiv.org/abs/2602.09049).
