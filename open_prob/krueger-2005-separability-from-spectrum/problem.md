# Separability from spectrum

> **Audit status (2026-08-12): PARTIALLY SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | Total complex Hilbert space of dimension $NM$ |
| $N, M$ | Dimensions of the two tensor factors in a candidate bipartition |
| $\rho$ | Density matrix (mixed state) on $\mathcal{H}$ |
| $\mathrm{spec}(\rho)$ | Spectrum (multiset of eigenvalues) of $\rho$ |
| $x_1, x_2, x_3, x_4$ | Eigenvalues of a two-qubit state, listed in decreasing order |
| $U$ | Unitary operator on $\mathcal{H}$ |
| $U \rho U^*$ | State unitarily equivalent to $\rho$ |
| $E_F$ | Entanglement of formation |
| $\mathrm{sep}_{N,M}$ | Set of separable states with respect to a fixed $N \otimes M$ factorisation |

## Background

Two density matrices that are unitarily equivalent have the same spectrum, but they may differ radically in their entanglement: a maximally entangled pure state and a fully separable pure state share the same spectrum (a single eigenvalue equal to 1, the rest zero) and are unitarily equivalent. Hence "is $\rho$ entangled?" depends in general on more than just $\mathrm{spec}(\rho)$.

Nevertheless, for sufficiently mixed states the situation simplifies. Życzkowski–Horodecki–Sanpera–Lewenstein, and later Gurvits–Barnum, identified explicit *separable balls* around the maximally mixed state: any state inside such a ball is separable for every bipartition. Such states are *absolutely separable*, meaning $U \rho U^*$ is separable for every unitary $U$. Equivalently, separability is determined solely by the spectrum and the conclusion is "separable".

This raises the following question, distinct from Problem 9 (which concerns the spectra of $\rho$ and its reductions): characterise the spectra $\mathrm{spec}(\rho)$ that *force* separability with respect to a given bipartition, regardless of which density matrix with that spectrum is considered. Such states are sometimes called *separable from spectrum* or *absolutely separable*. The dual question — characterising the spectra that *forbid* entanglement of formation, or that permit/prevent transformation via global unitaries into an entangled state — has the same answer up to unitary orbits.

## Formal statement

Fix integers $N, M \geq 2$ and let $\mathcal{H}$ have dimension $NM$. For a mixed state $\rho$ on $\mathcal{H}$, consider the question: does there exist a factorisation $\mathcal{H} \cong \mathbb{C}^N \otimes \mathbb{C}^M$ with respect to which $\rho$ is not separable? Equivalently, does there exist a unitary $U$ on $\mathcal{H}$ such that $U \rho U^*$ is entangled across a fixed $N \otimes M$ bipartition?

Because this question depends only on $\mathrm{spec}(\rho)$, define
$$\mathcal{S}_{N,M} \;=\; \bigl\{\, \mathrm{spec}(\rho) \,:\, \text{for every unitary } U \text{ on } \mathcal{H},\; U \rho U^* \in \mathrm{sep}_{N,M} \,\bigr\}.$$

**Problem.** Characterise the set $\mathcal{S}_{N,M}$ — i.e. the spectra for which the answer to the question above is "no" (no entangling factorisation exists), so that separability with respect to the fixed $N \otimes M$ bipartition is forced by the spectrum alone.

## Status and known progress

- **Status:** partially solved. Every qubit–qudit case $2\otimes n$ has been completely characterised; the general $N\otimes M$ problem with both local dimensions at least three remains open.
- **Two-qubit case (Verstraete–Audenaert–De Moor, 2001) — solved.** For $N = M = 2$, with eigenvalues $x_1 \geq x_2 \geq x_3 \geq x_4$ listed in decreasing order, Verstraete, Audenaert, De Bie, and De Moor [arXiv:quant-ph/0011110; Phys. Rev. A **64**, 012316 (2001)] proved that exactly the states obeying
  $$x_1 - x_3 - 2\sqrt{x_2 x_4} \;\leq\; 0$$
  cannot be transformed into a state with non-zero entanglement of formation by applying any unitary operator. This inequality fully characterises $\mathcal{S}_{2,2}$.
- **Generic separable-ball bounds.** Życzkowski, Horodecki, Sanpera, and Lewenstein (1998) gave explicit upper bounds on how close (in trace distance) a state must be to the maximally mixed state to be guaranteed separable. Gurvits and Barnum (2002) sharpened these bounds and gave the largest known separable ball around the maximally mixed state in arbitrary finite dimension. Any state inside this ball is in $\mathcal{S}_{N,M}$.
- **All $2\otimes n$ cases (Johnston, 2013).** Johnston characterised absolutely PPT qubit–qudit spectra and proved that absolute PPT and absolute separability coincide for $2\otimes n$, settling this entire local-dimension family.
- **Higher-dimensional cases: open.** For $N,M\geq3$, even the boundary of $\mathcal{S}_{N,M}$ is not known explicitly. A 2024 preprint claiming a $4\otimes n$ criterion proves an absolute-PPT criterion in its theorem but does not prove the needed equivalence between absolute PPT and absolute separability. It is therefore not accepted as a solution. Work through August 2026 continues to distinguish these sets and gives geometric or sufficient conditions rather than a complete spectral criterion.
- The problem is *distinct from* Problem 9 (Reduction criterion implies majorization), since here only the spectrum of $\rho$ — not the spectra of its reductions — enters the criterion.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig, http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166. Problem 15, pp. 48–49 (proposed by E. Knill, 31 Jan 2003; source attribution: Howard Barnum, Leonid Gurvits, E. Knill).
- S. L. Braunstein, C. M. Caves, R. Jozsa, N. Linden, S. Popescu, and R. Schack, *Separability of very noisy mixed states and implications for NMR quantum computing*, Phys. Rev. Lett. **83**, 1054 (1999); arXiv:quant-ph/9908012.
- L. Gurvits and H. Barnum, *Size of the separable neighborhood of the maximally mixed bipartite quantum state*, arXiv:quant-ph/0204159 (2002).
- F. Verstraete, K. Audenaert, and B. De Moor, *Maximally entangled mixed states of two qubits*, Phys. Rev. A **64**, 012316 (2001); (together with T. De Bie) arXiv:quant-ph/0011110 (2000).
- K. Życzkowski, P. Horodecki, A. Sanpera, and M. Lewenstein, *Volume of the set of mixed entangled states*, Phys. Rev. A **58**, 883 (1998); arXiv:quant-ph/9804024.
- N. Johnston, *Separability from spectrum for qubit–qudit states*, Phys. Rev. A **88**, 062330 (2013); arXiv:1309.2006.
- L. Xiong, N.-S. Sze, *Criteria of absolutely separability from spectrum for qudit-qudits states*, arXiv:2408.11684 (2024). Cited as an unaccepted general-resolution claim; see the status discussion.
