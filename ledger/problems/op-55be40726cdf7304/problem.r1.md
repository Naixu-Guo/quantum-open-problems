---
id: "01M26KND1E2P37YSPQCT6FPCCD"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
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
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_55be40726cdf7304.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_55be40726cdf7304","ulid":"01M26KND1E2P37YSPQCT6FPCCD","aliases":["op_55be40726cdf7304","01M26KND1E2P37YSPQCT6FPCCD","op-55be40726cdf7304"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.806Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["boson-sampling","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M26KNCZSX9BMQTNM7RX75HZ5"]},"title":"Anticoncentration of independent complex Gaussian hafnians","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Boson sampling","Computational complexity and computability"],"statement":"Do independent complex Gaussian hafnians satisfy a polynomial lower-tail bound at their root-mean-square scale?\nFor each integer $n\\geq1$, let $X=X^T\\in\\mathbb C^{2n\\times2n}$ have zero diagonal.\nThe entries above the diagonal are independent with density $\\pi^{-1}e^{-|z|^2}$.\nDefine\n\\begin{equation}\n \\operatorname{Haf}X=\\sum_{M\\in\\mathcal M_{2n}}\\prod_{\\{i,j\\}\\in M}X_{ij},\n \\qquad h_n=(2n-1)!!=\\frac{(2n)!}{2^n n!},\n \\label{eq:hac-hafnian}\n\\end{equation}\nwhere $\\mathcal M_{2n}$ is the set of perfect matchings of $\\{1,\\ldots,2n\\}$.\nDoes there exist a polynomial $p$, positive on $[1,\\infty)^2$, such that\n\\begin{equation}\n \\Pr_X\\!\\left[|\\operatorname{Haf}X|<\n       \\frac{\\sqrt{h_n}}{p(n,1/\\delta)}\\right]<\\delta\n \\qquad(n\\geq1,\\ 0<\\delta<1)?\n \\label{eq:hac-conjecture}\n\\end{equation}\nThe definitions in Eq.~\\eqref{eq:hac-hafnian} fix the ensemble and normalization.\nOne polynomial must satisfy Eq.~\\eqref{eq:hac-conjecture} for every $n$ and $\\delta$.","source":"This is a precise lower-tail formulation motivated by the hafnian anticoncentration discussion following Eq.~(11) of Hamilton et al. \\sourcecite{ref:hac-hamilton}{HKS+17}.\nIts explicitly normalized independent-entry ensemble is an editorial refinement, rather than a verbatim numbered conjecture.","progress":["The matching expansion gives $\\mathbb E|\\operatorname{Haf}X|^2=h_n$ because only equal matchings survive the expectation.\nIt fixes the scale in Eq.~\\eqref{eq:hac-conjecture}, but supplies no lower-tail estimate.","For a different ensemble, Zhao's September 2026 preprint proves a polynomial small-ball bound.\nIf $S$ is real symmetric with independent standard real Gaussian entries above the diagonal, Theorem~2.3 gives\n\\begin{equation}\n \\sup_{z\\in\\mathbb R}\\Pr\\!\\left[\n |\\operatorname{Haf}S-z|\\leq t\\sqrt{h_n}\\right]\n \\leq\\min\\!\\left\\{1,\\frac{2}{\\sqrt\\pi}n^{3/8}t\\right\\}.\n \\label{eq:hac-real-result}\n\\end{equation}\nEquation~\\eqref{eq:hac-real-result} settles the real symmetric analogue.\nIt does not state a theorem for the circular complex ensemble in Eq.~\\eqref{eq:hac-hafnian} \\sourcecite{ref:hac-zhao}{Zha26}."],"references":[{"key":"HKS+17","label":"ref:hac-hamilton","tex":"C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, \"Gaussian Boson Sampling,\" \\emph{Physical Review Letters} \\textbf{119}, 170501 (2017). \\href{https://doi.org/10.1103/PhysRevLett.119.170501}{doi:10.1103/PhysRevLett.119.170501}; \\href{https://arxiv.org/abs/1612.01199}{arXiv:1612.01199}."},{"key":"Zha26","label":"ref:hac-zhao","tex":"H. Zhao, \"Shifted Anticoncentration for Real Gram Hafnians and Symmetric Gaussian Hafnians,\" arXiv preprint (September 2026). \\href{https://arxiv.org/abs/2609.06526v1}{arXiv:2609.06526v1}."}],"comment":"The complex independent-entry lower tail remains the archived gap.\nReal symmetric matrices, finite-rank Gaussian products $YY^T$, and the permanent's special bipartite block ensemble have different laws.\nTheir results cannot be transferred by substituting the matrix name.\nAverage-case computational hardness is also a separate question."}}
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

## Comment

The complex independent-entry lower tail remains the archived gap. Real symmetric matrices, finite-rank Gaussian products $YY^T$, and the permanent’s special bipartite block ensemble have different laws. Their results cannot be transferred by substituting the matrix name. Average-case computational hardness is also a separate question.

## References

**HKS+17** C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, "Gaussian Boson Sampling," *Physical Review Letters* **119**, 170501 (2017). [doi:10.1103/PhysRevLett.119.170501](https://doi.org/10.1103/PhysRevLett.119.170501); [arXiv:1612.01199](https://arxiv.org/abs/1612.01199).

**Zha26** H. Zhao, "Shifted Anticoncentration for Real Gram Hafnians and Symmetric Gaussian Hafnians," arXiv preprint (September 2026). [arXiv:2609.06526v1](https://arxiv.org/abs/2609.06526v1).
