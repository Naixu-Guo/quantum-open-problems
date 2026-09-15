---
id: "01M22MTNSG0TQ51EAG3EFY48JP"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T08:42:44.429Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["entanglement-cost","ppt-preserving-operations","entanglement-measures"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1Q787QRPDH1Y9ADAGSB1AGN"]
title: "Second-level collapse of the exact PPT entanglement-cost hierarchy"
aliases: ["op-2e43f525333b67c0","op_2e43f525333b67c0","01M22MTNSG0TQ51EAG3EFY48JP"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_2e43f525333b67c0.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_2e43f525333b67c0","ulid":"01M22MTNSG0TQ51EAG3EFY48JP","aliases":["op_2e43f525333b67c0","01M22MTNSG0TQ51EAG3EFY48JP","op-2e43f525333b67c0"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T08:33:53.456Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["entanglement-cost","ppt-preserving-operations","entanglement-measures"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1Q787QRPDH1Y9ADAGSB1AGN"]},"title":"Second-level collapse of the exact PPT entanglement-cost hierarchy","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Entanglement cost","PPT-preserving operations","Entanglement measures"],"statement":"Does the semidefinite hierarchy for exact PPT entanglement cost collapse at its second level for every finite-dimensional bipartite density operator $\\rho_{AB}$? Let $\\Gamma=\\operatorname{id}_A\\otimes T_B$ denote partial transpose. For an integer $p\\geq0$, define\n\\begin{equation}\n E_{\\chi,p}(\\rho):=\\log_2\\min_{S_0,\\ldots,S_p}\\left\\{\\operatorname{Tr}S_p:\\ -S_i\\leq S_{i-1}^{\\Gamma}\\leq S_i\\ (0\\leq i\\leq p),\\ S_{-1}=\\rho\\right\\},\n \\label{eq:h9-chi}\n\\end{equation}\nwhere the variables in Eq.~\\eqref{eq:h9-chi} are Hermitian operators on $A\\otimes B$ and the inequalities are in the positive-semidefinite order. Prove or disprove\n\\begin{equation}\n E_{\\chi,3}(\\rho)=E_{\\chi,2}(\\rho)\\qquad\\text{for every }\\rho_{AB}.\n \\label{eq:h9-collapse}\n\\end{equation}\nA counterexample to Eq.~\\eqref{eq:h9-collapse} must establish a strict gap.","source":"Conjecture S33 in the Supplement subsection ``Open problem: hierarchy collapse'' of Lami, Mele, and Regula explicitly poses Eq.~\\eqref{eq:h9-collapse}; their Definition S5 gives Eq.~\\eqref{eq:h9-chi} \\sourcecite{ref:h9-lami}{LMR25}. This is a precise conjecture within the supplied note's broader single-letter PPT-cost question.","progress":["The hierarchy converges to the exact asymptotic PPT entanglement cost. Equality of consecutive levels forces all later levels to coincide, so Eq.~\\eqref{eq:h9-collapse} would identify that cost with $E_{\\chi,2}$; see the Supplement subsection ``Open problem: hierarchy collapse'' \\sourcecite{ref:h9-lami}{LMR25}. Here exact cost means the asymptotic number of maximally entangled qubit pairs per target copy under completely PPT-preserving channels, with zero preparation error at each block length.","The peer-reviewed paper reports numerical evidence for Eq.~\\eqref{eq:h9-collapse}, without a proof or counterexample. Its polynomial-time approximation theorem does not establish finite collapse \\sourcecite{ref:h9-lami}{LMR25}."],"references":[{"key":"LMR25","label":"ref:h9-lami","tex":"L. Lami, F. A. Mele, and B. Regula, ``Computable Entanglement Cost under Positive Partial Transpose Operations,'' \\emph{Physical Review Letters} \\textbf{134}, 090202 (2025). \\href{https://doi.org/10.1103/PhysRevLett.134.090202}{doi:10.1103/PhysRevLett.134.090202}; \\href{https://arxiv.org/abs/2405.09613}{arXiv:2405.09613}."}],"comment":"Audited on 2026-09-09 against the full primary-source supplement and searches for subsequent hierarchy-collapse results; no verified resolution was found. The supplied note's claim of strict separation between the second and third levels is not supported by this source. Exact PPT distillation in catalog record \\texttt{op\\_75b91a20dd384110} concerns extracting entanglement and has a different operational target. The present statement asks a specific universal identity; a negative answer would not exclude another finite-level or single-letter formula."}}
---
## Source

Conjecture S33 in the Supplement subsection “Open problem: hierarchy collapse” of Lami, Mele, and Regula explicitly poses Eq. (2); their Definition S5 gives Eq. (1) [LMR25](https://doi.org/10.1103/PhysRevLett.134.090202). This is a precise conjecture within the supplied note’s broader single-letter PPT-cost question.

## Progress

The hierarchy converges to the exact asymptotic PPT entanglement cost. Equality of consecutive levels forces all later levels to coincide, so Eq. (2) would identify that cost with $E_{\chi,2}$; see the Supplement subsection “Open problem: hierarchy collapse” [LMR25](https://doi.org/10.1103/PhysRevLett.134.090202). Here exact cost means the asymptotic number of maximally entangled qubit pairs per target copy under completely PPT-preserving channels, with zero preparation error at each block length.

The peer-reviewed paper reports numerical evidence for Eq. (2), without a proof or counterexample. Its polynomial-time approximation theorem does not establish finite collapse [LMR25](https://doi.org/10.1103/PhysRevLett.134.090202).

## Comment

Audited on 2026-09-09 against the full primary-source supplement and searches for subsequent hierarchy-collapse results; no verified resolution was found. The supplied note’s claim of strict separation between the second and third levels is not supported by this source. Exact PPT distillation in catalog record `op_75b91a20dd384110` concerns extracting entanglement and has a different operational target. The present statement asks a specific universal identity; a negative answer would not exclude another finite-level or single-letter formula.

## References

**LMR25** L. Lami, F. A. Mele, and B. Regula, “Computable Entanglement Cost under Positive Partial Transpose Operations,” *Physical Review Letters* **134**, 090202 (2025). [doi:10.1103/PhysRevLett.134.090202](https://doi.org/10.1103/PhysRevLett.134.090202); [arXiv:2405.09613](https://arxiv.org/abs/2405.09613).
