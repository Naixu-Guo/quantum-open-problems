# Maximally entangled mixed states

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $\rho$ | Density operator on a bipartite Hilbert space |
| $\mathrm{spec}(\rho)$ | Spectrum (set of eigenvalues with multiplicity) of $\rho$ |
| $E$ | A generic measure of entanglement (a real-valued functional on density operators) |
| $E_F$ | Entanglement of formation |
| $E_R$ | Relative entropy of entanglement |
| $\mathcal{N}$ | Negativity (entanglement measure based on partial transpose) |
| MEMS | Maximally entangled mixed state(s) |
| $S(\rho)$ | Von Neumann entropy $-\mathrm{tr}(\rho \log \rho)$ |
| $\lambda_{\max}(\rho)$ | Largest eigenvalue of $\rho$ |
| Entanglement monotone | Functional non-increasing on average under LOCC |
| LOCC | Local operations and classical communication |

## Background

A maximally entangled pure state of a two-qubit system is unique up to local unitaries — the singlet — and all reasonable measures of entanglement agree that it maximises entanglement. The picture is much more nuanced for mixed two-qubit states. There is no single canonical "most entangled" mixed state; instead, one can fix a spectrum (set of eigenvalues) and ask which density operator with that spectrum has the largest value of a chosen entanglement measure. Verstraete, Audenaert and De Moor (VAM) [quant-ph/0011110] showed in 2000 that for three of the most widely used measures — entanglement of formation, relative entropy of entanglement, and negativity — the answer is the same: among two-qubit states with a given spectrum, the same family of density operators maximises each measure. This coincidence is striking enough that VAM dubbed these operators the "maximally entangled mixed states" (MEMS).

The natural question raised here is whether this coincidence persists for arbitrary entanglement monotones. If so, MEMS would be a robust, measure-independent notion of "the most entangled state at a given spectrum"; if not, the very concept of MEMS would be sensitive to the choice of measure. Obvious related variants generalise the question to higher dimensions and to weaker spectral constraints (e.g., fixing only the largest eigenvalue or fixing the von Neumann entropy).

## Formal statement

Consider density operators on a two-qubit Hilbert space $\mathbf{C}^2 \otimes \mathbf{C}^2$ with a fixed spectrum. Among all such states, look for those maximising a given measure of entanglement. The question is:

For *every* entanglement monotone $E$ on bipartite states, is the set of two-qubit density operators (with fixed spectrum) that maximise $E$ the same family — namely, the VAM "maximally entangled mixed states" — as for entanglement of formation, relative entropy of entanglement, and negativity?

Equivalently: does there exist an entanglement monotone $E$ and a spectrum $(\lambda_1, \ldots, \lambda_4)$ for which the maximiser of $E$ over states with that spectrum differs from the MEMS identified by VAM?

Variants of the question are also posed:

- Replace two qubits by higher-dimensional systems $\mathbf{C}^d \otimes \mathbf{C}^d$ and characterise the maximally entangled states with respect to a given spectrum.
- Replace the spectral constraint by a weaker one — e.g., a fixed largest eigenvalue $\lambda_{\max}(\rho)$, or a fixed von Neumann entropy $S(\rho)$ — and study the corresponding maximisers.

## Status and known progress

**Status: solved negatively.** De Vicente (2024) proved that a universal maximally entangled state at fixed two-qubit spectrum does not always exist. This rules out the conjecture that the VAM state maximises every entanglement monotone.

- For entanglement of formation, relative entropy of entanglement, and negativity on two qubits, with the spectrum held fixed, VAM showed that the maximisers coincide and form a parameterised family of "maximally entangled mixed states" (often referred to as VAM states in the subsequent literature).
- Ishizaka and Hiroshima (Phys. Rev. A **62**, 022310 (2000)) had independently studied a closely related question for two qubits and identified a similar family of maximally entangled mixed states with respect to certain measures.
- Munro–James–White–Kwiat (Phys. Rev. A **64**, 030302 (2001)) considered states maximising negativity subject only to a fixed purity constraint and found a different family ("MJWK states"), illustrating that varying the constraint can give different maximisers.
- **Decisive counterexample (de Vicente, 2024).** For particular rank-two two-qubit spectra, no isospectral state can be converted to every other isospectral state even under non-entangling operations, a class larger than LOCC. Consequently, no one state can maximise every entanglement monotone on those spectra. This directly answers the original universal question in the negative.
- **Extension (Camacho and de Vicente, 2026).** The nonexistence theorem was extended to every rank-two and rank-three two-qubit spectrum and to a large class of full-rank spectra.
- Higher-dimensional and weaker-constraint variants remain separate classification problems. Their open status does not change the negative answer to the quantified statement in the source.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005); DOI 10.48550/arXiv.quant-ph/0504166. Snapshot of the IMaPh open-problems collection, TU Braunschweig (http://www.imaph.tu-bs.de/qi/problems/). Source PDF: *Some Open Problems in Quantum Information Theory.pdf*, Problem 5, p. 25.
- F. Verstraete, K. Audenaert, and B. De Moor, *Maximally entangled mixed states of two qubits*, arXiv:quant-ph/0011110 (2000); Phys. Rev. A **64**, 012316 (2001).
- J. I. de Vicente, *Maximally entangled mixed states for a fixed spectrum do not always exist*, Phys. Rev. Lett. **133**, 050202 (2024); arXiv:2402.05673.
- G. Camacho, J. I. de Vicente, *Nonexistence of maximally entangled mixed states for a fixed spectrum*, Phys. Rev. A **113**, 022416 (2026); arXiv:2511.08285.
