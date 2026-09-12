---
id: "01M26JZEVQ8NQEB21FMPX569QJ"
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
areaIds: ["quantum-communication"]
topicIds: ["matrix-and-entropy-inequalities","gaussian-quantum-information"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Wigner entropy conjecture"
aliases: ["op-8682c870bea8ab4e","op_8682c870bea8ab4e","01M26JZEVQ8NQEB21FMPX569QJ"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_8682c870bea8ab4e.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_8682c870bea8ab4e","ulid":"01M26JZEVQ8NQEB21FMPX569QJ","aliases":["op_8682c870bea8ab4e","01M26JZEVQ8NQEB21FMPX569QJ","op-8682c870bea8ab4e"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:18:30.775Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["matrix-and-entropy-inequalities","gaussian-quantum-information"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Wigner entropy conjecture","status":"Unsolved","fields":["Quantum Communication"],"topics":["Matrix and entropy inequalities","Gaussian quantum information"],"statement":"Does every finite-energy single-mode state with a nonnegative Wigner function have Wigner entropy at least $1+\\ln\\pi$?\nLet $\\rho$ be a density operator with $\\operatorname{Tr}(\\rho a^\\dagger a)<\\infty$, where $a=(q+ip)/\\sqrt2$ and $[q,p]=i$. Require $W_\\rho(q,p)\\geq0$. Use the normalization $\\int_{\\mathbb R^2}W_\\rho(q,p)\\,dq\\,dp=1$ and vacuum convention $W_{|0\\rangle}(q,p)=\\pi^{-1}e^{-q^2-p^2}$. With natural logarithms and $0\\ln0=0$, the proposed bound is\n\\begin{equation}\n h_W(\\rho):=-\\int_{\\mathbb R^2}W_\\rho(q,p)\\ln W_\\rho(q,p)\\,dq\\,dp\n \\geq1+\\ln\\pi.\n \\label{eq:wigner-entropy}\n\\end{equation}\nProve Eq.~\\eqref{eq:wigner-entropy} for all such physical states, or exhibit a density operator violating it.","source":"Van Herstraeten and Cerf state the conjecture in Eq.~(10) of ``Quantum Wigner Entropy'' \\sourcecite{ref:wigner-original}{VHC21}. The finite-energy restriction makes the moments and entropies used here finite.","progress":["Pure Gaussian states attain $h_W=1+\\ln\\pi$. The bound also holds for passive harmonic-oscillator states, whose Fock-state probabilities decrease with photon number; see Sec.~IV, especially Eq.~(44) \\sourcecite{ref:wigner-original}{VHC21}.","Theorem~1 of Van Herstraeten and Cerf proves the bound for outputs obtained by applying a balanced beam splitter to a separable two-mode state and discarding one output. Such outputs are Wigner nonnegative. The theorem is a Wigner--R\\'enyi entropy bound for orders at least $1/2$, including the Shannon limit in Eq.~\\eqref{eq:wigner-entropy} \\sourcecite{ref:wigner-bs}{VHC25}.","Qian and Gagatsos prove the sufficient condition $\\mu\\leq2/e$, where $\\mu=\\operatorname{Tr}\\rho^2=2\\pi\\int W_\\rho^2$, in Sec.~III.4, Eq.~(26). Their Proposition~1 concerns relaxed phase-space constraints; its extremizers need not represent positive density operators and do not disprove the conjecture \\sourcecite{ref:wigner-purity}{QG26}."],"references":[{"key":"VHC21","label":"ref:wigner-original","tex":"Z. Van Herstraeten and N. J. Cerf, ``Quantum Wigner Entropy,'' \\emph{Physical Review A} \\textbf{104}, 042211 (2021). \\href{https://doi.org/10.1103/PhysRevA.104.042211}{doi:10.1103/PhysRevA.104.042211}; \\href{https://arxiv.org/abs/2105.12843}{arXiv:2105.12843}."},{"key":"VHC25","label":"ref:wigner-bs","tex":"Z. Van Herstraeten and N. J. Cerf, ``Wigner Entropy Conjecture and the Interference Formula in Quantum Phase Space,'' \\emph{Physical Review A} \\textbf{112}, 062207 (2025). \\href{https://doi.org/10.1103/1ftk-dm7l}{doi:10.1103/1ftk-dm7l}; \\href{https://arxiv.org/abs/2411.05562}{arXiv:2411.05562}."},{"key":"QG26","label":"ref:wigner-purity","tex":"Q. Qian and C. N. Gagatsos, ``Upper Bounds on the Purity of Wigner Non-negative Quantum States That Verify the Wigner Entropy Conjecture,'' \\emph{Physical Review A} \\textbf{114}, 022408 (2026). \\href{https://doi.org/10.1103/6vcd-qyj9}{doi:10.1103/6vcd-qyj9}; \\href{https://arxiv.org/abs/2601.16898}{arXiv:2601.16898}."}],"comment":"The remaining gap includes mixed physical states with $2/e<\\mu<1$ outside the proved subclasses. The pure-state endpoint is Gaussian by Hudson's theorem and already attains equality. Nonnegativity and normalization of an arbitrary phase-space function do not ensure that it is a Wigner function of a density operator."}}
---
## Source

Van Herstraeten and Cerf state the conjecture in Eq. (10) of “Quantum Wigner Entropy” [VHC21](https://doi.org/10.1103/PhysRevA.104.042211). The finite-energy restriction makes the moments and entropies used here finite.

## Progress

Pure Gaussian states attain $h_W=1+\ln\pi$. The bound also holds for passive harmonic-oscillator states, whose Fock-state probabilities decrease with photon number; see Sec. IV, especially Eq. (44) [VHC21](https://doi.org/10.1103/PhysRevA.104.042211).

Theorem 1 of Van Herstraeten and Cerf proves the bound for outputs obtained by applying a balanced beam splitter to a separable two-mode state and discarding one output. Such outputs are Wigner nonnegative. The theorem is a Wigner–Rényi entropy bound for orders at least $1/2$, including the Shannon limit in Eq. (1) [VHC25](https://doi.org/10.1103/1ftk-dm7l).

Qian and Gagatsos prove the sufficient condition $\mu\leq2/e$, where $\mu=\operatorname{Tr}\rho^2=2\pi\int W_\rho^2$, in Sec. III.4, Eq. (26). Their Proposition 1 concerns relaxed phase-space constraints; its extremizers need not represent positive density operators and do not disprove the conjecture [QG26](https://doi.org/10.1103/6vcd-qyj9).

## Comment

The remaining gap includes mixed physical states with $2/e<\mu<1$ outside the proved subclasses. The pure-state endpoint is Gaussian by Hudson’s theorem and already attains equality. Nonnegativity and normalization of an arbitrary phase-space function do not ensure that it is a Wigner function of a density operator.

## References

**VHC21** Z. Van Herstraeten and N. J. Cerf, “Quantum Wigner Entropy,” *Physical Review A* **104**, 042211 (2021). [doi:10.1103/PhysRevA.104.042211](https://doi.org/10.1103/PhysRevA.104.042211); [arXiv:2105.12843](https://arxiv.org/abs/2105.12843).

**VHC25** Z. Van Herstraeten and N. J. Cerf, “Wigner Entropy Conjecture and the Interference Formula in Quantum Phase Space,” *Physical Review A* **112**, 062207 (2025). [doi:10.1103/1ftk-dm7l](https://doi.org/10.1103/1ftk-dm7l); [arXiv:2411.05562](https://arxiv.org/abs/2411.05562).

**QG26** Q. Qian and C. N. Gagatsos, “Upper Bounds on the Purity of Wigner Non-negative Quantum States That Verify the Wigner Entropy Conjecture,” *Physical Review A* **114**, 022408 (2026). [doi:10.1103/6vcd-qyj9](https://doi.org/10.1103/6vcd-qyj9); [arXiv:2601.16898](https://arxiv.org/abs/2601.16898).
