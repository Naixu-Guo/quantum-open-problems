---
id: "01M26KH5NF45HBHXTPG8ZBD75H"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["gaussian-quantum-information","entanglement-measures"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME78068MQY7E9KA81B7WX"]
title: "Gaussian optimality of two-mode entanglement of formation"
aliases: ["op-cb7cdf37ec9b9ec5","op_cb7cdf37ec9b9ec5","01M26KH5NF45HBHXTPG8ZBD75H"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_cb7cdf37ec9b9ec5.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_cb7cdf37ec9b9ec5","ulid":"01M26KH5NF45HBHXTPG8ZBD75H","aliases":["op_cb7cdf37ec9b9ec5","01M26KH5NF45HBHXTPG8ZBD75H","op-cb7cdf37ec9b9ec5"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:28:11.183Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["gaussian-quantum-information","entanglement-measures"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME78068MQY7E9KA81B7WX"]},"title":"Gaussian optimality of two-mode entanglement of formation","status":"Solved","fields":["Quantum Resource Theory"],"topics":["Gaussian quantum information","Entanglement measures"],"statement":"Does Gaussian entanglement of formation equal unrestricted entanglement of formation for every finite-energy two-mode Gaussian state?\n\nLet $\\rho_{AB}$ be any finite-energy two-mode Gaussian density operator, with one bosonic mode held by each party. Finite energy means finite total mean photon number. Define\n\n\\begin{equation}\n\\begin{gathered}\nE_F(\\rho_{AB}):=\\inf_\\mu\\int S(\\operatorname{Tr}_B|\\psi\\rangle\\langle\\psi|)\\,\\mu(d\\psi),\n\\\\\nS(\\omega):=-\\operatorname{Tr}(\\omega\\log_2\\omega).\n\\end{gathered}\n\\label{eq:ser10-statement-1}\n\\end{equation}\n\nThe infimum in Eq.~\\eqref{eq:ser10-statement-1} is over probability measures on normalised pure vectors with barycentre $\\rho_{AB}$. The Gaussian entanglement of formation $E_F^{\\mathrm G}$ restricts the same infimum to pure Gaussian vectors.\n\nThe proposed equality is $E_F(\\rho_{AB})=E_F^{\\mathrm G}(\\rho_{AB})$, without an exchange-symmetry assumption.","source":"Wolf et al., Section IX, discuss equality of the Gaussian and unrestricted convex roofs \\sourcecite{ref:ser10-1}{WGKWC04}. Adesso resolves the full two-mode instance in Eq. (19) \\sourcecite{ref:ser10-3}{Ade26}.","progress":["Gaussian decompositions give the covariance optimisation\n\n\\begin{equation}\n\\begin{gathered}\nE_F(\\rho_{AB})\\leq E_F^{\\mathrm G}(\\rho_{AB})\n=\\inf_{\\substack{\\gamma\\preceq V\\\\\\gamma\\text{ pure Gaussian covariance}}}\ng\\!\\left(\\frac{\\sqrt{\\det\\gamma_A}-1}{2}\\right),\n\\\\ g(x):=(x+1)\\log_2(x+1)-x\\log_2x,\n\\end{gathered}\n\\label{eq:ser10-progress-1-1}\n\\end{equation}\n\nIn Eq.~\\eqref{eq:ser10-progress-1-1}, $V$ is the covariance of $\\rho_{AB}$ in vacuum-$I$ units and $\\gamma_A$ is the local covariance block of the pure Gaussian component. Use $0\\log_2 0:=0$. Proposition 1 of Wolf et al. establishes this restricted optimization. \\sourcecite{ref:ser10-1}{WGKWC04}","Giedke et al., Proposition 2, establish $E_F=E_F^{\\mathrm G}$ for symmetric two-mode Gaussian states. \\sourcecite{ref:ser10-2}{GWKWC03}","Adesso proves $E_F=E_F^{\\mathrm G}$ for every two-mode Gaussian state in Eq. (19). Theorem 1 applies an affine entanglement bound to every finite-energy pure state, including non-Gaussian states. Equations (18)--(19) average it over arbitrary decompositions. Supplement S2.4 treats infinite-dimensional limits and probability-measure decompositions. \\sourcecite{ref:ser10-3}{Ade26}"],"references":[{"key":"WGKWC04","label":"ref:ser10-1","tex":"M. M. Wolf, G. Giedke, O. Kr\\\"uger, R. F. Werner, and J. I. Cirac, \"Gaussian Entanglement of Formation,\" \\emph{Physical Review A} \\textbf{69}, 052320 (2004). \\href{https://doi.org/10.1103/PhysRevA.69.052320}{doi:10.1103/PhysRevA.69.052320}; \\href{https://arxiv.org/abs/quant-ph/0306177}{arXiv:quant-ph/0306177}."},{"key":"GWKWC03","label":"ref:ser10-2","tex":"G. Giedke, M. M. Wolf, O. Kr\\\"uger, R. F. Werner, and J. I. Cirac, \"Entanglement of Formation for Symmetric Gaussian States,\" \\emph{Physical Review Letters} \\textbf{91}, 107901 (2003). \\href{https://doi.org/10.1103/PhysRevLett.91.107901}{doi:10.1103/PhysRevLett.91.107901}; \\href{https://arxiv.org/abs/quant-ph/0304042}{arXiv:quant-ph/0304042}."},{"key":"Ade26","label":"ref:ser10-3","tex":"G. Adesso, \"Optimality of Gaussian Entanglement of Formation,\" preprint (2026), version 2, 13 August 2026. \\href{https://doi.org/10.48550/arXiv.2608.01909}{doi:10.48550/arXiv.2608.01909}; \\href{https://arxiv.org/abs/2608.01909v2}{arXiv:2608.01909v2}."}],"comment":"The affirmative resolution is an arXiv preprint, version 2; no peer-reviewed publication was identified in the September 2026 audit. It determines the single-copy convex roof. Additivity across copies remains separate. The record \\texttt{01M1HME78068MQY7E9KA81B7WX} asks the distinct question for non-bisymmetric states with at least three modes."}}
---
## Source

Wolf et al., Section IX, discuss equality of the Gaussian and unrestricted convex roofs [WGKWC04](https://doi.org/10.1103/PhysRevA.69.052320). Adesso resolves the full two-mode instance in Eq. (19) [Ade26](https://doi.org/10.48550/arXiv.2608.01909).

## Progress

Gaussian decompositions give the covariance optimisation

$$
\begin{gathered}
E_F(\rho_{AB})\leq E_F^{\mathrm G}(\rho_{AB})
=\inf_{\substack{\gamma\preceq V\\\gamma\text{ pure Gaussian covariance}}}
g\!\left(\frac{\sqrt{\det\gamma_A}-1}{2}\right),
\\ g(x):=(x+1)\log_2(x+1)-x\log_2x,
\end{gathered}
\tag{2}
$$

In Eq. (2), $V$ is the covariance of $\rho_{AB}$ in vacuum-$I$ units and $\gamma_A$ is the local covariance block of the pure Gaussian component. Use $0\log_2 0:=0$. Proposition 1 of Wolf et al. establishes this restricted optimization. [WGKWC04](https://doi.org/10.1103/PhysRevA.69.052320)

Giedke et al., Proposition 2, establish $E_F=E_F^{\mathrm G}$ for symmetric two-mode Gaussian states. [GWKWC03](https://doi.org/10.1103/PhysRevLett.91.107901)

Adesso proves $E_F=E_F^{\mathrm G}$ for every two-mode Gaussian state in Eq. (19). Theorem 1 applies an affine entanglement bound to every finite-energy pure state, including non-Gaussian states. Equations (18)–(19) average it over arbitrary decompositions. Supplement S2.4 treats infinite-dimensional limits and probability-measure decompositions. [Ade26](https://doi.org/10.48550/arXiv.2608.01909)

## Comment

The affirmative resolution is an arXiv preprint, version 2; no peer-reviewed publication was identified in the September 2026 audit. It determines the single-copy convex roof. Additivity across copies remains separate. The record `01M1HME78068MQY7E9KA81B7WX` asks the distinct question for non-bisymmetric states with at least three modes.

## References

**WGKWC04** M. M. Wolf, G. Giedke, O. Krüger, R. F. Werner, and J. I. Cirac, "Gaussian Entanglement of Formation," *Physical Review A* **69**, 052320 (2004). [doi:10.1103/PhysRevA.69.052320](https://doi.org/10.1103/PhysRevA.69.052320); [arXiv:quant-ph/0306177](https://arxiv.org/abs/quant-ph/0306177).

**GWKWC03** G. Giedke, M. M. Wolf, O. Krüger, R. F. Werner, and J. I. Cirac, "Entanglement of Formation for Symmetric Gaussian States," *Physical Review Letters* **91**, 107901 (2003). [doi:10.1103/PhysRevLett.91.107901](https://doi.org/10.1103/PhysRevLett.91.107901); [arXiv:quant-ph/0304042](https://arxiv.org/abs/quant-ph/0304042).

**Ade26** G. Adesso, "Optimality of Gaussian Entanglement of Formation," preprint (2026), version 2, 13 August 2026. [doi:10.48550/arXiv.2608.01909](https://doi.org/10.48550/arXiv.2608.01909); [arXiv:2608.01909v2](https://arxiv.org/abs/2608.01909v2).
