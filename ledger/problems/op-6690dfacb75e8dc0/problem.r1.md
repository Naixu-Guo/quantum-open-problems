---
id: "01M22N8KP9D6068AH2N8T372C8"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-09T08:42:44.429Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "source-stated"
posed: null
areaIds: ["quantum-communication"]
topicIds: ["quantum-capacity","additivity-and-regularization"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M1HME7809M71BG24CSMYKA8A"]
title: "Quantum capacity of higher-dimensional depolarizing channels"
aliases: ["op-6690dfacb75e8dc0","op_6690dfacb75e8dc0","01M22N8KP9D6068AH2N8T372C8"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_6690dfacb75e8dc0.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_6690dfacb75e8dc0","ulid":"01M22N8KP9D6068AH2N8T372C8","aliases":["op_6690dfacb75e8dc0","01M22N8KP9D6068AH2N8T372C8","op-6690dfacb75e8dc0"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-09T08:41:30.057Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-communication"],"topicIds":["quantum-capacity","additivity-and-regularization"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M1HME7809M71BG24CSMYKA8A"]},"title":"Quantum capacity of higher-dimensional depolarizing channels","status":"Unsolved","fields":["Quantum Communication"],"topics":["Quantum capacity","Additivity and regularization"],"statement":"What is the unassisted quantum capacity of a depolarizing channel in every finite dimension $d\\geq3$? For $0\\leq\\lambda\\leq1$, define the channel on $\\mathcal L(\\mathbb C^d)$ by\n\\begin{equation}\n \\mathcal N_{d,\\lambda}(\\rho)=\\lambda\\rho+(1-\\lambda)\\operatorname{Tr}(\\rho)\\frac{I_d}{d}.\n \\label{eq:h14-channel}\n\\end{equation}\nThe capacity $Q(\\mathcal N)$ is the supremum of asymptotic qubit rates achievable with entanglement fidelity tending to one by arbitrary encoders and decoders over independent uses, without entanglement or classical-communication assistance. For a complementary channel $\\mathcal N^c$ from any Stinespring dilation and $S(\\sigma)=-\\operatorname{Tr}\\sigma\\log_2\\sigma$, it equals\n\\begin{equation}\n Q(\\mathcal N)=\\sup_{n\\geq1}\\frac1n\\max_{\\rho\\in\\mathcal D((\\mathbb C^d)^{\\otimes n})}\\left[S(\\mathcal N^{\\otimes n}(\\rho))-S((\\mathcal N^c)^{\\otimes n}(\\rho))\\right].\n \\label{eq:h14-capacity}\n\\end{equation}\nDetermine Eq.~\\eqref{eq:h14-capacity} for the family in Eq.~\\eqref{eq:h14-channel}, including the exact boundary between zero and positive capacity. The unresolved parameter regime is\n\\begin{equation}\n \\frac{d+2}{2(d+1)}<\\lambda<1.\n \\label{eq:h14-range}\n\\end{equation}\nAn evaluation of one input state or one finite block length alone does not determine the supremum in Eq.~\\eqref{eq:h14-capacity} throughout Eq.~\\eqref{eq:h14-range}.","source":"The supplied note derives this question from Hayashi's treatment of quantum capacity. Etxezarreta Martinez, deMarti iOlius, and Crespo explicitly state the unresolved capacity problem for the finite-dimensional depolarizing family in Section~I, p.~2, and define the channel in Section~II, Eq.~(3) \\sourcecite{ref:h14-emc}{EMC23}. Their replacement-noise parameter is $p=1-\\lambda$.","progress":["The channel has zero capacity for $1-\\lambda\\geq d/[2(d+1)]$ because it is antidegradable; at $\\lambda=1$ it has capacity $\\log_2 d$. Put $p=1-\\lambda$ and $q=p(1-d^{-2})$. The maximally mixed input gives the hashing lower bound, while the no-cloning bound gives\n\\begin{equation}\n \\max\\{0,\\log_2 d-h_2(q)-q\\log_2(d^2-1)\\}\\leq Q(\\mathcal N_{d,\\lambda})\\leq\\max\\!\\left\\{0,1-\\frac{2(d+1)p}{d}\\right\\}\\log_2 d,\n \\label{eq:h14-bounds}\n\\end{equation}\nwhere $h_2(q)=-q\\log_2q-(1-q)\\log_2(1-q)$. These bounds in Eq.~\\eqref{eq:h14-bounds} leave a gap in Eq.~\\eqref{eq:h14-range}; see Section~II, Eqs.~(4)--(6) \\sourcecite{ref:h14-emc}{EMC23}.","Kianvash, Fanizza, and Giovannetti construct degradable flagged extensions giving improved upper bounds for qudit depolarizing channels. Their Section~5.4 and Figure~2 include a nontrivial dimension-four comparison; optimizing these extension bounds does not supply matching transmission codes \\sourcecite{ref:h14-kfg}{KFG22}.","In the limit of increasing dimension, the no-cloning and hashing bounds meet after division by $\\log_2 d$: for fixed $p$, the normalized capacity tends to $\\max\\{0,1-2p\\}$. Theorem~1 and Corollary~1 analyze this normalized gap. This asymptotic statement neither evaluates the capacity for a fixed finite $d\\geq3$ nor proves that the absolute gap in qubits vanishes \\sourcecite{ref:h14-emc}{EMC23}."],"references":[{"key":"EMC23","label":"ref:h14-emc","tex":"J. Etxezarreta Martinez, A. deMarti iOlius, and P. M. Crespo, ``Superadditivity effects of quantum capacity decrease with the dimension for qudit depolarizing channels,'' \\emph{Physical Review A} \\textbf{108}, 032602 (2023). \\href{https://doi.org/10.1103/PhysRevA.108.032602}{doi:10.1103/PhysRevA.108.032602}; \\href{https://arxiv.org/abs/2301.10132}{arXiv:2301.10132}."},{"key":"KFG22","label":"ref:h14-kfg","tex":"F. Kianvash, M. Fanizza, and V. Giovannetti, ``Bounding the quantum capacity with flagged extensions,'' \\emph{Quantum} \\textbf{6}, 647 (2022). \\href{https://doi.org/10.22331/q-2022-02-09-647}{doi:10.22331/q-2022-02-09-647}; \\href{https://arxiv.org/abs/2008.02461}{arXiv:2008.02461}."}],"comment":"Audited on 2026-09-09 against the full cited papers and subsequent capacity literature. The existing qubit Pauli-capacity record already contains the dimension-two depolarizing problem and its July--August~2026 coding progress; the present record retains only the higher-dimensional remainder. No existing general qudit-Pauli-capacity statement was found. The depolarizing channel's additive classical Holevo capacity is a different quantity and does not remove the coherent-information regularization in Eq.~\\eqref{eq:h14-capacity}. The large-dimension result is in qudits per channel use, obtained by normalizing rates by $\\log_2 d$, and supplies no fixed-dimension solution."}}
---
## Source

The supplied note derives this question from Hayashi’s treatment of quantum capacity. Etxezarreta Martinez, deMarti iOlius, and Crespo explicitly state the unresolved capacity problem for the finite-dimensional depolarizing family in Section I, p. 2, and define the channel in Section II, Eq. (3) [EMC23](https://doi.org/10.1103/PhysRevA.108.032602). Their replacement-noise parameter is $p=1-\lambda$.

## Progress

The channel has zero capacity for $1-\lambda\geq d/[2(d+1)]$ because it is antidegradable; at $\lambda=1$ it has capacity $\log_2 d$. Put $p=1-\lambda$ and $q=p(1-d^{-2})$. The maximally mixed input gives the hashing lower bound, while the no-cloning bound gives

$$
\max\{0,\log_2 d-h_2(q)-q\log_2(d^2-1)\}\leq Q(\mathcal N_{d,\lambda})\leq\max\!\left\{0,1-\frac{2(d+1)p}{d}\right\}\log_2 d,
\tag{4}
$$

where $h_2(q)=-q\log_2q-(1-q)\log_2(1-q)$. These bounds in Eq. (4) leave a gap in Eq. (3); see Section II, Eqs. (4)–(6) [EMC23](https://doi.org/10.1103/PhysRevA.108.032602).

Kianvash, Fanizza, and Giovannetti construct degradable flagged extensions giving improved upper bounds for qudit depolarizing channels. Their Section 5.4 and Figure 2 include a nontrivial dimension-four comparison; optimizing these extension bounds does not supply matching transmission codes [KFG22](https://doi.org/10.22331/q-2022-02-09-647).

In the limit of increasing dimension, the no-cloning and hashing bounds meet after division by $\log_2 d$: for fixed $p$, the normalized capacity tends to $\max\{0,1-2p\}$. Theorem 1 and Corollary 1 analyze this normalized gap. This asymptotic statement neither evaluates the capacity for a fixed finite $d\geq3$ nor proves that the absolute gap in qubits vanishes [EMC23](https://doi.org/10.1103/PhysRevA.108.032602).

## Comment

Audited on 2026-09-09 against the full cited papers and subsequent capacity literature. The existing qubit Pauli-capacity record already contains the dimension-two depolarizing problem and its July–August 2026 coding progress; the present record retains only the higher-dimensional remainder. No existing general qudit-Pauli-capacity statement was found. The depolarizing channel’s additive classical Holevo capacity is a different quantity and does not remove the coherent-information regularization in Eq. (2). The large-dimension result is in qudits per channel use, obtained by normalizing rates by $\log_2 d$, and supplies no fixed-dimension solution.

## References

**EMC23** J. Etxezarreta Martinez, A. deMarti iOlius, and P. M. Crespo, “Superadditivity effects of quantum capacity decrease with the dimension for qudit depolarizing channels,” *Physical Review A* **108**, 032602 (2023). [doi:10.1103/PhysRevA.108.032602](https://doi.org/10.1103/PhysRevA.108.032602); [arXiv:2301.10132](https://arxiv.org/abs/2301.10132).

**KFG22** F. Kianvash, M. Fanizza, and V. Giovannetti, “Bounding the quantum capacity with flagged extensions,” *Quantum* **6**, 647 (2022). [doi:10.22331/q-2022-02-09-647](https://doi.org/10.22331/q-2022-02-09-647); [arXiv:2008.02461](https://arxiv.org/abs/2008.02461).
