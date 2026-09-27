---
id: "01M2JD9V01MADK091VQM1GWX14"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-15T18:45:29.941Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-cryptography","quantum-resource-theory"]
topicIds: ["superactivation","secret-key-distillation"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME780SNG2DQVEGCDB0XSK","01M2JD9V2CZDMZ405QE7W8J0J2"]
title: "Superactivation of distillable secret key"
aliases: ["op-3be0df761e83d438","op_3be0df761e83d438","01M2JD9V01MADK091VQM1GWX14"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_3be0df761e83d438.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_3be0df761e83d438","ulid":"01M2JD9V01MADK091VQM1GWX14","aliases":["op_3be0df761e83d438","01M2JD9V01MADK091VQM1GWX14","op-3be0df761e83d438"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-15T11:30:12.609Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-cryptography","quantum-resource-theory"],"topicIds":["superactivation","secret-key-distillation"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME780SNG2DQVEGCDB0XSK","01M2JD9V2CZDMZ405QE7W8J0J2"]},"title":"Superactivation of distillable secret key","status":"Unsolved","fields":["Quantum Cryptography","Quantum Resource Theory"],"topics":["Superactivation","Secret-key distillation"],"statement":"Can two bipartite quantum states with zero distillable secret key yield\npositive distillable secret key when used jointly?  Let $\\rho_{AB}$ and\n$\\sigma_{A'B'}$ be arbitrary finite-dimensional bipartite quantum states.  For\na state $\\omega$, let $K_D(\\omega)$ denote its asymptotic distillable secret\nkey, in secret bits per copy.  Alice and Bob may apply arbitrary local quantum\noperations to $\\omega^{\\otimes n}$ and use unlimited authenticated two-way\npublic communication; Eve holds a purification of $\\omega^{\\otimes n}$ and\nreceives the entire public transcript.  A rate is achievable when the joint\nstate of Alice's key, Bob's key, and Eve's systems converges in trace distance\nto that of identical, uniformly distributed keys independent of Eve, and\n$K_D(\\omega)$ is the supremum of achievable rates.  No initial secret key of\npositive rate, entanglement assistance, or catalyst is supplied.  The question\nis whether there is a pair satisfying\n\\begin{equation}\n  K_D(\\rho_{AB})=K_D(\\sigma_{A'B'})=0,\n  \\qquad\n  K_D(\\rho_{AB}\\otimes\\sigma_{A'B'})>0,\n  \\label{eq:3be0-superactivation}\n\\end{equation}\nwhere the joint rate in Eq.~\\eqref{eq:3be0-superactivation} is taken across\nthe bipartition $AA':BB'$.","source":"Horodecki, Sikorski, Das, and Wilde explicitly state in Sec.~1 that it\nremains open whether entangled but key-undistillable states exist, and in\nSec.~13 describe their results as assuming faithfulness of distillable key\n\\sourcecite{ref:3be0-hsdw}{HSDW26}.  The question in\nEq.~\\eqref{eq:3be0-superactivation} is derived from that documented gap as a\nquestion about tensor-product closure of the zero-key set; it is not stated\nverbatim in the cited papers.","progress":["Zero distillable entanglement does not certify zero key.\n  Horodecki, Horodecki, Horodecki, and Oppenheim construct bound-entangled\n  states $\\omega$ with positive partial transpose for which\n  \\begin{equation}\n    D_{\\leftrightarrow}(\\omega)=0<K_D(\\omega),\n    \\label{eq:3be0-bound-key}\n  \\end{equation}\n  where $D_{\\leftrightarrow}$ is the two-way LOCC distillable entanglement\n  \\sourcecite{ref:3be0-hhho}{HHHO05}.  By Eq.~\\eqref{eq:3be0-bound-key},\n  neither bound entanglement nor positivity of the partial transpose alone\n  makes a factor in Eq.~\\eqref{eq:3be0-superactivation} key-undistillable.","Let Alice measure her share of a purification of $\\omega_{AB}$, producing\n  a classical--quantum--quantum state $\\eta_{XBE}$ with classical outcome $X$.\n  The one-way protocol of Devetak and Winter achieves\n  \\begin{equation}\n    K_D(\\omega)\\geq\\max\\{0,\\,I(X:B)_\\eta-I(X:E)_\\eta\\},\n    \\label{eq:3be0-devetak-winter}\n  \\end{equation}\n  where $I$ is the quantum mutual information\n  \\sourcecite{ref:3be0-dw}{DW05}.  A nonpositive right-hand side in\n  Eq.~\\eqref{eq:3be0-devetak-winter} for a particular measurement gives no\n  upper bound on $K_D(\\omega)$, which optimizes over arbitrary block\n  protocols with two-way public interaction.","Separable states are useless for key distillation, as recalled in\n  Sec.~1 of \\sourcecite{ref:3be0-hsdw}{HSDW26}.  A separable state can be\n  prepared by local operations and public communication, and a purifying\n  adversary can reproduce the announced preparation record, so appending it\n  does not change the key rate:\n  \\begin{equation}\n    K_D(\\omega\\otimes\\tau)=K_D(\\omega)\n    \\qquad\\text{for every }\\tau\\in\\mathrm{SEP},\n    \\label{eq:3be0-separable-free}\n  \\end{equation}\n  where $\\mathrm{SEP}$ denotes the separable states on the relevant\n  bipartition.  Both factors of any pair satisfying\n  Eq.~\\eqref{eq:3be0-superactivation} must therefore be entangled and\n  individually key-undistillable.  Eq.~\\eqref{eq:3be0-separable-free} is a\n  direct resource-theoretic consequence, not an activation theorem.","Horodecki, Sikorski, Das, and Wilde develop the resource theory of\n  private key under the assumption that distillable key is faithful, and\n  state in Sec.~1 that the following implication remains unresolved\n  \\sourcecite{ref:3be0-hsdw}{HSDW26}:\n  \\begin{equation}\n    \\omega\\notin\\mathrm{SEP}\\quad\\Longrightarrow\\quad K_D(\\omega)>0.\n    \\label{eq:3be0-faithfulness}\n  \\end{equation}\n  If\n  Eq.~\\eqref{eq:3be0-faithfulness} holds, the zero-key set equals\n  $\\mathrm{SEP}$, which is closed under tensor products, so no pair satisfies\n  Eq.~\\eqref{eq:3be0-superactivation}.  Conversely, a pair satisfying\n  Eq.~\\eqref{eq:3be0-superactivation} would disprove\n  Eq.~\\eqref{eq:3be0-faithfulness}.  Existence of a single entangled zero-key\n  state would not by itself provide an activating pair."],"references":[{"key":"HHHO05","label":"ref:3be0-hhho","tex":"K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim,\n  ``Secure Key from Bound Entanglement,''\n  \\emph{Physical Review Letters} \\textbf{94}, 160502 (2005).\n  \\href{https://doi.org/10.1103/PhysRevLett.94.160502}{doi:10.1103/PhysRevLett.94.160502};\n  \\href{https://arxiv.org/abs/quant-ph/0309110}{arXiv:quant-ph/0309110}."},{"key":"DW05","label":"ref:3be0-dw","tex":"I. Devetak and A. Winter, ``Distillation of Secret Key and Entanglement\n  from Quantum States,'' \\emph{Proceedings of the Royal Society A}\n  \\textbf{461}, 207--235 (2005).\n  \\href{https://doi.org/10.1098/rspa.2004.1372}{doi:10.1098/rspa.2004.1372};\n  \\href{https://arxiv.org/abs/quant-ph/0306078}{arXiv:quant-ph/0306078}."},{"key":"HSDW26","label":"ref:3be0-hsdw","tex":"K. Horodecki, L. Sikorski, S. Das, and M. M. Wilde,\n  ``Cost of Quantum Secret Key,'' \\emph{Quantum} \\textbf{10}, 2098 (2026).\n  \\href{https://doi.org/10.22331/q-2026-05-06-2098}{doi:10.22331/q-2026-05-06-2098};\n  \\href{https://arxiv.org/abs/2402.17007}{arXiv:2402.17007}."}],"comment":"The unresolved alternatives are an explicit pair satisfying\nEq.~\\eqref{eq:3be0-superactivation} or a proof that the set of states with\n$K_D=0$ is closed under tensor products.  Even the necessary existence of an\nentangled state with $K_D=0$ remains open.  Activating a particular\nkey-distribution protocol, or increasing the key rate of a state that already\nhas positive key, does not answer the question.\n\nThe record \\href{https://qiqc-op.com/problem/op_b952ec2dd8246a10/}{Secret key\nfrom every entangled state} asks whether Eq.~\\eqref{eq:3be0-faithfulness}\nholds.  An affirmative answer there would rule out the pair sought here, and\nsuch a pair would give a negative answer there.  The two questions are not\nclaimed to be equivalent: an entangled zero-key state need not activate with\nany other zero-key state.  The record\n\\href{https://qiqc-op.com/problem/op_59e9ede6e282a917/}{Superactivation of\ntwo-way secret-key capacity} asks the corresponding question for quantum\nchannels.  Literature checked through 15 September 2026.","contributors":[]}}
---
## Source

Horodecki, Sikorski, Das, and Wilde explicitly state in Sec. 1 that it remains open whether entangled but key-undistillable states exist, and in Sec. 13 describe their results as assuming faithfulness of distillable key [HSDW26](https://doi.org/10.22331/q-2026-05-06-2098). The question in Eq. (1) is derived from that documented gap as a question about tensor-product closure of the zero-key set; it is not stated verbatim in the cited papers.

## Progress

Zero distillable entanglement does not certify zero key. Horodecki, Horodecki, Horodecki, and Oppenheim construct bound-entangled states $\omega$ with positive partial transpose for which

$$
D_{\leftrightarrow}(\omega)=0<K_D(\omega),
 \tag{2}
$$

where $D_{\leftrightarrow}$ is the two-way LOCC distillable entanglement [HHHO05](https://doi.org/10.1103/PhysRevLett.94.160502). By Eq. (2), neither bound entanglement nor positivity of the partial transpose alone makes a factor in Eq. (1) key-undistillable.

Let Alice measure her share of a purification of $\omega_{AB}$, producing a classical–quantum–quantum state $\eta_{XBE}$ with classical outcome $X$. The one-way protocol of Devetak and Winter achieves

$$
K_D(\omega)\geq\max\{0,\,I(X:B)_\eta-I(X:E)_\eta\},
 \tag{3}
$$

where $I$ is the quantum mutual information [DW05](https://doi.org/10.1098/rspa.2004.1372). A nonpositive right-hand side in Eq. (3) for a particular measurement gives no upper bound on $K_D(\omega)$, which optimizes over arbitrary block protocols with two-way public interaction.

Separable states are useless for key distillation, as recalled in Sec. 1 of [HSDW26](https://doi.org/10.22331/q-2026-05-06-2098). A separable state can be prepared by local operations and public communication, and a purifying adversary can reproduce the announced preparation record, so appending it does not change the key rate:

$$
K_D(\omega\otimes\tau)=K_D(\omega)
 \qquad\text{for every }\tau\in\mathrm{SEP},
 \tag{4}
$$

where $\mathrm{SEP}$ denotes the separable states on the relevant bipartition. Both factors of any pair satisfying Eq. (1) must therefore be entangled and individually key-undistillable. Eq. (4) is a direct resource-theoretic consequence, not an activation theorem.

Horodecki, Sikorski, Das, and Wilde develop the resource theory of private key under the assumption that distillable key is faithful, and state in Sec. 1 that the following implication remains unresolved [HSDW26](https://doi.org/10.22331/q-2026-05-06-2098):

$$
\omega\notin\mathrm{SEP}\quad\Longrightarrow\quad K_D(\omega)>0.
 \tag{5}
$$

If Eq. (5) holds, the zero-key set equals $\mathrm{SEP}$, which is closed under tensor products, so no pair satisfies Eq. (1). Conversely, a pair satisfying Eq. (1) would disprove Eq. (5). Existence of a single entangled zero-key state would not by itself provide an activating pair.

## Comment

The unresolved alternatives are an explicit pair satisfying Eq. (1) or a proof that the set of states with $K_D=0$ is closed under tensor products. Even the necessary existence of an entangled state with $K_D=0$ remains open. Activating a particular key-distribution protocol, or increasing the key rate of a state that already has positive key, does not answer the question.

The record [Secret key from every entangled state](https://qiqc-op.com/problem/op_b952ec2dd8246a10/) asks whether Eq. (5) holds. An affirmative answer there would rule out the pair sought here, and such a pair would give a negative answer there. The two questions are not claimed to be equivalent: an entangled zero-key state need not activate with any other zero-key state. The record [Superactivation of two-way secret-key capacity](https://qiqc-op.com/problem/op_59e9ede6e282a917/) asks the corresponding question for quantum channels. Literature checked through 15 September 2026.

## References

**HHHO05** K. Horodecki, M. Horodecki, P. Horodecki, and J. Oppenheim, “Secure Key from Bound Entanglement,” *Physical Review Letters* **94**, 160502 (2005). [doi:10.1103/PhysRevLett.94.160502](https://doi.org/10.1103/PhysRevLett.94.160502); [arXiv:quant-ph/0309110](https://arxiv.org/abs/quant-ph/0309110).

**DW05** I. Devetak and A. Winter, “Distillation of Secret Key and Entanglement from Quantum States,” *Proceedings of the Royal Society A* **461**, 207–235 (2005). [doi:10.1098/rspa.2004.1372](https://doi.org/10.1098/rspa.2004.1372); [arXiv:quant-ph/0306078](https://arxiv.org/abs/quant-ph/0306078).

**HSDW26** K. Horodecki, L. Sikorski, S. Das, and M. M. Wilde, “Cost of Quantum Secret Key,” *Quantum* **10**, 2098 (2026). [doi:10.22331/q-2026-05-06-2098](https://doi.org/10.22331/q-2026-05-06-2098); [arXiv:2402.17007](https://arxiv.org/abs/2402.17007).
