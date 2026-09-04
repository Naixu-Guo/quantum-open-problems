---
id: "01M1Q787QRSHGZH7NDSMFG88GH"
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
topicIds: ["quantum-source-coding","strong-converses"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Strong converse for general mixed-state quantum compression"
aliases: ["op-c9b532d3a7389c77","op_c9b532d3a7389c77","01M1Q787QRSHGZH7NDSMFG88GH"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_c9b532d3a7389c77.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_c9b532d3a7389c77","ulid":"01M1Q787QRSHGZH7NDSMFG88GH","aliases":["op_c9b532d3a7389c77","01M1Q787QRSHGZH7NDSMFG88GH","op-c9b532d3a7389c77"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-source-coding","strong-converses"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Strong converse for general mixed-state quantum compression","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum source coding","Strong converses"],"statement":"Does general finite-dimensional i.i.d. mixed-state quantum compression obey\nan unrestricted strong converse?  Let $\\rho^{AR}$ be a finite-dimensional\nsource state, where only $A$ is available to the encoder and $R$ is an\ninaccessible reference.  Fix a Koashi--Imoto isometry $U:A\\to CNQ$ for which\nthe source has the form\n\\begin{equation}\n  \\omega^{CNQR}\n  :=(U\\otimes I_R)\\rho^{AR}(U^\\dagger\\otimes I_R)\n  =\\sum_j p_j|j\\rangle\\!\\langle j|^C\n     \\otimes\\omega_j^N\\otimes\\rho_j^{QR},\n  \\label{eq:p71-koashi-imoto}\n\\end{equation}\nwhere $C$ is classical, $N$ is redundant relative to $R$ conditioned on\n$C$, and $Q$ carries the remaining source--reference correlations.  At\nblocklength $n$, allow arbitrary encoding and decoding channels\n$\\mathcal E_n:A^{\\otimes n}\\to M_n$ and\n$\\mathcal D_n:M_n\\to\\widehat A^{\\otimes n}$, with\n$\\widehat A\\cong A$.  Their reference-preserving squared fidelity is\n\\begin{equation}\n  F_n:=F\\!\\left(\n    (\\rho^{AR})^{\\otimes n},\n    \\left[(\\mathcal D_n\\circ\\mathcal E_n)\n      \\otimes\\operatorname{id}_{R^{\\otimes n}}\\right]\n      ((\\rho^{AR})^{\\otimes n})\n  \\right),\n  \\qquad\n  F(\\tau,\\zeta):=\\lVert\\sqrt\\tau\\sqrt\\zeta\\rVert_1^2.\n  \\label{eq:p71-code-fidelity}\n\\end{equation}\nThe optimal first-order qubit rate is $S(CQ)_\\omega$.  Determine whether every\nsequence of unrestricted channels defining Eq.~\\eqref{eq:p71-code-fidelity}\nsatisfies the strong-converse implication\n\\begin{equation}\n  \\limsup_{n\\to\\infty}\\frac1n\\log_2|M_n|<S(CQ)_\\omega\n  \\quad\\Longrightarrow\\quad\n  \\lim_{n\\to\\infty}F_n=0.\n  \\label{eq:p71-strong-converse}\n\\end{equation}\nEquation~\\eqref{eq:p71-strong-converse} imposes no unitality, isometry, or\ndimension-expansion condition on the encoder or decoder.","source":"Wilde records the unresolved mixed-state compression problem in\nSections~18.4--18.5.  Khanian and Winter solve its general finite-dimensional\nfirst-order formulation and explicitly leave the strong converse in\nEq.~\\eqref{eq:p71-strong-converse} open\n\\sourcecite{ref:p71-wilde}{Wil17},\n\\sourcecite{ref:p71-khanian-winter}{KW22}.","progress":["Koashi and Imoto identify and remove the locally redundant part of a\n  blind mixed-state ensemble.  Khanian and Winter use the corresponding\n  Koashi--Imoto decomposition for an arbitrary reference state, as in\n  Eq.~\\eqref{eq:p71-koashi-imoto}, and prove the exact first-order rate\n  \\begin{equation}\n    R_{\\mathrm{blind}}(\\rho^{AR})=S(CQ)_\\omega.\n    \\label{eq:p71-first-order-rate}\n  \\end{equation}\n  Equation~\\eqref{eq:p71-first-order-rate} supplies both achievability and a\n  weak converse, but it does not force the fidelity to vanish at every rate\n  below the threshold\n  \\sourcecite{ref:p71-koashi-imoto}{KI01},\n  \\sourcecite{ref:p71-khanian-winter}{KW22}.","A preprint revised in 2025 proves exponential fidelity decay for\n  general visible compression at every rate below\n  \\begin{equation}\n    L_\\rho\n    :=\\lim_{\\alpha\\to1^+}E_{\\alpha,p}^{\\infty}(A{:}R)_\\rho,\n    \\label{eq:p71-visible-bound}\n  \\end{equation}\n  where $E_{\\alpha,p}^{\\infty}$ is the regularized R\\'enyi entanglement of\n  purification used there.  Because blind codes form a subclass of visible\n  codes, Eq.~\\eqref{eq:p71-visible-bound} also gives an unrestricted\n  CPTP-decoder converse for blind compression below $L_\\rho$.  Equality\n  $L_\\rho=E_p^\\infty(A{:}R)_\\rho$, which would complete the visible strong\n  converse, remains conditional on an unresolved continuity statement; more\n  importantly here, $L_\\rho$ need not reach the blind threshold\n  $S(CQ)_\\omega$ in Eq.~\\eqref{eq:p71-first-order-rate}.\n\n  For rates up to the blind threshold, the preprint's claimed bound assumes\n  that the effective post--Koashi--Imoto decoder\n  $\\widetilde{\\mathcal D}_n:M_n\\to\\widehat C^{\\otimes n}\\widehat Q^{\\otimes n}$\n  is super-unital in the sense\n  \\begin{equation}\n    I_{\\widehat C^{\\otimes n}\\widehat Q^{\\otimes n}}\n    \\preceq\\widetilde{\\mathcal D}_n(I_{M_n}).\n    \\label{eq:p71-super-unital}\n  \\end{equation}\n  If $\\widetilde{\\mathcal D}_n$ is trace preserving, taking traces in\n  Eq.~\\eqref{eq:p71-super-unital} forces\n  $|M_n|\\geq|CQ|^n$, so the assumption excludes the relevant\n  dimension-reducing decoders.  These results therefore do not prove\n  Eq.~\\eqref{eq:p71-strong-converse} for unrestricted codes.  The cited\n  version is unrefereed; it also states that its first version contained an\n  error in a lemma and restricts the affected earlier theorem\n  \\sourcecite{ref:p71-khanian-strong}{Kha25}."],"references":[{"key":"Wil17","label":"ref:p71-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Secs.~18.4--18.5.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"KI01","label":"ref:p71-koashi-imoto","tex":"M. Koashi and N. Imoto, ``Compressibility of Quantum Mixed-State Signals,''\n  \\emph{Physical Review Letters} \\textbf{87}, 017902 (2001).\n  \\href{https://doi.org/10.1103/PhysRevLett.87.017902}{doi:10.1103/PhysRevLett.87.017902};\n  \\href{https://arxiv.org/abs/quant-ph/0103128}{arXiv:quant-ph/0103128}."},{"key":"KW22","label":"ref:p71-khanian-winter","tex":"Z. B. Khanian and A. Winter,\n  ``General Mixed State Quantum Data Compression with and without\n  Entanglement Assistance,'' \\emph{IEEE Transactions on Information Theory}\n  \\textbf{68}, 3130--3138 (2022).\n  \\href{https://doi.org/10.1109/TIT.2022.3143846}{doi:10.1109/TIT.2022.3143846};\n  \\href{https://arxiv.org/abs/1912.08506}{arXiv:1912.08506}."},{"key":"Kha25","label":"ref:p71-khanian-strong","tex":"Z. B. Khanian, ``Strong Converse Bounds for Compression of Mixed States,''\n  arXiv preprint (2022), version~2 revised in 2025.\n  \\href{https://arxiv.org/abs/2206.09415v2}{arXiv:2206.09415v2}."}],"comment":"The first-order rate in Eq.~\\eqref{eq:p71-first-order-rate} is settled.  The\nremaining gap is exactly the fidelity conclusion in\nEq.~\\eqref{eq:p71-strong-converse} for arbitrary CPTP encoders and decoders\nand an arbitrary finite-dimensional source state $\\rho^{AR}$."}}
---
## Source

Wilde records the unresolved mixed-state compression problem in Sections 18.4–18.5. Khanian and Winter solve its general finite-dimensional first-order formulation and explicitly leave the strong converse in Eq. (3) open [Wil17](https://doi.org/10.1017/9781316809976), [KW22](https://doi.org/10.1109/TIT.2022.3143846).

## Progress

Koashi and Imoto identify and remove the locally redundant part of a blind mixed-state ensemble. Khanian and Winter use the corresponding Koashi–Imoto decomposition for an arbitrary reference state, as in Eq. (1), and prove the exact first-order rate

$$
R_{\mathrm{blind}}(\rho^{AR})=S(CQ)_\omega.
 \tag{4}
$$

Equation (4) supplies both achievability and a weak converse, but it does not force the fidelity to vanish at every rate below the threshold [KI01](https://doi.org/10.1103/PhysRevLett.87.017902), [KW22](https://doi.org/10.1109/TIT.2022.3143846).

A preprint revised in 2025 proves exponential fidelity decay for general visible compression at every rate below

$$
L_\rho
 :=\lim_{\alpha\to1^+}E_{\alpha,p}^{\infty}(A{:}R)_\rho,
 \tag{5}
$$

where $E_{\alpha,p}^{\infty}$ is the regularized Rényi entanglement of purification used there. Because blind codes form a subclass of visible codes, Eq. (5) also gives an unrestricted CPTP-decoder converse for blind compression below $L_\rho$. Equality $L_\rho=E_p^\infty(A{:}R)_\rho$, which would complete the visible strong converse, remains conditional on an unresolved continuity statement; more importantly here, $L_\rho$ need not reach the blind threshold $S(CQ)_\omega$ in Eq. (4).

For rates up to the blind threshold, the preprint’s claimed bound assumes that the effective post–Koashi–Imoto decoder $\widetilde{\mathcal D}_n:M_n\to\widehat C^{\otimes n}\widehat Q^{\otimes n}$ is super-unital in the sense

$$
I_{\widehat C^{\otimes n}\widehat Q^{\otimes n}}
 \preceq\widetilde{\mathcal D}_n(I_{M_n}).
 \tag{6}
$$

If $\widetilde{\mathcal D}_n$ is trace preserving, taking traces in Eq. (6) forces $|M_n|\geq|CQ|^n$, so the assumption excludes the relevant dimension-reducing decoders. These results therefore do not prove Eq. (3) for unrestricted codes. The cited version is unrefereed; it also states that its first version contained an error in a lemma and restricts the affected earlier theorem [Kha25](https://arxiv.org/abs/2206.09415v2).

## Comment

The first-order rate in Eq. (4) is settled. The remaining gap is exactly the fidelity conclusion in Eq. (3) for arbitrary CPTP encoders and decoders and an arbitrary finite-dimensional source state $\rho^{AR}$.

## References

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Secs. 18.4–18.5. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**KI01** M. Koashi and N. Imoto, “Compressibility of Quantum Mixed-State Signals,” *Physical Review Letters* **87**, 017902 (2001). [doi:10.1103/PhysRevLett.87.017902](https://doi.org/10.1103/PhysRevLett.87.017902); [arXiv:quant-ph/0103128](https://arxiv.org/abs/quant-ph/0103128).

**KW22** Z. B. Khanian and A. Winter, “General Mixed State Quantum Data Compression with and without Entanglement Assistance,” *IEEE Transactions on Information Theory* **68**, 3130–3138 (2022). [doi:10.1109/TIT.2022.3143846](https://doi.org/10.1109/TIT.2022.3143846); [arXiv:1912.08506](https://arxiv.org/abs/1912.08506).

**Kha25** Z. B. Khanian, “Strong Converse Bounds for Compression of Mixed States,” arXiv preprint (2022), version 2 revised in 2025. [arXiv:2206.09415v2](https://arxiv.org/abs/2206.09415v2).
