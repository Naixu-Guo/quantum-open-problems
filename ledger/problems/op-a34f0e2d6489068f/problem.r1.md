---
id: "01M1HME7804M1QPND87GJGK3MH"
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
areaIds: ["quantum-measurement-theory","quantum-foundations"]
topicIds: ["bell-nonlocality","convex-optimization","qudit-systems"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Statistical strength of CGLMP measurements"
aliases: ["op-a34f0e2d6489068f","op_a34f0e2d6489068f","01M1HME7804M1QPND87GJGK3MH","v2-statistical-strength-of-cglmp-measurements","open-problem-v2-problem-25"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_a34f0e2d6489068f.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_a34f0e2d6489068f","ulid":"01M1HME7804M1QPND87GJGK3MH","aliases":["op_a34f0e2d6489068f","01M1HME7804M1QPND87GJGK3MH","op-a34f0e2d6489068f","v2-statistical-strength-of-cglmp-measurements","open-problem-v2-problem-25"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-measurement-theory","quantum-foundations"],"topicIds":["bell-nonlocality","convex-optimization","qudit-systems"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Statistical strength of CGLMP measurements","status":"Unsolved","fields":["Quantum measurement theory","Quantum foundations"],"topics":["Bell nonlocality","Convex optimization","Qudit systems"],"statement":"For every $d\\geq3$, do the standard CGLMP Fourier--phase measurements maximize\nthe relative-entropy statistical strength against local realism among all\nprojective $d$-outcome measurements on the fixed state\n$\\lvert\\Phi_d\\rangle=d^{-1/2}\\sum_{j=0}^{d-1}\\lvert j,j\\rangle$, when the\nsetting distribution is also optimized?  For a behavior $p(a,b\\mid x,y)$, a\ndistribution $\\mu(x,y)$ on the four setting pairs, and the local polytope\n$\\mathcal L$, define\n\\begin{equation}\n  S(p;\\mu)\n  :=\\inf_{\\ell\\in\\mathcal L}\n    \\sum_{a,b,x,y}\\mu(x,y)p(a,b\\mid x,y)\n    \\log_2\\!\\frac{p(a,b\\mid x,y)}{\\ell(a,b\\mid x,y)},\n  \\label{eq:p25-statistical-strength}\n\\end{equation}\nSet $S^\\star(p):=\\sup_{\\mu\\in\\Delta(\\{0,1\\}^2)}S(p;\\mu)$; by\nEq.~\\eqref{eq:p25-statistical-strength}, this is the optimized asymptotic\nevidence rate against the best local model.  The candidate bases are\n\\begin{equation}\n  \\begin{aligned}\n    \\lvert a;x\\rangle\n      &=\\frac{1}{\\sqrt d}\\sum_{j=0}^{d-1}\n        \\exp\\!\\left(\\frac{2\\pi i}{d}j(a+\\alpha_x)\\right)\\lvert j\\rangle,\\\\\n    \\lvert b;y\\rangle\n      &=\\frac{1}{\\sqrt d}\\sum_{j=0}^{d-1}\n        \\exp\\!\\left(\\frac{2\\pi i}{d}j(-b+\\beta_y)\\right)\\lvert j\\rangle,\n  \\end{aligned}\n  \\label{eq:p25-cglmp-bases}\n\\end{equation}\nwhere $\\alpha_0=0$, $\\alpha_1=-1/2$, $\\beta_0=1/4$, and $\\beta_1=3/4$.\nLet $p_{\\mathrm{CGLMP}}$ denote the behavior produced on\n$\\lvert\\Phi_d\\rangle$ by the bases in Eq.~\\eqref{eq:p25-cglmp-bases}, and\nwrite $p_M$ for the behavior produced by any other measurement choice $M$ on\n$\\lvert\\Phi_d\\rangle$.  The conjectured optimality of\nEq.~\\eqref{eq:p25-cglmp-bases} is\n\\begin{equation}\n  S^\\star(p_{\\mathrm{CGLMP}})\n  =\\sup_M S^\\star(p_M),\n  \\label{eq:p25-cglmp-statistical-optimum}\n\\end{equation}\nwhere the supremum is over two projective $d$-outcome measurements per party.\nEquation~\\eqref{eq:p25-cglmp-statistical-optimum} is the question to be\nresolved.","source":"Gill explicitly proposes the global statistical-strength optimality of the\nCGLMP measurement construction for a fixed maximally entangled state\n\\sourcecite{ref:p25-gill}{Gil07}.","progress":["Van Dam, Gill, and Grünwald established the operational interpretation\n  of Eq.~\\eqref{eq:p25-statistical-strength} as the asymptotic evidence rate of\n  a Bell experiment and formulated the joint optimization problem\n  \\sourcecite{ref:p25-statistical-strength}{DGG05}.","Acín, Gill, and Gisin numerically found the CGLMP measurement bases for\n  their relative-entropy searches at $d=3$ and $d=4$.  Their globally best\n  state was not maximally entangled, so this does not resolve the fixed-state\n  equality in Eq.~\\eqref{eq:p25-cglmp-statistical-optimum}\n  \\sourcecite{ref:p25-acin}{AGG05}.","Gill reports that numerical searches with the maximally entangled\n  state fixed found only the CGLMP measurements for both Euclidean and\n  relative-entropy criteria, but treats optimality as conjectural; the search\n  does not prove Eq.~\\eqref{eq:p25-cglmp-statistical-optimum} for arbitrary\n  $d$\n  \\sourcecite{ref:p25-gill}{Gil07}."],"references":[{"key":"DGG05","label":"ref:p25-statistical-strength","tex":"W. van Dam, R. D. Gill, and P. D. Grünwald,\n  ``The Statistical Strength of Nonlocality Proofs,''\n  \\emph{IEEE Transactions on Information Theory} \\textbf{51}, 2812--2835\n  (2005).\n  \\href{https://doi.org/10.1109/TIT.2005.851738}{doi:10.1109/TIT.2005.851738};\n  \\href{https://arxiv.org/abs/quant-ph/0307125}{arXiv:quant-ph/0307125}."},{"key":"AGG05","label":"ref:p25-acin","tex":"A. Acín, R. Gill, and N. Gisin,\n  ``Optimal Bell Tests Do Not Require Maximally Entangled States,''\n  \\emph{Physical Review Letters} \\textbf{95}, 210402 (2005).\n  \\href{https://doi.org/10.1103/PhysRevLett.95.210402}{doi:10.1103/PhysRevLett.95.210402};\n  \\href{https://arxiv.org/abs/quant-ph/0506225}{arXiv:quant-ph/0506225}."},{"key":"Gil07","label":"ref:p25-gill","tex":"R. D. Gill, ``Better Bell Inequalities (Passion at a Distance),'' in\n  \\emph{Asymptotics: Particles, Processes and Inverse Problems}, IMS Lecture\n  Notes--Monograph Series \\textbf{55}, 135--148 (2007).\n  \\href{https://doi.org/10.1214/074921707000000328}{doi:10.1214/074921707000000328};\n  \\href{https://arxiv.org/abs/math/0610115}{arXiv:math/0610115}."}],"comment":"The remaining gap is a global proof or counterexample to\nEq.~\\eqref{eq:p25-cglmp-statistical-optimum} for arbitrary $d$.  The shared\nstate is fixed; this differs from joint state--measurement optimization and\nfrom maximizing the linear CGLMP violation in Problem~24."}}
---
## Source

Gill explicitly proposes the global statistical-strength optimality of the CGLMP measurement construction for a fixed maximally entangled state [Gil07](https://doi.org/10.1214/074921707000000328).

## Progress

Van Dam, Gill, and Grünwald established the operational interpretation of Eq. (1) as the asymptotic evidence rate of a Bell experiment and formulated the joint optimization problem [DGG05](https://doi.org/10.1109/TIT.2005.851738).

Acín, Gill, and Gisin numerically found the CGLMP measurement bases for their relative-entropy searches at $d=3$ and $d=4$. Their globally best state was not maximally entangled, so this does not resolve the fixed-state equality in Eq. (3) [AGG05](https://doi.org/10.1103/PhysRevLett.95.210402).

Gill reports that numerical searches with the maximally entangled state fixed found only the CGLMP measurements for both Euclidean and relative-entropy criteria, but treats optimality as conjectural; the search does not prove Eq. (3) for arbitrary $d$ [Gil07](https://doi.org/10.1214/074921707000000328).

## Comment

The remaining gap is a global proof or counterexample to Eq. (3) for arbitrary $d$. The shared state is fixed; this differs from joint state–measurement optimization and from maximizing the linear CGLMP violation in Problem 24.

## References

**DGG05** W. van Dam, R. D. Gill, and P. D. Grünwald, “The Statistical Strength of Nonlocality Proofs,” *IEEE Transactions on Information Theory* **51**, 2812–2835 (2005). [doi:10.1109/TIT.2005.851738](https://doi.org/10.1109/TIT.2005.851738); [arXiv:quant-ph/0307125](https://arxiv.org/abs/quant-ph/0307125).

**AGG05** A. Acín, R. Gill, and N. Gisin, “Optimal Bell Tests Do Not Require Maximally Entangled States,” *Physical Review Letters* **95**, 210402 (2005). [doi:10.1103/PhysRevLett.95.210402](https://doi.org/10.1103/PhysRevLett.95.210402); [arXiv:quant-ph/0506225](https://arxiv.org/abs/quant-ph/0506225).

**Gil07** R. D. Gill, “Better Bell Inequalities (Passion at a Distance),” in *Asymptotics: Particles, Processes and Inverse Problems*, IMS Lecture Notes–Monograph Series **55**, 135–148 (2007). [doi:10.1214/074921707000000328](https://doi.org/10.1214/074921707000000328); [arXiv:math/0610115](https://arxiv.org/abs/math/0610115).
