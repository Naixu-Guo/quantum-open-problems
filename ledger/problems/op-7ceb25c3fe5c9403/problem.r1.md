---
id: "01M1HME780CAT6PDF6X8ZEV5VP"
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
topicIds: ["entanglement-distillation","entanglement-measures","local-operations-and-classical-communication","qubit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Lockability of two-way distillable entanglement"
aliases: ["op-7ceb25c3fe5c9403","op_7ceb25c3fe5c9403","01M1HME780CAT6PDF6X8ZEV5VP","v2-lockability-of-two-way-distillable-entanglement","open-problem-v2-problem-21"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_7ceb25c3fe5c9403.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_7ceb25c3fe5c9403","ulid":"01M1HME780CAT6PDF6X8ZEV5VP","aliases":["op_7ceb25c3fe5c9403","01M1HME780CAT6PDF6X8ZEV5VP","op-7ceb25c3fe5c9403","v2-lockability-of-two-way-distillable-entanglement","open-problem-v2-problem-21"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["entanglement-theory"],"topicIds":["entanglement-distillation","entanglement-measures","local-operations-and-classical-communication","qubit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Lockability of two-way distillable entanglement","status":"Unsolved","fields":["Entanglement theory"],"topics":["Entanglement distillation","Entanglement measures","Local operations and classical communication","Qubit systems"],"statement":"Can discarding one local qubit reduce two-way distillable entanglement by an\narbitrarily large amount?  Let $D_{\\leftrightarrow}(A:B)_\\rho$ denote the\nasymptotic singlet-distillation rate of $\\rho_{AB}$ under local operations and\nunrestricted two-way classical communication.  The question is whether there\nare finite-dimensional states $\\rho^{(r)}_{A_ra:B_r}$, with $\\dim a=2$, such\nthat\n\\begin{equation}\n  D_{\\leftrightarrow}(A_ra:B_r)_{\\rho^{(r)}}\n  -D_{\\leftrightarrow}(A_r:B_r)_{\\operatorname{Tr}_a\\rho^{(r)}}\n  \\xrightarrow[r\\to\\infty]{}\\infty.\n  \\label{eq:p21-two-way-locking}\n\\end{equation}\nEquation~\\eqref{eq:p21-two-way-locking} requires an unbounded loss while the\ndiscarded subsystem has fixed dimension two.","source":"Horodecki et al. prove lockability of one-way distillable entanglement and\nexplicitly leave the two-way quantity unresolved\n\\sourcecite{ref:p21-locking}{HHHO05}.","progress":["Horodecki, Horodecki, Horodecki, and Oppenheim constructed families\n  in which discarding one qubit causes an unbounded loss of entanglement of\n  formation, entanglement cost, logarithmic negativity, or one-way\n  distillable entanglement.  These results do not establish\n  Eq.~\\eqref{eq:p21-two-way-locking}, which allows unrestricted two-way\n  communication \\sourcecite{ref:p21-locking}{HHHO05}.","The same work proved that discarding one qubit decreases the relative\n  entropy of entanglement by at most two ebits, but explicitly left\n  lockability of unrestricted distillable entanglement open.  No corresponding\n  universal bound is known for $D_{\\leftrightarrow}$\n  \\sourcecite{ref:p21-locking}{HHHO05}."],"references":[{"key":"HHHO05","label":"ref:p21-locking","tex":"K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim,\n  ``Locking Entanglement with a Single Qubit,''\n  \\emph{Physical Review Letters} \\textbf{94}, 200501 (2005).\n  \\href{https://doi.org/10.1103/PhysRevLett.94.200501}{doi:10.1103/PhysRevLett.94.200501};\n  \\href{https://arxiv.org/abs/quant-ph/0404096}{arXiv:quant-ph/0404096}."}],"comment":"The remaining gap is to construct a family satisfying\nEq.~\\eqref{eq:p21-two-way-locking} or prove a dimension-independent upper\nbound on the loss of $D_{\\leftrightarrow}$.  The one-way analogue is already\nknown to be lockable."}}
---
## Source

Horodecki et al. prove lockability of one-way distillable entanglement and explicitly leave the two-way quantity unresolved [HHHO05](https://doi.org/10.1103/PhysRevLett.94.200501).

## Progress

Horodecki, Horodecki, Horodecki, and Oppenheim constructed families in which discarding one qubit causes an unbounded loss of entanglement of formation, entanglement cost, logarithmic negativity, or one-way distillable entanglement. These results do not establish Eq. (1), which allows unrestricted two-way communication [HHHO05](https://doi.org/10.1103/PhysRevLett.94.200501).

The same work proved that discarding one qubit decreases the relative entropy of entanglement by at most two ebits, but explicitly left lockability of unrestricted distillable entanglement open. No corresponding universal bound is known for $D_{\leftrightarrow}$ [HHHO05](https://doi.org/10.1103/PhysRevLett.94.200501).

## Comment

The remaining gap is to construct a family satisfying Eq. (1) or prove a dimension-independent upper bound on the loss of $D_{\leftrightarrow}$. The one-way analogue is already known to be lockable.

## References

**HHHO05** K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim, “Locking Entanglement with a Single Qubit,” *Physical Review Letters* **94**, 200501 (2005). [doi:10.1103/PhysRevLett.94.200501](https://doi.org/10.1103/PhysRevLett.94.200501); [arXiv:quant-ph/0404096](https://arxiv.org/abs/quant-ph/0404096).
