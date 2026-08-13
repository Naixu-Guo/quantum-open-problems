# Undistillability implies PPT?

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | A density operator on a bipartite Hilbert space $\mathcal{H}_A \otimes \mathcal{H}_B$ |
| $\rho^{T_A}$ | Partial transpose of $\rho$ over Alice's subsystem, defined in a product basis by $\langle ij\vert\rho^{T_A}\vert kl\rangle = \langle kj\vert\rho\vert il\rangle$ |
| PPT | $\rho$ has positive partial transpose, i.e., $\rho^{T_A} \ge 0$ |
| NPT | $\rho$ has non-positive partial transpose, i.e., $\rho^{T_A}$ has at least one negative eigenvalue |
| $\rho^{\otimes n}$ | $n$-fold tensor power of $\rho$ |
| $P, Q$ | Two-dimensional projectors acting on $\mathcal{H}_A^{\otimes n}$ and $\mathcal{H}_B^{\otimes n}$, respectively |
| LOCC | Local operations and classical communication |
| $S$ | A completely positive map |
| $T$ | The transposition map |
| $\mathrm{id}_2$ | Identity map on $2\times 2$ matrices |
| $TS$ | Composition of transposition with $S$ |
| $n$-distillable | $\rho^{\otimes n}$ can be locally projected onto an entangled two-qubit subspace |
| distillable | $n$-distillable for some $n \ge 1$ |
| Werner state | Bipartite state invariant under $U \otimes U$ for all unitaries $U$ |

## Background

A bipartite quantum state $\rho$ is *distillable* if from many independent copies one can extract, by local operations and classical communication, an arbitrarily good approximation of a maximally entangled two-qubit (singlet) state. This is the central operational notion of useful bipartite entanglement: only distillable states can serve as a resource for protocols such as teleportation with high fidelity. The Horodecki family showed in the late 1990s that PPT states cannot be distilled (entanglement of such states is "bound"). The converse — whether every NPT (non-PPT) state is distillable — is an enduring open problem in quantum information theory.

There is a useful operational reformulation: $\rho$ is distillable if and only if for some $n$ there exist rank-2 local projections $P$ and $Q$ such that $(P \otimes Q)\rho^{\otimes n}(P \otimes Q)$ has non-positive partial transpose; equivalently, the state can be projected onto an entangled two-qubit subspace. A state is called $n$-distillable if this holds with that particular $n$. Numerical and analytical evidence going back to DiVincenzo, Shor, Smolin, Terhal, Thapliyal and to Dür, Cirac, Lewenstein, Bruß strongly suggests that there are NPT Werner states which are $n$-undistillable for all $n$, hence undistillable but NPT; if so, the converse would fail and there would exist NPT bound entanglement. As yet, however, no NPT state has been rigorously proven to be undistillable. Because every NPT state can be mapped by LOCC to a Werner state with the same distillability properties, the question reduces to the one-parameter family of Werner states.

## Formal statement

Decide the following implication for bipartite density operators on a finite-dimensional Hilbert space:

$$\text{$\rho$ undistillable} \;\Longrightarrow\; \text{$\rho$ is PPT.}$$

Equivalently, decide whether there exists a bipartite state $\rho$ such that $\rho^{T_A}$ has a negative eigenvalue but $\rho$ is not distillable, i.e., there exist no integer $n$ and rank-2 projectors $P$ on $\mathcal{H}_A^{\otimes n}$ and $Q$ on $\mathcal{H}_B^{\otimes n}$ for which

$$\bigl((P \otimes Q)\,\rho^{\otimes n}\,(P \otimes Q)\bigr)^{T_A}$$

has a negative eigenvalue.

An equivalent operator-theoretic reformulation (Horodecki; restated in DiVincenzo–Shor–Smolin–Terhal–Thapliyal): given a completely positive map $S$ such that $TS$ is 2-positive (equivalently, $\mathrm{id}_2 \otimes TS$ is positive), decide whether $TS \otimes TS$ is necessarily 2-positive.

## Status and known progress

**Status: open.** The general finite-dimensional bipartite implication remains undecided. Substantial restricted results are known:

- For states on $2 \times m$ Hilbert spaces and for Gaussian states, every NPT state is distillable [DCLB; quant-ph/9910022], [GDCZ; quant-ph/0104072]: the converse holds in these restricted classes.
- Horodecki and Horodecki [HH; quant-ph/9708015] reduced the general problem to the one-parameter family of Werner states by an LOCC-mapping argument.
- DiVincenzo–Shor–Smolin–Terhal–Thapliyal [DSST; quant-ph/9910026] and Dür–Cirac–Lewenstein–Bruß [DCLB] gave numerical evidence for the existence of undistillable NPT Werner states. [DSST] analytically proved that for every fixed $n$ there is an interval of $n$-undistillable entangled Werner states, although this interval shrinks to a point as $n \to \infty$, leaving open whether the intersection is nonempty.
- Eggeling–Vollbrecht–Werner–Wolf [EVWW; quant-ph/0104095] proved that if LOCC is replaced by PPT-preserving operations, then every NPT state becomes 1-distillable.
- Vollbrecht–Wolf [VW; quant-ph/0201103] showed that an infinitesimally small amount of bound entanglement can activate the distillation of any NPT state (additional PPT entangled "catalyst" states).
- Kraus–Lewenstein–Cirac [KLC; quant-ph/0110174] developed an entanglement-witness formalism connecting distillability and activation, and demonstrated three-partite NPT states for which two copies can neither be distilled nor activated.
- Four concurrent July 2026 preprints, arXiv:2607.21367, 2607.23416, 2607.24309, and 2607.24479, prove the exact two-copy threshold for every Werner state. This is a major finite-copy result, but it neither proves undistillability for all tensor powers nor constructs NPT bound entanglement.
- Wu and Zou's arXiv:2608.02647v1 treats restricted rank-two sectors at the first unresolved three-copy Werner endpoint. Lei, Song, Chen and Liu's arXiv:2608.03710v1 proves one-copy undistillability in a special rank-five two-qutrit family and gives a two-copy obstruction and numerics. These August 2026 preprints do not settle the universal or all-copy question.
- Tabia, Chen and Hsieh, arXiv:2608.08836v1, prove two-copy distillability for selected one-copy-undistillable NPT states in every local dimension $d\ge3$. This rules out proposed candidates rather than establishing an NPT bound-entangled state.

Despite extensive numerical and analytical work, no proof or counterexample to the all-copy question has been produced.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 2, pp. 15–17.
- J. I. Cirac, W. Dür, B. Kraus, and M. Lewenstein, *Entangling Operations and Their Implementation Using a Small Amount of Entanglement*, Phys. Rev. Lett. **86**, 544 (2001); arXiv:quant-ph/0007057.
- W. Dür, J. I. Cirac, M. Lewenstein, and D. Bruß, *Distillability and transposition in bipartite systems*, Phys. Rev. A **61**, 062313 (2000); arXiv:quant-ph/9910022.
- D. P. DiVincenzo, P. W. Shor, J. A. Smolin, B. M. Terhal, and A. V. Thapliyal, *Evidence for bound entangled states with negative partial transpose*, Phys. Rev. A **61**, 062312 (2000); arXiv:quant-ph/9910026.
- T. Eggeling, K. G. H. Vollbrecht, R. F. Werner, and M. M. Wolf, *Distillability via Protocols Respecting the Positivity of Partial Transpose*, Phys. Rev. Lett. **87**, 257902 (2001); arXiv:quant-ph/0104095.
- G. Giedke, L.-M. Duan, J. I. Cirac, and P. Zoller, *Distillability criterion for all bipartite Gaussian states*, Quant. Inf. Comp. **1**(3), 79 (2001); arXiv:quant-ph/0104072.
- M. Horodecki and P. Horodecki, *Reduction criterion of separability and limits for a class of protocols of entanglement distillation*, Phys. Rev. A **59**, 4206–4216 (1999); arXiv:quant-ph/9708015.
- M. Horodecki, P. Horodecki, and R. Horodecki, *Mixed-State Entanglement and Distillation: Is there a 'Bound' Entanglement in Nature?*, Phys. Rev. Lett. **80**, 5239–5242 (1998); arXiv:quant-ph/9801069.
- M. Horodecki, P. Horodecki, and R. Horodecki, *Inseparable Two Spin-1/2 Density Matrices Can Be Distilled to a Singlet Form*, Phys. Rev. Lett. **78**, 574 (1997).
- B. Kraus, M. Lewenstein, and J. I. Cirac, *Characterization of distillable and activatable states using entanglement witnesses*, Phys. Rev. A **65**, 042327 (2002); arXiv:quant-ph/0110174.
- K. G. H. Vollbrecht and M. M. Wolf, *Activating Distillation with an Infinitesimal Amount of Bound Entanglement*, Phys. Rev. Lett. **88**, 247901 (2002); arXiv:quant-ph/0201103.
- J. Fu, L. Gao, S.-J. Park, *A solution to 2-copy distillability of Werner states*, arXiv:2607.21367 (2026).
- Z. Song, L. Chen, *A partial-trace matrix inequality and Werner-state distillability*, arXiv:2607.23416 (2026).
- T. C. Fraser, F. Huber, B. Pozsgay, I. Vona, *On the two-copy distillability of Werner states and a new partial trace inequality*, arXiv:2607.24309 (2026).
- K. Bharti, S. Gajjala, T. Haug, *Two-copy nondistillability of Werner states: sharp partial-trace inequalities and finite-copy extensions*, arXiv:2607.24479 (2026).
- T. Wu, Q. Zou, *Sharp Plucker Geometry for Three-Copy Werner Distillation*, arXiv:2608.02647 (2026).
- Y. Lei, Z. Song, L. Chen, M. Liu, *Entanglement Distillation of some Rank-Five Symmetric NPT States in Two-Qutrit Systems*, arXiv:2608.03710 (2026).
- G. N. M. Tabia, K.-S. Chen, M.-H. Hsieh, *Two-copy distillability of one-copy-undistillable negative-partial-transpose states in every dimension*, arXiv:2608.08836 (2026).
