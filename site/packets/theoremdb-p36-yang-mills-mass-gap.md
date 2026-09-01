# AI research brief: Yang-Mills existence and mass gap

- Record ID: theoremdb-p36-yang-mills-mass-gap
- Record revision (SHA-256): d53f8cef2101486d399a378e036cfe581269d432421139685c8ab7486a522133
- Formal statement digest (SHA-256): 4c062770677148730a2c49f3fe6f5ae3949c7a54250730fc11d6afb5bddebce0
- Status: Open
- Field: Quantum field theory
- Topic: Quantum Yang–Mills theory
- Collection: TheoremDB
- Verified: 2026-08-31
- Catalog entry: https://naixu-guo.github.io/quantum-information-open-problems/problems/theoremdb-p36-yang-mills-mass-gap/
- JSON record: https://naixu-guo.github.io/quantum-information-open-problems/api/v1/problems/theoremdb-p36-yang-mills-mass-gap.json
- Propose an update: https://github.com/Naixu-Guo/quantum-information-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Yang-Mills+existence+and+mass+gap

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Quantum Yang-Mills Theory
- Authors: Arthur Jaffe, Edward Witten
- Venue: Clay Mathematics Institute Millennium Prize Problem
- Statement locator: Sec. 4, ‘The Problem’ in the official Jaffe-Witten statement
- Read source: https://www.claymath.org/wp-content/uploads/2022/06/yangmills.pdf

## Why it matters

The problem asks mathematics to construct the four-dimensional quantum gauge theory used in particle physics and derive its positive particle-mass scale from the axioms.

## Formal statement

For each compact simple gauge group $G$, construct a nontrivial quantum Yang-Mills theory on $\mathbb R^4$ that satisfies axioms at least as strong as those in the official Jaffe-Witten formulation and agrees with the classical Yang-Mills theory in the required sense.

Let $H$ be the Hamiltonian of the reconstructed quantum theory and let the vacuum energy be zero. Prove that there is a constant $\Delta>0$ such that
$$
\operatorname{spec}(H)\cap(0,\Delta)=\varnothing.
$$

A complete solution must establish both the quantum theory and the positive mass gap for the gauge groups and axioms in the official statement.

## Exact unresolved remainder

Construct the theory on four-dimensional Euclidean space for every compact simple gauge group under the official axioms and prove a positive mass gap.

## Checked progress

### 2026-08-31: Clay continues to list the problem as unsolved

- Evidence: Official status page; Authoritative open status
- Finding: The official Clay page says that experiments and simulations support a mass gap but no proof meeting the mathematical problem is known.
- Source: https://www.claymath.org/millennium/yang-mills-the-maths-gap/

### 2026-06-09: A new preprint claims a four-dimensional construction

- Evidence: Preprint; Unverified resolution claim
- Finding: Faizal and Shabir claim a reflection-positive SU(N) continuum construction with a mass gap. The paper is unrefereed, and the official problem remains listed as unsolved.
- Source: https://arxiv.org/abs/2606.19362

## Scope and cautions

- Unreviewed claim: Do not mark the problem solved from arXiv:2606.19362. The claim has not passed journal or Clay review, and its SU(N) scope must be checked against the full official statement. (https://arxiv.org/abs/2606.19362)
- Provenance: TheoremDB P36 restates the official Clay Mathematics Institute Millennium Prize problem.

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
