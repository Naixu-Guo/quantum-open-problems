---
id: "01M26K8Q5HX6DE9YV54YEM0S9Z"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-metrology"]
topicIds: ["gaussian-quantum-information"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Single-seed post-processing of Gaussian POVM densities"
aliases: ["op-8bb2af22f3465748","op_8bb2af22f3465748","01M26K8Q5HX6DE9YV54YEM0S9Z"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_8bb2af22f3465748.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_8bb2af22f3465748","ulid":"01M26K8Q5HX6DE9YV54YEM0S9Z","aliases":["op_8bb2af22f3465748","01M26K8Q5HX6DE9YV54YEM0S9Z","op-8bb2af22f3465748"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:23:34.193Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["gaussian-quantum-information"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Single-seed post-processing of Gaussian POVM densities","status":"Solved","fields":["Quantum metrology"],"topics":["Gaussian quantum information"],"statement":"Is every POVM with Gaussian density a classical post-processing of one displaced Gaussian seed?\nFix $n\\geq1$ bosonic modes with $[a_j,a_k^\\dagger]=\\delta_{jk}$.\nLet $(X,\\Sigma)$ be a measurable outcome space and $\\mu$ a positive measure.\nLet $x\\mapsto\\tau_x$ be a measurable family of Gaussian density operators.\nAssume $E(B):=\\int_B\\tau_x\\,\\mu(dx)$ defines a POVM and $E(X)=I$, with integrals in the weak operator sense.\nDefine the displacements by Eq.~\\eqref{eq:sr3-displacement}.\n\\begin{equation}\nD(\\alpha):=\\exp\\!\\left(\\sum_{j=1}^n\\alpha_j a_j^\\dagger-\\overline\\alpha_j a_j\\right),\\qquad \\alpha\\in\\mathbb C^n.\n\\label{eq:sr3-displacement}\n\\end{equation}\nThe question asks for a Gaussian density operator $\\tau$ and a Markov probability kernel $K$ satisfying Eq.~\\eqref{eq:sr3-postprocessing}.\nFor each $\\alpha$, $B\\mapsto K(B\\mid\\alpha)$ is a probability measure on $(X,\\Sigma)$.\nFor each $B$, $\\alpha\\mapsto K(B\\mid\\alpha)$ is measurable.\n\\begin{equation}\nE(B)=\\int_{\\mathbb C^n}K(B\\mid\\alpha)D(\\alpha)\\tau D(\\alpha)^\\dagger\\,\\frac{d^{2n}\\alpha}{\\pi^n}\\qquad(B\\in\\Sigma).\n\\label{eq:sr3-postprocessing}\n\\end{equation}","source":"This is an editorial formulation distinguishing Gaussian POVM densities from a single covariant Gaussian observable. Holevo's Secs.~2--3 describe the latter class, including the displaced-seed form in Eq.~(9) and the type-1 construction \\sourcecite{ref:sr3-holevo}{Hol21}. The universal post-processing claim is not attributed to Holevo.","progress":["The answer is negative. For one mode, set $|\\psi_0\\rangle=|0\\rangle$ and $|\\psi_1\\rangle=\\exp[(a^2-a^{\\dagger2})/2]|0\\rangle$. Randomly choose either displaced-seed measurement and retain the choice in the outcome. The density in Eq.~\\eqref{eq:sr3-counterexample} is Gaussian and integrates to $I$.\n\\begin{equation}\nE(j,d^2\\alpha)=\\frac12D(\\alpha)|\\psi_j\\rangle\\langle\\psi_j|D(\\alpha)^\\dagger\\,\\frac{d^2\\alpha}{\\pi},\\qquad j\\in\\{0,1\\}.\n\\label{eq:sr3-counterexample}\n\\end{equation}\nNormalization follows from the covariant seed construction \\sourcecite{ref:sr3-holevo}{Hol21}.","Here is a direct proof that Eq.~\\eqref{eq:sr3-postprocessing} cannot hold for Eq.~\\eqref{eq:sr3-counterexample}. For this counterexample, the outcome spaces are standard Borel. Weighting a putative joint POVM by a faithful state gives a probability measure that admits conditional disintegration. A positive mixture can have a rank-one density only when almost all contributing operators have that same one-dimensional support. Thus a post-processing of a fixed seed could produce these rank-one densities only from displacements of one pure seed. Displacements preserve covariance. The vacuum and squeezed-vacuum densities have different covariance matrices, giving a contradiction. This counterexample and its proof are supplied here, rather than claimed as a theorem of the cited paper."],"references":[{"key":"Hol21","label":"ref:sr3-holevo","tex":"A. S. Holevo, ``The Structure of General Quantum Gaussian Observable,'' \\emph{Proceedings of the Steklov Institute of Mathematics} \\textbf{313}, 70--77 (2021). \\href{https://doi.org/10.1134/S0081543821020085}{doi:10.1134/S0081543821020085}; \\href{https://arxiv.org/abs/2007.02340}{arXiv:2007.02340}."}],"comment":"The explicit counterexample completely resolves this formulation. It is an editorial argument, not a separately peer-reviewed result. A POVM with Gaussian fine-grained densities need not have Gaussian densities after coarse-graining. This distinction does not contradict the published classification of Gaussian observables by their operator characteristic functions."}}
---
## Source

This is an editorial formulation distinguishing Gaussian POVM densities from a single covariant Gaussian observable. Holevo’s Secs. 2–3 describe the latter class, including the displaced-seed form in Eq. (9) and the type-1 construction [Hol21](https://doi.org/10.1134/S0081543821020085). The universal post-processing claim is not attributed to Holevo.

## Progress

The answer is negative. For one mode, set $|\psi_0\rangle=|0\rangle$ and $|\psi_1\rangle=\exp[(a^2-a^{\dagger2})/2]|0\rangle$. Randomly choose either displaced-seed measurement and retain the choice in the outcome. The density in Eq. (3) is Gaussian and integrates to $I$.

$$
E(j,d^2\alpha)=\frac12D(\alpha)|\psi_j\rangle\langle\psi_j|D(\alpha)^\dagger\,\frac{d^2\alpha}{\pi},\qquad j\in\{0,1\}.
\tag{3}
$$

Normalization follows from the covariant seed construction [Hol21](https://doi.org/10.1134/S0081543821020085).

Here is a direct proof that Eq. (2) cannot hold for Eq. (3). For this counterexample, the outcome spaces are standard Borel. Weighting a putative joint POVM by a faithful state gives a probability measure that admits conditional disintegration. A positive mixture can have a rank-one density only when almost all contributing operators have that same one-dimensional support. Thus a post-processing of a fixed seed could produce these rank-one densities only from displacements of one pure seed. Displacements preserve covariance. The vacuum and squeezed-vacuum densities have different covariance matrices, giving a contradiction. This counterexample and its proof are supplied here, rather than claimed as a theorem of the cited paper.

## Comment

The explicit counterexample completely resolves this formulation. It is an editorial argument, not a separately peer-reviewed result. A POVM with Gaussian fine-grained densities need not have Gaussian densities after coarse-graining. This distinction does not contradict the published classification of Gaussian observables by their operator characteristic functions.

## References

**Hol21** A. S. Holevo, “The Structure of General Quantum Gaussian Observable,” *Proceedings of the Steklov Institute of Mathematics* **313**, 70–77 (2021). [doi:10.1134/S0081543821020085](https://doi.org/10.1134/S0081543821020085); [arXiv:2007.02340](https://arxiv.org/abs/2007.02340).
