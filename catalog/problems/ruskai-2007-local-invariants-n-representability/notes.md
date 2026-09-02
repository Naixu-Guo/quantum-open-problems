# Minimal complete set of local invariants for an (anti-)symmetric 2-particle reduced density matrix

## Background

In the 1960s, after Coulson and Coleman, a major effort was directed at the *$N$-representability* problem: characterise when a candidate $p$-particle density matrix $\sigma$ arises as the reduced density matrix $\rho_{1,2,\dots,p}=\operatorname{Tr}_{p+1,\dots,N}\rho$ of some $N$-particle quantum state $\rho$ on the antisymmetric (fermionic) or symmetric (bosonic) sector of $\mathcal{H}^{\otimes N}$. The *pure* $N$-representability problem is the same question with $\rho=|\Psi\rangle\langle\Psi|$.

For the 1-matrix, Coleman (1958) solved the mixed-state $N$-representability problem completely: necessary and sufficient conditions are that the eigenvalues of $\rho_1$ all lie in $[0,1/N]$ when $\operatorname{Tr}\rho_1=1$ (fermionic case). Only a handful of special results were obtained for $p\ge 2$ before two breakthroughs in 2005-2007:
- A. Klyachko (*J. Phys.: Conf. Ser.* 36 (2006), 72-86; quant-ph/0511102) solved the *pure-state* 1-representability problem by determining all linear inequalities on the spectra of the single-particle reduced density matrices.
- Y.-K. Liu, M. Christandl and F. Verstraete ("$N$-representability is QMA-complete", *Phys. Rev. Lett.* 98 (2007), 110503; arXiv:quant-ph/0609125) showed that in general the $N$-representability problem for the 2-matrix is QMA-complete, ruling out an efficient classical characterisation under plausible complexity-theoretic assumptions.

Coleman pointed out that any $N$-representability condition must be invariant under changes of single-particle basis, i.e. under $\rho_{1,2,\dots,p}\mapsto U^{\otimes p}\,\rho_{1,2,\dots,p}\,(U^{\otimes p})^\dagger$ for $U$ unitary on $\mathcal{H}$. Such functions are called *local invariants* (or *unitary invariants*, where "unitary" refers to the single-particle unitary acting diagonally). For $p=1$ the local invariants are precisely the eigenvalues of $\rho_1$, and the spectral characterisation above is expressed in their terms. For $p=2$ the eigenvalues of $\rho_{12}$ are local invariants, but they do not suffice: extra invariants are needed to detect, for example, the relation between the eigenbases of $\rho_{12}$ and of $\rho_1=\operatorname{Tr}_2\rho_{12}$.

Surprisingly, no minimal complete set of local invariants for $\rho_{12}$ — i.e., a finite set of $U^{\otimes 2}$-invariants that *together* determine the $U^{\otimes 2}$-orbit of $\rho_{12}$ and so could serve as the natural arguments of $N$-representability conditions — is known.

## Status and known progress

- Coleman's 1958 paper solved the 1-matrix mixed-state $N$-representability problem completely.
- Klyachko (quant-ph/0511102) solved the *pure-state* 1-representability problem by giving the polytope of admissible spectra.
- **Liu, Christandl, Verstraete (2007, arXiv:quant-ph/0609125; *Phys. Rev. Lett.* 98, 110503) showed that the 2-matrix $N$-representability problem is QMA-complete in general.** This is a strong complexity-theoretic obstruction: any complete set of "tractable" local invariants would have to either be exponentially large or be intractable to evaluate, unless QMA $\subseteq$ P. The problem of finding a *minimal* complete set therefore acquires a strong negative shadow.
- Klyachko, Altunbulak and others (e.g. M. Altunbulak, A. Klyachko, "The Pauli principle revisited", *Commun. Math. Phys.* 282 (2008), 287-322; arXiv:0802.0918) have extended Klyachko's polytope methods to higher particle numbers in restricted spectral form, but these do not yield a minimal complete set of invariants for the 2-matrix itself.
- Vrana (2011) constructed graph-indexed families of local-unitary invariants for fermionic and distinguishable-particle systems. A follow-up describes the stable invariant algebra for identical particles as a free algebra with an algebraically independent graph-indexed generating set.
- **Status: partially solved.** Those works provide systematic complete invariant families and a minimal stable generating set. They do not give the finite-dimensional minimal complete set requested for a mixed two-particle density matrix, nor express the full $N$-representability constraints in those invariants. The QMA-completeness result also makes an efficient general criterion unlikely.
- **Last verified:** 2026-08-12.

## Bibliography

- P. Vrana, *Local unitary invariants for multipartite quantum systems*, J. Phys. A **44**, 115302 (2011); arXiv:1007.0163.
- P. Vrana, *The algebra of local unitary invariants of identical particles*, arXiv:1107.2438 (2011).

- M. B. Ruskai, "Open Problems in Quantum Information Theory" (arXiv:0708.1902 [quant-ph], 2007), based on the BIRS workshop on Operator Structures in QIT, Banff, 11-16 Feb 2007. Problem 24, p. 17 (Section 7). DOI: 10.48550/arXiv.0708.1902. Source PDF: `Open Problems in Quantum Information Theory_Ruskai_2007.pdf`.
- A. J. Coleman, "The structure of fermion density matrices", *Rev. Mod. Phys.* 35 (1963), 668-687.
- A. Klyachko, "Quantum marginal problem and $N$-representability", *J. Phys.: Conf. Ser.* 36 (2006), 72-86; quant-ph/0511102.
- Y.-K. Liu, M. Christandl, F. Verstraete, "$N$-representability is QMA-complete", *Phys. Rev. Lett.* 98 (2007), 110503; arXiv:quant-ph/0609125.
- M. Altunbulak, A. Klyachko, "The Pauli principle revisited", *Commun. Math. Phys.* 282 (2008), 287-322; arXiv:0802.0918.
- C. Schilling, D. Gross, M. Christandl, "Pinning of fermionic occupation numbers", *Phys. Rev. Lett.* 110 (2013), 040404; arXiv:1210.5531.
- D. A. Mazziotti, "Structure of fermionic density matrices: Complete N-representability conditions", *Phys. Rev. Lett.* 108 (2012), 263002.
