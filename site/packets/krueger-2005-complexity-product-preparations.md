# AI research brief: Complexity of product preparations

- Record ID: krueger-2005-complexity-product-preparations
- Record revision (SHA-256): 696f49146182ed87d0365d1af35ca45baf5d2fde6fcaeeaa783f8d2081573eda
- Formal statement digest (SHA-256): 4acb313cb6f1b572d00ddad662e1104fee42dcdb741ac70267da14380f3cd2a0
- Status: Open
- Field: Quantum information
- Topic: Quantum complexity
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-complexity-product-preparations/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-complexity-product-preparations.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Complexity+of+product+preparations

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 50 (Problem 16)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The answer decides whether state-preparation complexity is extensive or whether a collective circuit can amortize the cost of producing repeated quantum resources.

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

## Formal statement

Fix a state $\lvert\psi\rangle$ of $m$ qubits and the gate set
$$\mathcal{G} = \{\, e^{i\phi\sigma_u} : \phi \in \mathbb{R},\ \sigma_u\text{ a tensor product of Pauli matrices}\,\}.$$
For a target pure state $\lvert\Psi\rangle$, let
$$C(\lvert\Psi\rangle)=\inf\left\{\sum_j|\phi_j|:\prod_j e^{i\phi_j\sigma_{u_j}}\lvert0\rangle^{\otimes(\text{number of qubits})}=\lvert\Psi\rangle\right\}.$$

Determine, as a function of $n$ and $C(\lvert\psi\rangle)$, the asymptotic behaviour of
$$C\!\bigl(\lvert\psi\rangle^{\otimes n}\bigr).$$
In particular, is the cost per copy $C(\lvert\psi\rangle^{\otimes n})/n$ bounded above by a function strictly smaller than $C(\lvert\psi\rangle)$ as $n \to \infty$?

An approximate version is also of interest: for a tolerance $\varepsilon > 0$, characterize the minimum weighted rotation cost needed to produce a state $\lvert\Phi\rangle$ with $\lvert\langle\Phi\,\vert\,\psi^{\otimes n}\rangle\rvert^2 \ge 1 - \varepsilon$.

## Exact unresolved remainder

Determine the scaling of the weighted rotation cost for many copies and whether collective preparation gives a strict asymptotic saving per copy.

## Checked progress

### 2005-04-21: The archived weighted-cost problem remains unresolved

- Evidence: Archived source; Open formulation
- Finding: The cost is the infimum of the sum of absolute rotation angles. Modern Clifford-plus-T gate counts use a different resource measure.
- Source: https://arxiv.org/abs/quant-ph/0504166

## Scope and cautions

- Interpretation: Do not substitute gate count for the source's weighted continuous-angle cost.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
