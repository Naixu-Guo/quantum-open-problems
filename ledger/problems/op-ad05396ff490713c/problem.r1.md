---
id: "01M1HME780XSRZ7K9HQJSZ176R"
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
topicIds: ["additivity-and-regularization","quantum-channel-structure","matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Multiplicativity for polarized Werner--Holevo channels"
aliases: ["op-ad05396ff490713c","op_ad05396ff490713c","01M1HME780XSRZ7K9HQJSZ176R","ruskai-2007-werner-holevo-channel-multiplicativity"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_ad05396ff490713c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_ad05396ff490713c","ulid":"01M1HME780XSRZ7K9HQJSZ176R","aliases":["op_ad05396ff490713c","01M1HME780XSRZ7K9HQJSZ176R","op-ad05396ff490713c","ruskai-2007-werner-holevo-channel-multiplicativity"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["additivity-and-regularization","quantum-channel-structure","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Multiplicativity for polarized Werner--Holevo channels","status":"Unsolved","fields":["Quantum Communication"],"topics":["Additivity and regularization","Quantum channel structure","Matrix and entropy inequalities"],"statement":"For every integer $d\\geq3$, every $x\\in(0,1)$, and every $1<p<2$, is the\nmaximal output Schatten $p$-norm of the polarized Werner--Holevo channel\nmultiplicative on two identical copies?  Define the Werner--Holevo channel and\nits polarized interpolation with the identity channel by\n\\begin{equation}\n  \\mathcal W_d(X):=\\frac{\\operatorname{Tr}(X)I_d-X^{\\mathsf T}}{d-1},\n  \\qquad\n  \\Phi_{x,d}:=x\\,\\operatorname{id}_d+(1-x)\\mathcal W_d,\n  \\label{eq:p60-polarized-werner-holevo}\n\\end{equation}\nwhere the transpose in Eq.~\\eqref{eq:p60-polarized-werner-holevo} is taken in\na fixed basis.  For a channel $\\Phi$ with $d$-dimensional input, set\n\\begin{equation}\n  \\lVert A\\rVert_p:=\\bigl(\\operatorname{Tr}\\lvert A\\rvert^p\\bigr)^{1/p},\n  \\qquad\n  \\nu_p(\\Phi):=\\max_{\\rho\\in\\mathcal D(\\mathbb C^d)}\n    \\lVert\\Phi(\\rho)\\rVert_p.\n  \\label{eq:p60-maximal-output-norm}\n\\end{equation}\nWith the convention in Eq.~\\eqref{eq:p60-maximal-output-norm}, determine\nwhether\n\\begin{equation}\n  \\nu_p(\\Phi_{x,d}\\otimes\\Phi_{x,d})\n    =\\nu_p(\\Phi_{x,d})^2\n  \\label{eq:p60-multiplicativity}\n\\end{equation}\nholds throughout the stated parameter range.","source":"Ruskai explicitly asked for Eq.~\\eqref{eq:p60-multiplicativity} for\n$x\\in[0,1]$ and $1\\leq p\\leq2$\n\\sourcecite{ref:p60-ruskai}{Rus07}.  The formulation above removes all regimes\nsettled by the results below.","progress":["For $d=2$, the channel in\n  Eq.~\\eqref{eq:p60-polarized-werner-holevo} is a unital qubit channel, so\n  King's theorem gives multiplicativity with an arbitrary companion for every\n  $p\\geq1$.  The cases $p=1$ and $x=1$ are also immediate from trace\n  preservation and the identity channel, respectively\n  \\sourcecite{ref:p60-king}{Kin02}.","At $x=0$, Datta proved multiplicativity for two Werner--Holevo\n  channels of arbitrary dimensions throughout $1\\leq p\\leq2$.  This settles\n  the unpolarized endpoint but not any $x\\in(0,1)$\n  \\sourcecite{ref:p60-datta}{Dat04}.","Michalakis proved Eq.~\\eqref{eq:p60-multiplicativity} at $p=2$ for\n  every $d\\geq2$ and every $x\\in[0,1]$.  The proof is specific to the output\n  $2$-norm and leaves $1<p<2$ open\n  \\sourcecite{ref:p60-michalakis}{Mic07}."],"references":[{"key":"Rus07","label":"ref:p60-ruskai","tex":"M. B. Ruskai, ``Open Problems in Quantum Information Theory,''\n  arXiv preprint arXiv:0708.1902 (2007).\n  \\newline\n  \\href{https://doi.org/10.48550/arXiv.0708.1902}{doi:10.48550/arXiv.0708.1902};\n  \\href{https://arxiv.org/abs/0708.1902}{arXiv:0708.1902}."},{"key":"Kin02","label":"ref:p60-king","tex":"C. King, ``Additivity for Unital Qubit Channels,''\n  \\emph{Journal of Mathematical Physics} \\textbf{43}, 4641--4653 (2002).\n  \\href{https://doi.org/10.1063/1.1500791}{doi:10.1063/1.1500791};\n  \\href{https://arxiv.org/abs/quant-ph/0103156}{arXiv:quant-ph/0103156}."},{"key":"Dat04","label":"ref:p60-datta","tex":"N. Datta, ``Multiplicativity of Maximal $p$-Norms in Werner--Holevo\n  Channels for $1\\leq p\\leq2$,'' arXiv preprint quant-ph/0410063 (2004).\n  \\href{https://arxiv.org/abs/quant-ph/0410063}{arXiv:quant-ph/0410063}."},{"key":"Mic07","label":"ref:p60-michalakis","tex":"S. Michalakis, ``Multiplicativity of the Maximal Output $2$-Norm for\n  Depolarized Werner--Holevo Channels,''\n  \\emph{Journal of Mathematical Physics} \\textbf{48}, 122102 (2007).\n  \\href{https://doi.org/10.1063/1.2818737}{doi:10.1063/1.2818737};\n  \\href{https://arxiv.org/abs/0707.1722}{arXiv:0707.1722}."}],"comment":"The only unresolved regime of the source problem is precisely\n$d\\geq3$, $x\\in(0,1)$, and $1<p<2$, with two identical copies as in\nEq.~\\eqref{eq:p60-multiplicativity}."}}
---
## Source

Ruskai explicitly asked for Eq. (3) for $x\in[0,1]$ and $1\leq p\leq2$ [Rus07](https://doi.org/10.48550/arXiv.0708.1902). The formulation above removes all regimes settled by the results below.

## Progress

For $d=2$, the channel in Eq. (1) is a unital qubit channel, so King’s theorem gives multiplicativity with an arbitrary companion for every $p\geq1$. The cases $p=1$ and $x=1$ are also immediate from trace preservation and the identity channel, respectively [Kin02](https://doi.org/10.1063/1.1500791).

At $x=0$, Datta proved multiplicativity for two Werner–Holevo channels of arbitrary dimensions throughout $1\leq p\leq2$. This settles the unpolarized endpoint but not any $x\in(0,1)$ [Dat04](https://arxiv.org/abs/quant-ph/0410063).

Michalakis proved Eq. (3) at $p=2$ for every $d\geq2$ and every $x\in[0,1]$. The proof is specific to the output $2$-norm and leaves $1<p<2$ open [Mic07](https://doi.org/10.1063/1.2818737).

## Comment

The only unresolved regime of the source problem is precisely $d\geq3$, $x\in(0,1)$, and $1<p<2$, with two identical copies as in Eq. (3).

## References

**Rus07** M. B. Ruskai, “Open Problems in Quantum Information Theory,” arXiv preprint arXiv:0708.1902 (2007).
 [doi:10.48550/arXiv.0708.1902](https://doi.org/10.48550/arXiv.0708.1902); [arXiv:0708.1902](https://arxiv.org/abs/0708.1902).

**Kin02** C. King, “Additivity for Unital Qubit Channels,” *Journal of Mathematical Physics* **43**, 4641–4653 (2002). [doi:10.1063/1.1500791](https://doi.org/10.1063/1.1500791); [arXiv:quant-ph/0103156](https://arxiv.org/abs/quant-ph/0103156).

**Dat04** N. Datta, “Multiplicativity of Maximal $p$-Norms in Werner–Holevo Channels for $1\leq p\leq2$,” arXiv preprint quant-ph/0410063 (2004). [arXiv:quant-ph/0410063](https://arxiv.org/abs/quant-ph/0410063).

**Mic07** S. Michalakis, “Multiplicativity of the Maximal Output $2$-Norm for Depolarized Werner–Holevo Channels,” *Journal of Mathematical Physics* **48**, 122102 (2007). [doi:10.1063/1.2818737](https://doi.org/10.1063/1.2818737); [arXiv:0707.1722](https://arxiv.org/abs/0707.1722).
