---
id: "01M6QPWWWREP2HF9DRSXNVDFBV"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-06T06:01:51.806Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-foundations","quantum-communication"]
topicIds: ["bell-nonlocality","quantum-communication-complexity"]
keywords: ["almost-quantum correlations","information causality","random access codes"]
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Information causality for almost-quantum correlations"
aliases: ["op-c37d38eda1436c12","op_c37d38eda1436c12","01M6QPWWWREP2HF9DRSXNVDFBV"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_c37d38eda1436c12.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_c37d38eda1436c12","ulid":"01M6QPWWWREP2HF9DRSXNVDFBV","aliases":["op_c37d38eda1436c12","01M6QPWWWREP2HF9DRSXNVDFBV","op-c37d38eda1436c12"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-06T05:56:53.784Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-foundations","quantum-communication"],"topicIds":["bell-nonlocality","quantum-communication-complexity"],"keywords":["almost-quantum correlations","information causality","random access codes"],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Information causality for almost-quantum correlations","status":"Solved","fields":["Quantum Foundations","Quantum Communication"],"topics":["Bell nonlocality","Quantum communication complexity"],"statement":"Do all almost-quantum correlations satisfy information causality?\nA bipartite conditional distribution $p(a,b\\mid x,y)$ with finite input and\noutput sets is almost quantum if there are a Hilbert space $\\mathcal H$,\na unit vector $|\\psi\\rangle$, and projective measurements\n$\\{P_a^x\\}_a$, $\\{Q_b^y\\}_b$ on $\\mathcal H$ such that\n\\begin{equation}\n  P_a^x Q_b^y|\\psi\\rangle=Q_b^y P_a^x|\\psi\\rangle,\n  \\qquad p(a,b\\mid x,y)=\\langle\\psi|P_a^x Q_b^y|\\psi\\rangle.\n  \\label{eq:c37d-aq}\n\\end{equation}\nEach measurement consists of orthogonal projections summing to the identity.\nThe commutation condition in \\eqref{eq:c37d-aq} is imposed only on the shared\nstate, not as an operator identity.\n\nAlice receives $L$ independent uniform bits $Z_1,\\ldots,Z_L$.\nBob receives an independent uniform index $J\\in\\{1,\\ldots,L\\}$.\nThey may use shared randomness and almost-quantum boxes independent of these\ninputs.\nAlice sends Bob an $m$-bit classical message, with no communication\nfrom Bob to Alice, and Bob outputs a binary guess $G$ for $Z_J$.\nInformation causality requires\n\\begin{equation}\n  \\sum_{j=1}^{L} I(Z_j:G\\mid J=j)\\leq m,\n  \\label{eq:c37d-ic}\n\\end{equation}\nwhere $I$ is Shannon mutual information in bits.\nMust \\eqref{eq:c37d-ic} hold for every finite protocol of this form and all\nintegers $L\\geq1$ and $m\\geq0$?","source":"Navascu\\'es, Guryanova, Hoban, and Ac\\'in define almost-quantum correlations\nand leave their compatibility with information causality unresolved\n(Definition~1 and Sections~9--10 of the arXiv version)\n\\sourcecite{ref:c37d-ngha}{NGHA15}.\nThe information-causality task and inequality originate with\nPaw\\l{}owski et al.\\ \\sourcecite{ref:c37d-ic-original}{PPKSWZ09}.","progress":["Navascu\\'es et al.\\ verify several consequences of information causality\nfor almost-quantum correlations and report supporting numerical evidence,\nwhile explicitly leaving the full principle unproved\n\\sourcecite{ref:c37d-ngha}{NGHA15}.","Das Bhowmik and Banik give a negative answer in preprint version~1,\nCorollary~1 \\sourcecite{ref:c37d-bb}{BB26}.\nTheir Lemma~1 supplies a finite-dimensional almost-quantum box with $N$\nsettings and two outcomes per party.\nA single use of this box and one\nclassical bit yield, for $L=kN$ independent data bits, the information score\n\\begin{equation}\n  \\sum_{j=1}^{kN} I(Z_j:G\\mid J=j)\n  \\geq \\frac{k}{17}\\left(1-(1-2^{-k})^N\\right).\n  \\label{eq:c37d-violation}\n\\end{equation}\nFor $k=18$ and $N=757693$, the right-hand side of\n\\eqref{eq:c37d-violation} exceeds $1.00000018$, contradicting\n\\eqref{eq:c37d-ic} with $m=1$.\nTaking $N=k2^k$ instead gives the unbounded lower bound\n$k(1-e^{-k})/17$.\nThe family uses increasing numbers of settings and data\nbits. The claim is not an unbounded violation by one fixed finite box."],"references":[{"key":"NGHA15","label":"ref:c37d-ngha","tex":"Miguel Navascu\\'es, Yelena Guryanova, Matty J. Hoban, and Antonio Ac\\'in,\n``Almost quantum correlations,'' \\emph{Nature Communications} \\textbf{6},\n6288 (2015).\n\\href{https://doi.org/10.1038/ncomms7288}{doi:10.1038/ncomms7288};\n\\href{https://arxiv.org/abs/1403.4621v1}{arXiv:1403.4621v1}."},{"key":"PPKSWZ09","label":"ref:c37d-ic-original","tex":"Marcin Paw\\l{}owski, Tomasz Paterek, Dagomir Kaszlikowski, Valerio Scarani,\nAndreas Winter, and Marek Żukowski,\n``Information causality as a physical principle,'' \\emph{Nature}\n\\textbf{461}, 1101--1104 (2009).\n\\href{https://doi.org/10.1038/nature08400}{doi:10.1038/nature08400};\n\\href{https://arxiv.org/abs/0905.2292v3}{arXiv:0905.2292v3}."},{"key":"BB26","label":"ref:c37d-bb","tex":"Anandamay Das Bhowmik and Manik Banik,\n``Almost-Quantum Correlations Violate Information Causality,'' preprint (2026).\n\\href{https://arxiv.org/abs/2610.41444v1}{arXiv:2610.41444v1}."}],"comment":"The universal information-causality claim is false by the finite\ncounterexample in \\sourcecite{ref:c37d-bb}{BB26}.\nThe Solved designation records this negative resolution and its preprint source.\nThe score includes every trial.\nBob always supplies a binary guess, so the\nviolation does not arise from conditioning on successful certificates.","contributors":[]}}
---
## Source

Navascués, Guryanova, Hoban, and Acín define almost-quantum correlations and leave their compatibility with information causality unresolved (Definition 1 and Sections 9–10 of the arXiv version) [NGHA15](https://doi.org/10.1038/ncomms7288). The information-causality task and inequality originate with Pawłowski et al. [PPKSWZ09](https://doi.org/10.1038/nature08400).

## Progress

Navascués et al. verify several consequences of information causality for almost-quantum correlations and report supporting numerical evidence, while explicitly leaving the full principle unproved [NGHA15](https://doi.org/10.1038/ncomms7288).

Das Bhowmik and Banik give a negative answer in preprint version 1, Corollary 1 [BB26](https://arxiv.org/abs/2610.41444v1). Their Lemma 1 supplies a finite-dimensional almost-quantum box with $N$ settings and two outcomes per party. A single use of this box and one classical bit yield, for $L=kN$ independent data bits, the information score

$$
\sum_{j=1}^{kN} I(Z_j:G\mid J=j)
 \geq \frac{k}{17}\left(1-(1-2^{-k})^N\right).
\tag{3}
$$

For $k=18$ and $N=757693$, the right-hand side of (3) exceeds $1.00000018$, contradicting (2) with $m=1$. Taking $N=k2^k$ instead gives the unbounded lower bound $k(1-e^{-k})/17$. The family uses increasing numbers of settings and data bits. The claim is not an unbounded violation by one fixed finite box.

## Comment

The universal information-causality claim is false by the finite counterexample in [BB26](https://arxiv.org/abs/2610.41444v1). The Solved designation records this negative resolution and its preprint source. The score includes every trial. Bob always supplies a binary guess, so the violation does not arise from conditioning on successful certificates.

## References

**NGHA15** Miguel Navascués, Yelena Guryanova, Matty J. Hoban, and Antonio Acín, “Almost quantum correlations,” *Nature Communications* **6**, 6288 (2015). [doi:10.1038/ncomms7288](https://doi.org/10.1038/ncomms7288); [arXiv:1403.4621v1](https://arxiv.org/abs/1403.4621v1).

**PPKSWZ09** Marcin Pawłowski, Tomasz Paterek, Dagomir Kaszlikowski, Valerio Scarani, Andreas Winter, and Marek Żukowski, “Information causality as a physical principle,” *Nature* **461**, 1101–1104 (2009). [doi:10.1038/nature08400](https://doi.org/10.1038/nature08400); [arXiv:0905.2292v3](https://arxiv.org/abs/0905.2292v3).

**BB26** Anandamay Das Bhowmik and Manik Banik, “Almost-Quantum Correlations Violate Information Causality,” preprint (2026). [arXiv:2610.41444v1](https://arxiv.org/abs/2610.41444v1).
