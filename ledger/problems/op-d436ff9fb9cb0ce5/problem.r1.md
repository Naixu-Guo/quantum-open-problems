---
id: "01M26KNCY5ZMJCE77MG11QCQT6"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["boson-sampling","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Fully polynomial sampling of boson sampling with constant photon transmission"
aliases: ["op-d436ff9fb9cb0ce5","op_d436ff9fb9cb0ce5","01M26KNCY5ZMJCE77MG11QCQT6"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_d436ff9fb9cb0ce5.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_d436ff9fb9cb0ce5","ulid":"01M26KNCY5ZMJCE77MG11QCQT6","aliases":["op_d436ff9fb9cb0ce5","01M26KNCY5ZMJCE77MG11QCQT6","op-d436ff9fb9cb0ce5"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.701Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["boson-sampling","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Fully polynomial sampling of boson sampling with constant photon transmission","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Boson sampling","Computational complexity and computability"],"statement":"For every fixed rational transmission $0<\\eta<1$, is boson sampling with independent photon loss classically samplable in fully polynomial time?\nLet $m\\geq n\\geq1$ and draw $U\\in U(m)$ from normalized Haar measure.\nInject one perfectly indistinguishable photon into each of the first $n$ input modes.\nEach photon survives independently with probability $\\eta$.\nThe photon-counting distribution is\n\\begin{equation}\n p_{\\eta,U}(s)=\n \\sum_{\\substack{T\\subseteq\\{1,\\ldots,n\\}\\\\|T|=|s|}}\n \\eta^{|T|}(1-\\eta)^{n-|T|}\n \\frac{|\\operatorname{Per}(U_{s,T})|^2}{\\prod_{j=1}^{m}s_j!},\n \\quad s\\in\\mathbb N_0^m,\\quad |s|=\\sum_js_j.\n \\label{eq:loss-sampling-law}\n\\end{equation}\nIn Eq.~\\eqref{eq:loss-sampling-law}, $U_{s,T}$ selects columns in $T$ and repeats row $j$ exactly $s_j$ times.\nFor a $k\\times k$ matrix $A$, $\\operatorname{Per}A=\\sum_{\\pi\\in S_k}\\prod_{j=1}^kA_{j,\\pi(j)}$; the empty permanent equals one.\nA randomized classical algorithm receives $n,m,\\varepsilon$ and a finite description of $U$, with $0<\\varepsilon<1$.\nUse $\\operatorname{poly}(n,m,\\log(1/\\varepsilon))$ bits to encode the matrix.\nChoose the precision so that its contribution to total variation is at most $\\varepsilon/2$.\nFor every $n,m,\\varepsilon$, require an output law $q_U$ satisfying\n\\begin{equation}\n \\mathbb E_{U\\sim\\mathrm{Haar}}\\operatorname{TV}(q_U,p_{\\eta,U})\\leq\\varepsilon,\n \\qquad\n \\operatorname{TV}(q,p)=\\frac12\\sum_{s\\in\\mathbb N_0^m}|q(s)-p(s)|.\n \\label{eq:loss-sampling-accuracy}\n\\end{equation}\nCan Eq.~\\eqref{eq:loss-sampling-accuracy} be achieved in time polynomial in $n,m,1/\\varepsilon$ and the binary input length?\nThe polynomial may depend on the fixed $\\eta$, but its exponent cannot depend on $\\varepsilon$.","source":"This fully polynomial, Haar-average formulation refines the constant-transmission gap after Corollary~3 of Oszmaniec and Brod \\sourcecite{ref:loss-ob}{OB18}.\nIt specifies the loss-only model and accuracy dependence; it is not a numbered conjecture of that paper.","progress":["Oszmaniec and Brod, Lemma~1 and Corollary~3, give an efficient sampler with\n\\begin{equation}\n \\operatorname{TV}(q_U,p_{\\eta,U})\n \\leq\\Delta(\\eta,n)\n \\leq\\frac{\\eta^2 n+\\eta(1-\\eta)}2\n \\label{eq:loss-separable-error}\n\\end{equation}\nuniformly in $U$.\nEquation~\\eqref{eq:loss-separable-error} vanishes for $\\eta=o(n^{-1/2})$, while $\\eta$ in the question is fixed \\sourcecite{ref:loss-ob}{OB18}.","The interference-truncation approach discussed by Moylett et al., Sections~II.C--II.D, has a probability-evaluation cost with an exponent depending on the accuracy-dependent cutoff $k$.\nThey also describe negative truncated weights and a Metropolised independence sampler whose training cost depends on the distribution.\nThese statements do not establish the fully polynomial sampling guarantee posed here \\sourcecite{ref:loss-mgrt}{MGRT20}.","Park and Oh's July 2026 revision proves, in Theorem~1 and Eq.~(26), efficient matrix-product-state approximation for transmissions\n$\\eta=O((\\log n/n)^{1/(2\\alpha)})$ with fixed $1/2<\\alpha<1$.\nTheir proof controls all passive interferometers and output bipartitions.\nThis is a regime of vanishing transmission and does not settle fixed $\\eta$ \\sourcecite{ref:loss-po}{PO26}."],"references":[{"key":"OB18","label":"ref:loss-ob","tex":"M. Oszmaniec and D. J. Brod, \"Classical Simulation of Photonic Linear Optics with Lost Particles,\" \\emph{New Journal of Physics} \\textbf{20}, 092002 (2018). \\href{https://doi.org/10.1088/1367-2630/aadfa8}{doi:10.1088/1367-2630/aadfa8}; \\href{https://arxiv.org/abs/1801.06166}{arXiv:1801.06166}."},{"key":"MGRT20","label":"ref:loss-mgrt","tex":"A. E. Moylett, R. Garc\\'ia-Patr\\'on, J. J. Renema, and P. S. Turner, \"Classically Simulating Near-Term Partially-Distinguishable and Lossy Boson Sampling,\" \\emph{Quantum Science and Technology} \\textbf{5}, 015001 (2020). \\href{https://doi.org/10.1088/2058-9565/ab5555}{doi:10.1088/2058-9565/ab5555}; \\href{https://arxiv.org/abs/1907.00022}{arXiv:1907.00022}."},{"key":"PO26","label":"ref:loss-po","tex":"S. Park and C. Oh, \"Matrix Product State Approach to Lossy Boson Sampling and Noisy IQP Sampling,\" arXiv preprint (2025; revised July 2026). \\href{https://arxiv.org/abs/2510.24137v3}{arXiv:2510.24137v3}."}],"comment":"The question concerns perfectly indistinguishable input photons, uniform independent loss, ideal photon counting, and arbitrary mode counts $m\\geq n$.\nA polynomial-time algorithm at each fixed error, with an error-dependent polynomial degree, does not meet the requested runtime.\nBounds for Gaussian input states, restricted-depth circuits, or only a constant number of lost photons have different hypotheses."}}
---
## Source

This fully polynomial, Haar-average formulation refines the constant-transmission gap after Corollary 3 of Oszmaniec and Brod [OB18](https://doi.org/10.1088/1367-2630/aadfa8). It specifies the loss-only model and accuracy dependence; it is not a numbered conjecture of that paper.

## Progress

Oszmaniec and Brod, Lemma 1 and Corollary 3, give an efficient sampler with

$$
\operatorname{TV}(q_U,p_{\eta,U})
 \leq\Delta(\eta,n)
 \leq\frac{\eta^2 n+\eta(1-\eta)}2
\tag{3}
$$

uniformly in $U$. Equation (3) vanishes for $\eta=o(n^{-1/2})$, while $\eta$ in the question is fixed [OB18](https://doi.org/10.1088/1367-2630/aadfa8).

The interference-truncation approach discussed by Moylett et al., Sections II.C–II.D, has a probability-evaluation cost with an exponent depending on the accuracy-dependent cutoff $k$. They also describe negative truncated weights and a Metropolised independence sampler whose training cost depends on the distribution. These statements do not establish the fully polynomial sampling guarantee posed here [MGRT20](https://doi.org/10.1088/2058-9565/ab5555).

Park and Oh’s July 2026 revision proves, in Theorem 1 and Eq. (26), efficient matrix-product-state approximation for transmissions $\eta=O((\log n/n)^{1/(2\alpha)})$ with fixed $1/2<\alpha<1$. Their proof controls all passive interferometers and output bipartitions. This is a regime of vanishing transmission and does not settle fixed $\eta$ [PO26](https://arxiv.org/abs/2510.24137v3).

## Comment

The question concerns perfectly indistinguishable input photons, uniform independent loss, ideal photon counting, and arbitrary mode counts $m\geq n$. A polynomial-time algorithm at each fixed error, with an error-dependent polynomial degree, does not meet the requested runtime. Bounds for Gaussian input states, restricted-depth circuits, or only a constant number of lost photons have different hypotheses.

## References

**OB18** M. Oszmaniec and D. J. Brod, "Classical Simulation of Photonic Linear Optics with Lost Particles," *New Journal of Physics* **20**, 092002 (2018). [doi:10.1088/1367-2630/aadfa8](https://doi.org/10.1088/1367-2630/aadfa8); [arXiv:1801.06166](https://arxiv.org/abs/1801.06166).

**MGRT20** A. E. Moylett, R. García-Patrón, J. J. Renema, and P. S. Turner, "Classically Simulating Near-Term Partially-Distinguishable and Lossy Boson Sampling," *Quantum Science and Technology* **5**, 015001 (2020). [doi:10.1088/2058-9565/ab5555](https://doi.org/10.1088/2058-9565/ab5555); [arXiv:1907.00022](https://arxiv.org/abs/1907.00022).

**PO26** S. Park and C. Oh, "Matrix Product State Approach to Lossy Boson Sampling and Noisy IQP Sampling," arXiv preprint (2025; revised July 2026). [arXiv:2510.24137v3](https://arxiv.org/abs/2510.24137v3).
