# AI research brief: Reversible entanglement manipulation

- Record ID: krueger-2005-reversible-entanglement-manipulation
- Record revision (SHA-256): ac70eb5513ec3d58674c7a69b15cadec09fa95dd9446daa1e5176c857017f678
- Formal statement digest (SHA-256): aa17c9dd4d706ce6936db709ab0a87f86bdc077b4193df993e55d82ea45379d0
- Status: Partially solved
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-reversible-entanglement-manipulation/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-reversible-entanglement-manipulation.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Reversible+entanglement+manipulation

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 55-56 (Problem 20)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

A reversible class would give mixed-state entanglement a single exchange rate analogous to entropy for pure states. Its operation set would mark the cost of removing irreversibility.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A\otimes\mathcal{H}_B$ | Bipartite Hilbert space for parties $A$ and $B$ |
| $\rho$ | A bipartite density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$ |
| LOCC | The class of local operations and classical communication (the standard free operations of bipartite entanglement) |
| PPT operations | Completely positive maps that preserve the set of PPT (positive partial transpose) states |
| Hyper-set | A class of operations introduced in [HOH02], strictly larger than LOCC and strictly smaller than PPT operations |
| $\lvert\Phi^+\rangle$ | The maximally entangled (singlet) state of two qubits |
| $E_{\mathrm{D}}(\rho)$ | Distillable entanglement of $\rho$ under a given class of operations |
| $E_{\mathrm{C}}(\rho)$ | Entanglement cost of $\rho$ under a given class of operations |
| Asymptotic reversibility | The condition $E_{\mathrm{D}}(\rho) = E_{\mathrm{C}}(\rho)$ for every $\rho$, under a fixed class of operations |
| $n$ | Number of i.i.d. copies of $\rho$ used in the asymptotic conversion |

## Formal statement

Two open questions stated in the source:

(Q1) **Are PPT operations sufficient for asymptotic reversibility?** Is it the case that, for every bipartite density operator $\rho$ (pure or mixed), the distillable entanglement and the entanglement cost under PPT operations coincide,
$$E_{\mathrm{D}}^{\,\mathrm{PPT}}(\rho) \;=\; E_{\mathrm{C}}^{\,\mathrm{PPT}}(\rho)\,?$$
This is the conjecture known in some circles as the "Big-Fat-Conjecture" ([BFC]).

(Q2) **The smallest reversible class.** What is the smallest non-trivial class of operations $\mathcal{O}$ (containing LOCC) such that asymptotic interconversion of *all* bipartite entangled states — pure and mixed — is reversible under $\mathcal{O}$?

Both questions seek a single asymptotic entanglement measure that would play the role of entropy in a thermodynamics of entanglement.

## Exact unresolved remainder

Identify the smallest physically meaningful class of operations that makes asymptotic mixed-state entanglement manipulation reversible.

## Checked progress

### 2023-01-20: Exact non-entangling maps remain irreversible

- Evidence: Peer reviewed; Exact no-go theorem
- Finding: Lami and Regula prove a separation between entanglement cost and distillation even under operations that generate no entanglement exactly.
- Source: https://arxiv.org/abs/2111.02438

### 2017-10-06: PPT-assisted universal reversibility is refuted

- Evidence: Peer reviewed; Exact counterexample
- Finding: Wang and Duan exhibit states whose PPT entanglement cost exceeds PPT distillable entanglement.
- Source: https://arxiv.org/abs/1606.09421

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
