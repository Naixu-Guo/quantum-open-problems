---
id: "01M1HME780SNG2DQVEGCDB0XSK"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-10-08T05:04:13.442Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-cryptography","quantum-resource-theory"]
topicIds: ["secret-key-distillation","bound-entanglement","local-operations-and-classical-communication"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Secret key from every entangled state"
aliases: ["op-b952ec2dd8246a10","op_b952ec2dd8246a10","01M1HME780SNG2DQVEGCDB0XSK","v2-secret-key-from-every-entangled-state","open-problem-v2-problem-20"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_b952ec2dd8246a10.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_b952ec2dd8246a10","ulid":"01M1HME780SNG2DQVEGCDB0XSK","aliases":["op_b952ec2dd8246a10","01M1HME780SNG2DQVEGCDB0XSK","op-b952ec2dd8246a10","v2-secret-key-from-every-entangled-state","open-problem-v2-problem-20"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-cryptography","quantum-resource-theory"],"topicIds":["secret-key-distillation","bound-entanglement","local-operations-and-classical-communication"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Secret key from every entangled state","status":"Solved","fields":["Quantum Cryptography","Quantum Resource Theory"],"topics":["Secret-key distillation","Bound entanglement","Local operations and classical communication"],"statement":"Does every finite-dimensional entangled bipartite state have positive\nasymptotic distillable secret key?  For a state $\\rho_{AB}$, with an adversary\nholding a purification, define its distillable-key rate by\n\\begin{equation}\n  K_D(\\rho_{AB})\n  :=\\sup\\left\\{R\\geq0:\n    \\begin{array}{l}\n      \\text{there are LOPC protocols $\\Lambda_n$ and private states\n      $\\gamma^{(n)}_{K_n}$, with $K_n=2^{\\lfloor nR\\rfloor}$, such that}\\\\[-1mm]\n      \\displaystyle\n      \\lim_{n\\to\\infty}\n      \\left\\|\\Lambda_n(\\rho_{AB}^{\\otimes n})\n      -\\gamma^{(n)}_{K_n}\\right\\|_1=0\n    \\end{array}\n  \\right\\},\n  \\label{eq:p20-distillable-key}\n\\end{equation}\nwhere each target $\\gamma^{(n)}_{K_n}$ may have its own shield system and has\nkey registers of dimension $K_n$.  With the operational convention in\nEq.~\\eqref{eq:p20-distillable-key},\nthe question is whether the implication\n\\begin{equation}\n  \\rho_{AB}\\ \\text{entangled}\n  \\quad\\Longrightarrow\\quad\n  K_D(\\rho_{AB})>0\n  \\label{eq:p20-entanglement-implies-key}\n\\end{equation}\nholds for every finite-dimensional $\\rho_{AB}$.","source":"Horodecki, Sikorski, Das, and Wilde explicitly identify the question whether\nevery entangled state has positive distillable key\n\\sourcecite{ref:p20-key-cost}{HSDW26}.","progress":["Horodecki, Horodecki, Horodecki, and Oppenheim constructed\n  bound-entangled states with positive distillable key.  Thus zero\n  distillable entanglement does not provide a counterexample to\n  Eq.~\\eqref{eq:p20-entanglement-implies-key}\n  \\sourcecite{ref:p20-bound-key}{HHHO05}.","Horodecki, Sikorski, Das, and Wilde identified the existence of an\n  entangled state with zero distillable key as an open question in their\n  2026 paper \\sourcecite{ref:p20-key-cost}{HSDW26}.","OpenAI reports an explicit entangled state on\n  $\\mathbb C^{10}\\otimes\\mathbb C^{10}$ with $K_D=0$\n  (Theorem~1.1, p.~2) \\sourcecite{ref:p20-openai-zero-key}{OAI26}.\n  The local-instrument protocols in Definition~4.1 include ordinary finite two-way\n  protocols and the specified countable protocols that complete almost\n  surely, with joint local\n  processing of all copies and authenticated public communication. The\n  input is the only shared private resource, and the eavesdropper holds\n  its purification and the full public transcript."],"references":[{"key":"HHHO05","label":"ref:p20-bound-key","tex":"K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim,\n  ``Secure Key from Bound Entanglement,''\n  \\emph{Physical Review Letters} \\textbf{94}, 160502 (2005).\n  \\href{https://doi.org/10.1103/PhysRevLett.94.160502}{doi:10.1103/PhysRevLett.94.160502};\n  \\href{https://arxiv.org/abs/quant-ph/0309110}{arXiv:quant-ph/0309110}."},{"key":"HSDW26","label":"ref:p20-key-cost","tex":"K. Horodecki, L. Sikorski, S. Das, and M. M. Wilde,\n  ``Cost of Quantum Secret Key,'' \\emph{Quantum} \\textbf{10}, 2098 (2026).\n  \\href{https://doi.org/10.22331/q-2026-05-06-2098}{doi:10.22331/q-2026-05-06-2098};\n  \\href{https://arxiv.org/abs/2402.17007}{arXiv:2402.17007}."},{"key":"OAI26","label":"ref:p20-openai-zero-key","tex":"OpenAI, ``Entanglement with zero distillable secret key in local dimension ten,'' OpenAI Math Release preprint, 27 September 2026.\n\\href{https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/Entanglement-with-zero-distillable-secret-key-in-local-dimension-ten-September-27-2026/paper.pdf}{manuscript (release version)}."}],"comment":"The catalog designates this question Solved on the basis of the reported\n  counterexample in \\sourcecite{ref:p20-openai-zero-key}{OAI26}, a preprint.\n  It gives a negative answer to Eq.~\\eqref{eq:p20-entanglement-implies-key}\n  under the protocol convention stated in Progress. Measuring the key registers of asymptotically\n  distilled private states would yield secret key, so the obstruction also\n  excludes the private-state formulation above. No minimal local dimension\n  is claimed."}}
---
## Source

Horodecki, Sikorski, Das, and Wilde explicitly identify the question whether every entangled state has positive distillable key [HSDW26](https://doi.org/10.22331/q-2026-05-06-2098).

## Progress

Horodecki, Horodecki, Horodecki, and Oppenheim constructed bound-entangled states with positive distillable key. Thus zero distillable entanglement does not provide a counterexample to Eq. (2) [HHHO05](https://doi.org/10.1103/PhysRevLett.94.160502).

Horodecki, Sikorski, Das, and Wilde identified the existence of an entangled state with zero distillable key as an open question in their 2026 paper [HSDW26](https://doi.org/10.22331/q-2026-05-06-2098).

OpenAI reports an explicit entangled state on $\mathbb C^{10}\otimes\mathbb C^{10}$ with $K_D=0$ (Theorem 1.1, p. 2) [OAI26](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/Entanglement-with-zero-distillable-secret-key-in-local-dimension-ten-September-27-2026/paper.pdf). The local-instrument protocols in Definition 4.1 include ordinary finite two-way protocols and the specified countable protocols that complete almost surely, with joint local processing of all copies and authenticated public communication. The input is the only shared private resource, and the eavesdropper holds its purification and the full public transcript.

## Comment

The catalog designates this question Solved on the basis of the reported counterexample in [OAI26](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/Entanglement-with-zero-distillable-secret-key-in-local-dimension-ten-September-27-2026/paper.pdf), a preprint. It gives a negative answer to Eq. (2) under the protocol convention stated in Progress. Measuring the key registers of asymptotically distilled private states would yield secret key, so the obstruction also excludes the private-state formulation above. No minimal local dimension is claimed.

## References

**HHHO05** K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim, “Secure Key from Bound Entanglement,” *Physical Review Letters* **94**, 160502 (2005). [doi:10.1103/PhysRevLett.94.160502](https://doi.org/10.1103/PhysRevLett.94.160502); [arXiv:quant-ph/0309110](https://arxiv.org/abs/quant-ph/0309110).

**HSDW26** K. Horodecki, L. Sikorski, S. Das, and M. M. Wilde, “Cost of Quantum Secret Key,” *Quantum* **10**, 2098 (2026). [doi:10.22331/q-2026-05-06-2098](https://doi.org/10.22331/q-2026-05-06-2098); [arXiv:2402.17007](https://arxiv.org/abs/2402.17007).

**OAI26** OpenAI, “Entanglement with zero distillable secret key in local dimension ten,” OpenAI Math Release preprint, 27 September 2026. [manuscript (release version)](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/Entanglement-with-zero-distillable-secret-key-in-local-dimension-ten-September-27-2026/paper.pdf).
