# AI research brief: Mutually unbiased bases in dimension six

- Record ID: horodecki-2020-mubs-dimension-six
- Record revision (SHA-256): d767330bb8f19b123905c1d58f53513f40d5cc1eeac9533a562eb27713399b85
- Formal statement digest (SHA-256): a7c9f4f16b9a8be2f0b8204f4facca05419740decb5e078f337ebaa654b6a4e0
- Status: Open
- Field: Quantum information
- Topic: Quantum designs
- Collection: Horodecki
- Verified: 2026-08-12
- Catalog entry: https://naixu-guo.github.io/quantum-open-problems/problems/horodecki-2020-mubs-dimension-six/
- JSON record: https://naixu-guo.github.io/quantum-open-problems/api/v1/problems/horodecki-2020-mubs-dimension-six.json
- Propose an update: https://github.com/Naixu-Guo/quantum-open-problems/issues/new?template=research-update.yml&title=%5BResearch+update%5D+Mutually+unbiased+bases+in+dimension+six

## Problem source

- Relationship: The source states the cataloged problem.
- Title: Five open problems in theory of quantum information
- Authors: Paweł Horodecki, Łukasz Rudnicki, Karol Życzkowski
- Venue: PRX Quantum 3, 010101 (2022); arXiv:2002.03233 [quant-ph]
- Statement locator: p. 3-4 (Problem 2)
- Read source: https://doi.org/10.1103/PRXQuantum.3.010101

## Why it matters

Dimension six is the smallest case where the prime-power construction fails. A solution would clarify how finite geometry controls complementary quantum measurements.

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | Dimension of a complex Hilbert space |
| $\mathcal{H}_N$ | $N$-dimensional complex Hilbert space |
| $\mathcal{H}_6$ | $6$-dimensional complex Hilbert space |
| $K$ | Number of mutually unbiased bases under consideration |
| $\lvert\psi_i^m\rangle$ | The $i$-th vector of the $m$-th basis, with $1\leq m\leq K$ and $1\leq i\leq N$ |
| $\langle\psi_i^m\vert\psi_j^n\rangle$ | Inner product between basis vectors |
| $\delta_{ij}$ | Kronecker delta |
| $U_{ij}$ | Entry $(i,j)$ of a unitary that relates two unbiased bases; $\lvert U_{ij}\rvert^2=1/N$ |
| $p, k$ | Prime and positive integer (used in writing $N=p^k$) |
| $p_1^{k_1}\cdots p_m^{k_m}$ | Prime factorization of a composite dimension |

## Formal statement

**Problem 2:** *Construct a set of at least 4 mutually unbiased bases in dimension six or prove that there are no 7 MUBs in $\mathcal{H}_6$.*

Setup: Consider a set of $K$ orthonormal bases $\{\lvert\psi_i^m\rangle\}$ ($1\leq m\leq K$, $1\leq i\leq N$) of $\mathcal{H}_N$, so that all vectors in each basis are orthogonal: $\langle\psi_i^m|\psi_j^m\rangle=\delta_{ij}$. The bases are called pairwise mutually unbiased if for every two of them
$$\forall_{i,j}\quad |\langle\psi_i^m|\psi_j^n\rangle|^2 = \frac{1}{N},\qquad m\neq n.$$
For $N=6$ it is known that at most seven such bases can exist. The task is either to exhibit a quadruple (or larger collection) of mutually unbiased bases in $\mathcal{H}_6$, or to prove that no complete set of seven MUBs in $\mathcal{H}_6$ exists.

## Exact unresolved remainder

Construct at least four MUBs in dimension six, or prove that a complete set of seven cannot exist.

## Checked progress

### 2026-04-01: Peer-reviewed composite-dimension review keeps the case open

- Evidence: Peer reviewed; Status review
- Finding: McNulty and Weigert report that dimension six still has only three known MUBs and no accepted impossibility proof.
- Source: https://doi.org/10.22331/q-2026-04-01-2051

### 2026-01-22: Claimed proof excluding seven MUBs is not accepted

- Evidence: Preprint; Unaccepted claim
- Finding: Joka's v3 preprint loses phase and projector data in its moment-map step, then uses that missing structure in an unsupported reduction argument.
- Source: https://arxiv.org/abs/2511.03537

### 2025-04-17: Comment identifies an error in an earlier structural lemma

- Evidence: Peer reviewed; Proof correction
- Finding: The peer-reviewed Comment invalidates support for three dependent theorems. A Reply salvages restricted statements, not the MUB existence problem.
- Source: https://arxiv.org/abs/2504.13067

## Scope and cautions

- Recent claim: Do not treat arXiv:2511.03537 as a solution. Its proof gaps are substantive, and the later peer-reviewed review still lists the problem as open. (https://arxiv.org/abs/2511.03537)

## Research protocol

1. Restate the target and its hypotheses before starting the analysis.
2. Match each claimed result against the statement's quantifiers and domain.
3. Label proofs, computations, numerical evidence, and conjectural steps separately.
4. Cite primary sources with theorem, page, equation, or version locators when available.
5. Record failed routes when they rule out a reusable approach.

## Requested output

Return a candidate result, its exact scope, the supporting argument or artifact, primary-source links, and any remaining gap. Propose a status change only when the result settles the formal statement or a named subproblem.
