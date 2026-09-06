---
id: "01M1HME78010TTEQK6NFPRCGZT"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1Q787QRVXGPCXG6KEQTF7N1"
createdAt: "2026-09-04T22:04:59Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["additivity-and-regularization","matrix-and-entropy-inequalities","quantum-channel-structure"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Delayed-onset additivity violation for minimum output R\\'enyi entropy"
aliases: ["op-c0b1045a614d2353","op_c0b1045a614d2353","01M1HME78010TTEQK6NFPRCGZT","ruskai-2007-additivity-violation-power-m"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_c0b1045a614d2353.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_c0b1045a614d2353","ulid":"01M1HME78010TTEQK6NFPRCGZT","aliases":["op_c0b1045a614d2353","01M1HME78010TTEQK6NFPRCGZT","op-c0b1045a614d2353","ruskai-2007-additivity-violation-power-m"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["additivity-and-regularization","matrix-and-entropy-inequalities","quantum-channel-structure"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Delayed-onset additivity violation for minimum output R\\'enyi entropy","status":"Unsolved","fields":["Quantum Communication"],"topics":["Additivity and regularization","Matrix and entropy inequalities","Quantum channel structure"],"statement":"Does there exist a finite-dimensional quantum channel whose minimum output\nR\\'enyi entropy is additive for every tensor power below some order and first\nbecomes strictly subadditive at that order?  Let\n$\\Phi:\\mathcal L(A)\\to\\mathcal L(B)$ be completely positive and trace\npreserving.  For $p>0$, define the R\\'enyi entropy and the corresponding\nminimum output entropy by\n\\begin{equation}\n  S_p(\\sigma)\n  :=\\begin{cases}\n    \\displaystyle\\frac{1}{1-p}\\log_2\\operatorname{Tr}(\\sigma^p),\n      &p\\neq1,\\\\[2mm]\n    -\\operatorname{Tr}(\\sigma\\log_2\\sigma),&p=1,\n  \\end{cases}\n  \\qquad\n  S_{p,\\min}(\\Phi)\n  :=\\min_{\\substack{\\rho\\succeq0\\\\\\operatorname{Tr}\\rho=1}}\n       S_p\\!\\left(\\Phi(\\rho)\\right).\n  \\label{eq:p57-minimum-output-renyi}\n\\end{equation}\nWith the quantities in Eq.~\\eqref{eq:p57-minimum-output-renyi}, determine\nwhether there are $p>0$, an integer $m\\geq3$, and a channel $\\Phi$ such that\n\\begin{equation}\n  S_{p,\\min}(\\Phi^{\\otimes n})\n    =nS_{p,\\min}(\\Phi)\n    \\quad\\text{for every }1\\leq n<m,\n  \\qquad\n  S_{p,\\min}(\\Phi^{\\otimes m})\n    <mS_{p,\\min}(\\Phi).\n  \\label{eq:p57-delayed-onset}\n\\end{equation}\nThe restriction $m\\geq3$ in Eq.~\\eqref{eq:p57-delayed-onset} makes the\nlower-power requirement nontrivial: the equality at $n=1$ is automatic,\nwhereas equality at $n=2$ is required.","source":"Ruskai explicitly asks whether additivity can hold for all tensor powers\nbelow an integer $m$ and fail at the $m$th power\n\\sourcecite{ref:p57-ruskai}{Rus07}.  Equation~\\eqref{eq:p57-delayed-onset}\nuses the intended delayed-onset formulation $m\\geq3$, excluding the\ntautological one-copy-only condition obtained when $m=2$.","progress":["Derksen and Lovitz construct explicit finite-dimensional\n  self-channel violations\n  $S_{p,\\min}(\\Phi^{\\otimes2})<2S_{p,\\min}(\\Phi)$ for every $p>1$.\n  These examples resolve the literal $m=2$ reading, but fail the required\n  two-copy equality in Eq.~\\eqref{eq:p57-delayed-onset} for every\n  $m\\geq3$ \\sourcecite{ref:p57-derksen-lovitz}{DL26}.","Hastings disproved minimum-output von Neumann entropy additivity at\n  $p=1$ using finite-dimensional random channels.  The violation is already\n  witnessed at a two-channel tensor product and therefore does not provide a\n  channel that remains additive through every lower nontrivial power in\n  Eq.~\\eqref{eq:p57-delayed-onset}\n  \\sourcecite{ref:p57-hastings}{Has09}."],"references":[{"key":"Rus07","label":"ref:p57-ruskai","tex":"M. B. Ruskai, ``Open Problems in Quantum Information Theory,''\n  arXiv preprint (2007), Problem~19, p.~16.\n  \\newline\n  \\href{https://doi.org/10.48550/arXiv.0708.1902}{doi:10.48550/arXiv.0708.1902};\n  \\href{https://arxiv.org/abs/0708.1902}{arXiv:0708.1902}."},{"key":"DL26","label":"ref:p57-derksen-lovitz","tex":"H. Derksen and B. Lovitz,\n  ``Constructive Counterexamples to the Additivity of Minimum Output\n  R\\'enyi Entropy of Quantum Channels for All $p>1$,'' arXiv preprint\n  (2026), version~2.\n  \\href{https://arxiv.org/abs/2510.07547v2}{arXiv:2510.07547v2}."},{"key":"Has09","label":"ref:p57-hastings","tex":"M. B. Hastings,\n  ``Superadditivity of Communication Capacity Using Entangled Inputs,''\n  \\emph{Nature Physics} \\textbf{5}, 255--257 (2009).\n  \\href{https://doi.org/10.1038/nphys1224}{doi:10.1038/nphys1224};\n  \\href{https://arxiv.org/abs/0809.3972}{arXiv:0809.3972}."}],"comment":"No channel is known to satisfy Eq.~\\eqref{eq:p57-delayed-onset}, and no\ngeneral theorem is known that promotes two-copy additivity to additivity of\nall self-tensor powers.  The unresolved issue is therefore the existence or\nimpossibility of a genuinely delayed first violation at some $m\\geq3$."}}
---
## Source

Ruskai explicitly asks whether additivity can hold for all tensor powers below an integer $m$ and fail at the $m$th power [Rus07](https://doi.org/10.48550/arXiv.0708.1902). Equation (2) uses the intended delayed-onset formulation $m\geq3$, excluding the tautological one-copy-only condition obtained when $m=2$.

## Progress

Derksen and Lovitz construct explicit finite-dimensional self-channel violations $S_{p,\min}(\Phi^{\otimes2})<2S_{p,\min}(\Phi)$ for every $p>1$. These examples resolve the literal $m=2$ reading, but fail the required two-copy equality in Eq. (2) for every $m\geq3$ [DL26](https://arxiv.org/abs/2510.07547v2).

Hastings disproved minimum-output von Neumann entropy additivity at $p=1$ using finite-dimensional random channels. The violation is already witnessed at a two-channel tensor product and therefore does not provide a channel that remains additive through every lower nontrivial power in Eq. (2) [Has09](https://doi.org/10.1038/nphys1224).

## Comment

No channel is known to satisfy Eq. (2), and no general theorem is known that promotes two-copy additivity to additivity of all self-tensor powers. The unresolved issue is therefore the existence or impossibility of a genuinely delayed first violation at some $m\geq3$.

## References

**Rus07** M. B. Ruskai, “Open Problems in Quantum Information Theory,” arXiv preprint (2007), Problem 19, p. 16.
 [doi:10.48550/arXiv.0708.1902](https://doi.org/10.48550/arXiv.0708.1902); [arXiv:0708.1902](https://arxiv.org/abs/0708.1902).

**DL26** H. Derksen and B. Lovitz, “Constructive Counterexamples to the Additivity of Minimum Output Rényi Entropy of Quantum Channels for All $p>1$,” arXiv preprint (2026), version 2. [arXiv:2510.07547v2](https://arxiv.org/abs/2510.07547v2).

**Has09** M. B. Hastings, “Superadditivity of Communication Capacity Using Entangled Inputs,” *Nature Physics* **5**, 255–257 (2009). [doi:10.1038/nphys1224](https://doi.org/10.1038/nphys1224); [arXiv:0809.3972](https://arxiv.org/abs/0809.3972).
