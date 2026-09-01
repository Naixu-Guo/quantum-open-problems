# AI research brief: Secret key from every entangled state

- Record ID: krueger-2005-secret-key-entangled-states
- Record revision (SHA-256): ade1598d4933ddfd1f5a438f384bff4b08a9a2b3054fea127ef3e68fb02e829c
- Formal statement digest (SHA-256): b17ddafd9f886de605c0903bc9f045882acdcc9af3b1aa2bf4f84fc9770f01ce
- Status: Open
- Field: Quantum information
- Topic: Entanglement theory
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-secret-key-entangled-states/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-secret-key-entangled-states.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Secret+key+from+every+entangled+state

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: p. 64 (Problem 24)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The answer decides whether entanglement and cryptographic usefulness have the same zero boundary. A zero-key entangled state would separate the two resources.

## Notation

| Symbol | Meaning |
|---|---|
| $\mathcal{H}_A,\mathcal{H}_B$ | Hilbert spaces of Alice and Bob in a bipartite quantum system |
| $\rho_{AB}$ | A bipartite quantum state (density operator on $\mathcal{H}_A\otimes\mathcal{H}_B$) |
| LOCC | Local operations and classical communication |
| Entangled state | A bipartite state that is not separable, i.e. not a convex combination of product states |
| PPT | Positive partial transpose (a property used to detect/define bound entanglement) |
| Bound entangled state | An entangled state from which no pure entanglement (singlets) can be distilled by LOCC |
| Secret key | A pair of perfectly correlated classical bits held by Alice and Bob and uncorrelated with any eavesdropper Eve |
| $K_D(\rho_{AB})$ | The distillable secret-key rate of $\rho_{AB}$ (bits of secret key extractable per copy by LOCC + public discussion, asymptotically and in the worst case over purifications to Eve) |
| $E_D(\rho_{AB})$ | The distillable entanglement of $\rho_{AB}$ |

## Formal statement

Let $\rho_{AB}$ be any entangled bipartite quantum state on a finite-dimensional Hilbert space $\mathcal{H}_A\otimes\mathcal{H}_B$. Decide whether
$$K_D(\rho_{AB}) \;>\; 0 \qquad \text{for every entangled } \rho_{AB} ,$$
i.e. whether secret keys can be generated from every bipartite entangled state by LOCC plus public classical communication (with eavesdropper holding the purifying system).

## Exact unresolved remainder

Prove that every entangled bipartite state has positive distillable key, or exhibit an entangled state with zero distillable key.

## Checked progress

### 2026-05-06: Current key-cost theory still treats zero-key entanglement as unresolved

- Evidence: Peer reviewed; Current status evidence
- Finding: The peer-reviewed analysis states its conclusions conditionally on whether entangled states with zero distillable key exist.
- Source: https://quantum-journal.org/papers/q-2026-05-06-2098/

### 2003-09-12: Some PPT bound-entangled states contain secret key

- Evidence: Peer reviewed; Exact positive subclass
- Finding: Horodecki and collaborators construct bound-entangled states with positive distillable key, a major positive subclass that does not settle the universal quantifier.
- Source: https://arxiv.org/abs/quant-ph/0309110

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
