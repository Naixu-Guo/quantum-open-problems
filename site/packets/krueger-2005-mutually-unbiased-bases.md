# AI research brief: Mutually unbiased bases in general dimensions

- Record ID: krueger-2005-mutually-unbiased-bases
- Record revision (SHA-256): e46fbc8423adddad4c87955e07ec4ced9c22c436cd1670b5ccacd444e0d845ec
- Formal statement digest (SHA-256): 6f4ea34d63cfff702c8f4ba68306ed6c371565b4d52124c13a201af7ec126184
- Status: Open
- Field: Quantum information
- Topic: Quantum designs
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/krueger-2005-mutually-unbiased-bases/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/krueger-2005-mutually-unbiased-bases.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Mutually+unbiased+bases+in+general+dimensions

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 43-45 (Problem 13)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

MUBs supply complementary measurements for tomography and uncertainty relations. Their existence pattern also tests how far finite-field constructions extend into composite dimensions.

## Notation

| Symbol | Meaning |
|---|---|
| $D$ | Dimension of the complex Hilbert space, $D \geq 2$ |
| $\mathbb{C}^D$ | Complex $D$-dimensional Hilbert space |
| $K$ | Number of orthonormal bases under consideration |
| $\{e_i^k\}_{i=1}^D$ | Orthonormal basis indexed by $k$ ($k = 1, \ldots, K$), with the $i$th vector denoted $e_i^k$ |
| $\langle e_i^k, e_j^n\rangle$ | Inner product between basis vectors from bases $k$ and $n$ |
| $\lvert\cdot\rvert$ | Absolute value |
| MUB | Mutually unbiased bases |
| $\sigma_x, \sigma_y, \sigma_z$ | Pauli matrices (the three MUBs in dimension $D = 2$) |

## Formal statement

Let $D \geq 2$ be an integer. Determine
$$N(D) \;=\; \max\bigl\{ K \,:\, \text{there exist } K \text{ pairwise mutually unbiased orthonormal bases in } \mathbb{C}^D \bigr\},$$
where two orthonormal bases $\{e_i^k\}_{i=1}^D$ and $\{e_j^n\}_{j=1}^D$ ($k \neq n$) are *mutually unbiased* iff
$$\bigl|\langle e_i^k,\, e_j^n\rangle\bigr| \;=\; D^{-1/2} \qquad \text{for all } i, j \in \{1, \ldots, D\}.$$

It is known that $N(D) \leq D + 1$ always, with equality whenever $D$ is the power of a prime. The problem is to determine $N(D)$ for non-prime-power $D$.

**Special case (smallest open instance).** Decide whether $N(6) = 7$, i.e. whether there exist $K = 7$ mutually unbiased bases in $D = 6$ dimensions.

## Exact unresolved remainder

Determine the maximum number of MUBs in non-prime-power dimensions, beginning with dimension six.

## Checked progress

### 2026-04-01: Current review confirms the composite-dimension gap

- Evidence: Peer reviewed; Status review
- Finding: The peer-reviewed review records no general formula and keeps dimension six open.
- Source: https://doi.org/10.22331/q-2026-04-01-2051

### 2026-01-22: A dimension-six impossibility claim is not accepted

- Evidence: Preprint; Unaccepted claim
- Finding: The claimed MUB-to-Latin-square reduction loses essential phase and projector structure and does not establish the advertised result.
- Source: https://arxiv.org/abs/2511.03537

## Scope and cautions

- Recent claim: The 2025-2026 dimension-six claim does not supply an accepted solution to the general MUB problem. (https://arxiv.org/abs/2511.03537)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
