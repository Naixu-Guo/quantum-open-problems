# Qubit bi-negativity

## Background

Negativity-based entanglement measures sit at the heart of the resource theory of mixed-state entanglement, because they can actually be computed: the partial transpose is a simple linear map, its eigenvalues are accessible numerically, and the resulting quantities (negativity, logarithmic negativity) are entanglement monotones under local operations and classical communication.

Beyond the negativity itself, several monotones involve more elaborate "second-order" combinations of partial transposes. Audenaert, De Moor, Vollbrecht and Werner (AMVW02), in their study of the asymptotic relative entropy of entanglement for orthogonally invariant states, introduced the operator
$$\bigl\lvert\sigma^{T_2}\bigr\rvert^{T_2},$$
the partial transpose of the operator absolute value of the partial transpose of $\sigma$. The positivity of this operator, called the *bi-negativity* condition, is closely related to additivity of logarithmic negativity on tensor products and to the structure of PPT entanglement measures.

For general bipartite systems the operator $\lvert\sigma^{T_2}\rvert^{T_2}$ need not be positive — it can have small negative eigenvalues. However, when both subsystems are qubits ($2\times 2$ systems) the available numerical and analytical evidence suggests that positivity always holds. The "qubit bi-negativity conjecture" of AMVW02 asserts exactly this: for every two-qubit density operator the partially transposed absolute value of the partial transpose is positive. A proof would simplify the structure of negativity-based entanglement quantities in the simplest interesting bipartite regime and would have consequences for additivity of the logarithmic negativity on two-qubit pairs.

## Status and known progress

**Status: solved affirmatively.** Ishizaka proved the conjecture for every two-qubit state in 2003, with the peer-reviewed version appearing in 2004.

- Ishizaka used the fact that an entangled two-qubit partial transpose has exactly one negative eigenvalue and proved that the second partial transpose of its absolute value is positive semidefinite. This is exactly the operator inequality in the formal statement.
- As consequences, the paper identifies the PPT entanglement cost of every two-qubit state with its logarithmic negativity and derives related bounds involving the asymptotic relative entropy of entanglement and the Rains bound.
- The conclusion is specific to two qubits. Analogous positivity fails in higher dimensions, but that does not affect the source problem.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 18 on p. 53; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- [AMVW02] K. Audenaert, B. De Moor, K. G. H. Vollbrecht, R. F. Werner, *Asymptotic Relative Entropy of Entanglement for Orthogonally Invariant States*, Phys. Rev. A 66, 032310 (2002); arXiv:quant-ph/0204143.
- For the closely related additivity question, see also K. Audenaert, M. B. Plenio, J. Eisert, *Entanglement cost under positive-partial-transpose-preserving operations*, Phys. Rev. Lett. 90, 027901 (2003); arXiv:quant-ph/0207146.
- S. Ishizaka, *Binegativity and geometry of entangled states in two qubits*, Phys. Rev. A **69**, 020301(R) (2004); arXiv:quant-ph/0308056.
