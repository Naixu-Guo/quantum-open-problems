---
id: "01M2M9FATYE2RPEKTB8430B1WB"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["quantum-thermodynamics","quantum-state-preparation"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Exact constant-bond PEPS mixtures for two-dimensional Gibbs states"
aliases: ["op-eff503a05675844e","op_eff503a05675844e","01M2M9FATYE2RPEKTB8430B1WB"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_eff503a05675844e.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_eff503a05675844e","ulid":"01M2M9FATYE2RPEKTB8430B1WB","aliases":["op_eff503a05675844e","01M2M9FATYE2RPEKTB8430B1WB","op-eff503a05675844e"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.230Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["quantum-thermodynamics","quantum-state-preparation"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Exact constant-bond PEPS mixtures for two-dimensional Gibbs states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Quantum thermodynamics","Quantum state preparation"],"statement":"Is every fixed-temperature Gibbs state of a bounded finite-range qubit Hamiltonian on the square lattice an exact convex combination of PEPS with system-size-independent bond dimension?\n\nLet $\\Lambda$ be a finite rectangular square lattice and $H=\\sum_Xh_X$ satisfy $\\operatorname{diam}(X)\\leq R$ and $\\max_{v\\in\\Lambda}\\sum_{X\\ni v}\\|h_X\\|\\leq J$. Let $\\mathcal P_\\chi(\\Lambda)$ be the normalized pure PEPS on $\\Lambda$ with bond dimension at most $\\chi$.\n\nFor every fixed $0<\\beta<\\infty$, does a finite $\\chi(\\beta,R,J)$ exist, independent of $|\\Lambda|$ and $H$, such that\n\n\\begin{equation}\n\\frac{e^{-\\beta H}}{\\operatorname{Tr}(e^{-\\beta H})}\n\\in\\operatorname{conv}\\{|\\psi\\rangle\\langle\\psi|:\n\\psi\\in\\mathcal P_{\\chi(\\beta,R,J)}(\\Lambda)\\}?\n\\label{eq:eff5-1}\n\\end{equation}\n\nEquation~\\eqref{eq:eff5-1} asks for exact finite convex membership, with no efficiency requirement.","source":"This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature \\sourcecite{ref:eff5-bakshi26}{Bakshi26}; it is not presented as a verbatim conjecture of those authors.","progress":["Provenance: an explicit direction, with a stronger formulation here. Section 4 of \\sourcecite{ref:eff5-bakshi26}{Bakshi26} proposes exact constant-bond PEPS mixtures in temperature ranges extending beyond separability and discusses the challenge at lower temperatures. The all-finite-temperature universal statement above is a precise, stronger research formulation of that direction. It should not be attributed to the authors as an established conjecture.","A more conservative research objective is to establish a nontrivial uniform temperature range beyond the known separable regime, before attempting the universal statement.","Established regimes and latest counterchecks. At sufficiently high temperature, separability already gives bond dimension one. The bounded-degree result \\sourcecite{ref:eff5-bakshi24}{Bakshi24} and the July 2026 weighted long-range extension \\sourcecite{ref:eff5-putterman26}{Putterman26} therefore exclude “existence of some high-temperature constant-bond representation” as an open problem.","In one dimension, exact constant-bond mixtures are now established \\sourcecite{ref:eff5-bakshi26}{Bakshi26}. Older higher-dimensional approximation results, including \\sourcecite{ref:eff5-molnr15}{Molnr15}, allow bond dimension to depend on system size and approximation accuracy. They do not settle the exact uniform statement above."],"references":[{"key":"Bakshi26","label":"ref:eff5-bakshi26","tex":"Ainesh Bakshi, Soonwon Choi, and Saúl Pilatowsky-Cameo, \\emph{Entanglement in quantum spin chains is strictly finite at any temperature}. \\href{https://arxiv.org/abs/2602.13386}{arXiv:2602.13386}, February 13, 2026. Locate: Theorem 2.1 and Section 4, especially “Tightness of the bond dimension” and “Higher dimensions.”"},{"key":"Bakshi24","label":"ref:eff5-bakshi24","tex":"Ainesh Bakshi, Allen Liu, Ankur Moitra, and Ewin Tang, \\emph{High-Temperature Gibbs States are Unentangled and Efficiently Preparable}. \\href{https://arxiv.org/abs/2403.16850}{arXiv:2403.16850}, first submitted March 25, 2024; checked version v2, February 24, 2025. Use: the already solved high-temperature separable regime."},{"key":"Putterman26","label":"ref:eff5-putterman26","tex":"Harald Putterman, Alexander Zlokapa, and Jordan Cotler, \\emph{When quantum thermal states look classical}. \\href{https://arxiv.org/abs/2607.28536}{arXiv:2607.28536}, July 30, 2026. Locate: local-strength definition; Theorem 4; Section 2.6, equation (47); pinned-partition-function counterexamples; separability results."},{"key":"Molnr15","label":"ref:eff5-molnr15","tex":"András Molnár, Norbert Schuch, Frank Verstraete, and J. Ignacio Cirac, \\emph{Approximating Gibbs states of local Hamiltonians efficiently with PEPS}. \\href{https://arxiv.org/abs/1406.2973}{arXiv:1406.2973}; \\href{https://doi.org/10.1103/PhysRevB.91.045138}{Physical Review B 91, 045138 (2015)}. Use: higher-dimensional approximate representations with size/accuracy-dependent bond dimension."}],"comment":"This remains an open research direction with qualified provenance: the literature directly supports the direction, while the universal all-temperature quantifier is a deliberate formulation used here. Neither a general theorem nor a counterexample is known for the displayed formulation.\n\nA rigorous negative answer could take the form of a fixed-$\\beta$ sequence of normalized two-dimensional local Hamiltonians for which the required exact PEPS-mixture bond dimension diverges with system size.","contributors":[]}}
---
## Source

This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature [Bakshi26](https://arxiv.org/abs/2602.13386); it is not presented as a verbatim conjecture of those authors.

## Progress

Provenance: an explicit direction, with a stronger formulation here. Section 4 of [Bakshi26](https://arxiv.org/abs/2602.13386) proposes exact constant-bond PEPS mixtures in temperature ranges extending beyond separability and discusses the challenge at lower temperatures. The all-finite-temperature universal statement above is a precise, stronger research formulation of that direction. It should not be attributed to the authors as an established conjecture.

A more conservative research objective is to establish a nontrivial uniform temperature range beyond the known separable regime, before attempting the universal statement.

Established regimes and latest counterchecks. At sufficiently high temperature, separability already gives bond dimension one. The bounded-degree result [Bakshi24](https://arxiv.org/abs/2403.16850) and the July 2026 weighted long-range extension [Putterman26](https://arxiv.org/abs/2607.28536) therefore exclude “existence of some high-temperature constant-bond representation” as an open problem.

In one dimension, exact constant-bond mixtures are now established [Bakshi26](https://arxiv.org/abs/2602.13386). Older higher-dimensional approximation results, including [Molnr15](https://doi.org/10.1103/PhysRevB.91.045138), allow bond dimension to depend on system size and approximation accuracy. They do not settle the exact uniform statement above.

## Comment

This remains an open research direction with qualified provenance: the literature directly supports the direction, while the universal all-temperature quantifier is a deliberate formulation used here. Neither a general theorem nor a counterexample is known for the displayed formulation.

A rigorous negative answer could take the form of a fixed-$\beta$ sequence of normalized two-dimensional local Hamiltonians for which the required exact PEPS-mixture bond dimension diverges with system size.

## References

**Bakshi26** Ainesh Bakshi, Soonwon Choi, and Saúl Pilatowsky-Cameo, *Entanglement in quantum spin chains is strictly finite at any temperature*. [arXiv:2602.13386](https://arxiv.org/abs/2602.13386), February 13, 2026. Locate: Theorem 2.1 and Section 4, especially “Tightness of the bond dimension” and “Higher dimensions.”

**Bakshi24** Ainesh Bakshi, Allen Liu, Ankur Moitra, and Ewin Tang, *High-Temperature Gibbs States are Unentangled and Efficiently Preparable*. [arXiv:2403.16850](https://arxiv.org/abs/2403.16850), first submitted March 25, 2024; checked version v2, February 24, 2025. Use: the already solved high-temperature separable regime.

**Putterman26** Harald Putterman, Alexander Zlokapa, and Jordan Cotler, *When quantum thermal states look classical*. [arXiv:2607.28536](https://arxiv.org/abs/2607.28536), July 30, 2026. Locate: local-strength definition; Theorem 4; Section 2.6, equation (47); pinned-partition-function counterexamples; separability results.

**Molnr15** András Molnár, Norbert Schuch, Frank Verstraete, and J. Ignacio Cirac, *Approximating Gibbs states of local Hamiltonians efficiently with PEPS*. [arXiv:1406.2973](https://arxiv.org/abs/1406.2973); [Physical Review B 91, 045138 (2015)](https://doi.org/10.1103/PhysRevB.91.045138). Use: higher-dimensional approximate representations with size/accuracy-dependent bond dimension.
