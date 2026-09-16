---
id: "01M2M9FAPEZ3SWR509F5FVMBWX"
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
areaIds: ["quantum-resource-theory","quantum-algorithm"]
topicIds: ["quantum-thermodynamics","quantum-state-preparation","quantum-relative-entropy"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Uniform modified log-Sobolev constant for one-dimensional Gibbs samplers"
aliases: ["op-92fc12b81d55a704","op_92fc12b81d55a704","01M2M9FAPEZ3SWR509F5FVMBWX"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_92fc12b81d55a704.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_92fc12b81d55a704","ulid":"01M2M9FAPEZ3SWR509F5FVMBWX","aliases":["op_92fc12b81d55a704","01M2M9FAPEZ3SWR509F5FVMBWX","op-92fc12b81d55a704"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":2,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-16T05:01:47.086Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory","quantum-algorithm"],"topicIds":["quantum-thermodynamics","quantum-state-preparation","quantum-relative-entropy"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Uniform modified log-Sobolev constant for one-dimensional Gibbs samplers","status":"Unsolved","fields":["Quantum Resource Theory","Quantum algorithm"],"topics":["Quantum thermodynamics","Quantum state preparation","Quantum relative entropy"],"statement":"Do normalized one-dimensional Chen--Kastoryano--Gily\\'en Gibbs samplers have a positive modified log-Sobolev constant uniformly in system size at every fixed finite temperature?\n\nFix $\\beta>0$, a finite on-site dimension, and a class of one-dimensional finite-range Hamiltonians with bounded local strength. Let $\\rho_\\beta(H)=e^{-\\beta H}/\\operatorname{Tr}(e^{-\\beta H})$, and let $\\mathcal L_{H,\\beta}$ be the Chen--Kastoryano--Gily\\'en generator using all single-site Pauli jumps, Gaussian-filter width $\\beta^{-1}$, and the unrescaled sum of local terms.\n\nDoes a constant $\\alpha_\\beta>0$ exist, independent of chain length and of $H$ in this class, such that for every state $\\sigma$ and every $t\\geq0$\n\n\\begin{equation}\nD\\!\\left(e^{t\\mathcal L_{H,\\beta,*}}(\\sigma)\\middle\\|\\rho_\\beta(H)\\right)\n\\leq e^{-2\\alpha_\\beta t}D\\!\\left(\\sigma\\middle\\|\\rho_\\beta(H)\\right)?\n\\label{eq:92fc-1}\n\\end{equation}\n\nRelative entropy in Eq.~\\eqref{eq:92fc-1} uses natural logarithms; constants may depend on $\\beta$ but not on system size.","source":"Bergamaschi and Chen explicitly leave the uniform modified log-Sobolev question open for this one-dimensional sampler family \\sourcecite{ref:92fc-bergamaschi25}{Bergamaschi25}. The statement fixes a normalization and rewrites the question self-containedly.","progress":["Published provenance and progress. Bergamaschi and Chen prove a system-size-independent spectral gap for the relevant one-dimensional noncommuting family, and obtain polylogarithmic-depth Gibbs preparation by a different, quasi-adiabatic route \\sourcecite{ref:92fc-bergamaschi25}{Bergamaschi25}, revised January 23, 2026. Their discussion explicitly leaves the corresponding log-Sobolev implication open. High-temperature rapid-mixing results such as \\sourcecite{ref:92fc-rouz26}{Rouz26} do not cover arbitrary fixed finite temperature.","Critical update: Gao and Guo’s September 14, 2026 preprint establishes positive complete MLSI for finite-dimensional CKG samplers through a coercivity criterion \\sourcecite{ref:92fc-gao26}{Gao26}. Therefore, mere positivity for each fixed finite system is no longer the question retained here.","Why the September result does not close this formulation. The comparison in \\sourcecite{ref:92fc-gao26}{Gao26} includes an index of the asymptotic conditional expectation. For a primitive semigroup with stationary state $\\rho$, the order constant\n\n\\begin{equation}\nC(E)=\\inf\\{C:\\sigma\\leq C\\rho\\ \\text{for every density matrix }\\sigma\\}\n\\label{eq:92fc-5}\n\\end{equation}\n\nsatisfies, directly,\n\n\\begin{equation}\nC(E)=\\lambda_{\\min}(\\rho)^{-1}\\geq d^n.\n\\label{eq:92fc-6}\n\\end{equation}\n\nThe displayed definitions, constraints, and target bounds are recorded in Eqs.~\\eqref{eq:92fc-5}, \\eqref{eq:92fc-6}.","Thus a lower bound divided by this quantity does not establish a uniform many-body constant. Moreover, an ancillary-dimension-independent “complete” inequality is not automatically independent of the physical system size."],"references":[{"key":"Bergamaschi25","label":"ref:92fc-bergamaschi25","tex":"Thiago Bergamaschi and Chi-Fang Chen, \\emph{Fast Mixing of Quantum Spin Chains at All Temperatures}. \\href{https://arxiv.org/abs/2510.08533}{arXiv:2510.08533}, first submitted October 9, 2025; checked version v2, January 23, 2026. Locate: Theorem I.1, preparation corollary, and the discussion “Mixing times beyond spectral gaps.”"},{"key":"Rouz26","label":"ref:92fc-rouz26","tex":"Cambyse Rouzé, Daniel Stilck França, and Álvaro M. Alhambra, \\emph{Optimal quantum algorithm for Gibbs state preparation}. \\href{https://arxiv.org/abs/2411.04885}{arXiv:2411.04885}, checked version v2, February 10, 2026; \\href{https://doi.org/10.1103/lhht-svmn}{Physical Review Letters 136, 060601 (2026)}. Use: high-temperature algorithmic progress, not an all-temperature uniform-MLSI theorem."},{"key":"Gao26","label":"ref:92fc-gao26","tex":"Li Gao and Jingyu Guo, \\emph{Relative Entropy Decay via BKM coercivity for Quantum Markov Semigroups}. \\href{https://arxiv.org/abs/2609.15902v1}{arXiv:2609.15902v1}, September 14, 2026. Locate: main coercivity/index comparisons and Section 7, “Application to the CKG Gibbs sampler.” This is the latest dated research development cited here."}],"comment":"Status: Retained as open only in the uniform-in-$n$ form. A global reset channel is not an admissible substitute for the specified quasi-local dynamics. The distinction between spectral gap, entropy contraction, and circuit preparation is essential.","contributors":[]}}
---
## Source

Bergamaschi and Chen explicitly leave the uniform modified log-Sobolev question open for this one-dimensional sampler family [Bergamaschi25](https://arxiv.org/abs/2510.08533). The statement fixes a normalization and rewrites the question self-containedly.

## Progress

Published provenance and progress. Bergamaschi and Chen prove a system-size-independent spectral gap for the relevant one-dimensional noncommuting family, and obtain polylogarithmic-depth Gibbs preparation by a different, quasi-adiabatic route [Bergamaschi25](https://arxiv.org/abs/2510.08533), revised January 23, 2026. Their discussion explicitly leaves the corresponding log-Sobolev implication open. High-temperature rapid-mixing results such as [Rouz26](https://doi.org/10.1103/lhht-svmn) do not cover arbitrary fixed finite temperature.

Critical update: Gao and Guo’s September 14, 2026 preprint establishes positive complete MLSI for finite-dimensional CKG samplers through a coercivity criterion [Gao26](https://arxiv.org/abs/2609.15902v1). Therefore, mere positivity for each fixed finite system is no longer the question retained here.

Why the September result does not close this formulation. The comparison in [Gao26](https://arxiv.org/abs/2609.15902v1) includes an index of the asymptotic conditional expectation. For a primitive semigroup with stationary state $\rho$, the order constant

$$
C(E)=\inf\{C:\sigma\leq C\rho\ \text{for every density matrix }\sigma\}
\tag{2}
$$

satisfies, directly,

$$
C(E)=\lambda_{\min}(\rho)^{-1}\geq d^n.
\tag{3}
$$

The displayed definitions, constraints, and target bounds are recorded in Eqs. (2), (3).

Thus a lower bound divided by this quantity does not establish a uniform many-body constant. Moreover, an ancillary-dimension-independent “complete” inequality is not automatically independent of the physical system size.

## Comment

Status: Retained as open only in the uniform-in-$n$ form. A global reset channel is not an admissible substitute for the specified quasi-local dynamics. The distinction between spectral gap, entropy contraction, and circuit preparation is essential.

## References

**Bergamaschi25** Thiago Bergamaschi and Chi-Fang Chen, *Fast Mixing of Quantum Spin Chains at All Temperatures*. [arXiv:2510.08533](https://arxiv.org/abs/2510.08533), first submitted October 9, 2025; checked version v2, January 23, 2026. Locate: Theorem I.1, preparation corollary, and the discussion “Mixing times beyond spectral gaps.”

**Rouz26** Cambyse Rouzé, Daniel Stilck França, and Álvaro M. Alhambra, *Optimal quantum algorithm for Gibbs state preparation*. [arXiv:2411.04885](https://arxiv.org/abs/2411.04885), checked version v2, February 10, 2026; [Physical Review Letters 136, 060601 (2026)](https://doi.org/10.1103/lhht-svmn). Use: high-temperature algorithmic progress, not an all-temperature uniform-MLSI theorem.

**Gao26** Li Gao and Jingyu Guo, *Relative Entropy Decay via BKM coercivity for Quantum Markov Semigroups*. [arXiv:2609.15902v1](https://arxiv.org/abs/2609.15902v1), September 14, 2026. Locate: main coercivity/index comparisons and Section 7, “Application to the CKG Gibbs sampler.” This is the latest dated research development cited here.
