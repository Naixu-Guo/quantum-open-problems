---
id: "01M22C443FNCYPRHCEFQK17404"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T06:02:34.082Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity-and-computability"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Geelen's simulation conjecture for vertex-minor-closed graph classes"
aliases: ["op-1726fa212d725bc8","op_1726fa212d725bc8","01M22C443FNCYPRHCEFQK17404"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_1726fa212d725bc8.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_1726fa212d725bc8","ulid":"01M22C443FNCYPRHCEFQK17404","aliases":["op_1726fa212d725bc8","01M22C443FNCYPRHCEFQK17404","op-1726fa212d725bc8"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T06:01:45.839Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity-and-computability"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Geelen's simulation conjecture for vertex-minor-closed graph classes","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity and computability"],"statement":"Does Geelen's simulation conjecture hold for every nonempty proper class $\\mathcal C\\subsetneq\\mathcal G_{\\mathrm{fin}}$ of finite simple graphs that is closed under isomorphism, local complementation, and vertex deletion? Here $\\mathcal G_{\\mathrm{fin}}$ denotes all finite simple graphs, and local complementation toggles the edges between distinct neighbors of one vertex. The resource state of $G=(V,E)\\in\\mathcal C$, with $n:=|V|$, is defined in Eq.~\\eqref{eq:gsc-state}:\n\\begin{equation}\n\\begin{aligned}\n|G\\rangle&:=\\prod_{\\{u,v\\}\\in E}CZ_{uv}|+\\rangle^{\\otimes n},\\\\\n|+\\rangle&:=\\frac{|0\\rangle+|1\\rangle}{\\sqrt2},\n\\qquad CZ:=\\operatorname{diag}(1,1,1,-1).\n\\end{aligned}\n\\label{eq:gsc-state}\n\\end{equation}\nLet $\\mathsf{BQP}_{\\mathcal C}$ denote the languages decided with error at most $1/3$ by uniform polynomial-time measurement-based quantum computations whose classical controller generates a graph in $\\mathcal C$ and adaptively specifies single-qubit projective measurements with polynomial-size, efficiently evaluable algebraic descriptions, allowing randomized polynomial-time classical processing. Let $\\mathsf{BPP}$ denote randomized classical polynomial-time decision with error at most $1/3$. The conjectured equality is Eq.~\\eqref{eq:gsc-conjecture}:\n\\begin{equation}\n\\mathsf{BQP}_{\\mathcal C}=\\mathsf{BPP}.\n\\label{eq:gsc-conjecture}\n\\end{equation}","source":"The Simulation Conjecture is attributed to Geelen (personal communication, 2018) and recorded by McCarty in Section 1.4, p.~18 of her thesis \\sourcecite{ref:gsc-geelen}{McC21}. The bounded-error uniform decision interpretation is source-stated; the explicit finite algebraic-description convention in this entry is the supplied formulation of that computational model.","progress":["Theorems 3 and 4 and the decomposition discussion in Section IV.2 show that bounded rank-width gives an established efficiently simulable family: for each fixed nonnegative integer $r$, define $\\mathcal C_r:=\\{G:\\operatorname{rwd}(G)\\leq r\\}$, where $\\operatorname{rwd}(G)$ is the minimum, over subcubic trees with leaves labelled by $V(G)$, of the maximum binary rank of the adjacency submatrix across an edge-induced bipartition; then\n  \\begin{equation}\n\\mathsf{BQP}_{\\mathcal C_r}=\\mathsf{BPP}.\n\\label{eq:gsc-progress-3}\n\\end{equation}\n  The simulation establishing Eq.~\\eqref{eq:gsc-progress-3} uses a tree tensor network with bond dimension at most $2^r$ once a width-$r$ decomposition is supplied; for fixed $r$, suitable bounded-width decompositions can also be found efficiently. \\sourcecite{ref:gsc-rank-width}{VDVB07}","McCarty's thesis, Section 1.4, p.~18, records the conjecture in this bounded-error computational setting: the general inclusions are\n  \\begin{equation}\n\\mathsf{BPP}\\subseteq\\mathsf{BQP}_{\\mathcal C}\\subseteq\\mathsf{BQP},\n\\label{eq:gsc-progress-4}\n\\end{equation}\n  In Eq.~\\eqref{eq:gsc-progress-4}, $\\mathsf{BQP}$ is bounded-error quantum polynomial time, and the conjecture asserts that the first inclusion is an equality for every proper vertex-minor-closed class, not merely for bounded-rank-width classes. \\sourcecite{ref:gsc-geelen}{McC21}","Let $\\mathcal C_{\\mathrm{circ}}$ be the class of intersection graphs of chords of a circle; Harrison and coauthors establish (version 2, Corollary 7.4) efficient randomized sampling of adaptive measurement outcomes and hence\n  \\begin{equation}\n\\mathsf{BQP}_{\\mathcal C_{\\mathrm{circ}}}=\\mathsf{BPP}.\n\\label{eq:gsc-progress-5}\n\\end{equation}\n  The simulation equality in Eq.~\\eqref{eq:gsc-progress-5} was first announced in 2025; the corrected May 2026 version retains the sampling result but withdraws an earlier claim that arbitrary marginal probabilities can be computed in polynomial time, so weak simulation must not be conflated with that stronger task. \\sourcecite{ref:gsc-circle-simulation}{HIP+25}","The 2026 structural analysis (Corollary 3 and Appendix A, Lemma 4) gives an alternative simulation route for circle graphs and exhibits circle graphs of polynomially growing rank-width, in particular a constant $c>0$ and infinitely many $n$ for which\n  \\begin{equation}\n\\exists G\\in\\mathcal C_{\\mathrm{circ}}:\n  \\qquad |V(G)|=n,\n  \\qquad \\operatorname{rwd}(G)\\geq c\\sqrt n.\n\\label{eq:gsc-progress-6}\n\\end{equation}\n  The rank-width bound in Eq.~\\eqref{eq:gsc-progress-6} shows that the circle-graph result genuinely extends the bounded-rank-width case; an August 2026 follow-up (Appendix F.1, after Definition F.2) still explicitly identifies the general simulation statement as the McCarty–Geelen conjecture. \\sourcecite{ref:gsc-circle-structure}{HMNC26}, \\sourcecite{ref:gsc-asymptotic}{GS26}"],"references":[{"key":"VDVB07","label":"ref:gsc-rank-width","tex":"M. Van den Nest, W. Dür, G. Vidal, and H. J. Briegel, ``Classical Simulation versus Universality in Measurement-Based Quantum Computation,'' \\emph{Physical Review A} \\textbf{75}, 012337 (2007). \\href{https://doi.org/10.1103/PhysRevA.75.012337}{doi:10.1103/PhysRevA.75.012337}; \\href{https://arxiv.org/abs/quant-ph/0608060}{arXiv:quant-ph/0608060}."},{"key":"McC21","label":"ref:gsc-geelen","tex":"R. McCarty, ``Local Structure for Vertex-Minors,'' PhD thesis, University of Waterloo (2021). \\href{https://uwspace.uwaterloo.ca/items/1cfbfc52-2e30-44a4-b3fb-28493c3d94f0}{University repository}."},{"key":"HIP+25","label":"ref:gsc-circle-simulation","tex":"B. Harrison, V. Iyer, O. Parekh, K. Thompson, and A. Zhao, ``Fermionic Insights into Measurement-Based Quantum Computation: Circle Graph States Are Not Universal Resources,'' arXiv preprint (2025), corrected version 2, 17 May 2026. \\href{https://doi.org/10.48550/arXiv.2510.05557}{doi:10.48550/arXiv.2510.05557}; \\href{https://arxiv.org/abs/2510.05557}{arXiv:2510.05557}."},{"key":"HMNC26","label":"ref:gsc-circle-structure","tex":"F. Hahn, R. McCarty, H. Poulsen Nautrup, and N. Claudet, ``The Structure of Circle Graph States,'' arXiv preprint (2026), version 2, 28 April 2026. \\href{https://doi.org/10.48550/arXiv.2603.08847}{doi:10.48550/arXiv.2603.08847}; \\href{https://arxiv.org/abs/2603.08847}{arXiv:2603.08847}."},{"key":"GS26","label":"ref:gsc-asymptotic","tex":"K. Goodenough and M. Sales, ``Asymptotic Entanglement in Circle Stabilizer States and States Forbidding Arbitrary Vertex-Minors,'' arXiv preprint (2026). \\href{https://doi.org/10.48550/arXiv.2608.21526}{doi:10.48550/arXiv.2608.21526}; \\href{https://arxiv.org/abs/2608.21526}{arXiv:2608.21526}."}],"comment":"No general proof or counterexample was found in the public literature checked through 9 September 2026; the known simulators cover particular proper classes, not every such class. The question concerns efficient bounded-error decision simulation of finitely specified computations, not exact evaluation of all marginals or an oracle for membership in an arbitrary graph class. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit."}}
---
## Source

The Simulation Conjecture is attributed to Geelen (personal communication, 2018) and recorded by McCarty in Section 1.4, p. 18 of her thesis [McC21](https://uwspace.uwaterloo.ca/items/1cfbfc52-2e30-44a4-b3fb-28493c3d94f0). The bounded-error uniform decision interpretation is source-stated; the explicit finite algebraic-description convention in this entry is the supplied formulation of that computational model.

## Progress

Theorems 3 and 4 and the decomposition discussion in Section IV.2 show that bounded rank-width gives an established efficiently simulable family: for each fixed nonnegative integer $r$, define $\mathcal C_r:=\{G:\operatorname{rwd}(G)\leq r\}$, where $\operatorname{rwd}(G)$ is the minimum, over subcubic trees with leaves labelled by $V(G)$, of the maximum binary rank of the adjacency submatrix across an edge-induced bipartition; then

$$
\mathsf{BQP}_{\mathcal C_r}=\mathsf{BPP}.
\tag{3}
$$

The simulation establishing Eq. (3) uses a tree tensor network with bond dimension at most $2^r$ once a width-$r$ decomposition is supplied; for fixed $r$, suitable bounded-width decompositions can also be found efficiently. [VDVB07](https://doi.org/10.1103/PhysRevA.75.012337)

McCarty’s thesis, Section 1.4, p. 18, records the conjecture in this bounded-error computational setting: the general inclusions are

$$
\mathsf{BPP}\subseteq\mathsf{BQP}_{\mathcal C}\subseteq\mathsf{BQP},
\tag{4}
$$

In Eq. (4), $\mathsf{BQP}$ is bounded-error quantum polynomial time, and the conjecture asserts that the first inclusion is an equality for every proper vertex-minor-closed class, not merely for bounded-rank-width classes. [McC21](https://uwspace.uwaterloo.ca/items/1cfbfc52-2e30-44a4-b3fb-28493c3d94f0)

Let $\mathcal C_{\mathrm{circ}}$ be the class of intersection graphs of chords of a circle; Harrison and coauthors establish (version 2, Corollary 7.4) efficient randomized sampling of adaptive measurement outcomes and hence

$$
\mathsf{BQP}_{\mathcal C_{\mathrm{circ}}}=\mathsf{BPP}.
\tag{5}
$$

The simulation equality in Eq. (5) was first announced in 2025; the corrected May 2026 version retains the sampling result but withdraws an earlier claim that arbitrary marginal probabilities can be computed in polynomial time, so weak simulation must not be conflated with that stronger task. [HIP+25](https://doi.org/10.48550/arXiv.2510.05557)

The 2026 structural analysis (Corollary 3 and Appendix A, Lemma 4) gives an alternative simulation route for circle graphs and exhibits circle graphs of polynomially growing rank-width, in particular a constant $c>0$ and infinitely many $n$ for which

$$
\exists G\in\mathcal C_{\mathrm{circ}}:
 \qquad |V(G)|=n,
 \qquad \operatorname{rwd}(G)\geq c\sqrt n.
\tag{6}
$$

The rank-width bound in Eq. (6) shows that the circle-graph result genuinely extends the bounded-rank-width case; an August 2026 follow-up (Appendix F.1, after Definition F.2) still explicitly identifies the general simulation statement as the McCarty–Geelen conjecture. [HMNC26](https://doi.org/10.48550/arXiv.2603.08847), [GS26](https://doi.org/10.48550/arXiv.2608.21526)

## Comment

No general proof or counterexample was found in the public literature checked through 9 September 2026; the known simulators cover particular proper classes, not every such class. The question concerns efficient bounded-error decision simulation of finitely specified computations, not exact evaluation of all marginals or an oracle for membership in an arbitrary graph class. The status audit used public primary sources and later-work searches; it is not an exhaustive citation-index audit.

## References

**VDVB07** M. Van den Nest, W. Dür, G. Vidal, and H. J. Briegel, “Classical Simulation versus Universality in Measurement-Based Quantum Computation,” *Physical Review A* **75**, 012337 (2007). [doi:10.1103/PhysRevA.75.012337](https://doi.org/10.1103/PhysRevA.75.012337); [arXiv:quant-ph/0608060](https://arxiv.org/abs/quant-ph/0608060).

**McC21** R. McCarty, “Local Structure for Vertex-Minors,” PhD thesis, University of Waterloo (2021). [University repository](https://uwspace.uwaterloo.ca/items/1cfbfc52-2e30-44a4-b3fb-28493c3d94f0).

**HIP+25** B. Harrison, V. Iyer, O. Parekh, K. Thompson, and A. Zhao, “Fermionic Insights into Measurement-Based Quantum Computation: Circle Graph States Are Not Universal Resources,” arXiv preprint (2025), corrected version 2, 17 May 2026. [doi:10.48550/arXiv.2510.05557](https://doi.org/10.48550/arXiv.2510.05557); [arXiv:2510.05557](https://arxiv.org/abs/2510.05557).

**HMNC26** F. Hahn, R. McCarty, H. Poulsen Nautrup, and N. Claudet, “The Structure of Circle Graph States,” arXiv preprint (2026), version 2, 28 April 2026. [doi:10.48550/arXiv.2603.08847](https://doi.org/10.48550/arXiv.2603.08847); [arXiv:2603.08847](https://arxiv.org/abs/2603.08847).

**GS26** K. Goodenough and M. Sales, “Asymptotic Entanglement in Circle Stabilizer States and States Forbidding Arbitrary Vertex-Minors,” arXiv preprint (2026). [doi:10.48550/arXiv.2608.21526](https://doi.org/10.48550/arXiv.2608.21526); [arXiv:2608.21526](https://arxiv.org/abs/2608.21526).
