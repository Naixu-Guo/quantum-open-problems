---
id: "01M87VW3W5X9KE87170EKHMGDR"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-11-27T01:42:25.991Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-computation"]
topicIds: ["computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M20EG8DVMFZX9TWEXN602APF","01M6QPWWVNB3XX451C81W80JWR"]
title: "Linear-query quantum detection of a four-cycle"
aliases: ["op-9ce69cbf239dab98","op_9ce69cbf239dab98","01M87VW3W5X9KE87170EKHMGDR"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_9ce69cbf239dab98.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_9ce69cbf239dab98","ulid":"01M87VW3W5X9KE87170EKHMGDR","aliases":["op_9ce69cbf239dab98","01M87VW3W5X9KE87170EKHMGDR","op-9ce69cbf239dab98"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-11-24T22:47:23.781Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-computation"],"topicIds":["computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M20EG8DVMFZX9TWEXN602APF","01M6QPWWVNB3XX451C81W80JWR"]},"title":"Linear-query quantum detection of a four-cycle","status":"Unsolved","fields":["Quantum Computation"],"topics":["Computational complexity and computability"],"statement":"An unknown simple undirected graph on $n$ vertices is supplied through its adjacency bits $A_{uv}$. A quantum query acts as $\\lvert u,v,z\\rangle\\mapsto\\lvert u,v,z\\oplus A_{uv}\\rangle$, where $\\oplus$ is addition modulo two. The algorithm must decide whether there are four distinct vertices $u,v,w,x$ with $A_{uv}=A_{vw}=A_{wx}=A_{xu}=1$. Additional edges among these vertices are allowed. The algorithm must succeed with probability at least $2/3$ for every graph, and only oracle calls are counted.\n\nIs there a quantum algorithm that solves this task with $O(n)$ queries in the worst case?","source":"Gilani and Zhou single out the four-cycle among the open small complete bipartite patterns and ask which fixed subgraphs admit linear-query detection, in Sec.~1.4 under \\emph{Triangles and small bipartite subgraphs} \\sourcecite{ref:fourcycle-gz}{GZ26}.","progress":["Childs and Kothari give a $\\widetilde O(n^{5/4})$-query algorithm in Theorem~4.12, with $\\widetilde O$ hiding polylogarithmic factors. Their Theorem~3.3 gives a linear lower bound for the complementary property of being four-cycle-free, which is closed under taking subgraphs \\sourcecite{ref:fourcycle-ck}{CK12}.","A linear-query algorithm is known if the input is promised to be either a forest or to contain a four-cycle. Theorem~3.24 of Cornelissen et al.\\ treats this promise for any fixed cycle length \\sourcecite{ref:fourcycle-cgp}{CGP26}."],"references":[{"key":"GZ26","label":"ref:fourcycle-gz","tex":"A. S. Gilani and X. Zhou, \\emph{Superlinear Quantum Query Lower Bounds for Subgraph Detection}, preprint (2026). \\href{https://arxiv.org/abs/2609.40263v2}{arXiv:2609.40263v2}."},{"key":"CK12","label":"ref:fourcycle-ck","tex":"A. M. Childs and R. Kothari, \\emph{Quantum Query Complexity of Minor-Closed Graph Properties}, SIAM Journal on Computing \\textbf{41}, 1426--1450 (2012). \\href{https://doi.org/10.1137/110833026}{doi:10.1137/110833026}. \\href{https://arxiv.org/abs/1011.1443v2}{arXiv:1011.1443v2}."},{"key":"CGP26","label":"ref:fourcycle-cgp","tex":"A. Cornelissen, A. S. Gilani, and S. Patro, \\emph{Quantum Algorithms for Path and Cycle Containment Problems}, in APPROX/RANDOM 2026, LIPIcs \\textbf{392}, Article 72 (2026). \\href{https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2026.72}{doi:10.4230/LIPIcs.APPROX/RANDOM.2026.72}. \\href{https://arxiv.org/abs/2605.09017v2}{arXiv:2605.09017v2}."}],"comment":"The \\href{https://qiqc-op.com/problem/op_0c17d9fef967858d/}{triangle-finding problem} asks for a cycle on three vertices. Here the four-cycle may occur in a graph that also contains triangles or longer cycles. The catalog and literature were checked through November 26, 2026.","contributors":[]}}
---
## Source

Gilani and Zhou single out the four-cycle among the open small complete bipartite patterns and ask which fixed subgraphs admit linear-query detection, in Sec. 1.4 under *Triangles and small bipartite subgraphs* [GZ26](https://arxiv.org/abs/2609.40263v2).

## Progress

Childs and Kothari give a $\widetilde O(n^{5/4})$-query algorithm in Theorem 4.12, with $\widetilde O$ hiding polylogarithmic factors. Their Theorem 3.3 gives a linear lower bound for the complementary property of being four-cycle-free, which is closed under taking subgraphs [CK12](https://doi.org/10.1137/110833026).

A linear-query algorithm is known if the input is promised to be either a forest or to contain a four-cycle. Theorem 3.24 of Cornelissen et al. treats this promise for any fixed cycle length [CGP26](https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2026.72).

## Comment

The [triangle-finding problem](https://qiqc-op.com/problem/op_0c17d9fef967858d/) asks for a cycle on three vertices. Here the four-cycle may occur in a graph that also contains triangles or longer cycles. The catalog and literature were checked through November 26, 2026.

## References

**GZ26** A. S. Gilani and X. Zhou, *Superlinear Quantum Query Lower Bounds for Subgraph Detection*, preprint (2026). [arXiv:2609.40263v2](https://arxiv.org/abs/2609.40263v2).

**CK12** A. M. Childs and R. Kothari, *Quantum Query Complexity of Minor-Closed Graph Properties*, SIAM Journal on Computing **41**, 1426–1450 (2012). [doi:10.1137/110833026](https://doi.org/10.1137/110833026). [arXiv:1011.1443v2](https://arxiv.org/abs/1011.1443v2).

**CGP26** A. Cornelissen, A. S. Gilani, and S. Patro, *Quantum Algorithms for Path and Cycle Containment Problems*, in APPROX/RANDOM 2026, LIPIcs **392**, Article 72 (2026). [doi:10.4230/LIPIcs.APPROX/RANDOM.2026.72](https://doi.org/10.4230/LIPIcs.APPROX/RANDOM.2026.72). [arXiv:2605.09017v2](https://arxiv.org/abs/2605.09017v2).
