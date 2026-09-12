---
id: "01M26KH5M08P2ATTX0CB1N1E09"
type: "Problem"
schemaVersion: "1.0"
revision: 1
createdBy: "01M1VDQX7KEACQQ8KY2HZ5DTFK"
createdAt: "2026-09-10T21:50:00.391Z"
role: "primary"
parentProblemId: null
parentClauseId: null
origin: "derived"
posed: null
areaIds: ["quantum-resource-theory"]
topicIds: ["gaussian-quantum-information","resource-conversion"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Asymptotic nonclassical-state conversion by linear optics"
aliases: ["op-dc53476a203c535b","op_dc53476a203c535b","01M26KH5M08P2ATTX0CB1N1E09"]
authoredCatalog: {"status":"Unsolved","sourcePath":"database/problems_json/op_dc53476a203c535b.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_dc53476a203c535b","ulid":"01M26KH5M08P2ATTX0CB1N1E09","aliases":["op_dc53476a203c535b","01M26KH5M08P2ATTX0CB1N1E09","op-dc53476a203c535b"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:28:11.136Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-resource-theory"],"topicIds":["gaussian-quantum-information","resource-conversion"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Asymptotic nonclassical-state conversion by linear optics","status":"Unsolved","fields":["Quantum Resource Theory"],"topics":["Gaussian quantum information","Resource conversion"],"statement":"What is the optimal asymptotic conversion rate between finite-energy bosonic states under passive linear-optical protocols?\n\nLet $\\rho$ and $\\sigma$ be finite-energy density operators on finitely many bosonic modes, with $\\sigma$ nonclassical. Finite energy means finite total mean photon number. Classical states form the trace-norm closed convex hull of multimode coherent states. The allowed deterministic protocols $\\Lambda_k$ use passive linear-optical unitaries, ancillary coherent-state mixtures, destructive measurements, classical feed-forward, and discarding modes. Measurements may be non-Gaussian. The complete protocol is trace preserving; failure outcomes cannot be omitted.\n\nUse the trace norm $\\lVert X\\rVert_1:=\\operatorname{Tr}\\sqrt{X^\\dagger X}$. A rate $r\\geq0$ is achievable if an allowed sequence $(\\Lambda_k)_{k\\geq1}$ satisfies\n\n\\begin{equation}\n\\lim_{k\\to\\infty}\\left\\lVert\\Lambda_k(\\rho^{\\otimes k})-\\sigma^{\\otimes\\lfloor rk\\rfloor}\\right\\rVert_1=0.\n\\label{eq:ser2-statement-1}\n\\end{equation}\n\nDetermine $R_{\\mathrm{LO}}(\\rho\\to\\sigma):=\\sup\\{r\\geq0:r\\text{ is achievable}\\}$, with achievability defined by Eq.~\\eqref{eq:ser2-statement-1}.","source":"This rate-evaluation question is formulated from Ferrari et al., Theorem 23 and Section IX. Their converse permits all classicality-preserving channels, whereas the question fixes passive optical protocols \\sourcecite{ref:ser2-1}{FLTP23}.","progress":["Let $\\mathcal C$ be the trace-norm closed convex hull of coherent states. Define $N_r(\\omega):=\\inf_{\\tau\\in\\mathcal C}D(\\omega\\Vert\\tau)$, and $N_r^{\\mathrm M}(\\omega):=\\inf_{\\tau\\in\\mathcal C}\\sup_M D(M(\\omega)\\Vert M(\\tau))$. Here $D$ is relative entropy with base-two logarithms and $M$ ranges over measurements. When the ratio is well defined,\n\n\\begin{equation}\nR_{\\mathrm{LO}}(\\rho\\to\\sigma)\\leq\\frac{N_r(\\rho)}{N_r^{\\mathrm M}(\\sigma)}.\n\\label{eq:ser2-progress-1-1}\n\\end{equation}\n\nTheorem 23 proves Eq.~\\eqref{eq:ser2-progress-1-1} for the larger class of classicality-preserving channels, and therefore applies to the specified linear-optical protocols. \\sourcecite{ref:ser2-1}{FLTP23}","Nonzero achievable rates are known: for the Fock state $|j\\rangle$ with $j$ photons and $\\omega_{j,p}:=p|j\\rangle\\langle j|+(1-p)|0\\rangle\\langle0|$, where $j\\geq2$ and $0<p\\leq1$,\n\n\\begin{equation}\np\\leq R_{\\mathrm{LO}}(\\omega_{j,p}\\to|j-1\\rangle\\langle j-1|)\n\\leq\\frac{p\\log_2(j!e^j/j^j)}{\\log_2((j-1)!e^{j-1}/(j-1)^{j-1})},\n\\label{eq:ser2-progress-2-1}\n\\end{equation}\n\nProposition 47 gives Eq.~\\eqref{eq:ser2-progress-2-1}. Its upper bound tends to $p$ as $j\\to\\infty$. \\sourcecite{ref:ser2-1}{FLTP23}"],"references":[{"key":"FLTP23","label":"ref:ser2-1","tex":"G. Ferrari, L. Lami, T. Theurer, and M. B. Plenio, \"Asymptotic State Transformations of Continuous Variable Resources,\" \\emph{Communications in Mathematical Physics} \\textbf{398}, 291--351 (2023). \\href{https://doi.org/10.1007/s00220-022-04523-6}{doi:10.1007/s00220-022-04523-6}; \\href{https://arxiv.org/abs/2010.00044}{arXiv:2010.00044}."}],"comment":"Known achievable and converse bounds do not determine the rate for arbitrary state pairs. Classicality-preserving channels and passive optical protocols need not have the same optimal rates."}}
---
## Source

This rate-evaluation question is formulated from Ferrari et al., Theorem 23 and Section IX. Their converse permits all classicality-preserving channels, whereas the question fixes passive optical protocols [FLTP23](https://doi.org/10.1007/s00220-022-04523-6).

## Progress

Let $\mathcal C$ be the trace-norm closed convex hull of coherent states. Define $N_r(\omega):=\inf_{\tau\in\mathcal C}D(\omega\Vert\tau)$, and $N_r^{\mathrm M}(\omega):=\inf_{\tau\in\mathcal C}\sup_M D(M(\omega)\Vert M(\tau))$. Here $D$ is relative entropy with base-two logarithms and $M$ ranges over measurements. When the ratio is well defined,

$$
R_{\mathrm{LO}}(\rho\to\sigma)\leq\frac{N_r(\rho)}{N_r^{\mathrm M}(\sigma)}.
\tag{2}
$$

Theorem 23 proves Eq. (2) for the larger class of classicality-preserving channels, and therefore applies to the specified linear-optical protocols. [FLTP23](https://doi.org/10.1007/s00220-022-04523-6)

Nonzero achievable rates are known: for the Fock state $|j\rangle$ with $j$ photons and $\omega_{j,p}:=p|j\rangle\langle j|+(1-p)|0\rangle\langle0|$, where $j\geq2$ and $0<p\leq1$,

$$
p\leq R_{\mathrm{LO}}(\omega_{j,p}\to|j-1\rangle\langle j-1|)
\leq\frac{p\log_2(j!e^j/j^j)}{\log_2((j-1)!e^{j-1}/(j-1)^{j-1})},
\tag{3}
$$

Proposition 47 gives Eq. (3). Its upper bound tends to $p$ as $j\to\infty$. [FLTP23](https://doi.org/10.1007/s00220-022-04523-6)

## Comment

Known achievable and converse bounds do not determine the rate for arbitrary state pairs. Classicality-preserving channels and passive optical protocols need not have the same optimal rates.

## References

**FLTP23** G. Ferrari, L. Lami, T. Theurer, and M. B. Plenio, "Asymptotic State Transformations of Continuous Variable Resources," *Communications in Mathematical Physics* **398**, 291–351 (2023). [doi:10.1007/s00220-022-04523-6](https://doi.org/10.1007/s00220-022-04523-6); [arXiv:2010.00044](https://arxiv.org/abs/2010.00044).
