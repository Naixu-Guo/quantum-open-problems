# Complexity of product preparations

> **Audit status (2026-08-12): OPEN**

## Notation

| Symbol | Meaning |
|---|---|
| $\lvert\psi\rangle$ | A pure quantum state of $m$ qubits |
| $\lvert\phi\rangle$ | An $m$-qubit "starting" state, taken to be $\lvert 0\rangle^{\otimes m}$ in this problem |
| $m$ | Number of qubits per copy of the state $\lvert\psi\rangle$ |
| $n$ | Number of identical copies of $\lvert\psi\rangle$ that are to be prepared |
| $\lvert\psi\rangle^{\otimes n}$ | The $n$-fold tensor product $\lvert\psi\rangle\otimes\cdots\otimes\lvert\psi\rangle$ ($n$ factors) |
| $\sigma_u$ | A tensor product of Pauli matrices acting on (some subset of) the $m$ qubits |
| $e^{i\phi\sigma_u}$ | One of the allowed gates: an exponential of a Pauli string with a real phase $\phi$ |
| $C(\lvert\Psi\rangle)$ | Infimum of the weighted rotation cost $\sum_j|\phi_j|$ over preparations of $\lvert\Psi\rangle$ from the reference state |
| $\varepsilon$ | Optional approximation parameter (target fidelity / accuracy of preparation) |

## Background

The source uses a continuous weighted rotation cost, not ordinary gate count. An allowed gate $e^{i\phi\sigma_u}$ costs $|\phi|$, and a product of such gates costs the sum of the absolute rotation angles. The question asks whether collective preparation of many identical copies can lower this cost per copy.

The natural physical motivation comes from quantum simulation and quantum metrology, where one routinely needs $n$ copies of a probe state in order to estimate a parameter to fixed accuracy. If one already knows the classical description of $\lvert\psi\rangle$, then producing $n$ copies of it is, in principle, a deterministic preparation task and not a learning task; nevertheless the gate cost of the cheapest circuit producing $\lvert\psi\rangle^{\otimes n}$ from $\lvert 0\rangle^{\otimes nm}$ is not understood in general.

A connection to the literature on optimal quantum cloning is suggested by the remark in the source: if one is allowed to clone $\lvert\psi\rangle$ approximately, then the asymptotic cost of producing nearly-identical copies might be much smaller than the cost of preparing one perfect copy and copying it exactly (which is forbidden by no-cloning). The problem also admits an approximate variant in which one only requires the output to be $\varepsilon$-close to $\lvert\psi\rangle^{\otimes n}$.

The gate set fixed by Knill consists of rotations $e^{i\phi\sigma_u}$ where $\sigma_u$ is a product of Pauli matrices. A rotation has cost $|\phi|$.

## Formal statement

Fix a state $\lvert\psi\rangle$ of $m$ qubits and the gate set
$$\mathcal{G} = \{\, e^{i\phi\sigma_u} : \phi \in \mathbb{R},\ \sigma_u\text{ a tensor product of Pauli matrices}\,\}.$$
For a target pure state $\lvert\Psi\rangle$, let
$$C(\lvert\Psi\rangle)=\inf\left\{\sum_j|\phi_j|:\prod_j e^{i\phi_j\sigma_{u_j}}\lvert0\rangle^{\otimes(\text{number of qubits})}=\lvert\Psi\rangle\right\}.$$

Determine, as a function of $n$ and $C(\lvert\psi\rangle)$, the asymptotic behaviour of
$$C\!\bigl(\lvert\psi\rangle^{\otimes n}\bigr).$$
In particular, is the cost per copy $C(\lvert\psi\rangle^{\otimes n})/n$ bounded above by a function strictly smaller than $C(\lvert\psi\rangle)$ as $n \to \infty$?

An approximate version is also of interest: for a tolerance $\varepsilon > 0$, characterize the minimum weighted rotation cost needed to produce a state $\lvert\Phi\rangle$ with $\lvert\langle\Phi\,\vert\,\psi^{\otimes n}\rangle\rvert^2 \ge 1 - \varepsilon$.

## Status and known progress

The problem as posed in 2003 by E. Knill (with Gerardo Ortiz and Rolando Somma) was open at the time of the IMaPh snapshot and no general resolution is recorded in the source. The hint pointed to in the "Remark" of the source — that approximate cloning of $\lvert\psi\rangle$, given that one already knows $\lvert\psi\rangle$, may be cheaper than preparing it from scratch — suggests that techniques from the literature on optimal universal quantum cloning may give nontrivial upper bounds on $C(\lvert\psi\rangle^{\otimes n})$ for large $n$. No closed-form asymptotic formula relating $C(\lvert\psi\rangle^{\otimes n})$ to $n$ and $C(\lvert\psi\rangle)$ appears in the source, and no resolution is cited.

Work on Clifford+T counts, Solovay–Kitaev synthesis and quantum signal processing uses different resource measures and does not settle this weighted Pauli-rotation problem. No general asymptotic formula, or proof of a strict collective per-copy saving, is known.

**Last verified:** 2026-08-12.

## Bibliography

- O. Krüger and R. F. Werner (eds.), *Some Open Problems in Quantum Information Theory*, arXiv:quant-ph/0504166 (2005), Problem 16 on p. 50; snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/. DOI: 10.48550/arXiv.quant-ph/0504166.
- Problem proposed by E. Knill (with G. Ortiz and R. Somma), 31 January 2003.
- For background on optimal quantum cloning, see e.g. V. Scarani, S. Iblisdir, N. Gisin, A. Acín, *Quantum cloning*, Rev. Mod. Phys. 77, 1225 (2005), arXiv:quant-ph/0511088.
