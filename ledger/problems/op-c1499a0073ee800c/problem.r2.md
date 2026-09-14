---
id: "01M26KH5Q01RBBB2QYFHZ8D5V7"
type: "Problem"
schemaVersion: "1.0"
revision: 2
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-14T21:22:56.774Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["gaussian-quantum-information","entanglement-cost","additivity-and-regularization"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M26KH5NF45HBHXTPG8ZBD75H"]
title: "Additivity of entanglement of formation for two-mode Gaussian states"
aliases: ["op-c1499a0073ee800c","op_c1499a0073ee800c","01M26KH5Q01RBBB2QYFHZ8D5V7"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_c1499a0073ee800c.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_c1499a0073ee800c","ulid":"01M26KH5Q01RBBB2QYFHZ8D5V7","aliases":["op_c1499a0073ee800c","01M26KH5Q01RBBB2QYFHZ8D5V7","op-c1499a0073ee800c"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:28:11.232Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["gaussian-quantum-information","entanglement-cost","additivity-and-regularization"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M26KH5NF45HBHXTPG8ZBD75H"]},"title":"Additivity of entanglement of formation for two-mode Gaussian states","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Gaussian quantum information","Entanglement cost","Additivity and regularization"],"statement":"Is unrestricted entanglement of formation additive on tensor powers of every finite-energy two-mode Gaussian state?\n\nLet $\\rho_{AB}$ be any finite-energy two-mode Gaussian density operator, shared between one mode at each party. Finite energy means finite total mean photon number. Define the unrestricted pure-state convex roof\n\n\\begin{equation}\n\\begin{gathered}\nE_F(\\omega):=\\inf_\\mu\\int S(\\operatorname{Tr}_B|\\psi\\rangle\\langle\\psi|)\\,\\mu(d\\psi),\n\\\\\nS(\\tau):=-\\operatorname{Tr}(\\tau\\log_2\\tau),\n\\end{gathered}\n\\label{eq:ser12-statement-1}\n\\end{equation}\n\nIn Eq.~\\eqref{eq:ser12-statement-1}, $\\mu$ ranges over pure-state probability measures with barycentre $\\omega$.\n\nThe target is $E_F(\\rho_{AB}^{\\otimes k})=kE_F(\\rho_{AB})$ for every integer $k\\geq1$. The bipartition for the tensor power is $A^k:B^k$. Non-Gaussian vectors are allowed in all decompositions.","source":"Adesso explicitly leaves equality of entanglement cost and single-copy entanglement of formation open in the Conclusion and Outlook \\sourcecite{ref:ser12-2}{Ade26}. Under the finite-entropy cost theorem this is equivalent to tensor-power additivity \\sourcecite{ref:ser12-1}{YKHL25}.","progress":["Theorem 7 of Yamasaki et al. identifies entanglement cost with the regularized convex roof:\n\n\\begin{equation}\nE_C(\\rho_{AB})=\\lim_{k\\to\\infty}\\frac1kE_F(\\rho_{AB}^{\\otimes k}),\n\\label{eq:ser12-progress-1-1}\n\\end{equation}\n\nEquation~\\eqref{eq:ser12-progress-1-1} includes the continuous pure-state roof. Finite local entropy suffices; finite-energy states on finitely many modes satisfy this hypothesis. Here $E_C$ is the asymptotic Bell-pair consumption per target copy under LOCC with vanishing trace-norm error. \\sourcecite{ref:ser12-1}{YKHL25}","Tensor products of single-copy ensembles give only\n\n\\begin{equation}\nE_C(\\rho_{AB})\\leq\\frac1kE_F(\\rho_{AB}^{\\otimes k})\\leq E_F(\\rho_{AB}),\n\\label{eq:ser12-progress-2-1}\n\\end{equation}\n\nThe reverse inequality needed to saturate Eq.~\\eqref{eq:ser12-progress-2-1} remains open, as stated in Adesso's Conclusion and Outlook. \\sourcecite{ref:ser12-2}{Ade26}","Wilde, Proposition 6 and Eqs. (141)--(143), proves Eq.~\\eqref{eq:ser12-progress-3-1} for $\\rho_{AB}=(\\operatorname{id}\\otimes\\mathcal N)(|\\Phi_{N_s}\\rangle\\langle\\Phi_{N_s}|)$. Here $|\\Phi_{N_s}\\rangle:=\\sum_{j\\geq0}\\sqrt{N_s^j/(N_s+1)^{j+1}}|j,j\\rangle$ is a two-mode squeezed vacuum with $N_s\\geq0$. The channel $\\mathcal N$ is either pure loss with transmissivity $0<\\eta<1$, or a quantum-limited amplifier with gain $G>1$.\n\n\\begin{equation}\n\\begin{gathered}\nE_F(\\rho_{AB}^{\\otimes k})=kE_F(\\rho_{AB}),\\\\\nE_C(\\rho_{AB})=E_F(\\rho_{AB})=E_F^{\\mathrm G}(\\rho_{AB}).\n\\end{gathered}\n\\label{eq:ser12-progress-3-1}\n\\end{equation}\n\nHere $E_F^{\\mathrm G}$ is the restriction to Gaussian pure-state decompositions. \\sourcecite{ref:ser12-3}{Wil18}","Wilde, Remark 2 and Eq. (157), extends the additivity of optimized conditional entropy to the full two-mode Gaussian family considered by Pirandola et al. By purification duality this gives entanglement-of-formation additivity for the corresponding complementary states, whose mode counts must be checked separately. Remark 3 explains why Proposition 6 does not directly extend to generic noisy channel-output states: a faithful two-mode state needs a purification with at least four modes \\sourcecite{ref:ser12-3}{Wil18}, \\sourcecite{ref:ser12-discord}{PSBCL14}.","Marian and Marian published a claim of additivity for arbitrary two-mode Gaussian states \\sourcecite{ref:ser12-marian}{MM08}. Adesso's Conclusion and Outlook explains the unresolved step: tensoring the proposed single-copy ensembles gives only $E_F(\\rho^{\\otimes k})\\leq kE_F(\\rho)$, not the required lower bound against collective non-Gaussian ensembles \\sourcecite{ref:ser12-2}{Ade26}.","Wolf et al., Section VII, Proposition 3, prove additivity of the Gaussian entanglement of formation for symmetric two-mode Gaussian states. This restricted-roof result does not exclude collective non-Gaussian decompositions in the unrestricted many-copy roof \\sourcecite{ref:ser12-wolf}{WGKWC04}."],"references":[{"key":"YKHL25","label":"ref:ser12-1","tex":"H. Yamasaki, K. Kuroiwa, P. Hayden, and L. Lami, \"Entanglement Cost for Infinite-Dimensional Physical Systems,\" \\emph{Communications in Mathematical Physics} \\textbf{406}, 277 (2025). \\href{https://doi.org/10.1007/s00220-025-05431-1}{doi:10.1007/s00220-025-05431-1}; \\href{https://arxiv.org/abs/2401.09554}{arXiv:2401.09554}."},{"key":"Ade26","label":"ref:ser12-2","tex":"G. Adesso, \"Optimality of Gaussian Entanglement of Formation,\" preprint (2026), version 2, 13 August 2026. \\href{https://doi.org/10.48550/arXiv.2608.01909}{doi:10.48550/arXiv.2608.01909}; \\href{https://arxiv.org/abs/2608.01909v2}{arXiv:2608.01909v2}."},{"key":"Wil18","label":"ref:ser12-3","tex":"M. M. Wilde, \"Entanglement Cost and Quantum Channel Simulation,\" \\emph{Physical Review A} \\textbf{98}, 042338 (2018). \\href{https://doi.org/10.1103/PhysRevA.98.042338}{doi:10.1103/PhysRevA.98.042338}; \\href{https://arxiv.org/abs/1807.11939}{arXiv:1807.11939}."},{"key":"PSBCL14","label":"ref:ser12-discord","tex":"S. Pirandola, G. Spedalieri, S. L. Braunstein, N. J. Cerf, and S. Lloyd, \"Optimality of Gaussian Discord,\" \\emph{Physical Review Letters} \\textbf{113}, 140405 (2014). \\href{https://doi.org/10.1103/PhysRevLett.113.140405}{doi:10.1103/PhysRevLett.113.140405}; \\href{https://arxiv.org/abs/1309.2215}{arXiv:1309.2215}."},{"key":"MM08","label":"ref:ser12-marian","tex":"P. Marian and T. A. Marian, ``Entanglement of Formation for an Arbitrary Two-Mode Gaussian State,'' \\emph{Physical Review Letters} \\textbf{101}, 220403 (2008). \\href{https://doi.org/10.1103/PhysRevLett.101.220403}{doi:10.1103/PhysRevLett.101.220403}; \\href{https://arxiv.org/abs/0809.0321}{arXiv:0809.0321}."},{"key":"WGKWC04","label":"ref:ser12-wolf","tex":"M. M. Wolf, G. Giedke, O. Kr\\\"uger, R. F. Werner, and J. I. Cirac, \"Gaussian Entanglement of Formation,\" \\emph{Physical Review A} \\textbf{69}, 052320 (2004). \\href{https://doi.org/10.1103/PhysRevA.69.052320}{doi:10.1103/PhysRevA.69.052320}; \\href{https://arxiv.org/abs/quant-ph/0306177}{arXiv:quant-ph/0306177}."}],"comment":"The missing inequality must exclude collective non-Gaussian decompositions of many copies. A single-copy covariance optimization does not provide this exclusion. The cost is measured in asymptotic Bell pairs per copy with vanishing trace-norm error under unrestricted LOCC."}}
---
## Source

Adesso explicitly leaves equality of entanglement cost and single-copy entanglement of formation open in the Conclusion and Outlook [Ade26](https://doi.org/10.48550/arXiv.2608.01909). Under the finite-entropy cost theorem this is equivalent to tensor-power additivity [YKHL25](https://doi.org/10.1007/s00220-025-05431-1).

## Progress

Theorem 7 of Yamasaki et al. identifies entanglement cost with the regularized convex roof:

$$
E_C(\rho_{AB})=\lim_{k\to\infty}\frac1kE_F(\rho_{AB}^{\otimes k}),
\tag{2}
$$

Equation (2) includes the continuous pure-state roof. Finite local entropy suffices; finite-energy states on finitely many modes satisfy this hypothesis. Here $E_C$ is the asymptotic Bell-pair consumption per target copy under LOCC with vanishing trace-norm error. [YKHL25](https://doi.org/10.1007/s00220-025-05431-1)

Tensor products of single-copy ensembles give only

$$
E_C(\rho_{AB})\leq\frac1kE_F(\rho_{AB}^{\otimes k})\leq E_F(\rho_{AB}),
\tag{3}
$$

The reverse inequality needed to saturate Eq. (3) remains open, as stated in Adesso’s Conclusion and Outlook. [Ade26](https://doi.org/10.48550/arXiv.2608.01909)

Wilde, Proposition 6 and Eqs. (141)–(143), proves Eq. (4) for $\rho_{AB}=(\operatorname{id}\otimes\mathcal N)(|\Phi_{N_s}\rangle\langle\Phi_{N_s}|)$. Here $|\Phi_{N_s}\rangle:=\sum_{j\geq0}\sqrt{N_s^j/(N_s+1)^{j+1}}|j,j\rangle$ is a two-mode squeezed vacuum with $N_s\geq0$. The channel $\mathcal N$ is either pure loss with transmissivity $0<\eta<1$, or a quantum-limited amplifier with gain $G>1$.

$$
\begin{gathered}
E_F(\rho_{AB}^{\otimes k})=kE_F(\rho_{AB}),\\
E_C(\rho_{AB})=E_F(\rho_{AB})=E_F^{\mathrm G}(\rho_{AB}).
\end{gathered}
\tag{4}
$$

Here $E_F^{\mathrm G}$ is the restriction to Gaussian pure-state decompositions. [Wil18](https://doi.org/10.1103/PhysRevA.98.042338)

Wilde, Remark 2 and Eq. (157), extends the additivity of optimized conditional entropy to the full two-mode Gaussian family considered by Pirandola et al. By purification duality this gives entanglement-of-formation additivity for the corresponding complementary states, whose mode counts must be checked separately. Remark 3 explains why Proposition 6 does not directly extend to generic noisy channel-output states: a faithful two-mode state needs a purification with at least four modes [Wil18](https://doi.org/10.1103/PhysRevA.98.042338), [PSBCL14](https://doi.org/10.1103/PhysRevLett.113.140405).

Marian and Marian published a claim of additivity for arbitrary two-mode Gaussian states [MM08](https://doi.org/10.1103/PhysRevLett.101.220403). Adesso’s Conclusion and Outlook explains the unresolved step: tensoring the proposed single-copy ensembles gives only $E_F(\rho^{\otimes k})\leq kE_F(\rho)$, not the required lower bound against collective non-Gaussian ensembles [Ade26](https://doi.org/10.48550/arXiv.2608.01909).

Wolf et al., Section VII, Proposition 3, prove additivity of the Gaussian entanglement of formation for symmetric two-mode Gaussian states. This restricted-roof result does not exclude collective non-Gaussian decompositions in the unrestricted many-copy roof [WGKWC04](https://doi.org/10.1103/PhysRevA.69.052320).

## Comment

The missing inequality must exclude collective non-Gaussian decompositions of many copies. A single-copy covariance optimization does not provide this exclusion. The cost is measured in asymptotic Bell pairs per copy with vanishing trace-norm error under unrestricted LOCC.

## References

**YKHL25** H. Yamasaki, K. Kuroiwa, P. Hayden, and L. Lami, "Entanglement Cost for Infinite-Dimensional Physical Systems," *Communications in Mathematical Physics* **406**, 277 (2025). [doi:10.1007/s00220-025-05431-1](https://doi.org/10.1007/s00220-025-05431-1); [arXiv:2401.09554](https://arxiv.org/abs/2401.09554).

**Ade26** G. Adesso, "Optimality of Gaussian Entanglement of Formation," preprint (2026), version 2, 13 August 2026. [doi:10.48550/arXiv.2608.01909](https://doi.org/10.48550/arXiv.2608.01909); [arXiv:2608.01909v2](https://arxiv.org/abs/2608.01909v2).

**Wil18** M. M. Wilde, "Entanglement Cost and Quantum Channel Simulation," *Physical Review A* **98**, 042338 (2018). [doi:10.1103/PhysRevA.98.042338](https://doi.org/10.1103/PhysRevA.98.042338); [arXiv:1807.11939](https://arxiv.org/abs/1807.11939).

**PSBCL14** S. Pirandola, G. Spedalieri, S. L. Braunstein, N. J. Cerf, and S. Lloyd, "Optimality of Gaussian Discord," *Physical Review Letters* **113**, 140405 (2014). [doi:10.1103/PhysRevLett.113.140405](https://doi.org/10.1103/PhysRevLett.113.140405); [arXiv:1309.2215](https://arxiv.org/abs/1309.2215).

**MM08** P. Marian and T. A. Marian, “Entanglement of Formation for an Arbitrary Two-Mode Gaussian State,” *Physical Review Letters* **101**, 220403 (2008). [doi:10.1103/PhysRevLett.101.220403](https://doi.org/10.1103/PhysRevLett.101.220403); [arXiv:0809.0321](https://arxiv.org/abs/0809.0321).

**WGKWC04** M. M. Wolf, G. Giedke, O. Krüger, R. F. Werner, and J. I. Cirac, "Gaussian Entanglement of Formation," *Physical Review A* **69**, 052320 (2004). [doi:10.1103/PhysRevA.69.052320](https://doi.org/10.1103/PhysRevA.69.052320); [arXiv:quant-ph/0306177](https://arxiv.org/abs/quant-ph/0306177).
