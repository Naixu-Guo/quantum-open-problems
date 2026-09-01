# AI research brief: Two-qubit relative entropy of entanglement

- Record ID: krueger-2005-qubit-relative-entropy-entanglement
- Record revision (SHA-256): 2613af73723e5a2471bdbf4cb7a65618b4d9fd7091b962bab29eac80aff0109d
- Formal statement digest (SHA-256): af4762c4be566a4ac7e6b74ec69ab6191f72092f45937b82370420369c71affc
- Status: Open
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-qubit-relative-entropy-entanglement/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-qubit-relative-entropy-entanglement.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Two-qubit+relative+entropy+of+entanglement

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 30-31 (Problem 8)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

Two qubits form the smallest mixed-state entanglement problem, yet this distance-based measure lacks a direct formula there. A solution would make the measure computable without a convex optimization.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}$ | Finite-dimensional complex Hilbert space |
| $\mathbb{C}^2 \otimes \mathbb{C}^2$ | Two-qubit Hilbert space |
| $\rho$ | Density operator (state) on a bipartite Hilbert space |
| $\sigma$ | Density operator in the reference convex set $D$ |
| $D$ | Convex set of separable states, or convex set of states with positive partial transpose (PPT) |
| $S(\rho \Vert \sigma)$ | Quantum relative entropy, $\mathrm{Tr}(\rho \log \rho) - \mathrm{Tr}(\rho \log \sigma)$ |
| $E_R(\rho)$ | Relative entropy of entanglement of $\rho$ with respect to $D$ |
| $E_F(\rho)$ | Entanglement of formation |
| $\mathrm{PPT}$ | Positive partial transpose |
| $\inf$ | Infimum |
| $\partial D$ | Topological boundary of $D$ in the state space |

## Formal statement

For a bipartite state $\rho$, define
$$E_R(\rho) \;=\; \inf_{\sigma \in D} S(\rho \,\|\, \sigma),$$
where $D$ is either the set of separable states or the set of states with positive partial transpose, and $S(\rho \,\|\, \sigma) = \mathrm{Tr}(\rho \log \rho) - \mathrm{Tr}(\rho \log \sigma)$ is the quantum relative entropy.

**Problem.** Find a closed-form expression for $E_R(\rho)$ for every state $\rho$ on the two-qubit Hilbert space $\mathbb{C}^2 \otimes \mathbb{C}^2$, with respect to either of the convex sets $D$ above.

## Exact unresolved remainder

Find a closed expression that maps an arbitrary two-qubit density matrix to its relative entropy of entanglement.

## Checked progress

### 2008-10-15: The inverse closest-state problem is solved

- Evidence: Peer reviewed; Exact inverse solution
- Finding: Miranowicz and Ishizaka construct entangled states from a prescribed closest separable state and solve special families, but not the forward problem for arbitrary input states.
- Source: https://arxiv.org/abs/0805.3134

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
