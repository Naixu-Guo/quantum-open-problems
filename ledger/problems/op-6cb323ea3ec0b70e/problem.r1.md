---
id: "01M1HME7808X29G1W7P0AC8QWZ"
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
topicIds: ["matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Trace-exponential lower bound for matrix-word averages"
aliases: ["op-6cb323ea3ec0b70e","op_6cb323ea3ec0b70e","01M1HME7808X29G1W7P0AC8QWZ","v2-trace-exponential-lower-bound-for-matrix-word-averages","open-problem-v2-problem-34"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_6cb323ea3ec0b70e.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_6cb323ea3ec0b70e","ulid":"01M1HME7808X29G1W7P0AC8QWZ","aliases":["op_6cb323ea3ec0b70e","01M1HME7808X29G1W7P0AC8QWZ","op-6cb323ea3ec0b70e","v2-trace-exponential-lower-bound-for-matrix-word-averages","open-problem-v2-problem-34"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Trace-exponential lower bound for matrix-word averages","status":"Unsolved","fields":["Quantum Communication"],"topics":["Matrix and entropy inequalities"],"statement":"Is the normalized trace average of all words in two positive-definite matrices\nalways bounded below by the corresponding trace exponential?  Let\n$A,B\\in M_d(\\mathbb C)$ be positive definite, let $n,m\\geq1$, and let\n$\\mathcal W_{n,m}$ be the set of words containing exactly $n$ letters $A$ and\n$m$ letters $B$.  Define the normalized average by\n\\begin{equation}\n  p_{n,m}(A,B)\n  :=\\frac{1}{\\binom{n+m}{n}}\n    \\sum_{W\\in\\mathcal W_{n,m}}\\operatorname{Tr}W(A,B).\n  \\label{eq:p34-word-average}\n\\end{equation}\nThe question is whether the quantity in Eq.~\\eqref{eq:p34-word-average}\nsatisfies\n\\begin{equation}\n  p_{n,m}(A,B)\n  \\geq \\operatorname{Tr}\\exp\\!\\bigl(n\\log A+m\\log B\\bigr)\n  \\label{eq:p34-trace-exponential-bound}\n\\end{equation}\nfor every finite $d$ and all $n,m\\geq1$.  A positive-semidefinite extension\nis obtained, whenever the limit exists, by applying\nEq.~\\eqref{eq:p34-trace-exponential-bound} to $A+\\varepsilon I$ and\n$B+\\varepsilon I$ and then taking $\\varepsilon\\downarrow0$.","source":"Cha and Lee formulate a two-sided refined BMV inequality and disprove only\nits upper half, leaving the lower trace-exponential comparison stated here\nopen \\sourcecite{ref:p34-cha-lee}{CL26}.","progress":["Equality holds in Eq.~\\eqref{eq:p34-trace-exponential-bound} when\n  $A$ and $B$ commute.  If $n=1$ or $m=1$, cyclicity makes every summand in\n  Eq.~\\eqref{eq:p34-word-average} equal to\n  $\\operatorname{Tr}(A^nB^m)$, and the Golden--Thompson inequality proves\n  Eq.~\\eqref{eq:p34-trace-exponential-bound}\n  \\sourcecite{ref:p34-golden}{Gol65},\n  \\sourcecite{ref:p34-thompson}{Tho65}.  Thus the first unresolved range has\n  $n,m\\geq2$.","The proved Bessis--Moussa--Villani coefficient-positivity theorem\n  implies only $p_{n,m}(A,B)\\geq0$, which is weaker than\n  Eq.~\\eqref{eq:p34-trace-exponential-bound}\n  \\sourcecite{ref:p34-lieb-seiringer}{LS04},\n  \\sourcecite{ref:p34-stahl}{Sta13}.","The original refinement also proposed the distinct upper comparison\n  $\\operatorname{Tr}(A^nB^m)\\geq p_{n,m}(A,B)$.  Cha and Lee disproved that\n  comparison with $3\\times3$ positive-semidefinite matrices at $n=m=5$ and\n  obtained an unbounded ratio\n  $p_{5,5}(A,B)/\\operatorname{Tr}(A^5B^5)$\n  \\sourcecite{ref:p34-cha-lee}{CL26}.  Their construction does not disprove\n  Eq.~\\eqref{eq:p34-trace-exponential-bound}; Dinh's subsequent pinching\n  proposal also concerns a replacement for the failed upper comparison\n  \\sourcecite{ref:p34-dinh}{Din26}."],"references":[{"key":"Gol65","label":"ref:p34-golden","tex":"S. Golden, ``Lower Bounds for the Helmholtz Function,''\n  \\emph{Physical Review} \\textbf{137}, B1127--B1128 (1965).\\newline\n  \\href{https://doi.org/10.1103/PhysRev.137.B1127}{doi:10.1103/PhysRev.137.B1127}."},{"key":"Tho65","label":"ref:p34-thompson","tex":"C. J. Thompson, ``Inequality with Applications in Statistical Mechanics,''\n  \\emph{Journal of Mathematical Physics} \\textbf{6}, 1812--1813 (1965).\n  \\href{https://doi.org/10.1063/1.1704727}{doi:10.1063/1.1704727}."},{"key":"LS04","label":"ref:p34-lieb-seiringer","tex":"E. H. Lieb and R. Seiringer, ``Equivalent Forms of the\n  Bessis--Moussa--Villani Conjecture,'' \\emph{Journal of Statistical Physics}\n  \\textbf{115}, 185--190 (2004).\n  \\href{https://doi.org/10.1023/B:JOSS.0000019811.15510.27}{doi:10.1023/B:JOSS.0000019811.15510.27};\n  \\href{https://arxiv.org/abs/math-ph/0210027}{arXiv:math-ph/0210027}."},{"key":"Sta13","label":"ref:p34-stahl","tex":"H. R. Stahl, ``Proof of the BMV Conjecture,''\n  \\emph{Acta Mathematica} \\textbf{211}, 255--290 (2013).\n  \\href{https://doi.org/10.1007/s11511-013-0104-z}{doi:10.1007/s11511-013-0104-z};\n  \\href{https://arxiv.org/abs/1107.4875}{arXiv:1107.4875}."},{"key":"CL26","label":"ref:p34-cha-lee","tex":"H. Cha and J. Lee, ``One-Parameter Counterexamples to the Refined\n  Bessis--Moussa--Villani Conjecture,'' arXiv:2603.19927v5 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2603.19927}{doi:10.48550/arXiv.2603.19927};\n  \\href{https://arxiv.org/abs/2603.19927v5}{arXiv:2603.19927v5}."},{"key":"Din26","label":"ref:p34-dinh","tex":"T. H. Dinh, ``On the Failure of the Upper Bound in the Refined BMV\n  Conjecture and a Pinching Correction,'' arXiv:2605.17782 (2026).\n  \\href{https://doi.org/10.48550/arXiv.2605.17782}{doi:10.48550/arXiv.2605.17782};\n  \\href{https://arxiv.org/abs/2605.17782}{arXiv:2605.17782}."}],"comment":"Cha and Lee state the two-sided refinement explicitly and disprove only its\nupper half.  The lower comparison in\nEq.~\\eqref{eq:p34-trace-exponential-bound} has neither a general proof nor a\ncounterexample."}}
---
## Source

Cha and Lee formulate a two-sided refined BMV inequality and disprove only its upper half, leaving the lower trace-exponential comparison stated here open [CL26](https://doi.org/10.48550/arXiv.2603.19927).

## Progress

Equality holds in Eq. (2) when $A$ and $B$ commute. If $n=1$ or $m=1$, cyclicity makes every summand in Eq. (1) equal to $\operatorname{Tr}(A^nB^m)$, and the Golden–Thompson inequality proves Eq. (2) [Gol65](https://doi.org/10.1103/PhysRev.137.B1127), [Tho65](https://doi.org/10.1063/1.1704727). Thus the first unresolved range has $n,m\geq2$.

The proved Bessis–Moussa–Villani coefficient-positivity theorem implies only $p_{n,m}(A,B)\geq0$, which is weaker than Eq. (2) [LS04](https://doi.org/10.1023/B:JOSS.0000019811.15510.27), [Sta13](https://doi.org/10.1007/s11511-013-0104-z).

The original refinement also proposed the distinct upper comparison $\operatorname{Tr}(A^nB^m)\geq p_{n,m}(A,B)$. Cha and Lee disproved that comparison with $3\times3$ positive-semidefinite matrices at $n=m=5$ and obtained an unbounded ratio $p_{5,5}(A,B)/\operatorname{Tr}(A^5B^5)$ [CL26](https://doi.org/10.48550/arXiv.2603.19927). Their construction does not disprove Eq. (2); Dinh’s subsequent pinching proposal also concerns a replacement for the failed upper comparison [Din26](https://doi.org/10.48550/arXiv.2605.17782).

## Comment

Cha and Lee state the two-sided refinement explicitly and disprove only its upper half. The lower comparison in Eq. (2) has neither a general proof nor a counterexample.

## References

**Gol65** S. Golden, “Lower Bounds for the Helmholtz Function,” *Physical Review* **137**, B1127–B1128 (1965).
 [doi:10.1103/PhysRev.137.B1127](https://doi.org/10.1103/PhysRev.137.B1127).

**Tho65** C. J. Thompson, “Inequality with Applications in Statistical Mechanics,” *Journal of Mathematical Physics* **6**, 1812–1813 (1965). [doi:10.1063/1.1704727](https://doi.org/10.1063/1.1704727).

**LS04** E. H. Lieb and R. Seiringer, “Equivalent Forms of the Bessis–Moussa–Villani Conjecture,” *Journal of Statistical Physics* **115**, 185–190 (2004). [doi:10.1023/B:JOSS.0000019811.15510.27](https://doi.org/10.1023/B:JOSS.0000019811.15510.27); [arXiv:math-ph/0210027](https://arxiv.org/abs/math-ph/0210027).

**Sta13** H. R. Stahl, “Proof of the BMV Conjecture,” *Acta Mathematica* **211**, 255–290 (2013). [doi:10.1007/s11511-013-0104-z](https://doi.org/10.1007/s11511-013-0104-z); [arXiv:1107.4875](https://arxiv.org/abs/1107.4875).

**CL26** H. Cha and J. Lee, “One-Parameter Counterexamples to the Refined Bessis–Moussa–Villani Conjecture,” arXiv:2603.19927v5 (2026). [doi:10.48550/arXiv.2603.19927](https://doi.org/10.48550/arXiv.2603.19927); [arXiv:2603.19927v5](https://arxiv.org/abs/2603.19927v5).

**Din26** T. H. Dinh, “On the Failure of the Upper Bound in the Refined BMV Conjecture and a Pinching Correction,” arXiv:2605.17782 (2026). [doi:10.48550/arXiv.2605.17782](https://doi.org/10.48550/arXiv.2605.17782); [arXiv:2605.17782](https://arxiv.org/abs/2605.17782).
