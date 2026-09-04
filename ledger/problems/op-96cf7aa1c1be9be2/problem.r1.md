---
id: "01M1HME780TJ3Z7X332QY1GWFR"
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
areaIds: ["quantum-communication","quantum-cryptography"]
topicIds: ["position-based-quantum-cryptography","distributed-quantum-computing","quantum-communication-complexity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Polynomial shared-resource lower bounds for routing"
aliases: ["op-96cf7aa1c1be9be2","op_96cf7aa1c1be9be2","01M1HME780TJ3Z7X332QY1GWFR","v2-polynomial-shared-resource-lower-bounds-for-routing","open-problem-v2-problem-38"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_96cf7aa1c1be9be2.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_96cf7aa1c1be9be2","ulid":"01M1HME780TJ3Z7X332QY1GWFR","aliases":["op_96cf7aa1c1be9be2","01M1HME780TJ3Z7X332QY1GWFR","op-96cf7aa1c1be9be2","v2-polynomial-shared-resource-lower-bounds-for-routing","open-problem-v2-problem-38"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication","quantum-cryptography"],"topicIds":["position-based-quantum-cryptography","distributed-quantum-computing","quantum-communication-complexity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Polynomial shared-resource lower bounds for routing","status":"Unsolved","fields":["Quantum communication","Quantum cryptography"],"topics":["Position-based quantum cryptography","Distributed quantum computing","Quantum communication complexity"],"statement":"Does an explicit total Boolean family require polynomial shared-state cost for\nbounded-error one-round $f$-routing?  More precisely, do there exist constants\n$c>0$ and $\\varepsilon>0$ and a sequence\n\\begin{equation}\n  f_n:\\{0,1\\}^n\\times\\{0,1\\}^n\\longrightarrow\\{0,1\\}\n  \\label{eq:p38-boolean-family}\n\\end{equation}\nsuch that one uniform deterministic algorithm computes $f_n(x,y)$ from\n$(n,x,y)$ in time polynomial in $n$, and every routing protocol for the map in\nEq.~\\eqref{eq:p38-boolean-family} with worst-case diamond-norm error at most\n$\\varepsilon$ has cost at least $n^c$?\n\nIn an $f$-routing protocol, Alice receives $x$ and an unknown qubit $Q$, Bob\nreceives $y$, and they may share an arbitrary state $\\rho_{LR}$ before the\ninputs arrive.  After one simultaneous message in each direction, Alice must\nrecover $Q$ when $f(x,y)=0$, and Bob must recover it when $f(x,y)=1$.  Message\nsizes and local operations are unrestricted.  Measure only the shared state\nby\n\\begin{equation}\n  E_{\\mathrm{dim}}(\\rho_{LR})\n  :=\\log_2\\min\\!\\left\\{\n    \\operatorname{rank}\\rho_L,\\operatorname{rank}\\rho_R\n  \\right\\}.\n  \\label{eq:p38-dimension-cost}\n\\end{equation}\nThe target is a family in Eq.~\\eqref{eq:p38-boolean-family} for which every\nvalid protocol satisfies $E_{\\mathrm{dim}}(\\rho_{LR})\\geq n^c$, with the cost\ndefined in Eq.~\\eqref{eq:p38-dimension-cost}.","source":"Bogner explicitly asks for polynomial, or even superlogarithmic for an\nexplicit total family, shared-resource lower bounds for $f$-routing\n\\sourcecite{ref:p38-bogner}{Bog26}.","progress":["Every Boolean function admits an $f$-routing protocol with worst-case\n  shared-resource cost at most\n  \\begin{equation}\n    2^{O(\\sqrt{n\\log n})}.\n    \\label{eq:p38-general-upper-bound}\n  \\end{equation}\n  The construction underlying Eq.~\\eqref{eq:p38-general-upper-bound} also\n  relates routing quantitatively to conditional disclosure of secrets\n  \\sourcecite{ref:p38-allerstorfer}{ABM+24}.","Rank methods give nontrivial lower bounds for explicit functions when\n  one routing case is required to be perfectly correct, but do not establish\n  a polynomial lower bound on Eq.~\\eqref{eq:p38-dimension-cost} in the\n  two-sided bounded-error model \\sourcecite{ref:p38-asadi}{ACM24}.","For the explicit inner-product function, the best robust result is\n  \\begin{equation}\n    f_n(x,y)=\\bigoplus_{i=1}^n x_i y_i,\n    \\qquad\n    d\\log_2(2d)=\\Omega(n),\n    \\qquad\n    E_{\\mathrm{dim}}\\geq\n      \\log_2n-\\log_2\\log_2n-O(1),\n    \\label{eq:p38-inner-product-lower-bound}\n  \\end{equation}\n  where $d=\\min\\{\\operatorname{rank}\\rho_L,\n  \\operatorname{rank}\\rho_R\\}$ and the worst-case error is at most $0.09$\n  \\sourcecite{ref:p38-bogner}{Bog26}.\n  Equation~\\eqref{eq:p38-inner-product-lower-bound} is logarithmic rather than\n  polynomial in the cost measure of Eq.~\\eqref{eq:p38-dimension-cost}."],"references":[{"key":"ABM+24","label":"ref:p38-allerstorfer","tex":"R. Allerstorfer, H. Buhrman, A. May, F. Speelman, and P. Verduyn Lunel,\n  ``Relating Non-Local Quantum Computation to Information Theoretic\n  Cryptography,'' \\emph{Quantum} \\textbf{8}, 1387 (2024).\n  \\href{https://doi.org/10.22331/q-2024-06-27-1387}{doi:10.22331/q-2024-06-27-1387};\n  \\href{https://arxiv.org/abs/2306.16462}{arXiv:2306.16462}."},{"key":"ACM24","label":"ref:p38-asadi","tex":"V. R. Asadi, E. Culf, and A. May, ``Rank Lower Bounds on Non-Local Quantum\n  Computation,'' \\emph{Physical Review A} \\textbf{109}, L061304 (2024).\n  \\href{https://doi.org/10.1103/PhysRevA.109.L061304}{doi:10.1103/PhysRevA.109.L061304};\n  \\href{https://arxiv.org/abs/2402.18647}{arXiv:2402.18647}."},{"key":"Bog26","label":"ref:p38-bogner","tex":"K. Bogner, ``Robust Logarithmic Lower Bound on Shared-Resource Cost for\n  $f$-Routing,'' arXiv:2608.05775v2 (2026).\\newline\n  \\href{https://arxiv.org/abs/2608.05775}{arXiv:2608.05775}."}],"comment":"Bogner explicitly leaves a polynomial lower bound on\nEq.~\\eqref{eq:p38-dimension-cost} open and notes that even a superlogarithmic\nbound for an explicit total family is unknown.  The quantity\n$E_{\\mathrm{dim}}$ is a rank-based shared-resource cost for arbitrary mixed\nstates, not an entanglement monotone."}}
---
## Source

Bogner explicitly asks for polynomial, or even superlogarithmic for an explicit total family, shared-resource lower bounds for $f$-routing [Bog26](https://arxiv.org/abs/2608.05775).

## Progress

Every Boolean function admits an $f$-routing protocol with worst-case shared-resource cost at most

$$
2^{O(\sqrt{n\log n})}.
 \tag{3}
$$

The construction underlying Eq. (3) also relates routing quantitatively to conditional disclosure of secrets [ABM+24](https://doi.org/10.22331/q-2024-06-27-1387).

Rank methods give nontrivial lower bounds for explicit functions when one routing case is required to be perfectly correct, but do not establish a polynomial lower bound on Eq. (2) in the two-sided bounded-error model [ACM24](https://doi.org/10.1103/PhysRevA.109.L061304).

For the explicit inner-product function, the best robust result is

$$
f_n(x,y)=\bigoplus_{i=1}^n x_i y_i,
 \qquad
 d\log_2(2d)=\Omega(n),
 \qquad
 E_{\mathrm{dim}}\geq
 \log_2n-\log_2\log_2n-O(1),
 \tag{4}
$$

where $d=\min\{\operatorname{rank}\rho_L,
 \operatorname{rank}\rho_R\}$ and the worst-case error is at most $0.09$ [Bog26](https://arxiv.org/abs/2608.05775). Equation (4) is logarithmic rather than polynomial in the cost measure of Eq. (2).

## Comment

Bogner explicitly leaves a polynomial lower bound on Eq. (2) open and notes that even a superlogarithmic bound for an explicit total family is unknown. The quantity $E_{\mathrm{dim}}$ is a rank-based shared-resource cost for arbitrary mixed states, not an entanglement monotone.

## References

**ABM+24** R. Allerstorfer, H. Buhrman, A. May, F. Speelman, and P. Verduyn Lunel, “Relating Non-Local Quantum Computation to Information Theoretic Cryptography,” *Quantum* **8**, 1387 (2024). [doi:10.22331/q-2024-06-27-1387](https://doi.org/10.22331/q-2024-06-27-1387); [arXiv:2306.16462](https://arxiv.org/abs/2306.16462).

**ACM24** V. R. Asadi, E. Culf, and A. May, “Rank Lower Bounds on Non-Local Quantum Computation,” *Physical Review A* **109**, L061304 (2024). [doi:10.1103/PhysRevA.109.L061304](https://doi.org/10.1103/PhysRevA.109.L061304); [arXiv:2402.18647](https://arxiv.org/abs/2402.18647).

**Bog26** K. Bogner, “Robust Logarithmic Lower Bound on Shared-Resource Cost for $f$-Routing,” arXiv:2608.05775v2 (2026).
 [arXiv:2608.05775](https://arxiv.org/abs/2608.05775).
