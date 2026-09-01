# AI research brief: Kashaev volume conjecture for hyperbolic knots

- Record ID: theoremdb-p3114-kashaev-volume-conjecture
- Record revision (SHA-256): b1d04ae357c94df359859925e152c0330052f6964aa7c015fc33bebb5548bf9a
- Formal statement digest (SHA-256): 68efefcb7a0d2174d7361e1ef6419aec49679ce23efbe2cae36ba3c649725a32
- Status: Open
- Field: Quantum topology
- Topic: Quantum knot invariants
- Collection: TheoremDB
- Verified: 2026-08-31
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/theoremdb-p3114-kashaev-volume-conjecture/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/theoremdb-p3114-kashaev-volume-conjecture.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Kashaev+volume+conjecture+for+hyperbolic+knots

## Problem source

- Relationship: The source states the cataloged problem.
- Title: The Hyperbolic Volume of Knots from the Quantum Dilogarithm
- Authors: Rinat M. Kashaev
- Venue: Letters in Mathematical Physics 39, 269-275 (1997)
- Statement locator: Sec. 1, Eq. (1.1)
- Read source: https://doi.org/10.1023/A:1007364912784

## Why it matters

The conjecture would let quantum knot invariants recover a geometric quantity of the knot complement. It links representation-theoretic data to three-dimensional hyperbolic geometry.

## Formal statement

Let $K\subset S^3$ be a hyperbolic knot and let $\langle K\rangle_N$ be Kashaev's $N$th invariant. Prove that the limit exists and satisfies
$$
\lim_{N\to\infty}\frac{2\pi}{N}\log\left|\langle K\rangle_N\right|
=\operatorname{Vol}(S^3\setminus K).
$$

A counterexample must give a hyperbolic knot for which the limit fails to exist or differs from the hyperbolic volume.

## Exact unresolved remainder

Prove the volume-limit identity for every hyperbolic knot, or give a hyperbolic knot for which the limit fails or has the wrong value.

## Checked progress

### 2026-08-01: The universal hyperbolic-knot statement remains open

- Evidence: Reviewed database record; Dated status audit
- Finding: TheoremDB's dated review found proofs for selected knots and families but no proof or counterexample for every hyperbolic knot.
- Source: https://www.theoremdb.org/statements/P3114/

### 2001: Colored Jones polynomials give an equivalent formulation

- Evidence: Peer reviewed; Equivalent formulation
- Finding: Murakami and Murakami identify Kashaev's invariant with a root-of-unity specialization of the colored Jones polynomial and state the volume conjecture in that language.
- Source: https://doi.org/10.1007/BF02392716

## Scope and cautions

- Provenance: TheoremDB P3114 records Kashaev's universal hyperbolic-knot conjecture and cites the original papers.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
