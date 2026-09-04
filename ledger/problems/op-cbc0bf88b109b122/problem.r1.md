---
id: "01M1Q787QR701HKYB3YDFJ15TK"
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
topicIds: ["quantum-recovery","quantum-relative-entropy","matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Ordinary-Petz fidelity remainder for relative-entropy data processing"
aliases: ["op-cbc0bf88b109b122","op_cbc0bf88b109b122","01M1Q787QR701HKYB3YDFJ15TK"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_cbc0bf88b109b122.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_cbc0bf88b109b122","ulid":"01M1Q787QR701HKYB3YDFJ15TK","aliases":["op_cbc0bf88b109b122","01M1Q787QR701HKYB3YDFJ15TK","op-cbc0bf88b109b122"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-recovery","quantum-relative-entropy","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Ordinary-Petz fidelity remainder for relative-entropy data processing","status":"Solved","fields":["Quantum Communication"],"topics":["Quantum recovery","Quantum relative entropy","Matrix and entropy inequalities"],"statement":"Does the ordinary Petz recovery map give a universal fidelity remainder for\nmonotonicity of quantum relative entropy?  Let\n$\\mathcal N:\\mathcal L(A)\\to\\mathcal L(B)$ be a finite-dimensional quantum\nchannel, and let $\\rho,\\sigma\\in\\mathcal D(A)$ satisfy\n$\\operatorname{supp}\\rho\\subseteq\\operatorname{supp}\\sigma$.  With inverses\ntaken on the relevant supports, define the Petz map by\n\\begin{equation}\n  \\mathcal P_{\\sigma,\\mathcal N}(X)\n  :=\\sigma^{1/2}\\mathcal N^{\\dagger}\\!\\left(\n      \\mathcal N(\\sigma)^{-1/2}X\n      \\mathcal N(\\sigma)^{-1/2}\n    \\right)\\sigma^{1/2},\n  \\label{eq:p69-petz-map}\n\\end{equation}\nwhere $\\mathcal N^{\\dagger}$ is the Hilbert--Schmidt adjoint.  Write\n$D(\\tau\\Vert\\omega):=\\operatorname{Tr}[\\tau(\\log_2\\tau-\n\\log_2\\omega)]$ and use squared fidelity\n$F(\\tau,\\omega):=\\lVert\\sqrt\\tau\\sqrt\\omega\\rVert_1^2$.  The proposed\nremainder bound for the map in Eq.~\\eqref{eq:p69-petz-map} is\n\\begin{equation}\n  D(\\rho\\Vert\\sigma)\n  -D\\!\\left(\\mathcal N(\\rho)\\middle\\Vert\\mathcal N(\\sigma)\\right)\n  \\stackrel{?}{\\geq}\n  -\\log_2 F\\!\\left(\n    \\rho,\n    \\mathcal P_{\\sigma,\\mathcal N}(\\mathcal N(\\rho))\n  \\right).\n  \\label{eq:p69-petz-remainder}\n\\end{equation}\nDetermine whether Eq.~\\eqref{eq:p69-petz-remainder} holds for every such\ntriple $(\\rho,\\sigma,\\mathcal N)$.","source":"Seshadreesan, Berta, and Wilde explicitly proposed the monotonicity in the\nR\\'enyi parameter whose endpoint consequence is\nEq.~\\eqref{eq:p69-petz-remainder}; Wilde records the same conjectured\nordinary-Petz remainder in Section~12.4\n\\sourcecite{ref:p69-seshadreesan-berta-wilde}{SBW15},\n\\sourcecite{ref:p69-wilde}{Wil17}.","progress":["Bhattacharya disproved Eq.~\\eqref{eq:p69-petz-remainder} using the\n  diagonal pinching channel $\\Phi:M_2(\\mathbb C)\\to M_2(\\mathbb C)$ and the\n  density matrices\n  \\begin{equation}\n    A=\\begin{pmatrix}\n      \\tfrac12&\\tfrac12\\\\\n      \\tfrac12&\\tfrac12\n    \\end{pmatrix},\n    \\qquad\n    B=\\begin{pmatrix}\n      \\tfrac34&-\\tfrac14\\\\\n      -\\tfrac14&\\tfrac14\n    \\end{pmatrix},\n    \\qquad\n    \\Phi(X)=\\sum_{j=0}^{1}|j\\rangle\\!\\langle j|X|j\\rangle\\!\\langle j|.\n    \\label{eq:p69-counterexample}\n  \\end{equation}\n  For $(\\rho,\\sigma,\\mathcal N)=(A,B,\\Phi)$ from\n  Eq.~\\eqref{eq:p69-counterexample}, direct evaluation with\n  natural logarithms and root fidelity gives a data-processing loss of\n  approximately $1.5191$, while the proposed recovery term is approximately\n  $1.5349$.  Since replacing root fidelity by squared fidelity and natural\n  logarithms by base-two logarithms rescales both sides consistently, this is\n  also a counterexample to the convention in\n  Eq.~\\eqref{eq:p69-petz-remainder}\n  \\sourcecite{ref:p69-bhattacharya}{Bha25}.","The counterexample in Eq.~\\eqref{eq:p69-counterexample} also rules out\n  the full R\\'enyi-parameter monotonicity proposed by Seshadreesan, Berta, and\n  Wilde, because that monotonicity implies the false endpoint inequality\n  Eq.~\\eqref{eq:p69-petz-remainder}\n  \\sourcecite{ref:p69-seshadreesan-berta-wilde}{SBW15},\n  \\sourcecite{ref:p69-bhattacharya}{Bha25}."],"references":[{"key":"SBW15","label":"ref:p69-seshadreesan-berta-wilde","tex":"K. P. Seshadreesan, M. Berta, and M. M. Wilde,\n  ``R\\'enyi Squashed Entanglement, Discord, and Relative Entropy\n  Differences,'' \\emph{Journal of Physics A: Mathematical and Theoretical}\n  \\textbf{48}, 395303 (2015).\n  \\href{https://doi.org/10.1088/1751-8113/48/39/395303}{doi:10.1088/1751-8113/48/39/395303};\n  \\href{https://arxiv.org/abs/1410.1443}{arXiv:1410.1443}."},{"key":"Wil17","label":"ref:p69-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~12.4.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"Bha25","label":"ref:p69-bhattacharya","tex":"S. Bhattacharya, ``Approximate Recoverability and the Quantum Data\n  Processing Inequality,'' arXiv preprint (2023), version~3 revised in 2025.\n  \\href{https://arxiv.org/abs/2309.02074v3}{arXiv:2309.02074v3}."}],"comment":"The answer to Eq.~\\eqref{eq:p69-petz-remainder} is negative already in\ndimension two.  This general-channel counterexample does not resolve the\nmore structured conditional-mutual-information inequality in\nProblem~\\ref{sec:problem-70},\nwhere the channel is a partial trace and the reference state is a marginal\nof the state being recovered."}}
---
## Source

Seshadreesan, Berta, and Wilde explicitly proposed the monotonicity in the Rényi parameter whose endpoint consequence is Eq. (2); Wilde records the same conjectured ordinary-Petz remainder in Section 12.4 [SBW15](https://doi.org/10.1088/1751-8113/48/39/395303), [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Bhattacharya disproved Eq. (2) using the diagonal pinching channel $\Phi:M_2(\mathbb C)\to M_2(\mathbb C)$ and the density matrices

$$
A=\begin{pmatrix}
 \tfrac12&\tfrac12\\
 \tfrac12&\tfrac12
 \end{pmatrix},
 \qquad
 B=\begin{pmatrix}
 \tfrac34&-\tfrac14\\
 -\tfrac14&\tfrac14
 \end{pmatrix},
 \qquad
 \Phi(X)=\sum_{j=0}^{1}|j\rangle\!\langle j|X|j\rangle\!\langle j|.
 \tag{3}
$$

For $(\rho,\sigma,\mathcal N)=(A,B,\Phi)$ from Eq. (3), direct evaluation with natural logarithms and root fidelity gives a data-processing loss of approximately $1.5191$, while the proposed recovery term is approximately $1.5349$. Since replacing root fidelity by squared fidelity and natural logarithms by base-two logarithms rescales both sides consistently, this is also a counterexample to the convention in Eq. (2) [Bha25](https://arxiv.org/abs/2309.02074v3).

The counterexample in Eq. (3) also rules out the full Rényi-parameter monotonicity proposed by Seshadreesan, Berta, and Wilde, because that monotonicity implies the false endpoint inequality Eq. (2) [SBW15](https://doi.org/10.1088/1751-8113/48/39/395303), [Bha25](https://arxiv.org/abs/2309.02074v3).

## Comment

The answer to Eq. (2) is negative already in dimension two. This general-channel counterexample does not resolve the more structured conditional-mutual-information inequality in Problem , where the channel is a partial trace and the reference state is a marginal of the state being recovered.

## References

**SBW15** K. P. Seshadreesan, M. Berta, and M. M. Wilde, “Rényi Squashed Entanglement, Discord, and Relative Entropy Differences,” *Journal of Physics A: Mathematical and Theoretical* **48**, 395303 (2015). [doi:10.1088/1751-8113/48/39/395303](https://doi.org/10.1088/1751-8113/48/39/395303); [arXiv:1410.1443](https://arxiv.org/abs/1410.1443).

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 12.4. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**Bha25** S. Bhattacharya, “Approximate Recoverability and the Quantum Data Processing Inequality,” arXiv preprint (2023), version 3 revised in 2025. [arXiv:2309.02074v3](https://arxiv.org/abs/2309.02074v3).
