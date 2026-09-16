---
id: "01M2M9FBBE2TAHMFT2MAQA57WB"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T05:53:34.975Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "editor-formulated"
posed: null
areaIds: ["quantum-algorithm"]
topicIds: ["computational-complexity-and-computability","quantum-circuit-complexity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M2M9FBDRFBTD144AXBZE286J"]
title: "Subquadratic total quantum gate complexity of RSA factoring"
aliases: ["op-15f8ca2e9d5d272b","op_15f8ca2e9d5d272b","01M2M9FBBE2TAHMFT2MAQA57WB"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_15f8ca2e9d5d272b.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_15f8ca2e9d5d272b","ulid":"01M2M9FBBE2TAHMFT2MAQA57WB","aliases":["op_15f8ca2e9d5d272b","01M2M9FBBE2TAHMFT2MAQA57WB","op-15f8ca2e9d5d272b"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.758Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"editor-formulated","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["computational-complexity-and-computability","quantum-circuit-complexity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M2M9FBDRFBTD144AXBZE286J"]},"title":"Subquadratic total quantum gate complexity of RSA factoring","status":"Unsolved","fields":["Quantum algorithm"],"topics":["Computational complexity and computability","Quantum circuit complexity"],"statement":"Can every balanced RSA semiprime be factored with a polynomial improvement over quadratic total quantum gate complexity?\n\nLet $N=pq$ be an $n$-bit integer, where $p\\ne q$ are odd primes of bit length $n/2+O(1)$. Does there exist a constant $\\delta>0$ and a uniform hybrid quantum–classical algorithm that factors every such $N$ with probability at least $2/3$, using\n\n\\begin{equation}\nG_{\\mathrm{total}}(n)=O(n^{2-\\delta})\n\\label{eq:15f8-1}\n\\end{equation}\n\nelementary quantum operations and $n^{O(1)}$ classical computation?\n\nHere total includes every quantum execution, state preparation, restart, measurement, reset, and required gate synthesis. Use a fixed finite universal gate set. Modular exponentiation is compiled into elementary gates rather than supplied as a unit-cost oracle. Classical input-dependent preprocessing is allowed, but factoring advice is not.\n\nThe target is a polynomial improvement in the exponent, not merely removing logarithmic factors from a nearly quadratic construction.\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:15f8-1}.","source":"This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature \\sourcecite{ref:15f8-regev25}{Regev25}\\sourcecite{ref:15f8-pilatte26}{Pilatte26}\\sourcecite{ref:15f8-kahanamokumeyer25}{KahanamokuMeyer25}; it is not presented as a verbatim conjecture of those authors.","progress":["Baseline. Shor established polynomial-time quantum factoring. With fast arithmetic, the relevant benchmark for total quantum work is nearly quadratic in $n$. This is an upper-bound benchmark, not a proven lower bound. \\sourcecite{ref:15f8-shor97}{Shor97}, \\sourcecite{ref:15f8-regev25}{Regev25}","Regev, 2023 preprint / 2025 journal publication. The improved circuit uses $\\widetilde O(n^{3/2})$ gates per execution, but the factoring procedure uses $O(\\sqrt n)$ executions. Thus its displayed resource accounting gives $\\widetilde O(n^2)$ total quantum gates, rather than settling the target above. Reducing the cost of a single coherent run remains valuable even without a total-exponent improvement. \\sourcecite{ref:15f8-regev25}{Regev25}","Correctness update, February 9, 2026. Pilatte proves unconditional correctness for suitable versions of recent factoring and discrete-logarithm algorithms. Consequently, the blanket claim that these approaches still await a number-theoretic correctness conjecture is outdated. That progress does not, by itself, reduce the total quantum gate exponent. \\sourcecite{ref:15f8-pilatte26}{Pilatte26}","Special-instance advance, latest revision July 2, 2026. The Jacobi factoring circuit achieves near-linear quantum gates for a substantial class including certain $P^2Q$ inputs, but explicitly excludes RSA integers themselves. It therefore does not answer the balanced-semiprime question. \\sourcecite{ref:15f8-kahanamokumeyer25}{KahanamokuMeyer25}","Retained as open. Neither a per-run improvement nor an algorithm for a different factorization pattern establishes the specified total-cost bound for RSA semiprimes."],"references":[{"key":"Shor97","label":"ref:15f8-shor97","tex":"Peter W. Shor. \\emph{Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer}. SIAM Journal on Computing 26, 1484–1509 (1997); \\href{https://arxiv.org/abs/quant-ph/9508027}{arXiv:quant-ph/9508027}."},{"key":"Regev25","label":"ref:15f8-regev25","tex":"Oded Regev. \\emph{An Efficient Quantum Factoring Algorithm}. Journal of the ACM 72(1) (2025); \\href{https://arxiv.org/abs/2308.06572}{arXiv:2308.06572}. Inspect the abstract and execution-count accounting, not only the per-circuit gate bound."},{"key":"Pilatte26","label":"ref:15f8-pilatte26","tex":"Cédric Pilatte. \\emph{Unconditional correctness of recent quantum algorithms for factoring and computing discrete logarithms}. \\href{https://www.cambridge.org/core/journals/forum-of-mathematics-pi/article/unconditional-correctness-of-recent-quantum-algorithms-for-factoring-and-computing-discrete-logarithms/3077F5BD48D1F62000B1ED800EB86308}{Forum of Mathematics, Pi}, published February 9, 2026."},{"key":"KahanamokuMeyer25","label":"ref:15f8-kahanamokumeyer25","tex":"Gregory D. Kahanamoku-Meyer, Seyoon Ragavan, Vinod Vaikuntanathan, and Katherine Van Kirk. \\emph{The Jacobi Factoring Circuit: Quantum Factoring with Near-Linear Gates and Sublinear Space and Depth}. STOC 2025; \\href{https://arxiv.org/abs/2412.12558v4}{arXiv:2412.12558v4}, July 2, 2026."}],"comment":"This problem is a precise resource target formulated here, not a named conjecture.\n\nA useful way to expose the obstacle is to write total quantum work as\n\n\\begin{equation}\nG_{\\mathrm{total}}=(\\text{cost per sample})(\\text{number of samples}),\n\\label{eq:15f8-2}\n\\end{equation}\n\nwith any coherent multi-sample processing included. An improvement must beat the product, not just one factor. Possible research directions include sharing arithmetic between samples, extracting more useful information per run, or replacing modular exponentiation with a different arithmetic observable. These are suggested directions, not known solutions.\n\nThis question concerns logical quantum work. A lower gate count need not imply lower physical spacetime under every architecture, and polynomial classical preprocessing could still dominate overall runtime. The companion quantum-memory question asks a genuinely different question: the maximum quantum memory simultaneously required.\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:15f8-2}.","contributors":[]}}
---
## Source

This precise formulation is editor wording based on the unresolved direction and limitations documented in the cited primary literature [Regev25](https://arxiv.org/abs/2308.06572)[Pilatte26](https://www.cambridge.org/core/journals/forum-of-mathematics-pi/article/unconditional-correctness-of-recent-quantum-algorithms-for-factoring-and-computing-discrete-logarithms/3077F5BD48D1F62000B1ED800EB86308)[KahanamokuMeyer25](https://arxiv.org/abs/2412.12558v4); it is not presented as a verbatim conjecture of those authors.

## Progress

Baseline. Shor established polynomial-time quantum factoring. With fast arithmetic, the relevant benchmark for total quantum work is nearly quadratic in $n$. This is an upper-bound benchmark, not a proven lower bound. [Shor97](https://arxiv.org/abs/quant-ph/9508027), [Regev25](https://arxiv.org/abs/2308.06572)

Regev, 2023 preprint / 2025 journal publication. The improved circuit uses $\widetilde O(n^{3/2})$ gates per execution, but the factoring procedure uses $O(\sqrt n)$ executions. Thus its displayed resource accounting gives $\widetilde O(n^2)$ total quantum gates, rather than settling the target above. Reducing the cost of a single coherent run remains valuable even without a total-exponent improvement. [Regev25](https://arxiv.org/abs/2308.06572)

Correctness update, February 9, 2026. Pilatte proves unconditional correctness for suitable versions of recent factoring and discrete-logarithm algorithms. Consequently, the blanket claim that these approaches still await a number-theoretic correctness conjecture is outdated. That progress does not, by itself, reduce the total quantum gate exponent. [Pilatte26](https://www.cambridge.org/core/journals/forum-of-mathematics-pi/article/unconditional-correctness-of-recent-quantum-algorithms-for-factoring-and-computing-discrete-logarithms/3077F5BD48D1F62000B1ED800EB86308)

Special-instance advance, latest revision July 2, 2026. The Jacobi factoring circuit achieves near-linear quantum gates for a substantial class including certain $P^2Q$ inputs, but explicitly excludes RSA integers themselves. It therefore does not answer the balanced-semiprime question. [KahanamokuMeyer25](https://arxiv.org/abs/2412.12558v4)

Retained as open. Neither a per-run improvement nor an algorithm for a different factorization pattern establishes the specified total-cost bound for RSA semiprimes.

## Comment

This problem is a precise resource target formulated here, not a named conjecture.

A useful way to expose the obstacle is to write total quantum work as

$$
G_{\mathrm{total}}=(\text{cost per sample})(\text{number of samples}),
\tag{2}
$$

with any coherent multi-sample processing included. An improvement must beat the product, not just one factor. Possible research directions include sharing arithmetic between samples, extracting more useful information per run, or replacing modular exponentiation with a different arithmetic observable. These are suggested directions, not known solutions.

This question concerns logical quantum work. A lower gate count need not imply lower physical spacetime under every architecture, and polynomial classical preprocessing could still dominate overall runtime. The companion quantum-memory question asks a genuinely different question: the maximum quantum memory simultaneously required.

The displayed definitions, constraints, and target bounds are recorded in Eqs. (2).

## References

**Shor97** Peter W. Shor. *Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer*. SIAM Journal on Computing 26, 1484–1509 (1997); [arXiv:quant-ph/9508027](https://arxiv.org/abs/quant-ph/9508027).

**Regev25** Oded Regev. *An Efficient Quantum Factoring Algorithm*. Journal of the ACM 72(1) (2025); [arXiv:2308.06572](https://arxiv.org/abs/2308.06572). Inspect the abstract and execution-count accounting, not only the per-circuit gate bound.

**Pilatte26** Cédric Pilatte. *Unconditional correctness of recent quantum algorithms for factoring and computing discrete logarithms*. [Forum of Mathematics, Pi](https://www.cambridge.org/core/journals/forum-of-mathematics-pi/article/unconditional-correctness-of-recent-quantum-algorithms-for-factoring-and-computing-discrete-logarithms/3077F5BD48D1F62000B1ED800EB86308), published February 9, 2026.

**KahanamokuMeyer25** Gregory D. Kahanamoku-Meyer, Seyoon Ragavan, Vinod Vaikuntanathan, and Katherine Van Kirk. *The Jacobi Factoring Circuit: Quantum Factoring with Near-Linear Gates and Sublinear Space and Depth*. STOC 2025; [arXiv:2412.12558v4](https://arxiv.org/abs/2412.12558v4), July 2, 2026.
