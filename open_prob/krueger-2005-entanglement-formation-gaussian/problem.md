# Entanglement of Formation for Gaussian States

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of bipartite modes (Alice/Bob), here infinite-dimensional bosonic |
| $\rho_{AB}$ | A bipartite quantum state (density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$) |
| Gaussian state | A bosonic state whose Wigner function is a Gaussian; equivalently a state characterised entirely by its first and second canonical moments |
| Squeezed Gaussian state | A pure Gaussian state obtained from the vacuum by a Gaussian unitary (displacements and symplectic transformations); in single-mode language, a squeezed vacuum |
| $\vert\psi_i\rangle$ | Pure states in a convex decomposition of $\rho_{AB}$ |
| $p_i$ | Probabilities in the convex decomposition, with $\sum_i p_i = 1$ |
| $S(\sigma)$ | Von Neumann entropy of a quantum state $\sigma$, $S(\sigma)=-\mathrm{tr}(\sigma\log\sigma)$ |
| $S(\mathrm{tr}_B\vert\psi\rangle\langle\psi\vert)$ | Entropy of entanglement of a pure bipartite state $\vert\psi\rangle$ |
| $E_F(\rho_{AB})$ | Entanglement of formation of $\rho_{AB}$, defined as the convex-roof extension of the entropy of entanglement |
| $E_F^G(\rho_{AB})$ | Gaussian entanglement of formation: same convex-roof construction but restricted to decompositions into pure *Gaussian* states |
| Two-mode Gaussian state | A Gaussian state on $\mathcal{H}_A\otimes\mathcal{H}_B$ with one mode on each side |
| Mode-symmetric | A two-mode Gaussian state invariant under swap of the two modes (equivalently, with identical local marginals) |

## Background

The entanglement of formation $E_F$ of a bipartite quantum state $\rho_{AB}$ is defined as the *convex roof* of the entropy of entanglement,
$$E_F(\rho_{AB}) \;=\; \inf\Bigl\{\,\sum_i p_i\,S\bigl(\mathrm{tr}_B\,|\psi_i\rangle\langle\psi_i|\bigr)\;\Big|\;\rho_{AB}=\sum_i p_i\,|\psi_i\rangle\langle\psi_i|,\;p_i\ge 0,\;\sum_i p_i=1\,\Bigr\},$$
the infimum being taken over all convex decompositions of $\rho_{AB}$ into pure states. It quantifies the minimum entanglement needed, on average, to prepare $\rho_{AB}$ from pure entangled states.

For *Gaussian* states — the bosonic states most relevant to continuous-variable quantum optics, fully characterised by their first and second moments — a natural and dramatically simpler ansatz is to optimise only over decompositions into pure *Gaussian* states, all of which can be taken to be displacements of the same pure squeezed Gaussian "seed" state weighted by a Gaussian distribution. This restricted infimum defines the *Gaussian entanglement of formation* $E_F^G(\rho_{AB})$ (Wolf, Giedke, Krüger, Werner, Cirac 2004). By construction $E_F^G(\rho_{AB}) \ge E_F(\rho_{AB})$, with equality precisely when an optimal decomposition can be chosen Gaussian. Computing $E_F^G$ reduces to a finite-dimensional convex optimisation over covariance matrices and admits closed-form solutions in several important regimes; computing $E_F$ in general requires an optimisation over arbitrarily complicated, possibly non-Gaussian, mixtures.

The status of the open problem is therefore: for the natural Gaussian class, is the convex-roof optimisation "Gaussianisable"? In other words, does the Gaussian ansatz lose nothing? An affirmative answer would give a fully closed expression for $E_F$ on the entire Gaussian class — a major simplification.

## Formal statement

Let $\rho_{AB}$ be an arbitrary (mixed) bipartite Gaussian state on $\mathcal{H}_A\otimes\mathcal{H}_B$.

**Question.** Is the infimum defining $E_F(\rho_{AB})$ always attained by a decomposition of $\rho_{AB}$ into pure states which are all translates (by Gaussian-weighted displacements) of a *single* pure squeezed Gaussian state? Equivalently, does
$$E_F(\rho_{AB}) \;=\; E_F^G(\rho_{AB})$$
hold for *every* bipartite Gaussian state $\rho_{AB}$?

Show or disprove this statement.

## Status and known progress

The problem is **partially solved**. A preprint posted on 3 August 2026 closes the two-mode case, but the source asks about all bipartite Gaussian states, including generic multimode states.

- Wolf, Giedke, Krüger, Werner and Cirac, *Gaussian Entanglement of Formation*, Phys. Rev. A **69**, 052320 (2004); arXiv:quant-ph/0306177 (2003), introduced $E_F^G$ and computed it as a closed-form convex programme on the covariance matrix.
- Giedke, Wolf, Krüger, Werner and Cirac, *Entanglement of formation for symmetric Gaussian states*, Phys. Rev. Lett. **91**, 107901 (2003); arXiv:quant-ph/0304042, proved $E_F(\rho_{AB})=E_F^G(\rho_{AB})$ for two-mode Gaussian states that are *symmetric* under interchange of the two modes. For this class, this gives the first fully closed-form expression for the entanglement of formation of any non-trivial mixed Gaussian state.
- Subsequent work extended closed-form computation of $E_F^G$ to multimode Gaussian states (Adesso, Illuminati 2007; Adesso 2007) but the general identity $E_F = E_F^G$ remains conjectural beyond the symmetric two-mode class.
- Akbari-Kourbolagh and Akhound (2015) and others have extended the proof to certain wider classes of two-mode Gaussian states (e.g. some asymmetric mixed two-mode Gaussian states with restricted spectral structure).
- **Major recent result (Adesso, 3 August 2026).** The preprint *Optimality of Gaussian Entanglement of Formation* proves $E_F=E_F^G$ for every two-mode Gaussian state and extends the result to bisymmetric multimode Gaussian states. This removes the earlier asymmetric two-mode gap.
- **Remaining scope.** The same preprint explicitly leaves generic nonsymmetric multimode Gaussian states open. It was an unrefereed first version nine days old on the verification date. It therefore upgrades the partial result but does not solve the all-Gaussian-states statement in the source.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. Problem 29, pp. 72–73 (contact: O. Krüger, 21 Apr 2005). DOI: 10.48550/arXiv.quant-ph/0504166. Source PDF: "Some Open Problems in Quantum Information Theory.pdf".
- M. M. Wolf, G. Giedke, O. Krüger, R. F. Werner, J. I. Cirac, *Gaussian Entanglement of Formation*, Phys. Rev. A **69**, 052320 (2004); arXiv:quant-ph/0306177 (2003).
- G. Giedke, M. M. Wolf, O. Krüger, R. F. Werner, J. I. Cirac, *Entanglement of formation for symmetric Gaussian states*, Phys. Rev. Lett. **91**, 107901 (2003); arXiv:quant-ph/0304042 (2003).
- G. Adesso and F. Illuminati, *Entanglement in continuous-variable systems: recent advances and current perspectives*, J. Phys. A **40**, 7821 (2007); arXiv:quant-ph/0701221.
- C. H. Bennett, D. P. DiVincenzo, J. A. Smolin, W. K. Wootters, *Mixed-state entanglement and quantum error correction*, Phys. Rev. A **54**, 3824 (1996); arXiv:quant-ph/9604024 (original definition of entanglement of formation).
- G. Adesso, *Optimality of Gaussian Entanglement of Formation*, arXiv:2608.01909 (2026), v1 dated 3 August 2026.
