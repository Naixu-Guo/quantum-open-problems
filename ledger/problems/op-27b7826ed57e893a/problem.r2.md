---
id: "01M2JDG8GMD6A9Z88MC2195VA6"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-10-08T04:54:06.870Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-cost","local-operations-and-classical-communication"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME780JH0D9Y0RQ750ZZPY","01M2JDG8A02AY84NNNVZ52DD61"]
title: "LOCC entanglement cost of isotropic states"
aliases: ["op-27b7826ed57e893a","op_27b7826ed57e893a","01M2JDG8GMD6A9Z88MC2195VA6"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_27b7826ed57e893a.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_27b7826ed57e893a","ulid":"01M2JDG8GMD6A9Z88MC2195VA6","aliases":["op_27b7826ed57e893a","01M2JDG8GMD6A9Z88MC2195VA6","op-27b7826ed57e893a"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-15T11:33:43.060Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-cost","local-operations-and-classical-communication"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME780JH0D9Y0RQ750ZZPY","01M2JDG8A02AY84NNNVZ52DD61"]},"title":"LOCC entanglement cost of isotropic states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement cost","Local operations and classical communication"],"statement":"What is the entanglement cost of the isotropic state $\\sigma_{d,F}$ for every\ninteger $d\\geq2$ and every fidelity $1/d<F<1$?  On\n$\\mathbb C^d\\otimes\\mathbb C^d$, let\n$\\lvert\\Phi_d\\rangle:=d^{-1/2}\\sum_{j=0}^{d-1}\\lvert jj\\rangle$ and\n$\\Phi_d:=\\lvert\\Phi_d\\rangle\\!\\langle\\Phi_d\\rvert$.  For $F\\in[0,1]$, the\nisotropic state with fidelity $F$ is\n\\begin{equation}\n  \\sigma_{d,F}:=F\\,\\Phi_d+(1-F)\\,\\frac{I-\\Phi_d}{d^2-1}.\n  \\label{eq:27b7-isotropic-state}\n\\end{equation}\nThe state in Eq.~\\eqref{eq:27b7-isotropic-state} is invariant under\n$U\\otimes\\overline U$ for every unitary $U$ on $\\mathbb C^d$, is separable for\n$F\\leq1/d$, and is entangled for $F>1/d$.  The entanglement cost $E_C(\\rho)$\nof a bipartite state $\\rho$ is the infimum of the rates $R$ for which local\noperations and classical communication (LOCC) transform $\\lceil nR\\rceil$\nebits into states whose trace distance from $\\rho^{\\otimes n}$ tends to zero\nas $n\\to\\infty$.  Determine $E_C(\\sigma_{d,F})$ for all integers $d\\geq2$ and\nall $1/d<F<1$, including the qubit case $d=2$.","source":"Wilde identified the entanglement cost of an isotropic state, the Choi state\nof a depolarizing channel, as unknown (Section~IV)\n\\sourcecite{ref:27b7-wilde}{Wil18}, and Fang, Fawzi, and Fawzi likewise identified the general LOCC\nentanglement-cost questions for isotropic and Werner states as unresolved\n(Section~4.2 of the arXiv version)\n\\sourcecite{ref:27b7-fang-fawzi-fawzi}{FFF26}.","progress":["For $F\\leq1/d$, the state is separable and $E_C(\\sigma_{d,F})=0$\n  \\sourcecite{ref:27b7-terhal-vollbrecht}{TV00}.  At $F=1$, it is maximally\n  entangled, and the cost of a pure state is its entanglement entropy, so\n  $E_C(\\sigma_{d,1})=\\log_2d$\n  \\sourcecite{ref:27b7-hayden-horodecki-terhal}{HHT01}.","Rains, in Theorem~7 of the arXiv version~2, evaluates the relative\n  entropy of entanglement with respect to\n  states with positive partial transpose for isotropic states with\n  $F\\geq1/d$, with the separable isotropic state of fidelity $1/d$ as an\n  optimizer, and proves it additive on tensor powers\n  \\sourcecite{ref:27b7-rains}{Rai99}.  Rubboli and Tomamichel prove the same\n  value for the relative entropy of entanglement with respect to separable\n  states, and its additivity whenever one factor is isotropic (Proposition~12\n  and Section~6.3) \\sourcecite{ref:27b7-rubboli-tomamichel}{RT24}.  Hence the\n  regularized separable relative entropy of entanglement is\n  \\begin{equation}\n    E_R^\\infty(\\sigma_{d,F})\n    =\\log_2d+F\\log_2F+(1-F)\\log_2\\frac{1-F}{d-1}\n    \\qquad\\left(\\frac1d\\leq F\\leq1\\right),\n    \\label{eq:27b7-ree}\n  \\end{equation}\n  with $0\\log_20:=0$.  Donald, Horodecki, and Rudolph show that\n  $E_R^\\infty\\leq E_C$ (Proposition~20)\n  \\sourcecite{ref:27b7-donald-horodecki-rudolph}{DHR02}, so\n  Eq.~\\eqref{eq:27b7-ree} is a lower bound on the cost for every $d\\geq2$.","Fang, Fawzi, and Fawzi note that the efficiently computable lower bounds\n  of Wang and Duan and of Lami and Regula vanish on full-rank states\n  (Proposition~24 and Section~4.2), which include $\\sigma_{d,F}$ for\n  $0<F<1$.  In their numerical comparison for $d=3$ (Example~1 and Figure~2),\n  their first-level bound coincides with Eq.~\\eqref{eq:27b7-ree} and improves\n  the bound of Wang, Jing, and Zhu\n  \\sourcecite{ref:27b7-fang-fawzi-fawzi}{FFF26},\n  \\sourcecite{ref:27b7-wang-jing-zhu}{WJZ25}.  These are lower bounds and do\n  not identify an optimal LOCC preparation rate.","The depolarizing channel\n  $\\mathcal D_{d,p}(X):=(1-p)X+p\\operatorname{Tr}(X)I/d$, with\n  $0\\leq p\\leq d^2/(d^2-1)$, has normalized Choi state $\\sigma_{d,F}$, where\n  \\begin{equation}\n    F=1-p+\\frac{p}{d^2},\n    \\qquad\n    0<p<\\frac{d}{d+1}\\iff\\frac1d<F<1 .\n    \\label{eq:27b7-depolarizing}\n  \\end{equation}\n  Since $\\mathcal D_{d,p}(UXU^\\dagger)=U\\,\\mathcal D_{d,p}(X)\\,U^\\dagger$ for\n  every unitary $U$, the channel is covariant in Wilde's sense, and his\n  Theorem~1 gives equal sequential and parallel costs,\n  $E_C(\\mathcal D_{d,p})=E_C^{(p)}(\\mathcal D_{d,p})=E_C(\\sigma_{d,1-p+p/d^2})$\n  \\sourcecite{ref:27b7-wilde}{Wil18}.  The correspondence in\n  Eq.~\\eqref{eq:27b7-depolarizing} was checked directly for this entry.","Fang's preprint, Theorem~7, Eqs.~(39)--(40), settles the qubit case:\n  \\begin{equation}\n    E_C(\\sigma_{2,F})=E_F(\\sigma_{2,F})=\n    \\begin{cases}\n      0, & 0\\leq F\\leq\\tfrac12,\\\\\n      h_2\\!\\left(\\tfrac12+\\sqrt{F(1-F)}\\right), & \\tfrac12<F\\leq1,\n    \\end{cases}\n    \\label{eq:27b7-qubit-cost}\n  \\end{equation}\n  where $h_2(x):=-x\\log_2x-(1-x)\\log_2(1-x)$, with $0\\log_20:=0$.\n  Equation~\\eqref{eq:27b7-qubit-cost} is the isotropic specialization of the\n  Bell-diagonal result \\sourcecite{ref:27b7-fang}{Fan26}.","For $d\\geq3$, Fang's Theorem~8 and Lemma~10 give an additional lower\n  bound.  In the fidelity parameterization of Eq.~\\eqref{eq:27b7-isotropic-state},\n  define\n  \\begin{equation}\n    \\begin{aligned}\n      K_d(r)^3&:=\\max_{0\\leq z\\leq\\sqrt{d-1}}\n        \\frac{1+3r^2z^2+\\dfrac{d-2}{\\sqrt{d-1}}r^3z^3}{(1+z^2)^{3/2}},\\\\\n      \\mathcal B_d(F)&:=\\sup_{0<r\\leq1}\n        \\left[\\log_2d+6(1-F)\\log_2r-6\\log_2K_d(r)\\right].\n    \\end{aligned}\n    \\label{eq:27b7-cubic-bound}\n  \\end{equation}\n  Combining Eq.~\\eqref{eq:27b7-cubic-bound} with the earlier lower bound and\n  the one-copy entanglement of formation $E_F$ gives\n  \\begin{equation}\n    \\max\\{E_R^\\infty(\\sigma_{d,F}),\\mathcal B_d(F)\\}\n      \\leq E_C(\\sigma_{d,F})\\leq E_F(\\sigma_{d,F}),\n    \\qquad \\frac1d<F<1.\n    \\label{eq:27b7-cost-interval}\n  \\end{equation}\n  Proposition~12 explicitly evaluates $\\mathcal B_d(F)$ as the paper's\n  $B_d(2F-1)$.  Corollary~13 proves\n  $\\max_{1/d\\leq F\\leq1}[E_F(\\sigma_{d,F})-\\mathcal B_d(F)]=O(d^{-2/3})$.\n  Figure~2 reports a gap below $2\\%$ of $\\log_2d$ for the scanned dimensions\n  $3\\leq d\\leq10^4$; the exact cost in Eq.~\\eqref{eq:27b7-cost-interval}\n  remains unresolved \\sourcecite{ref:27b7-fang}{Fan26}."],"references":[{"key":"Wil18","label":"ref:27b7-wilde","tex":"M. M. Wilde,\n  ``Entanglement Cost and Quantum Channel Simulation,''\n  \\emph{Physical Review A} \\textbf{98}, 042338 (2018).\n  \\href{https://doi.org/10.1103/PhysRevA.98.042338}{doi:10.1103/PhysRevA.98.042338};\n  \\href{https://arxiv.org/abs/1807.11939}{arXiv:1807.11939}."},{"key":"FFF26","label":"ref:27b7-fang-fawzi-fawzi","tex":"K. Fang, H. Fawzi, and O. Fawzi,\n  ``Efficient Approximation of Regularized Relative Entropies and\n  Applications,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{72}, 2330--2342 (2026).\n  \\href{https://doi.org/10.1109/TIT.2026.3661603}{doi:10.1109/TIT.2026.3661603};\n  \\href{https://arxiv.org/abs/2502.15659}{arXiv:2502.15659}."},{"key":"TV00","label":"ref:27b7-terhal-vollbrecht","tex":"B. M. Terhal and K. G. H. Vollbrecht,\n  ``Entanglement of Formation for Isotropic States,''\n  \\emph{Physical Review Letters} \\textbf{85}, 2625--2628 (2000).\n  \\href{https://doi.org/10.1103/PhysRevLett.85.2625}{doi:10.1103/PhysRevLett.85.2625};\n  \\href{https://arxiv.org/abs/quant-ph/0005062}{arXiv:quant-ph/0005062}."},{"key":"HHT01","label":"ref:27b7-hayden-horodecki-terhal","tex":"P. M. Hayden, M. Horodecki, and B. M. Terhal,\n  ``The Asymptotic Entanglement Cost of Preparing a Quantum State,''\n  \\emph{Journal of Physics A: Mathematical and General} \\textbf{34},\n  6891--6898 (2001).\n  \\href{https://doi.org/10.1088/0305-4470/34/35/314}{doi:10.1088/0305-4470/34/35/314};\n  \\href{https://arxiv.org/abs/quant-ph/0008134}{arXiv:quant-ph/0008134}."},{"key":"Rai99","label":"ref:27b7-rains","tex":"E. M. Rains,\n  ``Bound on Distillable Entanglement,''\n  \\emph{Physical Review A} \\textbf{60}, 179--184 (1999); Erratum,\n  \\emph{Physical Review A} \\textbf{63}, 019902 (2000).\n  \\href{https://doi.org/10.1103/PhysRevA.60.179}{doi:10.1103/PhysRevA.60.179};\n  \\href{https://doi.org/10.1103/PhysRevA.63.019902}{doi:10.1103/PhysRevA.63.019902};\n  \\href{https://arxiv.org/abs/quant-ph/9809082}{arXiv:quant-ph/9809082}."},{"key":"RT24","label":"ref:27b7-rubboli-tomamichel","tex":"R. Rubboli and M. Tomamichel,\n  ``New Additivity Properties of the Relative Entropy of Entanglement and Its\n  Generalizations,''\n  \\emph{Communications in Mathematical Physics} \\textbf{405}, 162 (2024).\n  \\href{https://doi.org/10.1007/s00220-024-05025-3}{doi:10.1007/s00220-024-05025-3};\n  \\href{https://arxiv.org/abs/2211.12804}{arXiv:2211.12804}."},{"key":"DHR02","label":"ref:27b7-donald-horodecki-rudolph","tex":"M. J. Donald, M. Horodecki, and O. Rudolph,\n  ``The Uniqueness Theorem for Entanglement Measures,''\n  \\emph{Journal of Mathematical Physics} \\textbf{43}, 4252--4272 (2002).\n  \\href{https://doi.org/10.1063/1.1495917}{doi:10.1063/1.1495917};\n  \\href{https://arxiv.org/abs/quant-ph/0105017}{arXiv:quant-ph/0105017}."},{"key":"WJZ25","label":"ref:27b7-wang-jing-zhu","tex":"X. Wang, M. Jing, and C. Zhu,\n  ``Computable and Faithful Lower Bound on Entanglement Cost,''\n  \\emph{Physical Review Letters} \\textbf{134}, 190202 (2025).\n  \\href{https://doi.org/10.1103/PhysRevLett.134.190202}{doi:10.1103/PhysRevLett.134.190202};\n  \\href{https://arxiv.org/abs/2311.10649}{arXiv:2311.10649}."},{"key":"Fan26","label":"ref:27b7-fang","tex":"K. Fang, ``Entanglement cost of quantum depolarization,''\n  preprint (2026).\n  \\href{https://arxiv.org/abs/2610.00187v1}{arXiv:2610.00187v1}."}],"comment":"The qubit case is settled by Eq.~\\eqref{eq:27b7-qubit-cost}; the\nremaining task is to determine $E_C(\\sigma_{d,F})$ exactly for $d\\geq3$ and\n$1/d<F<1$.  Equation~\\eqref{eq:27b7-cost-interval} narrows the gap without\nclosing it, so the full problem retains Unsolved status.\nFor $d=2$, $\\sigma_{2,F}$ has Bell weights $F$ and three copies of $(1-F)/3$\nand belongs to the \\href{https://qiqc-op.com/problem/op_aa21ac5ebca8b888/}{resolved qubit Bell-diagonal entanglement-cost problem}.\nIt is locally unitarily equivalent to the $d=2$ state with antisymmetric\nweight $F$ in the \\href{https://qiqc-op.com/problem/op_0c23167deb384894/}{Werner-state entanglement-cost problem};\nthe $U\\otimes\\overline U$-invariant and $U\\otimes U$-invariant families differ\nfor $d\\geq3$.  The channel correspondence in Eq.~\\eqref{eq:27b7-depolarizing}\ntransfers the same exact qubit values and higher-dimensional bounds to\nparallel and sequential depolarizing-channel simulation costs.","contributors":[]}}
---
## Source

Wilde identified the entanglement cost of an isotropic state, the Choi state of a depolarizing channel, as unknown (Section IV) [Wil18](https://doi.org/10.1103/PhysRevA.98.042338), and Fang, Fawzi, and Fawzi likewise identified the general LOCC entanglement-cost questions for isotropic and Werner states as unresolved (Section 4.2 of the arXiv version) [FFF26](https://doi.org/10.1109/TIT.2026.3661603).

## Progress

For $F\leq1/d$, the state is separable and $E_C(\sigma_{d,F})=0$ [TV00](https://doi.org/10.1103/PhysRevLett.85.2625). At $F=1$, it is maximally entangled, and the cost of a pure state is its entanglement entropy, so $E_C(\sigma_{d,1})=\log_2d$ [HHT01](https://doi.org/10.1088/0305-4470/34/35/314).

Rains, in Theorem 7 of the arXiv version 2, evaluates the relative entropy of entanglement with respect to states with positive partial transpose for isotropic states with $F\geq1/d$, with the separable isotropic state of fidelity $1/d$ as an optimizer, and proves it additive on tensor powers [Rai99](https://doi.org/10.1103/PhysRevA.60.179). Rubboli and Tomamichel prove the same value for the relative entropy of entanglement with respect to separable states, and its additivity whenever one factor is isotropic (Proposition 12 and Section 6.3) [RT24](https://doi.org/10.1007/s00220-024-05025-3). Hence the regularized separable relative entropy of entanglement is

$$
E_R^\infty(\sigma_{d,F})
 =\log_2d+F\log_2F+(1-F)\log_2\frac{1-F}{d-1}
 \qquad\left(\frac1d\leq F\leq1\right),
 \tag{2}
$$

with $0\log_20:=0$. Donald, Horodecki, and Rudolph show that $E_R^\infty\leq E_C$ (Proposition 20) [DHR02](https://doi.org/10.1063/1.1495917), so Eq. (2) is a lower bound on the cost for every $d\geq2$.

Fang, Fawzi, and Fawzi note that the efficiently computable lower bounds of Wang and Duan and of Lami and Regula vanish on full-rank states (Proposition 24 and Section 4.2), which include $\sigma_{d,F}$ for $0<F<1$. In their numerical comparison for $d=3$ (Example 1 and Figure 2), their first-level bound coincides with Eq. (2) and improves the bound of Wang, Jing, and Zhu [FFF26](https://doi.org/10.1109/TIT.2026.3661603), [WJZ25](https://doi.org/10.1103/PhysRevLett.134.190202). These are lower bounds and do not identify an optimal LOCC preparation rate.

The depolarizing channel $\mathcal D_{d,p}(X):=(1-p)X+p\operatorname{Tr}(X)I/d$, with $0\leq p\leq d^2/(d^2-1)$, has normalized Choi state $\sigma_{d,F}$, where

$$
F=1-p+\frac{p}{d^2},
 \qquad
 0<p<\frac{d}{d+1}\iff\frac1d<F<1 .
 \tag{3}
$$

Since $\mathcal D_{d,p}(UXU^\dagger)=U\,\mathcal D_{d,p}(X)\,U^\dagger$ for every unitary $U$, the channel is covariant in Wilde’s sense, and his Theorem 1 gives equal sequential and parallel costs, $E_C(\mathcal D_{d,p})=E_C^{(p)}(\mathcal D_{d,p})=E_C(\sigma_{d,1-p+p/d^2})$ [Wil18](https://doi.org/10.1103/PhysRevA.98.042338). The correspondence in Eq. (3) was checked directly for this entry.

Fang’s preprint, Theorem 7, Eqs. (39)–(40), settles the qubit case:

$$
E_C(\sigma_{2,F})=E_F(\sigma_{2,F})=
 \begin{cases}
 0, & 0\leq F\leq\tfrac12,\\
 h_2\!\left(\tfrac12+\sqrt{F(1-F)}\right), & \tfrac12<F\leq1,
 \end{cases}
 \tag{4}
$$

where $h_2(x):=-x\log_2x-(1-x)\log_2(1-x)$, with $0\log_20:=0$. Equation (4) is the isotropic specialization of the Bell-diagonal result [Fan26](https://arxiv.org/abs/2610.00187v1).

For $d\geq3$, Fang’s Theorem 8 and Lemma 10 give an additional lower bound. In the fidelity parameterization of Eq. (1), define

$$
\begin{aligned}
 K_d(r)^3&:=\max_{0\leq z\leq\sqrt{d-1}}
 \frac{1+3r^2z^2+\dfrac{d-2}{\sqrt{d-1}}r^3z^3}{(1+z^2)^{3/2}},\\
 \mathcal B_d(F)&:=\sup_{0<r\leq1}
 \left[\log_2d+6(1-F)\log_2r-6\log_2K_d(r)\right].
 \end{aligned}
 \tag{5}
$$

Combining Eq. (5) with the earlier lower bound and the one-copy entanglement of formation $E_F$ gives

$$
\max\{E_R^\infty(\sigma_{d,F}),\mathcal B_d(F)\}
 \leq E_C(\sigma_{d,F})\leq E_F(\sigma_{d,F}),
 \qquad \frac1d<F<1.
 \tag{6}
$$

Proposition 12 explicitly evaluates $\mathcal B_d(F)$ as the paper’s $B_d(2F-1)$. Corollary 13 proves $\max_{1/d\leq F\leq1}[E_F(\sigma_{d,F})-\mathcal B_d(F)]=O(d^{-2/3})$. Figure 2 reports a gap below $2\%$ of $\log_2d$ for the scanned dimensions $3\leq d\leq10^4$; the exact cost in Eq. (6) remains unresolved [Fan26](https://arxiv.org/abs/2610.00187v1).

## Comment

The qubit case is settled by Eq. (4); the remaining task is to determine $E_C(\sigma_{d,F})$ exactly for $d\geq3$ and $1/d<F<1$. Equation (6) narrows the gap without closing it, so the full problem retains Unsolved status. For $d=2$, $\sigma_{2,F}$ has Bell weights $F$ and three copies of $(1-F)/3$ and belongs to the [resolved qubit Bell-diagonal entanglement-cost problem](https://qiqc-op.com/problem/op_aa21ac5ebca8b888/). It is locally unitarily equivalent to the $d=2$ state with antisymmetric weight $F$ in the [Werner-state entanglement-cost problem](https://qiqc-op.com/problem/op_0c23167deb384894/); the $U\otimes\overline U$-invariant and $U\otimes U$-invariant families differ for $d\geq3$. The channel correspondence in Eq. (3) transfers the same exact qubit values and higher-dimensional bounds to parallel and sequential depolarizing-channel simulation costs.

## References

**Wil18** M. M. Wilde, “Entanglement Cost and Quantum Channel Simulation,” *Physical Review A* **98**, 042338 (2018). [doi:10.1103/PhysRevA.98.042338](https://doi.org/10.1103/PhysRevA.98.042338); [arXiv:1807.11939](https://arxiv.org/abs/1807.11939).

**FFF26** K. Fang, H. Fawzi, and O. Fawzi, “Efficient Approximation of Regularized Relative Entropies and Applications,” *IEEE Transactions on Information Theory* **72**, 2330–2342 (2026). [doi:10.1109/TIT.2026.3661603](https://doi.org/10.1109/TIT.2026.3661603); [arXiv:2502.15659](https://arxiv.org/abs/2502.15659).

**TV00** B. M. Terhal and K. G. H. Vollbrecht, “Entanglement of Formation for Isotropic States,” *Physical Review Letters* **85**, 2625–2628 (2000). [doi:10.1103/PhysRevLett.85.2625](https://doi.org/10.1103/PhysRevLett.85.2625); [arXiv:quant-ph/0005062](https://arxiv.org/abs/quant-ph/0005062).

**HHT01** P. M. Hayden, M. Horodecki, and B. M. Terhal, “The Asymptotic Entanglement Cost of Preparing a Quantum State,” *Journal of Physics A: Mathematical and General* **34**, 6891–6898 (2001). [doi:10.1088/0305-4470/34/35/314](https://doi.org/10.1088/0305-4470/34/35/314); [arXiv:quant-ph/0008134](https://arxiv.org/abs/quant-ph/0008134).

**Rai99** E. M. Rains, “Bound on Distillable Entanglement,” *Physical Review A* **60**, 179–184 (1999); Erratum, *Physical Review A* **63**, 019902 (2000). [doi:10.1103/PhysRevA.60.179](https://doi.org/10.1103/PhysRevA.60.179); [doi:10.1103/PhysRevA.63.019902](https://doi.org/10.1103/PhysRevA.63.019902); [arXiv:quant-ph/9809082](https://arxiv.org/abs/quant-ph/9809082).

**RT24** R. Rubboli and M. Tomamichel, “New Additivity Properties of the Relative Entropy of Entanglement and Its Generalizations,” *Communications in Mathematical Physics* **405**, 162 (2024). [doi:10.1007/s00220-024-05025-3](https://doi.org/10.1007/s00220-024-05025-3); [arXiv:2211.12804](https://arxiv.org/abs/2211.12804).

**DHR02** M. J. Donald, M. Horodecki, and O. Rudolph, “The Uniqueness Theorem for Entanglement Measures,” *Journal of Mathematical Physics* **43**, 4252–4272 (2002). [doi:10.1063/1.1495917](https://doi.org/10.1063/1.1495917); [arXiv:quant-ph/0105017](https://arxiv.org/abs/quant-ph/0105017).

**WJZ25** X. Wang, M. Jing, and C. Zhu, “Computable and Faithful Lower Bound on Entanglement Cost,” *Physical Review Letters* **134**, 190202 (2025). [doi:10.1103/PhysRevLett.134.190202](https://doi.org/10.1103/PhysRevLett.134.190202); [arXiv:2311.10649](https://arxiv.org/abs/2311.10649).

**Fan26** K. Fang, “Entanglement cost of quantum depolarization,” preprint (2026). [arXiv:2610.00187v1](https://arxiv.org/abs/2610.00187v1).
