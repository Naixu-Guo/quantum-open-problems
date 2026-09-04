---
id: "01M1HME780H9TAVH85TF8KJDS5"
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
areaIds: ["quantum-error-correction","quantum-shannon-theory"]
topicIds: ["amplitude-damping-channels","quantum-capacity","quantum-coding-theory","quantum-polar-codes","degradable-channels"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Capacity-achieving codes for amplitude damping"
aliases: ["op-fcd21a1a5021e464","op_fcd21a1a5021e464","01M1HME780H9TAVH85TF8KJDS5","v2-capacity-achieving-codes-for-amplitude-damping","open-problem-v2-problem-2"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_fcd21a1a5021e464.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_fcd21a1a5021e464","ulid":"01M1HME780H9TAVH85TF8KJDS5","aliases":["op_fcd21a1a5021e464","01M1HME780H9TAVH85TF8KJDS5","op-fcd21a1a5021e464","v2-capacity-achieving-codes-for-amplitude-damping","open-problem-v2-problem-2"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-error-correction","quantum-shannon-theory"],"topicIds":["amplitude-damping-channels","quantum-capacity","quantum-coding-theory","quantum-polar-codes","degradable-channels"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Capacity-achieving codes for amplitude damping","status":"Solved","fields":["Quantum error correction","Quantum Shannon theory"],"topics":["Amplitude-damping channels","Quantum capacity","Quantum coding theory","Quantum polar codes","Degradable channels"],"statement":"What is the constructive quantum code for achieving the quantum capacity\n$\\mathcal{Q}(\\mathcal A_p)$ of the qubit amplitude-damping channel\n\\begin{equation}\n  \\mathcal A_p(\\rho)=A_0\\rho A_0^\\dagger+A_1\\rho A_1^\\dagger,\n  \\qquad 0\\le p\\le1?\n  \\label{eq:p2-amplitude-damping}\n\\end{equation}\nThe operators appearing in Eq.~\\eqref{eq:p2-amplitude-damping} are\n\\begin{equation}\n  \\begin{aligned}\n    A_0&=\\lvert0\\rangle\\!\\langle0\\rvert\n         +\\sqrt{1-p}\\,\\lvert1\\rangle\\!\\langle1\\rvert\n       =\\begin{pmatrix}1&0\\\\0&\\sqrt{1-p}\\end{pmatrix},\\\\\n    A_1&=\\sqrt p\\,\\lvert0\\rangle\\!\\langle1\\rvert\n       =\\begin{pmatrix}0&\\sqrt p\\\\0&0\\end{pmatrix}.\n  \\end{aligned}\n  \\label{eq:p2-kraus-operators}\n\\end{equation}\nEquation~\\eqref{eq:p2-kraus-operators} uses $p$ as the decay probability of\nthe excited state.","source":"This constructive gap is implicit in the exact capacity formula of Wolf and\nP\\'erez-Garc\\'ia and the polar-code construction of Wilde and Guha, which\nattains only the symmetric coherent-information rate for this channel\n\\sourcecite{ref:p2-wolf}{WPG07},\n\\sourcecite{ref:p2-wilde-guha}{WG13}.","progress":["The channel is degradable for $0\\le p\\le1/2$ and antidegradable for\n  $1/2\\le p\\le1$.  Consequently,\n  \\begin{equation}\n    \\mathcal{Q}(\\mathcal A_p)=\n    \\begin{cases}\n      \\displaystyle\\max_{0\\le q\\le1}\n      \\bigl[h_2((1-p)q)-h_2(pq)\\bigr],&0\\le p\\le\\tfrac12,\\\\[1.5mm]\n      0,&\\tfrac12\\le p\\le1,\n    \\end{cases}\n    \\label{eq:p2-capacity}\n  \\end{equation}\n  where $q$ is the excited-state population of the diagonal input and\n  $h_2(x):=-x\\log_2x-(1-x)\\log_2(1-x)$, with $0\\log_2 0:=0$.  The capacity formula in\n  Eq.~\\eqref{eq:p2-capacity} follows from the small-environment analysis\n  \\sourcecite{ref:p2-wolf}{WPG07}.","For $0\\le p\\le1/2$, Wilde and Guha constructed a channel-adapted\n  quantum polar code for degradable channels with a classical environment,\n  explicitly including the amplitude-damping channel.  It achieves\n  \\begin{equation}\n    I_c(I/2,\\mathcal A_p)\n    =h_2\\!\\left(\\frac{1-p}{2}\\right)-h_2\\!\\left(\\frac p2\\right),\n    \\label{eq:p2-symmetric-rate}\n  \\end{equation}\n  the symmetric coherent-information rate.  Equation~\\eqref{eq:p2-symmetric-rate}\n  is the bracket in Eq.~\\eqref{eq:p2-capacity} evaluated at $q=1/2$; since the\n  maximizer of Eq.~\\eqref{eq:p2-capacity} is interior and $q=1/2$ is not a\n  stationary point of the bracket for $0<p<1/2$, the symmetric rate is\n  strictly smaller than $\\mathcal{Q}(\\mathcal A_p)$ throughout that range.\n  The rate in Eq.~\\eqref{eq:p2-symmetric-rate} is obtained with an efficient\n  encoder and\n  asymptotically vanishing entanglement consumption, although that work did\n  not establish an efficient decoder \\sourcecite{ref:p2-wilde-guha}{WG13}.\n  Wilde and Renes subsequently gave a polar construction for arbitrary\n  qubit-input channels that achieves the same rate using coherent\n  successive-cancellation decoding \\sourcecite{ref:p2-wilde-renes}{WR12}.","Renes closed the remaining asymmetric-input and explicit-decoder\n  gaps.  In the CSS-type quantum polar scheme, the amplitude part of\n  $\\mathcal A_p$ is a classical $Z$-channel whose capacity-achieving input\n  is nonuniform, so the amplitude code is a Honda--Yamamoto polar code for\n  asymmetric channels \\sourcecite{ref:p2-honda-yamamoto}{HY13}, while the\n  phase part is a pure-state channel decoded by a quantum belief-propagation\n  circuit.  Renes states that the rate of this construction, optimized over\n  the amplitude input distribution, equals the capacity in\n  Eq.~\\eqref{eq:p2-capacity}, that degradability of $\\mathcal A_p$ removes\n  the need for preshared entanglement, and that the decoder is an explicit\n  circuit with $O(N^2)$ gates for block length $N$\n  \\sourcecite{ref:p2-renes-belief-propagation}{Ren17}."],"references":[{"key":"WPG07","label":"ref:p2-wolf","tex":"M. M. Wolf and D. P\\'erez-Garc\\'ia, ``Quantum Capacities of Channels with\n  Small Environment,'' \\emph{Physical Review A} \\textbf{75}, 012303 (2007).\n  \\href{https://doi.org/10.1103/PhysRevA.75.012303}{doi:10.1103/PhysRevA.75.012303};\n  \\href{https://arxiv.org/abs/quant-ph/0607070}{arXiv:quant-ph/0607070}."},{"key":"WG13","label":"ref:p2-wilde-guha","tex":"M. M. Wilde and S. Guha, ``Polar Codes for Degradable Quantum Channels,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{59}, 4718--4729\n  (2013). \\href{https://doi.org/10.1109/TIT.2013.2250575}{doi:10.1109/TIT.2013.2250575};\n  \\href{https://arxiv.org/abs/1109.5346}{arXiv:1109.5346}."},{"key":"WR12","label":"ref:p2-wilde-renes","tex":"M. M. Wilde and J. M. Renes, ``Quantum Polar Codes for Arbitrary Channels,''\n  in \\emph{2012 IEEE International Symposium on Information Theory\n  Proceedings}, 334--338 (2012).\n  \\href{https://doi.org/10.1109/ISIT.2012.6284203}{doi:10.1109/ISIT.2012.6284203};\n  \\href{https://arxiv.org/abs/1201.2906}{arXiv:1201.2906}."},{"key":"HY13","label":"ref:p2-honda-yamamoto","tex":"J. Honda and H. Yamamoto, ``Polar Coding Without Alphabet Extension for\n  Asymmetric Models,'' \\emph{IEEE Transactions on Information Theory}\n  \\textbf{59}, 7829--7838 (2013).\n  \\href{https://doi.org/10.1109/TIT.2013.2282305}{doi:10.1109/TIT.2013.2282305}."},{"key":"Ren17","label":"ref:p2-renes-belief-propagation","tex":"J. M. Renes, ``Belief Propagation Decoding of Quantum Channels by Passing\n  Quantum Messages,'' \\emph{New Journal of Physics} \\textbf{19}, 072001\n  (2017). \\href{https://doi.org/10.1088/1367-2630/aa7c78}{doi:10.1088/1367-2630/aa7c78};\n  \\href{https://arxiv.org/abs/1607.04833}{arXiv:1607.04833}."}],"comment":"Because the amplitude-damping channel is nonunital, the maximizing population\n$q$ in Eq.~\\eqref{eq:p2-capacity} is generally not $1/2$, so the symmetric\ncoherent-information rate in Eq.~\\eqref{eq:p2-symmetric-rate} is not the\nquantum capacity, and codes attaining only that rate do not settle the\nproblem.  The solved status records Renes' theorem that the asymmetric polar\nconstruction attains the optimized rate in Eq.~\\eqref{eq:p2-capacity} with\nan explicit capacity-achieving decoder, thereby solving the problem in the\nasymptotic coding sense.  Reducing the decoder complexity below $O(N^2)$\nremains a separate algorithmic question."}}
---
## Source

This constructive gap is implicit in the exact capacity formula of Wolf and Pérez-García and the polar-code construction of Wilde and Guha, which attains only the symmetric coherent-information rate for this channel [WPG07](https://doi.org/10.1103/PhysRevA.75.012303), [WG13](https://doi.org/10.1109/TIT.2013.2250575).

## Progress

The channel is degradable for $0\le p\le1/2$ and antidegradable for $1/2\le p\le1$. Consequently,

$$
\mathcal{Q}(\mathcal A_p)=
 \begin{cases}
 \displaystyle\max_{0\le q\le1}
 \bigl[h_2((1-p)q)-h_2(pq)\bigr],&0\le p\le\tfrac12,\\[1.5mm]
 0,&\tfrac12\le p\le1,
 \end{cases}
 \tag{3}
$$

where $q$ is the excited-state population of the diagonal input and $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_2 0:=0$. The capacity formula in Eq. (3) follows from the small-environment analysis [WPG07](https://doi.org/10.1103/PhysRevA.75.012303).

For $0\le p\le1/2$, Wilde and Guha constructed a channel-adapted quantum polar code for degradable channels with a classical environment, explicitly including the amplitude-damping channel. It achieves

$$
I_c(I/2,\mathcal A_p)
 =h_2\!\left(\frac{1-p}{2}\right)-h_2\!\left(\frac p2\right),
 \tag{4}
$$

the symmetric coherent-information rate. Equation (4) is the bracket in Eq. (3) evaluated at $q=1/2$; since the maximizer of Eq. (3) is interior and $q=1/2$ is not a stationary point of the bracket for $0<p<1/2$, the symmetric rate is strictly smaller than $\mathcal{Q}(\mathcal A_p)$ throughout that range. The rate in Eq. (4) is obtained with an efficient encoder and asymptotically vanishing entanglement consumption, although that work did not establish an efficient decoder [WG13](https://doi.org/10.1109/TIT.2013.2250575). Wilde and Renes subsequently gave a polar construction for arbitrary qubit-input channels that achieves the same rate using coherent successive-cancellation decoding [WR12](https://doi.org/10.1109/ISIT.2012.6284203).

Renes closed the remaining asymmetric-input and explicit-decoder gaps. In the CSS-type quantum polar scheme, the amplitude part of $\mathcal A_p$ is a classical $Z$-channel whose capacity-achieving input is nonuniform, so the amplitude code is a Honda–Yamamoto polar code for asymmetric channels [HY13](https://doi.org/10.1109/TIT.2013.2282305), while the phase part is a pure-state channel decoded by a quantum belief-propagation circuit. Renes states that the rate of this construction, optimized over the amplitude input distribution, equals the capacity in Eq. (3), that degradability of $\mathcal A_p$ removes the need for preshared entanglement, and that the decoder is an explicit circuit with $O(N^2)$ gates for block length $N$ [Ren17](https://doi.org/10.1088/1367-2630/aa7c78).

## Comment

Because the amplitude-damping channel is nonunital, the maximizing population $q$ in Eq. (3) is generally not $1/2$, so the symmetric coherent-information rate in Eq. (4) is not the quantum capacity, and codes attaining only that rate do not settle the problem. The solved status records Renes’ theorem that the asymmetric polar construction attains the optimized rate in Eq. (3) with an explicit capacity-achieving decoder, thereby solving the problem in the asymptotic coding sense. Reducing the decoder complexity below $O(N^2)$ remains a separate algorithmic question.

## References

**WPG07** M. M. Wolf and D. Pérez-García, “Quantum Capacities of Channels with Small Environment,” *Physical Review A* **75**, 012303 (2007). [doi:10.1103/PhysRevA.75.012303](https://doi.org/10.1103/PhysRevA.75.012303); [arXiv:quant-ph/0607070](https://arxiv.org/abs/quant-ph/0607070).

**WG13** M. M. Wilde and S. Guha, “Polar Codes for Degradable Quantum Channels,” *IEEE Transactions on Information Theory* **59**, 4718–4729 (2013). [doi:10.1109/TIT.2013.2250575](https://doi.org/10.1109/TIT.2013.2250575); [arXiv:1109.5346](https://arxiv.org/abs/1109.5346).

**WR12** M. M. Wilde and J. M. Renes, “Quantum Polar Codes for Arbitrary Channels,” in *2012 IEEE International Symposium on Information Theory Proceedings*, 334–338 (2012). [doi:10.1109/ISIT.2012.6284203](https://doi.org/10.1109/ISIT.2012.6284203); [arXiv:1201.2906](https://arxiv.org/abs/1201.2906).

**HY13** J. Honda and H. Yamamoto, “Polar Coding Without Alphabet Extension for Asymmetric Models,” *IEEE Transactions on Information Theory* **59**, 7829–7838 (2013). [doi:10.1109/TIT.2013.2282305](https://doi.org/10.1109/TIT.2013.2282305).

**Ren17** J. M. Renes, “Belief Propagation Decoding of Quantum Channels by Passing Quantum Messages,” *New Journal of Physics* **19**, 072001 (2017). [doi:10.1088/1367-2630/aa7c78](https://doi.org/10.1088/1367-2630/aa7c78); [arXiv:1607.04833](https://arxiv.org/abs/1607.04833).
