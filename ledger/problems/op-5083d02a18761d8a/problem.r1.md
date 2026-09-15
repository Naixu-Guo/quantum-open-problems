---
id: "01M26KND34MGPWHNQXK7W9DXVK"
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
topicIds: ["quantum-circuit-complexity","hamiltonian-simulation"]
keywords: []
difficulty: "unrated"
verificationCost: "unrated"
relatedProblemIds: ["01M26KND4S48V6YX37ZM0DZ3D9"]
title: "Universality of arbitrary self-adjoint polynomial Hamiltonians"
aliases: ["op-5083d02a18761d8a","op_5083d02a18761d8a","01M26KND34MGPWHNQXK7W9DXVK"]
authoredCatalog: {"status":"Solved","sourcePath":"database/problems_json/op_5083d02a18761d8a.json","record":{"schema":"qiqcop-zoo/record/3","id":"op_5083d02a18761d8a","ulid":"01M26KND34MGPWHNQXK7W9DXVK","aliases":["op_5083d02a18761d8a","01M26KND34MGPWHNQXK7W9DXVK","op-5083d02a18761d8a"],"metadata":{"type":"Problem","schemaVersion":"1.0","revision":1,"createdBy":"01M1Q787QRVXGPCXG6KEQTF7N1","createdAt":"2026-09-10T21:30:29.860Z","role":"primary","parentProblemId":null,"parentClauseId":null,"origin":"derived","posed":null,"areaIds":["quantum-algorithm"],"topicIds":["quantum-circuit-complexity","hamiltonian-simulation"],"keywords":[],"difficulty":"unrated","verificationCost":"unrated","relatedProblemIds":["01M26KND4S48V6YX37ZM0DZ3D9"]},"title":"Universality of arbitrary self-adjoint polynomial Hamiltonians","status":"Solved","fields":["Quantum algorithm"],"topics":["Quantum circuit complexity","Hamiltonian simulation"],"statement":"Can every physical bosonic unitary be approximated by a single self-adjoint polynomial Hamiltonian evolution at any finite input energy?\nFix $n\\geq1$ and a unitary $U$ on $L^2(\\mathbb R^n)$ with $U\\mathcal S(\\mathbb R^n)\\subseteq\\mathcal S(\\mathbb R^n)$.\nHere $\\mathcal S$ is the Schwartz space of smooth, rapidly decreasing functions.\nThe canonical operators obey $[q_j,p_k]=i\\delta_{jk}$.\nDefine the total photon number and the energy-constrained channel distance by\n\\begin{equation}\n \\begin{aligned}\n N&=\\frac12\\sum_{j=1}^n(q_j^2+p_j^2-1),\\\\\n \\|\\mathcal U-\\mathcal V\\|_{\\diamond,E}\n &=\\sup_{\\rho_{AR}:\\operatorname{Tr}(\\rho_A N)\\leq E}\n \\|[(\\mathcal U-\\mathcal V)\\otimes\\operatorname{id}_R](\\rho_{AR})\\|_1 .\n \\end{aligned}\n \\label{eq:poly-universal-distance}\n\\end{equation}\nIn Eq.~\\eqref{eq:poly-universal-distance}, $\\mathcal U(\\rho)=U\\rho U^\\dagger$ and $R$ is any auxiliary reference system.\nFor every finite $E\\geq0$ and $\\varepsilon>0$, does there exist a real Weyl-ordered polynomial $P(q_1,p_1,\\ldots,q_n,p_n)$ with a self-adjoint realization such that\n\\begin{equation}\n \\|\\mathcal U-\\mathcal V_P\\|_{\\diamond,E}<\\varepsilon,\n \\qquad\n \\mathcal V_P(\\rho)=e^{-iP}\\rho e^{iP}?\n \\label{eq:poly-universal-target}\n\\end{equation}\nThe polynomial and its degree in Eq.~\\eqref{eq:poly-universal-target} may depend on $U,E,\\varepsilon$.","source":"Arzani, Booth, and Chabaud establish polynomial universality in Theorems~1--3, with the finite-mode finite-block construction in arXiv Appendix~B \\sourcecite{ref:poly-universal-abc}{ABC25}.\nThe self-adjoint realization required here is supplied by the explicit completion below.\nThat completion is an editorial deduction, not a claim that the paper proves self-adjointness of its unmodified polynomial.","progress":["Theorem~2 constructs a symmetric polynomial realizing any Hermitian matrix on a finite Fock block.\nThe block is invariant.\nTheorems~1 and 3 combine finite-dimensional unitary approximation with this construction \\sourcecite{ref:poly-universal-abc}{ABC25}.","To complete the domain argument, let $B$ be a symmetric polynomial of degree $d$ realizing a chosen finite block.\nLet $K$ bound the total photon numbers in that block.\nOn the finite Fock span,\n$\\|B\\psi\\|\\leq C\\|(N+1)^{d/2}\\psi\\|$.\nChoose an integer $r$ with $2r(K+1)>d/2$ and set\n\\begin{equation}\n Q(N)=\\left[\\prod_{j=0}^{K}(N-j)\\right]^{2r},\n \\qquad P=B+Q(N).\n \\label{eq:poly-universal-completion}\n\\end{equation}\nThe operator $Q(N)$ in Eq.~\\eqref{eq:poly-universal-completion} is self-adjoint on its spectral domain.\nIt vanishes on the chosen block and dominates $(N+1)^{d/2}$ at large photon number.\nThus $B$ has relative bound zero with respect to $Q(N)$.\nThe Kato--Rellich theorem gives a self-adjoint closure of $P$ with the same finite block \\sourcecite{ref:poly-universal-teschl}{Tes09}.","For a cutoff at total photon number $L$, the discarded input probability is at most $E/(L+1)$.\nThis bound also holds with a reference system.\nFinite-dimensional approximation of the images of the retained basis vectors gives an approximating unitary on a larger finite Fock block.\nThe completion in Eq.~\\eqref{eq:poly-universal-completion} realizes that block exactly.\nTaking $L$ and then the output block large enough proves Eq.~\\eqref{eq:poly-universal-target} for every finite number of modes."],"references":[{"key":"ABC25","label":"ref:poly-universal-abc","tex":"F. Arzani, R. I. Booth, and U. Chabaud, \"Effective Descriptions of Bosonic Systems Can Be Considered Complete,\" \\emph{Nature Communications} \\textbf{16}, 9744 (2025). \\href{https://doi.org/10.1038/s41467-025-64872-3}{doi:10.1038/s41467-025-64872-3}; \\href{https://arxiv.org/abs/2501.13857}{arXiv:2501.13857}."},{"key":"Tes09","label":"ref:poly-universal-teschl","tex":"G. Teschl, \\emph{Mathematical Methods in Quantum Mechanics: With Applications to Schr\\\"odinger Operators}, Graduate Studies in Mathematics \\textbf{99}, American Mathematical Society (2009), Theorem~6.4, p.~135. \\href{https://www.mat.univie.ac.at/~gerald/ftp/book-schroe/schroe.pdf}{Author-hosted full text}."}],"comment":"The finite-block universality and approximation results are peer-reviewed.\nThe self-adjoint completion above applies the standard Kato--Rellich theorem to remove the complement-domain issue.\nIt can increase the polynomial degree, so no degree-$3d$ claim is made for the completed Hamiltonian.\nThis result permits a different polynomial for each target and accuracy.\nIt does not prove universality of an arbitrary fixed non-Gaussian generator with Gaussian controls."}}
---
## Source

Arzani, Booth, and Chabaud establish polynomial universality in Theorems 1–3, with the finite-mode finite-block construction in arXiv Appendix B [ABC25](https://doi.org/10.1038/s41467-025-64872-3). The self-adjoint realization required here is supplied by the explicit completion below. That completion is an editorial deduction, not a claim that the paper proves self-adjointness of its unmodified polynomial.

## Progress

Theorem 2 constructs a symmetric polynomial realizing any Hermitian matrix on a finite Fock block. The block is invariant. Theorems 1 and 3 combine finite-dimensional unitary approximation with this construction [ABC25](https://doi.org/10.1038/s41467-025-64872-3).

To complete the domain argument, let $B$ be a symmetric polynomial of degree $d$ realizing a chosen finite block. Let $K$ bound the total photon numbers in that block. On the finite Fock span, $\|B\psi\|\leq C\|(N+1)^{d/2}\psi\|$. Choose an integer $r$ with $2r(K+1)>d/2$ and set

$$
Q(N)=\left[\prod_{j=0}^{K}(N-j)\right]^{2r},
 \qquad P=B+Q(N).
\tag{3}
$$

The operator $Q(N)$ in Eq. (3) is self-adjoint on its spectral domain. It vanishes on the chosen block and dominates $(N+1)^{d/2}$ at large photon number. Thus $B$ has relative bound zero with respect to $Q(N)$. The Kato–Rellich theorem gives a self-adjoint closure of $P$ with the same finite block [Tes09](https://www.mat.univie.ac.at/~gerald/ftp/book-schroe/schroe.pdf).

For a cutoff at total photon number $L$, the discarded input probability is at most $E/(L+1)$. This bound also holds with a reference system. Finite-dimensional approximation of the images of the retained basis vectors gives an approximating unitary on a larger finite Fock block. The completion in Eq. (3) realizes that block exactly. Taking $L$ and then the output block large enough proves Eq. (2) for every finite number of modes.

## Comment

The finite-block universality and approximation results are peer-reviewed. The self-adjoint completion above applies the standard Kato–Rellich theorem to remove the complement-domain issue. It can increase the polynomial degree, so no degree-$3d$ claim is made for the completed Hamiltonian. This result permits a different polynomial for each target and accuracy. It does not prove universality of an arbitrary fixed non-Gaussian generator with Gaussian controls.

## References

**ABC25** F. Arzani, R. I. Booth, and U. Chabaud, "Effective Descriptions of Bosonic Systems Can Be Considered Complete," *Nature Communications* **16**, 9744 (2025). [doi:10.1038/s41467-025-64872-3](https://doi.org/10.1038/s41467-025-64872-3); [arXiv:2501.13857](https://arxiv.org/abs/2501.13857).

**Tes09** G. Teschl, *Mathematical Methods in Quantum Mechanics: With Applications to Schrödinger Operators*, Graduate Studies in Mathematics **99**, American Mathematical Society (2009), Theorem 6.4, p. 135. [Author-hosted full text](https://www.mat.univie.ac.at/~gerald/ftp/book-schroe/schroe.pdf).
