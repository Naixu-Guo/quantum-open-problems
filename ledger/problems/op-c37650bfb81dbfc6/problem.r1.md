---
id: "01M1Q787QR08CREPZSZYDXBTGN"
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
areaIds: ["entanglement-theory"]
topicIds: ["local-unitary-equivalence","graph-theory","stabilizer-codes","qubit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Minimum LU--LC counterexample for graph states"
aliases: ["op-c37650bfb81dbfc6","op_c37650bfb81dbfc6","01M1Q787QR08CREPZSZYDXBTGN"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_c37650bfb81dbfc6.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_c37650bfb81dbfc6","ulid":"01M1Q787QR08CREPZSZYDXBTGN","aliases":["op_c37650bfb81dbfc6","01M1Q787QR08CREPZSZYDXBTGN","op-c37650bfb81dbfc6"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["local-unitary-equivalence","graph-theory","stabilizer-codes","qubit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Minimum LU--LC counterexample for graph states","status":"Solved","fields":["Entanglement theory"],"topics":["Local unitary equivalence","Graph theory","Stabilizer codes","Qubit systems"],"statement":"What is the least number of qubits for which two graph states can be locally\nunitary equivalent without being locally Clifford equivalent?  For a simple\ngraph $G=(V,E)$ with $V=\\{1,\\ldots,n\\}$, define its graph state by\n\\begin{equation}\n  \\lvert G\\rangle\n  :=\\left(\\prod_{\\{u,v\\}\\in E}\\mathrm{CZ}_{uv}\\right)\n    \\lvert+\\rangle^{\\otimes n},\n  \\qquad\n  \\lvert+\\rangle:=\\frac{\\lvert0\\rangle+\\lvert1\\rangle}{\\sqrt2}.\n  \\label{eq:p48-graph-state}\n\\end{equation}\nFor graphs $G$ and $H$ on $n$ vertices, use the state convention in\nEq.~\\eqref{eq:p48-graph-state} and write\n\\begin{equation}\n  \\begin{aligned}\n    G\\sim_{\\mathrm{LU}}H\n    &\\iff\n      \\lvert H\\rangle=e^{i\\phi}\n      \\left(\\bigotimes_{j=1}^{n}U_j\\right)\\lvert G\\rangle\n      &&\\text{for some }U_j\\in U(2),\\ \\phi\\in\\mathbb R,\\\\\n    G\\sim_{\\mathrm{LC}}H\n    &\\iff\n      \\lvert H\\rangle=e^{i\\theta}\n      \\left(\\bigotimes_{j=1}^{n}C_j\\right)\\lvert G\\rangle\n      &&\\text{for some }C_j\\in\\mathcal C_1,\\ \\theta\\in\\mathbb R,\n  \\end{aligned}\n  \\label{eq:p48-lu-lc-equivalence}\n\\end{equation}\nwhere $\\mathcal C_1$ is the single-qubit Clifford group.  Since\n$\\mathcal C_1\\subset U(2)$, LC equivalence implies LU equivalence.  Define the\nminimum counterexample size by\n\\begin{equation}\n  n_{\\min}\n  :=\\min\\left\\{n:\\text{there exist $n$-vertex graphs $G,H$ with\n  $G\\sim_{\\mathrm{LU}}H$ and $G\\not\\sim_{\\mathrm{LC}}H$}\\right\\}.\n  \\label{eq:p48-minimum-counterexample}\n\\end{equation}\nDetermine the integer in Eq.~\\eqref{eq:p48-minimum-counterexample}.","source":"Kr\\\"uger and Werner record the original conjecture that LU equivalence of\ngraph states always implies LC equivalence\n\\sourcecite{ref:p48-krueger-werner}{KW05}.  After Ji, Chen, Wei, and Ying\nconstructed a 27-qubit counterexample, Claudet isolated and resolved the\nminimum-size question in Eq.~\\eqref{eq:p48-minimum-counterexample}\n\\sourcecite{ref:p48-ji-et-al}{JCWY10},\n\\sourcecite{ref:p48-claudet}{Cla26}.","progress":["Kr\\\"uger and Werner posed the universal implication\n  $G\\sim_{\\mathrm{LU}}H\\Rightarrow G\\sim_{\\mathrm{LC}}H$.  This formulation\n  did not include a minimum counterexample size\n  \\sourcecite{ref:p48-krueger-werner}{KW05}.","Ji, Chen, Wei, and Ying disproved the universal implication by\n  constructing LU-equivalent but non-LC-equivalent graph states on 27 qubits.\n  Their construction proves $n_{\\min}\\leq27$ but does not by itself exclude\n  smaller counterexamples \\sourcecite{ref:p48-ji-et-al}{JCWY10}.","Claudet proved that LU and LC equivalence coincide for every pair of\n  graph states on at most 26 qubits.  Combining this lower bound with the\n  27-qubit construction gives\n  \\begin{equation}\n    n_{\\min}=27.\n    \\label{eq:p48-minimum-resolution}\n  \\end{equation}\n  Thus Eq.~\\eqref{eq:p48-minimum-resolution} resolves the minimum-size problem\n  \\sourcecite{ref:p48-claudet}{Cla26}."],"references":[{"key":"KW05","label":"ref:p48-krueger-werner","tex":"O. Kr\\\"uger and R. F. Werner (eds.),\n  ``Some Open Problems in Quantum Information Theory,''\n  arXiv:quant-ph/0504166 (2005), Problem~28, pp.~70--71.\n  \\href{https://doi.org/10.48550/arXiv.quant-ph/0504166}{doi:10.48550/arXiv.quant-ph/0504166};\n  \\href{https://arxiv.org/abs/quant-ph/0504166}{arXiv:quant-ph/0504166}."},{"key":"JCWY10","label":"ref:p48-ji-et-al","tex":"Z. Ji, J. Chen, Z. Wei, and M. Ying,\n  ``The LU-LC Conjecture Is False,''\n  \\emph{Quantum Information and Computation} \\textbf{10}, 97--108 (2010).\n  \\href{https://doi.org/10.26421/QIC10.1-2-8}{doi:10.26421/QIC10.1-2-8};\n  \\href{https://arxiv.org/abs/0709.1266}{arXiv:0709.1266}."},{"key":"Cla26","label":"ref:p48-claudet","tex":"N. Claudet, ``The 27-qubit Counterexample to the LU-LC Conjecture Is\n  Minimal,'' arXiv:2603.25219v1 (2026).\\newline\n  \\href{https://doi.org/10.48550/arXiv.2603.25219}{doi:10.48550/arXiv.2603.25219};\n  \\href{https://arxiv.org/abs/2603.25219}{arXiv:2603.25219}."}],"comment":"Equation~\\eqref{eq:p48-minimum-resolution} concerns the minimum size at which\nLU and LC equivalence can differ; it does not say that 27 qubits are required\nfor LU--LC equivalence.  The original universal conjecture was already\nresolved negatively by the 27-qubit construction.  As of September 2026, the\nmatching lower bound through 26 qubits is contained in a recent arXiv v1\npreprint, so the archived solved status records its theorem rather than its\npeer-review history."}}
---
## Source

Krüger and Werner record the original conjecture that LU equivalence of graph states always implies LC equivalence [KW05](https://doi.org/10.48550/arXiv.quant-ph/0504166). After Ji, Chen, Wei, and Ying constructed a 27-qubit counterexample, Claudet isolated and resolved the minimum-size question in Eq. (3) [JCWY10](https://doi.org/10.26421/QIC10.1-2-8), [Cla26](https://doi.org/10.48550/arXiv.2603.25219).

## Progress

Krüger and Werner posed the universal implication $G\sim_{\mathrm{LU}}H\Rightarrow G\sim_{\mathrm{LC}}H$. This formulation did not include a minimum counterexample size [KW05](https://doi.org/10.48550/arXiv.quant-ph/0504166).

Ji, Chen, Wei, and Ying disproved the universal implication by constructing LU-equivalent but non-LC-equivalent graph states on 27 qubits. Their construction proves $n_{\min}\leq27$ but does not by itself exclude smaller counterexamples [JCWY10](https://doi.org/10.26421/QIC10.1-2-8).

Claudet proved that LU and LC equivalence coincide for every pair of graph states on at most 26 qubits. Combining this lower bound with the 27-qubit construction gives

$$
n_{\min}=27.
 \tag{4}
$$

Thus Eq. (4) resolves the minimum-size problem [Cla26](https://doi.org/10.48550/arXiv.2603.25219).

## Comment

Equation (4) concerns the minimum size at which LU and LC equivalence can differ; it does not say that 27 qubits are required for LU–LC equivalence. The original universal conjecture was already resolved negatively by the 27-qubit construction. As of September 2026, the matching lower bound through 26 qubits is contained in a recent arXiv v1 preprint, so the archived solved status records its theorem rather than its peer-review history.

## References

**KW05** O. Krüger and R. F. Werner (eds.), “Some Open Problems in Quantum Information Theory,” arXiv:quant-ph/0504166 (2005), Problem 28, pp. 70–71. [doi:10.48550/arXiv.quant-ph/0504166](https://doi.org/10.48550/arXiv.quant-ph/0504166); [arXiv:quant-ph/0504166](https://arxiv.org/abs/quant-ph/0504166).

**JCWY10** Z. Ji, J. Chen, Z. Wei, and M. Ying, “The LU-LC Conjecture Is False,” *Quantum Information and Computation* **10**, 97–108 (2010). [doi:10.26421/QIC10.1-2-8](https://doi.org/10.26421/QIC10.1-2-8); [arXiv:0709.1266](https://arxiv.org/abs/0709.1266).

**Cla26** N. Claudet, “The 27-qubit Counterexample to the LU-LC Conjecture Is Minimal,” arXiv:2603.25219v1 (2026).
 [doi:10.48550/arXiv.2603.25219](https://doi.org/10.48550/arXiv.2603.25219); [arXiv:2603.25219](https://arxiv.org/abs/2603.25219).
