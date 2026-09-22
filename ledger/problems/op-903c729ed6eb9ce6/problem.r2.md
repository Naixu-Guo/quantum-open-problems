---
id: "01M26KNCZSX9BMQTNM7RX75HZ5"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-18T10:24:42.707Z"
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
relatedProblemIds: ["01M26KND1E2P37YSPQCT6FPCCD"]
title: "Average-case additive hardness of squared complex Gaussian hafnians"
aliases: ["op-903c729ed6eb9ce6","op_903c729ed6eb9ce6","01M26KNCZSX9BMQTNM7RX75HZ5"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_903c729ed6eb9ce6.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_903c729ed6eb9ce6","ulid":"01M26KNCZSX9BMQTNM7RX75HZ5","aliases":["op_903c729ed6eb9ce6","01M26KNCZSX9BMQTNM7RX75HZ5","op-903c729ed6eb9ce6"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.753Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["boson-sampling","computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M26KND1E2P37YSPQCT6FPCCD"]},"title":"Average-case additive hardness of squared complex Gaussian hafnians","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Boson sampling","Computational complexity and computability"],"statement":"Is additive estimation of squared complex Gaussian hafnians $\\#\\mathrm P$-hard under randomized polynomial-time oracle reductions?\nFor $n\\geq1$, let $X=X^T\\in\\mathbb C^{2n\\times2n}$ have zero diagonal.\nIts entries above the diagonal are independent with density $\\pi^{-1}e^{-|z|^2}$.\nLet $\\mathcal M_{2n}$ be the perfect matchings of $\\{1,\\ldots,2n\\}$ and define\n\\begin{equation}\n \\operatorname{Haf}X=\\sum_{M\\in\\mathcal M_{2n}}\\prod_{\\{i,j\\}\\in M}X_{ij},\n \\qquad h_n=(2n-1)!!=\\frac{(2n)!}{2^n n!}.\n \\label{eq:ghe-hafnian}\n\\end{equation}\nGiven $0<\\varepsilon,\\delta<1$, an estimator must output $\\widehat p\\in\\mathbb R$ with\n\\begin{equation}\n \\Pr\\!\\left[\\left|\\widehat p-|\\operatorname{Haf}X|^2\\right|\n                   \\leq\\varepsilon h_n\\right]\\geq1-\\delta.\n \\label{eq:ghe-estimation}\n\\end{equation}\nProbability in Eq.~\\eqref{eq:ghe-estimation} includes both $X$ and the estimator's randomness.\nThe binary input is a truncated, rounded copy $\\widetilde X$.\nUse $\\operatorname{poly}(n,\\log(1/\\varepsilon),\\log(1/\\delta))$ bits per entry.\nChoose the precision so that the squared hafnians of $X$ and $\\widetilde X$ differ by at most $\\varepsilon h_n/2$, except with probability $\\delta/2$.\nReduction cost is polynomial in the binary input length, $1/\\varepsilon$, and $1/\\delta$.\nHere $\\#\\mathrm P$ is the class of functions counting accepting paths of nondeterministic polynomial-time machines.\nThe target normalization $h_n$ is defined in Eq.~\\eqref{eq:ghe-hafnian}.","source":"This explicit ensemble and additive normalization refine the hafnian-of-Gaussians discussion following Eq.~(11) of Hamilton et al. \\sourcecite{ref:ghe-hamilton}{HKS+17}.\nThe formulation distinguishes additive squared-hafnian estimation from multiplicative hafnian estimation; the paper does not state this precise normalized problem as a numbered conjecture.\nProblem~1 and Conjecture~2 of \\sourcecite{ref:ghe-shou}{SGGM26} subsequently state the corresponding independent-complex-Gaussian squared-hafnian estimation problem and hardness conjecture. Their diagonal entries have variance two, which does not affect an ordinary hafnian; this record fixes those unused entries to zero.","progress":["Hamilton et al., Eq.~(7), use the identity\n\\begin{equation}\n \\operatorname{Haf}\\begin{pmatrix}0&G\\\\G^T&0\\end{pmatrix}\n =\\operatorname{Per}G.\n \\label{eq:ghe-block}\n\\end{equation}\nHere $G$ is any square matrix and $\\operatorname{Per}G$ is its permanent.\nEquation~\\eqref{eq:ghe-block} transfers worst-case permanent evaluation hardness to hafnians.\nThe block matrices in this reduction are not typical independent symmetric Gaussian samples \\sourcecite{ref:ghe-hamilton}{HKS+17}.","Independence and the matching expansion give $\\mathbb E|\\operatorname{Haf}X|^2=h_n$.\nDistinct matchings have vanishing cross terms.\nThis elementary normalization calculation does not provide an average-case reduction at error $\\varepsilon h_n$.","Shou, Gorshkov, Galitski, and Miller formulate additive squared-hafnian estimation for an independent complex symmetric Gaussian matrix as Problem~1 and retain its $\\#\\mathrm P$-hardness as Conjecture~2. Their Theorems~1.1 and~1.2 establish distributional hiding when the detected photon number $N$ satisfies $N=o(\\sqrt K)$, with $K$ squeezed inputs. Under their finite-precision Assumption~1, Theorem~1.4 derives an additive-estimation procedure in $\\mathsf{FBPP}^{\\mathsf{NP}^{\\mathcal C}}$ from an approximate Gaussian-boson-sampling oracle $\\mathcal C$, with the theorem's squeezing and mode-scaling conditions. These results supply a sampling-to-estimation reduction, rather than proving the average-case $\\#\\mathrm P$-hardness asked here \\sourcecite{ref:ghe-shou}{SGGM26}."],"references":[{"key":"HKS+17","label":"ref:ghe-hamilton","tex":"C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, \"Gaussian Boson Sampling,\" \\emph{Physical Review Letters} \\textbf{119}, 170501 (2017). \\href{https://doi.org/10.1103/PhysRevLett.119.170501}{doi:10.1103/PhysRevLett.119.170501}; \\href{https://arxiv.org/abs/1612.01199}{arXiv:1612.01199}."},{"key":"SGGM26","label":"ref:ghe-shou","tex":"Laura Shou, Alexey V. Gorshkov, Victor Galitski, and Sarah H. Miller, ``Proof of the hiding conjecture for Gaussian boson sampling with an arbitrary number of squeezed input modes,'' arXiv preprint, version~1 (19 August 2026). \\href{https://arxiv.org/abs/2608.19314v1}{arXiv:2608.19314v1}."}],"comment":"The unresolved claim is average-case additive approximation hardness for independent complex entries above the diagonal.\nWorst-case hardness, exact average-case evaluation, and Gaussian-product ensembles $YY^T$ do not by themselves imply it.\nThe hafnian lower-tail question is a separate auxiliary problem, not an equivalent hardness claim."}}
---
## Source

This explicit ensemble and additive normalization refine the hafnian-of-Gaussians discussion following Eq. (11) of Hamilton et al. [HKS+17](https://doi.org/10.1103/PhysRevLett.119.170501). The formulation distinguishes additive squared-hafnian estimation from multiplicative hafnian estimation; the paper does not state this precise normalized problem as a numbered conjecture. Problem 1 and Conjecture 2 of [SGGM26](https://arxiv.org/abs/2608.19314v1) subsequently state the corresponding independent-complex-Gaussian squared-hafnian estimation problem and hardness conjecture. Their diagonal entries have variance two, which does not affect an ordinary hafnian; this record fixes those unused entries to zero.

## Progress

Hamilton et al., Eq. (7), use the identity

$$
\operatorname{Haf}\begin{pmatrix}0&G\\G^T&0\end{pmatrix}
 =\operatorname{Per}G.
\tag{3}
$$

Here $G$ is any square matrix and $\operatorname{Per}G$ is its permanent. Equation (3) transfers worst-case permanent evaluation hardness to hafnians. The block matrices in this reduction are not typical independent symmetric Gaussian samples [HKS+17](https://doi.org/10.1103/PhysRevLett.119.170501).

Independence and the matching expansion give $\mathbb E|\operatorname{Haf}X|^2=h_n$. Distinct matchings have vanishing cross terms. This elementary normalization calculation does not provide an average-case reduction at error $\varepsilon h_n$.

Shou, Gorshkov, Galitski, and Miller formulate additive squared-hafnian estimation for an independent complex symmetric Gaussian matrix as Problem 1 and retain its $\#\mathrm P$-hardness as Conjecture 2. Their Theorems 1.1 and 1.2 establish distributional hiding when the detected photon number $N$ satisfies $N=o(\sqrt K)$, with $K$ squeezed inputs. Under their finite-precision Assumption 1, Theorem 1.4 derives an additive-estimation procedure in $\mathsf{FBPP}^{\mathsf{NP}^{\mathcal C}}$ from an approximate Gaussian-boson-sampling oracle $\mathcal C$, with the theorem’s squeezing and mode-scaling conditions. These results supply a sampling-to-estimation reduction, rather than proving the average-case $\#\mathrm P$-hardness asked here [SGGM26](https://arxiv.org/abs/2608.19314v1).

## Comment

The unresolved claim is average-case additive approximation hardness for independent complex entries above the diagonal. Worst-case hardness, exact average-case evaluation, and Gaussian-product ensembles $YY^T$ do not by themselves imply it. The hafnian lower-tail question is a separate auxiliary problem, not an equivalent hardness claim.

## References

**HKS+17** C. S. Hamilton, R. Kruse, L. Sansoni, S. Barkhofen, C. Silberhorn, and I. Jex, "Gaussian Boson Sampling," *Physical Review Letters* **119**, 170501 (2017). [doi:10.1103/PhysRevLett.119.170501](https://doi.org/10.1103/PhysRevLett.119.170501); [arXiv:1612.01199](https://arxiv.org/abs/1612.01199).

**SGGM26** Laura Shou, Alexey V. Gorshkov, Victor Galitski, and Sarah H. Miller, “Proof of the hiding conjecture for Gaussian boson sampling with an arbitrary number of squeezed input modes,” arXiv preprint, version 1 (19 August 2026). [arXiv:2608.19314v1](https://arxiv.org/abs/2608.19314v1).
