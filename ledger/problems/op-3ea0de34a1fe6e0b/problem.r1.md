---
id: "01M1Q787QR8FTR00QF4PMHHWPE"
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
areaIds: ["quantum-shannon-theory"]
topicIds: ["quantum-capacity","private-capacity","coherent-information","quantum-channels"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Universal finite truncation of quantum and private capacities"
aliases: ["op-3ea0de34a1fe6e0b","op_3ea0de34a1fe6e0b","01M1Q787QR8FTR00QF4PMHHWPE"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_3ea0de34a1fe6e0b.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_3ea0de34a1fe6e0b","ulid":"01M1Q787QR8FTR00QF4PMHHWPE","aliases":["op_3ea0de34a1fe6e0b","01M1Q787QR8FTR00QF4PMHHWPE","op-3ea0de34a1fe6e0b"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-04T22:04:59Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"source-stated","posed":null,"areaIds":["quantum-shannon-theory"],"topicIds":["quantum-capacity","private-capacity","coherent-information","quantum-channels"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Universal finite truncation of quantum and private capacities","status":"Solved","fields":["Quantum Shannon theory"],"topics":["Quantum capacity","Private capacity","Coherent information","Quantum channels"],"statement":"Do there exist channel-independent finite integers $m_Q$ and $m_P$ that\ndetermine, respectively, the quantum capacity and the private classical\ncapacity of every finite-dimensional quantum channel?  Let $V_{A\\to BE}$ be\na Stinespring isometry for a channel and its\ncomplement, and define coherent information by\n\\begin{equation}\n  \\mathcal N_{A\\to B}(\\rho):=\\operatorname{Tr}_{E}[V\\rho V^\\dagger],\n  \\qquad\n  \\mathcal N^c_{A\\to E}(\\rho):=\\operatorname{Tr}_{B}[V\\rho V^\\dagger],\n  \\qquad\n  I_{\\rm c}(\\rho,\\mathcal N):=\n  S(\\mathcal N(\\rho))-S(\\mathcal N^c(\\rho)).\n  \\label{eq:p73-channel-and-coherent-information}\n\\end{equation}\nFor each $m\\geq1$, use Eq.~\\eqref{eq:p73-channel-and-coherent-information}\nto set\n\\begin{equation}\n  Q^{(m)}(\\mathcal N)\n  :=\\frac1m\\max_{\\rho_{A^m}}\n       I_{\\rm c}(\\rho_{A^m},\\mathcal N^{\\otimes m}),\n  \\qquad\n  Q(\\mathcal N):=\\sup_{m\\geq1}Q^{(m)}(\\mathcal N).\n  \\label{eq:p73-quantum-regularization}\n\\end{equation}\nFor an ensemble $\\{p_x,\\rho_x^{A^m}\\}$, let its joint channel output be\n\\begin{equation}\n  \\omega^{XB^mE^m}\n  :=\\sum_x p_x|x\\rangle\\!\\langle x|^X\\otimes\n    V^{\\otimes m}\\rho_x^{A^m}(V^\\dagger)^{\\otimes m}.\n  \\label{eq:p73-private-output-state}\n\\end{equation}\nIn terms of the state in Eq.~\\eqref{eq:p73-private-output-state}, define\n\\begin{equation}\n  P^{(m)}(\\mathcal N)\n  :=\\frac1m\\max_{\\{p_x,\\rho_x^{A^m}\\}}\n       \\bigl[I(X;B^m)_\\omega-I(X;E^m)_\\omega\\bigr],\n  \\qquad\n  P(\\mathcal N):=\\sup_{m\\geq1}P^{(m)}(\\mathcal N).\n  \\label{eq:p73-private-regularization}\n\\end{equation}\nThe question is whether there exist finite integers $m_Q$ and $m_P$,\nindependent of the channel dimensions and of $\\mathcal N$, such that\n\\begin{equation}\n  Q(\\mathcal N)=Q^{(m_Q)}(\\mathcal N)\n  \\quad\\text{and}\\quad\n  P(\\mathcal N)=P^{(m_P)}(\\mathcal N)\n  \\quad\\text{for every finite-dimensional }\\mathcal N.\n  \\label{eq:p73-universal-truncations}\n\\end{equation}","source":"Wilde asks whether an entropic formula evaluated on some finite tensor power\ncould replace the regularizations in Eqs.~\\eqref{eq:p73-quantum-regularization}\nand \\eqref{eq:p73-private-regularization}.  Equation~\\eqref{eq:p73-universal-truncations}\nrecords the uniform, channel-independent interpretation of that question\n\\sourcecite{ref:p73-wilde}{Wil17}.","progress":["Cubitt et al. proved that for every positive integer $n$ there is a\n  finite-dimensional channel $\\mathcal M_n$ such that\n  \\begin{equation}\n    Q^{(n)}(\\mathcal M_n)=0\n    \\quad\\text{while}\\quad\n    Q(\\mathcal M_n)>0.\n    \\label{eq:p73-cubitt-separation}\n  \\end{equation}\n  Equation~\\eqref{eq:p73-cubitt-separation} rules out every proposed\n  universal value of $m_Q$\n  \\sourcecite{ref:p73-cubitt-et-al}{CEM+15}.","Elkouss and Strelchuk proved that for every $n$ there is a channel\n  $\\mathcal N_n$ for which, for all $1\\leq k<n$,\n  \\begin{equation}\n    P^{(k)}(\\mathcal N_n)\n    <Q^{(k+1)}(\\mathcal N_n)\n    \\leq P(\\mathcal N_n).\n    \\label{eq:p73-elkouss-strelchuk-separation}\n  \\end{equation}\n  Choosing $n>m_P$ in\n  Eq.~\\eqref{eq:p73-elkouss-strelchuk-separation} rules out every universal\n  private-information truncation $m_P$\n  \\sourcecite{ref:p73-elkouss-strelchuk}{ES15}."],"references":[{"key":"Wil17","label":"ref:p73-wilde","tex":"M. M. Wilde, \\emph{Quantum Information Theory}, 2nd ed., Cambridge\n  University Press (2017), Sec.~26.6.\n  \\href{https://doi.org/10.1017/9781316809976}{doi:10.1017/9781316809976};\n  \\href{https://arxiv.org/abs/1106.1445}{arXiv:1106.1445}."},{"key":"CEM+15","label":"ref:p73-cubitt-et-al","tex":"T. S. Cubitt, D. Elkouss, W. Matthews, M. Ozols, D. P\\'erez-Garc\\'ia, and\n  S. Strelchuk, ``Unbounded Number of Channel Uses May Be Required to Detect\n  Quantum Capacity,'' \\emph{Nature Communications} \\textbf{6}, 6739 (2015).\n  \\href{https://doi.org/10.1038/ncomms7739}{doi:10.1038/ncomms7739};\n  \\href{https://arxiv.org/abs/1408.5115}{arXiv:1408.5115}."},{"key":"ES15","label":"ref:p73-elkouss-strelchuk","tex":"D. Elkouss and S. Strelchuk, ``Superadditivity of Private Information for\n  Any Number of Uses of the Channel,'' \\emph{Physical Review Letters}\n  \\textbf{115}, 040501 (2015).\n  \\href{https://doi.org/10.1103/PhysRevLett.115.040501}{doi:10.1103/PhysRevLett.115.040501};\n  \\href{https://arxiv.org/abs/1502.05326}{arXiv:1502.05326}."}],"comment":"The answer to Eq.~\\eqref{eq:p73-universal-truncations} is negative for both\ncapacities.  These counterexamples exclude only a channel-independent block\nlength for the standard coherent- and private-information regularizations;\nthey do not exclude finite stabilization for a particular channel or a\ndifferent exact capacity formula."}}
---
## Source

Wilde asks whether an entropic formula evaluated on some finite tensor power could replace the regularizations in Eqs. (2) and (4). Equation (5) records the uniform, channel-independent interpretation of that question [Wil17](https://doi.org/10.1017/9781316809976).

## Progress

Cubitt et al. proved that for every positive integer $n$ there is a finite-dimensional channel $\mathcal M_n$ such that

$$
Q^{(n)}(\mathcal M_n)=0
 \quad\text{while}\quad
 Q(\mathcal M_n)>0.
 \tag{6}
$$

Equation (6) rules out every proposed universal value of $m_Q$ [CEM+15](https://doi.org/10.1038/ncomms7739).

Elkouss and Strelchuk proved that for every $n$ there is a channel $\mathcal N_n$ for which, for all $1\leq k<n$,

$$
P^{(k)}(\mathcal N_n)
 <Q^{(k+1)}(\mathcal N_n)
 \leq P(\mathcal N_n).
 \tag{7}
$$

Choosing $n>m_P$ in Eq. (7) rules out every universal private-information truncation $m_P$ [ES15](https://doi.org/10.1103/PhysRevLett.115.040501).

## Comment

The answer to Eq. (5) is negative for both capacities. These counterexamples exclude only a channel-independent block length for the standard coherent- and private-information regularizations; they do not exclude finite stabilization for a particular channel or a different exact capacity formula.

## References

**Wil17** M. M. Wilde, *Quantum Information Theory*, 2nd ed., Cambridge University Press (2017), Sec. 26.6. [doi:10.1017/9781316809976](https://doi.org/10.1017/9781316809976); [arXiv:1106.1445](https://arxiv.org/abs/1106.1445).

**CEM+15** T. S. Cubitt, D. Elkouss, W. Matthews, M. Ozols, D. Pérez-García, and S. Strelchuk, “Unbounded Number of Channel Uses May Be Required to Detect Quantum Capacity,” *Nature Communications* **6**, 6739 (2015). [doi:10.1038/ncomms7739](https://doi.org/10.1038/ncomms7739); [arXiv:1408.5115](https://arxiv.org/abs/1408.5115).

**ES15** D. Elkouss and S. Strelchuk, “Superadditivity of Private Information for Any Number of Uses of the Channel,” *Physical Review Letters* **115**, 040501 (2015). [doi:10.1103/PhysRevLett.115.040501](https://doi.org/10.1103/PhysRevLett.115.040501); [arXiv:1502.05326](https://arxiv.org/abs/1502.05326).
