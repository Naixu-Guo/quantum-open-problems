---
id: "01M26JZEHFZ0RFR2137NXD72BE"
type: "Problem"
schemaVersion: "1.0"
revision: 3
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-10-08T05:04:13.442Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["bosonic-channels","matrix-and-entropy-inequalities"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1Q787QRE9WF0NXMX32BQDCQ"]
title: "Entropy photon-number inequality"
aliases: ["op-ba39e7a80122b256","op_ba39e7a80122b256","01M26JZEHFZ0RFR2137NXD72BE"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_ba39e7a80122b256.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_ba39e7a80122b256","ulid":"01M26JZEHFZ0RFR2137NXD72BE","aliases":["op_ba39e7a80122b256","01M26JZEHFZ0RFR2137NXD72BE","op-ba39e7a80122b256"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:18:30.447Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["bosonic-channels","matrix-and-entropy-inequalities"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1Q787QRE9WF0NXMX32BQDCQ"]},"title":"Entropy photon-number inequality","status":"Unsolved","fields":["Quantum Communication"],"topics":["Bosonic channels","Matrix and entropy inequalities"],"statement":"Does the entropy photon-number inequality hold for every pair of independent finite-energy bosonic inputs?\nLet $n\\geq1$ and $0\\leq\\eta\\leq1$. The input is $\\rho_A\\otimes\\rho_B$, where each factor is an $n$-mode state with finite total mean photon number. Correlations among the modes within either factor are allowed. Mix corresponding input modes on beam splitters and retain the outputs\n\\begin{equation}\n c_j=\\sqrt\\eta\\,a_j+\\sqrt{1-\\eta}\\,b_j,\\qquad j=1,\\ldots,n.\n \\label{eq:epni-output}\n\\end{equation}\nLet $\\rho_C$ be the joint state of the modes in Eq.~\\eqref{eq:epni-output}. Use natural logarithms, $S(\\rho)=-\\operatorname{Tr}\\rho\\ln\\rho$, and $g(x)=(x+1)\\ln(x+1)-x\\ln x$ for $x\\geq0$, with $0\\ln0=0$. The proposed inequality is\n\\begin{equation}\n g^{-1}\\!\\left(\\frac{S(\\rho_C)}n\\right)\n \\geq\\eta g^{-1}\\!\\left(\\frac{S(\\rho_A)}n\\right)\n +(1-\\eta)g^{-1}\\!\\left(\\frac{S(\\rho_B)}n\\right).\n \\label{eq:epni-conjecture}\n\\end{equation}\nProve Eq.~\\eqref{eq:epni-conjecture} in this full domain or provide a physical input pair that violates it.","source":"The entropy photon-number conjecture is stated explicitly in De Palma, Mari, and Giovannetti, Sec.~II.3, Eq.~(34), with attribution there to the earlier Guha--Shapiro--Erkmen work \\sourcecite{ref:epni-qepi}{DMG14}.","progress":["The quantum entropy power inequality proves $e^{S(\\rho_C)/n}\\geq\\eta e^{S(\\rho_A)/n}+(1-\\eta)e^{S(\\rho_B)/n}$. This is weaker than Eq.~\\eqref{eq:epni-conjecture}. The same paper bounds the possible deficit in Eq.~\\eqref{eq:epni-conjecture} by $1/2-1/e$; see Eqs.~(5) and (35) \\sourcecite{ref:epni-qepi}{DMG14}.","For $n=1$ and a thermal second input with mean photon number $b\\geq0$, Theorem~4, Eq.~(24), proves $S(\\rho_C)\\geq g(\\eta g^{-1}(S(\\rho_A))+(1-\\eta)b)$. Thermal first inputs attain equality. This permits arbitrary first inputs but does not permit an arbitrary nonthermal second input \\sourcecite{ref:epni-one-mode}{DTG17}.","Historical GitHub report (2026-09-24): Yuxuan Zhang (GitHub: yuxuanzhang1995) withdrew an earlier partial-result submission and asked that it not be treated as a current result; this link records the withdrawal only. \\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/103}{Issue \\#103}.","OpenAI reports a proof of Eq.~\\eqref{eq:epni-conjecture} for two\n  independent finite-energy bosonic inputs and any finite number of modes\n  (Theorem~1.1, p.~2) \\sourcecite{ref:epni-openai}{OAI26}. Arbitrary\n  entanglement among modes within either input is allowed. Product thermal\n  inputs attain equality, including when the two input entropies differ."],"references":[{"key":"DMG14","label":"ref:epni-qepi","tex":"G. De Palma, A. Mari, and V. Giovannetti, ``A Generalization of the Entropy Power Inequality to Bosonic Quantum Systems,'' \\emph{Nature Photonics} \\textbf{8}, 958--964 (2014). \\href{https://doi.org/10.1038/nphoton.2014.252}{doi:10.1038/nphoton.2014.252}; \\href{https://arxiv.org/abs/1402.0404}{arXiv:1402.0404}."},{"key":"DTG17","label":"ref:epni-one-mode","tex":"G. De Palma, D. Trevisan, and V. Giovannetti, ``Gaussian States Minimize the Output Entropy of One-Mode Quantum Gaussian Channels,'' \\emph{Physical Review Letters} \\textbf{118}, 160503 (2017). \\href{https://doi.org/10.1103/PhysRevLett.118.160503}{doi:10.1103/PhysRevLett.118.160503}; \\href{https://arxiv.org/abs/1610.09970}{arXiv:1610.09970}."},{"key":"OAI26","label":"ref:epni-openai","tex":"OpenAI, ``The entropy photon-number inequality,'' OpenAI Math Release preprint, 24 September 2026.\n\\href{https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-entropy-photon-number-inequality-September-24-2026/paper.pdf}{manuscript (release version)}."}],"comment":"The preprint \\sourcecite{ref:epni-openai}{OAI26} reports a proof in the\n  full finite-energy domain stated above; the catalog retains the Unsolved\n  designation while documenting this report. Independence of the two input\n  systems is essential. Taking one input to be vacuum yields the\n  finite-energy case of the catalog's multimode constrained pure-loss\n  output-entropy question."}}
---
## Source

The entropy photon-number conjecture is stated explicitly in De Palma, Mari, and Giovannetti, Sec. II.3, Eq. (34), with attribution there to the earlier Guha–Shapiro–Erkmen work [DMG14](https://doi.org/10.1038/nphoton.2014.252).

## Progress

The quantum entropy power inequality proves $e^{S(\rho_C)/n}\geq\eta e^{S(\rho_A)/n}+(1-\eta)e^{S(\rho_B)/n}$. This is weaker than Eq. (2). The same paper bounds the possible deficit in Eq. (2) by $1/2-1/e$; see Eqs. (5) and (35) [DMG14](https://doi.org/10.1038/nphoton.2014.252).

For $n=1$ and a thermal second input with mean photon number $b\geq0$, Theorem 4, Eq. (24), proves $S(\rho_C)\geq g(\eta g^{-1}(S(\rho_A))+(1-\eta)b)$. Thermal first inputs attain equality. This permits arbitrary first inputs but does not permit an arbitrary nonthermal second input [DTG17](https://doi.org/10.1103/PhysRevLett.118.160503).

Historical GitHub report (2026-09-24): Yuxuan Zhang (GitHub: yuxuanzhang1995) withdrew an earlier partial-result submission and asked that it not be treated as a current result; this link records the withdrawal only. [Issue #103](https://github.com/Naixu-Guo/quantum-open-problems/issues/103).

OpenAI reports a proof of Eq. (2) for two independent finite-energy bosonic inputs and any finite number of modes (Theorem 1.1, p. 2) [OAI26](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-entropy-photon-number-inequality-September-24-2026/paper.pdf). Arbitrary entanglement among modes within either input is allowed. Product thermal inputs attain equality, including when the two input entropies differ.

## Comment

The preprint [OAI26](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-entropy-photon-number-inequality-September-24-2026/paper.pdf) reports a proof in the full finite-energy domain stated above; the catalog retains the Unsolved designation while documenting this report. Independence of the two input systems is essential. Taking one input to be vacuum yields the finite-energy case of the catalog’s multimode constrained pure-loss output-entropy question.

## References

**DMG14** G. De Palma, A. Mari, and V. Giovannetti, “A Generalization of the Entropy Power Inequality to Bosonic Quantum Systems,” *Nature Photonics* **8**, 958–964 (2014). [doi:10.1038/nphoton.2014.252](https://doi.org/10.1038/nphoton.2014.252); [arXiv:1402.0404](https://arxiv.org/abs/1402.0404).

**DTG17** G. De Palma, D. Trevisan, and V. Giovannetti, “Gaussian States Minimize the Output Entropy of One-Mode Quantum Gaussian Channels,” *Physical Review Letters* **118**, 160503 (2017). [doi:10.1103/PhysRevLett.118.160503](https://doi.org/10.1103/PhysRevLett.118.160503); [arXiv:1610.09970](https://arxiv.org/abs/1610.09970).

**OAI26** OpenAI, “The entropy photon-number inequality,” OpenAI Math Release preprint, 24 September 2026. [manuscript (release version)](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-entropy-photon-number-inequality-September-24-2026/paper.pdf).
