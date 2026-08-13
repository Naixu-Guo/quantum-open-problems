# Quantum orthogonal Latin squares of order six (quantum 36 officers of Euler)

> **Audit status (2026-08-12): SOLVED**

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Order of a (quantum) Latin square; here $N=6$ |
| $\mathcal{H}_N$ | $N$-dimensional complex Hilbert space |
| $\mathcal{H}_6$ | $6$-dimensional Hilbert space, the relevant subsystem space |
| $\lvert j\rangle$ | Computational-basis vector of $\mathcal{H}_N$, $j=1,\dots,N$ |
| $\lvert\psi_+\rangle$ | Generalized Bell state on $\mathcal{H}_N\otimes\mathcal{H}_N$ |
| $\otimes$ | Tensor (Kronecker) product |
| $\oplus$ | Direct sum of matrices, also Kronecker sum: $A\oplus B=A\otimes\mathbb{1}+\mathbb{1}\otimes B$ |
| $\mathbb{1}_N$ | $N\times N$ identity matrix |
| $\rho_\ast$ | Maximally mixed state, $\rho_\ast=\mathbb{1}_N/N$ |
| $T_{ijkl}$ | Components of a $4$-index tensor used to encode a $4$-partite pure state |
| $U^{\Gamma}$ | Partial transpose of a unitary $U$ acting on a bipartite system |
| $U^R$ | Reshuffling (realignment) of a bipartite matrix $U$ |
| $\mathcal{U}(36)$ | Group of $36\times 36$ unitary matrices |
| $((4,1,3))_6$ | Quantum error correction code on $4$ subsystems with $1$ logical level and distance $3$ over alphabet of size $6$ |
| AME | Absolutely maximally entangled state |
| OQLS | Orthogonal quantum Latin squares |
| MOLS | Mutually orthogonal Latin squares |

## Background

A classical Latin square of order $N$ is an $N\times N$ array filled with $N$ copies of $N$ symbols such that each symbol appears exactly once per row and once per column. Two Latin squares $A,B$ of order $N$ are orthogonal (forming a Graeco-Latin square) if the $N^2$ ordered pairs $(A_{ij},B_{ij})$ are all distinct. In 1782 Euler asked whether two orthogonal Latin squares of order six exist — equivalently, whether 36 officers of six different ranks from six different regiments can be arranged on a $6\times 6$ parade ground so that each row and each column contains exactly one officer of each rank and each regiment. Euler conjectured the answer was negative; Tarry confirmed this in 1901 by exhaustive enumeration.

A quantum Latin square of order $N$ generalizes this classical object: it is an $N\times N$ array of vectors in $\mathcal{H}_N$ such that each row and each column is an orthonormal basis. Two quantum Latin squares $A$ and $B$ are orthogonal (forming a pair of orthogonal quantum Latin squares, OQLS) if the $N^2$ tensor-product entries $\lvert A_{ij}\rangle\otimes\lvert B_{ij}\rangle\in\mathcal{H}_N\otimes\mathcal{H}_N$ form an orthonormal basis, and moreover for every row (column) the equal-amplitude superposition of the cells is the maximally entangled state. The existence of such a pair in dimension $N$ is equivalent to the existence of an absolutely maximally entangled (AME) state of four $N$-level systems and to the existence of a $2$-unitary matrix in $\mathcal{U}(N^2)$, equivalently to a perfect tensor with four indices each running from $1$ to $N$. Scott (2004) and Huber–Gühne–Siewert (2017) showed that AME states do not exist for four qubits ($N=2$) nor for $m\geq 8$ qubits, and Huber–Wyderka maintain an online catalogue of known AME states. For $N=6$ the existence question was open until very recently.

## Formal statement

**Problem 3:** *Determine whether there exist two quantum orthogonal Latin squares of order six. In other words, find a solution of the problem of $36$ "entangled officers" of Euler or demonstrate that it does not exist.*

Equivalent reformulations established in the source:
- There exists an AME state of four subsystems with six levels each, i.e. a pure state $\lvert\Psi\rangle\in\mathcal{H}_6^{\otimes 4}$ such that every partition of its four parties into two-against-two yields a maximally mixed reduced state $\rho_\ast=\mathbb{1}_{36}/36$.
- The corresponding quantum error-correction code $((4,1,3))_6$ exists.
- There exists a $2$-unitary matrix $U\in\mathcal{U}(36)$ (a unitary of size $36\times 36$ whose partial transpose $U^\Gamma$ and reshuffling $U^R$ are also unitary).
- There exists a perfect tensor $T_{ijkl}$ with four indices each running from $1$ to $6$.

## Status and known progress

**Solved affirmatively.** Rather, Burchardt, Bruzda, Rajchel-Mieldzioć, Lakshminarayan and Życzkowski constructed an exact AME$(4,6)$ state, equivalently a pair of orthogonal quantum Latin squares of order six and a $2$-unitary matrix in $\mathcal U(36)$. Numerical iteration led to the construction, but the published object and its verification are exact and analytic, using golden-ratio amplitudes and roots of unity.

In quantum-code notation, AME$(4,6)$ corresponds to a pure $((4,1,3))_6$ code. The same paper separately constructs a nonadditive $((3,6,2))_6$ code; these are distinct results.

- S. A. Rather, A. Burchardt, W. Bruzda, G. Rajchel-Mieldzioć, A. Lakshminarayan, K. Życzkowski, *Thirty-six entangled officers of Euler: Quantum solution to a classically impossible problem*, Phys. Rev. Lett. 128, 080507 (2022); arXiv:2104.05122 [quant-ph].

Earlier partial results recorded in the source paper:
- No two orthogonal Latin squares of order six exist (Tarry 1901), so the classical 36-officers problem has no solution.
- AME states for four qubits do not exist (Higuchi–Sudbery 2000; Scott 2004).
- For $m=3,4,5,6$ qubits AME states exist (Scott 2004); for $m=7$ qubits, Huber–Gühne–Siewert (2017) proved non-existence; for $m\geq 8$ qubits, AME states do not exist.
- Yu, Simnacher, Wyderka, Nguyen, Gühne (2021) showed that the existence of AME$(4,6)$ is equivalent to bipartite separability of a certain mixed state living in $\mathcal{H}_6^{\otimes 8}$.
- Goyeneche, Raissi, Di Martino, Życzkowski (2018) developed the framework of orthogonal quantum Latin squares.

**Last verified:** 2026-08-12.

## Bibliography

- P. Horodecki, Ł. Rudnicki, K. Życzkowski, *Five open problems in theory of quantum information*, PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]. (Source paper; Problem 3 on p. 4–6.)
- S. A. Rather, A. Burchardt, W. Bruzda, G. Rajchel-Mieldzioć, A. Lakshminarayan, K. Życzkowski, *Thirty-six entangled officers of Euler: Quantum solution to a classically impossible problem*, Phys. Rev. Lett. 128, 080507 (2022); arXiv:2104.05122 [quant-ph]. **Resolves Problem 3 in the affirmative.**
- L. Euler, *Recherches sur une nouvelle espèce de quarres magiques*, (1782).
- G. Tarry, *Le Problème des 36 Officiers*, Compte Rendu de l'Association Française pour l'Avancement des Sciences 2, 170 (1901).
- D. Goyeneche, Z. Raissi, S. Di Martino, K. Życzkowski, *Entanglement and quantum combinatorial designs*, Phys. Rev. A 97, 062326 (2018).
- B. Musto, J. Vicary, *Orthogonality for quantum Latin isometry squares*, EPTCS 287, 253 (2019).
- A. J. Scott, *Multipartite entanglement, quantum-error-correcting codes, and entangling power of quantum evolutions*, Phys. Rev. A 69, 052330 (2004).
- F. Huber, O. Gühne, J. Siewert, *Absolutely maximally entangled states of seven qubits do not exist*, Phys. Rev. Lett. 118, 200502 (2017).
- F. Huber, N. Wyderka, *Table of AME states*, http://www.tp.nt.uni-siegen.de/+fhuber/ame.html.
- A. Higuchi, A. Sudbery, *How entangled can two couples get?*, Phys. Lett. A 272, 213 (2000).
- W. Helwig, W. Cui, J. I. Latorre, A. Riera, H. K. Lo, *Absolute maximal entanglement and quantum secret sharing*, Phys. Rev. A 86, 052335 (2012).
- X.-D. Yu, T. Simnacher, N. Wyderka, H. C. Nguyen, O. Gühne, *Complete hierarchy for the quantum marginal problem*, arXiv:2008.02124.
