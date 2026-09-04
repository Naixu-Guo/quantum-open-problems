---
id: "01M1HME780WGEQBEXGETXMBSCQ"
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
areaIds: ["quantum-shannon-theory"]
topicIds: ["transpose-degradable-channels","strong-converse","quantum-capacity","finite-blocklength-quantum-information"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Exponential strong converse for transpose-degradable channels"
aliases: ["op-414fbcc7d5dc0c64","op_414fbcc7d5dc0c64","01M1HME780WGEQBEXGETXMBSCQ","v2-exponential-strong-converse-for-transpose-degradable-channels","open-problem-v2-problem-55"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_414fbcc7d5dc0c64.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_414fbcc7d5dc0c64","ulid":"01M1HME780WGEQBEXGETXMBSCQ","aliases":["op_414fbcc7d5dc0c64","01M1HME780WGEQBEXGETXMBSCQ","op-414fbcc7d5dc0c64","v2-exponential-strong-converse-for-transpose-degradable-channels","open-problem-v2-problem-55"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["transpose-degradable-channels","strong-converse","quantum-capacity","finite-blocklength-quantum-information"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Exponential strong converse for transpose-degradable channels","status":"Unsolved","fields":["Quantum Shannon theory"],"topics":["Transpose-degradable channels","Strong converse","Quantum capacity","Finite-blocklength quantum information"],"statement":"Does every finite-dimensional transpose-degradable channel satisfy an\nexponential strong converse for quantum communication at its single-letter\nquantum capacity?  Let $V:A\\to B\\otimes E$ be an isometry and suppose that\n\\begin{equation}\n  \\Phi(X):=\\operatorname{Tr}_E(VXV^\\dagger),\n  \\qquad\n  \\Phi^c(X):=\\operatorname{Tr}_B(VXV^\\dagger),\n  \\qquad\n  \\mathsf T_E\\circ\\Phi^c=\\mathcal G\\circ\\Phi,\n  \\label{eq:p55-transpose-degradable}\n\\end{equation}\nwhere $\\mathsf T_E$ is transpose in a fixed basis of $E$ and\n$\\mathcal G:\\mathcal L(B)\\to\\mathcal L(E)$ is completely positive and\ntrace preserving.  For the channel in\nEq.~\\eqref{eq:p55-transpose-degradable}, transpose degradability gives\n\\begin{equation}\n  Q(\\Phi)=Q^{(1)}(\\Phi)\n  :=\\max_{\\rho_A}\n     \\left[S(\\Phi(\\rho_A))-S(\\Phi^c(\\rho_A))\\right],\n  \\qquad\n  S(\\sigma):=-\\operatorname{Tr}(\\sigma\\log_2\\sigma).\n  \\label{eq:p55-single-letter-capacity}\n\\end{equation}\nEquation~\\eqref{eq:p55-single-letter-capacity} fixes the rate threshold.\n\nAt blocklength $n$, let\n$\\mathcal E_n:\\mathcal L(S_n)\\to\\mathcal L(A^{\\otimes n})$ and\n$\\mathcal R_n:\\mathcal L(B^{\\otimes n})\\to\\mathcal L(\\widehat S_n)$ be\narbitrary encoder and decoder channels, with\n$\\dim R_n=\\dim S_n=\\dim\\widehat S_n=M_n$.  Define the maximally entangled\ntarget by\n\\begin{equation}\n  \\varphi_{M_n}:=\n  |\\varphi_{M_n}\\rangle\\!\\langle\\varphi_{M_n}|,\n  \\qquad\n  |\\varphi_{M_n}\\rangle\n  :=\\frac1{\\sqrt{M_n}}\\sum_{i=1}^{M_n}|i\\rangle_{R_n}|i\\rangle_{S_n}.\n  \\label{eq:p55-maximally-entangled-target}\n\\end{equation}\nUsing the target in Eq.~\\eqref{eq:p55-maximally-entangled-target}, let\n\\begin{equation}\n  \\omega_n:=\n  \\left(\\operatorname{id}_{R_n}\\otimes\n  \\mathcal R_n\\circ\\Phi^{\\otimes n}\\circ\\mathcal E_n\\right)(\\varphi_{M_n}),\n  \\qquad\n  r_n:=\\frac1n\\log_2M_n,\n  \\qquad\n  F_n:=\\operatorname{Tr}(\\varphi_{M_n}^{R_n\\widehat S_n}\\omega_n).\n  \\label{eq:p55-code-fidelity}\n\\end{equation}\nThe problem is whether, for every channel in\nEq.~\\eqref{eq:p55-transpose-degradable}, the quantities in\nEq.~\\eqref{eq:p55-code-fidelity} satisfy\n\\begin{equation}\n  \\forall R>Q(\\Phi)\\ \\exists\\,\\gamma_R>0,\\ n_R\\in\\mathbb N:\n  \\quad\n  r_n\\geq R,\\ n\\geq n_R\n  \\ \\Longrightarrow\\\n  F_n\\leq2^{-\\gamma_R n}\n  \\label{eq:p55-exponential-strong-converse}\n\\end{equation}\nfor every encoder--decoder sequence.  Equation~\n\\eqref{eq:p55-exponential-strong-converse} is the all-code exponential\nstrong-converse property at the threshold in\nEq.~\\eqref{eq:p55-single-letter-capacity}.","source":"Singh and Datta supply the complex-linear transpose-degradable formulation and\nits single-letter capacity\n\\sourcecite{ref:p55-singh-datta}{SD22}.  Morgan and Winter explicitly note\nthat extending their degradable-channel converse method to the corresponding\nconjugate-degradable class requires arguments not provided there; together\nthese papers pose the present class-wide question implicitly\n\\sourcecite{ref:p55-morgan-winter}{MW14}.","progress":["Transpose degradability proves the tensor-power identity\n  \\begin{equation}\n    Q^{(1)}(\\Phi^{\\otimes n})=nQ^{(1)}(\\Phi)\n    \\qquad(n\\geq1).\n    \\label{eq:p55-coherent-information-additivity}\n  \\end{equation}\n  Equation~\\eqref{eq:p55-coherent-information-additivity} establishes the\n  capacity formula in Eq.~\\eqref{eq:p55-single-letter-capacity}, but gives no\n  finite-block upper bound on $F_n$\n  \\sourcecite{ref:p55-singh-datta}{SD22}.","For every ordinarily degradable channel $\\mathcal N$ and fixed\n  purified-distance error $\\varepsilon<1/\\sqrt2$, Morgan and Winter proved\n  \\begin{equation}\n    \\log_2 N_E(n,\\varepsilon\\mid\\mathcal N)\n      \\leq nQ^{(1)}(\\mathcal N)+O(\\sqrt{n\\log n}),\n    \\label{eq:p55-pretty-strong-converse}\n  \\end{equation}\n  where $N_E$ is the largest entanglement-generation code dimension.\n  Equation~\\eqref{eq:p55-pretty-strong-converse} is a pretty-strong converse\n  for ordinary degradability, and their proof does not extend to\n  transpose-degradable channels solely from coherent-information additivity\n  \\sourcecite{ref:p55-morgan-winter}{MW14}.","Kondra et al. proved in 2026 that every finite-dimensional ordinarily\n  degradable or antidegradable channel $\\mathcal N$ obeys, for every rate above\n  capacity,\n  \\begin{equation}\n    r_n\\geq R>Q(\\mathcal N)\n    \\quad\\Longrightarrow\\quad\n    F_n\\leq2^{-\\gamma_R n}\n    \\quad\\text{for all sufficiently large }n.\n    \\label{eq:p55-ordinary-exponential-converse}\n  \\end{equation}\n  Equation~\\eqref{eq:p55-ordinary-exponential-converse} settles the known\n  transpose-degradable examples that are also degradable, but its theorem does\n  not cover a hypothetical strict transpose-degradable channel\n  \\sourcecite{ref:p55-kondra-et-al}{KBK+26}."],"references":[{"key":"SD22","label":"ref:p55-singh-datta","tex":"S. Singh and N. Datta,\n  \\lq\\lq Detecting Positive Quantum Capacities of Quantum Channels,\\rq\\rq{}\n  \\emph{npj Quantum Information} \\textbf{8}, 50 (2022).\n  \\href{https://doi.org/10.1038/s41534-022-00550-2}{doi:10.1038/s41534-022-00550-2};\n  \\href{https://arxiv.org/abs/2105.06327}{arXiv:2105.06327}."},{"key":"MW14","label":"ref:p55-morgan-winter","tex":"C. Morgan and A. Winter,\n  \\lq\\lq Pretty Strong Converse for the Quantum Capacity of Degradable\n  Channels,\\rq\\rq{} \\emph{IEEE Transactions on Information Theory}\n  \\textbf{60}, 317--333 (2014).\n  \\href{https://doi.org/10.1109/TIT.2013.2288971}{doi:10.1109/TIT.2013.2288971};\n  \\href{https://arxiv.org/abs/1301.4927}{arXiv:1301.4927}."},{"key":"KBK+26","label":"ref:p55-kondra-et-al","tex":"T. V. Kondra, R. Brinster, H. Kampermann, D. Bru{\\ss}, and N. Wyderka,\n  \\lq\\lq Sharp Quantum Capacity Thresholds: Exponential Strong Converses for\n  Degradable and Antidegradable Channels,\\rq\\rq{} arXiv preprint (2026).\n  \\href{https://arxiv.org/abs/2608.01308}{arXiv:2608.01308}."}],"comment":"If every transpose-degradable channel is ordinarily degradable, then\nEq.~\\eqref{eq:p55-ordinary-exponential-converse} resolves the problem.  If a\nstrict channel exists as asked in Problem~53, the exponential converse for\nthat case remains unproved."}}
---
## Source

Singh and Datta supply the complex-linear transpose-degradable formulation and its single-letter capacity [SD22](https://doi.org/10.1038/s41534-022-00550-2). Morgan and Winter explicitly note that extending their degradable-channel converse method to the corresponding conjugate-degradable class requires arguments not provided there; together these papers pose the present class-wide question implicitly [MW14](https://doi.org/10.1109/TIT.2013.2288971).

## Progress

Transpose degradability proves the tensor-power identity

$$
Q^{(1)}(\Phi^{\otimes n})=nQ^{(1)}(\Phi)
 \qquad(n\geq1).
 \tag{6}
$$

Equation (6) establishes the capacity formula in Eq. (2), but gives no finite-block upper bound on $F_n$ [SD22](https://doi.org/10.1038/s41534-022-00550-2).

For every ordinarily degradable channel $\mathcal N$ and fixed purified-distance error $\varepsilon<1/\sqrt2$, Morgan and Winter proved

$$
\log_2 N_E(n,\varepsilon\mid\mathcal N)
 \leq nQ^{(1)}(\mathcal N)+O(\sqrt{n\log n}),
 \tag{7}
$$

where $N_E$ is the largest entanglement-generation code dimension. Equation (7) is a pretty-strong converse for ordinary degradability, and their proof does not extend to transpose-degradable channels solely from coherent-information additivity [MW14](https://doi.org/10.1109/TIT.2013.2288971).

Kondra et al. proved in 2026 that every finite-dimensional ordinarily degradable or antidegradable channel $\mathcal N$ obeys, for every rate above capacity,

$$
r_n\geq R>Q(\mathcal N)
 \quad\Longrightarrow\quad
 F_n\leq2^{-\gamma_R n}
 \quad\text{for all sufficiently large }n.
 \tag{8}
$$

Equation (8) settles the known transpose-degradable examples that are also degradable, but its theorem does not cover a hypothetical strict transpose-degradable channel [KBK+26](https://arxiv.org/abs/2608.01308).

## Comment

If every transpose-degradable channel is ordinarily degradable, then Eq. (8) resolves the problem. If a strict channel exists as asked in Problem 53, the exponential converse for that case remains unproved.

## References

**SD22** S. Singh and N. Datta, “ Detecting Positive Quantum Capacities of Quantum Channels,” *npj Quantum Information* **8**, 50 (2022). [doi:10.1038/s41534-022-00550-2](https://doi.org/10.1038/s41534-022-00550-2); [arXiv:2105.06327](https://arxiv.org/abs/2105.06327).

**MW14** C. Morgan and A. Winter, “ Pretty Strong Converse for the Quantum Capacity of Degradable Channels,” *IEEE Transactions on Information Theory* **60**, 317–333 (2014). [doi:10.1109/TIT.2013.2288971](https://doi.org/10.1109/TIT.2013.2288971); [arXiv:1301.4927](https://arxiv.org/abs/1301.4927).

**KBK+26** T. V. Kondra, R. Brinster, H. Kampermann, D. Bruß, and N. Wyderka, “ Sharp Quantum Capacity Thresholds: Exponential Strong Converses for Degradable and Antidegradable Channels,” arXiv preprint (2026). [arXiv:2608.01308](https://arxiv.org/abs/2608.01308).
