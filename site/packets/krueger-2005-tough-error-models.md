# AI research brief: Tough error models

- Record ID: krueger-2005-tough-error-models
- Record revision (SHA-256): c7e9bd1136186587ed3269d4c99ab7bbbfa6b13f77f596cace8011da2f0759a2
- Formal statement digest (SHA-256): 9d46c0640b48cefecab6c0d8f9cd893d99c341d9286bb0867c45e43f7e805bfe
- Status: Open
- Field: Quantum information
- Topic: Quantum error correction
- Collection: Krueger–Werner
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/krueger-2005-tough-error-models/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/krueger-2005-tough-error-models.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Tough+error+models

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Some open problems in quantum information theory
- Authors: O. Krüger, R. F. Werner
- Venue: arXiv:quant-ph/0504166 (2005); snapshot of the IMaPh open-problems collection, TU Braunschweig — http://www.imaph.tu-bs.de/qi/problems/
- Statement locator: pp. 46-47 (Problem 14)
- Read source: https://doi.org/10.48550/arXiv.quant-ph/0504166

## Why it matters

The function c(e,n) gives the code dimension guaranteed against an arbitrary e-dimensional error space. Closing the gap would establish the worst-case rate available without assuming a noise model.

## Notation

| Symbol | Meaning |
|---|---|
| $H$ | $n$-dimensional complex Hilbert space (data space) |
| $n$ | Dimension of $H$ |
| $E$ | Error model: an $e$-dimensional linear subspace of operators on $H$ |
| $e$ | Dimension of the error model $E$ |
| $C$ | Quantum code: a subspace $C \subseteq H$ |
| $\dim C = c$ | Dimension of the code subspace |
| $P_C$ | Orthogonal projector onto $C$ |
| $A, B$ | Generic operators in $E$ |
| $A^*$ | Adjoint (conjugate transpose) of $A$ |
| $\lambda(A,B)$ | Scalar coefficient appearing in the Knill–Laflamme condition |
| $c(e, n)$ | Largest code dimension guaranteed to exist for every error model of dimension $e$ on $H$ |
| $\lceil x \rceil$ | Ceiling of $x$ |

## Formal statement

Let $H$ be an $n$-dimensional complex Hilbert space and $E \subseteq B(H)$ an $e$-dimensional subspace of operators on $H$ (the *error model*). A subspace $C \subseteq H$ with projector $P_C$ is said to *correct* $E$ if for all $A, B \in E$ there exists a scalar $\lambda(A, B) \in \mathbb{C}$ with
$$P_C \, A^* B \, P_C \;=\; \lambda(A, B)\, P_C.$$

Define
$$c(e, n) \;=\; \max\bigl\{\, c \,:\, \text{for every } e\text{-dimensional } E \subseteq B(H), \text{ there exists a code } C \subseteq H \text{ correcting } E \text{ with } \dim C \geq c \,\bigr\}.$$

**Problem.**
1. Determine (or give the best possible bounds on) $c(e, n)$.
2. Find "tough error models" $E$ for which this bound is (nearly) tight — i.e. error models that admit no code of dimension substantially larger than $c(e, n)$.

## Exact unresolved remainder

Determine the exact asymptotics of c(e,n), or give matching lower bounds and explicit worst-case error models.

## Checked progress

### 1999-08-19: A structure-free lower bound is proved

- Evidence: Peer reviewed; Exact bound
- Finding: Knill, Laflamme and Viola show c(e,n) is greater than n divided by e squared times e squared plus one. No matching construction is known.
- Source: https://arxiv.org/abs/quant-ph/9908066

## Scope and cautions

- Interpretation: The correct denominator is e^2(e^2+1), not e^2(e+1).

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
