---
id: "01M26KND6EV9BBF5SH8FNWCMD0"
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
areaIds: ["quantum-algorithm"]
topicIds: ["hamiltonian-simulation"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: []
title: "Compact-time validity of the rotating wave approximation"
aliases: ["op-65b01b2a5ef77a6e","op_65b01b2a5ef77a6e","01M26KND6EV9BBF5SH8FNWCMD0"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_65b01b2a5ef77a6e.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_65b01b2a5ef77a6e","ulid":"01M26KND6EV9BBF5SH8FNWCMD0","aliases":["op_65b01b2a5ef77a6e","01M26KND6EV9BBF5SH8FNWCMD0","op-65b01b2a5ef77a6e"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.966Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["hamiltonian-simulation"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":[]},"title":"Compact-time validity of the rotating wave approximation","status":"Solved","fields":["Quantum algorithm"],"topics":["Hamiltonian simulation"],"statement":"Does the Jaynes--Cummings evolution approximate the Rabi evolution strongly and uniformly on each compact time interval in the high-frequency limit?\nWork on $\\mathbb C^2\\otimes L^2(\\mathbb R)$.\nLet $a,a^\\dagger$ be oscillator operators with $[a,a^\\dagger]=1$ and $N=a^\\dagger a$.\nWrite $\\sigma_x,\\sigma_y,\\sigma_z$ for the Pauli matrices and $\\sigma_\\pm=(\\sigma_x\\pm i\\sigma_y)/2$.\nFix $\\lambda>0$ and $\\Delta\\in\\mathbb R$.\nFor $\\omega>\\max\\{0,-\\Delta\\}$, define\n\\begin{equation}\n \\begin{aligned}\n H_\\omega&=\\frac{\\omega+\\Delta}{2}\\sigma_z+\\omega N+\n                \\lambda\\sigma_x(a+a^\\dagger),\\\\\n J_\\omega&=\\frac{\\omega+\\Delta}{2}\\sigma_z+\\omega N+\n                \\lambda(\\sigma_+a+\\sigma_-a^\\dagger).\n \\end{aligned}\n \\label{eq:rwa-hamiltonians}\n\\end{equation}\nTensor factors of the identity are implicit.\nUse the self-adjoint closures of Eq.~\\eqref{eq:rwa-hamiltonians} from $\\mathbb C^2\\otimes\\mathcal S(\\mathbb R)$.\nHere $\\mathcal S(\\mathbb R)$ is the Schwartz space.\nIs it true that every normalized $\\psi\\in\\mathbb C^2\\otimes L^2(\\mathbb R)$ and every finite $T>0$ satisfy\n\\begin{equation}\n \\lim_{\\omega\\to\\infty}\\sup_{|t|\\leq T}\n \\|(e^{-itH_\\omega}-e^{-itJ_\\omega})\\psi\\|=0?\n \\label{eq:rwa-convergence}\n\\end{equation}\nThe vector, time horizon, coupling, and detuning in Eq.~\\eqref{eq:rwa-convergence} are fixed as $\\omega$ grows.","source":"This compact-time formulation follows from the rotating-wave question resolved by Burgarth, Facchi, Hillier, and Ligabò, Theorem~2.1 \\sourcecite{ref:rwa-bfhl}{BFHL24}.\nIt makes explicit the uniformity that follows from their time-dependent estimate.","progress":["Theorem~2.1, Eq.~(45), gives for every $\\psi\\in\\mathbb C^2\\otimes\\mathcal S(\\mathbb R)$\n\\begin{equation}\n \\begin{aligned}\n \\|(e^{-itH_\\omega}-e^{-itJ_\\omega})\\psi\\|\n \\leq\\frac{\\lambda}{\\omega}\\bigl[\n &(1+|t||\\Delta|)\\|(N+2)^{1/2}\\psi\\|\\\\\n &+3|t|\\lambda\\|((N+2)(N+3))^{1/2}\\psi\\|\\bigr].\n \\end{aligned}\n \\label{eq:rwa-bound}\n\\end{equation}\nEquation~\\eqref{eq:rwa-bound} tends to zero uniformly for $|t|\\leq T$.\nThe interaction-picture change used in the paper leaves the norm difference unchanged \\sourcecite{ref:rwa-bfhl}{BFHL24}.","For an arbitrary normalized $\\psi$, choose a Schwartz vector $\\phi$ close to it.\nUnitarity bounds the contribution of $\\psi-\\phi$ by $2\\|\\psi-\\phi\\|$, independently of $\\omega$ and $t$.\nApply Eq.~\\eqref{eq:rwa-bound} to $\\phi$ and then let $\\|\\psi-\\phi\\|$ tend to zero.\nThis proves Eq.~\\eqref{eq:rwa-convergence} without an energy assumption on $\\psi$."],"references":[{"key":"BFHL24","label":"ref:rwa-bfhl","tex":"D. Burgarth, P. Facchi, R. Hillier, and M. Ligabò, \"Taming the Rotating Wave Approximation,\" \\emph{Quantum} \\textbf{8}, 1262 (2024). \\href{https://doi.org/10.22331/q-2024-02-21-1262}{doi:10.22331/q-2024-02-21-1262}; \\href{https://arxiv.org/abs/2301.02269}{arXiv:2301.02269}."}],"comment":"The resolving theorem is peer-reviewed.\nThe compact time interval is essential to the stated consequence of Eq.~\\eqref{eq:rwa-bound}.\nIt does not assert an error tending to zero uniformly over all times or all normalized input vectors."}}
---
## Source

This compact-time formulation follows from the rotating-wave question resolved by Burgarth, Facchi, Hillier, and Ligabò, Theorem 2.1 [BFHL24](https://doi.org/10.22331/q-2024-02-21-1262). It makes explicit the uniformity that follows from their time-dependent estimate.

## Progress

Theorem 2.1, Eq. (45), gives for every $\psi\in\mathbb C^2\otimes\mathcal S(\mathbb R)$

$$
\begin{aligned}
 \|(e^{-itH_\omega}-e^{-itJ_\omega})\psi\|
 \leq\frac{\lambda}{\omega}\bigl[
 &(1+|t||\Delta|)\|(N+2)^{1/2}\psi\|\\
 &+3|t|\lambda\|((N+2)(N+3))^{1/2}\psi\|\bigr].
 \end{aligned}
\tag{3}
$$

Equation (3) tends to zero uniformly for $|t|\leq T$. The interaction-picture change used in the paper leaves the norm difference unchanged [BFHL24](https://doi.org/10.22331/q-2024-02-21-1262).

For an arbitrary normalized $\psi$, choose a Schwartz vector $\phi$ close to it. Unitarity bounds the contribution of $\psi-\phi$ by $2\|\psi-\phi\|$, independently of $\omega$ and $t$. Apply Eq. (3) to $\phi$ and then let $\|\psi-\phi\|$ tend to zero. This proves Eq. (2) without an energy assumption on $\psi$.

## Comment

The resolving theorem is peer-reviewed. The compact time interval is essential to the stated consequence of Eq. (3). It does not assert an error tending to zero uniformly over all times or all normalized input vectors.

## References

**BFHL24** D. Burgarth, P. Facchi, R. Hillier, and M. Ligabò, "Taming the Rotating Wave Approximation," *Quantum* **8**, 1262 (2024). [doi:10.22331/q-2024-02-21-1262](https://doi.org/10.22331/q-2024-02-21-1262); [arXiv:2301.02269](https://arxiv.org/abs/2301.02269).
