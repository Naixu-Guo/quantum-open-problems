---
id: "01M2M9FBVAPKNR5GMT7E2CK83C"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-16T06:50:03.694Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-cryptography"]
topicIds: ["computational-complexity-and-computability","quantum-circuit-complexity"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Scalable pseudorandom unitaries with an independent security parameter"
aliases: ["op-f271040c57d9a513","op_f271040c57d9a513","01M2M9FBVAPKNR5GMT7E2CK83C"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_f271040c57d9a513.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_f271040c57d9a513","ulid":"01M2M9FBVAPKNR5GMT7E2CK83C","aliases":["op_f271040c57d9a513","01M2M9FBVAPKNR5GMT7E2CK83C","op-f271040c57d9a513"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:48.266Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-cryptography"],"topicIds":["computational-complexity-and-computability","quantum-circuit-complexity"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Scalable pseudorandom unitaries with an independent security parameter","status":"Unsolved","fields":["Quantum Cryptography"],"topics":["Computational complexity and computability","Quantum circuit complexity"],"statement":"Can pseudorandom-unitary security scale independently of Hilbert-space dimension while construction uses only polynomially many oracle queries?\n\nFor $d=2^n$ and an independent security parameter $\\kappa$, seek a uniformly generated family $\\{U_{n,\\kappa,f}\\}_f$ indexed by Boolean functions $f:\\{0,1\\}^r\\to\\{0,1\\}$, with $r,q\\leq\\operatorname{poly}(n,\\kappa)$, and an algorithm $\\mathcal A^f$ using at most $q$ oracle queries such that\n\n\\begin{equation}\n\\left\\|\\mathcal A^f-U_{n,\\kappa,f}(\\,\\cdot\\,)U_{n,\\kappa,f}^\\dagger\\right\\|_\\diamond\n\\leq2^{-\\kappa}\n\\label{eq:f271-1}\n\\end{equation}\n\nfor every $f$. For uniformly random $f$, require\n\n\\begin{equation}\n\\sup_{\\mathcal D:\\,\\#\\mathrm{queries}\\leq2^\\kappa}\n\\left|\\Pr_f[\\mathcal D^{U_{n,\\kappa,f}}=1]\n-\\Pr_{V\\sim\\operatorname{Haar}(d)}[\\mathcal D^V=1]\\right|\n\\leq2^{-\\kappa}.\n\\label{eq:f271-2}\n\\end{equation}\n\nDoes a family satisfying Eqs.~\\eqref{eq:f271-1} and \\eqref{eq:f271-2} exist with no imposed relation between $n$ and $\\kappa$? The distinguisher accesses the ideal unitary, not the function $f$.","source":"The question is explicitly posed or retained as open in the cited primary literature \\sourcecite{ref:f271-brakerski26}{Brakerski26}.  The statement is rewritten here to make its hypotheses and success criterion self-contained.","progress":["Status: explicitly unresolved in the 2026 source. Brakerski and Yuen analyze this scalable formulation, establish barriers for existing candidates, and connect a positive answer to unitary synthesis. Their baseline construction has polynomial dependence on $d$, rather than the required $\\log d$. Thus it does not resolve the displayed problem. \\sourcecite{ref:f271-brakerski26}{Brakerski26}","Their distinguishing attack on the PFC construction is not a universal impossibility theorem for scalable PRUs, and the paper leaves the general construction problem unresolved. \\sourcecite{ref:f271-brakerski26}{Brakerski26}"],"references":[{"key":"Brakerski26","label":"ref:f271-brakerski26","tex":"Zvika Brakerski and Henry Yuen, \\emph{On Scalable Pseudorandom Unitaries and the Unitary Synthesis Problem}. \\href{https://arxiv.org/html/2605.09957v1}{arXiv:2605.09957v1}, submitted 11 May 2026; CRYPTO 2026. See Definitions 4.1 and 4.4, §4.1, Lemma 4.7, and §6."}],"comment":"This is deliberately an oracle-query problem. A query-efficient construction is not automatically a gate-efficient, standard-model cryptosystem. That distinction should remain explicit in any proposed solution.\n\nThe independence of parameters is substantive. A distinguishing bound involving $t^2/2^n$ may become small by increasing $n$; it does not offer an independent security knob at fixed dimension. The requested construction must work when the allowed query count is large relative to dimension as well.\n\nThe object is a quantum operation, and the security criterion is operational distinguishability from Haar rather than a relationship between classical complexity classes.","contributors":[]}}
---
## Source

The question is explicitly posed or retained as open in the cited primary literature [Brakerski26](https://arxiv.org/abs/2605.09957v1). The statement is rewritten here to make its hypotheses and success criterion self-contained.

## Progress

Status: explicitly unresolved in the 2026 source. Brakerski and Yuen analyze this scalable formulation, establish barriers for existing candidates, and connect a positive answer to unitary synthesis. Their baseline construction has polynomial dependence on $d$, rather than the required $\log d$. Thus it does not resolve the displayed problem. [Brakerski26](https://arxiv.org/abs/2605.09957v1)

Their distinguishing attack on the PFC construction is not a universal impossibility theorem for scalable PRUs, and the paper leaves the general construction problem unresolved. [Brakerski26](https://arxiv.org/abs/2605.09957v1)

## Comment

This is deliberately an oracle-query problem. A query-efficient construction is not automatically a gate-efficient, standard-model cryptosystem. That distinction should remain explicit in any proposed solution.

The independence of parameters is substantive. A distinguishing bound involving $t^2/2^n$ may become small by increasing $n$; it does not offer an independent security knob at fixed dimension. The requested construction must work when the allowed query count is large relative to dimension as well.

The object is a quantum operation, and the security criterion is operational distinguishability from Haar rather than a relationship between classical complexity classes.

## References

**Brakerski26** Zvika Brakerski and Henry Yuen, *On Scalable Pseudorandom Unitaries and the Unitary Synthesis Problem*. [arXiv:2605.09957v1](https://arxiv.org/html/2605.09957v1), submitted 11 May 2026; CRYPTO 2026. See Definitions 4.1 and 4.4, §4.1, Lemma 4.7, and §6.
