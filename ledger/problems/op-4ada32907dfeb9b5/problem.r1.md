---
id: "01M8FM931WGMFWA7MD74F0APC4"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T23:25:09.597Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-cost","local-operations-and-classical-communication","entanglement-distillation"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "GHZ distillation rate of a triangle of dephased Bell pairs"
aliases: ["op-4ada32907dfeb9b5","op_4ada32907dfeb9b5","01M8FM931WGMFWA7MD74F0APC4"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_4ada32907dfeb9b5.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_4ada32907dfeb9b5","ulid":"01M8FM931WGMFWA7MD74F0APC4","aliases":["op_4ada32907dfeb9b5","01M8FM931WGMFWA7MD74F0APC4","op-4ada32907dfeb9b5"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-27T23:08:35.772Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-cost","local-operations-and-classical-communication","entanglement-distillation"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"GHZ distillation rate of a triangle of dephased Bell pairs","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement cost","Local operations and classical communication","Entanglement distillation"],"statement":"Alice, Bob, and Charlie share $n$ copies of a triangle of dephased Bell pairs. Let $\\Phi_2$ be the projector onto $(\\ket{00}+\\ket{11})/\\sqrt{2}$ and $\\Phi_2^-$ the projector onto $(\\ket{00}-\\ket{11})/\\sqrt{2}$. An independent phase flip on each edge, with known probability $p$, gives the edge state $\\sigma_p=(1-p)\\Phi_2+p\\Phi_2^-$. The state of one triangle is $\\tau_p=\\sigma_p^{AB}\\otimes\\sigma_p^{BC}\\otimes\\sigma_p^{CA}$. The parties receive only the edge qubits.\n\nFor a proposed rate $r$, the parties aim to distill $\\lfloor rn\\rfloor$ copies of the tripartite GHZ state with vanishing trace-distance error on the full target. Let $\\mathrm{GHZ}_3$ be the projector onto $(\\ket{000}+\\ket{111})/\\sqrt{2}$.\n\nWhat is the optimal LOCC distillation rate $R_\\triangle(p)$ for $0<p<1/2$? The rate is defined by\n\\begin{equation}\n  R_\\triangle(p)=\\sup\\left\\{r\\geq 0:\\lim_{n\\to\\infty}\\inf_{\\Lambda_n\\in\\mathrm{LOCC}}\n  \\tfrac12\\left\\lVert\\Lambda_n\\bigl(\\tau_p^{\\otimes n}\\bigr)\n  -\\mathrm{GHZ}_3^{\\otimes\\lfloor rn\\rfloor}\\right\\rVert_1=0\\right\\}.\n  \\label{eq:deph-triangle-rate}\n\\end{equation}\nIn Eq.~\\eqref{eq:deph-triangle-rate}, the infimum is over LOCC channels with $\\lfloor rn\\rfloor$ output qubits per party. A local phase flip interchanges $p$ and $1-p$ without changing the rate.\n\nGive an achievable rate and a matching converse for arbitrary LOCC for $0<p<1/2$, counting GHZ states per triangle.","source":"This question asks how joint processing of a triangle of independently dephased Bell pairs compares with distilling each link separately. The single-link hashing protocol of Bennett et al. gives a starting point \\sourcecite{ref:feb9b5-bdsw96}{BDSW96} (Section 3.2.3).","progress":["Let $d(p)=1-h_2(p)$, where $h_2$ is the binary entropy in bits. This is the bipartite distillable entanglement of $\\sigma_p$. One-way hashing achieves it \\sourcecite{ref:feb9b5-bdsw96}{BDSW96} (Section 3.2.3), and Rains gives the matching converse for maximally correlated states \\sourcecite{ref:feb9b5-rai01}{Rai01} (Theorem 6.2). The bounds are given in Eq.~\\eqref{eq:deph-triangle-bounds}.\n\\begin{equation}\n  \\tfrac32 d(p)\\leq R_\\triangle(p)\\leq 2d(p).\n  \\label{eq:deph-triangle-bounds}\n\\end{equation}\nFor the lower bound, distill Bell pairs independently on each edge and use the three possible two-edge spanning trees equally often. Two Bell pairs meeting at a vertex give one GHZ state.\n\nFor the upper bound, group Bob and Charlie into one laboratory. Two links cross this cut per triangle, giving $2d(p)$ distillable ebits. Each GHZ state carries one ebit across it."],"references":[{"key":"BDSW96","label":"ref:feb9b5-bdsw96","tex":"C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, W. K. Wootters, “Mixed State Entanglement and Quantum Error Correction”, 1996.\n\\href{https://arxiv.org/abs/quant-ph/9604024}{arXiv:quant-ph/9604024}"},{"key":"Rai01","label":"ref:feb9b5-rai01","tex":"E. M. Rains, “A semidefinite program for distillable entanglement”, 2001.\n\\href{https://arxiv.org/abs/quant-ph/0008047}{arXiv:quant-ph/0008047}"}],"comment":"At $p=0$ the links are perfect and the spanning-tree protocol achieves $3/2$ GHZ states per triangle. At $p=1/2$ every link is separable and $R_\\triangle(1/2)=0$.","contributors":[]}}
---
## Source

This question asks how joint processing of a triangle of independently dephased Bell pairs compares with distilling each link separately. The single-link hashing protocol of Bennett et al. gives a starting point [BDSW96](https://doi.org/10.1103/PhysRevA.54.3824) (Section 3.2.3).

## Progress

Let $d(p)=1-h_2(p)$, where $h_2$ is the binary entropy in bits. This is the bipartite distillable entanglement of $\sigma_p$. One-way hashing achieves it [BDSW96](https://doi.org/10.1103/PhysRevA.54.3824) (Section 3.2.3), and Rains gives the matching converse for maximally correlated states [Rai01](https://doi.org/10.1109/18.959270) (Theorem 6.2). The bounds are given in Eq. (2).

$$
\tfrac32 d(p)\leq R_\triangle(p)\leq 2d(p).
\tag{2}
$$

For the lower bound, distill Bell pairs independently on each edge and use the three possible two-edge spanning trees equally often. Two Bell pairs meeting at a vertex give one GHZ state.

For the upper bound, group Bob and Charlie into one laboratory. Two links cross this cut per triangle, giving $2d(p)$ distillable ebits. Each GHZ state carries one ebit across it.

## Comment

At $p=0$ the links are perfect and the spanning-tree protocol achieves $3/2$ GHZ states per triangle. At $p=1/2$ every link is separable and $R_\triangle(1/2)=0$.

## References

**BDSW96** C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, W. K. Wootters, “Mixed State Entanglement and Quantum Error Correction”, 1996. [arXiv:quant-ph/9604024](https://arxiv.org/abs/quant-ph/9604024)

**Rai01** E. M. Rains, “A semidefinite program for distillable entanglement”, 2001. [arXiv:quant-ph/0008047](https://arxiv.org/abs/quant-ph/0008047)
