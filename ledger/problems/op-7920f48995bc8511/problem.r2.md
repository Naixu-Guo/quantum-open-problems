---
id: "01M1HME780EK3RBP2STMGR8JS5"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-11T01:50:50.590Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["channel-degradability","quantum-channel-structure"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Nontrivial mutually degradable channel pairs"
aliases: ["op-7920f48995bc8511","op_7920f48995bc8511","01M1HME780EK3RBP2STMGR8JS5","ruskai-2007-mutually-degradable-channels"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_7920f48995bc8511.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_7920f48995bc8511","ulid":"01M1HME780EK3RBP2STMGR8JS5","aliases":["op_7920f48995bc8511","01M1HME780EK3RBP2STMGR8JS5","op-7920f48995bc8511","ruskai-2007-mutually-degradable-channels"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["channel-degradability","quantum-channel-structure"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Nontrivial mutually degradable channel pairs","status":"Solved","fields":["Quantum Communication"],"topics":["Channel degradability","Quantum channel structure"],"statement":"Does there exist an integer $d\\geq2$ and a pair of distinct channels\n$\\mathcal M,\\mathcal N:\\mathcal L(A)\\to\\mathcal L(B)$, with\n$A\\simeq B\\simeq\\mathbb C^d$, that both have Choi rank exactly $d$, are\nmutually degradable, and are each nondegradable?  Let\n$E\\simeq\\mathbb C^d$ and choose minimal Stinespring isometries\n$V_{\\mathcal M},V_{\\mathcal N}:A\\to B\\otimes E$ defining the channels and\ntheir complements by\n\\begin{equation}\n  \\begin{aligned}\n    \\mathcal M(\\rho)&=\\operatorname{Tr}_E\n      (V_{\\mathcal M}\\rho V_{\\mathcal M}^{\\dagger}),\n    &\\mathcal M^c(\\rho)&=\\operatorname{Tr}_B\n      (V_{\\mathcal M}\\rho V_{\\mathcal M}^{\\dagger}),\\\\\n    \\mathcal N(\\rho)&=\\operatorname{Tr}_E\n      (V_{\\mathcal N}\\rho V_{\\mathcal N}^{\\dagger}),\n    &\\mathcal N^c(\\rho)&=\\operatorname{Tr}_B\n      (V_{\\mathcal N}\\rho V_{\\mathcal N}^{\\dagger}).\n  \\end{aligned}\n  \\label{eq:p59-complementary-pairs}\n\\end{equation}\nEquation~\\eqref{eq:p59-complementary-pairs} fixes representatives of the\ncomplementary channels; changing a minimal dilation only applies an output\nunitary to a complement.\n\nFor\n$\\lvert\\Omega_d\\rangle:=\\sum_{j=1}^d\\lvert j\\rangle_{A'}\\lvert j\\rangle_A$,\nthe required Choi-rank condition is\n\\begin{equation}\n  J(\\mathcal T):=(\\operatorname{id}_{A'}\\otimes\\mathcal T)\n    (\\lvert\\Omega_d\\rangle\\!\\langle\\Omega_d\\rvert),\n  \\qquad\n  \\operatorname{rank}J(\\mathcal M)\n   =\\operatorname{rank}J(\\mathcal N)=d.\n  \\label{eq:p59-choi-rank}\n\\end{equation}\nThe equality in Eq.~\\eqref{eq:p59-choi-rank} makes the environment dimension\nin Eq.~\\eqref{eq:p59-complementary-pairs} minimal.\n\nMutual degradability requires channels\n$\\mathcal X,\\mathcal Y:\\mathcal L(B)\\to\\mathcal L(E)$ such that\n\\begin{equation}\n  \\mathcal X\\circ\\mathcal M=\\mathcal N^c,\n  \\qquad\n  \\mathcal Y\\circ\\mathcal N=\\mathcal M^c.\n  \\label{eq:p59-mutual-degradability}\n\\end{equation}\nIn addition to Eq.~\\eqref{eq:p59-mutual-degradability}, neither channel may\nadmit its own degrading map:\n\\begin{equation}\n  \\begin{aligned}\n    &\\nexists\\ \\mathcal D_{\\mathcal M}:\\mathcal L(B)\\to\\mathcal L(E)\n      \\quad\\text{CPTP with}\\quad\n      \\mathcal M^c=\\mathcal D_{\\mathcal M}\\circ\\mathcal M,\\\\\n    &\\nexists\\ \\mathcal D_{\\mathcal N}:\\mathcal L(B)\\to\\mathcal L(E)\n      \\quad\\text{CPTP with}\\quad\n      \\mathcal N^c=\\mathcal D_{\\mathcal N}\\circ\\mathcal N.\n  \\end{aligned}\n  \\label{eq:p59-individual-nondegradability}\n\\end{equation}\nEquation~\\eqref{eq:p59-individual-nondegradability}, together with\n$\\mathcal M\\neq\\mathcal N$, excludes the identity-channel and self-pair constructions described below.\nIt does not exclude complementary pairs.","source":"Ruskai posed mutual degradability in Problem 23, Eq.~(32), and singled out\ntwo Choi-rank-$d$ channels that are not individually degradable\n\\sourcecite{ref:p59-ruskai}{Rus07}. The existence statement is answered by\nthe explicit complementary qutrit pair recorded in item A of the catalog's\nscientific-review issue \\sourcecite{ref:p59-review-41}{Rev26}.","progress":["An explicit solution has $d=3$, $a=3/4$, and $b=1/3$. Define the\nisometry\n\\begin{equation}\n  \\begin{aligned}\n    V|0\\rangle&=|00\\rangle,\\\\\n    V|1\\rangle&=\\sqrt{1-a}|10\\rangle+\\sqrt a|01\\rangle,\\\\\n    V|2\\rangle&=\\sqrt{1-b}|20\\rangle+\\sqrt b|02\\rangle.\n  \\end{aligned}\n  \\label{eq:p59-qutrit-isometry}\n\\end{equation}\nSet $\\mathcal M=\\operatorname{Tr}_E V(\\cdot)V^\\dagger$ and\n$\\mathcal N=\\operatorname{Tr}_B V(\\cdot)V^\\dagger$ in\nEq.~\\eqref{eq:p59-qutrit-isometry}, identifying both output spaces with\n$\\mathbb C^3$. Use the swapped isometry for $\\mathcal N$. Then\n$\\mathcal M^c=\\mathcal N$ and $\\mathcal N^c=\\mathcal M$, so\n$\\mathcal X=\\mathcal Y=\\operatorname{id}$ satisfies\nEq.~\\eqref{eq:p59-mutual-degradability}.\nThe Kraus operators of $\\mathcal M$ are\n$\\operatorname{diag}(1,\\sqrt{1-a},\\sqrt{1-b})$,\n$\\sqrt a|0\\rangle\\langle1|$, and $\\sqrt b|0\\rangle\\langle2|$;\nthose of $\\mathcal N$ replace $(a,b)$ by $(1-a,1-b)$.\nBoth triples are linearly independent, proving\nEq.~\\eqref{eq:p59-choi-rank}, and the outputs on\n$|1\\rangle\\langle1|$ differ.\nIf degrading maps $\\mathcal D\\mathcal M=\\mathcal N$ and\n$\\mathcal D'\\mathcal N=\\mathcal M$ existed, their actions on the ground\nstate and the relevant excited state would force\n\\begin{equation}\n  \\begin{aligned}\n    \\mathcal D(|1\\rangle\\langle1|)\n      &=3|1\\rangle\\langle1|-2|0\\rangle\\langle0|,\\\\\n    \\mathcal D'(|2\\rangle\\langle2|)\n      &=2|2\\rangle\\langle2|-|0\\rangle\\langle0|.\n  \\end{aligned}\n  \\label{eq:p59-nonpositive-degraders}\n\\end{equation}\nNeither output in Eq.~\\eqref{eq:p59-nonpositive-degraders} is positive,\nproving Eq.~\\eqref{eq:p59-individual-nondegradability}. This is the\nunpublished construction from the scientific-review issue\n\\sourcecite{ref:p59-review-41}{Rev26}.","At unrestricted rank, Ruskai observed that the identity channel and an\n  arbitrary channel form a mutually degradable pair.  Also, any degradable\n  channel paired with itself satisfies\n  Eq.~\\eqref{eq:p59-mutual-degradability}.  The rank, distinctness, and\n  nondegradability requirements exclude both constructions\n  \\sourcecite{ref:p59-ruskai}{Rus07}.","Cubitt, Ruskai, and Smith proved that every qubit channel with two\n  Kraus operators is either degradable or antidegradable.  Consequently, any\n  $d=2$ solution satisfying Eq.~\\eqref{eq:p59-individual-nondegradability}\n  must consist of two antidegradable channels.  Their classification neither\n  constructs nor excludes such a pair satisfying\n  Eq.~\\eqref{eq:p59-mutual-degradability}\n  \\sourcecite{ref:p59-cubitt-ruskai-smith}{CRS08}."],"references":[{"key":"Rus07","label":"ref:p59-ruskai","tex":"M. B. Ruskai, ``Open Problems in Quantum Information Theory,''\n  arXiv preprint arXiv:0708.1902 (2007).\n  \\newline\n  \\href{https://doi.org/10.48550/arXiv.0708.1902}{doi:10.48550/arXiv.0708.1902};\n  \\href{https://arxiv.org/abs/0708.1902}{arXiv:0708.1902}."},{"key":"CRS08","label":"ref:p59-cubitt-ruskai-smith","tex":"T. S. Cubitt, M. B. Ruskai, and G. Smith,\n  ``The Structure of Degradable Quantum Channels,''\n  \\emph{Journal of Mathematical Physics} \\textbf{49}, 102104 (2008).\n  \\href{https://doi.org/10.1063/1.2953685}{doi:10.1063/1.2953685};\n  \\href{https://arxiv.org/abs/0802.1360}{arXiv:0802.1360}."},{"key":"Rev26","label":"ref:p59-review-41","tex":"QIQCOP Zoo, “Scientific review: confirm channel, resource and QEC\nstatements in 10 catalog records,” GitHub issue \\#41, item A (2026).\nUnpublished construction.\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/41}{Issue \\#41}."}],"comment":"The displayed existence question is solved by\nEqs.~\\eqref{eq:p59-qutrit-isometry} and\n\\eqref{eq:p59-nonpositive-degraders}. The resolving construction is an\nunpublished issue contribution, not a peer-reviewed result. Excluding\ncomplementary pairs would define a stronger question; no such exclusion\nappears in the archived statement or in Ruskai's Problem 23."}}
---
## Source

Ruskai posed mutual degradability in Problem 23, Eq. (32), and singled out two Choi-rank-$d$ channels that are not individually degradable [Rus07](https://doi.org/10.48550/arXiv.0708.1902). The existence statement is answered by the explicit complementary qutrit pair recorded in item A of the catalog’s scientific-review issue [Rev26](https://github.com/Naixu-Guo/quantum-open-problems/issues/41).

## Progress

An explicit solution has $d=3$, $a=3/4$, and $b=1/3$. Define the isometry

$$
\begin{aligned}
 V|0\rangle&=|00\rangle,\\
 V|1\rangle&=\sqrt{1-a}|10\rangle+\sqrt a|01\rangle,\\
 V|2\rangle&=\sqrt{1-b}|20\rangle+\sqrt b|02\rangle.
 \end{aligned}
\tag{5}
$$

Set $\mathcal M=\operatorname{Tr}_E V(\cdot)V^\dagger$ and $\mathcal N=\operatorname{Tr}_B V(\cdot)V^\dagger$ in Eq. (5), identifying both output spaces with $\mathbb C^3$. Use the swapped isometry for $\mathcal N$. Then $\mathcal M^c=\mathcal N$ and $\mathcal N^c=\mathcal M$, so $\mathcal X=\mathcal Y=\operatorname{id}$ satisfies Eq. (3). The Kraus operators of $\mathcal M$ are $\operatorname{diag}(1,\sqrt{1-a},\sqrt{1-b})$, $\sqrt a|0\rangle\langle1|$, and $\sqrt b|0\rangle\langle2|$; those of $\mathcal N$ replace $(a,b)$ by $(1-a,1-b)$. Both triples are linearly independent, proving Eq. (2), and the outputs on $|1\rangle\langle1|$ differ. If degrading maps $\mathcal D\mathcal M=\mathcal N$ and $\mathcal D'\mathcal N=\mathcal M$ existed, their actions on the ground state and the relevant excited state would force

$$
\begin{aligned}
 \mathcal D(|1\rangle\langle1|)
 &=3|1\rangle\langle1|-2|0\rangle\langle0|,\\
 \mathcal D'(|2\rangle\langle2|)
 &=2|2\rangle\langle2|-|0\rangle\langle0|.
 \end{aligned}
\tag{6}
$$

Neither output in Eq. (6) is positive, proving Eq. (4). This is the unpublished construction from the scientific-review issue [Rev26](https://github.com/Naixu-Guo/quantum-open-problems/issues/41).

At unrestricted rank, Ruskai observed that the identity channel and an arbitrary channel form a mutually degradable pair. Also, any degradable channel paired with itself satisfies Eq. (3). The rank, distinctness, and nondegradability requirements exclude both constructions [Rus07](https://doi.org/10.48550/arXiv.0708.1902).

Cubitt, Ruskai, and Smith proved that every qubit channel with two Kraus operators is either degradable or antidegradable. Consequently, any $d=2$ solution satisfying Eq. (4) must consist of two antidegradable channels. Their classification neither constructs nor excludes such a pair satisfying Eq. (3) [CRS08](https://doi.org/10.1063/1.2953685).

## Comment

The displayed existence question is solved by Eqs. (5) and (6). The resolving construction is an unpublished issue contribution, not a peer-reviewed result. Excluding complementary pairs would define a stronger question; no such exclusion appears in the archived statement or in Ruskai’s Problem 23.

## References

**Rus07** M. B. Ruskai, “Open Problems in Quantum Information Theory,” arXiv preprint arXiv:0708.1902 (2007).
 [doi:10.48550/arXiv.0708.1902](https://doi.org/10.48550/arXiv.0708.1902); [arXiv:0708.1902](https://arxiv.org/abs/0708.1902).

**CRS08** T. S. Cubitt, M. B. Ruskai, and G. Smith, “The Structure of Degradable Quantum Channels,” *Journal of Mathematical Physics* **49**, 102104 (2008). [doi:10.1063/1.2953685](https://doi.org/10.1063/1.2953685); [arXiv:0802.1360](https://arxiv.org/abs/0802.1360).

**Rev26** QIQCOP Zoo, “Scientific review: confirm channel, resource and QEC statements in 10 catalog records,” GitHub issue #41, item A (2026). Unpublished construction. [Issue #41](https://github.com/Naixu-Guo/quantum-open-problems/issues/41).
