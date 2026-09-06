---
id: "01M1Q787QRG3HGYA0Y8F8JBPTE"
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
areaIds: ["quantum-communication"]
topicIds: ["channel-degradability","private-capacity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Strict inclusion of degradable channels in the less-noisy class"
aliases: ["op-fd75613c5bab4164","op_fd75613c5bab4164","01M1Q787QRG3HGYA0Y8F8JBPTE"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_fd75613c5bab4164.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_fd75613c5bab4164","ulid":"01M1Q787QRG3HGYA0Y8F8JBPTE","aliases":["op_fd75613c5bab4164","01M1Q787QRG3HGYA0Y8F8JBPTE","op-fd75613c5bab4164"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["channel-degradability","private-capacity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Strict inclusion of degradable channels in the less-noisy class","status":"Solved","fields":["Quantum Communication"],"topics":["Channel degradability","Private capacity"],"statement":"Do there exist finite-dimensional quantum channels that are less noisy in\nWatanabe's regularized sense but are not degradable?  Let\n$V_{A\\to BE}$ be a Stinespring isometry defining a channel and a complementary\nchannel by\n\\begin{equation}\n  \\mathcal N_{A\\to B}(X)\n  :=\\operatorname{Tr}_E[VXV^\\dagger],\n  \\qquad\n  \\mathcal N^c_{A\\to E}(X)\n  :=\\operatorname{Tr}_B[VXV^\\dagger].\n  \\label{eq:p47-complementary-pair}\n\\end{equation}\nThe channel in Eq.~\\eqref{eq:p47-complementary-pair} is degradable if there is\na completely positive trace-preserving map $\\mathcal D_{B\\to E}$ such that\n\\begin{equation}\n  \\mathcal N^c=\\mathcal D\\circ\\mathcal N.\n  \\label{eq:p47-degradable}\n\\end{equation}\nWriting $P$ for the unassisted private classical capacity, Watanabe calls\n$\\mathcal N$ less noisy when\n\\begin{equation}\n  P(\\mathcal N^c)=0.\n  \\label{eq:p47-watanabe-less-noisy}\n\\end{equation}\nEquivalently, Eq.~\\eqref{eq:p47-watanabe-less-noisy} requires that, for every\n$n\\ge1$ and every classical--quantum ensemble on $UA^{n}$, the receiver and\nenvironment outputs obey\n\\begin{equation}\n  I(U:B^n)_{(\\operatorname{id}_U\\otimes\\mathcal N^{\\otimes n})(\\omega)}\n  \\ge\n  I(U:E^n)_{(\\operatorname{id}_U\\otimes(\\mathcal N^c)^{\\otimes n})(\\omega)}.\n  \\label{eq:p47-regularized-order}\n\\end{equation}\nThus the question asks whether the inclusion implied by\nEqs.~\\eqref{eq:p47-degradable}--\\eqref{eq:p47-regularized-order} is strict.","source":"Watanabe proved the inclusion of degradable channels in the regularized\nless-noisy class and explicitly left open whether it is strict\n\\sourcecite{ref:p47-watanabe}{Wat12}.","progress":["Watanabe proved that every degradable channel satisfies\n  Eq.~\\eqref{eq:p47-watanabe-less-noisy}, but left open whether this inclusion\n  is strict \\sourcecite{ref:p47-watanabe}{Wat12}.","Belzig, Gao, Smith, and Wu constructed nondegradable channels satisfying\n  the one-copy version of Eq.~\\eqref{eq:p47-regularized-order}.  Their result\n  separates degradability from the level-1 less-noisy condition, while\n  explicitly leaving the all-blocklength condition in\n  Eq.~\\eqref{eq:p47-regularized-order} unresolved\n  \\sourcecite{ref:p47-belzig}{BGSW25}.","Zhu and Wang subsequently considered the qutrit channel\n  \\begin{equation}\n    \\Lambda(X)\n    =\\frac12X+\\frac14\\bigl(\\operatorname{Tr}(X)I-X^{\\mathsf T}\\bigr)\n    \\label{eq:p47-zhu-wang-channel}\n  \\end{equation}\n  and proved at every blocklength that\n  \\begin{equation}\n    P(\\Lambda)=Q(\\Lambda)=0,\n    \\qquad\n    \\Lambda\\ \\text{is not antidegradable}.\n    \\label{eq:p47-zhu-wang-properties}\n  \\end{equation}\n  Setting $\\mathcal N=\\Lambda^c$, Eq.~\\eqref{eq:p47-zhu-wang-properties}\n  gives $P(\\mathcal N^c)=0$, so $\\mathcal N$ is Watanabe-less-noisy.  If\n  $\\mathcal N$ were degradable, then\n  $\\Lambda=\\mathcal D\\circ\\Lambda^c$ for some channel $\\mathcal D$, contrary\n  to the non-antidegradability statement in\n  Eq.~\\eqref{eq:p47-zhu-wang-properties}.  Hence $\\Lambda^c$ is less noisy but\n  nondegradable \\sourcecite{ref:p47-zhu-wang}{ZW26}."],"references":[{"key":"Wat12","label":"ref:p47-watanabe","tex":"S. Watanabe, ``Private and Quantum Capacities of More Capable and Less Noisy\n  Quantum Channels,'' \\emph{Physical Review A} \\textbf{85}, 012326 (2012).\n  \\href{https://doi.org/10.1103/PhysRevA.85.012326}{doi:10.1103/PhysRevA.85.012326};\n  \\href{https://arxiv.org/abs/1110.5746}{arXiv:1110.5746}."},{"key":"BGSW25","label":"ref:p47-belzig","tex":"P. Belzig, L. Gao, G. Smith, and P. Wu, ``Reverse-Type Data Processing\n  Inequality,'' \\emph{Communications in Mathematical Physics} \\textbf{406},\n  295 (2025).\n  \\href{https://doi.org/10.1007/s00220-025-05474-4}{doi:10.1007/s00220-025-05474-4};\n  \\href{https://arxiv.org/abs/2411.19890}{arXiv:2411.19890}."},{"key":"ZW26","label":"ref:p47-zhu-wang","tex":"C. Zhu and X. Wang, ``Quantum Incapacity beyond No-Cloning and PPT\n  Mechanisms,'' arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2607.24693}{arXiv:2607.24693}."}],"comment":"The answer is affirmative: the complement of the channel in\nEq.~\\eqref{eq:p47-zhu-wang-channel} proves that degradable channels form a\nproper subset of Watanabe-less-noisy channels.  The resolving result\n\\sourcecite{ref:p47-zhu-wang}{ZW26} is, as of August 2026, a recent preprint;\nthe solved status records its theorem rather than peer-review history."}}
---
## Source

Watanabe proved the inclusion of degradable channels in the regularized less-noisy class and explicitly left open whether it is strict [Wat12](https://doi.org/10.1103/PhysRevA.85.012326).

## Progress

Watanabe proved that every degradable channel satisfies Eq. (3), but left open whether this inclusion is strict [Wat12](https://doi.org/10.1103/PhysRevA.85.012326).

Belzig, Gao, Smith, and Wu constructed nondegradable channels satisfying the one-copy version of Eq. (4). Their result separates degradability from the level-1 less-noisy condition, while explicitly leaving the all-blocklength condition in Eq. (4) unresolved [BGSW25](https://doi.org/10.1007/s00220-025-05474-4).

Zhu and Wang subsequently considered the qutrit channel

$$
\Lambda(X)
 =\frac12X+\frac14\bigl(\operatorname{Tr}(X)I-X^{\mathsf T}\bigr)
 \tag{5}
$$

and proved at every blocklength that

$$
P(\Lambda)=Q(\Lambda)=0,
 \qquad
 \Lambda\ \text{is not antidegradable}.
 \tag{6}
$$

Setting $\mathcal N=\Lambda^c$, Eq. (6) gives $P(\mathcal N^c)=0$, so $\mathcal N$ is Watanabe-less-noisy. If $\mathcal N$ were degradable, then $\Lambda=\mathcal D\circ\Lambda^c$ for some channel $\mathcal D$, contrary to the non-antidegradability statement in Eq. (6). Hence $\Lambda^c$ is less noisy but nondegradable [ZW26](https://arxiv.org/abs/2607.24693).

## Comment

The answer is affirmative: the complement of the channel in Eq. (5) proves that degradable channels form a proper subset of Watanabe-less-noisy channels. The resolving result [ZW26](https://arxiv.org/abs/2607.24693) is, as of August 2026, a recent preprint; the solved status records its theorem rather than peer-review history.

## References

**Wat12** S. Watanabe, “Private and Quantum Capacities of More Capable and Less Noisy Quantum Channels,” *Physical Review A* **85**, 012326 (2012). [doi:10.1103/PhysRevA.85.012326](https://doi.org/10.1103/PhysRevA.85.012326); [arXiv:1110.5746](https://arxiv.org/abs/1110.5746).

**BGSW25** P. Belzig, L. Gao, G. Smith, and P. Wu, “Reverse-Type Data Processing Inequality,” *Communications in Mathematical Physics* **406**, 295 (2025). [doi:10.1007/s00220-025-05474-4](https://doi.org/10.1007/s00220-025-05474-4); [arXiv:2411.19890](https://arxiv.org/abs/2411.19890).

**ZW26** C. Zhu and X. Wang, “Quantum Incapacity beyond No-Cloning and PPT Mechanisms,” arXiv preprint (2026). [arXiv:2607.24693](https://arxiv.org/abs/2607.24693).
