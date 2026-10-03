---
id: "01M1HME7803DZWKPJRHYYKHX0C"
type: "Problem"
schemaVersion: "1.0"
revision: 3
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-25T06:20:24.641Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-metrology","quantum-communication"]
topicIds: ["channel-discrimination","quantum-hypothesis-testing","quantum-relative-entropy","strong-converses"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Fixed-error parallel Stein lemma for quantum channels"
aliases: ["op-08387c140f552732","op_08387c140f552732","01M1HME7803DZWKPJRHYYKHX0C","v2-fixed-error-parallel-stein-lemma-for-quantum-channels","open-problem-v2-problem-46"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_08387c140f552732.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_08387c140f552732","ulid":"01M1HME7803DZWKPJRHYYKHX0C","aliases":["op_08387c140f552732","01M1HME7803DZWKPJRHYYKHX0C","op-08387c140f552732","v2-fixed-error-parallel-stein-lemma-for-quantum-channels","open-problem-v2-problem-46"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-metrology","quantum-communication"],"topicIds":["channel-discrimination","quantum-hypothesis-testing","quantum-relative-entropy","strong-converses"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Fixed-error parallel Stein lemma for quantum channels","status":"Unsolved","fields":["Quantum metrology","Quantum Communication"],"topics":["Channel discrimination","Quantum hypothesis testing","Quantum relative entropy","Strong converses"],"statement":"Let $\\mathcal N,\\mathcal M:\\mathcal L(A)\\to\\mathcal L(B)$ be quantum\nchannels on finite-dimensional systems.  For states $\\rho$ and $\\sigma$,\ndefine the relative entropy and the hypothesis-testing divergence by\n\\begin{equation}\n  \\begin{aligned}\n    D(\\rho\\|\\sigma)\n      &:={\\rm Tr}\\!\\left[\\rho(\\log_2\\rho-\\log_2\\sigma)\\right],\\\\\n    D_H^\\varepsilon(\\rho\\|\\sigma)\n      &:=-\\log_2\\inf_{\\substack{0\\leq Q\\leq I\\\\\n                    {\\rm Tr}(Q\\rho)\\geq1-\\varepsilon}}\n                    {\\rm Tr}(Q\\sigma),\n  \\end{aligned}\n  \\label{eq:p46-state-divergences}\n\\end{equation}\nwhere $D(\\rho\\|\\sigma)=+\\infty$ unless\n$\\operatorname{supp}\\rho\\subseteq\\operatorname{supp}\\sigma$, and\n$\\varepsilon\\in(0,1)$.  For either divergence $\\mathbf D$ in\nEq.~\\eqref{eq:p46-state-divergences}, its stabilized channel extension is\n\\begin{equation}\n  \\mathbf D_{\\rm ch}(\\mathcal N\\|\\mathcal M)\n  :=\\sup_{\\psi_{RA}\\in\\mathcal D(R\\otimes A)}\n  \\mathbf D\\!\\left(\n    (\\operatorname{id}_R\\otimes\\mathcal N)(\\psi)\n    \\middle\\|\n    (\\operatorname{id}_R\\otimes\\mathcal M)(\\psi)\n  \\right),\n  \\qquad R\\simeq A.\n  \\label{eq:p46-channel-divergence}\n\\end{equation}\nUsing Eq.~\\eqref{eq:p46-channel-divergence}, define the regularized channel\nrelative entropy by\n\\begin{equation}\n  D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)\n  :=\\lim_{n\\to\\infty}\\frac1n\n  D_{\\rm ch}(\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n}).\n  \\label{eq:p46-regularized-relative-entropy}\n\\end{equation}\nWhenever Eq.~\\eqref{eq:p46-regularized-relative-entropy} is finite, does the\nfixed-error parallel Stein limit exist and satisfy\n\\begin{equation}\n  \\lim_{n\\to\\infty}\\frac1n\n  D_{H,{\\rm ch}}^\\varepsilon\n  (\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n})\n  =D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)\n  \\qquad\\text{for every }\\varepsilon\\in(0,1)?\n  \\label{eq:p46-fixed-error-stein}\n\\end{equation}","source":"Fang, Gour, and Wang prove the weak channel Stein lemma and identify the\nfixed-error, equivalently strong-converse-threshold, extension as unresolved\nfor general channel pairs \\sourcecite{ref:p46-fang-gour-wang}{FGW25}.","progress":["The weak channel Stein lemma proves\n  \\begin{equation}\n    \\lim_{\\delta\\downarrow0}\\lim_{n\\to\\infty}\\frac1n\n    D_{H,{\\rm ch}}^\\delta\n    (\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n})\n    =D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M).\n    \\label{eq:p46-weak-stein}\n  \\end{equation}\n  Equation~\\eqref{eq:p46-weak-stein} yields the required lower bound at\n  every fixed error, but not the converse inequality\n  \\sourcecite{ref:p46-fang-gour-wang}{FGW25}.","Sandwiched-R\\'enyi converses bound the fixed-error limsup by\n  \\begin{equation}\n    \\limsup_{n\\to\\infty}\\frac1nD_{H,{\\rm ch}}^\\varepsilon\n    (\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n})\n    \\leq\\inf_{\\alpha>1}\n    \\widetilde D_{\\alpha,{\\rm ch}}^\\infty(\\mathcal N\\|\\mathcal M).\n    \\label{eq:p46-renyi-converse}\n  \\end{equation}\n  Closing Eq.~\\eqref{eq:p46-renyi-converse} requires the still-unproved\n  continuity identity\n  \\begin{equation}\n    \\inf_{\\alpha>1}\\widetilde D_{\\alpha,{\\rm ch}}^\\infty\n       (\\mathcal N\\|\\mathcal M)\n    \\stackrel{?}{=}D_{\\rm ch}^\\infty(\\mathcal N\\|\\mathcal M).\n    \\label{eq:p46-renyi-continuity}\n  \\end{equation}\n  Equation~\\eqref{eq:p46-renyi-continuity} is the general strong-converse\n  threshold problem \\sourcecite{ref:p46-fang-gour-wang}{FGW25}.","The equality in Eq.~\\eqref{eq:p46-fixed-error-stein} is known when\n  $\\mathcal M$ is a replacer channel\n  \\sourcecite{ref:p46-cooney-mosonyi-wilde}{CMW16}.  It is also known for\n  suitable pairs of idempotent channels that share a full-rank invariant\n  state; this structured result explicitly leaves the general channel case\n  open \\sourcecite{ref:p46-singh-bergh}{SB26}.","For finite $D_{\\max}(\\mathcal N\\|\\mathcal M)$, Gour's Theorem 14,\n  statements (1), (3), and (4), equates Eq.~\\eqref{eq:p46-fixed-error-stein}\n  with a subchannel-smoothed max-relative-entropy AEP at rate\n  $D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)$ for every fixed\n  $\\delta\\in(0,1)$, and with\n  $E_{2^{nr}}(\\mathcal N^{\\otimes n}\\|\\mathcal M^{\\otimes n})\\to0$ for\n  every $r>D_{\\rm ch}^{\\infty}(\\mathcal N\\|\\mathcal M)$\n  \\sourcecite{ref:p46-gour-aep}{Gou26}.  Here subchannels are completely\n  positive trace-nonincreasing maps; smoothing is uniform over\n  reference-assisted inputs in generalized trace distance\n  $\\tfrac12(\\|X\\|_1+|\\operatorname{Tr}X|)$, with $X$ the output difference.\n  The channel hockey-stick divergence $E_\\gamma$ maximizes\n  $\\operatorname{Tr}(\\rho-\\gamma\\sigma)_+$ over common reference-assisted\n  inputs.  These equivalent assertions remain open in general.","Historical GitHub report (2026-09-16): Naixu-Guo reported a CPTP-smoothed channel-AEP counterexample and related Stein-limit implications, distinguishing the reported identity failure from remaining limit questions. \\href{https://github.com/Naixu-Guo/quantum-open-problems/pull/68}{Pull request \\#68}. Follow-up: \\href{https://github.com/Naixu-Guo/quantum-open-problems/pull/68#issuecomment-5725551512}{Naixu-Guo, 2026-09-18}."],"references":[{"key":"FGW25","label":"ref:p46-fang-gour-wang","tex":"K. Fang, G. Gour, and X. Wang,\n  ``Towards the Ultimate Limits of Quantum Channel Discrimination and\n  Quantum Communication,'' \\emph{Science China Information Sciences}\n  \\textbf{68}, 180509 (2025).\n  \\href{https://doi.org/10.1007/s11432-024-4488-0}{doi:10.1007/s11432-024-4488-0};\n  \\href{https://arxiv.org/abs/2110.14842}{arXiv:2110.14842}."},{"key":"CMW16","label":"ref:p46-cooney-mosonyi-wilde","tex":"T. Cooney, M. Mosonyi, and M. M. Wilde,\n  ``Strong Converse Exponents for a Quantum Channel Discrimination Problem\n  and Quantum-Feedback-Assisted Communication,''\n  \\emph{Communications in Mathematical Physics} \\textbf{344}, 797--829\n  (2016).\n  \\href{https://doi.org/10.1007/s00220-016-2645-4}{doi:10.1007/s00220-016-2645-4};\n  \\href{https://arxiv.org/abs/1408.3373}{arXiv:1408.3373}."},{"key":"SB26","label":"ref:p46-singh-bergh","tex":"S. Singh and B. Bergh, ``Discriminating Idempotent Quantum Channels,''\n  arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2603.28582}{arXiv:2603.28582}."},{"key":"Gou26","label":"ref:p46-gour-aep","tex":"G. Gour, ``Failure of the Asymptotic Equipartition Property for Quantum\n  Channels,'' arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2609.15004v1}{arXiv:2609.15004v1}."}],"comment":"The question concerns parallel tests with an arbitrary entangled input across\nthe channel uses.  The weak-error result and the known structured channel\nfamilies do not establish Eq.~\\eqref{eq:p46-fixed-error-stein} for an arbitrary\nfinite-dimensional pair $\\mathcal N,\\mathcal M$.\nThe failure of CPTP-smoothed AEP does not refute this\nStein limit: trace-preserving completion is an additional constraint\n\\sourcecite{ref:p46-gour-aep}{Gou26}."}}
---
## Source

Fang, Gour, and Wang prove the weak channel Stein lemma and identify the fixed-error, equivalently strong-converse-threshold, extension as unresolved for general channel pairs [FGW25](https://doi.org/10.1007/s11432-024-4488-0).

## Progress

The weak channel Stein lemma proves

$$
\lim_{\delta\downarrow0}\lim_{n\to\infty}\frac1n
 D_{H,{\rm ch}}^\delta
 (\mathcal N^{\otimes n}\|\mathcal M^{\otimes n})
 =D_{\rm ch}^{\infty}(\mathcal N\|\mathcal M).
 \tag{5}
$$

Equation (5) yields the required lower bound at every fixed error, but not the converse inequality [FGW25](https://doi.org/10.1007/s11432-024-4488-0).

Sandwiched-Rényi converses bound the fixed-error limsup by

$$
\limsup_{n\to\infty}\frac1nD_{H,{\rm ch}}^\varepsilon
 (\mathcal N^{\otimes n}\|\mathcal M^{\otimes n})
 \leq\inf_{\alpha>1}
 \widetilde D_{\alpha,{\rm ch}}^\infty(\mathcal N\|\mathcal M).
 \tag{6}
$$

Closing Eq. (6) requires the still-unproved continuity identity

$$
\inf_{\alpha>1}\widetilde D_{\alpha,{\rm ch}}^\infty
 (\mathcal N\|\mathcal M)
 \stackrel{?}{=}D_{\rm ch}^\infty(\mathcal N\|\mathcal M).
 \tag{7}
$$

Equation (7) is the general strong-converse threshold problem [FGW25](https://doi.org/10.1007/s11432-024-4488-0).

The equality in Eq. (4) is known when $\mathcal M$ is a replacer channel [CMW16](https://doi.org/10.1007/s00220-016-2645-4). It is also known for suitable pairs of idempotent channels that share a full-rank invariant state; this structured result explicitly leaves the general channel case open [SB26](https://arxiv.org/abs/2603.28582).

For finite $D_{\max}(\mathcal N\|\mathcal M)$, Gour’s Theorem 14, statements (1), (3), and (4), equates Eq. (4) with a subchannel-smoothed max-relative-entropy AEP at rate $D_{\rm ch}^{\infty}(\mathcal N\|\mathcal M)$ for every fixed $\delta\in(0,1)$, and with $E_{2^{nr}}(\mathcal N^{\otimes n}\|\mathcal M^{\otimes n})\to0$ for every $r>D_{\rm ch}^{\infty}(\mathcal N\|\mathcal M)$ [Gou26](https://arxiv.org/abs/2609.15004v1). Here subchannels are completely positive trace-nonincreasing maps; smoothing is uniform over reference-assisted inputs in generalized trace distance $\tfrac12(\|X\|_1+|\operatorname{Tr}X|)$, with $X$ the output difference. The channel hockey-stick divergence $E_\gamma$ maximizes $\operatorname{Tr}(\rho-\gamma\sigma)_+$ over common reference-assisted inputs. These equivalent assertions remain open in general.

Historical GitHub report (2026-09-16): Naixu-Guo reported a CPTP-smoothed channel-AEP counterexample and related Stein-limit implications, distinguishing the reported identity failure from remaining limit questions. [Pull request #68](https://github.com/Naixu-Guo/quantum-open-problems/pull/68). Follow-up: [Naixu-Guo, 2026-09-18](https://github.com/Naixu-Guo/quantum-open-problems/pull/68#issuecomment-5725551512).

## Comment

The question concerns parallel tests with an arbitrary entangled input across the channel uses. The weak-error result and the known structured channel families do not establish Eq. (4) for an arbitrary finite-dimensional pair $\mathcal N,\mathcal M$. The failure of CPTP-smoothed AEP does not refute this Stein limit: trace-preserving completion is an additional constraint [Gou26](https://arxiv.org/abs/2609.15004v1).

## References

**FGW25** K. Fang, G. Gour, and X. Wang, “Towards the Ultimate Limits of Quantum Channel Discrimination and Quantum Communication,” *Science China Information Sciences* **68**, 180509 (2025). [doi:10.1007/s11432-024-4488-0](https://doi.org/10.1007/s11432-024-4488-0); [arXiv:2110.14842](https://arxiv.org/abs/2110.14842).

**CMW16** T. Cooney, M. Mosonyi, and M. M. Wilde, “Strong Converse Exponents for a Quantum Channel Discrimination Problem and Quantum-Feedback-Assisted Communication,” *Communications in Mathematical Physics* **344**, 797–829 (2016). [doi:10.1007/s00220-016-2645-4](https://doi.org/10.1007/s00220-016-2645-4); [arXiv:1408.3373](https://arxiv.org/abs/1408.3373).

**SB26** S. Singh and B. Bergh, “Discriminating Idempotent Quantum Channels,” arXiv preprint (2026). [arXiv:2603.28582](https://arxiv.org/abs/2603.28582).

**Gou26** G. Gour, “Failure of the Asymptotic Equipartition Property for Quantum Channels,” arXiv preprint (2026). [arXiv:2609.15004v1](https://arxiv.org/abs/2609.15004v1).
