---
id: "01M26KND1E2P37YSPQCT6FPCCD"
type: "Problem"
schemaVersion: "1.0"
revision: 3
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-10-08T04:48:42.020Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["boson-sampling","computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M26KNCZSX9BMQTNM7RX75HZ5"]
title: "Anticoncentration of independent complex Gaussian hafnians"
aliases: ["op-55be40726cdf7304","op_55be40726cdf7304","01M26KND1E2P37YSPQCT6FPCCD"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_55be40726cdf7304.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_55be40726cdf7304","ulid":"01M26KND1E2P37YSPQCT6FPCCD","aliases":["op_55be40726cdf7304","01M26KND1E2P37YSPQCT6FPCCD","op-55be40726cdf7304"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.806Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["boson-sampling","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M26KNCZSX9BMQTNM7RX75HZ5"]},"title":"Anticoncentration of independent complex Gaussian hafnians","status":"Solved","fields":["Quantum algorithm"],"topics":["Boson sampling","Computational complexity and computability"],"statement":"Do independent complex Gaussian hafnians satisfy a polynomial lower-tail bound at their root-mean-square scale?\nFor each integer $n\\geq1$, let $X=X^T\\in\\mathbb C^{2n\\times2n}$ have zero diagonal.\nThe entries above the diagonal are independent with density $\\pi^{-1}e^{-|z|^2}$.\nDefine\n\\begin{equation}\n \\operatorname{Haf}X=\\sum_{M\\in\\mathcal M_{2n}}\\prod_{\\{i,j\\}\\in M}X_{ij},\n \\qquad h_n=(2n-1)!!=\\frac{(2n)!}{2^n n!},\n \\label{eq:hac-hafnian}\n\\end{equation}\nwhere $\\mathcal M_{2n}$ is the set of perfect matchings of $\\{1,\\ldots,2n\\}$.\nDoes there exist a polynomial $p$, positive on $[1,\\infty)^2$, such that\n\\begin{equation}\n \\Pr_X\\!\\left[|\\operatorname{Haf}X|<\n       \\frac{\\sqrt{h_n}}{p(n,1/\\delta)}\\right]<\\delta\n \\qquad(n\\geq1,\\ 0<\\delta<1)?\n \\label{eq:hac-conjecture}\n\\end{equation}\nThe definitions in Eq.~\\eqref{eq:hac-hafnian} fix the ensemble and normalization.\nOne polynomial must satisfy Eq.~\\eqref{eq:hac-conjecture} for every $n$ and $\\delta$.","source":"This is a precise lower-tail formulation motivated by the hafnian anticoncentration discussion following Eq.~(11) of Hamilton et al. \\sourcecite{ref:hac-hamilton}{HKS+17}.\nIts explicitly normalized independent-entry ensemble is an editorial refinement, rather than a verbatim numbered conjecture.","progress":["The matching expansion gives $\\mathbb E|\\operatorname{Haf}X|^2=h_n$ because only equal matchings survive the expectation.\nIt fixes the scale in Eq.~\\eqref{eq:hac-conjecture}, but supplies no lower-tail estimate.","For a different ensemble, Zhao's September 2026 preprint proves a polynomial small-ball bound.\nIf $S$ is real symmetric with independent standard real Gaussian entries above the diagonal, Theorem~2.3 gives\n\\begin{equation}\n \\sup_{z\\in\\mathbb R}\\Pr\\!\\left[\n |\\operatorname{Haf}S-z|\\leq t\\sqrt{h_n}\\right]\n \\leq\\min\\!\\left\\{1,\\frac{2}{\\sqrt\\pi}n^{3/8}t\\right\\}.\n \\label{eq:hac-real-result}\n\\end{equation}\nEquation~\\eqref{eq:hac-real-result} settles the real symmetric analogue.\nIt does not state a theorem for the circular complex ensemble in Eq.~\\eqref{eq:hac-hafnian} \\sourcecite{ref:hac-zhao}{Zha26}.","Hongru Zhao resolves the independent circular complex Gaussian lower-tail question in Theorem~2.3 and Corollary~2.5 of arXiv:2610.00112v1; the corresponding locators in the September 20 Zenodo manuscript v1.0.0 are Theorem~2.2 and Corollary~2.4 \\sourcecite{ref:hac-zhao-complex}{Zhao26}.\nFor the ensemble in Eq.~\\eqref{eq:hac-hafnian}, every $n\\geq1$, $z\\in\\mathbb C$, and $\\varepsilon\\geq0$ satisfy\n\\begin{equation}\n \\Pr\\!\\left[\\lvert\\operatorname{Haf}X-z\\rvert\\leq\\varepsilon\\sqrt{h_n}\\right]\n \\leq\\min\\{1,b_n\\varepsilon^2\\},\n \\qquad b_n=\\frac{(2n-1)!!}{(2n-2)!!}\\leq2\\sqrt{n/\\pi},\n \\label{eq:hac-complex-result}\n\\end{equation}\nwith $0!!=1$.\nTaking $z=0$ and $\\varepsilon=\\delta/(2n)$ in Eq.~\\eqref{eq:hac-complex-result} gives\n\\begin{equation}\n \\Pr\\!\\left[\\lvert\\operatorname{Haf}X\\rvert<\\frac{\\delta\\sqrt{h_n}}{2n}\\right]\n \\leq\\frac{b_n\\delta^2}{4n^2}\\leq\\frac{\\delta^2}{2n}<\\delta\n \\qquad(n\\geq1,\\ 0<\\delta<1).\n \\label{eq:hac-polynomial-witness}\n\\end{equation}\nThus the single polynomial $p(n,u)=2nu$, positive on $[1,\\infty)^2$, satisfies the exact strict inequality in Eq.~\\eqref{eq:hac-conjecture} by Eq.~\\eqref{eq:hac-polynomial-witness}.\nThe prose proof obtains the independent ensemble as a fixed-dimension limit of finite transpose-Gram hafnians; diagonal entries do not affect the hafnian.\n\\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/123}{GitHub \\#123}.","Yuxuan Zhang subsequently gives a direct proof of the same bound in Eq.~\\eqref{eq:hac-complex-result}, with the same coefficient $b_n$ and polynomial $p(n,u)=2nu$; see Theorem~1 of his September 20 preprint, preserved in the September 26 Zenodo archive \\sourcecite{ref:hac-zhang}{Zhang26}.\nThe proof bounds the expected reciprocal of the conditional variance obtained by conditioning on all edges not incident to one vertex, using Gaussian kernels and coordinate compression without assuming independence of overlapping hafnian minors.\nHis \\href{https://yuxuanzhang1995.github.io/agentic-research/complex-gaussian-hafnian/}{revised research note} acknowledges Zhao's earlier resolution.\nBoth derivations build on the Gaussian interpolation and compression method of Koehler and Leung for Ginibre permanents \\sourcecite{ref:hac-koehler-leung}{KL26}.","Historical GitHub report (2026-09-21): Yuxuan Zhang (GitHub: yuxuanzhang1995) reported a candidate anticoncentration bound for independent complex-Gaussian hafnians. \\href{https://github.com/Naixu-Guo/quantum-open-problems/issues/92}{Issue \\#92}."],"references":[{"key":"HKS+17","label":"ref:hac-hamilton","tex":"C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, \"Gaussian Boson Sampling,\" \\emph{Physical Review Letters} \\textbf{119}, 170501 (2017). \\href{https://doi.org/10.1103/PhysRevLett.119.170501}{doi:10.1103/PhysRevLett.119.170501}; \\href{https://arxiv.org/abs/1612.01199}{arXiv:1612.01199}."},{"key":"Zha26","label":"ref:hac-zhao","tex":"H. Zhao, \"Shifted Anticoncentration for Real Gram Hafnians and Symmetric Gaussian Hafnians,\" arXiv preprint (September 2026). \\href{https://arxiv.org/abs/2609.06526v1}{arXiv:2609.06526v1}."},{"key":"Zhao26","label":"ref:hac-zhao-complex","tex":"H. Zhao, \"Local Anticoncentration for Gaussian Boson Sampling via Conditional Wishart Geometry,\" preprint (2026). \\href{https://arxiv.org/abs/2610.00112v1}{arXiv:2610.00112v1}; Zenodo manuscript v1.0.0 with proof supplement (September 20, 2026), \\href{https://doi.org/10.5281/zenodo.22856033}{doi:10.5281/zenodo.22856033}."},{"key":"Zhang26","label":"ref:hac-zhang","tex":"Y. Zhang, \"Anticoncentration of Independent Complex Gaussian Hafnians,\" research preprint (September 20, 2026), Theorem~1. Archived in \\emph{Agentic Proofs for QIQC: Collected Manuscripts}, version~1.0 (September 26, 2026), \\href{https://doi.org/10.5281/zenodo.22969546}{doi:10.5281/zenodo.22969546}; \\href{https://zenodo.org/records/22969546/files/complex-gaussian-hafnian.pdf}{archived manuscript}."},{"key":"KL26","label":"ref:hac-koehler-leung","tex":"F. Koehler and P. K. Leung, \"Anticoncentration of the Permanent in Ginibre Ensembles,\" arXiv preprint (2026). \\href{https://arxiv.org/abs/2607.20329v1}{arXiv:2607.20329v1}."},{"key":"Zhao26H","label":"ref:hac-zhao-hiding","tex":"H. Zhao, \"Uniform Hiding and Two Routes to Relative Accuracy in Gaussian Boson Sampling,\" arXiv preprint, version~2 (September 11, 2026), Eq.~(3.4). \\href{https://arxiv.org/abs/2609.01008v2}{arXiv:2609.01008v2}."},{"key":"Zhao26L","label":"ref:hac-zhao-lean","tex":"H. Zhao, \\emph{Lean Verification for \"Shifted Anticoncentration of Complex Gaussian Gram Hafnians via Conditional Wishart Geometry\"}, software archive, version~1.0.0 (publicly released September 1, 2026). \\href{https://doi.org/10.5281/zenodo.22102635}{doi:10.5281/zenodo.22102635}."}],"comment":"The archived independent complex Gaussian lower-tail question is solved by Eq.~\\eqref{eq:hac-complex-result}; the resolving manuscripts are preprints, and peer review is not established by the cited sources.\nEarlier-resolution credit belongs to Hongru Zhao: the bound was already stated in Eq.~(3.4) of his September 11 arXiv revision \\sourcecite{ref:hac-zhao-hiding}{Zhao26H}, and his work is accompanied by archived Lean formalization and recorded verification, with a public archive dating to September 1 \\sourcecite{ref:hac-zhao-lean}{Zhao26L}.\nYuxuan Zhang's later direct proof supplies a concise derivation for the exact independent-entry ensemble.\nFinite transpose-Gram matrices have a different law and their theorem has additional hypotheses; the independent-ensemble resolution does not assert a bound for every Gaussian boson-sampling ensemble.\nAverage-case computational hardness remains a separate question."}}
---
## Source

This is a precise lower-tail formulation motivated by the hafnian anticoncentration discussion following Eq. (11) of Hamilton et al. [HKS+17](https://doi.org/10.1103/PhysRevLett.119.170501). Its explicitly normalized independent-entry ensemble is an editorial refinement, rather than a verbatim numbered conjecture.

## Progress

The matching expansion gives $\mathbb E|\operatorname{Haf}X|^2=h_n$ because only equal matchings survive the expectation. It fixes the scale in Eq. (2), but supplies no lower-tail estimate.

For a different ensemble, Zhao’s September 2026 preprint proves a polynomial small-ball bound. If $S$ is real symmetric with independent standard real Gaussian entries above the diagonal, Theorem 2.3 gives

$$
\sup_{z\in\mathbb R}\Pr\!\left[
 |\operatorname{Haf}S-z|\leq t\sqrt{h_n}\right]
 \leq\min\!\left\{1,\frac{2}{\sqrt\pi}n^{3/8}t\right\}.
\tag{3}
$$

Equation (3) settles the real symmetric analogue. It does not state a theorem for the circular complex ensemble in Eq. (1) [Zha26](https://arxiv.org/abs/2609.06526v1).

Hongru Zhao resolves the independent circular complex Gaussian lower-tail question in Theorem 2.3 and Corollary 2.5 of arXiv:2610.00112v1; the corresponding locators in the September 20 Zenodo manuscript v1.0.0 are Theorem 2.2 and Corollary 2.4 [Zhao26](https://doi.org/10.5281/zenodo.22856033). For the ensemble in Eq. (1), every $n\geq1$, $z\in\mathbb C$, and $\varepsilon\geq0$ satisfy

$$
\Pr\!\left[\lvert\operatorname{Haf}X-z\rvert\leq\varepsilon\sqrt{h_n}\right]
 \leq\min\{1,b_n\varepsilon^2\},
 \qquad b_n=\frac{(2n-1)!!}{(2n-2)!!}\leq2\sqrt{n/\pi},
\tag{4}
$$

with $0!!=1$. Taking $z=0$ and $\varepsilon=\delta/(2n)$ in Eq. (4) gives

$$
\Pr\!\left[\lvert\operatorname{Haf}X\rvert<\frac{\delta\sqrt{h_n}}{2n}\right]
 \leq\frac{b_n\delta^2}{4n^2}\leq\frac{\delta^2}{2n}<\delta
 \qquad(n\geq1,\ 0<\delta<1).
\tag{5}
$$

Thus the single polynomial $p(n,u)=2nu$, positive on $[1,\infty)^2$, satisfies the exact strict inequality in Eq. (2) by Eq. (5). The prose proof obtains the independent ensemble as a fixed-dimension limit of finite transpose-Gram hafnians; diagonal entries do not affect the hafnian. [GitHub #123](https://github.com/Naixu-Guo/quantum-open-problems/issues/123).

Yuxuan Zhang subsequently gives a direct proof of the same bound in Eq. (4), with the same coefficient $b_n$ and polynomial $p(n,u)=2nu$; see Theorem 1 of his September 20 preprint, preserved in the September 26 Zenodo archive [Zhang26](https://doi.org/10.5281/zenodo.22969546). The proof bounds the expected reciprocal of the conditional variance obtained by conditioning on all edges not incident to one vertex, using Gaussian kernels and coordinate compression without assuming independence of overlapping hafnian minors. His [revised research note](https://yuxuanzhang1995.github.io/agentic-research/complex-gaussian-hafnian/) acknowledges Zhao’s earlier resolution. Both derivations build on the Gaussian interpolation and compression method of Koehler and Leung for Ginibre permanents [KL26](https://doi.org/10.48550/arXiv.2607.20329).

Historical GitHub report (2026-09-21): Yuxuan Zhang (GitHub: yuxuanzhang1995) reported a candidate anticoncentration bound for independent complex-Gaussian hafnians. [Issue #92](https://github.com/Naixu-Guo/quantum-open-problems/issues/92).

## Comment

The archived independent complex Gaussian lower-tail question is solved by Eq. (4); the resolving manuscripts are preprints, and peer review is not established by the cited sources. Earlier-resolution credit belongs to Hongru Zhao: the bound was already stated in Eq. (3.4) of his September 11 arXiv revision [Zhao26H](https://arxiv.org/abs/2609.01008v2), and his work is accompanied by archived Lean formalization and recorded verification, with a public archive dating to September 1 [Zhao26L](https://doi.org/10.5281/zenodo.22102635). Yuxuan Zhang’s later direct proof supplies a concise derivation for the exact independent-entry ensemble. Finite transpose-Gram matrices have a different law and their theorem has additional hypotheses; the independent-ensemble resolution does not assert a bound for every Gaussian boson-sampling ensemble. Average-case computational hardness remains a separate question.

## References

**HKS+17** C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, "Gaussian Boson Sampling," *Physical Review Letters* **119**, 170501 (2017). [doi:10.1103/PhysRevLett.119.170501](https://doi.org/10.1103/PhysRevLett.119.170501); [arXiv:1612.01199](https://arxiv.org/abs/1612.01199).

**Zha26** H. Zhao, "Shifted Anticoncentration for Real Gram Hafnians and Symmetric Gaussian Hafnians," arXiv preprint (September 2026). [arXiv:2609.06526v1](https://arxiv.org/abs/2609.06526v1).

**Zhao26** H. Zhao, "Local Anticoncentration for Gaussian Boson Sampling via Conditional Wishart Geometry," preprint (2026). [arXiv:2610.00112v1](https://arxiv.org/abs/2610.00112v1); Zenodo manuscript v1.0.0 with proof supplement (September 20, 2026), [doi:10.5281/zenodo.22856033](https://doi.org/10.5281/zenodo.22856033).

**Zhang26** Y. Zhang, "Anticoncentration of Independent Complex Gaussian Hafnians," research preprint (September 20, 2026), Theorem 1. Archived in *Agentic Proofs for QIQC: Collected Manuscripts*, version 1.0 (September 26, 2026), [doi:10.5281/zenodo.22969546](https://doi.org/10.5281/zenodo.22969546); [archived manuscript](https://zenodo.org/records/22969546/files/complex-gaussian-hafnian.pdf).

**KL26** F. Koehler and P. K. Leung, "Anticoncentration of the Permanent in Ginibre Ensembles," arXiv preprint (2026). [arXiv:2607.20329v1](https://arxiv.org/abs/2607.20329v1).

**Zhao26H** H. Zhao, "Uniform Hiding and Two Routes to Relative Accuracy in Gaussian Boson Sampling," arXiv preprint, version 2 (September 11, 2026), Eq. (3.4). [arXiv:2609.01008v2](https://arxiv.org/abs/2609.01008v2).

**Zhao26L** H. Zhao, *Lean Verification for "Shifted Anticoncentration of Complex Gaussian Gram Hafnians via Conditional Wishart Geometry"*, software archive, version 1.0.0 (publicly released September 1, 2026). [doi:10.5281/zenodo.22102635](https://doi.org/10.5281/zenodo.22102635).
