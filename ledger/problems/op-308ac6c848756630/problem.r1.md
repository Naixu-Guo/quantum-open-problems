---
id: "01M1HME780GHC51FDW8ZSTJHK9"
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
topicIds: ["symmetric-informationally-complete-measurements"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "SIC-POVM existence in every dimension"
aliases: ["op-308ac6c848756630","op_308ac6c848756630","01M1HME780GHC51FDW8ZSTJHK9","v2-sic-povm-existence-in-every-dimension","open-problem-v2-problem-17"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_308ac6c848756630.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_308ac6c848756630","ulid":"01M1HME780GHC51FDW8ZSTJHK9","aliases":["op_308ac6c848756630","01M1HME780GHC51FDW8ZSTJHK9","op-308ac6c848756630","v2-sic-povm-existence-in-every-dimension","open-problem-v2-problem-17"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-metrology"],"topicIds":["symmetric-informationally-complete-measurements"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"SIC-POVM existence in every dimension","status":"Unsolved","fields":["Quantum metrology"],"topics":["Symmetric informationally complete measurements"],"statement":"Does a symmetric informationally complete positive-operator-valued measure\nexist in every finite dimension $d\\ge2$?  Equivalently, determine whether for\nevery such $d$ there are $d^2$ unit vectors\n$\\lvert\\psi_1\\rangle,\\ldots,\\lvert\\psi_{d^2}\\rangle\\in\\mathbb{C}^d$\nsatisfying\n\\begin{equation}\n  \\sum_{j=1}^{d^2}\n    \\lvert\\psi_j\\rangle\\!\\langle\\psi_j\\rvert=dI_d,\n  \\qquad\n  \\left|\\langle\\psi_j\\vert\\psi_k\\rangle\\right|^2\n    =\\frac{1}{d+1}\n  \\quad\\text{for all }j\\ne k.\n  \\label{eq:p17-sic-conditions}\n\\end{equation}\nWhen Eq.~\\eqref{eq:p17-sic-conditions} holds, the effects\n$\\Pi_j=d^{-1}\\lvert\\psi_j\\rangle\\!\\langle\\psi_j\\rvert$ form the desired\nSIC-POVM.  No covariance or additional symmetry is required.","source":"Renes, Blume-Kohout, Scott, and Caves explicitly conjecture that SIC-POVMs\nexist in every finite dimension \\sourcecite{ref:p17-renes-et-al}{RBS+04}.","progress":["Renes, Blume-Kohout, Scott, and Caves explicitly conjectured existence\n  in every dimension and found Weyl--Heisenberg-covariant numerical solutions\n  through $d=45$.  Numerical solutions do not prove the universal quantifier\n  in Eq.~\\eqref{eq:p17-sic-conditions}\n  \\sourcecite{ref:p17-renes-et-al}{RBS+04}.","Horodecki, Rudnicki, and \\.{Z}yczkowski identify construction of\n  SIC-POVMs in an unbounded sequence of finite dimensions as an intermediate\n  open milestone.  That milestone is implied by the universal statement in\n  Eq.~\\eqref{eq:p17-sic-conditions}, but it remains unproved unconditionally\n  \\sourcecite{ref:p17-horodecki-et-al}{HRZ22}.","Appleby, Bengtsson, Flammia, and Goyeneche reported numerical solutions\n  in every dimension through $d=181$ and in many larger dimensions.  The\n  computations provide extensive evidence but no all-dimensional construction\n  \\sourcecite{ref:p17-appleby-et-al}{ABFG19}.","Appleby, Flammia, and Kopp constructed SICs in every dimension $d>3$\n  conditional on two unproved number-theoretic conjectures.  The conditional\n  hypotheses prevent this result from establishing\n  Eq.~\\eqref{eq:p17-sic-conditions} unconditionally\n  \\sourcecite{ref:p17-appleby-flammia-kopp}{AFK25}.","A claimed unconditional proof posted in $2026$ was withdrawn after\n  the author stated that the proof was incorrect, so it does not change the\n  status of the problem\n  \\sourcecite{ref:p17-joka}{Jok26}."],"references":[{"key":"RBS+04","label":"ref:p17-renes-et-al","tex":"J. M. Renes, R. Blume-Kohout, A. J. Scott, and C. M. Caves,\n  ``Symmetric Informationally Complete Quantum Measurements,''\n  \\emph{Journal of Mathematical Physics} \\textbf{45}, 2171--2180 (2004).\n  \\href{https://doi.org/10.1063/1.1737053}{doi:10.1063/1.1737053};\n  \\href{https://arxiv.org/abs/quant-ph/0310075}{arXiv:quant-ph/0310075}."},{"key":"HRZ22","label":"ref:p17-horodecki-et-al","tex":"P. Horodecki, \\L. Rudnicki, and K. \\.{Z}yczkowski,\n  ``Five Open Problems in Quantum Information Theory,''\n  \\emph{PRX Quantum} \\textbf{3}, 010101 (2022).\n  \\href{https://doi.org/10.1103/PRXQuantum.3.010101}{doi:10.1103/PRXQuantum.3.010101};\n  \\href{https://arxiv.org/abs/2002.03233}{arXiv:2002.03233}."},{"key":"ABFG19","label":"ref:p17-appleby-et-al","tex":"M. Appleby, I. Bengtsson, S. Flammia, and D. Goyeneche,\n  ``Tight Frames, Hadamard Matrices and Zauner's Conjecture,''\n  \\emph{Journal of Physics A: Mathematical and Theoretical} \\textbf{52},\n  295301 (2019).\n  \\href{https://doi.org/10.1088/1751-8121/ab25ad}{doi:10.1088/1751-8121/ab25ad};\n  \\href{https://arxiv.org/abs/1903.06721}{arXiv:1903.06721}."},{"key":"AFK25","label":"ref:p17-appleby-flammia-kopp","tex":"M. Appleby, S. T. Flammia, and G. S. Kopp,\n  ``A Constructive Approach to Zauner's Conjecture via the Stark\n  Conjectures,'' arXiv:2501.03970 (2025).\n  \\href{https://doi.org/10.48550/arXiv.2501.03970}{doi:10.48550/arXiv.2501.03970};\n  \\href{https://arxiv.org/abs/2501.03970}{arXiv:2501.03970}."},{"key":"Jok26","label":"ref:p17-joka","tex":"S. Joka,\n  ``Symmetric Informationally Complete Positive Operator Valued Measure and\n  Zauner Conjecture,'' withdrawn preprint, arXiv:2601.13475v5 (2026).\n  \\href{https://arxiv.org/abs/2601.13475}{arXiv:2601.13475}."}],"comment":"The remaining gap is unconditional existence for every integer $d\\ge2$ in\nEq.~\\eqref{eq:p17-sic-conditions}.  Numerical evidence, covariance-restricted\nconstructions, and results conditional on number-theoretic conjectures do not\nsettle the unrestricted existence question.  The weaker objective of an\nunbounded sequence of finite dimensions is subsumed here as an intermediate\nmilestone rather than maintained as a separate problem."}}
---
## Source

Renes, Blume-Kohout, Scott, and Caves explicitly conjecture that SIC-POVMs exist in every finite dimension [RBS+04](https://doi.org/10.1063/1.1737053).

## Progress

Renes, Blume-Kohout, Scott, and Caves explicitly conjectured existence in every dimension and found Weyl–Heisenberg-covariant numerical solutions through $d=45$. Numerical solutions do not prove the universal quantifier in Eq. (1) [RBS+04](https://doi.org/10.1063/1.1737053).

Horodecki, Rudnicki, and Życzkowski identify construction of SIC-POVMs in an unbounded sequence of finite dimensions as an intermediate open milestone. That milestone is implied by the universal statement in Eq. (1), but it remains unproved unconditionally [HRZ22](https://doi.org/10.1103/PRXQuantum.3.010101).

Appleby, Bengtsson, Flammia, and Goyeneche reported numerical solutions in every dimension through $d=181$ and in many larger dimensions. The computations provide extensive evidence but no all-dimensional construction [ABFG19](https://doi.org/10.1088/1751-8121/ab25ad).

Appleby, Flammia, and Kopp constructed SICs in every dimension $d>3$ conditional on two unproved number-theoretic conjectures. The conditional hypotheses prevent this result from establishing Eq. (1) unconditionally [AFK25](https://doi.org/10.48550/arXiv.2501.03970).

A claimed unconditional proof posted in $2026$ was withdrawn after the author stated that the proof was incorrect, so it does not change the status of the problem [Jok26](https://arxiv.org/abs/2601.13475).

## Comment

The remaining gap is unconditional existence for every integer $d\ge2$ in Eq. (1). Numerical evidence, covariance-restricted constructions, and results conditional on number-theoretic conjectures do not settle the unrestricted existence question. The weaker objective of an unbounded sequence of finite dimensions is subsumed here as an intermediate milestone rather than maintained as a separate problem.

## References

**RBS+04** J. M. Renes, R. Blume-Kohout, A. J. Scott, and C. M. Caves, “Symmetric Informationally Complete Quantum Measurements,” *Journal of Mathematical Physics* **45**, 2171–2180 (2004). [doi:10.1063/1.1737053](https://doi.org/10.1063/1.1737053); [arXiv:quant-ph/0310075](https://arxiv.org/abs/quant-ph/0310075).

**HRZ22** P. Horodecki, Ł. Rudnicki, and K. Życzkowski, “Five Open Problems in Quantum Information Theory,” *PRX Quantum* **3**, 010101 (2022). [doi:10.1103/PRXQuantum.3.010101](https://doi.org/10.1103/PRXQuantum.3.010101); [arXiv:2002.03233](https://arxiv.org/abs/2002.03233).

**ABFG19** M. Appleby, I. Bengtsson, S. Flammia, and D. Goyeneche, “Tight Frames, Hadamard Matrices and Zauner’s Conjecture,” *Journal of Physics A: Mathematical and Theoretical* **52**, 295301 (2019). [doi:10.1088/1751-8121/ab25ad](https://doi.org/10.1088/1751-8121/ab25ad); [arXiv:1903.06721](https://arxiv.org/abs/1903.06721).

**AFK25** M. Appleby, S. T. Flammia, and G. S. Kopp, “A Constructive Approach to Zauner’s Conjecture via the Stark Conjectures,” arXiv:2501.03970 (2025). [doi:10.48550/arXiv.2501.03970](https://doi.org/10.48550/arXiv.2501.03970); [arXiv:2501.03970](https://arxiv.org/abs/2501.03970).

**Jok26** S. Joka, “Symmetric Informationally Complete Positive Operator Valued Measure and Zauner Conjecture,” withdrawn preprint, arXiv:2601.13475v5 (2026). [arXiv:2601.13475](https://arxiv.org/abs/2601.13475).
