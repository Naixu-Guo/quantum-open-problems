---
id: "01M22MSW6TF2CK8PB6W3W7WZCC"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T08:38:46.322Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: "2020-03-31"
areaIds: ["quantum-communication"]
topicIds: ["quantum-channel-structure"]
keywords: ["random-unitary decomposition","mixed-unitary rank","symmetric Werner-Holevo channel","orthogonal symmetric unitary basis"]
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Optimal random-unitary decomposition of symmetric Werner--Holevo channels"
aliases: ["op-a40ad449c54093d7","op_a40ad449c54093d7","01M22MSW6TF2CK8PB6W3W7WZCC"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_a40ad449c54093d7.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_a40ad449c54093d7","ulid":"01M22MSW6TF2CK8PB6W3W7WZCC","aliases":["op_a40ad449c54093d7","01M22MSW6TF2CK8PB6W3W7WZCC","op-a40ad449c54093d7"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T08:33:27.258Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":"2020-03-31","areaIds":["quantum-communication"],"topicIds":["quantum-channel-structure"],"keywords":["random-unitary decomposition","mixed-unitary rank","symmetric Werner-Holevo channel","orthogonal symmetric unitary basis"],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Optimal random-unitary decomposition of symmetric Werner--Holevo channels","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum channel structure"],"statement":"For every odd integer $d\\geq5$, do there exist $r=d(d+1)/2$ unitary\noperators $U_1,\\ldots,U_r$ on $\\mathbb C^d$ such that\n\\begin{equation}\n  \\Phi_d(X):=\\frac{\\operatorname{Tr}(X)I_d+X^{\\mathsf T}}{d+1}\n  =\\frac1r\\sum_{j=1}^{r}U_j XU_j^\\dagger\n  \\qquad\\text{for every }X\\in\\mathcal L(\\mathbb C^d)?\n  \\label{eq:a40ad-wh-decomposition}\n\\end{equation}\nThe transpose in Eq.~\\eqref{eq:a40ad-wh-decomposition} is taken in a fixed\northonormal basis.","source":"Girard et al. explicitly conjecture that the symmetric Werner--Holevo\nchannel has mixed-unitary rank equal to its Choi rank; see Section~6,\nfinal paragraph after Theorem~23, p.~29 of the preprint\n\\sourcecite{ref:a40ad-girard}{GLL+22}.","progress":["Let $N(\\Phi_d)$ denote the minimum number of unitary conjugations in a\nconvex decomposition. Its Choi rank gives $N(\\Phi_d)\\geq r$; for odd $d$,\nTheorem~22 gives $N(\\Phi_d)\\leq d(d+3)/2$\n\\sourcecite{ref:a40ad-girard}{GLL+22}.","The optimum $N(\\Phi_d)=r$ holds for every even $d$ and for $d=3$\n(Theorems~21 and~23) \\sourcecite{ref:a40ad-girard}{GLL+22}.\nLevick and Rahaman prove it for every prime $d\\equiv7\\pmod8$\n(Theorem~3.8 and Corollary~3.12) \\sourcecite{ref:a40ad-levick}{LR21}.","Theorem~19 identifies $N(\\Phi_d)=r$ with the existence of a\nHilbert--Schmidt orthogonal basis of the complex symmetric matrices\nconsisting of unitaries. Every optimal $r$-term decomposition necessarily\nhas weights $1/r$, so the uniform formulation in\nEq.~\\eqref{eq:a40ad-wh-decomposition} is equivalent to the rank conjecture\n\\sourcecite{ref:a40ad-girard}{GLL+22}."],"references":[{"key":"GLL+22","label":"ref:a40ad-girard","tex":"M. Girard, D. Leung, J. Levick, C.-K. Li, V. Paulsen, Y. T. Poon,\nand J. Watrous, ``On the Mixed-Unitary Rank of Quantum Channels,''\n\\emph{Communications in Mathematical Physics} \\textbf{394}, 919--951 (2022).\n\\href{https://doi.org/10.1007/s00220-022-04412-y}{doi:10.1007/s00220-022-04412-y};\n\\href{https://arxiv.org/abs/2003.14405}{arXiv:2003.14405}."},{"key":"LR21","label":"ref:a40ad-levick","tex":"J. Levick and M. Rahaman, ``An extension of Bravyi--Smolin's\nconstruction for UMEBs,'' \\emph{Quantum Information Processing}\n\\textbf{20}, 369 (2021).\n\\href{https://doi.org/10.1007/s11128-021-03312-9}{doi:10.1007/s11128-021-03312-9};\n\\href{https://arxiv.org/abs/2105.00975v2}{arXiv:2105.00975v2}."}],"comment":"The unresolved target is the universal odd-dimensional optimum.\nNumerical decompositions do not supply an exact proof. Literature audit:\n9 September 2026. Searches under the channel, rank, and symmetric-unitary-basis\nformulations found no full resolution;\nindexed literature searches cannot exclude unindexed work. The cited partial\nresults are peer-reviewed."}}
---
## Source

Girard et al. explicitly conjecture that the symmetric Werner–Holevo channel has mixed-unitary rank equal to its Choi rank; see Section 6, final paragraph after Theorem 23, p. 29 of the preprint [GLL+22](https://doi.org/10.1007/s00220-022-04412-y).

## Progress

Let $N(\Phi_d)$ denote the minimum number of unitary conjugations in a convex decomposition. Its Choi rank gives $N(\Phi_d)\geq r$; for odd $d$, Theorem 22 gives $N(\Phi_d)\leq d(d+3)/2$ [GLL+22](https://doi.org/10.1007/s00220-022-04412-y).

The optimum $N(\Phi_d)=r$ holds for every even $d$ and for $d=3$ (Theorems 21 and 23) [GLL+22](https://doi.org/10.1007/s00220-022-04412-y). Levick and Rahaman prove it for every prime $d\equiv7\pmod8$ (Theorem 3.8 and Corollary 3.12) [LR21](https://doi.org/10.1007/s11128-021-03312-9).

Theorem 19 identifies $N(\Phi_d)=r$ with the existence of a Hilbert–Schmidt orthogonal basis of the complex symmetric matrices consisting of unitaries. Every optimal $r$-term decomposition necessarily has weights $1/r$, so the uniform formulation in Eq. (1) is equivalent to the rank conjecture [GLL+22](https://doi.org/10.1007/s00220-022-04412-y).

## Comment

The unresolved target is the universal odd-dimensional optimum. Numerical decompositions do not supply an exact proof. Literature audit: 9 September 2026. Searches under the channel, rank, and symmetric-unitary-basis formulations found no full resolution; indexed literature searches cannot exclude unindexed work. The cited partial results are peer-reviewed.

## References

**GLL+22** M. Girard, D. Leung, J. Levick, C.-K. Li, V. Paulsen, Y. T. Poon, and J. Watrous, “On the Mixed-Unitary Rank of Quantum Channels,” *Communications in Mathematical Physics* **394**, 919–951 (2022). [doi:10.1007/s00220-022-04412-y](https://doi.org/10.1007/s00220-022-04412-y); [arXiv:2003.14405](https://arxiv.org/abs/2003.14405).

**LR21** J. Levick and M. Rahaman, “An extension of Bravyi–Smolin’s construction for UMEBs,” *Quantum Information Processing* **20**, 369 (2021). [doi:10.1007/s11128-021-03312-9](https://doi.org/10.1007/s11128-021-03312-9); [arXiv:2105.00975v2](https://arxiv.org/abs/2105.00975v2).
