---
id: "01M2M9FB96NK6Y6EMA2PM3M8DM"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T05:53:34.975Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["channel-simulation","one-shot-and-finite-blocklength-bounds"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "High-dimensional crossover of optimized port-based teleportation"
aliases: ["op-25342dbb8d64e728","op_25342dbb8d64e728","01M2M9FB96NK6Y6EMA2PM3M8DM"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_25342dbb8d64e728.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_25342dbb8d64e728","ulid":"01M2M9FB96NK6Y6EMA2PM3M8DM","aliases":["op_25342dbb8d64e728","01M2M9FB96NK6Y6EMA2PM3M8DM","op-25342dbb8d64e728"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.686Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["channel-simulation","one-shot-and-finite-blocklength-bounds"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"High-dimensional crossover of optimized port-based teleportation","status":"Unsolved","fields":["Quantum Communication"],"topics":["Channel simulation","One-shot and finite-blocklength bounds"],"statement":"Does optimized deterministic port-based teleportation have a limiting fidelity when the number of ports is proportional to the square of the input dimension, and what is that limit?\n\nLet $F_d^*(N)$ denote the maximum entanglement fidelity of deterministic port-based teleportation of one unknown $d$-dimensional state using $N$ ports. Both the input-independent resource and Alice's measurement are optimized; Bob only selects a port.\n\nExplicitly, entanglement fidelity means\n\n\\begin{equation}\nF_e(\\mathcal T):=\\operatorname{Tr}\\!\\left[\\Phi_d(\\operatorname{id}\\otimes\\mathcal T)(\\Phi_d)\\right],\n\\qquad\n\\Phi_d:=\\frac{1}{d}\\sum_{a,b=1}^{d}|aa\\rangle\\langle bb|.\n\\label{eq:2534-1}\n\\end{equation}\n\nFor a real number $c>0$, set\n\n\\begin{equation}\nN_d:=\\max\\{1,\\lfloor c d^2\\rfloor\\}.\n\\label{eq:2534-2}\n\\end{equation}\n\nWhat is the limiting fidelity\n\n\\begin{equation}\n\\varphi(c):=\\lim_{d\\to\\infty}F_d^*(N_d)\n\\label{eq:2534-3}\n\\end{equation}\n\nfor each $c>0$, including whether this limit exists?\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:2534-1}, \\eqref{eq:2534-2}, \\eqref{eq:2534-3}.","source":"The question is explicitly posed or retained as open in the cited primary literature \\sourcecite{ref:2534-christandl21}{Christandl21}\\sourcecite{ref:2534-yoshida26}{Yoshida26}.  The statement is rewritten here to make its hypotheses and success criterion self-contained.","progress":["Finite-resource optimization is already characterized by a teleportation-matrix eigenvalue. In particular,\n  \\begin{equation}\nF_d^*(N)=\\frac{N}{d^2}\\qquad(1\\leq N\\leq d).\n\\label{eq:2534-4}\n\\end{equation}\n  This exact regime does not reach $N\\sim c d^2$ for fixed positive $c$. \\sourcecite{ref:2534-mozrzymas18}{Mozrzymas18}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:2534-4}.","The optimized exact probabilistic protocol has success probability\n  \\begin{equation}\np_d^*(N)=\\frac{N}{N+d^2-1}.\n\\label{eq:2534-5}\n\\end{equation}\n  Converting failure into an arbitrary port output gives a deterministic protocol with fidelity at least $p_d^*(N)$. Consequently,\n  \\begin{equation}\n\\liminf_{d\\to\\infty}F_d^*(N_d)\\geq\\frac{c}{1+c}.\n\\label{eq:2534-6}\n\\end{equation}\n  Section 8 explicitly identifies the fixed-ratio limit as an open direction. \\sourcecite{ref:2534-christandl21}{Christandl21}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:2534-5}, \\eqref{eq:2534-6}.","An elementary no-signalling consequence of the protocol model gives\n  \\begin{equation}\nF_d^*(N)\\leq\\min\\left\\{1,\\frac{N}{d^2}\\right\\}.\n\\label{eq:2534-7}\n\\end{equation}\n  Indeed, for a fixed port $B_i$, its subnormalized reference–output state in branch $i$ is bounded above by the unconditional state $\\mathbb I_R/d\\otimes\\rho_{B_i}$. Its overlap with $\\Phi_d$ is therefore at most $1/d^2$; summing over $N$ selected-port branches proves the bound. Combining this derivation with the preceding lower bound yields the useful, not claimed sharp, bracket\n  \\begin{equation}\n\\frac{c}{1+c}\n  \\leq\\liminf_{d\\to\\infty}F_d^*(N_d)\n  \\leq\\limsup_{d\\to\\infty}F_d^*(N_d)\n  \\leq\\min\\{1,c\\}.\n\\label{eq:2534-8}\n\\end{equation}\n  This paragraph supplies a direct derivation rather than attributing the bracket to a new theorem of the cited paper. \\sourcecite{ref:2534-christandl21}{Christandl21}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:2534-7}, \\eqref{eq:2534-8}.","The 2026 correspondence relates the problem to unitary estimation with $N_d-1$ queries, but its order estimate $1-F_d^*(N)=\\Theta(d^4N^{-2})$ does not determine $\\varphi(c)$. In particular, a fixed-$d$ expansion cannot be substituted into this joint limit without uniform error control. \\sourcecite{ref:2534-yoshida26}{Yoshida26}"],"references":[{"key":"Mozrzymas18","label":"ref:2534-mozrzymas18","tex":"M. Mozrzymas, M. Studziński, S. Strelchuk, and M. Horodecki, \"Optimal Port-based Teleportation,\" \\emph{New Journal of Physics} 20, 053006 (2018). \\href{https://doi.org/10.1088/1367-2630/aab8e7}{doi:10.1088/1367-2630/aab8e7}; \\href{https://arxiv.org/abs/1707.08456}{arXiv:1707.08456}."},{"key":"Christandl21","label":"ref:2534-christandl21","tex":"M. Christandl, F. Leditzky, C. Majenz, G. Smith, F. Speelman, and M. Walter, \"Asymptotic performance of port-based teleportation,\" \\emph{Communications in Mathematical Physics} 381, 379–451 (2021). \\href{https://doi.org/10.1007/s00220-020-03884-0}{doi:10.1007/s00220-020-03884-0}; \\href{https://arxiv.org/abs/1809.10751}{arXiv:1809.10751}."},{"key":"Yoshida26","label":"ref:2534-yoshida26","tex":"S. Yoshida, Y. Koizumi, M. Studziński, M. T. Quintino, and M. Murao, \"One-to-One Correspondence between Deterministic Port-Based Teleportation and Unitary Estimation,\" \\emph{IEEE Transactions on Information Theory} 72, 2358–2377 (2026). \\href{https://doi.org/10.1109/TIT.2026.3658543}{doi:10.1109/TIT.2026.3658543}; \\href{https://arxiv.org/abs/2408.11902}{arXiv:2408.11902}."}],"comment":"A literature check through 15 September 2026 located no determination of this crossover function or general proof of the displayed limit. This is distinct from the fixed-dimensional asymptotic-coefficient problem: the input dimension grows together with the resource, so dimension-dependent remainders matter. The result would quantify high-dimensional port requirements rather than extrapolating a fixed-dimensional approximation.","contributors":[]}}
---
## Source

The question is explicitly posed or retained as open in the cited primary literature [Christandl21](https://doi.org/10.1007/s00220-020-03884-0)[Yoshida26](https://doi.org/10.1109/TIT.2026.3658543). The statement is rewritten here to make its hypotheses and success criterion self-contained.

## Progress

Finite-resource optimization is already characterized by a teleportation-matrix eigenvalue. In particular,

$$
F_d^*(N)=\frac{N}{d^2}\qquad(1\leq N\leq d).
\tag{4}
$$

This exact regime does not reach $N\sim c d^2$ for fixed positive $c$. [Mozrzymas18](https://doi.org/10.1088/1367-2630/aab8e7)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (4).

The optimized exact probabilistic protocol has success probability

$$
p_d^*(N)=\frac{N}{N+d^2-1}.
\tag{5}
$$

Converting failure into an arbitrary port output gives a deterministic protocol with fidelity at least $p_d^*(N)$. Consequently,

$$
\liminf_{d\to\infty}F_d^*(N_d)\geq\frac{c}{1+c}.
\tag{6}
$$

Section 8 explicitly identifies the fixed-ratio limit as an open direction. [Christandl21](https://doi.org/10.1007/s00220-020-03884-0)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (5), (6).

An elementary no-signalling consequence of the protocol model gives

$$
F_d^*(N)\leq\min\left\{1,\frac{N}{d^2}\right\}.
\tag{7}
$$

Indeed, for a fixed port $B_i$, its subnormalized reference–output state in branch $i$ is bounded above by the unconditional state $\mathbb I_R/d\otimes\rho_{B_i}$. Its overlap with $\Phi_d$ is therefore at most $1/d^2$; summing over $N$ selected-port branches proves the bound. Combining this derivation with the preceding lower bound yields the useful, not claimed sharp, bracket

$$
\frac{c}{1+c}
 \leq\liminf_{d\to\infty}F_d^*(N_d)
 \leq\limsup_{d\to\infty}F_d^*(N_d)
 \leq\min\{1,c\}.
\tag{8}
$$

This paragraph supplies a direct derivation rather than attributing the bracket to a new theorem of the cited paper. [Christandl21](https://doi.org/10.1007/s00220-020-03884-0)

The displayed definitions, constraints, and target bounds are recorded in Eqs. (7), (8).

The 2026 correspondence relates the problem to unitary estimation with $N_d-1$ queries, but its order estimate $1-F_d^*(N)=\Theta(d^4N^{-2})$ does not determine $\varphi(c)$. In particular, a fixed-$d$ expansion cannot be substituted into this joint limit without uniform error control. [Yoshida26](https://doi.org/10.1109/TIT.2026.3658543)

## Comment

A literature check through 15 September 2026 located no determination of this crossover function or general proof of the displayed limit. This is distinct from the fixed-dimensional asymptotic-coefficient problem: the input dimension grows together with the resource, so dimension-dependent remainders matter. The result would quantify high-dimensional port requirements rather than extrapolating a fixed-dimensional approximation.

## References

**Mozrzymas18** M. Mozrzymas, M. Studziński, S. Strelchuk, and M. Horodecki, "Optimal Port-based Teleportation," *New Journal of Physics* 20, 053006 (2018). [doi:10.1088/1367-2630/aab8e7](https://doi.org/10.1088/1367-2630/aab8e7); [arXiv:1707.08456](https://arxiv.org/abs/1707.08456).

**Christandl21** M. Christandl, F. Leditzky, C. Majenz, G. Smith, F. Speelman, and M. Walter, "Asymptotic performance of port-based teleportation," *Communications in Mathematical Physics* 381, 379–451 (2021). [doi:10.1007/s00220-020-03884-0](https://doi.org/10.1007/s00220-020-03884-0); [arXiv:1809.10751](https://arxiv.org/abs/1809.10751).

**Yoshida26** S. Yoshida, Y. Koizumi, M. Studziński, M. T. Quintino, and M. Murao, "One-to-One Correspondence between Deterministic Port-Based Teleportation and Unitary Estimation," *IEEE Transactions on Information Theory* 72, 2358–2377 (2026). [doi:10.1109/TIT.2026.3658543](https://doi.org/10.1109/TIT.2026.3658543); [arXiv:2408.11902](https://arxiv.org/abs/2408.11902).
