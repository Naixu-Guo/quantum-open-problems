---
id: "01M20CXWDYD1RXVWDKFMFM675K"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-08T13:38:52.186Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity-and-computability","quantum-supremacy","random-circuit-sampling"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Average-case approximation hardness of random-circuit output probabilities"
aliases: ["op-94fc1874fe23df16","op_94fc1874fe23df16","01M20CXWDYD1RXVWDKFMFM675K"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_94fc1874fe23df16.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_94fc1874fe23df16","ulid":"01M20CXWDYD1RXVWDKFMFM675K","aliases":["op_94fc1874fe23df16","01M20CXWDYD1RXVWDKFMFM675K","op-94fc1874fe23df16"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-08T11:37:21.086Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity-and-computability","quantum-supremacy","random-circuit-sampling"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Average-case approximation hardness of random-circuit output probabilities","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity and computability","Quantum supremacy","Random circuit sampling"],"statement":"Does there exist a fixed family of $n$-qubit circuit layouts with\n$m=\\operatorname{poly}(n)$ one- and two-qubit gates for which the following\ntask is $\\#\\mathrm{P}$-hard? Choose every gate independently from Haar\nmeasure, obtaining $C$. Given $C$ and $\\epsilon,\\delta\\in(0,1)$, estimate\nthe all-zero output probability with\n\\begin{equation}\n  p_0(C)=|\\langle0^n|C|0^n\\rangle|^2,\\qquad\n  \\Pr_C[|\\widetilde p(C)-p_0(C)|\\leq\\epsilon 2^{-n}]\\geq1-\\delta.\n  \\label{eq:rcs-average-approximation}\n\\end{equation}\nThe guarantee in Eq.~\\eqref{eq:rcs-average-approximation} must hold for\narbitrary $\\epsilon,\\delta$, with running time measured in\n$n,1/\\epsilon,1/\\delta$.","source":"Conjecture 6 of Bouland, Fefferman, Nirkhe, and Vazirani (2018), in its\nformal version in Appendix A.4, using Definition 20 of an average-case\napproximate solution \\sourcecite{ref:rcs-bfnv}{BFNV19}.\nThis is an additive-error probability-estimation conjecture; the parameters\n$\\epsilon,\\delta$ retain the original meaning.","progress":["2018: Taylor truncation gives exact $\\#\\mathrm{P}$-hardness on an $8/9$\nfraction of perturbed, generally nonunitary instances (Theorem 1);\nit does not establish the desired approximation guarantee for Haar gates\n\\sourcecite{ref:rcs-bfnv}{BFNV19}.","2019--2023: Movassagh's Cayley path preserves unitarity and enables rational\ninterpolation, proving exact $\\#\\mathrm{P}$-hardness on a\n$3/4+1/\\operatorname{poly}(n)$ fraction of Haar-random circuits\n(arXiv Theorem 1) \\sourcecite{ref:rcs-movassagh}{Mov23}.","2021: Bouland et al. and, independently, Kondo--Mori--Movassagh obtain\nadditive-error tolerance $2^{-O(m\\log m)}$ with constant failure probability,\nusing $\\mathrm{BPP}^{\\mathrm{NP}}$ reductions\n\\sourcecite{ref:rcs-bfll}{BFLL22}\\sourcecite{ref:rcs-kmm}{KMM22}.","2022: Krovi improves the tolerance to $2^{-O(m)}$ for a constant fraction\nof Haar-random circuits, via $\\mathrm{BPP}$ reductions; the hardness class\nis $\\mathrm{coC}_{=}\\mathrm{P}$, rather than $\\#\\mathrm{P}$\n\\sourcecite{ref:rcs-krovi}{Kro22}.","2025: Bouland et al.'s dilution method gives $\\#\\mathrm{P}$-hardness at\nerror $2^{-n-O(n^\\gamma)}$ for suitable depth-$\\Omega(\\log n)$ RCS ensembles,\nfor every fixed $\\gamma>0$ (Corollary 2, $\\mathrm{BPP}^{\\mathrm{NP}}$ reduction)\n\\sourcecite{ref:rcs-bdfh}{BDFH25}."],"references":[{"key":"BFNV19","label":"ref:rcs-bfnv","tex":"A. Bouland, B. Fefferman, C. Nirkhe, and U. Vazirani,\n\"On the complexity and verification of quantum random circuit sampling,\"\n\\emph{Nature Physics} \\textbf{15}, 159--163 (2019).\n\\href{https://doi.org/10.1038/s41567-018-0318-2}{doi:10.1038/s41567-018-0318-2};\n\\href{https://arxiv.org/abs/1803.04402}{arXiv:1803.04402} (2018 preprint titled\n\"Quantum Supremacy and the Complexity of Random Circuit Sampling\")."},{"key":"Mov23","label":"ref:rcs-movassagh","tex":"R. Movassagh, \"The hardness of random quantum circuits,\"\n\\emph{Nature Physics} \\textbf{19}, 1719--1724 (2023).\n\\href{https://doi.org/10.1038/s41567-023-02131-2}{doi:10.1038/s41567-023-02131-2};\n\\href{https://arxiv.org/abs/1909.06210v4}{arXiv:1909.06210v4}\n(preprint titled \"Quantum supremacy and random circuits\")."},{"key":"BFLL22","label":"ref:rcs-bfll","tex":"A. Bouland, B. Fefferman, Z. Landau, and Y. Liu,\n\"Noise and the frontier of quantum supremacy,\"\nin \\emph{FOCS 2021}, 1308--1317 (2022).\n\\href{https://doi.org/10.1109/FOCS52979.2021.00127}{doi:10.1109/FOCS52979.2021.00127};\n\\href{https://arxiv.org/abs/2102.01738v2}{arXiv:2102.01738v2}."},{"key":"KMM22","label":"ref:rcs-kmm","tex":"Y. Kondo, R. Mori, and R. Movassagh,\n\"Quantum supremacy and hardness of estimating output probabilities of quantum circuits,\"\nin \\emph{FOCS 2021}, 1296--1307 (2022).\n\\href{https://doi.org/10.1109/FOCS52979.2021.00126}{doi:10.1109/FOCS52979.2021.00126};\n\\href{https://arxiv.org/abs/2102.01960v3}{arXiv:2102.01960v3}."},{"key":"Kro22","label":"ref:rcs-krovi","tex":"H. Krovi, \"Average-case hardness of estimating probabilities of random\nquantum circuits with a linear scaling in the error exponent,\"\narXiv preprint (2022).\n\\href{https://doi.org/10.48550/arXiv.2206.05642}{doi:10.48550/arXiv.2206.05642};\n\\href{https://arxiv.org/abs/2206.05642}{arXiv:2206.05642}."},{"key":"BDFH25","label":"ref:rcs-bdfh","tex":"A. Bouland, I. Datta, B. Fefferman, and F. Hernandez,\n\"Exponential improvements to the average-case hardness of BosonSampling,\"\nin \\emph{FOCS 2025}, 912--933 (2025).\n\\href{https://doi.org/10.1109/FOCS63196.2025.00047}{doi:10.1109/FOCS63196.2025.00047};\n\\href{https://arxiv.org/abs/2411.04566v2}{arXiv:2411.04566v2}."}],"comment":"The original approximation conjecture remains open. The 2025 result still\nhas an $O(n^\\gamma)$ loss in the exponent, rather than the $O(\\log n)$\nloss corresponding to error $2^{-n}/\\operatorname{poly}(n)$\n\\sourcecite{ref:rcs-bdfh}{BDFH25}. Exact hardness and smaller additive-error\nhardness do not settle this gap."}}
---
## Source

Conjecture 6 of Bouland, Fefferman, Nirkhe, and Vazirani (2018), in its formal version in Appendix A.4, using Definition 20 of an average-case approximate solution [BFNV19](https://doi.org/10.1038/s41567-018-0318-2). This is an additive-error probability-estimation conjecture; the parameters $\epsilon,\delta$ retain the original meaning.

## Progress

2018: Taylor truncation gives exact $\#\mathrm{P}$-hardness on an $8/9$ fraction of perturbed, generally nonunitary instances (Theorem 1); it does not establish the desired approximation guarantee for Haar gates [BFNV19](https://doi.org/10.1038/s41567-018-0318-2).

2019–2023: Movassagh’s Cayley path preserves unitarity and enables rational interpolation, proving exact $\#\mathrm{P}$-hardness on a $3/4+1/\operatorname{poly}(n)$ fraction of Haar-random circuits (arXiv Theorem 1) [Mov23](https://doi.org/10.1038/s41567-023-02131-2).

2021: Bouland et al. and, independently, Kondo–Mori–Movassagh obtain additive-error tolerance $2^{-O(m\log m)}$ with constant failure probability, using $\mathrm{BPP}^{\mathrm{NP}}$ reductions [BFLL22](https://doi.org/10.1109/FOCS52979.2021.00127)[KMM22](https://doi.org/10.1109/FOCS52979.2021.00126).

2022: Krovi improves the tolerance to $2^{-O(m)}$ for a constant fraction of Haar-random circuits, via $\mathrm{BPP}$ reductions; the hardness class is $\mathrm{coC}_{=}\mathrm{P}$, rather than $\#\mathrm{P}$ [Kro22](https://doi.org/10.48550/arXiv.2206.05642).

2025: Bouland et al.’s dilution method gives $\#\mathrm{P}$-hardness at error $2^{-n-O(n^\gamma)}$ for suitable depth-$\Omega(\log n)$ RCS ensembles, for every fixed $\gamma>0$ (Corollary 2, $\mathrm{BPP}^{\mathrm{NP}}$ reduction) [BDFH25](https://doi.org/10.1109/FOCS63196.2025.00047).

## Comment

The original approximation conjecture remains open. The 2025 result still has an $O(n^\gamma)$ loss in the exponent, rather than the $O(\log n)$ loss corresponding to error $2^{-n}/\operatorname{poly}(n)$ [BDFH25](https://doi.org/10.1109/FOCS63196.2025.00047). Exact hardness and smaller additive-error hardness do not settle this gap.

## References

**BFNV19** A. Bouland, B. Fefferman, C. Nirkhe, and U. Vazirani, "On the complexity and verification of quantum random circuit sampling," *Nature Physics* **15**, 159–163 (2019). [doi:10.1038/s41567-018-0318-2](https://doi.org/10.1038/s41567-018-0318-2); [arXiv:1803.04402](https://arxiv.org/abs/1803.04402) (2018 preprint titled "Quantum Supremacy and the Complexity of Random Circuit Sampling").

**Mov23** R. Movassagh, "The hardness of random quantum circuits," *Nature Physics* **19**, 1719–1724 (2023). [doi:10.1038/s41567-023-02131-2](https://doi.org/10.1038/s41567-023-02131-2); [arXiv:1909.06210v4](https://arxiv.org/abs/1909.06210v4) (preprint titled "Quantum supremacy and random circuits").

**BFLL22** A. Bouland, B. Fefferman, Z. Landau, and Y. Liu, "Noise and the frontier of quantum supremacy," in *FOCS 2021*, 1308–1317 (2022). [doi:10.1109/FOCS52979.2021.00127](https://doi.org/10.1109/FOCS52979.2021.00127); [arXiv:2102.01738v2](https://arxiv.org/abs/2102.01738v2).

**KMM22** Y. Kondo, R. Mori, and R. Movassagh, "Quantum supremacy and hardness of estimating output probabilities of quantum circuits," in *FOCS 2021*, 1296–1307 (2022). [doi:10.1109/FOCS52979.2021.00126](https://doi.org/10.1109/FOCS52979.2021.00126); [arXiv:2102.01960v3](https://arxiv.org/abs/2102.01960v3).

**Kro22** H. Krovi, "Average-case hardness of estimating probabilities of random quantum circuits with a linear scaling in the error exponent," arXiv preprint (2022). [doi:10.48550/arXiv.2206.05642](https://doi.org/10.48550/arXiv.2206.05642); [arXiv:2206.05642](https://arxiv.org/abs/2206.05642).

**BDFH25** A. Bouland, I. Datta, B. Fefferman, and F. Hernandez, "Exponential improvements to the average-case hardness of BosonSampling," in *FOCS 2025*, 912–933 (2025). [doi:10.1109/FOCS63196.2025.00047](https://doi.org/10.1109/FOCS63196.2025.00047); [arXiv:2411.04566v2](https://arxiv.org/abs/2411.04566v2).
