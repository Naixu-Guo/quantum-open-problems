---
id: "01M1Q787QR0M0RT7TK205931W8"
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
areaIds: ["quantum-metrology"]
topicIds: ["quantum-state-discrimination"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Convergence of the JRF iteration for mixed-state discrimination"
aliases: ["op-76e284219621a785","op_76e284219621a785","01M1Q787QR0M0RT7TK205931W8"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_76e284219621a785.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_76e284219621a785","ulid":"01M1Q787QR0M0RT7TK205931W8","aliases":["op_76e284219621a785","01M1Q787QR0M0RT7TK205931W8","op-76e284219621a785"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["quantum-state-discrimination"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Convergence of the JRF iteration for mixed-state discrimination","status":"Unsolved","fields":["Quantum metrology"],"topics":["Quantum state discrimination"],"statement":"Does the Je\\v{z}ek--\\v{R}eh\\'{a}\\v{c}ek--Fiur\\'{a}\\v{s}ek (JRF) iteration,\ninitialized by the uniform POVM, converge to a globally optimal\nminimum-error measurement for every finite ensemble containing mixed quantum\nstates?  Let $m\\geq2$, let $p_i>0$ be prior probabilities, and let $\\rho_i$ be\ndensity operators on a finite-dimensional Hilbert space.  Define\n\\begin{equation}\n  \\xi_i:=p_i\\rho_i,\n  \\qquad\n  \\operatorname{Tr}\\rho_i=1,\n  \\qquad\n  \\sum_{i=1}^{m}p_i=1,\n  \\qquad\n  \\mathcal H_0:=\\operatorname{supp}\\!\\left(\\sum_{i=1}^{m}\\xi_i\\right),\n  \\label{eq:p63-weighted-ensemble}\n\\end{equation}\nwhere at least one $\\rho_i$ has rank greater than one.  On the signal space\n$\\mathcal H_0$ in Eq.~\\eqref{eq:p63-weighted-ensemble}, the optimal guessing\nprobability is\n\\begin{equation}\n  P_{\\mathrm{opt}}\n  :=\\max_{\\substack{\\Pi_i\\succeq0\\\\\n                    \\sum_{i=1}^{m}\\Pi_i=I_{\\mathcal H_0}}}\n       \\sum_{i=1}^{m}\\operatorname{Tr}(\\xi_i\\Pi_i).\n  \\label{eq:p63-optimal-guessing-probability}\n\\end{equation}\nStarting from $\\Pi_i^{(0)}:=I_{\\mathcal H_0}/m$, define the JRF iterates by\n\\begin{equation}\n  \\Lambda_k\n  :=\\left(\\sum_{j=1}^{m}\n       \\xi_j\\Pi_j^{(k)}\\xi_j\\right)^{1/2},\n  \\qquad\n  \\Pi_i^{(k+1)}\n  :=\\Lambda_k^{-1}\\xi_i\\Pi_i^{(k)}\\xi_i\\Lambda_k^{-1}\n  \\quad (i=1,\\ldots,m).\n  \\label{eq:p63-jrf-iteration}\n\\end{equation}\nFor this initialization, $\\Lambda_k$ is inverted on $\\mathcal H_0$ and the\noperators in Eq.~\\eqref{eq:p63-jrf-iteration} form a POVM at every step.\nDetermine whether there always exists an optimal POVM\n$\\{\\Pi_i^\\star\\}_{i=1}^{m}$ attaining\nEq.~\\eqref{eq:p63-optimal-guessing-probability} such that\n\\begin{equation}\n  \\lim_{k\\to\\infty}\n       \\sum_{i=1}^{m}\\lVert\\Pi_i^{(k)}-\\Pi_i^\\star\\rVert_2=0,\n  \\qquad\n  \\lim_{k\\to\\infty}\n       \\sum_{i=1}^{m}\\operatorname{Tr}(\\xi_i\\Pi_i^{(k)})\n       =P_{\\mathrm{opt}},\n  \\label{eq:p63-global-convergence}\n\\end{equation}\nwhere $\\lVert\\cdot\\rVert_2$ is the Hilbert--Schmidt norm.  If\nEq.~\\eqref{eq:p63-global-convergence} fails, construct an explicit\nmixed-state counterexample and characterize its limiting behavior.","source":"Je\\v{z}ek, \\v{R}eh\\'{a}\\v{c}ek, and Fiur\\'{a}\\v{s}ek introduced the\niteration and explicitly reported that its numerically observed global\nconvergence lacked a general proof\n\\sourcecite{ref:p63-jezek-rehacek-fiurasek}{JRF02}.  L\\\"u and Dong proved\nthe pure-state case and explicitly left convergence for general mixed-state\nensembles open \\sourcecite{ref:p63-lu-dong}{LD26}.","progress":["The original work observed monotonic convergence to the global optimum\n  in extensive tests on ensembles of up to four pure or mixed states in\n  dimensions two through four, but supplied neither a proof nor a\n  counterexample for arbitrary ensembles\n  \\sourcecite{ref:p63-jezek-rehacek-fiurasek}{JRF02}.","Tyson's directional-iterate framework proves the general monotonicity\n  bound\n  \\begin{equation}\n    P_k\\leq\\operatorname{Tr}\\Lambda_k\n        \\leq P_{k+1}\\leq P_{\\mathrm{opt}},\n    \\qquad\n    P_k:=\\sum_{i=1}^{m}\\operatorname{Tr}(\\xi_i\\Pi_i^{(k)}),\n    \\label{eq:p63-monotonicity}\n  \\end{equation}\n  which L\\\"u and Dong rederive from a polar decomposition\n  \\sourcecite{ref:p63-tyson}{Tys10},\n  \\sourcecite{ref:p63-lu-dong}{LD26}.  Equation~\\eqref{eq:p63-monotonicity}\n  implies that $P_k$ has a limit, but does not show that the limit equals\n  $P_{\\mathrm{opt}}$ or that the POVM sequence converges.","L\\\"u and Dong prove convergence to an optimal measurement for every\n  pure-state ensemble under a mild support condition satisfied by the uniform\n  initialization in Eq.~\\eqref{eq:p63-jrf-iteration}.  They also obtain a\n  conditional result for a special embedded class of mixed-state ensembles,\n  but explain that their accumulation-point argument does not extend to\n  arbitrary mixed states \\sourcecite{ref:p63-lu-dong}{LD26}."],"references":[{"key":"JRF02","label":"ref:p63-jezek-rehacek-fiurasek","tex":"M. Je\\v{z}ek, J. \\v{R}eh\\'{a}\\v{c}ek, and J. Fiur\\'{a}\\v{s}ek,\n  ``Finding Optimal Strategies for Minimum-Error Quantum-State\n  Discrimination,'' \\emph{Physical Review A} \\textbf{65}, 060301(R) (2002).\n  \\href{https://doi.org/10.1103/PhysRevA.65.060301}{doi:10.1103/PhysRevA.65.060301};\n  \\href{https://arxiv.org/abs/quant-ph/0201109}{arXiv:quant-ph/0201109}."},{"key":"Tys10","label":"ref:p63-tyson","tex":"J. Tyson,\n  ``Two-Sided Bounds on Minimum-Error Quantum Measurement, on the\n  Reversibility of Quantum Dynamics, and on the Maximum Overlap Problem Using\n  Directional Iterates,'' \\emph{Journal of Mathematical Physics} \\textbf{51},\n  092204 (2010).\n  \\href{https://doi.org/10.1063/1.3463451}{doi:10.1063/1.3463451};\n  \\href{https://arxiv.org/abs/0907.3386}{arXiv:0907.3386}."},{"key":"LD26","label":"ref:p63-lu-dong","tex":"X. L\\\"u and S.-H. Dong,\n  ``Iterative Algorithm for Minimum-Error Quantum State Discrimination:\n  Convergence for Pure-State Ensembles,''\n  \\emph{Physical Review A} \\textbf{113}, 022451 (2026).\n  \\href{https://doi.org/10.1103/q7wq-ygm9}{doi:10.1103/q7wq-ygm9}."}],"comment":"The pure-state case is solved.  The remaining issue is whether the uniform\ninitialization prevents nonoptimal accumulation points or nonconvergent\nlast-iterate behavior for arbitrary mixed-state ensembles.  The existence of\nconvergent semidefinite-programming methods for\nEq.~\\eqref{eq:p63-optimal-guessing-probability} does not establish convergence\nof the specific nonlinear map in Eq.~\\eqref{eq:p63-jrf-iteration}."}}
---
## Source

Ježek, Řeháček, and Fiurášek introduced the iteration and explicitly reported that its numerically observed global convergence lacked a general proof [JRF02](https://doi.org/10.1103/PhysRevA.65.060301). Lü and Dong proved the pure-state case and explicitly left convergence for general mixed-state ensembles open [LD26](https://doi.org/10.1103/q7wq-ygm9).

## Progress

The original work observed monotonic convergence to the global optimum in extensive tests on ensembles of up to four pure or mixed states in dimensions two through four, but supplied neither a proof nor a counterexample for arbitrary ensembles [JRF02](https://doi.org/10.1103/PhysRevA.65.060301).

Tyson’s directional-iterate framework proves the general monotonicity bound

$$
P_k\leq\operatorname{Tr}\Lambda_k
 \leq P_{k+1}\leq P_{\mathrm{opt}},
 \qquad
 P_k:=\sum_{i=1}^{m}\operatorname{Tr}(\xi_i\Pi_i^{(k)}),
 \tag{5}
$$

which Lü and Dong rederive from a polar decomposition [Tys10](https://doi.org/10.1063/1.3463451), [LD26](https://doi.org/10.1103/q7wq-ygm9). Equation (5) implies that $P_k$ has a limit, but does not show that the limit equals $P_{\mathrm{opt}}$ or that the POVM sequence converges.

Lü and Dong prove convergence to an optimal measurement for every pure-state ensemble under a mild support condition satisfied by the uniform initialization in Eq. (3). They also obtain a conditional result for a special embedded class of mixed-state ensembles, but explain that their accumulation-point argument does not extend to arbitrary mixed states [LD26](https://doi.org/10.1103/q7wq-ygm9).

## Comment

The pure-state case is solved. The remaining issue is whether the uniform initialization prevents nonoptimal accumulation points or nonconvergent last-iterate behavior for arbitrary mixed-state ensembles. The existence of convergent semidefinite-programming methods for Eq. (2) does not establish convergence of the specific nonlinear map in Eq. (3).

## References

**JRF02** M. Ježek, J. Řeháček, and J. Fiurášek, “Finding Optimal Strategies for Minimum-Error Quantum-State Discrimination,” *Physical Review A* **65**, 060301(R) (2002). [doi:10.1103/PhysRevA.65.060301](https://doi.org/10.1103/PhysRevA.65.060301); [arXiv:quant-ph/0201109](https://arxiv.org/abs/quant-ph/0201109).

**Tys10** J. Tyson, “Two-Sided Bounds on Minimum-Error Quantum Measurement, on the Reversibility of Quantum Dynamics, and on the Maximum Overlap Problem Using Directional Iterates,” *Journal of Mathematical Physics* **51**, 092204 (2010). [doi:10.1063/1.3463451](https://doi.org/10.1063/1.3463451); [arXiv:0907.3386](https://arxiv.org/abs/0907.3386).

**LD26** X. Lü and S.-H. Dong, “Iterative Algorithm for Minimum-Error Quantum State Discrimination: Convergence for Pure-State Ensembles,” *Physical Review A* **113**, 022451 (2026). [doi:10.1103/q7wq-ygm9](https://doi.org/10.1103/q7wq-ygm9).
